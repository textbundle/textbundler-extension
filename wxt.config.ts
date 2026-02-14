import { defineConfig } from 'wxt';

export default defineConfig({
  outDir: 'dist',
  vite: () => ({
    define: {
      __DEV__: 'false',
    },
    build: {
      // No network transfer for local extension files; skip minification for readable stack traces
      minify: false,
    },
  }),
  manifest: {
    name: 'TextBundler',
    description:
      'Capture web pages as self-contained Markdown archives in TextBundle .textpack format',
    permissions: ['activeTab', 'contextMenus', 'downloads', 'notifications'],
    action: {
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
      },
      default_title: 'Archive Page as TextBundle',
    },
  },
});
