/**
 * templateUtils.js — src/data/templates/templateUtils.js
 *
 * Shared helpers and session generators used by all topic template files.
 * Import from here, not from individual topic files.
 */

/* ── Core helpers ─────────────────────────────────────────────────────────── */

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* Guarantee exactly 4 options even when wrong values collide. */
export const buildOptions = (correctValue, wrongValues) => {
  const labels = ["A", "B", "C", "D"];
  const seen   = new Set([String(correctValue)]);

  const unique = wrongValues.filter((w) => {
    const s = String(w);
    if (!w && w !== 0) return false;
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });

  const candidates = [correctValue, ...unique];

  let fillerBase = 1;
  while (candidates.length < 4) {
    const numericBase = Number(correctValue);
    let filler;

    if (Number.isFinite(numericBase)) {
      filler = String(numericBase + fillerBase * 13 + 7);
    } else {
      filler = `${correctValue} [alt ${fillerBase}]`;
    }

    if (!seen.has(filler)) {
      seen.add(filler);
      candidates.push(filler);
    }

    fillerBase++;
    if (fillerBase > 100) break;
  }

  const shuffled     = shuffle(candidates.slice(0, 4));
  const correctLabel = labels[shuffled.indexOf(correctValue)];

  return {
    options: shuffled.map((value, i) => ({ value, label: labels[i] })),
    correct: correctLabel,
  };
};

// Formats ax² + bx + c = 0 as a readable string
export const fmt = (a, b, c) => {
  if (a === 0) {
    return `${b !== 0 ? `${b}x` : ""} ${
      c !== 0 ? (c > 0 ? `+ ${c}` : `− ${Math.abs(c)}`) : ""
    }`.trim() + " = 0";
  }

  const parts = [];
  if (a === 1) parts.push("x²");
  else if (a === -1) parts.push("−x²");
  else parts.push(`${a}x²`);

  if (b !== 0) {
    const abs   = Math.abs(b);
    const coeff = abs === 1 ? "" : String(abs);
    parts.push(b > 0 ? `+ ${coeff}x` : `− ${coeff}x`);
  }

  if (c !== 0) parts.push(c > 0 ? `+ ${c}` : `− ${Math.abs(c)}`);

  return parts.join(" ") + " = 0";
};

// Formats signed numbers with − symbol
export const display = (x) => (x < 0 ? `−${Math.abs(x)}` : String(x));

/* ── Stage derivation ─────────────────────────────────────────────────────── */

/**
 * Prefer difficulty when available for the new layered diagnostic bank.
 * Fall back to format heuristics for older practice/mastery banks.
 */
export const deriveStage = (format = "", difficulty = "") => {
  const d = String(difficulty || "").toLowerCase();

  if (d === "direct") return "recognition";
  if (d === "applied") return "application";
  if (d === "transfer") return "transfer";

  const f = String(format || "").toLowerCase();

  if (
    f.includes("identify")   || f.includes("recognize") || f.includes("classify") ||
    f.includes("name")       || f.includes("which")     || f.includes("is-")      ||
    f.includes("true-false") || f.includes("evaluate")  || f.includes("interpret")||
    f.includes("compute")    || f.includes("fill")      || f.includes("find")     ||
    f.includes("choose")     || f.includes("select")
  ) return "recognition";

  if (
    f.includes("isolat") || f.includes("describe") || f.includes("compare") ||
    f.includes("signal") || f.includes("count")    || f.includes("missing") ||
    f.includes("detect")
  ) return "isolation";

  if (
    f.includes("transfer")         || f.includes("graph")        || f.includes("word") ||
    f.includes("context")          || f.includes("non-standard") || f.includes("geometric") ||
    f.includes("symbolic")         || f.includes("equation-from")|| f.includes("rearrange") ||
    f.includes("disguised")        || f.includes("roots-to")     || f.includes("d-to") ||
    f.includes("vertex")           || f.includes("relational")   || f.includes("table") ||
    f.includes("standard-form-to") || f.includes("completing")   || f.includes("factored-form") ||
    f.includes("vertex-form")
  ) return "transfer";

  return "application";
};

/* ── Internal helpers ─────────────────────────────────────────────────────── */

const buildQuestionFromTemplate = (topicId, t) => ({
  id:         `${topicId}_${t.id}_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
  templateId: t.id,
  topicId,
  gapTag:     t.gapTag,
  difficulty: t.difficulty ?? null,
  stage:      deriveStage(t.format, t.difficulty),
  category:   t.gapTag.replace("q-", "").replace(/-/g, " "),
  ...t.generate(),
});

const sortTemplates = (templates) => [...templates].sort((a, b) => a.id.localeCompare(b.id));

const takeCycledUnique = ({
  templates,
  count,
  startIndex = 0,
  usedIds,
  usedFormats,
}) => {
  if (!templates.length || count <= 0) return [];

  const sorted = sortTemplates(templates);
  const picked = [];

  for (let i = 0; i < sorted.length && picked.length < count; i++) {
    const t = sorted[(startIndex + i) % sorted.length];
    if (usedIds.has(t.id)) continue;
    if (usedFormats.has(t.format)) continue;
    picked.push(t);
    usedIds.add(t.id);
    usedFormats.add(t.format);
  }

  // Relax format uniqueness if needed
  for (let i = 0; i < sorted.length && picked.length < count; i++) {
    const t = sorted[(startIndex + i) % sorted.length];
    if (usedIds.has(t.id)) continue;
    picked.push(t);
    usedIds.add(t.id);
  }

  return picked;
};

const DIAGNOSTIC_LAYER_TARGET = {
  direct: 1,
  applied: 2,
  transfer: 1,
};

const DIAGNOSTIC_LAYER_ORDER = ["direct", "applied", "transfer"];

const DIAGNOSTIC_LAYER_FALLBACKS = {
  direct:   ["applied", "transfer"],
  applied:  ["transfer", "direct"],
  transfer: ["applied", "direct"],
};

/* ── Session generators ───────────────────────────────────────────────────── */

const STAGE_SLOTS = [
  { stage: "recognition", min: 2 },
  { stage: "isolation",   min: 2 },
  { stage: "application", min: 3 },
  { stage: "transfer",    min: 1 },
];

/**
 * Generates a practice session from a topic's template pool.
 * Filters by gapTag if provided.
 * Uses stage-balanced selection for targeted practice.
 */

export const generatePracticeSession = (templatesByTopic, topicId, count = 24, gapTag = null) => {
  if (!templatesByTopic || !templatesByTopic[topicId]) return [];
  const allTemplates = (templatesByTopic[topicId] || []).filter(t => t.practice !== false);
  const pool = gapTag
    ? allTemplates.filter(t => t.gapTag === gapTag)
    : allTemplates;

  if (!pool.length) return [];

  // 🔥 NEW: strict layer grouping
  const byDifficulty = {
    direct: pool.filter(t => t.difficulty === "direct"),
    applied: pool.filter(t => t.difficulty === "applied"),
    transfer: pool.filter(t => t.difficulty === "transfer"),
    mixed: pool.filter(t => t.difficulty === "mixed"),
  };

  const STRUCTURE = {
    direct: 4,
    applied: 8,
    transfer: 10,
    mixed: 2,
  };

  const selected = [];
  const usedIds = new Set();

  const pickFrom = (arr, needed) => {
    const shuffled = shuffle(arr);
    const picked = [];

    for (let t of shuffled) {
      if (picked.length >= needed) break;
      if (usedIds.has(t.id)) continue;

      picked.push(t);
      usedIds.add(t.id);
    }

    return picked;
  };

  Object.entries(STRUCTURE).forEach(([type, count]) => {
    const pool = byDifficulty[type] || [];
    selected.push(...pickFrom(pool, count));
  });

  // 🔁 fallback if missing templates
  if (selected.length < 24) {
    const fallback = shuffle(pool);
    for (let t of fallback) {
      if (selected.length >= 24) break;
      if (usedIds.has(t.id)) continue;
      selected.push(t);
      usedIds.add(t.id);
    }
  }

  return shuffle(selected).map(t => buildQuestionFromTemplate(topicId, t));
};

/**
 * Generates a mastery test session.
 * Uses mastery-flagged templates only.
 * Falls back to diagnostic-flagged templates if no mastery templates exist yet.
 */
export const generateMasterySession = (templatesByTopic, topicId, count = 15) => {
  const allTemplates = templatesByTopic[topicId] || [];

  const masteryPool = allTemplates.filter((t) => t.mastery === true);
  const pool        = masteryPool.length >= count
    ? masteryPool
    : allTemplates.filter((t) => t.diagnostic === true);

  if (!pool.length) return [];

  const shuffled = shuffle([...pool]);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((t) => buildQuestionFromTemplate(topicId, t));
};

// All 5 gap tags active in diagnostic
export const V1_GAP_TAGS = [
  "q-discriminant",
  "q-double-root",
  "q-div-by-var",
  "q-factoring",
  "q-vieta",
];

/**
 * Builds a diagnostic session.
 *
 * Per tested gap:
 * - 1 direct
 * - 2 applied
 * - 1 transfer
 *
 * If a difficulty bucket is short, borrow from fallback buckets.
 * Selection rotates within each bucket so repeated diagnostics do not
 * collapse into flat predictable windows.
 */
export const buildDiagnosticSession = (templatesByTopic, topicId) => {
  const allTemplates = (templatesByTopic[topicId] || []).filter((t) => t.diagnostic === true);
  if (!allTemplates.length) return [];

  const byGap = {};
  allTemplates.forEach((t) => {
    if (!V1_GAP_TAGS.includes(t.gapTag)) return;

    if (!byGap[t.gapTag]) {
      byGap[t.gapTag] = { direct: [], applied: [], transfer: [], other: [] };
    }

    const difficulty = String(t.difficulty || "").toLowerCase();
    if (difficulty === "direct" || difficulty === "applied" || difficulty === "transfer") {
      byGap[t.gapTag][difficulty].push(t);
    } else {
      byGap[t.gapTag].other.push(t);
    }
  });

  const dayIndex    = Math.floor(Date.now() / 86400000);
  const pool        = [];
  const usedFormats = new Set();

  V1_GAP_TAGS.forEach((gapTag, gapOffset) => {
    const bucket = byGap[gapTag];
    if (!bucket) return;

    const usedIds = new Set();
    const picked  = [];

    const pickFromBucket = (difficulty, count, offsetSeed) => {
      const templates = bucket[difficulty] || [];
      if (!templates.length || count <= 0) return [];

      const startIndex = (dayIndex + offsetSeed) % templates.length;
      return takeCycledUnique({
        templates,
        count,
        startIndex,
        usedIds,
        usedFormats,
      });
    };

    // First pass: exact target per layer
    DIAGNOSTIC_LAYER_ORDER.forEach((difficulty, idx) => {
      const target = DIAGNOSTIC_LAYER_TARGET[difficulty];
      picked.push(...pickFromBucket(difficulty, target, gapOffset * 17 + idx * 7));
    });

    // Second pass: fill shortages per intended layer using fallback buckets
    DIAGNOSTIC_LAYER_ORDER.forEach((difficulty, idx) => {
      const target = DIAGNOSTIC_LAYER_TARGET[difficulty];
      const currentFromPrimary = picked.filter((t) => t.difficulty === difficulty).length;
      let remaining = Math.max(0, target - currentFromPrimary);

      if (remaining === 0) return;

      const fallbackOrder = DIAGNOSTIC_LAYER_FALLBACKS[difficulty] || [];
      for (let i = 0; i < fallbackOrder.length && remaining > 0; i++) {
        const fallbackDifficulty = fallbackOrder[i];
        const added = pickFromBucket(
          fallbackDifficulty,
          remaining,
          gapOffset * 23 + idx * 11 + i * 5
        );
        picked.push(...added);
        remaining -= added.length;
      }
    });

    // Final fill if still short: use any remaining diagnostic templates in this gap
    if (picked.length < 4) {
      const anyRemaining = [
        ...(bucket.direct || []),
        ...(bucket.applied || []),
        ...(bucket.transfer || []),
        ...(bucket.other || []),
      ];

      const startIndex = anyRemaining.length ? (dayIndex + gapOffset * 13) % anyRemaining.length : 0;
      picked.push(
        ...takeCycledUnique({
          templates: anyRemaining,
          count: 4 - picked.length,
          startIndex,
          usedIds,
          usedFormats,
        })
      );
    }

    picked.slice(0, 4).forEach((t) => {
      pool.push(buildQuestionFromTemplate(topicId, t));
    });
  });

  return shuffle(pool);
};