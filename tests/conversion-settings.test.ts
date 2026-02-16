import { describe, it, expect } from 'vitest';
import { applyDefaults } from '../lib/conversion-settings';

describe('applyDefaults', () => {
  it('returns defaults when input is undefined', () => {
    const result = applyDefaults(undefined);
    expect(result).toEqual({
      figureStyle: 'markdown',
      tableStyle: 'markdown',
    });
  });

  it('returns defaults when input is empty object', () => {
    const result = applyDefaults({});
    expect(result).toEqual({
      figureStyle: 'markdown',
      tableStyle: 'markdown',
    });
  });

  it('merges partial settings with defaults - figureStyle only', () => {
    const result = applyDefaults({ figureStyle: 'html' });
    expect(result).toEqual({
      figureStyle: 'html',
      tableStyle: 'markdown',
    });
  });

  it('merges partial settings with defaults - tableStyle only', () => {
    const result = applyDefaults({ tableStyle: 'html' });
    expect(result).toEqual({
      figureStyle: 'markdown',
      tableStyle: 'html',
    });
  });

  it('passes through full settings unchanged', () => {
    const result = applyDefaults({
      figureStyle: 'html',
      tableStyle: 'html',
    });
    expect(result).toEqual({
      figureStyle: 'html',
      tableStyle: 'html',
    });
  });

  it('passes through full markdown settings unchanged', () => {
    const result = applyDefaults({
      figureStyle: 'markdown',
      tableStyle: 'markdown',
    });
    expect(result).toEqual({
      figureStyle: 'markdown',
      tableStyle: 'markdown',
    });
  });
});
