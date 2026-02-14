import TurndownService from 'turndown';
// @ts-expect-error turndown-plugin-gfm has no type declarations
import { gfm } from 'turndown-plugin-gfm';
import type { ImageMap } from './types';

function extractExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const lastDot = pathname.lastIndexOf('.');
    if (lastDot !== -1) {
      const ext = pathname.slice(lastDot).toLowerCase();
      if (/^\.[a-z0-9]+$/.test(ext)) return ext;
    }
  } catch {
    // DD-12: fallback to .jpg for malformed URLs
  }
  return '.jpg';
}

/**
 * Convert HTML content to Markdown using Turndown with GFM plugin.
 * Returns the markdown string and an imageMap tracking original URLs to asset paths.
 * The imageMap is populated by the figure and image rewriting rules.
 *
 * @param html - HTML string to convert (typically from Readability extraction)
 * @returns Object with `markdown` (converted Markdown string) and `imageMap` (URL-to-asset mapping)
 * @see Section 7.2 TASK-011, TASK-012b, FR-002
 */
export function convertToMarkdown(html: string): {
  markdown: string;
  imageMap: ImageMap;
} {
  const imageMap: ImageMap = {};
  let imageCounter = 0;

  function getAssetPath(originalUrl: string): string {
    if (imageMap[originalUrl]) return imageMap[originalUrl];
    imageCounter++;
    const ext = extractExtension(originalUrl);
    const filename = `assets/image-${String(imageCounter).padStart(3, '0')}${ext}`;
    imageMap[originalUrl] = filename;
    return filename;
  }

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

  // FR-002: Figures preserved as inline HTML with img src rewritten to assets/ paths
  turndownService.addRule('figure', {
    filter: ['figure'],
    replacement: (_content, node) => {
      const el = node as HTMLElement;
      const imgs = Array.from(el.getElementsByTagName('img'));
      for (const img of imgs) {
        const src = img.getAttribute('src');
        if (src) {
          img.setAttribute('src', getAssetPath(src));
        }
      }
      return '\n\n' + el.outerHTML + '\n\n';
    },
  });

  // FR-002: Prevent Turndown from converting figcaption independently
  turndownService.addRule('figcaption', {
    filter: ['figcaption'],
    replacement: () => '',
  });

  // FR-002: Standalone image src rewriting to assets/ paths
  turndownService.addRule('image', {
    filter: (node) => {
      if (node.nodeName !== 'IMG') return false;
      // Skip images inside figures (handled by figure rule)
      let parent = node.parentElement;
      while (parent) {
        if (parent.nodeName === 'FIGURE') return false;
        parent = parent.parentElement;
      }
      return true;
    },
    replacement: (_content, node) => {
      const el = node as HTMLElement;
      const src = el.getAttribute('src') || '';
      const alt = el.getAttribute('alt') || '';
      const assetPath = getAssetPath(src);
      return `![${alt}](${assetPath})`;
    },
  });

  const markdown = turndownService.turndown(html);

  return { markdown, imageMap };
}
