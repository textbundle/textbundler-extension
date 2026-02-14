# Review Notes: TASK-020

## Observations Carried Forward

**O-1: Fetch mock design**
The mock function correctly handles URL, URL object, and Request input types. The conditional branching properly extracts the URL string from each type, and the responses correctly simulate both successful PNG downloads (with Content-Type header) and 404 failures.

**O-2: Manual imageMap modification pattern**
The test manually adds a second image to the imageMap to simulate the failure scenario. This is an intentional and appropriate pattern for testing the failure path, since convertToMarkdown only discovers images actually present in the HTML fixture. The synthetic addition enables testing of the failed image patching workflow.

**O-3: Asset filename handling across the pipeline**
The test correctly accounts for the design pattern where convertToMarkdown returns filenames with `assets/` prefix in the imageMap, downloadImages preserves these prefixes in returned assets, and then the test strips them before passing to packageBundle (which expects unprefixed filenames and adds the `assets/` prefix internally at line 44 of bundle-packager.ts). This design is consistent with existing tests in image-downloader.test.ts.

**O-4: Comprehensive spec requirement coverage**
All 12 requirements from the task description are directly addressed: HTML parsing, extraction, metadata, Markdown conversion, fetch mocking with success/404 paths, image downloading, failed asset patching, frontmatter generation, packaging, zip structure validation, failed image URL restoration, content leakage checks, and the null extraction failure case.

### Prior Tasks

- TASK-018c: Badge state management, notification display, and concurrent-click guard implemented correctly per spec.
- TASK-018b: All seven pipeline steps implemented in correct order. Error handling paths properly documented and tested.
- TASK-015: Bundle packager correctly assembles TextBundle v2 archives per Section 4.4.
- TASK-012a: VIDEO_HOSTS regex covers major platforms. tableChildren rule prevents GFM recursion.
- TASK-004a / TASK-011: Readability demotes h1 to h2 in its output. Golden files reflect this behavior.
- TASK-004: non-article.html uses redirect page pattern for Readability null extraction testing.
