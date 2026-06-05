import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { styles } from "./ProfileStyle";
import { useAppTheme } from "../../theme/AppTheme";
import AppHeader from "../../components/AppHeader";
import AppBottomTab from "../../components/AppBottomTab";
import { fetchProfile, logoutUser, updateProfile } from "../../redux/authSlice";
import { LANGUAGE_OPTIONS, changeAppLanguage } from "../../locales/i18n";

const Profile = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const [isEdit, setIsEdit] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token]);

  useEffect(() => {
    setName(user?.username ?? "");
    setEmail(user?.email ?? "");
    setAvatarUrl(user?.avatar_url ?? "");
  }, [user]);

  const handleSave = async () => {
    try {
      await dispatch(updateProfile({ username: name, email, avatar_url: avatarUrl })).unwrap();
      setIsEdit(false);
    } catch (_error) {
      // Redux error is rendered below.
    }
  };

  const handleCancelEdit = () => {
    setName(user?.username ?? "");
    setEmail(user?.email ?? "");
    setAvatarUrl(user?.avatar_url ?? "");
    setIsEdit(false);
  };

  const handlePickAvatar = async () => {
    if (!isEdit) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.65,
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]) {
      return;
    }

    const asset = result.assets[0];
    const mimeType = asset.mimeType || "image/jpeg";
    const nextAvatar = asset.base64
      ? `data:${mimeType};base64,${asset.base64}`
      : asset.uri;
    setAvatarUrl(nextAvatar);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setShowLogoutModal(false);
    setIsEdit(false);
    navigation.navigate("Login");
  };

  const handleChangeLanguage = async (language) => {
    await changeAppLanguage(language);
    setShowLanguageOptions(false);
  };

  const currentLanguage =
    LANGUAGE_OPTIONS.find((option) => option.code === i18n.language)?.code || "en";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <AppHeader navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <Text style={[styles.pageLabel, { color: colors.textMuted }]}>{t("profile.pageLabel")}</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t("profile.title")}</Text>

          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={styles.profileTop}>
              <TouchableOpacity
                style={styles.avatarFrame}
                onPress={handlePickAvatar}
                activeOpacity={isEdit ? 0.82 : 1}
              >
                <LinearGradient colors={colors.logoGradient} style={styles.avatarWrap}>
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                  ) : (
                    <Icon name="person-outline" size={34} color={colors.onPrimary} />
                  )}
                </LinearGradient>
                {isEdit ? (
                  <View style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
                    <Icon name="camera-outline" size={15} color={colors.onPrimary} />
                  </View>
                ) : null}
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={[styles.username, { color: colors.textPrimary }]}>
                    {name || t("app.notSignedIn")}
                  </Text>
                  <TouchableOpacity
                    style={[styles.smallActionBtn, { backgroundColor: colors.surfaceSoft }]}
                    onPress={() => (isEdit ? handleCancelEdit() : setIsEdit(true))}
                  >
                    <Text style={[styles.smallActionText, { color: colors.textPrimary }]}>
                      {isEdit ? t("common.cancel") : t("profile.edit")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.useremail, { color: colors.textMuted }]}>{email}</Text>
              </View>
            </View>

            <View style={styles.form}>
              <Field label={t("profile.displayName")} icon="person-outline" value={name} onChangeText={setName} editable={isEdit} colors={colors} />
              <Field label={t("common.email")} icon="mail-outline" value={email} onChangeText={setEmail} editable={isEdit} colors={colors} />
              <Field label={t("common.password")} icon="lock-closed-outline" value="******" editable={false} colors={colors} />
              <Field label={t("profile.joined")} icon="calendar-outline" value={user?.created_at ? String(user.created_at).slice(0, 10) : ""} editable={false} colors={colors} />

              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textMuted }]}>
                  <Icon name="language-outline" size={12} color={colors.textMuted} /> {t("profile.language")}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.languageSelect,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder,
                    },
                  ]}
                  onPress={() => setShowLanguageOptions((value) => !value)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.languageSelectText, { color: colors.textPrimary }]}>
                    {currentLanguage === "vi" ? t("profile.vietnamese") : t("profile.english")}
                  </Text>
                  <Icon
                    name={showLanguageOptions ? "chevron-up-outline" : "chevron-down-outline"}
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
                {showLanguageOptions ? (
                  <View
                    style={[
                      styles.languageMenu,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {LANGUAGE_OPTIONS.map((option) => {
                      const active = option.code === currentLanguage;
                      return (
                        <TouchableOpacity
                          key={option.code}
                          style={[
                            styles.languageOption,
                            active && { backgroundColor: colors.surfaceSoft },
                          ]}
                          onPress={() => handleChangeLanguage(option.code)}
                          activeOpacity={0.85}
                        >
                          <Text style={[styles.languageOptionText, { color: colors.textPrimary }]}>
                            {option.code === "vi" ? t("profile.vietnamese") : t("profile.english")}
                          </Text>
                          {active ? <Icon name="checkmark" size={18} color={colors.primary} /> : null}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </View>

              {error ? <Text style={[styles.label, { color: "#ff6b6b" }]}>{error}</Text> : null}

              {isEdit ? (
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85} disabled={loading}>
                  <LinearGradient colors={colors.buttonGradient} style={styles.saveGradient}>
                    {loading ? (
                      <ActivityIndicator color={colors.onPrimary} />
                    ) : (
                      <>
                        <Icon name="save-outline" size={18} color={colors.onPrimary} />
                        <Text style={[styles.saveText, { color: colors.onPrimary }]}>{t("common.saveChanges")}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={[styles.logoutBtn, { backgroundColor: colors.surfaceSoft }]}
                onPress={() => setShowLogoutModal(true)}
                activeOpacity={0.85}
              >
                <Text style={[styles.logoutText, { color: colors.textPrimary }]}>{t("profile.logout")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <AppBottomTab navigation={navigation} activeTab="Profile" />

        <Modal transparent visible={showLogoutModal} animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowLogoutModal(false)}>
            <Pressable style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => {}}>
              <View style={[styles.modalIcon, { backgroundColor: colors.surfaceSoft }]}>
                <Icon name="warning-outline" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t("profile.confirmLogout")}</Text>
              <Text style={[styles.modalText, { color: colors.textMuted }]}>{t("profile.confirmLogoutText")}</Text>

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalCancel, { borderColor: colors.border }]} onPress={() => setShowLogoutModal(false)}>
                  <Text style={[styles.modalCancelText, { color: colors.textPrimary }]}>{t("common.cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalConfirm, { backgroundColor: colors.primary }]} onPress={handleLogout}>
                  <Text style={[styles.modalConfirmText, { color: colors.onPrimary }]}>{t("profile.logout")}</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const Field = ({ label, icon, editable, colors, ...props }) => (
  <View style={styles.fieldGroup}>
    <Text style={[styles.label, { color: colors.textMuted }]}>
      <Icon name={icon} size={12} color={colors.textMuted} /> {label}
    </Text>
    <TextInput
      {...props}
      editable={editable}
      style={[
        styles.input,
        {
          backgroundColor: colors.inputBackground,
          borderColor: colors.inputBorder,
          color: colors.textPrimary,
        },
        !editable && styles.disabledInput,
      ]}
      placeholderTextColor={colors.textMuted}
    />
  </View>
);

export default Profile;
