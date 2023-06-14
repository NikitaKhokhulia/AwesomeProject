import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { authSingOutUser } from "../../Redux/auth/authOperations";

export const DefaultScreenPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const { login, email } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

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

  useFocusEffect(
    useCallback(() => {
      getAllPost();
    }, [])
  );

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
              style={{ height: 240, marginBottom: 10, borderRadius: 8 }}
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
                  navigation.navigate("Comments", {
                    postId: item.id,
                    photo: item.photo,
                  })
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
  logoutIconContainer: {
    marginRight: 20,
  },
});
