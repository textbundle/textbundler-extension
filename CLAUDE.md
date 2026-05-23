# CLAUDE.md

First, run tests.
Explore commands: `npm run` runner.

Always run tests after changes.

## Project Overview

TextBundler = cross-browser extension (Firefox + Chrome). Captures web pages as self-contained Markdown archives in TextBundle `.textpack` format. Built w/ WXT (Manifest V3/V2), TypeScript, Vite.

Load unpacked: `about:debugging` (Firefox) or `chrome://extensions` (Chrome).

## Architecture

Two-context event-driven pipeline, split by WebExtensions platform:

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

Shared types in `lib/types.ts`. No persistent store — all transient in-memory.

## Key Dependencies

- `@mozilla/readability` — content extraction (same engine as Firefox Reader View)
- `turndown` + `turndown-plugin-gfm` — HTML→Markdown w/ custom rules
- `jszip` — in-browser zip generation
- `js-yaml` — YAML frontmatter serialization
- `linkedom` — DOM impl for Node.js tests (NOT jsdom)

## Testing

- **Vitest** w/ `node` env (not jsdom — linkedom used explicitly)
- `__DEV__` defined in Vitest config for logger module compat
- **Tier 1 fixtures** (`tests/fixtures/*.html` + `.expected.md` golden files) — curated HTML fragments, in git
- **Tier 2 fixtures** (`tests/sites/`) — downloaded full pages, gitignored, fetched via `bash scripts/download-fixtures.sh`
- Golden file comparisons use `normalizeMarkdown()` helper (strip trailing whitespace, normalize line endings, collapse blank lines, single trailing newline)
- Readability tests need 10s timeout — linkedom infinite loop risk (linkedom issue #43)
- All `browser.*` calls confined to `entrypoints/`; `lib/` modules browser-API-free, testable w/o browser mocks
- No network in tests — image downloads mocked via `vi.stubGlobal('fetch', ...)`

## Conventions

- Named exports only (no default), except where WXT requires for entrypoints
- Each `lib/` module exports single primary fn matching module name (e.g., `markdown-converter.ts` exports `convertToMarkdown()`)
- Return `null` for expected failures (e.g., Readability can't extract); throw only for programmer errors
- Logger calls include module name: `logger.info("module-name", "message", { data })`
- Logger prefix: `[TextBundler:{module}]`; `debug`/`info` stripped in prod via Vite `define`
- Image filenames: `image-NNN.ext` (3-digit zero-padded, lowercase, ext from original URL, fallback `.jpg`)
- Output filename: `{YYYY-MM-DD}-{slug}.textpack` (slug truncated to 80 chars)
- Frontmatter fields w/ null/undefined values omitted entirely
- All bundle filenames, image filenames, slugs lowercase
- Extension uses `activeTab` permission (not `<all_urls>`) — content script injected on-demand, not declared in manifest `content_scripts`

## TDD Workflow

Tasks = test-driven. Per task:

1. Read task test expectations + acceptance criteria from `docs/SPEC.md` Section 7.2
2. Write test file w/ all specified cases (red)
3. Implement module til tests pass (green)
4. Run `npm test` + `npm run typecheck` — both must pass before moving on

Critical path: TASK-001 → 003 → 004 → 011 → 004a → 012a → 012b → 015 → 018b → 018c → 020

## Code Documentation

- Every exported fn = JSDoc w/ purpose, params, return, spec section / requirement ID (e.g., `// FR-001`, `// DD-12`)
- Non-obvious choices get comment explaining *why*, referencing `DD-XX` or `DA-XX` IDs from spec
- No noise comments restating code

## Git Workflow

- Branch off `main` into feature branches per task: `feat/task-001-project-scaffold`
- If not on `main` at start, continue current branch (unfinished task)
- Atomic commits — ideally one per acceptance criteria checkbox
- Commit msgs reference task ID: `feat(task-001): initialize WXT project scaffold`
- Always merge w/ `--no-ff` (merge commit, never fast-forward)
- Run `npm test` + `npm run build` before every commit — never commit broken code

## Releases

Release process in `CONTRIBUTING.md`. Short version:

1. `npm version patch|minor|major` — bumps `package.json`, creates commit + `v*` tag
2. Update `CHANGELOG.md` per [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format (categories: Added, Changed, Deprecated, Removed, Fixed, Security)
3. `git push origin main --tags` — CI (`release.yml`) builds Chrome + Firefox zips, creates GitHub Release w/ downloadable artifacts

Changelog + version bump = same commit or tag. Always update changelog before releasing.

## CI

- `.github/workflows/ci.yml` — runs tests + typecheck on push to `main` and PRs
- `.github/workflows/release.yml` — triggered by `v*` tag push; runs tests, then builds + publishes Chrome/Firefox `.zip` artifacts to GitHub Releases

## Task Execution

- Before task: read description + acceptance criteria in `docs/SPEC.md` Section 7.2, verify deps complete, review `lib/types.ts` + Section 4.2 for data types
- Follow execution order in Section 10.1 — no skipping ahead
- `docs/SPEC.md` = source of truth. On ambiguity, check design assumptions (Section 8) + design decisions (Section 9) first. If spec genuinely silent, state assumption in code comment

## Golden File Testing (Section 10.7)

- Golden files generated from Turndown output w/ fix-ups, not hand-authored
- Normalize both actual + expected w/ `normalizeMarkdown()` before comparison
- Heading levels preserved exactly from HTML (no promotion/demotion)
- Tables, details/summary, sup/sub, figures, video iframes preserved as inline HTML
- Admonitions: `> [!TYPE]` format from `<aside>` elements

## Spec & Requirements

Full specs in `docs/SPEC.md` + `docs/REQUIREMENTS.md`. Spec contains implementation plan w/ phased task breakdown (TASK-001 through TASK-020+). Consult spec for detailed acceptance criteria + data type definitions.