# Code Review: feat/task-018b-pipeline-orchestration

**Task:** TASK-018b: Background Script -- Pipeline Orchestration
**Reviewer:** Code Reviewer Agent
**Date:** 2026-02-14
**Verdict:** APPROVE

---

## Summary

This branch adds the pipeline orchestration logic to `entrypoints/background.ts`, wiring the full conversion pipeline from `ExtractionResult` message receipt through Markdown conversion, image downloading, failed image patching, frontmatter generation, bundle packaging, and download triggering. The implementation follows the spec exactly (steps a-g from TASK-018b), with proper error handling via try/catch, per-stage debug timing, total pipeline timing at info level, and the correct `ArchiveResponse` return values matching Section 4.2.

---

## Validation Gates

```
npm test:          PASS (180 tests, 11 suites)
npm run typecheck: PASS
```

---

## Checklist Results

- Acceptance Criteria: PASS
- Type Contracts: PASS
- Module Conventions: PASS
- Testing: N/A (entrypoint file, browser-API-dependent, no unit tests per convention)
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

None.

### Observations

**O-1: Pipeline Step Fidelity**

All seven pipeline steps from the TASK-018b spec are implemented in the correct order: convertToMarkdown, downloadImages, patchFailedImageUrls, buildFrontmatter, packageBundle, triggerDownload. The function signatures and argument passing match the spec exactly.

**O-2: Error Handling Coverage**

The try/catch wraps the entire pipeline as specified. The error message on unexpected failure uses the exact string from the spec: "An unexpected error occurred while archiving this page." Stack traces are logged at error level for debugging. Individual image failures are handled internally by `downloadImages` and do not abort the pipeline.

**O-3: Async Message Response Pattern**

The `browser.runtime.onMessage.addListener` callback correctly returns `true` to indicate asynchronous response handling, and uses `sendResponse` via `.then()` on the pipeline promise. This is the correct WebExtensions pattern for async message responses.

---

## Prior Observations Carried Forward

### TASK-015

- Bundle packager correctly assembles TextBundle v2 archives per Section 4.4 with proper info.json, text.md, and assets/ structure.
- Slug generator follows Section 4.7 algorithm exactly with comprehensive edge case handling.

### TASK-012a

- VIDEO_HOSTS regex covers major platforms. tableChildren rule prevents GFM recursion.

### TASK-004a / TASK-011

- Readability demotes h1 to h2 in its output. Golden files reflect this behavior.
- TurndownService instance created fresh per call for proper imageMap scoping.

### TASK-004

- non-article.html uses redirect page pattern for Readability null extraction testing.

## Verdict Rationale

All acceptance criteria met. Full pipeline from ExtractionResult to download trigger is implemented. Failed images are patched correctly via the filter+patch pattern. Error handling catches all failure modes with the correct response shape. Per-stage and total timing logging present. No blocking or non-blocking findings.
