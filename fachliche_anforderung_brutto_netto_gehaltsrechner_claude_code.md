# Fachliche Anforderung: Statische Webseite für einen Brutto-Netto-Gehaltsrechner

**Zielsystem:** Statische Webanwendung ohne Backend  
**Primärer Markt:** Deutschland  
**Standard-Berechnungsjahr:** 2026  
**Ziel für Claude Code:** Vollständig lauffähiges, lokal testbares und statisch deploybares Projekt erzeugen  
**Stand der Anforderung:** 04.05.2026

---

## 1. Kurzbeschreibung

Es soll eine moderne, responsive und barrierearme statische Webseite für einen **Brutto-Netto-Gehaltsrechner für Arbeitnehmerinnen und Arbeitnehmer in Deutschland** erstellt werden. Nutzerinnen und Nutzer geben ihr Bruttogehalt sowie steuerliche und sozialversicherungsrechtliche Parameter ein und erhalten eine transparente Aufschlüsselung von:

- Nettogehalt pro Monat und Jahr
- Lohnsteuer
- Solidaritätszuschlag
- Kirchensteuer
- Arbeitnehmeranteilen zur Sozialversicherung
- optional: Arbeitgeberanteilen und geschätzten Arbeitgeber-Gesamtkosten
- effektiver Abgabenquote
- Erklärung der wichtigsten Rechenschritte

Die Anwendung muss vollständig clientseitig funktionieren. Es dürfen keine personenbezogenen Gehaltsdaten an Server, Analyse-Tools, Drittanbieter-Skripte oder externe APIs übertragen werden.

---

## 2. Zielsetzung

### 2.1 Geschäftliches Ziel

Die Webseite soll Nutzerinnen und Nutzern eine schnelle, verständliche und vertrauenswürdige Orientierung geben, wie sich aus einem Bruttogehalt ein Nettogehalt ergibt. Sie soll für Suchmaschinen auffindbar sein und durch klare Ergebnisdarstellung sowie fachliche Transparenz Vertrauen schaffen.

### 2.2 Nutzerziel

Nutzerinnen und Nutzer sollen in unter einer Minute folgende Fragen beantworten können:

- „Wie viel Netto bleibt mir monatlich von meinem Bruttogehalt?“
- „Welche Abzüge verursachen den größten Unterschied zwischen Brutto und Netto?“
- „Wie verändert sich mein Netto bei anderer Steuerklasse, Bundesland, Kirchensteuer oder Krankenversicherung?“
- „Welche Sozialversicherungsbeiträge fallen an?“
- „Was kostet mein Gehalt ungefähr inklusive Arbeitgeberanteilen?“

### 2.3 Qualitätsziel

Der Rechner soll fachlich nachvollziehbar, deterministisch, testbar und erweiterbar sein. Steuerliche Berechnungen dürfen nicht frei geschätzt werden, sondern müssen sich an den offiziellen Programmablaufplänen des Bundesministeriums der Finanzen orientieren.

---

## 3. Zielgruppe

Primäre Zielgruppen:

1. Arbeitnehmerinnen und Arbeitnehmer in Deutschland
2. Bewerberinnen und Bewerber, die ein Gehaltsangebot bewerten möchten
3. Berufseinsteigerinnen und Berufseinsteiger
4. Personen mit Gehaltsänderung, Steuerklassenwechsel oder Umzug in ein anderes Bundesland
5. Arbeitgeber, Recruiter oder HR-Personen, die überschlägig Arbeitnehmer- und Arbeitgeberbelastung sehen möchten

Nicht primär adressiert:

- Selbstständige
- Beamte
- Pensionäre
- komplexe Entgeltabrechnungen mit mehreren Arbeitgebern
- Steuerberatung oder verbindliche Lohnabrechnung

---

## 4. Fachlicher Scope

### 4.1 MVP-Scope

Die erste Version soll folgende Fälle zuverlässig abdecken:

- sozialversicherungspflichtige Beschäftigung als Arbeitnehmer/in in Deutschland
- laufender Arbeitslohn als Monats- oder Jahresbrutto
- Steuerklassen I bis VI
- Bundeslandauswahl für Kirchensteuer und Pflegeversicherung Sachsen
- gesetzliche Krankenversicherung mit frei eingebbarem Zusatzbeitrag
- private Krankenversicherung als vereinfachter Sonderfall mit manuell eingebbarem Monatsbeitrag und Arbeitgeberzuschuss
- Pflegeversicherung mit Kinderlosenzuschlag bzw. Kinderabschlägen
- Rentenversicherung und Arbeitslosenversicherung für regulär pflichtversicherte Arbeitnehmer
- Ausgabe monatlicher und jährlicher Werte

### 4.2 Erweiterter Scope, falls im Zeitrahmen möglich

Diese Punkte sind fachlich wünschenswert, aber nicht zwingend für die erste lauffähige Version:

- Übergangsbereich/Midijob 2026 mit Faktor F
- Minijob-Erkennung mit Hinweis statt vollständiger Arbeitgeber-Minijobabrechnung
- Einmalzahlungen wie Weihnachtsgeld oder Bonus nach PAP-Logik für sonstige Bezüge
- Freibetrag/Hinzurechnungsbetrag auf ELStAM-Basis
- Versorgungsbezüge
- detaillierte Berechnung freiwillig gesetzlich Versicherter
- Export als PDF oder CSV
- Share-Link über URL-Parameter
- Dark Mode

### 4.3 Nicht-Scope

Nicht umzusetzen, sofern nicht später ausdrücklich beauftragt:

- verbindliche Lohnabrechnung
- Steuererklärung oder Einkommensteuerveranlagung
- Ehegatten-Splitting-Simulation jenseits der Lohnsteuerklasse
- Kurzarbeitergeld
- Sachbezüge, Dienstwagen, geldwerter Vorteil
- betriebliche Altersvorsorge/Entgeltumwandlung
- mehrere Beschäftigungen
- Minijob-Arbeitgeberpauschalen im Detail
- Speicherung personenbezogener Nutzerprofile
- Nutzerkonten, Login, Backend, Datenbank

---

## 5. Fachliche Quellen und Datenstand

Die Anwendung soll ihre fachlichen Parameter in einem zentralen Konfigurationsmodul pflegen, zum Beispiel `src/config/rates2026.ts`. Die Werte müssen im Code mit Quellenhinweisen dokumentiert werden.

### 5.1 Lohnsteuer, Solidaritätszuschlag, Kirchenlohnsteuer-Maßstabsteuer

**Quelle der Wahrheit:** Offizieller Programmablaufplan des Bundesministeriums der Finanzen für 2026.

Das BMF hat für 2026 unter anderem folgende Programmablaufpläne bekannt gemacht:

- maschinelle Berechnung der vom Arbeitslohn einzubehaltenden Lohnsteuer, des Solidaritätszuschlags und der Maßstabsteuer für die Kirchenlohnsteuer
- Erstellung von Lohnsteuertabellen für 2026
- Begrenzung von Versorgungsbezügen ab 2026

Der Rechner soll für die Lohnsteuer nicht mit einer vereinfachten Einkommensteuerformel arbeiten, sondern den BMF-PAP 2026 portieren oder als fachliches Modul nachbilden.

### 5.2 Sozialversicherung 2026

Für 2026 sind im Standardfall folgende Werte als Ausgangspunkt zu verwenden:

| Größe | Wert 2026 |
|---|---:|
| Allgemeiner Krankenversicherungsbeitrag | 14,6 % |
| Durchschnittlicher Zusatzbeitrag GKV als Default | 2,9 % |
| Rentenversicherung allgemein | 18,6 % |
| Arbeitslosenversicherung | 2,6 % |
| Pflegeversicherung allgemein | 3,6 % |
| Pflegeversicherung kinderlos ab 23 Jahren | 4,2 % |
| Beitragsbemessungsgrenze KV/PV monatlich | 5.812,50 € |
| Beitragsbemessungsgrenze KV/PV jährlich | 69.750 € |
| Beitragsbemessungsgrenze RV/AV monatlich | 8.450 € |
| Beitragsbemessungsgrenze RV/AV jährlich | 101.400 € |
| Versicherungspflichtgrenze GKV monatlich | 6.450 € |
| Versicherungspflichtgrenze GKV jährlich | 77.400 € |
| Bezugsgröße Sozialversicherung monatlich | 3.955 € |
| Minijob-Grenze 2026 | 603 € monatlich |
| Übergangsbereich 2026 | 603,01 € bis 2.000 € monatlich |
| Faktor F Übergangsbereich 2026 | 0,6619 |

Der GKV-Zusatzbeitrag ist nur als Default auf 2,9 % zu setzen. Nutzerinnen und Nutzer müssen den tatsächlichen kassenindividuellen Zusatzbeitrag überschreiben können.

### 5.3 Kirchensteuer

Für die Kirchensteuer gilt als Standardlogik:

| Bundesland | Kirchensteuersatz |
|---|---:|
| Bayern | 8 % der Lohnsteuer/Maßstabsteuer |
| Baden-Württemberg | 8 % der Lohnsteuer/Maßstabsteuer |
| alle übrigen Bundesländer | 9 % der Lohnsteuer/Maßstabsteuer |

Die Kirchensteuer darf nur berechnet werden, wenn die Nutzerin oder der Nutzer Kirchensteuerpflicht aktiviert hat.

### 5.4 Quellenliste zur Dokumentation im Projekt

Im Projekt-README und im Code-Kommentar der Rate-Konfiguration sind mindestens diese Quellen zu dokumentieren:

- BMF Programmablaufpläne zur Lohnsteuer für/ab 2026: https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026.html
- BMF Lohn- und Einkommensteuerrechner: https://www.bundesfinanzministerium.de/Web/DE/Service/Apps_Rechner/Abgabenrechner/abgabenrechner.html
- BMAS: Änderungen und Rechengrößen 2026: https://www.bmas.de/DE/Service/Presse/Pressemitteilungen/2025/das-aendert-sich-im-neuen-jahr.html
- Bundesregierung: Beitragsbemessungsgrenzen 2026: https://www.bundesregierung.de/breg-de/aktuelles/beitragsgemessungsgrenzen-2386514
- GKV-Spitzenverband: Pflegeversicherungs-Beitragssätze nach Kinderzahl: https://www.gkv-spitzenverband.de/pflegeversicherung/pv_grundprinzipien/pflege_beitragssatz/beitragssatz.jsp
- Techniker Krankenkasse: PV-Beitrag 2026 und Sachsen-Besonderheit: https://www.tk.de/firmenkunden/versicherung/beitraege-faq/pv-beitraege/wie-hoch-ist-pv-beitrag-2149454
- Techniker Krankenkasse: SV-Rechengrößen 2026: https://www.tk.de/firmenkunden/service/fachthemen/fachthema-beitraege/sozialversicherungs-rechengroessen-2026-2203234
- Bundesanzeiger/BMG-Bekanntmachung durchschnittlicher Zusatzbeitrag 2026: https://www.bundesanzeiger.de/

---

## 6. Funktionale Anforderungen

### 6.1 Eingaben: Gehalt

Die Anwendung muss folgende Gehaltseingaben unterstützen:

| Feld | Typ | Pflicht | Default | Beschreibung |
|---|---|---:|---|---|
| Bruttogehalt | Dezimalzahl | ja | 4.000,00 € | Betrag in Euro |
| Zeitraum | Auswahl | ja | monatlich | monatlich oder jährlich |
| Abrechnungsjahr | Auswahl | ja | 2026 | zunächst nur 2026; Architektur für Folgejahre vorbereiten |
| Anzahl Gehälter | Zahl | nein | 12 | Optional für reine Jahresübersicht; im MVP kann monatlich x 12 gerechnet werden |

Regeln:

- Eingaben müssen deutsche Zahlenformate akzeptieren, z. B. `4000`, `4.000`, `4.000,00`.
- Intern müssen Beträge centgenau verarbeitet werden.
- Negative Werte sind unzulässig.
- Bei sehr hohen Werten ist eine verständliche Fehlermeldung anzuzeigen, falls das PAP-Modul außerhalb gültiger Parameter läuft.

### 6.2 Eingaben: Steuer

| Feld | Typ | Pflicht | Default | Beschreibung |
|---|---|---:|---|---|
| Steuerklasse | Auswahl I-VI | ja | I | Lohnsteuerklasse |
| Bundesland | Auswahl 16 Länder | ja | Nordrhein-Westfalen | relevant für Kirchensteuer und Pflegeversicherung Sachsen |
| Kirchensteuerpflicht | Boolean | ja | nein | aktiviert Kirchensteuerberechnung |
| Kinderfreibeträge | Dezimalzahl in 0,5-Schritten | ja | 0 | z. B. 0, 0,5, 1, 1,5, 2 |
| Geburtsjahr oder Alter | Zahl | ja | 30 | relevant für Pflegeversicherung/Kinderlosenzuschlag und ggf. Altersentlastung, sofern PAP genutzt |
| Steuerfreibetrag monatlich | Dezimalzahl | nein | 0 € | optionaler ELStAM-Freibetrag |
| Hinzurechnungsbetrag monatlich | Dezimalzahl | nein | 0 € | optionaler ELStAM-Hinzurechnungsbetrag |

Regeln:

- Steuerklasse III, IV und V sollen wie im PAP behandelt werden.
- Kinderfreibeträge beeinflussen insbesondere Solidaritätszuschlag und Kirchensteuer-Maßstabsteuer gemäß PAP.
- Wenn Kirchensteuer deaktiviert ist, ist Kirchensteuer immer 0 €.
- Für Baden-Württemberg und Bayern ist bei aktivierter Kirchensteuer 8 %, in allen anderen Ländern 9 % anzuwenden.

### 6.3 Eingaben: Sozialversicherung

| Feld | Typ | Pflicht | Default | Beschreibung |
|---|---|---:|---|---|
| Krankenversicherung | Auswahl | ja | gesetzlich | gesetzlich / privat |
| GKV-Zusatzbeitrag | Prozent | ja bei GKV | 2,9 % | frei überschreibbar |
| PKV-Beitrag Arbeitnehmer monatlich | Euro | ja bei PKV | 0 € | vereinfachte Eingabe |
| Arbeitgeberzuschuss PKV berücksichtigen | Boolean | nein | ja | nur für Arbeitgeberkosten/Nettohinweis |
| Rentenversicherungspflicht | Boolean | ja | ja | wenn nein: RV-Beitrag 0 |
| Arbeitslosenversicherungspflicht | Boolean | ja | ja | wenn nein: AV-Beitrag 0 |
| Pflegeversicherungspflicht | Boolean | ja | ja | bei GKV ja; bei PKV mit manuellem Beitrag optional |
| Kinderlos | Boolean | ja | ja | relevant für PV-Zuschlag |
| Anzahl berücksichtigungsfähiger Kinder unter 25 | Zahl 0-5+ | ja | 0 | relevant für PV-Abschläge ab dem 2. Kind |
| Wohn-/Arbeitsland Sachsen | aus Bundesland ableitbar | ja | nein | Sachsen-Sonderregel PV |

Regeln für die gesetzliche Krankenversicherung:

- Beitragspflichtiges Entgelt KV = `min(monatliches Brutto, BBG_KV_PV_monat)`.
- Arbeitnehmeranteil KV = beitragspflichtiges Entgelt KV × `(14,6 % + Zusatzbeitrag) / 2`.
- Arbeitgeberanteil KV = gleicher Betrag wie Arbeitnehmeranteil, sofern reguläre Beschäftigung.
- Zusatzbeitrag ist paritätisch aufzuteilen.

Regeln für Rentenversicherung:

- Beitragspflichtiges Entgelt RV = `min(monatliches Brutto, BBG_RV_AV_monat)`.
- Arbeitnehmeranteil RV = beitragspflichtiges Entgelt RV × `9,3 %`.
- Arbeitgeberanteil RV = beitragspflichtiges Entgelt RV × `9,3 %`.

Regeln für Arbeitslosenversicherung:

- Beitragspflichtiges Entgelt AV = `min(monatliches Brutto, BBG_RV_AV_monat)`.
- Arbeitnehmeranteil AV = beitragspflichtiges Entgelt AV × `1,3 %`.
- Arbeitgeberanteil AV = beitragspflichtiges Entgelt AV × `1,3 %`.

Regeln für Pflegeversicherung außerhalb Sachsen:

| Situation | Gesamtbeitrag | Arbeitnehmeranteil | Arbeitgeberanteil |
|---|---:|---:|---:|
| kinderlos ab 23 Jahren | 4,20 % | 2,40 % | 1,80 % |
| mit 1 Kind oder kinderlos unter 23 | 3,60 % | 1,80 % | 1,80 % |
| mit 2 Kindern unter 25 | 3,35 % | 1,55 % | 1,80 % |
| mit 3 Kindern unter 25 | 3,10 % | 1,30 % | 1,80 % |
| mit 4 Kindern unter 25 | 2,85 % | 1,05 % | 1,80 % |
| mit 5 oder mehr Kindern unter 25 | 2,60 % | 0,80 % | 1,80 % |

Regeln für Pflegeversicherung in Sachsen:

| Situation | Gesamtbeitrag | Arbeitnehmeranteil | Arbeitgeberanteil |
|---|---:|---:|---:|
| kinderlos ab 23 Jahren | 4,20 % | 2,90 % | 1,30 % |
| mit 1 Kind oder kinderlos unter 23 | 3,60 % | 2,30 % | 1,30 % |
| mit 2 Kindern unter 25 | 3,35 % | 2,05 % | 1,30 % |
| mit 3 Kindern unter 25 | 3,10 % | 1,80 % | 1,30 % |
| mit 4 Kindern unter 25 | 2,85 % | 1,55 % | 1,30 % |
| mit 5 oder mehr Kindern unter 25 | 2,60 % | 1,30 % | 1,30 % |

### 6.4 Private Krankenversicherung

Für PKV soll im MVP eine einfache, transparente Modellierung reichen:

- Nutzer gibt seinen tatsächlichen monatlichen PKV-/PPV-Beitrag selbst ein.
- Dieser Betrag wird als Arbeitnehmerabzug berücksichtigt.
- Arbeitgeberzuschuss kann optional angezeigt werden, darf aber das Netto nicht künstlich erhöhen, sofern der Beitrag bereits als Arbeitnehmerbelastung modelliert wird.
- Es muss klar darauf hingewiesen werden, dass PKV-Zuschüsse, Basistarifanteile und steuerliche Vorsorgepauschale fachlich komplex sind und die Berechnung nur eine Orientierung darstellt, falls keine vollständige PAP-/PKV-Logik implementiert wurde.

### 6.5 Ergebnisdarstellung

Die Ergebnisse müssen mindestens enthalten:

| Ergebnis | Pflicht | Beschreibung |
|---|---:|---|
| Brutto monatlich | ja | normalisierte Eingabe |
| Netto monatlich | ja | zentrales Hauptergebnis |
| Netto jährlich | ja | Netto monatlich × 12, sofern keine Sonderlogik |
| Summe Steuern | ja | Lohnsteuer + Soli + Kirchensteuer |
| Lohnsteuer | ja | nach PAP |
| Solidaritätszuschlag | ja | nach PAP |
| Kirchensteuer | ja | nur wenn aktiviert |
| Summe Sozialversicherung AN | ja | KV + PV + RV + AV |
| KV Arbeitnehmeranteil | ja | Einzelwert |
| PV Arbeitnehmeranteil | ja | Einzelwert |
| RV Arbeitnehmeranteil | ja | Einzelwert |
| AV Arbeitnehmeranteil | ja | Einzelwert |
| Abzüge gesamt | ja | Steuern + SV Arbeitnehmer |
| Effektive Abgabenquote | ja | Abzüge / Brutto |
| Arbeitgeberanteile | soll | KV, PV, RV, AV |
| Arbeitgeber-Gesamtkosten | soll | Brutto + Arbeitgeberanteile |

Die Ergebnisbox soll folgende Priorität haben:

1. Groß: „Dein geschätztes Netto: X €/Monat“
2. Direkt darunter: „Bei Y €/Monat Brutto“
3. Danach: Abzugsübersicht als Tabelle und einfache visuelle Aufteilung
4. Danach: Methodik- und Hinweisbereich

### 6.6 Erklärung der Berechnung

Unterhalb des Ergebnisses soll es einen Abschnitt „So wird dein Netto berechnet“ geben. Dieser Abschnitt soll in einfacher Sprache erklären:

- Brutto minus Lohnsteuer/Soli/Kirchensteuer minus Sozialversicherungsbeiträge = Netto
- Sozialversicherungsbeiträge werden nur bis zur Beitragsbemessungsgrenze erhoben
- der Zusatzbeitrag der Krankenkasse kann individuell abweichen
- die Kirchensteuer hängt vom Bundesland ab
- die Pflegeversicherung hängt von Kinderzahl, Alter und Sachsen-Regel ab
- das Ergebnis ist eine unverbindliche Orientierung und ersetzt keine Lohnabrechnung oder Steuerberatung

---

## 7. Validierung und Fehlermeldungen

### 7.1 Eingabevalidierung

Die Anwendung muss folgende Fälle abfangen:

- leeres Bruttogehalt
- Bruttogehalt kleiner 0
- ungültige Prozentangaben, z. B. Zusatzbeitrag kleiner 0 oder größer 10
- ungültige Kinderfreibeträge, z. B. 0,3
- Kirchensteuer aktiv, aber kein Bundesland gewählt
- PKV aktiv, aber kein PKV-Beitrag eingetragen

### 7.2 Warnhinweise

Die Anwendung soll in folgenden Fällen Warnhinweise anzeigen:

- Bruttogehalt liegt im Minijob- oder Midijob-Bereich und die erweiterte Übergangsbereichslogik ist nicht implementiert.
- Jahresbrutto überschreitet die Versicherungspflichtgrenze; bei GKV soll erklärt werden, dass freiwillige gesetzliche Versicherung oder PKV möglich sein kann.
- PKV wurde gewählt; Hinweis auf vereinfachte Modellierung.
- Sehr hohes Einkommen; Hinweis, dass Beitragsbemessungsgrenzen greifen.

### 7.3 Fehlertexte

Fehlertexte sollen kurz, konkret und handlungsorientiert sein.

Beispiele:

- „Bitte gib ein Bruttogehalt größer als 0 € ein.“
- „Der Zusatzbeitrag muss zwischen 0 % und 10 % liegen.“
- „Kinderfreibeträge sind nur in 0,5-Schritten möglich.“
- „Für die Kirchensteuerberechnung benötigen wir dein Bundesland.“

---

## 8. Berechnungsanforderungen

### 8.1 Allgemeine Berechnungsprinzipien

- Alle Geldbeträge intern möglichst als Cent-Integer oder mit einer Decimal-Hilfsfunktion berechnen.
- Rundung auf zwei Nachkommastellen für Anzeige.
- Sozialversicherungsbeiträge je Versicherungszweig separat auf Cent runden und anschließend summieren.
- Steuerwerte gemäß PAP-Rundungsregeln berechnen.
- Keine unkommentierten Magic Numbers im Berechnungscode.
- Alle Jahreswerte aus einer zentralen Jahreskonfiguration lesen.

### 8.2 Modulstruktur

Empfohlene fachliche Module:

```text
src/
  config/
    rates2026.ts
    federalStates.ts
  domain/
    money.ts
    inputTypes.ts
  tax/
    pap2026.ts
    churchTax.ts
    taxCalculator.ts
  social-security/
    statutoryHealth.ts
    careInsurance.ts
    pensionInsurance.ts
    unemploymentInsurance.ts
    socialSecurityCalculator.ts
  calculator/
    grossNetCalculator.ts
  ui/
    form.ts
    renderResults.ts
    formatters.ts
```

### 8.3 Datenmodell Eingabe

```ts
export type GrossNetInput = {
  grossAmountEuro: number;
  period: 'monthly' | 'yearly';
  taxYear: 2026;
  taxClass: 1 | 2 | 3 | 4 | 5 | 6;
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
};
```

### 8.4 Datenmodell Ergebnis

```ts
export type GrossNetResult = {
  monthly: PeriodResult;
  yearly: PeriodResult;
  warnings: string[];
  assumptions: string[];
};

export type PeriodResult = {
  gross: number;
  net: number;
  deductionsTotal: number;
  taxes: {
    wageTax: number;
    solidaritySurcharge: number;
    churchTax: number;
    total: number;
  };
  employeeSocialSecurity: {
    health: number;
    care: number;
    pension: number;
    unemployment: number;
    total: number;
  };
  employerSocialSecurity: {
    health: number;
    care: number;
    pension: number;
    unemployment: number;
    total: number;
  };
  employerTotalCost: number;
  effectiveDeductionRate: number;
};
```

---

## 9. UX- und Designanforderungen

### 9.1 Seitenstruktur

Die Seite soll aus diesen Bereichen bestehen:

1. Header mit Titel und Kurzversprechen
2. Hero-Bereich mit Rechnerformular
3. Ergebnisbereich direkt neben oder unter dem Formular
4. Detailaufschlüsselung der Abzüge
5. Erklärung „So funktioniert der Brutto-Netto-Rechner“
6. FAQ-Bereich
7. Quellen- und Datenstand-Hinweis
8. Disclaimer
9. Footer mit Datenschutz-/Impressum-Platzhaltern

### 9.2 Formular-UX

- Auf Desktop: zweispaltiges Layout mit Formular links und Ergebnis rechts.
- Auf Mobilgeräten: Formular oben, Ergebnis darunter; Ergebnisbox sticky oder nach Berechnung prominent sichtbar.
- Pflichtfelder klar beschriften.
- Erweiterte Optionen in einklappbare Bereiche legen.
- Bei jeder Eingabe automatisch neu berechnen, sofern alle Pflichtfelder gültig sind.
- Zusätzlich Button „Berechnen“ anbieten, damit die Interaktion eindeutig bleibt.
- Button „Zurücksetzen“ anbieten.
- Prozent- und Eurofelder mit Einheiten anzeigen.

### 9.3 Ergebnis-UX

- Nettogehalt sehr prominent darstellen.
- Brutto, Netto und Abzüge farblich/visuell unterscheidbar machen, ohne ausschließlich Farbe als Informationsträger zu verwenden.
- Abzüge als Tabelle und optional als Balken-/Donutvisualisierung darstellen.
- Bei Hover oder Fokus kurze Tooltips/Erklärtexte für Lohnsteuer, Soli, KV, PV, RV, AV anzeigen.
- Ergebnis soll auch ohne JavaScript-Framework performant rendern.

### 9.4 Sprache und Tonalität

- Deutsch, verständlich, sachlich, nicht werblich übertrieben.
- Nutzer direkt, aber neutral ansprechen: „Dein geschätztes Netto“.
- Kein Anspruch auf verbindliche Steuerberatung.

---

## 10. Barrierefreiheit

Die Webseite soll mindestens folgende Anforderungen erfüllen:

- semantisches HTML (`main`, `section`, `form`, `label`, `fieldset`, `legend`)
- jedes Eingabefeld hat ein sichtbares Label
- Fehlermeldungen sind per `aria-describedby` mit Feldern verknüpft
- Ergebnisänderungen werden für Screenreader über `aria-live="polite"` verfügbar
- vollständige Tastaturbedienbarkeit
- sichtbarer Fokuszustand
- ausreichende Kontraste nach WCAG AA
- keine Information ausschließlich über Farbe
- verständliche Überschriftenhierarchie
- responsive Bedienbarkeit ab 320 px Breite

---

## 11. Datenschutz und Sicherheit

### 11.1 Datenschutz

- Keine Gehaltsdaten an Server senden.
- Keine externen Tracking-Skripte.
- Keine Cookies, außer technisch notwendige lokale Einstellungen; vorzugsweise gar keine Cookies.
- LocalStorage nur optional für nicht-sensitive Einstellungen wie Theme oder zuletzt gewähltes Bundesland; im MVP besser vermeiden.
- Datenschutz-Hinweis: „Die Berechnung erfolgt lokal in deinem Browser.“

### 11.2 Sicherheit

- Keine `eval`-Nutzung.
- Keine unkontrollierten HTML-Injections.
- Eingaben immer als Zahlen parsen und validieren.
- Externe Abhängigkeiten minimieren.
- Keine CDN-Skripte; alle Assets lokal bundlen.

---

## 12. SEO- und Contentanforderungen

### 12.1 Meta-Daten

Empfohlene Seitendaten:

- Title: `Brutto-Netto-Rechner 2026 | Gehalt netto berechnen`
- Meta Description: `Berechne dein geschätztes Nettogehalt 2026 aus dem Bruttogehalt – mit Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und Sozialabgaben. Läuft lokal im Browser.`
- H1: `Brutto-Netto-Rechner 2026`

### 12.2 Strukturierte Inhalte

Die Seite soll erklärende Inhalte enthalten:

- Was ist der Unterschied zwischen Brutto und Netto?
- Welche Abzüge gibt es vom Gehalt?
- Wie wirken Steuerklasse und Bundesland?
- Was ist der Krankenkassen-Zusatzbeitrag?
- Was bedeuten Beitragsbemessungsgrenzen?
- Warum ist das Ergebnis unverbindlich?

### 12.3 FAQ-Beispiele

FAQ-Fragen:

1. „Wie genau ist der Brutto-Netto-Rechner?“
2. „Welche Steuerklasse soll ich auswählen?“
3. „Warum ist mein Krankenkassenbeitrag anders?“
4. „Wann fällt Solidaritätszuschlag an?“
5. „Warum ist die Pflegeversicherung in Sachsen anders?“
6. „Wer zahlt den Kinderlosenzuschlag in der Pflegeversicherung?“
7. „Was passiert, wenn mein Einkommen über der Beitragsbemessungsgrenze liegt?“

Optional kann FAQPage-JSON-LD eingebunden werden, sofern der Inhalt sichtbar auf der Seite steht.

---

## 13. Testanforderungen

### 13.1 Unit Tests

Mindestens folgende Module müssen getestet werden:

- `money.ts`: Parsing, Rundung, Formatierung
- `statutoryHealth.ts`: KV-Beiträge mit BBG und Zusatzbeitrag
- `careInsurance.ts`: PV mit Kinderzahl, Kinderlosenzuschlag und Sachsen
- `pensionInsurance.ts`: RV mit BBG
- `unemploymentInsurance.ts`: AV mit BBG
- `churchTax.ts`: 8 % / 9 % nach Bundesland
- `grossNetCalculator.ts`: Gesamtsumme und Nettoformel
- `pap2026.ts`: Golden-Master-Tests gegen BMF-PAP/BMF-Rechner

### 13.2 Beispiel-Testfälle Sozialversicherung

Diese Testfälle dienen zur Validierung der Sozialversicherungsmodule ohne Lohnsteuer:

#### Fall A: 4.000 € brutto, NRW, GKV-Zusatzbeitrag 2,9 %, 1 Kind

- KV-Bemessung: 4.000,00 €
- KV Arbeitnehmer: 4.000 × 8,75 % = 350,00 €
- PV Arbeitnehmer: 4.000 × 1,80 % = 72,00 €
- RV Arbeitnehmer: 4.000 × 9,30 % = 372,00 €
- AV Arbeitnehmer: 4.000 × 1,30 % = 52,00 €
- SV Arbeitnehmer gesamt: 846,00 €

#### Fall B: 10.000 € brutto, NRW, GKV-Zusatzbeitrag 2,9 %, 1 Kind

- KV-Bemessung: 5.812,50 €
- KV Arbeitnehmer: 5.812,50 × 8,75 % = 508,59 € bei Cent-Rundung
- PV Arbeitnehmer: 5.812,50 × 1,80 % = 104,63 € bei Cent-Rundung
- RV-Bemessung: 8.450,00 €
- RV Arbeitnehmer: 8.450 × 9,30 % = 785,85 €
- AV Arbeitnehmer: 8.450 × 1,30 % = 109,85 €
- SV Arbeitnehmer gesamt: 1.508,92 €

#### Fall C: 4.000 € brutto, Sachsen, kinderlos ab 23

- PV-Bemessung: 4.000,00 €
- PV Arbeitnehmer: 4.000 × 2,90 % = 116,00 €
- PV Arbeitgeber: 4.000 × 1,30 % = 52,00 €

### 13.3 Golden-Master-Tests für Steuer

Für die Lohnsteuer muss eine kleine Golden-Master-Testdatei angelegt werden, z. B. `tests/fixtures/bmf2026.json`. Die erwarteten Werte sollen manuell oder automatisiert aus dem offiziellen BMF-Rechner oder direkt aus einer validierten PAP-Portierung erzeugt werden.

Mindestens zu testen:

- Steuerklasse I, 4.000 €/Monat, keine Kinderfreibeträge, keine Kirche
- Steuerklasse III, 4.000 €/Monat, 1 Kinderfreibetrag, Kirche Bayern
- Steuerklasse V, 4.000 €/Monat, keine Kinderfreibeträge
- Steuerklasse VI, 2.000 €/Monat
- sehr hohes Einkommen mit Solidaritätszuschlag
- Einkommen unterhalb steuerlicher Belastung

Akzeptanzkriterium: Abweichung maximal 1 Cent pro ausgewiesenem Steuerwert, sofern PAP-Rundung korrekt portiert wurde.

### 13.4 End-to-End Smoke Tests

- Seite lädt ohne JavaScript-Fehler.
- Standardwerte erzeugen ein Ergebnis.
- Änderung des Bruttogehalts aktualisiert das Netto.
- Änderung des Bundeslands von NRW zu Bayern ändert Kirchensteuer bei aktivierter Kirchensteuer.
- Änderung des Bundeslands zu Sachsen ändert Pflegeversicherungsanteil.
- Bei GKV-Zusatzbeitrag-Änderung ändern sich KV-Abzug und Netto.
- Build erzeugt statische Dateien im `dist/`-Ordner.

---

## 14. Definition of Done

Die Umsetzung gilt als fertig, wenn:

1. Die Seite lokal mit `npm install`, `npm run dev`, `npm test` und `npm run build` funktioniert.
2. Der Build vollständig statisch deploybar ist.
3. Die Berechnungslogik modular und getestet ist.
4. Die offiziellen fachlichen Quellen im README dokumentiert sind.
5. Der BMF-PAP 2026 für Lohnsteuer/Soli/Kirchenlohnsteuer-Maßstabsteuer implementiert oder klar als validiertes Modul enthalten ist.
6. Sozialversicherungswerte 2026 zentral konfiguriert sind.
7. Die UI auf Desktop und Mobilgeräten nutzbar ist.
8. Barrierefreiheitsgrundlagen erfüllt sind.
9. Es keine externen Tracking- oder API-Aufrufe gibt.
10. Es einen sichtbaren Disclaimer zur Unverbindlichkeit gibt.

---

## 15. Initialer Prompt für Claude Code

Der folgende Prompt kann direkt als Startprompt in Claude Code verwendet werden.

```text
Du bist Claude Code und sollst ein vollständig lauffähiges statisches Webprojekt für einen deutschen Brutto-Netto-Gehaltsrechner erstellen.

Ziel:
Erstelle eine moderne, responsive, barrierearme und vollständig clientseitige Webseite, mit der Nutzerinnen und Nutzer ihr geschätztes Nettogehalt für Deutschland im Jahr 2026 berechnen können. Die Anwendung darf kein Backend, keine externen APIs, keine Tracking-Skripte und keine CDN-Abhängigkeiten verwenden. Alle Berechnungen müssen lokal im Browser erfolgen.

Technischer Rahmen:
- Nutze Vite + TypeScript + Vitest oder eine vergleichbar schlanke statische TypeScript-Struktur.
- Das Ergebnis muss mit `npm install`, `npm run dev`, `npm test` und `npm run build` funktionieren.
- Der Build muss statische Dateien in `dist/` erzeugen.
- Verwende semantisches HTML, CSS und TypeScript. Kein React/Vue/Svelte, außer du begründest es im README; bevorzugt Vanilla TypeScript.
- Keine externen Skripte, keine CDNs, kein Tracking.
- Implementiere saubere Module für Steuer, Sozialversicherung, Formatierung, Validierung und UI.

Fachliche Grundlage:
- Standardjahr ist 2026.
- Für Lohnsteuer, Solidaritätszuschlag und Maßstabsteuer der Kirchenlohnsteuer ist der offizielle BMF-Programmablaufplan 2026 die Quelle der Wahrheit. Nutze bzw. portiere den PAP 2026, nicht eine grobe Einkommensteuer-Schätzung.
- BMF PAP 2026: https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/2025-11-12-PAP-2026.html
- BMF Lohn- und Einkommensteuerrechner zur Validierung: https://www.bundesfinanzministerium.de/Web/DE/Service/Apps_Rechner/Abgabenrechner/abgabenrechner.html
- Sozialversicherungswerte 2026: dokumentiere die Quellen im README und in der Rate-Konfiguration.

Zu verwendende Sozialversicherungswerte 2026:
- Allgemeiner GKV-Beitrag: 14,6 %
- Default für durchschnittlichen Zusatzbeitrag: 2,9 %, aber im Formular frei überschreibbar
- Rentenversicherung allgemein: 18,6 %, Arbeitnehmeranteil 9,3 %
- Arbeitslosenversicherung: 2,6 %, Arbeitnehmeranteil 1,3 %
- Pflegeversicherung allgemein: 3,6 %
- Pflegeversicherung kinderlos ab 23 Jahren: 4,2 %
- BBG KV/PV: 5.812,50 €/Monat bzw. 69.750 €/Jahr
- BBG RV/AV: 8.450 €/Monat bzw. 101.400 €/Jahr
- Versicherungspflichtgrenze GKV: 6.450 €/Monat bzw. 77.400 €/Jahr
- Minijob-Grenze: 603 €/Monat; falls Minijob/Midijob nicht vollständig implementiert ist, erkenne diesen Bereich und zeige einen Hinweis.

Pflegeversicherung:
Außerhalb Sachsen:
- kinderlos ab 23: AN 2,40 %, AG 1,80 %
- mit 1 Kind oder kinderlos unter 23: AN 1,80 %, AG 1,80 %
- mit 2 Kindern unter 25: AN 1,55 %, AG 1,80 %
- mit 3 Kindern unter 25: AN 1,30 %, AG 1,80 %
- mit 4 Kindern unter 25: AN 1,05 %, AG 1,80 %
- mit 5+ Kindern unter 25: AN 0,80 %, AG 1,80 %

In Sachsen:
- kinderlos ab 23: AN 2,90 %, AG 1,30 %
- mit 1 Kind oder kinderlos unter 23: AN 2,30 %, AG 1,30 %
- mit 2 Kindern unter 25: AN 2,05 %, AG 1,30 %
- mit 3 Kindern unter 25: AN 1,80 %, AG 1,30 %
- mit 4 Kindern unter 25: AN 1,55 %, AG 1,30 %
- mit 5+ Kindern unter 25: AN 1,30 %, AG 1,30 %

Kirchensteuer:
- Bayern und Baden-Württemberg: 8 %
- alle anderen Bundesländer: 9 %
- nur berechnen, wenn Kirchensteuerpflicht aktiviert ist

Formularfelder:
- Bruttogehalt in Euro
- Zeitraum monatlich/jährlich
- Steuerjahr, zunächst 2026
- Steuerklasse I bis VI
- Bundesland
- Kirchensteuer ja/nein
- Kinderfreibeträge in 0,5-Schritten
- Alter oder Geburtsjahr
- Krankenversicherung gesetzlich/privat
- GKV-Zusatzbeitrag in Prozent
- PKV-Beitrag monatlich, wenn privat gewählt
- Rentenversicherungspflicht ja/nein
- Arbeitslosenversicherungspflicht ja/nein
- Pflegeversicherungspflicht ja/nein
- kinderlos ja/nein
- Anzahl berücksichtigungsfähiger Kinder unter 25
- optional: monatlicher Freibetrag und Hinzurechnungsbetrag

Ergebnisdarstellung:
- Zeige prominent: geschätztes Netto pro Monat.
- Zeige zusätzlich Netto pro Jahr.
- Zeige Brutto, Steuern, Sozialabgaben und Netto als klare Aufschlüsselung.
- Zeige einzelne Werte für Lohnsteuer, Soli, Kirchensteuer, KV, PV, RV und AV.
- Zeige Arbeitgeberanteile und geschätzte Arbeitgeber-Gesamtkosten.
- Zeige effektive Abgabenquote.
- Zeige Annahmen und Warnhinweise.

UX:
- Desktop: Formular und Ergebnis nebeneinander.
- Mobil: einspaltig, Ergebnis gut sichtbar.
- Automatische Neuberechnung bei Eingaben plus sichtbarer Berechnen-Button.
- Erweiterte Optionen einklappbar.
- Verständliche Fehlermeldungen.
- Deutsches Zahlenformat für Ein- und Ausgabe.

Barrierefreiheit:
- Nutze semantisches HTML.
- Labels für alle Eingaben.
- Fieldsets für zusammengehörige Optionen.
- aria-live für Ergebnisupdates.
- Tastaturbedienbarkeit und sichtbarer Fokus.
- Ausreichender Kontrast.

Tests:
- Schreibe Unit Tests für Money Parsing/Formatierung, Sozialversicherung, Pflegeversicherung Sachsen/Nicht-Sachsen, Kirchensteuer und Gesamtrechnung.
- Lege Golden-Master-Tests für das Steuer/PAP-Modul an. Falls die exakten Golden-Werte nicht automatisch erzeugt werden können, lege Fixtures mit klaren TODOs und Dokumentation an und implementiere die PAP-Schnittstelle so, dass die Tests einfach ergänzt werden können.
- Teste mindestens diese SV-Fälle:
  1. 4.000 € brutto, NRW, GKV-Zusatzbeitrag 2,9 %, 1 Kind: KV AN 350,00 €, PV AN 72,00 €, RV AN 372,00 €, AV AN 52,00 €, SV AN gesamt 846,00 €.
  2. 10.000 € brutto, NRW, GKV-Zusatzbeitrag 2,9 %, 1 Kind: KV AN 508,59 €, PV AN 104,63 €, RV AN 785,85 €, AV AN 109,85 €, SV AN gesamt 1.508,92 €.
  3. 4.000 € brutto, Sachsen, kinderlos ab 23: PV AN 116,00 €, PV AG 52,00 €.

Content:
- Erstelle auf der Seite kurze Erklärabschnitte zu Brutto/Netto, Steuerklassen, Zusatzbeitrag, Beitragsbemessungsgrenzen, Pflegeversicherung und Unverbindlichkeit.
- Füge einen sichtbaren Disclaimer hinzu: Die Berechnung ist unverbindlich und ersetzt keine Lohnabrechnung, Steuerberatung oder Auskunft von Finanzamt/Krankenkasse.
- Füge einen Quellen- und Datenstand-Hinweis ein.

README:
- Beschreibe Installation, Entwicklung, Test und Build.
- Dokumentiere die fachlichen Quellen.
- Dokumentiere bekannte Einschränkungen, insbesondere falls Minijob/Midijob, PKV oder Sonderzahlungen nicht vollständig umgesetzt sind.

Arbeite eigenständig. Erstelle die vollständige Projektstruktur, implementiere die Module, schreibe Tests und führe Tests sowie Build aus. Behebe Fehler, bis alles erfolgreich läuft.
```

---

## 16. Empfohlene Projektstruktur für die Umsetzung

```text
brutto-netto-rechner/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  vitest.config.ts
  README.md
  src/
    main.ts
    styles.css
    config/
      federalStates.ts
      rates2026.ts
    domain/
      inputTypes.ts
      money.ts
    tax/
      pap2026.ts
      churchTax.ts
      taxCalculator.ts
    social-security/
      statutoryHealth.ts
      careInsurance.ts
      pensionInsurance.ts
      unemploymentInsurance.ts
      socialSecurityCalculator.ts
    calculator/
      grossNetCalculator.ts
    ui/
      dom.ts
      form.ts
      renderResults.ts
      validation.ts
      formatters.ts
  tests/
    money.test.ts
    socialSecurity.test.ts
    careInsurance.test.ts
    churchTax.test.ts
    grossNetCalculator.test.ts
    fixtures/
      bmf2026.json
```

---

## 17. Fachliche Annahmen für Version 1

- Berechnet wird eine Orientierung für laufenden Arbeitslohn.
- Jahreswerte sind standardmäßig Monatswerte × 12.
- Sonderzahlungen werden in Version 1 nicht gesondert nach Einmalzahlungslogik berechnet.
- Bei gesetzlicher Krankenversicherung wird der Zusatzbeitrag als Eingabewert verwendet.
- Bei privater Krankenversicherung wird ein vereinfachter manueller Beitragsansatz verwendet.
- Bei Minijob/Midijob wird mindestens ein Hinweis angezeigt, falls keine vollständige Sonderlogik implementiert ist.
- Sozialversicherungswerte gelten für 2026.
- Die Anwendung ist kein Ersatz für eine Lohnabrechnung.

---

## 18. Abnahmekriterien aus Nutzersicht

1. Ich kann mein Bruttogehalt eingeben und sofort ein Nettoergebnis sehen.
2. Ich kann Steuerklasse, Bundesland, Kirchensteuer und Krankenversicherungszusatzbeitrag ändern.
3. Ich sehe klar, wie viel für Steuern und Sozialversicherung abgezogen wird.
4. Ich kann erkennen, welche Annahmen der Rechner verwendet.
5. Ich bekomme Warnhinweise bei Sonderfällen.
6. Die Seite funktioniert auf Smartphone und Desktop.
7. Meine Eingaben werden nicht an einen Server übertragen.
8. Die Berechnung ist anhand dokumentierter Quellen nachvollziehbar.

---

## 19. Rechtlicher Hinweistext für die Webseite

Empfohlener Disclaimer:

> Dieser Brutto-Netto-Rechner liefert eine unverbindliche Orientierung auf Basis der eingegebenen Daten und der dokumentierten Rechengrößen. Er ersetzt keine Lohnabrechnung, keine steuerliche Beratung und keine Auskunft durch Finanzamt, Arbeitgeber, Steuerberater oder Krankenkasse. Individuelle Besonderheiten wie Sonderzahlungen, geldwerte Vorteile, betriebliche Altersvorsorge, Freibeträge, private Krankenversicherung oder mehrere Beschäftigungen können das tatsächliche Netto beeinflussen.

---

## 20. Pflege und Erweiterbarkeit

Damit die Anwendung jährlich aktualisiert werden kann, müssen steuerliche und sozialversicherungsrechtliche Parameter getrennt von der UI gepflegt werden.

Empfohlene Jahresstruktur:

```ts
export const RATES_BY_YEAR = {
  2026: rates2026,
};
```

Für künftige Jahre soll eine neue Datei, z. B. `rates2027.ts`, ergänzt werden können, ohne die UI neu zu schreiben. Das PAP-Modul soll ebenfalls jahresbezogen austauschbar sein, z. B. `pap2026.ts`, `pap2027.ts`.

---

## 21. Priorisierte Umsetzungsschritte für Claude Code

1. Projekt initialisieren und Build/Test-Skripte anlegen.
2. Zentrale Typen, Money-Helfer und 2026-Konfiguration erstellen.
3. Sozialversicherungsmodule implementieren und testen.
4. Kirchensteuerlogik implementieren und testen.
5. PAP-2026-Modul implementieren oder strukturiert portieren.
6. Gesamtrechner implementieren.
7. UI-Formular und Ergebnisdarstellung bauen.
8. Validierung, Warnhinweise und Disclaimer integrieren.
9. README und Quellen ergänzen.
10. Tests und Build ausführen; Fehler beheben.

