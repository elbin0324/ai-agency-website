// Number formatting (DESIGN.md §3.5 number formats): $12,400 · $4.2K only when space forces it ·
// 18.5 h · 12% · 2.1x ROAS. Everything is en-US and deterministic (same output on server and client),
// so these helpers are safe in frontmatter and in client scripts alike.

const nf = (opts: Intl.NumberFormatOptions) => new Intl.NumberFormat('en-US', opts);

/** $12,400 (whole dollars by default). currency(1234.5, { cents: true }) -> $1,234.50 */
export function currency(value: number, opts: { cents?: boolean; currency?: string } = {}): string {
  const digits = opts.cents ? 2 : 0;
  return nf({ style: 'currency', currency: opts.currency ?? 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

/** 12,400 · number(18.46, 1) -> 18.5 (trailing zeros dropped: number(18, 1) -> 18) */
export function number(value: number, maxDecimals = 0): string {
  return nf({ maximumFractionDigits: maxDecimals }).format(value);
}

/**
 * Percent. Pass a ratio by default: percent(0.12) -> 12%. percent(12, { ratio: false }) -> 12%.
 * decimals: max fraction digits (default 0). signed: +12% / -4% (for deltas).
 */
export function percent(value: number, opts: { decimals?: number; ratio?: boolean; signed?: boolean } = {}): string {
  const v = opts.ratio === false ? value / 100 : value;
  return nf({ style: 'percent', maximumFractionDigits: opts.decimals ?? 0, signDisplay: opts.signed ? 'exceptZero' : 'auto' }).format(v);
}

/** Compact figure for tight spaces only: compact(4200) -> 4.2K · compact(4200, { currency: true }) -> $4.2K · 1.25M */
export function compact(value: number, opts: { currency?: boolean; decimals?: number } = {}): string {
  const s = nf({ notation: 'compact', maximumFractionDigits: opts.decimals ?? 1 }).format(Math.abs(value));
  return `${value < 0 ? '-' : ''}${opts.currency ? '$' : ''}${s}`;
}

/** Hours with the site's unit style: hours(18.46) -> "18.5 h" · hours(36, { unit: 'hrs' }) -> "36 hrs" · { unit: false } -> "18.5" */
export function hours(value: number, opts: { decimals?: number; unit?: 'h' | 'hrs' | 'hours' | false } = {}): string {
  const n = number(value, opts.decimals ?? 1);
  const unit = opts.unit === undefined ? 'h' : opts.unit;
  return unit ? `${n} ${unit}` : n;
}

/** Ratio such as ROAS: multiple(2.14) -> "2.1x" */
export function multiple(value: number, decimals = 1): string {
  return `${number(value, decimals)}x`;
}
