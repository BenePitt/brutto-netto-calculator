import { describe, it, expect } from 'vitest';
import { parseGermanNumber, roundCent, formatEur, formatPct } from '../src/domain/money.js';

describe('parseGermanNumber', () => {
  it('parses integer', () => expect(parseGermanNumber('4000')).toBe(4000));
  it('parses with comma decimal', () => expect(parseGermanNumber('4.000,50')).toBe(4000.5));
  it('parses simple comma', () => expect(parseGermanNumber('2,9')).toBe(2.9));
  it('returns NaN for empty string', () => expect(parseGermanNumber('')).toBeNaN());
  it('returns NaN for non-numeric', () => expect(parseGermanNumber('abc')).toBeNaN());
  it('trims whitespace', () => expect(parseGermanNumber(' 1.234,56 ')).toBe(1234.56));
});

describe('roundCent', () => {
  it('rounds up above half', () => expect(roundCent(1.006)).toBe(1.01));
  it('rounds half down', () => expect(roundCent(1.004)).toBe(1.00));
  it('handles already rounded', () => expect(roundCent(100.00)).toBe(100.00));
  it('handles zero', () => expect(roundCent(0)).toBe(0));
});

describe('formatEur', () => {
  it('formats with Euro sign and German locale', () => {
    const result = formatEur(1234.56);
    expect(result).toContain('1.234,56');
    expect(result).toContain('€');
  });
  it('formats zero', () => expect(formatEur(0)).toContain('0,00'));
});

describe('formatPct', () => {
  it('formats percentage', () => expect(formatPct(2.9)).toContain('2,9'));
});
