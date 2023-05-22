//
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Home } from "./Home";

import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { KeyboardProvider } from "./Components/KeyboardContext";

export default function App() {
  const routing = Home(true);
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardProvider>
      <NavigationContainer>{routing}</NavigationContainer>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({});
