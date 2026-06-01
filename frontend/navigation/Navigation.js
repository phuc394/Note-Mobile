import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import các màn hình từ cấu trúc thư mục của bạn
import LoginScreen from "../screens/auth/Logins/Login";
import RegisterScreen from "../screens/auth/Registers/Register";
import HomeScreen from "../screens/home/Home";
import SharedScreen from "../screens/shared/Shared";
import DeleteScreen from "../screens/delete/Delete";
import Profile from "../screens/profile/Profile";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // Ẩn header mặc định để dùng UI tự thiết kế
        animation: "fade_from_bottom", // Hiệu ứng chuyển trang mượt mà
      }}
    >
      {/* Auth Group */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Main App Group */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Shared" component={SharedScreen} />
      <Stack.Screen name="Delete" component={DeleteScreen} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
