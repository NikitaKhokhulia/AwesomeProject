import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const PostsScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Ваш код для выполнения выхода (logout)
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
    <View style={styles.container}>
      <Text>PostsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutIconContainer: {
    marginRight: 20,
  },
});
