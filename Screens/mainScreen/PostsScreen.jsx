import React, { useLayoutEffect } from "react";

import { View, StyleSheet } from "react-native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { DefaultScreenPosts } from "../nestedScreens/DefaultScreenPosts";
import { CommentsScreen } from "../nestedScreens/CommentsScreen";
import { MapScreen } from "../nestedScreens/MapScreen";

const NestedScreen = createStackNavigator();

export const PostsScreen = ({}) => {
  return (
    <NestedScreen.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS, // Пример анимации перехода
      }}
    >
      <NestedScreen.Screen
        options={{ title: "Публікації" }}
        name="DefaultScreen"
        component={DefaultScreenPosts}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{ title: "Коментарі" }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "Карта" }}
      />
    </NestedScreen.Navigator>
  );
};

const styles = StyleSheet.create({});
