// Executive Assistant demo: every message, row and number from content/DEMOS.md §3 (calibrated to
// BENCHMARKS.md base values; do not edit numbers here without changing DEMOS.md first).
// OWNER: demo-assistant. Coppervale Electric Co. and everyone named are fictional; figures are illustrative.
// DEMOS.md writes straight quotes; they render here as typographic quotes and apostrophes.
import type { IconName } from '@/components/ui/icons';

export const business = 'Coppervale Electric Co.';
export const windowTitle = `Mail · ${business}`;
export const owner = { name: 'Mike Alvarez', initials: 'MA', email: 'mike@coppervale.example' };

/** Status chip in the title bar: 7:30 (step 1) → 7:31 (2) → 7:32 (4) → 7:33 (6) → 7:34 am (7). */
export const clockAt = (time: string) => `Mon, Oct 5 · ${time} am`;

// ---------- Step 1: the inbox (bold = unread) ----------
export interface Mail {
  id: 'laura' | 'hilltop' | 'jorge' | 'greg' | 'wire' | 'kelly' | 'northgate' | 'amy';
  from: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
}

export const inbox: Mail[] = [
  { id: 'laura', from: 'Laura Chen', initials: 'LC', subject: 'East lot lights out + LED retrofit quote?', preview: 'Hi Mike, about half the parking lot lights on the east side have been out since…', time: '6:58 am' },
  { id: 'hilltop', from: 'Hilltop Electrical Supply', initials: 'HE', subject: 'Delivery update: order #44817', preview: 'Due to a manufacturer delay, the 400A panelboard for Maple Court will now ship…', time: '6:41 am' },
  { id: 'jorge', from: 'Jorge Ramirez', initials: 'JR', subject: 'Q3 review this week?', preview: 'Can we do the Q3 ops review before Friday? Crew hours and the callback log are…', time: 'Sun 8:12 pm' },
  { id: 'greg', from: 'Greg Holt', initials: 'GH', subject: 'RFP: Pine Hollow Medical Plaza electrical services', preview: 'We’re inviting three firms to bid on our 2027 maintenance contract. Walk-through Thu at 10…', time: 'Sun 4:30 pm' },
  { id: 'wire', from: 'Wire & Panel Weekly', initials: 'WP', subject: 'Copper prices and 5 job-site safety tips', preview: 'This week: what copper prices mean for Q4 bids…', time: 'Sat 6:00 am' },
  { id: 'kelly', from: 'Kelly Brooks', initials: 'KB', subject: 'PTO request: Oct 19–23', preview: 'Hi Mike, I’d like to take Oct 19–23 off for my sister’s wedding…', time: 'Fri 5:47 pm' },
  { id: 'northgate', from: 'Northgate HOA Board', initials: 'NH', subject: 'Invoice #2291', preview: 'Our board approved payment for the clubhouse lighting but asked if we could split…', time: 'Fri 3:15 pm' },
  { id: 'amy', from: 'Amy Lindqvist', initials: 'AL', subject: 'Your GL & auto renewal: decision by Oct 9', preview: 'Renewal terms attached. Premium is $21,760/yr (+6%)…', time: 'Fri 11:02 am' },
];
export const unread = 63;
export const moreUnread = unread - inbox.length; // "+ 55 more unread"

export const folders: { label: string; icon: IconName }[] = [
  { label: 'Inbox', icon: 'inbox' },
  { label: 'Drafts', icon: 'pen-line' },
  { label: 'Sent', icon: 'send' },
  { label: 'Archive', icon: 'package' },
];

// ---------- Step 2: triage (counts total 63) ----------
export interface Category { label: string; count: number; icon: IconName; what: string; you?: boolean }
export const categories: Category[] = [
  { label: 'Needs you', count: 6, icon: 'user-check', what: 'Stays in the inbox, in priority order', you: true },
  { label: 'Customers', count: 11, icon: 'building-2', what: 'Labeled for the team' },
  { label: 'Team', count: 9, icon: 'users', what: 'Labeled; action items pulled out' },
  { label: 'Vendors & invoices', count: 10, icon: 'receipt', what: 'Labeled; invoices sent to Tasha’s queue' },
  { label: 'Calendar', count: 4, icon: 'calendar', what: 'Invites and changes added to the calendar' },
  { label: 'Receipts & notifications', count: 9, icon: 'file-text', what: 'Filed' },
  { label: 'Newsletters & promos', count: 14, icon: 'megaphone', what: 'Archived' },
];
export const needsYou = 6;
export const handled = unread - needsYou; // 57
/** "Needs you · 6", in priority order. */
export const needsOrder: Mail['id'][] = ['laura', 'greg', 'hilltop', 'kelly', 'northgate', 'amy'];
export const triageLog = `Read ${unread} emails · ${handled} sorted, filed or archived · ${needsYou} need you`;

// ---------- Step 3: drafts ----------
export const laura = {
  from: 'Laura Chen, Property Manager, Oakmont Business Park',
  subject: 'East lot lights out + LED retrofit quote?',
  body: 'Hi Mike, about half the parking lot lights on the east side have been out since Thursday, and tenants are noticing. Also, can you send the LED retrofit quote we talked about by Thursday? Laura',
};
/** The draft reply, paragraph by paragraph (the last one is two lines: "Thanks," / "Mike"). */
export const draft: string[][] = [
  ['Hi Laura,'],
  ['Thanks for flagging the east lot, and sorry for the trouble. Jorge will have a crew there tomorrow morning to get those lights back on.'],
  ['On the LED retrofit: you’ll have our quote by Wednesday, a day ahead of your deadline. One suggestion: add photocell and timer controls, since we logged 4 service calls on those fixtures last winter.'],
  ['Would a 15-minute call on Wednesday at 2:00 pm work to go over it?'],
  ['Thanks,', 'Mike'],
];
export const sources: { key: string; text: string; icon: IconName }[] = [
  { key: 'Service log', text: 'east-lot fixtures, 4 calls last winter', icon: 'wrench' },
  { key: 'Open request', text: 'Oakmont LED retrofit quote', icon: 'file-text' },
  { key: 'Calendar', text: 'Wed 2:00 pm free', icon: 'calendar' },
  { key: 'Tone', text: 'matched to Mike’s sent mail', icon: 'pen-line' },
];
/** The other five rows in Needs you once the drafts are ready. */
export const drafted: Partial<Record<Mail['id'], { thread: string; chip: 'Draft ready' | 'Decision'; sub: string }>> = {
  greg: { thread: 'Re: RFP: Pine Hollow Medical Plaza electrical services', chip: 'Draft ready', sub: 'Confirms Thursday’s 10:00 am walk-through with Kelly.' },
  hilltop: { thread: 'Re: Delivery update: order #44817', chip: 'Draft ready', sub: 'Asks for a firm ship date and whether another branch has the panelboard.' },
  kelly: { thread: 'Re: PTO request: Oct 19–23', chip: 'Draft ready', sub: 'Approves; Jorge covers Kelly’s projects. No calendar conflicts.' },
  northgate: { thread: 'Re: Invoice #2291', chip: 'Draft ready', sub: 'Agrees to two payments of $2,430, due Oct 15 and Nov 15.' },
  amy: { thread: 'Your GL & auto renewal: decision by Oct 9', chip: 'Decision', sub: '$21,760/yr (+6%). Needs Mike by Fri, Oct 9.' },
};

// ---------- Step 4: tasks ----------
export interface Task { who: string; initials: string; task: string; due: string; from: string }
export const tasks: Task[] = [
  { who: 'Jorge Ramirez', initials: 'JR', task: 'Send a crew to restore the east-lot lights at Oakmont Business Park', due: 'Tue, Oct 6', from: 'East lot lights out + LED retrofit quote?' },
  { who: 'Theo Okafor', initials: 'TO', task: 'Oakmont LED retrofit quote, with a photocell and timer option', due: 'Wed, Oct 7', from: 'East lot lights out + LED retrofit quote?' },
  { who: 'Lena Price', initials: 'LP', task: 'Get a firm ship date for the Maple Court panelboard; move the rough-in if needed', due: 'Mon, Oct 5 (today)', from: 'Delivery update: order #44817' },
  { who: 'Kelly Brooks', initials: 'KB', task: 'Prep site notes for the Pine Hollow walk-through (Thu 10:00 am)', due: 'Wed, Oct 7', from: 'RFP: Pine Hollow Medical Plaza electrical services' },
  { who: 'Tasha Green', initials: 'TG', task: 'Set up the two-payment plan for Northgate HOA invoice #2291 ($4,860)', due: 'Thu, Oct 8', from: 'Invoice #2291' },
];
export const tasksFoot = 'Posted to the team task board · each person notified';

// ---------- Step 5: scheduling ----------
export const meeting = { title: 'Q3 Operations Review', meta: '60 min · 6 people', people: 6 };
export const slots: { when: string; free: number; note?: string; booked?: boolean }[] = [
  { when: 'Tue 4:00 pm', free: 4, note: 'Jorge, Theo: Maple Court site' },
  { when: 'Wed 3:00 pm', free: 5, note: 'Kelly: client meeting' },
  { when: 'Thu 8:00 am', free: 6, booked: true },
];
export const event = {
  title: 'Q3 Operations Review',
  when: 'Thu, Oct 8 · 8:00–9:00 am · Conference room + video link',
  people: 'Mike Alvarez, Jorge Ramirez, Theo Okafor, Lena Price, Kelly Brooks, Tasha Green',
  file: 'Q3_Operations_Review.pptx',
  building: 'Q3_Operations_Review.pptx (building…)',
  done: 'Q3_Operations_Review.pptx · 6 slides',
};
export const bookingLog = { text: 'Invites sent to 6 · replied to Jorge:', quote: '“Booked for Thu 8:00 am. Deck to follow.”' };
export const bookingRule = 'Rule: internal scheduling replies can send without approval';

// ---------- Step 6: the deck ----------
export const deckSources: { text: string; icon: IconName }[] = [
  { text: 'QuickBooks · Q3 P&L', icon: 'database' },
  { text: 'Job management · hours, callbacks, inspections', icon: 'clipboard-list' },
  { text: 'Shared drive · crew hours (from Jorge)', icon: 'file-spreadsheet' },
];
export type SlideKind = 'title' | 'kpis' | 'hbars' | 'columns' | 'table' | 'bullets';
export const slides: { n: number; title: string; kind: SlideKind }[] = [
  { n: 1, title: 'Q3 Operations Review', kind: 'title' },
  { n: 2, title: 'Q3 at a glance', kind: 'kpis' },
  { n: 3, title: 'Revenue by segment', kind: 'hbars' },
  { n: 4, title: 'Field hours vs. budget', kind: 'columns' },
  { n: 5, title: 'Quality & safety', kind: 'table' },
  { n: 6, title: 'Q4 priorities', kind: 'bullets' },
];
export const titleSlide = { sub: `${business} · July–September · Prepared Oct 5` };
export const kpis: { label: string; value: string; delta?: string; deltaNote?: string }[] = [
  { label: 'Revenue', value: '$1.42M', delta: '+8%', deltaNote: 'vs. Q3 last year' },
  { label: 'Gross margin', value: '31.5%' },
  { label: 'Service calls', value: '486' },
  { label: 'Callback rate', value: '1.2%' },
];
/** Revenue by segment, $K, largest first (total 1,418). */
export const segments = [
  { label: 'Tenant improvements', value: 604 },
  { label: 'Service & maintenance', value: 512 },
  { label: 'New construction', value: 231 },
  { label: 'Lighting retrofits', value: 71 },
];
export const segmentsTotal = segments.reduce((t, s) => t + s.value, 0); // 1,418
/** Field hours, actual vs. budget (Q3 9,020 vs 8,650: +4.3%; August +6.4%). */
export const fieldHours = [
  { month: 'Jul', actual: 3020, budget: 2900 },
  { month: 'Aug', actual: 3140, budget: 2950, label: true },
  { month: 'Sep', actual: 2860, budget: 2800 },
];
export const fieldHoursAxis = { max: 3500, ticks: [0, 1000, 2000, 3000] };
export const fieldHoursCallout = 'Q3: 9,020 hrs, 4.3% over budget. August +6.4%: inspection delays and two open journeyman spots.';
export const quality = [
  { label: 'Callbacks', value: '6 of 486 service calls (1.2%)' },
  { label: 'Failed inspections', value: '2 of 38' },
  { label: 'Recordable injuries', value: '0' },
];
export const priorities = ['Submit the Pine Hollow bid by Oct 30', 'Hire 2 journeyman electricians', 'Raise service rates 4% on Jan 1', 'Get callbacks under 1%'];

// ---------- Step 7: the morning briefing ----------
export const briefing = {
  title: 'Morning briefing',
  when: 'Mon, Oct 5 · 7:34 am',
  lines: [
    { lead: 'Inbox:', text: '63 → 6 need you. 5 replies drafted for your OK.', icon: 'inbox' },
    { lead: 'Decide:', text: 'insurance renewal, $21,760/yr (+6%), due Fri.', icon: 'user-check', you: true },
    { lead: 'Delegated:', text: '5 tasks to Jorge, Theo, Lena, Kelly and Tasha.', icon: 'users' },
    { lead: 'Booked:', text: 'Q3 Operations Review, Thu 8:00 am. Deck attached.', icon: 'calendar-check' },
    { lead: 'Today:', text: '10:00 am Maple Court site visit · 2:00 pm payroll review with Tasha.', icon: 'clock' },
    { lead: 'Heads-up:', text: 'the Maple Court panelboard is late; Lena is on it.', icon: 'info' },
  ] as { lead: string; text: string; icon: IconName; you?: boolean }[],
};

// ---------- Mobile ticker (the latest action, one line) ----------
export const ticker = {
  start: '63 unread emails',
  triage: `Read ${unread} emails · ${needsYou} need you`,
  drafts: '5 replies drafted for Mike’s OK',
  tasks: '5 tasks assigned · each person notified',
  booked: 'Booked Thu 8:00 am · invites sent to 6',
  deck: 'Q3 deck built · 6 slides',
  final: 'Briefing ready · 6 decisions for Mike',
};

// ---------- Result card (DEMOS.md §3 "Result card · Illustrative example") ----------
export const result = {
  label: 'Illustrative example' as const,
  metrics: [
    { value: '4', unit: 'min', label: 'Agent time, 7:30 to 7:34 am', basis: '63 emails (a Monday backlog; ~32 a day is typical, time-01), 5 replies drafted, 5 tasks, 1 meeting, 6 slides.' },
    { value: '57', unit: 'min back', label: 'Owner time, this morning', basis: '57 emails handled at ~1 min each (time-03); deck and drafts still need his review, so not counted (ai-21); $65 at $68/hr (lab-01).' },
    { value: '63 → 6', label: 'Unread emails to decisions', basis: '57 sorted, filed or archived; 5 of the 6 have replies waiting for approval (time-01: ~3 replies a workday).' },
  ],
};

export const microcopy = `Simulated demo. ${business} and the people and businesses named are fictional. Figures are illustrative.`;
