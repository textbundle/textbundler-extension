# TextBundler

A cross-browser extension (Firefox + Chrome) that captures web pages as self-contained Markdown archives in the [TextBundle](https://textbundle.org/) `.textpack` format. Built with [WXT](https://wxt.dev/) (Manifest V3/V2), TypeScript, and Vite.

## Prerequisites

- Node.js (v18+)
- npm

## Install

```bash
npm install
```

This installs dependencies and runs `wxt prepare` to generate TypeScript types.

## Development

```bash
npm run dev            # Chrome (MV3) with HMR
npm run dev:firefox    # Firefox (MV2) with HMR
```

### Loading the extension

**Firefox:**
1. Navigate to `about:debugging` → This Firefox
2. Click "Load Temporary Add-on..."
3. Select `manifest.json` from `.output/firefox-mv2/`

**Chrome:**
1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `.output/chrome-mv3/` directory

Dev mode watches for changes and auto-reloads the extension.

## Production Build

```bash
npm run build            # Chrome → .output/chrome-mv3/
npm run build:firefox    # Firefox → .output/firefox-mv2/
```

## Package for Distribution

```bash
npm run zip              # → .output/textbundler-0.1.0-chrome.zip
npm run zip:firefox      # → .output/textbundler-0.1.0-firefox.zip + sources.zip
```

## Quality Checks

```bash
npm run test             # Vitest (182 tests, no network)
npm run typecheck        # tsc --noEmit
npm run lint             # ESLint
npm run format           # Prettier
```

Run a single test file:

```bash
npm run test -- --run slug
```

## Usage

1. Navigate to any article or blog post
2. Click the TextBundler toolbar icon, or right-click → "Archive Page as TextBundle"
3. The extension extracts the article, converts it to Markdown, downloads images, and packages everything into a `.textpack` file

### Badge indicators

- **`...`** (blue) — processing
- **`OK`** (blue) — success (clears after 3s)
- **`!`** (red) — error (clears after 5s)

A browser notification confirms the result.

## Output Format

The `.textpack` file is a ZIP archive containing:

```
info.json              # TextBundle v2 metadata
text.md                # YAML frontmatter + Markdown body
assets/
  image-001.jpg        # Downloaded images (3-digit zero-padded)
  image-002.png
  ...
```

Inspect with:

```bash
unzip -l 2026-02-14-example-article.textpack
```

## Debugging

### Dev mode (all log levels visible)

- **Background logs:** Right-click extension icon → Inspect → Console
- **Content script logs:** Page DevTools (F12) → Console, filter by `[TextBundler:`

### Production mode

Only `warn` and `error` logs are emitted; `debug` and `info` are stripped by Vite.

## Architecture

Two-context event-driven pipeline:

**Content Script** (`entrypoints/content.ts`) — injected on-demand:
- Resolves lazy-loaded images
- Runs Mozilla Readability for article extraction
- Scrapes metadata from `<head>`, OG tags, JSON-LD

**Background Service Worker** (`entrypoints/background.ts`):
- Converts HTML to Markdown (Turndown + GFM + custom rules)
- Downloads images in parallel (4 concurrent, 30s timeout)
- Patches failed image URLs back to absolute
- Builds YAML frontmatter
- Packages into `.textpack` via JSZip
- Triggers browser download
