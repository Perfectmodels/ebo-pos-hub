import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuration Firebase - EBO'O GEST
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
  if (!auth._delegate._config?.emulator) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
    } catch (error) {
      // Les émulateurs sont déjà connectés
      console.log('Firebase emulators already connected');
    }
  }
}
