import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { styles } from "./SharedStyle";
import { useAppTheme } from "../../theme/AppTheme";
import AppHeader from "../../components/AppHeader";
import AppBottomTab from "../../components/AppBottomTab";
import { fetchSharedNotes } from "../../redux/sharedSlice";

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

const Shared = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: sharedNotes, loading, error } = useSelector((state) => state.shared);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchSharedNotes());
  }, [dispatch]);

  const filteredNotes = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return sharedNotes;

    return sharedNotes.filter((note) =>
      `${note.title ?? ""} ${note.content ?? ""}`.toLowerCase().includes(keyword)
    );
  }, [sharedNotes, searchText]);

  const renderSharedCard = ({ item, index }) => {
    const cardColors = isDark
      ? [colors.surface, colors.surfaceSoft]
      : index % 2 === 0
        ? ["#FFF8ED", "#C7D7E5"]
        : ["#FFF8ED", "#E8C4C4"];
    const permission = item.can_edit || item.shared_can_edit ? t("common.canEdit") : t("common.viewOnly");

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("NoteDetails", { noteId: item.id })}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={cardColors}
          style={[styles.sharedCard, { borderColor: colors.border, shadowColor: colors.shadow }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.actionIcons}>
              <View style={[styles.iconCircle, { backgroundColor: colors.surfaceSoft }]}>
                <Icon name={item.is_pinned ? "pin" : "pin-outline"} size={14} color={colors.textPrimary} />
              </View>
              <View style={[styles.iconCircle, { backgroundColor: colors.surfaceSoft }]}>
                <Icon name="eye" size={14} color={colors.textPrimary} />
              </View>
            </View>
          </View>

          <Text style={[styles.noteTitle, { color: colors.textPrimary }]}>{item.title}</Text>
          <Text style={[styles.noteContent, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.content || t("home.noContent")}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.permissionBadge}>
              <Icon name={item.can_edit || item.shared_can_edit ? "create-outline" : "eye-outline"} size={14} color={colors.textMuted} />
              <Text style={[styles.footerText, { color: colors.textMuted }]}> {permission}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.ownerName, { color: colors.textPrimary }]}>
                {item.owner_username || `User #${item.user_id}`}
              </Text>
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                <Icon name="calendar-outline" size={12} color={colors.textMuted} /> {formatDate(item.shared_at || item.updated_at)}
              </Text>
            </View>
          </View>
          <Text style={[styles.clickDetail, { color: colors.textMuted }]}>{t("home.tapDetails")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <AppHeader navigation={navigation} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.titleSection}>
            <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>{t("shared.title")}</Text>
            <Text style={[styles.statsText, { color: colors.textMuted }]}>
              {t("shared.count", { count: sharedNotes.length })}
            </Text>
          </View>

          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Icon name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              placeholder={t("common.searchByTitle")}
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 30 }} />
          ) : error ? (
            <Text style={[styles.statsText, { color: "#ff6b6b", paddingHorizontal: 20 }]}>{error}</Text>
          ) : (
            <FlatList
              data={filteredNotes}
              renderItem={renderSharedCard}
              keyExtractor={(item) => String(item.id)}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          )}
        </ScrollView>

        <AppBottomTab navigation={navigation} activeTab="Shared" />
      </SafeAreaView>
    </View>
  );
};

export default Shared;
