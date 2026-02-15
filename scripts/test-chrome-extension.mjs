import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionPath = path.resolve(__dirname, '..', 'dist', 'chrome-mv3');

const executablePath = process.argv[2] || puppeteer.executablePath();

console.log('Extension:', extensionPath);
console.log('Browser:', executablePath);

const browser = await puppeteer.launch({
  headless: false,
  executablePath,
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
    '--no-first-run',
    '--no-default-browser-check',
  ],
});

const version = await browser.version();
console.log('Version:', version);

async function waitForTarget(browser, predicate, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const targets = await browser.targets();
    const match = targets.find(predicate);
    if (match) return match;
    await new Promise(r => setTimeout(r, 200));
  }
  return null;
}

await new Promise(r => setTimeout(r, 2000));

const targets = await browser.targets();
console.log('\nAll targets:');
for (const t of targets) {
  console.log(`  ${t.type()}: ${t.url()}`);
}

const swTarget = await waitForTarget(browser, t => t.type() === 'service_worker');
if (swTarget) {
  console.log('\nService worker OK:', swTarget.url());

  const swCdp = await swTarget.createCDPSession();
  await swCdp.send('Runtime.enable');
  swCdp.on('Runtime.consoleAPICalled', async (event) => {
    const parts = event.args.map(a => a.value ?? a.description ?? a.type);
    console.log(`  [SW] ${parts.join(' ')}`);
  });

  const swWorker = await swTarget.worker();
  const page = await browser.newPage();

  const testUrl = 'https://en.wikipedia.org/wiki/TextBundle';
  console.log(`\nNavigating to ${testUrl}...`);
  await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

  const tabId = await swWorker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    return tab?.id;
  });
  console.log('Tab:', tabId);

  console.log('Injecting + triggering...');
  await swWorker.evaluate(async (tabId) => {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['/content-scripts/content.js'],
    });
  }, tabId);
  await new Promise(r => setTimeout(r, 1000));
  await swWorker.evaluate(async (tabId) => {
    await chrome.tabs.sendMessage(tabId, { type: 'trigger-archive' });
  }, tabId);

  console.log('Waiting for pipeline...');
  await new Promise(r => setTimeout(r, 15000));
} else {
  console.log('\nFAIL: No service worker registered');
  const bgTarget = targets.find(t => t.type() === 'background_page');
  if (bgTarget) console.log('Background page found (MV2 fallback):', bgTarget.url());
}

await browser.close();
