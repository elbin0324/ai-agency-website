// Industries we serve (examples, not client claims). Copy source: content/COPY.md §2.11.
// Rendered in `.cell-grid` (DESIGN.md §6.17) with the fixed industry icons (DESIGN.md §8.1).

import type { IconName } from '@/components/ui/icons';

export type Industry = { slug: string; name: string; examples?: string; body: string; icon: IconName };

export const industries: Industry[] = [
  { slug: 'home-services', name: 'Home services', examples: 'HVAC, plumbing, roofing and electrical.', body: 'Answer every call and chat, book jobs after hours and follow up on open estimates.', icon: 'wrench' },
  { slug: 'practices', name: 'Dental, medical and vet practices', body: 'Answer routine questions, book and confirm appointments and fill cancellations from the waitlist, so the front desk can focus on the people in the room.', icon: 'stethoscope' },
  { slug: 'law-accounting', name: 'Law and accounting firms', body: 'Client intake, document prep, inbox triage and deadline tracking, with professional review on anything that leaves the firm.', icon: 'scale' },
  { slug: 'real-estate', name: 'Real estate teams', body: 'Answer every inquiry in minutes, qualify buyers and sellers, and keep showings and follow-ups on track.', icon: 'house' },
  { slug: 'restaurants', name: 'Restaurants and hospitality', body: 'Reservations, catering and event inquiries, review replies and weekly food and labor cost reports.', icon: 'utensils' },
  { slug: 'retail', name: 'Retail and e-commerce', body: 'Order and return questions, product data cleanup, ad testing and inventory reports.', icon: 'shopping-bag' },
  { slug: 'distribution', name: 'Distribution and light manufacturing', body: 'Quotes and order entry from email, inventory analysis and margin by product and customer.', icon: 'package' },
  { slug: 'professional-services', name: 'Agencies and professional services', body: 'Proposals, client reporting, utilization tracking and new-business outreach.', icon: 'briefcase' },
];

export const industriesCopy = {
  eyebrow: 'Industries',
  headline: 'Made for local businesses and growing mid-size companies.',
  subhead: "If your team juggles customers, paperwork and numbers, there's work an agent can take on. A few examples:",
  cta: { label: 'Talk through your business', href: '/contact/' },
  microcopy: [
    "Don't see your industry? Fitness studios, multi-location service businesses and many others fit too. We start from how your business runs, not from a template.",
    'Handle patient, client or financial records? We agree what agents can see with you, and your compliance lead, before anything connects.',
  ],
};
