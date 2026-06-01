import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './LoginStyle'; // Chúng ta sẽ tạo file style này bên dưới
import { useAppTheme } from '../../../theme/AppTheme';

const Login = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient colors={colors.pageGradient} style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
              {/* Logo phát sáng - Giữ nguyên Brand Identity */}
              <View style={styles.logoWrapper}>
                <LinearGradient colors={colors.logoGradient} style={styles.logoContainer}>
                  <Icon name="sparkles" size={35} color={colors.onPrimary} />
                </LinearGradient>
              </View>

              <Text style={[styles.title, { color: colors.textPrimary }]}>Chào mừng trở lại</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>Đăng nhập vào tài khoản của bạn</Text>

              {/* Bộ chọn Tab - Chuyển Active sang Đăng nhập */}
              <View style={[styles.tabContainer, { backgroundColor: colors.surfaceSoft }]}>
                <TouchableOpacity style={[styles.tab, styles.tabActive, { backgroundColor: colors.primary, borderColor: colors.border }]}>
                  <Icon name="log-in" size={18} color={colors.onPrimary} />
                  <Text style={[styles.tabText, styles.tabTextActive, { color: colors.onPrimary }]}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.tab}
                  onPress={() => navigation.navigate('Register')} // Chuyển sang trang Đăng ký
                >
                  <Icon name="person-add-outline" size={18} color={colors.tabInactive} />
                  <Text style={[styles.tabText, { color: colors.tabInactive }]}>Đăng ký</Text>
                </TouchableOpacity>
              </View>

              {/* Form nhập liệu */}
              <InputField 
                label="Email" 
                icon="mail-outline" 
                placeholder="your@email.com" 
                keyboardType="email-address"
                autoComplete="off"
                colors={colors}
              />
              
              <View style={{ width: '100%' }}>
                <InputField 
                  label="Mật khẩu" 
                  icon="lock-closed-outline" 
                  placeholder="Nhập mật khẩu" 
                  secureTextEntry={!showPassword}
                  isPassword
                  toggleVisible={() => setShowPassword(!showPassword)}
                  autoComplete="off"
                  colors={colors}
                />
                {/* Quên mật khẩu */}
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={[styles.forgotText, { color: colors.primary }]}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>

              {/* Nút Đăng nhập */}
              <TouchableOpacity style={[styles.mainButtonWrapper, { shadowColor: colors.primary }]} activeOpacity={0.8}>
                <LinearGradient 
                  colors={colors.buttonGradient} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.mainButton}
                >
                  <Icon name="log-in" size={20} color={colors.onPrimary} style={{marginRight: 10}} />
                  <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Đăng nhập</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Hoặc đăng nhập bằng (Tùy chọn thêm cho đẹp) */}
              <View style={styles.dividerContainer}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>Hoặc</Text>
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

// Component Input dùng chung (Có thể tách ra file components riêng)
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

export default Login;