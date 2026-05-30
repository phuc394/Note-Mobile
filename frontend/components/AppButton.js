import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
// Bạn cần cài đặt expo-linear-gradient hoặc react-native-linear-gradient
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../theme/AppTheme";

const AppButton = ({ title, icon, onPress }) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.shadow, { shadowColor: colors.primary }]}
    >
    <LinearGradient
      colors={colors.buttonGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.button}
    >
      {icon && (
        <Icon name={icon} size={20} color={colors.onPrimary} style={styles.icon} />
      )}
      <Text style={[styles.title, { color: colors.onPrimary }]}>{title}</Text>
    </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    width: "100%",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppButton;
