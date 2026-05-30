// Stand: 30.05.2026 – Quelle: GKV-Spitzenverband (§ 242 Abs. 5 SGB V) via covago.de
// Allgemeiner GKV-Beitragssatz: 14,6 % (AN + AG je 7,3 %) – bundesweit einheitlich
// Gesamtbeitrag = 14,6 % + kassenindividueller Zusatzbeitrag (paritätisch geteilt)

export type Kassenart = 'AOK' | 'BKK' | 'IKK' | 'EK' | 'KBS' | 'Sonstige';

export interface Kasse {
  name: string;
  art: Kassenart;
  zusatzbeitrag: number; // kassenindividueller Zusatzbeitrag in %
}

export const KASSEN: Kasse[] = [
  // ── AOK – Allgemeine Ortskrankenkassen ────────────────────────────────────
  { name: 'AOK Baden-Württemberg',          art: 'AOK', zusatzbeitrag: 2.99 },
  { name: 'AOK Bayern',                     art: 'AOK', zusatzbeitrag: 2.69 },
  { name: 'AOK Bremen/Bremerhaven',         art: 'AOK', zusatzbeitrag: 3.29 },
  { name: 'AOK Hessen',                     art: 'AOK', zusatzbeitrag: 2.98 },
  { name: 'AOK Niedersachsen',              art: 'AOK', zusatzbeitrag: 2.98 },
  { name: 'AOK Nordost',                    art: 'AOK', zusatzbeitrag: 3.50 },
  { name: 'AOK NordWest',                   art: 'AOK', zusatzbeitrag: 2.99 },
  { name: 'AOK PLUS',                       art: 'AOK', zusatzbeitrag: 3.10 },
  { name: 'AOK Rheinland-Pfalz/Saarland',  art: 'AOK', zusatzbeitrag: 2.47 },
  { name: 'AOK Rheinland/Hamburg',          art: 'AOK', zusatzbeitrag: 3.29 },
  { name: 'AOK Sachsen-Anhalt',             art: 'AOK', zusatzbeitrag: 2.89 },

  // ── BKK – Betriebskrankenkassen ───────────────────────────────────────────
  { name: 'Audi BKK',                             art: 'BKK', zusatzbeitrag: 2.60 },
  { name: 'BAHN-BKK',                             art: 'BKK', zusatzbeitrag: 3.40 },
  { name: 'Bergische Krankenkasse',               art: 'BKK', zusatzbeitrag: 3.79 },
  { name: 'Bertelsmann BKK',                      art: 'BKK', zusatzbeitrag: 3.20 },
  { name: 'BIG direkt gesund',                    art: 'BKK', zusatzbeitrag: 3.69 },
  { name: 'BKK Akzo Nobel Bayern',                art: 'BKK', zusatzbeitrag: 3.39 },
  { name: 'BKK B. Braun Aesculap',               art: 'BKK', zusatzbeitrag: 3.65 },
  { name: 'BKK Deutsche Bank',                    art: 'BKK', zusatzbeitrag: 3.40 },
  { name: 'BKK Diakonie',                         art: 'BKK', zusatzbeitrag: 3.80 },
  { name: 'BKK EUREGIO',                          art: 'BKK', zusatzbeitrag: 3.39 },
  { name: 'BKK EWE',                              art: 'BKK', zusatzbeitrag: 1.98 },
  { name: 'BKK EVM',                              art: 'BKK', zusatzbeitrag: 2.50 },
  { name: 'BKK exklusiv',                         art: 'BKK', zusatzbeitrag: 3.49 },
  { name: 'BKK Faber-Castell & Partner',          art: 'BKK', zusatzbeitrag: 2.48 },
  { name: 'BKK firmus',                           art: 'BKK', zusatzbeitrag: 2.18 },
  { name: 'BKK Freudenberg',                      art: 'BKK', zusatzbeitrag: 2.99 },
  { name: 'BKK Gildemeister Seidensticker',       art: 'BKK', zusatzbeitrag: 3.40 },
  { name: 'BKK Groz-Beckert',                     art: 'BKK', zusatzbeitrag: 2.50 },
  { name: 'BKK Herkules',                         art: 'BKK', zusatzbeitrag: 4.38 },
  { name: 'BKK Karl Mayer',                       art: 'BKK', zusatzbeitrag: 3.39 },
  { name: 'BKK Linde',                            art: 'BKK', zusatzbeitrag: 2.99 },
  { name: 'BKK MAHLE',                            art: 'BKK', zusatzbeitrag: 4.20 },
  { name: 'BKK melitta HMR',                      art: 'BKK', zusatzbeitrag: 3.90 },
  { name: 'BKK Miele',                            art: 'BKK', zusatzbeitrag: 3.20 },
  { name: 'BKK mkk',                              art: 'BKK', zusatzbeitrag: 3.50 },
  { name: 'BKK MTU',                              art: 'BKK', zusatzbeitrag: 2.80 },
  { name: 'BKK PFAFF',                            art: 'BKK', zusatzbeitrag: 2.78 },
  { name: 'BKK Pfalz',                            art: 'BKK', zusatzbeitrag: 3.90 },
  { name: 'BKK PricewaterhouseCoopers',           art: 'BKK', zusatzbeitrag: 2.80 },
  { name: 'BKK ProVita',                          art: 'BKK', zusatzbeitrag: 3.79 },
  { name: 'BKK Public',                           art: 'BKK', zusatzbeitrag: 2.50 },
  { name: 'BKK Rieker/RICOSTA/Weisser',           art: 'BKK', zusatzbeitrag: 3.80 },
  { name: 'BKK Salzgitter',                       art: 'BKK', zusatzbeitrag: 3.50 },
  { name: 'BKK Scheufelen',                       art: 'BKK', zusatzbeitrag: 3.99 },
  { name: 'BKK Schwarzwald-Baar-Heuberg',         art: 'BKK', zusatzbeitrag: 2.79 },
  { name: 'BKK Technoform',                       art: 'BKK', zusatzbeitrag: 3.49 },
  { name: 'BKK VDN',                              art: 'BKK', zusatzbeitrag: 3.19 },
  { name: 'BKK VerbundPlus',                      art: 'BKK', zusatzbeitrag: 3.89 },
  { name: 'BKK Voralb HELLER/INDEX/LEUZE',        art: 'BKK', zusatzbeitrag: 3.90 },
  { name: 'BKK Werra-Meissner',                   art: 'BKK', zusatzbeitrag: 3.39 },
  { name: 'BKK Wirtschaft & Finanzen',            art: 'BKK', zusatzbeitrag: 3.99 },
  { name: 'BKK24',                                art: 'BKK', zusatzbeitrag: 4.39 },
  { name: 'BMW BKK',                              art: 'BKK', zusatzbeitrag: 3.90 },
  { name: 'Bosch BKK',                            art: 'BKK', zusatzbeitrag: 3.18 },
  { name: 'Continentale BKK',                     art: 'BKK', zusatzbeitrag: 3.33 },
  { name: 'Debeka BKK',                           art: 'BKK', zusatzbeitrag: 3.25 },
  { name: 'energie-BKK',                          art: 'BKK', zusatzbeitrag: 3.98 },
  { name: 'EY BKK',                               art: 'BKK', zusatzbeitrag: 2.29 },
  { name: 'Heimat Krankenkasse',                  art: 'BKK', zusatzbeitrag: 3.90 },
  { name: 'Koenig & Bauer BKK',                   art: 'BKK', zusatzbeitrag: 2.48 },
  { name: 'Krones BKK',                           art: 'BKK', zusatzbeitrag: 2.20 },
  { name: 'Mercedes-Benz BKK',                    art: 'BKK', zusatzbeitrag: 3.20 },
  { name: 'Merck BKK',                            art: 'BKK', zusatzbeitrag: 3.97 },
  { name: 'mhplus BKK',                           art: 'BKK', zusatzbeitrag: 3.86 },
  { name: 'Novitas BKK',                          art: 'BKK', zusatzbeitrag: 3.60 },
  { name: 'pronova BKK',                          art: 'BKK', zusatzbeitrag: 3.70 },
  { name: 'R+V Betriebskrankenkasse',             art: 'BKK', zusatzbeitrag: 3.49 },
  { name: 'Salus BKK',                            art: 'BKK', zusatzbeitrag: 3.29 },
  { name: 'Siemens-Betriebskrankenkasse (SBK)',   art: 'BKK', zusatzbeitrag: 3.80 },
  { name: 'SKD BKK',                              art: 'BKK', zusatzbeitrag: 2.98 },
  { name: 'Südzucker BKK',                        art: 'BKK', zusatzbeitrag: 2.90 },
  { name: 'TUI BKK',                              art: 'BKK', zusatzbeitrag: 2.50 },
  { name: 'vivida bkk',                           art: 'BKK', zusatzbeitrag: 3.79 },
  { name: 'WMF BKK',                              art: 'BKK', zusatzbeitrag: 2.85 },
  { name: 'ZF BKK',                               art: 'BKK', zusatzbeitrag: 3.40 },

  // ── IKK – Innungskrankenkassen ────────────────────────────────────────────
  { name: 'IKK – Die Innovationskasse',    art: 'IKK', zusatzbeitrag: 4.30 },
  { name: 'IKK Brandenburg und Berlin',   art: 'IKK', zusatzbeitrag: 4.35 },
  { name: 'IKK classic',                  art: 'IKK', zusatzbeitrag: 3.40 },
  { name: 'IKK gesund plus',              art: 'IKK', zusatzbeitrag: 3.39 },
  { name: 'IKK Südwest',                  art: 'IKK', zusatzbeitrag: 3.25 },

  // ── EK – Ersatzkassen ─────────────────────────────────────────────────────
  { name: 'BARMER',                           art: 'EK', zusatzbeitrag: 3.29 },
  { name: 'DAK-Gesundheit',                   art: 'EK', zusatzbeitrag: 3.20 },
  { name: 'hkk – Handelskrankenkasse',        art: 'EK', zusatzbeitrag: 2.59 },
  { name: 'HEK – Hanseatische Krankenkasse',  art: 'EK', zusatzbeitrag: 2.89 },
  { name: 'KKH Kaufmännische Krankenkasse',   art: 'EK', zusatzbeitrag: 3.78 },
  { name: 'Mobil Krankenkasse',               art: 'EK', zusatzbeitrag: 3.89 },
  { name: 'SECURVITA Krankenkasse',           art: 'EK', zusatzbeitrag: 3.90 },
  { name: 'Techniker Krankenkasse (TK)',      art: 'EK', zusatzbeitrag: 2.69 },
  { name: 'VIACTIV Krankenkasse',             art: 'EK', zusatzbeitrag: 4.19 },

  // ── KBS – Knappschaft-Bahn-See ────────────────────────────────────────────
  { name: 'KNAPPSCHAFT', art: 'KBS', zusatzbeitrag: 4.30 },

  // ── Sonstige ──────────────────────────────────────────────────────────────
  // SVLFG: geschlossene Kasse für Land-/Forstwirtschaft, kein allgemeiner Wettbewerb
  { name: 'SVLFG – Sozialversicherung Landwirtschaft', art: 'Sonstige', zusatzbeitrag: 0.00 },
];

export const STAND = '30.05.2026';
export const DURCHSCHNITT_ZB = 2.9; // vom BMG festgesetzt
