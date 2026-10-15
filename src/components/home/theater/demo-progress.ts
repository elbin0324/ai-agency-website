// OWNER: theater. Playback progress of a mounted demo, for the Home picker and the /demos/ chapter nav. No engine
// changes: the engine (src/scripts/demo-engine.ts) announces each step (demo:step) and the end (demo:ended), paints
// every chapter ([data-demo-chapter], flex weight --w = its step's seconds) with is-done / is-current, sets --p
// (0–100%) on the current one each frame, and toggles is-playing / is-paused / is-ended / is-idle / is-reduced on
// the root (play, pause and reset have no outward event, so the root's class is watched too).
//
//   const stop = trackProgress(root, (p) => card.style.setProperty('--p', String(p)));   // p: 0..1
//
// It paints once now, again on every step, end and state change, and every frame only while the demo plays, so
// an idle, paused or finished demo costs nothing (the engine's own rule, DEMO_ENGINE.md §7).

/** 0..1: finished steps plus the share of the current one. 0 when idle or static (reduced motion). */
export function progressOf(root: HTMLElement, weights?: number[]): number {
  const r = root.classList;
  if (r.contains('is-ended')) return 1;
  if (r.contains('is-reduced') || !(r.contains('is-playing') || r.contains('is-paused'))) return 0;
  const chapters = root.querySelectorAll<HTMLElement>('[data-demo-chapter]');
  const w = weights ?? weightsOf(root);
  const total = w.reduce((a, b) => a + b, 0) || 1;
  let done = 0;
  chapters.forEach((c, i) => {
    if (c.classList.contains('is-done')) done += w[i] ?? 0;
    else if (c.classList.contains('is-current')) done += ((w[i] ?? 0) * (parseFloat(c.style.getPropertyValue('--p')) || 0)) / 100;
  });
  return Math.min(1, done / total);
}

function weightsOf(root: HTMLElement): number[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-demo-chapter]'), (c) => parseFloat(c.style.getPropertyValue('--w')) || 1);
}

/** Calls paint(p) whenever the demo's progress changes. Returns a stop function. */
export function trackProgress(root: HTMLElement, paint: (p: number) => void): () => void {
  const weights = weightsOf(root);
  const ac = new AbortController();
  let raf = 0;
  let last = -1;
  const frame = () => {
    raf = 0;
    const p = progressOf(root, weights);
    if (Math.abs(p - last) > 0.0005 || (p !== last && (p === 0 || p === 1))) {
      last = p;
      paint(p);
    }
    if (root.classList.contains('is-playing')) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  root.addEventListener('demo:step', kick, { signal: ac.signal });
  root.addEventListener('demo:ended', () => {
    last = 1;
    paint(1);
  }, { signal: ac.signal });
  const mo = new MutationObserver(kick);
  mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  kick();
  return () => {
    ac.abort();
    mo.disconnect();
    cancelAnimationFrame(raf);
    raf = 0;
  };
}
