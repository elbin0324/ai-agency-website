# COMPONENTS.md: shared building blocks

Read with `DESIGN.md` (visuals), `ARCHITECTURE.md` (contracts) and `content/COPY.md` (words). Live test page: `http://localhost:4321/ai-agency-website/dev/primitives/` (source `src/pages/dev/primitives.astro`).

## Conventions

- **Imports** use the alias: `import Button from '@/components/ui/Button.astro'`. (`@/` maps to `src/` through `tsconfig.json` and a Vite alias in `astro.config.mjs`.)
- **Links:** every internal href and every `public/` asset goes through `url()` from `@/lib/url` (`url('/services/sales/')` gives `/ai-agency-website/services/sales/`). Page links end with `/`. `Button`, `Card`, `Logo`, `IllustrativeLabel` and `StatTile` already call `url()` for you: pass the root path (`href="/contact/"`). `isActive(href, Astro.url.pathname, { section: true })` drives `aria-current="page"`.
- **Brand name:** never typed. Use `site.name`, `site.tagline`, `site.email`, `site.cta` from `@/config/site`. `pageTitle('How we work')` gives "How we work | {site.name}".
- **Reveal:** add `data-reveal` (and optionally `data-reveal-delay="80"`, steps of 0/80/160/240) to block-level things below the first viewport. `BaseLayout` runs `initReveal()` from `@/scripts/reveal`; call it again with a root after injecting content.
- **Styles:** `src/styles/global.css` is a verbatim copy of `design-lab/reference/global.css` (tokens, base, every component class, reveal CSS, reduced-motion rules). Don't edit it. Changes go DESIGN.md, then the reference file, then src. Tailwind's default palette, type scale, radii and shadows are removed; use tokens (`text-fg-2`, `border-line`, `bg-raised`, `text-h3`, `rounded-card`, `shadow-float`, `max-w-measure`, `px-gutter`, `py-section`).
- **Surfaces:** use role utilities (`text-fg`, `text-fg-2`, `text-fg-3`, `border-line`, `text-accent`) so a block works on paper and inside navy. Dark context = `.band-navy`, `.ctx-dark`, `.app-window`, `.site-footer`.
- **Fonts** are imported in `BaseLayout.astro` (Fraunces opsz + italic, Geist, Geist Mono; one preload), per DESIGN.md §4.1. Families: `font-serif`, `font-sans`, `font-mono`.
- **Formatting** (`@/lib/format`): `currency(12400)` → `$12,400` (`{ cents: true }`), `number(18.46, 1)` → `18.5`, `percent(0.12)` → `12%` (`{ ratio: false }` for 12, `{ signed: true }` for deltas), `compact(4200, { currency: true })` → `$4.2K` (tight spaces only), `hours(18.46)` → `18.5 h` (`{ unit: 'hrs' }`), `multiple(2.14)` → `2.1x`.
- **Config** (`@/config/site`): `name, tagline, taglineAlt, brandLine, description, homeTitle, siteUrl, email` (placeholder, TODO), `phone, founderName, bookingUrl, formEndpoint, consultingPrice` (all `null` for now), `brandStory, brandStoryLine, cta {label, labelShort, labelMobile, href, microcopy}, ctas {demos, calculator, examples, approach}, nav` (Services has `children` + `allLink`), `footer {columns, ctaMicrocopy, contactLine, legal}`.
- **Data** (`@/data/…`): `services` (4 lines: `slug, num, name, short, summary, headline, body, icon, href, linkLabel, highlights, bullets, goodFit, capabilities[{title, body}], demoIds`), `agentRoles` (customer / analyst / assistant: `anchor, name, short, headline, summary, icon, href, capabilities, demoId, microcopy`), `demos` (six, fixed order: `id, anchor, label, line, service, serviceName, icon`), `getService / getAgentRole / getDemo`. `integrations` (16) + `integrationsMore` + `integrationsCopy`; `industries` (8, with icons) + `industriesCopy`. Demo ids: `customer | analyst | assistant | marketing | sales | consulting` (same as `worth.ts`). No outcome numbers live in these files.

## UI primitives (`src/components/ui/`)

Every primitive takes `class`. Booleans default to `false` unless noted.

### Button
`href?` (renders `<a>`; internal paths get the base; `http(s)` opens a new tab with `arrow-up-right` and an sr-only "(opens in a new tab)"), `variant?: 'primary' | 'secondary' | 'ghost' | 'brass' | 'outline-dark'` (default primary), `size?: 'sm' | 'md' | 'lg'` (default md), `block?`, `icon?: IconName`, `iconPosition?: 'start' | 'end'` (default: end for `arrow-*`, start otherwise; play/pause render filled), `type?` (button), `disabled?` (`aria-disabled` on links), `newTab?`, plus any attribute.
```astro
<Button href={site.cta.href} size="lg" icon="arrow-right">{site.cta.label}</Button>
```
Brass only in a navy band (one per band). Ghost for "Watch the agents work" (`icon="play"`).

### Container
`as?` (div), `width?: 'page' | 'longform' | 'measure'` (page = 1240px + gutters). `<Container width="longform">…</Container>`

### Section
`id?`, `name?` (`data-section`, defaults to id), `tone?: 'paper' | 'sunken' | 'navy'` (default paper), `size?: 'default' | 'tight' | 'none'`, `tightTop?` (second of two neighbors on the same background), `container?` (default true: wraps the slot in Container), `width?` (passed to Container), `as?` (section), plus any attribute (`aria-labelledby`).
```astro
<Section id="services" tone="sunken" aria-labelledby="services-title">…</Section>
```
Tones: paper (page, grain), sunken (`.band-sunken`: demos, why-us, industries), navy (`.band-navy`, dark context: calculator, final CTA; at most two per page, never adjacent, never right before the footer unless it is the final CTA).

### SectionHeader
`title?` (wrap one phrase in `*asterisks*` for the brass italic `<em>`: one per page, hero or page hero only), `eyebrow?` (the section-rule name), `num?` ("01"), `subtitle?` (or default slot: rich aside), `align?: 'split' | 'left' | 'center'` (split = title 7 cols + aside 9/span 4), `size?: 'h1' | 'h2' | 'h3'` (visual, default h2), `level?: 2 | 3 | 4` (tag, default 2), `titleId?`, `reveal?` (default true), slot `title` for custom markup.
```astro
<SectionHeader num="02" eyebrow="See it work" title="Watch an agent do the work." subtitle="One sentence." titleId="demos-title" />
```

### Eyebrow
`as?: 'p' | 'span' | 'div'` (p). Only above hero and page-hero H1s. `<Eyebrow>AI Consulting</Eyebrow>`

### Badge
`variant?: 'done' | 'attention' | 'handoff' | 'blocked' | 'running' | 'window' | 'count'` (default done), `icon?: IconName | false` (defaults: check, user-check, user-check, x, typing dots). `window` = the `.aw-tag` title-bar badge ("Simulated demo", "Illustrative"); `count` = the sky count. Colors flip on navy. Approval and pending are always `attention` (sky), never brass.
```astro
<Badge variant="attention">Your OK</Badge> <Badge variant="window">Simulated demo</Badge> <Badge variant="count">2</Badge>
```

### IllustrativeLabel
`kind?: 'Illustrative example' | 'Modeled estimate'` (default Illustrative example), `href?` (default `/results/#methodology`), `link?` (default true; set false inside another link or an aria-hidden window).
```astro
<div class="tag-row"><IllustrativeLabel kind="Modeled estimate" /></div><p class="math"><b>40</b> emails × <b>23</b> min ≈ <b>15.3 h</b> / week</p>
```

### Card
`variant?: 'default' | 'quiet'`, `href?` (the whole card becomes the link and rises 2px with `shadow-float`), `as?: 'div' | 'article' | 'li' | 'figure' | 'aside'`.
```astro
<Card href="/services/sales/"><h3 class="type-h4">AI Sales Agent</h3><p class="mt-2 text-fg-2">…</p></Card>
```
For a navy icon tile: `<span class="icon-tile icon-tile--sm"><Icon name="user-check" size={18} /></span>`.

### Icon
`name: IconName` (required), `size?` (px; default from CSS: 16, `.btn__icon` 16, `.chip` 12), `label?` (makes it `role="img"` with an aria-label; otherwise aria-hidden), `fill?`, plus any attribute. Brass marker icons: `class="text-accent-display"`.
```astro
<Icon name="user-check" size={18} class="text-accent-display" />
```
Names (68; `iconNames` exports the list, `icons.ts` holds the paths):
`message-square chart-column inbox target send trending-up` · `user-check key-round list database power shield-check lock` · `arrow-right arrow-left arrow-up-right check x play pause rotate-ccw refresh-cw chevron-down chevron-right chevron-left menu plus minus info circle-check circle-alert triangle-alert` · `clock calendar calendar-check` · `mail phone globe` · `file-text file-spreadsheet presentation clipboard-list list-checks calculator sliders-horizontal` · `dollar-sign piggy-bank receipt` · `users building-2 factory megaphone` · `wrench stethoscope scale house utensils shopping-bag package briefcase` · `lightbulb workflow plug pen-line trending-down chart-line search eye`.
Fixed mapping (DESIGN.md §8.1): Customer Agent `message-square`, Analyst `chart-column`, Executive Assistant `inbox`, Marketing Director `target`, Sales Agent `send`, Consulting `trending-up`, approval `user-check`, least privilege `key-round`, audit log `list`, your data `database`, off switch `power`, security `shield-check` / `lock`, time `clock`; industries `wrench stethoscope scale house utensils shopping-bag package briefcase`. To add one, paste its Lucide inner SVG into `icons.ts`.

### Logo
`variant?: 'light' | 'dark'` (dark = footer/navy: ivory stems, brass-400 crossbar), `href?: string | null` (default `/`; null = not a link), `wordmark?` (default true), `size?` (mark px). `<Logo variant="dark" />`

### StatTile
`variant?: 'stat' | 'kpi'`, `value` (required), `unit?`, `context?` (stat: business line "Home services · 18 staff"; kpi: the label), `description?`, `label?: 'Illustrative example' | 'Modeled estimate' | false` (default Illustrative example), `bars?: { label, value, pct, accent? }[]` (math bars, pct 0-100), `math?: string | string[]` (HTML allowed for `<b>`), `link?: { label, href }`, `delta?: { value, direction?: 'up' | 'down', good?: boolean, note? }` (kpi), `as?`, default slot (extra content before the math).
```astro
<div class="stat-ledger" style="--cols: 3">
  <StatTile context="AI Agents · plumbing and HVAC, 18 staff" value="36" unit="hours a month" description="…"
    bars={[{ label: 'By hand', value: '62 h', pct: 100 }, { label: 'With the agent', value: '26 h', pct: 42, accent: true }]}
    math="<b>36 h</b> × loaded cost" link={{ label: 'See the math', href: '/results/#examples' }} />
</div>
<StatTile variant="kpi" context="Hours back this week" value="27.5" unit="h" delta={{ value: '3.0 h', note: 'vs last week' }} />
```
Numbers come from the data modules (`worth.ts`, `scenarios.ts`, `roi.ts`), never retyped.

### BaseLayout (`src/layouts/BaseLayout.astro`, minimal shell)
`title?` (page name; omitted = home title), `description?` (default `site.description`), `noindex?`; named slot `head`. Sets `html.no-js` → `html.js`, fonts, global.css, canonical, basic OG, favicon, and runs `initReveal()`. No header, footer or `<main>` yet: pages wrap content in `<main id="main">` until the layout engineer adds them.

## Layout

Owner: layout engineer. Files: `src/layouts/BaseLayout.astro`, `src/components/layout/*`, `src/pages/*` (route shells), `public/*`, `scripts/check-links.mjs`, `scripts/og-image.mjs`.

### BaseLayout (`src/layouts/BaseLayout.astro`)
This supersedes the "minimal shell" note above: the layout now renders the skip link, `Header`, `<main id="main">`, `Footer` and the reveal script. **Pages don't add their own `<main>`**; put sections straight into the slot (a slot that already contains a `<main>` is left unwrapped, so older test pages don't nest two).
Props: `title?` (page name; renders "{title} | {site.name}"; omit on Home for `site.homeTitle`), `description?` (default `site.description`; keep under about 155 characters), `ogImage?` (root path or absolute URL; default `/og.png`, 1200 × 630), `noindex?` (adds robots noindex and drops the canonical: 404 and internal pages), `bodyClass?`. Named slot `head` for page-specific tags such as `FAQPage` JSON-LD.
Head output: title, description, canonical (absolute, from `Astro.site` + base), theme-color `#F5F0E6`, `favicon.svg`, `apple-touch-icon.png`, sitemap link, the one Fraunces preload, Open Graph (`og:type/site_name/locale/title/description/url/image` + size + alt), Twitter `summary_large_image`, and `ProfessionalService` JSON-LD (name, url, description, slogan, logo, image, `areaServed` US, `serviceType` = the four service names; email/phone only once they're real; no ratings or reviews).
```astro
<BaseLayout title="AI Sales Agent" description="Prospecting that reads like a person did the homework…">
  <Fragment slot="head"><script type="application/ld+json" set:html={faqLd} /></Fragment>
  <PageHero … />
  …
</BaseLayout>
```

### Header (`src/components/layout/Header.astro`)
No props; rendered by BaseLayout. Sticky `.site-header` (gains `.is-scrolled` after 8px), logo, primary nav from `site.nav`, the header CTA (`site.cta.labelShort`, "Free assessment" under 640px, hidden only under 360px) and the 44px menu button under 1024px.
- **Services mega menu:** `<button aria-expanded aria-controls="nav-services-panel">` opens a panel with the four services (icon tile, name, one-liner from `site.nav`) and the three agent roles (icon, name, `headline` from `agentRoles`, linking to `/services/ai-agents/#customer-agent` etc.), plus "All services" and "See all six demos". Keyboard: Enter/Space toggle, ArrowDown/ArrowUp open and move through the links (wrapping), Home/End, Escape closes and returns focus to the button; Tab leaving the menu or an outside click closes it; hover opens after 120ms at 1024px and up.
- **Active state:** `aria-current="page"` on the matching link (Demos / Results / Approach also match their sub-pages); the Services button gets `.is-active` anywhere under `/services/`, and the current service is ringed in the panel.
- **Mobile menu** (`#mobile-menu`, under 1024px): full-height panel below the header with Services (expanded inline), Demos, Results, Approach, Contact, the full CTA and the contact email. Opening locks page scroll (`html.menu-open`), moves focus to the first link and traps Tab between the menu button and the menu; Escape closes and returns focus; following a link closes it. It sits outside `<header>` on purpose (the header's backdrop-filter would trap a fixed child).

### Footer (`src/components/layout/Footer.astro`)
No props. Navy `.site-footer`: dark logo, `site.brandLine`, the tagline, a brass `site.cta` button with `site.footer.ctaMicrocopy`, "Run by people you can reach: {site.email}" (plus `site.phone` / `site.founderName` when set), the three `site.footer.columns`, the brand-story line (only when `site.brandStory`), then the legal row: "© {year} {site.name}. All rights reserved.", the figures disclaimer with "See how we estimate" → `/results/#methodology`, and the trademarks line.

### Placeholder (`src/components/layout/Placeholder.astro`)
Dashed skeleton for unbuilt work. Every section component and owned page created by the foundation renders one and starts with `// OWNER: <owner-id> (placeholder created by foundation)`; replace the whole file with the real component. Props: `name`, `description`, `owner?`, `id?` (the section anchor), `tone?: 'paper' | 'sunken' | 'navy'`, `size?: 'default' | 'tight'`, `block?` (dashed block only, no `<section>`), `heading?: 'h1' | 'h2' | 'h3'`, `title?`, `minHeight?`; default slot renders inside the block. Find what is left with `grep -rl "placeholder created by foundation" src`.

### Section anchors and component boundaries
- Home section components render their own `<section id>` with the COPY.md ids: `hero`, `integrations`, `outcomes`, `services`, `demos` (DemoTheater), `control` (ControlRoom: the interactive console, moved out of the hero 2026-10-21), `calculator` (Savings), `examples` (ScenariosPreview), `process`, `why-us` (table inside: `comparison`; the security card inside it keeps `id="security"`), `industries`, `faq`, `cta`. Keep them: links and the check script rely on them.
- Reusable pieces render **no** section or id; the page wraps them: the six `demos/*` components (each appears on `/demos/` and on a service page), `results/RoiCalculator`, `results/Methodology`, `results/ScenarioCard`.
- Anchors other pages link to today: `/results/#methodology`, `/results/#calculator`, `/results/#examples`, `/approach/#security`, `/services/ai-agents/#customer-agent`, `#analyst-agent`, `#executive-assistant`, and on `/demos/`: `#customer-agent`, `#analyst-agent`, `#executive-assistant`, `#marketing-director`, `#sales-agent`, `#consulting`.

### Link check (`scripts/check-links.mjs`)
`node scripts/check-links.mjs [dir] [--base /ai-agency-website]` (default `dist/`; base and site read from `astro.config.mjs`). Verifies every internal `href`/`src` (base-prefixed, relative, or an absolute URL on the site) resolves to a built file (directories → `index.html`) and every `#fragment` exists on its target page; a root-relative link without the base is an error. Prints broken links by page and exits 1.

### Public files
`favicon.svg` (DESIGN.md §8.3 mark), `apple-touch-icon.png` (180px) and `og.png` (1200 × 630) from `node scripts/og-image.mjs` (reads the name and taglines from `site.ts`; re-run after a rename), `robots.txt` (allow all, sitemap URL), `.nojekyll` (keep: GitHub Pages would otherwise drop `_astro/`).

## Blocks

Shared sections and content blocks in `src/components/blocks/`. Live kitchen sink: `http://localhost:4321/ai-agency-website/dev/components/` (source `src/pages/dev/components.astro`; noindex, out of the sitemap), with every primitive and block on paper, sunken and navy bands.

**Common rules.** Every block takes `class`. Content blocks put `data-reveal` on themselves (`reveal={false}` turns it off: first viewport, or inside an already revealed wrapper). Internal hrefs are root paths (`'/results/#methodology'`); the block runs them through `url()`. Colors come from role utilities, so blocks work on paper and sunken; navy support is noted per block. Numbers come from the data modules, never typed into a page.

**Section-level vs content-level.** `PageHero` and `CtaBand` render their own `<section>` with background and padding. Everything else goes inside a page's `<Section>`, usually under a `SectionHeader`.

### PageHero (section)
Inner-page hero (DESIGN.md §6.23, §7.2): crumbs, eyebrow, `.type-h1`, lead, check chips, CTA row, micro line, optional art (split layout). The hero light sits behind it.
Props: `title` (required; wrap the page's one brass phrase in `*asterisks*`), `crumbs?: { label, href? }[]` (the trail after Home; Home is added; last item = current page; BreadcrumbList JSON-LD unless `jsonLd={false}`), `eyebrow?`, `subtitle?`, `chips?: (string | { label, href?, icon? })[]` (`chipsLabel` names the list), `primary?: { label, href, icon?, variant? } | false` (default `site.cta` with an arrow), `secondary?` (ghost when `icon: 'play'`, otherwise secondary), `micro?`, `tone?: 'paper' | 'sunken' | 'navy'` (navy switches to brass / outline buttons), `id?` (`hero`), `titleId?` (`{id}-title`), `level?: 1 | 2` (2 only for a second demo hero). Slots: `art` (a window or figure; makes it `.page-hero--split`), default (rich content under the lead).
```astro
<PageHero crumbs={[{ label: 'Services', href: '/services/' }, { label: 'AI Agents' }]} eyebrow="AI Agents"
  title="An AI staff for your front desk, *your numbers* and your inbox." subtitle="…"
  chips={[{ label: 'Customer Agent', href: '#customer-agent' }]}
  secondary={{ label: 'Watch the three demos', href: '#demos', icon: 'play' }} micro="Start with one agent. Add the others when you're ready.">
  <figure slot="art">…</figure>
</PageHero>
```

### CtaBand (section)
Closing CTA (DESIGN.md §6.24, §7.6). Navy (default): `.band-navy.cta`, copy on 7 columns, brass + outline buttons, the sail engraving on 5 (its HALYARD label and dictionary caption follow `site.brandStory`). Paper / sunken: a mid-page CTA with the headline on 6 columns and the lead and buttons (primary + secondary) on 6, no art.
Props: `title` (required; no italic), `eyebrow?`, `subtitle?`, `primary?: { label, href, icon? }` (default `site.cta`), `secondary?`, `micro?` (`{email}` becomes a `site.email` mailto link), `tone?: 'navy' | 'paper' | 'sunken'`, `art?` (navy only, default true), `leaveWith?: (string | { title, body? })[]` + `leaveWithLabel?` ("What you leave with"), `note?` (closing line), `id?` (`cta`), `titleId?`.
```astro
<CtaBand eyebrow="Free AI assessment" title="Find out where AI pays off first in your business." subtitle="…"
  primary={{ label: 'Book your free assessment', href: site.cta.href }} secondary={{ label: 'Estimate your savings first', href: site.ctas.calculator.href }}
  micro="Prefer email? Write to {email}." leaveWith={[{ title: 'Your top three opportunities, ranked', body: '…' }]} />
```

### FeatureGrid
Icon + title + text items, `cols?: 2 | 3 | 4` (default 3; 2-up under 1024px, 1-up under 640px). `variant?: 'cards'` (default: `.card` objects with a brass marker icon, the "why us" look) · `'guard'` (`.guard-grid`, navy icon tiles: guardrails, security, controls) · `'cells'` (`.cell-grid`, icon inline in the title: industries, "included every time").
Props: `items: { icon?, title, body?, href?, linkLabel? }[]` (`href` on cards makes the whole card the link, rising 2px, with `linkLabel` as an arrow link; default "Learn more"), `level?: 3 | 4` (title tag), `label?` (list name), `reveal?`. Works on navy.
```astro
<FeatureGrid variant="guard" items={[{ icon: 'key-round', title: 'Least-privilege access', body: '…' }]} />
<FeatureGrid variant="cells" cols={4} items={industries.map((i) => ({ icon: i.icon, title: i.name, body: i.body }))} />
```

### Steps
Numbered process with the rising halyard line (DESIGN.md §6.21): one row on desktop with the brass rope and knots set higher step by step (last knot filled), 2-up with a vertical brass rule under 1024px, one column under 640px.
Props: `steps: { title, body?, time?, get? }[]` (`time` = clock line such as "Typically 1 to 2 weeks"; `get` = deliverable under a mono "You get"), `getLabel?`, `surface?: 'paper' | 'sunken' | 'navy'` (match the band so the knot ring blends in), `rope?` (default true), `label?`, `level?`, `reveal?`. `--n` comes from the step count (any count; 3 to 5 read best).
```astro
<Steps surface="sunken" steps={[{ title: 'Assess', body: '…', time: 'Typically a 30-minute call', get: 'Your top opportunities, ranked, in writing' }]} />
```

### ComparisonTable
2 to 3 alternatives as columns with one highlighted "us" column (`.cmp`, DESIGN.md §6.18). Paper and sunken only. Under 768px each row becomes a stacked card: the row question, each answer under its mono column label, and the "us" answer as a navy tile (chosen over a sideways scroller because the answers are sentences).
Props: `columns: { label, short?, us? }[]` (`short` = mobile label), `rows: { label, cells: Cell[] }[]` where `Cell = string | { mark?: 'yes' | 'partial' | 'no', text?, muted? }` (check / minus / x icon; a mark without text gets a screen-reader word from `markLabels`, default Yes / Partly / No; "no" marks outside the us column are muted), `caption?`, `rowHeaderLabel?` (sr-only corner cell, "Question"), `usMark?` (brand mark before the us label, default true), `id?`, `reveal?`. The default slot renders under the table (the `.cmp-foot` tag + source line, or a note). For 4+ provider categories use the cost ledger (`.cost-ledger`, page-owned) instead.
```astro
<ComparisonTable caption="How the options compare"
  columns={[{ label: 'DIY AI tools' }, { label: 'Generic automation agency', short: 'Generic agency' }, { label: site.name, us: true }]}
  rows={[{ label: 'Human approval', cells: [{ mark: 'partial', text: 'Up to you' }, { mark: 'partial', text: 'Varies by project' }, { mark: 'yes', text: 'Built in for every sensitive action' }] }]}>
  <p class="mt-5 text-caption text-fg-3">…</p>
</ComparisonTable>
```

### FaqAccordion
Native `<details>`/`<summary>` (DESIGN.md §6.16). Several items can be open; the height animates open and closed (skipped under reduced motion; without JS the native toggle works).
Props: `items: { q, a: string | string[], open? }[]` (answers allow inline HTML such as links; build hrefs with `url()`), `jsonLd?` (FAQPage structured data: once per page, on the main FAQ), `id?`, `reveal?`. Works on navy.
```astro
<FaqAccordion jsonLd items={[{ q: 'Is our data safe?', a: `Least-privilege access… <a href="${url('/approach/#security')}">How we handle data</a>.` }]} />
```

### WorthExample
The "What it's worth" card fed by `@/data/worth` (or any object of that shape): provenance tags and service · business name and a one-line profile · the annual value in Fraunces with the monthly value and the `monthly × 12` math · "Today" and "With the agent" ledgers beside the step-by-step MathLedger · the "Not a quote or a guarantee…" note · "How we estimate" link.
Props: `example` (required), `profileLine?` (default derived from `example.profile`: "Fictional … company · 18 employees"), `labels?` (default both tags, the example's own first), `baselineLabel?` ("Today"), `afterLabel?` ("With the agent"; "With the plan" for consulting), `summary?` (default true), `methodologyHref?`, `link?: { label, href }` (e.g. "See the full example"), `level?`, `id?`, `reveal?`. Paper and sunken.
```astro
<WorthExample example={getWorth('customer')!} link={{ label: 'See the full example', href: '/results/#examples' }} />
```

### Tabs
Accessible tabs (WAI-ARIA pattern; behavior in `blocks/tabs.ts`): roving tabindex, Left/Right (wrapping), Home, End; non-selected panels carry `hidden`. Every change dispatches `tabs:change` on the `[data-tabs]` root with `detail { id, index, previousId, tab, panel }` (bubbles). Dispatch `tabs:select` with `{ id, focus? }` on the root to switch from another script, or import `selectTab(root, id)` / `initTabs(root)` from `@/components/blocks/tabs`.
Props: `tabs: { id, label, icon?, panelId? }[]`, `label` (required; the tablist's name), `selected?` (default first), `variant?: 'pills' | 'segmented'` (`.demo-tabs` pills on paper; `.aw-seg` inside an app window), `panels?` (default true: panels come from named slots, one per tab id; `false` renders only the tablist and each tab's `aria-controls` points at its `panelId`), `activation?: 'auto' | 'manual'`, `idPrefix?` (unique per page; default from the label), `listClass?`.
```astro
<Tabs label="Worked examples by agent" tabs={[{ id: 'customer', label: 'Customer Agent', icon: 'message-square' }, { id: 'analyst', label: 'Analyst Agent', icon: 'chart-column' }]}>
  <Fragment slot="customer"><WorthExample example={getWorth('customer')!} reveal={false} /></Fragment>
  <Fragment slot="analyst"><WorthExample example={getWorth('analyst')!} reveal={false} /></Fragment>
</Tabs>
```
DemoTheater: `panels={false}` with a `panelId` per tab (or slots), then listen for `tabs:change` to start the selected demo.

### Marquee
Integrations strip (DESIGN.md §6.19), names in plain text with a mono category, never logos. `mode?: 'marquee'` (default here): a seamless loop that pauses on hover, on focus inside the strip and with its Pause / Play button; the second copy is `aria-hidden`; with reduced motion it becomes a static wrapped list and the button hides. Use it at most once per page and never in the first viewport. `mode="grid"`: the static `.integrations` grid (DESIGN.md's default for Home).
Props: `items?: { name, category? }[]` (default the 16 in `@/data/integrations`), `label?` (list name), `duration?` (seconds per loop, default 60), `reveal?`.
```astro
<Marquee />   <Marquee mode="grid" items={integrationsMore} label="More tools we connect to" />
```

### Callout
`.callout` (DESIGN.md §6.20): an icon, a bold lead-in and the text, on a light surface that reads the same inside a navy band. `variant?: 'note'` (default, info) · `'tip'` (lightbulb) · `'disclaimer'` (raised, info) · `'method'` (raised, list: "How we estimate") · `'attention'` (sky, user-check) · `'warning'` (forms and system notices only) · `'danger'` (errors only).
Props: `title?` (bold lead-in), `icon?: IconName | false`, `as?: 'div' | 'aside'`, `role?: 'note' | 'status' | 'alert'`, `reveal?` (default false). The default slot is the text (inline HTML or paragraphs).
```astro
<Callout variant="method" title="How we estimate.">Hours returned × loaded hourly cost × 12 months.</Callout>
```

### Ledger motifs
- **MathLedger**: the math as a compact hairline table (line item · mono formula · value). `rows: { label, formula?, value, kind? }[]` (the `MathRow` shape in `worth.ts` / `scenarios.ts`; "Monthly value" / "Annual value" rows are styled as totals and "For context" rows are muted, unless `kind` says otherwise), `caption?` (shown in the head row on desktop and above the rows on phones), `columns?` (default Line item / Formula / Value), `heads?`. Folds to two lines per row under 640px.
- **LedgerRows**: `.ledger-rows` label / value pairs. `rows: { label, value }[]`, `title?` (mono label over a strong rule), `layout?: 'inline' | 'stacked'` (stacked puts long values under their labels).
- **LedgerList**: knot-bulleted lists. `items: string[]` (inline HTML allowed), `variant?: 'ledger'` (hairline rows) `| 'knot'` (no rules), `label?`.
- **StatLedger**: a `.stat-ledger` row of `StatTile`s. `items` (StatTile props), `cols?` (default one per item, max 4), `reveal?`.
- **TrustStrip**: `.trust-strip`, three practices with brass icons. `items?: { icon, text }[]` (default: DESIGN.md §6.17's exact three lines), `label?`, `reveal?` (default false).
```astro
<MathLedger caption="The math" rows={getWorth('analyst')!.math} />
<LedgerRows title="Send rules" rows={[{ label: 'First email to a new contact', value: 'Needs your OK' }]} />
<StatLedger items={[{ label: 'Modeled estimate', context: 'Customer Agent', value: '22', unit: 'hours back a month', math: '…' }]} />
```

## Demo engine
