# ADR-001: Content Script Owns Markdown Conversion

## Status

Accepted

## Date

2026-02-15

## Context

TASK-018b specifies background pipeline orchestration including `convertToMarkdown()`. During implementation, Turndown (which depends on `DOMParser`) crashed in Chrome MV3 service workers with `document is not defined`. Service workers are intentionally DOM-free in MV3.

## Decision

Move `convertToMarkdown()` to the content script. The content script sends pre-converted markdown and imageMap to the background via `ExtractionResult`. Background retains ownership of image downloading, failed-image patching, frontmatter, packaging, and download triggering.

## Consequences

- Content script message payload is larger (markdown + imageMap vs just article HTML)
- Content script takes slightly longer (Turndown processing)
- Cross-browser compatible (works in both Firefox MV2 and Chrome MV3)
- Background pipeline is simpler (no DOM dependency)

## Alternatives Considered

- **Chrome offscreen document API for DOM parsing** — adds complexity, Chrome-only
- **Bundling a non-DOM Turndown** — doesn't exist; Turndown requires DOMParser
- **Using linkedom in service worker** — adds ~50KB bundle, untested in SW context

## References

- Commit `bbf6d37`
- TASK-018b spec
- Chrome MV3 service worker documentation
- DD-16 in SPEC.md Section 9
