// Reveal on scroll (ARCHITECTURE.md, DESIGN.md §9.2).
// Put data-reveal on a block (optionally data-reveal-delay="80" in ms; stagger 0/80/160/240, max 4 steps).
// This adds .is-visible once the element enters the viewport; global.css does the transition.
// Without JS nothing is hidden (the hidden state needs html.js), and with reduced motion
// everything shows at once. BaseLayout calls initReveal() once per page; calling it again
// (e.g. after injecting content) only picks up elements it has not seen.

const SEEN = 'revealBound';

export function initReveal(root: ParentNode = document): void {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter((el) => !el.dataset[SEEN]);
  if (!els.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => {
      el.dataset[SEEN] = '1';
      el.classList.add('is-visible');
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  els.forEach((el) => {
    el.dataset[SEEN] = '1';
    const d = el.getAttribute('data-reveal-delay');
    if (d) el.style.transitionDelay = `${parseInt(d, 10) || 0}ms`;
    io.observe(el);
  });
}
