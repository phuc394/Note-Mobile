import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./SharedStyle";
import { useAppTheme } from "../../theme/AppTheme";
import AppHeader from "../../components/AppHeader";
import AppBottomTab from "../../components/AppBottomTab";

const Shared = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useAppTheme();

  // Dữ liệu mẫu từ image_bf2499.jpg
  const sharedNotes = [
    {
      id: "1",
      title: "Kế hoạch dự án Q2",
      content:
        "Các mục tiêu và nhiệm vụ cho quý 2 năm 2026. Tập trung vào phát triển sản phẩm mới và mở rộng thị",
      date: "2026-05-08",
      owner: "Nguyễn Văn A",
      permission: "Chỉ xem",
      colors: isDark ? [colors.surface, colors.surfaceSoft] : ["#FFF8ED", "#C7D7E5"],
    },
    {
      id: "2",
      title: "Công thức nấu ăn",
      content:
        "Cách làm bánh flan: 4 quả trứng, 500ml sữa tươi, 100g đường, vani. Hấp cách thủy 30 phút.",
      date: "2026-05-05",
      owner: "Trần Thị B",
      permission: "Chỉ xem",
      colors: isDark ? [colors.surface, colors.surfaceSoft] : ["#FFF8ED", "#E8C4C4"],
    },
    {
      id: "3",
      title: "Địa điểm du lịch hè",
      content:
        "Danh sách các địa điểm đáng tham quan: Đà Lạt, Nha Trang, Phú Quốc, Sapa, Hội An.",
      date: "2026-05-01",
      owner: "Lê Văn C",
      permission: "Chỉ xem",
      colors: isDark ? [colors.surface, colors.surfaceSoft] : ["#FFF8ED", "#CBD8C0"],
    },
  ];

  const renderSharedCard = ({ item }) => (
    <LinearGradient
      colors={item.colors}
      style={[styles.sharedCard, { borderColor: colors.border, shadowColor: colors.shadow }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.actionIcons}>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: colors.surfaceSoft }]}>
            <Icon name="pin" size={14} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: colors.surfaceSoft }]}>
            <Icon name="eye-off" size={14} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.noteTitle, { color: colors.textPrimary }]}>{item.title}</Text>
      <Text style={[styles.noteContent, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.content}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.permissionBadge}>
          <Icon name="eye-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.footerText, { color: colors.textMuted }]}> {item.permission}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.ownerName, { color: colors.textPrimary }]}>{item.owner}</Text>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            <Icon name="calendar-outline" size={12} color={colors.textMuted} /> {item.date}
          </Text>
        </View>
      </View>
      <Text style={[styles.clickDetail, { color: colors.textMuted }]}>Nhấn để xem chi tiết</Text>
    </LinearGradient>
  );

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
            <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>Ghi chú đã chia sẻ</Text>
            <Text style={[styles.statsText, { color: colors.textMuted }]}>👥 4 ghi chú · 0 đã ghim</Text>
          </View>

          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Icon name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              placeholder="Tìm theo tiêu đề..."
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.textPrimary }]}
            />
          </View>

          <FlatList
            data={sharedNotes}
            renderItem={renderSharedCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </ScrollView>

        <AppBottomTab navigation={navigation} activeTab="Shared" />
      </SafeAreaView>
    </View>
  );
};

export default Shared;
