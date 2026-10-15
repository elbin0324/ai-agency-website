// The interactive hero console (DESIGN.md §9.4; founder, 2026-10-14: "if there's a dashboard on it,
// make it interactive"). OWNER: home-hero. Vanilla, no dependencies beyond the shared figures.
//
// - Agent buttons (sidebar, or chips below 1280px) filter the log, KPIs, hours and head. Pressing the
//   selected agent again, or "All agents", resets the filter.
// - Today / 7 days / 30 days rescale the KPIs, sparkline, hours and how far back the log reaches.
// - Log tabs (All / Needs you / Handoffs) follow the WAI-ARIA tabs pattern (arrows, Home, End).
// - Requests: Review opens the detail over what sits below (Esc, a click outside or tabbing away
//   closes it); Approve and Decline fly the card out, add a "… by you · just now" row to the log and
//   update every count. An empty queue offers "Reset the demo".
// - The live ticker adds a row every 4.6 s and plays its rows in a loop. It holds while the pointer or
//   keyboard focus is inside, for 5 s after any click, under 20% visibility, in a hidden tab and when
//   paused with its own button. Under reduced motion it starts paused, and nothing animates.
// - Phones: period fixed at 7 days and tab at All (both controls hide), 3 log rows.
// The ticker is not announced; every action the visitor takes is, in one polite status line.
import {
  fmtH, fmtN, hoursBack, series, sparkGeometry, subHtml, tasks, tiles, unitText,
  type AgentKey, type ConsoleModel, type Period, type Tally, type Tile, type View,
} from './console-model';

type Outcome = 'approved' | 'declined';
type Data = {
  model: ConsoleModel;
  scene: { day: number; minutes: number };
  lines: Record<string, Record<'pending' | Outcome, string>>;
};

const TICK_MS = 2300; // one console minute; a row every second tick
const COOL_MS = 5000; // hold after a click or key inside the console
const LAST_MINUTE = 23 * 60 + 58; // the shift's clock stops short of midnight
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EASE = 'cubic-bezier(.2, .7, .2, 1)';

const clock = (min: number) => {
  const h = Math.floor(min / 60) % 24;
  return `${((h + 11) % 12) + 1}:${String(min % 60).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};

export function initConsoles(): void {
  document.querySelectorAll<HTMLElement>('[data-console]').forEach(init);
}

function init(root: HTMLElement): void {
  const dataEl = root.querySelector('[data-console-model]');
  if (root.dataset.ready || !dataEl) return;
  root.dataset.ready = '1';
  const { model, scene, lines } = JSON.parse(dataEl.textContent || '{}') as Data;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(width < 48rem)');
  const $ = <T extends HTMLElement = HTMLElement>(sel: string, el: ParentNode = root) => el.querySelector<T>(sel)!;
  const $$ = <T extends HTMLElement = HTMLElement>(sel: string, el: ParentNode = root) => Array.from(el.querySelectorAll<T>(sel));
  const tpl = (sel: string) => $<HTMLTemplateElement>(sel).content;

  const win = $('.app-window');
  const feed = $('[data-feed]');
  const feedCard = $('.con-feed-card');
  const inner = $('[data-feed-inner]');
  const note = $('[data-feed-note]');
  const panel = $('[role="tabpanel"]');
  const list = $('[data-appr-list]');
  const rail = $('[data-rail]');
  const kpis = $('[data-kpis]');
  const hint = $('[data-hint]');
  const liveBtn = $<HTMLButtonElement>('[data-live]');
  const clockEl = root.querySelector<HTMLElement>('[data-clock]');
  const status = $('[data-announce]');
  const liveRows = Array.from(tpl('template[data-live-rows]').children) as HTMLElement[];
  const chip = (o: Outcome) => tpl(`template[data-chip="${o}"]`).firstElementChild!.cloneNode(true);
  /** The "Needs your OK" chips of the request rows, for the reset. */
  const askChips = new Map($$('[data-appr-row]').map((li) => [li, li.lastElementChild!.cloneNode(true)]));

  const state = { agent: 'all' as AgentKey, period: '7d' as Period, tab: 'all', open: '', decided: {} as Record<string, Outcome> };
  const tally: Tally = {};
  const busy = new Set<string>();
  const ids = $$('[data-appr]').map((li) => li.dataset.appr!);
  const pending = () => ids.filter((id) => !state.decided[id]);
  const period = (): Period => (phone.matches ? '7d' : state.period);
  const tab = () => (phone.matches ? 'all' : state.tab);
  const view = (): View => ({
    agent: state.agent,
    period: period(),
    tally,
    pending: pending(),
    approved: ids.filter((id) => state.decided[id] === 'approved'),
  });
  const anim = (el: HTMLElement, cls: string) => {
    if (reduce.matches) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  };

  let annTimer = 0;
  function announce(msg: string): void {
    window.clearTimeout(annTimer);
    status.textContent = '';
    annTimer = window.setTimeout(() => (status.textContent = msg), 80);
  }

  /** Counts a figure to its new value over 700 ms (tabular digits keep it steady). */
  function setNum(el: HTMLElement, to: number, fmt: Tile['fmt'], animate: boolean): void {
    const from = Number(el.dataset.n);
    el.dataset.n = String(to);
    if (!animate || reduce.matches || !Number.isFinite(from) || Math.abs(from - to) < 1e-6) {
      el.textContent = fmtN(to, fmt);
      return;
    }
    const t0 = performance.now();
    const step = (now: number) => {
      if (el.dataset.n !== String(to)) return; // a newer value took over
      const k = Math.min(1, (now - t0) / 700);
      el.textContent = fmtN(from + (to - from) * (1 - (1 - k) ** 3), fmt);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ------------------------------------------------------------------ render

  function renderControls(): void {
    $$('button[data-agent]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.agent === state.agent)));
    $$('button[data-period]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.period === state.period)));
    $$('[role="tab"]').forEach((b) => {
      const on = b.dataset.tab === state.tab;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `con-tab-${state.tab}`);
  }

  function renderAgents(): void {
    for (const id of Object.keys(lines)) {
      const o = state.decided[id];
      $$(`[data-line="${id}"]`).forEach((el) => (el.textContent = lines[id][o ?? 'pending']));
      $$(`[data-state="${id}"]`).forEach((el) => {
        el.classList.toggle('is-you', !o);
        if (el.firstElementChild) el.firstElementChild.textContent = (o ? el.dataset.srOk : el.dataset.srYou) ?? '';
      });
    }
  }

  function renderHead(): void {
    const name = model.names[state.agent];
    $('[data-view-title]').textContent = name;
    const crumb = root.querySelector('[data-crumb]');
    if (crumb) crumb.textContent = name;
    const own = state.agent === 'all' ? pending().length : pending().filter((id) => id === state.agent).length;
    const rest = own
      ? `<span class="you">${own} waiting on you</span>`
      : state.agent === 'all'
        ? 'Nothing waiting on you'
        : (root.querySelector(`[data-line="${state.agent}"]`)?.textContent ?? '');
    const n = tasks(model, state.agent, period(), tally).toLocaleString('en-US');
    $('[data-head-sub]').innerHTML = `<b class="num-tab">${n}</b> tasks ${model.periods[period()].phrase} · ${rest}`;
    $('.con-tools').hidden = state.agent !== 'all';
    $('[data-clear]').hidden = state.agent === 'all';
  }

  function renderKpis(): void {
    const v = view();
    const ts = tiles(model, v);
    $$('[data-kpi]').forEach((el, i) => {
      const t = ts[i];
      const label = $('[data-k-label]', el);
      const same = i === 0 || label.textContent === t.label; // hours always counts; a new metric swaps
      label.textContent = t.label;
      setNum($('[data-k-value]', el), t.n, t.fmt, same);
      $('[data-k-unit]', el).textContent = unitText(t);
      $('[data-k-sub]', el).innerHTML = subHtml(t);
    });
    const g = sparkGeometry(series(model, v));
    $('[data-spark-ctx]').setAttribute('d', g.ctx);
    $('[data-spark-last]').setAttribute('d', g.last);
    $('[data-spark-dot]').setAttribute('cx', String(g.dot[0]));
    $('[data-spark-dot]').setAttribute('cy', String(g.dot[1]));
  }

  function renderHours(): void {
    const bars = $$('[data-hbar]');
    const hrs = bars.map((b) => hoursBack(model, b.dataset.hbar as AgentKey, period(), tally));
    const max = Math.max(...hrs);
    bars.forEach((b, i) => {
      setNum($('[data-hbar-val]', b), hrs[i], 'h', true);
      $('[data-hbar-fill]', b).style.width = `${((hrs[i] / max) * 100).toFixed(1)}%`;
      b.classList.toggle('is-dim', state.agent !== 'all' && state.agent !== b.dataset.hbar);
    });
    $('[data-hours-note]').textContent = model.periods[period()].label;
  }

  const rowsMax = () => parseInt(getComputedStyle(feedCard).getPropertyValue('--rows'), 10) || 6;
  function matches(li: HTMLElement): boolean {
    const p = period();
    const day = Number(li.dataset.day || 0);
    return (
      (state.agent === 'all' || li.dataset.agent === state.agent) &&
      (p === '30d' || (p === '7d' ? day <= 6 : day === 0)) &&
      (tab() === 'all' || li.dataset.status === tab())
    );
  }

  function renderLog(): number {
    const max = rowsMax();
    let n = 0;
    for (const li of Array.from(feed.children) as HTMLElement[]) {
      const show = n < max && matches(li);
      li.hidden = !show;
      if (show) n++;
    }
    // Fewer rows than fit: say so, and offer the next period.
    note.hidden = n >= max;
    if (n < max) {
      const p = period();
      const t = tab();
      const next: Period | '' = t === 'you' ? '' : p === 'today' ? '7d' : p === '7d' ? '30d' : '';
      note.classList.toggle('is-empty', n === 0);
      $('[data-note-text]', note).textContent =
        t === 'you'
          ? n ? 'That’s everything waiting on you.' : 'Nothing is waiting on you.'
          : n ? `That’s everything ${model.periods[p].phrase}.`
            : `No ${t === 'handoff' ? 'handoffs' : 'activity'} ${model.periods[p].phrase}.`;
      const more = $<HTMLButtonElement>('[data-show-period]', note);
      more.hidden = !next || phone.matches;
      if (next) {
        more.dataset.showPeriod = next;
        more.textContent = `Show ${model.periods[next].label}`;
      }
    }
    return n;
  }

  function renderApprovals(): void {
    const left = pending().length;
    // Layout classes first (on desktop the hours card steps aside), then measure the open card.
    list.classList.toggle('has-open', !!state.open);
    rail.classList.toggle('has-open', !!state.open);
    root.classList.toggle('is-reviewing', !!state.open);
    for (const li of $$('[data-appr]')) {
      const id = li.dataset.appr!;
      const open = state.open === id;
      li.hidden = !!state.decided[id];
      li.classList.toggle('is-open', open);
      $('[data-review]', li).setAttribute('aria-expanded', String(open));
      $('.con-appr__detail', li).hidden = !open;
      if (open) {
        // In one column the open card may run past the requests box, down to the window's bottom edge.
        const room = win.getBoundingClientRect().bottom - li.getBoundingClientRect().top - 14;
        li.style.setProperty('--open-max', `${Math.max(240, Math.round(room))}px`);
        clip($('.con-appr__detail', li));
      }
    }
    const count = $('[data-appr-count]');
    count.textContent = String(left);
    count.hidden = left === 0;
    $('[data-appr-done]').hidden = left > 0;
  }

  /** A detail taller than its room scrolls; a soft fade says there is more below. */
  function clip(det: HTMLElement): void {
    det.classList.toggle('is-clipped', det.scrollHeight - det.scrollTop - det.clientHeight > 4);
  }
  $$('.con-appr__detail').forEach((det) => det.addEventListener('scroll', () => clip(det), { passive: true }));

  function render(swap = false): void {
    renderControls();
    renderAgents();
    renderHead();
    renderKpis();
    renderHours();
    renderLog();
    renderApprovals();
    if (swap) {
      anim(kpis, 'is-swap');
      anim(inner, 'is-swap');
    }
  }

  // ------------------------------------------------------------------ the log

  let trim = 0;
  /** Prepends a row; if the filters show it, the list slides down one row while it fades in. */
  function insertRow(li: HTMLElement, animate: boolean): void {
    feed.prepend(li);
    if (!matches(li) || !animate || reduce.matches) {
      renderLog();
      return;
    }
    li.hidden = false;
    li.classList.add('is-new');
    inner.style.transition = 'none';
    inner.style.transform = `translateY(${-li.offsetHeight}px)`;
    void inner.offsetHeight;
    inner.style.transition = '';
    inner.style.transform = '';
    window.clearTimeout(trim);
    trim = window.setTimeout(() => {
      li.classList.remove('is-new');
      renderLog();
    }, 650);
  }

  // ------------------------------------------------------------------ actions

  const hoursLine = () => `${fmtH(hoursBack(model, state.agent, period(), tally))} hours back ${model.periods[period()].phrase}`;

  function setAgent(a: AgentKey): void {
    state.agent = a === state.agent ? 'all' : a; // pressing the selected agent again shows everyone
    state.open = '';
    render(true);
    const chipEl = root.querySelector<HTMLElement>(`.con-chip[data-agent="${state.agent}"]`);
    const strip = chipEl?.parentElement;
    if (chipEl && strip && strip.scrollWidth > strip.clientWidth) {
      const x = chipEl.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
      strip.scrollTo({ left: Math.max(0, x - (strip.clientWidth - chipEl.offsetWidth) / 2), behavior: reduce.matches ? 'auto' : 'smooth' });
    }
    announce(`${state.agent === 'all' ? 'All agents' : model.names[state.agent]}: ${hoursLine()}.`);
  }

  function setPeriod(p: Period): void {
    state.period = p;
    render(true);
    announce(`${model.periods[p].label}: ${hoursLine()}.`);
  }

  function setTab(t: string, focus = false): void {
    state.tab = t;
    renderControls();
    const n = renderLog();
    anim(inner, 'is-swap');
    if (focus) root.querySelector<HTMLElement>(`[data-tab="${t}"]`)?.focus();
    const label = root.querySelector(`[data-tab="${t}"]`)?.textContent ?? '';
    announce(`${label}: ${n ? `${n} ${n === 1 ? 'entry' : 'entries'}` : 'nothing here'}.`);
  }

  function toggleOpen(id: string, focusBack = false): void {
    state.open = state.open === id ? '' : id;
    renderApprovals();
    if (focusBack) root.querySelector<HTMLElement>(`[data-review="${id}"]`)?.focus();
  }

  async function flyOut(li: HTMLElement, dir: number, collapse: boolean): Promise<void> {
    if (reduce.matches || !li.animate) return;
    await li.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${dir * 28}px)` }], { duration: 220, easing: EASE, fill: 'forwards' }).finished;
    if (collapse) {
      await li.animate([{ height: `${li.offsetHeight}px`, marginBottom: '0px' }, { height: '0px', marginBottom: '-8px' }], { duration: 200, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'forwards' }).finished;
    }
  }

  async function decide(id: string, outcome: Outcome): Promise<void> {
    if (state.decided[id] || busy.has(id)) return;
    const li = $(`[data-appr="${id}"]`);
    const what = li.querySelector('.con-appr__what')?.firstChild?.textContent?.trim() ?? '';
    const hadFocus = li.contains(document.activeElement);
    busy.add(id);
    await flyOut(li, outcome === 'approved' ? 1 : -1, state.open !== id);
    busy.delete(id);
    state.decided[id] = outcome;
    if (state.open === id) state.open = '';

    // The request's own row changes its chip; a new row records who decided, and when.
    const ask = feed.querySelector<HTMLElement>(`[data-appr-row="${id}"]`);
    if (ask) {
      ask.dataset.status = outcome;
      ask.lastElementChild?.replaceWith(chip(outcome));
    }
    const row = tpl('template[data-decisions]').querySelector(`[data-decision="${id}-${outcome}"]`)!.cloneNode(true) as HTMLElement;
    $('.con-row__time', row).textContent = clock(minutes);

    renderControls();
    renderAgents();
    renderHead();
    renderKpis();
    renderApprovals();
    li.getAnimations().forEach((a) => a.cancel());
    insertRow(row, true);

    const left = pending().length;
    announce(`${outcome === 'approved' ? 'Approved' : 'Declined'}: ${what}. Added to the activity log. ${
      left ? `${left} request${left === 1 ? '' : 's'} still waiting on you.` : 'All caught up.'}`);
    if (hadFocus) {
      const nextReview = root.querySelector<HTMLElement>('[data-appr]:not([hidden]) [data-review]');
      (nextReview ?? $('[data-reset]')).focus({ preventScroll: true });
    }
  }

  function reset(): void {
    state.decided = {};
    state.open = '';
    state.agent = 'all';
    state.period = '7d';
    state.tab = 'all';
    feed.querySelectorAll('[data-decision]').forEach((li) => li.remove());
    askChips.forEach((c, li) => {
      li.dataset.status = 'you';
      li.lastElementChild?.replaceWith(c.cloneNode(true));
    });
    render(true);
    announce(`Demo reset. ${ids.length} requests are waiting on you.`);
    root.querySelector<HTMLElement>('[data-appr] [data-review]')?.focus({ preventScroll: true });
  }

  // ------------------------------------------------------------------ live ticker

  let minutes = scene.minutes;
  let ticks = 0;
  let next = 0;
  let timer = 0;
  let userLive = !reduce.matches; // reduced motion: the feed starts paused; its button starts it
  let visible = false;
  let hover = false;
  let keyFocus = false;
  let coolUntil = 0;

  const running = () => userLive && visible && !document.hidden && !hover && !keyFocus && Date.now() >= coolUntil && minutes < LAST_MINUTE;

  function sync(): void {
    const run = running();
    if (run && !timer) timer = window.setInterval(tick, TICK_MS);
    else if (!run && timer) {
      window.clearInterval(timer);
      timer = 0;
    }
    liveBtn.classList.toggle('is-off', !userLive);
    liveBtn.classList.toggle('is-held', userLive && !run);
    $('[data-live-label]', liveBtn).textContent = userLive ? 'Live' : 'Paused';
    $('[data-live-sr]', liveBtn).textContent = userLive ? ': pause updates' : ': resume updates';
  }

  function addLive(): void {
    const li = liveRows[next++ % liveRows.length].cloneNode(true) as HTMLElement;
    $('.con-row__time', li).textContent = clock(minutes);
    const fx: Record<string, number> = { tasks: 1, ...JSON.parse(li.dataset.effect || '{}') };
    const t = (tally[li.dataset.agent!] ??= {});
    for (const k in fx) t[k] = (t[k] ?? 0) + fx[k];
    renderHead();
    renderKpis();
    renderHours();
    insertRow(li, true);
  }

  function tick(): void {
    if (!running()) return sync();
    minutes += 1;
    if (clockEl) clockEl.textContent = `${DAYS[scene.day]} ${clock(minutes)}`;
    if (++ticks % 2 === 1) addLive();
  }

  function hold(): void {
    coolUntil = Date.now() + COOL_MS;
    sync();
    window.setTimeout(sync, COOL_MS + 50);
  }

  function toggleLive(): void {
    userLive = !userLive;
    if (userLive) {
      coolUntil = 0;
      addLive(); // immediate proof that it's running again
    }
    sync();
    announce(userLive ? 'Live updates on.' : 'Live updates paused.');
  }

  // ------------------------------------------------------------------ hint

  let hintDone = false;
  try {
    hintDone = sessionStorage.getItem('halyard-console-hint') === '1';
  } catch {
    /* storage blocked: show the hint */
  }
  if (!hintDone) {
    hint.hidden = false;
    window.setTimeout(() => hint.classList.add('is-on'), reduce.matches ? 0 : 900);
  }
  function dismissHint(): void {
    if (hintDone) return;
    hintDone = true;
    hint.classList.remove('is-on');
    window.setTimeout(() => (hint.hidden = true), reduce.matches ? 0 : 500);
    try {
      sessionStorage.setItem('halyard-console-hint', '1');
    } catch {
      /* fine: it only comes back on the next visit */
    }
  }

  // ------------------------------------------------------------------ events

  root.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('button');
    if (!b || !root.contains(b)) return;
    dismissHint();
    hold();
    const d = b.dataset;
    if (d.agent) setAgent(d.agent as AgentKey);
    else if (b.hasAttribute('data-clear')) setAgent('all');
    else if (d.period) setPeriod(d.period as Period);
    else if (d.showPeriod) setPeriod(d.showPeriod as Period);
    else if (d.tab) setTab(d.tab);
    else if (d.review) toggleOpen(d.review);
    else if (d.decide) void decide(d.decide, d.outcome as Outcome);
    else if (b.hasAttribute('data-reset')) reset();
    else if (b.hasAttribute('data-live')) toggleLive();
  });

  // An open request closes on a click outside it, on Esc, or when keyboard focus leaves it.
  document.addEventListener('click', (e) => {
    if (state.open && !(e.target as Element).closest?.('.con-appr__item.is-open')) toggleOpen(state.open);
  });
  // On the document: Safari doesn't focus a clicked button, so the key may not come from inside.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.open) toggleOpen(state.open, root.contains(document.activeElement));
  });
  list.addEventListener('focusout', (e) => {
    const to = e.relatedTarget as Node | null;
    const open = root.querySelector('.con-appr__item.is-open');
    if (open && to && !open.contains(to)) toggleOpen(state.open);
  });

  const tabList = root.querySelector<HTMLElement>('[role="tablist"]');
  tabList?.addEventListener('keydown', (e) => {
    const all = $$('[role="tab"]');
    const i = all.indexOf(document.activeElement as HTMLElement);
    const keys: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: all.length - 1 };
    const j = keys[e.key];
    if (i < 0 || j === undefined) return;
    e.preventDefault();
    dismissHint();
    hold();
    setTab(all[(j + all.length) % all.length].dataset.tab!, true);
  });

  win.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return; // a tap is a click: it gets the 5 s hold instead
    hover = true;
    sync();
  });
  win.addEventListener('pointerleave', () => {
    hover = false;
    sync();
  });
  // Keyboard focus holds the feed; a mouse click's focus does not (it gets the hold above).
  root.addEventListener('focusin', (e) => {
    try {
      keyFocus = (e.target as Element).matches(':focus-visible');
    } catch {
      keyFocus = false; // a browser without :focus-visible
    }
    sync();
  });
  root.addEventListener('focusout', (e) => {
    if (root.contains(e.relatedTarget as Node | null)) return;
    keyFocus = false;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  phone.addEventListener?.('change', () => render());
  reduce.addEventListener?.('change', () => {
    if (reduce.matches) userLive = false;
    sync();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => (visible = en.isIntersecting && en.intersectionRatio >= 0.2));
        sync();
      },
      { threshold: [0, 0.2, 0.5] },
    ).observe(win);
  } else {
    visible = true;
  }

  liveBtn.hidden = false;
  render();
  sync();
}
