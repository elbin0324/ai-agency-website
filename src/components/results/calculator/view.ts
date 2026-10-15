// OWNER: results (calculator)
// Presentation helpers for the value calculator, shared by the server render (RoiCalculator.astro and
// the parts in this folder) and the client script, so both always print the same text. All arithmetic
// lives in computeLevers() (@/data/roi); this file only formats it. Safe in the browser bundle.
import {
  computeLevers,
  fteFromHours,
  leverDefaults,
  leverIds,
  leverInputKeys,
  leverInputMeta,
  leverParamNames,
  leverRates,
  sanitizeLeverValue,
  type LeverId,
  type LeverInputs,
  type LeverResult,
  type Range,
} from '@/data/roi';
import type { IconName } from '@/components/ui/icons';

export type InputKey = keyof LeverInputs;
export type Values = LeverInputs;
export type Computed = ReturnType<typeof computeLevers>;

// ---------------------------------------------------------------------------------------------
// Copy per lever
// ---------------------------------------------------------------------------------------------

export type LeverInfo = {
  n: string;
  name: string;
  service: string;
  icon: IconName;
  /** One or two sentences: what the agent does and what we count. */
  lede: string;
  /** What kind of value the lever counts, after the range ("a year, …"). */
  kind: string;
  /** Categorical chart slot (DESIGN.md §3.1): fixed per lever, so filtering never repaints. */
  slot: number;
  inputs: InputKey[];
  /** Shared inputs this lever also uses, shown as a link to where they live. */
  linked?: InputKey[];
};

export const leverInfo: Record<LeverId, LeverInfo> = {
  time: {
    n: '01',
    name: 'Team time',
    service: 'AI Agents',
    icon: 'clock',
    lede: 'Agents take over repetitive desk work: routine email, data entry, reports and scheduling. Your people keep the judgment calls, and each person is capped at the hours a week the research supports.',
    kind: 'value of staff time',
    slot: 1,
    inputs: ['teamSize', 'hourlyCost', 'repetitiveHours'],
  },
  customers: {
    n: '02',
    name: 'Customer inquiries',
    service: 'Customer Agent',
    icon: 'message-square',
    lede: 'The Customer Agent answers calls, chats and forms in seconds, day or night, so fewer new jobs go to whoever picks up first. It also resolves routine questions without your staff.',
    kind: 'gross profit and staff time',
    slot: 2,
    inputs: ['monthlyInquiries', 'afterHoursShare', 'avgJobValue', 'grossMargin'],
  },
  marketing: {
    n: '03',
    name: 'Ad spend',
    service: 'AI Marketing Director',
    icon: 'megaphone',
    lede: 'The Marketing Director audits every campaign, tests offers and audiences, and moves budget to what converts, within limits you set. The same leads cost less, which frees budget to put behind what works.',
    kind: 'budget freed to reallocate',
    slot: 3,
    inputs: ['monthlyAdSpend'],
  },
  sales: {
    n: '04',
    name: 'Sales outreach',
    service: 'AI Sales Agent',
    icon: 'send',
    lede: 'The Sales Agent researches each prospect and writes the email a thoughtful person would, then follows up. Cold email replies are rare, so we use measured reply rates, not vendor claims, and count only a deal’s first year.',
    kind: 'gross profit on new deals',
    slot: 4,
    inputs: ['prospectsPerMonth', 'avgDealValue'],
    linked: ['grossMargin'],
  },
  consulting: {
    n: '05',
    name: 'Pricing and vendors',
    service: 'AI Consulting',
    icon: 'trending-up',
    lede: 'AI Consulting reads your books, quotes and vendor bills to find price leakage and overspending, then ranks the fixes by payback. A fraction of a margin point on real revenue adds up. Process fixes, like unused software or card fees, aren’t counted here.',
    kind: 'gross profit from prices and costs',
    slot: 5,
    inputs: ['annualRevenue', 'operatingMargin'],
    linked: ['grossMargin'],
  },
};

// ---------------------------------------------------------------------------------------------
// Inputs: adornments, spoken values and slider stops
// ---------------------------------------------------------------------------------------------

export type FieldInfo = { prefix?: string; suffix?: string; one?: string; many: string; wide?: boolean };

export const fieldInfo: Record<InputKey, FieldInfo> = {
  teamSize: { many: ' people', one: ' person' },
  hourlyCost: { prefix: '$', many: ' per hour' },
  repetitiveHours: { suffix: 'hrs', many: ' hours per week', one: ' hour per week' },
  monthlyInquiries: { many: ' inquiries per month', one: ' inquiry per month' },
  afterHoursShare: { suffix: '%', many: '%' },
  avgJobValue: { prefix: '$', many: ' per job' },
  grossMargin: { suffix: '%', many: '% gross margin' },
  monthlyAdSpend: { prefix: '$', many: ' a month', wide: true },
  prospectsPerMonth: { many: ' prospects per month', one: ' prospect per month' },
  avgDealValue: { prefix: '$', many: ' per deal', wide: true },
  annualRevenue: { prefix: '$', many: ' a year', wide: true },
  operatingMargin: { suffix: '%', many: '% operating margin' },
};

const nf0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export const num = (v: number, d = 0) => (d === 0 ? nf0 : d === 1 ? nf1 : nf2).format(v);
export const money = (v: number) => `$${nf0.format(v)}`;

/** What the number field shows (thousands separators, no unit). */
export const fieldText = (v: number) => nf0.format(v);

/** Parse what a visitor typed: "12,000,000", "$12000000", " 40 % " → number (NaN if not a number). */
export function parseField(raw: string): number {
  const s = raw.replace(/[\s,$%]/g, '').replace(/hrs?$/i, '');
  if (s === '' || !/^-?\d*\.?\d+$/.test(s)) return NaN;
  return Number(s);
}

export function valueText(key: InputKey, v: number): string {
  const f = fieldInfo[key];
  return `${f.prefix ?? ''}${nf0.format(v)}${v === 1 && f.one ? f.one : f.many}`;
}

const span = (from: number, to: number, step: number): number[] => {
  const out: number[] = [];
  for (let v = from; v <= to + 1e-9; v += step) out.push(Math.round(v));
  return out;
};

/**
 * Slider stops. Wide ranges get finer steps at the small end, where most businesses sit, so a
 * 25-person team or a $10,000 budget isn't squeezed into the first few pixels of the track. Every
 * stop is a multiple of the input's step; the number field still accepts any valid value.
 */
export function stopsFor(key: InputKey): number[] {
  const m = leverInputMeta[key];
  const plan: Partial<Record<InputKey, number[]>> = {
    teamSize: [...span(1, 40, 1), ...span(45, 100, 5), ...span(110, 200, 10), ...span(225, 500, 25)],
    monthlyInquiries: [...span(0, 1000, 50), ...span(1100, 3000, 100), ...span(3250, 10000, 250), ...span(10500, 20000, 500)],
    avgJobValue: [...span(50, 1000, 50), ...span(1100, 3000, 100), ...span(3250, 10000, 250), ...span(10500, 20000, 500), ...span(21000, 50000, 1000)],
    monthlyAdSpend: [...span(0, 10000, 500), ...span(11000, 30000, 1000), ...span(32500, 100000, 2500), ...span(105000, 200000, 5000), ...span(210000, 500000, 10000)],
    prospectsPerMonth: [...span(0, 2000, 50), ...span(2100, 5000, 100)],
    avgDealValue: [...span(500, 10000, 500), ...span(11000, 50000, 1000), ...span(52500, 100000, 2500), ...span(105000, 250000, 5000), ...span(260000, 500000, 10000)],
    annualRevenue: [...span(250000, 2000000, 50000), ...span(2100000, 10000000, 100000), ...span(10500000, 50000000, 500000), ...span(51000000, 100000000, 1000000), ...span(105000000, 250000000, 5000000)],
  };
  let stops = plan[key] ?? span(m.min, m.max, m.step);
  stops = stops.filter((v) => v >= m.min && v <= m.max && Math.abs(v / m.step - Math.round(v / m.step)) < 1e-9);
  if (stops[0] !== m.min) stops.unshift(m.min);
  if (stops[stops.length - 1] !== m.max) stops.push(m.max);
  return stops;
}

/** Index of the stop closest to v. */
export function stopIndex(stops: number[], v: number): number {
  let best = 0;
  for (let i = 1; i < stops.length; i++) if (Math.abs(stops[i] - v) < Math.abs(stops[best] - v)) best = i;
  return best;
}

export const sanitize = sanitizeLeverValue;
export const defaults = (): Values => ({ ...leverDefaults });

// ---------------------------------------------------------------------------------------------
// Figures
// ---------------------------------------------------------------------------------------------

const both = (lo: string, hi: string) => (lo === hi ? lo : `${lo} to ${hi}`);

/** "$74,880 to $157,320" */
export const rangeMoney = (r: Range) => both(money(r.low), money(r.high));
/** "208 to 437" */
export const rangeNum = (r: Range, d = 0) => both(num(r.low, d), num(r.high, d));

/** Round down for a compact figure, so a headline never shows more than the model produced. */
export function compactDown(v: number): string {
  const a = Math.max(0, v);
  if (a >= 1e9) return `$${nf2.format(Math.floor(a / 1e7) / 100)}B`;
  if (a >= 1e7) return `$${nf1.format(Math.floor(a / 1e5) / 10)}M`;
  if (a >= 1e6) return `$${nf2.format(Math.floor(a / 1e4) / 100)}M`;
  if (a >= 1e4) return `$${nf0.format(Math.floor(a / 1e3))}K`;
  return money(Math.floor(a));
}

/** "$243K–$537K" for the headline figure (en dash, no spaces). */
export const rangeCompact = (r: Range) => {
  const lo = compactDown(r.low);
  const hi = compactDown(r.high);
  return lo === hi ? lo : `${lo}–${hi}`;
};

export type LeverStat = { label: string; value: string; context?: boolean };

/** Two or three short stats for a lever's panel: its own range, plus what it means. */
export function leverStats(l: LeverResult, values: Values): LeverStat[] {
  const kind = leverInfo[l.id].kind;
  const out: LeverStat[] = [{ label: `${kind.charAt(0).toUpperCase()}${kind.slice(1)}, a year`, value: rangeMoney(l.value) }];
  if (l.id === 'time' && l.hoursPerMonth) {
    out.push({ label: 'Hours back a month', value: `${rangeNum(l.hoursPerMonth)} h` });
    out.push({ label: 'Full-time capacity', value: `${both(num(fteFromHours(l.hoursPerMonth.low), 1), num(fteFromHours(l.hoursPerMonth.high), 1))} people` });
  }
  if (l.id === 'marketing') out.push({ label: 'Or, at the same budget', value: `${both(`${leverRates.moreLeads.low}%`, `${leverRates.moreLeads.high}%`)} more leads` });
  if (l.id === 'consulting') {
    const pts = (v: number) => num(Math.floor((v / values.annualRevenue) * 10000) / 100, 2);
    out.push({ label: 'Margin gain', value: `${both(`+${pts(l.value.low)}`, `+${pts(l.value.high)}`)} pts` });
  }
  if (l.addedRevenue) out.push({ label: 'Added revenue, for context', value: rangeMoney(l.addedRevenue), context: true });
  return out;
}

export type Segment = { id: LeverId; slot: number; low: number; high: number };

export type Readout = {
  count: number;
  countText: string;
  figure: string;
  figureSr: string;
  low: string;
  high: string;
  revenue: string;
  hasRevenue: boolean;
  hours: string;
  /** "218 to 463 hrs a month": the hours in the phone dock, where space is tight. */
  hoursShort: string;
  fte: string;
  hasHours: boolean;
  /** Base-case value a month, rounded down: the most agents could cost and still pay for themselves. */
  breakEven: string;
  /** Bar widths as % of the high total (the longest bar). */
  lowPct: number;
  segments: Segment[];
  biggest: string;
  chartLabel: string;
  live: string;
};

export function readout(all: Computed, enabled: LeverId[]): Readout {
  const on = all.levers.filter((l) => enabled.includes(l.id));
  const total: Range = { low: on.reduce((s, l) => s + l.value.low, 0), high: on.reduce((s, l) => s + l.value.high, 0) };
  const rev: Range = { low: on.reduce((s, l) => s + (l.addedRevenue?.low ?? 0), 0), high: on.reduce((s, l) => s + (l.addedRevenue?.high ?? 0), 0) };
  const hrs: Range = { low: on.reduce((s, l) => s + (l.hoursPerMonth?.low ?? 0), 0), high: on.reduce((s, l) => s + (l.hoursPerMonth?.high ?? 0), 0) };
  const count = on.length;
  const top = [...on].sort((a, b) => b.value.high - a.value.high)[0];
  const fte = both(num(fteFromHours(hrs.low), 1), num(fteFromHours(hrs.high), 1));
  return {
    count,
    countText: count === leverIds.length ? 'all five levers' : count === 1 ? '1 of 5 levers' : `${count} of 5 levers`,
    figure: count ? rangeCompact(total) : '$0',
    figureSr: count ? `${rangeMoney(total)} a year` : 'No levers counted',
    low: money(total.low),
    high: money(total.high),
    revenue: rangeMoney(rev),
    hasRevenue: rev.high > 0,
    hours: `${rangeNum(hrs)} hours a month`,
    hoursShort: `${rangeNum(hrs)} hrs a month`,
    fte: `about ${fte} full-time staff of capacity`,
    hasHours: hrs.high > 0,
    breakEven: `${money(Math.floor(total.low / 12))} a month, at base rates`,
    lowPct: total.high > 0 ? (total.low / total.high) * 100 : 0,
    segments: on.map((l) => ({ id: l.id, slot: leverInfo[l.id].slot, low: l.value.low, high: l.value.high })),
    biggest: top ? leverInfo[top.id].name : '',
    chartLabel: count
      ? `Low case ${money(total.low)}, high case ${money(total.high)} a year. Largest lever: ${top ? leverInfo[top.id].name : ''}.`
      : 'No levers counted.',
    live: count
      ? `Modeled estimate: ${rangeMoney(total)} a year from ${count === 5 ? 'all five levers' : `${count} of 5 levers`}.`
      : 'No levers counted. Switch one on to see an estimate.',
  };
}

/** The compact calculator's two math lines (team time, customer inquiries). */
export function compactLines(all: Computed, v: Values): string[] {
  const time = all.levers.find((l) => l.id === 'time');
  const cust = all.levers.find((l) => l.id === 'customers');
  const out: string[] = [];
  if (time?.hoursPerMonth) out.push(`Team time: ${rangeNum(time.hoursPerMonth)} h a month × 12 × ${money(v.hourlyCost)} = ${rangeMoney(time.value)}`);
  if (cust?.addedRevenue) {
    const jobs = { low: cust.addedRevenue.low / (12 * v.avgJobValue), high: cust.addedRevenue.high / (12 * v.avgJobValue) };
    out.push(`Customers: ${rangeNum(jobs, 1)} jobs a month × 12 × ${money(v.avgJobValue)} × ${num(v.grossMargin)}% + staff time = ${rangeMoney(cust.value)}`);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// URLs: prefill from the query string, carry to the full calculator, hand off to /contact/
// ---------------------------------------------------------------------------------------------

/**
 * Values, enabled levers and the lever to open from a query string (legacy names team/hourly/hours/
 * inquiries included). `open` names one lever to expand (the home calculator's "more levers" links).
 */
export function fromQuery(search: string): { values: Partial<Values>; enabled?: LeverId[]; open?: LeverId } {
  const p = new URLSearchParams(search);
  const values: Partial<Values> = {};
  for (const key of leverInputKeys) {
    const raw = p.get(leverParamNames[key]);
    if (raw === null || raw.trim() === '') continue;
    const n = Number(raw);
    if (Number.isFinite(n)) values[key] = sanitizeLeverValue(key, n);
  }
  const list = p.get('levers');
  let enabled: LeverId[] | undefined;
  if (list !== null) {
    const ids = list.split(',').map((s) => s.trim()) as LeverId[];
    enabled = leverIds.filter((id) => ids.includes(id));
  }
  const openRaw = p.get('open');
  const open = leverIds.find((id) => id === openRaw);
  return { values, enabled, open };
}

/**
 * "?team=…" with every changed value (and the lever list when not all five), for the full calculator.
 * `open` adds the lever to expand there.
 */
export function carryQuery(values: Values, enabled: LeverId[], keys: InputKey[] = leverInputKeys, open?: LeverId): string {
  const p = new URLSearchParams();
  for (const key of keys) if (values[key] !== leverDefaults[key]) p.set(leverParamNames[key], String(values[key]));
  if (enabled.length !== leverIds.length) p.set('levers', enabled.join(','));
  if (open) p.set('open', open);
  const s = p.toString();
  return s ? `?${s}` : '';
}

/** Share of a total as a whole percent, rounded down ("31%"); "under 1%" for slivers. */
export function shareText(part: number, total: number): string {
  if (total <= 0 || part <= 0) return '0%';
  const p = Math.floor((part / total) * 100);
  return p < 1 ? 'under 1%' : `${p}%`;
}

/**
 * Query string for the assessment CTA. Keeps the parameters the contact form already reads
 * (source, team, hourly, hours, share, inquiries, annual) and adds every other input, the counted
 * levers and the total range (low, high), so the first call can start from the same estimate.
 * `share` is the time lever's low-case coverage and `annual` the matching legacy figure (the low-case
 * value of time: team time plus customer staff time), so the form's recompute agrees with the page.
 */
export function contactQuery(values: Values, enabled: LeverId[], all: Computed): string {
  const time = all.levers.find((l) => l.id === 'time');
  const cust = all.levers.find((l) => l.id === 'customers');
  const legacyAnnual = (time?.value.low ?? 0) + (cust?.hoursPerMonth?.low ?? 0) * 12 * values.hourlyCost;
  const r = readoutTotals(all, enabled);
  const p = new URLSearchParams({ source: 'calculator' });
  p.set('team', String(values.teamSize));
  p.set('hourly', String(values.hourlyCost));
  p.set('hours', String(values.repetitiveHours));
  p.set('share', String(leverRates.coverage.low));
  p.set('inquiries', String(values.monthlyInquiries));
  p.set('annual', String(legacyAnnual));
  for (const key of leverInputKeys) {
    const name = leverParamNames[key];
    if (!p.has(name)) p.set(name, String(values[key]));
  }
  p.set('levers', enabled.join(','));
  p.set('low', String(r.low));
  p.set('high', String(r.high));
  return `?${p.toString()}`;
}

function readoutTotals(all: Computed, enabled: LeverId[]): Range {
  const on = all.levers.filter((l) => enabled.includes(l.id));
  return { low: on.reduce((s, l) => s + l.value.low, 0), high: on.reduce((s, l) => s + l.value.high, 0) };
}

export { computeLevers, leverIds, leverInputKeys, leverInputMeta, leverDefaults, leverParamNames };
export type { LeverId, LeverResult, Range };
