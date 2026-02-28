import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const registerUser = async (email, password, displayName, language) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Save additional profile data to Firestore
   await setDoc(doc(db, "users", userCredential.user.uid), {
    displayName,
    email,
    language: language || "ru",
    
    ratingPoints: 0,
    stats: {
      practiceSessions: 0,
      diagnosticsCompleted: 0,
      puzzlesSolved: 0,
      homeworkCompleted: 0,
      feedbackSent: 0,
    },
  
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.code === "auth/email-already-in-use" ? "Email already in use" : error.message);
  }
};

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.code === "auth/invalid-credential" ? "Invalid credentials" : error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  } catch (error) {
    throw new Error(error.code === "auth/too-many-requests" ? "Too many requests. Wait a minute and try again." : error.message);
  }
};