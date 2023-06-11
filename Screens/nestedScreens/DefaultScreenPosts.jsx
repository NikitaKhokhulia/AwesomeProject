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
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";

export const DefaultScreenPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const { login, email } = useSelector((state) => state.auth);

  const getAllPost = async () => {
    const snapshot = await getDocs(collection(db, "posts"));
    const fetchedPosts = [];

    for (const doc of snapshot.docs) {
      const commentsSnapshot = await getDocs(
        collection(db, `posts/${doc.id}/comments`)
      );
      const post = {
        ...doc.data(),
        id: doc.id,
        comments: commentsSnapshot.size,
      };
      fetchedPosts.push(post);
    }

    setPosts(fetchedPosts);
  };

  console.log("posts", posts);

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
            <Image
              source={{ uri: item.photo }}
              style={{ height: 240, marginBottom: 10 }}
            />
            <View style={styles.nameContainer}>
              <Text>{item.namePost}</Text>
            </View>
            <View>
              <Button
                title="go to map"
                onPress={() =>
                  navigation.navigate("Map", { location: item.location })
                }
              />
              <TouchableOpacity
                style={styles.commentContainer}
                onPress={() =>
                  navigation.navigate("Comments", { postId: item.id })
                }
              >
                <FontAwesome
                  name={item.comments ? "comment" : "comment-o"}
                  size={24}
                  color="#FF6C00"
                />
                <Text style={styles.commentCount}>{item.comments}</Text>
              </TouchableOpacity>
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
  nameContainer: {
    marginBottom: 10,
  },
});
