import { topics } from "../data/topics";
import { gapsDatabase } from "../data/gaps";
import { questionTemplates } from "../data/questionTemplates";
import { coreGaps } from "../data/coreGaps";

/* ─────────────────────────────────────────────────────────
   Validate that every coreGapId in gapsDatabase exists
   in coreGaps. Logs a warning in dev — never throws.
───────────────────────────────────────────────────────── */
const CORE_GAP_IDS = new Set(coreGaps.map((g) => g.id));

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

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
  const activeTopics = topics.filter(t => {
    const hasTemplates = questionTemplates[t.id]?.length > 0;
    const isSel = selectedTopicIds ? selectedTopicIds.includes(t.id) : true;
    return hasTemplates && isSel;
  });

  if (!activeTopics.length) return [];

  const pool = [];

  activeTopics.forEach(topic => {
    const templates = questionTemplates[topic.id] || [];

    // Group templates by gapTag
    const byGap = {};
    templates.forEach(t => {
      if (!byGap[t.gapTag]) byGap[t.gapTag] = [];
      byGap[t.gapTag].push(t);
    });

    // Pick 4 random templates per gap, generate questions
    Object.entries(byGap).forEach(([gapTag, gapTemplates]) => {
      const picked = shuffle(gapTemplates).slice(0, 4);
      picked.forEach(template => {
        const q = template.generate();
        pool.push({
          ...q,
          id: `${template.id}_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
          topicId: topic.id,
          gapTag,
        });
      });
    });
  });

  return shuffle(pool);
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