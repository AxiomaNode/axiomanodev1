import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/* ════════════════════════════════════════════════════
   POINT TABLE
   Централизованная таблица — меняй значения здесь
════════════════════════════════════════════════════ */
const POINTS = {
  // За правильный ответ на вопрос
  QUESTION_CORRECT:       10,
  // За неправильный (можно оставить 0 или небольшой бонус "за попытку")
  QUESTION_WRONG:          0,

  // Бонус за завершение полной сессии практики
  PRACTICE_SESSION_BONUS:  5,

  // Диагностика
  DIAGNOSTIC_COMPLETE:    20,

  // Домашняя работа
  HOMEWORK_HIGH:          50,   // >= 80%
  HOMEWORK_MID:           30,   // >= 60%
  HOMEWORK_LOW:           10,   // < 60%

  // Puzzle streak
  PUZZLE_BASE:             5,
  PUZZLE_PER_STREAK:       3,
  PUZZLE_MAX:             40,

  // Обратная связь
  FEEDBACK_SENT:           5,
};

/* ════════════════════════════════════════════════════
   MAIN EXPORT
   eventType:
     "question_answered"    — каждый ответ в Practice
     "practice_complete"    — бонус за завершение сессии
     "diagnostic_complete"  — диагностика пройдена
     "homework_complete"    — ДЗ сдано
     "puzzle_solved"        — пазл решён
     "feedback_sent"        — отправлена обратная связь
════════════════════════════════════════════════════ */
export const awardPoints = async (uid, eventType, meta = {}) => {
  if (!uid) return;

  const userRef = doc(db, "users", uid);
  const snap    = await getDoc(userRef);
  if (!snap.exists()) return;

  const { points, statField, logEntry } = buildAward(eventType, meta);

  if (points <= 0 && !logEntry) return;

  const update = {
    updatedAt: serverTimestamp(),
  };

  if (points > 0) {
    update.ratingPoints = increment(points);
  }

  if (statField) {
    update[`stats.${statField}`] = increment(1);
  }

  // Лог последних начислений (последние 50 событий)
  if (logEntry) {
    update["pointsLog"] = arrayUnion({
      ...logEntry,
      points,
      ts: Date.now(),
    });
  }

  await updateDoc(userRef, update);

  return points;
};

/* ════════════════════════════════════════════════════
   BUILDER — возвращает { points, statField, logEntry }
════════════════════════════════════════════════════ */
const buildAward = (eventType, meta) => {
  switch (eventType) {

    /* ── Ответ на один вопрос в Practice ── */
    case "question_answered": {
      const correct = meta.correct === true;
      const points  = correct ? POINTS.QUESTION_CORRECT : POINTS.QUESTION_WRONG;
      return {
        points,
        statField: correct ? "questionsCorrect" : "questionsWrong",
        logEntry:  correct
          ? { event: "question_answered", label: "Correct answer" }
          : null,  // неправильный ответ не логируем, чтобы не засорять
      };
    }

    /* ── Завершение сессии практики (бонус) ── */
    case "practice_complete": {
      const bonus = POINTS.PRACTICE_SESSION_BONUS;
      return {
        points:    bonus,
        statField: "practiceSessions",
        logEntry:  { event: "practice_complete", label: "Practice session bonus" },
      };
    }

    /* ── Диагностика ── */
    case "diagnostic_complete": {
      const score   = meta.percent ?? 0;
      const points  = Math.round(POINTS.DIAGNOSTIC_COMPLETE * (1 + score / 100));
      // Чем лучше результат, тем больше очков (от 20 до 40)
      return {
        points,
        statField: "diagnosticsCompleted",
        logEntry:  { event: "diagnostic_complete", label: `Diagnostic (${score}%)` },
      };
    }

    /* ── Домашняя работа ── */
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

    /* ── Puzzle ── */
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

    /* ── Обратная связь ── */
    case "feedback_sent": {
      return {
        points:    POINTS.FEEDBACK_SENT,
        statField: "feedbackSent",
        logEntry:  { event: "feedback_sent", label: "Feedback sent" },
      };
    }

    default:
      return { points: 0, statField: null, logEntry: null };
  }
};