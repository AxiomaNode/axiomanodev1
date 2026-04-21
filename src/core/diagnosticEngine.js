import { topics }                 from "../data/topics";
import { gapsDatabase }           from "../data/gaps";
import { buildDiagnosticSession } from "../data/questionTemplates";
import { coreGaps }               from "../data/coreGaps";

if (process.env.NODE_ENV !== "production") {
  const CORE_GAP_IDS = new Set(coreGaps.map(g => g.id));
  Object.entries(gapsDatabase).forEach(([topicId, gaps]) => {
    gaps.forEach(gap => {
      if (!CORE_GAP_IDS.has(gap.coreGapId)) {
        console.warn(`[diagnosticEngine] "${gap.id}" in "${topicId}" maps to unknown coreGapId "${gap.coreGapId}"`);
      }
    });
  });
}

/* v1 detectable topic gaps — A-E series only */
export const V1_GAP_IDS = [
  "q-discriminant",
  "q-double-root",
  "q-div-by-var",
  "q-factoring",
  "q-vieta",
];

/**
 * Builds one full diagnostic across the selected topics.
 *
 * Each tested gap is composed by the template layer logic as:
 *   1 direct + 2 applied + 1 transfer
 *
 * That logic lives in buildDiagnosticSession().
 */
export const buildFullDiagnostic = (selectedTopicIds = null) => {
  const activeTopics = topics.filter(t =>
    selectedTopicIds ? selectedTopicIds.includes(t.id) : true
  );
  if (!activeTopics.length) return [];

  const pool = [];
  activeTopics.forEach(topic => {
    pool.push(...buildDiagnosticSession(topic.id));
  });

  return pool;
};

/* ─────────────────────────────────────────────────────────
   detectAllGaps

   Detection is keyed by specific topic gap ID.
   Threshold:
     3+ wrong out of 4 -> detected

   Returns:
     { profile, cleanGaps }

   - profile: detected topic gaps keyed by gapId
   - cleanGaps: tested topic gaps that did not cross threshold
───────────────────────────────────────────────────────── */
export const detectAllGaps = (answers, allQuestions) => {
  const fullAnswers = {};
  allQuestions.forEach(q => {
    fullAnswers[q.id] = answers[q.id] ?? "__skipped__";
  });

  const profile = {};
  const testedGapIds = new Set();

  topics.forEach(topic => {
    const topicGaps = gapsDatabase[topic.id];
    if (!topicGaps) return;

    topicGaps.forEach(gap => {
      if (!V1_GAP_IDS.includes(gap.id)) return;

      const gapQuestions = allQuestions.filter(
        q => q.topicId === topic.id && q.gapTag === gap.id
      );
      if (!gapQuestions.length) return;

      testedGapIds.add(gap.id);

      let wrongCount = 0;
      const failedTaskIds = [];

      gapQuestions.forEach(q => {
        const given = fullAnswers[q.id];
        if (given === "__skipped__" || given !== q.correct) {
          wrongCount++;
          failedTaskIds.push(q.id);
        }
      });

      if (wrongCount < 3) return;

      profile[gap.id] = {
        gapId:           gap.id,
        coreGapId:       gap.coreGapId, // metadata only
        title:           gap.title,
        userFacingLabel: gap.description?.what ?? gap.title,
        strength:        "detected",
        firstDetected:   new Date().toISOString().split("T")[0],
        evidence: [{
          topicId:            topic.id,
          topicTitle:         topic.title,
          gapId:              gap.id,
          gapTitle:           gap.title,
          description:        gap.description,
          recommendationText: gap.recommendationText,
          recommendation:     gap.recommendation,
          severity:           gap.severity,
          wrongCount,
          signalCount:        gapQuestions.length,
          failedTaskIds,
        }],
      };
    });
  });

  const cleanGaps = V1_GAP_IDS
    .filter(gapId => testedGapIds.has(gapId) && !profile[gapId])
    .map(gapId => {
      for (const [, gaps] of Object.entries(gapsDatabase)) {
        const gap = gaps.find(g => g.id === gapId);
        if (gap) {
          return {
            id: gapId,
            title: gap.title,
            shortLabel: gap.title,
          };
        }
      }
      return null;
    })
    .filter(Boolean);

  return { profile, cleanGaps };
};