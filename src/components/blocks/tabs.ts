// Accessible tabs behavior for Tabs.astro (WAI-ARIA tabs pattern), also usable by DemoTheater.
//
// Markup contract (Tabs.astro renders it):
//   <div data-tabs [data-activation="manual"]>
//     <div role="tablist" aria-label="…">
//       <button role="tab" id="x-tab-a" aria-controls="x-panel-a" aria-selected="true" tabindex="0" data-tab="a">…</button>
//       <button role="tab" id="x-tab-b" aria-controls="x-panel-b" aria-selected="false" tabindex="-1" data-tab="b">…</button>
//     </div>
//     <div role="tabpanel" id="x-panel-a" aria-labelledby="x-tab-a">…</div>
//     <div role="tabpanel" id="x-panel-b" aria-labelledby="x-tab-b" hidden>…</div>
//   </div>
// Panels are found by aria-controls anywhere in the document, so a tablist can drive panels that live
// elsewhere (DemoTheater: tabs above one window).
//
// Keyboard: Left/Right arrows (wrapping), Home, End. Roving tabindex: only the selected tab is in the
// tab order. activation "auto" (default) selects on arrow; "manual" moves focus and Enter/Space selects.
// Events on the [data-tabs] root:
//   'tabs:change'  (out)  detail { id, index, previousId, tab, panel }  bubbles; fires on user or API selection
//   'tabs:select'  (in)   detail { id, focus? }  lets other scripts select a tab without importing this module

export type TabsChangeDetail = {
  id: string;
  index: number;
  previousId: string | null;
  tab: HTMLElement;
  panel: HTMLElement | null;
};

type Api = { select: (id: string, opts?: { focus?: boolean }) => void };
const registry = new WeakMap<HTMLElement, Api>();

function setup(root: HTMLElement): void {
  if (registry.has(root)) return;
  const list = root.querySelector<HTMLElement>(':scope > [role="tablist"]') ?? root.querySelector<HTMLElement>('[role="tablist"]');
  if (!list) return;
  const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
  if (!tabs.length) return;
  const manual = root.dataset.activation === 'manual';
  const panelOf = (tab: HTMLElement) => {
    const id = tab.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
  };
  const idOf = (tab: HTMLElement) => tab.dataset.tab ?? tab.id;

  const select = (tab: HTMLElement, opts: { focus?: boolean } = {}) => {
    const prev = tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? null;
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      t.classList.toggle('is-on', on);
      const panel = panelOf(t);
      if (panel) panel.hidden = !on;
    });
    if (opts.focus) {
      tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    if (prev !== tab) {
      const detail: TabsChangeDetail = { id: idOf(tab), index: tabs.indexOf(tab), previousId: prev ? idOf(prev) : null, tab, panel: panelOf(tab) };
      root.dispatchEvent(new CustomEvent<TabsChangeDetail>('tabs:change', { bubbles: true, detail }));
    }
  };

  list.addEventListener('click', (e) => {
    const tab = (e.target as Element).closest<HTMLElement>('[role="tab"]');
    if (tab && tabs.includes(tab)) select(tab);
  });

  list.addEventListener('keydown', (e) => {
    const current = (e.target as Element).closest<HTMLElement>('[role="tab"]');
    if (!current || !tabs.includes(current)) return;
    const i = tabs.indexOf(current);
    let next: HTMLElement | null = null;
    if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    else if (manual && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      select(current);
      return;
    }
    if (!next) return;
    e.preventDefault();
    if (manual) {
      next.focus();
      next.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    } else {
      select(next, { focus: true });
    }
  });

  const api: Api = {
    select: (id, opts) => {
      const tab = tabs.find((t) => idOf(t) === id);
      if (tab) select(tab, opts);
    },
  };
  root.addEventListener('tabs:select', (e) => {
    const d = (e as CustomEvent<{ id: string; focus?: boolean }>).detail;
    if (d?.id) api.select(d.id, { focus: d.focus });
  });
  registry.set(root, api);
}

/** Wire up every [data-tabs] under `root` (idempotent). */
export function initTabs(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-tabs]').forEach(setup);
  if (root instanceof HTMLElement && root.matches('[data-tabs]')) setup(root);
}

/** Select a tab by its id (the `id` given to Tabs.astro). Initializes the root if needed. */
export function selectTab(root: HTMLElement, id: string, opts: { focus?: boolean } = {}): void {
  setup(root);
  registry.get(root)?.select(id, opts);
}
