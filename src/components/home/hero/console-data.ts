// Sample data for the interactive hero agent console (FIG. 1). OWNER: home-hero.
// Everything here is illustrative: a fictional business, shown in a window tagged "Illustrative"
// with an "Illustrative example" tag and a FIG caption under it (DESIGN.md §6.4, §6.11).
// src/pages/dev/og.astro (the share card) also reads agent, approvals, counters, hoursTotal, roster
// and sparkline: keep those exports and their shapes.
//
// The business is the same fictional company as the Customer Agent demo and its
// "What it's worth" example, so the site tells one consistent story:
//   Larkfield Plumbing & Air, 18 employees (owner, office manager, 2 customer service reps,
//   12 technicians, 2 apprentices). src/data/worth.ts `customer`, content/DEMOS.md §1.
// The scene is that demo's Tuesday evening in July with the office closed: the 9:49 pm booking in
// the log is the booking the demo shows, and Renee K. and Luis P. are the demo's people.
//
// Numbers stay modest and consistent with src/data (never invented to impress). "30 days" uses the
// month figures (4 working weeks, as in worth.ts), "7 days" a quarter of them, "Today" one weekday:
// - Customer Agent: 22 staff hours a month after review (worth.ts) = 5.5 a week; today 13 resolved
//   inquiries x 5 min x 80% = 0.9 h.
// - Inquiries resolved without staff: 330 of 1,200 a month (worth.ts) = 82 of 300 a week; 13 of 46 today.
// - First reply under a minute (worth.ts: "After-hours replies: Under a minute, 24/7").
// - The other agents work for the 4 office staff only: 2.5 + 2.0 + 1.0 + 0.8 = 6.3 h a week,
//   about 1.6 h per person, under the 2.0 h per worker per week evidence ceiling in roi.ts.
// - Hours back: 2.2 today, 11.8 in 7 days, 47.2 in 30 days.
// - Ads: $1,500 a week, split evenly between Google search and Meta. 30 days: search $3,000 for 33
//   leads (about $91 each, the home-services search median in BENCHMARKS.md, mkt-01) and Meta $3,000
//   for 70 leads (about $43, the Meta home-services median, mkt-03). 15 and 10 of them booked.
// - "Connected to N tools" counts the tools named in the log and the approvals (TOOLS below).
import { getWorth } from '@/data/worth';
import { getDemo } from '@/data/services';
import { currency, number } from '@/lib/format';
// The weekly budget cap is the Marketing demo's, so every mention on the site says the same number.
import { budgetCap } from '@/components/demos/marketing/data';
import type { IconName } from '@/components/ui/icons';
import type { AgentKey, ByPeriod, ConsoleModel, KpiSpec, Period } from './console-model';

export type AgentId = 'customer' | 'analyst' | 'assistant' | 'marketing' | 'sales' | 'consulting';
export type RowStatus = 'done' | 'you' | 'handoff';
export type ApprovalId = 'sales' | 'marketing';

export type LogRow = {
  agent: AgentId;
  /** Channel or system the agent worked in ("Website chat", "QuickBooks"). */
  via: string;
  text: string;
  status: RowStatus;
  /** Chip label when it differs from the status default ("6 for you"). */
  chip?: string;
  /** Days before the scene day (0 = today). Live rows are always today. */
  day?: number;
  /** Minutes after midnight; live rows are stamped with the console clock instead. */
  at?: number;
  /** The approval this row asked for. */
  appr?: ApprovalId;
  /** What a live row adds to the console counters. */
  effect?: Record<string, number>;
};

const worth = getWorth('customer');
const employees = Number(worth?.profile.match(/(\d+) employees/)?.[1] ?? 18);
/** Reads "330 a month" or "1,200 (…)" from a worth.ts ledger line; falls back if the wording changes. */
const ledger = (rows: { label: string; value: string }[] | undefined, label: RegExp, fallback: number) => {
  const hit = rows?.find((r) => label.test(r.label))?.value.match(/^[\d,]+/)?.[0];
  return hit ? Number(hit.replace(/,/g, '')) : fallback;
};
const monthResolved = ledger(worth?.after, /Resolved without staff/, 330);
const monthInquiries = ledger(worth?.baseline, /Customer inquiries/, 1200);
const monthHours = worth?.hoursPerMonth ?? 22;

export const business = {
  name: worth?.business ?? 'Larkfield Plumbing & Air',
  employees,
  kind: 'plumbing, heating and cooling company',
};

/** Agent display name and icon come from the shared demo list (fixed icon mapping, DESIGN.md §8.1). */
export function agent(id: AgentId): { name: string; icon: IconName } {
  const d = getDemo(id);
  return { name: d?.label ?? id, icon: (d?.icon ?? 'list') as IconName };
}

/** Short labels for the agent chips on tablets and phones. */
export const agentShort: Record<Exclude<AgentId, 'consulting'>, string> = {
  customer: 'Customer',
  analyst: 'Analyst',
  assistant: 'Assistant',
  marketing: 'Marketing',
  sales: 'Sales',
};

/** Console clock: Tuesday 9:50 pm, the minute after the demo's booking. */
export const scene = { day: 2, minutes: 21 * 60 + 50 };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/** The scene's calendar day (the demo books "Wed 7/15"), for log rows older than a week. */
const SCENE_DATE = Date.UTC(2026, 6, 14);

export const clockTime = (minutes: number) => {
  const h = Math.floor(minutes / 60) % 24;
  return `${((h + 11) % 12) + 1}:${String(minutes % 60).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};
export const clockLabel = (day: number, minutes: number) => `${DAYS[day % 7]} ${clockTime(minutes)}`;

/** The log's time column: a time today, a weekday this week, a date before that. */
export function rowTime(row: LogRow): string {
  const day = row.day ?? 0;
  if (day === 0) return clockTime(row.at ?? scene.minutes);
  if (day < 7) return DAYS[(scene.day - day + 7) % 7];
  return new Date(SCENE_DATE - day * 864e5).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export const statusChip: Record<RowStatus, { variant: 'done' | 'attention' | 'handoff'; label: string }> = {
  done: { variant: 'done', label: 'Done' },
  you: { variant: 'attention', label: 'Needs your OK' },
  handoff: { variant: 'handoff', label: 'Handed off' },
};

// ---------------------------------------------------------------- Ads (the budget approval)

const ads = {
  search: { spend: 3000, leads: 33, booked: 15, weekly: 750 },
  meta: { spend: 3000, leads: 70, booked: 10, weekly: 750 },
};
const perJob = (c: { spend: number; booked: number }) => Math.round(c.spend / c.booked);
const perLead = (c: { spend: number; leads: number }) => Math.round(c.spend / c.leads);
const bookRate = (c: { booked: number; leads: number }) => Math.round((c.booked / c.leads) * 100);
/** The move is the most the cap allows on Meta in one week. */
const move = Math.round((ads.meta.weekly * budgetCap) / 100);
const jobsPerWeek = move / perJob(ads.search) - move / perJob(ads.meta);
const jobsPer4Weeks = Math.round(jobsPerWeek * 4 * 10) / 10;

// ---------------------------------------------------------------- Approvals

/** "Waiting on you": the owner's two open approvals (sky, user-check; DESIGN.md §2.4). */
export const approvals = [
  {
    id: 'sales' as ApprovalId,
    agent: 'sales' as const,
    who: 'Sales Agent · first emails',
    what: '9 emails to property managers',
    sub: '“Noticed you manage three older buildings downtown…”',
    email: {
      to: 'Marisol Vega · Pellridge Property Co.',
      subject: 'Older pipes downtown',
      greeting: 'Hi Marisol,',
      // [1] and [2] become the numbered source markers.
      body: [
        'I noticed you manage three older buildings downtown, including the brick walk-up on Alder Street.[1] Buildings that age often still have galvanized pipes; weak pressure upstairs is the usual first sign.',
        'We look after the plumbing in several rental buildings nearby[2] and keep a one-page checklist for older systems. Want a copy?',
      ],
      signature: 'Dan Mercer, Larkfield Plumbing & Air',
      optOut: 'Not the right person? Reply “no thanks” and I won’t write again.',
      sources: ['County property records', 'Your approved claims list'],
      draft: '1 of 9',
    },
    done: {
      approved: { line: 'Sends Wed, 7:40 am', text: '9 first emails go out Wed from 7:40 am, within the daily limit.' },
      declined: { line: '9 drafts on hold', text: 'Holding all 9 drafts. Tell it what to change, or they expire in 7 days.' },
    },
  },
  {
    id: 'marketing' as ApprovalId,
    agent: 'marketing' as const,
    who: 'Marketing Director · budget',
    what: `Move ${currency(move)} a week from Meta to search`,
    sub: `Search books jobs for ${currency(perJob(ads.search))} each; Meta for ${currency(perJob(ads.meta))}`,
    budget: {
      head: ['Last 30 days', 'Search', 'Meta'],
      rows: [
        ['Spend', currency(ads.search.spend), currency(ads.meta.spend)],
        ['Leads', number(ads.search.leads), number(ads.meta.leads)],
        ['Booked jobs', number(ads.search.booked), number(ads.meta.booked)],
        ['Per booked job', currency(perJob(ads.search)), currency(perJob(ads.meta))],
      ],
      why: `Meta leads cost less (${currency(perLead(ads.meta))} vs ${currency(perLead(ads.search))}), but fewer of them book: ${bookRate(ads.meta)}% vs ${bookRate(ads.search)}%.`,
      plan: `Meta ${currency(ads.meta.weekly)} → ${currency(ads.meta.weekly - move)} a week (your ${budgetCap}% cap), search ${currency(ads.search.weekly)} → ${currency(ads.search.weekly + move)}. The ${currency(ads.search.weekly + ads.meta.weekly)} total stays the same.`,
      expect: `about ${number(jobsPer4Weeks, 1)} more booked job${jobsPer4Weeks === 1 ? '' : 's'} every 4 weeks, if costs per job hold.`,
      math: `${currency(move)} ÷ ${currency(perJob(ads.search))} − ${currency(move)} ÷ ${currency(perJob(ads.meta))} = ${number(jobsPerWeek, 2)} jobs a week × 4 = ${number(jobsPer4Weeks, 1)}`,
    },
    done: {
      approved: { line: 'Moves budget Mon', text: `From Mon: Meta ${currency(ads.meta.weekly - move)} a week, search ${currency(ads.search.weekly + move)}.` },
      declined: { line: 'Test #14 running', text: 'Budget stays as is. It will look again after 2 more weeks of data.' },
    },
  },
];

// ---------------------------------------------------------------- Agents on shift

type RosterId = Exclude<AgentId, 'consulting'>;
/** Sidebar: the five agents on shift. state 'you' = waiting on a person (sky), 'working' = sage. */
export const roster: { id: RosterId; line: string; state: 'working' | 'you'; appr?: ApprovalId }[] = [
  { id: 'customer', line: 'In 2 conversations', state: 'working' },
  { id: 'analyst', line: 'Matching payments', state: 'working' },
  { id: 'assistant', line: '6 emails for you', state: 'you' },
  { id: 'marketing', line: 'Needs your OK', state: 'you', appr: 'marketing' },
  { id: 'sales', line: '9 emails to review', state: 'you', appr: 'sales' },
];

// ---------------------------------------------------------------- Activity log

const h = (hh: number, mm = 0) => hh * 60 + mm;

/** The log as the page loads, newest first (COPY.md §2.1 hero visual copy, made consistent). */
export const logRows: LogRow[] = [
  { day: 0, at: h(21, 49), agent: 'customer', via: 'Website chat', text: 'Booked an AC repair for Wed, 8 to 10 am. Confirmation sent by text.', status: 'done' },
  { day: 0, at: h(17, 12), agent: 'sales', via: 'Gmail', text: 'Researched 12 property managers: 9 emails to review, 3 skipped.', status: 'you', appr: 'sales' },
  { day: 0, at: h(15, 40), agent: 'marketing', via: 'Google Ads', text: `Suggested moving ${currency(move)} a week from Meta to search.`, status: 'you', appr: 'marketing' },
  { day: 0, at: h(13, 15), agent: 'customer', via: 'Phone', text: 'New water-heater quote handed to Renee K. with the call notes.', status: 'handoff' },
  { day: 0, at: h(7, 30), agent: 'analyst', via: 'QuickBooks', text: 'Weekly numbers ready: parts costs rose on 3 job types.', status: 'done' },
  { day: 0, at: h(7, 15), agent: 'assistant', via: 'Gmail', text: 'Inbox sorted: 6 flagged, 11 replies drafted, 3 tasks assigned.', status: 'handoff', chip: '6 for you' },
  { day: 0, at: h(6, 5), agent: 'marketing', via: 'Google Ads', text: 'Daily check: paused 2 search terms with no leads.', status: 'done' },
  { day: 1, agent: 'customer', via: 'Text', text: 'Answered a no-cooling text after hours and booked Tue, 8 to 10 am.', status: 'done' },
  { day: 1, agent: 'marketing', via: 'Google Ads', text: 'Paused 14 no-lead search terms; budget moved within your cap.', status: 'done' },
  { day: 1, agent: 'assistant', via: 'Gmail', text: 'Monday briefing sent: 4 jobs to follow up, 2 invoices to chase.', status: 'done' },
  { day: 1, agent: 'analyst', via: 'QuickBooks', text: 'Matched 41 weekend payments. Flagged 1 duplicate charge.', status: 'done' },
  { day: 2, agent: 'customer', via: 'Website chat', text: 'Water-heater leak on a Sunday. Paged Luis P., on call.', status: 'handoff' },
  { day: 4, agent: 'consulting', via: 'Margin review', text: 'Savings roadmap updated: 3 opportunities ranked by payback.', status: 'done' },
  { day: 4, agent: 'sales', via: 'HubSpot', text: '7 first emails you approved went out. 1 reply, logged.', status: 'done' },
  { day: 4, agent: 'assistant', via: 'Google Calendar', text: 'Moved Friday’s team meeting and updated 12 calendars.', status: 'done' },
  { day: 5, agent: 'customer', via: 'Phone', text: 'Took an after-hours call and booked a Fri drain cleaning.', status: 'done' },
  { day: 5, agent: 'analyst', via: 'Excel', text: 'Job-cost sheet updated: 2 of 9 AC installs ran over estimate.', status: 'done' },
  { day: 6, agent: 'marketing', via: 'Meta Ads', text: 'Started ad test #14: two headlines, $20 a day each.', status: 'done' },
  { day: 6, agent: 'sales', via: 'Gmail', text: 'Drafted 7 first emails; you approved all 7.', status: 'done', chip: 'Approved' },
  { day: 7, agent: 'analyst', via: 'QuickBooks', text: 'June numbers ready: margin steady, fuel costs up.', status: 'done' },
  { day: 9, agent: 'customer', via: 'Text', text: 'Holiday weekend: answered 31 texts and booked 9 visits.', status: 'done' },
  { day: 11, agent: 'consulting', via: 'Vendor review', text: 'Found 2 software subscriptions that do the same job.', status: 'done' },
  { day: 14, agent: 'customer', via: 'Text', text: 'Maintenance-plan renewals: reminded 23 customers by text.', status: 'done' },
  { day: 15, agent: 'marketing', via: 'Google Ads', text: 'June report sent, with 3 changes planned for July.', status: 'done' },
  { day: 18, agent: 'assistant', via: 'PowerPoint', text: 'Built the Q2 review deck: 9 slides from your notes.', status: 'done' },
  { day: 20, agent: 'sales', via: 'HubSpot', text: 'Logged 2 replies and set follow-ups for next week.', status: 'done' },
  { day: 22, agent: 'analyst', via: 'Excel', text: 'Cash-flow forecast rebuilt with June actuals.', status: 'done' },
  { day: 26, agent: 'customer', via: 'Phone', text: 'Gas smell reported after hours. Told the caller to leave; paged Luis P.', status: 'handoff' },
  { day: 27, agent: 'sales', via: 'Gmail', text: 'Drafted 10 first emails; you approved 8 and cut 2.', status: 'done', chip: 'Approved' },
];

/** Live rows, played in order and then from the top again (one every 4.6 s while it runs). */
export const liveRows: LogRow[] = [
  { agent: 'customer', via: 'Website chat', text: 'Financing question handed to Renee K. with the full transcript.', status: 'handoff', effect: { inquiries: 1 } },
  { agent: 'customer', via: 'Text', text: 'Answered a no-cooling text and booked a Wed visit, 1 to 3 pm.', status: 'done', effect: { inquiries: 1, resolved: 1, booked: 1, minutes: 4 } },
  { agent: 'analyst', via: 'QuickBooks', text: 'Matched 38 payments. Flagged 2 invoices past 60 days for Renee.', status: 'done', effect: { payments: 38, flagged: 2, minutes: 12 } },
  { agent: 'customer', via: 'Phone', text: 'Water-heater leak after hours. Paged Luis P., on call tonight.', status: 'handoff', effect: { inquiries: 1 } },
  { agent: 'marketing', via: 'Google Ads', text: 'Paused 2 ads with a rising cost per lead, inside your cap.', status: 'done', effect: { minutes: 6 } },
  { agent: 'customer', via: 'Website chat', text: 'Answered a maintenance-plan question and sent the sign-up link.', status: 'done', effect: { inquiries: 1, resolved: 1, minutes: 4 } },
  { agent: 'assistant', via: 'Google Calendar', text: 'Scheduled Thursday’s ops review. The agenda goes out at 8 am.', status: 'done', effect: { minutes: 6 } },
  { agent: 'customer', via: 'Text', text: 'Moved a Wed visit to Thu at the customer’s request.', status: 'done', effect: { inquiries: 1, resolved: 1, minutes: 4 } },
  { agent: 'sales', via: 'HubSpot', text: 'Logged today’s research and set follow-ups for next week.', status: 'done', effect: { minutes: 6 } },
  { agent: 'customer', via: 'Website chat', text: 'Quoted a drain cleaning from your price book.', status: 'done', effect: { inquiries: 1, resolved: 1, minutes: 4 } },
  { agent: 'assistant', via: 'Gmail', text: 'Sorted 9 late emails; 2 supplier replies drafted for the morning.', status: 'done', effect: { emails: 9, minutes: 5 } },
  { agent: 'customer', via: 'Phone', text: 'Returned a missed call by text in under a minute; booked Thu, 10 to 12.', status: 'done', effect: { inquiries: 1, resolved: 1, booked: 1, minutes: 4 } },
  { agent: 'analyst', via: 'Excel', text: 'Added 3 new bookings to tomorrow’s job board.', status: 'done', effect: { minutes: 5 } },
  { agent: 'customer', via: 'Website chat', text: 'Warranty question handed to Renee K. for the morning.', status: 'handoff', effect: { inquiries: 1 } },
];

/** The rows an approval decision adds ("Approved by you · just now"). */
export const decisionRows = approvals.flatMap((a) =>
  (['approved', 'declined'] as const).map((outcome) => ({
    id: a.id,
    outcome,
    row: {
      agent: a.agent,
      via: `${outcome === 'approved' ? 'Approved' : 'Declined'} by you · just now`,
      text: a.done[outcome].text,
      status: 'done' as RowStatus,
    } satisfies LogRow,
  })),
);

/** Every tool named in the log and the approvals; "Connected to N tools" counts them. */
const TOOLS = ['Website chat', 'Text', 'Phone', 'Gmail', 'Google Calendar', 'QuickBooks', 'Excel', 'PowerPoint', 'HubSpot', 'Google Ads', 'Meta Ads'];
const NOT_TOOLS = ['Margin review', 'Vendor review'];
if (import.meta.env.DEV) {
  const stray = [...logRows, ...liveRows].map((r) => r.via).filter((v) => !TOOLS.includes(v) && !NOT_TOOLS.includes(v));
  if (stray.length) console.warn(`[hero console] add to TOOLS: ${[...new Set(stray)].join(', ')}`);
}
export const toolCount = TOOLS.length;

// ---------------------------------------------------------------- Numbers by agent and period

const P = (today: number, week: number, month: number): ByPeriod => ({ today, '7d': week, '30d': month });

/** Hours back by agent (see the header note for the derivation). */
const hours: Record<RosterId, ByPeriod> = {
  customer: P(0.9, monthHours / 4, monthHours),
  assistant: P(0.5, 2.5, 10),
  analyst: P(0.4, 2.0, 8),
  marketing: P(0.2, 1.0, 4),
  sales: P(0.2, 0.8, 3.2),
};

/** Sparkline shapes, as a share of the latest window. "today" is the last 10 days (Sun to Tue), so
 *  weekends dip for the office agents; 7 days is the last 10 weeks; 30 days the last 6 windows. */
const SHAPE = {
  today: {
    always: [0.6, 0.92, 0.95, 0.88, 0.93, 0.9, 0.66, 0.62, 0.96, 1],
    office: [0.05, 0.9, 0.93, 0.85, 0.91, 0.86, 0.06, 0.04, 0.95, 1],
    ads: [0.35, 0.9, 0.92, 0.86, 0.9, 0.85, 0.4, 0.36, 0.94, 1],
  },
  '7d': [0.52, 0.58, 0.63, 0.69, 0.68, 0.77, 0.81, 0.84, 0.87, 1],
  '30d': [0.51, 0.62, 0.74, 0.83, 0.87, 1],
};
const KIND: Record<RosterId, 'always' | 'office' | 'ads'> = { customer: 'always', analyst: 'office', assistant: 'office', marketing: 'ads', sales: 'office' };
/** A small fixed wobble per agent, so five sparklines don't share one shape. */
const WOBBLE: Record<RosterId, number[]> = {
  customer: [0, 0.03, -0.02, 0.02, 0, -0.03, 0.02, -0.01, 0.01],
  analyst: [0.04, -0.02, 0.03, -0.03, 0.02, 0.01, -0.02, 0.02, -0.01],
  assistant: [-0.03, 0.02, 0, 0.03, -0.02, 0.02, 0.01, -0.02, 0.02],
  marketing: [0.02, -0.03, 0.03, 0, -0.03, 0.03, -0.01, 0.02, 0],
  sales: [-0.02, 0.03, -0.03, 0.02, 0.03, -0.02, 0.02, 0, -0.02],
};
const spark = Object.fromEntries(
  (Object.keys(hours) as RosterId[]).map((id) => {
    const make = (p: Period, shape: number[]) =>
      shape.map((s, i) => Math.round(hours[id][p] * (i === shape.length - 1 ? 1 : s * (1 + (WOBBLE[id][i] ?? 0))) * 100) / 100);
    return [id, { today: make('today', SHAPE.today[KIND[id]]), '7d': make('7d', SHAPE['7d']), '30d': make('30d', SHAPE['30d']) }];
  }),
) as ConsoleModel['spark'];

const firstReply: KpiSpec = { label: 'First reply, median', v: P(36, 38, 41), unit: 'sec', sub: 'Chat, text and email' };
const resolved: KpiSpec = {
  label: 'Resolved, no staff',
  v: P(13, Math.floor(monthResolved / 4), monthResolved),
  of: P(46, monthInquiries / 4, monthInquiries),
  key: 'resolved',
  ofKey: 'inquiries',
  sub: 'Inquiries, {p}',
};
const spendMoved: KpiSpec = { label: 'Ad spend moved', v: P(40, 260, 840), fmt: 'usd', sub: `Within your ${budgetCap}% cap` };

// "Value of the work" (2026-10-14 critique round: the legend promises hours and dollars, so "All agents" shows
// a dollar result instead of ad spend moved, which is money moved, not money made). Profit only, from the
// Larkfield example in worth.ts: every hour back at the customer service rep's $29 loaded rate (the office
// manager's and owner's hours are worth more, so this stays low), plus the 40% gross profit on the 11.8 jobs a
// month that no longer go to a competitor (a quarter of that for 7 days, a seventh of the week for today).
// 30 days: 47.2 h × $29 + 11.8 × $341 × 40% = $1,369 + $1,610 ≈ $2,978. The math line is in the FIG caption.
const workRate = Number(worth?.math.find((r) => /loaded\)/.test(r.label))?.label.match(/\$(\d+)\/h/)?.[1] ?? 29);
const call = worth?.baseline.find((r) => /Average service call/.test(r.label))?.value.match(/\$(\d+) at a (\d+)%/);
const jobProfit = call ? (Number(call[1]) * Number(call[2])) / 100 : 136.4;
const jobsMonth = Number(worth?.after.find((r) => /Jobs no longer lost/.test(r.label))?.value.match(/^[\d.]+/)?.[0] ?? 11.8);
const hoursAll = (p: Period) => Math.round(Object.values(hours).reduce((t, a) => t + a[p], 0) * 10) / 10;
const jobsBy = P(jobsMonth / 28, jobsMonth / 4, jobsMonth);
const valueOf = (p: Period) => Math.round(hoursAll(p) * workRate + jobsBy[p] * jobProfit);
const workValue: KpiSpec = { label: 'Value of the work', v: P(valueOf('today'), valueOf('7d'), valueOf('30d')), fmt: 'usd', sub: 'Time + jobs won back' };
/** The FIG caption's math line for the value tile. */
export const valueMath = {
  rate: workRate,
  jobProfit: Math.round(jobProfit * 100) / 100,
  call: call ? { price: Number(call[1]), margin: Number(call[2]) } : { price: 341, margin: 40 },
  jobsMonth,
  hours30: hoursAll('30d'),
  value30: valueOf('30d'),
};

const kpis: Record<AgentKey, KpiSpec[]> = {
  all: [workValue, firstReply, resolved],
  customer: [firstReply, resolved, { label: 'Jobs booked', v: P(4, 23, 92), key: 'booked', sub: 'Into your schedule' }],
  analyst: [
    { label: 'Payments matched', v: P(24, 186, 790), key: 'payments', sub: 'In QuickBooks' },
    { label: 'Reports delivered', v: P(1, 6, 27), sub: 'Daily and weekly' },
    { label: 'Issues flagged', v: P(0, 5, 19), key: 'flagged', sub: 'For Renee to check' },
  ],
  assistant: [
    { label: 'Emails sorted', v: P(41, 212, 905), key: 'emails', sub: 'Two inboxes' },
    { label: 'Replies drafted', v: P(11, 58, 241), sub: 'You send each one' },
    { label: 'Tasks assigned', v: P(3, 17, 70), sub: 'To the right person' },
  ],
  marketing: [
    spendMoved,
    { label: 'Search terms cut', v: P(2, 16, 41), sub: 'No leads, no spend' },
    { label: 'Leads from ads', v: P(4, 24, ads.search.leads + ads.meta.leads), sub: 'Search and Meta' },
  ],
  sales: [
    { label: 'Researched', v: P(12, 34, 128), sub: 'Property managers' },
    { label: 'Emails approved', v: P(0, 15, 62), sub: 'Every one by you', waiting: { id: 'sales', sub: '9 waiting on you' }, onApprove: { id: 'sales', add: 9 } },
    { label: 'Replies', v: P(0, 1, 2), sub: 'Logged in HubSpot' },
  ],
};

export const model: ConsoleModel = {
  periods: {
    today: { label: 'Today', short: 'today', phrase: 'today', vs: 'vs yesterday', same: 'Same as yesterday' },
    '7d': { label: '7 days', short: '7 days', phrase: 'in 7 days', vs: 'vs prior week', same: 'Same as the prior week' },
    '30d': { label: '30 days', short: '30 days', phrase: 'in 30 days', vs: 'vs prior 30 days', same: 'Same as the prior 30 days' },
  },
  names: {
    all: 'Agent activity',
    customer: agent('customer').name,
    analyst: agent('analyst').name,
    assistant: agent('assistant').name,
    marketing: agent('marketing').name,
    sales: agent('sales').name,
  },
  hours,
  spark,
  kpis,
  tasks: {
    customer: P(31, 205, 860),
    analyst: P(9, 48, 201),
    assistant: P(14, 95, 402),
    marketing: P(3, 19, 77),
    sales: P(5, 22, 96),
    consulting: P(0, 2, 9),
  },
};

/** Hours back by agent for the rail, biggest first (the order holds in every period). */
export const hoursByAgent = (Object.keys(hours) as RosterId[])
  .map((id) => ({ id, hours: hours[id]['7d'] }))
  .sort((a, b) => b.hours - a.hours);

export const hoursTotal = Math.round(hoursByAgent.reduce((t, a) => t + a.hours, 0) * 10) / 10;

/** First-paint counters (also read by the share card). */
export const counters = {
  tasksToday: Object.values(model.tasks).reduce((t, a) => t + a.today, 0),
  waitingOnYou: approvals.length,
  resolved: resolved.v['7d'],
  inquiries: resolved.of!['7d'],
  firstReplySec: firstReply.v['7d'],
  hoursDelta: Math.round((hoursTotal - (Object.values(spark).reduce((t, s) => t + s['7d'][8], 0))) * 10) / 10,
  adSpendMoved: spendMoved.v['7d'],
};

/** Sparkline for the share card: hours back per week over the last ten weeks, all agents. */
export const sparkline = SHAPE['7d'].map((_, i) => Math.round(Object.values(spark).reduce((t, s) => t + s['7d'][i], 0) * 10) / 10);

/** FIG. 1 legend (DESIGN.md §6.11: exactly these three lines), numbered in reading order to match
 *  the knots: 1 the KPI row (top left), 2 Waiting on you (top right; second on phones), 3 the log. */
export const legend = [
  'Results tracked in hours and dollars',
  'Anything sensitive waits for your OK',
  'Every agent action, logged as it happens',
];
