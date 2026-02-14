import { describe, it, expect } from 'vitest';
import { extractArticle } from '../lib/readability-runner';
import { parseHTML } from './helpers/parse-html';
import { readFixture } from './helpers/read-fixture';

describe('extractArticle', { timeout: 10000 }, () => {
  it('extracts article from basic-article.html', () => {
    const doc = parseHTML(readFixture('basic-article.html'));
    const result = extractArticle(doc);
    expect(result).not.toBeNull();
    expect(result!.title).toBeTruthy();
    expect(result!.content).toBeTruthy();
    expect(result!.content.length).toBeGreaterThan(0);
    expect(result!.textContent.length).toBeGreaterThan(0);
  });

  it('extracts article from mixed-content.html', () => {
    const doc = parseHTML(readFixture('mixed-content.html'));
    const result = extractArticle(doc);
    expect(result).not.toBeNull();
    expect(result!.title).toBeTruthy();
    expect(result!.content.length).toBeGreaterThan(0);
  });

  it('returns null for non-article.html', () => {
    const doc = parseHTML(readFixture('non-article.html'));
    const result = extractArticle(doc);
    expect(result).toBeNull();
  });

  it('does not mutate the original document', () => {
    const html = readFixture('basic-article.html');
    const doc = parseHTML(html);
    const originalHtml = doc.documentElement.outerHTML;
    extractArticle(doc);
    expect(doc.documentElement.outerHTML).toBe(originalHtml);
  });

  it('returns ArticleResult with all required fields', () => {
    const doc = parseHTML(readFixture('basic-article.html'));
    const result = extractArticle(doc);
    expect(result).not.toBeNull();
    expect(typeof result!.title).toBe('string');
    expect(typeof result!.content).toBe('string');
    expect(typeof result!.textContent).toBe('string');
    expect(typeof result!.excerpt).toBe('string');
    expect(typeof result!.length).toBe('number');
    expect(result!.length).toBeGreaterThan(0);
  });

  it('returns null for empty content', () => {
    const doc = parseHTML('<html><head><title>Empty</title></head><body></body></html>');
    const result = extractArticle(doc);
    expect(result).toBeNull();
  });
});
