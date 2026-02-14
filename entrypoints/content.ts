import { extractArticle } from '@/lib/readability-runner';
import { extractMetadata } from '@/lib/metadata-extractor';
import { logger } from '@/lib/logger';
import type { ExtractionResult, ExtractionFailure } from '@/lib/types';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  registration: 'runtime',
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message?.type !== 'trigger-archive') return;

      const start = Date.now();
      const url = window.location.href;

      const metadata = extractMetadata(document, url);
      const article = extractArticle(document);

      const elapsed = Date.now() - start;

      if (article) {
        logger.info('content-script', 'Extraction succeeded', {
          title: article.title,
          contentLength: article.content.length,
          elapsed,
        });

        const result: ExtractionResult = {
          type: 'archive-page',
          article,
          metadata,
          sourceUrl: url,
        };
        browser.runtime.sendMessage(result);
      } else {
        logger.info('content-script', 'Extraction failed', { url, elapsed });

        const failure: ExtractionFailure = {
          type: 'extraction-failed',
          url,
          reason: 'Readability could not extract article content from this page.',
        };
        browser.runtime.sendMessage(failure);
      }
    });
  },
});
