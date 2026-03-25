import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/* local YYYY-MM-DD — avoids UTC day-shift */
const todayId = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const ref = (uid) => doc(db, "users", uid, "dailyTodos", todayId());

const ensureTodayDoc = async (uid) => {
  const docRef = ref(uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) return { docRef, data: snap.data() };
  const empty = { date: todayId(), plan: [], puzzleCount: 0, updatedAt: Date.now() };
  await setDoc(docRef, empty);
  return { docRef, data: empty };
};

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

/* ── Puzzle completion counter ──────────────────────────────────────────────
   Call this once per puzzle solved from the Puzzles page.
   Returns the new total so the caller can update local state immediately.
─────────────────────────────────────────────────────────────────────────── */
export const markPuzzleSolved = async (uid) => {
  const { docRef, data } = await ensureTodayDoc(uid);
  const newCount = (data.puzzleCount || 0) + 1;
  await updateDoc(docRef, { puzzleCount: newCount, updatedAt: Date.now() });
  return newCount;
};