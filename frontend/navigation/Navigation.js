import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/Logins/Login";
import RegisterScreen from "../screens/auth/Registers/Register";
import HomeScreen from "../screens/home/Home";
import SharedScreen from "../screens/shared/Shared";
import DeleteScreen from "../screens/delete/Delete";
import Profile from "../screens/profile/Profile";
import NoteDetails from "../screens/noteDetails/NoteDetails";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Shared" component={SharedScreen} />
      <Stack.Screen name="Delete" component={DeleteScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="NoteDetails" component={NoteDetails} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
