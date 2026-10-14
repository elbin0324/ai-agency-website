// Sales Agent demo: on-screen content. OWNER: demo-sales.
// Every string is final copy from content/DEMOS.md §5 (Parkline IT prospecting Hollis & Grant), rendered with
// typographic quotes. The two emails are word for word from content/COPY.md §6.3, so the Sales page's comparison
// and this demo tell one story. Change DEMOS.md first, then this file.
// All businesses, people and figures are fictional; outcome figures are labeled "Illustrative example".

/** Ideal customer profile (step 1). On phones and after step 1 it collapses into `chips` (DEMOS.md §5 Layout). */
export const icp = {
  title: 'Ideal customer profile',
  lines: [
    { k: 'Who', v: 'law and accounting firms with 10–50 staff' },
    { k: 'Where', v: 'within 40 miles of Riverside' },
    { k: 'Signals', v: 'recently expanded, or hiring for operations roles' },
    { k: 'Decision-maker', v: 'managing partner or firm administrator' },
    { k: 'Exclude', v: 'current clients, open deals, past opt-outs' },
  ],
  chips: ['Law & accounting', '10–50 staff', 'Within 40 miles', 'Expanded or hiring'],
};

/** Prospect list (step 2). */
export const search = {
  searched: 186,
  matches: 8,
  line: 'Searched 186 firms · checked against the CRM · 8 match',
  skipped: '3 more match the profile · skipped: no clear reason to write yet',
};

export interface Prospect {
  fit: number;
  firm: string;
  type: string;
  staff: number;
  miles: number;
  signal: string;
  /** The prospect the demo follows. */
  pick?: boolean;
  /** Hidden on phones: the list shows the top 3 plus the skipped line (DEMOS.md §5 Layout). */
  desktopOnly?: boolean;
}

export const prospects: Prospect[] = [
  { fit: 94, firm: 'Hollis & Grant', type: 'Law', staff: 22, miles: 6, signal: 'Opened a second office last month; hiring an office manager', pick: true },
  { fit: 88, firm: 'Calder & Finch CPAs', type: 'Accounting', staff: 31, miles: 12, signal: 'Posted an IT coordinator role' },
  { fit: 85, firm: 'Ostrow & Pell', type: 'Law', staff: 14, miles: 9, signal: 'Moving to a larger office in December' },
  { fit: 81, firm: 'Marchbank Accounting Group', type: 'Accounting', staff: 18, miles: 22, signal: 'New managing partner in August', desktopOnly: true },
  { fit: 77, firm: 'Varga & Quist LLP', type: 'Law', staff: 41, miles: 35, signal: 'Near the top of the size range', desktopOnly: true },
];

export const meta = (p: Prospect) => `${p.type} · ${p.staff} staff · ${p.miles} mi`;

/** The "Why 94" popover beside the selected row (step 2). */
export const why = {
  title: 'Why 94',
  items: [
    'Law firm, 22 staff',
    'Main office 6 miles away; new office in Riverside',
    'Expanded: second office opened last month',
    'Hiring: office manager role includes IT',
    'Not a client, no open deal, no opt-out',
  ],
};

/** Research dossier (step 3). */
export const dossier = {
  label: 'Dossier · Hollis & Grant',
  person: 'Dana Whitaker',
  role: 'Managing partner',
  initials: 'DW',
  check: '10 of 10 complete',
  checkTotal: 10,
  facts: [
    { fact: 'Opened a second office in Riverside on Sep 8.', source: 'Company website · News page', use: 'In the email', inEmail: true },
    { fact: 'Added two attorneys this year and plans to reach 30 staff by 2027.', source: 'Local news · County business journal, Sep 12', use: 'Context' },
    { fact: 'The office manager role includes “handling IT and vendor relationships.” Posted Sep 29.', source: 'Job posting · Firm careers page', use: 'In the email, quoted', inEmail: true },
    { fact: 'Managing partner since 2019; writes about running a two-office firm.', source: 'Professional profile', use: 'Shapes the tone' },
    { fact: '22 people: 9 attorneys and 13 staff; 4 attorneys work from both offices.', source: 'Company website · Team page', use: 'Shapes the proof point' },
  ],
  /** DESIGN.md §6.25 "excluded" row: what the agent could not verify stays out of the email. */
  excluded: { fact: 'Current IT provider: not found', note: 'Unverified, so it stays out of the email' },
  alsoChecked:
    'not a client · no open deal · no opt-out · tools: Microsoft 365 (from the job post) · reviews: no recurring IT complaints · email address verified',
  reason:
    'a new office, and IT just landed in an office manager’s job. Offer the second-office checklist. No meeting request.',
};

/** Email B, "Written by the Sales Agent" (COPY.md §6.3, verbatim). Markers 1–4 and their notes (DEMOS.md §5 step 4). */
export const emailB = {
  label: 'Written by the Sales Agent',
  from: 'Sam Ortiz <sam@parklineit.example>',
  to: 'Dana Whitaker <dana@hollisgrant.example>',
  subject: 'IT for the new Riverside office',
  words: 89,
  notes: [
    'Firm news page, Sep 8',
    'Job posting, Sep 29 (quoted)',
    'From your approved claims list',
    'Useful first. No meeting request.',
  ],
  signature: {
    name: 'Sam Ortiz',
    address: 'Parkline IT · 400 Example Avenue, Suite 2, Riverside',
    optOut: 'Not the right person, or not interested? Reply “no thanks” and I won’t email again.',
  },
};

/** Email A, "Generic AI email" (COPY.md §6.3, verbatim). Red markers 1–4 (DEMOS.md §5 step 5). */
export const emailA = {
  label: 'Generic AI email',
  subject: 'Partnership opportunity for Hollis & Grant',
  notes: ['A pitch in the subject line', 'Filler', 'Fits any firm. No research.', 'No facts, no address, no opt-out'],
};

/** Quality check (step 6). */
export const quality = {
  title: 'Quality check',
  passed: 5,
  checks: [
    { k: 'Personalization depth', v: '2 facts about Hollis & Grant, each linked to its source (minimum 2)' },
    { k: 'Fact check', v: 'both facts match their sources; “11 law and accounting offices” is on your approved claims list' },
    { k: 'Tone', v: 'plain and direct; no phrases from the cliché list; no meeting request' },
    { k: 'Length', v: '89 words before the signature (limit 120)' },
    { k: 'Compliance footer', v: 'sender, postal address and opt-out line included' },
  ],
  ready: 'Ready for Sam’s approval',
};

/** Approval and schedule (step 7). */
export const approval = {
  title: 'Approval · every first email',
  approved: 'Approved by Sam Ortiz · Mon, Oct 12 · 4:12 pm',
  scheduled: { k: 'Scheduled', v: 'Tue, Oct 13 · 7:40 am (Dana’s time zone)' },
  queue: { k: 'Tuesday’s queue', v: '9 of 20 (per-inbox daily cap)', used: 9, cap: 20 },
  crm: { k: 'Logged in the CRM', v: 'Hollis & Grant · Stage: Contacted' },
};

/** Follow-up plan (step 8). */
export const followUp = {
  title: 'Follow-up plan',
  condition: 'only if there’s no reply',
  touches: [
    { day: 'Day 3', date: 'Fri, Oct 16', text: 'a two-line note in the same thread, with the second-office checklist attached' },
    { day: 'Day 9', date: 'Thu, Oct 22', text: 'a new angle only if research finds one, such as the office manager hire' },
    { day: 'Day 14', date: 'Tue, Oct 27', text: 'a short note to close the loop, then pause for 90 days' },
  ],
  rules: 'Stops on any reply, bounce or opt-out · each follow-up passes the same 5 checks · every touch logged in the CRM',
};

// ---------------------------------------------------------------------------------------------------------
// Result card (DEMOS.md §5 "Result card · Illustrative example"). Computed from the story's inputs, never retyped.
// Sources (src/data/benchmarks.ts): sales-11 / ai-03 (writing-time saving, conservative 35%), sales-16 (CAN-SPAM
// footer). Placeholders for COPY.md §8.7: manual 10 min, agent 1.5 min, n 9, skipped 3.
// No dollar tile: the Sales page values the agent on hours given back and counts any contract won as upside, so the
// card does not headline new-business profit either.
const manualMinutes = 10; // Sam's research and writing time per prospect, by hand
const reviewSaving = 0.35; // share of that time saved once Sam reviews the agent's draft
const samMinutes = manualMinutes * (1 - reviewSaving); // 6.5
const factsInEmail = dossier.facts.filter((f) => f.inEmail).length; // 2: the Riverside office, the job post
const skippedCount = search.matches - prospects.length; // 3

// Source ids (sales-11, ai-03) never break at their hyphen: a word joiner (U+2060) follows it, as in the other
// demos. The ids resolve on /results/ (src/data/benchmarks.ts).
const ids = (s: string) => s.replace(/\b([a-z]+)-(\d+)\b/g, '$1-⁠$2');

/** Basis lines are verbatim from DEMOS.md §5, with the numbers filled in from the inputs above. */
export const result = {
  label: 'Illustrative example' as const,
  metrics: [
    {
      value: `~${samMinutes}`,
      unit: `min vs ~${manualMinutes} min`,
      label: 'Sam’s time per prospect, with review',
      basis: ids(`Agent drafts in 90 s; Sam’s checks keep a ${Math.round(reviewSaving * 100)}% saving on a ${manualMinutes}-minute manual baseline (sales-11, ai-03).`),
    },
    {
      value: `${factsInEmail}/${factsInEmail}`,
      unit: 'facts sourced',
      label: 'Every claim checked',
      basis: 'Both facts link to the dossier (firm news page, Sep 8; job post, Sep 29); the proof point is on Parkline’s approved claims list.',
    },
    {
      value: `${quality.passed}/${quality.passed}`,
      unit: `checks · ${skippedCount} skipped`,
      label: 'Quality before volume',
      basis: ids(`${quality.passed} checks incl. the CAN-SPAM footer (sales-16) and Sam’s approval; ${skippedCount} matching firms skipped for lack of a reason.`),
    },
  ],
};
