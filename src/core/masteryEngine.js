/**
 * masteryEngine.js — src/core/masteryEngine.js
 *
 * Pure logic for mastery test flow.
 * No React, no UI. Called from MasteryTestPage.jsx.
 */

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { gapsDatabase } from "../data/gaps";
import { db } from "../firebase/firebaseConfig";

const ADMIN_UID = "mVixaP1MTROHi6PlhzAJTHkppu43";

/* ── Performance tiers — result display ───────────────────────────────────── */

export const PERF_TIERS = [
  { min: 95, label: "Flawless",        sub: "Every area held up without exception.",      color: "#f1c40f" },
  { min: 87, label: "Expert",          sub: "Sharp reasoning throughout.",                color: "#9b59b6" },
  { min: 80, label: "Advanced",        sub: "Solid understanding across all gap types.",  color: "#d35400" },
  { min: 75, label: "Proficient",      sub: "Reasoning holds — room to push further.",    color: "#27ae60" },
  { min: 60, label: "Getting there",   sub: "Review weak areas and retry.",               color: "#2a8fa0" },
  { min: 0,  label: "Keep practising", sub: "Run a diagnostic to find the gap.",          color: "#c0392b" },
];

/* ── Mastery card title tiers (saved to profile) ──────────────────────────── */
// Only scores ≥ 75% earn a card — student decides whether to save.

export const MASTERY_TITLE_TIERS = [
  { min: 95, title: "Flawless",   color: "#f1c40f" },
  { min: 87, title: "Expert",     color: "#9b59b6" },
  { min: 80, title: "Advanced",   color: "#d35400" },
  { min: 75, title: "Proficient", color: "#27ae60" },
];

/* ── Classification helpers ───────────────────────────────────────────────── */

export const getPerf = (pct) =>
  PERF_TIERS.find(t => pct >= t.min) ?? PERF_TIERS[PERF_TIERS.length - 1];

export const getMasteryTitle = (pct) =>
  MASTERY_TITLE_TIERS.find(t => pct >= t.min) ?? null;

const titleRank = (title) => {
  if (title === "Flawless")   return 4;
  if (title === "Expert")     return 3;
  if (title === "Advanced")   return 2;
  if (title === "Proficient") return 1;
  return 0;
};

/* ── Date helpers ─────────────────────────────────────────────────────────── */

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/* ── Entry gate ───────────────────────────────────────────────────────────── */

export const checkMasteryEligibility = async (uid, topicId) => {
  if (uid === ADMIN_UID) return { eligible: true, activeGapCount: 0 };

  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return { eligible: true, activeGapCount: 0 };

    const gapStatus = snap.data()?.gapStatus ?? {};

    const topicGapIds = new Set(
      (gapsDatabase[topicId] || []).map(g => g.id)
    );

    const activeGapCount = Object.entries(gapStatus).filter(([gapId, val]) => {
      if (!topicGapIds.has(gapId)) return false;
      return val?.status === "active" || val?.status === "reopened";
    }).length;

    return { eligible: activeGapCount === 0, activeGapCount };
  } catch (err) {
    console.error("[masteryEngine] checkMasteryEligibility error:", err);
    return { eligible: true, activeGapCount: 0 };
  }
};

/* ── Daily limit ──────────────────────────────────────────────────────────── */

export const checkDailyLimit = async (uid, topicId) => {
  if (uid === ADMIN_UID) return { blocked: false, lastCompletedDate: null };

  try {
    const snap = await getDoc(doc(db, "users", uid, "masteryTests", topicId));
    if (!snap.exists()) return { blocked: false, lastCompletedDate: null };

    const lastCompletedDate = snap.data()?.lastCompletedDate ?? null;
    return { blocked: lastCompletedDate === todayStr(), lastCompletedDate };
  } catch (err) {
    console.error("[masteryEngine] checkDailyLimit error:", err);
    return { blocked: false, lastCompletedDate: null };
  }
};

/* ── Card read ────────────────────────────────────────────────────────────── */

export const getMasteryCard = async (uid, topicId) => {
  try {
    const snap = await getDoc(doc(db, "users", uid, "masteryCards", topicId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("[masteryEngine] getMasteryCard error:", err);
    return null;
  }
};

/* ── Card save decision ───────────────────────────────────────────────────── */

/**
 * Decides what to do when user clicks "Save to profile".
 *
 * Rules:
 * - Score < 75%                          → cannot_save (below threshold)
 * - No existing card                     → save (first card)
 * - New title higher rank                → save (upgrade)
 * - Same title, higher score             → save (improvement)
 * - Same title, same/lower score         → no_improvement (inform user, still allow save)
 * - New title lower rank                 → downgrade (warn user, still allow save)
 *
 * Note: actual save is always triggered by user — this just informs the UI
 * what to show before the user confirms.
 *
 * @param {object|null} currentCard
 * @param {number} newPct
 * @returns {{ canSave: boolean, reason: string, newTitle: object|null, isDowngrade: boolean }}
 */
export const decideSaveAction = (currentCard, newPct) => {
  const newTitleObj = getMasteryTitle(newPct);

  if (!newTitleObj) {
    return { canSave: false, reason: "below_threshold", newTitle: null, isDowngrade: false };
  }

  if (!currentCard) {
    return { canSave: true, reason: "first_card", newTitle: newTitleObj, isDowngrade: false };
  }

  const currentRank = titleRank(currentCard.title);
  const newRank     = titleRank(newTitleObj.title);

  if (newRank > currentRank) {
    return { canSave: true, reason: "upgrade", newTitle: newTitleObj, isDowngrade: false };
  }

  if (newRank === currentRank && newPct > (currentCard.score ?? 0)) {
    return { canSave: true, reason: "same_tier_higher_score", newTitle: newTitleObj, isDowngrade: false };
  }

  if (newRank === currentRank && newPct <= (currentCard.score ?? 0)) {
    return { canSave: true, reason: "no_improvement", newTitle: newTitleObj, isDowngrade: false };
  }

  if (newRank < currentRank) {
    return {
      canSave: false,
      reason: "blocked_downgrade",
      newTitle: newTitleObj,
      isDowngrade: true
    };
  }

  return { canSave: true, reason: "unknown", newTitle: newTitleObj, isDowngrade: false };
};

/* ── Card write ───────────────────────────────────────────────────────────── */

export const saveMasteryCard = async (uid, topicId, topicTitle, pct, titleObj) => {
  if (!uid || !topicId || !titleObj) return null;

  try {
    const existingSnap = await getDoc(doc(db, "users", uid, "masteryCards", topicId));
    const existing = existingSnap.exists() ? existingSnap.data() : null;

    if (existing) {
      const currentRank = titleRank(existing.title);
      const newRank     = titleRank(titleObj.title);

      // 🚫 Block downgrade overwrite
      if (newRank < currentRank) {
        return existing;
      }
    }

    const now  = new Date().toISOString();
    const card = {
      topicId,
      topicTitle,
      title:      titleObj.title,
      titleColor: titleObj.color,
      score:      pct,
      earnedAt:   now,
      updatedAt:  now,
    };

    await setDoc(doc(db, "users", uid, "masteryCards", topicId), card);

    await setDoc(
      doc(db, "users", uid, "masteryTests", topicId),
      { lastCompletedDate: todayStr(), updatedAt: serverTimestamp() },
      { merge: true }
    );

    await setDoc(
      doc(db, "publicProfiles", uid),
      {
        masteryCards: {
          [topicId]: {
            topicTitle,
            title:      titleObj.title,
            titleColor: titleObj.color,
            score:      pct,
            earnedAt:   now,
          },
        },
      },
      { merge: true }
    );

    return card;

  } catch (err) {
    console.error("[masteryEngine] saveMasteryCard error:", err);
    return null;
  }
};


export const recordCompletionDate = async (uid, topicId) => {
  if (uid === ADMIN_UID) return;
  try {
    await setDoc(
      doc(db, "users", uid, "masteryTests", topicId),
      { lastCompletedDate: todayStr(), updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.error("[masteryEngine] recordCompletionDate error:", err);
  }
};