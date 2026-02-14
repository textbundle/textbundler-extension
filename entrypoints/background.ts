import { logger } from '@/lib/logger';
import { convertToMarkdown } from '@/lib/markdown-converter';
import { downloadImages } from '@/lib/image-downloader';
import { patchFailedImageUrls } from '@/lib/image-patcher';
import { buildFrontmatter } from '@/lib/frontmatter-builder';
import { packageBundle } from '@/lib/bundle-packager';
import { triggerDownload } from '@/lib/download-trigger';
import type { ExtractionResult, ExtractionFailure, ArchiveResponse } from '@/lib/types';

export default defineBackground(() => {
  logger.info('background', 'Service worker started');

  const action = browser.action ?? browser.browserAction;
  const menus = browser.contextMenus ?? browser.menus;

  const processingTabs = new Set<number>();

  function setBadge(tabId: number, text: string, color: string): void {
    action.setBadgeText({ text, tabId });
    action.setBadgeBackgroundColor({ color, tabId });
  }

  function showNotification(message: string): void {
    browser.notifications.create({
      type: 'basic',
      iconUrl: browser.runtime.getURL('/icon/128.png'),
      title: 'TextBundler',
      message,
    });
  }

  function showErrorBadge(tabId: number): void {
    setBadge(tabId, '!', '#D94A4A');
    setTimeout(() => action.setBadgeText({ text: '', tabId }), 5000);
  }

  async function injectContentScript(tabId: number): Promise<void> {
    if (browser.scripting) {
      await browser.scripting.executeScript({
        target: { tabId },
        files: ['/content-scripts/content.js'],
      });
    } else {
      await browser.tabs.executeScript(tabId, {
        file: '/content-scripts/content.js',
      });
    }
  }

  async function archivePageWithFeedback(tabId: number): Promise<void> {
    if (processingTabs.has(tabId)) {
      logger.info('background', 'Tab already processing, ignoring click', { tabId });
      return;
    }

    processingTabs.add(tabId);
    setBadge(tabId, '...', '#4A90D9');
    logger.info('background', 'Archiving page', { tabId });

    try {
      await injectContentScript(tabId);
      await browser.tabs.sendMessage(tabId, { type: 'trigger-archive' });
      logger.debug('background', 'Trigger message sent', { tabId });
    } catch (err) {
      processingTabs.delete(tabId);
      showErrorBadge(tabId);
      const errorMsg = err instanceof Error ? err.message : String(err);
      showNotification(errorMsg);
      logger.error('background', 'Failed to inject content script', { error: String(err) });
    }
  }

  async function runPipeline(extraction: ExtractionResult, tabId: number): Promise<ArchiveResponse> {
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

      processingTabs.delete(tabId);
      setBadge(tabId, 'OK', '#4A90D9');
      setTimeout(() => action.setBadgeText({ text: '', tabId }), 3000);
      showNotification(`Archived: ${extraction.metadata.title}`);

      return { success: true, filename };
    } catch (err) {
      const totalElapsed = Date.now() - pipelineStart;
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error('background', 'Pipeline failed', {
        error: err instanceof Error ? err.stack ?? err.message : String(err),
        totalElapsed,
      });

      processingTabs.delete(tabId);
      showErrorBadge(tabId);
      showNotification(errorMsg);

      return { success: false, error: 'An unexpected error occurred while archiving this page.' };
    }
  }

  function handleExtractionFailure(failure: ExtractionFailure, tabId: number): void {
    logger.info('background', 'Extraction failed', { url: failure.url, reason: failure.reason });
    processingTabs.delete(tabId);
    showErrorBadge(tabId);
    showNotification('Could not extract content from this page.');
  }

  action.onClicked.addListener(async (tab: { id?: number }) => {
    if (!tab.id) return;
    await archivePageWithFeedback(tab.id);
  });

  menus.removeAll().then(() => {
    menus.create({
      id: 'archive-page',
      title: 'Archive Page as TextBundle',
      contexts: ['page'],
    });
  });

  menus.onClicked.addListener(async (info: { menuItemId: string | number }, tab?: { id?: number }) => {
    if (info.menuItemId !== 'archive-page' || !tab?.id) return;
    await archivePageWithFeedback(tab.id);
  });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    logger.debug('background', 'Received message', { type: message?.type });
    const tabId = sender.tab?.id;

    if (message?.type === 'archive-page' && tabId) {
      runPipeline(message as ExtractionResult, tabId).then(sendResponse);
      return true;
    }

    if (message?.type === 'extraction-failed' && tabId) {
      handleExtractionFailure(message as ExtractionFailure, tabId);
    }
  });
});
