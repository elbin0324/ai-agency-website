// OWNER: pages-misc
// The free-assessment intake: every question, its options and the number each answer stands for in the
// value model (@/data/roi computeLevers). Shared by the form markup (ContactForm.astro, server render)
// and the client script (intake-client.ts: estimate, summary, calculator prefill), so the labels a visitor
// picks, the values the model gets and the summary we receive can never drift apart.
//
// Option values are the readable labels on purpose: a form sent without JavaScript (mailto or a plain
// POST) still arrives as "Team size: 20 to 49 people", not as codes.
//
// Representative numbers (`n`) sit toward the LOW end of each range, so a range answer never inflates
// the estimate. `n: null` means "Not sure": the model then uses its typical value (leverDefaults) and
// the panel says so.

export type Option = { label: string; n?: number | null; sub?: string };

export const NOT_SURE = 'Not sure';

/** `left` is the time still ahead when a step opens (about 4 minutes in all), shown beside "Step 2 of 5". */
export const steps = [
  { id: 'business', title: 'Your business', short: 'Business', left: 'about 4 minutes', lead: 'The basics, so we can size the opportunity.' },
  { id: 'hours', title: 'Where the hours go', short: 'Hours', left: 'about 3 minutes left', lead: 'Rough is fine. Across your whole team, about how many hours a week go to each kind of work?' },
  { id: 'growth', title: 'Customers and growth', short: 'Growth', left: 'about 2 minutes left', lead: 'Skip anything you don’t know. A rough number beats a blank, but a blank is fine.' },
  { id: 'priorities', title: 'Priorities', short: 'Priorities', left: 'about a minute left', lead: 'What matters most, and what you’d want off your plate first.' },
  { id: 'contact', title: 'How we reach you', short: 'Contact', left: 'last step', lead: 'We reply within one business day.' },
] as const;
export type StepId = (typeof steps)[number]['id'];

// ---- Step 1: your business ----
export const industries: Option[] = [
  'Home services', 'Dental, medical or vet', 'Law or accounting', 'Real estate', 'Restaurants and hospitality',
  'Retail and e-commerce', 'Distribution or manufacturing', 'Agency or professional services', 'Fitness and wellness',
  'Multi-location services', 'Other',
].map((label) => ({ label }));

/** Team size. `n` feeds the model's team size (people), toward the low end of each range. */
export const teamSizes: Option[] = [
  { label: '1 to 4 people', n: 3 },
  { label: '5 to 19 people', n: 8 },
  { label: '20 to 49 people', n: 25 },
  { label: '50 to 99 people', n: 60 },
  { label: '100 to 249 people', n: 120 },
  { label: '250 to 500 people', n: 300 },
  { label: 'More than 500 people', n: 500 },
];

/** Annual revenue (optional). `n` in dollars; null = not shared (the margin lever stays off). */
export const revenues: Option[] = [
  { label: 'Under $1 million', n: 500_000 },
  { label: '$1 to $5 million', n: 2_000_000 },
  { label: '$5 to $10 million', n: 6_000_000 },
  { label: '$10 to $25 million', n: 12_000_000 },
  { label: '$25 to $80 million', n: 35_000_000 },
  { label: 'More than $80 million', n: 80_000_000 },
  { label: 'Prefer not to say', n: null },
];

export const locations: Option[] = ['One', '2 to 5', '6 to 20', 'More than 20', 'Online only'].map((label) => ({ label }));

// ---- Step 2: where the hours go ----
export const workTypes = [
  { id: 'customers', name: 'hours_customers', label: 'Answering customers', hint: 'Calls, chats, emails, texts and web forms' },
  { id: 'inbox', name: 'hours_inbox', label: 'Inbox and scheduling', hint: 'Email triage and replies, calendars and booking' },
  { id: 'reporting', name: 'hours_reporting', label: 'Spreadsheets and reporting', hint: 'Data entry, reports, invoices and reconciling numbers' },
  { id: 'marketing', name: 'hours_marketing', label: 'Marketing and ads', hint: 'Campaigns, ad accounts, posts and reviews' },
  { id: 'sales', name: 'hours_sales', label: 'Sales follow-up', hint: 'Quotes, follow-ups, CRM updates and prospecting' },
] as const;
export type WorkTypeId = (typeof workTypes)[number]['id'];

/** Hours a week across the whole team. "Not sure" first: it is the default answer. */
export const hoursOptions: Option[] = [
  { label: NOT_SURE, n: null },
  { label: 'None', n: 0 },
  { label: 'Under 5 hours', n: 3 },
  { label: '5 to 15 hours', n: 10 },
  { label: '15 to 40 hours', n: 25 },
  { label: '40 to 100 hours', n: 65 },
  { label: '100 to 250 hours', n: 160 },
  { label: 'More than 250 hours', n: 300 },
];

/** Loaded hourly cost of the people doing that work ($ per hour worked). */
export const hourlyOptions: Option[] = [
  { label: 'Under $30', n: 26 },
  { label: '$30 to $45', n: 36 },
  { label: '$45 to $65', n: 52 },
  { label: 'Over $65', n: 70 },
  { label: NOT_SURE, n: null },
];

// ---- Step 3: customers and growth ----
/** Share of inquiries that arrive outside business hours (% as 0-100). */
export const afterHoursOptions: Option[] = [
  { label: 'Under 10%', n: 5 },
  { label: '10 to 25%', n: 15 },
  { label: '25 to 40%', n: 30 },
  { label: 'Over 40%', n: 45 },
  { label: NOT_SURE, n: null },
];

/** Monthly ad spend ($/month). None = 0 (marketing lever off); Not sure = off too (we don't guess a budget). */
export const adSpendOptions: Option[] = [
  { label: 'None', n: 0 },
  { label: 'Under $2,000', n: 1_000 },
  { label: '$2,000 to $10,000', n: 5_000 },
  { label: '$10,000 to $50,000', n: 20_000 },
  { label: 'More than $50,000', n: 60_000 },
  { label: NOT_SURE, n: null },
];

export const outboundOptions: Option[] = [
  { label: 'Yes' },
  { label: 'Not yet, but we’d like to' },
  { label: 'No' },
];
/** Outbound answers that switch the sales lever (and its two follow-up fields) on. */
export const outboundOn = new Set(['Yes', 'Not yet, but we’d like to']);

// ---- Step 4: priorities ----
export const MAX_GOALS = 3;
export const goals: Option[] = [
  { label: 'Answer every customer, day and night', sub: 'Customer Agent' },
  { label: 'Take admin and email off the team', sub: 'Executive Assistant' },
  { label: 'Get reporting and numbers under control', sub: 'Analyst Agent' },
  { label: 'Get more from our ad spend', sub: 'Marketing Director' },
  { label: 'Start more sales conversations', sub: 'Sales Agent' },
  { label: 'Cut costs and lift margin', sub: 'AI Consulting' },
  { label: 'Grow without adding headcount', sub: 'Across the agents' },
  { label: 'Not sure yet', sub: 'We’ll suggest where to start' },
];

export const tools: Option[] = [
  'Google Workspace', 'Microsoft 365 or Outlook', 'Excel or Sheets', 'QuickBooks', 'Xero', 'HubSpot',
  'Salesforce', 'Shopify', 'Google Ads', 'Meta Ads', 'Slack or Teams', 'Booking or field-service app',
].map((label) => ({ label }));

export const timelines: Option[] = ['As soon as possible', 'Within 3 months', 'In 3 to 6 months', 'Just exploring'].map((label) => ({ label }));

export const deciders: Option[] = [
  'Just me', 'A partner or co-owner', 'Leadership team', 'Someone else decides',
].map((label) => ({ label }));

export const contactPrefs: Option[] = [{ label: 'Email' }, { label: 'Phone call' }];

// ---- Helpers shared by the server render and the client ----

/** Representative number for an answer: a number, null for "Not sure", undefined when unanswered or unknown. */
export function valueOf(options: Option[], label: string | null | undefined): number | null | undefined {
  if (!label) return undefined;
  const o = options.find((x) => x.label === label);
  return o ? (o.n === undefined ? undefined : o.n) : undefined;
}

/** Explicit range edges for the prefill, so "$35 an hour" lands in "$30 to $45", not by midpoint. */
export const rangeEdges: Record<string, { options: Option[]; edges: number[] }> = {
  teamSize: { options: teamSizes, edges: [5, 20, 50, 100, 250, 501] },
  hourlyCost: { options: hourlyOptions, edges: [30, 45, 65] },
  afterHoursShare: { options: afterHoursOptions, edges: [10, 25, 40] },
  monthlyAdSpend: { options: adSpendOptions, edges: [1, 2_000, 10_000, 50_000] },
  annualRevenue: { options: revenues, edges: [1_000_000, 5_000_000, 10_000_000, 25_000_000, 80_000_000] },
};

/** Label of the range that holds `n`, using the explicit edges above (lower edge inclusive). */
export function rangeLabel(key: keyof typeof rangeEdges, n: number): string | undefined {
  const spec = rangeEdges[key];
  if (!spec || !Number.isFinite(n)) return undefined;
  const ranged = spec.options.filter((o) => typeof o.n === 'number');
  let i = 0;
  while (i < spec.edges.length && n >= spec.edges[i]) i++;
  return ranged[Math.min(i, ranged.length - 1)]?.label;
}

/**
 * Lenient number parsing for the free-text number fields: "$1,200", "1.2k", "about 300", "40%".
 * Returns NaN for anything that isn't one plain number (a range like "200-300" included).
 */
export function parseAmount(raw: string): number {
  let s = raw.trim().toLowerCase();
  if (!s) return NaN;
  s = s.replace(/^(about|around|approx\.?|approximately|roughly|~)\s*/, '');
  s = s.replace(/[\s,$%]/g, '').replace(/^usd/, '');
  const m = /^(\d+(?:\.\d+)?|\.\d+)(k|m)?$/.exec(s);
  if (!m) return NaN;
  const base = Number(m[1]);
  const mult = m[2] === 'k' ? 1_000 : m[2] === 'm' ? 1_000_000 : 1;
  return base * mult;
}

/** Calculator hand-off parameter names: the LeverInputs keys, plus the short names the calculator used first. */
export const prefillAliases: Record<string, string[]> = {
  teamSize: ['teamSize', 'team'],
  hourlyCost: ['hourlyCost', 'hourly'],
  repetitiveHours: ['repetitiveHours', 'hours'],
  monthlyInquiries: ['monthlyInquiries', 'inquiries'],
  afterHoursShare: ['afterHoursShare', 'afterHours', 'after'],
  avgJobValue: ['avgJobValue', 'jobValue', 'job'],
  grossMargin: ['grossMargin', 'margin'],
  monthlyAdSpend: ['monthlyAdSpend', 'adSpend', 'ads'],
  prospectsPerMonth: ['prospectsPerMonth', 'prospects'],
  avgDealValue: ['avgDealValue', 'dealValue', 'deal'],
  annualRevenue: ['annualRevenue', 'revenue'],
  operatingMargin: ['operatingMargin', 'opmargin', 'opMargin'],
};
