// "A day with your AI workforce": one fictional business day in five moments. OWNER: home-daystory.
//
// The business is the same fictional company as the hero console, the Customer Agent demo and
// worth.ts `customer`: Larkfield Plumbing & Air, 18 employees. Everything here is illustrative and
// is shown in windows tagged "Illustrative" under an "Illustrative example" tag (DESIGN.md §6.4).
//
// Numbers stay modest and consistent with src/data (BRIEF.md numbers policy; rounding never inflates):
// - Customer Agent: 22 staff hours back a month (worth.ts) over 22 working days = 1.0 h a day.
// - The other agents use the hero console's weekly split (Assistant 2.5 h, Analyst 2.0 h,
//   Marketing 1.0 h, Sales 0.8 h) over 5 days = 0.5 + 0.4 + 0.2 + 0.1 (0.16, rounded down).
// - Hours back today: 1.0 + 0.5 + 0.4 + 0.2 + 0.1 = 2.2 h (5 days ≈ the console's 11.8 h a week).
// - Jobs booked: 330 inquiries resolved a month (worth.ts) × 30% new-job requests ÷ 22 days ≈ 4.5 → 4.
// - Inbox: 6 for you, 11 drafts, 3 tasks (the console's 7:15 am row) + 18 filed = 38 emails.
// - Sales: 12 researched, 9 ready, 3 skipped (the console's Sales row).
// - Approvals: 11 drafted replies + 9 first emails = 20 given; 1 waiting (the price-book update).
// - Margin leak: service gross margin 40% (worth.ts, BENCHMARKS pnl-16) slips to 34% on water-heater
//   installs; 12 installs a month × $1,650 × 6 points = $1,188 a month.
// - Prices come from the Customer Agent demo's price book (DEMOS.md §1: diagnostic visit $89).
import { getWorth } from '@/data/worth';
import { getDemo } from '@/data/services';
import type { IconName } from '@/components/ui/icons';
import { clockText as clock } from './clock';

const worth = getWorth('customer');

export const business = {
  name: worth?.business ?? 'Larkfield Plumbing & Air',
  employees: Number(worth?.profile.match(/(\d+) employees/)?.[1] ?? 18),
  kind: 'plumbing, heating and cooling company',
  // Monday, the day before the hero console's Tuesday evening, so the two never show the same day in
  // different states (the console's 9 property-manager emails are Tuesday's batch).
  day: 'Mon',
};
const dayNames: Record<string, string> = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };
/** Full day name for labels ("Monday"). */
export const dayName = dayNames[business.day] ?? business.day;

const workdays = 22;
const customerPerDay = Math.floor(((worth?.hoursPerMonth ?? 22) / workdays) * 10) / 10; // 1.0
/** Hours back today by agent (see the header note). */
export const hoursToday: { agent: string; hours: number }[] = [
  { agent: getDemo('customer')?.label ?? 'Customer Agent', hours: customerPerDay },
  { agent: getDemo('assistant')?.label ?? 'Executive Assistant', hours: 0.5 },
  { agent: getDemo('analyst')?.label ?? 'Analyst Agent', hours: 0.4 },
  { agent: getDemo('marketing')?.label ?? 'Marketing Director', hours: 0.2 },
  { agent: getDemo('sales')?.label ?? 'Sales Agent', hours: 0.1 },
];
export const hoursTotal = Math.round(hoursToday.reduce((t, a) => t + a.hours, 0) * 10) / 10; // 2.2
export const jobsBooked = Math.floor((330 * 0.3) / workdays); // 4

export const inbox = { needYou: 6, drafts: 11, tasks: 3, filed: 18 };
export const inboxTotal = inbox.needYou + inbox.drafts + inbox.tasks + inbox.filed; // 38
export const sales = { researched: 12, ready: 9, skipped: 3 };
export const approvals = { given: inbox.drafts + sales.ready, waiting: 1 }; // 20 given, 1 waiting

export const leak = { installs: 12, ticket: 1650, from: 40, to: 34 };
export const leakPoints = leak.from - leak.to; // 6
export const leakMonthly = Math.floor(leak.installs * leak.ticket * (leakPoints / 100)); // 1,188

export type Moment = {
  id: 'inbox' | 'chat' | 'margin' | 'outreach' | 'summary';
  /** Narrative time label and the window clock (minutes after midnight). */
  time: string;
  minutes: number;
  /** Minutes the clock moves while the moment plays. */
  tick: number;
  agent: string;
  icon: IconName;
  /** The large serif line. */
  line: string;
  body: string;
  /** Window crumb: Business / view. */
  view: string;
  /** Short rail label. */
  rail: string;
};

const label = (id: string, fallback: string) => getDemo(id)?.label ?? fallback;

export const moments: Moment[] = [
  {
    id: 'inbox',
    time: '7:30 am',
    minutes: 7 * 60 + 30,
    tick: 11,
    agent: label('assistant', 'Executive Assistant'),
    icon: 'inbox',
    line: 'The inbox is sorted before the first coffee.',
    body: `${inboxTotal} emails came in overnight. ${inbox.needYou} need the owner, ${inbox.drafts} routine replies are drafted for approval and ${inbox.tasks} tasks go to the right people.`,
    view: 'Inbox',
    rail: 'Inbox',
  },
  {
    id: 'chat',
    time: '9:40 am',
    minutes: 9 * 60 + 40,
    tick: 4,
    agent: label('customer', 'Customer Agent'),
    icon: 'message-square',
    line: 'A website question becomes a booked job.',
    body: 'A homeowner asks about a buzzing AC. The agent checks it’s safe, quotes from the price book and books today’s 1 to 3 pm opening, while the office stays on the phones.',
    view: 'Website chat',
    rail: 'Booked job',
  },
  {
    id: 'margin',
    time: '1:15 pm',
    minutes: 13 * 60 + 15,
    tick: 6,
    agent: label('analyst', 'Analyst Agent'),
    icon: 'chart-column',
    line: 'A margin leak, caught early.',
    body: `Water-heater installs slid from a ${leak.from}% margin to ${leak.to}% in eight weeks. Tank costs went up; the price book didn’t. The fix waits for the owner’s OK.`,
    view: 'Margins',
    rail: 'Margin leak',
  },
  {
    id: 'outreach',
    time: '3:30 pm',
    minutes: 15 * 60 + 30,
    tick: 7,
    agent: label('sales', 'Sales Agent'),
    icon: 'send',
    line: 'Nine researched emails wait for a yes.',
    body: `It looked into ${sales.researched} local property managers, skipped ${sales.skipped} with no clear reason to write and drafted ${sales.ready} specific emails. Nothing sends until someone approves.`,
    view: 'First emails',
    rail: 'Outreach',
  },
  {
    id: 'summary',
    time: '6:00 pm',
    minutes: 18 * 60,
    tick: 0,
    agent: 'Daily summary',
    icon: 'clock',
    line: 'The day, accounted for.',
    body: `A short summary lands in the owner’s inbox: ${hoursTotal.toFixed(1)} hours back, ${jobsBooked} jobs booked, ${approvals.given} approvals given and one decision still waiting.`,
    view: 'End of day',
    rail: 'Summary',
  },
];

/** "Mon 7:30 am" style clock text for the window status pill. */
export const clockText = (minutes: number) => clock(minutes, business.day);

/** Day timeline in the summary: 7 am to 7 pm. */
export const dayStart = 7 * 60;
export const dayEnd = 19 * 60;
export const dayPos = (minutes: number) => (minutes - dayStart) / (dayEnd - dayStart);
