
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBD-70n16eYzmTuXGB7VBKv7lyPxH2JXpw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-oopsies.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-oopsies",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-oopsies.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
