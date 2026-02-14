import { describe, it, expect } from 'vitest';
import { Readability } from '@mozilla/readability';
import { readFixture } from './helpers/read-fixture';
import { parseHTML } from './helpers/parse-html';

const FIXTURE_FILES = [
  'basic-article.html',
  'code-blocks.html',
  'html-table.html',
  'figure-caption.html',
  'aside-admonition.html',
  'details-summary.html',
  'sup-sub.html',
  'lazy-images.html',
  'og-metadata.html',
  'minimal-metadata.html',
  'non-article.html',
  'embedded-video.html',
  'mixed-content.html',
];

const ARTICLE_FIXTURES = FIXTURE_FILES.filter((f) => f !== 'non-article.html');

describe('Tier 1 fixtures: HTML validity', () => {
  it.each(FIXTURE_FILES)('%s is parseable by linkedom', (filename) => {
    const html = readFixture(filename);
    const doc = parseHTML(html);
    expect(doc.body).not.toBeNull();
    expect(doc.documentElement).not.toBeNull();
  });
});

describe('Tier 1 fixtures: Readability extraction', () => {
  it.each(ARTICLE_FIXTURES)(
    '%s yields a non-null Readability result',
    (filename) => {
      const html = readFixture(filename);
      const doc = parseHTML(html);
      const result = new Readability(doc).parse();
      expect(result).not.toBeNull();
      expect(result!.content).toBeTruthy();
    },
    10_000,
  );

  it(
    'non-article.html causes Readability to return null',
    () => {
      const html = readFixture('non-article.html');
      const doc = parseHTML(html);
      const result = new Readability(doc).parse();
      expect(result).toBeNull();
    },
    10_000,
  );
});
