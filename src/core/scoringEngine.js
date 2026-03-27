import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const POINTS = {
  QUESTION_CORRECT:       10,
  QUESTION_WRONG:          0,
  PRACTICE_SESSION_BONUS:  5,
  DIAGNOSTIC_COMPLETE:    20,
  HOMEWORK_HIGH:          50,
  HOMEWORK_MID:           30,
  HOMEWORK_LOW:           10,
  PUZZLE_BASE:             5,
  PUZZLE_PER_STREAK:       3,
  PUZZLE_MAX:             40,
  FEEDBACK_SENT:           5,
};

// Events that count as "active day" for streak
const STREAK_EVENTS = new Set([
  "diagnostic_complete",
  "practice_complete",
  "puzzle_solved",
]);

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const buildStreakUpdate = (userData, eventType) => {
  if (!STREAK_EVENTS.has(eventType)) return {};

  const today     = todayStr();
  const yesterday = yesterdayStr();
  const last      = userData.lastActiveDate ?? null;
  const current   = userData.currentStreak  ?? 0;
  const best      = userData.bestStreak     ?? 0;

  if (last === today) {
    // Already active today — no change
    return {};
  }

  const newStreak = last === yesterday ? current + 1 : 1;
  const newBest   = Math.max(best, newStreak);

  return {
    currentStreak:  newStreak,
    bestStreak:     newBest,
    lastActiveDate: today,
  };
};

export const awardPoints = async (uid, eventType, meta = {}) => {
  if (!uid) return;

  const userRef = doc(db, "users", uid);
  const snap    = await getDoc(userRef);
  if (!snap.exists()) return;

  const userData = snap.data();
  const { points, statField, logEntry } = buildAward(eventType, meta);
  const streakUpdate = buildStreakUpdate(userData, eventType);

  if (points <= 0 && !logEntry && Object.keys(streakUpdate).length === 0) return;

  const update = { updatedAt: serverTimestamp() };

  if (points > 0)  update.ratingPoints = increment(points);
  if (statField)   update[`stats.${statField}`] = increment(1);

  if (logEntry) {
    update["pointsLog"] = arrayUnion({
      ...logEntry,
      points,
      ts: Date.now(),
    });
  }

  // Merge streak fields
  Object.assign(update, streakUpdate);

  await updateDoc(userRef, update);
  return points;
};

const buildAward = (eventType, meta) => {
  switch (eventType) {

    case "question_answered": {
      const correct = meta.correct === true;
      const points  = correct ? POINTS.QUESTION_CORRECT : POINTS.QUESTION_WRONG;
      return {
        points,
        statField: correct ? "questionsCorrect" : "questionsWrong",
        logEntry:  correct
          ? { event: "question_answered", label: "Correct answer" }
          : null,
      };
    }

    case "practice_complete": {
      return {
        points:    POINTS.PRACTICE_SESSION_BONUS,
        statField: "practiceSessions",
        logEntry:  { event: "practice_complete", label: "Practice session bonus" },
      };
    }

    case "diagnostic_complete": {
      const score  = meta.percent ?? 0;
      const points = Math.round(POINTS.DIAGNOSTIC_COMPLETE * (1 + score / 100));
      return {
        points,
        statField: "diagnosticsCompleted",
        logEntry:  { event: "diagnostic_complete", label: `Diagnostic (${score}%)` },
      };
    }

    case "homework_complete": {
      const percent = meta.percent ?? 0;
      const points  =
        percent >= 80 ? POINTS.HOMEWORK_HIGH :
        percent >= 60 ? POINTS.HOMEWORK_MID  :
                        POINTS.HOMEWORK_LOW;
      return {
        points,
        statField: "homeworkCompleted",
        logEntry:  { event: "homework_complete", label: `Homework (${percent}%)` },
      };
    }

    case "puzzle_solved": {
      const streak = Math.max(meta.streak ?? 1, 1);
      const points = Math.min(
        POINTS.PUZZLE_BASE + streak * POINTS.PUZZLE_PER_STREAK,
        POINTS.PUZZLE_MAX
      );
      return {
        points,
        statField: "puzzlesSolved",
        logEntry:  { event: "puzzle_solved", label: `Puzzle (streak ×${streak})` },
      };
    }

    case "feedback_sent": {
      return {
        points:    POINTS.FEEDBACK_SENT,
        statField: "feedbackSent",
        logEntry:  { event: "feedback_sent", label: "Feedback sent" },
      };
    }

    case "todo_complete": {
      return {
        points:    meta.xp ?? 10,
        statField: null,
        logEntry:  { event: "todo_complete", label: meta.label ?? "Daily todo completed" },
      };
    }

    default:
      return { points: 0, statField: null, logEntry: null };
  }
};