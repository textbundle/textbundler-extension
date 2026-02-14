# Requirements Document: TextBundler

**Version:** 1.1
**Date:** 2026-02-14
**Author:** Requirements Analyst (AI-Assisted)
**Status:** Draft
**Stakeholder(s):** Project Owner

---

## 1. Executive Summary

TextBundler is a cross-browser extension (Firefox and Chrome) that captures web pages as self-contained Markdown archives using the TextBundle format. Rather than producing pixel-perfect HTML copies, it extracts the main content of a page using reader-mode heuristics, converts it to Markdown with YAML frontmatter containing rich provenance metadata, downloads referenced content images, and packages everything as a zipped `.textpack` file. The goal is to enable fast, librarian-quality archival of web content for long-term preservation and reference. The project is developed under the TextBundle open-source organization at https://github.com/textbundle.

---

## 2. Business Context

### 2.1 Problem Statement

There is no convenient browser-native tool that produces clean, self-contained Markdown archives of web content with proper metadata and images. Existing solutions either save raw HTML (bloated, hard to search, coupled to original structure), produce lossy text-only copies, or require external services. Researchers, writers, and digital archivists need a one-click tool that captures the substance of a page — not its decoration — in a portable, future-proof format.

### 2.2 Business Objectives

- Enable one-click archival of web articles as portable, self-contained Markdown bundles.
- Preserve provenance metadata (author, date, source, open graph data) for each archived piece.
- Extract only meaningful content images, not decorative or layout elements.
- Produce output conforming to the open TextBundle specification for interoperability with editors and archival tools.

### 2.3 Success Criteria

- A user can visit any article-style web page, click one button, and receive a valid `.textpack` file containing clean Markdown, correct frontmatter metadata, and all content images.
- The Markdown is human-readable and accurately represents the article's content structure (headings, lists, links, tables, code blocks, images with captions).
- The extension works reliably on major content sites (news outlets, blogs, documentation sites, Wikipedia, Medium, Substack, etc.).

### 2.4 Background & Current State

- This is a greenfield project — no existing system is being replaced.
- The TextBundle specification (https://textbundle.org/spec/) defines the target format, specifically the `.textpack` (zipped) variant.
- Mozilla's Readability library (the engine behind Firefox Reader View) provides proven content-extraction heuristics.
- Turndown.js is the leading HTML-to-Markdown conversion library with an extensible plugin system.

---

## 3. Stakeholders & Users

| Role / Persona | Description | Key Needs | Access Level |
|---|---|---|---|
| Researcher / Writer | Knowledge workers who collect web references for later use | One-click archival, clean Markdown, searchable metadata | End user |
| Digital Archivist / Librarian | Users focused on long-term preservation of web content | Rich provenance metadata, portable format, image preservation | End user |
| Casual User | Anyone who wants to save an article for offline reading | Simple trigger, reliable output, no configuration needed | End user |
| Extension Developer | Team building and maintaining the extension | Clear requirements, testable acceptance criteria | Internal |
| Solution Architect | Designs the technical implementation | Unambiguous requirements, identified constraints, phasing clarity | Internal |

---

## 4. Functional Requirements

### 4.1 Content Extraction

**ID:** FR-001
**Description:** The extension must extract the main content area of a web page using reader-mode heuristics, isolating the article body from navigation, headers, footers, sidebars, and decorative elements.
**Trigger:** User activates the extension via toolbar button, context menu, or keyboard shortcut.
**Inputs:** The current page's DOM.
**Processing / Business Rules:**
- Use Mozilla Readability (or equivalent) to identify and extract the main content area.
- Strip navigation, site headers/footers, sidebars, ad containers, and non-content elements.
- Detect and resolve lazy-loaded images before extraction by inspecting `data-src`, `data-lazy-src`, `srcset`, and common lazy-loading attribute patterns.
**Outputs / Outcomes:** A cleaned HTML fragment representing only the article content, with all lazy-loaded image sources resolved to their actual URLs.
**Acceptance Criteria:**
- [ ] Successfully extracts the main content from at least 20 representative article pages (news, blog, documentation, Wikipedia, Medium, Substack).
- [ ] Does not include navigation menus, site headers/footers, sidebars, or ad content.
- [ ] Resolves lazy-loaded images so their actual source URLs are available for download.
- [ ] Returns a clear error when extraction fails (no silent empty output).
**Priority:** Must
**Notes:** The architecture must allow future replacement or augmentation of the extraction engine (see FR-010 for planned manual selection fallback).

### 4.2 HTML-to-Markdown Conversion

**ID:** FR-002
**Description:** The extension must convert the extracted HTML content to clean, well-structured Markdown.
**Trigger:** Successful content extraction (FR-001).
**Inputs:** Cleaned HTML fragment from extraction.
**Processing / Business Rules:**
- Convert standard HTML elements to their Markdown equivalents (headings, paragraphs, bold/italic, links, lists, code blocks with language annotations, blockquotes, horizontal rules).
- Preserve HTML tables as inline HTML (Markdown tables are too limited for complex table structures).
- Preserve embedded video iframes as inline HTML.
- Convert `<figure>` / `<figcaption>` to Markdown image syntax with caption text preserved (e.g., as italicized text below the image, or as inline HTML if necessary).
- Convert `<details>` / `<summary>` to inline HTML (no Markdown equivalent).
- Preserve `<sup>` / `<sub>` as inline HTML for footnotes, citations, and scientific notation.
- Convert `<aside>` elements to GitHub-style admonition blockquotes (e.g., `> [!NOTE]`, `> [!TIP]`). Attempt to detect the admonition type from the aside's class, role, or first-line content; default to `> [!NOTE]` if ambiguous.
- Rewrite image `src` attributes to relative `assets/` paths (e.g., `![alt](assets/image-001.jpg)`).
- Preserve link `href` attributes as absolute URLs.
**Outputs / Outcomes:** A Markdown string with all images referencing relative `assets/` paths.
**Acceptance Criteria:**
- [ ] Headings, lists, links, bold/italic, code blocks, and blockquotes convert correctly.
- [ ] HTML tables are preserved as inline HTML.
- [ ] Figure captions are preserved alongside their images.
- [ ] Aside elements become GitHub-style admonition blockquotes.
- [ ] All content image references point to `assets/` relative paths.
- [ ] External link URLs are absolute.
**Priority:** Must

### 4.3 YAML Frontmatter Generation

**ID:** FR-003
**Description:** The extension must generate YAML frontmatter containing rich provenance metadata extracted from the page's `<head>`, Open Graph tags, and structured data.
**Trigger:** Successful content extraction (FR-001).
**Inputs:** The current page's full DOM (specifically `<head>` metadata, OG tags, JSON-LD, meta tags).
**Processing / Business Rules:**
- Extract and include the following fields (when available):

| Field | Source | Required |
|---|---|---|
| `title` | `<title>`, `og:title`, Readability title | Yes |
| `author` | `<meta name="author">`, `article:author`, JSON-LD author, byline detection | Best-effort |
| `date` | `article:published_time`, `<meta name="date">`, `<time>` elements, JSON-LD datePublished | Best-effort |
| `url` | `window.location.href` | Yes |
| `canonical_url` | `<link rel="canonical">` | Best-effort |
| `site_name` | `og:site_name`, `<meta name="application-name">` | Best-effort |
| `language` | `<html lang>`, `og:locale` | Best-effort |
| `description` | `og:description`, `<meta name="description">` | Best-effort |
| `excerpt` | Readability excerpt / first paragraph summary | Best-effort |
| `keywords` | `<meta name="keywords">` | Best-effort |
| `og_image` | `og:image` | Best-effort |
| `og_type` | `og:type` | Best-effort |
| `word_count` | Computed from extracted content | Yes |
| `archived_at` | ISO 8601 timestamp of when the archive was created | Yes |

- Fields with no detected value should be omitted from the frontmatter (not included as empty strings).
- Dates should be normalized to ISO 8601 format.
- Multi-value fields (e.g., multiple authors, keywords) should be represented as YAML arrays.

**Outputs / Outcomes:** A YAML frontmatter block prepended to the Markdown content.
**Acceptance Criteria:**
- [ ] `title`, `url`, `word_count`, and `archived_at` are always present.
- [ ] Author, date, site name, and description are extracted when present in the page source.
- [ ] Open Graph fields are captured when available.
- [ ] Output is valid YAML that does not break Markdown parsers expecting `---` delimiters.
- [ ] Special characters in metadata values are properly escaped for YAML.
**Priority:** Must

### 4.4 Image Downloading

**ID:** FR-004
**Description:** The extension must download all images found within the extracted content area and store them in the `assets/` directory of the TextBundle.
**Trigger:** Successful content extraction (FR-001) and Markdown conversion (FR-002).
**Inputs:** List of image URLs from the extracted content.
**Processing / Business Rules:**
- Download each image using the browser's active session (cookies are sent naturally, enabling access to images behind authentication).
- Preserve original image format (JPEG, PNG, WebP, GIF, SVG, etc.) — do not convert.
- Generate deterministic, collision-free filenames for images (e.g., `image-001.jpg`, `image-002.png`, or content-hash-based names).
- Skip duplicate images (same URL referenced multiple times).
- Handle download failures gracefully: if an image cannot be fetched, keep the original absolute URL in the Markdown and log a warning, but do not fail the entire archive.
- Only download images from within the extracted content area — not the page at large.

**Outputs / Outcomes:** Image files stored in the `assets/` directory, with Markdown references updated to match.
**Acceptance Criteria:**
- [ ] All content images are downloaded and stored in `assets/`.
- [ ] Image formats are preserved (no conversion).
- [ ] Duplicate URLs result in a single downloaded file.
- [ ] Failed image downloads produce a warning but do not block the archive.
- [ ] Images behind authentication (on the same domain the user is logged into) are successfully fetched.
**Priority:** Must

### 4.5 TextBundle Packaging

**ID:** FR-005
**Description:** The extension must package the Markdown file, `info.json`, and `assets/` directory into a valid TextBundle, offered as a `.textpack` (zipped) download.
**Trigger:** Successful completion of FR-002, FR-003, and FR-004.
**Inputs:** Markdown content with frontmatter, downloaded image files.
**Processing / Business Rules:**
- Produce a zip file with the following structure:
  ```
  archive-name.textpack
  ├── info.json
  ├── text.md
  └── assets/
      ├── image-001.jpg
      ├── image-002.png
      └── ...
  ```
- `info.json` must conform to TextBundle spec v2:
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
- All filenames within the bundle must be lowercase (per TextBundle spec iOS compatibility recommendation).
- For MVP, the output format is `.textpack` exclusively.
- The default filename pattern is `{date}-{title}.textpack` where `{date}` is `YYYY-MM-DD` and `{title}` is a URL-safe slug derived from the page title.
- Trigger the browser's download mechanism (file saves to Downloads folder or triggers Save As dialog, depending on the user's browser download settings).

**Outputs / Outcomes:** A `.textpack` file downloaded to the user's machine.
**Acceptance Criteria:**
- [ ] Output is a valid zip file.
- [ ] Zip contains `info.json`, `text.md`, and `assets/` directory.
- [ ] `info.json` conforms to TextBundle v2 spec.
- [ ] All filenames inside the bundle are lowercase.
- [ ] The downloaded filename follows the `{date}-{title}.textpack` pattern.
- [ ] The file can be opened by TextBundle-compatible applications (e.g., Ulysses, Bear, iA Writer).
**Priority:** Must

### 4.6 Toolbar Button Trigger

**ID:** FR-006
**Description:** The extension must add a browser toolbar button that, when clicked, triggers the archive workflow for the current active tab.
**Trigger:** User clicks the toolbar button.
**Inputs:** Current active tab's URL and DOM.
**Processing / Business Rules:**
- The button should have a recognizable icon indicating archival/download functionality.
- Clicking the button initiates the full pipeline: extraction (FR-001) -> conversion (FR-002) -> frontmatter (FR-003) -> images (FR-004) -> packaging (FR-005).
- Show a brief visual indicator (badge, notification, or icon change) while processing.
- Show a success notification when the download completes.
- Show an error notification if extraction fails (FR-001 fallback behavior).
**Outputs / Outcomes:** Archive download initiated or error notification displayed.
**Acceptance Criteria:**
- [ ] Toolbar button appears after installation.
- [ ] Single click triggers the full archive pipeline.
- [ ] User receives visual feedback during processing.
- [ ] User receives confirmation on success or clear error message on failure.
**Priority:** Must

### 4.7 Context Menu Trigger

**ID:** FR-007
**Description:** The extension must add a right-click context menu entry on web pages that triggers the archive workflow.
**Trigger:** User right-clicks on a page and selects the archive option.
**Inputs:** Current page's URL and DOM.
**Processing / Business Rules:**
- Menu entry text should be clear, e.g., "Archive Page as TextBundle."
- Behavior is identical to the toolbar button trigger (FR-006).
**Outputs / Outcomes:** Archive download initiated.
**Acceptance Criteria:**
- [ ] Context menu entry appears on right-click within web pages.
- [ ] Triggers the same pipeline as the toolbar button.
**Priority:** Must

### 4.8 Keyboard Shortcut Trigger

**ID:** FR-008
**Description:** The extension must support a keyboard shortcut to trigger the archive workflow.
**Trigger:** User presses the configured keyboard shortcut.
**Inputs:** Current active tab's URL and DOM.
**Processing / Business Rules:**
- Assign a sensible default shortcut (e.g., `Ctrl+Shift+S` / `Cmd+Shift+S`).
- Behavior is identical to the toolbar button trigger (FR-006).
- Shortcut must not conflict with common browser or OS shortcuts.
**Outputs / Outcomes:** Archive download initiated.
**Acceptance Criteria:**
- [ ] Default keyboard shortcut triggers the archive pipeline.
- [ ] Works on both Windows/Linux (Ctrl) and macOS (Cmd).
**Priority:** Must

### 4.9 Extraction Failure Handling

**ID:** FR-009
**Description:** When the content extraction engine fails to identify a content area, the extension must notify the user and (in future) offer manual selection.
**Trigger:** Readability (or equivalent) returns no usable content.
**Inputs:** N/A (failure state).
**Processing / Business Rules:**
- Display a clear error notification explaining that content extraction failed.
- In Phase 1: notification only, no fallback action.
- In Phase 2: prompt the user to manually select a content region (see FR-010).
**Outputs / Outcomes:** Error notification displayed. No file downloaded.
**Acceptance Criteria:**
- [ ] User sees a clear, non-technical error message when extraction fails.
- [ ] No empty or malformed `.textpack` files are downloaded on failure.
**Priority:** Must

### 4.10 Manual Content Selection (Phase 2)

**ID:** FR-010
**Description:** As a fallback when automatic extraction fails (or optionally on demand), the user can hover over page elements to highlight container regions and click to select the content area for archival.
**Trigger:** Extraction failure (FR-009), or user manually activates selection mode.
**Inputs:** User's mouse hover and click events on the page DOM.
**Processing / Business Rules:**
- When activated, overlay a visual highlight on DOM containers as the user hovers (similar to browser DevTools element picker or screenshot region-select tools).
- User clicks a highlighted container to select it as the content root.
- The selected container's inner HTML is then processed through the same conversion pipeline (FR-002 onward).
- Provide a way to cancel selection mode (e.g., Escape key).
**Outputs / Outcomes:** User-selected HTML fragment fed into the Markdown conversion pipeline.
**Acceptance Criteria:**
- [ ] Hovering highlights block-level containers with a visible overlay.
- [ ] Clicking a container selects it and initiates the conversion pipeline.
- [ ] Escape key cancels selection mode.
- [ ] Selected content is processed identically to Readability-extracted content.
**Priority:** Should (Phase 2)

### 4.11 Settings / Options Page (Phase 2)

**ID:** FR-011
**Description:** The extension must provide a settings page accessible from the browser's extension management UI.
**Trigger:** User navigates to the extension's options page.
**Inputs:** User configuration choices.
**Processing / Business Rules:**
- Configurable settings:
  - **Output format:** `.textpack` (zipped) or `.textbundle` (uncompressed) — default `.textpack`.
  - **Filename pattern:** Template using variables like `{date}`, `{title}`, `{domain}`, `{timestamp}` — default `{date}-{title}`.
  - **Image size limit:** Optional maximum file size per image (skip or downscale images exceeding it) — default: no limit.
  - **Keyboard shortcut:** Ability to view/change the trigger shortcut.
- Settings are persisted using the WebExtensions storage API (`browser.storage.sync` or `browser.storage.local`).
**Outputs / Outcomes:** User preferences stored and applied to subsequent archives.
**Acceptance Criteria:**
- [ ] Settings page is accessible from the extension's entry in the browser extension manager.
- [ ] All configurable fields are present and functional.
- [ ] Settings persist across browser sessions.
- [ ] Default values are applied when no user configuration exists.
**Priority:** Should (Phase 2)

---

## 5. Data Requirements

### 5.1 Key Data Entities

| Entity | Description | Source | Sensitivity |
|---|---|---|---|
| Page Metadata | Title, author, date, URL, OG tags, meta tags | Current page DOM `<head>` | Low — publicly available metadata |
| Article Content | Extracted main content as HTML, then Markdown | Current page DOM | Low — publicly visible page content |
| Content Images | Binary image files referenced within the article body | Remote image URLs | Low — publicly accessible images (may be higher if behind auth) |
| User Settings | Extension configuration preferences | User input via options page | Low — local browser storage |
| info.json | TextBundle metadata file | Generated by extension | Low |

### 5.2 Data Rules & Validation

- Frontmatter YAML must be valid and parseable; special characters in values must be properly quoted/escaped.
- ISO 8601 date format for all date fields.
- Image filenames must be lowercase, URL-safe, and unique within the `assets/` directory.
- The `text.md` file must be valid UTF-8 encoded Markdown.
- The zip archive must conform to standard zip format (no zip64 unless necessary for very large archives).

### 5.3 Data Retention & Lifecycle

- The extension does not retain any data after the download completes. All processing is transient and in-memory.
- User settings are stored in browser extension storage and persist until the user modifies them or uninstalls the extension.
- No data is sent to any external server. All processing is local.

---

## 6. Integration Requirements

| ID | External System | Direction | Method / Protocol | Frequency | Owner | Notes |
|---|---|---|---|---|---|---|
| INT-001 | Target web page | Inbound | DOM access via content script | On-demand (per user trigger) | Page owner | Read-only access to page DOM and metadata |
| INT-002 | Image hosting servers | Inbound | HTTP/HTTPS GET (via browser fetch with cookies) | On-demand (per archive) | Various | Uses browser's active session; images fetched with user's cookies for auth support |
| INT-003 | Browser Downloads API | Outbound | WebExtensions `browser.downloads.download()` | On-demand | Browser | Triggers file save to user's configured download location |
| INT-004 | Browser Storage API | Bidirectional | WebExtensions `browser.storage.sync` / `local` | On settings change | Browser | Persists user preferences (Phase 2) |

---

## 7. Non-Functional Requirements

| ID | Category | Requirement | Target / Metric |
|---|---|---|---|
| NFR-001 | Performance | Archive generation should complete promptly for typical article pages | < 10 seconds for a page with up to 20 images on a standard broadband connection |
| NFR-002 | Performance | Image downloads should run concurrently to minimize total processing time | Parallel fetch with reasonable concurrency limit (e.g., 4-6 simultaneous downloads) |
| NFR-003 | Compatibility | Must work on latest stable Firefox and Chrome/Chromium | Latest stable release at time of development |
| NFR-004 | Compatibility | Must use WebExtensions APIs compatible with both Firefox and Chrome | Cross-browser API surface; use `browser.*` with Chrome polyfill or `chrome.*` with appropriate abstraction |
| NFR-005 | Reliability | Image download failures must not break the entire archive | Graceful degradation: keep absolute URL in Markdown, include warning |
| NFR-006 | Portability | Output must conform to TextBundle v2 specification | Valid `.textpack` files openable by TextBundle-compatible apps |
| NFR-007 | Privacy | No data transmitted to external servers | All processing is local; no analytics, telemetry, or network calls except to fetch page images |
| NFR-008 | Usability | No configuration required for basic usage | Extension works immediately after installation with sensible defaults |
| NFR-009 | Maintainability | Codebase should be simple, minimal dependencies, no framework | Vanilla JS (or TypeScript at dev team's discretion), minimal build tooling |
| NFR-010 | Accessibility | Notifications and UI elements should be accessible | Use browser-native notification APIs; ensure keyboard navigability for options page (Phase 2) |

---

## 8. Constraints

| Type | Constraint | Impact |
|---|---|---|
| Technology | Must use WebExtensions API (cross-browser) | Limits access to certain browser internals; some APIs differ between Firefox and Chrome |
| Technology | Prefer no build step / minimal tooling | May limit use of TypeScript or advanced bundling; dev team to evaluate trade-offs |
| Technology | Rely on Mozilla Readability for content extraction | Extraction quality is bounded by Readability's heuristics; some pages will fail |
| Format | Must conform to TextBundle v2 specification | Constrains file structure, `info.json` schema, and asset referencing conventions |
| Platform | Latest stable browser versions only | No need to support legacy browser versions or APIs |
| Dependencies | Minimize third-party dependencies | Core deps: Readability, Turndown.js, a zip library (e.g., JSZip). Avoid framework-level deps. |

---

## 9. Assumptions

| ID | Assumption | Risk if Wrong | Owner to Validate |
|---|---|---|---|
| A-001 | Mozilla Readability will successfully extract content from the majority of article-style web pages | Manual selection fallback (Phase 2) becomes higher priority; may need to evaluate alternative extraction libraries | Dev team |
| A-002 | Turndown.js can be extended with custom rules for tables, figures, asides, details/summary, and sup/sub | May need to fork Turndown or write a custom converter for certain elements | Dev team |
| A-003 | Browser fetch with active session cookies is sufficient for downloading images behind authentication | May need explicit cookie forwarding or alternative fetch strategies for some CDN configurations | Dev team |
| A-004 | JSZip (or equivalent) can produce valid zip files entirely in-browser without exceeding memory limits for typical articles | Very image-heavy pages might need streaming zip generation or size warnings | Dev team |
| A-005 | The `browser.downloads` API allows programmatic download of blobs generated in-memory | Both Firefox and Chrome support this; if restrictions exist, may need alternative download mechanism | Dev team |
| A-006 | Users have the Readability and Turndown libraries bundled with the extension (no CDN loading) | Increases extension package size slightly but ensures offline capability and privacy | Dev team |
| A-007 | A single content script injection is sufficient to access the fully-rendered DOM including lazy-loaded image attributes | Some SPAs may require delayed injection or mutation observers; extraction timing may need tuning | Dev team |

---

## 10. Dependencies & Risks

| ID | Type | Description | Likelihood | Impact | Mitigation |
|---|---|---|---|---|---|
| R-001 | Risk | Readability fails on sites with unconventional DOM structure (SPAs, heavy JS rendering) | Medium | Medium | Phase 2 manual selection fallback (FR-010); test against diverse site corpus |
| R-002 | Risk | Lazy-loaded images use non-standard attribute patterns not covered by common detection heuristics | Medium | Low | Best-effort pattern matching; extensible detection logic; accept some missed images |
| R-003 | Risk | Cross-browser API differences cause unexpected behavior in Chrome vs Firefox | Medium | Medium | Abstract browser API calls; test on both browsers; use WebExtension polyfill library if needed |
| R-004 | Risk | Large pages with many high-resolution images cause memory pressure or slow processing | Low | Medium | Concurrent download limit; Phase 2 image size limit setting; consider streaming zip in future |
| R-005 | Dependency | Mozilla Readability library (MIT license) — must be bundled | Low | Low | Stable, well-maintained library; pin to tested version |
| R-006 | Dependency | Turndown.js library (MIT license) — must be bundled | Low | Low | Stable, well-maintained library; pin to tested version |
| R-007 | Dependency | Zip library (e.g., JSZip, MIT license) — must be bundled | Low | Low | Stable, well-maintained library; pin to tested version |
| R-008 | Risk | Browser extension store review process may flag permissions (e.g., `<all_urls>` for content script injection) | Low | Medium | Justify permissions clearly in store listing; use minimal required permissions |

---

## 11. Scope & Phasing

### 11.1 In Scope (Phase 1 / MVP)

- **FR-001** Content extraction via Readability with lazy-load image resolution
- **FR-002** HTML-to-Markdown conversion with custom rules (tables, figures, asides, details/summary, sup/sub)
- **FR-003** Rich YAML frontmatter generation (title, author, date, URL, OG tags, description, keywords, etc.)
- **FR-004** Image downloading with active session cookie support
- **FR-005** TextBundle packaging as `.textpack` (zipped) with default `{date}-{title}` filename
- **FR-006** Toolbar button trigger with processing feedback
- **FR-007** Context menu trigger
- **FR-008** Keyboard shortcut trigger
- **FR-009** Extraction failure notification

### 11.2 Phase 2

- **FR-010** Manual hover-to-select content region (Readability fallback)
- **FR-011** Settings/options page (output format choice, filename pattern, image size limit, shortcut config)
- `.textbundle` (uncompressed) output format option

### 11.3 Out of Scope / Future Consideration

- Batch archival of multiple pages
- Scheduled/automatic archival
- Cloud storage integration (save directly to Dropbox, iCloud, etc.)
- PDF or EPUB output formats
- Full-page screenshot inclusion
- Page content diffing or version tracking
- Readability training or ML-based content extraction
- Browser sync of archived bundles

### 11.4 Parking Lot

- Custom CSS injection for Markdown rendering preview before download
- Option to include page's original CSS as an attachment for reference
- "Archive this link" context menu option (archive a linked page without navigating to it)
- Integration with note-taking apps (Obsidian vault, Bear, iA Writer) via protocol handlers

---

## 12. Open Questions

| ID | Question | Raised By | Assigned To | Due Date | Status |
|---|---|---|---|---|---|
| OQ-001 | Should the extension use TypeScript with a build step or vanilla JS? | Analyst | Dev team | Before implementation | Open |
| OQ-002 | ~~What is the `creatorURL` value for `info.json`?~~ Resolved: `https://github.com/textbundle/textbundler` | Analyst | Project Owner | 2026-02-14 | Resolved |
| OQ-003 | Should the default keyboard shortcut be `Ctrl+Shift+S` / `Cmd+Shift+S` or something else to avoid conflicts? | Analyst | Dev team | During implementation | Open |
| OQ-004 | What WebExtension polyfill strategy should be used for cross-browser compatibility? (Mozilla's `webextension-polyfill` or manual abstraction?) | Analyst | Dev team | During implementation | Open |
| OQ-005 | Should figure captions be rendered as italicized text below the image in Markdown, or as inline HTML `<figure>` blocks? | Analyst | Dev team | During implementation | Open |
| OQ-006 | What concurrency limit for parallel image downloads balances speed vs. resource usage? | Analyst | Dev team | During implementation | Open |
| OQ-007 | How should the extension handle pages that require JavaScript execution to render content (heavy SPAs)? Content scripts see the rendered DOM, but timing may matter. | Analyst | Dev team | During implementation | Open |

---

## 13. Glossary

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
| MVP | Minimum Viable Product — the smallest set of features that delivers core value. |
| MoSCoW | Prioritization framework: Must have, Should have, Could have, Won't have. |

---

## 14. Appendices

### 14.1 Referenced Documents

- TextBundle Specification: https://textbundle.org/spec/
- Mozilla Readability: https://github.com/mozilla/readability
- Turndown.js: https://github.com/mixmark-io/turndown
- JSZip: https://stuk.github.io/jszip/
- WebExtensions API (MDN): https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
- GitHub Admonition Syntax: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts

### 14.2 Diagrams & Wireframes

**Processing Pipeline (conceptual):**

```
User Trigger (button / menu / shortcut)
        │
        ▼
┌─────────────────┐
│  Content Script  │
│  (injected into  │
│   active tab)    │
├─────────────────┤
│ 1. Resolve lazy  │
│    image sources │
│ 2. Run           │
│    Readability   │
│ 3. Extract       │
│    metadata from │
│    <head> / OG   │
└────────┬────────┘
         │ HTML fragment + metadata
         ▼
┌─────────────────┐
│ Background /     │
│ Extension Script │
├─────────────────┤
│ 4. Turndown:     │
│    HTML → MD     │
│ 5. Generate YAML │
│    frontmatter   │
│ 6. Fetch images  │
│    (parallel)    │
│ 7. Build zip     │
│    (JSZip)       │
│ 8. Trigger       │
│    download      │
└─────────────────┘
         │
         ▼
   .textpack file
   saved to disk
```

---

## Document History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-02-14 | Requirements Analyst | Initial draft |
| 1.1 | 2026-02-14 | Requirements Analyst | Renamed to TextBundler; updated creatorIdentifier/creatorURL to textbundle org; resolved OQ-002 |
