# Halyard: AI integration and consulting website

Marketing site for a done-for-you AI agents and consulting firm serving small and mid-size businesses. Multi-page, static, built with **Astro 7** and **Tailwind CSS 4**, and hosted on **GitHub Pages** at <https://elbin0324.github.io/ai-agency-website/>.

"Halyard" is a working name. It lives in one config value, so renaming the firm is a one-line change (see [Configuration](#configuration)).

Design and build contracts:

- [`BRIEF.md`](BRIEF.md): what we're building, for whom, and the honesty and numbers rules.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): stack, directory layout, base-aware links, file ownership.
- [`DESIGN.md`](DESIGN.md): the Navy & Brass design system (tokens, type, components, motion).
- [`COMPONENTS.md`](COMPONENTS.md): props and usage for every shared component.

## Quick start

Requires Node 22.12 or newer.

```sh
npm install
npm run dev          # http://localhost:4321/ai-agency-website/
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload (`npx astro dev --background` runs it in the background) |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serves `dist/` locally to check the production build |
| `node scripts/check-links.mjs` | Checks every internal link, asset and `#anchor` in `dist/` (run after a build) |
| `node scripts/shot.mjs <url> [--mobile]` | Screenshots with your local Chrome for visual QA (writes to `.shots/`) |
| `node scripts/audit.mjs` | Console errors, horizontal overflow and axe accessibility checks on every route (needs the dev server) |
| `node scripts/og-image.mjs` | Regenerates `public/og.png` and `public/apple-touch-icon.png` from the brand name and tagline |

## Configuration

Everything a founder is likely to change lives in **`src/config/site.ts`**:

| Setting | What it controls |
|---|---|
| `name` (the `const name` at the top) | The brand name everywhere: logo wordmark, page titles, footer, structured data. Never typed anywhere else. |
| `tagline`, `taglineAlt`, `brandLine`, `description` | Home headline, footer lines and the default meta description. |
| `email` | The contact address in the footer, mobile menu and contact page. **Currently a placeholder (`hello@example.com`); replace it before launch.** |
| `phone`, `founderName` | Optional "people you can reach" details in the footer. Shown only when set. |
| `bookingUrl` | A scheduling link for the free assessment. `null` means the contact form is the path. |
| `formEndpoint` | Where the contact form posts (Formspree or similar). `null` falls back to a `mailto:` link. |
| `consultingPrice` | AI Consulting fixed-fee range as `{ from, to, currency: 'USD' }`. `null` (the default) shows "Fixed fee, scoped after a free assessment". |
| `brandStory` | Shows the name-dependent "Why Halyard?" lines. Set it to `false` if the new name has no story to tell. |
| `cta`, `ctas`, `nav`, `footer` | Call-to-action labels, the navigation and the footer link columns. |

After renaming the firm, run `node scripts/og-image.mjs` so the social share image matches.

## Content sources

- **`content/*.md`** is the source of truth for words and numbers: `COPY.md` (every page's copy, page titles and meta descriptions), `DEMOS.md` (the six demo storyboards), `SCENARIOS.md` (illustrative scenarios, narrative only), `BENCHMARKS.md` (every cited figure, with sources), `DECISIONS.md` (founder decisions that override defaults).
- **`src/data/*.ts`** holds the numbers and structured content the pages render: `services.ts`, `roi.ts` (calculator inputs and `computeRoi()`), `worth.ts`, `scenarios.ts`, `consulting.ts`, `benchmarks.ts`, `integrations.ts`, `industries.ts`. Numbers that appear on more than one page come from these files, never retyped.

Every outcome figure on the site is an illustrative example or modeled estimate and is labeled that way (see `BRIEF.md`, "Honesty rules").

## Structure

```
src/
  config/site.ts        brand, contact and navigation config
  layouts/BaseLayout.astro   HTML shell: SEO and social meta, JSON-LD, header, footer, reveal script
  components/
    layout/             Header (nav, Services menu, mobile menu), Footer, Placeholder
    ui/                 primitives: Button, Section, SectionHeader, Card, Icon, Logo, StatTile, ...
    blocks/             shared page blocks: PageHero, FaqAccordion, CtaBand, ComparisonTable, ...
    demo/ demos/        demo window chrome and the six animated demos
    home/ results/      page sections
  data/                 content and number modules
  lib/                  url() base-aware links, number formatting
  pages/                one file per route (services/*, demos, results, approach, contact, 404)
  scripts/              client modules: reveal.ts, demo-engine.ts
  styles/global.css     Tailwind import, design tokens and component classes
public/                 favicon.svg, apple-touch-icon.png, og.png, robots.txt, .nojekyll
scripts/                node tooling: shot, audit, check-links, og-image
content/                copy deck, demo scripts, scenarios, benchmarks, decisions
```

Internal links always go through `url()` from `@/lib/url` (`url('/services/sales/')` gives `/ai-agency-website/services/sales/`), so the site works under the GitHub Pages base path and on a custom domain without code changes.

## Deploying to GitHub Pages

The site is published from the `gh-pages` branch.

1. Build and check:

   ```sh
   npm run build
   node scripts/check-links.mjs
   ```

2. Publish `dist/` to the `gh-pages` branch:

   ```sh
   npx gh-pages -d dist --dotfiles
   ```

   `--dotfiles` matters: it publishes `.nojekyll`, which stops GitHub's Jekyll step from hiding the `_astro/` asset folder. (Without the `gh-pages` package: copy the contents of `dist/`, including `.nojekyll`, into a checkout of the `gh-pages` branch, then commit and push.)

3. First time only: in the repository's **Settings → Pages**, set **Source** to "Deploy from a branch", branch `gh-pages`, folder `/ (root)`.

The site appears at <https://elbin0324.github.io/ai-agency-website/> a minute or two later. `dist/404.html` is served for unknown paths.

## Custom domain

1. In `astro.config.mjs`, set `site` to the domain and `base` to `'/'`, for example `site: 'https://www.example.com', base: '/'`.
2. In `src/config/site.ts`, set `siteUrl` to the same domain (used by structured data).
3. In `public/robots.txt`, point the `Sitemap:` line at `https://www.example.com/sitemap-index.xml`.
4. Add `public/CNAME` containing just the domain (`www.example.com`) so every deploy keeps it, and set up DNS as described in GitHub's "Managing a custom domain for your GitHub Pages site".
5. Rebuild and deploy. Nothing else changes: every link and asset path is base-aware.
