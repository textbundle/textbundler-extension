import { describe, it, expect } from 'vitest';
import { Readability } from '@mozilla/readability';
import { parseHTML } from './helpers/parse-html';

describe('linkedom smoke test', () => {
  it('parses minimal HTML and finds a <body>', () => {
    const doc = parseHTML('<html><body><p>Hello</p></body></html>');
    expect(doc.body).not.toBeNull();
  });
});

describe('Readability canary', () => {
  it('extracts an article from multi-paragraph HTML', { timeout: 5000 }, () => {
    const html =
      '<html><head><title>Test</title></head><body><article><h1>Title</h1>' +
      '<p>First paragraph with enough content for Readability heuristics.</p>' +
      '<p>Second paragraph with additional detail and substance.</p>' +
      '<p>Third paragraph to ensure the content body is large enough to trigger article detection.</p>' +
      '<p>Fourth paragraph. Readability typically needs several hundred characters of text content to confidently identify an article region.</p>' +
      '</article></body></html>';

    const doc = parseHTML(html);
    const result = new Readability(doc).parse();

    expect(result).not.toBeNull();
    expect(result!.content).toBeTruthy();
    expect(result!.length).toBeGreaterThan(0);
  });

  it('returns null for non-article HTML', () => {
    const html = '<html><head><title>Redirect</title></head><body></body></html>';

    const doc = parseHTML(html);
    const result = new Readability(doc).parse();

    expect(result).toBeNull();
  });
});
