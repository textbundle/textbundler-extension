# Contributing to TextBundler

## Prerequisites

- Node.js 20+
- npm
- Xcode (for Safari builds only)

```bash
npm install
```

## Development

```bash
npm run dev              # WXT dev mode (Chrome, HMR + auto-reload)
npm run dev:firefox      # WXT dev mode (Firefox)
make chrome              # Production build + launch Chrome for Testing
make firefox             # Production build + launch Firefox via web-ext
```

See [docs/SAFARI.md](docs/SAFARI.md) for Safari development.

## Testing

```bash
npm test                 # Vitest (unit tests)
npm run build            # Production build (also validates entrypoints)
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint
make e2e                 # Chrome extension smoke test
```

Both `npm test` and `npm run build` must pass before every commit.

## Git Workflow

1. Branch off `main`: `feat/task-NNN-description`
2. Make atomic commits referencing the task ID: `feat(task-011): add markdown converter`
3. Verify tests and build pass before committing
4. Merge to `main` with `--no-ff` (merge commit, never fast-forward)

## Creating a Release

### 1. Prepare

Make sure `main` is clean and all tests pass:

```bash
git checkout main
git pull
npm test -- --run
npm run build
npm run typecheck
```

### 2. Bump the Version

Update the version in `package.json`:

```bash
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```

This creates a commit and a git tag (e.g. `v1.0.1`).

### 3. Build All Targets

```bash
make build-all      # Chrome, Firefox, Safari
```

### 4. Package

```bash
npm run zip              # Chrome (.zip)
npm run zip:firefox      # Firefox (.xpi)
npm run zip:safari       # Safari (for Xcode import)
```

Artifacts are written to the project root (e.g. `textbundler-1.0.1-chrome.zip`).

### 5. Create a GitHub Release

```bash
git push origin main --tags
```

Then create a release on GitHub, attaching the built artifacts:

```bash
gh release create v1.0.1 \
  textbundler-*-chrome.zip \
  textbundler-*-firefox.zip \
  --title "v1.0.1" \
  --generate-notes
```

### 6. Submit to Browser Stores

**Firefox (AMO)**

1. Go to [addons.mozilla.org/developers](https://addons.mozilla.org/en-US/developers/)
2. Upload the `.zip` (not the `.xpi` — AMO re-signs it)
3. Submit for review

**Chrome Web Store**

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Upload the Chrome `.zip`
3. Submit for review

**Safari (App Store)**

1. `make safari-xcode`
2. In Xcode: Product > Archive > Distribute App
3. Requires Apple Developer Program membership ($99/year)

See [docs/SAFARI.md](docs/SAFARI.md) for full Safari build details.
