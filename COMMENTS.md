# Review Notes: TASK-001

## Observations Carried Forward

- WXT builds to `.output/chrome-mv3/` by default, not `dist/`. The spec acceptance criteria mention `dist/` but this is the standard WXT behavior. CLAUDE.md also references `dist/` as the build output; a future task may want to align that documentation with the actual WXT output directory.
- The content script template was removed since the spec architecture (Section 2.2, CLAUDE.md conventions) uses on-demand injection via `scripting.executeScript()` rather than manifest-declared content scripts. This is correct per the spec.
- The popup entrypoint was removed as it is not part of the spec architecture. The extension uses toolbar button and context menu triggers, which will be wired in later tasks.
