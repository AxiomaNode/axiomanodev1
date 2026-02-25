export const theoryTopics = [
  {
    id: "quadratic",
    title: "Quadratic Equations",
    subtitle: "Roots, graph meaning, discriminant, and smart methods",
    minGrade: 7,
    maxGrade: 10,
  },
  {
    id: "functions_intro",
    title: "Functions (Intro)",
    subtitle: "Input → rule → output + graphs (core skill)",
    minGrade: 7,
    maxGrade: 10,
  },
  {
    id: "systems_linear",
    title: "Systems of Equations",
    subtitle: "Intersection thinking + elimination",
    minGrade: 7,
    maxGrade: 10,
  },
];

export const theory = {
  quadratic: {
    title: "Quadratic Equations",
    subtitle: "From meaning to methods (board-style)",
    homeworkCount: 15,
    sections: [
      {
        id: "what_is_root",
        title: "Meaning first: what is a root and why “= 0” is powerful",
        steps: [
          {
            cards: [
              {
                type: "insight",
                title: "Think like a teacher, not like a formula machine",
                content:
                  "A root is not ‘a step in a recipe’. A root is a number where the expression becomes zero. If you understand that sentence deeply, most ‘quadratic fear’ disappears.",
              },
              {
                type: "definition",
                term: "Root (solution)",
                content:
                  "A value of x that makes the equation true. For an equation written as something = 0, a root is where that ‘something’ becomes exactly 0.",
              },
              {
                type: "example",
                title: "Warm-up (board-style check)",
                steps: [
                  "Equation: x − 5 = 0",
                  "Ask: which x makes the left side equal 0?",
                  "If x = 5 → 5 − 5 = 0 ✅",
                  "So x = 5 is a root.",
                ],
              },
            ],
            check: {
              question:
                "You see x − 9 = 0. A student says: “The root is −9 because I see a 9.” What is the correct response?",
              options: [
                {
                  label: "They are correct: the root is −9",
                  explanation:
                    "If x = −9, then x − 9 = −18, not 0. The root is the number that makes the expression become 0.",
                },
                {
                  label: "The root is 9, because 9 − 9 = 0",
                  isCorrect: true,
                  explanation:
                    "Exactly. For x − a = 0 the root is x = a.",
                },
                {
                  label: "You cannot know without drawing a graph",
                  explanation:
                    "A graph can show the root, but you can still solve x − 9 = 0 directly.",
                },
              ],
            },
          },

          {
            cards: [
              {
                type: "fact",
                label: "Key habit",
                content:
                  "Every time you claim a root, test it: substitute and see if the left side becomes 0. No test → no confidence.",
              },
              {
                type: "example",
                title: "A quadratic has (usually) two roots — why?",
                steps: [
                  "If x² = 9, then both 3² = 9 and (−3)² = 9",
                  "So x can be 3 OR −3",
                  "This is why quadratics often have two valid solutions.",
                ],
              },
              {
                type: "definition",
                term: "Quadratic equation",
                content:
                  "An equation where the highest power of x is 2. Standard form: ax² + bx + c = 0 with a ≠ 0.",
              },
            ],
            check: {
              question:
                "Which equation is NOT quadratic (in x)?",
              options: [
                { label: "x² − 3x + 2 = 0", explanation: "This is quadratic." },
                { label: "2x² + 7 = 0", explanation: "This is quadratic." },
                {
                  label: "x³ − x = 0",
                  isCorrect: true,
                  explanation:
                    "Degree 3 makes it cubic, not quadratic.",
                },
              ],
            },
          },
        ],
      },

      {
        id: "methods_smart",
        title: "Methods: choosing the right tool (fast, not blind)",
        steps: [
          {
            cards: [
              {
                type: "insight",
                title: "Most mistakes are ‘wrong method choice’",
                content:
                  "If you always use the discriminant, you will be slow and more error-prone. A strong student chooses the simplest method that fits the shape of the equation.",
              },
              {
                type: "method",
                title: "Method 1 — Common factor",
                when: "When c = 0 (no constant term)",
                example: "x² − 5x = 0  →  x(x − 5) = 0",
                note:
                  "Product is zero → at least one factor is zero. Roots: x = 0 or x = 5.",
              },
              {
                type: "method",
                title: "Method 2 — Difference of squares",
                when: "When b = 0 and it’s a minus",
                example: "x² − 16 = 0  →  (x − 4)(x + 4) = 0",
                note:
                  "Roots: x = 4 and x = −4.",
              },
            ],
            check: {
              question:
                "Pick the fastest method for x² − 11x = 0 (and why).",
              options: [
                {
                  label: "Discriminant, because it always works",
                  explanation:
                    "It works, but it’s not the fastest. This equation has c=0, so factoring is immediate.",
                },
                {
                  label: "Common factor, because both terms share x",
                  isCorrect: true,
                  explanation:
                    "Exactly. x(x−11)=0 gives roots in one step.",
                },
                {
                  label: "Difference of squares",
                  explanation:
                    "There is a middle term (−11x), so it’s not a pure x² − k form.",
                },
              ],
            },
          },

          {
            cards: [
              {
                type: "method",
                title: "Method 3 — Factoring by numbers (sum/product thinking)",
                when: "When a=1 and you can find two numbers quickly",
                example: "x² − 7x + 10 = 0 → (x − 2)(x − 5) = 0",
                note:
                  "Find numbers that multiply to +10 and add to −7: −2 and −5.",
              },
              {
                type: "example",
                title: "Board reasoning (not memorization)",
                steps: [
                  "We need (x + m)(x + n) = x² + (m+n)x + mn",
                  "So m + n = −7 and mn = 10",
                  "Numbers: −2 and −5 fit both conditions",
                  "Roots: x = 2 and x = 5",
                ],
              },
            ],
            check: {
              question:
                "A student factors x² − 7x + 10 as (x − 10)(x + 1). What is the best critique?",
              options: [
                {
                  label: "It’s correct because −10 + 1 = −7",
                  explanation:
                    "Sum matches, but product is −10, not +10. Factoring must match both sum and product.",
                },
                {
                  label: "It’s wrong because the product of constants is −10, not 10",
                  isCorrect: true,
                  explanation:
                    "Exactly. Both conditions must match.",
                },
                {
                  label: "It’s wrong because quadratics cannot be factored",
                  explanation:
                    "Many quadratics can be factored.",
                },
              ],
            },
          },
        ],
      },

      {
        id: "discriminant_graph",
        title: "Discriminant as a picture (the real meaning)",
        steps: [
          {
            cards: [
              {
                type: "insight",
                title: "D is not ‘just a formula’",
                content:
                  "The discriminant answers a geometric question: does the parabola meet the x-axis? Twice, once, or never?",
              },
              {
                type: "board",
                scene: {
                  type: "parabola_D_cases",
                  title: "On the board: D and x-intercepts",
                  caption:
                    "Same parabola shape, different vertical positions → 2 roots, 1 root, or no real roots.",
                },
              },
              {
                type: "fact",
                label: "Formula",
                content:
                  "For ax² + bx + c = 0:  D = b² − 4ac. Then: D>0 → 2 roots, D=0 → 1 root, D<0 → no real roots.",
              },
            ],
            check: {
              question:
                "A quadratic has D < 0. Which statement must be true?",
              options: [
                {
                  label: "It has exactly one real root",
                  explanation:
                    "Exactly one real root corresponds to D = 0.",
                },
                {
                  label: "Its parabola never crosses the x-axis",
                  isCorrect: true,
                  explanation:
                    "Correct. No real roots means no x-intercepts.",
                },
                {
                  label: "It opens downward",
                  explanation:
                    "Opening depends on a, not on D.",
                },
              ],
            },
          },

          {
            cards: [
              {
                type: "example",
                title: "Compute D carefully (common trap: signs)",
                steps: [
                  "x² − 6x + 13 = 0",
                  "a=1, b=−6, c=13",
                  "D = (−6)² − 4·1·13 = 36 − 52 = −16",
                  "D < 0 → no real roots",
                ],
              },
              {
                type: "fact",
                label: "Teacher tip",
                content:
                  "If you mess up the sign of b, everything collapses. Always write a, b, c explicitly before computing D.",
              },
            ],
            check: {
              question:
                "You computed D for x² − 6x + 13 and got +16. Which mistake is most likely?",
              options: [
                {
                  label: "You used D = b² + 4ac instead of b² − 4ac",
                  isCorrect: true,
                  explanation:
                    "That’s the classic mistake. The formula is b² − 4ac.",
                },
                {
                  label: "You forgot that (−6)² is negative",
                  explanation:
                    "(−6)² is positive 36, not negative.",
                },
                {
                  label: "You cannot compute D without a graph",
                  explanation:
                    "You can compute D directly from a,b,c.",
                },
              ],
            },
          },
        ],
      },

      {
        id: "finish_homework",
        title: "Finish: what you can do now",
        steps: [
          {
            cards: [
              {
                type: "insight",
                title: "What mastery looks like",
                content:
                  "You can (1) explain what roots mean, (2) choose a method quickly, and (3) predict the number of real roots using D before you solve.",
              },
              {
                type: "fact",
                label: "Next step",
                content:
                  "Now do homework. It’s not random: tasks are stored in Firestore, and you must complete all to finish this topic.",
              },
            ],
            check: {
              question:
                "Which is the BEST first move when you meet a new quadratic problem?",
              options: [
                {
                  label: "Immediately apply the quadratic formula",
                  explanation:
                    "Not best. First decide if a faster method exists.",
                },
                {
                  label: "Look at the form and choose the simplest suitable method",
                  isCorrect: true,
                  explanation:
                    "Exactly. Strategy before calculation.",
                },
                {
                  label: "Ignore the signs and just compute quickly",
                  explanation:
                    "Ignoring signs is the fastest way to get wrong answers.",
                },
              ],
            },
          },
        ],
      },
    ],
  },

  functions_intro: {
    title: "Functions (Intro)",
    subtitle: "Input → rule → output + basic graph meaning",
    homeworkCount: 0,
    sections: [
      {
        id: "placeholder",
        title: "Coming next",
        steps: [
          {
            cards: [
              { type: "insight", title: "This topic is next", content: "I’ll build it the same board-style way: graphs, domain, and reasoning checks." },
              { type: "board", scene: { type: "axes", title: "Board: coordinate axes", caption: "We will draw and read graphs here." } },
            ],
          },
        ],
      },
    ],
  },

  systems_linear: {
    title: "Systems of Equations",
    subtitle: "Intersection thinking + elimination",
    homeworkCount: 0,
    sections: [
      {
        id: "placeholder",
        title: "Coming next",
        steps: [
          {
            cards: [
              { type: "insight", title: "This topic is next", content: "We’ll show why systems = intersection of lines, then elimination and substitution with mini checks." },
              { type: "board", scene: { type: "axes", title: "Board: intersection idea", caption: "A system is where two graphs meet." } },
            ],
          },
        ],
      },
    ],
  },
};