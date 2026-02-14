---
name: textbundler-task-dev
description: >
  TextBundler task implementation workflow. Auto-activates when a developer
  wants to implement, continue, or work on spec tasks (TASK-001 through TASK-021).
  Use when the user says things like "implement TASK-X", "work on the next task",
  "start task", "pick up where we left off", "what task is next", or references
  any TASK-NNN by ID. Also activates for general implementation work on the
  TextBundler extension pipeline modules (extraction, conversion, packaging, wiring).
  Integrates with OpenSpec workflows via /opsx: commands.
---

# TextBundler Task Implementation

## Workflow

### 1. Determine the task

- If the user specifies a TASK-NNN, use it.
- If not, determine the next task by checking what's implemented:
  - Read `docs/SPEC.md` Section 7.2 for the full task list and dependencies.
  - Check which `lib/` and `tests/` files exist to infer completed tasks.
  - Follow the critical path: `001 -> 003 -> 004 -> 011 -> 004a -> 012a -> 012b -> 015 -> 018b -> 018c -> 020`.
- Verify dependency tasks are complete before starting.

### 2. Read the task

Read the task's full entry in `docs/SPEC.md` Section 7.2:
- Description, files, acceptance criteria, dependencies, requirement IDs.
- Review referenced data types in `lib/types.ts` and Section 4.2.
- Check design decisions (Section 9, `DD-XX`) and assumptions (Section 8, `DA-XX`) if relevant.

### 3. Branch

```
git checkout -b feat/task-NNN-short-description main
```

If already on a feature branch for this task, continue on it.

### 4. TDD cycle

**Red:** Write the test file with all scenarios from the spec. Tests fail.

**Green:** Implement the module until tests pass.

**Validate:** `npm test && npm run typecheck` — both must pass.

Key testing rules:
- Vitest with `node` environment (linkedom, not jsdom).
- `__DEV__` is defined in Vitest config.
- No network calls — mock `fetch` via `vi.stubGlobal`.
- Readability tests: 10s timeout (`{ timeout: 10000 }`).
- Golden file comparisons use `normalizeMarkdown()` from `tests/helpers/normalize-markdown.ts`.
- No browser API mocks in `lib/` tests — `browser.*` is confined to `entrypoints/`.

### 5. Commit

One commit per logical unit (ideally per acceptance criteria checkbox):

```
feat(task-NNN): description of what was done
```

Always run `npm test && npm run typecheck` before committing.

### 6. Verify acceptance

Check every acceptance criterion from the spec. If all pass, the task is done.

## Coding conventions

- Named exports only (no defaults), except WXT entrypoints.
- Each `lib/` module exports one primary function matching the module name.
- Return `null` for expected failures; throw for programmer errors.
- Logger: `logger.info("module-name", "message", { data })` with `[TextBundler:module]` prefix.
- Image filenames: `image-001.ext` (3-digit zero-padded, lowercase).
- Slugs: lowercase, ASCII-normalized, max 80 chars.
- Frontmatter: omit fields with null/undefined values.
- JSDoc on every exported function: purpose, params, return, spec requirement ID.
- Non-obvious choices get a comment with `DD-XX` or `DA-XX` reference.

## OpenSpec integration

This project uses OpenSpec for change management. When implementing tasks as part of
an OpenSpec change:

- Use `/opsx:apply` to implement tasks from an active change's task artifact.
- Use `/opsx:new` or `/opsx:ff` to create a new change with artifacts.
- Use `/opsx:verify` before archiving to confirm implementation matches artifacts.
- Use `/opsx:archive` when all tasks in a change are complete.

When working outside of an OpenSpec change (direct task implementation from the spec),
follow the TDD workflow above. Consider creating an OpenSpec change if the work spans
multiple tasks or sessions.

## Quick reference

| Resource | Location |
|---|---|
| Task list & acceptance criteria | `docs/SPEC.md` Section 7.2 |
| Data types | `lib/types.ts`, `docs/SPEC.md` Section 4.2 |
| Design decisions | `docs/SPEC.md` Section 9 (`DD-01` through `DD-15`) |
| Design assumptions | `docs/SPEC.md` Section 8 (`DA-01` through `DA-06`) |
| Golden file conventions | `docs/SPEC.md` Section 10.7 |
| Execution order & critical path | `docs/SPEC.md` Section 10.1 |
| Validation gates | `docs/SPEC.md` Section 10.2 |
