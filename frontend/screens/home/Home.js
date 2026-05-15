import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./HomeStyle";

const Home = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // Dữ liệu mẫu dựa trên image_bf2c9e.jpg
  const notes = [
    {
      id: "1",
      title: "Danh sách mua sắm",
      content: "Sữa, bánh mì, trứng, rau củ tươi, nước ép cam, bơ",
      date: "2026-05-10",
      type: "Riêng tư",
      color: "#FFD54F", // Vàng
      pinned: true,
    },
    {
      id: "2",
      title: "Ý tưởng dự án",
      content: "Tạo ứng dụng quản lý công việc với AI hỗ trợ",
      date: "2026-05-09",
      type: "Công khai",
      color: "#81D4FA", // Xanh dương
      pinned: false,
    },
    {
      id: "3",
      title: "Mục tiêu tháng 5",
      content: "Hoàn thành khóa học React, tập thể dục 3 lần/",
      date: "2026-05-01",
      type: "Riêng tư",
      color: "#80CBC4", // Xanh lá
      pinned: false,
    },
  ];

  const renderNoteCard = ({ item }) => (
    <View style={[styles.noteCard, { backgroundColor: item.color }]}>
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
          <Icon
            name={item.type === "Riêng tư" ? "lock-closed" : "earth"}
            size={12}
            color="#444"
          />
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <View style={styles.actionIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <Icon name="pin" size={14} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconCircle, { backgroundColor: "#ff5252" }]}
          >
            <Icon name="trash" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.noteTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.noteDate}>{item.date}</Text>
        <Text style={styles.detailText}>Nhấn để xem chi tiết</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <LinearGradient
              colors={["#FF007F", "#BD00FF"]}
              style={styles.avatar}
            >
              <Icon name="sparkles" size={20} color="#fff" />
            </LinearGradient>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.appName}>Notes</Text>
              <Text style={styles.userEmail}>huyhoang092005@gmail.co</Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: "#3e3e3e", true: "#BD00FF" }}
            thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* My Notes Title & New Button */}
          <View style={styles.titleSection}>
            <View>
              <Text style={styles.mainTitle}>Ghi chú của tôi</Text>
              <Text style={styles.statsText}>✨ 3 ghi chú · 0 đã ghim</Text>
            </View>
            <TouchableOpacity style={styles.btnCreateWrapper}>
              <LinearGradient
                colors={["#FF007F", "#BD00FF"]}
                style={styles.btnCreate}
              >
                <Icon name="add" size={20} color="#fff" />
                <Text style={styles.btnCreateText}>Tạo mới</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Icon
              name="search-outline"
              size={20}
              color="rgba(255,255,255,0.4)"
            />
            <TextInput
              placeholder="Tìm theo tiêu đề..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              style={styles.searchInput}
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

        {/* Bottom Navigation (Static) */}
        <View style={styles.container}>
          {/* ... nội dung trang chủ ... */}

          {/* Cập nhật Bottom Navigation */}
          <View style={styles.bottomTab}>
            <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
              <Icon name="document" size={22} color="#fff" />
              <Text style={[styles.tabLabel, { color: "#fff" }]}>Ghi chú</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => navigation.navigate("Shared")} // Chuyển sang trang Chia sẻ
            >
              <Icon
                name="share-social-outline"
                size={22}
                color="rgba(255,255,255,0.4)"
              />
              <Text style={styles.tabLabel}>Chia sẻ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabItem}>
              <Icon
                name="trash-outline"
                size={22}
                color="rgba(255,255,255,0.4)"
              />
              <Text style={styles.tabLabel}>Thùng rác</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => navigation.navigate("Profile")}
            >
              <Icon
                name="person-outline"
                size={22}
                color="rgba(255,255,255,0.4)"
              />
              <Text style={styles.tabLabel}>Tài khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const TabItem = ({ icon, label, active }) => (
  <TouchableOpacity style={[styles.tabItem, active && styles.tabItemActive]}>
    <Icon
      name={icon}
      size={22}
      color={active ? "#fff" : "rgba(255,255,255,0.4)"}
    />
    <Text
      style={[
        styles.tabLabel,
        { color: active ? "#fff" : "rgba(255,255,255,0.4)" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default Home;
