import { logger } from './logger';

/**
 * Trigger a browser download for the given blob with the specified filename.
 * Uses browser.downloads API when available (Chrome, Firefox), falling back
 * to anchor-click download for Safari which lacks the downloads API.
 * Revokes the object URL via browser.downloads.onChanged listener once the
 * download begins (not a timeout). DD-05, FR-005, INT-003.
 *
 * @param blob - The file content as a Blob
 * @param filename - The desired download filename
 * @returns Promise that resolves when the download is initiated
 */
export async function triggerDownload(blob: Blob, filename: string): Promise<void> {
  if (!browser.downloads?.download) {
    logger.info('download-trigger', 'browser.downloads not available, using anchor fallback (Safari)');
    await anchorDownload(blob, filename);
    return;
  }

  type DownloadChangedCallback = Parameters<typeof browser.downloads.onChanged.addListener>[0];

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

/**
 * Safari fallback: send a message to the content script to perform
 * an anchor-click download, since background scripts cannot create DOM elements.
 * Falls back to opening a blob URL in a new tab if messaging fails.
 */
async function anchorDownload(blob: Blob, filename: string): Promise<void> {
  const dataUrl = await blobToDataUrl(blob);

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    try {
      await browser.tabs.sendMessage(tab.id, {
        type: 'download-file',
        dataUrl,
        filename,
      });
      logger.info('download-trigger', 'Anchor download via content script', { filename });
      return;
    } catch {
      logger.info('download-trigger', 'Content script messaging failed, opening blob in new tab');
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  await browser.tabs.create({ url: objectUrl });
  logger.info('download-trigger', 'Opened blob URL in new tab', { filename });
}
