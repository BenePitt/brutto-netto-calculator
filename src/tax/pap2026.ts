/**
 * Lohnsteuer-Berechnungsverfahren 2026 (PAP 2026)
 * Portiert aus dem offiziellen BMF-Programmablaufplan 2026.
 * Quelle: https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026.html
 */

import type { PapInput, PapOutput } from '../domain/types.js';

// Rounding helpers matching PAP specification
const rd0 = (n: number): number => Math.floor(n);
const ru0 = (n: number): number => Math.ceil(n);
const rd2 = (n: number): number => Math.floor(n * 100) / 100;
const rd6 = (n: number): number => Math.floor(n * 1_000_000) / 1_000_000;

// PAP 2026 constants
const GFB = 12348;        // Grundfreibetrag 2026
const SOLZFREI = 20350;   // Solidaritätszuschlag-Freigrenze
const SOLZPROZ = 5.5 / 100;
const SOLZMIN = 11.9 / 100;

// §32a EStG Tarif-Grenzen 2026
const TAB_X1 = 12348;
const TAB_X2 = 17799;
const TAB_X3 = 69878;
const TAB_X4 = 277825;

// Steuerklasse 5/6
const W1STKL5 = 14071;
const W2STKL5 = 34939;
const W3STKL5 = 222260;

// Versorgungsfreibetrag-Tabelle (PAP 2026 TAB1-TAB5)
// [Jahr, VBP%, VBP_max, FVBZ]
const TABVB: [number, number, number, number][] = [
  [2005, 40.0, 3000, 900],
  [2006, 38.4, 2880, 864],
  [2007, 36.8, 2760, 828],
  [2008, 35.2, 2640, 792],
  [2009, 33.6, 2520, 756],
  [2010, 32.0, 2400, 720],
  [2011, 30.4, 2280, 684],
  [2012, 28.8, 2160, 648],
  [2013, 27.2, 2040, 612],
  [2014, 25.6, 1920, 576],
  [2015, 24.0, 1800, 540],
  [2016, 22.4, 1680, 504],
  [2017, 20.8, 1560, 468],
  [2018, 19.2, 1440, 432],
  [2019, 17.6, 1320, 396],
  [2020, 16.0, 1200, 360],
  [2021, 15.2, 1140, 342],
  [2022, 14.4, 1080, 324],
  [2023, 13.6, 1020, 306],
  [2024, 12.8, 960, 288],
  [2025, 12.0, 900, 270],
  [2026, 11.2, 840, 252],
];

// Altersentlastungsbetrag-Tabelle (PAP 2026 TAB6)
// [Jahr, ALP%, ALE_max]
const TABALE: [number, number, number][] = [
  [2005, 40.0, 1900],
  [2006, 38.4, 1824],
  [2007, 36.8, 1748],
  [2008, 35.2, 1672],
  [2009, 33.6, 1596],
  [2010, 32.0, 1520],
  [2011, 30.4, 1444],
  [2012, 28.8, 1368],
  [2013, 27.2, 1292],
  [2014, 25.6, 1216],
  [2015, 24.0, 1140],
  [2016, 22.4, 1064],
  [2017, 20.8, 988],
  [2018, 19.2, 912],
  [2019, 17.6, 836],
  [2020, 16.0, 760],
  [2021, 15.2, 722],
  [2022, 14.4, 684],
  [2023, 13.6, 646],
  [2024, 12.8, 608],
  [2025, 12.0, 570],
  [2026, 11.2, 532],
];

interface PapState {
  // Inputs
  RE4: number;
  LZZ: 1 | 2 | 3 | 4;
  STKL: number;
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

  // Computed intermediates
  KZTAB: number;
  GFB: number;
  ANP: number;
  ZRE4J: number;
  ZVBEZJ: number;
  JLFREIB: number;
  JLHINZU: number;
  FVB: number;
  FVBZ: number;
  FVBZO: number;
  FVBSO: number;
  FVBZSO: number;
  ALTE: number;
  ZRE4: number;
  ZRE4VP: number;
  ZVBEZ: number;
  ZTABFB: number;
  SAP: number;
  EFA: number;
  KFB: number;
  VSP: number;
  VSPKVPV: number;
  VSPR: number;
  VSPALV: number;
  ZVE: number;
  X: number;
  ST: number;
  LSTJAHR: number;
  JBMG: number;
  LSTLZZ: number;
  SOLZLZZ: number;
  BK: number;
  BKS: number;
  STS: number;
  SOLZS: number;
  VFRB: number;
  WVFRB: number;
  ANTEIL1: number;

  // STKL 5/6
  ZZX: number;
  ZX: number;
  ST1: number;
  ST2: number;
  DIFF: number;
  MIST: number;
  HOCH: number;
  VERGL: number;
}

function makePapState(input: PapInput): PapState {
  return {
    RE4: input.RE4,
    LZZ: input.LZZ,
    STKL: input.STKL,
    ZKF: input.ZKF,
    R: input.R,
    KRV: input.KRV,
    KVZ: input.KVZ,
    PKV: input.PKV,
    PKPV: input.PKPV,
    ALV: input.ALV,
    PVS: input.PVS,
    PVZ: input.PVZ,
    PVA: input.PVA,
    LZZFREIB: input.LZZFREIB,
    LZZHINZU: input.LZZHINZU,
    af: input.af,
    f: input.f > 0 ? input.f : 1.0,
    ALTER1: input.ALTER1,
    VBEZ: input.VBEZ,
    JVBEZ: input.JVBEZ,
    JRE4: input.JRE4,
    JRE4ENT: input.JRE4ENT,
    SONSTB: input.SONSTB,
    VBS: input.VBS,
    VJAHR: input.VJAHR,
    AJAHR: input.AJAHR,

    KZTAB: 1,
    GFB,
    ANP: 0,
    ZRE4J: 0,
    ZVBEZJ: 0,
    JLFREIB: 0,
    JLHINZU: 0,
    FVB: 0,
    FVBZ: 0,
    FVBZO: 0,
    FVBSO: 0,
    FVBZSO: 0,
    ALTE: 0,
    ZRE4: 0,
    ZRE4VP: 0,
    ZVBEZ: 0,
    ZTABFB: 0,
    SAP: 0,
    EFA: 0,
    KFB: 0,
    VSP: 0,
    VSPKVPV: 0,
    VSPR: 0,
    VSPALV: 0,
    ZVE: 0,
    X: 0,
    ST: 0,
    LSTJAHR: 0,
    JBMG: 0,
    LSTLZZ: 0,
    SOLZLZZ: 0,
    BK: 0,
    BKS: 0,
    STS: 0,
    SOLZS: 0,
    VFRB: 0,
    WVFRB: 0,
    ANTEIL1: 0,

    ZZX: 0,
    ZX: 0,
    ST1: 0,
    ST2: 0,
    DIFF: 0,
    MIST: 0,
    HOCH: 0,
    VERGL: 0,
  };
}

// MPARA: Parameterzuweisung (Beitragssätze werden hier nicht mehr gesetzt,
// da sie in der UPEVP-Prozedur direkt berechnet werden)
function mpara(s: PapState): void {
  s.KZTAB = s.STKL === 3 ? 2 : 1;
}

// MRE4JL: Jahresberechnung aus LZZ-Werten
function mre4jl(s: PapState): void {
  const re4Euro = s.RE4 / 100;
  const vbezEuro = s.VBEZ / 100;
  const lzzfreib = s.LZZFREIB / 100;
  const lzzhinzu = s.LZZHINZU / 100;

  if (s.LZZ === 1) {
    // jährlich
    s.ZRE4J = rd2(re4Euro);
    s.ZVBEZJ = rd2(vbezEuro);
    s.JLFREIB = rd2(lzzfreib);
    s.JLHINZU = rd2(lzzhinzu);
  } else if (s.LZZ === 2) {
    // monatlich
    s.ZRE4J = rd2(re4Euro * 12);
    s.ZVBEZJ = rd2(vbezEuro * 12);
    s.JLFREIB = rd2(lzzfreib * 12);
    s.JLHINZU = rd2(lzzhinzu * 12);
  } else if (s.LZZ === 3) {
    // wöchentlich
    s.ZRE4J = rd2(re4Euro * 360 / 7);
    s.ZVBEZJ = rd2(vbezEuro * 360 / 7);
    s.JLFREIB = rd2(lzzfreib * 360 / 7);
    s.JLHINZU = rd2(lzzhinzu * 360 / 7);
  } else {
    // täglich (LZZ=4)
    s.ZRE4J = rd2(re4Euro * 360);
    s.ZVBEZJ = rd2(vbezEuro * 360);
    s.JLFREIB = rd2(lzzfreib * 360);
    s.JLHINZU = rd2(lzzhinzu * 360);
  }

  if (s.af === 0) s.f = 1;
}

// MRE4: Versorgungsfreibetrag und Altersentlastungsbetrag
function mre4(s: PapState): void {
  if (s.ZVBEZJ === 0) {
    s.FVB = 0;
    s.FVBZ = 0;
    s.FVBZO = 0;
    s.FVBZSO = 0;
    s.FVBSO = 0;
  } else {
    // Versorgungsfreibetrag lookup
    const tabRow = getTabVB(s.VJAHR);
    let fvb = rd2(s.ZVBEZJ * tabRow[1] / 100);
    if (fvb > tabRow[2]) fvb = tabRow[2];
    s.FVB = fvb;
    s.FVBZ = Math.min(tabRow[3], rd0(fvb));
    s.FVBZO = s.FVBZ;

    // Sonderzahlungen (FVBSO, FVBZSO) – vereinfacht ohne SONSTB
    s.FVBSO = s.FVB;
    s.FVBZSO = s.FVBZ;
  }

  // Altersentlastungsbetrag
  mre4alte(s);
}

function getTabVB(vjahr: number): [number, number, number, number] {
  const row = TABVB.find(r => r[0] === vjahr);
  if (row) return row;
  // after 2026: last row
  if (vjahr > 2026) return TABVB[TABVB.length - 1];
  // before 2005: first row
  return TABVB[0];
}

function getTabALE(ajahr: number): [number, number, number] {
  const row = TABALE.find(r => r[0] === ajahr);
  if (row) return row;
  if (ajahr > 2026) return TABALE[TABALE.length - 1];
  return TABALE[0];
}

function mre4alte(s: PapState): void {
  if (s.ALTER1 === 0) {
    s.ALTE = 0;
    return;
  }
  const tabRow = getTabALE(s.AJAHR);
  const zre4alt = s.ZRE4J - s.ZVBEZJ;
  let alte = rd2(zre4alt * tabRow[1] / 100);
  if (alte > tabRow[2]) alte = tabRow[2];
  s.ALTE = alte;
}

// MRE4ABZ: ZRE4 = ZRE4J - FVB - ALTE - JLFREIB + JLHINZU
function mre4abz(s: PapState): void {
  s.ZRE4 = Math.max(0, rd2(s.ZRE4J - s.FVB - s.ALTE - s.JLFREIB + s.JLHINZU));
  s.ZRE4VP = s.ZRE4J;
  s.ZVBEZ = Math.max(0, rd2(s.ZVBEZJ - s.FVB));
}

// MZTABFB: Freibeträge nach Tabelle
function mztabfb(s: PapState): void {
  // Arbeitnehmer-Pauschbetrag für Versorgungsbezüge
  let anpvb = 0;
  if (s.ZVBEZ > 0) {
    anpvb = Math.min(102, rd0(s.ZVBEZ * 0.102));
  }
  // Arbeitnehmer-Pauschbetrag für Arbeitslohn
  const zre4regular = s.ZRE4J - s.ZVBEZJ;
  let anpregular = 0;
  if (zre4regular > 0) {
    anpregular = Math.min(1230, rd0(zre4regular * 0.12));
    anpregular = Math.max(anpregular, 0);
  }
  s.ANP = anpvb + anpregular;

  // SAP: Sonderausgabenpauschbetrag
  s.SAP = s.STKL === 6 ? 0 : 36;

  // EFA: Entlastungsbetrag für Alleinerziehende
  s.EFA = s.STKL === 2 ? 4260 : 0;

  // KFB: Kinderfreibetrag
  if (s.STKL === 1 || s.STKL === 2 || s.STKL === 3) {
    s.KFB = rd2(s.ZKF * 9756);
  } else if (s.STKL === 4) {
    s.KFB = rd2(s.ZKF * 4878);
  } else {
    s.KFB = 0;
  }

  s.ZTABFB = rd2(s.EFA + s.ANP + s.SAP + s.FVBZ);
}

// MVSPKVPV: KV/PV Vorsorgepauschale
function mvspkvpv(s: PapState): void {
  const bre4 = Math.min(s.ZRE4VP, 69750);

  if (s.PKV === 0) {
    // GKV
    const kvsatzan = s.KVZ / 2 / 100 + 0.07;
    let pvsatzan: number;
    if (s.PVS === 1) {
      // Sachsen
      pvsatzan = 0.023;
      if (s.PVZ === 1) pvsatzan += 0.006;
      else pvsatzan -= s.PVA * 0.0025;
      pvsatzan = Math.max(0.013, pvsatzan);
    } else {
      pvsatzan = 0.018;
      if (s.PVZ === 1) pvsatzan += 0.006;
      else pvsatzan -= s.PVA * 0.0025;
      pvsatzan = Math.max(0.008, pvsatzan);
    }
    s.VSPKVPV = rd2(bre4 * (kvsatzan + pvsatzan));
  } else if (s.STKL === 6) {
    s.VSPKVPV = 0;
  } else {
    // PKV
    const pkpvj = rd2(s.PKPV / 100 * 12);
    s.VSPKVPV = Math.max(0, rd2(pkpvj));
  }
}

// MVSPHB: Höchstbetrag-Berechnung der Vorsorgepauschale
function mvsphb(s: PapState): void {
  if (s.STKL === 6) {
    // STKL 6: VSP = 0
    s.VSP = 0;
    return;
  }

  const bre4rv = Math.min(s.ZRE4VP, 101400);
  s.VSPR = s.KRV === 1 ? 0 : rd2(bre4rv * 0.093);

  s.VSP = ru0(s.VSPKVPV + s.VSPR);

  if (s.ALV === 0) {
    s.VSPALV = rd2(0.013 * bre4rv);
    const vsphb = Math.min(s.VSPALV + s.VSPKVPV, 1900 * s.KZTAB);
    const vspn = ru0(s.VSPR + vsphb);
    s.VSP = Math.max(s.VSP, vspn);
  }
}

// UPEVP: Vorsorgepauschale
function upevp(s: PapState): void {
  mvspkvpv(s);
  mvsphb(s);
}

// UPTAB26: §32a EStG Einkommensteuertarif 2026
function uptab26(s: PapState): void {
  const x = s.X;
  if (x <= TAB_X1) {
    s.ST = 0;
  } else if (x <= TAB_X2) {
    const y = rd6((x - TAB_X1) / 10000);
    s.ST = rd0((y * 914.51 + 1400) * y);
  } else if (x <= TAB_X3) {
    const y = rd6((x - TAB_X2 - 1) / 10000);
    s.ST = rd0((y * 173.1 + 2397) * y + 1034.87);
  } else if (x <= TAB_X4) {
    s.ST = rd0(x * 0.42 - 11135.63);
  } else {
    s.ST = rd0(x * 0.45 - 19470.38);
  }
  s.ST = s.ST * s.KZTAB;
}

// UP5_6: Hilfsberechnung für Steuerklassen 5 und 6
function up5_6(s: PapState): void {
  s.X = rd0(s.ZX * 1.25);
  uptab26(s);
  s.ST1 = s.ST;
  s.X = rd0(s.ZX * 0.75);
  uptab26(s);
  s.ST2 = s.ST;
  s.DIFF = (s.ST1 - s.ST2) * 2;
  s.MIST = rd0(s.ZX * 0.14);
  s.ST = Math.max(s.MIST, s.DIFF);
}

// MST5_6: Steuerklassen 5 und 6
function mst5_6(s: PapState): void {
  s.ZZX = s.X;
  if (s.ZZX > W2STKL5) {
    s.ZX = W2STKL5;
    up5_6(s);
    s.ST = s.ST + rd0((Math.min(s.ZZX, W3STKL5) - W2STKL5) * 0.42);
    if (s.ZZX > W3STKL5) {
      s.ST = s.ST + rd0((s.ZZX - W3STKL5) * 0.45);
    }
  } else {
    s.ZX = s.ZZX;
    up5_6(s);
    if (s.ZZX > W1STKL5) {
      s.VERGL = s.ST;
      s.ZX = W1STKL5;
      up5_6(s);
      s.HOCH = s.ST + rd0((s.ZZX - W1STKL5) * 0.42);
      s.ST = Math.min(s.HOCH, s.VERGL);
    }
  }
}

// UPMLST: Dispatch STKL 1-4 vs 5-6
function upmlst(s: PapState): void {
  if (s.ZVE < 1) {
    s.ZVE = 0;
    s.X = 0;
  } else {
    s.X = rd0(s.ZVE / s.KZTAB);
  }

  if (s.STKL < 5) {
    uptab26(s);
  } else {
    mst5_6(s);
  }
}

// MLSTJAHR: Jahressteuer
function mlstjahr(s: PapState): void {
  upevp(s);
  s.ZVE = Math.max(0, rd2(s.ZRE4 - s.ZTABFB - s.VSP));
  upmlst(s);
}

// UPANTEIL: Anteil am Jahreslohnsteuer für LZZ
function upanteil(s: PapState, jw: number): number {
  if (s.LZZ === 1) return jw;
  if (s.LZZ === 2) return rd0(jw / 12);
  if (s.LZZ === 3) return rd0(jw * 7 / 360);
  return rd0(jw / 360);
}

// UPLSTLZZ: Perioden-Lohnsteuer aus Jahressteuer
function uplstlzz(s: PapState): void {
  s.LSTLZZ = upanteil(s, s.LSTJAHR * 100);
}

// MSOLZ: Solidaritätszuschlag
function msolz(s: PapState): void {
  const jbmgCents = s.JBMG * 100;
  const solzfrei = SOLZFREI * s.KZTAB;

  if (s.JBMG > solzfrei) {
    let solzj = rd2(s.JBMG * SOLZPROZ);
    const solzmin = rd2((s.JBMG - solzfrei) * SOLZMIN);
    solzj = Math.min(solzj, solzmin);
    const jw = rd0(solzj * 100);
    s.SOLZLZZ = upanteil(s, jw);
  } else {
    s.SOLZLZZ = 0;
  }

  // Kirchensteuer-Bemessungsgrundlage (BK) = Jahressteuer auf JBMG
  if (s.R > 0) {
    s.BK = upanteil(s, jbmgCents);
  } else {
    s.BK = 0;
  }
}

// MBERECH: Hauptberechnung
function mberech(s: PapState): void {
  mztabfb(s);
  s.VFRB = rd0((s.ANP + s.FVB + s.FVBZ) * 100);
  mlstjahr(s);
  s.WVFRB = Math.max(0, rd0((s.ZVE - GFB) * 100));
  s.LSTJAHR = rd0(s.ST * s.f);
  uplstlzz(s);

  if (s.ZKF > 0) {
    s.ZTABFB = s.ZTABFB + s.KFB;
    mre4abz(s);
    mlstjahr(s);
    s.JBMG = rd0(s.ST * s.f);
  } else {
    s.JBMG = s.LSTJAHR;
  }

  msolz(s);
}

export function runPap2026(input: PapInput): PapOutput {
  const s = makePapState(input);

  mpara(s);
  mre4jl(s);
  mre4(s);
  mre4abz(s);
  mberech(s);

  return {
    LSTLZZ: s.LSTLZZ,
    SOLZLZZ: s.SOLZLZZ,
    BK: s.BK,
    BKS: s.BKS,
    STS: s.STS,
    SOLZS: s.SOLZS,
  };
}

export function makePapInput(partial: Partial<PapInput> & { RE4: number; LZZ: 1 | 2 | 3 | 4; STKL: import('../domain/types.js').TaxClass }): PapInput {
  return {
    ZKF: 0,
    R: 0,
    KRV: 0,
    KVZ: 2.9,
    PKV: 0,
    PKPV: 0,
    ALV: 0,
    PVS: 0,
    PVZ: 0,
    PVA: 0,
    LZZFREIB: 0,
    LZZHINZU: 0,
    af: 0,
    f: 1,
    ALTER1: 0,
    VBEZ: 0,
    JVBEZ: 0,
    JRE4: 0,
    JRE4ENT: 0,
    SONSTB: 0,
    VBS: 0,
    VJAHR: 2026,
    AJAHR: 2026,
    ...partial,
  };
}
