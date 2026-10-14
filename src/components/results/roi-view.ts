// OWNER: results
// Presentation helpers for the savings calculator, shared by RoiCalculator.astro's frontmatter (server
// render of the defaults) and its client script (live updates), so both always print the same text.
// All arithmetic lives in computeRoi() (@/data/roi); this file only formats it and shows the formula
// with the constants from roiAssumptions. Dependency-light on purpose: safe in the browser bundle.
import { roiInputs, roiAssumptions, computeRoi, type RoiInput, type RoiResult } from '@/data/roi';
import { currency, number } from '@/lib/format';

export type RoiValues = Record<string, number>;

const constant = (id: string): number => {
  const a = roiAssumptions.find((x) => x.id === id);
  if (!a) throw new Error(`roiAssumptions is missing "${id}"`);
  return a.value;
};

/** Constants shown in the formula lines (values come from roi.ts, never retyped). */
export const K = {
  weeks: constant('weeksPerYear'),
  review: constant('reviewAllowancePct'),
  minutes: constant('minutesPerInquiry'),
  resolved: constant('aiResolutionPct'),
  fteHours: constant('fteHoursPerYear'),
  ceiling: constant('perPersonCeiling'),
};

/** Number-field adornments and the spoken value for each input. */
export const fieldMeta: Record<string, { prefix?: string; suffix?: string; one?: string; many: string; short: string }> = {
  teamSize: { many: ' people', one: ' person', short: 'Team' },
  hourlyCost: { prefix: '$', many: ' per hour', short: 'Hourly cost' },
  repetitiveHours: { suffix: 'hrs', many: ' hours per week', one: ' hour per week', short: 'Repetitive hours' },
  aiSharePct: { suffix: '%', many: '%', short: 'Share' },
  monthlyInquiries: { many: ' inquiries per month', one: ' inquiry per month', short: 'Inquiries' },
};

export function valueText(id: string, v: number): string {
  const m = fieldMeta[id];
  if (!m) return String(v);
  return `${m.prefix ?? ''}${number(v)}${v === 1 && m.one ? m.one : m.many}`;
}

const span = (from: number, to: number, step: number): number[] => {
  const out: number[] = [];
  for (let v = from; v <= to; v += step) out.push(v);
  return out;
};

/**
 * Slider stops. Wide ranges (team size, inquiries) get finer steps at the small end, where most
 * businesses sit, so a 15-person team isn't squeezed into the first 3% of the track. Every stop is
 * a multiple of the input's step; the number field still accepts any valid value.
 */
export function notchesFor(spec: RoiInput): number[] {
  let stops: number[];
  if (spec.id === 'teamSize') stops = [...span(1, 40, 1), ...span(45, 100, 5), ...span(110, 200, 10), ...span(225, 500, 25)];
  else if (spec.id === 'monthlyInquiries') stops = [...span(0, 1000, 50), ...span(1100, 3000, 100), ...span(3250, 10000, 250)];
  else stops = span(spec.min, spec.max, spec.step);
  stops = stops.filter((v) => v >= spec.min && v <= spec.max && v % spec.step === 0);
  if (stops[0] !== spec.min) stops.unshift(spec.min);
  if (stops[stops.length - 1] !== spec.max) stops.push(spec.max);
  return stops;
}

/** Index of the stop closest to v. */
export function stopIndex(stops: number[], v: number): number {
  let best = 0;
  for (let i = 1; i < stops.length; i++) if (Math.abs(stops[i] - v) < Math.abs(stops[best] - v)) best = i;
  return best;
}

/** Same clamp-and-snap rule computeRoi applies, so the fields show what the model uses. */
export function sanitizeValue(spec: RoiInput, raw: number): number {
  const base = Number.isFinite(raw) ? raw : spec.default;
  const snapped = Math.round(base / spec.step) * spec.step;
  return Math.min(spec.max, Math.max(spec.min, snapped));
}

export const defaultValues = (): RoiValues => Object.fromEntries(roiInputs.map((s) => [s.id, s.default]));

/** Exact value with up to two decimals, then the floor the model keeps ("87.5 → 87"). */
const exactThenFloor = (exact: number, kept: number, unit: string): string => {
  const e = Math.round(exact * 100) / 100;
  return e === kept ? `<b>${number(kept)} ${unit}</b>` : `${number(e, 2)} → <b>${number(kept)} ${unit}</b>`;
};

export function fteWords(fte: number): string {
  return fte < 0.1 ? 'under 0.1' : number(fte, 1);
}

export function hoursFigure(h: number): string {
  return h < 1 ? '<1' : number(h);
}

export type RoiView = {
  hours: string;
  hoursUnit: string;
  annual: string;
  monthly: string;
  fte: string;
  rows: { id: string; label: string; hours: number; hoursText: string; annualText: string; pct: number }[];
  /** Full variant: [label, formula html, value html] rows. */
  ledger: [string, string, string][];
  /** Compact variant: two short math lines (html). */
  lines: string[];
  live: string;
  /** Desk-task hours handed to agents per person per week, after review (the evidence check). */
  perPerson: string;
  withinCeiling: boolean;
};

export function buildView(values: RoiValues, r: RoiResult = computeRoi(values)): RoiView {
  const v = values;
  const keep = 100 - K.review;
  const internalExact = (v.teamSize * v.repetitiveHours * v.aiSharePct * keep * K.weeks) / (100 * 100 * 12);
  const inquiryExact = (v.monthlyInquiries * K.minutes * K.resolved) / (60 * 100);
  const [tasks, inquiries] = r.breakdown;
  const total = Math.max(r.hoursPerMonth, 1);
  const monthly = r.annualValue / 12;
  const perPersonWeekly = (v.repetitiveHours * v.aiSharePct * keep) / (100 * 100);
  const short: Record<string, string> = { repetitiveTasks: 'Desk tasks', customerInquiries: 'Customer inquiries' };

  return {
    hours: hoursFigure(r.hoursPerMonth),
    hoursUnit: r.hoursPerMonth === 1 ? 'hr' : 'hrs',
    annual: currency(r.annualValue),
    monthly: currency(monthly),
    fte: fteWords(r.fteCapacity),
    rows: r.breakdown.map((b) => ({
      id: b.id,
      label: short[b.id] ?? b.label,
      hours: b.hoursPerMonth,
      hoursText: `${number(b.hoursPerMonth)} h`,
      annualText: currency(b.annualValue),
      pct: r.hoursPerMonth > 0 ? (b.hoursPerMonth / total) * 100 : 0,
    })),
    ledger: [
      [
        'Desk tasks',
        `${number(v.teamSize)} × ${number(v.repetitiveHours)} h × ${v.aiSharePct}% × ${keep}% × ${K.weeks} wk ÷ 12`,
        exactThenFloor(internalExact, tasks.hoursPerMonth, 'h'),
      ],
      [
        'Inquiries',
        `${number(v.monthlyInquiries)} × ${K.minutes} min × ${K.resolved}% ÷ 60`,
        exactThenFloor(inquiryExact, inquiries.hoursPerMonth, 'h'),
      ],
      ['Value a year', `${number(r.hoursPerMonth)} h × $${number(v.hourlyCost)} × 12`, `<b>${currency(r.annualValue)}</b>`],
      ['Capacity', `${number(r.hoursPerMonth)} h × 12 ÷ ${number(K.fteHours)}`, `<b>${fteWords(r.fteCapacity)} FTE</b>`],
    ],
    lines: [
      `<b>${number(tasks.hoursPerMonth)} h</b> desk tasks + <b>${number(inquiries.hoursPerMonth)} h</b> inquiries = <b>${number(r.hoursPerMonth)} h</b> a month`,
      `<b>${number(r.hoursPerMonth)} h</b> × <b>$${number(v.hourlyCost)}</b> × 12 = <b>${currency(r.annualValue)}</b> a year`,
    ],
    perPerson: `${number(perPersonWeekly, 1)} h a week`,
    withinCeiling: perPersonWeekly <= K.ceiling,
    live: `Modeled estimate: ${number(r.hoursPerMonth)} hours back a month, worth ${currency(r.annualValue)} a year. Break-even budget ${currency(monthly)} a month. About ${fteWords(r.fteCapacity)} full-time staff.`,
  };
}

/** Query string for the assessment CTA (the contact form reads these). */
export function contactQuery(values: RoiValues, r: RoiResult): string {
  const p = new URLSearchParams({
    source: 'calculator',
    team: String(values.teamSize),
    hourly: String(values.hourlyCost),
    hours: String(values.repetitiveHours),
    share: String(values.aiSharePct),
    inquiries: String(values.monthlyInquiries),
    annual: String(r.annualValue),
  });
  return `?${p.toString()}`;
}

/** URL parameter names shared by the home link and the results-page prefill. */
export const paramNames: Record<string, string> = {
  teamSize: 'team',
  hourlyCost: 'hourly',
  repetitiveHours: 'hours',
  aiSharePct: 'share',
  monthlyInquiries: 'inquiries',
};

/** "?team=…&…" carrying changed values to the full calculator; '' when everything is at its default. */
export function carryQuery(values: RoiValues): string {
  const changed = roiInputs.some((s) => values[s.id] !== s.default);
  if (!changed) return '';
  const p = new URLSearchParams();
  for (const s of roiInputs) p.set(paramNames[s.id], String(values[s.id]));
  return `?${p.toString()}`;
}
