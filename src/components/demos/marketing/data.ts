// Marketing Director demo: the storyboard data (content/DEMOS.md §4), in one place.
// OWNER: demo-marketing. Every figure is fictional and illustrative; the copy is DEMOS.md's, set with
// typographic quotes and minus signs. Derived values (cost per booking, percentages) are computed here
// from the raw spend and booking counts so the math on screen always agrees with itself.
import { currency } from '@/lib/format';

export const business = 'Stillbrook Dental Group';

// ---------------------------------------------------------------- KPI strip (step 1, then week 8 mode)
export interface Kpi {
  label: string;
  value: string;
  /** Week 8 mode only: the delta line. `good` deltas carry a sage arrow. */
  delta?: { arrow?: '▲' | '▼'; strong?: string; text?: string; good?: boolean };
}
export const kpiStart: Kpi[] = [
  { label: 'Spend · last 28 days', value: '$24,000' },
  { label: 'New-patient bookings', value: '141' },
  { label: 'Cost per booking', value: '$170' },
  { label: 'Est. ROAS', value: '6.8x' },
];
export const kpiWeek8: Kpi[] = [
  { label: 'Spend · week 8', value: '$6,000', delta: { text: 'same' } },
  { label: 'Bookings', value: '39', delta: { arrow: '▲', strong: '+4', text: 'vs week 1', good: true } },
  { label: 'Cost per booking', value: '$154', delta: { arrow: '▼', strong: '−10%', good: true } },
  { label: 'Waste found', value: '$4,364', delta: { text: 'per 4 weeks' } },
];

// ---------------------------------------------------------------- Campaigns · last 28 days (steps 1–2)
export type Channel = 'Google' | 'Meta';
export interface Flag {
  label: string;
  /** Lead line of the detail popover. */
  lead: string;
  /** Optional bold amount that closes the lead line, on the same line (DEMOS.md keeps it there). */
  amount?: string;
  /** Optional ledger rows (search terms and their spend). */
  rows?: [string, string][];
  /** Optional closing lines. */
  lines?: string[];
}
export interface Campaign {
  n: number;
  name: string;
  short: string;
  channel: Channel;
  spend: number;
  bookings: number;
  roas: string;
  flag?: Flag;
}

export const campaigns: Campaign[] = [
  {
    n: 1, name: 'Search · Dentist near me', short: 'Dentist near me', channel: 'Google', spend: 6400, bookings: 40, roas: '5.0x',
    flag: {
      label: 'Out-of-area clicks',
      lead: '14% of clicks came from 15+ miles from any office. None of the 40 bookings did.',
      amount: '$896.',
    },
  },
  { n: 2, name: 'Search · Emergency dentist', short: 'Emergency dentist', channel: 'Google', spend: 3600, bookings: 24, roas: '4.3x' },
  {
    n: 3, name: 'Search · Dental implants', short: 'Dental implants', channel: 'Google', spend: 5200, bookings: 13, roas: '9.0x',
    flag: {
      label: 'Broad-match waste',
      lead: '41% of spend ($2,132) matched searches that never book:',
      rows: [
        ['“dental implant school”', '$412'],
        ['“free dental implants”', '$388'],
        ['“dental implants overseas”', '$356'],
        ['“implant dentist jobs”', '$301'],
        ['“denture repair kit”', '$244'],
        ['+ 38 more terms', '$431'],
      ],
    },
  },
  {
    n: 4, name: 'Meta · $99 new-patient exam (video)', short: '$99 new-patient exam', channel: 'Meta', spend: 4200, bookings: 30, roas: '5.7x',
    flag: {
      label: 'Creative fatigue',
      lead: 'Frequency 7.4. CTR down from 1.9% to 0.8% in 4 weeks.',
      lines: ['Weekly cost per booking: $95.45 → $131.25 → $175.00 → $210.00', '$1,336 spent above its week-1 cost per booking.'],
    },
  },
  { n: 5, name: 'Meta · Clear aligner consult', short: 'Clear aligner consult', channel: 'Meta', spend: 2800, bookings: 14, roas: '10.0x' },
  { n: 6, name: 'Meta · Retargeting: site visitors', short: 'Retargeting', channel: 'Meta', spend: 1800, bookings: 20, roas: '8.9x' },
];

/** Order the audit flags the rows (DEMOS.md step 2: rows 3, 4, then 1, about 1.4 s apart). */
export const flagOrder = [3, 4, 1];

export const campaignTotal = {
  spend: campaigns.reduce((t, c) => t + c.spend, 0), // 24,000
  bookings: campaigns.reduce((t, c) => t + c.bookings, 0), // 141
  roas: '6.8x',
};
export const cpb = (spend: number, bookings: number) => currency(Math.round(spend / bookings)); // $170

export const campaignFootnote =
  'Booking = a new-patient appointment booked online or by phone. Est. ROAS = bookings × average first-year collections per new patient for that service ÷ spend (general $800, emergency $650, implants $3,600, clear aligners $2,000).';

export const wasteLine = { strong: 'Waste found: $4,364 per 4 weeks', rest: '(18% of spend)' };

// ---------------------------------------------------------------- Fixes (step 3)
export const fixes: { lead: string; text: string }[] = [
  { lead: 'Implants:', text: '43 negative keywords added; broad match → phrase match' },
  { lead: '$99 exam:', text: 'tired video paused; 3 new ads live' },
  { lead: 'Near me:', text: '12-mile radius around each office; people in the area only' },
];
export const approval = { who: 'Approved by Jess Morgan', rest: 'Mon 10:12 am · 3 changes logged' };

// ---------------------------------------------------------------- Experiments (steps 4–5)
export interface Experiment {
  id: 'A' | 'B' | 'C';
  type: string;
  target: string;
  current: string;
  next: string;
  measure: string;
}
export const experiments: Experiment[] = [
  {
    id: 'A', type: 'Headline test', target: 'Google Search: Dentist near me (one ad group per office)',
    current: '“Family Dentist in Eastgate | New Patients Welcome”', next: '“Same-Week Appointments | Most Insurance Accepted”',
    measure: 'cost per booking',
  },
  {
    id: 'B', type: 'Audience test', target: 'Meta: $99 new-patient exam (new ads)',
    current: 'Adults 25–65 within 10 miles of an office', next: 'Adults 25–65 within 5 miles of an office',
    measure: 'cost per booking',
  },
  {
    id: 'C', type: 'Landing page test', target: 'Google Search: Dental implants',
    current: 'Homepage', next: 'Implant consult page with price ranges, financing options and online booking',
    measure: 'cost per booked consult',
  },
];
export const winRule = 'A test wins at 90% probability or better.';

export interface ArmResult { spend: number; count: number; unit: 'bookings' | 'consults' }
export interface ExperimentResult {
  test: string;
  current: ArmResult;
  next: ArmResult;
  /** Probability the new version is better, in % (Bayesian, flat prior). */
  prob: number;
  decision: string;
  action: string;
  /** 'running': still undecided, the outline .chip-running with typing dots (DESIGN.md §2.4; never brass).
   *  Any other tone is a decided outcome, a filled .hl-tag in that highlight color. */
  tone: 'running' | 'gray';
}
export const experimentResults: ExperimentResult[] = [
  { test: 'A · Headline', current: { spend: 2400, count: 15, unit: 'bookings' }, next: { spend: 2400, count: 17, unit: 'bookings' }, prob: 64, decision: 'Promising', action: 'Run 3 more weeks', tone: 'running' },
  { test: 'B · Audience', current: { spend: 1575, count: 11, unit: 'bookings' }, next: { spend: 1575, count: 11, unit: 'bookings' }, prob: 50, decision: 'No clear difference', action: 'Keep current', tone: 'gray' },
  { test: 'C · Landing page', current: { spend: 1950, count: 5, unit: 'consults' }, next: { spend: 1950, count: 6, unit: 'consults' }, prob: 61, decision: 'Promising', action: 'Run 3 more weeks', tone: 'running' },
];
/** $160.00 each (the results table shows cents, DEMOS.md §0.4). */
export const each = (a: ArmResult) => currency(a.spend / a.count, { cents: true });
/** Change in cost per booking, new vs current: −12% · 0% · −17%. */
export const change = (r: ExperimentResult) => {
  const pct = Math.round((r.current.count / r.next.count - 1) * 100);
  return pct === 0 ? '0%' : `${pct < 0 ? '−' : '+'}${Math.abs(pct)}%`;
};
export const winThreshold = 90;
export const resultsFootnote = `Chance the new version books more patients per dollar. We call a winner at ${winThreshold}%.`;

// ---------------------------------------------------------------- Budget (step 6)
export interface BudgetRow { name: string; w4: number; w5: number; why: string }
export const budget: BudgetRow[] = [
  { name: 'Search · Dentist near me', w4: 1600, w5: 1920, why: 'Lowest search cost per booking after the radius fix. Wanted +35%, capped.' },
  { name: 'Search · Dental implants', w4: 1300, w5: 1460, why: 'Negatives cut the waste; highest value per patient. Search volume limits more.' },
  { name: 'Meta · Clear aligner consult', w4: 700, w5: 700, why: 'Steady at 10.0x.' },
  { name: 'Search · Emergency dentist', w4: 900, w5: 720, why: 'Lowest value per new patient ($650).' },
  { name: 'Meta · $99 new-patient exam', w4: 1050, w5: 840, why: 'Audience test: no clear difference.' },
  { name: 'Meta · Retargeting', w4: 450, w5: 360, why: 'Frequency 9.1; audience worn out.' },
];
export const budgetCap = 20; // ± % per campaign per week
/** Exact change in % (12.3 for implants); the label rounds it. */
export const budgetPct = (r: BudgetRow) => ((r.w5 - r.w4) / r.w4) * 100;
export const pctLabel = (pct: number) => {
  const p = Math.round(pct);
  return p === 0 ? '0%' : `${p > 0 ? '+' : '−'}${Math.abs(p)}%`;
};
export const budgetTotal = { w4: budget.reduce((t, r) => t + r.w4, 0), w5: budget.reduce((t, r) => t + r.w5, 0) }; // 6,000 / 6,000
export const guardrailOk = 'All changes within ±20% · weekly total unchanged';
export const queued = { lead: 'Queued for week 6:', text: 'Dentist near me +12.5% to $2,160 (guardrail)' };

// ---------------------------------------------------------------- Trend (step 7)
export const weeks = [35, 36, 36, 37, 37, 38, 38, 39].map((bookings, i) => ({ week: i + 1, spend: 6000, bookings }));
export const weeklyCpb = weeks.map((w) => w.spend / w.bookings); // 171.43 … 153.85
export const trendTitle = 'Cost per new-patient booking · weekly';
export const trendFinding = 'Cost per new-patient booking fell from $171 in week 1 to $154 in week 8, at the same $6,000 a week.';

// ---------------------------------------------------------------- Feed
export const guardrails = {
  title: 'Guardrails',
  by: 'set by Stillbrook',
  rules: [
    { icon: 'sliders-horizontal', text: 'Budget changes: max ±20% per campaign per week' },
    { icon: 'dollar-sign', text: 'Weekly total stays at $6,000' },
    { icon: 'user-check', text: 'New ads use pre-approved claims; Jess approves new creative', human: true },
    { icon: 'lock', text: 'No patient data is sent to ad platforms' },
  ],
} as const;

export const report = {
  title: 'Week 8 report',
  to: 'for Dr. Park',
  lines: [
    { text: '39 new-patient bookings at $154 each (week 1: 35 at $171). Same $6,000 a week.' },
    { lead: 'What worked:', text: 'cutting search waste and moving budget to the lowest cost per booking.' },
    { lead: 'Still testing:', text: 'the “Same-Week Appointments” headline and the implant consult page.' },
    { lead: 'Next:', text: 'a Saturday-hours message for Eastgate.' },
  ],
};

// ---------------------------------------------------------------- Result card (DEMOS.md §4 "Result card")
/** Keeps source ids whole: a word joiner (U+2060) after the hyphen stops a break at "mkt-" (as in
 *  customer-demo.ts and ConsultingDemo.astro). */
const ids = (s: string) => s.replace(/\b([a-z]+)-(\d+)\b/g, '$1-⁠$2');
export const resultMetrics = [
  {
    value: '$4,364', unit: 'per 4 weeks', label: 'Waste found in a 6-minute audit',
    basis: ids('Broad-match terms $2,132 + tired creative $1,336 + out-of-area clicks $896: 18% of spend (mkt-19).'),
  },
  {
    value: '$171 → $154', label: 'Cost per new patient, week 1 vs. week 8 (−10%)',
    basis: ids('Fixed $6,000 a week; 35 → 39 bookings; matches a 10% modeled gain from 8 weeks of tuning (mkt-19, mkt-01).'),
  },
  {
    value: '+4', unit: 'a week', label: 'New patients, same budget',
    basis: ids('≈ $5,120 contribution per 4 weeks: 16 patients × $800 first-year collections × 40% (cx-31, pnl-10).'),
  },
];
export const resultNote = 'Every budget move stayed within ±20% a week.';
export const microcopy = `Simulated demo. ${business} and the people named are fictional. Figures are illustrative.`;
