import { describe, it, expect } from 'vitest';
import { calcUnemployment } from '../src/social/unemployment.js';

describe('calcUnemployment', () => {
  it('Fall A: 4000€ – AV AN = 52.00€', () => {
    expect(calcUnemployment(4000).an).toBe(52.00);
  });

  it('Fall B: 10000€ – AV AN = 109.85€ (BBG 8450€)', () => {
    expect(calcUnemployment(10000).an).toBe(109.85);
  });

  it('AN = AG', () => {
    const r = calcUnemployment(3000);
    expect(r.an).toBe(r.ag);
  });

  it('über BBG wird gekappt', () => {
    const r1 = calcUnemployment(8450);
    const r2 = calcUnemployment(12000);
    expect(r1.an).toBe(r2.an);
  });
});
