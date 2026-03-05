Axioma Development Rules for AI Assistants

This document defines strict rules for AI assistants (ChatGPT, Claude, or any other coding assistant) working on the Axioma codebase.

The goal is to protect architecture stability and avoid random changes.

1. General Principles

AI assistants must:

follow the architecture defined in GUIDELINES.md

avoid unnecessary refactoring

avoid rewriting working code

avoid redesigning UI without request

Priority order:

1. Product logic
2. Architecture consistency
3. UI stability
4. Code clarity
2. Forbidden Actions

AI assistants must NOT:

1. Randomly redesign UI

Do not change layout, colors, or spacing unless explicitly asked.

2. Rename files without reason

File renaming breaks imports.

3. Rewrite large components

If a component works, modify only the necessary parts.

4. Introduce new libraries without request

Allowed stack is already defined.

5. Generate math problems with AI

All problems must be template-based.

3. Allowed Tech Stack

Frontend:

React
JavaScript / TypeScript
TailwindCSS (if used)

Backend:

Firebase
Firestore
Firebase Auth

No additional backend frameworks should be introduced.

4. File Structure Rules

Project structure must remain consistent.

Example:

src
 ├ pages
 ├ components
 ├ core
 ├ data
 ├ firebase
 ├ services
 ├ styles
Pages

Pages define screens only.

Example:

DiagnosticsPage
PracticePage
TheoryPage
ResultsPage
ProfilePage

Pages must not contain heavy logic.

Components

Reusable UI elements.

Examples:

NotesPanel
QuestionCard
ProgressChart
TopicCard
ResultBreakdown

Components must be small and reusable.

Core

Contains logic engines.

Examples:

diagnosticEngine
practiceEngine
scoringEngine
topicEngine
taskFactory

Core should not depend on UI.

Data

Contains static data.

Examples:

topics
problemTemplates
illustrations
Services

Handles Firestore operations.

Examples:

savePracticeSession
getPracticeSessions
saveDiagnosticSession
getDiagnostics
getTopicProgress

Services must contain no UI code.

5. Component Design Rules

Components must follow these principles:

small
predictable
stateless when possible

Avoid components larger than 200–300 lines.

Split large components into smaller ones.

6. UI Rules

UI must remain consistent with Axioma design.

Key principles:

minimal
clean
readable
math-friendly

Important rules:

Math problems must be easy to read.

Avoid dense text blocks.

Prefer:

cards
visual spacing
diagrams
7. NotesPanel Rules

NotesPanel is a global component.

It must work in:

Diagnostics
Practice
Puzzles
Theory

NotesPanel must support:

auto-save
font-size control
mobile drawer mode
desktop side panel

AI assistants must not remove NotesPanel integration.

8. Session Rules

Learning activity must be saved as sessions.

Types:

diagnostic
practice
puzzle

Session example:

type
topicId
startedAt
finishedAt
score
xpEarned
answers[]

Answers must store:

taskId
userAnswer
correctAnswer
isCorrect
gapType
9. Diagnostics Rules

Diagnostics must:

hide answers during session
reveal answers after completion

Diagnostics must measure:

concept understanding
method selection
procedural correctness
interpretation
representation
10. Practice Rules

Practice sets must contain:

10–15 problems

Explanations appear only after the set is completed.

During solving:

Show only:

correct / incorrect
11. Puzzle Rules

Puzzles are gamified problems.

Rules:

instant answer feedback
XP reward
streak tracking

Puzzle generation must be:

template-based

Never AI-generated.

12. Code Quality Rules

AI assistants must prefer:

clear code
predictable structure
simple logic

Avoid:

clever but unreadable code
deep nested logic
duplicate components
13. When AI is Unsure

If the AI assistant is unsure about a change, it must:

ask for clarification

Never implement speculative features.

14. Large Changes Rule

If a change affects multiple modules, the assistant must first propose a plan.

Example:

Step 1
Step 2
Step 3

Then wait for approval.

End of AI Development Rules

The goal is to ensure that AI helps development instead of destabilizing the codebase.

Axioma must remain:

structured
predictable
maintainable