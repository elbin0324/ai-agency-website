// Marketing Director demo: steps and choreography (content/DEMOS.md §4, DEMO_ENGINE.md).
// OWNER: demo-marketing. MarketingDemo.astro renders the FINAL state (Trend tab, KPI strip in week 8 mode,
// the feed with the Week 8 report on top); data attributes in that markup say how each piece starts.
// Offsets in ctx.at() are the storyboard's, measured from each step's start.
import { defineDemo, type DemoContext } from '@/scripts/demo-engine';
import {
  approval, budget, budgetPct, budgetTotal, campaignFootnote, campaignTotal, campaigns, cpb, each, change, experimentResults,
  experiments, fixes, flagOrder, guardrailOk, guardrails, kpiStart, pctLabel, queued, report, resultsFootnote,
  wasteLine, weeklyCpb, weeks, winRule,
} from './data';
import { currency } from '@/lib/format';

// ---------------------------------------------------------------- helpers (all through ctx, so pause/abort/jump stay exact)

const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)'; // --ease-out-soft

/** Newest-first feed: the note drops in at the top and the older notes glide down to make room. */
async function insertNote(ctx: DemoContext, name: string) {
  const note = ctx.el(name);
  const list = note?.parentElement;
  if (!note || !list) return;
  const below = Array.from(list.children).filter(
    (el) => el !== note && !el.hasAttribute('hidden') && note.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  await ctx.show(note, { effect: 'none' });
  if (ctx.instant) return;
  const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
  const h = note.getBoundingClientRect().height + gap;
  await ctx.all(
    ctx.animate(below, [{ translate: `0 ${-h}px` }, { translate: '0 0' }], { duration: 420, easing: EASE }),
    ctx.animate(note, [{ opacity: 0, translate: '0 -8px' }, { opacity: 1, translate: '0 0' }], { duration: 320, delay: 140, easing: EASE, fill: 'backwards' }),
  );
}

/** In-app tab switch: the segmented control moves and the views crossfade (they share a .demo-stack). */
function switchTab(ctx: DemoContext, from: string, to: string) {
  ctx.removeClass(`@tab-${from}`, 'is-on');
  ctx.addClass(`@tab-${to}`, 'is-on');
  return ctx.swap(`@view-${from}`, `@view-${to}`);
}

/** A flag's detail popover opens on its row, holds ~1.2 s, then docks into the Flag column as a chip. */
function flagRow(ctx: DemoContext, row: number, t0: number) {
  const r = `[data-el="camp-row"][data-row="${row}"]`;
  ctx.at(t0, () => {
    ctx.addClass(r, 'is-flagging');
    return ctx.reveal(`@pop-${row}`);
  });
  ctx.at(t0 + 60, () => ctx.scroll('@work', `@pop-${row}`)); // phones: bring the popover into view (no-op on desktop)
  ctx.at(t0 + 1400, async () => {
    await ctx.animate(`@pop-${row}`, [{ opacity: 1, scale: '1' }, { opacity: 0, scale: '0.55' }], { duration: 260, easing: EASE, fill: 'forwards' });
    await ctx.hide(`@pop-${row}`, { effect: 'none' });
    ctx.removeClass(r, 'is-flagging');
  });
  ctx.at(t0 + 1500, () => ctx.show(`@flag-${row}`, { effect: 'scale' }));
}

/** The trend line wipes in left to right (linear, so the annotations can land as it passes them). */
async function drawTrend(ctx: DemoContext, duration: number) {
  await ctx.show('@trend-line', { effect: 'none' });
  await ctx.animate('@trend-line', [{ clipPath: 'inset(-8px 100% -8px -8px)' }, { clipPath: 'inset(-8px -8px -8px -8px)' }], {
    duration,
    easing: 'linear',
  });
}

/** Phones: scroll the workspace so `name` sits at the top (the KPI strip scrolls away). A no-op on desktop,
 *  where nothing in the workspace overflows (scroll() clamps to the pane's scroll range, which is 0 there). */
function scrollToTop(ctx: DemoContext, name: string) {
  const box = ctx.el('work');
  const el = ctx.el(name);
  if (!box || !el) return;
  const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 8;
  return ctx.scroll(box, Math.max(0, Math.round(top)));
}

/** KPI strip to week 8 mode: each tile crossfades, left to right. */
function kpiToWeek8(ctx: DemoContext) {
  const a = ctx.els('kpi-a');
  const b = ctx.els('kpi-b');
  return ctx.all(...a.map((el, i) => ctx.after(i * 90, () => ctx.swap(el, b[i]))));
}

// ---------------------------------------------------------------- transcript lines (DEMOS.md §0.7: key on-screen text)

const camp = (c: (typeof campaigns)[number]) =>
  `${c.name} (${c.channel}): ${currency(c.spend)} · ${c.bookings} bookings · ${cpb(c.spend, c.bookings)} each · est. ROAS ${c.roas}`;
const flagged = (n: number) => {
  const c = campaigns.find((x) => x.n === n)!;
  const f = c.flag!;
  const rows = f.rows ? ` ${f.rows.map(([t, v]) => `${t} ${v}`).join(', ')}.` : '';
  const lines = f.lines ? ` ${f.lines.join(' ')}` : '';
  return `${c.name}, flag “${f.label}”: ${f.lead}${f.amount ? ` ${f.amount}` : ''}${rows}${lines}`;
};
const arm = (a: (typeof experimentResults)[number]['current']) => `${currency(a.spend)} · ${a.count} ${a.unit} · ${each(a)} each`;

// ---------------------------------------------------------------- the demo

export default defineDemo({
  id: 'marketing',
  steps: [
    {
      label: 'Accounts',
      caption: 'Stillbrook Dental: 4 offices, 6 campaigns, $24,000 every 4 weeks.',
      duration: 4500,
      pane: 'work',
      transcript: [
        `KPIs: ${kpiStart.map((k) => `${k.label} ${k.value}`).join(' · ')}.`,
        `Campaigns, last 28 days: ${campaigns.map(camp).join('; ')}. Total: ${currency(campaignTotal.spend)} · ${campaignTotal.bookings} bookings · ${cpb(campaignTotal.spend, campaignTotal.bookings)} each · est. ROAS ${campaignTotal.roas}.`,
        campaignFootnote,
        `${guardrails.title} · ${guardrails.by}: ${guardrails.rules.map((r) => r.text).join('; ')}.`,
        'Feed: Connected (read-only): Google Ads · Meta Ads · practice-management bookings.',
      ],
      run(ctx) {
        ctx.at(0, () => insertNote(ctx, 'note-1'));
        ctx.at(150, () => ctx.countUp('@kpi-val'));
        ctx.at(300, () => ctx.cascade('[data-el="camp-row"], [data-el="camp-total"]'));
        ctx.at(400, () => ctx.ticker('Connected, read-only: Google Ads · Meta Ads'));
      },
    },
    {
      label: 'Audit',
      caption: 'It audits every campaign, search term and ad: 18% of spend is waste.',
      duration: 6000,
      pane: 'work',
      transcript: [
        'Week 1 · Audit: 6 campaigns, 1,912 search terms, 14 ads · 6 min.',
        ...flagOrder.map(flagged),
        `${wasteLine.strong} ${wasteLine.rest}.`,
      ],
      run(ctx) {
        ctx.at(0, () => insertNote(ctx, 'note-2'));
        ctx.at(0, () => scrollToTop(ctx, 'toolbar'));
        flagOrder.forEach((row, i) => flagRow(ctx, row, 200 + i * 1400));
        ctx.at(4500, () => ctx.show('@waste')); // in by +4,750 ms, leaving a 1.25 s reading hold
        ctx.at(4500, () => ctx.ticker('Week 1 · Audit: $4,364 of waste found'));
      },
    },
    {
      label: 'Fixes',
      caption: 'Fixes go live: 43 negative keywords, fresh creative, tighter radius.',
      duration: 4500,
      pane: 'feed',
      transcript: ['Week 2 · Fixes live:', ...fixes.map((f) => `${f.lead} ${f.text}.`), `${approval.who} · ${approval.rest}.`],
      run(ctx) {
        ctx.at(0, () => insertNote(ctx, 'note-3'));
        ctx.at(380, () => ctx.cascade('@fix-line', { stagger: 300 }));
        ctx.at(380, () => ctx.check('@fix-check', { spin: 400, stagger: 300 }));
        ctx.at(2000, () => ctx.show('@fix-approval'));
        ctx.at(2000, () => ctx.ticker('Week 2 · Fixes live, approved by Jess Morgan'));
      },
    },
    {
      label: 'Experiments',
      caption: 'Then it designs three experiments to find what books more patients.',
      duration: 5000,
      pane: 'work',
      transcript: [
        `Week 2 · 3 experiments live. ${winRule}`,
        ...experiments.map(
          (e) => `${e.id} · ${e.type} · ${e.target}. Current: ${e.current}. New: ${e.next}. Split 50/50 · 3 weeks · Measure: ${e.measure}.`,
        ),
      ],
      run(ctx) {
        ctx.at(0, () => switchTab(ctx, 'campaigns', 'experiments'));
        ctx.at(0, () => scrollToTop(ctx, 'toolbar'));
        ctx.at(250, () => ctx.cascade('@exp-card', { stagger: 200 }));
        ctx.at(1300, () => ctx.scroll('@work', '[data-el="exp-card"]:last-child', { duration: 1400 })); // phones: pan down the stacked cards
        ctx.at(1150, () => insertNote(ctx, 'note-4'));
        ctx.at(1150, () => ctx.ticker('Week 2 · 3 experiments live'));
      },
    },
    {
      label: 'Week 4',
      caption: 'Three weeks later: no clear winner yet. Two tests keep running.',
      duration: 6000,
      pane: 'work',
      transcript: [
        'Week 4 · Results in.',
        ...experimentResults.map(
          (r) => `${r.test}: current ${arm(r.current)}; new ${arm(r.next)}; cost per booking ${change(r)}; ${r.prob}% probability new is better. ${r.decision}: ${r.action.toLowerCase()}.`,
        ),
        resultsFootnote,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.show('@stamp-wk4', { effect: 'scale' }));
        ctx.at(100, () => insertNote(ctx, 'note-5'));
        ctx.at(100, () => ctx.ticker('Week 4 · Results in: no winner yet'));
        ctx.at(350, () => ctx.swap('@exp-cards', '@exp-results'));
        ctx.at(350, () => scrollToTop(ctx, 'toolbar'));
        ctx.at(650, () => ctx.cascade('@res-row', { stagger: 120 }));
        ctx.at(1050, () => ctx.grow('@res-bar', { axis: 'x', stagger: 120 }));
        ctx.at(2050, () => ctx.cascade('@res-decision', { effect: 'scale', stagger: 150 }));
      },
    },
    {
      label: 'Budget',
      caption: 'Budget moves to what works, never more than ±20% per week.',
      duration: 5000,
      pane: 'work',
      transcript: [
        'Week 5 · Budget moved. Week 4 → week 5:',
        ...budget.map((r) => `${r.name}: ${currency(r.w4)} → ${currency(r.w5)} (${pctLabel(budgetPct(r))}). ${r.why}`),
        `Total: ${currency(budgetTotal.w4)} → ${currency(budgetTotal.w5)} (0%).`,
        `${guardrailOk}. ${queued.lead} ${queued.text}.`,
      ],
      run(ctx) {
        ctx.at(0, () => switchTab(ctx, 'experiments', 'budget'));
        ctx.at(0, () => scrollToTop(ctx, 'toolbar'));
        ctx.at(200, () => insertNote(ctx, 'note-6'));
        ctx.at(600, () => ctx.countUp('@w5'));
        ctx.at(600, () => ctx.grow('[data-el="chg-bar"][data-dir="up"]', { axis: 'x', stagger: 60 }));
        ctx.at(600, () => ctx.grow('[data-el="chg-bar"][data-dir="down"]', { axis: 'x', origin: '100% 50%', stagger: 60 }));
        ctx.at(1300, () => ctx.highlight('@chg-cell'));
        ctx.at(1300, () => ctx.cascade('@chg-pct', { stagger: 40 }));
        ctx.at(2050, () => ctx.show('@guard-ok'));
        ctx.at(2050, () => ctx.scroll('@work', '@queued', { duration: 600 }));
        ctx.at(2450, () => ctx.show('@queued'));
        ctx.at(2450, () => ctx.ticker('Week 5 · Budget moved, all within ±20%'));
      },
    },
    {
      label: 'Week 8',
      caption: 'Week 8: cost per new patient is down from $171 to $154.',
      duration: 5000,
      pane: 'work',
      transcript: [
        `Cost per new-patient booking, weekly, at $6,000 a week: ${weeks.map((w, i) => `week ${w.week} ${currency(Math.round(weeklyCpb[i]))} (${w.bookings} bookings)`).join(', ')}.`,
        'Annotations: week 1 Audit; week 2 Fixes live; weeks 2–4 Experiments; week 5 Budget moved; weeks 6–8 Weekly budget steps (±20% cap).',
        'KPIs, week 8: Spend · week 8 $6,000 (same) · Bookings 39 (+4 vs week 1) · Cost per booking $154 (−10%) · Waste found $4,364 per 4 weeks.',
        `${report.title} · ${report.to}: ${report.lines.map((l) => (l.lead ? `${l.lead} ${l.text}` : l.text)).join(' ')}`,
      ],
      run(ctx) {
        const draw = 900; // DEMOS.md §0.3 `draw`: the line passes week k at 300 + (k − 1) / 7 × 900 ms
        const pass = (week: number) => 300 + ((week - 1) / 7) * draw;
        ctx.at(0, () => switchTab(ctx, 'budget', 'trend'));
        ctx.at(0, () => scrollToTop(ctx, 'toolbar'));
        ctx.at(300, () => ctx.show('@trend-start', { effect: 'scale' }));
        ctx.at(300, () => drawTrend(ctx, draw));
        ctx.at(pass(1) + 60, () => ctx.show('@ann-audit'));
        ctx.at(pass(2) + 60, () => ctx.show('@ann-fixes'));
        ctx.at(pass(2) + 60, () => ctx.show('@ann-band', { effect: 'opacity', duration: 400 }));
        ctx.at(pass(5) + 60, () => ctx.show('@ann-budget'));
        ctx.at(pass(7), () => ctx.show('@ann-bracket'));
        ctx.at(pass(8), () => ctx.show('@trend-end', { effect: 'scale' }));
        ctx.at(pass(8) + 100, () => kpiToWeek8(ctx));
        ctx.at(2000, () => ctx.pane('feed')); // phones: the report is the payoff
        ctx.at(2000, () => insertNote(ctx, 'note-report'));
        ctx.at(2250, () => ctx.stream('@report-body'));
        ctx.at(2250, () => ctx.ticker('Week 8 report ready for Dr. Park'));
      },
    },
    {
      label: 'Result',
      caption: 'Same budget. Four more new patients every week.',
      duration: 4000,
      run: (ctx) => ctx.showResult(),
    },
  ],
});
