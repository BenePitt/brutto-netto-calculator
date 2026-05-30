import { CHURCH_TAX_RATE } from '../config/rates2026.js';
import type { FederalStateCode } from '../domain/types.js';
import { roundCent } from '../domain/money.js';

export function calcChurchTax(wageTaxBase: number, state: FederalStateCode): number {
  const rate = CHURCH_TAX_RATE[state];
  return roundCent(wageTaxBase * rate / 100);
}
