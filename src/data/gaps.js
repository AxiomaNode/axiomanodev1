export const gapsDatabase = {
  quadratic: [
    {
      id: "q-discriminant",
      title: "Misreading what the discriminant tells you",
      description:
        "You compute D, but misinterpret what its sign implies.",
      recommendation:
        "Interpret D before solving: D>0 → two solutions in ℝ, D=0 → one solution in ℝ, D<0 → no solutions in ℝ.",
      signs: {
        A1: ["x² − 4 = 0", "x² − 4x + 4 = 0", "x² − 4x + 3 = 0"],
        A2: [
          "Exactly two different values of x satisfy it",
          "No values of x satisfy it",
          "Every x satisfies it",
        ],
        A3: ["Two different solutions in ℝ", "One solution in ℝ", "Infinitely many solutions"],
        A4: ["Two different solutions in ℝ", "One solution in ℝ", "Two solutions in ℝ, both negative"],
      },
    },
    {
      id: "q-double-root",
      title: "Missing the second square-root outcome",
      description:
        "You treat x² = k as having only one outcome.",
      recommendation:
        "When solving x² = k, consider both outcomes and verify by substitution.",
      signs: {
        B1: ["The solution set has one element", "The equation is inconsistent", "The equation has infinitely many solutions"],
        B2: ["(2, 2)", "(1, 2)", "(1, 1)"],
        B3: ["0", "1", "Infinitely many"],
        B4: ["It contains exactly two different elements", "It contains no elements", "It contains infinitely many elements"],
      },
    },
    {
      id: "q-div-by-var",
      title: "Dividing by an expression containing x",
      description:
        "You divide by something that can become 0 and don’t account for that case.",
      recommendation:
        "Move everything to one side and factor; treat each factor = 0.",
      signs: {
        C1: ["Conclusion is correct and complete", "Conclusion is incorrect", "Cannot be determined"],
        C2: ["{2}", "{0}", "{−2, 2}"],
        C3: ["Divide both sides by x", "Take square roots immediately", "Move 4x to the left, then cancel x"],
        C4: ["The final set is complete", "The final set is missing two values", "The equation has no solutions"],
      },
    },
    {
      id: "q-factoring",
      title: "Confusing factoring patterns",
      description:
        "You choose a plausible factorization form that doesn’t match the expression.",
      recommendation:
        "Factor carefully, then confirm by expanding or checking solutions in the original equation.",
      signs: {
        D1: ["(x + 5)² = 0", "(x − 5)(x + 5) = 0", "(x − 25)(x − 1) = 0"],
        D2: ["(x − 7)² = 0", "(x + 7)² = 0", "x(x − 49) = 0"],
        D3: ["0", "2", "Infinitely many"],
        D4: ["The rewrite is valid and preserves all solutions", "The rewrite is valid only for x > 0", "The rewrite is valid only for x < 0"],
      },
    },
    {
      id: "q-vieta",
      title: "Misapplying Vieta's formulas",
      description:
        "You mix up sum/product relations or sign conventions.",
      recommendation:
        "For ax² + bx + c = 0: sum = −b/a, product = c/a. Build from roots with (x − r₁)(x − r₂).",
      signs: {
        E1: ["11", "25", "36"],
        E2: ["(−1, −12)", "(7, 12)", "(−7, −12)"],
        E3: ["(7, 12)", "(−7, −12)", "(7, −12)"],
        E4: ["x² + x − 6 = 0", "x² − x + 6 = 0", "x² + x + 6 = 0"],
      },
    },
  ],
};