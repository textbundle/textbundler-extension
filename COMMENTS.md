# Code Review: feat/task-011-turndown-base

**Task:** TASK-011: Turndown Base Configuration
**Reviewer:** Code Reviewer Agent
**Date:** 2026-02-14
**Verdict:** APPROVE

---

## Summary

This branch implements the Turndown base configuration module (`lib/markdown-converter.ts`) and its test suite (`tests/markdown-converter.test.ts`). The implementation correctly initializes Turndown with GFM plugin and the specified configuration options (atx headings, --- hr, - bullet marker, fenced code blocks). The test suite covers all required element types with inline assertions and includes an integration test against the basic-article.html fixture through Readability. The code is clean, well-documented, and meets all acceptance criteria.

---

## Validation Gates

```
npm test:          PASS (54 tests, 3 suites)
npm run typecheck: PASS
```

---

## Checklist Results

- Acceptance Criteria: PASS
- Type Contracts: PASS
- Module Conventions: PASS
- Testing: PASS
- Golden File Conventions: N/A (no golden files in this task; those come in TASK-004a)
- Data Conventions: N/A (no image filenames, slugs, or bundle filenames in this task)
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

- Readability demotes the `<h1>` in basic-article.html to `<h2>` in its output, so the fixture integration test correctly expects `## Main Heading` rather than `# Main Heading`. This is expected Readability behavior and the converter preserves these levels without further modification.
- The TurndownService instance is created fresh on each `convertToMarkdown()` call. This is the correct approach for TASK-012b, which needs to attach image-rewriting rules with a closure-scoped imageMap that resets per call.
- The GFM plugin's strikethrough rule uses single tilde (`~deleted~`) rather than double tilde (`~~deleted~~`). The test correctly matches this behavior.

### Observations Carried Forward (TASK-004)

- non-article.html uses a redirect page with empty body instead of a login form. The spec describes it as "a login form or search results page with no identifiable article content," but Readability with linkedom extracts content from any page with text nodes in the body, even form-only pages. The redirect page satisfies the acceptance criterion (Readability returns null). This is documented in an HTML comment referencing DA-04. If future Readability or linkedom updates change this behavior, the fixture may need revisiting.
- mixed-content.html includes nav, sidebar aside, and footer elements outside the article tag, which will exercise Readability's content isolation in downstream tasks (TASK-009, TASK-021).

---

## Verdict Rationale

All acceptance criteria are met: headings, paragraphs, bold, italic, links, lists, code blocks, blockquotes, and horizontal rules convert correctly; heading levels are preserved; absolute URLs are maintained. Both validation gates pass. No blocking or non-blocking findings.
