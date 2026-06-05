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
  Platform,
  useWindowDimensions,
  UIManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { styles } from "./HomeStyle";
import { useAppTheme } from "../../theme/AppTheme";
import AppHeader from "../../components/AppHeader";
import AppBottomTab from "../../components/AppBottomTab";
import { createNote, deleteNote, fetchNotes, togglePinNote } from "../../redux/notesSlice";

const lightCardColors = ["#E7CFA4", "#C7D7E5", "#CBD8C0", "#E8C4C4"];
const darkCardColors = ["#2B2A4E", "#20364F", "#203F39", "#4A2F3B"];

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Home = ({ navigation }) => {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const { items: notes, loading, error } = useSelector((state) => state.notes);
  const [searchText, setSearchText] = useState("");
  const noteCardWidth = (width - 42) / 2;

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const filteredNotes = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return notes;

    return notes.filter((note) =>
      `${note.title ?? ""} ${note.content ?? ""}`.toLowerCase().includes(keyword)
    );
  }, [notes, searchText]);

  const pinnedCount = notes.filter((note) => note.is_pinned).length;
  const hasPinnedNotes = pinnedCount > 0;
  const pinnedNotes = useMemo(
    () => filteredNotes.filter((note) => note.is_pinned),
    [filteredNotes]
  );
  const otherNotes = useMemo(
    () => filteredNotes.filter((note) => !note.is_pinned),
    [filteredNotes]
  );

  const handleCreate = async () => {
    const title = t("home.newNoteTitle", { count: notes.length + 1 });
    try {
      const note = await dispatch(createNote({ title, content: "" })).unwrap();
      navigation.navigate("NoteDetails", { noteId: note.id });
    } catch (_error) {
      // Redux error is rendered in the screen.
    }
  };

  const handleTogglePin = (item) => {
    dispatch(togglePinNote({ id: item.id, is_pinned: !item.is_pinned }));
  };

  const handleDelete = (id) => {
    dispatch(deleteNote(id));
  };

  const renderNoteCard = ({ item, index }) => {
    const palette = isDark ? darkCardColors : lightCardColors;
    const type = item.is_public ? t("home.public") : t("home.private");

    return (
      <TouchableOpacity
        style={[
          styles.noteCard,
          {
            width: noteCardWidth,
            backgroundColor: palette[index % palette.length],
          },
        ]}
        onPress={() => navigation.navigate("NoteDetails", { noteId: item.id })}
        activeOpacity={0.88}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.typeBadge, { backgroundColor: colors.surfaceSoft }]}>
            <Icon
              name={item.is_public ? "earth" : "lock-closed"}
              size={12}
              color={colors.textPrimary}
            />
            <Text style={[styles.typeText, { color: colors.textSecondary }]}>{type}</Text>
          </View>
          <View style={styles.actionIcons}>
            <TouchableOpacity
              style={[styles.iconCircle, { backgroundColor: colors.surfaceSoft }]}
              onPress={() => handleTogglePin(item)}
            >
              <Icon name={item.is_pinned ? "pin" : "pin-outline"} size={14} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconCircle, { backgroundColor: isDark ? colors.accentStrong : "#ff5252" }]}
              onPress={() => handleDelete(item.id)}
            >
              <Icon name="trash" size={14} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.noteTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.noteContent, { color: colors.textSecondary }]} numberOfLines={3}>
          {item.content || t("home.noContent")}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={[styles.noteDate, { color: colors.textMuted }]}>
            {formatDate(item.updated_at || item.created_at)}
          </Text>
          <Text style={[styles.detailText, { color: colors.textMuted }]}>{t("home.tapDetails")}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNotesGrid = (items) => (
    <FlatList
      data={items}
      renderItem={renderNoteCard}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
    />
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
            <View>
              <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>{t("home.myNotes")}</Text>
              <Text style={[styles.statsText, { color: colors.textMuted }]}>
                {t("home.stats", { count: notes.length, pinned: pinnedCount })}
              </Text>
            </View>
            <TouchableOpacity style={styles.btnCreateWrapper} onPress={handleCreate}>
              <LinearGradient colors={colors.buttonGradient} style={styles.btnCreate}>
                <Icon name="add" size={20} color={colors.onPrimary} />
                <Text style={[styles.btnCreateText, { color: colors.onPrimary }]}>{t("home.new")}</Text>
              </LinearGradient>
            </TouchableOpacity>
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
          ) : hasPinnedNotes ? (
            <View>
              {pinnedNotes.length > 0 ? (
                <View style={styles.notesSection}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t("home.pinnedNote")}</Text>
                  {renderNotesGrid(pinnedNotes)}
                </View>
              ) : null}

              {otherNotes.length > 0 ? (
                <View style={styles.notesSection}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t("home.otherNotes")}</Text>
                  {renderNotesGrid(otherNotes)}
                </View>
              ) : null}
            </View>
          ) : (
            renderNotesGrid(filteredNotes)
          )}
        </ScrollView>

        <AppBottomTab navigation={navigation} activeTab="Home" />
      </SafeAreaView>
    </View>
  );
};

export default Home;
