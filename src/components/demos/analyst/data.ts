// Analyst Agent demo data (content/DEMOS.md §2). OWNER: demo-analyst.
//
// Raw rows 1–9, the clean rows 1–7, the pivot, the chart series, the panel copy and the report are exactly
// as written in DEMOS.md. The sheet window shows 16 rows, so the export continues below the storyboard's
// rows: raw rows 10–18 are ordinary invoice lines in the export's clean formats (ISO dates, numbers as
// numbers, the four standard labels). They carry no issue the story would have to count, and their margins
// use the same formulas (K = H − I − J, L = K ÷ H), so every figure in the story stays as calibrated.
// Fictional business and customers; every figure is illustrative.

export const business = 'Cobalt Creek Supply Co.';
export const fileName = 'Q3_sales_raw.xlsx';

/** Sheet columns (letters), shared by the Raw and Clean sheets so the crossfade never shifts a column. */
export const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;

export const rawHeader = ['Date', 'Inv #', 'Customer', 'Region', 'Product Line', 'SKU', 'Qty', 'Revenue', 'COGS', 'Freight'];
export const cleanHeader = ['Date', 'Invoice', 'Customer', 'Region', 'Product line', 'SKU', 'Qty', 'Revenue', 'COGS', 'Freight', 'Gross margin', 'GM %'];

export type IssueKind = 'date' | 'dup' | 'merged' | 'subtotal' | 'text' | 'label';

export interface RawRow {
  /** Sheet row number in the raw export. */
  n: number;
  /** Date as exported, and as cleaned (YYYY-MM-DD). */
  date: string;
  iso: string;
  inv: string;
  customer: string;
  /** Region as exported ('' inside a merged block) and after unmerge + fill down. */
  region: string;
  regionClean: string;
  /** Position inside a merged Region block (D2:D5, D7:D9). */
  merge?: 'top' | 'mid' | 'bot';
  /** Product line as exported and standardized. */
  line: string;
  lineClean: string;
  sku: string;
  qty: number;
  /** Revenue as exported ("1240", or the text "$486.00 "), and the number. */
  revRaw: string;
  rev: number;
  cogs: number;
  freight: number;
  /** Row-level problems: removed in cleaning. */
  dup?: boolean;
  subtotal?: boolean;
}

const row = (r: Omit<RawRow, 'iso' | 'regionClean' | 'lineClean' | 'revRaw'> & Partial<RawRow>): RawRow => ({
  iso: r.date,
  regionClean: r.region,
  lineClean: r.line,
  revRaw: String(r.rev),
  ...r,
});

/** Raw export, rows 2–18 (row 1 is the header). Rows 2–9: DEMOS.md §2 step 1, verbatim. */
export const rawRows: RawRow[] = [
  row({ n: 2, date: '07/01/2026', iso: '2026-07-01', inv: '10482', customer: 'Bayside Diner', region: 'North', merge: 'top', line: 'Packaging', sku: 'PK-1204', qty: 40, rev: 1240, cogs: 902.7, freight: 49.6 }),
  row({ n: 3, date: '2026-07-01', inv: '10483', customer: 'Harvest Table Cafe', region: '', regionClean: 'North', merge: 'mid', line: 'Paper Goods', lineClean: 'Paper goods', sku: 'PG-3310', qty: 12, revRaw: '$486.00 ', rev: 486, cogs: 340.2, freight: 61.4 }),
  row({ n: 4, date: 'Jul 1', iso: '2026-07-01', inv: '10484', customer: 'Lakeview Grill', region: '', regionClean: 'North', merge: 'mid', line: 'JANITORIAL', lineClean: 'Janitorial', sku: 'JN-2207', qty: 6, rev: 732.5, cogs: 484.9, freight: 24.1 }),
  row({ n: 5, date: '07/01/2026', iso: '2026-07-01', inv: '10484', customer: 'Lakeview Grill', region: '', regionClean: 'North', merge: 'bot', line: 'JANITORIAL', lineClean: 'Janitorial', sku: 'JN-2207', qty: 6, rev: 732.5, cogs: 484.9, freight: 24.1, dup: true }),
  row({ n: 6, date: '', inv: '', customer: 'TOTAL 7/1', region: '', line: '', sku: '', qty: 0, rev: 3191, cogs: 2212.7, freight: 159.2, subtotal: true }),
  row({ n: 7, date: '7/2/26', iso: '2026-07-02', inv: '10485', customer: 'Corner Slice Pizza', region: 'South', merge: 'top', line: 'Paper goods', sku: 'PG-3302', qty: 8, rev: 318, cogs: 222.6, freight: 47.7 }),
  row({ n: 8, date: '07/02/2026', iso: '2026-07-02', inv: '10486', customer: 'Greenleaf Kitchen', region: '', regionClean: 'South', merge: 'mid', line: 'Safety/PPE', lineClean: 'Safety & PPE', sku: 'SP-4410', qty: 20, rev: 644, cogs: 437.9, freight: 19.3 }),
  row({ n: 9, date: '2-Jul', iso: '2026-07-02', inv: '10487', customer: 'Maple Street Deli', region: '', regionClean: 'South', merge: 'bot', line: 'Pkg', lineClean: 'Packaging', sku: 'PK-1188', qty: 25, rev: 905, cogs: 657, freight: 36.2 }),
  // The export continues (clean formats, no issues to count).
  row({ n: 10, date: '2026-07-02', inv: '10488', customer: 'Harbor Point Grill', region: 'East', line: 'Janitorial', sku: 'JN-2231', qty: 12, rev: 1186.4, cogs: 788.9, freight: 41.5 }),
  row({ n: 11, date: '2026-07-02', inv: '10489', customer: 'Sunnyside Bakery', region: 'East', line: 'Packaging', sku: 'PK-1210', qty: 30, rev: 978, cogs: 714.9, freight: 39.1 }),
  row({ n: 12, date: '2026-07-02', inv: '10490', customer: 'Oak & Ember BBQ', region: 'East', line: 'Paper goods', sku: 'PG-3318', qty: 15, rev: 562.5, cogs: 393.8, freight: 50.6 }),
  row({ n: 13, date: '2026-07-03', inv: '10491', customer: 'Little Lantern Cafe', region: 'West', line: 'Safety & PPE', sku: 'SP-4402', qty: 18, rev: 702, cogs: 491.4, freight: 21.1 }),
  row({ n: 14, date: '2026-07-03', inv: '10492', customer: 'Copper Pot Diner', region: 'West', line: 'Packaging', sku: 'PK-1204', qty: 35, rev: 1085, cogs: 790.8, freight: 43.4 }),
  row({ n: 15, date: '2026-07-03', inv: '10493', customer: 'Pine Hollow Lodge', region: 'West', line: 'Janitorial', sku: 'JN-2207', qty: 8, rev: 976.7, cogs: 646.5, freight: 32.2 }),
  row({ n: 16, date: '2026-07-03', inv: '10494', customer: 'Fresh Fork Market', region: 'North', line: 'Paper goods', sku: 'PG-3310', qty: 20, rev: 810, cogs: 567, freight: 72.9 }),
  row({ n: 17, date: '2026-07-03', inv: '10495', customer: 'Blue Heron Bistro', region: 'North', line: 'Safety & PPE', sku: 'SP-4415', qty: 10, rev: 455, cogs: 316.2, freight: 13.7 }),
  row({ n: 18, date: '2026-07-03', inv: '10496', customer: 'Hilltop Taqueria', region: 'North', line: 'Packaging', sku: 'PK-1188', qty: 22, rev: 796.4, cogs: 580.2, freight: 31.9 }),
];

/** Which raw cells carry which highlight in step 2 (DEMOS.md §2 step 2, "Visible cells"). */
export const dateIssueRows = [2, 4, 5, 7, 8, 9];
export const labelIssueRows = [3, 4, 5, 8, 9];
export const textIssueRow = 3;

/** Floating tags: one per issue type, set in the empty columns K:L of the row that shows that issue. */
export const tags: Record<number, { kind: IssueKind; text: string; tone: string }> = {
  2: { kind: 'date', text: '5 date formats', tone: 'hl-amber' },
  3: { kind: 'text', text: 'Text, not a number', tone: 'hl-purple' },
  4: { kind: 'label', text: 'Inconsistent labels', tone: 'hl-gray' },
  5: { kind: 'dup', text: 'Duplicate of row 4', tone: 'hl-red' },
  6: { kind: 'subtotal', text: 'Subtotal row', tone: 'hl-red' },
  7: { kind: 'merged', text: 'Merged cells', tone: 'hl-blue' },
};

// ---------------------------------------------------------------------------------------------------------
// Formats

const round2 = (n: number) => Math.round(n * 100) / 100;
/** 1,240.00 (Clean sheet numbers). */
export const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
/** 0.0% from a ratio. */
export const pct1 = (r: number) => `${(Math.round(r * 1000) / 10).toFixed(1)}%`;
/** 143,300 */
export const int = (n: number) => n.toLocaleString('en-US');

export interface CleanRow {
  n: number;
  cells: string[];
  /** Gross margin and GM % (columns K and L). */
  k: string;
  l: string;
}

/** Clean sheet, rows 2–16: raw rows minus the duplicate and the subtotal, renumbered. */
export const cleanRows: CleanRow[] = rawRows
  .filter((r) => !r.dup && !r.subtotal)
  .slice(0, 15)
  .map((r, i) => {
    const gm = round2(r.rev - r.cogs - r.freight);
    return {
      n: i + 2,
      cells: [r.iso, r.inv, r.customer, r.regionClean, r.lineClean, r.sku, String(r.qty), fmt2(r.rev), fmt2(r.cogs), fmt2(r.freight)],
      k: fmt2(gm),
      l: pct1(gm / r.rev),
    };
  });

// ---------------------------------------------------------------------------------------------------------
// Pivot (DEMOS.md §2 step 4): gross margin ($) rows 4–9 and gross margin % rows 11–16.

export const productLines = ['Packaging', 'Janitorial', 'Paper goods', 'Safety & PPE'] as const;
export const months = ['Jul', 'Aug', 'Sep'] as const;

export const pivotDollars: { label: string; values: number[]; total?: boolean }[] = [
  { label: 'Packaging', values: [143300, 153100, 159900, 456300] },
  { label: 'Janitorial', values: [150100, 154000, 155600, 459700] },
  { label: 'Paper goods', values: [90200, 83900, 73800, 247900] },
  { label: 'Safety & PPE', values: [66300, 67000, 61900, 195200] },
  { label: 'Total', values: [449900, 458000, 451200, 1359100], total: true },
];

export const pivotPercent: { label: string; values: string[]; total?: boolean }[] = [
  { label: 'Packaging', values: ['23.4%', '23.6%', '23.2%', '23.4%'] },
  { label: 'Janitorial', values: ['30.1%', '30.6%', '30.4%', '30.4%'] },
  { label: 'Paper goods', values: ['22.4%', '20.5%', '18.6%', '20.5%'] },
  { label: 'Safety & PPE', values: ['29.0%', '28.4%', '25.6%', '27.7%'] },
  { label: 'Total', values: ['25.8%', '25.5%', '24.5%', '25.3%'], total: true },
];

// ---------------------------------------------------------------------------------------------------------
// Chart (DEMOS.md §2 step 5). Series take the categorical slots in the order DEMOS.md lists them
// (DESIGN.md §3.1: "In Analyst charts, product lines take slots in the order they are listed").

export const chartSeries: { name: (typeof productLines)[number]; key: string; tone: number; values: number[] }[] = [
  { name: 'Packaging', key: 'pk', tone: 1, values: [23.4, 23.6, 23.2] },
  { name: 'Janitorial', key: 'jn', tone: 2, values: [30.1, 30.6, 30.4] },
  { name: 'Paper goods', key: 'pg', tone: 3, values: [22.4, 20.5, 18.6] },
  { name: 'Safety & PPE', key: 'sp', tone: 4, values: [29.0, 28.4, 25.6] },
];
export const chartMax = 35;
export const chartTicks = [0, 10, 20, 30];
