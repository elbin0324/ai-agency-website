// Live hero console (DESIGN.md §9.4). OWNER: home-hero.
// A new log row slides in about every 4.6 s, the clock ticks a minute every 2.3 s and the counters
// count up (700 ms). It runs only while at least 20% of the window is on screen and the tab is
// visible, plays its live rows once (no visible loop), and does nothing under reduced motion:
// the server-rendered rows, clock and counters are the static final state.
//
// Markup contract (HeroConsole.astro):
//   [data-console][data-day][data-minutes]   root (one per console; every instance is initialized)
//   [data-feed]                              the <ol> of rows, newest first
//   template[data-live-rows] > li            rows to play, in order; data-inquiry / data-resolved /
//                                            data-minutes / data-agent describe each row's effect
//   [data-clock] [data-live]                 title-bar clock and the Live indicator (hidden until running)
//   [data-count="tasks|hours|resolved|inquiries"]  counters
//   [data-hbar="<agent>"] > [data-hbar-val] + [data-hbar-fill]   hours-back bars

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TICK_MS = 2300; // one console minute; a row every second tick (4.6 s)
const MAX_ROWS = 6;

function clockLabel(day: number, minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = String(minutes % 60).padStart(2, '0');
  const h12 = ((h + 11) % 12) + 1;
  return `${DAYS[day % 7]} ${h12}:${m} ${h < 12 ? 'am' : 'pm'}`;
}

function timeLabel(minutes: number): string {
  return clockLabel(0, minutes).slice(4);
}

/** Count a number from its current text to `to` over 700 ms (tabular figures keep it steady). */
function countTo(el: HTMLElement | null, to: number, decimals = 0): void {
  if (!el) return;
  const from = parseFloat(el.textContent || '0') || 0;
  if (from === to) return;
  const start = performance.now();
  const dur = 700;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (from + (to - from) * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function init(root: HTMLElement): void {
  if (root.dataset.consoleReady) return;
  root.dataset.consoleReady = '1';

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;

  const feed = root.querySelector<HTMLOListElement>('[data-feed]');
  const tpl = root.querySelector<HTMLTemplateElement>('template[data-live-rows]');
  const win = root.querySelector<HTMLElement>('.app-window');
  if (!feed || !tpl || !win) return;

  const queue = Array.from(tpl.content.children) as HTMLLIElement[];
  const clock = root.querySelector<HTMLElement>('[data-clock]');
  const live = root.querySelector<HTMLElement>('[data-live]');
  const count = (k: string) => root.querySelector<HTMLElement>(`[data-count="${k}"]`);

  let day = Number(root.dataset.day ?? 2);
  let minutes = Number(root.dataset.minutes ?? 0);
  let tasks = parseInt(count('tasks')?.textContent || '0', 10);
  let resolved = parseInt(count('resolved')?.textContent || '0', 10);
  let inquiries = parseInt(count('inquiries')?.textContent || '0', 10);

  // Hours back per agent, read from the bars so the markup stays the single source.
  const bars = new Map<string, { hours: number; val: HTMLElement | null; fill: HTMLElement | null }>();
  root.querySelectorAll<HTMLElement>('[data-hbar]').forEach((b) => {
    bars.set(b.dataset.hbar!, {
      hours: parseFloat(b.dataset.hours || '0'),
      val: b.querySelector('[data-hbar-val]'),
      fill: b.querySelector('[data-hbar-fill]'),
    });
  });

  let tick = 0;
  let visible = false;
  let timer: number | undefined;

  const running = () => visible && !document.hidden && !motion.matches;

  function addRow(): void {
    const next = queue.shift();
    if (!next || !feed) return;
    const li = next.cloneNode(true) as HTMLLIElement;
    const time = li.querySelector('.con-row__time');
    if (time) time.textContent = timeLabel(minutes);

    // Slide the list down by one row while the new row fades in on top and the oldest visible
    // row fades out at the bottom (the wrapper clips the overflow, so the page never shifts).
    feed.children[MAX_ROWS - 1]?.classList.add('is-leaving');
    feed.prepend(li);
    li.classList.add('is-new');
    const h = li.offsetHeight;
    feed.style.transition = 'none';
    feed.style.transform = `translateY(${-h}px)`;
    void feed.offsetHeight;
    feed.style.transition = '';
    feed.style.transform = '';
    window.setTimeout(() => {
      while (feed.children.length > MAX_ROWS) feed.lastElementChild?.remove();
      li.classList.remove('is-new');
    }, 800);

    // Counters
    tasks += 1;
    countTo(count('tasks'), tasks);
    if (li.dataset.inquiry) {
      inquiries += 1;
      countTo(count('inquiries'), inquiries);
    }
    if (li.dataset.resolved) {
      resolved += 1;
      countTo(count('resolved'), resolved);
    }
    const mins = Number(li.dataset.minutes || 0);
    const bar = bars.get(li.dataset.agent || '');
    if (mins && bar) {
      bar.hours += mins / 60;
      countTo(bar.val, Math.round(bar.hours * 10) / 10, 1);
      const max = Math.max(...Array.from(bars.values(), (b) => b.hours));
      bars.forEach((b) => {
        if (b.fill) b.fill.style.width = `${((b.hours / max) * 100).toFixed(1)}%`;
      });
      const total = Array.from(bars.values()).reduce((t, b) => t + b.hours, 0);
      countTo(count('hours'), Math.round(total * 10) / 10, 1);
    }
  }

  function step(): void {
    if (!running()) return;
    tick += 1;
    minutes += 1;
    if (minutes >= 24 * 60) {
      minutes -= 24 * 60;
      day = (day + 1) % 7;
    }
    if (clock) clock.textContent = clockLabel(day, minutes);
    if (tick % 2 === 1 && queue.length) addRow();
  }

  function sync(): void {
    if (running() && timer === undefined) {
      timer = window.setInterval(step, TICK_MS);
    } else if (!running() && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  }

  if (live) live.hidden = false;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible = e.isIntersecting && e.intersectionRatio >= 0.2;
        });
        sync();
      },
      { threshold: [0, 0.2, 0.5] },
    ).observe(win);
  } else {
    visible = true;
    sync();
  }

  document.addEventListener('visibilitychange', sync);
  motion.addEventListener?.('change', () => {
    if (motion.matches && live) live.hidden = true;
    sync();
  });
}

export function initConsoles(): void {
  document.querySelectorAll<HTMLElement>('[data-console]').forEach(init);
}
