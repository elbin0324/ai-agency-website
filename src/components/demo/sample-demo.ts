// Reference demo for the engine (DEMO_ENGINE.md "Template"). OWNER: demo engine.
// SampleDemo.astro renders the final-state markup; this file holds the steps. Both the component's
// frontmatter (captions, chapters, transcript) and its <script> (behavior) import it.
//
// Every helper appears at least once: send/type (composer), reply = dots + stream (chat), cascade, highlight,
// strike, countUp, swap (status chips), swapText (clock), grow (bars), draw (sparkline), check, click,
// scroll, animate (WAAPI), pulse (stream cue), pane (mobile follow), ticker, showResult.
import { defineDemo } from '@/scripts/demo-engine';

export default defineDemo({
  id: 'sample',
  steps: [
    {
      label: 'Request',
      caption: "Friday, 4:12 pm. The owner asks the agent to total the week's wholesale orders.",
      duration: 5000,
      pane: 'chat',
      transcript: ["Rosa: Can you total this week's wholesale orders and send each café its summary?"],
      run(ctx) {
        ctx.at(0, () => ctx.send('@composer', '@ask'));
        ctx.at(2500, () => ctx.show('@st-work'));
        ctx.at(2600, () => ctx.ticker('Request received'));
      },
    },
    {
      label: 'Read',
      caption: 'It opens the order sheet and says what it found before it changes anything.',
      duration: 5500,
      pane: 'chat',
      transcript: [
        'Agent: On it. I opened orders-week-41.xlsx: 6 rows from 4 cafés. I’ll check for duplicates before I total anything.',
      ],
      async run(ctx) {
        await ctx.reply('@ack', {
          dots: 700,
          cues: {
            // fires when the file name streams in
            sheet: () => ctx.all(ctx.swap('@sheet-skel', '@sheet'), ctx.ticker('Opened orders-week-41.xlsx')),
          },
        });
      },
    },
    {
      label: 'Match',
      caption: 'Rows fill in as each order is matched. One duplicate is caught and struck out.',
      duration: 6000,
      pane: 'work',
      transcript: ['Order #1043 (Pine & Pour, Wed, $735) appears twice: counted once.', 'Week total: $3,717 across 5 orders.'],
      async run(ctx) {
        await ctx.cascade('[data-el=orders-row], [data-el=dup]');
        await ctx.highlight('@dup');
        await ctx.wait(500);
        await ctx.strike('@dup');
        await ctx.show('@orders-total');
        await ctx.countUp('@total-sum');
        void ctx.ticker('Removed duplicate #1043');
      },
    },
    {
      label: 'Chart',
      caption: 'Daily totals are charted from the cleaned sheet. Thursday was the busiest day.',
      duration: 5500,
      pane: 'work',
      transcript: ['Orders by day: Mon $612 · Tue $498 · Wed $735 · Thu $1,092 · Fri $780.', 'Time on the weekly summary: 6 min, down from 40.'],
      run(ctx) {
        ctx.at(0, () => ctx.scroll('@work', '@daily')); // phones: the pane scrolls to the chart (no-op on desktop)
        ctx.at(0, () => ctx.show('@daily'));
        ctx.at(250, () => ctx.grow('@daily-bar'));
        ctx.at(1150, () => ctx.cascade('@daily-val', { stagger: 60 }));
        ctx.at(500, () => ctx.show('@kpi'));
        ctx.at(800, () => ctx.all(ctx.countUp('@kpi-value'), ctx.draw('@kpi-spark')));
        ctx.at(1700, () => ctx.show('@kpi-delta'));
      },
    },
    {
      label: 'Approve',
      caption: 'Nothing is sent until the owner approves. Then each café gets its summary.',
      duration: 6000,
      pane: 'chat',
      transcript: ['Agent: Summary ready: $3,717 across 4 cafés. Totals match the sheet; #1043 counted once. Needs your OK.', 'Rosa approves. Sent 4:14 pm and logged.'],
      async run(ctx) {
        void ctx.swap('@st-work', '@st-wait');
        await ctx.reveal('@approval');
        await ctx.scroll('@chat-list', '@approval');
        await ctx.check('@chk', { spin: 350, stagger: 250 });
        await ctx.until(1900);
        await ctx.animate('@approve', [{ scale: '1' }, { scale: '1.05' }, { scale: '1' }], { duration: 300 });
        await ctx.click('@approve');
        await ctx.all(ctx.swap('@approval-btns', '@approval-sent'), ctx.swap('@st-wait', '@st-done'), ctx.swapText('@clock'));
        void ctx.ticker('Sent to 4 cafés · logged');
      },
    },
    {
      label: 'Result',
      caption: 'Result: a 40-minute weekly chore now takes 6, and nothing sends unchecked.',
      duration: 4500,
      async run(ctx) {
        await ctx.showResult();
      },
    },
  ],
});
