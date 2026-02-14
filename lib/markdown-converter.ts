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

  const VIDEO_HOSTS = /youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|dai\.ly/i;

  // FR-002: Tables preserved as inline HTML (overrides GFM table conversion)
  turndownService.addRule('table', {
    filter: ['table'],
    replacement: (_content, node) => {
      return '\n\n' + (node as HTMLElement).outerHTML + '\n\n';
    },
  });

  // FR-002: Prevent GFM from converting table children
  turndownService.addRule('tableChildren', {
    filter: ['thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col'],
    replacement: () => '',
  });

  // FR-002: Details/summary preserved as inline HTML
  turndownService.addRule('details', {
    filter: ['details'],
    replacement: (_content, node) => {
      return '\n\n' + (node as HTMLElement).outerHTML + '\n\n';
    },
  });

  // FR-002: Prevent Turndown from converting summary children independently
  turndownService.addRule('summary', {
    filter: ['summary'],
    replacement: () => '',
  });

  // FR-002: Sup preserved as inline HTML
  turndownService.addRule('sup', {
    filter: ['sup'],
    replacement: (_content, node) => {
      return (node as HTMLElement).outerHTML;
    },
  });

  // FR-002: Sub preserved as inline HTML
  turndownService.addRule('sub', {
    filter: ['sub'],
    replacement: (_content, node) => {
      return (node as HTMLElement).outerHTML;
    },
  });

  // FR-002: Video iframes preserved as inline HTML
  turndownService.addRule('videoIframe', {
    filter: (node) => {
      if (node.nodeName !== 'IFRAME') return false;
      const src = node.getAttribute('src') || '';
      return VIDEO_HOSTS.test(src);
    },
    replacement: (_content, node) => {
      return '\n\n' + (node as HTMLElement).outerHTML + '\n\n';
    },
  });

  const markdown = turndownService.turndown(html);

  return { markdown, imageMap };
}
