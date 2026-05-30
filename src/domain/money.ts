const EUR_FORMAT = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const NUM_FORMAT = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PCT_FORMAT = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function formatEur(n: number): string {
  return EUR_FORMAT.format(n);
}

export function formatNum(n: number): string {
  return NUM_FORMAT.format(n);
}

export function formatPct(n: number): string {
  return PCT_FORMAT.format(n) + ' %';
}

export function parseGermanNumber(s: string): number {
  const cleaned = s.trim().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const val = parseFloat(cleaned);
  return isNaN(val) ? NaN : val;
}

export function roundCent(n: number): number {
  return Math.round(n * 100) / 100;
}

export function floorCent(n: number): number {
  return Math.floor(n * 100) / 100;
}
