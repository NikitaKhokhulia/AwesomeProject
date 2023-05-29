// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from "firebase/app";
// Функція для підключення авторизації в проект
import { getAuth } from "firebase/auth";
// Функція для підключення бази даних у проект
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDP57MDzF9Hrk2eV1Dj1HlyoXnaxdaOZLQ",
  authDomain: "awesomeproject-fd9a4.firebaseapp.com",
  databaseURL: "https://awesomeproject-fd9a4-default-rtdb.firebaseio.com",
  projectId: "awesomeproject-fd9a4",
  storageBucket: "awesomeproject-fd9a4.appspot.com",
  messagingSenderId: "86694638204",
  appId: "1:86694638204:web:ce99d42ecbc4a35a048ff9",
  measurementId: "G-T9KBWX7G2H",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
