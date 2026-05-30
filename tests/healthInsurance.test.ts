import { describe, it, expect } from 'vitest';
import { calcHealthInsurance } from '../src/social/healthInsurance.js';

describe('calcHealthInsurance', () => {
  it('Fall A: 4000€ NRW, Zusatzbeitrag 2.9%, 1 Kind – KV AN = 350.00€', () => {
    const r = calcHealthInsurance(4000, 2.9);
    expect(r.an).toBe(350.00);
    expect(r.ag).toBe(350.00);
  });

  it('Fall B: 10000€ NRW, Zusatzbeitrag 2.9%, 1 Kind – KV AN = 508.59€ (BBG-Kappung)', () => {
    const r = calcHealthInsurance(10000, 2.9);
    expect(r.an).toBe(508.59);
    expect(r.ag).toBe(508.59);
  });

  it('GKV-Grundbeitrag 14.6% korrekt aufgeteilt', () => {
    const r = calcHealthInsurance(2000, 0);
    expect(r.an).toBe(roundTo2(2000 * 0.073));
  });

  it('AN = AG (paritätisch)', () => {
    const r = calcHealthInsurance(3000, 1.5);
    expect(r.an).toBe(r.ag);
  });
});

function roundTo2(n: number): number {
  return Math.round(n * 100) / 100;
}
