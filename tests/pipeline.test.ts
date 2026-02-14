import { afterEach, describe, expect, test, vi } from 'vitest';
import JSZip from 'jszip';
import { parseHTML } from './helpers/parse-html';
import { readFixture } from './helpers/read-fixture';
import { extractArticle } from '../lib/readability-runner';
import { extractMetadata } from '../lib/metadata-extractor';
import { convertToMarkdown } from '../lib/markdown-converter';
import { downloadImages } from '../lib/image-downloader';
import { patchFailedImageUrls } from '../lib/image-patcher';
import { buildFrontmatter } from '../lib/frontmatter-builder';
import { packageBundle } from '../lib/bundle-packager';
import type { ImageMap } from '../lib/types';

describe('Full Pipeline Integration', { timeout: 10000 }, () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('full pipeline processes mixed-content.html successfully', async () => {
    const html = readFixture('mixed-content.html');
    const doc = parseHTML(html);
    const sourceUrl = 'https://example.com/guides/web-archiving';

    const article = extractArticle(doc);
    expect(article).not.toBeNull();
    expect(article!.title).toBe('The Complete Guide to Web Archiving');
    expect(article!.content).toContain('<figure>');

    const metadata = extractMetadata(doc, sourceUrl);
    expect(metadata.title).toBe('The Complete Guide to Web Archiving');
    expect(metadata.author).toBe('Alex Johnson');

    const { markdown, imageMap } = convertToMarkdown(article!.content);
    expect(markdown).toContain('assets/image-001.png');
    expect(imageMap['https://example.com/images/archive-diagram.png']).toBe('assets/image-001.png');

    imageMap['https://example.com/images/missing.jpg'] = 'assets/image-002.jpg';
    const markdownWithMissing = markdown + '\n\n![Missing image](assets/image-002.jpg)';

    const mockFetch = vi.fn((url: string | URL | Request) => {
      const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.href : url.url;

      if (urlStr === 'https://example.com/images/archive-diagram.png') {
        const pngData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
        return Promise.resolve(
          new Response(pngData.buffer, {
            status: 200,
            headers: { 'Content-Type': 'image/png' },
          }),
        );
      }

      if (urlStr === 'https://example.com/images/missing.jpg') {
        return Promise.resolve(
          new Response(null, { status: 404 }),
        );
      }

      return Promise.reject(new Error(`Unexpected fetch: ${urlStr}`));
    });

    vi.stubGlobal('fetch', mockFetch);

    const rawAssets = await downloadImages(imageMap);
    expect(rawAssets).toHaveLength(2);

    const assets = rawAssets.map(asset => ({
      ...asset,
      filename: asset.filename.replace(/^assets\//, ''),
    }));

    const successAsset = assets.find((a) => a.originalUrl === 'https://example.com/images/archive-diagram.png');
    expect(successAsset).toBeDefined();
    expect(successAsset!.failed).toBe(false);
    expect(successAsset!.filename).toBe('image-001.png');
    expect(successAsset!.mimeType).toBe('image/png');
    expect(successAsset!.data.byteLength).toBeGreaterThan(0);

    const failedAsset = assets.find((a) => a.originalUrl === 'https://example.com/images/missing.jpg');
    expect(failedAsset).toBeDefined();
    expect(failedAsset!.failed).toBe(true);
    expect(failedAsset!.filename).toBe('image-002.jpg');

    const failedAssets = rawAssets.filter((a) => a.failed);
    const patchedMarkdown = patchFailedImageUrls(markdownWithMissing, imageMap, failedAssets);
    expect(patchedMarkdown).not.toContain('assets/image-002.jpg');
    expect(patchedMarkdown).toContain('https://example.com/images/missing.jpg');

    const fixedDate = new Date('2026-02-14T12:00:00Z');
    const frontmatter = buildFrontmatter(metadata, article!.textContent, fixedDate);
    expect(frontmatter).toContain('title: The Complete Guide to Web Archiving');
    expect(frontmatter).toContain('author: Alex Johnson');
    expect(frontmatter).toContain('url: https://example.com/guides/web-archiving');
    expect(frontmatter).toContain('word_count:');
    expect(frontmatter).toContain('archived_at:');
    expect(frontmatter).toContain('2026-02-14T12:00:00.000Z');

    const { blob, filename } = await packageBundle(
      frontmatter,
      patchedMarkdown,
      assets,
      sourceUrl,
      article!.title,
      '2026-02-14',
    );

    expect(blob).toBeInstanceOf(Blob);
    expect(filename).toBe('2026-02-14-the-complete-guide-to-web-archiving.textpack');

    const arrayBuffer = await blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const files = Object.keys(zip.files);

    expect(files).toContain('info.json');
    expect(files).toContain('text.md');
    expect(files).toContain('assets/image-001.png');
    expect(files).not.toContain('assets/image-002.jpg');

    const infoJsonContent = await zip.file('info.json')!.async('string');
    const infoJson = JSON.parse(infoJsonContent);
    expect(infoJson).toEqual({
      version: 2,
      type: 'net.daringfireball.markdown',
      transient: false,
      creatorIdentifier: 'org.textbundle.textbundler',
      creatorURL: 'https://github.com/textbundle/textbundler',
      sourceURL: sourceUrl,
    });

    const textMdContent = await zip.file('text.md')!.async('string');
    expect(textMdContent).toContain('---');
    expect(textMdContent).toContain('title: The Complete Guide to Web Archiving');
    expect(textMdContent).toContain('## Why Archive Web Content?');
    expect(textMdContent).not.toContain('<nav>');
    expect(textMdContent).not.toContain('Related Articles');
    expect(textMdContent).not.toContain('Copyright 2025');
    expect(textMdContent).toContain('https://example.com/images/missing.jpg');

    const imageData = await zip.file('assets/image-001.png')!.async('arraybuffer');
    expect(imageData.byteLength).toBeGreaterThan(0);
  });

  test('returns null for non-article fixture', () => {
    const html = readFixture('non-article.html');
    const doc = parseHTML(html);

    const article = extractArticle(doc);
    expect(article).toBeNull();
  });
});
