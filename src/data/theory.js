export const theoryTopics = [
  {
    id: "quadratic",
    title: "Quadratic Equations",
    subtitle: "Core idea, methods, and geometry",
  },
  {
    id: "fractions",
    title: "Fractions",
    subtitle: "Understand them without confusion",
  },
  {
    id: "geometry_basics",
    title: "Geometry: Basics",
    subtitle: "Angles, triangles, and area",
  },
];

export const theory = {
  quadratic: {
    title: "Quadratic Equations",
    subtitle: "From roots to visualization",
    sections: [
      {
        id: "intro",
        title: "What a root is and why “= 0” matters",
        steps: [
          {
            cards: [
              {
                type: "insight",
                title: "What an equation really is",
                content:
                  "An equation is like a balance scale: left equals right. When we see “= 0”, we’re looking for the value of x that makes the entire expression become zero.",
              },
              {
                type: "definition",
                term: "Root of an equation",
                content:
                  "A value of x that makes the equation true. If you substitute the root, you get 0 = 0.",
              },
            ],
          },
          {
            cards: [
              {
                type: "example",
                title: "Quick example",
                steps: [
                  "Equation: x − 5 = 0",
                  "What number must x be so that subtracting 5 gives 0?",
                  "x = 5. That is the root.",
                ],
              },
              {
                type: "fact",
                label: "Important",
                content:
                  "In quadratic equations, x is multiplied by itself (x²). That often creates two equally valid solutions — two roots.",
              },
            ],
            check: {
              question: "What does it mean to “find a root”?",
              options: [
                {
                  label: "Simplify the expression",
                  explanation:
                    "Simplifying can help, but it doesn’t produce the value of x by itself.",
                },
                {
                  label: "Find x such that the expression equals 0",
                  isCorrect: true,
                  explanation:
                    "Correct — a root is a value that makes the expression equal zero.",
                },
                {
                  label: "Draw the graph",
                  explanation:
                    "A graph can show roots visually (x-intercepts), but the root is still a number.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "methods",
        title: "Methods: when to use what",
        steps: [
          {
            cards: [
              {
                type: "method",
                number: "1",
                title: "Factor out a common term",
                when: "When there is no constant term (c = 0)",
                example: "x² − 3x = 0  →  x(x − 3) = 0",
                note:
                  "A product is zero if at least one factor is zero. Roots: x = 0 or x = 3.",
              },
            ],
          },
          {
            cards: [
              {
                type: "method",
                number: "2",
                title: "Difference of squares",
                when: "When there is no middle term (b = 0) and it’s a minus",
                example: "x² − 16 = 0  →  (x − 4)(x + 4) = 0",
                note: "Roots: x = 4 and x = −4.",
              },
            ],
          },
          {
            cards: [
              {
                type: "method",
                number: "3",
                title: "General formula (via D)",
                when: "When all three parts exist: ax² + bx + c = 0",
                example: "D = b² − 4ac",
                note:
                  "Universal method — always works, but involves computation.",
              },
            ],
            check: {
              question: "Which method is fastest for x² − 9x = 0?",
              options: [
                {
                  label: "Discriminant",
                  explanation:
                    "It works, but it’s extra work. You can solve in one clean factoring step.",
                },
                {
                  label: "Difference of squares",
                  explanation:
                    "There is a middle term (−9x), so it’s not a pure difference of squares form.",
                },
                {
                  label: "Factor out x",
                  isCorrect: true,
                  explanation:
                    "Exactly. No constant term: x(x − 9) = 0.",
                },
              ],
            },
          },
        ],
      },
      {
        id: "discriminant",
        title: "Discriminant and geometry",
        steps: [
          {
            cards: [
              {
                type: "discriminant",
                title: "Graph meaning",
                story:
                  "A quadratic equation draws a parabola. Setting it equal to 0 means: “Where does the parabola intersect the ground (the x-axis)?”",
                formula: "D = b² − 4ac",
                meaning: [
                  { condition: "D > 0", icon: "⋂", result: "2 intersections (2 roots)" },
                  { condition: "D = 0", icon: "◡", result: "Touches once (1 root)" },
                  { condition: "D < 0", icon: "☁️", result: "No intersection (no real roots)" },
                ],
              },
            ],
            check: {
              question: "What does D < 0 mean on the graph?",
              options: [
                {
                  label: "The parabola crosses the x-axis twice",
                  explanation:
                    "Two crossings correspond to D > 0.",
                },
                {
                  label: "The parabola does not reach the x-axis",
                  isCorrect: true,
                  explanation:
                    "Correct. No real roots means no x-intercepts.",
                },
                {
                  label: "The parabola opens downward",
                  explanation:
                    "Opening direction depends on the sign of a, not D.",
                },
              ],
            },
          },
        ],
      },
    ],
    puzzles: [
      {
        id: "p1",
        label: "Practice 1/8",
        level: 1,
        text: "Which number makes (x − 7) = 0?",
        type: "mcq",
        options: [
          { label: "A", value: "-7", explanation: "-7 − 7 = −14, not zero." },
          { label: "B", value: "7", explanation: "7 − 7 = 0. Correct." },
          { label: "C", value: "0", explanation: "0 − 7 = −7, not zero." },
        ],
        correct: "B",
        explanation: "Substitute 7: 7 − 7 = 0.",
        mentor: { title: "Opposite sign", text: "Inside (x − a), the root is x = a." },
      },
      {
        id: "p2",
        label: "Practice 2/8",
        level: 2,
        text: "Solve: x² − 25 = 0",
        type: "mcq",
        options: [
          { label: "A", value: "Only 5", explanation: "5 works, but you forgot −5." },
          { label: "B", value: "5 and −5", explanation: "Both squares equal 25. Full answer." },
          { label: "C", value: "25", explanation: "25² = 625, not 25." },
        ],
        correct: "B",
        explanation: "x² = 25 has two roots: 5 and −5.",
        mentor: { title: "Two roots", text: "If x² = k (k > 0), then x = ±√k." },
      },
      {
        id: "p3",
        label: "Practice 3/8",
        level: 3,
        text: "Factor out a common term: x² + 4x = 0",
        type: "mcq",
        options: [
          { label: "A", value: "x(x + 4) = 0", explanation: "Correct: take x out." },
          { label: "B", value: "4x(x + 1) = 0", explanation: "That expands to 4x² + 4x." },
          { label: "C", value: "x(4x) = 0", explanation: "That is 4x², not x² + 4x." },
        ],
        correct: "A",
        explanation: "Both terms contain x, so x(x + 4) = 0.",
        mentor: { title: "Now it’s clear", text: "You can see roots immediately: x = 0 and x = −4." },
      },
      {
        id: "p4",
        label: "Practice 4/8",
        level: 3,
        text: "Compute the discriminant for x² − 5x + 6 = 0",
        type: "short_answer",
        correct: "1",
        explanation: "D = (−5)² − 4·1·6 = 25 − 24 = 1.",
        mentor: { title: "Sign check", text: "(−5)² becomes +25." },
      },
      {
        id: "p5",
        label: "Practice 5/8",
        level: 4,
        text: "A parabola touches the x-axis at exactly one point. What is D?",
        type: "mcq",
        options: [
          { label: "A", value: "D > 0", explanation: "D > 0 means two intersections." },
          { label: "B", value: "D < 0", explanation: "D < 0 means no intersection." },
          { label: "C", value: "D = 0", explanation: "Correct: exactly one touch point." },
        ],
        correct: "C",
        explanation: "One touch point means one root, so D = 0.",
        mentor: { title: "Picture ↔ formula", text: "One root happens when the vertex lies on the x-axis." },
      },
      {
        id: "p6",
        label: "Practice 6/8",
        level: 4,
        text: "Solve via discriminant: x² − 5x + 6 = 0. What are the roots?",
        type: "mcq",
        options: [
          { label: "A", value: "x = 2; x = 3", explanation: "Correct: (5 ± 1)/2 gives 2 and 3." },
          { label: "B", value: "x = −2; x = −3", explanation: "Remember: x = (−b ± √D)/(2a)." },
          { label: "C", value: "x = 1; x = 6", explanation: "Those do not satisfy the equation." },
        ],
        correct: "A",
        explanation: "D = 1 → x = (5 ± 1)/2 → 3 and 2.",
        mentor: { title: "Verify", text: "Plug in 2 and 3 — both give 0." },
      },
      {
        id: "p7",
        label: "Practice 7/8",
        level: 5,
        text: "Which equation has no real roots?",
        type: "mcq",
        options: [
          { label: "A", value: "x² − 9 = 0", explanation: "Roots exist: ±3." },
          { label: "B", value: "x² + 9 = 0", explanation: "Correct: x² cannot equal −9 over real numbers." },
          { label: "C", value: "x² − 3x = 0", explanation: "Roots exist: x=0 and x=3." },
        ],
        correct: "B",
        explanation: "x² = −9 is impossible for real x.",
        mentor: { title: "Common sense", text: "Sometimes you don’t need D — just logic." },
      },
      {
        id: "p8",
        label: "Practice 8/8",
        level: 6,
        text: "Sum of roots of x² − 7x + 10 = 0 (write a number)",
        type: "short_answer",
        correct: "7",
        explanation: "Roots are 2 and 5, sum is 7. (Vieta: sum = −b/a = 7).",
        mentor: { title: "Vieta shortcut", text: "For x² + bx + c = 0, sum of roots = −b." },
      },
    ],
  },

  fractions: { title: "Fractions", subtitle: "Understand them without confusion", sections: [], puzzles: [] },
  geometry_basics: { title: "Geometry: Basics", subtitle: "Angles, triangles, and area", sections: [], puzzles: [] },
};