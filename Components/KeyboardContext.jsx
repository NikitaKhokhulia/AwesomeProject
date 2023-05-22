import React, { createContext, useState } from "react";

export const KeyboardContext = createContext();

export const KeyboardProvider = ({ children }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  return (
    <KeyboardContext.Provider value={{ isShowKeyboard, setIsShowKeyboard }}>
      {children}
    </KeyboardContext.Provider>
  );
};
