import { describe, it, expect } from 'vitest';
import { collectPageImages } from '../lib/page-image-collector';
import { parseHTML } from './helpers/parse-html';

const BASE = 'https://example.com/article/';

function doc(bodyHtml: string): Document {
  return parseHTML(`<html><head></head><body>${bodyHtml}</body></html>`);
}

describe('collectPageImages', () => {
  it('collects images from body', () => {
    const d = doc('<img src="https://example.com/a.jpg" alt="A">');
    const result = collectPageImages(d, BASE);
    expect(result).toEqual([{ url: 'https://example.com/a.jpg', alt: 'A' }]);
  });

  it('skips tiny images (< 50px both dimensions)', () => {
    const d = doc('<img src="https://example.com/tiny.png" width="30" height="30">');
    const result = collectPageImages(d, BASE);
    expect(result).toHaveLength(0);
  });

  it('keeps images where only one dimension is small', () => {
    const d = doc('<img src="https://example.com/banner.png" width="800" height="30">');
    const result = collectPageImages(d, BASE);
    expect(result).toHaveLength(1);
  });

  it('keeps images with no dimension attributes', () => {
    const d = doc('<img src="https://example.com/photo.jpg">');
    const result = collectPageImages(d, BASE);
    expect(result).toHaveLength(1);
  });

  it('skips data: URIs', () => {
    const d = doc('<img src="data:image/png;base64,abc123">');
    const result = collectPageImages(d, BASE);
    expect(result).toHaveLength(0);
  });

  it('skips images with empty src', () => {
    const d = doc('<img src="">');
    const result = collectPageImages(d, BASE);
    expect(result).toHaveLength(0);
  });

  it('skips images in <nav>', () => {
    const d = doc('<nav><img src="https://example.com/logo.png"></nav>');
    const result = collectPageImages(d, BASE);
    expect(result).toHaveLength(0);
  });

  it('skips images in <header>', () => {
    const d = doc('<header><img src="https://example.com/banner.png"></header>');
    const result = collectPageImages(d, BASE);
    expect(result).toHaveLength(0);
  });

  it('skips images in <footer>', () => {
    const d = doc('<footer><img src="https://example.com/badge.png"></footer>');
    const result = collectPageImages(d, BASE);
    expect(result).toHaveLength(0);
  });

  it('prefers linked full-size <a href> over <img src>', () => {
    const d = doc(
      '<a href="https://example.com/full.jpg"><img src="https://example.com/thumb.jpg" alt="Photo"></a>',
    );
    const result = collectPageImages(d, BASE);
    expect(result).toEqual([{ url: 'https://example.com/full.jpg', alt: 'Photo' }]);
  });

  it('does not use <a href> if it is not an image URL', () => {
    const d = doc(
      '<a href="https://example.com/page"><img src="https://example.com/thumb.jpg"></a>',
    );
    const result = collectPageImages(d, BASE);
    expect(result[0].url).toBe('https://example.com/thumb.jpg');
  });

  it('deduplicates by URL', () => {
    const d = doc(
      '<img src="https://example.com/a.jpg"><img src="https://example.com/a.jpg">',
    );
    const result = collectPageImages(d, BASE);
    expect(result).toHaveLength(1);
  });

  it('absolutifies relative URLs', () => {
    const d = doc('<img src="../images/photo.jpg">');
    const result = collectPageImages(d, BASE);
    expect(result[0].url).toBe('https://example.com/images/photo.jpg');
  });

  it('returns alt text from img', () => {
    const d = doc('<img src="https://example.com/x.jpg" alt="Sunset photo">');
    const result = collectPageImages(d, BASE);
    expect(result[0].alt).toBe('Sunset photo');
  });

  it('returns empty alt when attribute is missing', () => {
    const d = doc('<img src="https://example.com/x.jpg">');
    const result = collectPageImages(d, BASE);
    expect(result[0].alt).toBe('');
  });
});
