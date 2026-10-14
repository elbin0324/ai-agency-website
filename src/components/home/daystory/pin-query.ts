// When the day story pins (shared by DayStory.astro's pre-paint script and day-motion.ts). OWNER: home-daystory.
// Wide and tall enough for the side-by-side stage (>= 1024 x 640) or the stacked tablet stage (>= 768 x 880),
// and only when motion is allowed. Everything else gets the static sequence.
export const PIN_QUERY =
  '(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 640px), ' +
  '(prefers-reduced-motion: no-preference) and (min-width: 768px) and (min-height: 880px)';
