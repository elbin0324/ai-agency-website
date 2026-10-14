# MOTION.md: the site-wide motion system

Scroll motion for the Halyard site, built on GSAP and ScrollTrigger. Read it with DESIGN.md §9 (tokens, reveal, demos) and principle §1.6, "Motion proves work happened". This file is the contract. The code lives in `src/scripts/motion.ts` (the attribute API is also summarized at the top of that file) and `src/styles/motion.css`. The live test page is `/dev/motion/` (`src/pages/dev/motion.astro`).

**Owner:** motion. The attribute names below are stable. Pages opt in with attributes and never import GSAP themselves.

---

## 1. How it works

- **Opt-in.** Nothing moves unless it carries `data-motion="<effect>"`. To combine effects on one element, separate them with spaces: `data-motion="tilt-in spotlight"`.
- **Loaded once.** `BaseLayout` imports `motion.css` and runs `motion.ts` on every page. You don't add a script.
- **Final state first.** The markup is the final state. Under `prefers-reduced-motion: reduce`, and without JavaScript, nothing is hidden, split or moved. Every effect runs inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`, and `spotlight` and `magnetic` also require `(hover: hover) and (pointer: fine)`.
- **Cheap to render.** Only `transform` and `opacity` animate. The two exceptions are `draw`, which animates the stroke dash, and `spotlight`, which moves a gradient on hover only. There is no scroll hijacking, no pinning and no smooth-scroll library.
- **Measured from layout.** Trigger positions are computed from layout, not from the element's on-screen box. A count inside a tilting window, or a line inside a parallax plate, fires where it sits on the page, not where its moving parent happens to be. ScrollTrigger refreshes after the web fonts load and whenever the page height changes.
- **Set up lazily.** Each element is set up only when it comes within about one viewport of entering (one IntersectionObserver per effect, `rootMargin: 100%`), so load-time work such as word splitting and trigger measurement covers only what is near the screen. This halved the home page's load-time blocking. Setup runs inside the matchMedia context, so reverting still undoes everything. The pinned day story (`DayStory.astro`) is not part of this system and still sets up at load, because its pin spacing affects layout.
- **Failsafe.** Until the script arrives, motion.css hides only what is about to animate in (`split`, `count`, `stagger` children). If the script never arrives, the content appears after 2.5s anyway.

---

## 2. Attribute reference

Times are in seconds. Positions (`data-start`, `data-end`) use ScrollTrigger's "<element edge> <viewport line>" syntax, for example `"top 80%"` (the element's top meets the line 80% down the viewport).

### `split`: headings rise word by word

```html
<h2 class="type-h2" data-motion="split">Find out where AI pays off first.</h2>
<h1 class="type-h1" data-motion="split">Motion that proves <em>the work happened</em>.</h1>
```

Each word rises out of its own mask the first time the heading enters (at `top 88%`). The brass italic `<em>` phrase lands a beat later. Once the words land, the original markup comes back.

| Option | Default | |
|---|---|---|
| `data-delay` | `0` | wait before starting (0 to 3) |
| `data-start` | `"top 88%"` | when it plays |

- **Accessible text.** A heading keeps one `aria-label` with the whole sentence while it is split. On a non-heading, the pieces are hidden from screen readers and a visually hidden copy is read instead.
- **Fallback.** A heading that contains a link or button, or runs longer than 24 words, gets a plain fade-up instead of the word split.
- **Use on** H1, H2, CTA headlines and short display lines. Never on body copy.

### `tilt-in`: the product settles into place

```html
<div class="app-window" data-motion="tilt-in">…</div>
```

This is the Apple-style product reveal, scrubbed to scroll. The window starts reclined 18° in perspective, at 92% scale and 56px low. It stands up flat as its top travels from the bottom of the viewport to 38% down, and it reclines again when you scroll back. If it sits in the first viewport it renders flat, with no effect.

| Option | Default | |
|---|---|---|
| `data-tilt` | `18` | starting angle in degrees (0 to 40) |
| `data-start` / `data-end` | 96% → 38% of the viewport | custom scrub range |

- **Use on** app windows and product figures, at most one per section. KPI values inside the window can carry `count`, and they count up while the window stands up.

### `parallax`: depth for decoration

```html
<figure class="cta-grid__art" aria-hidden="true" data-motion="parallax" data-speed="0.08">
  <svg class="sail">…</svg>
  <figcaption class="brand-def">…</figcaption>
</figure>
```

The element drifts slower than the page, scrubbed. Each element is in its natural place when its center crosses the middle of the viewport. An element in the first viewport starts at rest.

| Option | Default | |
|---|---|---|
| `data-speed` | `0.12` | 0.08 = 8% slower than the page. Negative values come forward. Range −0.5 to 0.5 |

- **Drift** is about `speed × (viewport height + element height) / 2` either way, capped at 96px. Use 0.06 to 0.12.
- **Leave room.** The element moves into the space above and below it. Put the attribute on the outermost wrapper of the art (the svg and its caption together), never on one piece of a group. Never put two stacked neighbors at different speeds, because they will collide.
- **Decoration only.** Never on headings, copy, buttons or forms. DESIGN.md §1.6 says nothing decorative moves. Parallax is the one sanctioned exception, so keep it to a slow drift on one piece of art per page, such as the CTA sail.

### `draw`: SVG strokes draw with scroll

```html
<svg class="steps__rope" aria-hidden="true" data-motion="draw">…</svg>
<g data-motion="draw" data-start="top 80%" data-end="center 35%">…</g>
```

Every stroked shape inside the element draws along its length, scrubbed forward and back. Shapes without a stroke are left alone. The trigger is the element, or its `<svg>` when the attribute is on an inner group. Lines already in view on load stay drawn.

| Option | Default | |
|---|---|---|
| `data-draw-target` | all stroked shapes | CSS selector for a subset |
| `data-start` / `data-end` | `"top 85%"` → `"bottom 40%"` | scrub range |

- **Use on** the halyard rope in `Steps`, the sail's halyard, and brass rules in illustrations. Never on chart marks inside demos, which have their own `draw` effect (DESIGN.md §9.5).

### `count`: numbers count up once

```html
<p class="stat__fig" data-motion="count">$12,400<small>a year</small></p>
<span class="kpi__value" data-motion="count" data-count-from="71">$46</span>
```

The number counts up once on entry to the value already in the text. Currency, separators, decimals and units are kept, so `27.5h`, `1,240`, `$12,400` and `2.1x` all work. The real figure stays in the HTML, so crawlers, screen readers and readers without JavaScript always get it. The ticking digits are hidden from assistive technology.

| Option | Default | |
|---|---|---|
| `data-count-from` | `0` | start value. Higher than the target counts down (cost per lead) |
| `data-duration` | `1.4` | 0.2 to 4 |
| `data-delay` | `0` | stagger tiles by 0.1 |
| `data-start` | `"top 90%"` | |

- **Use on** headline figures in stat ledgers and KPI tiles. Only the first number in the element counts, so put the attribute on the figure itself, not on a card.
- **Serif figures fade instead.** Fraunces has no tabular digits, so a ticking serif number would push its unit sideways: on a Fraunces figure (`.stat__fig`, `.result-tile__v`) `count` skips the tween and fades the final figure up 10px over 0.6s on entry, keeping `data-delay` and `data-start`. Geist figures (KPI tiles) still count.

### `stagger`: children cascade in

```html
<div class="grid gap-6 lg:grid-cols-3" data-motion="stagger">…cards…</div>
<div class="steps" data-motion="stagger" data-stagger-target=".step">…</div>
```

Direct children (or the `data-stagger-target` matches) fade and rise 28px, 80ms apart and at most about 0.4s of spread, as each row enters. They play once.

| Option | Default | |
|---|---|---|
| `data-stagger-target` | direct children | CSS selector |
| `data-delay` | `0` | |
| `data-start` | `"top 92%"` | |

- **Use on** card grids, step lists and ledger rows. It replaces `data-reveal` on the container, so don't put `data-reveal` on the children.

### `spotlight`: light follows the cursor

```html
<Card href="/results/" data-motion="spotlight">…</Card>
```

A soft light follows a mouse or trackpad across the card, with a brass glint along its edge. Paper cards get white light (as in the hero, DESIGN.md §7.2). Navy surfaces (`.app-window`, `.band-navy`, `.ctx-dark`) get ivory at 7%. It is never shown on touch screens.

- **Use on** link cards, vignettes and a showcase window. Use it on one card family per page.

### `magnetic`: CTAs lean toward the cursor

```html
<Button href={site.cta.href} size="lg" icon="arrow-right" data-motion="magnetic">{site.cta.label}</Button>
```

The button leans up to 6px toward a fine pointer and settles back when the pointer leaves. It moves the CSS `translate` property, so it composes with the button's own 1px hover rise.

| Option | Default | |
|---|---|---|
| `data-strength` | `0.3` | 0 to 1 |

- **Use on** the primary CTA of the hero and of the final CTA band. Never on nav links, form controls or every button on the page.

---

## 3. Page-level motion (automatic)

- **Cross-page view transitions** (`motion.css`): `@view-transition { navigation: auto; }`. The old page fades out in 180ms and the new one fades in and rises 10px over 360ms. The header (`.site-header`, `view-transition-name: site-header`) stays put. It needs no client router and is off under reduced motion. Browsers without support navigate normally.
- **Scroll-progress hairline**: 2px of ink (`--color-rule-strong`) that fills along the bottom edge of the sticky header as you read. It is deliberately not brass: the header's one brass mark is the 3px letterhead rule on top (DESIGN.md §2.3). Pages shorter than about 1.75 viewports get no bar. To turn it off on a page, use `<BaseLayout bodyClass="m-no-progress">`.

---

## 4. Restraint rules

1. **One or two effects per section.** Typically that's a `split` heading plus one of `tilt-in`, `stagger`, `count` or `draw`. Several effects in one section read as noise, not polish.
2. **Never on body text.** `split` is for headings and short display lines, and parallax is for decoration only. Paragraphs, lists, forms and legal text don't move.
3. **Never inside demos.** The demo engine owns everything inside `[data-demo]`, and motion.ts ignores attributes there (in dev it logs a warning). `tilt-in`, `parallax` or `spotlight` may sit on the demo's root window itself.
4. **Not in the first viewport,** except `split` on the hero H1 and `magnetic` on the hero CTA. Hero windows render flat, and nothing in the first viewport is hidden for long.
5. **One `magnetic` CTA per view.** Brass is rationed and so is attention (DESIGN.md §2.3).
6. **Motion proves work.** Prefer effects that show something happening (numbers count, the rope draws, the product settles) over pure ornament.

---

## 5. With `data-reveal`

`data-motion` wins, so nothing animates twice:

- **Same element** (`data-motion="split" data-reveal`): the reveal is switched off and only the motion runs.
- **Stagger children** with `data-reveal`: their reveal offset is switched off.
- **A reveal wrapper around `split`, `tilt-in` or `stagger`.** This is the common case: `SectionHeader` reveals `.sec-head`, and the heading inside it splits. The wrapper keeps its fade but drops its 14px rise.
- `count`, `draw` and `parallax` inside a reveal wrapper need nothing special.

---

## 6. JavaScript API

```ts
import { initMotion, refreshMotion } from '@/scripts/motion';

const stop = initMotion(container); // after injecting markup: picks up new [data-motion] elements once
refreshMotion();                    // after a layout change the observers can't see
stop();                             // reverts everything that call set up
```

`initMotion()` is idempotent per element and effect. It returns a cleanup function, which HMR uses in dev.

---

## 7. QA checklist

- `/dev/motion/` at 1440 × 900 and 390 × 844: scroll slowly through every section, then scroll back up (scrubbed effects reverse, once-effects stay done).
- Load a page deep (`/dev/motion/#cta`) and scroll up: nothing above stays hidden.
- `node scripts/shot.mjs <url> --reduced-motion`: everything is in its final state, with no split words and no progress bar.
- With JavaScript disabled, all content is visible.
- At 390px there is no horizontal scroll, and the console shows `ERRORS: 0`.
