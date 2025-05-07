// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClMCzlazl_ndOdGy6sd9aWT-HkYSo477k",
  authDomain: "recruitment-app-project.firebaseapp.com",
  projectId: "recruitment-app-project",
  storageBucket: "recruitment-app-project.firebasestorage.app",
  messagingSenderId: "643320182869",
  appId: "1:643320182869:web:47cadd30cb1c0a7932fcdc",
  measurementId: "G-HP73VSBL82",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const usersRef = collection(db, "users");
export const dailyResponsesRef = collection(db, "dailyResponses");
