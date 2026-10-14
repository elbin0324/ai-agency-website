// Consulting demo data: Larder & Flame Kitchen Co. (fictional). OWNER: demo-consulting.
// Every row, number and string is copied from content/DEMOS.md §6 (calibrated 2026-10-13, checked in
// Appendix A). Change the storyboard first, then this file. Dependency-free, so the frontmatter of every
// sub-part and the step file can share it.

export const business = {
  name: 'Larder & Flame Kitchen Co.',
  revenue: 3_600_000,
};

/** Step 1: data sources (left panel, "Sources"). */
export const sources: { name: string; detail: string; icon: string }[] = [
  { name: 'QuickBooks', detail: 'P&L, trailing 12 months', icon: 'calculator' },
  { name: 'POS', detail: 'sales by hour and item, 12 months', icon: 'receipt' },
  { name: 'Payroll', detail: 'hours and overtime, 26 pay periods', icon: 'users' },
  { name: 'Vendor invoices', detail: '214 invoices, 3,912 lines', icon: 'file-text' },
  { name: 'Contracts', detail: 'produce and protein price agreements', icon: 'pen-line' },
  { name: 'Delivery apps', detail: '12 monthly statements', icon: 'package' },
  { name: 'Card processing', detail: '12 monthly statements', icon: 'dollar-sign' },
  { name: 'Utilities', detail: '24 bills + interval meter data', icon: 'power' },
];

/** Step 2: the P&L, trailing 12 months. `key` links a line to the findings that pulse it in step 3. */
export type PnlLine = { key: string; label: string; value: number; kind?: 'revenue' | 'total' | 'ebitda' };
export const pnl: PnlLine[] = [
  { key: 'revenue', label: 'Revenue', value: 3_600_000, kind: 'revenue' },
  { key: 'food', label: 'Food & beverage cost', value: 1_116_000 },
  { key: 'labor', label: 'Labor (wages, taxes, benefits)', value: 1_152_000 },
  { key: 'occupancy', label: 'Occupancy (rent, CAM)', value: 288_000 },
  { key: 'delivery', label: 'Delivery-app commissions', value: 162_000 },
  { key: 'packaging', label: 'Packaging & supplies', value: 126_000 },
  { key: 'utilities', label: 'Utilities', value: 108_000 },
  { key: 'ga', label: 'G&A and other', value: 101_520 },
  { key: 'card', label: 'Card processing', value: 82_080 },
  { key: 'repairs', label: 'Repairs & maintenance', value: 72_000 },
  { key: 'marketing', label: 'Marketing', value: 54_000 },
  { key: 'insurance', label: 'Insurance', value: 43_200 },
  { key: 'waste', label: 'Waste, linen & services', value: 36_000 },
  { key: 'software', label: 'Software & subscriptions', value: 28_800 },
  { key: 'total', label: 'Total costs', value: 3_369_600, kind: 'total' },
  { key: 'ebitda', label: 'EBITDA', value: 230_400, kind: 'ebitda' },
];
/** Phones show the first 8 lines, then "Show all" (DEMOS.md §6 layout). */
export const pnlTopLines = 8;
/** "% of revenue" with one decimal, as printed in DEMOS.md (31.0%, 2.8%, 93.6% …). */
export const pctOfRevenue = (v: number) => `${((v / business.revenue) * 100).toFixed(1)}%`;

/** Step 3: findings (left panel, "Findings"). `did: found` is one line in DEMOS.md, split at the colon. */
export const findings: { did: string; found: string; line: string }[] = [
  { did: 'Matched 3,912 invoice lines to contract prices', found: '23 items billed above contract, avg +6.8%', line: 'food' },
  { did: 'Compared recipes with item sales and purchases', found: '5 top sellers over-portioned', line: 'food' },
  { did: 'Mapped 26 pay periods to covers by hour', found: 'overtime 6.2% of hours; Mon–Wed 2–5 pm overstaffed', line: 'labor' },
  { did: 'Read 12 delivery-app statements', found: '$648,000 in app sales at a 25% average commission', line: 'delivery' },
  { did: 'Read 12 card statements', found: '2.85% effective rate on $2.88M of card sales; two quotes on file at 2.70%', line: 'card' },
  { did: 'Read 24 utility bills with interval data', found: 'equipment on ~3 hrs before open; HVAC on overnight', line: 'utilities' },
];

/** Step 4: ranked opportunities. `area: action` is one name in DEMOS.md, split at the colon for emphasis. */
export type Opportunity = {
  area: string;
  action: string;
  identified: number;
  counted: number;
  margin: string;
  effort: 'Low' | 'Medium';
  time: string;
  evidence: string;
};
export const opportunities: Opportunity[] = [
  {
    area: 'Food cost', action: 'enforce contract prices and portion specs', identified: 28_800, counted: 14_400, margin: '+0.40 pts',
    effort: 'Medium', time: '30–60 days', evidence: '23 items billed above contract (avg +6.8%): $16,200. 5 top sellers over-portioned: $12,600.',
  },
  {
    area: 'Labor', action: 'schedule to forecast, cut overtime', identified: 23_040, counted: 11_520, margin: '+0.32 pts',
    effort: 'Medium', time: '30–60 days', evidence: 'Overtime 6.2% → 4.8% of hours: $10,800. 680 overstaffed hours × $18 loaded: $12,240.',
  },
  {
    area: 'Delivery', action: 'move repeat app orders to direct ordering', identified: 18_000, counted: 9_000, margin: '+0.25 pts',
    effort: 'Medium', time: '60–90 days', evidence: 'Shift $100,000 of $648,000 app sales from a 25% commission to ~7% all-in.',
  },
  {
    area: 'Energy', action: 'equipment schedule and HVAC setbacks', identified: 5_040, counted: 2_520, margin: '+0.07 pts',
    effort: 'Low', time: '2 weeks', evidence: 'Fryers and ovens on ~3 hrs before open; HVAC on overnight. ~5% of $108,000.',
  },
  {
    area: 'Card processing', action: 'switch to interchange-plus', identified: 4_320, counted: 2_160, margin: '+0.06 pts',
    effort: 'Low', time: '2–4 weeks', evidence: '2.85% → 2.70% on $2.88M of card sales; two quotes on file.',
  },
];
export const opportunityTotal = { identified: 79_200, counted: 39_600, margin: '+1.10 pts' };
export const opportunityNote =
  'Counted = half of identified, because each saving depends on your decisions or a negotiation. Revenue held at $3.6M; opportunities modeled independently.';

/** Step 5: EBITDA margin waterfall (counted savings). Values in margin points. */
export type WaterfallBar = { label: string; short: string; type: 'total' | 'step' | 'result'; from: number; to: number; value: string; dollars: string };
export const waterfall: WaterfallBar[] = [
  { label: 'EBITDA margin today', short: 'Today', type: 'total', from: 0, to: 6.4, value: '6.40%', dollars: '$230,400' },
  { label: 'Food cost', short: 'Food', type: 'step', from: 6.4, to: 6.8, value: '+0.40 pts', dollars: '$14,400' },
  { label: 'Labor', short: 'Labor', type: 'step', from: 6.8, to: 7.12, value: '+0.32 pts', dollars: '$11,520' },
  { label: 'Delivery', short: 'Deliv.', type: 'step', from: 7.12, to: 7.37, value: '+0.25 pts', dollars: '$9,000' },
  { label: 'Energy', short: 'Energy', type: 'step', from: 7.37, to: 7.44, value: '+0.07 pts', dollars: '$2,520' },
  { label: 'Card processing', short: 'Card', type: 'step', from: 7.44, to: 7.5, value: '+0.06 pts', dollars: '$2,160' },
  { label: 'Modeled EBITDA margin', short: 'After', type: 'result', from: 0, to: 7.5, value: '7.50%', dollars: '$270,000' },
];
// `short` is the phone label (under 640px, ~41px per column at 390px). "Modeled" (48px) collided with its neighbor;
// "After" fits centered, and the legend still names the bar "Modeled".
export const waterfallTitle = 'EBITDA margin · counted savings';
export const waterfallNote = 'Counted savings only: half of each identified amount, on $3.6M revenue. If all five land in full: 8.60%.';
export const waterfallFinding =
  'EBITDA margin rises from 6.40% to 7.50% with five counted savings: food cost +0.40 points, labor +0.32, delivery +0.25, energy +0.07, card processing +0.06.';

/** Step 6: the 90-day roadmap. Days are inclusive, on a 90-day axis. */
export type Workstream = { name: string; owner: string; start: number; end: number; days: string; ongoing?: boolean; value: string };
export const phases = [
  { days: 'Days 1–30', name: 'Quick wins' },
  { days: 'Days 31–60', name: 'Core fixes' },
  { days: 'Days 61–90', name: 'Grow direct' },
];
export const workstreams: Workstream[] = [
  { name: 'Switch card processing to interchange-plus', owner: 'Nina C. + Carla D.', start: 1, end: 21, days: '1–21', value: '$4,320/yr' },
  { name: 'Equipment start-up schedule and HVAC setbacks', owner: 'Tyler R. + Simone W.', start: 1, end: 14, days: '1–14', value: '$5,040/yr' },
  { name: 'Contract-price check on every invoice; claim credits', owner: 'Andre M. + agent', start: 1, end: 30, days: '1–30, then ongoing', ongoing: true, value: '$16,200/yr' },
  { name: 'Portion specs and plating photos for 5 top sellers', owner: 'Andre M.', start: 31, end: 45, days: '31–45', value: '$12,600/yr' },
  { name: 'Forecast-based schedules at both locations', owner: 'Tyler R. + Simone W. + agent', start: 31, end: 60, days: '31–60', value: '$23,040/yr' },
  { name: 'Direct online ordering with a bag-insert offer', owner: 'Nina C.', start: 61, end: 90, days: '61–90', value: '$18,000/yr' },
  { name: 'Weekly margin dashboard; day-90 review', owner: 'Agent + Nina C.', start: 61, end: 90, days: '61–90', value: 'Tracks all five' },
];
/** Milestones at days 30, 60 and 90: `day` is the lead, `text` the rest of the DEMOS.md line. */
export const milestones = [
  { day: 'Day 30', text: '$25,560/yr in place' },
  { day: 'Day 60', text: '$61,200/yr in place' },
  { day: 'Day 90', text: 'all five live · $79,200/yr identified ($39,600 counted)' },
];
/** Which phase (0–2) a workstream starts in: the rows are already in phase order. */
export const phaseOf = (w: Workstream) => Math.floor((w.start - 1) / 30);
