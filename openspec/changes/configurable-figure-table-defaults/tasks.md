## 1. Types and Settings Infrastructure

- [x] 1.1 Add `ConversionSettings` interface to `lib/types.ts` with `figureStyle` and `tableStyle` fields typed as `'markdown' | 'html'`
- [x] 1.2 Create `lib/conversion-settings.ts` exporting `DEFAULT_CONVERSION_SETTINGS` constant (`{ figureStyle: 'markdown', tableStyle: 'markdown' }`) and `applyDefaults()` helper that merges partial settings with defaults
- [x] 1.3 Add unit tests for `applyDefaults()` — full settings passthrough, partial merge, empty/undefined input returns defaults

## 2. Markdown Converter — Figure Rules

- [x] 2.1 Add optional `settings` parameter to `convertToMarkdown()` signature, defaulting to `DEFAULT_CONVERSION_SETTINGS`
- [x] 2.2 Implement Markdown-mode figure rule: `<figure>` with `<img>` and `<figcaption>` → `![alt](assets/image-NNN.ext)` + `*caption*`; handle figure without caption; share image counter with standalone images
- [x] 2.3 Make existing HTML-mode figure rule conditional on `figureStyle: 'html'`
- [x] 2.4 Update existing figure tests to assert new Markdown default output
- [x] 2.5 Add test group for `figureStyle: 'html'` — assert prior inline HTML output with asset path rewriting

## 3. Markdown Converter — Table Rules

- [x] 3.1 Implement complex table auto-detection: inspect `<td>` and `<th>` for `colspan > 1` or `rowspan > 1`, check for nested `<table>` elements
- [x] 3.2 When `tableStyle: 'markdown'` and table is simple, remove `table`/`tableChildren` override rules so GFM plugin handles conversion
- [x] 3.3 When `tableStyle: 'markdown'` and table is complex, fall back to inline HTML output
- [x] 3.4 Make existing HTML-mode table rules conditional on `tableStyle: 'html'`
- [x] 3.5 Add tests for complex table detection: `<td colspan="2">`, `<th colspan="3">` in `<thead>`, `<td rowspan="3">`, `<th rowspan="2">`, nested `<table>`
- [x] 3.6 Add tests for simple table GFM conversion with `<thead>`/`<tbody>` and without (bare `<tr>` rows)
- [x] 3.7 Add test group for `tableStyle: 'html'` — assert all tables preserved as inline HTML

## 4. Golden Files and Downstream Tests

- [x] 4.1 Regenerate `tests/fixtures/figure-caption.expected.md` for Markdown image + italic caption output
- [x] 4.2 Regenerate `tests/fixtures/html-table.expected.md` for GFM pipe table output
- [x] 4.3 Update `tests/image-patcher.test.ts` if figure-related patching tests assume `<figure>` HTML output
- [x] 4.4 Run full test suite (`npm test`) and typecheck (`npm run typecheck`) — all must pass

## 5. Content Script Integration

- [x] 5.1 Update `entrypoints/content.ts` to read `conversionSettings` from `browser.storage.sync` before calling `convertToMarkdown()`, using `applyDefaults()` to merge with defaults
- [x] 5.2 Verify build passes (`npm run build`) with the async storage read in the message listener

## 6. Options Page

- [x] 6.1 Create `entrypoints/options/index.html` with two `<select>` dropdowns for Figures and Tables (Markdown / HTML options)
- [x] 6.2 Create `entrypoints/options/main.ts` — on load read `browser.storage.sync` and set form values; on change write to `browser.storage.sync`
- [x] 6.3 Verify WXT auto-registers the options page (`npm run build`, check manifest for `options_ui`)
