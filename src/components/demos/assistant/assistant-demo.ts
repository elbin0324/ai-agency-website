// Executive Assistant demo: the eight steps of content/DEMOS.md §3 (captions, timings and offsets as written).
// OWNER: demo-assistant. AssistantDemo.astro renders the FINAL state; this file animates from the start state.
// Both the component's frontmatter (chapters, captions, transcript) and its <script> import it.
import { defineDemo, type DemoContext } from '@/scripts/demo-engine';
import {
  bookingLog, bookingRule, briefing, categories, clockAt, deckSources, draft, drafted, event, fieldHoursCallout, kpis,
  laura, needsOrder, inbox, priorities, quality, segments, segmentsTotal, slides, slots, sources, tasks, tasksFoot,
  ticker, titleSlide, triageLog,
} from './data';

const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)'; // --ease-in-out-soft
const EASE_OUT = 'cubic-bezier(0.2, 0.7, 0.2, 1)'; // --ease-out-soft
const byId = new Map(inbox.map((m) => [m.id, m]));

/** Step 2: each inbox row slides left into the category labels (300 ms each, 60 ms stagger). */
function fileRows(ctx: DemoContext) {
  return ctx.all(
    ...ctx.els('in-row').map((row, i) =>
      ctx.after(i * 60, () =>
        ctx.animate(row, [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '-48px 0' }], { duration: 300, easing: EASE_IN_OUT, fill: 'forwards' }),
      ),
    ),
  );
}

/** Step 3: the other rows in Needs you get their chip ("Draft ready" or "Decision"), the reply subject and a
 *  sub-line in place of the preview (90 ms cascade). */
function markDrafted(ctx: DemoContext) {
  return ctx.all(
    ...ctx.els('row-did').map((did, i) =>
      ctx.after(i * 90, () => {
        const row = did.closest('.ea-row');
        const part = (name: string) => row?.querySelector<HTMLElement>(`[data-el="${name}"]`) ?? null;
        const subject = part('row-subj');
        return ctx.all(ctx.show(part('row-chip'), { effect: 'scale' }), ctx.swap(part('row-pre'), did), subject ? ctx.swapText(subject) : null);
      }),
    ),
  );
}

/** Distance from the top of a scroll box's content to `el`. Layout offsets ignore transforms, so a card that is
 *  still rising (`fade`: 6 px) measures where it will land, not where it is mid-animation. */
function offsetIn(box: HTMLElement, el: HTMLElement) {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== box) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return n === box ? y : el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
}

/** Scroll a pane's scroll box so `target` sits `pad` px below its top edge (the engine clamps the range). */
function scrollToTop(ctx: DemoContext, box: string, target: string, pad = 0, duration = 400) {
  const b = ctx.el(box);
  const t = ctx.el(target);
  if (!b || !t) return null;
  return ctx.scroll(b, Math.max(0, Math.round(offsetIn(b, t) - pad)), { duration });
}

/** Scroll a pane down just far enough that `target` (a CSS selector or '@name') shows in full with `pad` px to
 *  spare; a target taller than the pane shows its top. Never scrolls back up, and is a no-op when it already
 *  shows, so wide windows stay still while narrow ones follow the work. */
function follow(ctx: DemoContext, box: string, target: string, pad = 14, duration = 300) {
  const b = ctx.el(box);
  const t = target.startsWith('@') ? ctx.el(target.slice(1)) : ctx.$(target);
  if (!b || !t) return null;
  const top = offsetIn(b, t);
  const want = Math.round(Math.min(top - pad, top + t.offsetHeight + pad - b.clientHeight));
  return want > b.scrollTop + 1 ? ctx.scroll(b, want, { duration }) : null;
}

/** Step 6: one slide every 800 ms: 300 ms shimmer on its thumbnail, then the content fades in and shows large. */
async function buildSlide(ctx: DemoContext, n: number) {
  if (n > 1) ctx.removeClass(`@thumb-${n - 1}`, 'is-current');
  ctx.addClass(`@thumb-${n}`, 'is-current is-loading');
  await ctx.wait(300);
  ctx.removeClass(`@thumb-${n}`, 'is-loading');
  // The new slide wipes in over the previous one (later in the stack), so the area never shows two half slides.
  await ctx.all(ctx.show(`@thumb-art-${n}`, { effect: 'opacity' }), ctx.show(`@slide-${n}`, { effect: 'wipe', duration: 260 }));
  await ctx.hide(`@slide-${n - 1}`, { effect: 'none' });
}

/** Step 6: the presentation window shrinks back into the event card, then closes. */
async function closeDeck(ctx: DemoContext) {
  const deck = ctx.el('deck');
  const card = ctx.el('event');
  let frames: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];
  if (deck && card && card.getClientRects().length && !ctx.instant) {
    const d = deck.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const k = deck.offsetWidth ? d.width / deck.offsetWidth : 1; // the window may be scaled by its container
    const dx = (c.left + c.width / 2 - (d.left + d.width / 2)) / k;
    const dy = (c.top + c.height / 2 - (d.top + d.height / 2)) / k;
    const s = Math.max(0.1, Math.min(1, c.width / d.width));
    frames = [{ opacity: 1, translate: '0 0', scale: '1' }, { opacity: 0, translate: `${dx.toFixed(1)}px ${dy.toFixed(1)}px`, scale: s.toFixed(3) }];
  }
  await ctx.all(ctx.animate('@deck', frames, { duration: 350, easing: EASE_IN_OUT, fill: 'forwards' }), ctx.hide('@scrim', { duration: 350 }));
  await ctx.hide('@deck', { effect: 'none' });
}

export default defineDemo({
  id: 'assistant',
  steps: [
    {
      label: 'Inbox',
      caption: 'Monday, 7:30 am. The owner has 63 unread emails.',
      duration: 3500,
      pane: 'inbox',
      transcript: [
        `Mike Alvarez’s inbox: 63 unread. Newest first: ${inbox.map((m) => `${m.from}, “${m.subject}” (${m.time})`).join('; ')}. Plus 55 more unread.`,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.show('@open', { effect: 'opacity', duration: 300 }));
        ctx.at(250, () => ctx.cascade('@in-row'));
        ctx.at(1150, () => ctx.all(ctx.show('@in-more'), ctx.pulse('@inbox-badge')));
      },
    },
    {
      label: 'Triage',
      caption: 'The agent reads all 63 and sorts them by what each one needs.',
      duration: 5000,
      pane: 'inbox',
      transcript: [
        `Sorted: ${categories.map((c) => `${c.label} ${c.count} (${c.what.charAt(0).toLowerCase()}${c.what.slice(1)})`).join(' · ')}. Total 63.`,
        `Needs you · 6, in priority order: ${needsOrder.map((id) => byId.get(id)?.from).join(', ')}.`,
        `Log: ${triageLog}.`,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swapText('@clock', clockAt('7:31')), ctx.show('@st-work')));
        ctx.at(0, () => ctx.all(ctx.show('@cats-label'), ctx.cascade('@cat', { stagger: 60 }), ctx.cascade('@chip', { stagger: 60 })));
        ctx.at(300, () => ctx.hide('@in-more'));
        ctx.at(350, () => fileRows(ctx));
        ctx.at(500, () => ctx.countUp('@cat-count'));
        ctx.at(500, async () => {
          await ctx.countUp('@inbox-count', { duration: 900 });
          ctx.removeClass('@inbox-badge'); // 6 left, and all 6 need Mike: the count turns sky
        });
        ctx.at(1150, () => ctx.swap('@head-inbox', '@head-needs'));
        ctx.at(1150, async () => {
          await ctx.hide('@list-inbox', { effect: 'none' });
          await ctx.show('@list-needs', { effect: 'none' });
          await ctx.cascade('@need-row');
        });
        ctx.at(1950, async () => {
          await ctx.swap('@skel', '@act');
          await ctx.check('@act-check');
        });
        ctx.at(2000, () => ctx.ticker(ticker.triage));
      },
    },
    {
      label: 'Drafts',
      caption: 'It drafts replies in Mike’s voice, using job history and his calendar.',
      duration: 7000,
      pane: 'inbox',
      transcript: [
        `Laura Chen, ${laura.from.replace('Laura Chen, ', '')}: “${laura.body}”`,
        `Draft reply, not sent: “${draft.map((p) => p.join(' ')).join(' ')}”`,
        `Sources: ${sources.map((s) => `${s.key}: ${s.text}`).join(' · ')}.`,
        ...needsOrder.slice(1).map((id) => {
          const d = drafted[id];
          return d ? `${byId.get(id)?.from} · ${d.thread}: ${d.chip}. ${d.sub}` : '';
        }),
      ],
      run(ctx) {
        ctx.at(0, () => {
          ctx.addClass('@laura-row');
          return ctx.swap('@laura-pre', '@reading');
        });
        // The view follows the work: Laura's row and her whole email stay in view while the draft starts; each
        // paragraph scrolls into view as it begins (wide panes rarely need to move), then the footer, the
        // sources (under the draft on narrow panes) and finally the five other rows.
        const para = (n: number) => () => follow(ctx, 'list-scroll', `[data-el="draft-body"] > [data-cue="p${n}"]`);
        ctx.at(700, () => ctx.show('@draft'));
        ctx.at(750, () =>
          ctx.stream('@draft-body', {
            speed: 25,
            cues: { p2: para(2), p3: para(3), p4: para(4), p5: () => follow(ctx, 'list-scroll', '@draft-foot') },
          }),
        );
        ctx.at(2800, () => ctx.show('@draft-foot'));
        ctx.at(2900, () => ctx.ticker(ticker.drafts));
        ctx.at(3400, () => ctx.all(ctx.cascade('@src'), follow(ctx, 'list-scroll', '.ea-srcs', 14, 400)));
        ctx.at(4200, () => ctx.scroll('@list-scroll', 'bottom'));
        ctx.at(4300, () => markDrafted(ctx));
        ctx.at(4950, () => ctx.scroll('@list-scroll', 'bottom', { duration: 300 })); // narrow panes: sub-lines wrap and the list grows
      },
    },
    {
      label: 'Tasks',
      caption: 'Action items become tasks for the right people, with due dates.',
      duration: 5500,
      pane: 'assistant',
      transcript: [...tasks.map((t) => `${t.who}: ${t.task}. Due ${t.due}. From: ${t.from}`), `${tasksFoot}.`],
      run(ctx) {
        ctx.at(0, () => ctx.swapText('@clock', clockAt('7:32')));
        ctx.at(0, () => ctx.all(ctx.show('@tasks'), scrollToTop(ctx, 'side-scroll', 'tasks', 2)));
        ctx.at(300, () => ctx.cascade('@task', { stagger: 120 }));
        ctx.at(1150, () => ctx.show('@tasks-foot'));
        ctx.at(1300, () => ctx.ticker(ticker.tasks));
      },
    },
    {
      label: 'Schedule',
      caption: 'Jorge asked for a Q3 review. It finds an hour that works for all six.',
      duration: 4500,
      pane: 'assistant',
      transcript: [
        `Find a time · Q3 Operations Review · 60 min · 6 people: ${slots.map((s) => `${s.when}, ${s.free} of 6 free${s.note ? ` (${s.note})` : ' · Booked'}`).join('; ')}.`,
        `${event.title}: ${event.when}. ${event.people}. Attachment: ${event.building}.`,
        `${bookingLog.text} ${bookingLog.quote} ${bookingRule}.`,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.show('@cal'), scrollToTop(ctx, 'side-scroll', 'cal', 2)));
        ctx.at(300, () => ctx.cascade('@slot'));
        ctx.at(900, () => ctx.all(ctx.highlight('@slot-thu'), ctx.show('@booked')));
        ctx.at(1250, async () => {
          await ctx.show('@event', { effect: 'none' });
          await ctx.animate('@event', [{ opacity: 0, translate: '0 -8px' }, { opacity: 1, translate: '0 0' }], { duration: 250, easing: EASE_OUT });
        });
        // Bring the log line and the rule chip into view (and the card's bottom edge, 14 px below the chip).
        ctx.at(1500, () => follow(ctx, 'side-scroll', '.ea-rule', 16, 350));
        ctx.at(1600, () => ctx.cascade('@cal-log'));
        ctx.at(1700, () => ctx.ticker(ticker.booked));
      },
    },
    {
      label: 'Deck',
      caption: 'It builds the Q3 deck on the company template. Six slides.',
      duration: 7000,
      pane: 'assistant',
      transcript: [
        `Sources: ${deckSources.map((s) => s.text).join('; ')}.`,
        `Slide 1, ${slides[0].title}: ${titleSlide.sub}.`,
        `Slide 2, ${slides[1].title}: ${kpis.map((k) => `${k.label} ${k.value}${k.delta ? ` (${k.delta} ${k.deltaNote})` : ''}`).join(' · ')}.`,
        `Slide 3, ${slides[2].title}: ${segments.map((s) => `${s.label} $${s.value}K`).join(' · ')}. Total $${segmentsTotal.toLocaleString('en-US')}K.`,
        `Slide 4, ${slides[3].title}: Jul 3,020 vs 2,900 · Aug 3,140 vs 2,950 · Sep 2,860 vs 2,800 hours, actual vs. budget. ${fieldHoursCallout}`,
        `Slide 5, ${slides[4].title}: ${quality.map((q) => `${q.label}: ${q.value}`).join(' · ')}.`,
        `Slide 6, ${slides[5].title}: ${priorities.join(' · ')}.`,
        `Attachment: ${event.done} ✓.`,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swapText('@clock', clockAt('7:33')), ctx.show('@scrim', { effect: 'opacity' }), ctx.reveal('@deck')));
        // One slide every 800 ms from +150 (slide 6 lands at +4,710); "6 slides" as it lands, a beat on the
        // finished deck, then it shrinks into the event card (+5,100 to +5,450). Reading hold: 1.25 s.
        ctx.at(150, () => ctx.cascade('@deck-src'));
        for (let n = 1; n <= slides.length; n++) ctx.at(150 + (n - 1) * 800, () => buildSlide(ctx, n));
        ctx.at(4750, () => ctx.swap('@deck-run', '@deck-done'));
        ctx.at(5100, () => closeDeck(ctx));
        ctx.at(5450, () => ctx.all(ctx.swapText('@attach'), ctx.show('@attach-ok', { effect: 'scale' }), ctx.show('@thumbs')));
        ctx.at(5450, () => scrollToTop(ctx, 'side-scroll', 'event', 2, 300)); // the event card, its log line and the six slides
        ctx.at(5500, () => ctx.ticker(ticker.deck));
      },
    },
    {
      label: 'Briefing',
      caption: 'By 7:34 am, Mike has a one-screen briefing and six decisions.',
      duration: 5000,
      pane: 'assistant',
      transcript: [`${briefing.title} · ${briefing.when}`, ...briefing.lines.map((l) => `${l.lead} ${l.text}`)],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swapText('@clock'), ctx.swap('@st-work', '@st-wait')));
        ctx.at(0, async () => {
          await ctx.scroll('@side-scroll', 'top');
          await ctx.hide('@finder', { effect: 'none' }); // the slot finder folds away once the meeting is booked
        });
        ctx.at(300, () => ctx.swap('@act', '@brief'));
        ctx.at(550, () => ctx.cascade('@brief-line'));
        ctx.at(1000, () => ctx.ticker(ticker.final));
      },
    },
    {
      label: 'Result',
      caption: 'Four minutes of agent time. Almost an hour back for Mike.',
      duration: 4000,
      run: (ctx) => ctx.showResult(),
    },
  ],
});
