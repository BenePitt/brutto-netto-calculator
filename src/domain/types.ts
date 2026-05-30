export type FederalStateCode =
  | 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH' | 'HE'
  | 'MV' | 'NI' | 'NW' | 'RP' | 'SL' | 'SN' | 'ST' | 'SH' | 'TH';

export type TaxClass = 1 | 2 | 3 | 4 | 5 | 6;

export interface GrossNetInput {
  grossAmountEuro: number;
  period: 'monthly' | 'yearly';
  taxYear: 2026;
  taxClass: TaxClass;
  federalState: FederalStateCode;
  churchTax: boolean;
  childAllowance: number;
  age: number;
  healthInsurance: 'statutory' | 'private';
  statutoryAdditionalHealthRatePercent: number;
  privateHealthMonthlyEuro?: number;
  pensionInsuranceMandatory: boolean;
  unemploymentInsuranceMandatory: boolean;
  careInsuranceMandatory: boolean;
  childless: boolean;
  childrenUnder25: number;
  monthlyTaxAllowanceEuro?: number;
  monthlyTaxAdditionEuro?: number;
}

export interface SocialSecurityComponents {
  health: number;
  care: number;
  pension: number;
  unemployment: number;
  total: number;
}

export interface TaxComponents {
  wageTax: number;
  solidaritySurcharge: number;
  churchTax: number;
  total: number;
}

export interface PeriodResult {
  gross: number;
  net: number;
  deductionsTotal: number;
  taxes: TaxComponents;
  employeeSocialSecurity: SocialSecurityComponents;
  employerSocialSecurity: SocialSecurityComponents;
  employerTotalCost: number;
  effectiveDeductionRate: number;
}

export interface GrossNetResult {
  monthly: PeriodResult;
  yearly: PeriodResult;
  warnings: Warning[];
  assumptions: string[];
}

export type WarningCode =
  | 'MINIJOB'
  | 'MIDIJOB'
  | 'OVER_PFLICHTGRENZE'
  | 'PKV_SIMPLIFIED'
  | 'NO_ALV'
  | 'NO_RV'
  | 'NO_PV';

export interface Warning {
  code: WarningCode;
  message: string;
}

export interface PapInput {
  RE4: number;
  LZZ: 1 | 2 | 3 | 4;
  STKL: TaxClass;
  ZKF: number;
  R: 0 | 1;
  KRV: 0 | 1;
  KVZ: number;
  PKV: 0 | 1 | 2;
  PKPV: number;
  ALV: 0 | 1;
  PVS: 0 | 1;
  PVZ: 0 | 1;
  PVA: number;
  LZZFREIB: number;
  LZZHINZU: number;
  af: 0 | 1;
  f: number;
  ALTER1: 0 | 1;
  VBEZ: number;
  JVBEZ: number;
  JRE4: number;
  JRE4ENT: number;
  SONSTB: number;
  VBS: number;
  VJAHR: number;
  AJAHR: number;
}

export interface PapOutput {
  LSTLZZ: number;
  SOLZLZZ: number;
  BK: number;
  BKS: number;
  STS: number;
  SOLZS: number;
}
