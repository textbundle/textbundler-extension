# WXT - Next-Generation Web Extension Framework

WXT is a powerful, open-source framework for developing cross-browser web extensions. It provides a modern developer experience inspired by Nuxt, offering features like hot module replacement (HMR), file-based entrypoints, TypeScript support, auto-imports, and automated publishing. The framework supports all major browsers (Chrome, Firefox, Safari, Edge) and both Manifest V2 and V3, making it the go-to choice for extension developers who want to move fast without sacrificing quality.

Built on top of Vite, WXT handles the complex bundling, manifest generation, and browser-specific quirks automatically. It provides a module system for code reuse, supports all major frontend frameworks (Vue, React, Svelte, Solid), and includes utilities for common extension development patterns like storage, content script UI mounting, and messaging. WXT's file-based routing for entrypoints eliminates boilerplate configuration, while its powerful build hooks allow deep customization when needed.

## Installation and Project Setup

Bootstrap a new WXT project

```bash
# Using PNPM
pnpm dlx wxt@latest init

# Using Bun
bunx wxt@latest init

# Using NPM
npx wxt@latest init

# Follow prompts to select template (Vanilla, Vue, React, Svelte, or Solid)
# Select your preferred package manager
# Run the dev command shown
```

Install WXT in existing project

```bash
# Install WXT as dev dependency
pnpm i -D wxt

# Add scripts to package.json
# {
#   "scripts": {
#     "dev": "wxt",
#     "dev:firefox": "wxt -b firefox",
#     "build": "wxt build",
#     "zip": "wxt zip",
#     "postinstall": "wxt prepare"
#   }
# }

# Create first entrypoint at entrypoints/background.ts
# export default defineBackground(() => {
#   console.log('Hello world!');
# });

# Start development
pnpm dev
```

## Configuration with defineConfig

Define WXT project configuration

```ts
// wxt.config.ts
import { defineConfig } from 'wxt';

export default defineConfig({
  // Source directory containing entrypoints
  srcDir: 'src',

  // Output directory for built extension
  outDir: '.output',

  // Target browsers
  targetBrowsers: ['chrome', 'firefox', 'safari'],

  // Manifest configuration
  manifest: {
    name: 'My Extension',
    version: '1.0.0',
    permissions: ['storage', 'tabs', 'activeTab'],
    host_permissions: ['*://*.example.com/*'],
    web_accessible_resources: [
      {
        resources: ['injected.js', 'iframe.html'],
        matches: ['*://*.example.com/*'],
      },
    ],
  },

  // Enable bundle analysis
  analysis: {
    open: true,
  },

  // Configure browser startup for development
  webExt: {
    startUrls: ['https://example.com'],
  },

  // Add WXT modules
  modules: ['@wxt-dev/auto-icons'],
});
```

## Background Scripts with defineBackground

Create background service worker or page

```ts
// entrypoints/background.ts
export default defineBackground(() => {
  console.log('Extension installed!');

  // Listen for extension icon clicks
  browser.action.onClicked.addListener(async (tab) => {
    console.log('Extension icon clicked', tab);

    // Open options page
    await browser.runtime.openOptionsPage();
  });

  // Listen for messages from content scripts
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message:', message);
    sendResponse({ success: true });
    return true; // Required for async response
  });

  // Set up alarms
  browser.alarms.create('check-updates', { periodInMinutes: 60 });

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'check-updates') {
      console.log('Checking for updates...');
    }
  });
});
```

Configure background with manifest options

```ts
// entrypoints/background.ts
export default defineBackground({
  // For MV2, use persistent background page
  persistent: true,

  // Use ES modules (MV3 only)
  type: 'module',

  // Include/exclude from specific browser builds
  include: ['chrome', 'firefox'],
  exclude: ['safari'],

  main() {
    console.log('Background initialized');

    // All runtime code must be inside main()
    browser.runtime.onInstalled.addListener(({ reason }) => {
      if (reason === 'install') {
        console.log('First install!');
      } else if (reason === 'update') {
        console.log('Extension updated!');
      }
    });
  },
});
```

## Content Scripts with defineContentScript

Create content script with page matching

```ts
// entrypoints/content.ts
export default defineContentScript({
  // Required: specify which pages to run on
  matches: ['*://*.github.com/*'],

  // Optional: exclude specific patterns
  excludeMatches: ['*://gist.github.com/*'],

  // When to inject: document_start, document_end, or document_idle
  runAt: 'document_end',

  // Run in all frames (iframes) or just top frame
  allFrames: false,

  main(ctx) {
    console.log('Content script loaded on:', location.href);

    // Access content script context
    console.log('Context valid:', ctx.isValid);

    // Use context-aware event listeners that auto-cleanup
    ctx.addEventListener(window, 'click', (event) => {
      console.log('Page clicked', event.target);
    });

    // Add UI to the page
    const button = document.createElement('button');
    button.textContent = 'Click me!';
    button.onclick = () => {
      console.log('Button clicked!');
    };
    document.body.appendChild(button);
  },
});
```

Content script with CSS injection

```ts
// entrypoints/github.content/index.ts
import './style.css'; // CSS automatically bundled and injected

export default defineContentScript({
  matches: ['*://*.github.com/*'],

  // Control CSS injection mode
  // 'manifest' - CSS in manifest (default)
  // 'manual' - Manual injection via browser.scripting
  // 'ui' - For use with createShadowRootUi
  cssInjectionMode: 'manifest',

  // Control registration method
  // 'manifest' - Static in manifest (default)
  // 'runtime' - Dynamic via browser.scripting
  registration: 'manifest',

  async main(ctx) {
    // Wait for element before manipulating
    const navbar = await ctx.waitForElement('.Header');

    navbar.style.backgroundColor = 'var(--custom-color)';
  },
});
```

## Content Script UI with createShadowRootUi

Mount isolated UI in content script using Shadow DOM

```ts
// entrypoints/overlay.content/index.ts
import './style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'wxt-overlay',

      // Position: 'inline', 'overlay', or 'modal'
      position: 'overlay',

      // CSS selector or element to anchor to
      anchor: 'body',

      // Where to insert: 'first', 'last', 'before', 'after', 'replace'
      append: 'last',

      // Isolate events from page (optional)
      isolateEvents: ['keyup', 'keydown', 'keypress'],

      onMount(container) {
        container.innerHTML = `
          <div class="overlay-panel">
            <h2>Extension Overlay</h2>
            <button id="close-btn">Close</button>
          </div>
        `;

        const closeBtn = container.querySelector('#close-btn');
        closeBtn?.addEventListener('click', () => {
          ui.remove();
        });
      },
    });

    // Show the UI
    ui.mount();
  },
});
```

Mount UI with React

```tsx
// entrypoints/sidebar.content/index.tsx
import './style.css';
import ReactDOM from 'react-dom/client';
import App from './App';

export default defineContentScript({
  matches: ['*://*.example.com/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'wxt-sidebar',
      position: 'inline',
      anchor: '#main-content',
      append: 'after',

      onMount(container) {
        const app = document.createElement('div');
        container.appendChild(app);

        const root = ReactDOM.createRoot(app);
        root.render(<App />);

        return root;
      },

      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
```

Mount UI to dynamically appearing elements

```ts
// entrypoints/youtube.content.ts
import './style.css';

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'youtube-extension',
      position: 'inline',

      // Anchor that may not exist yet
      anchor: '#movie_player',
      append: 'first',

      onMount(container) {
        container.innerHTML = `
          <div class="video-overlay">
            <button>Custom Control</button>
          </div>
        `;
      },
    });

    // Auto-mount when anchor appears, auto-unmount when removed
    ui.autoMount();
  },
});
```

## Content Script UI with createIframeUi

Mount UI using an iframe for complete isolation

```ts
// entrypoints/panel.content/index.ts
export default defineContentScript({
  matches: ['*://*.example.com/*'],

  async main(ctx) {
    const ui = createIframeUi(ctx, {
      // HTML page to load in iframe (must be unlisted HTML page)
      page: '/panel.html',

      // Position: 'inline', 'overlay', or 'modal'
      position: 'overlay',
      anchor: 'body',
      append: 'last',

      onMount(wrapper, iframe) {
        // Customize wrapper or iframe appearance
        wrapper.style.zIndex = '9999';
        iframe.style.width = '300px';
        iframe.style.height = '400px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';

        console.log('Iframe UI mounted');
      },

      onRemove() {
        console.log('Iframe UI removed');
      },
    });

    ui.mount();
  },
});
```

## Content Script UI with createIntegratedUi

Mount UI directly in page DOM without isolation

```ts
// entrypoints/banner.content/index.ts
export default defineContentScript({
  matches: ['*://*.example.com/*'],

  async main(ctx) {
    const ui = createIntegratedUi(ctx, {
      // Optional: custom tag for wrapper element (default: 'div')
      tag: 'section',

      position: 'inline',
      anchor: 'body',
      append: 'first',

      onMount(wrapper) {
        // Create UI directly in page DOM (no shadow DOM)
        wrapper.style.padding = '10px';
        wrapper.style.backgroundColor = '#f0f0f0';
        wrapper.innerHTML = `
          <p>This banner is integrated directly into the page DOM</p>
        `;

        return wrapper;
      },

      onRemove(mounted) {
        console.log('Integrated UI removed');
      },
    });

    ui.mount();
  },
});
```

## Storage with storage.defineItem

Define typed storage items with versioning

```ts
// entrypoints/background.ts
import { storage } from 'wxt/storage';

// Define storage item with default value
const counter = storage.defineItem<number>('local:counter', {
  fallback: 0,

  // Initialize value if not present
  init: () => 0,
});

// Define storage with versioning and migrations
const settings = storage.defineItem<UserSettings>('local:settings', {
  fallback: { theme: 'light', lang: 'en' },

  version: 2,
  migrations: {
    // Migrate from v1 to v2
    2: (oldSettings: any) => {
      return {
        ...oldSettings,
        lang: oldSettings.language || 'en', // Rename field
      };
    },
  },

  // Debug migration process
  debug: true,

  onMigrationComplete: (value, version) => {
    console.log(`Migrated to v${version}:`, value);
  },
});

export default defineBackground(async () => {
  // Get value
  const count = await counter.getValue();
  console.log('Counter:', count);

  // Set value
  await counter.setValue(count + 1);

  // Watch for changes
  counter.watch((newValue, oldValue) => {
    console.log(`Counter changed: ${oldValue} -> ${newValue}`);
  });

  // Get/set metadata
  await counter.setMeta({ lastUpdated: Date.now() });
  const meta = await counter.getMeta();
  console.log('Metadata:', meta);

  // Remove value
  await counter.removeValue({ removeMeta: true });
});
```

Use storage directly without defineItem

```ts
import { storage } from 'wxt/storage';

// Get item
const theme = await storage.getItem<string>('local:theme');

// Get with fallback
const lang = await storage.getItem('sync:language', {
  fallback: 'en'
});

// Set item
await storage.setItem('local:theme', 'dark');

// Get multiple items
const items = await storage.getItems([
  'local:counter',
  'sync:settings',
  { key: 'session:temp', options: { fallback: {} } }
]);

// Set multiple items
await storage.setItems([
  { key: 'local:theme', value: 'dark' },
  { key: 'local:lang', value: 'fr' }
]);

// Remove item
await storage.removeItem('local:theme');

// Clear entire storage area
await storage.clear('local');

// Create snapshot
const snapshot = await storage.snapshot('local', {
  excludeKeys: ['temp', 'cache']
});

// Restore snapshot
await storage.restoreSnapshot('local', snapshot);

// Watch for changes
const unwatch = storage.watch('local:theme', (newValue, oldValue) => {
  console.log('Theme changed:', { newValue, oldValue });
});

// Stop watching
unwatch();
```

## Runtime Configuration with defineAppConfig

Define runtime configuration in a single place

```ts
// app.config.ts
import { defineAppConfig } from 'wxt/utils/define-app-config';

// Define types for your config
declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    theme?: 'light' | 'dark';
    apiUrl: string;
    features: string[];
  }
}

export default defineAppConfig({
  theme: 'dark',
  apiUrl: 'https://api.example.com',
  features: ['analytics', 'notifications'],
});
```

Access runtime config

```ts
// entrypoints/background.ts
import { useAppConfig } from 'wxt/utils/app-config';

export default defineBackground(() => {
  const config = useAppConfig();

  console.log('Theme:', config.theme); // "dark"
  console.log('API URL:', config.apiUrl);

  // Use config throughout your extension
  if (config.features.includes('analytics')) {
    initializeAnalytics();
  }
});
```

Use environment variables in app config

```ts
// app.config.ts
declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    apiKey?: string;
    skipWelcome: boolean;
    environment: 'dev' | 'prod';
  }
}

export default defineAppConfig({
  // Convert env vars to proper types
  apiKey: import.meta.env.WXT_API_KEY,
  skipWelcome: import.meta.env.WXT_SKIP_WELCOME === 'true',
  environment: import.meta.env.MODE === 'production' ? 'prod' : 'dev',
});
```

## HTML Entrypoints (Popup, Options, Newtab)

Create popup page

```html
<!-- entrypoints/popup.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Extension Popup</title>

    <!-- Optional: customize manifest options -->
    <meta name="manifest.default_icon" content='{"16": "/icon-16.png", "48": "/icon-48.png"}' />
    <meta name="manifest.browser_style" content="false" />

    <!-- Optional: exclude from specific builds -->
    <meta name="manifest.exclude" content='["safari"]' />
  </head>
  <body>
    <h1>My Extension</h1>
    <button id="options-btn">Open Options</button>

    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

Create options page

```html
<!-- entrypoints/options.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Extension Options</title>

    <!-- Open in new tab instead of inline -->
    <meta name="manifest.open_in_tab" content="true" />
  </head>
  <body>
    <h1>Settings</h1>
    <label>
      <input type="checkbox" id="feature-enabled" />
      Enable Feature
    </label>

    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

Create custom new tab page

```html
<!-- entrypoints/newtab.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>New Tab</title>
  </head>
  <body>
    <h1>Custom New Tab Page</h1>
    <input type="text" placeholder="Search..." />

    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

Create unlisted page

```html
<!-- entrypoints/welcome.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome</title>
  </head>
  <body>
    <h1>Welcome to My Extension!</h1>

    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

```ts
// Open unlisted page from background
export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
      const url = browser.runtime.getURL('/welcome.html');
      browser.tabs.create({ url });
    }
  });
});
```

## Unlisted Scripts with defineUnlistedScript

Create unlisted script for injection

```ts
// entrypoints/injected.ts
export default defineUnlistedScript(() => {
  console.log('Running in main world!');

  // Access page variables
  console.log('window.somePageVar:', (window as any).somePageVar);

  // Modify page behavior
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    console.log('Fetch intercepted:', args[0]);
    return originalFetch.apply(this, args);
  };
});
```

Inject unlisted script from content script

```ts
// entrypoints/content.ts
export default defineContentScript({
  matches: ['*://*.example.com/*'],

  async main(ctx) {
    console.log('Injecting main world script...');

    // Inject the script
    const { script } = await injectScript('/injected.js', {
      keepInDom: true, // Keep script tag in DOM (default: false)

      // Modify script before injection
      modifyScript: async (script) => {
        // Pass data via dataset
        script.dataset.apiKey = 'abc123';
        script.async = false;

        // Add event listener
        script.addEventListener('load', () => {
          console.log('Script loaded!');
        });
      },
    });

    // Send custom event to injected script
    script.dispatchEvent(new CustomEvent('extension-ready', {
      detail: { version: '1.0.0' }
    }));

    console.log('Script injected!');
  },
});
```

```ts
// wxt.config.ts - make script web accessible
export default defineConfig({
  manifest: {
    web_accessible_resources: [
      {
        resources: ['injected.js'],
        matches: ['*://*.example.com/*'],
      },
    ],
  },
});
```

## WXT Modules with defineWxtModule

Create local module

```ts
// modules/custom-module.ts
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    wxt.logger.info('Custom module loaded!');

    // Hook into build lifecycle
    wxt.hook('build:before', () => {
      console.log('Build starting...');
    });

    wxt.hook('build:manifestGenerated', (wxt, manifest) => {
      // Modify manifest
      manifest.content_security_policy = {
        extension_pages: "script-src 'self'; object-src 'self';"
      };
    });

    // Add custom entrypoints
    wxt.hook('entrypoints:found', (wxt, entrypoints) => {
      entrypoints.push({
        name: 'custom-script',
        inputPath: 'custom/script.js',
        type: 'unlisted-script',
      });
    });
  },
});
```

Create module with build-time configuration

```ts
// modules/analytics.ts
import { defineWxtModule } from 'wxt/modules';
import 'wxt';

export interface AnalyticsOptions {
  apiKey: string;
  debug?: boolean;
}

declare module 'wxt' {
  export interface InlineConfig {
    analytics?: AnalyticsOptions;
  }
}

export default defineWxtModule<AnalyticsOptions>({
  configKey: 'analytics',

  setup(wxt, options) {
    if (!options?.apiKey) {
      throw new Error('Analytics API key required');
    }

    wxt.logger.info(`Analytics module loaded with key: ${options.apiKey}`);

    // Use options during build
    if (options.debug) {
      wxt.logger.debug('Debug mode enabled');
    }
  },
});
```

```ts
// wxt.config.ts - use module
export default defineConfig({
  modules: [
    // NPM modules
    '@wxt-dev/auto-icons',

    // Local modules (auto-loaded from modules/ directory)
  ],

  // Module configuration
  analytics: {
    apiKey: 'abc123',
    debug: true,
  },
});
```

Use module helper functions

```ts
// modules/feature-module.ts
import { defineWxtModule, addEntrypoint, addPublicAssets, addViteConfig, addWxtPlugin, addImportPreset, addAlias } from 'wxt/modules';

export default defineWxtModule((wxt) => {
  // Add entrypoint programmatically
  addEntrypoint(wxt, {
    type: 'content-script',
    name: 'custom-script',
    inputPath: '/path/to/script.ts',
    outputDir: wxt.config.outDir,
    options: {
      matches: ['*://*.example.com/*'],
    },
  });

  // Copy pre-built assets to output directory
  addPublicAssets(wxt, './dist/prebundled');

  // Add Vite configuration
  addViteConfig(wxt, () => ({
    build: {
      sourcemap: true,
    },
    define: {
      __FEATURE_ENABLED__: 'true',
    },
  }));

  // Add runtime plugin
  addWxtPlugin(wxt, 'my-module/client-plugin');

  // Add auto-import preset
  addImportPreset(wxt, {
    from: 'my-library',
    imports: ['useThing', 'doStuff'],
  });

  // Add import alias
  addAlias(wxt, '#feature', './generated/feature.ts');
});
```

## Build Hooks

Use hooks to customize build process

```ts
// wxt.config.ts
export default defineConfig({
  hooks: {
    // Before build starts
    'build:before': (wxt) => {
      console.log('Starting build...');
    },

    // After manifest is generated
    'build:manifestGenerated': (wxt, manifest) => {
      // Add content script programmatically
      manifest.content_scripts ??= [];
      manifest.content_scripts.push({
        matches: ['*://*.example.com/*'],
        js: ['content-scripts/custom.js'],
        css: ['content-scripts/custom.css'],
      });

      // Modify permissions
      manifest.permissions ??= [];
      if (!manifest.permissions.includes('storage')) {
        manifest.permissions.push('storage');
      }
    },

    // Add public assets
    'build:publicAssets': (wxt, assets) => {
      assets.push({
        relativeDest: 'data.json',
        contents: JSON.stringify({ version: '1.0.0' }),
      });
    },

    // After build completes
    'build:done': (wxt, output) => {
      console.log('Build complete!');
      console.log('Output:', output.manifest);
    },

    // Generate type files
    'prepare:types': async (wxt, entries) => {
      entries.push({
        path: 'custom-types.d.ts',
        text: 'declare const CUSTOM_CONSTANT: string;',
        tsReference: true,
      });
    },
  },
});
```

## Browser-Specific Builds

Build for specific browsers

```bash
# Build for Chrome (default)
wxt build

# Build for Firefox
wxt build -b firefox

# Build for Safari
wxt build -b safari

# Build for multiple browsers
wxt build -b chrome,firefox,safari
```

Target specific browsers in configuration

```ts
// wxt.config.ts
export default defineConfig({
  // Build for these browsers by default
  targetBrowsers: ['chrome', 'firefox'],

  manifest: {
    // Browser-specific manifest fields auto-handled
    name: 'My Extension',

    // Chrome-specific
    browser_specific_settings: {
      gecko: {
        id: 'extension@example.com',
        strict_min_version: '109.0',
      },
    },
  },
});
```

Conditional code for specific browsers

```ts
// Use import.meta.env.BROWSER to check current build target
export default defineBackground(() => {
  if (import.meta.env.BROWSER === 'firefox') {
    console.log('Running on Firefox');
  } else if (import.meta.env.BROWSER === 'chrome') {
    console.log('Running on Chrome');
  }

  // Use import.meta.env.MANIFEST_VERSION
  if (import.meta.env.MANIFEST_VERSION === 3) {
    console.log('Using MV3');
  }
});
```

WXT is designed to streamline web extension development by handling the complexity of multi-browser support, build configuration, and common patterns. The file-based entrypoint system eliminates boilerplate manifest configuration while maintaining full control through TypeScript definitions and build hooks. Whether you're building a simple content script enhancement or a complex multi-page extension with background processing, WXT provides the structure and utilities to build efficiently.

The framework's integration with modern frontend tooling (Vite, TypeScript, hot module replacement) brings web extension development up to par with modern web development. Combined with built-in utilities for storage, UI mounting, and browser API access, WXT enables developers to focus on extension logic rather than build configuration and cross-browser compatibility issues. The module system and hooks provide extension points for teams to standardize patterns and share code across multiple extension projects.
