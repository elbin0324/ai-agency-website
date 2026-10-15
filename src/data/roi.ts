// OWNER: results (calculator)
// Value calculator: a multi-lever model (founder decisions 2026-10-14 in content/DECISIONS.md).
// Dependency-free on purpose (no imports, no enums) so Node and the browser bundle can both use it.
//
// Five levers, each a range from LOW = the base column of content/BENCHMARKS.md's assumption tables
// to HIGH = the optimistic column. Nothing goes beyond the optimistic column. Every output is a
// "Modeled estimate", in PROFIT terms: the value of staff time at the loaded cost the visitor enters,
// ad spend freed up, or gross profit. Added revenue is reported separately, as context, and is never
// part of a total.
//
//   time        team x min(repetitive h x share agents take on x 80% after review, evidence ceiling)
//               x 50 weeks / 12 -> hours a month (rounded down); value = hours x 12 x loaded cost
//   customers   inquiries x after-hours-or-missed share x new-business share x lost-for-good share
//               x booking rate -> jobs a month; x 12 x job value = added revenue; x gross margin =
//               added gross profit. Plus staff time: inquiries x AI-resolved share x minutes x 80%.
//   marketing   ad spend x 12 x CPL/CPA reduction (spend freed up; reallocate it or keep it)
//   sales       prospects x 12 x positive replies per 1,000 x meeting x opportunity x close rates
//               x first-year deal value = added revenue; x gross margin = added gross profit
//   consulting  revenue x price realization + (revenue x (100% - gross margin)) x vendor savings
//
// Rounding: every step is rounded DOWN to the precision the math panel shows (counts to 0.1, hours
// and dollars to whole numbers), so a visitor can redo each line from the numbers on screen and the
// rounding never inflates a result.
//
// Defaults describe a believable mid-size business (about 50 staff, $12M revenue). The legacy
// exports (roiInputs, computeRoi, roiAssumptions, roiDisclaimer, roiExamples) keep their shapes;
// computeRoi is now the LOW case of the time lever plus the customer lever's staff time, so the
// contact form's recomputed "hours back" matches the calculator.

// ---------------------------------------------------------------------------------------------
// Contract types (shared with other areas; keep in sync with the brief)
// ---------------------------------------------------------------------------------------------

export type LeverId = 'time' | 'customers' | 'marketing' | 'sales' | 'consulting';
/** low = BENCHMARKS.md base values, high = optimistic values */
export type Range = { low: number; high: number };
export type LeverInputs = {
  teamSize: number; hourlyCost: number; repetitiveHours: number; // time: people, $/h loaded, h/person/week
  monthlyInquiries: number; afterHoursShare: number; avgJobValue: number; grossMargin: number; // customers (% as 0-100)
  monthlyAdSpend: number; // marketing, $/month
  prospectsPerMonth: number; avgDealValue: number; // sales outreach
  annualRevenue: number; operatingMargin: number; // consulting (% as 0-100)
};
export type LeverResult = {
  id: LeverId;
  label: string;
  kind: 'time value' | 'cost saved' | 'added gross profit';
  /** $/year in profit terms (never revenue) */
  value: Range;
  /** shown as context, never added to the total */
  addedRevenue?: Range;
  hoursPerMonth?: Range;
  math: { label: string; value: string }[];
  sources: string[];
};
export type LeverInputMeta = { label: string; unit: string; min: number; max: number; step: number; help: string; lever: LeverId };

/** Canonical lever order (calculator sections, chart rows, URL lists). */
export const leverIds: LeverId[] = ['time', 'customers', 'marketing', 'sales', 'consulting'];

// ---------------------------------------------------------------------------------------------
// Rates: copied from content/BENCHMARKS.md "Recommended model assumptions" (base -> optimistic).
// ---------------------------------------------------------------------------------------------

export type LeverRate = { low: number; high: number; label: string; unit: string; lever: LeverId; sources: string[] };

export const leverRates = {
  coverage: { low: 50, high: 75, unit: '%', lever: 'time', label: 'Share of the repetitive work agents take on (coverage of eligible task volume)', sources: ['ai-15', 'ai-21', 'ai-22'] },
  ceiling: { low: 2, high: 4.9, unit: 'hours per person per week', lever: 'time', label: 'Evidence ceiling on routine-admin hours returned per worker, all agent tasks combined', sources: ['time-01', 'ai-15', 'time-05'] },
  resolution: { low: 20, high: 35, unit: '%', lever: 'customers', label: 'Inquiries an AI agent resolves end to end without staff (phone rates, applied to every channel)', sources: ['cx-16', 'cx-09', 'cx-10'] },
  minutes: { low: 5, high: 7, unit: 'minutes', lever: 'customers', label: 'Staff minutes per routine inquiry, including wrap-up and logging', sources: ['cx-34', 'cx-10'] },
  newBusiness: { low: 30, high: 38, unit: '%', lever: 'customers', label: 'Share of inquiries that are new-business opportunities', sources: ['cx-23', 'cx-26'] },
  lost: { low: 40, high: 60, unit: '%', lever: 'customers', label: 'Missed new-business opportunities lost for good without an instant answer', sources: ['cx-21', 'cx-26'] },
  booking: { low: 40, high: 60, unit: '%', lever: 'customers', label: 'Booking rate when a new-business lead reaches someone promptly', sources: ['cx-25', 'cx-23', 'cx-24', 'cx-26'] },
  cpl: { low: 10, high: 20, unit: '%', lever: 'marketing', label: 'Cost per lead or acquisition reduction from 60 to 90 days of disciplined optimization', sources: ['mkt-19', 'mkt-25', 'mkt-24', 'mkt-15', 'mkt-16', 'mkt-14', 'mkt-01'] },
  moreLeads: { low: 11, high: 25, unit: '%', lever: 'marketing', label: 'Extra leads at the same budget from the same optimization (1 / (1 - reduction) - 1)', sources: ['mkt-19', 'mkt-01'] },
  replies: { low: 3.5, high: 6, unit: 'per 1,000 prospects', lever: 'sales', label: 'Positive replies from researched, quality-first outreach', sources: ['sales-07', 'sales-08', 'sales-09', 'sales-10', 'sales-01'] },
  meeting: { low: 20, high: 25, unit: '%', lever: 'sales', label: 'Positive replies that become a held meeting', sources: ['sales-04', 'sales-05', 'sales-09', 'sales-22'] },
  opportunity: { low: 40, high: 45, unit: '%', lever: 'sales', label: 'Held meetings that become a qualified opportunity or proposal', sources: ['sales-22'] },
  close: { low: 20, high: 30, unit: '%', lever: 'sales', label: 'Opportunities or proposals closed and won', sources: ['sales-23', 'sales-24', 'sales-22', 'sales-25'] },
  price: { low: 0.5, high: 1, unit: '% of revenue', lever: 'consulting', label: 'Realized price improvement from quote and discount discipline', sources: ['pnl-01', 'pnl-30'] },
  vendor: { low: 0.75, high: 1.5, unit: '% of purchases', lever: 'consulting', label: 'Vendor and materials renegotiation savings', sources: ['pnl-18', 'pnl-17'] },
} satisfies Record<string, LeverRate>;

/** Fixed model constants (same in the low and the high case). */
export const leverConstants = {
  reviewPct: 20, // % of agent-handled work set aside for human review
  weeksPerYear: 50,
  monthsPerYear: 12,
  fteHoursPerYear: 1880,
  dealMonths: 12, // first-year deal value only
};

// ---------------------------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------------------------

export const leverDefaults: LeverInputs = {
  teamSize: 25,
  hourlyCost: 30,
  repetitiveHours: 7,
  monthlyInquiries: 800,
  afterHoursShare: 30,
  avgJobValue: 600,
  grossMargin: 40,
  monthlyAdSpend: 10000,
  prospectsPerMonth: 1000,
  avgDealValue: 25000,
  annualRevenue: 12000000,
  operatingMargin: 8,
};

export const leverInputMeta: Record<keyof LeverInputs, LeverInputMeta> = {
  teamSize: {
    lever: 'time', label: 'People in desk or customer-facing roles', unit: 'people', min: 1, max: 500, step: 1,
    help: 'Office, admin, customer service, sales and management staff. Leave out roles that are almost all hands-on, like field technicians or kitchen staff.',
  },
  hourlyCost: {
    lever: 'time', label: 'Average loaded cost per hour', unit: '$ per hour', min: 15, max: 150, step: 1,
    help: 'Hourly pay plus payroll taxes and benefits. If you only know the wage, multiply it by 1.4. $30 is the typical loaded cost of routine office work at a business with 50 or more staff.',
  },
  repetitiveHours: {
    lever: 'time', label: 'Hours per person each week on repetitive tasks', unit: 'hours per week', min: 1, max: 20, step: 1,
    help: 'Routine email, data entry, copying between systems, scheduling and follow-ups. Leave out time spent answering customers; the customer lever counts that.',
  },
  monthlyInquiries: {
    lever: 'customers', label: 'Customer inquiries per month', unit: 'per month', min: 0, max: 20000, step: 50,
    help: 'Calls, chats, emails, texts and web forms from customers and prospects.',
  },
  afterHoursShare: {
    lever: 'customers', label: 'Share that arrive after hours or go unanswered', unit: '%', min: 0, max: 80, step: 5,
    help: 'Inquiries nobody answers within a few minutes: evenings, weekends and calls that ring out on busy days. One large booking platform saw 48% of online bookings made between 5 p.m. and 9 a.m.',
  },
  avgJobValue: {
    lever: 'customers', label: 'Average job or order value', unit: '$', min: 50, max: 50000, step: 50,
    help: 'Revenue from a typical new job, order or first visit. This is revenue; only your gross margin on it counts toward the total.',
  },
  grossMargin: {
    lever: 'customers', label: 'Gross margin', unit: '%', min: 5, max: 90, step: 1,
    help: 'Revenue minus the direct cost of delivering it, as a share of revenue. New jobs and deals count only at this margin, and the pricing and vendors lever uses it to size your cost of sales.',
  },
  monthlyAdSpend: {
    lever: 'marketing', label: 'Monthly ad spend', unit: '$ per month', min: 0, max: 500000, step: 500,
    help: 'Google, Meta, Microsoft and other paid media. Leave out agency fees and creative costs.',
  },
  prospectsPerMonth: {
    lever: 'sales', label: 'New prospects contacted per month', unit: 'per month', min: 0, max: 5000, step: 50,
    help: 'Businesses that fit your ideal customer, each researched and emailed by the Sales Agent. We plan about 300 a month per sending mailbox to protect deliverability.',
  },
  avgDealValue: {
    lever: 'sales', label: 'Average first-year deal value', unit: '$', min: 500, max: 500000, step: 500,
    help: 'What a new account brings in during its first year. We count only year one, even when accounts renew.',
  },
  annualRevenue: {
    lever: 'consulting', label: 'Annual revenue', unit: '$ per year', min: 250000, max: 250000000, step: 50000,
    help: 'Last year’s total revenue. The pricing and vendor levers are sized against it.',
  },
  operatingMargin: {
    lever: 'consulting', label: 'Operating margin', unit: '%', min: 1, max: 40, step: 1,
    help: 'Operating profit as a share of revenue, before interest and taxes. Shows what the margin gain means for your profit.',
  },
};

export const leverInputKeys = Object.keys(leverDefaults) as (keyof LeverInputs)[];

/** URL parameter for each input. The first four are the legacy names the contact form already reads. */
export const leverParamNames: Record<keyof LeverInputs, string> = {
  teamSize: 'team',
  hourlyCost: 'hourly',
  repetitiveHours: 'hours',
  monthlyInquiries: 'inquiries',
  afterHoursShare: 'after',
  avgJobValue: 'job',
  grossMargin: 'margin',
  monthlyAdSpend: 'ads',
  prospectsPerMonth: 'prospects',
  avgDealValue: 'deal',
  annualRevenue: 'revenue',
  operatingMargin: 'opmargin',
};

/** Clamp to [min, max] and snap to the step; missing or invalid values fall back to the default. */
export function sanitizeLeverValue(key: keyof LeverInputs, raw: unknown): number {
  const m = leverInputMeta[key];
  const n = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN;
  const base = Number.isFinite(n) ? n : leverDefaults[key];
  const snapped = Math.round(base / m.step) * m.step;
  return Math.min(m.max, Math.max(m.min, snapped));
}

export function sanitizeLeverInputs(inputs: Partial<LeverInputs> = {}): LeverInputs {
  const out = { ...leverDefaults };
  for (const key of leverInputKeys) out[key] = sanitizeLeverValue(key, inputs[key]);
  return out;
}

// ---------------------------------------------------------------------------------------------
// Formatting for the math lines (en-US, deterministic; no imports)
// ---------------------------------------------------------------------------------------------

const fmt = (v: number, d = 0) => v.toLocaleString('en-US', { maximumFractionDigits: d });
const usd = (v: number) => `$${fmt(v)}`;
const pct = (v: number) => `${fmt(v, 2)}%`;
const both = (lo: string, hi: string) => (lo === hi ? lo : `${lo} to ${hi}`);
const r$ = (r: Range) => both(usd(r.low), usd(r.high));
const rN = (r: Range, d = 1) => both(fmt(r.low, d), fmt(r.high, d));
const rP = (r: Range) => both(pct(r.low), pct(r.high));
const rate = (r: { low: number; high: number }): Range => ({ low: r.low, high: r.high });

/** Round down to d decimals; the epsilon keeps 2.8 from becoming 2.7999… */
const down = (x: number, d = 0) => {
  const f = 10 ** d;
  return Math.floor(x * f + 1e-7) / f;
};
const map = (r: Range, f: (v: number, side: 'low' | 'high') => number): Range => ({ low: f(r.low, 'low'), high: f(r.high, 'high') });
const add = (...rs: Range[]): Range => ({ low: rs.reduce((s, r) => s + r.low, 0), high: rs.reduce((s, r) => s + r.high, 0) });
const zero = (): Range => ({ low: 0, high: 0 });

// ---------------------------------------------------------------------------------------------
// Levers
// ---------------------------------------------------------------------------------------------

const C = leverConstants;
const keepPct = 100 - C.reviewPct; // 80

type TimeParts = { perRaw: Range; perPerson: Range; capped: { low: boolean; high: boolean }; hours: Range; value: Range };

function timeParts(i: LeverInputs, cov: Range = rate(leverRates.coverage), ceiling: Range = rate(leverRates.ceiling)): TimeParts {
  const perRaw = map(cov, (c) => down((i.repetitiveHours * c * keepPct) / (100 * 100), 1));
  const perPerson: Range = { low: Math.min(perRaw.low, ceiling.low), high: Math.min(perRaw.high, ceiling.high) };
  const hours = map(perPerson, (p) => down((i.teamSize * p * C.weeksPerYear) / C.monthsPerYear));
  const value = map(hours, (h) => h * C.monthsPerYear * i.hourlyCost);
  return { perRaw, perPerson, capped: { low: perRaw.low > ceiling.low, high: perRaw.high > ceiling.high }, hours, value };
}

function timeLever(i: LeverInputs): LeverResult {
  const cov = rate(leverRates.coverage);
  const ceiling = rate(leverRates.ceiling);
  const t = timeParts(i, cov, ceiling);
  const capNote = t.capped.low && t.capped.high ? 'both cases capped' : t.capped.low ? 'base case capped' : t.capped.high ? 'upside capped' : 'under the cap';
  return {
    id: 'time',
    label: 'Team time',
    kind: 'time value',
    value: t.value,
    hoursPerMonth: t.hours,
    math: [
      { label: 'Repetitive work agents take on, after 20% human review', value: `${fmt(i.repetitiveHours)} h × ${rP(cov)} × ${keepPct}% = ${rN(t.perRaw)} h a week per person` },
      { label: 'Evidence ceiling per person', value: `${rN(ceiling)} h a week (${capNote}) → ${rN(t.perPerson)} h` },
      { label: 'Team hours back a month', value: `${fmt(i.teamSize)} people × ${rN(t.perPerson)} h × ${C.weeksPerYear} weeks ÷ 12 = ${rN(t.hours, 0)} h` },
      { label: 'Value of that time a year', value: `${rN(t.hours, 0)} h × 12 × ${usd(i.hourlyCost)} = ${r$(t.value)}` },
    ],
    sources: ['lab-01', 'lab-06', ...leverRates.coverage.sources, 'time-01', 'time-05', 'ai-20'],
  };
}

type CustomerParts = { missed: number; newBiz: Range; lost: Range; booked: Range; revenue: Range; profit: Range; resolved: Range; staffHours: Range; staffValue: Range; value: Range };

function customerParts(i: LeverInputs): CustomerParts {
  const missed = down((i.monthlyInquiries * i.afterHoursShare) / 100, 1);
  const newBiz = map(rate(leverRates.newBusiness), (r) => down((missed * r) / 100, 1));
  const lostR = rate(leverRates.lost);
  const lost = { low: down((newBiz.low * lostR.low) / 100, 1), high: down((newBiz.high * lostR.high) / 100, 1) };
  const bookR = rate(leverRates.booking);
  const booked = { low: down((lost.low * bookR.low) / 100, 1), high: down((lost.high * bookR.high) / 100, 1) };
  const revenue = map(booked, (b) => down(b * C.monthsPerYear * i.avgJobValue));
  const profit = map(revenue, (r) => down((r * i.grossMargin) / 100));
  const resolved = map(rate(leverRates.resolution), (r) => down((i.monthlyInquiries * r) / 100, 1));
  const minR = rate(leverRates.minutes);
  const staffHours = { low: down((resolved.low * minR.low * keepPct) / (60 * 100)), high: down((resolved.high * minR.high * keepPct) / (60 * 100)) };
  const staffValue = map(staffHours, (h) => h * C.monthsPerYear * i.hourlyCost);
  return { missed, newBiz, lost, booked, revenue, profit, resolved, staffHours, staffValue, value: add(profit, staffValue) };
}

function customersLever(i: LeverInputs): LeverResult {
  const p = customerParts(i);
  return {
    id: 'customers',
    label: 'Customer inquiries',
    kind: 'added gross profit',
    value: p.value,
    addedRevenue: p.revenue,
    hoursPerMonth: p.staffHours,
    math: [
      { label: 'Inquiries after hours or unanswered', value: `${fmt(i.monthlyInquiries)} × ${pct(i.afterHoursShare)} = ${fmt(p.missed, 1)} a month` },
      { label: 'New-business opportunities among them', value: `× ${rP(rate(leverRates.newBusiness))} = ${rN(p.newBiz)}` },
      { label: 'Lost for good without an instant answer', value: `× ${rP(rate(leverRates.lost))} = ${rN(p.lost)}` },
      { label: 'Booked when the agent answers at once', value: `× ${rP(rate(leverRates.booking))} = ${rN(p.booked)} jobs a month` },
      { label: 'Added revenue a year (context, not in the total)', value: `${rN(p.booked)} × 12 × ${usd(i.avgJobValue)} = ${r$(p.revenue)}` },
      { label: 'Added gross profit a year', value: `${r$(p.revenue)} × ${pct(i.grossMargin)} = ${r$(p.profit)}` },
      { label: 'Routine inquiries resolved without staff', value: `${fmt(i.monthlyInquiries)} × ${rP(rate(leverRates.resolution))} = ${rN(p.resolved)} a month` },
      { label: 'Staff time back, after 20% review', value: `${rN(p.resolved)} × ${rN(rate(leverRates.minutes))} min ÷ 60 × ${keepPct}% = ${rN(p.staffHours, 0)} h a month` },
      { label: 'Value of that time a year', value: `${rN(p.staffHours, 0)} h × 12 × ${usd(i.hourlyCost)} = ${r$(p.staffValue)}` },
    ],
    sources: ['cx-27', ...leverRates.newBusiness.sources, 'cx-21', 'cx-25', 'cx-24', ...leverRates.resolution.sources, 'cx-34', 'pnl-16'],
  };
}

function marketingLever(i: LeverInputs): LeverResult {
  const annual = i.monthlyAdSpend * C.monthsPerYear;
  const cpl = rate(leverRates.cpl);
  const freed = map(cpl, (r) => down((annual * r) / 100));
  return {
    id: 'marketing',
    label: 'Ad spend',
    kind: 'cost saved',
    value: freed,
    math: [
      { label: 'Ad spend a year', value: `${usd(i.monthlyAdSpend)} × 12 = ${usd(annual)}` },
      { label: 'Same leads for less: cost per lead down', value: `${rP(cpl)} after 60 to 90 days of testing and reallocation` },
      { label: 'Budget freed to reallocate, a year', value: `${usd(annual)} × ${rP(cpl)} = ${r$(freed)}` },
      { label: 'Or keep spending the same', value: `about ${rP(rate(leverRates.moreLeads))} more leads instead (not added on top)` },
    ],
    sources: leverRates.cpl.sources,
  };
}

type SalesParts = { prospects: number; replies: Range; meetings: Range; opps: Range; deals: Range; revenue: Range; profit: Range };

function salesParts(i: LeverInputs): SalesParts {
  const prospects = i.prospectsPerMonth * C.monthsPerYear;
  const replies = map(rate(leverRates.replies), (r) => down((prospects * r) / 1000, 1));
  const step = (from: Range, r: Range): Range => ({ low: down((from.low * r.low) / 100, 1), high: down((from.high * r.high) / 100, 1) });
  const meetings = step(replies, rate(leverRates.meeting));
  const opps = step(meetings, rate(leverRates.opportunity));
  const deals = step(opps, rate(leverRates.close));
  const revenue = map(deals, (d) => down(d * i.avgDealValue));
  const profit = map(revenue, (r) => down((r * i.grossMargin) / 100));
  return { prospects, replies, meetings, opps, deals, revenue, profit };
}

function salesLever(i: LeverInputs): LeverResult {
  const s = salesParts(i);
  return {
    id: 'sales',
    label: 'Sales outreach',
    kind: 'added gross profit',
    value: s.profit,
    addedRevenue: s.revenue,
    math: [
      { label: 'Prospects researched and emailed a year', value: `${fmt(i.prospectsPerMonth)} × 12 = ${fmt(s.prospects)}` },
      { label: 'Positive replies', value: `${rN(rate(leverRates.replies))} per 1,000 = ${rN(s.replies)}` },
      { label: 'Meetings held', value: `× ${rP(rate(leverRates.meeting))} = ${rN(s.meetings)}` },
      { label: 'Qualified opportunities', value: `× ${rP(rate(leverRates.opportunity))} = ${rN(s.opps)}` },
      { label: 'New deals won', value: `× ${rP(rate(leverRates.close))} = ${rN(s.deals)} a year` },
      { label: 'Added revenue, first year (context, not in the total)', value: `${rN(s.deals)} × ${usd(i.avgDealValue)} = ${r$(s.revenue)}` },
      { label: 'Added gross profit a year', value: `${r$(s.revenue)} × ${pct(i.grossMargin)} = ${r$(s.profit)}` },
    ],
    sources: [...leverRates.replies.sources, 'sales-04', 'sales-05', 'sales-22', 'sales-23', 'sales-24', 'pnl-16'],
  };
}

type ConsultingParts = { pricing: Range; purchases: number; vendor: Range; value: Range; points: Range; profit: number; uplift: Range };

function consultingParts(i: LeverInputs): ConsultingParts {
  const pricing = map(rate(leverRates.price), (r) => down((i.annualRevenue * r) / 100));
  const purchases = down((i.annualRevenue * (100 - i.grossMargin)) / 100);
  const vendor = map(rate(leverRates.vendor), (r) => down((purchases * r) / 100));
  const value = add(pricing, vendor);
  const points = map(value, (v) => down((v / i.annualRevenue) * 100, 2));
  const profit = down((i.annualRevenue * i.operatingMargin) / 100);
  const uplift = map(value, (v) => (profit > 0 ? down((v / profit) * 100, 1) : 0));
  return { pricing, purchases, vendor, value, points, profit, uplift };
}

function consultingLever(i: LeverInputs): LeverResult {
  const c = consultingParts(i);
  return {
    id: 'consulting',
    label: 'Pricing and vendors',
    kind: 'added gross profit',
    value: c.value,
    math: [
      { label: 'Pricing: quote and discount discipline', value: `${usd(i.annualRevenue)} × ${rP(rate(leverRates.price))} = ${r$(c.pricing)}` },
      { label: 'Cost of sales, the spend vendors can touch (revenue less gross margin)', value: `${usd(i.annualRevenue)} × ${pct(100 - i.grossMargin)} = ${usd(c.purchases)}` },
      { label: 'Vendors and materials: renegotiation and rebids', value: `${usd(c.purchases)} × ${rP(rate(leverRates.vendor))} = ${r$(c.vendor)}` },
      { label: 'Margin gain', value: `${r$(c.value)} ÷ ${usd(i.annualRevenue)} = ${both(fmt(c.points.low, 2), fmt(c.points.high, 2))} points` },
      { label: 'What that does to operating profit', value: `${usd(c.profit)} today (${pct(i.operatingMargin)}) → up ${both(pct(c.uplift.low), pct(c.uplift.high))}` },
    ],
    sources: [...leverRates.price.sources, ...leverRates.vendor.sources, 'pnl-16', 'pnl-08'],
  };
}

const builders: Record<LeverId, (i: LeverInputs) => LeverResult> = {
  time: timeLever,
  customers: customersLever,
  marketing: marketingLever,
  sales: salesLever,
  consulting: consultingLever,
};

/**
 * Every enabled lever (all five when `enabled` is omitted), in canonical order, plus the totals over
 * those levers. Totals are profit terms only; addedRevenue is context (customers + sales).
 */
export function computeLevers(
  inputs: Partial<LeverInputs>,
  enabled?: LeverId[],
): { levers: LeverResult[]; total: Range; addedRevenue: Range; hoursPerMonth: Range } {
  const i = sanitizeLeverInputs(inputs);
  const on = enabled ? leverIds.filter((id) => enabled.includes(id)) : leverIds;
  const levers = on.map((id) => builders[id](i));
  return {
    levers,
    total: add(zero(), ...levers.map((l) => l.value)),
    addedRevenue: add(zero(), ...levers.map((l) => l.addedRevenue ?? zero())),
    hoursPerMonth: add(zero(), ...levers.map((l) => l.hoursPerMonth ?? zero())),
  };
}

/** Full-time equivalents for a number of hours a month, rounded down to one decimal. */
export const fteFromHours = (hoursPerMonth: number) => down((hoursPerMonth * C.monthsPerYear) / C.fteHoursPerYear, 1);

/** Footnote every modeled figure carries (DESIGN.md §6.4). */
export const leverFootnote = 'Not a quote or a guarantee. Estimates exclude the cost of the engagement.';

export const leverDisclaimer =
  'Modeled estimate, not a quote, a guarantee or a client result. Each range runs from the base rates in our research (low) to the optimistic rates (high), and never beyond them. Totals count profit only: staff time at the loaded hourly cost you enter, ad budget freed to reallocate, and gross profit on new jobs, deals and better prices. Added revenue is shown for context and never added to a total. The estimates assume the agents are fully up and running, so year one will be lower while they ramp up, and they exclude the cost of the engagement. Your results depend on your processes, systems and data. In a free assessment, we replace these assumptions with your real numbers.';

// ---------------------------------------------------------------------------------------------
// Legacy API (kept for the contact form, the methodology table and anything else that imports it)
// ---------------------------------------------------------------------------------------------

export type RoiInput = {
  id: string;
  label: string;
  unit: string;
  default: number;
  min: number;
  max: number;
  step: number;
  help: string;
};

const legacy = (id: keyof LeverInputs): RoiInput => {
  const m = leverInputMeta[id];
  return { id, label: m.label, unit: m.unit, default: leverDefaults[id], min: m.min, max: m.max, step: m.step, help: m.help };
};

/**
 * The time-and-inquiries inputs under their old ids. `aiSharePct` is the time lever's coverage
 * (the low case uses 50%); the calculator sends share=50 so the contact form's recompute matches.
 */
export const roiInputs: RoiInput[] = [
  legacy('teamSize'),
  legacy('hourlyCost'),
  legacy('repetitiveHours'),
  {
    id: 'aiSharePct',
    label: 'Share of those tasks agents take on',
    unit: '%',
    default: leverRates.coverage.low,
    min: 10,
    max: leverRates.coverage.high,
    step: 5,
    help: 'Agents take over specific workflows, not whole jobs. The low case uses 50% and the high case 75%, and each person is capped at the hours a week the research supports.',
  },
  legacy('monthlyInquiries'),
];

/** Methodology table rows (one value each, the low case; the high case is in the label). */
export const roiAssumptions: { id: string; label: string; value: number; unit: string; sources: string[] }[] = [
  { id: 'coveragePct', label: 'Share of the repetitive work agents take on (high case: 75%)', value: leverRates.coverage.low, unit: '% of repetitive hours', sources: leverRates.coverage.sources },
  { id: 'reviewAllowancePct', label: 'Human review allowance, subtracted from the hours agents take on', value: C.reviewPct, unit: '% of agent-handled hours', sources: ['ai-20', 'ai-21'] },
  { id: 'perPersonCeiling', label: 'Evidence ceiling on routine-admin hours returned per worker, all agent tasks combined (high case: 4.9)', value: leverRates.ceiling.low, unit: 'hours per worker per week', sources: leverRates.ceiling.sources },
  { id: 'weeksPerYear', label: 'Weeks per year the repetitive tasks recur (annualizing weekly hours)', value: C.weeksPerYear, unit: 'weeks per year', sources: ['lab-06', 'lab-09', 'lab-11'] },
  { id: 'defaultHourlyCost', label: 'Default loaded hourly cost: routine office and admin work at 50+ staff (median wage × 1.40)', value: leverDefaults.hourlyCost, unit: '$ per hour worked', sources: ['lab-01', 'lab-06'] },
  { id: 'fteHoursPerYear', label: 'Hours actually worked per full-time employee per year (for FTE capacity)', value: C.fteHoursPerYear, unit: 'hours per year', sources: ['lab-04', 'lab-05', 'lab-11'] },
  { id: 'aiResolutionPct', label: 'Inquiries an AI agent resolves end to end without staff: phone rates applied to every channel (high case: 35%)', value: leverRates.resolution.low, unit: '% of inquiries', sources: leverRates.resolution.sources },
  { id: 'minutesPerInquiry', label: 'Staff minutes per routine inquiry, including wrap-up and logging (high case: 7)', value: leverRates.minutes.low, unit: 'minutes per inquiry', sources: leverRates.minutes.sources },
  { id: 'newBusinessPct', label: 'Inquiries that are new-business opportunities (high case: 38%)', value: leverRates.newBusiness.low, unit: '% of inquiries', sources: leverRates.newBusiness.sources },
  { id: 'lostPct', label: 'Missed opportunities lost for good without an instant answer (high case: 60%)', value: leverRates.lost.low, unit: '% of missed opportunities', sources: leverRates.lost.sources },
  { id: 'bookingPct', label: 'Booking rate when a lead reaches someone promptly (high case: 60%)', value: leverRates.booking.low, unit: '% of leads', sources: leverRates.booking.sources },
  { id: 'afterHoursDefault', label: 'Default share of inquiries that arrive after hours or go unanswered (you can change it)', value: leverDefaults.afterHoursShare, unit: '% of inquiries', sources: ['cx-27', 'cx-21', 'cx-26'] },
  { id: 'grossMarginDefault', label: 'Default gross margin: the base case for service-and-repair work (you can change it)', value: leverDefaults.grossMargin, unit: '% of revenue', sources: ['pnl-16'] },
  { id: 'cplReductionPct', label: 'Cost per lead reduction from 60 to 90 days of disciplined optimization (high case: 20%)', value: leverRates.cpl.low, unit: '% of ad spend', sources: leverRates.cpl.sources },
  { id: 'positiveReplies', label: 'Positive replies to researched outreach (high case: 60)', value: leverRates.replies.low * 10, unit: 'per 10,000 prospects', sources: leverRates.replies.sources },
  { id: 'meetingPct', label: 'Positive replies that become a held meeting (high case: 25%)', value: leverRates.meeting.low, unit: '% of positive replies', sources: leverRates.meeting.sources },
  { id: 'opportunityPct', label: 'Held meetings that become a qualified opportunity (high case: 45%)', value: leverRates.opportunity.low, unit: '% of meetings', sources: leverRates.opportunity.sources },
  { id: 'closePct', label: 'Opportunities closed and won (high case: 30%)', value: leverRates.close.low, unit: '% of opportunities', sources: leverRates.close.sources },
  { id: 'priceRealization', label: 'Realized price improvement, 0.5% of revenue (high case: 1%, or $100)', value: leverRates.price.low * 100, unit: '$ per $10,000 of revenue', sources: leverRates.price.sources },
  { id: 'vendorSavings', label: 'Vendor and materials savings, 0.75% of cost of sales (high case: 1.5%, or $150)', value: leverRates.vendor.low * 100, unit: '$ per $10,000 of cost of sales', sources: leverRates.vendor.sources },
  { id: 'operatingMarginDefault', label: 'Default operating margin, before interest and taxes (you can change it)', value: leverDefaults.operatingMargin, unit: '% of revenue', sources: ['pnl-08', 'pnl-16'] },
];

export type RoiResult = {
  hoursPerMonth: number;
  annualValue: number;
  fteCapacity: number;
  breakdown: { id: string; label: string; hoursPerMonth: number; annualValue: number }[];
};

/**
 * Legacy single-number estimate: the LOW case of the time lever (aiSharePct as the coverage, capped
 * at the base evidence ceiling) plus the customer lever's low-case staff time. With share = 50 it
 * returns exactly the calculator's low-case hours and their value.
 */
export function computeRoi(values: Record<string, number>): RoiResult {
  const i = sanitizeLeverInputs(values as Partial<LeverInputs>);
  const shareSpec = roiInputs.find((s) => s.id === 'aiSharePct')!;
  const rawShare = Number(values.aiSharePct);
  const share = Math.min(shareSpec.max, Math.max(shareSpec.min, Math.round((Number.isFinite(rawShare) ? rawShare : shareSpec.default) / shareSpec.step) * shareSpec.step));
  const t = timeParts(i, { low: share, high: share }, rate(leverRates.ceiling));
  const c = customerParts(i);
  const tasks = t.hours.low;
  const inquiries = c.staffHours.low;
  const yearly = (h: number) => h * C.monthsPerYear * i.hourlyCost;
  const hoursPerMonth = tasks + inquiries;
  return {
    hoursPerMonth,
    annualValue: yearly(hoursPerMonth),
    fteCapacity: fteFromHours(hoursPerMonth),
    breakdown: [
      { id: 'repetitiveTasks', label: 'Repetitive desk tasks handed to agents, after human review', hoursPerMonth: tasks, annualValue: yearly(tasks) },
      { id: 'customerInquiries', label: 'Routine customer inquiries resolved by an AI agent without staff', hoursPerMonth: inquiries, annualValue: yearly(inquiries) },
    ],
  };
}

export const roiDisclaimer = leverDisclaimer;

const exampleInputs: { name: string; inputs: Record<string, number> }[] = [
  { name: 'Small business: 8-person professional office', inputs: { teamSize: 8, hourlyCost: 29, repetitiveHours: 7, aiSharePct: 50, monthlyInquiries: 300 } },
  { name: 'Mid-size business: 25 desk staff in a 50-person company', inputs: { teamSize: 25, hourlyCost: 30, repetitiveHours: 7, aiSharePct: 50, monthlyInquiries: 800 } },
  { name: 'Larger business: 120 desk staff at a regional company', inputs: { teamSize: 120, hourlyCost: 30, repetitiveHours: 6, aiSharePct: 50, monthlyInquiries: 2600 } },
];

export const roiExamples: { name: string; inputs: Record<string, number>; result: RoiResult }[] = exampleInputs.map((e) => ({
  ...e,
  result: computeRoi(e.inputs),
}));
