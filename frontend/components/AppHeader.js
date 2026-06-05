import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../theme/AppTheme";

const AppHeader = ({ navigation, showBack = false, backTarget = "Home" }) => {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  return (
    <View style={styles.wrapper}>
      <View style={styles.brandRow}>
        <LinearGradient colors={colors.logoGradient} style={styles.brandIcon}>
          <Icon name="sparkles" size={18} color={colors.onPrimary} />
        </LinearGradient>
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>{t("app.name")}</Text>
          <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user?.email ?? t("app.notSignedIn")}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {showBack ? (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}
            onPress={() => navigation.navigate(backTarget)}
            activeOpacity={0.85}
          >
            <Icon name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[styles.switchPill, { backgroundColor: colors.surfaceSoft }]}
          onPress={toggleTheme}
          activeOpacity={0.85}
        >
          <View style={[styles.switchKnob, { backgroundColor: colors.surface }]}>
            <Icon name={isDark ? "moon-outline" : "sunny-outline"} size={12} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: { fontSize: 18, fontWeight: "800" },
  userEmail: { fontSize: 10 },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  switchPill: {
    width: 54,
    height: 26,
    borderRadius: 999,
    padding: 2,
    justifyContent: "center",
  },
  switchKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
});

export default AppHeader;
