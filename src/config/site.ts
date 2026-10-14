// Brand and contact config: the ONLY place the brand name lives (ARCHITECTURE.md).
// Components read site.name / site.tagline / site.email and never type them.
// Copy source: content/COPY.md §0.3 (tagline), §1.1 (nav), §1.2 (footer), §1.5 (meta).

export type NavLink = { label: string; href: string };
export type NavServiceLink = NavLink & { description: string; icon: string };
export type NavItem =
  | (NavLink & { children?: undefined })
  | { label: string; href: string; children: NavServiceLink[]; allLink: NavLink };
export type FooterColumn = { title: string; links: NavLink[] };

/** Working brand name (placeholder): change it here and nowhere else. */
const name = 'Halyard';

export const site = {
  name,
  /** Primary tagline: home H1 and footer line (COPY.md §0.3). */
  tagline: 'AI that earns its keep.',
  /** Secondary tagline for meta and banners (COPY.md §0.3, option 2). */
  taglineAlt: 'Done-for-you AI, measured in hours and dollars.',
  /** Footer brand line (COPY.md §1.2). */
  brandLine: 'Done-for-you AI agents and consulting for small and mid-size businesses.',
  /** Default meta description (Home, COPY.md §1.5). */
  description:
    'We build and run AI agents that answer customers, work your numbers, clear your inbox, tune your ads and find new clients. Book a free AI assessment.',
  /** Home <title> (COPY.md §1.5). Other pages use "{Page} | {site.name}". */
  homeTitle: `${name} | Done-for-you AI for small and mid-size businesses`,
  siteUrl: 'https://elbin0324.github.io/ai-agency-website/',
  locale: 'en_US',

  // TODO(founder): placeholder contact address (content/DECISIONS.md 2026-10-12).
  // Replace with the real business inbox before launch. Never put a personal email here.
  email: 'hello@example.com',
  /** Set when the founder approves (DESIGN.md §6.15); render only if non-null. */
  phone: null as string | null,
  founderName: null as string | null,

  /** Scheduling link for the assessment (e.g. a booking page). null = the contact form is the path. */
  bookingUrl: null as string | null,
  /** Form backend endpoint (e.g. Formspree). null = the form falls back to a mailto: link. */
  formEndpoint: null as string | null,
  /** AI Consulting fixed-fee range. Stays null until the founder sets it (DECISIONS.md). */
  consultingPrice: null as { from: number; to: number; currency: 'USD' } | null,

  /** Brand-story pieces (sail label, dictionary caption, the line below) render only when true (DESIGN.md §7.6).
   *  Set to false if the firm is renamed: this copy is the only name-dependent text on the site. */
  brandStory: true,
  brandStoryLine:
    `Why "${name}"? On a sailboat, the halyard is the line that raises the sail. We help raise what your business can do.`,

  /** The one primary call to action, site-wide (COPY.md §1.4). */
  cta: {
    label: 'Book a free AI assessment',
    labelShort: 'Book a free assessment', // nav and tight spaces
    labelMobile: 'Free assessment', // header under 640px
    href: '/contact/',
    microcopy: 'Free 30-minute call. You get a written plan, whether or not you work with us.',
  },
  /** Secondary CTAs (COPY.md §1.4). */
  ctas: {
    demos: { label: 'Watch the demos', href: '/demos/' },
    calculator: { label: 'Estimate your savings', href: '/results/#calculator' },
    examples: { label: 'See the math', href: '/results/#examples' },
    approach: { label: 'See how we work', href: '/approach/' },
  },

  /** Primary navigation (COPY.md §1.1). Services opens the dropdown. */
  nav: [
    {
      label: 'Services',
      href: '/services/',
      children: [
        {
          label: 'AI Agents',
          href: '/services/ai-agents/',
          icon: 'message-square',
          description: 'Customer, Analyst and Executive Assistant agents for your customers and your team.',
        },
        {
          label: 'AI Marketing Director',
          href: '/services/marketing/',
          icon: 'target',
          description: 'Audits your ads, runs the tests and moves budget to what works.',
        },
        {
          label: 'AI Sales Agent',
          href: '/services/sales/',
          icon: 'send',
          description: 'Researched, personal outreach that starts real conversations.',
        },
        {
          label: 'AI Consulting',
          href: '/services/consulting/',
          icon: 'trending-up',
          description: 'A ranked plan to cut costs and grow margin.',
        },
      ],
      allLink: { label: 'All services', href: '/services/' },
    },
    { label: 'Demos', href: '/demos/' },
    { label: 'Results', href: '/results/' },
    { label: 'Approach', href: '/approach/' },
  ] as NavItem[],

  /** Footer link columns (COPY.md §1.2). The footer CTA and contact line come from site.cta / site.email. */
  footer: {
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'AI Agents', href: '/services/ai-agents/' },
          { label: 'AI Marketing Director', href: '/services/marketing/' },
          { label: 'AI Sales Agent', href: '/services/sales/' },
          { label: 'AI Consulting', href: '/services/consulting/' },
        ],
      },
      {
        title: 'See it work',
        links: [
          { label: 'Demos', href: '/demos/' },
          { label: 'Results and examples', href: '/results/' },
          { label: 'Savings calculator', href: '/results/#calculator' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Approach', href: '/approach/' },
          { label: 'Security and data', href: '/approach/#security' },
          { label: 'Contact', href: '/contact/' },
        ],
      },
    ] as FooterColumn[],
    ctaMicrocopy: '30 minutes. No cost, no obligation.',
    contactLine: 'Run by people you can reach:',
    legal: {
      rights: 'All rights reserved.', // rendered as "© {year} {site.name}. All rights reserved."
      figures: 'Figures on this site are illustrative examples or modeled estimates, not client results.',
      figuresLink: { label: 'See how we estimate', href: '/results/#methodology' },
      trademarks:
        'Product names are trademarks of their owners and are listed to show what we connect to. No partnership or endorsement is implied.',
    },
  },
};

export type Site = typeof site;

/** False while site.email is still a reserved placeholder (example.com / .org / .net). Every mailto and
 *  "people you can reach" line checks it, so a dead address never ships. Set site.email to the real
 *  business inbox before launch (DECISIONS.md: never a personal address). */
export const emailReady = !/@example\.(com|org|net)$/i.test(site.email);

/** "{Page} | {site.name}" (COPY.md §1.5). Pass nothing for the home title. */
export function pageTitle(page?: string): string {
  return page ? `${page} | ${site.name}` : site.homeTitle;
}
