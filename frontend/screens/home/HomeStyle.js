import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 2;

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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  userEmail: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 25,
  },
  mainTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  statsText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    marginTop: 5,
  },
  btnCreateWrapper: {
    shadowColor: "#BD00FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  btnCreate: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  btnCreateText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 25,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 10,
  },
  noteCard: {
    width: cardWidth,
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 10,
    color: "#444",
    marginLeft: 4,
    fontWeight: "600",
  },
  actionIcons: {
    flexDirection: "row",
    gap: 5,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
  },
  cardFooter: {
    marginTop: 15,
  },
  noteDate: {
    fontSize: 11,
    color: "rgba(0,0,0,0.4)",
    fontWeight: "600",
  },
  detailText: {
    fontSize: 11,
    color: "rgba(0,0,0,0.3)",
    textAlign: "center",
    marginTop: 10,
  },
  bottomTab: {
    position: "absolute",
    bottom: 20,
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
  tabItem: {
    alignItems: "center",
    padding: 10,
  },
  tabItemActive: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "rgba(255,255,255,0.4)",
  },
});
