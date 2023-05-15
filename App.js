//
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableNativeFeedback,
} from "react-native";
import { RegistrationScreen } from "./Screens/RegistrationScreen";
import { LoginScreen } from "./Screens/LoginScreen";
import { useState } from "react";
import { useFonts } from "expo-font";

export default function App() {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  const handleInputFocus = () => {
    setIsShowKeyboard(true);
  };

  const handleInputBlur = () => {
    setIsShowKeyboard(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
    >
      <TouchableNativeFeedback onPress={() => Keyboard.dismiss()}>
        <ImageBackground
          style={styles.imageBg}
          source={require("./assets/BG.jpg")}
        >
          <RegistrationScreen
            isShowKeyboard={isShowKeyboard}
            setIsShowKeyboard={setIsShowKeyboard}
            handleInputFocus={handleInputFocus}
            handleInputBlur={handleInputBlur}
          />
          {/* <LoginScreen
            isShowKeyboard={isShowKeyboard}
            setIsShowKeyboard={setIsShowKeyboard}
            handleInputFocus={handleInputFocus}
            handleInputBlur={handleInputBlur}
          /> */}
        </ImageBackground>
      </TouchableNativeFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  imageBg: {
    position: "relative",
    flex: 1,
  },
});
