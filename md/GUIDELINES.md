GUIDELINES.md
# AXIOMA PLATFORM GUIDELINES

This document defines the **core philosophy, structure, and behavior rules** of the Axioma platform.

Axioma is not a traditional math learning platform.  
Its primary goal is to **diagnose and improve mathematical reasoning**.

This document explains:

• product philosophy  
• learning model  
• platform modules  
• architecture overview  
• development principles  

All AI assistants and developers must follow this document when implementing features.

---

# 1. PRODUCT PHILOSOPHY

Axioma is **not a math solver**.

Axioma is **not an exam simulator**.

Axioma is a **reasoning diagnostic platform**.

Most educational platforms measure **whether the answer is correct**.

Axioma measures **where the reasoning breaks**.

Students often fail not because they cannot compute, but because they:

• misinterpret the problem  
• apply the wrong method  
• misunderstand relationships between concepts  
• rely on mechanical formulas  

The goal of Axioma is to **identify and repair these reasoning gaps**.

---

# 2. LEARNING MODEL

Learning in Axioma follows this structure:


Diagnostic → Results → Theory → Practice → Progress


Each stage has a specific role.

### Diagnostic
Identifies reasoning gaps.

### Results
Explains what went wrong and where thinking broke.

### Theory
Explains the concept in a clear, human way.

### Practice
Strengthens understanding through structured tasks.

### Progress
Tracks improvement and mastery.

The platform prioritizes **deep understanding of a single topic** before expanding to more topics.

Version 1 focuses on **quadratic equations**.

---

# 3. REASONING GAP MODEL

Axioma uses a **gap-based learning system**.

A gap represents a **specific reasoning failure**.

Examples:

• misunderstanding the discriminant  
• ignoring the second square root  
• dividing by an expression containing x  
• misusing Vieta's formulas  

Gaps are defined in:


md/GAP_SYSTEM.md


Gap definitions must **never be modified arbitrarily**.

Each gap includes:

• description  
• reasoning explanation  
• detection signals  
• recommendations

Diagnostics detect gaps by analyzing **patterns of answers**, not single mistakes.

---

# 4. CORE PLATFORM MODULES

## 4.1 Home

The home page introduces the platform and allows users to:

• start diagnostics  
• access progress  
• explore reasoning blocks  

It should clearly communicate the platform philosophy.

---

## 4.2 Diagnostics

Diagnostics identify reasoning gaps.

Each diagnostic contains multiple tasks designed to trigger specific reasoning errors.

Tasks are connected to gap signals.

Diagnostics should never feel like a traditional exam.

The goal is **analysis**, not scoring.

---

## 4.3 Results

The results page shows:

• detected gaps  
• answer breakdown  
• correct answers  
• explanations  

Users must be able to review every question they answered.

Results must clearly show:

• what the user answered  
• what the correct answer was  
• why the reasoning failed

---

## 4.4 Theory

Theory explains concepts step-by-step.

Theory pages include:

• explanations
• analogies
• visual examples
• mini checks

Theory is not a static article.

Users move **step-by-step**, similar to a teacher explaining on a board.

Users can write notes while studying.

---

## 4.5 Practice

Practice reinforces understanding.

Practice tasks should:

• strengthen reasoning
• reinforce patterns
• confirm understanding

Practice is not meant to replace diagnostics.

Diagnostics reveal gaps.  
Practice helps improve after learning.

---

## 4.6 Puzzles (Future)

Puzzles train:

• speed
• focus
• pattern recognition
• adaptive thinking

Puzzle tasks should be:

• short
• interesting
• slightly tricky

Puzzles should feel more like a **game mode** than structured practice.

---

# 5. NOTES SYSTEM

Notes are an important part of learning.

Users can write notes inside theory pages.

Notes are saved in the user's profile and linked to specific topics.

Notes should be:

• editable
• persistent
• visible in profile

Notes help users reinforce understanding through reflection.

---

# 6. PROGRESS AND MASTERY

Progress tracking focuses on **understanding**, not raw scores.

Important metrics include:

• completed diagnostics
• solved tasks
• detected gaps
• mastery levels

Topic mastery may include labels such as:

• Beginner
• Learner
• Advanced
• Expert

XP can exist as a supporting system, but **mastery is more important than XP**.

---

# 7. UI DESIGN PRINCIPLES

The interface must prioritize:

• clarity
• focus
• readability
• minimal distraction

Design principles:

• dark mode first
• math-friendly layout
• large readable formulas
• minimal clutter

Users should always feel **focused on thinking**.

---

# 8. CONTENT RULES

Content must follow several rules.

Tasks must be:

• logically clear
• conceptually meaningful
• not artificially complex

Theory explanations should:

• sound human
• use analogies
• explain reasoning steps

AI-generated content should always be **validated before production use**.

---

# 9. ARCHITECTURE OVERVIEW

The project uses a modular structure.

Main layers include:


src/
pages/
components/
core/
data/
firebase/
services/
context/
config/


### pages

Defines application screens.

Examples:

• DiagnosticsPage
• PracticePage
• TheoryPage
• ResultsPage
• ProfilePage

---

### components

Reusable UI components.

Examples:

• QuestionCard
• GapCard
• NotesPanel
• Header
• Sidebar

---

### core

Core platform logic.

Examples:

• diagnosticEngine
• scoringEngine
• recommendationEngine
• topicEngine
• taskFactory

---

### data

Static topic data.

Examples:

• questions
• gaps
• tasks
• theory
• topics

---

### firebase / services

Handles data persistence and backend interaction.

Includes:

• authentication
• Firestore operations
• session storage

---

### context

Global state.

Examples:

• AuthContext
• ThemeContext

---

### api

Server-side functions.

Examples:


api/ai/
diagnostics.js
generateHomeWork.js
hints.js

api/support.js


---

### md

Project documentation.

Includes:


GUIDELINES.md
AI_DEVELOPMENT_RULES.md
AI_WORKFLOW.md
DATA_CONTRACTS.md
GAP_SYSTEM.md


These documents define the platform's architecture and must be followed.

---

# 10. DEVELOPMENT PRINCIPLES

Development must follow several rules.

Do not:

• break existing learning flows  
• redesign modules without planning  
• introduce features that conflict with the reasoning-first philosophy  

Large changes should always be planned before implementation.

---

# 11. FUTURE SCALING

Future versions of the platform may include:

• additional math topics
• puzzles mode
• leaderboards
• competitive modes
• AI task generation
• thinking platform expansion

However, Version 1 focuses on **building a strong foundation with a single topic**.

The goal is **quality over quantity**.

---