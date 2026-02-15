import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionPath = path.resolve(__dirname, '..', 'dist', 'chrome-mv3');
const downloadDir = path.resolve(__dirname, '..', 'dist', 'test-downloads');

fs.rmSync(downloadDir, { recursive: true, force: true });
fs.mkdirSync(downloadDir, { recursive: true });

console.log('Extension:', extensionPath);

const browser = await puppeteer.launch({
  headless: false,
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
    '--no-first-run',
    '--no-default-browser-check',
  ],
});

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

const swTarget = await waitForTarget(browser, t => t.type() === 'service_worker');
if (!swTarget) {
  console.error('FAIL: No service worker registered');
  await browser.close();
  process.exit(1);
}
console.log('Service worker OK');

const swCdp = await swTarget.createCDPSession();
await swCdp.send('Runtime.enable');
await swCdp.send('Log.enable');

swCdp.on('Runtime.consoleAPICalled', async (event) => {
  const parts = [];
  for (const arg of event.args) {
    if (arg.value !== undefined) {
      parts.push(typeof arg.value === 'string' ? arg.value : JSON.stringify(arg.value));
    } else if (arg.objectId) {
      try {
        const { result } = await swCdp.send('Runtime.getProperties', {
          objectId: arg.objectId,
          ownProperties: true,
        });
        const obj = {};
        for (const prop of result) {
          if (prop.value) obj[prop.name] = prop.value.value ?? prop.value.description;
        }
        parts.push(JSON.stringify(obj));
      } catch {
        parts.push(arg.description ?? arg.type);
      }
    } else {
      parts.push(arg.description ?? arg.type);
    }
  }
  console.log(`  [SW ${event.type}] ${parts.join(' ')}`);
});
swCdp.on('Runtime.exceptionThrown', (event) => {
  console.log(`  [SW EXCEPTION] ${event.exceptionDetails.text}`);
  if (event.exceptionDetails.exception) {
    console.log(`    ${event.exceptionDetails.exception.description}`);
  }
});

const swWorker = await swTarget.worker();
const page = await browser.newPage();

const client = await page.createCDPSession();
await client.send('Browser.setDownloadBehavior', {
  behavior: 'allow',
  downloadPath: downloadDir,
  eventsEnabled: true,
});
client.on('Browser.downloadWillBegin', (event) => {
  console.log(`  [DOWNLOAD] Begin: ${event.suggestedFilename}`);
});
client.on('Browser.downloadProgress', (event) => {
  if (event.state === 'completed') console.log('  [DOWNLOAD] Complete');
});

page.on('console', msg => {
  const text = msg.text();
  if (!text.includes('mediawiki') && !text.includes('out of sample') && !text.includes('404')) {
    console.log(`  [PAGE ${msg.type()}] ${text}`);
  }
});

const testUrl = 'https://en.wikipedia.org/wiki/TextBundle';
console.log(`Navigating to ${testUrl}...`);
await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
console.log('Page loaded.');

const tabId = await swWorker.evaluate(async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab?.id;
});
console.log('Tab:', tabId);

console.log('Injecting content script...');
await swWorker.evaluate(async (tabId) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['/content-scripts/content.js'],
  });
}, tabId);

await new Promise(r => setTimeout(r, 1000));

console.log('Triggering archive...');
await swWorker.evaluate(async (tabId) => {
  await chrome.tabs.sendMessage(tabId, { type: 'trigger-archive' });
}, tabId);

console.log('Waiting for pipeline (30s max)...\n');

const startTime = Date.now();
let found = false;
while (Date.now() - startTime < 30000) {
  await new Promise(r => setTimeout(r, 1000));
  try {
    const files = fs.readdirSync(downloadDir);
    const textpacks = files.filter(f => f.endsWith('.textpack'));
    if (textpacks.length > 0) {
      console.log(`\nSUCCESS: ${textpacks.length} file(s):`);
      textpacks.forEach(f => {
        const stats = fs.statSync(path.join(downloadDir, f));
        console.log(`  ${f} (${stats.size} bytes)`);
      });
      found = true;
      break;
    }
  } catch {}
}

if (!found) {
  console.log('\nNo .textpack files downloaded to test dir.');
  const defaultDownloads = path.join(process.env.HOME, 'Downloads');
  try {
    const cutoff = Date.now() - 60000;
    const recent = fs.readdirSync(defaultDownloads)
      .filter(f => f.endsWith('.textpack'))
      .map(f => ({ name: f, mtime: fs.statSync(path.join(defaultDownloads, f)).mtimeMs }))
      .filter(f => f.mtime > cutoff);
    if (recent.length > 0) {
      console.log('Found recent .textpack in ~/Downloads:', recent.map(f => f.name));
    }
  } catch {}
}

await browser.close();
