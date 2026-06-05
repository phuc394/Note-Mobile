import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../theme/AppTheme";

const tabs = [
  { key: "Home", labelKey: "tabs.notes", icon: "document-outline", activeIcon: "document" },
  { key: "Shared", labelKey: "tabs.shared", icon: "share-social-outline", activeIcon: "share-social" },
  { key: "Delete", labelKey: "tabs.trash", icon: "trash-outline", activeIcon: "trash" },
  { key: "Profile", labelKey: "tabs.account", icon: "person-outline", activeIcon: "person" },
];

const AppBottomTab = ({ navigation, activeTab }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={[styles.backdrop, { backgroundColor: colors.overlay, borderTopColor: colors.border }]} />
      <View style={[styles.tabBar, { backgroundColor: colors.surfaceMuted, borderColor: colors.border, shadowColor: colors.shadow }]}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, active && styles.tabItemActive, active && { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate(tab.key)}
              activeOpacity={0.85}
            >
              <Icon name={active ? tab.activeIcon : tab.icon} size={22} color={active ? colors.onPrimary : colors.tabInactive} />
              <Text style={[styles.tabLabel, { color: active ? colors.onPrimary : colors.tabInactive }]}>{t(tab.labelKey)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    justifyContent: "flex-end",
    zIndex: 30,
  },
  backdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    borderTopWidth: 1,
  },
  tabBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 76,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 20,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 54,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tabItemActive: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  tabLabel: { fontSize: 10, marginTop: 4 },
});

export default AppBottomTab;
