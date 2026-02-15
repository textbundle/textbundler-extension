# Testing Guide

## Quick Start

```bash
git clone <repo-url> && cd textbundler
npm install
make chrome
```

This builds the Chrome MV3 extension, auto-installs Chrome for Testing (via Puppeteer) if needed, and launches it with the extension loaded in an isolated profile. Navigate to any article and click the toolbar icon to archive.

## Unit Tests

```bash
make test
```

Runs the full Vitest suite (~190 tests). All tests run in Node with linkedom — no browser or network required.

Run a single test file by name:

```bash
npm run test -- --run slug
npm run test -- --run pipeline
npm run test -- --run markdown-converter
```

## Type Checking

```bash
make typecheck
```

## Manual Browser Testing

### Chrome

```bash
make chrome
```

- Builds `dist/chrome-mv3/` and launches Chrome for Testing
- Uses a dedicated profile at `.chrome-profile/` (isolated from your personal Chrome)
- Extension is always freshly loaded from the build output
- Run `make chrome-clean` to wipe the profile and start fresh

### Firefox

```bash
make firefox
```

- Builds `dist/firefox-mv2/` and launches Firefox via `web-ext run`
- Uses a temporary profile automatically (web-ext default behavior)

### What to Test Manually

1. **Toolbar button** — click the TextBundler icon on any article page
2. **Context menu** — right-click on a page, select "Archive Page as TextBundle"
3. **Badge feedback** — watch for `...` (processing), `OK` (success), `!` (error)
4. **Download** — a `.textpack` file should download with the pattern `{date}-{domain}-{title-slug}.textpack`
5. **Inspect the archive** — unzip and verify contents:
   ```bash
   unzip -l ~/Downloads/2026-02-15-en-wikipedia-textbundle.textpack
   ```
   Expected structure:
   ```
   info.json
   text.md
   assets/image-001.png
   assets/image-002.jpg
   ...
   ```
6. **Non-article pages** — try on a page Readability can't extract (e.g. a search results page). Should show `!` badge and a notification.

### Good Test Pages

- `https://en.wikipedia.org/wiki/TextBundle` — short article with images
- `https://developer.mozilla.org/en-US/docs/Web/API/DOMParser` — MDN documentation
- Any blog post or news article with images

## End-to-End Test

```bash
make e2e
```

Runs `scripts/test-chrome-extension.mjs` — a Puppeteer script that:

1. Launches Chrome for Testing with the extension loaded
2. Navigates to a Wikipedia article
3. Injects the content script and triggers the archive pipeline via the service worker
4. Captures service worker console output via CDP
5. Verifies the pipeline completes successfully

This test validates the full flow: content script injection, message passing, extraction, markdown conversion, image download, packaging, and download trigger.

## Troubleshooting

### "No Chrome for Testing found"

```bash
npx puppeteer browsers install chrome
```

### Chrome uses stale extension code

```bash
make chrome-clean
make chrome
```

### Extension shows `!` badge but no notification

Open the service worker console:
- `make chrome` → navigate to `chrome://extensions` → click "Inspect views: service worker"
- Check for error messages prefixed with `[TextBundler:]`

### Downloads save as `.zip` instead of `.textpack`

This was fixed by using `application/octet-stream` as the blob MIME type. Rebuild with `make chrome` to pick up the fix.

### Service worker registration failed

Requires Chrome 110+ with MV3 support. `make chrome` uses Chrome for Testing (latest) which always works. Older Chromium installations (< v110) do not support MV3 service workers.
