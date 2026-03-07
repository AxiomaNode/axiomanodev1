GAP_SYSTEM.md
Purpose

This document defines the reasoning-gap model for Axioma v1.

Axioma does not diagnose only correctness. It diagnoses where reasoning breaks.

The gap system must therefore be:

human-readable

topic-aware

stable across modules

useful for recommendations

1. Gap Model Overview

Axioma uses a two-layer gap system.

Layer 1 — Core Gaps

These are global reasoning failure categories.

Layer 2 — Topic Gaps

These are concrete manifestations of those failures inside a topic.

This structure is required.

2. Core Gaps

Canonical v1 set:

[
  {
    id: "concept",
    title: "Concept misunderstanding",
    meaning: "The learner does not understand what an object, quantity, or rule means."
  },
  {
    id: "method",
    title: "Method selection error",
    meaning: "The learner chooses an inappropriate strategy or formula for the task."
  },
  {
    id: "procedure",
    title: "Procedural or formal error",
    meaning: "The learner starts in the right direction but performs transformations incorrectly."
  },
  {
    id: "interpretation",
    title: "Interpretation error",
    meaning: "The learner obtains or reads a result incorrectly and does not interpret what it means."
  },
  {
    id: "representation",
    title: "Representation or visual connection gap",
    meaning: "The learner fails to connect symbolic, verbal, graphical, or geometric forms."
  }
]

Rules:

Keep this list small and stable.

These are the product-level categories shown in results, recommendations, and progress.

3. Topic Gaps

Topic gaps are topic-specific reasoning failures.

For quadratic, example set:

[
  {
    id: "q-discriminant",
    coreGapId: "interpretation",
    severity: 2,
    title: "Misreading what the discriminant tells you"
  },
  {
    id: "q-double-root",
    coreGapId: "concept",
    severity: 2,
    title: "Missing the second square-root outcome"
  },
  {
    id: "q-div-by-var",
    coreGapId: "procedure",
    severity: 2,
    title: "Dividing by an expression containing x"
  },
  {
    id: "q-factoring",
    coreGapId: "procedure",
    severity: 2,
    title: "Confusing factoring patterns"
  },
  {
    id: "q-vieta",
    coreGapId: "method",
    severity: 2,
    title: "Misapplying Vieta's formulas"
  }
]

Rules:

Topic gaps must always map to exactly one core gap.

Topic gaps are the main unit of diagnostic detection in v1.

Diagnostic questions are built around topic gaps.

4. Severity Levels

Axioma uses lightweight severity levels.

1 = primary / high-value gap
2 = topic-specific important gap
3 = technical issue / minor issue

Interpretation:

Severity 1: broad reasoning weakness that matters across many tasks

Severity 2: meaningful topic-specific gap

Severity 3: technical mistake category that should be corrected but not overemphasized

Examples of severity 3:

sign slips

notation confusion

skipped case from haste

careless formal omission

Rules:

v1 UI should focus attention on severity 1 and 2.

severity 3 may be grouped visually under technical issues.

5. Detection Logic

For v1, each topic gap is tested by 4 tasks.

Detection rule:

If the learner fails 2 or more of 4 tasks linked to the same topic gap,
mark that topic gap as detected.


If the learner fails 3 or more of 4,
mark it as strong.

Recommended stored status:

{
  topicGapId: "q-vieta",
  detected: true,
  strength: "moderate" | "strong"
}

Why this is better than a rigid 3/4-only rule:

2/4 catches emerging weakness earlier

3/4 distinguishes strong breakdown

recommendations can be prioritized better

If you want stricter behavior, use this variant:

2/4 = watch

3/4 = detected

4/4 = critical

Both models are valid. Use one shared config only.

6. What the User Should See

The user should not see raw internal taxonomy everywhere.

Preferred user-facing language:

You often choose the wrong method here.

You compute the discriminant, but misread what it means.

Your symbolic result is weak when the task becomes visual.

Results page should show:

detected topic gaps

short explanation

short recommendation

related theory recommendation

Profile / Progress should show:

active gaps

resolved gaps later

strongest stable areas too

Do not show only weaknesses.

7. Stable Areas

Axioma should track not only what breaks, but what is already stable.

Reason:

useful learning feedback

better progress experience

avoids profile feeling like a list of failures

Example:

{
  stableAreas: [
    "Basic discriminant recognition",
    "Reading root count from D"
  ]
}

This is not empty praise. It is part of an accurate reasoning map.

8. Recommendation Mapping

Every topic gap should map to a recovery route.

Contract:

{
  id: "q-vieta",
  coreGapId: "method",
  severity: 2,
  title: "Misapplying Vieta's formulas",
  recommendation: {
    theorySectionIds: ["quadratic-vieta-1", "quadratic-vieta-2"],
    practiceMode: "gap_targeted",
    practiceTag: "vieta"
  }
}

Rules:

A detected gap must always produce an action.

No dead-end diagnostics.

9. Gap Data Contract

Recommended topic gap definition:

{
  id: string,
  topicId: string,
  coreGapId: "concept" | "method" | "procedure" | "interpretation" | "representation",
  severity: 1 | 2 | 3,
  title: string,
  description: string,
  recommendationText: string,
  masteryRule: {
    totalSignals: number,
    moderateThreshold: number,
    strongThreshold: number
  },
  signals: [
    {
      taskId: string,
      expectedFailurePattern: string
    }
  ]
}
10. AI Assistant Rules for Gap Work

AI assistants must:

preserve the two-layer model

never introduce many new core gaps casually

keep topic gaps precise and teachable

avoid mixing UI labels with internal IDs

ask before changing thresholds globally

AI assistants must not:

collapse the system into correctness-only scoring

replace topic gaps with vague analytics language

invent recommendation logic in the UI layer