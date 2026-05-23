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

  const MIN_TEXT_LENGTH = 250;
  if ((parsed.length ?? 0) < MIN_TEXT_LENGTH) {
    logger.info('readability-runner', 'Content too short, treating as non-article', {
      length: parsed.length,
    });
    return null;
  }

  // Readability 0.6 (mozilla/readability#867) preserves short non-link
  // paragraphs that 0.5 dropped, so list-shaped pages (search results, link
  // dumps) clear the total-length floor with many short fragments. Real
  // articles have at least one substantive paragraph; pages built from
  // fragments do not.
  const MIN_PARAGRAPH_LENGTH = 140;
  const longestParagraph = findLongestParagraphLength(parsed.content);
  if (longestParagraph < MIN_PARAGRAPH_LENGTH) {
    logger.info('readability-runner', 'No substantive paragraph, treating as non-article', {
      longestParagraph,
    });
    return null;
  }

  const imageCount = (parsed.content.match(/<img[\s>]/gi) ?? []).length;
  logger.info('readability-runner', 'Extraction complete', {
    title: parsed.title,
    contentLength: parsed.content.length,
    imageCount,
  });

  return {
    title: parsed.title ?? '',
    content: parsed.content,
    textContent: parsed.textContent ?? '',
    excerpt: parsed.excerpt ?? '',
    byline: parsed.byline ?? null,
    length: parsed.length ?? 0,
  };
}

function findLongestParagraphLength(html: string): number {
  let longest = 0;
  const paragraphRegex = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = paragraphRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text.length > longest) longest = text.length;
  }
  return longest;
}
