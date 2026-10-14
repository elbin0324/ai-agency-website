/**
 * Demo engine: drives every animated product demo so all six behave identically.
 * Contract: ARCHITECTURE.md "Demo engine contract". Player rules: content/DEMOS.md §0.
 * Chrome and motion: DESIGN.md §6.10, §6.12, §9.5, §9.6. Full guide + copy-paste template: DEMO_ENGINE.md.
 * Reference demo: src/components/demo/SampleDemo.astro + sample-demo.ts.
 *
 * AUTHORING MODEL
 *  1. Markup is the FINAL state. Build the panes inside <AppWindow> exactly as they look at the end.
 *     That is what visitors see without JavaScript and with reduced motion.
 *  2. Data attributes say how an element STARTS. The engine re-applies them on every reset:
 *       data-hide             display:none at the start      -> ctx.show / cascade / type / stream / countUp reveal it
 *       data-ghost            invisible but keeps its space  -> same
 *       data-type             text starts empty              -> ctx.type(el) types the final text
 *       data-stream[="grow"]  words start hidden             -> ctx.stream(el) / ctx.reply(el)
 *       data-count[="first"]  numbers start at data-count-from (0) -> ctx.countUp(el)
 *       data-draw             SVG stroke starts undrawn      -> ctx.draw(el)
 *       data-grow[="x"]       bar starts at scale 0          -> ctx.grow(els)
 *       data-check            status icon starts idle        -> ctx.check(el)
 *       data-initial-text     text starts as this value      -> ctx.swapText(el) brings back the final text
 *       data-initial-class    classes added at the start     -> ctx.removeClass(el, '...')
 *       data-final-class      classes removed at the start   -> ctx.highlight(el) / ctx.addClass(el)
 *       data-placeholder      shown at the start (render it with `hidden`) -> ctx.hide(el)
 *       data-final-only       hidden during playback, shown only in the static final state
 *       data-autoscroll       scroll box that follows new content to the bottom
 *       data-el="name"        handle for ctx.el('name') or the '@name' target shorthand
 *  3. Steps: defineDemo({ id, steps: [{ label, caption, duration, pane?, run(ctx) }] }).
 *     run() choreographs with ctx helpers; the engine holds every step to its `duration`
 *     (animation + reading hold), so the progress bar and timecode stay exact.
 *  4. In the demo component: <script> import { registerDemo } ...; registerDemo(demo); </script>
 *     registers the definition and mounts every [data-demo="<id>"] on the page (any number of instances).
 *     Markup added later (the home DemoTheater keeps its other demos in <template>s until their tab opens)
 *     mounts with mountDemos(container); a root added before its definition loads mounts when it registers.
 *
 * PLAYER (DEMOS.md §0.1, §0.2, §0.6, §0.7)
 *  - Autoplays once when >= 50% of the window is visible (relative to the viewport height for tall
 *    windows); pauses under 20% or when the tab is hidden and resumes in place; never loops; holds on
 *    the result card. Windows in hidden panels ([hidden], [inert], display:none) never autoplay.
 *  - Play/Pause/Resume/Replay, Skip to result, clickable chapters (reset, fast-forward steps 1..N-1 with
 *    ctx.instant, play step N), "Step n of N" caption in a polite live region, timecode, Space toggles.
 *  - prefers-reduced-motion: renders the final state at once with the result card below the panes;
 *    Play then steps through end states (Previous / Next) with no animation.
 *  - Programmatic control: dispatch 'demo:play' | 'demo:pause' | 'demo:reset' on the [data-demo] root.
 *    The root dispatches 'demo:ready' {id} once mounted, 'demo:step' {id, index, total, label, caption} and
 *    'demo:ended' {id} (all bubbling).
 *
 * Every ctx helper respects pause (virtual clock) and abort (a replay mid-step never leaks into the next
 * run: pending helpers simply never resolve, and the scene DOM is rebuilt from the final-state template).
 */

// ---------------------------------------------------------------------------------------------------------
// Public types

/** A CSS selector ('@name' = [data-el="name"]), an element, or a list of elements. */
export type Target = string | Element | null | undefined | Iterable<Element | null | undefined>;

export type Effect = 'fade' | 'rise' | 'scale' | 'opacity' | 'wipe' | 'none';

export interface ShowOptions {
  /** fade (default: 250 ms, 6 px rise) · rise (14 px) · scale (0.96 -> 1) · opacity · wipe (left to right) · none */
  effect?: Effect;
  duration?: number;
  /** ms between items when several elements are shown (cascade defaults to 90). */
  stagger?: number;
  delay?: number;
}
export interface HideOptions {
  effect?: Effect;
  duration?: number;
  /** Keep the element's space (visibility) instead of removing it from layout (display:none). */
  keepSpace?: boolean;
}
export interface TypeOptions {
  /** Text to type. Default: the element's own final text (from the markup). */
  text?: string;
  /** Copy the final text of another element (a chat bubble when typing into a composer). */
  from?: Target;
  /** ms per character (default 18, `fast` 12). Jitter keeps the total at length x speed. */
  speed?: number;
  fast?: boolean;
  /** Pause before the first character (default 300). */
  delay?: number;
  /** 0..1 rhythm variation (default 0.45). Deterministic per demo. */
  jitter?: number;
  /** Show a caret while typing (default true). */
  caret?: boolean;
  /** Leave a blinking caret after typing (default false). */
  keepCaret?: boolean;
}
export interface SendOptions extends TypeOptions {
  /** Pause between the last character and the send (default 250). */
  pause?: number;
}
export interface StreamOptions {
  /** ms per word (default 30). */
  speed?: number;
  delay?: number;
  /** true: the element grows as words arrive (chat). false: words fill reserved space (emails, docs).
   *  Default: data-stream="grow" on the element. */
  grow?: boolean;
  /** Show a caret after the last word while streaming. */
  caret?: boolean;
  /** Callbacks fired when the first word inside [data-cue="name"] appears. Returned promises are awaited
   *  before the step ends. */
  cues?: Record<string, () => unknown>;
}
export interface ReplyOptions extends StreamOptions {
  /** Typing-indicator time before the reply streams (default 600; 0 for none). */
  dots?: number;
}
export interface DotsOptions {
  /** Insert the indicator before this element (default: append to the target). */
  before?: Target;
  /** Classes for the indicator wrapper (default 'chat-msg chat-msg--agent'). */
  className?: string;
}
export interface CountOptions {
  /** Target number. Default: every number in the element's final text counts up (formats are kept:
   *  "$12,400", "18.5 h", "6.5 min vs 10 min"). data-count="first" counts only the first number. */
  to?: number;
  from?: number;
  /** Default 700 (DEMOS.md `count`). */
  duration?: number;
  /** Formatter for `to` mode, for example (n) => currency(n) from @/lib/format. */
  format?: (n: number) => string;
}
export interface DrawOptions { duration?: number; stagger?: number; easing?: string }
export interface GrowOptions { axis?: 'x' | 'y'; duration?: number; stagger?: number; easing?: string; origin?: string }
export interface ClickOptions { move?: number; press?: number }
export type ScrollTo = 'top' | 'bottom' | number | Target;

export interface DemoContext {
  /** True while fast-forwarding (step jumps, reduced motion): helpers apply end states with no waiting. */
  readonly instant: boolean;
  /** The [data-demo] root of this instance. */
  readonly root: HTMLElement;
  /** Index of the running step. */
  readonly step: number;
  $(selector: string): HTMLElement | null;
  $$(selector: string): HTMLElement[];
  el(name: string): HTMLElement | null;
  els(name: string): HTMLElement[];
  /** The final (markup) text of an element, even after reset emptied it. */
  text(target: Target): string;
  /** Seeded random number in [0, 1): identical on every replay. */
  random(): number;

  // Time (pausable, abortable)
  wait(ms: number): Promise<void>;
  /** Wait until `ms` after the step started (DEMOS.md "+800 ms" offsets). */
  until(ms: number): Promise<void>;
  /** Run fn at `ms` after the step started. The step waits for it before its reading hold. */
  at<T>(ms: number, fn: () => T | Promise<T>): Promise<T>;
  /** Run fn `ms` from now. Tracked like at(). */
  after<T>(ms: number, fn: () => T | Promise<T>): Promise<T>;
  all(...tasks: unknown[]): Promise<void>;
  tween(duration: number, update: (k: number) => void, easing?: (t: number) => number): Promise<void>;
  /** Pausable WAAPI wrapper. In instant mode, fill 'forwards'/'both' applies the last keyframe. */
  animate(target: Target, keyframes: Keyframe[], options?: number | KeyframeAnimationOptions): Promise<void>;

  // Appear and disappear (DESIGN.md §9.5)
  show(target: Target, opts?: ShowOptions): Promise<void>;
  cascade(target: Target, opts?: ShowOptions): Promise<void>;
  reveal(target: Target, opts?: ShowOptions): Promise<void>;
  hide(target: Target, opts?: HideOptions): Promise<void>;
  swap(from: Target, to: Target, opts?: { duration?: number }): Promise<void>;
  swapText(target: Target, text?: string, opts?: { duration?: number }): Promise<void>;
  setText(target: Target, text: string): void;
  addClass(target: Target, classes?: string): void;
  removeClass(target: Target, classes?: string): void;
  toggleClass(target: Target, classes: string, force?: boolean): void;

  // Text
  type(target: Target, text?: string | TypeOptions, opts?: TypeOptions): Promise<void>;
  typeFast(target: Target, text?: string | TypeOptions, opts?: TypeOptions): Promise<void>;
  /** Type the bubble's text into the composer, then move it into the bubble (DEMOS.md `type`). */
  send(composer: Target, bubble: Target, opts?: SendOptions): Promise<void>;
  stream(target: Target, opts?: StreamOptions): Promise<void>;
  dots(target: Target, ms?: number, opts?: DotsOptions): Promise<void>;
  /** Typing indicator in the bubble's list, then the bubble streams in (agent replies). */
  reply(bubble: Target, opts?: ReplyOptions): Promise<void>;
  countUp(target: Target, opts?: CountOptions): Promise<void>;

  // Emphasis
  highlight(target: Target, classes?: string, opts?: { pulse?: boolean }): Promise<void>;
  pulse(target: Target): Promise<void>;
  strike(target: Target, opts?: { collapse?: boolean }): Promise<void>;
  /** `check` effect: spinner (default 400 ms), then the check pops in (200 ms). stagger: ms between items. */
  check(target: Target, opts?: { spin?: number; stagger?: number }): Promise<void>;
  click(target: Target, opts?: ClickOptions): Promise<void>;

  // Charts
  draw(target: Target, opts?: DrawOptions): Promise<void>;
  grow(target: Target, opts?: GrowOptions): Promise<void>;

  // Panes and chrome
  scroll(container: Target, to?: ScrollTo, opts?: { duration?: number }): Promise<void>;
  /** Mobile: show this pane (data-pane id) unless the visitor picked another one during the step. */
  pane(id: string): void;
  /** Mobile one-line ticker (AppWindow `ticker` prop): the latest agent action. The marker turns from the
   *  neutral typing dots into the sage check for a completed action. `done` defaults to true, except for
   *  text that reads as still running ("Scanning 4,318 rows", "Writing up…"). */
  ticker(text: string, opts?: { done?: boolean }): Promise<void>;
  /** Slide the result card up, draw its rule, count its values. Call it in the last step. */
  showResult(): Promise<void>;
}

export interface DemoStep {
  /** Short chapter label under the progress segment ("Profile", "Research"). */
  label?: string;
  /** One sentence, at most 90 characters (DESIGN.md §9.5). */
  caption: string;
  /** Total step time in ms: animation plus a reading hold of at least 1.2 s; never under 2,500. */
  duration: number;
  /** Mobile pane this step acts in (the pane tabs follow it). */
  pane?: string;
  /** Key on-screen text for the transcript (DEMOS.md §0.7). Rendered by AppWindow. */
  transcript?: string | string[];
  run(ctx: DemoContext): void | Promise<void>;
}

export interface DemoDefinition {
  /** Matches data-demo on the AppWindow root ('customer', 'analyst', ... or 'sample'). */
  id: string;
  steps: DemoStep[];
  /** Optional: extra initial-state work after the engine's own reset (instant ctx). */
  reset?(ctx: DemoContext): void;
  /** Optional: extra final-state work for reduced motion (instant ctx), e.g. a static comparison. */
  final?(ctx: DemoContext): void;
}

export type DemoState = 'idle' | 'playing' | 'paused' | 'ended' | 'static' | 'stepping';

export interface DemoController {
  readonly root: HTMLElement;
  readonly state: DemoState;
  readonly step: number;
  play(): void;
  pause(): void;
  toggle(): void;
  replay(): void;
  jump(index: number): void;
  skip(): void;
  reset(): void;
  destroy(): void;
}

/** Identity helper that types a demo definition. */
export function defineDemo(def: DemoDefinition): DemoDefinition {
  return def;
}

const controllers = new WeakMap<HTMLElement, Player>();
/** Registered definitions by id, so markup inserted after load can mount (mountDemos(container)). */
const definitions = new Map<string, DemoDefinition>();

/** [data-demo] roots inside `scope` (and `scope` itself), optionally for one id. */
function rootsIn(scope: ParentNode, id?: string): HTMLElement[] {
  const sel = id ? `[data-demo="${CSS.escape(id)}"]` : '[data-demo]';
  const roots = Array.from(scope.querySelectorAll<HTMLElement>(sel));
  if (scope instanceof HTMLElement && scope.matches(sel)) roots.unshift(scope);
  return roots;
}
const mount = (root: HTMLElement, def: DemoDefinition): DemoController => controllers.get(root) ?? new Player(root, def);

/** Register a definition and mount every [data-demo="<def.id>"] on the page: the one call in a demo
 *  component's <script>. Roots added later mount with mountDemos(container), or here when they were added
 *  before the definition loaded. Safe to call more than once. */
export function registerDemo(def: DemoDefinition): DemoController[] {
  definitions.set(def.id, def);
  return rootsIn(document, def.id).map((root) => mount(root, def));
}

/** mountDemos(container): mount every [data-demo] inside `container` (markup added after load, such as a
 *  <template>'s content) whose definition is registered. A root whose definition has not registered yet
 *  mounts as soon as it does; its 'demo:ready' event says when.
 *  mountDemos(def, scope = document): register `def` and mount its roots inside `scope`.
 *  Both are idempotent and return the controllers. */
export function mountDemos(container: ParentNode): DemoController[];
export function mountDemos(def: DemoDefinition, scope?: ParentNode): DemoController[];
export function mountDemos(target: DemoDefinition | ParentNode, scope: ParentNode = document): DemoController[] {
  if (target instanceof Node) {
    return rootsIn(target).flatMap((root) => {
      const def = definitions.get(root.dataset.demo ?? '');
      return def ? [mount(root, def)] : [];
    });
  }
  definitions.set(target.id, target);
  return rootsIn(scope, target.id).map((root) => mount(root, target));
}

/** The controller of a mounted demo root (for page code that needs direct control). */
export function getDemo(root: Element | null): DemoController | undefined {
  return root ? controllers.get(root as HTMLElement) : undefined;
}

// ---------------------------------------------------------------------------------------------------------
// Constants and small utilities

const DEV = import.meta.env.DEV;
const EASE_OUT = 'cubic-bezier(0.2, 0.7, 0.2, 1)'; // --ease-out-soft
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)'; // --ease-in-out-soft
const linear = (t: number) => t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const AUTOPLAY_AT = 0.5; // DEMOS.md §0.2 (DESIGN.md §9.5: DEMOS.md wins on thresholds)
const PAUSE_BELOW = 0.2;
const MIN_HOLD = 1200;
/** Ticker text that reads as still in progress ("Scanning 4,318 rows", "Waiting…"): no check yet (DESIGN.md §2.4). */
const RUNNING_TEXT = /^\S+ing\b|(?:…|\.\.\.)$/i;
/** The first play from the idle preview fades the finished scene out and the start state in (ms). */
const INTRO_OUT = 180;
const INTRO_IN = 250;
const NEVER = new Promise<never>(() => {});
const ZERO = Promise.resolve();

const EFFECTS: Record<Exclude<Effect, 'none'>, Keyframe[]> = {
  fade: [{ opacity: 0, translate: '0 6px' }, { opacity: 1, translate: '0 0' }],
  rise: [{ opacity: 0, translate: '0 14px' }, { opacity: 1, translate: '0 0' }],
  scale: [{ opacity: 0, scale: '0.96' }, { opacity: 1, scale: '1' }],
  opacity: [{ opacity: 0 }, { opacity: 1 }],
  wipe: [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
};

const split = (s?: string | null) => (s ?? '').split(/\s+/).filter(Boolean);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const unhide = (el: Element) => {
  el.removeAttribute('hidden');
  el.classList.remove('demo-ghost');
};
const conceal = (el: Element, keepSpace = false) => (keepSpace ? el.classList.add('demo-ghost') : el.setAttribute('hidden', ''));
const fmtTime = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function lastKeyframe(kf: Keyframe[]): Record<string, string> {
  const out: Record<string, string> = {};
  const last = kf[kf.length - 1] ?? {};
  for (const [k, v] of Object.entries(last)) if (!['offset', 'easing', 'composite'].includes(k) && v != null) out[k] = String(v);
  return out;
}
function applyStyles(el: Element, styles: Record<string, string>) {
  const st = (el as HTMLElement).style as unknown as Record<string, string>;
  for (const [k, v] of Object.entries(styles)) st[k] = v;
}

// Numbers that count up while keeping their format: "$12,400" · "18.5 h" · "~6.5 min vs ~10 min"
interface NumPart { text?: string; value?: number; dec?: number; group?: boolean }
const NUM_RE = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g;
function parseNumbers(text: string, firstOnly = false): NumPart[] {
  const parts: NumPart[] = [];
  let last = 0;
  let found = 0;
  NUM_RE.lastIndex = 0;
  for (let m = NUM_RE.exec(text); m; m = NUM_RE.exec(text)) {
    if (firstOnly && found++ > 0) break;
    if (m.index > last) parts.push({ text: text.slice(last, m.index) });
    const raw = m[0];
    const dot = raw.indexOf('.');
    parts.push({ value: parseFloat(raw.replace(/,/g, '')), dec: dot < 0 ? 0 : raw.length - dot - 1, group: raw.includes(',') });
    last = m.index + raw.length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
const fmtNum = (v: number, dec: number, group: boolean) =>
  v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: group });
const renderNumbers = (parts: NumPart[], k: number, from = 0) =>
  parts.map((p) => p.text ?? fmtNum(from + ((p.value ?? 0) - from) * k, p.dec ?? 0, !!p.group)).join('');

// Natural typing rhythm, normalized so the total stays length x speed (steps keep their timing).
function typingSchedule(text: string, speed: number, jitter: number, rnd: () => number): number[] {
  const raw: number[] = [];
  let acc = 0;
  for (let i = 0; i < text.length; i++) {
    const prev = text[i - 1];
    let d = speed * (1 + jitter * (rnd() * 2 - 1));
    if (prev && /[.,!?;:]/.test(prev)) d += speed * 5;
    else if (prev === ' ' && rnd() < 0.14) d += speed * 3;
    acc += Math.max(1, d);
    raw.push(acc);
  }
  const k = acc ? (text.length * speed) / acc : 1;
  return raw.map((t) => t * k);
}

// Word tokens for streaming. Atoms (markers, chips, tags, icons) appear as one token.
const ATOMS = '[data-atom], .marker, .hl-tag, .chip, .count, svg, img';
const LIT = 'mark, .hl, .mark-ok, .mark-flag, [data-lit]';
function tokenize(root: Element): HTMLElement[] {
  const tokens: HTMLElement[] = [];
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) continue;
        const frag = document.createDocumentFragment();
        for (const part of text.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) frag.append(part);
          else {
            const span = document.createElement('span');
            span.className = 'demo-tok';
            span.textContent = part;
            frag.append(span);
            tokens.push(span);
          }
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (el.matches(ATOMS)) {
          el.classList.add('demo-tok');
          tokens.push(el);
        } else if (!el.matches('.demo-caret, .skel, [data-stream-skip]')) walk(el);
      }
    }
  };
  walk(root);
  return tokens;
}

// ---------------------------------------------------------------------------------------------------------
// Virtual clock: advances only while playing, so every wait, tween and typing schedule pauses exactly.

interface Timer { due: number; fn: () => void }
class Clock {
  t = 0;
  running = false;
  private last = 0;
  private raf = 0;
  private timers: Timer[] = [];
  private frames = new Set<(t: number) => void>();
  constructor(private onFrame: () => void) {}
  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }
  stop() {
    if (!this.running) return;
    this.advance(performance.now());
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
  clear() {
    this.timers = [];
    this.frames.clear();
  }
  timer(ms: number, fn: () => void) {
    this.timers.push({ due: this.t + ms, fn });
  }
  addFrame(f: (t: number) => void) {
    this.frames.add(f);
  }
  removeFrame(f: (t: number) => void) {
    this.frames.delete(f);
  }
  private advance(now: number) {
    this.t += Math.min(Math.max(now - this.last, 0), 100); // a long frame slows the demo, never skips it
    this.last = now;
  }
  private tick = (now: number) => {
    if (!this.running) return;
    this.advance(now);
    for (const f of Array.from(this.frames)) f(this.t);
    if (this.timers.length) {
      const due = this.timers.filter((x) => x.due <= this.t).sort((a, b) => a.due - b.due);
      if (due.length) {
        this.timers = this.timers.filter((x) => x.due > this.t);
        due.forEach((x) => x.fn());
      }
    }
    this.onFrame();
    if (this.running) this.raf = requestAnimationFrame(this.tick);
  };
}

interface Run { aborted: boolean }

// ---------------------------------------------------------------------------------------------------------
// Player: one per [data-demo] root.

class Player implements DemoController {
  readonly root: HTMLElement;
  state: DemoState = 'idle';
  step = 0;

  private def: DemoDefinition;
  private steps: DemoStep[];
  private total: number;
  private starts: number[] = [];
  private win: HTMLElement;
  private stage: HTMLElement | null;
  private scenes: { el: HTMLElement; html: string }[];
  private resultBox: HTMLElement | null;
  private card: HTMLElement | null;
  private resultNums: HTMLElement[];
  private captionCount: HTMLElement | null;
  private captionText: HTMLElement | null;
  private playBtn: HTMLButtonElement | null;
  private prevBtn: HTMLButtonElement | null;
  private nextBtn: HTMLButtonElement | null;
  private chapters: HTMLElement[];
  private timeEl: HTMLElement | null;
  private pausedEl: HTMLElement | null;
  private paneTabs: HTMLElement[];

  private clock: Clock;
  private run: Run | null = null;
  private anims = new Set<Animation>();
  private finalText = new WeakMap<Element, string>();
  private tokens = new WeakMap<Element, HTMLElement[]>();
  private followers = new WeakMap<Element, (t: number) => void>();
  private rnd: () => number;
  private reduced = false;
  private autoplayed = false;
  private pausedBy: 'user' | 'auto' | null = null;
  private ratio = 0;
  private stepStart = 0;
  private resultShown = false;
  private currentPane: string | null = null;
  private userPane = false;
  private pointer: SVGSVGElement | null = null;
  private lastSecond = -1;
  private pristine = true; // the scene DOM is still the server-rendered template
  private introRun: Run | null = null; // the run whose intro fade (idle preview -> start state) is playing
  private ac = new AbortController();
  private io: IntersectionObserver | null = null;

  constructor(root: HTMLElement, def: DemoDefinition) {
    this.root = root;
    this.def = def;
    this.steps = def.steps;
    this.total = this.steps.reduce((t, s, i) => ((this.starts[i] = t), t + s.duration), 0);
    this.rnd = seeded(hash(def.id));
    controllers.set(root, this);
    root.setAttribute('data-demo-mounted', '');

    const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s);
    this.win = q('[data-demo-window]') ?? root;
    this.stage = q('[data-demo-stage]');
    this.scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-demo-scene]')).map((el) => ({ el, html: el.innerHTML }));
    this.resultBox = q('[data-demo-result]');
    this.card = this.resultBox?.querySelector<HTMLElement>('.result-card') ?? null;
    this.resultNums = this.resultBox ? Array.from(this.resultBox.querySelectorAll<HTMLElement>('[data-result-count]')) : [];
    this.resultNums.forEach((el) => this.finalText.set(el, el.textContent ?? ''));
    this.captionCount = q('[data-demo-caption-count]');
    this.captionText = q('[data-demo-caption-text]');
    this.playBtn = q<HTMLButtonElement>('[data-demo-play]');
    this.prevBtn = q<HTMLButtonElement>('[data-demo-prev]');
    this.nextBtn = q<HTMLButtonElement>('[data-demo-next]');
    this.chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-demo-chapter]'));
    this.timeEl = q('[data-demo-time]');
    this.pausedEl = q('[data-demo-paused]');
    this.paneTabs = Array.from(root.querySelectorAll<HTMLElement>('[data-demo-pane-tab]'));
    const pressed = this.paneTabs.find((t) => t.getAttribute('aria-pressed') === 'true') ?? this.paneTabs[0];
    this.currentPane = pressed?.dataset.demoPaneTab ?? root.querySelector<HTMLElement>('[data-panes] > [data-pane].is-active')?.dataset.pane ?? null;
    this.clock = new Clock(() => this.onFrame());

    if (DEV) this.lint();
    this.bind();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = mq.matches;
    mq.addEventListener('change', (e) => this.setReduced(e.matches), { signal: this.ac.signal });
    if (this.reduced) this.enterStatic();
    else this.enterIdle();
    this.observe();
    this.emit('demo:ready', {});
  }

  // ---------- public controls
  play() {
    this.autoplayed = true;
    if (this.reduced) {
      if (this.state === 'static') this.stepTo(0);
      return;
    }
    if (this.state === 'paused') this.resume();
    else if (this.state === 'idle' || this.state === 'ended') this.start(0);
  }
  pause() {
    this.autoplayed = true;
    this.pauseRun('user');
  }
  toggle() {
    if (this.state === 'playing') this.pause();
    else this.play();
  }
  replay() {
    this.autoplayed = true;
    if (this.reduced) this.stepTo(0);
    else this.start(0);
  }
  jump(index: number) {
    const i = Math.max(0, Math.min(this.steps.length - 1, index | 0));
    this.autoplayed = true;
    if (this.reduced) this.stepTo(i);
    else this.start(i);
  }
  skip() {
    this.autoplayed = true;
    if (this.reduced) return this.stepTo(this.steps.length - 1);
    const run = this.begin('initial');
    this.setState('playing');
    void (async () => {
      for (let i = 0; i < this.steps.length; i++) await this.execStep(i, run, true);
      if (!run.aborted) this.finish(run);
    })();
  }
  reset() {
    if (this.reduced) this.enterStatic();
    else this.enterIdle();
  }
  destroy() {
    this.abort();
    this.ac.abort();
    this.io?.disconnect();
    controllers.delete(this.root);
    this.root.removeAttribute('data-demo-mounted');
  }

  // ---------- modes
  private enterIdle() {
    this.abort();
    this.restore('poster');
    this.step = 0;
    this.setState('idle');
    this.setCaption(0, false);
    this.paintChapters(-1);
    this.setTime(0);
  }
  private enterStatic() {
    this.abort();
    this.restore('final');
    this.showResultNow();
    this.step = this.steps.length - 1;
    this.setState('static');
    this.paintChapters(this.steps.length);
  }
  private setReduced(on: boolean) {
    if (on === this.reduced) return;
    this.reduced = on;
    if (on) this.enterStatic();
    else this.enterIdle();
  }

  // ---------- running
  private begin(mode: 'initial' | 'poster' | 'final'): Run {
    const run = this.claim();
    this.restore(mode);
    return run;
  }
  /** A fresh run that has not touched the scene yet (begin() restores it; the intro fade restores it later). */
  private claim(): Run {
    this.abort();
    const run: Run = { aborted: false };
    this.run = run;
    this.rnd = seeded(hash(this.def.id));
    return run;
  }
  private abort() {
    if (this.run) this.run.aborted = true;
    this.run = null;
    this.introRun = null;
    this.clock.stop();
    this.clock.clear();
    this.anims.forEach((a) => a.cancel());
    this.anims.clear();
    this.pointer?.remove();
    this.pointer = null;
  }
  private start(from: number) {
    // Leaving the idle preview (the finished scene), the reset happens inside a short fade, so the demo
    // reads as starting rather than its content vanishing in one frame. Replay from the result card
    // (state 'ended'), chapter jumps mid-run and reduced motion reset at once.
    const intro = this.state === 'idle' && !this.reduced && !!this.stage;
    const run = intro ? this.claim() : this.begin('initial');
    this.setState('playing');
    void (async () => {
      if (intro && !(await this.introFade(run))) return;
      for (let i = 0; i < from; i++) await this.execStep(i, run, true);
      for (let i = from; i < this.steps.length; i++) {
        if (run.aborted) return;
        await this.playStep(i, run);
      }
      if (!run.aborted) this.finish(run);
    })();
  }
  /** Fade the idle preview out (180ms), reset to the start state, fade it in (250ms), then let step 1 start.
   *  The fades live in `anims`, so Pause freezes them and any abort cancels them (the stage snaps back to
   *  opacity 1). Resolves false when the run was aborted on the way. */
  private async introFade(run: Run): Promise<boolean> {
    const stage = this.stage!;
    this.introRun = run;
    const fade = (from: number, to: number, duration: number) => {
      const anim = stage.animate([{ opacity: from }, { opacity: to }], { duration, easing: EASE_OUT, fill: 'forwards' });
      this.anims.add(anim);
      if (this.state === 'paused') anim.pause();
      return anim;
    };
    const settled = (anim: Animation) => anim.finished.then(() => !run.aborted, () => false);
    const drop = (anim: Animation) => {
      anim.cancel();
      this.anims.delete(anim);
    };
    const out = fade(1, 0, INTRO_OUT);
    let ok = await settled(out);
    if (ok) {
      this.restore('initial');
      const into = fade(0, 1, INTRO_IN); // holds opacity 0 from its first frame, so `out` can go now
      drop(out);
      ok = await settled(into);
      drop(into);
    }
    if (this.introRun === run) this.introRun = null;
    return ok && !run.aborted;
  }
  private async playStep(i: number, run: Run) {
    const step = this.steps[i];
    this.step = i;
    this.stepStart = this.clock.t;
    this.userPane = false;
    this.setCaption(i, true);
    this.paintChapters(i);
    if (step.pane) this.showPane(step.pane, 'step');
    this.emit('demo:step', { index: i, total: this.steps.length, label: step.label ?? '', caption: step.caption });
    const ctx = this.context(run, i, false);
    try {
      await this.gate(run, Promise.resolve(step.run(ctx)));
    } catch (err) {
      console.error(`[demo-engine] ${this.def.id} step ${i + 1} failed:`, err);
    }
    await ctx.settle();
    const hold = step.duration - (this.clock.t - this.stepStart);
    if (DEV && hold < MIN_HOLD) {
      console.warn(`[demo-engine] ${this.def.id} step ${i + 1}: ${Math.round(hold)} ms reading hold (DESIGN.md §9.5 wants >= ${MIN_HOLD}). Raise duration or tighten run().`);
    }
    if (hold > 0) await ctx.wait(hold);
    if (run.aborted) return;
    this.chapters[i]?.classList.add('is-done');
  }
  private async execStep(i: number, run: Run, instant: boolean) {
    const ctx = this.context(run, i, instant);
    try {
      await this.gate(run, Promise.resolve(this.steps[i].run(ctx)));
    } catch (err) {
      console.error(`[demo-engine] ${this.def.id} step ${i + 1} failed:`, err);
    }
    await ctx.settle();
  }
  private finish(run: Run) {
    if (run.aborted) return;
    if (!this.resultShown) {
      this.revealResult(true);
      this.resultNums.forEach((el) => (el.textContent = this.finalText.get(el) ?? ''));
    }
    this.clock.stop();
    this.run = null;
    this.step = this.steps.length - 1;
    this.setState('ended');
    this.setCaption(this.step, false);
    this.paintChapters(this.steps.length);
    this.setTime(this.total);
    this.emit('demo:ended', {});
  }
  private pauseRun(by: 'user' | 'auto') {
    if (this.state !== 'playing') return;
    this.clock.stop();
    this.anims.forEach((a) => a.pause());
    this.pausedBy = by;
    this.setState('paused');
  }
  private resume() {
    if (this.state !== 'paused') return;
    this.pausedBy = null;
    this.setState('playing');
    this.anims.forEach((a) => a.play());
  }

  // Reduced motion: Play steps through end states (DEMOS.md §0.6).
  private stepTo(i: number) {
    const run = this.begin('initial');
    this.setState('stepping');
    void (async () => {
      for (let j = 0; j <= i; j++) await this.execStep(j, run, true);
      if (run.aborted) return;
      if (i === this.steps.length - 1 && !this.resultShown) this.showResultNow();
      this.step = i;
      this.setCaption(i, false);
      this.paintChapters(i, true);
      const last = this.steps.length - 1;
      this.prevBtn?.setAttribute('aria-disabled', String(i === 0));
      this.nextBtn?.setAttribute('aria-disabled', String(i === last));
      const s = this.steps[i];
      if (s.pane) this.showPane(s.pane, 'step');
      this.emit('demo:step', { index: i, total: this.steps.length, label: s.label ?? '', caption: s.caption });
    })();
  }

  // ---------- scene reset / final
  private restore(mode: 'initial' | 'poster' | 'final') {
    if (!this.pristine || mode === 'initial') for (const s of this.scenes) s.el.innerHTML = s.html;
    this.pristine = false;
    this.pointer?.remove();
    this.pointer = null;
    this.hideResult();
    const scope = this.root;
    // The ticker element is a scene root itself, so its class is not part of the restored template:
    // check in the finished scene, neutral typing dots at the start (ctx.ticker() sets it from then on).
    scope.querySelectorAll('.aw-ticker').forEach((el) => el.classList.toggle('is-done', mode !== 'initial'));
    if (mode === 'initial') {
      this.applyInitial(scope);
      if (this.def.reset) this.safe(() => this.def.reset?.(this.context({ aborted: false }, 0, true)));
    } else if (mode === 'poster') {
      scope.querySelectorAll('[data-final-only]').forEach((el) => conceal(el));
    } else {
      scope.querySelectorAll<HTMLElement>('[data-autoscroll]').forEach((el) => (el.scrollTop = el.scrollHeight));
      if (this.def.final) this.safe(() => this.def.final?.(this.context({ aborted: false }, this.steps.length - 1, true)));
    }
    this.applyPane();
  }
  private applyInitial(scope: HTMLElement) {
    const all = <T extends Element = HTMLElement>(sel: string) => Array.from(scope.querySelectorAll<T>(sel));
    all('[data-hide], [data-final-only]').forEach((el) => conceal(el));
    all('[data-ghost]').forEach((el) => conceal(el, true));
    all('[data-placeholder]').forEach((el) => unhide(el));
    all('[data-initial-class]').forEach((el) => el.classList.add(...split(el.dataset.initialClass)));
    all('[data-final-class]').forEach((el) => el.classList.remove(...split(el.dataset.finalClass)));
    all('[data-initial-text]').forEach((el) => {
      this.finalText.set(el, el.textContent ?? '');
      el.textContent = el.dataset.initialText ?? '';
    });
    all('[data-type]').forEach((el) => {
      this.finalText.set(el, el.textContent ?? '');
      el.textContent = '';
    });
    all('[data-stream]').forEach((el) => {
      const toks = this.tokensOf(el);
      el.classList.add('demo-stream');
      el.classList.toggle('demo-stream--grow', el.dataset.stream === 'grow');
      toks.forEach((t) => t.classList.remove('is-on'));
    });
    all('[data-count]').forEach((el) => {
      const text = el.textContent ?? '';
      this.finalText.set(el, text);
      el.textContent = renderNumbers(parseNumbers(text, el.dataset.count === 'first'), 0, Number(el.dataset.countFrom ?? 0));
    });
    all<SVGGeometryElement>('[data-draw]').forEach((el) => this.primeDraw(el));
    all('[data-grow]').forEach((el) => this.primeGrow(el));
    all('[data-check]').forEach((el) => {
      el.classList.remove('is-running');
      el.classList.add('is-idle');
    });
    all('[data-autoscroll]').forEach((el) => (el.scrollTop = 0));
  }
  private tokensOf(el: Element) {
    let t = this.tokens.get(el);
    if (!t) {
      t = tokenize(el);
      this.tokens.set(el, t);
    }
    return t;
  }
  private primeDraw(el: SVGGeometryElement) {
    el.setAttribute('pathLength', '1');
    el.style.strokeDasharray = '1 1';
    el.style.strokeDashoffset = '1';
    el.style.visibility = 'hidden';
  }
  private clearDraw(el: SVGGeometryElement) {
    el.removeAttribute('pathLength');
    el.style.strokeDasharray = '';
    el.style.strokeDashoffset = '';
    el.style.visibility = '';
  }
  private primeGrow(el: HTMLElement, axis?: 'x' | 'y', origin?: string) {
    const ax = axis ?? (el.dataset.grow === 'x' ? 'x' : 'y');
    el.style.transformOrigin = origin ?? (ax === 'x' ? '0% 50%' : '50% 100%');
    if (el instanceof SVGElement) el.style.transformBox = 'fill-box';
    el.style.scale = ax === 'x' ? '0 1' : '1 0';
  }
  private clearGrow(el: HTMLElement) {
    el.style.scale = '';
    el.style.transformOrigin = '';
    el.style.transformBox = '';
  }

  // ---------- result card (DESIGN.md §6.12, DEMOS.md §0.5)
  private hideResult() {
    this.resultShown = false;
    this.stage?.classList.remove('has-result');
    this.card?.classList.add('is-pending');
    this.resultNums.forEach((el) => {
      const text = this.finalText.get(el) ?? '';
      el.textContent = renderNumbers(parseNumbers(text), 0);
    });
  }
  private revealResult(animated: boolean) {
    this.resultShown = true;
    if (this.card && animated) void this.card.offsetWidth; // commit the pending state so the rule draws in
    this.stage?.classList.add('has-result');
    this.card?.classList.remove('is-pending');
    if (!animated) this.resultNums.forEach((el) => (el.textContent = this.finalText.get(el) ?? ''));
  }
  private showResultNow() {
    this.revealResult(false);
  }

  // ---------- chrome
  private setState(s: DemoState) {
    this.state = s;
    const r = this.root.classList;
    r.toggle('is-playing', s === 'playing');
    r.toggle('is-paused', s === 'paused');
    r.toggle('is-ended', s === 'ended');
    r.toggle('is-idle', s === 'idle');
    r.toggle('is-reduced', this.reduced);
    r.toggle('is-stepping', s === 'stepping');
    if (s === 'playing') this.clock.start();
    const live = s === 'playing' || s === 'paused';
    if (this.stage) {
      if (live) this.stage.setAttribute('aria-hidden', 'true');
      else this.stage.removeAttribute('aria-hidden');
      this.stage.inert = live; // nothing inside a playing window takes focus (DEMOS.md §0.7)
    }
    if (this.playBtn) {
      const label = s === 'playing' ? 'Pause' : s === 'paused' ? 'Resume' : s === 'ended' ? 'Replay' : 'Play demo';
      this.playBtn.setAttribute('aria-label', label);
    }
    if (this.pausedEl) this.pausedEl.hidden = s !== 'paused';
    const stepping = s === 'stepping';
    if (this.prevBtn) this.prevBtn.hidden = !stepping;
    if (this.nextBtn) this.nextBtn.hidden = !stepping;
  }
  private setCaption(i: number, animate: boolean) {
    const step = this.steps[i];
    if (!step) return;
    if (this.captionCount) this.captionCount.textContent = `Step ${i + 1} of ${this.steps.length}`;
    if (this.captionText && this.captionText.textContent !== step.caption) {
      this.captionText.textContent = step.caption;
      if (animate) this.captionText.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: EASE_OUT });
    }
  }
  private paintChapters(current: number, full = false) {
    this.chapters.forEach((el, n) => {
      el.classList.toggle('is-done', n < current || (full && n === current));
      el.classList.toggle('is-current', n === current);
      if (n === current) el.setAttribute('aria-current', 'step');
      else el.removeAttribute('aria-current');
      el.style.removeProperty('--p');
    });
  }
  private setTime(elapsed: number) {
    const sec = Math.floor(elapsed / 1000);
    if (sec === this.lastSecond || !this.timeEl) return;
    this.lastSecond = sec;
    this.timeEl.textContent = `${fmtTime(elapsed)} / ${fmtTime(this.total)}`;
  }
  private onFrame() {
    if (this.state !== 'playing' || this.introRun) return; // the intro fade is not part of step 1's time
    const step = this.steps[this.step];
    if (!step) return;
    const into = this.clock.t - this.stepStart;
    const k = clamp01(into / step.duration);
    this.chapters[this.step]?.style.setProperty('--p', `${(k * 100).toFixed(2)}%`);
    this.setTime(this.starts[this.step] + Math.min(into, step.duration));
  }
  private showPane(id: string, source: 'step' | 'ctx' | 'user') {
    if (source === 'ctx' && this.userPane && id !== this.currentPane) {
      this.paneTabs.find((t) => t.dataset.demoPaneTab === id)?.classList.add('has-news');
      return;
    }
    if (source === 'user') this.userPane = this.state === 'playing' || this.state === 'paused';
    this.currentPane = id;
    this.applyPane();
  }
  private applyPane() {
    const id = this.currentPane;
    if (!id) return;
    this.root.querySelectorAll<HTMLElement>('[data-panes] > [data-pane]').forEach((p) => p.classList.toggle('is-active', p.dataset.pane === id));
    this.paneTabs.forEach((t) => {
      const on = t.dataset.demoPaneTab === id;
      t.setAttribute('aria-pressed', String(on));
      if (on) t.classList.remove('has-news');
    });
  }
  private emit(type: string, detail: Record<string, unknown>) {
    this.root.dispatchEvent(new CustomEvent(type, { bubbles: true, detail: { id: this.def.id, ...detail } }));
  }

  // ---------- visibility, events
  private observe() {
    if (!('IntersectionObserver' in window)) return;
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const vh = e.rootBounds?.height ?? window.innerHeight;
        const h = Math.min(e.boundingClientRect.height, vh) || 1;
        this.onRatio(e.isIntersecting ? e.intersectionRect.height / h : 0);
      }
    }, { threshold: thresholds });
    this.io.observe(this.win);
  }
  private onRatio(ratio: number) {
    this.ratio = ratio;
    if (this.reduced) return;
    if (ratio >= AUTOPLAY_AT && !document.hidden) {
      if (this.state === 'idle' && !this.autoplayed && this.canAutoplay()) {
        this.autoplayed = true;
        this.start(0);
      } else if (this.state === 'paused' && this.pausedBy === 'auto') this.resume();
    } else if (ratio < PAUSE_BELOW) this.pauseRun('auto');
  }
  private canAutoplay() {
    if (this.root.dataset.autoplay === 'off') return false;
    if (this.root.closest('[hidden], [inert], [aria-hidden="true"]')) return false;
    const el = this.win as HTMLElement & { checkVisibility?: (o?: Record<string, boolean>) => boolean };
    return typeof el.checkVisibility === 'function' ? el.checkVisibility({ visibilityProperty: true }) : el.getClientRects().length > 0;
  }
  private bind() {
    const signal = this.ac.signal;
    this.root.addEventListener('click', (e) => {
      const t = (e.target as Element).closest<HTMLElement>(
        '[data-demo-play], [data-demo-replay], [data-demo-skip], [data-demo-chapter], [data-demo-prev], [data-demo-next], [data-demo-pane-tab]',
      );
      if (!t || !this.root.contains(t)) return;
      if (t.matches('[data-demo-play]')) this.toggle();
      else if (t.matches('[data-demo-replay]')) this.replay();
      else if (t.matches('[data-demo-skip]')) this.skip();
      else if (t.matches('[data-demo-chapter]')) this.jump(Number(t.dataset.demoChapter));
      else if (t.matches('[data-demo-prev]')) {
        if (t.getAttribute('aria-disabled') !== 'true') this.stepTo(Math.max(0, this.step - 1));
      } else if (t.matches('[data-demo-next]')) {
        if (t.getAttribute('aria-disabled') !== 'true') this.stepTo(Math.min(this.steps.length - 1, this.step + 1));
      } else if (t.dataset.demoPaneTab) this.showPane(t.dataset.demoPaneTab, 'user');
    }, { signal });
    // Space toggles play when the player (not a control) has focus (DEMOS.md §0.7).
    this.win.addEventListener('keydown', (e) => {
      if (e.key !== ' ' || e.defaultPrevented) return;
      if ((e.target as Element).closest('button, a, input, select, textarea, summary, [contenteditable]')) return;
      e.preventDefault();
      this.toggle();
    }, { signal });
    this.root.addEventListener('demo:play', () => {
      if (!this.reduced) this.play(); // reduced motion: a tab switch keeps the static final state
    }, { signal });
    this.root.addEventListener('demo:pause', () => {
      this.autoplayed = true;
      this.pauseRun('user');
    }, { signal });
    this.root.addEventListener('demo:reset', () => this.reset(), { signal });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pauseRun('auto');
      else if (this.state === 'paused' && this.pausedBy === 'auto' && this.ratio >= AUTOPLAY_AT) this.resume();
    }, { signal });
  }

  // ---------- helpers shared by contexts
  private gate<T>(run: Run, p: Promise<T>): Promise<T> {
    return p.then((v) => (run.aborted ? NEVER : v));
  }
  private safe(fn: () => void) {
    try {
      fn();
    } catch (err) {
      console.error(`[demo-engine] ${this.def.id}:`, err);
    }
  }
  private lint() {
    const chapters = this.root.querySelectorAll('[data-demo-chapter]').length;
    if (chapters && chapters !== this.steps.length) console.warn(`[demo-engine] ${this.def.id}: ${chapters} chapters in the markup, ${this.steps.length} steps in the definition. Pass the same steps to <AppWindow>.`);
    this.steps.forEach((s, i) => {
      if (s.duration < 2500) console.warn(`[demo-engine] ${this.def.id} step ${i + 1}: ${s.duration} ms is under the 2,500 ms minimum (DESIGN.md §9.5).`);
      if (s.caption.length > 90) console.warn(`[demo-engine] ${this.def.id} step ${i + 1}: caption is ${s.caption.length} characters (max 90).`);
    });
  }
  private ensurePointer(): SVGSVGElement | null {
    if (!this.stage) return null;
    if (this.pointer?.isConnected) return this.pointer;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'demo-pointer');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M5 3.2v15.6l4.2-4.1 2.7 6.1 2.6-1.1-2.6-6h5.9z');
    svg.append(path);
    svg.style.opacity = '0';
    this.stage.append(svg);
    this.pointer = svg;
    return svg;
  }

  // ---------------------------------------------------------------------------------------------------------
  // The context handed to step.run(): every helper is pausable, abortable and instant-aware.
  private context(run: Run, stepIndex: number, instant: boolean): DemoContext & { settle(): Promise<void> } {
    const p = this; // eslint-disable-line @typescript-eslint/no-this-alias
    const root = this.root;
    const clock = this.clock;
    const stepStart = instant ? clock.t : this.stepStart;
    const pending = new Set<Promise<unknown>>();
    const queue: { ms: number; seq: number; fn: () => unknown; resolve: (v: unknown) => void }[] = [];
    let seq = 0;
    let draining = false;

    const dead = () => run.aborted;
    const els = (t: Target): HTMLElement[] => {
      if (!t) return [];
      if (typeof t === 'string') {
        const sel = t.startsWith('@') ? `[data-el="${t.slice(1)}"]` : t;
        const found = Array.from(root.querySelectorAll<HTMLElement>(sel));
        if (DEV && !found.length) console.warn(`[demo-engine] ${p.def.id} step ${stepIndex + 1}: "${t}" matched nothing.`);
        return found;
      }
      if (t instanceof Element) return [t as HTMLElement];
      return Array.from(t).filter((x): x is HTMLElement => !!x);
    };
    const one = (t: Target) => els(t)[0] ?? null;
    const finalTextOf = (el: Element | null) => (el ? (p.finalText.get(el) ?? el.textContent ?? '') : '');
    const textSource = (el: HTMLElement | null) => (el && !el.matches('[data-text], .chat-bubble') ? (el.querySelector<HTMLElement>('[data-text], .chat-bubble') ?? el) : el);
    const tidy = (s: string) => s.replace(/\s+/g, ' ').trim();

    const wait = (ms: number): Promise<void> => {
      if (dead()) return NEVER;
      if (instant || ms <= 0) return ZERO;
      return new Promise<void>((resolve) => clock.timer(ms, () => !dead() && resolve()));
    };
    const tween = (duration: number, update: (k: number) => void, easing: (t: number) => number = linear): Promise<void> => {
      if (dead()) return NEVER;
      if (instant || duration <= 0) {
        update(1);
        return ZERO;
      }
      const start = clock.t;
      update(0);
      return new Promise<void>((resolve) => {
        const frame = (t: number) => {
          if (dead()) return clock.removeFrame(frame);
          const k = clamp01((t - start) / duration);
          update(easing(k));
          if (k >= 1) {
            clock.removeFrame(frame);
            resolve();
          }
        };
        clock.addFrame(frame);
      });
    };
    const waapi = (el: Element, kf: Keyframe[], opts: KeyframeAnimationOptions) => {
      const anim = el.animate(kf, opts);
      p.anims.add(anim);
      if (p.state === 'paused') anim.pause();
      const done = anim.finished.then(
        () => p.anims.delete(anim),
        () => p.anims.delete(anim),
      );
      return { anim, done: done.then(() => (dead() ? NEVER : undefined)) };
    };
    const animate = (t: Target, kf: Keyframe[], options?: number | KeyframeAnimationOptions): Promise<void> => {
      if (dead()) return NEVER;
      const opts: KeyframeAnimationOptions = typeof options === 'number' ? { duration: options } : { ...options };
      const list = els(t);
      if (instant) {
        if (opts.fill === 'forwards' || opts.fill === 'both') list.forEach((el) => applyStyles(el, lastKeyframe(kf)));
        return ZERO;
      }
      return Promise.all(list.map((el) => waapi(el, kf, { duration: 250, easing: EASE_OUT, ...opts }).done)).then(() => undefined);
    };
    const track = <T>(promise: Promise<T>) => {
      pending.add(promise);
      return promise;
    };
    const drain = async () => {
      if (draining) return;
      draining = true;
      await ZERO; // let the synchronous block finish queueing, then run in timeline order
      while (queue.length && !dead()) {
        queue.sort((a, b) => a.ms - b.ms || a.seq - b.seq);
        const item = queue.shift()!;
        item.resolve(await item.fn());
      }
      draining = false;
    };
    const at = <T>(ms: number, fn: () => T | Promise<T>): Promise<T> => {
      if (dead()) return NEVER;
      if (instant) {
        const promise = new Promise<T>((resolve) => queue.push({ ms, seq: seq++, fn, resolve: resolve as (v: unknown) => void }));
        void drain();
        return track(promise);
      }
      return track(wait(stepStart + ms - clock.t).then(() => fn()));
    };
    const autoscroll = (el: Element) => {
      const box = el.closest<HTMLElement>('[data-autoscroll]');
      if (!box) return;
      if (instant) {
        box.scrollTop = box.scrollHeight;
        return;
      }
      if (p.followers.has(box)) return;
      const follow = () => {
        if (dead()) return clock.removeFrame(follow);
        const dest = box.scrollHeight - box.clientHeight;
        const move = (dest - box.scrollTop) * 0.22;
        // scrollTop snaps to whole pixels (Chrome rounds, other engines may truncate), so an eased move under 1px never
        // lands: the follower would hover a pixel or two short of the bottom for the rest of the run and pull back every
        // ctx.scroll on the box. Once the move is under 1px, jump to the exact end and stop.
        if (Math.abs(move) < 1) {
          box.scrollTop = dest;
          clock.removeFrame(follow);
          p.followers.delete(box);
          return;
        }
        box.scrollTop += move;
      };
      p.followers.set(box, follow);
      clock.addFrame(follow);
    };

    const show = (t: Target, opts: ShowOptions = {}): Promise<void> => {
      if (dead()) return NEVER;
      const { effect = 'fade', duration = 250, stagger = 0, delay = 0 } = opts;
      const list = els(t);
      return Promise.all(
        list.map(async (el, i) => {
          const d = delay + i * stagger;
          if (d) await wait(d);
          unhide(el);
          autoscroll(el);
          if (instant || effect === 'none') return;
          await waapi(el, EFFECTS[effect], { duration, easing: EASE_OUT }).done;
        }),
      ).then(() => (dead() ? NEVER : undefined));
    };
    const hide = (t: Target, opts: HideOptions = {}): Promise<void> => {
      if (dead()) return NEVER;
      const { effect = 'opacity', duration = 200, keepSpace = false } = opts;
      return Promise.all(
        els(t).map(async (el) => {
          if (!instant && effect !== 'none' && !el.hasAttribute('hidden')) {
            const { anim, done } = waapi(el, [...EFFECTS[effect]].reverse(), { duration, easing: EASE_OUT, fill: 'forwards' });
            await done;
            conceal(el, keepSpace);
            anim.cancel();
          } else conceal(el, keepSpace);
        }),
      ).then(() => undefined);
    };
    const swapText = async (t: Target, text?: string, opts: { duration?: number } = {}) => {
      if (dead()) return NEVER;
      const d = opts.duration ?? 250;
      await Promise.all(
        els(t).map(async (el) => {
          const next = text ?? finalTextOf(el);
          if (instant) {
            el.textContent = next;
            return;
          }
          const out = waapi(el, [{ opacity: 1 }, { opacity: 0 }], { duration: d * 0.4, fill: 'forwards' });
          await out.done;
          el.textContent = next;
          out.anim.cancel();
          await waapi(el, [{ opacity: 0 }, { opacity: 1 }], { duration: d * 0.6, easing: EASE_OUT }).done;
        }),
      );
    };
    const type = async (t: Target, text?: string | TypeOptions, more?: TypeOptions) => {
      if (dead()) return NEVER;
      const el = one(t);
      if (!el) return;
      const opts: TypeOptions = typeof text === 'string' ? { ...more, text } : { ...text, ...more };
      const full = opts.text ?? tidy(opts.from ? finalTextOf(textSource(one(opts.from))) : finalTextOf(el));
      unhide(el);
      if (instant) {
        el.textContent = full;
        return;
      }
      const speed = opts.speed ?? (opts.fast ? 12 : 18);
      const schedule = typingSchedule(full, speed, opts.jitter ?? 0.45, p.rnd);
      el.textContent = '';
      const node = document.createTextNode('');
      el.append(node);
      let caret: HTMLElement | null = null;
      if (opts.caret !== false) {
        caret = document.createElement('span');
        caret.className = 'demo-caret';
        caret.setAttribute('aria-hidden', 'true');
        el.append(caret);
      }
      await wait(opts.delay ?? 300);
      caret?.classList.add('is-typing');
      const totalMs = schedule[schedule.length - 1] ?? 0;
      let shown = 0;
      await tween(totalMs, (k) => {
        const elapsed = k * totalMs;
        let n = shown;
        while (n < full.length && schedule[n] <= elapsed + 0.01) n++;
        if (n !== shown) {
          node.data = full.slice(0, n);
          shown = n;
          autoscroll(el);
        }
      });
      node.data = full;
      if (caret) {
        if (opts.keepCaret) caret.classList.remove('is-typing');
        else caret.remove();
      }
    };
    const stream = async (t: Target, opts: StreamOptions = {}) => {
      if (dead()) return NEVER;
      const wrap = one(t);
      if (!wrap) return;
      const el = wrap.matches('[data-stream]') ? wrap : (wrap.querySelector<HTMLElement>('[data-stream]') ?? wrap);
      const toks = p.tokensOf(el);
      const grow = opts.grow ?? el.dataset.stream === 'grow';
      const cueAt = new Map<number, string[]>();
      el.querySelectorAll<HTMLElement>('[data-cue]').forEach((c) => {
        const i = toks.findIndex((tok) => c === tok || c.contains(tok));
        if (i >= 0) cueAt.set(i, [...(cueAt.get(i) ?? []), c.dataset.cue ?? '']);
      });
      const litAt = new Map<number, Element[]>();
      el.querySelectorAll(LIT).forEach((m) => {
        let last = -1;
        toks.forEach((tok, i) => m.contains(tok) && (last = i));
        if (last >= 0) litAt.set(last, [...(litAt.get(last) ?? []), m]);
        m.classList.remove('demo-lit');
      });
      const fire = (i: number) => {
        litAt.get(i)?.forEach((m) => m.classList.add('demo-lit'));
        cueAt.get(i)?.forEach((name) => {
          const cb = opts.cues?.[name];
          if (cb) track(Promise.resolve(cb()));
        });
      };
      const finishStream = () => {
        toks.forEach((tok, i) => {
          if (!tok.classList.contains('is-on')) {
            tok.classList.add('is-on');
            fire(i);
          }
        });
        el.classList.remove('demo-stream', 'demo-stream--grow');
      };
      el.classList.add('demo-stream');
      el.classList.toggle('demo-stream--grow', grow);
      toks.forEach((tok) => tok.classList.remove('is-on'));
      const wasHidden = wrap.hasAttribute('hidden') || wrap.classList.contains('demo-ghost');
      unhide(wrap);
      unhide(el);
      autoscroll(el);
      if (instant) return finishStream();
      if (wasHidden) waapi(wrap, EFFECTS.opacity, { duration: 150 });
      await wait(opts.delay ?? 0);
      const speed = opts.speed ?? 30;
      let caret: HTMLElement | null = null;
      if (opts.caret) {
        caret = document.createElement('span');
        caret.className = 'demo-caret is-typing';
        caret.setAttribute('aria-hidden', 'true');
      }
      let shown = 0;
      await tween(toks.length * speed, (k) => {
        const n = Math.min(toks.length, Math.floor((k * toks.length * speed) / speed) + 1);
        while (shown < n) {
          const tok = toks[shown];
          tok.classList.add('is-on');
          fire(shown++);
          if (caret) tok.after(caret);
        }
        autoscroll(el);
      });
      caret?.remove();
      finishStream();
    };
    const dots = async (t: Target, ms = 600, opts: DotsOptions = {}) => {
      if (dead()) return NEVER;
      const host = one(t);
      if (!host || instant || ms <= 0) return;
      const ind = document.createElement('div');
      ind.className = `demo-dots ${opts.className ?? 'chat-msg chat-msg--agent'}`;
      ind.setAttribute('aria-hidden', 'true');
      ind.innerHTML = '<span class="chat-bubble demo-dots__bubble"><span class="typing-dots typing-dots--lg"><i></i><i></i><i></i></span></span>';
      const before = one(opts.before ?? null);
      if (before && before.parentElement === host) host.insertBefore(ind, before);
      else host.append(ind);
      autoscroll(ind);
      waapi(ind, EFFECTS.fade, { duration: 150, easing: EASE_OUT });
      await wait(ms);
      ind.remove();
    };
    const countUp = async (t: Target, opts: CountOptions = {}) => {
      if (dead()) return NEVER;
      const duration = opts.duration ?? 700;
      await Promise.all(
        els(t).map((el) => {
          unhide(el);
          if (opts.to != null) {
            const from = opts.from ?? 0;
            const to = opts.to;
            const dec = (String(to).split('.')[1] ?? '').length;
            const fmt = opts.format ?? ((n: number) => fmtNum(n, dec, true));
            return tween(duration, (k) => (el.textContent = fmt(from + (to - from) * k)), easeOut);
          }
          const parts = parseNumbers(finalTextOf(el), el.dataset.count === 'first');
          const from = opts.from ?? Number(el.dataset.countFrom ?? 0);
          return tween(duration, (k) => (el.textContent = renderNumbers(parts, k, from)), easeOut);
        }),
      );
    };
    const pulse = async (t: Target) => {
      if (dead()) return NEVER;
      const list = els(t);
      if (instant || !list.length) return;
      list.forEach((el) => {
        el.classList.remove('is-pulsing');
        void el.offsetWidth;
        el.classList.add('is-pulsing');
      });
      await wait(1000);
      list.forEach((el) => el.classList.remove('is-pulsing'));
    };

    const ctx: DemoContext & { settle(): Promise<void> } = {
      instant,
      root,
      step: stepIndex,
      $: (s) => root.querySelector<HTMLElement>(s),
      $$: (s) => Array.from(root.querySelectorAll<HTMLElement>(s)),
      el: (name) => root.querySelector<HTMLElement>(`[data-el="${name}"]`),
      els: (name) => Array.from(root.querySelectorAll<HTMLElement>(`[data-el="${name}"]`)),
      text: (t) => finalTextOf(one(t)),
      random: p.rnd,

      wait,
      until: (ms) => wait(stepStart + ms - clock.t),
      at,
      after: (ms, fn) => (dead() ? NEVER : track(wait(ms).then(() => fn()))),
      all: (...tasks) => Promise.all(tasks).then(() => undefined),
      tween,
      animate,

      show,
      cascade: (t, opts = {}) => show(t, { stagger: 90, ...opts }),
      reveal: (t, opts = {}) => show(t, { effect: 'scale', ...opts }),
      hide,
      swap: async (from, to, opts = {}) => {
        if (dead()) return NEVER;
        const a = one(from);
        const b = one(to);
        if (!a || !b) return;
        const d = opts.duration ?? 250;
        if (instant) {
          conceal(a);
          unhide(b);
          return;
        }
        if (a.parentElement === b.parentElement && a.parentElement?.classList.contains('demo-stack')) {
          await Promise.all([hide(a, { duration: d }), show(b, { effect: 'opacity', duration: d })]);
        } else {
          await hide(a, { duration: d / 2 });
          await show(b, { effect: 'opacity', duration: d / 2 });
        }
      },
      swapText,
      setText: (t, text) => {
        if (!dead()) els(t).forEach((el) => (el.textContent = text));
      },
      addClass: (t, classes) => {
        if (!dead()) els(t).forEach((el) => el.classList.add(...split(classes ?? el.dataset.finalClass)));
      },
      removeClass: (t, classes) => {
        if (!dead()) els(t).forEach((el) => el.classList.remove(...split(classes ?? el.dataset.initialClass)));
      },
      toggleClass: (t, classes, force) => {
        if (!dead()) els(t).forEach((el) => split(classes).forEach((c) => el.classList.toggle(c, force)));
      },

      type,
      typeFast: (t, text, more) => type(t, typeof text === 'string' ? { ...more, text, fast: true } : { ...text, ...more, fast: true }),
      send: async (composer, bubble, opts = {}) => {
        if (dead()) return NEVER;
        const field = one(composer);
        const b = one(bubble);
        if (!field || !b) return;
        await type(field, { ...opts, from: b, keepCaret: true });
        await wait(opts.pause ?? 250);
        field.textContent = '';
        await show(b, { effect: 'rise', duration: 200 });
      },
      stream,
      dots,
      reply: async (bubble, opts = {}) => {
        if (dead()) return NEVER;
        const b = one(bubble);
        if (!b) return;
        if (b.parentElement) await dots(b.parentElement, opts.dots ?? 600, { before: b });
        await stream(b, { grow: true, ...opts });
      },
      countUp,

      highlight: async (t, classes, opts = {}) => {
        if (dead()) return NEVER;
        await Promise.all(
          els(t).map(async (el) => {
            el.classList.add(...split(classes ?? el.dataset.finalClass ?? 'hl hl-amber'));
            const tags = Array.from(el.querySelectorAll<HTMLElement>('[data-hide], [data-ghost]'));
            if (instant) return tags.forEach(unhide);
            const cs = getComputedStyle(el);
            const clear = 'rgba(0, 0, 0, 0)';
            const fromShadow = cs.boxShadow === 'none' ? 'none' : cs.boxShadow.replace(/rgba?\([^)]*\)/g, clear);
            const kf: Keyframe[] = [
              { boxShadow: fromShadow, backgroundColor: clear, outlineColor: clear },
              { boxShadow: cs.boxShadow, backgroundColor: cs.backgroundColor, outlineColor: cs.outlineColor },
            ];
            await Promise.all([waapi(el, kf, { duration: 250, easing: EASE_OUT }).done, show(tags, { duration: 200 })]);
            if (opts.pulse) await pulse(el);
          }),
        );
      },
      pulse,
      strike: async (t, opts = {}) => {
        if (dead()) return NEVER;
        const collapse = opts.collapse ?? true;
        await Promise.all(
          els(t).map(async (el) => {
            el.style.textDecorationLine = 'line-through';
            if (instant) {
              el.style.textDecorationColor = '';
              if (collapse) conceal(el);
              return;
            }
            await waapi(el, [{ textDecorationColor: 'transparent' }, { textDecorationColor: 'currentColor' }], { duration: 200 }).done;
            if (!collapse) return;
            const h = el.getBoundingClientRect().height;
            const cs = getComputedStyle(el);
            const { anim, done } = waapi(
              el,
              [
                { height: `${h}px`, opacity: 1, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop, marginBottom: cs.marginBottom, overflow: 'hidden' },
                { height: '0px', opacity: 0, paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px', overflow: 'hidden' },
              ],
              { duration: 300, easing: EASE_IN_OUT, fill: 'forwards' },
            );
            await done;
            conceal(el);
            anim.cancel();
          }),
        );
      },
      check: async (t, opts = {}) => {
        if (dead()) return NEVER;
        await Promise.all(
          els(t).map(async (el, i) => {
            if (i && opts.stagger) await wait(i * opts.stagger);
            unhide(el);
            if (instant) return el.classList.remove('is-idle', 'is-running');
            el.classList.remove('is-idle');
            el.classList.add('is-running');
            await wait(opts.spin ?? 400);
            el.classList.remove('is-running');
            const icon = el.querySelector('svg') ?? el;
            await waapi(icon, [{ opacity: 0, scale: '0.5' }, { opacity: 1, scale: '1' }], { duration: 200, easing: EASE_OUT }).done;
          }),
        );
      },
      click: async (t, opts = {}) => {
        if (dead()) return NEVER;
        const el = one(t);
        if (!el || instant || !p.stage) return;
        const ptr = p.ensurePointer();
        if (!ptr) return;
        const sr = p.stage.getBoundingClientRect();
        const scale = sr.width / (p.stage.offsetWidth || sr.width) || 1;
        const r = el.getBoundingClientRect();
        const x = (r.left + r.width * 0.55 - sr.left) / scale;
        const y = (r.top + r.height * 0.6 - sr.top) / scale;
        const fresh = ptr.style.opacity === '0';
        const from = fresh ? `${Math.min(x + 90, sr.width / scale - 30)}px ${Math.min(y + 70, sr.height / scale - 30)}px` : ptr.style.translate || '0px 0px';
        ptr.style.translate = from;
        if (fresh) {
          ptr.style.opacity = '1';
          waapi(ptr, [{ opacity: 0 }, { opacity: 1 }], { duration: 150 });
        }
        const move = waapi(ptr, [{ translate: from }, { translate: `${x}px ${y}px` }], { duration: opts.move ?? 500, easing: EASE_IN_OUT, fill: 'forwards' });
        await move.done;
        ptr.style.translate = `${x}px ${y}px`;
        move.anim.cancel();
        el.classList.add('is-pressed');
        ptr.classList.add('is-pressing');
        await wait(opts.press ?? 150);
        el.classList.remove('is-pressed');
        ptr.classList.remove('is-pressing');
        // The pointer fades a moment later; not tracked, so it never lengthens the step.
        clock.timer(700, () => {
          if (dead() || !ptr.isConnected) return;
          const fade = waapi(ptr, [{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });
          void fade.done.then(() => {
            ptr.style.opacity = '0';
            fade.anim.cancel();
          });
        });
      },

      draw: async (t, opts = {}) => {
        if (dead()) return NEVER;
        const { duration = 900, stagger = 0, easing = EASE_IN_OUT } = opts;
        await Promise.all(
          els(t).map(async (el, i) => {
            const geo = el as unknown as SVGGeometryElement;
            p.primeDraw(geo);
            if (i && stagger) await wait(i * stagger);
            if (instant) return p.clearDraw(geo);
            geo.style.visibility = '';
            const { anim, done } = waapi(geo, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration, easing, fill: 'forwards' });
            await done;
            p.clearDraw(geo);
            anim.cancel();
          }),
        );
      },
      grow: async (t, opts = {}) => {
        if (dead()) return NEVER;
        const { duration = 600, stagger = 60, easing = EASE_OUT } = opts;
        const list = els(t);
        list.forEach((el) => p.primeGrow(el, opts.axis, opts.origin));
        await Promise.all(
          list.map(async (el, i) => {
            if (i && stagger) await wait(i * stagger);
            if (instant) return p.clearGrow(el);
            const from = el.style.scale || '1 0';
            const { anim, done } = waapi(el, [{ scale: from }, { scale: '1 1' }], { duration, easing, fill: 'forwards' });
            await done;
            p.clearGrow(el);
            anim.cancel();
          }),
        );
      },

      scroll: async (container, to = 'bottom', opts = {}) => {
        if (dead()) return NEVER;
        const box = one(container);
        if (!box) return;
        let dest = 0;
        const max = box.scrollHeight - box.clientHeight;
        if (to === 'bottom') dest = max;
        else if (to === 'top') dest = 0;
        else if (typeof to === 'number') dest = to;
        else {
          const target = one(to as Target);
          if (!target) return;
          const top = target.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
          const bottom = top + target.getBoundingClientRect().height;
          dest = top < box.scrollTop ? top : bottom > box.scrollTop + box.clientHeight ? bottom - box.clientHeight : box.scrollTop;
        }
        dest = Math.max(0, Math.min(max, dest));
        const startTop = box.scrollTop;
        await tween(opts.duration ?? 400, (k) => (box.scrollTop = startTop + (dest - startTop) * k), easeInOut);
      },
      pane: (id) => {
        if (!dead()) p.showPane(id, instant ? 'step' : 'ctx');
      },
      ticker: async (text, opts) => {
        if (dead()) return NEVER;
        const line = root.querySelector<HTMLElement>('[data-demo-ticker]');
        const done = opts?.done ?? !RUNNING_TEXT.test(text.trim());
        line?.closest('.aw-ticker')?.classList.toggle('is-done', done); // check = done, typing dots = running
        await swapText(line, text, { duration: 200 });
      },
      showResult: async () => {
        if (dead()) return NEVER;
        if (instant) return p.showResultNow();
        p.revealResult(true);
        await wait(250);
        await countUp(p.resultNums, { duration: 700 });
      },

      settle: async () => {
        // Wait for every at()/after()/cue started in this step, including ones they start themselves.
        while (pending.size && !dead()) {
          const batch = Array.from(pending);
          pending.clear();
          await Promise.all(batch);
        }
        if (dead()) return NEVER;
      },
    };
    return ctx;
  }
}
