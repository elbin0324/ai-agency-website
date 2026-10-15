// OWNER: theater. Run time of each demo, summed from its definition's step durations, so the picker on Home
// and the /demos/ chapter nav always match the player's own timecode (AppWindow prints the same total).
// Build-time only: import it in frontmatter, never in a client <script>.
import type { DemoId } from '@/data/services';
import customer from '@/components/demos/customer/customer-demo';
import analyst from '@/components/demos/analyst/analyst-demo';
import assistant from '@/components/demos/assistant/assistant-demo';
import marketing from '@/components/demos/marketing/marketing-demo';
import sales from '@/components/demos/sales/sales-demo';
import consulting from '@/components/demos/consulting/consulting-demo';

const defs = { customer, analyst, assistant, marketing, sales, consulting };

/** Total run time in ms (the sum of step durations). */
export const runtimeMs = Object.fromEntries(
  Object.entries(defs).map(([id, def]) => [id, def.steps.reduce((t, s) => t + s.duration, 0)]),
) as Record<DemoId, number>;

/** "0:43", floored like the player's timecode (AppWindow `fmt`). */
export function clock(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** "43 seconds" / "1 minute 5 seconds", for screen readers (a bare "0:43" reads as a ratio or a time of day). */
export function spoken(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  const part = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;
  return [m ? part(m, 'minute') : '', r || !m ? part(r, 'second') : ''].filter(Boolean).join(' ');
}
