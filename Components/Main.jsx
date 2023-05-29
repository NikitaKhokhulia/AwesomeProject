import React, { useState, useEffect } from "react";
import {} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { Home } from "../Home";
import { KeyboardProvider } from "./KeyboardContext";

import { authStateChangeUser } from "../Redux/auth/authOperations";
import { auth } from "../firebase/config";

export const Main = () => {
  // const [isAuth, setIsAuth] = useState(false);

  const { stateChange } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log("stateChange", stateChange);
  // console.log("isAuth", isAuth);

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, [dispatch]);

  return (
    <KeyboardProvider>
      <NavigationContainer>
        <Home user={stateChange} />
      </NavigationContainer>
    </KeyboardProvider>
  );
};
