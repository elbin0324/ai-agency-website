// Sales Agent demo: steps, captions and choreography (content/DEMOS.md §5, DEMO_ENGINE.md). OWNER: demo-sales.
// SalesDemo.astro renders the FINAL state; start states live in data attributes. Both the component's
// frontmatter (chapters, captions, transcript) and its <script> (behavior) import this file.
// DEMOS.md offsets ("+2,800 ms") map to ctx.at(ms, fn) from the step start, with one change: since 2026-10-14
// (founder: "the Sales demo feels slow") every step runs 25–31% shorter than DEMOS.md §5 lists (43.0 s -> 31.0 s),
// offsets are scaled to match, the email streams at 12 ms a word (was 20) and checks, staggers and pointer moves are
// quicker. Every step still ends on a reading hold of about 1.3 s or more (the engine's floor is 1.2 s, and slow
// frames eat into it), and each caption stays up 2.9 s or more (the last one then holds with the result card).
import { defineDemo, type DemoContext } from '@/scripts/demo-engine';
import { approval, dossier, emailA, emailB, followUp, icp, meta, prospects, quality, search, why } from './data';

const EASE_OUT = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
const SLIDE = 'calc(-100% - var(--sa-gap, 20px)) 0'; // overlay Email B starts where the draft sat

/** Desktop layout (three panes side by side); phones show one pane at a time (DESIGN.md §6.10). */
const isDesktop = () => window.matchMedia('(width >= 48rem)').matches;

/** A counter that ticks up evenly (countUp eases out), so "n of 10" keeps pace with the segments beside it. */
function countTo(ctx: DemoContext, target: string, total: number, ms: number) {
  const el = ctx.$(`[data-el="${target.slice(1)}"]`);
  return ctx.tween(ms, (k) => {
    if (el) el.textContent = String(Math.min(total, Math.floor(k * total + 0.0001)));
  });
}

/** Step 2, +0: the profile card folds into filter chips so the list fits (phones always show the chips). */
async function foldProfile(ctx: DemoContext) {
  await ctx.animate('@icp-lines', [{ opacity: 1 }, { opacity: 0 }], { duration: 130 });
  ctx.addClass('@icp'); // data-final-class="is-folded"
  await ctx.cascade('@icp-chip', { stagger: 40 });
}

/** Step 2, +1,740 ms: select Hollis & Grant and open "Why 94" beside the row (it stays open into step 3). */
async function pickProspect(ctx: DemoContext) {
  const row = ctx.$('[data-pick]');
  const pop = ctx.el('why');
  const scene = ctx.$('[data-demo-scene="main"]');
  if (row && pop && scene && isDesktop()) {
    const top = row.getBoundingClientRect().top - scene.getBoundingClientRect().top;
    pop.style.setProperty('--why-top', `${Math.max(8, Math.round(top - 6))}px`);
  }
  await ctx.all(ctx.highlight('[data-pick]'), ctx.reveal('@why'));
}

/** Step 3: one dossier row arrives, then its source is verified (spinner, then the check). */
async function verifyFact(ctx: DemoContext, i: number) {
  const row = ctx.els('fact')[i];
  if (!row) return;
  await ctx.show(row);
  await ctx.check(row.querySelector('.demo-check'), { spin: 260 });
}

/** Markers land one by one; each claim is highlighted with a marker-pen sweep and its note appears. */
async function markClaims(ctx: DemoContext, prefix: 'a' | 'b') {
  const marks = ctx.els(`${prefix}-mk`);
  const claims = ctx.els(`${prefix}-claim`);
  const notes = ctx.els(`${prefix}-note`);
  await ctx.all(
    ...marks.map((mk, i) =>
      ctx.after(i * 110, () => {
        const claim = claims[i];
        if (claim) ctx.addClass(claim);
        return ctx.all(
          ctx.show(mk, { effect: 'scale' }),
          claim ? ctx.animate(claim, [{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], { duration: 360, easing: EASE_OUT }) : null,
          notes[i] ? ctx.show(notes[i]) : null,
        );
      }),
    ),
  );
}

/** Step 4, +1,800 ms: the stream has ended, so the pane stops following new lines and returns to the subject line
 *  before the markers land. Phones show about half the email; without this, the subject, "Hi Dana," and fact 1 (the
 *  Riverside office, the trigger the page is built around) scroll away unseen and marker 1 draws off-screen.
 *  Every show() (the markers, the notes) follows its [data-autoscroll] box and would pull the pane straight back
 *  down, so the pane drops data-autoscroll first. Reset rebuilds the scene, so every replay follows the stream again. */
function backToTop(ctx: DemoContext) {
  const pane = ctx.el('work-pane');
  if (!pane) return;
  pane.removeAttribute('data-autoscroll');
  return ctx.scroll(pane, 'top', { duration: 250 });
}

/** Step 5: the toggle opens the comparison. Email B slides right, Email A fades in on the left. */
async function openCompare(ctx: DemoContext) {
  const pane = ctx.el('work-pane');
  if (pane && pane.scrollTop > 0) await ctx.scroll(pane, 'top', { duration: 250 });
  await ctx.click('@seg-a', { move: 280, press: 120 });
  ctx.toggleClass('@seg-b', 'is-on', false);
  ctx.toggleClass('@seg-a', 'is-on', true);
  await ctx.all(
    ctx.show('@compare', { effect: 'opacity', duration: 180 }),
    ctx.animate('@cmp-b', [{ translate: SLIDE }, { translate: '0 0' }], { duration: 260, easing: EASE_OUT }),
    ctx.show('@cmp-a', { duration: 260, delay: 100 }),
  );
}

/** Step 6, +0: the overlay closes and Email B returns to the center. */
async function closeCompare(ctx: DemoContext) {
  ctx.toggleClass('@seg-a', 'is-on', false);
  ctx.toggleClass('@seg-b', 'is-on', true);
  await ctx.all(
    ctx.animate('@cmp-b', [{ translate: '0 0' }, { translate: SLIDE }], { duration: 250, easing: EASE_OUT, fill: 'forwards' }),
    ctx.hide('@compare', { duration: 250 }),
  );
}

/** Step 6: one quality-check line arrives and passes. */
async function passCheck(ctx: DemoContext, i: number) {
  const line = ctx.els('qc-line')[i];
  if (!line) return;
  await ctx.show(line);
  await ctx.check(line.querySelector('.demo-check'), { spin: 220 });
  ctx.setText('@qc-count', String(i + 1));
}

/** Step 7, +0: the finished checklist folds to its summary line so the approval card has room. */
async function foldChecks(ctx: DemoContext) {
  await ctx.animate('@qc-body', [{ opacity: 1 }, { opacity: 0 }], { duration: 140 });
  ctx.addClass('@qc'); // data-final-class="is-folded"
}

/** Step 7, +800 ms: the buttons collapse into the approved line; the schedule, queue and CRM lines follow
 *  (their list, divider included, appears with the first line rather than as an empty rule beforehand). */
async function approve(ctx: DemoContext) {
  await ctx.all(
    ctx.swap('@ap-btns', '@ap-ok', { duration: 200 }),
    ctx.swap('@st-wait', '@st-done', { duration: 200 }),
    ctx.ticker('Approved by Sam · scheduled for 7:40 am'),
  );
  await ctx.show('@ap-rows', { effect: 'none' });
  await ctx.all(ctx.cascade('@ap-row', { stagger: 60, duration: 200 }), ctx.after(100, () => ctx.grow('@ap-meter', { duration: 380 })));
}

const emailBText = [
  `From: ${emailB.from} · To: ${emailB.to} · Subject: ${emailB.subject}`,
  'Hi Dana, Congratulations on opening the Riverside office last month. I noticed the office manager role you posted includes “handling IT and vendor relationships.” At a two-office firm, that usually turns into password resets, laptop setups and quietly wondering whether last night’s backup ran. We look after IT for 11 law and accounting offices in the county, including secure remote access for attorneys who split time between locations. Would it help if I sent the one-page checklist we use when a firm opens a second office? No call needed.',
  `${emailB.signature.name} · ${emailB.signature.address} · ${emailB.signature.optOut}`,
  `Sources: ${emailB.notes.map((n, i) => `${i + 1}. ${n}`).join(' · ')}`,
];

const emailAText = [
  `Subject: ${emailA.subject}`,
  'Hi Dana, I hope this email finds you well! I came across Hollis & Grant and was really impressed by your firm’s commitment to excellence and client satisfaction. At Parkline IT, we provide innovative, end-to-end managed IT solutions that help businesses like yours streamline operations, enhance security and drive growth. Our team of experts is passionate about delivering world-class service tailored to your unique needs. I’d love to set up a quick 15-minute call to explore how we can add value to your organization. Are you available this Thursday or Friday? Looking forward to connecting! Best regards, Sam',
  `Problems: ${emailA.notes.map((n, i) => `${i + 1}. ${n}`).join(' · ')}`,
];

export default defineDemo({
  id: 'sales',
  steps: [
    {
      label: 'Profile',
      caption: 'Parkline IT wants more law and accounting firms. First, the profile.',
      duration: 3000,
      pane: 'list',
      transcript: [`${icp.title}. ${icp.lines.map((l) => `${l.k}: ${l.v}.`).join(' ')}`],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.show('@icp'), ctx.show('@st-run')));
        ctx.at(180, () => ctx.cascade('@icp-line', { stagger: 70, duration: 220 }));
        ctx.at(600, () => ctx.ticker('Profile set: law and accounting firms, 10–50 staff'));
      },
    },
    {
      label: 'Match',
      caption: 'Matching firms, scored. Three are skipped: no real reason to write.',
      duration: 3300,
      pane: 'list',
      transcript: [
        search.line,
        ...prospects.map((p) => `Fit ${p.fit}: ${p.firm}, ${meta(p)}. ${p.signal}.`),
        `${search.skipped}.`,
        `${why.title}: ${why.items.join('; ')}.`,
      ],
      run(ctx) {
        ctx.at(0, () => foldProfile(ctx));
        ctx.at(200, () => ctx.all(ctx.show('@stats'), ctx.countUp('@searched', { duration: 480 })));
        ctx.at(400, () => ctx.cascade('@row', { stagger: 60 }));
        ctx.at(440, () => ctx.all(ctx.grow('@fit-bar', { stagger: 60, duration: 420 }), ctx.countUp('@fit-n', { duration: 520 })));
        ctx.at(1000, () => ctx.show('@skip'));
        ctx.at(1050, () => ctx.scroll('@list-pane', '@skip', { duration: 280 }));
        ctx.at(1530, () => ctx.scroll('@list-pane', '[data-pick]', { duration: 200 }));
        ctx.at(1740, () => ctx.all(pickProspect(ctx), ctx.ticker('8 firms match · 3 skipped, no reason to write')));
      },
    },
    {
      label: 'Research',
      caption: 'Deep research on the top prospect: five facts, each with a source.',
      duration: 4500,
      pane: 'work',
      transcript: [
        `${dossier.label}. ${dossier.person}, ${dossier.role}. 10-point check: ${dossier.check}.`,
        ...dossier.facts.map((f, i) => `${i + 1}. ${f.fact} Source: ${f.source}. Use: ${f.use}. Verified.`),
        `${dossier.excluded.fact}. ${dossier.excluded.note}.`,
        `Also checked: ${dossier.alsoChecked}.`,
        `Reason to write now: ${dossier.reason}`,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swap('@work-wait', '@dossier'), ctx.swapText('@st-run-text', 'Researching')));
        // "Why 94" stays readable a moment longer, and closes before the first fact lands beside it.
        ctx.at(250, () => ctx.hide('@why'));
        ctx.at(200, () => ctx.all(countTo(ctx, '@dz-count', dossier.checkTotal, 2300), ctx.cascade('@dz-seg', { effect: 'opacity', stagger: 230, duration: 200 })));
        dossier.facts.forEach((_, i) => ctx.at(300 + i * 400, () => verifyFact(ctx, i)));
        ctx.at(2250, () => ctx.show('@fact-out'));
        ctx.at(2500, () => ctx.show('@also'));
        ctx.at(2750, () => ctx.reveal('@reason'));
        ctx.at(2850, () => ctx.ticker('Dossier: 5 facts verified, 1 left out'));
      },
    },
    {
      label: 'Draft',
      caption: 'An 89-word email built on what it found. Specific, no fluff.',
      duration: 4300,
      pane: 'work',
      transcript: emailBText,
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swap('@dossier', '@draft'), ctx.scroll('@work-pane', 'top', { duration: 200 }), ctx.swapText('@st-run-text', 'Writing')));
        ctx.at(180, () => ctx.cascade('[data-el="b-rows"], [data-el="b-subject"]', { stagger: 90 }));
        ctx.at(420, () => ctx.all(ctx.stream('@b-body', { speed: 12 }), ctx.countUp('@wc', { duration: 1300 })));
        ctx.at(1800, () => backToTop(ctx));
        ctx.at(2060, () => markClaims(ctx, 'b'));
        ctx.at(2600, () => ctx.all(ctx.swap('@st-run', '@st-draft'), ctx.ticker(`Draft ready: ${emailB.words} words, every claim sourced`)));
        ctx.at(2700, () => ctx.scroll('@work-pane', '@b-notes', { duration: 250 }));
      },
    },
    {
      label: 'Compare',
      caption: 'Next to a generic AI email: one could go to anyone. One couldn’t.',
      duration: 4000,
      pane: 'work',
      transcript: emailAText,
      run(ctx) {
        ctx.at(0, () => openCompare(ctx));
        ctx.at(1050, () => markClaims(ctx, 'a'));
        ctx.at(1100, () => ctx.ticker('Same prospect: the generic AI email, marked'));
      },
    },
    {
      label: 'Check',
      caption: 'Every email passes five quality checks before anyone approves it.',
      duration: 3300,
      pane: 'check',
      transcript: [
        `${quality.title} · ${quality.passed} of ${quality.passed} passed.`,
        ...quality.checks.map((c) => `${c.k}: ${c.v}.`),
        `${quality.ready}.`,
      ],
      run(ctx) {
        ctx.at(0, () => closeCompare(ctx));
        ctx.at(200, () => ctx.all(ctx.swap('@check-wait', '@qc'), ctx.swap('@st-draft', '@st-run'), ctx.swapText('@st-run-text', 'Checking')));
        quality.checks.forEach((_, i) => ctx.at(340 + i * 190, () => passCheck(ctx, i)));
        ctx.at(1700, () => ctx.all(ctx.show('@qc-ready'), ctx.swap('@st-run', '@st-wait'), ctx.ticker('5 of 5 checks passed · waiting on Sam')));
      },
    },
    {
      label: 'Approve',
      caption: 'Sam approves. It’s scheduled for 7:40 am, Dana’s time.',
      duration: 2900,
      pane: 'check',
      transcript: [
        `${approval.title}: Approve, Edit or Skip.`,
        `${approval.approved}.`,
        `${approval.scheduled.k}: ${approval.scheduled.v}.`,
        `${approval.queue.k}: ${approval.queue.v}.`,
        `${approval.crm.k}: ${approval.crm.v}.`,
      ],
      run(ctx) {
        ctx.at(0, () => foldChecks(ctx));
        ctx.at(130, () => ctx.show('@approval'));
        ctx.at(420, () => ctx.click('@approve', { move: 260, press: 120 }));
        ctx.at(800, () => approve(ctx));
      },
    },
    {
      label: 'Follow-up',
      caption: 'Follow-ups are planned, and stop the moment she replies.',
      duration: 2900,
      pane: 'check',
      transcript: [
        `${followUp.title}, ${followUp.condition}:`,
        ...followUp.touches.map((t) => `${t.day} · ${t.date}: ${t.text}.`),
        `${followUp.rules}.`,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.show('@follow'));
        ctx.at(180, () => ctx.cascade('@touch', { stagger: 120 }));
        ctx.at(650, () => ctx.show('@rules'));
        ctx.at(650, () => ctx.ticker('Follow-ups planned · they stop on any reply'));
      },
    },
    {
      label: 'Result',
      caption: 'A researched, personal email in 90 seconds, sent with approval.',
      duration: 2800,
      run: (ctx) => ctx.showResult(),
    },
  ],
});
