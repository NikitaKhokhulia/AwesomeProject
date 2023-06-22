import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableNativeFeedback,
  ImageBackground,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";

import { FontAwesome, Ionicons, Feather, AntDesign } from "@expo/vector-icons";

export const ProfileScreen = ({ navigation }) => {
  const { userId, login } = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);

  const selectedAvatar = useSelector((state) => state.auth.selectedAvatar);
  const defaultAvatar = require("../../assets/avatar.jpg");

  useEffect(() => {
    getUserPosts();
  }, []);
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
          <View style={styles.avatarContainer}>
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

          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{login}</Text>
            </View>
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

  avatarContainer: {
    position: "absolute",
    left: 129,
    right: 0,
    zIndex: 1,
    marginTop: 87,
  },
  avatar: {
    borderRadius: 16,
  },

  iconAddButton: {
    position: "absolute",
    top: 81,
    left: 107,
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 147,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingTop: 92,
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

  nameContainer: {
    marginBottom: 10,
  },
});
