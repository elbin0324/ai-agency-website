#!/usr/bin/env node
// Built-site link check. Crawls every HTML file under dist/ and verifies that each internal
// href / src resolves to a file in the build, and that every #fragment exists on its target page.
//
// Usage:
//   npx astro build && node scripts/check-links.mjs            # checks dist/
//   node scripts/check-links.mjs path/to/out --base /ai-agency-website
//
// Internal = root-relative ("/ai-agency-website/demos/"), relative ("../demos/", "#faq") or an
// absolute URL on the configured site + base (canonical tags). A root-relative link WITHOUT the base
// ("/demos/") is reported, because it breaks on GitHub Pages. Directory URLs resolve to index.html.
// External links (http to other hosts, mailto:, tel:, data:, javascript:) are skipped.
// The base and site default to the values in astro.config.mjs. Exits 1 when anything is broken.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readConfig() {
  try {
    const src = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
    const base = src.match(/^\s*base:\s*['"]([^'"]*)['"]/m)?.[1] ?? '/';
    const site = src.match(/^\s*site:\s*['"]([^'"]*)['"]/m)?.[1] ?? '';
    return { base, site };
  } catch {
    return { base: '/', site: '' };
  }
}

const args = process.argv.slice(2);
const cfg = readConfig();
let distDir = path.join(ROOT, 'dist');
let base = cfg.base;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--base') base = args[++i];
  else distDir = path.resolve(args[i]);
}
base = '/' + base.replace(/^\/+|\/+$/g, ''); // '/ai-agency-website' or '/'
if (base !== '/') base += '/';
const siteOrigin = cfg.site.replace(/\/+$/, '');

if (!fs.existsSync(distDir)) {
  console.error(`No build found at ${distDir}. Run "npx astro build" first.`);
  process.exit(2);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** Attribute values worth checking, with script bodies, styles and comments removed. */
function extractRefs(html) {
  const clean = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1</script>')
    .replace(/(<style\b[^>]*>)[\s\S]*?<\/style>/gi, '$1</style>');
  const refs = [];
  const tagRe = /<([a-z][a-z0-9-]*)\b([^>]*)>/gi;
  let m;
  while ((m = tagRe.exec(clean))) {
    const attrs = m[2];
    const attrRe = /\s(href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/gi;
    let a;
    while ((a = attrRe.exec(attrs))) refs.push({ tag: m[1].toLowerCase(), attr: a[1].toLowerCase(), value: decode(a[2] ?? a[3] ?? a[4] ?? '') });
  }
  return refs;
}

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const ids = new Set();
    for (const m of html.matchAll(/\s(?:id|name)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/gi)) ids.add(decode(m[1] ?? m[2] ?? m[3]));
    idCache.set(file, ids);
  }
  return idCache.get(file);
}

/** Map a URL pathname (with the base) to a file in dist, or null. */
function resolveFile(pathname) {
  let p;
  try { p = decodeURIComponent(pathname); } catch { p = pathname; }
  if (base !== '/') {
    if (p === base.slice(0, -1)) p = base;
    if (!p.startsWith(base)) return { file: null, reason: `missing base ${base}` };
    p = '/' + p.slice(base.length);
  }
  const rel = p.replace(/^\/+/, '');
  const candidates = p.endsWith('/') ? [path.join(rel, 'index.html')] : [rel, `${rel}.html`, path.join(rel, 'index.html')];
  for (const c of candidates) {
    const f = path.join(distDir, c);
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return { file: f };
  }
  return { file: null, reason: 'not found in build' };
}

const pages = walk(distDir);
const broken = [];
let checked = 0;

for (const page of pages) {
  const relPage = path.relative(distDir, page).split(path.sep).join('/');
  // The URL this file is served at: dist/demos/index.html -> /base/demos/
  const pageUrl = new URL(base + relPage.replace(/(^|\/)index\.html$/, '$1'), 'http://x');
  for (const { tag, attr, value } of extractRefs(fs.readFileSync(page, 'utf8'))) {
    const v = value.trim();
    if (!v || /^(mailto:|tel:|data:|javascript:|sms:|blob:)/i.test(v)) continue;
    let target;
    if (/^(https?:)?\/\//i.test(v)) {
      const abs = v.startsWith('//') ? `https:${v}` : v;
      if (!siteOrigin || !abs.startsWith(siteOrigin + base)) continue; // external
      target = new URL(abs.slice(siteOrigin.length), 'http://x');
    } else if (/^[a-z][a-z0-9+.-]*:/i.test(v)) {
      continue; // other schemes
    } else {
      if (v.startsWith('/') && base !== '/' && !v.startsWith(base) && v !== base.slice(0, -1)) {
        broken.push({ page: relPage, tag, attr, value: v, reason: `root-relative link without the base ${base}` });
        checked++;
        continue;
      }
      target = new URL(v, pageUrl);
    }
    checked++;
    const { file, reason } = resolveFile(target.pathname);
    if (!file) {
      broken.push({ page: relPage, tag, attr, value: v, reason });
      continue;
    }
    const frag = target.hash ? decodeURIComponent(target.hash.slice(1)) : '';
    if (frag && file.endsWith('.html') && !idsOf(file).has(frag)) {
      broken.push({ page: relPage, tag, attr, value: v, reason: `#${frag} not found on ${path.relative(distDir, file).split(path.sep).join('/')}` });
    }
  }
}

if (broken.length) {
  const byPage = Map.groupBy ? Map.groupBy(broken, (b) => b.page) : broken.reduce((m, b) => m.set(b.page, [...(m.get(b.page) ?? []), b]), new Map());
  console.log(`Broken links: ${broken.length} (of ${checked} checked across ${pages.length} pages)\n`);
  for (const [page, list] of byPage) {
    console.log(page);
    for (const b of list) console.log(`  <${b.tag} ${b.attr}="${b.value}">  ${b.reason}`);
  }
  process.exit(1);
}
console.log(`OK: ${checked} internal links and fragments checked across ${pages.length} pages (base ${base}).`);
