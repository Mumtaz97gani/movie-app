// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firebase Auth
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration (yours is correct)
const firebaseConfig = {
  apiKey: "AIzaSyBRM4eaiVHElqtRsMY4-rnafCZ9CBlyYfQ",
  authDomain: "movieapp-1997.firebaseapp.com",
  projectId: "movieapp-1997",
  storageBucket: "movieapp-1997.appspot.com",
  messagingSenderId: "281798328477",
  appId: "1:281798328477:web:1cfc418596ae425e6b9474",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);