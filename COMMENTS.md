# Code Review: feat/task-012b-figures-image-rewriting

**Task:** TASK-012b: Custom Turndown Rules — Figures & Image Rewriting
**Reviewer:** Code Reviewer Agent
**Date:** 2026-02-14
**Verdict:** APPROVE

---

## Summary

TASK-012b successfully adds two critical Turndown rules: (1) figure handling preserves `<figure>` elements as inline HTML with `<img>` src attributes rewritten to `assets/` paths, and (2) standalone image rewriting converts `<img>` to Markdown syntax with src rewritten to asset paths. A shared image counter increments across both rule types, with deduplication ensuring duplicate URLs map to the same filename. All acceptance criteria are met, tests pass (87/87 including 58 markdown-converter tests), types are correct, and the golden file matches expected output format.

---

## Validation Gates

```
npm test:      PASS (87 tests, 3 suites, 446ms)
npm run typecheck: PASS (no type errors)
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

**O-1: Extension extraction logic handles malformed URLs gracefully**

The `extractExtension()` helper (lines 6–18) uses try-catch around URL parsing and falls back to `.jpg` for any parsing failure or invalid extension. This is robust and prevents crashes on malformed image URLs (data: URIs, relative paths, etc.). The DD-12 reference in the catch block correctly documents this fallback design decision.

**O-2: Figure rule uses in-place DOM mutation on shallow clone**

The figure rule (lines 113–126) mutates `<img>` src attributes directly on the cloned DOM node before serializing outerHTML. This is efficient and correct because Turndown operates on shallow clones, so mutations are isolated and don't affect the original DOM passed to the function.

**O-3: Image counter and imageMap reset per convertToMarkdown() call**

The imageCounter and imageMap are declared inside convertToMarkdown() (lines 33–34), ensuring they reset on each invocation. This matches the spec requirement (Section 7.2, TASK-012b: "imageMap is a closure-scoped variable...reset on each call"). Test `resets counter between calls to convertToMarkdown` (lines 562–575) validates this behavior.

**O-4: Deduplication via imageMap lookup before counter increment**

The getAssetPath() function (lines 36–43) checks imageMap for existing entries before incrementing the counter. This ensures the same URL always maps to the same filename and prevents counter increment on duplicates. Test `does not increment counter for duplicate URLs` (lines 537–545) validates this critical behavior.

**O-5: Golden file figure-caption.expected.md is correctly formatted**

The golden file shows proper inline HTML preservation (figures on single lines), correct image path rewriting (image-001.jpg, image-002.png, image-003.webp with 3-digit zero-padding), and correct spacing (blank lines between blocks). Matches Section 10.7 conventions exactly.

## Prior Observations Carried Forward

### TASK-012a

- VIDEO_HOSTS regex is well-chosen: youtube.com, youtu.be, vimeo.com, dailymotion.com, dai.ly. Case-insensitive and covers major platforms.
- tableChildren rule effectively prevents GFM recursion by returning empty string for all table children (thead, tbody, tfoot, tr, th, td, caption, colgroup, col).
- Golden files follow whitespace conventions (single trailing newline, blank lines between blocks, correct heading levels due to Readability h1→h2 demotion).

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

All acceptance criteria from Section 7.2 TASK-012b are satisfied: figures are preserved as inline HTML with img src rewritten to assets/ paths, standalone images are converted to Markdown syntax with src rewriting, the imageMap correctly tracks URL→filename mappings, deduplication works (same URL maps to same filename), and the shared counter between figures and standalone images is validated. Tests pass (87/87, including 58 markdown-converter tests), typecheck passes with no errors, golden file format is correct, and code follows all module and documentation conventions. The implementation is ready to merge.
