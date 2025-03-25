
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, serverTimestamp as firestoreTimestamp } from "firebase/firestore";

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
export const db = getFirestore(app);
export const serverTimestamp = firestoreTimestamp;

// Enable offline persistence if the app needs to work offline
// enableIndexedDbPersistence(db).catch((err) => {
//   if (err.code === 'failed-precondition') {
//     console.warn('Persistence failed - multiple tabs open');
//   } else if (err.code === 'unimplemented') {
//     console.warn('Persistence not available in this browser');
//   }
// });
