import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import "./globals.css";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header for all screens
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        }, // Set background color based on theme
      }}
    >
      {/* Define your screens here */}
      <Stack.Screen
        name="index" // This corresponds to `app/index.tsx`
        options={{ title: "Home" }} // Optional: Set a title for the screen
      />
    </Stack>
  );
}
