// When the day story pins (shared by DayStory.astro's pre-paint script and day-motion.ts). OWNER: home-daystory.
// Wide and tall enough for the side-by-side stage (>= 1024 x 560) or the stacked tablet stage (>= 768 x 880),
// and only when motion is allowed. Everything else gets the static sequence (with scroll-built reveals when
// motion is allowed). 560 covers common laptop windows: 1366 x 768 screens (about 1366 x 630 of page) and
// 1920 x 1080 screens at 150% (about 1280 x 590).
export const PIN_QUERY =
  '(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 560px), ' +
  '(prefers-reduced-motion: no-preference) and (min-width: 768px) and (min-height: 880px)';
