---
name: textbundler-orchestrator
description: >
  Full task lifecycle orchestrator for TextBundler. Auto-activates when the user
  wants to run the complete develop-review-fix-merge cycle for a spec task or
  OpenSpec change. Use when the user says "run the next task", "orchestrate TASK-X",
  "orchestrate change X", "implement and review", "full cycle", "next",
  "run the change", "implement configurable-figure-table-defaults", or wants
  hands-off task execution with automated code review and iterative fixes.
  Manages feature branches, spawns developer and reviewer subagents, tracks
  review feedback in COMMENTS.md, and merges to main when all findings are resolved.
context: fork
agent: orchestrator
---

Run the full develop-review-fix-merge cycle for the next task
(or a specific TASK-NNN or OpenSpec change name if provided).

Task sources:
1. OpenSpec changes in `openspec/changes/<name>/` — check these first for new work.
2. `docs/SPEC.md` Section 7.2 for original TASK-NNN tasks (legacy, all complete).

Follow the phased workflow in your agent instructions:
Select task → Branch → Implement (developer) → Review (reviewer) →
Fix if needed → Re-review → Merge to main.
