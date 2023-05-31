import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
} from "react-native";
import { Camera } from "expo-camera";

import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { storage, db } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

export const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [namePost, setNamePost] = useState("");
  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  const { userId, login } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    console.log("location", location);
    console.log("namePost", namePost);

    const photo = await camera.takePictureAsync();

    // console.log("latitude", location.coords.latitude);
    // console.log("longitude", location.coords.longitude);
    setPhoto(photo.uri);
  };

  const sendPhoto = () => {
    uploadPostToServer();
    navigation.navigate("DefaultScreen");
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    const createPost = await addDoc(collection(db, "posts"), {
      photo,
      namePost,
      location: location.coords,
      userId,
      login,
    });
    console.log("Document written with ID: ", createPost.id);
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();

    const uniquePostId = Date.now().toString();

    const data = ref(storage, `postImage/${uniquePostId}`);
    const upload = await uploadBytes(data, file);
    const download = await getDownloadURL(data, file);
    console.log("download", download);

    // console.log("Uploaded a blob or file!", upload);
    // console.log("data", data);

    return download;
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} ref={setCamera}>
          {photo && (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photo }}
                style={{
                  height: 240,
                  width: 353,
                  borderWidth: 3,
                  borderRadius: 8,
                }}
              />
            </View>
          )}

          <TouchableOpacity onPress={takePhoto} style={styles.snapContainer}>
            <Ionicons name="camera-outline" size={24} color="black" />
          </TouchableOpacity>
        </Camera>
      </View>
      {photo !== null ? (
        <TouchableOpacity>
          <Text style={{ color: "#BDBDBD" }}>Редагувати фото</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity>
          <Text style={{ color: "#BDBDBD", marginBottom: 32 }}>
            Завантажити фото
          </Text>
        </TouchableOpacity>
      )}
      <View>
        <TextInput
          style={{ ...styles.input, marginBottom: 16 }}
          placeholder="Назва..."
          onChangeText={setNamePost}
        ></TextInput>
        <TextInput
          style={{ ...styles.input, marginBottom: 32 }}
          placeholder="Місцевість..."
        ></TextInput>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.btn}
        onPress={sendPhoto}
      >
        <Text style={{ color: "#fff" }}>Опубліковати</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  cameraContainer: {
    height: 240,
    marginTop: 32,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F6F6F6",
    borderRadius: 8,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },

  snap: {
    color: "#ffffff",
  },

  snapContainer: {
    position: "absolute",
    top: 90,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 3,
    borderColor: "black",
  },

  photoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    borderWidth: 3,
    borderRadius: 8,
    height: 240,
    width: 360,
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
