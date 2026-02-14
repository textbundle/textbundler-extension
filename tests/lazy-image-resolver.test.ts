import { describe, it, expect } from 'vitest';
import { resolveLazyImages } from '../lib/lazy-image-resolver';
import { parseHTML } from './helpers/parse-html';
import { readFixture } from './helpers/read-fixture';

describe('resolveLazyImages', () => {
  it('resolves data-src attribute', () => {
    const doc = parseHTML('<html><body><img data-src="https://example.com/real.jpg" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="test"></body></html>');
    resolveLazyImages(doc);
    const img = doc.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/real.jpg');
  });

  it('resolves data-lazy-src attribute', () => {
    const doc = parseHTML('<html><body><img data-lazy-src="https://example.com/wp-lazy.png" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="test"></body></html>');
    resolveLazyImages(doc);
    const img = doc.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/wp-lazy.png');
  });

  it('resolves data-original attribute', () => {
    const doc = parseHTML('<html><body><img data-original="https://example.com/original.webp" src="placeholder.jpg" alt="test"></body></html>');
    resolveLazyImages(doc);
    const img = doc.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/original.webp');
  });

  it('resolves srcset picking largest width descriptor', () => {
    const doc = parseHTML('<html><body><img src="small.jpg" srcset="https://example.com/medium.jpg 800w, https://example.com/large.jpg 1200w" alt="test"></body></html>');
    resolveLazyImages(doc);
    const img = doc.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/large.jpg');
  });

  it('resolves srcset picking largest pixel density descriptor', () => {
    const doc = parseHTML('<html><body><img src="small.jpg" srcset="https://example.com/1x.jpg 1x, https://example.com/2x.jpg 2x" alt="test"></body></html>');
    resolveLazyImages(doc);
    const img = doc.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/2x.jpg');
  });

  it('resolves picture element from first source srcset', () => {
    const doc = parseHTML('<html><body><picture><source srcset="https://example.com/avif.avif" type="image/avif"><source srcset="https://example.com/webp.webp" type="image/webp"><img src="https://example.com/fallback.jpg" alt="test"></picture></body></html>');
    resolveLazyImages(doc);
    const img = doc.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/avif.avif');
  });

  it('leaves regular images unchanged', () => {
    const doc = parseHTML('<html><body><img src="https://example.com/regular.jpg" alt="test"></body></html>');
    resolveLazyImages(doc);
    const img = doc.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/regular.jpg');
  });

  it('replaces placeholder 1x1 pixel data URI src', () => {
    const doc = parseHTML('<html><body><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="https://example.com/real.jpg" alt="test"></body></html>');
    resolveLazyImages(doc);
    const img = doc.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/real.jpg');
  });

  it('handles the lazy-images.html fixture', () => {
    const html = readFixture('lazy-images.html');
    const doc = parseHTML(html);
    resolveLazyImages(doc);
    const imgs = doc.querySelectorAll('img');

    const srcs = Array.from(imgs).map(img => img.getAttribute('src'));
    expect(srcs).toContain('https://example.com/images/lazy1.jpg');
    expect(srcs).toContain('https://example.com/images/lazy2.png');
    expect(srcs).toContain('https://example.com/images/lazy3.webp');
    expect(srcs).toContain('https://example.com/images/responsive-large.jpg');
    expect(srcs).toContain('https://example.com/images/regular.jpg');
  });

  it('prefers data-src over other lazy attributes', () => {
    const doc = parseHTML('<html><body><img data-src="https://example.com/preferred.jpg" data-lazy-src="https://example.com/other.jpg" src="" alt="test"></body></html>');
    resolveLazyImages(doc);
    const img = doc.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/preferred.jpg');
  });
});
