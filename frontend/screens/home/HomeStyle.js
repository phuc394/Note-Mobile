import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 2; // Tự động tính toán để vừa khít 2 cột

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08081a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  userEmail: { color: "rgba(255,255,255,0.4)", fontSize: 11 },

  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  mainTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  statsText: { color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 },

  btnCreateWrapper: {
    shadowColor: "#BD00FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  btnCreate: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },
  btnCreateText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  searchInput: { flex: 1, color: "#fff", marginLeft: 10 },

  row: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  noteCard: {
    width: cardWidth,
    borderRadius: 22,
    padding: 15,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeText: { fontSize: 10, color: "#333", marginLeft: 4, fontWeight: "600" },
  actionIcons: { flexDirection: "row", gap: 6 },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 6,
  },
  noteContent: { fontSize: 13, color: "#333", lineHeight: 18 },
  cardFooter: {
    marginTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 10,
  },
  noteDate: { fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: "600" },
  detailText: {
    fontSize: 10,
    color: "rgba(0,0,0,0.3)",
    marginTop: 8,
    textAlign: "center",
  },

  bottomTab: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: "rgba(20, 20, 45, 0.95)",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabItemActive: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 8,
    borderRadius: 15,
  },
  tabLabel: { fontSize: 10, marginTop: 4, color: "rgba(255,255,255,0.4)" },
});
