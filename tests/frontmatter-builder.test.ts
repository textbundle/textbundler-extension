import { describe, it, expect } from 'vitest';
import { buildFrontmatter } from '../lib/frontmatter-builder';
import type { PageMetadata } from '../lib/types';
import yaml from 'js-yaml';

function makeMetadata(overrides: Partial<PageMetadata> = {}): PageMetadata {
  return {
    title: 'Test Article',
    author: null,
    date: null,
    url: 'https://example.com/article',
    canonicalUrl: null,
    siteName: null,
    language: null,
    description: null,
    excerpt: null,
    keywords: null,
    ogImage: null,
    ogType: null,
    ...overrides,
  };
}

describe('buildFrontmatter', () => {
  const fixedDate = new Date('2026-02-14T12:00:00.000Z');
  const textContent = 'one two three four five';

  it('produces valid YAML between --- delimiters', () => {
    const result = buildFrontmatter(makeMetadata(), textContent, fixedDate);
    expect(result).toMatch(/^---\n/);
    expect(result).toMatch(/\n---\n$/);

    const inner = result.slice(4, -4);
    expect(() => yaml.load(inner)).not.toThrow();
  });

  it('always includes required fields', () => {
    const result = buildFrontmatter(makeMetadata(), textContent, fixedDate);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;

    expect(parsed).toHaveProperty('title', 'Test Article');
    expect(parsed).toHaveProperty('url', 'https://example.com/article');
    expect(parsed).toHaveProperty('word_count', 5);
    expect(parsed).toHaveProperty('archived_at', '2026-02-14T12:00:00.000Z');
  });

  it('omits fields with null values', () => {
    const result = buildFrontmatter(makeMetadata(), textContent, fixedDate);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;

    expect(parsed).not.toHaveProperty('author');
    expect(parsed).not.toHaveProperty('date');
    expect(parsed).not.toHaveProperty('canonicalUrl');
    expect(parsed).not.toHaveProperty('siteName');
  });

  it('includes optional fields when present', () => {
    const metadata = makeMetadata({
      author: 'Jane Doe',
      date: '2026-01-15T00:00:00.000Z',
      siteName: 'Example Blog',
      language: 'en',
      description: 'A test article',
      keywords: ['test', 'article'],
    });
    const result = buildFrontmatter(metadata, textContent, fixedDate);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;

    expect(parsed).toHaveProperty('author', 'Jane Doe');
    expect(parsed).toHaveProperty('date', '2026-01-15T00:00:00.000Z');
    expect(parsed).toHaveProperty('site_name', 'Example Blog');
    expect(parsed).toHaveProperty('language', 'en');
    expect(parsed).toHaveProperty('description', 'A test article');
    expect(parsed).toHaveProperty('keywords');
    expect(parsed.keywords).toEqual(['test', 'article']);
  });

  it('renders multiple authors as YAML array', () => {
    const metadata = makeMetadata({ author: ['Alice', 'Bob'] });
    const result = buildFrontmatter(metadata, textContent, fixedDate);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;

    expect(parsed.author).toEqual(['Alice', 'Bob']);
  });

  it('renders keywords as YAML array', () => {
    const metadata = makeMetadata({ keywords: ['typescript', 'testing', 'vitest'] });
    const result = buildFrontmatter(metadata, textContent, fixedDate);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;

    expect(parsed.keywords).toEqual(['typescript', 'testing', 'vitest']);
  });

  it('escapes special characters in titles', () => {
    const metadata = makeMetadata({ title: 'Colons: "Quotes" & Newlines\nOh My' });
    const result = buildFrontmatter(metadata, textContent, fixedDate);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;

    expect(parsed.title).toBe('Colons: "Quotes" & Newlines\nOh My');
  });

  it('computes accurate word count', () => {
    const result = buildFrontmatter(makeMetadata(), 'a b c', fixedDate);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;
    expect(parsed.word_count).toBe(3);
  });

  it('handles empty text content', () => {
    const result = buildFrontmatter(makeMetadata(), '', fixedDate);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;
    expect(parsed.word_count).toBe(0);
  });

  it('caps word count input at 1MB', () => {
    const bigText = 'word '.repeat(300000);
    expect(bigText.length).toBeGreaterThan(1_000_000);
    const result = buildFrontmatter(makeMetadata(), bigText, fixedDate);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;
    expect(typeof parsed.word_count).toBe('number');
  });

  it('uses current date when now parameter is not provided', () => {
    const result = buildFrontmatter(makeMetadata(), textContent);
    const parsed = yaml.load(result.slice(4, -4)) as Record<string, unknown>;
    expect(parsed.archived_at).toBeTruthy();
    expect(typeof parsed.archived_at).toBe('string');
  });

  it('does not wrap long lines', () => {
    const longDescription = 'a'.repeat(200);
    const metadata = makeMetadata({ description: longDescription });
    const result = buildFrontmatter(metadata, textContent, fixedDate);
    expect(result).toContain(longDescription);
  });
});
