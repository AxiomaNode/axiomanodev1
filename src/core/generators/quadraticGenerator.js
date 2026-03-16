// src/core/generators/quadraticGenerator.js
// v3 — fixed makeOptions dedup, guarded genCompleteSquare h≠0,
//      guarded genRootEquation S≠0 and P≠0 to prevent option collisions

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick    = (arr) => arr[randInt(0, arr.length - 1)];

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── makeOptions ────────────────────────────────────────────────
// Deduplicates wrongs against correct AND against each other before
// shuffling. Prevents identical options appearing in the same question.
const makeOptions = (correctText, wrongTexts) => {
  const labels = ["A", "B", "C", "D"];
  const seen   = new Set([correctText]);
  const unique = wrongTexts.filter((w) => {
    if (seen.has(w)) return false;
    seen.add(w);
    return true;
  });
  const all = shuffle([correctText, ...unique].slice(0, 4));
  const ci  = all.indexOf(correctText);
  return {
    options: all.map((value, i) => ({ label: labels[i], value })),
    correct: labels[ci],
  };
};

// ── Formatting helpers ─────────────────────────────────────────
const bxStr = (b) => {
  if (b === 0)  return "";
  if (b === 1)  return " + x";
  if (b === -1) return " − x";
  if (b > 0)    return ` + ${b}x`;
  return ` − ${Math.abs(b)}x`;
};
const cStr  = (c) => {
  if (c === 0) return "";
  if (c > 0)   return ` + ${c}`;
  return ` − ${Math.abs(c)}`;
};
const factor = (r) => {
  if (r === 0)  return "x";
  if (r > 0)    return `(x − ${r})`;
  return `(x + ${Math.abs(r)})`;
};

// ══════════════════════════════════════════════════════════════
// GENERATOR 1: Vieta → discriminant reasoning
// ══════════════════════════════════════════════════════════════
const genVietaDiscriminant = () => {
  const r1 = randInt(-6, 8);
  let   r2 = randInt(-6, 8);
  while (r2 === r1) r2 = randInt(-6, 8);

  const S = r1 + r2;
  const P = r1 * r2;
  const D = S * S - 4 * P;

  const correct = pick([true, false]);
  const wrongD  = D + pick([1, 4, 9, 16]);

  const claim      = correct ? `The discriminant must be ${D}.` : `The discriminant must be ${wrongD}.`;
  const correctText = correct
    ? `Yes — using Vieta: D = (r₁+r₂)² − 4r₁r₂ = ${S}² − 4·${P} = ${D}.`
    : `No — using Vieta: D = (r₁+r₂)² − 4r₁r₂ = ${S}² − 4·${P} = ${D}, not ${wrongD}.`;

  const wrongs = correct
    ? [
        `No — D depends on a, so you cannot compute it without a.`,
        `No — D = (r₁+r₂)² + 4r₁r₂, so it's ${S}² + 4·${P}.`,
        `Cannot determine — need the exact quadratic equation.`,
      ]
    : [
        `Yes — because (r₁−r₂)² matches the claim.`,
        `Yes — because b = ${S}, so D = b² − 4c equals the claim.`,
        `Cannot determine — Vieta doesn't allow computing D.`,
      ];

  const { options, correct: ans } = makeOptions(correctText, wrongs);
  return {
    id:       `q_vietaD_${Date.now()}_${randInt(100, 999)}`,
    sig:      `vietaD_${r1}_${r2}_${correct ? 1 : 0}`,
    category: "Vieta's Formulas",
    text:
      `Quadratic x² + bx + c = 0 has roots r₁ and r₂. ` +
      `You know r₁ + r₂ = ${S} and r₁·r₂ = ${P}. ` +
      `A student says: "${claim}" Is the student correct?`,
    options,
    correct: ans,
  };
};

// ══════════════════════════════════════════════════════════════
// GENERATOR 2: "Dividing by x" trap
// ══════════════════════════════════════════════════════════════
const genDivideTrap = () => {
  const k = pick([2, 3, 4, 5, 6, 7, 8, 10, 12]);
  const correctText = `x = 0 and x = ${k} — dividing by x silently loses x = 0.`;
  const wrongs = [
    `x = ${k} only — dividing both sides is always valid.`,
    `x = 0 only — both sides become 0.`,
    `x = ±${k} — square root gives two values.`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id:       `q_div_${Date.now()}_${randInt(100, 999)}`,
    sig:      `div_${k}`,
    category: "Common Mistakes",
    text:     `A student solves x² = ${k}x by dividing both sides by x, getting x = ${k}. What is the complete solution set?`,
    options,
    correct,
  };
};

// ══════════════════════════════════════════════════════════════
// GENERATOR 3: Touching x-axis / vertex
// ══════════════════════════════════════════════════════════════
const genTouchXAxis = () => {
  const vx = randInt(-5, 5);
  const b  = -2 * vx;
  const c  = vx * vx;

  const correctText = `Correct — vertex is (${vx}, 0): exactly one root, D = 0.`;
  const wrongs = [
    `Wrong — if D = 0 the parabola crosses the x-axis at two points.`,
    `Wrong — vertex x-coordinate is ${vx + randInt(1, 3)} (sign error).`,
    `Cannot determine without the full equation.`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id:       `q_touch_${Date.now()}_${randInt(100, 999)}`,
    sig:      `touch_${vx}`,
    category: "Discriminant",
    text:
      `The parabola y = x²${bxStr(b)}${cStr(c)} touches the x-axis at exactly one point. ` +
      `A student claims the vertex is at (${vx}, 0). Which statement is accurate?`,
    options,
    correct,
  };
};

// ══════════════════════════════════════════════════════════════
// GENERATOR 4: Negative discriminant / no real roots
// ══════════════════════════════════════════════════════════════
const genNoRealRoots = () => {
  const b    = pick([-4, -2, 0, 2, 4]);
  const minC = Math.floor((b * b) / 4) + 1;
  const c    = minC + randInt(0, 4);
  const D    = b * b - 4 * c;

  const correctText = `No real roots — D = ${D} < 0, so the parabola doesn't cross the x-axis.`;
  const wrongs = [
    `Two real roots — negative discriminant means two negative roots.`,
    `One real root — D < 0 means a repeated root.`,
    `Two real roots — the formula x = (−b ± √D)/2 still works with D < 0.`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);

  const bLabel = b === 0 ? "" : b > 0 ? ` + ${b}x` : ` − ${Math.abs(b)}x`;

  return {
    id:       `q_noroots_${Date.now()}_${randInt(100, 999)}`,
    sig:      `noroots_${b}_${c}`,
    category: "Discriminant",
    text:
      `Consider x²${bLabel} + ${c} = 0. ` +
      `A student computes D = ${b}² − 4·${c} = ${D} and concludes the equation has no real roots. ` +
      `Is the student right?`,
    options,
    correct,
  };
};

// ══════════════════════════════════════════════════════════════
// GENERATOR 5: Wrong sign in Vieta (classic mistake)
// ══════════════════════════════════════════════════════════════
const genVietaSignMistake = () => {
  const r1 = randInt(1, 7);
  const r2 = randInt(1, 7);
  const S  = r1 + r2;   // b = -S
  const P  = r1 * r2;   // c = P

  const correctText = `b = −${S} and c = ${P} — Vieta: sum = −b, product = c.`;
  const wrongs = [
    `b = ${S} and c = ${P} — the student forgot the sign of b.`,
    `b = −${S} and c = −${P} — product of roots is −c.`,
    `b = ${P} and c = ${S} — the student swapped sum and product.`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id:       `q_vietasign_${Date.now()}_${randInt(100, 999)}`,
    sig:      `vietasign_${r1}_${r2}`,
    category: "Vieta's Formulas",
    text:
      `A quadratic x² + bx + c = 0 has roots x₁ = ${r1} and x₂ = ${r2}. ` +
      `What are the correct values of b and c?`,
    options,
    correct,
  };
};

// ══════════════════════════════════════════════════════════════
// GENERATOR 6: Completing the square
// Guard: h ≠ 0 prevents (x − 0)² and (x + 0)² from appearing
// as visually distinct but mathematically identical options.
// ══════════════════════════════════════════════════════════════
const genCompleteSquare = () => {
  let h = randInt(-5, 5);
  while (h === 0) h = randInt(-5, 5);          // guard: h ≠ 0
  const k = randInt(-10, 10);
  const b = -2 * h;
  const c = h * h + k;

  const kSign = k === 0 ? "" : k > 0 ? ` + ${k}` : ` − ${Math.abs(k)}`;
  const correctText = `y = (x − ${h})²${kSign}, vertex at (${h}, ${k}).`;

  const wrongH = h + pick([-1, 1, 2]);
  const wrongs = [
    `y = (x + ${h})²${kSign}, vertex at (−${h}, ${k}).`,
    `y = (x − ${h})² − ${k}, vertex at (${h}, −${k}).`,
    `y = (x − ${wrongH})²${kSign}, vertex at (${wrongH}, ${k}).`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id:       `q_ctsq_${Date.now()}_${randInt(100, 999)}`,
    sig:      `ctsq_${h}_${k}`,
    category: "Vertex Form",
    text:     `Complete the square for y = x²${bxStr(b)}${cStr(c)}. Which form and vertex are correct?`,
    options,
    correct,
  };
};

// ══════════════════════════════════════════════════════════════
// GENERATOR 7: Factored form
// ══════════════════════════════════════════════════════════════
const genFactoredForm = () => {
  const r1 = randInt(-5, 5);
  let   r2 = randInt(-5, 5);
  while (r2 === r1) r2 = randInt(-5, 5);

  const S = r1 + r2;
  const P = r1 * r2;

  const correctText = `${factor(r1)} · ${factor(r2)}`;

  const wr1 = r1 + pick([-1, 1]);
  const wr2 = r2 + pick([-1, 1]);
  const wrongs = [
    `${factor(-r1)} · ${factor(-r2)}`,
    `${factor(wr1)} · ${factor(r2)}`,
    `${factor(r1)} · ${factor(wr2)}`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id:       `q_factor_${Date.now()}_${randInt(100, 999)}`,
    sig:      `factor_${Math.min(r1,r2)}_${Math.max(r1,r2)}`,
    category: "Factoring",
    text:     `Which factored form correctly represents x²${bxStr(-S)}${cStr(P)} = 0?`,
    options,
    correct,
  };
};

// ══════════════════════════════════════════════════════════════
// GENERATOR 8: "Which equation has these roots?"
// Constraints enforced upfront — no recursion, no retry loop:
//   r1 ≠ 0          → ensures P = r1·r2 ≠ 0 (given r2 ≠ 0 below)
//   r2 ∉ {0, r1, -r1} → ensures r2 ≠ r1 (distinct roots),
//                        r2 ≠ 0 (P ≠ 0), r2 ≠ -r1 (S ≠ 0)
// Without these, bxStr/cStr collapse to "" for both correct and
// a wrong option, producing a literal duplicate string.
// ══════════════════════════════════════════════════════════════
const genRootEquation = () => {
  // r1: non-zero integer in [-6, 6]
  const r1pool = [-6,-5,-4,-3,-2,-1,1,2,3,4,5,6];
  const r1 = pick(r1pool);

  // r2: exclude 0 (P≠0), r1 (distinct), -r1 (S≠0)
  const excluded = new Set([0, r1, -r1]);
  const r2pool   = r1pool.filter((n) => !excluded.has(n));
  const r2       = pick(r2pool);

  const S = r1 + r2;  // guaranteed ≠ 0
  const P = r1 * r2;  // guaranteed ≠ 0

  const correctText = `x²${bxStr(-S)}${cStr(P)} = 0`;

  const wrongs = [
    `x²${bxStr(S)}${cStr(P)} = 0`,
    `x²${bxStr(-S)}${cStr(-P)} = 0`,
    `x²${bxStr(-P)}${cStr(S)} = 0`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id:       `q_rooteq_${Date.now()}_${randInt(100, 999)}`,
    sig:      `rooteq_${Math.min(r1,r2)}_${Math.max(r1,r2)}`,
    category: "Roots",
    text:     `Which quadratic equation (leading coefficient 1) has exactly the roots x₁ = ${r1} and x₂ = ${r2}?`,
    options,
    correct,
  };
};

// ══════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════
export const generateQuadraticTasks = (count = 10) => {
  const gens = [
    genVietaDiscriminant,
    genDivideTrap,
    genTouchXAxis,
    genNoRealRoots,
    genVietaSignMistake,
    genCompleteSquare,
    genFactoredForm,
    genRootEquation,
  ];

  const out  = [];
  const seen = new Set();
  let deck   = [];
  let tries  = 0;

  while (out.length < count && tries < count * 60) {
    tries++;
    if (deck.length === 0) deck = shuffle(gens.slice());

    const task = deck.pop()();
    if (seen.has(task.sig)) continue;

    seen.add(task.sig);
    out.push(task);
  }

  // Safety fill if narrow ranges ran dry
  while (out.length < count) {
    out.push(shuffle(gens.slice())[0]());
  }

  return out;
};