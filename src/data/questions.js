export const questions = {
  quadratic: [
    // ── q-discriminant (A1-A4)
    {
      id: "A1",
      text: "Which equation has no solutions in ℝ?",
      options: [
        { value: "x² − 4 = 0", label: "A" },
        { value: "x² + 4 = 0", label: "B" },
        { value: "x² − 4x + 4 = 0", label: "C" },
        { value: "x² − 4x + 3 = 0", label: "D" },
      ],
      correct: "x² + 4 = 0",
    },
    {
      id: "A2",
      text: "For x² − 6x + 9 = 0, D = 0. Choose the correct statement.",
      options: [
        { value: "Exactly one value of x satisfies it", label: "A" },
        { value: "Exactly two different values of x satisfy it", label: "B" },
        { value: "No values of x satisfy it", label: "C" },
        { value: "Every x satisfies it", label: "D" },
      ],
      correct: "Exactly one value of x satisfies it",
    },
    {
      id: "A3",
      text: "2x² − 3x + 5 = 0 has D < 0. Best conclusion?",
      options: [
        { value: "Two different solutions in ℝ", label: "A" },
        { value: "One solution in ℝ", label: "B" },
        { value: "No solutions in ℝ", label: "C" },
        { value: "Infinitely many solutions", label: "D" },
      ],
      correct: "No solutions in ℝ",
    },
    {
      id: "A4",
      text: "For x² + 2x + 5 = 0, D = −16. Choose the correct statement.",
      options: [
        { value: "Two different solutions in ℝ", label: "A" },
        { value: "One solution in ℝ", label: "B" },
        { value: "No solutions in ℝ", label: "C" },
        { value: "Two solutions in ℝ, both negative", label: "D" },
      ],
      correct: "No solutions in ℝ",
    },

    // ── q-double-root (B1-B4)
    {
      id: "B1",
      text: "A student claims: “x² = 9 has only x = 3.” Best correction?",
      options: [
        { value: "The solution set has two elements", label: "A" },
        { value: "The solution set has one element", label: "B" },
        { value: "The equation is inconsistent", label: "C" },
        { value: "The equation has infinitely many solutions", label: "D" },
      ],
      correct: "The solution set has two elements",
    },
    {
      id: "B2",
      text: "Compare: (1) x² − 25 = 0 and (2) x² − 10x + 25 = 0. Choose (solutions in ℝ for 1, then for 2).",
      options: [
        { value: "(2, 2)", label: "A" },
        { value: "(2, 1)", label: "B" },
        { value: "(1, 2)", label: "C" },
        { value: "(1, 1)", label: "D" },
      ],
      correct: "(2, 1)",
    },
    {
      id: "B3",
      text: "A student writes only x = 4 for x² = 16. How many elements are in the correct solution set?",
      options: [
        { value: "0", label: "A" },
        { value: "1", label: "B" },
        { value: "2", label: "C" },
        { value: "Infinitely many", label: "D" },
      ],
      correct: "2",
    },
    {
      id: "B4",
      text: "(x − 3)² = 0. Correct description of the solution set in ℝ?",
      options: [
        { value: "It contains exactly one element", label: "A" },
        { value: "It contains exactly two different elements", label: "B" },
        { value: "It contains no elements", label: "C" },
        { value: "It contains infinitely many elements", label: "D" },
      ],
      correct: "It contains exactly one element",
    },

    // ── q-div-by-var (C1-C4)
    {
      id: "C1",
      text: "5x² − 10x = 0. A student divides by x and concludes x = 2. Choose the most accurate evaluation.",
      options: [
        { value: "Conclusion is correct and complete", label: "A" },
        { value: "Conclusion is correct but incomplete", label: "B" },
        { value: "Conclusion is incorrect", label: "C" },
        { value: "Cannot be determined", label: "D" },
      ],
      correct: "Conclusion is correct but incomplete",
    },
    {
      id: "C2",
      text: "3x² = 6x. Choose the correct solution set in ℝ.",
      options: [
        { value: "{2}", label: "A" },
        { value: "{0}", label: "B" },
        { value: "{0, 2}", label: "C" },
        { value: "{−2, 2}", label: "D" },
      ],
      correct: "{0, 2}",
    },
    {
      id: "C3",
      text: "x² = 4x. Choose the method that preserves equivalence for all x.",
      options: [
        { value: "Divide both sides by x", label: "A" },
        { value: "Rewrite as x² − 4x = 0 and factor", label: "B" },
        { value: "Take square roots immediately", label: "C" },
        { value: "Move 4x to the left, then cancel x", label: "D" },
      ],
      correct: "Rewrite as x² − 4x = 0 and factor",
    },
    {
      id: "C4",
      text: "x³ = x². A student divides by x² and gets x = 1. Choose the best statement.",
      options: [
        { value: "The final set is complete", label: "A" },
        { value: "The final set is missing exactly one value", label: "B" },
        { value: "The final set is missing two values", label: "C" },
        { value: "The equation has no solutions", label: "D" },
      ],
      correct: "The final set is missing exactly one value",
    },

    // ── q-factoring (D1-D4)
    {
      id: "D1",
      text: "x² − 10x + 25 = 0. Choose the correct factorization form.",
      options: [
        { value: "(x − 5)² = 0", label: "A" },
        { value: "(x + 5)² = 0", label: "B" },
        { value: "(x − 5)(x + 5) = 0", label: "C" },
        { value: "(x − 25)(x − 1) = 0", label: "D" },
      ],
      correct: "(x − 5)² = 0",
    },
    {
      id: "D2",
      text: "x² − 49 = 0. Choose the correct factorization form.",
      options: [
        { value: "(x − 7)² = 0", label: "A" },
        { value: "(x + 7)² = 0", label: "B" },
        { value: "(x − 7)(x + 7) = 0", label: "C" },
        { value: "x(x − 49) = 0", label: "D" },
      ],
      correct: "(x − 7)(x + 7) = 0",
    },
    {
      id: "D3",
      text: "x² + 14x + 49 = 0. How many different real solutions does it have?",
      options: [
        { value: "0", label: "A" },
        { value: "1", label: "B" },
        { value: "2", label: "C" },
        { value: "Infinitely many", label: "D" },
      ],
      correct: "1",
    },
    {
      id: "D4",
      text: "A student rewrites x² − 16 = 0 as (x − 4)² = 0. Choose the best assessment.",
      options: [
        { value: "The rewrite is valid and preserves all solutions", label: "A" },
        { value: "The rewrite changes the set of solutions", label: "B" },
        { value: "The rewrite is valid only for x > 0", label: "C" },
        { value: "The rewrite is valid only for x < 0", label: "D" },
      ],
      correct: "The rewrite changes the set of solutions",
    },

    // ── q-vieta (E1-E4)
    {
      id: "E1",
      text: "The roots of x² − 5x + 6 = 0 are x₁ and x₂. Find x₁² + x₂² without solving.",
      options: [
        { value: "11", label: "A" },
        { value: "13", label: "B" },
        { value: "25", label: "C" },
        { value: "36", label: "D" },
      ],
      correct: "13",
    },
    {
      id: "E2",
      text: "A quadratic with roots 3 and −4 is x² + bx + c = 0. Choose (b, c).",
      options: [
        { value: "(1, −12)", label: "A" },
        { value: "(−1, −12)", label: "B" },
        { value: "(7, 12)", label: "C" },
        { value: "(−7, −12)", label: "D" },
      ],
      correct: "(1, −12)",
    },
    {
      id: "E3",
      text: "For x² + 7x + 12 = 0, choose (x₁ + x₂, x₁·x₂).",
      options: [
        { value: "(−7, 12)", label: "A" },
        { value: "(7, 12)", label: "B" },
        { value: "(−7, −12)", label: "C" },
        { value: "(7, −12)", label: "D" },
      ],
      correct: "(−7, 12)",
    },
    {
      id: "E4",
      text: "Two roots have sum 1 and product −6. Which equation matches?",
      options: [
        { value: "x² − x − 6 = 0", label: "A" },
        { value: "x² + x − 6 = 0", label: "B" },
        { value: "x² − x + 6 = 0", label: "C" },
        { value: "x² + x + 6 = 0", label: "D" },
      ],
      correct: "x² − x − 6 = 0",
    },
  ],
};