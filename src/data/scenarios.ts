// Industry scenarios for the results page (and three of them on Home).
// Structure and narrative from content/SCENARIOS.md section 3. Founder decision 2026-10-14 ("show the
// upside"): each scenario is a fictional business, mostly 50-250 staff, with revenue-side levers
// counted next to hours, and its value shown as a range from a BASE case to an UPSIDE case.
// Fictional businesses. Dependency-free on purpose (no imports, no enums) so Node can import it directly.
//
// The two cases:
// - Base case: every rate is the BASE value in content/BENCHMARKS.md ("Recommended model assumptions").
// - Upside case: the rates that describe what the agents achieve move to the OPTIMISTIC column, all at
//   once: AI resolution rates, the share of missed callers who would be lost, booking rates, response
//   lifts, ad-optimization gains, savings rates, the share of freed hours counted and the share of a
//   saving counted in year one. Never beyond the optimistic column. The business's own figures stay the
//   same in both cases: volumes, missed-call and after-hours shares, tickets, margins, close rates, wages.
//
// Shared rules:
// - Loaded hourly cost = OEWS May 2025 national median x base multiplier, rounded down
//   (1.35 for 5-50 staff, 1.40 for 50-500 staff, 1.30 for sales roles). lab-01, lab-06, lab-07
// - Fully resolved conversations: 35% of inbound chat/email/text and 20% of phone calls (upside 50% and
//   35%), 5 staff minutes each. End-to-end rates, so no extra review time is taken.
// - Hours returned are valued at 50% of loaded cost (upside 75%): not every freed hour turns into other
//   paid work. ai-08, ai-35
// - Revenue levers count only their gross profit (or contribution) in the value. The revenue itself is
//   reported separately as addedRevenue and never added to the value. Price and billing fixes on work
//   already done carry no extra cost, so all of that revenue is gross profit.
// - Weekly task hours are annualized at 50 weeks. Hours are rounded down before dollars are computed,
//   and dollars are rounded down. Rounding never inflates a result.
// - Values are gross of software costs and our fees (see Methodology).
//
// Math rows: the base case first, ending with "Annual value"; then the upside rows (upside: true, label
// prefixed "Upside · "), ending with "Upside · annual value". levers splits each case's value by source,
// and its base and upside columns sum to annualValue and upside.annualValue.
// Order: biggest base-case value first (the results page leads with it).

export type MathRow = { label: string; formula?: string; value: string; kind?: 'step' | 'total' | 'context'; upside?: boolean };
export type LeverKind = 'time' | 'growth' | 'savings';
/** Annual value from one source. time = hours valued; growth = gross profit on added revenue; savings = lower costs. */
export type Lever = { label: string; kind: LeverKind; base: number; upside: number };

export type Scenario = {
  id: string;
  industry: string;
  business: string;
  employees: number;
  size: string;
  revenueRange: string;
  challenge: string;
  agents: string[];
  /** Today → with agents (base case); `upside` is the same figure in the upside case, when it differs. */
  metrics: { label: string; before: string; after: string; upside?: string }[];
  /** Base-case modeled value a year (gross profit, savings and time). */
  annualValue: number;
  /** Staff hours back a year, base case. */
  hours: number;
  upside: { annualValue: number; hours: number };
  /** Added revenue a year, reported separately (only its gross profit is in the value). */
  addedRevenue?: { base: number; upside: number; note: string };
  levers: Lever[];
  timeToValue: string;
  narrative: string;
  label: 'Illustrative scenario';
  math: MathRow[];
  sources: string[];
};

export const scenarios: Scenario[] = [
  {
    id: 'industrial-distributor',
    industry: 'Industrial distributor',
    business: 'Ironvale Industrial Supply',
    employees: 250,
    size: 'Mid-size business',
    revenueRange: '$70M–$80M',
    challenge:
      'Inside sales and customer service reps spend much of the day on about 12,000 order-status and quote-request emails a month. Quotes take a full business day, each rep prices from a slightly different spreadsheet, and supplier price increases slip into invoices unnoticed.',
    agents: [
      'Customer Agent: answers routine order-status and tracking emails and turns quote requests into ready-to-price drafts',
      'Analyst Agent: checks every quote against margin floors and current costs, compares supplier invoices with the prices purchasing agreed and flags exceptions before they cost money',
      'AI Sales Agent: researches lapsed accounts and drafts each buyer a personal note; reps approve every quote and outreach email',
    ],
    metrics: [
      { label: 'Routine emails resolved without a rep', before: '0%', after: '35% of 12,000 a month', upside: '50%' },
      { label: 'Quote turnaround', before: 'Next business day', after: 'Same day' },
      { label: 'Quotes and supplier invoices checked', before: 'Spot checks', after: 'Every one' },
      { label: 'Lapsed accounts sent a personal note', before: 'None', after: '100 a month' },
    ],
    annualValue: 244275,
    hours: 4270,
    upside: { annualValue: 664200, hours: 6080 },
    addedRevenue: { base: 90000, upside: 270000, note: 'from better-priced quotes. Costs stay the same, so all of it is gross profit.' },
    levers: [
      { label: 'Team time on email and outreach', kind: 'time', base: 79275, upside: 169200 },
      { label: 'Price discipline on quotes', kind: 'growth', base: 90000, upside: 270000 },
      { label: 'Supplier price checks', kind: 'savings', base: 75000, upside: 225000 },
    ],
    timeToValue: 'Email agent live in 4–6 weeks; pricing findings within the first 30 days; full run-rate in 4–6 months',
    narrative:
      'Ironvale is a 250-person industrial distributor with three branches. Its inside sales and customer service reps spend much of the day on order-status and quote-request emails, quotes take a full business day, and each rep prices from a slightly different spreadsheet. A Customer Agent now resolves a third or more of routine emails and turns quote requests into ready-to-price drafts. An Analyst Agent checks every quote against margin floors and current costs, and compares supplier invoices with the prices purchasing agreed. An AI Sales Agent researches lapsed accounts and drafts each buyer a personal note. Reps approve every quote and email, and get 4,270 to 6,080 hours a year back.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Emails resolved by the agent', formula: '12,000 × 12 × 35% × 5 min ÷ 60', value: '4,200 hours a year' },
      { label: 'Email value (blended $37/hr: service rep $30 and wholesale rep $45; counted at 50%)', formula: '4,200 × $37 × 50%', value: '$77,700' },
      { label: 'Price discipline (0.5% better realized price on $36M quoted; half counted in year one)', formula: '$36,000,000 × 0.5% × 50%', value: '$90,000' },
      { label: 'Supplier price checks (0.75% of the $20M of purchases reviewed in year one; half counted)', formula: '$20,000,000 × 0.75% × 50%', value: '$75,000' },
      { label: 'Outreach drafting time returned (10 min per note; 35% faster with AI)', formula: '100 × 12 × 10 min ÷ 60 × 35%', value: '70 hours a year' },
      { label: 'Outreach value (wholesale rep $45/hr, counted at 50%)', formula: '70 × $45 × 50%', value: '$1,575' },
      { label: 'Reactivated accounts', value: 'Not counted (no reliable benchmark)' },
      { label: 'Hours back', formula: '4,200 + 70', value: '4,270 a year' },
      { label: 'Annual value', formula: '$77,700 + $90,000 + $75,000 + $1,575', value: '$244,275' },
      { label: 'Upside · emails resolved (50% of emails)', formula: '12,000 × 12 × 50% × 5 min ÷ 60', value: '6,000 hours a year', upside: true },
      { label: 'Upside · email value (counted at 75%)', formula: '6,000 × $37 × 75%', value: '$166,500', upside: true },
      { label: 'Upside · price discipline (1% better realized price; 75% counted in year one)', formula: '$36,000,000 × 1% × 75%', value: '$270,000', upside: true },
      { label: 'Upside · supplier price checks (1.5%; 75% counted)', formula: '$20,000,000 × 1.5% × 75%', value: '$225,000', upside: true },
      { label: 'Upside · outreach time (40% faster; counted at 75%)', formula: '100 × 12 × 10 min ÷ 60 × 40% = 80 h × $45 × 75%', value: '$2,700', upside: true },
      { label: 'Upside · hours back', formula: '6,000 + 80', value: '6,080 a year', upside: true },
      { label: 'Upside · annual value', formula: '$166,500 + $270,000 + $225,000 + $2,700', value: '$664,200', kind: 'total', upside: true },
    ],
    sources: ['lab-01', 'lab-06', 'lab-07', 'cx-09', 'cx-10', 'cx-34', 'pnl-01', 'pnl-30', 'pnl-15', 'pnl-18', 'pnl-17', 'ai-03', 'sales-11', 'ai-08', 'ai-35'],
  },
  {
    id: 'ecommerce',
    industry: 'E-commerce brand',
    business: 'Fernway Home Goods',
    employees: 40,
    size: 'Small business',
    revenueRange: '$18M–$22M',
    challenge:
      'About 9,000 support tickets a month, mostly order status and returns, bury the support team, and first replies take about nine hours, so shoppers with a question before they buy often leave. Returns on $120,000 a month of ads have slipped because nobody has time to manage campaigns closely.',
    agents: [
      'Customer Agent: resolves order-status, return and product questions by email and chat, answers shoppers before they buy, and hands the rest to the team with the order history attached',
      'AI Marketing Director: audits the Meta and Google accounts, runs creative and audience tests, and shifts budget toward what sells within limits the founders set',
      'Analyst Agent: sends a margin and inventory report every Monday morning',
    ],
    metrics: [
      { label: 'Tickets resolved without a person', before: '0%', after: '35% of 9,000 a month', upside: '50%' },
      { label: 'First reply time', before: 'About 9 hours', after: 'Under 2 minutes' },
      { label: 'Attributed revenue per $1 of ad spend', before: '$2.00', after: '$2.22', upside: '$2.50' },
      { label: 'Support team hours on tickets', before: '750 a month', after: 'About 488 a month', upside: '375' },
    ],
    annualValue: 164847,
    hours: 3198,
    upside: { annualValue: 387495, hours: 4620 },
    addedRevenue: { base: 391800, upside: 945000, note: 'from ads and from answering shoppers before they buy. Ad revenue is attributed, not proven incremental, and only the 30% contribution margin is counted.' },
    levers: [
      { label: 'Support and reporting time', kind: 'time', base: 47307, upside: 103995 },
      { label: 'Ad optimization', kind: 'growth', base: 95040, upside: 216000 },
      { label: 'Answers before purchase', kind: 'growth', base: 22500, upside: 67500 },
    ],
    timeToValue: 'Support agent live in about 2 weeks; ad gains build over 60–90 days',
    narrative:
      'Fernway is a 40-person home-goods brand that sells through its own Shopify store. About 9,000 support tickets a month, mostly order status and returns, bury the team, and first replies take around nine hours, so shoppers who ask a question before buying often leave. Ad returns have slipped because nobody has time to manage campaigns closely. A Customer Agent now resolves a third to a half of tickets on its own, from tracking updates to return labels, answers pre-purchase questions in minutes and hands the rest to the team with the order history attached. An AI Marketing Director audits the ad accounts, tests new creative and audiences, and shifts budget toward what sells, within limits the founders set.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Tickets resolved by the agent', formula: '9,000 × 12 × 35% × 5 min ÷ 60', value: '3,150 hours a year' },
      { label: 'Support value (customer service rep $29/hr, counted at 50%)', formula: '3,150 × $29 × 50%', value: '$45,675' },
      { label: 'Extra attributed revenue (starting return 2.0x; +11% from 60–90 days of optimization)', formula: '$120,000 × 12 × 2.0 × 11%', value: '$316,800' },
      { label: 'Ad contribution (30% margin after product, shipping, fees and returns)', formula: '$316,800 × 30%', value: '$95,040' },
      { label: 'Sales from answering before purchase (5% lift on the $1.5M a year bought by shoppers who ask first)', formula: '$1,500,000 × 5%', value: '$75,000' },
      { label: 'Pre-purchase contribution (30% margin)', formula: '$75,000 × 30%', value: '$22,500' },
      { label: 'Reporting time returned (10% less time on recurring reports)', formula: '40 hrs × 12 × 10%', value: '48 hours a year' },
      { label: 'Reporting value (operations manager $68/hr, counted at 50%)', formula: '48 × $68 × 50%', value: '$1,632' },
      { label: 'Hours back', formula: '3,150 + 48', value: '3,198 a year' },
      { label: 'Annual value', formula: '$45,675 + $95,040 + $22,500 + $1,632', value: '$164,847' },
      { label: 'Upside · tickets resolved (50% of tickets)', formula: '9,000 × 12 × 50% × 5 min ÷ 60', value: '4,500 hours a year', upside: true },
      { label: 'Upside · support value (counted at 75%)', formula: '4,500 × $29 × 75%', value: '$97,875', upside: true },
      { label: 'Upside · extra attributed revenue (+25%)', formula: '$120,000 × 12 × 2.0 × 25%', value: '$720,000', upside: true },
      { label: 'Upside · ad contribution', formula: '$720,000 × 30%', value: '$216,000', upside: true },
      { label: 'Upside · sales from answering before purchase (15% lift)', formula: '$1,500,000 × 15%', value: '$225,000', upside: true },
      { label: 'Upside · pre-purchase contribution', formula: '$225,000 × 30%', value: '$67,500', upside: true },
      { label: 'Upside · reporting time (25% less; counted at 75%)', formula: '40 hrs × 12 × 25% = 120 h × $68 × 75%', value: '$6,120', upside: true },
      { label: 'Upside · hours back', formula: '4,500 + 120', value: '4,620 a year', upside: true },
      { label: 'Upside · annual value', formula: '$97,875 + $216,000 + $67,500 + $6,120', value: '$387,495', kind: 'total', upside: true },
    ],
    sources: ['lab-01', 'lab-06', 'cx-09', 'cx-10', 'cx-34', 'ai-26', 'mkt-05', 'mkt-06', 'mkt-19', 'pnl-09', 'pnl-31', 'ai-16', 'ai-24', 'ai-08', 'ai-35'],
  },
  {
    id: 'dental',
    industry: 'Dental group',
    business: 'Willowmere Dental Group',
    employees: 120,
    size: 'Mid-size business',
    revenueRange: '$18M–$22M',
    challenge:
      'About 28% of calls go unanswered at peak times, after-hours callers reach voicemail, and many of those callers book with another practice. Office managers in eight offices build reports by hand.',
    agents: [
      'Customer Agent: answers overflow and after-hours calls and texts, books new patients, confirms and reschedules appointments; access is limited to scheduling and patient messaging, and every action is logged',
      'Analyst Agent: builds one weekly dashboard of production, collections and schedule fill across all eight offices',
    ],
    metrics: [
      { label: 'Calls that reach no one', before: 'About 28%', after: 'Answered by the agent, 24/7' },
      { label: 'New patients per month', before: '240', after: '272', upside: '367' },
      { label: 'Answered calls fully handled without staff', before: '0%', after: '20% (1,728 a month)', upside: '35%' },
      { label: 'Office manager time on reports', before: '60 hrs/month', after: '54 hrs/month', upside: '45' },
    ],
    annualValue: 163819,
    hours: 1800,
    upside: { annualValue: 614965, hours: 3204 },
    addedRevenue: { base: 340608, upside: 1351788, note: 'from recovered new patients, in first-year revenue. Only the 40% contribution margin is counted.' },
    levers: [
      { label: 'Front-desk and reporting time', kind: 'time', base: 27576, upside: 74250 },
      { label: 'New patients from answered calls', kind: 'growth', base: 136243, upside: 540715 },
    ],
    timeToValue: 'Live in 3–4 weeks after testing with the practice-management system; full value in about 90 days',
    narrative:
      'Willowmere is an eight-office dental group with 120 employees. At peak times more than one call in four goes unanswered, after-hours callers reach voicemail, and some of those callers book elsewhere. A Customer Agent now answers overflow and after-hours calls and texts, books new patients, and confirms and reschedules appointments. Its access is limited to scheduling and patient messaging, every action is logged, and clinical questions go straight to the team. In this model it adds 32 to 127 new patients a month and fully handles one in five to one in three routine calls. An Analyst Agent pulls data from all eight offices into one weekly dashboard.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Missed calls that are new-business opportunities', formula: '12,000 × 28% × 30%', value: '1,008 a month' },
      { label: 'New patients recovered (40% would be lost; agent completes 20% of calls; 40% book)', formula: '1,008 × 40% × 20% × 40%, rounded down', value: '32 a month' },
      { label: 'New-patient contribution ($887 first-year revenue at 40% margin)', formula: '32 × 12 × $887 × 40%, rounded down', value: '$136,243' },
      { label: 'Answered calls fully handled by the agent', formula: '12,000 × 72% × 20% × 12 × 5 min ÷ 60', value: '1,728 hours a year' },
      { label: 'Front-desk value (medical secretary $22.08 × 1.40 = $30/hr, counted at 50%)', formula: '1,728 × $30 × 50%', value: '$25,920' },
      { label: 'Reporting time returned (10% less time on recurring reports)', formula: '60 hrs × 12 × 10%', value: '72 hours a year' },
      { label: 'Reporting value (office manager $33.41 × 1.40 = $46/hr, counted at 50%)', formula: '72 × $46 × 50%', value: '$1,656' },
      { label: 'Hours back', formula: '1,728 + 72', value: '1,800 a year' },
      { label: 'Annual value', formula: '$136,243 + $25,920 + $1,656', value: '$163,819' },
      { label: 'Upside · new patients recovered (60% would be lost; agent completes 35%; 60% book)', formula: '1,008 × 60% × 35% × 60%, rounded down', value: '127 a month', upside: true },
      { label: 'Upside · new-patient contribution', formula: '127 × 12 × $887 × 40%, rounded down', value: '$540,715', upside: true },
      { label: 'Upside · answered calls fully handled (35% of calls)', formula: '12,000 × 72% × 35% × 12 × 5 min ÷ 60', value: '3,024 hours a year', upside: true },
      { label: 'Upside · front-desk value (counted at 75%)', formula: '3,024 × $30 × 75%', value: '$68,040', upside: true },
      { label: 'Upside · reporting time (25% less; counted at 75%)', formula: '60 hrs × 12 × 25% = 180 h × $46 × 75%', value: '$6,210', upside: true },
      { label: 'Upside · hours back', formula: '3,024 + 180', value: '3,204 a year', upside: true },
      { label: 'Upside · annual value', formula: '$540,715 + $68,040 + $6,210', value: '$614,965', kind: 'total', upside: true },
    ],
    sources: ['lab-01', 'lab-06', 'cx-22', 'cx-26', 'cx-23', 'cx-21', 'cx-25', 'cx-16', 'cx-31', 'pnl-10', 'cx-34', 'ai-16', 'ai-08', 'ai-35'],
  },
  {
    id: 'law-firm',
    industry: 'Law firm',
    business: 'Maple Row Law Group',
    employees: 30,
    size: 'Small business',
    revenueRange: '$6M–$8M',
    challenge:
      'New inquiries that arrive while the team is with clients wait until the next business day, and some of those people hire another firm. The ten attorneys spend about 7 hours a week each on email, and finished work slips through billing and collections.',
    agents: [
      'Customer Agent: answers web, email and text inquiries 24/7 from the firm\'s approved answers, checks that the matter fits the practice and books consultations; anything that needs legal judgment goes to an attorney',
      'Executive Assistant Agent: triages the attorneys\' inboxes, drafts routine replies for approval, tracks deadlines and follow-ups, and flags unbilled time and overdue invoices',
    ],
    metrics: [
      { label: 'Reply time for new online inquiries', before: 'Next business day after hours', after: 'Under 2 minutes, 24/7' },
      { label: 'Inquiries fully handled without staff', before: '0%', after: '35% of 1,000 a month', upside: '50%' },
      { label: 'Consultations booked per year', before: '960', after: '998', upside: '1,036' },
      { label: 'Attorney time on email', before: '7 hrs/week each', after: 'About 5.8 hrs/week each', upside: '5.6' },
    ],
    annualValue: 135700,
    hours: 950,
    upside: { annualValue: 264575, hours: 1200 },
    addedRevenue: { base: 127000, upside: 254000, note: 'from new matters and recovered fees. Recovered fees are for work already done, so they count in full; new matters count at their 50% margin.' },
    levers: [
      { label: 'Attorney and intake time', kind: 'time', base: 37200, upside: 67575 },
      { label: 'Billing leakage recovered', kind: 'growth', base: 70000, upside: 140000 },
      { label: 'New matters from faster replies', kind: 'growth', base: 28500, upside: 57000 },
    ],
    timeToValue: 'Intake agent live in 2–3 weeks; full value in about 60 days',
    narrative:
      'Maple Row is a 30-person estate and family law firm with ten attorneys. When the team is with clients, new inquiries wait until the next business day, and some of those people book with another firm. A Customer Agent now answers web, email and text inquiries within minutes, day or night, explains how consultations work using the firm\'s approved answers, and books directly into the attorneys\' calendars. Anything that needs legal judgment goes to an attorney. An Executive Assistant Agent triages the attorneys\' inboxes, drafts routine replies for approval and flags time that never reached an invoice. In this model the firm books 38 to 76 more consultations a year and recovers 1% to 2% of fees that used to slip.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Intake handled by the agent', formula: '1,000 × 12 × 35% × 5 min ÷ 60', value: '350 hours a year' },
      { label: 'Intake value (legal assistant $26.72 × 1.35 = $36/hr, counted at 50%)', formula: '350 × $36 × 50%', value: '$6,300' },
      { label: 'Attorney email time returned (1.2 hrs/week each, measured)', formula: '10 × 1.2 × 50 weeks', value: '600 hours a year' },
      { label: 'Attorney value (lawyer $76.76 × 1.35 = $103/hr, counted at 50%)', formula: '600 × $103 × 50%', value: '$30,900' },
      { label: 'Extra consultations (40% of inquiries wait over an hour; 10% relative lift when answered in minutes)', formula: '960 × 40% × 10%, rounded down', value: '38 a year' },
      { label: 'New matters (half of consultations become clients)', formula: '38 × 50%', value: '19 a year' },
      { label: 'New-matter contribution ($3,000 flat fee at 50% margin)', formula: '19 × $3,000 × 50%', value: '$28,500' },
      { label: 'Billing leakage recovered (1% of fees: unbilled time, invoicing and collections follow-up)', formula: '$7,000,000 × 1%', value: '$70,000' },
      { label: 'Hours back', formula: '350 + 600', value: '950 a year' },
      { label: 'Annual value', formula: '$6,300 + $30,900 + $28,500 + $70,000', value: '$135,700' },
      { label: 'Upside · intake handled (50%; counted at 75%)', formula: '1,000 × 12 × 50% × 5 min ÷ 60 = 500 h × $36 × 75%', value: '$13,500', upside: true },
      { label: 'Upside · attorney email time (20% of 7 hrs = 1.4 hrs/week each)', formula: '10 × 1.4 × 50 weeks', value: '700 hours a year', upside: true },
      { label: 'Upside · attorney value (counted at 75%)', formula: '700 × $103 × 75%', value: '$54,075', upside: true },
      { label: 'Upside · extra consultations (20% lift)', formula: '960 × 40% × 20%, rounded down', value: '76 a year', upside: true },
      { label: 'Upside · new-matter contribution', formula: '76 × 50% = 38 × $3,000 × 50%', value: '$57,000', upside: true },
      { label: 'Upside · billing leakage recovered (2% of fees)', formula: '$7,000,000 × 2%', value: '$140,000', upside: true },
      { label: 'Upside · hours back', formula: '500 + 700', value: '1,200 a year', upside: true },
      { label: 'Upside · annual value', formula: '$13,500 + $54,075 + $57,000 + $140,000', value: '$264,575', kind: 'total', upside: true },
    ],
    sources: ['lab-01', 'lab-06', 'cx-09', 'cx-10', 'cx-34', 'time-01', 'ai-15', 'cx-18', 'cx-19', 'cx-20', 'pnl-02', 'ai-08', 'ai-35'],
  },
  {
    id: 'home-services',
    industry: 'Home services',
    business: 'Gablecrest Roofing & Exteriors',
    employees: 85,
    size: 'Mid-size business',
    revenueRange: '$20M–$25M',
    challenge:
      'About 4 in 10 of its 500 new leads a month wait more than an hour for a callback, and by then many homeowners have called another roofer. Estimators chase follow-ups at night, and no one has time to check where the $45,000 monthly search budget goes.',
    agents: [
      'Customer Agent: replies to every lead within a minute by text or chat, answers common questions, books inspections on the estimators\' calendars and follows up',
      'AI Marketing Director: finds and cuts search ad spend that never produces a lead, within budget rules the owner sets',
    ],
    metrics: [
      { label: 'Time to first reply on new leads', before: 'Over an hour for 4 in 10', after: 'Under 1 minute' },
      { label: 'Inspections booked per year', before: '2,400', after: '2,496', upside: '2,592' },
      { label: 'Search spend for the same 500 leads a month', before: '$45,000 ($90 a lead)', after: '$42,300 ($84.60 a lead)', upside: '$39,600' },
      { label: 'Calls and texts handled without staff', before: '0%', after: '362 a month', upside: '550' },
    ],
    annualValue: 128133,
    hours: 362,
    upside: { annualValue: 257932, hours: 550 },
    addedRevenue: { base: 264000, upside: 528000, note: 'from extra roofing jobs. Only the 34% gross margin is counted.' },
    levers: [
      { label: 'Office time on calls and texts', kind: 'time', base: 5973, upside: 13612 },
      { label: 'Jobs won by replying first', kind: 'growth', base: 89760, upside: 179520 },
      { label: 'Search spend cut', kind: 'savings', base: 32400, upside: 64800 },
    ],
    timeToValue: 'Lead response live in about 2 weeks; ad savings within 30–60 days',
    narrative:
      'Gablecrest is an 85-person roofing and exteriors company. About four in ten of its 500 new leads a month wait more than an hour for a callback, and by then many homeowners have already called another roofer. Estimators chase follow-ups at night, and no one has time to check where the ad budget goes. A Customer Agent now replies to every lead within a minute by text or chat, answers common questions, and books inspections straight onto the estimators\' calendars. An AI Marketing Director finds search spend that never produces a lead and cuts it, so the same 500 leads a month cost $2,700 to $5,400 less. Booked inspections rise by 96 to 192 a year.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Extra inspections (40% of leads wait over an hour; 10% relative lift)', formula: '500 × 12 × 40% booked × 40% × 10%', value: '96 a year' },
      { label: 'Extra jobs (25% of inspections close)', formula: '96 × 25%', value: '24 a year' },
      { label: 'Gross profit ($11,000 average job at a 34% specialty-trade margin)', formula: '24 × $11,000 × 34%', value: '$89,760' },
      { label: 'Search spend cut with no lost leads (6% of search spend)', formula: '$45,000 × 12 × 6%', value: '$32,400' },
      { label: 'Calls and texts resolved by the agent', formula: '(750 texts × 35% + 500 calls × 20%) × 12 × 5 min ÷ 60, rounded down', value: '362 hours a year' },
      { label: 'Office value (scheduler $24.20 × 1.40 = $33/hr, counted at 50%)', formula: '362 × $33 × 50%', value: '$5,973' },
      { label: 'Hours back', value: '362 a year' },
      { label: 'Annual value', formula: '$89,760 + $32,400 + $5,973', value: '$128,133' },
      { label: 'Upside · extra inspections (20% relative lift)', formula: '500 × 12 × 40% × 40% × 20%', value: '192 a year', upside: true },
      { label: 'Upside · gross profit', formula: '192 × 25% = 48 jobs × $11,000 × 34%', value: '$179,520', upside: true },
      { label: 'Upside · search spend cut (12% of search spend)', formula: '$45,000 × 12 × 12%', value: '$64,800', upside: true },
      { label: 'Upside · calls and texts resolved (50% of texts, 35% of calls)', formula: '(750 × 50% + 500 × 35%) × 12 × 5 min ÷ 60', value: '550 hours a year', upside: true },
      { label: 'Upside · office value (counted at 75%, rounded down)', formula: '550 × $33 × 75%', value: '$13,612', upside: true },
      { label: 'Upside · annual value', formula: '$179,520 + $64,800 + $13,612', value: '$257,932', kind: 'total', upside: true },
    ],
    sources: ['lab-01', 'lab-06', 'cx-18', 'cx-19', 'cx-20', 'pnl-16', 'mkt-01', 'mkt-19', 'mkt-18', 'cx-09', 'cx-16', 'cx-34', 'ai-08', 'ai-35'],
  },
  {
    id: 'restaurant-group',
    industry: 'Restaurant group',
    business: 'Bramblewood Restaurant Group',
    employees: 180,
    size: 'Mid-size business',
    revenueRange: '$13M–$16M',
    challenge:
      'Supplier prices change weekly, but food cost is reviewed only at month-end. Schedules follow habit rather than forecast covers, general managers spend about 10 hours a week each on invoices, inventory sheets and reports, and catering inquiries often wait a day for a reply.',
    agents: [
      'Analyst Agent: reads every supplier invoice, tracks price changes and food cost by location, and flags dishes that are losing margin',
      'AI Consulting: recommends menu-price, vendor and staffing changes for the owners to approve, with schedules matched to forecast covers',
      'Customer Agent: answers catering and private-event inquiries within minutes and books them',
    ],
    metrics: [
      { label: 'Food cost (share of food sales)', before: '32.0%', after: '31.6%', upside: '31.2%' },
      { label: 'Reply time for catering and event inquiries', before: 'Next day', after: 'Within 5 minutes' },
      { label: 'Catering orders and private events booked', before: '240 a year', after: '264 a year', upside: '288' },
      { label: 'GM time on invoices, inventory and reports', before: '10 hrs/week each', after: '9 hrs/week each', upside: '7.5' },
    ],
    annualValue: 97980,
    hours: 300,
    upside: { annualValue: 234315, hours: 750 },
    addedRevenue: { base: 72000, upside: 144000, note: 'from extra catering orders and events. Only the 30% margin is counted.' },
    levers: [
      { label: 'Manager time', kind: 'time', base: 6900, upside: 25875 },
      { label: 'Catering and events', kind: 'growth', base: 21600, upside: 43200 },
      { label: 'Food cost', kind: 'savings', base: 43200, upside: 86400 },
      { label: 'Labor scheduling', kind: 'savings', base: 26280, upside: 78840 },
    ],
    timeToValue: 'Invoice tracking live in about 3 weeks; food-cost gains within 60–90 days',
    narrative:
      'Bramblewood is a six-location restaurant group with 180 employees. Supplier prices change weekly, but food cost is reviewed only at month-end, long after the margin is gone. General managers spend about ten hours a week on invoices, inventory sheets and reports, and catering inquiries often wait a day for a reply. An Analyst Agent now reads every supplier invoice, tracks price changes and food cost by location, and flags dishes that are losing margin. AI Consulting recommends menu, vendor and staffing changes for the owners to approve, trimming food cost by 0.4 to 0.8 points in year one and matching schedules to forecast covers. A Customer Agent answers catering and private-event inquiries within minutes.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Food cost (0.4-point year-one improvement on $10.8M food sales)', formula: '$10,800,000 × 0.4%', value: '$43,200' },
      { label: 'Labor scheduling (1% of $5.26M labor, 36.5% of $14.4M sales; half counted in year one)', formula: '$5,256,000 × 1% × 50%', value: '$26,280' },
      { label: 'Extra events (all inquiries wait over an hour today; 10% relative lift)', formula: '20 × 12 × 10%', value: '24 a year' },
      { label: 'Event contribution ($3,000 average at 30% margin)', formula: '24 × $3,000 × 30%', value: '$21,600' },
      { label: 'GM time returned (10% less time on recurring reports and cleanup)', formula: '6 × 10 hrs × 50 weeks × 10%', value: '300 hours a year' },
      { label: 'GM value (food service manager $33.36 × 1.40 = $46/hr, counted at 50%)', formula: '300 × $46 × 50%', value: '$6,900' },
      { label: 'Hours back', value: '300 a year' },
      { label: 'Annual value', formula: '$43,200 + $26,280 + $21,600 + $6,900', value: '$97,980' },
      { label: 'Upside · food cost (0.8 points)', formula: '$10,800,000 × 0.8%', value: '$86,400', upside: true },
      { label: 'Upside · labor scheduling (2%; 75% counted in year one)', formula: '$5,256,000 × 2% × 75%', value: '$78,840', upside: true },
      { label: 'Upside · extra events (20% lift)', formula: '20 × 12 × 20% = 48 × $3,000 × 30%', value: '$43,200', upside: true },
      { label: 'Upside · GM time (25% less; counted at 75%)', formula: '6 × 10 hrs × 50 weeks × 25% = 750 h × $46 × 75%', value: '$25,875', upside: true },
      { label: 'Upside · hours back', value: '750 a year', upside: true },
      { label: 'Upside · annual value', formula: '$86,400 + $78,840 + $43,200 + $25,875', value: '$234,315', kind: 'total', upside: true },
    ],
    sources: ['lab-01', 'lab-06', 'pnl-11', 'pnl-12', 'pnl-18', 'pnl-01', 'pnl-15', 'pnl-25', 'cx-18', 'cx-19', 'cx-20', 'ai-16', 'ai-23', 'ai-08', 'ai-35'],
  },
];
