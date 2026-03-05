GUIDELINES.md

Axioma – Reasoning Diagnostic Platform

1. Product Philosophy

Axioma is not a math solver.

Axioma is a reasoning diagnostic platform designed to identify gaps in mathematical thinking.

Most math platforms check answers.

Axioma analyzes the reasoning process.

The system focuses on where thinking breaks, not just whether the answer is correct.

Typical reasoning stages:

Understanding the problem

Choosing a method

Applying the method

Interpreting the result

Connecting representations

Most student errors happen between these stages, not in arithmetic.

The product must therefore:

identify reasoning gaps

visualize them

guide students to fix them

2. Core Modules

Axioma contains 6 core modules.

2.1 Home

Purpose:

Navigation hub and introduction to the platform.

Contains:

welcome message

Run Diagnostic button

My Progress button

reasoning map visualization

research summary

UI rules:

Minimal cognitive load.

User must immediately understand:

What Axioma does
What to do next

Primary CTA:

Run Diagnostic
2.2 Diagnostics

Purpose:

Detect reasoning gaps.

Diagnostics measure:

conceptual understanding

method selection

procedural correctness

interpretation

representation

Rules:

answers must NOT be revealed during the diagnostic

answers appear only after completion

Flow:

Start Diagnostic
→ solve problems
→ finish session
→ XP awarded
→ Results breakdown

Features:

reasoning block scoring

session saving

gap detection

UI requirements:

progress indicator

clear readable problem text

NotesPanel available

Mobile:

NotesPanel = bottom drawer

Desktop:

NotesPanel = side panel

2.3 Results

Purpose:

Deep feedback on mistakes.

Results must show:

problem text
user answer
correct answer
explanation

Optional but recommended:

gap label.

Examples:

Concept misunderstanding
Method selection error
Representation confusion
Procedural mistake
Interpretation error

Clicking a diagnostic session anywhere in the app must open its Results page.

2.4 Practice

Purpose:

Close reasoning gaps and reinforce theory.

Practice sessions contain:

10–15 problems

Rules:

explanations appear only after completing the set

during solving only show correct / incorrect

Practice should:

target reasoning gaps

reinforce theory topics

UI rules:

Practice must not feel boring.

Use:

diagrams

visual examples

short hints

Avoid long walls of text.

2.5 Theory

Purpose:

Teach concepts step-by-step.

Structure:

Topic
→ Sections
→ Steps

Each step contains:

explanation

example

mini check

Content style:

Human teacher explanation.

Not compressed AI text.

Must explain:

why the concept works

when to use it

common traps

End of topic:

User is sent to Practice mode.

Topic mastery rules:

practice score ≥ 75% → Knows topic
practice score ≥ 90% → Expert

Users can write personal notes during theory.

Notes are saved in their profile.

2.6 Puzzles

Purpose:

Gamified reinforcement.

Features:

streak system

XP rewards

instant answer feedback

Puzzle generation must be:

template-based

NOT AI generated.

Example templates:

Quadratic equations
Geometry configurations
Fraction simplification

Parameters are randomized while keeping valid solutions.

3. NotesPanel

NotesPanel is a core component.

It must be available in:

Diagnostics

Practice

Puzzles

Theory

Capabilities:

free text writing

adjustable font size

auto-save

optional save to topic notes

Layout:

Desktop:

Main content | NotesPanel

Mobile:

Content
NotesPanel drawer
4. Firestore Architecture

Users collection:

users/{uid}

Fields:

displayName
email
language
xp
level
title
stats
createdAt
updatedAt

Stats example:

practiceSessions
diagnosticsCompleted
puzzlesSolved
feedbackSent
4.1 Sessions

All learning sessions should follow a consistent structure.

Recommended:

users/{uid}/sessions/{sessionId}

Fields:

type: diagnostic | practice | puzzle
topicId
startedAt
finishedAt
score
xpEarned
answers[]

Answer object:

taskId
userAnswer
correctAnswer
isCorrect
gapType
timeSpent
4.2 Topic Progress

Topic mastery tracking.

users/{uid}/topicProgress/{topicId}

Fields:

status
percent
updatedAt
createdAt

Status values:

in_progress
knows
expert
4.3 Theory Progress
users/{uid}/theoryProgress/{topicId}

Tracks step completion.

5. UI Design Rules

Design principles:

Minimal
Readable
Consistent
Focused

Dark theme is the base.

Accent colors:

Primary  → Cyan
Secondary → Teal
Success → Green
Warning → Orange
Error → Red
Typography

Headings must be clear.

Avoid dense paragraphs.

Prefer:

cards

lists

diagrams

visual examples

Layout

Desktop layout:

Sidebar
Main Content
NotesPanel

Mobile layout:

Header
Content
NotesPanel Drawer
Interaction Principle

Every page must answer:

What should the user do next?

Examples:

Diagnostics → View Results
Results → Fix gaps in Practice
Theory → Go to Practice
Practice → Start next set
Puzzles → Continue streak

6. XP and Leveling

XP sources:

Diagnostics completion
Practice sets
Puzzle streaks

XP should reward:

persistence

improvement

consistency

Avoid rewarding guessing.

7. Content Generation Rules

Problems must be generated via:

templates

NOT AI.

Example:

Quadratic equation template:

ax² + bx + c = 0

Randomize coefficients.

Ensure:

valid solutions

balanced difficulty

8. Code Structure Principles

Project structure must remain clean.

Recommended folders:

src
 ├ pages
 ├ components
 ├ core
 ├ data
 ├ firebase
 ├ services
 ├ styles

Rules:

Pages handle layout.

Components handle UI.

Core handles logic engines.

Services handle Firestore.

Data contains static topic/task definitions.

9. Development Principles

When modifying the code:

Do NOT break existing UI.

Do NOT introduce random UI redesign.

Follow the architecture.

Every feature must respect:

Diagnostics
Practice
Theory
Puzzles
Results
Progress
10. Future Scaling

Platform must support:

Grades:

6
7
8
9
10

Topics expand gradually.

Diagnostics and Practice should scale by topic.

End of Guidelines

Axioma is designed to improve mathematical thinking, not just answers.

The platform must always prioritize:

clarity
reasoning
learning quality