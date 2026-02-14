/**
 * Normalize markdown output for golden file comparison.
 * Section 10.7: strips trailing whitespace, normalizes line endings,
 * collapses blank lines, ensures single trailing newline.
 * @param str - Raw markdown string
 * @returns Normalized markdown string
 */
export function normalizeMarkdown(str: string): string {
  return (
    str
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\n*$/, '\n')
  );
}
