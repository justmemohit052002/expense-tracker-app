// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApR9YjlGicegrsKJbkRauyhUK3NFmqh2g",
  authDomain: "expense-tracker-1453e.firebaseapp.com",
  projectId: "expense-tracker-1453e",
  storageBucket: "expense-tracker-1453e.firebasestorage.app",
  messagingSenderId: "122599693406",
  appId: "1:122599693406:web:3e0001647916262679e8cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

//database initialization

export const firestore = getFirestore(app)