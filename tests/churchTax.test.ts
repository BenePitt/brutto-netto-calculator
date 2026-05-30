import { describe, it, expect } from 'vitest';
import { calcChurchTax } from '../src/tax/churchTax.js';

describe('calcChurchTax', () => {
  it('Bayern: 8%', () => {
    expect(calcChurchTax(1000, 'BY')).toBe(80.00);
  });

  it('Baden-Württemberg: 8%', () => {
    expect(calcChurchTax(1000, 'BW')).toBe(80.00);
  });

  it('NRW: 9%', () => {
    expect(calcChurchTax(1000, 'NW')).toBe(90.00);
  });

  it('Sachsen: 9%', () => {
    expect(calcChurchTax(500, 'SN')).toBe(45.00);
  });

  it('rounds to cent', () => {
    expect(calcChurchTax(333.33, 'NW')).toBe(30.00);
  });
});
