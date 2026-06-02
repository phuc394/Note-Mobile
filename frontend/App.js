import React, { useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AppNavigator from "./navigation/Navigation.js";
import { AppThemeProvider, useAppTheme } from "./theme/AppTheme";

const AppShell = () => {
  const { colors } = useAppTheme();

  useEffect(() => {
    if (Platform.OS !== "web") {
      return undefined;
    }

    const style = document.createElement("style");
    style.textContent = `
      input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px ${colors.surface} inset !important;
        -webkit-text-fill-color: ${colors.textPrimary} !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [colors.surface, colors.textPrimary]);

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AppThemeProvider>
      <AppShell />
    </AppThemeProvider>
  );
}
