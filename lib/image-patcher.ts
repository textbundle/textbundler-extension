import type { ImageAsset, ImageMap } from './types';

/**
 * Revert failed image asset paths back to their original absolute URLs.
 * For each failed asset, replaces all occurrences of its assets/ filename
 * in the markdown with the original URL. Works for both Markdown image syntax
 * and inline HTML img tags since the filename string is unique and deterministic.
 * FR-004, NFR-005.
 *
 * @param markdown - The markdown string with assets/ image paths
 * @param _imageMap - The image map (original URL to assets/ filename) - unused but kept for API consistency
 * @param failedAssets - Array of ImageAsset objects with failed: true
 * @returns Patched markdown with failed image paths reverted to absolute URLs
 */
export function patchFailedImageUrls(
  markdown: string,
  _imageMap: ImageMap,
  failedAssets: ImageAsset[],
): string {
  let patched = markdown;
  for (const asset of failedAssets) {
    patched = patched.replaceAll(asset.filename, asset.originalUrl);
  }
  return patched;
}
