import FeedHeader from "@/components/feedHeader";
import PromptHeader from "@/components/PromptHeader";
import { FirestoreContextProvider } from "@/context/firestoreContext";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function _layout() {
  return (
    <FirestoreContextProvider>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            header: () => <PromptHeader />,
          }}
        />
        <Stack.Screen
          name="feed"
          options={{
            header: () => <FeedHeader />,
          }}
        />
      </Stack>
    </FirestoreContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {},
});
