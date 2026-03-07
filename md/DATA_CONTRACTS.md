DATA_CONTRACTS.md
Purpose

This document defines the canonical data contracts for Axioma v1.

Axioma is a reasoning-diagnostic platform. Data models must support:

diagnostics

topic learning

theory notes

targeted practice

progress tracking

later extension to puzzles and leaderboard

These contracts are written for AI assistants and developers. They are strict by default.

1. Core Principles

User profile data and learning activity data must be separated.

Root user document stores identity and aggregate stats only.

Sessions must be append-only records of finished activity.

Topic-level mastery must be stored separately from raw sessions.

Theory notes must be stored by topic.

Services handle Firestore I/O only.

Domain logic for scoring, gap detection, recommendations, and mastery lives in core/.

2. Firestore Structure
users/{uid}
users/{uid}/diagnostic_sessions/{sessionId}
users/{uid}/practice_sessions/{sessionId}
users/{uid}/puzzle_sessions/{sessionId}            // later
users/{uid}/theoryProgress/{topicId}
users/{uid}/topicProgress/{topicId}
users/{uid}/topicNotes/{topicId}
users/{uid}/homework/{topicId}
users/{uid}/homeworkResults/{topicId}

Optional later:

users/{uid}/achievements/{achievementId}
users/{uid}/gapProfiles/{topicId}
3. Root User Document

Path:

users/{uid}

Contract:

{
  uid: string,
  displayName: string,
  email: string,
  language: "en" | "ru" | string,


  xp: number,
  level: number,
  rank: string,
  profilePictureUrl: string | null,


  stats: {
    diagnosticsCompleted: number,
    practiceSessions: number,
    puzzlesSolved: number,
    homeworkCompleted: number,
    feedbackSent: number
  },


  createdAt: Timestamp | string,
  updatedAt: Timestamp | string
}

Rules:

Do not store full sessions inside the root user doc.

Do not store large arrays like full points history in the root user doc.

Aggregate stats may be updated after session completion.

4. Diagnostic Session Contract

Path:

users/{uid}/diagnostic_sessions/{sessionId}

Contract:

{
  sessionId: string,
  type: "diagnostic",
  topicId: string,
  topicTitle: string,


  startedAt: Timestamp | string,
  finishedAt: Timestamp | string,
  durationSec: number,


  score: {
    correct: number,
    total: number,
    percent: number
  },


  gapSummary: {
    detectedCoreGaps: string[],
    detectedTopicGaps: string[],
    strongestAreas: string[],
    needsReview: boolean
  },


  answers: [
    {
      taskId: string,
      prompt: string,
      userAnswer: string | string[] | number | null,
      correctAnswer: string | string[] | number,
      isCorrect: boolean,


      topicGapId: string,
      coreGapId: string,


      explanation: string,
      timeSpentSec: number | null
    }
  ],


  recommendations: {
    theoryTopicIds: string[],
    gapPracticeIds: string[]
  },


  xpEarned: number,
  createdAt: Timestamp | string
}

Rules:

Diagnostic sessions are stored only after completion.

Answers are hidden during the diagnostic flow and revealed only after completion.

Gap detection is derived by core logic, not manually assigned in the UI.

topicGapId must map to a topic-specific gap from the gap system.

coreGapId must map to a global reasoning gap category.

5. Practice Session Contract

Path:

users/{uid}/practice_sessions/{sessionId}

Contract:

{
  sessionId: string,
  type: "practice",
  practiceMode: "general" | "gap_targeted",


  topicId: string,
  topicTitle: string,


  targetGapIds: string[],


  startedAt: Timestamp | string,
  finishedAt: Timestamp | string,
  durationSec: number,


  score: {
    correct: number,
    total: number,
    percent: number
  },


  answers: [
    {
      taskId: string,
      userAnswer: string | string[] | number | null,
      correctAnswer: string | string[] | number,
      isCorrect: boolean,
      explanation: string,
      topicGapId: string | null,
      coreGapId: string | null,
      timeSpentSec: number | null
    }
  ],


  xpEarned: number,
  createdAt: Timestamp | string
}

Rules:

general practice reinforces the full topic after theory.

gap_targeted practice is narrower and built around detected diagnostic weaknesses.

During solving, UI should show only correct / incorrect.

Full explanations appear after set completion.

6. Puzzle Session Contract

Path:

users/{uid}/puzzle_sessions/{sessionId}

Contract:

{
  sessionId: string,
  type: "puzzle",
  topicId: string | null,


  startedAt: Timestamp | string,
  finishedAt: Timestamp | string,
  durationSec: number,


  streakBefore: number,
  streakAfter: number,


  score: {
    correct: number,
    total: number,
    percent: number
  },


  answers: [
    {
      taskId: string,
      userAnswer: string | number | null,
      correctAnswer: string | number,
      isCorrect: boolean,
      timeSpentSec: number | null
    }
  ],


  xpEarned: number,
  createdAt: Timestamp | string
}

Rules:

Puzzles are supplementary.

They train focus, speed, and adaptability.

They do not replace diagnostics or topic mastery.

7. Theory Progress Contract

Path:

users/{uid}/theoryProgress/{topicId}

Contract:

{
  topicId: string,
  topicTitle: string,


  currentSection: number,
  currentStep: number,
  totalSections: number,
  totalSteps: number,


  completedStepIds: string[],
  completedMiniChecks: string[],


  status: "not_started" | "in_progress" | "completed",


  updatedAt: Timestamp | string,
  createdAt: Timestamp | string
}

Rules:

Theory progress tracks reading and mini-check completion only.

Theory completion alone does not imply topic mastery.

Topic mastery comes from post-theory assessment / homework / practice performance.

8. Topic Progress Contract

Path:

users/{uid}/topicProgress/{topicId}

Contract:

{
  topicId: string,
  topicTitle: string,


  status: "not_started" | "in_progress" | "knows" | "expert" | "master",


  bestAssessmentScore: number,
  lastAssessmentScore: number,
  theoryCompleted: boolean,
  recommendedReview: boolean,


  activeCoreGaps: string[],
  activeTopicGaps: string[],


  updatedAt: Timestamp | string,
  createdAt: Timestamp | string
}

Rules:

This document is the current summary of the user’s state in a topic.

It must be updated from completed sessions, never guessed by UI.

status is a mastery label, not a raw score.

Suggested v1 mapping:

< 75 -> in_progress

75-89 -> knows

90-94 -> expert

95+ -> master

This mapping may change later, but all code must read it from one shared config.

9. Topic Notes Contract

Path:

users/{uid}/topicNotes/{topicId}

Contract:

{
  topicId: string,
  topicTitle: string,
  content: string,
  updatedAt: Timestamp | string,
  createdAt: Timestamp | string
}

Rules:

Notes are personal and written during theory.

Notes must be autosaved.

Notes appear inside profile as topic-linked notes.

Do not create a large standalone notes system for v1.

10. Homework Contract

Path:

users/{uid}/homework/{topicId}

Contract:

{
  topicId: string,
  topicTitle: string,


  status: "assigned" | "in_progress" | "completed",


  tasks: [
    {
      id: string,
      prompt: string,
      options: string[],
      correctAnswer: string,
      explanation: string,


      userAnswer: string | null,
      isCorrect: boolean | null
    }
  ],


  score: {
    correct: number,
    wrong: number,
    total: number,
    percent: number
  },


  createdAt: Timestamp | string,
  updatedAt: Timestamp | string,
  completedAt: Timestamp | string | null
}

Rules:

Homework is the topic confirmation layer after theory.

A topic should not receive a strong mastery label without passing its confirmation layer.

11. Homework Result Contract

Path:

users/{uid}/homeworkResults/{topicId}

Contract:

{
  topicId: string,
  bestPercent: number,
  correct: number,
  total: number,
  completedAt: Timestamp | string,
  updatedAt: Timestamp | string
}

Rules:

Store best topic confirmation result separately.

This makes profile and progress queries simpler and cheaper.

12. Shared Topic Definition Contract

Stored in data/ for v1.

{
  id: string,
  title: string,
  slug: string,
  grade: number | null,


  theory: {
    totalSections: number,
    totalSteps: number
  },


  diagnostic: {
    totalQuestions: number,
    mappedGapIds: string[]
  },


  practice: {
    generalSetSize: number,
    gapSetSize: number
  }
}
13. Shared Task Definition Contract

Stored in data/ and generated through templates.

{
  id: string,
  topicId: string,
  templateId: string,


  mode: "diagnostic" | "practice" | "puzzle" | "homework",


  prompt: string,
  options: string[],
  correctAnswer: string,
  explanation: string,


  difficulty: "easy" | "medium" | "hard",


  coreGapId: string | null,
  topicGapId: string | null,


  representationType: "symbolic" | "verbal" | "graphical" | "geometric",
  isTemplateBased: true
}

Rules:

All generated tasks must come from templates.

No AI-generated math problems in production content.

Each diagnostic task should map to one main topic gap.

14. Service Boundaries

services/ may:

save and load Firestore docs

normalize timestamps

fetch lists and documents

services/ must not:

detect gaps

compute mastery

choose recommendations

decide ranks

These belong in core/.

15. AI Assistant Rules for Data Contracts

When modifying data code:

do not invent new Firestore shapes without updating this document

do not move logic from core/ into services/

do not store UI-only fields in Firestore

prefer additive migrations over destructive rewrites