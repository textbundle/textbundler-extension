# Safari Extension

TextBundler supports Safari on macOS and iOS via WXT's Safari build target and Apple's `safari-web-extension-converter`.

## Quick Start

```bash
make safari-xcode    # build + generate Xcode project
```

This builds `dist/safari-mv2/` and generates an Xcode project at `xcode-safari/`.

## Running from Xcode

1. Open the generated Xcode project (opens automatically after `make safari-xcode`)
2. Select the **"TextBundler (macOS)"** scheme in the toolbar
3. Set your signing team on all four targets: Project > each target > Signing & Capabilities > Team
4. Click **Run** (Cmd+R)
5. A host app window appears — you can close it, it's just the shell
6. Open Safari > Settings > Extensions > enable **TextBundler**
7. Navigate to an article and click the toolbar icon

For iOS: switch to the **"TextBundler (iOS)"** scheme and pick a simulator.

## Running without Xcode (Safari 26+)

Safari 26 supports loading unsigned extensions directly:

1. `make safari` (builds `dist/safari-mv2/`)
2. Safari > Settings > Advanced > enable "Show features for web developers"
3. Develop > check "Web Extension Developer Mode"
4. Develop > Load Web Extension... > select `dist/safari-mv2/`

## Debugging

- **Background script:** Develop > Web Extension Background Content > TextBundler
- **Content script:** Web Inspector (Develop > Show Web Inspector) > Console, filter by `[TextBundler`

## Safari API Differences

Safari lacks `browser.downloads` and `browser.notifications`. The extension handles this at runtime:

- **Downloads:** Falls back to anchor-click download via content script messaging. The file downloads through Safari's standard download UI.
- **Notifications:** Silently skipped when the API is unavailable. Badge indicators still work.

The `safari-web-extension-converter` warns about these unsupported keys in the manifest — these warnings are expected.

## App Store Distribution

```bash
make safari-xcode
```

Then in Xcode: Product > Archive > Distribute App through App Store Connect. Requires an Apple Developer Program membership ($99/year).

## Rebuilding

After code changes, run `make safari-xcode` again. The `--force` flag overwrites the previous Xcode project. You'll need to re-set your signing team after regeneration.
