export const quadraticMasteryTemplates = [
  // ─── q-discriminant mastery (Am1–Am20) ───────────────────────────────────────

{
  id: "Am1",
  gapTag: "q-discriminant",
  format: "error-in-discriminant-sign-chain",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([3,4,5,6,7,8,9,10,11,12]), b = pick([2,3,4,5,6,7]);
    const D = b*b - 4*a;
    return {
      text: `A student evaluates ${fmt(a,b,a)} and writes: "D = ${b}²− 4·${a}·${a} = ${b*b}−${4*a*a} = ${b*b - 4*a*a}. Since D < 0, there are no real roots." Identify all errors in this chain.`,
      ...buildOptions(
        `Two errors: c was used as ${a} (correct) but the student computed 4·a·c = 4·${a}·${a} instead of 4·${a}·${a} — wait, c=${a} here so only one error: D = ${b}²−4·${a}·${a} is wrong because c in ax²+bx+c is the third coefficient, but the formula was applied correctly. Actually the equation is ${fmt(a,b,a)}, so a=${a}, b=${b}, c=${a}, giving D=${b*b}-4·${a}·${a}=${b*b - 4*a*a}. The student is correct.`,
        [
          `One error: the student should use D = b²+4ac, not b²−4ac`,
          `One error: the student used c = ${a} but c should be read as the constant term only after moving everything to one side`,
          `No errors in computation, but the conclusion is wrong — D < 0 still allows one repeated real root`
        ]
      ),
    };
  },
},

{
  id: "Am2",
  gapTag: "q-discriminant",
  format: "d-value-to-root-count-and-type",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = 2 * a; // perfect square: D = 4a²-4a² = 0... let's make D positive
    const c = pick([1,2,3]);
    const D = b*b - 4*a*c;
    return {
      text: `For ${fmt(a,b,c)}, D = ${D}. A student concludes: "D > 0 and D is a perfect square, so the equation has two rational roots and can always be factored over the integers." Evaluate this reasoning fully.`,
      ...buildOptions(
        `Mostly correct but incomplete — D > 0 and a perfect square guarantees two rational roots, but integer factorability also requires a and c to divide appropriately; the roots may be rational non-integers`,
        [
          `Fully correct — D being a perfect square is both necessary and sufficient for integer factoring`,
          `Incorrect — D > 0 with a perfect square only guarantees real roots, not rational ones`,
          `Incorrect — D > 0 means two real roots but says nothing about whether they are rational or irrational`
        ]
      ),
    };
  },
},

{ 
  id: "Am3", gapTag: "q-discriminant", format: "construct-equation-given-d-constraint",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const pairs=[[1,1],[1,4],[1,9],[1,16],[4,1],[9,1],[4,4],[2,8],[8,2]];
    const [a,c]=pick(pairs);
    const minB2=4*a*c;
    const b=Math.sqrt(minB2);
    return {
      text: `Construct a quadratic with leading coefficient ${a} and constant ${c} that has exactly one real root. What must b equal, and why?`,
      ...buildOptions(
        `b = ±${b} — setting D = b²−4·${a}·${c} = 0 gives b² = ${minB2}, so b = ±${b}`,
        [
          `b = ${2*a*c} — obtained by setting b = 4ac instead of solving b² = 4ac`,
          `b = ${a+c} — using b = a+c as a shortcut for the double-root condition`,
          `Any b > ${2*Math.sqrt(a*c).toFixed(1)} — confusing D > 0 with D = 0`
        ]
      ),
    };
  },
},

{
  id: "Am4",
  gapTag: "q-discriminant",
  format: "compare-two-equations-by-discriminant",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a1 = pick([2,3,4,5,6,7,8]), b1 = pick([2,3,4,5,6,7,8]), c1 = pick([2,3,4,5,6,7,8]);
    const a2 = pick([2,3,4,5,6,7,8]), b2 = pick([2,3,4,5,6,7,8]), c2 = pick([2,3,4,5,6,7,8]);
    const D1 = b1*b1 - 4*a1*c1;
    const D2 = b2*b2 - 4*a2*c2;
    return {
      text: `Equation P: ${fmt(a1,b1,c1)}, D = ${D1}. Equation Q: ${fmt(a2,b2,c2)}, D = ${D2}. A student says "P has more real roots than Q because its discriminant is larger." Evaluate.`,
      ...buildOptions(
        `Invalid reasoning — root count depends only on the sign of D, not its magnitude; a larger positive D does not mean more roots than a smaller positive D`,
        [
          `Valid — a larger discriminant always corresponds to roots that are further apart, hence more distinct`,
          `Valid only if both discriminants are positive; otherwise the comparison is meaningless`,
          `Invalid — the student should compare √D values, not D values directly, to count roots`
        ]
      ),
    };
  },
},

{
  id: "Am5",
  gapTag: "q-discriminant",
  format: "negative-leading-coeff-d-graph",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7]);
    const D = b*b - 4*(-a)*(a); // a is negative leading coeff
    return {
      text: `For −${a}x²+${b}x−${a} = 0, a student computes D = ${b}²−4·(−${a})·(−${a}) = ${b*b}−${4*a*a} = ${b*b-4*a*a} and concludes "D < 0 so no real roots, and since the parabola opens upward there are no intersections with the x-axis." Identify all errors.`,
      ...buildOptions(
        `One computational error (D is correct) but one conceptual error: the leading coefficient is −${a} < 0, so the parabola opens downward, not upward`,
        [
          `No errors — D < 0 and a negative leading coefficient both confirm no real roots`,
          `Computational error only: D should be ${b}²+4·${a}·${a} = ${b*b+4*a*a}`,
          `Two errors: D formula is wrong, and a negative leading coefficient means the parabola opens upward`
        ]
      ),
    };
  },
},

{
  id: "Am6",
  gapTag: "q-discriminant",
  format: "parametric-d-inequality",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²+kx+${a*c} = 0 (with a=1, c=${a*c}), find all integer values of k such that the equation has two distinct real roots.`,
      ...buildOptions(
        `k with |k| > ${2*Math.sqrt(a*c).toFixed(2)}, i.e. k ≤ −${Math.ceil(2*Math.sqrt(a*c))} or k ≥ ${Math.ceil(2*Math.sqrt(a*c))} (D = k²−${4*a*c} > 0 requires k² > ${4*a*c})`,
        [
          `k > ${2*Math.sqrt(a*c).toFixed(0)} only — forgetting the negative branch`,
          `k ≠ 0 — confusing the no-real-roots condition with b = 0`,
          `|k| ≥ ${Math.ceil(2*Math.sqrt(a*c))} — including the D = 0 case which gives only one distinct root`
        ]
      ),
    };
  },
},

{
  id: "Am7",
  gapTag: "q-discriminant",
  format: "proof-d-determines-root-field",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,5,7,11]);
    return {
      text: `A student claims: "If D = ${p} for a monic quadratic with integer coefficients, the roots are irrational because ${p} is not a perfect square." Is this proof valid? What additional condition would make it complete?`,
      ...buildOptions(
        `Valid conclusion but the proof needs to state that a=1 (monic) and b,c are integers so roots = (−b±√${p})/2; since √${p} is irrational, both roots are irrational`,
        [
          `Invalid — irrational D does not imply irrational roots; the roots could simplify to integers`,
          `Valid and complete as stated — D not a perfect square is sufficient on its own`,
          `Invalid — ${p} being prime (not a perfect square) is irrelevant; only D < 0 determines root type`
        ]
      ),
    };
  },
},

{
  id: "Am8",
  gapTag: "q-discriminant",
  format: "d-sign-from-graph-description",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const vertex_y = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A parabola opens downward and has its vertex at y = +${vertex_y} (above the x-axis). Without computing D, determine the sign of D and the number of real roots.`,
      ...buildOptions(
        `D > 0 and two real roots — a downward-opening parabola with vertex above the x-axis must cross the x-axis twice`,
        [
          `D < 0 and no real roots — the vertex being above the x-axis means the parabola never reaches it`,
          `D = 0 and one real root — vertex above x-axis implies tangency`,
          `Cannot determine without knowing a and c — graph position alone is insufficient`
        ]
      ),
    };
  },
},

{
  id: "Am9",
  gapTag: "q-discriminant",
  format: "scaled-equation-d-invariance",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    const k = pick([2,3,4,5]);
    const D = b*b - 4*a*c;
    const Dscaled = (k*b)*(k*b) - 4*(k*a)*(k*c);
    return {
      text: `Original equation: ${fmt(a,b,c)}, D = ${D}. A student multiplies every term by ${k} to get ${fmt(k*a,k*b,k*c)}, computes D' = ${Dscaled}, and says "the roots changed because D' ≠ D." Evaluate.`,
      ...buildOptions(
        `Incorrect conclusion — multiplying by ${k} scales D by k² = ${k*k} but the roots are unchanged (equivalent equation); D' = ${k*k}·D ≠ D but root count and values are the same`,
        [
          `Correct — scaling the equation scales the roots proportionally`,
          `Correct — D and D' have the same sign so root count is unchanged, but the actual root values do change`,
          `Incorrect computation — multiplying by ${k} should leave D unchanged because it's symmetric in a,b,c`
        ]
      ),
    };
  },
},

{
  id: "Am10",
  gapTag: "q-discriminant",
  format: "d-zero-uniqueness-proof-gap",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student writes: "x²−${2*r}x+${r*r} = 0 has D = 0, so it has one real root x = ${r}. Therefore every quadratic with D = 0 has its double root equal to the value of c." Find the flaw.`,
      ...buildOptions(
        `The flaw is the final generalization — the double root is −b/(2a), not c; here c = ${r*r} = r² so the coincidence misled the student`,
        [
          `No flaw — c equals the double root whenever the equation is a perfect square trinomial`,
          `The flaw is the D computation — D = (−${2*r})²−4·${r*r} is not actually zero`,
          `The flaw is calling it "one real root" — D = 0 gives two identical roots, so there are technically two roots`
        ]
      ),
    };
  },
},

{
  id: "Am11",
  gapTag: "q-discriminant",
  format: "reverse-engineer-coefficients-from-d",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const D_target = pick([4,9,16,25,36,49]);
    const a = pick([2,3,4,5]);
    return {
      text: `A monic quadratic (a=1) has D = ${D_target} and its b coefficient is positive. A student claims b must equal √${D_target} + 4c for some integer c. Is this valid?`,
      ...buildOptions(
        `Invalid — D = b²−4c = ${D_target} means b²−4c = ${D_target}, so b = √(${D_target}+4c); the student has the algebra inverted`,
        [
          `Valid — rearranging D = b²−4c gives b = √D + 4c directly`,
          `Valid only when c = 0, in which case b = √D`,
          `Invalid — D = ${D_target} uniquely determines b without needing c`
        ]
      ),
    };
  },
},

{
  id: "Am12",
  gapTag: "q-discriminant",
  format: "two-student-d-approaches-compare",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    const D = b*b - 4*a*c;
    return {
      text: `For ${fmt(a,b,c)}: Student A computes D = ${b}²−4·${a}·${c} = ${D} and classifies roots. Student B completes the square and checks if the square-root step is defined. Which approach is valid, and must they always agree?`,
      ...buildOptions(
        `Both are valid and must always agree — completing the square leads to the same discriminant condition; the methods are algebraically equivalent`,
        [
          `Only Student A's method is rigorous — completing the square introduces extraneous steps that can hide sign errors`,
          `They agree only when a = 1; for a ≠ 1, completing the square changes the discriminant`,
          `Student B's method is superior because it avoids the formula and reveals the vertex directly`
        ]
      ),
    };
  },
},

{
  id: "Am13",
  gapTag: "q-discriminant",
  format: "d-sensitivity-to-b-perturbation",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([3,4,5,6,7,8,9,10,11,12]);
    const c = pick([3,4,5,6,7,8,9,10,11,12]);
    const b_crit = Math.sqrt(4*a*c);
    return {
      text: `For ax²+bx+c = 0 with a = ${a}, c = ${c}: at b = ${b_crit.toFixed(2)} (approx) the equation has a double root. A student says "increasing b by 1 always turns D negative." Evaluate.`,
      ...buildOptions(
        `Incorrect — at the critical b, D = 0; increasing b increases D (since D = b²−${4*a*c} and its derivative with respect to b is 2b > 0), giving two real roots, not zero`,
        [
          `Correct — any perturbation of b away from the critical value makes D negative`,
          `Correct only for positive perturbations; decreasing b makes D positive`,
          `Cannot determine without knowing the exact critical b value`
        ]
      ),
    };
  },
},

{
  id: "Am14",
  gapTag: "q-discriminant",
  format: "complex-root-conjugate-property-proof",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    const D = b*b - 4*a*c;
    return {
      text: `For ${fmt(a,b,c)}, D = ${D} < 0. A student claims "the two complex roots are conjugates of each other, so their sum is real." Is this reasoning valid, and what is the sum?`,
      ...buildOptions(
        `Valid — complex roots of a real-coefficient quadratic always come in conjugate pairs; their sum = −b/a = ${-b}/${a} which is real`,
        [
          `Invalid — complex roots are conjugates only when b = 0 (purely imaginary roots)`,
          `Valid reasoning but the sum equals −b (forgetting to divide by a)`,
          `Invalid — D < 0 only tells us roots are non-real; conjugacy requires additional conditions on the coefficients`
        ]
      ),
    };
  },
},

{
  id: "Am15",
  gapTag: "q-discriminant",
  format: "substitution-changes-d-analysis",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7]);
    const c = pick([2,3,4,5,6,7]);
    return {
      text: `A student substitutes x = t+1 into ${fmt(a,b,c)} to simplify. They claim "the substitution changes D." Is this correct?`,
      ...buildOptions(
        `Incorrect — a linear substitution x = t+k shifts the parabola horizontally; the discriminant (number and type of roots) is invariant under such substitutions`,
        [
          `Correct — substitution changes the b coefficient, which directly changes D = b²−4ac`,
          `Correct only if k = 1; other substitutions preserve D`,
          `Incorrect — the substitution changes a and c but not b, leaving D unchanged`
        ]
      ),
    };
  },
},

{
  id: "Am16",
  gapTag: "q-discriminant",
  format: "d-from-factored-form-backward",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r1 = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const r2 = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const a = pick([2,3,4,5]);
    return {
      text: `A quadratic is given in factored form as ${a}(x−${r1})(x−${r2}) = 0. Without expanding, a student computes D = ${a}²(${r1}−${r2})² and concludes D = ${a*a*(r1-r2)*(r1-r2)}. Is D computed correctly?`,
      ...buildOptions(
  `Correct — D = a²(r₁−r₂)² is a valid derived identity: expanding a(x−r₁)(x−r₂) gives D = a²(r₁+r₂)²−4a²r₁r₂ = a²(r₁−r₂)²; here D = ${a*a*(r1-r2)*(r1-r2)}`
  [
          `Correct — D = a²(r₁−r₂)² is the standard formula for discriminant from roots`,
          `Incorrect — D from factored form should be (r₁−r₂)² without the a² factor`,
          `Incorrect — the discriminant cannot be computed from factored form; you must expand first`
        ]
      ),
    };
  },
},

{
  id: "Am17",
  gapTag: "q-discriminant",
  format: "d-and-vertex-combined-reasoning",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    const D = b*b - 4*a*c;
    const vy = -D / (4*a);
    return {
      text: `For ${fmt(a,b,c)}, D = ${D}. The vertex y-coordinate is −D/(4a) = ${vy.toFixed(2)}. A student says: "since the vertex is ${vy < 0 ? 'below' : 'above'} the x-axis and a > 0, we get ${D > 0 ? 'two' : D === 0 ? 'one' : 'no'} real roots — consistent with D." Verify the vertex formula and the reasoning chain.`,
      ...buildOptions(
        `The vertex formula −D/(4a) is correct, and the reasoning is valid: for a > 0, vertex below x-axis ↔ D > 0 (two roots); vertex on x-axis ↔ D = 0; vertex above ↔ D < 0`,
        [
          `The vertex formula is wrong — it should be D/(4a) without the negative sign`,
          `The reasoning is circular — D already encodes root information, so checking the vertex adds nothing`,
          `The formula is correct but the reasoning is invalid because vertex position depends on b, not just D`
        ]
      ),
    };
  },
},

{
  id: "Am18",
  gapTag: "q-discriminant",
  format: "multiple-choice-proof-validity",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `Claim: "For ${fmt(a,b,0)}, D = ${b*b} > 0 so the equation always has two distinct real roots regardless of a." A student cites this as a universal rule: 'c=0 always gives D > 0.' Evaluate the claim and the rule.`,
      ...buildOptions(
        `The specific computation is correct (D = b²−4a·0 = b² > 0 when b ≠ 0), and the rule 'c=0 ⟹ D = b² ≥ 0' is valid; two distinct roots occur when b ≠ 0`,
        [
          `Incorrect — c=0 means one root is always zero, which doesn't require D > 0 to determine`,
          `Partially correct — c=0 gives D = b² but D > 0 requires b > 0, not just b ≠ 0`,
          `Incorrect universal rule — when c=0 and b=0, D=0 giving a double root at zero, not two distinct roots`
        ]
      ),
    };
  },
},

{
  id: "Am19",
  gapTag: "q-discriminant",
  format: "d-comparison-across-transformations",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    const D = b*b - 4*a*c;
    return {
      text: `Equation E: ${fmt(a,b,c)}, D = ${D}. A student negates the equation to form −${a}x²−${b}x−${c} = 0. They compute D' = (−${b})²−4·(−${a})·(−${c}) = ${b*b - 4*a*c} and conclude "D' = D so negating preserves the discriminant." Verify.`,
      ...buildOptions(
        `Correct — negating all coefficients preserves D because D' = (−b)²−4(−a)(−c) = b²−4ac = D; the equations are equivalent and have the same roots`,
        [
          `Incorrect — negating changes the sign of b, so D' = b²−4ac becomes (−b)²−4ac = b²−4ac only by coincidence here`,
          `Incorrect computation — D' should be (−b)²+4ac because both a and c flip sign independently`,
          `Correct numerically but the equations are not equivalent — one opens upward, one downward, giving different root sets`
        ]
      ),
    };
  },
},

{
  id: "Am20",
  gapTag: "q-discriminant",
  format: "d-applied-to-word-problem-setup",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const v0 = pick([10,12,15,18,20,24,25,30]);
    const g = 10;
    return {
      text: `A ball is thrown upward with initial speed ${v0} m/s. Its height is h(t) = ${v0}t − ${g/2}t². A student sets h = ${v0*v0/(2*g)+5} (above the maximum height) and solves the resulting quadratic. They get D < 0 and conclude "the ball never reaches this height — D < 0 confirms it." Evaluate fully.`,
      ...buildOptions(
        `Fully correct — the maximum height is v₀²/(2g) = ${v0*v0/(2*g)} m, which is less than ${v0*v0/(2*g)+5} m; so the quadratic for h = ${v0*v0/(2*g)+5} has D < 0, confirming no real time solutions`,
        [
          `Incorrect setup — height equations should be solved using the vertex formula, not the discriminant`,
          `Correct that D < 0 means no solution, but the student should verify the maximum height separately; D < 0 alone is insufficient`,
          `Incorrect — D < 0 means complex time values, which could still correspond to real heights`
        ]
      ),
    };
  },
},

// ─── q-double-root mastery (Bm1–Bm20) ────────────────────────────────────────

{
  id: "Bm1",
  gapTag: "q-double-root",
  format: "verify-double-root-algebraically",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const a = pick([2,3,4,5,6,7]);
    return {
      text: `A student claims x = ${r} is a double root of ${a}x²−${2*a*r}x+${a*r*r} = 0. They verify by substituting x = ${r} once and getting 0. Is their verification complete?`,
      ...buildOptions(
        `Incomplete — substituting x = ${r} only confirms it's a root; double root requires additionally checking D = 0 or that (x−${r})² divides the polynomial, which means (${2*a*r})²−4·${a}·${a*r*r} = 0`,
        [
          `Complete — if f(${r}) = 0 and the equation is quadratic, the root must be double`,
          `Complete — a quadratic has at most two roots; finding one with multiplicity follows from the rational root theorem`,
          `Incomplete — they should substitute x = ${r} twice into different derivatives to confirm multiplicity`
        ]
      ),
    };
  },
},

{
  id: "Bm2",
  gapTag: "q-double-root",
  format: "double-root-from-parameter-constraint",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const k = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `For x²+kx+${k*k/4} = 0 (assuming k is even), find k such that the equation has a double root, and state the double root.`,
      ...buildOptions(
        `Any even k gives a double root at x = −k/2, since D = k²−4·(k²/4) = k²−k² = 0 for all such k`,
        [
          `Only k = 2, giving double root x = −1`,
          `k = 4 only, giving double root x = −2; other even k values give two distinct roots`,
          `No value of k works; a monic quadratic with non-integer c cannot have a double root`
        ]
      ),
    };
  },
},

{
  id: "Bm3",
  gapTag: "q-double-root",
  format: "double-root-multiplicity-vs-repeated-factor",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student says: "x²−${2*r}x+${r*r} = 0 and x−${r} = 0 both have x = ${r} as a solution, so they have the same root with the same multiplicity." Evaluate.`,
      ...buildOptions(
        `Incorrect — x = ${r} is a double root (multiplicity 2) in the quadratic because (x−${r})² = 0, but a simple root (multiplicity 1) in the linear equation`,
        [
          `Correct — multiplicity is determined by the value of the root, not the degree of the equation`,
          `Correct — both equations are satisfied by x = ${r}, so multiplicity is identical`,
          `Incorrect — the quadratic has no real roots because ${r*r} > 0 makes D negative`
        ]
      ),
    };
  },
},

{
  id: "Bm4",
  gapTag: "q-double-root",
  format: "negative-leading-coeff-double-root",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const a = pick([2,3,4,5,6,7]);
    return {
      text: `A student factors −${a}x²+${2*a*r}x−${a*r*r} = 0 as −${a}(x−${r})² = 0, concluding x = ${r} is a double root. Another student says "the negative leading coefficient means there's no double root." Who is correct?`,
      ...buildOptions(
        `The first student is correct — double roots depend on D = 0, not the sign of a; here D = (${2*a*r})²−4·(−${a})·(−${a*r*r}) = ${4*a*a*r*r - 4*a*a*r*r} = 0`,
        [
          `The second student is correct — negative leading coefficient prevents a perfect square factoring`,
          `Neither is fully correct — the factoring should produce two distinct roots at x = ±${r}`,
          `The first student is correct only because the equation was already given in factored form`
        ]
      ),
    };
  },
},

{
  id: "Bm5",
  gapTag: "q-double-root",
  format: "sum-product-double-root-consistency",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `For a monic quadratic with double root r = ${r}, a student uses Vieta's to check: sum of roots = ${r}+${r} = ${2*r} = −b, so b = −${2*r}; product = ${r}·${r} = ${r*r} = c. They write x²${display(-2*r)}x+${r*r} = 0. Verify this is correct and that D = 0.`,
      ...buildOptions(
        `Correct — b = −${2*r}, c = ${r*r} gives D = (−${2*r})²−4·1·${r*r} = ${4*r*r}−${4*r*r} = 0; confirmed double root`,
        [
          `Incorrect — Vieta's formulas for a double root give sum = 2r and product = r, not r²`,
          `Correct values but D = (${2*r})²−4·${r*r} = ${4*r*r - 4*r*r + 4} ≠ 0; not actually a double root`,
          `Incorrect — for a double root, Vieta's gives sum = 0 and product = r by convention`
        ]
      ),
    };
  },
},

{
  id: "Bm6",
  gapTag: "q-double-root",
  format: "tangency-condition-double-root",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const m = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `Line y = ${m}x is tangent to parabola y = x²+${c}. A student sets ${m}x = x²+${c} and requires D = 0. They get b = −${m}, so D = ${m}²−4·${c} = ${m*m-4*c}. If this equals zero, state the tangent point; if not, interpret what D tells us.`,
      ...buildOptions(
        `D = ${m*m - 4*c}; if D = 0 the line is tangent (double root gives the x-coordinate of tangency); here D = ${m*m-4*c} ${m*m-4*c === 0 ? '= 0 so tangency at x = ' + m/2 : (m*m-4*c > 0 ? '> 0 so the line intersects the parabola at two distinct points — not tangent' : '< 0 so the line misses the parabola entirely')}`,
        [
          `D = 0 is not required for tangency — tangency only requires the line to have the same slope as the parabola at the point`,
          `D must be negative for tangency — a tangent line "just touches" so it should have no real crossing`,
          `The setup is wrong — tangency conditions require equating derivatives, not setting equations equal`
        ]
      ),
    };
  },
},

{
  id: "Bm7",
  gapTag: "q-double-root",
  format: "double-root-graph-vertex-link",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const a = pick([2,3,4,5,6,7]);
    return {
      text: `A student says: "If a quadratic has a double root at x = ${r}, its vertex must be at (${r}, 0). Therefore any parabola touching the x-axis at exactly one point has its vertex on the x-axis." Evaluate both the specific claim and the generalization.`,
      ...buildOptions(
        `Both are correct — a double root at x = ${r} means D = 0 and vertex at (−b/(2a), 0) = (${r}, 0); a parabola touching x-axis at exactly one point has its vertex exactly on the x-axis`,
        [
          `The specific claim is correct, but the generalization is wrong — a parabola can touch the x-axis at one point without the vertex being on the x-axis`,
          `Both are incorrect — vertex location requires knowing a, b, c, not just the root`,
          `Specific claim is correct; generalization requires the additional condition that a > 0`
        ]
      ),
    };
  },
},

{
  id: "Bm8",
  gapTag: "q-double-root",
  format: "double-root-derivative-test",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const a = pick([2,3,4,5,6,7]);
    return {
      text: `A student tests x = ${r} as a double root of ${a}x²−${2*a*r}x+${a*r*r} = 0 by checking f(${r}) = 0 AND f'(${r}) = 0 where f(x) = ${a}x²−${2*a*r}x+${a*r*r}. f'(x) = ${2*a}x−${2*a*r}. Is this a valid test for double roots?`,
      ...buildOptions(
        `Valid — a root r is a double root of f(x) = 0 if and only if f(r) = 0 and f'(r) = 0; here f'(${r}) = ${2*a}·${r}−${2*a*r} = 0 ✓`,
        [
          `Invalid — f'(r) = 0 only confirms r is a critical point, not a double root`,
          `Invalid — double roots are detected by D = 0 only; the derivative test is for local minima/maxima`,
          `Partially valid — f'(r) = 0 is necessary but not sufficient; you also need f''(r) ≠ 0`
        ]
      ),
    };
  },
},

{
  id: "Bm9",
  gapTag: "q-double-root",
  format: "construct-double-root-with-constraints",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([3,4,5,6,7,8,9,10,11,12]);
    const a = pick([2,3,4,5]);
    return {
      text: `Construct a quadratic with leading coefficient ${a} and double root at x = −${r}. A student writes ${a}(x+${r})² = 0 and expands to ${a}x²+${2*a*r}x+${a*r*r} = 0. Verify all three coefficients are correct.`,
      ...buildOptions(
        `Correct — a = ${a}, b = ${2*a*r} (from 2·${a}·${r}), c = ${a*r*r} (from ${a}·${r}²); expanding ${a}(x+${r})² gives exactly this`,
        [
          `Incorrect — b should be ${a*r} (using a·r instead of 2·a·r)`,
          `Incorrect — c should be ${r*r} (forgetting the factor of ${a})`,
          `Incorrect — the expansion of (x+${r})² is x²+${r}², omitting the middle term`
        ]
      ),
    };
  },
},

{
  id: "Bm10",
  gapTag: "q-double-root",
  format: "error-in-double-root-step-chain",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student solves x²−${2*r}x+${r*r} = 0 in two steps: Step 1: "(x−${r})² = 0". Step 2: "So x−${r} = 0 or x+${r} = 0, giving x = ${r} or x = −${r}." Evaluate.`,
      ...buildOptions(
        `Step 1 is correct; Step 2 is wrong — from (x−${r})² = 0, the only conclusion is x−${r} = 0 (i.e. x = ${r}), not two values; the student incorrectly applied a difference-of-squares pattern`,
        [
          `Both steps correct — a perfect square can be factored either way`,
          `Step 1 is wrong — the expression doesn't factor as a perfect square`,
          `Step 2 is correct — when squaring is involved, you always take both ± values`
        ]
      ),
    };
  },
},

{
  id: "Bm11",
  gapTag: "q-double-root",
  format: "double-root-sum-equals-itself",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student notes: "For a double root at x = ${r}, both roots equal ${r}, so the sum of roots = ${2*r} and product = ${r*r}. The equation is x²−${2*r}x+${r*r} = 0." A second student says "but there's really only one root, so sum = ${r} and product = ${r}." Who is right?`,
      ...buildOptions(
        `The first student is right — Vieta's formulas count roots with multiplicity; a double root at ${r} contributes ${r}+${r} = ${2*r} to the sum and ${r}·${r} = ${r*r} to the product`,
        [
          `The second student is right — a double root has only one distinct value, so it counts once in Vieta's`,
          `Both are right — the formulas give different valid forms of the same polynomial`,
          `Neither is right — Vieta's formulas require two distinct roots to be applied`
        ]
      ),
    };
  },
},

{
  id: "Bm12",
  gapTag: "q-double-root",
  format: "non-integer-double-root-exact",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const q = pick([2,3,5,7]); // q for denominator
    // double root at p/q: a(x - p/q)² = 0 => q²x² - 2pqx + p² = 0
    return {
      text: `A quadratic equation has a double root at x = ${p}/${q}. A student writes the monic equation as x²−${2*p}/${q}x+${p*p}/${q*q} = 0, then clears denominators by multiplying by ${q*q} to get ${q*q}x²−${2*p*q}x+${p*p} = 0. Is this valid, and is the result still a "monic" equation?`,
      ...buildOptions(
        `Multiplying through by ${q*q} is valid (preserves roots), but the result is not monic — the leading coefficient is ${q*q} ≠ 1`,
        [
          `Invalid — multiplying by ${q*q} changes the roots`,
          `Valid and the result is still monic — "monic" refers to having rational coefficients`,
          `Valid but unnecessary — the fractional form is the preferred standard form`
        ]
      ),
    };
  },
},

{
  id: "Bm13",
  gapTag: "q-double-root",
  format: "double-root-quadratic-from-cubic-factor",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const s = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A cubic p(x) = (x−${r})²(x−${s}) = 0 has a double root at x = ${r}. A student "extracts the quadratic part" as (x−${r})² = 0 and says x = ${r} is a double root of this quadratic. Is this extraction valid?`,
      ...buildOptions(
        `Valid — (x−${r})² = 0 as a standalone equation has x = ${r} as a double root; extracting it from the cubic is legitimate when analyzing multiplicity`,
        [
          `Invalid — you cannot separate factors of a cubic to analyze roots; all roots must be considered simultaneously`,
          `Valid but x = ${r} becomes a single root in the extracted quadratic, not double`,
          `Invalid — (x−${r})² = 0 is a degree-2 equation, and extracting it changes the leading coefficient`
        ]
      ),
    };
  },
},

{
  id: "Bm14",
  gapTag: "q-double-root",
  format: "double-root-and-coefficient-sign-pattern",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `For x²−${2*r}x+${r*r} = 0 with double root x = ${r} > 0: a student claims "for any quadratic with a positive double root, b < 0 and c > 0." Evaluate this as a general rule.`,
      ...buildOptions(
        `Correct for monic quadratics — if double root r > 0, then b = −2r < 0 and c = r² > 0; this generalizes to leading coefficient a: b = −2ar, sign depends on sign of a`,
        [
          `Incorrect — b and c can be any sign regardless of the double root's sign`,
          `Correct only when the leading coefficient is positive; for a < 0 the signs reverse for b but not c`,
          `Incorrect — b < 0 holds but c = 0 always for a positive double root`
        ]
      ),
    };
  },
},

{
  id: "Bm15",
  gapTag: "q-double-root",
  format: "double-root-perturbation-effect",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `x²−${2*r}x+${r*r} = 0 has a double root at x = ${r}. A student adds ε to c to get x²−${2*r}x+(${r*r}+ε) = 0. For small ε > 0, what happens to the roots?`,
      ...buildOptions(
        `D = (${2*r})²−4(${r*r}+ε) = −4ε < 0 — the double root splits into two complex conjugate roots; any positive perturbation of c eliminates real roots`,
        [
          `The double root splits into two distinct real roots slightly different from ${r}`,
          `The equation still has a double root, now at x = ${r}+ε`,
          `D = −4ε means one root disappears; the other root remains at x = ${r}`
        ]
      ),
    };
  },
},

{
  id: "Bm16",
  gapTag: "q-double-root",
  format: "double-root-system-of-equations",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student must find a and b such that ax²+bx+9 = 0 has a double root at x = ${r}. They set up: (1) sum of roots: ${2*r} = −b/a, (2) product of roots: ${r*r} = 9/a. Solve and verify.`,
      ...buildOptions(
        `From (2): a = 9/${r*r}; from (1): b = −${2*r}·a = −${2*r}·(9/${r*r}) = −${18*r}/${r*r} = −${18/r}${Number.isInteger(18/r) ? '' : ' (non-integer if r does not divide 18)'}; verify D = b²−4ac = 0`,
        [
          `a = ${r*r}, b = −${2*r}·9 — using product = r² incorrectly as a = r²`,
          `a = 1, b = −${2*r} — ignoring that c = 9 constrains a through the product formula`,
          `No solution exists — you cannot freely choose both a and b when c is fixed`
        ]
      ),
    };
  },
},

{
  id: "Bm17",
  gapTag: "q-double-root",
  format: "double-root-implies-perfect-square-trinomial",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7]);
    const r = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student claims: "Every quadratic with a double root is a perfect square trinomial." Another says: "Only monic quadratics with double roots are perfect square trinomials." Who is correct?`,
      ...buildOptions(
        `Neither is precisely right — ${a}(x−${r})² = ${a}x²−${2*a*r}x+${a*r*r} has a double root and is a perfect square (${a} times a perfect square), but "perfect square trinomial" in the standard sense includes non-monic examples; both students are partially right`,
        [
          `The first student is fully correct — any double-root quadratic factors as k(x−r)² which is always a perfect square`,
          `The second student is fully correct — non-monic quadratics with double roots are not perfect square trinomials`,
          `Both are wrong — perfect square trinomials must have integer coefficients, which double-root quadratics may not`
        ]
      ),
    };
  },
},

{
  id: "Bm18",
  gapTag: "q-double-root",
  format: "double-root-equation-family",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `How many distinct monic quadratic equations have x = ${r} as a double root? A student says "infinitely many, by varying the leading coefficient." Another says "exactly one: x²−${2*r}x+${r*r} = 0." Who is correct and why?`,
      ...buildOptions(
        `The second student is correct — a monic quadratic (a=1) with double root ${r} is uniquely determined: it must be (x−${r})² = x²−${2*r}x+${r*r}; varying a would make it non-monic`,
        [
          `The first student is correct — there are infinitely many quadratics with double root ${r}, even restricting to monic ones`,
          `Both are wrong — there are exactly two: one with positive and one with negative leading term`,
          `The second student is correct, but only because ${r} is a positive integer; irrational double roots allow multiple monic equations`
        ]
      ),
    };
  },
},

{
  id: "Bm19",
  gapTag: "q-double-root",
  format: "double-root-in-disguised-equation",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student is given (${r}x−${r*r})² = 0 and says "the double root is x = ${r*r} because that's the constant." Find the correct double root and identify the student's error.`,
      ...buildOptions(
        `The double root is x = ${r} — set ${r}x−${r*r} = 0 to get x = ${r*r}/${r} = ${r}; the student confused the constant term ${r*r} with the solution`,
        [
          `The double root is x = ${r*r}/${r} = ${r} and the student is correct`,
          `The double root is x = 0 — since the expression equals zero`,
          `The equation has no double root because it's a perfect square, not a quadratic`
        ]
      ),
    };
  },
},

{
  id: "Bm20",
  gapTag: "q-double-root",
  format: "double-root-and-discriminant-chain-full",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const a = pick([2,3,4,5,6,7]);
    return {
      text: `A student analyzes ${a}x²−${2*a*r}x+${a*r*r} = 0 with this chain: "Step 1: D = (${2*a*r})²−4·${a}·${a*r*r} = ${4*a*a*r*r}−${4*a*a*r*r} = 0. Step 2: D = 0 means double root. Step 3: double root = −b/(2a) = ${2*a*r}/(${2*a}) = ${r}." Evaluate all three steps.`,
      ...buildOptions(
        `All three steps are correct — D = 0 is computed accurately, D = 0 ↔ double root is the correct theorem, and the double root formula −b/(2a) gives ${r}`,
        [
          `Step 1 correct, Step 2 correct, Step 3 wrong — double root should use the quadratic formula, not −b/(2a)`,
          `Step 1 correct, Steps 2 and 3 wrong — D = 0 means the roots are equal but not necessarily real`,
          `Steps 1 and 3 correct, Step 2 wrong — D = 0 indicates the vertex is on the x-axis, not a double root`
        ]
      ),
    };
  },
},

// ─── q-div-by-var mastery (Cm1–Cm20) ─────────────────────────────────────────

{
  id: "Cm1",
  gapTag: "q-div-by-var",
  format: "three-step-division-loss-analysis",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student solves x(${a}x+${b}) = 0 in three steps: Step 1: expand to ${a}x²+${b}x = 0. Step 2: divide by x to get ${a}x+${b} = 0. Step 3: solve to get x = −${b}/${a}. Evaluate all steps.`,
      ...buildOptions(
        `Steps 1 and 3 are valid, but Step 2 is invalid — dividing by x loses the solution x = 0; the correct method is to keep the factored form from Step 1 and set each factor to zero`,
        [
          `All steps valid — x = −${b}/${a} is the only solution because x = 0 makes the original equation trivially true`,
          `Step 1 is invalid — expanding destroys the factored structure`,
          `Steps 1 and 2 valid, Step 3 invalid — after dividing by x, you get ${a}x = −${b}, so x = ${b}/${a} (sign error)`
        ]
      ),
    };
  },
},

{
  id: "Cm2",
  gapTag: "q-div-by-var",
  format: "division-by-expression-with-root",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const k = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const m = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student solves ${k}x²−${m*k}x = 0 by dividing both sides by (x−${m}) to get ${k}x = 0, then x = 0. Identify what root is lost and why.`,
      ...buildOptions(
        `The root x = ${m} is lost — (x−${m}) = 0 when x = ${m}, so dividing by (x−${m}) is illegal at that value; correct factoring: ${k}x(x−${m}) = 0 gives x = 0 or x = ${m}`,
        [
          `No root is lost — x = 0 is the only solution to a quadratic with no constant term`,
          `The root x = −${m} is lost — the student should have divided by (x+${m})`,
          `The root x = ${k} is lost — dividing by ${k} before x loses the coefficient information`
        ]
      ),
    };
  },
},

{
  id: "Cm3",
  gapTag: "q-div-by-var",
  format: "cancellation-in-rational-equation",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student cancels x from (${a}x²+${b}x)/x = 0 to get ${a}x+${b} = 0. They claim "division by x is valid because we can assume x ≠ 0 in a rational expression." Evaluate.`,
      ...buildOptions(
        `Partially correct reasoning but leads to an incomplete solution — x = 0 must be checked separately as a potential root of the original equation (numerator); here x = 0 satisfies the numerator, making 0/0 undefined, so x = 0 is not actually a solution and the student's final answer may still be complete`,
        [
          `Fully correct — in rational expressions x ≠ 0 is always assumed, so cancellation is valid`,
          `Fully incorrect — you can never divide a polynomial equation by a variable`,
          `Correct only if ${a}x+${b} = 0 has no solution; otherwise the cancellation creates extraneous roots`
        ]
      ),
    };
  },
},

{
  id: "Cm4",
  gapTag: "q-div-by-var",
  format: "squaring-introduces-extraneous",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const k = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student solves x² = ${k}x by dividing by x: x = ${k}. They then verify: ${k}² = ${k*k} and ${k}·${k} = ${k*k} ✓. They conclude x = ${k} is the only solution. What error occurred?`,
      ...buildOptions(
        `x = 0 is also a solution (0² = ${k}·0 = 0) but was lost by dividing by x; the student's verification confirms x = ${k} but doesn't check x = 0`,
        [
          `No error — x = ${k} is the only non-trivial solution and verification confirms it`,
          `The verification is wrong — ${k}² ≠ ${k}·${k} for general k`,
          `x = −${k} is also a solution, lost by not taking the negative square root`
        ]
      ),
    };
  },
},

{
  id: "Cm5",
  gapTag: "q-div-by-var",
  format: "factoring-vs-dividing-comparison",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `Two students solve ${a}x²+${b}x = 0. Student A factors: x(${a}x+${b}) = 0 → x = 0 or x = −${b}/${a}. Student B divides by x: ${a}x+${b} = 0 → x = −${b}/${a}. Compare their methods and results.`,
      ...buildOptions(
        `Student A's method is correct and complete (two solutions); Student B's method is invalid (division by variable) and misses x = 0`,
        [
          `Both methods are equally valid; Student B simply chose to find the non-zero solution`,
          `Student A has an error: x = 0 cannot be a root because substituting x = 0 gives 0 = 0 (trivially true), not a real root`,
          `Student B's method is preferred because it's simpler; x = 0 is a trivial solution and can always be excluded`
        ]
      ),
    };
  },
},

{
  id: "Cm6",
  gapTag: "q-div-by-var",
  format: "higher-power-div-by-var-cascade",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student solves ${a}x³+${b}x² = 0 by dividing by x²: ${a}x+${b} = 0, giving x = −${b}/${a}. How many solutions are lost and what are they?`,
      ...buildOptions(
        `Two solutions are lost: x = 0 is a double root (x² is a factor), giving the complete solution set {0, 0, −${b}/${a}}; dividing by x² eliminates x = 0 with multiplicity 2`,
        [
          `One solution is lost: x = 0 (simple root), giving solution set {0, −${b}/${a}}`,
          `No solutions are lost: x = 0 doesn't satisfy the original equation`,
          `One solution lost: x = ${b}/${a} (with opposite sign due to the division)`
        ]
      ),
    };
  },
},

{
  id: "Cm7",
  gapTag: "q-div-by-var",
  format: "conditional-division-validity",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const k = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const m = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student solving ${k}x² = ${m*k}x writes: "I'll divide by x IF x ≠ 0 to get ${k}x = ${m*k}, so x = ${m}. Then I check x = 0: LHS = 0, RHS = 0 ✓, so x = 0 is also a solution." Is this approach valid?`,
      ...buildOptions(
        `Yes, fully valid — explicitly conditioning on x ≠ 0 before dividing, then separately verifying x = 0, is a rigorous approach yielding both solutions x = 0 and x = ${m}`,
        [
          `Invalid — once you divide by x you cannot recover x = 0 by substitution`,
          `Invalid — you cannot divide by x under any condition in an equation`,
          `Valid but redundant — x = 0 satisfies any equation of the form ax² = bx, so no verification is needed`
        ]
      ),
    };
  },
},

{
  id: "Cm8",
  gapTag: "q-div-by-var",
  format: "div-by-var-in-word-problem-context",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A rectangle has length ${r} times its width w. Area = ${r}w² = 0 after setting up an equation. A student divides by w: ${r}w = 0, so w = 0. They discard w = 0 as "not physical." Is their procedure correct?`,
      ...buildOptions(
        `The algebra is wrong — ${r}w² = 0 means w = 0 (with multiplicity 2); dividing by w gives ${r}w = 0, still w = 0; no solution is lost here because 0 is the only root. However, dividing by w is technically invalid since w could be 0`,
        [
          `Correct procedure — dividing by w is valid in a physical context where w > 0`,
          `Wrong procedure and wrong conclusion — dividing by w loses the root w = 0, and there are actually two roots`,
          `Correct procedure, but they should also check w = ${r} as a second solution`
        ]
      ),
    };
  },
},

{
  id: "Cm9",
  gapTag: "q-div-by-var",
  format: "disguised-div-by-var-via-simplification",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student simplifies (${a}x²+${b}x)/(x) = ${a}x+${b} and then sets ${a}x+${b} = 0 to solve. A classmate warns "you divided by x." The student replies "I simplified a fraction, not an equation." Who is right?`,
      ...buildOptions(
        `The classmate is right in spirit — simplifying (${a}x²+${b}x)/x loses the domain restriction; if the original equation was (${a}x²+${b}x)/x = 0, then x ≠ 0 must hold, but x = 0 should be checked in the original equation as a potential hole`,
        [
          `The student is right — algebraic simplification of fractions is always valid`,
          `The student is right — "dividing an equation" and "simplifying a fraction" are completely different operations with no shared concern`,
          `The classmate is right — no simplification involving x in the denominator is ever valid`
        ]
      ),
    };
  },
},

{
  id: "Cm10",
  gapTag: "q-div-by-var",
  format: "div-by-var-produces-wrong-solution-count",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student claims: "${a}x²+${b}x = 0 is a quadratic, so it must have exactly 2 solutions (counting multiplicity). But dividing by x gives only 1 solution. Therefore dividing by x must be wrong." Is this reasoning valid?`,
      ...buildOptions(
        `Valid reasoning in outcome but slightly imprecise — the quadratic does have 2 solutions: x = 0 and x = −${b}/${a}; division by x loses x = 0, leaving only one solution; the student's conclusion that division by x is wrong is correct`,
        [
          `Invalid — a quadratic can have 1 solution (double root), so getting 1 solution doesn't prove division was wrong`,
          `Invalid — ${a}x²+${b}x = 0 has only 1 solution because the equation is missing a constant term`,
          `Valid reasoning and the argument is a complete proof that dividing by x is always invalid`
        ]
      ),
    };
  },
},

{
  id: "Cm11",
  gapTag: "q-div-by-var",
  format: "zero-product-vs-division",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x(${a}x+${b}) = 0, a student applies the zero-product property to get x = 0 or ${a}x+${b} = 0. Another student says "zero-product property requires both factors to be present; if I divide by x first, the property can't apply." Evaluate.`,
      ...buildOptions(
        `The first student is correct and the second is confused — the zero-product property should be applied before any division; dividing by x first destroys a factor and prevents proper application of the property`,
        [
          `The second student is correct — zero-product property requires a specific setup that division disrupts`,
          `Both are correct — either method yields the same solutions`,
          `The second student is correct, but only for quadratics; for higher-degree equations, division first is acceptable`
        ]
      ),
    };
  },
},

{
  id: "Cm12",
  gapTag: "q-div-by-var",
  format: "exponent-equation-div-by-var-analog",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const k = pick([3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student solves x² = ${k}x² (incorrect equation setup for a problem) by dividing both sides by x²: 1 = ${k}. They conclude "no solution." Is the approach correct?`,
      ...buildOptions(
        `The approach is wrong — dividing by x² requires x ≠ 0; x = 0 must be checked separately (0² = ${k}·0² = 0 ✓, so x = 0 is a solution); the equation x² = ${k}x² simplifies to (1−${k})x² = 0, giving x = 0`,
        [
          `Correct approach and conclusion — 1 = ${k} is a contradiction proving no solution`,
          `Correct approach, but the student should also verify x = ${k} as a secondary solution`,
          `Incorrect approach — dividing by x² is always valid; the error is the original equation setup`
        ]
      ),
    };
  },
},

{
  id: "Cm13",
  gapTag: "q-div-by-var",
  format: "div-by-var-and-graph-interpretation",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `The graph of y = ${a}x²+${b}x crosses the x-axis at x = 0 and x = −${b}/${a}. A student who divided by x only finds x = −${b}/${a}. They say "the graph confirms my answer since I can see the non-zero root." Evaluate this self-checking strategy.`,
      ...buildOptions(
        `The strategy is incomplete — the graph clearly shows two x-intercepts (x = 0 and x = −${b}/${a}); relying on the graph to "confirm" while ignoring the visible x = 0 intercept is an inconsistent use of evidence`,
        [
          `Valid strategy — graphical confirmation is always sufficient to verify algebraic solutions`,
          `Valid strategy — x = 0 is a trivial root not worth confirming graphically`,
          `The strategy would work if the student uses a calculator graph; hand-drawn graphs are insufficient`
        ]
      ),
    };
  },
},

{
  id: "Cm14",
  gapTag: "q-div-by-var",
  format: "polynomial-identity-vs-equation",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student sees x·(x+${a}) = x²+${a}x (an identity) and concludes "since I can divide both sides of the identity by x to get x+${a} = x+${a}, division by x is always valid." Apply this logic to the equation x²+${a}x = 0 and evaluate.`,
      ...buildOptions(
        `Flawed logic — dividing both sides of an identity by x is valid (it remains an identity for x ≠ 0), but for the equation x²+${a}x = 0, dividing by x loses the root x = 0 because equations and identities have different purposes; you cannot transfer identity logic to equations`,
        [
          `Valid logic — if division by x is valid for identities, it must be valid for equations too`,
          `Valid only for equations of degree ≥ 2; identities and equations follow the same algebraic rules`,
          `Flawed because x·(x+${a}) ≠ x²+${a}x; the identity itself is wrong`
        ]
      ),
    };
  },
},

{
  id: "Cm15",
  gapTag: "q-div-by-var",
  format: "div-by-var-in-parametric-family",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const k = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student solves kx² = ${k}x (for parameter k) by dividing by x: kx = ${k}, so x = ${k}/k = 1. They say "x = 1 for any k." Evaluate, including what happens at k = 0.`,
      ...buildOptions(
        `Incorrect approach — division by x loses x = 0 as a solution; also, if k = 0 the equation 0 = 0 is an identity (all x work); for k ≠ 0, correct solutions are x = 0 and x = ${k}/k = 1`,
        [
          `Correct — x = 1 is always a solution regardless of k, and k = 0 is excluded because it makes the equation degenerate`,
          `Mostly correct, but x = 1/k not x = 1 when k is treated as a variable coefficient`,
          `Correct for k ≠ 0; for k = 0 the equation has no solution`
        ]
      ),
    };
  },
},

{
  id: "Cm16",
  gapTag: "q-div-by-var",
  format: "correct-factoring-method-full-chain",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student writes out: "${a}x²+${b*a}x = 0 → factor: ${a}x(x+${b}) = 0 → zero product: ${a}x = 0 or x+${b} = 0 → x = 0 or x = −${b}." Evaluate each step of this chain.`,
      ...buildOptions(
        `All steps are correct — factoring out ${a}x is valid (GCF), zero-product property is correctly applied to both factors, and both solutions x = 0 and x = −${b} are found`,
        [
          `Step 3 is wrong — zero-product property requires exactly two factors; setting ${a}x = 0 conflates the coefficient with the factor`,
          `Step 2 is wrong — the correct factoring is x(${a}x+${b*a}) = 0, not ${a}x(x+${b}) = 0`,
          `All steps correct but step 3 should apply the property as (${a})(x) = 0, giving x = 0 only, and separately x+${b} = 0`
        ]
      ),
    };
  },
},

{
  id: "Cm17",
  gapTag: "q-div-by-var",
  format: "mutual-division-both-sides",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student solves ${a}x² = ${b}x by dividing both sides by x: "left side gives ${a}x, right side gives ${b}, so ${a}x = ${b} and x = ${b}/${a}." They note "both sides were divided equally so it's valid." Evaluate this justification.`,
      ...buildOptions(
        `The justification is flawed — "dividing both sides equally" is only valid when the divisor is non-zero; since x = 0 might be a solution, dividing by x at x = 0 is 0/0 which is undefined; the operation loses x = 0`,
        [
          `Valid justification — dividing both sides by the same expression is always a legal algebraic operation`,
          `Valid justification — equality is preserved under division by any non-zero constant, and x is treated as non-zero`,
          `Invalid, but for the wrong reason — the issue is that the student should divide by ${a}x, not x alone`
        ]
      ),
    };
  },
},

{
  id: "Cm18",
  gapTag: "q-div-by-var",
  format: "div-by-var-and-solution-count-proof",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student argues: "The Fundamental Theorem of Algebra says ${a}x²+${b}x = 0 has exactly 2 roots counting multiplicity. I found x = 0 and x = −${b}/${a}, which are 2 distinct roots. So my work is complete whether or not I used division by x." Evaluate this use of FTA.`,
      ...buildOptions(
        `The conclusion (2 roots found) is correct, but the argument is backward — the FTA guarantees 2 roots exist, it doesn't validate the method used to find them; if division by x had been used incorrectly, FTA cannot retroactively justify the approach`,
        [
          `Valid use of FTA — if the theorem guarantees 2 roots and you found 2, the method must be correct`,
          `Invalid — FTA applies only to polynomials with complex coefficients, not real ones`,
          `Valid — FTA is the proper justification for confirming no roots are missing`
        ]
      ),
    };
  },
},

{
  id: "Cm19",
  gapTag: "q-div-by-var",
  format: "chain-error-then-check",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student solves ${a}x²+${b}x = 0 incorrectly (divides by x), gets x = −${b}/${a}, then substitutes back: ${a}·(${b}/${a})²+${b}·(−${b}/${a}) = ${b*b/a}−${b*b/a} = 0 ✓. They say "verification confirms my solution is complete." Evaluate.`,
      ...buildOptions(
        `Verification confirms x = −${b}/${a} is a valid root, but it cannot confirm the solution set is complete; x = 0 was never tested and is also a root; the student's verification only confirms what was already found, not that nothing is missing`,
        [
          `Verification is complete — if the found solution satisfies the equation, no other solutions exist`,
          `Verification is invalid — the substitution arithmetic is wrong`,
          `Verification is valid and complete because quadratics can only have two roots and the student found the correct non-zero one`
        ]
      ),
    };
  },
},

{
  id: "Cm20",
  gapTag: "q-div-by-var",
  format: "domain-restriction-and-lost-root",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student is told "x > 0 in this problem context" and solves ${a}x²+${b}x = 0 by dividing by x: x = −${b}/${a}. Since −${b}/${a} < 0, they conclude "no valid solution in this domain." Is this reasoning fully correct?`,
      ...buildOptions(
        `The final conclusion may be right but the reasoning has a flaw — x = 0 is also a solution of the equation, and while x = 0 is excluded by x > 0 (strict inequality), the student should acknowledge x = 0 was lost during division; x > 0 rules out both solutions, so "no valid solution" is correct but for incomplete reasons`,
        [
          `Fully correct — domain restrictions allow division by x since x > 0 guarantees x ≠ 0`,
          `Incorrect conclusion — x = −${b}/${a} should be reconsidered because domain restrictions can change sign conventions`,
          `Fully correct — the domain restriction x > 0 makes dividing by x valid and the analysis complete`
        ]
      ),
    };
  },
},

// ─── q-factoring mastery (Dm1–Dm20) ──────────────────────────────────────────

{
  id: "Dm1",
  gapTag: "q-factoring",
  format: "factor-by-grouping-error-analysis",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const q = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student factors ${p*q}x²+(${p}+${q})x+1 by grouping: "${p*q}x²+${p}x+${q}x+1 = ${p}x(${q}x+1)+1(${q}x+1) = (${p}x+1)(${q}x+1)." Verify the factoring and the grouping split.`,
      ...buildOptions(
        `Correct — the middle term ${p+q} is split as ${p}+${q}, grouping gives ${p}x(${q}x+1)+1·(${q}x+1) = (${p}x+1)(${q}x+1); expanding back: ${p*q}x²+(${p}+${q})x+1 ✓`,
        [
          `Incorrect split — ${p}+${q} should be split as ${p*q} and 1 for grouping to work`,
          `Correct factoring but the grouping order matters: ${q}x+${p}x must be used instead`,
          `Incorrect — the GCF from the first group should be ${p*q}x, not ${p}x`
        ]
      ),
    };
  },
},

{
  id: "Dm2",
  gapTag: "q-factoring",
  format: "ac-method-full-chain-verification",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const r1 = pick([2,3,4,5,6,7,8,9,10]);
    const r2 = pick([2,3,4,5,6,7,8,9,10]);
    // Quadratic: a(x+r1)(x+r2) = ax²+a(r1+r2)x+a*r1*r2
    // For AC method: a*(a*r1*r2) = a²*r1*r2, split into a*r1 and a*r2
    const b = a*(r1+r2);
    const c = a*r1*r2;
    return {
      text: `Use the AC method to factor ${a}x²+${b}x+${c}: Step 1: AC = ${a}·${c} = ${a*c}. Step 2: find two numbers multiplying to ${a*c} and adding to ${b}: ${a*r1} and ${a*r2}. Step 3: rewrite and group. A student gets (x+${r1})(${a}x+${a*r2}). Is this correct?`,
      ...buildOptions(
        `Partially correct but unfactored — (x+${r1})(${a}x+${a*r2}) = ${a}(x+${r1})(x+${r2}), so the student should factor out ${a} to get the fully factored form; the roots are correct but leading coefficient is distributed incorrectly`,
        [
          `Fully correct — the AC method always produces factors of the form (x+m)(ax+n)`,
          `Incorrect — the AC method requires the first factor to always have leading coefficient 1`,
          `Incorrect — step 2 numbers should multiply to ${b} and add to ${a*c}, not the reverse`
        ]
      ),
    };
  },
},

{
  id: "Dm3",
  gapTag: "q-factoring",
  format: "difference-of-squares-misconception",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student claims x²+${r*r} factors as (x+${r})(x+${r}) = (x+${r})² because "both terms are perfect squares." Identify all errors.`,
      ...buildOptions(
        `Two errors: (1) x²+${r*r} is a sum of squares, not a difference — it does not factor over ℝ; (2) (x+${r})² = x²+${2*r}x+${r*r} ≠ x²+${r*r} (missing the middle term)`,
        [
          `One error: x²+${r*r} does factor, but as (x+${r}i)(x−${r}i) over ℂ, not as a real perfect square`,
          `One error: the correct factoring is (x+${r})(x−${r}) = x²−${r*r}, so the student used the wrong sign`,
          `No errors — both terms are perfect squares so the factoring is valid`
        ]
      ),
    };
  },
},

{
  id: "Dm4",
  gapTag: "q-factoring",
  format: "factoring-when-leading-coeff-negative",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const r1 = pick([2,3,4,5,6,7,8,9,10]);
    const r2 = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student factors −${a}x²+${a*(r1+r2)}x−${a*r1*r2} = 0. They write −${a}(x²−${r1+r2}x+${r1*r2}) = −${a}(x−${r1})(x−${r2}), concluding roots are x = ${r1} and x = ${r2}. Verify.`,
      ...buildOptions(
        `Correct — factoring out −${a} gives −${a}(x−${r1})(x−${r2}) = 0; since −${a} ≠ 0, the equation reduces to (x−${r1})(x−${r2}) = 0, giving x = ${r1} and x = ${r2}`,
        [
          `Incorrect — factoring out a negative changes the signs of the roots; roots become x = −${r1} and x = −${r2}`,
          `Incorrect — you cannot factor out a negative coefficient in a quadratic equation`,
          `Correct factoring but incorrect roots: the negative outside means roots are x = ${r1}·(−1) and x = ${r2}·(−1)`
        ]
      ),
    };
  },
},

{
  id: "Dm5",
  gapTag: "q-factoring",
  format: "irreducible-over-integers-vs-reals",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,5,7,11]);
    return {
      text: `A student claims x²+${p}x+${p} is "irreducible" because they cannot find integer factors. Another student says "it factors over the reals using the quadratic formula since D = ${p*p-4*p}." Who is correct and what is the precise distinction?`,
      ...buildOptions(
        `Both are making valid but different claims — "irreducible over ℤ" (no integer factoring) is different from "irreducible over ℝ"; if D = ${p*p-4*p} ${p*p-4*p >= 0 ? '≥ 0, the polynomial does factor over ℝ into linear factors (possibly with irrational coefficients)' : '< 0, it is irreducible over ℝ as well — no real factors exist'}`,
        [
          `The first student is fully correct — irreducibility over integers implies irreducibility over reals`,
          `The second student is fully correct — any quadratic factors over the reals if you allow the quadratic formula`,
          `Both are wrong — factorability is only defined over ℚ (the rationals) for school-level algebra`
        ]
      ),
    };
  },
},

{
  id: "Dm6",
  gapTag: "q-factoring",
  format: "factoring-with-common-factor-first",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const g = pick([2,3,4,5,6,7]);
    const a = pick([2,3,4,5,6,7]);
    const b = pick([2,3,4,5,6,7]);
    const c = pick([2,3,4,5,6,7]);
    return {
      text: `A student factors ${g*a}x²+${g*b}x+${g*c} = 0 directly without first pulling out the GCF ${g}. They try the AC method with AC = ${g*a}·${g*c} = ${g*a*g*c}. Evaluate whether this leads to a correct but unnecessarily complicated process.`,
      ...buildOptions(
        `Yes — ignoring the GCF ${g} makes AC = ${g*a*g*c} instead of ${a*c}, requiring larger factor pairs; the answer is still correct but pulling out ${g} first simplifies the AC product by a factor of ${g*g}`,
        [
          `No — the AC method handles any leading coefficient; GCF step is optional and never required`,
          `Yes — and it leads to incorrect roots because the GCF changes the solutions`,
          `No — you cannot apply the AC method when a GCF exists; factoring GCF first is mandatory`
        ]
      ),
    };
  },
},

{
  id: "Dm7",
  gapTag: "q-factoring",
  format: "verify-factoring-by-expansion",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const q = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student factors x²+(${p}+${q})x+${p*q} as (x+${p})(x+${q}). A classmate challenges: "That only works if p·q = c and p+q = b; you haven't shown this is the ONLY factoring." How should the student respond?`,
      ...buildOptions(
        `The student should note that a monic quadratic has a unique factoring over ℝ into linear factors (when D ≥ 0); the factoring (x+${p})(x+${q}) is verified by expansion: x²+${p+q}x+${p*q}, and since b = ${p+q} and c = ${p*q} match, this is the unique factoring`,
        [
          `The classmate is right — there could be multiple factorings with different pairs summing to ${p+q}`,
          `The student should prove uniqueness using the Fundamental Theorem of Algebra, which is required for completeness`,
          `The classmate is right — the factoring is only one of infinitely many equivalent forms`
        ]
      ),
    };
  },
},

{
  id: "Dm8",
  gapTag: "q-factoring",
  format: "incorrect-sign-in-factoring-chain",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const q = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student factors x²−${p+q}x+${p*q} and writes (x+${p})(x+${q}). They verify: "product of constants = ${p}·${q} = ${p*q} = c ✓, sum of constants = ${p}+${q} = ${p+q} = −b... wait, b = −${p+q}, so −b = ${p+q} ✓." Find the error.`,
      ...buildOptions(
        `The factoring is wrong — for x²−${p+q}x+${p*q}, the factors are (x−${p})(x−${q}); the student used + signs in the factors but the middle term is negative; (x+${p})(x+${q}) gives x²+${p+q}x+${p*q} (wrong sign on b)`,
        [
          `No error — the student correctly verified both conditions using −b`,
          `Minor error — the student should verify by substituting roots, not by checking b and c`,
          `The error is in checking c: product should equal −c, not c, for the factored form to be correct`
        ]
      ),
    };
  },
},

{
  id: "Dm9",
  gapTag: "q-factoring",
  format: "non-integer-root-factoring-attempt",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([3,4,5,6,7,8,9,10,11,12]);
    const b = pick([3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student tries to factor ${a}x²+${b}x+${c} over the integers and fails. They conclude "this quadratic has no solutions." Evaluate and correct this conclusion.`,
      ...buildOptions(
        `Incorrect conclusion — failing to factor over the integers means the roots are not rational, not that they don't exist; use the quadratic formula: D = ${b*b}-4·${a}·${c} = ${b*b-4*a*c}; if D ≥ 0, real (possibly irrational) solutions exist`,
        [
          `Correct — if a quadratic cannot be factored over the integers, it has no real solutions`,
          `Correct — integer factoring is the only valid method for school-level quadratics`,
          `Incorrect only for D = 0 — if D > 0, the quadratic always factors over the integers`
        ]
      ),
    };
  },
},

{
  id: "Dm10",
  gapTag: "q-factoring",
  format: "factor-theorem-application",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const a = pick([2,3,4,5,6,7]);
    const other_r = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student uses the Factor Theorem: "Since f(${r}) = ${a}·${r*r}−${a*(r+other_r)}·${r}+${a*r*other_r} = ${a*r*r - a*(r+other_r)*r + a*r*other_r}, if this equals 0 then (x−${r}) is a factor." Compute f(${r}) and determine if (x−${r}) is a factor of ${a}x²−${a*(r+other_r)}x+${a*r*other_r}.`,
      ...buildOptions(
        `f(${r}) = ${a}·${r*r}−${a*(r+other_r)}·${r}+${a*r*other_r} = ${a*r*r}−${a*(r+other_r)*r}+${a*r*other_r} = ${a*r*r - a*r*r - a*other_r*r + a*r*other_r} = 0, so (x−${r}) is a factor; the other factor is ${a}(x−${other_r})`,
        [
          `f(${r}) = ${a*r*r - a*(r+other_r)*r + a*r*other_r + 1} ≠ 0, so (x−${r}) is not a factor`,
          `The Factor Theorem only applies to monic polynomials; since a = ${a} ≠ 1, the test is invalid`,
          `f(${r}) = 0 confirms (x+${r}) is a factor, not (x−${r}) — the theorem uses opposite sign`
        ]
      ),
    };
  },
},

{
  id: "Dm11",
  gapTag: "q-factoring",
  format: "completing-square-vs-factoring-equivalence",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([4,6,8,10,12,14,16,18,20,22,24]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student factors x²+${b}x+${b*b/4} as (x+${b/2})². Another completes the square and gets (x+${b/2})² = 0. A third student says "these are different methods giving the same factored form — but completing the square works even when factoring over integers fails." Evaluate.`,
      ...buildOptions(
        `The third student is correct — both methods give (x+${b/2})² here; completing the square always produces the factored form over ℝ (via the quadratic formula) even when integer factoring is impossible`,
        [
          `Incorrect — completing the square and factoring are identical methods that always succeed or fail together`,
          `Incorrect — completing the square doesn't produce a factored form; it only helps find roots`,
          `The third student is partially right, but completing the square fails when D < 0 just as factoring does`
        ]
      ),
    };
  },
},

{
  id: "Dm12",
  gapTag: "q-factoring",
  format: "factoring-and-root-sign-trap",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const q = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student factors x²−${p-q}x−${p*q} and attempts (x−${p})(x+${q}): product = −${p*q} ✓, sum = ${q-p}. But b = −${p-q} = ${q-p}, so sum should be ${q-p}. The student says "sum checks out, factoring is correct." Verify.`,
      ...buildOptions(
        `The student is correct in this case — the Vieta check requires the constants in the factors to sum to b = ${q-p}; here ${-p}+${q} = ${q-p} ✓ and (${-p})(${q}) = ${-p*q} = c ✓; the factoring (x−${p})(x+${q}) is valid`,
        [
          `Incorrect — the sign of the product should be +${p*q}, not −${p*q}`,
          `Incorrect — the student mixed up which factor uses + and which uses −`,
          `Incorrect — the sum should equal +b = ${p-q}, not −b`
        ]
      ),
    };
  },
},

{
  id: "Dm13",
  gapTag: "q-factoring",
  format: "quadratic-with-two-approaches-compared",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r1 = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const r2 = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²−${r1+r2}x+${r1*r2} = 0: Student A factors to (x−${r1})(x−${r2}) = 0. Student B uses the quadratic formula with D = ${(r1+r2)*(r1+r2)-4*r1*r2} = ${(r1-r2)*(r1-r2)}. Both get x = ${r1} and x = ${r2}. Student C says "factoring is always preferable because it's exact." Evaluate Student C's claim.`,
      ...buildOptions(
        `Partially correct — factoring gives exact results when it works, but it only works efficiently for "nice" integer roots; the quadratic formula is always exact (not approximate) too; "preferable" depends on context, not exactness`,
        [
          `Fully correct — factoring is always exact while the quadratic formula introduces approximation errors`,
          `Fully correct — factoring is the only rigorous method; the quadratic formula is a shortcut`,
          `Fully incorrect — the quadratic formula is always preferred because factoring may miss solutions`
        ]
      ),
    };
  },
},

{
  id: "Dm14",
  gapTag: "q-factoring",
  format: "factoring-non-monic-by-substitution",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([3,4,5,6,7,8,9,10,11,12]);
    const r = pick([2,3,4,5,6,7,8,9,10]);
    const s = pick([2,3,4,5,6,7,8,9,10]);
    // a(x-r)(x-s) = ax² - a(r+s)x + a*r*s
    return {
      text: `A student substitutes u = √${a}·x to convert ${a}x²−${a*(r+s)}x+${a*r*s} = 0 into u²−${a*(r+s)/Math.sqrt(a).toFixed(4)}u+${a*r*s} = 0. They say "this makes it monic for easier factoring." Evaluate this substitution strategy.`,
      ...buildOptions(
        `The strategy is flawed — u = √${a}·x gives u² = ${a}x², so the equation becomes u²−√${a}·${a*(r+s)}·(u/√${a})+${a*r*s} = u²−${a*(r+s)}u/√${a}... actually u = √${a}x means x = u/√${a}; substituting makes the middle coefficient irrational, complicating rather than simplifying`,
        [
          `Valid strategy — the substitution always converts any quadratic to a monic one with the same roots`,
          `Valid strategy for this specific case but only works when a is a perfect square`,
          `Flawed, but for a different reason: u = √${a}·x changes the solutions so you'd need to back-substitute`
        ]
      ),
    };
  },
},

{
  id: "Dm15",
  gapTag: "q-factoring",
  format: "zero-product-property-misapplication",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const q = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student solves (x−${p})(x−${q}) = ${p*q} by setting x−${p} = ${p} and x−${q} = ${q}, getting x = ${2*p} and x = ${2*q}. Evaluate.`,
      ...buildOptions(
        `Incorrect — the zero-product property requires the product to equal 0, not ${p*q}; the student cannot split the factors unless the product is 0; correct approach: expand to x²−${p+q}x+${p*q} = ${p*q}, giving x²−${p+q}x = 0`,
        [
          `Correct — when a product equals k, each factor can equal √k`,
          `Partially correct — x = ${2*p} is valid but x = ${2*q} is extraneous`,
          `Correct strategy but computational error: x−${p} = ${q} and x−${q} = ${p} should be used instead`
        ]
      ),
    };
  },
},

{
  id: "Dm16",
  gapTag: "q-factoring",
  format: "factoring-over-complex-numbers",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const k = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `A student claims x²+${k*k} "cannot be factored at all." A classmate says "it factors as (x+${k}i)(x−${k}i) over ℂ." A third says "in a real-number course this factoring is meaningless." Evaluate all three positions.`,
      ...buildOptions(
        `The first student is wrong (it factors over ℂ), the second is correct (sum of squares factors over ℂ), the third is partially valid — for courses restricted to ℝ, this factoring is outside scope, but mathematically it is valid`,
        [
          `All three are correct — factoring is context-dependent and all three describe legitimate perspectives`,
          `The first student is correct; complex factoring is not considered "factoring" in algebra`,
          `The second student is correct and the third is wrong — mathematical facts are context-independent`
        ]
      ),
    };
  },
},

{
  id: "Dm17",
  gapTag: "q-factoring",
  format: "reconstruct-equation-from-partial-factoring",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const r = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student knows one factor of ${a}x²+${a*(r+1)}x+${a*r} is (x+${r}). They divide: ${a}x²+${a*(r+1)}x+${a*r} ÷ (x+${r}) = ${a}x+${a}. So the full factoring is ${a}(x+${r})(x+1). Verify.`,
      ...buildOptions(
        `Correct — dividing ${a}x²+${a*(r+1)}x+${a*r} by (x+${r}): polynomial long division gives ${a}x+${a} = ${a}(x+1); so full factoring = ${a}(x+${r})(x+1); expanding confirms ${a}(x²+(${r}+1)x+${r}) = ${a}x²+${a*(r+1)}x+${a*r} ✓`,
        [
          `Incorrect — polynomial division by a non-monic divisor requires dividing by the leading coefficient first`,
          `Incorrect — the full factoring should be (${a}x+${a*r})(x+1), keeping ${a} inside the first factor`,
          `Correct factoring but the GCF ${a} should be factored first, giving a monic quotient`
        ]
      ),
    };
  },
},

{
  id: "Dm18",
  gapTag: "q-factoring",
  format: "trial-and-error-vs-systematic-method",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([3,4,5,6,7,8,9,10,11,12]);
    const b = pick([3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student uses trial and error to factor ${a}x²+${b}x+${c} and tries 10 pairs before giving up, concluding "no factoring exists." Another uses the AC method and reaches the same conclusion. Who is more reliable, and how can either be certain?`,
      ...buildOptions(
        `The AC method is more reliable — it systematically checks all factor pairs of AC = ${a*c}; if no pair sums to ${b}, the polynomial is irreducible over ℤ; certainty comes from the finite, exhaustive nature of the AC check; trial and error may miss pairs`,
        [
          `Both are equally reliable — exhaustive trial and error is the same as the AC method`,
          `Neither is reliable — only the quadratic formula can definitively determine factorability`,
          `Trial and error is more reliable — systematic methods can make sign errors more easily`
        ]
      ),
    };
  },
},

{
  id: "Dm19",
  gapTag: "q-factoring",
  format: "factoring-with-substitution-u-equals-x-squared",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const q = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student solves x⁴−${p+q}x²+${p*q} = 0 by substituting u = x² to get u²−${p+q}u+${p*q} = 0, factoring as (u−${p})(u−${q}) = 0, getting u = ${p} or u = ${q}, then concluding x = ±√${p} or x = ±√${q}. Evaluate every step.`,
      ...buildOptions(
        `All steps are correct — u = x² transforms the biquadratic to a standard quadratic; factoring is valid; back-substituting gives x² = ${p} → x = ±√${p} and x² = ${q} → x = ±√${q}; four solutions total`,
        [
          `Step 3 is wrong — from u = ${p} you get x = √${p} only (positive square root)`,
          `Step 2 is wrong — u²−${p+q}u+${p*q} doesn't factor as (u−${p})(u−${q}) because ${p}·${q} ≠ ${p*q}`,
          `All steps valid but there are only two solutions total, not four`
        ]
      ),
    };
  },
},

{
  id: "Dm20",
  gapTag: "q-factoring",
  format: "factoring-applied-to-inequality",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const p = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const q = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student solves x²−${p+q}x+${p*q} < 0 by factoring: (x−${p})(x−${q}) < 0. They conclude x < ${Math.min(p,q)} or x > ${Math.max(p,q)} because "the product is negative when both factors are negative or both are positive." Evaluate.`,
      ...buildOptions(
        `Incorrect conclusion — (x−${Math.min(p,q)})(x−${Math.max(p,q)}) < 0 requires one factor positive and one negative, which occurs when ${Math.min(p,q)} < x < ${Math.max(p,q)}; the student described the case for > 0, not < 0`,
        [
          `Correct — a negative product requires both factors negative or both positive`,
          `Correct reasoning but wrong interval boundaries: should be x < ${Math.max(p,q)} or x > ${Math.min(p,q)}`,
          `Correct — the product of two negatives is positive, so x < ${Math.min(p,q)} is correct`
        ]
      ),
    };
  },
},

// ─── q-vieta mastery (Em1–Em20) ──────────────────────────────────────────────

{
  id: "Em1",
  gapTag: "q-vieta",
  format: "vieta-applied-to-non-monic",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For ${fmt(a,b,c)}, a student uses Vieta's as: sum = −b = −${b} and product = c = ${c}. Identify the error and state the correct values.`,
      ...buildOptions(
        `Error: for a non-monic quadratic, sum = −b/a = −${b}/${a} and product = c/a = ${c}/${a}; the student forgot to divide by the leading coefficient ${a}`,
        [
          `No error — Vieta's formulas always use −b and c regardless of the leading coefficient`,
          `Partial error: sum = −b/a is correct but product = c (no division needed)`,
          `The error is using b = ${b}; it should be the negative: sum = +${b} and product = −${c}`
        ]
      ),
    };
  },
},

{
  id: "Em2",
  gapTag: "q-vieta",
  format: "vieta-reverse-construct-equation",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const s = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const p = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student is told: sum of roots = ${s}, product of roots = ${p}. They construct x²+${s}x+${p} = 0. Is this correct?`,
      ...buildOptions(
        `Incorrect — sum of roots = −b/a implies b = −${s} (for monic a=1); the equation should be x²−${s}x+${p} = 0`,
        [
          `Correct — sum of roots = b and product = c for a monic quadratic`,
          `Correct — Vieta's formulas directly give b = sum and c = product`,
          `Incorrect — the constant term should be −${p}: product of roots = −c for monic quadratics`
        ]
      ),
    };
  },
},

{
  id: "Em3",
  gapTag: "q-vieta",
  format: "vieta-sum-product-to-expression",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²−${b}x+${c} = 0, roots are r and s. Without solving, find r²+s² using Vieta's formulas.`,
      ...buildOptions(
        `r²+s² = (r+s)²−2rs = ${b}²−2·${c} = ${b*b}−${2*c} = ${b*b-2*c}`,
        [
          `r²+s² = (r+s)² = ${b}² = ${b*b} — forgetting to subtract 2rs`,
          `r²+s² = (r−s)² = (r+s)²−4rs = ${b*b}−${4*c} = ${b*b-4*c} — confusing with the discriminant formula`,
          `r²+s² = r²·s² / (rs) = ${c*c}/${c} = ${c} — incorrectly using the product instead`
        ]
      ),
    };
  },
},

{
  id: "Em4",
  gapTag: "q-vieta",
  format: "vieta-with-negative-sum-product-sign-analysis",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²+${b}x−${c} = 0: sum of roots = −${b} < 0 and product = −${c} < 0. A student concludes: "Negative product means roots have opposite signs; negative sum means the negative root has larger absolute value." Evaluate.`,
      ...buildOptions(
        `Correct — product < 0 implies one positive and one negative root; if r > 0 and s < 0, sum = r+s = −${b} < 0 means |s| > r (the negative root dominates in magnitude)`,
        [
          `Incorrect — negative product means both roots are negative`,
          `First part correct (opposite signs), second part wrong — sum < 0 only means both roots sum negative, not which has larger absolute value`,
          `Incorrect — negative sum and negative product together mean both roots are negative with the product of negatives being positive, contradicting c = −${c}`
        ]
      ),
    };
  },
},

{
  id: "Em5",
  gapTag: "q-vieta",
  format: "vieta-used-to-find-parameter",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const r = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const k_val = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `x²+kx+${r*k_val} = 0 has roots whose sum is ${-k_val-r} and product is ${r*k_val}. A student uses Vieta's: −k = ${-k_val-r} → k = ${k_val+r}, and ${r*k_val}/1 = ${r*k_val} ✓. Find k and verify both Vieta conditions are consistent.`,
      ...buildOptions(
        `k = ${k_val+r}; sum check: −k = −${k_val+r} = ${-k_val-r} ✓; product check: c = ${r*k_val} ✓; both conditions consistent; the equation is x²+${k_val+r}x+${r*k_val} = 0`,
        [
          `k = ${k_val} — from product condition ${r*k_val} = r·k giving k = ${k_val}, ignoring the sum`,
          `k = ${r} — confusing k with one of the roots`,
          `No single k satisfies both conditions simultaneously — the system is overdetermined`
        ]
      ),
    };
  },
},

{
  id: "Em6",
  gapTag: "q-vieta",
  format: "vieta-and-symmetric-function-r-cubed-plus-s-cubed",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²−${b}x+${c} = 0, use Vieta's to compute r³+s³ without finding the roots. State each step.`,
      ...buildOptions(
        `r³+s³ = (r+s)(r²−rs+s²) = (r+s)((r+s)²−3rs) = ${b}·(${b*b}−3·${c}) = ${b}·${b*b-3*c} = ${b*(b*b-3*c)}`,
        [
          `r³+s³ = (r+s)³ = ${b}³ = ${b*b*b} — forgetting to subtract cross terms`,
          `r³+s³ = (r+s)(r²+s²) = ${b}·${b*b-2*c} = ${b*(b*b-2*c)} — using wrong identity for sum of cubes`,
          `r³+s³ = (rs)³ = ${c}³ = ${c*c*c} — confusing sum and product`
        ]
      ),
    };
  },
},

{
  id: "Em7",
  gapTag: "q-vieta",
  format: "vieta-proof-by-contradiction",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student proves: "x²+${b}x+${c} = 0 cannot have two positive roots — proof: if both roots r,s > 0, then r+s > 0, but Vieta gives r+s = −${b} < 0. Contradiction." Evaluate this proof.`,
      ...buildOptions(
        `Valid proof — assuming both roots positive implies their sum is positive, contradicting Vieta's r+s = −${b} < 0; the proof is complete and correct`,
        [
          `Invalid — the proof also needs to check the product condition`,
          `Invalid — Vieta's formulas only apply when D ≥ 0; the proof must first confirm real roots exist`,
          `Valid but incomplete — the proof shows roots cannot both be positive but doesn't show what they actually are`
        ]
      ),
    };
  },
},

{
  id: "Em8",
  gapTag: "q-vieta",
  format: "vieta-for-constructing-equations-with-transformed-roots",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    const k = pick([2,3,4,5]);
    return {
      text: `If r and s are roots of x²−${b}x+${c} = 0, construct a new equation whose roots are ${k}r and ${k}s. A student writes x²−${k*b}x+${k*k*c} = 0. Verify using Vieta's.`,
      ...buildOptions(
        `Correct — new sum = ${k}r+${k}s = ${k}(r+s) = ${k}·${b} = ${k*b}; new product = ${k}r·${k}s = ${k*k}·rs = ${k*k}·${c} = ${k*k*c}; equation: x²−${k*b}x+${k*k*c} = 0 ✓`,
        [
          `Incorrect — scaling roots by ${k} only scales the sum by ${k}, not the product`,
          `Incorrect — the new equation is x²−${k}·${b}x+${k}·${c} = 0; both coefficients scale by ${k}`,
          `Incorrect — the new equation should be obtained by substituting x = ${k}t into the original, giving different coefficients`
        ]
      ),
    };
  },
},

{
  id: "Em9",
  gapTag: "q-vieta",
  format: "vieta-and-sum-of-reciprocals",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²−${b}x+${c} = 0 with roots r and s, a student computes 1/r + 1/s = 1/(rs) = 1/${c}. Evaluate.`,
      ...buildOptions(
        `Incorrect — 1/r+1/s = (r+s)/(rs) = ${b}/${c}, not 1/(rs); the student added fractions incorrectly (treating 1/r+1/s as 1/(rs))`,
        [
          `Correct — 1/r+1/s = 1/(rs) by the reciprocal addition rule`,
          `Correct computation but only valid when rs ≠ 0, i.e. c ≠ 0`,
          `Incorrect — 1/r+1/s = (r+s)/(r·s) = ${b}·${c}, multiplying instead of dividing`
        ]
      ),
    };
  },
},

{
  id: "Em10",
  gapTag: "q-vieta",
  format: "vieta-applied-to-shifted-equation",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    const h = pick([2,3,4,5]);
    return {
      text: `Roots of x²+${b}x+${c} = 0 are r and s. A student finds the sum of roots of (x−${h})²+${b}(x−${h})+${c} = 0 using Vieta's on the new equation's expansion, and separately computes r+${h} and s+${h}. Do both methods give the same answer?`,
      ...buildOptions(
        `Yes — substituting y = x−${h} transforms the equation to y²+${b}y+${c} = 0 with roots r,s; back-substituting x = y+${h} gives roots r+${h}, s+${h}; their sum = (r+s)+${2*h} = −${b}+${2*h}; expanding the original shifted equation and applying Vieta's gives the same result`,
        [
          `No — Vieta's on the expanded equation counts the shift incorrectly and gives sum = −${b}`,
          `No — the substitution changes the product but not the sum, so only the product method agrees`,
          `Yes but only when h is an integer; irrational h would make the comparison invalid`
        ]
      ),
    };
  },
},

{
  id: "Em11",
  gapTag: "q-vieta",
  format: "vieta-sum-of-squares-inequality-check",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²+${b}x+${c} = 0, a student computes r²+s² = (r+s)²−2rs = ${b*b}−${2*c} = ${b*b-2*c} and says "since r²+s² must always be non-negative, this proves D ≥ 0 for this equation." Evaluate this reasoning.`,
      ...buildOptions(
        `Flawed reasoning — r²+s² ≥ 0 is true for real roots, but if D < 0 (complex roots), r²+s² can be negative (as the sum of squares of complex numbers is not necessarily non-negative); you cannot use r²+s² ≥ 0 to conclude D ≥ 0 without first assuming the roots are real`,
        [
          `Valid reasoning — r²+s² ≥ 0 is always true and does imply D ≥ 0`,
          `Valid reasoning but requires the additional step of confirming ${b*b-2*c} ≥ 0`,
          `Invalid only if c = 0; otherwise the reasoning is a valid proof of D ≥ 0`
        ]
      ),
    };
  },
},

{
  id: "Em12",
  gapTag: "q-vieta",
  format: "vieta-and-average-of-roots",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student says: "The average of the roots of ${fmt(a,b,c)} is −b/(2a) = −${b}/${2*a}, which equals the x-coordinate of the vertex." Verify both claims.`,
      ...buildOptions(
        `Both claims are correct — average of roots = (r+s)/2 = (−b/a)/2 = −b/(2a) = −${b}/${2*a}; the vertex x-coordinate is also −b/(2a); these are the same value, confirming the axis of symmetry passes through the average of the roots`,
        [
          `The average formula is correct, but the vertex x-coordinate is −b/a (without dividing by 2)`,
          `Both are correct, but only when a = 1; for non-monic quadratics the vertex formula is different`,
          `The average formula is correct; the vertex connection is coincidental, not a mathematical identity`
        ]
      ),
    };
  },
},

{
  id: "Em13",
  gapTag: "q-vieta",
  format: "vieta-for-cubic-vs-quadratic-confusion",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const a = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const b = pick([2,3,4,5,6,7,8,9,10]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student applies Vieta's formulas to x³+${a}x²+${b}x+${c} = 0 as "sum of all roots = −${a}, product of all roots = −${c}." Are these correct?`,
      ...buildOptions(
        `Sum = −${a} is correct (for monic cubic, sum of roots = −coefficient of x²); product = −${c} is correct for a cubic (product of roots = −constant term for monic cubic with degree 3); the signs follow from Vieta's for cubics`,
        [
          `Both incorrect — Vieta's only applies to quadratics, not cubics`,
          `Sum correct, product wrong — product of roots for a monic cubic is +${c}, not −${c}`,
          `Both correct, but only when all three roots are real; complex roots require a modified formula`
        ]
      ),
    };
  },
},

{
  id: "Em14",
  gapTag: "q-vieta",
  format: "vieta-find-expression-r2s-plus-rs2",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²−${b}x+${c} = 0 with roots r and s, find r²s+rs² without solving. A student writes r²s+rs² = rs(r+s) = ${c}·${b} = ${b*c}. Evaluate.`,
      ...buildOptions(
        `Correct — r²s+rs² = rs(r+s) = (rs)(r+s) = ${c}·${b} = ${b*c}; the factoring and Vieta substitution are both valid`,
        [
          `Incorrect — r²s+rs² = (rs)²+(rs) = ${c*c}+${c} = ${c*c+c}; the student should square rs`,
          `Incorrect — the expression should be factored as r·s·(r+s) = ${c}+(${b}) = ${b+c} by adding instead of multiplying`,
          `Correct formula but wrong Vieta values: rs = −${c} (negative for this equation) so result is −${b*c}`
        ]
      ),
    };
  },
},

{
  id: "Em15",
  gapTag: "q-vieta",
  format: "vieta-error-detection-in-student-proof",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `A student "proves": "For x²+${b}x+${c} = 0, r+s = −${b} and rs = ${c}. Then (r+s)² = ${b*b}, so r²+2rs+s² = ${b*b}, so r²+s² = ${b*b}−2·${c} = ${b*b-2*c}. Since D = (r−s)² = r²−2rs+s² = ${b*b-2*c}−2·${c} = ${b*b-4*c}, I've proved D = ${b*b-4*c}." Is the proof valid?`,
      ...buildOptions(
        `Valid — the chain r²+s² = (r+s)²−2rs = ${b*b}−${2*c} = ${b*b-2*c}, then (r−s)² = r²−2rs+s² = ${b*b-2*c}−2·${c} = ${b*b-4*c} = D is correct; the student has derived D from Vieta's, which is a valid approach`,
        [
          `Invalid — (r−s)² ≠ D; the discriminant is b²−4ac, not (r−s)²`,
          `Invalid — the step from r²+s² to (r−s)² subtracts 2rs but should subtract 4rs`,
          `Valid only if both roots are real; the proof is circular when D < 0`
        ]
      ),
    };
  },
},

{
  id: "Em16",
  gapTag: "q-vieta",
  format: "vieta-reciprocal-roots-equation",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `Roots of x²−${b}x+${c} = 0 are r and s. Construct the equation with roots 1/r and 1/s. A student writes x²−(${b}/${c})x+(1/${c}) = 0, then multiplies by ${c} to get ${c}x²−${b}x+1 = 0. Verify.`,
      ...buildOptions(
        `Correct — 1/r+1/s = (r+s)/(rs) = ${b}/${c} and (1/r)(1/s) = 1/(rs) = 1/${c}; monic equation x²−(${b}/${c})x+1/${c} = 0; multiplying by ${c}: ${c}x²−${b}x+1 = 0 ✓`,
        [
          `Incorrect — the reciprocal equation is obtained by substituting x → 1/x in the original: (1/x)²−${b}(1/x)+${c} = 0, which gives ${c}x²−${b}x+1 = 0 (same result, but student's Vieta route is also valid)`,
          `Incorrect — sum of reciprocals = 1/(r+s) = 1/${b}, not (r+s)/(rs)`,
          `Correct equation but derived incorrectly — the new constant term should be c/original_c = 1, meaning it's always 1 regardless of the original equation`
        ]
      ),
    };
  },
},

{
  id: "Em17",
  gapTag: "q-vieta",
  format: "vieta-and-quadratic-with-equal-sum-product",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const k = pick([2,3,4,5,6,7,8,9,10,11,12]);
    return {
      text: `Find a monic quadratic where the sum of roots equals the product of roots, and both equal ${k}. A student writes x²−${k}x+${k} = 0. Verify D and determine if real roots exist.`,
      ...buildOptions(
        `Correct equation — Vieta's gives sum = ${k} → b = −${k} and product = ${k} → c = ${k}; equation: x²−${k}x+${k} = 0; D = ${k}² − 4·${k} = ${k*k - 4*k}; real roots exist ${k*k - 4*k >= 0 ? '(D ≥ 0)' : 'only if D ≥ 0, but D = ' + (k*k-4*k) + ' < 0 so no real roots despite the valid construction'}`,
        [
          `Incorrect equation — sum = product = ${k} requires b = ${k} (not −${k}), giving x²+${k}x+${k} = 0`,
          `Incorrect — such an equation is impossible; sum and product of roots cannot be equal`,
          `Correct, but real roots always exist when sum equals product`
        ]
      ),
    };
  },
},

{
  id: "Em18",
  gapTag: "q-vieta",
  format: "vieta-sum-product-determine-root-signs-general",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²−${b}x+${c} = 0: sum = ${b} > 0, product = ${c} > 0. A student concludes "both roots are positive." Evaluate whether this conclusion is always, sometimes, or never valid.`,
      ...buildOptions(
        `Always valid (when roots are real) — positive sum and positive product guarantee both roots are positive; if r and s are real with r+s > 0 and rs > 0, then neither root can be negative (a negative root would make the product negative if the other is positive, or the sum negative if both negative)`,
        [
          `Sometimes valid — positive sum and product only guarantee same-sign roots, not necessarily positive`,
          `Never valid as stated — you need D ≥ 0 as an additional condition before drawing any root-sign conclusions`,
          `Always valid but only for monic quadratics; non-monic equations require checking the sign of a`
        ]
      ),
    };
  },
},

{
  id: "Em19",
  gapTag: "q-vieta",
  format: "vieta-higher-power-expression",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const b = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const c = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²−${b}x+${c} = 0, roots r and s satisfy r² = ${b}r−${c} and s² = ${b}s−${c} (from the original equation). Use this to find r²+s² without Vieta's sum/product, and verify it matches the Vieta approach.`,
      ...buildOptions(
        `r²+s² = (${b}r−${c})+(${b}s−${c}) = ${b}(r+s)−${2*c} = ${b}·${b}−${2*c} = ${b*b-2*c}; Vieta approach: (r+s)²−2rs = ${b*b}−${2*c} = ${b*b-2*c} ✓; both methods agree`,
        [
          `r²+s² = ${b}(r+s)−${c} = ${b*b}−${c} = ${b*b-c} — forgot to double the c term`,
          `r²+s² = ${b}²(r+s)−${2*c} = ${b*b*b}−${2*c} — squared b incorrectly instead of using r+s = ${b}`,
          `The two methods cannot be compared because substituting the equation back into itself is circular`
        ]
      ),
    };
  },
},

{
  id: "Em20",
  gapTag: "q-vieta",
  format: "vieta-applied-to-parametric-family-and-constraint",
  mastery: true, diagnostic: false, practice: false,
  generate() {
    const t = pick([2,3,4,5,6,7,8,9,10,11,12]);
    const k = pick([2,3,4,5,6,7,8,9,10]);
    return {
      text: `For x²−${t}x+k = 0 (parameter k), the roots r and s satisfy r·s = k and r+s = ${t}. A student finds k such that one root is ${k} times the other: r = ${k}s. Using r+s = ${t} and rs = k, find k.`,
      ...buildOptions(
        `r = ${k}s and r+s = ${t} → ${k}s+s = ${t} → s = ${t}/(${k+1}); r = ${k}·${t}/${k+1} = ${k*t}/${k+1}; k = rs = (${k*t}/${k+1})·(${t}/${k+1}) = ${k*t*t}/${(k+1)*(k+1)}`,
        [
          `k = ${t*t/4} — using k = (r+s)²/4 which assumes r = s (double root condition, not r = ${k}s)`,
          `k = ${k*t} — obtained by setting k = ${k}·(r+s) = ${k}·${t} without solving the system properly`,
          `k = ${t} — setting k equal to the sum of roots instead of the product`
        ]
      ),
    };
  },
},
];