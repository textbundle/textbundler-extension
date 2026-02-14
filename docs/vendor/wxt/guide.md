### Run WXT Development Mode (PNPM, Bun, NPM, Yarn)

Source: https://wxt.dev/guide/installation

Starts the WXT development server using the 'dev' script defined in package.json. This command will automatically open a browser window with the extension installed, allowing for live development.

```shell
pnpm dev
```

```shell
bun run dev
```

```shell
npm run dev
```

```shell
yarn dev
```

--------------------------------

### Create New Project Directory (PNPM, Bun, NPM, Yarn)

Source: https://wxt.dev/guide/installation

Creates a new project directory and initializes a new project using PNPM, Bun, NPM, or Yarn. This is the first step when starting a WXT project from scratch.

```shell
cd my-project
pnpm init
```

```shell
cd my-project
bun init
```

```shell
cd my-project
npm init
```

```shell
cd my-project
yarn init
```

--------------------------------

### Bootstrap New WXT Project (PNPM, Bun, NPM, Yarn)

Source: https://wxt.dev/guide/installation

Initializes a new WXT project using the 'init' command. This command guides the user through setup and offers various starter templates like Vanilla, Vue, React, Svelte, and Solid. All templates default to TypeScript, but JavaScript can be used by changing file extensions.

```shell
pnpm dlx wxt@latest init
```

```shell
bunx wxt@latest init
```

```shell
npx wxt@latest init
```

```shell
# Use NPM initially, but select Yarn when prompted
npx wxt@latest init
```

--------------------------------

### WXT Background Entrypoint (TypeScript)

Source: https://wxt.dev/guide/installation

Defines a background script entrypoint for a WXT extension using TypeScript. This example shows a simple 'Hello world!' log when the background service worker is initialized.

```typescript
export default defineBackground(() => {
  console.log('Hello world!');
});
```

--------------------------------

### Unlisted CSS Entrypoint Example

Source: https://wxt.dev/guide/essentials/entrypoints

Defines an unlisted CSS entrypoint. These files are processed by WXT and output as CSS. The example shows a basic CSS rule. For preprocessors like Sass or Less, Vite's setup guide should be followed. These are distinct from CSS added to content scripts.

```css
body {
  /* ... */
}
```

--------------------------------

### Install WXT Dependency (PNPM, Bun, NPM, Yarn)

Source: https://wxt.dev/guide/installation

Installs WXT as a development dependency in an existing project using PNPM, Bun, NPM, or Yarn. This command should be run after initializing a new project directory.

```shell
pnpm i -D wxt
```

```shell
bun i -D wxt
```

```shell
npm i -D wxt
```

```shell
yarn add --dev wxt
```

--------------------------------

### Basic WXT Module Structure

Source: https://wxt.dev/guide/essentials/wxt-modules

Illustrates the fundamental structure of a WXT module using `defineWxtModule`. The `setup` function is where module logic resides and is executed after the configuration is loaded.

```typescript
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    // Your module code here...
  },
});
```

--------------------------------

### MV3 Manifest Example

Source: https://wxt.dev/guide/essentials/config/manifest

Example of how WXT generates manifest.json for MV3, using the standard 'action' and 'web_accessible_resources' formats.

```json
{
  "manifest_version": 3,
  // ...
  "action": {
    "default_title": "Some Title"
  },
  "web_accessible_resources": [
    {
      "matches": ["*://*.google.com/*"],
      "resources": ["icon/*.png"]
    }
  ]
}
```

--------------------------------

### MV2 Manifest Example

Source: https://wxt.dev/guide/essentials/config/manifest

Example of how WXT generates manifest.json for MV2, converting properties like 'action' and 'web_accessible_resources' to their MV2 equivalents.

```json
{
  "manifest_version": 2,
  // ...
  "browser_action": {
    "default_title": "Some Title"
  },
  "web_accessible_resources": ["icon/*.png"]
}
```

--------------------------------

### Add WXT Postinstall Script

Source: https://wxt.dev/guide/resources/migrate

This script ensures that WXT preparations are run automatically after package installation. It's crucial for setting up the WXT environment correctly within your project's `node_modules`.

```json
{
  "scripts": {
    "postinstall": "wxt prepare"
  }
}
```

--------------------------------

### Entrypoint Folder Structure Examples

Source: https://wxt.dev/guide/essentials/entrypoints

Illustrates the recommended folder structures for defining entrypoints in WXT. An entrypoint can be a single file (e.g., `background.ts`) or a directory with an `index` file (e.g., `popup/index.html`).

```html
📂 entrypoints/
   📄 {name}.{ext}
```

```html
📂 entrypoints/
   📂 {name}/
      📄 index.{ext}
```

```html
📂 entrypoints/
   📄 background.ts
```

```html
📂 entrypoints/
   📂 background/
      📄 index.ts
```

--------------------------------

### WXT Package.json Scripts (JSON)

Source: https://wxt.dev/guide/installation

Configures essential scripts in the package.json file for WXT development and building. Includes commands for development mode, Firefox builds, production builds, zipping, and post-install preparation.

```json
{
  "scripts": {
    "dev": "wxt", 
    "dev:firefox": "wxt -b firefox", 
    "build": "wxt build", 
    "build:firefox": "wxt build -b firefox", 
    "zip": "wxt zip", 
    "zip:firefox": "wxt zip -b firefox", 
    "postinstall": "wxt prepare"
  }
}
```

--------------------------------

### WXT Default Config File Example (TypeScript)

Source: https://wxt.dev/guide/essentials/config/browser-startup

This snippet shows the basic structure of a `web-ext.config.ts` file for WXT projects. It's used to configure project-specific options for browser startup during development. This file is ignored by version control.

```typescript
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
  // ...
});

```

--------------------------------

### Defining HTML Entrypoint Options via Meta Tags

Source: https://wxt.dev/guide/essentials/entrypoints

Shows how to configure manifest options for HTML entrypoints using `<meta>` tags within the HTML `<head>`. This example specifies the `page_action` type for an MV2 popup.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta name="manifest.type" content="page_action" />
  </head>
</html>
```

--------------------------------

### Add `wxt prepare` to `postinstall` Script

Source: https://wxt.dev/guide/essentials/config/auto-imports

Configures the `package.json` file to automatically run the `wxt prepare` command after dependency installation. This ensures TypeScript and editors recognize auto-imported variables by generating necessary type definitions.

```json
// package.json
{
  "scripts": {
    "postinstall": "wxt prepare", 
  },
}
```

--------------------------------

### WXT Module: Add Build-Time Config

Source: https://wxt.dev/guide/essentials/wxt-modules

Explains how to define and integrate build-time options for a WXT module. It involves extending WXT's `InlineConfig` type and using the `configKey` and `setup` function with options.

```typescript
import { defineWxtModule } from 'wxt/modules';
import 'wxt';

export interface MyModuleOptions {
  // Add your build-time options here...
}

declare module 'wxt' {
  export interface InlineConfig {
    // Add types for the "myModule" key in wxt.config.ts
    myModule: MyModuleOptions;
  }
}

export default defineWxtModule<MyModuleOptions>({
  configKey: 'myModule',

  // Build time config is available via the second argument of setup
  setup(wxt, options) {
    console.log(options);
  },
});
```

--------------------------------

### Customize Browser Binaries for Development (TypeScript)

Source: https://wxt.dev/guide/essentials/config/browser-startup

Configure WXT to use specific browser installations for development by providing paths to their executables. This allows you to test with different browser versions or custom builds. If paths are omitted, WXT attempts to auto-discover them.

```typescript
export default defineWebExtConfig({
  binaries: {
    chrome: '/path/to/chrome-beta', // Use Chrome Beta instead of regular Chrome
    firefox: 'firefoxdeveloperedition', // Use Firefox Developer Edition instead of regular Firefox
    edge: '/path/to/edge', // Open MS Edge when running "wxt -b edge"
  },
});

```

--------------------------------

### Add Vite Plugins via wxt.config.ts

Source: https://wxt.dev/guide/essentials/config/vite

This example shows how to add Vite plugins to your WXT project by installing the NPM package and including it in the `vite.config.ts` plugins array. The snippet includes `unplugin-vue-router/vite` as an example.

```typescript
import { defineConfig } from 'wxt';
import VueRouter from 'unplugin-vue-router/vite';

export default defineConfig({
  vite: () => ({
    plugins: [
      VueRouter({
        /* ... */
      }),
    ],
  }),
});
```

--------------------------------

### Side Panel HTML Configuration

Source: https://wxt.dev/guide/essentials/entrypoints

Configures the HTML for a side panel in WXT. This includes setting manifest options for icons, installation behavior, browser styling, and build inclusion/exclusion. The HTML structure defines the content of the side panel. Dependencies include standard HTML and meta tags.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Default Side Panel Title</title>

    <!-- Customize the manifest options -->
    <meta
      name="manifest.default_icon"
      content="{
        16: '/icon-16.png',
        24: '/icon-24.png',
        ...
      }" />
    <meta name="manifest.open_at_install" content="true|false" />
    <meta name="manifest.browser_style" content="true|false" />

    <!-- Set include/exclude if the page should be removed from some builds -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

--------------------------------

### Example Vitest Tests for Extension Logic

Source: https://wxt.dev/guide/essentials/unit-testing

Demonstrates unit tests for extension functionality using Vitest and WXT's `fake-browser`. This example shows how `fake-browser` provides an in-memory implementation of `browser.storage`, eliminating the need for manual mocking of storage operations.

```typescript
import { describe, it, expect } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';

const accountStorage = storage.defineItem<Account>('local:account');

async function isLoggedIn(): Promise<Account> {
  const value = await accountStorage.getValue();
  return value != null;
}

describe('isLoggedIn', () => {
  beforeEach(() => {
    // See https://webext-core.aklinker1.io/fake-browser/reseting-state
    fakeBrowser.reset();
  });

  it('should return true when the account exists in storage', async () => {
    const account: Account = {
      username: '...',
      preferences: {
        // ...
      },
    };
    await accountStorage.setValue(account);

    expect(await isLoggedIn()).toBe(true);
  });

  it('should return false when the account does not exist in storage', async () => {
    await accountStorage.deleteValue();

    expect(await isLoggedIn()).toBe(false);
  });
});
```

--------------------------------

### HTML Entrypoint Structure

Source: https://wxt.dev/guide/essentials/entrypoints

A basic HTML structure for WXT entry points. This includes meta tags for manifest configuration such as inclusion/exclusion from builds. The content within the body is application-specific.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Title</title>
    <!-- Set include/exclude if the page should be removed from some builds -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

--------------------------------

### Configure Solid Module for WXT

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This snippet illustrates the configuration for the WXT Solid module. Install '@wxt-dev/module-solid' and add it to the WXT defineConfig.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-solid'],
});
```

--------------------------------

### Add NPM Module to WXT Config

Source: https://wxt.dev/guide/essentials/wxt-modules

Demonstrates how to install an NPM package and add it to the WXT configuration file (`wxt.config.ts`) to enable its functionality.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/auto-icons'],
});
```

--------------------------------

### Create Integrated UI with Svelte

Source: https://wxt.dev/guide/essentials/content-scripts

Provides an example of integrating a Svelte application into a webpage using Wxt. The Svelte app is mounted to a target container and unmounted when the UI is removed. Assumes a Svelte App component is defined in './App.svelte'.

```typescript
// entrypoints/example-ui.content/index.ts
import App from './App.svelte';
import { mount, unmount } from 'svelte';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create the Svelte app inside the UI container
        return mount(App, { target: container });
      },
      onRemove: (app) => {
        // Destroy the app when the UI is removed
        unmount(app);
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

--------------------------------

### Configure React Module for WXT

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This snippet shows how to install and configure the WXT module for React. It assumes the '@wxt-dev/module-react' package is installed. The configuration is added to the WXT defineConfig.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
});
```

--------------------------------

### Initialize WXT Project with PNPM

Source: https://wxt.dev/guide/resources/migrate

This command initializes a new WXT project using the 'vanilla' template with PNPM. It's the first step in migrating an existing project, creating a base structure to merge into your current codebase.

```shell
cd path/to/your/project
pnpm dlx wxt@latest init example-wxt --template vanilla
```

--------------------------------

### Generate Runtime Module with Aliases and Auto-imports

Source: https://wxt.dev/guide/essentials/wxt-modules

This example demonstrates generating a runtime module for WXT. It involves creating a file within `.wxt`, setting up an alias to import it, and configuring auto-imports for exported variables. The `prepare:types` hook is used to inject the module code.

```typescript
import {
  defineWxtModule
} from 'wxt/modules';
import {
  resolve
} from 'node:path';

export default defineWxtModule({
  imports: [
    // Add auto-imports
    { from: '#analytics', name: 'analytics' },
    { from: '#analytics', name: 'reportEvent' },
    { from: '#analytics', name: 'reportPageView' },
  ],

  setup(wxt) {
    const analyticsModulePath = resolve(
      wxt.config.wxtDir,
      'analytics/index.ts',
    );
    const analyticsModuleCode = `
      import { createAnalytics } from 'some-module';

      export const analytics = createAnalytics(useAppConfig().analytics);
      export const { reportEvent, reportPageView } = analytics;
    `;

    addAlias(wxt, '#analytics', analyticsModulePath);

    wxt.hook('prepare:types', async (_, entries) => {
      entries.push({
        path: analyticsModulePath,
        text: analyticsModuleCode,
      });
    });
  },
});
```

--------------------------------

### Allowed Deeply Nested Entrypoints

Source: https://wxt.dev/guide/essentials/entrypoints

Shows the structure for deeply nested entrypoints, emphasizing that they must be at most one level deep within the `entrypoints/` directory for WXT to discover and build them.

```html
📂 entrypoints/
   📂 youtube/ 
       📂 content/ 
          📄 index.ts 
          📄 ... 
       📂 injected/ 
          📄 index.ts 
          📄 ... 
   📂 youtube.content/ 
      📄 index.ts 
      📄 ... 
   📂 youtube-injected/ 
      📄 index.ts 
      📄 ... 
```

--------------------------------

### Install WXT Latest Version (Major Upgrade)

Source: https://wxt.dev/guide/resources/upgrading

Installs the latest version of WXT, skipping scripts to prevent potential errors during a major version upgrade. The `wxt prepare` command should be run after addressing breaking changes.

```shell
pnpm i wxt@latest --ignore-scripts
```

--------------------------------

### Configure Vue Module for WXT

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This snippet demonstrates how to set up the WXT module for Vue. Ensure '@wxt-dev/module-vue' is installed. The module is then included in the WXT defineConfig.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
});
```

--------------------------------

### Defining Content Script Matches in Entrypoint

Source: https://wxt.dev/guide/essentials/entrypoints

Illustrates how to define manifest options directly within an entrypoint file using `defineContentScript`. This example shows setting the `matches` option for content scripts.

```typescript
export default defineContentScript({
  matches: ['*://*.wxt.dev/*'],
  main() {
    // ...
  },
});
```

--------------------------------

### Configure Svelte Module for WXT

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This code configures WXT to use the Svelte module. After installing '@wxt-dev/module-svelte', add it to the WXT defineConfig modules array.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-svelte'],
});
```

--------------------------------

### HTML Sandbox Page Configuration

Source: https://wxt.dev/guide/essentials/entrypoints

Configuration for a sandbox page entry point, primarily for Chromium-based browsers. It uses standard HTML structure with meta tags for build inclusion and exclusion. Firefox does not support sandboxed pages.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Title</title>

    <!-- Set include/exclude if the page should be removed from some builds -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

--------------------------------

### Configure Unimport Auto-imports in WXT

Source: https://wxt.dev/guide/essentials/config/auto-imports

Example of configuring unimport's auto-import settings within WXT's `defineConfig`. This allows customization of which modules and directories are included in the auto-import process.

```typescript
export default defineConfig({
  // See https://www.npmjs.com/package/unimport#configurations
  imports: {
    // ...
  },
});
```

--------------------------------

### HTML Options Page Configuration

Source: https://wxt.dev/guide/essentials/entrypoints

Configuration for an options page entry point. It uses meta tags to control manifest settings like opening in a tab and applying browser-specific styles. This allows customization of how the options page behaves.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Options Title</title>

    <!-- Customize the manifest options -->
    <meta name="manifest.open_in_tab" content="true|false" />
    <meta name="manifest.chrome_style" content="true|false" />
    <meta name="manifest.browser_style" content="true|false" />

    <!-- Set include/exclude if the page should be removed from some builds -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

--------------------------------

### WXT Module: Update Resolved Config

Source: https://wxt.dev/guide/essentials/wxt-modules

Shows how to modify the build's resolved configuration by hooking into the `config:resolved` event within a WXT module. This example sets the output directory.

```typescript
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    wxt.hook('config:resolved', () => {
      wxt.config.outDir = 'dist';
    });
  },
});
```

--------------------------------

### Access Built-in WXT Environment Variables - TypeScript

Source: https://wxt.dev/guide/essentials/config/environment-variables

Shows examples of accessing WXT's custom environment variables, such as MANIFEST_VERSION and BROWSER, through import.meta.env in TypeScript.

```typescript
import.meta.env.MANIFEST_VERSION
import.meta.env.BROWSER
import.meta.env.CHROME
import.meta.env.FIREFOX
import.meta.env.SAFARI
import.meta.env.EDGE
import.meta.env.OPERA
```

--------------------------------

### Install Webextension Polyfill and WXT Module (TypeScript)

Source: https://wxt.dev/guide/resources/upgrading

Installs the `webextension-polyfill` package and WXT's new polyfill module, allowing continued use of the polyfill during WXT upgrades.

```shell
pnpm i webextension-polyfill @wxt-dev/webextension-polyfill
```

--------------------------------

### Create Isolated UI with Solid and Shadow Root

Source: https://wxt.dev/guide/essentials/content-scripts

This example shows how to render a SolidJS application within a Shadow Root UI. It imports the necessary `render` function from SolidJS. The `onMount` function utilizes `render` to display the Solid component in the container, and `onRemove` calls the returned unmount function to properly dispose of the Solid application, ensuring cleanups.

```typescript
// 1. Import the style
import './style.css';
import { render } from 'solid-js/web';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Render your app to the UI container
        const unmount = render(() => <div>...</div>, container);
      },
      onRemove: (unmount) => {
        // Unmount the app when the UI is removed
        unmount?.();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

--------------------------------

### Create Isolated UI with React and Shadow Root

Source: https://wxt.dev/guide/essentials/content-scripts

This example demonstrates mounting a React application within a Shadow Root UI. It imports the React component and styles, then uses `ReactDOM.createRoot` in the `onMount` function to render the React app inside the provided container. The `onRemove` function handles unmounting the React application to prevent memory leaks.

```typescript
// 1. Import the style
import './style.css';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Container is a body, and React warns when creating a root on the body, so create a wrapper div
        const app = document.createElement('div');
        container.append(app);

        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(app);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

--------------------------------

### Persist Browser Data for Chromium Browsers (TypeScript - Mac/Linux)

Source: https://wxt.dev/guide/essentials/config/browser-startup

This configuration enables data persistence for Chromium-based browsers during WXT development sessions. By specifying a user data directory, the browser profile (including extensions, logins, etc.) will be maintained across multiple runs of the `dev` script. This is useful for installing development tools or maintaining login states.

```typescript
export default defineWebExtConfig({
  chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
});

```

--------------------------------

### Build Firefox Extension ZIP (Bun)

Source: https://wxt.dev/guide/essentials/publishing

Installs dependencies and creates a ZIP archive of your extension's source code suitable for the Firefox Addon Store using Bun as the package manager.

```shell
bun i
bun zip:firefox
```

--------------------------------

### Configure Page Action with Action Key

Source: https://wxt.dev/guide/essentials/config/manifest

Configures both 'action' and 'page_action' keys in the manifest. This setup allows for using the 'action' API while explicitly defining 'page_action' for MV2 compatibility or specific behavior.

```typescript
export default defineConfig({
  manifest: {
    action: {},
    page_action: {},
  },
});
```

--------------------------------

### Build Firefox Extension ZIP (NPM)

Source: https://wxt.dev/guide/essentials/publishing

Installs dependencies and creates a ZIP archive of your extension's source code suitable for the Firefox Addon Store using NPM as the package manager.

```shell
npm i
npm run zip:firefox
```

--------------------------------

### Standard Web Extension Manifest CSS Injection (JSON)

Source: https://wxt.dev/guide/essentials/content-scripts

Example of how CSS files are typically included in content scripts within a standard web extension's `manifest.json` file, using the `css` property within the `content_scripts` array.

```json
{
  "content_scripts": [
    {
      "css": ["content/style.css"],
      "js": ["content/index.js"],
      "matches": ["*://*/*"]
    }
  ]
}
```

--------------------------------

### Define Background Script Entrypoint (TypeScript)

Source: https://wxt.dev/guide/essentials/entrypoints

Defines the background script entrypoint for a web extension using WXT. Supports setting manifest options like persistence and type, and includes a `main` function that runs when the background is loaded. Code outside `main` cannot be async and is executed in a NodeJS environment during the build.

```typescript
export default defineBackground(() => {
  // Executed when background is loaded
});
```

```typescript
export default defineBackground({
  // Set manifest options
  persistent: undefined | true | false,
  type: undefined | 'module',

  // Set include/exclude if the background should be removed from some builds
  include: undefined | string[],
  exclude: undefined | string[],

  main() {
    // Executed when background is loaded, CANNOT BE ASYNC
  },
});
```

```typescript
browser.action.onClicked.addListener(() => { 
  // ...
}); 

export default defineBackground(() => {
  browser.action.onClicked.addListener(() => { 
    // ...
  }); 
});
```

--------------------------------

### Inject Script into Main World

Source: https://wxt.dev/guide/essentials/content-scripts

This example shows how to inject a script into the main world of a webpage using WXT's `injectScript` function. This approach is recommended over the `world: 'MAIN'` option for better compatibility and access to extension APIs. It requires a content script and an unlisted script, both registered in `web_accessible_resources`.

```typescript
// entrypoints/example-main-world.ts
export default defineUnlistedScript(() => {
  console.log('Hello from the main world');
});
```

```typescript
// entrypoints/example.content.ts
export default defineContentScript({
  matches: ['*://*/*'],
  async main() {
    console.log('Injecting script...');
    await injectScript('/example-main-world.js', {
      keepInDom: true,
    });
    console.log('Done!');
  },
});
```

```json
export default defineConfig({
  manifest: {
    // ...
    web_accessible_resources: [
      {
        resources: ["example-main-world.js"],
        matches: ["*://*/*"],
      }
    ]
  }
});
```

--------------------------------

### Unlisted Script Runtime Access and Usage

Source: https://wxt.dev/guide/essentials/entrypoints

Demonstrates how to access the URL of an unlisted script at runtime using `browser.runtime.getURL`. It also shows an example of defining an unlisted script where DOM manipulation is performed within the `main` function, ensuring it runs correctly at runtime. Ensure `web_accessible_resources` is configured if needed.

```typescript
const url = browser.runtime.getURL('/{name}.js');

console.log(url); // "chrome-extension://{id}/{name}.js"
```

```typescript
document.querySelectorAll('a').forEach((anchor) => { 
  // ...
}); 

export default defineUnlistedScript(() => {
  document.querySelectorAll('a').forEach((anchor) => { 
    // ...
  }); 
});
```

--------------------------------

### Build Firefox Extension ZIP (PNPM)

Source: https://wxt.dev/guide/essentials/publishing

Installs dependencies and creates a ZIP archive of your extension's source code suitable for the Firefox Addon Store using PNPM as the package manager.

```shell
pnpm i
pnpm zip:firefox
```

--------------------------------

### Devtools Page HTML Structure (HTML)

Source: https://wxt.dev/guide/essentials/entrypoints

Provides a basic HTML structure for a devtools entrypoint in a WXT web extension. Includes meta tags for manifest options to control build inclusion/exclusion. This HTML file will be used to create custom developer tools panels or panes.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Set include/exclude if the page should be removed from some builds -->
    <meta name="manifest.include" content="['chrome', ...]">
    <meta name="manifest.exclude" content="['chrome', ...]">
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

--------------------------------

### Unlisted HTML Page Configuration and Runtime Access

Source: https://wxt.dev/guide/essentials/entrypoints

Configures an unlisted HTML page, allowing it to be included in builds and accessed at runtime. The HTML includes meta tags for build inclusion/exclusion. At runtime, the page can be accessed via `browser.runtime.getURL` and opened in a new tab. Dependencies include the `browser.runtime` API.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Title</title>

    <!-- Set include/exclude if the page should be removed from some builds -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

```typescript
const url = browser.runtime.getURL('/{name}.html');

console.log(url); // "chrome-extension://{id}/{name}.html"
window.open(url); // Open the page in a new tab
```

--------------------------------

### HTML Popup Page Configuration

Source: https://wxt.dev/guide/essentials/entrypoints

Configuration for a popup page entry point. Meta tags are used to set the default title, icons, and action type (page_action or browser_action) in the manifest. It also supports including or excluding the page from specific builds.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Set the `action.default_title` in the manifest -->
    <title>Default Popup Title</title>

    <!-- Customize the manifest options -->
    <meta
      name="manifest.default_icon"
      content="{
        16: '/icon-16.png',
        24: '/icon-24.png',
        ...
      }" />
    <meta name="manifest.type" content="page_action|browser_action" />
    <meta name="manifest.browser_style" content="true|false" />

    <!-- Set include/exclude if the page should be removed from some builds -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

--------------------------------

### Create and Mount IFrame UI

Source: https://wxt.dev/guide/essentials/content-scripts

This snippet demonstrates how to create and mount an IFrame UI using WXT's `createIframeUi` helper. It requires an HTML page for the IFrame content and configuration for its placement and behavior. The `onMount` callback allows for further customization of the IFrame element.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Content Script IFrame</title>
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

```typescript
export default defineConfig({
  manifest: {
    web_accessible_resources: [
      {
        resources: ['example-iframe.html'],
        matches: [...],
      },
    ],
  },
});
```

```typescript
export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    // Define the UI
    const ui = createIframeUi(ctx, {
      page: '/example-iframe.html',
      position: 'inline',
      anchor: 'body',
      onMount: (wrapper, iframe) => {
        // Add styles to the iframe like width
        iframe.width = '123';
      },
    });

    // Show UI to user
    ui.mount();
  },
});
```

--------------------------------

### Define Bookmarks Page HTML Structure (HTML)

Source: https://wxt.dev/guide/essentials/entrypoints

Provides the basic HTML structure for a bookmarks entrypoint in a WXT web extension. Includes meta tags for manifest options to control build inclusion/exclusion. This HTML file will override the browser's default bookmarks page.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Title</title>
    <!-- Set include/exclude if the page should be removed from some builds -->
    <meta name="manifest.include" content="['chrome', ...]">
    <meta name="manifest.exclude" content="['chrome', ...]">
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

--------------------------------

### Create Isolated UI with Vanilla JS and Shadow Root

Source: https://wxt.dev/guide/essentials/content-scripts

This snippet demonstrates creating a basic UI with Vanilla JavaScript within an isolated Shadow Root. It imports CSS, sets `cssInjectionMode` to 'ui', defines the UI content in `onMount`, and mounts it. This approach ensures that the UI's styles do not affect the main page.

```typescript
// 1. Import the style
import './style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        // Define how your UI will be mounted inside the container
        const app = document.createElement('p');
        app.textContent = 'Hello world!';
        container.append(app);
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

--------------------------------

### Define Content Script Entrypoint (TypeScript)

Source: https://wxt.dev/guide/essentials/content-scripts

Defines the main entry point for a content script using WXT's `defineContentScript` function. The `main` function receives a context object `ctx` for managing script lifecycle events.

```typescript
// entrypoints/example.content.ts
export default defineContentScript({
  main(ctx) {},
});
```

--------------------------------

### Disable Automatic Browser Opening (TypeScript)

Source: https://wxt.dev/guide/essentials/config/browser-startup

This configuration disables the default behavior of WXT automatically opening a browser window with the extension installed during development. This is useful if you prefer to manually load the extension into your browser.

```typescript
export default defineWebExtConfig({
  disabled: true,
});

```

--------------------------------

### Build Firefox Extension ZIP (Yarn)

Source: https://wxt.dev/guide/essentials/publishing

Installs dependencies and creates a ZIP archive of your extension's source code suitable for the Firefox Addon Store using Yarn as the package manager.

```shell
yarn
yarn zip:firefox
```

--------------------------------

### Define WXT App Configuration (TypeScript)

Source: https://wxt.dev/guide/essentials/config/runtime

Defines the runtime configuration for a WXT application. It includes type declarations for the configuration and an exported default configuration object. Dependencies include the WXT framework. The output is a configuration object.

```typescript
import { defineAppConfig } from '#imports';

// Define types for your config
declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    theme?: 'light' | 'dark';
  }
}

export default defineAppConfig({
  theme: 'dark',
});
```

--------------------------------

### Organizing Related Files within an Entrypoint Directory

Source: https://wxt.dev/guide/essentials/entrypoints

Demonstrates how to include related files (like scripts and styles) alongside the main entrypoint file within its dedicated directory. This prevents WXT from treating unrelated files in the `entrypoints/` directory as separate entrypoints.

```html
📂 entrypoints/
   📂 popup/
      📄 index.html     ← This file is the entrypoint
      📄 main.ts
      📄 style.css
   📂 background/
      📄 index.ts       ← This file is the entrypoint
      📄 alarms.ts
      📄 messaging.ts
   📂 youtube.content/
      📄 index.ts       ← This file is the entrypoint
      📄 style.css
```

--------------------------------

### Define Content Script Entrypoint (TypeScript)

Source: https://wxt.dev/guide/essentials/entrypoints

Defines a content script entrypoint for a WXT web extension. It allows configuration of matching rules, execution timing, frame behavior, and injection modes. The `main` function is executed when the content script loads and can be asynchronous. Runtime code outside `main` is not allowed as it runs in a NodeJS build environment.

```typescript
export default defineContentScript({
  // Set manifest options
  matches: string[],
  excludeMatches: undefined | [],
  includeGlobs: undefined | [],
  excludeGlobs: undefined | [],
  allFrames: undefined | true | false,
  runAt: undefined | 'document_start' | 'document_end' | 'document_idle',
  matchAboutBlank: undefined | true | false,
  matchOriginAsFallback: undefined | true | false,
  world: undefined | 'ISOLATED' | 'MAIN',

  // Set include/exclude if the background should be removed from some builds
  include: undefined | string[],
  exclude: undefined | string[],

  // Configure how CSS is injected onto the page
  cssInjectionMode: undefined | "manifest" | "manual" | "ui",

  // Configure how/when content script will be registered
  registration: undefined | "manifest" | "runtime",

  main(ctx: ContentScriptContext) {
    // Executed when content script is loaded, can be async
  },
});
```

```typescript
const container = document.createElement('div'); 
document.body.append(container);

export default defineContentScript({
  main: function () {
    const container = document.createElement('div'); 
    document.body.append(container); 
  },
});
```

--------------------------------

### Access WXT App Configuration (TypeScript)

Source: https://wxt.dev/guide/essentials/config/runtime

Demonstrates how to access the application's runtime configuration using the `useAppConfig` function provided by WXT. This function returns the configuration object defined in `app.config.ts`. No external dependencies are needed beyond the WXT import.

```typescript
import { useAppConfig } from '#imports';

console.log(useAppConfig()); // { theme: "dark" }
```

--------------------------------

### Configurable Unlisted Script Definition

Source: https://wxt.dev/guide/essentials/entrypoints

Defines an unlisted script with options for `include`, `exclude`, and a `main` function. The `main` function contains the runtime code that executes when the script is loaded. Build-time considerations are important, as WXT processes this in a NodeJS environment.

```typescript
export default defineUnlistedScript({
  // Set include/exclude if the script should be removed from some builds
  include: undefined | string[],
  exclude: undefined | string[],

  main() {
    // Executed when script is loaded
  },
});
```

--------------------------------

### Example Directory Structure for Messages

Source: https://wxt.dev/guide/essentials/i18n

Illustrates the expected folder structure for storing your translation files. Each language has its own subdirectory within `public/_locales/`.

```treeview
📂 {rootDir}/
   📂 public/
      📂 _locales/
         📂 en/
            📄 messages.json
         📂 de/
            📄 messages.json
         📂 ko/
            📄 messages.json
```

--------------------------------

### Integrate Generated ESLint Config (ESLint 8)

Source: https://wxt.dev/guide/essentials/config/auto-imports

Demonstrates how to extend your ESLint 8 configuration (`.eslintrc.mjs`) with the auto-generated ESLint config file (`.wxt/eslintrc-auto-import.json`).

```javascript
// .eslintrc.mjs
export default {
  extends: ['./.wxt/eslintrc-auto-import.json'],
  // The rest of your config...
};
```

--------------------------------

### Create Integrated UI with Solid.js

Source: https://wxt.dev/guide/essentials/content-scripts

Illustrates integrating a Solid.js application into a webpage using Wxt. The Solid app is rendered to a container, and an unmount function is returned and called upon UI removal. A placeholder div is used for rendering.

```typescript
// entrypoints/example-ui.content/index.ts
import { render } from 'solid-js/web';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Render your app to the UI container
        const unmount = render(() => <div>...</div>, container);
        return unmount;
      },
      onRemove: (unmount) => {
        // Unmount the app when the UI is removed
        unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

--------------------------------

### Minimal Unlisted Script Definition

Source: https://wxt.dev/guide/essentials/entrypoints

Defines a minimal unlisted script using `defineUnlistedScript`. This script executes when loaded and can be configured with `include` and `exclude` options to manage build inclusion. Runtime code must be within the `main` function, as WXT imports this in a NodeJS environment during build.

```typescript
export default defineUnlistedScript(() => {
  // Executed when script is loaded
});
```

--------------------------------

### Extend Base tsconfig.json

Source: https://wxt.dev/guide/essentials/config/typescript

Configure your project's tsconfig.json by extending the base configuration file generated by WXT. This is the minimum required configuration.

```jsonc
// <rootDir>/tsconfig.json
{
  "extends": ".wxt/tsconfig.json"
}
```

--------------------------------

### GitHub Actions Workflow for Extension Release (YAML)

Source: https://wxt.dev/guide/essentials/publishing

A GitHub Actions workflow that automates the process of building and submitting browser extensions to various stores. It checks out code, sets up Node.js, installs dependencies, builds ZIPs, and submits them using WXT.

```yml
name: Release

on:
  workflow_dispatch:

jobs:
  submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Zip extensions
        run: |
          pnpm zip
          pnpm zip:firefox

      - name: Submit to stores
        run: |
          pnpm wxt submit \
            --chrome-zip .output/*-chrome.zip \
            --firefox-zip .output/*-firefox.zip --firefox-sources-zip .output/*-sources.zip
        env:
          CHROME_EXTENSION_ID: ${{ secrets.CHROME_EXTENSION_ID }}
          CHROME_CLIENT_ID: ${{ secrets.CHROME_CLIENT_ID }}
          CHROME_CLIENT_SECRET: ${{ secrets.CHROME_CLIENT_SECRET }}
          CHROME_REFRESH_TOKEN: ${{ secrets.CHROME_REFRESH_TOKEN }}
          FIREFOX_EXTENSION_ID: ${{ secrets.FIREFOX_EXTENSION_ID }}
          FIREFOX_JWT_ISSUER: ${{ secrets.FIREFOX_JWT_ISSUER }}
          FIREFOX_JWT_SECRET: ${{ secrets.FIREFOX_JWT_SECRET }}
```

--------------------------------

### Define Environment Variables in .env - Plaintext

Source: https://wxt.dev/guide/essentials/config/environment-variables

Defines how to create and populate .env files to make environment variables available at runtime. Variables must be prefixed with WXT_ or VITE_.

```plaintext
# .env
WXT_API_KEY=...
```

--------------------------------

### Integrate Generated ESLint Config (ESLint 9)

Source: https://wxt.dev/guide/essentials/config/auto-imports

Shows how to import and use the auto-generated ESLint configuration file (`.wxt/eslint-auto-imports.mjs`) in your ESLint 9 configuration (`eslint.config.mjs`).

```javascript
// eslint.config.mjs
import autoImports from './.wxt/eslint-auto-imports.mjs';

export default [
  autoImports,
  {
    // The rest of your config...
  },
];
```

--------------------------------

### Manually Import WXT APIs using `#imports`

Source: https://wxt.dev/guide/essentials/config/auto-imports

Illustrates how to manually import all of WXT's APIs from the `#imports` module. This is useful when auto-imports are disabled or for explicit control over imported modules.

```typescript
import {
  createShadowRootUi,
  ContentScriptContext,
  MatchPattern,
} from '#imports';
```

--------------------------------

### Prohibited Entrypoint Structure

Source: https://wxt.dev/guide/essentials/entrypoints

Highlights a common mistake: placing files related to an entrypoint directly in the `entrypoints/` directory. WXT will incorrectly interpret these as separate entrypoints, likely causing build errors.

```html
📂 entrypoints/
   📄 popup.html 
   📄 popup.ts 
   📄 popup.css 
   📂 popup/ 
      📄 index.html 
      📄 main.ts 
      📄 style.css 
```

--------------------------------

### WXT Module: Add Runtime Config

Source: https://wxt.dev/guide/essentials/wxt-modules

Details how to define runtime options for a WXT module. This involves augmenting the `WxtAppConfig` type and accessing these options at runtime using `useAppConfig`.

```typescript
import { defineWxtModule } from 'wxt/modules';
import 'wxt/utils/define-app-config';

export interface MyModuleRuntimeOptions {
  // Add your runtime options here...
}

declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    myModule: MyModuleRuntimeOptions;
  }
}

// Runtime options are returned when calling
// const config = useAppConfig();
// console.log(config.myModule);
```

--------------------------------

### Displaying Hook Execution Order

Source: https://wxt.dev/guide/essentials/config/hooks

This example shows the command to execute for debugging the hook execution order in WXT. Running `wxt prepare --debug` will output the sequence in which hooks from various sources (built-in, NPM modules, user modules, and config file) are processed. This is crucial for understanding interdependencies.

```plaintext
wxt prepare --debug
```

--------------------------------

### Create Integrated UI with Vanilla JavaScript

Source: https://wxt.dev/guide/essentials/content-scripts

Demonstrates how to create and mount an integrated UI using vanilla JavaScript. This UI is appended to the 'body' element and can contain custom HTML content. It's suitable for simple UI injections without framework dependencies.

```typescript
// entrypoints/example-ui.content.ts
export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Append children to the container
        const app = document.createElement('p');
        app.textContent = '...';
        container.append(app);
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

--------------------------------

### WXT Module: Generate Output File

Source: https://wxt.dev/guide/essentials/wxt-modules

Demonstrates how a WXT module can generate files during the build process. It uses the `build:publicAssets` hook to add the file and `build:manifestGenerated` to register it as a web accessible resource.

```typescript
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    // Relative to the output directory
    const generatedFilePath = 'some-file.txt';

    wxt.hook('build:publicAssets', (_, assets) => {
      assets.push({
        relativeDest: generatedFilePath,
        contents: 'some generated text',
      });
    });

    wxt.hook('build:manifestGenerated', (_, manifest) => {
      manifest.web_accessible_resources ??= [];
      manifest.web_accessible_resources.push({
        matches: ['*://*'],
        resources: [generatedFilePath],
      });
    });
  },
});

// This file could then be loaded at runtime:
// const res = await fetch(browser.runtime.getURL('/some-text.txt'));
```

--------------------------------

### Example messages.json Content

Source: https://wxt.dev/guide/essentials/i18n

Defines a simple key-value pair for a translation string. The 'message' property holds the translated text for a given key.

```jsonc
// public/_locales/en/messages.json
{
  "helloWorld": {
    "message": "Hello world!",
  },
}
```

--------------------------------

### Customize WXT Directory Paths

Source: https://wxt.dev/guide/essentials/project-structure

This configuration snippet demonstrates how to customize the default directory paths used by WXT. It shows how to change 'srcDir', 'modulesDir', 'outDir', 'publicDir', and 'entrypointsDir' using relative or absolute paths.

```typescript
export default defineConfig({
  // Relative to project root
  srcDir: "src",             // default: "."
  modulesDir: "wxt-modules", // default: "modules"
  outDir: "dist",            // default: ".output"
  publicDir: "static",       // default: "public"

  // Relative to srcDir
  entrypointsDir: "entries", // default: "entrypoints"
})
```

--------------------------------

### Package.json Version to Manifest Version Conversion

Source: https://wxt.dev/guide/essentials/config/manifest

Demonstrates how WXT derives the 'version' and 'version_name' fields in manifest.json from the 'version' field in package.json. 'version_name' retains the original string, while 'version' is cleaned of invalid suffixes.

```json
// package.json
{
  "version": "1.3.0-alpha2"
}
```

```json
// .output/<target>/manifest.json
{
  "version": "1.3.0",
  "version_name": "1.3.0-alpha2"
}
```

--------------------------------

### Access Vite Environment Variables - TypeScript

Source: https://wxt.dev/guide/essentials/config/environment-variables

Illustrates how to access Vite's built-in environment variables like MODE, PROD, and DEV using import.meta.env in TypeScript.

```typescript
import.meta.env.MODE
import.meta.env.PROD
import.meta.env.DEV
```

--------------------------------

### Import Using Custom Aliases

Source: https://wxt.dev/guide/essentials/config/typescript

Demonstrates how to import modules using the custom path aliases defined in wxt.config.ts. These aliases simplify import paths and improve code organization.

```typescript
import { fakeTab } from 'testing/fake-objects';
import { toLowerCase } from 'strings';
```

--------------------------------

### Disable WXT Auto-imports

Source: https://wxt.dev/guide/essentials/config/auto-imports

Demonstrates how to completely disable WXT's auto-import functionality by setting the `imports` option to `false` in the `defineConfig` configuration.

```typescript
export default defineConfig({
  imports: false, 
});
```

--------------------------------

### Set Page Action for MV2

Source: https://wxt.dev/guide/essentials/config/manifest

Specifies that a 'page_action' should be used instead of the default 'browser_action' when targeting MV2. This is done by adding a meta tag to the HTML document's head.

```html
<meta name="manifest.type" content="page_action" />
```

--------------------------------

### Create Integrated UI with React

Source: https://wxt.dev/guide/essentials/content-scripts

Demonstrates integrating a React application into a webpage using Wxt. A React root is created and rendered within the UI container, and unmounted upon removal. Requires a React App component defined in './App.tsx'.

```typescript
// entrypoints/example-ui.content/index.tsx
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root.unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

--------------------------------

### Access Environment Variables in Runtime - TypeScript

Source: https://wxt.dev/guide/essentials/config/environment-variables

Demonstrates how to access environment variables, prefixed with WXT_ or VITE_, within your TypeScript code using import.meta.env.

```typescript
await fetch(`/some-api?apiKey=${import.meta.env.WXT_API_KEY}`);
```

--------------------------------

### Access Mode in Manifest Function - TypeScript

Source: https://wxt.dev/guide/essentials/config/environment-variables

Shows how to access the current mode ('development', 'production', etc.) within the manifest function in WXT configuration.

```typescript
export default defineConfig({
  manifest: ({ mode }) => {
    const isDev = mode === 'development';
    console.log('Is development mode:', isDev);

    // ...
  },
});
```

--------------------------------

### Rename runner API to webExt Configuration

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates the renaming of the `runner` API and config options to `webExt` for improved consistency. The example shows how to update the configuration in `wxt.config.ts` to use the new `webExt` option instead of `runner`.

```typescript
export default defineConfig({
  runner: {
  webExt: {
    startUrls: ["https://wxt.dev"],
  },
});
```

--------------------------------

### Configure Action Without Popup

Source: https://wxt.dev/guide/essentials/config/manifest

Configures the 'action' key in the manifest to handle extension actions without displaying a popup. This is useful for using 'activeTab' permission or 'browser.action.onClicked' event.

```typescript
export default defineConfig({
  manifest: {
    action: {},
  },
});
```

--------------------------------

### Configure TSCompiler Options

Source: https://wxt.dev/guide/essentials/config/typescript

Specify custom TypeScript compiler options by adding them to your root tsconfig.json file. These options will override or supplement the defaults provided by WXT.

```jsonc
// <rootDir>/tsconfig.json
{
  "extends": ".wxt/tsconfig.json",
  "compilerOptions": {
    "jsx": "preserve"
  }
}
```

--------------------------------

### Create Isolated UI with Svelte and Shadow Root

Source: https://wxt.dev/guide/essentials/content-scripts

This snippet illustrates integrating a Svelte component into an isolated Shadow Root. It imports the Svelte component and necessary Svelte functions (`mount`, `unmount`). The `onMount` function uses `mount` to render the Svelte app into the container, and `onRemove` uses `unmount` for cleanup, ensuring the Svelte component is correctly managed within the Shadow Root.

```typescript
// 1. Import the style
import './style.css';
import App from './App.svelte';
import { mount, unmount } from 'svelte';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create the Svelte app inside the UI container
        return mount(App, { target: container });
      },
      onRemove: (app) => {
        // Destroy the app when the UI is removed
        unmount(app);
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

--------------------------------

### Add Vite Plugin to WXT Configuration

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This configuration shows how to integrate any framework that provides a Vite plugin into WXT. It uses the 'vite' option within WXT defineConfig to add the plugin, such as '@vitejs/plugin-react'.

```typescript
import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
});
```

--------------------------------

### Configure WXT to use a src/ directory

Source: https://wxt.dev/guide/essentials/project-structure

This configuration snippet shows how to set the 'srcDir' option in 'wxt.config.ts' to enable the use of a dedicated 'src/' directory for source code. This helps separate source files from configuration files.

```typescript
export default defineConfig({
  srcDir: 'src',
});
```

--------------------------------

### Import CSS in WXT Content Script Entrypoint (TypeScript)

Source: https://wxt.dev/guide/essentials/content-scripts

Demonstrates WXT's approach to injecting CSS into content scripts by simply importing the CSS file directly into the JavaScript entry point. WXT automatically bundles and includes this CSS.

```typescript
// entrypoints/example.content/index.ts
import './style.css';

export default defineContentScript({
  // ...
});
```

--------------------------------

### Define Content Script with Return Value (TypeScript)

Source: https://wxt.dev/guide/essentials/scripting

This snippet defines a content script using `defineContentScript`. The `main` function within this script is designed to be executed by `browser.scripting.executeScript` and returns a string value. The registration type is set to 'runtime'.

```typescript
// entrypoints/example.content.ts
export default defineContentScript({
  registration: 'runtime',
  main(ctx) {
    console.log('Script was executed!');
    return 'Hello John!';
  },
});

```

--------------------------------

### Get Translation String in Code

Source: https://wxt.dev/guide/essentials/i18n

Demonstrates how to retrieve a translated string using its key. This API call will return the appropriate message based on the user's browser locale.

```typescript
browser.i18n.getMessage('helloWorld');
```

--------------------------------

### Configure Manifest with Environment Variables - TypeScript

Source: https://wxt.dev/guide/essentials/config/environment-variables

Demonstrates how to use environment variables within the WXT configuration's manifest object, particularly when the manifest is defined as a function to ensure .env files are loaded.

```typescript
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: () => ({
    oauth2: {
      client_id: import.meta.env.WXT_APP_CLIENT_ID
    }
  }),
});
```

--------------------------------

### Integrating NPM Module as User Module

Source: https://wxt.dev/guide/essentials/config/hooks

This example shows how to include an NPM module (`@wxt-dev/i18n/module`) as a user module and control its execution order. By prefixing its filename (e.g., `2.i18n.ts`), it can be made to run after other user modules and before hooks defined in `wxt.config.ts`, if needed.

```typescript
// modules/2.i18n.ts
export { default } from '@wxt-dev/i18n/module';
```

--------------------------------

### Create Isolated UI with Vue and Shadow Root

Source: https://wxt.dev/guide/essentials/content-scripts

This snippet shows how to integrate a Vue application into an isolated Shadow Root UI. It includes importing the Vue app component and styles, configuring `createShadowRootUi` with `onMount` to mount the Vue app, and `onRemove` to unmount it. This ensures proper lifecycle management for the Vue instance within the isolated environment.

```typescript
// 1. Import the style
import './style.css';
import { createApp } from 'vue';
import App from './App.vue';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Define how your UI will be mounted inside the container
        const app = createApp(App);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app?.unmount();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});
```

--------------------------------

### Add Custom Aliases in wxt.config.ts

Source: https://wxt.dev/guide/essentials/config/typescript

Define custom path aliases for your project in the wxt.config.ts file. WXT will automatically add these to the generated tsconfig.json and configure your bundler to resolve them.

```typescript
import { resolve } from 'node:path';

export default defineConfig({
  alias: {
    // Directory:
    testing: resolve('utils/testing'),
    // File:
    strings: resolve('utils/strings.ts'),
  },
});
```

--------------------------------

### Enable ESLint Auto-imports (ESLint 9)

Source: https://wxt.dev/guide/essentials/config/auto-imports

Configures WXT to generate ESLint configuration for auto-imported variables, specifically for ESLint version 9. This helps ESLint recognize and validate auto-imported modules.

```typescript
export default defineConfig({
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
});
```

--------------------------------

### Persist Browser Data for Chromium Browsers (TypeScript - Windows)

Source: https://wxt.dev/guide/essentials/config/browser-startup

This configuration enables data persistence for Chromium-based browsers on Windows during WXT development sessions. It uses `resolve` to ensure an absolute path for the user data directory, maintaining the browser profile across multiple `dev` script executions. This is particularly useful for development tools and saved session data.

```typescript
import { resolve } from 'node:path';

export default defineWebExtConfig({
  // On Windows, the path must be absolute
  chromiumProfile: resolve('.wxt/chrome-data'),
  keepProfileChanges: true,
});

```

--------------------------------

### Configure Permissions in WXT

Source: https://wxt.dev/guide/essentials/config/manifest

Add required permissions to the manifest using the 'permissions' array in wxt.config.ts. WXT automatically adds 'tabs' and 'scripting' during development for hot reloading and 'sidepanel' if a sidepanel entrypoint exists.

```typescript
export default defineConfig({
  manifest: {
    permissions: ['storage', 'tabs'],
  },
});
```

--------------------------------

### Check Content Script Context Validity (TypeScript)

Source: https://wxt.dev/guide/essentials/content-scripts

Shows how to manually check the validity or invalidity of a content script's execution context using the `ctx.isValid` and `ctx.isInvalid` properties.

```typescript
if (ctx.isValid) {
  // do something
}
// OR
if (ctx.isInvalid) {
  // do something
}
```

--------------------------------

### Accessing Assets in /public Directory

Source: https://wxt.dev/guide/essentials/assets

Shows how to access files from the `<rootDir>/public/` directory. These files are copied directly to the output folder without bundler processing. Access is typically done using a leading slash `/` in JavaScript, HTML, CSS, Vue, and JSX, referencing the root of the output directory.

```typescript
import imageUrl from '/image.png';

const img = document.createElement('img');
img.src = imageUrl;
```

```html
<img src="/image.png" />
```

```css
.bg-image {
  background-image: url(/image.png);
}
```

```vue
<template>
  <img src="/image.png" />
</template>
```

```jsx
<img src="/image.png" />
```

--------------------------------

### WXT Icon Discovery Regex Patterns

Source: https://wxt.dev/guide/essentials/config/manifest

Regular expressions used by WXT to automatically discover extension icons in the public directory. Icons matching these patterns (e.g., 'icon-16.png', 'icon@48w.png') are automatically included in the manifest.

```typescript
const iconRegex = [
  /^icon-([0-9]+)\.png$/,                 // icon-16.png
  /^icon-([0-9]+)x[0-9]+\.png$/,          // icon-16x16.png
  /^icon@([0-9]+)w\.png$/,                // icon@16w.png
  /^icon@([0-9]+)h\.png$/,                // icon@16h.png
  /^icon@([0-9]+)\.png$/,                 // icon@16.png
  /^icons?[/\\]([0-9]+)\.png$/,          // icon/16.png | icons/16.png
  /^icons?[/\\]([0-9]+)x[0-9]+\.png$/,   // icon/16x16.png | icons/16x16.png
];
```

--------------------------------

### Accessing Assets in /assets Directory

Source: https://wxt.dev/guide/essentials/assets

Demonstrates how to import and use assets (like images) from the `<srcDir>/assets/` directory. These assets are processed by WXT's bundler. The import path `~/assets/` is used in JavaScript, Vue, and CSS, while HTML uses relative paths. Imported assets resolve to a module ID for bundler processing.

```typescript
import imageUrl from '~/assets/image.png';

const img = document.createElement('img');
img.src = imageUrl;
```

```html
<img src="../assets/image.png" />
```

```css
.bg-image {
  background-image: url(~/assets/image.png);
}
```

```vue
<script>
import image from '~/assets/image.png';
</script>

<template>
  <img :src="image" />
</template>
```

```jsx
import image from '~/assets/image.png';

<img src={image} />;
```

--------------------------------

### Content Script Context Helpers (TypeScript)

Source: https://wxt.dev/guide/essentials/content-scripts

Demonstrates how to use the `ctx` object provided to a content script's `main` function to manage asynchronous operations and prevent them from running after the extension's context is invalidated.

```typescript
ctx.addEventListener(...);
ctx.setTimeout(...);
ctx.setInterval(...);
ctx.requestAnimationFrame(...);
// and more
```

--------------------------------

### Configure Vue Teleport Target for ShadowRoot

Source: https://wxt.dev/guide/resources/faq

This example shows how to set up a teleport target within the ShadowRoot for Vue applications. It uses Vue's provide/inject mechanism to pass the ShadowRoot's body element as the target for teleported components.

```ts
import { createApp } from 'vue';
import App from './App.vue';

const ui = await create`ShadowRoot`Ui(ctx, {
  // ...
  onMount: (container, shadow) => {
    const teleportTarget = shadow.querySelector('body')!;
    const app = createApp(App)
      .provide('TeleportTarget', teleportTarget)
      .mount(container);
    return app;
  },
});
ui.mount();
```

```vue
<script lang="ts" setup>
import { Teleport } from 'vue';

const teleportTarget = inject('TeleportTarget');
</script>

<template>
  <div>
    <Teleport :to="teleportTarget">
      <dialog>My dialog</dialog>
    </Teleport>
  </div>
</template>
```

--------------------------------

### Execute Script and Log Return Value (TypeScript)

Source: https://wxt.dev/guide/essentials/scripting

This snippet demonstrates how to execute a script using `browser.scripting.executeScript` and log the returned value to the console. It targets a specific tab and uses a JavaScript file as the content script. The expected output is the value returned by the script's main function.

```typescript
// entrypoints/background.ts
const res = await browser.scripting.executeScript({
  target: { tabId },
  files: ['content-scripts/example.js'],
});
console.log(res); // "Hello John!"

```

--------------------------------

### Add TypeScript Reference Path

Source: https://wxt.dev/guide/essentials/config/typescript

In monorepos, if you choose not to extend the WXT tsconfig.json, you must manually add a reference path to the generated wxt.d.ts file to ensure TypeScript can resolve WXT types.

```typescript
/// <reference path="./.wxt/wxt.d.ts" />
```

--------------------------------

### Dynamically Mount UI to DOM Element with WXT

Source: https://wxt.dev/guide/essentials/content-scripts

Mounts a UI to a DOM element that might not exist on initial load. Uses `autoMount` to observe the specified `anchor` element and automatically mounts/unmounts the UI when the element appears/disappears. The `onMount` callback appends content to the container.

```typescript
export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      // It observes the anchor
      anchor: '#your-target-dynamic-element',
      onMount: (container) => {
        // Append children to the container
        const app = document.createElement('p');
        app.textContent = '...';
        container.append(app);
      },
    });

    // Call autoMount to observe anchor element for add/remove.
    ui.autoMount();
  },
});
```

--------------------------------

### Enable ESLint Auto-imports (ESLint 8)

Source: https://wxt.dev/guide/essentials/config/auto-imports

Configures WXT to generate ESLint configuration for auto-imported variables, specifically for ESLint version 8. This allows ESLint to correctly lint code that uses auto-imported modules.

```typescript
export default defineConfig({
  imports: {
    eslintrc: {
      enabled: 8,
    },
  },
});
```

--------------------------------

### Add Custom Entrypoints using entrypoints:found Hook

Source: https://wxt.dev/guide/essentials/wxt-modules

This snippet shows how to use the `entrypoints:found` hook to add custom entrypoints to your WXT project. The hook is triggered before validation, ensuring custom entrypoints are checked for duplicates. It takes an array of entrypoint information objects as input.

```typescript
import {
  defineWxtModule
} from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    wxt.hook('entrypoints:found', (_, entrypointInfos) => {
      // Add your new entrypoint
      entrypointInfos.push({
        name: 'my-custom-script',
        inputPath: 'path/to/custom-script.js',
        type: 'content-script',
      });
    });
  },
});
```

--------------------------------

### Configure Host Permissions in WXT

Source: https://wxt.dev/guide/essentials/config/manifest

Specify host permissions using the 'host_permissions' array in wxt.config.ts, allowing the extension to interact with specific origins. When targeting both MV2 and MV3, ensure permissions are defined conditionally for each version.

```typescript
export default defineConfig({
  manifest: {
    host_permissions: ['https://www.google.com/*'],
  },
});
```

```typescript
export default defineConfig({
  manifest: ({ manifestVersion }) => ({
    host_permissions: manifestVersion === 2 ? [...] : [...],
  }),
});
```

--------------------------------

### Manually Specify Icons in WXT Manifest Configuration

Source: https://wxt.dev/guide/essentials/config/manifest

Configure custom icon paths in wxt.config.ts if the default naming conventions are not followed or for specific icon filenames. This overrides WXT's automatic icon discovery.

```typescript
export default defineConfig({
  manifest: {
    icons: {
      16: '/extension-icon-16.png',
      24: '/extension-icon-24.png',
      48: '/extension-icon-48.png',
      96: '/extension-icon-96.png',
      128: '/extension-icon-128.png',
    },
  },
});
```

--------------------------------

### Content Script Context Invalidation Error (Plain Text)

Source: https://wxt.dev/guide/essentials/content-scripts

Illustrates the error message 'Extension context invalidated.' that may appear when a content script continues to run after an extension update, uninstall, or disable.

```plaintext
Error: Extension context invalidated.
```

--------------------------------

### Enable ESM in HTML Pages with Vite

Source: https://wxt.dev/guide/essentials/es-modules

Configure HTML pages to bundle JavaScript as ESM using Vite. Ensure the `type="module"` attribute is added to script tags. This applies to Vite versions ≥0.0.1.

```html
<script src="./main.ts"></script> 
<script src="./main.ts" type="module"></script> 
```

--------------------------------

### Environment Variables in WXT App Config (TypeScript)

Source: https://wxt.dev/guide/essentials/config/runtime

Integrates environment variables into the WXT application configuration. It defines types for environment variables and uses `import.meta.env` to access and potentially convert them (e.g., string to boolean). This allows for managing secrets and configuration dynamically. Dependencies include WXT and Vite's environment variable handling.

```typescript
declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    apiKey?: string;
    skipWelcome: boolean;
  }
}

export default defineAppConfig({
  apiKey: import.meta.env.WXT_API_KEY,
  skipWelcome: import.meta.env.WXT_SKIP_WELCOME === 'true',
});
```

--------------------------------

### Configure Background Script as ESM Module

Source: https://wxt.dev/guide/essentials/es-modules

Set the background script to be bundled as an ESM module by defining `type: 'module'` in the background entrypoint configuration. This requires WXT version ≥0.16.0 and only supports MV3. It enables code-splitting and sets `"type": "module"` in the manifest.

```typescript
export default defineBackground({
  type: 'module', 
  main() {
    // ...
  },
});
```

--------------------------------

### Create Integrated UI with Vue.js

Source: https://wxt.dev/guide/essentials/content-scripts

Shows how to integrate a Vue.js application into a webpage using Wxt's integrated UI functionality. The Vue app is mounted to a provided container and unmounted when the UI is removed. Assumes a Vue App component is defined in './App.vue'.

```typescript
// entrypoints/example-ui.content/index.ts
import { createApp } from 'vue';
import App from './App.vue';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create the app and mount it to the UI container
        const app = createApp(App);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app.unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
```

--------------------------------

### Enable Main World Content Script (Chromium Only)

Source: https://wxt.dev/guide/essentials/content-scripts

This snippet shows how to configure a content script to run in the 'MAIN' world. This feature is only supported by Chromium browsers and has limitations, such as not supporting MV2 and lacking access to the extension API directly. WXT generally recommends using `injectScript` instead.

```typescript
export default defineContentScript({
  world: 'MAIN',
});
```

--------------------------------

### Get Registered Content Scripts in Chrome Extension Development

Source: https://wxt.dev/guide/resources/faq

Retrieves a list of content scripts that have been registered with the Chrome extension during development. This is useful for debugging and understanding dynamic content script loading. It requires access to the service worker's console.

```javascript
await chrome.scripting.getRegisteredContentScripts();
```

--------------------------------

### Conditionally Add Vite Plugin Based on Mode

Source: https://wxt.dev/guide/essentials/config/vite

This snippet illustrates how to conditionally include a Vite plugin, such as `vite-plugin-remove-console`, based on the build mode. It shows how to ensure plugins run only in specific environments like production by checking `configEnv.mode`.

```typescript
import { defineConfig } from 'wxt';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
  vite: (configEnv) => ({
    plugins:
      configEnv.mode === 'production'
        ? [removeConsole({ includes: ['log'] })]
        : [],
  }),
});
```

--------------------------------

### Handle SPA Navigation Changes in WXT Content Scripts

Source: https://wxt.dev/guide/essentials/content-scripts

Adapts content scripts for SPAs by listening to custom 'wxt:locationchange' events. This ensures the script logic runs when the URL changes, even without a full page reload. It uses a `MatchPattern` to specifically target YouTube watch pages.

```typescript
const watchPattern = new MatchPattern('*://*.youtube.com/watch*');

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main(ctx) {
    ctx.addEventListener(window, 'wxt:locationchange', ({ newUrl }) => {
      if (watchPattern.includes(newUrl)) mainWatch(ctx);
    });
  },
});

function mainWatch(ctx: ContentScriptContext) {
  mountUi(ctx);
}

function mountUi(ctx: ContentScriptContext): void {
  // ...
}
```

--------------------------------

### Using import.meta.glob for Entrypoint Definitions

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates using Vite's `import.meta.glob` feature within an entrypoint file to dynamically define options. This allows for importing modules and using their properties, like `paths`, to configure the `matches` for a content script.

```typescript
const providers: Record<string, any> = import.meta.glob('../providers/*', {
  eager: true,
});

export default defineContentScript({
  matches: Object.values(providers).flatMap(
    (provider) => provider.default.paths,
  ),
  async main() {
    console.log('Hello content.');
  },
});
```

--------------------------------

### Configure Vite Settings in wxt.config.ts

Source: https://wxt.dev/guide/essentials/config/vite

This code snippet demonstrates how to override Vite's default configuration within the `wxt.config.ts` file. It uses the `defineConfig` function from WXT and allows direct configuration similar to a standard `vite.config.ts` file.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  vite: () => ({
    // Override config here, same as `defineConfig({ ... })`
    // inside vite.config.ts files
  }),
});
```

--------------------------------

### Configure Manifest Global Options in WXT

Source: https://wxt.dev/guide/essentials/config/manifest

Define global manifest properties using the 'manifest' configuration in wxt.config.ts. This allows for direct manipulation of manifest fields. The configuration can be a static object or a function to dynamically generate manifest properties based on build context.

```typescript
export default defineConfig({
  manifest: {
    // Put manual changes here
  },
});
```

```typescript
export default defineConfig({
  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {
      // ...
    };
  },
});
```

--------------------------------

### Disabling WXT's Shadow Root Style Reset

Source: https://wxt.dev/guide/resources/upgrading

Provides an example of how to disable the default CSS style reset behavior within WXT's `createShadowRootUi` function by setting `inheritStyles` to `true`. This is useful if the automatic reset causes unexpected issues.

```typescript
const ui = await createShadowRootUi({
  inheritStyles: true,
  // ...
});
```

--------------------------------

### MV2 and MV3 Manifest Compatibility in WXT

Source: https://wxt.dev/guide/essentials/config/manifest

Configure manifest properties with MV3 format by default; WXT automatically converts them to MV2 format when targeting MV2. This ensures compatibility across manifest versions. Properties specific to one version are stripped when targeting the other.

```typescript
export default defineConfig({
  manifest: {
    action: {
      default_title: 'Some Title',
    },
    web_accessible_resources: [
      {
        matches: ['*://*.google.com/*'],
        resources: ['icon/*.png'],
      },
    ],
  },
});
```

--------------------------------

### Revert to jiti Entrypoint Loader

Source: https://wxt.dev/guide/resources/upgrading

Provides instructions on how to revert to the `jiti` entrypoint loader if needed. It also includes a warning that this option is deprecated and will be removed in a future major version.

```typescript
export default defineConfig({
  entrypointLoader: 'jiti',
});
```

--------------------------------

### Configure web_accessible_resources in WXT config

Source: https://wxt.dev/guide/essentials/assets

This TypeScript configuration snippet adds the WASM file to the `web_accessible_resources` in the extension's manifest. This allows content scripts to fetch and load the WASM file from the extension's package over the network. It specifies the `matches` pattern and the `resources` path for the WASM file.

```typescript
export default defineConfig({
  manifest: {
    web_accessible_resources: [
      {
        // We'll use this matches in the content script as well
        matches: ['*://*.github.com/*'],
        // Use the same path as `relativeDest` from the WXT module
        resources: ['/oxc_parser_wasm_bg.wasm'],
      },
    ],
  },
});
```

--------------------------------

### Add Standalone CSS Content Script via Manifest Hook (TypeScript)

Source: https://wxt.dev/guide/essentials/content-scripts

Shows how to create a standalone content script that only includes a CSS file by using the `build:manifestGenerated` hook in `wxt.config.ts`. This hook allows programmatic modification of the generated manifest.

```typescript
export default defineConfig({
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      manifest.content_scripts ??= [];
      manifest.content_scripts.push({
        // Build extension once to see where your CSS get's written to
        css: ['content-scripts/example.css'],
        matches: ['*://*/*'],
      });
    },
  },
});
```

--------------------------------

### Generate Declaration File for Type Augmentation

Source: https://wxt.dev/guide/essentials/wxt-modules

This code snippet illustrates how to generate a declaration file (`.d.ts`) for WXT modules. It uses the `prepare:types` hook to add a declaration file, which can be used for global type declarations and type augmentation within your TypeScript project. The `tsReference: true` option is crucial for including the file in the TS project.

```typescript
import {
  defineWxtModule
} from 'wxt/modules';
import {
  resolve
} from 'node:path';

export default defineWxtModule({
  setup(wxt) {
    const typesPath = resolve(wxt.config.wxtDir, 'my-module/types.d.ts');
    const typesCode = `
      // Declare global types, perform type augmentation
    `;

    wxt.hook('prepare:types', async (_, entries) => {
      entries.push({
        path: 'my-module/types.d.ts',
        text: `
          // Declare global types, perform type augmentation, etc
        `,
        // IMPORTANT - without this line your declaration file will not be a part of the TS project:
        tsReference: true,
      });
    });
  },
});
```

--------------------------------

### Load and initialize WASM module in content script

Source: https://wxt.dev/guide/essentials/assets

This TypeScript code demonstrates how to load and initialize a WASM module within a content script. It imports the necessary initialization function (`initWasm`) and the parsing function (`parseSync`) from the WASM package. The `initWasm` function is called with the URL of the WASM file obtained using `browser.runtime.getURL`, and then `parseSync` is used to process code.

```typescript
import initWasm,
{ parseSync } from '@oxc-parser/wasm';

export default defineContentScript({
  matches: '*://*.github.com/*',
  async main(ctx) {
    if (!location.pathname.endsWith('.ts')) return;

    // Get text from GitHub
    const code = document.getElementById(
      'read-only-cursor-text-area',
    )?.textContent;
    if (!code) return;
    const sourceFilename = document.getElementById('file-name-id')?.textContent;
    if (!sourceFilename) return;

    // Load the WASM file:
    await initWasm ({
      module_or_path: browser.runtime.getURL('/oxc_parser_wasm_bg.wasm'),
    });

    // Once loaded, we can use `parseSync`!
    const ast = parseSync(code, { sourceFilename });
    console.log(ast);
  },
});
```

--------------------------------

### Copy WASM file to output directory with WXT module

Source: https://wxt.dev/guide/essentials/assets

This TypeScript code defines a WXT module to copy a WASM file from the `node_modules` directory to the extension's output folder. It uses the `build:publicAssets` hook to specify the source and destination paths. This ensures the WASM file is available for the extension to load.

```typescript
import {
  resolve
} from 'node:path';

export default defineWxtModule((wxt) => {
  wxt.hook('build:publicAssets', (_, assets) => {
    assets.push({
      absoluteSrc: resolve(
        'node_modules/@oxc-parser/wasm/web/oxc_parser_wasm_bg.wasm',
      ),
      relativeDest: 'oxc_parser_wasm_bg.wasm',
    });
  });
});
```

--------------------------------

### Using Public Assets in Content Scripts with getURL

Source: https://wxt.dev/guide/essentials/assets

Illustrates how to correctly reference public assets within content scripts. By default, imported assets in content scripts only provide the path. To ensure they load from the extension's origin instead of the tab's origin, `browser.runtime.getURL()` must be used to convert the path into a full, accessible URL.

```typescript
import iconUrl from '/icon/128.png';

export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log(iconUrl); // "/icon/128.png"
    console.log(browser.runtime.getURL(iconUrl)); // "chrome-extension://<id>/icon/128.png"
  },
});
```

--------------------------------

### Configure Vitest with WXT Plugin

Source: https://wxt.dev/guide/essentials/unit-testing

This configuration file sets up Vitest for WXT projects by integrating the `WxtVitest` plugin. The plugin automatically handles WXT-specific configurations, polyfills extension APIs, and sets up necessary aliases and global variables for testing.

```typescript
import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing/vitest-plugin';

export default defineConfig({
  plugins: [WxtVitest()],
});
```

--------------------------------

### Import Path Migration to #imports

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates the transition from direct imports of WXT utilities (like 'wxt/storage', 'wxt/client', 'wxt/sandbox') to using the unified '#imports' virtual module for better tree-shaking and compatibility across entrypoints.

```typescript
import { storage } from 'wxt/storage';
import { defineContentScript } from 'wxt/sandbox';
import { ContentScriptContext, useAppConfig } from 'wxt/client';

import { storage } from '#imports';
import { defineContentScript } from '#imports';
import { ContentScriptContext, useAppConfig } from '#imports';
```

```typescript
import {
  storage,
  defineContentScript,
  ContentScriptContext,
  useAppConfig,
} from '#imports';
```

--------------------------------

### Importing Constants in Entrypoints

Source: https://wxt.dev/guide/resources/upgrading

Shows how to import and use constants, such as `GOOGLE_MATCHES`, within entrypoint files (e.g., `content.ts`). This demonstrates leveraging external utility files for defining entrypoint configurations like `matches`.

```typescript
import { GOOGLE_MATCHES } from '~/utils/constants'

export default defineContentScript({
  matches: [GOOGLE_MATCHES],
  main: () => ...
})
```

--------------------------------

### Setting Build Modes with WXT Commands

Source: https://wxt.dev/guide/essentials/config/build-mode

Demonstrates how to set the build mode using the `--mode` flag with various WXT commands. This is useful for configuring different build targets or environments.

```shell
wxt --mode production
wxt build --mode development
wxt zip --mode testing
```

--------------------------------

### WXT Entrypoint API Usage (Content Script)

Source: https://wxt.dev/guide/essentials/extension-apis

Illustrates the proper usage of browser extension APIs within a WXT content script's main function. This ensures that APIs like `browser.runtime.onMessage` are accessed within the extension's runtime environment and not during the initial NodeJS-based import process.

```typescript
browser.runtime.onMessage.addListener(() => {
  /* ... */
}); 

export default defineContentScript({
  main() {
    browser.runtime.onMessage.addListener(() => {
      /* ... */
    }); 
  },
});
```

--------------------------------

### WXT Configuration for Legacy Output Directory Behavior

Source: https://wxt.dev/guide/resources/upgrading

Shows how to configure WXT to use the older behavior of outputting all build modes to a single directory by setting the `outDirTemplate` option.

```typescript
export default defineConfig({
  outDirTemplate: '{{browser}}-mv{{manifestVersion}}',
});
```

--------------------------------

### Submit Extension to Stores (Shell)

Source: https://wxt.dev/guide/essentials/publishing

Submits new versions of your extension to the Chrome, Firefox, and Edge stores using the specified ZIP files. This command requires proper configuration via `wxt submit init`.

```sh
wxt submit \
  --chrome-zip .output/{your-extension}-{version}-chrome.zip \
  --firefox-zip .output/{your-extension}-{version}-firefox.zip --firefox-sources-zip .output/{your-extension}-{version}-sources.zip \
  --edge-zip .output/{your-extension}-{version}-chrome.zip
```

--------------------------------

### Build Extension ZIPs (Shell)

Source: https://wxt.dev/guide/essentials/publishing

Commands to build ZIP archives of your extension for different browsers. These are typically run before submitting the extension to a store.

```sh
wxt zip
wxt zip -b firefox
```

--------------------------------

### Run WXT Prepare Command

Source: https://wxt.dev/guide/resources/upgrading

Executes the WXT preparation command after upgrading. This command should succeed and resolve type errors after breaking changes have been addressed.

```shell
pnpm wxt prepare
```

--------------------------------

### Configure WXT to Listen on All Interfaces

Source: https://wxt.dev/guide/resources/faq

This command configures the WXT CLI to listen on all network interfaces (0.0.0.0) instead of just localhost. This is necessary when running WXT inside a container to allow external access for hot-reloading. No specific dependencies are required beyond the WXT CLI itself.

```bash
wxt --host 0.0.0.0
```

--------------------------------

### Dry Run Submission for Stores (Shell)

Source: https://wxt.dev/guide/essentials/publishing

Simulates the submission process to Chrome, Firefox, and Edge stores without actually submitting. Useful for testing configuration and secrets.

```sh
wxt submit --dry-run \
  --chrome-zip .output/{your-extension}-{version}-chrome.zip \
  --firefox-zip .output/{your-extension}-{version}-firefox.zip --firefox-sources-zip .output/{your-extension}-{version}-sources.zip \
  --edge-zip .output/{your-extension}-{version}-chrome.zip
```

--------------------------------

### WXT Entrypoint API Usage (Background Script)

Source: https://wxt.dev/guide/essentials/extension-apis

Demonstrates the correct way to use browser extension APIs within a WXT background script's main function. APIs like `browser.action.onClicked` are only available inside the entrypoint's main execution context to avoid errors in the NodeJS environment.

```typescript
browser.action.onClicked.addListener(() => {
  /* ... */
}); 

export default defineBackground(() => {
  browser.action.onClicked.addListener(() => {
    /* ... */
  }); 
});
```

--------------------------------

### Build Safari Extension and Convert

Source: https://wxt.dev/guide/essentials/publishing

Builds the Safari extension using WXT and then uses the `safari-web-extension-converter` CLI tool to prepare it for submission to the Safari App Store. The converter targets the specific output directory for the MV2 build.

```shell
pnpm wxt build -b safari
xcrun safari-web-extension-converter .output/safari-mv2
```

--------------------------------

### WXT Configuration for Custom srcDir

Source: https://wxt.dev/guide/resources/upgrading

Illustrates how to configure WXT when using a custom 'srcDir', specifying the locations for 'publicDir' and 'modulesDir' within the project structure.

```typescript
export default defineConfig({
  srcDir: 'src',
  publicDir: 'src/public',
  modulesDir: 'src/modules',
});
```

--------------------------------

### WXT Entrypoint API Usage (Unlisted Script)

Source: https://wxt.dev/guide/essentials/extension-apis

Shows the correct pattern for using browser extension APIs within a WXT unlisted script's main function. Similar to background and content scripts, `browser` APIs should be called within the `defineUnlistedScript` callback to ensure they are executed in the correct browser context.

```typescript
browser.runtime.onMessage.addListener(() => {
  /* ... */
}); 

export default defineUnlistedScript(() => {
  browser.runtime.onMessage.addListener(() => {
    /* ... */
  }); 
});
```

--------------------------------

### Feature Detection for Browser APIs

Source: https://wxt.dev/guide/essentials/extension-apis

Illustrates how to perform feature detection to check if a specific browser API is available at runtime. This is important because API availability can vary based on the manifest version, browser, and permissions. Optional chaining provides a concise way to handle potentially undefined APIs.

```typescript
if (browser.runtime.onSuspend != null) {
  browser.runtime.onSuspend.addListener(() => {
    // ...
  });
}

// Using optional chaining:
browser.runtime.onSuspend?.addListener(() => {
  // ...
});
```

--------------------------------

### Create Edge Addons ZIP

Source: https://wxt.dev/guide/essentials/publishing

Generates a ZIP archive specifically for publishing to the Edge Addons store. This command is used when the extension has Edge-specific features.

```shell
wxt zip -b edge
```

--------------------------------

### Build WXT Extension for Specific Browser (CLI)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Use the `-b` flag with the WXT CLI to create a build targeting a specific browser. 'chrome' is the default. Other browsers will open Chrome by default unless configured.

```shell
wxt            # same as: wxt -b chrome
wxt -b firefox
wxt -b custom
```

--------------------------------

### Configure WXT to Use Polyfill Module (TypeScript)

Source: https://wxt.dev/guide/resources/upgrading

Configures WXT to use the new polyfill module by adding it to the `modules` array in the `wxt.config.ts` file.

```typescript
export default defineConfig({
  modules: ['@wxt-dev/webextension-polyfill'],
});
```

--------------------------------

### Configure Ant Design Styles for ShadowRoot

Source: https://wxt.dev/guide/resources/faq

This snippet demonstrates how to configure Ant Design's StyleProvider to inject CSS within the ShadowRoot, ensuring styles are correctly applied to UI components. It requires React and the @ant-design/cssinjs library.

```tsx
import { StyleProvider } from '@ant-design/cssinjs';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const ui = await create`ShadowRoot`Ui(ctx, {
  // ...
  onMount: (container, shadow) => {
    const cssContainer = shadow.querySelector('head')!;
    const root = ReactDOM.createRoot(container);
    root.render(
      <StyleProvider container={cssContainer}>
        <App />
      </StyleProvider>,
    );
    return root;
  },
});
```

--------------------------------

### Configure vite-node External Dependencies

Source: https://wxt.dev/guide/resources/upgrading

Details how to configure `vite-node`'s `ssr.noExternal` option to include packages that depend on `webextension-polyfill`. This is necessary when using `vite-node` as the entrypoint loader to ensure these dependencies are correctly handled during the build.

```typescript
export default defineConfig({
  vite: () => ({
    ssr: {
      noExternal: ['@webext-core/messaging', '@webext-core/proxy-service'],
    },
  }),
});
```

--------------------------------

### Handling API Aliases for Compatibility

Source: https://wxt.dev/guide/essentials/extension-apis

Shows how to use the nullish coalescing operator (`??`) to check for alternative API names, such as `browser.action` or `browser.browser_action`. This pattern is useful for maintaining compatibility between different manifest versions (MV2 and MV3) or browser implementations.

```typescript
(browser.action ?? browser.browser_action).onClicked.addListener(() => {
  //
});
```

--------------------------------

### Unified Browser API Access with WXT

Source: https://wxt.dev/guide/essentials/extension-apis

This snippet demonstrates how to use WXT's unified `browser` API to access extension functionalities. It abstracts away browser-specific differences (like `chrome` vs. `browser`). Auto-imports are enabled, so explicit import might not be necessary.

```typescript
import { browser } from 'wxt/browser';

browser.action.onClicked.addListener(() => {
  // ...
});
```

--------------------------------

### Configure React Portal Target for ShadowRoot

Source: https://wxt.dev/guide/resources/faq

This snippet illustrates how to provide a portal target within the ShadowRoot for React applications. It uses React's Context API to make the ShadowRoot's body element available to components that need to render portals.

```ts
// hooks/PortalTargetContext.ts
import { createContext } from 'react';

export const PortalTargetContext = createContext<HTMLElement>();
```

```tsx
// entrypoints/example.content.ts
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import PortalTargetContext from '~/hooks/PortalTargetContext';

const ui = await create`ShadowRoot`Ui(ctx, {
  // ...
  onMount: (container, shadow) => {
    const portalTarget = shadow.querySelector('body')!;
    const root = ReactDOM.createRoot(container);
    root.render(
      <PortalTargetContext.Provider value={portalTarget}>
        <App />
      </PortalTargetContext.Provider>,
    );
    return root;
  },
});
ui.mount();
```

```tsx
import { useContext } from 'react';
import { createPortal } from 'react-dom';
import PortalTargetContext from '~/hooks/PortalTargetContext';

const MyComponent = () => {
  const portalTarget = useContext(PortalTargetContext);

  return <div>{createPortal(<dialog>My dialog</dialog>, portalTarget)}</div>;
};

```

--------------------------------

### WXT's Browser API Implementation (mjs)

Source: https://wxt.dev/guide/essentials/extension-apis

This code shows the internal implementation of WXT's `browser` variable. It checks for the existence of `globalThis.browser` and falls back to `globalThis.chrome`, ensuring compatibility across different browser environments and manifest versions.

```javascript
export const browser = globalThis.browser?.runtime?.id
  ? globalThis.browser
  : globalThis.chrome;
```

--------------------------------

### Configure WXT for Private Package Inclusion (Firefox)

Source: https://wxt.dev/guide/essentials/publishing

Configure WXT to download and include private npm packages directly into the Firefox source ZIP. This prevents the need to share authentication tokens during the review process. The configuration is done in `wxt.config.ts`.

```typescript
export default defineConfig({
  zip: {
    downloadPackages: [
      '@mycompany/some-package',
      //...
    ],
  },
});
```

--------------------------------

### Exclude HTML Entrypoint from Specific Browser (HTML Meta)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Prevent an HTML file from being included in builds targeting specific browsers by using the `manifest.exclude` meta tag within the HTML file's head.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

--------------------------------

### Update Browser.runtime.onMessage Listener (TypeScript)

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates how to update a `browser.runtime.onMessage` listener in TypeScript to no longer rely on promises for returning a response, adapting to changes in WXT's polyfill handling.

```typescript
browser.runtime.onMessage.addListener(async () => {
  const res = await someAsyncWork();
  return res;
});

browser.runtime.onMessage.addListener(async (_message, _sender, sendResponse) => {
  someAsyncWork().then((res) => {
    sendResponse(res);
  });
  return true;
});
```

--------------------------------

### Translate Extension Name and Description

Source: https://wxt.dev/guide/essentials/i18n

Shows how to use translation keys for the extension's name and description in the manifest file. This allows these fields to be localized.

```json
{
  "extName": {
    "message": "..."
  },
  "extDescription": {
    "message": "..."
  },
  "helloWorld": {
    "message": "Hello world!"
  }
}
```

--------------------------------

### Accessing Extension API Types with WXT

Source: https://wxt.dev/guide/essentials/extension-apis

Demonstrates how to import and use types for extension APIs provided by WXT's `Browser` namespace. This enhances type safety when working with browser-specific runtime message senders.

```typescript
import { type Browser } from 'wxt/browser';

function handleMessage(message: any, sender: Browser.runtime.MessageSender) {
  // ...
}
```

--------------------------------

### Manifest Configuration for Localized Name/Description

Source: https://wxt.dev/guide/essentials/i18n

Configures the extension's manifest to use localized strings for its name and description. The `__MSG_` prefix indicates that these values should be fetched from the `messages.json` files.

```typescript
export default defineConfig({
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
  },
});
```

--------------------------------

### Update WXT Output Directory Structure for JS Entrypoints

Source: https://wxt.dev/guide/resources/upgrading

Reflects a change in the output directory structure for JavaScript entrypoints in WXT. The `popup.js` file has been moved into the `chunks` directory. This change is primarily relevant for post-build scripting that references these files.

```plaintext
.output/
  <target>/
    chunks/
      some-shared-chunk-<hash>.js
      popup-<hash>.js // [!code --]
    popup.html
    popup.html
    popup.js // [!code ++]
```

--------------------------------

### Customizing User Module Execution Order

Source: https://wxt.dev/guide/essentials/config/hooks

This demonstrates how to control the loading order of user modules within the WXT build. By prefixing module filenames with numbers (e.g., `0.my-module.ts`, `1.another-module.ts`), you can ensure they are processed in the desired sequence, with lower numbers being executed first.

```typescript
// modules/0.my-module.ts
// ... your module code
```

```typescript
// modules/1.another-module.ts
// ... your module code
```

--------------------------------

### Mocking WXT's `#imports` Module in Vitest

Source: https://wxt.dev/guide/essentials/unit-testing

Explains how to correctly mock modules imported via WXT's `#imports` alias in Vitest. It clarifies that you should mock the 'real' import path, not the alias itself, by referencing your project's `.wxt/types/imports-module.d.ts` file for accurate paths.

```typescript
// What you write
import { injectScript, createShadowRootUi } from '#imports';

// Vitest sees this:
// import { injectScript } from 'wxt/utils/inject-script';
// import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';

vi.mock("wxt/utils/inject-script", () => ({
  injectScript: ...
}))
```

--------------------------------

### Target Specific Manifest Version (CLI)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Use the `--mv2` or `--mv3` CLI flags to specify the manifest version for your WXT extension builds. The default is MV2 for Safari/Firefox and MV3 for others.

```shell
wxt --mv2
wxt --mv3
```

--------------------------------

### Update WXT API Exports for defineBackground and defineContentScript

Source: https://wxt.dev/guide/resources/upgrading

Changes the export location for `defineBackground` and `defineContentScript` from `wxt/client` to `wxt/sandbox`. This affects projects that have auto-imports disabled and manually manage imports.

```typescript
import { defineBackground, defineContentScript } from 'wxt/client'; 
import { defineBackground, defineContentScript } from 'wxt/sandbox';
```

--------------------------------

### Filter Entrypoints by Browser Target (TypeScript)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Control which entrypoints are included or excluded for specific browser targets using the `include` and `exclude` options within the WXT configuration.

```typescript
export default defineContentScript({
  include: ['firefox'],

  main(ctx) {
    // ...
  },
});
```

--------------------------------

### Listen for Extension Update Event in TypeScript

Source: https://wxt.dev/guide/essentials/testing-updates

Sets up a listener for the `onInstalled` event to detect when the extension has been updated. This allows you to execute specific logic after an update. It checks the `reason` property to ensure the logic only runs on 'update'.

```typescript
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'update') {
    // Do something
  }
});
```

--------------------------------

### Configure Custom Modules Directory

Source: https://wxt.dev/guide/resources/upgrading

Explains how to specify a custom directory for WXT modules using the `modulesDir` option in `wxt.config.ts`. This is useful if the default `modules/` directory conflicts with existing project structures.

```typescript
export default defineConfig({
  modulesDir: 'wxt-modules', // defaults to "modules"
});
```

--------------------------------

### Update WXT (Minor/Patch Version)

Source: https://wxt.dev/guide/resources/upgrading

Updates WXT to the latest version for minor or patch releases, which do not typically require special handling beyond a standard package manager update.

```shell
pnpm i wxt@latest
```

--------------------------------

### Detect Manifest Version at Runtime (TypeScript)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Use the `import.meta.env.MANIFEST_VERSION` environment variable in your TypeScript code to determine if the build targets Manifest Version 2 or 3.

```typescript
if (import.meta.env.MANIFEST_VERSION === 2) {
  console.log('Do something only in MV2 builds');
}
```

--------------------------------

### Access Extension Types with Browser Namespace (TypeScript)

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates how to access extension API types using the new `Browser` namespace from `wxt/browser`, which is based on `@types/chrome` instead of `@types/webextension-polyfill`.

```typescript
import type { Runtime } from 'wxt/browser';
import type { Browser } from 'wxt/browser';

function getMessageSenderUrl(sender: Runtime.MessageSender): string {
function getMessageSenderUrl(sender: Browser.runtime.MessageSender): string {
  // ...
}
```

--------------------------------

### Import Google Analytics Script (TypeScript)

Source: https://wxt.dev/guide/essentials/remote-code

This snippet demonstrates how to import the Google Analytics script using the `url:` prefix in WXT. It sets up the necessary global variables and functions for Google Analytics to work correctly. This approach bundles the remote script locally, satisfying MV3 requirements.

```typescript
// utils/google-analytics.ts
import 'url:https://www.googletagmanager.com/gtag/js?id=G-XXXXXX';

window.dataLayer = window.dataLayer || [];
// NOTE: This line is different from Google's documentation
window.gtag = function () {
  dataLayer.push(arguments);
};
gtag('js', new Date());
gtag('config', 'G-XXXXXX');

```

--------------------------------

### Configure WXT for Firefox Zipping

Source: https://wxt.dev/guide/essentials/publishing

Customize the file exclusion and inclusion behavior for the ZIP archive generated for the Firefox Addon Store. This configuration is done within the `wxt.config.ts` file.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  zip: {
    // ...
  },
});
```

--------------------------------

### Accessing Build Mode at Runtime in TypeScript

Source: https://wxt.dev/guide/essentials/config/build-mode

Shows how to access the current build mode within your WXT extension using `import.meta.env.MODE`. This allows for conditional logic based on the active build environment.

```typescript
switch (import.meta.env.MODE) {
  case 'development': // ...
  case 'production': // ...

  // Custom modes specified with --mode
  case 'testing': // ...
  case 'staging': // ...
  // ...
}
```

--------------------------------

### Detect Target Browser at Runtime (TypeScript)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Check the `import.meta.env.BROWSER` or `import.meta.env.FIREFOX` environment variables in your TypeScript code to conditionally execute logic based on the target browser.

```typescript
if (import.meta.env.BROWSER === 'firefox') {
  console.log('Do something only in Firefox builds');
}
if (import.meta.env.FIREFOX) {
  // Shorthand, equivalent to the if-statement above
}
```

--------------------------------

### Update defineItem Default Value Handling in WXT Storage

Source: https://wxt.dev/guide/resources/upgrading

Ensures `defineItem` with versioning now requires a `defaultValue`. If no default value is provided, it must be explicitly set to `null`, and the type parameter updated accordingly. This change affects how nullable storage items are handled.

```typescript
const item = storage.defineItem<number>("local:count", { 
const item = storage.defineItem<number | null>("local:count", { 
defaultValue: null, 
  version: ...,
  migrations: ...,
})
```

```typescript
const item: WxtStorageItem<number | null> =
  storage.defineItem<number>('local:count');
const value: number | null = await item.getValue();
```

--------------------------------

### Remove ExtensionApi Config (TypeScript)

Source: https://wxt.dev/guide/resources/upgrading

Removes the `extensionApi` configuration from `wxt.config.ts` as it has been deprecated and removed in newer versions of WXT.

```typescript
export default defineConfig({
  extensionApi: 'chrome',
});
```

--------------------------------

### Enable Google Analytics in HTML (TypeScript)

Source: https://wxt.dev/guide/essentials/remote-code

This snippet shows how to import the previously configured Google Analytics utility in your HTML files using TypeScript. It allows you to send events to Google Analytics. By importing the local module, the remote code dependency is managed by WXT.

```typescript
// popup/main.ts
import '~/utils/google-analytics';

gtag('event', 'event_name', {
  key: 'value',
});

```

--------------------------------

### Rename WXT zip.ignoredSources to zip.excludeSources

Source: https://wxt.dev/guide/resources/upgrading

Updates the WXT configuration for the zip plugin, renaming the `ignoredSources` option to `excludeSources`. This change improves clarity and consistency in the configuration API.

```typescript
export default defineConfig({
  zip: {
    ignoredSources: [
      /*...*/
    ], 
    excludeSources: [
      /*...*/
    ],
  },
});
```

--------------------------------

### Add WebWorker Types to TSConfig for WXT

Source: https://wxt.dev/guide/resources/upgrading

Provides instructions on how to re-add `"WebWorker"` types to the project's `tsconfig.json` for WXT projects, particularly for MV3 projects using service workers that require these types.

```json
{
  "extends": "./.wxt/tsconfig.json",
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "WebWorker"]
  }
}
```

--------------------------------

### Configure Default Locale in Manifest

Source: https://wxt.dev/guide/essentials/i18n

Sets the default language for your extension. This is a required step for internationalization. It's typically configured within your Vite/WXT build configuration.

```typescript
export default defineConfig({
  manifest: {
    default_locale: 'en',
  },
});
```

--------------------------------

### Transform Manifest using build:manifestGenerated Hook

Source: https://wxt.dev/guide/resources/upgrading

Replaces the deprecated `transformManifest` option with the `build:manifestGenerated` hook for transforming the manifest file during the build process. This hook provides access to the manifest object for modifications.

```typescript
export default defineConfig({
  transformManifest(manifest) { 
  hooks: {
    'build:manifestGenerated': (_, manifest) => {
       // ...
    },
  },
});
```

--------------------------------

### Update runner API types to webExt

Source: https://wxt.dev/guide/resources/upgrading

Illustrates the renaming of type definitions from `ExtensionRunnerConfig` to `WebExtConfig`. This change is part of the API consistency update, renaming 'runner' related types to 'webExt'.

```typescript
import type { ExtensionRunnerConfig } from 'wxt';
import type { WebExtConfig } from 'wxt';
```

--------------------------------

### Fix WXT Storage watch Callback Types

Source: https://wxt.dev/guide/resources/upgrading

Corrects the type definitions for the `newValue` and `oldValue` parameters in the `watch` callback for WXT storage items. This change impacts TypeScript users by ensuring more accurate type inference.

```typescript
const item = storage.defineItem<number>('local:count', { defaultValue: 0 });
item.watch((newValue: number | null, oldValue: number | null) => { 
item.watch((newValue: number, oldValue: number) => { 
  // ...
```

--------------------------------

### Add Manifest Modification Hook in WXT Config

Source: https://wxt.dev/guide/essentials/config/hooks

This hook intercepts the `build:manifestGenerated` event to append '(DEV)' to the manifest title when in development mode. It demonstrates accessing the `wxt` object and modifying the manifest directly. Ensure your WXT configuration file (`wxt.config.ts`) is correctly set up.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      if (wxt.config.mode === 'development') {
        manifest.title += ' (DEV)';
      }
    },
  },
});
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.
