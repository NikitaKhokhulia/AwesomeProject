import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { collection, doc, addDoc, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export const CommentsScreen = ({ route }) => {
  const { postId, photo } = route.params;
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const { login } = useSelector((state) => state.auth);

  const createComment = async () => {
    const commentData = {
      comment,
      login,
      timestamp: formatTimestamp(new Date().getTime()),
    };

    try {
      const postRef = doc(db, "posts", postId);
      const commentsCollectionRef = collection(postRef, "comments");
      const docRef = await addDoc(commentsCollectionRef, commentData);
      console.log("Comment added with ID: ", docRef.id);
      setComment(""); // Очистить поле комментария после отправки
      setAllComments((prevComments) => [...prevComments, commentData]);
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  useEffect(() => {
    getAllComments();
  }, []);

  const getAllComments = async () => {
    try {
      const commentsCollectionRef = collection(db, `posts/${postId}/comments`);
      const commentsSnapshot = await getDocs(commentsCollectionRef);

      const comments = commentsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(comments);
      setAllComments(comments);
    } catch (error) {
      console.error("Error retrieving comments: ", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = date.toLocaleString("uk-UA", options);
    return formattedDate;
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photo }}
        style={{
          height: 240,
          marginBottom: 32,
          borderRadius: 8,
          marginTop: 32,
        }}
      />

      <FlatList
        data={allComments}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ marginBottom: 10, color: "#FF6C00", fontSize: 16 }}>
              {item.login}
            </Text>
            <View style={styles.textContainer}>
              <Text style={{ fontSize: 18, fontFamily: "Roboto-Regular" }}>
                {item.comment}
              </Text>
              <Text style={{ fontSize: 10, color: "#BDBDBD" }}>
                {item.timestamp}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View
        style={{
          position: "relative",
          backgroundColor: "rgba(0, 0, 0, 0.03)",
          borderRadius: 100,
          marginBottom: 16,
          justifyContent: "center",
        }}
      >
        <TextInput
          style={{
            ...styles.input,
            borderBottomWidth: 0,
            paddingLeft: 16,
            paddingRight: 40,
          }}
          placeholder="Коментувати..."
          onChangeText={setComment}
          value={comment}
        ></TextInput>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addButton}
          onPress={createComment}
        >
          <Ionicons name="md-arrow-up-circle-sharp" size={34} color="#FF6C00" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 16,
    paddingLeft: 16,
    fontFamily: "Roboto-Regular",
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 6,
    padding: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    paddingTop: 15,
    paddingBottom: 15,
  },

  addButton: {
    position: "absolute",
    top: 10,
    right: 16,
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
});
