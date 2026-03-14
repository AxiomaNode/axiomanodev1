/**
 * coreGaps.js
 *
 * Defines the 5 canonical reasoning failure categories for Axioma.
 *
 * Rules:
 * - This list is stable. Do not add or remove without deliberate product decision.
 * - These are the user-facing categories shown in results, profile, and recommendations.
 * - Topic gaps in gapsDatabase must always map to exactly one coreGapId from this list.
 * - Sub-gaps are internal signals only — they never reference this list directly.
 */

export const coreGaps = [
  {
    id: "strategic",
    title: "Method selection error",
    meaning:
      "The learner chooses an inappropriate strategy or formula for the problem. " +
      "They may know the concept but reach for the wrong tool.",
    userFacingLabel: "You often choose the wrong method here.",
    surveyBlock: "C", // weakest block: 21/100
  },
  {
    id: "procedural",
    title: "Procedural breakdown",
    meaning:
      "The learner identifies the right approach but executes it incorrectly. " +
      "Errors happen during transformation, not during planning.",
    userFacingLabel: "Your reasoning starts correctly but breaks during execution.",
    surveyBlock: "B", // 40/150
  },
  {
    id: "interpretive",
    title: "Interpretation error",
    meaning:
      "The learner misreads what the problem asks, or misreads what a result means. " +
      "They compute something correctly but draw the wrong conclusion.",
    userFacingLabel: "You compute correctly but misread what the result tells you.",
    surveyBlock: "A", // partially — surface knowledge without deeper reading
  },
  {
    id: "adaptive",
    title: "Adaptive reasoning gap",
    meaning:
      "The learner collapses when the problem is non-standard or when a familiar " +
      "algorithm is unavailable. They cannot construct a strategy from scratch.",
    userFacingLabel: "You struggle when the problem doesn't match a familiar pattern.",
    surveyBlock: "E", // 34/100
  },
  {
    id: "relational",
    title: "Representation connection gap",
    meaning:
      "The learner fails to connect different forms of the same object: " +
      "symbolic, verbal, graphical, or geometric. Each form feels isolated.",
    userFacingLabel: "You lose the thread when the same idea appears in a different form.",
    surveyBlock: "D", // 75/100 — strong in v1, included for future topics
  },
];

/**
 * Lookup helper.
 * @param {string} id
 * @returns {object|undefined}
 */
export const getCoreGap = (id) => coreGaps.find((g) => g.id === id);