import { describe, it, expect } from 'vitest';
import { calcCareInsurance } from '../src/social/careInsurance.js';

describe('calcCareInsurance', () => {
  it('Fall A: 4000€ NRW, 1 Kind – PV AN = 72.00€', () => {
    const r = calcCareInsurance(4000, false, 35, 1, false);
    expect(r.an).toBe(72.00);
    expect(r.ag).toBe(72.00);
  });

  it('Fall B: 10000€ NRW, 1 Kind – PV AN = 104.63€ (BBG-Kappung)', () => {
    const r = calcCareInsurance(10000, false, 35, 1, false);
    expect(r.an).toBe(104.63);
    expect(r.ag).toBe(104.63);
  });

  it('Fall C: 4000€ Sachsen, kinderlos ab 23 – PV AN = 116.00€, PV AG = 52.00€', () => {
    const r = calcCareInsurance(4000, true, 35, 0, true);
    expect(r.an).toBe(116.00);
    expect(r.ag).toBe(52.00);
  });

  it('NRW kinderlos ab 23 – AN 2.40%', () => {
    const r = calcCareInsurance(4000, true, 30, 0, false);
    expect(r.an).toBe(Math.round(4000 * 0.024 * 100) / 100);
    expect(r.ag).toBe(Math.round(4000 * 0.018 * 100) / 100);
  });

  it('NRW kinderlos unter 23 – gleiche Rate wie 1 Kind', () => {
    const r = calcCareInsurance(4000, true, 22, 0, false);
    expect(r.an).toBe(72.00);
  });

  it('NRW 2 Kinder – AN 1.55%', () => {
    const r = calcCareInsurance(4000, false, 35, 2, false);
    expect(r.an).toBe(Math.round(4000 * 0.0155 * 100) / 100);
  });

  it('NRW 5+ Kinder – AN 0.80%', () => {
    const r = calcCareInsurance(4000, false, 35, 5, false);
    expect(r.an).toBe(Math.round(4000 * 0.008 * 100) / 100);
  });

  it('Sachsen 1 Kind – AN 2.30%, AG 1.30%', () => {
    const r = calcCareInsurance(4000, false, 35, 1, true);
    expect(r.an).toBe(Math.round(4000 * 0.023 * 100) / 100);
    expect(r.ag).toBe(Math.round(4000 * 0.013 * 100) / 100);
  });
});
