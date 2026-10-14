// Window clock text for the day story ("Mon 7:30 am"). OWNER: home-daystory.
// Dependency-free so the client script can import it without pulling data modules into the bundle.
export function clockText(minutes: number, day = 'Mon'): string {
  const m = Math.round(minutes);
  const h24 = Math.floor(m / 60) % 24;
  const mm = String(m % 60).padStart(2, '0');
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${day} ${h12}:${mm} ${h24 < 12 ? 'am' : 'pm'}`;
}
