import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { io as createSocket } from "socket.io-client";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../theme/AppTheme";
import {
  fetchNote,
  fetchNoteInvites,
  inviteUserToNote,
  removeNoteInvite,
  togglePublicNote,
  updateNote,
} from "../../redux/notesSlice";
import { styles } from "./NoteDetailsStyle";

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

const SOCKET_URL = "http://localhost:3000";
const AUTOSAVE_DELAY = 2000;
const REMOTE_TYPING_TTL = 3500;
const COLLABORATION_COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#ca8a04",
  "#9333ea",
  "#0891b2",
  "#ea580c",
];

const getCollaborationColor = (value = "") => {
  const text = String(value).toLowerCase();
  const hash = [...text].reduce((total, char) => total + char.charCodeAt(0), 0);
  return COLLABORATION_COLORS[hash % COLLABORATION_COLORS.length];
};

const getEditorIdentity = (payload = {}) => {
  const editor = payload.editor ?? {};
  const email = editor.email ?? payload.editor_email ?? "";
  const username = editor.username ?? payload.editor_username ?? "";
  const id = editor.id ?? payload.editor_id ?? email ?? username;

  return {
    id,
    email,
    label: email || username || `User #${id}`,
    color: editor.color || getCollaborationColor(email || username || id),
  };
};

const NoteDetails = ({ navigation, route }) => {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedNote, invites, invitesLoading, loading, error } = useSelector(
    (state) => state.notes
  );
  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);
  const noteId = route.params?.noteId;
  const currentNote =
    selectedNote && String(selectedNote.id) === String(noteId) ? selectedNote : null;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [inviteStatus, setInviteStatus] = useState("");
  const [inviteStatusTone, setInviteStatusTone] = useState("success");
  const [isInviting, setIsInviting] = useState(false);
  const [removingInviteEmail, setRemovingInviteEmail] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [remoteEditors, setRemoteEditors] = useState({});
  const socketRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const isApplyingRemoteRef = useRef(false);
  const lastSavedTitleRef = useRef("");
  const lastSavedContentRef = useRef("");
  const remoteEditorTimersRef = useRef({});
  const isOwner = currentNote
    ? currentNote.is_owner === undefined || Boolean(currentNote.is_owner)
    : false;
  const canEditNote = currentNote ? isOwner || Boolean(currentNote.shared_can_edit) : false;

  useEffect(() => {
    if (noteId) {
      dispatch(fetchNote(noteId));
    }
  }, [dispatch, noteId]);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title ?? "");
      setContent(currentNote.content ?? "");
      setIsPublic(Boolean(currentNote.is_public));
      lastSavedTitleRef.current = currentNote.title ?? "";
      lastSavedContentRef.current = currentNote.content ?? "";
    }
  }, [currentNote]);

  useEffect(() => {
    if (!noteId || !token) return undefined;

    setRemoteEditors({});
    const socket = createSocket(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("shared:join", { noteId });
    });

    socket.on("shared:note-draft", (payload) => {
      if (String(payload.note_id) !== String(noteId)) return;
      if (String(payload.editor_id) === String(currentUser?.id)) return;

      const editor = getEditorIdentity(payload);
      if (remoteEditorTimersRef.current[editor.id]) {
        clearTimeout(remoteEditorTimersRef.current[editor.id]);
      }
      setRemoteEditors((currentEditors) => ({
        ...currentEditors,
        [editor.id]: editor,
      }));
      remoteEditorTimersRef.current[editor.id] = setTimeout(() => {
        setRemoteEditors((currentEditors) => {
          const nextEditors = { ...currentEditors };
          delete nextEditors[editor.id];
          return nextEditors;
        });
        delete remoteEditorTimersRef.current[editor.id];
      }, REMOTE_TYPING_TTL);

      isApplyingRemoteRef.current = true;
      if (payload.title !== undefined) {
        setTitle(payload.title ?? "");
      }
      setContent(payload.content ?? "");
      setSaveStatus(t("note.liveUpdate"));
      requestAnimationFrame(() => {
        isApplyingRemoteRef.current = false;
      });
    });

    socket.on("shared:note-updated", (payload) => {
      if (String(payload.note?.id ?? payload.note_id) !== String(noteId)) return;

      if (payload.action === "access-revoked" || payload.action === "deleted") {
        navigation.navigate("Home");
        return;
      }

      if (payload.note?.content !== undefined) {
        isApplyingRemoteRef.current = true;
        if (payload.note.title !== undefined) {
          setTitle(payload.note.title ?? "");
          lastSavedTitleRef.current = payload.note.title ?? "";
        }
        setContent(payload.note.content ?? "");
        lastSavedContentRef.current = payload.note.content ?? "";
        setSaveStatus(t("note.saved"));
        requestAnimationFrame(() => {
          isApplyingRemoteRef.current = false;
        });
      }
    });

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      Object.values(remoteEditorTimersRef.current).forEach(clearTimeout);
      remoteEditorTimersRef.current = {};
      socket.emit("shared:leave", { noteId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?.id, navigation, noteId, t, token]);

  useEffect(() => {
    if (inviteModalVisible && noteId && isOwner) {
      dispatch(fetchNoteInvites(noteId));
    }
  }, [dispatch, inviteModalVisible, isOwner, noteId]);

  const handleTogglePublic = (value) => {
    if (!isOwner) return;
    setIsPublic(value);
    dispatch(togglePublicNote({ id: noteId, is_public: value }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateNote({ id: noteId, title, content })).unwrap();
      lastSavedTitleRef.current = title;
      lastSavedContentRef.current = content;
      navigation.navigate("Home");
    } catch (_error) {
      // Redux error is rendered in the toolbar.
    }
  };

  const scheduleAutosave = (nextTitle, nextContent) => {
    if (!canEditNote) return;
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setSaveStatus(t("note.editing"));
    autosaveTimerRef.current = setTimeout(async () => {
      const titleChanged = isOwner && nextTitle !== lastSavedTitleRef.current;
      const contentChanged = nextContent !== lastSavedContentRef.current;

      if (!titleChanged && !contentChanged) {
        setSaveStatus(t("note.saved"));
        return;
      }

      setSaveStatus(t("note.saving"));
      try {
        const savedNote = await dispatch(
          updateNote({ id: noteId, title: nextTitle, content: nextContent })
        ).unwrap();
        lastSavedTitleRef.current = savedNote.title ?? nextTitle;
        lastSavedContentRef.current = nextContent;
        setSaveStatus(t("note.saved"));
      } catch (_error) {
        setSaveStatus(t("note.saveFailed"));
      }
    }, AUTOSAVE_DELAY);
  };

  const handleTitleChange = (nextTitle) => {
    setTitle(nextTitle);
    if (isApplyingRemoteRef.current || !isOwner) return;

    socketRef.current?.emit("shared:note-draft", {
      noteId,
      title: nextTitle,
      content,
    });
    scheduleAutosave(nextTitle, content);
  };

  const handleContentChange = (nextContent) => {
    setContent(nextContent);
    if (isApplyingRemoteRef.current || !canEditNote) return;

    socketRef.current?.emit("shared:note-draft", {
      noteId,
      title,
      content: nextContent,
    });
    scheduleAutosave(title, nextContent);
  };

  const handleInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) {
      setInviteStatus(t("note.enterEmail"));
      setInviteStatusTone("error");
      return;
    }

    setIsInviting(true);
    setInviteStatus("");
    try {
      await dispatch(inviteUserToNote({ id: noteId, email, can_edit: canEdit })).unwrap();
      setInviteStatus(t("note.inviteSent"));
      setInviteStatusTone("success");
      setInviteEmail("");
      setCanEdit(false);
      dispatch(fetchNoteInvites(noteId));
    } catch (inviteError) {
      setInviteStatus(inviteError || t("note.inviteFailed"));
      setInviteStatusTone("error");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveInvite = async (email) => {
    setRemovingInviteEmail(email);
    setInviteStatus("");
    try {
      await dispatch(removeNoteInvite({ id: noteId, email })).unwrap();
      setInviteStatus(t("note.guestRemoved"));
      setInviteStatusTone("success");
    } catch (removeError) {
      setInviteStatus(removeError || t("note.removeGuestFailed"));
      setInviteStatusTone("error");
    } finally {
      setRemovingInviteEmail("");
    }
  };

  const activeRemoteEditors = Object.values(remoteEditors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={[
            styles.toolbar,
            {
              backgroundColor: colors.surfaceMuted,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.surfaceSoft }]}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.85}
          >
            <Icon name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.toolbarTitleBlock}>
            <TextInput
              value={title}
              onChangeText={handleTitleChange}
              placeholder={t("note.untitled")}
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.primary}
              editable={isOwner}
              style={[styles.toolbarTitle, { color: colors.textPrimary }]}
            />
            <Text style={[styles.toolbarMeta, { color: colors.textMuted }]}>
              {saveStatus ||
                t("note.lastUpdated", {
                  date: formatDate(currentNote?.updated_at || currentNote?.created_at) || t("note.notSaved"),
                })}
            </Text>
          </View>

          <View style={styles.toolbarActions}>
            <View style={[styles.visibilityPill, { backgroundColor: colors.surfaceSoft }]}>
              <Icon
                name={isPublic ? "earth-outline" : "lock-closed-outline"}
                size={15}
                color={colors.textPrimary}
              />
              <Text style={[styles.visibilityText, { color: colors.textPrimary }]}>
                {isPublic ? t("home.public") : t("home.private")}
              </Text>
              <Switch
                value={isPublic}
                onValueChange={handleTogglePublic}
                disabled={!isOwner}
                trackColor={{ false: colors.trackOff, true: colors.trackOn }}
                thumbColor={colors.surface}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Icon name="checkmark" size={18} color={colors.onPrimary} />
              <Text style={[styles.saveText, { color: colors.onPrimary }]}>{t("common.save")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View style={[styles.errorBar, { backgroundColor: isDark ? "#4A2030" : "#FFE5E5" }]}>
            <Icon name="warning-outline" size={16} color="#ff6b6b" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!isOwner ? (
          <View style={[styles.noticeBar, { backgroundColor: colors.surfaceSoft }]}>
            <Icon name="information-circle-outline" size={16} color={colors.textMuted} />
            <Text style={[styles.noticeText, { color: colors.textMuted }]}>
              {t("note.visibilityOwnerOnly")}
            </Text>
          </View>
        ) : null}

        {isOwner && isPublic ? (
          <View style={[styles.inviteBar, { backgroundColor: colors.surfaceSoft }]}>
            <View style={styles.inviteCopy}>
              <Icon name="mail-outline" size={17} color={colors.textPrimary} />
              <Text style={[styles.inviteText, { color: colors.textPrimary }]}>
                {t("note.inviteBar")}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.inviteButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setInviteStatus("");
                setInviteStatusTone("success");
                setInviteModalVisible(true);
              }}
              activeOpacity={0.85}
            >
              <Icon name="person-add-outline" size={16} color={colors.onPrimary} />
              <Text style={[styles.inviteButtonText, { color: colors.onPrimary }]}>{t("note.invite")}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.documentWrap}>
          <View
            style={[
              styles.documentPage,
              {
                backgroundColor: isDark ? colors.surface : colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
          >
            {activeRemoteEditors.length > 0 ? (
              <View style={styles.remoteEditorsLayer} pointerEvents="none">
                {activeRemoteEditors.map((editor, index) => (
                  <View
                    key={editor.id}
                    style={[
                      styles.remoteEditorMarker,
                      {
                        marginTop: index === 0 ? 0 : 6,
                        borderColor: editor.color,
                        backgroundColor: editor.color,
                      },
                    ]}
                  >
                    <Text style={styles.remoteEditorText} numberOfLines={1}>
                      {editor.label}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            {loading && !currentNote ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : (
              <TextInput
                value={content}
                onChangeText={handleContentChange}
                placeholder={t("note.startWriting")}
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.primary}
                editable={canEditNote}
                multiline
                style={[
                  styles.documentBody,
                  { color: canEditNote ? colors.textPrimary : colors.textMuted },
                ]}
              />
            )}
          </View>
        </ScrollView>

        <Modal
          visible={inviteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setInviteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.inviteModal,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t("note.inviteByEmail")}</Text>
                <TouchableOpacity
                  style={[styles.modalClose, { backgroundColor: colors.surfaceSoft }]}
                  onPress={() => setInviteModalVisible(false)}
                >
                  <Icon name="close" size={18} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.guestListBlock}>
                <View style={styles.guestListHeader}>
                  <Text style={[styles.guestListTitle, { color: colors.textPrimary }]}>
                    {t("note.invitedGuests")}
                  </Text>
                  {invitesLoading ? <ActivityIndicator color={colors.primary} size="small" /> : null}
                </View>

                {invitesLoading && invites.length === 0 ? null : invites.length > 0 ? (
                  <ScrollView style={styles.guestList} nestedScrollEnabled>
                    {invites.map((invite) => {
                      const email = invite.invited_gmail;
                      const isRemoving = removingInviteEmail === email;
                      return (
                        <View
                          key={`${invite.note_id}-${email}`}
                          style={[
                            styles.guestRow,
                            {
                              borderColor: colors.border,
                              backgroundColor: colors.surfaceSoft,
                            },
                          ]}
                        >
                          <View style={styles.guestInfo}>
                            <Text
                              style={[styles.guestName, { color: colors.textPrimary }]}
                              numberOfLines={1}
                            >
                              {invite.username || email}
                            </Text>
                            {invite.username ? (
                              <Text
                                style={[styles.guestEmail, { color: colors.textMuted }]}
                                numberOfLines={1}
                              >
                                {email}
                              </Text>
                            ) : null}
                            <Text style={[styles.guestPermission, { color: colors.textMuted }]}>
                              {invite.can_edit ? t("common.canEdit") : t("common.viewOnly")}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={[
                              styles.kickButton,
                              {
                                backgroundColor: isDark ? colors.accentStrong : "#ff5252",
                                opacity: isRemoving ? 0.65 : 1,
                              },
                            ]}
                            onPress={() => handleRemoveInvite(email)}
                            disabled={isRemoving}
                            activeOpacity={0.85}
                          >
                            {isRemoving ? (
                              <ActivityIndicator color={colors.onPrimary} size="small" />
                            ) : (
                              <Icon name="person-remove-outline" size={16} color={colors.onPrimary} />
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <Text style={[styles.emptyGuestsText, { color: colors.textMuted }]}>
                    {t("note.noGuests")}
                  </Text>
                )}
              </View>

              <TextInput
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder={t("note.friendEmail")}
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.inviteInput,
                  {
                    color: colors.textPrimary,
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceSoft,
                  },
                ]}
              />

              <View style={styles.permissionRow}>
                <View style={styles.permissionTextWrap}>
                  <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>
                    {t("note.allowEditing")}
                  </Text>
                  <Text style={[styles.permissionHint, { color: colors.textMuted }]}>
                    {t("note.offMeansViewOnly")}
                  </Text>
                </View>
                <Switch
                  value={canEdit}
                  onValueChange={setCanEdit}
                  trackColor={{ false: colors.trackOff, true: colors.trackOn }}
                  thumbColor={colors.surface}
                />
              </View>

              {inviteStatus ? (
                <Text
                  style={[
                    styles.inviteStatus,
                    {
                      color: inviteStatusTone === "success" ? colors.textPrimary : "#ff6b6b",
                    },
                  ]}
                >
                  {inviteStatus}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.modalInviteButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: isInviting ? 0.65 : 1,
                  },
                ]}
                onPress={handleInvite}
                disabled={isInviting}
                activeOpacity={0.85}
              >
                {isInviting ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <>
                    <Icon name="send-outline" size={17} color={colors.onPrimary} />
                    <Text style={[styles.modalInviteText, { color: colors.onPrimary }]}>
                      {t("note.sendInvite")}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default NoteDetails;
