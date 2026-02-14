---
name: textbundler-reviewer
description: >
  Code reviewer for TextBundler feature branches. Auto-activates when the user
  asks to review a branch, review a PR, review code, check a feature branch,
  or says "review", "code review", "check the branch", "review task-NNN".
  Produces a structured COMMENTS.md with APPROVE / REQUEST CHANGES / REJECT
  verdict. Has veto power over merges.
metadata:
  agent: reviewer
---

Review the current feature branch against `main`.

Follow the full review procedure defined in `.codex/agents/reviewer.md`.
Output is `COMMENTS.md` committed to the branch.
