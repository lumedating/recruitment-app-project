import { StyleSheet } from "react-native";

export const globalStyles = {
  colors: {
    primary: "#3040d0",
    background: "#f9f9f9",
    text: "#000000",
    secondaryText: "#7f7f7f",
    card: "#ffffff",
    line: "#d4d4d4",
  },
  fonts: {
    primary: "DGBold",
    secondary: "DMSans",
  },
};

export const globalStyleSheet = StyleSheet.create({
  button: {
    backgroundColor: globalStyles.colors.primary,
    paddingHorizontal: 25,
    borderRadius: 100,
    width: "100%",
    height: 65,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: globalStyles.colors.card,
    fontFamily: globalStyles.fonts.primary,
    fontSize: 24,
  },
});
