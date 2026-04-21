/**
 * index.js — src/data/templates/index.js
 *
 * Central re-export for all template data and session generators.
 * Import from here — pages don't need to know about individual topic files.
 *
 * Usage (same as before, no changes needed in pages):
 *   import { questionTemplates, generatePracticeSession, buildDiagnosticSession } from "../data/questionTemplates";
 *
 * This file IS the new questionTemplates.js — rename or redirect as needed.
 */

import { quadraticTemplates } from "./quadratic";
import {
  generatePracticeSession   as _generatePracticeSession,
  generateMasterySession    as _generateMasterySession,
  buildDiagnosticSession    as _buildDiagnosticSession,
} from "./templateUtils";

/* ── Aggregated template map ──────────────────────────────────────────────── */

export const questionTemplates = {
  quadratic: quadraticTemplates,
  // future topics:
  // trigonometry: trigonometryTemplates,
  // functions: functionsTemplates,
};

/* ── Session generators — pre-bound to the full template map ─────────────── */

export const generatePracticeSession = (topicId, count = 10, gapTag = null) =>
  _generatePracticeSession(questionTemplates, topicId, count, gapTag);

export const generateMasterySession = (topicId, count = 15) =>
  _generateMasterySession(questionTemplates, topicId, count);

export const buildDiagnosticSession = (topicId) =>
  _buildDiagnosticSession(questionTemplates, topicId);

/* ── Re-export helpers for templates that need them ──────────────────────── */

export { pick, shuffle, buildOptions, fmt, display, V1_GAP_TAGS } from "./templateUtils";