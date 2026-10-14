// OWNER: theater. Per-demo copy for the home DemoTheater (#demos) and the /demos/ page.
// Source: content/COPY.md §2.5 and §8.1–8.11, tightened. Business names, people and story details follow
// content/DEMOS.md, which wins over the COPY.md placeholders (content/CRITIQUE.md "Consistency pass").
// No outcome numbers here: every figure lives in the demo's own result card, labeled there.
import type { IconName } from '@/components/ui/icons';
import { agentRoles, services, demos, type DemoId } from '@/data/services';

export type DemoCopy = {
  id: DemoId;
  /** Section anchor on /demos/ (COPY.md ids): customer-agent, analyst-agent, … */
  anchor: string;
  /** Tab label ("Customer Agent"). */
  label: string;
  icon: IconName;
  /** Home theater: the one-line intro over the window. */
  intro: string;
  /** /demos/: the section rule name. */
  eyebrow: string;
  headline: string;
  /** /demos/: the setup in two sentences. */
  promise: string;
  /** /demos/: what to notice while it plays (3 items). */
  watch: string[];
  /** The service page this demo belongs to. */
  link: { label: string; href: string };
};

const role = (id: 'customer' | 'analyst' | 'assistant') => agentRoles.find((r) => r.id === id)?.href ?? '/services/ai-agents/';
const service = (slug: 'marketing' | 'sales' | 'consulting') => {
  const s = services.find((x) => x.slug === slug);
  return { label: s?.linkLabel ?? 'Explore the service', href: s?.href ?? '/services/' };
};

const copy: Record<DemoId, Omit<DemoCopy, 'id' | 'anchor' | 'label' | 'icon'>> = {
  customer: {
    intro: 'A late-night website chat becomes a booked job, with the office closed.',
    eyebrow: 'AI Agents · Customer Agent',
    headline: 'A late-night chat becomes a booked job.',
    promise:
      '9:47 p.m., and the office is closed. A homeowner asks Larkfield Plumbing & Air’s website chat about a noisy AC. The agent runs a safety check, quotes from the price book and books the visit.',
    watch: [
      'A safety check before anything else',
      'Prices from the company’s own price book, not a guess',
      'A clean handoff for the question it shouldn’t answer',
    ],
    link: { label: 'Explore the Customer Agent', href: role('customer') },
  },
  analyst: {
    intro: 'A distributor’s messy sales export becomes a chart and a plain-English answer.',
    eyebrow: 'AI Agents · Analyst Agent',
    headline: 'A messy export becomes a clear answer.',
    promise:
      'Margin feels off at Cobalt Creek Supply Co., a regional distributor. The controller drops in the raw Q3 sales export, mixed dates, duplicate rows and all, and asks what’s going on.',
    watch: [
      'Every cleanup step logged for review',
      'Real formulas your team can follow',
      'Findings in plain English, each with a fix and a dollar figure',
    ],
    link: { label: 'Explore the Analyst Agent', href: role('analyst') },
  },
  assistant: {
    intro: 'An overflowing inbox becomes a short list, plus tasks, a meeting and a deck.',
    eyebrow: 'AI Agents · Executive Assistant',
    headline: 'An overflowing inbox becomes a short list.',
    promise:
      'Monday, 7:30 a.m. The owner of Coppervale Electric Co., a 25-person contractor, has 63 unread emails and a Q3 review to prepare. The agent clears the way before his first coffee.',
    watch: [
      'Every email sorted by what it needs from him',
      'Tasks handed to the right person, with due dates',
      'Replies drafted in his voice, waiting for his OK',
    ],
    link: { label: 'Explore the Executive Assistant', href: role('assistant') },
  },
  marketing: {
    intro: 'A dental group’s ads get audited, tested and rebalanced within set limits.',
    eyebrow: 'AI Marketing Director',
    headline: 'An ad audit becomes a running test plan.',
    promise:
      'Stillbrook Dental Group spends $24,000 every four weeks on Google and Meta ads across four offices, but can’t say which dollars book new patients.',
    watch: [
      'Waste found and sized in dollars',
      'Tests that keep running until there’s a clear winner',
      'Budget moves capped at 20% a week, as the owner set',
    ],
    link: service('marketing'),
  },
  sales: {
    intro: 'One prospect gets real research and a personal email, shown next to a generic AI one.',
    eyebrow: 'AI Sales Agent',
    headline: 'A cold prospect becomes a personal email.',
    promise:
      'Parkline IT wants more law and accounting firms as clients. The agent finds one worth writing to, does the homework and drafts a short note to the managing partner.',
    watch: [
      'Firms skipped when there’s no real reason to write',
      'Every fact in the email traced to a source',
      'Five quality checks, then a person approves the send',
    ],
    link: service('sales'),
  },
  consulting: {
    intro: 'A restaurant group’s P&L becomes a ranked list of savings and a 90-day plan.',
    eyebrow: 'AI Consulting',
    headline: 'A P&L becomes a ranked plan.',
    promise:
      'Larder & Flame Kitchen Co. runs two restaurants and a catering kitchen, and its margin keeps slipping. The books go in. A ranked plan with owners comes out.',
    watch: [
      'Every cost traced to its source: invoices, schedules and fees',
      'Savings counted at half, since they depend on the owner’s decisions',
      'A 90-day roadmap with an owner for every step',
    ],
    link: service('consulting'),
  },
};

/** The six demos in the fixed order (DESIGN.md §6.12), with their copy. */
export const demoCopy: DemoCopy[] = demos.map((d) => ({ id: d.id, anchor: d.anchor, label: d.label, icon: d.icon, ...copy[d.id] }));
