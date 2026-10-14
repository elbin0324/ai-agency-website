// Scroll motion for the day story. OWNER: home-daystory. Self-contained on purpose: it does not use
// the shared motion system, only GSAP (ScrollTrigger + SplitText).
//
// - Pinned (PIN_QUERY): the stage pins for about 4.8 screen heights and one scrubbed timeline plays the
//   five moments. Each hand-off: the old window content lifts out, the windows swap under it (their frames
//   are identical, so the frame never dips and only the crumb changes), the new content settles, the copy
//   crossfades word by word and the clock fast-forwards. Each window's work then plays in the first third
//   of its moment and the finished state holds for the rest, so wherever the reader stops, the view is
//   complete. The first window works while the stage scrolls up to the pin. Transforms and opacity only
//   (plus the clock's text); no scroll hijacking.
// - Motion allowed but no pin (phones, short screens): the static sequence with simple reveals, and
//   each window plays its work once when it comes into view.
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

/** Timeline units per moment (about one screen of scroll each). */
const U = 2.4;
/** The hand-off between two moments, ending when the next moment is fully on screen. */
const TR = 0.32;
/** The old content is gone and the windows swap this far into the hand-off. */
const SWAP = 0.14;
/** Each window's work is compressed to this many units; the rest of the moment (about 60%) holds. */
const WORK = 0.7;
const SCROLL_SCREENS = 4.8;

const $$ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel));

type Sync = () => void;

/** Count a number up from zero into its element (text only; the tile has a fixed width). */
function countUp(el: HTMLElement, duration: number, syncs: Sync[]): gsap.core.Tween {
  const raw = el.dataset.dsCount ?? el.textContent ?? '0';
  const to = parseFloat(raw);
  const dec = (raw.split('.')[1] ?? '').length;
  const o = { v: 0 };
  const write = () => { const t = o.v.toFixed(dec); if (el.textContent !== t) el.textContent = t; };
  write();
  syncs.push(write);
  return gsap.fromTo(o, { v: 0 }, { v: to, duration, ease: 'power1.out', onUpdate: write });
}

/** The work inside each window, about 1.2 units long. Built paused; the caller places or plays it. */
const sceneWork: Record<string, (s: HTMLElement, syncs: Sync[]) => gsap.core.Timeline> = {
  inbox(s, syncs) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.fromTo($$(s, '[data-ds="mailchip"]'), { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.2, stagger: 0.15, ease: 'power2.out' }, 0.05);
    $$(s, '[data-ds-count]').forEach((el) => tl.add(countUp(el, 1.0, syncs), 0.05));
    tl.fromTo(s.querySelector('[data-ds="sorting"]'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.08 }, 1.05);
    tl.fromTo(s.querySelector('[data-ds="sorted"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 1.05);
    return tl;
  },
  chat(s) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.fromTo($$(s, '[data-ds="msg"]'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.16, stagger: 0.17, ease: 'power2.out' }, 0);
    tl.fromTo($$(s, '[data-ds="act"]'), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.14, stagger: 0.19, ease: 'power2.out' }, 0.12);
    tl.fromTo(s.querySelector('[data-ds="booked"]'), { opacity: 0, y: 10, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'back.out(1.6)' }, 0.95);
    return tl;
  },
  margin(s) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.fromTo(s.querySelector('[data-ds="wipe"]'), { scaleX: 0.04, svgOrigin: '0 0' }, { scaleX: 1, svgOrigin: '0 0', duration: 0.95, ease: 'power1.inOut' }, 0);
    tl.fromTo(s.querySelector('[data-ds="band"]'), { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.45);
    tl.fromTo(s.querySelector('[data-ds="annot"]'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.55);
    tl.fromTo($$(s, '[data-ds="end"]'), { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.92);
    tl.fromTo(s.querySelector('[data-ds="insight"]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 1.0);
    return tl;
  },
  outreach(s) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.fromTo($$(s, '[data-ds="pro"]'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.18, stagger: 0.12, ease: 'power2.out' }, 0);
    tl.fromTo($$(s, '[data-ds="line"]'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.12, ease: 'power2.out' }, 0.3);
    tl.fromTo(s.querySelector('[data-ds="checks"]'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.85);
    tl.fromTo(s.querySelector('[data-ds="approve"]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }, 1.0);
    return tl;
  },
  summary(s, syncs) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    $$(s, '[data-ds-count]').forEach((el) => tl.add(countUp(el, 0.9, syncs), 0.05));
    tl.fromTo(s.querySelector('[data-ds="dayfill"]'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power1.inOut' }, 0.05);
    tl.fromTo($$(s, '[data-ds="mark"]'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.12, stagger: 0.22, ease: 'back.out(2)' }, 0.08);
    tl.fromTo($$(s, '[data-ds="log"]'), { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.16, stagger: 0.2, ease: 'power2.out' }, 0.12);
    tl.fromTo(s.querySelector('[data-ds="next"]'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 1.0);
    return tl;
  },
};

function buildPinned(root: HTMLElement) {
  const pinEl = root.querySelector<HTMLElement>('[data-ds-pin]')!;
  const copies = $$(root, '[data-ds-copy]');
  const scenes = $$(root, '[data-ds-scene]');
  const rail = $$(root, '[data-ds-rail]');
  const fill = root.querySelector<HTMLElement>('[data-ds-fill]');
  const clocks = $$(root, '[data-ds-clock]');
  const times = scenes.map((s) => [Number(s.dataset.dsMinutes), Number(s.dataset.dsTick)] as const);
  const day = root.dataset.dsDay || 'Mon';
  const last = scenes.length - 1;

  root.classList.add('is-pinned');

  // Text that follows the scroll (clock, counters) is re-written from its tween values on every render
  // and after each refresh: ScrollTrigger jumps the timeline with callbacks suppressed when it refreshes.
  const syncs: Sync[] = [];
  const syncAll = () => syncs.forEach((f) => f());
  const clock = { m: times[0][0] };
  const writeClock = () => {
    const t = clockText(clock.m, day);
    clocks.forEach((c) => { if (c.textContent !== t) c.textContent = t; });
  };
  syncs.push(writeClock);
  writeClock();

  // Headline words of the incoming moments rise into place (the first one is already on screen).
  const splits = copies.slice(1).map((c) => SplitText.create(c.querySelector('[data-ds-line]')!, { type: 'words', wordsClass: 'ds-word' }));

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: syncAll,
    scrollTrigger: {
      trigger: pinEl,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * SCROLL_SCREENS)}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  /** A window's work, compressed so its finished state holds for most of the moment. */
  const workFor = (scene: HTMLElement, units: number) => {
    const work = sceneWork[scene.dataset.dsScene ?? '']?.(scene, syncs);
    if (work && work.duration() > 0) work.timeScale(work.duration() / units);
    return work;
  };

  scenes.forEach((scene, k) => {
    const t0 = k * U; // the moment is fully on screen from here

    if (k > 0) {
      const tIn = t0 - TR;
      const tSwap = tIn + SWAP;
      const prev = scenes[k - 1];
      const prevStage = prev.querySelector<HTMLElement>('[data-ds-stage]');
      const stage = scene.querySelector<HTMLElement>('[data-ds-stage]');
      const view = scene.querySelector<HTMLElement>('[data-ds-view]');
      // Window: the old content lifts out; with the stage empty the windows swap (identical frames, so
      // nothing but the crumb changes), then the new content and its crumb settle into place.
      if (prevStage) tl.fromTo(prevStage, { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: SWAP, ease: 'power1.in', immediateRender: false }, tIn);
      tl.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001, immediateRender: false }, tSwap);
      tl.fromTo(prev, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.001, immediateRender: false }, tSwap + 0.002);
      if (stage) {
        tl.fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: 'power1.out' }, tSwap);
        tl.fromTo(stage, { y: 18 }, { y: 0, duration: 0.3, ease: 'power2.out' }, tSwap);
      }
      if (view) tl.fromTo(view, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, tSwap);
      // Copy: the old line is gone before the new one rises word by word.
      tl.fromTo(copies[k - 1], { opacity: 1, y: 0 }, { opacity: 0, y: -20, duration: 0.15, ease: 'power1.in', immediateRender: false }, tIn);
      tl.fromTo(copies[k], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.34, ease: 'power2.out' }, tIn + 0.12);
      const words = splits[k - 1]?.words ?? [];
      if (words.length) tl.fromTo(words, { opacity: 0, yPercent: 55 }, { opacity: 1, yPercent: 0, duration: 0.26, stagger: 0.025, ease: 'power2.out' }, tIn + 0.13);
      // Rail: the previous stop dims to "done", the next lights up.
      if (rail[k - 1]) tl.fromTo(rail[k - 1], { opacity: 1 }, { opacity: 0.7, duration: 0.24, immediateRender: false }, tIn);
      if (rail[k]) {
        tl.fromTo(rail[k], { opacity: 0.42 }, { opacity: 1, duration: 0.24, immediateRender: false }, tIn + 0.08);
        const dot = rail[k].querySelector('[data-ds-dot]');
        if (dot) tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.2, ease: 'back.out(2)', immediateRender: false }, tIn + 0.14);
      }
      // Clock: fast-forward to the next moment.
      const from = times[k - 1][0] + times[k - 1][1];
      tl.fromTo(clock, { m: from }, { m: times[k][0], duration: TR, ease: 'power1.inOut', onUpdate: writeClock, immediateRender: false }, tIn);
      // The work starts as the content lands, then the finished state holds until the next hand-off.
      const work = workFor(scene, WORK);
      if (work) tl.add(work, tSwap + 0.02);
    }

    // The clock keeps running through each moment (a few minutes of work).
    if (times[k][1]) tl.fromTo(clock, { m: times[k][0] }, { m: times[k][0] + times[k][1], duration: 1.4, onUpdate: writeClock, immediateRender: false }, t0 + 0.1);
  });

  if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: last * U, ease: 'none' }, 0);
  tl.set({}, {}, last * U + U - TR); // hold the summary as long as the others before the pin releases

  // Entrance: as the stage scrolls up to the pin, the window rises and settles (the copy a little less)
  // and the first window does its work, so the pin opens on a finished inbox.
  const win = root.querySelector('[data-ds-win]');
  const narr = root.querySelector('[data-ds-narr]');
  const intro = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: syncAll,
    scrollTrigger: { trigger: pinEl, start: 'top bottom', end: 'top top', scrub: 0.6, invalidateOnRefresh: true },
  });
  if (win) intro.fromTo(win, { y: 72, scale: 0.955 }, { y: 0, scale: 1, duration: 1 }, 0);
  if (narr) intro.fromTo(narr, { y: 40 }, { y: 0, duration: 1 }, 0);
  const first = scenes[0] ? workFor(scenes[0], 0.5) : undefined;
  if (first) intro.add(first, 0.42);

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
  };
}

function buildReveals(root: HTMLElement) {
  const blocks = $$(root, '[data-ds-copy], [data-ds-scene]');
  blocks.forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  // Each window plays its work once, in real time, when most of it is in view.
  $$(root, '[data-ds-scene]').forEach((scene) => {
    const work = sceneWork[scene.dataset.dsScene ?? '']?.(scene, []);
    if (!work) return;
    work.pause(0).timeScale(0.7);
    ScrollTrigger.create({ trigger: scene, start: 'top 70%', once: true, onEnter: () => work.play() });
  });
}

export function initDayStory(root: HTMLElement) {
  if (root.dataset.dsReady) return;
  root.dataset.dsReady = '1';
  const mm = gsap.matchMedia();
  mm.add({ pin: PIN_QUERY, motion: MOTION_QUERY }, (ctx) => {
    const { pin, motion } = ctx.conditions as { pin: boolean; motion: boolean };
    if (pin) return buildPinned(root);
    if (motion) buildReveals(root);
    return undefined;
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
