import { describe, expect, test } from 'vitest';
import { extractDomain, generateFilename, slugify } from '../lib/slug';

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

describe('extractDomain', () => {
  test('strips www and TLD from simple domain', () => {
    expect(extractDomain('https://www.example.com/article')).toBe('example');
  });

  test('keeps subdomain for multi-part hosts', () => {
    expect(extractDomain('https://en.wikipedia.org/wiki/TextBundle')).toBe('en-wikipedia');
  });

  test('handles two-part domain without www', () => {
    expect(extractDomain('https://reddit.com/r/programming')).toBe('reddit');
  });

  test('handles country-code TLD with subdomain', () => {
    expect(extractDomain('https://www.example.co.uk/path')).toBe('example-co');
  });

  test('strips www from three-part domain', () => {
    expect(extractDomain('https://www.nytimes.com/article')).toBe('nytimes');
  });

  test('handles deep subdomains', () => {
    expect(extractDomain('https://blog.tech.company.io/post')).toBe('blog-tech-company');
  });

  test('returns empty string for invalid URL', () => {
    expect(extractDomain('not a url')).toBe('');
  });
});

describe('generateFilename', () => {
  test('generates filename with date, domain, and title', () => {
    expect(generateFilename('Simple Title', '2026-02-14', 'https://example.com/article')).toBe(
      '2026-02-14-example-simple-title.textpack',
    );
  });

  test('uses current date when date is null', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(generateFilename('Simple Title', null, 'https://example.com/article')).toBe(
      `${today}-example-simple-title.textpack`,
    );
  });

  test('works without sourceUrl for backwards compatibility', () => {
    expect(generateFilename('Simple Title', '2026-02-14')).toBe(
      '2026-02-14-simple-title.textpack',
    );
  });

  test('uses fallback when title produces empty slug', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(generateFilename('日本語の記事', null, 'https://example.com', 'example-com')).toBe(
      `${today}-example-example-com.textpack`,
    );
  });

  test('combines date, domain, and slug correctly', () => {
    expect(
      generateFilename("Rust's Ownership Model: A Deep Dive", '2026-01-15', 'https://blog.rust-lang.org/post'),
    ).toBe('2026-01-15-blog-rust-lang-rust-s-ownership-model-a-deep-dive.textpack');
  });

  test('handles very long title with date and domain', () => {
    const longTitle =
      'This is an extremely long title that exceeds the maximum allowed length for slug generation and should be truncated properly without trailing hyphens';
    const result = generateFilename(longTitle, '2026-02-14', 'https://example.com/article');

    expect(result).toMatch(/^2026-02-14-example-/);
    expect(result).toMatch(/\.textpack$/);
    expect(result).not.toMatch(/--/);
  });

  test('includes wikipedia subdomain in filename', () => {
    expect(
      generateFilename('TextBundle', '2026-02-15', 'https://en.wikipedia.org/wiki/TextBundle'),
    ).toBe('2026-02-15-en-wikipedia-textbundle.textpack');
  });
});
