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
        style={{ height: 240, marginBottom: 10 }}
      />

      <FlatList
        data={allComments}
        renderItem={({ item }) => (
          <View>
            <Text>{item.login}</Text>
            <Text>{item.comment}</Text>
            <Text>{item.timestamp}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View>
        <TextInput
          style={{ ...styles.input, marginBottom: 16 }}
          placeholder="Назва..."
          onChangeText={setComment}
          value={comment}
        ></TextInput>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btn}
          onPress={createComment}
        >
          <Text style={{ color: "#fff" }}>addComment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

CommentsScreen.navigationOptions = {
  headerTitle: "Comments", // Заголовок "Comments"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 16,
    paddingLeft: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    paddingTop: 15,
    paddingBottom: 15,
  },
  btn: {
    backgroundColor: "#FF6C00",
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
});

// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";

// export const CommentsScreen = () => {
//   return (
//     <View style={styles.container}>
//       <View>
//         <TextInput
//           style={{ ...styles.input, marginBottom: 16 }}
//           placeholder="Назва..."
//           onChangeText={setNamePost}
//         ></TextInput>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           style={styles.btn}
//           onPress={sendPhoto}
//         >
//           <Text style={{ color: "#fff" }}>Опубліковати</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
