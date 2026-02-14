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
 * Generate a complete TextBundle filename with date prefix.
 * Section 4.7
 * FR-005
 *
 * @param title - Article title to generate slug from
 * @param date - ISO date string (YYYY-MM-DD) or null to use today's date
 * @param fallback - Optional fallback slug if title produces empty slug
 * @returns Filename in format {YYYY-MM-DD}-{slug}.textpack
 */
export function generateFilename(
  title: string,
  date: string | null,
  fallback?: string,
): string {
  const datePrefix = date || new Date().toISOString().split('T')[0];
  const slug = slugify(title, fallback);
  return `${datePrefix}-${slug}.textpack`;
}
