/**
 * gaps.js
 *
 * Topic gap definitions for Axioma v1.
 *
 * Structure:
 * - Each gap maps to exactly one coreGapId from coreGaps.js
 * - signals[] maps to question IDs in questions.js
 * - subGaps[] are internal detection signals only — never shown to the user directly
 * - recommendation.theorySectionIds reference the `id` fields on theory.js sections.
 *   The full ID list (as of theory.js v3):
 *     "quadratic-intro"              §1
 *     "quadratic-roots"              §2
 *     "quadratic-factoring"          §3
 *     "quadratic-discriminant"       §4
 *     "quadratic-formula"            §5
 *     "quadratic-completing-square"  §6
 *     "quadratic-vieta"              §7
 *     "quadratic-special-cases"      §8
 *     "quadratic-methods"            §9
 *   When adding a new theory section, assign its id there first,
 *   then reference it here. Never invent IDs that don't exist in theory.js.
 *
 * Detection logic (per gap):
 *   2 / totalSignals wrong → moderate
 *   3 / totalSignals wrong → strong
 *
 * Severity:
 *   1 = high-value, blocking — show prominently
 *   2 = important topic gap — show normally
 *   3 = technical / minor — group under "technical issues"
 */

export const gapsDatabase = {
  quadratic: [

    // ─────────────────────────────────────────────────────────
    // q-discriminant
    // coreGap: interpretive
    // Why severity 1: misreading D blocks all downstream reasoning.
    //   A student who can't interpret D correctly cannot reliably
    //   conclude anything about a quadratic's solution set.
    // ─────────────────────────────────────────────────────────
    {
      id: "q-discriminant",
      topicId: "quadratic",
      coreGapId: "interpretive",
      severity: 1,
      title: "Misreading what the discriminant tells you",
      description:
        "You compute D correctly but misinterpret what its sign means. " +
        "The discriminant is not just a number — it tells you how many real solutions exist.",
      recommendationText:
        "Before solving: interpret D. D > 0 → two solutions in ℝ. D = 0 → exactly one. D < 0 → none. " +
        "Practice reading the conclusion from D before touching the formula.",
      masteryRule: {
        totalSignals: 4,
        moderateThreshold: 2,
        strongThreshold: 3,
      },
      signals: [
        { taskId: "A1", gapAnswers: ["x² − 4 = 0", "x² − 4x + 4 = 0", "x² − 4x + 3 = 0"], expectedFailurePattern: "Picks equation with real solutions instead of x²+4=0" },
        { taskId: "A2", gapAnswers: ["Exactly two different values of x satisfy it", "No values of x satisfy it", "Every x satisfies it"], expectedFailurePattern: "Chooses 'two different values' or 'no values' when D=0 means exactly one" },
        { taskId: "A3", gapAnswers: ["Two different solutions in ℝ", "One solution in ℝ", "Infinitely many solutions"], expectedFailurePattern: "Chooses 'two solutions' or 'one solution' when D<0 means none" },
        { taskId: "A4", gapAnswers: ["Two different solutions in ℝ", "One solution in ℝ", "Two solutions in ℝ, both negative"], expectedFailurePattern: "Chooses any real-solution option despite D=-16" },
      ],
      subGaps: [
        { id: "sq-disc-zero", description: "Confuses D=0 (one root) with D>0 (two roots)" },
        { id: "sq-disc-negative", description: "Treats D<0 as still producing real solutions" },
        { id: "sq-disc-miscount", description: "Computes D correctly but selects wrong root count" },
      ],
      recommendation: {
        // §4 covers D formula, all three cases, and visual — primary reference.
        // §5 reinforces D usage inside the quadratic formula.
        theorySectionIds: ["quadratic-discriminant", "quadratic-formula"],
        practiceMode: "gap_targeted",
        practiceTag: "discriminant",
      },
    },

    // ─────────────────────────────────────────────────────────
    // q-double-root
    // coreGap: interpretive
    // Why severity 2: important but more contained than discriminant.
    //   Affects equations of the form x²=k and (x-a)²=0.
    // ─────────────────────────────────────────────────────────
    {
      id: "q-double-root",
      topicId: "quadratic",
      coreGapId: "interpretive",
      severity: 2,
      title: "Missing the second square-root outcome",
      description:
        "You treat x² = k as having only one solution. " +
        "Square roots have two outcomes — both must be considered.",
      recommendationText:
        "When solving x² = k, always write ±√k. Verify both by substitution. " +
        "Note: (x−a)² = 0 gives exactly one solution — don't confuse this with x² = k where k > 0.",
      masteryRule: {
        totalSignals: 4,
        moderateThreshold: 2,
        strongThreshold: 3,
      },
      signals: [
        { taskId: "B1", gapAnswers: ["The solution set has one element", "The equation is inconsistent", "The equation has infinitely many solutions"], expectedFailurePattern: "Agrees that only x=3 is a solution to x²=9" },
        { taskId: "B2", gapAnswers: ["(2, 2)", "(1, 2)", "(1, 1)"], expectedFailurePattern: "Incorrectly counts solutions for x²−25=0 or x²−10x+25=0" },
        { taskId: "B3", gapAnswers: ["0", "1", "Infinitely many"], expectedFailurePattern: "Accepts only x=4 for x²=16, ignoring x=−4" },
        { taskId: "B4", gapAnswers: ["It contains exactly two different elements", "It contains no elements", "It contains infinitely many elements"], expectedFailurePattern: "Claims (x−3)²=0 has two different elements" },
      ],
      subGaps: [
        { id: "sq-root-positive-only", description: "Only considers positive square root, ignores negative" },
        { id: "sq-root-double-vs-two", description: "Confuses double root (D=0) with two distinct roots" },
        { id: "sq-root-perfect-square", description: "Treats (x−a)²=0 as having two solutions" },
      ],
      recommendation: {
        // §2 introduces roots and the three possible counts.
        // §4 ties D=0 to the repeated root case explicitly.
        // §8 covers the b=0 pure quadratic case (x²=k → ±√k).
        theorySectionIds: ["quadratic-roots", "quadratic-discriminant", "quadratic-special-cases"],
        practiceMode: "gap_targeted",
        practiceTag: "double-root",
      },
    },

    // ─────────────────────────────────────────────────────────
    // q-div-by-var
    // coreGap: procedural
    // Why severity 1: dividing by x is a fundamental algebraic error
    //   that loses solutions silently — the student doesn't notice anything broke.
    //   This pattern recurs in many topics beyond quadratics.
    // ─────────────────────────────────────────────────────────
    {
      id: "q-div-by-var",
      topicId: "quadratic",
      coreGapId: "procedural",
      severity: 1,
      title: "Dividing by an expression containing x",
      description:
        "You divide both sides by x (or an expression with x) to simplify. " +
        "This silently removes the solution x = 0 and produces an incomplete answer.",
      recommendationText:
        "Never divide by an expression that can equal zero. " +
        "Move everything to one side: ax² + bx = 0 → x(ax + b) = 0, then solve each factor.",
      masteryRule: {
        totalSignals: 4,
        moderateThreshold: 2,
        strongThreshold: 3,
      },
      signals: [
        { taskId: "C1", gapAnswers: ["Conclusion is correct and complete", "Conclusion is incorrect", "Cannot be determined"], expectedFailurePattern: "Calls x=2 complete rather than incomplete after dividing by x" },
        { taskId: "C2", gapAnswers: ["{2}", "{0}", "{−2, 2}"], expectedFailurePattern: "Gives {2} or {0} instead of {0,2} for 3x²=6x" },
        { taskId: "C3", gapAnswers: ["Divide both sides by x", "Take square roots immediately", "Move 4x to the left, then cancel x"], expectedFailurePattern: "Chooses 'divide both sides by x' as valid method" },
        { taskId: "C4", gapAnswers: ["The final set is complete", "The final set is missing two values", "The equation has no solutions"], expectedFailurePattern: "Claims solution set is complete after dividing x³=x² by x²" },
      ],
      subGaps: [
        { id: "sq-div-loses-zero", description: "Divides by x, losing x=0 solution without noticing" },
        { id: "sq-div-cancel-instead-factor", description: "Moves variable term then cancels instead of factoring" },
        { id: "sq-div-incomplete-recognition", description: "Recognises the error conceptually but can't execute correct method" },
      ],
      recommendation: {
        // §3 introduces the zero product property and factoring out x
        // (the correct alternative to dividing by x).
        theorySectionIds: ["quadratic-factoring"],
        practiceMode: "gap_targeted",
        practiceTag: "div-by-var",
      },
    },

    // ─────────────────────────────────────────────────────────
    // q-factoring
    // coreGap: procedural
    // Why severity 2: important but more pattern-specific.
    //   Errors here are about matching the wrong algebraic identity,
    //   not a fundamental misunderstanding of the solution process.
    // ─────────────────────────────────────────────────────────
    {
      id: "q-factoring",
      topicId: "quadratic",
      coreGapId: "procedural",
      severity: 2,
      title: "Confusing factoring patterns",
      description:
        "You apply a plausible-looking factorization that doesn't match the expression. " +
        "Common mix-ups: perfect square trinomial vs difference of squares, and sign errors.",
      recommendationText:
        "Before factoring, identify the pattern: is it a² − b² (difference of squares) " +
        "or a² ± 2ab + b² (perfect square)? Expand your result to verify it matches the original.",
      masteryRule: {
        totalSignals: 4,
        moderateThreshold: 2,
        strongThreshold: 3,
      },
      signals: [
        { taskId: "D1", gapAnswers: ["(x + 5)² = 0", "(x − 5)(x + 5) = 0", "(x − 25)(x − 1) = 0"], expectedFailurePattern: "Picks (x+5)² or (x−5)(x+5) for x²−10x+25" },
        { taskId: "D2", gapAnswers: ["(x − 7)² = 0", "(x + 7)² = 0", "x(x − 49) = 0"], expectedFailurePattern: "Picks (x−7)² or (x+7)² instead of (x−7)(x+7) for x²−49" },
        { taskId: "D3", gapAnswers: ["0", "2", "Infinitely many"], expectedFailurePattern: "Gives 0 or 2 solutions for x²+14x+49=0" },
        { taskId: "D4", gapAnswers: ["The rewrite is valid and preserves all solutions", "The rewrite is valid only for x > 0", "The rewrite is valid only for x < 0"], expectedFailurePattern: "Claims (x−4)²=0 is valid rewrite of x²−16=0" },
      ],
      subGaps: [
        { id: "sq-factor-perfect-vs-diff", description: "Confuses perfect square trinomial with difference of squares" },
        { id: "sq-factor-sign-error", description: "Applies correct pattern but with wrong signs on factors" },
        { id: "sq-factor-no-verify", description: "Does not expand result to verify against original expression" },
      ],
      recommendation: {
        // §3 covers the p,q method and sign rules for factoring.
        // §8 covers perfect square trinomials and difference of squares explicitly.
        theorySectionIds: ["quadratic-factoring", "quadratic-special-cases"],
        practiceMode: "gap_targeted",
        practiceTag: "factoring",
      },
    },

    // ─────────────────────────────────────────────────────────
    // q-vieta
    // coreGap: strategic
    // Why severity 2: Vieta's formulas are a specific tool.
    //   Misapplying them is a method-level error — the student knows
    //   a formula exists but applies it with wrong sign conventions.
    // ─────────────────────────────────────────────────────────
    {
      id: "q-vieta",
      topicId: "quadratic",
      coreGapId: "strategic",
      severity: 2,
      title: "Misapplying Vieta's formulas",
      description:
        "You use Vieta's formulas but mix up sign conventions — especially the sum, " +
        "which is −b/a, not b/a. Building an equation from roots also requires care with signs.",
      recommendationText:
        "For ax² + bx + c = 0: sum of roots = −b/a, product = c/a. " +
        "To build an equation from roots r₁, r₂: write (x − r₁)(x − r₂) = 0 and expand.",
      masteryRule: {
        totalSignals: 4,
        moderateThreshold: 2,
        strongThreshold: 3,
      },
      signals: [
        { taskId: "E1", gapAnswers: ["11", "25", "36"], expectedFailurePattern: "Picks 11 or 25 instead of 13 for x₁²+x₂² via Vieta" },
        { taskId: "E2", gapAnswers: ["(−1, −12)", "(7, 12)", "(−7, −12)"], expectedFailurePattern: "Wrong (b,c) for quadratic with roots 3 and −4" },
        { taskId: "E3", gapAnswers: ["(7, 12)", "(−7, −12)", "(7, −12)"], expectedFailurePattern: "Flips sum or product sign for x²+7x+12=0" },
        { taskId: "E4", gapAnswers: ["x² + x − 6 = 0", "x² − x + 6 = 0", "x² + x + 6 = 0"], expectedFailurePattern: "Picks wrong equation for roots summing to 1, product −6" },
      ],
      subGaps: [
        { id: "sq-vieta-sum-sign", description: "Uses b/a instead of −b/a for the sum of roots" },
        { id: "sq-vieta-sum-product-swap", description: "Confuses sum and product relations" },
        { id: "sq-vieta-build-equation", description: "Builds equation from roots with incorrect signs" },
      ],
      recommendation: {
        // §7 covers Vieta's formulas, sign conventions, and building equations from roots.
        theorySectionIds: ["quadratic-vieta"],
        practiceMode: "gap_targeted",
        practiceTag: "vieta",
      },
    },
  ],
};