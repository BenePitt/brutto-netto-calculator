import { RATES_2026 } from '../config/rates2026.js';
import { roundCent } from '../domain/money.js';

export interface UnemploymentResult {
  an: number;
  ag: number;
}

export function calcUnemployment(monthlyBruttoEuro: number): UnemploymentResult {
  const capped = Math.min(monthlyBruttoEuro, RATES_2026.bbgRvAvMonthly);
  const an = roundCent(capped * RATES_2026.avEmployeeRate / 100);
  return { an, ag: an };
}
