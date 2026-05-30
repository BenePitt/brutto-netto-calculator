import type { GrossNetResult } from '../domain/types.js';
import { formatEur, formatPct } from './formatters.js';

function el(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function setText(id: string, text: string): void {
  const e = el(id);
  if (e) e.textContent = text;
}

export function renderResults(result: GrossNetResult): void {
  const m = result.monthly;
  const y = result.yearly;

  setText('result-net-monthly', formatEur(m.net));
  setText('result-net-yearly', formatEur(y.net));
  setText('result-net-monthly-table', formatEur(m.net));
  setText('result-net-yearly-table', formatEur(y.net));
  setText('result-gross-monthly', formatEur(m.gross));
  setText('result-gross-yearly', formatEur(y.gross));
  setText('result-deductions-monthly', formatEur(m.deductionsTotal));
  setText('result-deductions-yearly', formatEur(y.deductionsTotal));

  // Steuern
  setText('result-lst-monthly', formatEur(m.taxes.wageTax));
  setText('result-lst-yearly', formatEur(y.taxes.wageTax));
  setText('result-soli-monthly', formatEur(m.taxes.solidaritySurcharge));
  setText('result-soli-yearly', formatEur(y.taxes.solidaritySurcharge));
  setText('result-kist-monthly', formatEur(m.taxes.churchTax));
  setText('result-kist-yearly', formatEur(y.taxes.churchTax));
  setText('result-taxes-monthly', formatEur(m.taxes.total));
  setText('result-taxes-yearly', formatEur(y.taxes.total));

  // SV Arbeitnehmer
  setText('result-kv-an-monthly', formatEur(m.employeeSocialSecurity.health));
  setText('result-pv-an-monthly', formatEur(m.employeeSocialSecurity.care));
  setText('result-rv-an-monthly', formatEur(m.employeeSocialSecurity.pension));
  setText('result-av-an-monthly', formatEur(m.employeeSocialSecurity.unemployment));
  setText('result-sv-an-monthly', formatEur(m.employeeSocialSecurity.total));
  setText('result-kv-an-yearly', formatEur(y.employeeSocialSecurity.health));
  setText('result-pv-an-yearly', formatEur(y.employeeSocialSecurity.care));
  setText('result-rv-an-yearly', formatEur(y.employeeSocialSecurity.pension));
  setText('result-av-an-yearly', formatEur(y.employeeSocialSecurity.unemployment));
  setText('result-sv-an-yearly', formatEur(y.employeeSocialSecurity.total));

  // SV Arbeitgeber
  setText('result-kv-ag-monthly', formatEur(m.employerSocialSecurity.health));
  setText('result-pv-ag-monthly', formatEur(m.employerSocialSecurity.care));
  setText('result-rv-ag-monthly', formatEur(m.employerSocialSecurity.pension));
  setText('result-av-ag-monthly', formatEur(m.employerSocialSecurity.unemployment));
  setText('result-sv-ag-monthly', formatEur(m.employerSocialSecurity.total));
  setText('result-employer-cost-monthly', formatEur(m.employerTotalCost));
  setText('result-employer-cost-yearly', formatEur(y.employerTotalCost));

  // Quoten
  setText('result-rate', formatPct(m.effectiveDeductionRate));

  // Warnungen
  renderWarnings(result);

  // Bar-Chart
  renderChart(m);

  // aria-live Region aktualisieren
  const live = el('results-live');
  if (live) {
    live.textContent = `Ergebnis: Netto monatlich ${formatEur(m.net)}, jährlich ${formatEur(y.net)}.`;
  }

  // Ergebnis-Section sichtbar machen
  const section = el('results-section');
  if (section) {
    section.removeAttribute('hidden');
    section.classList.remove('hidden');
  }
}

function renderWarnings(result: GrossNetResult): void {
  const container = el('warnings-container');
  if (!container) return;

  container.innerHTML = '';

  if (result.warnings.length === 0) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  const ul = document.createElement('ul');
  ul.className = 'warnings-list';
  for (const w of result.warnings) {
    const li = document.createElement('li');
    li.className = `warning warning--${w.code.toLowerCase()}`;
    li.textContent = w.message;
    ul.appendChild(li);
  }
  container.appendChild(ul);

  // Annahmen
  if (result.assumptions.length > 0) {
    const details = document.createElement('details');
    details.className = 'assumptions';
    const summary = document.createElement('summary');
    summary.textContent = 'Berechnungsannahmen';
    details.appendChild(summary);
    const ul2 = document.createElement('ul');
    for (const a of result.assumptions) {
      const li = document.createElement('li');
      li.textContent = a;
      ul2.appendChild(li);
    }
    details.appendChild(ul2);
    container.appendChild(details);
  }
}

function renderChart(m: GrossNetResult['monthly']): void {
  const chartEl = el('deduction-chart');
  if (!chartEl) return;

  const total = m.gross;
  if (total <= 0) return;

  const segments = [
    { label: 'Lohnsteuer', value: m.taxes.wageTax, color: 'var(--color-tax)' },
    { label: 'Soli', value: m.taxes.solidaritySurcharge, color: 'var(--color-soli)' },
    { label: 'Kirchensteuer', value: m.taxes.churchTax, color: 'var(--color-kist)' },
    { label: 'KV AN', value: m.employeeSocialSecurity.health, color: 'var(--color-kv)' },
    { label: 'PV AN', value: m.employeeSocialSecurity.care, color: 'var(--color-pv)' },
    { label: 'RV AN', value: m.employeeSocialSecurity.pension, color: 'var(--color-rv)' },
    { label: 'AV AN', value: m.employeeSocialSecurity.unemployment, color: 'var(--color-av)' },
    { label: 'Netto', value: m.net, color: 'var(--color-net)' },
  ].filter(s => s.value > 0);

  chartEl.innerHTML = '';
  const bar = document.createElement('div');
  bar.className = 'deduction-bar';
  bar.setAttribute('role', 'img');
  bar.setAttribute('aria-label', 'Aufschlüsselung Bruttogehalt in Balkenform');

  for (const seg of segments) {
    const pct = (seg.value / total) * 100;
    const div = document.createElement('div');
    div.className = 'deduction-bar__segment';
    div.style.width = `${pct.toFixed(2)}%`;
    div.style.backgroundColor = seg.color;
    div.setAttribute('title', `${seg.label}: ${formatEur(seg.value)}`);
    bar.appendChild(div);
  }
  chartEl.appendChild(bar);
}

export function renderErrors(errors: import('./validation.js').ValidationError[]): void {
  // Clear all existing errors
  document.querySelectorAll('.field-error').forEach(e => {
    e.textContent = '';
    e.removeAttribute('role');
  });
  document.querySelectorAll('.field-input--error').forEach(e => e.classList.remove('field-input--error'));

  for (const err of errors) {
    const errorEl = document.getElementById(`error-${err.field}`);
    if (errorEl) {
      errorEl.textContent = err.message;
      errorEl.setAttribute('role', 'alert');
    }
    const inputEl = document.getElementById(`field-${err.field}`);
    if (inputEl) {
      inputEl.classList.add('field-input--error');
    }
  }
}
