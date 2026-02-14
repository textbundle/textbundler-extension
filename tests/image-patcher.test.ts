import { describe, it, expect } from 'vitest';
import { patchFailedImageUrls } from '../lib/image-patcher';
import type { ImageAsset, ImageMap } from '../lib/types';

function makeAsset(originalUrl: string, filename: string, failed: boolean): ImageAsset {
  return {
    originalUrl,
    filename,
    data: new ArrayBuffer(0),
    mimeType: 'image/jpeg',
    failed,
  };
}

describe('patchFailedImageUrls', () => {
  it('returns markdown unchanged when no failed assets', () => {
    const markdown = '![alt](assets/image-001.jpg)';
    const imageMap: ImageMap = { 'https://example.com/photo.jpg': 'assets/image-001.jpg' };
    const failedAssets: ImageAsset[] = [];

    const result = patchFailedImageUrls(markdown, imageMap, failedAssets);
    expect(result).toBe(markdown);
  });

  it('patches a failed asset in standalone markdown image', () => {
    const markdown = '![alt](assets/image-002.jpg)';
    const imageMap: ImageMap = { 'https://example.com/photo.jpg': 'assets/image-002.jpg' };
    const failedAssets: ImageAsset[] = [
      makeAsset('https://example.com/photo.jpg', 'assets/image-002.jpg', true),
    ];

    const result = patchFailedImageUrls(markdown, imageMap, failedAssets);
    expect(result).toBe('![alt](https://example.com/photo.jpg)');
  });

  it('patches a failed asset inside figure inline HTML', () => {
    const markdown = '<figure><img src="assets/image-001.jpg"><figcaption>Caption</figcaption></figure>';
    const imageMap: ImageMap = { 'https://example.com/hero.jpg': 'assets/image-001.jpg' };
    const failedAssets: ImageAsset[] = [
      makeAsset('https://example.com/hero.jpg', 'assets/image-001.jpg', true),
    ];

    const result = patchFailedImageUrls(markdown, imageMap, failedAssets);
    expect(result).toBe('<figure><img src="https://example.com/hero.jpg"><figcaption>Caption</figcaption></figure>');
  });

  it('patches multiple failed assets', () => {
    const markdown = '![a](assets/image-001.jpg)\n\n![b](assets/image-003.png)';
    const imageMap: ImageMap = {
      'https://example.com/a.jpg': 'assets/image-001.jpg',
      'https://example.com/b.jpg': 'assets/image-002.jpg',
      'https://example.com/c.png': 'assets/image-003.png',
    };
    const failedAssets: ImageAsset[] = [
      makeAsset('https://example.com/a.jpg', 'assets/image-001.jpg', true),
      makeAsset('https://example.com/c.png', 'assets/image-003.png', true),
    ];

    const result = patchFailedImageUrls(markdown, imageMap, failedAssets);
    expect(result).toBe('![a](https://example.com/a.jpg)\n\n![b](https://example.com/c.png)');
  });

  it('does not modify successful asset paths', () => {
    const markdown = '![a](assets/image-001.jpg)\n\n![b](assets/image-002.jpg)';
    const imageMap: ImageMap = {
      'https://example.com/a.jpg': 'assets/image-001.jpg',
      'https://example.com/b.jpg': 'assets/image-002.jpg',
    };
    const failedAssets: ImageAsset[] = [
      makeAsset('https://example.com/a.jpg', 'assets/image-001.jpg', true),
    ];

    const result = patchFailedImageUrls(markdown, imageMap, failedAssets);
    expect(result).toContain('assets/image-002.jpg');
    expect(result).not.toContain('assets/image-001.jpg');
  });
});
