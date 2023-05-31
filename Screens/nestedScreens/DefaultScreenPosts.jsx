import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
} from "react-native";

import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const DefaultScreenPosts = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);

  const getAllPost = async () => {
    const snapshot = await getDocs(collection(db, "posts"));
    setPosts(
      snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  };

  console.log(posts);

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 34,
              justifyContent: "center",
            }}
          >
            <Image source={{ uri: item.photo }} style={{ height: 240 }} />
            <View>
              <Text>{item.namePost}</Text>
            </View>
            <View>
              <Button
                title="go to map"
                onPress={() =>
                  navigation.navigate("Map", { location: item.location })
                }
              />
              <Button
                title="go to comments"
                onPress={() =>
                  navigation.navigate("Comments", { postId: item.id })
                }
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 16,
    paddingLeft: 16,
  },
});
