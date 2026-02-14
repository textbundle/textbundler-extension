import { Readability } from '@mozilla/readability';
import { resolveLazyImages } from './lazy-image-resolver';
import { logger } from './logger';
import type { ArticleResult } from './types';

/**
 * Extract article content from a document using Mozilla Readability.
 * Clones the document (Readability mutates the DOM), resolves lazy images,
 * then runs Readability.parse(). Returns null if extraction fails or produces
 * empty content. FR-001.
 *
 * @param document - The DOM document to extract from (not mutated)
 * @returns ArticleResult on success, null on failure
 */
export function extractArticle(document: Document): ArticleResult | null {
  const clone = document.cloneNode(true) as Document;
  resolveLazyImages(clone);

  const reader = new Readability(clone);
  const parsed = reader.parse();

  if (!parsed || !parsed.content || parsed.content.trim().length === 0) {
    logger.info('readability-runner', 'Readability returned no content');
    return null;
  }

  const imageCount = (parsed.content.match(/<img[\s>]/gi) ?? []).length;
  logger.info('readability-runner', 'Extraction complete', {
    title: parsed.title,
    contentLength: parsed.content.length,
    imageCount,
  });

  return {
    title: parsed.title,
    content: parsed.content,
    textContent: parsed.textContent,
    excerpt: parsed.excerpt,
    byline: parsed.byline ?? null,
    length: parsed.length,
  };
}
