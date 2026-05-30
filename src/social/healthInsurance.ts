import { RATES_2026 } from '../config/rates2026.js';
import { roundCent } from '../domain/money.js';

export interface HealthInsuranceResult {
  an: number;
  ag: number;
}

export function calcHealthInsurance(
  monthlyBruttoEuro: number,
  additionalRatePercent: number,
): HealthInsuranceResult {
  const capped = Math.min(monthlyBruttoEuro, RATES_2026.bbgKvPvMonthly);
  const totalRate = (RATES_2026.gkvBaseRate + additionalRatePercent) / 2 / 100;
  const an = roundCent(capped * totalRate);
  const ag = an;
  return { an, ag };
}

export function calcPrivateHealthInsurance(
  privateHealthMonthlyEuro: number,
): HealthInsuranceResult {
  return {
    an: roundCent(privateHealthMonthlyEuro),
    ag: 0,
  };
}
