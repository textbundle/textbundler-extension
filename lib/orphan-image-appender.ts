import type { ImageMap, PageImage } from './types';
import { extractExtension, extractBasename } from './image-url-utils';

/**
 * Append orphaned images (present in the full page but missing from Readability output)
 * as a markdown appendix after a `---` separator.
 *
 * @param markdown - The current markdown string
 * @param imageMap - The current image URL to asset path mapping
 * @param pageImages - All substantial images collected from the full page DOM
 * @returns Updated markdown and imageMap with orphaned images appended
 */
export function appendOrphanedImages(
  markdown: string,
  imageMap: ImageMap,
  pageImages: PageImage[],
): { markdown: string; imageMap: ImageMap } {
  const orphans = pageImages.filter((img) => !(img.url in imageMap));
  if (orphans.length === 0) return { markdown, imageMap };

  const newMap: ImageMap = { ...imageMap };
  const usedFilenames = new Set<string>(Object.values(imageMap));
  let counter = 0;

  function getAssetPath(originalUrl: string): string {
    if (newMap[originalUrl]) return newMap[originalUrl];
    const ext = extractExtension(originalUrl);
    let basename = extractBasename(originalUrl);
    if (!basename) {
      counter++;
      basename = `image-${String(counter).padStart(3, '0')}`;
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
    newMap[originalUrl] = candidate;
    return candidate;
  }

  const lines = orphans.map((img) => {
    const assetPath = getAssetPath(img.url);
    return `![${img.alt}](${assetPath})`;
  });

  const appendix = '\n\n---\n\n' + lines.join('\n\n');
  return { markdown: markdown + appendix, imageMap: newMap };
}
