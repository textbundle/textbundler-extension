import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseHTML } from './helpers/parse-html';
import { extractArticle } from '../lib/readability-runner';
import { extractMetadata } from '../lib/metadata-extractor';
import { convertToMarkdown } from '../lib/markdown-converter';
import { buildFrontmatter } from '../lib/frontmatter-builder';
import yaml from 'js-yaml';

const SITES_DIR = join(__dirname, 'sites');

const NON_ARTICLE_FILES = new Set([
  '19-hn-comments.html',
  '20-github-search.html',
]);

const fixturesExist =
  existsSync(SITES_DIR) &&
  readdirSync(SITES_DIR).some((f) => f.endsWith('.html'));

const htmlFiles = fixturesExist
  ? readdirSync(SITES_DIR)
      .filter((f) => f.endsWith('.html'))
      .sort()
  : [];

describe.skipIf(!fixturesExist)('Tier 2 site smoke tests', () => {
  for (const file of htmlFiles) {
    const filePath = join(SITES_DIR, file);

    if (NON_ARTICLE_FILES.has(file)) {
      it(
        `${file} — Readability returns null (non-article)`,
        () => {
          const html = readFileSync(filePath, 'utf-8');
          const document = parseHTML(html);
          const article = extractArticle(document);
          expect(article).toBeNull();
        },
        { timeout: 10_000 },
      );
    } else {
      it(
        `${file} — extracts article`,
        () => {
          const html = readFileSync(filePath, 'utf-8');
          const document = parseHTML(html);
          const article = extractArticle(document);
          expect(article).not.toBeNull();
          expect(article!.title).toBeTruthy();
          expect(article!.content).toBeTruthy();
        },
        { timeout: 10_000 },
      );

      it(
        `${file} — extracts metadata with title and url`,
        () => {
          const html = readFileSync(filePath, 'utf-8');
          const document = parseHTML(html);
          const url = `https://example.com/${file}`;
          const metadata = extractMetadata(document, url);
          expect(metadata.title).toBeTruthy();
          expect(metadata.url).toBe(url);
        },
        { timeout: 10_000 },
      );

      it(
        `${file} — converts to Markdown without nav/header/footer tags`,
        () => {
          const html = readFileSync(filePath, 'utf-8');
          const document = parseHTML(html);
          const article = extractArticle(document);
          expect(article).not.toBeNull();
          const { markdown } = convertToMarkdown(article!.content);
          expect(markdown.length).toBeGreaterThan(0);
          expect(markdown).not.toMatch(/<nav[\s>]/i);
          expect(markdown).not.toMatch(/<header[\s>]/i);
          expect(markdown).not.toMatch(/<footer[\s>]/i);
        },
        { timeout: 10_000 },
      );

      it(
        `${file} — builds valid YAML frontmatter`,
        () => {
          const html = readFileSync(filePath, 'utf-8');
          const document = parseHTML(html);
          const article = extractArticle(document);
          expect(article).not.toBeNull();
          const url = `https://example.com/${file}`;
          const metadata = extractMetadata(document, url);
          const frontmatter = buildFrontmatter(metadata, article!.textContent);
          expect(frontmatter).toMatch(/^---\n/);
          expect(frontmatter).toMatch(/\n---\n$/);
          const yamlContent = frontmatter.replace(/^---\n/, '').replace(/\n---\n$/, '');
          const parsed = yaml.load(yamlContent);
          expect(parsed).toBeDefined();
          expect(typeof parsed).toBe('object');
        },
        { timeout: 10_000 },
      );
    }
  }
});
