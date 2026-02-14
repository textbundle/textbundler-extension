### WXT Package.json Scripts for Development and Building

Source: https://wxt.dev/guide/installation

Adds essential scripts to your `package.json` file for managing WXT extensions. These include commands for starting the development server, building the extension for different browsers, and creating distributable zip packages. The `postinstall` script prepares the environment after installation.

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

### WXT Background Entrypoint Example (TypeScript)

Source: https://wxt.dev/guide/installation

Defines a basic background script entrypoint for a WXT extension using TypeScript. This script logs 'Hello world!' to the console when the background script is initialized.

```typescript
export default defineBackground(() => {
  console.log('Hello world!');
});
```

--------------------------------

### Create and Start WXT Dev Server

Source: https://wxt.dev/api/reference/wxt/functions/createserver

This example demonstrates how to use the `createServer` function to initialize a WXT development server with a given configuration and then start it. It requires the `wxt` library to be installed and configured.

```typescript
const server = await wxt.createServer({
  // Enter config...
});
await server.start();
```

--------------------------------

### Run WXT Development Server (PNPM, Bun, NPM, Yarn)

Source: https://wxt.dev/guide/installation

Starts the WXT development server using different package managers. Once running, WXT automatically opens a browser window with the extension installed, allowing for immediate testing and development.

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

### Create WXT Project From Scratch (PNPM, Bun, NPM, Yarn)

Source: https://wxt.dev/guide/installation

Manually create a new WXT project from scratch. This involves creating a project directory, initializing it with a package manager, installing WXT as a dev dependency, and adding an entrypoint file.

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

Initialize a new WXT project using the `init` command. This command is compatible with PNPM, Bun, NPM, and Yarn. Follow the on-screen prompts to select a framework and configuration.

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

### Install WXT Dev Dependency (PNPM, Bun, NPM, Yarn)

Source: https://wxt.dev/guide/installation

Install WXT as a development dependency in an existing or new project. This is a crucial step when setting up a project from scratch.

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

### Background Entrypoint Examples

Source: https://wxt.dev/guide/essentials/entrypoints

Shows two ways to define a 'background' entrypoint: as a single file (e.g., background.ts) or as a directory with an index file (e.g., background/index.ts).

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

### Basic WXT Module Structure

Source: https://wxt.dev/guide/essentials/wxt-modules

Illustrates the fundamental structure of a WXT module. It uses `defineWxtModule` to create a module with a `setup` function that receives the WXT build context.

```typescript
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    // Your module code here...
  },
});
```

--------------------------------

### WXT Manifest MV3 Example Output

Source: https://wxt.dev/guide/essentials/config/manifest

Example of how WXT generates the manifest.json for Manifest V3 based on the provided configuration, showcasing the 'action' and 'web_accessible_resources' properties.

```json
{
  "manifest_version": 3,
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

### WxtBuilderServer: Listen for Connections (TypeScript)

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtbuilderserver

Illustrates how to start the WXT development server using the listen() method of the WxtBuilderServer interface. This method returns a Promise that resolves when the server has successfully started.

```typescript
await server.listen();
```

--------------------------------

### Install @wxt-dev/i18n with WXT

Source: https://wxt.dev/i18n

Installs the @wxt-dev/i18n package using pnpm. This is the first step when integrating the package within a WXT project.

```sh
pnpm i @wxt-dev/i18n
```

--------------------------------

### WXT Manifest MV2 Example Output

Source: https://wxt.dev/guide/essentials/config/manifest

Example of how WXT generates the manifest.json for Manifest V2 based on the provided configuration, showcasing the 'browser_action' and 'web_accessible_resources' properties.

```json
{
  "manifest_version": 2,
  "browser_action": {
    "default_title": "Some Title"
  },
  "web_accessible_resources": ["icon/*.png"]
}
```

--------------------------------

### Example Custom Output Directory Template in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Provides an example of how to use the `outDirTemplate` option to define a custom output directory structure. This specific example structures the output based on browser and manifest version.

```typescript
"{{browser}}-mv{{manifestVersion}}"
```

--------------------------------

### Set Up Storage Change Watcher (TypeScript)

Source: https://wxt.dev/storage

Provides an example of how to use the `storage.watch` function to listen for changes to a specific storage key and receive updates.

```ts
const unwatch = storage.watch<number>('local:counter', (newCount, oldCount) => {
  console.log('Count changed:', { newCount, oldCount });
});

// To remove the listener:
unwatch();
```

--------------------------------

### WxtPackageManager: Install Dependencies

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtpackagemanager

Installs all project dependencies based on the package manager configuration.

```APIDOC
## POST /api/wxt/packages/installDependencies

### Description
Installs project dependencies.

### Method
POST

### Endpoint
/api/wxt/packages/installDependencies

### Parameters
#### Request Body
- **options** (object) - Optional - Options to pass to the API call.
  - **silent** (boolean) - Optional - Whether to run in silent mode.
  - **cwd** (string) - Optional - The current working directory.
  - **packageManager** (string) - Optional - Specify the package manager (e.g., 'npm', 'pnpm', 'yarn', 'bun').
  - **dry** (boolean) - Optional - Perform a dry run without installing.

### Request Example
```json
{
  "options": {
    "packageManager": "pnpm",
    "silent": true
  }
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the installation was successful.
- **message** (string) - A message describing the result of the installation.

#### Response Example
```json
{
  "success": true,
  "message": "Dependencies installed successfully."
}
```
```

--------------------------------

### Configure WXT with Solid Module

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This configuration integrates the Solid.js framework with WXT using its dedicated module. Install `@wxt-dev/module-solid` before applying this configuration. It simplifies the setup for using Solid within your extension.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-solid'],
});
```

--------------------------------

### Install @wxt-dev/storage NPM Package

Source: https://wxt.dev/storage

Instructions for installing the WXT Storage module using various package managers like npm, pnpm, yarn, and bun. This is for usage outside of the WXT framework.

```sh
npm i @wxt-dev/storage
pnpm add @wxt-dev/storage
yarn add @wxt-dev/storage
bun add @wxt-dev/storage
```

--------------------------------

### Prepare WXT After Installation

Source: https://wxt.dev/guide/resources/upgrading

Runs the WXT preparation command after installation. This step is crucial for resolving issues and type errors that may arise after a major version upgrade.

```shell
pnpm wxt prepare
```

--------------------------------

### Install webextension-polyfill and WXT Polyfill Module

Source: https://wxt.dev/guide/resources/upgrading

Installs the necessary packages (`webextension-polyfill` and `@wxt-dev/webextension-polyfill`) to continue using the polyfill after upgrading WXT. This is an alternative to stopping the use of the polyfill.

```shell
pnpm i webextension-polyfill @wxt-dev/webextension-polyfill
```

--------------------------------

### Add WXT Prepare to package.json postinstall script

Source: https://wxt.dev/guide/essentials/config/auto-imports

This JSON snippet shows how to add the `wxt prepare` command to the `postinstall` script in your `package.json`. This ensures that your editor has up-to-date type information for auto-imported variables after every dependency installation.

```json
{
  "scripts": {
    "postinstall": "wxt prepare", 
  },
}
```

--------------------------------

### Package Firefox Extension Sources (NPM)

Source: https://wxt.dev/guide/essentials/publishing

Commands to install dependencies and create a zip archive of the extension sources for Firefox using NPM. This ensures the extension is ready for review and distribution.

```shell
npm i
npm run zip:firefox
```

--------------------------------

### Package Firefox Extension Sources (Bun)

Source: https://wxt.dev/guide/essentials/publishing

Commands to install dependencies and create a zip archive of the extension sources for Firefox using Bun. This facilitates the build and packaging process for the Firefox Addon Store.

```shell
bun i
bun zip:firefox
```

--------------------------------

### WebExtConfig: chromiumPref Example

Source: https://wxt.dev/api/reference/wxt/interfaces/webextconfig

Example of setting Chromium preferences, specifically to change the default downloads directory. This demonstrates how to use the chromiumPref property to customize browser behavior.

```typescript
{
  download: {
    default_directory: "/my/custom/dir",
  },
}
```

--------------------------------

### GitHub Action for Automated Extension Releases

Source: https://wxt.dev/guide/essentials/publishing

This GitHub Actions workflow automates the process of building and submitting browser extensions. It checks out the code, sets up Node.js and pnpm, installs dependencies, builds ZIP files for different stores, and submits them using the WXT CLI, leveraging environment variables for authentication.

```yaml
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

### WXT Module: Add Build-Time Config

Source: https://wxt.dev/guide/essentials/wxt-modules

Demonstrates how to define and use build-time configuration options for a WXT module. It includes type augmentation for `InlineConfig` and access to options within the `setup` function.

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

### Configure WXT with Vue Module

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This configuration enables WXT's built-in module for Vue.js development. Ensure `@wxt-dev/module-vue` is installed. This setup streamlines the process of using Vue within your web extension.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
});
```

--------------------------------

### wxt.build() Example Usage (TypeScript)

Source: https://wxt.dev/api/reference/wxt/functions/build

Demonstrates how to use the `build()` function from the wxt library. It shows two ways to invoke the function: using the default configuration from `wxt.config.ts`, and overriding the configuration with inline options.

```typescript
// Use config from `wxt.config.ts`
const res = await build()

// or override config `from wxt.config.ts`
const res = await build({
  // Override config...
})
```

--------------------------------

### Package Firefox Extension Sources (PNPM)

Source: https://wxt.dev/guide/essentials/publishing

Commands to install dependencies and create a zip archive of the extension sources for Firefox using PNPM. This is a crucial step for publishing to the Firefox Addon Store.

```shell
pnpm i
pnpm zip:firefox
```

--------------------------------

### Side Panel HTML Structure

Source: https://wxt.dev/guide/essentials/entrypoints

HTML structure for a side panel, including meta tags for manifest options like icons, installation behavior, and browser styling. It also supports including or excluding the panel from specific builds.

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

### Install WXT Analytics Module

Source: https://wxt.dev/analytics

Installs the WXT Analytics NPM package and configures it within the WXT module in `wxt.config.ts`.

```bash
pnpm i @wxt-dev/analytics
```

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/analytics/module'],
});
```

--------------------------------

### Add Vite Plugins to WXT Project

Source: https://wxt.dev/guide/essentials/config/vite

This example shows how to add Vite plugins to your WXT project. After installing the necessary NPM package, you can include the plugin within the `plugins` array in the Vite configuration defined in `wxt.config.ts`.

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

### WxtPackageManager: Download Dependency

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtpackagemanager

Downloads a package's TGZ file and moves it into a specified directory. Requires authorization setup in `.npmrc`.

```APIDOC
## POST /api/wxt/packages/downloadDependency

### Description
Downloads a package's TGZ file and moves it into the `downloadDir`.

### Method
POST

### Endpoint
/api/wxt/packages/downloadDependency

### Parameters
#### Request Body
- **id** (string) - Required - Name of the package to download (e.g., `wxt@0.17.1`).
- **downloadDir** (string) - Required - Where to store the package.

### Request Example
```json
{
  "id": "wxt@0.17.1",
  "downloadDir": "./temp/packages"
}
```

### Response
#### Success Response (200)
- **filePath** (string) - The path to the downloaded TGZ file.

#### Response Example
```json
{
  "filePath": "./temp/packages/wxt-0.17.1.tgz"
}
```
```

--------------------------------

### Install WXT Latest with Ignored Scripts

Source: https://wxt.dev/guide/resources/upgrading

Installs the latest version of WXT while ignoring scripts to prevent potential errors during major version upgrades. This is the first step in the upgrade process, followed by running 'wxt prepare'.

```shell
pnpm i wxt@latest --ignore-scripts
```

--------------------------------

### Install @wxt-dev/auto-icons Package

Source: https://wxt.dev/auto-icons

Installs the WXT Auto Icons development dependency using various package managers. This package is essential for enabling the automatic icon generation feature in WXT projects.

```sh
npm i --save-dev @wxt-dev/auto-icons
```

```sh
pnpm i -D @wxt-dev/auto-icons
```

```sh
yarn add --dev @wxt-dev/auto-icons
```

```sh
bun i -D @wxt-dev/auto-icons
```

--------------------------------

### WxtPackageManager: Ensure Dependency Installed

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtpackagemanager

Ensures a specific dependency is installed in the project.

```APIDOC
## POST /api/wxt/packages/ensureDependencyInstalled

### Description
Ensures a dependency is installed.

### Method
POST

### Endpoint
/api/wxt/packages/ensureDependencyInstalled

### Parameters
#### Request Body
- **name** (string) - Required - Name of the dependency.
- **options** (object) - Optional - Options to pass to the API call.
  - **dev** (boolean) - Optional - Whether to check for dev dependency.
  - **cwd** (string) - Optional - The current working directory.
  - **workspace** (string) - Optional - The workspace to operate in.

### Request Example
```json
{
  "name": "vite",
  "options": {
    "dev": true
  }
}
```

### Response
#### Success Response (200)
- **installed** (boolean) - Indicates if the dependency was installed or already present.

#### Response Example
```json
{
  "installed": true
}
```
```

--------------------------------

### Example Vitest Tests with Fake Browser API

Source: https://wxt.dev/guide/essentials/unit-testing

This example demonstrates unit tests for a function that uses `storage.defineItem`. It leverages `fakeBrowser.reset()` to clear the in-memory storage between tests, simulating extension behavior without needing actual storage mocking.

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

### Package Firefox Extension Sources (Yarn)

Source: https://wxt.dev/guide/essentials/publishing

Commands to install dependencies and create a zip archive of the extension sources for Firefox using Yarn. This process is essential for meeting Firefox's publishing requirements.

```shell
yarn
yarn zip:firefox
```

--------------------------------

### Configure React Portal Target in ShadowRootUi

Source: https://wxt.dev/guide/resources/faq

This example illustrates setting up a React application within a ShadowRootUi, creating a context to provide the ShadowRoot's body as the target for React's `createPortal`. This ensures portal content is rendered correctly within the ShadowRoot's isolation.

```tsx
// hooks/PortalTargetContext.ts
import { createContext } from 'react';

export const PortalTargetContext = createContext<HTMLElement>();

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

--------------------------------

### Rename runner Option to webExt

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates the renaming of the `runner` configuration option to `webExt`. The example shows how to configure `webExt.startUrls` which was previously configured under `runner.startUrls`. This change aims for better consistency with `web-ext.config.ts`.

```typescript
export default defineConfig({
  // runner: {
  webExt: {
    startUrls: ["https://wxt.dev"],
  },
});
```

--------------------------------

### Install UnoCSS Package for WXT

Source: https://wxt.dev/unocss

Installs the necessary UnoCSS packages for your WXT extension using various package managers (npm, pnpm, yarn, bun). Ensure these packages are installed as dev dependencies.

```sh
npm i --save-dev @wxt-dev/unocss unocss
pnpm i -D @wxt-dev/unocss unocss
yarn add --dev @wxt-dev/unocss unocss
bun i -D @wxt-dev/unocss unocss
```

--------------------------------

### Add Import Preset with WXT Module (TypeScript)

Source: https://wxt.dev/api/reference/wxt/modules/functions/addimportpreset

Demonstrates how to use the addImportPreset function within a WXT module setup. It shows examples of adding built-in, custom, and auto-scanned presets. This function is part of the WXT module system for managing auto-imports.

```typescript
export default defineWxtModule((wxt) => {
  // Built-in preset:
  addImportPreset(wxt, "vue");
  // Custom preset:
  addImportPreset(wxt, {
    from: "vue",
    imports: ["ref", "reactive", ...],
  });
  // Auto-scanned preset:
  addImportPreset(wxt, { package: "vue" });
});
```

--------------------------------

### WXT Module: Add Runtime Config

Source: https://wxt.dev/guide/essentials/wxt-modules

Provides an example of how to define and access runtime configuration options within a WXT module. It involves type augmentation for `WxtAppConfig` and retrieving options using `useAppConfig`.

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

### Customize WXT Directory Paths

Source: https://wxt.dev/guide/essentials/project-structure

This configuration example demonstrates how to customize the paths for various directories within a WXT project using `wxt.config.ts`. It shows how to change `srcDir`, `modulesDir`, `outDir`, `publicDir`, and `entrypointsDir`.

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

### Create Integrated UI with Vanilla JavaScript

Source: https://wxt.dev/guide/essentials/content-scripts

This example shows how to create and mount an integrated UI using vanilla JavaScript. It appends a paragraph element to the specified container. The UI is injected inline and anchored to the body.

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

### Create Integrated UI with SolidJS

Source: https://wxt.dev/guide/essentials/content-scripts

This example demonstrates creating an integrated UI using SolidJS. It renders a SolidJS component into the UI container and provides an unmount function to clean up when the UI is removed. The UI is positioned inline and anchored to the body.

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

### Create Svelte Shadow Root UI in Content Script

Source: https://wxt.dev/guide/essentials/content-scripts

Provides a content script example for mounting a Svelte application within a ShadowRoot UI. It involves importing CSS, the Svelte component, setting `cssInjectionMode`, and using Svelte's `mount` and `unmount` functions.

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

### Importing with Custom Path Aliases

Source: https://wxt.dev/guide/essentials/config/typescript

Example of how to import modules using the custom path aliases defined in `wxt.config.ts`.

```typescript
import { fakeTab } from 'testing/fake-objects';
import { toLowerCase } from 'strings';
```

--------------------------------

### Create Integrated UI with Svelte

Source: https://wxt.dev/guide/essentials/content-scripts

This example illustrates creating an integrated UI with Svelte. It mounts a Svelte component into the specified container and destroys it when the UI is removed. The UI is configured for inline positioning and anchored to the body.

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

### Create Integrated UI with Vue

Source: https://wxt.dev/guide/essentials/content-scripts

This example demonstrates creating an integrated UI with Vue. It mounts a Vue application to the provided container and unmounts it when the UI is removed. The UI is positioned inline and anchored to the body.

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

### Import Storage in TypeScript (NPM)

Source: https://wxt.dev/storage

Shows how to import the 'storage' object after installing the '@wxt-dev/storage' NPM package for use outside of WXT.

```ts
import { storage } from '@wxt-dev/storage';
```

--------------------------------

### Configure Browser Binaries for Development

Source: https://wxt.dev/guide/essentials/config/browser-startup

This configuration snippet allows developers to specify custom paths or names for browser binaries used during WXT development. It enables the use of specific browser versions like Chrome Beta or Firefox Developer Edition, or custom installations of browsers like MS Edge. This is useful when the default browser discovery fails or specific versions are required.

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

### Configure WXT with React Module

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This configuration sets up WXT to use the React framework module. It requires the `@wxt-dev/module-react` package to be installed. This simplifies React integration by providing preconfigured settings and potentially auto-imports.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
});
```

--------------------------------

### Create Integrated UI with React

Source: https://wxt.dev/guide/essentials/content-scripts

This example shows how to create an integrated UI with React. It uses `ReactDOM.createRoot` to render a React component into the UI container and unmounts it upon removal. The UI is set to be inline and anchored to the body.

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

### React Portal Component Usage with ShadowRoot Target

Source: https://wxt.dev/guide/resources/faq

This React component example demonstrates using `createPortal` from `react-dom` in conjunction with a `PortalTargetContext`. The context provides the ShadowRoot's body as the target, ensuring portal content is rendered correctly within the ShadowRoot.

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

### Configure WXT with Svelte Module

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This code snippet demonstrates how to configure WXT to utilize the Svelte framework module. The `@wxt-dev/module-svelte` package needs to be installed. This configuration simplifies Svelte integration for web extensions.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-svelte'],
});
```

--------------------------------

### webExt

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Configure browser startup options, which can be overridden by a `web-ext.config.ts` file.

```APIDOC
## webExt

### Description
Configure browser startup. Options set here can be overridden in a `web-ext.config.ts` file.

### Type
`WebExtConfig`
```

--------------------------------

### Accessing Assets from /public Directory

Source: https://wxt.dev/guide/essentials/assets

Shows how to access files placed in the `/public` directory, which are copied to the output folder without bundling. Examples are provided for TypeScript, HTML, CSS, Vue, and JSX. Note that these are not accessible in content scripts by default.

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

### runner

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Configure browser startup. This option is deprecated and `webExt` should be used instead.

```APIDOC
## runner

### Description
Configure browser startup. Options set here can be overridden in a `web-ext.config.ts` file.

### Deprecated
Use `webExt` instead. Same option, just renamed.

### Type
`WebExtConfig`

### Source
packages/wxt/src/types.ts:141
```

--------------------------------

### Add WXT Runtime Plugin (TypeScript)

Source: https://wxt.dev/api/reference/wxt/modules/functions/addwxtplugin

Demonstrates how to add a runtime plugin to a WXT project using the addWxtPlugin function. This function is called within a WXT module's setup function.

```typescript
export default defineWxtModule((wxt) => {
  addWxtPlugin(wxt, "wxt-module-analytics/client-plugin");
});
```

--------------------------------

### Automate Extension Submission with WXT CLI

Source: https://wxt.dev/guide/essentials/publishing

This snippet shows how to use the WXT CLI to automate the submission of new extension versions to various stores. It includes commands for initializing submission settings, building ZIP archives, and submitting them for review, with an option for a dry run to test the process.

```shell
wxt zip
wxt zip -b firefox
```

```shell
wxt submit --dry-run \
  --chrome-zip .output/{your-extension}-{version}-chrome.zip \
  --firefox-zip .output/{your-extension}-{version}-firefox.zip --firefox-sources-zip .output/{your-extension}-{version}-sources.zip \
  --edge-zip .output/{your-extension}-{version}-chrome.zip
```

```shell
wxt submit \
  --chrome-zip .output/{your-extension}-{version}-chrome.zip \
  --firefox-zip .output/{your-extension}-{version}-firefox.zip --firefox-sources-zip .output/{your-extension}-{version}-sources.zip \
  --edge-zip .output/{your-extension}-{version}-chrome.zip
```

--------------------------------

### Configure Ant Design Styles with StyleProvider in WXT

Source: https://wxt.dev/guide/resources/faq

This example shows how to configure Ant Design's styles to be correctly applied within a ShadowRootUi by using the `StyleProvider` and specifying the `cssContainer` from the ShadowRoot's head. This ensures library styles are scoped correctly.

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

### Get All Items in Storage Area

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Retrieves all items currently stored within a specified storage area (e.g., chrome.storage.local).

```typescript
const allItems = await storage.snapshot(chrome.storage.local);
console.log(allItems);
```

--------------------------------

### WXT Module: Update Resolved Config

Source: https://wxt.dev/guide/essentials/wxt-modules

Shows a WXT module that modifies the build configuration after it has been resolved. This example specifically changes the output directory (`outDir`) to 'dist'.

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

### TypeScript Declaration Reference for Monorepos

Source: https://wxt.dev/guide/essentials/config/typescript

In monorepo setups, you might not extend the WXT tsconfig. In such cases, include this reference path to properly resolve WXT types.

```typescript
/// <reference path="./.wxt/wxt.d.ts" />
```

--------------------------------

### Use import.meta.glob in WXT Content Script Entrypoint

Source: https://wxt.dev/guide/resources/upgrading

Illustrates using `import.meta.glob` within a WXT content script entrypoint to dynamically import modules. The example shows how to gather paths from dynamically imported provider modules and use them to define the `matches` option for the content script.

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

### Define WXT App Config with Types

Source: https://wxt.dev/guide/essentials/config/runtime

Demonstrates how to define the application's runtime configuration using `defineAppConfig`. It includes extending the `WxtAppConfig` interface for custom types and setting a default theme. This setup ensures type safety for your configuration.

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

### WebExtConfig: disabled Default

Source: https://wxt.dev/api/reference/wxt/interfaces/webextconfig

Default value for the 'disabled' property in WebExtConfig. When false, the browser will open with the extension installed in dev mode.

```typescript
false
```

--------------------------------

### Add Entrypoint using TypeScript

Source: https://wxt.dev/api/reference/wxt/modules/functions/addentrypoint

Adds a content script entrypoint to the WXT project. It utilizes `wxt.builder.importEntrypoint` to extract options from the specified entrypoint file. This function assumes the WXT module setup is already in place.

```typescript
export default defineWxtModule(async (wxt, options) => {
  const entrypointPath = "/path/to/my-entrypoint.ts";
  addEntrypoint(wxt, {
    type: "content-script",
    name: "some-name",
    inputPath: entrypointPath,
    outputDir: wxt.config.outDir,
    options: await wxt.builder.importEntrypoint(entrypointPath),
  });
});
```

--------------------------------

### Create Chrome Extension ZIP Archive

Source: https://wxt.dev/guide/essentials/publishing

This command generates a ZIP archive of your Chrome extension, which is a prerequisite for submitting it to the Chrome Web Store. Ensure you have WXT installed and configured in your project.

```shell
wxt zip
```

--------------------------------

### Entrypoint Folder Structure (Directory)

Source: https://wxt.dev/guide/essentials/entrypoints

Illustrates how to define an entrypoint using a directory structure within 'entrypoints/'. An 'index' file within the directory serves as the primary entrypoint file.

```html
📂 entrypoints/
   📂 {name}/
      📄 index.{ext}
```

--------------------------------

### HTML for Options Entrypoint

Source: https://wxt.dev/guide/essentials/entrypoints

Defines the HTML for an extension's options page. This includes meta tags for manifest customization like opening in a tab, applying browser styles, and inclusion/exclusion from builds.

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

### Feature Detection for Browser APIs

Source: https://wxt.dev/guide/essentials/extension-apis

Explains how to perform feature detection to check for the availability of browser APIs at runtime, as types do not account for runtime availability. Examples show direct checks and the use of optional chaining (`?.`) for safe API access.

```typescript
if (browser.runtime.onSuspend != null) {
  browser.runtime.onSuspend.addListener(() => {
    // ...
  });
}

browser.runtime.onSuspend?.addListener(() => {
  // ...
});
```

--------------------------------

### Configure Analytics Enabled State (TypeScript)

Source: https://wxt.dev/analytics

Control whether analytics is enabled using the `enabled` config. This example shows how to define the storage item for the enabled state with a fallback to `true`.

```typescript
import { storage } from 'wxt/storage';

export default defineAppConfig({
  analytics: {
    enabled: storage.defineItem('local:analytics-enabled', {
      fallback: true,
    }),
  },
});
```

--------------------------------

### Reload Extension Page Example - TypeScript

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtdevserver

Demonstrates how to reload a specific page within the extension using the `reloadPage` method. This is useful for updating UI components without a full extension restart. Ensure the provided path matches the output bundle path.

```typescript
server.reloadPage("popup.html")
server.reloadPage("sandbox.html")
```

--------------------------------

### Vue Teleport Component Usage with ShadowRoot Target

Source: https://wxt.dev/guide/resources/faq

This Vue component example shows how to use the `Teleport` component, utilizing a target provided via injection from the ShadowRootUi's mount process. This ensures dialogs or other elements are rendered within the intended ShadowRoot.

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

### Entrypoint Folder Structure (Single File)

Source: https://wxt.dev/guide/essentials/entrypoints

Demonstrates the basic folder structure for defining an entrypoint as a single file within the 'entrypoints/' directory. The file extension determines the type of entrypoint.

```html
📂 entrypoints/
   📄 {name}.{ext}
```

--------------------------------

### HTML for Sandbox Entrypoint

Source: https://wxt.dev/guide/essentials/entrypoints

Defines the HTML for a sandboxed page entrypoint, primarily for Chromium-based browsers. It includes standard meta tags for manifest include/exclude configurations.

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

### ContentScriptContext Example: Testing Storage Listener Removal

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

Demonstrates how to use ContentScriptContext to ensure a storage listener is removed when the context is invalidated. This test verifies that the watcher function is called only once before invalidation and not after.

```typescript
import { ContentScriptContext } from 'wxt/utils/content-scripts-context';

test("storage listener should be removed when context is invalidated", () => {
  const ctx = new ContentScriptContext('test');
  const item = storage.defineItem("local:count", { defaultValue: 0 });
  const watcher = vi.fn();

  const unwatch = item.watch(watcher);
  ctx.onInvalidated(unwatch); // Listen for invalidate here

  await item.setValue(1);
  expect(watcher).toBeCalledTimes(1);
  expect(watcher).toBeCalledWith(1, 0);

  ctx.notifyInvalidated(); // Use this function to invalidate the context
  await item.setValue(2);
  expect(watcher).toBeCalledTimes(1);
});
```

--------------------------------

### createServer API

Source: https://wxt.dev/api/reference/wxt/functions/createserver

Creates a development server and pre-builds necessary files before loading the extension. This is a core function for setting up a WXT development environment.

```APIDOC
## POST /wxt/createServer

### Description
Creates a dev server and pre-builds all the files that need to exist before loading the extension.

### Method
POST

### Endpoint
/wxt/createServer

### Parameters
#### Query Parameters
- **inlineConfig** (InlineConfig) - Optional - Configuration object for the development server.

### Request Example
```json
{
  "inlineConfig": {
    "plugins": [],
    "extends": "vite.config.ts"
  }
}
```

### Response
#### Success Response (200)
- **server** (WxtDevServer) - An object representing the WXT development server.

#### Response Example
```json
{
  "server": {
    "watcher": {},
    "port": 5173,
    "resolvedConfig": {},
    "restart": "() => Promise<void>",
    "printUrls": "() => void",
    "start": "() => Promise<void>",
    "stop": "() => Promise<void>"
  }
}
```

### Example Usage (TypeScript)
```typescript
const server = await wxt.createServer({
  // Enter config...
});
await server.start();
```
```

--------------------------------

### Build Extension for Specific Browser (CLI)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Use the `-b` CLI flag with the WXT build command to create a separate build for a specific browser. By default, 'chrome' is targeted. Examples include targeting Firefox or a custom browser.

```sh
wxt            # same as: wxt -b chrome
wxt -b firefox
wxt -b custom
```

--------------------------------

### Prefix User Modules for Execution Order (TypeScript)

Source: https://wxt.dev/guide/essentials/config/hooks

This example demonstrates how to control the execution order of user modules by prefixing their filenames with numbers. Lower numbers indicate earlier execution. This is useful for ensuring modules load in a specific sequence.

```typescript
// modules/2.i18n.ts
export { default } from '@wxt-dev/i18n/module';
```

--------------------------------

### Including Related Files in Entrypoint Directory

Source: https://wxt.dev/guide/essentials/entrypoints

Demonstrates how to organize related files alongside the main 'index' file within an entrypoint's directory. This pattern is applicable for 'popup', 'background', and 'content' scripts.

```html
📂 entrypoints/
   📂 popup/
      📄 index.html
      📄 main.ts
      📄 style.css
   📂 background/
      📄 index.ts
      📄 alarms.ts
      📄 messaging.ts
   📂 youtube.content/
      📄 index.ts
      📄 style.css
```

--------------------------------

### Rename defineRunnerConfig to defineWebExtConfig

Source: https://wxt.dev/guide/resources/upgrading

Illustrates the renaming of the `defineRunnerConfig` function to `defineWebExtConfig`. This change is part of a broader effort to align naming conventions within the WXT configuration. The example shows the import statement for the new function.

```typescript
import { defineRunnerConfig } from 'wxt';
import { defineWebExtConfig } from 'wxt';
```

--------------------------------

### Get Translated Message (JavaScript/TypeScript)

Source: https://wxt.dev/guide/essentials/i18n

Retrieves a translated string using its key from the loaded locale messages. This function call is used within your application code to display localized text to the user.

```typescript
browser.i18n.getMessage('helloWorld');
```

--------------------------------

### Configure Vue Teleport Target in ShadowRootUi

Source: https://wxt.dev/guide/resources/faq

This example demonstrates how to set up a Vue application within a ShadowRootUi, providing a specific target element from the ShadowRoot's body for Vue's `Teleport` component. This ensures teleported content is rendered inside the isolated ShadowRoot.

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

--------------------------------

### Handling Entrypoint Limitations: Background Script

Source: https://wxt.dev/guide/essentials/extension-apis

Demonstrates the correct way to use browser extension APIs within a WXT background script's main function. Moving API calls inside `defineBackground` prevents errors caused by the non-extension environment during build time.

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

### Add Vite Plugin for Framework Integration in WXT

Source: https://wxt.dev/guide/essentials/frontend-frameworks

This configuration allows WXT to use any framework that provides a Vite plugin, such as React. It requires the respective Vite plugin (e.g., `@vitejs/plugin-react`) to be installed. This method is useful when a specific WXT framework module isn't available.

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

### Configure Analytics User ID and Properties (TypeScript)

Source: https://wxt.dev/analytics

Customize where user ID and properties are stored using the `userId` and `userProperties` config. This example defines custom storage keys using WXT's storage API.

```typescript
import { storage } from 'wxt/storage';

export default defineAppConfig({
  analytics: {
    userId: storage.defineItem('local:custom-user-id-key'),
    userProperties: storage.defineItem('local:custom-user-properties-key'),
  },
});
```

--------------------------------

### Mocking WXT's Internal Imports

Source: https://wxt.dev/guide/essentials/unit-testing

This example shows how to mock specific WXT utility functions that are typically imported via the `#imports` alias. It explains that you should mock the actual module path (e.g., `wxt/utils/inject-script`) rather than the `#imports` alias itself.

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

### Define Storage Item with Init Default Value (TypeScript)

Source: https://wxt.dev/storage

Illustrates using the `init` option in `storage.defineItem` to initialize and save a value in storage if it doesn't already exist. The `init` function is executed only once when the item is first defined or accessed if not present. This is suitable for values that need to be set once, like a user ID or installation timestamp.

```typescript
const userId = storage.defineItem('local:user-id', {
  init: () => globalThis.crypto.randomUUID(),
});
const installDate = storage.defineItem('local:install-date', {
  init: () => new Date().getTime(),
});

```

--------------------------------

### Add Vite Configuration in WXT Module

Source: https://wxt.dev/api/reference/wxt/modules/functions/addviteconfig

This example demonstrates how to use the addViteConfig function within a WXT module to merge additional Vite build configurations. It takes the WXT instance and a function returning the Vite configuration as parameters. The configuration provided here will be merged with the existing Vite configuration, respecting the precedence of the main wxt.config.ts file.

```typescript
export default defineWxtModule((wxt, options) => {
  addViteConfig(wxt, () => ({
    build: {
      sourceMaps: true,
    },
  }));
});
```

--------------------------------

### Inject Script into Main World with WXT

Source: https://wxt.dev/guide/essentials/content-scripts

This example shows how to inject a script into the main world of a webpage using WXT's `injectScript` function. This approach supports both MV2 and MV3, all browsers, and allows access to the extension API via a parent content script. It requires a content script and an unlisted script entry point, along with manifest configuration for web accessible resources.

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

### Create an IFrame UI with WXT

Source: https://wxt.dev/guide/essentials/content-scripts

This snippet demonstrates how to create and mount an IFrame for hosting UI elements. It requires an HTML entry point and configuration in the manifest. The `createIframeUi` function simplifies the process, allowing customization of position, anchor, and mount behavior.

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

### WXT Manifest MV2 and MV3 Compatibility Example

Source: https://wxt.dev/guide/essentials/config/manifest

Configure manifest properties like 'action' and 'web_accessible_resources' using their MV3 format. WXT automatically converts these to their MV2 equivalents when targeting MV2. Properties specific to one manifest version will be stripped when targeting the other.

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

### Defining Page Action for MV2 Popup

Source: https://wxt.dev/guide/essentials/entrypoints

Illustrates how to configure manifest options for an HTML entrypoint, specifically setting the 'page_action' for an MV2 popup using a `<meta>` tag within the HTML head.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta name="manifest.type" content="page_action" />
  </head>
</html>
```

--------------------------------

### Filter Content Script Entrypoint (TypeScript)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Control which entrypoints are included or excluded for specific browsers using the 'include' and 'exclude' options within the 'defineContentScript' configuration. This example shows a content script built only for Firefox.

```ts
export default defineContentScript({
  include: ['firefox'],

  main(ctx) {
    // ...
  },
});
```

--------------------------------

### Build Extension

Source: https://wxt.dev/api/reference/wxt/functions/build

Bundles the web extension for production using configuration from `wxt.config.ts` and optional inline configuration. Returns a promise of the build result.

```APIDOC
## POST /build

### Description
Bundles the extension for production. Returns a promise of the build result. Discovers the `wxt.config.ts` file in the root directory, and merges that config with what is passed in.

### Method
POST

### Endpoint
/build

### Parameters
#### Query Parameters
- **config** (InlineConfig) - Optional - Allows overriding the configuration discovered from `wxt.config.ts`.

### Request Body
This endpoint does not expect a request body.

### Request Example
```typescript
// Use config from `wxt.config.ts`
const res = await build()

// or override config from `wxt.config.ts`
const res = await build({
  // Override config...
})
```

### Response
#### Success Response (200)
- **BuildOutput** (Promise) - A promise that resolves with the build output details.
```

--------------------------------

### Filter HTML Entrypoint (HTML Meta Tag)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Filter HTML entrypoints based on browser targets by using the 'manifest.exclude' meta tag within the HTML file's head. This example excludes the HTML file from being built for Chrome.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="manifest.exclude" content="['chrome', ...]">
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

--------------------------------

### MainWorldContentScriptEntrypointOptions Configuration

Source: https://wxt.dev/api/reference/wxt/interfaces/mainworldcontentscriptentrypointoptions

This section details the properties available for configuring content script entrypoints using the MainWorldContentScriptEntrypointOptions interface.

```APIDOC
## Interface: MainWorldContentScriptEntrypointOptions

### Description
Configuration options for defining content script entrypoints.

### Properties

#### `allFrames` (boolean) - Optional
Determines if the script should be injected into all frames (including subframes).
*   **Default**: `false`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.allFrames`

#### `cssInjectionMode` (string) - Optional
Specifies how CSS files are injected. Options: `"manifest"`, `"manual"`, `"ui"`.
*   `"manifest"`: CSS is included in the manifest's `css` array.
*   `"manual"`: You are responsible for manually loading CSS using `browser.runtime.getURL()`.
*   `"ui"`: CSS is automatically added when calling `createShadowRootUi`.
*   **Default**: `"manifest"`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.cssInjectionMode`

#### `exclude` (string[]) - Optional
List of target browsers to exclude this entrypoint from. Cannot be used with `include`.
*   **Default**: `undefined`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.exclude`

#### `excludeGlobs` (string[]) - Optional
Glob patterns to exclude files from being included as content scripts.
*   **Default**: `[]`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.excludeGlobs`

#### `excludeMatches` (string[]) - Optional
URL patterns to exclude the content script from.
*   **Default**: `[]`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.excludeMatches`

#### `include` (string[]) - Optional
List of target browsers to include this entrypoint in. Defaults to all builds. Cannot be used with `exclude`.
*   **Default**: `undefined`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.include`

#### `includeGlobs` (string[]) - Optional
Glob patterns to include files as content scripts.
*   **Default**: `[]`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.includeGlobs`

#### `matchAboutBlank` (boolean) - Optional
Whether to match the `about:blank` page.
*   **Default**: `false`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.matchAboutBlank`

#### `matchOriginAsFallback` (boolean) - Optional
Enables matching the origin as a fallback.
*   **Default**: `false`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.matchOriginAsFallback`

#### `matches` (string[]) - Required
An array of URL patterns where the content script should be injected.
*   **Inherited from**: `BaseContentScriptEntrypointOptions.matches`

#### `registration` (string) - Optional
Specifies how the content script is registered. Options: `"runtime"` or `"manifest"`.
*   `"manifest"`: Registers via the `content_scripts` manifest key.
*   `"runtime"`: Registers dynamically using the scripting API.
*   **Default**: `"manifest"`
*   **Inherited from**: `BaseContentScriptEntrypointOptions.registration`

#### `runAt` (string) - Optional
Specifies when the script should be executed. Options are derived from `RunAt`.
*   **Default**: `"documentIdle"`

### Extends
* `BaseContentScriptEntrypointOptions`
```

--------------------------------

### Use Random User ID with WXT Storage (TypeScript)

Source: https://wxt.dev/analytics

Implement a common pattern of using a random string for the user ID to maintain privacy. This example configures `userId` to initialize with a random UUID using WXT's storage API.

```typescript
import { storage } from 'wxt/storage';

export default defineAppConfig({
  analytics: {
    userId: storage.defineItem('local:custom-user-id-key', {
      init: () => crypto.randomUUID(),
    }),
  },
});
```

--------------------------------

### Disabling Style Inheritance in createShadowRootUi

Source: https://wxt.dev/guide/resources/upgrading

Provides an example of how to disable WXT's default style reset behavior within `createShadowRootUi` by setting `inheritStyles: true`. This is useful if the automatic style isolation causes unexpected issues or if manual CSS overrides are preferred.

```typescript
const ui = await createShadowRootUi({
  inheritStyles: true,
  // ...
});
```

--------------------------------

### Copy WASM to Output Directory with WXT Module

Source: https://wxt.dev/guide/essentials/assets

This WXT module hook ensures the WASM file is copied from `node_modules` to the specified relative destination in the build output. It utilizes Node.js `resolve` to get the absolute path of the WASM file and defines a destination path for it.

```typescript
// modules/oxc-parser-wasm.ts
import { resolve } from 'node:path';

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

### HTML for Popup Entrypoint

Source: https://wxt.dev/guide/essentials/entrypoints

Structures the HTML for a browser action popup. It allows configuration of the popup's title, default icon, type (page_action/browser_action), and browser styling via meta tags.

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

### Basic Storage Item Access (TypeScript)

Source: https://wxt.dev/storage

Illustrates the correct way to access storage items by prefixing the key with the storage area (e.g., 'local:'). Shows type parameter usage for specifying expected value types.

```ts
// ❌ This will throw an error
await storage.getItem('installDate');

// ✅ This is good
await storage.getItem('local:installDate');

await storage.getItem<number>('local:installDate');
await storage.watch<number>(
  'local:installDate',
  (newInstallDate, oldInstallDate) => {
    // ...
  },
);
await storage.getMeta<{ v: number }>('local:installDate');
```

--------------------------------

### Handling Entrypoint Limitations: Unlisted Script

Source: https://wxt.dev/guide/essentials/extension-apis

Illustrates the proper way to utilize browser extension APIs in WXT unlisted scripts. Encapsulating API calls within the main function provided by `defineUnlistedScript` resolves issues related to the build environment not having access to extension globals.

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

### Handling Entrypoint Limitations: Content Script

Source: https://wxt.dev/guide/essentials/extension-apis

Shows the correct placement of browser API calls within a WXT content script. By ensuring `browser.*` usage is within the `main` function of `defineContentScript`, it avoids runtime errors associated with the build environment.

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

### WxtPackageManager: List Dependencies

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtpackagemanager

Lists all project dependencies, mimicking `npm ls`, `pnpm ls`, `bun pm ls`, or `yarn list`.

```APIDOC
## GET /api/wxt/packages/listDependencies

### Description
Lists project dependencies.

### Method
GET

### Endpoint
/api/wxt/packages/listDependencies

### Parameters
#### Query Parameters
- **options.all** (boolean) - Optional - Include all dependencies (if supported by the package manager).
- **options.cwd** (string) - Optional - The current working directory.

### Request Example
```
GET /api/wxt/packages/listDependencies?options.all=true&options.cwd=./my-project
```

### Response
#### Success Response (200)
- **dependencies** (array) - An array of dependency objects.
  - **name** (string) - The name of the dependency.
  - **version** (string) - The version of the dependency.
  - **dependencies** (array) - Nested dependencies.

#### Response Example
```json
{
  "dependencies": [
    {
      "name": "react",
      "version": "18.2.0",
      "dependencies": [
        {
          "name": "react-dom",
          "version": "18.2.0"
        }
      ]
    }
  ]
}
```
```

--------------------------------

### Define WXT Web-Ext Configuration

Source: https://wxt.dev/guide/essentials/config/browser-startup

This snippet shows the basic structure for defining a WXT web-ext configuration using TypeScript. It imports `defineWebExtConfig` and exports a default configuration object. This is a foundational configuration file (`web-ext.config.ts`) often used to customize web-ext behavior.

```typescript
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
  // ...
});
```

--------------------------------

### Create React Shadow Root UI in Content Script

Source: https://wxt.dev/guide/essentials/content-scripts

Demonstrates creating a content script that renders a React application within a ShadowRoot UI. It imports CSS and the React app, configures `cssInjectionMode`, and manages React root creation and unmounting.

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

### Unlisted HTML Page Structure and Access

Source: https://wxt.dev/guide/essentials/entrypoints

Structure for unlisted HTML pages and how to access them at runtime using `browser.runtime.getURL`. These pages are not directly listed in the manifest but are accessible via their file path.

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

```javascript
const url = browser.runtime.getURL('/{name}.html');

console.log(url); // "chrome-extension://{id}/{name}.html"
window.open(url); // Open the page in a new tab
```

--------------------------------

### Deeply Nested Entrypoints Not Supported

Source: https://wxt.dev/guide/essentials/entrypoints

Illustrates that WXT does not support deeply nested entrypoints like some web frameworks. Entrypoints must be at most one level deep within the 'entrypoints/' directory.

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

### Define Background Entrypoint (TypeScript)

Source: https://wxt.dev/guide/essentials/entrypoints

Defines the background script for a WXT extension. The `defineBackground` function is used, and for MV2, it's a script in the background page, while for MV3, it's a service worker. Runtime code outside the `main` function is not allowed during the build process.

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

### createShadowRootUi API

Source: https://wxt.dev/api/reference/wxt/utils/content-script-ui/shadow-root/functions/createshadowrootui

The `createShadowRootUi` function creates a content script UI within a ShadowRoot. This function is asynchronous as it needs to load CSS over the network.

```APIDOC
## Function: createShadowRootUi()

### Description
Creates a content script UI inside a `ShadowRoot`. This function is async because it has to load the CSS via a network call.

### Method
POST

### Endpoint
/websites/wxt_dev/api/wxt/utils/content-script-ui/shadow-root/createShadowRootUi

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **ctx** (`ContentScriptContext`) - Required - The content script context.
- **options** (`ShadowRootContentScriptUiOptions`<`TMounted`>) - Required - Options for configuring the ShadowRoot UI.

### Request Example
```json
{
  "ctx": { /* ... ContentScriptContext object ... */ },
  "options": { /* ... ShadowRootContentScriptUiOptions object ... */ }
}
```

### Response
#### Success Response (200)
- **ShadowRootContentScriptUi** (`ShadowRootContentScriptUi`<`TMounted`>) - The created ShadowRoot UI instance.

#### Response Example
```json
{
  "uiInstance": { /* ... ShadowRootContentScriptUi object ... */ }
}
```

### See
- [https://wxt.dev/guide/essentials/content-scripts.html#shadow-root](https://wxt.dev/guide/essentials/content-scripts.html#shadow-root)

### Source
`packages/wxt/src/utils/content-script-ui/shadow-root.ts:17`
```

--------------------------------

### Define Content Script Entrypoint (TypeScript)

Source: https://wxt.dev/guide/essentials/entrypoints

Defines a content script for a WXT extension using `defineContentScript`. It supports various manifest options and allows for runtime registration. Similar to background scripts, runtime code outside the `main` function is disallowed during the build.

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

### BackgroundEntrypointOptions Interface

Source: https://wxt.dev/api/reference/wxt/interfaces/backgroundentrypointoptions

Defines the configuration options for background script entrypoints, including browser targeting and module type.

```APIDOC
## Interface: BackgroundEntrypointOptions

### Description
Options for configuring background script entrypoints.

### Properties
#### exclude
- **exclude** (string[]) - Optional - List of target browsers to exclude this entrypoint from. Cannot be used with `include`. You must choose one of the two options.
  - Default: `undefined`
  - Inherited from: `BaseEntrypointOptions.exclude`

#### include
- **include** (string[]) - Optional - List of target browsers to include this entrypoint in. Defaults to being included in all builds. Cannot be used with `exclude`. You must choose one of the two options.
  - Default: `undefined`
  - Inherited from: `BaseEntrypointOptions.include`

#### persistent
- **persistent** (PerBrowserOption<boolean>) - Optional - Configuration for persistent background scripts across browsers.

#### type
- **type** ('module') - Optional - Set to `"module"` to output the background entrypoint as ESM. ESM outputs can share chunks and reduce the overall size of the bundled extension. When `undefined`, the background is bundled individually into an IIFE format.
  - Default: `undefined`
```

--------------------------------

### Defining Content Script Manifest Options

Source: https://wxt.dev/guide/essentials/entrypoints

Shows how to define manifest options, specifically 'matches' for content scripts, directly within the entrypoint TypeScript file using `defineContentScript`.

```ts
export default defineContentScript({
  matches: ['*://*.wxt.dev/*'],
  main() {
    // ...
  },
});
```

--------------------------------

### Build and Convert Safari Extension (PNPM)

Source: https://wxt.dev/guide/essentials/publishing

Builds the extension for Safari using WXT and then converts the output for Safari using the `xcrun safari-web-extension-converter` tool. This is a multi-step process for Safari publishing.

```shell
pnpm wxt build -b safari
xcrun safari-web-extension-converter .output/safari-mv2
```

--------------------------------

### Setting Build Modes with WXT CLI

Source: https://wxt.dev/guide/essentials/config/build-mode

Demonstrates how to specify build modes when running WXT development and build commands using the `--mode` flag. This allows for environment-specific configurations.

```shell
wxt --mode production
wxt build --mode development
wxt zip --mode testing
```

--------------------------------

### Bookmarks Entrypoint HTML (HTML)

Source: https://wxt.dev/guide/essentials/entrypoints

Defines the HTML for the bookmarks entrypoint. WXT automatically updates the manifest to override the browser's bookmarks page with this HTML. Meta tags can be used to include or exclude the entrypoint from specific builds.

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

### BuildOutput Interface

Source: https://wxt.dev/api/reference/wxt/interfaces/BuildOutput

The BuildOutput interface represents the output of a WXT build process, containing information about the manifest, public assets, and build steps.

```APIDOC
## Interface: BuildOutput

### Description
Represents the output of a WXT build process.

### Properties

#### manifest
- **manifest** (Manifest) - The build manifest.

#### publicAssets
- **publicAssets** (OutputAsset[]) - An array of public assets generated during the build.

#### steps
- **steps** (BuildStepOutput[]) - An array detailing the build steps executed.
```

--------------------------------

### Configure Jiti Entrypoint Loader in WXT

Source: https://wxt.dev/guide/resources/upgrading

Shows how to explicitly configure WXT to use the `jiti` entrypoint loader. This is provided as an option to continue using the previous loading mechanism, though it is deprecated and scheduled for removal in a future major version.

```typescript
export default defineConfig({
  entrypointLoader: 'jiti',
});
```

--------------------------------

### Configure Development Server in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Sets up configuration options specifically for WXT's development mode. This includes defining the host and port for the development server, and configuring the reload command shortcut. It allows customization of how the development environment operates, including the origin for connecting the extension UI to the dev server.

```typescript
{
  reloadCommand: "Alt+R",
  server: {
    host: "localhost",
    origin: "http://localhost:3000",
    port: 3000
  }
}
```

--------------------------------

### Unlisted Script Definition and Runtime Access

Source: https://wxt.dev/guide/essentials/entrypoints

Defines unlisted JavaScript scripts that can be executed at runtime. Includes options for build inclusion/exclusion and a `main` function for script logic. Runtime access is provided via `browser.runtime.getURL`.

```javascript
export default defineUnlistedScript(() => {
  // Executed when script is loaded
});
```

```javascript
export default defineUnlistedScript({
  // Set include/exclude if the script should be removed from some builds
  include: undefined | string[],
  exclude: undefined | string[],

  main() {
    // Executed when script is loaded
  },
});
```

```javascript
const url = browser.runtime.getURL('/{name}.js');

console.log(url); // "chrome-extension://{id}/{name}.js"
```

```javascript
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

### Devtools Entrypoint HTML (HTML)

Source: https://wxt.dev/guide/essentials/entrypoints

Defines the HTML structure for the devtools entrypoint. This allows for the creation of custom panels and panes within the browser's developer tools. Meta tags can be used to conditionally include or exclude these devtools from different build configurations.

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

### root

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Set the root directory of your project, which contains the `package.json`.

```APIDOC
## root

### Description
Your project's root directory containing the `package.json` used to fill out the `manifest.json`.

### Default
```typescript
process.cwd()
```

### Type
`string`

### Source
packages/wxt/src/types.ts:19
```

--------------------------------

### modules

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Specify which WXT modules to include in your project.

```APIDOC
## modules

### Description
List of WXT module names to include. Can be the full package name ("wxt-module-analytics"), or just the suffix ("analytics" would resolve to "wxt-module-analytics").

### Type
`string[]`

### Source
packages/wxt/src/types.ts:376
```

--------------------------------

### outDir

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Set the output directory for build folders and ZIPs.

```APIDOC
## outDir

### Description
Output directory that stored build folders and ZIPs.

### Default
```typescript
".output"
```

### Type
`string`

### Source
packages/wxt/src/types.ts:56
```

--------------------------------

### Upgrading WXT Imports to #imports

Source: https://wxt.dev/guide/resources/upgrading

Shows how to replace old import paths from 'wxt/storage', 'wxt/client', and 'wxt/sandbox' with the new virtual module '#imports'. This change improves tree-shaking and resolves potential runtime errors by ensuring only necessary APIs are imported for each entrypoint.

```typescript
import { storage } from 'wxt/storage';
import { defineContentScript } from 'wxt/sandbox';
import { ContentScriptContext, useAppConfig } from 'wxt/client';

// After upgrade:
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

### ContentScriptContext Constructor

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

Illustrates how to instantiate the ContentScriptContext class. It takes a content script name and optional options for configuration.

```typescript
new ContentScriptContext(contentScriptName, options?)
```

--------------------------------

### Import Constants in WXT Content Script Entrypoint

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates how to import constants, such as `GOOGLE_MATCHES`, from a utility file (`~/utils/constants`) within a WXT content script entrypoint. This showcases the enhanced module resolution capabilities provided by `vite-node`.

```typescript
import { GOOGLE_MATCHES } from '~/utils/constants'

export default defineContentScript({
  matches: [GOOGLE_MATCHES],
  main: () => ...,
})
```

--------------------------------

### Enable src/ Directory in WXT Configuration

Source: https://wxt.dev/guide/essentials/project-structure

This configuration snippet shows how to set the `srcDir` option in `wxt.config.ts` to enable a `src/` directory for organizing source code. This moves default directories like `assets`, `components`, `entrypoints`, etc., under `src/`.

```typescript
export default defineConfig({
  srcDir: 'src',
});
```

--------------------------------

### Define Custom Storage Item (TypeScript)

Source: https://wxt.dev/storage

Shows how to use `storage.defineItem` to create reusable storage item configurations with types, default values, and associated methods for easier management.

```ts
// utils/storage.ts
const showChangelogOnUpdate = storage.defineItem<boolean>(
  'local:showChangelogOnUpdate',
  {
    fallback: true,
  },
);

// Usage:
await showChangelogOnUpdate.getValue();
await showChangelogOnUpdate.setValue(false);
await showChangelogOnUpdate.removeValue();
const unwatch = showChangelogOnUpdate.watch((newValue) => {
  // ...
});
```

--------------------------------

### Add NPM Module to WXT Config

Source: https://wxt.dev/guide/essentials/wxt-modules

Demonstrates how to add an NPM-installed WXT module to your project's configuration file. This is the standard way to integrate pre-built modules.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/auto-icons'],
});
```

--------------------------------

### Unified Browser API Implementation (MJS)

Source: https://wxt.dev/guide/essentials/extension-apis

Shows the underlying implementation of the unified `browser` API in MJS format. It checks for the existence of `globalThis.browser` and falls back to `globalThis.chrome`, ensuring compatibility across different browser environments and manifest versions.

```javascript
export const browser = globalThis.browser?.runtime?.id
  ? globalThis.browser
  : globalThis.chrome;
```

--------------------------------

### build:before Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `build:before` hook is executed before the build process begins in both development and production modes. It receives the configured WXT object.

```APIDOC
## POST /hooks/build:before

### Description
Called before the build is started in both dev mode and build mode.

### Method
POST

### Endpoint
`/hooks/build:before`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.

### Request Example
```json
{
  "wxt": { /* Wxt object */ }
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### manifest

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Customize the `manifest.json` file.

```APIDOC
## manifest

### Description
Customize the `manifest.json` output. Can be an object, promise, or function that returns an object or promise.

### Type
`UserManifest | Promise<UserManifest> | UserManifestFn`

### Source
packages/wxt/src/types.ts:133
```

--------------------------------

### Create Solid.js Shadow Root UI in Content Script

Source: https://wxt.dev/guide/essentials/content-scripts

Illustrates how to create a content script that renders a Solid.js application inside a ShadowRoot UI. This includes importing CSS, configuring `cssInjectionMode`, and utilizing Solid's `render` and cleanup functions.

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

### IntegratedContentScriptUiOptions Type

Source: https://wxt.dev/api/reference/wxt/utils/content-script-ui/integrated/type-aliases/integratedcontentscriptuioptions

Defines the options for configuring an integrated UI within a content script. It includes callbacks for mounting and unmounting, as well as the tag for the wrapper element.

```APIDOC
## Type alias: IntegratedContentScriptUiOptions`<TMounted>`

> **IntegratedContentScriptUiOptions** <`TMounted`>: `ContentScriptUiOptions`<`TMounted`> & `object`

### Description

Options for configuring an integrated UI within a content script. This type extends `ContentScriptUiOptions` and adds specific properties for managing the UI lifecycle.

### onMount

> **onMount** : (`wrapper`) => `TMounted`

Callback executed when mounting the UI. This function should create and append the UI to the `wrapper` element. It is called every time `ui.mount()` is called.
Optionally return a value that can be accessed at `ui.mounted` or in the `onRemove` callback.

#### Parameters

*   **wrapper** (`HTMLElement`) - The HTML element to which the UI should be appended.

### tag

> **tag**?: `string`

Tag used to create the wrapper element for the UI.

#### Default

```ts
"div"
```

### Type parameters

*   `TMounted` - The type of the value returned by the `onMount` callback.
```

--------------------------------

### Content Script Entrypoint Definition

Source: https://wxt.dev/guide/essentials/content-scripts

Defines the main function for a content script using WXT's defineContentScript. The 'main' function receives a context object 'ctx' which is crucial for managing the script's lifecycle and handling context invalidation.

```typescript
// entrypoints/example.content.ts
export default defineContentScript({
  main(ctx) {},
});
```

--------------------------------

### Customizing Output Directory Structure with WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Allows customization of the output directory structure using a template string. Available variables include browser, manifest version, mode, mode suffix, and command. This enables flexible organization of build outputs.

```typescript
"{{browser}}-mv{{manifestVersion}}{{modeSuffix}}"
```

--------------------------------

### Incorrect File Placement

Source: https://wxt.dev/guide/essentials/entrypoints

Highlights a common mistake: placing files related to an entrypoint directly in the 'entrypoints/' directory. WXT will incorrectly treat these as separate entrypoints, likely causing errors.

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

### hooks

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Project hooks allow you to run custom logic during the build process.

```APIDOC
## hooks

### Description
Project hooks for running logic during the build process.

### Type
`NestedHooks<WxtHooks>`

### Source
packages/wxt/src/types.ts:370
```

--------------------------------

### ServerInfo Interface

Source: https://wxt.dev/api/reference/wxt/interfaces/serverinfo

The ServerInfo interface defines the structure for server information, including host, origin, and port.

```APIDOC
## Interface: ServerInfo

### Description
Provides information about the WXT development server, including its host, origin, and port.

### Properties

#### host
- **host** (string) - The hostname of the server. Example: `"localhost"`

#### origin
- **origin** (string) - The origin URL of the server. Example: `"http://localhost:3000"`

#### port
- **port** (number) - The port number the server is running on. Example: `3000`

### Extended By
- `WxtDevServer`
```

--------------------------------

### filterEntrypoints

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

A list of entrypoint names to build. This can significantly speed up the build process if you only need to develop a specific feature and don't require all entrypoints.

```APIDOC
## filterEntrypoints

### Description
A list of entrypoint names (`"popup"`, `"options"`, etc.) to build. Will speed up the build if your extension has lots of entrypoints, and you don't need to build all of them to develop a feature. If specified, this completely overrides the `include`/`exclude` option provided per-entrypoint.

### Type
`string[]`

### Source
packages/wxt/src/types.ts:50
```

--------------------------------

### entrypoints:found Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `entrypoints:found` hook is triggered once WXT has identified all entrypoint names and their corresponding paths in the project.

```APIDOC
## POST /hooks/entrypoints:found

### Description
Called once the names and paths of all entrypoints have been resolved.

### Method
POST

### Endpoint
`/hooks/entrypoints:found`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.
- **infos** (`EntrypointInfo[]`) - Required - List of entrypoints found in the project's `entrypoints` directory.

### Request Example
```json
{
  "wxt": { /* Wxt object */ },
  "infos": [ /* EntrypointInfo objects */ ]
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### Manual API Imports with #imports

Source: https://wxt.dev/blog/2024-12-06-using-imports-module

Demonstrates how to import multiple WXT APIs using the new #imports virtual module. This simplifies import statements compared to importing from individual submodules. The #imports module acts as a central hub for all WXT APIs.

```typescript
import { browser } from 'wxt/browser'; 
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root'; 
import { defineContentScript } from 'wxt/utils/define-content-script'; 
import { injectScript } from 'wxt/utils/inject-script'; 
import { 
  browser, createShadowRootUi, defineContentScript, injectScript 
} from '#imports';
```

--------------------------------

### Configure WXT Analytics Provider (Umami)

Source: https://wxt.dev/analytics

Configures the Umami analytics provider within the `app.config.ts` file for use with WXT. Requires Umami credentials from environment variables.

```typescript
// <srcDir>/app.config.ts
import { umami } from '@wxt-dev/analytics/providers/umami';

export default defineAppConfig({
  analytics: {
    debug: true,
    providers: [
      // ...
      umami({
        apiUrl: 'https://<your-umami-instance>/api',
        websiteId: import.meta.env.WXT_UMAMI_WEBSITE_ID,
        domain: import.meta.env.WXT_UMAMI_DOMAIN,
      }),
    ],
  },
});
```

--------------------------------

### HTML for History Entrypoint

Source: https://wxt.dev/guide/essentials/entrypoints

Defines the HTML structure for a browser history page entrypoint. It includes meta tags for manifest inclusion/exclusion, allowing WXT to override the default history page.

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

### prepare:publicPaths Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `prepare:publicPaths` hook is executed before the `paths.d.ts` file is generated. It allows developers to add custom paths (relative to the output directory) that WXT does not automatically include.

```APIDOC
## POST /hooks/prepare:publicPaths

### Description
Called before generating the list of public paths inside `.wxt/types/paths.d.ts`. Use this hook to add additional paths (relative to output directory) WXT doesn't add automatically.

### Method
POST

### Endpoint
`/hooks/prepare:publicPaths`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.
- **paths** (`string[]`) - Required - This list of paths TypeScript allows `browser.runtime.getURL` to be called with.

### Request Example
```json
{
  "wxt": { /* Wxt object */ },
  "paths": [
    "/icons/128.png"
  ]
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### Specify Browser Binaries in @wxt-dev/runner

Source: https://wxt.dev/runner

Provide custom paths to browser binaries if they are not in standard locations or if a specific version is needed. Use the `browserBinaries` option with a map of browser names to their executable paths.

```typescript
import {
  run
} from '@wxt-dev/runner';

await run({
  extensionDir: 'path/to/extension',
  browserBinaries: {
    chrome: '/path/to/chrome',
    firefox: '/path/to/firefox',
  },
});
```

--------------------------------

### Pass Custom Arguments to Browsers with @wxt-dev/runner

Source: https://wxt.dev/runner

Pass custom command-line arguments to the browser process during startup. Use `chromiumArgs` for Chromium-based browsers and `firefoxArgs` for Firefox. This can be used for setting window size, enabling specific features, or opening URLs.

```typescript
import {
  run
} from '@wxt-dev/runner';

await run({
  extensionDir: 'path/to/extension',
  chromiumArgs: ['--window-size=1920,1080'],
  firefoxArgs: ['--window-size', '1920,1080'],
});
```

```typescript
import {
  run
} from '@wxt-dev/runner';

await run({
  extensionDir: 'path/to/extension',
  chromiumArgs: ['https://example.com'],
  firefoxArgs: ['https://example.com'],
});
```

--------------------------------

### Execute Script and Log Return Value (TypeScript)

Source: https://wxt.dev/guide/essentials/scripting

This snippet demonstrates how to execute a script using `browser.scripting.executeScript` and log its return value. It targets a specific tab and loads a script file. The expected output is the value returned by the executed script.

```typescript
// entrypoints/background.ts
const res = await browser.scripting.executeScript({
  target: { tabId },
  files: ['content-scripts/example.js'],
});
console.log(res); // "Hello John!"

```

--------------------------------

### Persist Browser Profile using ChromiumProfile and KeepProfileChanges

Source: https://wxt.dev/guide/essentials/config/browser-startup

This configuration uses `chromiumProfile` and `keepProfileChanges` to manage persistent browser profiles for Chromium-based browsers in WXT development. It specifies an absolute path for the profile directory on Windows and ensures that changes to the profile are maintained across `dev` script executions. This is an alternative method to the `chromiumArgs` approach for persisting data.

```typescript
import { resolve } from 'node:path';

export default defineWebExtConfig({
  // On Windows, the path must be absolute
  chromiumProfile: resolve('.wxt/chrome-data'),
  keepProfileChanges: true,
});
```

--------------------------------

### Unlisted CSS Entrypoints

Source: https://wxt.dev/guide/essentials/entrypoints

Defines CSS entry points that are not directly listed in the manifest but can be imported. Supports various preprocessors like SCSS, SASS, LESS, STYL, and STYLUS. CSS for content scripts is placed in a specific directory.

```css
body {
  /* ... */
}
```

--------------------------------

### WXT Interface Properties

Source: https://wxt.dev/api/reference/wxt/interfaces/wxt

Details the properties available on the WXT interface, which provide access to various functionalities like build processes, configuration, hooks, package management, and development server.

```APIDOC
## Interface: Wxt 

### Description
This interface provides access to various functionalities within the WXT build and development environment.

### Properties

#### builder
* **Type**: `WxtBuilder`
* **Description**: The module in charge of executing all the build steps.

#### config
* **Type**: `ResolvedConfig`
* **Description**: Contains the resolved configuration for WXT.

#### hook
* **Type**: <`NameT`>(`name`, `function_`, `options`?) => () => `void`
* **Description**: Alias for `wxt.hooks.hook(...)`. Allows registering hooks.
  * **Type Parameters**: `NameT` extends `HookKeys<WxtHooks>`
  * **Parameters**:
    * `name` (NameT) - The name of the hook to register.
    * `function_` (InferCallback<WxtHooks, NameT>) - The callback function for the hook.
    * `options`? (object) - Optional configuration for the hook.
      * `allowDeprecated`? (boolean) - Whether to allow deprecated hooks.
* **Returns**: `void`

#### hooks
* **Type**: `Hookable<WxtHooks, HookKeys<WxtHooks>>`
* **Description**: Provides access to the hook system for extending WXT functionality.

#### logger
* **Type**: `Logger`
* **Description**: Alias for `config.logger`. Provides logging utilities.

#### pm
* **Type**: `WxtPackageManager`
* **Description**: Utility for interacting with the package manager.

#### reloadConfig
* **Type**: () => `Promise<void>`
* **Description**: Reloads the configuration file and updates the `wxt.config`.

#### server
* **Type**: `WxtDevServer`?
* **Description**: The development server instance, available only if it was started.
```

--------------------------------

### Configure Bundle Analysis in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Enables and configures bundle analysis for WXT builds. Options include enabling the analysis, keeping generated artifacts, automatically opening the analysis report in a browser, specifying the output file name, and customizing the visualization template. This feature helps in understanding and optimizing the extension's bundle size.

```typescript
{
  enabled: true,
  keepArtifacts: false,
  open: false,
  outputFile: "stats.html",
  template: "treemap"
}
```

--------------------------------

### srcDir

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Specify the directory containing all source code.

```APIDOC
## srcDir

### Description
Directory containing all source code. Set to `"src"` to move all source code to a `src/` directory.
After changing, don't forget to move the `public/` and `entrypoints/` directories into the new source dir.

### Default
```typescript
config.root
```

### Type
`string`

### Source
packages/wxt/src/types.ts:29
```

--------------------------------

### addPublicAssets()

Source: https://wxt.dev/api/reference/wxt/modules/functions/addpublicassets

Copies files from a specified directory into the extension's output directory, mimicking the public directory behavior. Existing files with matching names are skipped.

```APIDOC
## Function: addPublicAssets()

### Description
Copies files inside a directory (as if it were the public directory) into the extension's output directory. The directory itself is not copied, just the files inside it. If a filename matches an existing one, it is ignored.

### Method
`void` (This is a function, not an HTTP endpoint)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters

*   **wxt** (`Wxt`): The wxt instance provided by the module's setup function.
*   **dir** (`string`): The directory to copy.

### Returns
`void`

### Example
```typescript
export default defineWxtModule((wxt, options) => {
  addPublicAssets(wxt, "./dist/prebundled");
});
```

### Source
`packages/wxt/src/modules.ts:74`
```

--------------------------------

### Accessing Assets from /assets Directory

Source: https://wxt.dev/guide/essentials/assets

Demonstrates how to import and use assets from the `/assets` directory in various front-end technologies. These assets are processed by WXT's bundler. It shows usage in TypeScript, HTML, CSS, Vue, and JSX.

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

### Bundler Transformation of #imports

Source: https://wxt.dev/blog/2024-12-06-using-imports-module

Illustrates how the bundler transforms simplified #imports statements into individual API import statements. This process ensures that only the necessary APIs are imported, optimizing performance and bundle size through effective tree-shaking.

```typescript
import { defineContentScript, injectScript } from '#imports';
```

```typescript
import { defineContentScript } from 'wxt/utils/define-content-script';
import { injectScript } from 'wxt/utils/inject-script';
```

--------------------------------

### Configure WXT Runner

Source: https://wxt.dev/runner

Define the runner configuration for WXT projects. This file is typically named `wxt.runner.config.ts` and resides in the project root or `~/` directory. It allows setting up options for the runner.

```typescript
import {
  defineRunnerConfig
} from 'wxt';

export default defineRunnerConfig({
  // Options go here
});
```

--------------------------------

### Persist Browser Data with Chromium Args

Source: https://wxt.dev/guide/essentials/config/browser-startup

This TypeScript snippet demonstrates how to configure Chromium-based browsers to persist data across development sessions by using the `--user-data-dir` flag. It sets a specific directory (`./.wxt/chrome-data`) for storing the browser profile. This allows for retaining settings, extensions, and login information between runs of the `dev` script.

```typescript
export default defineWebExtConfig({
  chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
});
```

--------------------------------

### Migrate Browser.runtime.onMessage from Promise to Callback

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates how to update the `browser.runtime.onMessage` listener when migrating away from `webextension-polyfill`. It shows the old promise-based approach and the new callback-based approach using `sendResponse`.

```typescript
browser.runtime.onMessage.addListener(async () => {
  const res = await someAsyncWork();
  return res;
});

// Updated version:
browser.runtime.onMessage.addListener(async (_message, _sender, sendResponse) => {
  someAsyncWork().then((res) => {
    sendResponse(res);
  });
  return true;
});
```

--------------------------------

### Create Vanilla JS Shadow Root UI in Content Script

Source: https://wxt.dev/guide/essentials/content-scripts

Defines a content script that creates a simple paragraph element within a ShadowRoot UI. It requires importing a CSS file and setting `cssInjectionMode` to 'ui'. The UI is mounted to the 'body' element.

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

### Add Custom Entrypoints using 'entrypoints:found' Hook (TypeScript)

Source: https://wxt.dev/guide/essentials/wxt-modules

This snippet demonstrates how to use the `entrypoints:found` hook to add custom entrypoints to a WXT project. The hook is triggered before entrypoint validation, ensuring custom entrypoints are checked for duplicates. It requires the WXT library.

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

### Configuring Manifest with Environment Variables - TypeScript

Source: https://wxt.dev/guide/essentials/config/environment-variables

Shows how to configure the manifest file using environment variables. The function syntax for the `manifest` option defers its creation until after `.env` files are loaded, making variables like `WXT_APP_CLIENT_ID` available.

```typescript
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    oauth2: {
      client_id: import.meta.env.WXT_APP_CLIENT_ID
    }
  }
  manifest: () => ({
    oauth2: {
      client_id: import.meta.env.WXT_APP_CLIENT_ID
    }
  }),
});
```

--------------------------------

### Configure Vitest with WxtVitest Plugin (TypeScript)

Source: https://wxt.dev/api/reference/wxt/testing/vitest/functions/wxtvitest

This code snippet demonstrates how to configure Vitest using the WxtVitest plugin in a `vitest.config.ts` file. It imports necessary functions from Vitest and WXT, then initializes the WxtVitest plugin within the Vite configuration. The WxtVitest plugin automatically applies WXT-specific settings based on your `wxt.config.ts`.

```typescript
import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing/vitest-plugin';

export default defineConfig({
  plugins: [WxtVitest()],
});
```

--------------------------------

### WXT Hook Execution Order Debug Output (Plain Text)

Source: https://wxt.dev/guide/essentials/config/hooks

This is a sample debug output showing the execution order of WXT hooks. It lists hooks from built-in modules, user-defined modules in the `/modules` directory, and hooks defined in `wxt.config.ts`.

```plaintext
⚙ Hook execution order:
⚙   1. wxt:built-in:unimport
⚙   2. src/modules/auto-icons.ts
⚙   3. src/modules/example.ts
⚙   4. src/modules/i18n.ts
⚙   5. wxt.config.ts > hooks
```

--------------------------------

### SidepanelEntrypoint Interface

Source: https://wxt.dev/api/reference/wxt/interfaces/sidepanelentrypoint

Provides details about the properties available for a SidepanelEntrypoint, including its input path, name, options, output directory, and skipped status. It also shows inherited properties from BaseEntrypoint.

```APIDOC
## Interface: SidepanelEntrypoint

### Description
Defines the structure for sidepanel entrypoints in WXT projects.

### Properties

#### inputPath
- **inputPath** (`string`) - The absolute path to the entrypoint's input file. Inherited from `BaseEntrypoint`.

#### name
- **name** (`string`) - The entrypoint's name, derived from its filename or dirname. This is used in generating the output filename.
  * Examples:
    * `popup.html` → `popup`
    * `options/index.html` → `options`

#### options
- **options** (`ResolvedPerBrowserOptions<SidepanelEntrypointOptions, "defaultIcon">`) - Browser-specific options for the sidepanel entrypoint.

#### outputDir
- **outputDir** (`string`) - The absolute path to the entrypoint's output directory. Inherited from `BaseEntrypoint`.

#### skipped
- **skipped** (`boolean`, optional) - If true, the entrypoint will not be built by WXT. Inherited from `BaseEntrypoint`.

#### type
- **type** (`"sidepanel"`) - Specifies the type of the entrypoint as 'sidepanel'.

### Extends
- `BaseEntrypoint`
```

--------------------------------

### Listen for Extension Update Event (TypeScript)

Source: https://wxt.dev/guide/essentials/testing-updates

This snippet demonstrates how to use the `browser.runtime.onInstalled.addListener` API to trigger a callback function when an extension is updated. It checks the `reason` property to specifically target 'update' events. This is useful for executing post-update logic.

```typescript
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'update') {
    // Do something
  }
});
```

--------------------------------

### Unified Browser API Access in TypeScript

Source: https://wxt.dev/guide/essentials/extension-apis

Demonstrates how to import and use the unified `browser` API provided by WXT in TypeScript projects. This API abstracts browser-specific globals like `chrome` and `browser`. Auto-imports can eliminate the need for explicit import.

```typescript
import { browser } from 'wxt/browser';

browser.action.onClicked.addListener(() => {
  // ...
});
```

--------------------------------

### Run Extension Programmatically with @wxt-dev/runner

Source: https://wxt.dev/runner

Execute the @wxt-dev/runner to open a browser and load a local web extension. This requires specifying the directory containing the extension. The `run` function is asynchronous and takes an options object.

```typescript
import {
  run
} from '@wxt-dev/runner';

await run({
  extensionDir: '/path/to/extension',
  // Other options...
});
```

--------------------------------

### entrypoints:grouped Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `entrypoints:grouped` hook is called after all discovered entrypoints have been organized into their respective build groups.

```APIDOC
## POST /hooks/entrypoints:grouped

### Description
Called once all entrypoints have been grouped into their build groups.

### Method
POST

### Endpoint
`/hooks/entrypoints:grouped`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.
- **groups** (`EntrypointGroup[]`) - Required - The build groups of entrypoints.

### Request Example
```json
{
  "wxt": { /* Wxt object */ },
  "groups": [ /* EntrypointGroup objects */ ]
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### Configure WXT Auto Icons with Options

Source: https://wxt.dev/auto-icons

Demonstrates how to configure the WXT Auto Icons module with custom options in `wxt.config.ts`. Specific options can be found in the `AutoIconsOptions` JSDocs or source code.

```ts
export default defineConfig({
  modules: ['@wxt-dev/auto-icons'],
  autoIcons: {
    // ...
  },
});
```

--------------------------------

### prepare:types Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `prepare:types` hook is called before WXT writes the `tsconfig.json` and `wxt.d.ts` files. This hook enables the addition of custom references and declarations to these files.

```APIDOC
## POST /hooks/prepare:types

### Description
Called before WXT writes `.wxt/tsconfig.json` and `.wxt/wxt.d.ts`, allowing addition of custom references and declarations in `wxt.d.ts`, or directly modifying the options in `tsconfig.json`.

### Method
POST

### Endpoint
`/hooks/prepare:types`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.
- **entries** (`WxtDirEntry[]`) - Required - Entries to be added to the type definitions.

### Request Example
```json
{
  "wxt": { /* Wxt object */ },
  "entries": [
    {
      "path": "types/example.d.ts",
      "text": "declare const a: string;",
      "tsReference": true
    },
    {
      "module": "@types/example"
    }
  ]
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### outDirTemplate

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Customize the output directory structure using a template string.

```APIDOC
## outDirTemplate

### Description
Template string for customizing the output directory structure. Available variables:
  * `{{browser}}`: The target browser (e.g., 'chrome', 'firefox')
  * `{{manifestVersion}}`: The manifest version (e.g., 2 or 3)
  * `{{mode}}`: The build mode (e.g., 'development', 'production')
  * `{{modeSuffix}}`: A suffix based on the mode ('-dev' for development, '' for production)
  * `{{command}}`: The WXT command being run (e.g., 'build', 'serve')

### Example
```typescript
"{{browser}}-mv{{manifestVersion}}"
```

### Default
`"{{browser}}-mv{{manifestVersion}}{{modeSuffix}}"`

### Type
`string`

### Source
packages/wxt/src/types.ts:69
```

--------------------------------

### Configuring Legacy Output Directory Behavior in WXT

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates how to revert to the previous WXT behavior of outputting all build modes to a single directory by setting the `outDirTemplate` option in `wxt.config.ts`. This is useful for maintaining existing build pipelines or workflows.

```typescript
export default defineConfig({
  outDirTemplate: '{{browser}}-mv{{manifestVersion}}',
});
```

--------------------------------

### IsolatedWorldContentScriptEntrypointOptions Interface

Source: https://wxt.dev/api/reference/wxt/interfaces/isolatedworldcontentscriptentrypointoptions

Configuration options for content scripts running in an isolated world.

```APIDOC
## Interface: IsolatedWorldContentScriptEntrypointOptions

### Description
Options for configuring content scripts, particularly those intended to run in an isolated world.

### Properties

#### allFrames
- **allFrames** (PerBrowserOption<undefined | boolean>) - Optional - Determines if the content script should be injected into all frames (including iframes). Defaults to `false`.

#### cssInjectionMode
- **cssInjectionMode** (PerBrowserOption<"manifest" | "manual" | "ui">) - Optional - Specifies how CSS is injected. Options are `"manifest"` (default), `"manual"`, or `"ui"`.

#### exclude
- **exclude** (string[]) - Optional - A list of target browsers to exclude this entrypoint from. Cannot be used with `include`.

#### excludeGlobs
- **excludeGlobs** (PerBrowserOption<undefined | string[]>) - Optional - Globs to exclude matching URLs.

#### excludeMatches
- **excludeMatches** (PerBrowserOption<undefined | string[]>) - Optional - Matches to exclude URLs from.

#### include
- **include** (string[]) - Optional - A list of target browsers to include this entrypoint in. Defaults to all builds. Cannot be used with `exclude`.

#### includeGlobs
- **includeGlobs** (PerBrowserOption<undefined | string[]>) - Optional - Globs to include matching URLs.

#### matchAboutBlank
- **matchAboutBlank** (PerBrowserOption<undefined | boolean>) - Optional - Whether to match the `about:blank` page. Defaults to `false`.

#### matchOriginAsFallback
- **matchOriginAsFallback** (PerBrowserOption<boolean>) - Optional - Whether to match the origin as a fallback. Defaults to `false`.

#### matches
- **matches** (PerBrowserOption<string[]>) - Optional - A list of URL patterns to match for injecting the content script.

#### registration
- **registration** (PerBrowserOption<"runtime" | "manifest">) - Optional - How the content script is registered. Can be `"manifest"` (default) or `"runtime"`.

#### runAt
- **runAt** (PerBrowserOption<undefined | RunAt>) - Optional - Specifies when the content script should run. Defaults to `"documentIdle"`.

### Extends
- `BaseContentScriptEntrypointOptions`

### Source
`packages/wxt/src/types.ts`
```

--------------------------------

### Configure WXT to Use Polyfill Module

Source: https://wxt.dev/guide/resources/upgrading

Adds the `@wxt-dev/webextension-polyfill` module to the WXT configuration. This tells WXT to use the new polyfill module, allowing continued use of the polyfill functionality.

```typescript
export default defineConfig({
  modules: ['@wxt-dev/webextension-polyfill'],
});
```

--------------------------------

### Default Root Directory in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Defines the default root directory of your project, which contains the `package.json`. This directory is used to populate the `manifest.json` file.

```typescript
process.cwd()
```

--------------------------------

### Create Vue.js Shadow Root UI in Content Script

Source: https://wxt.dev/guide/essentials/content-scripts

Creates a content script that mounts a Vue.js application within a ShadowRoot UI. It includes importing CSS and the Vue app component, setting `cssInjectionMode`, and handling the mounting and unmounting of the Vue app.

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

### Generate Declaration File for TypeScript Projects (TypeScript)

Source: https://wxt.dev/guide/essentials/wxt-modules

This TypeScript snippet illustrates how to generate a declaration file (`.d.ts`) for a WXT module, enabling global type declarations and type augmentation within the project. It uses WXT's `prepare:types` hook and requires the `wxt/modules` library and Node.js `path` module.

```typescript
import {
  defineWxtModule
} from 'wxt/modules';
import { resolve } from 'node:path';

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

### WXT Module: Generate Output File

Source: https://wxt.dev/guide/essentials/wxt-modules

Illustrates how a WXT module can generate files during the build process and make them accessible at runtime. It uses `build:publicAssets` to add the file and `build:manifestGenerated` to register it in the manifest.

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

### Configuring Vite with WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Allows returning custom Vite options from a function, which receives the `env` object. Note that `root`, `configFile`, and `mode` should be configured in WXT's config instead of Vite's. This approach is used because Vite plugins may need to be recreated for each build step.

```typescript
env => WxtViteConfig | Promise<WxtViteConfig>
```

--------------------------------

### Mocking #imports APIs in Vitest

Source: https://wxt.dev/blog/2024-12-06-using-imports-module

Shows how to mock APIs imported from the #imports module when writing tests using Vitest. It highlights the need to mock the real import path, not '#imports' itself, when using `vi.mock` to ensure correct mocking behavior.

```typescript
import { injectScript } from '#imports';
import { vi } from 'vitest';

vi.mock('wxt/utils/inject-script')
const injectScriptMock = vi.mocked(injectScript);

injectScriptMock.mockReturnValueOnce(...);
```

--------------------------------

### Configure WXT Zip Options (TypeScript)

Source: https://wxt.dev/guide/essentials/publishing

Customize the files included in the WXT zip archive using the `zip` configuration option in `wxt.config.ts`. This allows fine-grained control over the source code packaging for distribution.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  zip: {
    // ...
  },
});
```

--------------------------------

### Error.prepareStackTrace Static Method

Source: https://wxt.dev/api/reference/wxt/utils/storage/classes/migrationerror

Details the static `prepareStackTrace` method, inherited from the Error class. This method is used for customizing how stack traces are formatted. It takes an error object and an array of stack traces as arguments.

```javascript
Error.prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

--------------------------------

### WXT App Config with Environment Variables

Source: https://wxt.dev/guide/essentials/config/runtime

Illustrates using environment variables within the `app.config.ts` file to configure application settings like API keys and boolean flags. It shows how to declare types for these variables and parse them into appropriate types (string, boolean), providing a centralized way to manage configuration and defaults.

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

### Configure WXT Private Package Downloads (TypeScript)

Source: https://wxt.dev/guide/essentials/publishing

Specify private packages to be downloaded and included in the extension zip for Firefox using the `zip.downloadPackages` option in `wxt.config.ts`. This avoids exposing auth tokens during review.

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

### Load and Initialize WASM in Content Script

Source: https://wxt.dev/guide/essentials/assets

This content script loads and initializes the WASM module using its runtime URL obtained via `browser.runtime.getURL`. It then uses the `parseSync` function provided by the WASM module to parse TypeScript code into an Abstract Syntax Tree (AST).

```typescript
import initWasm, { parseSync } from '@oxc-parser/wasm';

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
    await initWasm({
      module_or_path: browser.runtime.getURL('/oxc_parser_wasm_bg.wasm'),
    });

    // Once loaded, we can use `parseSync`!
    const ast = parseSync(code, { sourceFilename });
    console.log(ast);
  },
});
```

--------------------------------

### Manage Storage Item Metadata (TypeScript)

Source: https://wxt.dev/storage

Demonstrates how to set, retrieve, and remove metadata associated with storage keys. Metadata properties are combined rather than overwritten when set multiple times.

```ts
await Promise.all([
  storage.setItem('local:preference', true),
  storage.setMeta('local:preference', { lastModified: Date.now() }),
]);

await storage.setMeta('local:preference', { v: 2 });

await storage.getMeta('local:preference'); // { v: 2, lastModified: 1703690746007 }

// Remove all metadata
await storage.removeMeta('local:preference');

// Remove specific properties
await storage.removeMeta('local:preference', 'lastModified');
await storage.removeMeta('local:preference', ['lastModified', 'v']);
```

--------------------------------

### Configure Manifest with Localized Name/Description (Vite/WXT)

Source: https://wxt.dev/guide/essentials/i18n

Configures the extension's manifest to use localized names and descriptions. The `name` and `description` properties in the manifest are set to reference the translation keys defined in the `messages.json` files, prefixed with `__MSG_`.

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

### MigrationError Constructor and Properties

Source: https://wxt.dev/api/reference/wxt/utils/storage/classes/migrationerror

Defines the constructor for MigrationError, which takes a key, version, and optional options. It also outlines the properties like 'cause', 'key', 'message', 'name', 'stack', and 'version', inherited or specific to this error class.

```typescript
new MigrationError(key: string, version: number, options?: ErrorOptions): MigrationError;

key: string;
version: number;
cause?: unknown;
message: string;
name: string;
stack?: string;
```

--------------------------------

### wxt/modules addEntrypoint

Source: https://wxt.dev/api/reference/wxt/modules/functions/addentrypoint

The addEntrypoint function allows you to add a TypeScript or JavaScript file as an entrypoint to your WXT project. This file will be bundled with other project entrypoints. It's recommended to pre-build entrypoints if publishing to NPM and use addPublicAssets instead for faster builds.

```APIDOC
## Function: addEntrypoint()

### Description
Adds a TS/JS file as an entrypoint to the project. This file will be bundled along with the other entrypoints.

If you're publishing the module to NPM, you should probably pre-build the entrypoint and use `addPublicAssets` instead to copy pre-bundled assets into the output directory. This will speed up project builds since it just has to copy some files instead of bundling them.

To extract entrypoint options from a JS/TS file, use `wxt.builder.importEntrypoint` (see example).

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
*   **wxt** (`Wxt`) - The wxt instance provided by the module's setup function.
*   **entrypoint** (`Entrypoint`) - The entrypoint to be bundled along with the extension.

### Request Example
```ts
export default defineWxtModule(async (wxt, options) => {
  const entrypointPath = "/path/to/my-entrypoint.ts";
  addEntrypoint(wxt, {
    type: "content-script",
    name: "some-name",
    inputPath: entrypointPath,
    outputDir: wxt.config.outDir,
    options: await wxt.builder.importEntrypoint(entrypointPath),
  });
});
```

### Response
#### Success Response (200)
This function returns `void`.

#### Response Example
```json
null
```
```

--------------------------------

### entrypoints:resolved Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `entrypoints:resolved` hook is invoked once all entrypoints have been loaded from the `entrypointsDir`. This hook allows for programmatic definition or modification of entrypoint options.

```APIDOC
## POST /hooks/entrypoints:resolved

### Description
Called once all entrypoints have been loaded from the `entrypointsDir`. Use `wxt.builder.importEntrypoint` to load entrypoint options from the file, or manually define them.

### Method
POST

### Endpoint
`/hooks/entrypoints:resolved`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.
- **entrypoints** (`Entrypoint[]`) - Required - The list of entrypoints to be built.

### Request Example
```json
{
  "wxt": { /* Wxt object */ },
  "entrypoints": [ /* Entrypoint objects */ ]
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### Import Extension API Types from wxt/browser

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates how to import extension API types using the new `wxt/browser` namespace. This replaces the older method of importing types from `@types/webextension-polyfill` and aligns with WXT's new `browser` object.

```typescript
import type { Runtime } from 'wxt/browser';
import type { Browser } from 'wxt/browser';

function getMessageSenderUrl(sender: Runtime.MessageSender): string {
  // ...
}

// Alternatively, using the Browser namespace:
function getMessageSenderUrl(sender: Browser.runtime.MessageSender): string {
  // ...
}
```

--------------------------------

### Configure vite-node SSR noExternal for WXT Entrypoints

Source: https://wxt.dev/guide/resources/upgrading

Configures the `vite.ssr.noExternal` option to include packages like `@webext-core/messaging` and `@webext-core/proxy-service`. This is necessary when using `vite-node` as the entrypoint loader and encountering issues with SSR compatibility for these packages.

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

### Integrate WXT Auto-imports with ESLint (v8)

Source: https://wxt.dev/guide/essentials/config/auto-imports

This JavaScript snippet shows how to integrate WXT's generated auto-import configurations into an ESLint v8 configuration file (`.eslintrc.mjs`). It extends the ESLint configuration to include the auto-import definitions.

```javascript
// .eslintrc.mjs
export default {
  extends: ['./.wxt/eslintrc-auto-import.json'],
  // The rest of your config...
};
```

--------------------------------

### targetBrowsers

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Define the target browsers for your extension. This can narrow down `import.meta.env.BROWSER` type.

```APIDOC
## targetBrowsers

### Description
Target browsers to support. When set, `import.meta.env.BROWSER` will be narrowed to a string literal type containing only the specified browser names.

### Default
```typescript
[]
```

### Type
`string[]`

### Source
packages/wxt/src/types.ts:116
```

--------------------------------

### Dynamically Mount UI to a Target Element

Source: https://wxt.dev/guide/essentials/content-scripts

Mounts a UI to a DOM element that may not exist on initial page load. Uses the `anchor` option to target the element and `autoMount` to manage its lifecycle, appending content when the element appears and cleaning up when it disappears. No external dependencies are required beyond the WXT framework.

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

### Explicitly Import WXT APIs

Source: https://wxt.dev/guide/essentials/config/auto-imports

This TypeScript snippet demonstrates how to manually import all of WXT's APIs using the special `#imports` module. This is useful when auto-imports are disabled or when you prefer explicit imports.

```typescript
import {
  createShadowRootUi,
  ContentScriptContext,
  MatchPattern,
} from '#imports';
```

--------------------------------

### Set Multiple Storage Items - TypeScript

Source: https://wxt.dev/storage

Demonstrates how to set multiple key-value pairs and defined storage items simultaneously using the `storage.setItems` method. This function takes an array of objects, each containing either a `key` and `value` or a defined `item` and its `value`. It's useful for batch updates to the application's storage.

```typescript
const userId = storage.defineItem('local:userId');

await storage.setItems([
  { key: 'local:installDate', value: Date.now() },
  { item: userId, value: generateUserId() },
]);
```

--------------------------------

### modulesDir

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Specify the directory for WXT modules.

```APIDOC
## modulesDir

### Description
Directory for WXT modules.

### Default
```typescript
"${config.root}/modules"
```

### Type
`string`

### Source
packages/wxt/src/types.ts:43
```

--------------------------------

### Default Source Directory in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Sets the default directory for all source code. If changed, remember to move the `public/` and `entrypoints/` directories into the new source directory to maintain project structure.

```typescript
config.root
```

--------------------------------

### WxtHooks Interface

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

This section details the various hooks available within the WxtHooks interface, which allow for customization at different stages of the WXT build process.

```APIDOC
## WxtHooks Interface

This interface provides various hooks to customize the WXT build and development process.

### Hooks

- **build:before**: Called before the build is started.
- **build:done**: Called once the build process has finished.
- **build:manifestGenerated**: Called once the manifest has been generated.
- **build:publicAssets**: Called when public assets are found.
- **config:resolved**: Called whenever config is loaded or reloaded.
- **entrypoints:found**: Called once the names and paths of all entrypoints have been resolved.
- **entrypoints:grouped**: Called once all entrypoints have been grouped into their build groups.
- **entrypoints:resolved**: Called once all entrypoints have been loaded from the `entrypointsDir`.
- **prepare:publicPaths**: Called before generating the list of public paths.
- **prepare:types**: Called before WXT writes `.wxt/tsconfig.json` and `.wxt/wxt.d.ts`.
- **ready**: Called when WXT is ready.
- **server:closed**: Called when the dev server is closed.
- **server:created**: Called when the dev server is created.
- **server:started**: Called when the dev server is started.
- **vite:build:extendConfig**: Called to extend the Vite build config.
- **vite:devServer:extendConfig**: Called to extend the Vite dev server config.
- **zip:done**: Called once the zip process is done.
- **zip:extension:done**: Called once the extension zip is done.
- **zip:extension:start**: Called once the extension zip starts.
- **zip:sources:done**: Called once the sources zip is done.
- **zip:sources:start**: Called once the sources zip starts.
- **zip:start**: Called once the zip starts.
```

--------------------------------

### Conditional API Access for MV2/MV3 Compatibility

Source: https://wxt.dev/guide/essentials/extension-apis

Provides a pattern for accessing similar APIs that might have different names across Manifest V2 and V3, such as `browser.action` and `browser.browser_action`. This ensures compatibility by checking for the existence of either API.

```typescript
(browser.action ?? browser.browser_action).onClicked.addListener(() => {
  //
});
```

--------------------------------

### WXT Package JSON Version to Manifest Version

Source: https://wxt.dev/guide/essentials/config/manifest

Demonstrates how WXT derives the 'version' and 'version_name' fields in the manifest.json from the 'version' field in package.json. 'version_name' is the exact string, while 'version' is cleaned of invalid suffixes.

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

### vite

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Return custom Vite options from a function. Note that `root`, `configFile`, and `mode` should be configured in WXT's config, not Vite's.

```APIDOC
## vite

### Description
Return custom Vite options from a function. See <https://vitejs.dev/config/shared-options.html> .
`root`, `configFile`, and `mode` should be set in WXT's config instead of Vite's.
This is a function because any vite plugins added need to be recreated for each individual build step, incase they have internal state causing them to fail when reused.

### Parameters

*   **env** (`ConfigEnv`)

### Type

(`env`) => `WxtViteConfig` | `Promise<WxtViteConfig>`

### Source

packages/wxt/src/types.ts:391
```

--------------------------------

### Default Output Directory in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Specifies the default output directory where build folders and ZIP archives will be stored. This configuration is essential for managing the project's build artifacts.

```typescript
".output"
```

--------------------------------

### Generate Runtime Module with Aliases and Auto-imports (TypeScript)

Source: https://wxt.dev/guide/essentials/wxt-modules

This code shows how to generate a runtime module within a WXT project, including setting up aliases for imports and enabling auto-imports for exported variables. It utilizes Node.js path resolution and WXT's module definition API. Dependencies include `wxt/modules` and Node.js `path` module.

```typescript
import {
  defineWxtModule
} from 'wxt/modules';
import { resolve } from 'node:path';

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

### Target Manifest Version (CLI)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Use the `--mv2` or `--mv3` CLI flags to specify the target manifest version for your WXT extension builds. The default behavior varies by browser.

```sh
wxt --mv2
wxt --mv3
```

--------------------------------

### Enable Main World Content Script Execution

Source: https://wxt.dev/guide/essentials/content-scripts

This snippet illustrates how to configure a content script to run in the 'MAIN' world, sharing all available context with the webpage. Note that this is only supported by Chromium browsers and not MV2. For broader compatibility, WXT recommends using the `injectScript` function.

```typescript
export default defineContentScript({
  world: 'MAIN',
});
```

--------------------------------

### Watch for Storage Changes

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Sets up a listener to watch for changes to a specific storage key. The callback function receives the new value (or null if removed).

```typescript
const unwatch = storage.watch<string>("local:username", (newValue) => {
  console.log(`Username changed to: ${newValue}`);
});

// To stop watching:
unwatch();
```

--------------------------------

### Create Edge Extension ZIP

Source: https://wxt.dev/guide/essentials/publishing

Generates a zip archive specifically for the Edge Addons store using the `wxt zip -b edge` command. This is useful for extensions with Edge-specific features.

```shell
wxt zip -b edge
```

--------------------------------

### Define Content Script with Return Value (TypeScript)

Source: https://wxt.dev/guide/essentials/scripting

This snippet shows how to define a content script that returns a value. The `main` function is exported and returns a string. This script can be executed by the `browser.scripting.executeScript` API, and its return value can be captured.

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

### Define Version 3 Storage Item with Multiple Migrations (TypeScript)

Source: https://wxt.dev/storage

Further upgrades the ignored websites storage item to version 3. It adds an `enabled` boolean property to the `IgnoredWebsiteV3` interface. This snippet includes migrations for both v1 to v2 and v2 to v3, demonstrating how to handle multiple schema evolution steps. The v2 to v3 migration ensures existing entries are enabled by default.

```typescript
import { nanoid } from 'nanoid';

type IgnoredWebsiteV1 = string;
interface IgnoredWebsiteV2 {
  id: string;
  website: string;
}
interface IgnoredWebsiteV3 {
  id: string;
  website: string;
  enabled: boolean;
}

export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV3[]>( 
  'local:ignoredWebsites',
  {
    fallback: [],
    version: 3, 
    migrations: {
      // Ran when migrating from v1 to v2
      2: (websites: IgnoredWebsiteV1[]): IgnoredWebsiteV2[] => {
        return websites.map((website) => ({ id: nanoid(), website }));
      },
      // Ran when migrating from v2 to v3
      3: (websites: IgnoredWebsiteV2[]): IgnoredWebsiteV3[] => {
        return websites.map((website) => ({ ...website, enabled: true })); 
      },
    },
  },
);

```

--------------------------------

### Default Public Directory in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Defines the default directory for public files that will be copied to the output directory without modification. Ensure assets like images and static files are placed here.

```typescript
"${config.root}/public"
```

--------------------------------

### Configure Data Persistence for @wxt-dev/runner Profiles

Source: https://wxt.dev/runner

Control how browser profile data is persisted between sessions using the `dataPersistence` option. Options include 'none' for a fresh profile each time, 'project' to reuse a profile for the current directory, and 'user' to reuse a profile across all projects.

```typescript
import {
  run
} from '@wxt-dev/runner';

await run({
  dataPersistence: 'user',
});
```

--------------------------------

### Update API Imports for Background and Content Scripts (TypeScript)

Source: https://wxt.dev/guide/resources/upgrading

The `defineBackground` and `defineContentScript` functions are now exported from `wxt/sandbox` instead of `wxt/client`. If you use auto-imports, no changes are needed. Otherwise, manually update your import statements.

```typescript
import { defineBackground, defineContentScript } from 'wxt/client'; 
import { defineBackground, defineContentScript } from 'wxt/sandbox';
```

--------------------------------

### Output Directory Structure Change

Source: https://wxt.dev/guide/resources/upgrading

For JS entrypoints in the output directory, the structure has been updated. Files previously in `chunks/` are now directly in the root of the target directory. This change primarily affects post-build processes that reference these files.

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

### Handle SPAs with URL Change Listener

Source: https://wxt.dev/guide/essentials/content-scripts

Addresses the challenge of running content scripts in SPAs by implementing a listener for the 'wxt:locationchange' event. This allows the script to detect URL changes without a full page reload and execute specific logic, like mounting a UI, when the new URL matches a defined pattern. It requires the WXT event system.

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
```

--------------------------------

### Import Storage in TypeScript (WXT)

Source: https://wxt.dev/storage

Demonstrates how to import the 'storage' object when using the WXT framework. If auto-imports are enabled, explicit import is not required.

```ts
import { storage } from '#imports';
```

--------------------------------

### Handling Assets in Content Scripts with WXT

Source: https://wxt.dev/guide/essentials/assets

Explains how to correctly access assets within content scripts in WXT. By default, imported assets provide only the path. To load them from the extension's origin, `browser.runtime.getURL` must be used.

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

### Define Version 2 Storage Item with Migration (TypeScript)

Source: https://wxt.dev/storage

Upgrades the ignored websites storage item to version 2. It introduces a new interface `IgnoredWebsiteV2` which includes an `id` and `website` property. A migration function is provided to transform data from the v1 schema (string) to the v2 schema (object), generating a unique ID for each website using `nanoid`.

```typescript
import { nanoid } from 'nanoid'; 

type IgnoredWebsiteV1 = string;
interface IgnoredWebsiteV2 {
  id: string; 
  website: string; 
}

export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV2[]>(
  'local:ignoredWebsites',
  {
    fallback: [],
    version: 2, 
    migrations: {
      // Ran when migrating from v1 to v2
      2: (websites: IgnoredWebsiteV1[]): IgnoredWebsiteV2[] => {
        return websites.map((website) => ({ id: nanoid(), website })); 
      },
    },
  },
);

```

--------------------------------

### Create i18n messages file (JSON)

Source: https://wxt.dev/i18n

Defines a localization message file in the standard JSON format for web extensions. This format is used when not integrating with the build process.

```json
{
  "helloWorld": {
    "message": "Hello world!"
  }
}
```

--------------------------------

### Content Script World Option

Source: https://wxt.dev/api/reference/wxt/interfaces/isolatedworldcontentscriptentrypointoptions

Configures the execution environment for content scripts, allowing them to run in an isolated world.

```APIDOC
## GET /websites/wxt_dev/content-script-world

### Description
This endpoint documentation describes the 'world' option for content scripts, which specifies the execution environment. It can be set to 'ISOLATED' to run the script in an isolated world, as detailed in Chrome's extension development documentation.

### Method
GET

### Endpoint
/websites/wxt_dev/content-script-world

### Parameters
#### Query Parameters
- **world** (string) - Optional - Specifies the execution world for the content script. Accepts 'ISOLATED'.

### Request Example
```json
{
  "world": "ISOLATED"
}
```

### Response
#### Success Response (200)
- **world** (string) - The configured execution world for content scripts.

#### Response Example
```json
{
  "world": "ISOLATED"
}
```
```

--------------------------------

### Access WXT App Config

Source: https://wxt.dev/guide/essentials/config/runtime

Shows how to retrieve the runtime configuration defined in `app.config.ts` using the `useAppConfig` function. This function returns an object containing all configured values, as demonstrated by logging the theme.

```typescript
import { useAppConfig } from '#imports';

console.log(useAppConfig()); // { theme: "dark" }
```

--------------------------------

### Base TypeScript Configuration (tsconfig.json)

Source: https://wxt.dev/guide/essentials/config/typescript

This is the minimal configuration required for your root tsconfig.json file. It extends the base tsconfig generated by WXT.

```jsonc
// <rootDir>/tsconfig.json
{
  "extends": ".wxt/tsconfig.json"
}
```

--------------------------------

### Create Locale Message Files

Source: https://wxt.dev/guide/essentials/i18n

Organizes translation files for different languages. Each language has a `messages.json` file located within its respective locale subfolder in the `public/_locales/` directory. This structure allows the browser to load the correct translations based on the user's locale.

```file structure
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

### MigrationError Class

Source: https://wxt.dev/api/reference/wxt/utils/storage/classes/migrationerror

Details about the MigrationError class, including its constructors, properties, and inherited members from the base Error class.

```APIDOC
## Class: MigrationError

### Description
Represents an error that occurs during data migration processes within the WXT storage utility.

### Extends
* `Error`

### Constructors
#### new MigrationError(key, version, options)
Creates a new instance of the MigrationError class.

##### Parameters
- **key** (`string`) - The storage key associated with the migration.
- **version** (`number`) - The version number related to the migration.
- **options** (`ErrorOptions`) - Optional configuration for the error.

### Properties
#### key
- **key** (`string`) - The storage key associated with the error.

#### version
- **version** (`number`) - The version number related to the error.

#### message
- **message** (`string`) - Inherited from `Error`. The error message.

#### name
- **name** (`string`) - Inherited from `Error`. The name of the error (typically 'MigrationError').

#### stack
- **stack** (`string`) - Inherited from `Error`. The stack trace of the error.

#### cause
- **cause** (`unknown`) - Inherited from `Error`. The underlying cause of the error.

### Static Properties
#### stackTraceLimit
- **`static` stackTraceLimit** (`number`) - Inherited from `Error`. Specifies the number of stack frames collected by a stack trace.

### Methods
#### captureStackTrace(targetObject, constructorOpt)
- **`static` captureStackTrace**(`targetObject`, `constructorOpt`?): `void`
Creates a `.stack` property on `targetObject`. (Inherited from `Error`).

#### isError(error)
- **`static` isError**(`error`): `error is Error`
Indicates whether the argument provided is a built-in Error instance or not. (Inherited from `Error`).

#### prepareStackTrace(err, stackTraces)
- **`static` prepareStackTrace**(`err`, `stackTraces`): `any`
Allows customization of stack trace formatting. (Inherited from `Error`).

### Source
`packages/storage/dist/index.d.mts:286`
```

--------------------------------

### Integrate WXT Auto-imports with ESLint (v9)

Source: https://wxt.dev/guide/essentials/config/auto-imports

This JavaScript snippet demonstrates how to integrate WXT's generated auto-import configurations into an ESLint v9 configuration file (`eslint.config.mjs`). It imports the generated file and includes it in the ESLint configuration array.

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

### publicDir

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Specify the directory containing files to be copied to the output directory.

```APIDOC
## publicDir

### Description
Directory containing files that will be copied to the output directory as-is.

### Default
```typescript
"${config.root}/public"
```

### Type
`string`

### Source
packages/wxt/src/types.ts:35
```

--------------------------------

### Add Versioning to Unversioned Item (TypeScript)

Source: https://wxt.dev/storage

Demonstrates how to add versioning to an existing storage item that was initially unversioned. It defines the item with `version: 2` and provides a migration function from the implied v1 schema (string array) to the new v2 schema (object with `id` and `website`). This allows for retroactive schema updates.

```typescript
import { nanoid } from 'nanoid'; 

// Retroactively add a type for the first version
type IgnoredWebsiteV1 = string; 
interface IgnoredWebsiteV2 {
  id: string; 
  website: string; 
}

export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV2[]>(
  'local:ignoredWebsites',
  {
    fallback: [],
    version: 2, 
    migrations: {
      // Ran when migrating from v1 to v2
      2: (websites: IgnoredWebsiteV1[]): IgnoredWebsiteV2[] => {
        return websites.map((website) => ({ id: nanoid(), website })); 
      },
    },
  },
);

```

--------------------------------

### build:done Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `build:done` hook is triggered after the build process has successfully completed. It allows modification of the build output, such as adding files to the summary.

```APIDOC
## POST /hooks/build:done

### Description
Called once the build process has finished. You can add files to the build summary here by pushing to `output.publicAssets`.

### Method
POST

### Endpoint
`/hooks/build:done`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.
- **output** (`Readonly<BuildOutput>`) - Required - The results of the build.

### Request Example
```json
{
  "wxt": { /* Wxt object */ },
  "output": { /* BuildOutput object */ }
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### defineBackground() - Callback Version

Source: https://wxt.dev/api/reference/wxt/utils/define-background/functions/definebackground

This version of defineBackground accepts a callback function to define background properties.

```APIDOC
## Function: defineBackground(main)

### Description
This overload of `defineBackground` accepts a callback function that returns void and is used to define background properties.

### Method
Utility Function

### Endpoint
N/A (Client-side utility)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
*   **main** (() => `void`) - Required - A callback function to define background properties.

### Request Example
```javascript
defineBackground(() => {
  // Define background properties here
});
```

### Response
#### Success Response
Returns a `BackgroundDefinition` object.

#### Response Example
```json
{
  "__WXT_BACKGROUND_DEFINITION__": true
}
```
```

--------------------------------

### Localize Extension Name and Description

Source: https://wxt.dev/guide/essentials/i18n

Allows for dynamic setting of the extension's name and description based on the user's locale. The `manifest` configuration references the translation keys defined in `messages.json` using the `__MSG_` prefix.

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

### GenericEntrypoint Interface

Source: https://wxt.dev/api/reference/wxt/interfaces/genericentrypoint

Details the properties and inherited members of the GenericEntrypoint interface.

```APIDOC
## Interface: GenericEntrypoint

### Description
Represents a general entrypoint in the WXT build process, extending `BaseEntrypoint`.

### Properties

*   **inputPath** (`string`) - Inherited from `BaseEntrypoint`. The absolute path to the entrypoint's input file.
*   **name** (`string`) - Inherited from `BaseEntrypoint`. The entrypoint's name, derived from its filename or directory name without the type suffix. Used for generating output filenames.
*   **options** (`ResolvedPerBrowserOptions<BaseEntrypointOptions, never>`) - Configuration options specific to different browsers for this entrypoint.
*   **outputDir** (`string`) - Inherited from `BaseEntrypoint`. The absolute path to the directory where the entrypoint's output will be placed.
*   **skipped** (`boolean`, optional) - If true, this entrypoint will not be built by WXT. This is typically set automatically based on configuration or entrypoint options.
*   **type** (`"unlisted-script"` | `"bookmarks"` | `"devtools"` | `"history"` | `"sandbox"` | `"newtab"` | `"unlisted-page"` | `"unlisted-style"` | `"content-script-style"`) - The type of the entrypoint, determining its role within the browser extension.

### Extends
*   `BaseEntrypoint`
```

--------------------------------

### Instantiate and Use MatchPattern Class

Source: https://wxt.dev/api/reference/wxt/utils/match-patterns/classes/matchpattern

Demonstrates how to create a MatchPattern instance and use its 'includes' method to check if a URL matches the pattern. The constructor parses a match pattern string and throws an error for invalid patterns. The 'includes' method takes a URL string, URL object, or Location object and returns a boolean indicating whether the URL is matched.

```typescript
const pattern = new MatchPattern("*://google.com/*");

pattern.includes("https://google.com");            // true
pattern.includes("http://youtube.com/watch?v=123") // false
```

--------------------------------

### Import UnoCSS Styles in Entrypoint

Source: https://wxt.dev/unocss

Imports the UnoCSS styles into your WXT extension's entrypoint file. This ensures that UnoCSS utility classes are available throughout your extension.

```ts
import 'virtual:uno.css';
```

--------------------------------

### Custom i18n Build Script in TypeScript

Source: https://wxt.dev/i18n

Provides a custom TypeScript script to pre-process localization files using @wxt-dev/i18n build utilities. This script parses message files, generates browser-compatible JSON files, and creates type definition files for type safety.

```typescript
// build-i18n.js
import {
  parseMessagesFile,
  generateChromeMessagesFile,
  generateTypeFile,
} from '@wxt-dev/i18n/build';

// Read your localization files
const messages = {
  en: await parseMessagesFile('path/locales/en.yml'),
  de: await parseMessagesFile('path/locales/de.yml'),
  // ...
};

// Generate JSON files for the extension
await generateChromeMessagesFile('dist/_locales/en/messages.json', messages.en);
await generateChromeMessagesFile('dist/_locales/de/messages.json', messages.de);
// ...

// Generate a types file based on your default_locale
await generateTypeFile('wxt-i18n-structure.d.ts', messages.en);
```

--------------------------------

### Create i18n messages file (WXT)

Source: https://wxt.dev/i18n

Defines a localization message file in YAML format for the default locale. This file will be processed by the WXT build system.

```yaml
# <srcDir>/locales/en.yml
helloWorld: Hello world!
```

--------------------------------

### mode

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Explicitly set the mode (e.g., development, production) for the build.

```APIDOC
## mode

### Description
Explicitly set a mode to run in. This will override the default mode for each command, and can be overridden by the command line `--mode` option.

### Type
`string`

### Source
packages/wxt/src/types.ts:88
```

--------------------------------

### WXT Manifest Permissions Configuration

Source: https://wxt.dev/guide/essentials/config/manifest

Configure the 'permissions' array in your 'wxt.config.ts' to specify the necessary permissions for your extension. Permissions like 'tabs' and 'scripting' are automatically added during development for hot reloading, and 'sidepanel' is added if a sidepanel entrypoint exists.

```typescript
export default defineConfig({
  manifest: {
    permissions: ['storage', 'tabs'],
  },
});
```

--------------------------------

### Injecting CSS into Content Scripts (Manifest V3 Style)

Source: https://wxt.dev/guide/essentials/content-scripts

Illustrates the traditional method in web extensions for including CSS files with content scripts by specifying them in the 'css' array within the 'content_scripts' property of the manifest.json file.

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

### Report Events with WXT Analytics

Source: https://wxt.dev/analytics

Demonstrates how to use the injected `#analytics` module in WXT to track events, page views, and identify users. Also shows how to enable automatic event tracking.

```typescript
import { analytics } from '#analytics';

await analytics.track('some-event');
await analytics.page();
await analytics.identify('some-user-id');
analytics.autoTrack(document.body);
```

--------------------------------

### Define Version 1 Storage Item (TypeScript)

Source: https://wxt.dev/storage

Defines a storage item for ignored websites with version 1. It stores an array of strings, with an empty array as the fallback value. This serves as the initial schema for the data.

```typescript
type IgnoredWebsiteV1 = string;

export const ignoredWebsites = storage.defineItem<IgnoredWebsiteV1[]>(
  'local:ignoredWebsites',
  {
    fallback: [],
    version: 1,
  },
);

```

--------------------------------

### Update WXT for Minor/Patch Versions

Source: https://wxt.dev/guide/resources/upgrading

Updates WXT to the latest version for minor or patch releases. This command does not require special steps and can be run directly using the package manager.

```shell
pnpm i wxt@latest
```

--------------------------------

### Error.prepareStackTrace Method

Source: https://wxt.dev/api/reference/wxt/utils/match-patterns/classes/invalidmatchpattern

A static method that allows customization of how stack traces are formatted. It receives the error object and an array of stack trace call sites, and should return the formatted stack trace string. This is an advanced feature for V8 environments.

```typescript
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any
```

--------------------------------

### defineBackground() - Definition Object Version

Source: https://wxt.dev/api/reference/wxt/utils/define-background/functions/definebackground

This version of defineBackground accepts a BackgroundDefinition object directly.

```APIDOC
## Function: defineBackground(definition)

### Description
This overload of `defineBackground` accepts a `BackgroundDefinition` object directly to configure background properties.

### Method
Utility Function

### Endpoint
N/A (Client-side utility)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
*   **definition** (`BackgroundDefinition`) - Required - An object containing the background definition.

### Request Example
```javascript
const myBackgroundDefinition = {
  // ... properties of BackgroundDefinition
};
defineBackground(myBackgroundDefinition);
```

### Response
#### Success Response
Returns a `BackgroundDefinition` object.

#### Response Example
```json
{
  "__WXT_BACKGROUND_DEFINITION__": true
}
```
```

--------------------------------

### Configure Storage Permission in wxt.config.ts

Source: https://wxt.dev/storage

Specifies how to add the 'storage' permission to the WXT manifest file using the wxt.config.ts configuration.

```ts
export default defineConfig({
  manifest: {
    permissions: ['storage'],
  },
});
```

--------------------------------

### WXT Configuration for i18n Module in TypeScript

Source: https://wxt.dev/i18n

Shows how to integrate the @wxt-dev/i18n module into a WXT project by adding it to the `wxt.config.ts` file. This enables automatic type generation and build process integration for localization files.

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/i18n/module'],
});
```

--------------------------------

### Automatic CSS Injection via Import in WXT Content Scripts

Source: https://wxt.dev/guide/essentials/content-scripts

Demonstrates WXT's approach to injecting CSS into content scripts by simply importing the CSS file directly into the JavaScript entrypoint. WXT automatically bundles and adds the CSS to the manifest's 'css' array.

```typescript
// entrypoints/example.content/index.ts
import './style.css';

export default defineContentScript({
  // ...
});
```

--------------------------------

### Creating Standalone CSS Content Scripts with Manifest Hook

Source: https://wxt.dev/guide/essentials/content-scripts

Explains how to create a content script that exclusively includes CSS. This involves creating a CSS file and using the 'build:manifestGenerated' hook in 'wxt.config.ts' to manually add the content script entry to the generated manifest.

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

### ContentScriptUi Interface

Source: https://wxt.dev/api/reference/wxt/utils/content-script-ui/types/interfaces/contentscriptui

The ContentScriptUi interface offers functions to control the lifecycle of a UI element within a content script. It includes methods for mounting, unmounting, and automatically managing the UI's presence based on anchor element changes.

```APIDOC
## Interface: ContentScriptUi<TMounted>

### Description
The `ContentScriptUi` interface provides methods to manage the mounting and unmounting of UI elements within a content script. It also offers an `autoMount` option for dynamic UI management.

### Type Parameters

* **TMounted**
  * Represents the type of the `mounted` property.

### Properties

#### `autoMount`

*   **Type**: `(options?: AutoMountOptions) => void`
*   **Description**: Calls `ui.autoMount()` to automatically mount and remove the UI as the anchor is dynamically added or removed by the webpage. This is inherited from `MountFunctions`.
*   **Parameters**: `options?` (`AutoMountOptions`) - Optional configuration for auto-mounting.
*   **Source**: `packages/wxt/src/utils/content-script-ui/types.ts:117`

#### `mount`

*   **Type**: `() => void`
*   **Description**: Function that mounts or remounts the UI on the page. This is inherited from `MountFunctions`.
*   **Source**: `packages/wxt/src/utils/content-script-ui/types.ts:105`

#### `mounted`

*   **Type**: `undefined | TMounted`
*   **Description**: A property that indicates whether the UI is mounted and holds the mounted value or `undefined` if not mounted.
*   **Source**: `packages/wxt/src/utils/content-script-ui/types.ts:4`

#### `remove`

*   **Type**: `() => void`
*   **Description**: Function that removes the UI from the webpage. This is inherited from `MountFunctions`.
*   **Source**: `packages/wxt/src/utils/content-script-ui/types.ts:110`

### Extends

*   `MountFunctions`
```

--------------------------------

### Error.captureStackTrace Static Method

Source: https://wxt.dev/api/reference/wxt/utils/storage/classes/migrationerror

Demonstrates the static `captureStackTrace` method, inherited from the Error class. This method creates a `.stack` property on a target object, useful for capturing stack traces without throwing an error, with an option to omit frames above a constructor.

```javascript
Error.captureStackTrace(targetObject, constructorOpt?): void;

// Example:
const myObject = {};
Error.captureStackTrace(myObject);
console.log(myObject.stack); // Similar to new Error().stack

// Example with constructorOpt:
function a() {
  b();
}
function b() {
  c();
}
function c() {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;
  Error.captureStackTrace(error, b);
  throw error;
}
a();
```

--------------------------------

### build:manifestGenerated Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `build:manifestGenerated` hook is called after the `manifest.json` file has been generated. This allows for modification of the manifest before it is written to the output directory.

```APIDOC
## POST /hooks/build:manifestGenerated

### Description
Called once the manifest has been generated. Used to transform the manifest by reference before it is written to the output directory.

### Method
POST

### Endpoint
`/hooks/build:manifestGenerated`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.
- **manifest** (`Manifest`) - Required - The manifest that was generated.

### Request Example
```json
{
  "wxt": { /* Wxt object */ },
  "manifest": { /* Manifest object */ }
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### Define App Configuration (TypeScript)

Source: https://wxt.dev/api/reference/wxt/utils/define-app-config/functions/defineappconfig

Defines the runtime application configuration using the `defineAppConfig` function. It also demonstrates how to extend the `WxtAppConfig` interface to add custom fields like 'analytics' via module augmentation in `app.config.ts`.

```typescript
import 'wxt/utils/define-app-config';

declare module "wxt/utils/define-app-config" {
  export interface WxtAppConfig {
    analytics: AnalyticsConfig
  }
}
```

--------------------------------

### Verbose Key Format in JSON and TypeScript

Source: https://wxt.dev/i18n

Illustrates the verbose key format for localization messages compatible with browser.i18n, using JSON for message definitions and TypeScript for accessing them. It highlights which keys are considered 'verbose' and how to use the `i18n.t` function.

```json
{
  "appName": {
    "message": "GitHub - Better Line Counts",
    "description": "The app's name, should not be translated"
  },
  "ok": "OK",
  "deleteConfirmation": {
    "title": "Delete XYZ?",
    "message": "You cannot undo this action once taken."
  }
}
```

```typescript
i18n.t('appName'); // ✅ "GitHub - Better Line Counts"
i18n.t('appName.message'); // ❌
i18n.t('ok'); // ✅ "OK"
i18n.t('deleteConfirmation'); // ❌
i18n.t('deleteConfirmation.title'); // ✅ "Delete XYZ?"
i18n.t('deleteConfirmation.message'); // ✅ "You cannot undo this action once taken."
```

--------------------------------

### Define message substitutions

Source: https://wxt.dev/i18n

Illustrates how to define placeholders in translation strings using `$1` to `$9`. These placeholders can be replaced with dynamic values during runtime.

```yaml
hello: Hello $1!
order: Thanks for ordering your $1
```

--------------------------------

### Configuring Custom srcDir in WXT

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates how to update the WXT configuration file (wxt.config.ts) to point to custom locations for 'public' and 'modules' directories when a custom 'srcDir' is used. This ensures WXT can locate these essential project assets.

```typescript
export default defineConfig({
  srcDir: 'src',
  publicDir: 'src/public',
  modulesDir: 'src/modules',
});
```

--------------------------------

### Using Environment Variables in Runtime - TypeScript

Source: https://wxt.dev/guide/essentials/config/environment-variables

Demonstrates how to access environment variables, such as an API key, within runtime code using `import.meta.env`. Ensure variables are prefixed with `WXT_` or `VITE_` for them to be available.

```typescript
await fetch(`/some-api?apiKey=${import.meta.env.WXT_API_KEY}`);
```

--------------------------------

### Report Events with Standalone Analytics Instance

Source: https://wxt.dev/analytics

Shows how to use a custom analytics instance to track events, page views, and identify users when not integrated with the WXT framework.

```typescript
import { analytics } from './utils/analytics';

await analytics.track('some-event');
await analytics.page();
await analytics.identify('some-user-id');
analytics.autoTrack(document.body);
```

--------------------------------

### Create and use i18n object (without WXT)

Source: https://wxt.dev/i18n

Creates and exports an `i18n` instance using `createI18n` from @wxt-dev/i18n. This instance is then used to access translations.

```typescript
import { createI18n } from '@wxt-dev/i18n';

export const i18n = createI18n();

i18n.t('helloWorld'); // "Hello world!";
```

--------------------------------

### Accessing Manifest Mode in Configuration - TypeScript

Source: https://wxt.dev/guide/essentials/config/environment-variables

Illustrates how to access the current mode (e.g., 'development') within the manifest configuration function. This allows for conditional logic based on the build environment, which is crucial since Vite's runtime environment variables are not available here.

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

### Configure Custom Modules Directory in WXT

Source: https://wxt.dev/guide/resources/upgrading

Demonstrates how to specify a custom directory for WXT modules using the `modulesDir` option in `wxt.config.ts`. This allows users to organize their modules in a location other than the default `modules/` directory, preventing conflicts if they have existing directories with similar names.

```typescript
export default defineConfig({
  modulesDir: 'wxt-modules', // defaults to "modules"
});
```

--------------------------------

### imports

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Customize auto-import options or disable auto-imports entirely.

```APIDOC
## imports

### Description
Customize auto-import options. Set to `false` to disable auto-imports.
For example, to add a directory to auto-import from, you can use:
```typescript
export default defineConfig({
  imports: {
    dirs: ["some-directory"]
  }
})
```

### Type
`false | WxtUnimportOptions`

### Source
packages/wxt/src/types.ts:102
```

--------------------------------

### manifestVersion

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Explicitly set the target manifest version for your extension.

```APIDOC
## manifestVersion

### Description
Explicitly set a manifest version to target. This will override the default manifest version for each command, and can be overridden by the command line `--mv2` or `--mv3` option.

### Type
`TargetManifestVersion`

### Source
packages/wxt/src/types.ts:121
```

--------------------------------

### build:publicAssets Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `build:publicAssets` hook is invoked when public assets are discovered during the build process. It allows modification of the list of public files.

```APIDOC
## POST /hooks/build:publicAssets

### Description
Called when public assets are found. You can modify the `files` list by reference to add or remove public files.

### Method
POST

### Endpoint
`/hooks/build:publicAssets`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.
- **files** (`ResolvedPublicFile[]`) - Required - The list of public files found.

### Request Example
```json
{
  "wxt": { /* Wxt object */ },
  "files": [ /* ResolvedPublicFile objects */ ]
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### Nested keys for translations

Source: https://wxt.dev/i18n

Demonstrates how to define and access nested translation keys using dot notation. This allows for better organization of localization strings.

```yaml
ok: OK
cancel: Cancel
welcome:
  title: Welcome to XYZ
dialogs:
  confirmation:
    title: 'Are you sure?'
```

--------------------------------

### WXT Auto-Discovered Icon Filename Regex

Source: https://wxt.dev/guide/essentials/config/manifest

Regular expressions used by WXT to automatically discover icon files in the 'public/' directory. Files matching these patterns will be included as extension icons.

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

### Import Google Analytics using URL prefix in TypeScript

Source: https://wxt.dev/guide/essentials/remote-code

This snippet demonstrates how to import Google Analytics using the 'url:' prefix in TypeScript. This ensures the script is bundled with the extension, satisfying MV3 requirements. It sets up the global gtag function and initializes Google Analytics with a provided ID.

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

```typescript
// popup/main.ts
import '~/utils/google-analytics';

gtag('event', 'event_name', {
  key: 'value',
});

```

--------------------------------

### Accessing Build Mode at Runtime in WXT

Source: https://wxt.dev/guide/essentials/config/build-mode

Shows how to retrieve and utilize the current build mode within your WXT extension code at runtime using `import.meta.env.MODE`. This is useful for applying conditional logic based on the build environment.

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

### WXT Manifest Host Permissions Configuration

Source: https://wxt.dev/guide/essentials/config/manifest

Specify 'host_permissions' in your 'wxt.config.ts' to grant your extension access to specific URLs. Ensure that host permissions are correctly defined for both MV2 and MV3 if targeting both, as requirements may differ.

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

### Create Analytics Instance Without WXT

Source: https://wxt.dev/analytics

Creates a standalone analytics instance using `createAnalytics` from the WXT analytics package. This is useful when not using the full WXT framework.

```typescript
// utils/analytics.ts
import { createAnalytics } from '@wxt-dev/analytics';

export const analytics = createAnalytics({
  providers: [
    // ...
  ],
});
```

--------------------------------

### Type-Safe i18n Creation in TypeScript

Source: https://wxt.dev/i18n

Demonstrates how to achieve type safety for i18n functions by importing the generated type definition file (`wxt-i18n-structure.d.ts`) and passing it to the `createI18n` function in TypeScript.

```typescript
import type { WxtI18nStructure } from './wxt-i18n-structure';

export const i18n = createI18n<WxtI18nStructure>();
```

--------------------------------

### Plural Forms Translation in TypeScript

Source: https://wxt.dev/i18n

Demonstrates how to handle different plural forms of translations based on a given count in TypeScript. It shows how to define plural rules in YAML and use the `i18n.t` function with a count and optional custom substitutions.

```typescript
i18n.t('items', 0); // "0 items"
i18n.t('items', 1); // "1 item"
i18n.t('items', 2); // "2 items"

i18n.t('items', 0); // "No items"
i18n.t('items', 1); // "1 item"
i18n.t('items', 2); // "2 items"

i18n.t('items', 0, ['Zero']); // "No items"
i18n.t('items', 1, ['One']); // "One item"
i18n.t('items', 2, ['Multiple']); // "Multiple items"
```

--------------------------------

### Enable ESM Bundling for HTML Pages in WXT

Source: https://wxt.dev/guide/essentials/es-modules

Configure HTML pages in WXT to bundle JavaScript as ESM. This requires adding `type="module"` to your script tags. Vite only supports bundling JS from HTML pages as ESM.

```html
<script src="./main.ts"></script> 
<script src="./main.ts" type="module"></script> 
```

--------------------------------

### Configure WASM in WXT Manifest for Web Access

Source: https://wxt.dev/guide/essentials/assets

This configuration adds the WASM file to the `web_accessible_resources` in the extension's manifest. This allows content scripts to fetch and load the WASM file over the network by specifying matching URLs and the resource path.

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

### Permissions and Web Accessible Resources Types

Source: https://wxt.dev/api/reference/wxt/type-aliases/usermanifest

Defines the types for 'permissions' and 'web_accessible_resources'. Permissions can be strings or specific types, while web accessible resources can be an array of strings or conform to Manifest V3's definition. This allows for flexible resource and permission management.

```typescript
permissions?: (Browser.runtime.ManifestPermissions | string & Record<never, never>)[]

web_accessible_resources?: string[] | Browser.runtime.ManifestV3["web_accessible_resources"]
```

--------------------------------

### Add Public Assets using addPublicAssets() in TypeScript

Source: https://wxt.dev/api/reference/wxt/modules/functions/addpublicassets

Copies files from a specified directory into the extension's output directory. The directory itself is not copied, only its contents. Existing files with matching names are ignored. This function is useful for including assets like images or manifest files that should be directly accessible in the extension.

```typescript
export default defineWxtModule((wxt, options) => {
  addPublicAssets(wxt, "./dist/prebundled");
});
```

--------------------------------

### Create Integrated Content Script UI (TypeScript)

Source: https://wxt.dev/api/reference/wxt/utils/content-script-ui/integrated/functions/createintegratedui

Creates a content script UI without any isolation using the provided context and options. This function is part of the wxt library and is useful for direct DOM manipulation from content scripts.

```typescript
import type { ContentScriptContext, IntegratedContentScriptUi } from 'wxt';

interface IntegratedContentScriptUiOptions<TMounted> {
  // Options for integrated UI
}

function createIntegratedUi<TMounted>(ctx: ContentScriptContext, options: IntegratedContentScriptUiOptions<TMounted>): IntegratedContentScriptUi<TMounted> {
  // Implementation details
  console.log('Creating integrated UI with context:', ctx, 'and options:', options);
  // Placeholder return, actual implementation would create and return the UI instance
  return {} as IntegratedContentScriptUi<TMounted>;
}
```

--------------------------------

### Custom Framework Configuration for i18n Ally in VS Code

Source: https://wxt.dev/i18n

Shows how to configure the I18n Ally extension in VS Code by defining language IDs and a usage match regex in a `.vscode/i18n-ally-custom-framework.yml` file. This helps the extension identify translation keys in TypeScript files.

```yaml
# An array of strings which contain Language Ids defined by VS Code
# You can check available language ids here: https://code.visualstudio.com/docs/languages/identifiers
languageIds:
  - typescript
  - typescriptreact

# Look for t("...")
usageMatchRegex:
  - "[^\w\d]t\(['\"]({key})['\"]"

```

--------------------------------

### WxtBuilderServer: Transform HTML (TypeScript)

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtbuilderserver

Demonstrates the transformHtml() method of the WxtBuilderServer interface, which is used to modify HTML content during development. It takes the URL, HTML content, and an optional original URL as input and returns the transformed HTML as a string.

```typescript
const transformedHtml = await server.transformHtml(url, html, originalUrl);

```

--------------------------------

### Configure WXT Auto Icons Module

Source: https://wxt.dev/auto-icons

Adds the WXT Auto Icons module to your WXT configuration file (`wxt.config.ts`). This enables the automatic icon generation functionality within your WXT project.

```ts
export default defineConfig({
  modules: ['@wxt-dev/auto-icons'],
});
```

--------------------------------

### Set Multiple Items in Storage

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Sets multiple key-value pairs in storage simultaneously. If a value is null or undefined, the corresponding key is removed.

```typescript
await storage.setItems([
  { key: "local:installDate", value: Date.now() },
  { key: "session:someCounter", value: 5 },
]);
```

--------------------------------

### Define Storage Item with Fallback Default Value (TypeScript)

Source: https://wxt.dev/storage

Shows how to use the `fallback` option in `storage.defineItem` to provide default values for storage items. If a value is missing when `getValue` is called, the `fallback` value will be returned instead of `null`. This is useful for optional settings like theme preference or feature flags.

```typescript
const theme = storage.defineItem('local:theme', {
  fallback: 'dark',
});
const allowEditing = storage.defineItem('local:allow-editing', {
  fallback: true,
});

```

--------------------------------

### WxtPackageManager: Add Dependency

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtpackagemanager

Adds a specified dependency to the project. This function can add single or multiple dependencies.

```APIDOC
## POST /api/wxt/packages/addDependency

### Description
Adds a dependency to the project.

### Method
POST

### Endpoint
/api/wxt/packages/addDependency

### Parameters
#### Request Body
- **name** (string | string[]) - Required - Name of the dependency to add.
- **options** (object) - Optional - Options to pass to the API call.
  - **dev** (boolean) - Optional - Whether to add as a dev dependency.
  - **cwd** (string) - Optional - The current working directory.
  - **workspace** (string) - Optional - The workspace to operate in.

### Request Example
```json
{
  "name": "react",
  "options": {
    "dev": false
  }
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the operation was successful.
- **message** (string) - A message describing the result of the operation.

#### Response Example
```json
{
  "success": true,
  "message": "Dependency 'react' added successfully."
}
```
```

--------------------------------

### Default Target Browsers in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Specifies the default target browsers for the extension. When set, `import.meta.env.BROWSER` will be narrowed to a string literal type containing only the specified browser names, aiding in browser-specific development.

```typescript
[]
```

--------------------------------

### WxtBuilderServer: Send WebSocket Messages (TypeScript)

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtbuilderserver

Demonstrates how to send messages using the ws.send() method of the WxtBuilderServer. This is used to communicate with the extension, for instance, to trigger reloads.

```typescript
ws.send("wxt:reload-extension");
ws.send("wxt:reload-content-script", { ... });
```

--------------------------------

### Configure i18n-ally Locale Paths and Key Style in VS Code

Source: https://wxt.dev/i18n

This JSON configuration sets the directory for locale files and the preferred key-value nesting style for the i18n-ally extension within VS Code. It helps organize translation files and ensures consistent formatting.

```json
{
  "i18n-ally.localesPaths": ["src/locales"],
  "i18n-ally.keystyle": "nested"
}
```

--------------------------------

### Set Metadata for Multiple Storage Items

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Sets metadata for multiple storage items in a single operation. Each item in the array should contain the key and its metadata properties.

```typescript
await storage.setMetas([
  { key: "local:installDate", properties: { appVersion } },
  { key: "session:user", properties: { lastLogin: Date.now() } },
]);
```

--------------------------------

### Detect Browser at Runtime (TypeScript)

Source: https://wxt.dev/guide/essentials/target-different-browsers

WXT provides built-in environment variables to detect the target browser at runtime. This allows for conditional logic within your extension's code. 'import.meta.env.BROWSER' and 'import.meta.env.FIREFOX' can be used.

```ts
if (import.meta.env.BROWSER === 'firefox') {
  console.log('Do something only in Firefox builds');
}
if (import.meta.env.FIREFOX) {
  // Shorthand, equivalent to the if-statement above
}
```

--------------------------------

### Configure WXT Auto-imports with unimport

Source: https://wxt.dev/guide/essentials/config/auto-imports

Configure WXT's auto-import settings using the 'unimport' package. This snippet shows the basic structure for customizing import behavior within the WXT configuration file.

```typescript
export default defineConfig({
  // See https://www.npmjs.com/package/unimport#configurations
  imports: {
    // ...
  },
});
```

--------------------------------

### Specify Browser Target in @wxt-dev/runner

Source: https://wxt.dev/runner

Configure the specific browser to be launched by the @wxt-dev/runner. Use the `target` option within the `run` function. Defaults to 'chrome', but can be set to 'firefox' or other compatible browser strings.

```typescript
import {
  run
} from '@wxt-dev/runner';

await run({
  extensionDir: 'path/to/extension',
  target: 'firefox',
});
```

--------------------------------

### Add Public Paths to WXT Build

Source: https://wxt.dev/api/reference/wxt/interfaces/wxthooks

This hook allows you to add custom paths to be recognized as public assets during the WXT build process. These paths are relative to the output directory and can be used with `browser.runtime.getURL`.

```typescript
wxt.hooks.hook('prepare:publicPaths', (wxt, paths) => {
  paths.push('/icons/128.png');
})
```

--------------------------------

### Set Metadata for Storage Item

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Sets metadata properties for a given storage item. Existing properties not included in the new set will be preserved.

```typescript
await storage.setMeta("local:installDate", { appVersion });
```

--------------------------------

### WebExtConfig: chromiumPref Default

Source: https://wxt.dev/api/reference/wxt/interfaces/webextconfig

Default Chromium preferences for enabling dev mode and allowing content script sourcemaps. This shows the built-in configuration for developer-focused features.

```typescript
{
  devtools: {
    synced_preferences_sync_disabled: {
      skipContentScripts: false,
    },
  },
  extensions: {
    ui: {
      developer_mode: true,
    },
  },
}
```

--------------------------------

### WxtBuilderServer: Close Server (TypeScript)

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtbuilderserver

Shows the usage of the close() method on the WxtBuilderServer interface to gracefully stop the development server. This method returns a Promise that resolves when the server is stopped.

```typescript
await server.close();
```

--------------------------------

### Enable ESLint Auto-imports for WXT (v9)

Source: https://wxt.dev/guide/essentials/config/auto-imports

This TypeScript snippet configures WXT to generate ESLint auto-import configurations for ESLint version 9. It enables the 'eslintrc' option to integrate seamlessly with ESLint's new configuration system.

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

### Disable Automatic Browser Opening

Source: https://wxt.dev/guide/essentials/config/browser-startup

This configuration snippet disables the default behavior of WXT automatically opening a browser window when the `dev` script is run. Setting the `disabled` option to `true` allows developers to manually load the extension into their browser. This is useful for workflows where manual control over browser loading is preferred.

```typescript
export default defineWebExtConfig({
  disabled: true,
});
```

--------------------------------

### config:resolved Hook

Source: https://wxt.dev/api/reference/wxt/interfaces/WxtHooks

The `config:resolved` hook is called whenever the WXT configuration is loaded or reloaded. This hook allows modification of the configuration settings.

```APIDOC
## POST /hooks/config:resolved

### Description
Called whenever config is loaded or reloaded. Use this hook to modify config by modifying `wxt.config`.

### Method
POST

### Endpoint
`/hooks/config:resolved`

### Parameters
#### Request Body
- **wxt** (`Wxt`) - Required - The configured WXT object.

### Request Example
```json
{
  "wxt": { /* Wxt object */ }
}
```

### Response
#### Success Response (200)
- **result** (`HookResult`) - The result of the hook execution.

#### Response Example
```json
{
  "result": "ok"
}
```
```

--------------------------------

### Configure Global Manifest Options in WXT

Source: https://wxt.dev/guide/essentials/config/manifest

Define global manifest properties by using the 'manifest' config in your 'wxt.config.ts' file. This allows you to set static manifest properties. You can also define it as a function to dynamically generate manifest properties based on browser, manifest version, mode, and command.

```typescript
import { defineConfig } from 'wxt/core';

export default defineConfig({
  manifest: {
    // Put manual changes here
  },
});
```

```typescript
import { defineConfig } from 'wxt/core';

export default defineConfig({
  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {
      // ...
    };
  },
});
```

--------------------------------

### WxtDirTypeReferenceEntry Interface

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtdirtypereferenceentry

Represents a type reference to a node module to be added to the `.wxt/wxt.d.ts` file. It has a 'module' property that specifies the module name for the reference directive.

```APIDOC
## Interface: WxtDirTypeReferenceEntry

### Description
Represents type reference to a node module to be added to `.wxt/wxt.d.ts` file.

### Properties
#### module
- **module** (`string`) - Specifies the module name that will be used in the `/// <reference types="..." />` directive. This value will be added to the `.wxt/wxt.d.ts` file to include type definitions from the specified module.

### Source
`packages/wxt/src/types.ts:1592`
```

--------------------------------

### Configure Vite Build Settings in WXT

Source: https://wxt.dev/guide/essentials/config/vite

This snippet demonstrates how to override Vite's build configuration within the `wxt.config.ts` file. It uses the `defineConfig` function from 'wxt' and allows custom Vite options to be returned from the `vite` function.

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

### logger

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Override the default logger used by WXT.

```APIDOC
## logger

### Description
Override the logger used.

### Default
```typescript
consola
```

### Type
`Logger`

### Source
packages/wxt/src/types.ts:128
```

--------------------------------

### Accessing Extension API Types in TypeScript

Source: https://wxt.dev/guide/essentials/extension-apis

Illustrates how to import and utilize type definitions for extension APIs provided by WXT under the `Browser` namespace. This enables strong typing for API arguments, such as the `sender` object in message handling.

```typescript
import { type Browser } from 'wxt/browser';

function handleMessage(message: any, sender: Browser.runtime.MessageSender) {
  // ...
}
```

--------------------------------

### Update defineItem for Versioning with Default Value (TypeScript)

Source: https://wxt.dev/guide/resources/upgrading

When using `defineItem` with versioning, the `defaultValue` option is now required. Update your type parameters and include `defaultValue: null` in the options. If the second options argument is excluded, the item will default to nullable.

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

### Configure i18n module in WXT

Source: https://wxt.dev/i18n

Shows how to configure the @wxt-dev/i18n module within the WXT configuration file. The `i18n` property allows for customization of the i18n module's behavior.

```typescript
export default defineConfig({
  modules: ['@wxt-dev/i18n'],
  i18n: {
    // ...
  },
});
```

--------------------------------

### Enable ESLint Auto-imports for WXT (v8)

Source: https://wxt.dev/guide/essentials/config/auto-imports

This TypeScript snippet configures WXT to generate ESLint auto-import configurations for ESLint version 8. It enables the 'eslintrc' option to integrate with ESLint's older configuration system.

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

### Customize Auto-Imports with WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Allows customization of auto-import options for WXT projects. You can specify directories to auto-import from or disable auto-imports entirely by setting the value to false. This can improve development efficiency by reducing boilerplate code.

```typescript
export default defineConfig({
  imports: {
    dirs: ["some-directory"]
  }
})
```

--------------------------------

### Custom TypeScript Compiler Options

Source: https://wxt.dev/guide/essentials/config/typescript

Add custom compiler options to your root tsconfig.json file. These options will be merged with the base WXT configuration.

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

### Initialize Analytics Listener in Background Script

Source: https://wxt.dev/analytics

Initializes the analytics message listener in the background script when using WXT Analytics without the WXT framework.

```typescript
// background.ts
import './utils/analytics';
```

--------------------------------

### Constructor for InvalidMatchPattern

Source: https://wxt.dev/api/reference/wxt/utils/match-patterns/classes/invalidmatchpattern

Initializes a new instance of the InvalidMatchPattern class. It takes the invalid match pattern string and a reason for the invalidity as arguments. This constructor is inherited from the base Error class.

```typescript
new InvalidMatchPattern(matchPattern: string, reason: string): InvalidMatchPattern
```

--------------------------------

### Page Action Configuration Type (Manifest V2)

Source: https://wxt.dev/api/reference/wxt/type-aliases/usermanifest

Defines the type for the 'page_action' property, compatible with Manifest V2. It includes the 'browser_style' option to control the visual presentation of the page action.

```typescript
page_action?: Browser.runtime.ManifestV2["page_action"] & object

  browser_style?: boolean
```

--------------------------------

### Conditionally Add Vite Plugin Based on Mode

Source: https://wxt.dev/guide/essentials/config/vite

This snippet illustrates how to conditionally include a Vite plugin based on the build mode. It uses the `configEnv.mode` to determine whether to add `vite-plugin-remove-console` during production builds, addressing potential compatibility issues in WXT's development workflow.

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

### Browser Specific Settings Type

Source: https://wxt.dev/api/reference/wxt/type-aliases/usermanifest

Defines the structure for 'browser_specific_settings', allowing configuration tailored to different browsers like Gecko (Firefox) and Safari. It includes options for versioning and update URLs.

```typescript
browser_specific_settings?: object

  browser_specific_settings.gecko?: object
  browser_specific_settings.gecko.id?: string
  browser_specific_settings.gecko.strict_max_version?: string
  browser_specific_settings.gecko.strict_min_version?: string
  browser_specific_settings.gecko.update_url?: string

  browser_specific_settings.gecko_android?: object
  browser_specific_settings.gecko_android.strict_max_version?: string
  browser_specific_settings.gecko_android.strict_min_version?: string

  browser_specific_settings.safari?: object
  browser_specific_settings.safari.strict_max_version?: string
  browser_specific_settings.safari.strict_min_version?: string
```

--------------------------------

### Specify Page Action for MV2 Manifest

Source: https://wxt.dev/guide/essentials/config/manifest

This HTML meta tag is used within the head of an HTML document to explicitly declare the use of a 'page_action' for Manifest V2. This is relevant when configuring action behaviors in WXT.

```html
<meta name="manifest.type" content="page_action" />
```

--------------------------------

### Configure WXT for i18n

Source: https://wxt.dev/i18n

Configures the WXT build process to include the i18n module and sets the default locale. This enables features like type-safety and custom message file formats.

```typescript
export default defineConfig({
  modules: ['@wxt-dev/i18n/module'],
  manifest: {
    default_locale: 'en',
  },
});
```

--------------------------------

### Detect Manifest Version at Runtime (TypeScript)

Source: https://wxt.dev/guide/essentials/target-different-browsers

Check the target manifest version at runtime using the 'import.meta.env.MANIFEST_VERSION' environment variable. This enables browser-specific or version-specific code execution.

```ts
if (import.meta.env.MANIFEST_VERSION === 2) {
  console.log('Do something only in MV2 builds');
}
```

--------------------------------

### Handling Extension Context Invalidation in Content Scripts

Source: https://wxt.dev/guide/essentials/content-scripts

Demonstrates how the context object 'ctx' in WXT content scripts provides helpers like addEventListener, setTimeout, setInterval, and requestAnimationFrame to prevent asynchronous operations from running after the extension's context has been invalidated (e.g., on uninstall or update).

```typescript
ctx.addEventListener(...);
ctx.setTimeout(...);
ctx.setInterval(...);
ctx.requestAnimationFrame(...);
// and more
```

--------------------------------

### Restore Storage Snapshot

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Restores storage items from a snapshot. This function only overrides values that exist in the snapshot and does not affect new properties added since the snapshot was taken.

```typescript
// Assuming 'snapshotData' was previously obtained using storage.snapshot()
await storage.restoreSnapshot(chrome.storage.local, snapshotData);
```

--------------------------------

### Auto-track UI Events in Content Scripts (TypeScript)

Source: https://wxt.dev/analytics

Track UI events specifically within the integrated UI of content scripts. The `onMount` hook is used to call `analytics.autoTrack` with the provided container.

```typescript
const ui = createIntegratedUi({
  // ...
  onMount(container) {
    analytics.autoTrack(container);
  },
});
ui.mount();
```

--------------------------------

### Manifest Action Configuration Type

Source: https://wxt.dev/api/reference/wxt/type-aliases/usermanifest

Defines the type for the 'action' property within the UserManifest. It is compatible with Browser.runtime.ManifestV3's action definition and includes a 'browser_style' boolean option. This allows for customization of the browser action's appearance.

```typescript
action?: Browser.runtime.ManifestV3["action"] & object

  browser_style?: boolean
```

--------------------------------

### Rename zip.ignoredSources to zip.excludeSources (wxt.config.ts)

Source: https://wxt.dev/guide/resources/upgrading

The configuration option `zip.ignoredSources` has been renamed to `zip.excludeSources`. Update your `wxt.config.ts` file to use the new option name to maintain the same functionality.

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

### Custom Analytics Implementation (TypeScript)

Source: https://wxt.dev/analytics

Define custom implementations for `userId` if not using WXT's storage or `@wxt-dev/storage`. This involves providing `getValue` and `setValue` functions.

```typescript
const analytics = createAnalytics({
  userId: {
    getValue: () => ...,
    setValue: (userId) => ...
  }
})
```

--------------------------------

### Configure Alias Paths in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Defines additional import alias paths for the tsconfig.json file within the .wxt directory. This allows for custom module resolution, directing aliases to specific files or directories relative to the project root or as absolute paths. It's recommended over overwriting the root tsconfig.json 'paths' to avoid conflicts.

```typescript
{
  "testing": "src/utils/testing.ts"
}
```

--------------------------------

### Browser Action Configuration Type (Manifest V2)

Source: https://wxt.dev/api/reference/wxt/type-aliases/usermanifest

Defines the type for the 'browser_action' property, specifically for Manifest V2 compatibility. It mirrors Browser.runtime.ManifestV2's browser_action structure and includes a 'browser_style' option for visual customization.

```typescript
browser_action?: Browser.runtime.ManifestV2["browser_action"] & object

  browser_style?: boolean
```

--------------------------------

### Access nested translation keys

Source: https://wxt.dev/i18n

Shows how to retrieve nested translation strings using the `i18n.t()` method with dot notation for key access.

```typescript
i18n.t('ok'); // "OK"
i18n.t('cancel'); // "Cancel"
i18n.t('welcome.title'); // "Welcome to XYZ"
i18n.t('dialogs.confirmation.title'); // "Are you sure?"
```

--------------------------------

### Configure UnoCSS Options in WXT

Source: https://wxt.dev/unocss

Configures UnoCSS options within your WXT project, such as excluding specific entrypoints like the background script from UnoCSS processing. Refer to `UnoCSSOptions` for available settings.

```ts
export default defineConfig({
  modules: ['@wxt-dev/unocss'],
  unocss: {
    // Exclude unocss from running for the background
    excludeEntrypoints: ['background'],
  },
});
```

--------------------------------

### Error.isError Static Method

Source: https://wxt.dev/api/reference/wxt/utils/storage/classes/migrationerror

Illustrates the static `isError` method, inherited from the Error class. This utility function checks if the provided argument is an instance of a built-in Error.

```javascript
Error.isError(error: unknown): error is Error;
```

--------------------------------

### Rename ExtensionRunnerConfig to WebExtConfig Type

Source: https://wxt.dev/guide/resources/upgrading

Shows the renaming of the `ExtensionRunnerConfig` type to `WebExtConfig`. This type definition change is related to the renaming of runner-related configurations and aims to improve clarity and consistency in the WXT API.

```typescript
import type { ExtensionRunnerConfig } from 'wxt';
import type { WebExtConfig } from 'wxt';
```

--------------------------------

### Add Event Listener to Document or Window

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

Adds an event listener to a specified target (Document or Window). This function is a wrapper that ensures the listener is properly handled within the content script's lifecycle. It supports various event types, including custom 'wxt:locationchange' events.

```typescript
ctx.addEventListener(document, "visibilitychange", () => {
  // ...
});
ctx.addEventListener(window, "wxt:locationchange", () => {
  // ...
});
```

--------------------------------

### Manually Specify Icons in WXT Manifest

Source: https://wxt.dev/guide/essentials/config/manifest

Manually define the 'icons' property in your 'wxt.config.ts' if you prefer not to use the auto-discovery feature or need to use custom filenames. This overrides WXT's default icon discovery.

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

### Add Import Alias with addAlias() - TypeScript

Source: https://wxt.dev/api/reference/wxt/modules/functions/addalias

Demonstrates how to use the addAlias function to create an import alias for generated code. It involves generating a type definition file and then aliasing it for easier import within the project. Dependencies include 'node:path'.

```typescript
import path from 'node:path';

export default defineWxtModule((wxt) => {
  const i18nPath = path.resolve(wxt.config.wxtDir, "i18n.ts");

  // Generate the file
  wxt.hooks.hook("prepare:types", (_, entries) => {
    entries.push({
      path: i18nPath,
      text: `export const i18n = ...`,
    });
  });

  // Add alias
  addAlias(wxt, "#i18n", i18nPath);
});
```

--------------------------------

### Transform Manifest with build:manifestGenerated Hook

Source: https://wxt.dev/guide/resources/upgrading

Replaces the deprecated `transformManifest` option with the `build:manifestGenerated` hook for transforming the manifest file during the build process. This hook receives the manifest object and allows for modifications before it's finalized.

```typescript
export default defineConfig({
  // transformManifest(manifest) { 
  hooks: {
    'build:manifestGenerated': (_, manifest) => {
       // ...
    },
  },
});
```

--------------------------------

### Define Custom Analytics Provider

Source: https://wxt.dev/analytics

Provides a template for defining a custom analytics provider by implementing the `AnalyticsProvider` type. This allows integration with unsupported analytics platforms.

```typescript
import { defineAnalyticsProvider } from '@wxt-dev/analytics/client';

interface CustomAnalyticsOptions {
  // ...
}

const customAnalytics = defineAnalyticsProvider<CustomAnalyticsOptions>(
  (analytics, analyticsConfig, providerOptions) => {
    // ...
  },
);

export default defineAppConfig({
  analytics: {
    providers: [
      customAnalytics({
        // ...
      }),
    ],
  },
});
```

--------------------------------

### Set Item in Storage

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Sets a value for a specific key in storage. Setting the value to null or undefined is equivalent to removing the item. Supports generic types for values.

```typescript
await storage.setItem<number>("local:installDate", Date.now());
```

--------------------------------

### Checking Content Script Context Validity

Source: https://wxt.dev/guide/essentials/content-scripts

Shows how to manually check the validity or invalidity of the content script's execution context using the 'ctx.isValid' and 'ctx.isInvalid' properties provided by the context object.

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

### Auto-track UI Events in HTML Pages (TypeScript)

Source: https://wxt.dev/analytics

Automatically track UI events like clicks within a specified container in HTML pages. Call `analytics.autoTrack` with `document` to enable tracking for the entire page.

```typescript
analytics.autoTrack(document);
```

--------------------------------

### Configure Google Analytics 4 Provider

Source: https://wxt.dev/analytics

Configures the Google Analytics 4 provider using the Measurement Protocol in `app.config.ts`. Requires GA API secret and measurement ID from environment variables.

```dotenv
WXT_GA_API_SECRET='...'
WXT_UMAMI_WEBSITE_ID='...'
WXT_UMAMI_DOMAIN='...'
```

```typescript
import { googleAnalytics4 } from '@wxt-dev/analytics/providers/google-analytics-4';

export default defineAppConfig({
  analytics: {
    providers: [
      googleAnalytics4({
        apiSecret: import.meta.env.WXT_GA_API_SECRET,
        measurementId: '...',
      }),
    ],
  },
});
```

--------------------------------

### Configure Action Without Popup in Manifest

Source: https://wxt.dev/guide/essentials/config/manifest

Configures the 'action' key in the WXT manifest, typically for extensions that need to use the 'activeTab' permission or the 'browser.action.onClicked' event without displaying a popup. It also shows how to include 'page_action' for MV2 compatibility.

```typescript
export default defineConfig({
  manifest: {
    action: {},
  },
});
```

```typescript
export default defineConfig({
  manifest: {
    action: {},
    page_action: {},
  },
});
```

--------------------------------

### WxtPackageManager: Add Dev Dependency

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtpackagemanager

Adds a specified development dependency to the project. Similar to `addDependency` but specifically for dev dependencies.

```APIDOC
## POST /api/wxt/packages/addDevDependency

### Description
Adds a development dependency to the project.

### Method
POST

### Endpoint
/api/wxt/packages/addDevDependency

### Parameters
#### Request Body
- **name** (string | string[]) - Required - Name of the dev dependency to add.
- **options** (object) - Optional - Options to pass to the API call.
  - **cwd** (string) - Optional - The current working directory.
  - **workspace** (string) - Optional - The workspace to operate in.

### Request Example
```json
{
  "name": "eslint",
  "options": {
    "cwd": "./my-project"
  }
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the operation was successful.
- **message** (string) - A message describing the result of the operation.

#### Response Example
```json
{
  "success": true,
  "message": "Dev dependency 'eslint' added successfully."
}
```
```

--------------------------------

### Configuring Custom Path Aliases in WXT

Source: https://wxt.dev/guide/essentials/config/typescript

Define custom path aliases for your project using the `alias` option in `wxt.config.ts`. These aliases are added to the generated tsconfig and configured for the bundler.

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

### Configure Default Locale in Manifest (Vite/WXT)

Source: https://wxt.dev/guide/essentials/i18n

Sets the default language for your extension. This is a required step for internationalization using the `browser.i18n` API. The `default_locale` is specified within the `manifest` configuration object.

```typescript
export default defineConfig({
  manifest: {
    default_locale: 'en',
  },
});
```

--------------------------------

### Remove Obsolete extensionApi Config

Source: https://wxt.dev/guide/resources/upgrading

Removes the `extensionApi` configuration from `wxt.config.ts`. This configuration option was used to opt into the new `browser` object before v0.20.0 and is no longer needed.

```typescript
export default defineConfig({
  extensionApi: 'chrome', 
});
```

--------------------------------

### Configure Background Script as ESM in WXT (MV3)

Source: https://wxt.dev/guide/essentials/es-modules

Change the background script bundling format to ESM in WXT by setting `type: 'module'` in the `defineBackground` configuration. This enables code-splitting and sets the manifest type to module. Note: This feature requires MV3.

```typescript
export default defineBackground({
  type: 'module', 
  main() {
    // ...
  },
});
```

--------------------------------

### Default Logger in WXT

Source: https://wxt.dev/api/reference/wxt/interfaces/inlineconfig

Specifies the default logger used by WXT. This can be overridden with a custom logger if needed for specific logging requirements.

```typescript
consola
```

--------------------------------

### WxtPackageManager: Remove Dependency

Source: https://wxt.dev/api/reference/wxt/interfaces/wxtpackagemanager

Removes a specified dependency from the project.

```APIDOC
## DELETE /api/wxt/packages/removeDependency

### Description
Removes a dependency from the project.

### Method
DELETE

### Endpoint
/api/wxt/packages/removeDependency

### Parameters
#### Request Body
- **name** (string | string[]) - Required - Name of the dependency to remove.
- **options** (object) - Optional - Options to pass to the API call.
  - **dev** (boolean) - Optional - Whether to remove as a dev dependency.
  - **cwd** (string) - Optional - The current working directory.
  - **workspace** (string) - Optional - The workspace to operate in.

### Request Example
```json
{
  "name": "lodash",
  "options": {
    "dev": false
  }
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the operation was successful.
- **message** (string) - A message describing the result of the operation.

#### Response Example
```json
{
  "success": true,
  "message": "Dependency 'lodash' removed successfully."
}
```
```

--------------------------------

### Use escaped dollar sign with substitution

Source: https://wxt.dev/i18n

Shows how to use a translation string that includes an escaped dollar sign and a substitution placeholder. The escaped dollar sign is rendered literally, and the placeholder is replaced.

```typescript
i18n.t('dollars', ['1.00']); // "$1.00"
```

--------------------------------

### Customize WXT Type Generation

Source: https://wxt.dev/api/reference/wxt/interfaces/wxthooks

This hook enables customization of WXT's type generation process. You can add custom type definitions, modify existing ones, or include external type references before WXT writes `.wxt/tsconfig.json` and `.wxt/wxt.d.ts`.

```typescript
wxt.hooks.hook("prepare:types", (wxt, entries) => {
  // Add a file, ".wxt/types/example.d.ts", that defines a global
  // variable called "example" in the TS project.
  entries.push({
    path: "types/example.d.ts",
    text: "declare const a: string;",
    tsReference: true,
  });
  // use module to add Triple-Slash Directive in .wxt/wxt.d.ts
  // eg: /// <reference types="@types/example" />
  entries.push({
    module: '@types/example'
 });
})
```

--------------------------------

### Set Analytics User ID and Properties at Runtime (TypeScript)

Source: https://wxt.dev/analytics

Dynamically set the user ID and properties at runtime using the `identify` function. This allows for real-time updates to user data.

```typescript
await analytics.identify(userId, userProperties);
```

--------------------------------

### ContentScriptContext addEventListener with Custom Events

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

Shows how to use the addEventListener method of ContentScriptContext to attach event listeners that are automatically cleaned up when the context is invalidated. It includes support for standard DOM events and a custom 'wxt:locationchange' event.

```typescript
addEventListener<TType>(target: Window, type: TType, handler: (event: WxtWindowEventMap[TType]) => void, options?: AddEventListenerOptions): void;
```

--------------------------------

### Disable WXT Auto-imports

Source: https://wxt.dev/guide/essentials/config/auto-imports

This TypeScript snippet shows how to completely disable WXT's auto-import feature by setting the `imports` configuration option to `false`.

```typescript
export default defineConfig({
  imports: false, 
});
```

--------------------------------

### Add WebWorker Types to tsconfig.json (JSON)

Source: https://wxt.dev/guide/resources/upgrading

The 'WebWorker' types have been removed by default from `.wxt/tsconfig.json`. If your MV3 project uses a service worker and requires these types, add them back to your project's tsconfig by extending the default and including 'WebWorker' in the `lib` option.

```json
{
  "extends": "./.wxt/tsconfig.json",
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "WebWorker"]
  }
}
```

--------------------------------

### Error.captureStackTrace Method

Source: https://wxt.dev/api/reference/wxt/utils/match-patterns/classes/invalidmatchpattern

Creates a '.stack' property on a target object, which returns a string representing the call stack. It can optionally omit frames above a specified constructor function. This is useful for controlling the detail in error stack traces.

```javascript
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

```javascript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  Error.captureStackTrace(error, b);
  throw error;
}

a();
```

--------------------------------

### Add UnoCSS Module to WXT Configuration

Source: https://wxt.dev/unocss

Adds the UnoCSS module to your WXT extension's configuration file (`wxt.config.ts`). This step enables UnoCSS integration within your project.

```ts
export default defineConfig({
  modules: ['@wxt-dev/unocss'],
});
```

--------------------------------

### Fix Watch Callback Types in Storage (TypeScript)

Source: https://wxt.dev/guide/resources/upgrading

The types for the `newValue` and `oldValue` parameters in the `watch` callback for storage items have been updated. If you are not using TypeScript, this change will not affect your code.

```typescript
const item = storage.defineItem<number>('local:count', { defaultValue: 0 });
item.watch((newValue: number | null, oldValue: number | null) => { 
item.watch((newValue: number, oldValue: number) => { 
  // ...
});
```

--------------------------------

### Block Execution with a Never-Resolving Promise

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

Provides a utility to create a Promise that never resolves. This is useful for async functions that should halt execution if the content script's context becomes invalid. It's typically used as a guard clause in asynchronous operations.

```typescript
const getValueFromStorage = async () => {
  if (ctx.isInvalid) return ctx.block();

  // ...
}
```

--------------------------------

### Remove Multiple Items from Storage

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Removes a list of items from storage. The keys can specify the storage area (local, session, sync, managed) or be WxtStorageItem objects.

```typescript
await storage.removeItems([
  "local:installDate",
  "session:userToken"
]);
```

--------------------------------

### UserManifest Type Alias for Browser Extension Manifests

Source: https://wxt.dev/api/reference/wxt/type-aliases/usermanifest

Defines the UserManifest type, which represents a customizable browser extension manifest. It inherits properties from Browser.runtime.ManifestV3, excluding certain keys like 'action', 'background', etc., and merges with an object. This type is used for configuring manifest options in wxt.config.ts.

```typescript
type UserManifest : {
  [key in keyof Browser.runtime.ManifestV3 as key extends "action" | "background" | "chrome_url_overrides" | "devtools_page" | "manifest_version" | "options_page" | "options_ui" | "permissions" | "sandbox" | "web_accessible_resources" ? never : key]
  ?: Browser.runtime.ManifestV3[key]
} & object
```

--------------------------------

### Add Hook to Modify Manifest (TypeScript)

Source: https://wxt.dev/guide/essentials/config/hooks

This hook modifies the `manifest.json` file during the build process. It appends ' (DEV)' to the manifest title when in development mode. It utilizes the `wxt` object and the `manifest` object, which can be modified directly.

```typescript
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

--------------------------------

### Listen for Context Invalidation

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

Allows registering a callback function that will be executed when the content script's context is invalidated. This is crucial for cleaning up resources and preventing operations on an invalid context. It returns a function to remove the listener.

```typescript
browser.runtime.onMessage.addListener(cb);
const removeInvalidatedListener = ctx.onInvalidated(() => {
  browser.runtime.onMessage.removeListener(cb);
})
// ...
removeInvalidatedListener();
```

--------------------------------

### Define Translation Messages

Source: https://wxt.dev/guide/essentials/i18n

Defines the key-value pairs for translations in a JSON file. The `message` property holds the translated string for a given key. This file is placed within the specific language's locale directory (e.g., `public/_locales/en/messages.json`).

```json
// public/_locales/en/messages.json
{
  "helloWorld": {
    "message": "Hello world!",
  }
}
```

--------------------------------

### Request Idle Callback with Auto-Cancellation

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

A wrapper around `window.requestIdleCallback` that automatically cancels the idle callback if the content script context is invalidated before the callback is invoked. Callbacks can also be canceled using `cancelIdleCallback`.

```typescript
ctx.requestIdleCallback(() => {
  // Perform non-urgent tasks
}, { timeout: 1000 });
```

--------------------------------

### Request Animation Frame with Auto-Cancellation

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

A wrapper around `window.requestAnimationFrame` that automatically cancels the animation frame request if the content script context is invalidated before the callback executes. Callbacks can still be explicitly canceled using `cancelAnimationFrame`.

```typescript
ctx.requestAnimationFrame(() => {
  // Update UI or perform animations
});
```

--------------------------------

### Remove Item from Storage

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Removes a single item from storage using its key. The key can specify the storage area (local, session, sync, managed).

```typescript
await storage.removeItem("local:installDate");
```

--------------------------------

### Use i18n translation in WXT

Source: https://wxt.dev/i18n

Accesses a translated string using the auto-imported `i18n` object provided by @wxt-dev/i18n when used with WXT. This demonstrates type-safe access to translations.

```typescript
import { i18n } from '#i18n';

i18n.t('helloWorld'); // "Hello world!"
```

--------------------------------

### Set Analytics Enabled State at Runtime (TypeScript)

Source: https://wxt.dev/analytics

Dynamically change the enabled state of analytics at runtime using the `setEnabled` function. This allows for runtime toggling of analytics.

```typescript
analytics.setEnabled(true);
```

--------------------------------

### WxtUnimportOptions Type Declaration

Source: https://wxt.dev/api/reference/wxt/type-aliases/wxtunimportoptions

Defines the WxtUnimportOptions type, which extends UnimportOptions. It includes an optional 'eslintrc' property for configuring ESLint settings related to auto-imported variables.

```typescript
type WxtUnimportOptions = Partial<UnimportOptions> & {
  eslintrc?: Eslintrc;
};
```

--------------------------------

### Error.isError Method

Source: https://wxt.dev/api/reference/wxt/utils/match-patterns/classes/invalidmatchpattern

A static method that checks if the provided argument is an instance of the built-in Error class. It returns a boolean indicating whether the argument is an Error.

```typescript
static isError(error: unknown): error is Error
```

--------------------------------

### Remove All Watch Listeners

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Removes all active watch listeners that were set up using the `watch()` function. This is useful for cleanup when a component unmounts or is no longer needed.

```typescript
storage.unwatch();
```

--------------------------------

### Remove Metadata from Storage Item

Source: https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage

Removes metadata associated with a storage item. You can remove all metadata or specific properties by name.

```typescript
// Remove all metadata properties from the item
await storage.removeMeta("local:installDate");

// Remove only specific the "v" field
await storage.removeMeta("local:installDate", "v")
```

--------------------------------

### Escape dollar signs in translations

Source: https://wxt.dev/i18n

Explains and demonstrates how to escape the dollar sign character within translation strings by using a double dollar sign (`$$`). This ensures literal dollar signs are displayed correctly.

```yaml
dollars: $$$1
```

--------------------------------

### Set Timeout with Auto-Clearing

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

A wrapper around `window.setTimeout` that automatically clears the timeout when the content script's context is invalidated. This ensures that timeout callbacks are not executed in an invalid context. Timeouts can be manually cleared using `clearTimeout`.

```typescript
ctx.setTimeout(() => {
  console.log('Delayed action');
}, 5000);
```

--------------------------------

### Set Interval with Auto-Clearing

Source: https://wxt.dev/api/reference/wxt/utils/content-script-context/classes/contentscriptcontext

A wrapper around `window.setInterval` that automatically clears the interval when the content script's context is invalidated. This prevents intervals from running after the script is no longer active. Intervals can also be cleared manually using `clearInterval`.

```typescript
ctx.setInterval(() => {
  console.log('Tick');
}, 1000);
```

--------------------------------

### ResolvedPerBrowserOptions Type Alias Definition (TypeScript)

Source: https://wxt.dev/api/reference/wxt/type-aliases/resolvedperbrowseroptions

Defines the ResolvedPerBrowserOptions type alias, which converts an object containing PerBrowserOption types to an object with unwrapped types. It handles optional omitted keys for fields not compatible with PerBrowserOption. This is useful for simplifying type access for browser-specific configurations.

```typescript
type ResolvedPerBrowserOptions<T, TOmitted> = {
  [key in keyof Omit<T, TOmitted>]: T[key] extends PerBrowserOption<infer U> ? U : T[key];
} & {
  [key in TOmitted]: T[key];
};
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.
