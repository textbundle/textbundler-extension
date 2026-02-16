EXTENSION_DIR := $(CURDIR)/dist/chrome-mv3
SAFARI_DIR := $(CURDIR)/dist/safari-mv2
SAFARI_XCODE := $(CURDIR)/xcode-safari
CHROME_PROFILE := $(CURDIR)/.chrome-profile
CHROME_TEST = $(shell ls -d "$(HOME)/.cache/puppeteer/chrome"/*/chrome-mac-arm64/*.app/Contents/MacOS/* 2>/dev/null | sort -V | tail -1)

.PHONY: all build build-firefox build-safari build-all test typecheck lint chrome chrome-clean firefox safari safari-xcode e2e clean ensure-chrome

all: build-all

build:
	npm run build

build-firefox:
	npm run build:firefox

build-safari:
	npm run build:safari

build-all: build build-firefox build-safari

test:
	npm test

typecheck:
	npm run typecheck

lint:
	npm run lint

ensure-chrome:
	@if [ -z "$(CHROME_TEST)" ]; then \
		echo "Installing Chrome for Testing via Puppeteer..."; \
		npx puppeteer browsers install chrome; \
	fi

chrome: build ensure-chrome
	@CHROME="$(CHROME_TEST)"; \
	if [ -z "$$CHROME" ]; then \
		CHROME=$$(ls -d "$(HOME)/.cache/puppeteer/chrome"/*/chrome-mac-arm64/*.app/Contents/MacOS/* 2>/dev/null | sort -V | tail -1); \
	fi; \
	if [ -z "$$CHROME" ]; then \
		echo "Error: Chrome for Testing not found after install attempt."; \
		exit 1; \
	fi; \
	echo "Launching $$CHROME"; \
	"$$CHROME" \
		--user-data-dir="$(CHROME_PROFILE)" \
		--disable-extensions-except="$(EXTENSION_DIR)" \
		--load-extension="$(EXTENSION_DIR)" \
		--no-first-run \
		--no-default-browser-check

chrome-clean:
	rm -rf "$(CHROME_PROFILE)"

firefox: build-firefox
	npx web-ext run --source-dir dist/firefox-mv2

safari: build-safari
	@echo "Opening Safari with extension enabled..."
	@echo "1. Safari > Settings > Advanced > enable 'Show features for web developers'"
	@echo "2. Develop > Web Extension Developer Mode (check)"
	@echo "3. Develop > Load Web Extension... > select $(SAFARI_DIR)"
	@open -a Safari

safari-xcode: build-safari
	xcrun safari-web-extension-converter \
		--app-name TextBundler \
		--bundle-identifier org.textbundle.textbundler \
		--swift \
		--force \
		--project-location "$(SAFARI_XCODE)" \
		"$(SAFARI_DIR)"

e2e: build ensure-chrome
	node scripts/test-chrome-extension.mjs

clean:
	rm -rf dist .wxt "$(SAFARI_XCODE)"
