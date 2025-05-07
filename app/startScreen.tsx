import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { globalStyles, globalStyleSheet } from "../globalStyles";

export default function StartScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Image
        style={styles.logo}
        source={require("../assets/images/Lume Logo.png")}
        resizeMode="contain"
      />

      <View style={styles.startScreenImageContainer}>
        <Image
          source={require("../assets/images/Friends Stock Image.jpg")}
          style={styles.startScreenImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.startScreenBottomContainer}>
        <View style={styles.startScreenButtonContainer}>
          <TouchableOpacity
            style={globalStyleSheet.button}
            onPress={() => router.push("/register")}
          >
            <Text style={globalStyleSheet.buttonText}>
              Create A New Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyleSheet.secondaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={globalStyleSheet.buttonText}>Login With Email</Text>
            <Image
              source={require("../assets/images/Email Icon.png")}
              resizeMode="contain"
              style={{ width: 25, marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.legalText}>
          By clicking continue you agree to our{" "}
          <Text style={styles.legalTextUnderline}>Terms & Conditions</Text> and{" "}
          <Text style={styles.legalTextUnderline}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 25,
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: globalStyles.colors.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  logo: {
    width: wp("50%"),
    marginLeft: -15,
  },
  startScreenImage: {
    width: "100%",
    height: "100%",
    padding: 10,
    borderRadius: 6,
  },
  startScreenImageContainer: {
    width: "100%",
    height: hp("40%"),
    borderColor: globalStyles.colors.line,
    borderWidth: 2,
    borderRadius: 12,
  },
  startScreenBottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 40,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  startScreenButtonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  startScreenLoadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 65,
  },
  legalText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: globalStyles.fonts.secondary,
    color: globalStyles.colors.secondaryText,
    marginTop: 15,
    width: 300,
    lineHeight: 16,
  },
  legalTextUnderline: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: globalStyles.fonts.secondary,
    color: globalStyles.colors.secondaryText,
    marginTop: 15,
    width: 300,
    lineHeight: 16,
    textDecorationLine: "underline",
  },
});
