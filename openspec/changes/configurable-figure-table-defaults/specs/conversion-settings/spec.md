## ADDED Requirements

### Requirement: ConversionSettings type and defaults
The system SHALL define a `ConversionSettings` interface in `lib/types.ts` with `figureStyle` and `tableStyle` fields, each typed as `'markdown' | 'html'`. A `DEFAULT_CONVERSION_SETTINGS` constant SHALL export `{ figureStyle: 'markdown', tableStyle: 'markdown' }` from `lib/conversion-settings.ts`.

#### Scenario: Default settings use Markdown mode
- **WHEN** no settings are stored in `browser.storage.sync`
- **THEN** `convertToMarkdown()` SHALL use `{ figureStyle: 'markdown', tableStyle: 'markdown' }`

#### Scenario: Partial settings merged with defaults
- **WHEN** `browser.storage.sync` contains `{ figureStyle: 'html' }` but no `tableStyle`
- **THEN** the applied settings SHALL be `{ figureStyle: 'html', tableStyle: 'markdown' }`

### Requirement: Figure Markdown conversion (default)
When `figureStyle` is `'markdown'`, `convertToMarkdown()` SHALL convert `<figure>` elements containing `<img>` and `<figcaption>` to Markdown image syntax followed by an italic caption. The `<img>` `src` SHALL be rewritten to `assets/image-NNN.ext` paths. Image counter SHALL be shared with standalone images.

#### Scenario: Figure with image and caption
- **WHEN** HTML contains `<figure><img src="https://example.com/photo.jpg" alt="A photo"><figcaption>Photo caption</figcaption></figure>`
- **THEN** output SHALL be `![A photo](assets/image-001.jpg)\n*Photo caption*`

#### Scenario: Figure with image but no caption
- **WHEN** HTML contains `<figure><img src="https://example.com/photo.jpg" alt="A photo"></figure>`
- **THEN** output SHALL be `![A photo](assets/image-001.jpg)`

#### Scenario: Figure image counter shared with standalone images
- **WHEN** HTML contains a standalone `<img>` followed by a `<figure>` with `<img>`
- **THEN** the standalone image SHALL be `image-001` and the figure image SHALL be `image-002`

### Requirement: Figure HTML preservation (opt-in)
When `figureStyle` is `'html'`, `convertToMarkdown()` SHALL preserve `<figure>` elements as inline HTML with `<img>` `src` rewritten to `assets/` paths. This matches the prior default behavior from TASK-012b.

#### Scenario: Figure preserved as HTML when setting is html
- **WHEN** `figureStyle` is `'html'` and HTML contains `<figure><img src="https://example.com/photo.jpg" alt="A photo"><figcaption>Photo caption</figcaption></figure>`
- **THEN** output SHALL contain `<figure><img src="assets/image-001.jpg" alt="A photo"><figcaption>Photo caption</figcaption></figure>` as inline HTML

### Requirement: Table Markdown conversion (default)
When `tableStyle` is `'markdown'`, `convertToMarkdown()` SHALL allow the GFM plugin to convert simple `<table>` elements to GFM pipe table syntax. The `table` and `tableChildren` override rules SHALL NOT be registered.

#### Scenario: Simple table converted to GFM
- **WHEN** `tableStyle` is `'markdown'` and HTML contains a simple `<table>` with `<thead>` and `<tbody>`
- **THEN** output SHALL be a GFM pipe table with header row, separator row, and data rows

### Requirement: Complex table auto-detection and HTML fallback
When `tableStyle` is `'markdown'`, `convertToMarkdown()` SHALL inspect each `<table>` for complexity before allowing GFM conversion. A table is complex if any `<td>` or `<th>` has a `colspan` attribute with value greater than 1, any `<td>` or `<th>` has a `rowspan` attribute with value greater than 1, or the table contains a nested `<table>` element. Complex tables SHALL fall back to inline HTML output regardless of the `tableStyle` setting.

#### Scenario: td with colspan falls back to HTML
- **WHEN** `tableStyle` is `'markdown'` and a `<td>` has `colspan="2"`
- **THEN** the table SHALL be preserved as inline HTML

#### Scenario: th with colspan falls back to HTML
- **WHEN** `tableStyle` is `'markdown'` and a `<th>` in `<thead>` has `colspan="3"`
- **THEN** the table SHALL be preserved as inline HTML

#### Scenario: td with rowspan falls back to HTML
- **WHEN** `tableStyle` is `'markdown'` and a `<td>` has `rowspan="3"`
- **THEN** the table SHALL be preserved as inline HTML

#### Scenario: th with rowspan falls back to HTML
- **WHEN** `tableStyle` is `'markdown'` and a `<th>` has `rowspan="2"`
- **THEN** the table SHALL be preserved as inline HTML

#### Scenario: Table with nested table falls back to HTML
- **WHEN** `tableStyle` is `'markdown'` and the `<table>` contains a nested `<table>` element
- **THEN** the outer table SHALL be preserved as inline HTML

#### Scenario: Simple table with thead/tbody converts to GFM
- **WHEN** `tableStyle` is `'markdown'` and the table has `<thead>` and `<tbody>` with no `colspan > 1`, `rowspan > 1`, or nested tables
- **THEN** the table SHALL be converted to GFM pipe table syntax

#### Scenario: Simple table without thead/tbody converts to GFM
- **WHEN** `tableStyle` is `'markdown'` and the table has only `<tr>` rows (no `<thead>`/`<tbody>` wrappers) with no `colspan > 1`, `rowspan > 1`, or nested tables
- **THEN** the table SHALL be converted to GFM pipe table syntax

### Requirement: Table HTML preservation (opt-in)
When `tableStyle` is `'html'`, `convertToMarkdown()` SHALL preserve all `<table>` elements as inline HTML, matching the prior default behavior from TASK-012a. Complex table auto-detection is not needed in this mode since all tables are already HTML.

#### Scenario: Table preserved as HTML when setting is html
- **WHEN** `tableStyle` is `'html'` and HTML contains a `<table>`
- **THEN** the table SHALL be preserved as inline HTML

### Requirement: convertToMarkdown accepts optional settings
`convertToMarkdown()` SHALL accept an optional `settings: ConversionSettings` parameter. When omitted, `DEFAULT_CONVERSION_SETTINGS` SHALL be used. The settings parameter SHALL control which Turndown rules are registered for figures and tables.

#### Scenario: Called without settings uses defaults
- **WHEN** `convertToMarkdown(html)` is called without a settings argument
- **THEN** behavior SHALL be identical to calling with `DEFAULT_CONVERSION_SETTINGS`

#### Scenario: Called with explicit settings
- **WHEN** `convertToMarkdown(html, { figureStyle: 'html', tableStyle: 'markdown' })` is called
- **THEN** figures SHALL be HTML and tables SHALL be GFM (with complex table fallback)

### Requirement: Settings persistence via browser.storage.sync
The extension SHALL store `ConversionSettings` in `browser.storage.sync` under the key `conversionSettings`. The content script SHALL read settings before each conversion. The options page SHALL read and write settings.

#### Scenario: Settings persist across sessions
- **WHEN** user sets `figureStyle` to `'html'` in the options page and restarts the browser
- **THEN** the next conversion SHALL use `figureStyle: 'html'`

### Requirement: Options page UI
The extension SHALL provide an options page accessible via `browser.runtime.openOptionsPage()` with controls for `figureStyle` and `tableStyle`. Each control SHALL offer "Markdown" and "HTML" options. Changes SHALL be saved immediately to `browser.storage.sync`.

#### Scenario: Options page loads with current settings
- **WHEN** user opens the options page and `figureStyle` is `'html'` in storage
- **THEN** the Figures control SHALL show "HTML" selected

#### Scenario: Changing a setting saves immediately
- **WHEN** user changes the Tables control from "Markdown" to "HTML"
- **THEN** `browser.storage.sync` SHALL be updated with `{ tableStyle: 'html' }` without requiring a save button
