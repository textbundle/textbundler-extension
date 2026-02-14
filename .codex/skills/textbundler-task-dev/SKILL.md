---
name: textbundler-task-dev
description: >
  TextBundler task implementation workflow. Auto-activates when a developer
  wants to implement, continue, or work on spec tasks (TASK-001 through TASK-021).
  Use when the user says things like "implement TASK-X", "work on the next task",
  "start task", "pick up where we left off", "what task is next", or references
  any TASK-NNN by ID. Also activates for general implementation work on the
  TextBundler extension pipeline modules (extraction, conversion, packaging, wiring).
  Integrates with OpenSpec workflows via /prompts:opsx- commands.
metadata:
  agent: developer
---

Implement the specified task (or determine the next task) from `docs/SPEC.md` Section 7.2.

Follow the TDD workflow and task execution procedure defined in `.codex/agents/developer.md`.

Critical path: `001 -> 003 -> 004 -> 011 -> 004a -> 012a -> 012b -> 015 -> 018b -> 018c -> 020`.

OpenSpec integration: use `/prompts:opsx-apply` for changes, `/prompts:opsx-new` or `/prompts:opsx-ff` to create changes,
`/prompts:opsx-verify` before archiving, `/prompts:opsx-archive` when complete.
