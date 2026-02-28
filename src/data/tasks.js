export const tasks = {
  quadratic: {
    homework: [
      {
        id: "q_hw_01",
        text: "Quadratic x² + bx + c = 0 has two roots r₁ and r₂. You're told r₁ + r₂ = 8 and r₁ · r₂ = 7. A student says: 'The discriminant must be 36.' Is the student correct?",
        options: [
          { label: "A", value: "Yes — D = (r₁+r₂)² − 4r₁r₂ = 64 − 28 = 36, so correct" },
          { label: "B", value: "No — the formula gives D = b²−4c, but b = −8, so D = 64 − 28 = 36. Still correct but the reasoning was wrong" },
          { label: "C", value: "No — D = (r₁−r₂)², not (r₁+r₂)² − 4r₁r₂" },
          { label: "D", value: "Cannot determine — we need the actual value of a" },
        ],
        correct: "A",
        explanation:
          "By Vieta's: r₁+r₂ = −b and r₁r₂ = c (for a=1). So b=−8, c=7. D = b²−4ac = 64−28 = 36. The identity (r₁+r₂)²−4r₁r₂ = (r₁−r₂)² also equals 36. The student's conclusion is correct.",
      },
      {
        id: "q_hw_02",
        text: "If you divide both sides of x² = 5x by x, you get x = 5. What is the complete set of solutions?",
        options: [
          { label: "A", value: "x = 5 only — dividing is valid if x ≠ 0, and x = 0 doesn't satisfy the equation" },
          { label: "B", value: "x = 0 and x = 5 — dividing by x silently discards x = 0" },
          { label: "C", value: "x = 5 and x = −5 — square root gives two values" },
          { label: "D", value: "x = 0 only — 5x = 0 when x = 0" },
        ],
        correct: "B",
        explanation:
          "x² = 5x → x² − 5x = 0 → x(x−5) = 0. So x = 0 or x = 5. Dividing by x is only valid when x ≠ 0, which silently erases the x = 0 solution. Always factor instead of dividing by the unknown.",
      },
      {
        id: "q_hw_03",
        text: "The parabola y = x² − 6x + k touches the x-axis at exactly one point. A student claims the vertex is at x = 3 and y = 0. Which statement is accurate?",
        options: [
          { label: "A", value: "Correct: vertex at (3, 0) means the parabola just touches x-axis, so k = 9" },
          { label: "B", value: "Wrong: if D = 0 the parabola crosses, not touches, the x-axis" },
          { label: "C", value: "Correct, but k must equal 6, not 9" },
          { label: "D", value: "Wrong: vertex x-coordinate is at x = −6, not x = 3" },
        ],
        correct: "A",
        explanation:
          "Vertex of y=ax²+bx+c is at x = −b/2a = 6/2 = 3. For the parabola to touch (not cross) the x-axis, D = 0: 36 − 4k = 0 → k = 9. At x=3: y = 9 − 18 + 9 = 0. Student is correct.",
      },
      {
        id: "q_hw_04",
        text: "Two quadratics: (I) x² − 5x + 6 = 0 and (II) −x² + 5x − 6 = 0. Which statement is true?",
        options: [
          { label: "A", value: "They have the same roots because they differ only by a factor of −1" },
          { label: "B", value: "They have different roots because the signs of a change the discriminant" },
          { label: "C", value: "Only equation I has real roots; equation II does not" },
          { label: "D", value: "They have the same roots but the parabolas open in opposite directions" },
        ],
        correct: "D",
        explanation:
          "Multiply (II) by −1: x² − 5x + 6 = 0, identical to (I). So same roots: x=2 and x=3. But y=x²−5x+6 opens upward (a>0), while y=−x²+5x−6 opens downward (a<0). Same roots, opposite orientation.",
      },
      {
        id: "q_hw_05",
        text: "For x² + px + q = 0, you know one root is exactly twice the other. Which condition must hold?",
        options: [
          { label: "A", value: "2p² = 9q" },
          { label: "B", value: "p² = 2q" },
          { label: "C", value: "p = 3q" },
          { label: "D", value: "p² = 4q" },
        ],
        correct: "A",
        explanation:
          "Let roots be r and 2r. Sum: r + 2r = 3r = −p → r = −p/3. Product: r·2r = 2r² = q → 2(p/3)² = q → 2p²/9 = q → 2p² = 9q.",
      },
      {
        id: "q_hw_06",
        text: "x² − 4x + 4 = 0 has a repeated root x = 2. If you shift the equation to (x−1)² − 4(x−1) + 4 = 0, what are the roots of the new equation?",
        options: [
          { label: "A", value: "x = 2 (same root, shift doesn't change roots)" },
          { label: "B", value: "x = 3 (repeated root, shifted by +1)" },
          { label: "C", value: "x = 1 and x = 3" },
          { label: "D", value: "x = 1 (repeated root, shifted by −1)" },
        ],
        correct: "B",
        explanation:
          "Let u = x−1. The equation becomes u² − 4u + 4 = 0 → (u−2)² = 0 → u = 2 → x−1 = 2 → x = 3. Substituting (x−1) shifts the root right by 1.",
      },
      {
        id: "q_hw_07",
        text: "A quadratic ax² + bx + c = 0 with a > 0 has D > 0. Between the two roots, the parabola is…",
        options: [
          { label: "A", value: "above the x-axis, since a > 0 means it opens upward" },
          { label: "B", value: "below the x-axis, since the parabola dips below between the roots" },
          { label: "C", value: "on the x-axis, since D > 0 means two roots, not a dip" },
          { label: "D", value: "above or below depending on the sign of b" },
        ],
        correct: "B",
        explanation:
          "For a > 0 (opens up), the parabola crosses the x-axis at both roots. Between the roots the curve is below the x-axis (y < 0). Outside both roots, y > 0.",
      },
      {
        id: "q_hw_08",
        text: "You have x² − 10x + c = 0. For what value of c do the roots have the maximum possible product while still being real?",
        options: [
          { label: "A", value: "c = 25 (the product r₁r₂ = c is maximised when D = 0)" },
          { label: "B", value: "c = 10 (product equals the sum)" },
          { label: "C", value: "c = 0 (one root is zero, maximising the other)" },
          { label: "D", value: "c < 0 (negative c gives the largest real roots)" },
        ],
        correct: "A",
        explanation:
          "For real roots, D ≥ 0: 100 − 4c ≥ 0 → c ≤ 25. Product of roots = c (Vieta). To maximise product, maximise c: c = 25. At c = 25, D = 0, repeated root x = 5.",
      },
      {
        id: "q_hw_09",
        text: "If x₁ and x₂ are roots of x² + 6x + 7 = 0, what is x₁² + x₂² without finding the individual roots?",
        options: [
          { label: "A", value: "22" },
          { label: "B", value: "36" },
          { label: "C", value: "14" },
          { label: "D", value: "29" },
        ],
        correct: "A",
        explanation:
          "x₁²+x₂² = (x₁+x₂)² − 2x₁x₂. By Vieta: x₁+x₂ = −6, x₁x₂ = 7. So (−6)² − 2·7 = 36 − 14 = 22.",
      },
      {
        id: "q_hw_10",
        text: "A rectangle has perimeter 20 and area 24. Setting up a quadratic to find the side lengths gives which equation?",
        options: [
          { label: "A", value: "x² − 10x + 24 = 0" },
          { label: "B", value: "x² − 20x + 24 = 0" },
          { label: "C", value: "x² + 10x − 24 = 0" },
          { label: "D", value: "x² − 24x + 10 = 0" },
        ],
        correct: "A",
        explanation:
          "Let sides be x and y. Perimeter: 2(x+y) = 20 → x+y = 10 → y = 10−x. Area: x(10−x) = 24 → 10x−x² = 24 → x²−10x+24 = 0.",
      },
      {
        id: "q_hw_11",
        text: "For which value of k does kx² − 2x + 1 = 0 have exactly one real solution?",
        options: [
          { label: "A", value: "k = 0" },
          { label: "B", value: "k = 1" },
          { label: "C", value: "k = 4" },
          { label: "D", value: "k = −1" },
        ],
        correct: "B",
        explanation:
          "For k ≠ 0 (otherwise it's not quadratic), D = 4 − 4k = 0 → k = 1. Check: k=1 gives x²−2x+1=(x−1)²=0, one solution x=1. Note k=0 gives −2x+1=0, one solution but it's not a quadratic.",
      },
      {
        id: "q_hw_12",
        text: "You find that x = 3 + √2 is a root of x² + bx + c = 0 with b, c rational. What must the other root be?",
        options: [
          { label: "A", value: "x = 3 − √2 (conjugate, required for rational coefficients)" },
          { label: "B", value: "x = −3 + √2 (negate the rational part)" },
          { label: "C", value: "x = 3 + √2 (same repeated root)" },
          { label: "D", value: "x = −3 − √2 (negate the whole expression)" },
        ],
        correct: "A",
        explanation:
          "If coefficients are rational and one root is 3+√2, the irrational conjugate 3−√2 must also be a root (conjugate root theorem). The product (3+√2)(3−√2) = 9−2 = 7 and sum = 6, both rational.",
      },
      {
        id: "q_hw_13",
        text: "Equation: x² − (m+2)x + 2m = 0. For which value of m do both roots equal each other AND equal m?",
        options: [
          { label: "A", value: "m = 2" },
          { label: "B", value: "m = 4" },
          { label: "C", value: "m = 0" },
          { label: "D", value: "No such m exists" },
        ],
        correct: "A",
        explanation:
          "Repeated root when D = 0: (m+2)² − 8m = 0 → m²+4m+4−8m = 0 → m²−4m+4 = 0 → (m−2)² = 0 → m = 2. Repeated root = (m+2)/2 = 4/2 = 2 = m. Both roots equal 2 = m. ✓",
      },
      {
        id: "q_hw_14",
        text: "Graph of y = x² − 4x + 3 is shifted 2 units right. What is the new equation?",
        options: [
          { label: "A", value: "y = x² − 8x + 15" },
          { label: "B", value: "y = x² − 4x + 1" },
          { label: "C", value: "y = x² − 8x + 11" },
          { label: "D", value: "y = x² − 4x + 5" },
        ],
        correct: "A",
        explanation:
          "Shift right by 2: replace x with (x−2). y = (x−2)² − 4(x−2) + 3 = x²−4x+4 − 4x+8 + 3 = x²−8x+15. New roots: original were 1 and 3, shifted to 3 and 5. ✓",
      },
      {
        id: "q_hw_15",
        text: "x² − 7x + 10 = 0 has roots 2 and 5. Without solving again, what are the roots of x² − 7|x| + 10 = 0?",
        options: [
          { label: "A", value: "x = 2 and x = 5 only (same as original)" },
          { label: "B", value: "x = ±2 and x = ±5 (four roots)" },
          { label: "C", value: "x = 2, x = 5, and x = −2 (three roots, since −5 makes |x|=5 work but check)" },
          { label: "D", value: "x = ±2 and x = ±5, but |x| must be positive so only x = 2, 5 count" },
        ],
        correct: "B",
        explanation:
          "Replace |x| = t ≥ 0: t² − 7t + 10 = 0 → t = 2 or t = 5. Each gives |x| = 2 → x = ±2 and |x| = 5 → x = ±5. All four are valid since 2,5 ≥ 0. Check: (−2)² − 7|−2| + 10 = 4−14+10 = 0 ✓",
      },
    ],
  },
};