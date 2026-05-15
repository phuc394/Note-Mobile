import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import các màn hình từ cấu trúc folder mới
import LoginScreen from "./screens/auth/Logins/Login";
import RegisterScreen from "./screens/auth/Registers/Register";
import HomeScreen from "./screens/home/Home";
import SharedScreen from "./screens/shared/Shared";

// 1. Phần sửa lỗi Autofill cho nền tảng Web (Giữ màu tối khi trình duyệt lưu pass)
if (Platform.OS === "web") {
  const style = document.createElement("style");
  style.textContent = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px #12122b inset !important;
      -webkit-text-fill-color: #FFFFFF !important;
      transition: background-color 5000s ease-in-out 0s;
    }
  `;
  document.head.appendChild(style);
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator
    //     initialRouteName="Login"
    //     screenOptions={{
    //       headerShown: false, // Ẩn thanh tiêu đề mặc định để dùng UI tự thiết kế
    //       animation: "fade_from_bottom", // Hiệu ứng chuyển cảnh mượt mà
    //     }}
    //   >
    //     {/* Định nghĩa các màn hình trong Stack */}
    //     <Stack.Screen name="Login" component={LoginScreen} />
    //     <Stack.Screen name="Register" component={RegisterScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Ẩn thanh tiêu đề mặc định để dùng UI tự thiết kế
          animation: "fade_from_bottom", // Hiệu ứng chuyển cảnh mượt mà
        }}
      >
        {/* Định nghĩa các màn hình trong Stack */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Shared" component={SharedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
