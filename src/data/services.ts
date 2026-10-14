// The four service lines, the three AI Agent roles and the six demos.
// Copy source: content/COPY.md §1.1 (nav lines), §2.4 (home cards), §3.3 (service blocks),
// §4.2 to §4.5 (agent roles), §5.3, §6.5, §7.3 (capabilities), §8.2 (demo index).
// No outcome numbers live here: those come from worth.ts, roi.ts and scenarios.ts.
// Icons are names from src/components/ui/icons.ts (DESIGN.md §8.1 fixed mapping).

import type { IconName } from '@/components/ui/icons';

export type ServiceSlug = 'ai-agents' | 'marketing' | 'sales' | 'consulting';
/** Demo ids: shared with worth.ts and the demo engine (`data-demo="sales"`). */
export type DemoId = 'customer' | 'analyst' | 'assistant' | 'marketing' | 'sales' | 'consulting';
export type AgentRoleId = 'customer' | 'analyst' | 'assistant';

export type Capability = { title: string; body: string };

export type Service = {
  slug: ServiceSlug;
  /** Ledger number, "01" to "04". */
  num: string;
  name: string;
  /** One line: nav dropdown and compact lists (COPY.md §1.1). */
  short: string;
  /** Home services card text (COPY.md §2.4). */
  summary: string;
  /** Headline and body on /services/ (COPY.md §3.3). */
  headline: string;
  body: string;
  icon: IconName;
  href: string;
  /** "Explore AI Agents" and friends (COPY.md §2.4). */
  linkLabel: string;
  /** Three short bullets on the home card (COPY.md §2.4). */
  highlights: string[];
  /** Longer bullet list on /services/ (COPY.md §3.3). */
  bullets: string[];
  goodFit: string;
  capabilities: Capability[];
  demoIds: DemoId[];
};

export type AgentRole = {
  id: AgentRoleId;
  /** In-page anchor on /services/ai-agents/ and the demo anchor stem. */
  anchor: 'customer-agent' | 'analyst-agent' | 'executive-assistant';
  name: string;
  /** Card text (COPY.md §4.2). */
  short: string;
  headline: string;
  summary: string;
  icon: IconName;
  href: string;
  capabilities: Capability[];
  demoId: DemoId;
  microcopy: string;
};

export type Demo = {
  id: DemoId;
  /** Anchor on /demos/ (e.g. /demos/#sales-agent). */
  anchor: string;
  label: string;
  line: string;
  service: ServiceSlug;
  serviceName: string;
  icon: IconName;
};

export const agentRoles: AgentRole[] = [
  {
    id: 'customer',
    anchor: 'customer-agent',
    name: 'Customer Agent',
    short: 'Talks to your customers 24/7 across chat, text, email and phone. Answers, quotes, books and follows up.',
    headline: 'Every customer answered, day or night.',
    summary:
      'It talks to customers on your website, by text, by email and on the phone. It answers from your own knowledge, books the work and hands off to your team with the full story.',
    icon: 'message-square',
    href: '/services/ai-agents/#customer-agent',
    demoId: 'customer',
    microcopy: 'Introduces itself as a virtual assistant. Customers can ask for a person at any time.',
    capabilities: [
      { title: 'Answers from your knowledge', body: "Learns your services, policies, service area, hours and FAQs. If it doesn't know, it says so and gets the answer from your team instead of guessing." },
      { title: 'Works every channel', body: 'Website chat, text, email and phone calls, with one conversation history per customer.' },
      { title: 'Quotes from your price book', body: 'Prices standard jobs and products from your rules. Custom work gets a range or goes to your team for approval.' },
      { title: 'Books appointments', body: 'Checks real availability in your calendar or scheduling system, books the slot and sends a confirmation.' },
      { title: 'Takes orders and requests', body: 'Captures orders, service requests and job details and enters them in your system, so nobody retypes them.' },
      { title: 'Qualifies leads', body: 'Asks the questions your best salesperson would, then routes hot leads to the right person right away.' },
      { title: 'Follows up', body: 'Texts back missed calls, follows up on open quotes, sends reminders and asks for a review after the job.' },
      { title: 'Hands off with full context', body: 'When a customer asks for a person, gets upset or needs something outside its rules, your team takes over with the transcript and a summary.' },
      { title: "Speaks your customers' language", body: 'Replies in the language the customer writes in, including Spanish.' },
    ],
  },
  {
    id: 'analyst',
    anchor: 'analyst-agent',
    name: 'Analyst Agent',
    short: 'Reads your books and spreadsheets, cleans the data, does all the Excel and explains what changed.',
    headline: 'Your numbers, cleaned up and explained.',
    summary: 'It reads your books, untangles messy spreadsheets, does all the Excel and tells you in plain English what changed and why.',
    icon: 'chart-column',
    href: '/services/ai-agents/#analyst-agent',
    demoId: 'analyst',
    microcopy: 'Works alongside your bookkeeper and accountant, not instead of them. Read-only access to your books by default.',
    capabilities: [
      { title: 'Reads the books', body: 'Works from QuickBooks and Xero exports, bank and card statements, invoices and payroll summaries.' },
      { title: 'Cleans messy data', body: 'Fixes duplicates, inconsistent names, broken dates, mixed formats and merged cells, and logs every change it makes.' },
      { title: 'Does all the Excel', body: 'Builds and maintains workbooks with formulas, lookups and pivot tables your team can follow and edit.' },
      { title: 'Builds charts and dashboards', body: 'KPI dashboards in Excel or Google Sheets that refresh on schedule.' },
      { title: 'Forecasts', body: 'Cash flow, revenue, inventory and staffing forecasts, with every assumption written down.' },
      { title: 'Explains what changed', body: 'A plain-English summary: what moved, why it likely moved and what to look at next.' },
      { title: 'Flags what needs attention', body: 'Unusual expenses, duplicate payments, slipping margins and overdue invoices, before they turn into problems.' },
      { title: 'Answers questions in plain English', body: 'Ask "What was our margin on commercial jobs last quarter?" and get the number, the source and the method.' },
      { title: 'Reconciles across systems', body: 'Matches CRM deals to invoices, orders to shipments and inventory counts to sales.' },
    ],
  },
  {
    id: 'assistant',
    anchor: 'executive-assistant',
    name: 'Executive Assistant Agent',
    short: 'Triages your inbox, drafts replies, assigns tasks, books meetings and builds decks and documents.',
    headline: 'Your inbox, calendar and follow-ups, handled.',
    summary:
      "It goes through your email, drafts replies in your voice, turns messages into tasks for the right person, books meetings and builds the briefings, decks and documents you need.",
    icon: 'inbox',
    href: '/services/ai-agents/#executive-assistant',
    demoId: 'assistant',
    microcopy:
      'Nothing goes out in your name without approval, unless you turn on auto-send for categories you choose. Folders and senders you mark private are excluded.',
    capabilities: [
      { title: 'Triages your inbox', body: 'Sorts every message into needs you, delegated, waiting, FYI and junk, first thing in the morning and through the day.' },
      { title: 'Drafts replies in your voice', body: 'Writes responses based on your past emails and templates. You approve and send, or turn on auto-send for routine categories.' },
      { title: 'Turns email into tasks', body: 'Pulls out action items and assigns them to the right employee in Asana, Trello, Microsoft Teams, Slack or your task tool, with a due date.' },
      { title: 'Tracks follow-ups', body: 'Notices when someone owes you a reply, or you owe them one, and nudges at the right time.' },
      { title: 'Schedules meetings', body: 'Finds times that work, sends invites, handles reschedules and adds the agenda.' },
      { title: 'Prepares briefings', body: "Before each meeting, a one-page brief: who you're meeting, your history with them and what's still open." },
      { title: 'Builds PowerPoint decks', body: 'Turns your notes, data or a rough outline into a clean deck on your template, with charts.' },
      { title: 'Writes documents', body: 'Proposals, SOP drafts, one-pagers, meeting notes and summaries, in your format.' },
      { title: 'Sends a daily digest', body: "One short summary each morning: what came in, what's due and who's waiting on whom." },
    ],
  },
];

export const services: Service[] = [
  {
    slug: 'ai-agents',
    num: '01',
    name: 'AI Agents',
    short: 'Customer, Analyst and Executive Assistant agents for your customers and your team.',
    summary:
      'An AI staff for your customers and your team: a Customer Agent that answers and books around the clock, an Analyst Agent that does the spreadsheets, and an Executive Assistant that runs your inbox.',
    headline: 'An AI staff for your customers and your team.',
    body:
      'Three agents, each built for one job. The Customer Agent answers and books around the clock. The Analyst Agent cleans data, builds the spreadsheets and explains the numbers. The Executive Assistant triages email, assigns tasks, schedules meetings and builds decks.',
    icon: 'message-square',
    href: '/services/ai-agents/',
    linkLabel: 'Explore AI Agents',
    highlights: [
      'Answers chat, text, email and calls',
      'Cleans data and builds workbooks, charts and dashboards',
      'Triages email, assigns tasks and builds decks',
    ],
    bullets: [
      'Website chat, text, email and phone',
      'Bookings, quotes, orders and follow-ups',
      'Formulas, pivot tables, forecasts and dashboards',
      'Inbox triage, drafted replies and task assignment',
      'PowerPoint decks, charts and briefings',
    ],
    goodFit:
      'your team answers the same questions all day, rebuilds the same reports every week or lives in the inbox.',
    // The service-level capabilities are the three roles; each role carries its own nine (agentRoles).
    capabilities: agentRoles.map((r) => ({ title: r.name, body: r.short })),
    demoIds: ['customer', 'analyst', 'assistant'],
  },
  {
    slug: 'marketing',
    num: '02',
    name: 'AI Marketing Director',
    short: 'Audits your ads, runs the tests and moves budget to what works.',
    summary:
      "Audits every ad you run, finds the waste, tests new ideas on its own and moves budget to what's working, inside limits you set.",
    headline: 'Every ad dollar, accounted for.',
    body:
      "It audits every ad you run alongside your website and CRM results, cuts what isn't working, runs its own experiments and moves budget to what is, inside limits you set. Every week you get a plain-English report.",
    icon: 'target',
    href: '/services/marketing/',
    linkLabel: 'Explore the Marketing Director',
    highlights: [
      'Google, Meta and more, tied to real leads and sales',
      'Tests one change at a time and keeps what wins',
      'A plain-English report every week',
    ],
    bullets: [
      'Google Ads, Meta Ads and more',
      'Spend tied to real leads and sales',
      'Tests on creative, audience, offer and landing page',
      'Budget moves within your caps',
      'A plain-English weekly report',
    ],
    goodFit: "you spend real money on ads and can't say with confidence which dollars bring in customers.",
    capabilities: [
      { title: 'Full-account audit', body: 'Every campaign, ad group, keyword, audience and search term across Google Ads, Meta Ads, Microsoft Ads and LinkedIn.' },
      { title: 'Ties spend to revenue', body: 'Connects ad data to your website analytics and CRM, so you see cost per booked job or sale, not just cost per click.' },
      { title: 'Fixes tracking first', body: 'Checks that conversions are counted correctly and flags broken tags and double counting, because good decisions need good data.' },
      { title: 'Cuts the waste', body: "Adds negative keywords, fixes location and schedule settings and pauses what's losing money, with your approval." },
      { title: 'Designs experiments', body: 'Tests one change at a time (creative, audience, offer, landing page or budget split), each with a hypothesis and a stopping rule.' },
      { title: 'Calls winners on evidence', body: "Waits for enough data before declaring a winner, so you don't chase noise." },
      { title: 'Moves budget to what works', body: 'Shifts spend toward the campaigns bringing in customers, inside the caps and rules you approve.' },
      { title: 'Drafts new creative', body: 'Writes headlines, ad copy and landing page variants in your brand voice, for your approval.' },
      { title: 'Reports in plain English', body: "A short weekly note on what changed, what we tested, what we learned and what's next, plus a monthly view of cost per lead, cost per acquisition and return on ad spend." },
    ],
    demoIds: ['marketing'],
  },
  {
    slug: 'sales',
    num: '03',
    name: 'AI Sales Agent',
    short: 'Researched, personal outreach that starts real conversations.',
    summary:
      'Finds businesses that fit your ideal customer, researches each one and writes a short, specific email a thoughtful person would be proud to send.',
    headline: 'Outreach that reads like you did your homework.',
    body:
      'It finds businesses that fit your ideal customer, researches each one and writes a short, specific email for one person at a time. It sends on your rules, follows up, handles replies and logs everything in your CRM.',
    icon: 'send',
    href: '/services/sales/',
    linkLabel: 'Explore the Sales Agent',
    highlights: ['Real research on every prospect', 'A quality check before anything sends', 'Deliverability and opt-outs built in'],
    bullets: [
      'Lists built from your ideal customer profile',
      'A research dossier on every prospect',
      'A quality check before every send',
      'Follow-ups and reply handling',
      'Deliverability and opt-outs built in',
    ],
    goodFit: 'you sell to other businesses and need more qualified conversations without hiring another rep or sending spam.',
    capabilities: [
      { title: 'Builds your list', body: 'Finds businesses that match your ideal customer profile, using reputable business data sources and public information.' },
      { title: 'Researches every prospect', body: "Builds a short dossier from their website, news, job posts, reviews and the person's role." },
      { title: 'Finds the reason to write', body: "Looks for a real, recent trigger that connects to what you sell, and skips the prospect if there isn't one." },
      { title: 'Writes one email for one person', body: 'Short, specific and in your voice, with one clear, easy ask.' },
      { title: 'Checks quality before sending', body: 'Verifies facts against sources and checks tone, length, claims and spam-trigger phrasing.' },
      { title: 'Sends on your rules', body: 'Approve every email, approve a sample, or let it send anything above the quality bar. Daily limits per inbox, always.' },
      { title: 'Follows up like a person', body: 'A small number of follow-ups, each adding something new. It stops the moment someone replies or opts out.' },
      { title: 'Handles replies', body: 'Sorts interested, not now, wrong person and unsubscribe. Drafts responses, books meetings on your calendar and alerts you to hot replies.' },
      { title: 'Logs everything in your CRM', body: 'Contacts, research notes, emails, replies and next steps in HubSpot, Salesforce, Pipedrive or a spreadsheet.' },
    ],
    demoIds: ['sales'],
  },
  {
    slug: 'consulting',
    num: '04',
    name: 'AI Consulting',
    short: 'A ranked plan to cut costs and grow margin.',
    summary:
      'An AI-powered review of your financials and operations that ranks where to cut costs, fix pricing and automate first, with savings and payback for each.',
    headline: 'See where your margin goes, and how to keep more of it.',
    body:
      'An AI-powered review of your financials and operations finds cost savings, pricing gaps and process waste, then ranks each opportunity by value, effort and payback. You get the same core deliverable as a traditional consulting engagement (a diagnostic plus a prioritized roadmap), at a fraction of the cost and typically in 3 to 5 weeks.',
    icon: 'trending-up',
    href: '/services/consulting/',
    linkLabel: 'Explore AI Consulting',
    highlights: ['Margin by job, product and customer', 'Opportunities ranked by value and effort', 'A 90-day plan you can act on'],
    bullets: [
      'Cost and vendor review',
      'Margin by job, product and customer',
      'Pricing analysis',
      'Automation opportunities sized in hours and dollars',
      'AI strategy and readiness',
    ],
    goodFit: "revenue is growing but margin isn't, or you know AI matters and want a plan before you spend.",
    capabilities: [
      { title: 'Cost review', body: 'Categorizes and trends every expense, and flags price creep, duplicate tools and spending that has grown faster than revenue.' },
      { title: 'Margin by job, product and customer', body: 'Shows which work makes money and which quietly loses it, down to the line item.' },
      { title: 'Pricing analysis', body: 'Finds discounting patterns, underpriced services and places where costs have outrun prices, with scenarios for adjusting.' },
      { title: 'Process mapping', body: 'Uses system data and short staff interviews to show where time goes and where work stalls.' },
      { title: 'Automation sizing', body: 'Estimates hours per task, cost per hour and what an agent could take on, ranked by value.' },
      { title: 'Cash and working capital', body: 'Looks at receivables aging, payment terms and inventory turns, and what tightening them would free up.' },
      { title: 'Scenario modeling', body: 'Tests "what if" questions, like a price change, a new hire or a lost customer, with the assumptions visible.' },
      { title: 'Prioritized roadmap', body: 'Every opportunity ranked by expected savings, effort and payback, with an owner and a first step.' },
      { title: 'AI strategy and readiness', body: "Where AI fits your business and where it doesn't, what data and policies you need, and a practical AI use policy for your staff." },
    ],
    demoIds: ['consulting'],
  },
];

/** The six demos, in the fixed site-wide order (DESIGN.md §6.12, COPY.md §8.2). */
export const demos: Demo[] = [
  { id: 'customer', anchor: 'customer-agent', label: 'Customer Agent', line: 'A late-night chat becomes a booked job.', service: 'ai-agents', serviceName: 'AI Agents', icon: 'message-square' },
  { id: 'analyst', anchor: 'analyst-agent', label: 'Analyst Agent', line: 'A messy export becomes a clear answer.', service: 'ai-agents', serviceName: 'AI Agents', icon: 'chart-column' },
  { id: 'assistant', anchor: 'executive-assistant', label: 'Executive Assistant', line: 'An overflowing inbox becomes a short list.', service: 'ai-agents', serviceName: 'AI Agents', icon: 'inbox' },
  { id: 'marketing', anchor: 'marketing-director', label: 'Marketing Director', line: 'An ad audit becomes a running test plan.', service: 'marketing', serviceName: 'AI Marketing Director', icon: 'target' },
  { id: 'sales', anchor: 'sales-agent', label: 'Sales Agent', line: 'A cold prospect becomes a personal email.', service: 'sales', serviceName: 'AI Sales Agent', icon: 'send' },
  { id: 'consulting', anchor: 'consulting', label: 'Consulting', line: 'A P&L becomes a ranked plan.', service: 'consulting', serviceName: 'AI Consulting', icon: 'trending-up' },
];

export const getService = (slug: ServiceSlug | string) => services.find((s) => s.slug === slug);
export const getAgentRole = (id: AgentRoleId | string) => agentRoles.find((r) => r.id === id);
export const getDemo = (id: DemoId | string) => demos.find((d) => d.id === id);
