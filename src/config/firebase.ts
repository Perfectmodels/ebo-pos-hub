import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuration Firebase - EBO'O GEST
const firebaseConfig = {
  apiKey: "AIzaSyDnFdxaEHsesZKc2l1nq1jd_toxMIuBiEM",
  authDomain: "hide-666e5.firebaseapp.com",
  databaseURL: "https://hide-666e5-default-rtdb.firebaseio.com",
  projectId: "hide-666e5",
  storageBucket: "hide-666e5.firebasestorage.app",
  messagingSenderId: "602771999567",
  appId: "1:602771999567:web:e18197728638d93bf3533a",
  measurementId: "G-VEN7S78GJ6"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase
export const db = getFirestore(app);
export const firestore = db; // Alias pour compatibilité
export const auth = getAuth(app);
export const storage = getStorage(app);

// Analytics (seulement en production et si supporté)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported && process.env.NODE_ENV === 'production') {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };

// Configuration pour l'environnement de développement
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Éviter la double connexion aux émulateurs
  let emulatorsConnected = false;
  
  try {
    // Vérifier si les émulateurs sont déjà connectés en tentant de se connecter
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    emulatorsConnected = true;
    console.log('Firebase emulators connected successfully');
  } catch (error) {
    // Les émulateurs sont déjà connectés ou il y a une erreur
    console.log('Firebase emulators already connected or error:', error);
  }
}
