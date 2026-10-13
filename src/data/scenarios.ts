// Industry scenarios for the results page.
// Structure and narrative from content/SCENARIOS.md section 3; every number recalibrated to the
// BASE values in content/BENCHMARKS.md ("Recommended model assumptions"). Fictional businesses.
// Dependency-free on purpose (no imports, no enums) so Node can import it directly for checks.
//
// Shared rules used in every scenario:
// - Loaded hourly cost = OEWS May 2025 national median x base multiplier, rounded down
//   (1.35 for 5-50 staff, 1.40 for 50-500 staff, 1.30 for sales roles). lab-01, lab-06, lab-07
// - Fully resolved conversations: 35% of inbound chat/email/text, 20% of phone calls, 5 staff
//   minutes each. These are end-to-end (no human touch) rates, so no extra review time is taken.
// - Hours returned are valued at 50% of loaded cost (base realization: not every freed hour
//   turns into other paid work). ai-08, ai-35
// - Weekly task hours are annualized at 50 weeks. Hours are rounded down before dollars are computed.
// - Values are gross of software costs and our fees (see Methodology).

export type MathRow = { label: string; formula?: string; value: string };

export type Scenario = {
  id: string;
  industry: string;
  business: string;
  employees: number;
  size: string;
  revenueRange: string;
  challenge: string;
  agents: string[];
  metrics: { label: string; before: string; after: string }[];
  annualValue: number;
  timeToValue: string;
  narrative: string;
  label: 'Illustrative scenario';
  math: MathRow[];
  sources: string[];
};

export const scenarios: Scenario[] = [
  {
    id: 'law-firm',
    industry: 'Law firm',
    business: 'Maple Row Law Group',
    employees: 8,
    size: 'Small business',
    revenueRange: '$1.2M–$1.6M',
    challenge:
      'New inquiries that arrive while the team is with clients wait until the next business day, and some of those people hire another firm. Both attorneys spend about 7 hours a week each on email.',
    agents: [
      'Customer Agent: answers web, email and text inquiries 24/7 from the firm\'s approved answers, checks that the matter fits the practice and books consultations; anything that needs legal judgment goes to an attorney',
      'Executive Assistant Agent: triages both attorneys\' inboxes, drafts routine replies for approval and tracks deadlines and follow-ups',
    ],
    metrics: [
      { label: 'Reply time for new online inquiries', before: 'Next business day after hours', after: 'Under 2 minutes, 24/7' },
      { label: 'Inquiries fully handled without staff', before: '0%', after: '35% of 300 a month' },
      { label: 'Consultations booked per year', before: '288', after: '299' },
      { label: 'Attorney time on email', before: '7 hrs/week each', after: 'About 5.8 hrs/week each' },
    ],
    annualValue: 15570,
    timeToValue: 'Intake agent live in 2–3 weeks; full value in about 60 days',
    narrative:
      'Maple Row is an eight-person estate and family law firm. When the team is with clients, new inquiries wait until the next business day, and some of those people book with another firm. A Customer Agent now answers web, email and text inquiries within minutes, day or night, explains how consultations work using the firm\'s approved answers, and books directly into the attorneys\' calendars. Anything that needs legal judgment goes to an attorney. An Executive Assistant Agent triages both attorneys\' inboxes and drafts routine replies for approval. In this model the agent fully handles about a third of inquiries, the firm books 11 more consultations a year and gets 225 hours back.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Intake handled by the agent', formula: '300 × 12 × 35% × 5 min ÷ 60', value: '105 hours a year' },
      { label: 'Intake value (legal assistant $26.72 × 1.35 = $36/hr, counted at 50%)', formula: '105 × $36 × 50%', value: '$1,890' },
      { label: 'Attorney email time returned (1.2 hrs/week each, measured)', formula: '2 × 1.2 × 50 weeks', value: '120 hours a year' },
      { label: 'Attorney value (lawyer $76.76 × 1.35 = $103/hr, counted at 50%)', formula: '120 × $103 × 50%', value: '$6,180' },
      { label: 'Extra consultations (40% of inquiries wait over an hour; 10% relative lift when answered in minutes)', formula: '288 × 40% × 10%, rounded down', value: '11 a year' },
      { label: 'New matters (half of consultations become clients)', formula: '11 × 50%, rounded down', value: '5 a year' },
      { label: 'New-matter contribution ($3,000 flat fee at 50% margin)', formula: '5 × $3,000 × 50%', value: '$7,500' },
      { label: 'Hours back', formula: '105 + 120', value: '225 a year' },
      { label: 'Annual value', formula: '$1,890 + $6,180 + $7,500', value: '$15,570' },
    ],
    sources: ['lab-01', 'lab-06', 'cx-09', 'cx-10', 'cx-34', 'time-01', 'ai-15', 'cx-18', 'cx-19', 'cx-20', 'ai-08', 'ai-35'],
  },
  {
    id: 'ecommerce',
    industry: 'E-commerce brand',
    business: 'Fernway Home Goods',
    employees: 14,
    size: 'Small business',
    revenueRange: '$5M–$7M',
    challenge:
      'About 3,000 support tickets a month, mostly order status and returns, bury a small support team, and first replies take about nine hours. Ad returns have slipped because nobody has time to manage campaigns closely.',
    agents: [
      'Customer Agent: resolves order-status, return and product questions by email and chat, and hands the rest to the team with the order history attached',
      'AI Marketing Director: audits the Meta and Google accounts, runs creative and audience tests, and shifts budget toward what sells within limits the founders set',
      'Analyst Agent: sends a margin and inventory report every Monday morning',
    ],
    metrics: [
      { label: 'Tickets resolved without a person', before: '0%', after: '35% of 3,000 a month' },
      { label: 'First reply time', before: 'About 9 hours', after: 'Under 2 minutes' },
      { label: 'Attributed revenue per $1 of ad spend', before: '$2.00', after: '$2.22' },
      { label: 'Support team hours on tickets', before: '250 a month', after: 'About 163 a month' },
    ],
    annualValue: 47721,
    timeToValue: 'Support agent live in about 2 weeks; ad gains build over 60–90 days',
    narrative:
      'Fernway is a 14-person home-goods brand that sells through its own Shopify store. About 3,000 support tickets a month, mostly order status and returns, bury a small team, and first replies take around nine hours. Ad returns have slipped because nobody has time to manage campaigns closely. A Customer Agent now resolves about a third of tickets on its own, from tracking updates to return labels, and hands the rest to the team with the order history attached. An AI Marketing Director audits the ad accounts, tests new creative and audiences, and shifts budget toward what sells, within limits the founders set. The support team gets about 1,050 hours a year back.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Tickets resolved by the agent', formula: '3,000 × 12 × 35% × 5 min ÷ 60', value: '1,050 hours a year' },
      { label: 'Support value (customer service rep $29/hr, counted at 50%)', formula: '1,050 × $29 × 50%', value: '$15,225' },
      { label: 'Extra attributed revenue (starting return 2.0x; +11% from 60–90 days of optimization)', formula: '$40,000 × 12 × 2.0 × 11%', value: '$105,600' },
      { label: 'Ad contribution (30% margin after product, shipping, fees and returns)', formula: '$105,600 × 30%', value: '$31,680' },
      { label: 'Reporting time returned (10% less time on recurring reports)', formula: '20 hrs × 12 × 10%', value: '24 hours a year' },
      { label: 'Reporting value (operations manager $68/hr, counted at 50%)', formula: '24 × $68 × 50%', value: '$816' },
      { label: 'Hours back', formula: '1,050 + 24', value: '1,074 a year' },
      { label: 'Annual value', formula: '$15,225 + $31,680 + $816', value: '$47,721' },
    ],
    sources: ['lab-01', 'lab-06', 'cx-09', 'cx-10', 'cx-34', 'mkt-05', 'mkt-06', 'mkt-19', 'pnl-09', 'pnl-31', 'ai-16', 'ai-24', 'ai-08', 'ai-35'],
  },
  {
    id: 'home-services',
    industry: 'Home services',
    business: 'Gablecrest Roofing & Exteriors',
    employees: 32,
    size: 'Small business',
    revenueRange: '$6M–$8M',
    challenge:
      'About 4 in 10 new leads wait more than an hour for a callback, and by then many homeowners have called another roofer. Estimators chase follow-ups at night, and no one has time to check where the ad budget goes.',
    agents: [
      'Customer Agent: replies to every lead within a minute by text or chat, answers common questions, books inspections on the estimators\' calendars and follows up',
      'AI Marketing Director: finds and cuts search ad spend that never produces a lead, within budget rules the owner sets',
    ],
    metrics: [
      { label: 'Time to first reply on new leads', before: 'Over an hour for 4 in 10', after: 'Under 1 minute' },
      { label: 'Inspections booked per year', before: '960', after: '998' },
      { label: 'Search spend for the same 200 leads a month', before: '$18,000 ($90 a lead)', after: '$16,920 ($84.60 a lead)' },
      { label: 'Calls and texts handled without staff', before: '0%', after: '145 a month' },
    ],
    annualValue: 48940,
    timeToValue: 'Lead response live in about 2 weeks; ad savings within 30–60 days',
    narrative:
      'Gablecrest is a 32-person roofing and exteriors company. About four in ten new leads wait more than an hour for a callback, and by then many homeowners have already called another roofer. Estimators chase follow-ups at night, and no one has time to check where the ad budget goes. A Customer Agent now replies to every lead within a minute by text or chat, answers common questions, and books inspections straight onto the estimators\' calendars. An AI Marketing Director finds search spend that never produces a lead and cuts it, so the same 200 leads a month cost about $1,080 less. Booked inspections rise from 960 to 998 a year.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Extra inspections (40% of leads wait over an hour; 10% relative lift)', formula: '200 × 12 × 40% booked × 40% × 10%, rounded down', value: '38 a year' },
      { label: 'Extra jobs (25% of inspections close)', formula: '38 × 25%, rounded down', value: '9 a year' },
      { label: 'Gross profit ($11,000 average job at a 34% specialty-trade margin)', formula: '9 × $11,000 × 34%', value: '$33,660' },
      { label: 'Search spend cut with no lost leads (6% of search spend)', formula: '$18,000 × 12 × 6%', value: '$12,960' },
      { label: 'Calls and texts resolved by the agent', formula: '(300 texts × 35% + 200 calls × 20%) × 12 × 5 min ÷ 60', value: '145 hours a year' },
      { label: 'Office value (scheduler $24.20 × 1.35 = $32/hr, counted at 50%)', formula: '145 × $32 × 50%', value: '$2,320' },
      { label: 'Hours back', value: '145 a year' },
      { label: 'Annual value', formula: '$33,660 + $12,960 + $2,320', value: '$48,940' },
    ],
    sources: ['lab-01', 'lab-06', 'cx-18', 'cx-19', 'cx-20', 'pnl-16', 'mkt-01', 'mkt-19', 'mkt-18', 'cx-09', 'cx-16', 'cx-34', 'ai-08', 'ai-35'],
  },
  {
    id: 'dental',
    industry: 'Dental group',
    business: 'Willowmere Dental Group',
    employees: 60,
    size: 'Mid-size business',
    revenueRange: '$9M–$11M',
    challenge:
      'About 28% of calls go unanswered at peak times, after-hours callers reach voicemail, and many of those callers book with another practice. Office managers build reports by hand.',
    agents: [
      'Customer Agent: answers overflow and after-hours calls and texts, books new patients, confirms and reschedules appointments; access is limited to scheduling and patient messaging, and every action is logged',
      'Analyst Agent: builds one weekly dashboard of production, collections and schedule fill across all four offices',
    ],
    metrics: [
      { label: 'Calls that reach no one', before: 'About 28%', after: 'Answered by the agent, 24/7' },
      { label: 'New patients per month', before: '120', after: '136' },
      { label: 'Answered calls fully handled without staff', before: '0%', after: '20% (864 a month)' },
      { label: 'Office manager time on reports', before: '30 hrs/month', after: '27 hrs/month' },
    ],
    annualValue: 81909,
    timeToValue: 'Live in 3–4 weeks after testing with the practice-management system; full value in about 90 days',
    narrative:
      'Willowmere is a four-office dental group with 60 employees. At peak times more than one call in four goes unanswered, after-hours callers reach voicemail, and some of those callers book elsewhere. A Customer Agent now answers overflow and after-hours calls and texts, books new patients, and confirms and reschedules appointments. Its access is limited to scheduling and patient messaging, every action is logged, and clinical questions go straight to the team. In this model it adds 16 new patients a month and fully handles one in five routine calls. An Analyst Agent pulls data from all four offices into one weekly dashboard.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Missed calls that are new-business opportunities', formula: '6,000 × 28% × 30%', value: '504 a month' },
      { label: 'New patients recovered (40% would be lost; agent completes 20% of calls; 40% book)', formula: '504 × 40% × 20% × 40%, rounded down', value: '16 a month' },
      { label: 'New-patient contribution ($887 first-year revenue at 40% margin)', formula: '16 × 12 × $887 × 40%, rounded down', value: '$68,121' },
      { label: 'Answered calls fully handled by the agent', formula: '6,000 × 72% × 20% × 12 × 5 min ÷ 60', value: '864 hours a year' },
      { label: 'Front-desk value (medical secretary $22.08 × 1.40 = $30/hr, counted at 50%)', formula: '864 × $30 × 50%', value: '$12,960' },
      { label: 'Reporting time returned (10% less time on recurring reports)', formula: '30 hrs × 12 × 10%', value: '36 hours a year' },
      { label: 'Reporting value (office manager $33.41 × 1.40 = $46/hr, counted at 50%)', formula: '36 × $46 × 50%', value: '$828' },
      { label: 'Hours back', formula: '864 + 36', value: '900 a year' },
      { label: 'Annual value', formula: '$68,121 + $12,960 + $828', value: '$81,909' },
    ],
    sources: ['lab-01', 'lab-06', 'cx-22', 'cx-26', 'cx-23', 'cx-21', 'cx-25', 'cx-16', 'cx-31', 'pnl-10', 'cx-34', 'ai-16', 'ai-08', 'ai-35'],
  },
  {
    id: 'restaurant-group',
    industry: 'Restaurant group',
    business: 'Bramblewood Restaurant Group',
    employees: 180,
    size: 'Mid-size business',
    revenueRange: '$13M–$16M',
    challenge:
      'Supplier prices change weekly, but food cost is reviewed only at month-end. General managers spend about 10 hours a week each on invoices, inventory sheets and reports, and catering inquiries often wait a day for a reply.',
    agents: [
      'Analyst Agent: reads every supplier invoice, tracks price changes and food cost by location, and flags dishes that are losing margin',
      'AI Consulting: recommends menu-price and vendor changes for the owners to approve',
      'Customer Agent: answers catering and private-event inquiries within minutes and books them',
    ],
    metrics: [
      { label: 'Food cost (share of food sales)', before: '32.0%', after: '31.6%' },
      { label: 'Reply time for catering and event inquiries', before: 'Next day', after: 'Within 5 minutes' },
      { label: 'Catering orders and private events booked', before: '240 a year', after: '264 a year' },
      { label: 'GM time on invoices, inventory and reports', before: '10 hrs/week each', after: '9 hrs/week each' },
    ],
    annualValue: 71700,
    timeToValue: 'Invoice tracking live in about 3 weeks; food-cost gains within 60–90 days',
    narrative:
      'Bramblewood is a six-location restaurant group with 180 employees. Supplier prices change weekly, but food cost is reviewed only at month-end, long after the margin is gone. General managers spend about ten hours a week on invoices, inventory sheets and reports, and catering inquiries often wait a day for a reply. An Analyst Agent now reads every supplier invoice, tracks price changes and food cost by location, and flags dishes that are losing margin. AI Consulting recommends menu and vendor changes for the owners to approve, trimming food cost by 0.4 points in year one. A Customer Agent answers catering and private-event inquiries within minutes.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Food cost (0.4-point year-one improvement on $10.8M food sales)', formula: '$10,800,000 × 0.4%', value: '$43,200' },
      { label: 'Extra events (all inquiries wait over an hour today; 10% relative lift)', formula: '20 × 12 × 10%', value: '24 a year' },
      { label: 'Event contribution ($3,000 average at 30% margin)', formula: '24 × $3,000 × 30%', value: '$21,600' },
      { label: 'GM time returned (10% less time on recurring reports and cleanup)', formula: '6 × 10 hrs × 50 weeks × 10%', value: '300 hours a year' },
      { label: 'GM value (food service manager $33.36 × 1.40 = $46/hr, counted at 50%)', formula: '300 × $46 × 50%', value: '$6,900' },
      { label: 'Hours back', value: '300 a year' },
      { label: 'Annual value', formula: '$43,200 + $21,600 + $6,900', value: '$71,700' },
    ],
    sources: ['lab-01', 'lab-06', 'pnl-11', 'pnl-18', 'pnl-01', 'pnl-15', 'cx-18', 'cx-19', 'cx-20', 'ai-16', 'ai-23', 'ai-08', 'ai-35'],
  },
  {
    id: 'industrial-distributor',
    industry: 'Industrial distributor',
    business: 'Ironvale Industrial Supply',
    employees: 250,
    size: 'Mid-size business',
    revenueRange: '$80M–$100M',
    challenge:
      'Inside sales and customer service reps spend much of the day on about 12,000 order-status and quote-request emails a month. Quotes take a full business day, each rep prices from a slightly different spreadsheet, and lapsed accounts go unworked.',
    agents: [
      'Customer Agent: answers routine order-status and tracking emails and turns quote requests into ready-to-price drafts',
      'Analyst Agent: checks every quote against margin floors and current costs and flags exceptions before it goes out',
      'AI Sales Agent: researches lapsed accounts and drafts each buyer a personal note; reps approve every quote and outreach email',
    ],
    metrics: [
      { label: 'Routine emails resolved without a rep', before: '0%', after: '35% of 12,000 a month' },
      { label: 'Quote turnaround', before: 'Next business day', after: 'Same day' },
      { label: 'Quotes checked against margin floors', before: 'Spot checks', after: 'Every quote' },
      { label: 'Lapsed accounts sent a personal note', before: 'About 0 a month', after: '100 a month' },
    ],
    annualValue: 169275,
    timeToValue: 'Email agent live in 4–6 weeks; pricing findings within the first 30 days; full run-rate in 4–6 months',
    narrative:
      'Ironvale is a 250-person industrial distributor with three branches. Its inside sales and customer service reps spend much of the day on order-status and quote-request emails, quotes take a full business day, and each rep prices from a slightly different spreadsheet. A Customer Agent now resolves about a third of routine emails and turns quote requests into ready-to-price drafts. An Analyst Agent checks every quote against margin floors and current costs and flags exceptions. An AI Sales Agent researches lapsed accounts and drafts each buyer a personal note. Reps approve every quote and email, and get about 4,270 hours a year back.',
    label: 'Illustrative scenario',
    math: [
      { label: 'Emails resolved by the agent', formula: '12,000 × 12 × 35% × 5 min ÷ 60', value: '4,200 hours a year' },
      { label: 'Email value (blended $37/hr: service rep $30 and wholesale rep $45; counted at 50%)', formula: '4,200 × $37 × 50%', value: '$77,700' },
      { label: 'Price discipline (0.5% better realized price on $36M quoted; half counted in year one)', formula: '$36,000,000 × 0.5% × 50%', value: '$90,000' },
      { label: 'Outreach drafting time returned (10 min per note; 35% faster with AI)', formula: '100 × 12 × 10 min ÷ 60 × 35%', value: '70 hours a year' },
      { label: 'Outreach value (wholesale rep $45/hr, counted at 50%)', formula: '70 × $45 × 50%', value: '$1,575' },
      { label: 'Reactivated accounts', value: 'Not counted (no reliable benchmark)' },
      { label: 'Hours back', formula: '4,200 + 70', value: '4,270 a year' },
      { label: 'Annual value', formula: '$77,700 + $90,000 + $1,575', value: '$169,275' },
    ],
    sources: ['lab-01', 'lab-06', 'lab-07', 'cx-09', 'cx-10', 'cx-34', 'pnl-01', 'pnl-30', 'pnl-15', 'pnl-18', 'ai-03', 'sales-11', 'ai-08', 'ai-35'],
  },
];
