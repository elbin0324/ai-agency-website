// OWNER: results (calculator)
// Client behavior for RoiCalculator.astro (both variants). One state per [data-vc] root: the input
// values and the levers that count. Every change recomputes computeLevers() and rewrites the text the
// server rendered, through the same formatters (./view), so server and client never disagree.
// A lever can be counted or left out from two places that stay in step: its checkbox in the worksheet
// and its key in the chart legend. The chart's tooltip follows the pointer over segments and legend
// keys, and keyboard focus on a key; it only repeats values that are on the page anyway.
import {
  carryQuery,
  compactLines,
  computeLevers,
  contactQuery,
  defaults,
  fieldText,
  fromQuery,
  leverIds,
  leverInfo,
  leverInputMeta,
  leverStats,
  money,
  parseField,
  rangeMoney,
  readout,
  sanitize,
  shareText,
  stopIndex,
  valueText,
  type Computed,
  type InputKey,
  type LeverId,
  type Values,
} from './view';

type Field = { key: InputKey; el: HTMLElement; num: HTMLInputElement; range: HTMLInputElement; error: HTMLElement; stops: number[] };
type Lever = { id: LeverId; el: HTMLElement; check: HTMLInputElement | null; btn: HTMLButtonElement | null; panel: HTMLElement | null };
type Side = 'low' | 'high';
type TipTarget = { kind: 'chip'; id: LeverId; el: HTMLElement } | { kind: 'seg'; id: LeverId; side: Side; el: HTMLElement };

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const sideLabel: Record<Side, string> = { low: 'base case', high: 'upside' };

/** Small DOM builder for the tooltip (text only, never HTML strings). */
function el(tag: string, className?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function initCalculator(root: HTMLElement) {
  if (root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const full = root.dataset.variant === 'full';
  const contactBase = root.dataset.contact ?? '/contact/';
  const resultsBase = root.dataset.results ?? '/results/';
  const values: Values = defaults();
  const allLevers = (root.dataset.levers ?? leverIds.join(',')).split(',') as LeverId[];
  let enabled: LeverId[] = [...allLevers];
  let all: Computed = computeLevers(values);
  const q = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const qa = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
  const setText = (node: Element | null, text: string) => { if (node && node.textContent !== text) node.textContent = text; };

  // ---- Fields -------------------------------------------------------------------------------
  const fields: Field[] = qa('[data-field]').flatMap((node) => {
    const key = node.dataset.field as InputKey;
    const num = node.querySelector<HTMLInputElement>('[data-num]');
    const range = node.querySelector<HTMLInputElement>('[data-range]');
    const error = node.querySelector<HTMLElement>('[data-error]');
    if (!key || !(key in leverInputMeta) || !num || !range || !error) return [];
    let stops: number[] = [];
    try { stops = JSON.parse(node.dataset.stops ?? '[]'); } catch { /* fall back below */ }
    if (!stops.length) stops = [leverInputMeta[key].min, leverInputMeta[key].max];
    return [{ key, el: node, num, range, error, stops }];
  });
  const fieldKeys = [...new Set(fields.map((f) => f.key))];

  const showError = (f: Field, on: boolean) => {
    f.error.hidden = !on;
    if (on) f.num.setAttribute('aria-invalid', 'true');
    else f.num.removeAttribute('aria-invalid');
  };
  const paintRange = (f: Field) => {
    const pos = stopIndex(f.stops, values[f.key]);
    f.range.value = String(pos);
    f.range.style.setProperty('--fill', `${(pos / Math.max(f.stops.length - 1, 1)) * 100}%`);
    f.range.setAttribute('aria-valuetext', valueText(f.key, values[f.key]));
  };
  const paintNum = (f: Field) => { f.num.value = fieldText(values[f.key]); };

  // ---- Levers (full variant) ----------------------------------------------------------------
  const levers: Lever[] = qa('[data-lever]').map((node) => ({
    id: node.dataset.lever as LeverId,
    el: node,
    check: node.querySelector<HTMLInputElement>('[data-include]'),
    btn: node.querySelector<HTMLButtonElement>('[data-toggle]'),
    panel: node.querySelector<HTMLElement>('.lv__panel'),
  }));

  const setOpen = (l: Lever, open: boolean) => {
    l.el.dataset.open = String(open);
    l.btn?.setAttribute('aria-expanded', String(open));
    if (l.panel) l.panel.inert = !open;
  };
  const setOn = (l: Lever, on: boolean) => {
    l.el.dataset.on = String(on);
    if (l.check) l.check.checked = on;
    const note = l.el.querySelector<HTMLElement>('[data-off-note]');
    if (note) note.hidden = on;
  };

  // ---- Chart: legend keys, highlight and tooltip --------------------------------------------
  const chart = q('[data-chart]');
  const plot = chart?.querySelector<HTMLElement>('.chart__plot') ?? null;
  const tip = q('[data-tip]');
  const chips = qa<HTMLButtonElement>('[data-legend]');
  let tipTarget: TipTarget | null = null;

  const hideTip = () => {
    tipTarget = null;
    if (tip) tip.hidden = true;
    if (chart) delete chart.dataset.focus;
  };

  const tipRow = (value: number, label: string) => {
    const row = el('p', 'chart-tip__row');
    row.append(el('b', undefined, money(value)), el('span', undefined, label));
    return row;
  };

  const paintTip = () => {
    if (!tip || !plot || !chart || !tipTarget) return;
    const t = tipTarget;
    const res = all.levers.find((l) => l.id === t.id);
    if (!res) return hideTip();
    const on = enabled.includes(t.id);
    const counted = all.levers.filter((l) => enabled.includes(l.id));
    const total = (side: Side) => counted.reduce((s, l) => s + l.value[side], 0);

    const name = el('p', 'vb-tip__name');
    const key = el('span', 'chart-tip__key');
    key.style.setProperty('--k', `var(--viz-${leverInfo[t.id].slot})`);
    name.append(key, document.createTextNode(leverInfo[t.id].name));
    const rows = el('div', 'vb-tip__rows');
    const sides: Side[] = t.kind === 'seg' ? [t.side] : ['low', 'high'];
    sides.forEach((side) => {
      const label = on ? `${sideLabel[side]}, ${shareText(res.value[side], total(side))} of the total` : sideLabel[side];
      rows.append(tipRow(res.value[side], label));
    });
    tip.replaceChildren(name, rows);
    if (!on) tip.append(el('p', 'vb-tip__note', 'Not in the total. Press to count it.'));
    tip.hidden = false;
    if (on) chart.dataset.focus = t.id;
    else delete chart.dataset.focus;

    // Position inside the plot: above a segment, below a legend key; never wider than the plot.
    const box = plot.getBoundingClientRect();
    const anchor = t.el.getBoundingClientRect();
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const cx = anchor.left + anchor.width / 2 - box.left;
    const left = Math.max(0, Math.min(box.width - w, cx - w / 2));
    const top = t.kind === 'seg' ? anchor.top - box.top - h - 8 : anchor.bottom - box.top + 6;
    tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  };

  const showTip = (target: TipTarget) => {
    tipTarget = target;
    paintTip();
  };

  // ---- Render -------------------------------------------------------------------------------
  let liveTimer = 0;
  const render = () => {
    all = computeLevers(values);
    const r = readout(all, enabled);

    // Levers: header range, panel stats and math.
    levers.forEach((l) => {
      const res = all.levers.find((x) => x.id === l.id);
      if (!res) return;
      const on = enabled.includes(l.id);
      setText(l.el.querySelector('[data-o="lv-range"]'), rangeMoney(res.value));
      setText(l.el.querySelector('[data-o="lv-kind"]'), on ? `a year · ${leverInfo[l.id].kind}` : 'a year · not in the total');
      leverStats(res, values).forEach((s, i) => setText(l.el.querySelector(`[data-o="lv-stat-${i}"]`), s.value));
      const rows = l.el.querySelectorAll('[data-o="lv-math"] tr');
      res.math.forEach((m, i) => {
        const tr = rows[i];
        if (!tr) return;
        setText(tr.querySelector('th'), m.label);
        setText(tr.querySelector('td'), m.value);
      });
    });
    qa('[data-o="linked-grossMargin"]').forEach((node) => setText(node, `${fieldText(values.grossMargin)}%`));

    // Readout.
    setText(q('[data-o="count"]'), r.countText);
    setText(q('[data-o="figure"]'), r.figure);
    setText(q('[data-o="figure-sr"]'), r.figureSr);
    setText(q('[data-o="low"]'), r.low);
    setText(q('[data-o="high"]'), r.high);
    setText(q('[data-o="revenue"]'), `${r.revenue} a year`);
    setText(q('[data-o="hours"]'), r.hours);
    setText(q('[data-o="fte"]'), r.fte);
    const revRow = q('[data-o="revenue-row"]');
    if (revRow) revRow.hidden = !r.hasRevenue;
    const hrsRow = q('[data-o="hours-row"]');
    if (hrsRow) hrsRow.hidden = !r.hasHours;
    setText(q('[data-o="breakeven"]'), r.breakEven);
    const beRow = q('[data-o="breakeven-row"]');
    if (beRow) beRow.hidden = r.count === 0;
    root.dataset.empty = String(r.count === 0);

    // Compact: one ledger row per counted lever.
    all.levers.forEach((res) => {
      qa(`[data-o="row-${res.id}"]`).forEach((node) => setText(node, rangeMoney(res.value)));
    });
    const lines = q('[data-o="lines"]');
    if (lines) {
      const ps = lines.querySelectorAll('p');
      compactLines(all, values).forEach((text, i) => setText(ps[i] ?? null, text));
    }

    // Chart: legend keys (pressed = counted), segments, values, table twin.
    const totals = { low: 0, high: 0 };
    all.levers.forEach((res) => {
      const on = enabled.includes(res.id);
      if (on) { totals.low += res.value.low; totals.high += res.value.high; }
      chips.filter((c) => c.dataset.legend === res.id).forEach((c) => c.setAttribute('aria-pressed', String(on)));
      setText(q(`[data-chip-desc="${res.id}"]`), `${rangeMoney(res.value)} a year`);
      qa(`[data-row="${res.id}"]`).forEach((tr) => {
        tr.hidden = !on;
        setText(tr.querySelector('[data-cell="low"]'), money(res.value.low));
        setText(tr.querySelector('[data-cell="high"]'), money(res.value.high));
      });
      (['low', 'high'] as const).forEach((side) => {
        qa(`[data-bar-row="${side}"] [data-seg="${res.id}"]`).forEach((seg) => {
          seg.hidden = !on;
          seg.style.setProperty('--v', String(res.value[side]));
        });
      });
    });
    const lowRow = q('[data-bar-row="low"]');
    const highRow = q('[data-bar-row="high"]');
    lowRow?.style.setProperty('--p', String(totals.high > 0 ? totals.low / totals.high : 0));
    highRow?.style.setProperty('--p', totals.high > 0 ? '1' : '0');
    setText(lowRow?.querySelector('[data-bar-val]') ?? null, money(totals.low));
    setText(highRow?.querySelector('[data-bar-val]') ?? null, money(totals.high));
    setText(q('[data-cell="total-low"]'), money(totals.low));
    setText(q('[data-cell="total-high"]'), money(totals.high));
    q('[data-chart-label]')?.setAttribute('aria-label', r.chartLabel);
    if (chart) chart.dataset.empty = String(r.count === 0);
    const none = q('[data-chart-empty]');
    if (none) none.hidden = r.count > 0;
    if (tipTarget) {
      // A segment that just left the total takes its tooltip with it; a legend key keeps it.
      if (tipTarget.kind === 'seg' && !enabled.includes(tipTarget.id)) hideTip();
      else window.requestAnimationFrame(paintTip);
    }

    // Mobile dock (both variants): the total and the hours back, labeled as a modeled estimate.
    setText(q('[data-o="dock-figure"]'), r.figure);
    setText(q('[data-o="dock-hours"]'), r.hoursShort);
    const dockHours = q('[data-o="dock-hours-wrap"]');
    if (dockHours) dockHours.hidden = !r.hasHours;

    // Links.
    const cta = q<HTMLAnchorElement>('[data-o="cta"]');
    if (cta) cta.href = `${contactBase}${contactQuery(values, enabled, all)}`;
    const carryLevers = enabled.length === allLevers.length ? leverIds : enabled;
    const carry = q<HTMLAnchorElement>('[data-o="full-link"]');
    if (carry) carry.href = `${resultsBase}${carryQuery(values, carryLevers, fieldKeys)}#calculator`;
    qa<HTMLAnchorElement>('[data-more]').forEach((a) => {
      a.href = `${resultsBase}${carryQuery(values, leverIds, fieldKeys, a.dataset.more as LeverId)}#calculator`;
    });

    window.clearTimeout(liveTimer);
    liveTimer = window.setTimeout(() => setText(q('[data-o="live"]'), r.live), 700);
  };

  /** Count a lever in the total or leave it out (from its checkbox or its legend key). */
  const setLeverOn = (id: LeverId, on: boolean) => {
    enabled = on ? leverIds.filter((x) => x === id || enabled.includes(x)) : enabled.filter((x) => x !== id);
    const l = levers.find((x) => x.id === id);
    if (l) setOn(l, on);
    render();
  };

  // ---- Field events ---------------------------------------------------------------------------
  const commit = (f: Field, raw: number, from: 'num' | 'range' | 'set') => {
    values[f.key] = sanitize(f.key, raw);
    fields.filter((g) => g.key === f.key).forEach((g) => {
      if (g !== f || from !== 'num') paintNum(g);
      paintRange(g);
      showError(g, false);
    });
    render();
  };

  fields.forEach((f) => {
    f.range.addEventListener('input', () => commit(f, f.stops[Number(f.range.value)] ?? values[f.key], 'range'));
    f.num.addEventListener('input', () => {
      const raw = f.num.value.trim();
      const n = parseField(raw);
      const m = leverInputMeta[f.key];
      if (raw === '' || !Number.isFinite(n) || n < m.min || n > m.max) { showError(f, raw !== ''); return; }
      commit(f, n, 'num');
    });
    f.num.addEventListener('change', () => {
      const n = parseField(f.num.value.trim());
      commit(f, Number.isFinite(n) ? n : values[f.key], 'set');
    });
    // Arrow keys step through the slider stops, as a number field would.
    f.num.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      const i = stopIndex(f.stops, values[f.key]);
      const next = f.stops[Math.min(f.stops.length - 1, Math.max(0, i + (e.key === 'ArrowUp' ? 1 : -1)))];
      commit(f, next, 'set');
    });
  });

  // ---- Lever events ---------------------------------------------------------------------------
  levers.forEach((l) => {
    l.btn?.addEventListener('click', () => setOpen(l, l.el.dataset.open !== 'true'));
    l.check?.addEventListener('change', () => setLeverOn(l.id, Boolean(l.check?.checked)));
  });

  // "Change" on a shared input: open the lever that owns it and focus the field.
  qa<HTMLButtonElement>('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.goto as InputKey;
      const owner = levers.find((l) => leverInfo[l.id].inputs.includes(key));
      if (owner && owner.el.dataset.open !== 'true') setOpen(owner, true);
      const target = fields.find((f) => f.key === key && owner?.el.contains(f.el));
      if (!target) return;
      window.setTimeout(() => {
        target.el.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
        target.num.focus({ preventScroll: true });
        target.num.select();
      }, reduced() ? 0 : 340);
    });
  });

  q('[data-reset]')?.addEventListener('click', () => {
    Object.assign(values, defaults());
    enabled = [...allLevers];
    fields.forEach((f) => { paintNum(f); paintRange(f); showError(f, false); });
    levers.forEach((l) => setOn(l, true));
    render();
  });

  // ---- Chart events ---------------------------------------------------------------------------
  chips.forEach((chip) => {
    const id = chip.dataset.legend as LeverId;
    chip.addEventListener('click', () => setLeverOn(id, chip.getAttribute('aria-pressed') !== 'true'));
    chip.addEventListener('pointerenter', () => { if (finePointer()) showTip({ kind: 'chip', id, el: chip }); });
    chip.addEventListener('pointerleave', () => { if (tipTarget?.el === chip) hideTip(); });
    chip.addEventListener('focus', () => { if (chip.matches(':focus-visible')) showTip({ kind: 'chip', id, el: chip }); });
    chip.addEventListener('blur', () => { if (tipTarget?.el === chip) hideTip(); });
  });
  const barRows = q('.vb__rows');
  barRows?.addEventListener('pointermove', (e) => {
    if (!finePointer()) return;
    const seg = (e.target as Element | null)?.closest<HTMLElement>('[data-seg]');
    const row = seg?.closest<HTMLElement>('[data-bar-row]');
    if (!seg || !row || seg.hidden) { if (tipTarget?.kind === 'seg') hideTip(); return; }
    const id = seg.dataset.seg as LeverId;
    const side = row.dataset.barRow as Side;
    if (tipTarget?.kind === 'seg' && tipTarget.el === seg) return;
    showTip({ kind: 'seg', id, side, el: seg });
  });
  barRows?.addEventListener('pointerleave', () => { if (tipTarget?.kind === 'seg') hideTip(); });
  root.addEventListener('keydown', (e) => { if (e.key === 'Escape' && tipTarget) hideTip(); });

  // Chart / table toggle.
  const toggle = q<HTMLButtonElement>('[data-chart-toggle]');
  toggle?.addEventListener('click', () => {
    const table = chart?.dataset.view !== 'table';
    if (chart) chart.dataset.view = table ? 'table' : 'chart';
    toggle.setAttribute('aria-pressed', String(table));
    setText(toggle.querySelector('[data-chart-toggle-label]'), table ? 'Show chart' : 'Show table');
    hideTip();
  });

  // ---- Start: numbers carried in the URL (?team=…&levers=…&open=…), then the first paint -------
  root.dataset.instant = 'true';
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => { delete root.dataset.instant; }));
  let openFromUrl: Lever | undefined;
  if (full) {
    const { values: carried, enabled: list, open } = fromQuery(window.location.search);
    const touched = new Set<LeverId>();
    (Object.keys(carried) as InputKey[]).forEach((key) => {
      if (carried[key] === undefined || carried[key] === values[key]) return;
      values[key] = carried[key]!;
      touched.add(leverInputMeta[key].lever);
    });
    if (list) enabled = list;
    if (open) {
      // Asked for one lever: open just that one and count it.
      openFromUrl = levers.find((l) => l.id === open);
      if (openFromUrl && !enabled.includes(open)) enabled = leverIds.filter((id) => id === open || enabled.includes(id));
    }
    levers.forEach((l) => {
      setOn(l, enabled.includes(l.id));
      if (openFromUrl) l.el.dataset.open = String(l === openFromUrl);
      else if (touched.has(l.id)) l.el.dataset.open = 'true';
    });
  }
  levers.forEach((l) => setOpen(l, l.el.dataset.open === 'true'));
  fields.forEach((f) => { paintNum(f); paintRange(f); });
  render();

  // Bring the opened lever into view once the page has settled (after the browser's own jump to
  // #calculator), unless the visitor has already scrolled somewhere else. Side by side (desktop), the
  // sheet's top goes under the header, so the lever and the total are both on screen; stacked
  // (phones), the lever itself does. Positions come from the layout (offsetTop), not the screen, so a
  // reveal animation still in flight can't skew them.
  if (openFromUrl) {
    const target = openFromUrl;
    const pageTop = (node: HTMLElement) => {
      let y = 0;
      for (let n: HTMLElement | null = node; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      return y;
    };
    const bring = () => {
      const top = root.closest('section')?.getBoundingClientRect().top ?? 0;
      const atCalculator = Math.abs(top) < window.innerHeight * 0.75;
      if (!atCalculator && window.scrollY > 0) return;
      const sheet = q('.vc__sheet');
      const sideBySide = sheet ? getComputedStyle(sheet).gridTemplateColumns.trim().split(/\s+/).length > 1 : false;
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      window.scrollTo({ top: Math.max(0, pageTop(sideBySide && sheet ? sheet : target.el) - pad), behavior: 'auto' });
    };
    if (document.readyState === 'complete') window.requestAnimationFrame(bring);
    else window.addEventListener('load', () => window.requestAnimationFrame(bring), { once: true });
  }
}
