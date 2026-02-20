import TurndownService from 'turndown';
// @ts-expect-error turndown-plugin-gfm has no type declarations
import { gfm } from 'turndown-plugin-gfm';
import type { ConversionSettings, ImageMap } from './types';
import { DEFAULT_CONVERSION_SETTINGS } from './conversion-settings';
import { extractExtension, extractBasename, isImageUrl } from './image-url-utils';

function resolveImageUrl(img: HTMLElement): string {
  const src = img.getAttribute('src') || '';
  const parent = img.parentElement;
  if (parent?.nodeName === 'A') {
    const href = parent.getAttribute('href');
    if (href && isImageUrl(href)) return href;
  }
  return src;
}

function isComplexTable(node: HTMLElement): boolean {
  const cells = Array.from(node.querySelectorAll('td, th'));
  for (const cell of cells) {
    const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
    const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);
    if (colspan > 1 || rowspan > 1) return true;
  }
  if (node.querySelector('table')) return true;
  return false;
}

/**
 * Convert HTML content to Markdown using Turndown with GFM plugin.
 * Returns the markdown string and an imageMap tracking original URLs to asset paths.
 * The imageMap is populated by the figure and image rewriting rules.
 *
 * @param html - HTML string to convert (typically from Readability extraction)
 * @param settings - Optional conversion settings controlling figure and table output mode
 * @returns Object with `markdown` (converted Markdown string) and `imageMap` (URL-to-asset mapping)
 * @see Section 7.2 TASK-011, TASK-012b, FR-002
 * @see openspec/changes/configurable-figure-table-defaults/design.md D2
 */
export function convertToMarkdown(
  html: string,
  settings?: ConversionSettings,
): {
  markdown: string;
  imageMap: ImageMap;
} {
  const resolvedSettings = settings ?? DEFAULT_CONVERSION_SETTINGS;
  const imageMap: ImageMap = {};
  const usedFilenames = new Set<string>();
  let imageCounter = 0;

  function getAssetPath(originalUrl: string): string {
    if (imageMap[originalUrl]) return imageMap[originalUrl];
    const ext = extractExtension(originalUrl);
    let basename = extractBasename(originalUrl);
    if (!basename) {
      imageCounter++;
      basename = `image-${String(imageCounter).padStart(3, '0')}`;
    }
    let candidate = `assets/${basename}${ext}`;
    if (usedFilenames.has(candidate)) {
      let suffix = 2;
      while (usedFilenames.has(`assets/${basename}-${suffix}${ext}`)) {
        suffix++;
      }
      candidate = `assets/${basename}-${suffix}${ext}`;
    }
    usedFilenames.add(candidate);
    imageMap[originalUrl] = candidate;
    return candidate;
  }

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
  });

  turndownService.use(gfm);

  const VIDEO_HOSTS = /youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|dai\.ly/i;

  if (resolvedSettings.tableStyle === 'html') {
    turndownService.addRule('table', {
      filter: ['table'],
      replacement: (_content, node) => {
        return '\n\n' + (node as HTMLElement).outerHTML + '\n\n';
      },
    });

    turndownService.addRule('tableChildren', {
      filter: ['thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col'],
      replacement: () => '',
    });
  } else {
    turndownService.addRule('complexTable', {
      filter: (node) => {
        if (node.nodeName !== 'TABLE') return false;
        return isComplexTable(node as HTMLElement);
      },
      replacement: (_content, node) => {
        return '\n\n' + (node as HTMLElement).outerHTML + '\n\n';
      },
    });

    turndownService.addRule('complexTableChildren', {
      filter: (node) => {
        if (!['THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'CAPTION', 'COLGROUP', 'COL'].includes(node.nodeName)) return false;
        let parent = node.parentElement;
        while (parent) {
          if (parent.nodeName === 'TABLE') {
            return isComplexTable(parent as HTMLElement);
          }
          parent = parent.parentElement;
        }
        return false;
      },
      replacement: () => '',
    });
  }

  turndownService.addRule('details', {
    filter: ['details'],
    replacement: (_content, node) => {
      return '\n\n' + (node as HTMLElement).outerHTML + '\n\n';
    },
  });

  turndownService.addRule('summary', {
    filter: ['summary'],
    replacement: () => '',
  });

  turndownService.addRule('sup', {
    filter: ['sup'],
    replacement: (_content, node) => {
      return (node as HTMLElement).outerHTML;
    },
  });

  turndownService.addRule('sub', {
    filter: ['sub'],
    replacement: (_content, node) => {
      return (node as HTMLElement).outerHTML;
    },
  });

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

  if (resolvedSettings.figureStyle === 'html') {
    turndownService.addRule('figure', {
      filter: ['figure'],
      replacement: (_content, node) => {
        const el = node as HTMLElement;
        const imgs = Array.from(el.getElementsByTagName('img'));
        for (const img of imgs) {
          const bestUrl = resolveImageUrl(img as HTMLElement);
          if (bestUrl) {
            const assetPath = getAssetPath(bestUrl);
            img.setAttribute('src', assetPath);
            const imgParent = img.parentElement;
            if (imgParent?.nodeName === 'A') {
              const href = imgParent.getAttribute('href');
              if (href && isImageUrl(href)) {
                imgParent.setAttribute('href', assetPath);
              }
            }
          }
        }
        return '\n\n' + el.outerHTML + '\n\n';
      },
    });

    turndownService.addRule('figcaption', {
      filter: ['figcaption'],
      replacement: () => '',
    });
  } else {
    turndownService.addRule('figure', {
      filter: ['figure'],
      replacement: (_content, node) => {
        const el = node as HTMLElement;
        const imgs = Array.from(el.getElementsByTagName('img'));
        const figcaption = el.querySelector('figcaption');
        const captionText = figcaption?.textContent?.trim() || '';

        let result = '';
        for (const img of imgs) {
          const bestUrl = resolveImageUrl(img as HTMLElement);
          const alt = img.getAttribute('alt') || '';
          const assetPath = getAssetPath(bestUrl);
          result += `![${alt}](${assetPath})`;
        }

        if (captionText) {
          result += `\n*${captionText}*`;
        }

        return '\n\n' + result + '\n\n';
      },
    });

    turndownService.addRule('figcaption', {
      filter: ['figcaption'],
      replacement: () => '',
    });
  }

  turndownService.addRule('linkedImage', {
    filter: (node) => {
      if (node.nodeName !== 'A') return false;
      let ancestor = node.parentElement;
      while (ancestor) {
        if (ancestor.nodeName === 'FIGURE') return false;
        ancestor = ancestor.parentElement;
      }
      const href = node.getAttribute('href');
      if (!href || !isImageUrl(href)) return false;
      const el = node as HTMLElement;
      return el.querySelectorAll('img').length === 1;
    },
    replacement: (_content, node) => {
      const el = node as HTMLElement;
      const href = el.getAttribute('href')!;
      const img = el.querySelector('img')!;
      const alt = img.getAttribute('alt') || '';
      return `![${alt}](${getAssetPath(href)})`;
    },
  });

  turndownService.addRule('image', {
    filter: (node) => {
      if (node.nodeName !== 'IMG') return false;
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

  for (const url of Object.keys(imageMap)) {
    if (!markdown.includes(imageMap[url])) {
      delete imageMap[url];
    }
  }

  return { markdown, imageMap };
}
