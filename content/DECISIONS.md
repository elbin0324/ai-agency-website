# Founder decisions

Decisions the founder made during the build. Agents follow these over any default.

## 2026-10-12

- **Consulting price: not shown yet.** The AI Consulting comparison shows sourced costs for traditional consulting provider categories. Our column reads "Fixed fee, scoped after a free assessment" (`site.consultingPrice` stays `null`). The founder wants the page to emphasize how much cheaper and faster AI consulting is for the same core deliverable (a diagnostic plus a prioritized roadmap). Do that honestly: lean on the sourced traditional costs, time to recommendations, minimum engagement sizes and who does the analysis hours. Phrases like "a fraction of the cost of a traditional engagement" are acceptable; don't state a specific percentage saving or dollar figure for our side. The component must also support a price later: when `site.consultingPrice` is set, it shows the range and computes the difference.
- **Contact email: placeholder for now.** `site.email` stays a clearly marked placeholder in `src/config/site.ts`. Don't publish the founder's personal email.
- **Brand name: keep "Halyard"** as the working name, from `site.name` only.
- **Compare scope and price, not outcomes (2026-10-13, from the source verification):** no public source measures consulting outcomes, and the FTC expects a reasonable basis for any claim before it is published. The comparison therefore says "for the same scope of work" or "the same core deliverable", never "similar results" or "the same results". Label GSA figures "GSA schedule hourly ceiling rates (federal contracts)" and note that they are federal not-to-exceed ceilings, not what firms charge small businesses. Show vendor figures as dated ranges.
- **Comparison style:** use provider categories (global strategy firm, Big Four / large advisory, regional boutique, independent consultant or fractional executive, contingency expense-reduction firm), not named firms, in the public table. Firm names may appear only in source citations.

## 2026-10-14

- **Show the upside (founder: "a lot of numbers are underestimated").** Examples and the calculator should show the bigger value AI can create, not only the conservative floor:
  - include larger businesses (50-250 staff, $10M-$80M revenue), where absolute value is naturally larger;
  - count revenue-side levers, not just hours: recovered after-hours and missed inquiries, faster lead response, ad efficiency on real budgets, sales pipeline from researched outreach, pricing and margin improvements, vendor savings;
  - present ranges from the base value to the optimistic value in `content/BENCHMARKS.md` ("$X to $Y a year"), with the upside clearly marked.
  - Stay honest: never use a rate beyond BENCHMARKS.md's optimistic column, label everything "Modeled estimate" or "Illustrative example", show the math, and keep revenue and gross profit distinct ("added revenue" vs "added gross profit").
- **The calculator covers more than time.** Add sections for customer inquiries, marketing, sales and consulting (margin, pricing, vendor costs) next to team time, with a combined total.
- **The free assessment asks real questions** about the business, where the team's hours go, customers and growth, and priorities, so the first call starts with a draft estimate.
