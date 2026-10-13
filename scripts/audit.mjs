#!/usr/bin/env node
// Site audit for QA. For each route it runs two passes in the local Chrome:
//   1. motion pass (desktop): loads the page with animations on, scrolls through it and
//      lets demos run for a few seconds, collecting console errors, page errors and
//      failed requests;
//   2. static pass (desktop + mobile, prefers-reduced-motion): checks horizontal overflow
//      (and which elements cause it), images without alt text, and axe-core
//      accessibility violations.
//
// Usage:
//   node scripts/audit.mjs [--base <url>] [--routes /,/services/] [--all-impacts] [--json <file>]
//
// Defaults: --base http://localhost:4321/ai-agency-website, every route in the site map,
// axe impacts "serious" and "critical" only. Exit code 1 when any problem is found.

import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

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
  const opts = { base: 'http://localhost:4321/ai-agency-website', routes: DEFAULT_ROUTES, allImpacts: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base') opts.base = argv[++i].replace(/\/$/, '');
    else if (a === '--routes') opts.routes = argv[++i].split(',').map(normalizeRoute).filter(Boolean);
    else if (a === '--all-impacts') opts.allImpacts = true;
    else if (a === '--json') opts.json = argv[++i];
  }
  return opts;
}

async function launch() {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {}
  }
  throw new Error('No Chrome or Edge found');
}

function watch(page, sink) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') sink.push(`console.error: ${msg.text()}`);
  });
  page.on('pageerror', (err) => sink.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    const failure = req.failure()?.errorText || 'failed';
    if (!/ERR_ABORTED/.test(failure)) sink.push(`requestfailed: ${req.url()} (${failure})`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().endsWith('/404/')) sink.push(`http ${res.status()}: ${res.url()}`);
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

  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async (all) => {
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

  return { overflow, missingAlt, violations };
}

const opts = parseArgs(process.argv.slice(2));
const browser = await launch();
const report = [];
let problemCount = 0;

for (const route of opts.routes) {
  const url = opts.base + route;
  const entry = { route, runtime: [], desktop: null, mobile: null };

  // Pass 1: motion on, desktop; collect runtime errors while demos animate.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    watch(page, entry.runtime);
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      try {
        await page.waitForLoadState('networkidle', { timeout: 10000 });
      } catch {}
      await scrollThrough(page);
      await page.waitForTimeout(4000);
    } catch (err) {
      entry.runtime.push(`navigation: ${err.message}`);
    }
    await ctx.close();
  }

  // Pass 2: reduced motion, desktop and mobile; static checks.
  for (const [key, ctxOpts] of [
    ['desktop', { viewport: { width: 1440, height: 900 } }],
    ['mobile', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ]) {
    const ctx = await browser.newContext({ ...ctxOpts, reducedMotion: 'reduce' });
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
  }
  problemCount += lines.length;
  console.log(`${lines.length ? 'FAIL' : 'ok  '} ${route}`);
  for (const l of lines) console.log(l);
  report.push(entry);
}

await browser.close();
if (opts.json) fs.writeFileSync(opts.json, JSON.stringify(report, null, 2));
console.log(`PROBLEMS: ${problemCount}`);
process.exit(problemCount ? 1 : 0);
