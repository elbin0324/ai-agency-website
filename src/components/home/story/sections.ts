// Home section numbers, in page order (DESIGN.md §6.3: "Home sections are numbered 01, 02 and so on in
// page order"). Unnumbered: the hero, the integrations strip, the navy calculator band and the final CTA
// (they use an eyebrow or no rule at all, as in design-lab/reference/index.html).
//
//   01 Agent demos (theater) · 02 Where to start · 03 A day with your AI workforce · 04 Services
//   05 Illustrative examples · 06 How it works · 07 Why us · 08 Security and control · 09 Industries · 10 FAQ
//
// 2026-10-14 trim (critique round): the "Same team. More gets done." ledger (Outcomes) is off the page; the
// theater and the day story are numbered too, so the sequence never skips. src/pages/index.astro passes
// demos and day to DemoTheater and DayStory; every other section reads its own entry. Change them here if
// a section moves.
export const homeNum = {
  demos: '01',
  start: '02',
  day: '03',
  services: '04',
  examples: '05',
  process: '06',
  whyUs: '07',
  security: '08',
  industries: '09',
  faq: '10',
  /** Kept for Outcomes.astro, which is no longer on the page. */
  outcomes: '02',
} as const;
