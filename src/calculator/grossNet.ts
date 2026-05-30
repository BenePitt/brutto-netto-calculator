import type { GrossNetInput, GrossNetResult, PeriodResult, SocialSecurityComponents, TaxComponents, Warning } from '../domain/types.js';
import { roundCent } from '../domain/money.js';
import { calcHealthInsurance, calcPrivateHealthInsurance } from '../social/healthInsurance.js';
import { calcCareInsurance } from '../social/careInsurance.js';
import { calcPension } from '../social/pension.js';
import { calcUnemployment } from '../social/unemployment.js';
import { calcChurchTax } from '../tax/churchTax.js';
import { runPap2026, makePapInput } from '../tax/pap2026.js';
import { getState } from '../config/federalStates.js';
import { RATES_2026 } from '../config/rates2026.js';

function buildSvComponents(h: number, c: number, p: number, u: number): SocialSecurityComponents {
  const total = roundCent(h + c + p + u);
  return { health: h, care: c, pension: p, unemployment: u, total };
}

function buildTaxComponents(wt: number, soli: number, kt: number): TaxComponents {
  const total = roundCent(wt + soli + kt);
  return { wageTax: wt, solidaritySurcharge: soli, churchTax: kt, total };
}

function buildPeriodResult(
  gross: number,
  taxes: TaxComponents,
  empSv: SocialSecurityComponents,
  agSv: SocialSecurityComponents,
): PeriodResult {
  const deductionsTotal = roundCent(taxes.total + empSv.total);
  const net = roundCent(gross - deductionsTotal);
  const employerTotalCost = roundCent(gross + agSv.total);
  const effectiveDeductionRate = gross > 0 ? roundCent((deductionsTotal / gross) * 100) : 0;
  return {
    gross,
    net,
    deductionsTotal,
    taxes,
    employeeSocialSecurity: empSv,
    employerSocialSecurity: agSv,
    employerTotalCost,
    effectiveDeductionRate,
  };
}

function scalePeriodResult(monthly: PeriodResult, factor: number): PeriodResult {
  const scale = (n: number) => roundCent(n * factor);
  return {
    gross: scale(monthly.gross),
    net: scale(monthly.net),
    deductionsTotal: scale(monthly.deductionsTotal),
    taxes: {
      wageTax: scale(monthly.taxes.wageTax),
      solidaritySurcharge: scale(monthly.taxes.solidaritySurcharge),
      churchTax: scale(monthly.taxes.churchTax),
      total: scale(monthly.taxes.total),
    },
    employeeSocialSecurity: {
      health: scale(monthly.employeeSocialSecurity.health),
      care: scale(monthly.employeeSocialSecurity.care),
      pension: scale(monthly.employeeSocialSecurity.pension),
      unemployment: scale(monthly.employeeSocialSecurity.unemployment),
      total: scale(monthly.employeeSocialSecurity.total),
    },
    employerSocialSecurity: {
      health: scale(monthly.employerSocialSecurity.health),
      care: scale(monthly.employerSocialSecurity.care),
      pension: scale(monthly.employerSocialSecurity.pension),
      unemployment: scale(monthly.employerSocialSecurity.unemployment),
      total: scale(monthly.employerSocialSecurity.total),
    },
    employerTotalCost: scale(monthly.employerTotalCost),
    effectiveDeductionRate: monthly.effectiveDeductionRate,
  };
}

function collectWarnings(input: GrossNetInput, monthlyBrutto: number): Warning[] {
  const warnings: Warning[] = [];

  if (monthlyBrutto <= RATES_2026.minijobLimit && monthlyBrutto > 0) {
    warnings.push({
      code: 'MINIJOB',
      message: `Das monatliche Brutto von ${monthlyBrutto.toFixed(2)} € liegt unter der Minijob-Grenze (${RATES_2026.minijobLimit} €/Monat). ` +
        'Für Minijobs und den Übergangsbereich (Midijob) gelten besondere Regelungen, die dieser Rechner nicht vollständig abbildet. ' +
        'Bitte wenden Sie sich an Ihren Arbeitgeber oder Ihre Krankenkasse.',
    });
  } else if (monthlyBrutto <= RATES_2026.midijobUpperLimit && monthlyBrutto > RATES_2026.minijobLimit) {
    warnings.push({
      code: 'MIDIJOB',
      message: `Das monatliche Brutto liegt im Übergangsbereich (Midijob, ${RATES_2026.minijobLimit.toFixed(2)} – ${RATES_2026.midijobUpperLimit.toFixed(2)} €/Monat). ` +
        'Die reduzierten SV-Beiträge für den Übergangsbereich werden in diesem Rechner nicht berücksichtigt.',
    });
  }

  if (input.healthInsurance === 'private' && monthlyBrutto < RATES_2026.vpgMonthly) {
    warnings.push({
      code: 'OVER_PFLICHTGRENZE',
      message: `Das monatliche Brutto liegt unter der Versicherungspflichtgrenze (${RATES_2026.vpgMonthly.toFixed(2)} €/Monat). ` +
        'In der Regel besteht Krankenversicherungspflicht in der GKV.',
    });
  }

  if (input.healthInsurance === 'private') {
    warnings.push({
      code: 'PKV_SIMPLIFIED',
      message: 'PKV: Der Arbeitgeberzuschuss zur PKV wird vereinfacht berechnet (halber GKV-Beitrag als Richtwert). ' +
        'Der tatsächliche Zuschuss hängt vom individuellen PKV-Beitrag und Einkommen ab.',
    });
  }

  if (!input.pensionInsuranceMandatory) {
    warnings.push({ code: 'NO_RV', message: 'Rentenversicherungsfreiheit: Kein RV-Beitrag berechnet.' });
  }
  if (!input.unemploymentInsuranceMandatory) {
    warnings.push({ code: 'NO_ALV', message: 'Arbeitslosenversicherungsfreiheit: Kein AV-Beitrag berechnet.' });
  }
  if (!input.careInsuranceMandatory) {
    warnings.push({ code: 'NO_PV', message: 'Pflegeversicherungsfreiheit: Kein PV-Beitrag berechnet.' });
  }

  return warnings;
}

function buildAssumptions(input: GrossNetInput): string[] {
  const assumptions: string[] = [
    'Berechnung auf Basis des BMF-Programmablaufplans 2026.',
    'Sozialversicherungsbeiträge nach den Werten 2026 (GKV, RV, AV, PV).',
    'Keine Versorgungsbezüge, Sonderzahlungen oder Altersentlastung berücksichtigt.',
    'Lohnzahlungszeitraum: monatlich (LZZ=2).',
  ];
  if (input.monthlyTaxAllowanceEuro && input.monthlyTaxAllowanceEuro > 0) {
    assumptions.push(`Monatlicher Freibetrag: ${input.monthlyTaxAllowanceEuro.toFixed(2)} €`);
  }
  if (input.monthlyTaxAdditionEuro && input.monthlyTaxAdditionEuro > 0) {
    assumptions.push(`Monatlicher Hinzurechnungsbetrag: ${input.monthlyTaxAdditionEuro.toFixed(2)} €`);
  }
  return assumptions;
}

export function calculateGrossNet(input: GrossNetInput): GrossNetResult {
  const monthlyBrutto = input.period === 'monthly'
    ? input.grossAmountEuro
    : roundCent(input.grossAmountEuro / 12);

  const state = getState(input.federalState);

  // SV booleans
  const isSaxony = state.isSaxony;
  const pvzFlag: 0 | 1 = (input.childless && input.age >= 23) ? 1 : 0;
  // PVA = Anzahl der Beitragsabschläge (BMF PAP 2026, Wertebereich 0–4).
  // Abschläge beginnen erst ab dem 2. Kind (-0,25 % je Kind ab Kind 2).
  // Daher: PVA = max(0, Kinder-1), cap 4. Das 1. Kind gibt keinen Abschlag.
  const pvaCount = input.childless ? 0 : Math.max(0, Math.min(input.childrenUnder25 - 1, 4));

  // Health insurance
  let kvAn: number;
  let kvAg: number;
  if (input.healthInsurance === 'statutory') {
    const kv = calcHealthInsurance(monthlyBrutto, input.statutoryAdditionalHealthRatePercent);
    kvAn = kv.an;
    kvAg = kv.ag;
  } else {
    const pkv = calcPrivateHealthInsurance(input.privateHealthMonthlyEuro ?? 0);
    kvAn = pkv.an;
    // AG-Zuschuss: vereinfacht halber GKV-Beitrag, max. gesetzliche Grenze
    const halfGkvEquiv = calcHealthInsurance(monthlyBrutto, input.statutoryAdditionalHealthRatePercent).an;
    kvAg = Math.min(pkv.an, halfGkvEquiv);
  }

  // Care insurance
  let pvAn = 0;
  let pvAg = 0;
  if (input.careInsuranceMandatory) {
    const pv = calcCareInsurance(monthlyBrutto, input.childless, input.age, input.childrenUnder25, isSaxony);
    pvAn = pv.an;
    pvAg = pv.ag;
  }

  // Pension insurance
  let rvAn = 0;
  let rvAg = 0;
  if (input.pensionInsuranceMandatory) {
    const rv = calcPension(monthlyBrutto);
    rvAn = rv.an;
    rvAg = rv.ag;
  }

  // Unemployment insurance
  let avAn = 0;
  let avAg = 0;
  if (input.unemploymentInsuranceMandatory) {
    const av = calcUnemployment(monthlyBrutto);
    avAn = av.an;
    avAg = av.ag;
  }

  // PAP: wage tax + soli
  const papInput = makePapInput({
    RE4: Math.round(monthlyBrutto * 100),
    LZZ: 2,
    STKL: input.taxClass,
    ZKF: input.childAllowance,
    R: input.churchTax ? 1 : 0,
    KRV: input.pensionInsuranceMandatory ? 0 : 1,
    KVZ: input.statutoryAdditionalHealthRatePercent,
    PKV: input.healthInsurance === 'private' ? 1 : 0,
    PKPV: input.healthInsurance === 'private' ? Math.round((input.privateHealthMonthlyEuro ?? 0) * 100) : 0,
    ALV: input.unemploymentInsuranceMandatory ? 0 : 1,
    PVS: isSaxony ? 1 : 0,
    PVZ: pvzFlag,
    PVA: pvaCount,
    LZZFREIB: Math.round((input.monthlyTaxAllowanceEuro ?? 0) * 100),
    LZZHINZU: Math.round((input.monthlyTaxAdditionEuro ?? 0) * 100),
  });

  const papOutput = runPap2026(papInput);

  const wageTaxMonthly = roundCent(papOutput.LSTLZZ / 100);
  const soliMonthly = roundCent(papOutput.SOLZLZZ / 100);

  // Church tax on BK (which is already the period portion of JBMG-based annual tax)
  const churchTaxMonthly = input.churchTax
    ? calcChurchTax(roundCent(papOutput.BK / 100), input.federalState)
    : 0;

  const taxes = buildTaxComponents(wageTaxMonthly, soliMonthly, churchTaxMonthly);
  const empSv = buildSvComponents(kvAn, pvAn, rvAn, avAn);
  const agSv = buildSvComponents(kvAg, pvAg, rvAg, avAg);

  const monthly = buildPeriodResult(monthlyBrutto, taxes, empSv, agSv);
  const yearly = scalePeriodResult(monthly, 12);

  return {
    monthly,
    yearly,
    warnings: collectWarnings(input, monthlyBrutto),
    assumptions: buildAssumptions(input),
  };
}
