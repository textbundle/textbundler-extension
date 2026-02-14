import { logger } from './logger';

type DownloadChangedCallback = Parameters<typeof browser.downloads.onChanged.addListener>[0];

/**
 * Trigger a browser download for the given blob with the specified filename.
 * Uses URL.createObjectURL when available (Firefox, Chrome 116+), falling back
 * to data URL conversion for older Chrome service workers.
 * Revokes the object URL via browser.downloads.onChanged listener once the
 * download begins (not a timeout). DD-05, FR-005, INT-003.
 *
 * @param blob - The file content as a Blob
 * @param filename - The desired download filename
 * @returns Promise that resolves when the download is initiated
 */
export async function triggerDownload(blob: Blob, filename: string): Promise<void> {
  if (typeof URL.createObjectURL === 'function') {
    const objectUrl = URL.createObjectURL(blob);
    logger.debug('download-trigger', 'Created object URL for download', { filename });

    const downloadId = await browser.downloads.download({
      url: objectUrl,
      filename,
      saveAs: false,
    });

    const onChanged: DownloadChangedCallback = (delta) => {
      if (delta.id === downloadId && delta.state?.current) {
        const state = delta.state.current;
        if (state === 'in_progress' || state === 'complete') {
          URL.revokeObjectURL(objectUrl);
          browser.downloads.onChanged.removeListener(onChanged);
          logger.debug('download-trigger', 'Revoked object URL', { downloadId, state });
        }
      }
    };
    browser.downloads.onChanged.addListener(onChanged);
  } else {
    logger.info('download-trigger', 'URL.createObjectURL not available, using data URL fallback');
    const dataUrl = await blobToDataUrl(blob);
    await browser.downloads.download({
      url: dataUrl,
      filename,
      saveAs: false,
    });
  }

  logger.info('download-trigger', 'Download initiated', { filename });
}

/**
 * Convert a Blob to a data URL string.
 * @param blob - The blob to convert
 * @returns Promise resolving to the data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
    reader.readAsDataURL(blob);
  });
}
