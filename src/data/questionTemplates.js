/**
 * questionTemplates.js  —  src/data/questionTemplates.js
 * v3 — 124 templates: A–E series (100), F series q-adaptive (20), G series q-relational (20)
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
    ═══════════════════════════════════════════ */

    { id: "A1", gapTag: "q-discriminant", format: "identify-no-solution",
      generate() {
        const sq = pick([2,3,4,5]), k = sq*sq;
        return { text: "Which equation has no solutions in ℝ?", ...buildOptions(fmt(1,0,k),[fmt(1,0,-k),fmt(1,-2*sq,k),fmt(1,-(sq+1),sq)]) };
      },
    },
    { id: "A2", gapTag: "q-discriminant", format: "interpret-d-zero",
      generate() {
        const sq = pick([2,3,4,5,6,7]);
        return { text: `For ${fmt(1,-2*sq,sq*sq)}, D = 0. Choose the correct statement.`, ...buildOptions("Exactly one value of x satisfies it",["Exactly two different values of x satisfy it","No values of x satisfy it","Every x satisfies it"]) };
      },
    },
    { id: "A3", gapTag: "q-discriminant", format: "interpret-d-negative",
      generate() {
        const triples = [[1,0,1],[1,0,2],[1,1,1],[1,2,2],[1,2,3],[1,3,3],[1,3,4],[1,4,5],[2,1,1],[2,2,2],[2,3,3],[3,1,1]];
        const [a,b,c] = pick(triples);
        return { text: `${fmt(a,b,c)} has D < 0. Best conclusion?`, ...buildOptions("No solutions in ℝ",["Two different solutions in ℝ","One solution in ℝ","Infinitely many solutions"]) };
      },
    },
    { id: "A4", gapTag: "q-discriminant", format: "given-computed-d",
      generate() {
        const triples = [[1,0,1],[1,0,2],[1,1,1],[1,2,2],[1,2,3],[1,3,3],[1,3,4],[1,4,5],[2,1,1],[2,2,2],[3,1,1]];
        const [a,b,c] = pick(triples);
        const D = b*b-4*a*c;
        return { text: `For ${fmt(a,b,c)}, D = ${D}. Choose the correct statement.`, ...buildOptions("No solutions in ℝ",["Two different solutions in ℝ","One solution in ℝ","Two solutions in ℝ, both negative"]) };
      },
    },
    { id: "A5", gapTag: "q-discriminant", format: "sign-vs-count-confusion",
      generate() {
        const r1=pick([2,3,4,5]), r2=pick([-2,-3,-4,-5]);
        const s=r1+r2, p=r1*r2, b=-s, c=p, D=b*b-4*c;
        return { text: `For ${fmt(1,b,c)}, D = ${D}. A student says "D > 0 so both roots are positive." Evaluate.`, ...buildOptions("D > 0 tells you there are two real roots, not that both are positive",["Correct — D > 0 guarantees both roots are positive","Partially correct — at least one root is positive","Incorrect — D > 0 means both roots are negative"]) };
      },
    },
    { id: "A6", gapTag: "q-discriminant", format: "identify-d-zero",
      generate() {
        const r=pick([2,3,4,5,6,7]);
        return { text: "Which equation has D = 0?", ...buildOptions(fmt(1,-2*r,r*r),[fmt(1,0,-(r*r)),fmt(1,0,r*r),fmt(1,-(r+1),r)]) };
      },
    },
    { id: "A7", gapTag: "q-discriminant", format: "compute-d",
      generate() {
        const b=pick([2,3,4,5,6]), c=pick([1,2,3]);
        const correct=b*b-4*c, w1=b*b+4*c, w2=b*b-2*c, w3=2*b-4*c;
        const wrongs = new Set([correct,w1,w2,w3]).size>=4 ? [String(w1),String(w2),String(w3)] : [String(w1),String(w2+1),String(w3+2)];
        return { text: `Compute D for ${fmt(1,b,c)}.`, ...buildOptions(String(correct),wrongs) };
      },
    },
    { id: "A8", gapTag: "q-discriminant", format: "d-to-intercepts",
      generate() {
        const scenario=pick([{D:pick([-1,-3,-5,-7,-12]),intercepts:"0",wrong:["1","2","3"]},{D:0,intercepts:"1",wrong:["0","2","3"]},{D:pick([1,4,9,16,25]),intercepts:"2",wrong:["0","1","3"]}]);
        return { text: `A parabola y = ax² + bx + c has D = ${scenario.D}. How many x-intercepts does it have?`, ...buildOptions(scenario.intercepts,scenario.wrong) };
      },
    },
    { id: "A9", gapTag: "q-discriminant", format: "algebraic-d-bound",
      generate() {
        return { text: "For ax² + bx + c = 0, you know a > 0 and c < 0. What can be concluded about D?", ...buildOptions("D > 0 for any value of b",["D may be positive or negative depending on b","D < 0 for any value of b","D = 0 for any value of b"]) };
      },
    },
    { id: "A10", gapTag: "q-discriminant", format: "solution-set-from-equation",
      generate() {
        const a=pick([1,2,3]), c=pick([1,2,3,4,5]);
        return { text: `${fmt(a,0,c)}. What is the solution set in ℝ?`, ...buildOptions("Empty — no real solutions",[`{0, ${(c/a).toFixed(1)}}`,`{0}`,`{−${c}, ${c}}`]) };
      },
    },
    { id: "A11", gapTag: "q-discriminant", format: "perfect-square-d-type",
      generate() {
        const r1=pick([1,2,3,4,5]), r2=pick([1,2,3,4,5].filter(v=>v!==r1));
        const s=r1+r2, p=r1*r2, b=-s, c=p, D=b*b-4*c;
        return { text: `For ${fmt(1,b,c)}, D = ${D}. What type of solutions does the equation have?`, ...buildOptions("Two distinct rational solutions",["Two distinct irrational solutions","One rational solution (repeated)","No real solutions"]) };
      },
    },
    { id: "A12", gapTag: "q-discriminant", format: "evaluate-wrong-conclusion",
      generate() {
        const triples=[[1,0,1],[1,1,1],[1,2,2],[1,2,3],[1,3,4],[2,1,1]];
        const [a,b,c]=pick(triples), D=b*b-4*a*c;
        return { text: `${fmt(a,b,c)} has D = ${D}. A student writes "D < 0 means both roots are negative." Best response?`, ...buildOptions("D < 0 means no real roots exist, not that roots are negative",["Correct — a negative discriminant means negative roots","Partially correct — one root is negative","Correct — apply the formula with the negative D directly"]) };
      },
    },
    { id: "A13", gapTag: "q-discriminant", format: "find-parameter-for-d",
      generate() {
        const a=pick([1,2]), k=pick([1,4,9,16,25]);
        const b=2*Math.sqrt(a*k), bInt=Math.round(b);
        return { text: `For ${a>1?`${a}x²`:"x²"} + bx + ${k} = 0 to have exactly one solution, what must b equal?`, ...buildOptions(`b = ${bInt} or b = −${bInt}`,[`b = ${bInt}`,`b = ${k}`,`b = ${2*k}`]) };
      },
    },
    { id: "A14", gapTag: "q-discriminant", format: "geometric-to-d",
      generate() {
        const scenario=pick([{desc:"opens upward and vertex is below the x-axis",d:"D > 0",wrong:["D = 0","D < 0","Cannot determine D"]},{desc:"opens upward and vertex is above the x-axis",d:"D < 0",wrong:["D = 0","D > 0","Cannot determine D"]},{desc:"opens upward and vertex is on the x-axis",d:"D = 0",wrong:["D > 0","D < 0","Cannot determine D"]}]);
        return { text: `A parabola ${scenario.desc}. What must be true about D?`, ...buildOptions(scenario.d,scenario.wrong) };
      },
    },
    { id: "A15", gapTag: "q-discriminant", format: "correct-d-wrong-conclusion",
      generate() {
        const sq=pick([2,3,4,5]);
        return { text: `A student computes D = 0 for ${fmt(1,-2*sq,sq*sq)} and writes "no solutions." Evaluate.`, ...buildOptions("Incorrect — D = 0 means exactly one solution",["Correct — D = 0 means no real solutions","Partially correct — D = 0 means one negative solution","Correct — only complex solutions exist"]) };
      },
    },
    { id: "A16", gapTag: "q-discriminant", format: "logical-negation",
      generate() {
        return { text: "Which is NOT a valid conclusion when D < 0?", ...buildOptions("The equation has two negative solutions",["The equation has no real solutions","The parabola does not cross the x-axis","√D is not a real number"]) };
      },
    },
    { id: "A17", gapTag: "q-discriminant", format: "compare-equations",
      generate() {
        const r=pick([2,3,4,5]);
        return { text: `Compare (1) ${fmt(1,0,r*r)} and (2) ${fmt(1,0,-(r*r))}. Which has more real solutions?`, ...buildOptions("(2) has more",["(1) has more","They have the same number","Both have no real solutions"]) };
      },
    },
    { id: "A18", gapTag: "q-discriminant", format: "converse-d",
      generate() {
        return { text: "A quadratic equation has two distinct real solutions. What must be true about D?", ...buildOptions("D > 0",["D = 0","D < 0","D ≥ 0"]) };
      },
    },
    { id: "A19", gapTag: "q-discriminant", format: "boundary-case",
      generate() {
        const k=pick([1,4,9,16]);
        return { text: `For x² + ${2*Math.sqrt(k)}x + ${k} = 0, D = 0. What is the solution?`, ...buildOptions(`x = −${Math.sqrt(k)} (one repeated root)`,[`x = ${Math.sqrt(k)} and x = −${Math.sqrt(k)}`,`No real solution`,`x = ${k}`]) };
      },
    },
    { id: "A20", gapTag: "q-discriminant", format: "false-statement",
      generate() {
        return { text: "Which of these statements about the discriminant is FALSE?", ...buildOptions("D > 0 means both roots are positive",["D < 0 means no real roots","D = 0 means exactly one repeated root","D = b² − 4ac for ax² + bx + c = 0"]) };
      },
    },

    /* ═══════════════════════════════════════════
       B-SERIES · q-double-root
    ═══════════════════════════════════════════ */

    { id: "B1", gapTag: "q-double-root", format: "evaluate-one-root-claim",
      generate() {
        const r=pick([2,3,4,5,6,7]), k=r*r;
        return { text: `A student claims: "x² = ${k} has only x = ${r}." Best correction?`, ...buildOptions("The solution set has two elements",["The solution set has one element","The equation is inconsistent","The equation has infinitely many solutions"]) };
      },
    },
    { id: "B2", gapTag: "q-double-root", format: "compare-solution-counts",
      generate() {
        const r=pick([3,4,5,6,7]), k=r*r;
        return { text: `Compare: (1) ${fmt(1,0,-k)} and (2) ${fmt(1,-2*r,k)}. How many real solutions each? (for 1, then for 2)`, ...buildOptions("(2, 1)",["(2, 2)","(1, 1)","(1, 2)"]) };
      },
    },
    { id: "B3", gapTag: "q-double-root", format: "count-missing-elements",
      generate() {
        const r=pick([2,3,4,5,6,7]), k=r*r;
        return { text: `A student writes only x = ${r} for x² = ${k}. How many elements are in the correct solution set?`, ...buildOptions("2",["0","1","Infinitely many"]) };
      },
    },
    { id: "B4", gapTag: "q-double-root", format: "describe-solution-set",
      generate() {
        const r=pick([2,3,4,5,6,7,8]), sign=Math.random()>0.5?"−":"+";
        return { text: `(x ${sign} ${r})² = 0. Correct description of the solution set in ℝ?`, ...buildOptions("It contains exactly one element",["It contains exactly two different elements","It contains no elements","It contains infinitely many elements"]) };
      },
    },
    { id: "B5", gapTag: "q-double-root", format: "identify-missing-value",
      generate() {
        const r=pick([2,3,4,5,6,7]), k=r*r;
        return { text: `A student solves x² = ${k} and writes "x = ${r}". Which element of the complete solution set is missing?`, ...buildOptions(`x = −${r}`,["x = 0",`x = ${k}`,`x = ${r*r}`]) };
      },
    },
    { id: "B6", gapTag: "q-double-root", format: "calculator-completeness",
      generate() {
        const k=pick([2,3,5,6,7,8,10,11]), approx=Math.sqrt(k).toFixed(2);
        return { text: `x² = ${k}. A student uses a calculator and finds x ≈ ${approx}. Is this the complete solution?`, ...buildOptions(`No — x ≈ −${approx} is also a solution`,["Yes — the calculator gives the complete answer","No — x = 0 is also a solution",`No — x = −${k} is also a solution`]) };
      },
    },
    { id: "B7", gapTag: "q-double-root", format: "shifted-form-count",
      generate() {
        const a=pick([1,2,3,4,5]), b=pick([1,4,9,16,25]);
        return { text: `(x − ${a})² = ${b}. How many real solutions does this equation have?`, ...buildOptions("2",["1","0","Depends on the value of a"]) };
      },
    },
    { id: "B8", gapTag: "q-double-root", format: "zero-edge-case",
      generate() {
        return { text: "x² = 0. How many elements are in the solution set?", ...buildOptions("1",["2","0","Infinitely many"]) };
      },
    },
    { id: "B9", gapTag: "q-double-root", format: "identify-missing-root",
      generate() {
        const a=pick([1,2,3,4]), sqb=pick([1,2,3,4]), b=sqb*sqb;
        return { text: `(x − ${a})² = ${b}. A student writes only x = ${a+sqb}. What's missing?`, ...buildOptions(`x = ${a-sqb}`,["x = 0",`x = −${a+sqb}`,`x = ${a*sqb}`]) };
      },
    },
    { id: "B10", gapTag: "q-double-root", format: "explain-incompleteness",
      generate() {
        const r=pick([3,4,5,6,7]);
        return { text: `x² − ${r*r} = 0. A student factors and writes only x = ${r}. Why is this incomplete?`, ...buildOptions(`The factor (x + ${r}) also gives x = −${r}`,["The equation also has x = 0 as a solution","The equation has no real solutions",`The factorization (x − ${r})(x + ${r}) is wrong`]) };
      },
    },
    { id: "B11", gapTag: "q-double-root", format: "wrong-root-value",
      generate() {
        const r=pick([2,3,4,5]), k=r*r;
        return { text: `x² = ${k}. A student writes "x = ±${k}". Evaluate this answer.`, ...buildOptions(`Incorrect — the solutions are x = ±${r}, not ±${k}`,["Correct — x = ±"+k+" satisfies the equation","Partially correct — x = "+k+" is right but x = −"+k+" is not","Incorrect — the only solution is x = "+r]) };
      },
    },
    { id: "B12", gapTag: "q-double-root", format: "negative-k-trap",
      generate() {
        const r=pick([1,2,3,4,5]), k=r*r;
        return { text: `x² = −${k}. A student writes x = ±${r}. Evaluate.`, ...buildOptions(`Incorrect — no real number squared gives −${k}; the solution set in ℝ is empty`,["Correct — taking ± of any square root gives two solutions","Partially correct — x = "+r+" is a solution but x = −"+r+" is not","Incorrect — the solution is x = "+k]) };
      },
    },
    { id: "B13", gapTag: "q-double-root", format: "geometric-root-count",
      generate() {
        const r=pick([2,3,4,5]);
        return { text: `A parabola y = x² − ${r*r} crosses the x-axis. How many x-values satisfy x² = ${r*r}?`, ...buildOptions("2",["1","0","Depends on the parabola"]) };
      },
    },
    { id: "B14", gapTag: "q-double-root", format: "name-all-solutions",
      generate() {
        const r=pick([2,3,4,5,6]);
        return { text: `If x = ${r} is a solution to x² = ${r*r}, name ALL solutions.`, ...buildOptions(`x = ${r} and x = −${r}`,[`x = ${r} only`,`x = 0 and x = ${r}`,`x = ±${r*r}`]) };
      },
    },
    { id: "B15", gapTag: "q-double-root", format: "true-false-equivalence",
      generate() {
        const r=pick([3,4,5,6]);
        return { text: `True or false: x² = ${r*r} and (x − ${r})(x + ${r}) = 0 have the same solution set.`, ...buildOptions("True — both have solution set {−"+r+", "+r+"}",["False — the first has one solution, the second has two","False — the factored form has a different solution set","True — but only for positive values of x"]) };
      },
    },
    { id: "B16", gapTag: "q-double-root", format: "identify-equation-with-two",
      generate() {
        const r=pick([2,3,4]);
        return { text: "Which equation has exactly 2 real solutions?", ...buildOptions(`x² = ${r*r}`,[`x² = −${r*r}`,"x² = 0",`(x − ${r})² = 0`]) };
      },
    },
    { id: "B17", gapTag: "q-double-root", format: "reverse-from-set",
      generate() {
        const r=pick([2,3,4,5]);
        return { text: `x² = k has solution set {−${r}, ${r}}. What is k?`, ...buildOptions(String(r*r),[String(r),String(2*r),String(r*r*2)]) };
      },
    },
    { id: "B18", gapTag: "q-double-root", format: "evaluate-shifted-claim",
      generate() {
        const a=pick([1,2,3,4]), sqb=pick([2,3,4]), b=sqb*sqb;
        return { text: `(x − ${a})² = ${b}. A student says "there is only one solution: x = ${a+sqb}." Evaluate.`, ...buildOptions(`Incorrect — x = ${a-sqb} is also a solution`,["Correct — the equation has one solution","Incorrect — there are no real solutions","Correct — only the positive square root applies here"]) };
      },
    },
    { id: "B19", gapTag: "q-double-root", format: "higher-power",
      generate() {
        const r=pick([2,3,4]);
        return { text: `x⁴ = ${r*r*r*r}. A student writes only x = ${r}. How many solutions are missing from the complete real solution set?`, ...buildOptions("1",["0","2","3"]) };
      },
    },
    { id: "B20", gapTag: "q-double-root", format: "false-rule",
      generate() {
        return { text: "Which statement about x² = k is FALSE?", ...buildOptions("If k > 0, the only solution is x = √k",["If k = 0, the only solution is x = 0","If k < 0, there are no real solutions","If k > 0, the solutions are x = √k and x = −√k"]) };
      },
    },

    /* ═══════════════════════════════════════════
       C-SERIES · q-div-by-var
    ═══════════════════════════════════════════ */

    { id: "C1", gapTag: "q-div-by-var", format: "evaluate-division",
      generate() {
        const a=pick([2,3,4,5]), k=pick([2,3,4,5]), b=a*k;
        return { text: `${a}x² − ${b}x = 0. A student divides by x and concludes x = ${k}. Most accurate evaluation?`, ...buildOptions("Conclusion is correct but incomplete",["Conclusion is correct and complete","Conclusion is incorrect","Cannot be determined"]) };
      },
    },
    { id: "C2", gapTag: "q-div-by-var", format: "choose-solution-set",
      generate() {
        const a=pick([2,3,4,5]), k=pick([2,3,4,5]), b=a*k;
        return { text: `${a}x² = ${b}x. Choose the correct solution set in ℝ.`, ...buildOptions(`{0, ${k}}`,[`{${k}}`,`{0}`,`{−${k}, ${k}}`]) };
      },
    },
    { id: "C3", gapTag: "q-div-by-var", format: "choose-valid-method",
      generate() {
        const k=pick([2,3,4,5,6]);
        return { text: `x² = ${k}x. Choose the method that preserves equivalence for all x.`, ...buildOptions(`Rewrite as x² − ${k}x = 0 and factor`,["Divide both sides by x","Take square roots of both sides",`Move ${k}x to the left, then cancel x`]) };
      },
    },
    { id: "C4", gapTag: "q-div-by-var", format: "count-missing-after-division",
      generate() {
        return { text: "x³ = x². A student divides by x² and gets x = 1. Choose the best statement.", ...buildOptions("The final set is missing exactly one value",["The final set is complete","The final set is missing two values","The equation has no solutions"]) };
      },
    },
    { id: "C5", gapTag: "q-div-by-var", format: "evaluate-cancel",
      generate() {
        const a=pick([2,3,4]), k=pick([2,3,4,5,6]);
        return { text: `${a}x(x − ${k}) = 0. A student cancels x and writes x = ${k}. Evaluate.`, ...buildOptions(`Incomplete — x = 0 is also a solution`,[`Complete — x = ${k} is the only solution`,`Incorrect — x = −${k} is the correct solution`,`Incorrect — dividing by x always requires a sign check`]) };
      },
    },
    { id: "C6", gapTag: "q-div-by-var", format: "evaluate-correct-factoring",
      generate() {
        const k=pick([2,3,4,5,6,7]);
        return { text: `x² + ${k}x = 0. A student factors as x(x + ${k}) = 0 and writes {0, −${k}}. Evaluate.`, ...buildOptions("Complete and correct",[`Incomplete — also need x = ${k}`,`Incorrect — should be {0, ${k}}`,`Incorrect — should divide by x to get x = −${k} only`]) };
      },
    },
    { id: "C7", gapTag: "q-div-by-var", format: "shifted-division-trap",
      generate() {
        const k=pick([2,3,4,5]), m=pick([1,2,3]);
        return { text: `x(x − ${k}) = ${m}x. A student divides by x and gets x = ${k+m}. Evaluate.`, ...buildOptions(`Incomplete — x = 0 is also a solution`,[`Complete — x = ${k+m} is the only solution`,`Incorrect — x = ${k} is the correct answer`,`Incorrect — dividing by x changes the equation`]) };
      },
    },
    { id: "C8", gapTag: "q-div-by-var", format: "identify-invalid-step",
      generate() {
        const k=pick([2,3,4,5,6]);
        return { text: `Solving ${k}x² = ${k*2}x. Which step is NOT valid?`, ...buildOptions("Divide both sides by x",[`Divide both sides by ${k}`,`Move all terms left: ${k}x² − ${k*2}x = 0`,`Factor out ${k}x: ${k}x(x − 2) = 0`]) };
      },
    },
    { id: "C9", gapTag: "q-div-by-var", format: "simple-x-squared-equals-x",
      generate() {
        return { text: "x² = x. A student divides by x and gets x = 1. Evaluate.", ...buildOptions("Incomplete — x = 0 is also a solution",["Complete — x = 1 is the only solution","Incorrect — x = −1 is the solution","Incorrect — the equation has no solution because dividing by x is never valid"]) };
      },
    },
    { id: "C10", gapTag: "q-div-by-var", format: "cubic-solution-set",
      generate() {
        const k=pick([1,2,3,4,5]), kSq=k*k;
        return { text: `x³ − ${kSq}x = 0. Choose the correct solution set.`, ...buildOptions(`{−${k}, 0, ${k}}`,[`{0, ${k}}`,`{−${k}, ${k}}`,`{0, −${k}}`]) };
      },
    },
    { id: "C11", gapTag: "q-div-by-var", format: "count-missing-solutions",
      generate() {
        const k=pick([2,3,4,5,6]);
        return { text: `x² − ${k}x = 0. A student divides by x and writes x = ${k}. How many solutions are missing?`, ...buildOptions("1",["0","2","3"]) };
      },
    },
    { id: "C12", gapTag: "q-div-by-var", format: "explain-danger",
      generate() {
        const a=pick([2,3,4]), c=pick([2,3,4,6,8]);
        return { text: `${a}x² = ${c}x. A student says "we can divide by x here." What is the danger?`, ...buildOptions("Dividing by x loses the solution x = 0",["Dividing by x changes the degree of the equation permanently",`Dividing by x is valid only if a > c`,"Dividing by x is always valid for quadratic equations"]) };
      },
    },
    { id: "C13", gapTag: "q-div-by-var", format: "identify-lost-solution",
      generate() {
        const k=pick([2,3,4,5]);
        return { text: `After solving x² = ${k}x by dividing by x, a student gets x = ${k}. Which specific value was lost?`, ...buildOptions("x = 0",[`x = −${k}`,`x = ${k*2}`,"x = 1"]) };
      },
    },
    { id: "C14", gapTag: "q-div-by-var", format: "which-equation-safest",
      generate() {
        const k=pick([2,3,4,5]);
        return { text: `Which equation is equivalent to x² = ${k}x for ALL values of x?`, ...buildOptions(`x² − ${k}x = 0`,[`x = ${k}`,`x(x − ${k}) = 0 (with x ≠ 0)`,"x = 0"]) };
      },
    },
    { id: "C15", gapTag: "q-div-by-var", format: "true-false-zero-solution",
      generate() {
        const a=pick([2,3,4]), b=pick([2,3,4,6]);
        return { text: `True or false: ${a}x² + ${b}x = 0 always has x = 0 as a solution.`, ...buildOptions("True — substituting x = 0 gives 0 = 0",["False — x = 0 only works if a = b","False — x = 0 makes the equation undefined","True — but only if a and b are positive"]) };
      },
    },
    { id: "C16", gapTag: "q-div-by-var", format: "higher-power-division",
      generate() {
        const k=pick([2,3,4]);
        return { text: `x⁴ = ${k}x². A student divides by x² and gets x² = ${k}. How many solutions does the full equation have?`, ...buildOptions("3",["2","1","4"]) };
      },
    },
    { id: "C17", gapTag: "q-div-by-var", format: "correct-method-outcome",
      generate() {
        const k=pick([3,4,5,6,7]);
        return { text: `x² − ${k}x = 0 is factored as x(x − ${k}) = 0. What are ALL solutions?`, ...buildOptions(`x = 0 and x = ${k}`,[`x = ${k} only`,"x = 0 only",`x = −${k} and x = ${k}`]) };
      },
    },
    { id: "C18", gapTag: "q-div-by-var", format: "fix-the-error",
      generate() {
        const k=pick([2,3,4,5]);
        return { text: `A student writes: "x² = ${k}x → divide by x → x = ${k}." How should this be corrected?`, ...buildOptions(`Move all terms: x² − ${k}x = 0, factor as x(x − ${k}) = 0, solutions are x = 0 and x = ${k}`,["Divide by x is valid — the answer x = "+k+" is complete","The equation has no solutions","Take square roots instead: x = ±"+Math.sqrt(k).toFixed(1)]) };
      },
    },
    { id: "C19", gapTag: "q-div-by-var", format: "evaluate-partial-solution",
      generate() {
        const a=pick([2,3]), k=pick([3,4,5,6]);
        return { text: `${a}x² = ${a*k}x. A student gives {${k}} as the solution set. This set is:`, ...buildOptions("Incomplete — missing x = 0",["Complete and correct",`Incorrect — should be {0}`,`Incorrect — should be {−${k}, ${k}}`]) };
      },
    },
    { id: "C20", gapTag: "q-div-by-var", format: "conceptual-rule",
      generate() {
        return { text: "Why is it invalid to divide both sides of ax² = bx by x to solve for x?", ...buildOptions("x might equal 0, and dividing by 0 loses that solution",["Because x is unknown, so division is not allowed","Because ax² and bx are not like terms","Because division changes a quadratic into a linear equation permanently"]) };
      },
    },

    /* ═══════════════════════════════════════════
       D-SERIES · q-factoring
    ═══════════════════════════════════════════ */

    { id: "D1", gapTag: "q-factoring", format: "choose-factorization-psq-neg",
      generate() {
        const r=pick([2,3,4,5,6,7]);
        return { text: `${fmt(1,-2*r,r*r)}. Choose the correct factorization form.`, ...buildOptions(`(x − ${r})² = 0`,[`(x + ${r})² = 0`,`(x − ${r})(x + ${r}) = 0`,`(x − ${r*r})(x − 1) = 0`]) };
      },
    },
    { id: "D2", gapTag: "q-factoring", format: "choose-factorization-diff-sq",
      generate() {
        const r=pick([3,4,5,6,7,8,9]), k=r*r;
        return { text: `${fmt(1,0,-k)}. Choose the correct factorization form.`, ...buildOptions(`(x − ${r})(x + ${r}) = 0`,[`(x − ${r})² = 0`,`(x + ${r})² = 0`,`x(x − ${k}) = 0`]) };
      },
    },
    { id: "D3", gapTag: "q-factoring", format: "count-solutions-psq-pos",
      generate() {
        const r=pick([2,3,4,5,6,7]);
        return { text: `${fmt(1,2*r,r*r)}. How many different real solutions does it have?`, ...buildOptions("1",["0","2","Infinitely many"]) };
      },
    },
    { id: "D4", gapTag: "q-factoring", format: "evaluate-wrong-rewrite",
      generate() {
        const r=pick([2,3,4,5,6,7]), k=r*r;
        return { text: `A student rewrites ${fmt(1,0,-k)} as (x − ${r})² = 0. Choose the best assessment.`, ...buildOptions("The rewrite changes the set of solutions",["The rewrite is valid and preserves all solutions","The rewrite is valid only for x > 0","The rewrite is valid only for x < 0"]) };
      },
    },
    { id: "D5", gapTag: "q-factoring", format: "wrong-pattern-applied",
      generate() {
        const r=pick([2,3,4,5,6]);
        return { text: `A student sees x² − ${2*r}x + ${r*r} and factors it as (x − ${r})(x + ${r}). Evaluate.`, ...buildOptions(`Incorrect — (x − ${r})(x + ${r}) = x² − ${r*r}, not x² − ${2*r}x + ${r*r}`,["Correct — both factorizations are equivalent","Correct — the difference of squares form is always valid",`Incorrect — should be (x + ${r})(x + ${r})`]) };
      },
    },
    { id: "D6", gapTag: "q-factoring", format: "choose-correct-expansion",
      generate() {
        const r=pick([2,3,4,5,6,7]);
        return { text: `Which of these equals (x − ${r})²?`, ...buildOptions(`x² − ${2*r}x + ${r*r}`,[`x² + ${2*r}x + ${r*r}`,`x² − ${r*r}`,`x² − ${2*r}x − ${r*r}`]) };
      },
    },
    { id: "D7", gapTag: "q-factoring", format: "sum-of-squares-factorability",
      generate() {
        const r=pick([2,3,4,5,6]);
        return { text: `Can x² + ${r*r} be factored into linear factors over ℝ?`, ...buildOptions("No — a sum of two squares is irreducible over ℝ",[`Yes — (x − ${r})(x + ${r})`,`Yes — (x + ${r})²`,`Yes — (x − ${r})²`]) };
      },
    },
    { id: "D8", gapTag: "q-factoring", format: "leading-coeff-factorization",
      generate() {
        const a=pick([2,3]), b=pick([2,3,5]), aSq=a*a, bSq=b*b;
        return { text: `${aSq}x² − ${bSq} = 0. Choose the correct factorization.`, ...buildOptions(`(${a}x − ${b})(${a}x + ${b}) = 0`,[`(${a}x − ${b})² = 0`,`(x − ${b})(x + ${b}) = 0`,`${aSq}(x − ${b})(x + ${b}) = 0`]) };
      },
    },
    { id: "D9", gapTag: "q-factoring", format: "identify-perfect-square",
      generate() {
        const r=pick([2,3,4,5]);
        return { text: "Which equation is a perfect square trinomial set equal to zero?", ...buildOptions(fmt(1,-2*r,r*r),[fmt(1,0,-(r*r)),fmt(1,-(r+1),r),fmt(1,-2*r,r*r+1)]) };
      },
    },
    { id: "D10", gapTag: "q-factoring", format: "evaluate-two-roots-from-psq",
      generate() {
        const r=pick([2,3,4,5]);
        return { text: `${fmt(1,2*r,r*r)}. A student writes x = ${r} and x = −${r}. Evaluate.`, ...buildOptions(`Incorrect — (x + ${r})² = 0 has only one solution: x = −${r}`,["Correct — factoring gives two solutions",`Incorrect — the only solution is x = ${r}`,"Incorrect — the equation has no real solutions"]) };
      },
    },
    { id: "D11", gapTag: "q-factoring", format: "shifted-diff-squares",
      generate() {
        const a=pick([1,2,3,4]), sqb=pick([2,3,4,5]), b=sqb*sqb;
        const x1=sqb-a, x2=-sqb-a;
        const setStr=`{${Math.min(x1,x2)}, ${Math.max(x1,x2)}}`;
        return { text: `(x + ${a})² − ${b} = 0. Which solution set is correct?`, ...buildOptions(setStr,[`{${Math.max(x1,x2)}}`,`{${a-sqb}, ${a+sqb}}`,`{−${a}, ${a}}`]) };
      },
    },
    { id: "D12", gapTag: "q-factoring", format: "expansion-error-type",
      generate() {
        const r=pick([2,3,4,5,6]);
        return { text: `A student expands (x − ${r})² and writes x² − ${r*r}. What error did they make?`, ...buildOptions(`Treated it as difference of squares: (x − ${r})(x + ${r}) = x² − ${r*r}`,["Forgot to square "+r+" — should be x² − "+r,"Sign error — should be x² + "+r*r,"No error — (x − "+r+")² = x² − "+r*r+" is correct"]) };
      },
    },
    { id: "D13", gapTag: "q-factoring", format: "classify-trinomial",
      generate() {
        const r=pick([2,3,4,5]), isPS=Math.random()>0.5;
        const eq=isPS?fmt(1,2*r,r*r):fmt(1,2*r+1,r*r);
        return { text: `Is ${eq} a perfect square trinomial?`, ...buildOptions(isPS?"Yes — it equals (x + "+r+")²":"No — the middle term doesn't match",isPS?["No — the constant term is wrong","No — perfect squares only have negative middle terms","Yes — any trinomial with positive terms is a perfect square"]:["Yes — it factors as (x + "+r+")²","Yes — any trinomial is a perfect square","No — it has no real factors"]) };
      },
    },
    { id: "D14", gapTag: "q-factoring", format: "identify-pattern-name",
      generate() {
        const r=pick([2,3,4,5]), type=pick(["psq","diff"]);
        if(type==="psq") return { text: `x² − ${2*r}x + ${r*r} = 0. Which algebraic identity applies?`, ...buildOptions("Perfect square trinomial: (a − b)² = a² − 2ab + b²",["Difference of squares: a² − b² = (a−b)(a+b)","Sum of squares","Quadratic formula only"]) };
        return { text: `x² − ${r*r} = 0. Which algebraic identity applies?`, ...buildOptions("Difference of squares: a² − b² = (a−b)(a+b)",["Perfect square trinomial: (a − b)²","Sum of squares","Completing the square"]) };
      },
    },
    { id: "D15", gapTag: "q-factoring", format: "count-solutions-general",
      generate() {
        const r=pick([2,3,4,5]);
        return { text: `How many solutions does (x − ${r})(x + ${r}) = 0 have?`, ...buildOptions("2",["1","0","4"]) };
      },
    },
    { id: "D16", gapTag: "q-factoring", format: "compare-solution-sets",
      generate() {
        const r=pick([2,3,4,5]);
        return { text: `Do x² − ${2*r}x + ${r*r} = 0 and x² − ${r*r} = 0 have the same solution set?`, ...buildOptions("No — the first has {"+r+"}, the second has {−"+r+", "+r+"}",["Yes — both equal zero when x = "+r,"Yes — they are the same equation","No — neither has real solutions"]) };
      },
    },
    { id: "D17", gapTag: "q-factoring", format: "fill-in-perfect-square",
      generate() {
        const r=pick([2,3,4,5,6]);
        return { text: `x² − ${2*r}x + ___ = (x − ${r})². What fills the blank?`, ...buildOptions(String(r*r),[String(r),String(2*r),String(r*r-1)]) };
      },
    },
    { id: "D18", gapTag: "q-factoring", format: "true-false-psq-one-solution",
      generate() {
        return { text: "True or false: every perfect square trinomial set equal to zero has exactly one real solution.", ...buildOptions("True — (x − r)² = 0 has only x = r",["False — it has two solutions because it factors into two identical parts","False — it depends on the sign of the middle term","True — but only if the leading coefficient is 1"]) };
      },
    },
    { id: "D19", gapTag: "q-factoring", format: "expansion-verify",
      generate() {
        const r=pick([2,3,4,5]);
        return { text: `A student claims (x + ${r})² = x² + ${r*r}. What's the error?`, ...buildOptions(`Missing middle term — correct expansion is x² + ${2*r}x + ${r*r}`,["Wrong constant — should be x² + "+r,"Sign error — should be x² − "+2*r+"x + "+r*r,"No error — (x + "+r+")² = x² + "+r*r+" is correct"]) };
      },
    },
    { id: "D20", gapTag: "q-factoring", format: "which-pattern-false",
      generate() {
        const r=pick([2,3,4,5]);
        return { text: "Which statement about factoring patterns is FALSE?", ...buildOptions(`x² + ${r*r} = (x − ${r})(x + ${r})`,[`x² − ${r*r} = (x − ${r})(x + ${r})`,`x² − ${2*r}x + ${r*r} = (x − ${r})²`,`x² + ${2*r}x + ${r*r} = (x + ${r})²`]) };
      },
    },

    /* ═══════════════════════════════════════════
       E-SERIES · q-vieta
    ═══════════════════════════════════════════ */

    { id: "E1", gapTag: "q-vieta", format: "sum-of-squares-vieta",
      generate() {
        const go=()=>{const pool=[1,2,3,4,5,6],r1=pick(pool),r2=pick(pool.filter(v=>v!==r1)),s=r1+r2,p=r1*r2,correct=s*s-2*p,w1=s*s,w2=s*s+2*p,w3=p*p;if(new Set([correct,w1,w2,w3]).size<4)return go();return{s,p,correct,w1,w2,w3};};
        const {s,p,correct,w1,w2,w3}=go();
        return { text: `The roots of ${fmt(1,-s,p)} are x₁ and x₂. Find x₁² + x₂² without solving.`, ...buildOptions(String(correct),[String(w1),String(w2),String(w3)]) };
      },
    },
    { id: "E2", gapTag: "q-vieta", format: "find-b-c-from-roots",
      generate() {
        const r1=pick([2,3,4,5]),r2=pick([-2,-3,-4,-5]),s=r1+r2,p=r1*r2,b=-s,c=p;
        return { text: `A quadratic with roots ${r1} and ${display(r2)} is x² + bx + c = 0. Choose (b, c).`, ...buildOptions(`(${b}, ${c})`,[`(${s}, ${c})`,`(${b}, ${-c})`,`(${s}, ${-c})`]) };
      },
    },
    { id: "E3", gapTag: "q-vieta", format: "find-sum-product",
      generate() {
        const r1=pick([-5,-4,-3,-2,-1,1,2,3,4,5]),r2=pick([-5,-4,-3,-2,-1,1,2,3,4,5]),sum=r1+r2,prod=r1*r2,b=-sum,c=prod;
        return { text: `For ${fmt(1,b,c)}, choose (x₁ + x₂, x₁·x₂).`, ...buildOptions(`(${display(sum)}, ${prod})`,[`(${display(-sum)}, ${prod})`,`(${display(sum)}, ${-prod})`,`(${display(-sum)}, ${-prod})`]) };
      },
    },
    { id: "E4", gapTag: "q-vieta", format: "identify-equation-from-sum-product",
      generate() {
        const r1=pick([1,2,3,4]),r2=pick([-1,-2,-3,-4,-5,-6]),S=r1+r2,P=r1*r2;
        return { text: `Two roots have sum ${display(S)} and product ${display(P)}. Which equation matches?`, ...buildOptions(fmt(1,-S,P),[fmt(1,S,P),fmt(1,-S,-P),fmt(1,S,-P)]) };
      },
    },
    { id: "E5", gapTag: "q-vieta", format: "reciprocal-sum",
      generate() {
        return { text: "For x² + bx + c = 0 with roots x₁ and x₂ (both nonzero), which expression equals 1/x₁ + 1/x₂?", ...buildOptions("−b/c",["b/c","−c/b","c/b"]) };
      },
    },
    { id: "E6", gapTag: "q-vieta", format: "difference-squared-vieta",
      generate() {
        const r1=pick([1,2,3,4,5]),r2=pick([1,2,3,4,5].filter(v=>v!==r1)),s=r1+r2,p=r1*r2,correct=s*s-4*p,w1=s*s+4*p,w2=s*s-2*p,w3=s*s;
        return { text: `The roots of ${fmt(1,-s,p)} are x₁ and x₂. Find (x₁ − x₂)² without solving.`, ...buildOptions(String(correct),[String(w1),String(w2),String(w3)]) };
      },
    },
    { id: "E7", gapTag: "q-vieta", format: "non-monic-vieta",
      generate() {
        const a=pick([2,3]),r1=pick([1,2,3]),r2=pick([1,2,3].filter(v=>v!==r1)),s=r1+r2,p=r1*r2,b=-a*s,c=a*p;
        return { text: `${fmt(a,b,c)} has roots x₁ and x₂. A student writes x₁+x₂ = ${-b} and x₁x₂ = ${c}. Evaluate.`, ...buildOptions(`Incorrect — both values should be divided by ${a}: sum = ${s}, product = ${p}`,["Correct — Vieta gives sum = −b and product = c","Partially correct — sum = "+(-b)+" is right but product should be "+(-c),"Incorrect — sum should be "+b+" and product should be "+(-c)]) };
      },
    },
    { id: "E8", gapTag: "q-vieta", format: "product-sign-implies",
      generate() {
        const p=pick([-2,-3,-4,-6,-8,-10,-12]);
        return { text: `For a quadratic with x₁·x₂ = ${p}, which statement must be true?`, ...buildOptions("The roots have opposite signs",["Both roots are negative","Both roots are positive","At least one root equals zero"]) };
      },
    },
    { id: "E9", gapTag: "q-vieta", format: "find-second-root",
      generate() {
        const r1=pick([1,2,3,4,5]),r2=pick([1,2,3,4,5].filter(v=>v!==r1)),s=r1+r2,p=r1*r2;
        return { text: `x² − ${s}x + c = 0 has one root x₁ = ${r1}. Using Vieta, find x₂ and c.`, ...buildOptions(`x₂ = ${r2}, c = ${p}`,[`x₂ = ${s}, c = ${r1*s}`,`x₂ = ${r2}, c = ${-p}`,`x₂ = ${-r2}, c = ${-p}`]) };
      },
    },
    { id: "E10", gapTag: "q-vieta", format: "symmetric-expression",
      generate() {
        const r1=pick([1,2,3,4]),r2=pick([1,2,3,4,5]),s=r1+r2,p=r1*r2,b=-s,c=p,correct=p+s+1,w1=p+s,w2=p-s+1,w3=(p+1)*(s+1);
        return { text: `For ${fmt(1,b,c)}, the roots are x₁ and x₂. Find (x₁ + 1)(x₂ + 1) without solving.`, ...buildOptions(String(correct),[String(w1),String(w2),String(w3)]) };
      },
    },
    { id: "E11", gapTag: "q-vieta", format: "positive-product-implies",
      generate() {
        const p=pick([2,3,4,6,8,9,12,15]);
        return { text: `For a quadratic with x₁·x₂ = ${p} > 0, which statement is definitely true?`, ...buildOptions("The roots have the same sign (both positive or both negative)",["Both roots are positive","Both roots are negative","The roots are equal"]) };
      },
    },
    { id: "E12", gapTag: "q-vieta", format: "factored-symmetric",
      generate() {
        const r1=pick([1,2,3]),r2=pick([1,2,3].filter(v=>v!==r1)),s=r1+r2,p=r1*r2,b=-s,c=p,correct=p*s;
        return { text: `For ${fmt(1,b,c)}, find x₁x₂² + x₁²x₂ without solving.`, ...buildOptions(String(correct),[String(p*s*s),String(s*p*p),String(p+s)]) };
      },
    },
    { id: "E13", gapTag: "q-vieta", format: "sum-sign-implies-b",
      generate() {
        return { text: "For x² + bx + c = 0, the sum of roots is negative. What does this tell you about b?", ...buildOptions("b > 0, since sum = −b/1 and sum < 0 means −b < 0",["b < 0, since sum < 0","b = 0","Nothing — sum and b are unrelated"]) };
      },
    },
    { id: "E14", gapTag: "q-vieta", format: "zero-root-implies-c",
      generate() {
        return { text: "For x² + bx + c = 0, one root equals 0. What must be true about c?", ...buildOptions("c = 0, since product of roots = c = 0 × other root = 0",["c > 0","c < 0","c = b"]) };
      },
    },
    { id: "E15", gapTag: "q-vieta", format: "identify-vieta-error",
      generate() {
        const r1=pick([2,3,4,5]),r2=pick([1,2,3,4]),s=r1+r2,p=r1*r2,b=-s,c=p;
        return { text: `For ${fmt(1,b,c)}, a student writes "sum of roots = ${-b}." Identify the error.`, ...buildOptions(`The sum is −b = ${s}, not b = ${-b} — student used b directly`,["No error — sum of roots equals b","The sum should be "+(b*2),"The student should use the quadratic formula instead"]) };
      },
    },
    { id: "E16", gapTag: "q-vieta", format: "find-coefficient-from-root",
      generate() {
        const r1b=2,r2b=6,cb=12,s=r1b+r2b;
        return { text: `x² + bx + ${cb} = 0 has one root x = ${r1b}. Find b using Vieta.`, ...buildOptions(String(-s),[String(s),String(-r1b),String(-cb)]) };
      },
    },
    { id: "E17", gapTag: "q-vieta", format: "true-false-positive-roots",
      generate() {
        return { text: "True or false: if the product of roots is positive, both roots must be positive.", ...buildOptions("False — both could be negative (e.g. roots −2 and −3 have product 6 > 0)",["True — positive product means positive roots","True — product and sum are always the same sign","False — positive product means the roots are equal"]) };
      },
    },
    { id: "E18", gapTag: "q-vieta", format: "sum-zero-implies",
      generate() {
        return { text: "x₁ + x₂ = 0 for some quadratic. What does this tell you about b in x² + bx + c = 0?", ...buildOptions("b = 0, since sum = −b = 0",["b > 0","b < 0","b = c"]) };
      },
    },
    { id: "E19", gapTag: "q-vieta", format: "evaluate-wrong-equation-build",
      generate() {
        const r=pick([2,3,4]);
        return { text: `A student builds a quadratic with roots ${r} and −${r} and writes x² + ${r*r} = 0. Evaluate.`, ...buildOptions(`Incorrect — product of roots = −${r*r} so c = −${r*r}, giving x² − ${r*r} = 0`,[`Correct — product is ${r} × ${r} = ${r*r}`,"Partially correct — equation should be x² − "+r*r+" = 0 for a different reason","Correct — sum is 0 so b = 0 and c = "+r*r]) };
      },
    },
    { id: "E20", gapTag: "q-vieta", format: "compute-product-from-equation",
      generate() {
        const r1=pick([1,2,3,4,5]),r2=pick([-1,-2,-3,-4,-5]),s=r1+r2,p=r1*r2,b=-s,c=p;
        return { text: `For ${fmt(1,b,c)}, what is x₁ · x₂?`, ...buildOptions(String(p),[String(-p),String(s),String(-s)]) };
      },
    },

    /* ═══════════════════════════════════════════
       F-SERIES · q-adaptive (F1–F20)
    ═══════════════════════════════════════════ */

    // format: rearrange-to-standard
    {
      id: "F1", gapTag: "q-adaptive", format: "rearrange-to-standard",
      generate() {
        const r1 = pick([1,2,3,4,5]);
        const r2 = pick([1,2,3,4,5].filter(v => v !== r1));
        const s = r1+r2, p = r1*r2;
        return {
          text: `A student sees ${p} = ${s}x − x² and says "this isn't a quadratic equation." Evaluate.`,
          ...buildOptions(
            `Incorrect — rearranging gives x² − ${s}x + ${p} = 0, which is standard quadratic form`,
            [
              "Correct — a quadratic must have x² on the left side",
              "Correct — the equation is linear because x² is negative",
              "Incorrect — it's quadratic only if x² has coefficient 1",
            ]
          ),
        };
      },
    },
 
    // format: identify-quadratic-disguised
    {
      id: "F2", gapTag: "q-adaptive", format: "identify-quadratic-disguised",
      generate() {
        const a = pick([2,3,4]), b = pick([2,3,5,6]);
        return {
          text: `Is (x + ${a})(x − ${b}) = 0 a quadratic equation?`,
          ...buildOptions(
            `Yes — expanding gives x² + ${a-b}x − ${a*b} = 0, standard quadratic form`,
            [
              "No — it is already factored so it is not quadratic",
              "No — quadratic equations cannot be written in factored form",
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
        const w = pick([3,4,5,6]), diff = pick([2,3,4]), area = w*(w+diff);
        return {
          text: `A rectangle has width x and length x + ${diff}. Its area is ${area}. Which equation models this?`,
          ...buildOptions(
            `x² + ${diff}x − ${area} = 0`,
            [
              `x + (x + ${diff}) = ${area}`,
              `2x + 2(x + ${diff}) = ${area}`,
              `x² + ${diff} = ${area}`,
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
              "Correct — x is only raised to the first power on the left",
              "Correct — linear equations can have products of x",
              "Incorrect — but only because the right side is not zero",
            ]
          ),
        };
      },
    },
 
    // format: solve-non-standard-form
    {
      id: "F5", gapTag: "q-adaptive", format: "solve-non-standard-form",
      generate() {
        const r1 = pick([1,2,3,4]), r2 = pick([1,2,3,4].filter(v => v !== r1));
        const s = r1+r2, p = r1*r2;
        return {
          text: `${s}x − x² = ${p}. What is the first step to solve this?`,
          ...buildOptions(
            `Rearrange to standard form: x² − ${s}x + ${p} = 0`,
            [
              "Divide both sides by x",
              "Take the square root of both sides",
              "This equation cannot be solved — x² is negative",
            ]
          ),
        };
      },
    },
 
    // format: equation-from-context
    {
      id: "F6", gapTag: "q-adaptive", format: "equation-from-context",
      generate() {
        const n = pick([2,3,4,5,6]), prod = n*(n+1);
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
        const a = pick([2,3,4]), b = pick([1,2,3]);
        return {
          text: `${a}x² = ${b}(x² − ${a}). After expanding and simplifying, what type of equation results?`,
          ...buildOptions(
            "Linear — the x² terms cancel",
            [
              "Quadratic — expanding always gives a quadratic",
              "Cubic — multiplying x² by x² gives x⁴",
              "Cannot determine without solving",
            ]
          ),
        };
      },
    },
 
    // format: non-standard-solution-count
    {
      id: "F8", gapTag: "q-adaptive", format: "non-standard-solution-count",
      generate() {
        const r = pick([2,3,4,5]), k = r*r;
        return {
          text: `${k} − x² = 0. Without rearranging, a student says "I can't tell how many solutions this has." Is that true?`,
          ...buildOptions(
            `No — rearranging to x² = ${k} immediately shows two solutions: x = ±${r}`,
            [
              "Yes — the equation must be in standard form before you can count solutions",
              "Yes — the negative x² means there are no real solutions",
              "No — there is always exactly one solution regardless of form",
            ]
          ),
        };
      },
    },
 
    // format: disguised-quadratic-substitution
    {
      id: "F9", gapTag: "q-adaptive", format: "disguised-quadratic-substitution",
      generate() {
        const a = pick([1,2,3]), b = pick([3,5,7]), c = pick([2,4,6]);
        return {
          text: `A student sees: ${a}(x+${b})² − ${c}(x+${b}) = 0. Which solving strategy is most appropriate FIRST?`,
          ...buildOptions(
            `Substitute u = (x+${b}) to get a simpler quadratic in u`,
            [
              "Expand everything and collect like terms into ax²+bx+c=0",
              "Apply the quadratic formula immediately to the original expression",
              `Divide both sides by (x+${b}) to isolate the bracket`,
            ]
          ),
        };
      },
    },
 
    // format: gcf-before-method
    {
      id: "F10", gapTag: "q-adaptive", format: "gcf-before-method",
      generate() {
        const k = pick([2,3,4,5]), p = pick([1,2,3]), q = pick([2,3,4]);
        return {
          text: `Given ${k}x² + ${k*p}x + ${k*q} = 0, what should a student do BEFORE choosing a solving method?`,
          ...buildOptions(
            `Factor out the GCF (${k}) from all terms first`,
            [
              `Apply the quadratic formula directly with a=${k}, b=${k*p}, c=${k*q}`,
              "Complete the square on the full equation as written",
              `Try to factor ${k}x² + ${k*p}x + ${k*q} directly by trial and error`,
            ]
          ),
        };
      },
    },
 
    // format: perfect-square-trinomial-id
    {
      id: "F11", gapTag: "q-adaptive", format: "perfect-square-trinomial-id",
      generate() {
        const n = pick([2,3,4,5,6]), a = n*n, b = 2*n;
        return {
          text: `Which label correctly identifies x² + ${b}x + ${a} = 0?`,
          ...buildOptions(
            `Perfect square trinomial: (x + ${n})² = 0`,
            [
              "Difference of two squares: cannot be written as a perfect square",
              "Prime trinomial: does not factor over the integers",
              "Standard trinomial requiring the quadratic formula to solve",
            ]
          ),
        };
      },
    },
 
    // format: difference-of-squares-recognition
    {
      id: "F12", gapTag: "q-adaptive", format: "difference-of-squares-recognition",
      generate() {
        const n = pick([2,3,4,5,7]), k = n*n;
        return {
          text: `A student rewrites x² = ${k}. Which form and method are most efficient?`,
          ...buildOptions(
            `Difference of squares: (x−${n})(x+${n})=0, giving x=±${n}`,
            [
              `Use the quadratic formula with a=1, b=0, c=−${k}`,
              `Complete the square: add ${k} to both sides first`,
              "This cannot be solved without the quadratic formula because b=0",
            ]
          ),
        };
      },
    },
 
    // format: rearrange-before-solve
    {
      id: "F13", gapTag: "q-adaptive", format: "rearrange-before-solve",
      generate() {
        const p = pick([2,3,4,5]), q = pick([1,2,3]), r = pick([6,8,10,12]);
        return {
          text: `A student is given: x² + ${p}x = ${q}x − ${r}. Before applying any method, what MUST happen?`,
          ...buildOptions(
            `Move all terms to one side: x² + ${p-q}x + ${r} = 0`,
            [
              `Factor the left side x²+${p}x as x(x+${p}) immediately`,
              "Divide both sides by x to reduce the degree",
              `Apply the quadratic formula using a=1, b=${p}, c=−${r} as written`,
            ]
          ),
        };
      },
    },
 
    // format: zero-product-readiness-check
    {
      id: "F14", gapTag: "q-adaptive", format: "zero-product-readiness-check",
      generate() {
        const a = pick([2,3,4,5]), b = pick([1,2,3,4]);
        return {
          text: `A student has (x+${a})(x−${b}) = ${a*b}. Can the zero-product property be used immediately?`,
          ...buildOptions(
            "No — the right side must equal 0; expand and rearrange first",
            [
              `Yes — set x+${a}=${a*b} and x−${b}=${a*b} and solve each`,
              `Yes — set x+=${a}=0 and x−${b}=0 because the product is constant`,
              `Yes — divide both sides by ${a*b} first, then use zero-product property`,
            ]
          ),
        };
      },
    },
 
    // format: completing-square-trigger
    {
      id: "F15", gapTag: "q-adaptive", format: "completing-square-trigger",
      generate() {
        const b = pick([3,5,7,9]), c = pick([1,2,3,4]);
        return {
          text: `For x² + ${b}x + ${c} = 0, the discriminant is ${b*b-4*c}. Which method is most efficient given this does NOT factor neatly over integers?`,
          ...buildOptions(
            "Complete the square or use the quadratic formula",
            [
              `Factor by finding integers whose product is ${c} and sum is ${b}`,
              `Apply the zero-product property directly to x² and ${b}x`,
              "Rewrite as a difference of squares since the constant term is small",
            ]
          ),
        };
      },
    },
 
    // format: biquadratic-substitution-id
    {
      id: "F16", gapTag: "q-adaptive", format: "biquadratic-substitution-id",
      generate() {
        const a = pick([1,2,3]), b = pick([5,7,9,10]), c = pick([4,6,8]);
        return {
          text: `Which structure best describes ${a}x⁴ − ${b}x² + ${c} = 0, and what is the correct first step?`,
          ...buildOptions(
            "Biquadratic (quadratic in x²): substitute u = x², solve for u, then find x",
            [
              `Standard quartic: use the quadratic formula with a=${a}, b=−${b}, c=${c}`,
              `Factor as a difference of squares: (${a}x²−${c})(x²−1)=0 by inspection`,
              "Divide through by x² to reduce to a quadratic in x",
            ]
          ),
        };
      },
    },
 
    // format: fractional-equation-quadratic-id
    {
      id: "F17", gapTag: "q-adaptive", format: "fractional-equation-quadratic-id",
      generate() {
        const k = pick([2,3,4,5]), m = pick([1,2,3]);
        return {
          text: `A student sees x + ${k}/x = ${m+k+1}. What type of equation is this AFTER multiplying through by x (and x ≠ 0)?`,
          ...buildOptions(
            `A quadratic equation: x² − ${m+k+1}x + ${k} = 0`,
            [
              "A linear equation in x, since the x terms cancel on both sides",
              "A rational equation that still contains x in the denominator after multiplying",
              "An exponential equation because x appears in the denominator originally",
            ]
          ),
        };
      },
    },
 
    // format: negative-leading-coefficient-method
    {
      id: "F18", gapTag: "q-adaptive", format: "negative-leading-coefficient-method",
      generate() {
        const a = pick([2,3,4]), b = pick([1,2,3,4]), c = pick([1,2,3]);
        return {
          text: `Given −${a}x² + ${b}x + ${c} = 0, a student wants to factor. What should they do first to make the process standard?`,
          ...buildOptions(
            `Multiply every term by −1 so the leading coefficient becomes +${a}`,
            [
              `Factor out −1 from the left side only, leaving −(${a}x²−${b}x−${c})=0`,
              `Apply the quadratic formula with a=+${a} because negatives cancel in b²−4ac`,
              `Switch the sign of c only, giving −${a}x²+${b}x−${c}=0`,
            ]
          ),
        };
      },
    },
 
    // format: sum-product-roots-method-choice
    {
      id: "F19", gapTag: "q-adaptive", format: "sum-product-roots-method-choice",
      generate() {
        const r1 = pick([1,2,3,4,5]);
        const r2 = pick([1,2,3,4,5].filter(v => v !== r1));
        const sum = r1+r2, prod = r1*r2;
        return {
          text: `Without fully solving, a student needs the SUM and PRODUCT of the roots of x² − ${sum}x + ${prod} = 0. Which approach is correct?`,
          ...buildOptions(
            `By Vieta's formulas: sum = ${sum}, product = ${prod} — no solving needed`,
            [
              "Solve using the quadratic formula, then add and multiply the two roots found",
              "Complete the square to find the vertex; the x-coordinate gives the sum of roots",
              `Sum = −b = ${sum}, product = −c = −${prod} (sign error on product)`,
            ]
          ),
        };
      },
    },
 
    // format: quadratic-inequality-boundary-id
    {
      id: "F20", gapTag: "q-adaptive", format: "quadratic-inequality-boundary-id",
      generate() {
        const r1 = pick([1,2,3]), r2 = r1 + pick([1,2,3]);
        return {
          text: `To solve (x−${r1})(x−${r2}) < 0, a student correctly finds the roots are ${r1} and ${r2}. Which reasoning identifies the solution set?`,
          ...buildOptions(
            `Test a value in each interval; the product is negative between the roots: ${r1} < x < ${r2}`,
            [
              `The solution is x < ${r1} or x > ${r2} because the parabola opens upward`,
              `Set each factor < 0: x < ${r1} AND x < ${r2}, so x < ${r1}`,
              "The inequality has no solution because a product of two terms cannot be negative",
            ]
          ),
        };
      },
    },
 
    /* ═══════════════════════════════════════════
       G-SERIES · q-relational (G1–G20)
    ═══════════════════════════════════════════ */
 
    // format: graph-to-root-count
    {
      id: "G1", gapTag: "q-relational", format: "graph-to-root-count",
      generate() {
        const scenario = pick([
          { desc: "crosses the x-axis at two points", roots: "2", wrong: ["0","1","Cannot determine without the equation"] },
          { desc: "touches the x-axis at exactly one point", roots: "1", wrong: ["0","2","Cannot determine without the equation"] },
          { desc: "never touches the x-axis", roots: "0", wrong: ["1","2","Cannot determine without the equation"] },
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
          { d: "D > 0", graph: "crosses the x-axis at two distinct points", wrong: ["touches the x-axis at one point","does not touch the x-axis","crosses the x-axis at the origin"] },
          { d: "D = 0", graph: "touches the x-axis at exactly one point", wrong: ["crosses the x-axis at two points","does not touch the x-axis","is entirely below the x-axis"] },
          { d: "D < 0", graph: "does not touch the x-axis at all", wrong: ["crosses the x-axis at two points","touches the x-axis at one point","crosses the x-axis at the origin"] },
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
            [`At y = ${r1} and y = ${r2}`, `At the point (${r1}, ${r2})`, "Cannot determine without knowing b and c"]
          ),
        };
      },
    },
 
    // format: graph-position-to-d
    {
      id: "G4", gapTag: "q-relational", format: "graph-position-to-d",
      generate() {
        const scenario = pick([
          { desc: "entirely above the x-axis", d: "D < 0", wrong: ["D > 0","D = 0","D can be anything"] },
          { desc: "vertex on the x-axis",       d: "D = 0", wrong: ["D > 0","D < 0","D can be anything"] },
          { desc: "crossing the x-axis at two points", d: "D > 0", wrong: ["D = 0","D < 0","D can be anything"] },
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
        const h = pick([-3,-2,-1,1,2,3]), k = pick([1,2,3,4]);
        return {
          text: `A parabola opens upward with vertex at (${h}, ${k}). How many real roots does its equation have?`,
          ...buildOptions("0", ["1","2","Cannot determine from the vertex alone"]),
        };
      },
    },
 
    // format: vertex-below-to-roots
    {
      id: "G6", gapTag: "q-relational", format: "vertex-below-to-roots",
      generate() {
        const h = pick([-3,-2,-1,0,1,2,3]), k = pick([-4,-3,-2,-1]);
        return {
          text: `A parabola opens upward with vertex at (${h}, ${k}). How many real roots does its equation have?`,
          ...buildOptions("2", ["0","1","Cannot determine without the full equation"]),
        };
      },
    },
 
    // format: symbolic-to-graph-property
    {
      id: "G7", gapTag: "q-relational", format: "symbolic-to-graph-property",
      generate() {
        const r1 = pick([1,2,3,4,5]), r2 = pick([1,2,3,4,5].filter(v => v !== r1));
        const s = r1+r2, p = r1*r2;
        return {
          text: `The equation x² − ${s}x + ${p} = 0 has two positive roots. What does this tell you about the parabola y = x² − ${s}x + ${p}?`,
          ...buildOptions(
            `It crosses the x-axis at two positive x-values: x = ${r1} and x = ${r2}`,
            ["It is entirely above the x-axis","Its vertex is at a positive y-value","It opens downward"]
          ),
        };
      },
    },
 
    // format: equation-to-intercept-count
    {
      id: "G8", gapTag: "q-relational", format: "equation-to-intercept-count",
      generate() {
        const scenarios = [
          { eq: "x² + 4",      intercepts: "0 x-intercepts" },
          { eq: "x² − 4x + 4", intercepts: "1 x-intercept"  },
          { eq: "x² − 4",      intercepts: "2 x-intercepts" },
        ];
        const s = pick(scenarios);
        const wrong = scenarios.filter(x => x.eq !== s.eq).map(x => x.intercepts);
        wrong.push("Cannot determine without graphing");
        return {
          text: `How many x-intercepts does y = ${s.eq} have?`,
          ...buildOptions(s.intercepts, wrong.slice(0,3)),
        };
      },
    },
 
    // format: vertex-form-to-x-intercepts
    {
      id: "G9", gapTag: "q-relational", format: "vertex-form-to-x-intercepts",
      generate() {
        const h = pick([1,2,3,4,5]), k = pick([1,4,9,16]), sqrtK = Math.sqrt(k);
        return {
          text: `The equation y = (x − ${h})² − ${k} is in vertex form. What are the x-intercepts?`,
          ...buildOptions(
            `x = ${h-sqrtK} and x = ${h+sqrtK}`,
            [
              `x = ${h} and x = ${k} (using vertex coordinates directly as intercepts)`,
              `x = −${h} and x = ${sqrtK} (sign error on h)`,
              `x = ${h-k} and x = ${h+k} (using k instead of √k)`,
            ]
          ),
        };
      },
    },
 
    // format: roots-to-standard-form
    {
      id: "G10", gapTag: "q-relational", format: "roots-to-standard-form",
      generate() {
        const r1 = pick([1,2,3,4,5]), r2 = pick([1,2,3,4,5]), sum = r1+r2, prod = r1*r2;
        return {
          text: `A quadratic has roots x = ${r1} and x = ${r2}. Which standard form equation matches?`,
          ...buildOptions(
            `x² − ${sum}x + ${prod} = 0`,
            [
              `x² + ${sum}x + ${prod} = 0 (wrong sign on the sum)`,
              `x² − ${sum}x − ${prod} = 0 (wrong sign on the product)`,
              `(x+${r1})(x+${r2})=0, expanding to x²+${sum}x+${prod}=0`,
            ]
          ),
        };
      },
    },
 
    // format: graph-opening-direction-to-equation
    {
      id: "G11", gapTag: "q-relational", format: "graph-opening-direction-to-equation",
      generate() {
        const a = pick([2,3,4,5]), h = pick([1,2,3]), k = pick([1,2,4]);
        return {
          text: `A parabola opens DOWNWARD, has vertex (${h}, ${k}), and passes through the y-axis above the x-axis. Which equation is consistent?`,
          ...buildOptions(
            `y = −${a}(x − ${h})² + ${k}`,
            [
              `y = ${a}(x − ${h})² + ${k} (opens upward, not downward)`,
              `y = −${a}(x + ${h})² + ${k} (sign error on h in vertex form)`,
              `y = −${a}(x − ${h})² − ${k} (vertex below x-axis, contradicts graph)`,
            ]
          ),
        };
      },
    },
 
    // format: table-of-values-to-equation
    {
      id: "G12", gapTag: "q-relational", format: "table-of-values-to-equation",
      generate() {
        const a = pick([1,2]), h = pick([1,2,3]), k = pick([0,1,4]);
        const x1=h-1, x2=h, x3=h+1;
        const y1=a*(x1-h)**2+k, y2=a*(x2-h)**2+k, y3=a*(x3-h)**2+k;
        return {
          text: `A table shows: x = ${x1} → y = ${y1}; x = ${x2} → y = ${y2}; x = ${x3} → y = ${y3}. The minimum value is ${y2}. Which equation fits?`,
          ...buildOptions(
            `y = ${a}(x − ${h})² + ${k}`,
            [
              `y = ${a}x² + ${k} (ignores horizontal shift of vertex to x=${h})`,
              `y = ${a}(x + ${h})² + ${k} (sign error: vertex shifts wrong direction)`,
              `y = −${a}(x − ${h})² + ${k} (parabola opens downward, minimum impossible)`,
            ]
          ),
        };
      },
    },
 
    // format: word-problem-to-symbolic
    {
      id: "G13", gapTag: "q-relational", format: "word-problem-to-symbolic",
      generate() {
        const total = pick([20,24,30,36]);
        return {
          text: `A rectangle has perimeter ${total*2} cm. Its length is x and its width is (${total} − x). Which equation gives the area A in terms of x?`,
          ...buildOptions(
            `A = x(${total} − x) = ${total}x − x²`,
            [
              `A = x + (${total} − x) = ${total} (adds dimensions instead of multiplying)`,
              `A = x² − ${total}x (sign error from incorrect expansion)`,
              `A = 2x + 2(${total} − x) = ${total*2} (writes the perimeter formula again)`,
            ]
          ),
        };
      },
    },
 
    // format: factored-form-to-vertex
    {
      id: "G14", gapTag: "q-relational", format: "factored-form-to-vertex",
      generate() {
        const r1 = pick([1,2,3,4]), r2 = r1 + pick([2,4,6]);
        const h = (r1+r2)/2, k = -(((r2-r1)/2)**2);
        return {
          text: `Given y = (x − ${r1})(x − ${r2}), what is the vertex?`,
          ...buildOptions(
            `(${h}, ${k}) — midpoint of roots gives axis, substitute to find k`,
            [
              `(${r1}, ${r2}) — the roots themselves are the vertex coordinates`,
              `(0, ${r1*r2}) — the y-intercept is the vertex`,
              `(${r1+r2}, 0) — the sum of roots is the x-coordinate of the vertex`,
            ]
          ),
        };
      },
    },
 
    // format: standard-form-to-axis-of-symmetry
    {
      id: "G15", gapTag: "q-relational", format: "standard-form-to-axis-of-symmetry",
      generate() {
        const a = pick([1,2,3]), b = pick([2,4,6,8]), c = pick([1,2,3,4]);
        const axis = -b/(2*a);
        return {
          text: `For y = ${a}x² ${display(-b)}x + ${c}, which value is the axis of symmetry?`,
          ...buildOptions(
            `x = ${axis}  (from x = −b/2a = ${-b}/${2*a})`,
            [
              `x = ${b/(2*a)} (sign error: used +b instead of −b in formula)`,
              `x = ${-b/a} (forgot to divide by 2 in denominator)`,
              `x = ${c} (confused the constant term with the axis of symmetry)`,
            ]
          ),
        };
      },
    },
 
    // format: roots-to-sum-and-product
    {
      id: "G16", gapTag: "q-relational", format: "roots-to-sum-and-product",
      generate() {
        const p = pick([2,3,4,5]), q = pick([2,3,4,6,8]);
        return {
          text: `For the equation 2x² − ${p}x + ${q} = 0 (a=2), what are the sum and product of the roots WITHOUT solving?`,
          ...buildOptions(
            `Sum = ${p}/2, Product = ${q}/2  (Vieta: −b/a and c/a)`,
            [
              `Sum = ${p}, Product = ${q} (forgot to divide by a=2)`,
              `Sum = −${p}/2, Product = ${q}/2 (wrong sign on sum)`,
              `Sum = ${p}/2, Product = −${q}/2 (wrong sign on product)`,
            ]
          ),
        };
      },
    },
 
    // format: vertex-form-to-y-intercept
    {
      id: "G17", gapTag: "q-relational", format: "vertex-form-to-y-intercept",
      generate() {
        const a = pick([1,2,3]), h = pick([1,2,3,4]), k = pick([1,2,3,4]);
        const yInt = a*h*h+k;
        return {
          text: `What is the y-intercept of y = ${a}(x − ${h})² + ${k}?`,
          ...buildOptions(
            `y = ${yInt}  (substitute x = 0: ${a}·${h}² + ${k})`,
            [
              `y = ${k} (confused the vertex y-value with the y-intercept)`,
              `y = ${a*h+k} (used h instead of h² when substituting x=0)`,
              `y = ${a+k} (substituted x=1 instead of x=0)`,
            ]
          ),
        };
      },
    },
 
    // format: completing-square-to-vertex
    {
      id: "G18", gapTag: "q-relational", format: "completing-square-to-vertex",
      generate() {
        const b = pick([2,4,6,8]), c = pick([1,2,3,5]);
        const h = b/2, k = c-h*h;
        return {
          text: `A student rewrites x² + ${b}x + ${c} by completing the square. Which vertex form and vertex are correct?`,
          ...buildOptions(
            `y = (x + ${h})² + (${k}); vertex (−${h}, ${k})`,
            [
              `y = (x + ${h})² + ${c}; vertex (−${h}, ${c}) (forgot to subtract (b/2)² from c)`,
              `y = (x − ${h})² + (${k}); vertex (${h}, ${k}) (sign error on h)`,
              `y = (x + ${b})² + (${k}); vertex (−${b}, ${k}) (used b instead of b/2)`,
            ]
          ),
        };
      },
    },
 
    // format: discriminant-to-graph-description
    {
      id: "G19", gapTag: "q-relational", format: "discriminant-to-graph-description",
      generate() {
        const type = pick(["positive","zero","negative"]);
        const descriptions = {
          positive: { disc:"positive (e.g., 25)", correct:"The parabola crosses the x-axis at two distinct points", wrong:["The parabola touches the x-axis at exactly one point (that's discriminant = 0)","The parabola does not cross the x-axis at all (that's discriminant < 0)","The parabola has its vertex on the x-axis"] },
          zero:     { disc:"zero", correct:"The parabola is tangent to the x-axis — one repeated root", wrong:["The parabola crosses the x-axis at two symmetric points (needs positive discriminant)","The parabola has no real x-intercepts","The vertex is above the x-axis (vertex is ON the x-axis when discriminant = 0)"] },
          negative: { disc:"negative (e.g., −7)", correct:"The parabola does not intersect the x-axis — no real roots", wrong:["The parabola intersects the x-axis once, at the vertex","The parabola opens downward (direction depends on a, not the discriminant)","The parabola crosses the x-axis at two imaginary points visible on the graph"] },
        };
        const d = descriptions[type];
        return {
          text: `The discriminant of a quadratic is ${d.disc}. Which graphical description is correct?`,
          ...buildOptions(d.correct, d.wrong),
        };
      },
    },
 
    // format: standard-form-to-vertex-form-translation
    {
      id: "G20", gapTag: "q-relational", format: "standard-form-to-vertex-form-translation",
      generate() {
        const a = pick([1,2]), h = pick([1,2,3]), k = pick([-4,-3,-1,1,2,3]);
        const expandedB = -2*a*h, expandedC = a*h*h+k;
        return {
          text: `Which vertex form correctly represents y = ${a}x² ${display(expandedB)}x + ${expandedC}?`,
          ...buildOptions(
            `y = ${a}(x ${display(-h)})² + ${k}`,
            [
              `y = ${a}(x ${display(h)})² + ${k} (sign error: vertex shifts opposite direction)`,
              `y = ${a}(x ${display(-h)})² + ${expandedC} (used original c instead of completing the square properly)`,
              `y = (x ${display(-h)})² + ${k} (dropped the leading coefficient ${a})`,
            ]
          ),
        };
      },
    },

  ],
};

/* ═══════════════════════════════════════════════════════════
   generatePracticeSession
═══════════════════════════════════════════════════════════ */

const deriveStage = (format = "") => {
  const f = format.toLowerCase();
  if (f.includes("identify")||f.includes("recognize")||f.includes("classify")||f.includes("name")||f.includes("which")||f.includes("is-")||f.includes("true-false")||f.includes("evaluate")||f.includes("interpret")) return "recognition";
  if (f.includes("isolat")||f.includes("describe")||f.includes("compare")||f.includes("signal")||f.includes("count")||f.includes("missing")||f.includes("detect")) return "isolation";
  if (f.includes("transfer")||f.includes("graph")||f.includes("word")||f.includes("context")||f.includes("non-standard")||f.includes("geometric")||f.includes("symbolic")||f.includes("equation-from")||f.includes("rearrange")||f.includes("disguised")||f.includes("roots-to")||f.includes("d-to")||f.includes("vertex")||f.includes("relational")   || f.includes("table") 
   || f.includes("standard-form-to")
   || f.includes("completing")
   || f.includes("factored-form")
   || f.includes("vertex-form")
   || f.includes("roots-to")||f.includes("table")||f.includes("standard-form-to")||f.includes("completing")||f.includes("factored-form")) return "transfer";
  return "application";
};

const STAGE_SLOTS = [
  { stage: "recognition",  min: 2 },
  { stage: "isolation",    min: 2 },
  { stage: "application",  min: 3 },
  { stage: "transfer",     min: 1 },
];

export const generatePracticeSession = (topicId, count = 10, gapTag = null) => {
  const allTemplates = questionTemplates[topicId] || [];
  const pool = gapTag ? allTemplates.filter(t => t.gapTag === gapTag) : allTemplates;
  if (!pool.length) return [];

  if (!gapTag) {
    const shuffled = shuffle([...pool]);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    return selected.map(t => ({
      id:       `${topicId}_${t.id}_${Date.now()}_${Math.floor(Math.random()*9999)}`,
      gapTag:   t.gapTag,
      stage:    deriveStage(t.format),
      category: t.gapTag.replace("q-","").replace(/-/g," "),
      ...t.generate(),
    }));
  }

  const byStage = { recognition:[], isolation:[], application:[], transfer:[] };
  pool.forEach(t => { const stage=deriveStage(t.format); byStage[stage].push(t); });
  Object.keys(byStage).forEach(s => { byStage[s]=shuffle(byStage[s]); });

  const FALLBACK = ["recognition","isolation","application","transfer"];
  const pickWithFallback = (preferredStage, needed) => {
    const picked = [];
    const preferred = [...byStage[preferredStage]];
    picked.push(...preferred.splice(0, needed));
    byStage[preferredStage] = preferred;
    if (picked.length < needed) {
      for (const fallback of FALLBACK) {
        if (picked.length >= needed) break;
        if (fallback === preferredStage) continue;
        const fb = [...byStage[fallback]];
        const take = Math.min(needed-picked.length, fb.length);
        picked.push(...fb.splice(0, take));
        byStage[fallback] = fb;
      }
    }
    return picked;
  };

  const selected = [];
  STAGE_SLOTS.forEach(({ stage, min }) => { selected.push(...pickWithFallback(stage, min)); });

  return selected.map(t => ({
    id:       `${topicId}_${t.id}_${Date.now()}_${Math.floor(Math.random()*9999)}`,
    gapTag:   t.gapTag,
    stage:    deriveStage(t.format),
    category: t.gapTag.replace("q-","").replace(/-/g," "),
    ...t.generate(),
  }));
};

// All 7 gap tags now active in diagnostic sessions
 
const V1_GAP_TAGS = [
  "q-discriminant",
  "q-double-root",
  "q-div-by-var",
  "q-factoring",
  "q-vieta",
  "q-adaptive",
  "q-relational",
];

export const buildDiagnosticSession = (topicId) => {
  const allTemplates = questionTemplates[topicId] || [];
  if (!allTemplates.length) return [];

  const byGap = {};
  allTemplates.forEach(t => {
    if (!V1_GAP_TAGS.includes(t.gapTag)) return;
    if (!byGap[t.gapTag]) byGap[t.gapTag] = [];
    byGap[t.gapTag].push(t);
  });

  const dayIndex  = Math.floor(Date.now() / 86400000);
  const WINDOW    = 4;
  const usedFormats = new Set();
  const pool      = [];

  V1_GAP_TAGS.forEach(gapTag => {
    const templates = byGap[gapTag] || [];
    if (!templates.length) return;

    const sorted     = [...templates].sort((a,b) => a.id.localeCompare(b.id));
    const numWindows = Math.floor(sorted.length / WINDOW);
    const windowIdx  = dayIndex % numWindows;
    const window4    = sorted.slice(windowIdx*WINDOW, windowIdx*WINDOW+WINDOW);

    const picked = [];
    for (const t of window4) {
      if (picked.length >= 4) break;
      if (usedFormats.has(t.format)) continue;
      usedFormats.add(t.format);
      picked.push(t);
    }
    for (const t of window4) {
      if (picked.length >= 4) break;
      if (picked.includes(t)) continue;
      picked.push(t);
    }

    picked.forEach(t => {
      const q = t.generate();
      pool.push({
        ...q,
        id:         `${topicId}_${t.id}_${Date.now()}_${Math.floor(Math.random()*9999)}`,
        templateId: t.id,
        topicId,
        gapTag,
      });
    });
  });

  return shuffle(pool);
};