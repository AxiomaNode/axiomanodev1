import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const googleProvider = new GoogleAuthProvider();

// ── Write safe public display data ──────────────────────────────────────────
const writePublicProfile = async (uid, data) => {
  await setDoc(
    doc(db, "publicProfiles", uid),
    {
      displayName:  data.displayName  || "Anonymous",
      photoURL:     data.photoURL     || "",
      ratingPoints: data.ratingPoints || 0,
      createdAt:    data.createdAt    || new Date().toISOString(),
      stats: {
        diagnosticsCompleted: 0,
        practiceCompleted:    0,
        avgScore:             null,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const registerUser = async (email, password, displayName, language) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    const now = new Date().toISOString();

    await setDoc(doc(db, "users", userCredential.user.uid), {
      displayName,
      email,
      language: language || "ru",
      ratingPoints: 0,
      stats: {
        practiceSessions:     0,
        diagnosticsCompleted: 0,
        puzzlesSolved:        0,
        homeworkCompleted:    0,
        feedbackSent:         0,
      },
      createdAt: now,
      updatedAt: now,
    });

    await writePublicProfile(userCredential.user.uid, {
      displayName,
      photoURL:  "",
      createdAt: now,
    });

    await sendEmailVerification(userCredential.user).catch(() => null);
    return userCredential.user;
  } catch (error) {
    throw new Error(
      error.code === "auth/email-already-in-use" ? "Email already in use" : error.message
    );
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user   = result.user;

    const profileRef = doc(db, "users", user.uid);
    const existing   = await getDoc(profileRef);
    const now        = new Date().toISOString();

    if (!existing.exists()) {
      await setDoc(profileRef, {
        displayName: user.displayName || "",
        email:       user.email       || "",
        photoURL:    user.photoURL    || null,
        language:    "ru",
        ratingPoints: 0,
        stats: {
          practiceSessions:     0,
          diagnosticsCompleted: 0,
          puzzlesSolved:        0,
          homeworkCompleted:    0,
          feedbackSent:         0,
        },
        createdAt: now,
        updatedAt: now,
      });

      await writePublicProfile(user.uid, {
        displayName: user.displayName || "",
        photoURL:    user.photoURL    || "",
        createdAt:   now,
      });
    } else {
      const data = existing.data();
      if (!data.photoURL && user.photoURL) {
        await setDoc(profileRef, { photoURL: user.photoURL }, { merge: true });
        // Also update public profile photo
        await setDoc(
          doc(db, "publicProfiles", user.uid),
          { photoURL: user.photoURL, updatedAt: serverTimestamp() },
          { merge: true }
        );
      }
    }

    return user;
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") return null;
    throw new Error(error.message);
  }
};

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
    if (error.code === "auth/too-many-requests") return;
    throw new Error(error.message);
  }
};

export const getUserProfile = async (uid) => {
  try {
    const docRef  = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};