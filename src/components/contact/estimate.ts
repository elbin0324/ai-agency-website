// OWNER: pages-misc
// Preliminary estimate for the intake form: turns the visitor's answers into the shared value model's
// inputs (@/data/roi: computeLevers, leverDefaults, leverInputMeta) and returns what the panel shows.
// No arithmetic of its own beyond mapping answers to inputs: every dollar and hour comes from
// computeLevers, so the panel, the calculator and the results page can never disagree.
// Only the shared contract's exports are used here (computeLevers, leverDefaults, leverInputMeta and the
// types), so changes elsewhere in roi.ts can't break the form.
import {
  computeLevers, leverDefaults, leverInputMeta,
  type LeverId, type LeverInputs, type LeverResult, type Range,
} from '@/data/roi';
import { valueOf, hoursOptions, workTypes, type WorkTypeId } from './intake';

export type { LeverId, LeverInputs, LeverResult, Range };
type Key = keyof LeverInputs;
type Meta = (typeof leverInputMeta)[Key];

/** The contract's lever order (calculator sections, panel rows). */
export const LEVERS: LeverId[] = ['time', 'customers', 'marketing', 'sales', 'consulting'];

/** The model's inputs metadata (labels, units, ranges), for the prefill and the summary. */
export const getModel = () => ({ computeLevers, leverDefaults, leverInputMeta });

/** Row names from the model itself (one call with every lever on), so the panel uses the model's words. */
export function leverLabels(): Record<LeverId, string> {
  const out = { time: 'Team time', customers: 'Customer inquiries', marketing: 'Ad spend', sales: 'Sales outreach', consulting: 'Pricing and vendors' } as Record<LeverId, string>;
  try {
    for (const l of computeLevers({}, LEVERS).levers) out[l.id] = l.label;
  } catch { /* keep the fallbacks */ }
  return out;
}

/** Inputs each lever's figure depends on (operating margin only frames the consulting result). */
export const leverKeys: Record<LeverId, Key[]> = {
  time: ['teamSize', 'repetitiveHours', 'hourlyCost'],
  customers: ['monthlyInquiries', 'afterHoursShare', 'avgJobValue', 'grossMargin', 'hourlyCost'],
  marketing: ['monthlyAdSpend'],
  sales: ['prospectsPerMonth', 'avgDealValue', 'grossMargin'],
  consulting: ['annualRevenue', 'grossMargin', 'operatingMargin'],
};

/** Inputs that change a dollar figure. Operating margin doesn't (it only frames the consulting math). */
export const valueKeys = (key: Key) => key !== 'operatingMargin';

/** What the visitor has told us, already converted to numbers (null = "Not sure", undefined = no answer). */
export type Answers = {
  teamSize?: number;
  hourlyCost?: number | null;
  hours: Partial<Record<WorkTypeId, number | null>>;
  monthlyInquiries?: number;
  afterHoursShare?: number | null;
  avgJobValue?: number;
  monthlyAdSpend?: number | null;
  outbound?: boolean | null; // true = does or wants outbound, false = no, null/undefined = not answered
  prospectsPerMonth?: number;
  avgDealValue?: number;
  annualRevenue?: number | null;
  /** Exact values carried over from the calculator, still matching what the form shows. */
  exact?: Partial<LeverInputs>;
};

/** Why a lever isn't counted yet (the panel turns these into a short prompt). */
export type Pending = 'team' | 'hours' | 'inquiries' | 'adspend' | 'noads' | 'outbound' | 'nooutbound' | 'revenue' | 'norevenue';

/** Where a model input came from: the visitor's answer, the calculator, the model's typical value, or
 *  (team size and hours per person) regrouped from the weekly team hours. */
export type Origin = 'answer' | 'calculator' | 'typical' | 'derived';

export type Estimate = {
  ready: boolean;                    // false = nothing to show yet (no team size and no other lever)
  levers: LeverResult[];
  pending: Partial<Record<LeverId, Pending>>;
  total: Range;
  hoursPerMonth: Range;
  addedRevenue: Range;
  /** Model inputs that fell back to the model's typical value (for the "typical values" note). */
  typical: Key[];
  origin: Partial<Record<Key, Origin>>;
  /** Weekly team hours counted in the time lever, how many work types used typical hours, and whether
   *  customer-conversation hours are in it (only until monthly inquiries are known). */
  teamHours: { counted: number; typicalTypes: number; fromCalculator: boolean; customersIncluded: boolean };
  inputs: Partial<LeverInputs>;
  enabled: LeverId[];
};

const zero: Range = { low: 0, high: 0 };

/** Work the time lever always counts. Customer conversations join it only while monthly inquiries are
 *  unknown; once they are known, the customers lever counts that time instead (never both). The model's
 *  typical hours (leverDefaults.repetitiveHours) cover these four kinds of work, not customer time. */
const TIME_TYPES: WorkTypeId[] = workTypes.map((w) => w.id).filter((id) => id !== 'customers');

function clampTo(meta: Meta | undefined, v: number, mode: 'round' | 'floor' = 'floor'): number {
  if (!meta) return v;
  const q = v / meta.step;
  const snap = (mode === 'floor' ? Math.floor(q + 1e-9) : Math.round(q)) * meta.step;
  return Math.min(meta.max, Math.max(meta.min, Number(snap.toFixed(6))));
}

/**
 * Express total weekly team hours as the model's team size × whole hours per person.
 * The model caps hours back PER PERSON (an evidence ceiling), so the split keeps the real team size
 * wherever that cap can bite (5+ hours a person a week) and only regroups hours where the math is
 * linear (under the cap). The product never exceeds the total, so the split can only round down.
 */
function splitTeamHours(total: number, people: number, mTeam?: Meta, mHours?: Meta): { teamSize: number; repetitiveHours: number } {
  const hMin = mHours?.min ?? 1;
  const hMax = mHours?.max ?? 20;
  const nMax = mTeam?.max ?? 500;
  const ratio = total / Math.max(1, people);
  let h: number;
  let n: number;
  if (ratio < hMin) {
    h = hMin;
    n = Math.floor(total / hMin);
  } else {
    h = Math.min(hMax, Math.max(hMin, Math.round(ratio)));
    n = Math.floor(total / h);
    if (ratio >= 5) n = Math.min(n, people);
  }
  return { teamSize: Math.min(nMax, Math.max(1, n)), repetitiveHours: h };
}

export function estimate(a: Answers): Estimate {
  const d = leverDefaults;
  const meta = leverInputMeta;
  const ex = a.exact ?? {};
  const inputs: Partial<LeverInputs> = {};
  const enabled: LeverId[] = [];
  const pending: Partial<Record<LeverId, Pending>> = {};
  const typical = new Set<Key>();
  const origin: Partial<Record<Key, Origin>> = {};
  const teamHours = { counted: 0, typicalTypes: 0, fromCalculator: false, customersIncluded: false };
  const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
  /** Exact calculator value, else the visitor's answer, else the model's typical value (noted). */
  const pick = (key: Key, v: number | null | undefined): number => {
    if (num(ex[key])) { origin[key] = 'calculator'; return ex[key] as number; }
    if (num(v)) { origin[key] = 'answer'; return v; }
    typical.add(key);
    origin[key] = 'typical';
    return d[key];
  };
  /** Origin of a value the visitor gave or the calculator carried over (no typical fallback). */
  const source = (key: Key): Origin => (num(ex[key]) ? 'calculator' : 'answer');
  const inquiries = num(ex.monthlyInquiries) ? ex.monthlyInquiries : a.monthlyInquiries;
  const knowInquiries = num(inquiries) && inquiries > 0;

  // Team time: weekly hours on inbox, reporting, marketing and sales follow-up (plus customer
  // conversations while inquiries are unknown), valued at the loaded hourly cost.
  if (num(a.teamSize)) {
    const people = num(ex.teamSize) ? ex.teamSize : a.teamSize;
    const answered = TIME_TYPES.map((id) => a.hours[id]);
    const untouched = answered.every((v) => v === null || v === undefined);
    let total = 0;
    if (untouched && num(ex.repetitiveHours)) {
      total = people * ex.repetitiveHours;
      teamHours.fromCalculator = true;
    } else {
      for (const v of answered) {
        if (num(v)) total += v;
        else { total += (d.repetitiveHours / TIME_TYPES.length) * people; teamHours.typicalTypes++; }
      }
    }
    const customerHours = a.hours.customers;
    if (!knowInquiries && num(customerHours) && customerHours > 0) {
      total += customerHours;
      teamHours.customersIncluded = true;
    }
    teamHours.counted = Math.floor(total);
    if (total >= 1) {
      const split = splitTeamHours(total, people, meta.teamSize, meta.repetitiveHours);
      inputs.teamSize = split.teamSize;
      inputs.repetitiveHours = split.repetitiveHours;
      origin.teamSize = 'derived';
      origin.repetitiveHours = 'derived';
      enabled.push('time');
    } else pending.time = 'hours';
  } else pending.time = 'team';

  // Customers: inquiries a month, the after-hours share and job value (margin below).
  if (knowInquiries) {
    inputs.monthlyInquiries = inquiries;
    origin.monthlyInquiries = source('monthlyInquiries');
    inputs.afterHoursShare = pick('afterHoursShare', a.afterHoursShare);
    inputs.avgJobValue = pick('avgJobValue', a.avgJobValue);
    enabled.push('customers');
  } else pending.customers = 'inquiries';

  // Marketing: only on a real budget (None and Not sure leave it out; we don't guess ad spend).
  const ads = num(ex.monthlyAdSpend) ? ex.monthlyAdSpend : a.monthlyAdSpend;
  if (num(ads) && ads > 0) {
    inputs.monthlyAdSpend = ads;
    origin.monthlyAdSpend = source('monthlyAdSpend');
    enabled.push('marketing');
  } else pending.marketing = ads === 0 ? 'noads' : 'adspend';

  // Sales outreach: when they do (or want to do) outbound.
  const prospectsExact = num(ex.prospectsPerMonth) && ex.prospectsPerMonth > 0;
  if (a.outbound === true || (a.outbound == null && prospectsExact)) {
    inputs.prospectsPerMonth = pick('prospectsPerMonth', a.prospectsPerMonth && a.prospectsPerMonth > 0 ? a.prospectsPerMonth : undefined);
    inputs.avgDealValue = pick('avgDealValue', a.avgDealValue && a.avgDealValue > 0 ? a.avgDealValue : undefined);
    enabled.push('sales');
  } else pending.sales = a.outbound === false ? 'nooutbound' : 'outbound';

  // Pricing and vendors (consulting): needs annual revenue.
  const revenue = num(ex.annualRevenue) ? ex.annualRevenue : a.annualRevenue;
  if (num(revenue) && revenue > 0) {
    inputs.annualRevenue = revenue;
    origin.annualRevenue = source('annualRevenue');
    inputs.operatingMargin = pick('operatingMargin', undefined);
    enabled.push('consulting');
  } else pending.consulting = a.annualRevenue === null ? 'norevenue' : 'revenue';

  // Inputs several levers share: staff time is valued at the hourly cost (time, customers), and new
  // jobs, deals and purchases are sized with the gross margin (customers, sales, consulting).
  const on = (...ids: LeverId[]) => ids.some((id) => enabled.includes(id));
  if (on('time', 'customers')) inputs.hourlyCost = pick('hourlyCost', a.hourlyCost);
  if (on('customers', 'sales', 'consulting')) inputs.grossMargin = pick('grossMargin', undefined);

  // Keep every input inside the model's own ranges, rounding down to its steps (never up).
  for (const key of Object.keys(inputs) as Key[]) {
    if (key === 'teamSize' || key === 'repetitiveHours') continue; // already fitted by splitTeamHours
    inputs[key] = clampTo(meta[key], inputs[key] as number);
  }

  if (!enabled.length) {
    return { ready: false, levers: [], pending, total: zero, hoursPerMonth: zero, addedRevenue: zero, typical: [], origin, teamHours, inputs, enabled };
  }
  const r = computeLevers(inputs, enabled);
  return {
    ready: true,
    levers: r.levers,
    pending,
    total: r.total,
    hoursPerMonth: r.hoursPerMonth,
    addedRevenue: r.addedRevenue,
    typical: [...typical],
    origin,
    teamHours,
    inputs,
    enabled,
  };
}

/** Hours option label -> weekly hours (null = Not sure). */
export const hoursValue = (label: string | null | undefined) => valueOf(hoursOptions, label);

// ---- Figures ----------------------------------------------------------------------------------
// Compact figures round DOWN (like the calculator's headline), so the panel never shows more than the
// model produced: $135,864 reads "$135K", never "$136K".

const nf = (d: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: d });
const nf0 = nf(0);
const nf1 = nf(1);

/** $640 · $6K · $135K · $1.2M (rounded down). */
export function moneyDown(v: number): string {
  const a = Math.max(0, v);
  if (a >= 1e6) return `$${nf1.format(Math.floor(a / 1e5) / 10)}M`;
  if (a >= 1e3) return `$${nf0.format(Math.floor(a / 1e3))}K`;
  return `$${nf0.format(Math.floor(a))}`;
}
/** Whole dollars, rounded down: $135,864. */
export const moneyExact = (v: number) => `$${nf0.format(Math.floor(Math.max(0, v)))}`;

const span = (r: Range, f: (n: number) => string) => {
  const lo = f(r.low);
  const hi = f(r.high);
  return lo === hi ? lo : `${lo} to ${hi}`;
};
/** A range in one style for both ends, picked by the larger end: $200 to $800 · $6K to $12K · $640K to $1.2M. */
export const moneyRange = (r: Range) => span(r, Math.max(r.low, r.high) >= 10_000 ? moneyDown : moneyExact);
/** Full dollars for the written summary: $135,864 to $326,400. */
export const moneyRangeExact = (r: Range) => span(r, moneyExact);
/** 208 to 437 */
export const countRange = (r: Range) => span(r, (n) => nf0.format(Math.floor(n)));
