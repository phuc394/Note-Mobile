import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useAppTheme } from "../../theme/AppTheme";
import { fetchNote, togglePublicNote, updateNote } from "../../redux/notesSlice";
import { styles } from "./NoteDetailsStyle";

const formatDate = (value) => {
  if (!value) return "Not saved yet";
  return new Date(value).toISOString().slice(0, 10);
};

const NoteDetails = ({ navigation, route }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { selectedNote, loading, error } = useSelector((state) => state.notes);
  const noteId = route.params?.noteId;
  const currentNote =
    selectedNote && String(selectedNote.id) === String(noteId) ? selectedNote : null;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const isOwner = currentNote?.is_owner === undefined || Boolean(currentNote?.is_owner);

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
    }
  }, [currentNote]);

  const handleTogglePublic = (value) => {
    if (!isOwner) return;
    setIsPublic(value);
    dispatch(togglePublicNote({ id: noteId, is_public: value }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateNote({ id: noteId, title, content })).unwrap();
      navigation.navigate("Home");
    } catch (_error) {
      // Redux error is rendered in the toolbar.
    }
  };

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
              onChangeText={setTitle}
              placeholder="Untitled note"
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.primary}
              style={[styles.toolbarTitle, { color: colors.textPrimary }]}
            />
            <Text style={[styles.toolbarMeta, { color: colors.textMuted }]}>
              Last updated {formatDate(currentNote?.updated_at || currentNote?.created_at)}
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
                {isPublic ? "Public" : "Private"}
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
              <Text style={[styles.saveText, { color: colors.onPrimary }]}>Save</Text>
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
              Visibility can only be changed by the note owner.
            </Text>
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
            {loading && !currentNote ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : (
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Start writing..."
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.primary}
                multiline
                style={[styles.documentBody, { color: colors.textPrimary }]}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default NoteDetails;
