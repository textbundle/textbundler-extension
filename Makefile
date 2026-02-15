EXTENSION_DIR := $(CURDIR)/dist/chrome-mv3
CHROME_PROFILE := $(CURDIR)/.chrome-profile
CHROME_TEST = $(shell ls -d "$(HOME)/.cache/puppeteer/chrome"/*/chrome-mac-arm64/*.app/Contents/MacOS/* 2>/dev/null | sort -V | tail -1)

.PHONY: build build-firefox build-all test typecheck lint chrome chrome-clean firefox e2e clean ensure-chrome

build:
	npm run build

build-firefox:
	npm run build:firefox

build-all: build build-firefox

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

e2e: build ensure-chrome
	node scripts/test-chrome-extension.mjs

clean:
	rm -rf dist .wxt
