AI_DEVELOPMENT_RULES.md
# AI DEVELOPMENT RULES

This document defines strict development rules for AI assistants working on the Axioma project.

These rules exist to prevent architectural corruption, broken data structures, and uncontrolled feature generation.

AI assistants must follow these rules when generating or modifying code.

---

# 1. SOURCE OF TRUTH DOCUMENTS

Before implementing any feature, AI assistants must consult the following documents:

GUIDELINES.md  
→ defines product philosophy and platform behavior

GAP_SYSTEM.md  
→ defines reasoning gap structure and detection logic

DATA_CONTRACTS.md  
→ defines Firestore document structures

AI_WORKFLOW.md  
→ defines collaboration workflow with AI

These documents must be treated as **source of truth**.

AI must not contradict them.

---

# 2. ARCHITECTURE RULES

The project follows a modular architecture.

Main layers:


pages → application screens
components → reusable UI components
core → domain logic
data → static topic data
services → data persistence logic
firebase → authentication and Firestore
context → global state
config → configuration files
api → server functions
md → project documentation


AI must not mix responsibilities between these layers.

Examples of violations:

• placing logic inside UI components  
• placing UI code inside core modules  
• modifying data definitions inside UI code  

---

# 3. CORE LOGIC PROTECTION

Files inside `src/core/` define platform logic.

Examples:


diagnosticEngine.js
scoringEngine.js
recommendationEngine.js
topicEngine.js
taskFactory.js


AI must not rewrite or replace these systems without explicit request.

Core logic changes require **careful analysis and explanation**.

---

# 4. GAP SYSTEM PROTECTION

The gap system defines reasoning failures.

Gap definitions live in:


src/data/gaps.js


and are documented in:


md/GAP_SYSTEM.md


AI must not:

• rename gap IDs  
• remove gaps  
• change gap detection signals  
• introduce new gap categories  

unless explicitly requested.

Diagnostics rely on these definitions.

Breaking them will corrupt the diagnostic system.

---

# 5. DATA STRUCTURE PROTECTION

Firestore structures are defined in:


md/DATA_CONTRACTS.md


AI must not modify:

• document shapes  
• field names  
• session formats  

without updating DATA_CONTRACTS.md.

Breaking data contracts will cause runtime errors.

---

# 6. CONTENT RULES

Static topic content lives in:


src/data/


Examples:


topics.js
questions.js
tasks.js
theory.js
gaps.js


AI must not generate random or unverified math content for production.

Generated content must follow platform logic and topic structure.

---

# 7. PAGE STRUCTURE RULES

Pages represent application screens.

Location:


src/pages/


Examples:


DiagnosticsPage
PracticePage
TheoryPage
ResultsPage
ProfilePage


Pages should not contain heavy business logic.

Pages should:

• render layout  
• call core logic  
• connect components

---

# 8. COMPONENT RULES

Reusable UI elements live in:


src/components/


Examples:


QuestionCard
GapCard
NotesPanel
Header
Sidebar


Components should be reusable and focused on UI behavior.

Business logic should remain outside components.

---

# 9. SERVER FUNCTIONS

Server logic lives in:


api/


Examples:


api/ai/diagnostics.js
api/ai/generateHomeWork.js
api/ai/hints.js
api/support.js


AI assistants must not move frontend logic into server functions unless required.

Server functions should handle:

• AI generation
• backend utilities
• integrations

---

# 10. FEATURE DEVELOPMENT RULE

AI must **not invent new product features automatically**.

Before adding new systems, AI should ask:

• Is this feature aligned with GUIDELINES.md?
• Does it break the learning flow?
• Does it require new data structures?

Large features must be proposed before implementation.

---

# 11. LARGE CHANGE RULE

If a change affects:

• architecture
• diagnostic logic
• Firestore structure
• learning flow

AI must first propose a plan instead of immediately generating code.

---

# 12. CODE STYLE

Code must remain:

• readable
• modular
• consistent with project structure

Avoid:

• unnecessary abstraction
• overly complex patterns
• premature optimization

---

# 13. PROTECTION AGAINST OVERENGINEERING

The project prioritizes clarity and stability.

AI must avoid introducing:

• complex frameworks
• unnecessary state managers
• experimental libraries

unless explicitly requested.

---

# 14. DOCUMENTATION CONSISTENCY

If architecture or data changes occur, AI must update documentation accordingly.

Relevant documents include:


GUIDELINES.md
GAP_SYSTEM.md
DATA_CONTRACTS.md
AI_WORKFLOW.md


Documentation must remain synchronized with the codebase.

---