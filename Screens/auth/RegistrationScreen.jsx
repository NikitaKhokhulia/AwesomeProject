import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableNativeFeedback,
} from "react-native";
import React, { useState, useContext } from "react";
import { KeyboardContext } from "../../Components/KeyboardContext";
import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import {
  authSingUpUser,
  setSelectedAvatarUser,
} from "../../Redux/auth/authOperations";

const initialState = {
  login: "",
  email: "",
  password: "",
};

export const RegistrationScreen = ({ navigation, setIsAuth }) => {
  const { isShowKeyboard, setIsShowKeyboard } = useContext(KeyboardContext);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [state, setState] = useState(initialState);

  const selectedAvatar = useSelector((state) => state.auth.selectedAvatar);
  console.log(selectedAvatar);
  const dispatch = useDispatch();

  const handleSelectAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Разрешение на доступ к галерее не предоставлено");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAvatar = result.assets[0].uri;
      dispatch(setSelectedAvatarUser(selectedAvatar)); // Диспатч выбранного аватара
    }
  };

  const togglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleRegister = () => {
    console.log("Регистрация:", state);
    dispatch(authSingUpUser({ ...state, avatar: selectedAvatar }));
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    setState(initialState);
  };

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleInputFocus = () => {
    setIsShowKeyboard(true);
  };

  const handleInputBlur = () => {
    setIsShowKeyboard(false);
  };

  const defaultAvatar = require("../../assets/avatar.jpg");

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
    >
      <TouchableNativeFeedback onPress={() => Keyboard.dismiss()}>
        <ImageBackground
          style={styles.imageBg}
          source={require("../../assets/BG.jpg")}
        >
          <View
            style={{
              ...styles.avatarContainer,
              top: isShowKeyboard ? 87 : 203,
            }}
          >
            <Image
              style={styles.avatar}
              source={selectedAvatar ? { uri: selectedAvatar } : defaultAvatar}
            />
            <TouchableOpacity
              style={styles.iconAddButton}
              onPress={handleSelectAvatar}
            >
              <Ionicons name="add-circle-outline" size={27} color="orange" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.container,
              marginTop: isShowKeyboard ? 147 : 263,
            }}
          >
            <View style={styles.form}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Реєстрація</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Логин"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                value={state.login}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, login: value }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Адрес электронной почты"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                value={state.email}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, email: value }))
                }
              />
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Пароль"
                  secureTextEntry={!isPasswordVisible}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  value={state.password}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
                <TouchableOpacity
                  style={styles.showPasswordButton}
                  onPress={togglePassword}
                >
                  <Text style={styles.showPasswordButtonText}>
                    {isPasswordVisible ? "Скрыть" : "Показать"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.btn}
              onPress={handleRegister}
            >
              <Text style={{ color: "#fff" }}>Зарегистрироваться</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLoginPress}
              style={styles.loginLink}
            >
              <Text style={styles.loginLink}>Уже есть аккаунт? Войти</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableNativeFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  imageBg: {
    position: "relative",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingTop: 92,
  },
  avatarContainer: {
    position: "absolute",
    left: 129,
    right: 0,
    zIndex: 1,
  },
  avatar: {
    borderRadius: 16,
  },
  iconAddButton: {
    position: "absolute",
    top: 81,
    left: 107,
  },

  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 33,
  },
  title: {
    fontSize: 30,
    fontFamily: "Roboto-Medium",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#E8E8E8",
    color: "#212121",
    padding: 16,
  },

  btn: {
    backgroundColor: "#FF6C00",
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  passwordInputContainer: {
    position: "relative",
  },

  showPasswordButton: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -18 }],
    zIndex: 1,
  },
  showPasswordButtonText: {
    color: "#1B4371",
  },
  loginLink: {
    justifyContent: "center",
    alignItems: "center",
    color: "#1B4371",
    marginBottom: 40,
  },
});
