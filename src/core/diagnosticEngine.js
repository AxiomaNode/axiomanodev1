import { topics } from "../data/topics";
import { generateQuestions } from "../core/questionGenerator";
import { gapsDatabase } from "../data/gaps";
import { coreGaps } from "../data/coreGaps";

/* ─────────────────────────────────────────────────────────
   Validate that every coreGapId in gapsDatabase exists
   in coreGaps. Logs a warning in dev — never throws.
───────────────────────────────────────────────────────── */
const CORE_GAP_IDS = new Set(coreGaps.map((g) => g.id));

const validateGapTaxonomy = () => {
  Object.entries(gapsDatabase).forEach(([topicId, gaps]) => {
    gaps.forEach((gap) => {
      if (!CORE_GAP_IDS.has(gap.coreGapId)) {
        console.warn(
          `[diagnosticEngine] "${gap.id}" in topic "${topicId}" ` +
          `maps to unknown coreGapId "${gap.coreGapId}"`
        );
      }
    });
  });
};

if (process.env.NODE_ENV !== "production") {
  validateGapTaxonomy();
}

/* ─────────────────────────────────────────────────────────
   buildFullDiagnostic
   Returns a flat ordered list of questions for the given topics.
───────────────────────────────────────────────────────── */
export const buildFullDiagnostic = (selectedTopicIds = null) => {
  const questions = generateQuestions();
  const activeTopics = topics.filter((t) => {
    const hasQ = questions[t.id]?.length > 0;
    const isSel = selectedTopicIds ? selectedTopicIds.includes(t.id) : true;
    return hasQ && isSel;
  });

  if (!activeTopics.length) return [];

  const pool = [];
  activeTopics.forEach((topic) => {
    (questions[topic.id] || []).forEach((q) =>
      pool.push({ ...q, topicId: topic.id })
    );
  });

  return pool;
};

/* ─────────────────────────────────────────────────────────
   resolveStrength
   Returns "moderate" | "strong" | "critical" based on
   the gap's masteryRule thresholds.
───────────────────────────────────────────────────────── */
const resolveStrength = (wrongCount, masteryRule) => {
  const { totalSignals, moderateThreshold, strongThreshold } = masteryRule;
  if (wrongCount >= totalSignals) return "critical";
  if (wrongCount >= strongThreshold) return "strong";
  if (wrongCount >= moderateThreshold) return "moderate";
  return null;
};

/* ─────────────────────────────────────────────────────────
   detectAllGaps
   Reads gap.signals[] (new shape) instead of gap.signs.
   Returns detected gaps grouped by topicId, each with:
     - wrongCount, signalCount
     - strength: "moderate" | "strong" | "critical"
     - coreGapId for UI categorisation
     - failedTaskIds for gap breakdown screen (Phase 2)
───────────────────────────────────────────────────────── */
export const detectAllGaps = (answers, allQuestions) => {
  const fullAnswers = {};
  allQuestions.forEach((q) => {
    fullAnswers[q.id] = answers[q.id] ?? "__skipped__";
  });

  const result = {};

  topics.forEach((topic) => {
    const topicGaps = gapsDatabase[topic.id];
    if (!topicGaps) return;

    const found = [];

    topicGaps.forEach((gap) => {
      const { masteryRule, signals } = gap;

      if (!signals?.length || !masteryRule) {
        console.warn(`[diagnosticEngine] Gap "${gap.id}" is missing signals or masteryRule`);
        return;
      }

      let wrongCount = 0;
      let signalCount = 0;
      const failedTaskIds = [];

     signals.forEach(({ taskId, gapAnswers: staticGapAnswers }) => {
        const given = fullAnswers[taskId];
        if (given === undefined) return;

        signalCount++;

        const question = allQuestions.find((q) => q.id === taskId);
        if (!question) return;
        const gapAnswers = question.gapAnswers ?? staticGapAnswers;

        const isWrong =
  given === "__skipped__" ||
  (gapAnswers
    ? gapAnswers.includes(given)
    : given !== question.correct);
        if (isWrong) {
          wrongCount++;
          failedTaskIds.push(taskId);
        }
      });

      if (signalCount < masteryRule.moderateThreshold) return;

      const strength = resolveStrength(wrongCount, masteryRule);
      if (!strength) return;

      found.push({
        ...gap,
        wrongCount,
        signalCount,
        strength,
        failedTaskIds,
      });
    });

    if (found.length) result[topic.id] = found;
  });

  return result;
};