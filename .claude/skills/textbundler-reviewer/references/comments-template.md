# COMMENTS.md Template

Write `COMMENTS.md` to the repository root using this exact structure:

```markdown
# Code Review: {branch-name}

**Task:** TASK-{NNN}: {Task Name}
**Reviewer:** Code Reviewer Agent
**Date:** {YYYY-MM-DD}
**Verdict:** APPROVE | REQUEST CHANGES | REJECT

---

## Summary

{2-4 sentences: what the branch does, overall quality, reason for verdict.}

---

## Checklist Results

- Acceptance Criteria: PASS | ISSUES FOUND
- Type Contracts: PASS | ISSUES FOUND | N/A
- Module Conventions: PASS | ISSUES FOUND
- Testing: PASS | ISSUES FOUND
- Golden File Conventions: PASS | ISSUES FOUND | N/A
- Data Conventions: PASS | ISSUES FOUND | N/A
- Code Quality: PASS | ISSUES FOUND
- Documentation: PASS | ISSUES FOUND
- Git Hygiene: PASS | ISSUES FOUND

---

## Validation Gates

npm test: PASS (N tests, N suites) | FAIL
npm run typecheck: PASS | FAIL

---

## Findings

### Blocking

{Issues that MUST be fixed before merge. Cause REQUEST CHANGES or REJECT.}

**B-1: {Short title}**
- **File:** `{path}:{line}`
- **Issue:** {What is wrong}
- **Spec:** {Section/requirement ID}
- **Fix:** {What to do}

### Non-Blocking

{Issues that SHOULD be fixed but don't block merge. Nits, style, minor improvements.}

**NB-1: {Short title}**
- **File:** `{path}:{line}`
- **Issue:** {What could be improved}
- **Suggestion:** {Recommended change}

### Observations

{Optional. Patterns noticed, potential future issues, technically correct but worth flagging.}

---

## Verdict Rationale

{1-2 sentences. If REQUEST CHANGES: list blocking finding IDs to resolve.
If REJECT: explain why the approach is wrong and what alternative to take.}
```
