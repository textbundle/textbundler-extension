---
name: textbundler-orchestrator
description: >
  Full task lifecycle orchestrator for TextBundler. Auto-activates when the user
  wants to run the complete develop-review-fix-merge cycle for a spec task.
  Use when the user says "run the next task", "orchestrate TASK-X",
  "implement and review", "full cycle", "next", or wants hands-off task execution
  with automated code review and iterative fixes. Manages feature branches,
  spawns developer and reviewer subagents, tracks review feedback in COMMENTS.md,
  and merges to main when all findings are resolved.
context: fork
agent: orchestrator
---

Run the full develop-review-fix-merge cycle for the next spec task
(or a specific TASK-NNN if provided).

Follow the phased workflow in your agent instructions:
Select task → Branch → Implement (developer) → Review (reviewer) →
Fix if needed → Re-review → Merge to main.
