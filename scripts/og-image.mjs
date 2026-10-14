#!/usr/bin/env node
// Renders public/og.png (1200 × 630) and public/apple-touch-icon.png (180 × 180) with the local
// Chrome, per DESIGN.md §8.3: navy-800 field, the rising-H mark, site.name in Fraunces and the
// tagline in Geist, nothing under 24px. Name and taglines are read from src/config/site.ts,
// so re-run this after renaming the firm:  node scripts/og-image.mjs

import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteSrc = fs.readFileSync(path.join(ROOT, 'src/config/site.ts'), 'utf8');
const pick = (re, fallback) => siteSrc.match(re)?.[1] ?? fallback;
const name = pick(/const name = '([^']+)'/, 'Halyard');
const tagline = pick(/tagline: '([^']+)'/, '');
const taglineAlt = pick(/taglineAlt: '([^']+)'/, '');

const font = (pkg, file) => {
  const p = path.join(ROOT, 'node_modules/@fontsource-variable', pkg, 'files', file);
  return `url(data:font/woff2;base64,${fs.readFileSync(p).toString('base64')}) format('woff2')`;
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const mark = (accent) => `<svg viewBox="0 0 32 32" aria-hidden="true">
  <rect x="6" y="10" width="4" height="17" rx=".6" fill="currentColor"/>
  <rect x="22" y="4" width="4" height="23" rx=".6" fill="currentColor"/>
  <path d="M10 19.2 22 11.2v4.4l-12 8z" fill="${accent}"/></svg>`;

const css = `
@font-face { font-family: Fraunces; src: ${font('fraunces', 'fraunces-latin-opsz-normal.woff2')}; font-weight: 100 900; }
@font-face { font-family: Geist; src: ${font('geist', 'geist-latin-wght-normal.woff2')}; font-weight: 100 900; }
@font-face { font-family: GeistMono; src: ${font('geist-mono', 'geist-mono-latin-wght-normal.woff2')}; font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; }
body { position: relative; overflow: hidden; color: #F3EDE1; font-family: Geist, sans-serif;
  background: radial-gradient(1100px 520px at 50% -10%, rgb(38 71 110 / .55), transparent 70%), #0E2136; }
body::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 6px; background: linear-gradient(90deg, #8E6A2E, #D1AE6C 45%, #8E6A2E); }
body::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(rgb(169 180 194 / .045) 1px, transparent 1px), linear-gradient(90deg, rgb(169 180 194 / .045) 1px, transparent 1px);
  background-size: 80px 80px; -webkit-mask-image: radial-gradient(900px 500px at 50% 0%, #000, transparent 75%); }
.card { position: absolute; inset: 0; z-index: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 96px; }
.brand { display: flex; align-items: center; gap: 26px; }
.brand svg { width: 104px; height: 104px; }
.word { font-family: Fraunces, serif; font-size: 112px; font-weight: 470; letter-spacing: -0.018em; line-height: 1; font-optical-sizing: auto; }
.rule { width: 120px; height: 2px; margin: 48px 0 40px; background: #B8904A; }
.tag { font-size: 52px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.1; }
.alt { margin-top: 18px; font-size: 32px; color: #A9B4C2; line-height: 1.3; }
.foot { position: absolute; left: 96px; right: 96px; bottom: 56px; z-index: 1; font-family: GeistMono, monospace; font-size: 24px; letter-spacing: 0.14em; text-transform: uppercase; color: #93A0B2; }
`;

const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="card">
  <div class="brand" style="color:#F3EDE1">${mark('#D1AE6C')}<span class="word">${esc(name)}</span></div>
  <div class="rule"></div>
  <p class="tag">${esc(tagline)}</p>
  ${taglineAlt ? `<p class="alt">${esc(taglineAlt)}</p>` : ''}
</div>
<p class="foot">AI Agents · Marketing · Sales · Consulting</p>
</body></html>`;

// Apple touch icon: the favicon drawing (DESIGN.md §8.3), full-bleed (iOS rounds the corners).
const iconHtml = `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}html,body{width:180px;height:180px;background:#0E2136}svg{display:block;width:180px;height:180px}</style></head><body>
<svg viewBox="0 0 32 32"><rect width="32" height="32" fill="#0E2136"/><rect x="8" y="11" width="3.4" height="14" rx=".5" fill="#F3EDE1"/><rect x="20.6" y="6.5" width="3.4" height="18.5" rx=".5" fill="#F3EDE1"/><path d="M11.4 18.9 20.6 12.7v3.7l-9.2 6.2z" fill="#D1AE6C"/></svg>
</body></html>`;

async function launch() {
  let lastErr;
  for (const channel of ['chrome', 'msedge']) {
    try { return await chromium.launch({ channel, headless: true }); } catch (err) { lastErr = err; }
  }
  throw lastErr;
}

const browser = await launch();
try {
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await og.setContent(ogHtml, { waitUntil: 'load' });
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: path.join(ROOT, 'public/og.png') });
  const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
  await icon.setContent(iconHtml, { waitUntil: 'load' });
  await icon.screenshot({ path: path.join(ROOT, 'public/apple-touch-icon.png') });
  console.log(`wrote public/og.png and public/apple-touch-icon.png for "${name}"`);
} finally {
  await browser.close();
}
