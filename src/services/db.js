import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const savePractice = async (userId, data) => {
  await addDoc(collection(db, "users", userId, "practice_sessions"), {
    ...data,
    date: new Date().toISOString(),
  });
};

export const getPractice = async (userId) => {
  const q = query(
    collection(db, "users", userId, "practice_sessions"),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};

export const saveDiagnostic = async (userId, data) => {
  await addDoc(collection(db, "users", userId, "diagnostic_sessions"), {
    ...data,
    date: new Date().toISOString(),
  });
};

export const getDiagnostics = async (userId) => {
  const q = query(
    collection(db, "users", userId, "diagnostic_sessions"),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};