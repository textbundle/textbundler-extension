# Code Review: feat/task-012a-html-preservation

**Task:** TASK-012a: Custom Turndown Rules — HTML Preservation
**Reviewer:** Code Reviewer Agent
**Date:** 2026-02-14
**Verdict:** APPROVE

---

## Summary

This branch successfully implements custom Turndown rules to preserve HTML elements that cannot be adequately represented in Markdown: tables, details/summary, sup/sub, and video iframes. The implementation correctly overrides Turndown's default conversion for these elements and includes comprehensive tests with golden file comparisons. All validation gates pass, acceptance criteria are met, and the code follows project conventions.

---

## Validation Gates

```
npm test:      PASS (70 tests, 3 suites)
npm run typecheck: PASS
```

---

## Checklist Results

- Acceptance Criteria: PASS
- Type Contracts: PASS
- Module Conventions: PASS
- Testing: PASS
- Golden File Conventions: PASS
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

**O-1: VIDEO_HOSTS regex is well-chosen**

The regex at line 31 includes: youtube.com, youtu.be, vimeo.com, dailymotion.com, dai.ly. This covers the major video hosting services mentioned in the spec and is case-insensitive. Future iterations could consider other platforms (e.g., Twitch, etc.), but the current list is appropriate for mainstream content.

**O-2: Empty `imageMap` in TASK-012a is correct**

The `imageMap` returned in line 91 is always empty at this stage. The spec (TASK-012b) states the image rewriting rule is a separate task. This separation of concerns is clean: TASK-012a focuses on HTML preservation rules, and TASK-012b will add the image rewriting logic. Tests correctly verify this (line 20 in the test file).

**O-3: tableChildren rule effectively prevents GFM recursion**

The tableChildren rule (lines 42-45) filters on thead, tbody, tfoot, tr, th, td, caption, colgroup, col and returns empty string. This prevents Turndown from recursively converting table internals. The approach is simple and effective — when the table rule returns `outerHTML`, the children are already included, so child rules must emit nothing.

**O-4: Golden files follow whitespace conventions**

All golden files end with exactly one newline. Heading levels are consistent (## for top-level due to Readability's h1→h2 demotion inside article elements). Content is properly formatted with blank lines between blocks. The latest fix commit (1249466) corrected heading levels to match actual Readability pipeline output, showing iterative quality improvement.

## Prior Observations Carried Forward

### TASK-004a

- Readability strips `<aside>`, `<details>`, `<iframe>`, and `class="language-*"` attributes from `<code>` elements. Golden files for fixtures containing these elements are authored based on article.innerHTML (bypassing Readability) to test the custom Turndown rules in TASK-012a/b/c. The basic-article and code-blocks golden files use Readability output (matching the existing test pattern). This means mixed-content.expected.md includes `javascript` language annotations on code blocks while code-blocks.expected.md does not -- this is intentional and reflects the different input paths.
- linkedom serializes boolean HTML attributes with explicit empty string values (e.g., `allowfullscreen=""`, `open=""`). The golden files account for this serialization behavior. If the DOM library changes, these golden files may need updating.
- The aside-admonition fixture lacks a `role="note"` or `role="alert"` variant and a heading-based detection variant. The TASK-012c spec recommends "at least 4 variants: class-based detection, role-based, heading-based, and default fallback." The current fixture has 3 class-based, 1 no-class (default), and 1 `role="complementary"` (also falls to default). Consider adding `role="note"` and heading-based variants to the fixture when implementing TASK-012c.

### TASK-011

- Readability demotes the `<h1>` in basic-article.html to `<h2>` in its output, so the fixture integration test correctly expects `## Main Heading` rather than `# Main Heading`. This is expected Readability behavior and the converter preserves these levels without further modification.
- The TurndownService instance is created fresh on each `convertToMarkdown()` call. This is the correct approach for TASK-012b, which needs to attach image-rewriting rules with a closure-scoped imageMap that resets per call.
- The GFM plugin's strikethrough rule uses single tilde (`~deleted~`) rather than double tilde (`~~deleted~~`). The test correctly matches this behavior.

### TASK-004

- non-article.html uses a redirect page with empty body instead of a login form. The spec describes it as "a login form or search results page with no identifiable article content," but Readability with linkedom extracts content from any page with text nodes in the body, even form-only pages. The redirect page satisfies the acceptance criterion (Readability returns null). This is documented in an HTML comment referencing DA-04. If future Readability or linkedom updates change this behavior, the fixture may need revisiting.
- mixed-content.html includes nav, sidebar aside, and footer elements outside the article tag, which will exercise Readability's content isolation in downstream tasks (TASK-009, TASK-021).

---

## Verdict Rationale

All acceptance criteria from Section 7.2 TASK-012a are satisfied: each of the four rule types (tables, details/summary, sup/sub, video iframes) has dedicated tests using its corresponding fixture and golden file. All existing tests continue to pass. Validation gates pass with no errors. The implementation is complete, correct, and ready to merge.
