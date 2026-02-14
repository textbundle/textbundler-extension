import { logger } from './logger';
import type { PageMetadata } from './types';

/**
 * Extract page metadata from the document's head element, OG tags, JSON-LD, and meta tags.
 * Follows the extraction cascade defined in TASK-010 / Section 4.2. FR-003.
 *
 * @param document - The parsed DOM document
 * @param url - The source URL of the page
 * @returns PageMetadata with all available fields (null for missing values)
 */
export function extractMetadata(document: Document, url: string): PageMetadata {
  const jsonLd = parseJsonLd(document);

  return {
    title: extractTitle(document),
    author: extractAuthor(document, jsonLd),
    date: extractDate(document, jsonLd),
    url,
    canonicalUrl: extractCanonicalUrl(document),
    siteName: extractSiteName(document),
    language: extractLanguage(document),
    description: extractDescription(document),
    excerpt: null,
    keywords: extractKeywords(document),
    ogImage: extractOgImage(document),
    ogType: getMetaContent(document, 'og:type'),
  };
}

function getMetaContent(doc: Document, property: string): string | null {
  const el =
    doc.querySelector(`meta[property="${property}"]`) ??
    doc.querySelector(`meta[name="${property}"]`);
  const content = el?.getAttribute('content');
  return content?.trim() || null;
}

function parseJsonLd(doc: Document): Record<string, unknown> | null {
  const script = doc.querySelector('script[type="application/ld+json"]');
  if (!script?.textContent) return null;
  try {
    return JSON.parse(script.textContent) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function extractTitle(doc: Document): string {
  const ogTitle = getMetaContent(doc, 'og:title');
  if (ogTitle) return ogTitle;

  const titleEl = doc.querySelector('title');
  return titleEl?.textContent?.trim() ?? '';
}

function extractAuthor(
  doc: Document,
  jsonLd: Record<string, unknown> | null,
): string | string[] | null {
  const metaAuthor = getMetaContent(doc, 'author');
  if (metaAuthor) return metaAuthor;

  const articleAuthor = getMetaContent(doc, 'article:author');
  if (articleAuthor) return articleAuthor;

  if (jsonLd) {
    const author = jsonLd.author;
    if (typeof author === 'string') return author;
    if (author && typeof author === 'object' && !Array.isArray(author)) {
      const name = (author as Record<string, unknown>).name;
      if (typeof name === 'string') return name;
    }
    if (Array.isArray(author)) {
      const names = author
        .map((a) => {
          if (typeof a === 'string') return a;
          if (a && typeof a === 'object') return (a as Record<string, unknown>).name as string;
          return null;
        })
        .filter((n): n is string => typeof n === 'string');
      if (names.length > 0) return names.length === 1 ? names[0] : names;
    }
  }

  return null;
}

function extractDate(
  doc: Document,
  jsonLd: Record<string, unknown> | null,
): string | null {
  const sources = [
    getMetaContent(doc, 'article:published_time'),
    getMetaContent(doc, 'date'),
    doc.querySelector('time[datetime]')?.getAttribute('datetime') ?? null,
    jsonLd?.datePublished as string | null,
  ];

  for (const raw of sources) {
    if (!raw) continue;
    const normalized = normalizeDate(raw);
    if (normalized) return normalized;
  }

  return null;
}

function normalizeDate(raw: string): string | null {
  const date = new Date(raw);
  if (isNaN(date.getTime())) {
    logger.warn('metadata-extractor', 'Invalid date value', { raw });
    return null;
  }
  return date.toISOString();
}

function extractCanonicalUrl(doc: Document): string | null {
  const link = doc.querySelector('link[rel="canonical"]');
  return link?.getAttribute('href') ?? null;
}

function extractSiteName(doc: Document): string | null {
  return getMetaContent(doc, 'og:site_name') ?? getMetaContent(doc, 'application-name');
}

function extractLanguage(doc: Document): string | null {
  const htmlLang = doc.documentElement?.getAttribute('lang');
  if (htmlLang) return htmlLang;

  const ogLocale = getMetaContent(doc, 'og:locale');
  return ogLocale;
}

function extractDescription(doc: Document): string | null {
  return getMetaContent(doc, 'og:description') ?? getMetaContent(doc, 'description');
}

function extractKeywords(doc: Document): string[] | null {
  const raw = getMetaContent(doc, 'keywords');
  if (!raw) return null;
  const keywords = raw.split(',').map((k) => k.trim()).filter(Boolean);
  return keywords.length > 0 ? keywords : null;
}

function extractOgImage(doc: Document): string | null {
  return getMetaContent(doc, 'og:image');
}
