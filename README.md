# TextBundler

A cross-browser extension (Firefox + Chrome + Safari) that captures web pages as self-contained Markdown archives in the [TextBundle](https://textbundle.org/) `.textpack` format. Built with [WXT](https://wxt.dev/) (Manifest V3/V2), TypeScript, and Vite.

## Quick Start

```bash
git clone <repo-url> && cd textbundler
npm install
make chrome        # build + launch Chrome with extension loaded
```

That's it. Chrome for Testing is auto-installed on first run. Navigate to any article and click the toolbar icon to archive it.

See [docs/TESTING.md](docs/TESTING.md) for the full testing guide.

## Prerequisites

- Node.js (v18+)
- npm
- GNU Make

## Install

```bash
npm install
```

This installs dependencies and runs `wxt prepare` to generate TypeScript types.

## Development

### Makefile targets (recommended)

```bash
make chrome        # build Chrome MV3 + launch with extension loaded
make firefox       # build Firefox MV2 + launch via web-ext
make safari        # build Safari MV2 + open Safari (manual load)
make safari-xcode  # build + generate Xcode project for App Store
make build-all     # build all three browsers
make test          # Vitest
make typecheck     # tsc --noEmit
make lint          # ESLint
make e2e           # Puppeteer end-to-end pipeline test
make clean         # remove dist/, .wxt/, and xcode-safari/
make chrome-clean  # wipe the Chrome test profile
```

`make chrome` uses a dedicated profile at `.chrome-profile/` — isolated from your personal Chrome, and always loads the freshly built extension. Run `make chrome-clean` to reset it.

### npm scripts

```bash
npm run dev            # Chrome (MV3) with HMR
npm run dev:firefox    # Firefox (MV2) with HMR
```

### Loading the extension manually

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select any file inside `dist/firefox-mv2/` (e.g. `manifest.json`)
4. The extension appears in the toolbar and context menu

To debug: click "Inspect" next to the extension on the `about:debugging` page to open the background script console.

**Chrome:**
1. Navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `dist/chrome-mv3/` directory
5. The extension appears in the toolbar (pin it from the puzzle-piece menu if needed)

To debug: click "Inspect views: service worker" on the extension card to open the background script console.

**Safari:**
1. Safari > Settings > Advanced > enable "Show features for web developers"
2. Develop menu > check "Web Extension Developer Mode"
3. Develop > Load Web Extension... > select `dist/safari-mv2/`
4. The extension appears in the toolbar

To debug: Develop > Web Extension Background Content > TextBundler to open the background script console.

`make safari` builds and opens Safari with instructions. `make safari-xcode` generates a full Xcode project for App Store distribution.

### Reloading after changes

After rebuilding (`npm run build` / `npm run build:firefox` / `npm run build:safari`):

- **Firefox:** Click the reload icon (circular arrow) next to the extension on `about:debugging`
- **Chrome:** Click the reload icon on the extension card at `chrome://extensions`
- **Safari:** Develop > Load Web Extension... again (replaces the previous load)

Dev mode (`npm run dev` / `npm run dev:firefox`) watches for changes and auto-reloads. `make chrome` / `make firefox` / `make safari` always rebuild before launching.

## Production Build

```bash
npm run build            # Chrome MV3 → dist/chrome-mv3/
npm run build:firefox    # Firefox MV2 → dist/firefox-mv2/
npm run build:safari     # Safari MV2 → dist/safari-mv2/
```

## Package for Distribution

```bash
npm run zip              # → dist/textbundler-0.1.0-chrome.zip
npm run zip:firefox      # → dist/textbundler-0.1.0-firefox.zip + sources.zip
npm run zip:safari       # → dist/textbundler-0.1.0-safari.zip
make safari-xcode        # generate Xcode project for App Store submission
```

## Quality Checks

```bash
make test                # or: npm run test
make typecheck           # or: npm run typecheck
make e2e                 # Puppeteer Chrome pipeline test
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
- Converts HTML to Markdown (Turndown + GFM + custom rules) — runs here because Chrome MV3 service workers lack `DOMParser`

**Background Service Worker** (`entrypoints/background.ts`):
- Downloads images in parallel (4 concurrent, 30s timeout)
- Patches failed image URLs back to absolute
- Builds YAML frontmatter
- Packages into `.textpack` via JSZip
- Triggers browser download
