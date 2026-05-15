/**
 * Các chức năng xác thực đơn giản cho màn hình đăng ký.
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // Ít nhất 6 ký tự
  return password.length >= 6;
};

export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const isFormValid = (displayName, email, password, confirmPassword) => {
  if (
    !displayName.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmPassword.trim()
  ) {
    return { valid: false, message: "Tất cả các trường là bắt buộc." };
  }
  if (!validateEmail(email)) {
    return { valid: false, message: "Email không hợp lệ." };
  }
  if (!validatePassword(password)) {
    return { valid: false, message: "Mật khẩu phải có ít nhất 6 ký tự." };
  }
  if (!doPasswordsMatch(password, confirmPassword)) {
    return {
      valid: false,
      message: "Mật khẩu và xác nhận mật khẩu không khớp.",
    };
  }
  return { valid: true };
};
