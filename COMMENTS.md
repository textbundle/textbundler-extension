# Review Notes: TASK-003

## Observations Carried Forward

- WXT builds to `.output/chrome-mv3/` by default, not `dist/`. The spec acceptance criteria mention `dist/` but this is the standard WXT behavior. CLAUDE.md also references `dist/` as the build output; a future task may want to align that documentation with the actual WXT output directory.
- The content script template was removed since the spec architecture (Section 2.2, CLAUDE.md conventions) uses on-demand injection via `scripting.executeScript()` rather than manifest-declared content scripts. This is correct per the spec.
- The popup entrypoint was removed as it is not part of the spec architecture. The extension uses toolbar button and context menu triggers, which will be wired in later tasks.
- The spec describes the non-article test input as "a minimal non-article HTML (inline string with a `<form>` login page, no article structure)" but Readability under linkedom does not return null for form-based HTML -- it still extracts content. The test uses an empty body instead, which correctly validates the null return path. This is a known linkedom/Readability behavioral difference worth noting for future Readability-dependent tasks (DA-04, linkedom issue #43).
