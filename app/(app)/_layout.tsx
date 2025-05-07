import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import PromptHeader from "../../components/PromptHeader";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          header: () => <PromptHeader />,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {},
});
