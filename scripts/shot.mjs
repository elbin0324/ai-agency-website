#!/usr/bin/env node
// Screenshot helper for visual QA. Drives the locally installed Chrome (or Edge)
// through playwright-core, so no browser download is needed.
//
// Usage:
//   node scripts/shot.mjs <url | file path> [options]
//
// Default output: the page captured as consecutive viewport-sized PNGs
// (<name>-01.png, <name>-02.png, ...) by scrolling top to bottom, which keeps
// each image legible and fires scroll-triggered reveal animations naturally.
//
// Options:
//   --out <dir>            output directory (default: .shots)
//   --name <prefix>        file name prefix (default: derived from the URL)
//   --mobile               390x844 viewport, DPR 2, touch, mobile UA
//   --width <px>           viewport width  (default 1440)
//   --height <px>          viewport height (default 900)
//   --full                 one full-page PNG instead of chunks
//   --max-chunks <n>       cap on chunk count (default 30)
//   --selector <css>       screenshot each matching element instead (max 12)
//   --click <css>          click an element before capturing (repeatable)
//   --wait <ms>            extra wait after load and after actions (default 800)
//   --no-scroll            skip the pre-scroll pass
//   --reduced-motion       emulate prefers-reduced-motion: reduce
//   --dark                 emulate prefers-color-scheme: dark
//   --browser <name>       chrome | msedge (default chrome, falls back to msedge)
//
// The script always prints console errors, page errors and failed requests,
// then a final "ERRORS: <n>" line, so agents can grep for problems.

import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function parseArgs(argv) {
  const opts = { clicks: [], scroll: true, wait: 800, maxChunks: 30, width: 1440, height: 900 };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--out': opts.out = next(); break;
      case '--name': opts.name = next(); break;
      case '--mobile': opts.mobile = true; break;
      case '--width': opts.width = Number(next()); break;
      case '--height': opts.height = Number(next()); break;
      case '--full': opts.full = true; break;
      case '--max-chunks': opts.maxChunks = Number(next()); break;
      case '--selector': opts.selector = next(); break;
      case '--click': opts.clicks.push(next()); break;
      case '--wait': opts.wait = Number(next()); break;
      case '--no-scroll': opts.scroll = false; break;
      case '--reduced-motion': opts.reducedMotion = true; break;
      case '--dark': opts.dark = true; break;
      case '--browser': opts.browser = next(); break;
      default: rest.push(a);
    }
  }
  opts.target = rest[0];
  return opts;
}

function toUrl(target) {
  if (/^(https?|file):/i.test(target)) return target;
  const abs = path.resolve(target);
  if (fs.existsSync(abs)) return pathToFileURL(abs).href;
  return target;
}

function defaultName(url) {
  const u = url.replace(/^(https?|file):\/+/, '').replace(/[?#].*$/, '');
  const slug = u.split('/').filter(Boolean).slice(1).join('-') || 'home';
  return slug.replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'page';
}

async function launch(preferred) {
  const order = preferred === 'msedge' ? ['msedge', 'chrome'] : ['chrome', 'msedge'];
  let lastErr;
  for (const channel of order) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

const opts = parseArgs(process.argv.slice(2));
if (!opts.target) {
  console.error('usage: node scripts/shot.mjs <url | file> [--mobile] [--full] [--selector css] [--out dir]');
  process.exit(2);
}

const url = toUrl(opts.target);
const outDir = path.resolve(opts.out || '.shots');
fs.mkdirSync(outDir, { recursive: true });
const name = opts.name || defaultName(url) + (opts.mobile ? '-mobile' : '');

const browser = await launch(opts.browser);
const contextOpts = opts.mobile
  ? {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    }
  : { viewport: { width: opts.width, height: opts.height }, deviceScaleFactor: 1 };
if (opts.reducedMotion) contextOpts.reducedMotion = 'reduce';
if (opts.dark) contextOpts.colorScheme = 'dark';

const context = await browser.newContext(contextOpts);
const page = await context.newPage();

const problems = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') problems.push(`console.error: ${msg.text()}`);
});
page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
page.on('requestfailed', (req) => {
  const failure = req.failure()?.errorText || 'failed';
  if (!/ERR_ABORTED/.test(failure)) problems.push(`requestfailed: ${req.url()} (${failure})`);
});
page.on('response', (res) => {
  if (res.status() >= 400) problems.push(`http ${res.status()}: ${res.url()}`);
});

const written = [];
const wait = (ms) => page.waitForTimeout(ms);

try {
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch {}
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await wait(opts.wait);

  for (const sel of opts.clicks) {
    await page.click(sel, { timeout: 10000 });
    await wait(opts.wait);
  }

  const vh = contextOpts.viewport.height;
  const scrollTo = (y) => page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
  const totalHeight = () => page.evaluate(() => document.documentElement.scrollHeight);

  if (opts.scroll && !opts.selector) {
    // Pre-scroll pass so IntersectionObserver reveals and lazy content run.
    const total = await totalHeight();
    for (let y = 0; y < total; y += Math.round(vh * 0.6)) {
      await scrollTo(y);
      await wait(120);
    }
    await scrollTo(0);
    await wait(400);
  }

  if (opts.selector) {
    const els = (await page.$$(opts.selector)).slice(0, 12);
    if (!els.length) problems.push(`selector matched nothing: ${opts.selector}`);
    for (let i = 0; i < els.length; i++) {
      await els[i].scrollIntoViewIfNeeded();
      await wait(opts.wait);
      const file = path.join(outDir, `${name}-el-${String(i + 1).padStart(2, '0')}.png`);
      await els[i].screenshot({ path: file });
      written.push(file);
    }
  } else if (opts.full) {
    const file = path.join(outDir, `${name}-full.png`);
    await page.screenshot({ path: file, fullPage: true });
    written.push(file);
  } else {
    const total = await totalHeight();
    const count = Math.min(Math.ceil(total / vh), opts.maxChunks);
    for (let i = 0; i < count; i++) {
      const y = Math.min(i * vh, Math.max(0, total - vh));
      await scrollTo(y);
      await wait(450);
      const file = path.join(outDir, `${name}-${String(i + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: file });
      written.push(file);
    }
    if (Math.ceil(total / vh) > count) {
      console.log(`note: page is ${total}px tall; captured first ${count} chunks (raise --max-chunks for more)`);
    }
  }
} catch (err) {
  problems.push(`script error: ${err.message}`);
} finally {
  await browser.close();
}

for (const f of written) console.log(`wrote ${f}`);
for (const p of problems) console.log(p);
console.log(`ERRORS: ${problems.length}`);
