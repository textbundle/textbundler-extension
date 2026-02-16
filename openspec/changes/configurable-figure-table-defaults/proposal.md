## Why

TextBundler currently preserves `<figure>` and `<table>` elements as inline HTML in the Markdown output (DD-05, TASK-012a, TASK-012b). While this preserves semantic structure, it produces Markdown that is harder to read and edit in plain-text editors. Most users prefer native Markdown syntax — `![alt](src)` for images with caption text below, and GFM pipe tables — and only need the HTML fallback for complex cases. The defaults should match the common case, with a setting to opt back into HTML preservation.

## What Changes

- Change the default figure conversion: `<figure>` with `<img>` and `<figcaption>` → `![alt](assets/image-NNN.ext)` + caption as italic text below, instead of inline HTML `<figure>` block.
- Change the default table conversion: `<table>` → GFM pipe table (using turndown-plugin-gfm's built-in table support), instead of inline HTML `<table>` block.
- Add a settings storage layer using `browser.storage.sync` with typed defaults.
- Add an options page (WXT `entrypoints/options/`) where users can toggle figure and table output format independently:
  - Figures: "Markdown (default)" or "HTML"
  - Tables: "Markdown (default)" or "HTML"
- Pass user settings to `convertToMarkdown()` so rules adapt at conversion time.
- Update golden files and tests to reflect the new default output.

## Capabilities

### New Capabilities
- `conversion-settings`: User-configurable settings for HTML-to-Markdown conversion behavior, stored via `browser.storage.sync` with typed defaults and an options page UI.

### Modified Capabilities

## Impact

- `lib/markdown-converter.ts` — refactor figure and table rules to support both output modes; accept a settings parameter
- `entrypoints/content.ts` — read settings before conversion, pass to `convertToMarkdown()`
- `lib/types.ts` — add `ConversionSettings` type
- New `entrypoints/options/` — options page HTML + script
- `wxt.config.ts` — register options page entrypoint
- `tests/markdown-converter.test.ts` — update existing tests for new defaults, add tests for HTML-mode settings
- `tests/fixtures/*.expected.md` — regenerate golden files for figure-caption and html-table fixtures to match Markdown output
- `manifest.json` — `options_ui` key added automatically by WXT
