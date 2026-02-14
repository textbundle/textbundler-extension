import { describe, it, expect } from 'vitest';
import { extractMetadata } from '../lib/metadata-extractor';
import { parseHTML } from './helpers/parse-html';
import { readFixture } from './helpers/read-fixture';

describe('extractMetadata', () => {
  describe('og-metadata.html (all fields)', () => {
    const html = readFixture('og-metadata.html');
    const doc = parseHTML(html);
    const metadata = extractMetadata(doc, 'https://example.com/articles/rich-metadata');

    it('extracts title from og:title', () => {
      expect(metadata.title).toBe('Rich Metadata Article - OG Title');
    });

    it('extracts author', () => {
      expect(metadata.author).toBe('Jane Doe');
    });

    it('normalizes date to ISO 8601', () => {
      expect(metadata.date).toBe('2025-06-15T10:30:00.000Z');
    });

    it('sets url from parameter', () => {
      expect(metadata.url).toBe('https://example.com/articles/rich-metadata');
    });

    it('extracts canonical URL', () => {
      expect(metadata.canonicalUrl).toBe('https://example.com/articles/rich-metadata');
    });

    it('extracts site name', () => {
      expect(metadata.siteName).toBe('Example Blog');
    });

    it('extracts language', () => {
      expect(metadata.language).toBe('en');
    });

    it('extracts description from og:description', () => {
      expect(metadata.description).toBe('OG description for the rich metadata article.');
    });

    it('extracts and splits keywords', () => {
      expect(metadata.keywords).toEqual(['testing', 'metadata', 'open graph', 'json-ld']);
    });

    it('extracts og:image', () => {
      expect(metadata.ogImage).toBe('https://example.com/images/og-image.jpg');
    });

    it('extracts og:type', () => {
      expect(metadata.ogType).toBe('article');
    });
  });

  describe('minimal-metadata.html (only title and url)', () => {
    const html = readFixture('minimal-metadata.html');
    const doc = parseHTML(html);
    const metadata = extractMetadata(doc, 'https://example.com/minimal');

    it('extracts title from <title> element', () => {
      expect(metadata.title).toBe('Minimal Page');
    });

    it('sets url from parameter', () => {
      expect(metadata.url).toBe('https://example.com/minimal');
    });

    it('sets author to null', () => {
      expect(metadata.author).toBeNull();
    });

    it('sets date to null', () => {
      expect(metadata.date).toBeNull();
    });

    it('sets canonicalUrl to null', () => {
      expect(metadata.canonicalUrl).toBeNull();
    });

    it('sets siteName to null', () => {
      expect(metadata.siteName).toBeNull();
    });

    it('sets language to null', () => {
      expect(metadata.language).toBeNull();
    });

    it('sets description to null', () => {
      expect(metadata.description).toBeNull();
    });

    it('sets keywords to null', () => {
      expect(metadata.keywords).toBeNull();
    });

    it('sets ogImage to null', () => {
      expect(metadata.ogImage).toBeNull();
    });

    it('sets ogType to null', () => {
      expect(metadata.ogType).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles multiple authors from JSON-LD array', () => {
      const html = `<!DOCTYPE html><html><head>
        <title>Multi Author</title>
        <script type="application/ld+json">{"@type":"Article","author":[{"@type":"Person","name":"Alice"},{"@type":"Person","name":"Bob"}]}</script>
      </head><body><p>Content.</p></body></html>`;
      const doc = parseHTML(html);
      const metadata = extractMetadata(doc, 'https://example.com/multi');
      expect(metadata.author).toEqual(['Alice', 'Bob']);
    });

    it('handles invalid date gracefully', () => {
      const html = `<!DOCTYPE html><html><head>
        <title>Bad Date</title>
        <meta property="article:published_time" content="not-a-date">
      </head><body><p>Content.</p></body></html>`;
      const doc = parseHTML(html);
      const metadata = extractMetadata(doc, 'https://example.com/bad-date');
      expect(metadata.date).toBeNull();
    });

    it('falls back to title element when no og:title', () => {
      const html = `<!DOCTYPE html><html><head><title>Fallback Title</title></head><body><p>x</p></body></html>`;
      const doc = parseHTML(html);
      const metadata = extractMetadata(doc, 'https://example.com/');
      expect(metadata.title).toBe('Fallback Title');
    });

    it('sets excerpt to null when no excerpt source', () => {
      const html = `<!DOCTYPE html><html><head><title>T</title></head><body><p>x</p></body></html>`;
      const doc = parseHTML(html);
      const metadata = extractMetadata(doc, 'https://example.com/');
      expect(metadata.excerpt).toBeNull();
    });
  });
});
