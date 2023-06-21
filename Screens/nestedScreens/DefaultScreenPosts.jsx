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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
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

  const defaultAvatar = require("../../assets/avatar.jpg");

  return (
    <View style={styles.container}>
      <View
        style={{ marginTop: 32, flexDirection: "row", alignItems: "center" }}
      >
        <View style={{ marginRight: 8 }}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 16 }}
            source={defaultAvatar}
          />
        </View>
        <View>
          <Text>{login}</Text>
          <Text>{email}</Text>
        </View>
      </View>
      <FlatList
        style={{ marginTop: 32 }}
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
              <Text style={{ fontSize: 16, fontFamily: "Roboto-Medium" }}>
                {item.namePost}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", marginRight: 24 }}
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
                <Text style={{ marginLeft: 8, fontSize: 16 }}>
                  {item.comments}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ flexDirection: "row" }}>
                <AntDesign name="like2" size={24} color="#FF6C00" />
                <Text style={{ marginLeft: 8, fontSize: 16 }}></Text>
              </TouchableOpacity>

              <TouchableOpacity
                title="go to map"
                onPress={() =>
                  navigation.navigate("Map", { location: item.location })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  marginLeft: "auto",
                }}
              >
                <Feather
                  name="map-pin"
                  size={24}
                  color="black"
                  style={{
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    borderBottomWidth: 1,
                    fontSize: 16,
                    fontFamily: "Roboto-Medium",
                  }}
                >
                  {item.nameLocations ? item.nameLocations : null}
                </Text>
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
    backgroundColor: "#E5E5E5",
  },
  nameContainer: {
    marginBottom: 10,
  },
  logoutIconContainer: {
    marginRight: 20,
  },
});
