// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1lqbUabKH4WgbLPGaZYMwwjCL7n5JodM",
  authDomain: "perfect-models-hub.firebaseapp.com",
  databaseURL: "https://perfect-models-hub-default-rtdb.firebaseio.com",
  projectId: "perfect-models-hub",
  storageBucket: "perfect-models-hub.firebasestorage.app",
  messagingSenderId: "1067844329439",
  appId: "1:1067844329439:web:79de3916e89787d354ee6a",
  measurementId: "G-X5WG9Q41JQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, firestore, analytics };
