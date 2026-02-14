import yaml from 'js-yaml';
import type { PageMetadata } from './types';

const MAX_TEXT_LENGTH = 1_000_000;

/**
 * Build YAML frontmatter from page metadata and text content.
 * Computes word_count from textContent, sets archived_at timestamp,
 * and omits fields with null/undefined values. FR-003.
 *
 * @param metadata - Extracted page metadata
 * @param textContent - Plain text content for word count computation
 * @param now - Optional date for archived_at (defaults to new Date())
 * @returns Frontmatter string wrapped in --- delimiters
 */
export function buildFrontmatter(
  metadata: PageMetadata,
  textContent: string,
  now?: Date,
): string {
  const truncated = textContent.length > MAX_TEXT_LENGTH
    ? textContent.slice(0, MAX_TEXT_LENGTH)
    : textContent;
  const wordCount = truncated
    .split(/\s+/)
    .filter((token) => token.length > 0).length;

  const archivedAt = (now ?? new Date()).toISOString();

  const obj: Record<string, unknown> = {};

  obj.title = metadata.title;
  if (metadata.author !== null) obj.author = metadata.author;
  if (metadata.date !== null) obj.date = metadata.date;
  obj.url = metadata.url;
  if (metadata.canonicalUrl !== null) obj.canonical_url = metadata.canonicalUrl;
  if (metadata.siteName !== null) obj.site_name = metadata.siteName;
  if (metadata.language !== null) obj.language = metadata.language;
  if (metadata.description !== null) obj.description = metadata.description;
  if (metadata.excerpt !== null) obj.excerpt = metadata.excerpt;
  if (metadata.keywords !== null) obj.keywords = metadata.keywords;
  if (metadata.ogImage !== null) obj.og_image = metadata.ogImage;
  if (metadata.ogType !== null) obj.og_type = metadata.ogType;
  obj.word_count = wordCount;
  obj.archived_at = archivedAt;

  const yamlStr = yaml.dump(obj, { lineWidth: -1 });
  return `---\n${yamlStr}---\n`;
}
