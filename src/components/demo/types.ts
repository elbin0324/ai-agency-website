// Shared prop types for the demo chrome (AppWindow, ResultCard). OWNER: demo engine.

/** What AppWindow needs from each step (a DemoStep from demo-engine.ts satisfies it). */
export interface StepMeta {
  label?: string;
  caption: string;
  duration: number;
  transcript?: string | string[];
}

/** One mobile pane tab (DESIGN.md §6.10): `id` matches a `data-pane` in the scene. */
export interface PaneTab {
  id: string;
  label: string;
  /** Shorter label for the phone title bar, where the tabs replace the window title ("Chat" for "Customer chat"). */
  short?: string;
}

export type ProvenanceKind = 'Illustrative example' | 'Modeled estimate';

export interface ResultMetric {
  /** Large value. Every number in it counts up when the card appears ("34", "$9,500", "6.5"). */
  value: string | number;
  /** Small Geist unit after the value ("min", "h", "a year"). */
  unit?: string;
  /** Short label ("Sam's time per prospect"). */
  label: string;
  /** One-line basis in small muted text. */
  basis: string;
  /** false: show the value as is, without counting. */
  count?: boolean;
}

export interface ResultCardProps {
  metrics: ResultMetric[];
  /** Provenance tag(s). Consulting passes both: ['Illustrative example', 'Modeled estimate']. */
  label?: ProvenanceKind | ProvenanceKind[];
  /** Optional mono note under the tiles (assumptions, method). */
  note?: string;
  /** Optional Fraunces title (max 26ch) and context line. */
  title?: string;
  context?: string;
  /** Heading, default "Result" (COPY.md §8.9). */
  heading?: string;
  /** Heading tag level (default 3: demos sit under a section h2). */
  headingLevel?: 2 | 3 | 4;
  /** Footer link target, default /results/#examples. Inside an AppWindow whose `demo` is one of the six ids,
   *  the default is that agent's full-year worked example on /results/ (#example-{id}). */
  mathHref?: string;
  /** Footer link text, default "See the math" ("See a full-year example" with the AppWindow default). */
  mathLabel?: string;
  /** Show the Replay button (default true) and the primary CTA (default true). */
  replay?: boolean;
  cta?: boolean;
  class?: string;
}
