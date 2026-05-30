import type { FederalStateCode } from '../domain/types.js';

export interface FederalState {
  code: FederalStateCode;
  name: string;
  isSaxony: boolean;
  churchTaxRate: number;
}

export const FEDERAL_STATES: FederalState[] = [
  { code: 'BW', name: 'Baden-Württemberg', isSaxony: false, churchTaxRate: 8 },
  { code: 'BY', name: 'Bayern', isSaxony: false, churchTaxRate: 8 },
  { code: 'BE', name: 'Berlin', isSaxony: false, churchTaxRate: 9 },
  { code: 'BB', name: 'Brandenburg', isSaxony: false, churchTaxRate: 9 },
  { code: 'HB', name: 'Bremen', isSaxony: false, churchTaxRate: 9 },
  { code: 'HH', name: 'Hamburg', isSaxony: false, churchTaxRate: 9 },
  { code: 'HE', name: 'Hessen', isSaxony: false, churchTaxRate: 9 },
  { code: 'MV', name: 'Mecklenburg-Vorpommern', isSaxony: false, churchTaxRate: 9 },
  { code: 'NI', name: 'Niedersachsen', isSaxony: false, churchTaxRate: 9 },
  { code: 'NW', name: 'Nordrhein-Westfalen', isSaxony: false, churchTaxRate: 9 },
  { code: 'RP', name: 'Rheinland-Pfalz', isSaxony: false, churchTaxRate: 9 },
  { code: 'SL', name: 'Saarland', isSaxony: false, churchTaxRate: 9 },
  { code: 'SN', name: 'Sachsen', isSaxony: true, churchTaxRate: 9 },
  { code: 'ST', name: 'Sachsen-Anhalt', isSaxony: false, churchTaxRate: 9 },
  { code: 'SH', name: 'Schleswig-Holstein', isSaxony: false, churchTaxRate: 9 },
  { code: 'TH', name: 'Thüringen', isSaxony: false, churchTaxRate: 9 },
];

export function getState(code: FederalStateCode): FederalState {
  const state = FEDERAL_STATES.find(s => s.code === code);
  if (!state) throw new Error(`Unknown state code: ${code}`);
  return state;
}
