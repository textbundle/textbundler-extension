# Review Checklist

Evaluate each applicable category. Skip irrelevant items.

## Acceptance Criteria

- Every acceptance criterion from the task description in Section 7.2 is met.
- If the task has a `Reqs` field, the implementation satisfies those requirement IDs.
- If the task depends on other tasks, the dependencies are complete (files exist, tests pass).

## Type Contracts (Section 4.2)

- Types in `lib/types.ts` match Section 4.2 definitions exactly.
- Functions accept and return the correct types.
- No `any` where a specific type exists.
- Fields that should be `null` (not `undefined`) use `null` consistently.

## Module Conventions (Section 10.4)

- Named exports only (no default exports, except WXT entrypoints).
- Each module exports a single primary function matching the module name.
- `null` for expected failures; throw only for programmer errors.
- Logger calls include the module name: `logger.info("module-name", ...)`.
- Logger prefix format: `[TextBundler:{module}]`.

## Testing (Section 10.3)

- Test file at expected path (`tests/{module-name}.test.ts`).
- All test scenarios listed in the task description are covered.
- No network calls — `fetch()` mocked via `vi.stubGlobal()` or `vi.fn()`.
- Golden file comparisons use `normalizeMarkdown()`.
- Readability tests have 10s timeout (`{ timeout: 10000 }`).
- Tests are meaningful (not just asserting truthy or testing mocks).
- No test pollution (isolated tests, proper setup/teardown).

## Golden File Conventions (Section 10.7)

- Generated from Turndown output with fix-ups, not hand-authored.
- Whitespace: one blank line between blocks, no trailing whitespace, LF only, single trailing newline.
- Heading levels preserved exactly (no promotion/demotion).
- Images use `assets/image-NNN.ext` (3-digit zero-padded).
- Tables, details/summary, sup/sub, figures, video iframes preserved as inline HTML.
- Admonitions use `> [!TYPE]` format.

## Data Conventions

- Image filenames: `image-NNN.ext` (3-digit zero-padded, lowercase, extension from URL, fallback `.jpg`).
- Output filename: `{YYYY-MM-DD}-{slug}.textpack`.
- Slug algorithm matches Section 4.7.
- Frontmatter: null/undefined fields omitted entirely.
- All filenames inside bundles, image filenames, and slugs are lowercase.

## Code Quality

- No `browser.*` API calls in `lib/` modules (confined to `entrypoints/`).
- No unused imports, variables, or dead code.
- No hardcoded values that should be constants.
- Error handling: `null` for expected failures, throw for programmer errors.
- No `eval()`, unescaped user content, or injection vectors.

## Documentation

- Every exported function has JSDoc with purpose, params, return, and spec requirement ID.
- Non-obvious choices have a comment referencing DD-XX or DA-XX.
- No noise comments restating the code.

## Git Hygiene

- Commits reference the task ID: `feat(task-NNN): ...`.
- No unrelated changes bundled.
- No secrets, credentials, or `.env` files.
- No build artifacts (`dist/`, `node_modules/`).
