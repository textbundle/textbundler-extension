# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TextBundler is a cross-browser extension (Firefox + Chrome) that captures web pages as self-contained Markdown archives in the TextBundle `.textpack` format. Built with WXT (Manifest V3/V2), TypeScript, and Vite.

## Commands

```bash
npm run dev           # WXT dev mode with HMR + auto-reload
npm run build         # Production build → dist/
npm run test          # Vitest (Tier 1 fixtures, no network)
npm run test -- --run slug  # Run a single test file by name match
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
npm run format        # Prettier
wxt zip               # Package for distribution (.xpi / .zip)
```

Load unpacked extension: `about:debugging` (Firefox) or `chrome://extensions` (Chrome).

## Architecture

Two-context event-driven pipeline split by the WebExtensions platform:

**Content Script** (`entrypoints/content.ts`) — injected on-demand via `browser.scripting.executeScript()`:
- `LazyImageResolver` → resolves data-src, srcset, lazy-load patterns
- `ReadabilityRunner` → clones DOM, runs Mozilla Readability for article extraction
- `MetadataExtractor` → scrapes `<head>`, OG tags, JSON-LD, meta tags

Sends `ExtractionResult` to background via `browser.runtime.sendMessage()`.

**Background Service Worker** (`entrypoints/background.ts`):
- `MarkdownConverter` → Turndown + GFM plugin + custom rules (tables as HTML, figures, aside→admonition, image src rewriting to `assets/`)
- `ImageDownloader` → parallel fetch (4 concurrent, 30s per-image timeout)
- `patchFailedImages` → reverts failed image `assets/` paths back to absolute URLs
- `FrontmatterBuilder` → js-yaml YAML frontmatter from metadata
- `BundlePackager` → JSZip → .textpack (info.json + text.md + assets/)
- `DownloadTrigger` → `browser.downloads.download()`

All shared types live in `lib/types.ts`. No persistent data store — everything is transient in-memory.

## Key Dependencies

- `@mozilla/readability` — content extraction (same engine as Firefox Reader View)
- `turndown` + `turndown-plugin-gfm` — HTML→Markdown with custom rules
- `jszip` — in-browser zip generation
- `js-yaml` — YAML frontmatter serialization
- `linkedom` — DOM implementation for Node.js tests (NOT jsdom)

## Testing

- **Vitest** with `node` environment (not jsdom — linkedom is used explicitly)
- `__DEV__` is defined in the Vitest config for logger module compatibility
- **Tier 1 fixtures** (`tests/fixtures/*.html` + `.expected.md` golden files) — curated HTML fragments, checked into git
- **Tier 2 fixtures** (`tests/sites/`) — downloaded full pages, gitignored, fetched via `bash scripts/download-fixtures.sh`
- Golden file comparisons use `normalizeMarkdown()` helper (strip trailing whitespace, normalize line endings, collapse blank lines, single trailing newline)
- Readability tests must have a 10s timeout due to linkedom infinite loop risk (linkedom issue #43)
- All `browser.*` API calls are confined to `entrypoints/` files; `lib/` modules are browser-API-free and testable without browser mocks
- No network calls in any test — image downloads mocked via `vi.stubGlobal('fetch', ...)`

## Conventions

- Named exports only (no default exports), except where WXT requires it for entrypoints
- Each `lib/` module exports a single primary function matching the module name (e.g., `markdown-converter.ts` exports `convertToMarkdown()`)
- Return `null` for expected failures (e.g., Readability can't extract); throw only for programmer errors
- Logger calls include the module name: `logger.info("module-name", "message", { data })`
- Logger prefix format: `[TextBundler:{module}]`; `debug`/`info` stripped in production builds via Vite `define`
- Image filenames: `image-NNN.ext` (3-digit zero-padded, lowercase, extension from original URL, fallback `.jpg`)
- Output filename: `{YYYY-MM-DD}-{slug}.textpack` (slug truncated to 80 chars)
- Frontmatter fields with null/undefined values are omitted entirely
- All filenames inside bundles, image filenames, and slugs are lowercase
- Extension uses `activeTab` permission (not `<all_urls>`) — content script injected on-demand, not declared in manifest `content_scripts`

## TDD Workflow

Tasks follow test-driven development. For each task:

1. Read the task's test expectations and acceptance criteria from `docs/SPEC.md` Section 7.2
2. Write the test file with all specified test cases (red)
3. Implement the module until all tests pass (green)
4. Run `npm test` and `npm run typecheck` — both must pass before moving on

Critical path: TASK-001 → 003 → 004 → 011 → 004a → 012a → 012b → 015 → 018b → 018c → 020

## Code Documentation

- Every exported function gets a JSDoc comment with purpose, parameters, return value, and spec section / requirement ID (e.g., `// FR-001`, `// DD-12`)
- Non-obvious implementation choices get a comment explaining *why*, referencing `DD-XX` or `DA-XX` IDs from the spec
- Do not add noise comments that restate the code

## Git Workflow

- Branch off `main` into feature branches per task: `feat/task-001-project-scaffold`
- If not on `main` when starting, continue the current branch (unfinished task)
- Atomic commits — ideally one per acceptance criteria checkbox
- Commit messages reference the task ID: `feat(task-001): initialize WXT project scaffold`
- Run `npm test` and `npm run typecheck` before every commit — never commit broken code

## Task Execution

- Before starting a task: read its description + acceptance criteria in `docs/SPEC.md` Section 7.2, verify dependency tasks are complete, review `lib/types.ts` and Section 4.2 for data types
- Follow execution order in Section 10.1 — do not skip ahead
- `docs/SPEC.md` is the source of truth. On ambiguity, check design assumptions (Section 8) and design decisions (Section 9) first. If the spec is genuinely silent, state the assumption in a code comment

## Golden File Testing (Section 10.7)

- Golden files are generated from Turndown output with fix-ups, not hand-authored
- Normalize both actual and expected output with `normalizeMarkdown()` before comparison
- Heading levels preserved exactly from HTML (no promotion/demotion)
- Tables, details/summary, sup/sub, figures, video iframes preserved as inline HTML
- Admonitions: `> [!TYPE]` format from `<aside>` elements

## Spec & Requirements

Full specifications live in `docs/SPEC.md` and `docs/REQUIREMENTS.md`. The spec contains the implementation plan with phased task breakdown (TASK-001 through TASK-020+). Consult the spec for detailed acceptance criteria and data type definitions.
