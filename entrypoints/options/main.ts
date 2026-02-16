import { applyDefaults } from '@/lib/conversion-settings';
import type { ConversionSettings } from '@/lib/types';

const figureSelect = document.getElementById('figureStyle') as HTMLSelectElement;
const tableSelect = document.getElementById('tableStyle') as HTMLSelectElement;

async function loadSettings(): Promise<void> {
  const stored = await browser.storage.sync.get('conversionSettings');
  const settings = applyDefaults(stored.conversionSettings as Partial<ConversionSettings> | undefined);
  figureSelect.value = settings.figureStyle;
  tableSelect.value = settings.tableStyle;
}

async function saveSettings(): Promise<void> {
  const conversionSettings: ConversionSettings = {
    figureStyle: figureSelect.value as ConversionSettings['figureStyle'],
    tableStyle: tableSelect.value as ConversionSettings['tableStyle'],
  };
  await browser.storage.sync.set({ conversionSettings });
}

figureSelect.addEventListener('change', saveSettings);
tableSelect.addEventListener('change', saveSettings);

loadSettings();
