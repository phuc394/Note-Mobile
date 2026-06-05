import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { styles } from "./RegisterStyle";
import { useAppTheme } from "../../../theme/AppTheme";
import { registerUser } from "../../../redux/authSlice";

const Register = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleRegister = async () => {
    try {
      await dispatch(registerUser({ username, email, password, passwordConfirm })).unwrap();
      navigation.navigate("Login");
    } catch (_error) {
      // Redux error is rendered below.
    }
  };

  return (
    <LinearGradient colors={colors.pageGradient} style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1, width: "100%" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
              <View style={styles.logoWrapper}>
                <LinearGradient colors={colors.logoGradient} style={styles.logoContainer}>
                  <Icon name="sparkles" size={35} color={colors.onPrimary} />
                </LinearGradient>
              </View>

              <Text style={[styles.title, { color: colors.textPrimary }]}>{t("auth.createAccountTitle")}</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t("auth.createAccountSubtitle")}</Text>

              <View style={[styles.tabContainer, { backgroundColor: colors.surfaceSoft }]}>
                <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("Login")}>
                  <Icon name="log-in-outline" size={18} color={colors.tabInactive} />
                  <Text style={[styles.tabText, { color: colors.tabInactive }]}>{t("auth.signIn")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, styles.tabActive, { backgroundColor: colors.primary, borderColor: colors.border }]}>
                  <Icon name="person-add" size={18} color={colors.onPrimary} />
                  <Text style={[styles.tabText, styles.tabTextActive, { color: colors.onPrimary }]}>{t("auth.signUp")}</Text>
                </TouchableOpacity>
              </View>

              <InputField
                label={t("auth.fullName")}
                icon="person-outline"
                placeholder={t("auth.namePlaceholder")}
                value={username}
                onChangeText={setUsername}
                colors={colors}
              />
              <InputField
                label={t("common.email")}
                icon="mail-outline"
                placeholder="your@email.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                colors={colors}
              />
              <InputField
                label={t("common.password")}
                icon="lock-closed-outline"
                placeholder={t("auth.passwordMinPlaceholder")}
                secureTextEntry={!showPassword}
                isPassword
                toggleVisible={() => setShowPassword(!showPassword)}
                value={password}
                onChangeText={setPassword}
                colors={colors}
              />
              <InputField
                label={t("auth.confirmPassword")}
                icon="lock-closed-outline"
                placeholder={t("auth.confirmPasswordPlaceholder")}
                secureTextEntry={!showPassword}
                isPassword
                toggleVisible={() => setShowPassword(!showPassword)}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                colors={colors}
              />

              {error ? <Text style={[styles.label, { color: "#ff6b6b" }]}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.mainButtonWrapper, { shadowColor: colors.primary }]}
                activeOpacity={0.8}
                onPress={handleRegister}
                disabled={loading}
              >
                <LinearGradient
                  colors={colors.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mainButton}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.onPrimary} />
                  ) : (
                    <>
                      <Icon name="person-add" size={20} color={colors.onPrimary} style={{ marginRight: 10 }} />
                      <Text style={[styles.buttonText, { color: colors.onPrimary }]}>{t("auth.createAccount")}</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const InputField = ({ label, icon, isPassword, toggleVisible, colors, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
    <View style={[styles.inputWrapper, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
      <Icon name={icon} size={20} color={colors.textMuted} />
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={toggleVisible}>
          <Icon
            name={props.secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default Register;
