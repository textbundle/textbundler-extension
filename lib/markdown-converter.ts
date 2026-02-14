import TurndownService from 'turndown';
// @ts-expect-error turndown-plugin-gfm has no type declarations
import { gfm } from 'turndown-plugin-gfm';
import type { ImageMap } from './types';

/**
 * Convert HTML content to Markdown using Turndown with GFM plugin.
 * Returns the markdown string and an imageMap tracking original URLs to asset paths.
 * The imageMap is empty in the base configuration; it is populated by the
 * image rewriting rule added in TASK-012b.
 *
 * @param html - HTML string to convert (typically from Readability extraction)
 * @returns Object with `markdown` (converted Markdown string) and `imageMap` (URL-to-asset mapping)
 * @see Section 7.2 TASK-011, FR-002
 */
export function convertToMarkdown(html: string): {
  markdown: string;
  imageMap: ImageMap;
} {
  const imageMap: ImageMap = {};

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
  });

  turndownService.use(gfm);

  const markdown = turndownService.turndown(html);

  return { markdown, imageMap };
}
