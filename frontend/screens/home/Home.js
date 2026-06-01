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
import { styles } from "./HomeStyle";
import { useAppTheme } from "../../theme/AppTheme";
import AppHeader from "../../components/AppHeader";
import AppBottomTab from "../../components/AppBottomTab";

const Home = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useAppTheme();

  // Dữ liệu mẫu dựa trên image_bf2c9e.jpg
  const notes = [
    {
      id: "1",
      title: "Danh sách mua sắm",
      content: "Sữa, bánh mì, trứng, rau củ tươi, nước ép cam, bơ",
      date: "2026-05-10",
      type: "Riêng tư",
      color: isDark ? "#2B2A4E" : "#E7CFA4",
      pinned: true,
    },
    {
      id: "2",
      title: "Ý tưởng dự án",
      content: "Tạo ứng dụng quản lý công việc với AI hỗ trợ",
      date: "2026-05-09",
      type: "Công khai",
      color: isDark ? "#20364F" : "#C7D7E5",
      pinned: false,
    },
    {
      id: "3",
      title: "Mục tiêu tháng 5",
      content: "Hoàn thành khóa học React, tập thể dục 3 lần/",
      date: "2026-05-01",
      type: "Riêng tư",
      color: isDark ? "#203F39" : "#CBD8C0",
      pinned: false,
    },
  ];

  const renderNoteCard = ({ item }) => (
    <View style={[styles.noteCard, { backgroundColor: item.color }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, { backgroundColor: colors.surfaceSoft }]}>
          <Icon
            name={item.type === "Riêng tư" ? "lock-closed" : "earth"}
            size={12}
            color={colors.textPrimary}
          />
          <Text style={[styles.typeText, { color: colors.textSecondary }]}>{item.type}</Text>
        </View>
        <View style={styles.actionIcons}>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: colors.surfaceSoft }]}>
            <Icon name="pin" size={14} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconCircle, { backgroundColor: isDark ? colors.accentStrong : "#ff5252" }]}
          >
            <Icon name="trash" size={14} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.noteTitle, { color: colors.textPrimary }]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.noteContent, { color: colors.textSecondary }]} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={[styles.noteDate, { color: colors.textMuted }]}>{item.date}</Text>
        <Text style={[styles.detailText, { color: colors.textMuted }]}>Nhấn để xem chi tiết</Text>
      </View>
    </View>
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
          {/* My Notes Title & New Button */}
          <View style={styles.titleSection}>
            <View>
              <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>Ghi chú của tôi</Text>
              <Text style={[styles.statsText, { color: colors.textMuted }]}>✨ 3 ghi chú · 0 đã ghim</Text>
            </View>
            <TouchableOpacity style={styles.btnCreateWrapper}>
              <LinearGradient
                colors={colors.buttonGradient}
                style={styles.btnCreate}
              >
                <Icon name="add" size={20} color={colors.onPrimary} />
                <Text style={[styles.btnCreateText, { color: colors.onPrimary }]}>Tạo mới</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Icon name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              placeholder="Tìm theo tiêu đề..."
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.textPrimary }]}
            />
          </View>

          {/* Notes Grid */}
          <FlatList
            data={notes}
            renderItem={renderNoteCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          />
        </ScrollView>

        <AppBottomTab navigation={navigation} activeTab="Home" />
      </SafeAreaView>
    </View>
  );
};

export default Home;
