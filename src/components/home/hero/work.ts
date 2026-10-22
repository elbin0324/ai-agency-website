// The finished work in the home hero (../Hero.astro): three result cards, each one of the site's demos, and the
// one request waiting on the owner's phone. OWNER: home-hero.
//
// Nothing here is typed twice. Every figure is read from the module that drives its demo (or the control room's
// console), so the hero can never drift from the demos below it. If a demo's wording changes so a pattern below
// stops matching, the build fails with a message naming this file instead of shipping a hero that disagrees
// with its demo.
//   Customer Agent       customer/customer-demo.ts `result`, the demo's own result card: 2 min from first
//                        message to booking, 9:47 → 9:49 pm, first reply in 2 seconds, the quoted $165–$265.
//                        Larkfield Plumbing & Air, 18 employees (console-data.ts, read from data/worth.ts).
//   Analyst Agent        analyst/analyst-demo.ts, the "Findings" step's transcript: 3 findings, $46,780 of Q3
//                        margin, about $28,000 a month at September's pace, completed in 3 min 48 s.
//                        Cobalt Creek Supply Co.: its 58 employees are the one value no module carries, so they
//                        are quoted from content/DEMOS.md §2 (the business profile table).
//   Executive Assistant  assistant/data.ts: 63 unread → 6 need you, 57 handled, 5 tasks; `result`: 4 min, 7:30
//                        to 7:34 am; the morning briefing: 5 replies drafted. Coppervale Electric Co., a 25-person
//                        contractor (demos-page/demo-copy.ts).
//   The phone            console/console-data.ts: the Sales Agent's 9 first emails, waiting for the owner's OK
//                        at 9:50 pm on Tuesday, the console's own moment (Larkfield again, so the hero shows
//                        three businesses, as its caption says).
// Every card is labeled "Illustrative example" with the caption and methodology link in Hero.astro (BRIEF.md
// honesty rules, DESIGN.md §6.4).
import { result as customerResult } from '@/components/demos/customer/customer-demo';
import analystDemo from '@/components/demos/analyst/analyst-demo';
import { business as analystBusiness } from '@/components/demos/analyst/data';
import {
  business as assistantBusiness, briefing, handled, needsYou, result as assistantResult, tasks, unread,
} from '@/components/demos/assistant/data';
import { approvals, business as larkfield, clockTime, scene } from '@/components/home/console/console-data';
import { demoCopy } from '@/components/demos-page/demo-copy';
import { getDemo, type DemoId } from '@/data/services';
import type { IconName } from '@/components/ui/icons';

/** Reads one value out of a demo's text, or stops the build: the hero must never disagree with its demo. */
function read(text: string | undefined, pattern: RegExp, what: string): RegExpMatchArray {
  const hit = text?.match(pattern);
  if (!hit) {
    throw new Error(
      `Home hero: couldn't find ${what} in the demo data (pattern ${pattern}). The demo's wording changed; ` +
        'update src/components/home/hero/work.ts to match it.',
    );
  }
  return hit;
}

const demo = (id: DemoId) => {
  const d = getDemo(id);
  if (!d) throw new Error(`Home hero: no demo "${id}" in src/data/services.ts.`);
  return d;
};

export type WorkCard = {
  /** The demo the card opens in the player. */
  id: DemoId;
  agent: string;
  icon: IconName;
  /** The fictional business the work happened at (each card is a different one). */
  business: string;
  /** Kind of business and head count: "Home services · 18 staff". */
  kind: string;
  /** How long the agent took ("2 min"), shown with a clock like the demo picker's run times. */
  took: string;
  /** The finished job, in a few words (Fraunces, like a result-card title). */
  title: string;
  /** The specifics, one short line. */
  facts: string;
  /** Status chip: done within rules (sage, check; DESIGN.md §2.4). */
  chip: string;
  /** One-line basis that stays visible (a figure that needs its qualifier). */
  basis?: string;
  /** One more line, shown on hover or keyboard focus. */
  detail: string;
  /** No-JS destination: the same demo on /demos/. With JS the card opens it in the home player instead. */
  href: string;
  /** Accessible name of the card's link. */
  watch: string;
};

const watchName = (id: DemoId) => `Watch the ${demo(id).label} demo`;
const demosHref = (id: DemoId) => `/demos/#${demo(id).anchor}`;

// ---------------------------------------------------------------- Customer Agent: a booked AC repair
const [toBooking, , jobValue] = customerResult.metrics;
const firstMessage = read(toBooking?.basis, /First message (\d{1,2}:\d{2}\s[ap]m)/, 'the first-message time')[1];
const bookedAt = read(toBooking?.basis, /booked (\d{1,2}:\d{2}\s[ap]m)/, 'the booking time')[1];
const firstReply = read(toBooking?.basis, /first reply in (\d+\sseconds?)/, 'the first-reply time')[1];
const [, quoteLow, quoteHigh] = read(
  jobValue?.basis,
  /quoted (\$[\d,]+)[⁠\s]*[–-][⁠\s]*(\$[\d,]+)/,
  'the quoted price range',
);

const customer: WorkCard = {
  id: 'customer',
  agent: demo('customer').label,
  icon: demo('customer').icon,
  business: larkfield.name,
  kind: `Home services · ${larkfield.employees} staff`,
  took: `${toBooking.value} ${toBooking.unit ?? ''}`.trim(),
  title: 'Booked: AC repair',
  facts: `Quoted ${quoteLow} to ${quoteHigh} · office closed`,
  chip: 'Booked',
  detail: `First message at ${firstMessage}, booked at ${bookedAt}. First reply in ${firstReply}.`,
  href: demosHref('customer'),
  watch: watchName('customer'),
};

// ---------------------------------------------------------------- Analyst Agent: three margin leaks
const findingsStep = analystDemo.steps.find((s) => s.label === 'Findings');
const findings = ([] as string[]).concat(findingsStep?.transcript ?? []);
const leakCount = findings.filter((line) => /^\d+\.\s/.test(line)).length;
if (!leakCount) read(undefined, /^\d+\.\s/, 'the numbered findings'); // always throws: no findings, no card
const together = findings.find((line) => line.startsWith('Together:'));
const [, quarterTotal, monthly] = read(
  together,
  /(\$[\d,]+) of Q3 margin, about (\$[\d,]+) a month/,
  'the Q3 and monthly totals',
);
const analystTook = read(together, /Completed in (\d+\smin\s\d+\ss)/, 'the run time')[1];
const firstFinding = findings.find((line) => line.startsWith('1.'));
const leadTitle = read(firstFinding, /^1\.\s+([^.]+)\./, 'the first finding')[1];
const [, leadCost, leadPeriod] = read(firstFinding, /: (\$[\d,]+) in ([A-Z][a-z]{2}[–-][A-Z][a-z]{2})/, 'the first finding’s cost');

const analyst: WorkCard = {
  id: 'analyst',
  agent: demo('analyst').label,
  icon: demo('analyst').icon,
  business: analystBusiness,
  kind: 'Distributor · 58 staff',
  took: analystTook,
  title: `${leakCount} margin leaks found`,
  facts: `About ${monthly} a month at stake`,
  chip: 'Done',
  basis: `${quarterTotal} of Q3 margin, identified, not yet recovered.`,
  detail: `${leadTitle}: ${leadCost} in ${leadPeriod}.`,
  href: demosHref('analyst'),
  watch: watchName('analyst'),
};

// ---------------------------------------------------------------- Executive Assistant: 63 unread → 6
const agentTime = assistantResult.metrics[0];
const [, morningFrom, morningTo] = read(agentTime?.label, /(\d{1,2}:\d{2}) to (\d{1,2}:\d{2}\s[ap]m)/, 'the morning window');
const drafted = read(briefing.lines[0]?.text, /(\d+) replies drafted/, 'the drafted replies')[1];
const coppervaleStaff = read(
  demoCopy.find((d) => d.id === 'assistant')?.promise,
  /(\d+)-person/,
  'Coppervale’s head count',
)[1];

const assistant: WorkCard = {
  id: 'assistant',
  agent: demo('assistant').label,
  icon: demo('assistant').icon,
  business: assistantBusiness,
  kind: `Electrical contractor · ${coppervaleStaff} staff`,
  took: `${agentTime.value} ${agentTime.unit ?? ''}`.trim(),
  title: `${unread} unread → ${needsYou} need you`,
  facts: `${drafted} replies drafted for your OK`,
  chip: 'Sorted',
  detail: `${morningFrom} to ${morningTo}: ${handled} sorted, filed or archived, ${tasks.length} tasks assigned.`,
  href: demosHref('assistant'),
  watch: watchName('assistant'),
};

export const cards: WorkCard[] = [customer, analyst, assistant];

// ---------------------------------------------------------------- The caption, kept true by counting
const words = ['no', 'one', 'two', 'three', 'four', 'five', 'six'];
const say = (n: number) => words[n] ?? String(n);
const businesses = new Set([...cards.map((c) => c.business), larkfield.name]).size;
/** "Results from three simulated demos, at three fictional businesses." */
export const caption = `Results from ${say(cards.length)} simulated demos, at ${say(businesses)} fictional businesses.`;

// ---------------------------------------------------------------- The six agents, each opening its demo
export const agents = demoCopy.map((d) => ({
  id: d.id,
  short: d.short,
  icon: d.icon,
  href: demosHref(d.id),
  watch: watchName(d.id),
}));

// ---------------------------------------------------------------- The phone: the one thing waiting on you
const sales = approvals.find((a) => a.id === 'sales');
if (!sales?.email) throw new Error('Home hero: the console has no Sales Agent request to show on the phone.');
const emailCount = read(sales.what, /^(\d+)/, 'the number of first emails')[1];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const phone = {
  /** The console's scene date (console-data.ts SCENE_DATE; the Customer demo books Wed, Jul 15). */
  date: `${WEEKDAYS[scene.day % 7]}, July 14`,
  /** Lock-screen clock: the console's 9:50 pm, without the am/pm a lock screen leaves out. */
  time: clockTime(scene.minutes).replace(/\s?[ap]m$/, ''),
  timeFull: clockTime(scene.minutes),
  agent: getDemo('sales')?.label ?? 'Sales Agent',
  ask: `${emailCount} first emails are ready for your OK.`,
  preview: {
    to: sales.email.to,
    line: sales.email.body[0].split('[1]')[0].trim(),
    sources: `${sales.email.sources.length} facts, sourced`,
  },
  approved: `Approved. ${sales.done.approved.text}`,
};
