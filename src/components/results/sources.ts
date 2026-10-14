// OWNER: results
// The sources the methodology lists: only the ids the numbers on this site actually use (roi.ts,
// worth.ts, scenarios.ts and consulting.ts, including ids named in the consulting footnote), resolved
// against benchmarks.ts and grouped by domain in the order of content/BENCHMARKS.md.
import { sources, type Source } from '@/data/benchmarks';
import { roiAssumptions } from '@/data/roi';
import { worthExamples } from '@/data/worth';
import { scenarios } from '@/data/scenarios';
import { providers, footnote } from '@/data/consulting';

const groupNames: [prefix: string, name: string][] = [
  ['lab', 'Labor costs'],
  ['time', 'Time on repetitive work'],
  ['ai', 'AI time savings'],
  ['cx', 'Customer conversations and lead response'],
  ['mkt', 'Paid marketing'],
  ['sales', 'Sales outreach'],
  ['pnl', 'Industry margins and cost-saving levers'],
  ['cons', 'Consulting costs'],
];

const idPattern = /\b(?:lab|time|ai|cx|mkt|sales|pnl|cons)-\d+\b/g;

export function referencedIds(): Set<string> {
  const ids = new Set<string>();
  const add = (list: string[]) => list.forEach((id) => ids.add(id));
  roiAssumptions.forEach((a) => add(a.sources));
  worthExamples.forEach((e) => add(e.sources));
  scenarios.forEach((s) => add(s.sources));
  providers.forEach((p) => add(p.sources));
  add(footnote.match(idPattern) ?? []);
  return ids;
}

const order = (id: string) => Number(id.split('-')[1] ?? 0);

export type SourceGroup = { prefix: string; name: string; items: Source[] };

export function sourceGroups(): SourceGroup[] {
  const ids = referencedIds();
  const used = sources.filter((s) => ids.has(s.id));
  return groupNames
    .map(([prefix, name]) => ({
      prefix,
      name,
      items: used.filter((s) => s.id.split('-')[0] === prefix).sort((a, b) => order(a.id) - order(b.id)),
    }))
    .filter((g) => g.items.length > 0);
}

/** In-page anchor of a source in the methodology list. */
export const sourceHref = (id: string) => `#src-${id}`;
