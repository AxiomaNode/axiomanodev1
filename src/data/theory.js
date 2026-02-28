/* ═══════════════════════════════════════════════════════════════
   theory.js — Axioma Theory Content
   Complete quadratic equations course: zero → exam-ready
   ─────────────────────────────────────────────────────────────
   Card types:
     text       — prose paragraph
     fact       — teal left-stripe callout
     definition — italic term + explanation
     formula    — "write this down" boxed formula (NEW)
     example    — dark terminal, numbered steps
     insight    — amber tip/warning
     method     — method card with when/how
     board      — canvas animation (see Chalkboard scenes)
     analogy    — purple friendly analogy card (NEW)
     reveal     — collapsible "I didn't get it → explain more" (NEW)

   Checks are placed sparingly — one per section max,
   at the END of the section, using traps from common mistakes.
═══════════════════════════════════════════════════════════════ */

import { topics } from "./topics";

const theoryMeta = {
  quadratic:    { subtitle: "Roots · Factoring · Formula · Vieta", minGrade: 8 },
  systems:      { subtitle: "Substitution · Addition",            minGrade: 8 },
  functions:    { subtitle: "Domain · Range · Composition",       minGrade: 9 },
  inequalities: { subtitle: "Linear · Quadratic · Sign method",   minGrade: 9 },
  percentages:  { subtitle: "Calculate · Change · Word problems",  minGrade: 7 },
};

export const theoryTopics = topics.map((t) => ({
  id:       t.id,
  title:    t.title,
  subtitle: theoryMeta[t.id]?.subtitle ?? t.description,
  minGrade: theoryMeta[t.id]?.minGrade ?? 0,
  maxGrade: theoryMeta[t.id]?.maxGrade ?? 12,
}));

export const theory = {

  /* ═══════════════════════════════════════════════════════════
     QUADRATIC EQUATIONS — full course
  ═══════════════════════════════════════════════════════════ */
  quadratic: {
    title: "Quadratic Equations",
    homeworkCount: 8,
    sections: [

      /* ─────────────────────────────────────────────────────
         SECTION 1 — What is a quadratic equation?
      ───────────────────────────────────────────────────── */
      {
        title: "What is a Quadratic Equation?",
        steps: [
          {
            // Step 1 — The idea from a real situation
            cards: [
              {
                type: "analogy",
                icon: "⚽",
                title: "Start with a ball",
                content:
                  "Imagine kicking a ball. It goes up, reaches a peak, comes back down, and hits the ground. " +
                  "The height of the ball at each moment in time follows a rule — and that rule is a quadratic equation. " +
                  "The moment the height equals zero? Those are the roots: the exact times the ball is on the ground.",
              },
              {
                type: "text",
                content:
                  "Quadratic equations appear wherever something grows, peaks, and returns: " +
                  "the area of a rectangle, the path of a projectile, the profit curve of a business. " +
                  "Knowing how to solve them is one of the most useful tools in all of mathematics.",
              },
              {
                type: "fact",
                label: "Quick definition",
                content:
                  "A quadratic equation is any equation where the highest power of x is 2. " +
                  "It always looks — or can be rearranged to look — like ax² + bx + c = 0.",
              },
            ],
          },
          {
            // Step 2 — Standard form + identifying a, b, c
            cards: [
              {
                type: "definition",
                term: "Standard form",
                content:
                  "ax² + bx + c = 0, where a ≠ 0. " +
                  "The number a is called the leading coefficient, b the middle coefficient, and c the constant.",
              },
              {
                type: "formula",
                label: "Write this down",
                content: "ax² + bx + c = 0,   a ≠ 0",
                note: "a, b, c are real numbers. The condition a ≠ 0 is critical — if a were 0, the x² term vanishes and it becomes a linear equation.",
              },
              {
                type: "example",
                title: "Identify a, b, c in each equation",
                steps: [
                  "3x² − 5x + 2 = 0  →  a = 3,  b = −5,  c = 2",
                  "x² + 7x = 0        →  a = 1,  b = 7,  c = 0  (no constant term)",
                  "4x² − 9 = 0        →  a = 4,  b = 0,  c = −9  (no middle term)",
                  "−x² + 3x − 1 = 0  →  a = −1, b = 3,  c = −1  (a can be negative)",
                ],
              },
              {
                type: "insight",
                title: "Watch for hidden form",
                content:
                  "Equations like x² = 5x − 6 or 2x(x+1) = 3 are quadratic — they just need rearranging first. " +
                  "Always move everything to one side before identifying a, b, c.",
              },
            ],
            check: {
              question: "Which of the following is NOT a quadratic equation?",
              options: [
                { label: "x² − 3x + 2 = 0", explanation: "This is a quadratic equation — the highest power of x is 2." },
                { label: "0·x² + 5x − 1 = 0", explanation: "Correct. Since a = 0, the x² term is gone. This is actually linear: 5x − 1 = 0." },
                { label: "x² = 0", explanation: "This is quadratic — it's the same as x² + 0x + 0 = 0, so a = 1." },
                { label: "−x² + 4 = 0", explanation: "This is quadratic — a = −1, b = 0, c = 4. A negative a is still valid." },
              ],
              correctIndex: 1,
            },
          },
        ],
      },

      /* ─────────────────────────────────────────────────────
         SECTION 2 — What are roots?
      ───────────────────────────────────────────────────── */
      {
        title: "What Are Roots?",
        steps: [
          {
            // Step 1 — Concept
            cards: [
              {
                type: "analogy",
                icon: "🎯",
                title: "A root is a 'hit'",
                content:
                  "Think of the equation ax² + bx + c as a machine. You put in a number x, it produces an output. " +
                  "A root is any x-value that makes the output exactly zero — it 'hits' the target. " +
                  "The ball analogy: roots are the two moments the ball is at ground level (height = 0).",
              },
              {
                type: "definition",
                term: "Root (solution) of a quadratic",
                content:
                  "A number x₀ is a root of ax² + bx + c = 0 if substituting x₀ makes the equation true. " +
                  "In other words: a(x₀)² + b(x₀) + c = 0.",
              },
              {
                type: "example",
                title: "Verify that x = 3 is a root of x² − x − 6 = 0",
                steps: [
                  "Substitute x = 3 into the left side",
                  "(3)² − (3) − 6  =  9 − 3 − 6  =  0  ✓",
                  "The equation is satisfied, so x = 3 is a root.",
                  "Now check x = −2:  (−2)² − (−2) − 6  =  4 + 2 − 6  =  0  ✓",
                  "So x² − x − 6 = 0 has two roots: x₁ = −2  and  x₂ = 3",
                ],
              },
            ],
          },
          {
            // Step 2 — Visual: parabola and roots
            cards: [
              {
                type: "text",
                content:
                  "Every quadratic equation ax² + bx + c corresponds to a curve called a parabola. " +
                  "The roots of the equation are the x-coordinates where the parabola crosses the x-axis. " +
                  "Watch the parabola for x² − x − 6 being drawn below.",
              },
              {
                type: "board",
                scene: {
                  type: "parabola_single",
                  title: "Graph of y = x² − x − 6",
                  caption:
                    "The parabola crosses the x-axis at x = −2 and x = 3. These crossing points are the roots of x² − x − 6 = 0.",
                  // function coefficients
                  a: 1, b: -1, c: -6,
                  roots: [-2, 3],
                  xRange: [-3.5, 4.5],
                },
              },
              {
                type: "insight",
                title: "How many roots?",
                content:
                  "A parabola can cross the x-axis at 2 points (two roots), touch it at 1 point (one repeated root), " +
                  "or never touch it (no real roots). We'll learn to predict this before solving — using the discriminant.",
              },
            ],
          },
          {
            // Step 3 — How many roots can an equation have? (no check here, save for later)
            cards: [
              {
                type: "fact",
                label: "Key rule",
                content:
                  "A quadratic equation has at most 2 real roots. It can have exactly 2, exactly 1 (a repeated root), or 0 real roots.",
              },
              {
                type: "example",
                title: "Three possible situations",
                steps: [
                  "x² − 5x + 6 = 0  →  two roots: x = 2 and x = 3",
                  "x² − 4x + 4 = 0  →  one root (repeated): x = 2  (the parabola just touches the axis)",
                  "x² + 1 = 0        →  no real roots  (the parabola is entirely above the x-axis)",
                ],
              },
              {
                type: "insight",
                title: "Repeated root ≠ two different roots",
                content:
                  "When we say one repeated root, it means the two roots happen to be equal: x₁ = x₂. " +
                  "The parabola 'kisses' the x-axis but doesn't cross it.",
              },
            ],
            check: {
              question: "For the equation x² − 6x + 9 = 0, which of these is correct?",
              options: [
                { label: "It has two different roots: x = 3 and x = 3", explanation: "Close — but x = 3 and x = 3 is the same number. That's one repeated root, not two different roots." },
                { label: "It has one repeated root: x = 3", explanation: "Correct! x² − 6x + 9 = (x−3)². Substituting x = 3: (3−3)² = 0 ✓. The parabola touches the x-axis exactly once." },
                { label: "It has two roots: x = 3 and x = −3", explanation: "No. Check x = −3: (−3)² − 6(−3) + 9 = 9 + 18 + 9 = 36 ≠ 0. Not a root." },
                { label: "It has no real roots because the discriminant is zero", explanation: "Discriminant = 0 actually means exactly one repeated root — not zero roots. No real roots happens when D < 0." },
              ],
              correctIndex: 1,
            },
          },
        ],
      },

      /* ─────────────────────────────────────────────────────
         SECTION 3 — Method 1: Factoring
      ───────────────────────────────────────────────────── */
      {
        title: "Method 1: Factoring",
        steps: [
          {
            // Step 1 — The idea
            cards: [
              {
                type: "analogy",
                icon: "🔧",
                title: "Factoring = undoing multiplication",
                content:
                  "You already know that 6 = 2 × 3. Factoring an equation means rewriting it as a product. " +
                  "If you can write ax² + bx + c as (x − p)(x − q) = 0, then the roots are simply x = p and x = q. " +
                  "Why? Because if two numbers multiply to give zero, at least one of them must be zero.",
              },
              {
                type: "fact",
                label: "Zero product property",
                content:
                  "If A · B = 0, then A = 0 OR B = 0. " +
                  "This is the foundation of factoring. Once you have (x−p)(x−q) = 0, each factor gives you one root.",
              },
              {
                type: "formula",
                label: "Factored form",
                content: "ax² + bx + c = a(x − x₁)(x − x₂)",
                note: "x₁ and x₂ are the roots. If a = 1: x² + bx + c = (x − x₁)(x − x₂)",
              },
            ],
          },
          {
            // Step 2 — How to find the factors (the p,q method)
            cards: [
              {
                type: "text",
                content:
                  "For equations of the form x² + bx + c = 0 (where a = 1), finding the factors is a pattern: " +
                  "you need two numbers p and q such that p + q = b and p × q = c.",
              },
              {
                type: "formula",
                label: "The key pattern (a = 1 case)",
                content: "Find p, q such that:   p + q = b   and   p × q = c",
                note: "Then: x² + bx + c = (x + p)(x + q), and roots are x = −p and x = −q",
              },
              {
                type: "example",
                title: "Solve x² + 5x + 6 = 0 by factoring",
                steps: [
                  "We need two numbers where:  sum = 5  and  product = 6",
                  "Think: which pairs multiply to 6?   1×6,  2×3",
                  "Which pair also adds to 5?   2 + 3 = 5  ✓",
                  "Factor: x² + 5x + 6 = (x + 2)(x + 3) = 0",
                  "Set each factor to zero:",
                  "  x + 2 = 0  →  x = −2",
                  "  x + 3 = 0  →  x = −3",
                  "Answer: x₁ = −2,  x₂ = −3",
                ],
              },
              {
                type: "insight",
                title: "Signs matter — common trap",
                content:
                  "When c is positive: p and q have the SAME sign (both + or both −). " +
                  "When c is negative: p and q have DIFFERENT signs (one + one −). " +
                  "The sign of b tells you which is bigger.",
              },
            ],
          },
          {
            // Step 3 — Harder example with negative signs
            cards: [
              {
                type: "example",
                title: "Solve x² − x − 6 = 0 by factoring",
                steps: [
                  "Need p, q where: p + q = −1  and  p × q = −6",
                  "Since product is negative, one number is + and one is −",
                  "Pairs with product −6:  (−1 × 6),  (1 × −6),  (−2 × 3),  (2 × −3)",
                  "Which pair has sum −1?   −3 + 2 = −1  ✓",
                  "Factor: (x − 3)(x + 2) = 0",
                  "  x − 3 = 0  →  x = 3",
                  "  x + 2 = 0  →  x = −2",
                  "Answer: x₁ = 3,  x₂ = −2  (matches our parabola from Section 2!)",
                ],
              },
              {
                type: "reveal",
                trigger: "Still confused about signs?",
                cards: [
                  {
                    type: "example",
                    title: "Sign rule step by step",
                    steps: [
                      "For x² − x − 6: b = −1, c = −6",
                      "c is negative → one factor is positive, one is negative",
                      "b is negative → the larger number (in absolute value) is negative",
                      "Product = −6: try (−3) and (+2):  sum = −3+2 = −1  ✓",
                      "So it's (x − 3)(x + 2)",
                      "Rule: write (x ___)(x ___) then fill in your p, q with their signs",
                    ],
                  },
                ],
              },
              {
                type: "fact",
                label: "When does factoring work?",
                content:
                  "Factoring is easiest when a = 1 and the roots are integers. " +
                  "If the roots are fractions or irrational, use the quadratic formula instead.",
              },
            ],
            check: {
              question: "Factor and solve: x² − 7x + 12 = 0. What are the roots?",
              options: [
                { label: "x = 3 and x = 4", explanation: "Correct! We need p+q = −7 and p×q = 12. Both numbers are negative (same sign, product positive, sum negative): (−3)+(−4) = −7, (−3)×(−4) = 12. So (x−3)(x−4) = 0, giving x = 3 and x = 4." },
                { label: "x = −3 and x = −4", explanation: "Check: (−3)² − 7(−3) + 12 = 9 + 21 + 12 = 42 ≠ 0. These are not roots. The factors should be (x−3)(x−4), not (x+3)(x+4)." },
                { label: "x = 3 and x = −4", explanation: "Check: substitute x = −4: 16 + 28 + 12 = 56 ≠ 0. Wrong signs. Both roots are positive here because c = +12 means same-sign factors." },
                { label: "x = −3 and x = 4", explanation: "Check: substitute x = −3: 9 + 21 + 12 = 42 ≠ 0. Not a root. Remember: (x−3)(x−4) gives positive roots when the signs inside are negative." },
              ],
              correctIndex: 0,
            },
          },
        ],
      },

      /* ─────────────────────────────────────────────────────
         SECTION 4 — The Discriminant
      ───────────────────────────────────────────────────── */
      {
        title: "The Discriminant",
        steps: [
          {
            // Step 1 — What discriminant tells you
            cards: [
              {
                type: "analogy",
                icon: "🔭",
                title: "A prediction tool",
                content:
                  "Before you calculate anything, the discriminant tells you how many roots to expect. " +
                  "It's like checking the weather before a trip — one formula saves you all the work of solving, " +
                  "only to discover there's nothing to find.",
              },
              {
                type: "formula",
                label: "Write this down — The Discriminant",
                content: "D = b² − 4ac",
                note: "Calculate this first. Its sign tells you everything about the roots.",
              },
              {
                type: "example",
                title: "The three cases",
                steps: [
                  "D > 0  →  two distinct real roots",
                  "D = 0  →  one repeated root  (parabola touches the axis)",
                  "D < 0  →  no real roots  (parabola doesn't reach the axis)",
                ],
              },
            ],
          },
          {
            // Step 2 — Visual
            cards: [
              {
                type: "board",
                scene: {
                  type: "parabola_D_cases",
                  title: "Three cases of the discriminant",
                  caption:
                    "Left: D > 0, two roots. Middle: D = 0, one repeated root. Right: D < 0, no real roots.",
                },
              },
              {
                type: "insight",
                title: "D doesn't give you the roots — it predicts them",
                content:
                  "Calculate D first. If D < 0, stop — there are no real roots. " +
                  "If D ≥ 0, continue to the quadratic formula in the next section.",
              },
            ],
          },
          {
            // Step 3 — Practice calculating D
            cards: [
              {
                type: "example",
                title: "Calculate D for three equations",
                steps: [
                  "Equation 1: x² − 5x + 4 = 0   →   a=1, b=−5, c=4",
                  "  D = (−5)² − 4·1·4 = 25 − 16 = 9 > 0   →  two roots",
                  "",
                  "Equation 2: x² − 2x + 1 = 0   →   a=1, b=−2, c=1",
                  "  D = (−2)² − 4·1·1 = 4 − 4 = 0   →  one repeated root",
                  "",
                  "Equation 3: x² + 2x + 5 = 0   →   a=1, b=2, c=5",
                  "  D = 2² − 4·1·5 = 4 − 20 = −16 < 0   →  no real roots",
                ],
              },
              {
                type: "insight",
                title: "Common mistake with signs",
                content:
                  "Be careful: b² is always positive (squaring removes the sign). " +
                  "But 4ac can be negative if a and c have opposite signs — then D = b² − (negative) = b² + something, which makes D larger.",
              },
            ],
            check: {
              question: "For 2x² + 3x + 5 = 0, what is D, and what does it tell you?",
              options: [
                { label: "D = 9 − 40 = −31, no real roots", explanation: "Correct! D = b² − 4ac = 3² − 4·2·5 = 9 − 40 = −31. Since D < 0, this equation has no real roots." },
                { label: "D = 9 − 10 = −1, no real roots", explanation: "The formula is 4ac, not 2ac. You need 4 × 2 × 5 = 40, not 10. Always use the full formula: b² − 4ac." },
                { label: "D = 9 + 40 = 49, two roots", explanation: "D = b² minus 4ac — it's subtraction, not addition. And 4·2·5 = 40, so D = 9 − 40 = −31." },
                { label: "D = 49, one repeated root", explanation: "You may have confused b = 3 with something else. b² = 9, not 49. Also it's b² − 4ac = 9 − 40 = −31." },
              ],
              correctIndex: 0,
            },
          },
        ],
      },

      /* ─────────────────────────────────────────────────────
         SECTION 5 — The Quadratic Formula
      ───────────────────────────────────────────────────── */
      {
        title: "The Quadratic Formula",
        steps: [
          {
            // Step 1 — Where it comes from
            cards: [
              {
                type: "text",
                content:
                  "Factoring doesn't always work easily. The quadratic formula is a universal method — " +
                  "it works for ANY quadratic equation, always, no matter what a, b, c are. " +
                  "It was derived by 'completing the square' on the general form ax² + bx + c = 0.",
              },
              {
                type: "formula",
                label: "Write this down — The Quadratic Formula",
                content: "x = (−b ± √D) / (2a),   where D = b² − 4ac",
                note: "The ± gives you two equations: one with + (for x₁) and one with − (for x₂). Together they give both roots.",
              },
              {
                type: "fact",
                label: "Reading the formula",
                content:
                  "x₁ = (−b + √D) / 2a  and  x₂ = (−b − √D) / 2a. " +
                  "If D = 0 then √D = 0, both formulas give the same value — the one repeated root. " +
                  "If D < 0 then √D is not real — no real roots.",
              },
            ],
          },
          {
            // Step 2 — Worked example, slow step by step
            cards: [
              {
                type: "example",
                title: "Solve 2x² − 5x − 3 = 0 using the formula",
                steps: [
                  "Step 1 — Identify:   a = 2,  b = −5,  c = −3",
                  "Step 2 — Discriminant:  D = (−5)² − 4·2·(−3)",
                  "           = 25 − (−24) = 25 + 24 = 49",
                  "           D = 49 > 0  →  two distinct roots",
                  "Step 3 — Apply formula:  x = (−(−5) ± √49) / (2·2)",
                  "           = (5 ± 7) / 4",
                  "Step 4 — Two values:",
                  "  x₁ = (5 + 7) / 4 = 12/4 = 3",
                  "  x₂ = (5 − 7) / 4 = −2/4 = −1/2",
                  "Answer: x₁ = 3,  x₂ = −0.5",
                ],
              },
              {
                type: "reveal",
                trigger: "Walk me through Step 2 again — signs confuse me",
                cards: [
                  {
                    type: "example",
                    title: "Signs in the discriminant — careful",
                    steps: [
                      "c = −3. So 4ac = 4 · 2 · (−3) = −24.",
                      "D = b² − 4ac = 25 − (−24)",
                      "Subtracting a negative = adding: 25 − (−24) = 25 + 24 = 49",
                      "Rule: if c is negative, 4ac is negative, so D gets bigger.",
                      "This makes sense — negative c usually means the roots are real.",
                    ],
                  },
                ],
              },
              {
                type: "insight",
                title: "Verify your answer",
                content:
                  "Always check at least one root by substituting back. " +
                  "For x = 3: 2(9) − 5(3) − 3 = 18 − 15 − 3 = 0 ✓",
              },
            ],
          },
          {
            // Step 3 — Another example + the D = 0 case
            cards: [
              {
                type: "example",
                title: "Solve 9x² − 12x + 4 = 0",
                steps: [
                  "a = 9,  b = −12,  c = 4",
                  "D = (−12)² − 4·9·4 = 144 − 144 = 0",
                  "D = 0  →  one repeated root",
                  "x = −(−12) / (2·9) = 12/18 = 2/3",
                  "Answer: x₁ = x₂ = 2/3",
                  "Verify: 9(4/9) − 12(2/3) + 4 = 4 − 8 + 4 = 0  ✓",
                ],
              },
              {
                type: "fact",
                label: "When D = 0",
                content:
                  "The formula still works. You just get −b / 2a (the ± term disappears since √0 = 0). " +
                  "This one value is both x₁ and x₂ — a 'double root'.",
              },
            ],
            check: {
              question: "Solve x² + 4x + 1 = 0. Which answer is correct? (√3 ≈ 1.732)",
              options: [
                { label: "x = −2 ± √3", explanation: "Correct. D = 16 − 4 = 12. √12 = √(4·3) = 2√3. x = (−4 ± 2√3)/2 = −2 ± √3. So x₁ ≈ −0.27, x₂ ≈ −3.73." },
                { label: "x = −2 ± 2√3", explanation: "You forgot to divide 2√3 by 2a = 2. The formula is (−b ± √D)/(2a), so x = (−4 ± 2√3)/2 = −2 ± √3, not −2 ± 2√3." },
                { label: "x = 2 ± √3", explanation: "The sign of b matters. b = +4, so −b = −4, giving −4/(2·1) = −2. The centre of the two roots is at x = −2, not +2." },
                { label: "x = 4 ± √12", explanation: "You forgot to divide by 2a = 2. The formula is (−b ± √D)/(2a) = (−4 ± √12)/2 = −2 ± √3. Always divide the whole numerator by 2a." },
              ],
              correctIndex: 0,
            },
          },
        ],
      },

      /* ─────────────────────────────────────────────────────
         SECTION 6 — Vieta's Formulas
      ───────────────────────────────────────────────────── */
      {
        title: "Vieta's Formulas",
        steps: [
          {
            // Step 1 — The idea
            cards: [
              {
                type: "analogy",
                icon: "🕵️",
                title: "Knowing the sum and product is enough",
                content:
                  "Imagine I tell you: 'I'm thinking of two numbers. Their sum is 7, their product is 12.' " +
                  "You'd quickly figure out: 3 and 4. " +
                  "Vieta's formulas do the same thing for the roots of a quadratic — " +
                  "from the coefficients alone, you can find the sum and product of the roots without solving the equation.",
              },
              {
                type: "formula",
                label: "Write this down — Vieta's Formulas",
                content: "x₁ + x₂ = −b/a\nx₁ · x₂ = c/a",
                note: "These hold for any quadratic ax² + bx + c = 0 that has real roots. Derived by expanding a(x − x₁)(x − x₂) = 0.",
              },
              {
                type: "example",
                title: "Verify Vieta's for x² − 5x + 6 = 0  (roots are 2 and 3)",
                steps: [
                  "a = 1, b = −5, c = 6",
                  "Vieta's sum:     x₁ + x₂ = −(−5)/1 = 5     Check: 2 + 3 = 5  ✓",
                  "Vieta's product: x₁ · x₂ = 6/1 = 6          Check: 2 × 3 = 6  ✓",
                ],
              },
            ],
          },
          {
            // Step 2 — Using Vieta's to check roots
            cards: [
              {
                type: "text",
                content:
                  "Vieta's formulas are useful in three ways: " +
                  "(1) Verify your roots quickly without substituting. " +
                  "(2) Find a missing coefficient if you know one root. " +
                  "(3) Construct an equation from its roots.",
              },
              {
                type: "example",
                title: "Find c if one root of x² − 3x + c = 0 is x = 1",
                steps: [
                  "Since x = 1 is a root, by Vieta's: x₁ + x₂ = 3,  so x₂ = 3 − 1 = 2",
                  "By Vieta's product: x₁ · x₂ = c",
                  "  1 × 2 = c  →  c = 2",
                  "Check: x² − 3x + 2 = 0  →  (x−1)(x−2) = 0  ✓",
                ],
              },
              {
                type: "example",
                title: "Write the quadratic whose roots are 4 and −1",
                steps: [
                  "Sum: x₁ + x₂ = 4 + (−1) = 3",
                  "Product: x₁ · x₂ = 4 × (−1) = −4",
                  "Vieta's tells us: −b/a = 3 and c/a = −4",
                  "With a = 1:  b = −3,  c = −4",
                  "Equation: x² − 3x − 4 = 0",
                  "Verify: (x−4)(x+1) = x² − 3x − 4  ✓",
                ],
              },
            ],
          },
          {
            // Step 3 — Tricky check
            cards: [
              {
                type: "insight",
                title: "Vieta's shortcut for mental math",
                content:
                  "If a = 1: just read off b and c. The roots sum to −b (flip the sign of the middle term) " +
                  "and multiply to c (the constant). No formula needed — it's pattern recognition.",
              },
              {
                type: "example",
                title: "Mental math: what's the sum and product of roots of x² − 8x + 15 = 0?",
                steps: [
                  "a = 1, so: sum = −(−8) = 8,  product = 15",
                  "We need two numbers: sum 8, product 15  →  3 and 5",
                  "Roots: x₁ = 3, x₂ = 5  (no formula needed!)",
                ],
              },
            ],
            check: {
              question:
                "The roots of 2x² − 10x + k = 0 satisfy x₁ · x₂ = 6. Find k.",
              options: [
                { label: "k = 12", explanation: "Correct. By Vieta's: x₁ · x₂ = c/a = k/2. We need k/2 = 6, so k = 12. Notice a = 2, so you must multiply by 2 — not just set k = 6." },
                { label: "k = 6", explanation: "Vieta's product formula is c/a, not c alone. Here a = 2, so x₁·x₂ = k/2. Setting k/2 = 6 gives k = 12, not k = 6." },
                { label: "k = 3", explanation: "This would give x₁·x₂ = 3/2, not 6. Remember c/a = k/2 must equal 6, so k = 12." },
                { label: "k = 5", explanation: "You may have used the sum formula (−b/a = 10/2 = 5) by mistake. For the product we use c/a = k/2 = 6, giving k = 12." },
              ],
              correctIndex: 0,
            },
          },
        ],
      },

      /* ─────────────────────────────────────────────────────
         SECTION 7 — Special Cases
      ───────────────────────────────────────────────────── */
      {
        title: "Special Cases & Shortcuts",
        steps: [
          {
            // Step 1 — b = 0 and c = 0
            cards: [
              {
                type: "text",
                content:
                  "Some quadratics look simpler than the standard form. " +
                  "Recognising these special cases lets you solve them instantly — no formula needed.",
              },
              {
                type: "method",
                title: "Case 1: b = 0 (pure quadratic)",
                when: "No middle term — looks like ax² + c = 0",
                example: "4x² − 9 = 0",
                note: "Isolate x²: x² = 9/4, then x = ±√(9/4) = ±3/2",
              },
              {
                type: "example",
                title: "Solve 3x² − 27 = 0",
                steps: [
                  "Move constant: 3x² = 27",
                  "Divide by 3:   x² = 9",
                  "Square root:   x = ±3",
                  "Answer: x₁ = 3,  x₂ = −3  (always ± when there's no b term)",
                ],
              },
              {
                type: "method",
                title: "Case 2: c = 0 (no constant)",
                when: "No constant term — looks like ax² + bx = 0",
                example: "x² + 5x = 0",
                note: "Factor out x: x(x + 5) = 0, giving x = 0 or x = −5. One root is always zero.",
              },
              {
                type: "example",
                title: "Solve 3x² − 12x = 0",
                steps: [
                  "Factor: 3x(x − 4) = 0",
                  "3x = 0  →  x = 0",
                  "x − 4 = 0  →  x = 4",
                  "Answer: x₁ = 0,  x₂ = 4",
                ],
              },
            ],
          },
          {
            // Step 2 — Perfect square trinomial
            cards: [
              {
                type: "definition",
                term: "Perfect square trinomial",
                content:
                  "An expression of the form a² ± 2ab + b² = (a ± b)². " +
                  "When a quadratic matches this pattern, it factors to a perfect square and has exactly one repeated root.",
              },
              {
                type: "formula",
                label: "Patterns to memorize",
                content: "(x + a)² = x² + 2ax + a²\n(x − a)² = x² − 2ax + a²",
                note: "Spot these instantly: the constant is a perfect square, and the middle coefficient is exactly 2a.",
              },
              {
                type: "example",
                title: "Recognise and factor quickly",
                steps: [
                  "x² + 6x + 9  →  a = 3  (since 2·3 = 6 and 3² = 9)  →  (x + 3)²",
                  "x² − 10x + 25  →  a = 5  →  (x − 5)²",
                  "x² + 8x + 16 = 0  →  (x + 4)² = 0  →  x = −4  (one repeated root)",
                ],
              },
              {
                type: "insight",
                title: "Difference of squares (bonus)",
                content:
                  "Don't forget: a² − b² = (a+b)(a−b). " +
                  "For example, x² − 16 = (x+4)(x−4) = 0 gives roots x = ±4 instantly.",
              },
            ],
            check: {
              question: "Solve: 5x² − 5 = 0. What are the roots?",
              options: [
                { label: "x = 1 and x = −1", explanation: "Correct! 5x² = 5, x² = 1, x = ±1. This is a pure quadratic (b = 0) — always gives ±√(something)." },
                { label: "x = 1 only", explanation: "When b = 0 and c ≠ 0, there are always two roots: +√(c) and −√(c). Don't forget the negative root." },
                { label: "x = 5 and x = −5", explanation: "You forgot to divide by a first. 5x² = 5 → x² = 1, not x² = 25. Divide by 5 before taking the square root." },
                { label: "x = √5 and x = −√5", explanation: "5x² = 5 → x² = 1, not x² = 5. You need to divide both sides by a = 5 first." },
              ],
              correctIndex: 0,
            },
          },
        ],
      },

      /* ─────────────────────────────────────────────────────
         SECTION 8 — Choosing Your Method
      ───────────────────────────────────────────────────── */
      {
        title: "Choosing the Right Method",
        steps: [
          {
            cards: [
              {
                type: "text",
                content:
                  "You now have four tools: special cases, factoring, the discriminant check, and the quadratic formula. " +
                  "Knowing when to use each one makes solving faster and reduces errors. " +
                  "Here's the decision process a mathematician uses:",
              },
              {
                type: "method",
                title: "Step 1 — Check for special cases first",
                when: "No middle term (b = 0) or no constant (c = 0)",
                example: "3x² − 12 = 0  or  x² − 7x = 0",
                note: "These solve in 2 lines. Always look for them before doing anything else.",
              },
              {
                type: "method",
                title: "Step 2 — Try factoring (for integer coefficients)",
                when: "a = 1 and you can spot integer roots quickly",
                example: "x² − 7x + 12 = 0  →  (x−3)(x−4)",
                note: "If you can't find the factors in 20 seconds, move to the formula.",
              },
              {
                type: "method",
                title: "Step 3 — Use the discriminant + formula (always works)",
                when: "a ≠ 1, or decimal/fractional answers expected, or nothing else works",
                example: "2x² − 5x − 3 = 0  →  D = 25+24 = 49  →  formula",
                note: "Check D first. If D < 0, stop. If D ≥ 0, apply x = (−b ± √D) / 2a.",
              },
              {
                type: "formula",
                label: "Decision flowchart (memorise this sequence)",
                content:
                  "b=0 or c=0 ?  → special case\n" +
                  "a=1 + integer roots? → factoring\n" +
                  "otherwise → quadratic formula",
                note: "Vieta's formulas can verify any result and solve 'find the coefficient' problems.",
              },
              {
                type: "fact",
                label: "You are exam-ready when you can...",
                content:
                  "1. Identify a, b, c instantly in any rearranged form. " +
                  "2. Calculate D without error. " +
                  "3. Apply the formula and simplify √D. " +
                  "4. Use Vieta's to check or construct equations. " +
                  "5. Recognise special cases on sight.",
              },
            ],
          },
        ],
      },
    ],
  },

};