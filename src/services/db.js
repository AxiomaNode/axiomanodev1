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
import { gapsDatabase } from "../data/gaps";

/* ─────────────────────────────────────────────
   Theory progress
───────────────────────────────────────────── */
export const getTheoryProgress = async (uid, topicId) => {
  try {
    const ref = doc(db, "users", uid, "theoryProgress", topicId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("[db] getTheoryProgress:", e);
    return null;
  }
};

export const saveTheoryProgress = async (uid, topicId, payload) => {
  try {
    const ref = doc(db, "users", uid, "theoryProgress", topicId);
    await setDoc(
      ref,
      { topicId, ...payload, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (e) {
    console.error("[db] saveTheoryProgress:", e);
    throw e;
  }
};

/* ─────────────────────────────────────────────
   Practice sessions
───────────────────────────────────────────── */
export const savePractice = async (userId, data) => {
  try {
    await addDoc(collection(db, "users", userId, "practice_sessions"), {
      ...data,
      date: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[db] savePractice:", e);
    throw e;
  }
};

export const savePracticeSession = async ({
  uid,
  topicId,
  sessionId,
  answers,
  idx,
}) => {
  try {
    if (!uid || !topicId || !sessionId) return;

    await setDoc(
      doc(db, "users", uid, "practiceDrafts", sessionId),
      {
        topicId,
        answers,
        currentIndex: idx,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (e) {
    console.error("[db] savePracticeSession:", e);
  }
};

export const getPractice = async (userId) => {
  try {
    const q = query(
      collection(db, "users", userId, "practice_sessions"),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data());
  } catch (e) {
    console.error("[db] getPractice:", e);
    return [];
  }
};

/* ─────────────────────────────────────────────
   Diagnostics
───────────────────────────────────────────── */
export const saveDiagnostic = async (userId, data) => {
  try {
    await addDoc(collection(db, "users", userId, "diagnostic_sessions"), {
      ...data,
      date: new Date().toISOString(),
    });

    // FIX: use ISO format everywhere for locale-safe date comparison
    const today = new Date().toISOString().split("T")[0];
    await setDoc(
      doc(db, "users", userId),
      { lastDiagnosticDate: today },
      { merge: true }
    );

    await updateGapStatus(userId, data.gaps ?? []);
  } catch (e) {
    console.error("[db] saveDiagnostic:", e);
    throw e;
  }
};

export const getLastDiagnosticDate = async (uid) => {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().lastDiagnosticDate ?? null) : null;
  } catch {
    return null;
  }
};

export const getDiagnostics = async (userId) => {
  try {
    const q = query(
      collection(db, "users", userId, "diagnostic_sessions"),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data());
  } catch (e) {
    console.error("[db] getDiagnostics:", e);
    return [];
  }
};

/* ─────────────────────────────────────────────
   Public profiles
───────────────────────────────────────────── */
export const savePublicProfile = async (uid, data) => {
  try {
    await setDoc(
      doc(db, "publicProfiles", uid),
      {
        displayName: data.displayName || "Anonymous",
        photoURL: data.photoURL || "",
        ratingPoints: data.ratingPoints || 0,
        createdAt: data.createdAt || new Date().toISOString(),
        stats: {
          diagnosticsCompleted: data.stats?.diagnosticsCompleted || 0,
          practiceCompleted: data.stats?.practiceCompleted || 0,
          avgScore: data.stats?.avgScore ?? null,
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (e) {
    console.error("[db] savePublicProfile:", e);
    throw e;
  }
};

export const getPublicProfile = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "publicProfiles", uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("[db] getPublicProfile:", e);
    return null;
  }
};

/* ─────────────────────────────────────────────
   Gap status tracking
───────────────────────────────────────────── */
export const updateGapStatus = async (uid, currentGaps = []) => {
  const today = new Date().toISOString().split("T")[0];

  // Track by specific topic gap ID
  const activeNow = new Set(
    currentGaps.map((g) => g.gapId || g.id).filter(Boolean)
  );

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const existing = userSnap.exists() ? (userSnap.data().gapStatus ?? {}) : {};

  const allTrackedIds = new Set([...Object.keys(existing), ...activeNow]);
  const updated = { ...existing };

  allTrackedIds.forEach((gapId) => {
    const prev = updated[gapId] ?? {
      status: "active",
      consecutiveClean: 0,
      closedAt: null,
      lastDetected: null,
      lastChecked: today,
    };

    if (activeNow.has(gapId)) {
      const wasClosed = prev.status === "closed";
      updated[gapId] = {
        ...prev,
        status: wasClosed ? "reopened" : "active",
        consecutiveClean: 0,
        lastDetected: today,
        lastChecked: today,
        closedAt: wasClosed ? null : prev.closedAt,
      };
    } else {
      const newConsecutiveClean = (prev.consecutiveClean ?? 0) + 1;
      const nowClosed = newConsecutiveClean >= 2;
      updated[gapId] = {
        ...prev,
        consecutiveClean: newConsecutiveClean,
        lastChecked: today,
        status: nowClosed ? "closed" : prev.status,
        closedAt: nowClosed && !prev.closedAt ? today : prev.closedAt,
      };
    }
  });

  await setDoc(userRef, { gapStatus: updated }, { merge: true });
  return updated;
};

export const getGapStatus = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data().gapStatus ?? {}) : {};
  } catch (e) {
    console.error("[db] getGapStatus:", e);
    return {};
  }
};

export const getGapDisplayState = (gapId, gapStatus) => {
  const entry = gapStatus?.[gapId];
  if (!entry) return null;

  if (entry.status === "reopened") return "reopened";
  if (entry.status === "active") return "active";

  if (entry.status === "closed") {
    if (!entry.closedAt) return "closed";
    const days = Math.floor(
      (Date.now() - new Date(entry.closedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days >= 7 ? "clean7" : "closed";
  }

  return null;
};

/* ─────────────────────────────────────────────
   Active gaps
   FIX #8 — reads from gapStatus (the authoritative processed source)
   instead of scanning raw diagnostic sessions. This means the theory
   banner and block screen always reflect the current gap state, not
   a stale session that might show closed gaps as active.
───────────────────────────────────────────── */
export const getActiveGaps = async (uid, topicId = null) => {
  try {
    const gapStatus = await getGapStatus(uid);

    const activeEntries = Object.entries(gapStatus).filter(
      ([, v]) => v.status === "active" || v.status === "reopened"
    );

    if (!activeEntries.length) return [];

    const activeGapIds = new Set(activeEntries.map(([id]) => id));

    const results = [];
    const topicsToSearch = topicId
      ? { [topicId]: gapsDatabase[topicId] || [] }
      : gapsDatabase;

    for (const [tId, gaps] of Object.entries(topicsToSearch)) {
      for (const gap of gaps) {
        if (!activeGapIds.has(gap.id)) continue;

        const statusEntry = gapStatus[gap.id];

        results.push({
          ...gap,
          gapId: gap.id,
          topicId: tId,
          strength: statusEntry?.status === "reopened" ? "reopened" : "detected",
          evidence: [{
            topicId: tId,
            gapId: gap.id,
            gapTitle: gap.title,
            description: gap.description,
            recommendationText: gap.recommendationText,
            recommendation: gap.recommendation,
          }],
        });
      }
    }

    results.sort((a, b) => (a.severity ?? 9) - (b.severity ?? 9));
    return results;
  } catch (e) {
    console.error("[db] getActiveGaps:", e);
    return [];
  }
};

/* ─────────────────────────────────────────────
   Topic Notes
───────────────────────────────────────────── */
export const getTopicNote = async (uid, topicId) => {
  try {
    const snap = await getDoc(doc(db, "users", uid, "topicNotes", topicId));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("[db] getTopicNote:", e);
    return null;
  }
};

export const saveTopicNote = async (uid, topicId, { topicTitle, content }) => {
  try {
    const ref = doc(db, "users", uid, "topicNotes", topicId);
    const snap = await getDoc(ref);
    const isNew = !snap.exists();
    if (isNew && (!content || !content.trim())) return;

    await setDoc(
      ref,
      {
        topicId,
        topicTitle: topicTitle || topicId,
        content,
        updatedAt: serverTimestamp(),
        ...(isNew ? { createdAt: serverTimestamp() } : {}),
      },
      { merge: true }
    );
  } catch (e) {
    console.error("[db] saveTopicNote:", e);
    throw e;
  }
};

export const getAllTopicNotes = async (uid) => {
  try {
    const snap = await getDocs(collection(db, "users", uid, "topicNotes"));
    return snap.docs.map((d) => d.data()).filter((n) => n.content && n.content.trim());
  } catch (e) {
    console.error("[db] getAllTopicNotes:", e);
    return [];
  }
};

/* ─────────────────────────────────────────────
   Homework / Tasks (kept for backward compat)
───────────────────────────────────────────── */
export const getHomeworkDoc = async (uid, topicId) => {
  try {
    const ref = doc(db, "users", uid, "homework", topicId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("[db] getHomeworkDoc:", e);
    return null;
  }
};

export const assignHomework = async (uid, topicId, payload, force = false) => {
  try {
    const ref = doc(db, "users", uid, "homework", topicId);
    const snap = await getDoc(ref);
    if (snap.exists() && !force) return snap.data();

    const docData = {
      topicId,
      topicTitle: payload.topicTitle || topicId,
      status: "assigned",
      tasks: (payload.tasks || []).map((t) => ({
        id: t.id,
        text: t.text,
        options: t.options,
        correct: t.correct,
        explanation: t.explanation,
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

    await setDoc(
      doc(db, "users", uid, "topicProgress", topicId),
      {
        topicId,
        topicTitle: payload.topicTitle || topicId,
        status: "in_progress",
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
  } catch (e) {
    console.error("[db] assignHomework:", e);
    throw e;
  }
};

export const saveHomeworkAnswer = async (uid, topicId, taskId, answerLabel) => {
  try {
    const ref = doc(db, "users", uid, "homework", topicId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const hw = snap.data();
    const updatedTasks = (Array.isArray(hw.tasks) ? hw.tasks.slice() : []).map((t) => {
      if (t.id !== taskId) return t;
      return { ...t, userAnswer: answerLabel, isCorrect: answerLabel === t.correct };
    });

    let correctCount = 0, wrongCount = 0;
    updatedTasks.forEach((t) => {
      if (t.isCorrect === true) correctCount++;
      if (t.isCorrect === false) wrongCount++;
    });

    const total = updatedTasks.length;
    const percent = total ? Math.floor((correctCount / total) * 100) : 0;

    await setDoc(
      ref,
      {
        tasks: updatedTasks,
        status: hw.status === "assigned" ? "in_progress" : hw.status,
        updatedAt: serverTimestamp(),
        score: { correct: correctCount, wrong: wrongCount, total, percent },
      },
      { merge: true }
    );

    const after = await getDoc(ref);
    return after.exists() ? after.data() : null;
  } catch (e) {
    console.error("[db] saveHomeworkAnswer:", e);
    throw e;
  }
};

export const completeHomework = async (uid, topicId) => {
  try {
    const ref = doc(db, "users", uid, "homework", topicId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const hw = snap.data();
    const tasks = Array.isArray(hw.tasks) ? hw.tasks : [];
    const allAnswered = tasks.length > 0 && tasks.every((t) => t.userAnswer != null);
    if (!allAnswered) return { ...hw, _error: "NOT_ALL_ANSWERED" };

    await setDoc(ref, { status: "completed", completedAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });

    await setDoc(
      doc(db, "users", uid, "topicProgress", topicId),
      { status: "completed", homeworkCompleted: true, percent: hw?.score?.percent ?? 0, updatedAt: serverTimestamp(), completedAt: serverTimestamp() },
      { merge: true }
    );

    const after = await getDoc(ref);
    return after.exists() ? after.data() : null;
  } catch (e) {
    console.error("[db] completeHomework:", e);
    throw e;
  }
};

export const getTopicProgress = async (uid) => {
  if (!uid) return [];
  try {
    const snap = await getDocs(collection(db, "users", uid, "topicProgress"));
    return snap.docs.map((d) => ({ topicId: d.id, ...d.data() }));
  } catch (e) {
    console.error("[db] getTopicProgress:", e);
    return [];
  }
};

export const getHomeworkResult = async (uid, topicId) => {
  try {
    const snap = await getDoc(doc(db, "users", uid, "homeworkResults", topicId));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("[db] getHomeworkResult:", e);
    return null;
  }
};

export const saveHomeworkResult = async (uid, topicId, payload) => {
  try {
    await setDoc(
      doc(db, "users", uid, "homeworkResults", topicId),
      { topicId, pct: payload.pct, correct: payload.correct, total: payload.total, completedAt: payload.completedAt ?? new Date().toISOString(), updatedAt: serverTimestamp() },
      { merge: false }
    );
  } catch (e) {
    console.error("[db] saveHomeworkResult:", e);
    throw e;
  }
};

/* ─────────────────────────────────────────────
   Mastery Tests
───────────────────────────────────────────── */
export const getMasteryTest = async (uid, topicId) => {
  try {
    const snap = await getDoc(doc(db, "users", uid, "masteryTests", topicId));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("[db] getMasteryTest:", e);
    return null;
  }
};

export const assignMasteryTest = async (uid, topicId, payload) => {
  try {
    const ref = doc(db, "users", uid, "masteryTests", topicId);

    if (!payload.forceNew) {
      const existing = await getDoc(ref);
      if (existing.exists() && existing.data().status === "in_progress") {
        return existing.data();
      }
    }

    const newDoc = {
      topicId,
      topicTitle: payload.topicTitle,
      tasks: payload.tasks.map((t) => ({ ...t, userAnswer: null })),
      status: "in_progress",
      timeSecs: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (payload.forceNew) {
      // FIX #2 — on retry, preserve lastCompletedDate but wipe stale result fields.
      // Using merge:false would wipe lastCompletedDate (needed for daily limit).
      // Instead: read existing date, write clean doc with date preserved.
      let keepDate = null;
      try {
        const existing = await getDoc(ref);
        if (existing.exists()) keepDate = existing.data().lastCompletedDate ?? null;
      } catch (_) { /* non-critical */ }
      await setDoc(ref, { ...newDoc, lastCompletedDate: keepDate }, { merge: false });
    } else {
      await setDoc(ref, newDoc, { merge: true });
    }

    return newDoc;
  } catch (e) {
    console.error("[db] assignMasteryTest:", e);
    throw e;
  }
};

export const saveMasteryAnswer = async (uid, topicId, taskId, answerLabel) => {
  try {
    const ref = doc(db, "users", uid, "masteryTests", topicId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const hw = snap.data();
    const updatedTasks = (Array.isArray(hw.tasks) ? hw.tasks.slice() : []).map((t) => {
      if (t.id !== taskId) return t;
      return { ...t, userAnswer: answerLabel, isCorrect: answerLabel === t.correct };
    });

    let correctCount = 0, wrongCount = 0;
    updatedTasks.forEach((t) => {
      if (t.isCorrect === true) correctCount++;
      if (t.isCorrect === false) wrongCount++;
    });

    const total   = updatedTasks.length;
    const percent = total ? Math.floor((correctCount / total) * 100) : 0;
    const score   = { correct: correctCount, wrong: wrongCount, total, percent };

    await setDoc(
      ref,
      {
        tasks: updatedTasks,
        status: hw.status === "assigned" ? "in_progress" : hw.status,
        updatedAt: serverTimestamp(),
        score,
      },
      { merge: true }
    );

    /* FIX #13 — skip the second getDoc read. We already know what we wrote.
       Return a merged object directly — saves 1 Firestore read per answer (15 per test). */
    return {
      ...hw,
      tasks: updatedTasks,
      status: hw.status === "assigned" ? "in_progress" : hw.status,
      score,
    };
  } catch (e) {
    console.error("[db] saveMasteryAnswer:", e);
    throw e;
  }
};

export const completeMasteryTest = async (uid, topicId, timeSecs = 0) => {
  try {
    const ref = doc(db, "users", uid, "masteryTests", topicId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const hw = snap.data();
    const tasks = Array.isArray(hw.tasks) ? hw.tasks : [];
    const allAnswered = tasks.length > 0 && tasks.every((t) => t.userAnswer != null);
    if (!allAnswered) return { ...hw, _error: "NOT_ALL_ANSWERED" };

    await setDoc(
      ref,
      { status: "completed", completedAt: serverTimestamp(), updatedAt: serverTimestamp(), timeSecs },
      { merge: true }
    );

    const pct = hw.score?.percent ?? 0;
    if (pct >= 75) {  // FIX: match card threshold (75%), not 80%
      await setDoc(
        doc(db, "users", uid, "topicProgress", topicId),
        {
          topicId,
          topicTitle: hw.topicTitle || topicId,
          masteryUnlocked: true,
          masteryPct: pct,
          masteryCompletedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    const after = await getDoc(ref);
    return after.exists() ? after.data() : null;
  } catch (e) {
    console.error("[db] completeMasteryTest:", e);
    throw e;
  }
};

/* ─────────────────────────────────────────────
   Mastery Cards — public profile write
   FIX #14 — removed existence check on publicProfile.
   merge:true on setDoc creates the doc if it doesn't exist,
   so a student who never got a publicProfile written at signup
   will now correctly receive their mastery card on public profile.
   (This is called from masteryEngine.js saveMasteryCard)
───────────────────────────────────────────── */
export const upsertPublicMasteryCard = async (uid, topicId, cardData) => {
  try {
    await setDoc(
      doc(db, "publicProfiles", uid),
      { masteryCards: { [topicId]: cardData } },
      { merge: true }
    );
  } catch (e) {
    console.error("[db] upsertPublicMasteryCard:", e);
    throw e;
  }
};