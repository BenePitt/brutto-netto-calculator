import { RATES_2026 } from '../config/rates2026.js';
import { roundCent } from '../domain/money.js';

export interface PensionResult {
  an: number;
  ag: number;
}

export function calcPension(monthlyBruttoEuro: number): PensionResult {
  const capped = Math.min(monthlyBruttoEuro, RATES_2026.bbgRvAvMonthly);
  const an = roundCent(capped * RATES_2026.rvEmployeeRate / 100);
  return { an, ag: an };
}
