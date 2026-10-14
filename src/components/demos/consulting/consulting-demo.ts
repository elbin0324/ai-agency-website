// Consulting demo steps (content/DEMOS.md §6: 7 steps, 38.0 s). OWNER: demo-consulting.
// ConsultingDemo.astro renders the final-state markup; this file holds captions, timing and choreography.
// Offsets follow DEMOS.md (step-relative ms). Rows, values and labels live in ./data.ts.
import { defineDemo, type DemoContext } from '@/scripts/demo-engine';
import { currency } from '@/lib/format';
import { findings, milestones, opportunities, opportunityNote, opportunityTotal, pctOfRevenue, pnl, sources, waterfall, waterfallNote, workstreams } from './data';

/** Mobile pane tab for the left panel: "Sources & findings" while playing, "Roadmap" in the static view. */
const PANEL_TAB = 'Sources & findings';
const PANEL_TAB_STATIC = 'Roadmap';
function setPanelTab(ctx: DemoContext, label: string) {
  const tab = ctx.$('[data-demo-pane-tab="panel"]');
  const text = tab && Array.from(tab.childNodes).find((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
  if (text) text.textContent = label;
}

/** Canvas view tabs: one is active at a time (the active one names the current view). */
function activate(ctx: DemoContext, view: 'pnl' | 'opps' | 'wf' | 'road') {
  ctx.removeClass('[data-el^="tab-"]', 'is-on');
  ctx.addClass(`@tab-${view}`, 'is-on');
}

export default defineDemo({
  id: 'consulting',
  steps: [
    {
      label: 'Data in',
      caption: 'Larder & Flame: 2 restaurants, catering, 40 staff. The books go in.',
      duration: 4500,
      pane: 'panel',
      transcript: [`Connected · read-only: ${sources.map((s) => `${s.name} (${s.detail})`).join('; ')}.`],
      run(ctx) {
        ctx.at(200, () => ctx.cascade('@src-row', { stagger: 180 }));
        ctx.at(350, () => ctx.check('@src-chk', { spin: 380, stagger: 180 }));
        ctx.at(2300, () => ctx.ticker('8 sources connected · read-only'));
      },
    },
    {
      label: 'P&L',
      caption: 'Every line of the P&L, with the invoices and statements behind it.',
      duration: 5000,
      pane: 'canvas',
      transcript: [
        `P&L, trailing 12 months: ${pnl
          .filter((l) => !l.kind || l.kind === 'revenue')
          .map((l) => `${l.label} ${currency(l.value)} (${pctOfRevenue(l.value)})`)
          .join('; ')}.`,
        pnl.filter((l) => l.kind === 'total' || l.kind === 'ebitda').map((l) => `${l.label} ${currency(l.value)} (${pctOfRevenue(l.value)}).`).join(' '),
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swap('@canvas-skel', '@v-pnl'), ctx.show('@tab-pnl')));
        ctx.at(0, () => activate(ctx, 'pnl'));
        ctx.at(250, () => ctx.cascade('@pnl-row', { stagger: 70 }));
        ctx.at(450, () => ctx.grow('@pnl-bar', { axis: 'x', stagger: 70 }));
        ctx.at(1600, () => ctx.show('@pnl-ebitda'));
        ctx.at(1900, () => ctx.ticker('P&L read · EBITDA $230,400 (6.4%)'));
      },
    },
    {
      label: 'Findings',
      caption: 'It traces each cost to its source: invoices, schedules, fees, meters.',
      duration: 5500,
      pane: 'panel',
      transcript: findings.map((f) => `${f.did}: ${f.found}.`),
      run(ctx) {
        ctx.at(0, () => ctx.swap('@src', '@findings'));
        // One line every 800 ms, each with its check; the P&L line it traces to pulses and gets its marker.
        findings.forEach((f, i) => {
          const n = i + 1;
          ctx.at(250 + i * 800, () => {
            void ctx.show(`[data-finding="${n}"]`);
            void ctx.check(`[data-finding="${n}"] [data-check]`, { spin: 350 });
            void ctx.show(`[data-pnl-mark="${n}"]`, { effect: 'scale' });
            void ctx.pulse(`[data-line="${f.line}"]`);
            if (n === findings.length) void ctx.ticker('6 findings, each traced to its source');
          });
        });
      },
    },
    {
      label: 'Ranking',
      caption: 'Five opportunities, ranked by dollars a year, with effort for each.',
      duration: 6500,
      pane: 'canvas',
      transcript: [
        ...opportunities.map(
          (o, i) =>
            `${i + 1}. ${o.area}: ${o.action}. Identified ${currency(o.identified)} a year, counted ${currency(o.counted)} (${o.margin}). Effort ${o.effort.toLowerCase()}, ${o.time}. ${o.evidence}`,
        ),
        `Total: ${currency(opportunityTotal.identified)} identified, ${currency(opportunityTotal.counted)} counted (${opportunityTotal.margin}).`,
        opportunityNote,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swap('@v-pnl', '@v-opps'), ctx.show('@tab-opps')));
        ctx.at(0, () => activate(ctx, 'opps'));
        ctx.at(300, () => ctx.cascade('@opp-row', { stagger: 150 }));
        opportunities.forEach((_, i) => ctx.at(300 + i * 150, () => ctx.countUp(`[data-opp="${i + 1}"] [data-count]`)));
        ctx.at(1350, () => ctx.show('@opp-total'));
        ctx.at(1600, () => ctx.show('@opp-note'));
        ctx.at(1700, () => ctx.ticker('5 opportunities ranked · $79,200 a year identified'));
      },
    },
    {
      label: 'Margin',
      caption: 'EBITDA margin, counting half of each saving: 6.40% to 7.50%.',
      duration: 6000,
      pane: 'canvas',
      transcript: [
        `EBITDA margin · counted savings: ${waterfall.map((b) => `${b.label} ${b.value} (${b.dollars})`).join(' → ')}.`,
        waterfallNote,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swap('@v-opps', '@v-wf'), ctx.show('@tab-wf')));
        ctx.at(0, () => activate(ctx, 'wf'));
        // Left to right: today's total, each counted saving floating up from the running total, then the result.
        waterfall.forEach((b, i) => {
          const start = i === 0 ? 300 : 950 + (i - 1) * 380;
          const grow = b.type === 'step' ? 380 : 600;
          ctx.at(start, () => ctx.grow(`[data-wf="${i}"] [data-grow]`, { duration: grow }));
          ctx.at(start + grow - 120, () => ctx.show(`[data-wf="${i}"] .wf__val`));
          if (i < waterfall.length - 1) ctx.at(start + grow, () => ctx.show(`[data-wf="${i}"] .wf__link`, { effect: 'opacity' }));
        });
        ctx.at(3500, () => ctx.show('@wf-note'));
        ctx.at(3600, () => ctx.ticker('EBITDA margin 6.40% → 7.50%, counting half'));
      },
    },
    {
      label: 'Roadmap',
      caption: 'A 90-day roadmap: quick wins first, an owner for every step.',
      duration: 6000,
      pane: 'canvas',
      transcript: [
        ...workstreams.map((w) => `${w.name}: ${w.owner}, days ${w.days}, ${w.value === 'Tracks all five' ? 'tracks all five' : `${w.value} identified`}.`),
        `Milestones: ${milestones.map((m) => `${m.day}: ${m.text}`).join(' · ')}.`,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swap('@v-wf', '@v-road'), ctx.show('@tab-road')));
        ctx.at(0, () => activate(ctx, 'road'));
        ctx.at(250, () => ctx.cascade('@road-row', { stagger: 100 }));
        ctx.at(300, () => ctx.grow('@road-bar', { axis: 'x', stagger: 100 }));
        milestones.forEach((_, i) => ctx.at(1750 + i * 150, () => ctx.show(`[data-ms="${i + 1}"]`)));
        ctx.at(2300, () => ctx.all(ctx.swap('@st-run', '@st-review'), ctx.ticker('90-day roadmap ready for your review')));
      },
    },
    {
      label: 'Result',
      caption: '$79,200 a year identified, with a plan and owners to capture it.',
      duration: 4500,
      run: (ctx) => ctx.showResult(),
    },
  ],
  // Reduced motion, static view (DEMOS.md §6 "Reduced-motion final state"): the waterfall on top and the
  // ranked opportunities below it; the left panel shows the roadmap as a list grouped by phase.
  final(ctx) {
    ctx.hide('[data-el="findings"], [data-el="v-road"]');
    ctx.show('[data-el="v-wf"], [data-el="v-opps"]');
    ctx.addClass('@canvas', 'is-static');
    setPanelTab(ctx, PANEL_TAB_STATIC);
  },
  reset(ctx) {
    setPanelTab(ctx, PANEL_TAB);
  },
});
