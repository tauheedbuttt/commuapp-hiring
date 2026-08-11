import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBarBackground,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 8,
  },
  tabBarItem: {
    paddingTop: 0,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  activeIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryGreen,
  },
});
