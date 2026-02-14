import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FIXTURES_DIR = join(import.meta.dirname, '..', 'fixtures');

/**
 * Read a fixture file from tests/fixtures/ by name.
 * @param name - Filename (e.g., 'basic-article.html')
 * @returns File contents as a string
 */
export function readFixture(name: string): string {
  return readFileSync(join(FIXTURES_DIR, name), 'utf-8');
}
