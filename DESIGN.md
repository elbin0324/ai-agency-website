# DESIGN.md: Halyard website design system

How the site looks. Read with `BRIEF.md` (what we build), `ARCHITECTURE.md` (how the code is organized) and `content/*.md` (words and numbers). Several agents build pages in parallel from this file, so nothing here is optional. If you need something this file does not cover, compose it from existing tokens and classes. If that is impossible, describe it in your final report and do not invent a style.

## 0. Sources of truth

| What | Path | Use |
|---|---|---|
| **Reference prototype (open this first)** | `design-lab/reference/index.html` (Home), `design-lab/reference/components.html` (every component on paper and on navy, plus chart palettes), `design-lab/reference/consulting.html` (inner page, consulting comparison) | Markup, spacing and behavior to copy. Screenshots are in `design-lab/reference/shots/`. |
| **Canonical CSS** | `design-lab/reference/global.css` | The foundation agent copies it **verbatim** to `src/styles/global.css`. Every token and component class below lives there. Change order: DESIGN.md, then that file, then `src/`. |
| Compiled CSS for the static reference pages | `design-lab/reference/reference.css` | Lets the reference pages open without a build. Never import it in `src/`. |
| Winning design-lab prototype | `design-lab/navy-brass/index.html` | History only. Where it differs from the reference, the reference wins. |
| Page-level CSS for Home sections | the `<style>` block in `design-lab/reference/index.html` (`.hero*`, `.integ*`, `.dw-*` Sales demo panes, `.calc*`, `.why-cards`, `.cta*`, `.foot-*`) | Port each rule into the matching component's scoped `<style>`, unchanged. |

**Winner:** Navy & Brass. Judge totals 52.5 + 50 + 52 = **154.5**, against Bright Editorial 136 and Midnight Signal 137.5. Grafts from both runners-up are already in the reference (see §11).

**Precedence:** this file and `global.css` decide visuals. `content/DEMOS.md` decides demo stories and timing, except for two visual rules here: the minimum text size inside windows is **12px** (DEMOS.md §0.8 says 11px), and the mobile demo layout switches at **768px** (DEMOS.md says 720px).

---

## 1. Direction and principles

**Navy & Brass: the modern advisory firm.** Warm ivory paper, deep navy ink and a rationed brass accent. Fraunces display serif for headings, Geist for everything people read or operate, Geist Mono for labels, provenance and math. The layout is editorial: numbered section rules, hairline ledgers and an asymmetric 7/4 section head. The product appears in crisp dark-navy app windows with a brass top hairline. The look borrows from the people an owner already trusts with money (accountant, bank, annual report), and the navy windows prove the software is real.

1. **Advisor on paper, software in navy.** Paper carries the firm's voice: headings, ledgers, long-form text. Navy carries the product: app windows, the calculator output, the final CTA band, the footer. Marketing copy never goes in a navy card, and agent UI never gets paper styling. The one exception is the client's own documents shown inside a window (emails, sheets, chat widgets), which use `.aw-doc`.
2. **Show the control point.** Every product view shows where a human decides. That signal is always **sky** (`Your OK`, `Waiting on you`, the count badge), with the `user-check` icon. Every number says what kind of number it is: a provenance tag plus a mono math line (§6.4).
3. **Ration brass** (§2.3). Brass is the brand, one CTA per navy band, and one emphasis per view. It never means "pending" and never fills large areas.
4. **Ledgers, not boxes.** Divide content with 1px hairlines and numbered rules. Use a card only when the thing is an object (result card, worksheet, vignette, window).
5. **Plain, large, specific.** Body text is 16px or larger, and nothing anywhere is smaller than 12px. Serif is for headings and editorial headline figures only, never inside windows or charts. Copy stays plain and outcome-first.
6. **Motion proves work happened.** Feed rows arrive, emails type, numbers count. Nothing decorative moves. With reduced motion, everything shows its final state.
7. **One system for ten pages.** Use tokens and component classes only. Page code adds no new hex values, font sizes, radii, shadows or gradients.

---

## 2. Color

### 2.1 Tokens (paste-ready, already in `global.css`)

Tailwind's default palette, type scale, radii and shadows are removed on purpose (`--color-*: initial` and so on). Utilities such as `text-gray-500`, `text-lg`, `rounded-xl` or `shadow-lg` **do not exist**. Use these tokens (for example `bg-paper`, `text-ink-2`, `text-h2`, `rounded-card`, `shadow-window`, `max-w-page`, `px-gutter`, `py-section`).

```css
@theme static {
  --color-*: initial;               /* Tailwind's default palette is removed on purpose */
  --color-white: #FFFFFF;

  /* Paper: light surfaces */
  --color-paper: #F5F0E6;           /* page */
  --color-paper-raised: #FBF8F2;    /* cards, result cards, worksheet, inputs, menus */
  --color-paper-sunken: #EFE8DA;    /* tinted bands (demos), table heads, code */
  /* Ink: text and lines on paper */
  --color-ink: #0E2136;             /* primary text, primary button       14.34:1 on paper */
  --color-ink-2: #4A5868;           /* secondary text                      6.40:1 */
  --color-ink-3: #56657A;           /* muted text, meta, captions          5.23:1 */
  --color-rule: rgb(14 33 54 / 0.12);
  --color-rule-strong: rgb(14 33 54 / 0.22);
  --color-field: #7A8592;           /* form-field border, >= 3:1 on every paper */
  /* Navy: dark bands, app windows, footer */
  --color-navy-950: #07111D;
  --color-navy-900: #0A1726;        /* window title bar, footer */
  --color-navy-850: #0C1B2D;        /* panes, sidebars, player bar */
  --color-navy-800: #0E2136;        /* window canvas, dark bands */
  --color-navy-700: #122842;        /* tiles and cards in windows, chart surface */
  --color-navy-600: #173050;        /* selected state */
  --color-navy-500: #21406A;        /* strong border on navy */
  --color-on: #F3EDE1;              /* primary text on navy               12.79:1 on navy-700 */
  --color-on-2: #A9B4C2;            /* secondary text on navy              7.10:1 */
  --color-on-3: #93A0B2;            /* muted text on navy                  5.62:1 */
  --color-rule-dark: rgb(169 180 194 / 0.13);
  --color-rule-dark-strong: rgb(169 180 194 / 0.22);
  /* Brass: the rationed accent (brass law, DESIGN.md §2.3) */
  --color-brass-200: #EEDDB8;       /* highlight on navy */
  --color-brass-300: #E0BF7F;       /* brass text and marks on navy        8.47:1 on navy-700 */
  --color-brass-400: #D1AE6C;       /* engraving lines, logo crossbar on navy */
  --color-brass-500: #B8904A;       /* DECORATIVE ONLY: hairlines, knots, slider fill */
  --color-brass-600: #8E6A2E;       /* text >= 24px only (display italic, arrows), 4.35:1 */
  --color-brass-700: #7A5A22;       /* small brass text on paper           5.58:1 */
  /* Status: always with an icon and a label */
  --color-success: #2B6A4B;  --color-success-wash: #E3EEE6;  --color-sage: #8CC5A6;
  --color-attention: #2A5E90; --color-attention-wash: #E2EAF3; --color-sky: #8FB8E0;
  --color-danger: #9A3F2E;   --color-danger-wash: #F4E2DC;   --color-clay: #EE9C8A;
  --color-warning: #9A4B00;  --color-warning-wash: #F6E7CC;  /* forms and system notices only */
  /* Focus ring: 2px outline, 3px offset. Brass on both surfaces (non-text, >= 3:1). */
  --color-focus: #8E6A2E;           /* on paper   4.35:1 */
  --color-focus-dark: #E0BF7F;      /* on navy    9.25:1 */
  /* Data viz raw values. Charts never use these directly: they use the
     surface-aware --viz-* roles in @layer base, which flip on navy. */
  --color-viz-1: #2E69B2; --color-viz-1-dark: #4F8BD6;   /* harbor blue */
  --color-viz-2: #B55334; --color-viz-2-dark: #D36F4F;   /* clay */
  --color-viz-3: #0A8E7A; --color-viz-3-dark: #36A792;   /* sea green */
  --color-viz-4: #7457A3; --color-viz-4-dark: #9577C7;   /* heather */
  --color-viz-5: #6F7D28; --color-viz-5-dark: #8C9B48;   /* moss */
  --color-viz-6: #A55584; --color-viz-6-dark: #C270A0;   /* plum */
  --color-viz-brass: #8C6210;                            /* chart accent on paper (brass-400 on navy) */

  --font-serif: "Fraunces Variable", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  --font-mono: "Geist Mono Variable", ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace;

  /* Type scale, fluid from a 390px to a 1440px viewport. Only these sizes exist. */
  --text-*: initial;
  --text-display: clamp(2.5rem, 1.757rem + 3.048vw, 4.5rem);   --text-display--line-height: 1.02; --text-display--letter-spacing: -0.03em;  --text-display--font-weight: 360;
  --text-h1: clamp(2.25rem, 1.693rem + 2.286vw, 3.75rem);      --text-h1--line-height: 1.04;      --text-h1--letter-spacing: -0.028em;      --text-h1--font-weight: 360;
  --text-h2: clamp(2rem, 1.536rem + 1.905vw, 3.25rem);         --text-h2--line-height: 1.08;      --text-h2--letter-spacing: -0.024em;      --text-h2--font-weight: 360;
  --text-h3: clamp(1.375rem, 1.282rem + 0.381vw, 1.625rem);    --text-h3--line-height: 1.2;       --text-h3--letter-spacing: -0.014em;      --text-h3--font-weight: 420;
  --text-h4: 1.125rem;                                         --text-h4--line-height: 1.35;      --text-h4--letter-spacing: -0.01em;       --text-h4--font-weight: 600;
  --text-lead: clamp(1.0625rem, 1.016rem + 0.19vw, 1.1875rem); --text-lead--line-height: 1.6;
  --text-longform: 1.0625rem;  --text-longform--line-height: 1.7;
  --text-body: 1rem;           --text-body--line-height: 1.6;
  --text-small: 0.875rem;      --text-small--line-height: 1.5;
  --text-caption: 0.8125rem;   --text-caption--line-height: 1.45;
  --text-label: 0.75rem;       --text-label--line-height: 1.2;    --text-label--letter-spacing: 0.14em;
  --text-ui: 0.8125rem;        --text-ui--line-height: 1.45;
  --text-ui-sm: 0.75rem;       --text-ui-sm--line-height: 1.4;
  --text-figure: clamp(3.5rem, 2.943rem + 2.286vw, 5rem);      --text-figure--line-height: 0.95;  --text-figure--letter-spacing: -0.035em;  --text-figure--font-weight: 320;
  --text-figure-sm: 2.125rem;  --text-figure-sm--line-height: 1;  --text-figure-sm--letter-spacing: -0.02em; --text-figure-sm--font-weight: 340;
  --text-kpi: 1.5rem;          --text-kpi--line-height: 1;        --text-kpi--letter-spacing: -0.02em;       --text-kpi--font-weight: 600;

  --radius-*: initial;
  --radius-data: 4px;  --radius-chip: 6px;  --radius-control: 8px;  --radius-tile: 10px;  --radius-card: 14px;  --radius-window: 16px;

  --shadow-*: initial;
  --shadow-card: inset 0 1px 0 rgb(255 255 255 / 0.7), 0 1px 2px rgb(14 33 54 / 0.05), 0 14px 34px -22px rgb(14 33 54 / 0.32);
  --shadow-window: 0 0 0 1px rgb(7 17 29 / 0.94), 0 1px 2px rgb(7 17 29 / 0.18), 0 24px 48px -24px rgb(7 17 29 / 0.42), 0 56px 96px -56px rgb(14 33 54 / 0.5);
  --shadow-float: 0 1px 2px rgb(14 33 54 / 0.08), 0 18px 40px -16px rgb(14 33 54 / 0.35);
  --shadow-btn: inset 0 1px 0 rgb(255 255 255 / 0.1), 0 1px 2px rgb(14 33 54 / 0.35), 0 10px 20px -12px rgb(14 33 54 / 0.7);

  --spacing-gutter: clamp(1rem, 4vw, 2.5rem);           /* 16px phones -> 40px desktop */
  --spacing-section: clamp(4rem, 7.5vw, 6.5rem);        /* 64 -> 104px */
  --spacing-section-tight: clamp(3rem, 5vw, 4.5rem);    /* 48 -> 72px */
  --container-page: 77.5rem;       /* 1240px content column */
  --container-longform: 42.5rem;   /* 680px reading column */
  --container-measure: 36rem;      /* leads, asides */

  --ease-out-soft: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1);
  --animate-ping-soft: ping-soft 2.4s cubic-bezier(0.2, 0.7, 0.2, 1) infinite;
  --animate-blink: blink 1.2s ease-in-out infinite;
  --animate-row-in: row-in 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  @keyframes ping-soft { 0% { transform: scale(0.5); opacity: 0.7; } 80%, 100% { transform: scale(1.6); opacity: 0; } }
  @keyframes blink { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }
  @keyframes row-in { from { opacity: 0; transform: translateY(-8px); background-color: rgb(224 191 127 / 0.08); } to { opacity: 1; transform: none; background-color: transparent; } }
}

/* Surface-aware roles: `text-fg-2`, `border-line`, `text-accent` flip inside dark contexts. */
@theme inline {
  --color-fg: var(--fg);
  --color-fg-2: var(--fg-2);
  --color-fg-3: var(--fg-3);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-accent: var(--accent);
  --color-accent-display: var(--accent-display);
  --color-accent-line: var(--accent-line);
  --color-raised: var(--raised);
}
```

Role values live in `@layer base` in `global.css`. The **light context** is `:root`, `.ctx-light`, `.aw-doc`, `.result-card`, `.calc-sheet__in` and `.insight-card`. The **dark context** is `.ctx-dark`, `.band-navy`, `.app-window` and `.site-footer`.

| Role utility | Light context | Dark context |
|---|---|---|
| `text-fg` / `-fg-2` / `-fg-3` | ink / ink-2 / ink-3 | on / on-2 / on-3 |
| `border-line` / `border-line-strong` | rule / rule-strong | rule-dark / rule-dark-strong |
| `text-accent` (small brass text) | brass-700 | brass-300 |
| `text-accent-display` (≥ 24px, icons) | brass-600 | brass-300 |
| `bg-accent-line` / knots | brass-500 | brass-400 |
| `bg-raised` | paper-raised | navy-700 |
| focus ring | brass-600 | brass-300 |

**Rule:** section and block components use role utilities (`text-fg-2`, `border-line`), never raw `text-ink-2`, so the same component works on paper and inside a navy band. Raw tokens are for things fixed to one surface, such as the `.aw-*` window internals.

### 2.2 Contrast (WCAG 2.x, computed)

| Pair | Ratio | Use |
|---|---|---|
| ink #0E2136 on paper / raised / sunken | 14.34 / 15.36 / 13.36 | all text |
| ink-2 #4A5868 on paper / raised / sunken | 6.40 / 6.86 / 5.97 | body, leads |
| ink-3 #56657A on paper / raised / sunken | 5.23 / 5.60 / 4.87 | captions, meta (AA everywhere) |
| brass-700 #7A5A22 on paper / raised / sunken | 5.58 / 5.98 / 5.20 | eyebrows, tags, step numbers |
| brass-600 #8E6A2E on paper / raised | 4.35 / 4.66 | **≥ 24px text and icons only** |
| on #F3EDE1 on navy-900 / 800 / 700 / 600 | 15.48 / 13.97 / 12.79 / 11.44 | text on navy |
| on-2 #A9B4C2 on navy-900 / 800 / 700 / 600 | 8.59 / 7.75 / 7.10 / 6.35 | secondary on navy |
| on-3 #93A0B2 on navy-900 / 800 / 700 / 600 | 6.80 / 6.14 / 5.62 / 5.02 | muted on navy (≥ 5:1 on raised navy) |
| brass-300 #E0BF7F on navy-900 / 800 / 700 | 10.25 / 9.25 / 8.47 | brass text on navy |
| sage / sky / clay chip text on their washes over navy-700 | 6.17 / 5.67 / 5.82 | status chips |
| success / attention / danger / warning on their washes | 5.40 / 5.58 / 5.36 / 5.09 | status chips and callouts on paper |
| btn-primary #F8F3E9 on ink | 14.73 | primary button |
| btn-brass navy-900 on #E6CA92 → #CDA766 | 11.37 → 8.01 | brass button |
| navy-900 on brass-300 / on sky / on ivory | 10.25 / 8.68 / 15.48 | play button, count badge, in-app primary |
| white on every highlight-tag ink (#855708 #B23B2A #2E69B2 #7457A3 #5A6676 #2E7D57) | 5.02 to 6.24 | `.hl-tag` |
| field border #7A8592 on paper / raised / sunken | 3.30 / 3.54 / 3.08 | non-text, ≥ 3:1 |
| focus brass-600 on paper; brass-300 on navy | 4.35; 9.25 | non-text, ≥ 3:1 |

Every body-text pair passes AA (4.5:1). Decorative values (brass-500, `#4A5D78` crumb separators, grid lines) never carry text.

### 2.3 The brass law

Brass may appear **only** as:

1. **Brand marks:** the logo crossbar, the 3px letterhead rule on the header, the window top hairline, knots, the section-rule knot, the rising halyard line and the sail engraving.
2. **The one emphasis per page:** **one** brass italic phrase per page, inside the hero or page-hero heading (`<em>` in `.type-display` / `.type-h1` / `.type-h2`). Never a second one, and never in body copy.
3. **The CTA on navy:** `.btn-brass` (one per navy band), the demo play button `.aw-btn--main`, and the chapter progress fill.
4. **Small brass text** through `text-accent`: eyebrows, section numbers, step numbers, provenance tags, `You get` labels.
5. **Units** on editorial figures (`.stat__fig small`, `.calc-out__fig small`).
6. **Chart accent:** `--viz-accent` marks the one bar or series the story is about. Everything else is `--viz-context` gray.

Brass is **never** used for approval or pending states (those are sky), success (sage or success), "Approve" buttons in product UI (`.app-btn--primary` is ivory), large fills or backgrounds, any text in brass-500, or brass-600 text under 24px.

### 2.4 Status semantics (product UI and paper)

| Meaning | Paper | Navy | Icon | Class |
|---|---|---|---|---|
| Done, within rules | success on success-wash | sage | `check` | `.chip-done` |
| **A human decides** (needs your OK, waiting on you, handed off) | attention on attention-wash | **sky** | `user-check` | `.chip-attention`, `.chip-handoff` (outline), `.count` |
| Blocked or failed check (generic AI email, failed QC) | danger on danger-wash | clay | `x` | `.chip-blocked` |
| Running | ink-2 outline | on-2 outline | typing dots | `.chip-running` |
| Warning (forms and system notices only) | warning on warning-wash | n/a | `triangle-alert` | `.callout--warning` |

A status always carries an icon **and** a word. Color is never the only signal.

---

## 3. Data visualization

Charts appear on paper (Results, service pages) and on navy (inside app windows). They **always use the surface-aware `--viz-*` roles**, never raw hex, so a chart moved from paper into a window recolors itself.

### 3.1 Categorical: fixed order, max 6

| Slot | Name | Paper (`--viz-n` in light context) | Navy (`--viz-n` in dark context) |
|---|---|---|---|
| 1 | harbor blue | `#2E69B2` | `#4F8BD6` |
| 2 | clay | `#B55334` | `#D36F4F` |
| 3 | sea green | `#0A8E7A` | `#36A792` |
| 4 | heather | `#7457A3` | `#9577C7` |
| 5 | moss | `#6F7D28` | `#8C9B48` |
| 6 | plum | `#A55584` | `#C270A0` |

- Assign slots in this order. Color follows the entity, not its rank: filtering never repaints the survivors. Fixed site-wide assignments: **Google Ads = 1, Meta = 2, Microsoft Ads = 3, Email = 4, Organic/Direct = 5**. In Analyst charts, product lines take slots in the order they are listed in DEMOS.md.
- More than 6 series: fold the tail into "Other" (`--viz-other`) or use small multiples.
- **One series is not categorical.** A single series uses `--viz-1`. In an emphasis chart (highlight one bar, gray the rest), the highlighted bar is `--viz-accent` (brass) and the rest are `--viz-context`.

### 3.2 Sequential (heatmaps, ordered bins): one hue, 5 steps

| | 1 (low) | 2 | 3 | 4 | 5 (high) |
|---|---|---|---|---|---|
| Paper | `#7DA7E2` | `#5A90D6` | `#3B76C0` | `#255C9E` | `#17457C` |
| Navy | `#3A6DAD` | `#4C88D3` | `#71A4E5` | `#9BC1F1` | `#C7DDF9` |

Tokens: `--viz-seq-1` to `--viz-seq-5`. On navy, low values sit closest to the surface. Always show a scale legend.

### 3.3 Diverging (variance against plan, up or down): 7 steps, neutral midpoint

| | neg-3 | neg-2 | neg-1 | mid | pos-1 | pos-2 | pos-3 |
|---|---|---|---|---|---|---|---|
| Paper | `#A0441F` | `#CB7960` | `#E4B4A5` | `#E5E1D9` | `#9FCCC1` | `#3EA692` | `#00806A` |
| Navy | `#D36F4F` | `#B55E43` | `#7F422F` | `#2F3945` | `#1F6255` | `#278C7A` | `#36A792` |

Tokens: `--viz-div-neg-3` to `--viz-div-pos-3`. Clay is bad, sea green is good, and the midpoint reads as "nothing".

### 3.4 Semantic chart roles

| Token | Paper | Navy | Meaning |
|---|---|---|---|
| `--viz-accent` | `#8C6210` | brass-400 `#D1AE6C` | the one highlighted series or bar; waterfall savings steps |
| `--viz-context` | `#7F8995` | `#6B7C94` | everything not highlighted, "before" bars, context lines |
| `--viz-other` | `#B9BFC6` | `#3A4C64` | the "Other" bucket |
| `--viz-total` / `--viz-result` | `#7F8995` / ink | `#6B7C94` / on | waterfall start and end totals |
| `--viz-up` / `--viz-down` | `#00806A` / `#A0441F` | `#36A792` / `#D36F4F` | mixed waterfall steps (`.wf--mixed`) |
| `--viz-good` / `--viz-attention` / `--viz-critical` | `#3A9A68` / `#2B66A6` / `#A3352A` | `#4FAA7C` / `#5791D8` / `#DE5F55` | status marks in charts only (never as series colors) |
| `--viz-grid` / `--viz-axis` | `#E3DCCD` / `#B9B2A3` | `#1E3653` / `#34507A` | gridlines / baseline and axes |
| `--viz-text` / `--viz-text-muted` | ink-2 / ink-3 | on-2 / on-3 | labels / ticks |
| `--viz-surface` | paper-raised | navy-700 | dot rings, 2px gaps |

### 3.5 Mark specs (`.chart` and `.viz-*` classes in `global.css`)

- **Bars and columns:** at most **24px** thick (waterfall `min(24px, 56%)`, horizontal bars 12px, math bars 8px). **4px rounded data end, square at the baseline.** Bars grow from one baseline. Touching bars and stacked segments are separated by a **2px surface gap** (`.stackbar` has `gap: 2px`), never by a stroke.
- **Lines:** **2px**, round caps and joins (`.viz-line`). Context or "before" lines are 1.5px `--viz-context` (`.viz-line--context`). Area fill is the series hue at **10% opacity** (`.viz-area`).
- **Dots and end markers:** at least **8px** (r = 4) in the series color with a **2px `--viz-surface` ring** (`.viz-dot`). Hit targets are at least 24px (`.viz-hit`).
- **Grid and axes:** 1px **solid** hairlines, `shape-rendering: crispEdges`, horizontal gridlines only, 3 to 5 of them at clean round values. Never dashed. The baseline uses `--viz-axis`.
- **Text:** ticks are Geist 12px tabular `--viz-text-muted` (`.viz-tick`). Value labels are Geist 12px weight 550 `--viz-text` (`.viz-label`). **Text never wears the data color.** Serif never appears inside a chart. Nothing is smaller than 12px, at any width.
- **Labels:** label selectively: the line end, the extreme, the one bar that matters. Bars carry the value at the tip, columns on the cap, lines at the end. Never put a number on every point. If a label does not fit inside a mark, move it outside or leave it to the tooltip and table; never clip it.
- **Legend:** always present for 2 or more series (`.chart__legend`, with 10px square keys at radius 2, or 14×2px line keys), placed above the plot and left-aligned. A single series gets no legend; the title says what is plotted.
- **Tooltip:** `.chart-tip`, a navy-900 panel with 12px text, the value in 14px weight 600 tabular, and a 12×2px key. It follows hover **and** keyboard focus, and it enhances; it never gates a value.
- **Annotation:** one plain-English note per chart at most (`.viz-annot`, 12px muted), with a 1px `--viz-axis` leader. Highlight bands use `.viz-band`.
- **Waterfall:** use the CSS `.wf` component (labels never scale with a viewBox), with `--max` set on the container and `--from` / `--to` on each bar. Below 640px, long labels switch to `data-short`.
- **Number formats:** `$12,400`, `$4.2K` only when space forces it, `18.5 h`, `12%`, `2.1x ROAS`. Use tabular figures in axes, tables and ticking counters, and proportional figures for standalone big numbers.
- **Never:** dual axes, pies or donuts (use a bar or the number), 3D, gradients in marks, more than 7 color classes, rainbow ramps, or a status color as a series color.
- **Sizing:** the chart container includes the x-axis band. No fixed height that crops axis labels, and no nested scroll.

### 3.6 Accessibility and provenance

- Every chart is a `<figure class="chart">` with a `.chart__title` and `.chart__sub`. Below the plot goes a `.chart__note` in mono that carries the provenance (`Illustrative example: fictional data` or `Modeled estimate: formula`).
- Every chart has a table twin. The `.chart__toggle` button flips `data-view="table"`, which shows a `.chart-table`. Inside demos, where the window is `aria-hidden`, the transcript carries the numbers instead.
- The SVG gets `role="img"` and an `aria-label` that states the finding ("Cost per lead fell from $71 to $46 after the budget shift").

### 3.7 Validator results (`dataviz/scripts/validate_palette.js`, 2026-10-13)

```
Categorical, light, surface #F5F0E6 (also #FBF8F2): ALL CHECKS PASS
  Lightness band all 6 inside L 0.43–0.77 · Chroma floor all >= 0.1
  CVD worst adjacent #0A8E7A↔#B55334 ΔE 9.6 (deutan) · Normal-vision floor ΔE 20.5 · Contrast all >= 3:1
Categorical, dark, surface #122842 (also #0E2136): ALL CHECKS PASS
  Lightness band all 6 inside L 0.48–0.67 · Chroma floor all >= 0.1
  CVD worst adjacent #36A792↔#D36F4F ΔE 9.6 (deutan) · Normal-vision floor ΔE 20.0 · Contrast all >= 3:1
Sequential, --ordinal, light #7DA7E2…#17457C on #FBF8F2 and #F5F0E6: PASS (light end 2.33:1 / 2.18:1, monotone, ΔL >= 0.06, hue spread 1–2°)
Sequential, --ordinal, dark #3A6DAD…#C7DDF9 on #122842 and #0E2136: PASS (light end 2.82:1 / 3.08:1)
Status, light (#3A9A68,#2B66A6,#A3352A) on #FBF8F2: PASS (CVD ΔE 19.6, normal ΔE 20.9)
Status, dark (#4FAA7C,#5791D8,#DE5F55) on #122842: PASS (CVD ΔE 16.1, normal ΔE 17.5)
Diverging poles, light (#A0441F,#00806A) on #F5F0E6: PASS (CVD ΔE 9.5) · dark (#D36F4F,#36A792) on #122842: PASS (CVD ΔE 9.6)
```

Fixed in this pass: the earlier 7-step ramps failed the light-end contrast floor (1.09:1 and 1.37:1) and are now 5 steps. The earlier dark status set (#7ACB9F, #5E9BE3) left the lightness band, and the teal diverging poles (#047463, #54B9A5) fell under the chroma floor; both are replaced. `global.css`, `reference.css` and the swatches in `components.html` are updated to match.

---

## 4. Typography

### 4.1 Families (self-hosted; versions checked with `npm view` on 2026-10-13)

| Package | Version | Import (in `BaseLayout.astro` frontmatter) | Family name |
|---|---|---|---|
| `@fontsource-variable/fraunces` | 5.3.0 | `import '@fontsource-variable/fraunces/opsz.css'; import '@fontsource-variable/fraunces/opsz-italic.css';` | `Fraunces Variable` |
| `@fontsource-variable/geist` | 5.3.0 | `import '@fontsource-variable/geist';` | `Geist Variable` |
| `@fontsource-variable/geist-mono` | 5.3.0 | `import '@fontsource-variable/geist-mono';` | `Geist Mono Variable` |

- Use only the **wght and opsz axes** of Fraunces (the `opsz` files). Never load `full.css` (SOFT and WONK). `unicode-range` makes browsers fetch only the Latin subset.
- Preload one file only, the Latin opsz roman of Fraunces: `import fraunces from '@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2?url';` then `<link rel="preload" href={fraunces} as="font" type="font/woff2" crossorigin>`. Geist loads normally.
- `font-optical-sizing: auto` is on for serif headings. Geist runs with no feature settings.

### 4.2 Weights in use

- **Fraunces:** 320 (editorial figures), 340 (small figures), 360 (display, h1, h2), 380 (long-form h2), 400 (result-card title, mobile menu), 420 (h3, step titles), 470 (wordmark). Italic 330 for the single brass phrase.
- **Geist:** 400 (body), 460 (nav links), 500 (labels, legends), 550 (buttons, emphasis), 600 (h4, KPI values, table heads).
- **Geist Mono:** 400 and 500.

### 4.3 Scale (fluid between a 390px and a 1440px viewport)

| Role | Utility or class | Size | Line height | Tracking | Face, weight | Use |
|---|---|---|---|---|---|---|
| Display | `.type-display` | clamp 40 → 72px | 1.02 | -0.03em | Fraunces 360 | Home hero H1 only |
| H1 | `.type-h1` | 36 → 60px | 1.04 | -0.028em | Fraunces 360 | inner-page hero H1 |
| H2 | `.type-h2` | 32 → 52px | 1.08 | -0.024em | Fraunces 360 | section titles |
| H3 | `.type-h3` | 22 → 26px | 1.2 | -0.014em | Fraunces 420 | column and card titles |
| H4 | `.type-h4` | 18px | 1.35 | -0.01em | Geist 600 | small headings, FAQ questions |
| Lead | `.type-lead` | 17 → 19px | 1.6 | 0 | Geist 400, `fg-2`, bold in `fg` | standfirsts, max 60ch |
| Long-form | `.longform` | 17px | 1.7 | 0 | Geist 400 ink-2 | approach, methodology, legal (680px column) |
| Body | `text-body` | 16px | 1.6 | 0 | Geist 400 | default |
| Small | `text-small` | 14px | 1.5 | 0 | Geist | notes, chips on paper |
| Caption | `text-caption` | 13px | 1.45 | 0 | Geist, `fg-3` | meta, footnotes |
| Eyebrow / overline | `.eyebrow`, `.type-label` | 12px | 1.2 | +0.14em | Geist Mono 500 caps | eyebrows, section rules, column heads |
| UI | `text-ui` | 13px | 1.45 | 0 | Geist | default text inside windows |
| UI small (floor) | `text-ui-sm` | 12px | 1.4 | 0 | Geist | timestamps, chip labels; **nothing smaller anywhere** |
| Figure | `.type-figure`, `.stat__fig` | 56 → 80px | 0.95 | -0.035em | Fraunces 320, lining proportional | editorial outcome stats (Results, Home examples) |
| Figure small | `text-figure-sm`, `.result-tile__v` | 34px | 1 | -0.02em | Fraunces 340 | result-card tiles, comparison values |
| KPI | `.kpi__value` | 24px | 1 | -0.02em | **Geist 600**, proportional | numbers inside product windows |
| Math / data | `.math` | 13px | 1.6 | +0.01em | Geist Mono 400, tabular | formulas and assumption lines |

### 4.4 Rules

- Headings use `text-wrap: balance`; paragraphs use `pretty`. Leads and asides run at most 60ch, FAQ answers at most 68ch, long-form at most 680px.
- **Numerals:** `.num-fig` (proportional lining) for any standalone figure; `.num-tab` (tabular) for columns, timestamps, axis ticks and counters that tick. Units sit in Geist 500 next to serif figures (`<small>`).
- Serif figures are an editorial brand choice: Results ledgers, home examples and result cards. **Inside app windows and charts, numbers are Geist.**
- Uppercase appears only in mono labels (eyebrows, tags, `aw-tag`, column heads), never in headings or buttons.
- Exactly one `<h1>` per page. The section title is the `<h2>` inside `.sec-head`.

---

## 5. Layout

- **Container:** `.wrap` sets `max-width: 1240px + 2 × gutter` and `padding-inline: var(--spacing-gutter)`, where the gutter is `clamp(16px, 4vw, 40px)` (16px minimum on phones). Long-form text sits in `max-w-longform` (680px) and leads in `max-w-measure` (576px).
- **Grid:** 12 columns with a 24px column gap (`grid-cols-12 gap-x-6`). Standard splits are 7 / 5 (hero, CTA), 7 + aside at 9 / span 4 (section head), 6 / 6 (page hero split), and 3 + 9 (label and list rows such as integrations and "What you leave with").
- **Breakpoints:** Tailwind defaults, used by `global.css` as `width < …`: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Below `lg`, desktop nav becomes the menu button, 4-up ledgers become 2-up, and section heads stack. Below `md`, demos show one pane at a time with the player on top, and comparison tables become stacked cards. Below `sm`, everything is a single column and the header CTA shrinks to "Free assessment".
- **Vertical rhythm:** `.section` gives `padding-block: clamp(64px, 7.5vw, 104px)`; `.section-tight` gives 48 → 72px. The section rule sits 28 → 48px above the head, and the head sits 36 → 60px above content. When two neighboring sections share a background, the second one uses `pt-[var(--spacing-section-tight)]`. Never stack more than about 120px of empty paper.
- **Background sequence:** paper, then `.band-sunken` (demos, why-us, industries), then paper, then `.band-navy` (calculator, final CTA). Never put two navy bands next to each other, and use at most two per page. The footer is navy-900, so the band before it is the final CTA (navy-800) or paper.
- **Header height:** 72px (64px under 640px), set as `--header-h`. Anchor targets use `scroll-padding-top: header + 16px`.
- **Z-index scale** (`:root`): raised 1, sticky 20, header 40, dropdown 45, mobile menu 50, toast and tooltip 60, skip link 100. Inside a window (an isolated stacking context): figure knots 6, result overlay and toast 7, top hairline 8.
- **Home at 1440 × 900:** the hero must show the H1, the CTA, the console title bar, the KPI row and the console's **`Waiting on you` header with its first approval card** without scrolling. Check with `node scripts/shot.mjs`.

---

## 6. Components

All classes below exist in `global.css`. Astro components (names from ARCHITECTURE.md) render these classes; page code never restyles them. Open `components.html` to see each on both surfaces.

### 6.1 Buttons: `Button.astro` renders `.btn` + variant + optional size

| Variant | Class | Spec | Use |
|---|---|---|---|
| Primary | `.btn-primary` | ink fill, `#F8F3E9` text, `--shadow-btn`, brass-300 icon; hover `#15304F` and -1px | the one main action on paper ("Book a free AI assessment") |
| Secondary | `.btn-secondary` | 60% paper-raised fill, rule-strong 1px ring, brass-600 icon; hover raised fill and a darker ring | a second action on paper |
| Ghost | `.btn-ghost` | text only, underline grows on hover, `accent-display` icon, min height 44px | "Watch the agents work" (play icon), tertiary actions |
| Brass | `.btn-brass` | gradient `#E6CA92 → #CDA766`, navy-900 text, warm glow | **the** CTA in a navy band (one per band) |
| Outline on dark | `.btn-outline-dark` | on text, rule-dark-strong ring, brass ring on hover | second action in a navy band |

- Sizes: `.btn-sm` 40px / 16px padding / 14px, default 48px / 22px / 15px, `.btn-lg` 52px / 26px / 16px. `.btn-block` makes a button full width (hero CTA on phones). Radius is 8px; buttons are never pills.
- Text is Geist 550, sentence case. The arrow icon goes **after** the label (`.btn__icon--arrow`, nudges 3px on hover); the play icon goes before it.
- Primary and secondary labels match site-wide: primary "Book a free AI assessment" (header: "Book a free assessment"; header under 640px: "Free assessment"), secondary "See the demos". COPY.md supplies the exact strings.
- Disabled: `disabled` or `aria-disabled="true"` at opacity 0.5.

### 6.2 Links

- `.link`: inline text link in the current text color with a 1px `accent-line` underline at a 3px offset; on hover the underline takes the text color at 1.5px.
- `.link-arrow`: standalone "Explore AI Agents →" link with min height 44px, an underline that grows from the left, and an icon that nudges 3px. Use it at the bottom of service columns and cards.
- External links get `target="_blank" rel="noopener"` and an `arrow-up-right` icon. All internal hrefs go through `url()` (ARCHITECTURE.md).

### 6.3 Eyebrow, section rule, section header: `Eyebrow.astro`, `SectionHeader.astro`

```html
<div class="sec-rule" data-reveal>
  <span class="sec-rule__num">02</span><span class="sec-rule__name">See it work</span>
  <span class="sec-rule__line"></span><span class="sec-rule__knot"></span>
</div>
<div class="sec-head" data-reveal>
  <h2 class="sec-head__title type-h2">Watch an agent do the work.</h2>
  <p class="sec-head__aside">One-sentence standfirst in plain English.</p>
</div>
```

- Home sections are numbered 01, 02 and so on in page order. Inner pages use the same rule; numbering restarts on each page.
- `.eyebrow` (mono 12px caps in brass with a 32px leading dash) sits above page-hero and hero H1s only, not above section titles (the section rule already does that job).

### 6.4 Provenance labels: `IllustrativeLabel.astro` (`.tag`) and the math line (`.math`)

| Label (exact text) | Where | Markup |
|---|---|---|
| `Illustrative example` | any outcome figure from a scenario, vignette or demo result | `<a class="tag" href={url('/results/#methodology')}>Illustrative example</a>` |
| `Modeled estimate` | any figure computed from a formula (calculator, stat ledger, savings math, consulting comparison) | `.tag`, plus a `.math` line that shows the formula with the actual numbers |
| `Simulated demo` | the badge on all six demo windows | `<span class="aw-tag">Simulated demo</span>` in `.aw-meta` |
| `Illustrative` | the badge on the hero console and every vignette | `.aw-tag` |
| `Fictional business` | the FIG caption under the hero console and scenario figures | `.fig-caption`: `<b>FIG. 1</b> Illustrative interface. Fernhill Heating & Air is a fictional 18-person HVAC company.` |
| `Source:` | any third-party statistic (consulting fees and similar) | `.cmp-foot`: tag, then `<p>` with a dated source link from `content/BENCHMARKS.md` |

- `.tag`: 24px pill, mono 12px caps at +0.08em in `text-accent`, brass wash with a ring and a 5px leading dot. Tags sit in a `.tag-row` above or below the figure they label, never more than one block away.
- `.math`: Geist Mono 13px `fg-3`, tabular, with key numbers in `<b>` (`fg-2`). Example: `40 emails × 23 min ≈ 15.3 h / week`. Every calculator and modeled figure ends with the footnote "Not a quote or a guarantee. Estimates exclude the cost of the engagement." Ad dollars are labeled "reallocated", never "saved".

### 6.5 Cards: `Card.astro`

- `.card`: `bg-raised`, radius 14, padding 20 → 28px, `--card-shadow` (paper: soft shadow plus 1px rule ring; navy: 1px dark ring). Use it for objects: the generic-email card, the "Our draft" card, method boxes, contact panels.
- `.card-quiet`: a 60% paper fill with a 1px rule ring and no shadow. Use it for the muted side of a comparison ("What generic AI tools send").
- Link cards: the whole card is the `<a>`. On hover the shadow becomes `--shadow-float` and the card rises 2px over 250ms. Plain cards do not move.
- `.icon-tile` (56px, radius 14, navy gradient, brass top hairline) holds the 40px service art; `.icon-tile--sm` is 36px. Icon tiles are the only navy element allowed in paper copy.

### 6.6 Service ledger and vignettes (Home, `/services/`)

```html
<div class="svc-ledger">                       <!-- 4 columns; 2 below 1024px; 1 below 640px -->
  <article class="svc-col">
    <div class="app-window app-window--mini" aria-hidden="true">
      <div class="aw-bar"><span class="aw-crumb"><b>Agents on shift</b></span><span class="aw-meta"><span class="aw-tag">Illustrative</span></span></div>
      <div class="vg">…</div>
    </div>
    <div class="svc-col__head"><span class="icon-tile">…</span><span class="svc-col__num">01</span></div>
    <h3 class="svc-col__title type-h3">AI Agents</h3>
    <p class="svc-col__value">One line of value.</p>
    <ul class="ledger-list">…3–4 items…</ul>
    <a class="link-arrow" href="…"><span>Explore AI Agents</span><svg class="icon">…</svg></a>
  </article>
</div>
```

- Every column opens on a 216px mini window tagged `Illustrative`. Window titles are at most 16 characters ("Agents on shift", "Cost per lead", "First email", "Margin, pts"). The four vignettes are: agents with status chips; budget share bars with "Moves capped at 20% a week"; a cited email with green source markers and "2 facts, sourced / Your OK" chips; and a margin waterfall with value labels (`.vg-wf` in the reference page CSS).
- Columns are divided by 1px rules, and a 2px brass rule grows across the top on hover or focus.
- Under 640px the icon tile hides (the vignette already identifies the service), and each column shows its vignette and copy at full width.

### 6.7 Stat ledger, math bars, KPI tiles: `StatTile.astro`

- `.stat-ledger` (set `--cols`) holds `.stat` cells: `.stat__top` (`.stat__svc` business type such as "Home services · 18 staff", plus the tag), `.stat__fig` (Fraunces figure with a brass Geist `<small>` unit), `.stat__desc` (max 34ch), `.stat__bars` (math bars), then `.stat__math` (formula lines separated by hairlines). Below 1024px it becomes a single column.
- `.mbar` draws one assumption to scale: a 120px label column, an 8px bar with a 4px data end, and a tabular value. Use `--viz-context` for "By hand" and `.mbar__fill--accent` for "With the agent", for example `By hand 22 h` against `With the agent 5 h`.
- `.kpi` is the product KPI inside windows: a navy-700 tile with a 12px `on-3` label, a 24px Geist 600 value with a 13px unit, and a 12px delta (`.is-good` sage, `.is-bad` clay, always with an arrow glyph).

### 6.8 Ledger rows, lists and knots

- `.ledger-rows` (a `<dl>` of `div > dt + dd`): label and value pairs with hairlines, values in Geist 600 tabular. Use it for send rules ("First email · Needs your OK", "Daily limit · 18 of 40", "Logs to · HubSpot"), hours by agent, and audit-log summaries.
- `.ledger-list`: `<ul>` with hairline rows and a brass knot bullet (the service columns). `.knot-list` is the same without the rules.
- Audit log rows inside windows show a mono 12px timestamp (`9:47 pm`, tabular, `on-3`), the agent glyph, a sentence, and a status chip on the right.

### 6.9 Status chips, count, live and typing

- `.chip` + `.chip-done | .chip-attention | .chip-handoff | .chip-blocked | .chip-running`: 22px pill, Geist 12px weight 550, 12px icon at stroke 2, never wraps. Colors follow §2.4.
- `.count`: a 20px sky badge with navy-900 digits, used for "Waiting on you (2)".
- `.live`: a sage dot with a 2.4s ping and the word "Live". It appears only on the hero console and only while the feed runs.
- `.typing-dots`: three 3px dots with a 1.2s blink, staggered 0.2s.

### 6.10 App window: `AppWindow.astro`, the chrome for the hero console, vignettes and all six demos

```html
<div class="app-window app-window--demo" data-demo="sales">
  <div class="aw-bar">
    <span class="aw-dots"><i></i><i></i><i></i></span>
    <span class="aw-title">Sales Agent · Northwind prospects</span>   <!-- or .aw-crumb with <b>Business</b> / view -->
    <span class="aw-meta"><span class="aw-tag">Simulated demo</span></span>
  </div>
  <div class="aw-caption" aria-live="polite" aria-label="Demo captions"><b>Step 3 of 5</b><span>Caption text, one sentence.</span></div>
  <div class="aw-player">
    <div class="aw-ctrl">
      <button class="aw-btn aw-btn--main" aria-label="Play demo"><svg class="icon i-play">…</svg><svg class="icon i-pause">…</svg></button>
      <button class="aw-btn" aria-label="Replay"><svg class="icon">…rotate-ccw…</svg></button>
    </div>
    <div class="aw-chapters">                        <!-- one per step; flex-grow = step duration -->
      <button class="aw-chapter is-done" style="--w:3.5"><span class="aw-chapter__bar"><span class="aw-chapter__fill"></span></span><span class="aw-chapter__label">Match profile</span></button>
      <button class="aw-chapter is-current" style="--w:4.5;--p:40%">…</button>
    </div>
    <span class="aw-time">0:14 / 0:43</span>       <!-- plus .aw-skip "Skip to result" -->
  </div>
  <div class="aw-panetabs" role="tablist">…Research / Draft / Check…</div>  <!-- shown under 768px only -->
  <div class="aw-stage" data-panes>
    <section class="aw-pane aw-pane--sunk" data-pane="research">…</section>
    <section class="aw-pane" data-pane="draft"><div class="aw-doc">…the client's email…</div></section>
    <div class="aw-result">…ResultCard…</div>
  </div>
</div>
```

- **Chrome:** navy-800 canvas, radius 16, `--shadow-window`, and a 1px brass gradient hairline across the top. The title bar is navy-900 and 46px tall (34px on mini windows, which drop the dots).
- **Panes:** navy panes hold the agent and its controls; `.aw-pane--sunk` (navy-850) holds sidebars and dossiers. `.aw-doc` (paper-raised, ink text, 14px) holds what the client's customers or staff see: emails, chat widgets, spreadsheets, slides. `.aw-label` is the mono pane eyebrow ("RESEARCH", "WAITING ON YOU"). `.aw-note` is a brass-washed note. `.skel` lines fill any pane that is waiting, so no pane is ever blank.
- **In-window controls:** `.aw-seg` (segmented control: Today / Week / Month, or "Halyard draft / Typical AI email"), `.app-btn` (outline), `.app-btn--primary` (ivory; this is "Approve"), `.aw-status` (mono clock), `.aw-address` (mono URL pill, hidden on phones).
- **Player on desktop:** the caption bar (navy-850, mono brass "STEP 3 OF 5", then the caption in 14px `on-2`) and the player (navy-900: 36px round buttons, chapter bars 3px with a brass fill, a 12px label under each, and a timecode) dock under the stage. The chapter tabs are the step tabs (Match profile > Research > Write > Quality check > Send & log); clicking one jumps there.
- **Player on mobile (under 768px):** the caption and player move **above** the stage. Buttons grow to 44px, and labels, timecode and skip hide. Pane tabs (`.aw-panetab`; the active tab is navy-600, and a brass dot marks "has news") show one pane at a time, and the engine switches tabs to wherever the current step is acting (`data-follow`). `.aw-ticker` shows the latest agent action in one line.
- **Size:** the design canvas is 1120 × 700 (DEMOS.md §0.1) and scales to the container. Reserve the final height so playback never shifts the layout.
- **Text floor** inside windows is 12px; the default is 13px (`text-ui`).
- **Window `aria-hidden`:** a playing demo window is hidden from screen readers; the caption live region and the transcript (`.aw-transcript` details, then `.aw-steplist`) carry the content. A decorative console uses `role="img"` with a one-sentence summary.

### 6.11 Annotated figure and insight card

- **Hero FIG:** up to 3 numbered `.fig-knot`s (a 24px navy disc with a brass-300 ring and mono digit), absolutely placed on the console over the item they explain. Under the window goes `.fig-legend` (the same digits, `fig-legend__n`) with exactly these three lines: "Every agent action, logged as it happens", "Anything sensitive waits for your OK" and "Results tracked in hours and dollars". Then the `.fig-caption` (§6.4). Reuse the pattern on any demo poster or scenario figure that needs explaining (at most 3 knots).
- **Insight card** (`.insight-card`, new in this pass): a paper-raised card, 300px wide, with `--shadow-float`, that overlaps a window edge (for example `right: -24px; bottom: 56px` on the hero console). It contains `.insight-card__k` ("Analyst Agent" plus `.tag` Illustrative), `.insight-card__t` (one plain-English finding: "Why September margin slipped: parts +11%, plan price flat."), and one `.math` line. It is hidden below 1280px, where the same finding appears in the Analyst demo instead. At most one per page.

### 6.12 Demo switcher and result card: `DemoTheater`, `ResultCard.astro`

- `.demo-tabs` / `.demo-tab` (new in `global.css`): 40px pill tabs above **one** AppWindow, with a `role="tablist"` and an icon per agent. The selected tab is an ink fill with on text and a brass icon. The strip scrolls horizontally on phones. Six tabs, in the same order everywhere: Customer Agent, Analyst, Executive Assistant, Marketing Director, Sales Agent, Consulting.
- **Result card** (`.result-card`): paper-raised, radius 14, and a 2px brass top rule that draws in (`--done` from 0 to 1) when the result arrives. It contains `.result-card__top` (context line plus `Illustrative example` tag; Consulting adds `Modeled estimate`), `.result-card__title` (Fraunces 24px, max 26ch), `.result-tiles` (3 tiles: `__v` value in Fraunces 34px with a Geist unit, `__k` label, `__basis` one-line basis in 13px `ink-3`), and `.result-card__foot` ("See the math" link, Replay, then the primary CTA pushed right). Optionally add `.compare` ("By hand 25 min → With the agent 2 min", with the accent value in brass-700).
- On desktop it slides up over the lower stage (`.aw-stage.has-result` dims the stage with navy at 62%). On phones and with reduced motion it sits below the panes.

### 6.13 Forms (`/contact/`, calculator)

- `.field` > `.field__label` (14px weight 500; `.optional` muted), the control, `.field__hint` (13px `ink-3`), and `.field__error` (13px danger with an alert icon; set `aria-invalid` and `aria-describedby`).
- `.input` / `.select` / `.textarea`: min height 48px, padding 12px 14px, a 1px `--color-field` border (3.3:1), radius 8, paper-raised fill, 16px text (prevents iOS zoom). Hover border is ink-2; focus is a 2px brass outline at a 2px offset plus an ink border.
- `.check` with a 20px custom checkbox or radio (checked means ink fill with an ivory check). `.range` is the slider: a 4px track with a brass-500 fill set by `--fill`, and a 20px paper thumb with an ink ring.
- Labels sit above fields, never as placeholders. The submit button is `.btn-primary .btn-lg`, full width under 640px. The success state replaces the form with a `.callout` ("Thanks. We'll reply within one business day") plus the next steps.

### 6.14 Header, nav, Services dropdown, mobile menu: `Header.astro`

- `.site-header`: sticky, paper at 82% with a 14px saturate blur, and a **3px brass letterhead rule** on top (brass-600, brass-400, brass-600). It gains a bottom rule and 94% paper when `.is-scrolled` (scrollY > 8).
- Contents: `.brand` (mark 30px plus the Fraunces 470 24px wordmark from `site.name`), then `.nav-links` centered (Services ▾, Demos, Results, Approach; `.nav-link` is 15px weight 460 ink-2, with a brass underline that grows on hover and on `aria-current="page"`), then `.nav-actions` (primary `.btn-sm` "Book a free assessment" plus `.nav-menu-btn` under 1024px).
- **Services dropdown:** a `<button class="nav-link" aria-expanded aria-controls>` opens `.nav-panel` (600px, paper-raised, radius 14, float shadow) with a 2 × 2 grid of `.nav-panel__item`s (icon tile sm, name in bold, one-line value) and a foot row ("All services →", "See all six demos →"). It opens on click, and on hover after a 120ms intent delay at 1024px and up. Esc, an outside click, or focus leaving closes it, and focus returns to the button.
- **Mobile header (under 1024px):** brand, **compact CTA** (`.btn-sm`; under 640px it reads "Free assessment", 40px tall), then the 44px menu button. The CTA hides only under 360px. Markup: `<a class="btn btn-primary btn-sm" href={url('/contact/')}><span class="max-sm:hidden">Book a free assessment</span><span class="sm:hidden">Free assessment</span><Icon name="arrow-right" class="btn__icon btn__icon--arrow max-sm:hidden"/></a>`.
- **Mobile menu:** `.mobile-menu` is fixed under the header with full paper. It holds `.mobile-menu__link` rows (Fraunces 22px, 56px tall, chevron in brass-600), Services expanded inline as `.mobile-menu__sub`, then a full-width primary CTA and the contact email at the bottom. Opening it locks body scroll, moves focus into the menu and traps it; Esc closes it and returns focus. The hamburger animates to an X.
- Include a skip link (`.skip-link`, "Skip to main content") as the first focusable element.

### 6.15 Footer: `Footer.astro`

- `.site-footer` is navy-900 with a 16% brass top border and 72px / 36px padding. Grid: brand block on 4 columns, then link columns on 8 (`.footer-col__title` mono caps `on-3`, links 15px `on-2` that turn `on` on hover).
- Columns: Services (4), Company (Approach, Results, Demos, Contact), Get started (the primary assessment link plus `site.email` as a `mailto:`).
- **"People you can call":** under the brand, show "Run by people you can reach: {site.email}". When the founder approves, add `site.phone` and `site.founderName` ("You'll work with {founderName}"). Render each only if its config value is set. No photos.
- Brand-story line (`data-brand-story`, see §7.6) and `.footer-legal`: © year `site.name`, "Every figure on this site is an illustrative example or modeled estimate. See the methodology.", and a privacy link.

### 6.16 FAQ accordion: `FaqAccordion.astro`

- Native `<details class="faq__item"><summary class="faq__q">…</summary><div class="faq__a">…</div></details>` inside `.faq`. Questions use H4 type (Geist 600, 18px) with min height 64px. The 28px plus/minus ring on the right rotates when open. Answers are 16px / 1.65 `fg-2`, max 68ch. Several items can be open at once. Add `FAQPage` JSON-LD on pages with a FAQ.

### 6.17 Trust strip, guardrails grid, cell grid

- **Trust strip** (`.trust-strip`, new): exactly three items with 18px brass icons, placed directly under the hero FIG caption and at the top of `/approach/`: `user-check` "Human approval on anything sensitive", `key-round` "Least-privilege access, every action logged", `database` "AI providers whose terms exclude training on your data". Below 768px it becomes a single column.
- **Guardrails / security block** (`.guard-grid`, set `--cols: 3`): `.guard` cells with an `.icon-tile--sm`, a 17px weight 600 title and a 15px body. Use it on Home (#security) and `/approach/` with the "Guardrails come standard" content from COPY.md: least-privilege access; you approve refunds, discounts, budget changes and first emails; every action logged; your data stays yours; an off switch. Practices only, never certifications.
- `.cell-grid` (`--cols: 4`) is the hairline grid for industries (HVAC and plumbing, dental and medical, law and accounting, real estate, restaurants, retail and e-commerce, distributors, professional services; each with its Lucide icon) and for "Included every time" lists.

### 6.18 Comparison table, cost ledger, range bars: `ComparisonTable.astro`

- `.cmp`: for 2 to 3 alternatives as columns. The column heads are 14px weight 600 `ink-2`; row heads are bold ink on 22% width. **The "us" column** (`.is-us` on its `th` and `td`s) is a navy-800 strip with on text, a rounded top with a 2px brass-400 inset top line, a rounded bottom, and brass-300 icons. Use `.is-muted` for weak values. Below 768px each row becomes a stacked card (`td::before` prints `data-label`), and the "us" cell becomes a navy tile.
- `.cost-ledger`: for 4 or more provider categories as **rows** (the AI Consulting comparison), with `__name` / `__sub` / `__fig` / `__note`, `.range-bar` cost spans on a shared axis (`--from` / `--to` in %; `.is-open` for "and up"), and `__axis` mono ticks. Our row comes last as a navy rounded row (`tr.is-us`). Per DECISIONS.md, our cell reads "Fixed fee, scoped after a free assessment" while `site.consultingPrice` is `null`. Use category names, never firm names. Compare scope and price, never outcomes.
- `.cmp-bar`: to-scale bars inside comparison cells (the "us" fill is brass-300).
- `.cmp-foot` under every comparison: a `Modeled estimate` or `Source` tag plus a dated source line.

### 6.19 Integrations strip and marquee: `Marquee.astro`

- Default: a **static** `.integrations` grid (auto-fill, minimum 168px; 2 columns on phones). Each `.integration` has a brass knot, the tool name in Geist 17px weight 550, and a mono category microlabel (`Gmail / EMAIL`, `QuickBooks / ACCOUNTING`, `HubSpot / CRM`, `Google Ads / ADVERTISING`). Names are plain text only, with no logos. On Home it sits in the `.integ` row (label on 3 columns, list on 9).
- `.marquee` is optional: at most once per page, never in the first viewport, with a pause button. The track duplicates its content with `aria-hidden` on the copy, and it pauses on hover and focus. With reduced motion it becomes a static wrapped list.

### 6.20 Callouts: `Callout.astro`

- `.callout`: a paper-sunken box with a 2px brass inset left rule, an 18px brass-700 icon, and 15px `ink-2` text with ink `<b>`. Variants: `--method` (raised, ringed: methodology and assumptions), `--attention` (sky family: "you approve this"), `--warning` (forms and system notices), `--danger` (errors only).

### 6.21 Process steps: `Steps.astro`

- `.steps` (set `--n`) contains `.steps__rope`, an SVG line in brass-500 at 1.25px that rises left to right, then `.step` cells: `.step__knot` (11px; each step sits higher, set by `--k`; the last knot is filled brass), `.step__n` ("01", brass), `.step__title` (Fraunces 22px), `.step__body` (15px, max 32ch), `.step__time` (clock icon plus "45 minutes, free", "About a week", "Typically 2 to 6 weeks", "Ongoing"; durations pending founder approval), and `.step__get` (a mono "YOU GET" label plus the deliverable).
- Below 1024px it becomes 2-up with a vertical brass rule and no rope; below 640px, a single column.

### 6.22 Calculator worksheet: `RoiCalculator.astro`

- Sits in `.band-navy`. `.calc-sheet` has two columns: `.calc-sheet__in` (an ivory worksheet holding `.calc-field`s with a label, an `<output>` and a `.range`) and `.calc-sheet__out` (navy-700, holding `.calc-out__fig`, a Fraunces 52 → 68px figure with a brass unit, `.calc-out__pair` with two Geist 24px secondary figures, then the `.math` formula, the "Not a quote…" footnote, the `Modeled estimate` tag, and `.btn-brass` "Get your real numbers"). Defaults come from `roi.ts` (the conservative share and working weeks in SCENARIOS.md).

### 6.23 Page hero, breadcrumbs, long-form

- `.page-hero` (top 40 → 72px, bottom 48 → 88px) with `.crumbs` above it (13px, `aria-current` on the last item). The grid puts `.page-hero__copy` on 8 columns (eyebrow, `.type-h1` with that page's one brass italic phrase, `.type-lead`, CTA row, `.page-hero__chips` as check items). `.page-hero--split` puts copy on 6 columns and `.page-hero__art` (a window or vignette) on 5.
- `.longform`: a 680px reading column for approach, methodology and legal text: 17px / 1.7 ink-2, Fraunces h2s, Geist h3s, brass-knot bullets, mono brass `ol` markers, and links underlined in brass-500.

### 6.24 Final CTA band and "What you leave with": `CtaBand.astro`

- `.band-navy.cta` contains `.cta-grid`: copy on 7 columns (`.type-h2` without italic, since the page's italic is already used in its hero; a lead; `.btn-brass .btn-lg` plus `.btn-outline-dark`; the micro line "Free 30-minute call…") and art on 5 (the sail engraving, §7.6). Below it, `.leave-with` (label on 3 columns, a 3-item list on 9): "Your top 3 opportunities, ranked by hours and dollars", "Modeled savings, with the math", "A rollout plan you can act on". It closes with "The findings are yours to keep, whether or not we work together."

### 6.25 Highlights and markers inside artifacts

- `.marker` (20px numbered disc: `--mark-ok` green means a verified fact, `.marker--flag` red means a problem) pairs a phrase in an email with its source row in the dossier. `.mark-ok` / `.mark-flag` underline-tint the phrase.
- `.hl` + `.hl-amber | -red | -blue | -purple | -gray | -green` (outline, `--tint` or `--dashed`) highlight cells and phrases in `.aw-doc`, always with an `.hl-tag` text label. Dashed gray is the "excluded" style: "Current cleaning vendor: not found. Unverified, so it stays out of the email."
- `.is-pulsing` gives the `pulse` effect: a 2px accent ring, pulsed twice.

---

## 7. Backgrounds and motifs

### 7.1 Paper grain (all paper surfaces)

```css
body { background-color: var(--color-paper); background-image: var(--paper-grain); }
/* --paper-grain is a 200px SVG fractalNoise tile (baseFrequency .85, 3 octaves) tinted ink at 7% alpha, defined on :root */
```

`.band-sunken` uses the same grain over paper-sunken. **No grain on navy.**

### 7.2 Hero light

```css
.hero::before { /* the reference index.html <style> holds the exact values */
  background: radial-gradient(900px 520px at 80% 6%, rgb(255 255 255 / .62), transparent 70%),
              radial-gradient(760px 460px at 8% 0%, rgb(255 255 255 / .4), transparent 70%);
}
```

It appears only behind the Home hero and page heroes. It is white light on paper, never colored.

### 7.3 Navy band

```css
.band-navy { background: radial-gradient(1100px 520px at 50% -10%, rgb(38 71 110 / .55), transparent 70%), var(--color-navy-800); }
.band-navy::after { /* 80px hairline grid at 4.5% on-2, masked to an ellipse at the top */
  background-image: linear-gradient(rgb(169 180 194 / .045) 1px, transparent 1px), linear-gradient(90deg, rgb(169 180 194 / .045) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(900px 500px at 50% 0%, #000, transparent 75%);
}
```

This is the only grid pattern and the only glow on the site.

### 7.4 Brass hairlines

- **Letterhead:** a 3px rule on top of the sticky header (`linear-gradient(90deg, brass-600, brass-400 45%, brass-600)`).
- **Window top edge:** 1px, `linear-gradient(90deg, transparent 4%, rgb(224 191 127/.6) 30%, rgb(238 221 184/.85) 50%, rgb(224 191 127/.6) 70%, transparent 96%)`.
- **Icon tiles:** a 1px brass line across the top 72%.
- **Result card and service column:** a 2px brass-500 rule that draws in.

### 7.5 Knots and the rising line

- A **knot** is a 7px ring (`box-shadow: inset 0 0 0 1.25px var(--accent-line)`), used as bullets, integration markers and the section-rule end.
- The **rising halyard line** appears only in `.steps`. Each step's knot sits higher, as if the line raises the business. Its reading is name-neutral: lift, growth.

### 7.6 Sail engraving and brand story (config-driven)

- The CTA art is the technical sail SVG (viewBox 460 × 430) from `design-lab/reference/index.html` (`#cta`). It uses brass-400 strokes at 12% to 50% opacity, the halyard as the one bright brass-300 1.6px line, and mono 11.5px part labels (MASTHEAD, HEAD, CLEW, TACK). Copy it verbatim into `CtaBand.astro`. Under 640px it scales to 300px wide rather than hiding.
- **Brand-dependent pieces** carry `data-brand-story`: the rotated "HALYARD" label on the line, the `.brand-def` dictionary caption ("hal·yard (n.) The line that raises the sail."), and the footer line "Why Halyard?…". They render only when `site.brandStory === true` (add `brandStory: true` to `src/config/site.ts`). If the founder renames the firm, set it to `false`; the sail and rising line stay, because they read as "the line that raises".
- Nautical imagery is limited to these three uses (rising line, sail engraving, knots). No anchors, rope textures, compasses, helms, waves or lighthouses.

---

## 8. Iconography and logo

### 8.1 Icons: `Icon.astro`

- **Source:** Lucide path data, inlined. `Icon.astro` takes `name` and `size`, renders `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">` with the paths, and accepts a `label` prop that switches to `role="img"` with an `aria-label`. No icon fonts and no runtime library.
- **Style:** `fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round`, with `vector-effect: non-scaling-stroke` so the stroke stays 1.5px at every size.
- **Sizes:** 12px (chips, stroke 2), 14px (buttons, steps, player), 16px (default), 18px (cells, callouts, trust strip). Icons take the text color, or `text-accent-display` when they act as a brass marker.
- **Fixed mapping** (use everywhere): Customer Agent `message-square` · Analyst `chart-column` · Executive Assistant `inbox` · Marketing Director `target` · Sales Agent `send` · Consulting `trending-up` · human approval `user-check` · least privilege `key-round` · audit log `list` · your data `database` · off switch `power` · security `shield-check` / `lock` · time `clock` · plus UI `arrow-right`, `arrow-up-right`, `check`, `x`, `play`, `pause`, `rotate-ccw`, `chevron-down`, `mail`, `refresh-cw`. Industries: `wrench`, `stethoscope`, `scale`, `house`, `utensils`, `shopping-bag`, `package`, `briefcase`.
- **Service art** (the 40px drawings in 56px navy tiles: network node, chart endpoint, sealed envelope, margin blocks) is drawn in ivory strokes at 1.5px with one brass-filled element each. Copy it from the `#services` markup of the reference page.

### 8.2 Logo mark (final)

A "rising H": a short left stem, a tall right mast, and a brass crossbar that climbs between them. It reads as an H, a growth line and rigging. `Logo.astro`:

```html
<a class="brand" href={url('/')} aria-label={`${site.name}, home`}>
  <svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
    <rect x="6" y="10" width="4" height="17" rx=".6" fill="currentColor"/>
    <rect x="22" y="4" width="4" height="23" rx=".6" fill="currentColor"/>
    <path d="M10 19.2 22 11.2v4.4l-12 8z" fill="var(--mark-accent, #B8904A)"/>
  </svg>
  <span class="brand__word">{site.name}</span>
</a>
```

On navy (footer), the stems take `on` through `currentColor` and the crossbar uses `style="--mark-accent:#D1AE6C"`. The wordmark is Fraunces 470, 24px (21px under 640px), at -0.018em, and is never redrawn as an image. The minimum mark size is 20px.

### 8.3 Favicon (replace Astro's default `public/favicon.svg` with this)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0E2136"/><rect x="8" y="11" width="3.4" height="14" rx=".5" fill="#F3EDE1"/><rect x="20.6" y="6.5" width="3.4" height="18.5" rx=".5" fill="#F3EDE1"/><path d="M11.4 18.9 20.6 12.7v3.7l-9.2 6.2z" fill="#D1AE6C"/></svg>
```

Regenerate `public/favicon.ico` (32px) and add `apple-touch-icon.png` (180px) from the same drawing. Set `<meta name="theme-color" content="#F5F0E6">`. `og.png` (1200 × 630) is a navy-800 field with the mark, `site.name` in Fraunces and the tagline in Geist, with no product screenshot text under 24px.

---

## 9. Motion

### 9.1 Tokens

- **Easing:** `--ease-out-soft` `cubic-bezier(.2,.7,.2,1)` for entrances and hovers; `--ease-in-out-soft` `cubic-bezier(.65,0,.35,1)` for state swaps.
- **Durations:** color and hover 150 to 200ms; UI transitions (dropdown, toast, tabs) 200 to 250ms; underline grow 350ms; brass rule draw 500 to 800ms; reveal 700ms.

### 9.2 Reveal on scroll (`src/scripts/reveal.ts`)

```css
[data-reveal] { transition: opacity .7s var(--ease-out-soft), transform .7s var(--ease-out-soft); }
html.js [data-reveal]:not(.is-visible) { opacity: 0; transform: translateY(14px); }
```

```ts
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }),
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
document.querySelectorAll('[data-reveal]').forEach(el => {
  const d = el.getAttribute('data-reveal-delay'); if (d) (el as HTMLElement).style.transitionDelay = d + 'ms';
  io.observe(el);
});
```

- Reveal block-level things: the section rule, section head, ledgers, windows, card rows. Stagger siblings by 0, 80, 160 and 240ms, with at most 4 steps. Never reveal individual list items, and never reveal anything in the first viewport (the hero renders immediately). The script runs once.

### 9.3 Hover and focus

- `.btn-primary` and `.btn-brass` rise 1px; arrow icons nudge 3px; ghost and arrow-link underlines grow from the left over 350ms; the secondary button's ring darkens; the service column's brass top rule draws; nav links get a brass underline; link cards rise 2px with the float shadow; in-app buttons get a brass ring at 50%.
- Focus is always a 2px outline in `var(--focus)` at a 3px offset (inputs use a 2px offset), visible on every interactive element on both surfaces. Never `outline: none` without this replacement.

### 9.4 Live console (hero)

- A new feed row arrives every **4.6s** (`--animate-row-in`: drop 8px, fade in, brass wash at 8%). Hours and task counters tick with the `count` effect (700ms, tabular). The list shows 6 rows, and the oldest fades out. The `.live` dot pings every 2.4s. The feed pauses when less than 20% of the console is visible or the tab is hidden.

### 9.5 Demo conventions (engine in ARCHITECTURE.md; stories and timing in DEMOS.md)

- **Effects** (DEMOS.md §0.3): `fade` 250ms with a 6px rise; `type` at 18ms per character after a 300ms pause; `type-fast` at 12ms per character; `dots` 600ms; `stream` at 30ms per word; `cascade` with a 90ms stagger; `count` 700ms; `draw` lines over 900ms and bars over 600ms with a 60ms stagger; `check` (400ms spinner, then a 200ms check); `swap` 250ms; `click` (500ms move, 150ms press); `pulse` (two pulses over 1,000ms); `strike` (200ms, then a 300ms collapse).
- **Steps:** each step's duration includes a reading hold of at least 1.2s after its last animation, and no step is shorter than 2.5s. Captions are one sentence of at most 90 characters, crossfading in 200ms at each step start. Chapter widths are proportional to step duration, and the active chapter fills linearly.
- **Playback** (DEMOS.md §0.2 wins on thresholds): autoplay once at 50% or more in view, pause under 20% or when the tab is hidden, resume in place, play once and hold on the result card, never loop. Show "Paused" (`.aw-paused`) while paused. Space toggles play when the player has focus.
- **Result:** the card slides up over 500ms; its values count up; its brass rule draws over 800ms.

### 9.6 Reduced motion (`prefers-reduced-motion: reduce`)

- All animation and transition durations become effectively zero (global rule in `global.css` §4). Reveals show immediately. The marquee becomes a static list. The console feed stops on its initial rows.
- **Demos jump to their final state** (`final()`): every pane is populated, the result card sits under the panes, and the caption bar becomes the static step list, with Play stepping through end states with no animation (DEMOS.md §0.6).
- Smooth scrolling turns off.

---

## 10. Do and don't

**Do**

- Use role utilities (`text-fg-2`, `border-line`) so blocks work on paper and navy, and wrap navy sections in `.band-navy` or `.ctx-dark`.
- Label every number with its provenance tag and show its math nearby.
- Show a human approval point (sky, `user-check`) in every product view.
- Keep one primary CTA per view and one brass italic phrase per page.
- Use Geist numbers inside windows and charts, and Fraunces only for headings and editorial figures.
- Use 12px as the absolute text floor, 16px body text and 44px tap targets.
- Name third-party tools in plain text with a mono category label.
- Verify every page at 1440 × 900 and 390 × 844 with `scripts/shot.mjs`, and once with `--reduced-motion`.

**Don't**

- Add hex values, font sizes, radii, shadows or gradients in page code, or use Tailwind's default palette (it is removed).
- Use brass for pending or approval states, as large fills, as brass-500 text, or as brass-600 text under 24px.
- Use purple or lime glows, gradient blobs, glassmorphism (beyond the header blur), noise on navy, dot grids, or "AI orbs".
- Put marketing copy in navy cards or paper styling on agent UI, or place two navy bands next to each other.
- Use pill-shaped buttons (pills are for tags, chips and demo tabs only), or uppercase in headings and buttons.
- Use serif inside windows or charts, tabular figures on big standalone numbers, dashed gridlines, dual axes, pies, or a number on every data point.
- Use stock photos, logos of third-party tools, client logos, testimonials, stars, "trusted by", or certification badges.
- Add nautical clichés beyond the three motifs, or show the dictionary caption when `site.brandStory` is false.
- Type the brand name into a component (use `site.name`) or hardcode a root-relative link (use `url()`).
- Hide the header CTA on phones, stack every demo pane on mobile, or show a window without its `Illustrative` or `Simulated demo` badge.

---

## 11. What changed from the winning prototype (grafts and fixes)

| Judge note | Resolution |
|---|---|
| Console cut by the fold at 1440 × 900 | Display H1 reduced from 80px to 72px max, CTA under the H1, lead and checks in the right column; the `Waiting on you` card is now above the fold (§5) |
| No mobile header CTA | Compact "Free assessment" `.btn-sm` stays in the header down to 360px (§6.14) |
| Text-only services ledger | Tagged mini-window vignette atop every service column (§6.6), from Midnight Signal |
| No security block on Home | Trust strip under the hero, and `.guard-grid` "Guardrails come standard" on Home and /approach/ (§6.17), from Bright Editorial and Midnight Signal |
| Mobile demo about 3 screens long, controls at the bottom | Player and caption move above the stage under 768px, with Research / Draft / Check pane tabs and a ticker (§6.10), from Midnight Signal |
| Spacing too airy (about 190px gaps) | Section padding 64 → 104px, tight 48 → 72px (§5) |
| Brass overloaded; brass-600 at 4.35:1 | The brass law (§2.3); approvals move to sky; brass-600 text only at 24px and up; small brass text is brass-700 / brass-300 |
| No data-viz palette | Validated categorical, sequential, diverging and status sets for paper and navy, plus mark specs (§3) |
| Console micro-type 11 to 13px | A 12px floor everywhere; `on-3` raised to `#93A0B2` (5.62:1 on navy-700) (§2.2, §4.3) |
| Integrations set in serif with brass rings | Geist names with mono category microlabels (§6.19), from Midnight Signal |
| Consulting "fraction of the fee" unsupported | `.cost-ledger` / `.cmp` comparison by provider category, with sourced ranges, our row last and `Modeled estimate` / `Source` footnotes (§6.18); see `consulting.html` |
| "People you can call" with no contact path | Footer contact line from `site.email`, with phone and founder name when approved (§6.15) |
| Motif welded to the placeholder name | Brand-story pieces are config-driven (`site.brandStory`); nautical uses limited to three (§7.6) |
| Heavy Fraunces download | Only the opsz and wght axes (`opsz.css` / `opsz-italic.css`), Latin by `unicode-range`, one preload (§4.1) |
| Only one demo, placeholder tabs | One AppWindow, player and result card for all six demos (§6.10, §6.12) |
| Grafts from Bright Editorial | Annotated FIG with brass knots, legend and caption (§6.11); step tabs over the demo (§6.10); "You get" lines and "What you leave with" (§6.21, §6.24); math bars (§6.7); the dashed "unverified, stays out" row (§6.25); business-type headers on scenarios (§6.7) |
| Grafts from Midnight Signal | Provenance on every number with the "Not a quote…" footnote (§6.4); step durations (§6.21); send-rules ledger and timestamped audit log (§6.8); the "Typical AI email" toggle via `.aw-seg` (§6.10); the floating insight card (§6.11) |
