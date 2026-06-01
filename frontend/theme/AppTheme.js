import React, { createContext, useContext, useMemo, useState } from "react";

const lightTheme = {
  mode: "light",
  background: "#F6EEDF",
  surface: "#FFF8ED",
  surfaceSoft: "#EADBC8",
  surfaceMuted: "rgba(255,248,237,0.98)",
  overlay: "rgba(246,237,223,0.98)",
  primary: "#6F4E37",
  secondary: "#8B7355",
  accent: "#E4C28E",
  accentStrong: "#B78A52",
  textPrimary: "#3F2C1C",
  textSecondary: "#5C4033",
  textMuted: "#8B7355",
  onPrimary: "#FFF8ED",
  border: "#EADBC8",
  shadow: "#6F4E37",
  inputBackground: "#FFF8ED",
  inputBorder: "#EADBC8",
  tabInactive: "#8B7355",
  tabActiveText: "#FFF8ED",
  cardGradient: ["#F7ECD9", "#E8D0B1"],
  buttonGradient: ["#6F4E37", "#8B7355"],
  pageGradient: ["#FFF8ED", "#F6EEDF"],
  logoGradient: ["#E4C28E", "#B78A52"],
  trackOff: "#EADBC8",
  trackOn: "#6F4E37",
};

const darkTheme = {
  mode: "dark",
  background: "#12122B",
  surface: "rgba(23,23,45,0.88)",
  surfaceSoft: "rgba(255,255,255,0.08)",
  surfaceMuted: "rgba(23,23,45,0.85)",
  overlay: "rgba(10,10,24,0.96)",
  primary: "#FF4D9D",
  secondary: "#BD00FF",
  accent: "#FF88B8",
  accentStrong: "#FF2E8A",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.78)",
  textMuted: "rgba(255,255,255,0.42)",
  onPrimary: "#FFFFFF",
  border: "rgba(255,255,255,0.12)",
  shadow: "#000000",
  inputBackground: "rgba(0,0,0,0.25)",
  inputBorder: "rgba(255,255,255,0.08)",
  tabInactive: "rgba(255,255,255,0.42)",
  tabActiveText: "#FFFFFF",
  cardGradient: ["#1A1A36", "#12122B"],
  buttonGradient: ["#FF007F", "#BD00FF"],
  pageGradient: ["#08081A", "#12122B"],
  logoGradient: ["#FF007F", "#BD00FF"],
  trackOff: "rgba(255,255,255,0.2)",
  trackOn: "#FF4D9D",
};

const AppThemeContext = createContext(null);

export const AppThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const value = useMemo(() => {
    const colors = isDark ? darkTheme : lightTheme;
    return {
      isDark,
      colors,
      toggleTheme: () => setIsDark((current) => !current),
    };
  }, [isDark]);

  return (
    <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }

  return context;
};
