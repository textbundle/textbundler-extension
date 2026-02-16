## Context

TextBundler's `convertToMarkdown()` currently hardcodes Turndown rules that preserve `<figure>` and `<table>` as inline HTML (TASK-012a, TASK-012b). The proposal calls for flipping defaults to Markdown output and adding user settings to opt back into HTML preservation. The conversion runs in the content script (DD-16) and has no access to the background service worker's storage helpers.

Key constraints:
- Content script calls `convertToMarkdown()` synchronously after extraction — settings must be available before this call.
- `browser.storage.sync` is async. Settings must be read before triggering conversion.
- The `lib/` directory must remain browser-API-free (project convention). Settings reading stays in `entrypoints/`.
- Turndown rules are registered once per `TurndownService` instance. The settings determine which rules to add.

## Goals / Non-Goals

**Goals:**
- Default figure output: `![alt](assets/image-NNN.ext)` with caption as `*caption text*` on the next line.
- Default table output: GFM pipe table via turndown-plugin-gfm (remove the override rule).
- User-configurable toggle for each element type independently.
- Settings persisted via `browser.storage.sync` and editable through an options page.
- All existing tests updated for new defaults; HTML-mode behavior covered by new tests.

**Non-Goals:**
- Per-site or per-page settings — all pages use the same global settings.
- Configuring other inline HTML rules (details/summary, sup/sub, video iframes, asides) — those remain hardcoded as HTML.
- Options page styling or design polish — functional HTML form is sufficient.
- Auto-detection of complex tables (`colspan > 1`, `rowspan > 1`, nested tables) with automatic HTML fallback ships with this change.
- Options page styling or design polish beyond functional HTML.

## Decisions

### D1: Settings type and defaults

Add a `ConversionSettings` interface to `lib/types.ts`:

```typescript
export interface ConversionSettings {
  figureStyle: 'markdown' | 'html';
  tableStyle: 'markdown' | 'html';
}
```

Default: `{ figureStyle: 'markdown', tableStyle: 'markdown' }`.

Export a `DEFAULT_CONVERSION_SETTINGS` constant from a new `lib/conversion-settings.ts` module. This module also exports `loadConversionSettings()` and `saveConversionSettings()` helpers that wrap `browser.storage.sync`. Since these use `browser.*` APIs, they live in `lib/` only as typed wrappers — the actual `browser.storage` calls happen inside them, making this a deliberate exception to the "no browser APIs in lib/" rule.

**Alternative considered:** Put the storage helpers in `entrypoints/`. Rejected because both the content script and options page need the same load/save logic, and duplicating it across entrypoints is worse than a focused exception.

**Revised approach:** Keep `lib/conversion-settings.ts` as a pure module exporting only the type, defaults constant, and a pure `applyDefaults()` helper. The actual `browser.storage.sync` calls remain in the entrypoints that need them (`content.ts` reads, `options/` reads+writes). This preserves the "no browser APIs in lib/" convention.

### D2: `convertToMarkdown()` signature change

Add an optional `settings` parameter:

```typescript
export function convertToMarkdown(
  html: string,
  settings?: ConversionSettings
): { markdown: string; imageMap: ImageMap }
```

When `settings` is omitted, use `DEFAULT_CONVERSION_SETTINGS` (Markdown mode for both). This preserves backward compatibility — all existing callers and tests work without changes until they opt into HTML mode.

Inside the function, conditionally register the figure/table HTML-preservation rules only when the corresponding setting is `'html'`. When `'markdown'`:
- **Figures:** Remove the `figure` and `figcaption` rules. Add a new rule that converts `<figure>` to `![alt](asset-path)` + `\n*caption*\n` using Turndown's replacement function. Image src rewriting to `assets/` paths still happens.
- **Tables:** Remove the `table` and `tableChildren` override rules. The GFM plugin's built-in table handling takes over. However, before delegating to GFM, inspect the table for complexity: if any `<td>` or `<th>` has `colspan > 1` or `rowspan > 1`, or the table contains a nested `<table>`, fall back to inline HTML output regardless of the setting. This prevents broken GFM output for tables that cannot be represented as pipe tables.

### D3: Content script integration

In `entrypoints/content.ts`, read settings from `browser.storage.sync` when the `trigger-archive` message arrives, before calling `convertToMarkdown()`:

```typescript
const stored = await browser.storage.sync.get('conversionSettings');
const settings = applyDefaults(stored.conversionSettings);
const { markdown, imageMap } = convertToMarkdown(article.content, settings);
```

The message listener must return a `Promise` (already implicit with `async`). The `applyDefaults()` helper merges partial stored values with defaults, handling the case where a user has never opened the options page.

### D4: Options page

WXT options page at `entrypoints/options/index.html` + `entrypoints/options/main.ts`:
- Simple HTML form with two `<select>` dropdowns (Figures, Tables), each with "Markdown" and "HTML" options.
- On load: read `browser.storage.sync`, set form values.
- On change: write to `browser.storage.sync`.
- Registered automatically by WXT via the entrypoint directory convention.

### D5: Golden file and test updates

- `tests/fixtures/figure-caption.expected.md` — regenerate to show Markdown image + italic caption instead of `<figure>` HTML.
- `tests/fixtures/html-table.expected.md` — regenerate to show GFM pipe table instead of `<table>` HTML.
- Existing markdown-converter tests that assert figure/table behavior: update expected output for new defaults.
- Add new test groups: "figure rule with html setting", "table rule with html setting" — these pass `{ figureStyle: 'html', tableStyle: 'html' }` and assert the old inline HTML output.
- `tests/image-patcher.test.ts` — update the figure-related patching test if the default no longer produces `<figure>` HTML.

## Risks / Trade-offs

- **GFM table limitations** → Tables with `colspan > 1`, `rowspan > 1`, or nested `<table>` elements cannot be represented in GFM pipe syntax. Mitigated by auto-detecting these cases in the table rule: when any cell has `colspan` or `rowspan` attributes with values greater than 1, or the table contains a nested `<table>`, fall back to inline HTML output regardless of the `tableStyle` setting. This keeps the Markdown default safe without requiring users to manually switch modes.

- **Breaking change for existing users** → Users upgrading from a version that produced HTML figures/tables will get different output. Since TextBundler doesn't have released settings yet and archives are independent files, this is low-risk. No migration needed.

- **Content script async overhead** → Reading `browser.storage.sync` adds a small async delay before conversion starts. Negligible compared to Readability extraction time.

- **Test matrix expansion** → Two settings x two modes = more test cases. Mitigated by testing each setting independently rather than all combinations.
