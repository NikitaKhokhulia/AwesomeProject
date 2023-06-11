import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

export const ProfileScreen = () => {
  const { userId } = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    const posts = await getDocs(q);
    const fetchedUserPosts = [];

    for (const doc of posts.docs) {
      const commentsSnapshot = await getDocs(
        collection(db, `posts/${doc.id}/comments`)
      );
      const post = {
        ...doc.data(),
        id: doc.id,
        comments: commentsSnapshot.size,
      };
      fetchedUserPosts.push(post);
    }

    setUserPosts(fetchedUserPosts);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userPosts}
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
    justifyContent: "center",
    paddingRight: 16,
    paddingLeft: 16,
  },
});
