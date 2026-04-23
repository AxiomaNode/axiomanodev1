import { pick, buildOptions, fmt } from "../templateUtils";

export const quadraticMasteryTemplates = [

/* =========================
   q-discriminant
========================= */

// 🔹 DIRECT (1)
{
  id: "M_D1",
  gapTag: "q-discriminant",
  difficulty: "direct",
  mastery: true,
  generate() {
    return {
      text: "How many real solutions does x² + 4x + 4 = 0 have?",
      ...buildOptions("1", ["0", "2", "Infinitely many"])
    };
  }
},

// 🔹 APPLIED (3)
{
  id: "M_A1",
  gapTag: "q-discriminant",
  difficulty: "applied",
  mastery: true,
  generate() {
    return {
      text: "A student says: 'If D > 0, both roots are positive.' Evaluate.",
      ...buildOptions(
        "Incorrect — D > 0 only guarantees two real roots",
        ["Correct", "Partially correct", "Incorrect — roots must be negative"]
      )
    };
  }
},

{
  id: "M_A2",
  gapTag: "q-discriminant",
  difficulty: "applied",
  mastery: true,
  generate() {
    return {
      text: "Which equation has exactly one real solution?",
      ...buildOptions(
        "x² − 4x + 4 = 0",
        ["x² − 4 = 0", "x² + 4 = 0", "x² − x = 0"]
      )
    };
  }
},

{
  id: "M_A3",
  gapTag: "q-discriminant",
  difficulty: "applied",
  mastery: true,
  generate() {
    return {
      text: "A parabola opens upward and its vertex lies above the x-axis. What must be true?",
      ...buildOptions(
        "No real roots",
        ["One real root", "Two real roots", "Cannot determine"]
      )
    };
  }
},

// 🔹 TRANSFER (4)
{
  id: "M_T1",
  gapTag: "q-discriminant",
  difficulty: "transfer",
  mastery: true,
  generate() {
    return {
      text: "Which graph would touch the x-axis exactly once?",
      ...buildOptions(
        "The one with vertex on the x-axis",
        ["The one entirely above", "The one crossing twice", "All of them"]
      )
    };
  }
},

{
  id: "M_T2",
  gapTag: "q-discriminant",
  difficulty: "transfer",
  mastery: true,
  generate() {
    return {
      text: "x(x − 3) = 4. How many real solutions does this have?",
      ...buildOptions(
        "2",
        ["1", "0", "Cannot determine"]
      )
    };
  }
},

{
  id: "M_T3",
  gapTag: "q-discriminant",
  difficulty: "transfer",
  mastery: true,
  generate() {
    return {
      text: "Which equation cannot have real solutions?",
      ...buildOptions(
        "x² + 4x + 5 = 0",
        ["x² − 4 = 0", "x(x − 3) = 0", "x² − x = 0"]
      )
    };
  }
},

{
  id: "M_T4",
  gapTag: "q-discriminant",
  difficulty: "transfer",
  mastery: true,
  generate() {
    return {
      text: "A parabola stays entirely above the x-axis. A student expects two real roots because it’s quadratic. Evaluate.",
      ...buildOptions(
        "Incorrect — quadratics do not always have real roots",
        ["Correct", "Partially correct", "Cannot determine"]
      )
    };
  }
},

/* =========================
   q-double-root
========================= */

// 🔹 DIRECT
{
  id: "M2_D1",
  gapTag: "q-double-root",
  difficulty: "direct",
  mastery: true,
  generate() {
    return {
      text: "x² = 0. How many solutions?",
      ...buildOptions("1", ["2", "0", "Infinite"])
    };
  }
},

// 🔹 APPLIED
{
  id: "M2_A1",
  gapTag: "q-double-root",
  difficulty: "applied",
  mastery: true,
  generate() {
    return {
      text: "A student solves x² = 9 and writes x = 3. Evaluate.",
      ...buildOptions(
        "Incomplete — x = −3 also",
        ["Correct", "Incorrect — no solutions", "Incorrect — x = 0"]
      )
    };
  }
},

{
  id: "M2_A2",
  gapTag: "q-double-root",
  difficulty: "applied",
  mastery: true,
  generate() {
    return {
      text: "(x−2)² = 0. A student says there are two solutions. Evaluate.",
      ...buildOptions(
        "Incorrect — only one unique value",
        ["Correct", "Partially correct", "No solutions"]
      )
    };
  }
},

// 🔹 TRANSFER
{
  id: "M2_T1",
  gapTag: "q-double-root",
  difficulty: "transfer",
  mastery: true,
  generate() {
    return {
      text: "A solution set has exactly one number. What must have happened?",
      ...buildOptions(
        "A square equals zero",
        ["A square equals positive", "Linear equation", "No solution"]
      )
    };
  }
},

{
  id: "M2_T2",
  gapTag: "q-double-root",
  difficulty: "transfer",
  mastery: true,
  generate() {
    return {
      text: "(x−4)² = 9. What should you expect about the answers before solving?",
      ...buildOptions(
        "Two values equally spaced from 4",
        ["One value", "No values", "Both negative"]
      )
    };
  }
},

{
  id: "M2_T3",
  gapTag: "q-double-root",
  difficulty: "transfer",
  mastery: true,
  generate() {
    return {
      text: "A student ends with one answer but last step was a square equals a positive number. Best evaluation?",
      ...buildOptions(
        "Answer is incomplete",
        ["Correct", "No solution", "Irrelevant"]
      )
    };
  }
},

];