import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Loading from "../components/Loading";
import { globalStyles, globalStyleSheet } from "../globalStyles";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all of the fields!");
    }

    setLoading(true);

    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);

    if (!response.success) {
      Alert.alert("Login", response.msg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginTopContainer}>
        <TouchableOpacity
          style={globalStyleSheet.iconButton}
          onPress={() => {
            router.push("/startScreen");
          }}
        >
          <Image
            source={require("../assets/images/Back Icon.png")}
            resizeMode="contain"
            style={{ width: 25 }}
          />
        </TouchableOpacity>

        <Text style={globalStyleSheet.pageTitle}>Login</Text>

        <View style={styles.loginTopPlaceholder} />
      </View>

      <View style={{ height: 5 }} />

      <Text style={globalStyleSheet.title}>Welcome Back!</Text>

      <View style={{ height: 35 }} />

      <View style={globalStyleSheet.textInputContainer}>
        <Text style={globalStyleSheet.textInputTitle}>Email Address</Text>
        <TextInput
          onChangeText={(value) => (emailRef.current = value)}
          style={globalStyleSheet.textInput}
          placeholder="fake@gmail.com"
          placeholderTextColor={globalStyles.colors.secondaryText}
        />
      </View>

      <View style={globalStyleSheet.textInputContainer}>
        <Text style={globalStyleSheet.textInputTitle}>Password</Text>
        <TextInput
          onChangeText={(value) => (passwordRef.current = value)}
          style={globalStyleSheet.textInput}
          placeholder="lumerocks123!"
          placeholderTextColor={globalStyles.colors.secondaryText}
          secureTextEntry={true}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.loginButtonContainer}
      >
        {loading ? (
          <View style={styles.loginLoadingContainer}>
            <Loading size={hp(25)} />
          </View>
        ) : (
          <TouchableOpacity
            style={globalStyleSheet.formButton}
            onPress={handleLogin}
          >
            <Text style={globalStyleSheet.buttonText}>Login With Email</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 55,
    paddingHorizontal: 25,
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: globalStyles.colors.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
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
    position: "absolute",
    bottom: 0,
    marginBottom: 25,
    borderBottomColor: globalStyles.colors.background,
    borderBottomWidth: 15,
  },
  loginLoadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 65,
  },
  loginTopContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  loginTopPlaceholder: {
    width: 50,
    height: 50,
  },
});
