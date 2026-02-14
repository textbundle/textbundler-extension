import { describe, it, expect } from 'vitest';
import { Readability } from '@mozilla/readability';
import { convertToMarkdown } from '../lib/markdown-converter';
import { parseHTML } from './helpers/parse-html';
import { readFixture } from './helpers/read-fixture';

describe('convertToMarkdown', () => {
  describe('return type', () => {
    it('returns an object with markdown string and imageMap', () => {
      const result = convertToMarkdown('<p>Hello</p>');
      expect(result).toHaveProperty('markdown');
      expect(result).toHaveProperty('imageMap');
      expect(typeof result.markdown).toBe('string');
      expect(typeof result.imageMap).toBe('object');
    });

    it('returns an empty imageMap for base configuration', () => {
      const result = convertToMarkdown('<p>Hello</p>');
      expect(Object.keys(result.imageMap)).toHaveLength(0);
    });
  });

  describe('headings', () => {
    it('converts h1 to # (atx style)', () => {
      const { markdown } = convertToMarkdown('<h1>Title</h1>');
      expect(markdown).toContain('# Title');
    });

    it('converts h2 to ##', () => {
      const { markdown } = convertToMarkdown('<h2>Subtitle</h2>');
      expect(markdown).toContain('## Subtitle');
    });

    it('converts h3 to ###', () => {
      const { markdown } = convertToMarkdown('<h3>Section</h3>');
      expect(markdown).toContain('### Section');
    });

    it('converts h4 to ####', () => {
      const { markdown } = convertToMarkdown('<h4>Subsection</h4>');
      expect(markdown).toContain('#### Subsection');
    });

    it('converts h5 to #####', () => {
      const { markdown } = convertToMarkdown('<h5>Minor</h5>');
      expect(markdown).toContain('##### Minor');
    });

    it('converts h6 to ######', () => {
      const { markdown } = convertToMarkdown('<h6>Smallest</h6>');
      expect(markdown).toContain('###### Smallest');
    });

    it('preserves heading levels without promotion or demotion', () => {
      const html = '<h3>Start at H3</h3><h5>Jump to H5</h5>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toMatch(/^### Start at H3$/m);
      expect(markdown).toMatch(/^##### Jump to H5$/m);
    });
  });

  describe('paragraphs', () => {
    it('converts paragraphs to plain text', () => {
      const { markdown } = convertToMarkdown('<p>A simple paragraph.</p>');
      expect(markdown).toContain('A simple paragraph.');
    });

    it('separates consecutive paragraphs with blank lines', () => {
      const { markdown } = convertToMarkdown('<p>First</p><p>Second</p>');
      expect(markdown).toContain('First\n\nSecond');
    });
  });

  describe('inline formatting', () => {
    it('converts bold text', () => {
      const { markdown } = convertToMarkdown('<p><strong>bold</strong></p>');
      expect(markdown).toContain('**bold**');
    });

    it('converts italic text', () => {
      const { markdown } = convertToMarkdown('<p><em>italic</em></p>');
      expect(markdown).toContain('_italic_');
    });

    it('converts bold italic combined', () => {
      const { markdown } = convertToMarkdown(
        '<p><strong><em>bold italic</em></strong></p>',
      );
      expect(markdown).toContain('**_bold italic_**');
    });
  });

  describe('links', () => {
    it('converts links preserving absolute URLs', () => {
      const { markdown } = convertToMarkdown(
        '<p><a href="https://example.com">link text</a></p>',
      );
      expect(markdown).toContain('[link text](https://example.com)');
    });

    it('preserves absolute URLs without modification', () => {
      const { markdown } = convertToMarkdown(
        '<p><a href="https://example.com/path/to/page?q=1&r=2#section">complex link</a></p>',
      );
      expect(markdown).toContain(
        '[complex link](https://example.com/path/to/page?q=1&r=2#section)',
      );
    });
  });

  describe('lists', () => {
    it('converts unordered lists with - marker', () => {
      const html = '<ul><li>One</li><li>Two</li><li>Three</li></ul>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toMatch(/^- +One$/m);
      expect(markdown).toMatch(/^- +Two$/m);
      expect(markdown).toMatch(/^- +Three$/m);
      expect(markdown).not.toMatch(/^\*/m);
      expect(markdown).not.toMatch(/^\+/m);
    });

    it('converts ordered lists', () => {
      const html = '<ol><li>First</li><li>Second</li><li>Third</li></ol>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toMatch(/^1\.\s+First$/m);
      expect(markdown).toMatch(/^2\.\s+Second$/m);
      expect(markdown).toMatch(/^3\.\s+Third$/m);
    });
  });

  describe('code', () => {
    it('converts inline code', () => {
      const { markdown } = convertToMarkdown(
        '<p>Use <code>console.log()</code> for debugging.</p>',
      );
      expect(markdown).toContain('`console.log()`');
    });

    it('converts fenced code blocks', () => {
      const html =
        '<pre><code class="language-javascript">const x = 1;</code></pre>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('```javascript\nconst x = 1;\n```');
    });

    it('converts code blocks without language annotation', () => {
      const html = '<pre><code>plain code</code></pre>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('```\nplain code\n```');
    });
  });

  describe('blockquotes', () => {
    it('converts blockquotes', () => {
      const { markdown } = convertToMarkdown(
        '<blockquote><p>Quoted text.</p></blockquote>',
      );
      expect(markdown).toContain('> Quoted text.');
    });
  });

  describe('horizontal rules', () => {
    it('converts hr to ---', () => {
      const { markdown } = convertToMarkdown('<p>Before</p><hr><p>After</p>');
      expect(markdown).toContain('---');
    });
  });

  describe('GFM extensions', () => {
    it('converts strikethrough', () => {
      const { markdown } = convertToMarkdown('<p><del>deleted</del></p>');
      expect(markdown).toMatch(/~deleted~/);
    });
  });

  describe('basic-article.html fixture', () => {
    it(
      'converts the basic article fixture to valid markdown',
      () => {
        const html = readFixture('basic-article.html');
        const doc = parseHTML(html);
        const article = new Readability(doc).parse();
        expect(article).not.toBeNull();

        const { markdown, imageMap } = convertToMarkdown(article!.content);

        expect(markdown).toMatch(/^## Main Heading$/m);
        expect(markdown).toMatch(/^## Subheading$/m);
        expect(markdown).toMatch(/^### Third Level Heading$/m);
        expect(markdown).toMatch(/^#### Fourth Level Heading$/m);
        expect(markdown).toMatch(/^##### Fifth Level Heading$/m);
        expect(markdown).toMatch(/^###### Sixth Level Heading$/m);
        expect(markdown).toContain('**bold**');
        expect(markdown).toContain('_italic_');
        expect(markdown).toContain('[link](https://example.com)');
        expect(markdown).toMatch(/^- +Item one$/m);
        expect(markdown).toMatch(/^- +Item two$/m);
        expect(markdown).toMatch(/^- +Item three$/m);
        expect(markdown).toMatch(/^1\.\s+First$/m);
        expect(markdown).toMatch(/^2\.\s+Second$/m);
        expect(markdown).toMatch(/^3\.\s+Third$/m);
        expect(markdown).toContain('> This is a blockquote');
        expect(markdown).toContain('---');
        expect(markdown).toContain('**_bold italic_**');
        expect(Object.keys(imageMap)).toHaveLength(0);
      },
      10_000,
    );
  });
});
