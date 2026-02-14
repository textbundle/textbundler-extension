import { logger } from '@/lib/logger';
import { convertToMarkdown } from '@/lib/markdown-converter';
import { downloadImages } from '@/lib/image-downloader';
import { patchFailedImageUrls } from '@/lib/image-patcher';
import { buildFrontmatter } from '@/lib/frontmatter-builder';
import { packageBundle } from '@/lib/bundle-packager';
import { triggerDownload } from '@/lib/download-trigger';
import type { ExtractionResult, ArchiveResponse } from '@/lib/types';

export default defineBackground(() => {
  logger.info('background', 'Service worker started');

  /**
   * Shared function to inject the content script and send a trigger message.
   * Used by both the toolbar button and context menu handlers. FR-006, FR-007.
   *
   * @param tabId - The tab to archive
   */
  async function archivePage(tabId: number): Promise<void> {
    logger.info('background', 'Archiving page', { tabId });

    await browser.scripting.executeScript({
      target: { tabId },
      files: ['/content-scripts/content.js'],
    });

    await browser.tabs.sendMessage(tabId, { type: 'trigger-archive' });
    logger.debug('background', 'Trigger message sent', { tabId });
  }

  /**
   * Run the full conversion pipeline on an ExtractionResult.
   * Converts HTML to Markdown, downloads images, patches failed image refs,
   * builds frontmatter, packages the bundle, and triggers download. FR-006.
   *
   * @param extraction - The extraction result from the content script
   * @returns ArchiveResponse indicating success or failure
   */
  async function runPipeline(extraction: ExtractionResult): Promise<ArchiveResponse> {
    const pipelineStart = Date.now();

    try {
      let stageStart = Date.now();
      const { markdown, imageMap } = convertToMarkdown(extraction.article.content);
      logger.debug('background', 'convertToMarkdown complete', { elapsed: Date.now() - stageStart });

      stageStart = Date.now();
      const assets = await downloadImages(imageMap);
      logger.debug('background', 'downloadImages complete', { elapsed: Date.now() - stageStart, total: assets.length, failed: assets.filter(a => a.failed).length });

      stageStart = Date.now();
      const failedAssets = assets.filter(a => a.failed);
      const patchedMarkdown = patchFailedImageUrls(markdown, imageMap, failedAssets);
      logger.debug('background', 'patchFailedImageUrls complete', { elapsed: Date.now() - stageStart });

      stageStart = Date.now();
      const frontmatter = buildFrontmatter(extraction.metadata, extraction.article.textContent);
      logger.debug('background', 'buildFrontmatter complete', { elapsed: Date.now() - stageStart });

      stageStart = Date.now();
      const successfulAssets = assets.filter(a => !a.failed);
      const { blob, filename } = await packageBundle(
        frontmatter,
        patchedMarkdown,
        successfulAssets,
        extraction.sourceUrl,
        extraction.metadata.title,
        extraction.metadata.date,
      );
      logger.debug('background', 'packageBundle complete', { elapsed: Date.now() - stageStart });

      stageStart = Date.now();
      await triggerDownload(blob, filename);
      logger.debug('background', 'triggerDownload complete', { elapsed: Date.now() - stageStart });

      const totalElapsed = Date.now() - pipelineStart;
      logger.info('background', 'Pipeline complete', { filename, totalElapsed });

      return { success: true, filename };
    } catch (err) {
      const totalElapsed = Date.now() - pipelineStart;
      logger.error('background', 'Pipeline failed', {
        error: err instanceof Error ? err.stack ?? err.message : String(err),
        totalElapsed,
      });
      return { success: false, error: 'An unexpected error occurred while archiving this page.' };
    }
  }

  browser.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;
    try {
      await archivePage(tab.id);
    } catch (err) {
      logger.error('background', 'Failed to archive page from toolbar', { error: String(err) });
    }
  });

  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: 'archive-page',
      title: 'Archive Page as TextBundle',
      contexts: ['page'],
    });
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== 'archive-page' || !tab?.id) return;
    try {
      await archivePage(tab.id);
    } catch (err) {
      logger.error('background', 'Failed to archive page from context menu', { error: String(err) });
    }
  });

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    logger.debug('background', 'Received message', { type: message?.type });

    if (message?.type === 'archive-page') {
      runPipeline(message as ExtractionResult).then(sendResponse);
      return true;
    }
  });
});
