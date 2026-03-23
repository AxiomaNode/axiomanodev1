# AXIOMA — Complete Context Document
*For use at the start of new conversations*
*Last updated: March 21, 2026*

---

## 1. What Axioma Is

Axioma is a math reasoning diagnostic platform built in React + Firebase.
Solo developer, 14 years old, Tashkent, Uzbekistan. 30 real users, 4.8 rating.

**The core insight:** Most math errors happen between stages of reasoning, not during computation. Students fail not because they can't calculate, but because they misinterpret results, apply the wrong method, or can't connect representations. Standard platforms grade answers. Axioma diagnoses where reasoning breaks.

**Research basis:** Survey of 50 students in Tashkent. Results:
- Block A (basic understanding): 120/150 — surface knowledge mostly intact
- Block B (procedural errors): 40/150 — frequent execution failures
- Block C (method selection): 21/100 — weakest area, students can't choose the right approach
- Block D (graphical/geometric): 75/100 — relatively stronger with visual context
- Block E (non-standard problems): 34/100 — collapses without familiar algorithm

This data maps directly to the five coreGaps.

---

## 2. The Gap Model

Five canonical reasoning failure categories. These are cross-topic — the same gap shows up in every math topic.

```
interpretive  — computes correctly, draws wrong conclusion
               "D = -16 therefore two negative roots"
               Survey: Block A failures

procedural    — right method, broken execution
               "divides both sides by x, loses x=0"
               Survey: Block B failures

strategic     — wrong tool entirely
               "uses quadratic formula on linear equation"
               Survey: Block C failures (weakest block)

adaptive      — collapses on non-standard form
               "can solve x²-5x+6=0 but fails on 6=5x-x²"
               Survey: Block E failures

relational    — can't connect representations
               "knows D formula but can't read the graph"
               Survey: Block D (partially — visual helps them)
```

**Key rule:** These are the detection output. Topic-specific gaps are signal sources that point to coreGaps.

---

## 3. Topic Gap System (Quadratic Equations)

Seven topic gaps, each mapped to a coreGapId:

```
q-discriminant → interpretive  (severity 1 — blocking)
q-double-root  → interpretive  (severity 2)
q-div-by-var   → procedural    (severity 1 — blocking)
q-factoring    → procedural    (severity 2)
q-vieta        → strategic     (severity 2)
q-adaptive     → adaptive      (severity 2) ← NEW, added this session
q-relational   → relational    (severity 2) ← NEW, added this session
```

All seven gaps must be in `gapsDatabase.quadratic` in `gaps.js`.
All five coreGaps can now fire from a single quadratic diagnostic.

---

## 4. The Learning Cycle

```
Diagnostic → Theory → Training → Diagnostic (reassess) → repeat → Mastery Test
```

**Diagnostic** is both entry point AND verification. After training, student runs diagnostic again to check if gap closed. The cycle is circular, not linear.

**Theory** explains the concept at the exact section where the gap lives. Targeted by `recommendation.theorySectionIds`.

**Training** (was called Practice) has two modes in one page:
- Targeted mode: receives `gapId`, shows only questions for that gap. 8-10 questions. Fixes one gap.
- Free mode: general practice, no gap filter. Student picks topic and works broadly.

**Mastery Test** confirms all gaps closed. 15 questions, answer locking, grade letters S/A/B/C/D. Generates fresh questions via `generatePracticeSession`, saves to Firestore once, resumes on return.

**Homework is removed.** Its tasks absorbed into Training free mode. Its role replaced by Mastery Test.

**Diagnostic shows delta** from previous run — "Last time: strong gap. Now: moderate." Most motivating signal.

---

## 5. Detection Architecture

### `buildDiagnosticSession(topicId)`
- Picks 4 templates per gap from `questionTemplates.js`
- Enforces format diversity (no two same-format questions per session)
- Each question gets `gapTag: "q-discriminant"` etc.
- Each question gets `templateId: "A1"` etc. (stable reference)
- Returns 28 questions (7 gaps × 4) shuffled

### `detectAllGaps(answers, allQuestions)`
- Always returns all 5 coreGaps
- Groups questions by `gapTag`
- Counts wrong vs total per gap
- Dynamic thresholds: 50%+ wrong = moderate, 75%+ = strong, 100% = critical
- Wrong = `given !== question.correct` OR `given === "__skipped__"`
- NO `gapAnswers` check — wrong is wrong regardless of which wrong answer
- Evidence attached to each coreGap: which topic gap triggered it, signal counts, recommendation

### Output shape
```js
{
  interpretive: {
    coreGapId: "interpretive",
    title: "Interpretation gap",
    userFacingLabel: "You compute correctly but misread what the result tells you.",
    strength: "strong" | "moderate" | "critical" | null,
    confidence: 0.75,
    evidence: [{
      topicId, topicTitle, gapId, gapTitle,
      description, recommendationText, recommendation,
      severity, wrongCount, signalCount, strength, failedTaskIds
    }],
    resolved: false,
    firstDetected: "2026-03-21"
  },
  procedural: { ... },
  strategic: { ... },
  adaptive: { ... },
  relational: { ... }
}
```

### What's stored in Firestore
```js
result = {
  type: "full",
  answers,
  coreGapProfile,          // the detection output above
  gaps: activeGaps,        // flat array of coreGaps with strength !== null
  topicId: "full",
  topicTitle: "Full Diagnostic",
  questions: allQuestions.map(q => ({id, text, correct, options, topicId})),
  score: { correct, total },
  date: ISO string
}
```

---

## 6. Question Template System

**File:** `src/data/questionTemplates.js`

120 templates total (will be 140 after F/G series fully integrated):
- A1-A20: `q-discriminant` (20 formats)
- B1-B20: `q-double-root` (20 formats)
- C1-C20: `q-div-by-var` (20 formats)
- D1-D20: `q-factoring` (20 formats)
- E1-E20: `q-vieta` (20 formats)
- F1-F8:  `q-adaptive` (8 formats) ← NEW this session
- G1-G8:  `q-relational` (8 formats) ← NEW this session

Each template:
```js
{
  id: "A1",
  gapTag: "q-discriminant",
  format: "identify-no-solution",  // unique format tag
  generate() { return { text, options, correct }; }
}
```

**Exports:**
- `buildDiagnosticSession(topicId)` — 4 per gap, format diversity enforced
- `generatePracticeSession(topicId, count, gapTag)` — for training/puzzles/mastery

---

## 7. UI / Design System

**Aesthetic:** Dark academic. Georgia serif headings, Courier New monospace for labels/numbers, teal (#2a8fa0) as primary accent.

**CSS variables:** `--teal`, `--teal-dark`, `--teal-light`, `--card-bg`, `--border`, `--page-bg`, `--text-dark/mid/light`, `--shadow-sm/md/lg`

**Layout pattern:** `diag-shell` + `diag-shell--with-notes` flex layout for pages with notes panel sidebar.

**Background:** Grid dot pattern on diagnostic/mastery/puzzle pages.

**Pages built:**
- DiagnosticsPage — full cycle, coreGapProfile results
- TheoryPage — 9 sections, animated canvas, gap banner at correct section
- PracticePage (= Training) — needs routing update to receive gapId
- PuzzlesPage — game mode
- MasteryTestPage — complete, grade letters, retry, notes panel
- ProfilePage — XP, tiers, tabs: Progress/Gaps/Results/Notes
- FeedbackPage — public reviews, ratings
- HomePage — daily plan, XP, reasoning radar

---

## 8. File Structure

```
src/
  data/
    questionTemplates.js   — templates + buildDiagnosticSession + generatePracticeSession
    gaps.js                — gapsDatabase (7 quadratic gaps)
    coreGaps.js            — 5 canonical coreGaps with shortLabel
    theory.js              — 9 theory sections for quadratics
    topics.js              — topic metadata
    tasks.js               — training task bank
  core/
    diagnosticEngine.js    — buildFullDiagnostic + detectAllGaps
    scoringEngine.js       — awardPoints, XP
    recommendationEngine.js — getRecommendations (minimal)
  services/
    db.js                  — all Firestore ops including getActiveGaps (with legacy fallback)
  firebase/
    auth.js                — Google auth + photoURL save
  pages/
    diagnosticsPages/DiagnosticsPage.jsx
    theoryPages/TheoryPage.jsx
    practicePages/PracticePage.jsx     ← needs gapId routing
    puzzlesPages/PuzzlesPage.jsx
    masteryTest/MasteryTestPage.jsx
    profilePages/ProfilePage.jsx
    homePage/HomePage.jsx
    feedbackPages/FeedbackPage.jsx
  components/
    NotesPanel.jsx
    layout/Header.jsx
    layout/Sidebar.jsx
  styles/
    layout.css
    diag-shell.css
```

---

## 9. Firestore Key Collections

```
users/{uid}                              — profile, XP, displayName
users/{uid}/diagnostic_sessions          — coreGapProfile shape (new)
                                           gapsByTopic shape (legacy, handled by fallback)
users/{uid}/practice_sessions            — training sessions
users/{uid}/theoryProgress/{topicId}     — section/step progress
users/{uid}/topicNotes/{topicId}         — rich text notes
users/{uid}/masteryTests/{topicId}       — mastery test doc with tasks
```

---

## 10. What's Done vs Pending

### Done this session:
- `detectAllGaps` rewritten to use `gapTag` matching, `coreGapProfile` output
- `getActiveGaps` updated with legacy fallback for old sessions
- `DiagnosticsPage` updated to save/display `coreGapProfile`
- `MasteryTestPage` complete with retry, grade letters, notes panel
- `questionTemplates.js` — `gapAnswers` removed from `buildOptions`
- `q-adaptive` and `q-relational` gap definitions written (need adding to gaps.js)
- F1-F8 and G1-G8 templates written (need adding to questionTemplates.js)
- `diagnosticEngine.js` — `gapAnswers` removed from detection, uses `given !== question.correct`

### Pending (next session priority order):

**1. Merge new gaps and templates**
- Add `q-adaptive` and `q-relational` to `gapsDatabase.quadratic` in `gaps.js`
- Add F1-F8 and G1-G8 to `questionTemplates.quadratic`
- Both written, just need merging

**2. Close the learning cycle**
- Wire Results → Training with `gapId` pre-selected
- Theory completion → routes to Training with detected gap
- Diagnostic results show delta from previous session
- Training page receives `gapId` and filters to targeted mode

**3. Launch blockers (before public sharing)**
- Privacy policy page (2h)
- Onboarding flow — 3 screens explaining diagnostic philosophy (4h)
- Settings page — name, password, grade (3h)
- Version guard for stale Firestore plan shapes (2h) — partially handled by getActiveGaps fallback

**4. Security**
- Answer obfuscation before Instagram push

**5. Documentation**
- GitHub README, ARCHITECTURE.md, RESEARCH.md

---

## 11. The Experiment Plan

Recruit 4-6 weakest-but-motivated students from PDP presentation.
Control group: 2 students study normally.
Axioma group: 2-4 students follow the full cycle.

Pre-test → 2 weeks → Post-test (1 week after finishing, not immediately).

Film before: student reasoning through a problem, making specific errors.
Film after: same structure, different numbers.

Metrics:
1. Detection accuracy — did Axioma's gaps match pre-test weak areas?
2. Improvement — percentage point gain per gap area
3. Retention — does improvement hold 1 week later?

**The Instagram strategy:** Post after experiment results are in. Not "I built a thing" — "I built a thing, tested it, here's what happened to these students." Video evidence + data.

---

## 12. Key Decisions Made (Don't Revisit)

- **No `gapAnswers` in detection** — wrong is wrong, doesn't matter which wrong answer
- **Homework removed** — replaced by Mastery Test + Training
- **Practice = Training** — same page, two modes (targeted with gapId, free without)
- **Diagnostic is circular** — used for baseline AND reassessment after training
- **5 coreGaps are the right granularity** — don't break them into 50
- **Topic gaps serve coreGaps** — they're signal sources, not the detection output
- **gapTag matching, not signal taskId matching** — works with dynamic generation
- **Dynamic thresholds** — scales to however many questions are in session
- **questions saved with session** — historical results don't need static question file

---

## 13. Presentation Strategy (PDP School, 120-200 students)

Open with: "How many of you studied for a math test, felt ready, then got a question wrong you thought you understood?" — every hand goes up.

Then: "The reason isn't that you didn't study enough. There's a specific break in your reasoning chain you never found."

Show live diagnostic on projector. Don't explain it — just do it. The results screen is the demo.

Lead with XP, tiers, mastery cards for 7-10 graders. That's the hook.

Recruit experiment cohort from students who come up to talk after.

---

## 14. Longer Term

- Second topic: linear equations (shares same gap taxonomy, natural prerequisite)
- Shareable result card (for Instagram push)
- Teacher dashboard (class gap distribution, assign topics)
- Mobile: Capacitor wrap for Android APK
- Research paper / blog post with experiment data