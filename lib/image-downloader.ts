import { logger } from './logger';
import type { ImageAsset, ImageMap } from './types';

const MAX_CONCURRENCY = 4;
const TIMEOUT_MS = 30_000;

/**
 * Download images from the provided image map with concurrency limiting.
 * Each URL is fetched with credentials: "include" for auth-protected images.
 * Failed downloads produce ImageAsset with failed: true rather than throwing.
 * FR-004, NFR-002, NFR-005.
 *
 * @param imageMap - Map from original image URL to assets/ filename
 * @returns Array of ImageAsset objects (both successful and failed)
 */
export async function downloadImages(imageMap: ImageMap): Promise<ImageAsset[]> {
  const entries = Object.entries(imageMap);
  if (entries.length === 0) return [];

  const seen = new Set<string>();
  const uniqueEntries: [string, string][] = [];
  for (const [url, filename] of entries) {
    if (!seen.has(url)) {
      seen.add(url);
      uniqueEntries.push([url, filename]);
    }
  }

  const results: ImageAsset[] = [];
  let running = 0;
  let index = 0;

  return new Promise((resolve) => {
    function next() {
      while (running < MAX_CONCURRENCY && index < uniqueEntries.length) {
        const [url, filename] = uniqueEntries[index++];
        running++;
        fetchImage(url, filename).then((asset) => {
          results.push(asset);
          running--;
          if (results.length === uniqueEntries.length) {
            resolve(results);
          } else {
            next();
          }
        });
      }
    }
    next();
  });
}

async function fetchImage(url: string, filename: string): Promise<ImageAsset> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      credentials: 'include',
      mode: 'cors',
      signal: controller.signal,
    });

    if (!response.ok) {
      logger.warn('image-downloader', `Failed to download image: HTTP ${response.status}`, { url });
      return { originalUrl: url, filename, data: new ArrayBuffer(0), mimeType: '', failed: true };
    }

    const data = await response.arrayBuffer();
    const mimeType = response.headers.get('Content-Type') ?? 'application/octet-stream';

    return { originalUrl: url, filename, data, mimeType, failed: false };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    logger.warn('image-downloader', `Failed to download image: ${reason}`, { url });
    return { originalUrl: url, filename, data: new ArrayBuffer(0), mimeType: '', failed: true };
  } finally {
    clearTimeout(timeoutId);
  }
}
