import React, { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultScreenPosts } from "../nestedScreens/DefaultScreenPosts";
import { CommentsScreen } from "../nestedScreens/CommentsScreen";
import { MapScreen } from "../nestedScreens/MapScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { authSingOutUser } from "../../Redux/auth/authOperations";

const NestedScreen = createStackNavigator();

export const PostsScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log("выход");
    dispatch(authSingOutUser());
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.logoutIconContainer}>
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color="#BDBDBD"
            onPress={handleLogout}
          />
        </View>
      ),
    });
  }, [navigation]);
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreenPosts}
      />
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutIconContainer: {
    marginRight: 20,
  },
});
