import React, { useMemo, useState } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./DeleteStyle";
import { useAppTheme } from "../../theme/AppTheme";
import AppHeader from "../../components/AppHeader";
import AppBottomTab from "../../components/AppBottomTab";

const initialDeletedNotes = [
  {
    id: "1",
    title: "Ghi chú cũ",
    content: "Nội dung không còn cần thiết",
    date: "2026-05-09",
  },
  {
    id: "2",
    title: "Danh sách việc cũ",
    content: "Các công việc đã hoàn thành từ tuần trước",
    date: "2026-05-07",
  },
  {
    id: "3",
    title: "Nháp email",
    content: "Nội dung email gửi cho khách hàng ABC tháng 4",
    date: "2026-05-05",
  },
];

const Delete = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const [searchText, setSearchText] = useState("");
  const [deletedNotes, setDeletedNotes] = useState(initialDeletedNotes);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const filteredNotes = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    if (!normalizedSearch) {
      return deletedNotes;
    }

    return deletedNotes.filter((note) => {
      return (
        note.title.toLowerCase().includes(normalizedSearch) ||
        note.content.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [deletedNotes, searchText]);

  const handleRestore = (noteId) => {
    setDeletedNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId)
    );
  };

  const handleDeletePermanent = (noteId) => {
    setDeletedNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId)
    );
  };

  const handleDeleteAll = () => {
    setDeletedNotes([]);
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
        {item.content}
      </Text>
      <Text style={[styles.cardMeta, { color: colors.textMuted }]}>Đã xóa: {item.date}</Text>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[
            styles.restoreBtn,
            {
              backgroundColor: colors.buttonGradient[0],
              shadowColor: colors.primary,
            },
          ]}
          onPress={() => handleRestore(item.id)}
          activeOpacity={0.85}
        >
          <Icon name="refresh-outline" size={16} color={colors.onPrimary} />
          <Text style={[styles.restoreText, { color: colors.onPrimary }]}>Khôi phục</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deleteBtn,
            {
              backgroundColor: isDark ? colors.accentStrong : "#C45A4A",
              shadowColor: colors.shadow,
            },
          ]}
          onPress={() => handleDeletePermanent(item.id)}
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
            <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>Thùng rác</Text>
            <Text style={[styles.statsText, { color: colors.textMuted }]}>
              {filteredNotes.length} ghi chú · Tự xóa sau 30 ngày
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
            <Text style={[styles.deleteAllText, { color: colors.onPrimary }]}>Xóa tất cả</Text>
          </TouchableOpacity>

          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Icon name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              placeholder="Tìm theo tiêu đề..."
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {filteredNotes.length > 0 ? (
            <FlatList
              data={filteredNotes}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
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
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Thùng rác trống</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Các ghi chú đã xóa sẽ xuất hiện ở đây
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
              <View
                style={[
                  styles.modalIcon,
                  { backgroundColor: colors.surfaceSoft },
                ]}
              >
                <Icon name="trash-outline" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Làm trống thùng rác?</Text>
              <Text style={[styles.modalText, { color: colors.textMuted }]}>
                Tất cả ghi chú sẽ bị xóa vĩnh viễn và không thể khôi phục.
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalCancel,
                    { borderColor: colors.border, backgroundColor: colors.surfaceSoft },
                  ]}
                  onPress={() => setShowDeleteAllModal(false)}
                >
                  <Text style={[styles.modalCancelText, { color: colors.textPrimary }]}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalConfirm,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleDeleteAll}
                >
                  <Text style={[styles.modalConfirmText, { color: colors.onPrimary }]}>Xóa tất cả</Text>
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