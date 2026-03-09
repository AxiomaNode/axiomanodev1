/**
 * recommendationEngine.js
 *
 * Phase 1 — minimal flow routing only.
 * Determines the next step in the learning flow based on detected gaps.
 *
 * @param {Array} gaps - flat array of detected gap objects
 * @returns {{ hasGaps: boolean, nextActions: string[] }}
 */
export const getRecommendations = (gaps = []) => {
  const hasGaps = Array.isArray(gaps) && gaps.length > 0;

  if (hasGaps) {
    return {
      hasGaps: true,
      nextActions: ["theory", "practice"],
    };
  }

  return {
    hasGaps: false,
    nextActions: [],
  };
};