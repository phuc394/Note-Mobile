export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
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
    return { valid: false, message: "All fields are required." };
  }

  if (!validateEmail(email)) {
    return { valid: false, message: "Email is invalid." };
  }

  if (!validatePassword(password)) {
    return { valid: false, message: "Password must be at least 6 characters." };
  }

  if (!doPasswordsMatch(password, confirmPassword)) {
    return {
      valid: false,
      message: "Password and confirmation password do not match.",
    };
  }

  return { valid: true };
};
