/**
 * quadratic.diag.js — layered diagnostic bank for Axioma
 *
 * Implements the Direct / Applied / Transfer model.
 * Goal: recognition → decision → execution.
 *
 * Final active balance per gap:
 * - direct: 2
 * - applied: 4
 * - transfer: 6
 *
 * Designed for ~7 diagnostics with lower repetition pressure.
 */

import { pick, buildOptions, fmt, display } from "../templateUtils";

export const quadraticDiagTemplates = [

  /* ═══════════════════════════════════════════
     A-SERIES · q-discriminant
  ═══════════════════════════════════════════ */

  {
    id: "A2",
    gapTag: "q-discriminant",
    difficulty: "direct",
    thinkingType: "interpret",
    format: "interpret-d-zero",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const sq = pick([2, 3, 4, 5, 6, 7]);
      return {
        text: `For ${fmt(1, -2 * sq, sq * sq)}, D = 0. Choose the correct statement.`,
        ...buildOptions(
          "Exactly one value of x satisfies it",
          ["Exactly two different values", "No values", "Every x"]
        ),
      };
    },
  },
  {
    id: "A8",
    gapTag: "q-discriminant",
    difficulty: "direct",
    thinkingType: "interpret",
    format: "d-to-intercepts",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const scenario = pick([
        { D: pick([-1, -3, -5, -7, -12]), intercepts: "0", wrong: ["1", "2", "3"] },
        { D: 0, intercepts: "1", wrong: ["0", "2", "3"] },
        { D: pick([1, 4, 9, 16, 25]), intercepts: "2", wrong: ["0", "1", "3"] },
      ]);
      return {
        text: `A parabola y = ax²+bx+c has D = ${scenario.D}. How many x-intercepts?`,
        ...buildOptions(scenario.intercepts, scenario.wrong),
      };
    },
  },
  {
    id: "A5",
    gapTag: "q-discriminant",
    difficulty: "applied",
    thinkingType: "error-detection",
    format: "sign-vs-count-confusion",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r1 = pick([2, 3, 4, 5]);
      const r2 = pick([-2, -3, -4, -5]);
      const s = r1 + r2, p = r1 * r2, b = -s, c = p, D = b * b - 4 * c;
      return {
        text: `For ${fmt(1, b, c)}, D = ${D}. A student says "D > 0 so both roots are positive." Evaluate.`,
        ...buildOptions(
          "Incorrect — D > 0 shows two real roots exist, not their signs",
          [
            "Correct",
            "Partially correct — at least one root is positive",
            "Incorrect — D > 0 means both roots are negative",
          ]
        ),
      };
    },
  },
  {
    id: "A13",
    gapTag: "q-discriminant",
    difficulty: "applied",
    thinkingType: "parameter-condition",
    format: "find-parameter-for-d",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const pairs = [[1,1],[1,4],[1,9],[1,16],[1,25],[2,2],[2,8],[2,18]];
      const [a, k] = pick(pairs);
      const bInt = 2 * Math.sqrt(a * k);
      const correct = `b = ±${bInt}`;
      const candidates = [
        `b = ${bInt}`,
        `b = ${k}`,
        `b = ${2 * k}`,
        `b = ${bInt + k}`,
        `b = ${a + k}`,
        `b = ${bInt * 2}`,
      ];
      const seen = new Set([correct]);
      const wrongs = [];
      for (const c of candidates) {
        if (!seen.has(c) && wrongs.length < 3) {
          seen.add(c);
          wrongs.push(c);
        }
      }
      return {
        text: `For ${a > 1 ? `${a}x²` : "x²"} + bx + ${k} = 0 to have exactly one solution, what must b equal?`,
        ...buildOptions(correct, wrongs),
      };
    },
  },
  {
    id: "A14",
    gapTag: "q-discriminant",
    difficulty: "applied",
    thinkingType: "representation",
    format: "geometric-to-d",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const scenario = pick([
        { desc: "opens upward and vertex is below the x-axis", d: "D > 0", wrong: ["D = 0", "D < 0", "Cannot determine"] },
        { desc: "opens upward and vertex is above the x-axis", d: "D < 0", wrong: ["D = 0", "D > 0", "Cannot determine"] },
        { desc: "opens upward and vertex is on the x-axis", d: "D = 0", wrong: ["D > 0", "D < 0", "Cannot determine"] },
      ]);
      return {
        text: `A parabola ${scenario.desc}. What must be true about D?`,
        ...buildOptions(scenario.d, scenario.wrong),
      };
    },
  },
  {
    id: "A_A4",
    gapTag: "q-discriminant",
    difficulty: "applied",
    thinkingType: "comparison",
    format: "vertex-position-comparison",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Two quadratics both open upward. One has its vertex above the x-axis, the other below. Which one has real solutions?",
        ...buildOptions(
          "Only the one with vertex below the x-axis",
          ["Only the one above", "Both", "Neither"]
        ),
      };
    },
  },
  {
    id: "AT1",
    gapTag: "q-discriminant",
    difficulty: "transfer",
    thinkingType: "constraint-reasoning",
    format: "real-solution-possibility-without-solving",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A student says an equation of the form ax² + bx + c = 0 definitely has real solutions because it is quadratic. Which extra information would actually settle the question?",
        ...buildOptions(
          "Whether b²−4ac is positive, zero, or negative",
          [
            "Whether a is positive or negative",
            "Whether b and c have the same sign",
            "Whether the graph opens upward",
          ]
        ),
      };
    },
  },
  {
    id: "AT2",
    gapTag: "q-discriminant",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "which-can-be-judged-fastest",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const k = pick([1, 4, 9]);
      return {
        text: `Without solving either one, decide which equation is guaranteed to meet the x-axis fewer times:
(1) x² + ${k} = 0
(2) x² − ${k} = 0`,
        ...buildOptions(
          "(1)",
          ["(2)", "They meet it the same number of times", "Cannot be determined"]
        ),
      };
    },
  },
  {
    id: "AT3",
    gapTag: "q-discriminant",
    difficulty: "transfer",
    thinkingType: "mixed-representation",
    format: "graph-statement-consistency",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A parabola stays entirely above the x-axis. A student still expects two real solutions because the equation is quadratic. Best evaluation?",
        ...buildOptions(
          "Incorrect — being quadratic does not guarantee any real solution",
          [
            "Correct — every quadratic has two real solutions",
            "Partially correct — one real solution is guaranteed",
            "Incorrect — quadratics always cross the axis once",
          ]
        ),
      };
    },
  },
  {
    id: "A_T4",
    gapTag: "q-discriminant",
    difficulty: "transfer",
    thinkingType: "hidden-structure",
    format: "touch-cross-never",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "One equation never reaches y = 0. Another touches it once. A third crosses it twice. Which one corresponds to exactly one solution?",
        ...buildOptions(
          "The one that only touches",
          ["The one that never reaches", "The one that crosses twice", "All of them"]
        ),
      };
    },
  },
  {
    id: "A_T5",
    gapTag: "q-discriminant",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "highest-vertex-from-behavior",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Three parabolas open upward and have the same axis of symmetry. One crosses the x-axis twice, one touches it once, and one never reaches it. Which one has the highest vertex?",
        ...buildOptions(
          "The one that never reaches the x-axis",
          [
            "The one that touches once",
            "The one that crosses twice",
            "They all have the same vertex height",
          ]
        ),
      };
    },
  },
  {
    id: "A_T6",
    gapTag: "q-discriminant",
    difficulty: "transfer",
    thinkingType: "indirect-reasoning",
    format: "graph-meets-axis-claim",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A student says: 'I know this quadratic has real roots because its graph meets the x-axis.' Which extra claim would make the statement stronger, not weaker?",
        ...buildOptions(
          "It either crosses the axis twice or touches it once",
          [
            "It must open upward",
            "Its constant term must be positive",
            "Its roots must have opposite signs",
          ]
        ),
      };
    },
  },

  /* ═══════════════════════════════════════════
     B-SERIES · q-double-root
  ═══════════════════════════════════════════ */

  {
    id: "B1",
    gapTag: "q-double-root",
    difficulty: "direct",
    thinkingType: "solution-count",
    format: "evaluate-one-root-claim",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r = pick([2,3,4,5,6,7]), k = r * r;
      return {
        text: `A student claims: "x² = ${k} has only x = ${r}." Best correction?`,
        ...buildOptions(
          "The solution set has two elements",
          ["One element", "The equation is inconsistent", "Infinitely many solutions"]
        ),
      };
    },
  },
  {
    id: "B8",
    gapTag: "q-double-root",
    difficulty: "direct",
    thinkingType: "edge-case",
    format: "zero-edge-case",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "x² = 0. How many elements are in the solution set?",
        ...buildOptions("1", ["2", "0", "Infinitely many"]),
      };
    },
  },
  {
    id: "B6",
    gapTag: "q-double-root",
    difficulty: "applied",
    thinkingType: "completeness-check",
    format: "calculator-completeness",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const k = pick([2,3,5,6,7,8,10,11]), approx = Math.sqrt(k).toFixed(2);
      return {
        text: `x² = ${k}. A student finds x ≈ ${approx}. Is this the complete solution?`,
        ...buildOptions(
          `No — x ≈ −${approx} is also a solution`,
          ["Yes", "No — x = 0 is also a solution", `No — x = −${k} is also a solution`]
        ),
      };
    },
  },
  {
    id: "B12",
    gapTag: "q-double-root",
    difficulty: "applied",
    thinkingType: "sign-trap",
    format: "negative-k-trap",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r = pick([1,2,3,4,5]), k = r * r;
      return {
        text: `x² = −${k}. A student writes x = ±${r}. Evaluate.`,
        ...buildOptions(
          "Incorrect — no real solutions exist",
          ["Correct", `Partially correct — x = ${r} works`, `Incorrect — solution is x = ${k}`]
        ),
      };
    },
  },
  {
    id: "B18",
    gapTag: "q-double-root",
    difficulty: "applied",
    thinkingType: "shifted-form",
    format: "evaluate-shifted-claim",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const a = pick([1,2,3,4]), sqb = pick([2,3,4]), b = sqb * sqb;
      return {
        text: `(x−${a})² = ${b}. A student says "only one solution: x = ${a + sqb}." Evaluate.`,
        ...buildOptions(
          `Incorrect — x = ${a - sqb} is also a solution`,
          ["Correct", "Incorrect — no real solutions", "Correct — only positive root applies"]
        ),
      };
    },
  },
  {
    id: "B_A4",
    gapTag: "q-double-root",
    difficulty: "applied",
    thinkingType: "comparison",
    format: "compare-square-zero-vs-positive",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Compare x² = 4 and x² = 0. What is the key difference in their solution sets?",
        ...buildOptions(
          "First has two values, second has one",
          [
            "Both have two",
            "Both have one",
            "First has one, second has none",
          ]
        ),
      };
    },
  },
  {
    id: "BT1",
    gapTag: "q-double-root",
    difficulty: "transfer",
    thinkingType: "decision-after-rewrite",
    format: "symmetric-values-after-isolation",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `A student's work reaches the line (x−1)² = ${r * r}. Which expectation about the final answers is correct before solving?`,
        ...buildOptions(
          "They should be two values equally far from 1",
          [
            "There will be exactly one value",
            "There will be no real values",
            "Both values must be positive",
          ]
        ),
      };
    },
  },
  {
    id: "BT2",
    gapTag: "q-double-root",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "same-center-different-distance",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: `Two equations are solved by the same student:
I. (x−4)² = 0
II. (x−4)² = 9
What is the key difference in their solution sets?`,
        ...buildOptions(
          "I gives one value, II gives two values",
          [
            "Both give one value",
            "Both give two values",
            "II gives no real values",
          ]
        ),
      };
    },
  },
  {
    id: "BT3",
    gapTag: "q-double-root",
    difficulty: "transfer",
    thinkingType: "trap-detection",
    format: "answer-set-completeness-hidden",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A final answer line shows only one number, but the last algebra step before it was a squared expression equal to a positive constant. Best evaluation?",
        ...buildOptions(
          "The answer is probably incomplete",
          [
            "The answer is definitely complete",
            "The equation definitely has no real answers",
            "The student should switch to Vieta",
          ]
        ),
      };
    },
  },
  {
    id: "B_T4",
    gapTag: "q-double-root",
    difficulty: "transfer",
    thinkingType: "distance-interpretation",
    format: "distance-from-zero",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A number is exactly 3 units away from 0. How many possible values are there?",
        ...buildOptions("2", ["1", "0", "Cannot determine"]),
      };
    },
  },
  {
    id: "B_T5",
    gapTag: "q-double-root",
    difficulty: "transfer",
    thinkingType: "hidden-structure",
    format: "distance-from-center",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A number is 4 units away from 7. Which statement about the possible values is correct?",
        ...buildOptions(
          "There are two possible values",
          [
            "There is exactly one possible value",
            "There are no possible values",
            "The value must be positive",
          ]
        ),
      };
    },
  },
  {
    id: "B_T6",
    gapTag: "q-double-root",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "distance-zero-vs-positive",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Which situation gives exactly one real value for x?",
        ...buildOptions(
          "x is 0 units away from 5",
          [
            "x is 3 units away from 5",
            "x is 2 units away from 0",
            "x is 7 units away from −1",
          ]
        ),
      };
    },
  },

  /* ═══════════════════════════════════════════
     C-SERIES · q-div-by-var
  ═══════════════════════════════════════════ */

  {
    id: "C1",
    gapTag: "q-div-by-var",
    difficulty: "direct",
    thinkingType: "evaluate-step",
    format: "evaluate-division",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const a = pick([2,3,4,5]), k = pick([2,3,4,5]), b = a * k;
      return {
        text: `${a}x²−${b}x = 0. A student divides by x and concludes x = ${k}. Most accurate evaluation?`,
        ...buildOptions(
          "Correct but incomplete",
          ["Correct and complete", "Incorrect", "Cannot be determined"]
        ),
      };
    },
  },
  {
    id: "C3",
    gapTag: "q-div-by-var",
    difficulty: "direct",
    thinkingType: "safe-method",
    format: "choose-valid-method",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const k = pick([2,3,4,5,6]);
      return {
        text: `x² = ${k}x. Choose the method that preserves equivalence for all x.`,
        ...buildOptions(
          `Rewrite as x²−${k}x = 0 and factor`,
          ["Divide both sides by x", "Take square roots", "Move term left then cancel x"]
        ),
      };
    },
  },
  {
    id: "C7",
    gapTag: "q-div-by-var",
    difficulty: "applied",
    thinkingType: "shifted-division-trap",
    format: "shifted-division-trap",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const k = pick([2,3,4,5]), m = pick([1,2,3]);
      return {
        text: `x(x−${k}) = ${m}x. A student divides by x and gets x = ${k + m}. Evaluate.`,
        ...buildOptions(
          `Incomplete — x = 0 is also a solution`,
          ["Complete", `Incorrect — x = ${k} is the answer`, "Incorrect — division changes the equation"]
        ),
      };
    },
  },
  {
    id: "C12",
    gapTag: "q-div-by-var",
    difficulty: "applied",
    thinkingType: "explain-danger",
    format: "explain-danger",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const a = pick([2,3,4]), c = pick([2,3,4,6,8]);
      return {
        text: `${a}x² = ${c}x. A student says "we can divide by x." What is the danger?`,
        ...buildOptions(
          "Dividing by x loses the solution x = 0",
          ["Changes the degree permanently", `Valid only if a > c`, "Always valid for quadratics"]
        ),
      };
    },
  },
  {
    id: "C16",
    gapTag: "q-div-by-var",
    difficulty: "applied",
    thinkingType: "higher-power-analogy",
    format: "higher-power-division",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const k = pick([2,3,4]);
      return {
        text: `x⁴ = ${k}x². A student divides by x² and gets x² = ${k}. How many solutions does the full equation have?`,
        ...buildOptions("3", ["2", "1", "4"]),
      };
    },
  },
  {
    id: "C_A4",
    gapTag: "q-div-by-var",
    difficulty: "applied",
    thinkingType: "comparison",
    format: "always-safe-step",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Which step is always safe?",
        ...buildOptions(
          "Adding the same value to both sides",
          [
            "Dividing by a variable",
            "Canceling x",
            "Dividing by an expression with x",
          ]
        ),
      };
    },
  },
  {
    id: "CT1",
    gapTag: "q-div-by-var",
    difficulty: "transfer",
    thinkingType: "trap-detection",
    format: "step-that-can-shrink-solution-set",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Which step can turn a correct equation into a new one with fewer solutions than the original?",
        ...buildOptions(
          "Canceling a factor that might be zero",
          [
            "Moving all terms to one side",
            "Factoring",
            "Multiplying both sides by 2",
          ]
        ),
      };
    },
  },
  {
    id: "CT2",
    gapTag: "q-div-by-var",
    difficulty: "transfer",
    thinkingType: "trap-detection",
    format: "identify-solution-loss-risk",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Which move can accidentally remove a valid solution from an equation?",
        ...buildOptions(
          "Dividing both sides by a variable expression that could be 0",
          ["Adding the same number to both sides", "Factoring", "Reordering terms"]
        ),
      };
    },
  },
  {
    id: "CT3",
    gapTag: "q-div-by-var",
    difficulty: "transfer",
    thinkingType: "student-work-audit",
    format: "missing-zero-from-shortcut",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const k = pick([2,3,4,5]);
      return {
        text: `A student goes from x(x−${k}) = 0 straight to x = ${k}. What is the best diagnosis?`,
        ...buildOptions(
          "They removed one valid branch of the equation",
          [
            "They made only an arithmetic mistake",
            "Their answer is complete",
            "They should have used the discriminant",
          ]
        ),
      };
    },
  },
  {
    id: "C_T4",
    gapTag: "q-div-by-var",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "constant-vs-variable-division",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Two students simplify equations. One divides by 5. Another divides by x. Who risks changing the solution set?",
        ...buildOptions(
          "Only the one dividing by x",
          [
            "Only the one dividing by 5",
            "Both",
            "Neither",
          ]
        ),
      };
    },
  },
  {
    id: "C_T5",
    gapTag: "q-div-by-var",
    difficulty: "transfer",
    thinkingType: "indirect-reasoning",
    format: "lost-solution-cause",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A solution disappears after simplifying an equation. What is the most likely cause?",
        ...buildOptions(
          "Division by something that could be zero",
          [
            "Incorrect addition",
            "Factoring mistake",
            "Wrong sign",
          ]
        ),
      };
    },
  },
  {
    id: "C_T6",
    gapTag: "q-div-by-var",
    difficulty: "transfer",
    thinkingType: "student-work-audit",
    format: "solution-set-shrank",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A student's algebra becomes simpler, but their final answer set is smaller than the original equation's true solution set. What kind of move most likely caused the damage?",
        ...buildOptions(
          "Removing a variable factor that could be zero",
          [
            "Combining like terms",
            "Moving terms to one side",
            "Multiplying both sides by a constant",
          ]
        ),
      };
    },
  },

  /* ═══════════════════════════════════════════
     D-SERIES · q-factoring
  ═══════════════════════════════════════════ */

  {
    id: "D1",
    gapTag: "q-factoring",
    difficulty: "direct",
    thinkingType: "pattern-recognition",
    format: "choose-factorization-psq-neg",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r = pick([2,3,4,5,6,7]);
      return {
        text: `${fmt(1, -2 * r, r * r)}. Choose the correct factorization form.`,
        ...buildOptions(
          `(x−${r})² = 0`,
          [`(x+${r})² = 0`, `(x−${r})(x+${r}) = 0`, `(x−${r * r})(x−1) = 0`]
        ),
      };
    },
  },
  {
    id: "D2",
    gapTag: "q-factoring",
    difficulty: "direct",
    thinkingType: "pattern-recognition",
    format: "choose-factorization-diff-sq",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r = pick([3,4,5,6,7,8,9]), k = r * r;
      return {
        text: `${fmt(1, 0, -k)}. Choose the correct factorization form.`,
        ...buildOptions(
          `(x−${r})(x+${r}) = 0`,
          [`(x−${r})² = 0`, `(x+${r})² = 0`, `x(x−${k}) = 0`]
        ),
      };
    },
  },
  {
    id: "D5",
    gapTag: "q-factoring",
    difficulty: "applied",
    thinkingType: "error-detection",
    format: "wrong-pattern-applied",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r = pick([2,3,4,5,6]);
      return {
        text: `A student sees x²−${2 * r}x+${r * r} and factors it as (x−${r})(x+${r}). Evaluate.`,
        ...buildOptions(
          `Incorrect — (x−${r})(x+${r}) = x²−${r * r}`,
          ["Correct", "Correct — diff of squares always valid", `Incorrect — should be (x+${r})²`]
        ),
      };
    },
  },
  {
    id: "D7",
    gapTag: "q-factoring",
    difficulty: "applied",
    thinkingType: "factorability-over-reals",
    format: "sum-of-squares-factorability",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r = pick([2,3,4,5,6]);
      return {
        text: `Can x²+${r * r} be factored into linear factors over ℝ?`,
        ...buildOptions(
          "No — irreducible over ℝ",
          [`Yes — (x−${r})(x+${r})`, `Yes — (x+${r})²`, `Yes — (x−${r})²`]
        ),
      };
    },
  },
  {
    id: "D11",
    gapTag: "q-factoring",
    difficulty: "applied",
    thinkingType: "shifted-structure",
    format: "shifted-diff-squares",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const a = pick([1,2,3,4]), sqb = pick([2,3,4,5]), b = sqb * sqb;
      const x1 = sqb - a, x2 = -sqb - a;
      const setStr = `{${Math.min(x1, x2)}, ${Math.max(x1, x2)}}`;
      return {
        text: `(x+${a})²−${b} = 0. Which solution set is correct?`,
        ...buildOptions(
          setStr,
          [`{${Math.max(x1, x2)}}`, `{${a - sqb}, ${a + sqb}}`, `{−${a}, ${a}}`]
        ),
      };
    },
  },
  {
    id: "D_A4",
    gapTag: "q-factoring",
    difficulty: "applied",
    thinkingType: "pattern-discrimination",
    format: "not-factorable-by-standard-real-patterns",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Which expression is NOT factorable using standard real-number patterns?",
        ...buildOptions(
          "x² + 4",
          [
            "x² − 4",
            "x² − 4x + 4",
            "x² − 9",
          ]
        ),
      };
    },
  },
  {
    id: "DT1",
    gapTag: "q-factoring",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "one-real-vs-two-vs-none",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: `Three equations are shown:
I. x² − 25 = 0
II. x² − 10x + 25 = 0
III. x² + 25 = 0
Which one has exactly one real solution?`,
        ...buildOptions(
          "II",
          ["I", "III", "None of them"]
        ),
      };
    },
  },
  {
    id: "DT2",
    gapTag: "q-factoring",
    difficulty: "transfer",
    thinkingType: "pattern-discrimination",
    format: "equal-roots-vs-opposite-roots",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A student sees two expressions: one has equal roots, another has opposite roots. Which pair fits that description?",
        ...buildOptions(
          "x²−6x+9 and x²−9",
          [
            "x²−9 and x²+9",
            "x²+6x+9 and x²+9",
            "x²−6x and x²−9",
          ]
        ),
      };
    },
  },
  {
    id: "DT3",
    gapTag: "q-factoring",
    difficulty: "transfer",
    thinkingType: "hidden-structure",
    format: "equal-distance-from-zero",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Without solving fully, which equation would you expect to produce two real answers equal in distance from 0?",
        ...buildOptions(
          "x² − 16 = 0",
          [
            "x² − 8x + 16 = 0",
            "x² + 16 = 0",
            "x² + 8x + 16 = 0",
          ]
        ),
      };
    },
  },
  {
    id: "D_T4",
    gapTag: "q-factoring",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "different-number-of-real-solutions",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Which equation behaves differently from the others in number of real solutions?",
        ...buildOptions(
          "x² + 4 = 0",
          [
            "x² − 4 = 0",
            "x² − 9 = 0",
            "x² − 16 = 0",
          ]
        ),
      };
    },
  },
  {
    id: "D_T5",
    gapTag: "q-factoring",
    difficulty: "transfer",
    thinkingType: "structure-recognition",
    format: "opposite-values",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Which equation is most naturally associated with two real values that are opposites of each other?",
        ...buildOptions(
          "x² − 16 = 0",
          [
            "x² + 16 = 0",
            "x² − 8x + 16 = 0",
            "x² + 8x + 16 = 0",
          ]
        ),
      };
    },
  },
  {
    id: "D_T6",
    gapTag: "q-factoring",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "opposite-vs-repeated-vs-none",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Which pair of equations would produce different kinds of real-solution behavior: one repeated value and one pair of opposite values?",
        ...buildOptions(
          "x²−6x+9 and x²−9",
          [
            "x²−9 and x²+9",
            "x²+6x+9 and x²+9",
            "x²−6x and x²−9",
          ]
        ),
      };
    },
  },

  /* ═══════════════════════════════════════════
     E-SERIES · q-vieta
  ═══════════════════════════════════════════ */

  {
    id: "E3",
    gapTag: "q-vieta",
    difficulty: "direct",
    thinkingType: "sum-product-readout",
    format: "find-sum-product",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r1 = pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
      const r2 = pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
      const sum = r1 + r2, prod = r1 * r2, b = -sum, c = prod;
      return {
        text: `For ${fmt(1, b, c)}, choose (x₁+x₂, x₁·x₂).`,
        ...buildOptions(
          `(${display(sum)}, ${prod})`,
          [`(${display(-sum)}, ${prod})`, `(${display(sum)}, ${-prod})`, `(${display(-sum)}, ${-prod})`]
        ),
      };
    },
  },
  {
    id: "E20",
    gapTag: "q-vieta",
    difficulty: "direct",
    thinkingType: "product-readout",
    format: "compute-product-from-equation",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r1 = pick([1,2,3,4,5]), r2 = pick([-1,-2,-3,-4,-5]);
      const s = r1 + r2, p = r1 * r2, b = -s, c = p;
      return {
        text: `For ${fmt(1, b, c)}, what is x₁·x₂?`,
        ...buildOptions(String(p), [String(-p), String(s), String(-s)]),
      };
    },
  },
  {
    id: "E7",
    gapTag: "q-vieta",
    difficulty: "applied",
    thinkingType: "non-monic-correction",
    format: "non-monic-vieta",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const a = pick([2,3]), r1 = pick([1,2,3]), r2 = pick([1,2,3].filter(v => v !== r1));
      const s = r1 + r2, p = r1 * r2, b = -a * s, c = a * p;
      return {
        text: `${fmt(a, b, c)} has roots x₁ and x₂. A student writes x₁+x₂=${-b} and x₁x₂=${c}. Evaluate.`,
        ...buildOptions(
          `Incorrect — both must be divided by ${a}: sum=${s}, product=${p}`,
          ["Correct", "Partially correct — sum is right", `Incorrect — sum should be ${b}`]
        ),
      };
    },
  },
  {
    id: "E15",
    gapTag: "q-vieta",
    difficulty: "applied",
    thinkingType: "sign-error-detection",
    format: "identify-vieta-error",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r1 = pick([2,3,4,5]), r2 = pick([1,2,3,4]);
      const s = r1 + r2, p = r1 * r2, b = -s, c = p;
      return {
        text: `For ${fmt(1, b, c)}, a student writes "sum of roots = ${b}." Identify the error.`,
        ...buildOptions(
          `Incorrect — sum is −b = ${s}, not ${b}`,
          ["No error", `Sum should be ${b * 2}`, "Use quadratic formula instead"]
        ),
      };
    },
  },
  {
    id: "E19",
    gapTag: "q-vieta",
    difficulty: "applied",
    thinkingType: "equation-build-error",
    format: "evaluate-wrong-equation-build",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r = pick([2,3,4]);
      return {
        text: `A student builds a quadratic with roots ${r} and −${r} and writes x²+${r * r}=0. Evaluate.`,
        ...buildOptions(
          `Incorrect — product=−${r * r}, giving x²−${r * r}=0`,
          [`Correct — product is ${r * r}`, "Partially correct", `Correct — b=0 so c=${r * r}`]
        ),
      };
    },
  },
  {
    id: "E_A4",
    gapTag: "q-vieta",
    difficulty: "applied",
    thinkingType: "comparison",
    format: "same-sum-different-product",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Two equations have the same sum of roots but different products. What must differ?",
        ...buildOptions(
          "The constant term",
          [
            "The leading coefficient",
            "The variable",
            "Nothing must differ",
          ]
        ),
      };
    },
  },
  {
    id: "ET1",
    gapTag: "q-vieta",
    difficulty: "transfer",
    thinkingType: "indirect-reasoning",
    format: "sum-zero-pattern",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A quadratic has two roots whose sum is 0. Which equation could match that pattern?",
        ...buildOptions(
          "x² − 16 = 0",
          [
            "x² − 8x + 16 = 0",
            "x² + 8x + 16 = 0",
            "x² + 4x = 0",
          ]
        ),
      };
    },
  },
  {
    id: "ET2",
    gapTag: "q-vieta",
    difficulty: "transfer",
    thinkingType: "hidden-structure",
    format: "recognize-symmetric-expression",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      const r1 = pick([1,2,3,4]), r2 = pick([1,2,3,4,5]);
      const s = r1 + r2, p = r1 * r2, b = -s, c = p, correct = p + s + 1;
      const w1 = p + s, w2 = p - s + 1, w3 = (p + 1) * (s + 1);
      return {
        text: `For ${fmt(1, b, c)}, find (x₁+1)(x₂+1) without solving.`,
        ...buildOptions(String(correct), [String(w1), String(w2), String(w3)]),
      };
    },
  },
  {
    id: "ET3",
    gapTag: "q-vieta",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "same-middle-different-constant",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Two quadratics have the same middle coefficient, but different constant terms. What can change between them?",
        ...buildOptions(
          "The product of the roots",
          [
            "The sum of the roots must change",
            "The degree changes",
            "The number of variables changes",
          ]
        ),
      };
    },
  },
  {
    id: "E_T4",
    gapTag: "q-vieta",
    difficulty: "transfer",
    thinkingType: "hidden-structure",
    format: "constant-term-meaning",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Without solving, what does the constant term tell you about the roots?",
        ...buildOptions(
          "How they multiply",
          [
            "How they add",
            "How many solutions exist",
            "Whether they are real",
          ]
        ),
      };
    },
  },
  {
    id: "E_T5",
    gapTag: "q-vieta",
    difficulty: "transfer",
    thinkingType: "comparison",
    format: "which-has-sum-zero",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "Which equation has roots that add to zero?",
        ...buildOptions(
          "x² − 9 = 0",
          [
            "x² − 6x + 9 = 0",
            "x² + 6x + 9 = 0",
            "x² + 4x = 0",
          ]
        ),
      };
    },
  },
  {
    id: "E_T6",
    gapTag: "q-vieta",
    difficulty: "transfer",
    thinkingType: "indirect-reasoning",
    format: "sign-from-sum-and-product",
    diagnostic: true,
    practice: false,
    mastery: false,
    generate() {
      return {
        text: "A student knows two numbers multiply to a positive value and add to a negative value. What must be true?",
        ...buildOptions(
          "Both numbers are negative",
          [
            "Both are positive",
            "They are opposites",
            "One is zero",
          ]
        ),
      };
    },
  },

];

export const quadraticDiagArchivedIds = {
  "q-discriminant": ["A1", "A3", "A4", "A6", "A7", "A9", "A10", "A11", "A12", "A15", "A16", "A17", "A18", "A19", "A20"],
  "q-double-root": ["B2", "B3", "B4", "B5", "B7", "B9", "B10", "B11", "B13", "B14", "B15", "B16", "B17", "B19", "B20"],
  "q-div-by-var": ["C2", "C4", "C5", "C6", "C8", "C9", "C10", "C11", "C13", "C14", "C15", "C17", "C18", "C19", "C20"],
  "q-factoring": ["D3", "D4", "D6", "D8", "D9", "D10", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20"],
  "q-vieta": ["E1", "E2", "E4", "E5", "E6", "E8", "E9", "E10", "E11", "E12", "E13", "E14", "E16", "E17", "E18"],
};