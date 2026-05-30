import { RATES_2026, PV_RATES_NON_SAXONY, PV_RATES_SAXONY } from '../config/rates2026.js';
import { roundCent } from '../domain/money.js';

export interface CareInsuranceResult {
  an: number;
  ag: number;
}

function getPvRateIndex(childless: boolean, age: number, childrenUnder25: number): number {
  if (childless && age >= 23) return 0;
  if (childrenUnder25 === 0) return 1;
  return Math.min(childrenUnder25, 5);
}

export function calcCareInsurance(
  monthlyBruttoEuro: number,
  childless: boolean,
  age: number,
  childrenUnder25: number,
  isSaxony: boolean,
): CareInsuranceResult {
  const capped = Math.min(monthlyBruttoEuro, RATES_2026.bbgKvPvMonthly);
  const rateTable = isSaxony ? PV_RATES_SAXONY : PV_RATES_NON_SAXONY;
  const idx = getPvRateIndex(childless, age, childrenUnder25);
  const rates = rateTable[idx];
  return {
    an: roundCent(capped * rates.an / 100),
    ag: roundCent(capped * rates.ag / 100),
  };
}
