import JSZip from 'jszip';
import type { ImageAsset } from './types';
import { generateFilename } from './slug';

/**
 * Package a complete TextBundle as a zip archive.
 * Section 4.4
 * FR-005, NFR-006
 *
 * @param frontmatter - YAML frontmatter block (including --- delimiters)
 * @param markdownBody - Markdown content (without frontmatter)
 * @param assets - Array of image assets (failed images excluded from zip)
 * @param sourceUrl - Original page URL for info.json
 * @param title - Article title for filename generation
 * @param date - ISO date string (YYYY-MM-DD) or null to use today's date
 * @returns Blob containing the zip file and the filename
 */
export async function packageBundle(
  frontmatter: string,
  markdownBody: string,
  assets: ImageAsset[],
  sourceUrl: string,
  title: string,
  date: string | null,
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();

  const infoJson = {
    version: 2,
    type: 'net.daringfireball.markdown',
    transient: false,
    creatorIdentifier: 'org.textbundle.textbundler',
    creatorURL: 'https://github.com/textbundle/textbundler',
    sourceURL: sourceUrl,
  };

  zip.file('info.json', JSON.stringify(infoJson, null, 2));

  const textMd = `${frontmatter}\n${markdownBody}`;
  zip.file('text.md', textMd);

  for (const asset of assets) {
    if (!asset.failed) {
      zip.file(asset.filename, asset.data);
    }
  }

  const arrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
  const blob = new Blob([arrayBuffer], { type: 'application/zip' });
  const filename = generateFilename(title, date);

  return { blob, filename };
}
