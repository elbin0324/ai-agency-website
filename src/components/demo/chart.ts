// Build-time chart math for demo charts (BarChart.astro, LineChart.astro, or hand-made SVG).
// OWNER: demo engine. Pure functions: safe in frontmatter and client code. DESIGN.md §3.5 mark specs.

/** A round axis maximum at or above `max`: ticks x a clean step (1, 1.5, 2, 2.5, 3, 4, 5, 6, 8 x 10^n). */
export function niceMax(max: number, ticks = 4): number {
  if (max <= 0) return 1;
  const raw = max / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  return step * ticks;
}

/** 3 to 5 evenly spaced gridline values from min to max, inclusive (DESIGN.md: 3–5 clean round values). */
export function niceTicks(max: number, count = 4, min = 0): number[] {
  const step = (max - min) / count;
  return Array.from({ length: count + 1 }, (_, i) => +(min + step * i).toFixed(6));
}

/** Linear scale: domain value -> range value. */
export function scaleLinear([d0, d1]: [number, number], [r0, r1]: [number, number]) {
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  return (v: number) => r0 + (v - d0) * k;
}

/** Polyline path through points ("M x y L x y …"), rounded to 0.1 px. */
export function linePath(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

/** Closed area under a line down to the baseline y. */
export function areaPath(points: [number, number][], baseline: number): string {
  if (!points.length) return '';
  const first = points[0];
  const last = points[points.length - 1];
  return `${linePath(points)} L${last[0].toFixed(1)} ${baseline.toFixed(1)} L${first[0].toFixed(1)} ${baseline.toFixed(1)} Z`;
}

/** Column with a rounded data end and a square baseline (DESIGN.md §3.5): x, y = top-left, w, h in px. */
export function barPath(x: number, y: number, w: number, h: number, r = 4): string {
  const rr = Math.max(0, Math.min(r, w / 2, h));
  return `M${x} ${y + h} V${y + rr} Q${x} ${y} ${x + rr} ${y} H${x + w - rr} Q${x + w} ${y} ${x + w} ${y + rr} V${y + h} Z`;
}

/** Fraction (0–1) of v between min and max, for CSS custom properties such as --v. */
export const frac = (v: number, max: number, min = 0) => (max === min ? 0 : (v - min) / (max - min));
