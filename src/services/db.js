import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/* ─────────────────────────────────────────────
   Theory progress (keep)
───────────────────────────────────────────── */
export const getTheoryProgress = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "theoryProgress", topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const saveTheoryProgress = async (uid, topicId, payload) => {
  const ref = doc(db, "users", uid, "theoryProgress", topicId);
  await setDoc(
    ref,
    {
      topicId,
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/* ─────────────────────────────────────────────
   Practice sessions (keep)
───────────────────────────────────────────── */
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
  return snapshot.docs.map((d) => d.data());
};

/* ─────────────────────────────────────────────
   Diagnostics (keep)
───────────────────────────────────────────── */
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
  return snapshot.docs.map((d) => d.data());
};

/* ─────────────────────────────────────────────
   Homework / Tasks (NEW)
   Firestore structure:
   users/{uid}/homework/{topicId}
   users/{uid}/topicProgress/{topicId}
───────────────────────────────────────────── */

export const getHomeworkDoc = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "homework", topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

/**
 * Creates (assigns) homework for a topic if it doesn't exist,
 * or overwrites if force=true.
 * payload must contain:
 * { topicId, topicTitle, grade, tasks: [ {id,text,options,correct,explanation} ] }
 */
export const assignHomework = async (uid, topicId, payload, force = false) => {
  const ref = doc(db, "users", uid, "homework", topicId);
  const snap = await getDoc(ref);

  if (snap.exists() && !force) {
    return snap.data(); // keep existing assignment
  }

  const docData = {
    topicId,
    topicTitle: payload.topicTitle || topicId,
    status: "assigned", // assigned | in_progress | completed
    tasks: (payload.tasks || []).map((t) => ({
      id: t.id,
      text: t.text,
      options: t.options,
      correct: t.correct,
      explanation: t.explanation,
      // user fields
      userAnswer: null,
      isCorrect: null,
    })),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    completedAt: null,
    score: {
      correct: 0,
      wrong: 0,
      total: (payload.tasks || []).length,
      percent: 0,
    },
  };

  await setDoc(ref, docData, { merge: false });

  // also ensure topicProgress exists
  const progRef = doc(db, "users", uid, "topicProgress", topicId);
  await setDoc(
    progRef,
    {
      topicId,
      topicTitle: payload.topicTitle || topicId,
      status: "in_progress", // in_progress | completed
      homeworkAssigned: true,
      homeworkCompleted: false,
      percent: 0,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  const after = await getDoc(ref);
  return after.exists() ? after.data() : null;
};

export const saveHomeworkAnswer = async (uid, topicId, taskId, answerLabel) => {
  const ref = doc(db, "users", uid, "homework", topicId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const hw = snap.data();
  const tasks = Array.isArray(hw.tasks) ? hw.tasks.slice() : [];

  let correctCount = 0;
  let wrongCount = 0;

  const updatedTasks = tasks.map((t) => {
    if (t.id !== taskId) {
      // keep previous
      if (t.isCorrect === true) correctCount += 1;
      if (t.isCorrect === false) wrongCount += 1;
      return t;
    }
    const isCorrect = answerLabel === t.correct;
    if (isCorrect) correctCount += 1;
    else wrongCount += 1;
    return {
      ...t,
      userAnswer: answerLabel,
      isCorrect,
    };
  });

  // Re-count all (in case taskId not found)
  correctCount = 0;
  wrongCount = 0;
  updatedTasks.forEach((t) => {
    if (t.isCorrect === true) correctCount += 1;
    if (t.isCorrect === false) wrongCount += 1;
  });

  const total = updatedTasks.length;
  const percent = total ? Math.floor((correctCount / total) * 100) : 0;

  const nextStatus = hw.status === "assigned" ? "in_progress" : hw.status;

  const payload = {
    tasks: updatedTasks,
    status: nextStatus,
    updatedAt: serverTimestamp(),
    score: {
      correct: correctCount,
      wrong: wrongCount,
      total,
      percent,
    },
  };

  await setDoc(ref, payload, { merge: true });

  const after = await getDoc(ref);
  return after.exists() ? after.data() : null;
};

export const completeHomework = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "homework", topicId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const hw = snap.data();
  const tasks = Array.isArray(hw.tasks) ? hw.tasks : [];

  // completion rule: every task answered (userAnswer not null)
  const allAnswered = tasks.length > 0 && tasks.every((t) => t.userAnswer != null);
  if (!allAnswered) {
    return { ...hw, _error: "NOT_ALL_ANSWERED" };
  }

  await setDoc(
    ref,
    {
      status: "completed",
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // update topicProgress
  const progRef = doc(db, "users", uid, "topicProgress", topicId);
  await setDoc(
    progRef,
    {
      status: "completed",
      homeworkCompleted: true,
      percent: hw?.score?.percent ?? 0,
      updatedAt: serverTimestamp(),
      completedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const after = await getDoc(ref);
  return after.exists() ? after.data() : null;
};

export const getTopicProgress = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "topicProgress", topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

/* ─────────────────────────────────────────────
   Homework Results — best score per topic
   Firestore structure:
   users/{uid}/homeworkResults/{topicId}
───────────────────────────────────────────── */

/**
 * Returns the best saved result for a topic, or null if none exists.
 * Shape: { pct, correct, total, completedAt, updatedAt }
 */
export const getHomeworkResult = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "homeworkResults", topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

/**
 * Saves (or overwrites) the best result for a topic.
 * payload: { pct, correct, total, completedAt }
 *
 * Call-site already guards "only save if pct > prev.pct",
 * so here we simply overwrite unconditionally.
 */
export const saveHomeworkResult = async (uid, topicId, payload) => {
  const ref = doc(db, "users", uid, "homeworkResults", topicId);
  await setDoc(
    ref,
    {
      topicId,
      pct:         payload.pct,
      correct:     payload.correct,
      total:       payload.total,
      completedAt: payload.completedAt ?? new Date().toISOString(),
      updatedAt:   serverTimestamp(),
    },
    { merge: false } // full overwrite — call-site already checked it's a new best
  );
};