# GAP_SYSTEM.md

## Purpose

This document defines the reasoning-gap model for Axioma v1.

Axioma does not diagnose only correctness.  
It diagnoses **where reasoning breaks**.

The gap system must be:

- human-readable
- topic-aware
- stable across modules
- useful for recommendations

---

## 1. Two-Layer Model

Axioma uses exactly two layers.

```
Core Gap (5 total, stable)
  └── Topic Gap (per topic, maps to one core gap)
        └── Sub-Gap (internal signals only, never shown to user)
```

**Layer 1 — Core Gaps**  
Global reasoning failure categories. Stable. Product-level.  
Shown in results, profile, and recommendations.

**Layer 2 — Topic Gaps**  
Concrete manifestations of core gaps inside a specific topic.  
These are the unit of detection. Diagnostic questions are built around them.

**Sub-gaps**  
Internal detection signals. They live inside the diagnostic engine.  
They determine confidence level (moderate vs strong).  
They are never shown to the user directly.

---

## 2. Core Gaps

Canonical v1 set. Do not modify without a deliberate product decision.

```js
[
  {
    id: "strategic",
    title: "Method selection error",
    meaning: "The learner chooses an inappropriate strategy or formula for the problem.",
    userFacingLabel: "You often choose the wrong method here.",
    surveyBlock: "C"  // weakest block in research: 21/100
  },
  {
    id: "procedural",
    title: "Procedural breakdown",
    meaning: "The learner identifies the right approach but executes it incorrectly.",
    userFacingLabel: "Your reasoning starts correctly but breaks during execution.",
    surveyBlock: "B"  // 40/150
  },
  {
    id: "interpretive",
    title: "Interpretation error",
    meaning: "The learner misreads what the problem asks or what a result means.",
    userFacingLabel: "You compute correctly but misread what the result tells you.",
    surveyBlock: "A"
  },
  {
    id: "adaptive",
    title: "Adaptive reasoning gap",
    meaning: "The learner collapses when the problem is non-standard.",
    userFacingLabel: "You struggle when the problem doesn't match a familiar pattern.",
    surveyBlock: "E"  // 34/100
  },
  {
    id: "relational",
    title: "Representation connection gap",
    meaning: "The learner fails to connect symbolic, verbal, graphical, or geometric forms.",
    userFacingLabel: "You lose the thread when the same idea appears in a different form.",
    surveyBlock: "D"  // 75/100 — strong in v1, included for future topics
  }
]
```

**Rules:**
- Keep this list small and stable.
- Survey block references are for internal calibration only.
- `relational` and `adaptive` are not heavily represented in v1 quadratic topic gaps.  
  They exist for future topics (functions, geometry, non-standard problems).
- Multiple topic gaps can map to the same core gap. That is expected and correct.

---

## 3. Topic Gaps

Topic gaps are concrete reasoning failures inside a specific topic.

Each topic gap must:
- map to **exactly one** coreGapId
- carry a severity level (1, 2, or 3)
- define 4 signal tasks
- define 2–3 sub-gaps for internal detection confidence

### v1 Quadratic Topic Gaps

| id | coreGapId | severity | title |
|----|-----------|----------|-------|
| q-discriminant | interpretive | 1 | Misreading what the discriminant tells you |
| q-double-root  | interpretive | 2 | Missing the second square-root outcome |
| q-div-by-var   | procedural   | 1 | Dividing by an expression containing x |
| q-factoring    | procedural   | 2 | Confusing factoring patterns |
| q-vieta        | strategic    | 2 | Misapplying Vieta's formulas |

**Severity rationale:**

`q-discriminant` → severity 1  
Misreading D blocks all downstream reasoning about solution sets.

`q-div-by-var` → severity 1  
Dividing by x silently removes solutions. The student doesn't notice anything is wrong.  
This pattern recurs across topics beyond quadratics.

All others → severity 2  
Important and topic-specific, but more contained in scope.

---

## 4. Severity Levels

| level | meaning |
|-------|---------|
| 1 | Primary / high-value gap — broad reasoning weakness, blocking |
| 2 | Important topic-specific gap |
| 3 | Technical issue — minor, often from haste |

Examples of severity 3:
- sign slips
- notation confusion
- skipped case from carelessness

**UI rules:**
- Severity 1 and 2 are shown in results and profile.
- Severity 3 may be grouped under "technical issues" with lower visual weight.

---

## 5. Sub-Gaps

Sub-gaps are internal only.

They exist to:
- increase detection confidence
- distinguish moderate from strong gap signals
- eventually power more precise recommendations

They are defined in `gaps.js` under the `subGaps` array on each topic gap.  
They must never be used as user-facing labels or shown in UI.

Example (internal):
```js
subGaps: [
  { id: "sq-disc-zero",     description: "Confuses D=0 with D>0 when counting roots" },
  { id: "sq-disc-negative", description: "Treats D<0 as still producing real solutions" },
  { id: "sq-disc-miscount", description: "Computes D correctly but selects wrong root count" }
]
```

---

## 6. Detection Logic

Each topic gap is tested by exactly 4 signal tasks.

```
2 / 4 wrong → moderate (gap detected)
3 / 4 wrong → strong (gap confirmed)
4 / 4 wrong → critical (strong + flag for priority)
```

Stored status per user per topic gap:
```js
{
  topicGapId: "q-vieta",
  detected: true,
  strength: "moderate" | "strong" | "critical"
}
```

**Why not 3/4 as the only threshold:**  
2/4 catches emerging weakness earlier and enables earlier recommendations.  
3/4 distinguishes a confirmed breakdown from a possible one.  
The threshold config lives in each gap's `masteryRule` object — never hardcoded in the engine.

---

## 7. Data Contract

Full topic gap shape:

```js
{
  id: string,                          // "q-vieta"
  topicId: string,                     // "quadratic"
  coreGapId: string,                   // must match a coreGaps.js id
  severity: 1 | 2 | 3,
  title: string,
  description: string,                 // user-facing, plain language
  recommendationText: string,          // user-facing, actionable
  masteryRule: {
    totalSignals: number,              // always 4 in v1
    moderateThreshold: number,         // always 2 in v1
    strongThreshold: number,           // always 3 in v1
  },
  signals: [
    {
      taskId: string,                  // matches question id in questions.js
      expectedFailurePattern: string,  // internal description of wrong-answer pattern
    }
  ],
  subGaps: [
    {
      id: string,                      // "sq-vieta-sum-sign"
      description: string,             // internal only
    }
  ],
  recommendation: {
    theorySectionIds: string[],        // maps to theory content section IDs
    practiceMode: "gap_targeted" | "free",
    practiceTag: string,
  }
}
```

---

## 8. What the User Sees

The user sees:
- detected topic gap title and description
- recommendation text
- which questions they failed that revealed the gap
- core gap category (e.g. "Interpretation error")

The user does **not** see:
- sub-gap IDs
- signal task IDs
- internal confidence scores
- expectedFailurePattern values

Preferred user-facing language:
> "You compute the discriminant correctly, but misread what it means."  
> "Your reasoning starts right but breaks when you try to simplify."  
> "You reach for the wrong method when the problem changes shape."

---

## 9. Stable Areas

Axioma tracks not only what breaks, but what is already solid.

This matters because:
- progress feels like progress, not just a list of failures
- accurate reasoning maps include strengths
- recommendations can build on what already works

Example stored shape:
```js
{
  stableAreas: [
    "Basic discriminant recognition",
    "Reading root count from D"
  ]
}
```

---

## 10. Recommendation Mapping

Every detected gap must produce an action. No dead-end diagnostics.

Gap → theory sections → practice mode + tag → cycle continues.

Theory section IDs in `recommendation.theorySectionIds` are defined by the theory content system.  
The diagnostic engine does not construct recommendation text dynamically —  
it reads `recommendationText` from the gap definition directly.

---

## 11. Rules for AI Assistants and Developers

**Must:**
- Preserve the two-layer model (core + topic)
- Keep sub-gaps internal — never expose them in UI
- Map every topic gap to exactly one coreGapId
- Read masteryRule from gap data — never hardcode thresholds
- Ask before changing thresholds globally

**Must not:**
- Add new core gaps casually
- Collapse the system into correctness-only scoring
- Use sub-gap IDs as user-facing labels
- Invent recommendation logic in the UI layer
- Mix internal IDs with display strings