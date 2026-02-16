# Review Notes: configurable-figure-table-defaults (All Task Groups)

## Observations Carried Forward

**O-1: applyDefaults merge logic**
The `applyDefaults()` implementation correctly uses object spread to merge defaults with partial overrides, handling `undefined` input gracefully.

**O-2: ConversionSettings type placement**
The `ConversionSettings` interface placement in `lib/types.ts` is correct per spec Section 4.2.

**O-3: Tables without thead remain as HTML in markdown mode**
Tables without `<thead>` stay as HTML even in markdown mode because the GFM plugin requires a header row for pipe table conversion. This is correct since GFM pipe tables always need a header separator line.

**O-4: Image patcher test compatibility**
The image-patcher test for figure HTML patching still passes because it constructs its own HTML strings rather than using `convertToMarkdown()` output. Future changes to the patcher may need to account for both markdown and HTML figure formats.

**O-5: Complex table detection scope**
`isComplexTable()` uses `querySelectorAll('td, th')` which also matches cells in nested tables. This is intentional -- if any nested table has complex cells, the outer table is correctly flagged as complex.
