/**
 * questionTemplates.js
 * src/data/questionTemplates.js
 *
 * Parameterized question templates for Axioma diagnostics.
 * Each template has a generate() method that returns a fresh question
 * with the same shape as questions.js: { text, options, correct, gapAnswers }
 *
 * Wrong options are derived from the same parameters as the correct answer —
 * each wrong option represents a specific reasoning failure, not a random value.
 * This keeps wrong options plausible regardless of which numbers are generated.
 */

/* ─────────────────────────────────────────────────────────
   Utilities
───────────────────────────────────────────────────────── */

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
 * Shuffles correct + wrongs into options[], preserving which are gap signals.
 * Returns { options, correct, gapAnswers }
 */
const buildOptions = (correct, wrongs) => {
  const labels = ["A", "B", "C", "D"];
  const shuffled = shuffle([correct, ...wrongs]);
  return {
    options: shuffled.map((value, i) => ({ value, label: labels[i] })),
    correct,
    gapAnswers: wrongs,
  };
};

/**
 * Formats ax² + bx + c = 0 with proper Unicode minus.
 * fmt(1, -6, 9) → "x² − 6x + 9 = 0"
 * fmt(1, 0, -4) → "x² − 4 = 0"
 * fmt(2, 1, 1)  → "2x² + x + 1 = 0"
 */
const fmt = (a, b, c) => {
  const parts = [];
  // x² term
  if (a === 1)       parts.push("x²");
  else if (a === -1) parts.push("−x²");
  else               parts.push(`${a}x²`);
  // bx term
  if (b !== 0) {
    const abs   = Math.abs(b);
    const coeff = abs === 1 ? "" : String(abs);
    parts.push(b > 0 ? `+ ${coeff}x` : `− ${coeff}x`);
  }
  // constant term
  if (c !== 0) {
    parts.push(c > 0 ? `+ ${c}` : `− ${Math.abs(c)}`);
  }
  return parts.join(" ") + " = 0";
};

/**
 * Formats a number for inline display — uses Unicode minus for negatives.
 * display(-7) → "−7"    display(5) → "5"
 */
const display = (x) => (x < 0 ? `−${Math.abs(x)}` : String(x));

/* ─────────────────────────────────────────────────────────
   Templates
───────────────────────────────────────────────────────── */

export const questionTemplates = {
  quadratic: [

    /* ══════════════════════════════════════════════════════
       A-SERIES — q-discriminant
       Gap: misreading what the discriminant tells you
    ══════════════════════════════════════════════════════ */

    // A1 — identify the equation with no real solutions
    // Trap: student who can't read D sign picks an equation with real solutions
    {
      id: "A1",
      generate() {
        const sq = pick([2, 3, 4, 5]);   // n where k = n²
        const k  = sq * sq;
        const correct = fmt(1, 0, k);                    // x² + k = 0  → D = −4k < 0
        const w1      = fmt(1, 0, -k);                   // x² − k = 0  → D = 4k > 0  (two roots)
        const w2      = fmt(1, -2 * sq, k);              // (x−sq)² = 0 → D = 0       (one root)
        const w3      = fmt(1, -(sq + 1), sq);           // (x−sq)(x−1) → D > 0       (two roots)
        return {
          text: "Which equation has no solutions in ℝ?",
          ...buildOptions(correct, [w1, w2, w3]),
        };
      },
    },

    // A2 — D = 0, choose correct conclusion
    // Trap: student confuses D=0 (one root) with D>0 (two roots)
    {
      id: "A2",
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

    // A3 — D < 0 given, best conclusion
    // Trap: student reads D<0 as "one solution" (D=0 confusion) or "two solutions"
    {
      id: "A3",
      generate() {
        // Precomputed (a, b, c) triples with D = b²−4ac < 0, verified below:
        // [1,0,1]→−4  [1,0,2]→−8  [1,1,1]→−3  [1,2,2]→−4
        // [1,2,3]→−8  [1,3,3]→−3  [1,3,4]→−7  [1,4,5]→−4
        // [2,1,1]→−7  [2,2,2]→−12 [2,3,3]→−15 [3,1,1]→−11
        const triples = [
          [1,0,1],[1,0,2],[1,1,1],[1,2,2],
          [1,2,3],[1,3,3],[1,3,4],[1,4,5],
          [2,1,1],[2,2,2],[2,3,3],[3,1,1],
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

    // A4 — given equation and computed D (negative), choose correct statement
    // Trap: student sees "two solutions, both negative" and picks it reasoning about sign of b
    {
      id: "A4",
      generate() {
        const triples = [
          [1,0,1],[1,0,2],[1,1,1],[1,2,2],
          [1,2,3],[1,3,3],[1,3,4],[1,4,5],
          [2,1,1],[2,2,2],[3,1,1],
        ];
        const [a, b, c] = pick(triples);
        const D = b * b - 4 * a * c;   // always negative from list above
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

    /* ══════════════════════════════════════════════════════
       B-SERIES — q-double-root
       Gap: missing the second square-root outcome
    ══════════════════════════════════════════════════════ */

    // B1 — student claims x²=k has only the positive root
    // Trap: student agrees the one-root claim is complete
    {
      id: "B1",
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

    // B2 — compare solution counts: difference of squares vs perfect square trinomial
    // Trap: student says both have 2 solutions, or both have 1
    {
      id: "B2",
      generate() {
        const r = pick([3, 4, 5, 6, 7]);
        const k = r * r;
        return {
          text: `Compare: (1) ${fmt(1, 0, -k)} and (2) ${fmt(1, -2 * r, k)}. How many real solutions does each have? (for 1, then for 2)`,
          ...buildOptions("(2, 1)", ["(2, 2)", "(1, 1)", "(1, 2)"]),
        };
      },
    },

    // B3 — how many elements in the correct solution set when student gives only positive root
    // Trap: student answers 1 (only sees the one the student wrote)
    {
      id: "B3",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const k = r * r;
        return {
          text: `A student writes only x = ${r} for x² = ${k}. How many elements are in the correct solution set?`,
          ...buildOptions("2", ["0", "1", "Infinitely many"]),
        };
      },
    },

    // B4 — (x−r)² = 0, how many elements in solution set
    // Trap: student confuses double root (1 element) with two distinct roots (2 elements)
    {
      id: "B4",
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

    /* ══════════════════════════════════════════════════════
       C-SERIES — q-div-by-var
       Gap: dividing by an expression containing x
    ══════════════════════════════════════════════════════ */

    // C1 — evaluate a student's reasoning after dividing by x
    // Trap: student calls "correct and complete" — misses x=0
    {
      id: "C1",
      generate() {
        const a = pick([2, 3, 4, 5]);
        const k = pick([2, 3, 4, 5]);   // nonzero solution
        const b = a * k;
        return {
          text: `${a}x² − ${b}x = 0. A student divides by x and concludes x = ${k}. Most accurate evaluation?`,
          ...buildOptions(
            "Conclusion is correct but incomplete",
            [
              "Conclusion is correct and complete",
              "Conclusion is incorrect",
              "Cannot be determined",
            ]
          ),
        };
      },
    },

    // C2 — choose the correct solution set
    // Trap: student gives {k} (forgot x=0) or {0} (only the factor)
    // Wrong options are all plausible results of partial reasoning
    {
      id: "C2",
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

    // C3 — choose method that preserves equivalence
    // Trap: student picks "divide both sides by x" — valid-looking but loses x=0
    {
      id: "C3",
      generate() {
        const k = pick([2, 3, 4, 5, 6]);
        return {
          text: `x² = ${k}x. Choose the method that preserves equivalence for all x.`,
          ...buildOptions(
            `Rewrite as x² − ${k}x = 0 and factor`,
            [
              "Divide both sides by x",
              "Take square roots immediately",
              `Move ${k}x to the left, then cancel x`,
            ]
          ),
        };
      },
    },

    // C4 — x³=x², student divides by x², how complete is the result
    // Static: the reasoning trap (losing x=0) is independent of specific values
    {
      id: "C4",
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

    /* ══════════════════════════════════════════════════════
       D-SERIES — q-factoring
       Gap: confusing factoring patterns
    ══════════════════════════════════════════════════════ */

    // D1 — perfect square trinomial, choose correct factorization
    // Trap: student picks difference-of-squares form instead
    {
      id: "D1",
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

    // D2 — difference of squares, choose correct factorization
    // Trap: student picks perfect-square form — confuses x²−k with (x−√k)²
    {
      id: "D2",
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

    // D3 — perfect square trinomial with positive b, count solutions
    // Trap: student sees two-term factorization and expects two solutions
    {
      id: "D3",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `${fmt(1, 2 * r, r * r)}. How many different real solutions does it have?`,
          ...buildOptions("1", ["0", "2", "Infinitely many"]),
        };
      },
    },

    // D4 — student incorrectly rewrites difference of squares as perfect square
    // Trap: student calls the rewrite valid because both look "correct"
    {
      id: "D4",
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

    /* ══════════════════════════════════════════════════════
       E-SERIES — q-vieta
       Gap: misapplying Vieta's formulas
       Wrong options derived from broken reasoning formulas,
       not random values — stays plausible across all params.
    ══════════════════════════════════════════════════════ */

    // E1 — compute x₁²+x₂² via Vieta without solving
    // Correct: (x₁+x₂)² − 2x₁x₂ = s²−2p
    // w1: s²           (forgot −2p entirely)
    // w2: s²+2p        (added instead of subtracted)
    // w3: p²           (used product squared — confused sum and product roles)
    {
      id: "E1",
      generate() {
        const go = () => {
          const pool = [1, 2, 3, 4, 5, 6];
          const r1 = pick(pool);
          const r2 = pick(pool.filter(v => v !== r1));
          const s = r1 + r2, p = r1 * r2;
          const correct = s * s - 2 * p;
          const w1 = s * s;
          const w2 = s * s + 2 * p;
          const w3 = p * p;
          // Guard: options must be distinct (rare collision at small values)
          if (new Set([correct, w1, w2, w3]).size < 4) return go();
          return { s, p, correct, w1, w2, w3 };
        };
        const { s, p, correct, w1, w2, w3 } = go();
        return {
          text: `The roots of ${fmt(1, -s, p)} are x₁ and x₂. Find x₁² + x₂² without solving.`,
          ...buildOptions(
            String(correct),
            [String(w1), String(w2), String(w3)]
          ),
        };
      },
    },

    // E2 — given roots, find (b, c) in x²+bx+c=0
    // Correct: b=−(r1+r2), c=r1·r2
    // w1: b=+(r1+r2)    — used sum directly, forgot to negate
    // w2: b=−(r1+r2), c=−r1r2 — flipped product sign
    // w3: b=+(r1+r2), c=−r1r2 — both signs wrong
    {
      id: "E2",
      generate() {
        const r1 = pick([2, 3, 4, 5]);
        const r2 = pick([-2, -3, -4, -5]);
        const s  = r1 + r2, p = r1 * r2;
        const b  = -s, c = p;
        const correct = `(${b}, ${c})`;
        const w1      = `(${s}, ${c})`;    // forgot to negate sum
        const w2      = `(${b}, ${-c})`;   // flipped product sign
        const w3      = `(${s}, ${-c})`;   // both wrong
        return {
          text: `A quadratic with roots ${r1} and ${display(r2)} is x² + bx + c = 0. Choose (b, c).`,
          ...buildOptions(correct, [w1, w2, w3]),
        };
      },
    },

    // E3 — given equation, find (sum, product)
    // Correct: sum = −b/a, product = c/a
    // w1: (b, c)    — used coefficients directly, forgot sign flip on sum
    // w2: (sum, −p) — correct sum, wrong product sign
    // w3: (−sum, −p) — both wrong
    {
      id: "E3",
      generate() {
        const r1   = pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]);
        const r2   = pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]);
        const sum  = r1 + r2;    // Vieta sum  = −b/a
        const prod = r1 * r2;    // Vieta product = c/a
        const b    = -sum;       // coefficient in x²+bx+c=0
        const c    = prod;
        const correct = `(${display(sum)}, ${prod})`;
        const w1      = `(${display(-sum)}, ${prod})`;   // used b directly (sign error)
        const w2      = `(${display(sum)}, ${-prod})`;   // wrong product sign
        const w3      = `(${display(-sum)}, ${-prod})`;  // both signs wrong
        return {
          text: `For ${fmt(1, b, c)}, choose (x₁ + x₂, x₁·x₂).`,
          ...buildOptions(correct, [w1, w2, w3]),
        };
      },
    },

    // E4 — given sum S and product P, identify the equation
    // Equation: x²−Sx+P=0  (note: −S, not +S)
    // w1: x²+Sx+P=0  — used sum directly without negating (most common error)
    // w2: x²−Sx−P=0  — correct sum term, wrong product sign
    // w3: x²+Sx−P=0  — both wrong
    {
      id: "E4",
      generate() {
        const r1 = pick([1, 2, 3, 4]);
        const r2 = pick([-1, -2, -3, -4, -5, -6]);
        const S  = r1 + r2;   // sum of roots
        const P  = r1 * r2;   // product of roots
        const correct = fmt(1, -S, P);    // x² − S·x + P = 0
        const w1      = fmt(1,  S, P);    // wrong sign on S
        const w2      = fmt(1, -S, -P);   // wrong sign on P
        const w3      = fmt(1,  S, -P);   // both signs wrong
        return {
          text: `Two roots have sum ${display(S)} and product ${display(P)}. Which equation matches?`,
          ...buildOptions(correct, [w1, w2, w3]),
        };
      },
    },

  ],
};