AI_WORKFLOW.md
Purpose

This document defines how work is divided between the human founder, ChatGPT, and Claude for Axioma.

The goal is speed without architectural decay.

1. Roles
Founder

Owns:

final product decisions

priorities

approval for scope changes

product taste

acceptance of tradeoffs

ChatGPT

Owns:

architecture

planning

data contracts

gap logic

feature decomposition

prompts for Claude

code review from system/design perspective

Claude

Owns:

implementation

UI construction

component wiring

React page work

CSS and layout work

direct coding of approved plans

2. Default Workflow

Standard sequence:

Founder describes feature / bug / uncertainty.

ChatGPT analyzes scope and proposes architecture or plan.

ChatGPT writes a detailed implementation prompt for Claude.

Claude writes code.

Founder returns with Claude output or project state.

ChatGPT reviews the result and gives next-step prompt or corrections.

This is the default operating mode.

3. Change Size Rules
Small Change

Examples:

local bug fix

small UI alignment fix

text correction

adding one field to an existing card

Allowed flow:

ChatGPT may give Claude a direct implementation prompt

no full architecture note required

Medium Change

Examples:

modifying one page plus one service

new profile section

adding Google sign-in

theory notes integration with profile

Required:

brief plan

changed files list

behavior definition

constraints

Large Change

Examples:

new puzzle system

new leaderboard system

Firestore schema change

changing session model

changing diagnostic engine

changing practice architecture

Required:

explicit plan first

risks list

approval from founder before implementation prompt

Claude should not implement large speculative changes directly.

4. Prompt Format for Claude

When ChatGPT writes prompts for Claude, include these sections whenever relevant:

GOAL
CONTEXT
FILES TO TOUCH
FILES NOT TO TOUCH
DATA CONTRACTS / RULES
IMPLEMENTATION STEPS
ACCEPTANCE CRITERIA
DO NOT

Optional sections:

EDGE CASES

FIREBASE RULES

UI NOTES

TEST / VERIFY

5. Rules for Claude Prompts

Prompts should be:

structured

explicit

narrow in scope

aligned with current architecture

Prompts should not:

invite broad refactors without approval

allow random design changes

allow library changes without approval

leave domain rules ambiguous

6. What ChatGPT Must Check Before Writing a Prompt

Before producing a Claude prompt, ChatGPT should confirm internally:

Is the requested change small, medium, or large?

Does it affect data contracts?

Does it affect the gap system?

Does it affect Firestore structure?

Does it affect UI only, or domain logic too?

Is any part still under-specified by the founder?

If the logic is under-specified, ChatGPT should ask before writing the final implementation prompt.

7. Architecture Protection Rules

ChatGPT must block or question changes that:

move business logic into UI pages

move domain logic into services

mix Firestore write logic into components unnecessarily

add new libraries without clear need

redesign UI without request

break existing module boundaries

Claude should operate inside existing architecture unless an approved plan changes it.

8. Review Rules

When Claude returns code, ChatGPT reviews it using this order:

product logic

architecture consistency

data correctness

UI consistency

code clarity

Do not approve code only because it works visually.

9. Decision Rules

If a product decision is unclear:

ChatGPT proposes the best option

explains tradeoff briefly

asks founder for approval before Claude implementation

If a technical decision is local and low-risk:

ChatGPT may choose it directly

but must remain consistent with architecture

10. AI Assistant Behavior Rules

ChatGPT should:

think system-first

reduce ambiguity

formalize vague ideas into contracts

stop architectural drift early

Claude should:

implement only approved behavior

avoid freeform reinterpretation of requirements

keep modifications localized

preserve existing UI unless asked otherwise

11. Current Axioma Priorities

As of v1 planning, priority order is:

architecture stabilization

diagnostic logic

practice logic

profile improvement

Firebase contract cleanup

selected UI polish

puzzles / leaderboard / reviews

Any new work should be judged against this order.

12. Practical Examples
Example A — Good request

Improve profile so theory notes are saved by topic and shown inside the profile page.

This is medium scope. ChatGPT should:

define notes contract

define files to change

write Claude prompt

Example B — Bad request handling

Add puzzles, leaderboard, achievements, and daily missions in one pass.

This is too broad. ChatGPT should split it into:

puzzle architecture

puzzle session contract

leaderboard data model

achievements model

then ask for approval step by step

13. Final Rule

If a change affects multiple modules and core product behavior, plan first. Do not skip planning just because implementation seems possible.