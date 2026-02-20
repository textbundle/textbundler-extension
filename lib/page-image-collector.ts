import type { PageImage } from './types';
import { isImageUrl } from './image-url-utils';

const SKIP_ANCESTORS = new Set(['NAV', 'HEADER', 'FOOTER']);
const MIN_DIMENSION = 50;

function hasSkippedAncestor(el: Element): boolean {
  let parent = el.parentElement;
  while (parent) {
    if (SKIP_ANCESTORS.has(parent.nodeName)) return true;
    parent = parent.parentElement;
  }
  return false;
}

function isTooSmall(img: HTMLImageElement): boolean {
  const w = img.naturalWidth || parseInt(img.getAttribute('width') || '0', 10);
  const h = img.naturalHeight || parseInt(img.getAttribute('height') || '0', 10);
  if (w === 0 && h === 0) return false;
  return w < MIN_DIMENSION && h < MIN_DIMENSION;
}

function resolveUrl(src: string, baseUrl: string): string | null {
  try {
    return new URL(src, baseUrl).href;
  } catch {
    return null;
  }
}

/**
 * Collect substantial images from the full page DOM.
 * Skips tiny images, data: URIs, and images inside nav/header/footer.
 * Applies "prefer linked full-size" logic for `<a>` wrapped images.
 *
 * @param doc - The full page Document
 * @param baseUrl - Base URL for resolving relative image sources
 * @returns Array of PageImage with absolute URLs and alt text
 */
export function collectPageImages(doc: Document, baseUrl: string): PageImage[] {
  const imgs = doc.body ? Array.from(doc.body.querySelectorAll('img')) : [];
  const seen = new Set<string>();
  const result: PageImage[] = [];

  for (const img of imgs) {
    if (hasSkippedAncestor(img)) continue;
    if (isTooSmall(img as HTMLImageElement)) continue;

    let src = img.getAttribute('src') || '';
    if (!src || src.startsWith('data:')) continue;

    const parent = img.parentElement;
    if (parent?.nodeName === 'A') {
      const href = parent.getAttribute('href');
      if (href && isImageUrl(href)) {
        src = href;
      }
    }

    const absolute = resolveUrl(src, baseUrl);
    if (!absolute) continue;

    if (seen.has(absolute)) continue;
    seen.add(absolute);

    result.push({
      url: absolute,
      alt: img.getAttribute('alt') || '',
    });
  }

  return result;
}
