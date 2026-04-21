/**
 * gaps.js — Topic gap definitions for Axioma v1.
 *
 * Each gap maps to exactly one coreGapId from coreGaps.js.
 * recommendation.theorySectionIds reference theory.js section IDs:
 *   "quadratic-intro"              §1
 *   "quadratic-roots"              §2
 *   "quadratic-factoring"          §3
 *   "quadratic-discriminant"       §4
 *   "quadratic-formula"            §5
 *   "quadratic-completing-square"  §6
 *   "quadratic-vieta"              §7
 *   "quadratic-special-cases"      §8
 *   "quadratic-methods"            §9
 *
 * Detection: handled by detectAllGaps via gapTag matching.
 * Severity: 1 = blocking, 2 = important, 3 = minor.
 */

export const gapsDatabase = {
  quadratic: [

    {
      id:        "q-discriminant",
      topicId:   "quadratic",
      coreGapId: "interpretive",
      severity:  1,
      title:     "Misreading what the discriminant tells you",
      description: {
        what:  "You read D's sign but draw the wrong conclusion about the number of solutions.",
        why:   "D's sign is treated as a label rather than a decision rule.",
        check: "Before solving, state explicitly: D > 0 means two solutions, D = 0 means one, D < 0 means none.",
      },
      recommendationText:
        "Before solving: interpret D. D > 0 → two solutions in ℝ. D = 0 → exactly one. D < 0 → none. " +
        "Practice reading the conclusion from D before touching the formula.",
      recommendation: {
        theorySectionIds: ["quadratic-discriminant", "quadratic-formula"],
        practiceMode: "gap_targeted",
        practiceTag: "q-discriminant",
      },
    },

    {
      id:        "q-double-root",
      topicId:   "quadratic",
      coreGapId: "interpretive",
      severity:  2,
      title:     "Missing the second square-root outcome",
      description: {
        what:  "You find one square root but don't write the negative counterpart.",
        why:   "Square root is treated as a function that returns one value, not two.",
        check: "Whenever you write √k, immediately write ±√k and check both values.",
      },
      recommendationText:
        "When solving x² = k, always write ±√k. Verify both by substitution. " +
        "Note: (x−a)² = 0 gives exactly one solution — don't confuse this with x² = k where k > 0.",
      recommendation: {
        theorySectionIds: ["quadratic-roots", "quadratic-discriminant", "quadratic-special-cases"],
        practiceMode: "gap_targeted",
        practiceTag: "q-double-root",
      },
    },

    {
      id:        "q-div-by-var",
      topicId:   "quadratic",
      coreGapId: "procedural",
      severity:  1,
      title:     "Dividing by an expression containing x",
      description: {
        what:  "You divide both sides by x and lose the solution x = 0.",
        why:   "Division by x assumes x ≠ 0, silently discarding one valid solution.",
        check: "Move all terms to one side first, then factor — never divide by an expression containing x.",
      },
      recommendationText:
        "Never divide by an expression that can equal zero. " +
        "Move everything to one side: ax² + bx = 0 → x(ax + b) = 0, then solve each factor.",
      recommendation: {
        theorySectionIds: ["quadratic-factoring"],
        practiceMode: "gap_targeted",
        practiceTag: "q-div-by-var",
      },
    },

    {
      id:        "q-factoring",
      topicId:   "quadratic",
      coreGapId: "procedural",
      severity:  2,
      title:     "Confusing factoring patterns",
      description: {
        what:  "You apply a factoring pattern that doesn't match the expression.",
        why:   "The pattern is selected by shape recognition, not by checking the conditions it requires.",
        check: "Identify the pattern first — difference of squares or perfect square — then verify by expanding.",
      },
      recommendationText:
        "Before factoring, identify the pattern: is it a² − b² (difference of squares) " +
        "or a² ± 2ab + b² (perfect square)? Expand your result to verify it matches the original.",
      recommendation: {
        theorySectionIds: ["quadratic-factoring", "quadratic-special-cases"],
        practiceMode: "gap_targeted",
        practiceTag: "q-factoring",
      },
    },

    {
      id:        "q-vieta",
      topicId:   "quadratic",
      coreGapId: "strategic",
      severity:  2,
      title:     "Misapplying Vieta's formulas",
      description: {
        what:  "You use b/a instead of −b/a for the sum of roots.",
        why:   "The negative sign in Vieta's sum formula is dropped or overlooked.",
        check: "Write the formula before substituting: x₁ + x₂ = −b/a, x₁ · x₂ = c/a.",
      },
      recommendationText:
        "For ax² + bx + c = 0: sum of roots = −b/a, product = c/a. " +
        "To build an equation from roots r₁, r₂: write (x − r₁)(x − r₂) = 0 and expand.",
      recommendation: {
        theorySectionIds: ["quadratic-vieta"],
        practiceMode: "gap_targeted",
        practiceTag: "q-vieta",
      },
    },
  ],
};