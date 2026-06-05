import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { styles } from "./DeleteStyle";
import { useAppTheme } from "../../theme/AppTheme";
import AppHeader from "../../components/AppHeader";
import AppBottomTab from "../../components/AppBottomTab";
import {
  deleteAllDeletedNotes,
  deleteDeletedNote,
  fetchDeletedNotes,
  restoreDeletedNote,
} from "../../redux/deletedSlice";

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

const Delete = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: deletedNotes, loading, error } = useSelector((state) => state.deleted);
  const [searchText, setSearchText] = useState("");
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  useEffect(() => {
    dispatch(fetchDeletedNotes());
  }, [dispatch]);

  const filteredNotes = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    if (!normalizedSearch) {
      return deletedNotes;
    }

    return deletedNotes.filter((note) =>
      `${note.title ?? ""} ${note.content ?? ""}`.toLowerCase().includes(normalizedSearch)
    );
  }, [deletedNotes, searchText]);

  const handleDeleteAll = () => {
    dispatch(deleteAllDeletedNotes());
    setShowDeleteAllModal(false);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.cardContent, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.content || t("home.noContent")}
      </Text>
      <Text style={[styles.cardMeta, { color: colors.textMuted }]}>
        {t("trash.deleted", { date: formatDate(item.deleted_at || item.updated_at) })}
      </Text>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[
            styles.restoreBtn,
            {
              backgroundColor: colors.buttonGradient[0],
              shadowColor: colors.primary,
            },
          ]}
          onPress={() => dispatch(restoreDeletedNote(item.id))}
          activeOpacity={0.85}
        >
          <Icon name="refresh-outline" size={16} color={colors.onPrimary} />
          <Text style={[styles.restoreText, { color: colors.onPrimary }]}>{t("trash.restore")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deleteBtn,
            {
              backgroundColor: isDark ? colors.accentStrong : "#C45A4A",
              shadowColor: colors.shadow,
            },
          ]}
          onPress={() => dispatch(deleteDeletedNote(item.id))}
          activeOpacity={0.85}
        >
          <Icon name="close" size={18} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <AppHeader navigation={navigation} showBack backTarget="Home" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.titleSection}>
            <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>{t("trash.title")}</Text>
            <Text style={[styles.statsText, { color: colors.textMuted }]}>
              {t("trash.stats", { count: filteredNotes.length })}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.deleteAllBtn,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.shadow,
              },
            ]}
            onPress={() => setShowDeleteAllModal(true)}
            activeOpacity={0.85}
          >
            <Icon name="trash-outline" size={16} color={colors.onPrimary} />
            <Text style={[styles.deleteAllText, { color: colors.onPrimary }]}>{t("common.deleteAll")}</Text>
          </TouchableOpacity>

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
          ) : filteredNotes.length > 0 ? (
            <FlatList
              data={filteredNotes}
              renderItem={renderItem}
              keyExtractor={(item) => String(item.id)}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIconWrap,
                  { backgroundColor: isDark ? colors.surfaceSoft : "#EADBC8" },
                ]}
              >
                <Icon
                  name="trash-outline"
                  size={36}
                  color={isDark ? colors.primary : "#caa7ff"}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>{t("trash.emptyTitle")}</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {t("trash.emptyText")}
              </Text>
            </View>
          )}
        </ScrollView>

        <AppBottomTab navigation={navigation} activeTab="Delete" />

        <Modal
          transparent
          visible={showDeleteAllModal}
          animationType="fade"
          onRequestClose={() => setShowDeleteAllModal(false)}
        >
          <Pressable
            style={[
              styles.modalOverlay,
              { backgroundColor: isDark ? "rgba(10,10,24,0.72)" : "rgba(63,44,28,0.32)" },
            ]}
            onPress={() => setShowDeleteAllModal(false)}
          >
            <Pressable
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={() => {}}
            >
              <View style={[styles.modalIcon, { backgroundColor: colors.surfaceSoft }]}>
                <Icon name="trash-outline" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t("trash.emptyTrashTitle")}</Text>
              <Text style={[styles.modalText, { color: colors.textMuted }]}>
                {t("trash.emptyTrashText")}
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalCancel, { borderColor: colors.border, backgroundColor: colors.surfaceSoft }]}
                  onPress={() => setShowDeleteAllModal(false)}
                >
                  <Text style={[styles.modalCancelText, { color: colors.textPrimary }]}>{t("common.cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalConfirm, { backgroundColor: colors.primary }]}
                  onPress={handleDeleteAll}
                >
                  <Text style={[styles.modalConfirmText, { color: colors.onPrimary }]}>{t("common.deleteAll")}</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default Delete;
