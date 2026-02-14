import { parseHTML as linkedomParseHTML } from 'linkedom';

/**
 * Parse an HTML string into a Document using linkedom.
 * Standard way all tests create Document objects from HTML fixture strings or files.
 * @param html - Raw HTML string to parse
 * @returns Document object
 */
export function parseHTML(html: string): Document {
  const { document } = linkedomParseHTML(html);
  return document;
}
