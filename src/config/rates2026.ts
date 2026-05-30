import type { FederalStateCode } from '../domain/types.js';

// Sources:
// - BMF PAP 2026: https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026.html
// - BMAS Rechengrößen 2026: https://www.bmas.de/DE/Soziales/Rente-und-Altersvorsorge/Rentenversicherung/rechengroessen.html
// - GKV-Spitzenverband: https://www.gkv-spitzenverband.de/krankenversicherung/krankenversicherung.jsp
// - Pflegekassen-Beitragssätze: https://www.bundesgesundheitsministerium.de/themen/pflege/pflegeversicherung-zahlen-und-fakten.html

export const RATES_2026 = {
  gkvBaseRate: 14.6,
  gkvDefaultZusatzbeitrag: 2.9,

  rvRate: 18.6,
  rvEmployeeRate: 9.3,

  avRate: 2.6,
  avEmployeeRate: 1.3,

  bbgKvPvMonthly: 5812.50,
  bbgKvPvYearly: 69750.00,
  bbgRvAvMonthly: 8450.00,
  bbgRvAvYearly: 101400.00,

  vpgMonthly: 6450.00,
  vpgYearly: 77400.00,

  minijobLimit: 603.00,
  midijobUpperLimit: 2000.00,
} as const;

export interface PvRates {
  an: number;
  ag: number;
}

// Index: 0 = kinderlos ≥23, 1 = 1 Kind (or kinderlos <23), 2-5 = 2-5+ Kinder
export const PV_RATES_NON_SAXONY: PvRates[] = [
  { an: 2.40, ag: 1.80 },
  { an: 1.80, ag: 1.80 },
  { an: 1.55, ag: 1.80 },
  { an: 1.30, ag: 1.80 },
  { an: 1.05, ag: 1.80 },
  { an: 0.80, ag: 1.80 },
];

export const PV_RATES_SAXONY: PvRates[] = [
  { an: 2.90, ag: 1.30 },
  { an: 2.30, ag: 1.30 },
  { an: 2.05, ag: 1.30 },
  { an: 1.80, ag: 1.30 },
  { an: 1.55, ag: 1.30 },
  { an: 1.30, ag: 1.30 },
];

export const CHURCH_TAX_RATE: Record<FederalStateCode, number> = {
  BY: 8, BW: 8,
  BE: 9, BB: 9, HB: 9, HH: 9, HE: 9,
  MV: 9, NI: 9, NW: 9, RP: 9, SL: 9,
  SN: 9, ST: 9, SH: 9, TH: 9,
};
