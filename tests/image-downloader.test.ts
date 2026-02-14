import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadImages } from '../lib/image-downloader';
import type { ImageMap } from '../lib/types';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetchSuccess(data: ArrayBuffer = new ArrayBuffer(8), contentType = 'image/jpeg') {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Headers({ 'Content-Type': contentType }),
    arrayBuffer: () => Promise.resolve(data),
  });
}

describe('downloadImages', () => {
  it('downloads images and returns ImageAsset array', async () => {
    const imageData = new ArrayBuffer(16);
    vi.stubGlobal('fetch', mockFetchSuccess(imageData, 'image/png'));

    const imageMap: ImageMap = {
      'https://example.com/photo.png': 'assets/image-001.png',
    };

    const assets = await downloadImages(imageMap);
    expect(assets).toHaveLength(1);
    expect(assets[0].originalUrl).toBe('https://example.com/photo.png');
    expect(assets[0].filename).toBe('assets/image-001.png');
    expect(assets[0].data).toBe(imageData);
    expect(assets[0].mimeType).toBe('image/png');
    expect(assets[0].failed).toBe(false);
  });

  it('produces failed asset on 404 error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
    }));

    const imageMap: ImageMap = {
      'https://example.com/missing.jpg': 'assets/image-001.jpg',
    };

    const assets = await downloadImages(imageMap);
    expect(assets).toHaveLength(1);
    expect(assets[0].failed).toBe(true);
    expect(assets[0].originalUrl).toBe('https://example.com/missing.jpg');
    expect(assets[0].filename).toBe('assets/image-001.jpg');
  });

  it('produces failed asset on network timeout', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_url: string, options?: { signal?: AbortSignal }) => {
      return new Promise((_resolve, reject) => {
        const signal = options?.signal;
        if (signal) {
          signal.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'));
          });
        }
      });
    }));

    vi.useFakeTimers();

    const imageMap: ImageMap = {
      'https://example.com/slow.jpg': 'assets/image-001.jpg',
    };

    const promise = downloadImages(imageMap);
    await vi.advanceTimersByTimeAsync(31000);
    const assets = await promise;

    expect(assets).toHaveLength(1);
    expect(assets[0].failed).toBe(true);

    vi.useRealTimers();
  });

  it('limits concurrency to 4 simultaneous downloads', async () => {
    let activeCount = 0;
    let maxActive = 0;

    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => {
      activeCount++;
      if (activeCount > maxActive) maxActive = activeCount;
      return new Promise((resolve) => {
        setTimeout(() => {
          activeCount--;
          resolve({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'image/jpeg' }),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)),
          });
        }, 10);
      });
    }));

    vi.useFakeTimers();

    const imageMap: ImageMap = {};
    for (let i = 1; i <= 8; i++) {
      imageMap[`https://example.com/img${i}.jpg`] = `assets/image-${String(i).padStart(3, '0')}.jpg`;
    }

    const promise = downloadImages(imageMap);

    await vi.advanceTimersByTimeAsync(5);
    expect(maxActive).toBeLessThanOrEqual(4);

    await vi.advanceTimersByTimeAsync(50);
    const assets = await promise;
    expect(assets).toHaveLength(8);
    expect(maxActive).toBe(4);

    vi.useRealTimers();
  });

  it('deduplicates same URL appearing multiple times', async () => {
    const fetchMock = mockFetchSuccess();
    vi.stubGlobal('fetch', fetchMock);

    const imageMap: ImageMap = {
      'https://example.com/photo.jpg': 'assets/image-001.jpg',
    };
    Object.defineProperty(imageMap, 'https://example.com/photo.jpg', {
      value: 'assets/image-001.jpg',
      enumerable: true,
    });

    const assets = await downloadImages(imageMap);
    expect(assets).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('passes credentials: include to fetch', async () => {
    const fetchMock = mockFetchSuccess();
    vi.stubGlobal('fetch', fetchMock);

    const imageMap: ImageMap = {
      'https://example.com/photo.jpg': 'assets/image-001.jpg',
    };

    await downloadImages(imageMap);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/photo.jpg',
      expect.objectContaining({ credentials: 'include' }),
    );
  });

  it('handles empty image map', async () => {
    const assets = await downloadImages({});
    expect(assets).toHaveLength(0);
  });

  it('handles mix of successful and failed downloads', async () => {
    let callCount = 0;
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 2) {
        return Promise.resolve({
          ok: false,
          status: 403,
          statusText: 'Forbidden',
          headers: new Headers(),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'image/jpeg' }),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)),
      });
    }));

    const imageMap: ImageMap = {
      'https://example.com/a.jpg': 'assets/image-001.jpg',
      'https://example.com/b.jpg': 'assets/image-002.jpg',
      'https://example.com/c.jpg': 'assets/image-003.jpg',
    };

    const assets = await downloadImages(imageMap);
    expect(assets).toHaveLength(3);
    const failed = assets.filter(a => a.failed);
    const succeeded = assets.filter(a => !a.failed);
    expect(failed).toHaveLength(1);
    expect(succeeded).toHaveLength(2);
  });
});
