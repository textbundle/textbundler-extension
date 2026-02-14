import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'TextBundler',
    description:
      'Capture web pages as self-contained Markdown archives in TextBundle .textpack format',
    permissions: ['activeTab', 'contextMenus', 'downloads', 'notifications', 'scripting'],
  },
});
