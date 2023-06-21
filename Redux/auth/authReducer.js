import { createSlice } from "@reduxjs/toolkit";

const state = {
  userId: null,
  login: null,
  stateChange: false,
  selectedAvatar: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      login: payload.login,
      email: payload.email,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSingOut: () => state,
    setSelectedAvatar: (state, { payload }) => ({
      ...state,
      selectedAvatar: payload.selectedAvatar,
    }),
  },
});
