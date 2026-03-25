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
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/* ─────────────────────────────────────────────
   Theory progress
───────────────────────────────────────────── */
export const getTheoryProgress = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "theoryProgress", topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const saveTheoryProgress = async (uid, topicId, payload) => {
  const ref = doc(db, "users", uid, "theoryProgress", topicId);
  await setDoc(ref, { topicId, ...payload, updatedAt: serverTimestamp() }, { merge: true });
};

/* ─────────────────────────────────────────────
   Practice sessions
───────────────────────────────────────────── */
export const savePractice = async (userId, data) => {
  await addDoc(collection(db, "users", userId, "practice_sessions"), {
    ...data,
    date: new Date().toISOString(),
  });
};

export const getPractice = async (userId) => {
  const q = query(collection(db, "users", userId, "practice_sessions"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data());
};

/* ─────────────────────────────────────────────
   Diagnostics
───────────────────────────────────────────── */
export const saveDiagnostic = async (userId, data) => {
  await addDoc(collection(db, "users", userId, "diagnostic_sessions"), {
    ...data,
    date: new Date().toISOString(),
  });

  const today = new Date().toLocaleDateString();
  await setDoc(
    doc(db, "users", userId),
    { lastDiagnosticDate: today },
    { merge: true }
  );

  // Update gap closure tracking
  await updateGapStatus(userId, data.gaps ?? []);
};

export const getLastDiagnosticDate = async (uid) => {
  try {
    const ref  = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().lastDiagnosticDate ?? null) : null;
  } catch {
    return null;
  }
};

export const getDiagnostics = async (userId) => {
  const q = query(
    collection(db, "users", userId, "diagnostic_sessions"),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data());
};

/* ─────────────────────────────────────────────
   Gap status tracking
───────────────────────────────────────────── */

/*
  gapStatus shape (stored flat on users/{uid}):
  {
    [coreGapId]: {
      status:           "active" | "closed" | "reopened",
      consecutiveClean: number,
      closedAt:         string | null,  // ISO date
      lastDetected:     string | null,  // ISO date
      lastChecked:      string,         // ISO date
    }
  }
*/

export const updateGapStatus = async (uid, currentGaps = []) => {
  const today = new Date().toISOString().split("T")[0];

  const activeNow = new Set(
    currentGaps.map(g => g.coreGapId).filter(Boolean)
  );

  const userRef  = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const existing = userSnap.exists()
    ? (userSnap.data().gapStatus ?? {})
    : {};

  const allTrackedIds = new Set([
    ...Object.keys(existing),
    ...activeNow,
  ]);

  const updated = { ...existing };

  allTrackedIds.forEach(coreGapId => {
    const prev = updated[coreGapId] ?? {
      status:           "active",
      consecutiveClean: 0,
      closedAt:         null,
      lastDetected:     null,
      lastChecked:      today,
    };

    if (activeNow.has(coreGapId)) {
      const wasClose = prev.status === "closed";
      updated[coreGapId] = {
        ...prev,
        status:           wasClose ? "reopened" : "active",
        consecutiveClean: 0,
        lastDetected:     today,
        lastChecked:      today,
        closedAt:         wasClose ? null : prev.closedAt,
      };
    } else {
      const newConsecutiveClean = (prev.consecutiveClean ?? 0) + 1;
      const nowClosed = newConsecutiveClean >= 2;

      updated[coreGapId] = {
        ...prev,
        consecutiveClean: newConsecutiveClean,
        lastChecked:      today,
        status:   nowClosed ? "closed" : prev.status,
        closedAt: nowClosed && !prev.closedAt ? today : prev.closedAt,
      };
    }
  });

  await setDoc(userRef, { gapStatus: updated }, { merge: true });
  return updated;
};

export const getGapStatus = async (uid) => {
  try {
    const ref  = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().gapStatus ?? {}) : {};
  } catch {
    return {};
  }
};

/*
  Returns one of:
    "active"   — currently detected
    "closed"   — clean for 2+ sessions, < 7 days
    "clean7"   — clean for 7+ days
    "reopened" — was closed, fired again
    null       — not tracked yet
*/
export const getGapDisplayState = (coreGapId, gapStatus) => {
  const entry = gapStatus?.[coreGapId];
  if (!entry) return null;

  if (entry.status === "reopened") return "reopened";
  if (entry.status === "active")   return "active";

  if (entry.status === "closed") {
    if (!entry.closedAt) return "closed";
    const daysSinceClosed = Math.floor(
      (Date.now() - new Date(entry.closedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceClosed >= 7 ? "clean7" : "closed";
  }

  return null;
};

/* ─────────────────────────────────────────────
   Homework / Tasks
───────────────────────────────────────────── */
export const getHomeworkDoc = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "homework", topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const assignHomework = async (uid, topicId, payload, force = false) => {
  const ref = doc(db, "users", uid, "homework", topicId);
  const snap = await getDoc(ref);

  if (snap.exists() && !force) return snap.data();

  const docData = {
    topicId,
    topicTitle: payload.topicTitle || topicId,
    status: "assigned",
    tasks: (payload.tasks || []).map(t => ({
      id: t.id, text: t.text, options: t.options, correct: t.correct, explanation: t.explanation,
      userAnswer: null, isCorrect: null,
    })),
    createdAt:   serverTimestamp(),
    updatedAt:   serverTimestamp(),
    completedAt: null,
    score: { correct: 0, wrong: 0, total: (payload.tasks || []).length, percent: 0 },
  };

  await setDoc(ref, docData, { merge: false });

  const progRef = doc(db, "users", uid, "topicProgress", topicId);
  await setDoc(progRef, {
    topicId, topicTitle: payload.topicTitle || topicId, status: "in_progress",
    homeworkAssigned: true, homeworkCompleted: false, percent: 0,
    updatedAt: serverTimestamp(), createdAt: serverTimestamp(),
  }, { merge: true });

  const after = await getDoc(ref);
  return after.exists() ? after.data() : null;
};

export const saveHomeworkAnswer = async (uid, topicId, taskId, answerLabel) => {
  const ref = doc(db, "users", uid, "homework", topicId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const hw = snap.data();
  const tasks = Array.isArray(hw.tasks) ? hw.tasks.slice() : [];

  const updatedTasks = tasks.map(t => {
    if (t.id !== taskId) return t;
    const isCorrect = answerLabel === t.correct;
    return { ...t, userAnswer: answerLabel, isCorrect };
  });

  let correctCount = 0, wrongCount = 0;
  updatedTasks.forEach(t => {
    if (t.isCorrect === true)  correctCount++;
    if (t.isCorrect === false) wrongCount++;
  });

  const total   = updatedTasks.length;
  const percent = total ? Math.floor((correctCount / total) * 100) : 0;
  const nextStatus = hw.status === "assigned" ? "in_progress" : hw.status;

  await setDoc(ref, {
    tasks: updatedTasks, status: nextStatus, updatedAt: serverTimestamp(),
    score: { correct: correctCount, wrong: wrongCount, total, percent },
  }, { merge: true });

  const after = await getDoc(ref);
  return after.exists() ? after.data() : null;
};

export const completeHomework = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "homework", topicId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const hw = snap.data();
  const tasks = Array.isArray(hw.tasks) ? hw.tasks : [];
  const allAnswered = tasks.length > 0 && tasks.every(t => t.userAnswer != null);
  if (!allAnswered) return { ...hw, _error: "NOT_ALL_ANSWERED" };

  await setDoc(ref, { status: "completed", completedAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });

  const progRef = doc(db, "users", uid, "topicProgress", topicId);
  await setDoc(progRef, {
    status: "completed", homeworkCompleted: true,
    percent: hw?.score?.percent ?? 0, updatedAt: serverTimestamp(), completedAt: serverTimestamp(),
  }, { merge: true });

  const after = await getDoc(ref);
  return after.exists() ? after.data() : null;
};

export const getTopicProgress = async (uid) => {
  if (!uid) return [];
  try {
    const ref  = collection(db, "users", uid, "topicProgress");
    const snap = await getDocs(ref);
    return snap.docs.map(d => ({ topicId: d.id, ...d.data() }));
  } catch (e) {
    console.error("[db] getTopicProgress:", e);
    return [];
  }
};

/* ─────────────────────────────────────────────
   Homework Results
───────────────────────────────────────────── */
export const getHomeworkResult = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "homeworkResults", topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const saveHomeworkResult = async (uid, topicId, payload) => {
  const ref = doc(db, "users", uid, "homeworkResults", topicId);
  await setDoc(ref, {
    topicId,
    pct:         payload.pct,
    correct:     payload.correct,
    total:       payload.total,
    completedAt: payload.completedAt ?? new Date().toISOString(),
    updatedAt:   serverTimestamp(),
  }, { merge: false });
};

export const getActiveGaps = async (uid, topicId = null) => {
  const q = query(
    collection(db, "users", uid, "diagnostic_sessions"),
    orderBy("date", "desc"),
    limit(10)
  );
  const snapshot = await getDocs(q);

  for (const d of snapshot.docs) {
    const data = d.data();

    if (data.coreGapProfile) {
      const profile = data.coreGapProfile;
      const activeGaps = Object.values(profile).filter(
        cg => cg.strength !== null && cg.evidence?.length > 0
      );
      if (!activeGaps.length) continue;
      if (topicId) {
        const topicFiltered = activeGaps.filter(cg =>
          cg.evidence.some(ev => ev.topicId === topicId)
        );
        return topicFiltered.length > 0 ? topicFiltered : activeGaps;
      }
      return activeGaps;
    }

    if (data.gapsByTopic) {
      const gapsByTopic = data.gapsByTopic;
      if (topicId) {
        const topicGaps = gapsByTopic[topicId];
        if (Array.isArray(topicGaps) && topicGaps.length > 0) return topicGaps;
      } else {
        const all = Object.values(gapsByTopic).flat();
        if (all.length > 0) return all;
      }
    }
  }

  return [];
};

/* ─────────────────────────────────────────────
   Topic Notes
───────────────────────────────────────────── */
export const getTopicNote = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "topicNotes", topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const saveTopicNote = async (uid, topicId, { topicTitle, content }) => {
  const ref = doc(db, "users", uid, "topicNotes", topicId);
  const snap = await getDoc(ref);
  const isNew = !snap.exists();
  if (isNew && (!content || !content.trim())) return;
  await setDoc(ref, {
    topicId, topicTitle: topicTitle || topicId, content,
    updatedAt: serverTimestamp(),
    ...(isNew ? { createdAt: serverTimestamp() } : {}),
  }, { merge: true });
};

export const getAllTopicNotes = async (uid) => {
  const colRef = collection(db, "users", uid, "topicNotes");
  const snap   = await getDocs(colRef);
  return snap.docs.map(d => d.data()).filter(n => n.content && n.content.trim());
};

/* ─────────────────────────────────────────────
   Mastery Tests
───────────────────────────────────────────── */
export const getMasteryTest = async (uid, topicId) => {
  const ref = doc(db, "users", uid, "masteryTests", topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const assignMasteryTest = async (uid, topicId, payload) => {
  const ref = doc(db, "users", uid, "masteryTests", topicId);
  if (!payload.forceNew) {
    const existing = await getDoc(ref);
    if (existing.exists() && existing.data().status === "in_progress") return existing.data();
  }
  const newDoc = {
    topicId,
    topicTitle: payload.topicTitle,
    tasks:      payload.tasks.map(t => ({ ...t, userAnswer: null })),
    status:     "in_progress",
    timeSecs:   0,
    createdAt:  new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
  };
  await setDoc(ref, newDoc);
  return newDoc;
};

export const saveMasteryAnswer = async (uid, topicId, taskId, answerLabel) => {
  const ref = doc(db, "users", uid, "masteryTests", topicId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const hw = snap.data();
  const tasks = Array.isArray(hw.tasks) ? hw.tasks.slice() : [];

  const updatedTasks = tasks.map(t => {
    if (t.id !== taskId) return t;
    return { ...t, userAnswer: answerLabel, isCorrect: answerLabel === t.correct };
  });

  let correctCount = 0, wrongCount = 0;
  updatedTasks.forEach(t => {
    if (t.isCorrect === true)  correctCount++;
    if (t.isCorrect === false) wrongCount++;
  });

  const total = updatedTasks.length;
  const percent = total ? Math.floor((correctCount / total) * 100) : 0;
  const nextStatus = hw.status === "assigned" ? "in_progress" : hw.status;

  await setDoc(ref, {
    tasks: updatedTasks, status: nextStatus, updatedAt: serverTimestamp(),
    score: { correct: correctCount, wrong: wrongCount, total, percent },
  }, { merge: true });

  const after = await getDoc(ref);
  return after.exists() ? after.data() : null;
};

export const completeMasteryTest = async (uid, topicId, timeSecs = 0) => {
  const ref = doc(db, "users", uid, "masteryTests", topicId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const hw = snap.data();
  const tasks = Array.isArray(hw.tasks) ? hw.tasks : [];
  const allAnswered = tasks.length > 0 && tasks.every(t => t.userAnswer != null);
  if (!allAnswered) return { ...hw, _error: "NOT_ALL_ANSWERED" };

  await setDoc(ref, {
    status: "completed", completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(), timeSecs,
  }, { merge: true });

  const pct = hw.score?.percent ?? 0;
  if (pct >= 80) {
    const progRef = doc(db, "users", uid, "topicProgress", topicId);
    await setDoc(progRef, {
      topicId, topicTitle: hw.topicTitle || topicId,
      masteryUnlocked: true, masteryPct: pct,
      masteryCompletedAt: serverTimestamp(), updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  const after = await getDoc(ref);
  return after.exists() ? after.data() : null;
};