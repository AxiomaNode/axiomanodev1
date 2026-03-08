import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/* local YYYY-MM-DD — avoids UTC day-shift */
const todayId = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const ref = (uid) => doc(db, "users", uid, "dailyTodos", todayId());

/* internal — ensures today's doc exists, returns { docRef, data } */
const ensureTodayDoc = async (uid) => {
  const docRef = ref(uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) return { docRef, data: snap.data() };
  const empty = { date: todayId(), plan: [], updatedAt: Date.now() };
  await setDoc(docRef, empty);
  return { docRef, data: empty };
};

/* ── public API ── */

export const getTodayDoc = async (uid) => {
  const { data } = await ensureTodayDoc(uid);
  return data;
};

export const savePlan = async (uid, plan) => {
  const { docRef } = await ensureTodayDoc(uid);
  await updateDoc(docRef, { plan, updatedAt: Date.now() });
};

export const markPlanItemXpAwarded = async (uid, itemId) => {
  const { docRef, data } = await ensureTodayDoc(uid);
  const plan = (data.plan || []).map((item) =>
    item.id === itemId ? { ...item, xpAwarded: true } : item
  );
  await updateDoc(docRef, { plan, updatedAt: Date.now() });
};