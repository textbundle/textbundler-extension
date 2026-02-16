import type { ConversionSettings } from './types';

/**
 * Default conversion settings for HTML→Markdown conversion.
 * Configures both figures and tables to use Markdown mode by default.
 *
 * @see openspec/changes/configurable-figure-table-defaults/specs/conversion-settings.md
 */
export const DEFAULT_CONVERSION_SETTINGS: ConversionSettings = {
  figureStyle: 'markdown',
  tableStyle: 'markdown',
};

/**
 * Merges partial conversion settings with defaults to produce a complete ConversionSettings object.
 *
 * @param partial - Optional partial settings to override defaults
 * @returns Complete ConversionSettings with defaults applied
 * @see openspec/changes/configurable-figure-table-defaults/tasks.md Task Group 1
 */
export function applyDefaults(
  partial?: Partial<ConversionSettings>
): ConversionSettings {
  return {
    ...DEFAULT_CONVERSION_SETTINGS,
    ...partial,
  };
}
