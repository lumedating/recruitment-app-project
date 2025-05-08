import { useAuth } from "@/context/authContext";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles, globalStyleSheet } from "../globalStyles";

export default function FeedHeader() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={globalStyleSheet.iconButton}
        onPress={handleLogout}
      >
        <Image
          source={require("../assets/images/Logout Icon.png")}
          resizeMode="contain"
          style={{ width: 25 }}
        ></Image>
      </TouchableOpacity>

      <Text style={globalStyleSheet.pageTitle}>Today's Responses</Text>

      <View style={styles.headerPlaceholder}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 55,
    paddingHorizontal: 25,
    backgroundColor: globalStyles.colors.background,
  },
  headerPlaceholder: {
    width: 50,
    height: 50,
  },
});
