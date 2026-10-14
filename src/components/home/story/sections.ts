// Home section numbers, in page order (DESIGN.md §6.3: "Home sections are numbered 01, 02 and so on in
// page order"). Unnumbered: the hero, the integrations strip, the navy calculator band and the final CTA
// (they use an eyebrow or no rule at all, as in design-lab/reference/index.html).
//
//   01 Outcomes (home-hero) · 02 Services · 03 See it work (theater) · 04 Illustrative examples (results)
//   05 How it works · 06 Why us · 07 Security and control · 08 Industries · 09 FAQ
//
// home-story's components read their numbers from here; the other owners' entries are listed so every
// section can agree on one sequence. Change them here if a section moves.
export const homeNum = {
  outcomes: '01',
  services: '02',
  demos: '03',
  examples: '04',
  process: '05',
  whyUs: '06',
  security: '07',
  industries: '08',
  faq: '09',
} as const;
