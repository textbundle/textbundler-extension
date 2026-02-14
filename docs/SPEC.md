# Solution Specification: TextBundler

**Version:** 1.1
**Date:** 2026-02-14
**Author:** Solution Architect (AI-Assisted)
**Status:** Draft
**Source Requirements:** [docs/REQUIREMENTS.md](./REQUIREMENTS.md)

---

## 1. Executive Summary

TextBundler is a cross-browser extension (Firefox and Chrome) that captures web pages as self-contained Markdown archives using the TextBundle `.textpack` format. It uses a two-context event-driven pipeline: a content script extracts article content via Mozilla Readability and scrapes page metadata, then passes the result to a background service worker that converts HTML to Markdown via Turndown, generates YAML frontmatter, downloads content images in parallel, patches failed image references back to absolute URLs, packages everything as a `.textpack` zip via JSZip, and triggers a browser download. The extension is built with WXT (the leading browser extension framework), TypeScript, and Manifest V3/V2 auto-generation for cross-browser compatibility.

---

## 2. Architecture Overview

### 2.1 Architecture Style

**Two-context event-driven pipeline** — dictated by the WebExtensions platform.

The extension has no server, no database, and makes no external network calls beyond fetching images already present in the page content (NFR-007). All processing is transient and in-memory. The architecture is a linear pipeline split across two execution contexts:

1. **Content Script** — injected on-demand into the active tab via `browser.scripting.executeScript()`. Handles DOM access, lazy-image resolution, Readability extraction, and metadata scraping.
2. **Background Service Worker** — orchestrates the pipeline. Runs Turndown conversion, generates frontmatter, fetches images, patches failed image references, builds the zip, and triggers the download.

Communication between the two contexts is via `browser.runtime.sendMessage()` / `browser.runtime.onMessage`. This is not a design choice — it is how WebExtensions work.

**Justification:** The problem is a linear data transformation pipeline (HTML → Markdown → zip), not a client-server system. No fan-out, no queues, no orchestration complexity. The WebExtensions platform defines the two-context split. FR-001 through FR-005 form a strict sequential pipeline. NFR-007 (no external calls) and NFR-009 (minimal dependencies) confirm a simple, flat module structure.

### 2.2 System Component Map

```text
User Trigger (toolbar button / context menu)
        │
        ▼
┌─────────────────────────┐
│     Content Script       │  (injected into active tab on demand)
│  ┌───────────────────┐   │
│  │ LazyImageResolver │   │  Resolves data-src, srcset, etc.
│  │ ReadabilityRunner  │   │  Extracts article HTML
│  │ MetadataExtractor  │   │  Scrapes <head>, OG, JSON-LD
│  └───────────────────┘   │
└────────────┬────────────┘
             │  message: { article, metadata, sourceUrl }
             ▼
┌─────────────────────────┐
│   Background Service     │  (service worker / event page)
│   Worker                 │
│  ┌───────────────────┐   │
│  │ MarkdownConverter │   │  Turndown + custom rules
│  │ ImageDownloader   │   │  Parallel fetch (4 concurrent)
│  │ patchFailedImages │   │  Revert failed image URLs
│  │ FrontmatterBuilder│   │  js-yaml serialization
│  │ BundlePackager    │   │  JSZip → .textpack
│  │ DownloadTrigger   │   │  browser.downloads API
│  └───────────────────┘   │
└─────────────────────────┘
             │
             ▼
       .textpack file
       saved to disk
```

### 2.3 Communication Patterns

- **Content Script → Background:** Single `browser.runtime.sendMessage()` carrying the `ExtractionResult` payload (cleaned HTML + metadata). Fire-and-forget from the content script's perspective.
- **Background → Content Script:** Response message (success/error) for notification display. Alternatively, background handles notifications directly.
- **No persistent connections.** No `browser.runtime.connect()` / ports. The payload fits in a single message. For typical articles, the extracted HTML + metadata is well under browser message size limits (~64MB practical). Extremely large pages could theoretically exceed this; the error handling path displays a generic error notification.
- **No external network calls** except `fetch()` for image downloads (URLs from the extracted content, using the browser's active session cookies).

### 2.4 Service Worker Lifetime

Chrome may terminate service workers after ~5 minutes of inactivity. However, active `fetch()` calls keep the service worker alive. The pipeline target is < 10 seconds for typical articles (NFR-001). Worst case for image-heavy pages: 30s timeout × ceiling(N/4) batches. For 20 images at 4 concurrency, that's 5 batches × 30s = 2.5 minutes of image downloading, well within the 5-minute lifetime. The per-image timeout (30s) and overall pipeline timeout (60s excluding image downloads) provide guardrails. If the service worker is terminated mid-pipeline, the error handling path catches the failure and displays a notification.

---

## 3. Technology Stack

| Layer | Technology | Version | Justification (Req IDs) |
|---|---|---|---|
| Extension Framework | WXT | latest | Cross-browser MV2/MV3 auto-generation, file-based manifest, Vite-powered dev mode with HMR, built-in zip/publish tooling. Replaces manual esbuild + webextension-polyfill + manifest management. NFR-003, NFR-004, NFR-009. |
| Language | TypeScript | 5.x | Type safety for complex metadata objects, message shapes, and Turndown plugin interfaces. OQ-001 resolved. |
| Build Tool | Vite (via WXT) | — | Built into WXT. Sub-second HMR, zero manual config. NFR-009. |
| Cross-Browser API | @wxt-dev/browser (via WXT) | — | WXT's own cross-browser abstraction. Replaces webextension-polyfill. OQ-004 resolved. |
| Content Extraction | @mozilla/readability | 0.5+ | Proven heuristics, same engine as Firefox Reader View. Bundled with extension. FR-001, A-001, A-006. |
| HTML→Markdown | turndown + turndown-plugin-gfm | 7.x | Extensible rule system for custom element conversion. FR-002, A-002. |
| Zip Packaging | JSZip | 3.x | In-browser zip generation. Well-tested, MIT license. FR-005, A-004. |
| YAML Serialization | js-yaml | 4.x | Battle-tested YAML emitter. Handles escaping edge cases. FR-003. |
| Testing | Vitest | 2.x | Fast, TypeScript-native. Unit + integration tests for pipeline modules. NFR-009. |
| Test DOM Parser | linkedom | latest | Lightweight DOM implementation for Node.js tests. Parses HTML fixtures into Document objects for Readability and metadata extraction tests. No browser needed. |
| Linting | ESLint | latest | Code consistency. |
| Formatting | Prettier | latest | Code formatting. |
| Package Manager | npm | — | Simplest option, no reason for alternatives. |
| CI/CD | GitHub Actions | — | Project hosted on GitHub (textbundle org). |

---

## 4. Data Architecture

### 4.1 Entity-Relationship Map

No persistent data store. All data is transient, flowing through the pipeline in-memory. The "entities" are the data shapes passed between pipeline stages.

```text
[PageDOM] ──extracts──► [ExtractionResult] ──transforms──► [TextBundleContents] ──packages──► [.textpack file]

ExtractionResult contains:
  [ArticleResult] 1──1 [PageMetadata]

TextBundleContents contains:
  [MarkdownString] 1──1 [YAMLFrontmatter]
  [InfoJson] 1──1 [TextBundleContents]
  [TextBundleContents] 1──M [ImageAsset]
```

### 4.2 Data Type Definitions

These TypeScript interfaces are the contracts between pipeline stages. All are defined in `lib/types.ts`.

```typescript
// Readability extraction result
interface ArticleResult {
  title: string;
  content: string;        // cleaned HTML fragment from Readability
  textContent: string;    // plain text (for word count)
  excerpt: string;        // Readability excerpt
  byline: string | null;  // Readability detected byline
  length: number;         // character count
}

// Message from Content Script → Background Script
interface ExtractionResult {
  type: "archive-page";
  article: ArticleResult;
  metadata: PageMetadata;
  sourceUrl: string;
}

interface PageMetadata {
  title: string;                   // best title: og:title > <title> > Readability
  author: string | string[] | null; // meta, OG, JSON-LD, byline; array if multiple
  date: string | null;             // ISO 8601 normalized
  url: string;                     // window.location.href
  canonicalUrl: string | null;     // <link rel="canonical">
  siteName: string | null;         // og:site_name
  language: string | null;         // <html lang>
  description: string | null;      // og:description or meta description
  excerpt: string | null;          // Readability excerpt / first paragraph
  keywords: string[] | null;       // meta keywords, split to array
  ogImage: string | null;          // og:image URL
  ogType: string | null;           // og:type
}

// Extraction failure message
interface ExtractionFailure {
  type: "extraction-failed";
  url: string;
  reason: string;
}

// Internal pipeline types
interface ImageAsset {
  originalUrl: string;
  filename: string;         // e.g., "image-001.jpg" (always lowercase, always 3-digit padded)
  data: ArrayBuffer;
  mimeType: string;
  failed: boolean;
}

interface ImageMap {
  [originalUrl: string]: string; // originalUrl → assets/filename
}

interface TextBundleContents {
  markdown: string;         // YAML frontmatter + Markdown body
  infoJson: string;         // TextBundle info.json content
  assets: ImageAsset[];     // downloaded images (failed ones excluded)
  filename: string;         // output filename: {date}-{slug}.textpack
}

// Background → Content Script response
interface ArchiveResponse {
  success: boolean;
  error?: string;
  filename?: string;
}
```

### 4.3 Data Flow

```text
[Page DOM]
    │
    ├──► MetadataExtractor ──► PageMetadata (from <head>, OG, JSON-LD)
    │
    ├──► LazyImageResolver ──► (mutates cloned DOM: resolves data-src, srcset)
    │
    └──► ReadabilityRunner ──► ArticleResult { title, content (HTML), textContent, excerpt, byline }
              │
              ▼
         ExtractionResult { article, metadata, sourceUrl }
              │
              │  browser.runtime.sendMessage()
              ▼
         MarkdownConverter ──► { markdown (with assets/ paths), imageMap }
              │                    │
              │                    ▼
              │              ImageDownloader ──► ImageAsset[] (4 concurrent, some may fail)
              │                    │
              │                    ▼
              │              patchFailedImageUrls(markdown, imageMap, failedAssets)
              │              ──► patched markdown (failed images reverted to absolute URLs)
              │
              ▼
         FrontmatterBuilder ──► YAML string (from metadata + word_count + archived_at)
              │
              ▼
         BundlePackager ──► JSZip blob (info.json + text.md + assets/)
              │
              ▼
         DownloadTrigger ──► browser.downloads.download()
              │
              ▼
         .textpack file on disk
```

**Image URL lifecycle:** The Markdown converter rewrites all image `src` attributes to `assets/image-NNN.ext` paths optimistically. After image downloads complete, any failed downloads are identified. The `patchFailedImageUrls()` function performs a simple `replaceAll()` on the Markdown string, reverting each failed image's `assets/image-NNN.ext` reference back to its original absolute URL. This is safe because the `assets/image-NNN.ext` filenames are unique, deterministic strings that appear nowhere else in the content. This handles both standalone `![alt](assets/...)` Markdown images and `<img src="assets/...">` within inline HTML `<figure>` blocks.

### 4.4 TextBundle info.json

Per TextBundle v2 specification (FR-005):

```json
{
  "version": 2,
  "type": "net.daringfireball.markdown",
  "transient": false,
  "creatorIdentifier": "org.textbundle.textbundler",
  "creatorURL": "https://github.com/textbundle/textbundler",
  "sourceURL": "<original page URL>"
}
```

### 4.5 YAML Frontmatter Format

Per FR-003. Fields with null/undefined values are omitted entirely (not empty strings):

```yaml
---
title: "Article Title Here"
author: "Author Name"
date: 2026-02-14
url: https://example.com/article
canonical_url: https://example.com/article
site_name: Example Site
language: en
description: "A brief description of the article"
excerpt: "First paragraph or Readability excerpt"
keywords:
  - keyword1
  - keyword2
og_image: https://example.com/og-image.jpg
og_type: article
word_count: 1523
archived_at: 2026-02-14T10:30:00Z
---
```

### 4.6 Sensitive Data Handling

Per section 5.1 of requirements, all data is low sensitivity (publicly visible page content). No encryption needed. No data leaves the browser (NFR-007). User settings (Phase 2) stored in `browser.storage.sync` — browser handles encryption at rest.

### 4.7 Data Validation Rules

- All dates normalized to ISO 8601 (FR-003).
- YAML values escaped via js-yaml (FR-003).
- `text.md`: valid UTF-8 encoded Markdown.
- Zip: standard format, no zip64 unless archive exceeds 4GB.

**Image filename convention:** Always `image-NNN.ext` where NNN is zero-padded to 3 digits regardless of total image count. Examples: `image-001.jpg`, `image-002.png`, `image-015.svg`. Extension is preserved from the original URL path; falls back to `.jpg` if undeterminable. All filenames lowercase.

**Slug generation convention:** Used for the output `.textpack` filename (`{YYYY-MM-DD}-{slug}.textpack`). Algorithm:
1. Start with the article title string.
2. Normalize unicode to ASCII where possible (e.g., `é` → `e`). Characters that cannot be transliterated are stripped.
3. Convert to lowercase.
4. Replace any run of characters matching `[^a-z0-9]` with a single hyphen.
5. Remove leading and trailing hyphens.
6. Truncate to 80 characters (slug portion only, not including the date prefix).
7. Remove any trailing hyphen created by truncation.

Examples:
- `"Hello & World!?"` → `hello-world`
- `"Rust's Ownership Model: A Deep Dive"` → `rust-s-ownership-model-a-deep-dive`
- `"A Very Long Title..."` (100+ chars) → truncated to 80 chars, trailing hyphen removed
- `"日本語の記事"` → characters stripped → falls back to first 80 chars of URL hostname as slug

### 4.8 Migration Strategy

N/A — greenfield project. No existing data to migrate. No seed data needed.

---

## 5. API Specification

### 5.1 Internal Message Protocol

The content script and background script communicate via `browser.runtime.sendMessage()`. Two message types for Phase 1:

#### `archive-page` — Successful Extraction

```typescript
// Content Script → Background Script
{
  type: "archive-page",
  article: ArticleResult,
  metadata: PageMetadata,
  sourceUrl: string
}

// Background Script response
{ success: true, filename: "2026-02-14-article-title.textpack" }
|
{ success: false, error: "Image download failed for 3 images" }
```

#### `extraction-failed` — Extraction Failure

```typescript
// Content Script → Background Script
{
  type: "extraction-failed",
  url: string,
  reason: string
}
```

### 5.2 User Interaction Points

#### Toolbar Button (FR-006)

- `browser.action` (MV3) / `browser.browserAction` (MV2) — WXT handles the abstraction.
- Click → background injects content script → extraction → archive pipeline.
- Visual states:
  - **Idle:** Default icon.
  - **Processing:** Badge text "..." (via `browser.action.setBadgeText`).
  - **Success:** Badge "OK" (clears after 3 seconds via `setTimeout`) + browser notification.
  - **Error:** Badge "!" (clears after 5 seconds via `setTimeout`) + browser notification with error message.

#### Context Menu (FR-007)

- Menu item: "Archive Page as TextBundle"
- Registered via `browser.contextMenus.create()` in background script.
- Triggers same pipeline as toolbar button.

#### Notifications (FR-006, FR-009)

- `browser.notifications.create()` for success/failure messages.
- Success: "Archived: {title}" — includes the output filename.
- Failure: "Could not extract content from this page. The page may not contain an article." (FR-009).

### 5.3 Extension Permissions

```json
{
  "permissions": [
    "activeTab",
    "contextMenus",
    "downloads",
    "notifications",
    "scripting"
  ]
}
```

`activeTab` is used instead of `<all_urls>`. It grants temporary access to the current tab only when the user explicitly clicks the toolbar button or context menu item. This minimizes permission scope (R-008) and avoids store review friction.

`scripting` is required for `browser.scripting.executeScript()` to inject the content script on demand.

### 5.4 Content Script Injection Strategy

The content script is NOT declared in the manifest's `content_scripts` array. Instead, it is injected on-demand via `browser.scripting.executeScript()` from the background script when the user triggers the action. This:
- Avoids injecting into every page load (performance).
- Works with `activeTab` permission (no `<all_urls>` needed).
- Gives control over injection timing.

### 5.5 Phase 2 Additions (noted, not designed in detail)

- **Settings page:** Standard `browser.runtime.openOptionsPage()` with HTML/CSS form. Stored via `browser.storage.sync`. Settings: output format, filename pattern, image size limit.
- **Keyboard shortcut:** `commands` manifest key with no default binding. User configures via browser's native shortcut management or settings page.
- **Manual selection mode:** Content script overlay with mouse event handlers. Hover highlights block-level containers. Click selects content root. Escape cancels.

---

## 6. Infrastructure & Deployment

### 6.1 Environment Strategy

| Environment | Purpose | Artifact |
|---|---|---|
| local | Development + debugging | Unpacked extension loaded via `about:debugging` (Firefox) / `chrome://extensions` (Chrome). WXT dev mode with auto-reload. |
| CI | Automated checks | Lint, type-check, test (Vitest, no browser). Build verification. |
| Release | Distribution | Signed `.xpi` (Firefox) / `.zip` (Chrome Web Store) via `wxt zip`. |

### 6.2 Project Structure

```text
textbundler/
├── entrypoints/
│   ├── background.ts                  # Service worker / event page entry
│   └── content.ts                     # Content script entry (on-demand injection)
├── lib/
│   ├── types.ts                       # Shared TypeScript interfaces
│   ├── logger.ts                      # Structured logging module
│   ├── lazy-image-resolver.ts         # Resolve data-src, srcset, lazy-load patterns
│   ├── readability-runner.ts          # Clone DOM + run Readability
│   ├── metadata-extractor.ts          # Scrape <head>, OG, JSON-LD, meta tags
│   ├── markdown-converter.ts          # Turndown base config + custom rules
│   ├── frontmatter-builder.ts         # js-yaml frontmatter generation
│   ├── image-downloader.ts            # Parallel image fetch (concurrency: 4)
│   ├── image-patcher.ts              # Revert failed image URLs in Markdown
│   ├── slug.ts                       # Filename slug generation
│   ├── bundle-packager.ts             # JSZip → .textpack assembly
│   └── download-trigger.ts            # browser.downloads.download() wrapper
├── public/
│   └── icons/
│       ├── icon-16.png
│       ├── icon-32.png
│       ├── icon-48.png
│       └── icon-128.png
├── tests/
│   ├── fixtures/
│   │   ├── basic-article.html         # Tier 1: curated HTML fragments (in git)
│   │   ├── basic-article.expected.md  # Golden file: expected Markdown output
│   │   ├── code-blocks.html
│   │   ├── code-blocks.expected.md
│   │   ├── html-table.html
│   │   ├── html-table.expected.md
│   │   ├── figure-caption.html
│   │   ├── figure-caption.expected.md
│   │   ├── aside-admonition.html
│   │   ├── aside-admonition.expected.md
│   │   ├── details-summary.html
│   │   ├── details-summary.expected.md
│   │   ├── sup-sub.html
│   │   ├── sup-sub.expected.md
│   │   ├── lazy-images.html
│   │   ├── og-metadata.html
│   │   ├── minimal-metadata.html
│   │   ├── non-article.html           # Login form / search page (extraction should fail)
│   │   ├── embedded-video.html
│   │   ├── embedded-video.expected.md
│   │   ├── mixed-content.html         # Realistic full article with all elements
│   │   └── mixed-content.expected.md
│   ├── sites/                         # Tier 2: downloaded full pages (gitignored)
│   │   └── .gitkeep
│   ├── helpers/
│   │   ├── parse-html.ts             # linkedom helper to parse fixture files
│   │   └── read-fixture.ts           # Read fixture file by name
│   ├── smoke.test.ts
│   ├── lazy-image-resolver.test.ts
│   ├── readability-runner.test.ts
│   ├── metadata-extractor.test.ts
│   ├── markdown-converter.test.ts
│   ├── frontmatter-builder.test.ts
│   ├── image-downloader.test.ts
│   ├── image-patcher.test.ts
│   ├── slug.test.ts
│   ├── bundle-packager.test.ts
│   ├── pipeline.test.ts              # End-to-end pipeline integration tests
│   └── sites.test.ts
├── scripts/
│   └── download-fixtures.sh           # Downloads Tier 2 HTML fixtures
├── wxt.config.ts
├── vitest.config.ts
├── package.json
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore                         # includes tests/sites/**/*.html
├── .github/
│   └── workflows/
│       └── ci.yml
└── docs/
    ├── REQUIREMENTS.md
    └── SPEC.md
```

### 6.3 CI/CD Pipeline

```text
[Push / PR to main]
    → npm ci
    → npm run typecheck (tsc --noEmit)
    → npm run lint (ESLint)
    → npm run test (Vitest — Tier 1 fixtures only, no network)
    → npm run build (wxt build)
    → Upload dist/ as build artifact
```

Release workflow (manual trigger or tag push):
```text
    → npm run build
    → wxt zip
    → Upload .zip / .xpi to GitHub Release
    → (Manual) Submit to Firefox Add-ons / Chrome Web Store
```

Store submission is manual — automated submission requires API keys and review processes that vary by store.

### 6.4 Monitoring & Observability

Not applicable in the traditional sense (no server). Debugging strategy:

- **Structured logger module** (`lib/logger.ts`) with module-tagged output.
- **Development:** All log levels active (`debug`, `info`, `warn`, `error`).
- **Production builds:** `debug` and `info` stripped via Vite `define` / dead code elimination. Only `warn` and `error` remain.
- **Tests:** Logger output captured for assertion (e.g., verify that a warning was emitted when an image download failed).
- **Browser debugging:** `about:debugging` (Firefox), service worker DevTools (Chrome).
- **Pipeline timing:** Each pipeline stage logs its duration at `info` level. Total pipeline time logged at `info` level on completion. This enables diagnosing NFR-001 (< 10s target) performance issues.

### 6.5 Security

- No external network calls except image fetching from URLs already present in the page (NFR-007).
- No analytics, no telemetry.
- `activeTab` permission instead of `<all_urls>` — minimal permission scope (R-008).
- Dependencies pinned to exact versions in `package-lock.json`.
- Dependabot enabled for security updates.
- Production builds strip debug logging.

---

## 7. Implementation Plan

### 7.1 Phase Overview

| Phase | Name | Goal | Reqs Delivered |
|---|---|---|---|
| 1 | Test Infrastructure & Dev Tooling | Project scaffold, test framework, fixtures, logging, CI | Infrastructure |
| 2 | Content Extraction (TDD) | Readability integration, lazy-image resolution, metadata scraping | FR-001, FR-003 |
| 3 | Markdown Conversion (TDD) | Turndown with all custom rules, golden file tests | FR-002 |
| 4 | Image Pipeline & Packaging (TDD) | Image downloader, frontmatter builder, slug, image patcher, zip packager | FR-004, FR-005 |
| 5 | Extension Wiring | Toolbar button, context menu, orchestrators, notifications | FR-006, FR-007, FR-009 |
| 6 | Integration Testing | Full pipeline tests, Tier 2 corpus smoke tests | All FR |

### 7.2 Task Breakdown

### Phase 1: Test Infrastructure & Dev Tooling

**TASK-001: WXT Project Scaffold**
- Depends on: —
- Size: S
- Description: Initialize the project with `npx wxt@latest init`. Select vanilla TypeScript template (no UI framework). Install runtime dependencies: `@mozilla/readability`, `turndown`, `turndown-plugin-gfm`, `jszip`, `js-yaml`. Install dev dependencies: `vitest`, `linkedom`, `@types/turndown`, `@types/js-yaml`. Configure `wxt.config.ts` with project name, description, and permissions (`activeTab`, `contextMenus`, `downloads`, `notifications`, `scripting`). Create `lib/` directory with empty `types.ts`. Configure `.eslintrc.cjs` and `.prettierrc`. Add npm scripts: `test`, `typecheck`, `lint`, `format`.
- Files: `package.json`, `wxt.config.ts`, `tsconfig.json`, `.eslintrc.cjs`, `.prettierrc`, `lib/types.ts`
- Acceptance: `npm run build` produces a loadable extension in `dist/`. `npm run lint` and `npm run typecheck` pass with zero errors. Extension loads in Firefox (`about:debugging`) and Chrome (`chrome://extensions`) without errors.
- Reqs: NFR-009

**TASK-002: Structured Logger Module**
- Depends on: TASK-001
- Size: S
- Description: Implement `lib/logger.ts`. The logger provides `debug`, `info`, `warn`, and `error` methods. Each accepts a module name (string), message (string), and optional data payload. In development, all levels log to `console` with a `[TextBundler:{module}]` prefix. In production, `debug` and `info` are no-ops (controlled by a compile-time constant that Vite's `define` can strip). The logger must be importable and testable — in test context, provide a way to capture log calls for assertion (e.g., export a `_testGetLogs()` function or accept an injectable output sink).
- Files: `lib/logger.ts`
- Acceptance: Logger output includes module name prefix. In test mode, log calls can be captured and asserted. Production build strips debug/info calls (verify by inspecting built output).
- Reqs: —

**TASK-003: Vitest Configuration + linkedom Test Helper + Readability Smoke Test**
- Depends on: TASK-001
- Size: S
- Description: Configure Vitest in `vitest.config.ts` (or in `wxt.config.ts` if WXT supports it). Set up test environment as `node` (not jsdom — we use linkedom explicitly). Create `tests/helpers/parse-html.ts` that exports a `parseHTML(html: string): Document` function using linkedom's `parseHTML`. This function is the standard way all tests create Document objects from HTML fixture strings or files. Create `tests/helpers/read-fixture.ts` that reads a fixture file from `tests/fixtures/` by name and returns its contents as a string. Write `tests/smoke.test.ts` with two tests:
  1. Parse a minimal HTML string and assert the document has a `<body>`.
  2. **Readability canary test:** Parse a minimal but valid article HTML (inline string with `<html><head><title>Test</title></head><body><article><h1>Title</h1><p>Paragraph one. Paragraph two. Paragraph three. This needs enough content for Readability to consider it an article.</p></article></body></html>`) and run `new Readability(doc).parse()`. Assert the result is non-null and has a non-empty `content` field. This validates that linkedom produces DOM objects compatible with Readability. If this test fails, the team must evaluate switching to JSDOM before proceeding with any Readability-dependent tasks.
- Files: `vitest.config.ts`, `tests/helpers/parse-html.ts`, `tests/helpers/read-fixture.ts`, `tests/smoke.test.ts`
- Acceptance: `npm test` runs and passes both smoke tests. linkedom successfully parses HTML into a Document object. Readability produces non-null output from linkedom-parsed HTML. Fixture reader loads files from `tests/fixtures/`.
- Reqs: —

**TASK-004: Tier 1 Test Fixtures (Curated HTML Fragments)**
- Depends on: TASK-003
- Size: M
- Description: Create curated HTML fixture files in `tests/fixtures/`. Each fixture is a minimal but realistic HTML document targeting specific conversion rules and extraction behaviors. Fixtures are checked into git. Where applicable, create corresponding `.expected.md` golden files containing the expected Markdown output following the conventions in Section 10.7.

  **IMPORTANT:** Before creating golden files, review Section 10.7 (Golden File Conventions) to understand the formatting rules. The golden files created in this task establish the baseline for all subsequent Markdown conversion tests. Changing conventions after Phase 3 tasks are complete requires updating all golden files.

  Fixture manifest:

  | File | Purpose | Golden file? |
  |---|---|---|
  | `basic-article.html` | Headings (h1-h6), paragraphs, bold, italic, links, ordered/unordered lists, blockquotes, horizontal rules | Yes |
  | `code-blocks.html` | Fenced code blocks with language annotations, inline code | Yes |
  | `html-table.html` | Complex table with thead, tbody, colspan, rowspan | Yes |
  | `figure-caption.html` | `<figure>` with `<img>` and `<figcaption>` | Yes |
  | `aside-admonition.html` | `<aside>` elements with various classes (note, tip, warning, none) and roles | Yes |
  | `details-summary.html` | `<details>` with `<summary>` | Yes |
  | `sup-sub.html` | `<sup>` and `<sub>` for footnotes, citations, math | Yes |
  | `lazy-images.html` | Images with `data-src`, `data-lazy-src`, `data-original`, `srcset`, `<picture>` with `<source>` | No (tested by resolver unit tests) |
  | `og-metadata.html` | Full OG tags, JSON-LD `@type: Article`, `<meta name="author">`, `<meta name="keywords">`, `<link rel="canonical">`, `<time>` element | No (tested by extractor unit tests) |
  | `minimal-metadata.html` | Only `<title>` and bare `<body>` — no OG, no meta, no JSON-LD | No |
  | `non-article.html` | A page that is NOT an article: a login form or search results page with no identifiable article content. Readability should return null for this fixture. | No |
  | `embedded-video.html` | YouTube and Vimeo `<iframe>` embeds within article content | Yes |
  | `mixed-content.html` | Realistic full article combining all element types above | Yes |

  Each HTML fixture must be a complete, valid HTML document (with `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`) so that linkedom parses it correctly and Readability can operate on it. The article content should be wrapped in an `<article>` tag or equivalent structure that Readability can identify. Include realistic non-content elements (a `<nav>`, a `<footer>`, a sidebar `<aside>`) in `mixed-content.html` to test extraction isolation.

  The `non-article.html` fixture should contain a login form, navigation links, and no article body — representing a page where Readability cannot identify content.
- Files: `tests/fixtures/*.html`, `tests/fixtures/*.expected.md`
- Acceptance: All fixture files are valid HTML parseable by linkedom. Golden files follow the conventions in Section 10.7. At least 13 fixture files created per the manifest above. `non-article.html` causes Readability to return null.
- Reqs: FR-001, FR-002, FR-003

**TASK-005: Fixture Download Script + Tier 2 Corpus**
- Depends on: TASK-003
- Size: S
- Description: Create `scripts/download-fixtures.sh`. The script uses `wget` to download full HTML pages from a predefined list of URLs into `tests/sites/`. Each page is saved with a descriptive filename. The script is idempotent — re-running overwrites existing files. Add `tests/sites/**/*.html` to `.gitignore`. Include a URL manifest as a comment block at the top of the script.

  URL corpus (20 pages for FR-001 acceptance criteria):

  | Filename | URL | Why | Expected |
  |---|---|---|---|
  | `01-wikipedia-html.html` | `https://en.wikipedia.org/wiki/Markdown` | Tables, citations, info boxes, complex formatting | article |
  | `02-mdn-web-docs.html` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article` | Technical docs, code examples, semantic HTML | article |
  | `03-github-blog.html` | `https://github.blog/news-insights/company-news/github-availability-report-january-2025/` | Modern blog, images with captions, code blocks | article |
  | `04-medium-article.html` | `https://medium.com/@karpathy/yes-you-should-understand-backprop-e2f06eab496b` | Medium's custom HTML structure, embedded images | article |
  | `05-substack-post.html` | `https://www.platformer.news/welcome-to-platformer/` | Substack layout, newsletter format, subscription widgets | article |
  | `06-wordpress-blog.html` | `https://wordpress.org/news/2024/01/wordpress-6-4-shirley/` | WordPress HTML structure, galleries | article |
  | `07-bbc-news.html` | `https://www.bbc.com/news/science-environment-54367684` | News site, media embeds, figure captions, pull quotes | article |
  | `08-guardian-article.html` | `https://www.theguardian.com/technology/2023/nov/30/chatgpt-one-year-on` | News article, side columns, timestamps | article |
  | `09-stackoverflow.html` | `https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array` | Q&A format, code blocks, voting elements | article |
  | `10-arxiv-paper.html` | `https://arxiv.org/abs/1706.03762` | Academic abstract, mathematical notation, metadata | article |
  | `11-rust-docs.html` | `https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html` | Technical book, code examples, navigation | article |
  | `12-css-tricks.html` | `https://css-tricks.com/snippets/css/a-guide-to-flexbox/` | Tutorial, diagrams, code snippets, inline examples | article |
  | `13-atlantic-longform.html` | `https://www.theatlantic.com/magazine/archive/2024/01/social-media-happiness-math-smartphone/676147/` | Longform magazine, pull quotes, complex typography | article |
  | `14-wired-feature.html` | `https://www.wired.com/story/fast-food-kiosks-artificial-intelligence/` | Feature article, hero images, related content | article |
  | `15-python-docs.html` | `https://docs.python.org/3/tutorial/introduction.html` | Official docs, code examples, version selector | article |
  | `16-smashing-mag.html` | `https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/` | Web design, SVG examples, aside elements | article |
  | `17-ars-technica.html` | `https://arstechnica.com/science/2024/01/epic-journey-of-lonely-neutron-star-reaches-conclusion/` | Tech news, inline images, source citations | article |
  | `18-devto-post.html` | `https://dev.to/lacolaco/building-browser-extensions-with-wxt-angular-kfj` | Dev blog, code blocks, tags, clean HTML | article |
  | `19-hn-comments.html` | `https://news.ycombinator.com/item?id=1` | Non-article: HN thread, nested comments, minimal HTML | non-article |
  | `20-github-search.html` | `https://github.com/search?q=markdown+parser&type=repositories` | Non-article: search results, dynamic content | non-article |

  The script should print each URL as it downloads, report failures, and exit 0 even if some downloads fail (best-effort).
- Files: `scripts/download-fixtures.sh`, `.gitignore` update
- Acceptance: Running `bash scripts/download-fixtures.sh` downloads HTML files into `tests/sites/`. Files are gitignored. Script is idempotent. Script handles download failures gracefully.
- Reqs: —

**TASK-006: CI Pipeline**
- Depends on: TASK-003
- Size: S
- Description: Create `.github/workflows/ci.yml`. Trigger on push and PR to `main`. Steps: checkout, setup Node.js (LTS), `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test` (Tier 1 fixtures only — no Tier 2 download step in CI), `npm run build`. Upload `dist/` as a build artifact. Do not run `download-fixtures.sh` in CI — Tier 2 tests are for local dev only.
- Files: `.github/workflows/ci.yml`
- Acceptance: Pipeline runs green on push. Failed lint, typecheck, or test blocks merge.
- Reqs: —

**TASK-007: Shared Type Definitions**
- Depends on: TASK-001
- Size: S
- Description: Implement all TypeScript interfaces in `lib/types.ts` as defined in Section 4.2 of this spec: `ArticleResult`, `ExtractionResult`, `PageMetadata`, `ExtractionFailure`, `ImageAsset`, `ImageMap`, `TextBundleContents`, `ArchiveResponse`. These are the contracts between all pipeline modules. Export all types.
- Files: `lib/types.ts`
- Acceptance: `npm run typecheck` passes. All interfaces match Section 4.2 exactly.
- Reqs: —

### Phase 2: Content Extraction (TDD)

**TASK-008: Lazy Image Resolver**
- Depends on: TASK-004, TASK-007
- Size: M
- Description: Write tests first (`tests/lazy-image-resolver.test.ts`), then implement `lib/lazy-image-resolver.ts`. The module exports a function `resolveLazyImages(document: Document): void` that mutates the document in place. For each `<img>` element, check (in order): `data-src`, `data-lazy-src`, `data-original`, and if `src` is a placeholder (1x1 pixel data URI or empty). If a lazy attribute is found, set `src` to its value. For `srcset` attributes, parse the descriptor list and pick the URL with the largest width or pixel density descriptor, set it as `src`. Handle `<picture>` elements: find the first `<source>` with a `srcset` and resolve similarly, setting the fallback `<img>` `src`. Leave already-loaded images (normal `src`, no lazy attributes) unchanged.
- Files: `lib/lazy-image-resolver.ts`, `tests/lazy-image-resolver.test.ts`
- Acceptance: Tests pass for: `data-src` resolution, `srcset` parsing (picks largest width), `<picture>` with `<source>`, placeholder `src` replacement, already-loaded images left unchanged. Uses `lazy-images.html` fixture.
- Reqs: FR-001

**TASK-009: Readability Runner**
- Depends on: TASK-008
- Size: M
- Description: Write tests first (`tests/readability-runner.test.ts`), then implement `lib/readability-runner.ts`. The module exports a function `extractArticle(document: Document): ArticleResult | null`. It clones the document (Readability mutates the DOM), runs `resolveLazyImages()` on the clone, then runs `new Readability(clone).parse()`. If Readability returns a result with non-empty `content`, return an `ArticleResult` object (mapping Readability's output to the interface defined in Section 4.2). If it returns null or empty content, return null. The function must not mutate the original document. Log (via logger) the extraction result: title, content length, image count.
- Files: `lib/readability-runner.ts`, `tests/readability-runner.test.ts`
- Acceptance: Extracts article content from `basic-article.html`, `mixed-content.html` fixtures. Returns null for `non-article.html` fixture. Does not mutate the input document. Logger emits info-level extraction summary.
- Reqs: FR-001

**TASK-010: Metadata Extractor**
- Depends on: TASK-004, TASK-007
- Size: M
- Description: Write tests first (`tests/metadata-extractor.test.ts`), then implement `lib/metadata-extractor.ts`. The module exports `extractMetadata(document: Document, url: string): PageMetadata`. Extraction cascade for each field:
  - `title`: `og:title` > `<title>` text content. Trim whitespace.
  - `author`: `<meta name="author">` content, `article:author`, JSON-LD `author.name` or `author` string. If multiple authors found, return as array.
  - `date`: `article:published_time`, `<meta name="date">`, first `<time datetime>` element, JSON-LD `datePublished`. Normalize to ISO 8601 via `new Date().toISOString()`.
  - `url`: passed as parameter.
  - `canonicalUrl`: `<link rel="canonical">` href. Resolve to absolute URL.
  - `siteName`: `og:site_name`, `<meta name="application-name">`.
  - `language`: `<html lang>` attribute, `og:locale`.
  - `description`: `og:description`, `<meta name="description">`.
  - `keywords`: `<meta name="keywords">` content, split on comma, trim each.
  - `ogImage`: `og:image` content. Resolve to absolute URL.
  - `ogType`: `og:type` content.

  Fields with no detected value are set to `null` (js-yaml will omit them from frontmatter in TASK-013).
- Files: `lib/metadata-extractor.ts`, `tests/metadata-extractor.test.ts`
- Acceptance: Tests pass using `og-metadata.html` (all fields extracted) and `minimal-metadata.html` (only title and url present, rest null). Author array handled. Dates normalized to ISO 8601. Keywords split into array. Invalid dates handled gracefully (set to null, log warning).
- Reqs: FR-003

### Phase 3: Markdown Conversion (TDD)

**TASK-011: Turndown Base Configuration**
- Depends on: TASK-004, TASK-007
- Size: S
- Description: Write tests first (`tests/markdown-converter.test.ts` — base tests), then implement `lib/markdown-converter.ts`. Initialize Turndown with GFM plugin. Configuration: `headingStyle: "atx"`, `hr: "---"`, `bulletListMarker: "-"`, `codeBlockStyle: "fenced"`. Set the default link rule to preserve absolute URLs. Export a function `convertToMarkdown(html: string): { markdown: string; imageMap: ImageMap }`. The `imageMap` is populated by the image rewriting rule (TASK-012c). For this task, only the base configuration is set up; custom rules are added in subsequent tasks.
- Files: `lib/markdown-converter.ts`, `tests/markdown-converter.test.ts` (base tests)
- Acceptance: Converts `basic-article.html` content to Markdown matching `basic-article.expected.md` golden file. Headings, paragraphs, bold, italic, links, lists, code blocks, blockquotes, horizontal rules all convert correctly. External link URLs are preserved as absolute.
- Reqs: FR-002

**TASK-012a: Custom Turndown Rules — HTML Preservation**
- Depends on: TASK-011
- Size: S
- Description: Write tests first (extend `tests/markdown-converter.test.ts` with per-rule test groups), then add custom Turndown rules to `lib/markdown-converter.ts` for elements that should be preserved as inline HTML. Each rule is a Turndown `addRule()` call. Rules in this task:

  1. **Tables:** Override default table handling. Preserve `<table>` and all children as inline HTML. Do not convert to Markdown table syntax (too limited for complex structures with colspan/rowspan). Test with `html-table.html` → `html-table.expected.md`.

  2. **Details/Summary:** Preserve `<details>` and `<summary>` as inline HTML. Test with `details-summary.html` → `details-summary.expected.md`.

  3. **Sup/Sub:** Preserve `<sup>` and `<sub>` as inline HTML. Test with `sup-sub.html` → `sup-sub.expected.md`.

  4. **Embedded Video Iframes:** Preserve `<iframe>` elements (YouTube, Vimeo, or any `src` containing video hosting domains) as inline HTML. Test with `embedded-video.html` → `embedded-video.expected.md`.

  All golden file comparisons should normalize whitespace per Section 10.7 before comparison.
- Files: `lib/markdown-converter.ts`, `tests/markdown-converter.test.ts`
- Acceptance: Each rule has dedicated tests using its corresponding fixture and golden file. All existing base tests continue to pass.
- Reqs: FR-002

**TASK-012b: Custom Turndown Rules — Figures & Image Rewriting**
- Depends on: TASK-012a
- Size: M
- Description: Write tests first, then add custom Turndown rules for figure handling and image source rewriting. Rules in this task:

  1. **Figures:** Convert `<figure>` containing `<img>` and `<figcaption>` to inline HTML `<figure>` block. The `<img>` `src` within the figure should be rewritten to `assets/` path. Test with `figure-caption.html` → `figure-caption.expected.md`.

  2. **Image Source Rewriting:** For `<img>` elements NOT inside a `<figure>` (figures handled by rule 1), rewrite `src` to `assets/{filename}` path. Generate sequential filenames: `image-001.{ext}`, `image-002.{ext}`, etc., always zero-padded to 3 digits. Determine extension from URL path (fallback to `.jpg` if undetermined). Populate the `imageMap` (keyed by original URL, value is `assets/{filename}`). Deduplicate: if the same URL appears twice, reuse the same filename. Output: `![alt text](assets/image-001.jpg)`. For images inside `<figure>`, the rewriting happens within the figure's inline HTML `<img>` tag.

  The image counter is shared between standalone images and figure images — they draw from the same sequence. The `imageMap` is a closure-scoped variable within the `convertToMarkdown()` function, reset on each call.
- Files: `lib/markdown-converter.ts`, `tests/markdown-converter.test.ts`
- Acceptance: Figure tests pass against golden file. Image map correctly tracks URL → filename mappings. Duplicate image URLs map to the same filename. Images inside figures and standalone images share a single counter.
- Reqs: FR-002

**TASK-012c: Custom Turndown Rules — Asides & Admonitions**
- Depends on: TASK-012a
- Size: M
- Description: Write tests first, then add custom Turndown rules for `<aside>` elements. This is a separate task because the detection heuristics are non-trivial.

  **Aside-to-Admonition Conversion:** Convert `<aside>` elements to GitHub-style admonition blockquotes. The output format is:

  ```markdown
  > [!NOTE]
  > Content of the aside goes here.
  > Multiple lines are each prefixed with `> `.
  ```

  **Admonition type detection** (checked in this order, first match wins):
  1. **Class attribute:** Check if the element's `className` contains any of these exact words (case-insensitive word boundary match, not substring): `note`, `tip`, `warning`, `caution`, `important`. Example: `class="callout-note"` matches `note`; `class="denote"` does NOT match.
  2. **Role attribute:** Map `role="note"` → NOTE, `role="alert"` → WARNING.
  3. **First child heading or strong text:** If the aside's first child element is a heading (`<h1>`-`<h6>`) or `<strong>` containing one of the keywords (case-insensitive), use that keyword and strip the heading/strong from the content.
  4. **Default:** If no type can be determined, use `NOTE`.

  The aside's inner content is converted to Markdown (recursively through Turndown) before being wrapped in the blockquote prefix. This means inline formatting (bold, links, code) within the aside is preserved.

  Test with `aside-admonition.html` → `aside-admonition.expected.md`. The fixture should include at least 4 variants: class-based detection, role-based, heading-based, and default fallback.
- Files: `lib/markdown-converter.ts`, `tests/markdown-converter.test.ts`
- Acceptance: All 4 aside variants produce correct admonition blockquotes. Detection precedence is correct (class wins over role wins over heading). Default fallback produces `> [!NOTE]`. Inner content formatting is preserved.
- Reqs: FR-002

### Phase 4: Image Pipeline & Packaging (TDD)

**TASK-013: Frontmatter Builder**
- Depends on: TASK-007
- Size: S
- Description: Write tests first (`tests/frontmatter-builder.test.ts`), then implement `lib/frontmatter-builder.ts`. Export a function `buildFrontmatter(metadata: PageMetadata, textContent: string, now?: Date): string`. The function:
  - Computes `word_count` from `textContent` (split on whitespace, count non-empty tokens). Cap input at 1MB to prevent hangs on extremely large documents.
  - Sets `archived_at` to `now.toISOString()` (defaults to `new Date()` if `now` is not provided). The `now` parameter exists for testability.
  - Constructs a plain object with all non-null metadata fields plus `word_count` and `archived_at`.
  - Uses `js-yaml.dump()` to serialize the object.
  - Wraps in `---\n` delimiters.
  - Omits fields whose value is `null` or `undefined`.
  - Uses `lineWidth: -1` in js-yaml options to prevent line wrapping.
- Files: `lib/frontmatter-builder.ts`, `tests/frontmatter-builder.test.ts`
- Acceptance: Output is valid YAML between `---` delimiters. Required fields (`title`, `url`, `word_count`, `archived_at`) always present. Optional fields omitted when null. `keywords` and multi-author fields rendered as YAML arrays. Special characters (colons, quotes, newlines in titles) properly escaped by js-yaml. Word count is accurate.
- Reqs: FR-003

**TASK-014: Image Downloader**
- Depends on: TASK-007, TASK-002
- Size: M
- Description: Write tests first (`tests/image-downloader.test.ts`), then implement `lib/image-downloader.ts`. Export a function `downloadImages(imageMap: ImageMap): Promise<ImageAsset[]>`. The function:
  - Takes the `imageMap` from `convertToMarkdown()` (original URL → `assets/filename`).
  - Downloads each unique URL using `fetch(url, { credentials: "include", mode: "cors" })`. The `credentials: "include"` ensures the browser sends cookies for the target domain, enabling access to images behind authentication (FR-004 AC5).
  - Limits concurrency to 4 simultaneous downloads (use a simple semaphore/pool pattern — no external dependency).
  - For each successful download: read response as `ArrayBuffer`, detect MIME type from `Content-Type` header, create `ImageAsset` with `failed: false`.
  - For each failed download (network error, non-2xx status, timeout, CORS error): create `ImageAsset` with `failed: true`, log a warning via logger including the URL and error reason.
  - Deduplicate: same URL is fetched only once even if it appears multiple times in the map.
  - Timeout: 30 seconds per image (use `AbortController`).

  **Cross-browser note (DA-02):** If `fetch()` from the service worker does not send cookies in Chrome MV3, the mitigation is to route image downloads through the content script via message passing: background sends image URLs to content script, content script fetches with cookies, sends ArrayBuffers back. This is a known risk; implement the service worker fetch first, add the content script fallback only if testing reveals cookie issues.

  Tests must mock `fetch()` (Vitest's `vi.fn()` or `vi.stubGlobal()`). Test scenarios:
  - Successful download (verify ArrayBuffer and MIME type).
  - 404 error (produces `failed: true` asset).
  - Network timeout (produces `failed: true` asset).
  - Concurrent limiting: mock `fetch()` to return promises that resolve after a delay; submit 8 images; verify that at most 4 are in-flight simultaneously by tracking active count.
  - Deduplication: same URL appears twice in imageMap; verify only one fetch call made.
  - Verify `credentials: "include"` is passed to `fetch()`.
- Files: `lib/image-downloader.ts`, `tests/image-downloader.test.ts`
- Acceptance: Downloads images concurrently with limit of 4. Failed downloads produce `ImageAsset` with `failed: true` and a logger warning. Successful downloads preserve original format. Deduplication works. `fetch()` is called with `credentials: "include"`. No real network calls in tests.
- Reqs: FR-004, NFR-002, NFR-005

**TASK-014a: Image Patcher**
- Depends on: TASK-007
- Size: S
- Description: Write tests first (`tests/image-patcher.test.ts`), then implement `lib/image-patcher.ts`. Export a function `patchFailedImageUrls(markdown: string, imageMap: ImageMap, failedAssets: ImageAsset[]): string`. For each failed asset, find its `assets/image-NNN.ext` filename in the imageMap (by matching `originalUrl`), then replace all occurrences of that filename in the markdown string with the original absolute URL. This handles both `![alt](assets/image-001.jpg)` in Markdown and `<img src="assets/image-001.jpg">` in inline HTML `<figure>` blocks, since the filename string is unique and deterministic.

  ```typescript
  // Pseudocode
  let patched = markdown;
  for (const asset of failedAssets) {
    patched = patched.replaceAll(asset.filename, asset.originalUrl);
  }
  return patched;
  ```

  Tests:
  - No failed assets → markdown unchanged.
  - One failed asset in standalone image → `![alt](assets/image-002.jpg)` becomes `![alt](https://example.com/photo.jpg)`.
  - One failed asset inside `<figure>` inline HTML → `<img src="assets/image-001.jpg">` becomes `<img src="https://example.com/hero.jpg">`.
  - Multiple failed assets → all patched correctly.
  - Successful assets → their `assets/` paths are NOT modified.
- Files: `lib/image-patcher.ts`, `tests/image-patcher.test.ts`
- Acceptance: Failed image references reverted to absolute URLs. Successful image references unchanged. Works for both Markdown image syntax and inline HTML img tags.
- Reqs: FR-004, NFR-005

**TASK-014b: Slug Generator**
- Depends on: TASK-001
- Size: S
- Description: Write tests first (`tests/slug.test.ts`), then implement `lib/slug.ts`. Export a function `slugify(title: string, fallback?: string): string` that implements the slug generation algorithm defined in Section 4.7. Also export `generateFilename(title: string, date: string | null, fallback?: string): string` that produces the full `{YYYY-MM-DD}-{slug}.textpack` filename. If `date` is null, use today's date. If the slug is empty after processing (e.g., all-unicode title with no transliterable characters), use the `fallback` parameter (typically derived from the page's hostname).

  Tests:
  - `"Hello & World!?"` → `hello-world`
  - `"Rust's Ownership Model: A Deep Dive"` → `rust-s-ownership-model-a-deep-dive`
  - Very long title (100+ chars) → truncated to 80 chars, no trailing hyphen
  - `"Simple Title"` with date `"2026-02-14"` → `2026-02-14-simple-title.textpack`
  - `"Simple Title"` with date `null` → `{today}-simple-title.textpack`
  - Empty/all-unicode title with fallback `"example-com"` → `{date}-example-com.textpack`
- Files: `lib/slug.ts`, `tests/slug.test.ts`
- Acceptance: All test cases pass. Slug output matches Section 4.7 algorithm exactly.
- Reqs: FR-005

**TASK-015: Bundle Packager**
- Depends on: TASK-012b, TASK-013, TASK-014b
- Size: M
- Description: Write tests first (`tests/bundle-packager.test.ts`), then implement `lib/bundle-packager.ts`. Export a function `packageBundle(frontmatter: string, markdownBody: string, assets: ImageAsset[], sourceUrl: string, title: string, date: string | null): Promise<{ blob: Blob; filename: string }>`. The function:
  - Combines `frontmatter + "\n" + markdownBody` into `text.md` content.
  - Generates `info.json` per TextBundle v2 spec (Section 4.4), including `sourceURL` set to `sourceUrl`.
  - Uses JSZip to create a zip archive containing:
    - `info.json` at root
    - `text.md` at root
    - `assets/{filename}` for each non-failed `ImageAsset`
  - All filenames inside the zip must be lowercase.
  - Uses `generateFilename()` from `lib/slug.ts` for the output filename.
  - Returns the zip as a `Blob` and the filename.

  Tests: verify zip contains expected files, verify `info.json` content, verify `text.md` content, verify filenames are lowercase, verify filename pattern. Use JSZip to read back the generated zip in tests.
- Files: `lib/bundle-packager.ts`, `tests/bundle-packager.test.ts`
- Acceptance: Output is a valid zip. Contains `info.json` (valid TextBundle v2), `text.md` (UTF-8 Markdown with frontmatter), and `assets/` with images. Failed images excluded from zip. All filenames lowercase. Output filename matches `{YYYY-MM-DD}-{slug}.textpack` pattern.
- Reqs: FR-005, NFR-006

**TASK-016: Download Trigger**
- Depends on: TASK-001
- Size: S
- Description: Implement `lib/download-trigger.ts`. Export a function `triggerDownload(blob: Blob, filename: string): Promise<void>`. The function:
  - Attempts to create an object URL via `URL.createObjectURL(blob)`.
  - If `URL.createObjectURL` is available (Firefox, Chrome 116+): calls `browser.downloads.download({ url: objectUrl, filename, saveAs: false })`, then revokes the object URL after the download starts via `browser.downloads.onChanged` listener (revoke when state changes to `in_progress` or `complete`). Do NOT use a timeout for revocation — use the event listener to ensure the URL remains valid until the download begins.
  - If `URL.createObjectURL` is not available (older Chrome service workers): convert the blob to a data URL as fallback, then pass that to `browser.downloads.download()`.
  - Returns a promise that resolves when the download is initiated.

  This module is thin and browser-API-dependent. It cannot be meaningfully unit tested without mocking browser APIs. Skip unit tests; covered by manual testing and integration tests in Phase 6.
- Files: `lib/download-trigger.ts`
- Acceptance: In a loaded extension, calling `triggerDownload()` with a blob and filename results in a file appearing in the browser's downloads with the correct filename. Works in both Firefox and Chrome.
- Reqs: FR-005, INT-003

### Phase 5: Extension Wiring

**TASK-017: Content Script Orchestrator**
- Depends on: TASK-009, TASK-010
- Size: S
- Description: Implement `entrypoints/content.ts` using WXT's content script entrypoint conventions. The content script:
  - Listens for a message from the background script (trigger signal).
  - On trigger: run `extractMetadata()` on the live DOM, clone the document, run `extractArticle()` on the clone.
  - If extraction succeeds: send `ExtractionResult` message to background via `browser.runtime.sendMessage()`.
  - If extraction fails (returns null): send `ExtractionFailure` message to background.
  - Log extraction timing and result via logger.

  WXT content script configuration (inline in the file):
  ```typescript
  export default defineContentScript({
    matches: ["<all_urls>"],
    runAt: "document_idle",
  });
  ```
  Note: Despite `matches: ["<all_urls>"]`, the content script is only injected on-demand via `browser.scripting.executeScript()` from the background. The `matches` field is required by WXT but does not cause automatic injection when using programmatic injection.
- Files: `entrypoints/content.ts`
- Acceptance: Content script responds to trigger message. Sends well-typed `ExtractionResult` or `ExtractionFailure` to background.
- Reqs: FR-001, FR-003, FR-009

**TASK-018a: Background Script — Trigger & Injection**
- Depends on: TASK-017
- Size: S
- Description: Implement the trigger and content script injection portion of `entrypoints/background.ts` using WXT's background entrypoint conventions. This task sets up:
  1. The `browser.action.onClicked` listener: on toolbar button click, inject the content script into the active tab via `browser.scripting.executeScript()`, then send a trigger message to the content script.
  2. The `browser.contextMenus.create()` call during `runtime.onInstalled` to register the "Archive Page as TextBundle" context menu item (`{ id: "archive-page", title: "Archive Page as TextBundle", contexts: ["page"] }`).
  3. The `browser.contextMenus.onClicked` listener: triggers the same injection logic as the toolbar button.
  4. A shared `archivePage(tabId: number)` function that both triggers call, which handles injection and message sending.

  At this stage, the background script injects and triggers the content script but does not yet handle the response. Incoming messages are logged but not processed.
- Files: `entrypoints/background.ts`
- Acceptance: Toolbar button click injects content script and sends trigger. Context menu item appears and triggers the same flow. No duplicate code between triggers.
- Reqs: FR-006, FR-007

**TASK-018b: Background Script — Pipeline Orchestration**
- Depends on: TASK-018a, TASK-014, TASK-014a, TASK-015, TASK-016
- Size: M
- Description: Add the pipeline orchestration logic to `entrypoints/background.ts`. The background script listens for messages from the content script and runs the full conversion pipeline:
  1. Listen for `ExtractionResult` messages (type: `"archive-page"`).
  2. On receipt:
     a. Run `convertToMarkdown(article.content)` → get `markdown` and `imageMap`.
     b. Run `downloadImages(imageMap)` → get `ImageAsset[]`.
     c. Separate failed assets: `failedAssets = assets.filter(a => a.failed)`.
     d. Run `patchFailedImageUrls(markdown, imageMap, failedAssets)` → get `patchedMarkdown`.
     e. Run `buildFrontmatter(metadata, article.textContent)` → get `frontmatter`.
     f. Run `packageBundle(frontmatter, patchedMarkdown, assets.filter(a => !a.failed), sourceUrl, metadata.title, metadata.date)` → get `blob` and `filename`.
     g. Run `triggerDownload(blob, filename)`.
  3. Log pipeline timing (total time from message receipt to download trigger) via logger. Log per-stage durations at debug level.
  4. Return `{ success: true, filename }` or `{ success: false, error }` to the caller.
  5. Wrap the entire pipeline in a try/catch. On any unexpected error: log the error with full stack trace, return `{ success: false, error: "An unexpected error occurred while archiving this page." }`.

  Error handling categories:
  - `convertToMarkdown()` throws → unexpected error, abort pipeline.
  - `downloadImages()` rejects → unexpected error, abort pipeline. (Individual image failures are handled internally; this is for total failure.)
  - `packageBundle()` rejects → unexpected error (e.g., JSZip failure), abort pipeline.
  - `triggerDownload()` rejects → download API error, report to user.
- Files: `entrypoints/background.ts`
- Acceptance: Full pipeline from ExtractionResult to download trigger. Failed images patched correctly. Error handling catches all failure modes.
- Reqs: FR-006

**TASK-018c: Background Script — UI Feedback**
- Depends on: TASK-018b
- Size: S
- Description: Add badge state management and notification display to `entrypoints/background.ts`. This wraps the pipeline orchestration with user-facing feedback:
  1. Before pipeline starts: `browser.action.setBadgeText({ text: "..." })` and `browser.action.setBadgeBackgroundColor({ color: "#4A90D9" })`.
  2. On success: `browser.action.setBadgeText({ text: "OK" })`, then `setTimeout(() => browser.action.setBadgeText({ text: "" }), 3000)`. Show notification: `browser.notifications.create({ type: "basic", title: "TextBundler", message: "Archived: {title}" })`.
  3. On `ExtractionFailure` message: `browser.action.setBadgeText({ text: "!" })`, `browser.action.setBadgeBackgroundColor({ color: "#D94A4A" })`, then `setTimeout(() => browser.action.setBadgeText({ text: "" }), 5000)`. Show notification: `"Could not extract content from this page."`.
  4. On unexpected pipeline error: same as extraction failure, but message is the error string from TASK-018b.
  5. Ensure only one pipeline runs at a time per tab. If user clicks while processing, ignore the second click (or show "Already processing" badge).
- Files: `entrypoints/background.ts`
- Acceptance: Badge shows "..." during processing, "OK" on success (clears after 3s), "!" on failure (clears after 5s). Notifications display on success and failure. Concurrent clicks on same tab are handled gracefully.
- Reqs: FR-006, FR-009

**TASK-019: Extension Icons**
- Depends on: TASK-001
- Size: S
- Description: Create extension icons in `public/icons/`: `icon-16.png`, `icon-32.png`, `icon-48.png`, `icon-128.png`. The icon should be a simple, recognizable symbol suggesting archival or download (e.g., a document with a down arrow, or a bundle/package icon). Use a flat, monochrome design that works at small sizes. If icon design is not available, create minimal placeholder icons (solid colored square with a letter "T") and document the need for proper icons.
- Files: `public/icons/icon-16.png`, `public/icons/icon-32.png`, `public/icons/icon-48.png`, `public/icons/icon-128.png`
- Acceptance: Icons appear in the toolbar and extension management page. Visually distinguishable at 16px.
- Reqs: FR-006

### Phase 6: Integration Testing

**TASK-020: Full Pipeline Integration Tests**
- Depends on: TASK-018c
- Size: L
- Description: Write `tests/pipeline.test.ts`. Test the core pipeline (content extraction → Markdown conversion → image patching → frontmatter → packaging) end-to-end using Tier 1 fixtures. For each fixture that represents a complete article (`mixed-content.html`):
  1. Parse HTML with linkedom.
  2. Run `extractArticle()` and `extractMetadata()`.
  3. Run `convertToMarkdown()` on the extracted HTML.
  4. Mock `fetch()` for image downloads. Return small test images for most URLs; return 404 for one URL to test the failure/patching path.
  5. Run `downloadImages()`.
  6. Run `patchFailedImageUrls()` for any failed assets.
  7. Run `buildFrontmatter()`.
  8. Run `packageBundle()`.
  9. Verify the resulting zip: valid structure, `info.json` correct, `text.md` contains frontmatter + Markdown, `assets/` contains expected images (minus the failed one).
  10. Verify failed image's reference in `text.md` is the original absolute URL.
  11. Verify no nav/sidebar/footer content leaked into the Markdown.
  12. Verify frontmatter has required fields.

  Also test the failure path: parse `non-article.html` fixture, verify `extractArticle()` returns null.
- Files: `tests/pipeline.test.ts`
- Acceptance: All integration tests pass. Pipeline produces valid `.textpack` content from fixtures. Failed image patching works end-to-end. Failure case handled correctly.
- Reqs: FR-001, FR-002, FR-003, FR-004, FR-005

**TASK-021: Tier 2 Corpus Smoke Tests**
- Depends on: TASK-005, TASK-020
- Size: M
- Description: Write `tests/sites.test.ts`. This test file is conditionally skipped if Tier 2 fixtures are not present (`tests/sites/` is empty or contains only `.gitkeep`). When fixtures are present, for each downloaded HTML file:
  1. Parse with linkedom.
  2. Run `extractArticle()` — assert it returns non-null for article pages, null for known non-article pages (`19-hn-comments.html`, `20-github-search.html`).
  3. For article pages: run `extractMetadata()` — assert `title` and `url` are present.
  4. For article pages: run `convertToMarkdown()` — assert output is non-empty, contains no `<nav>`, `<header>`, `<footer>` tags.
  5. For article pages: run `buildFrontmatter()` — assert valid YAML.

  These are smoke tests, not golden-file tests. They verify the pipeline doesn't crash or produce obviously wrong output on real-world pages. No network calls.

  Add an npm script: `"test:sites": "vitest run tests/sites.test.ts"` for running Tier 2 tests separately.
- Files: `tests/sites.test.ts`, `package.json` (add script)
- Acceptance: When Tier 2 fixtures are present, smoke tests pass for all article pages. Non-article pages correctly return null from extraction. When fixtures are absent, tests are skipped (not failed). No network calls.
- Reqs: FR-001, FR-002, FR-003

### 7.3 Dependency Graph

```text
TASK-001 ──► TASK-002 ──────────────────────────────────────────► TASK-014
  │
  ├──► TASK-003 ──► TASK-004 ──► TASK-008 ──► TASK-009 ──────────► TASK-017 ──► TASK-018a
  │                   │                                                            │
  │                   ├──► TASK-010 ──────────────────────────────► TASK-017        │
  │                   │                                                            │
  │                   ├──► TASK-011 ──► TASK-012a ──► TASK-012b ──► TASK-015        │
  │                   │                    │                          ▲             │
  │                   │                    └──► TASK-012c             │             │
  │                   │                                              │             │
  │                   └──► (golden files for 012a/b/c)               │             │
  │                                                                  │             ▼
  ├──► TASK-005 ───────────────────────────────────────────────────────────────► TASK-021
  │                                                                  │
  ├──► TASK-006                                                      │
  │                                                                  │
  ├──► TASK-007 ──► TASK-008, TASK-010, TASK-011, TASK-013, TASK-014, TASK-014a
  │                                                                  │
  ├──► TASK-013 ─────────────────────────────────────────────────► TASK-015
  │                                                                  │
  ├──► TASK-014 ──────────────────────────────────────────────────────────────► TASK-018b
  │                                                                  │             │
  ├──► TASK-014a ─────────────────────────────────────────────────────────────► TASK-018b
  │                                                                  │             │
  ├──► TASK-014b ─────────────────────────────────────────────────► TASK-015        │
  │                                                                                │
  ├──► TASK-015 ──────────────────────────────────────────────────────────────► TASK-018b
  │                                                                                │
  ├──► TASK-016 ──────────────────────────────────────────────────────────────► TASK-018b
  │                                                                                │
  └──► TASK-019                                                                    │
                                                                                   ▼
                                                                     TASK-018c ──► TASK-020 ──► TASK-021

Critical path: 001 → 003 → 004 → 011 → 012a → 012b → 015 → 018b → 018c → 020
```

### 7.4 Risk-Ordered Priorities

| Risk | Task(s) | Why Front-Loaded |
|---|---|---|
| linkedom + Readability compatibility | TASK-003 | The Readability canary test in TASK-003 validates the entire test architecture. If linkedom doesn't work with Readability, we must switch to JSDOM before any extraction tasks begin. |
| Test infrastructure works for agents | TASK-001, 002, 003, 004 | If the test setup is broken, all subsequent TDD tasks are blocked. Agents must be able to run `npm test` from TASK-004 onward. |
| Readability extraction quality | TASK-008, 009 | If Readability doesn't work well enough on fixtures, the whole product fails. Validate early with Tier 1 fixtures. |
| Turndown custom rules complexity | TASK-012a, 012b, 012c | Custom rules are the riskiest conversion logic. Golden file tests catch regressions. Split into 3 tasks to isolate failures. |
| Image download with cookies | TASK-014 | `fetch()` from service worker with `credentials: "include"` — verify this works for auth'd images. DA-02 risk with concrete mitigation path. |
| Failed image URL patching | TASK-014a | The `patchFailedImageUrls()` function is critical for NFR-005 (graceful degradation). Must work for both Markdown and inline HTML image references. |
| JSZip in service worker | TASK-015 | Confirm JSZip works in service worker context (no DOM dependency). |

---

## 8. Design Assumptions

| ID | Assumption | Based On | Risk if Wrong | Mitigation |
|---|---|---|---|---|
| DA-01 | `browser.scripting.executeScript()` can inject bundled content script from service worker in both Firefox and Chrome. WXT handles the MV2/MV3 abstraction for this. | WXT docs, MV3 spec | Would need to declare content script in manifest with `<all_urls>`, increasing permission scope. | Fall back to manifest-declared content scripts with `<all_urls>` permission. |
| DA-02 | `fetch()` from service worker sends cookies for the target domain (for auth'd image downloads) when using `credentials: "include"`. | Browser fetch spec | Chrome MV3 service workers may not forward cookies consistently for cross-origin requests. | Route image downloads through the content script via message passing: background sends URLs to content script, content script fetches (has page cookies), sends ArrayBuffers back. Implement service worker fetch first; add content script fallback if testing reveals issues. |
| DA-03 | JSZip works in service worker context (no DOM APIs required). | JSZip docs claim no DOM dependency | Would need to run packaging in content script or offscreen document. | Use Chrome's offscreen document API as fallback for JSZip operations. |
| DA-04 | Readability can run on a cloned document or a linkedom-parsed document without degraded extraction quality. | Readability operates primarily on body content and text heuristics. | linkedom lacks layout properties (`offsetHeight`, `offsetWidth`, computed styles) that Readability may use in scoring. Extraction results in tests may differ from production. | TASK-003 includes a Readability canary test. If linkedom fails, switch to JSDOM. Accept that test results are an approximation — real browser testing validates production behavior. The Tier 1 fixtures are designed to have strong article signals that don't depend on layout scoring. |
| DA-05 | Single content script injection captures fully-rendered DOM including SPA content. Content scripts see the rendered DOM. | WebExtensions spec | Some SPAs may need delayed injection or mutation observers (A-007). Addressed by Phase 2 manual selection (FR-010). | Phase 2 FR-010 provides manual content selection as fallback. |
| DA-06 | WXT's `@wxt-dev/browser` provides full API coverage for `scripting`, `action`, `contextMenus`, `downloads`, and `notifications` across Firefox and Chrome. | WXT documentation | May need to use raw `chrome.*` APIs for specific calls. | WXT has an active community and frequent releases; file issues for missing APIs. |
| DA-07 | linkedom parses real-world HTML accurately enough for Readability to produce results comparable to browser DOM parsing. | linkedom documentation, usage in WXT itself | Readability may rely on DOM properties not implemented by linkedom. Test results may give false confidence. | Tier 1 fixtures are curated with strong article signals. Tier 2 smoke tests accept minor deviations. Real browser manual testing validates production. TASK-003 canary test catches fundamental incompatibility early. |
| DA-08 | `wget` captures server-rendered HTML accurately for article-style sites (news, blogs, Wikipedia, MDN). | Article sites are primarily server-rendered | JS-rendered SPAs will have incomplete HTML. This is acceptable — SPAs are explicitly edge cases (OQ-007, R-001). | Tier 2 corpus focuses on server-rendered sites. SPA handling deferred to Phase 2 (FR-010). |

---

## 9. Design Decisions & Trade-offs

| ID | Decision | Alternatives Considered | Rationale | Reqs |
|---|---|---|---|---|
| DD-01 | TypeScript + build step over vanilla JS | Vanilla JS (no build) | Type safety for complex data transformations (metadata objects, YAML, zip structures) outweighs build step cost. WXT provides the build tooling anyway. | NFR-009, OQ-001 |
| DD-02 | WXT over manual esbuild + webextension-polyfill + manifest | esbuild + webextension-polyfill + hand-written manifest.json | WXT replaces three separate tools with one. Handles MV2/MV3 per-browser, file-based manifest generation, HMR dev mode, and zip packaging. The leading extension framework in 2025-2026. | NFR-003, NFR-004, NFR-009 |
| DD-03 | `activeTab` + programmatic injection over `<all_urls>` + manifest content scripts | `<all_urls>` with `content_scripts` in manifest | Minimal permissions, easier store review (R-008), no injection overhead on every page load. | R-008 |
| DD-04 | js-yaml over hand-rolled YAML builder | Custom ~50-line string builder | Eliminates escaping bugs for edge cases (colons in titles, multi-line descriptions, unicode). ~30KB bundle cost is acceptable. | FR-003 |
| DD-05 | Inline HTML `<figure>` blocks for captions over italicized text | `![alt](img)\n*caption*` pattern | User preference. Semantically precise. Preserves the figure/figcaption relationship. | FR-002, OQ-005 |
| DD-06 | Sequential image filenames (`image-001.jpg`) over content-hash filenames | SHA-based filenames (e.g., `a1b2c3d4.jpg`) | Sequential names are human-readable and predictable. Collision risk is zero within a single archive. Easier to debug. Always 3-digit zero-padded. | FR-004 |
| DD-07 | Two-tier test fixtures (curated in-git + downloaded gitignored) over single approach | All fixtures in git, or all downloaded | Tier 1 (in git) ensures agents can run `npm test` immediately without setup. Tier 2 (downloaded) provides real-world validation without bloating the repo. | — |
| DD-08 | linkedom over JSDOM for test DOM parsing | JSDOM | linkedom is faster, lighter, and already a transitive dependency of WXT. Sufficient for Readability and metadata extraction testing. Canary test in TASK-003 validates compatibility. | — |
| DD-09 | Golden file testing for Markdown output over assertion-based testing | Inline string assertions in test files | Golden files make expected output reviewable, diffable, and easy to update when conversion logic changes intentionally. Catches regressions precisely. Conventions documented in Section 10.7 to ensure consistency. | FR-002 |
| DD-10 | 4 concurrent image downloads over 6 | 6 concurrent | Conservative limit avoids overwhelming origin servers or the browser's connection pool. Reduces risk of rate-limiting or IP blocking during real usage. | NFR-002, OQ-006 |
| DD-11 | TDD with test infrastructure first over code-first development | Implement features first, add tests later | Ensures every pipeline module is testable from the start. Agents can verify their changes via `npm test`. Prevents test debt. | — |
| DD-12 | Optimistic image URL rewriting with post-hoc patching over download-first approach | Download images before Markdown conversion; pass download results to converter | Optimistic rewriting keeps the converter stateless (it doesn't need to know about download results). Patching is a simple `replaceAll()` on unique, deterministic filenames. The alternative would couple the converter to the downloader, complicating both modules. | FR-004, NFR-005 |
| DD-13 | Split TASK-012 (7 rules) into 3 subtasks | Single large task | Each subtask is independently testable and reviewable. Isolates failures: a bug in aside detection doesn't block table preservation. Reduces cognitive load per task for agents. | FR-002 |

---

## 10. OpenSpec Execution Notes

### 10.1 Execution Order

Tasks MUST be executed in the order listed in Section 7.2. Each task's `Depends on` field defines hard prerequisites. Do not parallelize tasks that share dependencies. The critical path is: TASK-001 → 003 → 004 → 011 → 012a → 012b → 015 → 018b → 018c → 020.

### 10.2 Validation Gates

After each task, run `npm test` and `npm run typecheck`. Both must pass before proceeding to the next task. For tasks that add new test files, the new tests must pass. For tasks that modify existing code, all existing tests must continue to pass (no regressions).

### 10.3 Testing Strategy

- **Unit tests:** Each `lib/` module has a corresponding test file in `tests/`. Tests use linkedom for DOM parsing and Vitest mocks for browser APIs and `fetch()`.
- **Golden file tests:** Markdown conversion tests compare output against `.expected.md` files per Section 10.7 conventions.
- **Integration tests:** `tests/pipeline.test.ts` tests the full pipeline from HTML input to zip output. `tests/sites.test.ts` smoke-tests against real-world page snapshots.
- **No network calls in any test.** Image downloads are mocked. Tier 2 fixtures are pre-downloaded.
- **CLI-verifiable:** `npm test` is the single command. Output is clear pass/fail. No browser interaction needed.

### 10.4 Coding Conventions

- TypeScript strict mode enabled.
- All exports are named exports (no default exports).
- Module files export a single primary function matching the module name (e.g., `markdown-converter.ts` exports `convertToMarkdown()`).
- Error handling: functions return `null` for expected failures (e.g., Readability can't extract). Throw only for unexpected/programmer errors. `convertToMarkdown()` and `buildFrontmatter()` should throw on invalid input (empty HTML string, missing required metadata fields) — these indicate programmer error in the pipeline.
- Logger calls include the module name: `logger.info("readability-runner", "Extracted article", { title, length })`.
- All image filenames, bundle-internal filenames, and slug components are lowercase.
- Image filenames always use 3-digit zero-padded counters: `image-001.jpg`, not `image-1.jpg`.

### 10.5 Environment Variables

No environment variables required. The extension runs entirely in the browser with no external configuration. Build-time constants are handled by Vite's `define` in `wxt.config.ts`:

| Constant | Description | Dev Value | Prod Value |
|---|---|---|---|
| `__DEV__` | Development mode flag | `true` | `false` |

Used by the logger to enable/disable debug output.

### 10.6 File Structure

See Section 6.2 for the complete project structure.

### 10.7 Golden File Conventions

**IMPORTANT: Review this section before creating any golden files (TASK-004). The conventions established here govern all Markdown conversion tests.**

Golden files (`.expected.md`) contain the exact expected Markdown output for a given HTML fixture, following these formatting rules:

**Whitespace:**
- One blank line between block-level elements (headings, paragraphs, lists, code blocks, blockquotes).
- No trailing whitespace on any line.
- Line endings: LF only (`\n`), never `\r\n`.
- File ends with a single trailing newline.
- Nested list indentation: 4 spaces (Turndown default).

**Image references:**
- Standalone images: `![alt text](assets/image-001.jpg)`
- Images inside figures: `<figure><img src="assets/image-001.jpg" alt="alt text"><figcaption>Caption</figcaption></figure>`
- Counter always 3-digit zero-padded: `001`, `002`, ..., `010`, ..., `100`.

**Inline HTML blocks:**
- Tables, details/summary, sup/sub, figures, and video iframes are preserved as inline HTML.
- Inline HTML is separated from surrounding Markdown by blank lines.
- The HTML is not reformatted or pretty-printed — preserve the structure Turndown produces.

**Admonition blockquotes:**
- Format: `> [!TYPE]` followed by `> content` on subsequent lines.
- Separated from surrounding content by blank lines.

**Comparison in tests:**
- Before comparing, normalize both actual and expected output:
  1. Strip trailing whitespace from each line.
  2. Normalize line endings to `\n`.
  3. Ensure exactly one trailing newline.
- Use a `normalizeMarkdown(str: string): string` helper function in `tests/helpers/` for this.

**Example golden file (`basic-article.expected.md`):**

```markdown
# Main Heading

Paragraph with **bold** and *italic* text and a [link](https://example.com).

## Subheading

- Item one
- Item two
- Item three

1. First
2. Second
3. Third

> This is a blockquote.

---

```javascript
function hello() {
  console.log("world");
}
```

Inline `code` in a paragraph.
```

---

## 11. Glossary

| Term | Definition |
|---|---|
| TextBundle | An open file format for exchanging Markdown or plain text documents with associated assets. Defined at textbundle.org. |
| .textpack | The compressed (zip) variant of a TextBundle. |
| .textbundle | The uncompressed (directory) variant of a TextBundle. |
| Readability | Mozilla's content extraction library, used in Firefox Reader View. Identifies the main article content of a web page. |
| Turndown | A JavaScript library that converts HTML to Markdown. |
| Frontmatter | YAML metadata block at the top of a Markdown file, delimited by `---`. |
| Open Graph (OG) | A protocol for structured metadata in HTML `<meta>` tags, originally created by Facebook. Used for link previews. |
| Lazy loading | A technique where images are not loaded until they enter the viewport. Image URLs are stored in `data-*` attributes instead of `src`. |
| Admonition | A styled callout block in Markdown (e.g., `> [!NOTE]`, `> [!TIP]`), popularized by GitHub-flavored Markdown. |
| WebExtensions | The cross-browser API standard for building browser extensions, supported by Firefox, Chrome, Edge, and others. |
| WXT | Next-generation web extension framework. Provides file-based manifest generation, cross-browser builds, Vite-powered dev mode, and packaging tools. |
| Golden file | A test artifact containing the expected output of a transformation. Tests compare actual output against the golden file to detect regressions. |
| linkedom | A lightweight DOM implementation for Node.js. Used in tests to parse HTML fixtures into Document objects without a browser. |
| MVP | Minimum Viable Product — the smallest set of features that delivers core value. |
| Tier 1 fixtures | Curated HTML test fixtures checked into git. Small, targeted, always available. |
| Tier 2 fixtures | Full-page HTML snapshots downloaded from real websites. Gitignored. Used for smoke testing. |
| MV3 / MV2 | Manifest V3 / Manifest V2 — versions of the WebExtensions manifest format. Chrome requires MV3; Firefox supports both. |

---

## Document History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-02-14 | Solution Architect | Initial spec |
| 1.1 | 2026-02-14 | Solution Architect | Address review feedback: add ArticleResult type (Section 4.2); restructure pipeline with optimistic image rewriting + post-hoc patching for failed images (Section 4.3, DD-12); add service worker lifetime analysis (Section 2.4); split TASK-012 into 012a/012b/012c (DD-13); split TASK-018 into 018a/018b/018c; add TASK-014a (image patcher) and TASK-014b (slug generator); add Readability canary test to TASK-003 (DA-04, DA-07); add non-article fixture to TASK-004; expand Tier 2 corpus to 20 specific URLs (TASK-005); add `credentials: "include"` to image fetch with content-script fallback path (DA-02); add cross-browser blob URL handling to TASK-016; specify slug generation algorithm (Section 4.7); specify image filename padding (3-digit); add golden file conventions (Section 10.7); add concrete mitigations to all design assumptions (Section 8); fix TASK-015 dependencies (remove TASK-014, add TASK-014b); clarify aside/admonition detection rules with precedence (TASK-012c); add error handling categories to TASK-018b. |
