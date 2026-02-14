import { beforeEach, describe, expect, test } from 'vitest';
import JSZip from 'jszip';
import type { ImageAsset } from '../lib/types';
import { packageBundle } from '../lib/bundle-packager';

describe('packageBundle', () => {
  let mockAssets: ImageAsset[];

  beforeEach(() => {
    mockAssets = [
      {
        originalUrl: 'https://example.com/image1.jpg',
        filename: 'image-001.jpg',
        data: new ArrayBuffer(100),
        mimeType: 'image/jpeg',
        failed: false,
      },
      {
        originalUrl: 'https://example.com/image2.png',
        filename: 'image-002.png',
        data: new ArrayBuffer(200),
        mimeType: 'image/png',
        failed: false,
      },
      {
        originalUrl: 'https://example.com/failed.gif',
        filename: 'image-003.gif',
        data: new ArrayBuffer(0),
        mimeType: 'image/gif',
        failed: true,
      },
    ];
  });

  test('creates valid zip with all expected files', async () => {
    const frontmatter = '---\ntitle: Test Article\n---';
    const markdownBody = '# Test Article\n\nContent here.';
    const result = await packageBundle(
      frontmatter,
      markdownBody,
      mockAssets,
      'https://example.com/article',
      'Test Article',
      '2026-02-14',
    );

    expect(result.blob).toBeInstanceOf(Blob);
    expect(result.filename).toBe('2026-02-14-test-article.textpack');

    const arrayBuffer = await result.blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const files = Object.keys(zip.files);

    expect(files).toContain('info.json');
    expect(files).toContain('text.md');
    expect(files).toContain('assets/image-001.jpg');
    expect(files).toContain('assets/image-002.png');
    expect(files).not.toContain('assets/image-003.gif');
  });

  test('info.json contains correct TextBundle v2 metadata', async () => {
    const result = await packageBundle(
      '---\ntitle: Test\n---',
      'Content',
      [],
      'https://example.com/article',
      'Test Article',
      '2026-02-14',
    );

    const arrayBuffer = await result.blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const infoJsonContent = await zip.file('info.json')!.async('string');
    const infoJson = JSON.parse(infoJsonContent);

    expect(infoJson).toEqual({
      version: 2,
      type: 'net.daringfireball.markdown',
      transient: false,
      creatorIdentifier: 'org.textbundle.textbundler',
      creatorURL: 'https://github.com/textbundle/textbundler',
      sourceURL: 'https://example.com/article',
    });
  });

  test('text.md contains frontmatter + newline + markdownBody', async () => {
    const frontmatter = '---\ntitle: Test Article\nauthor: John Doe\n---';
    const markdownBody = '# Test Article\n\nThis is the content.';

    const result = await packageBundle(
      frontmatter,
      markdownBody,
      [],
      'https://example.com/article',
      'Test Article',
      '2026-02-14',
    );

    const arrayBuffer = await result.blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const textMdContent = await zip.file('text.md')!.async('string');

    expect(textMdContent).toBe(
      '---\ntitle: Test Article\nauthor: John Doe\n---\n# Test Article\n\nThis is the content.',
    );
  });

  test('all filenames inside zip are lowercase', async () => {
    const result = await packageBundle(
      '---\ntitle: Test\n---',
      'Content',
      mockAssets,
      'https://example.com/article',
      'Test Article',
      '2026-02-14',
    );

    const arrayBuffer = await result.blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const files = Object.keys(zip.files);

    files.forEach((filename) => {
      expect(filename).toBe(filename.toLowerCase());
    });
  });

  test('failed images are excluded from zip', async () => {
    const result = await packageBundle(
      '---\ntitle: Test\n---',
      'Content',
      mockAssets,
      'https://example.com/article',
      'Test Article',
      '2026-02-14',
    );

    const arrayBuffer = await result.blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    expect(zip.file('assets/image-001.jpg')).not.toBeNull();
    expect(zip.file('assets/image-002.png')).not.toBeNull();
    expect(zip.file('assets/image-003.gif')).toBeNull();
  });

  test('output filename matches {YYYY-MM-DD}-{slug}.textpack pattern', async () => {
    const result = await packageBundle(
      '---\ntitle: Test\n---',
      'Content',
      [],
      'https://example.com/article',
      "Rust's Ownership Model: A Deep Dive",
      '2026-01-15',
    );

    expect(result.filename).toBe(
      '2026-01-15-rust-s-ownership-model-a-deep-dive.textpack',
    );
  });

  test('uses current date when date is null', async () => {
    const today = new Date().toISOString().split('T')[0];
    const result = await packageBundle(
      '---\ntitle: Test\n---',
      'Content',
      [],
      'https://example.com/article',
      'Simple Title',
      null,
    );

    expect(result.filename).toBe(`${today}-simple-title.textpack`);
  });

  test('image data is correctly stored in zip', async () => {
    const testData = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
    const assets: ImageAsset[] = [
      {
        originalUrl: 'https://example.com/test.jpg',
        filename: 'image-001.jpg',
        data: testData.buffer,
        mimeType: 'image/jpeg',
        failed: false,
      },
    ];

    const result = await packageBundle(
      '---\ntitle: Test\n---',
      'Content',
      assets,
      'https://example.com/article',
      'Test Article',
      '2026-02-14',
    );

    const arrayBuffer = await result.blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const imageData = await zip
      .file('assets/image-001.jpg')!
      .async('arraybuffer');
    const retrievedData = new Uint8Array(imageData);

    expect(retrievedData).toEqual(testData);
  });

  test('handles empty assets array', async () => {
    const result = await packageBundle(
      '---\ntitle: Test\n---',
      'Content',
      [],
      'https://example.com/article',
      'Test Article',
      '2026-02-14',
    );

    const arrayBuffer = await result.blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const files = Object.keys(zip.files);

    expect(files).toContain('info.json');
    expect(files).toContain('text.md');
    expect(files.filter((f) => f.startsWith('assets/'))).toHaveLength(0);
  });

  test('handles very long title with slug truncation', async () => {
    const longTitle =
      'This is an extremely long title that exceeds the maximum allowed length for slug generation and should be truncated properly without trailing hyphens';

    const result = await packageBundle(
      '---\ntitle: Test\n---',
      'Content',
      [],
      'https://example.com/article',
      longTitle,
      '2026-02-14',
    );

    expect(result.filename).toMatch(/^2026-02-14-/);
    expect(result.filename).toMatch(/\.textpack$/);
    expect(result.filename).not.toMatch(/--/);

    const slug = result.filename
      .replace('2026-02-14-', '')
      .replace('.textpack', '');
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug).not.toMatch(/-$/);
  });
});
