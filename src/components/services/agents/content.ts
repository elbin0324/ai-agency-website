// OWNER: services-a
// Page copy for /services/ai-agents/: the three role chapters and the FAQ.
// Source: content/COPY.md §4.3 to §4.5, §4.8, §4.10, tightened for layout, plus content/CRITIQUE.md
// (edit 6: patient information; e-commerce order status and returns; "does all the Excel" softened;
// the "what if it's wrong" answer without the commitments still pending founder review).
// Names, headlines, anchors and icons come from @/data/services (agentRoles); numbers from @/data/worth.
import type { IconName } from '@/components/ui/icons';
import type { AgentRoleId } from '@/data/services';

export type Item = { icon: IconName; title: string; body: string };

export type ChapterCopy = {
  id: AgentRoleId;
  /** Standfirst beside the chapter headline. */
  aside: string;
  /** The trust line under the standfirst. */
  note: string;
  noteIcon: IconName;
  capabilities: Item[];
  /** One line over the demo window. */
  demoLine: string;
  /** One line over the guardrails. */
  guardLine: string;
  guardrails: Item[];
};

export const chapters: ChapterCopy[] = [
  {
    id: 'customer',
    aside:
      'It answers on your website, by text, by email and on the phone, from your own knowledge. It books the work and hands off to your team with the full story.',
    note: 'Introduces itself as a virtual assistant. Customers can ask for a person at any time.',
    noteIcon: 'user-check',
    capabilities: [
      { icon: 'file-text', title: 'Answers from your knowledge', body: "Learns your services, policies, service area, hours and FAQs. If it doesn't know, it says so and asks your team instead of guessing." },
      { icon: 'phone', title: 'Works every channel', body: 'Website chat, text, email and phone, with one conversation history per customer.' },
      { icon: 'receipt', title: 'Quotes from your price book', body: 'Prices standard jobs and products by your rules. Custom work gets a range or goes to your team.' },
      { icon: 'calendar-check', title: 'Books the work', body: 'Checks real availability in your calendar or scheduling system, books the slot and sends the confirmation.' },
      { icon: 'package', title: 'Handles orders and returns', body: 'Takes orders and job details, answers “where’s my order?” from your store and handles returns within your policy.' },
      { icon: 'list-checks', title: 'Qualifies leads', body: 'Asks the questions your best salesperson would, then routes hot leads to the right person right away.' },
      { icon: 'refresh-cw', title: 'Follows up', body: 'Texts back missed calls, follows up on open quotes, sends reminders and asks for a review after the job.' },
      { icon: 'user-check', title: 'Hands off with the full story', body: 'When a customer asks for a person, gets upset or needs something outside its rules, your team takes over with the transcript and a summary.' },
      { icon: 'globe', title: 'Speaks your customers’ language', body: 'Replies in the language the customer writes in, including Spanish.' },
    ],
    demoLine: 'A 9:47 p.m. website chat becomes a booked job, with the office closed.',
    guardLine: 'The rules it follows in every conversation.',
    guardrails: [
      { icon: 'shield-check', title: 'Approved knowledge only', body: 'It answers from sources you approve. No guessing at prices, policies or promises.' },
      { icon: 'user-check', title: 'Handoff rules you set', body: 'Complaints, refunds, VIP customers, legal or medical questions and large orders go to a person.' },
      { icon: 'circle-alert', title: 'Safety first', body: 'A gas smell, a flood or a medical emergency gets safety instructions and goes straight to a person.' },
      { icon: 'sliders-horizontal', title: 'Hard limits', body: 'Discounts, refunds and order sizes it can’t exceed, whatever a customer asks.' },
    ],
  },
  {
    id: 'analyst',
    aside:
      'It reads your books, untangles messy spreadsheets, builds the workbooks and tells you in plain English what changed and why.',
    note: 'Works alongside your bookkeeper and accountant, not instead of them. Read-only access to your books by default.',
    noteIcon: 'key-round',
    capabilities: [
      { icon: 'file-text', title: 'Reads the books', body: 'Works from QuickBooks and Xero exports, bank and card statements, invoices and payroll summaries.' },
      { icon: 'list-checks', title: 'Cleans messy data', body: 'Fixes duplicates, inconsistent names, broken dates and merged cells, and logs every change it makes.' },
      { icon: 'file-spreadsheet', title: 'Builds the workbooks', body: 'Formulas, lookups and pivot tables your team can follow and edit. No black boxes.' },
      { icon: 'chart-column', title: 'Charts and dashboards', body: 'KPI dashboards in Excel or Google Sheets that refresh on a schedule.' },
      { icon: 'chart-line', title: 'Forecasts', body: 'Cash flow, revenue, inventory and staffing forecasts, with every assumption written down.' },
      { icon: 'lightbulb', title: 'Explains what changed', body: 'A plain-English summary: what moved, why it likely moved and what to look at next.' },
      { icon: 'circle-alert', title: 'Flags what needs attention', body: 'Unusual expenses, duplicate payments, slipping margins and overdue invoices, before they become problems.' },
      { icon: 'search', title: 'Answers questions', body: 'Ask “What was our margin on commercial jobs last quarter?” and get the number, the source and the method.' },
      { icon: 'workflow', title: 'Reconciles across systems', body: 'Matches CRM deals to invoices, orders to shipments and inventory counts to sales.' },
    ],
    demoLine: 'A messy sales export becomes clean data, a chart and a plain-English answer.',
    guardLine: 'Read-only by default, with every step on the record.',
    guardrails: [
      { icon: 'key-round', title: 'Read-only books', body: 'It can read your accounting data, but it can’t post entries, move money or change records.' },
      { icon: 'list', title: 'Every change logged', body: 'Each cleanup step is recorded, so anyone can see what changed and why.' },
      { icon: 'file-text', title: 'Sources and assumptions shown', body: 'Every answer cites its source and method. Every forecast lists its assumptions.' },
      { icon: 'users', title: 'Your accountant stays in charge', body: 'Your bookkeeper and accountant keep the books accurate and compliant. The agent does the reporting around them.' },
    ],
  },
  {
    id: 'assistant',
    aside:
      'It reads your email first, drafts replies in your voice, turns messages into tasks for the right person, books meetings and builds the briefings and decks you need.',
    note: 'Nothing goes out in your name without your approval, unless you turn on auto-send for categories you choose.',
    noteIcon: 'user-check',
    capabilities: [
      { icon: 'inbox', title: 'Triages your inbox', body: 'Sorts every message into needs you, delegated, waiting, FYI and junk, first thing and through the day.' },
      { icon: 'pen-line', title: 'Drafts replies in your voice', body: 'Learns from your past emails and templates. You approve and send, or allow auto-send for routine categories.' },
      { icon: 'list-checks', title: 'Turns email into tasks', body: 'Pulls out action items and assigns them, with a due date, in Asana, Trello, Teams, Slack or your task tool.' },
      { icon: 'clock', title: 'Tracks follow-ups', body: 'Notices who owes you a reply, and who is waiting on you, and nudges at the right time.' },
      { icon: 'calendar', title: 'Schedules meetings', body: 'Finds times that work, sends invites, handles reschedules and adds the agenda.' },
      { icon: 'clipboard-list', title: 'Prepares briefings', body: 'A one-page brief before each meeting: who you’re meeting, your history and what’s still open.' },
      { icon: 'presentation', title: 'Builds PowerPoint decks', body: 'Turns notes, data or a rough outline into a clean deck on your template, with charts.' },
      { icon: 'file-text', title: 'Writes documents', body: 'Proposals, SOP drafts, one-pagers, meeting notes and summaries, in your format.' },
      { icon: 'mail', title: 'Sends a daily digest', body: 'One short summary each morning: what came in, what’s due and who’s waiting on whom.' },
    ],
    demoLine: 'An overflowing inbox becomes a short list, plus tasks, a meeting and a deck.',
    guardLine: 'Nothing goes out in your name unless you say so.',
    guardrails: [
      { icon: 'user-check', title: 'Your OK before it sends', body: 'Drafts wait for your approval. Allow auto-send only for categories you choose, like scheduling confirmations.' },
      { icon: 'lock', title: 'Private stays private', body: 'Folders and senders you mark private are excluded from everything it reads.' },
      { icon: 'list', title: 'Every action logged', body: 'Each draft, task and invite is recorded, so you can see what it did and why.' },
      { icon: 'power', title: 'Autonomy on your terms', body: 'Approvals stay on until the work is consistently right. You can pause it at any time.' },
    ],
  },
];

export const getChapter = (id: AgentRoleId) => chapters.find((c) => c.id === id)!;

/** FAQ (COPY.md §4.10, plus CRITIQUE.md edit 6 and a "what if it's wrong" answer). */
export const faqItems = (approachControlsHref: string) => [
  {
    q: 'Will customers know they’re talking to AI?',
    a: 'Yes. The Customer Agent introduces itself as a virtual assistant, and customers can ask for a person at any time. Being upfront builds trust, and in some places it’s required.',
  },
  {
    q: 'What happens when it doesn’t know the answer?',
    a: 'It says so, tells the customer what happens next and passes the question to the right person with the full conversation. If you want it to handle that question next time, we add the answer to its approved knowledge.',
  },
  {
    q: 'What if an agent gets something wrong?',
    a: [
      'It will happen occasionally, so we plan for it. Agents answer only from information you approve, anything unclear goes to a person, and early on your team approves the work before it goes out, which is where most mistakes get caught.',
      `If one slips through, we correct it, pause that kind of task if needed and fix the cause, and you’ll see what happened in the next report. Every action is logged, so there’s never a question about what the agent did or why. <a class="link" href="${approachControlsHref}">How human approval works</a>.`,
    ],
  },
  {
    q: 'Can it work with our scheduling, field-service or practice software?',
    a: 'Often, yes. If your system has an API or a reliable integration, the agent reads real availability and books directly. If not, we set up a practical workaround, such as holding the slot on a shared calendar for your team to confirm. Either way, you’ll know which applies, and how much of your team’s time it takes, before any work starts.',
  },
  {
    q: 'Can you work with patient information?',
    a: [
      'Yes, with the right paperwork and tight limits. Before an agent touches patient information, we sign a business associate agreement (BAA) with your practice, and every AI and messaging service that handles that information has signed one with us. Agents get the narrowest access the job needs, usually scheduling and patient messaging, not clinical charts, and clinical questions always go to your team. Every action is logged.',
      'We set this up with whoever handles HIPAA for you, often the office manager. You won’t see a HIPAA badge here, because there’s no official HIPAA certification for vendors. Instead, we’ll show you exactly how your patients’ information is handled.',
    ],
  },
  {
    q: 'Will the Analyst Agent replace our bookkeeper or accountant?',
    a: 'No. Your bookkeeper and accountant keep the books accurate and compliant. The Analyst Agent takes on the reporting, cleanup and analysis around them, and it reads your accounting data without changing it.',
  },
  {
    q: 'Can the Executive Assistant send email on my behalf?',
    a: 'Only if you want it to. By default it drafts and you approve. You can allow auto-send for routine categories, like scheduling confirmations, and keep approval on for everything else. Folders and senders you mark private are excluded.',
  },
];
