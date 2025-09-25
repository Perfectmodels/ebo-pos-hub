import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// La configuration de votre projet Firebase
// Remplacez par vos propres informations !
const firebaseConfig = {
  apiKey: "AIzaSyB1lqbUabKH4WgbLPGaZYMwwjCL7n5JodM",
  authDomain: "perfect-models-hub.firebaseapp.com",
  projectId: "perfect-models-hub",
  storageBucket: "perfect-models-hub.appspot.com",
  messagingSenderId: "1095556795396",
  appId: "1:1095556795396:web:b33532729a6d61a86b1129",
  measurementId: "G-03XW3FWG7L"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services Firebase à utiliser dans l'application
export const db = getFirestore(app);
export const auth = getAuth(app);
