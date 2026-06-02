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
import { styles } from "./LoginStyle";
import { useAppTheme } from "../../../theme/AppTheme";
import { loginUser } from "../../../redux/authSlice";

const Login = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ identifier, password })).unwrap();
      navigation.navigate("Home");
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

              <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome back</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>Sign in to your account</Text>

              <View style={[styles.tabContainer, { backgroundColor: colors.surfaceSoft }]}>
                <TouchableOpacity style={[styles.tab, styles.tabActive, { backgroundColor: colors.primary, borderColor: colors.border }]}>
                  <Icon name="log-in" size={18} color={colors.onPrimary} />
                  <Text style={[styles.tabText, styles.tabTextActive, { color: colors.onPrimary }]}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("Register")}>
                  <Icon name="person-add-outline" size={18} color={colors.tabInactive} />
                  <Text style={[styles.tabText, { color: colors.tabInactive }]}>Sign up</Text>
                </TouchableOpacity>
              </View>

              <InputField
                label="Email"
                icon="mail-outline"
                placeholder="your@email.com"
                keyboardType="email-address"
                autoComplete="off"
                value={identifier}
                onChangeText={setIdentifier}
                colors={colors}
              />

              <View style={{ width: "100%" }}>
                <InputField
                  label="Password"
                  icon="lock-closed-outline"
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  isPassword
                  toggleVisible={() => setShowPassword(!showPassword)}
                  autoComplete="off"
                  value={password}
                  onChangeText={setPassword}
                  colors={colors}
                />
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {error ? <Text style={[styles.forgotText, { color: "#ff6b6b" }]}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.mainButtonWrapper, { shadowColor: colors.primary }]}
                activeOpacity={0.8}
                onPress={handleLogin}
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
                      <Icon name="log-in" size={20} color={colors.onPrimary} style={{ marginRight: 10 }} />
                      <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Sign in</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>Or</Text>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}>
                  <Icon name="logo-google" size={24} color={colors.onPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}>
                  <Icon name="logo-facebook" size={24} color={colors.onPrimary} />
                </TouchableOpacity>
              </View>
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

export default Login;
