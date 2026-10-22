// The hero console's figures, shared by HeroConsole.astro (first paint, and the page without
// JavaScript) and console-app.ts (every click), so both print the same numbers in the same format.
// OWNER: home-hero. Pure: the data arrives from console-data.ts as one JSON model.
import { currency, number } from '@/lib/format';

export type Period = 'today' | '7d' | '30d';
export type AgentId = 'customer' | 'analyst' | 'assistant' | 'marketing' | 'sales';
export type AgentKey = 'all' | AgentId;
export type ByPeriod<T = number> = Record<Period, T>;

export const PERIODS: Period[] = ['today', '7d', '30d'];
export const AGENTS: AgentId[] = ['customer', 'analyst', 'assistant', 'marketing', 'sales'];

/** A KPI tile after the first one (the first is always hours back, with the sparkline). */
export type KpiSpec = {
  label: string;
  v: ByPeriod;
  fmt?: 'int' | 'usd';
  unit?: string;
  /** Renders "82 of 300". */
  of?: ByPeriod;
  /** Live tallies added to every period (today sits inside all three). */
  key?: string;
  ofKey?: string;
  /** Sub line; {p} becomes the period ("7 days"). */
  sub: string;
  /** While this approval waits, the sub line says so instead (sky). */
  waiting?: { id: string; sub: string };
  /** Added once this approval is approved. */
  onApprove?: { id: string; add: number };
};

export type PeriodText = { label: string; short: string; phrase: string; vs: string; same: string };

export type ConsoleModel = {
  periods: ByPeriod<PeriodText>;
  names: Record<AgentKey, string>;
  /** Hours back per agent and period (the last point of each sparkline). */
  hours: Record<AgentId, ByPeriod>;
  /** Hours back per window, oldest first: 10 days, 10 weeks, 6 thirty-day windows. */
  spark: Record<AgentId, ByPeriod<number[]>>;
  /** Tiles 2 to 4 for each view. */
  kpis: Record<AgentKey, KpiSpec[]>;
  /** Tasks per agent (consulting included) and period. */
  tasks: Record<string, ByPeriod>;
};

/** What the live ticker has added since load, per agent: tasks, minutes, inquiries, ... */
export type Tally = Record<string, Record<string, number>>;

export type View = {
  agent: AgentKey;
  period: Period;
  tally: Tally;
  pending: string[];
  approved: string[];
};

export type Tile = {
  label: string;
  n: number;
  fmt: 'int' | 'usd' | 'h';
  unit?: string;
  of?: number;
  sub: string;
  delta?: { text: string; good: boolean };
  waiting?: boolean;
};

const r1 = (n: number) => Math.round(n * 10) / 10;
export const fmtH = (n: number) => r1(n).toFixed(1);
export const fmtN = (n: number, fmt: Tile['fmt']) => (fmt === 'h' ? fmtH(n) : fmt === 'usd' ? currency(n) : number(n));

const ids = (agent: AgentKey): AgentId[] => (agent === 'all' ? AGENTS : [agent]);
const live = (t: Tally, agent: AgentKey, key?: string) => (key ? ids(agent).reduce((s, a) => s + (t[a]?.[key] ?? 0), 0) : 0);

export function hoursBack(m: ConsoleModel, agent: AgentKey, period: Period, t: Tally): number {
  return ids(agent).reduce((s, a) => s + m.hours[a][period] + (t[a]?.minutes ?? 0) / 60, 0);
}

export function tasks(m: ConsoleModel, agent: AgentKey, period: Period, t: Tally): number {
  const keys = agent === 'all' ? Object.keys(m.tasks) : [agent];
  return keys.reduce((s, a) => s + m.tasks[a][period] + (t[a]?.tasks ?? 0), 0);
}

/** The sparkline's points: the agents' windows summed, the last one carrying the live minutes. */
export function series(m: ConsoleModel, v: View): number[] {
  const list = ids(v.agent);
  const pts = m.spark[list[0]][v.period].map((_, i) => list.reduce((s, a) => s + m.spark[a][v.period][i], 0));
  pts[pts.length - 1] = hoursBack(m, v.agent, v.period, v.tally);
  return pts;
}

export function tiles(m: ConsoleModel, v: View): Tile[] {
  const p = m.periods[v.period];
  const pts = series(m, v);
  const now = pts[pts.length - 1];
  const d = r1(now - pts[pts.length - 2]);
  const first: Tile = {
    label: `Hours back, ${p.short}`,
    n: now,
    fmt: 'h',
    unit: 'h',
    sub: d === 0 ? p.same : p.vs,
    delta: d === 0 ? undefined : { text: `${d > 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(1)} h`, good: d > 0 },
  };
  const rest = m.kpis[v.agent].map((k): Tile => {
    let n = k.v[v.period] + live(v.tally, v.agent, k.key);
    if (k.onApprove && v.approved.includes(k.onApprove.id)) n += k.onApprove.add;
    const waiting = !!k.waiting && v.pending.includes(k.waiting.id);
    return {
      label: k.label,
      n,
      fmt: k.fmt ?? 'int',
      unit: k.unit,
      of: k.of ? k.of[v.period] + live(v.tally, v.agent, k.ofKey) : undefined,
      sub: (waiting ? k.waiting!.sub : k.sub).replace('{p}', p.short),
      waiting,
    };
  });
  return [first, ...rest];
}

export const unitText = (t: Tile) => (t.of !== undefined ? `of ${number(t.of)}` : t.unit ?? '');

/** The tile's last line as HTML (our own strings only): the delta, a sky "waiting" note or plain text. */
export function subHtml(t: Tile): string {
  if (t.delta) return `<b class="${t.delta.good ? 'is-good' : 'is-bad'}">${t.delta.text}</b>${t.sub}`;
  return t.waiting ? `<span class="you">${t.sub}</span>` : t.sub;
}

/** Sparkline in a 60 x 22 box: a context line, then the latest step and its dot in the accent. */
export function sparkGeometry(pts: number[]) {
  const lo = Math.min(...pts);
  const hi = Math.max(...pts);
  const xy = pts.map((v, i) => [
    +((i * 60) / (pts.length - 1)).toFixed(1),
    +(hi === lo ? 11 : 22 - ((v - lo) / (hi - lo)) * 20).toFixed(1),
  ]);
  const [px, py] = xy[xy.length - 2];
  const [lx, ly] = xy[xy.length - 1];
  return {
    ctx: 'M' + xy.slice(0, -1).map((q) => q.join(' ')).join(' L'),
    last: `M${px} ${py} L${lx} ${ly}`,
    dot: [lx, ly] as [number, number],
  };
}
