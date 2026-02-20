# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Orphan image recovery — images stripped by Readability (e.g., Flickity carousels) are collected from the full DOM and appended after a `---` separator
- Linked full-size image support — when an `<img>` is wrapped in an `<a>` linking to a higher-resolution image, the linked version is downloaded instead
- Original image filenames preserved in asset paths (sanitized, lowercase) instead of generic `image-NNN` numbering

### Changed

- Extracted shared image URL utilities (`extractExtension`, `extractBasename`, `isImageUrl`) into `lib/image-url-utils.ts`

## [1.2.1] - 2026-02-16

### Fixed

- Safari options page error ("Unable to find 'options.html'") — added `open_in_tab: true` to options_ui manifest entry

## [1.2.0] - 2026-02-16

### Added

- Configurable figure output style (Markdown or HTML) via options page
- Configurable table output style (Markdown or HTML) via options page
- Options page with Figure and Table conversion settings (`entrypoints/options/`)
- GFM pipe table output for simple tables (default); complex tables with colspan/rowspan auto-detected and preserved as HTML
- Markdown-mode figure output: `![alt](path)` + `*caption*` (default)
- `ConversionSettings` type and `applyDefaults()` helper (`lib/conversion-settings.ts`)
- Settings persistence via `browser.storage.sync`

### Fixed

- Firefox `storage` API error with temporary add-ons — added explicit gecko addon ID (`textbundler@textbundle.org`)

## [1.1.1] - 2026-02-16

### Fixed

- `.textpack` files now contain a `.textbundle/` root directory inside the zip, so unzipping produces a correctly named `.textbundle` folder that apps can open

## [1.1.0] - 2026-02-16

### Added

- Safari build targets (`npm run build:safari`, `npm run zip:safari`, `make safari-xcode`)
- Safari runtime fallbacks for `browser.downloads` (anchor-click via content script) and `browser.notifications` (silently skipped)
- Safari extension guide (`docs/SAFARI.md`)
- Tier-2 test corpus with 20 real-world site fixtures (`scripts/download-fixtures.sh`, `tests/sites.test.ts`)
- GitHub Actions CI workflow for automated testing on push and PR
- GitHub Actions release workflow — builds Chrome and Firefox packages on tag push and creates a GitHub Release with downloadable `.zip` artifacts
- Contributing guide with release workflow documentation (`CONTRIBUTING.md`)
- Architecture Decision Record for content-script markdown conversion (`docs/adr/001-content-script-markdown-conversion.md`)

### Fixed

- E2E test now uses `puppeteer.executablePath()` instead of a hardcoded browser path

## [1.0.0] - 2026-02-15

### Added

- Full web page archiving pipeline: click the toolbar button or context menu to capture any page as a self-contained `.textpack` Markdown archive
- Cross-browser support for Firefox (MV2) and Chrome (MV3) via WXT
- Lazy image resolution — detects `data-src`, `srcset`, `data-lazy-src`, `data-original`, and `<picture>` sources before extraction
- Article extraction using Mozilla Readability (same engine as Firefox Reader View)
- Metadata scraping from `<head>` tags, Open Graph properties, JSON-LD structured data, and `<meta>` tags with cascading fallbacks
- HTML-to-Markdown conversion via Turndown with GFM plugin and custom rules:
  - Tables, `<details>`/`<summary>`, `<sup>`/`<sub>`, and video iframes preserved as inline HTML
  - `<figure>`/`<figcaption>` handling
  - `<aside>` elements converted to `> [!TYPE]` admonition format
  - Image `src` attributes rewritten to `assets/` paths
- Parallel image downloading (4 concurrent, 30-second per-image timeout) with CORS-aware credential handling
- Graceful image failure handling — failed downloads revert to absolute URLs in the Markdown output
- YAML frontmatter generation with metadata, word count, and `archived_at` timestamp
- TextBundle `.textpack` packaging via JSZip (`info.json` + `text.md` + `assets/`)
- Deterministic output filenames: `YYYY-MM-DD-domain-slug.textpack` (slug truncated to 80 characters)
- Toolbar badge feedback showing processing state (`...`), success (`OK`), and errors (`!`)
- Desktop notifications on archive completion or failure
- Concurrent-click guard preventing duplicate processing on the same tab
- Structured logger with module-namespaced output (`[TextBundler:{module}]`), debug/info stripped in production
- TextBundle logo icons (CC0, Brett Terpstra)
- Vitest test suite with 191 tests across 12 test files
- 13 curated Tier-1 HTML fixtures with 9 golden file comparisons
- Full pipeline integration tests with mocked fetch
- Puppeteer-based Chrome extension E2E test
- Makefile with `make chrome`, `make firefox`, and `make e2e` targets
- GPLv3 license

[1.2.1]: https://github.com/textbundle/textbundler-extension/releases/tag/v1.2.1
[1.2.0]: https://github.com/textbundle/textbundler-extension/releases/tag/v1.2.0
[1.1.1]: https://github.com/textbundle/textbundler-extension/releases/tag/v1.1.1
[1.1.0]: https://github.com/textbundle/textbundler-extension/releases/tag/v1.1.0
[1.0.0]: https://github.com/textbundle/textbundler-extension/releases/tag/v1.0.0
