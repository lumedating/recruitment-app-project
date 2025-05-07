import Loading from "@/components/Loading";
import { globalStyles, globalStyleSheet } from "@/globalStyles";
import React, { useState } from "react";
import {
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

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handlePromptSubmit = async () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.promptTitle}>
        What is a bad first line for your award acceptance speech?
      </Text>

      <View style={{ height: 25 }}></View>

      <View style={globalStyleSheet.textInputContainer}>
        <Text style={globalStyleSheet.textInputTitle}>Answer The Prompt</Text>
        <TextInput
          style={globalStyleSheet.textAreaInput}
          placeholder="Type your answer here..."
          multiline={true}
          maxLength={350}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.promptButtonContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
      >
        {loading ? (
          <View style={styles.promptLoadingContainer}>
            <Loading size={hp(25)} />
          </View>
        ) : (
          <TouchableOpacity
            style={globalStyleSheet.formButton}
            onPress={handlePromptSubmit}
          >
            <Text style={globalStyleSheet.buttonText}>
              Post Response Publicly
            </Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    paddingHorizontal: 25,
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: globalStyles.colors.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  promptTitle: {
    fontSize: 36,
    fontFamily: globalStyles.fonts.primarySemiBold,
    lineHeight: 35,
  },
  promptButtonContainer: {
    flex: 1,
    width: "100%",
    position: "absolute",
    bottom: 135,
  },
  promptLoadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 65,
  },
});
