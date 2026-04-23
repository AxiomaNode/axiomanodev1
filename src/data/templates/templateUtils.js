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
  if (d === "mixed") return "transfer";

  const f = String(format || "").toLowerCase();

  // fallback only for legacy templates without difficulty
  if (
    f.includes("graph") ||
    f.includes("word") ||
    f.includes("context") ||
    f.includes("non-standard") ||
    f.includes("disguised") ||
    f.includes("geometric") ||
    f.includes("relational") ||
    f.includes("table") ||
    f.includes("vertex")
  ) return "transfer";

  if (
    f.includes("compare") ||
    f.includes("detect") ||
    f.includes("describe") ||
    f.includes("missing") ||
    f.includes("count") ||
    f.includes("signal")
  ) return "application";

  return "recognition";
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

export const generatePracticeSession = (
  templatesByTopic,
  topicId,
  count = 15,
  gapTag = null
) => {
  const allTemplates = (templatesByTopic[topicId] || []).filter(t => t.practice === true);
  const pool = gapTag
    ? allTemplates.filter(t => t.gapTag === gapTag)
    : allTemplates;

  if (!pool.length) return [];

  const byDifficulty = {
    direct:   [],
    applied:  [],
    transfer: [],
    mixed:    [],
    other:    [],
  };

  pool.forEach((t) => {
    const key = t.difficulty || "other";
    if (byDifficulty[key]) byDifficulty[key].push(t);
    else byDifficulty.other.push(t);
  });

  Object.keys(byDifficulty).forEach((k) => {
    byDifficulty[k] = shuffle([...byDifficulty[k]]);
  });

  const takeUnique = (arr, n, used) => {
    const picked = [];
    for (const t of arr) {
      if (picked.length >= n) break;
      if (used.has(t.id)) continue;
      used.add(t.id);
      picked.push(t);
    }
    return picked;
  };

  const used = new Set();
  let selected = [];

  if (gapTag) {
    // TARGETED MODE: gap repair
    // direct 3, applied 6, transfer 6 (for 15 total)
    selected.push(...takeUnique(byDifficulty.direct,   3, used));
    selected.push(...takeUnique(byDifficulty.applied,  6, used));
    selected.push(...takeUnique(byDifficulty.transfer, 6, used));
  } else {
    // FREE MODE: broader but still layered
    // direct 3, applied 6, transfer 4, mixed 2 (for 15 total)
    selected.push(...takeUnique(byDifficulty.direct,   3, used));
    selected.push(...takeUnique(byDifficulty.applied,  6, used));
    selected.push(...takeUnique(byDifficulty.transfer, 4, used));
    selected.push(...takeUnique(byDifficulty.mixed,    2, used));
  }

  // Fallback fill if one bucket is short
  if (selected.length < count) {
    const fallbackPool = shuffle([
      ...byDifficulty.applied,
      ...byDifficulty.transfer,
      ...byDifficulty.direct,
      ...byDifficulty.mixed,
      ...byDifficulty.other,
    ]);

    selected.push(...takeUnique(fallbackPool, count - selected.length, used));
  }

  selected = shuffle(selected).slice(0, Math.min(count, selected.length));

  return selected.map((t) => ({
    id: `${topicId}_${t.id}_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    gapTag: t.gapTag,
    stage: deriveStage(t.format, t.difficulty),
    category: t.gapTag.replace("q-", "").replace(/-/g, " "),
    ...t.generate(),
  }));
};

/**
 * Generates a mastery test session.
 * Uses mastery-flagged templates only.
 * Falls back to diagnostic-flagged templates if no mastery templates exist yet.
 */
export const generateMasterySession = (templatesByTopic, topicId, count = 15) => {
  const allTemplates = templatesByTopic[topicId] || [];
  const masteryPool = allTemplates.filter((t) => t.mastery === true);

  if (!masteryPool.length) return [];

  const byGap = {};
  masteryPool.forEach((t) => {
    if (!byGap[t.gapTag]) {
      byGap[t.gapTag] = { direct: [], applied: [], transfer: [], other: [] };
    }
    const bucket = t.difficulty || "other";
    if (byGap[t.gapTag][bucket]) byGap[t.gapTag][bucket].push(t);
    else byGap[t.gapTag].other.push(t);
  });

  const selected = [];

  Object.values(byGap).forEach((gapBuckets) => {
    const applied = shuffle([...gapBuckets.applied]).slice(0, 1);
    const transfer = shuffle([...gapBuckets.transfer]).slice(0, 2);

    // fallback if not enough transfer/applied
    const needed = 3 - (applied.length + transfer.length);
    const fallbackPool = shuffle([
      ...gapBuckets.applied.slice(1),
      ...gapBuckets.transfer.slice(2),
      ...gapBuckets.direct,
      ...gapBuckets.other,
    ]).slice(0, Math.max(0, needed));

    selected.push(...applied, ...transfer, ...fallbackPool);
  });

  const finalTemplates = shuffle(selected).slice(0, count);
  return finalTemplates.map((t) => buildQuestionFromTemplate(topicId, t));
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