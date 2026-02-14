# Code Review: feat/task-020-pipeline-integration-tests

**Task:** TASK-020: Full Pipeline Integration Tests
**Reviewer:** Code Reviewer Agent
**Date:** 2026-02-14
**Verdict:** APPROVE

---

## Summary

This branch implements TASK-020 end-to-end pipeline integration tests using the `mixed-content.html` and `non-article.html` fixtures. The test file comprehensively validates the full archival pipeline (extraction → Markdown conversion → image patching → frontmatter → packaging) and correctly verifies zip structure, failed image patching, and content filtering. All acceptance criteria are met, both validation gates pass, and the code follows established patterns.

---

## Validation Gates

```
npm test:          PASS (182 passed, 12 suites)
npm run typecheck: PASS
```

---

## Checklist Results

- Acceptance Criteria: PASS
- Type Contracts: PASS
- Module Conventions: PASS
- Testing: PASS
- Golden File Conventions: N/A
- Data Conventions: PASS
- Code Quality: PASS
- Documentation: PASS
- Git Hygiene: PASS

---

## Findings

### Blocking

None.

### Non-Blocking

**NB-1: Unused `originalFetch` variable**
- **File:** `tests/pipeline.test.ts:15-18`
- **Issue:** The `originalFetch` variable is saved in `beforeEach()` but never used. The test correctly relies on `vi.unstubAllGlobals()` in `afterEach()`, making this assignment unnecessary.
- **Suggestion:** Remove lines 15 and 18 (the `let originalFetch` declaration and the `beforeEach` hook that assigns it). The `afterEach` cleanup is sufficient.

### Observations

**O-1: Fetch mock design**

The mock function (lines 46-66) correctly handles URL, URL object, and Request input types. The conditional branching properly extracts the URL string from each type, and the responses correctly simulate both successful PNG downloads (with Content-Type header) and 404 failures.

**O-2: Manual imageMap modification pattern**

The test manually adds a second image to the `imageMap` (line 43) to simulate the failure scenario. This is an intentional and appropriate pattern for testing the failure path, since `convertToMarkdown` only discovers images actually present in the HTML fixture. The synthetic addition enables testing of the failed image patching workflow.

**O-3: Asset filename handling across the pipeline**

The test correctly accounts for the design pattern where `convertToMarkdown` returns filenames with `assets/` prefix in the imageMap, `downloadImages` preserves these prefixes in returned assets, and then the test strips them before passing to `packageBundle` (which expects unprefixed filenames and adds the `assets/` prefix internally at line 44 of `bundle-packager.ts`). This design is consistent with existing tests in `image-downloader.test.ts`.

**O-4: Comprehensive spec requirement coverage**

All 12 requirements from the task description (lines 1036-1050) are directly addressed: HTML parsing, extraction, metadata, Markdown conversion, fetch mocking with success/404 paths, image downloading, failed asset patching, frontmatter generation, packaging, zip structure validation, failed image URL restoration, content leakage checks, and the null extraction failure case.

---

## Prior Observations Carried Forward

### TASK-018c

- Badge state management, notification display, and concurrent-click guard implemented correctly per spec.
- Notification icon and messages match spec requirements exactly.

### TASK-018b

- All seven pipeline steps implemented in correct order.
- Error handling paths properly documented and tested.

### TASK-015

- Bundle packager correctly assembles TextBundle v2 archives per Section 4.4.

### TASK-012a

- VIDEO_HOSTS regex covers major platforms. tableChildren rule prevents GFM recursion.

### TASK-004a / TASK-011

- Readability demotes h1 to h2 in its output. Golden files reflect this behavior.

### TASK-004

- non-article.html uses redirect page pattern for Readability null extraction testing.

---

## Verdict Rationale

All acceptance criteria from the task specification are met. Both `npm test` (182 tests across 12 suites) and `npm run typecheck` pass. The test comprehensively covers the end-to-end pipeline with realistic fixtures, proper fetch mocking, and detailed assertions on zip structure, content, and failed image patching. The single non-blocking finding (unused variable) is a minor code quality nit that does not affect test correctness.
