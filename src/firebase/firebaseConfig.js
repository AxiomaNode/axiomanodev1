import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfZ0VhtqaVIY-dcomnhOxuXH-dpqOt1zY",
  authDomain: "axiomanodev1.firebaseapp.com",
  projectId: "axiomanodev1",
  storageBucket: "axiomanodev1.firebasestorage.app",
  messagingSenderId: "1026785830474",
  appId: "1:1026785830474:web:8c52cfb487e1f0327c68b3",
  measurementId: "G-Y6VWYFL2ES"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);