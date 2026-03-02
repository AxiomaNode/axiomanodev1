// src/core/generators/quadraticGenerator.js

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (arr) => arr[randInt(0, arr.length - 1)];

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeOptions = (correctText, wrongTexts) => {
  const labels = ["A", "B", "C", "D"];
  const all = shuffle([correctText, ...wrongTexts].slice(0, 4));
  const correctIndex = all.indexOf(correctText);
  return {
    options: all.map((value, i) => ({ label: labels[i], value })),
    correct: labels[correctIndex],
  };
};

// ── Generator 1: Vieta → discriminant reasoning ──────────────
const genVietaDiscriminant = () => {
  const r1 = randInt(-6, 8);
  let r2 = randInt(-6, 8);
  while (r2 === r1) r2 = randInt(-6, 8);

  const S = r1 + r2;
  const P = r1 * r2;
  const D = S * S - 4 * P;

  const statementCorrect = pick([true, false]);
  const wrongD = D + pick([1, 4, 9, 16]);

  const studentClaim = statementCorrect
    ? `The discriminant must be ${D}.`
    : `The discriminant must be ${wrongD}.`;

  const correctText = statementCorrect
    ? `Yes — using Vieta: D = (r₁+r₂)² − 4r₁r₂ = ${S}² − 4·${P} = ${D}.`
    : `No — using Vieta: D = (r₁+r₂)² − 4r₁r₂ = ${S}² − 4·${P} = ${D}, not ${wrongD}.`;

  const wrongs = statementCorrect
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

  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id: `q_vietaD_${Date.now()}_${randInt(100, 999)}`,
    text:
      `Quadratic x² + bx + c = 0 has roots r₁ and r₂. ` +
      `You know r₁ + r₂ = ${S} and r₁·r₂ = ${P}. ` +
      `A student says: "${studentClaim}" Is the student correct?`,
    options,
    correct,
  };
};

// ── Generator 2: "Dividing by x" trap ───────────────────────
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
    id: `q_div_${Date.now()}_${randInt(100, 999)}`,
    text: `A student solves x² = ${k}x by dividing both sides by x, getting x = ${k}. What is the complete solution set?`,
    options,
    correct,
  };
};

// ── Generator 3: Touching x-axis / vertex ───────────────────
const genTouchXAxis = () => {
  const vx = randInt(-5, 5);
  // y = (x - vx)^2 = x^2 - 2vx·x + vx^2
  const b = -2 * vx;
  const c = vx * vx;
  const bStr = b === 0 ? "" : b > 0 ? ` + ${b}x` : ` − ${Math.abs(b)}x`;
  const cStr = c === 0 ? "" : ` + ${c}`;

  const correctText = `Correct — vertex is (${vx}, 0): exactly one root, D = 0.`;
  const wrongs = [
    `Wrong — if D = 0 the parabola crosses the x-axis at two points.`,
    `Wrong — vertex x-coordinate is x = ${vx + randInt(1, 3)} (off by a sign).`,
    `Cannot determine without the full equation.`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id: `q_touch_${Date.now()}_${randInt(100, 999)}`,
    text:
      `The parabola y = x²${bStr}${cStr} touches the x-axis at exactly one point. ` +
      `A student claims the vertex is at (${vx}, 0). Which statement is accurate?`,
    options,
    correct,
  };
};

// ── Generator 4: Negative discriminant / no real roots ───────
const genNoRealRoots = () => {
  // y = x^2 + bx + c where D < 0: pick b even, c > b^2/4
  const b = pick([-4, -2, 0, 2, 4]);
  const minC = Math.floor((b * b) / 4) + 1;
  const c = minC + randInt(0, 4);
  const D = b * b - 4 * c;
  const bStr = b === 0 ? "" : b > 0 ? ` + ${b}x` : ` − ${Math.abs(b)}x`;

  const correctText = `No real roots — D = ${D} < 0, so the parabola doesn't cross the x-axis.`;
  const wrongs = [
    `Two real roots — negative discriminant means two negative roots.`,
    `One real root — D < 0 means a repeated root.`,
    `Two real roots — the formula x = (−b ± √D)/2 still works with D < 0.`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id: `q_noroots_${Date.now()}_${randInt(100, 999)}`,
    text:
      `Consider x² ${bStr} + ${c} = 0. ` +
      `A student computes D = ${b}² − 4·${c} = ${D} and concludes the equation has no real roots. ` +
      `Is the student right?`,
    options,
    correct,
  };
};

// ── Generator 5: Wrong sign in Vieta (classic mistake) ───────
const genVietaSignMistake = () => {
  const r1 = randInt(1, 7);
  const r2 = randInt(1, 7);
  const S = r1 + r2;
  const P = r1 * r2;
  // quadratic: (x - r1)(x - r2) = x^2 - S·x + P
  // b = -S,  c = P

  const correctText = `b = −${S} and c = ${P} — Vieta: sum = −b, product = c.`;
  const wrongs = [
    `b = ${S} and c = ${P} — the student forgot the sign of b.`,
    `b = −${S} and c = −${P} — product of roots is −c.`,
    `b = ${P} and c = ${S} — the student swapped sum and product.`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id: `q_vietasign_${Date.now()}_${randInt(100, 999)}`,
    text:
      `A quadratic x² + bx + c = 0 has roots x₁ = ${r1} and x₂ = ${r2}. ` +
      `What are the correct values of b and c?`,
    options,
    correct,
  };
};

// ── Generator 6: Completing the square ───────────────────────
const genCompleteSquare = () => {
  const h = randInt(-5, 5);
  const k = randInt(-10, 10);
  // y = (x - h)^2 + k = x^2 - 2h·x + (h^2 + k)
  const b = -2 * h;
  const c = h * h + k;
  const bStr = b === 0 ? "" : b > 0 ? ` + ${b}x` : ` − ${Math.abs(b)}x`;
  const cStr = c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`;
  const kStr = k === 0 ? "0" : k > 0 ? `+${k}` : `${k}`;

  const correctText = `y = (x − ${h})² ${kStr}, vertex at (${h}, ${k}).`;
  const wrongH = h + pick([-1, 1, 2]);
  const wrongs = [
    `y = (x + ${h})²${k !== 0 ? ` ${kStr}` : ""}, vertex at (−${h}, ${k}).`,
    `y = (x − ${h})² − ${k}, vertex at (${h}, −${k}).`,
    `y = (x − ${wrongH})²${k !== 0 ? ` ${kStr}` : ""}, vertex at (${wrongH}, ${k}).`,
  ];
  const { options, correct } = makeOptions(correctText, wrongs);
  return {
    id: `q_ctsq_${Date.now()}_${randInt(100, 999)}`,
    text:
      `Complete the square for y = x²${bStr}${cStr}. ` +
      `Which form and vertex are correct?`,
    options,
    correct,
  };
};

// ── Public API ────────────────────────────────────────────────
// Cycles through generators in shuffled order to avoid repeats.
// With 6 generator types and count=15 each type appears 2-3 times max,
// and within each "deck" of 6 the order is random.

export const generateQuadraticTasks = (count = 10) => {
  const gens = [
    genVietaDiscriminant,
    genDivideTrap,
    genTouchXAxis,
    genNoRealRoots,
    genVietaSignMistake,
    genCompleteSquare,
  ];

  const out = [];
  const seen = new Set();

  let deck = [];
  let tries = 0;
  const MAX_TRIES = count * 40;

  while (out.length < count && tries < MAX_TRIES) {
    tries++;

    if (deck.length === 0) deck = shuffle(gens.slice());

    const task = deck.pop()();

    // fallback если sig вдруг забыли
    const sig = task.sig ?? `${task.text}`.slice(0, 140).toLowerCase();

    if (seen.has(sig)) continue;

    seen.add(sig);
    out.push(task);
  }

  // если из-за узких диапазонов не хватило задач — добьём чем есть
  // (редко, но лучше чем пусто)
  while (out.length < count) {
    const t = shuffle(gens.slice())[0]();
    out.push(t);
  }

  return out;
};