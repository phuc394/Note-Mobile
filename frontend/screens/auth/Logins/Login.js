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

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient colors={['#08081a', '#12122b']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              {/* Logo phát sáng - Giữ nguyên Brand Identity */}
              <View style={styles.logoWrapper}>
                <LinearGradient colors={['#FF007F', '#BD00FF']} style={styles.logoContainer}>
                  <Icon name="sparkles" size={35} color="#fff" />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Chào mừng trở lại</Text>
              <Text style={styles.subtitle}>Đăng nhập vào tài khoản của bạn</Text>

              {/* Bộ chọn Tab - Chuyển Active sang Đăng nhập */}
              <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                  <Icon name="log-in" size={18} color="#fff" />
                  <Text style={[styles.tabText, styles.tabTextActive]}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.tab}
                  onPress={() => navigation.navigate('Register')} // Chuyển sang trang Đăng ký
                >
                  <Icon name="person-add-outline" size={18} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.tabText}>Đăng ký</Text>
                </TouchableOpacity>
              </View>

              {/* Form nhập liệu */}
              <InputField 
                label="Email" 
                icon="mail-outline" 
                placeholder="your@email.com" 
                keyboardType="email-address"
                autoComplete="off"
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
                />
                {/* Quên mật khẩu */}
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>

              {/* Nút Đăng nhập */}
              <TouchableOpacity style={styles.mainButtonWrapper} activeOpacity={0.8}>
                <LinearGradient 
                  colors={['#FF007F', '#BD00FF']} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.mainButton}
                >
                  <Icon name="log-in" size={20} color="#fff" style={{marginRight: 10}} />
                  <Text style={styles.buttonText}>Đăng nhập</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Hoặc đăng nhập bằng (Tùy chọn thêm cho đẹp) */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Hoặc</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Icon name="logo-google" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Icon name="logo-facebook" size={24} color="#fff" />
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
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Icon name={icon} size={20} color="rgba(255,255,255,0.3)" />
      <TextInput 
        style={styles.input} 
        placeholderTextColor="rgba(255,255,255,0.2)"
        selectionColor="#FF007F"
        autoCapitalize="none"
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

export default Login;