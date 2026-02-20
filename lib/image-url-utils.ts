const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/i;

export function extractExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const lastDot = pathname.lastIndexOf('.');
    if (lastDot !== -1) {
      const ext = pathname.slice(lastDot).toLowerCase();
      if (/^\.[a-z0-9]+$/.test(ext)) return ext;
    }
  } catch {
    // DD-12: fallback to .jpg for malformed URLs
  }
  return '.jpg';
}

export function extractBasename(url: string): string | null {
  try {
    const rawPathname = new URL(url).pathname;
    let pathname: string;
    try {
      pathname = decodeURIComponent(rawPathname);
    } catch {
      pathname = rawPathname;
    }
    const segments = pathname.split('/');
    let lastSegment = segments.pop() || '';
    if (!lastSegment) lastSegment = segments.pop() || '';
    const lastDot = lastSegment.lastIndexOf('.');
    const name = lastDot > 0 ? lastSegment.slice(0, lastDot) : lastSegment;
    const sanitized = name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return sanitized || null;
  } catch {
    return null;
  }
}

export function isImageUrl(url: string): boolean {
  try {
    return IMAGE_EXT_RE.test(new URL(url).pathname);
  } catch {
    return false;
  }
}
