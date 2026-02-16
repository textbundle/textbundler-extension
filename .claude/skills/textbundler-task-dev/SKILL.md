---
name: textbundler-task-dev
description: >
  TextBundler task implementation workflow. Auto-activates when a developer
  wants to implement, continue, or work on tasks from SPEC.md or OpenSpec changes.
  Use when the user says things like "implement TASK-X", "work on the next task",
  "start task", "pick up where we left off", "what task is next", references
  any TASK-NNN by ID, or names an OpenSpec change to implement. Also activates
  for general implementation work on the TextBundler extension pipeline modules
  (extraction, conversion, packaging, wiring).
  Integrates with OpenSpec workflows via /opsx: commands.
context: fork
agent: developer
---

Implement the specified task from the appropriate source:

1. **OpenSpec changes:** If given a change name, read `openspec/changes/<name>/tasks.md`
   for task definitions, `design.md` for architecture, and `specs/` for acceptance criteria.
2. **SPEC.md tasks:** If given a TASK-NNN, read `docs/SPEC.md` Section 7.2.

Follow the TDD workflow and task execution procedure defined in your agent instructions.

OpenSpec integration: use `/opsx:apply` for changes, `/opsx:new` or `/opsx:ff` to create changes,
`/opsx:verify` before archiving, `/opsx:archive` when complete.
