// Scroll motion for the day story. OWNER: home-daystory. Self-contained on purpose: it does not use
// the shared motion system, only GSAP (ScrollTrigger + SplitText).
//
// - Pinned (PIN_QUERY): the stage pins for about 2.9 screen heights and one scrubbed timeline is the
//   day. Every scroll position moves something:
//     - the window clock runs minute by minute through each moment, then fast-forwards (still minute by
//       minute) to the next one while the windows hand off;
//     - the rail's brass line fills continuously and its head knot is "now"; stops light as it arrives;
//     - the light moves from a warm morning through a white midday and an amber afternoon to a navy
//       evening (background washes and the window's halo, opacity only);
//     - each window's work builds with the scroll (rows sorted and the inbox emptied, a chat streamed,
//       a chart drawn, drafts stacked on a deck, totals counted), is finished by about 63% of its
//       moment and holds briefly;
//     - hand-offs move in depth: the old window falls back and darkens, the next slides up over it
//       (opaque almost at once, so the two never show through each other); the copy lifts out, then
//       the next line rises word by word, and the copy drifts gently in between.
//   The section head fades just before the pin, so the stage starts clean.
//   Transforms and opacity only (plus the clock and counter text); no scroll hijacking.
// - Motion allowed but no pin (phones, short screens): the static sequence with reveals, and each
//   window's work (and its clock) builds with the scroll as the window passes through the screen.
// - Reduced motion or no JS: nothing runs; the markup is the final, readable sequence.
// The inline script in DayStory.astro adds .is-pinned before first paint (same query) so the layout
// never jumps; if this module never runs, that script removes the class again on load.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { clockText } from './clock';
import { PIN_QUERY } from './pin-query';

gsap.registerPlugin(ScrollTrigger, SplitText);

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

/** Pinned scroll length in viewport heights (five moments of about 0.58 screens each; 3.3 until 2026-10-21, when
 *  the control room joined the page and the home page had to stay no longer than before). */
const SCREENS = 2.9;
/** Within each moment (one timeline unit): the work builds over [BUILD_AT, BUILD_AT + BUILD_LEN]... */
const BUILD_AT = 0.03;
const BUILD_LEN = 0.6;
/** ...and the hand-off to the next moment takes the last HAND of the unit (the next lands at k + 1). */
const HAND = 0.26;
/** The clock dwells on the moment until the hand-off starts. */
const DWELL = 1 - HAND;
const SCRUB = 0.7;

const $ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel));

type Sync = () => void;
type Mode = 'pin' | 'flow';
type Ctx = { syncs: Sync[]; mode: Mode };

/** A number written into its element from a tween value (text only; tiles have fixed widths). */
function counter(el: HTMLElement, from: number, to: number, duration: number, ctx: Ctx): gsap.core.Tween {
  const raw = String(to);
  const dec = (raw.split('.')[1] ?? '').length;
  const o = { v: from };
  const write = () => { const t = o.v.toFixed(dec); if (el.textContent !== t) el.textContent = t; };
  write();
  ctx.syncs.push(write);
  return gsap.fromTo(o, { v: from }, { v: to, duration, ease: 'none', onUpdate: write, immediateRender: false });
}
const numAttr = (el: HTMLElement, name: string, fallback = 0) => {
  const v = parseFloat(el.getAttribute(name) ?? '');
  return Number.isFinite(v) ? v : fallback;
};

/** Each window's work as a timeline exactly 1 long (0 = the window has just landed, 1 = done and held).
 *  Built with the starting state applied; the caller places it in the pinned timeline or scrubs it. */
const builds: Record<string, (s: HTMLElement, ctx: Ctx) => gsap.core.Timeline> = {
  // 7:30 am. Rows are tagged one by one while the counts climb and "left to sort" falls to zero. In the
  // pinned stage the routine rows (filed, assigned) slide out, the rest close up and a receipt lands.
  inbox(s, ctx) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const rows = $$(s, '[data-ds-row]');
    const n = Math.max(1, rows.length);
    const t0 = 0.05;
    const span = 0.78;
    const step = span / n;
    const at = (i: number) => t0 + i * step;

    const sorting = $(s, '[data-ds="sorting"]');
    const sorted = $(s, '[data-ds="sorted"]');
    if (sorting) tl.fromTo(sorting, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.04 }, t0 + span + 0.02);
    if (sorted) tl.fromTo(sorted, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'back.out(2)' }, t0 + span + 0.03);
    const left = $(s, '[data-ds-left]');
    if (left) tl.add(counter(left, numAttr(left, 'data-ds-left'), 0, span, ctx), t0);
    $$(s, '[data-ds-count]').forEach((el) => tl.add(counter(el, 0, numAttr(el, 'data-ds-count'), span, ctx), t0));

    rows.forEach((row, i) => {
      const dot = $(row, '[data-ds="unread"]');
      const chip = $(row, '[data-ds="mailchip"]');
      if (dot) tl.fromTo(dot, { opacity: 1 }, { opacity: 0, duration: 0.03 }, at(i));
      if (chip) tl.fromTo(chip, { opacity: 0, scale: 0.82, x: 8 }, { opacity: 1, scale: 1, x: 0, duration: 0.05, ease: 'back.out(2)' }, at(i));
    });

    if (ctx.mode === 'pin') {
      const done = rows.filter((r) => r.hasAttribute('data-ds-done'));
      const h = (list: HTMLElement[]) => list.reduce((sum, r) => sum + r.offsetHeight, 0);
      // A routine row is swiped out to the right and the rows below close up behind it while it is
      // still fading, so the list never shows an empty slot.
      done.forEach((row) => {
        tl.fromTo(row, { opacity: 1, x: 0 }, { opacity: 0, x: 56, duration: 0.045, ease: 'power1.in' }, at(rows.indexOf(row)) + 0.045);
      });
      // Rows below a leaving row close the gap (measured, so it holds at any window width).
      rows.forEach((row, i) => {
        const above = done.filter((d) => rows.indexOf(d) < i);
        above.forEach((d, k) => {
          tl.fromTo(row, { y: () => -h(above.slice(0, k)) }, {
            y: () => -h(above.slice(0, k + 1)), duration: 0.06, ease: 'power2.inOut', immediateRender: k === 0,
          }, at(rows.indexOf(d)) + 0.07);
        });
      });
      const receipt = $(s, '[data-ds="receipt"]');
      if (receipt) tl.fromTo(receipt, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, t0 + span + 0.05);
    }
    tl.set({}, {}, 1);
    return tl;
  },

  // 9:40 am. The customer's messages arrive whole, the agent's replies stream in word by word, the thread
  // scrolls up like a chat, and each step behind the scenes checks off when the conversation reaches it.
  chat(s, ctx) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const stack = $(s, '[data-ds="stack"]');
    const items = [...$$(s, '[data-ds="msg"]'), ...$$(s, '[data-ds="booked"]')];
    // When items[0..i] are showing, the stack sits this far down so the newest one is at the bottom.
    const yShown = (i: number) => () => {
      if (!stack) return 0;
      if (i < 0) return stack.offsetHeight + 16;
      const it = items[i];
      return Math.max(0, stack.offsetHeight - (it.offsetTop + it.offsetHeight));
    };
    const at = [0.02, 0.1, 0.27, 0.34, 0.6, 0.7];
    const streamFor = [0, 0.11, 0, 0.2, 0, 0];
    items.forEach((it, i) => {
      const t = at[i] ?? 0.7;
      if (stack) tl.fromTo(stack, { y: yShown(i - 1) }, { y: yShown(i), duration: 0.045, ease: 'power2.out', immediateRender: i === 0 }, t);
      tl.fromTo(it, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.045, ease: 'power2.out' }, t);
      if (it.hasAttribute('data-ds-stream') && streamFor[i]) {
        const split = SplitText.create(it, { type: 'words', tag: 'span', wordsClass: 'ds-sw', aria: 'none' });
        const words = split.words as HTMLElement[];
        if (words.length) tl.fromTo(words, { opacity: 0 }, { opacity: 1, duration: 0.012, stagger: streamFor[i] / words.length }, t + 0.03);
      }
    });
    const acts = $$(s, '[data-ds="act"]');
    const actAt = [0.3, 0.42, 0.5, 0.66, 0.8];
    acts.forEach((a, i) => {
      const t = actAt[i] ?? 0.8;
      tl.fromTo(a, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.05, ease: 'power2.out' }, t);
      const ic = $(a, '.sc-acts__ic');
      if (ic) tl.fromTo(ic, { scale: 0.3 }, { scale: 1, duration: 0.05, ease: 'back.out(2.6)' }, t + 0.02);
    });
    tl.set({}, {}, 1);
    return tl;
  },

  // 1:15 pm. Both lines draw left to right behind a scan line; the slide is shaded once the front passes
  // week 4; then the end labels, the insight, its math and the owner's decision.
  margin(s) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const D0 = 0.03;
    const DRAW = 0.56;
    const wipe = $<SVGElement>(s, '[data-ds="wipe"]');
    if (wipe) tl.fromTo(wipe, { scaleX: 0, svgOrigin: '0 0' }, { scaleX: 1, svgOrigin: '0 0', duration: DRAW }, D0);
    const scan = $(s, '[data-ds="scan"]');
    if (scan) {
      tl.fromTo(scan, { xPercent: 0 }, { xPercent: 100, duration: DRAW }, D0);
      tl.fromTo(scan, { opacity: 0 }, { opacity: 1, duration: 0.03 }, D0);
      tl.fromTo(scan, { opacity: 1 }, { opacity: 0, duration: 0.05, immediateRender: false }, D0 + DRAW);
    }
    const front4 = D0 + DRAW * (3 / 7);
    const band = $(s, '[data-ds="band"]');
    if (band) tl.fromTo(band, { opacity: 0 }, { opacity: 1, duration: 0.12 }, front4);
    const annot = $(s, '[data-ds="annot"]');
    if (annot) tl.fromTo(annot, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, front4 + 0.05);
    const ends = $$(s, '[data-ds="end"]');
    if (ends.length) tl.fromTo(ends, { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: 0.015 }, D0 + DRAW - 0.01);
    const insight = $(s, '[data-ds="insight"]');
    if (insight) tl.fromTo(insight, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.64);
    const math = $(s, '[data-ds="math"]');
    if (math) tl.fromTo(math, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.06, ease: 'power2.out' }, 0.73);
    const decide = $(s, '[data-ds="decide"]');
    if (decide) tl.fromTo(decide, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.82);
    tl.set({}, {}, 1);
    return tl;
  },

  // 3:30 pm. Prospects researched one by one, the chosen email written line by line, checks pass, then
  // the finished drafts stack up behind it while "waiting on you" climbs to 9.
  outreach(s, ctx) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const pros = $$(s, '[data-ds="pro"]');
    if (pros.length) tl.fromTo(pros, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.06, stagger: 0.07, ease: 'power2.out' }, 0.02);
    const researched = $(s, '.sc__list [data-ds-count]');
    if (researched) tl.add(counter(researched, 0, numAttr(researched, 'data-ds-count'), 0.3, ctx), 0.02);
    const more = $(s, '[data-ds="more"]');
    if (more) tl.fromTo(more, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.3);
    const lines = $$(s, '[data-ds="line"]');
    if (lines.length) tl.fromTo(lines, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.06, stagger: 0.065, ease: 'power2.out' }, 0.3);
    const checks = $(s, '[data-ds="checks"]');
    if (checks) tl.fromTo(checks, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.64);
    const approve = $(s, '[data-ds="approve"]');
    if (approve) tl.fromTo(approve, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.7);
    const waiting = $(s, '.sc-approve [data-ds-count]');
    if (waiting) tl.add(counter(waiting, numAttr(waiting, 'data-ds-from', 1), numAttr(waiting, 'data-ds-count'), 0.2, ctx), 0.72);
    // The finished drafts stack up behind the selected one while the count climbs: each card rises
    // out from behind it to its step on the deck (final values match SceneOutreach's CSS).
    const pile = $$(s, '[data-ds="pile"] > i');
    const deck = [[-7, 1], [-14, 0.8], [-21, 0.55]];
    pile.forEach((card, i) => {
      const [y, opacity] = deck[i] ?? deck[deck.length - 1];
      tl.fromTo(card, { y: 6, opacity: 0 }, { y, opacity, duration: 0.07, ease: 'back.out(1.6)' }, 0.74 + i * 0.06);
    });
    tl.set({}, {}, 1);
    return tl;
  },

  // 6:00 pm. The tiles count up while the day track fills from 7 am; each moment's knot lights as the
  // fill passes it and its log line arrives with it. The open decision lands last.
  summary(s, ctx) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const F0 = 0.04;
    const FILL = 0.6;
    const counts = $$(s, '.sc-kpis [data-ds-count]');
    counts.forEach((el, i) => tl.add(counter(el, 0, numAttr(el, 'data-ds-count'), FILL - i * 0.06, ctx), F0 + i * 0.04));
    const fill = $(s, '[data-ds="dayfill"]');
    if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: FILL }, F0);
    const to = fill ? parseFloat(fill.style.getPropertyValue('--to')) || 1 : 1;
    const marks = $$(s, '[data-ds="mark"]');
    const logs = $$(s, '[data-ds="log"]');
    marks.forEach((m, i) => {
      const pos = Math.min(1, (parseFloat(m.style.left) || 0) / 100 / to);
      const t = F0 + FILL * pos;
      tl.fromTo(m, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(2.4)' }, Math.max(0, t - 0.02));
      if (logs[i]) tl.fromTo(logs[i], { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.06, ease: 'power2.out' }, t);
    });
    const next = $(s, '[data-ds="next"]');
    if (next) tl.fromTo(next, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.76);
    tl.set({}, {}, 1);
    return tl;
  },
};

/** Final text of every counter and clock, restored when a layout reverts (matchMedia change). */
function snapshotText(root: HTMLElement) {
  const els = $$(root, '[data-ds-count], [data-ds-left], [data-ds-clock]');
  const texts = els.map((el) => el.textContent);
  return () => els.forEach((el, i) => { if (el.textContent !== texts[i]) el.textContent = texts[i]; });
}

function buildPinned(root: HTMLElement) {
  const pinEl = $(root, '[data-ds-pin]')!;
  const copies = $$(root, '[data-ds-copy]');
  const scenes = $$(root, '[data-ds-scene]');
  const rail = $$(root, '[data-ds-rail]');
  const fill = $(root, '[data-ds-fill]');
  const head = $(root, '[data-ds-head]');
  const cue = $(root, '[data-ds-cue]');
  const clocks = $$(root, '[data-ds-clock]');
  const light = (name: string) => $(root, `[data-ds-light="${name}"]`);
  const times = scenes.map((s) => [Number(s.dataset.dsMinutes), Number(s.dataset.dsTick) || 0] as const);
  const day = root.dataset.dsDay || 'Mon';
  const N = scenes.length;
  const last = N - 1;
  const restoreText = snapshotText(root);

  root.classList.add('is-pinned');

  // Text that follows the scroll (clock, counters) is re-written from its tween values on every render
  // and after each refresh: ScrollTrigger jumps the timeline with callbacks suppressed when it refreshes.
  const ctx: Ctx = { syncs: [], mode: 'pin' };
  const syncAll = () => ctx.syncs.forEach((f) => f());
  const clock = { m: times[0][0] };
  const writeClock = () => {
    const t = clockText(clock.m, day);
    clocks.forEach((c) => { if (c.textContent !== t) c.textContent = t; });
  };
  ctx.syncs.push(writeClock);
  writeClock();

  // Headline words of the incoming moments rise into place (the first one is already on screen).
  const splits = copies.map((c, i) => (i === 0 ? null : SplitText.create($(c, '[data-ds-line]')!, { type: 'words', tag: 'span', wordsClass: 'ds-word' })));

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: syncAll,
    scrollTrigger: {
      trigger: pinEl,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * SCREENS)}`,
      pin: true,
      scrub: SCRUB,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  tl.set({}, {}, N); // one unit per moment; the pin releases as the summary's evening ends

  // The clock: minute by minute through each moment, then a faster run to the next one during the
  // hand-off. The summary's minutes run on into the evening until the pin releases.
  times.forEach(([m, tick], k) => {
    if (k < last) {
      tl.fromTo(clock, { m }, { m: m + tick, duration: DWELL, onUpdate: writeClock, immediateRender: false }, k);
      tl.fromTo(clock, { m: m + tick }, { m: times[k + 1][0], duration: HAND, ease: 'sine.inOut', onUpdate: writeClock, immediateRender: false }, k + DWELL);
    } else {
      tl.fromTo(clock, { m }, { m: m + tick, duration: 1, onUpdate: writeClock, immediateRender: false }, k);
    }
  });

  // The rail fills continuously; stops light up as the line reaches them.
  if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: last }, 0);
  if (head) tl.fromTo(head, { xPercent: 0 }, { xPercent: 100, duration: last }, 0);
  rail.forEach((item, k) => {
    if (!k) return;
    tl.fromTo(rail[k - 1], { opacity: 1 }, { opacity: 0.7, duration: 0.16, immediateRender: false }, k - 0.2);
    tl.fromTo(item, { opacity: 0.42 }, { opacity: 1, duration: 0.16, immediateRender: false }, k - 0.2);
    const dot = $(item, '[data-ds-dot]');
    if (dot) tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.07, ease: 'back.out(2.4)', immediateRender: false }, k - 0.04);
  });

  // Daylight: warm morning, clear midday, amber afternoon, navy evening (t = moments: 0 7:30, 1 9:40,
  // 2 1:15, 3 3:30, 4 6:00, 5 the evening). Keyframes are opacity values at those points.
  const keys = (el: Element | null, frames: [number, number][]) => {
    if (!el) return;
    gsap.set(el, { opacity: frames[0][1] });
    for (let i = 1; i < frames.length; i++) {
      const [t0, a] = frames[i - 1];
      const [t1, b] = frames[i];
      tl.fromTo(el, { opacity: a }, { opacity: b, duration: t1 - t0, ease: 'sine.inOut', immediateRender: false }, t0);
    }
  };
  keys(light('dawn'), [[0, 1], [0.9, 0.55], [1.7, 0]]);
  keys(light('noon'), [[0.5, 0], [1.4, 1], [2.3, 1], [3.1, 0]]);
  keys(light('amber'), [[2.3, 0], [3.1, 1], [3.8, 0.6], [4.4, 0]]);
  keys(light('dusk'), [[3.4, 0], [4.5, 1]]);
  keys(light('glow-warm'), [[0, 1], [1.3, 0.45], [2.3, 0.45], [3.1, 1], [4.2, 0]]);
  keys(light('glow-dusk'), [[3.5, 0], [4.6, 1]]);

  // The scroll cue fades as soon as the clock starts moving.
  if (cue) tl.fromTo(cue, { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0.02);

  // How far an outgoing window lifts as it falls back: less in the stacked tablet layout, where the
  // copy sits just above the window (re-read on every refresh, so a resize across 1024px is handled).
  const lift = () => (window.matchMedia('(min-width: 1024px)').matches ? -30 : -14);

  scenes.forEach((scene, k) => {
    const copy = copies[k];
    // Hand-off into this moment (k >= 1), ending when it is fully on screen at k.
    if (k > 0) {
      const tIn = k - HAND;
      const prev = scenes[k - 1];
      const prevCopy = copies[k - 1];
      const scrim = $(prev, '[data-ds-scrim]');
      // Depth: the old window falls back first (shrinks, lifts a little and darkens), then the next one
      // slides up over it, opaque almost at once, so the two never show through each other. The old one
      // peeks out above the new one until it has gone dark, then leaves.
      tl.fromTo(prev, { y: 0, scale: 1 }, { y: lift, scale: 0.9, duration: HAND, ease: 'power2.inOut', immediateRender: false }, tIn);
      if (scrim) tl.fromTo(scrim, { opacity: 0 }, { opacity: 0.6, duration: HAND * 0.6, ease: 'power1.out', immediateRender: false }, tIn);
      tl.fromTo(prev, { autoAlpha: 1 }, { autoAlpha: 0, duration: HAND * 0.25, ease: 'power1.in', immediateRender: false }, tIn + HAND * 0.75);
      const tUp = tIn + HAND * 0.12;
      tl.fromTo(scene, { y: 180, scale: 0.98 }, { y: 0, scale: 1, duration: HAND * 0.88, ease: 'power3.out' }, tUp);
      tl.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: HAND * 0.1 }, tUp);
      // Copy: the old moment lifts out, then the next rises in with its headline words (never both).
      if (prevCopy) {
        tl.fromTo(prevCopy, { y: -14 }, { y: -40, duration: HAND * 0.4, ease: 'power1.in', immediateRender: false }, tIn);
        tl.fromTo(prevCopy, { opacity: 1 }, { opacity: 0, duration: HAND * 0.34, ease: 'power1.out', immediateRender: false }, tIn);
      }
      if (copy) tl.fromTo(copy, { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: HAND * 0.58, ease: 'power2.out' }, tIn + HAND * 0.42);
      const words = (splits[k]?.words ?? []) as HTMLElement[];
      if (words.length) tl.fromTo(words, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: HAND * 0.4, stagger: HAND * 0.16 / words.length, ease: 'power2.out' }, tIn + HAND * 0.44);
    }
    // Between hand-offs the copy drifts up a little, so the text moves with the scroll too.
    if (copy) tl.fromTo(copy, { y: 0 }, { y: -14, duration: k < last ? DWELL : 1, immediateRender: k === 0 }, k);
    // The window's work builds once it has landed.
    const build = builds[scene.dataset.dsScene ?? '']?.(scene, ctx);
    if (build) {
      build.timeScale(1 / BUILD_LEN);
      tl.add(build, k + BUILD_AT);
    }
  });

  // Entrance: as the stage scrolls up to the pin, the window rises and settles (the copy a little less)
  // and the morning light comes up. The first window's work waits for the pin, where nothing else moves.
  const win = $(root, '[data-ds-win]');
  const narr = $(root, '[data-ds-narr]');
  const intro = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: pinEl, start: 'top bottom', end: 'top top', scrub: SCRUB, invalidateOnRefresh: true },
  });
  if (win) intro.fromTo(win, { y: 72, scale: 0.955 }, { y: 0, scale: 1, duration: 1 }, 0);
  if (narr) intro.fromTo(narr, { y: 40 }, { y: 0, duration: 1 }, 0);
  // The section head gives way just before the pin, so no sliver of it shows under the header.
  const sectionHead = $(root, '.ds-intro');
  if (sectionHead) intro.fromTo(sectionHead, { opacity: 1 }, { opacity: 0, duration: 0.1, immediateRender: false }, 0.9);
  const sky = $(root, '[data-ds-skywrap]');
  const glow = $(root, '[data-ds-glowwrap]');
  if (sky) intro.fromTo(sky, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.2);
  if (glow) intro.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.2);

  ScrollTrigger.sort();
  ScrollTrigger.addEventListener('refresh', syncAll);

  // Keep the pin honest if content above changes height (fonts, other sections' scripts).
  let lastH = document.body.scrollHeight;
  let t: number | undefined;
  const ro = new ResizeObserver(() => {
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastH) > 1) { lastH = h; ScrollTrigger.refresh(); }
    }, 200);
  });
  ro.observe(document.body);

  return () => {
    ScrollTrigger.removeEventListener('refresh', syncAll);
    ro.disconnect();
    window.clearTimeout(t);
    root.classList.remove('is-pinned');
    restoreText();
  };
}

function buildReveals(root: HTMLElement, scope: gsap.Context) {
  const restoreText = snapshotText(root);
  const day = root.dataset.dsDay || 'Mon';
  // Copy rises in, its headline word by word; each window rises and settles.
  $$(root, '[data-ds-copy]').forEach((copy) => {
    const line = $(copy, '[data-ds-line]');
    const split = line ? SplitText.create(line, { type: 'words', tag: 'span', wordsClass: 'ds-word' }) : null;
    const tl = gsap.timeline({ scrollTrigger: { trigger: copy, start: 'top 88%', once: true } });
    tl.fromTo(copy, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0);
    const words = (split?.words ?? []) as HTMLElement[];
    if (words.length) tl.fromTo(words, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out' }, 0.1);
  });
  // Each window's work, and its clock, build with the scroll while it passes through the screen.
  // The work timeline is only built once its window is about a screen below the fold (the window is
  // still hidden by its reveal then): building all five at load, and re-rendering them on every
  // refresh, cost a phone about half a second of main thread during page load.
  $$(root, '[data-ds-scene]').forEach((scene) => {
    gsap.fromTo(scene, { opacity: 0, y: 32, scale: 0.97 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: scene, start: 'top 92%', once: true },
    });
    ScrollTrigger.create({ trigger: scene, start: 'top bottom+=100%', once: true, onEnter: () => scope.add(() => buildWork(scene)) });
  });
  function buildWork(scene: HTMLElement) {
    const ctx: Ctx = { syncs: [], mode: 'flow' };
    const work = gsap.timeline({ defaults: { ease: 'none' } });
    const build = builds[scene.dataset.dsScene ?? '']?.(scene, ctx);
    if (build) work.add(build, 0);
    const clockEl = $(scene, '[data-ds-clock]');
    const m = Number(scene.dataset.dsMinutes);
    const tick = Number(scene.dataset.dsTick) || 0;
    if (clockEl && tick) {
      const c = { m };
      const write = () => { const t = clockText(c.m, day); if (clockEl.textContent !== t) clockEl.textContent = t; };
      ctx.syncs.push(write);
      work.fromTo(c, { m }, { m: m + tick, duration: 1, onUpdate: write, immediateRender: false }, 0);
    }
    const syncAll = () => ctx.syncs.forEach((f) => f());
    work.eventCallback('onUpdate', syncAll);
    ScrollTrigger.create({
      trigger: scene,
      start: 'top 82%',
      end: 'bottom 92%',
      scrub: 0.5,
      animation: work,
      invalidateOnRefresh: true,
      onRefresh: syncAll,
    });
  }
  return () => restoreText();
}

export function initDayStory(root: HTMLElement) {
  if (root.dataset.dsReady) return;
  root.dataset.dsReady = '1';
  const mm = gsap.matchMedia();
  mm.add({ pin: PIN_QUERY, motion: MOTION_QUERY }, (ctx) => {
    const { pin, motion } = ctx.conditions as { pin: boolean; motion: boolean };
    if (pin) return buildPinned(root);
    if (motion) return buildReveals(root, ctx);
    return undefined;
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
