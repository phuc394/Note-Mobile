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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./RegisterStyle";
import { useAppTheme } from "../../../theme/AppTheme";

const Register = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);

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
              {/* Logo phát sáng */}
              <View style={styles.logoWrapper}>
                <LinearGradient
                  colors={colors.logoGradient}
                  style={styles.logoContainer}
                >
                  <Icon name="sparkles" size={35} color={colors.onPrimary} />
                </LinearGradient>
              </View>

              <Text style={[styles.title, { color: colors.textPrimary }]}>Tạo tài khoản mới</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>Điền thông tin để đăng ký</Text>

              {/* Bộ chọn Tab */}
              <View style={[styles.tabContainer, { backgroundColor: colors.surfaceSoft }]}>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Icon
                    name="log-in-outline"
                    size={18}
                    color={colors.tabInactive}
                  />
                  <Text style={[styles.tabText, { color: colors.tabInactive }]}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, styles.tabActive, { backgroundColor: colors.primary, borderColor: colors.border }]}>
                  <Icon name="person-add" size={18} color={colors.onPrimary} />
                  <Text style={[styles.tabText, styles.tabTextActive, { color: colors.onPrimary }]}>
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Các trường nhập liệu */}
              <InputField
                label="Họ và tên"
                icon="person-outline"
                placeholder="Nguyễn Văn A"
                colors={colors}
              />
              <InputField
                label="Email"
                icon="mail-outline"
                placeholder="your@email.com"
                keyboardType="email-address"
                colors={colors}
              />
              <InputField
                label="Mật khẩu"
                icon="lock-closed-outline"
                placeholder="Ít nhất 6 ký tự"
                secureTextEntry={!showPassword}
                isPassword
                toggleVisible={() => setShowPassword(!showPassword)}
                colors={colors}
              />
              <InputField
                label="Xác nhận mật khẩu"
                icon="lock-closed-outline"
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={!showPassword}
                isPassword
                toggleVisible={() => setShowPassword(!showPassword)}
                colors={colors}
              />

              {/* Nút bấm chính */}
              <TouchableOpacity
                style={[styles.mainButtonWrapper, { shadowColor: colors.primary }]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={colors.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mainButton}
                >
                  <Icon
                    name="person-add"
                    size={20}
                    color={colors.onPrimary}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Tạo tài khoản</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// Thành phần ô nhập liệu dùng chung
const InputField = ({ label, icon, isPassword, toggleVisible, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: props.colors.textMuted }]}>{label}</Text>
    <View style={[styles.inputWrapper, { backgroundColor: props.colors.inputBackground, borderColor: props.colors.inputBorder }]}>
      <Icon name={icon} size={20} color={props.colors.textMuted} />
      <TextInput
        style={[styles.input, { color: props.colors.textPrimary }]}
        placeholderTextColor={props.colors.textMuted}
        selectionColor={props.colors.primary}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={toggleVisible}>
          <Icon
            name={props.secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={props.colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default Register;
