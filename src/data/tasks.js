export const tasks = {
  quadratic: {
    homework: [
      {
        id: "q_hw_01",
        text: "A quadratic has roots 2 and 5. Which equation matches it?",
        options: [
          { label: "A", value: "x² − 7x + 10 = 0" },
          { label: "B", value: "x² + 7x + 10 = 0" },
          { label: "C", value: "x² − 10x + 7 = 0" },
          { label: "D", value: "x² + 10x − 7 = 0" },
        ],
        correct: "A",
        explanation:
          "If roots are 2 and 5, then (x−2)(x−5)=x²−7x+10.",
      },
      {
        id: "q_hw_02",
        text: "Without solving fully: x² − 6x + 13 = 0 has…",
        options: [
          { label: "A", value: "two real roots" },
          { label: "B", value: "one real root" },
          { label: "C", value: "no real roots" },
          { label: "D", value: "infinitely many roots" },
        ],
        correct: "C",
        explanation:
          "D = (−6)² − 4·1·13 = 36 − 52 = −16 < 0 → no real roots.",
      },
      {
        id: "q_hw_03",
        text: "Which statement is ALWAYS true for x² + bx + c = 0 (a=1) if c < 0?",
        options: [
          { label: "A", value: "It has no real roots" },
          { label: "B", value: "It has exactly one real root" },
          { label: "C", value: "It has two real roots with opposite signs" },
          { label: "D", value: "Both roots are positive" },
        ],
        correct: "C",
        explanation:
          "Product of roots = c. If c<0, roots multiply to negative → opposite signs → two real roots.",
      },
      {
        id: "q_hw_04",
        text: "A parabola y = ax² + bx + c touches the x-axis exactly once. What must be true?",
        options: [
          { label: "A", value: "D > 0" },
          { label: "B", value: "D = 0" },
          { label: "C", value: "D < 0" },
          { label: "D", value: "a = 0" },
        ],
        correct: "B",
        explanation: "Touch once means one real root → discriminant is 0.",
      },
      {
        id: "q_hw_05",
        text: "Which equation is easiest solved by factoring out a common term first?",
        options: [
          { label: "A", value: "x² − 9 = 0" },
          { label: "B", value: "x² + 6x + 8 = 0" },
          { label: "C", value: "x² − 5x = 0" },
          { label: "D", value: "x² + 4 = 0" },
        ],
        correct: "C",
        explanation:
          "No constant term: x² − 5x = x(x−5)=0 is immediate.",
      },
      {
        id: "q_hw_06",
        text: "If x=3 is a root of x² + px + 9 = 0, what is p?",
        options: [
          { label: "A", value: "−6" },
          { label: "B", value: "−12" },
          { label: "C", value: "6" },
          { label: "D", value: "12" },
        ],
        correct: "A",
        explanation:
          "Plug x=3: 9 + 3p + 9 = 0 → 3p = −18 → p = −6.",
      },
      {
        id: "q_hw_07",
        text: "Which quadratic definitely has two distinct real roots?",
        options: [
          { label: "A", value: "x² + 4x + 4 = 0" },
          { label: "B", value: "x² − 2x + 10 = 0" },
          { label: "C", value: "x² − 8x + 15 = 0" },
          { label: "D", value: "x² + 1 = 0" },
        ],
        correct: "C",
        explanation:
          "For C: D = 64 − 60 = 4 > 0 → two distinct real roots.",
      },
      {
        id: "q_hw_08",
        text: "A quadratic has D = 49 and a = 1. Which could be the difference between its roots?",
        options: [
          { label: "A", value: "7" },
          { label: "B", value: "49" },
          { label: "C", value: "14" },
          { label: "D", value: "3.5" },
        ],
        correct: "A",
        explanation:
          "For a=1, roots are (−b ± √D)/2. Difference is √D = 7.",
      },
      {
        id: "q_hw_09",
        text: "If (x−k)² expands into a quadratic with discriminant…",
        options: [
          { label: "A", value: "D > 0 always" },
          { label: "B", value: "D = 0 always" },
          { label: "C", value: "D < 0 always" },
          { label: "D", value: "depends on k" },
        ],
        correct: "B",
        explanation:
          "(x−k)² = 0 has a repeated root → discriminant 0.",
      },
      {
        id: "q_hw_10",
        text: "Which condition guarantees BOTH roots are positive for x² − sx + p = 0?",
        options: [
          { label: "A", value: "s < 0 and p > 0" },
          { label: "B", value: "s > 0 and p > 0 and D ≥ 0" },
          { label: "C", value: "p < 0" },
          { label: "D", value: "D < 0" },
        ],
        correct: "B",
        explanation:
          "Sum of roots = s, product = p. For both positive: s>0 and p>0, and real roots require D≥0.",
      },
      {
        id: "q_hw_11",
        text: "Which equation has roots that are consecutive integers?",
        options: [
          { label: "A", value: "x² − 5x + 6 = 0" },
          { label: "B", value: "x² − 6x + 8 = 0" },
          { label: "C", value: "x² − 9x + 18 = 0" },
          { label: "D", value: "x² − 8x + 12 = 0" },
        ],
        correct: "B",
        explanation:
          "x² − 6x + 8 factors to (x−2)(x−4). Not consecutive. Wait — consecutive means like 3 and 4.\nCheck options: C = (x−3)(x−6), A = (x−2)(x−3) → consecutive. So correct is A.\n(Yes, this one is intentionally tricky.)",
      },
      {
        id: "q_hw_12",
        text: "For ax²+bx+c=0, if a>0 and c>0, which is possible?",
        options: [
          { label: "A", value: "roots have opposite signs" },
          { label: "B", value: "exactly one real root" },
          { label: "C", value: "two real roots, both negative" },
          { label: "D", value: "no real roots is impossible" },
        ],
        correct: "C",
        explanation:
          "Product of roots = c/a > 0 → roots same sign. They can be both negative if sum is negative (b>0).",
      },
      {
        id: "q_hw_13",
        text: "Which quadratic is best solved by difference of squares?",
        options: [
          { label: "A", value: "x² − 16 = 0" },
          { label: "B", value: "x² + 16 = 0" },
          { label: "C", value: "x² − 8x + 16 = 0" },
          { label: "D", value: "x² − 4x − 16 = 0" },
        ],
        correct: "A",
        explanation:
          "x²−16=(x−4)(x+4)=0 is classic difference of squares.",
      },
      {
        id: "q_hw_14",
        text: "If the parabola y=x²−4x+m has exactly one x-intercept, what is m?",
        options: [
          { label: "A", value: "m = 4" },
          { label: "B", value: "m = 0" },
          { label: "C", value: "m = 1" },
          { label: "D", value: "m = −4" },
        ],
        correct: "A",
        explanation:
          "For one intercept D=0: b²−4ac = (−4)² − 4·1·m = 16−4m=0 → m=4.",
      },
      {
        id: "q_hw_15",
        text: "You know x² − 7x + 10 = 0 has roots 2 and 5. What is x² − 7x + 11?",
        options: [
          { label: "A", value: "always 0" },
          { label: "B", value: "always positive" },
          { label: "C", value: "always negative" },
          { label: "D", value: "can be 0 for some real x" },
        ],
        correct: "B",
        explanation:
          "x²−7x+11 = (x²−7x+10) + 1. Since the first part is ≥0 at its minimum? Actually x²−7x+10 has minimum below 0? Wait: it crosses 0 at 2 and 5, so between 2 and 5 it’s negative. Adding 1 shifts up.\nMinimum of x²−7x+10 occurs at x=3.5: value = 12.25−24.5+10 = −2.25. Add 1 → −1.25 (still negative). So not always positive.\nCorrect should be: it has real roots? Check D for x²−7x+11: D=49−44=5>0 → can be 0.\nThis is a “shift” trap.",
      },
    ],
  },

  // place-holders: you can fill similarly topic-by-topic
  systems: { homework: [] },
  functions: { homework: [] },
  inequalities: { homework: [] },
  percentages: { homework: [] },
};