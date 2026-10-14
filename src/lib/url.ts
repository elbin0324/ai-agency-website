// Base-aware links (ARCHITECTURE.md). The site lives under /ai-agency-website/ on GitHub Pages,
// so every internal href and every public/ asset goes through url().
//
//   url('/services/sales/')        -> '/ai-agency-website/services/sales/'
//   url('/results/#methodology')   -> '/ai-agency-website/results/#methodology'
//   url('/favicon.svg')            -> '/ai-agency-website/favicon.svg'
//   url('#faq'), url('mailto:…'), url('https://…')  -> returned unchanged

const BASE = import.meta.env.BASE_URL; // '/ai-agency-website' or '/ai-agency-website/' depending on config

/** True for hrefs that must not get the base: absolute URLs, protocol links, in-page anchors, queries. */
export function isExternal(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

/** Prefix an internal root-relative path with the site base. */
export function url(path = '/'): string {
  if (!path) path = '/';
  if (isExternal(path) || path.startsWith('#') || path.startsWith('?')) return path;
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rel = path.startsWith('/') ? path : `/${path}`;
  if (base && (rel === base || rel.startsWith(`${base}/`))) return rel; // already prefixed
  return `${base}${rel}`;
}

/** Strip the base and any hash/query, and normalize to a trailing slash: '/ai-agency-website/demos' -> '/demos/'. */
export function stripBase(pathname: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  let p = pathname.split(/[?#]/)[0] || '/';
  if (base && (p === base || p.startsWith(`${base}/`))) p = p.slice(base.length) || '/';
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p = `${p}/`;
  return p;
}

/**
 * Is `href` the current page (or, with `{ section: true }`, an ancestor section of it)?
 *   isActive('/services/', Astro.url.pathname)                    // exact page only
 *   isActive('/services/', Astro.url.pathname, { section: true }) // also /services/sales/
 * Use it for aria-current="page" on nav links.
 */
export function isActive(href: string, currentPath: string, opts: { section?: boolean } = {}): boolean {
  if (isExternal(href) || href.startsWith('#')) return false;
  const target = stripBase(href);
  const current = stripBase(currentPath);
  if (target === current) return true;
  return !!opts.section && target !== '/' && current.startsWith(target);
}
