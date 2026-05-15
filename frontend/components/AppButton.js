import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
// Bạn cần cài đặt expo-linear-gradient hoặc react-native-linear-gradient
import { LinearGradient } from "expo-linear-gradient";

const AppButton = ({ title, icon, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.shadow}>
    <LinearGradient
      colors={["#FF007F", "#BD00FF"]} // Chuyển màu hồng đến tím phát sáng
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.button}
    >
      {icon && (
        <Icon name={icon} size={20} color="#FFFFFF" style={styles.icon} />
      )}
      <Text style={styles.title}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  shadow: {
    width: "100%",
    shadowColor: "#BD00FF", // Màu phát sáng mờ
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppButton;
