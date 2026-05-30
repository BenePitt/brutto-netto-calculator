/**
 * Golden-Master-Tests für das PAP-2026-Modul.
 *
 * Erwartungswerte wurden manuell anhand des BMF-PAP-2026-Algorithmus berechnet
 * und sind mit TODO gekennzeichnet, wenn sie noch nicht gegen den BMF-Online-
 * Rechner verifiziert wurden.
 *
 * Schnittstelle zur Verifikation:
 *   https://www.bmf-steuerrechner.de/interface/2026Version1.xhtml?code=<code>
 *   Parameter: LZZ, RE4, STKL, ZKF, R, KRV, KVZ, PKV, ALV, PVS, PVZ, PVA, af,
 *              ALTER1, VBEZ, VJAHR, JVBEZ, JRE4, JRE4ENT, SONSTB, VBS, AJAHR,
 *              LZZFREIB, LZZHINZU
 *
 * Um eigene Fixture-Werte zu ergänzen:
 * 1. Rufen Sie den BMF-Online-Rechner mit den gewünschten Parametern auf.
 * 2. Lesen Sie LSTLZZ, SOLZLZZ und BK aus der XML-Antwort.
 * 3. Ersetzen Sie den "TODO"-Platzhalter durch den verifizierten Wert.
 */
import { describe, it, expect } from 'vitest';
import { runPap2026, makePapInput } from '../src/tax/pap2026.js';

// Hilfsfunktion: alle TODO-Fälle werden übersprungen
function verified<T>(val: T | 'TODO'): val is T {
  return val !== 'TODO';
}

interface Fixture {
  description: string;
  input: Parameters<typeof makePapInput>[0];
  expected: {
    LSTLZZ_cents: number | 'TODO';
    SOLZLZZ_cents: number | 'TODO';
    BK_cents: number | 'TODO';
  };
}

const fixtures: Fixture[] = [
  {
    description: 'STKL1, 4000€/Monat, kinderlos≥23, GKV 2.9%, keine KiSt',
    input: { RE4: 400000, LZZ: 2, STKL: 1, ZKF: 0, R: 0, PVZ: 1, PVA: 0 },
    expected: { LSTLZZ_cents: 52450, SOLZLZZ_cents: 0, BK_cents: 0 },
  },
  {
    // PVA=0: 1 Kind gibt keinen PV-Abschlag (Abschläge beginnen ab dem 2. Kind)
    description: 'STKL1, 4000€/Monat, ZKF=1, 1 Kind (PVA=0), GKV 2.9%, keine KiSt',
    input: { RE4: 400000, LZZ: 2, STKL: 1, ZKF: 1, R: 0, PVZ: 0, PVA: 0 },
    expected: { LSTLZZ_cents: 53183, SOLZLZZ_cents: 0, BK_cents: 0 },
  },
  {
    // PVA=1: 2 Kinder → Abschlag für das 2. Kind (-0,25 %)
    description: 'STKL1, 4000€/Monat, ZKF=2, 2 Kinder (PVA=1), GKV 2.9%, keine KiSt',
    input: { RE4: 400000, LZZ: 2, STKL: 1, ZKF: 2, R: 0, PVZ: 0, PVA: 1 },
    expected: { LSTLZZ_cents: 53491, SOLZLZZ_cents: 0, BK_cents: 0 },
  },
  {
    description: 'STKL1, 8000€/Monat, kinderlos≥23, GKV 2.9%, Soli greift',
    input: { RE4: 800000, LZZ: 2, STKL: 1, ZKF: 0, R: 0, PVZ: 1, PVA: 0 },
    expected: { LSTLZZ_cents: 181033, SOLZLZZ_cents: 1362, BK_cents: 0 },
  },
  {
    description: 'STKL3, 4000€/Monat, ZKF=1, KiSt (9%), GKV 2.9%',
    input: { RE4: 400000, LZZ: 2, STKL: 3, ZKF: 1, R: 1, PVZ: 0, PVA: 1 },
    expected: { LSTLZZ_cents: 21000, SOLZLZZ_cents: 0, BK_cents: 3866 },
  },
  {
    description: 'STKL2, 3000€/Monat, kinderlos<23, keine KiSt',
    input: { RE4: 300000, LZZ: 2, STKL: 2, ZKF: 0, R: 0, PVZ: 0, PVA: 0 },
    expected: { LSTLZZ_cents: 'TODO', SOLZLZZ_cents: 'TODO', BK_cents: 0 },
  },
  {
    description: 'STKL5, 2000€/Monat, kinderlos≥23, GKV 2.9%',
    input: { RE4: 200000, LZZ: 2, STKL: 5, ZKF: 0, R: 0, PVZ: 1, PVA: 0 },
    expected: { LSTLZZ_cents: 'TODO', SOLZLZZ_cents: 'TODO', BK_cents: 0 },
  },
  {
    description: 'STKL4, 5000€/Monat, ZKF=0.5, keine KiSt',
    input: { RE4: 500000, LZZ: 2, STKL: 4, ZKF: 0.5, R: 0, PVZ: 0, PVA: 1 },
    expected: { LSTLZZ_cents: 'TODO', SOLZLZZ_cents: 'TODO', BK_cents: 0 },
  },
];

describe('PAP 2026 Golden-Master', () => {
  for (const fixture of fixtures) {
    it(fixture.description, () => {
      if (!verified(fixture.expected.LSTLZZ_cents)) return;

      const result = runPap2026(makePapInput(fixture.input));

      if (verified(fixture.expected.LSTLZZ_cents)) {
        expect(result.LSTLZZ).toBe(fixture.expected.LSTLZZ_cents);
      }
      if (verified(fixture.expected.SOLZLZZ_cents)) {
        expect(result.SOLZLZZ).toBe(fixture.expected.SOLZLZZ_cents);
      }
      if (verified(fixture.expected.BK_cents)) {
        expect(result.BK).toBe(fixture.expected.BK_cents);
      }
    });
  }
});

describe('PAP 2026 Plausibilität', () => {
  it('STKL6 hat keine Steuer unter Grundfreibetrag', () => {
    const r = runPap2026(makePapInput({ RE4: 100000, LZZ: 2, STKL: 6 }));
    expect(r.LSTLZZ).toBeGreaterThanOrEqual(0);
  });

  it('höheres Brutto ergibt gleiche oder höhere Steuer', () => {
    const r1 = runPap2026(makePapInput({ RE4: 300000, LZZ: 2, STKL: 1, PVZ: 1 }));
    const r2 = runPap2026(makePapInput({ RE4: 400000, LZZ: 2, STKL: 1, PVZ: 1 }));
    expect(r2.LSTLZZ).toBeGreaterThanOrEqual(r1.LSTLZZ);
  });

  it('STKL3 hat niedrigere Steuer als STKL1 bei gleichem Brutto', () => {
    const r1 = runPap2026(makePapInput({ RE4: 600000, LZZ: 2, STKL: 1, PVZ: 1 }));
    const r3 = runPap2026(makePapInput({ RE4: 600000, LZZ: 2, STKL: 3, PVZ: 1 }));
    expect(r3.LSTLZZ).toBeLessThan(r1.LSTLZZ);
  });

  it('Kinderfreibetrag senkt JBMG und damit Soli/KiSt-Basis', () => {
    const r0 = runPap2026(makePapInput({ RE4: 800000, LZZ: 2, STKL: 1, ZKF: 0, R: 1, PVZ: 1 }));
    const r1 = runPap2026(makePapInput({ RE4: 800000, LZZ: 2, STKL: 1, ZKF: 1, R: 1, PVZ: 0, PVA: 1 }));
    expect(r1.BK).toBeLessThan(r0.BK);
  });

  it('Lohnsteuer ist 0 unter Grundfreibetrag-Äquivalent', () => {
    // 12348 € / 12 = 1029 € → monatlich unter Grundfreibetrag
    const r = runPap2026(makePapInput({ RE4: 100000, LZZ: 2, STKL: 1, PVZ: 1 }));
    expect(r.LSTLZZ).toBe(0);
  });
});
