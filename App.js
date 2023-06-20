//
import "react-native-gesture-handler";
import React from "react";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { Main } from "./Components/Main";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
