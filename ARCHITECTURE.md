# Architecture & build contracts

Read with `BRIEF.md` (what we're building), `DESIGN.md` (how it looks) and `content/` (the words and numbers). Several agents build this site in parallel; these contracts keep their work coherent.

## Stack

- Astro 7, static output. Tailwind CSS 4 through `@tailwindcss/vite` (CSS-first config: tokens live in `@theme` in `src/styles/global.css`). `@astrojs/sitemap`.
- No UI framework. TypeScript in frontmatter and in `<script>` tags. Vanilla client JS only where a component needs behavior.
- Fonts self-hosted via the `@fontsource*` packages named in `DESIGN.md`.

## Config

`astro.config.mjs` sets `site: 'https://elbin0324.github.io'` and `base: '/ai-agency-website'`. If a custom domain is added later, set `site` to the domain and `base` to `'/'`; nothing else should need to change.

`tsconfig.json` defines the alias `@/*` → `src/*`. Import with `@/`, never with long relative paths.

## Directory layout

```
src/
  config/site.ts            brand + contact config: the ONLY place the brand name lives
  lib/url.ts                base-aware link helper
  lib/format.ts             number / currency / percent formatting
  data/                     shared content: services, agents, scenarios, roi, integrations, industries, faq
  styles/global.css         Tailwind import, @theme tokens, base styles, component classes
  layouts/BaseLayout.astro  html shell, SEO meta, header, footer, global scripts
  components/
    layout/                 Header, Footer (mobile nav lives in Header)
    ui/                     Button, Container, Section, SectionHeader, Eyebrow, Badge,
                            IllustrativeLabel, Card, Icon, Logo, StatTile
    blocks/                 PageHero, FeatureGrid, Steps, ComparisonTable, FaqAccordion,
                            CtaBand, WorthExample, Marquee, Callout
    demo/                   AppWindow, ResultCard (chrome shared by all demos)
    demos/                  CustomerAgentDemo, AnalystDemo, AssistantDemo,
                            MarketingDemo, SalesDemo, ConsultingDemo
    home/                   Hero, Integrations, Outcomes, ServicesGrid, DemoTheater, Savings,
                            ScenariosPreview, Process, Differentiators, Security, Industries,
                            HomeFaq, FinalCta
    services/               page-specific sections for the service pages
    results/                RoiCalculator, ScenarioCard, Methodology
  scripts/                  client-side modules: demo-engine.ts, reveal.ts
  pages/                    index, services/index, services/ai-agents, services/marketing,
                            services/sales, services/consulting, demos, results, approach,
                            contact, 404
public/                     favicon.svg, og.png, robots.txt
scripts/                    node tooling: shot.mjs (screenshots), check-links.mjs (built-site link check)
```

## Links and assets are ALWAYS base-aware

```ts
import { url } from '@/lib/url';
<a href={url('/services/sales/')}>   // -> /ai-agency-website/services/sales/
```

- Never hardcode a root-relative href or src (`href="/contact/"` breaks on GitHub Pages). Page links end with a trailing slash.
- In-page anchors use `#id`. External links get `target="_blank" rel="noopener"`.
- Files in `public/` are referenced through `url('/favicon.svg')` too.

## The brand name

Never type the brand name into a component. Use `site.name` from `@/config/site` (and `site.tagline`, `site.email`, etc.). Content files say "Halyard", but in code it is always `site.name`. That keeps the name swappable in one place.

## Client scripts

- An Astro `<script>` is bundled once per page even if its component renders several times. Always initialize every instance: `document.querySelectorAll('[data-demo="sales"]').forEach(init)`. Never assume a single instance or a global id.
- Keep scripts small. No external runtime libraries unless DESIGN.md says so.

## Reveal on scroll

Put `data-reveal` on an element (optionally `data-reveal-delay="120"` in ms). The global `reveal.ts` adds `.is-visible` once the element enters the viewport, and CSS in `global.css` handles the transition. Content must stay visible without JS (the hidden state applies only under `html.js`), and `prefers-reduced-motion` shows everything immediately.

## Demo engine contract

`src/scripts/demo-engine.ts` drives every animated demo so the six demos behave identically:

- Autoplays when the demo is at least 40% in view; pauses when it scrolls out of view or the tab is hidden; resumes where it left off.
- One control cluster per demo: play/pause, replay, step counter ("Step 3 of 8"), caption text and a progress bar, all provided by `AppWindow.astro` via data attributes.
- `prefers-reduced-motion: reduce`: the demo renders its final state immediately (`onFinal`), and a "Play demo" button still lets the visitor run it on request.
- Each step is `{ caption, run(ctx) }`. Steps are async functions that use context helpers (`ctx.wait`, `ctx.type`, `ctx.stream`, `ctx.countUp`, `ctx.show`, ...) that respect pause and abort, so a replay mid-step is clean.
- Each demo supplies `reset()` (back to the initial DOM state) and `final()` (jump to the end state).
- The final step reveals the `ResultCard` (metrics labeled "Illustrative example").

The exact API is documented at the top of `demo-engine.ts`. Demo components never re-implement controls, timers or visibility logic.

## Data files

- `site.ts`: name, tagline, description, siteUrl, email, bookingUrl, formEndpoint, nav and footer structure.
- `services.ts`: the four service lines (slug, name, short line, summary, icon, href, capability list, demo ids) plus the three AI Agent roles.
- `roi.ts`: savings calculator inputs (default, min, max, step), assumption constants with source ids and a pure `computeRoi(values)` function.
- `worth.ts`: the six per-service "What it's worth" examples (customer, analyst, assistant, marketing, sales, consulting) with their step-by-step math rows.
- `scenarios.ts`: the six illustrative industry scenarios for the results page and the home preview.
- `consulting.ts`: the traditional-consulting vs AI-consulting comparison (provider categories, sourced cost ranges, our column, `priceComparison()` for when `site.consultingPrice` is set).
- `benchmarks.ts`: every source behind the numbers (`id`, citation, url); methodology sections reference these ids.
- `integrations.ts`, `industries.ts`. FAQs live with the page or section that shows them.

All numbers in these modules are calibrated to `content/BENCHMARKS.md`; `content/SCENARIOS.md` is narrative only.

Numbers that appear on more than one page come from these files, never retyped.

## File ownership

Every build agent owns the files listed in its task. Do not edit files you don't own. If a shared file needs a change (a token, a data field, a primitive's prop), describe it in your final report instead of making it. Stub files created by the foundation say which agent owns them.

## Dev server and verification

- One dev server runs in the background at `http://localhost:4321/ai-agency-website/`. Don't stop or restart it. If it is down (`npx astro dev status`), start it with `npx astro dev --background`.
- Don't run `astro build` while parallel agents are working (they share `dist/`).
- Verify your work in the browser: `node scripts/shot.mjs <url> --out .shots/<you> --name <page>` (desktop) and `--mobile`, then Read the PNGs and iterate until the result meets DESIGN.md's bar. `--selector "[data-section=...]"` captures one section; `--reduced-motion` shows demo final states; `--wait <ms>` lets animations progress.
- Zero console errors (shot.mjs prints them and ends with `ERRORS: n`).
- Every interactive control is keyboard reachable, has a visible focus state and an accessible name.
