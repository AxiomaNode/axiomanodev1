/**
 * questionTemplates.js  —  src/data/questionTemplates.js
 * v2 — 100 templates, 20 per gap series, 20 distinct formats
 * Format tags enforce structural diversity within a session.
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
};
};

const fmt = (a, b, c) => {
  const parts = [];
  if (a === 1) parts.push("x²");
  else if (a === -1) parts.push("−x²");
  else parts.push(`${a}x²`);
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

    /* ═══════════════════════════════════════════
       A-SERIES · q-discriminant
       20 templates, 20 formats
    ═══════════════════════════════════════════ */

    // format: identify-no-solution
    {
      id: "A1", gapTag: "q-discriminant", format: "identify-no-solution",
      generate() {
        const sq = pick([2, 3, 4, 5]);
        const k = sq * sq;
        return {
          text: "Which equation has no solutions in ℝ?",
          ...buildOptions(fmt(1, 0, k), [fmt(1, 0, -k), fmt(1, -2*sq, k), fmt(1, -(sq+1), sq)]),
        };
      },
    },

    // format: interpret-d-zero
    {
      id: "A2", gapTag: "q-discriminant", format: "interpret-d-zero",
      generate() {
        const sq = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `For ${fmt(1, -2*sq, sq*sq)}, D = 0. Choose the correct statement.`,
          ...buildOptions(
            "Exactly one value of x satisfies it",
            ["Exactly two different values of x satisfy it", "No values of x satisfy it", "Every x satisfies it"]
          ),
        };
      },
    },

    // format: interpret-d-negative
    {
      id: "A3", gapTag: "q-discriminant", format: "interpret-d-negative",
      generate() {
        const triples = [[1,0,1],[1,0,2],[1,1,1],[1,2,2],[1,2,3],[1,3,3],[1,3,4],[1,4,5],[2,1,1],[2,2,2],[2,3,3],[3,1,1]];
        const [a, b, c] = pick(triples);
        return {
          text: `${fmt(a, b, c)} has D < 0. Best conclusion?`,
          ...buildOptions("No solutions in ℝ", ["Two different solutions in ℝ", "One solution in ℝ", "Infinitely many solutions"]),
        };
      },
    },

    // format: given-computed-d
    {
      id: "A4", gapTag: "q-discriminant", format: "given-computed-d",
      generate() {
        const triples = [[1,0,1],[1,0,2],[1,1,1],[1,2,2],[1,2,3],[1,3,3],[1,3,4],[1,4,5],[2,1,1],[2,2,2],[3,1,1]];
        const [a, b, c] = pick(triples);
        const D = b*b - 4*a*c;
        return {
          text: `For ${fmt(a, b, c)}, D = ${D}. Choose the correct statement.`,
          ...buildOptions("No solutions in ℝ", ["Two different solutions in ℝ", "One solution in ℝ", "Two solutions in ℝ, both negative"]),
        };
      },
    },

    // format: sign-vs-count-confusion
    {
      id: "A5", gapTag: "q-discriminant", format: "sign-vs-count-confusion",
      generate() {
        const r1 = pick([2, 3, 4, 5]);
        const r2 = pick([-2, -3, -4, -5]);
        const s = r1 + r2, p = r1 * r2;
        const b = -s, c = p;
        const D = b*b - 4*c;
        return {
          text: `For ${fmt(1, b, c)}, D = ${D}. A student says "D > 0 so both roots are positive." Evaluate.`,
          ...buildOptions(
            "D > 0 tells you there are two real roots, not that both are positive",
            ["Correct — D > 0 guarantees both roots are positive", "Partially correct — at least one root is positive", "Incorrect — D > 0 means both roots are negative"]
          ),
        };
      },
    },

    // format: identify-d-zero
    {
      id: "A6", gapTag: "q-discriminant", format: "identify-d-zero",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: "Which equation has D = 0?",
          ...buildOptions(fmt(1, -2*r, r*r), [fmt(1, 0, -(r*r)), fmt(1, 0, r*r), fmt(1, -(r+1), r)]),
        };
      },
    },

    // format: compute-d
    {
      id: "A7", gapTag: "q-discriminant", format: "compute-d",
      generate() {
        const b = pick([2, 3, 4, 5, 6]);
        const c = pick([1, 2, 3]);
        const correct = b*b - 4*c;
        const w1 = b*b + 4*c;
        const w2 = b*b - 2*c;
        const w3 = 2*b - 4*c;
        const wrongs = new Set([correct, w1, w2, w3]).size >= 4
          ? [String(w1), String(w2), String(w3)]
          : [String(w1), String(w2+1), String(w3+2)];
        return {
          text: `Compute D for ${fmt(1, b, c)}.`,
          ...buildOptions(String(correct), wrongs),
        };
      },
    },

    // format: d-to-intercepts
    {
      id: "A8", gapTag: "q-discriminant", format: "d-to-intercepts",
      generate() {
        const scenario = pick([
          { D: pick([-1,-3,-5,-7,-12]), intercepts: "0", wrong: ["1", "2", "3"] },
          { D: 0, intercepts: "1", wrong: ["0", "2", "3"] },
          { D: pick([1, 4, 9, 16, 25]), intercepts: "2", wrong: ["0", "1", "3"] },
        ]);
        return {
          text: `A parabola y = ax² + bx + c has D = ${scenario.D}. How many x-intercepts does it have?`,
          ...buildOptions(scenario.intercepts, scenario.wrong),
        };
      },
    },

    // format: algebraic-d-bound
    {
      id: "A9", gapTag: "q-discriminant", format: "algebraic-d-bound",
      generate() {
        return {
          text: "For ax² + bx + c = 0, you know a > 0 and c < 0. What can be concluded about D?",
          ...buildOptions(
            "D > 0 for any value of b",
            ["D may be positive or negative depending on b", "D < 0 for any value of b", "D = 0 for any value of b"]
          ),
        };
      },
    },

    // format: solution-set-from-equation
    {
      id: "A10", gapTag: "q-discriminant", format: "solution-set-from-equation",
      generate() {
        const a = pick([1, 2, 3]);
        const c = pick([1, 2, 3, 4, 5]);
        return {
          text: `${fmt(a, 0, c)}. What is the solution set in ℝ?`,
          ...buildOptions("Empty — no real solutions", [`{0, ${(c/a).toFixed(1)}}`, `{0}`, `{−${c}, ${c}}`]),
        };
      },
    },

    // format: perfect-square-d-type
    {
      id: "A11", gapTag: "q-discriminant", format: "perfect-square-d-type",
      generate() {
        const r1 = pick([1, 2, 3, 4, 5]);
        const r2 = pick([1, 2, 3, 4, 5].filter(v => v !== r1));
        const s = r1+r2, p = r1*r2;
        const b = -s, c = p;
        const D = b*b - 4*c;
        return {
          text: `For ${fmt(1, b, c)}, D = ${D}. What type of solutions does the equation have?`,
          ...buildOptions(
            "Two distinct rational solutions",
            ["Two distinct irrational solutions", "One rational solution (repeated)", "No real solutions"]
          ),
        };
      },
    },

    // format: evaluate-wrong-conclusion
    {
      id: "A12", gapTag: "q-discriminant", format: "evaluate-wrong-conclusion",
      generate() {
        const triples = [[1,0,1],[1,1,1],[1,2,2],[1,2,3],[1,3,4],[2,1,1]];
        const [a, b, c] = pick(triples);
        const D = b*b - 4*a*c;
        return {
          text: `${fmt(a, b, c)} has D = ${D}. A student writes "D < 0 means both roots are negative." Best response?`,
          ...buildOptions(
            "D < 0 means no real roots exist, not that roots are negative",
            ["Correct — a negative discriminant means negative roots", "Partially correct — one root is negative", "Correct — apply the formula with the negative D directly"]
          ),
        };
      },
    },

    // format: find-parameter-for-d
    {
      id: "A13", gapTag: "q-discriminant", format: "find-parameter-for-d",
      generate() {
        const a = pick([1, 2]);
        const k = pick([1, 4, 9, 16, 25]);
        const b = 2 * Math.sqrt(a * k); // b²=4ak so D=0
        const bInt = Math.round(b);
        return {
          text: `For ${a > 1 ? `${a}x²` : "x²"} + bx + ${k} = 0 to have exactly one solution, what must b equal?`,
          ...buildOptions(
            `b = ${bInt} or b = −${bInt}`,
            [`b = ${bInt}`, `b = ${k}`, `b = ${2*k}`]
          ),
        };
      },
    },

    // format: geometric-to-d
    {
      id: "A14", gapTag: "q-discriminant", format: "geometric-to-d",
      generate() {
        const scenario = pick([
          { desc: "opens upward and vertex is below the x-axis", d: "D > 0", wrong: ["D = 0", "D < 0", "Cannot determine D"] },
          { desc: "opens upward and vertex is above the x-axis", d: "D < 0", wrong: ["D = 0", "D > 0", "Cannot determine D"] },
          { desc: "opens upward and vertex is on the x-axis", d: "D = 0", wrong: ["D > 0", "D < 0", "Cannot determine D"] },
        ]);
        return {
          text: `A parabola ${scenario.desc}. What must be true about D?`,
          ...buildOptions(scenario.d, scenario.wrong),
        };
      },
    },

    // format: correct-d-wrong-conclusion
    {
      id: "A15", gapTag: "q-discriminant", format: "correct-d-wrong-conclusion",
      generate() {
        const sq = pick([2, 3, 4, 5]);
        return {
          text: `A student computes D = 0 for ${fmt(1, -2*sq, sq*sq)} and writes "no solutions." Evaluate.`,
          ...buildOptions(
            "Incorrect — D = 0 means exactly one solution",
            ["Correct — D = 0 means no real solutions", "Partially correct — D = 0 means one negative solution", "Correct — only complex solutions exist"]
          ),
        };
      },
    },

    // format: logical-negation
    {
      id: "A16", gapTag: "q-discriminant", format: "logical-negation",
      generate() {
        return {
          text: "Which is NOT a valid conclusion when D < 0?",
          ...buildOptions(
            "The equation has two negative solutions",
            ["The equation has no real solutions", "The parabola does not cross the x-axis", "√D is not a real number"]
          ),
        };
      },
    },

    // format: compare-equations
    {
      id: "A17", gapTag: "q-discriminant", format: "compare-equations",
      generate() {
        const r = pick([2, 3, 4, 5]);
        const eq1 = fmt(1, 0, r*r);    // D < 0
        const eq2 = fmt(1, 0, -(r*r)); // D > 0
        return {
          text: `Compare (1) ${eq1} and (2) ${eq2}. Which has more real solutions?`,
          ...buildOptions("(2) has more", ["(1) has more", "They have the same number", "Both have no real solutions"]),
        };
      },
    },

    // format: converse-d
    {
      id: "A18", gapTag: "q-discriminant", format: "converse-d",
      generate() {
        return {
          text: "A quadratic equation has two distinct real solutions. What must be true about D?",
          ...buildOptions("D > 0", ["D = 0", "D < 0", "D ≥ 0"]),
        };
      },
    },

    // format: boundary-case
    {
      id: "A19", gapTag: "q-discriminant", format: "boundary-case",
      generate() {
        const k = pick([1, 4, 9, 16]);
        return {
          text: `For x² + ${2*Math.sqrt(k)}x + ${k} = 0, D = 0. What is the solution?`,
          ...buildOptions(
            `x = −${Math.sqrt(k)} (one repeated root)`,
            [`x = ${Math.sqrt(k)} and x = −${Math.sqrt(k)}`, `No real solution`, `x = ${k}`]
          ),
        };
      },
    },

    // format: false-statement
    {
      id: "A20", gapTag: "q-discriminant", format: "false-statement",
      generate() {
        return {
          text: "Which of these statements about the discriminant is FALSE?",
          ...buildOptions(
            "D > 0 means both roots are positive",
            ["D < 0 means no real roots", "D = 0 means exactly one repeated root", "D = b² − 4ac for ax² + bx + c = 0"]
          ),
        };
      },
    },

    /* ═══════════════════════════════════════════
       B-SERIES · q-double-root
       20 templates, 20 formats
    ═══════════════════════════════════════════ */

    // format: evaluate-one-root-claim
    {
      id: "B1", gapTag: "q-double-root", format: "evaluate-one-root-claim",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const k = r*r;
        return {
          text: `A student claims: "x² = ${k} has only x = ${r}." Best correction?`,
          ...buildOptions(
            "The solution set has two elements",
            ["The solution set has one element", "The equation is inconsistent", "The equation has infinitely many solutions"]
          ),
        };
      },
    },

    // format: compare-solution-counts
    {
      id: "B2", gapTag: "q-double-root", format: "compare-solution-counts",
      generate() {
        const r = pick([3, 4, 5, 6, 7]);
        const k = r*r;
        return {
          text: `Compare: (1) ${fmt(1, 0, -k)} and (2) ${fmt(1, -2*r, k)}. How many real solutions each? (for 1, then for 2)`,
          ...buildOptions("(2, 1)", ["(2, 2)", "(1, 1)", "(1, 2)"]),
        };
      },
    },

    // format: count-missing-elements
    {
      id: "B3", gapTag: "q-double-root", format: "count-missing-elements",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const k = r*r;
        return {
          text: `A student writes only x = ${r} for x² = ${k}. How many elements are in the correct solution set?`,
          ...buildOptions("2", ["0", "1", "Infinitely many"]),
        };
      },
    },

    // format: describe-solution-set
    {
      id: "B4", gapTag: "q-double-root", format: "describe-solution-set",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7, 8]);
        const sign = Math.random() > 0.5 ? "−" : "+";
        return {
          text: `(x ${sign} ${r})² = 0. Correct description of the solution set in ℝ?`,
          ...buildOptions(
            "It contains exactly one element",
            ["It contains exactly two different elements", "It contains no elements", "It contains infinitely many elements"]
          ),
        };
      },
    },

    // format: identify-missing-value
    {
      id: "B5", gapTag: "q-double-root", format: "identify-missing-value",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const k = r*r;
        return {
          text: `A student solves x² = ${k} and writes "x = ${r}". Which element of the complete solution set is missing?`,
          ...buildOptions(`x = −${r}`, [`x = 0`, `x = ${k}`, `x = ${r*r}`]),
        };
      },
    },

    // format: calculator-completeness
    {
      id: "B6", gapTag: "q-double-root", format: "calculator-completeness",
      generate() {
        const k = pick([2, 3, 5, 6, 7, 8, 10, 11]);
        const approx = Math.sqrt(k).toFixed(2);
        return {
          text: `x² = ${k}. A student uses a calculator and finds x ≈ ${approx}. Is this the complete solution?`,
          ...buildOptions(
            `No — x ≈ −${approx} is also a solution`,
            ["Yes — the calculator gives the complete answer", "No — x = 0 is also a solution", `No — x = −${k} is also a solution`]
          ),
        };
      },
    },

    // format: shifted-form-count
    {
      id: "B7", gapTag: "q-double-root", format: "shifted-form-count",
      generate() {
        const a = pick([1, 2, 3, 4, 5]);
        const b = pick([1, 4, 9, 16, 25]);
        return {
          text: `(x − ${a})² = ${b}. How many real solutions does this equation have?`,
          ...buildOptions("2", ["1", "0", "Depends on the value of a"]),
        };
      },
    },

    // format: zero-edge-case
    {
      id: "B8", gapTag: "q-double-root", format: "zero-edge-case",
      generate() {
        return {
          text: "x² = 0. How many elements are in the solution set?",
          ...buildOptions(
            "1",
            ["2", "0", "Infinitely many"]
          ),
        };
      },
    },

    // format: identify-missing-root
    {
      id: "B9", gapTag: "q-double-root", format: "identify-missing-root",
      generate() {
        const a = pick([1, 2, 3, 4]);
        const sqb = pick([1, 2, 3, 4]);
        const b = sqb*sqb;
        return {
          text: `(x − ${a})² = ${b}. A student writes only x = ${a + sqb}. What's missing?`,
          ...buildOptions(`x = ${a - sqb}`, [`x = 0`, `x = −${a + sqb}`, `x = ${a * sqb}`]),
        };
      },
    },

    // format: explain-incompleteness
    {
      id: "B10", gapTag: "q-double-root", format: "explain-incompleteness",
      generate() {
        const r = pick([3, 4, 5, 6, 7]);
        return {
          text: `x² − ${r*r} = 0. A student factors and writes only x = ${r}. Why is this incomplete?`,
          ...buildOptions(
            `The factor (x + ${r}) also gives x = −${r}`,
            [`The equation also has x = 0 as a solution`, `The equation has no real solutions`, `The factorization (x − ${r})(x + ${r}) is wrong`]
          ),
        };
      },
    },

    // format: wrong-root-value
    {
      id: "B11", gapTag: "q-double-root", format: "wrong-root-value",
      generate() {
        const r = pick([2, 3, 4, 5]);
        const k = r*r;
        return {
          text: `x² = ${k}. A student writes "x = ±${k}". Evaluate this answer.`,
          ...buildOptions(
            `Incorrect — the solutions are x = ±${r}, not ±${k}`,
            [`Correct — x = ±${k} satisfies the equation`, `Partially correct — x = ${k} is right but x = −${k} is not`, `Incorrect — the only solution is x = ${r}`]
          ),
        };
      },
    },

    // format: negative-k-trap
    {
      id: "B12", gapTag: "q-double-root", format: "negative-k-trap",
      generate() {
        const r = pick([1, 2, 3, 4, 5]);
        const k = r*r;
        return {
          text: `x² = −${k}. A student writes x = ±${r}. Evaluate.`,
          ...buildOptions(
            `Incorrect — no real number squared gives −${k}; the solution set in ℝ is empty`,
            [`Correct — taking ± of any square root gives two solutions`, `Partially correct — x = ${r} is a solution but x = −${r} is not`, `Incorrect — the solution is x = ${k}`]
          ),
        };
      },
    },

    // format: geometric-root-count
    {
      id: "B13", gapTag: "q-double-root", format: "geometric-root-count",
      generate() {
        const r = pick([2, 3, 4, 5]);
        return {
          text: `A parabola y = x² − ${r*r} crosses the x-axis. How many x-values satisfy x² = ${r*r}?`,
          ...buildOptions("2", ["1", "0", "Depends on the parabola"]),
        };
      },
    },

    // format: name-all-solutions
    {
      id: "B14", gapTag: "q-double-root", format: "name-all-solutions",
      generate() {
        const r = pick([2, 3, 4, 5, 6]);
        return {
          text: `If x = ${r} is a solution to x² = ${r*r}, name ALL solutions.`,
          ...buildOptions(`x = ${r} and x = −${r}`, [`x = ${r} only`, `x = 0 and x = ${r}`, `x = ±${r*r}`]),
        };
      },
    },

    // format: true-false-equivalence
    {
      id: "B15", gapTag: "q-double-root", format: "true-false-equivalence",
      generate() {
        const r = pick([3, 4, 5, 6]);
        return {
          text: `True or false: x² = ${r*r} and (x − ${r})(x + ${r}) = 0 have the same solution set.`,
          ...buildOptions(
            "True — both have solution set {−" + r + ", " + r + "}",
            ["False — the first has one solution, the second has two", "False — the factored form has a different solution set", "True — but only for positive values of x"]
          ),
        };
      },
    },

    // format: identify-equation-with-two
    {
      id: "B16", gapTag: "q-double-root", format: "identify-equation-with-two",
      generate() {
        const r = pick([2, 3, 4]);
        return {
          text: `Which equation has exactly 2 real solutions?`,
          ...buildOptions(
            `x² = ${r*r}`,
            [`x² = −${r*r}`, `x² = 0`, `(x − ${r})² = 0`]
          ),
        };
      },
    },

    // format: reverse-from-set
    {
      id: "B17", gapTag: "q-double-root", format: "reverse-from-set",
      generate() {
        const r = pick([2, 3, 4, 5]);
        return {
          text: `x² = k has solution set {−${r}, ${r}}. What is k?`,
          ...buildOptions(String(r*r), [String(r), String(2*r), String(r*r*2)]),
        };
      },
    },

    // format: evaluate-shifted-claim
    {
      id: "B18", gapTag: "q-double-root", format: "evaluate-shifted-claim",
      generate() {
        const a = pick([1, 2, 3, 4]);
        const sqb = pick([2, 3, 4]);
        const b = sqb*sqb;
        return {
          text: `(x − ${a})² = ${b}. A student says "there is only one solution: x = ${a + sqb}." Evaluate.`,
          ...buildOptions(
            `Incorrect — x = ${a - sqb} is also a solution`,
            [`Correct — the equation has one solution`, `Incorrect — there are no real solutions`, `Correct — only the positive square root applies here`]
          ),
        };
      },
    },

    // format: higher-power
    {
      id: "B19", gapTag: "q-double-root", format: "higher-power",
      generate() {
        const r = pick([2, 3, 4]);
        return {
          text: `x⁴ = ${r*r*r*r}. A student writes only x = ${r}. How many solutions are missing from the complete real solution set?`,
          ...buildOptions("1", ["0", "2", "3"]),
        };
      },
    },

    // format: false-rule
    {
      id: "B20", gapTag: "q-double-root", format: "false-rule",
      generate() {
        return {
          text: "Which statement about x² = k is FALSE?",
          ...buildOptions(
            "If k > 0, the only solution is x = √k",
            ["If k = 0, the only solution is x = 0", "If k < 0, there are no real solutions", "If k > 0, the solutions are x = √k and x = −√k"]
          ),
        };
      },
    },

    /* ═══════════════════════════════════════════
       C-SERIES · q-div-by-var
       20 templates, 20 formats
    ═══════════════════════════════════════════ */

    // format: evaluate-division
    {
      id: "C1", gapTag: "q-div-by-var", format: "evaluate-division",
      generate() {
        const a = pick([2, 3, 4, 5]);
        const k = pick([2, 3, 4, 5]);
        const b = a*k;
        return {
          text: `${a}x² − ${b}x = 0. A student divides by x and concludes x = ${k}. Most accurate evaluation?`,
          ...buildOptions(
            "Conclusion is correct but incomplete",
            ["Conclusion is correct and complete", "Conclusion is incorrect", "Cannot be determined"]
          ),
        };
      },
    },

    // format: choose-solution-set
    {
      id: "C2", gapTag: "q-div-by-var", format: "choose-solution-set",
      generate() {
        const a = pick([2, 3, 4, 5]);
        const k = pick([2, 3, 4, 5]);
        const b = a*k;
        return {
          text: `${a}x² = ${b}x. Choose the correct solution set in ℝ.`,
          ...buildOptions(`{0, ${k}}`, [`{${k}}`, `{0}`, `{−${k}, ${k}}`]),
        };
      },
    },

    // format: choose-valid-method
    {
      id: "C3", gapTag: "q-div-by-var", format: "choose-valid-method",
      generate() {
        const k = pick([2, 3, 4, 5, 6]);
        return {
          text: `x² = ${k}x. Choose the method that preserves equivalence for all x.`,
          ...buildOptions(
            `Rewrite as x² − ${k}x = 0 and factor`,
            ["Divide both sides by x", "Take square roots of both sides", `Move ${k}x to the left, then cancel x`]
          ),
        };
      },
    },

    // format: count-missing-after-division
    {
      id: "C4", gapTag: "q-div-by-var", format: "count-missing-after-division",
      generate() {
        return {
          text: "x³ = x². A student divides by x² and gets x = 1. Choose the best statement.",
          ...buildOptions(
            "The final set is missing exactly one value",
            ["The final set is complete", "The final set is missing two values", "The equation has no solutions"]
          ),
        };
      },
    },

    // format: evaluate-cancel
    {
      id: "C5", gapTag: "q-div-by-var", format: "evaluate-cancel",
      generate() {
        const a = pick([2, 3, 4]);
        const k = pick([2, 3, 4, 5, 6]);
        return {
          text: `${a}x(x − ${k}) = 0. A student cancels x and writes x = ${k}. Evaluate.`,
          ...buildOptions(
            `Incomplete — x = 0 is also a solution`,
            [`Complete — x = ${k} is the only solution`, `Incorrect — x = −${k} is the correct solution`, `Incorrect — dividing by x always requires a sign check`]
          ),
        };
      },
    },

    // format: evaluate-correct-factoring
    {
      id: "C6", gapTag: "q-div-by-var", format: "evaluate-correct-factoring",
      generate() {
        const k = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `x² + ${k}x = 0. A student factors as x(x + ${k}) = 0 and writes {0, −${k}}. Evaluate.`,
          ...buildOptions(
            "Complete and correct",
            [`Incomplete — also need x = ${k}`, `Incorrect — should be {0, ${k}}`, `Incorrect — should divide by x to get x = −${k} only`]
          ),
        };
      },
    },

    // format: shifted-division-trap
    {
      id: "C7", gapTag: "q-div-by-var", format: "shifted-division-trap",
      generate() {
        const k = pick([2, 3, 4, 5]);
        const m = pick([1, 2, 3]);
        return {
          text: `x(x − ${k}) = ${m}x. A student divides by x and gets x = ${k + m}. Evaluate.`,
          ...buildOptions(
            `Incomplete — x = 0 is also a solution`,
            [`Complete — x = ${k+m} is the only solution`, `Incorrect — x = ${k} is the correct answer`, `Incorrect — dividing by x changes the equation`]
          ),
        };
      },
    },

    // format: identify-invalid-step
    {
      id: "C8", gapTag: "q-div-by-var", format: "identify-invalid-step",
      generate() {
        const k = pick([2, 3, 4, 5, 6]);
        return {
          text: `Solving ${k}x² = ${k*2}x. Which step is NOT valid?`,
          ...buildOptions(
            "Divide both sides by x",
            [`Divide both sides by ${k}`, `Move all terms left: ${k}x² − ${k*2}x = 0`, `Factor out ${k}x: ${k}x(x − 2) = 0`]
          ),
        };
      },
    },

    // format: simple-x-squared-equals-x
    {
      id: "C9", gapTag: "q-div-by-var", format: "simple-x-squared-equals-x",
      generate() {
        return {
          text: "x² = x. A student divides by x and gets x = 1. Evaluate.",
          ...buildOptions(
            "Incomplete — x = 0 is also a solution",
            ["Complete — x = 1 is the only solution", "Incorrect — x = −1 is the solution", "Incorrect — the equation has no solution because dividing by x is never valid"]
          ),
        };
      },
    },

    // format: cubic-solution-set
    {
      id: "C10", gapTag: "q-div-by-var", format: "cubic-solution-set",
      generate() {
        const k = pick([1, 2, 3, 4, 5]);
        const kSq = k*k;
        return {
          text: `x³ − ${kSq}x = 0. Choose the correct solution set.`,
          ...buildOptions(`{−${k}, 0, ${k}}`, [`{0, ${k}}`, `{−${k}, ${k}}`, `{0, −${k}}`]),
        };
      },
    },

    // format: count-missing-solutions
    {
      id: "C11", gapTag: "q-div-by-var", format: "count-missing-solutions",
      generate() {
        const k = pick([2, 3, 4, 5, 6]);
        return {
          text: `x² − ${k}x = 0. A student divides by x and writes x = ${k}. How many solutions are missing?`,
          ...buildOptions("1", ["0", "2", "3"]),
        };
      },
    },

    // format: explain-danger
    {
      id: "C12", gapTag: "q-div-by-var", format: "explain-danger",
      generate() {
        const a = pick([2, 3, 4]);
        const c = pick([2, 3, 4, 6, 8]);
        return {
          text: `${a}x² = ${c}x. A student says "we can divide by x here." What is the danger?`,
          ...buildOptions(
            "Dividing by x loses the solution x = 0",
            ["Dividing by x changes the degree of the equation permanently", `Dividing by x is valid only if a > c`, "Dividing by x is always valid for quadratic equations"]
          ),
        };
      },
    },

    // format: identify-lost-solution
    {
      id: "C13", gapTag: "q-div-by-var", format: "identify-lost-solution",
      generate() {
        const k = pick([2, 3, 4, 5]);
        return {
          text: `After solving x² = ${k}x by dividing by x, a student gets x = ${k}. Which specific value was lost?`,
          ...buildOptions("x = 0", [`x = −${k}`, `x = ${k*2}`, `x = 1`]),
        };
      },
    },

    // format: which-equation-safest
    {
      id: "C14", gapTag: "q-div-by-var", format: "which-equation-safest",
      generate() {
        const k = pick([2, 3, 4, 5]);
        return {
          text: `Which equation is equivalent to x² = ${k}x for ALL values of x?`,
          ...buildOptions(
            `x² − ${k}x = 0`,
            [`x = ${k}`, `x(x − ${k}) = 0 (with x ≠ 0)`, `x = 0`]
          ),
        };
      },
    },

    // format: true-false-zero-solution
    {
      id: "C15", gapTag: "q-div-by-var", format: "true-false-zero-solution",
      generate() {
        const a = pick([2, 3, 4]);
        const b = pick([2, 3, 4, 6]);
        return {
          text: `True or false: ${a}x² + ${b}x = 0 always has x = 0 as a solution.`,
          ...buildOptions(
            "True — substituting x = 0 gives 0 = 0",
            ["False — x = 0 only works if a = b", "False — x = 0 makes the equation undefined", "True — but only if a and b are positive"]
          ),
        };
      },
    },

    // format: higher-power-division
    {
      id: "C16", gapTag: "q-div-by-var", format: "higher-power-division",
      generate() {
        const k = pick([2, 3, 4]);
        return {
          text: `x⁴ = ${k}x². A student divides by x² and gets x² = ${k}. How many solutions does the full equation have?`,
          ...buildOptions("3", ["2", "1", "4"]),
        };
      },
    },

    // format: correct-method-outcome
    {
      id: "C17", gapTag: "q-div-by-var", format: "correct-method-outcome",
      generate() {
        const k = pick([3, 4, 5, 6, 7]);
        return {
          text: `x² − ${k}x = 0 is factored as x(x − ${k}) = 0. What are ALL solutions?`,
          ...buildOptions(`x = 0 and x = ${k}`, [`x = ${k} only`, `x = 0 only`, `x = −${k} and x = ${k}`]),
        };
      },
    },

    // format: fix-the-error
    {
      id: "C18", gapTag: "q-div-by-var", format: "fix-the-error",
      generate() {
        const k = pick([2, 3, 4, 5]);
        return {
          text: `A student writes: "x² = ${k}x → divide by x → x = ${k}." How should this be corrected?`,
          ...buildOptions(
            `Move all terms: x² − ${k}x = 0, factor as x(x − ${k}) = 0, solutions are x = 0 and x = ${k}`,
            [`Divide by x is valid — the answer x = ${k} is complete`, `The equation has no solutions`, `Take square roots instead: x = ±${Math.sqrt(k).toFixed(1)}`]
          ),
        };
      },
    },

    // format: evaluate-partial-solution
    {
      id: "C19", gapTag: "q-div-by-var", format: "evaluate-partial-solution",
      generate() {
        const a = pick([2, 3]);
        const k = pick([3, 4, 5, 6]);
        return {
          text: `${a}x² = ${a*k}x. A student gives {${k}} as the solution set. This set is:`,
          ...buildOptions(
            "Incomplete — missing x = 0",
            ["Complete and correct", "Incorrect — should be {0}", `Incorrect — should be {−${k}, ${k}}`]
          ),
        };
      },
    },

    // format: conceptual-rule
    {
      id: "C20", gapTag: "q-div-by-var", format: "conceptual-rule",
      generate() {
        return {
          text: "Why is it invalid to divide both sides of ax² = bx by x to solve for x?",
          ...buildOptions(
            "x might equal 0, and dividing by 0 loses that solution",
            ["Because x is unknown, so division is not allowed", "Because ax² and bx are not like terms", "Because division changes a quadratic into a linear equation permanently"]
          ),
        };
      },
    },

    /* ═══════════════════════════════════════════
       D-SERIES · q-factoring
       20 templates, 20 formats
    ═══════════════════════════════════════════ */

    // format: choose-factorization-psq-neg
    {
      id: "D1", gapTag: "q-factoring", format: "choose-factorization-psq-neg",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `${fmt(1, -2*r, r*r)}. Choose the correct factorization form.`,
          ...buildOptions(`(x − ${r})² = 0`, [`(x + ${r})² = 0`, `(x − ${r})(x + ${r}) = 0`, `(x − ${r*r})(x − 1) = 0`]),
        };
      },
    },

    // format: choose-factorization-diff-sq
    {
      id: "D2", gapTag: "q-factoring", format: "choose-factorization-diff-sq",
      generate() {
        const r = pick([3, 4, 5, 6, 7, 8, 9]);
        const k = r*r;
        return {
          text: `${fmt(1, 0, -k)}. Choose the correct factorization form.`,
          ...buildOptions(`(x − ${r})(x + ${r}) = 0`, [`(x − ${r})² = 0`, `(x + ${r})² = 0`, `x(x − ${k}) = 0`]),
        };
      },
    },

    // format: count-solutions-psq-pos
    {
      id: "D3", gapTag: "q-factoring", format: "count-solutions-psq-pos",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `${fmt(1, 2*r, r*r)}. How many different real solutions does it have?`,
          ...buildOptions("1", ["0", "2", "Infinitely many"]),
        };
      },
    },

    // format: evaluate-wrong-rewrite
    {
      id: "D4", gapTag: "q-factoring", format: "evaluate-wrong-rewrite",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        const k = r*r;
        return {
          text: `A student rewrites ${fmt(1, 0, -k)} as (x − ${r})² = 0. Choose the best assessment.`,
          ...buildOptions(
            "The rewrite changes the set of solutions",
            ["The rewrite is valid and preserves all solutions", "The rewrite is valid only for x > 0", "The rewrite is valid only for x < 0"]
          ),
        };
      },
    },

    // format: wrong-pattern-applied
    {
      id: "D5", gapTag: "q-factoring", format: "wrong-pattern-applied",
      generate() {
        const r = pick([2, 3, 4, 5, 6]);
        return {
          text: `A student sees x² − ${2*r}x + ${r*r} and factors it as (x − ${r})(x + ${r}). Evaluate.`,
          ...buildOptions(
            `Incorrect — (x − ${r})(x + ${r}) = x² − ${r*r}, not x² − ${2*r}x + ${r*r}`,
            [`Correct — both factorizations are equivalent`, `Correct — the difference of squares form is always valid`, `Incorrect — should be (x + ${r})(x + ${r})`]
          ),
        };
      },
    },

    // format: choose-correct-expansion
    {
      id: "D6", gapTag: "q-factoring", format: "choose-correct-expansion",
      generate() {
        const r = pick([2, 3, 4, 5, 6, 7]);
        return {
          text: `Which of these equals (x − ${r})²?`,
          ...buildOptions(
            `x² − ${2*r}x + ${r*r}`,
            [`x² + ${2*r}x + ${r*r}`, `x² − ${r*r}`, `x² − ${2*r}x − ${r*r}`]
          ),
        };
      },
    },

    // format: sum-of-squares-factorability
    {
      id: "D7", gapTag: "q-factoring", format: "sum-of-squares-factorability",
      generate() {
        const r = pick([2, 3, 4, 5, 6]);
        return {
          text: `Can x² + ${r*r} be factored into linear factors over ℝ?`,
          ...buildOptions(
            "No — a sum of two squares is irreducible over ℝ",
            [`Yes — (x − ${r})(x + ${r})`, `Yes — (x + ${r})²`, `Yes — (x − ${r})²`]
          ),
        };
      },
    },

    // format: leading-coeff-factorization
    {
      id: "D8", gapTag: "q-factoring", format: "leading-coeff-factorization",
      generate() {
        const a = pick([2, 3]);
        const b = pick([2, 3, 5]);
        const aSq = a*a, bSq = b*b;
        return {
          text: `${aSq}x² − ${bSq} = 0. Choose the correct factorization.`,
          ...buildOptions(
            `(${a}x − ${b})(${a}x + ${b}) = 0`,
            [`(${a}x − ${b})² = 0`, `(x − ${b})(x + ${b}) = 0`, `${aSq}(x − ${b})(x + ${b}) = 0`]
          ),
        };
      },
    },

    // format: identify-perfect-square
    {
      id: "D9", gapTag: "q-factoring", format: "identify-perfect-square",
      generate() {
        const r = pick([2, 3, 4, 5]);
        const correct = fmt(1, -2*r, r*r);
        const w1 = fmt(1, 0, -(r*r));
        const w2 = fmt(1, -(r+1), r);
        const w3 = fmt(1, -2*r, r*r+1);
        return {
          text: "Which equation is a perfect square trinomial set equal to zero?",
          ...buildOptions(correct, [w1, w2, w3]),
        };
      },
    },

    // format: evaluate-two-roots-from-psq
    {
      id: "D10", gapTag: "q-factoring", format: "evaluate-two-roots-from-psq",
      generate() {
        const r = pick([2, 3, 4, 5]);
        return {
          text: `${fmt(1, 2*r, r*r)}. A student writes x = ${r} and x = −${r}. Evaluate.`,
          ...buildOptions(
            `Incorrect — (x + ${r})² = 0 has only one solution: x = −${r}`,
            [`Correct — factoring gives two solutions`, `Incorrect — the only solution is x = ${r}`, `Incorrect — the equation has no real solutions`]
          ),
        };
      },
    },

    // format: shifted-diff-squares
    {
      id: "D11", gapTag: "q-factoring", format: "shifted-diff-squares",
      generate() {
        const a = pick([1, 2, 3, 4]);
        const sqb = pick([2, 3, 4, 5]);
        const b = sqb*sqb;
        const x1 = sqb - a, x2 = -sqb - a;
        const setStr = `{${Math.min(x1,x2)}, ${Math.max(x1,x2)}}`;
        return {
          text: `(x + ${a})² − ${b} = 0. Which solution set is correct?`,
          ...buildOptions(
            setStr,
            [`{${Math.max(x1,x2)}}`, `{${a-sqb}, ${a+sqb}}`, `{−${a}, ${a}}`]
          ),
        };
      },
    },

    // format: expansion-error-type
    {
      id: "D12", gapTag: "q-factoring", format: "expansion-error-type",
      generate() {
        const r = pick([2, 3, 4, 5, 6]);
        return {
          text: `A student expands (x − ${r})² and writes x² − ${r*r}. What error did they make?`,
          ...buildOptions(
            `Treated it as difference of squares: (x − ${r})(x + ${r}) = x² − ${r*r}`,
            [`Forgot to square ${r} — should be x² − ${r}`, `Sign error — should be x² + ${r*r}`, `No error — (x − ${r})² = x² − ${r*r} is correct`]
          ),
        };
      },
    },

    // format: classify-trinomial
    {
      id: "D13", gapTag: "q-factoring", format: "classify-trinomial",
      generate() {
        const r = pick([2, 3, 4, 5]);
        const isPS = Math.random() > 0.5;
        const eq = isPS ? fmt(1, 2*r, r*r) : fmt(1, 2*r+1, r*r);
        return {
          text: `Is ${eq} a perfect square trinomial?`,
          ...buildOptions(
            isPS ? "Yes — it equals (x + " + r + ")²" : "No — the middle term doesn't match",
            isPS
              ? ["No — the constant term is wrong", "No — perfect squares only have negative middle terms", "Yes — any trinomial with positive terms is a perfect square"]
              : ["Yes — it factors as (x + " + r + ")²", "Yes — any trinomial is a perfect square", "No — it has no real factors"]
          ),
        };
      },
    },

    // format: identify-pattern-name
    {
      id: "D14", gapTag: "q-factoring", format: "identify-pattern-name",
      generate() {
        const r = pick([2, 3, 4, 5]);
        const type = pick(["psq", "diff"]);
        if (type === "psq") {
          return {
            text: `x² − ${2*r}x + ${r*r} = 0. Which algebraic identity applies?`,
            ...buildOptions("Perfect square trinomial: (a − b)² = a² − 2ab + b²", ["Difference of squares: a² − b² = (a−b)(a+b)", "Sum of squares", "Quadratic formula only"]),
          };
        } else {
          return {
            text: `x² − ${r*r} = 0. Which algebraic identity applies?`,
            ...buildOptions("Difference of squares: a² − b² = (a−b)(a+b)", ["Perfect square trinomial: (a − b)²", "Sum of squares", "Completing the square"]),
          };
        }
      },
    },

    // format: count-solutions-general
    {
      id: "D15", gapTag: "q-factoring", format: "count-solutions-general",
      generate() {
        const r = pick([2, 3, 4, 5]);
        return {
          text: `How many solutions does (x − ${r})(x + ${r}) = 0 have?`,
          ...buildOptions("2", ["1", "0", "4"]),
        };
      },
    },

    // format: compare-solution-sets
    {
      id: "D16", gapTag: "q-factoring", format: "compare-solution-sets",
      generate() {
        const r = pick([2, 3, 4, 5]);
        return {
          text: `Do x² − ${2*r}x + ${r*r} = 0 and x² − ${r*r} = 0 have the same solution set?`,
          ...buildOptions(
            "No — the first has {" + r + "}, the second has {−" + r + ", " + r + "}",
            ["Yes — both equal zero when x = " + r, "Yes — they are the same equation", "No — neither has real solutions"]
          ),
        };
      },
    },

    // format: fill-in-perfect-square
    {
      id: "D17", gapTag: "q-factoring", format: "fill-in-perfect-square",
      generate() {
        const r = pick([2, 3, 4, 5, 6]);
        return {
          text: `x² − ${2*r}x + ___ = (x − ${r})². What fills the blank?`,
          ...buildOptions(String(r*r), [String(r), String(2*r), String(r*r - 1)]),
        };
      },
    },

    // format: true-false-psq-one-solution
    {
      id: "D18", gapTag: "q-factoring", format: "true-false-psq-one-solution",
      generate() {
        return {
          text: "True or false: every perfect square trinomial set equal to zero has exactly one real solution.",
          ...buildOptions(
            "True — (x − r)² = 0 has only x = r",
            ["False — it has two solutions because it factors into two identical parts", "False — it depends on the sign of the middle term", "True — but only if the leading coefficient is 1"]
          ),
        };
      },
    },

    // format: expansion-verify
    {
      id: "D19", gapTag: "q-factoring", format: "expansion-verify",
      generate() {
        const r = pick([2, 3, 4, 5]);
        return {
          text: `A student claims (x + ${r})² = x² + ${r*r}. What's the error?`,
          ...buildOptions(
            `Missing middle term — correct expansion is x² + ${2*r}x + ${r*r}`,
            [`Wrong constant — should be x² + ${r}`, `Sign error — should be x² − ${2*r}x + ${r*r}`, `No error — (x + ${r})² = x² + ${r*r} is correct`]
          ),
        };
      },
    },

    // format: which-pattern-false
    {
      id: "D20", gapTag: "q-factoring", format: "which-pattern-false",
      generate() {
        const r = pick([2, 3, 4, 5]);
        return {
          text: "Which statement about factoring patterns is FALSE?",
          ...buildOptions(
            `x² + ${r*r} = (x − ${r})(x + ${r})`,
            [`x² − ${r*r} = (x − ${r})(x + ${r})`, `x² − ${2*r}x + ${r*r} = (x − ${r})²`, `x² + ${2*r}x + ${r*r} = (x + ${r})²`]
          ),
        };
      },
    },

    /* ═══════════════════════════════════════════
       E-SERIES · q-vieta
       20 templates, 20 formats
    ═══════════════════════════════════════════ */

    // format: sum-of-squares-vieta
    {
      id: "E1", gapTag: "q-vieta", format: "sum-of-squares-vieta",
      generate() {
        const go = () => {
          const pool = [1, 2, 3, 4, 5, 6];
          const r1 = pick(pool);
          const r2 = pick(pool.filter(v => v !== r1));
          const s = r1+r2, p = r1*r2;
          const correct = s*s - 2*p;
          const w1 = s*s, w2 = s*s + 2*p, w3 = p*p;
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

    // format: find-b-c-from-roots
    {
      id: "E2", gapTag: "q-vieta", format: "find-b-c-from-roots",
      generate() {
        const r1 = pick([2, 3, 4, 5]);
        const r2 = pick([-2, -3, -4, -5]);
        const s = r1+r2, p = r1*r2;
        const b = -s, c = p;
        return {
          text: `A quadratic with roots ${r1} and ${display(r2)} is x² + bx + c = 0. Choose (b, c).`,
          ...buildOptions(`(${b}, ${c})`, [`(${s}, ${c})`, `(${b}, ${-c})`, `(${s}, ${-c})`]),
        };
      },
    },

    // format: find-sum-product
    {
      id: "E3", gapTag: "q-vieta", format: "find-sum-product",
      generate() {
        const r1 = pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const r2 = pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
        const sum = r1+r2, prod = r1*r2;
        const b = -sum, c = prod;
        return {
          text: `For ${fmt(1, b, c)}, choose (x₁ + x₂, x₁·x₂).`,
          ...buildOptions(
            `(${display(sum)}, ${prod})`,
            [`(${display(-sum)}, ${prod})`, `(${display(sum)}, ${-prod})`, `(${display(-sum)}, ${-prod})`]
          ),
        };
      },
    },

    // format: identify-equation-from-sum-product
    {
      id: "E4", gapTag: "q-vieta", format: "identify-equation-from-sum-product",
      generate() {
        const r1 = pick([1, 2, 3, 4]);
        const r2 = pick([-1, -2, -3, -4, -5, -6]);
        const S = r1+r2, P = r1*r2;
        return {
          text: `Two roots have sum ${display(S)} and product ${display(P)}. Which equation matches?`,
          ...buildOptions(fmt(1, -S, P), [fmt(1, S, P), fmt(1, -S, -P), fmt(1, S, -P)]),
        };
      },
    },

    // format: reciprocal-sum
    {
      id: "E5", gapTag: "q-vieta", format: "reciprocal-sum",
      generate() {
        return {
          text: "For x² + bx + c = 0 with roots x₁ and x₂ (both nonzero), which expression equals 1/x₁ + 1/x₂?",
          ...buildOptions("−b/c", ["b/c", "−c/b", "c/b"]),
        };
      },
    },

    // format: difference-squared-vieta
    {
      id: "E6", gapTag: "q-vieta", format: "difference-squared-vieta",
      generate() {
        const r1 = pick([1, 2, 3, 4, 5]);
        const r2 = pick([1, 2, 3, 4, 5].filter(v => v !== r1));
        const s = r1+r2, p = r1*r2;
        const correct = s*s - 4*p;
        const w1 = s*s + 4*p, w2 = s*s - 2*p, w3 = s*s;
        return {
          text: `The roots of ${fmt(1, -s, p)} are x₁ and x₂. Find (x₁ − x₂)² without solving.`,
          ...buildOptions(String(correct), [String(w1), String(w2), String(w3)]),
        };
      },
    },

    // format: non-monic-vieta
    {
      id: "E7", gapTag: "q-vieta", format: "non-monic-vieta",
      generate() {
        const a = pick([2, 3]);
        const r1 = pick([1, 2, 3]);
        const r2 = pick([1, 2, 3].filter(v => v !== r1));
        const s = r1+r2, p = r1*r2;
        const b = -a*s, c = a*p;
        return {
          text: `${fmt(a, b, c)} has roots x₁ and x₂. A student writes x₁+x₂ = ${-b} and x₁x₂ = ${c}. Evaluate.`,
          ...buildOptions(
            `Incorrect — both values should be divided by ${a}: sum = ${s}, product = ${p}`,
            [`Correct — Vieta gives sum = −b and product = c`, `Partially correct — sum = ${-b} is right but product should be ${-c}`, `Incorrect — sum should be ${b} and product should be ${-c}`]
          ),
        };
      },
    },

    // format: product-sign-implies
    {
      id: "E8", gapTag: "q-vieta", format: "product-sign-implies",
      generate() {
        const p = pick([-2, -3, -4, -6, -8, -10, -12]);
        return {
          text: `For a quadratic with x₁·x₂ = ${p}, which statement must be true?`,
          ...buildOptions(
            "The roots have opposite signs",
            ["Both roots are negative", "Both roots are positive", "At least one root equals zero"]
          ),
        };
      },
    },

    // format: find-second-root
    {
      id: "E9", gapTag: "q-vieta", format: "find-second-root",
      generate() {
        const r1 = pick([1, 2, 3, 4, 5]);
        const r2 = pick([1, 2, 3, 4, 5].filter(v => v !== r1));
        const s = r1+r2, p = r1*r2;
        return {
          text: `x² − ${s}x + c = 0 has one root x₁ = ${r1}. Using Vieta, find x₂ and c.`,
          ...buildOptions(`x₂ = ${r2}, c = ${p}`, [`x₂ = ${s}, c = ${r1*s}`, `x₂ = ${r2}, c = ${-p}`, `x₂ = ${-r2}, c = ${-p}`]),
        };
      },
    },

    // format: symmetric-expression
    {
      id: "E10", gapTag: "q-vieta", format: "symmetric-expression",
      generate() {
        const r1 = pick([1, 2, 3, 4]);
        const r2 = pick([1, 2, 3, 4, 5]);
        const s = r1+r2, p = r1*r2;
        const b = -s, c = p;
        const correct = p+s+1;
        const w1 = p+s, w2 = p-s+1, w3 = (p+1)*(s+1);
        return {
          text: `For ${fmt(1, b, c)}, the roots are x₁ and x₂. Find (x₁ + 1)(x₂ + 1) without solving.`,
          ...buildOptions(String(correct), [String(w1), String(w2), String(w3)]),
        };
      },
    },

    // format: positive-product-implies
    {
      id: "E11", gapTag: "q-vieta", format: "positive-product-implies",
      generate() {
        const p = pick([2, 3, 4, 6, 8, 9, 12, 15]);
        return {
          text: `For a quadratic with x₁·x₂ = ${p} > 0, which statement is definitely true?`,
          ...buildOptions(
            "The roots have the same sign (both positive or both negative)",
            ["Both roots are positive", "Both roots are negative", "The roots are equal"]
          ),
        };
      },
    },

    // format: factored-symmetric
    {
      id: "E12", gapTag: "q-vieta", format: "factored-symmetric",
      generate() {
        const r1 = pick([1, 2, 3]);
        const r2 = pick([1, 2, 3].filter(v => v !== r1));
        const s = r1+r2, p = r1*r2;
        const b = -s, c = p;
        const correct = p*s;
        return {
          text: `For ${fmt(1, b, c)}, find x₁x₂² + x₁²x₂ without solving.`,
          ...buildOptions(String(correct), [String(p*s*s), String(s*p*p), String(p+s)]),
        };
      },
    },

    // format: sum-sign-implies-b
    {
      id: "E13", gapTag: "q-vieta", format: "sum-sign-implies-b",
      generate() {
        return {
          text: "For x² + bx + c = 0, the sum of roots is negative. What does this tell you about b?",
          ...buildOptions(
            "b > 0, since sum = −b/1 and sum < 0 means −b < 0",
            ["b < 0, since sum < 0", "b = 0", "Nothing — sum and b are unrelated"]
          ),
        };
      },
    },

    // format: zero-root-implies-c
    {
      id: "E14", gapTag: "q-vieta", format: "zero-root-implies-c",
      generate() {
        return {
          text: "For x² + bx + c = 0, one root equals 0. What must be true about c?",
          ...buildOptions(
            "c = 0, since product of roots = c = 0 × other root = 0",
            ["c > 0", "c < 0", "c = b"]
          ),
        };
      },
    },

    // format: identify-vieta-error
    {
      id: "E15", gapTag: "q-vieta", format: "identify-vieta-error",
      generate() {
        const r1 = pick([2, 3, 4, 5]);
        const r2 = pick([1, 2, 3, 4]);
        const s = r1+r2, p = r1*r2;
        const b = -s, c = p;
        return {
          text: `For ${fmt(1, b, c)}, a student writes "sum of roots = ${-b}." Identify the error.`,
          ...buildOptions(
            `The sum is −b = ${s}, not b = ${-b} — student used b directly`,
            ["No error — sum of roots equals b", `The sum should be ${b*2}`, "The student should use the quadratic formula instead"]
          ),
        };
      },
    },

    // format: find-coefficient-from-root
    {
      id: "E16", gapTag: "q-vieta", format: "find-coefficient-from-root",
      generate() {
        const r1 = pick([2, 3, 4]);
        const c = pick([6, 8, 12, 15, 20]);
        const r2 = c / r1;
        if (!Number.isInteger(r2) || r2 === r1) {
          const r1b = 2, r2b = 6, cb = 12;
          const s = r1b + r2b;
          return {
            text: `x² + bx + ${cb} = 0 has one root x = ${r1b}. Find b using Vieta.`,
            ...buildOptions(String(-s), [String(s), String(-r1b), String(-cb)]),
          };
        }
        const s = r1 + r2;
        return {
          text: `x² + bx + ${c} = 0 has one root x = ${r1}. Find b using Vieta.`,
          ...buildOptions(String(-s), [String(s), String(-r1), String(-c)]),
        };
      },
    },

    // format: true-false-positive-roots
    {
      id: "E17", gapTag: "q-vieta", format: "true-false-positive-roots",
      generate() {
        return {
          text: "True or false: if the product of roots is positive, both roots must be positive.",
          ...buildOptions(
            "False — both could be negative (e.g. roots −2 and −3 have product 6 > 0)",
            ["True — positive product means positive roots", "True — product and sum are always the same sign", "False — positive product means the roots are equal"]
          ),
        };
      },
    },

    // format: sum-zero-implies
    {
      id: "E18", gapTag: "q-vieta", format: "sum-zero-implies",
      generate() {
        const r = pick([2, 3, 4, 5]);
        return {
          text: `x₁ + x₂ = 0 for some quadratic. What does this tell you about b in x² + bx + c = 0?`,
          ...buildOptions(
            "b = 0, since sum = −b = 0",
            ["b > 0", "b < 0", "b = c"]
          ),
        };
      },
    },

    // format: evaluate-wrong-equation-build
    {
      id: "E19", gapTag: "q-vieta", format: "evaluate-wrong-equation-build",
      generate() {
        const r = pick([2, 3, 4]);
        return {
          text: `A student builds a quadratic with roots ${r} and −${r} and writes x² + ${r*r} = 0. Evaluate.`,
          ...buildOptions(
            `Incorrect — product of roots = −${r*r} so c = −${r*r}, giving x² − ${r*r} = 0`,
            [`Correct — product is ${r} × ${r} = ${r*r}`, `Partially correct — equation should be x² − ${r*r} = 0 for a different reason`, `Correct — sum is 0 so b = 0 and c = ${r*r}`]
          ),
        };
      },
    },

    // format: compute-product-from-equation
    {
      id: "E20", gapTag: "q-vieta", format: "compute-product-from-equation",
      generate() {
        const r1 = pick([1, 2, 3, 4, 5]);
        const r2 = pick([-1, -2, -3, -4, -5]);
        const s = r1+r2, p = r1*r2;
        const b = -s, c = p;
        return {
          text: `For ${fmt(1, b, c)}, what is x₁ · x₂?`,
          ...buildOptions(String(p), [String(-p), String(s), String(-s)]),
        };
      },
    },
    // ADD TO questionTemplates.quadratic array

/* ═══════════════════════════════════════════════════════
   F-SERIES · q-adaptive
   Gap: fails when equation is non-standard or embedded
   8 templates, 8 formats
═══════════════════════════════════════════════════════ */

// format: rearrange-to-standard
{
  id: "F1", gapTag: "q-adaptive", format: "rearrange-to-standard",
  generate() {
    const r1 = pick([1,2,3,4,5]);
    const r2 = pick([1,2,3,4,5].filter(v => v !== r1));
    const s = r1+r2, p = r1*r2;
    // Equation given as: c = bx - x²
    return {
      text: `A student sees ${p} = ${s}x − x² and says "this isn't a quadratic equation." Evaluate.`,
      ...buildOptions(
        `Incorrect — rearranging gives x² − ${s}x + ${p} = 0, which is standard quadratic form`,
        [
          `Correct — a quadratic must have x² on the left side`,
          `Correct — the equation is linear because x² is negative`,
          `Incorrect — it's quadratic only if x² has coefficient 1`,
        ]
      ),
    };
  },
},

// format: identify-quadratic-disguised
{
  id: "F2", gapTag: "q-adaptive", format: "identify-quadratic-disguised",
  generate() {
    const a = pick([2,3,4]);
    const b = pick([2,3,5,6]);
    // Equation: (x+a)(x-b) = 0 — looks factored, is still quadratic
    return {
      text: `Is (x + ${a})(x − ${b}) = 0 a quadratic equation?`,
      ...buildOptions(
        `Yes — expanding gives x² + ${a-b}x − ${a*b} = 0, standard quadratic form`,
        [
          `No — it is already factored so it is not quadratic`,
          `No — quadratic equations cannot be written in factored form`,
          `Only if x + ${a} ≠ 0 and x − ${b} ≠ 0`,
        ]
      ),
    };
  },
},

// format: word-problem-setup
{
  id: "F3", gapTag: "q-adaptive", format: "word-problem-setup",
  generate() {
    const w = pick([3,4,5,6]);
    const area = w * (w + pick([2,3,4]));
    const diff = Math.round(area / w) - w;
    return {
      text: `A rectangle has width x and length x + ${diff}. Its area is ${w*(w+diff)}. Which equation models this?`,
      ...buildOptions(
        `x² + ${diff}x − ${w*(w+diff)} = 0`,
        [
          `x + (x + ${diff}) = ${w*(w+diff)}`,
          `2x + 2(x + ${diff}) = ${w*(w+diff)}`,
          `x² + ${diff} = ${w*(w+diff)}`,
        ]
      ),
    };
  },
},

// format: recognize-hidden-quadratic
{
  id: "F4", gapTag: "q-adaptive", format: "recognize-hidden-quadratic",
  generate() {
    const k = pick([2,3,4,5]);
    return {
      text: `x(x + ${k}) = ${k*2}. A student says this is linear. Evaluate.`,
      ...buildOptions(
        `Incorrect — expanding gives x² + ${k}x − ${k*2} = 0, which is quadratic`,
        [
          `Correct — x is only raised to the first power on the left`,
          `Correct — linear equations can have products of x`,
          `Incorrect — but only because the right side is not zero`,
        ]
      ),
    };
  },
},

// format: solve-non-standard-form
{
  id: "F5", gapTag: "q-adaptive", format: "solve-non-standard-form",
  generate() {
    const r1 = pick([1,2,3,4]);
    const r2 = pick([1,2,3,4].filter(v => v !== r1));
    const s = r1+r2, p = r1*r2;
    return {
      text: `${s}x − x² = ${p}. What is the first step to solve this?`,
      ...buildOptions(
        `Rearrange to standard form: x² − ${s}x + ${p} = 0`,
        [
          `Divide both sides by x`,
          `Take the square root of both sides`,
          `This equation cannot be solved — x² is negative`,
        ]
      ),
    };
  },
},

// format: equation-from-context
{
  id: "F6", gapTag: "q-adaptive", format: "equation-from-context",
  generate() {
    const n = pick([2,3,4,5,6]);
    const prod = n*(n+1);
    return {
      text: `Two consecutive integers multiply to give ${prod}. If the smaller is x, which equation is correct?`,
      ...buildOptions(
        `x² + x − ${prod} = 0`,
        [
          `x + (x+1) = ${prod}`,
          `x² + 1 = ${prod}`,
          `2x + 1 = ${prod}`,
        ]
      ),
    };
  },
},

// format: identify-type-from-structure
{
  id: "F7", gapTag: "q-adaptive", format: "identify-type-from-structure",
  generate() {
    const a = pick([2,3,4]);
    const b = pick([1,2,3]);
    return {
      text: `${a}x² = ${b}(x² − ${a}). After expanding and simplifying, what type of equation results?`,
      ...buildOptions(
        `Linear — the x² terms cancel`,
        [
          `Quadratic — expanding always gives a quadratic`,
          `Cubic — multiplying x² by x² gives x⁴`,
          `Cannot determine without solving`,
        ]
      ),
    };
  },
},

// format: non-standard-solution-count
{
  id: "F8", gapTag: "q-adaptive", format: "non-standard-solution-count",
  generate() {
    const r = pick([2,3,4,5]);
    const k = r*r;
    return {
      text: `${k} − x² = 0. Without rearranging, a student says "I can't tell how many solutions this has." Is that true?`,
      ...buildOptions(
        `No — rearranging to x² = ${k} immediately shows two solutions: x = ±${r}`,
        [
          `Yes — the equation must be in standard form before you can count solutions`,
          `Yes — the negative x² means there are no real solutions`,
          `No — there is always exactly one solution regardless of form`,
        ]
      ),
    };
  },
},

/* ═══════════════════════════════════════════════════════
   G-SERIES · q-relational
   Gap: disconnects symbolic from geometric/visual
   8 templates, 8 formats
═══════════════════════════════════════════════════════ */

// format: graph-to-root-count
{
  id: "G1", gapTag: "q-relational", format: "graph-to-root-count",
  generate() {
    const scenario = pick([
      { desc: "crosses the x-axis at two points", roots: "2", wrong: ["0", "1", "Cannot determine without the equation"] },
      { desc: "touches the x-axis at exactly one point", roots: "1", wrong: ["0", "2", "Cannot determine without the equation"] },
      { desc: "never touches the x-axis", roots: "0", wrong: ["1", "2", "Cannot determine without the equation"] },
    ]);
    return {
      text: `A parabola ${scenario.desc}. How many real roots does the corresponding quadratic equation have?`,
      ...buildOptions(scenario.roots, scenario.wrong),
    };
  },
},

// format: d-to-graph-description
{
  id: "G2", gapTag: "q-relational", format: "d-to-graph-description",
  generate() {
    const scenario = pick([
      { d: "D > 0", graph: "crosses the x-axis at two distinct points", wrong: ["touches the x-axis at one point", "does not touch the x-axis", "crosses the x-axis at the origin"] },
      { d: "D = 0", graph: "touches the x-axis at exactly one point", wrong: ["crosses the x-axis at two points", "does not touch the x-axis", "is entirely below the x-axis"] },
      { d: "D < 0", graph: "does not touch the x-axis at all", wrong: ["crosses the x-axis at two points", "touches the x-axis at one point", "crosses the x-axis at the origin"] },
    ]);
    return {
      text: `For a quadratic equation with ${scenario.d}, how does the parabola relate to the x-axis?`,
      ...buildOptions(scenario.graph, scenario.wrong),
    };
  },
},

// format: roots-to-intercepts
{
  id: "G3", gapTag: "q-relational", format: "roots-to-intercepts",
  generate() {
    const r1 = pick([-4,-3,-2,-1,1,2,3,4]);
    const r2 = pick([-4,-3,-2,-1,1,2,3,4].filter(v => v !== r1));
    return {
      text: `The equation x² + bx + c = 0 has roots x = ${r1} and x = ${r2}. Where does the parabola y = x² + bx + c cross the x-axis?`,
      ...buildOptions(
        `At x = ${r1} and x = ${r2}`,
        [
          `At y = ${r1} and y = ${r2}`,
          `At the point (${r1}, ${r2})`,
          `Cannot determine without knowing b and c`,
        ]
      ),
    };
  },
},

// format: graph-position-to-d
{
  id: "G4", gapTag: "q-relational", format: "graph-position-to-d",
  generate() {
    const scenario = pick([
      { desc: "entirely above the x-axis", d: "D < 0", wrong: ["D > 0", "D = 0", "D can be anything"] },
      { desc: "vertex on the x-axis", d: "D = 0", wrong: ["D > 0", "D < 0", "D can be anything"] },
      { desc: "crossing the x-axis at two points", d: "D > 0", wrong: ["D = 0", "D < 0", "D can be anything"] },
    ]);
    return {
      text: `A parabola opening upward is ${scenario.desc}. What must be true about D?`,
      ...buildOptions(scenario.d, scenario.wrong),
    };
  },
},

// format: vertex-to-root-count
{
  id: "G5", gapTag: "q-relational", format: "vertex-to-root-count",
  generate() {
    const h = pick([-3,-2,-1,1,2,3]);
    const k = pick([1,2,3,4]);
    return {
      text: `A parabola opens upward with vertex at (${h}, ${k}). How many real roots does its equation have?`,
      ...buildOptions(
        "0",
        ["1", "2", "Cannot determine from the vertex alone"]
      ),
    };
  },
},

// format: vertex-below-to-roots
{
  id: "G6", gapTag: "q-relational", format: "vertex-below-to-roots",
  generate() {
    const h = pick([-3,-2,-1,0,1,2,3]);
    const k = pick([-4,-3,-2,-1]);
    return {
      text: `A parabola opens upward with vertex at (${h}, ${k}). How many real roots does its equation have?`,
      ...buildOptions(
        "2",
        ["0", "1", "Cannot determine without the full equation"]
      ),
    };
  },
},

// format: symbolic-to-graph-property
{
  id: "G7", gapTag: "q-relational", format: "symbolic-to-graph-property",
  generate() {
    const r1 = pick([1,2,3,4,5]);
    const r2 = pick([1,2,3,4,5].filter(v => v !== r1));
    const s = r1+r2, p = r1*r2;
    return {
      text: `The equation x² − ${s}x + ${p} = 0 has two positive roots. What does this tell you about the parabola y = x² − ${s}x + ${p}?`,
      ...buildOptions(
        `It crosses the x-axis at two positive x-values: x = ${r1} and x = ${r2}`,
        [
          `It is entirely above the x-axis`,
          `Its vertex is at a positive y-value`,
          `It opens downward`,
        ]
      ),
    };
  },
},

// format: equation-to-intercept-count
{
  id: "G8", gapTag: "q-relational", format: "equation-to-intercept-count",
  generate() {
    const scenarios = [
      { eq: "x² + 4",       intercepts: "0 x-intercepts" },
      { eq: "x² − 4x + 4",  intercepts: "1 x-intercept"  },
      { eq: "x² − 4",       intercepts: "2 x-intercepts" },
    ];
    const s = pick(scenarios);
    const wrong = scenarios.filter(x => x.eq !== s.eq).map(x => x.intercepts);
    wrong.push("Cannot determine without graphing");
    return {
      text: `How many x-intercepts does y = ${s.eq} have?`,
      ...buildOptions(s.intercepts, wrong.slice(0, 3)),
    };
  },
},

  ],
};

/* ═══════════════════════════════════════════════════════════
   generatePracticeSession
═══════════════════════════════════════════════════════════ */
// Stage mapping derived from format tag keywords
// Default: "application"
const deriveStage = (format = "") => {
  const f = format.toLowerCase();

  // recognition — identify, classify, name, spot
  if (f.includes("identify") || f.includes("recognize") || f.includes("classify") ||
      f.includes("name") || f.includes("which") || f.includes("is-") ||
      f.includes("true-false") || f.includes("evaluate") || f.includes("interpret")) {
    return "recognition";
  }

  // isolation — isolate one property, describe, compare, signal-level
  if (f.includes("isolat") || f.includes("describe") || f.includes("compare") ||
      f.includes("signal") || f.includes("count") || f.includes("missing") ||
      f.includes("detect")) {
    return "isolation";
  }

  // transfer — non-standard form, graph, word problem, context, relational
  if (f.includes("transfer") || f.includes("graph") || f.includes("word") ||
      f.includes("context") || f.includes("non-standard") || f.includes("geometric") ||
      f.includes("symbolic") || f.includes("equation-from") || f.includes("rearrange") ||
      f.includes("disguised") || f.includes("roots-to") || f.includes("d-to") ||
      f.includes("vertex") || f.includes("relational")) {
    return "transfer";
  }

  // application — everything else
  return "application";
};

// Stage order and slot counts for targeted training sessions
const STAGE_SLOTS = [
  { stage: "recognition",  min: 2 },
  { stage: "isolation",    min: 2 },
  { stage: "application",  min: 3 },
  { stage: "transfer",     min: 1 },
];

export const generatePracticeSession = (topicId, count = 10, gapTag = null) => {
  const allTemplates = questionTemplates[topicId] || [];
  const pool = gapTag
    ? allTemplates.filter(t => t.gapTag === gapTag)
    : allTemplates;

  if (!pool.length) return [];

  // Free mode (no gapTag) — keep existing random behavior
  if (!gapTag) {
    const shuffled = shuffle([...pool]);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    return selected.map(t => ({
      id:       `${topicId}_${t.id}_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
      gapTag:   t.gapTag,
      stage:    deriveStage(t.format),
      category: t.gapTag.replace("q-", "").replace(/-/g, " "),
      ...t.generate(),
    }));
  }

  // Targeted mode — stage-based session
  // Group by stage
  const byStage = { recognition: [], isolation: [], application: [], transfer: [] };
  pool.forEach(t => {
    const stage = deriveStage(t.format);
    byStage[stage].push(t);
  });

  // Shuffle each stage pool
  Object.keys(byStage).forEach(s => { byStage[s] = shuffle(byStage[s]); });

  // Fallback chain: fill from next available stage
  const FALLBACK = ["recognition", "isolation", "application", "transfer"];
  const pickWithFallback = (preferredStage, needed) => {
    const picked = [];
    // Try preferred first
    const preferred = [...byStage[preferredStage]];
    picked.push(...preferred.splice(0, needed));
    byStage[preferredStage] = preferred;

    // Fill remaining from fallback chain
    if (picked.length < needed) {
      for (const fallback of FALLBACK) {
        if (picked.length >= needed) break;
        if (fallback === preferredStage) continue;
        const fb = [...byStage[fallback]];
        const take = Math.min(needed - picked.length, fb.length);
        picked.push(...fb.splice(0, take));
        byStage[fallback] = fb;
      }
    }
    return picked;
  };

  const selected = [];
  STAGE_SLOTS.forEach(({ stage, min }) => {
    const picks = pickWithFallback(stage, min);
    selected.push(...picks);
  });

  return selected.map(t => ({
    id:       `${topicId}_${t.id}_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    gapTag:   t.gapTag,
    stage:    deriveStage(t.format),
    category: t.gapTag.replace("q-", "").replace(/-/g, " "),
    ...t.generate(),
  }));
};

const V1_GAP_TAGS = [
  "q-discriminant",
  "q-double-root",
  "q-div-by-var",
  "q-factoring",
  "q-vieta",
];

export const buildDiagnosticSession = (topicId) => {
  const allTemplates = questionTemplates[topicId] || [];
  if (!allTemplates.length) return [];

  // Group by gapTag, v1 only
  const byGap = {};
  allTemplates.forEach(t => {
    if (!V1_GAP_TAGS.includes(t.gapTag)) return;
    if (!byGap[t.gapTag]) byGap[t.gapTag] = [];
    byGap[t.gapTag].push(t);
  });

  // Day index — same calendar day always produces same session.
  // 20 templates / 4 per session = 5 unique windows before repeating.
  const dayIndex  = Math.floor(Date.now() / 86400000);
  const WINDOW    = 4;
  const usedFormats = new Set();
  const pool      = [];

  V1_GAP_TAGS.forEach(gapTag => {
    const templates = byGap[gapTag] || [];
    if (!templates.length) return;

    // Sort deterministically by id (A1..A20) so window is stable
    const sorted     = [...templates].sort((a, b) => a.id.localeCompare(b.id));
    const numWindows = Math.floor(sorted.length / WINDOW); // 5
    const windowIdx  = dayIndex % numWindows;
    const window4    = sorted.slice(windowIdx * WINDOW, windowIdx * WINDOW + WINDOW);

    // Pick 4, prefer format diversity across the full session
    const picked = [];
    for (const t of window4) {
      if (picked.length >= 4) break;
      if (usedFormats.has(t.format)) continue;
      usedFormats.add(t.format);
      picked.push(t);
    }
    // Fill remaining if diversity exhausted
    for (const t of window4) {
      if (picked.length >= 4) break;
      if (picked.includes(t)) continue;
      picked.push(t);
    }

    picked.forEach(t => {
      const q = t.generate();
      pool.push({
        ...q,
        id:         `${topicId}_${t.id}_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
        templateId: t.id,
        topicId,
        gapTag,
      });
    });
  });

  return shuffle(pool);
};