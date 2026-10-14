#!/usr/bin/env node
// Site audit for QA. For each route it runs two passes in the chosen engine (the local
// Chrome by default):
//   1. motion pass (desktop): loads the page with animations on, scrolls through it and
//      lets demos run for a few seconds, collecting console errors, page errors and
//      failed requests;
//   2. static pass (desktop + mobile, prefers-reduced-motion): checks horizontal overflow
//      (and which elements cause it), images without alt text, and axe-core
//      accessibility violations.
//
// Usage:
//   node scripts/audit.mjs [--base <url>] [--routes /,/services/] [--all-impacts] [--json <file>]
//                          [--engine chromium|webkit|firefox] [--device "<name>"]
//
// Defaults: --base http://localhost:4321/ai-agency-website, every route in the site map,
// axe impacts "serious" and "critical" only. Exit code 1 when any problem is found.
//
// --engine <name>    chromium (default: the local Chrome, falling back to Edge), webkit
//                    (Safari's engine) or firefox. webkit and firefox use Playwright's own
//                    builds; install them once with: npx playwright-core install webkit firefox
//                    axe runs in all three; if it can't run on a page, that check is skipped
//                    and a "note" line says why (notes don't count as problems).
// --device "<name>"  a Playwright device descriptor, e.g. "iPhone 15" (pair with --engine
//                    webkit for iPhone Safari) or "Pixel 7". It replaces the built-in 390x844
//                    mobile profile, and it also gets a motion pass, so script errors in the
//                    mobile layout show up (as "runtime  [mobile] ..."). Case-insensitive;
//                    dashes work instead of spaces; "--device list" prints every name.
//
// Example: node scripts/audit.mjs --engine webkit --device "iPhone 15" --routes /,/demos/
//
// The first line names the engine, its version and both profiles; the last is "PROBLEMS: <n>".
// The Vite HMR socket is answered locally, so a file saved mid-audit can't reload a page.
// Playwright's WebKit on Windows draws variable fonts at one (wider) weight, so an overflow
// that only WebKit reports there is worth confirming in Chrome/Firefox or a real Safari.

import { chromium, webkit, firefox, devices } from 'playwright-core';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const ENGINES = { chromium, webkit, firefox };
// Requests cancelled by a navigation or teardown, as each engine words it.
const ABORTED = /ERR_ABORTED|NS_BINDING_ABORTED|Load request cancelled/;
const DESKTOP = { viewport: { width: 1440, height: 900 } };
const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const DEFAULT_ROUTES = [
  '/',
  '/services/',
  '/services/ai-agents/',
  '/services/marketing/',
  '/services/sales/',
  '/services/consulting/',
  '/demos/',
  '/results/',
  '/approach/',
  '/contact/',
  '/404/',
];

// Git Bash (MSYS) rewrites arguments that start with "/" into Windows paths
// ("/services/" -> "C:/Program Files/Git/services/"). Undo that, and accept
// routes written without a leading slash.
function normalizeRoute(raw) {
  let r = raw.trim().replace(/\\/g, '/');
  if (!r) return null;
  const msys = r.match(/^[A-Za-z]:\/.*?\/Git(\/.*)?$/);
  if (msys) r = msys[1] || '/';
  if (!r.startsWith('/')) r = '/' + r;
  return r;
}

function parseArgs(argv) {
  const opts = { base: 'http://localhost:4321/ai-agency-website', routes: DEFAULT_ROUTES, allImpacts: false, engine: 'chromium' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base') opts.base = argv[++i].replace(/\/$/, '');
    else if (a === '--routes') opts.routes = argv[++i].split(',').map(normalizeRoute).filter(Boolean);
    else if (a === '--all-impacts') opts.allImpacts = true;
    else if (a === '--json') opts.json = argv[++i];
    else if (a === '--engine') opts.engine = String(argv[++i] || '').toLowerCase();
    else if (a === '--device') opts.device = argv[++i] ?? '';
  }
  return opts;
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

const firstLine = (msg) => String(msg).split('\n')[0];

const describeProfile = (o) =>
  `${o.viewport.width}x${o.viewport.height} @${o.deviceScaleFactor || 1}x` +
  [o.isMobile && 'isMobile', o.hasTouch && 'touch'].filter(Boolean).map((t) => `, ${t}`).join('');

async function launch(engine) {
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
  for (const channel of ['chrome', 'msedge']) {
    try {
      return { browser: await chromium.launch({ channel, headless: true }), label: `chromium (${channel})` };
    } catch {}
  }
  throw new Error('No Chrome or Edge found');
}

// Every page gets a context whose Vite HMR socket (ws://...?token=...) is answered locally,
// so a file saved elsewhere mid-audit can't live-reload the page being checked.
async function newContext(browser, ctxOpts) {
  const ctx = await browser.newContext({ ...ctxOpts });
  await ctx.routeWebSocket(/[?&]token=/, () => {});
  return ctx;
}

function watch(page, sink, prefix = '') {
  const add = (msg) => sink.push(prefix + msg);
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    // /404/ answers 404 on purpose (see the response filter below); Chromium and WebKit
    // also log that status as a console error, Firefox doesn't.
    if (msg.text().startsWith('Failed to load resource') && msg.location().url.endsWith('/404/')) return;
    add(`console.error: ${msg.text()}`);
  });
  page.on('pageerror', (err) => add(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    const failure = req.failure()?.errorText || 'failed';
    if (!ABORTED.test(failure)) add(`requestfailed: ${req.url()} (${failure})`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().endsWith('/404/')) add(`http ${res.status()}: ${res.url()}`);
  });
}

async function scrollThrough(page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize().height;
  for (let y = 0; y < total; y += Math.round(vh * 0.7)) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
}

async function staticChecks(page, allImpacts) {
  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    if (scrollW <= vw + 1) return null;
    const clips = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) return true;
      }
      return false;
    };
    const describe = (el) => {
      const parts = [];
      for (let e = el, i = 0; e && e !== document.body && i < 3; e = e.parentElement, i++) {
        let s = e.tagName.toLowerCase();
        if (e.id) s += `#${e.id}`;
        else if (e.classList.length) s += '.' + [...e.classList].slice(0, 2).join('.');
        parts.unshift(s);
      }
      return parts.join(' > ');
    };
    const offenders = [];
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > vw + 1 && !clips(el)) offenders.push(`${describe(el)} (right edge ${Math.round(r.right)}px)`);
      if (offenders.length >= 8) break;
    }
    return { scrollWidth: scrollW, viewport: vw, offenders };
  });

  const missingAlt = await page.evaluate(() =>
    [...document.querySelectorAll('img:not([alt])')].map((img) => img.getAttribute('src')).slice(0, 10),
  );

  // axe-core runs in Chromium, WebKit and Firefox alike; if it can't run on a page
  // (injection blocked, engine error), skip it there and say why instead of failing the route.
  let violations = [];
  let axeSkipped;
  try {
    await page.addScriptTag({ content: axeSource });
    violations = await page.evaluate(async (all) => {
      const res = await window.axe.run(document, { resultTypes: ['violations'] });
      return res.violations
        .filter((v) => all || v.impact === 'serious' || v.impact === 'critical')
        .map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} :: ${(n.failureSummary || '').split('\n').slice(1, 2).join(' ').trim()}`),
          count: v.nodes.length,
        }));
    }, allImpacts);
  } catch (err) {
    axeSkipped = firstLine(err.message);
  }

  return { overflow, missingAlt, violations, ...(axeSkipped && { axeSkipped }) };
}

const opts = parseArgs(process.argv.slice(2));
if (opts.device === 'list') {
  console.log(Object.keys(devices).join('\n'));
  process.exit(0);
}
if (!ENGINES[opts.engine]) {
  console.error(`unknown --engine "${opts.engine}" (use chromium, webkit or firefox)`);
  process.exit(2);
}

const notes = [];
let mobileOpts = MOBILE;
let deviceName;
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
  mobileOpts = descriptor;
  if (defaultBrowserType !== opts.engine) {
    notes.push(
      `note: "${deviceName}" is a ${defaultBrowserType} device; this run emulates it in ${opts.engine} ` +
        `(add --engine ${defaultBrowserType} to match)`,
    );
  }
}
if (opts.engine === 'webkit' && process.platform === 'win32') {
  notes.push(
    "note: Playwright's WebKit on Windows draws variable fonts at one (wider) weight; confirm a webkit-only " +
      'overflow in Chrome/Firefox or a real Safari',
  );
}

let browser;
let label;
try {
  ({ browser, label } = await launch(opts.engine));
} catch (err) {
  console.log(`launch failed (${opts.engine}): ${firstLine(err.message)}`);
  console.log('PROBLEMS: 1');
  process.exit(1);
}

// playwright-core 1.64 emulates isMobile in Firefox (the meta viewport applies). Releases that
// refuse it get the mobile profile as a plain window of the same size, with a note saying so.
if (opts.engine === 'firefox' && mobileOpts.isMobile) {
  try {
    await (await browser.newContext(mobileOpts)).close();
  } catch (err) {
    if (!/isMobile/i.test(err.message)) throw err;
    const { isMobile, ...rest } = mobileOpts;
    mobileOpts = rest;
    notes.push(
      `note: this playwright-core can't emulate isMobile in Firefox (${firstLine(err.message)}); the mobile ` +
        `pass runs as a plain ${rest.viewport.width}x${rest.viewport.height} window without the meta viewport`,
    );
  }
}

console.log(
  `engine: ${label} ${browser.version()}, desktop ${describeProfile(DESKTOP)}, ` +
    `mobile ${deviceName ? `${deviceName} ` : ''}${describeProfile(mobileOpts)}`,
);
for (const n of notes) console.log(n);

const report = [];
let problemCount = 0;

for (const route of opts.routes) {
  const url = opts.base + route;
  const entry = { route, engine: opts.engine, device: deviceName, runtime: [], desktop: null, mobile: null };

  // Pass 1: motion on; collect runtime errors while demos animate. Desktop always, and the
  // --device profile too when one is given.
  const motionProfiles = [['desktop', DESKTOP]];
  if (deviceName) motionProfiles.push(['mobile', mobileOpts]);
  for (const [key, ctxOpts] of motionProfiles) {
    const prefix = key === 'desktop' ? '' : `[${key}] `;
    const ctx = await newContext(browser, ctxOpts);
    const page = await ctx.newPage();
    watch(page, entry.runtime, prefix);
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      try {
        await page.waitForLoadState('networkidle', { timeout: 10000 });
      } catch {}
      await scrollThrough(page);
      await page.waitForTimeout(4000);
    } catch (err) {
      entry.runtime.push(`${prefix}navigation: ${err.message}`);
    }
    await ctx.close();
  }

  // Pass 2: reduced motion, desktop and mobile; static checks.
  for (const [key, ctxOpts] of [
    ['desktop', DESKTOP],
    ['mobile', mobileOpts],
  ]) {
    const ctx = await newContext(browser, { ...ctxOpts, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      try {
        await page.waitForLoadState('networkidle', { timeout: 10000 });
      } catch {}
      await scrollThrough(page);
      await page.waitForTimeout(500);
      entry[key] = await staticChecks(page, opts.allImpacts);
    } catch (err) {
      entry[key] = { error: err.message };
    }
    await ctx.close();
  }

  // Print a compact summary for this route.
  const lines = [];
  const routeNotes = [];
  for (const r of entry.runtime) lines.push(`  runtime  ${r}`);
  for (const key of ['desktop', 'mobile']) {
    const c = entry[key];
    if (!c) continue;
    if (c.error) lines.push(`  ${key}  error: ${c.error}`);
    if (c.overflow) {
      lines.push(`  ${key}  horizontal overflow: scrollWidth ${c.overflow.scrollWidth} > ${c.overflow.viewport}`);
      for (const o of c.overflow.offenders) lines.push(`      ${o}`);
    }
    if (c.missingAlt?.length) lines.push(`  ${key}  img without alt: ${c.missingAlt.join(', ')}`);
    for (const v of c.violations || []) {
      lines.push(`  ${key}  axe ${v.impact} ${v.id} (${v.count}): ${v.help}`);
      for (const n of v.nodes) lines.push(`      ${n}`);
    }
    if (c.axeSkipped) routeNotes.push(`  note  ${key} axe skipped in ${opts.engine}: ${c.axeSkipped}`);
  }
  problemCount += lines.length;
  console.log(`${lines.length ? 'FAIL' : 'ok  '} ${route}`);
  for (const l of lines) console.log(l);
  for (const n of routeNotes) console.log(n);
  report.push(entry);
}

await browser.close();
if (opts.json) fs.writeFileSync(opts.json, JSON.stringify(report, null, 2));
console.log(`PROBLEMS: ${problemCount}`);
process.exit(problemCount ? 1 : 0);
