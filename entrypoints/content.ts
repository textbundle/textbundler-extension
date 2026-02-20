import { extractArticle } from '@/lib/readability-runner';
import { extractMetadata } from '@/lib/metadata-extractor';
import { convertToMarkdown } from '@/lib/markdown-converter';
import { collectPageImages } from '@/lib/page-image-collector';
import { appendOrphanedImages } from '@/lib/orphan-image-appender';
import { applyDefaults } from '@/lib/conversion-settings';
import { logger } from '@/lib/logger';
import type { ConversionSettings, ExtractionResult, ExtractionFailure } from '@/lib/types';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  registration: 'runtime',
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === 'download-file') {
        const a = document.createElement('a');
        a.href = message.dataUrl;
        a.download = message.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      if (message?.type !== 'trigger-archive') return;

      return (async () => {
        const start = Date.now();
        const url = window.location.href;

        const stored = await browser.storage.sync.get('conversionSettings');
        const settings = applyDefaults(stored.conversionSettings as Partial<ConversionSettings> | undefined);

        const metadata = extractMetadata(document, url);
        const article = extractArticle(document);

        const elapsed = Date.now() - start;

        if (article) {
          const converted = convertToMarkdown(article.content, settings);
          const pageImages = collectPageImages(document, url);
          const { markdown, imageMap } = appendOrphanedImages(
            converted.markdown,
            converted.imageMap,
            pageImages,
          );

          logger.info('content-script', 'Extraction succeeded', {
            title: article.title,
            contentLength: article.content.length,
            images: Object.keys(imageMap).length,
            orphans: Object.keys(imageMap).length - Object.keys(converted.imageMap).length,
            elapsed,
          });

          const result: ExtractionResult = {
            type: 'archive-page',
            article,
            markdown,
            imageMap,
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
      })();
    });
  },
});
