// OWNER: pages-misc
// Client behavior for the free-assessment intake (ContactForm.astro + EstimatePanel.astro):
//   - one step at a time: progress rail, Back / Next (Enter moves on), focus on each step's heading;
//   - ways through for a busy owner: "Skip this step" on steps 2 to 4, and on step 1 "Skip the questions
//     and just send your details" (quick mode: straight to the contact step, only name and email needed).
//     A skipped step is never validated (step 4's goal stops being required) and shows as skipped on
//     the rail; answering it later with Next counts it as done again;
//   - inline, accessible validation per step (aria-invalid + aria-describedby; the first problem is
//     focused and scrolled clear of the sticky header and, on phones, the sticky estimate bar);
//   - the live preliminary estimate (estimate.ts -> computeLevers) in the panel and the phone peek. The
//     panel is interactive: a counted lever opens to show its inputs and math, and a lever waiting for an
//     answer links to that question once its step has been reached;
//   - calculator prefill from /contact/?source=calculator&… (legacy team/hourly/hours/share/inquiries
//     and every LeverInputs key; an optional levers=time,customers limits which ones apply);
//   - link context from contactUrl() (src/lib/url.ts): ?interest=<id> ticks the matching priority on
//     step 4 when none is picked yet, ?plan=<id> (the engagement model picked on /approach/) and
//     ?from=<page> go into the source line and the summary we receive;
//   - a draft kept in sessionStorage for this tab (cleared after a successful send);
//   - sending: Formspree-style JSON when site.formEndpoint is set, a pre-written email when site.email is
//     real, otherwise the "not connected yet" note (with a copy-my-answers button). Every channel carries
//     a readable summary of every answer plus the estimate.
import {
  steps, NOT_SURE, MAX_GOALS, workTypes, hoursOptions, hourlyOptions, afterHoursOptions, adSpendOptions, revenues,
  teamSizes, outboundOn, valueOf, rangeLabel, parseAmount, prefillAliases, goals,
} from './intake';
import {
  estimate, leverLabels, getModel, LEVERS, leverKeys, moneyRange, moneyRangeExact, countRange,
  type Answers, type Estimate, type LeverId, type LeverInputs, type LeverResult, type Pending,
} from './estimate';
import { currency, number } from '@/lib/format';
import { contactInterests, type Interest } from '@/lib/url';

type Key = keyof LeverInputs;
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type Prefill = { name: string; value: string; key: Key; n: number };
type Draft = {
  v: 1; step: number; max: number; calc: string; fields: [string, string][]; exact: Prefill[]; loose: Partial<LeverInputs>;
  skipped?: number[]; quick?: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WEB = /^(https?:\/\/)?(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}(:\d+)?(\/\S*)?$/i;
const DRAFT_KEY = 'intake-draft-v1';
const LAST = steps.length - 1;

/** Levers each input feeds (from estimate.ts), so a calculator link with levers=… keeps shared inputs
 *  such as the hourly cost (team time and customers) and the gross margin (customers, sales, consulting). */
const usedBy = (key: Key): LeverId[] => LEVERS.filter((id) => leverKeys[id].includes(key));

const pendingText: Record<Pending, string> = {
  team: 'Choose a team size in step 1',
  hours: 'No hours entered for this work',
  inquiries: 'Add monthly inquiries in step 3',
  adspend: 'Add your ad spend in step 3',
  noads: 'No ad spend to work with',
  outbound: 'Tell us about outbound sales in step 3',
  nooutbound: 'No outbound sales planned',
  revenue: 'Add annual revenue in step 1',
  norevenue: 'Revenue not shared',
};
/** The question that unlocks a waiting lever (step index and field name). */
const pendingTarget: Partial<Record<Pending, { step: number; name: string }>> = {
  team: { step: 0, name: 'team_size' },
  hours: { step: 1, name: 'hours_inbox' },
  inquiries: { step: 2, name: 'inquiries' },
  adspend: { step: 2, name: 'ad_spend' },
  outbound: { step: 2, name: 'outbound' },
  revenue: { step: 0, name: 'revenue' },
};

/** Typical values worth naming in the panel (operating margin is left out: it changes no figure). */
const typicalText: Partial<Record<Key, string>> = {
  hourlyCost: 'hourly cost',
  afterHoursShare: 'after-hours share',
  avgJobValue: 'job value',
  grossMargin: 'gross margin',
  prospectsPerMonth: 'prospects a month',
  avgDealValue: 'deal value',
};
/** Questions answered with a range: the panel says which range a modeled number stands for. */
const rangeField: Partial<Record<Key, string>> = {
  teamSize: 'team_size', hourlyCost: 'hourly_cost', afterHoursShare: 'after_hours', monthlyAdSpend: 'ad_spend', annualRevenue: 'revenue',
};

// ---- Formatting ----
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** How each lever's value reads. Ad dollars are "freed up to reallocate", never "saved" (DESIGN.md §6.4). */
const kindText = (l: { id: LeverId; kind: string }) => (l.id === 'marketing' ? 'freed up to reallocate' : l.kind);
const listOf = (items: string[]) =>
  items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
function inputText(key: Key, v: number): string {
  switch (key) {
    case 'teamSize': return `${number(v)} ${v === 1 ? 'person' : 'people'}`;
    case 'hourlyCost': return `${currency(v)} an hour`;
    case 'repetitiveHours': return `${number(v)} h a week each`;
    case 'monthlyInquiries': return `${number(v)} inquiries a month`;
    case 'afterHoursShare': return `${number(v)}% after hours`;
    case 'avgJobValue': return `${currency(v)} a job`;
    case 'grossMargin': return `${number(v)}% gross margin`;
    case 'monthlyAdSpend': return `${currency(v)} a month in ads`;
    case 'prospectsPerMonth': return `${number(v)} prospects a month`;
    case 'avgDealValue': return `${currency(v)} a deal`;
    case 'annualRevenue': return `${currency(v)} a year in revenue`;
    case 'operatingMargin': return `${number(v)}% operating margin`;
  }
}

/** Small DOM helper: an element with a class and text (text is always set as text, never as HTML). */
function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

export function initIntake(form: HTMLFormElement) {
  const root = form.closest<HTMLElement>('[data-contact-form-root]');
  if (!root || form.dataset.cfBound) return;
  form.dataset.cfBound = '1';
  form.noValidate = true;

  const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = root) => scope.querySelector<T>(sel);
  const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = root) => Array.from(scope.querySelectorAll<T>(sel));

  const sections = $$<HTMLElement>('[data-cf-step]', form);
  const progItems = $$<HTMLElement>('[data-cf-prog]');
  const progress = $('[data-cf-progress]');
  const backBtn = $<HTMLButtonElement>('[data-cf-back]', form);
  const nextBtn = $<HTMLButtonElement>('[data-cf-next]', form);
  const nextTo = $('[data-cf-next-to]', form);
  const submit = $<HTMLButtonElement>('[data-cf-submit]', form);
  const submitLabel = submit?.querySelector<HTMLElement>(':scope > span');
  const submitHtml = submitLabel?.innerHTML ?? '';
  const privacy = $('[data-cf-privacy]', form);
  const mailtoNote = $('[data-cf-mailto]', form);
  const unconnected = $('[data-cf-unconnected]', form);
  const errorNote = $('[data-cf-error]', form);
  const panelWrap = $('[data-cf-panel]');
  const done = $('[data-cf-done]');
  const source = $<HTMLInputElement>('[data-cf-source]', form);
  const planField = $<HTMLInputElement>('[data-cf-plan]', form);
  const phoneWrap = $('[data-cf-phone]', form);
  const phoneInput = $<HTMLInputElement>('[data-cf-phone-input]', form);
  const phoneOptional = $('[data-cf-phone-optional]', form);
  const phoneHint = phoneWrap?.querySelector<HTMLElement>('.field__hint');
  const outboundMore = $('[data-cf-outbound-more]', form);
  const goalsSet = $<HTMLFieldSetElement>('fieldset[data-cf-validate="goals"]', form);
  const goalsHint = goalsSet?.querySelector<HTMLElement>('[data-cg-hint]');
  const hoursTotal = $('[data-cf-hours-total]', form);
  const hoursCalc = $('[data-cf-hours-calc]', form);
  const peek = $<HTMLAnchorElement>('[data-cf-peek]');
  const peekValue = $('[data-cf-peek-value]');
  const restored = $('[data-cf-restored]');
  const panel = document.querySelector<HTMLElement>('[data-estimate]');
  const quickWrap = $('[data-cf-quick-wrap]', form);
  const quickNote = $('[data-cf-quick-note]', form);
  const skipBtn = $<HTMLButtonElement>('[data-cf-skip]', form);
  if (quickWrap) quickWrap.hidden = false;

  // Without JavaScript the submit is disabled while the form has nowhere to send; here the script
  // handles that case with the "not connected yet" note, so the button works.
  if (submit) submit.disabled = false;

  let current = 0;
  let maxReached = 0;
  const attempted = new Set<number>();
  /** Steps the visitor chose to skip (never the contact step). */
  const skipped = new Set<number>();
  /** "Skip the questions and just send your details": only the contact step is asked for. */
  let quick = false;
  let prefilled: Prefill[] = [];
  /** Calculator values with no form control (hours per person, margins): always used when present. */
  let loose: Partial<LeverInputs> = {};
  let calcSig = '';
  let busy = false;
  /** Set once the request is sent: nothing is saved as a draft after that. */
  let sent = false;
  let saveTimer = 0;
  /** Calculator answers with no matching question, kept for the summary. */
  const calcExtra: { share?: number } = {};

  // ------------------------------------------------------------------ helpers
  const fd = () => new FormData(form);
  const str = (data: FormData, k: string) => String(data.get(k) ?? '').trim();
  const wantsPhone = () => str(fd(), 'preferred_contact') === 'Phone call';
  const outboundIsOn = () => outboundOn.has(str(fd(), 'outbound'));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = (): ScrollBehavior => (reduced() ? 'auto' : 'smooth');
  const control = (name: string) => form.elements.namedItem(name) as Control | RadioNodeList | null;
  /** Space the sticky header takes, plus the sticky estimate bar on phones and tablets when it shows. */
  function topPad(): number {
    let pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    if (peek && !peek.hidden && getComputedStyle(peek).position === 'sticky') pad += peek.offsetHeight + 8;
    return pad;
  }

  function setValue(name: string, value: string) {
    const el = control(name);
    if (!el) return;
    if (el instanceof RadioNodeList) {
      Array.from(el as unknown as HTMLInputElement[]).forEach((i) => { if (i.type === 'radio') i.checked = i.value === value; });
    } else if (el instanceof HTMLInputElement && el.type === 'radio') {
      el.checked = el.value === value;
    } else {
      (el as Control).value = value;
    }
  }

  /** Bring a block (a field with its label and message) into view below the sticky header (and bar).
   *  Left to focus(), engines disagree: WebKit scrolls the minimum distance and ignores
   *  scroll-padding-top, so the label lands under the header, while Chrome centres the control. */
  function scrollClear(block: HTMLElement) {
    const box = block.getBoundingClientRect();
    const pad = topPad();
    const room = window.innerHeight - pad;
    if (box.top >= pad && box.bottom <= window.innerHeight) return;
    const top = window.scrollY + box.top - pad - Math.max(0, (room - box.height) / 2);
    window.scrollTo({ top, behavior: scrollBehavior() });
  }

  // ------------------------------------------------------------------ validation
  const errorEl = (el: HTMLElement) => document.getElementById(`${el.id}-err`);
  const describe = (el: HTMLElement, errId: string, on: boolean) => {
    const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter((x) => x && x !== errId);
    if (on) ids.push(errId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' ')); else el.removeAttribute('aria-describedby');
  };
  function setError(el: HTMLElement, msg: string) {
    const err = errorEl(el);
    if (!err) return;
    const text = err.querySelector('span');
    if (text) text.textContent = msg;
    err.hidden = false;
    el.setAttribute('aria-invalid', 'true');
    describe(el, err.id, true);
    if (el.tagName === 'FIELDSET') el.querySelectorAll('input').forEach((i) => i.setAttribute('aria-invalid', 'true'));
  }
  function clearError(el: HTMLElement) {
    const err = errorEl(el);
    if (err) { err.hidden = true; describe(el, err.id, false); }
    el.removeAttribute('aria-invalid');
    if (el.tagName === 'FIELDSET') el.querySelectorAll('input').forEach((i) => i.removeAttribute('aria-invalid'));
  }
  /** Returns '' when valid, else the message to show. */
  function problem(el: HTMLElement): string {
    const rule = el.dataset.cfValidate;
    const msg = el.dataset.cfMsg || 'Please check this field.';
    if (rule === 'group') return el.querySelector('input:checked') ? '' : msg;
    if (rule === 'goals') {
      const n = el.querySelectorAll('input:checked').length;
      const max = Number(el.dataset.cfMax) || MAX_GOALS;
      return n === 0 ? msg : n > max ? `Pick up to ${max}.` : '';
    }
    const v = (el as Control).value.trim();
    if (rule === 'required') return v ? '' : msg;
    if (rule === 'email') return EMAIL.test(v) ? '' : msg;
    if (rule === 'phone') return !wantsPhone() || v.replace(/\D/g, '').length >= 7 ? '' : msg;
    if (rule === 'url') return !v || WEB.test(v) ? '' : msg;
    if (rule === 'number') return !v || (Number.isFinite(parseAmount(v)) && parseAmount(v) >= 0) ? '' : msg;
    return '';
  }
  const applies = (el: HTMLElement) => !(outboundMore && outboundMore.contains(el) && !outboundIsOn());
  function check(el: HTMLElement): boolean {
    const msg = applies(el) ? problem(el) : '';
    if (msg) setError(el, msg); else clearError(el);
    return !msg;
  }
  const targetsIn = (i: number) => $$<HTMLElement>('[data-cf-validate]', sections[i]).filter((el) => el.dataset.cfValidate);
  function validateStep(i: number): HTMLElement[] {
    attempted.add(i);
    return targetsIn(i).filter((el) => !check(el));
  }
  const stepOf = (el: Element) => sections.findIndex((s) => s.contains(el));

  const focusTarget = (el: HTMLElement) => (el.tagName === 'FIELDSET' ? el.querySelector<HTMLElement>('input:not(:disabled)') : el);
  /** Focus the first problem and bring its whole field (label, control, message) into view. */
  function reveal(el: HTMLElement) {
    focusTarget(el)?.focus({ preventScroll: true });
    scrollClear(el.closest<HTMLElement>('.field, .hours__row') ?? el);
  }

  // ------------------------------------------------------------------ steps
  function paint() {
    sections.forEach((s, i) => s.classList.toggle('is-current', i === current));
    progItems.forEach((item, i) => {
      const btn = item.querySelector<HTMLButtonElement>('button');
      // Done = a step the visitor has already moved past (it was valid when they left it).
      const isSkipped = i !== current && skipped.has(i);
      const isDone = i !== current && i < maxReached && !isSkipped;
      item.classList.toggle('is-current', i === current);
      item.classList.toggle('is-done', isDone);
      item.classList.toggle('is-skipped', isSkipped);
      if (btn) {
        btn.disabled = i > maxReached;
        if (i === current) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current');
        const state = btn.querySelector('[data-cf-prog-state]');
        if (state) state.textContent = i === current ? ' (current step)' : isDone ? ' (done)' : isSkipped ? ' (skipped)' : '';
      }
    });
    progress?.style.setProperty('--p', String(current / LAST));
    const last = current === LAST;
    if (backBtn) backBtn.hidden = current === 0;
    if (nextBtn) nextBtn.hidden = last;
    if (submit) submit.hidden = !last;
    if (privacy) privacy.hidden = !last;
    if (nextTo && !last) nextTo.textContent = `: ${steps[current + 1].title}`;
    if (skipBtn) skipBtn.hidden = current === 0 || last;
    if (quickNote) quickNote.hidden = !(quick && last);
    form.classList.toggle('is-last', last);
  }

  function show(i: number, opts: { focus?: boolean; scroll?: boolean } = {}) {
    const { focus = true, scroll = true } = opts;
    const prev = current;
    current = Math.max(0, Math.min(LAST, i));
    maxReached = Math.max(maxReached, current);
    paint();
    const section = sections[current];
    if (prev !== current && section) {
      section.classList.remove('is-entering');
      void section.offsetWidth; // restart the entrance
      section.classList.add('is-entering');
    }
    if (scroll) {
      const anchor = progress && progress.offsetParent ? progress : root!;
      const top = anchor.getBoundingClientRect().top;
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (top < pad || top > window.innerHeight * 0.6) {
        window.scrollTo({ top: window.scrollY + top - pad - 12, behavior: scrollBehavior() });
      }
    }
    if (focus) section?.querySelector<HTMLElement>('.cstep__title')?.focus({ preventScroll: true });
    if (lastEst) renderPanel(lastEst); // which waiting levers can link to their question
    saveDraft();
  }

  function goNext() {
    const bad = validateStep(current);
    if (bad.length) { reveal(bad[0]); return; }
    skipped.delete(current); // answered after all
    show(current + 1);
  }

  /** Move on without answering: the step's leftover messages go, and it stays unvalidated. */
  function skipStep() {
    if (current === LAST) return;
    targetsIn(current).forEach(clearError);
    skipped.add(current);
    show(current + 1);
  }

  /** Quick mode: straight to the contact step; every question step counts as skipped. */
  function goQuick() {
    quick = true;
    for (let i = 0; i < LAST; i++) { skipped.add(i); targetsIn(i).forEach(clearError); }
    show(LAST);
  }
  /** Back to the full set of questions from quick mode: answers typed so far stay, and the rail starts
   *  again from step 1 (nothing skipped, nothing marked done until Next accepts it). */
  function leaveQuick() {
    quick = false;
    skipped.clear();
    maxReached = 0;
    show(0);
  }

  /** Move to step `i` (back freely; forward only through reached steps that are still valid). */
  function goTo(i: number, opts: { focus?: boolean; scroll?: boolean } = {}): boolean {
    if (i === current) return true;
    if (i > maxReached) return false;
    for (let s = current; s < i; s++) {
      if (skipped.has(s)) continue;
      const bad = validateStep(s);
      if (bad.length) { if (s !== current) show(s, { focus: false }); reveal(bad[0]); return false; }
    }
    show(i, opts);
    return true;
  }

  nextBtn?.addEventListener('click', goNext);
  skipBtn?.addEventListener('click', skipStep);
  $('[data-cf-quick]', form)?.addEventListener('click', goQuick);
  $('[data-cf-unquick]', form)?.addEventListener('click', leaveQuick);
  backBtn?.addEventListener('click', () => show(current - 1));
  progItems.forEach((item, i) => item.querySelector('button')?.addEventListener('click', () => { goTo(i); }));

  // Enter in a one-line field moves to the next step instead of submitting early.
  form.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.isComposing || current === LAST) return;
    const t = e.target as HTMLElement;
    if (t instanceof HTMLInputElement && !['checkbox', 'radio', 'button', 'submit'].includes(t.type)) {
      e.preventDefault();
      goNext();
    }
  });

  // ------------------------------------------------------------------ conditional fields
  function syncPhone() {
    const on = wantsPhone();
    phoneWrap?.classList.toggle('is-on', on);
    if (phoneInput) {
      if (on) phoneInput.setAttribute('aria-required', 'true'); else { phoneInput.removeAttribute('aria-required'); clearError(phoneInput); }
    }
    if (phoneOptional) phoneOptional.hidden = on;
    if (phoneHint) phoneHint.textContent = on ? 'The best number to reach you, with the area code.' : 'Only if you’d rather we call.';
  }
  function syncOutbound() {
    const on = outboundIsOn();
    outboundMore?.classList.toggle('is-on', on);
    if (!on && outboundMore) $$<HTMLElement>('[data-cf-validate]', outboundMore).forEach(clearError);
  }
  function syncGoals() {
    if (!goalsSet) return;
    const boxes = $$<HTMLInputElement>('input[type="checkbox"]', goalsSet);
    const n = boxes.filter((b) => b.checked).length;
    const max = Number(goalsSet.dataset.cfMax) || MAX_GOALS;
    boxes.forEach((b) => { b.disabled = !b.checked && n >= max; });
    if (goalsHint) goalsHint.textContent = n === 0 ? `Pick up to ${max}.` : n >= max ? `${n} of ${max} picked. Unpick one to change.` : `${n} of ${max} picked.`;
  }
  goalsHint?.setAttribute('aria-live', 'polite');

  function syncHoursTotal(est: Estimate | null) {
    // "Not sure" reads as a quieter answer than a real range.
    $$<HTMLSelectElement>('select[data-cf-hours]', form).forEach((sel) => sel.classList.toggle('is-unsure', sel.value === NOT_SURE));
    if (!hoursTotal) return;
    const data = fd();
    let known = 0;
    let answered = 0;
    let unsure = 0;
    for (const w of workTypes) {
      const v = valueOf(hoursOptions, str(data, w.name));
      if (typeof v === 'number') { known += v; answered++; } else unsure++;
    }
    hoursTotal.replaceChildren();
    if (!answered) {
      hoursTotal.textContent = 'Pick a rough range for any you know. We’ll use typical hours for the rest.';
    } else {
      hoursTotal.append('About ', h('b', undefined, `${number(known)} hours a week`), ' across the team from your answers.');
      if (unsure) hoursTotal.append(` Typical hours fill in the ${unsure === 1 ? 'one' : unsure} marked Not sure.`);
    }
    if (est?.teamHours.customersIncluded) hoursTotal.append(' Customer conversations count as team time until you add monthly inquiries in step 3.');
  }

  // ------------------------------------------------------------------ answers -> estimate
  const amount = (data: FormData, k: string) => {
    const n = parseAmount(str(data, k));
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  function readAnswers(): Answers {
    const data = fd();
    const hours: Answers['hours'] = {};
    for (const w of workTypes) {
      const v = valueOf(hoursOptions, str(data, w.name));
      hours[w.id] = v === undefined ? null : v;
    }
    const outbound = str(data, 'outbound');
    const on = outboundOn.has(outbound);
    const exact: Partial<LeverInputs> = { ...loose };
    for (const p of prefilled) {
      const now = data.getAll(p.name).map(String);
      if (now.includes(p.value)) exact[p.key] = p.n;
    }
    const revenue = valueOf(revenues, str(data, 'revenue'));
    return {
      teamSize: valueOf(teamSizes, str(data, 'team_size')) ?? undefined,
      hourlyCost: valueOf(hourlyOptions, str(data, 'hourly_cost')),
      hours,
      monthlyInquiries: amount(data, 'inquiries'),
      afterHoursShare: valueOf(afterHoursOptions, str(data, 'after_hours')),
      avgJobValue: amount(data, 'job_value'),
      monthlyAdSpend: valueOf(adSpendOptions, str(data, 'ad_spend')),
      outbound: on ? true : outbound === 'No' ? false : undefined,
      prospectsPerMonth: on ? amount(data, 'prospects') : undefined,
      avgDealValue: on ? amount(data, 'deal_value') : undefined,
      annualRevenue: revenue,
      exact,
    };
  }
  const safeEstimate = (): Estimate | null => { try { return estimate(readAnswers()); } catch { return null; } };

  /** "(your answer: 25 to 40%)", "(typical)", "(from the calculator)", or '' when it is the answer as typed. */
  function originNote(est: Estimate, key: Key): string {
    const o = est.origin[key];
    if (o === 'typical') return 'typical';
    if (o === 'calculator') return 'from the calculator';
    const field = rangeField[key];
    if (o === 'answer' && field) {
      const label = str(fd(), field);
      return label ? `your answer: ${label}` : '';
    }
    return '';
  }
  /** One or two sentences under a lever's math: how the visitor's answers became the model's inputs. */
  function basisText(est: Estimate, l: LeverResult): string {
    const out: string[] = [];
    const inp = est.inputs;
    if (l.id === 'time' && inp.teamSize !== undefined && inp.repetitiveHours !== undefined) {
      const counted = `${number(inp.teamSize)} ${inp.teamSize === 1 ? 'person' : 'people'} × ${number(inp.repetitiveHours)} h a week`;
      if (est.teamHours.fromCalculator) out.push(`Counted as ${counted}, from your calculator answers.`);
      else {
        const t = est.teamHours;
        const what = `inbox, reporting, marketing and sales follow-up${t.customersIncluded ? ', plus customer conversations' : ''}`;
        const typ = t.typicalTypes ? ` (typical hours for the ${t.typicalTypes === 1 ? 'one' : t.typicalTypes} marked Not sure)` : '';
        out.push(`About ${number(t.counted)} h a week of ${what} across the team${typ}, counted as ${counted}.`);
      }
    }
    const notes: string[] = [];
    for (const key of leverKeys[l.id]) {
      const v = inp[key];
      if (v === undefined || key === 'teamSize' || key === 'repetitiveHours') continue;
      const note = originNote(est, key);
      if (note) notes.push(`${inputText(key, v)} (${note})`);
    }
    if (notes.length) out.push(`Uses ${listOf(notes)}.`);
    if (!out.length) out.push('Uses your answers as entered.');
    return out.join(' ');
  }

  // ------------------------------------------------------------------ the panel
  const labels = leverLabels();
  const rows = new Map<LeverId, HTMLElement>();
  panel?.querySelectorAll<HTMLElement>('[data-est-lever]').forEach((row) => {
    const id = row.dataset.estLever as LeverId;
    rows.set(id, row);
    const name = row.querySelector('.est__lname');
    if (name && labels[id]) name.textContent = labels[id];
  });
  const pTotal = panel?.querySelector<HTMLElement>('[data-est-total]');
  const pHours = panel?.querySelector<HTMLElement>('[data-est-hours]');
  const pRev = panel?.querySelector<HTMLElement>('[data-est-rev]');
  const pTypical = panel?.querySelector<HTMLElement>('[data-est-typical]');
  const pOff = panel?.querySelector<HTMLElement>('[data-est-off]');
  const pHint = panel?.querySelector<HTMLElement>('[data-est-hint]');
  const pLive = panel?.querySelector<HTMLElement>('[data-est-live]');
  const chevTpl = panel?.querySelector<HTMLTemplateElement>('[data-est-chev]');
  /** Source id -> [href, citation, external], resolved at build time by EstimatePanel.astro. */
  const sourceLinks: Record<string, [string, string, boolean]> = (() => {
    try { return JSON.parse(panel?.dataset.sources || '{}'); } catch { return {}; }
  })();
  let lastEst: Estimate | null = null;
  let lastTotal = '';
  let openLever: LeverId | null = null;
  let lastSpoken = '';
  let speakTimer = 0;

  function countedRow(row: HTMLElement, id: LeverId, l: LeverResult, est: Estimate) {
    const note = [cap(kindText(l))];
    if (l.hoursPerMonth && l.hoursPerMonth.high > 0) note.push(`${countRange(l.hoursPerMonth)} h a month`);
    const value = moneyRange(l.value);
    const basis = basisText(est, l);
    const sig = JSON.stringify(['on', value, note, basis, l.math]);
    if (row.dataset.sig === sig) return;
    const wasWaiting = row.classList.contains('is-waiting');
    row.dataset.sig = sig;
    row.classList.remove('is-waiting');

    const open = openLever === id;
    const btn = h('button', 'est__lhead');
    btn.type = 'button';
    btn.dataset.estToggle = id;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-controls', `est-math-${id}`);
    const chev = chevTpl?.content.firstElementChild?.cloneNode(true);
    btn.append(h('span', 'est__lname', labels[id]), h('span', 'est__lval', value));
    if (chev) btn.append(chev);
    btn.append(h('span', 'est__lnote', note.join(' · ')), h('span', 'sr-only', '. Show the math'));

    const box = h('div', 'est__math');
    box.id = `est-math-${id}`;
    box.hidden = !open;
    const dl = h('dl', 'est__mlines');
    for (const m of l.math) {
      const line = h('div');
      line.append(h('dt', undefined, m.label), h('dd', undefined, m.value));
      dl.append(line);
    }
    // Like the calculator: what the two ends mean, the rounding rule and the sources behind the rates.
    const foot = h('p', 'est__mfoot', 'Low end: the base rates in our research. High end: the optimistic rates, never beyond. Each step rounds down.');
    const ids = [...new Set(l.sources)].filter((s) => sourceLinks[s]);
    if (ids.length) {
      foot.append(' Sources: ');
      ids.forEach((s, i) => {
        const [href, title, external] = sourceLinks[s];
        const a = h('a', 'link', s);
        a.href = href;
        a.title = title;
        if (external) { a.target = '_blank'; a.rel = 'noopener'; }
        foot.append(...(i ? [' · ', a] : [a]));
      });
    }
    box.append(h('p', 'est__mbasis', basis), dl, foot);
    row.replaceChildren(btn, box);
    if (wasWaiting && !reduced()) {
      row.classList.add('is-on');
      window.setTimeout(() => row.classList.remove('is-on'), 700);
    }
  }

  function waitingRow(row: HTMLElement, id: LeverId, why: Pending | undefined) {
    const target = why ? pendingTarget[why] : undefined;
    const linkable = !!target && target.step <= maxReached && !sent;
    const text = why ? pendingText[why] : '';
    const sig = JSON.stringify(['off', text, linkable]);
    if (row.dataset.sig === sig) return;
    row.dataset.sig = sig;
    row.classList.add('is-waiting');
    row.classList.remove('is-on');
    if (openLever === id) { openLever = null; panel?.classList.remove('has-open'); }
    const head = h('div', 'est__lhead');
    head.append(h('span', 'est__lname', labels[id]), h('span', 'est__lval', 'Not counted'));
    const note = h('span', 'est__lnote');
    if (linkable && why) {
      const jump = h('button', 'est__jump', text);
      jump.type = 'button';
      jump.dataset.estJump = why;
      note.append(jump);
    } else note.textContent = text;
    head.append(note);
    row.replaceChildren(head);
  }

  function renderPanel(est: Estimate | null, pulse = false) {
    if (!panel) return;
    if (!est) {
      panel.classList.add('is-empty');
      if (pOff) pOff.hidden = false;
      if (peek) peek.hidden = true;
      return;
    }
    const ready = est.ready;
    panel.classList.toggle('is-empty', !ready);
    const total = ready ? moneyRange(est.total) : '';
    if (pTotal) pTotal.textContent = total || '$0';
    if (pHours) pHours.textContent = ready ? countRange(est.hoursPerMonth) : '0';
    if (pulse && ready && total !== lastTotal && lastTotal && !reduced()) {
      panel.classList.remove('is-updated');
      void panel.offsetWidth;
      panel.classList.add('is-updated');
    }
    lastTotal = total;
    for (const id of LEVERS) {
      const row = rows.get(id);
      if (!row) continue;
      const lever = est.levers.find((l) => l.id === id);
      if (lever) countedRow(row, id, lever, est); else waitingRow(row, id, est.pending[id]);
    }
    if (pHint) pHint.hidden = !est.levers.length;
    if (pRev) {
      const r = est.addedRevenue;
      pRev.hidden = !(ready && r.high > 0);
      if (!pRev.hidden) pRev.replaceChildren('Plus ', h('b', undefined, moneyRange(r)), ' a year in added revenue, for context only (not in the total).');
    }
    if (pTypical) {
      const parts: string[] = [];
      if (est.teamHours.typicalTypes) parts.push(`hours for ${est.teamHours.typicalTypes === 1 ? 'one kind' : `${est.teamHours.typicalTypes} kinds`} of work`);
      for (const k of est.typical) if (typicalText[k]) parts.push(typicalText[k]!);
      const lines: string[] = [];
      if (est.teamHours.fromCalculator) lines.push('Hours a person come from your calculator answers.');
      if (parts.length) lines.push(`Typical values for now: ${listOf(parts)}. We’ll swap in yours on the call.`);
      pTypical.hidden = !(ready && lines.length);
      if (!pTypical.hidden) pTypical.textContent = lines.join(' ');
    }
    if (pOff) pOff.hidden = true;
    if (peek && peekValue) {
      peek.hidden = !ready;
      if (ready) peekValue.textContent = total;
    }
    // Speak a settled estimate, not every keystroke.
    window.clearTimeout(speakTimer);
    const line = ready ? `Preliminary estimate: ${total} a year, ${countRange(est.hoursPerMonth)} hours back a month.` : '';
    speakTimer = window.setTimeout(() => {
      if (pLive && line && line !== lastSpoken) { pLive.textContent = line; lastSpoken = line; }
    }, 1200);
  }

  function update(pulse = false) {
    let est: Estimate | null = null;
    try { est = estimate(readAnswers()); } catch (err) { console.warn('[intake] estimate failed', err); est = null; }
    lastEst = est;
    renderPanel(est, pulse);
    syncHoursTotal(est);
    return est;
  }

  /** Focus a question by field name and bring it into view. */
  function focusField(name: string) {
    const ctl = control(name);
    let input: HTMLElement | null = null;
    if (ctl instanceof RadioNodeList) {
      const list = Array.from(ctl as unknown as HTMLInputElement[]);
      input = list.find((i) => i.checked) ?? list[0] ?? null;
    } else input = ctl as HTMLElement | null;
    if (!input) return;
    input.focus({ preventScroll: true });
    scrollClear(input.closest<HTMLElement>('.field, .hours__row') ?? input);
  }

  panel?.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-est-toggle], [data-est-jump]');
    if (!t) return;
    const toggle = t.dataset.estToggle as LeverId | undefined;
    if (toggle) {
      // One lever's math open at a time keeps the panel short.
      openLever = openLever === toggle ? null : toggle;
      panel.classList.toggle('has-open', !!openLever);
      rows.forEach((row, id) => {
        const btn = row.querySelector<HTMLElement>('[data-est-toggle]');
        const box = row.querySelector<HTMLElement>('.est__math');
        if (!btn || !box) return;
        btn.setAttribute('aria-expanded', String(openLever === id));
        box.hidden = openLever !== id;
      });
      if (openLever) {
        // Keep the opened math in view: inside the panel on desktop (it scrolls within the viewport),
        // on the page on phones. 'nearest' leaves it alone when it already fits.
        const row = rows.get(openLever);
        if (row) window.requestAnimationFrame(() => row.scrollIntoView({ block: 'nearest', behavior: scrollBehavior() }));
      }
      return;
    }
    const why = t.dataset.estJump as Pending | undefined;
    const target = why ? pendingTarget[why] : undefined;
    if (!target) return;
    if (goTo(target.step, { focus: false, scroll: false })) focusField(target.name);
  });

  // ------------------------------------------------------------------ calculator prefill
  function applyCalculator(params: URLSearchParams): boolean {
    if (params.get('source') !== 'calculator') return false;
    const meta = getModel()?.leverInputMeta;
    const leversParam = (params.get('levers') || '').split(',').map((s) => s.trim()).filter(Boolean);
    // An input applies when any lever that uses it was counted in the calculator.
    const allowed = (key: Key) => !leversParam.length || usedBy(key).some((id) => leversParam.includes(id));
    const v: Partial<LeverInputs> = {};
    for (const key of Object.keys(prefillAliases) as Key[]) {
      if (!allowed(key)) continue;
      for (const alias of prefillAliases[key]) {
        const raw = params.get(alias);
        if (raw === null || raw.trim() === '') continue;
        const n = Number(raw);
        if (!Number.isFinite(n) || n < 0) continue;
        const m = meta?.[key];
        v[key] = m ? Math.min(m.max, Math.max(m.min, n)) : n;
        break;
      }
    }
    if (!Object.keys(v).length) return false;
    prefilled = [];
    loose = {};
    const ranged = (name: string, key: Key, label: string | undefined) => {
      if (!label || v[key] === undefined) return;
      setValue(name, label);
      prefilled.push({ name, value: label, key, n: v[key]! });
    };
    if (v.teamSize !== undefined) ranged('team_size', 'teamSize', rangeLabel('teamSize', v.teamSize));
    if (v.hourlyCost !== undefined) ranged('hourly_cost', 'hourlyCost', rangeLabel('hourlyCost', v.hourlyCost));
    if (v.afterHoursShare !== undefined) ranged('after_hours', 'afterHoursShare', rangeLabel('afterHoursShare', v.afterHoursShare));
    if (v.monthlyAdSpend !== undefined) ranged('ad_spend', 'monthlyAdSpend', rangeLabel('monthlyAdSpend', v.monthlyAdSpend));
    if (v.annualRevenue !== undefined) ranged('revenue', 'annualRevenue', rangeLabel('annualRevenue', v.annualRevenue));
    if (v.monthlyInquiries !== undefined && v.monthlyInquiries > 0) setValue('inquiries', number(v.monthlyInquiries));
    if (v.avgJobValue !== undefined && v.monthlyInquiries) setValue('job_value', number(v.avgJobValue));
    if (v.prospectsPerMonth !== undefined && v.prospectsPerMonth > 0) {
      setValue('outbound', 'Yes');
      setValue('prospects', number(v.prospectsPerMonth));
      if (v.avgDealValue !== undefined) setValue('deal_value', number(v.avgDealValue));
    }
    for (const key of ['repetitiveHours', 'grossMargin', 'operatingMargin'] as const) if (v[key] !== undefined) loose[key] = v[key];
    if (source) source.value = 'Savings calculator';
    // Older calculator links carried the visitor's own "share agents take on"; newer ones send the
    // model's coverage rate plus levers=…, which isn't an answer, so it stays out of the summary.
    const share = Number(params.get('share'));
    if (!leversParam.length && Number.isFinite(share) && share > 0) calcExtra.share = share;
    $('[data-cf-calc]')?.removeAttribute('hidden');
    showHoursCalc();
    return true;
  }
  function showHoursCalc() {
    if (!hoursCalc || loose.repetitiveHours === undefined) return;
    hoursCalc.textContent = `From your calculator: about ${number(loose.repetitiveHours, 1)} hours a person each week on repetitive work. We’ll use that until you split it by kind of work below.`;
    hoursCalc.hidden = false;
  }

  // ------------------------------------------------------------------ draft (this tab only)
  function saveDraft() {
    if (sent) return;
    try {
      const fields = Array.from(fd().entries())
        .filter(([k]) => !k.startsWith('_'))
        .map(([k, val]) => [k, String(val)] as [string, string]);
      const draft: Draft = { v: 1, step: current, max: maxReached, calc: calcSig, fields, exact: prefilled, loose, skipped: [...skipped], quick };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch { /* storage blocked or full: the form still works */ }
  }
  function loadDraft(): Draft | null {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      const d = raw ? (JSON.parse(raw) as Draft) : null;
      return d && d.v === 1 && Array.isArray(d.fields) ? d : null;
    } catch { return null; }
  }
  function clearDraft() { try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } }
  function applyDraft(d: Draft) {
    // Checkbox groups and radios start from nothing, then take the saved answers.
    const names = new Set(d.fields.map(([k]) => k));
    $$<HTMLInputElement>('input[type="checkbox"]', form).forEach((b) => { b.checked = false; });
    $$<HTMLInputElement>('input[type="radio"]', form).forEach((r) => { if (names.has(r.name)) r.checked = false; });
    for (const [k, val] of d.fields) {
      const el = control(k);
      if (!el) continue;
      if (el instanceof RadioNodeList) {
        Array.from(el as unknown as HTMLInputElement[]).forEach((i) => {
          if (i.type === 'checkbox' || i.type === 'radio') { if (i.value === val) i.checked = true; }
        });
      } else if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
        if (el.value === val) el.checked = true;
      } else {
        (el as Control).value = val;
      }
    }
    prefilled = Array.isArray(d.exact) ? d.exact : [];
    loose = d.loose && typeof d.loose === 'object' ? d.loose : {};
    calcSig = d.calc || '';
    maxReached = Math.max(0, Math.min(LAST, d.max | 0));
    current = Math.max(0, Math.min(maxReached, d.step | 0));
    skipped.clear();
    if (Array.isArray(d.skipped)) d.skipped.forEach((i) => { if (Number.isInteger(i) && i >= 0 && i < LAST) skipped.add(i); });
    quick = d.quick === true;
    showHoursCalc();
  }
  /** True when the visitor has typed or picked anything beyond the defaults. */
  function hasAnswers(): boolean {
    const data = fd();
    for (const [k, val] of data.entries()) {
      const v = String(val).trim();
      if (!v || k.startsWith('_') || k === 'source' || k === 'plan') continue;
      if (v === NOT_SURE || (k === 'preferred_contact' && v === 'Email')) continue;
      return true;
    }
    return false;
  }

  // ------------------------------------------------------------------ summary (what we receive)
  const MODEL_INPUTS = 'Model inputs (typical = our default until the call):';
  function summaryLines(): string[] {
    const data = fd();
    const out: string[] = [`Source: ${str(data, 'source') || 'Contact page'}`];
    if (str(data, 'plan')) out.push(`Engagement model they picked: ${str(data, 'plan')}`);
    const skippedTitles = [...skipped].filter((i) => i < LAST).sort((a, b) => a - b).map((i) => steps[i].title);
    if (quick) out.push('Sent details only (skipped the questions). Ask about the business on the call.');
    else if (skippedTitles.length) out.push(`Skipped: ${skippedTitles.join(', ')}`);
    sections.forEach((section, i) => {
      const lines: string[] = [];
      $$<HTMLElement>('[data-cf-sum]', section).forEach((q) => {
        const name = q.dataset.cfName || '';
        if (!name) return;
        if (outboundMore && outboundMore.contains(q) && !outboundIsOn()) return;
        if (name === 'phone' && !str(data, 'phone')) return;
        let vals = data.getAll(name).map((x) => String(x).trim()).filter(Boolean);
        if (!vals.length) return;
        // Amounts typed as "8k" or "$1,200" read back as the number we used.
        const fmt = q.querySelector<HTMLElement>('[data-cf-format]')?.dataset.cfFormat;
        if (fmt) {
          vals = vals.map((v) => {
            const n = parseAmount(v);
            return Number.isFinite(n) ? (fmt === 'money' ? currency(n) : number(n)) : v;
          });
        }
        lines.push(`${q.dataset.cfSum}: ${vals.join('; ')}`);
      });
      if (!lines.length) return;
      const heading = `${i + 1}. ${steps[i].title.toUpperCase()}${i === 1 ? ' (hours a week, whole team)' : ''}`;
      out.push('', heading, ...lines);
    });
    if (calcExtra.share) out.push('', `From the savings calculator: share of tasks agents take on ${number(calcExtra.share)}%`);

    const est = safeEstimate();
    out.push('', 'PRELIMINARY ESTIMATE (modeled estimate, not a quote)');
    if (!est || !est.ready) {
      out.push(est ? 'Not enough answers for an estimate yet.' : 'Estimate unavailable; we’ll prepare it before the call.');
      return out;
    }
    out.push(`Annual value: ${moneyRangeExact(est.total)} a year (base case to upside, in profit terms)`);
    if (est.hoursPerMonth.high > 0) out.push(`Hours back: ${countRange(est.hoursPerMonth)} a month`);
    for (const l of est.levers) out.push(`- ${l.label} (${kindText(l)}): ${moneyRangeExact(l.value)} a year`);
    if (est.addedRevenue.high > 0) out.push(`Added revenue, for context (not in the total): ${moneyRangeExact(est.addedRevenue)} a year`);
    const off = LEVERS.filter((id) => !est.enabled.includes(id)).map((id) => `${labels[id]} (${(pendingText[est.pending[id] as Pending] || 'not counted').toLowerCase()})`);
    if (off.length) out.push(`Not counted: ${off.join('; ')}`);
    const time = est.levers.find((l) => l.id === 'time');
    if (time) out.push(`Team time basis: ${basisText(est, time)}`);

    const meta = getModel()?.leverInputMeta;
    const typical = new Set(est.typical);
    const withUnit = (val: number, unit = '') => {
      if (unit === '%') return `${number(val, 1)}%`;
      if (unit.startsWith('$')) return `${currency(val)}${unit.slice(1).replace(/^ per /, ' a ').replace(/ a hour$/, ' an hour')}`;
      return `${number(val, 1)}${unit ? ` ${unit}` : ''}`;
    };
    const inputs = (Object.keys(est.inputs) as Key[]).map((k) => {
      const m = meta?.[k];
      return `- ${m ? m.label : k}: ${withUnit(est.inputs[k] as number, m?.unit)}${typical.has(k) ? ' (typical)' : ''}`;
    });
    if (inputs.length) out.push('', MODEL_INPUTS, ...inputs);
    out.push('', `Method: ${form.dataset.methodUrl || ''}`);
    return out;
  }
  const summaryText = () => summaryLines().join('\n');
  /** For mail apps that cut long pre-written emails: every answer, then only the estimate's headline
   *  (annual value, hours back and the method link). */
  function shortSummary(): string {
    const lines = summaryLines();
    const at = lines.findIndex((l) => l.startsWith('PRELIMINARY ESTIMATE'));
    if (at < 0) return lines.join('\n');
    const head = lines.slice(at).filter((l) => /^(PRELIMINARY ESTIMATE|Annual value:|Hours back:|Not enough answers|Estimate unavailable|Method:)/.test(l));
    return [...lines.slice(0, at), ...head].join('\n');
  }

  function collect() {
    const data = fd();
    const obj: Record<string, string | string[]> = {};
    for (const key of new Set(Array.from(data.keys()))) {
      if (key.startsWith('_')) continue;
      const vals = data.getAll(key).map((x) => String(x).trim()).filter(Boolean);
      if ((key === 'phone' || key === 'plan') && !vals.length) continue;
      if (outboundMore && !outboundIsOn() && (key === 'prospects' || key === 'deal_value')) continue;
      obj[key] = key === 'goals' || key === 'tools' ? vals : vals.join(', ');
    }
    return obj;
  }

  // ------------------------------------------------------------------ sending
  function setBusy(on: boolean) {
    busy = on;
    form.setAttribute('aria-busy', on ? 'true' : 'false');
    if (on) submit?.setAttribute('aria-disabled', 'true'); else submit?.removeAttribute('aria-disabled');
    if (submitLabel) { if (on) submitLabel.textContent = 'Sending…'; else submitLabel.innerHTML = submitHtml; }
  }
  function showDone(firstName: string) {
    const thanks = done?.querySelector('[data-cf-thanks]');
    if (thanks) thanks.textContent = firstName ? `Thanks, ${firstName}. We’ve got it.` : 'Thanks. We’ve got it.';
    if (panelWrap) panelWrap.hidden = true;
    if (done) { done.hidden = false; done.focus({ preventScroll: true }); }
    root?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    sent = true;
    window.clearTimeout(saveTimer);
    clearDraft();
    // The panel now shows the estimate that went with the request; its links into the form go quiet.
    const ctx = panel?.querySelector('.est__ctx');
    if (ctx) ctx.textContent = 'Sent with your request';
    panel?.querySelector('.est__back')?.setAttribute('hidden', '');
    if (lastEst) renderPanel(lastEst);
  }
  /** Show a status note under the button and make sure it is on screen. */
  function showNote(note: HTMLElement | null) {
    if (!note) return;
    note.hidden = false;
    window.requestAnimationFrame(() => scrollClear(note));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    if (current < LAST) { goNext(); return; }
    if (errorNote) errorNote.hidden = true;
    for (let i = 0; i <= LAST; i++) {
      if (i !== LAST && skipped.has(i)) continue;
      const bad = validateStep(i);
      if (bad.length) {
        if (i !== current) show(i, { focus: false, scroll: false });
        reveal(bad[0]);
        return;
      }
    }
    const data = collect();
    const who = String(data.company || '') || String(data.name || '');
    const subj = `${form.dataset.subject || 'Free AI assessment request'}${quick ? ' (details only)' : ''}: ${who}`;
    const endpoint = form.dataset.endpoint || '';

    if (!endpoint && form.dataset.emailReady !== 'true') {
      // site.email is still the placeholder: never open an email addressed to it.
      showNote(unconnected);
      return;
    }

    if (!endpoint) {
      // Open the visitor's email app with every answer written out (a real link click, so it behaves like
      // any mailto: link). Long bodies get cut by some mail apps, so drop the model-input block first.
      let body = summaryText();
      if (encodeURIComponent(body).length > 2000) body = shortSummary();
      const link = document.createElement('a');
      link.href = `mailto:${form.dataset.email || ''}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
      link.hidden = true;
      form.append(link);
      link.click();
      link.remove();
      showNote(mailtoNote);
      return;
    }

    setBusy(true);
    try {
      const est = safeEstimate();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          estimate_annual_value: est?.ready ? `${moneyRangeExact(est.total)} a year (modeled estimate)` : 'Not enough answers yet',
          estimate_hours_per_month: est?.ready ? `${countRange(est.hoursPerMonth)} hours a month` : '',
          message: summaryText(),
          _subject: subj,
          _replyto: String(data.email || ''),
          _gotcha: String(new FormData(form).get('_gotcha') ?? ''),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showDone(String(data.name || '').split(/\s+/)[0] || '');
    } catch {
      showNote(errorNote);
    } finally {
      setBusy(false);
    }
  });

  // Copy my answers (while the form isn't connected): clipboard, with a select-and-copy fallback.
  $('[data-cf-copy]', form)?.addEventListener('click', async () => {
    const text = summaryText();
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.append(ta);
        ta.select();
        ok = document.execCommand('copy');
        ta.remove();
      } catch { ok = false; }
    }
    const note = $('[data-cf-copied]', form);
    if (note) { note.textContent = ok ? ' Copied.' : ' Copy didn’t work here; select and copy the answers from the form instead.'; note.hidden = false; }
  });

  // ------------------------------------------------------------------ wiring
  // Leaving a field by clicking the next one must not make that click miss: an error line appearing on
  // blur shifts everything below it, so a mouse click that started on the "Phone call" radio under a
  // mistyped email would end on the wrong element. Checks on blur therefore wait until the click lands
  // (mouse: after the button comes up; touch, keyboard: the next task, after the tap's click).
  let mouseDown = false;
  const queued = new Set<HTMLElement>();
  const flush = () => { const els = [...queued]; queued.clear(); els.forEach((el) => check(el)); };
  const release = () => { if (!mouseDown) return; mouseDown = false; window.setTimeout(flush, 0); };
  document.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') mouseDown = true; }, true);
  document.addEventListener('pointerup', release, true);
  document.addEventListener('pointercancel', release, true);
  const checkSoon = (el: HTMLElement) => { queued.add(el); if (!mouseDown) window.setTimeout(flush, 0); };

  $$<HTMLElement>('[data-cf-validate]', form).forEach((el) => {
    const evt = el.tagName === 'FIELDSET' || el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evt, () => {
      const i = stepOf(el);
      if (attempted.has(i) || el.getAttribute('aria-invalid') === 'true') check(el);
    });
    // Catch a mistyped email, web address or number as soon as the visitor leaves the field.
    if (['email', 'url', 'number'].includes(el.dataset.cfValidate || '')) {
      el.addEventListener('blur', () => { if ((el as Control).value.trim()) checkSoon(el); });
    }
  });

  form.addEventListener('input', () => { update(); window.clearTimeout(saveTimer); saveTimer = window.setTimeout(saveDraft, 400); });
  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.matches('[data-cf-contact]')) { syncPhone(); if (wantsPhone()) phoneInput?.focus(); }
    if (t.name === 'outbound') syncOutbound();
    if (t.name === 'goals') syncGoals();
    update(true);
    saveDraft();
  });

  $('[data-cf-reset]')?.addEventListener('click', () => {
    clearDraft();
    form.reset();
    prefilled = [];
    loose = {};
    calcSig = '';
    openLever = null;
    panel?.classList.remove('has-open');
    if (hoursCalc) hoursCalc.hidden = true;
    $('[data-cf-calc]')?.setAttribute('hidden', '');
    if (restored) restored.hidden = true;
    attempted.clear();
    skipped.clear();
    quick = false;
    $$<HTMLElement>('[data-cf-validate]', form).forEach(clearError);
    maxReached = 0;
    applyContext(new URLSearchParams(window.location.search), true);
    syncPhone(); syncOutbound(); syncGoals(); update();
    show(0);
  });

  // ------------------------------------------------------------------ link context (contactUrl)
  const PLANS: Record<string, string> = { pilot: 'Pilot', managed: 'Managed', partner: 'Partner' };
  /** Applies ?interest=, ?plan= and ?from=. A link's context wins over a saved draft's; with `fresh`
   *  (Start over) the source falls back to the plain contact page when the link carries none. */
  function applyContext(params: URLSearchParams, fresh = false) {
    const from = (params.get('from') || '').replace(/[^a-z0-9/_-]/gi, '').slice(0, 60);
    const plan = PLANS[params.get('plan') || ''] || '';
    const fromCalc = params.get('source') === 'calculator' && !!calcSig;
    if (source && !fromCalc && (from || fresh)) source.value = from ? `Contact page, via ${from}` : 'Contact page';
    if (planField && (plan || fresh)) planField.value = plan;
    const want = contactInterests[params.get('interest') as Interest];
    if (!want || !goalsSet) return;
    const boxes = $$<HTMLInputElement>('input[type="checkbox"]', goalsSet);
    if (boxes.some((b) => b.checked)) return;
    const label = goals.find((g) => g.sub === want)?.label;
    const box = boxes.find((b) => b.value === label);
    if (box) box.checked = true;
  }

  // ------------------------------------------------------------------ start
  const params = new URLSearchParams(window.location.search);
  const sig = params.get('source') === 'calculator' ? params.toString() : '';
  const draft = loadDraft();
  if (draft) applyDraft(draft);
  if (sig && sig !== calcSig) {
    if (applyCalculator(params)) calcSig = sig;
  } else if (sig && prefilled.length + Object.keys(loose).length) {
    $('[data-cf-calc]')?.removeAttribute('hidden');
  }
  applyContext(params);
  if (draft && hasAnswers() && restored) restored.hidden = false;

  syncPhone();
  syncOutbound();
  syncGoals();
  update();
  paint();
  saveDraft();
}
