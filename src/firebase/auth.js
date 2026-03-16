import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// CHANGED: Google provider
const googleProvider = new GoogleAuthProvider();

/* ─────────────────────────────────────────────
   Email / password register
───────────────────────────────────────────── */
export const registerUser = async (email, password, displayName, language) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

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

    // CHANGED: send but don't block if it fails
    await sendEmailVerification(userCredential.user).catch(() => null);
    return userCredential.user;
  } catch (error) {
    throw new Error(
      error.code === "auth/email-already-in-use" ? "Email already in use" : error.message
    );
  }
};

/* ─────────────────────────────────────────────
   NEW: Google sign-in
   Handles both login and register in one call.
   Creates Firestore profile only on first sign-in.
   Existing accounts are signed in silently.
───────────────────────────────────────────── */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const profileRef = doc(db, "users", user.uid);
    const existing = await getDoc(profileRef);

    if (!existing.exists()) {
      await setDoc(profileRef, {
        displayName: user.displayName || "",
        email: user.email || "",
        language: "ru",
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
    }

    return user;
  } catch (error) {
    // User closed the popup — not an error worth surfacing
    if (error.code === "auth/popup-closed-by-user") return null;
    throw new Error(error.message);
  }
};

/* ─────────────────────────────────────────────
   Email / password login
───────────────────────────────────────────── */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(
      error.code === "auth/invalid-credential" ? "Invalid credentials" : error.message
    );
  }
};

/* ─────────────────────────────────────────────
   Logout
───────────────────────────────────────────── */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};

/* ─────────────────────────────────────────────
   Resend verification email
   CHANGED: rate limit silently ignored instead of throwing
───────────────────────────────────────────── */
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  } catch (error) {
    if (error.code === "auth/too-many-requests") return;
    throw new Error(error.message);
  }
};

/* ─────────────────────────────────────────────
   Get user profile
───────────────────────────────────────────── */
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};