// Sample data for the hero agent console (FIG. 1). OWNER: home-hero.
// Everything here is illustrative: a fictional business, shown in a window tagged "Illustrative"
// with an "Illustrative example" tag and a FIG caption under it (DESIGN.md §6.4, §6.11).
//
// The business is the same fictional company as the Customer Agent demo and its
// "What it's worth" example, so the site tells one consistent story:
//   Larkfield Plumbing & Air, 18 employees (owner, office manager, 2 customer service reps,
//   12 technicians, 2 apprentices). src/data/worth.ts `customer`, content/DEMOS.md §1.
// The scene is that demo's Tuesday evening with the office closed: the 9:49 pm booking in the
// log is the booking the demo shows, and Renee K. and Luis P. are the demo's people.
//
// Numbers stay modest and consistent with src/data (never invented to impress):
// - Customer Agent: 22 staff hours a month after review (worth.ts) = 5.5 h a week (4-week month).
// - Inquiries resolved without staff: 330 of 1,200 a month (worth.ts) = about 82 of 300 a week.
// - First reply under a minute (worth.ts: "After-hours replies: Under a minute, 24/7").
// - The other agents work for the 4 office staff only: 2.5 + 2.0 + 1.0 + 0.8 = 6.3 h a week,
//   about 1.6 h per person, under the 2.0 h per worker per week evidence ceiling in roi.ts.
// - Hours back over the last 7 days: 5.5 + 6.3 = 11.8 h.
// - "Connected to 9 tools" = the tools named in the log and approvals: website chat, text, phone,
//   Gmail, Google Calendar, QuickBooks, HubSpot, Google Ads, Meta Ads. Keep them in step.
import { getWorth } from '@/data/worth';
import { getDemo } from '@/data/services';
import type { IconName } from '@/components/ui/icons';

export type AgentId = 'customer' | 'analyst' | 'assistant' | 'marketing' | 'sales' | 'consulting';
export type RowStatus = 'done' | 'you' | 'handoff';

export type LogRow = {
  agent: AgentId;
  /** Channel or system the agent worked in ("Website chat", "QuickBooks"). */
  via: string;
  text: string;
  status: RowStatus;
  /** Chip label when it differs from the status default ("6 for you"). */
  chip?: string;
  /** Initial rows carry a fixed time; live rows are stamped with the console clock. */
  time?: string;
  /** What a live row changes in the console counters. */
  effect?: { inquiry?: boolean; resolved?: boolean; minutes?: number };
};

const worth = getWorth('customer');
const employees = Number(worth?.profile.match(/(\d+) employees/)?.[1] ?? 18);

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

/** Short labels for the agent strip shown on tablets and phones. */
export const agentShort: Record<Exclude<AgentId, 'consulting'>, string> = {
  customer: 'Customer',
  analyst: 'Analyst',
  assistant: 'Assistant',
  marketing: 'Marketing',
  sales: 'Sales',
};

/** Console clock: Tuesday 9:50 pm, the minute after the demo's booking. */
export const scene = { day: 2, minutes: 21 * 60 + 50 };

export const statusChip: Record<RowStatus, { variant: 'done' | 'attention' | 'handoff'; label: string }> = {
  done: { variant: 'done', label: 'Done' },
  you: { variant: 'attention', label: 'Needs your OK' },
  handoff: { variant: 'handoff', label: 'Handed off' },
};

/** Sidebar: the five agents on shift. state 'you' = waiting on a person (sky), 'working' = sage. */
export const roster: { id: Exclude<AgentId, 'consulting'>; line: string; state: 'working' | 'you' }[] = [
  { id: 'customer', line: 'In 2 conversations', state: 'working' },
  { id: 'analyst', line: 'Reconciling payments', state: 'working' },
  { id: 'assistant', line: '6 emails flagged for you', state: 'you' },
  { id: 'marketing', line: 'Ad test #14 running', state: 'working' },
  { id: 'sales', line: '9 emails ready for review', state: 'you' },
];

/** Activity log as the page loads, newest first (COPY.md §2.1 hero visual copy, made consistent). */
export const initialRows: LogRow[] = [
  { time: '9:49 pm', agent: 'customer', via: 'Website chat', text: 'Booked an AC repair for Wed, 8 to 10 am. Confirmation sent by text.', status: 'done' },
  { time: '5:12 pm', agent: 'sales', via: 'Gmail', text: 'Researched 12 prospects: 9 emails to review, 3 skipped.', status: 'you' },
  { time: '7:30 am', agent: 'analyst', via: 'QuickBooks', text: 'Weekly numbers ready: parts costs rose on 3 job types.', status: 'done' },
  { time: '7:15 am', agent: 'assistant', via: 'Gmail', text: 'Inbox sorted: 6 flagged, 11 replies drafted, 3 tasks assigned.', status: 'handoff', chip: '6 for you' },
  { time: 'Mon', agent: 'marketing', via: 'Google Ads', text: 'Paused 14 no-lead search terms; budget moved within your cap.', status: 'done' },
  { time: 'Fri', agent: 'consulting', via: 'Margin review', text: 'Savings roadmap updated: 3 opportunities ranked by payback.', status: 'done' },
];

/** Live rows, played once in order (about one every 4.6 s while the console is in view). */
export const liveRows: LogRow[] = [
  { agent: 'customer', via: 'Website chat', text: 'Financing question handed to Renee K. with the full transcript.', status: 'handoff', effect: { inquiry: true } },
  { agent: 'customer', via: 'Text', text: 'Answered a no-cooling text and booked a Wed visit, 1 to 3 pm.', status: 'done', effect: { inquiry: true, resolved: true, minutes: 4 } },
  { agent: 'analyst', via: 'QuickBooks', text: 'Matched 38 payments. Flagged 2 invoices past 60 days for Renee.', status: 'done', effect: { minutes: 12 } },
  { agent: 'customer', via: 'Phone', text: 'Water-heater leak after hours. Paged Luis P., on call tonight.', status: 'handoff', effect: { inquiry: true } },
  { agent: 'marketing', via: 'Google Ads', text: 'Paused 2 ads with rising cost per lead, inside your cap.', status: 'done', effect: { minutes: 6 } },
  { agent: 'customer', via: 'Website chat', text: 'Answered a maintenance-plan question and sent the sign-up link.', status: 'done', effect: { inquiry: true, resolved: true, minutes: 4 } },
  { agent: 'assistant', via: 'Google Calendar', text: 'Scheduled Thursday’s ops review. The agenda goes out at 8 am.', status: 'done', effect: { minutes: 6 } },
  { agent: 'customer', via: 'Text', text: 'Moved a Wed visit to Thu at the customer’s request.', status: 'done', effect: { inquiry: true, resolved: true, minutes: 4 } },
  { agent: 'sales', via: 'HubSpot', text: 'Logged today’s research and set follow-ups for next week.', status: 'done', effect: { minutes: 6 } },
  { agent: 'customer', via: 'Website chat', text: 'Quoted a drain cleaning from your price book.', status: 'done', effect: { inquiry: true, resolved: true, minutes: 4 } },
];

/** "Waiting on you": the owner's two open approvals (sky, user-check; DESIGN.md §2.4). */
export const approvals = [
  { who: 'Sales Agent · first emails', what: '9 emails to property managers', sub: '“Noticed you manage three older buildings downtown…”' },
  { who: 'Marketing Director · budget', what: 'Move $300 a week from Meta to search', sub: 'Search leads cost less over the last 30 days' },
];

/** Hours back by agent, last 7 days (see the header note for the derivation). */
export const hoursByAgent: { id: Exclude<AgentId, 'consulting'>; hours: number }[] = [
  { id: 'customer', hours: (worth?.hoursPerMonth ?? 22) / 4 },
  { id: 'assistant', hours: 2.5 },
  { id: 'analyst', hours: 2.0 },
  { id: 'marketing', hours: 1.0 },
  { id: 'sales', hours: 0.8 },
];

export const hoursTotal = Math.round(hoursByAgent.reduce((t, a) => t + a.hours, 0) * 10) / 10;

/** Counters in the head and KPI row. Inquiries are a week of worth.ts volume (1,200 a month ÷ 4). */
export const counters = {
  tasksToday: 62,
  waitingOnYou: approvals.length,
  resolved: Math.floor(330 / 4),
  inquiries: 1200 / 4,
  firstReplySec: 38,
  hoursDelta: 1.5,
  adSpendMoved: 260,
};

/** Sparkline: hours back per 7-day window over the last ten windows, ending at today's total. */
export const sparkline = [6.1, 6.9, 7.4, 8.2, 8.0, 9.1, 9.6, 9.9, 10.3, hoursTotal];

/** FIG. 1 legend (DESIGN.md §6.11: exactly these three lines), numbered in reading order to match
 *  the knots: 1 the KPI row (top left), 2 Waiting on you (top right; second on phones), 3 the log. */
export const legend = [
  'Results tracked in hours and dollars',
  'Anything sensitive waits for your OK',
  'Every agent action, logged as it happens',
];
