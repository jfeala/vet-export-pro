/**
 * Format an ISO date string (YYYY-MM-DD) to EU format (dd/mm/yyyy).
 * Returns "—" for empty/invalid input.
 */
export function formatDateEU(isoDate: string): string {
  if (!isoDate) return "\u2014";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return "\u2014";
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}
