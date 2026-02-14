# Code Review: feat/task-018c-ui-feedback

**Task:** TASK-018c: Background Script — UI Feedback
**Reviewer:** Code Reviewer Agent
**Date:** 2026-02-14
**Verdict:** APPROVE

---

## Summary

This branch adds badge state management, browser notification display, and a concurrent-click guard to the background script. All five acceptance criteria from the spec are met: badge shows "..." during processing, "OK" on success (clears after 3s), "!" on failure (clears after 5s), notifications display on both success and failure, and concurrent clicks on the same tab are ignored via a `processingTabs` Set. The implementation is clean, well-documented, and correctly handles all three failure paths (script injection error, extraction failure, pipeline error).

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
- Module Conventions: PASS (default export allowed for WXT entrypoint)
- Testing: N/A (entrypoint file — browser APIs not testable in Node.js)
- Golden File Conventions: N/A
- Data Conventions: N/A
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

**O-1: Service Worker Lifecycle and processingTabs**

The `processingTabs` Set is scoped to the `defineBackground()` closure, which means it resets if the service worker is terminated and restarted by the browser. This is acceptable behavior since a terminated service worker also means any in-flight pipeline was aborted.

**O-2: Notification Icon Path**

The `iconUrl` uses `browser.runtime.getURL('/icon/128.png')` which matches the icon paths in `public/icon/`. The TypeScript types require `iconUrl` for `type: "basic"` notifications, which is correctly provided.

**O-3: ExtractionFailure Handling**

The `onMessage` listener now handles both `archive-page` and `extraction-failed` message types. The `ExtractionFailure` handler uses the exact notification message from the spec (FR-009): "Could not extract content from this page."

---

## Prior Observations Carried Forward

### TASK-018b

- All seven pipeline steps from TASK-018b are implemented in the correct order.
- The try/catch wraps the entire pipeline. Error message matches the spec string exactly.
- The `browser.runtime.onMessage.addListener` callback correctly returns `true` for async response handling.

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

All acceptance criteria are met. Badge states, notification messages, colors, and timing all match the spec exactly. The concurrent-click guard is correctly implemented. No blocking or non-blocking findings.
