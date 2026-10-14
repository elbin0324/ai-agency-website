// Customer Agent demo: steps, captions and choreography (content/DEMOS.md §1, DEMO_ENGINE.md).
// OWNER: demo-customer. The markup (final state) lives in CustomerChat.astro + AgentConsole.astro.
//
// Every caption, message and number is DEMOS.md §1 copy. Offsets map 1:1 to ctx.at(ms, …) from each step's
// start. Two deliberate timing notes, both to keep DESIGN.md §9.5's 1.2 s reading hold:
//  - Step 2 types at 17 ms/char after a 200 ms pause (DEMOS.md `type`: 18 ms after 300 ms); at full spec
//    159 characters leave a 1.08 s hold.
//  - Step 5's pointer starts moving at +2,250 ms, so the press lands just before the storyboard's +3,000 ms.
// Purely decorative finishes (the last check spin, the price-row pulse) run untracked so they never
// shorten the hold.
//
// Phones: no step sets `pane`. Every step's story lands in the chat (the default tab), and the console's
// latest action shows in the ticker, so a visitor who opens "Agent console" stays there until they switch back.
import { defineDemo, type DemoContext } from '@/scripts/demo-engine';
import type { ResultCardProps } from '@/components/demo/types';

/** Context slot: crossfade one card to the next. Cards are ghosts (space kept), so the slot never jumps. */
function card(ctx: DemoContext, from: string, to: string, duration = 250) {
  return ctx.all(ctx.hide(from, { keepSpace: true, duration }), ctx.show(to, { effect: 'opacity', duration }));
}

/** One action row in the console timeline: fade in, spin, tick (DEMOS.md `cascade` + `check`). */
function act(ctx: DemoContext, n: number, ticker?: string, track = true) {
  const tick = ctx.check(`[data-el="act-${n}"] [data-check]`);
  return ctx.all(ctx.show(`@act-${n}`), ticker ? ctx.ticker(ticker) : undefined, track ? tick : undefined);
}

export default defineDemo({
  id: 'customer',
  steps: [
    {
      label: 'Greeting',
      caption: '9:47 pm. The office is closed. A homeowner opens the website chat.',
      duration: 3500,
      transcript: [
        'AI assistant: Hi! I’m Larkfield’s AI assistant. I can answer questions, give price ranges and book service, day or night. What’s going on?',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.show('@fade-in', { effect: 'opacity', duration: 250 }), ctx.reveal('@widget')));
        ctx.at(600, () => ctx.reply('@m-greet', { dots: 700 }));
      },
    },
    {
      label: 'Question',
      caption: 'She describes a noisy AC and asks about price and timing.',
      duration: 4500,
      transcript: [
        'Jenna: Hi, my AC started making a loud buzzing noise this afternoon. It’s still cooling but it’s loud. How much to have someone look at it, and how soon can you come?',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.send('@composer', '@m-jenna-1', { speed: 17, delay: 200, pause: 60 }));
      },
    },
    {
      label: 'Safety',
      caption: 'Safety check first. Then two questions a good dispatcher would ask.',
      duration: 5500,
      transcript: [
        'Agent console: Ran safety check. Buzzing can be electrical: asked about smell, smoke, sparks.',
        'Escalation rule · Safety. If the customer reports a burning smell, smoke, sparks, or water near electrical parts: tell them to switch the system off, call tonight’s on-call technician (Luis P.) and send him the transcript. Status: checking.',
        'AI assistant: Sorry about that. Let’s get it sorted. First, a quick safety check: any burning smell, smoke or sparks near the unit? Then two questions so we send the right tech with the right parts: 1. Is the noise coming from the outdoor unit or from inside the house? 2. When the system kicks on, does the fan on top of the outdoor unit start spinning right away?',
      ],
      run(ctx) {
        ctx.at(0, async () => {
          void card(ctx, '@ctx-empty', '@card-safety');
          await ctx.hide('@act-empty', { duration: 150 });
          await act(ctx, 1, 'Ran safety check');
        });
        ctx.at(400, () => ctx.reply('@m-safety', { dots: 600 }));
      },
    },
    {
      label: 'Quote',
      caption: 'No red flags. It quotes from Larkfield’s own price book, not a guess.',
      duration: 6500,
      transcript: [
        'Jenna: No smell or smoke. It’s the outdoor unit. It buzzes for a few seconds when it kicks on and the fan is slow to start. The system is about 9 years old.',
        'Agent console: Safety rule not triggered (no smell, smoke or sparks reported). Looked up the residential price book: Diagnostic visit $89, credited to the repair · Capacitor replacement $165–$245 · Contactor replacement $185–$265 · After-hours visit fee +$149.',
        'AI assistant: Thanks, that helps. A buzz at start-up with a slow fan usually points to a weak capacitor or contactor: a common repair, usually done in one visit. From our price book: Diagnostic visit: $89, credited toward the repair. Capacitor or contactor replacement: $165–$265 total. Since it’s still cooling, a regular visit tomorrow avoids our $149 after-hours fee.',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.send('@composer', '@m-jenna-2', { fast: true, pause: 60 }));
        ctx.at(2000, async () => {
          void ctx.swapText('@clock', 'Tue 9:48 pm');
          void act(ctx, 2, 'Safety rule: not triggered');
          await ctx.swap('@safety-checking', '@safety-ok');
          await ctx.pulse('@safety-status');
        });
        ctx.at(2500, async () => {
          void act(ctx, 3, 'Looked up price book · 4 items');
          await card(ctx, '@card-safety', '@card-price');
          await ctx.cascade('[data-el="card-price"] [data-ghost]');
        });
        ctx.at(3000, () =>
          ctx.reply('@m-quote', {
            dots: 400,
            // The two quoted rows pulse as "$165–$265" lands (DEMOS.md step 4). Untracked: decorative.
            cues: { range: () => void ctx.pulse('[data-el="card-price"] .is-quoted') },
          }),
        );
      },
    },
    {
      label: 'Calendar',
      caption: 'It checks the live dispatch calendar and offers real openings.',
      duration: 4500,
      transcript: [
        'Agent console: Checked the dispatch calendar for Wed, Jul 15: 2 open windows (Marcus R. 8:00–10:00 am, Alicia T. 1:00–3:00 pm).',
        'AI assistant: I can get a technician to you tomorrow, Wednesday, July 15. Which window works best? Options: 8:00–10:00 am · 1:00–3:00 pm · Another day.',
        'Jenna taps 8:00–10:00 am.',
      ],
      run(ctx) {
        ctx.at(0, async () => {
          void act(ctx, 4, 'Checked dispatch calendar · 2 open windows');
          await card(ctx, '@card-price', '@card-cal');
          await ctx.pulse('[data-el="card-cal"] .is-open');
        });
        ctx.at(600, async () => {
          await ctx.stream('@m-slots');
          await ctx.show('@qr-row', { effect: 'none' });
          await ctx.cascade('[data-el="qr-row"] [data-hide]');
        });
        ctx.at(2250, async () => {
          await ctx.click('@qr-pick');
          await ctx.all(ctx.hide('@qr-row', { duration: 150 }), ctx.show('@m-pick', { effect: 'rise', duration: 200 }));
        });
      },
    },
    {
      label: 'Booking',
      caption: 'Name, address and mobile number. The job is booked.',
      duration: 5000,
      transcript: [
        'AI assistant: Perfect. What’s your full name, the service address and a mobile number for text updates?',
        'Jenna: Jenna Morales, 418 Larkspur Lane, (480) 555-0148',
        'Agent console: Created booking #BK-4127 · Marcus R. · Wed 8–10 am.',
        'Booking card: You’re booked. AC repair · Diagnostic visit. Wed, Jul 15 · 8:00–10:00 am. Technician: Marcus R. 418 Larkspur Lane. Capacitor or contactor: $165–$265 total, $89 diagnostic credited. Your technician confirms the price before any work starts.',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.reply('@m-ask', { dots: 400 }));
        ctx.at(1300, () => ctx.send('@composer', '@m-jenna-3', { pause: 60 }));
        ctx.at(2800, () =>
          ctx.all(ctx.swapText('@clock', 'Tue 9:49 pm'), act(ctx, 5, 'Created booking #BK-4127'), ctx.show('@m-booked')),
        );
      },
    },
    {
      label: 'Confirm',
      caption: 'A text confirmation goes out, and the customer record is updated.',
      duration: 4500,
      transcript: [
        'AI assistant: I’ve texted you a confirmation, and Marcus will text when he’s on his way. Tonight, if you notice a burning smell or the buzzing won’t stop, switch the system off at the thermostat and reply here. I’ll get our on-call technician on the phone.',
        'Text message from Larkfield Plumbing & Air: Hi Jenna, you’re confirmed for AC repair Wed 7/15, 8–10 am with Marcus R. Your $89 diagnostic is credited to any repair. Reply R to reschedule. Reply STOP to opt out.',
        'Agent console: Sent text confirmation to (480) 555-0148 · Updated customer record in the scheduling system (new customer) · Tagged: AC repair, After-hours, Plan prospect.',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.reply('@m-sent', { dots: 400 }));
        ctx.at(1200, () => ctx.show('@sms', { effect: 'rise', duration: 300 }));
        ctx.at(1500, () => act(ctx, 6, 'Sent text confirmation'));
        ctx.at(2000, () => act(ctx, 7, 'Updated customer record'));
        ctx.at(2500, () =>
          ctx.all(act(ctx, 8, 'Tagged: AC repair · After-hours · Plan prospect'), ctx.cascade('[data-el="act-8"] .ca-tag[data-ghost]', { delay: 150 })),
        );
        ctx.at(2700, () => card(ctx, '@card-cal', '@card-record'));
      },
    },
    {
      label: 'Handoff',
      caption: 'A question it shouldn’t answer goes to a person, with full context.',
      duration: 5000,
      transcript: [
        'Jenna: Thanks! Since it’s 9 years old, do you offer financing if we end up replacing it?',
        'Handoff rule · Sales and financing. If the customer asks about financing, a new system, or a quote over $1,500: don’t quote. Book a callback with the office manager and attach the transcript. Status: triggered, callback task created for Renee K.',
        'AI assistant: Good question. Financing depends on the system and the plan you choose, so I’ve asked Renee, our office manager, to call you tomorrow by 10 am. She’ll have this conversation in front of her, so you won’t need to repeat anything.',
        'Agent console: Handed off to a person. Financing question → Renee K., office manager · callback Wed by 10 am · transcript attached. Tag added: Replacement lead.',
      ],
      run(ctx) {
        ctx.at(0, () => ctx.send('@composer', '@m-jenna-4', { fast: true, pause: 60 }));
        ctx.at(1600, async () => {
          void ctx.swapText('@clock');
          await card(ctx, '@card-record', '@card-handoff');
          await ctx.all(ctx.swap('@handoff-checking', '@handoff-on'), ctx.show('@handoff-note'));
          await ctx.pulse('@handoff-status');
        });
        ctx.at(2000, () => ctx.reply('@m-handoff', { dots: 400 }));
        ctx.at(3400, () => {
          // The check finishes during the reading hold (untracked), so the hold stays above 1.2 s.
          void act(ctx, 9, 'Handed off to Renee K. · callback Wed by 10 am', false);
          void ctx.show('[data-el="act-8"] .ca-tag--new');
          void ctx.show('@rec-callback');
          void ctx.show('[data-el="card-record"] .ca-tag--new');
        });
      },
    },
    {
      label: 'Result',
      caption: 'Booked in 2 minutes, after hours, with zero office time.',
      duration: 4000,
      run(ctx) {
        // Settle the console into its final layout (record card plus the two rules, DEMOS.md "Reduced-motion
        // final state"). On desktop this happens under the result card; on phones the chat pane is showing.
        ctx.at(0, () => ctx.showResult());
        ctx.at(0, async () => {
          await ctx.all(card(ctx, '@card-handoff', '@card-record', 200), ctx.show('@rules', { effect: 'opacity', duration: 200 }));
          await ctx.scroll('@acts', 'bottom', { duration: 200 });
        });
      },
    },
  ],
});

// Source ids (cx-20, pnl-16) never break at their hyphen: a word joiner (U+2060) follows it, as in the
// Consulting demo. The ids resolve on /results/ (src/data/benchmarks.ts).
const ids = (s: string) => s.replace(/\b([a-z]+)-(\d+)\b/g, '$1-\u2060$2');

/** Result card (DEMOS.md §1 "Result card · Illustrative example"): values, labels and basis lines verbatim. */
export const result: ResultCardProps = {
  label: 'Illustrative example',
  metrics: [
    {
      value: '2',
      unit: 'min',
      label: 'First message to confirmed booking',
      basis: ids('First message 9:47 pm, booked 9:49 pm; first reply in 2 seconds vs a typical ~60 min web reply (cx-20, cx-18).'),
    },
    {
      value: '0',
      unit: 'min',
      label: 'Office time to book, confirm and log',
      basis: ids('vs about 5 staff minutes by phone the next morning (cx-34), if the customer hasn’t booked elsewhere by then.'),
    },
    {
      value: '$215',
      label: 'Estimated job value',
      basis: ids('Midpoint of the quoted $165⁠–⁠$265; about $86 gross profit at a 40% service-job margin (cx-28, pnl-16).'),
    },
  ],
};
