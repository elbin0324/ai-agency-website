# Halyard website: context for Claude Code

Marketing site for Jay's done-for-you AI business: AI agents (Customer, Analyst, Executive Assistant), an AI Marketing Director, an AI Sales Agent, and AI Consulting (cost and margin). "Halyard" is a working name that lives only in `src/config/site.ts`.

- **Live:** https://halyard.solutions (GitHub Pages; www and http redirect to it)
- **Repo:** github.com/elbin0324/ai-agency-website (public, branch `main`)
- **Stack:** Astro 7 (static), Tailwind CSS 4 (`@theme` tokens), GSAP 3 (ScrollTrigger, SplitText), vanilla TypeScript, `@astrojs/sitemap`
- **Last shipped (2026-10-21, `da99346`):** the "Night shift" landing page, with a dark hero ("Wake up to finished work."), the interactive console moved into a "Control room" section after the demos, and "for business" wording.
- **Current state, pending decisions and next steps:** see `HANDOFF.md`. Read it first.

## Setting up a new machine

1. Install Node 22.12 or newer (built with Node 24), Git, GitHub CLI and Chrome.
2. `gh auth login` as `elbin0324`, then set `git config --global user.name` and `user.email`.
3. `git clone https://github.com/elbin0324/ai-agency-website.git`, `cd ai-agency-website`, `npm install`.
4. For Safari and Firefox QA (once): `npx playwright-core install webkit firefox`.
5. `npx astro dev --background` serves http://localhost:4321/. Manage it with `astro dev status`, `astro dev logs` and `astro dev stop`.

On Windows Git Bash, put `MSYS_NO_PATHCONV=1` before any command that passes a `/path` argument (for example `--routes /,/demos/`). Otherwise Git Bash rewrites it to `C:/Program Files/Git/...`.

## Commands

| Command | What it does |
|---|---|
| `npm run build` | Static build to `dist/`. `postbuild` deletes `dist/dev` (dev-only pages). |
| `npm run check:links` | Checks every internal link, asset and `#anchor` in `dist/`. Run it after a build. |
| `npm run deploy` | Builds, then force-pushes `dist/` to the `gh-pages` branch, which Pages serves. |
| `npm run og` | Regenerates `public/og.png` (the share image) from `/dev/og/`. Needs the dev server. Run it after changing the name or tagline. |
| `node scripts/shot.mjs <url> [--mobile] [--engine webkit --device "iPhone 15"] [--engine firefox]` | Screenshots for visual QA, written to `.shots/`. |
| `node scripts/audit.mjs [--base <url>] [--routes /,/demos/] [--engine webkit --device "iPhone 15"]` | Checks every route for console errors, failed requests, sideways scroll and axe accessibility issues. The default base is the dev server. |

**Lighthouse:** `npx lighthouse@12 <url>`. Set `CHROME_PATH` to the Windows-style path of `chrome.exe`.

**Before every deploy:**
1. Run the build and `check:links`.
2. Run `audit.mjs` in Chrome, WebKit (as an iPhone 15) and Firefox.
3. Look at screenshots of whatever changed, on desktop and mobile.

**After deploying:**
1. Commit and push `main`.
2. Confirm https://halyard.solutions serves the change, for example with `node scripts/audit.mjs --base https://halyard.solutions`.

## Hosting and domain

- **Deploys:** GitHub Actions isn't used, because the `gh` token lacks the `workflow` scope. Deploys go through `npm run deploy` only.
- **Custom domain:** `public/CNAME` keeps the domain on every deploy. `astro.config.mjs` has `site: 'https://halyard.solutions'` and `base: '/'`. Every internal link and asset goes through `url()` in `src/lib/url.ts`, so a base path would need only a config change.
- **DNS (GoDaddy):**
  - A `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  - AAAA `@` → 2606:50c0:8000::153 through 2606:50c0:8003::153
  - CNAME `www` → elbin0324.github.io
- **HTTPS:** enforced. GitHub renews the certificate. If a certificate ever gets stuck, re-save the custom domain once public DNS resolves: `gh api -X PUT repos/elbin0324/ai-agency-website/pages -F cname=null`, then `-f cname=halyard.solutions`, then `-F https_enforced=true`.
- **halyar.co:** a second domain bought by mistake. Auto-renew is off, so it lapses on Oct 22, 2027. Its DNS still points at GitHub, and reverting it to GoDaddy parking is pending Jay's OK.

## Where things live

- **`src/config/site.ts`:** name, tagline, nav and footer, plus the founder settings:
  - `email` is still the placeholder `hello@example.com`.
  - `formEndpoint`, `bookingUrl`, `consultingPrice`, `phone` and `founderName` are unset.
- **`src/data/*.ts`:** every number on the site:
  - `roi.ts` (calculator levers)
  - `worth.ts`, `scenarios.ts` (examples)
  - `consulting.ts` (firm comparison)
  - `benchmarks.ts` (sources)
  - `services.ts`, `industries.ts`, `integrations.ts`
- **`src/components/home/`:** the landing page, in the order set by `src/pages/index.astro`:
  - `Hero.astro`. Its card figures come from the demo data through `hero/work.ts`, which fails the build if they drift.
  - `DemoTheater.astro` and `theater/` (the demo picker).
  - `ControlRoom.astro` and `console/` (the interactive dashboard).
  - `DayStory.astro` and `daystory/` (the scroll-scrubbed day).
  - The remaining sections.
- **`src/scripts/`:**
  - `demo-engine.ts` drives the six scripted demos (`registerDemo`, `mountDemos`).
  - `motion.ts` sets up scroll animations lazily.
- **`src/pages/dev/og.astro`:** the share-card source. It isn't deployed.
- **Context docs:** read the ones that matter before changing anything:
  - `BRIEF.md`: audience, honesty and number rules
  - `DESIGN.md`: the Navy & Brass design system
  - `ARCHITECTURE.md`, `COMPONENTS.md`, `MOTION.md`, `DEMO_ENGINE.md`
  - `content/DECISIONS.md`: Jay's rulings, which override defaults
  - `content/COPY.md`, `content/DEMOS.md`, `content/BENCHMARKS.md`

## Rules

- **Honesty:**
  - No fake testimonials, client logos, certifications or reviews.
  - Every outcome number is labeled "Illustrative example" or "Modeled estimate" and links to the method (`/results/#methodology`).
  - Compare consulting with traditional firms on scope, price and time, never on "similar results".
- **Contact details:** don't put Jay's personal email on the site. `site.email` stays a placeholder until he gives a business address or a Formspree endpoint.
- **No legal research:** don't do legal, trademark or regulatory research.
- **Ask Jay first** before spending money, deleting anything, or changing account settings (GoDaddy, GitHub Pages settings beyond the domain).

## Working with Jay

- **Updates:** give progress as short text, without screenshots unless he asks.
- **Priorities:** he cares most about design and content quality. Numbers should be realistic and sourced, but research them quickly (about 10 minutes), without over-engineering.
- **Agents:** use them freely for parallel work and reviews. If something will take more than about 15 minutes, say upfront what is running and when it should finish.
- **Pushback:** give a recommendation and push back when something is a bad idea. Don't re-ask decisions he has already made (see `content/DECISIONS.md`).
- **Browser:** Chrome is shared with other Claude sessions. Work in your own tabs, and prefer an API or CLI (`gh`) over the browser.

## Open items

- **Needed from Jay to convert visitors:**
  - a business email or form endpoint
  - a founder name, photo and city
  - a booking link
  - a consulting price signal
  - confirmation of the claims: fixed-price pilot, flat monthly fee, response times, security wording
- **Decisions pending:**
  - Auto-renew on halyard.solutions is on, and the recommendation is to keep it.
  - Revert halyar.co's DNS to parking.
- **`/services/` title:** still says "small and mid-size businesses" (only the landing page was changed to "business").
- **Mobile speed:** Lighthouse on mobile is 79, down from 83 because the new hero is heavier. Desktop is 97. Accessibility, best practices and SEO are 100.
