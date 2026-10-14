// AI Consulting comparison: traditional provider categories vs our offer, for the
// same scope of work (an operations and cost review for a 20-100 person business:
// a diagnostic plus a prioritized roadmap). Figures come from content/BENCHMARKS.md
// ("Consulting costs" assumptions, benchmarks and checker notes). Rules follow
// content/DECISIONS.md: categories not firm names, same scope (never "similar
// results"), GSA figures labeled as federal ceiling rates, dated ranges.
// Totals are modeled estimates: rate x hours (120 to 180 hours, conservative to
// base) or weekly team fee x weeks. Dependency-free so Node can import it directly.

export type Provider = {
  id: string;
  category: string;
  rate: string;
  cost: string;
  costLow: number;
  costHigh: number;
  time: string;
  includes: string;
  access: string;
  sources: string[];
};

export const providers: Provider[] = [
  {
    id: "global-strategy",
    category: "Global strategy firm",
    rate:
      "About $400 to $1,600/hr by level (public-sector not-to-exceed rates, New York State contracts, 2025). Sold as weekly teams: $71,400 to $265,200 per week (2021 public price list, all-in).",
    cost:
      "Modeled estimate: $285,600 to $1,009,800 (weekly team fee x weeks: smallest team x 4 weeks; a manager-led team at $168,300/week x 6 weeks).",
    costLow: 285600,
    costHigh: 1009800,
    time: "8 to 15+ weeks",
    includes:
      "Partner-led team, proprietary benchmarks and tools, diagnostic and recommendations. Implementation support is usually a further engagement.",
    access:
      "Rarely works with 20-100 person businesses. Smallest listed products: a $56,100 one-day workshop; consulting teams from $71,400 per week (2021).",
    sources: ["cons-12", "cons-13", "cons-25", "cons-26", "cons-27"],
  },
  {
    id: "big-four",
    category: "Big Four / large advisory firm",
    rate:
      "$96 to $520/hr by title (GSA schedule hourly ceiling rates for federal contracts, and New York State not-to-exceed rates, 2025-2026). Modeled blended team rate: $250 to $350/hr.",
    cost:
      "Modeled estimate: $45,000 to $105,000 (blended $250 to $350/hr x 180 to 300 hours, the same team hours as a boutique review), if they take work this small. Their public-sector projects run about $290,000 to $1.5M+.",
    costLow: 45000,
    costHigh: 105000,
    time: "8 to 17 weeks (modeled)",
    includes:
      "Multi-level team (partner, manager, staff), diagnostic, benchmarks and a report with recommendations.",
    access:
      "Built for large organizations. Public examples are six- and seven-figure engagements; small-business work is uncommon.",
    sources: ["cons-06", "cons-07", "cons-14", "cons-15", "cons-16", "cons-28", "cons-29", "cons-30"],
  },
  {
    id: "regional-boutique",
    category: "Regional boutique consulting firm",
    rate:
      "About $175 to $250/hr (modeled). Public record: $34,990 for 179 hours, about $195/hr (small-office review, 2017).",
    cost:
      "Modeled estimate: $31,500 to $75,000 ($175 to $250/hr x 180 to 300 hours). Public operations reviews ran $34,990 to $145,000 (2017-2025).",
    costLow: 31500,
    costHigh: 75000,
    time: "4 to 7 months (public-sector operations studies)",
    includes:
      "Interviews, process and staffing analysis, written report with prioritized recommendations.",
    access:
      "Takes small and mid-size clients, usually through a scoped proposal. Public examples are municipal reviews.",
    sources: ["cons-31", "cons-32", "cons-33"],
  },
  {
    id: "independent",
    category: "Independent consultant or fractional executive",
    rate:
      "About $130 to $175/hr (modeled). GSA schedule hourly ceiling rates for small-business management consultants (federal contracts): 25th percentile $128.97, median $164.26 (2026). Fractional CFO/COO marketplace, middle 50%: $125 to $225/hr (2026).",
    cost:
      "Modeled estimate: $15,600 to $31,500 ($130 to $175/hr x 120 to 180 hours).",
    costLow: 15600,
    costHigh: 31500,
    time: "8 to 17 weeks (modeled; part-time retainers run longer)",
    includes:
      "One senior person doing interviews, analysis and recommendations. Depth depends on that person's hours and specialty.",
    access:
      "Most accessible. Retainers from $2,400/month for 12 to 15 hours (2026 proposal); fractional executives typically $7,000 to $11,200/month (2026).",
    sources: ["cons-11", "cons-34", "lab-22", "cons-36"],
  },
  {
    id: "contingency",
    category: "Contingency expense-reduction firm",
    rate:
      "$0 upfront, then 30% to 50% of verified savings for 36 to 60 months (2026 public agreements).",
    cost:
      "Depends on savings found: about 18 months of the savings, paid as fees (30% x 60 months or 50% x 36 months). Not comparable as a fixed price.",
    costLow: 0,
    costHigh: 0,
    time: "Varies by vendor category; not stated in the public agreements",
    includes:
      "Audits of specific vendor bills (utilities, telecom, waste, bank and merchant fees) and renegotiation. No whole-operations diagnostic or roadmap.",
    access:
      "No upfront cost, but covers narrow vendor categories only, and fees continue for years.",
    sources: ["cons-37", "cons-38", "cons-39"],
  },
];

export const ours = {
  category: "{brand} AI Consulting",
  price: "Fixed fee, scoped after a free assessment",
  time: "Typically 3 to 5 weeks from kickoff to readout",
  includes:
    "AI does the data-heavy analysis across 12 to 24 months of your financial and operational data; a human advisor checks every finding before it reaches you. You get an executive summary, opportunity register, margin waterfall, 90-day action plan, 12-month roadmap and the working model.",
  access:
    "Built for 20-100 person businesses. Free assessment first, then a fixed fee for the agreed scope.",
};

// Conservative: savingsLow compares our high end with their low end;
// savingsHigh compares our low end with their high end. Providers without a
// fixed-price total (contingency) are left out. Returns null until a price is set.
export function priceComparison(
  price: { from: number; to: number } | null,
): { id: string; category: string; savingsLow: number; savingsHigh: number; pctLow: number; pctHigh: number }[] | null {
  if (!price) return null;
  return providers
    .filter((p) => p.costLow > 0 && p.costHigh > 0)
    .map((p) => {
      const savingsLow = Math.round(p.costLow - price.to);
      const savingsHigh = Math.round(p.costHigh - price.from);
      return {
        id: p.id,
        category: p.category,
        savingsLow,
        savingsHigh,
        pctLow: Math.round((savingsLow / p.costLow) * 100),
        pctHigh: Math.round((savingsHigh / p.costHigh) * 100),
      };
    });
}

export const scopeNote =
  "Compared for the same scope of work: a diagnostic and a prioritized roadmap for a 20-100 person business. Not a claim of identical results.";

export const footnote =
  "Typical market costs from public records, 2021-2026 (sources: cons-06 to cons-39, lab-22). Totals for this scope are modeled estimates: hourly rate x 120 to 300 hours, or weekly team fee x weeks. GSA schedule hourly ceiling rates (federal contracts) and New York State not-to-exceed rates are maximums for public-sector buyers, not what firms charge small businesses; at one large advisory firm, 2025 commercial rates ran about 2 to 3 times its GSA ceilings for the same titles (cons-09, cons-18). Firm names appear only in source citations. Nearly 1,000 Small Business Development Centers also offer no-cost consulting (cons-41).";
