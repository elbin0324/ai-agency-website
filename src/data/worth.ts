// "What it's worth": one worked example per service, on fictional businesses.
// Structure and narrative follow content/SCENARIOS.md section 2. Founder decision 2026-10-14 ("show
// the upside"): larger businesses where it fits, revenue-side levers counted next to hours, and each
// value shown as a range from a BASE case to an UPSIDE case. Source ids resolve in src/data/benchmarks.ts.
// Savings are task-level workflows, never whole-job replacement. Gross value before any fees.
//
// The two cases:
// - Base case: every rate is the BASE value in content/BENCHMARKS.md ("Recommended model assumptions").
// - Upside case: the rates that describe what the agents achieve move to the OPTIMISTIC column, all at
//   once: resolution rates, the share of missed requests that would be lost, booking rates, task time
//   reductions, ad-optimization gains, savings rates and the share of a saving counted in year one.
//   Never beyond the optimistic column. The business's own figures stay the same in both cases:
//   volumes, wages, tickets, margins, close rates.
//
// Rules used throughout:
// - 4 working weeks a month; annual value = monthly value x 12.
// - Time is valued at the loaded hourly costs in BENCHMARKS.md's labor table (OEWS national median x
//   ECEC multiplier), taken as listed; for the mid-size businesses this slightly understates wages.
// - Task time reductions from BENCHMARKS.md are already net of human review, so no extra review
//   allowance is taken on them. Work an agent completes on its own (customer conversations) has 20% set
//   aside for review and handoffs.
// - Revenue levers count only their gross profit in the value. The revenue itself is reported separately
//   as addedRevenue and never added to the value. Billing and price fixes on work already done carry no
//   extra cost, so all of that revenue is gross profit.
// - Hours are rounded down per role; dollars are computed from the rounded hours and rounded down to
//   whole dollars. Rounding never inflates a result.
//
// Math rows: the base case first, ending with "Annual value"; then the upside rows (upside: true, label
// prefixed "Upside · ", so a plain MathLedger still reads correctly), ending with "Upside · annual value".
// Other components read some base rows by label (consulting levers "Pricing:" … "Software:", "Identified",
// "Counted in year one"; sales "Prospecting time today/after", plus the baseline "… emails a month" and
// "Rep time per email" rows and the after row "… realistically yields" (services/sales/SalesWorth);
// marketing "Leads today", "Cost per lead after", "Extra leads"; every "Annual value"). Keep those
// labels, and never start an upside label with "Word:". levers splits each case's annual value by
// source; its columns sum to annualValue and upside.annualValue.
// Larkfield (customer) stays an 18-person company on purpose: the home hero console and the day story
// are built on its volumes (src/components/home/hero/console-data.ts, home/daystory/day-data.ts).
// Dependency-free on purpose (no imports, no enums) so Node can import it directly.

export type MathRow = { label: string; formula?: string; value: string; kind?: 'step' | 'total' | 'context'; upside?: boolean };
export type LeverKind = 'time' | 'growth' | 'savings';
/** Annual value from one source. time = hours valued; growth = gross profit on added revenue; savings = lower costs. */
export type Lever = { label: string; kind: LeverKind; base: number; upside: number };

/** Display names and chart slots for each kind of value (DESIGN.md §3.1: slots in order). */
export const leverKinds: Record<LeverKind, { label: string; viz: string }> = {
  time: { label: 'Team time', viz: 'var(--viz-1)' },
  growth: { label: 'Added gross profit', viz: 'var(--viz-2)' },
  savings: { label: 'Cost savings', viz: 'var(--viz-3)' },
};

export type WorthExample = {
  id: 'customer' | 'analyst' | 'assistant' | 'marketing' | 'sales' | 'consulting';
  service: string;
  business: string;
  profile: string;
  summary: string;
  baseline: { label: string; value: string }[];
  after: { label: string; value: string }[];
  math: MathRow[];
  /** Base case. */
  hoursPerMonth?: number;
  monthlyValue: number;
  annualValue: number;
  upside: { hoursPerMonth?: number; monthlyValue: number; annualValue: number };
  /** Added revenue a year, reported separately (only its gross profit is in the value). */
  addedRevenue?: { base: number; upside: number; note: string };
  levers: Lever[];
  label: 'Illustrative example' | 'Modeled estimate';
  assumptions: string[];
  sources: string[];
};

export const worthExamples: WorthExample[] = [
  {
    id: 'customer',
    service: 'AI Agents · Customer Agent',
    business: 'Larkfield Plumbing & Air',
    profile:
      'Fictional residential plumbing, heating and cooling company: 18 employees (owner, office manager, 2 customer service reps, 12 technicians, 2 apprentices), $3M-$4M revenue, phone, text, web chat, email and field-service scheduling software.',
    summary:
      'The Customer Agent answers routine inquiries end to end, picks up calls nobody gets to and replies to after-hours web requests in under a minute, so fewer new jobs go to a competitor.',
    baseline: [
      { label: 'Customer inquiries a month', value: '1,200 (600 calls, 600 online)' },
      { label: 'Staff time on inquiries', value: '100 hours a month (5 minutes each)' },
      { label: 'Calls nobody answers', value: '84 a month (14%)' },
      { label: 'Online inquiries after hours', value: '240 a month (40%), wait until morning' },
      { label: 'New-job requests', value: '30% of inquiries' },
      { label: 'Average service call', value: '$341 at a 40% gross margin' },
    ],
    after: [
      { label: 'Resolved without staff', value: '330 a month (upside 510)' },
      { label: 'Staff hours back', value: '22 a month after review time (upside 34)' },
      { label: 'Replies after hours and to missed calls', value: 'Under a minute, 24/7' },
      { label: 'Jobs no longer lost', value: '11.8 a month (upside 28.1)' },
    ],
    math: [
      { label: 'Staff time on inquiries today', formula: '1,200 × 5 ÷ 60', value: '100 hours' },
      { label: 'Resolved by the agent', formula: '600 × 20% + 600 × 35%', value: '330 inquiries' },
      { label: 'Staff time those took', formula: '330 × 5 ÷ 60', value: '27.5 hours' },
      { label: 'Less 20% for review and handoffs', formula: '27.5 × 80%', value: '22 hours back' },
      { label: 'Value of that time (customer service rep, $29/h loaded)', formula: '22 × $29', value: '$638' },
      { label: 'After-hours new-job requests', formula: '600 × 40% × 30%', value: '72 a month' },
      { label: 'Jobs recovered after hours (40% lost for good; 40% of those book)', formula: '72 × 40% × 40%, rounded down', value: '11 jobs' },
      { label: 'Missed calls that are new-job requests', formula: '600 × 14% × 30%', value: '25.2 a month' },
      { label: 'Jobs recovered from missed calls (40% lost; agent completes 20%; 40% book)', formula: '25.2 × 40% × 20% × 40%', value: '0.8 jobs' },
      { label: 'Added revenue', formula: '(11 + 0.8) × $341', value: '$4,023' },
      { label: 'Gross profit from recovered jobs', formula: '11 × $341 × 40% + 0.8 × $341 × 40%', value: '$1,609' },
      { label: 'Monthly value', formula: '$638 + $1,609', value: '$2,247' },
      { label: 'Annual value', formula: '$2,247 × 12', value: '$26,964' },
      { label: 'Upside · resolved by the agent (35% of calls, 50% online)', formula: '600 × 35% + 600 × 50%', value: '510 inquiries', upside: true },
      { label: 'Upside · staff hours back after review', formula: '510 × 5 ÷ 60 × 80%', value: '34 hours', upside: true },
      { label: 'Upside · value of that time', formula: '34 × $29', value: '$986', upside: true },
      { label: 'Upside · jobs recovered after hours (60% lost; 60% book)', formula: '72 × 60% × 60%, rounded down', value: '25 jobs', upside: true },
      { label: 'Upside · jobs from missed calls (60% lost; agent completes 35%; 60% book)', formula: '25.2 × 60% × 35% × 60%', value: '3.1 jobs', upside: true },
      { label: 'Upside · added revenue', formula: '(25 + 3.1) × $341', value: '$9,582', upside: true },
      { label: 'Upside · gross profit', formula: '25 × $341 × 40% + 3.1 × $341 × 40%', value: '$3,832', upside: true },
      { label: 'Upside · monthly value', formula: '$986 + $3,832', value: '$4,818', kind: 'total', upside: true },
      { label: 'Upside · annual value', formula: '$4,818 × 12', value: '$57,816', kind: 'total', upside: true },
    ],
    hoursPerMonth: 22,
    monthlyValue: 2247,
    annualValue: 26964,
    upside: { hoursPerMonth: 34, monthlyValue: 4818, annualValue: 57816 },
    addedRevenue: { base: 48276, upside: 114984, note: 'from jobs that no longer go to a competitor. Only the 40% gross margin is counted.' },
    levers: [
      { label: 'Staff time on routine inquiries', kind: 'time', base: 7656, upside: 11832 },
      { label: 'Jobs recovered after hours', kind: 'growth', base: 18000, upside: 40920 },
      { label: 'Jobs recovered from missed calls', kind: 'growth', base: 1308, upside: 5064 },
    ],
    label: 'Modeled estimate',
    assumptions: [
      'The agent resolves 35% of online conversations and 20% of phone calls with no staff touch (base); 50% and 35% in the upside case.',
      '5 staff minutes per routine conversation; customer service rep time at $29 an hour loaded ($21.53 median × 1.35).',
      '14% of calls reach no one, 40% of online inquiries arrive after hours and 30% of inquiries are new-job requests. These describe the business, so they stay the same in both cases.',
      'Of the new-job requests nobody answers, 40% are lost for good and 40% of those would have booked (upside 60% and 60%). On calls, the agent completes 20% (upside 35%).',
      'Average plumbing service call $341 (revenue) at a 40% service gross margin; only gross profit is counted.',
      'Not counted: estimate follow-ups, maintenance-plan renewals, review requests.',
    ],
    sources: ['lab-01', 'lab-06', 'cx-09', 'cx-10', 'cx-11', 'cx-16', 'cx-34', 'cx-27', 'cx-22', 'cx-23', 'cx-26', 'cx-25', 'cx-21', 'cx-30', 'pnl-16'],
  },
  {
    id: 'analyst',
    service: 'AI Agents · Analyst Agent',
    business: 'Greenhollow Landscape Co.',
    profile:
      'Fictional commercial and residential landscaper: 110 employees across three branches (92 crew, 18 office and management), $14M-$18M revenue, QuickBooks Online, Excel, a crew time-tracking app and estimating spreadsheets.',
    summary:
      'The Analyst Agent pulls and cleans the monthly exports, drafts the report narrative, flags finished extra work that never reached an invoice and shows which kinds of jobs are underpriced.',
    baseline: [
      { label: 'Accounting team on month-end reporting', value: '80 hours a month (48 cleanup, 32 report building)' },
      { label: 'Operations managers on spreadsheets', value: '50 hours a month (30 job costing, 20 owner questions)' },
      { label: 'Month-end close', value: 'About 6.4 days (the benchmark median)' },
      { label: 'Extra work done but not invoiced', value: '$6,000 a month' },
      { label: 'Bid work priced from estimating spreadsheets', value: '$10,000,000 a year' },
    ],
    after: [
      { label: 'Accounting hours back', value: '8 a month (upside 20)' },
      { label: 'Operations hours back', value: '8 a month (upside 16)' },
      { label: 'Month-end close', value: 'About 1 day sooner (upside 1.6)' },
      { label: 'Unbilled extra work recovered', value: '$3,000 a month (upside $4,500)' },
      { label: 'Realized prices on bid work', value: '0.5% higher (upside 1%)' },
    ],
    math: [
      { label: 'Accounting: data cleanup', formula: '48 × 10%', value: '4.8 hours' },
      { label: 'Accounting: recurring report building', formula: '32 × 10%', value: '3.2 hours' },
      { label: 'Accounting hours back', formula: '4.8 + 3.2', value: '8 hours' },
      { label: 'Operations: job-cost spreadsheets', formula: '30 × 10%', value: '3 hours' },
      { label: 'Operations: summaries for the owner', formula: '20 × 25%', value: '5 hours' },
      { label: 'Operations hours back', formula: '3 + 5', value: '8 hours' },
      { label: 'Value of time (bookkeeper $32/h, operations manager $68/h)', formula: '8 × $32 + 8 × $68', value: '$800' },
      { label: 'Recovered billing (half of what is flagged)', formula: '$6,000 × 50%', value: '$3,000' },
      { label: 'Better-priced bids (0.5% higher realized price; half counted in year one)', formula: '$10,000,000 × 0.5% × 50% ÷ 12', value: '$2,083' },
      { label: 'Monthly value', formula: '$800 + $3,000 + $2,083', value: '$5,883' },
      { label: 'Annual value', formula: '$5,883 × 12', value: '$70,596' },
      { label: 'Upside · accounting hours back (cleanup and reports 25% faster)', formula: '(48 + 32) × 25%', value: '20 hours', upside: true },
      { label: 'Upside · operations hours back (job costing 25%, summaries 45% faster)', formula: '30 × 25% + 20 × 45%, rounded down', value: '16 hours', upside: true },
      { label: 'Upside · value of time', formula: '20 × $32 + 16 × $68', value: '$1,728', upside: true },
      { label: 'Upside · recovered billing (75% of what is flagged)', formula: '$6,000 × 75%', value: '$4,500', upside: true },
      { label: 'Upside · better-priced bids (1%; 75% counted in year one)', formula: '$10,000,000 × 1% × 75% ÷ 12', value: '$6,250', upside: true },
      { label: 'Upside · monthly value', formula: '$1,728 + $4,500 + $6,250', value: '$12,478', kind: 'total', upside: true },
      { label: 'Upside · annual value', formula: '$12,478 × 12', value: '$149,736', kind: 'total', upside: true },
    ],
    hoursPerMonth: 16,
    monthlyValue: 5883,
    annualValue: 70596,
    upside: { hoursPerMonth: 36, monthlyValue: 12478, annualValue: 149736 },
    addedRevenue: { base: 60996, upside: 129000, note: 'from recovered billing and better-priced bids. The work is already done or costs the same, so all of it is gross profit.' },
    levers: [
      { label: 'Accounting and operations time', kind: 'time', base: 9600, upside: 20736 },
      { label: 'Unbilled extra work recovered', kind: 'growth', base: 36000, upside: 54000 },
      { label: 'Better-priced bids', kind: 'growth', base: 24996, upside: 75000 },
    ],
    label: 'Illustrative example',
    assumptions: [
      'Measured time savings are small for spreadsheet work: 10% on recurring cleanup and report building and 25% on summaries in the base case; 25% and 45% in the upside case (net of human review).',
      'Bookkeeping clerk time at $32 an hour loaded; operations manager at $68 (OEWS medians × 1.35).',
      'Half of the flagged unbilled work is invoiced and collected in the year (upside 75%); the work is already done, so it counts as margin.',
      'Job costing shows which kinds of jobs are underpriced: realized prices on new bid work rise 0.5% (upside 1%), with half (upside 75%) counted in year one.',
      'Close cycle 1 day shorter (upside 1.6) is a modeled target, not a measured automation effect.',
      'Not counted: faster decisions from timely reports, the owner\'s own time.',
    ],
    sources: ['lab-01', 'lab-06', 'ai-06', 'ai-21', 'ai-23', 'ai-20', 'time-06', 'pnl-01', 'pnl-30', 'pnl-15', 'pnl-18'],
  },
  {
    id: 'assistant',
    service: 'AI Agents · Executive Assistant Agent',
    business: 'Lanternfield Insurance Agency',
    profile:
      'Fictional independent property and casualty agency: 60 employees (owner, 12 producers, 30 account managers, office manager, marketing coordinator, 15 customer service reps), $9M-$11M in commissions, Microsoft 365 and an agency management system.',
    summary:
      'The Executive Assistant Agent triages the team\'s inboxes, drafts replies for approval, writes meeting briefs and action-item summaries, and builds a first draft of the monthly leadership deck.',
    baseline: [
      { label: 'Owner email time', value: '28 hours a month (7 a week)' },
      { label: 'Owner meeting prep and briefs', value: '12 hours a month' },
      { label: 'Producer email time (12 producers)', value: '336 hours a month (7 a week each)' },
      { label: 'Account manager email time (30 account managers)', value: '840 hours a month (7 a week each)' },
      { label: 'Office manager: leadership deck', value: '10 hours a month' },
      { label: 'Office manager: notes and task follow-up', value: '12 hours a month' },
    ],
    after: [
      { label: 'Owner hours back', value: '7 a month (upside 11)' },
      { label: 'Producer hours back', value: '50 a month in total (upside 67)' },
      { label: 'Account manager hours back', value: '126 a month in total (upside 168)' },
      { label: 'Office manager hours back', value: '3 a month (upside 7)' },
      { label: 'Per producer or account manager', value: 'About 1 hour a week (upside 1.4)' },
    ],
    math: [
      { label: 'Owner: email workload', formula: '28 × 15%', value: '4.2 hours' },
      { label: 'Owner: meeting briefs and summaries', formula: '12 × 25%', value: '3 hours' },
      { label: 'Owner hours back (rounded down)', formula: '4.2 + 3', value: '7 hours' },
      { label: 'Producers: email workload (rounded down)', formula: '12 × 7 × 4 × 15%', value: '50 hours' },
      { label: 'Account managers: email workload', formula: '30 × 7 × 4 × 15%', value: '126 hours' },
      { label: 'Office manager: deck', formula: '10 × 5%', value: '0.5 hours' },
      { label: 'Office manager: notes and follow-up', formula: '12 × 25%', value: '3 hours' },
      { label: 'Office manager hours back (rounded down)', formula: '0.5 + 3', value: '3 hours' },
      { label: 'Hours back', formula: '7 + 50 + 126 + 3', value: '186 hours' },
      { label: 'Value of time (owner $68, producers $43, account managers $29, office manager $30)', formula: '7 × $68 + 50 × $43 + 126 × $29 + 3 × $30', value: '$6,370' },
      { label: 'Annual value', formula: '$6,370 × 12', value: '$76,440' },
      { label: 'Upside · owner (email 20%, briefs 45% faster)', formula: '28 × 20% + 12 × 45%', value: '11 hours', upside: true },
      { label: 'Upside · producers (email 20% lower, rounded down)', formula: '12 × 7 × 4 × 20%', value: '67 hours', upside: true },
      { label: 'Upside · account managers (email 20% lower)', formula: '30 × 7 × 4 × 20%', value: '168 hours', upside: true },
      { label: 'Upside · office manager (deck 20%, notes 45% faster; rounded down)', formula: '10 × 20% + 12 × 45%', value: '7 hours', upside: true },
      { label: 'Upside · hours back', formula: '11 + 67 + 168 + 7', value: '253 hours', upside: true },
      { label: 'Upside · value of time', formula: '11 × $68 + 67 × $43 + 168 × $29 + 7 × $30', value: '$8,711', upside: true },
      { label: 'Upside · annual value', formula: '$8,711 × 12', value: '$104,532', kind: 'total', upside: true },
    ],
    hoursPerMonth: 186,
    monthlyValue: 6370,
    annualValue: 76440,
    upside: { hoursPerMonth: 253, monthlyValue: 8711, annualValue: 104532 },
    levers: [
      { label: 'Account managers\' time', kind: 'time', base: 43848, upside: 58464 },
      { label: 'Producers\' time', kind: 'time', base: 25800, upside: 34572 },
      { label: 'Owner and office manager time', kind: 'time', base: 6792, upside: 11496 },
    ],
    label: 'Illustrative example',
    assumptions: [
      '7 hours a week of email per person (base; the measured large-firm figure is 11.65). It describes the team, so it stays the same in both cases.',
      'Email workload 15% lower for active users, summaries 25% faster, slide decks 5% faster (net of review); 20%, 45% and 20% in the upside case.',
      'Producers and account managers get back about 1 to 1.4 hours a week each, under the evidence ceiling on routine admin time returned (2 hours base, 4.9 upside).',
      'Owner valued at a general and operations manager\'s $68 an hour; producers at a services sales rep\'s $43; account managers at a customer service rep\'s $29; office manager at an administrative assistant\'s $30.',
      'Not counted: new policies and renewals written with the time back, fewer missed follow-ups.',
    ],
    sources: ['lab-01', 'lab-06', 'lab-07', 'time-01', 'time-02', 'ai-15', 'ai-20', 'ai-21', 'ai-23'],
  },
  {
    id: 'marketing',
    service: 'AI Marketing Director',
    business: 'Juniper Lane Kitchen & Bath',
    profile:
      'Fictional kitchen and bathroom remodeler: 75 employees (owner, 8 designers, project managers, installers, office staff and a two-person marketing team), $18M-$22M revenue, $27,000 a month in search ads.',
    summary:
      'The AI Marketing Director audits campaigns daily, cuts spend that produces nothing, runs controlled tests and moves budget to what works, within limits the owner sets.',
    baseline: [
      { label: 'Monthly ad spend', value: '$27,000' },
      { label: 'Cost per lead', value: 'About $90 (home services median)' },
      { label: 'Leads a month', value: '300' },
      { label: 'Close rate and average job', value: '10% of leads; $12,000 at a 30% gross margin' },
      { label: 'Marketing team on reports and ad copy', value: '50 hours a month (30 reports, 20 copy and briefs)' },
    ],
    after: [
      { label: 'Cost per lead after 60-90 days', value: 'About $81, 10% lower (upside $72)' },
      { label: 'Leads a month, same spend', value: '333, +33 (upside 375)' },
      { label: 'Extra jobs', value: '3.3 a month (upside 7.5)' },
      { label: 'Marketing team hours back', value: '7 a month (upside 14)' },
    ],
    math: [
      { label: 'Leads today', formula: '$27,000 ÷ $90', value: '300' },
      { label: 'Cost per lead after optimization', formula: '$90 × (1 − 10%)', value: '$81' },
      { label: 'Extra leads at the same spend (rounded down)', formula: '$27,000 ÷ $81 − 300', value: '33' },
      { label: 'Extra jobs at today\'s close rate', formula: '33 × 10%', value: '3.3' },
      { label: 'Added revenue', formula: '3.3 × $12,000', value: '$39,600' },
      { label: 'Gross profit', formula: '$39,600 × 30%', value: '$11,880' },
      { label: 'Marketing team: recurring reports', formula: '30 × 10%', value: '3 hours' },
      { label: 'Marketing team: ad copy and briefs', formula: '20 × 20%', value: '4 hours' },
      { label: 'Value of time (marketing specialist, $51/h)', formula: '7 × $51', value: '$357' },
      { label: 'Monthly value', formula: '$11,880 + $357', value: '$12,237' },
      { label: 'Annual value', formula: '$12,237 × 12', value: '$146,844' },
      { label: 'Upside · cost per lead (20% lower)', formula: '$90 × (1 − 20%)', value: '$72', upside: true },
      { label: 'Upside · extra leads at the same spend', formula: '$27,000 ÷ $72 − 300', value: '75', upside: true },
      { label: 'Upside · extra jobs', formula: '75 × 10%', value: '7.5', upside: true },
      { label: 'Upside · added revenue', formula: '7.5 × $12,000', value: '$90,000', upside: true },
      { label: 'Upside · gross profit', formula: '$90,000 × 30%', value: '$27,000', upside: true },
      { label: 'Upside · marketing team (reports 25%, copy 35% faster; rounded down)', formula: '30 × 25% + 20 × 35% = 14 hours × $51', value: '$714', upside: true },
      { label: 'Upside · monthly value', formula: '$27,000 + $714', value: '$27,714', kind: 'total', upside: true },
      { label: 'Upside · annual value', formula: '$27,714 × 12', value: '$332,568', kind: 'total', upside: true },
    ],
    hoursPerMonth: 7,
    monthlyValue: 12237,
    annualValue: 146844,
    upside: { hoursPerMonth: 14, monthlyValue: 27714, annualValue: 332568 },
    addedRevenue: { base: 475200, upside: 1080000, note: 'from extra remodeling jobs at the same ad spend. Only the 30% gross margin is counted.' },
    levers: [
      { label: 'Marketing team time', kind: 'time', base: 4284, upside: 8568 },
      { label: 'More leads at the same spend', kind: 'growth', base: 142560, upside: 324000 },
    ],
    label: 'Modeled estimate',
    assumptions: [
      'We model 10% lower cost per lead after 60-90 days of disciplined optimization (upside 20%); no study measures this directly.',
      'Starting cost per lead about $90, the home-services search median.',
      'Close rate stays at 10%; average job $12,000 at a 30% gross margin (the low end of specialty-trade margins). Only gross profit is counted.',
      'Marketing team time at a marketing specialist\'s $51 an hour; reports 10% faster and first drafts 20% faster (upside 25% and 35%).',
      'Not counted: wins from individual tests (most tests produce no significant winner), better lead quality, any choice to lower spend.',
    ],
    sources: ['mkt-01', 'mkt-02', 'mkt-19', 'mkt-14', 'mkt-15', 'mkt-16', 'lab-01', 'lab-06', 'pnl-16', 'ai-06', 'ai-24'],
  },
  {
    id: 'sales',
    service: 'AI Sales Agent',
    business: 'Wrenfield Commercial Cleaning',
    profile:
      'Fictional janitorial company for offices, medical clinics and schools: 230 employees (196 cleaning staff, 20 supervisors, 14 office and management including 3 business-development reps), $10M-$12M revenue, Google Workspace and a CRM.',
    summary:
      'The AI Sales Agent builds the prospect list, researches each business and drafts a specific first email; a rep reviews and approves every one, and sending stays within deliverability and CAN-SPAM limits.',
    baseline: [
      { label: 'Researched first emails a month', value: '540' },
      { label: 'Rep time per email', value: '10 minutes (research and writing)' },
      { label: 'Rep time on prospecting', value: '90 hours a month (30 per rep, about 19% of each rep\'s month)' },
      { label: 'Typical contract', value: '$1,000 a month' },
    ],
    after: [
      { label: 'Rep time per email', value: '6.5 minutes to review and approve (upside 6)' },
      { label: 'Rep time on prospecting', value: '58.5 hours a month (upside 54)' },
      { label: 'Hours back', value: '31 a month across the three reps (upside 36)' },
      { label: 'Pipeline this outreach realistically yields', value: 'About 4.5 to 9.7 held meetings and 1.8 to 4.3 qualified opportunities a year' },
    ],
    math: [
      { label: 'Prospecting time today', formula: '540 × 10 ÷ 60', value: '90 hours' },
      { label: 'Time per email with the agent', formula: '10 × (1 − 35%)', value: '6.5 minutes' },
      { label: 'Prospecting time after', formula: '540 × 6.5 ÷ 60', value: '58.5 hours' },
      { label: 'Hours back (rounded down)', formula: '90 − 58.5', value: '31 hours' },
      { label: 'Value of time (services sales rep, $43/h)', formula: '31 × $43', value: '$1,333' },
      { label: 'Annual value', formula: '$1,333 × 12', value: '$15,996' },
      { label: 'For context: held meetings a year from this outreach', formula: '540 × 12 × 0.7 ÷ 1,000', value: 'About 4.5' },
      { label: 'For context: qualified opportunities a year', formula: '4.5 × 40%', value: 'About 1.8' },
      { label: 'Upside · time per email with the agent (40% faster)', formula: '10 × (1 − 40%)', value: '6 minutes', upside: true },
      { label: 'Upside · hours back', formula: '90 − 540 × 6 ÷ 60', value: '36 hours', upside: true },
      { label: 'Upside · value of time', formula: '36 × $43', value: '$1,548', upside: true },
      { label: 'Upside · annual value', formula: '$1,548 × 12', value: '$18,576', kind: 'total', upside: true },
      { label: 'For context: upside held meetings a year', formula: '540 × 12 × 1.5 ÷ 1,000', value: 'About 9.7', upside: true },
      { label: 'For context: upside qualified opportunities a year', formula: '9.7 × 45%', value: 'About 4.3', upside: true },
    ],
    hoursPerMonth: 31,
    monthlyValue: 1333,
    annualValue: 15996,
    upside: { hoursPerMonth: 36, monthlyValue: 1548, annualValue: 18576 },
    levers: [
      { label: 'Rep time on prospecting', kind: 'time', base: 15996, upside: 18576 },
    ],
    label: 'Modeled estimate',
    assumptions: [
      '10 minutes of manual research and writing per personalized first email; AI cuts the rep\'s time by 35% (upside 40%, the figure measured in a writing trial).',
      'Rep time at a services sales rep\'s loaded $43 an hour ($33.65 median × 1.30).',
      'Cold email is a slow channel: about 0.7 held meetings per 1,000 prospects for a quality-first approach (upside 1.5), and 40% of held meetings become a qualified opportunity (upside 45%). The reps send this volume today, so the agent changes how long each email takes, not how many go out: the pipeline is shown for context and not counted in the value.',
      'Contract value $1,000 a month (small office), first-year value only if one closes. The calculator models new contracts with your own deal size and margin.',
      'Not counted: any contracts won, renewals, referrals and upsells.',
    ],
    sources: ['sales-20', 'sales-21', 'ai-03', 'sales-11', 'lab-01', 'lab-07', 'lab-15', 'sales-04', 'sales-07', 'sales-09', 'sales-22', 'sales-27', 'sales-16'],
  },
  {
    id: 'consulting',
    service: 'AI Consulting',
    business: 'Corran Valley Metalworks',
    profile:
      'Fictional custom metal fabricator: 160 employees (shop floor, engineering, purchasing, sales and office), about $30M revenue, EBITDA about $2.4M (8.0%), accounting and ERP exports, payroll reports and quoting spreadsheets.',
    summary:
      'AI Consulting analyzes the ledger, vendor spend, overtime, quotes against actual job costs and software seats, then ranks each opportunity and delivers a 90-day roadmap.',
    baseline: [
      { label: 'Revenue and EBITDA', value: '$30,000,000; $2,400,000 (8.0%)' },
      { label: 'Materials; freight; software', value: '$12,000,000; $1,200,000; $240,000' },
      { label: 'Overtime pay', value: '$900,000 a year' },
      { label: 'Quoted from stale material costs', value: '$6,000,000 of revenue a year' },
      { label: 'Controller on margin reports', value: '30 hours a month' },
    ],
    after: [
      { label: 'Savings identified', value: '$348,000 a year (upside $708,000)' },
      { label: 'Counted in year one', value: '$186,000 (upside $543,000)' },
      { label: 'EBITDA with counted savings', value: '$2,586,000, 8.62% (upside 9.81%)' },
      { label: 'Controller hours back', value: '3 a month (upside 7)' },
    ],
    math: [
      { label: 'Pricing: reprice quotes on current material costs', formula: '$6,000,000 × 2% = $120,000; count half', value: '$60,000' },
      { label: 'Overtime: better scheduling and realistic lead times', formula: '$900,000 × 10% = $90,000; count half', value: '$45,000' },
      { label: 'Materials: renegotiate and consolidate suppliers', formula: '$12,000,000 × 0.75% = $90,000; count half', value: '$45,000' },
      { label: 'Freight: consolidate and rebid carriers', formula: '$1,200,000 × 2% = $24,000; count half', value: '$12,000' },
      { label: 'Software: cancel unused seats', formula: '$240,000 × 10% = $24,000; in the client\'s control', value: '$24,000' },
      { label: 'Identified', formula: '$120,000 + $90,000 + $90,000 + $24,000 + $24,000', value: '$348,000' },
      { label: 'Counted in year one', formula: '$60,000 + $45,000 + $45,000 + $12,000 + $24,000', value: '$186,000' },
      { label: 'Counted savings per month', formula: '$186,000 ÷ 12', value: '$15,500' },
      { label: 'Controller: recurring margin report', formula: '30 × 10% = 3 hours × $54 (accountant)', value: '$162' },
      { label: 'Monthly value', formula: '$15,500 + $162', value: '$15,662' },
      { label: 'Annual value', formula: '$15,662 × 12', value: '$187,944' },
      { label: 'EBITDA margin with counted savings', formula: '($2,400,000 + $186,000) ÷ $30,000,000', value: '8.62%' },
      { label: 'Upside · pricing at 4%, 75% counted', formula: '$6,000,000 × 4% = $240,000 × 75%', value: '$180,000', upside: true },
      { label: 'Upside · overtime at 20%, 75% counted', formula: '$900,000 × 20% = $180,000 × 75%', value: '$135,000', upside: true },
      { label: 'Upside · materials at 1.5%, 75% counted', formula: '$12,000,000 × 1.5% = $180,000 × 75%', value: '$135,000', upside: true },
      { label: 'Upside · freight at 5%, 75% counted', formula: '$1,200,000 × 5% = $60,000 × 75%', value: '$45,000', upside: true },
      { label: 'Upside · software at 20%, counted in full', formula: '$240,000 × 20%', value: '$48,000', upside: true },
      { label: 'Upside · identified', formula: '$240,000 + $180,000 + $180,000 + $60,000 + $48,000', value: '$708,000', upside: true },
      { label: 'Upside · counted in year one', formula: '$180,000 + $135,000 + $135,000 + $45,000 + $48,000', value: '$543,000', upside: true },
      { label: 'Upside · controller (reports 25% faster)', formula: '30 × 25% = 7 hours (rounded down) × $54', value: '$378', upside: true },
      { label: 'Upside · monthly value', formula: '$543,000 ÷ 12 + $378', value: '$45,628', kind: 'total', upside: true },
      { label: 'Upside · annual value', formula: '$45,628 × 12', value: '$547,536', kind: 'total', upside: true },
      { label: 'Upside · EBITDA margin', formula: '($2,400,000 + $543,000) ÷ $30,000,000', value: '9.81%', upside: true },
    ],
    hoursPerMonth: 3,
    monthlyValue: 15662,
    annualValue: 187944,
    upside: { hoursPerMonth: 7, monthlyValue: 45628, annualValue: 547536 },
    addedRevenue: { base: 60000, upside: 180000, note: 'from repricing quotes on current material costs. The jobs cost the same, so all of it is gross profit.' },
    levers: [
      { label: 'Controller time', kind: 'time', base: 1944, upside: 4536 },
      { label: 'Pricing on stale-cost quotes', kind: 'growth', base: 60000, upside: 180000 },
      { label: 'Materials, freight and software', kind: 'savings', base: 81000, upside: 228000 },
      { label: 'Overtime', kind: 'savings', base: 45000, upside: 135000 },
    ],
    label: 'Modeled estimate',
    assumptions: [
      'Base lever rates: 2% repricing on stale metal quotes, 10% of overtime pay, 0.75% of materials spend, 2% of freight, 10% of software spend. Upside: 4%, 20%, 1.5%, 5% and 20%.',
      'Half of each saving that depends on negotiation, customer acceptance or a ramp-up is counted in year one (upside 75%); cancelling unused software seats is counted in full.',
      'Controller time valued at an accountant\'s $54 an hour, below a controller\'s.',
      'Not counted: the rest of the identified savings, revenue growth from faster, more accurate quotes.',
    ],
    sources: ['pnl-29', 'pnl-26', 'pnl-25', 'pnl-18', 'pnl-17', 'pnl-28', 'pnl-04', 'pnl-05', 'pnl-15', 'pnl-08', 'pnl-16', 'lab-01', 'lab-06', 'ai-06'],
  },
];

export function getWorth(id: string): WorthExample | undefined {
  return worthExamples.find((e) => e.id === id);
}
