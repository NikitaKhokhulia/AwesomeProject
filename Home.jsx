import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { RegistrationScreen } from "./Screens/auth/RegistrationScreen";
import { LoginScreen } from "./Screens/auth/LoginScreen";
import { PostsScreen } from "./Screens/mainScreen/PostsScreen";
import { CreatePostsScreen } from "./Screens/mainScreen/CreatePostsScreen";
import { ProfileScreen } from "./Screens/mainScreen/ProfileScreen";
import { MapScreen } from "./Screens/nestedScreens/MapScreen";

import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";

import { View, StyleSheet } from "react-native";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const Home = ({ isAuth, setIsAuth }) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen options={{ headerShown: false }} name="Login">
          {(props) => <LoginScreen {...props} setIsAuth={setIsAuth} />}
        </AuthStack.Screen>
        <AuthStack.Screen options={{ headerShown: false }} name="Registration">
          {(props) => <RegistrationScreen {...props} setIsAuth={setIsAuth} />}
        </AuthStack.Screen>
      </AuthStack.Navigator>
    );
  }

  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <MainTab.Screen
        options={{
          title: "Публикации",
          tabBarIcon: ({}) => (
            <MaterialCommunityIcons
              name="vector-square"
              size={24}
              color="#212121"
              focused={false}
            />
          ),
          tabBarItemStyle: { left: 40 },
        }}
        name="Posts"
        component={PostsScreen}
      />
      <MainTab.Screen
        options={{
          title: "Создать публикацию",
          tabBarIcon: ({}) => (
            <View style={styles.createPostIcon}>
              <AntDesign name="plus" size={18} color="#ffffff" />
            </View>
          ),
        }}
        name="CreatePosts"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          title: "",
          tabBarIcon: ({}) => (
            <Ionicons name="person-outline" size={24} color="black" />
          ),
          tabBarItemStyle: { right: 40 },
        }}
        name="Profile"
        component={ProfileScreen}
      />
      {/* <MainTab.Screen
        options={{
          title: "",
          tabBarIcon: ({}) => (
            <Ionicons name="person-outline" size={24} color="black" />
          ),
        }}
        name="Map"
        component={MapScreen}
      /> */}
    </MainTab.Navigator>
  );
};

const styles = StyleSheet.create({
  createPostIcon: {
    width: 70,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6C00",
  },
});
