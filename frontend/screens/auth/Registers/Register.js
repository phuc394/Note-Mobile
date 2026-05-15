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

const Register = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient colors={["#08081a", "#12122b"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, width: "100%" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              {/* Logo phát sáng */}
              <View style={styles.logoWrapper}>
                <LinearGradient
                  colors={["#FF007F", "#BD00FF"]}
                  style={styles.logoContainer}
                >
                  <Icon name="sparkles" size={35} color="#fff" />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Tạo tài khoản mới</Text>
              <Text style={styles.subtitle}>Điền thông tin để đăng ký</Text>

              {/* Bộ chọn Tab */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Icon
                    name="log-in-outline"
                    size={18}
                    color="rgba(255,255,255,0.4)"
                  />
                  <Text style={styles.tabText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                  <Icon name="person-add" size={18} color="#fff" />
                  <Text style={[styles.tabText, styles.tabTextActive]}>
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Các trường nhập liệu */}
              <InputField
                label="Họ và tên"
                icon="person-outline"
                placeholder="Nguyễn Văn A"
              />
              <InputField
                label="Email"
                icon="mail-outline"
                placeholder="your@email.com"
                keyboardType="email-address"
              />
              <InputField
                label="Mật khẩu"
                icon="lock-closed-outline"
                placeholder="Ít nhất 6 ký tự"
                secureTextEntry={!showPassword}
                isPassword
                toggleVisible={() => setShowPassword(!showPassword)}
              />
              <InputField
                label="Xác nhận mật khẩu"
                icon="lock-closed-outline"
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={!showPassword}
                isPassword
                toggleVisible={() => setShowPassword(!showPassword)}
              />

              {/* Nút bấm chính */}
              <TouchableOpacity
                style={styles.mainButtonWrapper}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FF007F", "#BD00FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mainButton}
                >
                  <Icon
                    name="person-add"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.buttonText}>Tạo tài khoản</Text>
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
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Icon name={icon} size={20} color="rgba(255,255,255,0.3)" />
      <TextInput
        style={styles.input}
        placeholderTextColor="rgba(255,255,255,0.2)"
        selectionColor="#FF007F"
        autoCapitalize="none"
        underlineColorAndroid="transparent" // Đảm bảo không có nền mặc định
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={toggleVisible}>
          <Icon
            name={props.secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="rgba(255,255,255,0.3)"
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default Register;
