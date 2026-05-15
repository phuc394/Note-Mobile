import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/Navigation.js"; // Import Navigator vừa tạo

// Phần sửa lỗi Autofill trên Web (giữ nguyên để tránh dải trắng lỗi)
if (Platform.OS === "web") {
  const style = document.createElement("style");
  style.textContent = `
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #12122b inset !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
