# DEMO_ENGINE.md: building a demo

Read with `content/DEMOS.md` (§0 player rules plus your storyboard), `DESIGN.md` §6.10, §6.12 and §9.5, and `ARCHITECTURE.md` ("Demo engine contract"). This guide covers everything the engine does for you, plus the few things you write yourself.

- **Engine:** `src/scripts/demo-engine.ts` (vanilla TS, no dependencies)
- **Chrome and parts:** `src/components/demo/`: `AppWindow`, `ResultCard`, `ChatBubble`, `ChatComposer`, `SheetGrid`, `BarChart`, `LineChart`, `chart.ts`, `types.ts`, `demo.css`
- **Reference demo:** `SampleDemo.astro` + `sample-demo.ts` (six steps that use every helper)
- **Test page:** `http://localhost:4321/ai-agency-website/dev/demo-engine/`: the reference demo, a mock DemoTheater driven by events, and a static gallery of the parts

## 1. How a demo is built

Each demo is two files in `src/components/demos/`:

| File | Holds |
|---|---|
| `SalesDemo.astro` | The **final-state** markup inside `<AppWindow>`, plus a 3-line `<script>` that registers it |
| `sales-demo.ts` | `defineDemo({ id, steps })`: captions, durations and the `run(ctx)` choreography |

The component imports the `.ts` file twice: in the frontmatter, so AppWindow can render the chapters, captions, step list and transcript on the server, and in the `<script>`, to register the behavior (`registerDemo` mounts every instance on the page, and any added later, §6). Captions live in one place only.

**The three rules that make it work:**

1. **Markup is the final state.** Write every pane exactly as it looks when the demo ends. That is what visitors see without JavaScript and with reduced motion, so it must be complete and correct.
2. **Attributes say how an element starts** (§4). The engine re-applies them on every reset, replay and jump: `data-hide` (not there yet), `data-type` (empty field), `data-count` (starts at 0), and so on.
3. **Steps animate from the start state to the final state** with `ctx` helpers that pause, abort and fast-forward on their own. Never use `setTimeout`, `setInterval` or raw promises inside a step.

Reset rebuilds the scene from the server-rendered template, so a replay or jump mid-animation always starts clean. Nothing leaks from the run before.

## 2. Template (copy, rename, fill in)

`src/components/demos/sales-demo.ts`

```ts
import { defineDemo } from '@/scripts/demo-engine';

export default defineDemo({
  id: 'sales', // = data-demo; ids: customer | analyst | assistant | marketing | sales | consulting
  steps: [
    {
      label: 'Profile', // chapter label under the progress bar (1–2 words)
      caption: 'Parkline IT wants more law and accounting firms. First, the profile.', // DEMOS.md, max 90 chars
      duration: 4000, // DEMOS.md step duration: animation + reading hold (>= 1.2 s)
      pane: 'list', // phones: the pane tab this step follows
      transcript: ['Ideal customer profile: law and accounting firms with 10–50 staff …'], // key on-screen text
      run(ctx) {
        // DEMOS.md offsets map 1:1 to ctx.at(ms, fn), measured from the step start
        ctx.at(0, () => ctx.show('@icp'));
        ctx.at(250, () => ctx.cascade('@icp-line'));
      },
    },
    {
      label: 'Draft',
      caption: 'An 89-word email built on what it found. Specific, no fluff.',
      duration: 6000,
      pane: 'draft',
      async run(ctx) {
        await ctx.stream('@email-body', { speed: 20 }); // or: sequential awaits
        await ctx.cascade('@marker', { stagger: 120 });
      },
    },
    // … one object per DEMOS.md step …
    {
      label: 'Result',
      caption: 'A researched, personal email in 90 seconds, sent with approval.',
      duration: 4000,
      run: (ctx) => ctx.showResult(), // the last step reveals the result card
    },
  ],
});
```

`src/components/demos/SalesDemo.astro`

```astro
---
import AppWindow from '@/components/demo/AppWindow.astro';
import ChatBubble from '@/components/demo/ChatBubble.astro';
import { site } from '@/config/site';
import demo from './sales-demo';
---
<AppWindow
  demo={demo.id}
  steps={demo.steps}
  title={`${site.name} Sales Agent · Parkline IT`}
  columns="28% 44% 28%"
  tabs={[{ id: 'list', label: 'Prospects' }, { id: 'draft', label: 'Draft' }, { id: 'check', label: 'Check' }]}
  height={540}
  mobileHeight={470}
  ticker="Sent 7:40 am · logged in the CRM"
  result={{ metrics: [{ value: '6.5', unit: 'min', label: "Sam's time per prospect", basis: '…' }, /* 3 tiles */], label: 'Illustrative example' }}
  microcopy="Simulated demo. Parkline IT, Hollis & Grant and the people named are fictional. Figures are illustrative."
>
  <Fragment slot="meta"><span class="aw-status demo-hide-m" data-el="clock" data-initial-text="Mon 4:11 pm">Mon 4:12 pm</span></Fragment>

  <!-- panes are DIRECT children; data-pane ids match `tabs`; put is-active on the first one -->
  <section class="aw-pane aw-pane--sunk is-active" data-pane="list">
    <div class="icp" data-el="icp" data-hide>
      <p data-el="icp-line" data-hide>Who: law and accounting firms with 10–50 staff</p>
      …
    </div>
  </section>
  <section class="aw-pane" data-pane="draft">
    <div class="aw-doc"><div class="aw-doc__body" data-el="email-body" data-stream>Hi Dana, …</div></div>
  </section>
  <section class="aw-pane" data-pane="check">…</section>
</AppWindow>

<script>
  import { registerDemo } from '@/scripts/demo-engine';
  import demo from './sales-demo';
  registerDemo(demo); // mounts every instance on the page; instances added later mount with mountDemos(container)
</script>

<style>
  /* pane layouts with tokens only (DESIGN.md); no new colors, sizes, radii or shadows */
</style>
```

The full working example is `src/components/demo/SampleDemo.astro` + `sample-demo.ts`. Read both before you start. They show chat (type, send, dots, stream), a sheet that fills and drops a duplicate, a chart that grows, a sparkline that draws, an approval click, status chips that swap, a clock that changes, pane following on phones, and the result card.

## 3. What the player does for you (DEMOS.md §0)

| Behavior | Rule |
|---|---|
| Autoplay | Once, when at least **50%** of the window is visible. For windows taller than the viewport, it measures against the viewport height. Never inside `[hidden]`, `[inert]`, `aria-hidden` or `display:none` panels; `autoplay={false}` turns it off |
| Auto-pause | Under 20% visible, or when the tab is hidden; it resumes in place when the demo is back. A pause the visitor chose is never undone |
| Controls | `Play demo` / `Pause` / `Resume` / `Replay` (aria-label on the main button), Replay, `Skip to result`, `Paused`, timecode `0:14 / 0:43`, Space toggles play when the window has focus |
| Progress | One chapter per step, width ∝ duration, active chapter fills linearly. **Click a chapter:** reset, fast-forward steps 1..N−1 with `ctx.instant`, then play step N |
| Steps | Each step lasts exactly `duration`. The engine waits for `run()` and every `ctx.at`/`after`, then holds for the rest. Dev builds warn when the hold is under 1.2 s, a step is under 2.5 s, or a caption is over 90 chars |
| End | The result card slides up over the stage (desktop) or appears below the panes (phones). It holds until Replay and never loops |
| Captions | `Step n of N` plus the caption, crossfading in 200 ms, in a polite live region labeled "Demo captions" |
| Window | The stage is `aria-hidden` and `inert` while playing or paused. The transcript (`Read the step-by-step`) lists every caption, the `transcript` lines and the result metrics |
| Reduced motion | Final state at once, the result card under the panes, and the caption bar replaced by the COPY.md §1.6 line plus the step list. **Play** steps through end states (Previous / Next / chapters) with no animation |
| No JavaScript | Same final state, the "This demo needs JavaScript…" line, the step list and the result card; the player is hidden. Pure CSS, so there is no flash before JS loads |
| Phones (< 768px) | Caption and player move above the stage, 44px buttons, pane tabs (`tabs`) follow `step.pane`. If the visitor taps another tab, it holds until the next step and a brass dot marks the pane with news. The ticker shows the latest action |
| Pause | The virtual clock freezes. Every wait, tween, typing schedule, WAAPI animation and CSS keyframe inside the stage pauses with it |

## 4. Start-state attributes

Put these on elements in the final-state markup. The engine applies them on every reset, and the matching helper brings back the final state.

| Attribute | Start state | Brought back by |
|---|---|---|
| `data-el="name"` | (handle) | targets `'@name'` in every helper, `ctx.el('name')` |
| `data-hide` | `display:none` | `show` `cascade` `reveal` `swap` `type` `stream` `reply` `countUp` |
| `data-ghost` | invisible, **keeps its space** (no layout shift) | same |
| `data-placeholder` | shown at the start; render it with `hidden` because it is gone at the end (skeletons, "Waiting…") | `hide`, `swap` |
| `data-final-only` | hidden during playback; shown only in the static final state (e.g. a comparison figure for reduced motion) | (none) |
| `data-type` | text emptied (final text remembered) | `type`, `typeFast` |
| `data-stream` / `data-stream="grow"` | every word hidden (reserved space / element grows) | `stream`, `reply` |
| `data-count` / `="first"` (+ `data-count-from`) | every number (or the first) at 0 | `countUp` |
| `data-draw` (SVG path, line, polyline) | stroke undrawn | `draw` |
| `data-grow` / `="x"` | scaled to 0 from the baseline (y) or the left (x) | `grow` |
| `data-check` (on `.demo-check`) | idle ring | `check` |
| `data-initial-text="…"` | text replaced with this | `swapText(el)` restores the final text |
| `data-initial-class="…"` | classes added | `removeClass(el)` |
| `data-final-class="…"` | classes removed | `highlight(el)` / `addClass(el)` |
| `data-autoscroll` | scroll box at the top | follows new content to the bottom; scrolled to the end in the final state |
| `data-cue="name"` (inside a stream) | (none) | `stream(el, { cues: { name: fn } })` fires `fn` when that phrase appears |
| `data-atom` (inside a stream) | (none) | streams as one token (markers, chips, `.hl-tag` and SVG already are) |

## 5. `ctx` reference

Targets everywhere: a CSS selector scoped to the demo, `'@name'` (= `[data-el="name"]`, every match), an element, or a list. A target that matches nothing is a no-op, with a dev warning naming the step. Every helper returns a promise you may await. Never `try/catch` around helpers. On abort, their promises simply never resolve.

**Time.** All on the virtual clock (pauses exactly).

| Helper | Does |
|---|---|
| `wait(ms)` | Pause the step |
| `until(ms)` | Wait until `ms` after the step started |
| `at(ms, fn)` | Run `fn` at `ms` after the step started (DEMOS.md "+800 ms"). Tracked: the step waits for it, so fire and forget is fine |
| `after(ms, fn)` | Run `fn` `ms` from now. Tracked |
| `all(...promises)` | Wait for several helpers at once |
| `tween(ms, k => …, easing?)` | Per-frame callback with progress 0→1 |
| `animate(target, keyframes, opts)` | Pausable WAAPI. Prefer individual properties (`translate`, `scale`, `opacity`) so you never fight an element's own `transform` |

**Appear** (DESIGN.md §9.5 timings are the defaults).

| Helper | Default | Notes |
|---|---|---|
| `show(t, { effect, duration, stagger, delay })` | `fade`: 250 ms, 6px rise | effects: `fade` `rise` `scale` `opacity` `wipe` `none` |
| `cascade(t, opts)` | 90 ms stagger | the `cascade` effect |
| `reveal(t)` | scale 0.96 → 1, 250 ms | widgets, popovers, cards |
| `hide(t, { keepSpace })` | 200 ms fade | `keepSpace` leaves a ghost instead of removing |
| `swap(a, b)` | 250 ms | true crossfade when both share a `.demo-stack` parent; otherwise out, then in |
| `swapText(t, text?)` | 250 ms | no `text`: the final text (pairs with `data-initial-text`). Target the text span, not a chip with an icon |
| `setText`, `addClass`, `removeClass`, `toggleClass` | instant | `addClass(el)` uses `data-final-class` |

**Text.**

| Helper | Default | Notes |
|---|---|---|
| `type(t, text? \| opts)` | 18 ms/char after 300 ms; caret | natural, seeded jitter (identical on every replay); the total stays length × speed. `fast` / `typeFast` = 12 ms/char. Plain text only |
| `send(composer, bubble)` | type + 250 ms + 200 ms rise | types the bubble's text into the composer, clears it, then shows the bubble |
| `stream(t, { speed, grow, caret, cues })` | 30 ms/word | keeps markup (`<b>`, `<mark>`, markers). Highlights (`mark`, `.hl`, `.mark-ok`) light up when their last word lands. Pass a chat message and it streams its `[data-stream]` body |
| `dots(t, ms, { before })` | 600 ms | typing indicator bubble |
| `reply(bubble, { dots })` | 600 ms dots, then stream (grows) | the agent-reply pattern |
| `countUp(t, { to, from, duration, format })` | 700 ms ease-out | no `to`: counts every number in the final text and keeps its format (`$12,400`, `18.5 h`). Target a text-only element |

**Emphasis.**

| Helper | Default | Notes |
|---|---|---|
| `highlight(t, classes?, { pulse })` | 250 ms | adds `data-final-class` (or `hl hl-amber`) and fades in hidden `.hl-tag`s inside |
| `pulse(t)` | 2 × 500 ms | `.is-pulsing` ring |
| `strike(t, { collapse })` | 200 ms strike, then a 300 ms collapse | rows must be block or grid boxes (not `<tr>`) |
| `check(t, { spin, stagger })` | 400 ms spinner, 200 ms check | on `.demo-check` elements |
| `click(t, { move, press })` | 500 ms move, 150 ms press | a pointer glides to the target and presses it (`.is-pressed`), then fades. Change the UI after `await ctx.click()` |

**Charts.**

| Helper | Default | Notes |
|---|---|---|
| `draw(t, { duration, stagger })` | 900 ms | stroke-dash draw (any SVG geometry) |
| `grow(t, { axis, stagger, origin })` | 600 ms, 60 ms stagger | from the baseline. No `transform` attribute on targets (wrap them in a `<g>`) |

**Panes and chrome.**

| Helper | Notes |
|---|---|
| `scroll(box, 'bottom' \| 'top' \| px \| target)` | 400 ms; a target scrolls just enough to be visible (a no-op when it already is) |
| `pane(id)` | phones: switch the pane mid-step, unless the visitor picked one |
| `ticker(text)` | the mobile one-line ticker (AppWindow `ticker` prop) |
| `showResult()` | slide up, draw the rule, count the values (about 1 s). Call it in the last step; if you forget, the engine shows the card at the end |

Also on `ctx`: `instant` (true while fast-forwarding; skip purely decorative work), `step`, `root`, `$`, `$$`, `el`, `els`, `text(t)` (final text) and `random()` (seeded).

**DEMOS.md §0.3 effect → helper:** `fade` → `show` · `type` / `type-fast` → `type` / `typeFast` / `send` · `dots` → `dots` · `stream` → `stream` / `reply` · `cascade` → `cascade` · `count` → `countUp` · `pulse` → `pulse` · `strike` → `strike` · `draw` → `draw` (lines) / `grow` (bars) · `swap` → `swap` / `swapText` · `click` → `click` · `check` → `check`.

## 6. API

```ts
import { defineDemo, registerDemo, mountDemos, getDemo } from '@/scripts/demo-engine';

defineDemo({ id, steps, reset?(ctx), final?(ctx) })  // types the definition
registerDemo(def)                                     // in the demo's <script>: remembers def, mounts every [data-demo="id"] on the page → DemoController[]
mountDemos(container)                                 // mounts every registered [data-demo] inside container (markup added later) → DemoController[]
mountDemos(def, scope = document)                     // registers def and mounts its roots inside scope (the older form; same as registerDemo for the page)
getDemo(rootEl)                                       // → DemoController | undefined
// All of them are idempotent: a root mounts once.

interface DemoStep { label?; caption; duration; pane?; transcript?: string | string[]; run(ctx) }
interface DemoController { root; state; step; play(); pause(); toggle(); replay(); jump(i); skip(); reset(); destroy() }
// state: 'idle' | 'playing' | 'paused' | 'ended' | 'static' (reduced motion) | 'stepping' (reduced, after Play)
```

`reset(ctx)` and `final(ctx)` on the definition are optional hooks with an instant `ctx`. They run after the engine's own reset (initial state) or final render (reduced motion). Use `final` for anything that only exists in the static view.

### Programmatic control (DemoTheater)

Dispatch on the `[data-demo]` root; the engine answers with bubbling events.

| Direction | Event | Effect / detail |
|---|---|---|
| in | `demo:play` | play, resume, or replay from the end. Ignored under reduced motion (the static view stays) |
| in | `demo:pause` | pause (never auto-resumed) |
| in | `demo:reset` | back to the idle final-state poster (or the static view) |
| out | `demo:ready` | `{ id }` when the root mounts (lazily added demos: once their markup is in and their definition registered) |
| out | `demo:step` | `{ id, index, total, label, caption }` when a step starts |
| out | `demo:ended` | `{ id }` when the result card holds |

Commands sent to a root that has not mounted yet go nowhere: check `getDemo(root)` first, or wait for its `demo:ready`.

Tab switch recipe (see the `<script>` in `src/pages/dev/demo-engine.astro`): hide the old panel and send it `demo:reset`, unhide the new panel, send it `demo:play`. Hidden panels never autoplay. A panel that becomes visible autoplays once at 50% unless its AppWindow has `autoplay={false}`. With several demos on one switcher, mount them lazily (next section).

### Lazy mounting (one demo at a time)

Each demo is roughly 700 to 1,300 elements. A switcher that shows one at a time keeps the others out of the live DOM until they are needed. The home DemoTheater does this: at load only its first demo is live (the home page went from about 8,600 elements to about 3,400), and the other five wait in a `<template>`, which the browser parses but never styles or lays out. Hidden panels were already skipped by style and layout, so the saving at load is mostly the five players that no longer mount (about 8% less main-thread work on a 4x-throttled phone), and document-wide queries walk well under half the elements.

```astro
<div role="tabpanel" id="theater-panel-sales" hidden>
  <template data-theater-demo><SalesDemo /></template>   <!-- the first panel renders <CustomerAgentDemo /> directly -->
</div>
```

```ts
import { getDemo, mountDemos } from '@/scripts/demo-engine';

function instantiate(panel: HTMLElement) {
  const tpl = panel.querySelector<HTMLTemplateElement>(':scope > template[data-theater-demo]');
  if (!tpl) return;                 // already live
  tpl.replaceWith(tpl.content);     // used once, so move the nodes instead of cloning them
  mountDemos(panel);                // synchronous when the definition is registered
}
// On tab change: instantiate(panel), then demo:play if getDemo(root), otherwise play it on its demo:ready.
```

- **Definitions still register at load.** Astro emits each demo's `<script>` ahead of the section's markup, outside the template, so `registerDemo` runs at load and finds no root yet; `mountDemos(panel)` then mounts at once. If a script ever ends up inside a template, it runs when the template content is inserted, `registerDemo` mounts the waiting root, and `demo:ready` says when.
- **Prepare before an automatic switch.** DemoTheater instantiates the next demo in its hidden panel when the countdown to it starts (4 s ahead, in an idle callback), so auto-advance plays at once. A tab the visitor picks is instantiated on the click, which costs about what unhiding it did before.
- **Behavior is unchanged.** A lazily mounted demo starts idle on its final-state poster (static under reduced motion), and the switcher's `demo:play` / `demo:pause` work as before. Without JavaScript the first demo shows its final state, and the page links to `/demos/`, where every demo is live.
- `/demos/` and the service pages render their demos directly and mount them all at load.

### AppWindow props

`demo`, `steps` (required) · `title` or `app` + `view` (crumb) · `address` (URL pill) · `badge` (default "Simulated demo") · `variant` `'dark' | 'light'` (light = the scene *is* the client's app or document on paper; agent UI stays navy) · `columns` (pane grid, e.g. `"28% 44% 28%"`) · `tabs` `{ id, label }[]` + `activeTab` (phones) · `height` (desktop scene, default 520) · `mobileHeight` · `minHeight` · `sidebarWidth` / `sidebarPane` (with the `sidebar` slot) · `ticker` + `tickerStart` (phones) · `result` (ResultCard props) · `microcopy` · `label` (accessible name) · `autoplay` (default true).

Slots: default (panes as direct children) · `sidebar` · `meta` (title-bar chips and clock, reset with the scene) · `result` (custom card) · `transcript` (extra transcript content).

Keep the scene inside the design canvas: the window is 1120 × 700, so a scene of about 520–540px on desktop. On phones, keep `mobileHeight` near 470 so the whole window fits on a 390 × 844 screen. Scroll long panes with `ctx.scroll` instead of growing the scene.

### ResultCard props

`metrics: { value, unit?, label, basis, count? }[]` (3 tiles) · `label?: 'Illustrative example' | 'Modeled estimate'` or both as an array (Consulting) · `note?` (mono line under the tiles) · `title?` · `context?` · `heading` (default "Result") · `headingLevel` (default 3) · `mathHref` (default `/results/#examples`) · `replay` / `cta` (default true; set `replay={false}` outside an AppWindow). Numbers come from the data modules (`worth.ts`), never retyped.

### Shared parts

- **`ChatBubble`** `from="agent|user"`, `meta`, `el`, `hide` (default true: bubbles arrive), `stream` (grows word by word), `wide` (cards in a chat). Colors follow the surface: navy in agent panes, paper inside `.aw-doc` or a light scene.
- **`ChatComposer`** `placeholder`, `el` (default `composer`): the field `ctx.send()` types into.
- **`SheetGrid`** `columns` (`{ label, width, num, hideMobile }`), `rows` (cells: text or `{ v, attrs, class, html }`), `rowAttrs`, `total` / `totalAttrs`, `formula` / `cell` (formula bar), `index`, `animate` (rows start `data-hide`), `fade` + `minWidth` (a wide sheet that fades at the right edge on phones, DEMOS.md §0.8), `el` (rows `{el}-row`, total `{el}-total`). Rows are grid boxes, so they cascade, collapse and highlight. Merged attributes: `rowAttrs` win over the defaults.
- **`BarChart`** `bars` `{ label, value, display?, accent? }`, `format`, `max`, `ticks`, `values` `'all' | 'accent' | 'none'`, `plot` (px), `title` / `sub` / `note`, `label` (the finding, `role="img"`), `el` (bars `{el}-bar` with `data-grow`, values `{el}-val` with `data-ghost`). One series = `--viz-1`; one `accent` bar switches to accent vs context gray.
- **`LineChart`** `labels`, `series` `{ name, values, tone: 1–6 | 'accent' | 'context', end? }`, `area`, `min` / `max` / `ticks` / `format`, `width` / `height` (aspect), `el` (lines `{el}-line` with `data-draw`, end dots and labels `{el}-end`, area `{el}-area`). Uniform-scaled SVG for marks; every label, dot and tick is HTML, so text never drops below 12px.
- **`chart.ts`** `niceMax`, `niceTicks`, `scaleLinear`, `linePath`, `areaPath`, `barPath` (rounded data end, square baseline), `frac`.
- **CSS helpers (`demo.css`)** `.demo-stack` (children share one grid cell, for crossfades and skeleton → content), `.demo-check`, `.demo-hide-m` (hidden on phones), `.typing-dots--lg`, `.chat-*`, `.sheet*`, `.bc*`, `.lc*`.

## 7. Rules

**Performance**

- Animate `opacity` and the individual `translate` / `scale` properties. Never animate `width`, `height`, `top` or `left` in a loop (`strike`'s one-time collapse is the exception).
- Only playing demos run a frame loop (one `requestAnimationFrame` per playing instance). Idle, paused and ended demos cost nothing. No timers exist outside the engine's virtual clock.
- Reserve space: fixed scene height, `data-ghost` for things that appear in place, `min-height` on boxes that fill up, `.demo-stack` for swaps. Playback must never move the page.
- Keep scenes lean: a few hundred elements, inline SVG only, no images, no web fonts beyond the site's.
- A page that shows one demo at a time keeps the hidden ones in a `<template>` and mounts each on first use (§6 "Lazy mounting"), so phones mount only the demo on screen and the live DOM stays small.
- Steps may only touch the DOM through `ctx` or right after an awaited helper. Never keep an element reference across steps: reset rebuilds the scene, so look elements up with `'@name'` inside `run`.

**Accessibility**

- No focusable elements in the scene: draw buttons as `<span class="app-btn">`. The stage is `aria-hidden` and `inert` while playing, and the result card's real links appear only when it holds.
- Fill in `transcript` lines for the key messages, emails and findings (DEMOS.md §0.7). AppWindow adds the captions and result metrics.
- Every status needs an icon **and** a word (DESIGN.md §2.4). Approval is always sky with `user-check`, never brass.
- Charts get `label` (the finding). Text is never under 12px, at any width.
- Pane tabs use `aria-pressed`; the main button changes its `aria-label` (Play demo / Pause / Resume / Replay) and is not a pressed toggle; the current chapter has `aria-current="step"`.

**Content and honesty**

- Exact copy, numbers and timings from `content/DEMOS.md`; brand via `site.name`; links via `url()` (ResultCard does this).
- The result card label is `Illustrative example` (Consulting adds `Modeled estimate`); the window badge stays `Simulated demo`.
- No ids inside a demo (several instances can share a page). Use `data-el`.

**Pitfalls**

- Panes must be direct children of the AppWindow default slot (that is where `[data-panes] > [data-pane]` looks).
- `countUp` and `swapText` replace text: point them at a text-only span, not a chip that holds an icon.
- A `data-hide` element inside a `data-hide` parent needs both shown (parent first).
- `type` is plain text; use `stream` for rich text.
- Don't wrap helpers in `try/catch`. Don't `await` something that is not a helper, except `ctx.all`.

## 8. Verify

```bash
# moments (each --wait roughly doubles: load + wait, then scroll + wait)
node scripts/shot.mjs http://localhost:4321/ai-agency-website/<page>/ --selector "[data-demo=sales]" --wait 2000 --out .shots/<you>
node scripts/shot.mjs … --wait 6000          # mid-demo
node scripts/shot.mjs … --wait 12000         # late steps / result
node scripts/shot.mjs … --reduced-motion     # static final state, step list, result under the panes
node scripts/shot.mjs … --mobile             # chunks; check pane tabs follow the action
node scripts/shot.mjs … --click "[data-demo=sales] .aw-time" --click "[data-demo=sales] .aw-ctrl [data-demo-play]"   # scroll in, autoplay, pause
node scripts/shot.mjs … --click "[data-demo=sales] [data-demo-skip]"   # result card
```

Use `.aw-ctrl [data-demo-replay]` for the player's Replay (the result card has one too). `--selector` element shots of windows taller than the viewport can skip autoplay on phones; use full-page chunks there. The run must end with `ERRORS: 0`. In dev builds also check the browser console for `[demo-engine]` warnings: short reading holds, unmatched targets, caption length, a chapter/step mismatch.

## 9. Notes for the design owner

- **Thresholds:** autoplay at 50% and pause under 20% (DEMOS.md §0.2, which DESIGN.md §9.5 says wins). ARCHITECTURE.md still says 40%. The value is one constant (`AUTOPLAY_AT`) in the engine.
- **global.css, phones:** `.aw-stage.has-result .aw-result` (0,3,0) keeps `transform: translate(-50%, 0)` under 768px and pushes the in-flow card half off screen. `demo.css` overrides it; the fix belongs in global.css (`transform: none` in the mobile block with matching specificity).
- **global.css, panes:** `[data-panes] > [data-pane]:not(.is-active) { display: none }` sits in `@layer components`, so any pane with its own (unlayered) `display` stays visible on phones. `demo.css` re-asserts it with `!important` under `html.js`.
- **global.css, reduced motion:** `.aw-result` is always static and visible under reduced motion; `demo.css` hides it again until the last step while stepping.
