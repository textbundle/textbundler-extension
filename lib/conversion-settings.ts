import type { ConversionSettings } from './types';

export const DEFAULT_CONVERSION_SETTINGS: ConversionSettings = {
  figureStyle: 'markdown',
  tableStyle: 'markdown',
};

export function applyDefaults(
  partial?: Partial<ConversionSettings>
): ConversionSettings {
  return {
    ...DEFAULT_CONVERSION_SETTINGS,
    ...partial,
  };
}
