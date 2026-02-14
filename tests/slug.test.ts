import { describe, expect, test } from 'vitest';
import { generateFilename, slugify } from '../lib/slug';

describe('slugify', () => {
  test('converts simple title with punctuation', () => {
    expect(slugify('Hello & World!?')).toBe('hello-world');
  });

  test('handles apostrophes and colons', () => {
    expect(slugify("Rust's Ownership Model: A Deep Dive")).toBe(
      'rust-s-ownership-model-a-deep-dive',
    );
  });

  test('truncates very long titles to 80 characters', () => {
    const longTitle =
      'This is an extremely long title that exceeds the maximum allowed length for slug generation and should be truncated properly without trailing hyphens';
    const result = slugify(longTitle);

    expect(result.length).toBeLessThanOrEqual(80);
    expect(result).not.toMatch(/-$/);

    const fullSlug =
      'this-is-an-extremely-long-title-that-exceeds-the-maximum-allowed-length-for-slug-generation-and-should-be-truncated-properly-without-trailing-hyphens';
    expect(result).toBe(fullSlug.substring(0, 80).replace(/-+$/, ''));
  });

  test('handles titles that end with word boundary at exactly 80 chars', () => {
    const title = 'A'.repeat(79) + ' B';
    const result = slugify(title);
    expect(result.length).toBeLessThanOrEqual(80);
    expect(result).not.toMatch(/-$/);
  });

  test('removes leading and trailing hyphens', () => {
    expect(slugify('---Hello---')).toBe('hello');
    expect(slugify('   Title   ')).toBe('title');
  });

  test('collapses multiple consecutive non-alphanumeric chars to single hyphen', () => {
    expect(slugify('Hello@@@World###Test')).toBe('hello-world-test');
  });

  test('normalizes unicode accented characters to ASCII', () => {
    expect(slugify('Café résumé naïve')).toBe('cafe-resume-naive');
  });

  test('strips non-transliterable unicode characters', () => {
    expect(slugify('日本語の記事')).toBe('');
  });

  test('uses fallback when slug is empty after processing', () => {
    expect(slugify('日本語の記事', 'example-com')).toBe('example-com');
    expect(slugify('', 'fallback-slug')).toBe('fallback-slug');
  });

  test('handles mixed unicode and ASCII', () => {
    expect(slugify('Café in 日本')).toBe('cafe-in');
  });

  test('preserves numbers', () => {
    expect(slugify('Article 123 from 2026')).toBe('article-123-from-2026');
  });
});

describe('generateFilename', () => {
  test('generates filename with provided date', () => {
    expect(generateFilename('Simple Title', '2026-02-14')).toBe(
      '2026-02-14-simple-title.textpack',
    );
  });

  test('uses current date when date is null', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(generateFilename('Simple Title', null)).toBe(
      `${today}-simple-title.textpack`,
    );
  });

  test('uses fallback when title produces empty slug', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(generateFilename('日本語の記事', null, 'example-com')).toBe(
      `${today}-example-com.textpack`,
    );
  });

  test('combines date and slug correctly', () => {
    expect(
      generateFilename("Rust's Ownership Model: A Deep Dive", '2026-01-15'),
    ).toBe('2026-01-15-rust-s-ownership-model-a-deep-dive.textpack');
  });

  test('handles very long title with date', () => {
    const longTitle =
      'This is an extremely long title that exceeds the maximum allowed length for slug generation and should be truncated properly without trailing hyphens';
    const result = generateFilename(longTitle, '2026-02-14');

    expect(result).toMatch(/^2026-02-14-/);
    expect(result).toMatch(/\.textpack$/);
    expect(result).not.toMatch(/--/);

    const slug = result.replace('2026-02-14-', '').replace('.textpack', '');
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug).not.toMatch(/-$/);
  });
});
