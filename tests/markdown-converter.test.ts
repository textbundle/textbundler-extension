import { describe, it, expect } from 'vitest';
import { Readability } from '@mozilla/readability';
import { convertToMarkdown } from '../lib/markdown-converter';
import { parseHTML } from './helpers/parse-html';
import { readFixture } from './helpers/read-fixture';
import { normalizeMarkdown } from './helpers/normalize-markdown';

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

  describe('tables (HTML preservation)', () => {
    it('preserves simple table as inline HTML', () => {
      const html =
        '<table><tr><td>Cell</td></tr></table>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('<table>');
      expect(markdown).toContain('</table>');
    });

    it('preserves table with thead/tbody as inline HTML', () => {
      const html =
        '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('<thead>');
      expect(markdown).toContain('<tbody>');
      expect(markdown).toContain('<th>');
      expect(markdown).toContain('<td>');
    });

    it('preserves colspan and rowspan attributes', () => {
      const html =
        '<table><tr><td colspan="2">Wide</td></tr><tr><td rowspan="2">Tall</td><td>Cell</td></tr></table>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('colspan="2"');
      expect(markdown).toContain('rowspan="2"');
    });

    it('does not convert tables to GFM markdown table syntax', () => {
      const html =
        '<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).not.toMatch(/\|.*\|/);
    });

    it(
      'matches html-table.expected.md golden file',
      () => {
        const html = readFixture('html-table.html');
        const doc = parseHTML(html);
        const article = new Readability(doc).parse();
        expect(article).not.toBeNull();

        const { markdown } = convertToMarkdown(article!.content);
        const expected = readFixture('html-table.expected.md');

        expect(normalizeMarkdown(markdown)).toBe(
          normalizeMarkdown(expected),
        );
      },
      10_000,
    );
  });

  describe('details/summary (HTML preservation)', () => {
    it('preserves details element as inline HTML', () => {
      const html =
        '<details><summary>Title</summary><p>Content</p></details>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('<details>');
      expect(markdown).toContain('<summary>');
      expect(markdown).toContain('</details>');
    });

    it('preserves open attribute on details', () => {
      const html =
        '<details open><summary>Open section</summary><p>Visible</p></details>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('<details');
      expect(markdown).toContain('open');
    });

    it(
      'matches details-summary.expected.md golden file',
      () => {
        const html = readFixture('details-summary.html');
        const doc = parseHTML(html);
        const article = new Readability(doc).parse();
        expect(article).not.toBeNull();

        const { markdown } = convertToMarkdown(article!.content);
        const expected = readFixture('details-summary.expected.md');

        expect(normalizeMarkdown(markdown)).toBe(
          normalizeMarkdown(expected),
        );
      },
      10_000,
    );
  });

  describe('sup/sub (HTML preservation)', () => {
    it('preserves superscript as inline HTML', () => {
      const { markdown } = convertToMarkdown(
        '<p>E = mc<sup>2</sup></p>',
      );
      expect(markdown).toContain('<sup>2</sup>');
    });

    it('preserves subscript as inline HTML', () => {
      const { markdown } = convertToMarkdown(
        '<p>H<sub>2</sub>O</p>',
      );
      expect(markdown).toContain('<sub>2</sub>');
    });

    it('preserves links inside sup as HTML', () => {
      const { markdown } = convertToMarkdown(
        '<p>Text<sup><a href="#ref1">[1]</a></sup></p>',
      );
      expect(markdown).toContain('<sup><a href="#ref1">[1]</a></sup>');
    });

    it(
      'matches sup-sub.expected.md golden file',
      () => {
        const html = readFixture('sup-sub.html');
        const doc = parseHTML(html);
        const article = new Readability(doc).parse();
        expect(article).not.toBeNull();

        const { markdown } = convertToMarkdown(article!.content);
        const expected = readFixture('sup-sub.expected.md');

        expect(normalizeMarkdown(markdown)).toBe(
          normalizeMarkdown(expected),
        );
      },
      10_000,
    );
  });

  describe('embedded video iframes (HTML preservation)', () => {
    it('preserves YouTube iframe as inline HTML', () => {
      const html =
        '<iframe src="https://www.youtube.com/embed/abc123" width="560" height="315"></iframe>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('<iframe');
      expect(markdown).toContain('youtube.com');
      expect(markdown).toContain('</iframe>');
    });

    it('preserves Vimeo iframe as inline HTML', () => {
      const html =
        '<iframe src="https://player.vimeo.com/video/12345" width="640" height="360"></iframe>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('<iframe');
      expect(markdown).toContain('vimeo.com');
    });

    it('does not preserve non-video iframes', () => {
      const html =
        '<iframe src="https://example.com/widget"></iframe>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).not.toContain('<iframe');
    });

    it(
      'matches embedded-video.expected.md golden file',
      () => {
        const html = readFixture('embedded-video.html');
        const doc = parseHTML(html);
        const article = new Readability(doc).parse();
        expect(article).not.toBeNull();

        const { markdown } = convertToMarkdown(article!.content);
        const expected = readFixture('embedded-video.expected.md');

        expect(normalizeMarkdown(markdown)).toBe(
          normalizeMarkdown(expected),
        );
      },
      10_000,
    );
  });

  describe('figures (inline HTML with image rewriting)', () => {
    it('converts figure with img and figcaption to inline HTML', () => {
      const html =
        '<figure><img src="https://example.com/photo.jpg" alt="A photo"><figcaption>Caption text</figcaption></figure>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('<figure>');
      expect(markdown).toContain('</figure>');
      expect(markdown).toContain('<figcaption>');
      expect(markdown).toContain('alt="A photo"');
    });

    it('rewrites img src inside figure to assets/ path', () => {
      const html =
        '<figure><img src="https://example.com/photo.jpg" alt="A photo"><figcaption>Caption</figcaption></figure>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('src="assets/image-001.jpg"');
      expect(markdown).not.toContain('src="https://example.com/photo.jpg"');
    });

    it('converts figure without figcaption', () => {
      const html =
        '<figure><img src="https://example.com/photo.png" alt="No caption"></figure>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('<figure>');
      expect(markdown).toContain('src="assets/image-001.png"');
      expect(markdown).toContain('</figure>');
    });

    it('preserves linked image inside figure', () => {
      const html =
        '<figure><a href="https://example.com/gallery"><img src="https://example.com/photo.webp" alt="Linked"></a><figcaption>Click</figcaption></figure>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('<a href="https://example.com/gallery">');
      expect(markdown).toContain('src="assets/image-001.webp"');
    });

    it('populates imageMap for figure images', () => {
      const html =
        '<figure><img src="https://example.com/photo.jpg" alt="Test"></figure>';
      const { imageMap } = convertToMarkdown(html);
      expect(imageMap['https://example.com/photo.jpg']).toBe(
        'assets/image-001.jpg',
      );
    });

    it(
      'matches figure-caption.expected.md golden file',
      () => {
        const html = readFixture('figure-caption.html');
        const doc = parseHTML(html);
        const article = new Readability(doc).parse();
        expect(article).not.toBeNull();

        const { markdown, imageMap } = convertToMarkdown(article!.content);
        const expected = readFixture('figure-caption.expected.md');

        expect(normalizeMarkdown(markdown)).toBe(
          normalizeMarkdown(expected),
        );

        expect(imageMap['https://example.com/images/photo1.jpg']).toBe(
          'assets/image-001.jpg',
        );
        expect(imageMap['https://example.com/images/photo2.png']).toBe(
          'assets/image-002.png',
        );
        expect(imageMap['https://example.com/images/photo3.webp']).toBe(
          'assets/image-003.webp',
        );
      },
      10_000,
    );
  });

  describe('image source rewriting (standalone images)', () => {
    it('rewrites standalone img src to assets/ path', () => {
      const html = '<p><img src="https://example.com/photo.jpg" alt="Photo"></p>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('![Photo](assets/image-001.jpg)');
    });

    it('populates imageMap for standalone images', () => {
      const html = '<p><img src="https://example.com/photo.jpg" alt="Photo"></p>';
      const { imageMap } = convertToMarkdown(html);
      expect(imageMap['https://example.com/photo.jpg']).toBe(
        'assets/image-001.jpg',
      );
    });

    it('extracts extension from URL path', () => {
      const html =
        '<p><img src="https://example.com/image.png" alt="PNG"></p>' +
        '<p><img src="https://example.com/image.webp" alt="WebP"></p>';
      const { imageMap } = convertToMarkdown(html);
      expect(imageMap['https://example.com/image.png']).toBe(
        'assets/image-001.png',
      );
      expect(imageMap['https://example.com/image.webp']).toBe(
        'assets/image-002.webp',
      );
    });

    it('falls back to .jpg when extension is undetermined', () => {
      const html =
        '<p><img src="https://example.com/image" alt="No ext"></p>';
      const { imageMap } = convertToMarkdown(html);
      expect(imageMap['https://example.com/image']).toBe(
        'assets/image-001.jpg',
      );
    });

    it('falls back to .jpg for URLs with query strings and no path extension', () => {
      const html =
        '<p><img src="https://example.com/api/image?id=123" alt="API"></p>';
      const { imageMap } = convertToMarkdown(html);
      expect(imageMap['https://example.com/api/image?id=123']).toBe(
        'assets/image-001.jpg',
      );
    });

    it('uses 3-digit zero-padded counter', () => {
      const html =
        '<p><img src="https://example.com/a.jpg" alt=""></p>' +
        '<p><img src="https://example.com/b.jpg" alt=""></p>' +
        '<p><img src="https://example.com/c.jpg" alt=""></p>';
      const { imageMap } = convertToMarkdown(html);
      expect(imageMap['https://example.com/a.jpg']).toBe('assets/image-001.jpg');
      expect(imageMap['https://example.com/b.jpg']).toBe('assets/image-002.jpg');
      expect(imageMap['https://example.com/c.jpg']).toBe('assets/image-003.jpg');
    });

    it('handles empty alt text', () => {
      const html = '<p><img src="https://example.com/photo.jpg" alt=""></p>';
      const { markdown } = convertToMarkdown(html);
      expect(markdown).toContain('![](assets/image-001.jpg)');
    });
  });

  describe('image deduplication', () => {
    it('reuses filename for duplicate URLs', () => {
      const html =
        '<p><img src="https://example.com/photo.jpg" alt="First"></p>' +
        '<p><img src="https://example.com/photo.jpg" alt="Second"></p>';
      const { imageMap } = convertToMarkdown(html);
      expect(Object.keys(imageMap)).toHaveLength(1);
      expect(imageMap['https://example.com/photo.jpg']).toBe(
        'assets/image-001.jpg',
      );
    });

    it('does not increment counter for duplicate URLs', () => {
      const html =
        '<p><img src="https://example.com/a.jpg" alt=""></p>' +
        '<p><img src="https://example.com/a.jpg" alt=""></p>' +
        '<p><img src="https://example.com/b.jpg" alt=""></p>';
      const { imageMap } = convertToMarkdown(html);
      expect(imageMap['https://example.com/a.jpg']).toBe('assets/image-001.jpg');
      expect(imageMap['https://example.com/b.jpg']).toBe('assets/image-002.jpg');
    });
  });

  describe('shared image counter (figures + standalone)', () => {
    it('shares counter between figure images and standalone images', () => {
      const html =
        '<figure><img src="https://example.com/fig.jpg" alt="Figure"></figure>' +
        '<p><img src="https://example.com/standalone.jpg" alt="Standalone"></p>';
      const { imageMap } = convertToMarkdown(html);
      expect(imageMap['https://example.com/fig.jpg']).toBe(
        'assets/image-001.jpg',
      );
      expect(imageMap['https://example.com/standalone.jpg']).toBe(
        'assets/image-002.jpg',
      );
    });

    it('resets counter between calls to convertToMarkdown', () => {
      const html1 = '<p><img src="https://example.com/a.jpg" alt=""></p>';
      const html2 = '<p><img src="https://example.com/b.jpg" alt=""></p>';

      const result1 = convertToMarkdown(html1);
      const result2 = convertToMarkdown(html2);

      expect(result1.imageMap['https://example.com/a.jpg']).toBe(
        'assets/image-001.jpg',
      );
      expect(result2.imageMap['https://example.com/b.jpg']).toBe(
        'assets/image-001.jpg',
      );
    });
  });

});
