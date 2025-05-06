import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Loading from "../components/Loading";
import { globalStyles, globalStyleSheet } from "./globalStyles";

export default function Login() {
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Image
        style={styles.logo}
        source={require("../assets/images/Lume Logo.png")}
        resizeMode="contain"
      />

      <View style={styles.loginImageContainer}>
        <Image
          source={require("../assets/images/Friends Stock Image.jpg")}
          style={styles.loginImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.loginBottomContainer}>
        <View style={styles.loginButtonContainer}>
          {loading ? (
            <View style={styles.loginLoadingContainer}>
              <Loading size={hp(25)} />
            </View>
          ) : (
            <TouchableOpacity style={globalStyleSheet.button}>
              <Text style={globalStyleSheet.buttonText}>
                Continue With Google
              </Text>
              <Image
                style={{ width: 25, marginLeft: 15 }}
                source={require("../assets/images/Google Logo.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
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
  loginImage: {
    width: "100%",
    height: "100%",
    padding: 10,
    borderRadius: 6,
  },
  loginImageContainer: {
    width: "100%",
    height: hp("40%"),
    borderColor: globalStyles.colors.line,
    borderWidth: 2,
    borderRadius: 12,
  },
  loginBottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 40,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  loginButtonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  loginLoadingContainer: {
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
