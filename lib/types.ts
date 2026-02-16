/** Readability extraction result. Section 4.2 */
export interface ArticleResult {
  title: string;
  content: string;
  textContent: string;
  excerpt: string;
  byline: string | null;
  length: number;
}

/** Message from Content Script to Background Script. Section 4.2 */
export interface ExtractionResult {
  type: 'archive-page';
  article: ArticleResult;
  markdown: string;
  imageMap: ImageMap;
  metadata: PageMetadata;
  sourceUrl: string;
}

/** Page metadata extracted from <head>, OG tags, JSON-LD. Section 4.2 */
export interface PageMetadata {
  title: string;
  author: string | string[] | null;
  date: string | null;
  url: string;
  canonicalUrl: string | null;
  siteName: string | null;
  language: string | null;
  description: string | null;
  excerpt: string | null;
  keywords: string[] | null;
  ogImage: string | null;
  ogType: string | null;
}

/** Extraction failure message. Section 4.2 */
export interface ExtractionFailure {
  type: 'extraction-failed';
  url: string;
  reason: string;
}

/** Downloaded image asset. Section 4.2 */
export interface ImageAsset {
  originalUrl: string;
  filename: string;
  data: ArrayBuffer;
  mimeType: string;
  failed: boolean;
}

/** Map from original image URL to assets/ filename. Section 4.2 */
export interface ImageMap {
  [originalUrl: string]: string;
}

/** Complete TextBundle contents ready for packaging. Section 4.2 */
export interface TextBundleContents {
  markdown: string;
  infoJson: string;
  assets: ImageAsset[];
  filename: string;
}

/** Background to Content Script response. Section 4.2 */
export interface ArchiveResponse {
  success: boolean;
  error?: string;
  filename?: string;
}

export interface ConversionSettings {
  figureStyle: 'markdown' | 'html';
  tableStyle: 'markdown' | 'html';
}
