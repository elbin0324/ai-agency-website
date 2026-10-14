// Sales Agent demo: steps, captions and choreography (content/DEMOS.md §5, DEMO_ENGINE.md). OWNER: demo-sales.
// SalesDemo.astro renders the FINAL state; start states live in data attributes. Both the component's
// frontmatter (chapters, captions, transcript) and its <script> (behavior) import this file.
// DEMOS.md offsets ("+2,800 ms") map 1:1 to ctx.at(ms, fn) from the step start.
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
  await ctx.animate('@icp-lines', [{ opacity: 1 }, { opacity: 0 }], { duration: 160 });
  ctx.addClass('@icp'); // data-final-class="is-folded"
  await ctx.cascade('@icp-chip', { stagger: 50 });
}

/** Step 2, +2,800 ms: select Hollis & Grant and open "Why 94" beside the row. */
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
  await ctx.check(row.querySelector('.demo-check'), { spin: 340 });
}

/** Markers land one by one; each claim is highlighted with a marker-pen sweep and its note appears. */
async function markClaims(ctx: DemoContext, prefix: 'a' | 'b') {
  const marks = ctx.els(`${prefix}-mk`);
  const claims = ctx.els(`${prefix}-claim`);
  const notes = ctx.els(`${prefix}-note`);
  await ctx.all(
    ...marks.map((mk, i) =>
      ctx.after(i * 140, () => {
        const claim = claims[i];
        if (claim) ctx.addClass(claim);
        return ctx.all(
          ctx.show(mk, { effect: 'scale' }),
          claim ? ctx.animate(claim, [{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], { duration: 420, easing: EASE_OUT }) : null,
          notes[i] ? ctx.show(notes[i]) : null,
        );
      }),
    ),
  );
}

/** Step 4, +3,000 ms: the stream has ended, so the pane stops following new lines and returns to the subject line
 *  before the markers land. Phones show about half the email; without this, the subject, "Hi Dana," and fact 1 (the
 *  Riverside office, the trigger the page is built around) scroll away unseen and marker 1 draws off-screen.
 *  Every show() (the markers, the notes) follows its [data-autoscroll] box and would pull the pane straight back
 *  down, so the pane drops data-autoscroll first. Reset rebuilds the scene, so every replay follows the stream again. */
function backToTop(ctx: DemoContext) {
  const pane = ctx.el('work-pane');
  if (!pane) return;
  pane.removeAttribute('data-autoscroll');
  return ctx.scroll(pane, 'top', { duration: 300 });
}

/** Step 5: the toggle opens the comparison. Email B slides right, Email A fades in on the left. */
async function openCompare(ctx: DemoContext) {
  const pane = ctx.el('work-pane');
  if (pane && pane.scrollTop > 0) await ctx.scroll(pane, 'top', { duration: 300 });
  await ctx.click('@seg-a', { move: 350, press: 150 });
  ctx.toggleClass('@seg-b', 'is-on', false);
  ctx.toggleClass('@seg-a', 'is-on', true);
  await ctx.all(
    ctx.show('@compare', { effect: 'opacity', duration: 200 }),
    ctx.animate('@cmp-b', [{ translate: SLIDE }, { translate: '0 0' }], { duration: 300, easing: EASE_OUT }),
    ctx.show('@cmp-a', { duration: 300, delay: 120 }),
  );
}

/** Step 6, +0: the overlay closes and Email B returns to the center. */
async function closeCompare(ctx: DemoContext) {
  ctx.toggleClass('@seg-a', 'is-on', false);
  ctx.toggleClass('@seg-b', 'is-on', true);
  await ctx.all(
    ctx.animate('@cmp-b', [{ translate: '0 0' }, { translate: SLIDE }], { duration: 300, easing: EASE_OUT, fill: 'forwards' }),
    ctx.hide('@compare', { duration: 300 }),
  );
}

/** Step 6: one quality-check line arrives and passes. */
async function passCheck(ctx: DemoContext, i: number) {
  const line = ctx.els('qc-line')[i];
  if (!line) return;
  await ctx.show(line);
  await ctx.check(line.querySelector('.demo-check'), { spin: 300 });
  ctx.setText('@qc-count', String(i + 1));
}

/** Step 7, +0: the finished checklist folds to its summary line so the approval card has room. */
async function foldChecks(ctx: DemoContext) {
  await ctx.animate('@qc-body', [{ opacity: 1 }, { opacity: 0 }], { duration: 160 });
  ctx.addClass('@qc'); // data-final-class="is-folded"
}

/** Step 7, +1,300 ms: the buttons collapse into the approved line; the schedule, queue and CRM lines follow
 *  (their list, divider included, appears with the first line rather than as an empty rule beforehand). */
async function approve(ctx: DemoContext) {
  await ctx.all(ctx.swap('@ap-btns', '@ap-ok'), ctx.swap('@st-wait', '@st-done'), ctx.ticker('Approved by Sam · scheduled for 7:40 am'));
  await ctx.show('@ap-rows', { effect: 'none' });
  await ctx.all(ctx.cascade('@ap-row'), ctx.after(270, () => ctx.grow('@ap-meter')));
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
      duration: 4000,
      pane: 'list',
      transcript: [`${icp.title}. ${icp.lines.map((l) => `${l.k}: ${l.v}.`).join(' ')}`],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.show('@icp'), ctx.show('@st-run')));
        ctx.at(250, () => ctx.cascade('@icp-line'));
        ctx.at(900, () => ctx.ticker('Profile set: law and accounting firms, 10–50 staff'));
      },
    },
    {
      label: 'Match',
      caption: 'Matching firms, scored. Three are skipped: no real reason to write.',
      duration: 4500,
      pane: 'list',
      transcript: [
        search.line,
        ...prospects.map((p) => `Fit ${p.fit}: ${p.firm}, ${meta(p)}. ${p.signal}.`),
        `${search.skipped}.`,
        `${why.title}: ${why.items.join('; ')}.`,
      ],
      run(ctx) {
        ctx.at(0, () => foldProfile(ctx));
        ctx.at(300, () => ctx.all(ctx.show('@stats'), ctx.countUp('@searched', { duration: 650 })));
        ctx.at(600, () => ctx.cascade('@row'));
        ctx.at(650, () => ctx.all(ctx.grow('@fit-bar', { stagger: 90 }), ctx.countUp('@fit-n')));
        ctx.at(1700, () => ctx.show('@skip'));
        ctx.at(1950, () => ctx.scroll('@list-pane', '@skip'));
        ctx.at(2500, () => ctx.scroll('@list-pane', '[data-pick]', { duration: 250 }));
        ctx.at(2800, () => ctx.all(pickProspect(ctx), ctx.ticker('8 firms match · 3 skipped, no reason to write')));
      },
    },
    {
      label: 'Research',
      caption: 'Deep research on the top prospect: five facts, each with a source.',
      duration: 6500,
      pane: 'work',
      transcript: [
        `${dossier.label}. ${dossier.person}, ${dossier.role}. 10-point check: ${dossier.check}.`,
        ...dossier.facts.map((f, i) => `${i + 1}. ${f.fact} Source: ${f.source}. Use: ${f.use}. Verified.`),
        `${dossier.excluded.fact}. ${dossier.excluded.note}.`,
        `Also checked: ${dossier.alsoChecked}.`,
        `Reason to write now: ${dossier.reason}`,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.hide('@why'), ctx.swap('@work-wait', '@dossier'), ctx.swapText('@st-run-text', 'Researching')));
        ctx.at(300, () => ctx.all(countTo(ctx, '@dz-count', dossier.checkTotal, 3300), ctx.cascade('@dz-seg', { effect: 'opacity', stagger: 330, duration: 200 })));
        dossier.facts.forEach((_, i) => ctx.at(400 + i * 600, () => verifyFact(ctx, i)));
        ctx.at(3400, () => ctx.show('@fact-out'));
        ctx.at(3900, () => ctx.show('@also'));
        ctx.at(4400, () => ctx.reveal('@reason'));
        ctx.at(4600, () => ctx.ticker('Dossier: 5 facts verified, 1 left out'));
      },
    },
    {
      label: 'Draft',
      caption: 'An 89-word email built on what it found. Specific, no fluff.',
      duration: 6000,
      pane: 'work',
      transcript: emailBText,
      run(ctx) {
        ctx.at(0, () => ctx.all(ctx.swap('@dossier', '@draft'), ctx.scroll('@work-pane', 'top', { duration: 250 }), ctx.swapText('@st-run-text', 'Writing')));
        ctx.at(250, () => ctx.cascade('[data-el="b-rows"], [data-el="b-subject"]', { stagger: 120 }));
        ctx.at(600, () => ctx.all(ctx.stream('@b-body', { speed: 20 }), ctx.countUp('@wc', { duration: 1800 })));
        ctx.at(3000, () => backToTop(ctx));
        ctx.at(3600, () => markClaims(ctx, 'b'));
        ctx.at(4300, () => ctx.scroll('@work-pane', '@b-notes'));
        ctx.at(4200, () => ctx.all(ctx.swap('@st-run', '@st-draft'), ctx.ticker(`Draft ready: ${emailB.words} words, every claim sourced`)));
      },
    },
    {
      label: 'Compare',
      caption: 'Next to a generic AI email: one could go to anyone. One couldn’t.',
      duration: 5500,
      pane: 'work',
      transcript: emailAText,
      run(ctx) {
        ctx.at(0, () => openCompare(ctx));
        ctx.at(1200, () => markClaims(ctx, 'a'));
        ctx.at(1300, () => ctx.ticker('Same prospect: the generic AI email, marked'));
      },
    },
    {
      label: 'Check',
      caption: 'Every email passes five quality checks before anyone approves it.',
      duration: 4500,
      pane: 'check',
      transcript: [
        `${quality.title} · ${quality.passed} of ${quality.passed} passed.`,
        ...quality.checks.map((c) => `${c.k}: ${c.v}.`),
        `${quality.ready}.`,
      ],
      run(ctx) {
        ctx.at(0, () => closeCompare(ctx));
        ctx.at(300, () => ctx.all(ctx.swap('@check-wait', '@qc'), ctx.swap('@st-draft', '@st-run'), ctx.swapText('@st-run-text', 'Checking')));
        quality.checks.forEach((_, i) => ctx.at(500 + i * 300, () => passCheck(ctx, i)));
        ctx.at(2700, () => ctx.all(ctx.show('@qc-ready'), ctx.swap('@st-run', '@st-wait'), ctx.ticker('5 of 5 checks passed · waiting on Sam')));
      },
    },
    {
      label: 'Approve',
      caption: 'Sam approves. It’s scheduled for 7:40 am, Dana’s time.',
      duration: 4000,
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
        ctx.at(200, () => ctx.show('@approval'));
        ctx.at(800, () => ctx.click('@approve', { move: 350, press: 150 }));
        ctx.at(1300, () => approve(ctx));
      },
    },
    {
      label: 'Follow-up',
      caption: 'Follow-ups are planned, and stop the moment she replies.',
      duration: 4000,
      pane: 'check',
      transcript: [
        `${followUp.title}, ${followUp.condition}:`,
        ...followUp.touches.map((t) => `${t.day} · ${t.date}: ${t.text}.`),
        `${followUp.rules}.`,
      ],
      run(ctx) {
        ctx.at(0, () => ctx.show('@follow'));
        ctx.at(250, () => ctx.cascade('@touch', { stagger: 160 }));
        ctx.at(950, () => ctx.show('@rules'));
        ctx.at(950, () => ctx.ticker('Follow-ups planned · they stop on any reply'));
      },
    },
    {
      label: 'Result',
      caption: 'A researched, personal email in 90 seconds, sent with approval.',
      duration: 4000,
      run: (ctx) => ctx.showResult(),
    },
  ],
});
