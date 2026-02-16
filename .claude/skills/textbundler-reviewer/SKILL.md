---
name: textbundler-reviewer
description: >
  Code reviewer for TextBundler feature branches. Auto-activates when the user
  asks to review a branch, review a PR, review code, check a feature branch,
  or says "review", "code review", "check the branch", "review task-NNN",
  "review the change branch". Supports both SPEC.md task branches and OpenSpec
  change branches. Produces a structured COMMENTS.md with APPROVE / REQUEST
  CHANGES / REJECT verdict. Has veto power over merges.
context: fork
agent: reviewer
---

Review the current feature branch against `main`.

If the branch implements an OpenSpec change (branch name like `feat/<change-name>-*`),
read the change artifacts in `openspec/changes/<name>/` for review context
(proposal, design, specs, tasks). Include OpenSpec Compliance in your checklist.

Follow the full review procedure defined in your agent instructions.
Output is `COMMENTS.md` committed to the branch.
