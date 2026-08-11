import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  primary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primaryGreen,
    borderRadius: 12,
    paddingVertical: 16,
  },
  primaryPressed: {
    opacity: 0.85,
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  outline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: colors.white,
  },
  outlinePressed: {
    backgroundColor: colors.white,
  },
  outlineLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  dangerOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.errorRed,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: colors.white,
  },
  dangerOutlinePressed: {
    backgroundColor: colors.white,
  },
  dangerOutlineLabel: {
    color: colors.errorRed,
    fontSize: 15,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.4,
  },
});
