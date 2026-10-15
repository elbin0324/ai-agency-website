// Site-wide motion system (MOTION.md). OWNER: motion.
//
// Opt-in and attribute-driven: put data-motion="<effect>" on an element. Several effects can share
// one attribute, space-separated (data-motion="tilt-in spotlight"). Attribute API (keep stable):
//   split      headings: words rise out of a mask on entry (once)       data-delay (s) · data-start
//   tilt-in    Apple-style product reveal: starts reclined in 3D, flattens as it scrolls in (scrubbed)
//                                                                       data-tilt (deg, 18) · data-start · data-end
//   parallax   decorative depth (scrubbed)                              data-speed (0.12; negative comes forward)
//   draw       SVG strokes draw with scroll progress (scrubbed)        data-draw-target · data-start · data-end
//   count      counts up once to the number already in the text        data-count-from · data-duration · data-delay · data-start
//              (serif Fraunces figures have no tabular digits: they fade up on entry instead)
//   stagger    children cascade in (once)                               data-stagger-target · data-delay · data-start
//   spotlight  soft cursor-following light on cards (fine pointers only)
//   magnetic   CTAs drift slightly toward the cursor (fine pointers)    data-strength (0.3)
// plus an ink scroll-progress hairline under the header (body class "m-no-progress" turns it off).
// data-start / data-end take ScrollTrigger positions ("top 80%"); they are measured from layout, so
// a parent mid-animation (a tilt-in window, a parallax plate) never shifts them.
//
// Everything runs inside gsap.matchMedia('(prefers-reduced-motion: no-preference)'): with reduced
// motion, and without JS, nothing is split, hidden or moved, so the page shows its final state.
// Only transforms and opacity animate; there is no scroll hijacking and no smooth-scroll library.
// data-motion wins over data-reveal (motion.css: the same element loses its reveal, a reveal wrapper
// around split / tilt-in / stagger keeps only its fade). Nothing inside a [data-demo] is touched.
//
// BaseLayout imports this module once and it initialises the whole document. After injecting
// markup, call initMotion(container) to pick up the new elements; it returns a cleanup function.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.config({ nullTargetWarn: false });

export type MotionEffect = 'split' | 'tilt-in' | 'parallax' | 'draw' | 'count' | 'stagger' | 'spotlight' | 'magnetic';
type Cleanup = () => void;
type Target = HTMLElement | SVGElement;

const MOTION_OK = '(prefers-reduced-motion: no-preference)';
const FINE_POINTER = `${MOTION_OK} and (hover: hover) and (pointer: fine)`;
const READY = 'data-motion-ready'; // lifts the pre-JS visibility gate in motion.css
const FAILSAFE_MS = 2400; // motion.css reveals gated elements after 2.5s if this script never runs
const SHAPES = 'path, line, polyline, polygon, circle, ellipse, rect';
const INTERACTIVE = 'a, button, input, select, textarea, [tabindex]';
const MAX_SPLIT_WORDS = 24;
const LIGHT_CTX = '.ctx-light, .aw-doc, .result-card, .calc-sheet__in, .insight-card';
const DARK_CTX = '.ctx-dark, .band-navy, .app-window, .site-footer';

// ---------- helpers

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function attrNum(el: Element, name: string, fallback: number, min = -Infinity, max = Infinity): number {
  const v = parseFloat(el.getAttribute(name) ?? '');
  return Number.isFinite(v) ? clamp(v, min, max) : fallback;
}

const vh = () => window.innerHeight;

/**
 * Document top from layout, ignoring transforms: the element's own (a scrubbed parallax) and its
 * ancestors' (a count inside a tilt-in window, a drawn line inside a parallax plate). Trigger
 * positions built on this never drift while something above them is mid-animation.
 */
function pageTop(el: Element): number {
  if (el instanceof HTMLElement) {
    let y = 0;
    for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
    return y;
  }
  // SVG has no offsetTop: measure the outer <svg> against its HTML parent (both carry the
  // parent's transform, so the difference is layout), then drop the svg's own animated y.
  const svg = el instanceof SVGSVGElement ? el : ((el as SVGElement).ownerSVGElement ?? el);
  const own = Number(gsap.getProperty(svg, 'y')) || 0;
  const parent = svg.parentElement;
  if (parent instanceof HTMLElement) {
    return pageTop(parent) + svg.getBoundingClientRect().top - parent.getBoundingClientRect().top - own;
  }
  return svg.getBoundingClientRect().top + window.scrollY - own;
}

function boxHeight(el: Element): number {
  return el instanceof HTMLElement ? el.offsetHeight : el.getBoundingClientRect().height;
}

function edgeOffset(token: string, size: number): number | null {
  if (token === 'top') return 0;
  if (token === 'center') return size / 2;
  if (token === 'bottom') return size;
  const m = /^(-?\d*\.?\d+)(%|px)?$/.exec(token);
  if (!m) return null;
  const v = parseFloat(m[1]);
  return m[2] === '%' ? (v / 100) * size : v;
}

type Position = string | ((self: ScrollTrigger) => number);

/**
 * A ScrollTrigger position such as "top 85%" ("<element edge> <viewport line>"), computed from
 * layout with pageTop() instead of getBoundingClientRect(). Without `el` it measures the
 * ScrollTrigger's own trigger (one function for a whole batch). Any other syntax ("+=300",
 * "top bottom-=100px") passes through to ScrollTrigger unchanged.
 */
function at(spec: string, el?: Element): Position {
  const [edge, line, extra] = spec.trim().split(/\s+/);
  if (!edge || !line || extra || edgeOffset(edge, 1) === null || edgeOffset(line, 1) === null) return spec;
  return (self: ScrollTrigger) => {
    const t = el ?? (self.trigger as Element);
    return pageTop(t) + (edgeOffset(edge, boxHeight(t)) ?? 0) - (edgeOffset(line, vh()) ?? 0);
  };
}

function inView(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < vh();
}

const markReady = (el: Element) => el.setAttribute(READY, '');
const unmarkReady = (el: Element) => el.removeAttribute(READY);

/** Fonts settle before anything animates in, but never wait longer than 900ms. */
const fontsReady: Promise<unknown> = Promise.race([
  document.fonts?.ready ?? Promise.resolve(),
  new Promise((resolve) => setTimeout(resolve, 900)),
]);

/** Runs `fn` once fonts are ready, recorded in the matchMedia context so a revert also undoes it. */
function later(ctx: gsap.Context, fn: () => void): void {
  fontsReady.then(() => {
    if (!ctx.isReverted) ctx.add(fn);
  });
}

// Each element/effect pair is initialised once, even across several initMotion() calls.
const claimed = new WeakMap<Element, Set<string>>();
function claim(el: Element, effect: string): boolean {
  let set = claimed.get(el);
  if (!set) claimed.set(el, (set = new Set()));
  if (set.has(effect)) return false;
  set.add(effect);
  return true;
}
const release = (el: Element, effect: string) => claimed.get(el)?.delete(effect);

// Demos run their own engine (DEMO_ENGINE.md): nothing inside a [data-demo] root is touched.
// tilt-in, parallax and spotlight may sit on the root itself (the window as a whole).
const DEMO_ROOT = '[data-demo]';
const ON_DEMO_ROOT: ReadonlySet<MotionEffect> = new Set(['tilt-in', 'parallax', 'spotlight']);

function collect(root: ParentNode, effect: MotionEffect): Target[] {
  const sel = `[data-motion~="${effect}"]`;
  const list = Array.from(root.querySelectorAll<Target>(sel));
  if (root instanceof Element && root.matches(sel)) list.unshift(root as Target);
  return list.filter((el) => {
    const demo = el.closest(DEMO_ROOT);
    const ok = !demo || (demo === el && ON_DEMO_ROOT.has(effect));
    if (!ok && import.meta.env.DEV) console.warn(`[motion] data-motion="${effect}" ignored inside a demo:`, el);
    return ok;
  });
}

// ---------- split: headings rise word by word out of a mask

// Restraint (MOTION.md §4.1): the word-by-word rise is a headline moment, so it plays on at most a few
// lines per page: the page H1, the closing CTA headline (navy CTA band) and display lines that opt in with
// data-split="feature" (a Statement line). Every other data-motion="split" heading, which is most section
// H2s, gets the quiet section-head fade instead (opacity only, 400ms, no rise), so the same rise doesn't
// replay every screen and a half. The attribute stays the same, so pages need no change.
const FEATURE_SPLIT = 'h1, .cta.band-navy, [data-split="feature"]';

function featureSplit(el: HTMLElement): boolean {
  return !!el.closest(FEATURE_SPLIT);
}

function split(el: HTMLElement, ctx: gsap.Context, late: boolean): Cleanup | void {
  if (late && inView(el)) return; // the failsafe already showed it: don't hide it again
  const delay = attrNum(el, 'data-delay', 0, 0, 3);
  let st: SplitText | null = null;
  gsap.set(el, { opacity: 0 }); // stays in the accessibility tree while it waits below the fold

  if (!featureSplit(el)) {
    ScrollTrigger.create({
      trigger: el,
      start: at(el.getAttribute('data-start') ?? 'top 88%', el),
      end: at('bottom top', el),
      once: true,
      onEnter: () =>
        later(ctx, () => {
          if (el.isConnected) gsap.to(el, { opacity: 1, duration: 0.4, delay, ease: 'power1.out', clearProps: 'opacity' });
        }),
    });
    return;
  }

  const play = () => {
    if (!el.isConnected) return;
    // Interactive content inside (a link in a heading) must stay readable, and split is for
    // headings and short display lines, not body copy: both get a plain rise instead.
    const long = (el.textContent ?? '').trim().split(/\s+/).length > MAX_SPLIT_WORDS;
    if (long && import.meta.env.DEV) console.warn(`[motion] split is for headings (≤ ${MAX_SPLIT_WORDS} words); plain rise used:`, el);
    if (long || el.querySelector(INTERACTIVE)) {
      gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, delay, ease: 'power3.out', clearProps: 'opacity,transform' });
      return;
    }
    const heading = /^H[1-6]$/.test(el.tagName) || el.getAttribute('role') === 'heading';
    const label = el.getAttribute('aria-label') ?? (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    st = SplitText.create(el, { type: 'words', tag: 'span', wordsClass: 'm-word', mask: 'words', aria: heading ? 'auto' : 'none' });
    if (heading) {
      el.setAttribute('aria-label', label); // SplitText's label keeps raw template whitespace
    } else {
      // aria-label is not reliable on generic elements: hide the pieces, keep one readable copy.
      st.masks.forEach((m) => m.setAttribute('aria-hidden', 'true'));
      const sr = document.createElement('span');
      sr.className = 'm-sr';
      sr.textContent = label;
      el.append(sr);
    }
    const words = st.words as HTMLElement[];
    const each = Math.min(0.06, 0.7 / Math.max(1, words.length));
    gsap.set(words, { yPercent: 135, opacity: 0 });
    gsap.set(el, { opacity: 1 });
    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        st?.revert(); // back to the original markup: plain text, original aria
        st = null;
        gsap.set(el, { clearProps: 'opacity' });
      },
    });
    words.forEach((w, i) => {
      // The brass italic phrase (DESIGN.md §2.3) lands a beat later and a touch slower.
      const em = w.parentElement?.closest('em, strong');
      const emphasis = !!em && el.contains(em);
      tl.to(w, { yPercent: 0, opacity: 1, duration: emphasis ? 1.25 : 1.05, ease: 'expo.out' }, i * each + (emphasis ? 0.14 : 0));
    });
  };

  ScrollTrigger.create({
    trigger: el,
    start: at(el.getAttribute('data-start') ?? 'top 88%', el),
    end: at('bottom top', el),
    once: true,
    onEnter: () => later(ctx, play),
  });
  return () => st?.revert();
}

// ---------- tilt-in: the product starts reclined in 3D and stands up as it scrolls into place

function tiltIn(el: HTMLElement): Cleanup | void {
  if (pageTop(el) < vh() * 0.9) return; // above the fold it simply renders flat
  const tilt = attrNum(el, 'data-tilt', 18, 0, 40);
  const prevTransition = el.style.transition;
  el.style.transition = 'none'; // CSS transitions on transform would lag behind the scrub
  const custom = { start: el.getAttribute('data-start'), end: el.getAttribute('data-end') };
  gsap.fromTo(
    el,
    { rotationX: tilt, scale: 0.92, y: 56, transformPerspective: 1400, transformOrigin: '50% 100%' },
    {
      rotationX: 0,
      scale: 1,
      y: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: custom.start ? at(custom.start, el) : () => pageTop(el) - vh() * 0.96,
        end: custom.end ? at(custom.end, el) : () => pageTop(el) - vh() * 0.38,
        scrub: 0.6,
      },
    },
  );
  return () => {
    el.style.transition = prevTransition;
  };
}

// ---------- parallax: decorative depth. data-speed 0.12 = 12% slower than the page (recedes);
// negative values move faster (come forward). Elements in the first viewport start at rest.

function parallax(el: Target): Cleanup | void {
  const speed = attrNum(el, 'data-speed', 0.12, -0.5, 0.5);
  if (!speed) return;
  const CAP = 96; // px of drift either way: depth, not travel
  const atTop = () => pageTop(el) < vh();
  const reach = () => clamp((speed * (vh() + boxHeight(el))) / 2, -CAP, CAP);
  const prevTransition = el.style.transition;
  el.style.transition = 'none';
  gsap.fromTo(
    el,
    { y: () => (atTop() ? 0 : -reach()) },
    {
      y: () => (atTop() ? clamp(speed * (pageTop(el) + boxHeight(el)), -CAP, CAP) : reach()),
      ease: 'none',
      scrollTrigger: {
        start: () => (atTop() ? 0 : pageTop(el) - vh()),
        end: () => pageTop(el) + boxHeight(el),
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    },
  );
  return () => {
    el.style.transition = prevTransition;
  };
}

// ---------- draw: SVG strokes draw with scroll progress (the rising halyard line)

function strokeLength(s: SVGGeometryElement): number {
  let len = 0;
  try {
    if (s instanceof SVGLineElement) {
      const b = s.getBBox(); // resolves percentage coordinates (x2="100%"), unlike the attributes
      len = Math.hypot(b.width, b.height);
    } else {
      len = s.getTotalLength();
    }
    if (getComputedStyle(s).vectorEffect === 'non-scaling-stroke') {
      const m = s.getScreenCTM();
      if (m) len *= Math.hypot(m.a, m.b);
    }
  } catch {
    len = 0; // not rendered (display: none): measured again on the next refresh
  }
  return len > 0 ? Math.ceil(len) + 1 : 0;
}

function draw(el: Target): Cleanup | void {
  const sel = el.getAttribute('data-draw-target');
  const pool: Element[] = el.matches(SHAPES) ? [el] : Array.from(el.querySelectorAll(sel || SHAPES));
  const shapes = pool.filter(
    (s): s is SVGGeometryElement => s instanceof SVGGeometryElement && getComputedStyle(s).stroke !== 'none',
  );
  if (!shapes.length) return;
  const trigger = el instanceof SVGElement && !(el instanceof SVGSVGElement) && el.ownerSVGElement ? el.ownerSVGElement : el;
  const start = el.getAttribute('data-start');
  if (!start && pageTop(trigger) < vh() * 0.85) return; // already in view on load: stays drawn
  // Dash longer than the stroke and a gap longer still, so nothing (not even a round cap) shows at 0.
  const dash = (s: SVGGeometryElement) => {
    const len = strokeLength(s);
    return len ? `${len} ${len + 2}` : 'none';
  };
  gsap.fromTo(
    shapes,
    { strokeDasharray: (_i: number, s: SVGGeometryElement) => dash(s), strokeDashoffset: (_i: number, s: SVGGeometryElement) => strokeLength(s) + 1 },
    {
      strokeDasharray: (_i: number, s: SVGGeometryElement) => dash(s),
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: at(start ?? 'top 85%', trigger),
        end: at(el.getAttribute('data-end') ?? 'bottom 40%', trigger),
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    },
  );
}

// ---------- count: counts up once to the number already in the text, keeping its formatting.
// Serif figures fade up instead: Fraunces has no tabular digits (with tabular-nums on, "1111" is
// still far narrower than "0000"), so no reserved width holds a ticking serif number still and its
// unit would drift sideways. Geist figures (KPI tiles) have true tabular digits and keep the count.

const NUMBER = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/;

function formatLike(v: number, decimals: number, grouped: boolean): string {
  const s = v.toFixed(decimals);
  if (!grouped) return s;
  const [int, frac] = s.split('.');
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (frac ? `.${frac}` : '');
}

function count(el: HTMLElement, ctx: gsap.Context, late: boolean): Cleanup | void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (/\d/.test(n.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });
  const node = walker.nextNode() as Text | null;
  if (!node || (late && inView(el))) return;
  const text = node.nodeValue ?? '';
  const match = text.match(NUMBER);
  if (!match || match.index === undefined) return;
  const raw = match[0];
  const index = match.index;
  const target = parseFloat(raw.replace(/,/g, ''));
  const decimals = (raw.split('.')[1] ?? '').length;
  const grouped = raw.includes(',');
  const from = attrNum(el, 'data-count-from', 0);
  const duration = attrNum(el, 'data-duration', 1.4, 0.2, 4);
  const delay = attrNum(el, 'data-delay', 0, 0, 3);
  const serif = getComputedStyle(node.parentElement ?? el).fontFamily.includes('Fraunces');
  let restore: Cleanup | null = null;
  gsap.set(el, { opacity: 0 }); // the real number stays in the DOM until the count starts

  // Serif figures: no tween and no wrapper, the final figure simply fades up on entry.
  const fade = () => {
    if (!el.isConnected) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 10, transition: 'none' },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power2.out', clearProps: 'opacity,transform,transition' },
    );
  };

  const run = () => {
    if (!node.isConnected) return;
    // One inline wrapper replaces the one text node, so flex/grid parents see the same item.
    const wrap = document.createElement('span');
    const box = document.createElement('span');
    const sr = document.createElement('span');
    box.className = 'm-count';
    box.setAttribute('aria-hidden', 'true');
    box.textContent = raw;
    sr.className = 'm-sr';
    sr.textContent = raw; // screen readers only ever hear the real value
    wrap.append(text.slice(0, index), box, sr, text.slice(index + raw.length));
    node.replaceWith(wrap);
    box.style.minWidth = `${box.getBoundingClientRect().width}px`; // reserve the final width: no jiggle
    restore = () => {
      wrap.replaceWith(node);
      restore = null;
    };
    const state = { v: from };
    box.textContent = formatLike(from, decimals, grouped);
    gsap
      .timeline({
        delay,
        onComplete: () => {
          restore?.();
          gsap.set(el, { clearProps: 'opacity,transition' });
        },
      })
      .set(el, { transition: 'none' })
      .to(el, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
      .to(state, { v: target, duration, ease: 'power3.out', onUpdate: () => (box.textContent = formatLike(state.v, decimals, grouped)) }, 0);
  };

  ScrollTrigger.create({
    trigger: el,
    start: at(el.getAttribute('data-start') ?? 'top 90%', el),
    end: at('bottom top', el),
    once: true,
    onEnter: () => later(ctx, serif ? fade : run),
  });
  return () => restore?.();
}

// ---------- stagger: children cascade in (80ms steps, at most ~0.4s of spread; DESIGN.md §9.2)

function stagger(el: HTMLElement, ctx: gsap.Context, late: boolean): Cleanup | void {
  const sel = el.getAttribute('data-stagger-target');
  const items = (sel ? Array.from(el.querySelectorAll<HTMLElement>(sel)) : (Array.from(el.children) as HTMLElement[])).filter(
    (c) => !/^(SCRIPT|STYLE|TEMPLATE)$/.test(c.tagName),
  );
  if (!items.length || (late && inView(el))) return;
  const delay = attrNum(el, 'data-delay', 0, 0, 3);
  gsap.set(items, { opacity: 0, y: 28, transition: 'none' });
  ScrollTrigger.batch(items, {
    start: at(el.getAttribute('data-start') ?? 'top 92%'),
    end: at('bottom top'),
    once: true,
    onEnter: (batch) =>
      ctx.isReverted ||
      ctx.add(() =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          stagger: Math.min(0.08, 0.4 / batch.length),
          overwrite: true,
          clearProps: 'opacity,transform,transition',
        }),
      ),
  });
}

// ---------- spotlight: a soft light follows the cursor across a card, with a brass edge glint

function surfaceOf(el: Element): 'light' | 'dark' {
  const dark = el.closest(DARK_CTX);
  const light = el.closest(LIGHT_CTX);
  if (!dark) return 'light';
  if (!light) return 'dark';
  return dark.contains(light) ? 'light' : 'dark'; // the nearer context wins
}

function spotlight(el: HTMLElement): Cleanup {
  const spot = document.createElement('span');
  spot.className = 'm-spot';
  spot.setAttribute('aria-hidden', 'true');
  spot.dataset.surface = surfaceOf(el);
  const saved = { position: el.style.position, isolation: el.style.isolation };
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.style.isolation = 'isolate'; // keeps the light above the card fill but under its content
  el.prepend(spot);

  let raf = 0;
  let x = 0;
  let y = 0;
  const paint = () => {
    raf = 0;
    const r = el.getBoundingClientRect();
    spot.style.setProperty('--mx', `${(x - r.left).toFixed(1)}px`);
    spot.style.setProperty('--my', `${(y - r.top).toFixed(1)}px`);
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    x = e.clientX;
    y = e.clientY;
    raf ||= requestAnimationFrame(paint);
  };
  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    onMove(e);
    spot.classList.add('is-on');
  };
  const onLeave = () => spot.classList.remove('is-on');
  el.addEventListener('pointerenter', onEnter);
  el.addEventListener('pointermove', onMove, { passive: true });
  el.addEventListener('pointerleave', onLeave);
  return () => {
    cancelAnimationFrame(raf);
    el.removeEventListener('pointerenter', onEnter);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    spot.remove();
    el.style.position = saved.position;
    el.style.isolation = saved.isolation;
  };
}

// ---------- magnetic: CTAs lean a few pixels toward the cursor. It moves the CSS `translate`
// property, so it composes with the buttons' own hover transforms instead of fighting them.

function magnetic(el: HTMLElement): Cleanup {
  const strength = attrNum(el, 'data-strength', 0.3, 0, 1);
  const MAX = 6;
  const state = { x: 0, y: 0 };
  const saved = el.style.translate;
  const apply = () => {
    el.style.translate = `${state.x.toFixed(2)}px ${state.y.toFixed(2)}px`;
  };
  const xTo = gsap.quickTo(state, 'x', { duration: 0.5, ease: 'power3.out', onUpdate: apply });
  const yTo = gsap.quickTo(state, 'y', { duration: 0.5, ease: 'power3.out', onUpdate: apply });
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    const cx = r.left - state.x + r.width / 2; // the untranslated centre
    const cy = r.top - state.y + r.height / 2;
    xTo(clamp((e.clientX - cx) * strength, -MAX, MAX));
    yTo(clamp((e.clientY - cy) * strength, -MAX, MAX));
  };
  const onLeave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener('pointermove', onMove, { passive: true });
  el.addEventListener('pointerleave', onLeave);
  return () => {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    gsap.killTweensOf(state);
    el.style.translate = saved;
  };
}

// ---------- scroll-progress hairline: 2px of ink (rule-strong), along the bottom edge of the sticky header

function progressHairline(): Cleanup | void {
  if (document.body.classList.contains('m-no-progress')) return;
  const header = document.querySelector<HTMLElement>('[data-site-header], .site-header');
  const bar = document.createElement('div');
  bar.className = header ? 'm-progress' : 'm-progress m-progress--fixed';
  bar.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('span');
  bar.append(fill);
  (header ?? document.body).append(bar);
  if (CSS.supports?.('animation-timeline: scroll()')) {
    bar.classList.add('m-progress--css'); // runs on the compositor: no JS per frame
  } else {
    gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }
  // Short pages get no bar.
  const fit = () => bar.classList.toggle('is-off', ScrollTrigger.maxScroll(window) < vh() * 0.75);
  ScrollTrigger.addEventListener('refresh', fit);
  fit();
  return () => {
    ScrollTrigger.removeEventListener('refresh', fit);
    bar.remove();
  };
}

// ---------- wiring

let booted = false;

/**
 * Initialise every [data-motion] element under `root` (default: the whole document) that has not
 * been initialised yet. Returns a cleanup function that reverts everything it set up.
 */
export function initMotion(root: ParentNode = document): Cleanup {
  // If this script arrived after the CSS failsafe already revealed things, leave in-view content alone.
  const late = root === document && !booted && performance.now() > FAILSAFE_MS;
  const isDocument = root === document && !booted;
  booted = true;
  const mm = gsap.matchMedia();

  // Each element is set up lazily, once it comes within about a viewport of entering, so the
  // load-time work (word splitting, trigger measurement) covers only what is near the screen.
  // Setup runs inside the matchMedia context, so a revert still undoes everything it created.
  const run = <T extends Target>(effect: MotionEffect, fn: (el: T) => Cleanup | void, sink: Cleanup[], ctx: gsap.Context) => {
    const setup = (el: Target) => {
      let undo: Cleanup | void;
      try {
        undo = fn(el as T);
      } catch {
        gsap.set(el, { clearProps: 'opacity,transform' }); // never leave content hidden
      } finally {
        markReady(el);
      }
      sink.push(() => {
        undo?.();
        release(el, effect);
        unmarkReady(el);
      });
    };
    const targets = collect(root, effect).filter((el) => claim(el, effect));
    if (!targets.length) return;
    if (typeof IntersectionObserver !== 'function') {
      targets.forEach(setup);
      return;
    }
    // Lift the pre-JS gate now: elements far below are offscreen anyway, and leaving them gated
    // would make the CSS failsafe reveal dozens of them at once mid-load.
    targets.forEach(markReady);
    const pending = new Set<Element>(targets);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || !pending.delete(entry.target)) continue;
          io.unobserve(entry.target);
          ctx.add(() => setup(entry.target as Target));
        }
      },
      { rootMargin: '100% 0px 100% 0px' },
    );
    targets.forEach((el) => io.observe(el));
    sink.push(() => {
      io.disconnect();
      pending.forEach((el) => release(el, effect)); // never set up: free them for a later init
    });
  };

  mm.add(MOTION_OK, (ctx) => {
    const undo: Cleanup[] = [];
    run<HTMLElement>('split', (el) => split(el, ctx, late), undo, ctx);
    run<HTMLElement>('count', (el) => count(el, ctx, late), undo, ctx);
    run<HTMLElement>('stagger', (el) => stagger(el, ctx, late), undo, ctx);
    run<HTMLElement>('tilt-in', tiltIn, undo, ctx);
    run<Target>('parallax', parallax, undo, ctx);
    run<Target>('draw', draw, undo, ctx);
    if (isDocument) {
      const off = progressHairline();
      if (off) undo.push(off);
    }
    return () => undo.reverse().forEach((fn) => fn());
  });

  mm.add(FINE_POINTER, (ctx) => {
    const undo: Cleanup[] = [];
    run<HTMLElement>('spotlight', spotlight, undo, ctx);
    run<HTMLElement>('magnetic', magnetic, undo, ctx);
    return () => undo.reverse().forEach((fn) => fn());
  });

  return () => mm.revert();
}

/** Recalculate every trigger position (after layout changes the observers below can't see). */
export function refreshMotion(): void {
  ScrollTrigger.refresh();
}

// Trigger positions depend on layout: refresh once fonts settle and whenever the page height
// changes (late images, accordions, injected demos). Window resizes are handled by ScrollTrigger.
// A refresh cancels any smooth scroll in progress (an in-page anchor jump), and split headings
// change the page height as they reveal mid-scroll. So refreshes wait until scrolling settles,
// and height changes under 2px are ignored.
let queued = 0;
let lastScroll = 0;
let lastHeight = document.body.offsetHeight;
window.addEventListener('scroll', () => (lastScroll = performance.now()), { passive: true });
const queueRefresh = () => {
  clearTimeout(queued);
  const run = () => {
    if (performance.now() - lastScroll < 200) {
      queued = window.setTimeout(run, 200);
      return;
    }
    refreshMotion();
  };
  queued = window.setTimeout(run, 200);
};
document.fonts?.ready.then(queueRefresh);
const heightWatch =
  typeof ResizeObserver === 'function'
    ? new ResizeObserver(() => {
        const height = document.body.offsetHeight;
        if (Math.abs(height - lastHeight) < 2) return;
        lastHeight = height;
        queueRefresh();
      })
    : null;
heightWatch?.observe(document.body);

const stop = initMotion();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    stop();
    heightWatch?.disconnect();
    clearTimeout(queued);
  });
}
