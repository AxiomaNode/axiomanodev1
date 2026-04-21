/**
 * quadratic.practice.js
 *
 * Practice templates for quadratic equations.
 * Layer structure per gap type:
 *   direct   — compute or recall, builds fluency
 *   applied  — evaluate / choose / explain, builds reasoning
 *   transfer — hidden structure, indirect reasoning, comparison, constraint logic
 *   mixed    — spans multiple gap types
 *
 * Flags: diagnostic: false, practice: true, mastery: false
 */

import { pick, buildOptions, fmt } from "../templateUtils";

export const quadraticPracticeTemplates = [

  /* ═══════════════════════════════════════════
     q-discriminant — direct
  ═══════════════════════════════════════════ */

  { id: "Dp1", gapTag: "q-discriminant", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([1,2,3]), b = pick([2,3,4,5,6]), c = pick([1,2,3,4]);
      const D = b*b - 4*a*c;
      return {
        text: `Compute D for ${fmt(a,b,c)}.`,
        ...buildOptions(String(D), [
          String(b*b + 4*a*c),
          String(b*b - 2*a*c),
          String(2*b - 4*a*c)
        ])
      };
    }
  },

  { id: "Dp2", gapTag: "q-discriminant", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([2,3,4]), c = pick([1,2,3]);
      return {
        text: `Compute D for ${fmt(a,0,c)}.`,
        ...buildOptions(String(-4*a*c), [
          String(4*a*c),
          "0",
          String(-2*a*c)
        ])
      };
    }
  },

  { id: "Dp3", gapTag: "q-discriminant", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `For ${fmt(1,-2*r,r*r)}, compute D.`,
        ...buildOptions("0", [
          String(r*r),
          String(-r*r),
          String(4*r)
        ])
      };
    }
  },

  { id: "Dp4", gapTag: "q-discriminant", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([1,2,3]), b = pick([3,4,5,6]), c = pick([1,2,3,4]);
      return {
        text: `Which expression is the correct discriminant for ${fmt(a,b,c)}?`,
        ...buildOptions(`D = ${b}² − 4·${a}·${c}`, [
          `D = ${b}² + 4·${a}·${c}`,
          `D = ${b} − 4·${a}·${c}`,
          `D = 4·${a}·${c} − ${b}²`
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-discriminant — applied
  ═══════════════════════════════════════════ */

  { id: "Ap1", gapTag: "q-discriminant", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `If D = 0, what is true about the roots?`,
        ...buildOptions("Exactly one repeated root", [
          "Two distinct roots",
          "No real roots",
          "Infinite solutions"
        ])
      };
    }
  },

  { id: "Ap2", gapTag: "q-discriminant", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A student computes D = b² + 4ac. What is the error?`,
        ...buildOptions("Sign error — should subtract, not add", [
          "Forgot to square b",
          "Divided by a",
          "No error"
        ])
      };
    }
  },

  { id: "Ap3", gapTag: "q-discriminant", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `For ${fmt(1,-2*r,r*r)}, D = 0. What does this tell you?`,
        ...buildOptions(`Exactly one solution: x = ${r}`, [
          "No real solutions",
          `Two solutions: x = ±${r}`,
          "Need more info"
        ])
      };
    }
  },

  { id: "Ap4", gapTag: "q-discriminant", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([2,3,4]), r2 = pick([-2,-3,-4]);
      const b = -(r1 + r2), c = r1 * r2, D = b*b - 4*c;
      return {
        text: `For ${fmt(1,b,c)}, D = ${D}. A student says "both roots are positive." Evaluate.`,
        ...buildOptions("Incorrect — D > 0 only tells you there are two real roots, not their signs", [
          "Correct",
          "Partially correct",
          "Incorrect — D > 0 means no real roots"
        ])
      };
    }
  },

  { id: "Ap5", gapTag: "q-discriminant", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([1,2,3]), c = pick([1,2,3,4,5]);
      return {
        text: `${fmt(a,0,c)}. What is true about its real solutions?`,
        ...buildOptions("It has no real solutions", [
          "It has two distinct real solutions",
          "It has one repeated real solution",
          "It has x = 0 as a solution"
        ])
      };
    }
  },

  { id: "Ap6", gapTag: "q-discriminant", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A quadratic has D < 0. A student says "one root must be imaginary." Evaluate.`,
        ...buildOptions("Incomplete — both roots are non-real", [
          "Correct",
          "Incorrect — D < 0 means no roots at all",
          "Incorrect — D < 0 means one root"
        ])
      };
    }
  },

  { id: "Ap7", gapTag: "q-discriminant", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5,6]);
      return {
        text: `Which equation has D = 0?`,
        ...buildOptions(fmt(1,-2*r,r*r), [
          fmt(1,0,-(r*r)),
          fmt(1,0,r*r),
          fmt(1,-(r+1),r)
        ])
      };
    }
  },

  { id: "Ap8", gapTag: "q-discriminant", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A quadratic has two distinct real solutions. What must be true?`,
        ...buildOptions("D > 0", [
          "D = 0",
          "D < 0",
          "D ≥ 0"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-discriminant — transfer
  ═══════════════════════════════════════════ */

  { id: "Tp1", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4]);
      return {
        text: `A student is asked whether x(x+${k}) = 5 has two, one, or no real solutions. What hidden feature controls that answer?`,
        ...buildOptions("The sign of the expression b²−4ac after rewriting", [
          "The sign of x",
          "The size of 5",
          "Whether the equation is already factored"
        ])
      };
    }
  },

  { id: "Tp2", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A parabola opens upward and never reaches the x-axis. What must be true about the corresponding equation?`,
        ...buildOptions("It has no real solutions", [
          "It has one repeated real root",
          "It has two distinct real roots",
          "It must be linear"
        ])
      };
    }
  },

  { id: "Tp3", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `In ax² + bx + c = 0, suppose a > 0 and c < 0. Without solving, what can you guarantee?`,
        ...buildOptions("There are two distinct real roots", [
          "There is one repeated root",
          "There are no real roots",
          "Nothing can be guaranteed"
        ])
      };
    }
  },

  { id: "Tp4", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `A student claims ${fmt(1,-2*r,r*r)} should behave like a two-intercept parabola because it factors. Evaluate.`,
        ...buildOptions("Incorrect — it factors as a square, so the graph only touches once", [
          "Correct — every factorization gives two intercepts",
          "Partially correct — only if r is even",
          "Incorrect — it has no real intercepts"
        ])
      };
    }
  },

  { id: "Tp5", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Two different quadratic equations both produce the same sign in b² − 4ac. What do they necessarily share?`,
        ...buildOptions("The same number of real roots", [
          "The same roots",
          "The same coefficients",
          "The same vertex"
        ])
      };
    }
  },

  { id: "Tp6", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([1,2,3,4]);
      return {
        text: `A teacher wants x² + bx + ${k} = 0 to have exactly one real solution. What condition on b makes that happen?`,
        ...buildOptions(`b² = ${4*k}`, [
          `b² > ${4*k}`,
          `b² < ${4*k}`,
          `b = ${k}`
        ])
      };
    }
  },

  { id: "Tp7", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A quadratic does not factor over integers, yet its graph crosses the x-axis twice. What does this show?`,
        ...buildOptions("Integer factorization is not required for real roots", [
          "Crossing twice means the factoring was hidden but integer",
          "Graphs can contradict algebra",
          "Such a quadratic cannot exist"
        ])
      };
    }
  },

  { id: "Tp8", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `A graph has equation y = x²−${2*r}x+${r*r}. How many times does it meet the x-axis?`,
        ...buildOptions("Once", [
          "Never",
          "Twice",
          "Cannot tell without solving"
        ])
      };
    }
  },

  { id: "Tp9", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `If c increases while a and b stay fixed, a quadratic can go from crossing the x-axis twice to not touching it at all. What changed first?`,
        ...buildOptions("The sign of b²−4ac", [
          "The degree of the equation",
          "The sign of a",
          "The sum of the roots stayed the same so nothing important changed"
        ])
      };
    }
  },

  { id: "Tp10", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Without finding the actual roots, what single check separates 0, 1, and 2 real solutions most efficiently?`,
        ...buildOptions("Check the sign of b²−4ac", [
          "Try factoring first",
          "Substitute x = 0",
          "Complete the square every time"
        ])
      };
    }
  },

  { id: "Tp11", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A quadratic produces outputs that are always positive for every real x. What must be true about its graph?`,
        ...buildOptions("It never intersects the x-axis", [
          "It crosses the x-axis twice",
          "It touches the x-axis once",
          "It must be linear"
        ])
      };
    }
  },

  { id: "Tp12", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Equation A has real solutions. Equation B does not. Both are quadratic. What must differ between them?`,
        ...buildOptions("The sign of the coefficient-expression controlling root count", [
          "Their degree",
          "Their variable",
          "Their leading coefficient must have opposite signs"
        ])
      };
    }
  },

  { id: "Tp13", gapTag: "q-discriminant", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `As a parameter changes, a quadratic goes from having solutions to having none. What is happening structurally?`,
        ...buildOptions("A key coefficient-expression changes sign", [
          "The degree changes",
          "The graph becomes linear",
          "The roots swap places but stay real"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-double-root — direct
  ═══════════════════════════════════════════ */

  { id: "Bp1", gapTag: "q-double-root", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `(x−${r})² = 0. What is the solution?`,
        ...buildOptions(`x = ${r}`, [
          `x = ±${r}`,
          `x = −${r}`,
          "No real solution"
        ])
      };
    }
  },

  { id: "Bp2", gapTag: "q-double-root", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `(x−${r})² = 0. How many distinct real roots?`,
        ...buildOptions("1", [
          "2",
          "0",
          "Depends on sign"
        ])
      };
    }
  },

  { id: "Bp3", gapTag: "q-double-root", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `How many distinct real roots does ${fmt(1,-2*r,r*r)} have?`,
        ...buildOptions("1", [
          "2",
          "0",
          "Cannot determine"
        ])
      };
    }
  },

  { id: "Bp4", gapTag: "q-double-root", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `x² = 0. How many elements are in the real solution set?`,
        ...buildOptions("1", [
          "2",
          "0",
          "Infinitely many"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-double-root — applied
  ═══════════════════════════════════════════ */

  { id: "Ba1", gapTag: "q-double-root", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5,6]);
      return {
        text: `A student solves (x−${r})² = 0 and writes x = ±${r}. What is the error?`,
        ...buildOptions(`They added an extra solution; only x = ${r} works`, [
          "They forgot x = 0",
          "They should divide by x",
          "No error"
        ])
      };
    }
  },

  { id: "Ba2", gapTag: "q-double-root", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `If a quadratic can be written as (x−${r})² = 0, what is true about its graph?`,
        ...buildOptions(`It touches the x-axis at x = ${r}`, [
          `It crosses the x-axis at x = ${r} and x = −${r}`,
          "It never meets the x-axis",
          "It must open downward"
        ])
      };
    }
  },

  { id: "Ba3", gapTag: "q-double-root", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([1,2,3,4]);
      return {
        text: `For ${fmt(1,-2*r,r*r)}, a student says "D = 0 means no real roots." Evaluate.`,
        ...buildOptions("Incorrect — D = 0 means one repeated real root", [
          "Correct — zero discriminant means no roots",
          "Correct — repeated roots are not real roots",
          "Incorrect — D = 0 means two distinct roots"
        ])
      };
    }
  },

  { id: "Ba4", gapTag: "q-double-root", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([1,2,3,4]);
      return {
        text: `Which equation has a repeated real root?`,
        ...buildOptions(`(x−${r})² = 0`, [
          `(x−${r})(x+${r}) = 0`,
          `x²+${r} = 0`,
          `x(x−${r}) = 0`
        ])
      };
    }
  },

  { id: "Ba5", gapTag: "q-double-root", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `Compare x² = ${r*r} and (x−${r})² = 0. Which has more distinct real solutions?`,
        ...buildOptions(`x² = ${r*r} has more — 2 versus 1`, [
          `(x−${r})² = 0 has more`,
          "Same number",
          "Neither has real solutions"
        ])
      };
    }
  },

  { id: "Ba6", gapTag: "q-double-root", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A parabola touches the x-axis at one point. A student says "that still means two distinct x-intercepts." Evaluate.`,
        ...buildOptions("Incorrect — touching means one repeated root, not two distinct intercepts", [
          "Correct",
          "Partially correct",
          "Incorrect — it means no roots"
        ])
      };
    }
  },

  { id: "Ba7", gapTag: "q-double-root", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([3,4,5,6]);
      return {
        text: `Which statement is true about ${fmt(1,-2*r,r*r)}?`,
        ...buildOptions(`Its only real root is x = ${r}`, [
          `Its real roots are x = ±${r}`,
          "It has no real roots",
          "It is linear"
        ])
      };
    }
  },

  { id: "Ba8", gapTag: "q-double-root", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Which statement about a repeated real root is FALSE?`,
        ...buildOptions("It gives two distinct x-values", [
          "It corresponds to D = 0",
          "It appears when the graph is tangent to the x-axis",
          "It counts as one distinct real root"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-double-root — transfer
  ═══════════════════════════════════════════ */

  { id: "Bt1", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A parabola touches the x-axis but does not cross it. What must be true about the equation?`,
        ...buildOptions("It has one repeated real root", [
          "It has two distinct real roots",
          "It has no real roots",
          "It is not quadratic"
        ])
      };
    }
  },

  { id: "Bt2", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A student solves a quadratic and gets only one x-value. Which is the best explanation?`,
        ...buildOptions("The equation may have a repeated root", [
          "They definitely forgot the second solution",
          "Quadratics can only have one root",
          "The equation must be linear"
        ])
      };
    }
  },

  { id: "Bt3", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([1,2,3,4]), sq = pick([2,3,4]), b = sq*sq;
      return {
        text: `(x−${a})² = ${b}. What is the solution set?`,
        ...buildOptions(`{${a-sq}, ${a+sq}}`, [
          `{${a+sq}}`,
          `{−${sq}, ${sq}}`,
          `{${a}, ${sq}}`
        ])
      };
    }
  },

  { id: "Bt4", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A quadratic has exactly one real x-intercept. What must be true?`,
        ...buildOptions("Its real root is repeated", [
          "It has two distinct real roots",
          "It has no real roots",
          "It must be linear"
        ])
      };
    }
  },

  { id: "Bt5", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `One equation crosses the x-axis twice. Another only touches it once. What is the key difference?`,
        ...buildOptions("The second has a repeated root", [
          "The second is not quadratic",
          "The first has no real roots",
          "Both have repeated roots"
        ])
      };
    }
  },

  { id: "Bt6", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4]);
      return {
        text: `A student rewrites an equation into the form (x−${r})² = 0. What should they conclude immediately?`,
        ...buildOptions(`There is one repeated root at x = ${r}`, [
          `There are two roots: ${r} and -${r}`,
          "There are no real roots",
          "The equation still needs factoring first"
        ])
      };
    }
  },

  { id: "Bt7", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Which situation is the clearest sign of a repeated root?`,
        ...buildOptions("The graph is tangent to the x-axis", [
          "The graph crosses the x-axis twice",
          "The graph has a negative y-intercept",
          "The equation has three terms"
        ])
      };
    }
  },

  { id: "Bt8", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A student says "a quadratic with one real root must actually be linear." Evaluate.`,
        ...buildOptions("Incorrect — a quadratic can have one repeated real root", [
          "Correct",
          "Partially correct",
          "Incorrect — quadratics always have two distinct real roots"
        ])
      };
    }
  },

  { id: "Bt9", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `How many x-intercepts does y = (x−${r})² have?`,
        ...buildOptions("1", [
          "0",
          "2",
          "Depends on the coefficient of x"
        ])
      };
    }
  },

  { id: "Bt10", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `A student claims ${fmt(1,-2*r,r*r)} and x² = ${r*r} are "basically the same because both have squares." Evaluate.`,
        ...buildOptions("Incorrect — the first has one repeated root, the second has two distinct real roots", [
          "Correct",
          "Partially correct",
          "Incorrect — neither has real roots"
        ])
      };
    }
  },

  { id: "Bt11", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `A quadratic has vertex (${r}, 0). What is true about its real roots?`,
        ...buildOptions("It has one repeated real root", [
          "It has two distinct real roots",
          "It has no real roots",
          "It must be linear"
        ])
      };
    }
  },

  { id: "Bt12", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Which situation guarantees exactly one distinct real solution?`,
        ...buildOptions("The graph is tangent to the x-axis", [
          "The graph crosses the x-axis twice",
          "The constant term is positive",
          "The leading coefficient is 1"
        ])
      };
    }
  },

  { id: "Bt13", gapTag: "q-double-root", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4]);
      return {
        text: `A student rewrites an equation as (x−${r})² = 0 and then searches for a second different root. Evaluate.`,
        ...buildOptions("Unnecessary — the root is repeated, not distinct", [
          "Correct — every quadratic has two different roots",
          `Correct — the second root is −${r}`,
          "Incorrect — there are no real roots"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-div-by-var — direct
  ═══════════════════════════════════════════ */

  { id: "Cp1", gapTag: "q-div-by-var", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5,6]);
      return {
        text: `${fmt(1,-k,0)}. Choose the correct solution set.`,
        ...buildOptions(`{0, ${k}}`, [
          `{${k}}`,
          `{0}`,
          `{−${k}, ${k}}`
        ])
      };
    }
  },

  { id: "Cp2", gapTag: "q-div-by-var", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([2,3,4]), k = pick([2,3,4,5]);
      return {
        text: `${a}x² = ${a*k}x. Choose the solution set.`,
        ...buildOptions(`{0, ${k}}`, [
          `{${k}}`,
          `{0}`,
          `{−${k}, ${k}}`
        ])
      };
    }
  },

  { id: "Cp3", gapTag: "q-div-by-var", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5]);
      return {
        text: `x²+${k}x = 0. The correct factored form is:`,
        ...buildOptions(`x(x+${k}) = 0`, [
          `(x+${k})² = 0`,
          `x(x−${k}) = 0`,
          `x²(1+${k}) = 0`
        ])
      };
    }
  },

  { id: "Cp4", gapTag: "q-div-by-var", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([3,4,5,6,7]);
      return {
        text: `x(x−${k}) = 0. What are ALL solutions?`,
        ...buildOptions(`x = 0 and x = ${k}`, [
          `x = ${k} only`,
          "x = 0 only",
          `x = −${k} and x = ${k}`
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-div-by-var — applied
  ═══════════════════════════════════════════ */

  { id: "Ca1", gapTag: "q-div-by-var", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5,6]);
      return {
        text: `x² = ${k}x. A student divides by x and gets x = ${k}. What is lost?`,
        ...buildOptions("x = 0", [
          `x = −${k}`,
          `x = ${k*2}`,
          "Nothing — complete"
        ])
      };
    }
  },

  { id: "Ca2", gapTag: "q-div-by-var", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5]);
      return {
        text: `x² = ${k}x. Is it valid to divide both sides by x?`,
        ...buildOptions("Not if x = 0 is a solution — that solution gets lost", [
          "Yes, always valid",
          "Yes, x ≠ 0 so it's fine",
          "Yes — same as factoring"
        ])
      };
    }
  },

  { id: "Ca3", gapTag: "q-div-by-var", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([2,3,4]), k = pick([2,3,4,5]);
      return {
        text: `${a}x² = ${a*k}x. A student gives {${k}} as the solution set. This is:`,
        ...buildOptions("Incomplete — missing x = 0", [
          "Complete",
          `Incorrect — should be {0}`,
          `Incorrect — should be {−${k}, ${k}}`
        ])
      };
    }
  },

  { id: "Ca4", gapTag: "q-div-by-var", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5,6]);
      return {
        text: `x²+${k}x = 0. A student factors as x(x+${k}) = 0 and writes {0, −${k}}. Evaluate.`,
        ...buildOptions("Complete and correct", [
          `Incomplete — also x = ${k}`,
          `Incorrect — should be {0, ${k}}`,
          "Incorrect — should divide by x"
        ])
      };
    }
  },

  { id: "Ca5", gapTag: "q-div-by-var", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5]);
      return {
        text: `Why does x²−${k}x = 0 have TWO solutions while x = ${k} (after dividing by x) has one?`,
        ...buildOptions("Dividing by x eliminates x = 0, which is a valid solution", [
          "x² is always positive",
          "Dividing changes the equation",
          "x ≠ 0 for quadratics"
        ])
      };
    }
  },

  { id: "Ca6", gapTag: "q-div-by-var", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5]);
      return {
        text: `True or false: ${k}x²+${k*2}x = 0 always has x = 0 as a solution.`,
        ...buildOptions("True", [
          "False — only if leading coeff is positive",
          "False — x = 0 makes it undefined",
          "True — only if k is even"
        ])
      };
    }
  },

  { id: "Ca7", gapTag: "q-div-by-var", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5,6]);
      return {
        text: `${k}x² = ${k*2}x. Which step is NOT valid?`,
        ...buildOptions("Divide both sides by x", [
          `Divide both sides by ${k}`,
          "Move all terms left",
          `Factor out ${k}x`
        ])
      };
    }
  },

  { id: "Ca8", gapTag: "q-div-by-var", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `x² = x. A student divides by x and gets x = 1. Evaluate.`,
        ...buildOptions("Incomplete — x = 0 is also a solution", [
          "Complete",
          "Incorrect — x = −1",
          "Incorrect — dividing by x is never valid"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-div-by-var — transfer
  ═══════════════════════════════════════════ */

  { id: "Ct1", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5]);
      return {
        text: `x³ = ${k}x². A student divides by x² and gets x = ${k}. How many distinct real solutions are missing?`,
        ...buildOptions("1 — x = 0 is also a solution", [
          "0 — complete",
          "2",
          "Depends on k"
        ])
      };
    }
  },

  { id: "Ct2", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5]), m = pick([1,2,3]);
      return {
        text: `x(x−${k}) = ${m}x. A student divides by x and gets x = ${k+m}. Evaluate.`,
        ...buildOptions("Incomplete — x = 0 is also a solution", [
          "Complete",
          `Incorrect — x = ${k} is the answer`,
          "Incorrect — division changes the equation"
        ])
      };
    }
  },

  { id: "Ct3", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5]);
      return {
        text: `A student rewrites x² = ${k}x as x = ${k} by dividing. Which value is lost and why?`,
        ...buildOptions(`x = 0, because dividing by x assumes x ≠ 0`, [
          `x = −${k}, because division flips signs`,
          `x = ${k*2}, because both sides double`,
          "No value is lost"
        ])
      };
    }
  },

  { id: "Ct4", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([1,4,9]);
      const root = Math.sqrt(k);
      return {
        text: `x⁴ = ${k}x². A student divides by x² and gets x² = ${k}, then x = ±${root}. How many distinct real solutions does the full equation have?`,
        ...buildOptions("3 — also x = 0", [
          "2",
          "4",
          "1"
        ])
      };
    }
  },

  { id: "Ct5", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5]);
      return {
        text: `Which equation is fully equivalent to x² = ${k}x for all real x?`,
        ...buildOptions(`x²−${k}x = 0`, [
          `x = ${k}`,
          `x(x−${k}) = 0, x ≠ 0`,
          "x = 0"
        ])
      };
    }
  },

  { id: "Ct6", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Why is factoring out x safer than dividing by x when solving x²−kx = 0?`,
        ...buildOptions("Factoring keeps x = 0 in the solution set; division throws it away", [
          "Factoring is always faster",
          "Division changes the degree",
          "They are equally safe"
        ])
      };
    }
  },

  { id: "Ct7", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Which kind of step can silently remove a valid solution from an equation?`,
        ...buildOptions("Dividing by an expression that may be zero", [
          "Adding the same number to both sides",
          "Expanding brackets",
          "Factoring a common term"
        ])
      };
    }
  },

  { id: "Ct8", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4,5]);
      return {
        text: `x²(x−${k}) = 0. A student writes only x = ${k}. How many distinct real solutions are missing?`,
        ...buildOptions("1 — x = 0 is also a solution", [
          "2",
          "0",
          "3"
        ])
      };
    }
  },

  { id: "Ct9", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([3,4,5,6]);
      return {
        text: `${k}x² = ${k}x+${k*2}x²−${k}x. Simplify and solve correctly.`,
        ...buildOptions("x = 0 and x = 1", [
          "x = 1 only",
          `x = ${k} only`,
          "No real solutions"
        ])
      };
    }
  },

  { id: "Ct10", gapTag: "q-div-by-var", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A student claims "dividing by a variable is always fine as long as you state the restriction." Is this sufficient?`,
        ...buildOptions("No — stating x ≠ 0 doesn't recover the lost solution; you must check it separately", [
          "Yes — the restriction covers it",
          "Yes — any restriction works",
          "No — division by variable is always forbidden"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-factoring — direct
  ═══════════════════════════════════════════ */

  { id: "Fp1", gapTag: "q-factoring", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5,6,7]);
      return {
        text: `Factor ${fmt(1,-2*r,r*r)}.`,
        ...buildOptions(`(x−${r})²`, [
          `(x+${r})²`,
          `(x−${r})(x+${r})`,
          `(x−${r*r})(x−1)`
        ])
      };
    }
  },

  { id: "Fp2", gapTag: "q-factoring", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([3,4,5,6,7,8]);
      return {
        text: `Factor ${fmt(1,0,-r*r)}.`,
        ...buildOptions(`(x−${r})(x+${r})`, [
          `(x−${r})²`,
          `(x+${r})²`,
          `x(x−${r*r})`
        ])
      };
    }
  },

  { id: "Fp3", gapTag: "q-factoring", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5,6]);
      return {
        text: `Which of these equals (x−${r})²?`,
        ...buildOptions(`x²−${2*r}x+${r*r}`, [
          `x²+${2*r}x+${r*r}`,
          `x²−${r*r}`,
          `x²−${2*r}x−${r*r}`
        ])
      };
    }
  },

  { id: "Fp4", gapTag: "q-factoring", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `${fmt(1,2*r,r*r)} = 0. How many distinct real solutions?`,
        ...buildOptions("1", [
          "0",
          "2",
          "Depends on r"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-factoring — applied
  ═══════════════════════════════════════════ */

  { id: "Fa1", gapTag: "q-factoring", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5,6]);
      return {
        text: `A student sees x²−${2*r}x+${r*r} and factors as (x−${r})(x+${r}). What is wrong?`,
        ...buildOptions(`Confused patterns — correct is (x−${r})², not difference of squares`, [
          "Nothing is wrong",
          "Sign on middle term is off",
          "The factors are reversed"
        ])
      };
    }
  },

  { id: "Fa2", gapTag: "q-factoring", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `Can x²+${r*r} be factored into real linear factors?`,
        ...buildOptions("No — sum of squares is irreducible over ℝ", [
          `(x−${r})(x+${r})`,
          `(x+${r})²`,
          `(x²+${r})(1+${r})`
        ])
      };
    }
  },

  { id: "Fa3", gapTag: "q-factoring", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `A student expands (x+${r})² and writes x²+${r*r}. What error did they make?`,
        ...buildOptions(`Missing the middle term — correct is x²+${2*r}x+${r*r}`, [
          "Wrong constant",
          "Sign error",
          "No error"
        ])
      };
    }
  },

  { id: "Fa4", gapTag: "q-factoring", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `x²−${2*r}x+${r*r} = 0 vs x²−${r*r} = 0. Do they have the same solution set?`,
        ...buildOptions(`No — first has {${r}}, second has {−${r}, ${r}}`, [
          "Yes — same equation rewritten",
          `Yes — both have x = ${r}`,
          "No — neither has solutions"
        ])
      };
    }
  },

  { id: "Fa5", gapTag: "q-factoring", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `${fmt(1,2*r,r*r)}. A student writes x = ${r} and x = −${r}. Evaluate.`,
        ...buildOptions(`Incorrect — (x+${r})² = 0 has only x = −${r}`, [
          "Correct",
          `Incorrect — only x = ${r}`,
          "Incorrect — no real solutions"
        ])
      };
    }
  },

  { id: "Fa6", gapTag: "q-factoring", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `x²−${2*r}x+___ = (x−${r})². What fills the blank?`,
        ...buildOptions(String(r*r), [
          String(r),
          String(2*r),
          String(r*r-1)
        ])
      };
    }
  },

  { id: "Fa7", gapTag: "q-factoring", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `True or false: every perfect square trinomial set equal to zero has exactly one real solution.`,
        ...buildOptions("True", [
          "False — it has two",
          "False — depends on middle term",
          "True — only if leading coefficient is 1"
        ])
      };
    }
  },

  { id: "Fa8", gapTag: "q-factoring", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `Which statement about factoring patterns is FALSE?`,
        ...buildOptions(`x²+${r*r} = (x−${r})(x+${r})`, [
          `x²−${r*r} = (x−${r})(x+${r})`,
          `x²−${2*r}x+${r*r} = (x−${r})²`,
          `x²+${2*r}x+${r*r} = (x+${r})²`
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-factoring — transfer
  ═══════════════════════════════════════════ */

  { id: "Ft1", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `${fmt(1,0,-r*r)} = 0. A student uses (x−${r})² = 0. What error is this?`,
        ...buildOptions(`Confused difference of squares with perfect square — loses x = −${r}`, [
          "No error",
          "Sign error only",
          "Correct factoring"
        ])
      };
    }
  },

  { id: "Ft2", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([2,3]), b = pick([2,3,5]);
      return {
        text: `${a*a}x²−${b*b} = 0. Choose the correct factorization.`,
        ...buildOptions(`(${a}x−${b})(${a}x+${b}) = 0`, [
          `(${a}x−${b})² = 0`,
          `(x−${b})(x+${b}) = 0`,
          `${a*a}(x−${b})(x+${b}) = 0`
        ])
      };
    }
  },

  { id: "Ft3", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([1,2,3,4]), sq = pick([2,3,4,5]), b = sq*sq;
      const x1 = sq-a, x2 = -sq-a;
      return {
        text: `(x+${a})²−${b} = 0. What is the solution set?`,
        ...buildOptions(`{${Math.min(x1,x2)}, ${Math.max(x1,x2)}}`, [
          `{${Math.max(x1,x2)}}`,
          `{${a-sq}, ${a+sq}}`,
          `{−${a}, ${a}}`
        ])
      };
    }
  },

  { id: "Ft4", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `A student says x²−${r*r} and x²−${2*r}x+${r*r} "look similar — probably same factoring." Evaluate.`,
        ...buildOptions("Incorrect — first is difference of squares, second is perfect square trinomial", [
          "Correct",
          "Partially correct — same if r = 1",
          "Correct for all r"
        ])
      };
    }
  },

  { id: "Ft5", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `x⁴−${r*r} = 0. How many real solutions?`,
        ...buildOptions("2", [
          "4",
          "1",
          "0"
        ])
      };
    }
  },

  { id: "Ft6", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const t = pick([1,4,9]);
      const root = Math.sqrt(t);
      return {
        text: `x⁴−${2*t}x²+${t*t} = 0. Factor and identify the real solutions.`,
        ...buildOptions(`(x²−${t})² = 0, so x = ±${root} (each repeated)`, [
          `x = ±${t}`,
          `x = ${t} only`,
          "No real solutions"
        ])
      };
    }
  },

  { id: "Ft7", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `(x−${r})² > 0. For which x is this true?`,
        ...buildOptions(`All x except x = ${r}`, [
          "All x",
          "No x",
          `x > ${r} only`
        ])
      };
    }
  },

  { id: "Ft8", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4]);
      return {
        text: `Complete the square: x²−${2*r}x = ___−${r*r}.`,
        ...buildOptions(`(x−${r})²`, [
          `(x+${r})²`,
          `x²−${r*r}`,
          `(x−${r*r})²`
        ])
      };
    }
  },

  { id: "Ft9", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `x²−${r*r} factors, but x²+${r*r} doesn't over ℝ. Why?`,
        ...buildOptions("Difference of squares gives real roots; sum of squares does not", [
          "They both factor the same way",
          "Factoring depends on the sign of r",
          `x²+${r*r} = (x+${r})(x−${r})`
        ])
      };
    }
  },

  { id: "Ft10", gapTag: "q-factoring", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `A student factors x²−${2*r}x+${r*r} as (x−${r})(x+${r}) and gets x = ±${r}. The actual solution is x = ${r} only. What caused the extra solution?`,
        ...buildOptions("Wrong factoring pattern — introduced an extra root", [
          "Arithmetic error",
          "Correct — both solutions are valid",
          "Sign convention error"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-vieta — direct
  ═══════════════════════════════════════════ */

  { id: "Vp1", gapTag: "q-vieta", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([1,2,3,4,5]), r2 = pick([1,2,3,4,5]), s = r1+r2, p = r1*r2;
      return {
        text: `For ${fmt(1,-s,p)}, what is the sum of the roots?`,
        ...buildOptions(String(s), [
          String(-s),
          String(p),
          String(-p)
        ])
      };
    }
  },

  { id: "Vp2", gapTag: "q-vieta", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([1,2,3,4,5]), r2 = pick([1,2,3,4,5]), s = r1+r2, p = r1*r2;
      return {
        text: `For ${fmt(1,-s,p)}, what is the product of the roots?`,
        ...buildOptions(String(p), [
          String(-p),
          String(s),
          String(-s)
        ])
      };
    }
  },

  { id: "Vp3", gapTag: "q-vieta", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([2,3,4,5]), r2 = pick([1,2,3,4]), s = r1+r2, p = r1*r2;
      return {
        text: `Two roots are ${r1} and ${r2}. Write the quadratic in x²+bx+c = 0 form.`,
        ...buildOptions(fmt(1,-s,p), [
          fmt(1,s,p),
          fmt(1,-s,-p),
          fmt(1,s,-p)
        ])
      };
    }
  },

  { id: "Vp4", gapTag: "q-vieta", difficulty: "direct",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([1,2,3,4,5]), r2 = pick([1,2,3,4,5].filter(v => v !== r1)), s = r1+r2, p = r1*r2;
      return {
        text: `${fmt(1,-s,p)} has one root x₁ = ${r1}. Use Vieta to find x₂.`,
        ...buildOptions(String(r2), [
          String(s),
          String(-r2),
          String(p)
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-vieta — applied
  ═══════════════════════════════════════════ */

  { id: "Va1", gapTag: "q-vieta", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const a = pick([2,3]), r1 = pick([1,2,3]), r2 = pick([1,2,3].filter(v => v !== r1));
      const s = r1+r2, p = r1*r2, b = -a*s, c = a*p;
      return {
        text: `${fmt(a,b,c)} has roots x₁ and x₂. A student writes x₁+x₂ = ${-b}. Evaluate.`,
        ...buildOptions(`Incorrect — sum is −b/a = ${s}, not −b = ${-b}`, [
          "Correct",
          "Partially correct",
          "Incorrect — use quadratic formula"
        ])
      };
    }
  },

  { id: "Va2", gapTag: "q-vieta", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const p = pick([-2,-3,-4,-6,-8]);
      return {
        text: `For a quadratic with x₁·x₂ = ${p}, which must be true?`,
        ...buildOptions("The roots have opposite signs", [
          "Both negative",
          "Both positive",
          "At least one is zero"
        ])
      };
    }
  },

  { id: "Va3", gapTag: "q-vieta", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const p = pick([2,3,4,6,8,9]);
      return {
        text: `For a quadratic with x₁·x₂ = ${p} > 0, which is definitely true?`,
        ...buildOptions("The roots have the same sign", [
          "Both positive",
          "Both negative",
          "The roots are equal"
        ])
      };
    }
  },

  { id: "Va4", gapTag: "q-vieta", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `For x²+bx+c = 0, the sum of roots is negative. What does this tell you about b?`,
        ...buildOptions("b > 0", [
          "b < 0",
          "b = 0",
          "Nothing"
        ])
      };
    }
  },

  { id: "Va5", gapTag: "q-vieta", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `For x²+bx+c = 0, one root is 0. What must be true about c?`,
        ...buildOptions("c = 0", [
          "c > 0",
          "c < 0",
          "c = b"
        ])
      };
    }
  },

  { id: "Va6", gapTag: "q-vieta", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([2,3,4,5]), r2 = pick([1,2,3,4]), s = r1+r2, p = r1*r2, b = -s, c = p;
      return {
        text: `For ${fmt(1,b,c)}, a student writes "sum of roots = ${-b}." Identify the error.`,
        ...buildOptions(`There is no error — for a = 1, sum = −b = ${s}`, [
          "They should use c/a instead",
          "They forgot a negative sign",
          "They must solve first"
        ])
      };
    }
  },

  { id: "Va7", gapTag: "q-vieta", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `True or false: if x₁·x₂ > 0, both roots must be positive.`,
        ...buildOptions("False — both could also be negative", [
          "True",
          "True if sum is also positive",
          "False — roots must be equal"
        ])
      };
    }
  },

  { id: "Va8", gapTag: "q-vieta", difficulty: "applied",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `x₁+x₂ = 0. What does this tell you about b in x²+bx+c = 0?`,
        ...buildOptions("b = 0", [
          "b > 0",
          "b < 0",
          "b = c"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     q-vieta — transfer
  ═══════════════════════════════════════════ */

  { id: "Vt1", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([1,2,3,4,5]), r2 = pick([1,2,3,4,5].filter(v => v !== r1)), s = r1+r2, p = r1*r2;
      return {
        text: `For ${fmt(1,-s,p)}, find x₁²+x₂² without solving.`,
        ...buildOptions(String(s*s-2*p), [
          String(s*s),
          String(s*s+2*p),
          String(p*p)
        ])
      };
    }
  },

  { id: "Vt2", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([1,2,3,4]), r2 = pick([1,2,3,4,5].filter(v => v !== r1)), s = r1+r2, p = r1*r2;
      return {
        text: `For ${fmt(1,-s,p)}, find (x₁+1)(x₂+1) without solving.`,
        ...buildOptions(String(p+s+1), [
          String(p+s),
          String(p-s+1),
          String((p+1)*(s+1))
        ])
      };
    }
  },

  { id: "Vt3", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `For x²+bx+c = 0 with nonzero roots, which expression equals 1/x₁ + 1/x₂?`,
        ...buildOptions("−b/c", [
          "b/c",
          "−c/b",
          "c/b"
        ])
      };
    }
  },

  { id: "Vt4", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([1,2,3,4,5]), r2 = pick([1,2,3,4,5].filter(v => v !== r1)), s = r1+r2, p = r1*r2;
      return {
        text: `For ${fmt(1,-s,p)}, find (x₁−x₂)² without solving.`,
        ...buildOptions(String(s*s-4*p), [
          String(s*s+4*p),
          String(s*s-2*p),
          String(s*s)
        ])
      };
    }
  },

  { id: "Vt5", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4]);
      return {
        text: `A student builds a quadratic with roots ${r} and −${r} and writes x²+${r*r} = 0. Evaluate.`,
        ...buildOptions(`Incorrect — product = −${r*r}, so c = −${r*r}, giving x²−${r*r} = 0`, [
          `Correct — product is ${r*r}`,
          "Partially correct",
          `Correct — b = 0 so c = ${r*r}`
        ])
      };
    }
  },

  { id: "Vt6", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([1,2,3]), r2 = pick([1,2,3].filter(v => v !== r1)), s = r1+r2, p = r1*r2;
      return {
        text: `For ${fmt(1,-s,p)}, find x₁x₂²+x₁²x₂ without solving.`,
        ...buildOptions(String(p*s), [
          String(p*s*s),
          String(s*p*p),
          String(p+s)
        ])
      };
    }
  },

  { id: "Vt7", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const cb = 12, r1 = 2, r2 = 6, s = r1+r2;
      return {
        text: `x²+bx+${cb} = 0 has one root x = ${r1}. Find b using Vieta.`,
        ...buildOptions(String(-s), [
          String(s),
          String(-r1),
          String(-cb)
        ])
      };
    }
  },

  { id: "Vt8", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([1,2,3,4]), r2 = pick([1,2,3,4,5].filter(v => v !== r1)), s = r1+r2, p = r1*r2, b = -s, c = p;
      return {
        text: `For ${fmt(1,b,c)}, find x₁³+x₂³ without solving. Hint: use (x₁+x₂)³−3x₁x₂(x₁+x₂).`,
        ...buildOptions(String(s*s*s-3*p*s), [
          String(s*s*s),
          String(s*s*s+3*p*s),
          String(p*s)
        ])
      };
    }
  },

  { id: "Vt9", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([1,2,3,4]), r2 = pick([1,2,3,4,5].filter(v => v !== r1)), s = r1+r2, p = r1*r2, b = -s, c = p;
      const value = p*p + s*s - 2*p + 1;
      return {
        text: `For ${fmt(1,b,c)}, find (x₁²+1)(x₂²+1) without solving.`,
        ...buildOptions(String(value), [
          String(p*p+1),
          String((s*s-2*p)*p),
          String((p+1)*(p+1))
        ])
      };
    }
  },

  { id: "Vt10", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([2,3,4,5]), r2 = pick([-1,-2,-3,-4,-5].filter(v => v !== -r1)), s = r1+r2, p = r1*r2, b = -s, c = p;
      return {
        text: `For ${fmt(1,b,c)}, a student says "product is negative so one root is negative." Is this complete?`,
        ...buildOptions("Yes — negative product means the roots have opposite signs", [
          "No — need to check sum too",
          "No — product doesn't determine signs",
          "Yes — and both are integers"
        ])
      };
    }
  },

  { id: "Vt11", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A quadratic has sum of roots 0 and product negative. What can you conclude?`,
        ...buildOptions("The roots are opposites with different signs", [
          "Both roots are positive",
          "Both roots are negative",
          "The roots must be equal"
        ])
      };
    }
  },

  { id: "Vt12", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const s = pick([4,5,6,7]), p = pick([3,4,6,8]);
      return {
        text: `A student knows only the sum ${s} and product ${p} of the roots. What is the fastest way to build the equation?`,
        ...buildOptions(`Write x²−${s}x+${p} = 0`, [
          "Use the discriminant first",
          "Solve for the roots numerically",
          "Graph the parabola"
        ])
      };
    }
  },

  { id: "Vt13", gapTag: "q-vieta", difficulty: "transfer",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Which quantity can Vieta give immediately without finding the roots one by one?`,
        ...buildOptions("Their sum and product", [
          "Their exact decimal values only",
          "Their graphs",
          "Their multiplicity only"
        ])
      };
    }
  },

  /* ═══════════════════════════════════════════
     mixed — spans multiple gap types
  ═══════════════════════════════════════════ */

  { id: "Mx1", gapTag: "q-div-by-var", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4,5]);
      return {
        text: `x² = ${r}x. A student divides by x and gets x = ${r}. Identify ALL errors.`,
        ...buildOptions(`They lost x = 0 by dividing by x, so the full solution set is {0, ${r}}`, [
          "They only made an arithmetic error",
          `No error — x = ${r} is complete`,
          "They should have taken square roots"
        ])
      };
    }
  },

  { id: "Mx2", gapTag: "q-vieta", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([2,3,4,5]), r2 = pick([1,2,3,4]), s = r1+r2, p = r1*r2;
      return {
        text: `${fmt(1,-s,p)} — without solving: D = ${s*s-4*p} > 0, sum = ${s}, product = ${p}. How many real roots and what is their sum?`,
        ...buildOptions(`2 roots, sum = ${s}`, [
          `1 root, sum = ${s}`,
          `2 roots, sum = ${-s}`,
          "0 roots"
        ])
      };
    }
  },

  { id: "Mx3", gapTag: "q-discriminant", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4]);
      return {
        text: `${fmt(1,-2*r,r*r)}. A student says "since it factors, it has two roots." Evaluate.`,
        ...buildOptions("Incorrect — it factors as a square, so only one repeated root", [
          "Correct",
          "Partially correct",
          "Incorrect — no real roots"
        ])
      };
    }
  },

  { id: "Mx4", gapTag: "q-div-by-var", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4]);
      return {
        text: `x² = ${k}x. A student divides by x and then uses Vieta on x = ${k}. What is wrong?`,
        ...buildOptions("They removed x = 0, so they are reasoning from an incomplete equation", [
          "Nothing is wrong",
          "Vieta cannot ever be used with quadratics",
          "Division is always valid here"
        ])
      };
    }
  },

  { id: "Mx5", gapTag: "q-factoring", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4]);
      return {
        text: `Compare x²−${r*r} and x²−${2*r}x+${r*r}. Which is true?`,
        ...buildOptions("First has 2 roots, second has 1 repeated root", [
          "Both have 2 roots",
          "Both have 1 root",
          "Neither has real roots"
        ])
      };
    }
  },

  { id: "Mx6", gapTag: "q-vieta", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r1 = pick([2,3,4]), r2 = pick([1,2,3]), s = r1+r2, p = r1*r2;
      return {
        text: `${fmt(1,-s,p)} has D > 0. What must be true?`,
        ...buildOptions(`It has two distinct real roots with sum ${s}`, [
          "It has one root",
          "It has no roots",
          "Its sum cannot be determined"
        ])
      };
    }
  },

  { id: "Mx7", gapTag: "q-div-by-var", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const k = pick([2,3,4]);
      return {
        text: `x(x−${k}) = 0. A student divides by x and gets x = ${k}. Then checks root count from the rewritten equation. What went wrong first?`,
        ...buildOptions("They lost x = 0 before doing any further analysis", [
          "Nothing went wrong",
          "Checking root count fixes the mistake",
          "Division is the preferred first move"
        ])
      };
    }
  },

  { id: "Mx8", gapTag: "q-discriminant", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `A quadratic has D = 0 and is factorable. What must its factorization look like?`,
        ...buildOptions("(x − a)²", [
          "(x − a)(x + a)",
          "x(x − a)",
          "It cannot be factored"
        ])
      };
    }
  },

  { id: "Mx9", gapTag: "q-factoring", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      const r = pick([2,3,4]);
      return {
        text: `A student uses (x−${r})² instead of x²−${r*r}. What is the consequence?`,
        ...buildOptions("They reduce two solutions to one", [
          "They add extra solutions",
          "No change",
          "They remove all solutions"
        ])
      };
    }
  },

  { id: "Mx10", gapTag: "q-vieta", difficulty: "mixed",
    diagnostic: false, practice: true, mastery: false,
    generate() {
      return {
        text: `Without solving fully, which pair gives faster insight into a quadratic: one about how many real roots it has, and one about how the roots combine?`,
        ...buildOptions("Discriminant and Vieta", [
          "Factoring and graphing only",
          "Square roots and substitution",
          "None — full solving is always required"
        ])
      };
    }
  },

];