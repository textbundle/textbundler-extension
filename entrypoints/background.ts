import { logger } from '@/lib/logger';

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

  browser.runtime.onMessage.addListener((message) => {
    logger.debug('background', 'Received message', { type: message?.type });
  });
});
