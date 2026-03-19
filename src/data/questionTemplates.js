/**
 * questionTemplates.js  —  src/data/questionTemplates.js
 *
 * 60 parameterized templates across 5 gap series for quadratic equations.
 * Each template.generate() produces a unique question via random parameters.
 * Wrong options represent specific reasoning failures, not random values.
 *
 * Used by: puzzles (random draw), practice (gap-filtered draw)
 * NOT used by: diagnostics (uses fixed questions.js)
 *
 * IMPORTANT: correct is returned as a LABEL (A/B/C/D), matching
 * what PuzzlesPage and PracticePage store in answers state.
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Shuffles correct + wrongs into labeled options.
 * Returns correct as LABEL (A/B/C/D), gapAnswers as wrong VALUE strings.
 */
const buildOptions = (correctValue, wrongValues) => {
  const labels = ["A", "B", "C", "D"];
  const seen = new Set([correctValue]);
  const unique = wrongValues.filter(w => {
    if (!w || seen.has(w)) return false;
    seen.add(w);
    return true;
  });
  const shuffled = shuffle([correctValue, ...unique].slice(0, 4));
  const correctLabel = labels[shuffled.indexOf(correctValue)];
  return {
    options: shuffled.map((value, i) => ({ value, label: labels[i] })),
    correct: correctLabel,
    gapAnswers: unique,
  };
};

// fmt(1, -5, 6) → "x² − 5x + 6 = 0"
const fmt = (a, b, c) => {
  const parts = [];
  if (a === 1)       parts.push("x²");
  else if (a === -1) parts.push("−x²");
  else               parts.push(`${a}x²`);
  if (b !== 0) {
    const abs = Math.abs(b);
    const coeff = abs === 1 ? "" : String(abs);
    parts.push(b > 0 ? `+ ${coeff}x` : `− ${coeff}x`);
  }
  if (c !== 0) parts.push(c > 0 ? `+ ${c}` : `− ${Math.abs(c)}`);
  return parts.join(" ") + " = 0";
};

const display = (x) => x < 0 ? `−${Math.abs(x)}` : String(x);

export const questionTemplates = {
  quadratic: [

    /* ═══════════════════════════════════════════════════════
       A-SERIES  ·  q-discriminant
       Gap: misreading what the discriminant tells you
       12 templates
    ═══════════════════════════════════════════════════════ */

    // A1 — identify equation with no real solutions
    // Trap: picks equation with D>0 (two roots) or D=0 (one root) instead of D<0
    {
      id: "A1", gapTag: "q-discriminant",
      generate() {
        const sq = pick([2, 3, 4, 5]);
        const k  = sq * sq;
        const correct = fmt(1, 0, k);           // x² + k = 0  →  D = −4k < 0
        const w1 = fmt(1, 0, -k);               // x² − k = 0  →  D = 4k > 0
        const w2 = fmt(1, -2 * sq, k);          // (x−sq)² = 0 →  D = 0
        const w3 = fmt(1, -(sq + 1), sq);       // (x−sq)(x−1) →  D > 0
        return {
          text: "Which equation has no solutions in ℝ?",
          ...buildOptions(correct, [w1, w2, w3]),
        };
      },
    },

    // A2 — D = 0, choose correct conclusion
    // Trap: D=0 confused with D>0 (two roots) or D<0 (no roots)
    {
      id: "A2", gapTag: "q-discriminant",
      generate() {
        const sq = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `For ${fmt(1, -2 * sq, sq * sq)}, D = 0. Choose the correct statement.`,
          ...buildOptions(
            "Exactly one value of x satisfies it",
            [
              "Exactly two different values of x satisfy it",
              "No values of x satisfy it",
              "Every x satisfies it",
            ]
          ),
        };
      },
    },

    // A3 — D < 0 given, choose best conclusion
    // Trap: reads D<0 as "one solution" (D=0 confusion) or "two negative solutions"
    {
      id: "A3", gapTag: "q-discriminant",
      generate() {
        const triples = [
          [1,0,1],[1,0,2],[1,1,1],[1,2,2],[1,2,3],
          [1,3,3],[1,3,4],[1,4,5],[2,1,1],[2,2,2],[2,3,3],[3,1,1],
        ];
        const [a, b, c] = pick(triples);
        return {
          text: `${fmt(a, b, c)} has D < 0. Best conclusion?`,
          ...buildOptions(
            "No solutions in ℝ",
            ["Two different solutions in ℝ", "One solution in ℝ", "Infinitely many solutions"]
          ),
        };
      },
    },

    // A4 — computed D (negative) given, choose correct statement
    // Trap: "two solutions both negative" — confused sign of D with sign of roots
    {
      id: "A4", gapTag: "q-discriminant",
      generate() {
        const triples = [
          [1,0,1],[1,0,2],[1,1,1],[1,2,2],[1,2,3],
          [1,3,3],[1,3,4],[1,4,5],[2,1,1],[2,2,2],[3,1,1],
        ];
        const [a, b, c] = pick(triples);
        const D = b * b - 4 * a * c;
        return {
          text: `For ${fmt(a, b, c)}, D = ${D}. Choose the correct statement.`,
          ...buildOptions(
            "No solutions in ℝ",
            [
              "Two different solutions in ℝ",
              "One solution in ℝ",
              "Two solutions in ℝ, both negative",
            ]
          ),
        };
      },
    },

    // A5 — D > 0 but student claims "both roots positive" — sign vs count confusion
    // Trap: D > 0 guarantees COUNT (two), not SIGN; roots may be opposite signs
    {
      id: "A5", gapTag: "q-discriminant",
      generate() {
        const r1 = pick([2, 3, 4, 5]);
        const r2 = pick([-2, -3, -4, -5]);   // opposite sign → product < 0
        const s = r1 + r2, p = r1 * r2;
        const b = -s, c = p;
        const D = b * b - 4 * c;             // = s² − 4p > 0 since p < 0
        return {
          text: `For ${fmt(1, b, c)}, D = ${D}. A student says "D > 0 so both roots are positive." Evaluate.`,
          ...buildOptions(
            "D > 0 tells you there are two real roots, not that both are positive",
            [
              "Correct — D > 0 guarantees both roots are positive",
              "Partially correct — D > 0 guarantees at least one root is positive",
              "Incorrect — D > 0 means both roots are negative",
            ]
          ),
        };
      },
    },

    // A6 — which equation has D = 0?
    // Trap: picks D>0 (difference of squares) or D<0 (sum of squares) instead of perfect square
    {
      id: "A6", gapTag: "q-discriminant",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const correct = fmt(1, -2 * r, r * r); // (x−r)², D = 4r²−4r² = 0
        const w1 = fmt(1, 0, -(r * r));         // x²−r², D = 4r² > 0
        const w2 = fmt(1, 0, r * r);            // x²+r², D = −4r² < 0
        const w3 = fmt(1, -(r + 1), r);         // (x−r)(x−1), D = (r−1)² > 0
        return {
          text: "Which equation has D = 0?",
          ...buildOptions(correct, [w1, w2, w3]),
        };
      },
    },

    // A7 — compute D correctly
    // Traps: b² + 4ac (wrong sign), 2ac instead of 4ac, 2b instead of b²
    {
      id: "A7", gapTag: "q-discriminant",
      generate() {
        const b = pick([2, 3, 4, 5, 6]);
        const c = pick([1, 2, 3]);
        const correct = b * b - 4 * c;
        const w1 = b * b + 4 * c;   // wrong sign
        const w2 = b * b - 2 * c;   // halved the 4 coefficient
        const w3 = 2 * b - 4 * c;   // forgot to square b
        const vals = [String(correct), String(w1), String(w2), String(w3)];
        const wrongs = new Set(vals).size >= 4
          ? [String(w1), String(w2), String(w3)]
          : [String(w1), String(w2 + 1), String(w3 + 2)];
        return {
          text: `Compute D for ${fmt(1, b, c)}.`,
          ...buildOptions(String(correct), wrongs),
        };
      },
    },

    // A8 — given D value, count x-intercepts of parabola
    // Trap: confuses D<0 with D=0 (1 intercept) or D>0 (2 intercepts)
    {
      id: "A8", gapTag: "q-discriminant",
      generate() {
        const scenario = pick([
          { D: pick([-1,-3,-5,-7,-12]), intercepts: "0", wrong: ["1", "2", "3"] },
          { D: 0,                       intercepts: "1", wrong: ["0", "2", "3"] },
          { D: pick([1, 4, 9, 16, 25]), intercepts: "2", wrong: ["0", "1", "3"] },
        ]);
        return {
          text: `A parabola y = ax² + bx + c has D = ${scenario.D}. How many x-intercepts does it have?`,
          ...buildOptions(scenario.intercepts, scenario.wrong),
        };
      },
    },

    // A9 — a > 0 and c < 0: what must be true about D?
    // Trap: student thinks D depends on b; misses that -4ac is already positive
    {
      id: "A9", gapTag: "q-discriminant",
      generate() {
        return {
          text: "For ax² + bx + c = 0, you know a > 0 and c < 0. What can be concluded about D?",
          ...buildOptions(
            "D > 0 for any value of b",
            [
              "D may be positive or negative depending on b",
              "D < 0 for any value of b",
              "D = 0 for any value of b",
            ]
          ),
        };
      },
    },

    // A10 — b = 0, a > 0, c > 0: solution set?
    // Trap: student writes x = 0 (confused with x² = 0 case)
    {
      id: "A10", gapTag: "q-discriminant",
      generate() {
        const a = pick([1, 2, 3]);
        const c = pick([1, 2, 3, 4, 5]);
        const approx = Math.sqrt(c / a).toFixed(2);
        return {
          text: `${fmt(a, 0, c)}. What is the solution set in ℝ?`,
          ...buildOptions(
            "Empty — no real solutions",
            [`{0, ${approx}}`, `{0}`, `{−${c}, ${c}}`]
          ),
        };
      },
    },

    // A11 — D is a perfect square: what kind of solutions?
    // Trap: student says "irrational" (doesn't know perfect square → rational)
    {
      id: "A11", gapTag: "q-discriminant",
      generate() {
        const r1 = pick([1, 2, 3, 4, 5]);
        const r2 = pick([1, 2, 3, 4, 5].filter(v => v !== r1));
        const s = r1 + r2, p = r1 * r2;
        const b = -s, c = p;
        const D = b * b - 4 * c; // = (r1−r2)², a perfect square
        return {
          text: `For ${fmt(1, b, c)}, D = ${D}. What type of solutions does the equation have?`,
          ...buildOptions(
            "Two distinct rational solutions",
            [
              "Two distinct irrational solutions",
              "One rational solution (repeated)",
              "No real solutions",
            ]
          ),
        };
      },
    },

    // A12 — student claims D < 0 means "two negative roots"
    // Trap: confuses sign of discriminant with sign of roots
    {
      id: "A12", gapTag: "q-discriminant",
      generate() {
        const triples = [[1,0,1],[1,1,1],[1,2,2],[1,2,3],[1,3,4],[2,1,1]];
        const [a, b, c] = pick(triples);
        const D = b * b - 4 * a * c;
        return {
          text: `${fmt(a, b, c)} has D = ${D}. A student writes "D < 0 means both roots are negative." Best response?`,
          ...buildOptions(
            "D < 0 means no real roots exist, not that roots are negative",
            [
              "Correct — a negative discriminant means negative roots",
              "Partially correct — one root is negative",
              "Correct — apply the formula with the negative D directly",
            ]
          ),
        };
      },
    },

    /* ═══════════════════════════════════════════════════════
       B-SERIES  ·  q-double-root
       Gap: missing the second square-root outcome
       12 templates
    ═══════════════════════════════════════════════════════ */

    // B1 — student claims x²=k has only positive root
    {
      id: "B1", gapTag: "q-double-root",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const k = r * r;
        return {
          text: `A student claims: "x² = ${k} has only x = ${r}." Best correction?`,
          ...buildOptions(
            "The solution set has two elements",
            [
              "The solution set has one element",
              "The equation is inconsistent",
              "The equation has infinitely many solutions",
            ]
          ),
        };
      },
    },

    // B2 — compare solution counts: x²−k=0 vs (x−r)²=0
    // Trap: student says both have 2 solutions, or both have 1
    {
      id: "B2", gapTag: "q-double-root",
      generate() {
        const r = pick([3, 4, 5, 6, 7]);
        const k = r * r;
        return {
          text: `Compare: (1) ${fmt(1, 0, -k)} and (2) ${fmt(1, -2 * r, k)}. How many real solutions each? (for 1, then for 2)`,
          ...buildOptions("(2, 1)", ["(2, 2)", "(1, 1)", "(1, 2)"]),
        };
      },
    },

    // B3 — student writes only positive root, how many missing from solution set
    {
      id: "B3", gapTag: "q-double-root",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const k = r * r;
        return {
          text: `A student writes only x = ${r} for x² = ${k}. How many elements are in the correct solution set?`,
          ...buildOptions("2", ["0", "1", "Infinitely many"]),
        };
      },
    },

    // B4 — (x±r)² = 0: how many elements in solution set
    // Trap: student sees "two-factor" form and expects two solutions
    {
      id: "B4", gapTag: "q-double-root",
      generate() {
        const r    = pick([2, 3, 4, 5, 6, 7, 8]);
        const sign = Math.random() > 0.5 ? "−" : "+";
        return {
          text: `(x ${sign} ${r})² = 0. Correct description of the solution set in ℝ?`,
          ...buildOptions(
            "It contains exactly one element",
            [
              "It contains exactly two different elements",
              "It contains no elements",
              "It contains infinitely many elements",
            ]
          ),
        };
      },
    },

    // B5 — student writes √k as only answer; which value is missing?
    // Trap: picks x=0 or x=k instead of −√k
    {
      id: "B5", gapTag: "q-double-root",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const k = r * r;
        return {
          text: `A student solves x² = ${k} and writes "x = ${r}". Which element of the complete solution set is missing?`,
          ...buildOptions(
            `x = −${r}`,
            [`x = 0`, `x = ${k}`, `x = ${r * r}`]
          ),
        };
      },
    },

    // B6 — x²=k for non-perfect-square k — calculator gives one answer; is it complete?
    {
      id: "B6", gapTag: "q-double-root",
      generate() {
        const k    = pick([2, 3, 5, 6, 7, 8, 10, 11]);
        const approx = Math.sqrt(k).toFixed(2);
        return {
          text: `x² = ${k}. A student uses a calculator and finds x ≈ ${approx}. Is this the complete solution?`,
          ...buildOptions(
            `No — x ≈ −${approx} is also a solution`,
            [
              "Yes — the calculator gives the complete answer",
              "No — x = 0 is also a solution",
              `No — x = −${k} is also a solution`,
            ]
          ),
        };
      },
    },

    // B7 — (x−a)² = b for b > 0: how many real solutions?
    // Trap: student applies square root without ±, gets only one
    {
      id: "B7", gapTag: "q-double-root",
      generate() {
        const a = pick([1, 2, 3, 4, 5]);
        const b = pick([1, 4, 9, 16, 25]);
        return {
          text: `(x − ${a})² = ${b}. How many real solutions does this equation have?`,
          ...buildOptions("2", ["1", "0", "Depends on the value of a"]),
        };
      },
    },

    // B8 — x² = 0 edge case: how many elements in solution set?
    // Trap: student applies ± and writes "two solutions: x = 0 and x = −0"
    {
      id: "B8", gapTag: "q-double-root",
      generate() {
        return {
          text: "x² = 0. How many elements are in the solution set?",
          ...buildOptions(
            "1 — only x = 0",
            [
              "2 — applying ± gives x = 0 and x = −0",
              "0 — the equation has no solutions",
              "Infinitely many",
            ]
          ),
        };
      },
    },

    // B9 — (x−a)² = b: student writes only the larger root
    {
      id: "B9", gapTag: "q-double-root",
      generate() {
        const a   = pick([1, 2, 3, 4]);
        const sqb = pick([1, 2, 3, 4]);
        const b   = sqb * sqb;
        return {
          text: `(x − ${a})² = ${b}. A student writes only x = ${a + sqb}. What's missing?`,
          ...buildOptions(
            `x = ${a - sqb}`,
            [`x = 0`, `x = −${a + sqb}`, `x = ${a * sqb}`]
          ),
        };
      },
    },

    // B10 — x²−r² = 0: student only sees (x−r) factor, writes one root
    // Trap: sees (x-r) and stops; forgets (x+r) gives a second root
    {
      id: "B10", gapTag: "q-double-root",
      generate() {
        const r = pick([3, 4, 5, 6, 7]);
        return {
          text: `x² − ${r * r} = 0. A student factors and writes only x = ${r}. Why is this incomplete?`,
          ...buildOptions(
            `The factor (x + ${r}) also gives x = −${r}`,
            [
              `The equation also has x = 0 as a solution`,
              `The equation has no real solutions`,
              `The factorization (x − ${r})(x + ${r}) is wrong`,
            ]
          ),
        };
      },
    },

    // B11 — student writes x = ±k instead of x = ±√k (confused root with square)
    {
      id: "B11", gapTag: "q-double-root",
      generate() {
        const r = pick([2, 3, 4, 5]);
        const k = r * r;
        return {
          text: `x² = ${k}. A student writes "x = ±${k}". Evaluate this answer.`,
          ...buildOptions(
            `Incorrect — the solutions are x = ±${r}, not ±${k}`,
            [
              `Correct — x = ±${k} satisfies the equation`,
              `Partially correct — x = ${k} is right but x = −${k} is not`,
              `Incorrect — the only solution is x = ${r}`,
            ]
          ),
        };
      },
    },

    // B12 — x² = −k: student writes x = ±√k — no real solutions exist
    {
      id: "B12", gapTag: "q-double-root",
      generate() {
        const r = pick([1, 2, 3, 4, 5]);
        const k = r * r;
        return {
          text: `x² = −${k}. A student writes x = ±${r}. Evaluate.`,
          ...buildOptions(
            `Incorrect — no real number squared gives −${k}; the solution set in ℝ is empty`,
            [
              `Correct — taking ± of any square root gives two solutions`,
              `Partially correct — x = ${r} is a solution but x = −${r} is not`,
              `Incorrect — the solution is x = ${k}`,
            ]
          ),
        };
      },
    },

    /* ═══════════════════════════════════════════════════════
       C-SERIES  ·  q-div-by-var
       Gap: dividing by an expression containing x
       12 templates
    ═══════════════════════════════════════════════════════ */

    // C1 — ax²−bx=0: student divides by x, evaluate
    {
      id: "C1", gapTag: "q-div-by-var",
      generate() {
        const a = pick([2, 3, 4, 5]);
        const k = pick([2, 3, 4, 5]);
        const b = a * k;
        return {
          text: `${a}x² − ${b}x = 0. A student divides by x and concludes x = ${k}. Most accurate evaluation?`,
          ...buildOptions(
            "Conclusion is correct but incomplete",
            ["Conclusion is correct and complete", "Conclusion is incorrect", "Cannot be determined"]
          ),
        };
      },
    },

    // C2 — ax² = bx: choose correct solution set
    // Trap: picks {k} (forgot x=0), {0}, or {−k, k}
    {
      id: "C2", gapTag: "q-div-by-var",
      generate() {
        const a = pick([2, 3, 4, 5]);
        const k = pick([2, 3, 4, 5]);
        const b = a * k;
        return {
          text: `${a}x² = ${b}x. Choose the correct solution set in ℝ.`,
          ...buildOptions(
            `{0, ${k}}`,
            [`{${k}}`, `{0}`, `{−${k}, ${k}}`]
          ),
        };
      },
    },

    // C3 — x² = kx: which method preserves equivalence?
    // Trap: "divide both sides by x" looks valid but loses x=0
    {
      id: "C3", gapTag: "q-div-by-var",
      generate() {
        const k = pick([2, 3, 4, 5, 6]);
        return {
          text: `x² = ${k}x. Choose the method that preserves equivalence for all x.`,
          ...buildOptions(
            `Rewrite as x² − ${k}x = 0 and factor`,
            [
              "Divide both sides by x",
              "Take square roots of both sides",
              `Move ${k}x to the left, then cancel x`,
            ]
          ),
        };
      },
    },

    // C4 — x³ = x²: student divides by x², missing exactly one value
    {
      id: "C4", gapTag: "q-div-by-var",
      generate() {
        return {
          text: "x³ = x². A student divides by x² and gets x = 1. Choose the best statement.",
          ...buildOptions(
            "The final set is missing exactly one value",
            [
              "The final set is complete",
              "The final set is missing two values",
              "The equation has no solutions",
            ]
          ),
        };
      },
    },

    // C5 — ax(x−k) = 0: student cancels x, evaluate
    {
      id: "C5", gapTag: "q-div-by-var",
      generate() {
        const a = pick([2, 3, 4]);
        const k = pick([2, 3, 4, 5, 6]);
        return {
          text: `${a}x(x − ${k}) = 0. A student cancels x and writes x = ${k}. Evaluate.`,
          ...buildOptions(
            `Incomplete — x = 0 is also a solution`,
            [
              `Complete — x = ${k} is the only solution`,
              `Incorrect — x = −${k} is the correct solution`,
              `Incorrect — dividing by x always requires a sign check`,
            ]
          ),
        };
      },
    },

    // C6 — x² + kx = 0: student correctly factors to {0, −k} — is it right?
    // This tests whether student recognizes CORRECT reasoning
    {
      id: "C6", gapTag: "q-div-by-var",
      generate() {
        const k = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `x² + ${k}x = 0. A student factors as x(x + ${k}) = 0 and writes {0, −${k}}. Evaluate.`,
          ...buildOptions(
            "Complete and correct",
            [
              `Incomplete — also need x = ${k}`,
              `Incorrect — should be {0, ${k}}`,
              `Incorrect — should divide by x to get x = −${k} only`,
            ]
          ),
        };
      },
    },

    // C7 — x(x−k) = mx: student divides by x, loses x=0
    {
      id: "C7", gapTag: "q-div-by-var",
      generate() {
        const k = pick([2, 3, 4, 5]);
        const m = pick([1, 2, 3]);
        return {
          text: `x(x − ${k}) = ${m}x. A student divides by x and gets x = ${k + m}. Evaluate.`,
          ...buildOptions(
            `Incomplete — x = 0 is also a solution`,
            [
              `Complete — x = ${k + m} is the only solution`,
              `Incorrect — x = ${k} is the correct answer`,
              `Incorrect — dividing by x changes the meaning of the equation`,
            ]
          ),
        };
      },
    },

    // C8 — which step is NOT valid?
    // Trap: "divide both sides by x" looks like a standard algebraic step
    {
      id: "C8", gapTag: "q-div-by-var",
      generate() {
        const k = pick([2, 3, 4, 5, 6]);
        return {
          text: `Solving ${k}x² = ${k * 2}x. Which step is NOT valid?`,
          ...buildOptions(
            "Divide both sides by x",
            [
              `Divide both sides by ${k}`,
              `Move all terms left: ${k}x² − ${k * 2}x = 0`,
              `Factor out ${k}x: ${k}x(x − 2) = 0`,
            ]
          ),
        };
      },
    },

    // C9 — x² = x: student divides by x and gets x = 1, evaluate
    {
      id: "C9", gapTag: "q-div-by-var",
      generate() {
        return {
          text: `x² = x. A student divides by x and gets x = 1. Evaluate.`,
          ...buildOptions(
            "Incomplete — x = 0 is also a solution",
            [
              "Complete — x = 1 is the only solution",
              "Incorrect — x = −1 is the solution",
              "Incorrect — the equation has no solution because dividing by x is never valid",
            ]
          ),
        };
      },
    },

    // C10 — x³ − k²x = 0: correct solution set
    // Trap: student divides by x and gets only {−k, k}
    {
      id: "C10", gapTag: "q-div-by-var",
      generate() {
        const k   = pick([1, 2, 3, 4, 5]);
        const kSq = k * k;
        return {
          text: `x³ − ${kSq}x = 0. Choose the correct solution set.`,
          ...buildOptions(
            `{−${k}, 0, ${k}}`,
            [`{0, ${k}}`, `{−${k}, ${k}}`, `{0, −${k}}`]
          ),
        };
      },
    },

    // C11 — how many solutions does student miss when dividing by x?
    {
      id: "C11", gapTag: "q-div-by-var",
      generate() {
        const k = pick([2, 3, 4, 5, 6]);
        return {
          text: `x² − ${k}x = 0. A student divides by x and writes x = ${k}. How many solutions are missing?`,
          ...buildOptions("1", ["0", "2", "3"]),
        };
      },
    },

    // C12 — what is the danger of dividing ax² = cx by x?
    {
      id: "C12", gapTag: "q-div-by-var",
      generate() {
        const a = pick([2, 3, 4]);
        const c = pick([2, 3, 4, 6, 8]);
        return {
          text: `${a}x² = ${c}x. A student says "we can divide by x here." What is the danger?`,
          ...buildOptions(
            "Dividing by x loses the solution x = 0",
            [
              "Dividing by x changes the degree of the equation permanently",
              "Dividing by x is valid only if a > c",
              "Dividing by x is always valid for quadratic equations",
            ]
          ),
        };
      },
    },

    /* ═══════════════════════════════════════════════════════
       D-SERIES  ·  q-factoring
       Gap: confusing factoring patterns
       12 templates
    ═══════════════════════════════════════════════════════ */

    // D1 — perfect square trinomial (negative b): choose correct factorization
    // Trap: picks difference-of-squares form (x−r)(x+r) instead of (x−r)²
    {
      id: "D1", gapTag: "q-factoring",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `${fmt(1, -2 * r, r * r)}. Choose the correct factorization form.`,
          ...buildOptions(
            `(x − ${r})² = 0`,
            [
              `(x + ${r})² = 0`,
              `(x − ${r})(x + ${r}) = 0`,
              `(x − ${r * r})(x − 1) = 0`,
            ]
          ),
        };
      },
    },

    // D2 — difference of squares: choose correct factorization
    // Trap: picks (x−r)² (perfect square) — confused x²−k with (x−√k)²
    {
      id: "D2", gapTag: "q-factoring",
      generate() {
        const r = pick([3, 4, 5, 6, 7, 8, 9]);
        const k = r * r;
        return {
          text: `${fmt(1, 0, -k)}. Choose the correct factorization form.`,
          ...buildOptions(
            `(x − ${r})(x + ${r}) = 0`,
            [
              `(x − ${r})² = 0`,
              `(x + ${r})² = 0`,
              `x(x − ${k}) = 0`,
            ]
          ),
        };
      },
    },

    // D3 — perfect square trinomial (positive b): how many solutions?
    // Trap: sees factored form and expects two solutions
    {
      id: "D3", gapTag: "q-factoring",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `${fmt(1, 2 * r, r * r)}. How many different real solutions does it have?`,
          ...buildOptions("1", ["0", "2", "Infinitely many"]),
        };
      },
    },

    // D4 — student rewrites difference of squares as perfect square — evaluate
    {
      id: "D4", gapTag: "q-factoring",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const k = r * r;
        return {
          text: `A student rewrites ${fmt(1, 0, -k)} as (x − ${r})² = 0. Choose the best assessment.`,
          ...buildOptions(
            "The rewrite changes the set of solutions",
            [
              "The rewrite is valid and preserves all solutions",
              "The rewrite is valid only for x > 0",
              "The rewrite is valid only for x < 0",
            ]
          ),
        };
      },
    },

    // D5 — student applies difference-of-squares to perfect square trinomial
    // Trap: (x−r)(x+r) = x²−r², not x²−2rx+r²
    {
      id: "D5", gapTag: "q-factoring",
      generate() {
        const r = pick([2, 3, 4, 5, 6]);
        return {
          text: `A student sees x² − ${2 * r}x + ${r * r} and factors it as (x − ${r})(x + ${r}). Evaluate.`,
          ...buildOptions(
            `Incorrect — (x − ${r})(x + ${r}) = x² − ${r * r}, not x² − ${2 * r}x + ${r * r}`,
            [
              `Correct — both factorizations are equivalent`,
              `Correct — the difference of squares form is always valid`,
              `Incorrect — should be (x + ${r})(x + ${r})`,
            ]
          ),
        };
      },
    },

    // D6 — which expansion of (x−r)² is correct?
    // Traps: wrong sign on middle term, forgot middle term, wrong sign on constant
    {
      id: "D6", gapTag: "q-factoring",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `Which of these equals (x − ${r})²?`,
          ...buildOptions(
            `x² − ${2 * r}x + ${r * r}`,
            [
              `x² + ${2 * r}x + ${r * r}`,   // sign error on middle
              `x² − ${r * r}`,                 // forgot middle term (difference of squares)
              `x² − ${2 * r}x − ${r * r}`,    // sign error on constant
            ]
          ),
        };
      },
    },

    // D7 — x² + r² (sum of squares): factorable over ℝ?
    // Trap: student applies difference-of-squares pattern to sum
    {
      id: "D7", gapTag: "q-factoring",
      generate() {
        const r = pick([2, 3, 4, 5, 6]);
        return {
          text: `Can x² + ${r * r} be factored into linear factors over ℝ?`,
          ...buildOptions(
            "No — a sum of two squares is irreducible over ℝ",
            [
              `Yes — (x − ${r})(x + ${r})`,
              `Yes — (x + ${r})²`,
              `Yes — (x − ${r})²`,
            ]
          ),
        };
      },
    },

    // D8 — a²x² − b²: correct factorization with leading coefficient ≠ 1
    // Trap: student drops the leading coefficient from the factors
    {
      id: "D8", gapTag: "q-factoring",
      generate() {
        const a = pick([2, 3]);
        const b = pick([2, 3, 5]);
        const aSq = a * a, bSq = b * b;
        return {
          text: `${aSq}x² − ${bSq} = 0. Choose the correct factorization.`,
          ...buildOptions(
            `(${a}x − ${b})(${a}x + ${b}) = 0`,
            [
              `(${a}x − ${b})² = 0`,
              `(x − ${b})(x + ${b}) = 0`,
              `${aSq}(x − ${b})(x + ${b}) = 0`,
            ]
          ),
        };
      },
    },

    // D9 — which equation IS a perfect square trinomial?
    // Trap: picks difference of squares or close-but-not-perfect trinomial
    {
      id: "D9", gapTag: "q-factoring",
      generate() {
        const r  = pick([2, 3, 4, 5]);
        const correct = fmt(1, -2 * r, r * r);
        const w1 = fmt(1, 0, -(r * r));
        const w2 = fmt(1, -(r + 1), r);
        const w3 = fmt(1, -2 * r, r * r + 1);
        return {
          text: "Which equation is a perfect square trinomial set equal to zero?",
          ...buildOptions(correct, [w1, w2, w3]),
        };
      },
    },

    // D10 — x² + 2rx + r² = 0: student writes x = ±r — evaluate
    // Trap: sees "looks like two-factor" and writes two distinct roots
    {
      id: "D10", gapTag: "q-factoring",
      generate() {
        const r = pick([2, 3, 4, 5]);
        return {
          text: `${fmt(1, 2 * r, r * r)}. A student writes x = ${r} and x = −${r}. Evaluate.`,
          ...buildOptions(
            `Incorrect — (x + ${r})² = 0 has only one solution: x = −${r}`,
            [
              `Correct — factoring gives two solutions`,
              `Incorrect — the only solution is x = ${r}`,
              `Incorrect — the equation has no real solutions`,
            ]
          ),
        };
      },
    },

    // D11 — (x+a)² − b² = 0: difference of squares within a shifted form
    // Trap: student treats as (x+a)² = 0 and writes only x = −a
    {
      id: "D11", gapTag: "q-factoring",
      generate() {
        const a   = pick([1, 2, 3, 4]);
        const sqb = pick([2, 3, 4, 5]);
        const b   = sqb * sqb;
        // (x+a)²−b = ((x+a)−sqb)((x+a)+sqb) → x = sqb−a or x = −sqb−a
        const x1 = sqb - a, x2 = -sqb - a;
        const setStr = `{${Math.min(x1, x2)}, ${Math.max(x1, x2)}}`;
        return {
          text: `(x + ${a})² − ${b} = 0. Which solution set is correct?`,
          ...buildOptions(
            setStr,
            [
              `{${Math.max(x1, x2)}}`,          // only positive root (missed ±)
              `{${a - sqb}, ${a + sqb}}`,        // used +a instead of −a in x
              `{−${a}, ${a}}`,                   // confused with x² = b form
            ]
          ),
        };
      },
    },

    // D12 — student expands (x−r)² and writes x²−r² — what error?
    // Trap: "no error" since it looks like difference of squares
    {
      id: "D12", gapTag: "q-factoring",
      generate() {
        const r = pick([2, 3, 4, 5, 6]);
        return {
          text: `A student expands (x − ${r})² and writes x² − ${r * r}. What error did they make?`,
          ...buildOptions(
            `Treated it as difference of squares: (x − ${r})(x + ${r}) = x² − ${r * r}`,
            [
              `Forgot to square ${r} — should be x² − ${r}`,
              `Sign error — should be x² + ${r * r}`,
              `No error — (x − ${r})² = x² − ${r * r} is correct`,
            ]
          ),
        };
      },
    },

    /* ═══════════════════════════════════════════════════════
       E-SERIES  ·  q-vieta
       Gap: misapplying Vieta's formulas
       12 templates
    ═══════════════════════════════════════════════════════ */

    // E1 — x₁² + x₂² via Vieta
    // Correct: S²−2P; W1: S² (forgot −2P); W2: S²+2P; W3: P² (confused roles)
    {
      id: "E1", gapTag: "q-vieta",
      generate() {
        const go = () => {
          const pool = [1, 2, 3, 4, 5, 6];
          const r1 = pick(pool);
          const r2 = pick(pool.filter(v => v !== r1));
          const s = r1 + r2, p = r1 * r2;
          const correct = s * s - 2 * p;
          const w1 = s * s, w2 = s * s + 2 * p, w3 = p * p;
          if (new Set([correct, w1, w2, w3]).size < 4) return go();
          return { s, p, correct, w1, w2, w3 };
        };
        const { s, p, correct, w1, w2, w3 } = go();
        return {
          text: `The roots of ${fmt(1, -s, p)} are x₁ and x₂. Find x₁² + x₂² without solving.`,
          ...buildOptions(String(correct), [String(w1), String(w2), String(w3)]),
        };
      },
    },

    // E2 — given roots, find (b, c) in x²+bx+c=0
    // W1: b=+S (forgot to negate); W2: c=−P (sign flip); W3: both wrong
    {
      id: "E2", gapTag: "q-vieta",
      generate() {
        const r1 = pick([2, 3, 4, 5]);
        const r2 = pick([-2, -3, -4, -5]);
        const s  = r1 + r2, p = r1 * r2;
        const b  = -s, c = p;
        return {
          text: `A quadratic with roots ${r1} and ${display(r2)} is x² + bx + c = 0. Choose (b, c).`,
          ...buildOptions(`(${b}, ${c})`, [`(${s}, ${c})`, `(${b}, ${-c})`, `(${s}, ${-c})`]),
        };
      },
    },

    // E3 — given equation, find (sum, product)
    // W1: (−S,P) — used b directly; W2: (S,−P) — correct sum, wrong product sign
    {
      id: "E3", gapTag: "q-vieta",
      generate() {
        const r1   = pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const r2   = pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const sum  = r1 + r2, prod = r1 * r2;
        const b    = -sum, c = prod;
        return {
          text: `For ${fmt(1, b, c)}, choose (x₁ + x₂, x₁·x₂).`,
          ...buildOptions(
            `(${display(sum)}, ${prod})`,
            [`(${display(-sum)}, ${prod})`, `(${display(sum)}, ${-prod})`, `(${display(-sum)}, ${-prod})`]
          ),
        };
      },
    },

    // E4 — given sum S and product P, identify the equation
    // x² − Sx + P = 0; W1: +S (forgot negate); W2: −P; W3: both wrong
    {
      id: "E4", gapTag: "q-vieta",
      generate() {
        const r1 = pick([1, 2, 3, 4]);
        const r2 = pick([-1, -2, -3, -4, -5, -6]);
        const S  = r1 + r2, P = r1 * r2;
        return {
          text: `Two roots have sum ${display(S)} and product ${display(P)}. Which equation matches?`,
          ...buildOptions(
            fmt(1, -S, P),
            [fmt(1, S, P), fmt(1, -S, -P), fmt(1, S, -P)]
          ),
        };
      },
    },

    // E5 — 1/x₁ + 1/x₂: which formula is correct?
    // Correct: −b/c; W1: b/c (sign); W2: −c/b (inverted); W3: c/b (both wrong)
    {
      id: "E5", gapTag: "q-vieta",
      generate() {
        return {
          text: "For x² + bx + c = 0 with roots x₁ and x₂ (both nonzero), which expression equals 1/x₁ + 1/x₂?",
          ...buildOptions("−b/c", ["b/c", "−c/b", "c/b"]),
        };
      },
    },

    // E6 — (x₁ − x₂)² via Vieta
    // Correct: S²−4P; W1: S²+4P; W2: S²−2P; W3: S² (forgot −4P entirely)
    {
      id: "E6", gapTag: "q-vieta",
      generate() {
        const r1 = pick([1, 2, 3, 4, 5]);
        const r2 = pick([1, 2, 3, 4, 5].filter(v => v !== r1));
        const s  = r1 + r2, p = r1 * r2;
        const correct = s * s - 4 * p;   // (r1−r2)²
        const w1 = s * s + 4 * p;
        const w2 = s * s - 2 * p;
        const w3 = s * s;
        return {
          text: `The roots of ${fmt(1, -s, p)} are x₁ and x₂. Find (x₁ − x₂)² without solving.`,
          ...buildOptions(String(correct), [String(w1), String(w2), String(w3)]),
        };
      },
    },

    // E7 — Vieta for non-monic: student forgets to divide by a
    {
      id: "E7", gapTag: "q-vieta",
      generate() {
        const a  = pick([2, 3]);
        const r1 = pick([1, 2, 3]);
        const r2 = pick([1, 2, 3].filter(v => v !== r1));
        const s  = r1 + r2, p = r1 * r2;
        const b  = -a * s, c = a * p;
        return {
          text: `${fmt(a, b, c)} has roots x₁ and x₂. A student uses Vieta and writes x₁+x₂ = ${-b} and x₁x₂ = ${c}. Evaluate.`,
          ...buildOptions(
            `Incorrect — both values should be divided by ${a}: sum = ${s}, product = ${p}`,
            [
              `Correct — Vieta gives sum = −b and product = c`,
              `Partially correct — sum = ${-b} is right but product should be ${-c}`,
              `Incorrect — sum should be ${b} and product should be ${-c}`,
            ]
          ),
        };
      },
    },

    // E8 — x₁·x₂ < 0: what must be true about roots?
    // Trap: "both negative" or "both positive" instead of "opposite signs"
    {
      id: "E8", gapTag: "q-vieta",
      generate() {
        const p = pick([-2, -3, -4, -6, -8, -10, -12]);
        return {
          text: `For a quadratic with x₁·x₂ = ${p}, which statement must be true?`,
          ...buildOptions(
            "The roots have opposite signs",
            [
              "Both roots are negative",
              "Both roots are positive",
              "At least one root equals zero",
            ]
          ),
        };
      },
    },

    // E9 — given one root, find the other and the constant c
    {
      id: "E9", gapTag: "q-vieta",
      generate() {
        const r1 = pick([1, 2, 3, 4, 5]);
        const r2 = pick([1, 2, 3, 4, 5].filter(v => v !== r1));
        const s  = r1 + r2, p = r1 * r2;
        return {
          text: `x² − ${s}x + c = 0 has one root x₁ = ${r1}. Using Vieta, find x₂ and c.`,
          ...buildOptions(
            `x₂ = ${r2}, c = ${p}`,
            [
              `x₂ = ${s}, c = ${r1 * s}`,
              `x₂ = ${r2}, c = ${-p}`,
              `x₂ = ${-r2}, c = ${-p}`,
            ]
          ),
        };
      },
    },

    // E10 — find (x₁+1)(x₂+1) using Vieta
    // Correct: P+S+1; W1: P+S (forgot +1); W2: P−S+1 (sign on S); W3: (P+1)(S+1)
    {
      id: "E10", gapTag: "q-vieta",
      generate() {
        const r1 = pick([1, 2, 3, 4]);
        const r2 = pick([1, 2, 3, 4, 5]);
        const s  = r1 + r2, p = r1 * r2;
        const b  = -s, c = p;
        const correct = p + s + 1;
        const w1 = p + s;
        const w2 = p - s + 1;
        const w3 = (p + 1) * (s + 1);
        return {
          text: `For ${fmt(1, b, c)}, the roots are x₁ and x₂. Find (x₁ + 1)(x₂ + 1) without solving.`,
          ...buildOptions(String(correct), [String(w1), String(w2), String(w3)]),
        };
      },
    },

    // E11 — x₁·x₂ > 0: what must be true?
    // Trap: "both positive" — ignores possibility of both negative
    {
      id: "E11", gapTag: "q-vieta",
      generate() {
        const p = pick([2, 3, 4, 6, 8, 9, 12, 15]);
        return {
          text: `For a quadratic with x₁·x₂ = ${p} > 0, which statement is definitely true?`,
          ...buildOptions(
            "The roots have the same sign (both positive or both negative)",
            [
              "Both roots are positive",
              "Both roots are negative",
              "The roots are equal",
            ]
          ),
        };
      },
    },

    // E12 — which expression gives x₁x₂² + x₁²x₂ using Vieta?
    // Correct: x₁x₂(x₁+x₂) = P·S
    // W1: P·S² (wrong); W2: S·P² (swapped roles); W3: P+S (wrong operation)
    {
      id: "E12", gapTag: "q-vieta",
      generate() {
        const r1 = pick([1, 2, 3]);
        const r2 = pick([1, 2, 3].filter(v => v !== r1));
        const s  = r1 + r2, p = r1 * r2;
        const b  = -s, c = p;
        const correct = p * s;
        return {
          text: `For ${fmt(1, b, c)}, find x₁x₂² + x₁²x₂ without solving.`,
          ...buildOptions(
            String(correct),
            [String(p * s * s), String(s * p * p), String(p + s)]
          ),
        };
      },
    },

  ],
};

/* ═══════════════════════════════════════════════════════════
   generatePracticeSession
   Used by PuzzlesPage and PracticePage instead of the old generator.

   topicId  — "quadratic" etc.
   count    — number of questions to return (default 10)
   gapTag   — if provided, only draw from templates with that gapTag
              (used by practice gap mode: "q-discriminant" etc.)
═══════════════════════════════════════════════════════════ */
export const generatePracticeSession = (topicId, count = 10, gapTag = null) => {
  const allTemplates = questionTemplates[topicId] || [];
  const pool = gapTag
    ? allTemplates.filter(t => t.gapTag === gapTag)
    : allTemplates;

  if (!pool.length) return [];

  const shuffled = shuffle([...pool]);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map(t => ({
    id:       `${topicId}_${t.id}_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    gapTag:   t.gapTag,
    category: t.gapTag.replace("q-", "").replace(/-/g, " "),
    ...t.generate(),
  }));
};