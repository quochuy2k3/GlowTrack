import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import variables from "@/theme/commonColor";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Profile",
          headerShown: true,
        }}
      />
      <Text style={styles.title}>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: variables.scale(20),
    backgroundColor: "#fff",
  },
  title: {
    fontSize: variables.scale(24),
    fontWeight: "bold",
    marginTop: variables.scale(20),
  },
});
