/**
 * questionGenerator.js
 * src/core/questionGenerator.js
 *
 * Instantiates all question templates into a fresh question set.
 * Call once per diagnostic session — result is stored in component state
 * and passed through to detectAllGaps. Never call mid-session.
 *
 * Returns the same shape as the old questions.js:
 *   { quadratic: [{ id, text, options, correct, gapAnswers }, ...] }
 *
 * The gapAnswers field on each generated question carries the wrong
 * option strings computed for this specific run. diagnosticEngine.js
 * prefers question.gapAnswers over the static ones in gaps.js signals,
 * so gap detection stays accurate with randomized values.
 */

import { questionTemplates } from "../data/questionTemplates";

/**
 * Generates a fresh question bank by calling generate() on every template.
 * @returns {{ [topicId: string]: Array<{id, text, options, correct, gapAnswers}> }}
 */
export const generateQuestions = () => {
  const result = {};
  Object.entries(questionTemplates).forEach(([topicId, templates]) => {
    result[topicId] = templates.map((template) => ({
      ...template.generate(),
      id: template.id,
    }));
  });
  return result;
};