import { parseGermanNumber } from './formatters.js';

export interface ValidationError {
  field: string;
  message: string;
}

export interface RawFormValues {
  bruttoRaw: string;
  period: string;
  taxClass: string;
  federalState: string;
  churchTax: boolean;
  childAllowanceRaw: string;
  ageRaw: string;
  healthInsurance: string;
  kvzRaw: string;
  pkvRaw: string;
  rvMandatory: boolean;
  avMandatory: boolean;
  pvMandatory: boolean;
  childless: boolean;
  childrenRaw: string;
  freiRaw: string;
  hinzuRaw: string;
}

export function validateForm(raw: RawFormValues): ValidationError[] {
  const errors: ValidationError[] = [];

  const brutto = parseGermanNumber(raw.bruttoRaw);
  if (isNaN(brutto) || raw.bruttoRaw.trim() === '') {
    errors.push({ field: 'brutto', message: 'Bitte geben Sie ein gültiges Bruttogehalt ein.' });
  } else if (brutto < 0) {
    errors.push({ field: 'brutto', message: 'Das Bruttogehalt darf nicht negativ sein.' });
  } else if (brutto > 1_000_000) {
    errors.push({ field: 'brutto', message: 'Bitte geben Sie einen realistischen Wert ein (max. 1.000.000 €).' });
  }

  const taxClass = parseInt(raw.taxClass, 10);
  if (isNaN(taxClass) || taxClass < 1 || taxClass > 6) {
    errors.push({ field: 'taxClass', message: 'Bitte wählen Sie eine gültige Steuerklasse (I–VI).' });
  }

  if (!raw.federalState) {
    errors.push({ field: 'federalState', message: 'Bitte wählen Sie ein Bundesland.' });
  }

  const kvz = parseFloat(raw.kvzRaw);
  if (raw.healthInsurance === 'statutory') {
    if (isNaN(kvz) || kvz < 0 || kvz > 10) {
      errors.push({ field: 'kvz', message: 'Der Zusatzbeitrag muss zwischen 0 und 10 % liegen.' });
    }
  }

  if (raw.healthInsurance === 'private') {
    const pkv = parseGermanNumber(raw.pkvRaw);
    if (isNaN(pkv) || pkv < 0) {
      errors.push({ field: 'pkv', message: 'Bitte geben Sie einen gültigen PKV-Beitrag ein.' });
    }
  }

  const ca = parseFloat(raw.childAllowanceRaw);
  if (isNaN(ca) || ca < 0 || ca > 10 || (ca * 2) !== Math.floor(ca * 2)) {
    errors.push({ field: 'childAllowance', message: 'Kinderfreibeträge: gültige Werte sind 0; 0,5; 1; 1,5 … (in 0,5-Schritten).' });
  }

  const age = parseInt(raw.ageRaw, 10);
  if (isNaN(age) || age < 14 || age > 100) {
    errors.push({ field: 'age', message: 'Bitte geben Sie ein gültiges Alter ein (14–100).' });
  }

  const children = parseInt(raw.childrenRaw, 10);
  if (isNaN(children) || children < 0 || children > 20) {
    errors.push({ field: 'children', message: 'Bitte geben Sie eine gültige Kinderzahl ein (0–20).' });
  }

  if (raw.freiRaw.trim() !== '') {
    const frei = parseGermanNumber(raw.freiRaw);
    if (isNaN(frei) || frei < 0) {
      errors.push({ field: 'frei', message: 'Ungültiger Freibetrag.' });
    }
  }

  if (raw.hinzuRaw.trim() !== '') {
    const hinzu = parseGermanNumber(raw.hinzuRaw);
    if (isNaN(hinzu) || hinzu < 0) {
      errors.push({ field: 'hinzu', message: 'Ungültiger Hinzurechnungsbetrag.' });
    }
  }

  return errors;
}
