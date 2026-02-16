# Code Review: feat/configurable-figure-table-defaults-settings-infra

**Task:** configurable-figure-table-defaults (OpenSpec): Task Group 1 — Types and Settings Infrastructure
**Reviewer:** Code Reviewer Agent
**Date:** 2026-02-16
**Verdict:** REQUEST CHANGES

---

## Summary

This branch implements the settings infrastructure for the configurable figure/table defaults feature: a `ConversionSettings` type, default values, and a merge helper. All tests pass and TypeScript checks out. However, the two exported symbols (`DEFAULT_CONVERSION_SETTINGS` constant and `applyDefaults()` function) are missing required JSDoc comments per project conventions. This is a blocking issue that must be addressed before merge.

---

## Validation Gates

```
npm test:                PASS (197 tests, 13 suites)
npm run typecheck:       PASS
```

---

## Checklist Results

- Acceptance Criteria: PASS
- Type Contracts: PASS
- Module Conventions: PASS (except documentation)
- Testing: PASS
- Golden File Conventions: N/A
- Data Conventions: N/A
- Code Quality: PASS
- Documentation: ISSUES FOUND
- Git Hygiene: PASS
- OpenSpec Compliance: PASS

---

## Findings

### Blocking

**B-1: Missing JSDoc comments on exported symbols**
- **File:** `lib/conversion-settings.ts:3` and `lib/conversion-settings.ts:8`
- **Issue:** `DEFAULT_CONVERSION_SETTINGS` constant and `applyDefaults()` function are exported but lack JSDoc comments with purpose, parameters, return value, and spec/requirement references.
- **Spec:** CLAUDE.md Code Documentation section — "Every exported function gets a JSDoc comment with purpose, parameters, return value, and spec section / requirement ID"
- **Fix:** Add JSDoc comments to both exports. For `DEFAULT_CONVERSION_SETTINGS`, document the default Markdown mode for both figures and tables. For `applyDefaults()`, document that it merges partial settings with defaults, returns a complete `ConversionSettings` object, and reference task group 1 from the OpenSpec change.

### Non-Blocking

None.

### Observations

**O-1: applyDefaults merge logic**
The `applyDefaults()` implementation correctly uses object spread to merge defaults with partial overrides, handling `undefined` input gracefully. The six test cases comprehensively cover default fallback, empty object, partial merges (both fields), and full passthrough scenarios.

**O-2: ConversionSettings type placement**
The `ConversionSettings` interface placement in `lib/types.ts` is correct per spec Section 4.2, and the type definition matches the design artifact exactly (`figureStyle` and `tableStyle` as `'markdown' | 'html'`).

**O-3: Foundation for downstream tasks**
This foundational infrastructure work is well-positioned for downstream tasks (figure/table rule implementation in convertToMarkdown, content script integration, and options page).

### Prior Tasks

- TASK-018c: Badge state management, notification display, and concurrent-click guard implemented correctly per spec.
- TASK-018b: All seven pipeline steps implemented in correct order. Error handling paths properly documented and tested.
- TASK-015: Bundle packager correctly assembles TextBundle v2 archives per Section 4.4.
- TASK-012a: VIDEO_HOSTS regex covers major platforms. tableChildren rule prevents GFM recursion.
- TASK-004a / TASK-011: Readability demotes h1 to h2 in its output. Golden files reflect this behavior.
- TASK-004: non-article.html uses redirect page pattern for Readability null extraction testing.

---

## Verdict Rationale

The implementation correctly satisfies all acceptance criteria and technical requirements from Task Group 1. Documentation comments are the only issue — add JSDoc to both `DEFAULT_CONVERSION_SETTINGS` and `applyDefaults()` referencing the design/spec sections, then resubmit.
