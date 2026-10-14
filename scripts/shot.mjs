#!/usr/bin/env node
// Screenshot helper for visual QA. By default it drives the locally installed Chrome
// (or Edge) through playwright-core, so no browser download is needed. For cross-browser
// checks, --engine webkit (Safari's engine) and --engine firefox run Playwright's own
// builds; install them once with: npx playwright-core install webkit firefox
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
//   --name <prefix>        file name prefix (default: derived from the URL, see "Naming")
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
//   --browser <name>       chrome | msedge (default chrome, falls back to msedge); chromium engine only
//   --engine <name>        chromium | webkit | firefox (default chromium: the local Chrome/Edge
//                          picked by --browser). webkit and firefox use Playwright's builds.
//   --device "<name>"      apply a Playwright device descriptor (viewport, screen, DPR, isMobile,
//                          touch, user agent), e.g. "iPhone 15", "iPhone 15 Pro Max", "Pixel 7",
//                          "iPad Pro 11". Case-insensitive; dashes work instead of spaces
//                          (iphone-15-pro-max). Replaces --mobile; an explicit --width or --height
//                          overrides its viewport. "--device list" prints every name.
//
// Examples:
//   node scripts/shot.mjs <url> --engine webkit --device "iPhone 15"    # iPhone Safari
//   node scripts/shot.mjs <url> --engine firefox                        # desktop Firefox 1440x900
//
// Naming: <prefix>-01.png ..., <prefix>-full.png or <prefix>-el-01.png. The default prefix is
// the URL slug, then -webkit or -firefox for those engines, then the device slug or -mobile.
// For the home page: ai-agency-website, ...-mobile, ...-firefox, ...-webkit-iphone-15.
//
// Engines: a device runs in whatever --engine says, with a note when that is not its own engine
// (iPhones and iPads are WebKit; Pixels and Galaxies are Chromium). Firefox honours isMobile in
// playwright-core 1.64 (the meta viewport applies); if an installed playwright-core refuses
// isMobile in Firefox, the script says so and suggests --engine webkit or a --width/--height window.
// Playwright's WebKit on Windows draws variable fonts at a single weight and paints no
// backdrop-filter blur (real Safari does both), so a webkit run prints a note: use it for layout,
// overflow and script errors, not for judging type weight or the header glass. WebKit and Firefox
// cap one image at 32767 device px a side, so --full on a long page at DPR 2-3 fails there; use chunks.
//
// Dev server: the Vite HMR socket is answered locally, so another agent's file save can't
// live-reload the page mid-capture; every run loads the current code fresh anyway.
//
// The script always prints an "engine:" line (engine, version, viewport), console errors,
// page errors and failed requests, then a final "ERRORS: <n>" line, so agents can grep for problems.

import { chromium, webkit, firefox, devices } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ENGINES = { chromium, webkit, firefox };
// Requests cancelled by a navigation or teardown, as each engine words it.
const ABORTED = /ERR_ABORTED|NS_BINDING_ABORTED|Load request cancelled/;

function parseArgs(argv) {
  const opts = { clicks: [], scroll: true, wait: 800, maxChunks: 30, width: 1440, height: 900, engine: 'chromium' };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--out': opts.out = next(); break;
      case '--name': opts.name = next(); break;
      case '--mobile': opts.mobile = true; break;
      case '--width': opts.width = Number(next()); opts.widthSet = true; break;
      case '--height': opts.height = Number(next()); opts.heightSet = true; break;
      case '--full': opts.full = true; break;
      case '--max-chunks': opts.maxChunks = Number(next()); break;
      case '--selector': opts.selector = next(); break;
      case '--click': opts.clicks.push(next()); break;
      case '--wait': opts.wait = Number(next()); break;
      case '--no-scroll': opts.scroll = false; break;
      case '--reduced-motion': opts.reducedMotion = true; break;
      case '--dark': opts.dark = true; break;
      case '--browser': opts.browser = next(); break;
      case '--engine': opts.engine = String(next() || '').toLowerCase(); break;
      case '--device': opts.device = next() ?? ''; break;
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

const squash = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

// Exact name first, then ignoring case, spaces and dashes ("iphone-15" finds "iPhone 15").
function findDevice(name) {
  if (devices[name]) return name;
  return Object.keys(devices).find((k) => squash(k) === squash(name));
}

function similarDevices(name) {
  const words = name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return Object.keys(devices)
    .filter((k) => !k.endsWith(' landscape'))
    .map((k) => [k, words.filter((w) => k.toLowerCase().includes(w)).length])
    .filter(([, score]) => score)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k]) => k);
}

async function launch(engine, preferred) {
  if (engine !== 'chromium') {
    try {
      return { browser: await ENGINES[engine].launch({ headless: true }), label: engine };
    } catch (err) {
      if (/Executable doesn't exist/i.test(err.message)) {
        throw new Error(`Playwright's ${engine} build is not installed; run: npx playwright-core install ${engine}`);
      }
      throw err;
    }
  }
  const order = preferred === 'msedge' ? ['msedge', 'chrome'] : ['chrome', 'msedge'];
  let lastErr;
  for (const channel of order) {
    try {
      return { browser: await chromium.launch({ channel, headless: true }), label: `chromium (${channel})` };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

const firstLine = (msg) => String(msg).split('\n')[0];

const opts = parseArgs(process.argv.slice(2));
if (opts.device === 'list') {
  console.log(Object.keys(devices).join('\n'));
  process.exit(0);
}
if (!opts.target) {
  console.error(
    'usage: node scripts/shot.mjs <url | file> [--mobile] [--full] [--selector css] [--out dir] ' +
      '[--engine chromium|webkit|firefox] [--device "iPhone 15"]',
  );
  process.exit(2);
}
if (!ENGINES[opts.engine]) {
  console.error(`unknown --engine "${opts.engine}" (use chromium, webkit or firefox)`);
  process.exit(2);
}

const notes = [];
let deviceName;
let contextOpts;
if (opts.device !== undefined) {
  deviceName = opts.device && findDevice(opts.device);
  if (!deviceName) {
    const close = opts.device ? similarDevices(opts.device) : [];
    console.error(
      (opts.device ? `unknown --device "${opts.device}"` : '--device needs a name, e.g. "iPhone 15"') +
        (close.length ? `; close matches: ${close.join(', ')}` : '') +
        ' (--device list prints every name)',
    );
    process.exit(2);
  }
  const { defaultBrowserType, ...descriptor } = devices[deviceName];
  contextOpts = { ...descriptor, viewport: { ...descriptor.viewport } };
  if (opts.widthSet) contextOpts.viewport.width = opts.width;
  if (opts.heightSet) contextOpts.viewport.height = opts.height;
  if (opts.mobile) notes.push('note: --device replaces --mobile');
  if (defaultBrowserType !== opts.engine) {
    notes.push(
      `note: "${deviceName}" is a ${defaultBrowserType} device; this run emulates it in ${opts.engine} ` +
        `(add --engine ${defaultBrowserType} to match)`,
    );
  }
} else if (opts.mobile) {
  contextOpts = {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  };
} else {
  contextOpts = { viewport: { width: opts.width, height: opts.height }, deviceScaleFactor: 1 };
}
if (opts.reducedMotion) contextOpts.reducedMotion = 'reduce';
if (opts.dark) contextOpts.colorScheme = 'dark';
if (opts.browser && opts.engine !== 'chromium') notes.push('note: --browser only applies to --engine chromium');
if (opts.engine === 'webkit' && process.platform === 'win32') {
  notes.push(
    "note: Playwright's WebKit on Windows ignores variable-font axes (Fraunces and Geist draw at one weight, " +
      'so line breaks shift too) and paints no backdrop-filter blur; real Safari does both. Judge layout and ' +
      'behaviour here, type and the header glass in Chrome/Firefox or on a real Safari',
  );
}

const url = toUrl(opts.target);
const outDir = path.resolve(opts.out || '.shots');
fs.mkdirSync(outDir, { recursive: true });
const deviceSlug = deviceName && deviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const variant = [opts.engine !== 'chromium' && opts.engine, deviceSlug || (opts.mobile && 'mobile')].filter(Boolean);
const name = opts.name || [defaultName(url), ...variant].join('-');
const vp = contextOpts.viewport;

let browser;
let context;
try {
  const launched = await launch(opts.engine, opts.browser);
  browser = launched.browser;
  const traits = [contextOpts.isMobile && 'isMobile', contextOpts.hasTouch && 'touch'].filter(Boolean);
  console.log(
    `engine: ${launched.label} ${browser.version()}, ${deviceName || (opts.mobile ? 'mobile' : 'desktop')} ` +
      `${vp.width}x${vp.height} @${contextOpts.deviceScaleFactor || 1}x${traits.length ? ', ' + traits.join(', ') : ''}`,
  );
  for (const n of notes) console.log(n);
  context = await browser.newContext(contextOpts);
  // Answer the dev server's HMR socket (Vite's ws://...?token=...) locally, so a file saved
  // elsewhere mid-capture can't live-reload the page out from under the script.
  await context.routeWebSocket(/[?&]token=/, () => {});
} catch (err) {
  if (browser) await browser.close();
  if (opts.engine === 'firefox' && contextOpts.isMobile && /isMobile/i.test(err.message)) {
    console.log(
      `${deviceName ? `--device "${deviceName}"` : '--mobile'} needs isMobile, which this playwright-core cannot ` +
        `emulate in Firefox (${firstLine(err.message)}). For the phone itself use --engine webkit (iPhone Safari) ` +
        `or --engine chromium; for a phone-width Firefox window use --engine firefox --width ${vp.width} --height ${vp.height}.`,
    );
  } else {
    console.log(`${browser ? 'browser context' : 'launch'} failed (${opts.engine}): ${firstLine(err.message)}`);
  }
  console.log('ERRORS: 1');
  process.exit(1);
}
const page = await context.newPage();

const problems = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') problems.push(`console.error: ${msg.text()}`);
});
page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
page.on('requestfailed', (req) => {
  const failure = req.failure()?.errorText || 'failed';
  if (!ABORTED.test(failure)) problems.push(`requestfailed: ${req.url()} (${failure})`);
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
  const tooTall = /larger than 32767/.test(err.message);
  problems.push(
    tooTall
      ? `script error: ${firstLine(err.message)} (WebKit and Firefox cap one image at 32767 device px a side, ` +
          'and --full on a tall page at DPR 2-3 goes past it; drop --full to capture chunks)'
      : `script error: ${err.message}`,
  );
} finally {
  await browser.close();
}

for (const f of written) console.log(`wrote ${f}`);
for (const p of problems) console.log(p);
console.log(`ERRORS: ${problems.length}`);
