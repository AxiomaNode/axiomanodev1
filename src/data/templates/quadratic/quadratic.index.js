/**
 * index.js — src/data/templates/quadratic/index.js
 *
 * Aggregates all quadratic template pools into one export.
 * Import quadraticTemplates from here — not from individual files.
 */

import { quadraticDiagTemplates, quadraticDiagArchivedIds } from "./quadratic.diag";
import { quadraticPracticeTemplates } from "./quadratic.practice";
import { quadraticMasteryTemplates } from "./quadratic.mastery";

export const quadraticTemplates = [
  ...quadraticDiagTemplates,
  ...quadraticPracticeTemplates,
  ...quadraticMasteryTemplates,
];

export {
  quadraticDiagTemplates,
  quadraticDiagArchivedIds,
  quadraticPracticeTemplates,
  quadraticMasteryTemplates,
};