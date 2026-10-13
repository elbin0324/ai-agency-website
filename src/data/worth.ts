// "What it's worth": one worked example per service, on fictional businesses.
// Structure and narrative follow content/SCENARIOS.md section 2; every rate is the
// BASE value from content/BENCHMARKS.md "Recommended model assumptions" (source ids
// resolve in src/data/benchmarks.ts). Savings are task-level workflows, never
// whole-job replacement. Gross value before any fees.
//
// Rules used throughout:
// - 4 working weeks a month; annual value = monthly value x 12.
// - Time is valued at loaded cost (OEWS national median x ECEC multiplier).
// - Task time reductions from BENCHMARKS.md are already net of human review, so
//   no extra review allowance is taken on them. Work an agent completes on its
//   own (customer conversations) has 20% set aside for review and handoffs.
// - Hours are rounded down per role; dollars are computed from the rounded hours
//   and rounded down to whole dollars. Rounding never inflates a result.
// Dependency-free on purpose (no imports, no enums) so Node can import it directly.

export type MathRow = { label: string; formula?: string; value: string };

export type WorthExample = {
  id: 'customer' | 'analyst' | 'assistant' | 'marketing' | 'sales' | 'consulting';
  service: string;
  business: string;
  profile: string;
  summary: string;
  baseline: { label: string; value: string }[];
  after: { label: string; value: string }[];
  math: MathRow[];
  hoursPerMonth?: number;
  monthlyValue: number;
  annualValue: number;
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
      'The Customer Agent answers routine inquiries end to end and replies to after-hours web requests in under a minute, so fewer new jobs go to a competitor overnight.',
    baseline: [
      { label: 'Customer inquiries a month', value: '1,200 (600 calls, 600 online)' },
      { label: 'Staff time on inquiries', value: '100 hours a month (5 minutes each)' },
      { label: 'Online inquiries after hours', value: '240 a month (40%), wait until morning' },
      { label: 'New-job requests among them', value: '72 a month (30%)' },
      { label: 'Average service call', value: '$341 at a 40% gross margin' },
    ],
    after: [
      { label: 'Resolved without staff', value: '330 a month (20% of calls, 35% of online)' },
      { label: 'Staff hours back', value: '22 hours a month, after review time' },
      { label: 'After-hours replies', value: 'Under a minute, 24/7' },
      { label: 'Jobs no longer lost overnight', value: '11 a month' },
    ],
    math: [
      { label: 'Staff time on inquiries today', formula: '1,200 × 5 ÷ 60', value: '100 hours' },
      { label: 'Resolved by the agent', formula: '600 × 20% + 600 × 35%', value: '330 inquiries' },
      { label: 'Staff time those took', formula: '330 × 5 ÷ 60', value: '27.5 hours' },
      { label: 'Less 20% for review and handoffs', formula: '27.5 × 80%', value: '22 hours back' },
      { label: 'Value of that time (customer service rep, $29/h loaded)', formula: '22 × $29', value: '$638' },
      { label: 'After-hours new-job requests', formula: '600 × 40% × 30%', value: '72 a month' },
      { label: 'Permanently lost without an instant answer', formula: '72 × 40%', value: '28.8 a month' },
      { label: 'Jobs they would have booked', formula: '28.8 × 40%, rounded down', value: '11 jobs' },
      { label: 'Gross profit from recovered jobs', formula: '11 × $341 × 40%', value: '$1,500' },
      { label: 'Monthly value', formula: '$638 + $1,500', value: '$2,138' },
      { label: 'Annual value', formula: '$2,138 × 12', value: '$25,656' },
    ],
    hoursPerMonth: 22,
    monthlyValue: 2138,
    annualValue: 25656,
    label: 'Modeled estimate',
    assumptions: [
      'The agent resolves 35% of online conversations and 20% of phone calls with no staff touch (base rates; vendor averages run higher).',
      '5 staff minutes per routine conversation; customer service rep time at $29 an hour loaded ($21.53 median × 1.35).',
      '40% of online inquiries arrive after hours and 30% of inquiries are new-job requests.',
      '40% of missed new-job requests are lost for good, and 40% of those would have booked if answered promptly.',
      'Average plumbing service call $341 (revenue) at a 40% service gross margin; only gross profit is counted.',
      'Not counted: missed daytime calls, estimate follow-ups, maintenance-plan renewals, review requests.',
    ],
    sources: ['lab-01', 'lab-06', 'cx-09', 'cx-10', 'cx-11', 'cx-16', 'cx-34', 'cx-27', 'cx-23', 'cx-26', 'cx-25', 'cx-21', 'cx-30', 'pnl-16'],
  },
  {
    id: 'analyst',
    service: 'AI Agents · Analyst Agent',
    business: 'Greenhollow Landscape Co.',
    profile:
      'Fictional commercial and residential landscaper: 45 employees across two branches (36 crew, 9 office and management), $6M-$8M revenue, QuickBooks Online, Excel, a crew time-tracking app and estimating spreadsheets.',
    summary:
      'The Analyst Agent pulls and cleans the monthly exports, drafts the report narrative and flags completed extra work that never reached an invoice.',
    baseline: [
      { label: 'Bookkeeper on month-end reporting', value: '40 hours a month (24 cleanup, 16 report building)' },
      { label: 'Operations manager on spreadsheets', value: '25 hours a month (15 job costing, 10 owner questions)' },
      { label: 'Month-end close', value: 'About 6.4 days (the benchmark median)' },
      { label: 'Extra work done but not invoiced', value: '$2,500 a month' },
    ],
    after: [
      { label: 'Bookkeeper hours back', value: '4 a month' },
      { label: 'Operations manager hours back', value: '4 a month' },
      { label: 'Month-end close', value: 'About 1 day sooner' },
      { label: 'Unbilled extra work recovered', value: '$1,250 a month' },
    ],
    math: [
      { label: 'Bookkeeper: data cleanup', formula: '24 × 10%', value: '2.4 hours' },
      { label: 'Bookkeeper: recurring report building', formula: '16 × 10%', value: '1.6 hours' },
      { label: 'Bookkeeper hours back', formula: '2.4 + 1.6', value: '4 hours' },
      { label: 'Operations manager: job-cost spreadsheets', formula: '15 × 10%', value: '1.5 hours' },
      { label: 'Operations manager: summaries for the owner', formula: '10 × 25%', value: '2.5 hours' },
      { label: 'Operations manager hours back', formula: '1.5 + 2.5', value: '4 hours' },
      { label: 'Value of time (bookkeeper $32/h, operations manager $68/h)', formula: '4 × $32 + 4 × $68', value: '$400' },
      { label: 'Recovered billing (half of what is flagged)', formula: '$2,500 × 50%', value: '$1,250' },
      { label: 'Monthly value', formula: '$400 + $1,250', value: '$1,650' },
      { label: 'Annual value', formula: '$1,650 × 12', value: '$19,800' },
    ],
    hoursPerMonth: 8,
    monthlyValue: 1650,
    annualValue: 19800,
    label: 'Illustrative example',
    assumptions: [
      'Measured time savings are small for spreadsheet work: 10% on recurring cleanup and on recurring report building, 25% on summaries (net of human review).',
      'Bookkeeping clerk time at $32 an hour loaded; operations manager at $68 (OEWS medians × 1.35).',
      'Only half of the flagged unbilled work is invoiced and collected in the year; the work is already done, so it counts as margin.',
      'Close cycle about 1 day shorter is a modeled target, not a measured automation effect.',
      'Not counted: faster decisions from timely reports, better bids from accurate job costing, the owner\'s own time.',
    ],
    sources: ['lab-01', 'lab-06', 'ai-06', 'ai-21', 'ai-23', 'ai-20', 'time-06', 'pnl-15', 'pnl-18'],
  },
  {
    id: 'assistant',
    service: 'AI Agents · Executive Assistant Agent',
    business: 'Lanternfield Insurance Agency',
    profile:
      'Fictional independent property and casualty agency: 22 employees (owner, 5 producers, 12 account managers, office manager, marketing coordinator, 2 customer service reps), $3M-$4M in commissions, Microsoft 365 and an agency management system.',
    summary:
      'The Executive Assistant Agent triages six inboxes, drafts replies for approval, writes meeting briefs and action-item summaries, and builds a first draft of the monthly leadership deck.',
    baseline: [
      { label: 'Owner email time', value: '28 hours a month (7 a week)' },
      { label: 'Owner meeting prep and briefs', value: '12 hours a month' },
      { label: 'Producer email time (5 producers)', value: '140 hours a month (7 a week each)' },
      { label: 'Office manager: leadership deck', value: '10 hours a month' },
      { label: 'Office manager: notes and task follow-up', value: '12 hours a month' },
    ],
    after: [
      { label: 'Owner hours back', value: '7 a month' },
      { label: 'Producer hours back', value: '21 a month in total' },
      { label: 'Office manager hours back', value: '3 a month' },
      { label: 'Per person', value: 'Under 2 hours a week each' },
    ],
    math: [
      { label: 'Owner: email workload', formula: '28 × 15%', value: '4.2 hours' },
      { label: 'Owner: meeting briefs and summaries', formula: '12 × 25%', value: '3 hours' },
      { label: 'Owner hours back (rounded down)', formula: '4.2 + 3', value: '7 hours' },
      { label: 'Producers: email workload', formula: '5 × 7 × 4 × 15%', value: '21 hours' },
      { label: 'Office manager: deck', formula: '10 × 5%', value: '0.5 hours' },
      { label: 'Office manager: notes and follow-up', formula: '12 × 25%', value: '3 hours' },
      { label: 'Office manager hours back (rounded down)', formula: '0.5 + 3', value: '3 hours' },
      { label: 'Hours back', formula: '7 + 21 + 3', value: '31 hours' },
      { label: 'Value of time (owner $68, producers $43, office manager $30)', formula: '7 × $68 + 21 × $43 + 3 × $30', value: '$1,469' },
      { label: 'Annual value', formula: '$1,469 × 12', value: '$17,628' },
    ],
    hoursPerMonth: 31,
    monthlyValue: 1469,
    annualValue: 17628,
    label: 'Illustrative example',
    assumptions: [
      '7 hours a week of email per person (base; the measured large-firm figure is 11.65).',
      'Email workload 15% lower for active users, summaries 25% faster, slide decks 5% faster (net of review).',
      'Every person stays under the 2-hours-a-week ceiling on routine admin time returned.',
      'Owner valued at a general and operations manager\'s $68 an hour; producers at a services sales rep\'s $43; office manager at an administrative assistant\'s $30.',
      'Not counted: new policies and renewals written with the time back, fewer missed follow-ups.',
    ],
    sources: ['lab-01', 'lab-06', 'lab-07', 'time-01', 'time-02', 'ai-15', 'ai-20', 'ai-21', 'ai-23'],
  },
  {
    id: 'marketing',
    service: 'AI Marketing Director',
    business: 'Juniper Lane Kitchen & Bath',
    profile:
      'Fictional kitchen and bathroom remodeler: 30 employees (owner, 3 designers, project managers, installers, office staff and a marketing coordinator), $6M-$8M revenue, $9,000 a month in search ads.',
    summary:
      'The AI Marketing Director audits campaigns daily, cuts spend that produces nothing, runs controlled tests and moves budget to what works, within limits the owner sets.',
    baseline: [
      { label: 'Monthly ad spend', value: '$9,000' },
      { label: 'Cost per lead', value: 'About $90 (home services median)' },
      { label: 'Leads a month', value: '100' },
      { label: 'Close rate and average job', value: '10% of leads; $12,000 at a 30% gross margin' },
      { label: 'Coordinator on reports and ad copy', value: '30 hours a month' },
    ],
    after: [
      { label: 'Cost per lead after 60-90 days', value: 'About $81 (10% lower)' },
      { label: 'Leads a month, same spend', value: '111 (+11)' },
      { label: 'Extra jobs', value: '1.1 a month (about 13 a year)' },
      { label: 'Coordinator hours back', value: '4 a month' },
    ],
    math: [
      { label: 'Leads today', formula: '$9,000 ÷ $90', value: '100' },
      { label: 'Cost per lead after optimization', formula: '$90 × (1 − 10%)', value: '$81' },
      { label: 'Extra leads at the same spend (rounded down)', formula: '$9,000 ÷ $81 − 100', value: '11' },
      { label: 'Extra jobs at today\'s close rate', formula: '11 × 10%', value: '1.1' },
      { label: 'Gross profit', formula: '1.1 × $12,000 × 30%', value: '$3,960' },
      { label: 'Coordinator: recurring reports', formula: '20 × 10%', value: '2 hours' },
      { label: 'Coordinator: ad copy and briefs', formula: '10 × 20%', value: '2 hours' },
      { label: 'Value of time (marketing specialist, $51/h)', formula: '4 × $51', value: '$204' },
      { label: 'Monthly value', formula: '$3,960 + $204', value: '$4,164' },
      { label: 'Annual value', formula: '$4,164 × 12', value: '$49,968' },
    ],
    hoursPerMonth: 4,
    monthlyValue: 4164,
    annualValue: 49968,
    label: 'Modeled estimate',
    assumptions: [
      'We model 10% lower cost per lead after 60-90 days of disciplined optimization; no study measures this directly.',
      'Starting cost per lead about $90, the home-services search median.',
      'Close rate stays at 10%; average job $12,000 at a 30% gross margin (the low end of specialty-trade margins).',
      'Coordinator time at a marketing specialist\'s $51 an hour; reports 10% faster, first drafts 20% faster.',
      'Not counted: wins from individual tests (most tests produce no significant winner), better lead quality, any choice to lower spend.',
    ],
    sources: ['mkt-01', 'mkt-02', 'mkt-19', 'mkt-14', 'mkt-15', 'mkt-16', 'lab-01', 'lab-06', 'pnl-16', 'ai-06', 'ai-24'],
  },
  {
    id: 'sales',
    service: 'AI Sales Agent',
    business: 'Wrenfield Commercial Cleaning',
    profile:
      'Fictional janitorial company for offices, medical clinics and schools: 70 employees (58 cleaning staff, 6 supervisors, 6 office and management including one business-development rep), $3.5M-$4.5M revenue, Google Workspace and a CRM.',
    summary:
      'The AI Sales Agent builds the prospect list, researches each business and drafts a specific first email; the rep reviews and approves every one, and sending stays within deliverability and CAN-SPAM limits.',
    baseline: [
      { label: 'Researched first emails a month', value: '180' },
      { label: 'Rep time per email', value: '10 minutes (research and writing)' },
      { label: 'Rep time on prospecting', value: '30 hours a month (about 19% of the month)' },
      { label: 'Typical contract', value: '$1,000 a month' },
    ],
    after: [
      { label: 'Rep time per email', value: '6.5 minutes to review and approve' },
      { label: 'Rep time on prospecting', value: '19.5 hours a month' },
      { label: 'Hours back', value: '10 a month' },
      { label: 'What cold email realistically yields', value: 'About 1-2 held meetings a year at this volume' },
    ],
    math: [
      { label: 'Prospecting time today', formula: '180 × 10 ÷ 60', value: '30 hours' },
      { label: 'Time per email with the agent', formula: '10 × (1 − 35%)', value: '6.5 minutes' },
      { label: 'Prospecting time after', formula: '180 × 6.5 ÷ 60', value: '19.5 hours' },
      { label: 'Hours back (rounded down)', formula: '30 − 19.5', value: '10 hours' },
      { label: 'Value of time (services sales rep, $43/h)', formula: '10 × $43', value: '$430' },
      { label: 'Annual value', formula: '$430 × 12', value: '$5,160' },
      { label: 'For context: held meetings a year from cold email', formula: '180 × 12 × 0.7 ÷ 1,000', value: 'About 1.5' },
    ],
    hoursPerMonth: 10,
    monthlyValue: 430,
    annualValue: 5160,
    label: 'Modeled estimate',
    assumptions: [
      '10 minutes of manual research and writing per personalized first email; AI cuts the rep\'s time by 35% (below the 40% measured in a writing trial).',
      'Rep time at a services sales rep\'s loaded $43 an hour ($33.65 median × 1.30).',
      'Cold email is a slow channel: about 3.5 positive replies and 0.7 held meetings per 1,000 prospects for a quality-first approach, so new contracts are not counted in the value.',
      'Contract value $1,000 a month (small office), first-year value only if one closes.',
      'Not counted: any contracts won, renewals, referrals and upsells.',
    ],
    sources: ['sales-20', 'sales-21', 'ai-03', 'sales-11', 'lab-01', 'lab-07', 'lab-15', 'sales-04', 'sales-07', 'sales-09', 'sales-22', 'sales-27', 'sales-16'],
  },
  {
    id: 'consulting',
    service: 'AI Consulting',
    business: 'Corran Valley Metalworks',
    profile:
      'Fictional custom metal fabricator: 85 employees (shop floor, engineering, purchasing, sales and office), about $15M revenue, EBITDA about $1.2M (8.0%), accounting and ERP exports, payroll reports and quoting spreadsheets.',
    summary:
      'AI Consulting analyzes the ledger, vendor spend, overtime, quotes against actual job costs and software seats, then ranks each opportunity and delivers a 90-day roadmap.',
    baseline: [
      { label: 'Revenue and EBITDA', value: '$15,000,000; $1,200,000 (8.0%)' },
      { label: 'Materials; freight; software', value: '$6,000,000; $600,000; $120,000' },
      { label: 'Overtime pay', value: '$450,000 a year' },
      { label: 'Quoted from stale material costs', value: '$3,000,000 of revenue a year' },
      { label: 'Controller on margin reports', value: '20 hours a month' },
    ],
    after: [
      { label: 'Savings identified', value: '$174,000 a year' },
      { label: 'Counted in year one', value: '$93,000' },
      { label: 'EBITDA with counted savings', value: '$1,293,000 (8.62%)' },
      { label: 'Controller hours back', value: '2 a month' },
    ],
    math: [
      { label: 'Pricing: reprice quotes on current material costs', formula: '$3,000,000 × 2% = $60,000; count half', value: '$30,000' },
      { label: 'Overtime: better scheduling and realistic lead times', formula: '$450,000 × 10% = $45,000; count half', value: '$22,500' },
      { label: 'Materials: renegotiate and consolidate suppliers', formula: '$6,000,000 × 0.75% = $45,000; count half', value: '$22,500' },
      { label: 'Freight: consolidate and rebid carriers', formula: '$600,000 × 2% = $12,000; count half', value: '$6,000' },
      { label: 'Software: cancel unused seats', formula: '$120,000 × 10% = $12,000; in the client\'s control', value: '$12,000' },
      { label: 'Identified', formula: '$60,000 + $45,000 + $45,000 + $12,000 + $12,000', value: '$174,000' },
      { label: 'Counted in year one', formula: '$30,000 + $22,500 + $22,500 + $6,000 + $12,000', value: '$93,000' },
      { label: 'Counted savings per month', formula: '$93,000 ÷ 12', value: '$7,750' },
      { label: 'Controller: recurring margin report', formula: '20 × 10% = 2 hours × $54 (accountant)', value: '$108' },
      { label: 'Monthly value', formula: '$7,750 + $108', value: '$7,858' },
      { label: 'Annual value', formula: '$7,858 × 12', value: '$94,296' },
      { label: 'EBITDA margin with counted savings', formula: '($1,200,000 + $93,000) ÷ $15,000,000', value: '8.62%' },
    ],
    hoursPerMonth: 2,
    monthlyValue: 7858,
    annualValue: 94296,
    label: 'Modeled estimate',
    assumptions: [
      'Base lever rates: 2% repricing on stale metal quotes, 10% of overtime pay, 0.75% of materials spend, 2% of freight, 10% of software spend.',
      'Half of each saving that depends on negotiation, customer acceptance or a ramp-up is counted in year one; cancelling unused software seats is counted in full.',
      'Controller time valued at an accountant\'s $54 an hour, below a controller\'s.',
      'Not counted: the other half of the identified savings, revenue growth from faster, more accurate quotes.',
    ],
    sources: ['pnl-29', 'pnl-26', 'pnl-25', 'pnl-18', 'pnl-17', 'pnl-28', 'pnl-04', 'pnl-05', 'pnl-15', 'pnl-08', 'pnl-16', 'lab-01', 'lab-06', 'ai-06'],
  },
];

export function getWorth(id: string): WorthExample | undefined {
  return worthExamples.find((e) => e.id === id);
}
