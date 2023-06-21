import { auth } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { authSlice } from "./authReducer";

const { updateUserProfile, authStateChange, authSingOut, setSelectedAvatar } =
  authSlice.actions;

export const authSingUpUser =
  ({ email, password, login, photoURL }) =>
  async (dispatch, getState) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, { displayName: login });

      const { displayName, uid } = user;

      console.log("user", user);

      const userUpdateProfile = {
        login: displayName,
        userId: uid,
      };

      if (photoURL) {
        dispatch(setSelectedAvatar(photoURL));
      }

      dispatch(updateUserProfile(userUpdateProfile));
    } catch (error) {
      console.log("error:", error);
      console.log("error.message:", error.message);
    }
  };

export const authSingInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("user", user.user);
    } catch (error) {
      console.log("error:", error);
      console.log("error.message:", error.message);
    }
  };
export const authSingOutUser = () => async (dispatch, getState) => {
  await signOut(auth);
  dispatch(authSingOut());
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUpdateProfile = {
        login: user.displayName,
        userId: user.uid,
        email: user.email,
      };
      dispatch(authStateChange({ stateChange: true }));
      dispatch(updateUserProfile(userUpdateProfile));
    }
  });
};

export const setSelectedAvatarUser =
  (selectedAvatar) => async (dispatch, getState) => {
    dispatch(setSelectedAvatar({ selectedAvatar }));
  };
