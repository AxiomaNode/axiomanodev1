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

/* v1 detectable gaps — A-E series only */
export const V1_GAP_IDS = [
  "q-discriminant",
  "q-double-root",
  "q-div-by-var",
  "q-factoring",
  "q-vieta",
];

export const buildFullDiagnostic = (selectedTopicIds = null) => {
  const activeTopics = topics.filter(t =>
    selectedTopicIds ? selectedTopicIds.includes(t.id) : true
  );
  if (!activeTopics.length) return [];
  const pool = [];
  activeTopics.forEach(topic => pool.push(...buildDiagnosticSession(topic.id)));
  return pool;
};

/* ─────────────────────────────────────────────────────────
   detectAllGaps
   Threshold: 3+ wrong out of 4 → "detected"
   Returns { profile, cleanGaps }
───────────────────────────────────────────────────────── */
export const detectAllGaps = (answers, allQuestions) => {
  const fullAnswers = {};
  allQuestions.forEach(q => {
    fullAnswers[q.id] = answers[q.id] ?? "__skipped__";
  });

  const profile = {};
  coreGaps.forEach(cg => {
    profile[cg.id] = {
      coreGapId:       cg.id,
      title:           cg.title,
      userFacingLabel: cg.userFacingLabel,
      strength:        null,
      evidence:        [],
      resolved:        false,
      firstDetected:   null,
    };
  });

  const testedCoreGapIds = new Set();

  topics.forEach(topic => {
    const topicGaps = gapsDatabase[topic.id];
    if (!topicGaps) return;

    topicGaps.forEach(gap => {
      if (!V1_GAP_IDS.includes(gap.id)) return;

      const { coreGapId } = gap;
      if (!coreGapId || !profile[coreGapId]) return;

      const gapQuestions = allQuestions.filter(
        q => q.topicId === topic.id && q.gapTag === gap.id
      );
      if (!gapQuestions.length) return;

      testedCoreGapIds.add(coreGapId);

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

      profile[coreGapId].evidence.push({
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
      });
    });
  });

  coreGaps.forEach(cg => {
    const entry = profile[cg.id];
    if (!entry.evidence.length) return;
    entry.strength      = "detected";
    entry.firstDetected = new Date().toISOString().split("T")[0];
  });

  const cleanGaps = coreGaps.filter(cg =>
    testedCoreGapIds.has(cg.id) && profile[cg.id].strength === null
  );

  return { profile, cleanGaps };
};