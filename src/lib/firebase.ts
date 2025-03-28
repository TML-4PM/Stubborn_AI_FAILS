
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD-70n16eYzmTuXGB7VBKv7lyPxH2JXpw",
  authDomain: "ai-oopsies.firebaseapp.com",
  projectId: "ai-oopsies",
  storageBucket: "ai-oopsies.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
