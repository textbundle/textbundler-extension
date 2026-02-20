import { describe, it, expect } from 'vitest';
import { appendOrphanedImages } from '../lib/orphan-image-appender';
import type { ImageMap, PageImage } from '../lib/types';

describe('appendOrphanedImages', () => {
  it('returns unchanged markdown and imageMap when no orphans', () => {
    const markdown = '# Hello\n\n![pic](assets/photo.jpg)';
    const imageMap: ImageMap = { 'https://example.com/photo.jpg': 'assets/photo.jpg' };
    const pageImages: PageImage[] = [{ url: 'https://example.com/photo.jpg', alt: 'pic' }];

    const result = appendOrphanedImages(markdown, imageMap, pageImages);
    expect(result.markdown).toBe(markdown);
    expect(result.imageMap).toEqual(imageMap);
  });

  it('returns unchanged when pageImages is empty', () => {
    const markdown = '# Hello';
    const imageMap: ImageMap = {};
    const result = appendOrphanedImages(markdown, imageMap, []);
    expect(result.markdown).toBe(markdown);
  });

  it('appends orphans after --- separator', () => {
    const markdown = '# Article';
    const imageMap: ImageMap = {};
    const pageImages: PageImage[] = [
      { url: 'https://example.com/carousel-1.jpg', alt: 'Slide 1' },
      { url: 'https://example.com/carousel-2.jpg', alt: 'Slide 2' },
    ];

    const result = appendOrphanedImages(markdown, imageMap, pageImages);
    expect(result.markdown).toContain('\n\n---\n\n');
    expect(result.markdown).toContain('![Slide 1](assets/carousel-1.jpg)');
    expect(result.markdown).toContain('![Slide 2](assets/carousel-2.jpg)');
  });

  it('generates asset paths with original filenames', () => {
    const result = appendOrphanedImages('text', {}, [
      { url: 'https://example.com/images/sunset-beach.png', alt: '' },
    ]);
    expect(result.imageMap['https://example.com/images/sunset-beach.png']).toBe(
      'assets/sunset-beach.png',
    );
  });

  it('handles collision with existing imageMap entries', () => {
    const imageMap: ImageMap = {
      'https://example.com/photo.jpg': 'assets/photo.jpg',
    };
    const pageImages: PageImage[] = [
      { url: 'https://other.com/photo.jpg', alt: 'Other photo' },
    ];

    const result = appendOrphanedImages('text', imageMap, pageImages);
    expect(result.imageMap['https://other.com/photo.jpg']).toBe('assets/photo-2.jpg');
  });

  it('preserves alt text in markdown images', () => {
    const result = appendOrphanedImages('text', {}, [
      { url: 'https://example.com/cat.jpg', alt: 'A fluffy cat' },
    ]);
    expect(result.markdown).toContain('![A fluffy cat](assets/cat.jpg)');
  });

  it('does not mutate the original imageMap', () => {
    const imageMap: ImageMap = { 'https://example.com/a.jpg': 'assets/a.jpg' };
    const original = { ...imageMap };
    appendOrphanedImages('text', imageMap, [
      { url: 'https://example.com/b.jpg', alt: '' },
    ]);
    expect(imageMap).toEqual(original);
  });
});
