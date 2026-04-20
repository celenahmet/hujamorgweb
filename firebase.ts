// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVy6T5SogQY9o2hWfWBUrCfb1IwYexFes",
  authDomain: "hujam-54984.firebaseapp.com",
  projectId: "hujam-54984",
  storageBucket: "hujam-54984.firebasestorage.app",
  messagingSenderId: "814479158897",
  appId: "1:814479158897:web:646859731af7daa68c75d0",
  measurementId: "G-HQ700YCSQC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
