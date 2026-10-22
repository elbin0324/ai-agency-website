// Home section numbers, in page order (DESIGN.md §6.3: "Home sections are numbered 01, 02 and so on in
// page order"). Unnumbered: the hero, the integrations strip, the navy calculator band and the final CTA
// (they use an eyebrow or no rule at all, as in design-lab/reference/index.html).
//
//   01 Agent demos (theater) · 02 Control room · 03 Where to start · 04 A day with your AI workforce
//   05 Services · 06 Illustrative examples · 07 How it works · 08 Why us (with security and control)
//   09 Industries · 10 FAQ
//
// 2026-10-21 (new hero): the agent console left the hero for its own section, the control room, right after
// the theater, and Security joined Why us, so the page keeps ten numbered sections. src/pages/index.astro
// passes demos and day to DemoTheater and DayStory; every other section reads its own entry. Change them here
// if a section moves.
export const homeNum = {
  demos: '01',
  control: '02',
  start: '03',
  day: '04',
  services: '05',
  examples: '06',
  process: '07',
  whyUs: '08',
  industries: '09',
  faq: '10',
  /** Kept for Outcomes.astro, which is no longer on the page. */
  outcomes: '02',
} as const;
