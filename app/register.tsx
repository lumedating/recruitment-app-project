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
import { useAuth } from "../context/authContext";
import { globalStyles, globalStyleSheet } from "../globalStyles";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleRegister = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Register", "Please fill out all of the fields");
    }

    setLoading(true);

    let response = await register(emailRef.current, passwordRef.current);
    setLoading(false);

    console.log("RESULTS: ", response);

    if (!response.success) {
      Alert.alert("Register", response.msg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.registerTopContainer}>
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

        <Text style={globalStyleSheet.pageTitle}>Register</Text>

        <View style={styles.registerTopPlaceholder} />
      </View>

      <View style={{ height: 5 }} />

      <Text style={globalStyleSheet.title}>Welcome To Lume!</Text>

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
        style={styles.registerButtonContainer}
      >
        {loading ? (
          <View style={styles.registerLoadingContainer}>
            <Loading size={hp(25)} />
          </View>
        ) : (
          <TouchableOpacity
            style={globalStyleSheet.formButton}
            onPress={handleRegister}
          >
            <Text style={globalStyleSheet.buttonText}>
              Create A New Account
            </Text>
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
  registerBottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 40,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  registerButtonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
    marginBottom: 25,
    borderBottomColor: globalStyles.colors.background,
    borderBottomWidth: 15,
  },
  registerLoadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 65,
  },
  registerTopContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  registerTopPlaceholder: {
    width: 50,
    height: 50,
  },
});
