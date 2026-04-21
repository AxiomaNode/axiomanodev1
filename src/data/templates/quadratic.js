/**
 * quadratic.js — src/data/templates/quadratic.js
 *
 * All quadratic equation templates.
 * A–E: diagnostic + practice (100 templates, 5 gap types × 20)
 * F:   practice only — q-adaptive (20 templates)
 * G:   practice only — q-relational (20 templates)
 *
 * Flags:
 *   diagnostic: true  — appears in diagnostic sessions
 *   practice: true    — appears in practice sessions
 *   mastery: true     — appears in mastery sessions (separate pool, TBD)
 */

import { pick, buildOptions, fmt, display } from "./templateUtils";

export const quadraticTemplates = [

  /* ═══════════════════════════════════════════
     A-SERIES · q-discriminant
  ═══════════════════════════════════════════ */

  { id: "A1", gapTag: "q-discriminant", format: "identify-no-solution", diagnostic: true, practice: true,
    generate() {
      const sq = pick([2,3,4,5]), k = sq*sq;
      return { text: "Which equation has no solutions in ℝ?", ...buildOptions(fmt(1,0,k),[fmt(1,0,-k),fmt(1,-2*sq,k),fmt(1,-(sq+1),sq)]) };
    },
  },
  { id: "A2", gapTag: "q-discriminant", format: "interpret-d-zero", diagnostic: true, practice: true,
    generate() {
      const sq = pick([2,3,4,5,6,7]);
      return { text: `For ${fmt(1,-2*sq,sq*sq)}, D = 0. Choose the correct statement.`, ...buildOptions("Exactly one value of x satisfies it",["Exactly two different values of x satisfy it","No values of x satisfy it","Every x satisfies it"]) };
    },
  },
  { id: "A3", gapTag: "q-discriminant", format: "interpret-d-negative", diagnostic: true, practice: true,
    generate() {
      const triples = [[1,0,1],[1,0,2],[1,1,1],[1,2,2],[1,2,3],[1,3,3],[1,3,4],[1,4,5],[2,1,1],[2,2,2],[2,3,3],[3,1,1]];
      const [a,b,c] = pick(triples);
      return { text: `${fmt(a,b,c)} has D < 0. Best conclusion?`, ...buildOptions("No solutions in ℝ",["Two different solutions in ℝ","One solution in ℝ","Infinitely many solutions"]) };
    },
  },
  { id: "A4", gapTag: "q-discriminant", format: "given-computed-d", diagnostic: true, practice: true,
    generate() {
      const triples = [[1,0,1],[1,0,2],[1,1,1],[1,2,2],[1,2,3],[1,3,3],[1,3,4],[1,4,5],[2,1,1],[2,2,2],[3,1,1]];
      const [a,b,c] = pick(triples);
      const D = b*b-4*a*c;
      return { text: `For ${fmt(a,b,c)}, D = ${D}. Choose the correct statement.`, ...buildOptions("No solutions in ℝ",["Two different solutions in ℝ","One solution in ℝ","Two solutions in ℝ, both negative"]) };
    },
  },
  { id: "A5", gapTag: "q-discriminant", format: "sign-vs-count-confusion", diagnostic: true, practice: true,
    generate() {
      const r1=pick([2,3,4,5]), r2=pick([-2,-3,-4,-5]);
      const s=r1+r2, p=r1*r2, b=-s, c=p, D=b*b-4*c;
      return { text: `For ${fmt(1,b,c)}, D = ${D}. A student says "D > 0 so both roots are positive." Evaluate.`, ...buildOptions("Incorrect — D > 0 shows two real roots exist, not their signs",["Correct — D > 0 guarantees both roots are positive","Partially correct — at least one root is positive","Incorrect — D > 0 means both roots are negative"]) };
    },
  },
  { id: "A6", gapTag: "q-discriminant", format: "identify-d-zero", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6,7]);
      return { text: "Which equation has D = 0?", ...buildOptions(fmt(1,-2*r,r*r),[fmt(1,0,-(r*r)),fmt(1,0,r*r),fmt(1,-(r+1),r)]) };
    },
  },
  { id: "A7", gapTag: "q-discriminant", format: "compute-d", diagnostic: true, practice: true,
    generate() {
      const b=pick([2,3,4,5,6]), c=pick([1,2,3]);
      const correct=b*b-4*c, w1=b*b+4*c, w2=b*b-2*c, w3=2*b-4*c;
      const wrongs = new Set([correct,w1,w2,w3]).size>=4 ? [String(w1),String(w2),String(w3)] : [String(w1),String(w2+1),String(w3+2)];
      return { text: `Compute D for ${fmt(1,b,c)}.`, ...buildOptions(String(correct),wrongs) };
    },
  },
  { id: "A8", gapTag: "q-discriminant", format: "d-to-intercepts", diagnostic: true, practice: true,
    generate() {
      const scenario=pick([{D:pick([-1,-3,-5,-7,-12]),intercepts:"0",wrong:["1","2","3"]},{D:0,intercepts:"1",wrong:["0","2","3"]},{D:pick([1,4,9,16,25]),intercepts:"2",wrong:["0","1","3"]}]);
      return { text: `A parabola y = ax² + bx + c has D = ${scenario.D}. How many x-intercepts does it have?`, ...buildOptions(scenario.intercepts,scenario.wrong) };
    },
  },
  { id: "A9", gapTag: "q-discriminant", format: "algebraic-d-bound", diagnostic: true, practice: true,
    generate() {
      return { text: "For ax² + bx + c = 0, you know a > 0 and c < 0. What can be concluded about D?", ...buildOptions("D > 0 for any value of b",["D may be positive or negative depending on b","D < 0 for any value of b","D = 0 for any value of b"]) };
    },
  },
  { id: "A10", gapTag: "q-discriminant", format: "solution-set-from-equation", diagnostic: true, practice: true,
    generate() {
      const a=pick([1,2,3]), c=pick([1,2,3,4,5]);
      return { text: `${fmt(a,0,c)}. What is the solution set in ℝ?`, ...buildOptions("Empty — no real solutions",[`{0, ${(c/a).toFixed(1)}}`,`{0}`,`{−${c}, ${c}}`]) };
    },
  },
  { id: "A11", gapTag: "q-discriminant", format: "perfect-square-d-type", diagnostic: true, practice: true,
    generate() {
      const r1=pick([1,2,3,4,5]), r2=pick([1,2,3,4,5].filter(v=>v!==r1));
      const s=r1+r2, p=r1*r2, b=-s, c=p, D=b*b-4*c;
      return { text: `For ${fmt(1,b,c)}, D = ${D}. What type of solutions does the equation have?`, ...buildOptions("Two distinct rational solutions",["Two distinct irrational solutions","One rational solution (repeated)","No real solutions"]) };
    },
  },
  { id: "A12", gapTag: "q-discriminant", format: "evaluate-wrong-conclusion", diagnostic: true, practice: true,
    generate() {
      const triples=[[1,0,1],[1,1,1],[1,2,2],[1,2,3],[1,3,4],[2,1,1]];
      const [a,b,c]=pick(triples), D=b*b-4*a*c;
      return { text: `${fmt(a,b,c)} has D = ${D}. A student writes "D < 0 means both roots are negative." Best response?`, ...buildOptions("Incorrect — D < 0 means no real roots exist",["Correct — a negative discriminant means negative roots","Partially correct — one root is negative","Correct — apply the formula with the negative D directly"]) };
    },
  },
  { id: "A13", gapTag: "q-discriminant", format: "find-parameter-for-d", diagnostic: true, practice: true,
    generate() {
      const a=pick([1,2]), k=pick([1,4,9,16,25]);
      const b=2*Math.sqrt(a*k), bInt=Math.round(b);
      return { text: `For ${a>1?`${a}x²`:"x²"} + bx + ${k} = 0 to have exactly one solution, what must b equal?`, ...buildOptions(`b = ${bInt} or b = −${bInt}`,[`b = ${bInt}`,`b = ${k}`,`b = ${2*k}`]) };
    },
  },
  { id: "A14", gapTag: "q-discriminant", format: "geometric-to-d", diagnostic: true, practice: true,
    generate() {
      const scenario=pick([{desc:"opens upward and vertex is below the x-axis",d:"D > 0",wrong:["D = 0","D < 0","Cannot determine D"]},{desc:"opens upward and vertex is above the x-axis",d:"D < 0",wrong:["D = 0","D > 0","Cannot determine D"]},{desc:"opens upward and vertex is on the x-axis",d:"D = 0",wrong:["D > 0","D < 0","Cannot determine D"]}]);
      return { text: `A parabola ${scenario.desc}. What must be true about D?`, ...buildOptions(scenario.d,scenario.wrong) };
    },
  },
  { id: "A15", gapTag: "q-discriminant", format: "correct-d-wrong-conclusion", diagnostic: true, practice: true,
    generate() {
      const sq=pick([2,3,4,5]);
      return { text: `A student computes D = 0 for ${fmt(1,-2*sq,sq*sq)} and writes "no solutions." Evaluate.`, ...buildOptions("Incorrect — D = 0 means exactly one solution",["Correct — D = 0 means no real solutions","Partially correct — D = 0 means one negative solution","Correct — only complex solutions exist"]) };
    },
  },
  { id: "A16", gapTag: "q-discriminant", format: "logical-negation", diagnostic: true, practice: true,
    generate() {
      return { text: "Which is NOT a valid conclusion when D < 0?", ...buildOptions("The equation has two negative solutions",["The equation has no real solutions","The parabola does not cross the x-axis","√D is not a real number"]) };
    },
  },
  { id: "A17", gapTag: "q-discriminant", format: "compare-equations", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]);
      return { text: `Compare (1) ${fmt(1,0,r*r)} and (2) ${fmt(1,0,-(r*r))}. Which has more real solutions?`, ...buildOptions("(2) has more",["(1) has more","They have the same number","Both have no real solutions"]) };
    },
  },
  { id: "A18", gapTag: "q-discriminant", format: "converse-d", diagnostic: true, practice: true,
    generate() {
      return { text: "A quadratic equation has two distinct real solutions. What must be true about D?", ...buildOptions("D > 0",["D = 0","D < 0","D ≥ 0"]) };
    },
  },
  { id: "A19", gapTag: "q-discriminant", format: "boundary-case", diagnostic: true, practice: true,
    generate() {
      const k=pick([1,4,9,16]);
      return { text: `For x² + ${2*Math.sqrt(k)}x + ${k} = 0, D = 0. What is the solution?`, ...buildOptions(`x = −${Math.sqrt(k)} (one repeated root)`,[`x = ${Math.sqrt(k)} and x = −${Math.sqrt(k)}`,`No real solution`,`x = ${k}`]) };
    },
  },
  { id: "A20", gapTag: "q-discriminant", format: "false-statement", diagnostic: true, practice: true,
    generate() {
      return { text: "Which of these statements about the discriminant is FALSE?", ...buildOptions("D > 0 means both roots are positive",["D < 0 means no real roots","D = 0 means exactly one repeated root","D = b² − 4ac for ax² + bx + c = 0"]) };
    },
  },

  /* ═══════════════════════════════════════════
     B-SERIES · q-double-root
  ═══════════════════════════════════════════ */

  { id: "B1", gapTag: "q-double-root", format: "evaluate-one-root-claim", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6,7]), k=r*r;
      return { text: `A student claims: "x² = ${k} has only x = ${r}." Best correction?`, ...buildOptions("The solution set has two elements",["The solution set has one element","The equation is inconsistent","The equation has infinitely many solutions"]) };
    },
  },
  { id: "B2", gapTag: "q-double-root", format: "compare-solution-counts", diagnostic: true, practice: true,
    generate() {
      const r=pick([3,4,5,6,7]), k=r*r;
      return { text: `Compare: (1) ${fmt(1,0,-k)} and (2) ${fmt(1,-2*r,k)}. How many real solutions each?`, ...buildOptions("2 then 1",["2 then 2","1 then 1","1 then 2"]) };
    },
  },
  { id: "B3", gapTag: "q-double-root", format: "count-missing-elements", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6,7]), k=r*r;
      return { text: `A student writes only x = ${r} for x² = ${k}. How many elements are in the correct solution set?`, ...buildOptions("2",["0","1","Infinitely many"]) };
    },
  },
  { id: "B4", gapTag: "q-double-root", format: "describe-solution-set", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6,7,8]), sign=Math.random()>0.5?"−":"+";
      return { text: `(x ${sign} ${r})² = 0. Correct description of the solution set in ℝ?`, ...buildOptions("It contains exactly one element",["It contains exactly two different elements","It contains no elements","It contains infinitely many elements"]) };
    },
  },
  { id: "B5", gapTag: "q-double-root", format: "identify-missing-value", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6,7]), k=r*r;
      return { text: `A student solves x² = ${k} and writes "x = ${r}". Which element of the complete solution set is missing?`, ...buildOptions(`x = −${r}`,["x = 0",`x = ${k}`,`x = ${r*r}`]) };
    },
  },
  { id: "B6", gapTag: "q-double-root", format: "calculator-completeness", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,5,6,7,8,10,11]), approx=Math.sqrt(k).toFixed(2);
      return { text: `x² = ${k}. A student uses a calculator and finds x ≈ ${approx}. Is this the complete solution?`, ...buildOptions(`No — x ≈ −${approx} is also a solution`,["Yes — the calculator gives the complete answer","No — x = 0 is also a solution",`No — x = −${k} is also a solution`]) };
    },
  },
  { id: "B7", gapTag: "q-double-root", format: "shifted-form-count", diagnostic: true, practice: true,
    generate() {
      const a=pick([1,2,3,4,5]), b=pick([1,4,9,16,25]);
      return { text: `(x − ${a})² = ${b}. How many real solutions does this equation have?`, ...buildOptions("2",["1","0","Depends on the value of a"]) };
    },
  },
  { id: "B8", gapTag: "q-double-root", format: "zero-edge-case", diagnostic: true, practice: true,
    generate() {
      return { text: "x² = 0. How many elements are in the solution set?", ...buildOptions("1",["2","0","Infinitely many"]) };
    },
  },
  { id: "B9", gapTag: "q-double-root", format: "identify-missing-root", diagnostic: true, practice: true,
    generate() {
      const a=pick([1,2,3,4]), sqb=pick([1,2,3,4]), b=sqb*sqb;
      return { text: `(x − ${a})² = ${b}. A student writes only x = ${a+sqb}. What's missing?`, ...buildOptions(`x = ${a-sqb}`,["x = 0",`x = −${a+sqb}`,`x = ${a*sqb}`]) };
    },
  },
  { id: "B10", gapTag: "q-double-root", format: "explain-incompleteness", diagnostic: true, practice: true,
    generate() {
      const r=pick([3,4,5,6,7]);
      return { text: `x² − ${r*r} = 0. A student factors and writes only x = ${r}. Why is this incomplete?`, ...buildOptions(`The factor (x + ${r}) also gives x = −${r}`,["The equation also has x = 0 as a solution","The equation has no real solutions",`The factorization (x − ${r})(x + ${r}) is wrong`]) };
    },
  },
  { id: "B11", gapTag: "q-double-root", format: "wrong-root-value", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]), k=r*r;
      return { text: `x² = ${k}. A student writes "x = ±${k}". Evaluate this answer.`, ...buildOptions(`Incorrect — solutions are x = ±${r}`,["Correct","Partially correct — x = "+k+" is right","Incorrect — only solution is x = "+r]) };
    },
  },
  { id: "B12", gapTag: "q-double-root", format: "negative-k-trap", diagnostic: true, practice: true,
    generate() {
      const r=pick([1,2,3,4,5]), k=r*r;
      return { text: `x² = −${k}. A student writes x = ±${r}. Evaluate.`, ...buildOptions(`Incorrect — no real solutions exist`,["Correct","Partially correct — x = "+r+" works","Incorrect — solution is x = "+k]) };
    },
  },
  { id: "B13", gapTag: "q-double-root", format: "geometric-root-count", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]);
      return { text: `A parabola y = x² − ${r*r} crosses the x-axis. How many x-values satisfy x² = ${r*r}?`, ...buildOptions("2",["1","0","Depends on the parabola"]) };
    },
  },
  { id: "B14", gapTag: "q-double-root", format: "name-all-solutions", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6]);
      return { text: `If x = ${r} is a solution to x² = ${r*r}, name ALL solutions.`, ...buildOptions(`x = ${r} and x = −${r}`,[`x = ${r} only`,`x = 0 and x = ${r}`,`x = ±${r*r}`]) };
    },
  },
  { id: "B15", gapTag: "q-double-root", format: "true-false-equivalence", diagnostic: true, practice: true,
    generate() {
      const r=pick([3,4,5,6]);
      return { text: `True or false: x² = ${r*r} and (x − ${r})(x + ${r}) = 0 have the same solution set.`, ...buildOptions("True",["False — first has one solution, second has two","False — different solution sets","True — but only for positive x"]) };
    },
  },
  { id: "B16", gapTag: "q-double-root", format: "identify-equation-with-two", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4]);
      return { text: "Which equation has exactly 2 real solutions?", ...buildOptions(`x² = ${r*r}`,[`x² = −${r*r}`,"x² = 0",`(x − ${r})² = 0`]) };
    },
  },
  { id: "B17", gapTag: "q-double-root", format: "reverse-from-set", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]);
      return { text: `x² = k has solution set {−${r}, ${r}}. What is k?`, ...buildOptions(String(r*r),[String(r),String(2*r),String(r*r*2)]) };
    },
  },
  { id: "B18", gapTag: "q-double-root", format: "evaluate-shifted-claim", diagnostic: true, practice: true,
    generate() {
      const a=pick([1,2,3,4]), sqb=pick([2,3,4]), b=sqb*sqb;
      return { text: `(x − ${a})² = ${b}. A student says "there is only one solution: x = ${a+sqb}." Evaluate.`, ...buildOptions(`Incorrect — x = ${a-sqb} is also a solution`,["Correct","Incorrect — no real solutions","Correct — only positive root applies"]) };
    },
  },
  { id: "B19", gapTag: "q-double-root", format: "higher-power", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4]);
      return { text: `x⁴ = ${r*r*r*r}. A student writes only x = ${r}. How many solutions are missing from the complete real solution set?`, ...buildOptions("1",["0","2","3"]) };
    },
  },
  { id: "B20", gapTag: "q-double-root", format: "false-rule", diagnostic: true, practice: true,
    generate() {
      return { text: "Which statement about x² = k is FALSE?", ...buildOptions("If k > 0, the only solution is x = √k",["If k = 0, the only solution is x = 0","If k < 0, there are no real solutions","If k > 0, the solutions are x = √k and x = −√k"]) };
    },
  },

  /* ═══════════════════════════════════════════
     C-SERIES · q-div-by-var
  ═══════════════════════════════════════════ */

  { id: "C1", gapTag: "q-div-by-var", format: "evaluate-division", diagnostic: true, practice: true,
    generate() {
      const a=pick([2,3,4,5]), k=pick([2,3,4,5]), b=a*k;
      return { text: `${a}x² − ${b}x = 0. A student divides by x and concludes x = ${k}. Most accurate evaluation?`, ...buildOptions("Correct but incomplete",["Correct and complete","Incorrect","Cannot be determined"]) };
    },
  },
  { id: "C2", gapTag: "q-div-by-var", format: "choose-solution-set", diagnostic: true, practice: true,
    generate() {
      const a=pick([2,3,4,5]), k=pick([2,3,4,5]), b=a*k;
      return { text: `${a}x² = ${b}x. Choose the correct solution set in ℝ.`, ...buildOptions(`{0, ${k}}`,[`{${k}}`,`{0}`,`{−${k}, ${k}}`]) };
    },
  },
  { id: "C3", gapTag: "q-div-by-var", format: "choose-valid-method", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,4,5,6]);
      return { text: `x² = ${k}x. Choose the method that preserves equivalence for all x.`, ...buildOptions(`Rewrite as x² − ${k}x = 0 and factor`,["Divide both sides by x","Take square roots of both sides",`Move ${k}x left, then cancel x`]) };
    },
  },
  { id: "C4", gapTag: "q-div-by-var", format: "count-missing-after-division", diagnostic: true, practice: true,
    generate() {
      return { text: "x³ = x². A student divides by x² and gets x = 1. Choose the best statement.", ...buildOptions("The final set is missing exactly one value",["The final set is complete","The final set is missing two values","The equation has no solutions"]) };
    },
  },
  { id: "C5", gapTag: "q-div-by-var", format: "evaluate-cancel", diagnostic: true, practice: true,
    generate() {
      const a=pick([2,3,4]), k=pick([2,3,4,5,6]);
      return { text: `${a}x(x − ${k}) = 0. A student cancels x and writes x = ${k}. Evaluate.`, ...buildOptions(`Incomplete — x = 0 is also a solution`,[`Complete — x = ${k} only`,`Incorrect — x = −${k} is correct`,`Incorrect — dividing by x requires a sign check`]) };
    },
  },
  { id: "C6", gapTag: "q-div-by-var", format: "evaluate-correct-factoring", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,4,5,6,7]);
      return { text: `x² + ${k}x = 0. A student factors as x(x + ${k}) = 0 and writes {0, −${k}}. Evaluate.`, ...buildOptions("Complete and correct",[`Incomplete — also need x = ${k}`,`Incorrect — should be {0, ${k}}`,`Incorrect — should divide by x`]) };
    },
  },
  { id: "C7", gapTag: "q-div-by-var", format: "shifted-division-trap", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,4,5]), m=pick([1,2,3]);
      return { text: `x(x − ${k}) = ${m}x. A student divides by x and gets x = ${k+m}. Evaluate.`, ...buildOptions(`Incomplete — x = 0 is also a solution`,[`Complete — x = ${k+m} only`,`Incorrect — x = ${k} is the answer`,`Incorrect — division changes the equation`]) };
    },
  },
  { id: "C8", gapTag: "q-div-by-var", format: "identify-invalid-step", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,4,5,6]);
      return { text: `Solving ${k}x² = ${k*2}x. Which step is NOT valid?`, ...buildOptions("Divide both sides by x",[`Divide both sides by ${k}`,`Move all terms left: ${k}x² − ${k*2}x = 0`,`Factor out ${k}x`]) };
    },
  },
  { id: "C9", gapTag: "q-div-by-var", format: "simple-x-squared-equals-x", diagnostic: true, practice: true,
    generate() {
      return { text: "x² = x. A student divides by x and gets x = 1. Evaluate.", ...buildOptions("Incomplete — x = 0 is also a solution",["Complete — x = 1 is the only solution","Incorrect — x = −1 is the solution","Incorrect — dividing by x is never valid"]) };
    },
  },
  { id: "C10", gapTag: "q-div-by-var", format: "cubic-solution-set", diagnostic: true, practice: true,
    generate() {
      const k=pick([1,2,3,4,5]), kSq=k*k;
      return { text: `x³ − ${kSq}x = 0. Choose the correct solution set.`, ...buildOptions(`{−${k}, 0, ${k}}`,[`{0, ${k}}`,`{−${k}, ${k}}`,`{0, −${k}}`]) };
    },
  },
  { id: "C11", gapTag: "q-div-by-var", format: "count-missing-solutions", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,4,5,6]);
      return { text: `x² − ${k}x = 0. A student divides by x and writes x = ${k}. How many solutions are missing?`, ...buildOptions("1",["0","2","3"]) };
    },
  },
  { id: "C12", gapTag: "q-div-by-var", format: "explain-danger", diagnostic: true, practice: true,
    generate() {
      const a=pick([2,3,4]), c=pick([2,3,4,6,8]);
      return { text: `${a}x² = ${c}x. A student says "we can divide by x here." What is the danger?`, ...buildOptions("Dividing by x loses the solution x = 0",["Dividing by x changes the degree permanently",`Dividing by x is valid only if a > c`,"Dividing by x is always valid for quadratics"]) };
    },
  },
  { id: "C13", gapTag: "q-div-by-var", format: "identify-lost-solution", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,4,5]);
      return { text: `After solving x² = ${k}x by dividing by x, a student gets x = ${k}. Which specific value was lost?`, ...buildOptions("x = 0",[`x = −${k}`,`x = ${k*2}`,"x = 1"]) };
    },
  },
  { id: "C14", gapTag: "q-div-by-var", format: "which-equation-safest", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,4,5]);
      return { text: `Which equation is equivalent to x² = ${k}x for ALL values of x?`, ...buildOptions(`x² − ${k}x = 0`,[`x = ${k}`,`x(x − ${k}) = 0 with x ≠ 0`,"x = 0"]) };
    },
  },
  { id: "C15", gapTag: "q-div-by-var", format: "true-false-zero-solution", diagnostic: true, practice: true,
    generate() {
      const a=pick([2,3,4]), b=pick([2,3,4,6]);
      return { text: `True or false: ${a}x² + ${b}x = 0 always has x = 0 as a solution.`, ...buildOptions("True",["False — x = 0 only works if a = b","False — x = 0 makes the equation undefined","True — but only if a and b are positive"]) };
    },
  },
  { id: "C16", gapTag: "q-div-by-var", format: "higher-power-division", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,4]);
      return { text: `x⁴ = ${k}x². A student divides by x² and gets x² = ${k}. How many solutions does the full equation have?`, ...buildOptions("3",["2","1","4"]) };
    },
  },
  { id: "C17", gapTag: "q-div-by-var", format: "correct-method-outcome", diagnostic: true, practice: true,
    generate() {
      const k=pick([3,4,5,6,7]);
      return { text: `x² − ${k}x = 0 is factored as x(x − ${k}) = 0. What are ALL solutions?`, ...buildOptions(`x = 0 and x = ${k}`,[`x = ${k} only`,"x = 0 only",`x = −${k} and x = ${k}`]) };
    },
  },
  { id: "C18", gapTag: "q-div-by-var", format: "fix-the-error", diagnostic: true, practice: true,
    generate() {
      const k=pick([2,3,4,5]);
      return { text: `A student writes: "x² = ${k}x → divide by x → x = ${k}." How should this be corrected?`, ...buildOptions(`Factor: x(x − ${k}) = 0, solutions x = 0 and x = ${k}`,["Divide by x is valid — answer is complete","The equation has no solutions","Take square roots: x = ±√"+k]) };
    },
  },
  { id: "C19", gapTag: "q-div-by-var", format: "evaluate-partial-solution", diagnostic: true, practice: true,
    generate() {
      const a=pick([2,3]), k=pick([3,4,5,6]);
      return { text: `${a}x² = ${a*k}x. A student gives {${k}} as the solution set. This set is:`, ...buildOptions("Incomplete — missing x = 0",["Complete and correct",`Incorrect — should be {0}`,`Incorrect — should be {−${k}, ${k}}`]) };
    },
  },
  { id: "C20", gapTag: "q-div-by-var", format: "conceptual-rule", diagnostic: true, practice: true,
    generate() {
      return { text: "Why is it invalid to divide both sides of ax² = bx by x to solve for x?", ...buildOptions("x might equal 0, losing that solution",["x is unknown so division is not allowed","ax² and bx are not like terms","Division changes a quadratic to linear permanently"]) };
    },
  },

  /* ═══════════════════════════════════════════
     D-SERIES · q-factoring
  ═══════════════════════════════════════════ */

  { id: "D1", gapTag: "q-factoring", format: "choose-factorization-psq-neg", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6,7]);
      return { text: `${fmt(1,-2*r,r*r)}. Choose the correct factorization form.`, ...buildOptions(`(x − ${r})² = 0`,[`(x + ${r})² = 0`,`(x − ${r})(x + ${r}) = 0`,`(x − ${r*r})(x − 1) = 0`]) };
    },
  },
  { id: "D2", gapTag: "q-factoring", format: "choose-factorization-diff-sq", diagnostic: true, practice: true,
    generate() {
      const r=pick([3,4,5,6,7,8,9]), k=r*r;
      return { text: `${fmt(1,0,-k)}. Choose the correct factorization form.`, ...buildOptions(`(x − ${r})(x + ${r}) = 0`,[`(x − ${r})² = 0`,`(x + ${r})² = 0`,`x(x − ${k}) = 0`]) };
    },
  },
  { id: "D3", gapTag: "q-factoring", format: "count-solutions-psq-pos", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6,7]);
      return { text: `${fmt(1,2*r,r*r)}. How many different real solutions does it have?`, ...buildOptions("1",["0","2","Infinitely many"]) };
    },
  },
  { id: "D4", gapTag: "q-factoring", format: "evaluate-wrong-rewrite", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6,7]), k=r*r;
      return { text: `A student rewrites ${fmt(1,0,-k)} as (x − ${r})² = 0. Choose the best assessment.`, ...buildOptions("The rewrite changes the set of solutions",["The rewrite is valid and preserves all solutions","The rewrite is valid only for x > 0","The rewrite is valid only for x < 0"]) };
    },
  },
  { id: "D5", gapTag: "q-factoring", format: "wrong-pattern-applied", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6]);
      return { text: `A student sees x² − ${2*r}x + ${r*r} and factors it as (x − ${r})(x + ${r}). Evaluate.`, ...buildOptions(`Incorrect — (x−${r})(x+${r}) = x²−${r*r}, not the original`,["Correct — both factorizations are equivalent","Correct — difference of squares is always valid",`Incorrect — should be (x+${r})(x+${r})`]) };
    },
  },
  { id: "D6", gapTag: "q-factoring", format: "choose-correct-expansion", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6,7]);
      return { text: `Which of these equals (x − ${r})²?`, ...buildOptions(`x² − ${2*r}x + ${r*r}`,[`x² + ${2*r}x + ${r*r}`,`x² − ${r*r}`,`x² − ${2*r}x − ${r*r}`]) };
    },
  },
  { id: "D7", gapTag: "q-factoring", format: "sum-of-squares-factorability", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6]);
      return { text: `Can x² + ${r*r} be factored into linear factors over ℝ?`, ...buildOptions("No — a sum of two squares is irreducible over ℝ",[`Yes — (x − ${r})(x + ${r})`,`Yes — (x + ${r})²`,`Yes — (x − ${r})²`]) };
    },
  },
  { id: "D8", gapTag: "q-factoring", format: "leading-coeff-factorization", diagnostic: true, practice: true,
    generate() {
      const a=pick([2,3]), b=pick([2,3,5]), aSq=a*a, bSq=b*b;
      return { text: `${aSq}x² − ${bSq} = 0. Choose the correct factorization.`, ...buildOptions(`(${a}x − ${b})(${a}x + ${b}) = 0`,[`(${a}x − ${b})² = 0`,`(x − ${b})(x + ${b}) = 0`,`${aSq}(x − ${b})(x + ${b}) = 0`]) };
    },
  },
  { id: "D9", gapTag: "q-factoring", format: "identify-perfect-square", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]);
      return { text: "Which equation is a perfect square trinomial set equal to zero?", ...buildOptions(fmt(1,-2*r,r*r),[fmt(1,0,-(r*r)),fmt(1,-(r+1),r),fmt(1,-2*r,r*r+1)]) };
    },
  },
  { id: "D10", gapTag: "q-factoring", format: "evaluate-two-roots-from-psq", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]);
      return { text: `${fmt(1,2*r,r*r)}. A student writes x = ${r} and x = −${r}. Evaluate.`, ...buildOptions(`Incorrect — (x+${r})²=0 has only one solution: x=−${r}`,["Correct — factoring gives two solutions",`Incorrect — only solution is x=${r}`,"Incorrect — no real solutions"]) };
    },
  },
  { id: "D11", gapTag: "q-factoring", format: "shifted-diff-squares", diagnostic: true, practice: true,
    generate() {
      const a=pick([1,2,3,4]), sqb=pick([2,3,4,5]), b=sqb*sqb;
      const x1=sqb-a, x2=-sqb-a;
      const setStr=`{${Math.min(x1,x2)}, ${Math.max(x1,x2)}}`;
      return { text: `(x + ${a})² − ${b} = 0. Which solution set is correct?`, ...buildOptions(setStr,[`{${Math.max(x1,x2)}}`,`{${a-sqb}, ${a+sqb}}`,`{−${a}, ${a}}`]) };
    },
  },
  { id: "D12", gapTag: "q-factoring", format: "expansion-error-type", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6]);
      return { text: `A student expands (x − ${r})² and writes x² − ${r*r}. What error did they make?`, ...buildOptions(`Treated as difference of squares: (x−${r})(x+${r})`,["Forgot to square "+r,"Sign error — should be x²+"+r*r,"No error"]) };
    },
  },
  { id: "D13", gapTag: "q-factoring", format: "classify-trinomial", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]), isPS=Math.random()>0.5;
      const eq=isPS?fmt(1,2*r,r*r):fmt(1,2*r+1,r*r);
      return { text: `Is ${eq} a perfect square trinomial?`, ...buildOptions(isPS?"Yes — (x+"+r+")²":"No — middle term doesn't match",isPS?["No — constant term is wrong","No — only negative middle terms qualify","Yes — any positive trinomial qualifies"]:["Yes — (x+"+r+")²","Yes — any trinomial is a perfect square","No — no real factors"]) };
    },
  },
  { id: "D14", gapTag: "q-factoring", format: "identify-pattern-name", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]), type=pick(["psq","diff"]);
      if(type==="psq") return { text: `x² − ${2*r}x + ${r*r} = 0. Which algebraic identity applies?`, ...buildOptions("Perfect square trinomial: (a−b)²",["Difference of squares: a²−b²","Sum of squares","Quadratic formula only"]) };
      return { text: `x² − ${r*r} = 0. Which algebraic identity applies?`, ...buildOptions("Difference of squares: a²−b² = (a−b)(a+b)",["Perfect square trinomial: (a−b)²","Sum of squares","Completing the square"]) };
    },
  },
  { id: "D15", gapTag: "q-factoring", format: "count-solutions-general", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]);
      return { text: `How many solutions does (x − ${r})(x + ${r}) = 0 have?`, ...buildOptions("2",["1","0","4"]) };
    },
  },
  { id: "D16", gapTag: "q-factoring", format: "compare-solution-sets", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]);
      return { text: `Do x² − ${2*r}x + ${r*r} = 0 and x² − ${r*r} = 0 have the same solution set?`, ...buildOptions("No — first has {"+r+"}, second has {−"+r+", "+r+"}",["Yes — both equal zero when x="+r,"Yes — they are the same equation","No — neither has real solutions"]) };
    },
  },
  { id: "D17", gapTag: "q-factoring", format: "fill-in-perfect-square", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5,6]);
      return { text: `x² − ${2*r}x + ___ = (x − ${r})². What fills the blank?`, ...buildOptions(String(r*r),[String(r),String(2*r),String(r*r-1)]) };
    },
  },
  { id: "D18", gapTag: "q-factoring", format: "true-false-psq-one-solution", diagnostic: true, practice: true,
    generate() {
      return { text: "True or false: every perfect square trinomial set equal to zero has exactly one real solution.", ...buildOptions("True",["False — it has two solutions","False — depends on the middle term sign","True — but only if leading coefficient is 1"]) };
    },
  },
  { id: "D19", gapTag: "q-factoring", format: "expansion-verify", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]);
      return { text: `A student claims (x + ${r})² = x² + ${r*r}. What's the error?`, ...buildOptions(`Missing middle term — correct is x² + ${2*r}x + ${r*r}`,["Wrong constant — should be x²+"+r,"Sign error — should be x²−"+2*r+"x+"+r*r,"No error"]) };
    },
  },
  { id: "D20", gapTag: "q-factoring", format: "which-pattern-false", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4,5]);
      return { text: "Which statement about factoring patterns is FALSE?", ...buildOptions(`x² + ${r*r} = (x−${r})(x+${r})`,[`x²−${r*r} = (x−${r})(x+${r})`,`x²−${2*r}x+${r*r} = (x−${r})²`,`x²+${2*r}x+${r*r} = (x+${r})²`]) };
    },
  },

  /* ═══════════════════════════════════════════
     E-SERIES · q-vieta
  ═══════════════════════════════════════════ */

  { id: "E1", gapTag: "q-vieta", format: "sum-of-squares-vieta", diagnostic: true, practice: true,
    generate() {
      const go=()=>{const pool=[1,2,3,4,5,6],r1=pick(pool),r2=pick(pool.filter(v=>v!==r1)),s=r1+r2,p=r1*r2,correct=s*s-2*p,w1=s*s,w2=s*s+2*p,w3=p*p;if(new Set([correct,w1,w2,w3]).size<4)return go();return{s,p,correct,w1,w2,w3};};
      const {s,p,correct,w1,w2,w3}=go();
      return { text: `The roots of ${fmt(1,-s,p)} are x₁ and x₂. Find x₁² + x₂² without solving.`, ...buildOptions(String(correct),[String(w1),String(w2),String(w3)]) };
    },
  },
  { id: "E2", gapTag: "q-vieta", format: "find-b-c-from-roots", diagnostic: true, practice: true,
    generate() {
      const r1=pick([2,3,4,5]),r2=pick([-2,-3,-4,-5]),s=r1+r2,p=r1*r2,b=-s,c=p;
      return { text: `A quadratic with roots ${r1} and ${display(r2)} is x² + bx + c = 0. Choose (b, c).`, ...buildOptions(`(${b}, ${c})`,[`(${s}, ${c})`,`(${b}, ${-c})`,`(${s}, ${-c})`]) };
    },
  },
  { id: "E3", gapTag: "q-vieta", format: "find-sum-product", diagnostic: true, practice: true,
    generate() {
      const r1=pick([-5,-4,-3,-2,-1,1,2,3,4,5]),r2=pick([-5,-4,-3,-2,-1,1,2,3,4,5]),sum=r1+r2,prod=r1*r2,b=-sum,c=prod;
      return { text: `For ${fmt(1,b,c)}, choose (x₁ + x₂, x₁·x₂).`, ...buildOptions(`(${display(sum)}, ${prod})`,[`(${display(-sum)}, ${prod})`,`(${display(sum)}, ${-prod})`,`(${display(-sum)}, ${-prod})`]) };
    },
  },
  { id: "E4", gapTag: "q-vieta", format: "identify-equation-from-sum-product", diagnostic: true, practice: true,
    generate() {
      const r1=pick([1,2,3,4]),r2=pick([-1,-2,-3,-4,-5,-6]),S=r1+r2,P=r1*r2;
      return { text: `Two roots have sum ${display(S)} and product ${display(P)}. Which equation matches?`, ...buildOptions(fmt(1,-S,P),[fmt(1,S,P),fmt(1,-S,-P),fmt(1,S,-P)]) };
    },
  },
  { id: "E5", gapTag: "q-vieta", format: "reciprocal-sum", diagnostic: true, practice: true,
    generate() {
      return { text: "For x² + bx + c = 0 with roots x₁ and x₂ (both nonzero), which expression equals 1/x₁ + 1/x₂?", ...buildOptions("−b/c",["b/c","−c/b","c/b"]) };
    },
  },
  { id: "E6", gapTag: "q-vieta", format: "difference-squared-vieta", diagnostic: true, practice: true,
    generate() {
      const r1=pick([1,2,3,4,5]),r2=pick([1,2,3,4,5].filter(v=>v!==r1)),s=r1+r2,p=r1*r2,correct=s*s-4*p,w1=s*s+4*p,w2=s*s-2*p,w3=s*s;
      return { text: `The roots of ${fmt(1,-s,p)} are x₁ and x₂. Find (x₁ − x₂)² without solving.`, ...buildOptions(String(correct),[String(w1),String(w2),String(w3)]) };
    },
  },
  { id: "E7", gapTag: "q-vieta", format: "non-monic-vieta", diagnostic: true, practice: true,
    generate() {
      const a=pick([2,3]),r1=pick([1,2,3]),r2=pick([1,2,3].filter(v=>v!==r1)),s=r1+r2,p=r1*r2,b=-a*s,c=a*p;
      return { text: `${fmt(a,b,c)} has roots x₁ and x₂. A student writes x₁+x₂ = ${-b} and x₁x₂ = ${c}. Evaluate.`, ...buildOptions(`Incorrect — both must be divided by ${a}: sum = ${s}, product = ${p}`,["Correct — Vieta gives sum = −b and product = c","Partially correct — sum is right","Incorrect — sum should be "+b]) };
    },
  },
  { id: "E8", gapTag: "q-vieta", format: "product-sign-implies", diagnostic: true, practice: true,
    generate() {
      const p=pick([-2,-3,-4,-6,-8,-10,-12]);
      return { text: `For a quadratic with x₁·x₂ = ${p}, which statement must be true?`, ...buildOptions("The roots have opposite signs",["Both roots are negative","Both roots are positive","At least one root equals zero"]) };
    },
  },
  { id: "E9", gapTag: "q-vieta", format: "find-second-root", diagnostic: true, practice: true,
    generate() {
      const r1=pick([1,2,3,4,5]),r2=pick([1,2,3,4,5].filter(v=>v!==r1)),s=r1+r2,p=r1*r2;
      return { text: `x² − ${s}x + c = 0 has one root x₁ = ${r1}. Using Vieta, find x₂ and c.`, ...buildOptions(`x₂ = ${r2}, c = ${p}`,[`x₂ = ${s}, c = ${r1*s}`,`x₂ = ${r2}, c = ${-p}`,`x₂ = ${-r2}, c = ${-p}`]) };
    },
  },
  { id: "E10", gapTag: "q-vieta", format: "symmetric-expression", diagnostic: true, practice: true,
    generate() {
      const r1=pick([1,2,3,4]),r2=pick([1,2,3,4,5]),s=r1+r2,p=r1*r2,b=-s,c=p,correct=p+s+1,w1=p+s,w2=p-s+1,w3=(p+1)*(s+1);
      return { text: `For ${fmt(1,b,c)}, the roots are x₁ and x₂. Find (x₁ + 1)(x₂ + 1) without solving.`, ...buildOptions(String(correct),[String(w1),String(w2),String(w3)]) };
    },
  },
  { id: "E11", gapTag: "q-vieta", format: "positive-product-implies", diagnostic: true, practice: true,
    generate() {
      const p=pick([2,3,4,6,8,9,12,15]);
      return { text: `For a quadratic with x₁·x₂ = ${p} > 0, which statement is definitely true?`, ...buildOptions("The roots have the same sign",["Both roots are positive","Both roots are negative","The roots are equal"]) };
    },
  },
  { id: "E12", gapTag: "q-vieta", format: "factored-symmetric", diagnostic: true, practice: true,
    generate() {
      const r1=pick([1,2,3]),r2=pick([1,2,3].filter(v=>v!==r1)),s=r1+r2,p=r1*r2,b=-s,c=p,correct=p*s;
      return { text: `For ${fmt(1,b,c)}, find x₁x₂² + x₁²x₂ without solving.`, ...buildOptions(String(correct),[String(p*s*s),String(s*p*p),String(p+s)]) };
    },
  },
  { id: "E13", gapTag: "q-vieta", format: "sum-sign-implies-b", diagnostic: true, practice: true,
    generate() {
      return { text: "For x² + bx + c = 0, the sum of roots is negative. What does this tell you about b?", ...buildOptions("b > 0",["b < 0","b = 0","Nothing — sum and b are unrelated"]) };
    },
  },
  { id: "E14", gapTag: "q-vieta", format: "zero-root-implies-c", diagnostic: true, practice: true,
    generate() {
      return { text: "For x² + bx + c = 0, one root equals 0. What must be true about c?", ...buildOptions("c = 0",["c > 0","c < 0","c = b"]) };
    },
  },
  { id: "E15", gapTag: "q-vieta", format: "identify-vieta-error", diagnostic: true, practice: true,
    generate() {
      const r1=pick([2,3,4,5]),r2=pick([1,2,3,4]),s=r1+r2,p=r1*r2,b=-s,c=p;
      return { text: `For ${fmt(1,b,c)}, a student writes "sum of roots = ${-b}." Identify the error.`, ...buildOptions(`Sum is −b = ${s}, not b = ${-b}`,["No error — sum equals b","Sum should be "+(b*2),"Use the quadratic formula instead"]) };
    },
  },
  { id: "E16", gapTag: "q-vieta", format: "find-coefficient-from-root", diagnostic: true, practice: true,
    generate() {
      const r1=2,r2=6,cb=12,s=r1+r2;
      return { text: `x² + bx + ${cb} = 0 has one root x = ${r1}. Find b using Vieta.`, ...buildOptions(String(-s),[String(s),String(-r1),String(-cb)]) };
    },
  },
  { id: "E17", gapTag: "q-vieta", format: "true-false-positive-roots", diagnostic: true, practice: true,
    generate() {
      return { text: "True or false: if the product of roots is positive, both roots must be positive.", ...buildOptions("False — both could be negative",["True — positive product means positive roots","True — product and sum are always the same sign","False — positive product means the roots are equal"]) };
    },
  },
  { id: "E18", gapTag: "q-vieta", format: "sum-zero-implies", diagnostic: true, practice: true,
    generate() {
      return { text: "x₁ + x₂ = 0 for some quadratic. What does this tell you about b in x² + bx + c = 0?", ...buildOptions("b = 0",["b > 0","b < 0","b = c"]) };
    },
  },
  { id: "E19", gapTag: "q-vieta", format: "evaluate-wrong-equation-build", diagnostic: true, practice: true,
    generate() {
      const r=pick([2,3,4]);
      return { text: `A student builds a quadratic with roots ${r} and −${r} and writes x² + ${r*r} = 0. Evaluate.`, ...buildOptions(`Incorrect — product of roots = −${r*r}, giving x² − ${r*r} = 0`,[`Correct — product is ${r}×${r}=${r*r}`,"Partially correct for a different reason","Correct — sum is 0 so b=0 and c="+r*r]) };
    },
  },
  { id: "E20", gapTag: "q-vieta", format: "compute-product-from-equation", diagnostic: true, practice: true,
    generate() {
      const r1=pick([1,2,3,4,5]),r2=pick([-1,-2,-3,-4,-5]),s=r1+r2,p=r1*r2,b=-s,c=p;
      return { text: `For ${fmt(1,b,c)}, what is x₁ · x₂?`, ...buildOptions(String(p),[String(-p),String(s),String(-s)]) };
    },
  },

  /* ═══════════════════════════════════════════
     F-SERIES · q-adaptive  (practice only)
  ═══════════════════════════════════════════ */

  { id: "F1", gapTag: "q-adaptive", format: "rearrange-to-standard", diagnostic: false, practice: true,
    generate() {
      const r1=pick([1,2,3,4,5]), r2=pick([1,2,3,4,5].filter(v=>v!==r1)), s=r1+r2, p=r1*r2;
      return { text: `A student sees ${p} = ${s}x − x² and says "this isn't a quadratic equation." Evaluate.`, ...buildOptions(`Incorrect — rearranging gives x² − ${s}x + ${p} = 0`,["Correct — a quadratic must have x² on the left","Correct — the equation is linear because x² is negative","Incorrect — it's quadratic only if x² has coefficient 1"]) };
    },
  },
  { id: "F2", gapTag: "q-adaptive", format: "identify-quadratic-disguised", diagnostic: false, practice: true,
    generate() {
      const a=pick([2,3,4]), b=pick([2,3,5,6]);
      return { text: `Is (x + ${a})(x − ${b}) = 0 a quadratic equation?`, ...buildOptions(`Yes — expands to x² + ${a-b}x − ${a*b} = 0`,["No — it is already factored","No — quadratic equations cannot be in factored form",`Only if x + ${a} ≠ 0 and x − ${b} ≠ 0`]) };
    },
  },
  { id: "F3", gapTag: "q-adaptive", format: "word-problem-setup", diagnostic: false, practice: true,
    generate() {
      const w=pick([3,4,5,6]), diff=pick([2,3,4]), area=w*(w+diff);
      return { text: `A rectangle has width x and length x + ${diff}. Its area is ${area}. Which equation models this?`, ...buildOptions(`x² + ${diff}x − ${area} = 0`,[`x + (x + ${diff}) = ${area}`,`2x + 2(x + ${diff}) = ${area}`,`x² + ${diff} = ${area}`]) };
    },
  },
  { id: "F4", gapTag: "q-adaptive", format: "recognize-hidden-quadratic", diagnostic: false, practice: true,
    generate() {
      const k=pick([2,3,4,5]);
      return { text: `x(x + ${k}) = ${k*2}. A student says this is linear. Evaluate.`, ...buildOptions(`Incorrect — expanding gives x² + ${k}x − ${k*2} = 0`,["Correct — x is only raised to the first power","Correct — linear equations can have products of x","Incorrect — only because the right side is not zero"]) };
    },
  },
  { id: "F5", gapTag: "q-adaptive", format: "solve-non-standard-form", diagnostic: false, practice: true,
    generate() {
      const r1=pick([1,2,3,4]), r2=pick([1,2,3,4].filter(v=>v!==r1)), s=r1+r2, p=r1*r2;
      return { text: `${s}x − x² = ${p}. What is the first step to solve this?`, ...buildOptions(`Rearrange to standard form: x² − ${s}x + ${p} = 0`,["Divide both sides by x","Take the square root of both sides","This equation cannot be solved — x² is negative"]) };
    },
  },
  { id: "F6", gapTag: "q-adaptive", format: "equation-from-context", diagnostic: false, practice: true,
    generate() {
      const n=pick([2,3,4,5,6]), prod=n*(n+1);
      return { text: `Two consecutive integers multiply to give ${prod}. If the smaller is x, which equation is correct?`, ...buildOptions(`x² + x − ${prod} = 0`,[`x + (x+1) = ${prod}`,`x² + 1 = ${prod}`,`2x + 1 = ${prod}`]) };
    },
  },
  // F7 — FIXED: force a === b so x² terms always cancel
  { id: "F7", gapTag: "q-adaptive", format: "identify-type-from-structure", diagnostic: false, practice: true,
    generate() {
      const a=pick([2,3,4]);
      // ax² = a(x² − a) → ax² = ax² − a² → 0 = −a² → linear (x² terms cancel)
      return { text: `${a}x² = ${a}(x² − ${a}). After expanding and simplifying, what type of equation results?`, ...buildOptions("Linear","Quadratic","Cubic","Cannot determine") };
    },
  },
  { id: "F8", gapTag: "q-adaptive", format: "non-standard-solution-count", diagnostic: false, practice: true,
    generate() {
      const r=pick([2,3,4,5]), k=r*r;
      return { text: `${k} − x² = 0. Without rearranging, a student says "I can't tell how many solutions this has." Is that true?`, ...buildOptions(`No — rearranging to x² = ${k} shows two solutions: x = ±${r}`,["Yes — must be in standard form first","Yes — the negative x² means no real solutions","No — there is always exactly one solution"]) };
    },
  },
  { id: "F9", gapTag: "q-adaptive", format: "disguised-quadratic-substitution", diagnostic: false, practice: true,
    generate() {
      const a=pick([1,2,3]), b=pick([3,5,7]), c=pick([2,4,6]);
      return { text: `A student sees: ${a}(x+${b})² − ${c}(x+${b}) = 0. Which solving strategy is most appropriate FIRST?`, ...buildOptions(`Substitute u = (x+${b}) to get a simpler quadratic in u`,["Expand everything and collect like terms","Apply the quadratic formula immediately",`Divide both sides by (x+${b})`]) };
    },
  },
  { id: "F10", gapTag: "q-adaptive", format: "gcf-before-method", diagnostic: false, practice: true,
    generate() {
      const k=pick([2,3,4,5]), p=pick([1,2,3]), q=pick([2,3,4]);
      return { text: `Given ${k}x² + ${k*p}x + ${k*q} = 0, what should a student do BEFORE choosing a solving method?`, ...buildOptions(`Factor out the GCF (${k}) from all terms first`,[`Apply the quadratic formula directly with a=${k}`,`Complete the square on the full equation`,`Factor by trial and error`]) };
    },
  },
  { id: "F11", gapTag: "q-adaptive", format: "perfect-square-trinomial-id", diagnostic: false, practice: true,
    generate() {
      const n=pick([2,3,4,5,6]), a=n*n, b=2*n;
      return { text: `Which label correctly identifies x² + ${b}x + ${a} = 0?`, ...buildOptions(`Perfect square trinomial: (x+${n})² = 0`,["Difference of two squares","Prime trinomial — does not factor","Standard trinomial requiring the quadratic formula"]) };
    },
  },
  { id: "F12", gapTag: "q-adaptive", format: "difference-of-squares-recognition", diagnostic: false, practice: true,
    generate() {
      const n=pick([2,3,4,5,7]), k=n*n;
      return { text: `A student rewrites x² = ${k}. Which form and method are most efficient?`, ...buildOptions(`Difference of squares: (x−${n})(x+${n})=0`,["Use the quadratic formula with a=1, b=0","Complete the square first","Cannot be solved without the quadratic formula"]) };
    },
  },
  { id: "F13", gapTag: "q-adaptive", format: "rearrange-before-solve", diagnostic: false, practice: true,
    generate() {
      const p=pick([2,3,4,5]), q=pick([1,2,3]), r=pick([6,8,10,12]);
      return { text: `A student is given: x² + ${p}x = ${q}x − ${r}. Before applying any method, what MUST happen?`, ...buildOptions(`Move all terms to one side: x² + ${p-q}x + ${r} = 0`,[`Factor the left side immediately`,`Divide both sides by x`,`Apply the quadratic formula using a=1, b=${p}, c=−${r} as written`]) };
    },
  },
  { id: "F14", gapTag: "q-adaptive", format: "zero-product-readiness-check", diagnostic: false, practice: true,
    generate() {
      const a=pick([2,3,4,5]), b=pick([1,2,3,4]);
      return { text: `A student has (x+${a})(x−${b}) = ${a*b}. Can the zero-product property be used immediately?`, ...buildOptions("No — right side must equal 0; expand and rearrange first",[`Yes — set x+${a}=${a*b} and x−${b}=${a*b}`,`Yes — set factors to 0 because the product is constant`,`Yes — divide both sides by ${a*b} first`]) };
    },
  },
  { id: "F15", gapTag: "q-adaptive", format: "completing-square-trigger", diagnostic: false, practice: true,
    generate() {
      const b=pick([3,5,7,9]), c=pick([1,2,3,4]);
      return { text: `For x² + ${b}x + ${c} = 0, D = ${b*b-4*c}. Which method is most efficient given this does NOT factor neatly over integers?`, ...buildOptions("Complete the square or use the quadratic formula",[`Factor by finding integers with product ${c} and sum ${b}`,`Apply zero-product property directly`,`Rewrite as difference of squares`]) };
    },
  },
  { id: "F16", gapTag: "q-adaptive", format: "biquadratic-substitution-id", diagnostic: false, practice: true,
    generate() {
      const a=pick([1,2,3]), b=pick([5,7,9,10]), c=pick([4,6,8]);
      return { text: `Which structure best describes ${a}x⁴ − ${b}x² + ${c} = 0, and what is the correct first step?`, ...buildOptions("Biquadratic: substitute u = x², solve for u, then find x",[`Standard quartic: use the quadratic formula with a=${a}, b=−${b}, c=${c}`,`Factor as difference of squares by inspection`,`Divide through by x² to reduce to a quadratic`]) };
    },
  },
  { id: "F17", gapTag: "q-adaptive", format: "fractional-equation-quadratic-id", diagnostic: false, practice: true,
    generate() {
      const k=pick([2,3,4,5]), m=pick([1,2,3]);
      return { text: `A student sees x + ${k}/x = ${m+k+1}. What type of equation is this AFTER multiplying through by x (x ≠ 0)?`, ...buildOptions(`A quadratic equation: x² − ${m+k+1}x + ${k} = 0`,["A linear equation — x terms cancel on both sides","A rational equation — x still in denominator","An exponential equation"]) };
    },
  },
  { id: "F18", gapTag: "q-adaptive", format: "negative-leading-coefficient-method", diagnostic: false, practice: true,
    generate() {
      const a=pick([2,3,4]), b=pick([1,2,3,4]), c=pick([1,2,3]);
      return { text: `Given −${a}x² + ${b}x + ${c} = 0, a student wants to factor. What should they do first?`, ...buildOptions(`Multiply every term by −1 so leading coefficient becomes +${a}`,[`Factor out −1 from left side only`,`Apply quadratic formula with a=+${a}`,`Switch only the sign of c`]) };
    },
  },
  { id: "F19", gapTag: "q-adaptive", format: "sum-product-roots-method-choice", diagnostic: false, practice: true,
    generate() {
      const r1=pick([1,2,3,4,5]), r2=pick([1,2,3,4,5].filter(v=>v!==r1)), sum=r1+r2, prod=r1*r2;
      return { text: `Without fully solving, a student needs the SUM and PRODUCT of the roots of x² − ${sum}x + ${prod} = 0. Which approach is correct?`, ...buildOptions(`By Vieta's formulas: sum = ${sum}, product = ${prod} — no solving needed`,["Solve using the quadratic formula, then add and multiply","Complete the square to find the sum","Sum = "+sum+", product = −"+prod+" (sign error on product)"]) };
    },
  },
  { id: "F20", gapTag: "q-adaptive", format: "quadratic-inequality-boundary-id", diagnostic: false, practice: true,
    generate() {
      const r1=pick([1,2,3]), r2=r1+pick([1,2,3]);
      return { text: `To solve (x−${r1})(x−${r2}) < 0, a student finds the roots are ${r1} and ${r2}. Which reasoning identifies the solution set?`, ...buildOptions(`Test each interval; product is negative between roots: ${r1} < x < ${r2}`,[`x < ${r1} or x > ${r2}`,`Set each factor < 0: x < ${r1} AND x < ${r2}`,"No solution — a product cannot be negative"]) };
    },
  },

  /* ═══════════════════════════════════════════
     G-SERIES · q-relational  (practice only)
  ═══════════════════════════════════════════ */

  { id: "G1", gapTag: "q-relational", format: "graph-to-root-count", diagnostic: false, practice: true,
    generate() {
      const scenario=pick([{desc:"crosses the x-axis at two points",roots:"2",wrong:["0","1","Cannot determine"]},{desc:"touches the x-axis at exactly one point",roots:"1",wrong:["0","2","Cannot determine"]},{desc:"never touches the x-axis",roots:"0",wrong:["1","2","Cannot determine"]}]);
      return { text: `A parabola ${scenario.desc}. How many real roots does the corresponding quadratic equation have?`, ...buildOptions(scenario.roots,scenario.wrong) };
    },
  },
  { id: "G2", gapTag: "q-relational", format: "d-to-graph-description", diagnostic: false, practice: true,
    generate() {
      const scenario=pick([{d:"D > 0",graph:"crosses the x-axis at two distinct points",wrong:["touches at one point","does not touch","crosses at the origin"]},{d:"D = 0",graph:"touches the x-axis at exactly one point",wrong:["crosses at two points","does not touch","entirely below"]},{d:"D < 0",graph:"does not touch the x-axis at all",wrong:["crosses at two points","touches at one point","crosses at the origin"]}]);
      return { text: `For a quadratic equation with ${scenario.d}, how does the parabola relate to the x-axis?`, ...buildOptions(scenario.graph,scenario.wrong) };
    },
  },
  { id: "G3", gapTag: "q-relational", format: "roots-to-intercepts", diagnostic: false, practice: true,
    generate() {
      const r1=pick([-4,-3,-2,-1,1,2,3,4]), r2=pick([-4,-3,-2,-1,1,2,3,4].filter(v=>v!==r1));
      return { text: `The equation x² + bx + c = 0 has roots x = ${r1} and x = ${r2}. Where does the parabola y = x² + bx + c cross the x-axis?`, ...buildOptions(`At x = ${r1} and x = ${r2}`,[`At y = ${r1} and y = ${r2}`,`At the point (${r1}, ${r2})`,"Cannot determine without b and c"]) };
    },
  },
  { id: "G4", gapTag: "q-relational", format: "graph-position-to-d", diagnostic: false, practice: true,
    generate() {
      const scenario=pick([{desc:"entirely above the x-axis",d:"D < 0",wrong:["D > 0","D = 0","D can be anything"]},{desc:"vertex on the x-axis",d:"D = 0",wrong:["D > 0","D < 0","D can be anything"]},{desc:"crossing the x-axis at two points",d:"D > 0",wrong:["D = 0","D < 0","D can be anything"]}]);
      return { text: `A parabola opening upward is ${scenario.desc}. What must be true about D?`, ...buildOptions(scenario.d,scenario.wrong) };
    },
  },
  { id: "G5", gapTag: "q-relational", format: "vertex-to-root-count", diagnostic: false, practice: true,
    generate() {
      const h=pick([-3,-2,-1,1,2,3]), k=pick([1,2,3,4]);
      return { text: `A parabola opens upward with vertex at (${h}, ${k}). How many real roots does its equation have?`, ...buildOptions("0",["1","2","Cannot determine from the vertex alone"]) };
    },
  },
  { id: "G6", gapTag: "q-relational", format: "vertex-below-to-roots", diagnostic: false, practice: true,
    generate() {
      const h=pick([-3,-2,-1,0,1,2,3]), k=pick([-4,-3,-2,-1]);
      return { text: `A parabola opens upward with vertex at (${h}, ${k}). How many real roots does its equation have?`, ...buildOptions("2",["0","1","Cannot determine"]) };
    },
  },
  { id: "G7", gapTag: "q-relational", format: "symbolic-to-graph-property", diagnostic: false, practice: true,
    generate() {
      const r1=pick([1,2,3,4,5]), r2=pick([1,2,3,4,5].filter(v=>v!==r1)), s=r1+r2, p=r1*r2;
      return { text: `The equation x² − ${s}x + ${p} = 0 has two positive roots. What does this tell you about the parabola y = x² − ${s}x + ${p}?`, ...buildOptions(`It crosses the x-axis at two positive x-values: x = ${r1} and x = ${r2}`,["It is entirely above the x-axis","Its vertex is at a positive y-value","It opens downward"]) };
    },
  },
  { id: "G8", gapTag: "q-relational", format: "equation-to-intercept-count", diagnostic: false, practice: true,
    generate() {
      const scenarios=[{eq:"x² + 4",intercepts:"0 x-intercepts"},{eq:"x² − 4x + 4",intercepts:"1 x-intercept"},{eq:"x² − 4",intercepts:"2 x-intercepts"}];
      const s=pick(scenarios);
      const wrong=scenarios.filter(x=>x.eq!==s.eq).map(x=>x.intercepts);
      wrong.push("Cannot determine without graphing");
      return { text: `How many x-intercepts does y = ${s.eq} have?`, ...buildOptions(s.intercepts,wrong.slice(0,3)) };
    },
  },
  { id: "G9", gapTag: "q-relational", format: "vertex-form-to-x-intercepts", diagnostic: false, practice: true,
    generate() {
      const h=pick([1,2,3,4,5]), k=pick([1,4,9,16]), sqrtK=Math.sqrt(k);
      return { text: `The equation y = (x − ${h})² − ${k} is in vertex form. What are the x-intercepts?`, ...buildOptions(`x = ${h-sqrtK} and x = ${h+sqrtK}`,[`x = ${h} and x = ${k}`,`x = −${h} and x = ${sqrtK}`,`x = ${h-k} and x = ${h+k}`]) };
    },
  },
  { id: "G10", gapTag: "q-relational", format: "roots-to-standard-form", diagnostic: false, practice: true,
    generate() {
      const r1=pick([1,2,3,4,5]), r2=pick([1,2,3,4,5]), sum=r1+r2, prod=r1*r2;
      return { text: `A quadratic has roots x = ${r1} and x = ${r2}. Which standard form equation matches?`, ...buildOptions(`x² − ${sum}x + ${prod} = 0`,[`x² + ${sum}x + ${prod} = 0`,`x² − ${sum}x − ${prod} = 0`,`x² + ${sum}x − ${prod} = 0`]) };
    },
  },
  { id: "G11", gapTag: "q-relational", format: "graph-opening-direction-to-equation", diagnostic: false, practice: true,
    generate() {
      const a=pick([2,3,4,5]), h=pick([1,2,3]), k=pick([1,2,4]);
      return { text: `A parabola opens DOWNWARD, has vertex (${h}, ${k}), and passes through the y-axis above the x-axis. Which equation is consistent?`, ...buildOptions(`y = −${a}(x − ${h})² + ${k}`,[`y = ${a}(x − ${h})² + ${k}`,`y = −${a}(x + ${h})² + ${k}`,`y = −${a}(x − ${h})² − ${k}`]) };
    },
  },
  { id: "G12", gapTag: "q-relational", format: "table-of-values-to-equation", diagnostic: false, practice: true,
    generate() {
      const a=pick([1,2]), h=pick([1,2,3]), k=pick([0,1,4]);
      const x1=h-1, x2=h, x3=h+1;
      const y1=a*(x1-h)**2+k, y2=a*(x2-h)**2+k, y3=a*(x3-h)**2+k;
      return { text: `A table shows: x=${x1}→y=${y1}; x=${x2}→y=${y2}; x=${x3}→y=${y3}. Minimum is ${y2}. Which equation fits?`, ...buildOptions(`y = ${a}(x − ${h})² + ${k}`,[`y = ${a}x² + ${k}`,`y = ${a}(x + ${h})² + ${k}`,`y = −${a}(x − ${h})² + ${k}`]) };
    },
  },
  { id: "G13", gapTag: "q-relational", format: "word-problem-to-symbolic", diagnostic: false, practice: true,
    generate() {
      const total=pick([20,24,30,36]);
      return { text: `A rectangle has perimeter ${total*2} cm. Its length is x and its width is (${total} − x). Which equation gives the area A in terms of x?`, ...buildOptions(`A = ${total}x − x²`,[`A = ${total}`,`A = x² − ${total}x`,`A = ${total*2}`]) };
    },
  },
  { id: "G14", gapTag: "q-relational", format: "factored-form-to-vertex", diagnostic: false, practice: true,
    generate() {
      const r1=pick([1,2,3,4]), r2=r1+pick([2,4,6]);
      const h=(r1+r2)/2, k=-(((r2-r1)/2)**2);
      return { text: `Given y = (x − ${r1})(x − ${r2}), what is the vertex?`, ...buildOptions(`(${h}, ${k})`,[`(${r1}, ${r2})`,`(0, ${r1*r2})`,`(${r1+r2}, 0)`]) };
    },
  },
  { id: "G15", gapTag: "q-relational", format: "standard-form-to-axis-of-symmetry", diagnostic: false, practice: true,
    generate() {
      const a=pick([1,2,3]), b=pick([2,4,6,8]), c=pick([1,2,3,4]);
      const axis=-b/(2*a);
      return { text: `For y = ${a}x² ${display(-b)}x + ${c}, which value is the axis of symmetry?`, ...buildOptions(`x = ${axis}`,[ `x = ${b/(2*a)}`,`x = ${-b/a}`,`x = ${c}`]) };
    },
  },
  { id: "G16", gapTag: "q-relational", format: "roots-to-sum-and-product", diagnostic: false, practice: true,
    generate() {
      const p=pick([2,3,4,5]), q=pick([2,3,4,6,8]);
      return { text: `For 2x² − ${p}x + ${q} = 0, what are the sum and product of the roots WITHOUT solving?`, ...buildOptions(`Sum = ${p}/2, Product = ${q}/2`,[`Sum = ${p}, Product = ${q}`,`Sum = −${p}/2, Product = ${q}/2`,`Sum = ${p}/2, Product = −${q}/2`]) };
    },
  },
  { id: "G17", gapTag: "q-relational", format: "vertex-form-to-y-intercept", diagnostic: false, practice: true,
    generate() {
      const a=pick([1,2,3]), h=pick([1,2,3,4]), k=pick([1,2,3,4]);
      const yInt=a*h*h+k;
      return { text: `What is the y-intercept of y = ${a}(x − ${h})² + ${k}?`, ...buildOptions(`y = ${yInt}`,[`y = ${k}`,`y = ${a*h+k}`,`y = ${a+k}`]) };
    },
  },
  { id: "G18", gapTag: "q-relational", format: "completing-square-to-vertex", diagnostic: false, practice: true,
    generate() {
      const b=pick([2,4,6,8]), c=pick([1,2,3,5]);
      const h=b/2, k=c-h*h;
      return { text: `A student rewrites x² + ${b}x + ${c} by completing the square. Which vertex form and vertex are correct?`, ...buildOptions(`y = (x + ${h})² + (${k}); vertex (−${h}, ${k})`,[`y = (x + ${h})² + ${c}; vertex (−${h}, ${c})`,`y = (x − ${h})² + (${k}); vertex (${h}, ${k})`,`y = (x + ${b})² + (${k}); vertex (−${b}, ${k})`]) };
    },
  },
  { id: "G19", gapTag: "q-relational", format: "discriminant-to-graph-description", diagnostic: false, practice: true,
    generate() {
      const type=pick(["positive","zero","negative"]);
      const descriptions={
        positive:{disc:"positive (e.g., 25)",correct:"Crosses the x-axis at two distinct points",wrong:["Touches at exactly one point","Does not cross the x-axis","Vertex is on the x-axis"]},
        zero:{disc:"zero",correct:"Tangent to the x-axis — one repeated root",wrong:["Crosses at two symmetric points","No real x-intercepts","Vertex is above the x-axis"]},
        negative:{disc:"negative (e.g., −7)",correct:"Does not intersect the x-axis",wrong:["Intersects once, at the vertex","Opens downward","Crosses at two imaginary points"]},
      };
      const d=descriptions[type];
      return { text: `The discriminant of a quadratic is ${d.disc}. Which graphical description is correct?`, ...buildOptions(d.correct,d.wrong) };
    },
  },
  { id: "G20", gapTag: "q-relational", format: "standard-form-to-vertex-form-translation", diagnostic: false, practice: true,
    generate() {
      const a=pick([1,2]), h=pick([1,2,3]), k=pick([-4,-3,-1,1,2,3]);
      const expandedB=-2*a*h, expandedC=a*h*h+k;
      return { text: `Which vertex form correctly represents y = ${a}x² ${display(expandedB)}x + ${expandedC}?`, ...buildOptions(`y = ${a}(x ${display(-h)})² + ${k}`,[`y = ${a}(x ${display(h)})² + ${k}`,`y = ${a}(x ${display(-h)})² + ${expandedC}`,`y = (x ${display(-h)})² + ${k}`]) };
    },
  },
];