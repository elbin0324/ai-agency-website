#!/usr/bin/env node
// Renders the share card (og:image) and writes public/og.png at exactly 1200 x 630.
//
// The card is the internal page src/pages/dev/og.astro, which takes the brand name, headline and service
// line from src/config/site.ts and the console from the hero console's sample data. This script opens it
// on the dev server with the local Chrome (or Edge) through playwright-core, at deviceScaleFactor 1, and
// saves a screenshot of it. After renaming the firm:  npm run dev,  then  npm run og,  then  npm run deploy.
//
// Usage:
//   npm run og                                          renders http://localhost:4321/ai-agency-website/dev/og/
//   npm run og -- http://localhost:4321/dev/og/         another URL (another port, or base '/')
//   npm run og -- --out .shots/og/card.png              write somewhere other than public/og.png
//
// It writes nothing (exit 1) if the page is missing, shows an error, is not 1200 x 630, logs console
// errors, still uses fallback fonts or reports that its text does not fit, so a bad render never
// replaces a good card.

import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_URL = 'http://localhost:4321/ai-agency-website/dev/og/';
const WIDTH = 1200;
const HEIGHT = 630;

class Abort extends Error {}
const abort = (message) => {
  throw new Abort(message);
};

function parseArgs(argv) {
  const opts = { url: DEFAULT_URL, out: path.join(ROOT, 'public', 'og.png') };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out' && argv[i + 1]) opts.out = path.resolve(argv[++i]);
    else if (a === '--help' || a === '-h') opts.help = true;
    else if (/^https?:\/\//i.test(a)) opts.url = a;
    else {
      console.error(`make-og: unknown argument "${a}"`);
      opts.help = true;
      opts.bad = true;
    }
  }
  return opts;
}

async function launch() {
  let lastErr;
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch (err) {
      lastErr = err;
    }
  }
  abort(`could not start Chrome or Edge through playwright-core (${String(lastErr?.message).split('\n')[0]}).`);
}

/** Opens the card page and returns a 1200 x 630 PNG buffer of it. */
async function render(url) {
  const browser = await launch();
  try {
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce', // the card is static: this also stops any looping UI animation
    });
    const page = await context.newPage();

    const problems = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') problems.push(`console error: ${msg.text()}`);
    });
    page.on('pageerror', (err) => problems.push(`page error: ${err.message}`));
    page.on('requestfailed', (req) => {
      const why = req.failure()?.errorText || 'failed';
      if (!/ERR_ABORTED/.test(why)) problems.push(`request failed: ${req.url()} (${why})`);
    });
    page.on('response', (res) => {
      if (res.status() >= 400) problems.push(`HTTP ${res.status()}: ${res.url()}`);
    });

    let res;
    try {
      res = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    } catch (err) {
      if (/ERR_CONNECTION_REFUSED/.test(err.message)) {
        abort(`nothing answered at ${url}. Start the dev server first (npm run dev), then run npm run og again.`);
      }
      abort(`could not open ${url}: ${err.message.split('\n')[0]}`);
    }
    if (!res || !res.ok()) {
      abort(
        `${url} answered HTTP ${res?.status() ?? '?'}. If the dev server uses another port, or base in ` +
          'astro.config.mjs is no longer /ai-agency-website, pass the page URL: npm run og -- http://localhost:4321/dev/og/',
      );
    }
    try {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch {}
    await page.evaluate(() => document.fonts.ready);
    // The page fits the name, headline and service line to its column once the fonts are in, then sets
    // data-og-ready to "ok", or to "overflow" when even its smallest sizes do not fit.
    try {
      await page.waitForSelector('html[data-og-ready]', { state: 'attached', timeout: 15000 });
    } catch {
      abort(`the card page never finished laying out (no data-og-ready on <html>): ${url}`);
    }
    const fit = await page.evaluate(() => document.documentElement.dataset.ogReady);
    if (fit !== 'ok') {
      abort(
        'the name, headline or service line does not fit the card even at its smallest sizes. Shorten ' +
          'site.tagline or site.brandLine in src/config/site.ts, or adjust the layout in src/pages/dev/og.astro.',
      );
    }

    const info = await page.evaluate(() => {
      // Dev-only UI must never end up in the picture.
      document.querySelectorAll('astro-dev-toolbar').forEach((el) => el.remove());
      if (document.querySelector('vite-error-overlay')) return { error: 'the page shows a build error (open it in a browser to read it)' };
      const card = document.querySelector('[data-og-card]');
      if (!card) return { error: 'the page has no [data-og-card] element' };
      const r = card.getBoundingClientRect();

      // Every face the card's text asks for must be a loaded web font, not a system fallback.
      const first = (f) => f.split(',')[0].trim().replace(/^["']|["']$/g, '');
      const key = (family, style) => `${first(family)} ${style === 'italic' ? 'italic' : 'roman'}`;
      const needed = new Set();
      for (const el of card.querySelectorAll('*')) {
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        const cs = getComputedStyle(el);
        needed.add(key(cs.fontFamily, cs.fontStyle));
      }
      const loaded = new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => key(f.family, f.style)));
      return { x: r.x, y: r.y, width: r.width, height: r.height, missingFonts: [...needed].filter((k) => !loaded.has(k)) };
    });

    if (info.error) abort(`${info.error}: ${url}`);
    if (Math.round(info.width) !== WIDTH || Math.round(info.height) !== HEIGHT) {
      abort(`the card measures ${info.width} x ${info.height}, not ${WIDTH} x ${HEIGHT}.`);
    }
    if (info.missingFonts.length) abort(`fonts not loaded: ${info.missingFonts.join(', ')}.`);
    if (problems.length) abort(`the page reported problems:\n  ${problems.join('\n  ')}`);

    return await page.screenshot({
      clip: { x: info.x, y: info.y, width: WIDTH, height: HEIGHT },
      animations: 'disabled',
      caret: 'hide',
    });
  } finally {
    await browser.close();
  }
}

const opts = parseArgs(process.argv.slice(2));
if (opts.help) {
  console.log('usage: npm run og -- [url] [--out file.png]');
  console.log(`  default url: ${DEFAULT_URL} (needs the dev server: npm run dev)`);
  process.exit(opts.bad ? 2 : 0);
}

const rel = path.relative(ROOT, opts.out);
const outName = rel && !rel.startsWith('..') && !path.isAbsolute(rel) ? rel.split(path.sep).join('/') : opts.out;
try {
  const png = await render(opts.url);
  // The PNG header carries the pixel size: check it before replacing the file.
  const w = png.readUInt32BE(16);
  const h = png.readUInt32BE(20);
  if (w !== WIDTH || h !== HEIGHT) abort(`the screenshot came out ${w} x ${h}, not ${WIDTH} x ${HEIGHT}.`);

  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  fs.writeFileSync(opts.out, png);
  const kb = Math.round(png.length / 1024);
  console.log(`wrote ${outName} (${w} x ${h}, ${kb} KB) from ${opts.url}`);
  if (kb > 300) console.log('note: over 300 KB. Some apps (WhatsApp among them) skip share images that large.');
} catch (err) {
  if (!(err instanceof Abort)) throw err;
  console.error(`make-og: ${err.message}`);
  console.error(`make-og: ${outName} was not changed.`);
  process.exit(1);
}
