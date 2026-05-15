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
import { styles } from "./SharedStyle";

const Shared = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

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
      colors: ["#4FC3F7", "#81D4FA"], // Gradient xanh dương
    },
    {
      id: "2",
      title: "Công thức nấu ăn",
      content:
        "Cách làm bánh flan: 4 quả trứng, 500ml sữa tươi, 100g đường, vani. Hấp cách thủy 30 phút.",
      date: "2026-05-05",
      owner: "Trần Thị B",
      permission: "Chỉ xem",
      colors: ["#FF8A80", "#FFAB91"], // Gradient hồng cam
    },
    {
      id: "3",
      title: "Địa điểm du lịch hè",
      content:
        "Danh sách các địa điểm đáng tham quan: Đà Lạt, Nha Trang, Phú Quốc, Sapa, Hội An.",
      date: "2026-05-01",
      owner: "Lê Văn C",
      permission: "Chỉ xem",
      colors: ["#4DB6AC", "#80CBC4"], // Gradient xanh lá
    },
  ];

  const renderSharedCard = ({ item }) => (
    <LinearGradient
      colors={item.colors}
      style={styles.sharedCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.actionIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <Icon name="pin" size={14} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Icon name="eye-off" size={14} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.permissionBadge}>
          <Icon name="eye-outline" size={14} color="#444" />
          <Text style={styles.footerText}> {item.permission}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.ownerName}>{item.owner}</Text>
          <Text style={styles.footerText}>
            <Icon name="calendar-outline" size={12} /> {item.date}
          </Text>
        </View>
      </View>
      <Text style={styles.clickDetail}>Nhấn để xem chi tiết</Text>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header giống trang Home */}
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
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            thumbColor="#fff"
            trackColor={{ true: "#BD00FF" }}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Ghi chú đã chia sẻ</Text>
            <Text style={styles.statsText}>👥 4 ghi chú · 0 đã ghim</Text>
          </View>

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

          <FlatList
            data={sharedNotes}
            renderItem={renderSharedCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </ScrollView>

        {/* Bottom Tab Bar */}
        <View style={styles.bottomTab}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate("Home")}
          >
            <Icon
              name="document-outline"
              size={22}
              color="rgba(255,255,255,0.4)"
            />
            <Text style={styles.tabLabel}>Ghi chú</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
            <Icon name="share-social" size={22} color="#fff" />
            <Text style={[styles.tabLabel, { color: "#fff" }]}>Chia sẻ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Icon
              name="trash-outline"
              size={22}
              color="rgba(255,255,255,0.4)"
            />
            <Text style={styles.tabLabel}>Thùng rác</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Icon
              name="person-outline"
              size={22}
              color="rgba(255,255,255,0.4)"
            />
            <Text style={styles.tabLabel}>Tài khoản</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Shared;
