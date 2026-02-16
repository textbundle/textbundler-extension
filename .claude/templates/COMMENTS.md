# Code Review: {branch-name}

**Task:** {Task ID}: {Task Name}
**Reviewer:** Code Reviewer Agent
**Date:** {YYYY-MM-DD}
**Verdict:** {APPROVE | REQUEST CHANGES | REJECT}

---

## Summary

{2-4 sentences: what the branch does, overall quality assessment, and the reason for your verdict.}

---

## Validation Gates

```
npm test:      {PASS (N tests, N suites) | FAIL — paste first failure}
npm run typecheck: {PASS | FAIL — paste first error}
```

---

## Checklist Results

- Acceptance Criteria: {PASS | ISSUES FOUND | N/A}
- Type Contracts: {PASS | ISSUES FOUND | N/A}
- Module Conventions: {PASS | ISSUES FOUND | N/A}
- Testing: {PASS | ISSUES FOUND | N/A}
- Golden File Conventions: {PASS | ISSUES FOUND | N/A}
- Data Conventions: {PASS | ISSUES FOUND | N/A}
- Code Quality: {PASS | ISSUES FOUND | N/A}
- Documentation: {PASS | ISSUES FOUND | N/A}
- Git Hygiene: {PASS | ISSUES FOUND | N/A}

---

## Findings

### Blocking

{Remove this instructions paragraph. List issues that MUST be fixed before merge.
Each causes REQUEST CHANGES or REJECT. Use the B-N format below, one per finding.
If none, replace this section's contents with "None."}

**B-1: {Short title}**
- **File:** `{path}:{line}`
- **Issue:** {What is wrong}
- **Spec:** {Section or requirement ID (e.g., "Section 10.4", "FR-002", "DD-12")}
- **Fix:** {Specific, actionable instruction for the developer}

### Non-Blocking

{Remove this instructions paragraph. List issues that SHOULD be fixed but don't block merge.
Use the NB-N format below. If none, replace this section's contents with "None."}

**NB-1: {Short title}**
- **File:** `{path}:{line}`
- **Issue:** {What could be improved}
- **Suggestion:** {Recommended change}

### Observations

{Remove this instructions paragraph. Patterns, potential future issues, insights worth
preserving for the team. Not actionable in this review cycle. These survive the
fix cycle and are carried forward after merge. If none, replace with "None."}

---

## Verdict Rationale

{1-2 sentences. If APPROVE: confirm all criteria met. If REQUEST CHANGES: list the
blocking finding IDs (B-1, B-2, ...) that must be resolved. If REJECT: explain why
the approach is fundamentally wrong and what direction to take instead.}
