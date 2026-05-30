const EUR_FORMAT = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEur(n: number): string {
  return EUR_FORMAT.format(n);
}

export function formatPct(n: number): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(n) + ' %';
}

export function parseGermanNumber(s: string): number {
  const cleaned = s.trim().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned);
}
