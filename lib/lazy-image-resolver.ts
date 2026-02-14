const LAZY_ATTRS = ['data-src', 'data-lazy-src', 'data-original'] as const;

const PLACEHOLDER_PATTERN = /^data:image\/(?:gif|png);base64,/;

/**
 * Resolve lazy-loaded images in a document by setting their src to the actual image URL.
 * Handles data-src, data-lazy-src, data-original attributes, srcset parsing,
 * and picture element sources. Mutates the document in place. FR-001.
 *
 * @param document - The DOM document to process
 */
export function resolveLazyImages(document: Document): void {
  const imgs = document.querySelectorAll('img');
  for (const img of imgs) {
    resolveLazyImg(img);
  }

  const pictures = document.querySelectorAll('picture');
  for (const picture of pictures) {
    resolvePicture(picture);
  }
}

function resolveLazyImg(img: Element): void {
  for (const attr of LAZY_ATTRS) {
    const value = img.getAttribute(attr);
    if (value) {
      img.setAttribute('src', value);
      return;
    }
  }

  const srcset = img.getAttribute('srcset');
  if (srcset) {
    const best = pickBestFromSrcset(srcset);
    if (best) {
      img.setAttribute('src', best);
      return;
    }
  }

  const src = img.getAttribute('src') ?? '';
  if (isPlaceholder(src)) {
    // src is a placeholder but no lazy attribute found - nothing we can do
  }
}

function resolvePicture(picture: Element): void {
  const sources = picture.querySelectorAll('source');
  const img = picture.querySelector('img');
  if (!img) return;

  for (const source of sources) {
    const srcset = source.getAttribute('srcset');
    if (srcset) {
      const best = pickBestFromSrcset(srcset);
      if (best) {
        img.setAttribute('src', best);
        return;
      }
    }
  }
}

function isPlaceholder(src: string): boolean {
  return !src || PLACEHOLDER_PATTERN.test(src);
}

/**
 * Parse a srcset attribute and pick the URL with the largest width or pixel density.
 * Supports both 'w' (width) and 'x' (density) descriptors.
 */
function pickBestFromSrcset(srcset: string): string | null {
  const candidates = srcset
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const parts = entry.split(/\s+/);
      const url = parts[0];
      const descriptor = parts[1] ?? '';
      let value = 1;
      if (descriptor.endsWith('w')) {
        value = parseInt(descriptor, 10) || 0;
      } else if (descriptor.endsWith('x')) {
        value = parseFloat(descriptor) || 1;
      }
      return { url, value };
    });

  if (candidates.length === 0) return null;

  let best = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].value > best.value) {
      best = candidates[i];
    }
  }
  return best.url;
}
