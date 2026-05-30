import { describe, it, expect } from 'vitest';
import { calcPension } from '../src/social/pension.js';

describe('calcPension', () => {
  it('Fall A: 4000€ – RV AN = 372.00€', () => {
    expect(calcPension(4000).an).toBe(372.00);
  });

  it('Fall B: 10000€ – RV AN = 785.85€ (BBG 8450€)', () => {
    expect(calcPension(10000).an).toBe(785.85);
  });

  it('AN = AG', () => {
    const r = calcPension(3000);
    expect(r.an).toBe(r.ag);
  });

  it('über BBG wird gekappt', () => {
    const r1 = calcPension(8450);
    const r2 = calcPension(10000);
    expect(r1.an).toBe(r2.an);
  });
});
