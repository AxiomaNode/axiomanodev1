# AXIOMA — AI Workflow
*How to use Claude and GPT effectively*

---

## Roles

**GPT** — architecture, planning, data models, reviewing Claude output, writing Claude prompts
**Claude** — implementation, code, CSS, UI, debugging specific errors
**You** — all product decisions, philosophical alignment, final approval

---

## Standard Flow

1. Describe feature/problem to GPT with AXIOMA_CONTEXT.md
2. GPT plans — files to change, data shapes, what NOT to touch
3. You review and approve the plan
4. GPT writes a Claude prompt
5. New Claude conversation — paste AXIOMA_CONTEXT.md + prompt + current files
6. Claude writes complete files (not diffs)
7. You test
8. Return output to GPT for architecture review before merging

---

## Hard Rules

- **One feature per Claude conversation** — start fresh when goal changes
- **Always paste current file before asking to change it** — never rely on Claude's memory
- **Complete files only** — never ask for snippets or diffs
- **Philosophy discussions go to GPT** — don't use Claude to decide what to build
- **Update AXIOMA_CONTEXT.md after every session** — paste it at the start of every new one
- **Name the problem precisely before asking for the fix** — vague problem = wasted hour

---

## Conversation Starters

**Planning (GPT):**
"Here's AXIOMA_CONTEXT.md. I want to [feature]. Give me a plan before any code."

**Implementation (Claude):**
"Here's AXIOMA_CONTEXT.md. Here's the plan. Here's the current [file]. Write the complete updated file."

**Debugging (Claude):**
"Here's AXIOMA_CONTEXT.md. Here's the current [file]. Error: [exact error]. Minimal fix only."

**Review (GPT):**
"Here's AXIOMA_CONTEXT.md. Claude wrote this: [code]. Does it match the architecture?"

---

## Stop and Reassess When

- Claude suggests rewriting a working system
- Conversation has touched more than 3 features
- You're not sure what the current state of a file is
- You've been debugging the same issue for 30+ minutes
- Claude contradicts an earlier decision

Action: stop, update AXIOMA_CONTEXT.md, start fresh.

---

## The One Rule

**Decisions in GPT. Code in Claude. AXIOMA_CONTEXT.md between them.**