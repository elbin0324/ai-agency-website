> **Numbers superseded (2026-10-13):** the calibrated numbers live in `src/data/roi.ts`, `worth.ts`, `scenarios.ts` and `consulting.ts`, aligned with `content/BENCHMARKS.md`. Use this file for structure and narrative; take every figure from the data modules.

# Scenarios, savings model and methodology

Owner: operations and finance. Status: ready for build; the founder reviews all claims before launch. Last verified: 2026-10-12.

This file holds every number the site shows about value: the savings calculator (home and `/results/`), one "What it's worth" example per service, six industry scenarios for `/results/`, and the methodology text. `src/data/roi.ts` and `src/data/scenarios.ts` transcribe it exactly; Appendix B repeats the same data as JSON to make that transcription mechanical.

## How to use this file

- **Labels are required wherever these numbers appear.** Calculator results: "Modeled estimate". Per-service examples: "Illustrative example". Industry scenarios: "Illustrative scenario" (as built, the site labels scenarios per `DESIGN.md` §6.4 instead: the "Illustrative example" tag, with "Fictional business" by the business name). Put "Fictional business" next to every example and scenario business name, and link each label to Methodology & assumptions (Section 4).
- **Never present any of this as a client result.** No quotes or testimonials attributed to the fictional businesses, no "our clients see" phrasing. Say "in this example" or "in this model".
- **Numbers are linked.** Don't round, restate or tweak one figure on its own. If an input changes, recompute the whole example; every step of the math is shown.
- **No prices.** Every value is gross value to the business, before any fees. The calculator's break-even budget is the price-free way to frame it.
- **Brand.** "Halyard" is a placeholder; in code, use `site.name`.
- **Verified.** Every calculation written inline in this file (the expressions in code formatting) was re-evaluated by script, and every narrative was word-counted.

Where things go:

| Page | Content from this file |
|---|---|
| `/` (home) | Savings calculator, compact (Section 1); scenario preview with 3 cards, suggested 3.3 Gablecrest Roofing, 3.4 Willowmere Dental and 3.6 Ironvale Industrial Supply, linking to `/results/` |
| `/services/ai-agents/` | What it's worth 2.1 (Customer Agent), 2.2 (Analyst Agent), 2.3 (Executive Assistant Agent) |
| `/services/marketing/` | What it's worth 2.4 |
| `/services/sales/` | What it's worth 2.5, including the "for contrast" line |
| `/services/consulting/` | What it's worth 2.6, including the margin waterfall |
| `/demos/` and each demo's result card | The matching example's headline figures (Section 2), so demo numbers agree with the service pages |
| `/results/` | Full calculator with "Show the math" (Section 1), all six scenarios (Section 3), Methodology & assumptions (Section 4) |

## 1. Savings calculator (ROI model)

### 1.1 Where it appears

- **Home, Savings section:** compact layout. Same five inputs, same four outputs, short disclaimer, link to `/results/`.
- **`/results/`:** full layout. Same inputs and outputs, plus the "Show the math" breakdown (1.6), the full disclaimer (1.10) and Methodology & assumptions (Section 4).
- One implementation (`computeRoi` in `src/data/roi.ts`) serves both, so the two pages always agree.

### 1.2 Inputs

| id | Label (on screen) | Help text (on screen) | Default | Min | Max | Step | Unit |
|---|---|---|---|---|---|---|---|
| `teamSize` | Team members in desk or customer-facing roles | Count office, admin, customer service, sales and management staff. Leave out roles that are almost all hands-on, such as field technicians or kitchen staff. | 15 | 1 | 500 | 1 | people |
| `hourlyCost` | Average loaded cost per hour | Hourly pay plus payroll taxes and benefits. If you only know the wage, multiply it by 1.3. | 40 | 20 | 150 | 1 | $ per hour |
| `repetitiveHours` | Hours per person each week on repetitive tasks | Email, data entry, copying between systems, reports, scheduling and follow-ups. Leave out time spent answering customers; that is the last question. | 8 | 1 | 30 | 1 | hours per week |
| `aiSharePct` | Share of that work AI agents take on | 35% is a conservative starting point. Go higher only for very repetitive, rules-based work. We cap it at 60% because your people keep the judgment calls. | 35 | 20 | 60 | 5 | % |
| `monthlyInquiries` | Customer inquiries per month | Calls, chats, emails, texts and web forms from customers and prospects. | 200 | 0 | 10,000 | 50 | per month |

Why these defaults:

- **15 people:** a desk team in the middle of the small-business range we serve (office, front desk, sales, bookkeeping, managers).
- **$40 an hour:** close to a blended desk team at our planning rates (two customer service reps at $27, an administrative assistant at $29, a bookkeeper at $31, an office manager at $43, a sales rep at $43 and an operations manager at $66: `($27 × 2 + $29 + $31 + $43 + $43 + $66) ÷ 7 = $38`). It sits below the U.S. private-industry average employer cost of $46.89 per hour worked (BLS, June 2026).
- **8 hours a week:** one day a week of repetitive work per person, a deliberately modest starting point.
- **35%:** conservative; well inside the 20% to 60% range, and the cap stays at 60% because people keep the judgment calls.
- **200 inquiries a month:** about 10 per business day, modest for a 15-person business.

Input behavior: values snap to the step and clamp to min/max. Sliders and number fields stay in sync. Format money with thousands separators and no cents.

### 1.3 Fixed assumptions (constants)

| Constant | Value | Why |
|---|---|---|
| Working weeks per month | 4 (a 48-week working year) | Leaves about four weeks a year for holidays, vacation and sick days. Slightly understates savings. |
| Staff minutes per customer inquiry | 6 | Read or listen, look it up, reply and log it. Many calls and quotes take longer, so 6 keeps the estimate low. |
| Human review allowance | 20% of the hours agents take on | People review drafts, approve sensitive actions and handle exceptions. That time is subtracted. |
| Hours in a full-time month | 160 | 40 hours × 4 weeks, consistent with the 48-week year (1,920 hours a year). |
| Value basis | The loaded hourly cost entered | We value time at what it costs, not at what it could earn. |
| Rounding | Hours rounded down to whole hours; dollars calculated from the rounded hours; FTE rounded down to one decimal | Every figure on screen reconciles, and rounding never inflates a result. |

### 1.4 Formulas

```text
internal hours      = teamSize × repetitiveHours × 4
inquiry hours       = monthlyInquiries × 6 ÷ 60
hours in scope      = internal hours + inquiry hours
hours taken on      = hours in scope × aiSharePct ÷ 100
review hours        = hours taken on × 20%
hours back (exact)  = hours taken on − review hours        (= hours in scope × share × 0.8)
HOURS BACK / MONTH  = floor(hours back exact)
VALUE / MONTH       = HOURS BACK × hourlyCost               (shown as the break-even budget)
VALUE / YEAR        = VALUE / MONTH × 12
CAPACITY (FTE)      = floor(HOURS BACK ÷ 160, to 1 decimal)
optional: hours back per person per month = floor(HOURS BACK ÷ teamSize, to 1 decimal)
optional: work-weeks back per year        = floor(HOURS BACK × 12 ÷ 40)
```

### 1.5 Outputs and on-screen copy

All four outputs carry the "Modeled estimate" label.

| Output | Label | Value format (defaults) | Supporting line |
|---|---|---|---|
| `hoursReturned` | Hours back each month | 140 hrs | After setting aside time for human review. |
| `annualValue` | Value of that time each year | $67,200 | At your loaded hourly cost. |
| `fte` | Capacity added | 0.8 FTE | Full-time equivalent staff, without hiring. (Show "under 0.1 FTE" below 0.1.) |
| `breakEvenMonthly` | Break-even budget | $5,600 a month | An AI program that costs less than this pays for itself in time saved alone, before any new revenue. |

The break-even budget is the value framing that doesn't depend on our prices: it tells a visitor the most an AI program could cost each month before it stops paying for itself, so they can weigh any quote, including ours. Optional secondary line under hours: "About {hoursPerPerson} hours back per person each month." If hours back is 0, show "Under 1 hour" and $0.

### 1.6 "Show the math" breakdown (results page)

A collapsible panel under the outputs, recomputed live. Template (values from `computeRoi`):

```text
Repetitive work:     {teamSize} people × {repetitiveHours} hrs × 4 weeks = {internalHours} hrs a month
Customer inquiries:  {monthlyInquiries} × 6 min = {inquiryHours} hrs a month
Agents take on {aiSharePct}%: {hoursInScope} hrs × {aiSharePct}% = {hoursTakenOn} hrs
Less 20% for review: {hoursTakenOn} − {reviewHours} = {hoursReturnedExact} hrs  → {hoursReturned} hrs (rounded down)
Value:               {hoursReturned} hrs × ${hourlyCost} = ${monthlyValue} a month × 12 = ${annualValue} a year
Capacity:            {hoursReturned} ÷ 160 = {fte} full-time equivalents (rounded down)
```

Show the "→ … (rounded down)" part only when the exact value isn't a whole number. Show intermediate values with up to two decimals (trailing zeros trimmed); for any on-step input they are exact.

### 1.7 Reference implementation (TypeScript)

Transcribe into `src/data/roi.ts`. Integer arithmetic in minutes keeps every result exact; nothing is rounded until the final floor.

```ts
export type RoiInputId = 'teamSize' | 'hourlyCost' | 'repetitiveHours' | 'aiSharePct' | 'monthlyInquiries';

export interface RoiInputSpec {
  id: RoiInputId;
  label: string;
  help: string;
  default: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export const ROI_INPUTS: RoiInputSpec[] = [
  { id: 'teamSize', label: "Team members in desk or customer-facing roles", help: "Count office, admin, customer service, sales and management staff. Leave out roles that are almost all hands-on, such as field technicians or kitchen staff.", default: 15, min: 1, max: 500, step: 1, unit: 'people' },
  { id: 'hourlyCost', label: "Average loaded cost per hour", help: "Hourly pay plus payroll taxes and benefits. If you only know the wage, multiply it by 1.3.", default: 40, min: 20, max: 150, step: 1, unit: '$ per hour' },
  { id: 'repetitiveHours', label: "Hours per person each week on repetitive tasks", help: "Email, data entry, copying between systems, reports, scheduling and follow-ups. Leave out time spent answering customers; that is the last question.", default: 8, min: 1, max: 30, step: 1, unit: 'hours per week' },
  { id: 'aiSharePct', label: "Share of that work AI agents take on", help: "35% is a conservative starting point. Go higher only for very repetitive, rules-based work. We cap it at 60% because your people keep the judgment calls.", default: 35, min: 20, max: 60, step: 5, unit: '%' },
  { id: 'monthlyInquiries', label: "Customer inquiries per month", help: "Calls, chats, emails, texts and web forms from customers and prospects.", default: 200, min: 0, max: 10000, step: 50, unit: 'per month' },
];

export const ROI_CONSTANTS = {
  weeksPerMonth: 4, // 48 working weeks a year / 12
  minutesPerInquiry: 6, // staff time per routine customer inquiry
  reviewAllowancePct: 20, // share of agent-handled hours set aside for human review
  fteHoursPerMonth: 160, // 40 hours x 4 weeks
  hoursPerWorkWeek: 40,
  monthsPerYear: 12,
} as const;

export type RoiInputs = Record<RoiInputId, number>;

export interface RoiResult {
  internalHours: number;
  inquiryHours: number;
  hoursInScope: number;
  hoursTakenOn: number;
  reviewHours: number;
  hoursReturnedExact: number;
  hoursReturned: number; // whole hours, rounded down
  monthlyValue: number;
  annualValue: number;
  breakEvenMonthly: number; // same as monthlyValue, framed as a budget
  fte: number; // rounded down to one decimal
  hoursPerPerson: number; // rounded down to one decimal
  workWeeksPerYear: number; // rounded down
}

/** Snap each value to its step and clamp it to [min, max]; missing or invalid values use the default. */
export function sanitizeRoiInputs(raw: Partial<RoiInputs>): RoiInputs {
  const out = {} as RoiInputs;
  for (const spec of ROI_INPUTS) {
    const v = Number(raw[spec.id]);
    const base = Number.isFinite(v) ? v : spec.default;
    const snapped = Math.round(base / spec.step) * spec.step;
    out[spec.id] = Math.min(spec.max, Math.max(spec.min, snapped));
  }
  return out;
}

export function computeRoi(raw: Partial<RoiInputs>): RoiResult {
  const i = sanitizeRoiInputs(raw);
  const c = ROI_CONSTANTS;
  const internalMin = i.teamSize * i.repetitiveHours * c.weeksPerMonth * 60;
  const inquiryMin = i.monthlyInquiries * c.minutesPerInquiry;
  const scopeMin = internalMin + inquiryMin;
  const keepPct = 100 - c.reviewAllowancePct; // 80
  const hoursReturnedExact = (scopeMin * i.aiSharePct * keepPct) / (60 * 100 * 100);
  const hoursReturned = Math.floor((scopeMin * i.aiSharePct * keepPct) / (60 * 100 * 100));
  const hoursTakenOn = (scopeMin * i.aiSharePct) / (60 * 100);
  const monthlyValue = hoursReturned * i.hourlyCost;
  return {
    internalHours: internalMin / 60,
    inquiryHours: inquiryMin / 60,
    hoursInScope: scopeMin / 60,
    hoursTakenOn,
    reviewHours: hoursTakenOn - hoursReturnedExact,
    hoursReturnedExact,
    hoursReturned,
    monthlyValue,
    annualValue: monthlyValue * c.monthsPerYear,
    breakEvenMonthly: monthlyValue,
    fte: Math.floor((hoursReturned * 10) / c.fteHoursPerMonth) / 10,
    hoursPerPerson: Math.floor((hoursReturned * 10) / i.teamSize) / 10,
    workWeeksPerYear: Math.floor((hoursReturned * c.monthsPerYear) / c.hoursPerWorkWeek),
  };
}

/** Display helper for intermediate hours: up to two decimals, trailing zeros trimmed. */
export const fmtHours = (x: number) => Number(x.toFixed(2)).toLocaleString('en-US');
```

### 1.8 Worked examples

Each example follows the formulas in 1.4 step by step. The default state is what visitors see first; examples A to C show a small, a medium and a larger business.

#### Default state (what visitors see first)

The calculator's starting values: a 15-person desk team at $40 an hour.

Inputs: team 15 · $40 an hour · 8 hours a week · 35% · 200 inquiries a month

1. Repetitive work: `15 × 8 × 4 = 480` hours a month
2. Customer inquiries: `200 × 6 ÷ 60 = 20` hours a month
3. Hours in scope: `480 + 20 = 500`
4. Agents take on 35%: `500 × 35% = 175` hours
5. Less 20% for review: `175 − 175 × 20% = 140` hours back each month (a whole number, so no rounding)
6. Value per month, shown as the break-even budget: `140 × $40 = $5,600`
7. Value per year: `$5,600 × 12 = $67,200`
8. Capacity: `140 ÷ 160 = 0.875`, rounded down to one decimal: 0.8 FTE
9. Optional lines: hours back per person `floor(140 × 10 ÷ 15) ÷ 10 = 9.3` a month; work-weeks back per year `floor(140 × 12 ÷ 40) = 42`

**On screen:** 140 hrs back each month · $67,200 a year · 0.8 FTE · break-even budget $5,600 a month

#### Example A: small business

An eight-person professional office, such as an accounting, insurance or property-management office. Mixed admin, bookkeeping and client-service roles average about $36 an hour loaded.

Inputs: team 8 · $36 an hour · 10 hours a week · 40% · 300 inquiries a month

1. Repetitive work: `8 × 10 × 4 = 320` hours a month
2. Customer inquiries: `300 × 6 ÷ 60 = 30` hours a month
3. Hours in scope: `320 + 30 = 350`
4. Agents take on 40%: `350 × 40% = 140` hours
5. Less 20% for review: `140 − 140 × 20% = 112` hours back each month (a whole number, so no rounding)
6. Value per month, shown as the break-even budget: `112 × $36 = $4,032`
7. Value per year: `$4,032 × 12 = $48,384`
8. Capacity: `112 ÷ 160 = 0.7` FTE
9. Optional lines: hours back per person `112 ÷ 8 = 14` a month; work-weeks back per year `floor(112 × 12 ÷ 40) = 33`

**On screen:** 112 hrs back each month · $48,384 a year · 0.7 FTE · break-even budget $4,032 a month

#### Example B: medium business

A multi-location service business with about 120 employees, 40 of them in office, front-desk, sales and management roles. Loaded cost averages $42 an hour.

Inputs: team 40 · $42 an hour · 10 hours a week · 40% · 1,000 inquiries a month

1. Repetitive work: `40 × 10 × 4 = 1,600` hours a month
2. Customer inquiries: `1,000 × 6 ÷ 60 = 100` hours a month
3. Hours in scope: `1,600 + 100 = 1,700`
4. Agents take on 40%: `1,700 × 40% = 680` hours
5. Less 20% for review: `680 − 680 × 20% = 544` hours back each month (a whole number, so no rounding)
6. Value per month, shown as the break-even budget: `544 × $42 = $22,848`
7. Value per year: `$22,848 × 12 = $274,176`
8. Capacity: `544 ÷ 160 = 3.4` FTE
9. Optional lines: hours back per person `544 ÷ 40 = 13.6` a month; work-weeks back per year `floor(544 × 12 ÷ 40) = 163`

**On screen:** 544 hrs back each month · $274,176 a year · 3.4 FTE · break-even budget $22,848 a month

#### Example C: larger business

A regional company with about 250 employees, 120 of them in desk and customer-facing roles (inside sales, customer service, purchasing, accounting, management). More systems and exceptions, so a lower 30% share. Loaded cost averages $45 an hour.

Inputs: team 120 · $45 an hour · 8 hours a week · 30% · 2,600 inquiries a month

1. Repetitive work: `120 × 8 × 4 = 3,840` hours a month
2. Customer inquiries: `2,600 × 6 ÷ 60 = 260` hours a month
3. Hours in scope: `3,840 + 260 = 4,100`
4. Agents take on 30%: `4,100 × 30% = 1,230` hours
5. Less 20% for review: `1,230 − 1,230 × 20% = 984` hours back each month (a whole number, so no rounding)
6. Value per month, shown as the break-even budget: `984 × $45 = $44,280`
7. Value per year: `$44,280 × 12 = $531,360`
8. Capacity: `984 ÷ 160 = 6.15`, rounded down to one decimal: 6.1 FTE
9. Optional lines: hours back per person `984 ÷ 120 = 8.2` a month; work-weeks back per year `floor(984 × 12 ÷ 40) = 295`

**On screen:** 984 hrs back each month · $531,360 a year · 6.1 FTE · break-even budget $44,280 a month

### 1.9 Test vectors

`computeRoi` must return exactly these values (dollars are whole numbers).

| Case | Inputs (team, cost, hrs/wk, share, inquiries) | Hours in scope | Hours back (exact) | Hours back | Value / month | Value / year | FTE | Hrs / person | Work-weeks / yr |
|---|---|---|---|---|---|---|---|---|---|
| Defaults | 15, $40, 8, 35%, 200 | 500 | 140 | 140 | $5,600 | $67,200 | 0.8 | 9.3 | 42 |
| Rounding down (142.8 becomes 142) | 15, $40, 8, 35%, 300 | 510 | 142.8 | 142 | $5,680 | $68,160 | 0.8 | 9.4 | 42 |
| Example A: small | 8, $36, 10, 40%, 300 | 350 | 112 | 112 | $4,032 | $48,384 | 0.7 | 14 | 33 |
| Example B: medium | 40, $42, 10, 40%, 1,000 | 1,700 | 544 | 544 | $22,848 | $274,176 | 3.4 | 13.6 | 163 |
| Example C: larger | 120, $45, 8, 30%, 2,600 | 4,100 | 984 | 984 | $44,280 | $531,360 | 6.1 | 8.2 | 295 |
| All minimums | 1, $20, 1, 20%, 0 | 4 | 0.64 | 0 | $0 | $0 | 0 | 0 | 0 |
| All maximums | 500, $150, 30, 60%, 10,000 | 61,000 | 29,280 | 29,280 | $4,392,000 | $52,704,000 | 183 | 58.5 | 8,784 |

### 1.10 Disclaimer text (verbatim)

**Results page (under the calculator), followed by a link "Methodology & assumptions":**

> Modeled estimate, not a quote or a guarantee. The calculator values only the time your team gets back, at the loaded hourly cost you enter, after setting aside 20% of the agents' work for human review. It doesn't count new revenue, and it assumes the agents are fully up and running, so first-year results will be lower while they ramp up. Your results depend on your processes, systems and data. In a free assessment, we replace these assumptions with your real numbers.

**Home page (under the compact calculator), followed by a link "See how we calculate":**

> Modeled estimate, not a quote or a guarantee. Counts time saved only, at your loaded hourly cost, after time for human review.

## 2. "What it's worth": one illustrative example per service

Each example uses the same rules as the calculator: 4 working weeks a month, 6 minutes per routine inquiry, 20% of agent-handled hours set aside for human review, loaded hourly costs from the table in Section 4, gross profit rather than revenue, and annual value = monthly value × 12. No pricing: every figure is gross value before fees. Label each example "Illustrative example" and "Fictional business". The headline figures can go on the matching demo's result card so the numbers agree across the site.

Summary:

| Service | Example business (fictional) | Employees | Hours back / month | Value / month | Value / year |
|---|---|---|---|---|---|
| AI Agents · Customer Agent | Larkfield Plumbing & Air | 18 | 36 | $3,222 | $38,664 |
| AI Agents · Analyst Agent | Greenhollow Landscape Co. | 45 | 28 | $3,288 | $39,456 |
| AI Agents · Executive Assistant Agent | Lanternfield Insurance Agency | 22 | 92 | $4,004 | $48,048 |
| AI Marketing Director | Juniper Lane Kitchen & Bath | 30 | 12 | $11,388 | $136,656 |
| AI Sales Agent | Wrenfield Commercial Cleaning | 70 | 4 | $7,372 | $88,464 |
| AI Consulting | Corran Valley Metalworks | 85 | 8 | $13,666 | $163,992 |

### 2.1 AI Agents · Customer Agent: Larkfield Plumbing & Air

**Label:** Illustrative example · Fictional business · Modeled estimate

**Pairs with:** Customer Agent demo (website chat to booked job)

**Headline:** **36 hrs** back each month · **10** more booked jobs a month · **$38,664** a year in modeled value

**Business profile (fictional)**

- **Business:** Larkfield Plumbing & Air, residential plumbing, heating and cooling service
- **Size:** 18 employees (owner, office manager, 2 customer service reps, 12 technicians, 2 apprentices)
- **Revenue:** $3M–$4M a year
- **Systems:** phone and text, website chat, email, field-service scheduling software

**Before**

- 1,000 customer inquiries a month by phone, web form, chat, text and email
- 100 staff hours a month answering, booking and logging them (6 minutes each)
- 25% arrive after hours (250 a month) and wait for a callback the next morning
- 40% of those after-hours inquiries are new job requests (100 a month); 20% of those (20 jobs a month) book with a competitor before anyone calls back
- Average job: $450 at a 50% gross margin

**What the Customer Agent takes on**

- Answers every inquiry within a minute, 24/7, by chat, text, email and phone
- Resolves 45% end to end: books and reschedules from the live calendar, quotes standard work from the price book, and answers questions about service area, hours and maintenance plans
- Hands off urgent problems (no heat in freezing weather, active leaks) to the on-call technician right away, and complaints or complex quotes to the office manager, with a summary of the conversation
- Logs every conversation and booking in the scheduling system

**After**

- 450 inquiries a month resolved without staff
- Staff time on inquiries: 64 hours a month, down from 100
- After-hours requests answered in under a minute; half of the jobs that used to be lost (10 a month) now book

**The math**

1. Staff time on inquiries today: `1,000 × 6 ÷ 60 = 100` hours a month
2. Work the agent takes on: `1,000 × 45% = 450` inquiries, or `450 × 6 ÷ 60 = 45` hours
3. Less 20% for review and handoffs: `45 − 45 × 20% = 36` hours back each month
4. Value of that time at a customer service rep's loaded cost of $27 an hour: `36 × $27 = $972` a month
5. After-hours jobs lost today: `1,000 × 25% × 40% × 20% = 20` jobs a month
6. Jobs recovered (we count half): `20 × 50% = 10` jobs, at `$450 × 50% = $225` gross profit each: `10 × $225 = $2,250` a month
7. Monthly value: `$972 + $2,250 = $3,222`
8. Annual value: `$3,222 × 12 = $38,664`

**Result:** 36 hours back a month · $3,222 a month · **$38,664 a year** in modeled gross value

**Key assumptions:** 6 minutes of staff time per inquiry; the agent resolves 45% of inquiries on its own; only half of today's lost after-hours jobs are won back; average job $450 at a 50% gross margin.

**Not counted:** Follow-ups on unsold estimates, maintenance-plan renewals, review requests, and any savings on an after-hours answering service.

### 2.2 AI Agents · Analyst Agent: Greenhollow Landscape Co.

**Label:** Illustrative example · Fictional business · Modeled estimate

**Pairs with:** Analyst Agent demo (messy export to clean data, chart and insight report)

**Headline:** **28 hrs** back each month · **Day 3** month-end reports, not day 12 · **$39,456** a year in modeled value

**Business profile (fictional)**

- **Business:** Greenhollow Landscape Co., commercial and residential landscaping
- **Size:** 45 employees (two branches: 36 crew members, 9 office and management staff)
- **Revenue:** $6M–$8M a year
- **Systems:** QuickBooks Online, Excel, a crew time-tracking app, estimating spreadsheets

**Before**

- The bookkeeper spends 40 hours a month on month-end reporting: exporting from QuickBooks, cleaning data, rebuilding pivot tables and charts
- The operations manager spends 25 hours a month on job-cost and crew-productivity spreadsheets and the owner's one-off questions
- The month-end report is ready around the 12th business day
- Extra work done on site (add-ons and change orders) averages $2,500 a month that never makes it onto an invoice, or is found too late to bill

**What the Analyst Agent takes on**

- Pulls QuickBooks and time-tracking exports, then cleans and reconciles them
- Maintains the reporting workbook: formulas, pivot tables, job-cost tracking, a 13-week cash forecast and charts
- Writes a plain-English summary of what changed and why
- Flags anomalies: jobs over budget, duplicate bills, and completed extra work with no matching invoice
- Takes on 50% of the bookkeeper's reporting hours and 60% of the operations manager's spreadsheet hours

**After**

- Bookkeeper: 24 hours a month on reporting, down from 40
- Operations manager: 13 hours a month on spreadsheets, down from 25
- Month-end report ready by the 3rd business day
- Unbilled extra work flagged within a week; 80% of it invoiced and collected

**The math**

1. Bookkeeper: `40 × 50% = 20` hours taken on; less 20% review: `20 − 20 × 20% = 16` hours back
2. Operations manager: `25 × 60% = 15` hours taken on; less 20% review: `15 − 15 × 20% = 12` hours back
3. Hours back: `16 + 12 = 28` a month
4. Value of that time at loaded costs of $31 (bookkeeper) and $66 (operations manager): `16 × $31 + 12 × $66 = $1,288` a month
5. Recovered billing: `$2,500 × 80% = $2,000` a month (the work was already done, so this is all margin)
6. Monthly value: `$1,288 + $2,000 = $3,288`
7. Annual value: `$3,288 × 12 = $39,456`

**Result:** 28 hours back a month · $3,288 a month · **$39,456 a year** in modeled gross value

**Key assumptions:** The agent takes on 50% of the bookkeeper's reporting hours and 60% of the operations manager's; only 80% of flagged extra work is invoiced and collected; time valued at loaded costs of $31 (bookkeeper) and $66 (operations manager).

**Not counted:** Faster decisions from timely reports, better bids from accurate job costing, and the owner's own time spent assembling numbers.

### 2.3 AI Agents · Executive Assistant Agent: Lanternfield Insurance Agency

**Label:** Illustrative example · Fictional business · Modeled estimate

**Pairs with:** Executive Assistant demo (inbox to triage, replies, tasks, meeting and deck)

**Headline:** **92 hrs** back each month · **Same-day** replies to client email · **$48,048** a year in modeled value

**Business profile (fictional)**

- **Business:** Lanternfield Insurance Agency, independent property and casualty insurance agency
- **Size:** 22 employees (owner, 5 producers, 12 account managers, office manager, marketing coordinator, 2 customer service reps)
- **Revenue:** $3M–$4M a year in commissions
- **Systems:** Microsoft 365 (Outlook, Teams, PowerPoint), agency management system

**Before**

- The owner spends 10 hours a week (40 a month) on email, scheduling, follow-ups and meeting prep
- Each of 5 producers spends 10 hours a week on the inbox, follow-up tracking and renewal prep notes: 200 hours a month in total
- The office manager spends 25 hours a month building the monthly leadership deck and chasing task updates
- Client emails often wait a business day; follow-ups live in inbox flags and sticky notes

**What the Executive Assistant Agent takes on**

- Triages six inboxes (the owner's and the producers'), drafts replies for approval and flags what is urgent
- Pulls action items out of email and meetings and assigns them to the right account manager, with due dates
- Schedules meetings and prepares a one-page brief before each client meeting
- Builds the monthly leadership deck and charts from the agency system
- Takes on 50% of the owner's admin time, 40% of the producers' and 60% of the office manager's deck and follow-up time

**After**

- Owner: 24 hours a month on admin, down from 40
- Producers: 136 hours a month in total, down from 200
- Office manager: 13 hours a month on the deck and task follow-up, down from 25
- Client emails answered the same day; every follow-up tracked

**The math**

1. Owner: `40 × 50% = 20` hours taken on; less 20% review: `20 − 20 × 20% = 16` hours back, valued at an operations manager's loaded cost: `16 × $66 = $1,056`
2. Producers: `5 × 10 × 4 = 200` hours; `200 × 40% = 80` hours taken on; less 20% review: `80 − 80 × 20% = 64` hours back: `64 × $38 = $2,432`
3. Office manager: `25 × 60% = 15` hours taken on; less 20% review: `15 − 15 × 20% = 12` hours back: `12 × $43 = $516`
4. Hours back: `16 + 64 + 12 = 92` a month
5. Monthly value: `$1,056 + $2,432 + $516 = $4,004`
6. Annual value: `$4,004 × 12 = $48,048`

**Result:** 92 hours back a month · $4,004 a month · **$48,048 a year** in modeled gross value

**Key assumptions:** The owner's time is valued at an operations manager's loaded cost ($66), a conservative stand-in for an owner's hour; producers at an insurance sales agent's $38; the office manager at $43.

**Not counted:** New policies and renewals producers write with the time they get back, and fewer missed follow-ups.

### 2.4 AI Marketing Director: Juniper Lane Kitchen & Bath

**Label:** Illustrative example · Fictional business · Modeled estimate

**Pairs with:** Marketing Director demo (audit, waste found, experiments, budget reallocated)

**Headline:** **+30** leads a month for the same spend · **$60 → $50** cost per lead · **$136,656** a year in modeled value

**Business profile (fictional)**

- **Business:** Juniper Lane Kitchen & Bath, kitchen and bathroom remodeling
- **Size:** 30 employees (owner, 3 designers, project managers, installers, office staff and a marketing coordinator)
- **Revenue:** $6M–$8M a year
- **Ad spend:** $9,000 a month on Google and Meta
- **Systems:** Google Ads, Meta Ads Manager, website forms, CRM

**Before**

- $9,000 a month in ad spend produces 150 leads: $60 per lead
- $1,500 of that spend (about 17%) goes to search terms, placements and locations that haven't produced a lead in 90 days. The other $7,500 produces all 150 leads: $50 per lead
- 10% of leads become jobs: 15 jobs a month, so each sale costs $600 in ads
- Average job: $12,000 at a 30% gross margin
- The marketing coordinator spends 30 hours a month pulling reports and adjusting campaigns

**What the AI Marketing Director takes on**

- Audits every campaign, ad, search term and placement daily
- Pauses spend that isn't producing leads and moves it to campaigns that are, within guardrails the owner sets (budget limits, brand rules, approval for new creative)
- Designs and runs its own experiments on creative, audiences, offers and landing pages
- Sends a plain-English weekly report: what changed, why, and what it is testing next
- Takes on 50% of the coordinator's reporting and optimization time

**After**

- Same $9,000 a month; the $1,500 now runs in campaigns that produce leads at $50
- 180 leads a month at $50 per lead
- 18 jobs a month at the same 10% close rate; each sale now costs $500 in ads
- Coordinator: 18 hours a month on reporting, down from 30

**The math**

1. Cost per lead on the spend that works: `$7,500 ÷ 150 = $50`
2. Leads from the reallocated budget: `$1,500 ÷ $50 = 30` more leads a month
3. New jobs at today's close rate: `30 × 10% = 3` jobs a month
4. Gross profit: `3 × $12,000 × 30% = $10,800` a month
5. Coordinator: `30 × 50% = 15` hours taken on; less 20% review: `15 − 15 × 20% = 12` hours back: `12 × $49 = $588`
6. Monthly value: `$10,800 + $588 = $11,388`
7. Annual value: `$11,388 × 12 = $136,656`
8. Check: cost per lead after `$9,000 ÷ 180 = $50`; ad cost per sale after `$9,000 ÷ 18 = $500`

**Result:** 12 hours back a month · $11,388 a month · **$136,656 a year** in modeled gross value

**Key assumptions:** The moved $1,500 produces leads at today's $50 each (if scaling a campaign raises its cost per lead, the uncounted experiment gains are the cushion); the close rate stays at 10%; average job $12,000 at a 30% gross margin.

**Not counted:** Gains from the agent's experiments beyond the reallocation, better lead quality, and any choice to lower total spend.

### 2.5 AI Sales Agent: Wrenfield Commercial Cleaning

**Label:** Illustrative example · Fictional business · Modeled estimate

**Pairs with:** Sales Agent demo (ideal customer profile to dossier, personal email, quality check, send)

**Headline:** **6** meetings a month, up from 3 · **+1** new contract a month · **$88,464** a year in modeled value

**Business profile (fictional)**

- **Business:** Wrenfield Commercial Cleaning, janitorial services for offices, medical clinics and schools
- **Size:** 70 employees (58 cleaning staff, 6 supervisors, 6 office and management staff including the owner and one business-development rep)
- **Revenue:** $3.5M–$4.5M a year
- **Contracts:** average $2,000 a month at a 30% gross margin
- **Systems:** Google Workspace, CRM

**Before**

- The business-development rep researches and emails 120 prospects a month at about 15 minutes each: 30 hours a month
- 2.5% of prospects agree to a meeting: 3 meetings a month
- 1 in 3 meetings becomes a contract: 1 new contract a month

**What the AI Sales Agent takes on**

- Builds prospect lists that match the ideal customer: offices of 10,000–50,000 sq ft, medical clinics and private schools within 25 miles
- Researches each prospect: website, recent news, facility type and size, the decision-maker's role and likely pain points
- Drafts a personal email for each one that mentions something specific and true about their business
- Runs a quality check before anything goes out (specific, accurate, no unverifiable claims, clear opt-out), and the rep approves every email
- Sends within limits (10 a business day), follows up, logs everything in the CRM and honors opt-outs (CAN-SPAM)
- Takes on 60% of the rep's prospecting work

**After**

- 200 researched, personal emails a month (10 per business day)
- Rep time: 7.8 minutes per prospect to review, edit and approve, or 26 hours a month (down from 30) for 67% more prospects
- 3% of prospects agree to a meeting, because each email reflects deeper research than a busy rep has time for: 6 meetings a month
- 2 new contracts a month at the same 1-in-3 close rate

**The math**

1. Meetings: `200 × 3% = 6` a month; contracts: `6 ÷ 3 = 2`, which is `2 − 1 = 1` more than today
2. First-year gross profit per contract: `$2,000 × 12 × 30% = $7,200`
3. New-contract value: `1 × $7,200 = $7,200` a month (credited in the month each contract is signed)
4. Rep time per prospect: `15 × (1 − 60% × 80%) = 7.8` minutes; total: `200 × 7.8 ÷ 60 = 26` hours; hours back: `30 − 26 = 4` a month: `4 × $43 = $172`
5. Monthly value: `$7,200 + $172 = $7,372`
6. Annual value: `$7,372 × 12 = $88,464`

**For contrast (not counted):** A generic tool that blasts 2,000 template emails a month would need a `6 ÷ 2,000 = 0.3%` meeting rate just to match those 6 meetings, while risking spam complaints that can damage the company's email domain.

**Result:** 4 hours back a month · $7,372 a month · **$88,464 a year** in modeled gross value

**Key assumptions:** The meeting rate rises only from 2.5% to 3%; the close rate stays at 1 in 3; sending is capped at 10 emails a business day; the agent takes on 60% of the prospecting work and the rep reviews every email.

**Not counted:** Renewals after year one, referrals, and upsells to existing customers.

### 2.6 AI Consulting: Corran Valley Metalworks

**Label:** Illustrative example · Fictional business · Modeled estimate

**Pairs with:** Consulting demo (P&L analyzed, savings ranked, margin waterfall, roadmap)

**Headline:** **$318,000** a year in savings identified · **8.0% → 9.06%** EBITDA margin, counting only half · **$163,992** a year in modeled value

**Business profile (fictional)**

- **Business:** Corran Valley Metalworks, custom metal fabrication
- **Size:** 85 employees (shop floor, engineering, purchasing, sales and office staff)
- **Revenue:** about $15M a year
- **Profit:** EBITDA about $1.2M (8.0% margin)
- **Systems:** accounting system and ERP exports, payroll reports, quoting spreadsheets

**Before**

- Revenue $15,000,000; EBITDA $1,200,000 (8.0%)
- Materials $6,000,000; direct labor $3,750,000, including $450,000 of overtime; freight $600,000; software and subscriptions $120,000
- About 20% of revenue ($3,000,000) is quoted from material-cost tables more than nine months old
- The controller spends 20 hours a month on margin and cost reports

**What AI Consulting does**

- Analyzes the general ledger, vendor spend, payroll and overtime, quotes against actual job costs, and pricing history
- Ranks every opportunity by value, effort and risk, and delivers a 90-day roadmap with owners and milestones
- Tracks results monthly and refreshes the margin report, taking on 50% of the controller's reporting time

**Opportunities identified (annual)**

| Opportunity | Basis | Identified | Counted in year one (50%) |
|---|---|---|---|
| Pricing: re-price quotes on current material costs | `$3,000,000 × 3% = $90,000` | $90,000 | $45,000 |
| Overtime: cut overtime with better scheduling and realistic lead times | `$450,000 × 20% = $90,000` | $90,000 | $45,000 |
| Materials: reduce scrap and consolidate material suppliers | `$6,000,000 × 1% = $60,000` | $60,000 | $30,000 |
| Freight: consolidate freight carriers and renegotiate rates | `$600,000 × 8% = $48,000` | $48,000 | $24,000 |
| Software: cancel unused software seats and duplicate tools | `$120,000 × 25% = $30,000` | $30,000 | $15,000 |
| **Total** |  | **$318,000** | **$159,000** |

**After**

- Five opportunities identified, worth $318,000 a year in total
- Counted in year one: half of that, $159,000, because each one depends on decisions and negotiations
- EBITDA $1,359,000 (9.06% margin), up from $1,200,000 (8.0%)
- Controller: 12 hours a month on margin reporting, down from 20

**The math**

1. Identified savings: `$90,000 + $90,000 + $60,000 + $48,000 + $30,000 = $318,000` a year
2. Counted in year one (half): `$318,000 × 50% = $159,000`, or `$159,000 ÷ 12 = $13,250` a month
3. Controller: `20 × 50% = 10` hours taken on; less 20% review: `10 − 10 × 20% = 8` hours back, valued at an accountant's loaded cost: `8 × $52 = $416` a month
4. Monthly value: `$13,250 + $416 = $13,666`
5. Annual value: `$13,666 × 12 = $163,992`
6. EBITDA with counted savings: `$1,200,000 + $159,000 = $1,359,000`, a margin of `$1,359,000 ÷ $15,000,000 = 9.06%`

**Margin waterfall (counted savings), for the Consulting demo:** Starting EBITDA $1,200,000 → Pricing +$45,000 → Overtime +$45,000 → Materials +$30,000 → Freight +$24,000 → Software +$15,000 → EBITDA with counted savings $1,359,000

**Result:** 8 hours back a month · $13,666 a month · **$163,992 a year** in modeled gross value

**Key assumptions:** Only half of each identified saving is counted in year one, because each depends on decisions, negotiations or price changes; controller time is valued at an accountant's loaded cost ($52), below a controller's.

**Not counted:** The other half of the identified savings, and any revenue growth from faster, more accurate quotes.

## 3. Industry scenarios (results page)

Six fictional businesses from 8 to 250 employees, ordered by size. Each card carries the label "Illustrative scenario" and "Fictional business", and links to Methodology & assumptions. (As built, the site labels scenarios per `DESIGN.md` §6.4: the cards carry the "Illustrative example" tag plus "Fictional business", and the per-scenario "Illustrative scenario" labels below are not shown.) Rules are the same as Section 2. Time to value is a planning estimate for a typical scope, not a track record; actual timing depends on system access and how quickly decisions get made.

| # | Business (fictional) | Industry | Employees | Agents deployed | Hours back / month | Modeled annual value | Typical time to value |
|---|---|---|---|---|---|---|---|
| 1 | Maple Row Law Group | Law firm | 8 | Customer Agent, Executive Assistant Agent | 36 | $69,408 | Intake agent live in 2–3 weeks; full value in about 60 days |
| 2 | Fernway Home Goods | E-commerce brand | 14 | Customer Agent, AI Marketing Director, Analyst Agent | 128 | $110,016 | Support agent live in about 2 weeks; ad gains build over 60–90 days |
| 3 | Gablecrest Roofing & Exteriors | Home services | 32 | Customer Agent, AI Marketing Director | 16 | $154,752 | Lead response live in about 2 weeks; ad savings within 30–60 days |
| 4 | Willowmere Dental Group | Dental group | 60 | Customer Agent, Analyst Agent | 156 | $143,856 | Live in 3–4 weeks after testing with the practice-management system; full value in about 90 days |
| 5 | Bramblewood Restaurant Group | Restaurant group | 180 | Analyst Agent, AI Consulting, Customer Agent | 48 | $154,368 | Invoice tracking live in about 3 weeks; food-cost gains within 60–90 days |
| 6 | Ironvale Industrial Supply | Industrial distributor | 250 | Customer Agent, Analyst Agent, AI Sales Agent | 384 | $489,888 | Email agent live in 4–6 weeks; pricing findings within the first 30 days; full run-rate in 4–6 months |

### 3.1 Law firm: Maple Row Law Group (8 employees)

**Label:** Illustrative scenario · Fictional business

| Field | Detail |
|---|---|
| **Profile** | 8 employees (2 attorneys, 2 paralegals, an intake coordinator, a legal assistant, an office manager and a part-time bookkeeper) · estate planning and family law · one office · revenue $1.2M–$1.6M |
| **Challenge** | New inquiries that arrive while the team is with clients wait until the next business day, and some of those people hire another firm. Both attorneys spend about 15 hours a week each on email and admin. |
| **Agents deployed** | **Customer Agent:** answers inquiries 24/7 from the firm's approved answers, checks that the matter fits the practice, and books consultations; anything that needs legal judgment goes to an attorney; **Executive Assistant Agent:** triages both attorneys' inboxes, drafts routine replies for approval and tracks deadlines and follow-ups |
| **Annual value** | $69,408 (modeled; $5,784 a month) |
| **Hours back** | 36 a month |
| **Typical time to value** | Intake agent live in 2–3 weeks; full value in about 60 days |

**Before → after**

| Metric | Before | After |
|---|---|---|
| Reply time for new inquiries | Next business day | Under 2 minutes, 24/7 |
| Consultations booked per month | 24 | 28 |
| Attorney time on email and admin | 15 hrs/week each | 12 hrs/week each |
| Intake staff time on calls and scheduling | 30 hrs/month | 18 hrs/month |

**How the annual value adds up**

1. Intake: `300 × 6 ÷ 60 = 30` hours a month; the agent resolves 50%: `30 × 50% = 15` hours; less 20% review: `15 − 15 × 20% = 12` hours back at a legal assistant's $34: `12 × $34 = $408`
2. Attorneys: `2 × 15 × 4 = 120` hours a month on email and admin; the agent takes on 25%: `120 × 25% = 30` hours; less 20% review: `30 − 30 × 20% = 24` hours back at an attorney's loaded $99: `24 × $99 = $2,376`
3. New matters: `(28 − 24) × 50% = 2` a month, at `$3,000 × 50% = $1,500` contribution each: `2 × $1,500 = $3,000`
4. Monthly value: `$408 + $2,376 + $3,000 = $5,784`; hours back: `12 + 24 = 36`
5. Annual value: `$5,784 × 12 = $69,408`

**Scenario assumptions:** 300 inquiries a month, so the 4 extra consultations are fewer than 2 in every 100 inquiries; half of consultations become clients; average flat fee $3,000 with a 50% contribution margin after attorney and paralegal time.

**Narrative** (109 words)

> Maple Row is an eight-person estate and family law firm. When the team is with clients, new inquiries wait until the next business day, and some of those people book with another firm. Both attorneys spend their evenings clearing email. A Customer Agent now answers every inquiry within minutes, day or night, explains how consultations work using the firm's approved answers, and books directly into the attorneys' calendars. Anything that needs legal judgment goes to an attorney. An Executive Assistant Agent triages both attorneys' inboxes, drafts routine replies for approval and tracks deadlines. In this model the firm books four more consultations a month and gets 36 hours back.

### 3.2 E-commerce brand: Fernway Home Goods (14 employees)

**Label:** Illustrative scenario · Fictional business

| Field | Detail |
|---|---|
| **Profile** | 14 employees · home goods sold online through its own Shopify store · revenue $5M–$7M · $40,000 a month in ad spend on Meta and Google |
| **Challenge** | About 3,000 support tickets a month, mostly order status and returns, bury a small support team, and first replies take about nine hours. Return on ad spend has slipped because nobody has time to manage campaigns closely. |
| **Agents deployed** | **Customer Agent:** resolves order-status, return and product questions by email and chat, and hands the rest to the team with the order history attached; **AI Marketing Director:** audits the Meta and Google accounts, runs creative and audience tests, and shifts budget toward what sells within limits the founders set; **Analyst Agent:** sends a margin and inventory report every Monday morning |
| **Annual value** | $110,016 (modeled; $9,168 a month) |
| **Hours back** | 128 a month |
| **Typical time to value** | Support agent live in about 2 weeks; ad gains build over 60–90 days |

**Before → after**

| Metric | Before | After |
|---|---|---|
| Tickets resolved without a person | 0% | 50% of 3,000 a month |
| First reply time | About 9 hours | Under 2 minutes |
| Revenue per $1 of ad spend | $2.50 | $2.80 |
| Support team hours on tickets | 300 a month | 180 a month |

**How the annual value adds up**

1. Support: `3,000 × 6 ÷ 60 = 300` hours a month; the agent resolves 50%: `300 × 50% = 150` hours; less 20% review: `150 − 150 × 20% = 120` hours back at $27: `120 × $27 = $3,240`
2. Ads: `$40,000 × ($2.80 − $2.50) = $12,000` more revenue a month at the same spend, at a 45% contribution margin: `$12,000 × 45% = $5,400`
3. Reporting: `20 × 50% = 10` hours taken on; less 20% review: `10 − 10 × 20% = 8` hours back at $66: `8 × $66 = $528`
4. Monthly value: `$3,240 + $5,400 + $528 = $9,168`; hours back: `120 + 8 = 128`
5. Annual value: `$9,168 × 12 = $110,016`

**Scenario assumptions:** Ad spend stays at $40,000 a month; 45% contribution margin after product cost, shipping, payment fees and returns; the operations lead spends 20 hours a month on reporting.

**Narrative** (103 words)

> Fernway is a 14-person home-goods brand that sells through its own Shopify store. About 3,000 support tickets a month, mostly order status and returns, bury a small team, and first replies take around nine hours. Return on ad spend has slipped because nobody has time to manage campaigns closely. A Customer Agent now resolves half of all tickets on its own, from tracking updates to return labels, and hands the rest to the team with the order history attached. An AI Marketing Director audits the ad accounts, tests new creative and audiences, and shifts budget toward what sells, within limits the founders set.

### 3.3 Home services: Gablecrest Roofing & Exteriors (32 employees)

**Label:** Illustrative scenario · Fictional business

| Field | Detail |
|---|---|
| **Profile** | 32 employees · residential roofing, siding and gutters · revenue $6M–$8M · about 200 leads a month from ads, the website and referrals · $15,000 a month in ad spend |
| **Challenge** | New leads wait about 45 minutes for a callback, and by then many homeowners have called another roofer. Estimators chase follow-ups at night, and no one has time to check where the ad budget goes. |
| **Agents deployed** | **Customer Agent:** replies to every lead within a minute by text or chat, answers common questions, books inspections on the estimators' calendars and follows up; **AI Marketing Director:** finds and cuts ad spend that never produces a lead, within budget rules the owner sets |
| **Annual value** | $154,752 (modeled; $12,896 a month) |
| **Hours back** | 16 a month |
| **Typical time to value** | Lead response live in about 2 weeks; ad savings within 30–60 days |

**Before → after**

| Metric | Before | After |
|---|---|---|
| Time to first reply on new leads | About 45 minutes | Under 1 minute |
| Leads booked for an inspection | 40% (80 a month) | 46% (92 a month) |
| Ad spend for the same 200 leads | $15,000 a month ($75 a lead) | $12,500 a month ($62.50 a lead) |
| Office hours on calls and scheduling | 50 a month | 34 a month |

**How the annual value adds up**

1. Extra inspections: `200 × (46% − 40%) = 12` a month; jobs: `12 × 25% = 3`; gross profit: `3 × $11,000 × 30% = $9,900`
2. Ad savings: `$15,000 − $12,500 = $2,500` a month for the same 200 leads (cost per lead: `$12,500 ÷ 200 = $62.50`)
3. Office: `500 × 6 ÷ 60 = 50` hours a month; the agent takes on 40%: `50 × 40% = 20` hours; less 20% review: `20 − 20 × 20% = 16` hours back at a scheduler's $31: `16 × $31 = $496`
4. Monthly value: `$9,900 + $2,500 + $496 = $12,896`
5. Annual value: `$12,896 × 12 = $154,752`

**Scenario assumptions:** 25% of inspections become jobs; average job $11,000 at a 30% gross margin; 500 calls, texts and emails a month in total; the $2,500 cut was producing no leads.

**Narrative** (107 words)

> Gablecrest is a 32-person roofing and exteriors company. New leads wait about 45 minutes for a callback, and by then many homeowners have already called another roofer. Estimators chase follow-ups at night, and no one has time to check where the ad budget goes. A Customer Agent now replies to every lead within a minute by text or chat, answers common questions, and books inspections straight onto the estimators' calendars. An AI Marketing Director finds $2,500 a month going to searches and placements that never produce a lead and cuts it, so the same 200 leads cost less. Booked inspections rise from 80 to 92 a month.

### 3.4 Dental group: Willowmere Dental Group (60 employees)

**Label:** Illustrative scenario · Fictional business

| Field | Detail |
|---|---|
| **Profile** | 60 employees across 4 offices · general and family dentistry · revenue $9M–$11M · about 6,000 calls and 2,400 hygiene appointments a month |
| **Challenge** | During peak hours about one call in five goes unanswered, after-hours callers reach voicemail, and hygiene openings from late cancellations rarely get refilled. Office managers build reports by hand. |
| **Agents deployed** | **Customer Agent:** answers overflow and after-hours calls and texts, books new patients, confirms appointments and fills openings from a waitlist; access is limited to scheduling and patient messaging, and every action is logged; **Analyst Agent:** builds one weekly dashboard of production, collections and schedule fill across all four offices |
| **Annual value** | $143,856 (modeled; $11,988 a month) |
| **Hours back** | 156 a month |
| **Typical time to value** | Live in 3–4 weeks after testing with the practice-management system; full value in about 90 days |

**Before → after**

| Metric | Before | After |
|---|---|---|
| Calls that go unanswered | About 22% | Under 5% |
| New patients per month | 120 | 132 |
| Hygiene no-shows and late cancellations | 10% | 8% |
| Front-desk hours on phones and confirmations | 600 a month | 456 a month |

**How the annual value adds up**

1. New patients: `132 − 120 = 12` a month, at `$800 × 40% = $320` first-year contribution each: `12 × $320 = $3,840`
2. Kept hygiene visits: `2,400 × (10% − 8%) = 48` a month, at `$150 × 50% = $75` each: `48 × $75 = $3,600`
3. Front desk: `6,000 × 6 ÷ 60 = 600` hours a month; the agent takes on 30%: `600 × 30% = 180` hours; less 20% review: `180 − 180 × 20% = 144` hours back at $28: `144 × $28 = $4,032`
4. Reporting: `30 × 50% = 15` hours taken on; less 20% review: `15 − 15 × 20% = 12` hours back at an office manager's $43: `12 × $43 = $516`
5. Monthly value: `$3,840 + $3,600 + $4,032 + $516 = $11,988`; hours back: `144 + 12 = 156`
6. Annual value: `$11,988 × 12 = $143,856`

**Scenario assumptions:** The 12 extra new patients are under 1% of the calls that go unanswered today (`6,000 × 22% = 1,320` a month); a new patient brings $800 in first-year collections at a 40% contribution margin; a hygiene visit collects $150 at a 50% contribution margin (the hygienist is already scheduled); office managers spend 30 hours a month on reports across the group.

**Narrative** (102 words)

> Willowmere is a four-office dental group with 60 employees. During the morning rush about one call in five goes unanswered, after-hours callers reach voicemail, and hygiene openings from late cancellations rarely get refilled. A Customer Agent now answers overflow and after-hours calls and texts, books new patients, confirms appointments and offers open times to a waitlist. Its access is limited to scheduling and patient messaging, every action is logged, and clinical questions go straight to the team. An Analyst Agent pulls production, collections and schedule data from all four offices into one weekly dashboard, so office managers stop building reports by hand.

### 3.5 Restaurant group: Bramblewood Restaurant Group (180 employees)

**Label:** Illustrative scenario · Fictional business

| Field | Detail |
|---|---|
| **Profile** | 180 employees across 6 restaurants · full-service dining with catering and private events · revenue $13M–$16M, including about $10.8M in food sales |
| **Challenge** | Supplier prices change weekly, but food cost is reviewed only at month-end. General managers spend about 10 hours a week each on invoices, inventory sheets and reports, and catering inquiries often wait a day for a reply. |
| **Agents deployed** | **Analyst Agent:** reads every supplier invoice, tracks price changes and food cost by location, and flags dishes that are losing margin; **AI Consulting:** recommends menu-price and vendor changes for the owners to approve; **Customer Agent:** answers catering and private-event inquiries within minutes and books them |
| **Annual value** | $154,368 (modeled; $12,864 a month) |
| **Hours back** | 48 a month |
| **Typical time to value** | Invoice tracking live in about 3 weeks; food-cost gains within 60–90 days |

**Before → after**

| Metric | Before | After |
|---|---|---|
| Food cost (share of food sales) | 32.0% | 31.2% |
| Reply time for catering and event inquiries | Next day | Within 5 minutes |
| Catering orders and private events booked | 20 a month | 24 a month |
| GM time on invoices, inventory and reports | 10 hrs/week each | 8 hrs/week each |

**How the annual value adds up**

1. Food cost: `$10,800,000 × (32.0% − 31.2%) = $86,400` a year, or `$86,400 ÷ 12 = $7,200` a month
2. Events: `24 − 20 = 4` more a month, at `$3,000 × 30% = $900` contribution each: `4 × $900 = $3,600`
3. Managers: `6 × 10 × 4 = 240` hours a month; the agent takes on 25%: `240 × 25% = 60` hours; less 20% review: `60 − 60 × 20% = 48` hours back at a GM's $43: `48 × $43 = $2,064`
4. Monthly value: `$7,200 + $3,600 + $2,064 = $12,864`
5. Annual value: `$12,864 × 12 = $154,368`

**Scenario assumptions:** Food sales of $10.8M a year; an average catering order or private event of $3,000 at a 30% contribution margin.

**Narrative** (102 words)

> Bramblewood is a six-location restaurant group with 180 employees. Supplier prices change weekly, but food cost is reviewed only at month-end, long after the margin is gone. General managers spend about ten hours a week on invoices, inventory sheets and reports, and catering inquiries often wait a day for a reply. An Analyst Agent now reads every supplier invoice, tracks price changes and food cost by location, and flags dishes that are losing margin. AI Consulting recommends menu and vendor changes for the owners to approve. A Customer Agent answers catering and private-event inquiries within minutes and books them on the spot.

### 3.6 Industrial distributor: Ironvale Industrial Supply (250 employees)

**Label:** Illustrative scenario · Fictional business

| Field | Detail |
|---|---|
| **Profile** | 250 employees across 3 branches · industrial and maintenance supplies · revenue $80M–$100M · about $36M a year of quoted business |
| **Challenge** | Inside sales and customer service reps spend much of the day on about 12,000 order-status and quote-request emails a month. Quotes take a full business day, each rep prices from a slightly different spreadsheet, and lapsed accounts go unworked. |
| **Agents deployed** | **Customer Agent:** answers routine order-status and tracking emails and turns quote requests into ready-to-price drafts; **Analyst Agent:** checks every quote against margin floors and current costs and flags exceptions before it goes out; **AI Sales Agent:** researches lapsed accounts and writes each buyer a personal note; reps approve every quote and outreach email |
| **Annual value** | $489,888 (modeled; $40,824 a month) |
| **Hours back** | 384 a month |
| **Typical time to value** | Email agent live in 4–6 weeks; pricing findings within the first 30 days; full run-rate in 4–6 months |

**Before → after**

| Metric | Before | After |
|---|---|---|
| Routine emails handled without a rep | 0% | 40% of 12,000 a month |
| Quote turnaround | Next business day | Same day |
| Gross margin on quoted business | 22.0% | 22.5% |
| Lapsed accounts reactivated | About 0 a month | 3 a month |

**How the annual value adds up**

1. Email: `12,000 × 6 ÷ 60 = 1,200` hours a month; the agent takes on 40%: `1,200 × 40% = 480` hours; less 20% review: `480 − 480 × 20% = 384` hours back at a blended $36: `384 × $36 = $13,824`
2. Margin: `$36,000,000 × (22.5% − 22.0%) = $180,000` a year, or `$180,000 ÷ 12 = $15,000` a month
3. Reactivated accounts: `100 × 3% = 3` a month, at `$20,000 × 20% = $4,000` first-year gross profit each: `3 × $4,000 = $12,000`
4. Monthly value: `$13,824 + $15,000 + $12,000 = $40,824`
5. Annual value: `$40,824 × 12 = $489,888`

**Scenario assumptions:** Blended inside sales and customer service cost of $36 an hour (the average of $27 and $45); 100 lapsed accounts contacted a month; a reactivated account buys $20,000 a year at a 20% gross margin, below the quoted-business margin because returning accounts often need a sharper price.

**Narrative** (105 words)

> Ironvale is a 250-person industrial distributor with three branches. Its inside sales and customer service reps spend much of the day on order-status and quote-request emails, quotes take a full business day, and each rep prices from a slightly different spreadsheet. A Customer Agent now answers routine status and tracking emails and turns quote requests into ready-to-price drafts. An Analyst Agent checks every quote against margin floors and current costs and flags exceptions before it goes out. An AI Sales Agent researches lapsed accounts and writes each buyer a personal note about what has changed since their last order. Reps approve every quote and email.

## 4. Methodology & assumptions (show verbatim)

Show everything between the two rules below on `/results/` (the `Methodology` component), and link to it from every "Modeled estimate", "Illustrative example" and "Illustrative scenario" label. In code, replace "Halyard" with `site.name`.

---

### Methodology & assumptions

Every number on this site is an illustrative example or a modeled estimate built from the assumptions on this page. The businesses in our examples and scenarios are fictional, and none of the figures are client results. We show the math so you can check it, and change it, yourself.

#### What we count

- **Time returned.** The hours of work AI agents take on, minus 20% for the time your people spend reviewing drafts, approving actions and handling exceptions. We value those hours at the loaded hourly cost of the role (pay plus payroll taxes and benefits), not at what that time might earn.
- **Gross profit, not revenue.** When an example includes extra jobs, clients or orders, we count only the gross profit (or contribution margin) at the margin stated in the example. For new contracts, we count the first 12 months of gross profit, credited in the month the contract is signed.
- **Cost savings.** Lower ad spend, supplier costs or software costs count at the stated amount. When a saving depends on your decisions or a negotiation, we count only half of what was identified.

#### What we leave out

- **Setup and ramp-up.** Results are shown with agents fully up and running. Your first year will be lower while agents are set up, tested and tuned.
- **Benefits that are real but hard to measure:** fewer errors, faster replies, happier customers and calmer weeks for your team.
- **Headcount cuts.** We assume your team puts the time to better use, not that anyone is let go.
- **Our fees.** Every engagement is scoped to the business, so we show gross value. The calculator's break-even budget lets you weigh any quote, including ours, against that value.

#### Core assumptions

| Assumption | Value | Why |
|---|---|---|
| Working weeks per year | 48 (4 per month) | Leaves about four weeks for holidays, vacation and sick days. |
| Hours in a full-time month | 160 | 40 hours × 4 weeks. |
| Staff time per routine customer inquiry | 6 minutes | Listen or read, look it up, reply and log it. Many inquiries take longer. |
| Human review allowance | 20% of the hours agents take on | Your people stay in the loop on drafts, approvals and exceptions. |
| Share of a task agents take on | 20% to 60%, set per task | Agents handle the repeatable parts; people keep the judgment calls. We never assume more than 60%. |
| Loaded hourly cost | Median U.S. wage for the role × 1.3, rounded down | BLS data shows benefits alone add about 43% on top of wages for private-industry workers, so 1.3 understates the true cost. It also leaves out office space, equipment and software. |
| Conversion rates | Stated in each example | Where an example assumes an improvement, such as booking more inquiries because they're answered in minutes, the change is small and stated. |
| Rounding | Hours rounded down to whole hours; dollars calculated from the rounded hours; full-time equivalents rounded down to one decimal | Rounding never inflates a result, and every figure reconciles. |

These are our planning assumptions, chosen to be conservative. Apart from the wage and benefit data from the U.S. Bureau of Labor Statistics, they are not industry statistics.

#### Loaded hourly costs used in our examples

| Role | BLS occupation | Median wage (May 2025) | Loaded cost we use |
|---|---|---|---|
| Customer service rep | Customer Service Representatives | $21.53 | $27 |
| Dental or medical front desk | Medical Secretaries and Administrative Assistants | $22.08 | $28 |
| Administrative assistant | Secretaries and Administrative Assistants, Except Legal, Medical, and Executive | $22.86 | $29 |
| Dispatcher or scheduler | Dispatchers, Except Police, Fire, and Ambulance | $24.20 | $31 |
| Bookkeeper | Bookkeeping, Accounting, and Auditing Clerks | $24.36 | $31 |
| Legal assistant | Legal Secretaries and Administrative Assistants | $26.72 | $34 |
| Insurance producer | Insurance Sales Agents | $29.94 | $38 |
| Restaurant general manager | Food Service Managers | $33.36 | $43 |
| Office manager | First-Line Supervisors of Office and Administrative Support Workers | $33.41 | $43 |
| Sales rep (services) | Sales Representatives of Services, Except Advertising, Insurance, Financial Services, and Travel | $33.65 | $43 |
| Inside sales rep (wholesale) | Sales Representatives, Wholesale and Manufacturing, Except Technical and Scientific Products | $34.65 | $45 |
| Marketing coordinator | Market Research Analysts and Marketing Specialists | $37.87 | $49 |
| Accountant or controller | Accountants and Auditors | $40.23 | $52 |
| Owner or operations manager | General and Operations Managers | $50.85 | $66 |
| Attorney | Lawyers | $76.76 | $99 |

For a team that mixes roles, we average the rates. Example: an industrial distributor's inside sales and customer service team is costed at $36 an hour, the average of $27 and $45. The calculator starts at $40 an hour, below the $46.89 average employer cost per hour worked for U.S. private-industry workers.

#### Sources

- U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics, May 2025: national median hourly wage for each occupation listed above. https://www.bls.gov/oes/
- U.S. Bureau of Labor Statistics, Employer Costs for Employee Compensation, June 2026 (released September 9, 2026): private-industry employers spent an average of $46.89 per hour worked, of which wages and salaries were $32.82 (70.0%) and benefits $14.07 (30.0%). https://www.bls.gov/news.release/ecec.nr0.htm

#### Your numbers will be different

Your volumes, wages, margins and conversion rates are your own. In a free AI assessment, we replace these assumptions with your data and walk you through the math before you decide anything.

---

## Appendix A. Loaded-cost derivation (internal audit trail)

Loaded cost = BLS May 2025 national median hourly wage × 1.3, rounded down to the whole dollar. Benefit load check: $14.07 ÷ $32.82 = 42.9% on top of wages (BLS ECEC, private industry, June 2026), so a 30% load is conservative. Wage data pulled from the BLS public API (OEWS series, datatype 08: hourly median) on 2026-10-12.

| Role | SOC | Median wage | × 1.3 | Rounded down |
|---|---|---|---|---|
| Customer service rep | 43-4051 | $21.53 | $27.989 | $27 |
| Dental or medical front desk | 43-6013 | $22.08 | $28.704 | $28 |
| Administrative assistant | 43-6014 | $22.86 | $29.718 | $29 |
| Dispatcher or scheduler | 43-5032 | $24.20 | $31.46 | $31 |
| Bookkeeper | 43-3031 | $24.36 | $31.668 | $31 |
| Legal assistant | 43-6012 | $26.72 | $34.736 | $34 |
| Insurance producer | 41-3021 | $29.94 | $38.922 | $38 |
| Restaurant general manager | 11-9051 | $33.36 | $43.368 | $43 |
| Office manager | 43-1011 | $33.41 | $43.433 | $43 |
| Sales rep (services) | 41-3091 | $33.65 | $43.745 | $43 |
| Inside sales rep (wholesale) | 41-4012 | $34.65 | $45.045 | $45 |
| Marketing coordinator | 13-1161 | $37.87 | $49.231 | $49 |
| Accountant or controller | 13-2011 | $40.23 | $52.299 | $52 |
| Owner or operations manager | 11-1021 | $50.85 | $66.105 | $66 |
| Attorney | 23-1011 | $76.76 | $99.788 | $99 |

Share of work taken on, by task (all within 20% to 60%):

| Where | Share |
|---|---|
| Customer Agent: inquiries resolved end to end | 45% |
| Analyst Agent: bookkeeper reporting hours | 50% |
| Analyst Agent: operations manager spreadsheet hours | 60% |
| Executive Assistant: owner admin hours | 50% |
| Executive Assistant: producer admin hours | 40% |
| Executive Assistant: office manager deck and task follow-up | 60% |
| Marketing Director: coordinator reporting and optimization hours | 50% |
| Sales Agent: rep prospecting work | 60% |
| Consulting: controller margin-reporting hours | 50% |
| Law firm: intake inquiries resolved | 50% |
| Law firm: attorney email and admin | 25% |
| E-commerce: support tickets resolved | 50% |
| E-commerce: weekly reporting | 50% |
| Roofing: office calls and scheduling | 40% |
| Dental: front-desk calls and confirmations | 30% |
| Dental: multi-office reporting | 50% |
| Restaurant group: GM invoices, inventory and reports | 25% |
| Distributor: order-status and quote-intake email | 40% |
| Calculator input range (default 35%) | 20%–60% |

## Appendix B. Machine-readable data (JSON)

Generated from the same source as the sections above; the values are identical. Use it to build `src/data/roi.ts` and `src/data/scenarios.ts`. If you edit a section above, edit the matching JSON too.

```json
{
  "version": "2026-10-12",
  "labels": {
    "calculator": "Modeled estimate",
    "worthExample": "Illustrative example",
    "scenario": "Illustrative scenario",
    "business": "Fictional business"
  },
  "roi": {
    "inputs": [
      {
        "id": "teamSize",
        "label": "Team members in desk or customer-facing roles",
        "help": "Count office, admin, customer service, sales and management staff. Leave out roles that are almost all hands-on, such as field technicians or kitchen staff.",
        "default": 15,
        "min": 1,
        "max": 500,
        "step": 1,
        "unit": "people"
      },
      {
        "id": "hourlyCost",
        "label": "Average loaded cost per hour",
        "help": "Hourly pay plus payroll taxes and benefits. If you only know the wage, multiply it by 1.3.",
        "default": 40,
        "min": 20,
        "max": 150,
        "step": 1,
        "unit": "$ per hour"
      },
      {
        "id": "repetitiveHours",
        "label": "Hours per person each week on repetitive tasks",
        "help": "Email, data entry, copying between systems, reports, scheduling and follow-ups. Leave out time spent answering customers; that is the last question.",
        "default": 8,
        "min": 1,
        "max": 30,
        "step": 1,
        "unit": "hours per week"
      },
      {
        "id": "aiSharePct",
        "label": "Share of that work AI agents take on",
        "help": "35% is a conservative starting point. Go higher only for very repetitive, rules-based work. We cap it at 60% because your people keep the judgment calls.",
        "default": 35,
        "min": 20,
        "max": 60,
        "step": 5,
        "unit": "%"
      },
      {
        "id": "monthlyInquiries",
        "label": "Customer inquiries per month",
        "help": "Calls, chats, emails, texts and web forms from customers and prospects.",
        "default": 200,
        "min": 0,
        "max": 10000,
        "step": 50,
        "unit": "per month"
      }
    ],
    "constants": {
      "weeksPerMonth": 4,
      "minutesPerInquiry": 6,
      "reviewAllowancePct": 20,
      "fteHoursPerMonth": 160,
      "hoursPerWorkWeek": 40,
      "monthsPerYear": 12
    },
    "outputs": [
      {
        "id": "hoursReturned",
        "label": "Hours back each month",
        "sub": "After setting aside time for human review."
      },
      {
        "id": "annualValue",
        "label": "Value of that time each year",
        "sub": "At your loaded hourly cost."
      },
      {
        "id": "fte",
        "label": "Capacity added",
        "sub": "Full-time equivalent staff, without hiring."
      },
      {
        "id": "breakEvenMonthly",
        "label": "Break-even budget",
        "sub": "An AI program that costs less than this pays for itself in time saved alone, before any new revenue."
      }
    ],
    "disclaimer": {
      "full": "Modeled estimate, not a quote or a guarantee. The calculator values only the time your team gets back, at the loaded hourly cost you enter, after setting aside 20% of the agents' work for human review. It doesn't count new revenue, and it assumes the agents are fully up and running, so first-year results will be lower while they ramp up. Your results depend on your processes, systems and data. In a free assessment, we replace these assumptions with your real numbers.",
      "short": "Modeled estimate, not a quote or a guarantee. Counts time saved only, at your loaded hourly cost, after time for human review."
    },
    "testVectors": [
      {
        "name": "Defaults",
        "inputs": {
          "teamSize": 15,
          "hourlyCost": 40,
          "repetitiveHours": 8,
          "aiSharePct": 35,
          "monthlyInquiries": 200
        },
        "expected": {
          "hoursInScope": 500.0,
          "hoursTakenOn": 175.0,
          "reviewHours": 35.0,
          "hoursReturnedExact": 140.0,
          "hoursReturned": 140,
          "monthlyValue": 5600,
          "annualValue": 67200,
          "breakEvenMonthly": 5600,
          "fte": 0.8,
          "hoursPerPerson": 9.3,
          "workWeeksPerYear": 42
        }
      },
      {
        "name": "Rounding down (142.8 becomes 142)",
        "inputs": {
          "teamSize": 15,
          "hourlyCost": 40,
          "repetitiveHours": 8,
          "aiSharePct": 35,
          "monthlyInquiries": 300
        },
        "expected": {
          "hoursInScope": 510.0,
          "hoursTakenOn": 178.5,
          "reviewHours": 35.7,
          "hoursReturnedExact": 142.8,
          "hoursReturned": 142,
          "monthlyValue": 5680,
          "annualValue": 68160,
          "breakEvenMonthly": 5680,
          "fte": 0.8,
          "hoursPerPerson": 9.4,
          "workWeeksPerYear": 42
        }
      },
      {
        "name": "Example A: small",
        "inputs": {
          "teamSize": 8,
          "hourlyCost": 36,
          "repetitiveHours": 10,
          "aiSharePct": 40,
          "monthlyInquiries": 300
        },
        "expected": {
          "hoursInScope": 350.0,
          "hoursTakenOn": 140.0,
          "reviewHours": 28.0,
          "hoursReturnedExact": 112.0,
          "hoursReturned": 112,
          "monthlyValue": 4032,
          "annualValue": 48384,
          "breakEvenMonthly": 4032,
          "fte": 0.7,
          "hoursPerPerson": 14.0,
          "workWeeksPerYear": 33
        }
      },
      {
        "name": "Example B: medium",
        "inputs": {
          "teamSize": 40,
          "hourlyCost": 42,
          "repetitiveHours": 10,
          "aiSharePct": 40,
          "monthlyInquiries": 1000
        },
        "expected": {
          "hoursInScope": 1700.0,
          "hoursTakenOn": 680.0,
          "reviewHours": 136.0,
          "hoursReturnedExact": 544.0,
          "hoursReturned": 544,
          "monthlyValue": 22848,
          "annualValue": 274176,
          "breakEvenMonthly": 22848,
          "fte": 3.4,
          "hoursPerPerson": 13.6,
          "workWeeksPerYear": 163
        }
      },
      {
        "name": "Example C: larger",
        "inputs": {
          "teamSize": 120,
          "hourlyCost": 45,
          "repetitiveHours": 8,
          "aiSharePct": 30,
          "monthlyInquiries": 2600
        },
        "expected": {
          "hoursInScope": 4100.0,
          "hoursTakenOn": 1230.0,
          "reviewHours": 246.0,
          "hoursReturnedExact": 984.0,
          "hoursReturned": 984,
          "monthlyValue": 44280,
          "annualValue": 531360,
          "breakEvenMonthly": 44280,
          "fte": 6.1,
          "hoursPerPerson": 8.2,
          "workWeeksPerYear": 295
        }
      },
      {
        "name": "All minimums",
        "inputs": {
          "teamSize": 1,
          "hourlyCost": 20,
          "repetitiveHours": 1,
          "aiSharePct": 20,
          "monthlyInquiries": 0
        },
        "expected": {
          "hoursInScope": 4.0,
          "hoursTakenOn": 0.8,
          "reviewHours": 0.16,
          "hoursReturnedExact": 0.64,
          "hoursReturned": 0,
          "monthlyValue": 0,
          "annualValue": 0,
          "breakEvenMonthly": 0,
          "fte": 0.0,
          "hoursPerPerson": 0.0,
          "workWeeksPerYear": 0
        }
      },
      {
        "name": "All maximums",
        "inputs": {
          "teamSize": 500,
          "hourlyCost": 150,
          "repetitiveHours": 30,
          "aiSharePct": 60,
          "monthlyInquiries": 10000
        },
        "expected": {
          "hoursInScope": 61000.0,
          "hoursTakenOn": 36600.0,
          "reviewHours": 7320.0,
          "hoursReturnedExact": 29280.0,
          "hoursReturned": 29280,
          "monthlyValue": 4392000,
          "annualValue": 52704000,
          "breakEvenMonthly": 4392000,
          "fte": 183.0,
          "hoursPerPerson": 58.5,
          "workWeeksPerYear": 8784
        }
      }
    ]
  },
  "roles": [
    {
      "id": "csr",
      "role": "Customer service rep",
      "blsOccupation": "Customer Service Representatives",
      "soc": "43-4051",
      "medianHourlyWage": 21.53,
      "loadedHourlyCost": 27
    },
    {
      "id": "front-desk",
      "role": "Dental or medical front desk",
      "blsOccupation": "Medical Secretaries and Administrative Assistants",
      "soc": "43-6013",
      "medianHourlyWage": 22.08,
      "loadedHourlyCost": 28
    },
    {
      "id": "admin",
      "role": "Administrative assistant",
      "blsOccupation": "Secretaries and Administrative Assistants, Except Legal, Medical, and Executive",
      "soc": "43-6014",
      "medianHourlyWage": 22.86,
      "loadedHourlyCost": 29
    },
    {
      "id": "dispatcher",
      "role": "Dispatcher or scheduler",
      "blsOccupation": "Dispatchers, Except Police, Fire, and Ambulance",
      "soc": "43-5032",
      "medianHourlyWage": 24.2,
      "loadedHourlyCost": 31
    },
    {
      "id": "bookkeeper",
      "role": "Bookkeeper",
      "blsOccupation": "Bookkeeping, Accounting, and Auditing Clerks",
      "soc": "43-3031",
      "medianHourlyWage": 24.36,
      "loadedHourlyCost": 31
    },
    {
      "id": "legal-assistant",
      "role": "Legal assistant",
      "blsOccupation": "Legal Secretaries and Administrative Assistants",
      "soc": "43-6012",
      "medianHourlyWage": 26.72,
      "loadedHourlyCost": 34
    },
    {
      "id": "insurance-producer",
      "role": "Insurance producer",
      "blsOccupation": "Insurance Sales Agents",
      "soc": "41-3021",
      "medianHourlyWage": 29.94,
      "loadedHourlyCost": 38
    },
    {
      "id": "restaurant-gm",
      "role": "Restaurant general manager",
      "blsOccupation": "Food Service Managers",
      "soc": "11-9051",
      "medianHourlyWage": 33.36,
      "loadedHourlyCost": 43
    },
    {
      "id": "office-manager",
      "role": "Office manager",
      "blsOccupation": "First-Line Supervisors of Office and Administrative Support Workers",
      "soc": "43-1011",
      "medianHourlyWage": 33.41,
      "loadedHourlyCost": 43
    },
    {
      "id": "sales-rep",
      "role": "Sales rep (services)",
      "blsOccupation": "Sales Representatives of Services, Except Advertising, Insurance, Financial Services, and Travel",
      "soc": "41-3091",
      "medianHourlyWage": 33.65,
      "loadedHourlyCost": 43
    },
    {
      "id": "inside-sales",
      "role": "Inside sales rep (wholesale)",
      "blsOccupation": "Sales Representatives, Wholesale and Manufacturing, Except Technical and Scientific Products",
      "soc": "41-4012",
      "medianHourlyWage": 34.65,
      "loadedHourlyCost": 45
    },
    {
      "id": "marketing-coordinator",
      "role": "Marketing coordinator",
      "blsOccupation": "Market Research Analysts and Marketing Specialists",
      "soc": "13-1161",
      "medianHourlyWage": 37.87,
      "loadedHourlyCost": 49
    },
    {
      "id": "accountant",
      "role": "Accountant or controller",
      "blsOccupation": "Accountants and Auditors",
      "soc": "13-2011",
      "medianHourlyWage": 40.23,
      "loadedHourlyCost": 52
    },
    {
      "id": "ops-manager",
      "role": "Owner or operations manager",
      "blsOccupation": "General and Operations Managers",
      "soc": "11-1021",
      "medianHourlyWage": 50.85,
      "loadedHourlyCost": 66
    },
    {
      "id": "attorney",
      "role": "Attorney",
      "blsOccupation": "Lawyers",
      "soc": "23-1011",
      "medianHourlyWage": 76.76,
      "loadedHourlyCost": 99
    }
  ],
  "worthExamples": [
    {
      "id": "customer-agent",
      "service": "AI Agents",
      "agentRole": "Customer Agent",
      "label": "Illustrative example",
      "business": {
        "name": "Larkfield Plumbing & Air",
        "industry": "Residential plumbing, heating and cooling service",
        "employees": 18,
        "team": "owner, office manager, 2 customer service reps, 12 technicians, 2 apprentices",
        "revenue": "$3M–$4M a year",
        "systems": "phone and text, website chat, email, field-service scheduling software",
        "details": []
      },
      "headline": [
        {
          "value": "36 hrs",
          "label": "back each month"
        },
        {
          "value": "10",
          "label": "more booked jobs a month"
        },
        {
          "value": "$38,664",
          "label": "a year in modeled value"
        }
      ],
      "before": [
        "1,000 customer inquiries a month by phone, web form, chat, text and email",
        "100 staff hours a month answering, booking and logging them (6 minutes each)",
        "25% arrive after hours (250 a month) and wait for a callback the next morning",
        "40% of those after-hours inquiries are new job requests (100 a month); 20% of those (20 jobs a month) book with a competitor before anyone calls back",
        "Average job: $450 at a 50% gross margin"
      ],
      "takesOnTitle": "What the Customer Agent takes on",
      "takesOn": [
        "Answers every inquiry within a minute, 24/7, by chat, text, email and phone",
        "Resolves 45% end to end: books and reschedules from the live calendar, quotes standard work from the price book, and answers questions about service area, hours and maintenance plans",
        "Hands off urgent problems (no heat in freezing weather, active leaks) to the on-call technician right away, and complaints or complex quotes to the office manager, with a summary of the conversation",
        "Logs every conversation and booking in the scheduling system"
      ],
      "after": [
        "450 inquiries a month resolved without staff",
        "Staff time on inquiries: 64 hours a month, down from 100",
        "After-hours requests answered in under a minute; half of the jobs that used to be lost (10 a month) now book"
      ],
      "math": [
        "Staff time on inquiries today: 1,000 × 6 ÷ 60 = 100 hours a month",
        "Work the agent takes on: 1,000 × 45% = 450 inquiries, or 450 × 6 ÷ 60 = 45 hours",
        "Less 20% for review and handoffs: 45 − 45 × 20% = 36 hours back each month",
        "Value of that time at a customer service rep's loaded cost of $27 an hour: 36 × $27 = $972 a month",
        "After-hours jobs lost today: 1,000 × 25% × 40% × 20% = 20 jobs a month",
        "Jobs recovered (we count half): 20 × 50% = 10 jobs, at $450 × 50% = $225 gross profit each: 10 × $225 = $2,250 a month",
        "Monthly value: $972 + $2,250 = $3,222",
        "Annual value: $3,222 × 12 = $38,664"
      ],
      "hoursReturnedPerMonth": 36,
      "monthlyValue": 3222,
      "annualValue": 38664,
      "keyAssumptions": "6 minutes of staff time per inquiry; the agent resolves 45% of inquiries on its own; only half of today's lost after-hours jobs are won back; average job $450 at a 50% gross margin.",
      "notCounted": "Follow-ups on unsold estimates, maintenance-plan renewals, review requests, and any savings on an after-hours answering service."
    },
    {
      "id": "analyst-agent",
      "service": "AI Agents",
      "agentRole": "Analyst Agent",
      "label": "Illustrative example",
      "business": {
        "name": "Greenhollow Landscape Co.",
        "industry": "Commercial and residential landscaping",
        "employees": 45,
        "team": "two branches: 36 crew members, 9 office and management staff",
        "revenue": "$6M–$8M a year",
        "systems": "QuickBooks Online, Excel, a crew time-tracking app, estimating spreadsheets",
        "details": []
      },
      "headline": [
        {
          "value": "28 hrs",
          "label": "back each month"
        },
        {
          "value": "Day 3",
          "label": "month-end reports, not day 12"
        },
        {
          "value": "$39,456",
          "label": "a year in modeled value"
        }
      ],
      "before": [
        "The bookkeeper spends 40 hours a month on month-end reporting: exporting from QuickBooks, cleaning data, rebuilding pivot tables and charts",
        "The operations manager spends 25 hours a month on job-cost and crew-productivity spreadsheets and the owner's one-off questions",
        "The month-end report is ready around the 12th business day",
        "Extra work done on site (add-ons and change orders) averages $2,500 a month that never makes it onto an invoice, or is found too late to bill"
      ],
      "takesOnTitle": "What the Analyst Agent takes on",
      "takesOn": [
        "Pulls QuickBooks and time-tracking exports, then cleans and reconciles them",
        "Maintains the reporting workbook: formulas, pivot tables, job-cost tracking, a 13-week cash forecast and charts",
        "Writes a plain-English summary of what changed and why",
        "Flags anomalies: jobs over budget, duplicate bills, and completed extra work with no matching invoice",
        "Takes on 50% of the bookkeeper's reporting hours and 60% of the operations manager's spreadsheet hours"
      ],
      "after": [
        "Bookkeeper: 24 hours a month on reporting, down from 40",
        "Operations manager: 13 hours a month on spreadsheets, down from 25",
        "Month-end report ready by the 3rd business day",
        "Unbilled extra work flagged within a week; 80% of it invoiced and collected"
      ],
      "math": [
        "Bookkeeper: 40 × 50% = 20 hours taken on; less 20% review: 20 − 20 × 20% = 16 hours back",
        "Operations manager: 25 × 60% = 15 hours taken on; less 20% review: 15 − 15 × 20% = 12 hours back",
        "Hours back: 16 + 12 = 28 a month",
        "Value of that time at loaded costs of $31 (bookkeeper) and $66 (operations manager): 16 × $31 + 12 × $66 = $1,288 a month",
        "Recovered billing: $2,500 × 80% = $2,000 a month (the work was already done, so this is all margin)",
        "Monthly value: $1,288 + $2,000 = $3,288",
        "Annual value: $3,288 × 12 = $39,456"
      ],
      "hoursReturnedPerMonth": 28,
      "monthlyValue": 3288,
      "annualValue": 39456,
      "keyAssumptions": "The agent takes on 50% of the bookkeeper's reporting hours and 60% of the operations manager's; only 80% of flagged extra work is invoiced and collected; time valued at loaded costs of $31 (bookkeeper) and $66 (operations manager).",
      "notCounted": "Faster decisions from timely reports, better bids from accurate job costing, and the owner's own time spent assembling numbers."
    },
    {
      "id": "executive-assistant-agent",
      "service": "AI Agents",
      "agentRole": "Executive Assistant Agent",
      "label": "Illustrative example",
      "business": {
        "name": "Lanternfield Insurance Agency",
        "industry": "Independent property and casualty insurance agency",
        "employees": 22,
        "team": "owner, 5 producers, 12 account managers, office manager, marketing coordinator, 2 customer service reps",
        "revenue": "$3M–$4M a year in commissions",
        "systems": "Microsoft 365 (Outlook, Teams, PowerPoint), agency management system",
        "details": []
      },
      "headline": [
        {
          "value": "92 hrs",
          "label": "back each month"
        },
        {
          "value": "Same-day",
          "label": "replies to client email"
        },
        {
          "value": "$48,048",
          "label": "a year in modeled value"
        }
      ],
      "before": [
        "The owner spends 10 hours a week (40 a month) on email, scheduling, follow-ups and meeting prep",
        "Each of 5 producers spends 10 hours a week on the inbox, follow-up tracking and renewal prep notes: 200 hours a month in total",
        "The office manager spends 25 hours a month building the monthly leadership deck and chasing task updates",
        "Client emails often wait a business day; follow-ups live in inbox flags and sticky notes"
      ],
      "takesOnTitle": "What the Executive Assistant Agent takes on",
      "takesOn": [
        "Triages six inboxes (the owner's and the producers'), drafts replies for approval and flags what is urgent",
        "Pulls action items out of email and meetings and assigns them to the right account manager, with due dates",
        "Schedules meetings and prepares a one-page brief before each client meeting",
        "Builds the monthly leadership deck and charts from the agency system",
        "Takes on 50% of the owner's admin time, 40% of the producers' and 60% of the office manager's deck and follow-up time"
      ],
      "after": [
        "Owner: 24 hours a month on admin, down from 40",
        "Producers: 136 hours a month in total, down from 200",
        "Office manager: 13 hours a month on the deck and task follow-up, down from 25",
        "Client emails answered the same day; every follow-up tracked"
      ],
      "math": [
        "Owner: 40 × 50% = 20 hours taken on; less 20% review: 20 − 20 × 20% = 16 hours back, valued at an operations manager's loaded cost: 16 × $66 = $1,056",
        "Producers: 5 × 10 × 4 = 200 hours; 200 × 40% = 80 hours taken on; less 20% review: 80 − 80 × 20% = 64 hours back: 64 × $38 = $2,432",
        "Office manager: 25 × 60% = 15 hours taken on; less 20% review: 15 − 15 × 20% = 12 hours back: 12 × $43 = $516",
        "Hours back: 16 + 64 + 12 = 92 a month",
        "Monthly value: $1,056 + $2,432 + $516 = $4,004",
        "Annual value: $4,004 × 12 = $48,048"
      ],
      "hoursReturnedPerMonth": 92,
      "monthlyValue": 4004,
      "annualValue": 48048,
      "keyAssumptions": "The owner's time is valued at an operations manager's loaded cost ($66), a conservative stand-in for an owner's hour; producers at an insurance sales agent's $38; the office manager at $43.",
      "notCounted": "New policies and renewals producers write with the time they get back, and fewer missed follow-ups."
    },
    {
      "id": "marketing-director",
      "service": "AI Marketing Director",
      "agentRole": null,
      "label": "Illustrative example",
      "business": {
        "name": "Juniper Lane Kitchen & Bath",
        "industry": "Kitchen and bathroom remodeling",
        "employees": 30,
        "team": "owner, 3 designers, project managers, installers, office staff and a marketing coordinator",
        "revenue": "$6M–$8M a year",
        "systems": "Google Ads, Meta Ads Manager, website forms, CRM",
        "details": [
          {
            "label": "Ad spend",
            "value": "$9,000 a month on Google and Meta"
          }
        ]
      },
      "headline": [
        {
          "value": "+30",
          "label": "leads a month for the same spend"
        },
        {
          "value": "$60 → $50",
          "label": "cost per lead"
        },
        {
          "value": "$136,656",
          "label": "a year in modeled value"
        }
      ],
      "before": [
        "$9,000 a month in ad spend produces 150 leads: $60 per lead",
        "$1,500 of that spend (about 17%) goes to search terms, placements and locations that haven't produced a lead in 90 days. The other $7,500 produces all 150 leads: $50 per lead",
        "10% of leads become jobs: 15 jobs a month, so each sale costs $600 in ads",
        "Average job: $12,000 at a 30% gross margin",
        "The marketing coordinator spends 30 hours a month pulling reports and adjusting campaigns"
      ],
      "takesOnTitle": "What the AI Marketing Director takes on",
      "takesOn": [
        "Audits every campaign, ad, search term and placement daily",
        "Pauses spend that isn't producing leads and moves it to campaigns that are, within guardrails the owner sets (budget limits, brand rules, approval for new creative)",
        "Designs and runs its own experiments on creative, audiences, offers and landing pages",
        "Sends a plain-English weekly report: what changed, why, and what it is testing next",
        "Takes on 50% of the coordinator's reporting and optimization time"
      ],
      "after": [
        "Same $9,000 a month; the $1,500 now runs in campaigns that produce leads at $50",
        "180 leads a month at $50 per lead",
        "18 jobs a month at the same 10% close rate; each sale now costs $500 in ads",
        "Coordinator: 18 hours a month on reporting, down from 30"
      ],
      "math": [
        "Cost per lead on the spend that works: $7,500 ÷ 150 = $50",
        "Leads from the reallocated budget: $1,500 ÷ $50 = 30 more leads a month",
        "New jobs at today's close rate: 30 × 10% = 3 jobs a month",
        "Gross profit: 3 × $12,000 × 30% = $10,800 a month",
        "Coordinator: 30 × 50% = 15 hours taken on; less 20% review: 15 − 15 × 20% = 12 hours back: 12 × $49 = $588",
        "Monthly value: $10,800 + $588 = $11,388",
        "Annual value: $11,388 × 12 = $136,656",
        "Check: cost per lead after $9,000 ÷ 180 = $50; ad cost per sale after $9,000 ÷ 18 = $500"
      ],
      "hoursReturnedPerMonth": 12,
      "monthlyValue": 11388,
      "annualValue": 136656,
      "keyAssumptions": "The moved $1,500 produces leads at today's $50 each (if scaling a campaign raises its cost per lead, the uncounted experiment gains are the cushion); the close rate stays at 10%; average job $12,000 at a 30% gross margin.",
      "notCounted": "Gains from the agent's experiments beyond the reallocation, better lead quality, and any choice to lower total spend."
    },
    {
      "id": "sales-agent",
      "service": "AI Sales Agent",
      "agentRole": null,
      "label": "Illustrative example",
      "business": {
        "name": "Wrenfield Commercial Cleaning",
        "industry": "Janitorial services for offices, medical clinics and schools",
        "employees": 70,
        "team": "58 cleaning staff, 6 supervisors, 6 office and management staff including the owner and one business-development rep",
        "revenue": "$3.5M–$4.5M a year",
        "systems": "Google Workspace, CRM",
        "details": [
          {
            "label": "Contracts",
            "value": "average $2,000 a month at a 30% gross margin"
          }
        ]
      },
      "headline": [
        {
          "value": "6",
          "label": "meetings a month, up from 3"
        },
        {
          "value": "+1",
          "label": "new contract a month"
        },
        {
          "value": "$88,464",
          "label": "a year in modeled value"
        }
      ],
      "before": [
        "The business-development rep researches and emails 120 prospects a month at about 15 minutes each: 30 hours a month",
        "2.5% of prospects agree to a meeting: 3 meetings a month",
        "1 in 3 meetings becomes a contract: 1 new contract a month"
      ],
      "takesOnTitle": "What the AI Sales Agent takes on",
      "takesOn": [
        "Builds prospect lists that match the ideal customer: offices of 10,000–50,000 sq ft, medical clinics and private schools within 25 miles",
        "Researches each prospect: website, recent news, facility type and size, the decision-maker's role and likely pain points",
        "Drafts a personal email for each one that mentions something specific and true about their business",
        "Runs a quality check before anything goes out (specific, accurate, no unverifiable claims, clear opt-out), and the rep approves every email",
        "Sends within limits (10 a business day), follows up, logs everything in the CRM and honors opt-outs (CAN-SPAM)",
        "Takes on 60% of the rep's prospecting work"
      ],
      "after": [
        "200 researched, personal emails a month (10 per business day)",
        "Rep time: 7.8 minutes per prospect to review, edit and approve, or 26 hours a month (down from 30) for 67% more prospects",
        "3% of prospects agree to a meeting, because each email reflects deeper research than a busy rep has time for: 6 meetings a month",
        "2 new contracts a month at the same 1-in-3 close rate"
      ],
      "math": [
        "Meetings: 200 × 3% = 6 a month; contracts: 6 ÷ 3 = 2, which is 2 − 1 = 1 more than today",
        "First-year gross profit per contract: $2,000 × 12 × 30% = $7,200",
        "New-contract value: 1 × $7,200 = $7,200 a month (credited in the month each contract is signed)",
        "Rep time per prospect: 15 × (1 − 60% × 80%) = 7.8 minutes; total: 200 × 7.8 ÷ 60 = 26 hours; hours back: 30 − 26 = 4 a month: 4 × $43 = $172",
        "Monthly value: $7,200 + $172 = $7,372",
        "Annual value: $7,372 × 12 = $88,464"
      ],
      "contrast": "A generic tool that blasts 2,000 template emails a month would need a 6 ÷ 2,000 = 0.3% meeting rate just to match those 6 meetings, while risking spam complaints that can damage the company's email domain.",
      "hoursReturnedPerMonth": 4,
      "monthlyValue": 7372,
      "annualValue": 88464,
      "keyAssumptions": "The meeting rate rises only from 2.5% to 3%; the close rate stays at 1 in 3; sending is capped at 10 emails a business day; the agent takes on 60% of the prospecting work and the rep reviews every email.",
      "notCounted": "Renewals after year one, referrals, and upsells to existing customers."
    },
    {
      "id": "consulting",
      "service": "AI Consulting",
      "agentRole": null,
      "label": "Illustrative example",
      "business": {
        "name": "Corran Valley Metalworks",
        "industry": "Custom metal fabrication",
        "employees": 85,
        "team": "shop floor, engineering, purchasing, sales and office staff",
        "revenue": "about $15M a year",
        "systems": "accounting system and ERP exports, payroll reports, quoting spreadsheets",
        "details": [
          {
            "label": "Profit",
            "value": "EBITDA about $1.2M (8.0% margin)"
          }
        ]
      },
      "headline": [
        {
          "value": "$318,000",
          "label": "a year in savings identified"
        },
        {
          "value": "8.0% → 9.06%",
          "label": "EBITDA margin, counting only half"
        },
        {
          "value": "$163,992",
          "label": "a year in modeled value"
        }
      ],
      "before": [
        "Revenue $15,000,000; EBITDA $1,200,000 (8.0%)",
        "Materials $6,000,000; direct labor $3,750,000, including $450,000 of overtime; freight $600,000; software and subscriptions $120,000",
        "About 20% of revenue ($3,000,000) is quoted from material-cost tables more than nine months old",
        "The controller spends 20 hours a month on margin and cost reports"
      ],
      "takesOnTitle": "What AI Consulting does",
      "takesOn": [
        "Analyzes the general ledger, vendor spend, payroll and overtime, quotes against actual job costs, and pricing history",
        "Ranks every opportunity by value, effort and risk, and delivers a 90-day roadmap with owners and milestones",
        "Tracks results monthly and refreshes the margin report, taking on 50% of the controller's reporting time"
      ],
      "after": [
        "Five opportunities identified, worth $318,000 a year in total",
        "Counted in year one: half of that, $159,000, because each one depends on decisions and negotiations",
        "EBITDA $1,359,000 (9.06% margin), up from $1,200,000 (8.0%)",
        "Controller: 12 hours a month on margin reporting, down from 20"
      ],
      "opportunities": [
        {
          "short": "Pricing",
          "opportunity": "Pricing: re-price quotes on current material costs",
          "basis": "$3,000,000 × 3% = $90,000",
          "identified": "$90,000",
          "counted": "$45,000"
        },
        {
          "short": "Overtime",
          "opportunity": "Overtime: cut overtime with better scheduling and realistic lead times",
          "basis": "$450,000 × 20% = $90,000",
          "identified": "$90,000",
          "counted": "$45,000"
        },
        {
          "short": "Materials",
          "opportunity": "Materials: reduce scrap and consolidate material suppliers",
          "basis": "$6,000,000 × 1% = $60,000",
          "identified": "$60,000",
          "counted": "$30,000"
        },
        {
          "short": "Freight",
          "opportunity": "Freight: consolidate freight carriers and renegotiate rates",
          "basis": "$600,000 × 8% = $48,000",
          "identified": "$48,000",
          "counted": "$24,000"
        },
        {
          "short": "Software",
          "opportunity": "Software: cancel unused software seats and duplicate tools",
          "basis": "$120,000 × 25% = $30,000",
          "identified": "$30,000",
          "counted": "$15,000"
        }
      ],
      "waterfall": [
        {
          "label": "Starting EBITDA",
          "value": 1200000
        },
        {
          "label": "Pricing",
          "value": 45000
        },
        {
          "label": "Overtime",
          "value": 45000
        },
        {
          "label": "Materials",
          "value": 30000
        },
        {
          "label": "Freight",
          "value": 24000
        },
        {
          "label": "Software",
          "value": 15000
        },
        {
          "label": "EBITDA with counted savings",
          "value": 1359000
        }
      ],
      "math": [
        "Identified savings: $90,000 + $90,000 + $60,000 + $48,000 + $30,000 = $318,000 a year",
        "Counted in year one (half): $318,000 × 50% = $159,000, or $159,000 ÷ 12 = $13,250 a month",
        "Controller: 20 × 50% = 10 hours taken on; less 20% review: 10 − 10 × 20% = 8 hours back, valued at an accountant's loaded cost: 8 × $52 = $416 a month",
        "Monthly value: $13,250 + $416 = $13,666",
        "Annual value: $13,666 × 12 = $163,992",
        "EBITDA with counted savings: $1,200,000 + $159,000 = $1,359,000, a margin of $1,359,000 ÷ $15,000,000 = 9.06%"
      ],
      "hoursReturnedPerMonth": 8,
      "monthlyValue": 13666,
      "annualValue": 163992,
      "keyAssumptions": "Only half of each identified saving is counted in year one, because each depends on decisions, negotiations or price changes; controller time is valued at an accountant's loaded cost ($52), below a controller's.",
      "notCounted": "The other half of the identified savings, and any revenue growth from faster, more accurate quotes."
    }
  ],
  "scenarios": [
    {
      "id": "law-firm",
      "label": "Illustrative scenario",
      "industry": "Law firm",
      "name": "Maple Row Law Group",
      "employees": 8,
      "locations": 1,
      "revenueRange": "$1.2M–$1.6M",
      "profile": "8 employees (2 attorneys, 2 paralegals, an intake coordinator, a legal assistant, an office manager and a part-time bookkeeper) · estate planning and family law · one office · revenue $1.2M–$1.6M",
      "challenge": "New inquiries that arrive while the team is with clients wait until the next business day, and some of those people hire another firm. Both attorneys spend about 15 hours a week each on email and admin.",
      "agents": [
        {
          "name": "Customer Agent",
          "does": "answers inquiries 24/7 from the firm's approved answers, checks that the matter fits the practice, and books consultations; anything that needs legal judgment goes to an attorney"
        },
        {
          "name": "Executive Assistant Agent",
          "does": "triages both attorneys' inboxes, drafts routine replies for approval and tracks deadlines and follow-ups"
        }
      ],
      "metrics": [
        {
          "label": "Reply time for new inquiries",
          "before": "Next business day",
          "after": "Under 2 minutes, 24/7"
        },
        {
          "label": "Consultations booked per month",
          "before": "24",
          "after": "28"
        },
        {
          "label": "Attorney time on email and admin",
          "before": "15 hrs/week each",
          "after": "12 hrs/week each"
        },
        {
          "label": "Intake staff time on calls and scheduling",
          "before": "30 hrs/month",
          "after": "18 hrs/month"
        }
      ],
      "math": [
        "Intake: 300 × 6 ÷ 60 = 30 hours a month; the agent resolves 50%: 30 × 50% = 15 hours; less 20% review: 15 − 15 × 20% = 12 hours back at a legal assistant's $34: 12 × $34 = $408",
        "Attorneys: 2 × 15 × 4 = 120 hours a month on email and admin; the agent takes on 25%: 120 × 25% = 30 hours; less 20% review: 30 − 30 × 20% = 24 hours back at an attorney's loaded $99: 24 × $99 = $2,376",
        "New matters: (28 − 24) × 50% = 2 a month, at $3,000 × 50% = $1,500 contribution each: 2 × $1,500 = $3,000",
        "Monthly value: $408 + $2,376 + $3,000 = $5,784; hours back: 12 + 24 = 36",
        "Annual value: $5,784 × 12 = $69,408"
      ],
      "assumptions": "300 inquiries a month, so the 4 extra consultations are fewer than 2 in every 100 inquiries; half of consultations become clients; average flat fee $3,000 with a 50% contribution margin after attorney and paralegal time.",
      "hoursReturnedPerMonth": 36,
      "monthlyValue": 5784,
      "annualValue": 69408,
      "timeToValue": "Intake agent live in 2–3 weeks; full value in about 60 days",
      "narrative": "Maple Row is an eight-person estate and family law firm. When the team is with clients, new inquiries wait until the next business day, and some of those people book with another firm. Both attorneys spend their evenings clearing email. A Customer Agent now answers every inquiry within minutes, day or night, explains how consultations work using the firm's approved answers, and books directly into the attorneys' calendars. Anything that needs legal judgment goes to an attorney. An Executive Assistant Agent triages both attorneys' inboxes, drafts routine replies for approval and tracks deadlines. In this model the firm books four more consultations a month and gets 36 hours back."
    },
    {
      "id": "ecommerce-brand",
      "label": "Illustrative scenario",
      "industry": "E-commerce brand",
      "name": "Fernway Home Goods",
      "employees": 14,
      "locations": 1,
      "revenueRange": "$5M–$7M",
      "profile": "14 employees · home goods sold online through its own Shopify store · revenue $5M–$7M · $40,000 a month in ad spend on Meta and Google",
      "challenge": "About 3,000 support tickets a month, mostly order status and returns, bury a small support team, and first replies take about nine hours. Return on ad spend has slipped because nobody has time to manage campaigns closely.",
      "agents": [
        {
          "name": "Customer Agent",
          "does": "resolves order-status, return and product questions by email and chat, and hands the rest to the team with the order history attached"
        },
        {
          "name": "AI Marketing Director",
          "does": "audits the Meta and Google accounts, runs creative and audience tests, and shifts budget toward what sells within limits the founders set"
        },
        {
          "name": "Analyst Agent",
          "does": "sends a margin and inventory report every Monday morning"
        }
      ],
      "metrics": [
        {
          "label": "Tickets resolved without a person",
          "before": "0%",
          "after": "50% of 3,000 a month"
        },
        {
          "label": "First reply time",
          "before": "About 9 hours",
          "after": "Under 2 minutes"
        },
        {
          "label": "Revenue per $1 of ad spend",
          "before": "$2.50",
          "after": "$2.80"
        },
        {
          "label": "Support team hours on tickets",
          "before": "300 a month",
          "after": "180 a month"
        }
      ],
      "math": [
        "Support: 3,000 × 6 ÷ 60 = 300 hours a month; the agent resolves 50%: 300 × 50% = 150 hours; less 20% review: 150 − 150 × 20% = 120 hours back at $27: 120 × $27 = $3,240",
        "Ads: $40,000 × ($2.80 − $2.50) = $12,000 more revenue a month at the same spend, at a 45% contribution margin: $12,000 × 45% = $5,400",
        "Reporting: 20 × 50% = 10 hours taken on; less 20% review: 10 − 10 × 20% = 8 hours back at $66: 8 × $66 = $528",
        "Monthly value: $3,240 + $5,400 + $528 = $9,168; hours back: 120 + 8 = 128",
        "Annual value: $9,168 × 12 = $110,016"
      ],
      "assumptions": "Ad spend stays at $40,000 a month; 45% contribution margin after product cost, shipping, payment fees and returns; the operations lead spends 20 hours a month on reporting.",
      "hoursReturnedPerMonth": 128,
      "monthlyValue": 9168,
      "annualValue": 110016,
      "timeToValue": "Support agent live in about 2 weeks; ad gains build over 60–90 days",
      "narrative": "Fernway is a 14-person home-goods brand that sells through its own Shopify store. About 3,000 support tickets a month, mostly order status and returns, bury a small team, and first replies take around nine hours. Return on ad spend has slipped because nobody has time to manage campaigns closely. A Customer Agent now resolves half of all tickets on its own, from tracking updates to return labels, and hands the rest to the team with the order history attached. An AI Marketing Director audits the ad accounts, tests new creative and audiences, and shifts budget toward what sells, within limits the founders set."
    },
    {
      "id": "home-services",
      "label": "Illustrative scenario",
      "industry": "Home services",
      "name": "Gablecrest Roofing & Exteriors",
      "employees": 32,
      "locations": 1,
      "revenueRange": "$6M–$8M",
      "profile": "32 employees · residential roofing, siding and gutters · revenue $6M–$8M · about 200 leads a month from ads, the website and referrals · $15,000 a month in ad spend",
      "challenge": "New leads wait about 45 minutes for a callback, and by then many homeowners have called another roofer. Estimators chase follow-ups at night, and no one has time to check where the ad budget goes.",
      "agents": [
        {
          "name": "Customer Agent",
          "does": "replies to every lead within a minute by text or chat, answers common questions, books inspections on the estimators' calendars and follows up"
        },
        {
          "name": "AI Marketing Director",
          "does": "finds and cuts ad spend that never produces a lead, within budget rules the owner sets"
        }
      ],
      "metrics": [
        {
          "label": "Time to first reply on new leads",
          "before": "About 45 minutes",
          "after": "Under 1 minute"
        },
        {
          "label": "Leads booked for an inspection",
          "before": "40% (80 a month)",
          "after": "46% (92 a month)"
        },
        {
          "label": "Ad spend for the same 200 leads",
          "before": "$15,000 a month ($75 a lead)",
          "after": "$12,500 a month ($62.50 a lead)"
        },
        {
          "label": "Office hours on calls and scheduling",
          "before": "50 a month",
          "after": "34 a month"
        }
      ],
      "math": [
        "Extra inspections: 200 × (46% − 40%) = 12 a month; jobs: 12 × 25% = 3; gross profit: 3 × $11,000 × 30% = $9,900",
        "Ad savings: $15,000 − $12,500 = $2,500 a month for the same 200 leads (cost per lead: $12,500 ÷ 200 = $62.50)",
        "Office: 500 × 6 ÷ 60 = 50 hours a month; the agent takes on 40%: 50 × 40% = 20 hours; less 20% review: 20 − 20 × 20% = 16 hours back at a scheduler's $31: 16 × $31 = $496",
        "Monthly value: $9,900 + $2,500 + $496 = $12,896",
        "Annual value: $12,896 × 12 = $154,752"
      ],
      "assumptions": "25% of inspections become jobs; average job $11,000 at a 30% gross margin; 500 calls, texts and emails a month in total; the $2,500 cut was producing no leads.",
      "hoursReturnedPerMonth": 16,
      "monthlyValue": 12896,
      "annualValue": 154752,
      "timeToValue": "Lead response live in about 2 weeks; ad savings within 30–60 days",
      "narrative": "Gablecrest is a 32-person roofing and exteriors company. New leads wait about 45 minutes for a callback, and by then many homeowners have already called another roofer. Estimators chase follow-ups at night, and no one has time to check where the ad budget goes. A Customer Agent now replies to every lead within a minute by text or chat, answers common questions, and books inspections straight onto the estimators' calendars. An AI Marketing Director finds $2,500 a month going to searches and placements that never produce a lead and cuts it, so the same 200 leads cost less. Booked inspections rise from 80 to 92 a month."
    },
    {
      "id": "dental-group",
      "label": "Illustrative scenario",
      "industry": "Dental group",
      "name": "Willowmere Dental Group",
      "employees": 60,
      "locations": 4,
      "revenueRange": "$9M–$11M",
      "profile": "60 employees across 4 offices · general and family dentistry · revenue $9M–$11M · about 6,000 calls and 2,400 hygiene appointments a month",
      "challenge": "During peak hours about one call in five goes unanswered, after-hours callers reach voicemail, and hygiene openings from late cancellations rarely get refilled. Office managers build reports by hand.",
      "agents": [
        {
          "name": "Customer Agent",
          "does": "answers overflow and after-hours calls and texts, books new patients, confirms appointments and fills openings from a waitlist; access is limited to scheduling and patient messaging, and every action is logged"
        },
        {
          "name": "Analyst Agent",
          "does": "builds one weekly dashboard of production, collections and schedule fill across all four offices"
        }
      ],
      "metrics": [
        {
          "label": "Calls that go unanswered",
          "before": "About 22%",
          "after": "Under 5%"
        },
        {
          "label": "New patients per month",
          "before": "120",
          "after": "132"
        },
        {
          "label": "Hygiene no-shows and late cancellations",
          "before": "10%",
          "after": "8%"
        },
        {
          "label": "Front-desk hours on phones and confirmations",
          "before": "600 a month",
          "after": "456 a month"
        }
      ],
      "math": [
        "New patients: 132 − 120 = 12 a month, at $800 × 40% = $320 first-year contribution each: 12 × $320 = $3,840",
        "Kept hygiene visits: 2,400 × (10% − 8%) = 48 a month, at $150 × 50% = $75 each: 48 × $75 = $3,600",
        "Front desk: 6,000 × 6 ÷ 60 = 600 hours a month; the agent takes on 30%: 600 × 30% = 180 hours; less 20% review: 180 − 180 × 20% = 144 hours back at $28: 144 × $28 = $4,032",
        "Reporting: 30 × 50% = 15 hours taken on; less 20% review: 15 − 15 × 20% = 12 hours back at an office manager's $43: 12 × $43 = $516",
        "Monthly value: $3,840 + $3,600 + $4,032 + $516 = $11,988; hours back: 144 + 12 = 156",
        "Annual value: $11,988 × 12 = $143,856"
      ],
      "assumptions": "The 12 extra new patients are under 1% of the calls that go unanswered today (`6,000 × 22% = 1,320` a month); a new patient brings $800 in first-year collections at a 40% contribution margin; a hygiene visit collects $150 at a 50% contribution margin (the hygienist is already scheduled); office managers spend 30 hours a month on reports across the group.",
      "hoursReturnedPerMonth": 156,
      "monthlyValue": 11988,
      "annualValue": 143856,
      "timeToValue": "Live in 3–4 weeks after testing with the practice-management system; full value in about 90 days",
      "narrative": "Willowmere is a four-office dental group with 60 employees. During the morning rush about one call in five goes unanswered, after-hours callers reach voicemail, and hygiene openings from late cancellations rarely get refilled. A Customer Agent now answers overflow and after-hours calls and texts, books new patients, confirms appointments and offers open times to a waitlist. Its access is limited to scheduling and patient messaging, every action is logged, and clinical questions go straight to the team. An Analyst Agent pulls production, collections and schedule data from all four offices into one weekly dashboard, so office managers stop building reports by hand."
    },
    {
      "id": "restaurant-group",
      "label": "Illustrative scenario",
      "industry": "Restaurant group",
      "name": "Bramblewood Restaurant Group",
      "employees": 180,
      "locations": 6,
      "revenueRange": "$13M–$16M",
      "profile": "180 employees across 6 restaurants · full-service dining with catering and private events · revenue $13M–$16M, including about $10.8M in food sales",
      "challenge": "Supplier prices change weekly, but food cost is reviewed only at month-end. General managers spend about 10 hours a week each on invoices, inventory sheets and reports, and catering inquiries often wait a day for a reply.",
      "agents": [
        {
          "name": "Analyst Agent",
          "does": "reads every supplier invoice, tracks price changes and food cost by location, and flags dishes that are losing margin"
        },
        {
          "name": "AI Consulting",
          "does": "recommends menu-price and vendor changes for the owners to approve"
        },
        {
          "name": "Customer Agent",
          "does": "answers catering and private-event inquiries within minutes and books them"
        }
      ],
      "metrics": [
        {
          "label": "Food cost (share of food sales)",
          "before": "32.0%",
          "after": "31.2%"
        },
        {
          "label": "Reply time for catering and event inquiries",
          "before": "Next day",
          "after": "Within 5 minutes"
        },
        {
          "label": "Catering orders and private events booked",
          "before": "20 a month",
          "after": "24 a month"
        },
        {
          "label": "GM time on invoices, inventory and reports",
          "before": "10 hrs/week each",
          "after": "8 hrs/week each"
        }
      ],
      "math": [
        "Food cost: $10,800,000 × (32.0% − 31.2%) = $86,400 a year, or $86,400 ÷ 12 = $7,200 a month",
        "Events: 24 − 20 = 4 more a month, at $3,000 × 30% = $900 contribution each: 4 × $900 = $3,600",
        "Managers: 6 × 10 × 4 = 240 hours a month; the agent takes on 25%: 240 × 25% = 60 hours; less 20% review: 60 − 60 × 20% = 48 hours back at a GM's $43: 48 × $43 = $2,064",
        "Monthly value: $7,200 + $3,600 + $2,064 = $12,864",
        "Annual value: $12,864 × 12 = $154,368"
      ],
      "assumptions": "Food sales of $10.8M a year; an average catering order or private event of $3,000 at a 30% contribution margin.",
      "hoursReturnedPerMonth": 48,
      "monthlyValue": 12864,
      "annualValue": 154368,
      "timeToValue": "Invoice tracking live in about 3 weeks; food-cost gains within 60–90 days",
      "narrative": "Bramblewood is a six-location restaurant group with 180 employees. Supplier prices change weekly, but food cost is reviewed only at month-end, long after the margin is gone. General managers spend about ten hours a week on invoices, inventory sheets and reports, and catering inquiries often wait a day for a reply. An Analyst Agent now reads every supplier invoice, tracks price changes and food cost by location, and flags dishes that are losing margin. AI Consulting recommends menu and vendor changes for the owners to approve. A Customer Agent answers catering and private-event inquiries within minutes and books them on the spot."
    },
    {
      "id": "distributor",
      "label": "Illustrative scenario",
      "industry": "Industrial distributor",
      "name": "Ironvale Industrial Supply",
      "employees": 250,
      "locations": 3,
      "revenueRange": "$80M–$100M",
      "profile": "250 employees across 3 branches · industrial and maintenance supplies · revenue $80M–$100M · about $36M a year of quoted business",
      "challenge": "Inside sales and customer service reps spend much of the day on about 12,000 order-status and quote-request emails a month. Quotes take a full business day, each rep prices from a slightly different spreadsheet, and lapsed accounts go unworked.",
      "agents": [
        {
          "name": "Customer Agent",
          "does": "answers routine order-status and tracking emails and turns quote requests into ready-to-price drafts"
        },
        {
          "name": "Analyst Agent",
          "does": "checks every quote against margin floors and current costs and flags exceptions before it goes out"
        },
        {
          "name": "AI Sales Agent",
          "does": "researches lapsed accounts and writes each buyer a personal note; reps approve every quote and outreach email"
        }
      ],
      "metrics": [
        {
          "label": "Routine emails handled without a rep",
          "before": "0%",
          "after": "40% of 12,000 a month"
        },
        {
          "label": "Quote turnaround",
          "before": "Next business day",
          "after": "Same day"
        },
        {
          "label": "Gross margin on quoted business",
          "before": "22.0%",
          "after": "22.5%"
        },
        {
          "label": "Lapsed accounts reactivated",
          "before": "About 0 a month",
          "after": "3 a month"
        }
      ],
      "math": [
        "Email: 12,000 × 6 ÷ 60 = 1,200 hours a month; the agent takes on 40%: 1,200 × 40% = 480 hours; less 20% review: 480 − 480 × 20% = 384 hours back at a blended $36: 384 × $36 = $13,824",
        "Margin: $36,000,000 × (22.5% − 22.0%) = $180,000 a year, or $180,000 ÷ 12 = $15,000 a month",
        "Reactivated accounts: 100 × 3% = 3 a month, at $20,000 × 20% = $4,000 first-year gross profit each: 3 × $4,000 = $12,000",
        "Monthly value: $13,824 + $15,000 + $12,000 = $40,824",
        "Annual value: $40,824 × 12 = $489,888"
      ],
      "assumptions": "Blended inside sales and customer service cost of $36 an hour (the average of $27 and $45); 100 lapsed accounts contacted a month; a reactivated account buys $20,000 a year at a 20% gross margin, below the quoted-business margin because returning accounts often need a sharper price.",
      "hoursReturnedPerMonth": 384,
      "monthlyValue": 40824,
      "annualValue": 489888,
      "timeToValue": "Email agent live in 4–6 weeks; pricing findings within the first 30 days; full run-rate in 4–6 months",
      "narrative": "Ironvale is a 250-person industrial distributor with three branches. Its inside sales and customer service reps spend much of the day on order-status and quote-request emails, quotes take a full business day, and each rep prices from a slightly different spreadsheet. A Customer Agent now answers routine status and tracking emails and turns quote requests into ready-to-price drafts. An Analyst Agent checks every quote against margin floors and current costs and flags exceptions before it goes out. An AI Sales Agent researches lapsed accounts and writes each buyer a personal note about what has changed since their last order. Reps approve every quote and email."
    }
  ]
}
```
