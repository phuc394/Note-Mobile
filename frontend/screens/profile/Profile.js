import React, { useEffect, useState } from "react";
import {
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
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./ProfileStyle";
import { useAppTheme } from "../../theme/AppTheme";
import AppHeader from "../../components/AppHeader";
import AppBottomTab from "../../components/AppBottomTab";
import { fetchProfile, logoutUser, updateProfile } from "../../redux/authSlice";

const Profile = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const [isEdit, setIsEdit] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token]);

  useEffect(() => {
    setName(user?.username ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  const handleSave = async () => {
    try {
      await dispatch(updateProfile({ username: name, email })).unwrap();
      setIsEdit(false);
    } catch (_error) {
      // Redux error is rendered below.
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setShowLogoutModal(false);
    setIsEdit(false);
    navigation.navigate("Login");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <AppHeader navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <Text style={[styles.pageLabel, { color: colors.textMuted }]}>Profile</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Account information</Text>

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
              <LinearGradient colors={colors.logoGradient} style={styles.avatarWrap}>
                <Icon name="person-outline" size={34} color={colors.onPrimary} />
              </LinearGradient>

              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={[styles.username, { color: colors.textPrimary }]}>
                    {name || "Not signed in"}
                  </Text>
                  <TouchableOpacity
                    style={[styles.smallActionBtn, { backgroundColor: colors.surfaceSoft }]}
                    onPress={() => setIsEdit((value) => !value)}
                  >
                    <Text style={[styles.smallActionText, { color: colors.textPrimary }]}>
                      {isEdit ? "Cancel" : "Edit"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.useremail, { color: colors.textMuted }]}>{email}</Text>
              </View>
            </View>

            <View style={styles.form}>
              <Field label="Display name" icon="person-outline" value={name} onChangeText={setName} editable={isEdit} colors={colors} />
              <Field label="Email" icon="mail-outline" value={email} onChangeText={setEmail} editable={isEdit} colors={colors} />
              <Field label="Password" icon="lock-closed-outline" value="******" editable={false} colors={colors} />
              <Field label="Joined" icon="calendar-outline" value={user?.created_at ? String(user.created_at).slice(0, 10) : ""} editable={false} colors={colors} />

              {error ? <Text style={[styles.label, { color: "#ff6b6b" }]}>{error}</Text> : null}

              {isEdit ? (
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85} disabled={loading}>
                  <LinearGradient colors={colors.buttonGradient} style={styles.saveGradient}>
                    {loading ? (
                      <ActivityIndicator color={colors.onPrimary} />
                    ) : (
                      <>
                        <Icon name="save-outline" size={18} color={colors.onPrimary} />
                        <Text style={[styles.saveText, { color: colors.onPrimary }]}>Save changes</Text>
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
                <Text style={[styles.logoutText, { color: colors.textPrimary }]}>Log out</Text>
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
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Confirm logout</Text>
              <Text style={[styles.modalText, { color: colors.textMuted }]}>Are you sure you want to log out?</Text>

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalCancel, { borderColor: colors.border }]} onPress={() => setShowLogoutModal(false)}>
                  <Text style={[styles.modalCancelText, { color: colors.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalConfirm, { backgroundColor: colors.primary }]} onPress={handleLogout}>
                  <Text style={[styles.modalConfirmText, { color: colors.onPrimary }]}>Log out</Text>
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
