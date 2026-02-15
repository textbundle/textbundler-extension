/**
 * Generate a URL-safe slug from a title string.
 * Implements the slug algorithm from Section 4.7.
 * FR-005
 *
 * @param title - The title string to slugify
 * @param fallback - Optional fallback slug to use if the result is empty
 * @returns URL-safe slug (max 80 chars, lowercase, hyphens)
 */
export function slugify(title: string, fallback?: string): string {
  let slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug.length > 80) {
    slug = slug.substring(0, 80).replace(/-+$/, '');
  }

  return slug || fallback || '';
}

/**
 * Extract a short domain label from a URL, stripping www. and the TLD.
 * e.g. "https://www.example.co.uk/path" → "example"
 *      "https://en.wikipedia.org/wiki/X" → "en-wikipedia"
 *
 * @param url - Source page URL
 * @returns Slugified domain label, or empty string on failure
 */
export function extractDomain(url: string): string {
  try {
    let host = new URL(url).hostname;
    host = host.replace(/^www\./, '');
    const parts = host.split('.');
    if (parts.length > 2) {
      parts.pop();
      return parts.join('-');
    }
    return parts[0] ?? '';
  } catch {
    return '';
  }
}

/**
 * Generate a complete TextBundle filename with date prefix and domain.
 * Section 4.7
 * FR-005
 *
 * @param title - Article title to generate slug from
 * @param date - ISO date string (YYYY-MM-DD) or null to use today's date
 * @param sourceUrl - Source page URL for domain extraction
 * @param fallback - Optional fallback slug if title produces empty slug
 * @returns Filename in format {YYYY-MM-DD}-{domain}-{slug}.textpack
 */
export function generateFilename(
  title: string,
  date: string | null,
  sourceUrl?: string,
  fallback?: string,
): string {
  const datePrefix = (date || new Date().toISOString()).split('T')[0];
  const domain = sourceUrl ? extractDomain(sourceUrl) : '';
  const slug = slugify(title, fallback);
  const middle = [domain, slug].filter(Boolean).join('-');
  return `${datePrefix}-${middle}.textpack`;
}
