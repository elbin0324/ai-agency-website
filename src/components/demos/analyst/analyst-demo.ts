// Analyst Agent demo: steps, captions and choreography (content/DEMOS.md §2). OWNER: demo-analyst.
// AnalystDemo.astro renders the final-state markup; this file holds the steps. The component's frontmatter
// (chapters, captions, transcript) and its <script> (behavior) both import it. Engine API: DEMO_ENGINE.md.
//
// Offsets follow DEMOS.md. Two deliberate changes keep the 1.2 s reading hold (DESIGN.md §9.5): the step 6
// total line and footer land at +6,250 / +6,500 ms (DEMOS.md: +6,400 / +7,000), and the raw rows cascade at
// 40 ms (DEMOS.md: 60 ms) because the window shows 16 rows instead of 9.
import { defineDemo, type DemoContext, type Target } from '@/scripts/demo-engine';
import { F_GM_PCT, F_MARGIN, F_SUMIFS } from './formulas';

const SEL_CLASS = 'is-sel';

/** A new sheet tab pops in: scale 0.9 -> 1 over 200 ms (DEMOS.md §2 Layout). */
async function pop(ctx: DemoContext, tab: Target) {
  await ctx.show(tab, { effect: 'none' });
  await ctx.animate(tab, [{ opacity: 0, scale: '0.9' }, { opacity: 1, scale: '1' }], { duration: 200 });
}

/** Make a sheet the active one: tab state, sheet crossfade and status bar. */
function activate(ctx: DemoContext, from: string, to: string) {
  ctx.removeClass(`@tab-${from}`, 'is-active');
  ctx.addClass(`@tab-${to}`, 'is-active');
  return ctx.all(ctx.swap(`@sheet-${from}`, `@sheet-${to}`), ctx.swap(`@st-${from}`, `@st-${to}`));
}

/** Formula bar: name box + formula text. */
function formula(ctx: DemoContext, ref: string, text: string) {
  return ctx.all(ctx.swapText('@nb', ref, { duration: 200 }), ctx.swapText('@fx', text, { duration: 200 }));
}

/** Move the selection to a cell and show its formula. */
function select(ctx: DemoContext, cell: Target, ref: string, text: string, from?: Target) {
  if (from) ctx.removeClass(from, SEL_CLASS);
  ctx.addClass(cell, SEL_CLASS);
  return formula(ctx, ref, text);
}

/** A cell flips to its final (markup) text: 150 ms squash, 40 ms stagger (DEMOS.md §2 step 3). */
function flip(ctx: DemoContext, name: string, stagger = 40) {
  const els = ctx.els(name);
  return ctx.all(
    ...els.map((el, i) =>
      ctx.after(i * stagger, async () => {
        await ctx.animate(el, [{ scale: '1 1' }, { scale: '1 0' }], { duration: 75, easing: 'ease-in' });
        ctx.setText(el, ctx.text(el));
        await ctx.animate(el, [{ scale: '1 0' }, { scale: '1 1' }], { duration: 75 });
      }),
    ),
  );
}

/** Rows of a sheet fill in one after another (their text was transparent while pending). */
function fillRows(ctx: DemoContext, rows: string, stagger: number) {
  return ctx.all(...ctx.$$(rows).map((row, i) => ctx.after(i * stagger, () => ctx.removeClass(row, 'is-pending'))));
}

/** Horizontal pan so the right edge of a sheet is in view (phones and narrow windows; a no-op when it fits). */
function panRight(ctx: DemoContext, sheet: string, ms = 450) {
  const box = ctx.el(sheet);
  if (!box) return;
  const from = box.scrollLeft;
  const to = box.scrollWidth - box.clientWidth;
  if (to <= from + 1) return;
  ctx.addClass(box, 'is-panned'); // phones: drops the right-edge fade once the last columns are in view
  return ctx.tween(ms, (k) => (box.scrollLeft = from + (to - from) * k), (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2));
}

/** Vertical scroll by whole rows until `row` is fully in view, as a spreadsheet scrolls (phones; a no-op
 *  when it already fits). Layout values (offset*, client*) so a scaled window still measures true. */
function revealRow(ctx: DemoContext, sheet: string, row: HTMLElement | undefined, ms = 600) {
  const box = ctx.el(sheet);
  if (!box || !row || !box.clientHeight) return;
  const rh = row.offsetHeight || 24;
  const need = row.offsetTop - box.offsetTop + rh - box.clientHeight - box.scrollTop;
  if (need <= 0.5) return;
  return ctx.scroll(box, box.scrollTop + Math.ceil(need / rh) * rh, { duration: ms });
}

/** Panel, step 2: issue line i appears and its numbers count. */
function issueLine(ctx: DemoContext, i: number) {
  const item = ctx.els('item')[i];
  return ctx.all(ctx.show(item), ctx.countUp(item?.querySelector('[data-count]')));
}

/** Panel, step 3: issue line i turns into its fix, with the check (spinner, then check). */
async function fixLine(ctx: DemoContext, i: number) {
  await ctx.all(ctx.swap(ctx.els('i-issue')[i], ctx.els('i-fix')[i]), ctx.swap(ctx.els('i-dot')[i], ctx.els('i-chk')[i]));
  await ctx.check(ctx.els('i-chk')[i], { spin: 300 });
}

/** Panel, step 3: the scan header (title + "Found 6 kinds of problems:") becomes the one-line "Cleaned" header.
 *  The second line folds away while the titles crossfade, so the checklist below never jumps. */
function foldHeader(ctx: DemoContext) {
  const found = ctx.el('found');
  const h = found ? `${found.offsetHeight}px` : '0px';
  return ctx.all(
    found && ctx.animate(found, [{ opacity: 1, height: h, marginTop: '6px' }, { opacity: 0, height: '0px', marginTop: '0px' }], { duration: 250, fill: 'forwards' }),
    ctx.swap('@h-scan', '@h-clean'),
  );
}

/** Panel, steps 4–5: a "Built" line appears and checks. */
async function builtLine(ctx: DemoContext, name: string) {
  await ctx.show(`@${name}`);
  await ctx.check(`[data-el="${name}"] .demo-check`, { spin: 300 });
}

export default defineDemo({
  id: 'analyst',
  steps: [
    {
      label: 'Export',
      caption: 'The controller drops in Q3’s raw export. It’s a mess.',
      duration: 4000,
      pane: 'agent',
      transcript: [
        'Priya (controller): Here’s Q3 sales. Clean it up, show me margin by product line by month, and tell me what’s going on. Margin feels off.',
        'Attached: Q3_sales_raw.xlsx · 4,318 rows · 412 KB',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.send('@composer', '@ask', { fast: true, delay: 150, pause: 150 }));
        ctx.at(1750, () => ctx.show('@st-work'));
        ctx.at(1800, () => ctx.all(fillRows(ctx, '.ax-sheet--raw .ax-row--data', 40), ctx.swap('@st-ready', '@st-raw'), formula(ctx, 'A1', 'Date')));
        ctx.at(1800, () => ctx.pane('sheet'));
        ctx.at(1900, () => ctx.ticker('Opened Q3_sales_raw.xlsx · 4,318 rows'));
      },
    },
    {
      label: 'Scan',
      caption: 'It finds every problem: mixed dates, duplicates, merged cells, totals.',
      duration: 5500,
      pane: 'sheet',
      transcript: [
        'Scanning 4,318 rows × 10 columns. Found 6 kinds of problems:',
        'Dates in 5 formats: 1,204 cells · Duplicate rows: 87 · Merged cells: 14 ranges, 312 blank cells · Subtotal and total rows: 9 · Numbers stored as text: 236 cells · Inconsistent product-line labels: 58 cells.',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.show('@check'), ctx.check('@scan-chk', { spin: 600 })));
        ctx.at(150, () => ctx.ticker('Scanning 4,318 rows × 10 columns'));
        ctx.at(500, () => ctx.show('@found'));
        // Highlights cascade by issue type, 300 ms apart, each with its tag and its panel line.
        ctx.at(600, () => ctx.all(ctx.highlight('@iss-date', 'hl hl-amber'), ctx.show('@tag-date'), issueLine(ctx, 0)));
        ctx.at(900, () => ctx.all(ctx.highlight('@r5', 'hl hl-red hl--tint'), issueLine(ctx, 1)));
        ctx.at(1200, () =>
          ctx.all(
            ctx.highlight('@mg-top', 'hl hl-blue g-top'),
            ctx.highlight('@mg-mid', 'hl hl-blue g-mid'),
            ctx.highlight('@mg-bot', 'hl hl-blue g-bot'),
            ctx.show('@tag-merged'),
            issueLine(ctx, 2),
          ),
        );
        ctx.at(1500, () => ctx.all(ctx.highlight('@r6', 'hl hl-red hl--tint hl--dashed'), issueLine(ctx, 3)));
        ctx.at(1800, () => ctx.all(ctx.highlight('@iss-text', 'hl hl-purple'), ctx.show('@tag-text'), issueLine(ctx, 4)));
        ctx.at(2100, () => ctx.all(ctx.highlight('@iss-label', 'hl hl-gray hl--dashed'), ctx.show('@tag-label'), issueLine(ctx, 5)));
        ctx.at(2600, () => ctx.pane('agent'));
        ctx.at(2600, () => ctx.ticker('Found 6 kinds of problems'));
      },
    },
    {
      label: 'Clean',
      caption: 'Cleaned and logged: 4,318 rows in, 4,222 out, tied to the books.',
      duration: 5000,
      pane: 'sheet',
      transcript: [
        'Cleaned, every change logged: 1,204 dates converted to YYYY-MM-DD · 87 duplicate rows removed · 14 merged ranges split, 312 cells filled down · 9 subtotal rows removed · 236 text values converted to numbers · 58 labels standardized to 4 product lines.',
        '4,318 rows in → 4,222 rows out · 1,906 changes in the Log sheet.',
        'Revenue $5,379,900 · matches QuickBooks Q3 sales ($0 difference).',
      ],
      run(ctx) {
        // Duplicate and subtotal rows strike and collapse.
        ctx.at(0, () => ctx.all(ctx.strike('@r5'), ctx.strike('@r6'), fixLine(ctx, 1)));
        ctx.at(150, () => fixLine(ctx, 3));
        // Merged Region cells split and fill down.
        ctx.at(600, () => {
          ctx.removeClass('@mg-top', 'hl hl-blue g-top');
          ctx.removeClass('@mg-mid', 'hl hl-blue g-mid');
          ctx.removeClass('@mg-bot', 'hl hl-blue g-bot');
          ctx.removeClass('@m-in');
          return ctx.all(ctx.hide('@tag-merged'), ctx.cascade('@fill', { stagger: 60 }), fixLine(ctx, 2));
        });
        // Dates rewrite to YYYY-MM-DD cell by cell.
        ctx.at(1000, () => {
          ctx.removeClass('@iss-date', 'hl hl-amber');
          return ctx.all(ctx.hide('@tag-date'), flip(ctx, 'fix-date'), fixLine(ctx, 0));
        });
        // H3: text becomes a number.
        ctx.at(1600, () => {
          ctx.removeClass('@iss-text', 'hl hl-purple');
          ctx.removeClass('@iss-text');
          return ctx.all(ctx.hide('@tag-text'), flip(ctx, 'fix-text'), fixLine(ctx, 4));
        });
        // Product-line labels standardize.
        ctx.at(1900, () => {
          ctx.removeClass('@iss-label', 'hl hl-gray hl--dashed');
          return ctx.all(ctx.hide('@tag-label'), flip(ctx, 'fix-label', 60), fixLine(ctx, 5));
        });
        // The Log tab is created (not opened), then Clean opens.
        ctx.at(2400, () => pop(ctx, '@tab-log'));
        ctx.at(2650, () => ctx.all(pop(ctx, '@tab-clean'), activate(ctx, 'raw', 'clean'), foldHeader(ctx)));
        ctx.at(2700, () => ctx.ticker('Cleaned · 1,906 changes logged'));
        ctx.at(2950, () => ctx.cascade('@sum', { stagger: 150 }));
      },
    },
    {
      label: 'Formulas',
      caption: 'Margin columns and a pivot, with real formulas your team can follow.',
      duration: 5000,
      pane: 'sheet',
      transcript: [
        `Built: Gross margin, column K: ${F_MARGIN} · GM %, column L: ${F_GM_PCT} · Pivot: gross margin by product line and month (SUMIFS, updates as rows are added).`,
        `Pivot!B5: ${F_SUMIFS}`,
        'Q3 gross margin: Packaging $456,300 · Janitorial $459,700 · Paper goods $247,900 · Safety & PPE $195,200 · Total $1,359,100.',
      ],
      run(ctx) {
        // The cleaning card folds into its one-line summary.
        ctx.at(0, () => ctx.swap('@check', '@cleaned'));
        // Columns K and L slide in from the right; the window pans to them when it is narrow.
        ctx.at(0, () => panRight(ctx, 'sheet-clean'));
        ctx.at(0, async () => {
          await ctx.show('@kl-head', { effect: 'none' });
          await ctx.animate('@kl-head', [{ opacity: 0, translate: '18px 0' }, { opacity: 1, translate: '0 0' }], { duration: 300 });
        });
        ctx.at(150, () => ctx.show('@built'));
        ctx.at(300, () => select(ctx, '@k2', 'K2', F_MARGIN, '@c-a1'));
        ctx.at(300, () => ctx.ticker('Gross margin and GM % columns'));
        ctx.at(450, () => ctx.all(ctx.cascade('@kv', { stagger: 30 }), builtLine(ctx, 'b-k')));
        ctx.at(1150, () => select(ctx, '@l2', 'L2', F_GM_PCT, '@k2'));
        ctx.at(1300, () => ctx.all(ctx.cascade('@lv', { stagger: 30 }), builtLine(ctx, 'b-l')));
        // The Pivot sheet is created and opens; its rows fill in.
        ctx.at(2000, () => ctx.all(pop(ctx, '@tab-pivot'), activate(ctx, 'clean', 'pivot'), formula(ctx, 'A1', 'Gross margin by product line and month')));
        // Phones show rows 1–15: the pivot scrolls one row so the % Total (row 16) is in view.
        ctx.at(2100, () =>
          ctx.all(
            fillRows(ctx, '.ax-sheet--pivot .ax-row--data', 45),
            builtLine(ctx, 'b-p'),
            revealRow(ctx, 'sheet-pivot', ctx.$$('.ax-sheet--pivot .ax-row--data')[15]),
          ),
        );
        ctx.at(2100, () => ctx.ticker('Pivot: margin by product line and month'));
        // B5: the SUMIFS formula. The pulse plays during the reading hold.
        ctx.at(3200, () => {
          void ctx.pulse('@pv-b5');
          return select(ctx, '@pv-b5', 'B5', F_SUMIFS, '@p-a1');
        });
      },
    },
    {
      label: 'Chart',
      caption: 'Then it charts gross margin by product line, month by month.',
      duration: 4500,
      pane: 'sheet',
      transcript: [
        'Chart: gross margin % by product line, Jul–Sep.',
        'Packaging 23.4%, 23.6%, 23.2% · Janitorial 30.1%, 30.6%, 30.4% · Paper goods 22.4%, 20.5%, 18.6% · Safety & PPE 29.0%, 28.4%, 25.6%. Note on the chart: freight surcharges from Aug 4.',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(pop(ctx, '@tab-chart'), activate(ctx, 'pivot', 'chart'), formula(ctx, 'Chart 1', '')));
        ctx.at(250, () => ctx.show('@ch-head'));
        ctx.at(300, () => ctx.show('@ch-axes', { effect: 'opacity' }));
        ctx.at(450, () => ctx.grow('.ax-bar', { stagger: 60 }));
        ctx.at(1700, () => ctx.cascade('@blab', { stagger: 90 }));
        ctx.at(1800, () => ctx.ticker('Charted gross margin % by month'));
        ctx.at(2100, () => ctx.show('@annot', { effect: 'opacity' }));
        ctx.at(2400, () => builtLine(ctx, 'b-c'));
      },
    },
    {
      label: 'Findings',
      caption: 'Plain-English findings, each with a fix and a dollar figure.',
      duration: 8000,
      pane: 'agent',
      transcript: [
        'What’s going on: Sales grew 5.6% from July to September, but gross margin dollars barely moved (+0.3%). The margin rate fell from 25.8% to 24.5%. Two things explain the drop, and a third has been leaking all quarter.',
        '1. Freight is eating Paper goods margin. Paper goods margin fell from 22.4% to 18.6% as freight rose from 7.6% to 11.4% of sales. Your carrier added fuel and small-shipment surcharges on Aug 4, and 46% of Paper goods deliveries are under 10 cases. Cost vs. July’s freight rate: $23,056 in Aug–Sep. Fix: add a $45 delivery fee on Paper goods orders under 10 cases (148 in September) and rebid the route with two carriers.',
        '2. A supplier increase never reached your prices. Nitrile glove costs rose 9% on Aug 18, but sell prices didn’t change. Safety & PPE margin slid from 29.0% to 25.6%. Cost: $9,724 in Aug–Sep. Fix: raise prices on the 14 affected glove SKUs by 9% this week.',
        '3. An expired promo is still discounting Janitorial. Six accounts still get 12% off list from a promo that ended in 2025. Their contract tier is 5%. Cost: $14,000 in Q3, on $176,000 of sales. Fix: move the six accounts to the 5% tier at renewal.',
        'Together: $46,780 of Q3 margin, about $28,000 a month at September’s pace. Completed in 3 min 48 s.',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.show('@report'));
        ctx.at(150, () => ctx.stream('@lead'));
        ctx.at(300, () => ctx.ticker('Writing up what changed and why'));
        ctx.at(1800, () => ctx.all(ctx.show('@find-1'), ctx.pulse('@bar-pg')));
        ctx.at(3400, () => ctx.all(ctx.show('@find-2'), ctx.pulse('@bar-sp9')));
        ctx.at(5000, () => {
          ctx.addClass('@bar-jn');
          return ctx.show('@find-3');
        });
        ctx.at(6250, () => ctx.show('@total'));
        ctx.at(6300, () => ctx.ticker('3 findings · $46,780 of Q3 margin'));
        ctx.at(6500, () => ctx.all(ctx.show('@done'), ctx.swap('@st-work', '@st-review')));
      },
    },
    {
      label: 'Result',
      caption: 'Done in under 4 minutes, with every change logged for review.',
      duration: 4500,
      async run(ctx) {
        void ctx.ticker('Done in 3 min 48 s · ready for review');
        await ctx.showResult();
      },
    },
  ],
});
