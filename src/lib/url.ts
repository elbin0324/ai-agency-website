// Base-aware links (ARCHITECTURE.md). The site is served at the root of halyard.solutions (base '/'), but
// every internal href and every public/ asset still goes through url(), so moving it under a base path
// (for example /ai-agency-website/ on a GitHub Pages project URL) needs only astro.config.mjs.
//
//   url('/services/sales/')        -> '/services/sales/'           (base '/ai-agency-website': '/ai-agency-website/services/sales/')
//   url('/results/#methodology')   -> '/results/#methodology'
//   url('/favicon.svg')            -> '/favicon.svg'
//   url('#faq'), url('mailto:…'), url('https://…')  -> returned unchanged

const BASE = import.meta.env.BASE_URL; // '/' today; '/ai-agency-website' or '/ai-agency-website/' under a base path

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

/** Strip the base and any hash/query, and normalize to a trailing slash: '/demos' -> '/demos/' (and '/ai-agency-website/demos' -> '/demos/' under that base). */
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

// ---------- Contact links with context
// Page-level CTAs and demo result cards pass what the visitor chose, so the intake can preselect it
// and record where the lead came from (the header CTA stays plain). The intake reads:
//   ?interest=<Interest>  preselects the matching priority (contactInterests gives the intake's label)
//   ?plan=<Plan>          the engagement model picked on /approach/
//   ?from=<page>          written into the hidden source field, e.g. "services/sales" or "demo-result"
//
//   contactUrl({ interest: 'sales', from: 'services/sales' })
//     -> '/contact/?interest=sales&from=services%2Fsales'

export type Interest = 'customer-agent' | 'analyst-agent' | 'executive-assistant' | 'marketing' | 'sales' | 'consulting';
export type Plan = 'pilot' | 'managed' | 'partner';

/** Interest id -> the agent or service name the intake shows beside each priority (intake.ts `goals[].sub`). */
export const contactInterests: Record<Interest, string> = {
  'customer-agent': 'Customer Agent',
  'analyst-agent': 'Analyst Agent',
  'executive-assistant': 'Executive Assistant',
  marketing: 'Marketing Director',
  sales: 'Sales Agent',
  consulting: 'AI Consulting',
};

/** Base-aware /contact/ link carrying the visitor's context. With no options it is the plain contact URL. */
export function contactUrl(opts: { interest?: Interest; plan?: Plan; from?: string } = {}): string {
  const q = new URLSearchParams();
  if (opts.interest) q.set('interest', opts.interest);
  if (opts.plan) q.set('plan', opts.plan);
  if (opts.from) q.set('from', opts.from);
  const qs = q.toString();
  return url(qs ? `/contact/?${qs}` : '/contact/');
}
