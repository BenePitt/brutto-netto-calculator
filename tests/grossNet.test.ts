import { describe, it, expect } from 'vitest';
import { calculateGrossNet } from '../src/calculator/grossNet.js';
import type { GrossNetInput } from '../src/domain/types.js';

const baseInput: GrossNetInput = {
  grossAmountEuro: 4000,
  period: 'monthly',
  taxYear: 2026,
  taxClass: 1,
  federalState: 'NW',
  churchTax: false,
  childAllowance: 1,
  age: 35,
  healthInsurance: 'statutory',
  statutoryAdditionalHealthRatePercent: 2.9,
  pensionInsuranceMandatory: true,
  unemploymentInsuranceMandatory: true,
  careInsuranceMandatory: true,
  childless: false,
  childrenUnder25: 1,
};

describe('Gesamtrechner – Fall A: 4000€, NRW, 1 Kind', () => {
  const result = calculateGrossNet(baseInput);

  it('SV AN gesamt = 846.00€', () => {
    expect(result.monthly.employeeSocialSecurity.total).toBe(846.00);
  });

  it('KV AN = 350.00€', () => {
    expect(result.monthly.employeeSocialSecurity.health).toBe(350.00);
  });

  it('PV AN = 72.00€', () => {
    expect(result.monthly.employeeSocialSecurity.care).toBe(72.00);
  });

  it('RV AN = 372.00€', () => {
    expect(result.monthly.employeeSocialSecurity.pension).toBe(372.00);
  });

  it('AV AN = 52.00€', () => {
    expect(result.monthly.employeeSocialSecurity.unemployment).toBe(52.00);
  });

  it('Netto monatlich = Brutto - Abgaben', () => {
    const expected = 4000 - result.monthly.taxes.total - result.monthly.employeeSocialSecurity.total;
    expect(result.monthly.net).toBeCloseTo(expected, 2);
  });

  it('Netto jährlich = Netto monatlich × 12', () => {
    expect(result.yearly.net).toBeCloseTo(result.monthly.net * 12, 0);
  });

  it('Keine KiSt wenn nicht aktiviert', () => {
    expect(result.monthly.taxes.churchTax).toBe(0);
  });

  it('Effektive Abgabenquote zwischen 0 und 100', () => {
    expect(result.monthly.effectiveDeductionRate).toBeGreaterThan(0);
    expect(result.monthly.effectiveDeductionRate).toBeLessThan(100);
  });
});

describe('Gesamtrechner – Fall B: 10000€, NRW, 1 Kind', () => {
  const result = calculateGrossNet({ ...baseInput, grossAmountEuro: 10000 });

  it('SV AN gesamt = 1508.92€', () => {
    expect(result.monthly.employeeSocialSecurity.total).toBe(1508.92);
  });

  it('KV AN = 508.59€', () => {
    expect(result.monthly.employeeSocialSecurity.health).toBe(508.59);
  });

  it('PV AN = 104.63€', () => {
    expect(result.monthly.employeeSocialSecurity.care).toBe(104.63);
  });

  it('RV AN = 785.85€', () => {
    expect(result.monthly.employeeSocialSecurity.pension).toBe(785.85);
  });

  it('AV AN = 109.85€', () => {
    expect(result.monthly.employeeSocialSecurity.unemployment).toBe(109.85);
  });
});

describe('Gesamtrechner – Fall C: 4000€, Sachsen, kinderlos ab 23', () => {
  const result = calculateGrossNet({
    ...baseInput,
    federalState: 'SN',
    childless: true,
    childrenUnder25: 0,
    childAllowance: 0,
    age: 35,
  });

  it('PV AN = 116.00€', () => {
    expect(result.monthly.employeeSocialSecurity.care).toBe(116.00);
  });

  it('PV AG = 52.00€', () => {
    expect(result.monthly.employerSocialSecurity.care).toBe(52.00);
  });
});

describe('Gesamtrechner – Kirchensteuer', () => {
  it('Bayern: 8% KiSt', () => {
    const r = calculateGrossNet({ ...baseInput, federalState: 'BY', churchTax: true });
    if (r.monthly.taxes.wageTax > 0) {
      expect(r.monthly.taxes.churchTax).toBeGreaterThan(0);
    }
  });

  it('NRW: 9% KiSt höher als Bayern 8%', () => {
    const rNW = calculateGrossNet({ ...baseInput, grossAmountEuro: 8000, federalState: 'NW', churchTax: true, childAllowance: 0, childless: true, childrenUnder25: 0 });
    const rBY = calculateGrossNet({ ...baseInput, grossAmountEuro: 8000, federalState: 'BY', churchTax: true, childAllowance: 0, childless: true, childrenUnder25: 0 });
    expect(rNW.monthly.taxes.churchTax).toBeGreaterThanOrEqual(rBY.monthly.taxes.churchTax);
  });
});

describe('Gesamtrechner – Jahreseingang', () => {
  it('Jährliche Eingabe ergibt dasselbe Netto wie monatliche × 12', () => {
    const monthly = calculateGrossNet(baseInput);
    const yearly = calculateGrossNet({ ...baseInput, grossAmountEuro: 48000, period: 'yearly' });
    expect(yearly.monthly.net).toBeCloseTo(monthly.monthly.net, 0);
  });
});

describe('Gesamtrechner – Warnhinweise', () => {
  it('Minijob-Warnung bei Brutto ≤ 603€', () => {
    const r = calculateGrossNet({ ...baseInput, grossAmountEuro: 500 });
    expect(r.warnings.some(w => w.code === 'MINIJOB')).toBe(true);
  });

  it('Midijob-Warnung im Übergangsbereich', () => {
    const r = calculateGrossNet({ ...baseInput, grossAmountEuro: 1200 });
    expect(r.warnings.some(w => w.code === 'MIDIJOB')).toBe(true);
  });
});
