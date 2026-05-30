import type { GrossNetInput, FederalStateCode, TaxClass } from '../domain/types.js';
import { parseGermanNumber } from './formatters.js';
import { validateForm, type RawFormValues } from './validation.js';
import { renderResults, renderErrors } from './renderResults.js';
import { calculateGrossNet } from '../calculator/grossNet.js';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function getFormValues(): RawFormValues {
  const g = (id: string): HTMLInputElement | HTMLSelectElement | null =>
    document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;

  const checked = (id: string): boolean => (document.getElementById(id) as HTMLInputElement | null)?.checked ?? false;
  const val = (id: string): string => g(id)?.value ?? '';

  return {
    bruttoRaw: val('field-brutto'),
    period: val('field-period'),
    taxClass: val('field-taxclass'),
    federalState: val('field-state'),
    churchTax: checked('field-kirche'),
    childAllowanceRaw: val('field-kfb'),
    ageRaw: val('field-age'),
    healthInsurance: val('field-kv-type'),
    kvzRaw: val('field-kvz'),
    pkvRaw: val('field-pkv'),
    rvMandatory: checked('field-rv'),
    avMandatory: checked('field-av'),
    pvMandatory: checked('field-pv'),
    childless: checked('field-childless'),
    childrenRaw: val('field-children'),
    freiRaw: val('field-freibetrag'),
    hinzuRaw: val('field-hinzu'),
  };
}

function rawToInput(raw: RawFormValues): GrossNetInput {
  const brutto = parseGermanNumber(raw.bruttoRaw) || 0;
  const taxClass = (parseInt(raw.taxClass, 10) || 1) as TaxClass;
  const age = parseInt(raw.ageRaw, 10) || 30;
  const children = parseInt(raw.childrenRaw, 10) || 0;
  const ca = parseFloat(raw.childAllowanceRaw) || 0;
  const kvz = parseFloat(raw.kvzRaw);
  const pkv = parseGermanNumber(raw.pkvRaw) || 0;
  const frei = parseGermanNumber(raw.freiRaw) || 0;
  const hinzu = parseGermanNumber(raw.hinzuRaw) || 0;

  return {
    grossAmountEuro: brutto,
    period: raw.period === 'yearly' ? 'yearly' : 'monthly',
    taxYear: 2026,
    taxClass,
    federalState: (raw.federalState || 'NW') as FederalStateCode,
    churchTax: raw.churchTax,
    childAllowance: ca,
    age,
    healthInsurance: raw.healthInsurance === 'private' ? 'private' : 'statutory',
    statutoryAdditionalHealthRatePercent: isNaN(kvz) ? 2.9 : kvz,
    privateHealthMonthlyEuro: pkv,
    pensionInsuranceMandatory: raw.rvMandatory,
    unemploymentInsuranceMandatory: raw.avMandatory,
    careInsuranceMandatory: raw.pvMandatory,
    childless: raw.childless,
    childrenUnder25: children,
    monthlyTaxAllowanceEuro: frei > 0 ? frei : undefined,
    monthlyTaxAdditionEuro: hinzu > 0 ? hinzu : undefined,
  };
}

function recalculate(): void {
  const raw = getFormValues();
  const errors = validateForm(raw);
  renderErrors(errors);

  if (errors.length > 0) return;

  try {
    const input = rawToInput(raw);
    const result = calculateGrossNet(input);
    renderResults(result);
  } catch (e) {
    console.error('Berechnungsfehler:', e);
  }
}

function scheduleRecalculate(): void {
  if (debounceTimer !== null) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(recalculate, 150);
}

function togglePkvField(): void {
  const kvType = (document.getElementById('field-kv-type') as HTMLSelectElement | null)?.value;
  const gkvRow = document.getElementById('gkv-row');
  const pkvRow = document.getElementById('pkv-row');
  if (gkvRow) gkvRow.hidden = kvType === 'private';
  if (pkvRow) pkvRow.hidden = kvType !== 'private';
}

function toggleChildFields(): void {
  const childless = (document.getElementById('field-childless') as HTMLInputElement | null)?.checked;
  const childrenRow = document.getElementById('children-row');
  if (childrenRow) childrenRow.hidden = !!childless;
}

export function initForm(): void {
  const form = document.getElementById('calculator-form');
  if (!form) return;

  form.addEventListener('input', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'field-kv-type') togglePkvField();
    if (target.id === 'field-childless') toggleChildFields();
    scheduleRecalculate();
  });

  form.addEventListener('change', () => scheduleRecalculate());

  document.getElementById('btn-calculate')?.addEventListener('click', (e) => {
    e.preventDefault();
    recalculate();
  });

  document.getElementById('btn-reset')?.addEventListener('click', (e) => {
    e.preventDefault();
    (form as HTMLFormElement).reset();
    togglePkvField();
    toggleChildFields();
    const section = document.getElementById('results-section');
    if (section) section.hidden = true;
    document.querySelectorAll('.field-error').forEach(e2 => { e2.textContent = ''; });
  });

  // Initial state
  togglePkvField();
  toggleChildFields();

  // Trigger initial calculation with defaults
  recalculate();
}
