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
    id: "interpretive",
    title: "Interpretation gap",
    userFacingLabel: "You compute correctly but misread what the result tells you.",
    // ADD:
    shortLabel: "Reading conclusions",
  },
  {
    id: "procedural",
    title: "Procedural breakdown",
    userFacingLabel: "Your reasoning starts correctly but breaks during execution.",
    shortLabel: "Execution errors",
  },
  {
    id: "strategic",
    title: "Method selection error",
    userFacingLabel: "You often choose the wrong method here.",
    shortLabel: "Wrong approach",
  },
  {
    id: "adaptive",
    title: "Adaptive reasoning gap",
    userFacingLabel: "You struggle when the problem doesn't match a familiar pattern.",
    shortLabel: "Non-standard problems",
  },
  {
    id: "relational",
    title: "Representation gap",
    userFacingLabel: "You lose the thread when the same idea appears in a different form.",
    shortLabel: "Switching representations",
  },
];

/**
 * Lookup helper.
 * @param {string} id
 * @returns {object|undefined}
 */
export const getCoreGap = (id) => coreGaps.find((g) => g.id === id);