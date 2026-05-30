// § 32a EStG 2026 – reine Tarifsteuer (ohne Vorsorgepauschale/ANP)
// Dient ausschließlich der didaktischen Kurvendarstellung.

const GFB = 12_348;

function incomeTax(x: number): number {
  if (x <= GFB) return 0;
  if (x <= 17_799) {
    const y = (x - GFB) / 10_000;
    return (914.51 * y + 1_400) * y;
  }
  if (x <= 69_878) {
    const y = (x - 17_800) / 10_000;
    return (173.1 * y + 2_397) * y + 1_034.87;
  }
  if (x <= 277_825) return x * 0.42 - 11_135.63;
  return x * 0.45 - 19_470.38;
}

function marginalRate(x: number): number {
  if (x <= GFB) return 0;
  if (x <= 17_799) {
    const y = (x - GFB) / 10_000;
    return (2 * 914.51 * y + 1_400) / 10_000;
  }
  if (x <= 69_878) {
    const y = (x - 17_800) / 10_000;
    return (2 * 173.1 * y + 2_397) / 10_000;
  }
  if (x <= 277_825) return 0.42;
  return 0.45;
}

// ── SVG chart layout ─────────────────────────────────────────────────────────
const CX = 60, CY = 20, CW = 600, CH = 182;
const XMAX = 120_000, YMAX = 0.50;
const sx = (v: number) => CX + (v / XMAX) * CW;
const sy = (v: number) => CY + CH * (1 - v / YMAX);

// Pre-compute 241 data points (step = 500 €)
interface Pt { income: number; eff: number; marg: number; }
const DATA: Pt[] = Array.from({ length: 241 }, (_, i) => {
  const income = i * 500;
  const st = incomeTax(income);
  return { income, eff: income > 0 ? st / income : 0, marg: marginalRate(income) };
});

const effPts  = DATA.map(d => `${sx(d.income).toFixed(1)},${sy(d.eff).toFixed(1)}`).join(' ');
const margPts = DATA.map(d => `${sx(d.income).toFixed(1)},${sy(d.marg).toFixed(1)}`).join(' ');

const deDE = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

// ── SVG generation ────────────────────────────────────────────────────────────
function buildChartSVG(): string {
  const bot   = CY + CH;  // 202
  const right = CX + CW;  // 660
  const y42   = sy(0.42);
  const gfbX  = sx(GFB);
  const spitzX = sx(69_878);

  const hLines = [0.10, 0.20, 0.30, 0.40, 0.50].map(r =>
    `<line x1="${CX}" y1="${sy(r).toFixed(1)}" x2="${right}" y2="${sy(r).toFixed(1)}" class="chart-grid"/>`
  ).join('');

  const vLines = [20000, 40000, 60000, 80000, 100000].map(v =>
    `<line x1="${sx(v)}" y1="${CY}" x2="${sx(v)}" y2="${bot}" class="chart-grid"/>`
  ).join('');

  const yLabels = [0, 0.10, 0.20, 0.30, 0.40, 0.50].map(r =>
    `<text x="${CX - 6}" y="${sy(r).toFixed(1)}" class="chart-label" text-anchor="end" dominant-baseline="middle">${(r * 100).toFixed(0)} %</text>`
  ).join('');

  const xLabels = [0, 20000, 40000, 60000, 80000, 100000, 120000].map(v =>
    `<text x="${sx(v).toFixed(1)}" y="${bot + 14}" class="chart-label" text-anchor="middle">${v === 0 ? '0' : v / 1000 + ' k'}</text>`
  ).join('');

  return `<svg class="tax-chart" viewBox="0 0 680 242" role="img"
        aria-label="Lohnsteuerkurve 2026 – Grenz- und Effektivsteuersatz">
  <title>Lohnsteuerkurve 2026</title>

  <!-- Background -->
  <rect x="${CX}" y="${CY}" width="${CW}" height="${CH}" fill="#f8fafc" rx="2"/>

  <!-- Grid -->
  ${hLines}${vLines}

  <!-- Axes -->
  <line x1="${CX}" y1="${CY}" x2="${CX}" y2="${bot}" class="chart-axis"/>
  <line x1="${CX}" y1="${bot}" x2="${right}" y2="${bot}" class="chart-axis"/>

  <!-- 42 % reference -->
  <line x1="${CX}" y1="${y42.toFixed(1)}" x2="${right}" y2="${y42.toFixed(1)}"
        stroke="#e67e22" stroke-width="0.8" stroke-dasharray="5 3" opacity="0.6"/>

  <!-- GFB marker -->
  <line x1="${gfbX.toFixed(1)}" y1="${CY}" x2="${gfbX.toFixed(1)}" y2="${bot}"
        stroke="#999" stroke-width="1" stroke-dasharray="4 3"/>
  <text x="${gfbX.toFixed(1)}" y="${CY - 5}" class="chart-marker-label" text-anchor="middle">GFB 12.348 €</text>

  <!-- Spitzensteuersatz marker -->
  <line x1="${spitzX.toFixed(1)}" y1="${CY}" x2="${spitzX.toFixed(1)}" y2="${bot}"
        stroke="#e67e22" stroke-width="1" stroke-dasharray="4 3" opacity="0.7"/>
  <text x="${(spitzX + 4).toFixed(1)}" y="${(y42 - 5).toFixed(1)}"
        class="chart-marker-label" fill="#e67e22" text-anchor="start">42 % ab 69.879 €</text>

  <!-- Area fill under effective rate -->
  <polygon points="${CX},${bot} ${effPts} ${right},${bot}"
           fill="#1a56a0" fill-opacity="0.07"/>

  <!-- Data lines -->
  <polyline points="${margPts}" fill="none" stroke="#c0392b" stroke-width="2" stroke-linejoin="round"/>
  <polyline points="${effPts}"  fill="none" stroke="#1a56a0" stroke-width="2" stroke-linejoin="round"/>

  <!-- Y labels -->
  ${yLabels}

  <!-- X labels -->
  ${xLabels}

  <!-- X-axis title -->
  <text x="${CX + CW / 2}" y="236" class="chart-label" text-anchor="middle" fill="#999"
        font-size="10">Zu versteuerndes Jahreseinkommen</text>

  <!-- Legend -->
  <rect x="${right - 168}" y="24" width="158" height="44" rx="4"
        fill="white" stroke="#ddd" stroke-width="1"/>
  <line x1="${right - 162}" y1="38" x2="${right - 136}" y2="38"
        stroke="#c0392b" stroke-width="2"/>
  <text x="${right - 130}" y="42" class="chart-label" font-size="10" fill="#333">Grenzsteuersatz</text>
  <line x1="${right - 162}" y1="54" x2="${right - 136}" y2="54"
        stroke="#1a56a0" stroke-width="2"/>
  <text x="${right - 130}" y="58" class="chart-label" font-size="10" fill="#333">Effektivsteuersatz</text>

  <!-- Hover overlay (transparent – catches mouse) -->
  <rect id="chart-overlay" x="${CX}" y="${CY}" width="${CW}" height="${CH}"
        fill="transparent" style="cursor:crosshair"/>

  <!-- Hover elements -->
  <g id="chart-hover" visibility="hidden">
    <line id="chart-hover-line" x1="0" y1="${CY}" x2="0" y2="${bot}"
          stroke="#555" stroke-width="1" stroke-dasharray="3 2"/>
    <circle id="chart-hover-dot-marg" r="4" fill="#c0392b" stroke="white" stroke-width="1.5"/>
    <circle id="chart-hover-dot-eff"  r="4" fill="#1a56a0" stroke="white" stroke-width="1.5"/>
    <rect id="chart-hover-bg" width="152" height="64" rx="4"
          fill="white" stroke="#ccc" stroke-width="1"/>
    <text id="chart-hover-income" font-size="10" font-weight="bold" fill="#333"/>
    <text id="chart-hover-marg"   font-size="10" fill="#c0392b"/>
    <text id="chart-hover-eff"    font-size="10" fill="#1a56a0"/>
  </g>
</svg>`;
}

// ── Hover interaction ─────────────────────────────────────────────────────────
function initChartHover(): void {
  const svg = document.querySelector<SVGSVGElement>('.tax-chart');
  if (!svg) return;

  const overlay  = svg.querySelector<SVGRectElement>('#chart-overlay');
  const hoverG   = svg.querySelector<SVGGElement>('#chart-hover');
  if (!overlay || !hoverG) return;

  const hLine   = hoverG.querySelector<SVGLineElement>('#chart-hover-line')!;
  const dotMarg = hoverG.querySelector<SVGCircleElement>('#chart-hover-dot-marg')!;
  const dotEff  = hoverG.querySelector<SVGCircleElement>('#chart-hover-dot-eff')!;
  const hovBg   = hoverG.querySelector<SVGRectElement>('#chart-hover-bg')!;
  const tIncome = hoverG.querySelector<SVGTextElement>('#chart-hover-income')!;
  const tMarg   = hoverG.querySelector<SVGTextElement>('#chart-hover-marg')!;
  const tEff    = hoverG.querySelector<SVGTextElement>('#chart-hover-eff')!;

  overlay.addEventListener('mousemove', (e: MouseEvent) => {
    const rect   = svg.getBoundingClientRect();
    const scaleX = 680 / rect.width;
    const svgX   = (e.clientX - rect.left) * scaleX;

    const income = Math.max(0, Math.min(XMAX, ((svgX - CX) / CW) * XMAX));
    const st  = incomeTax(income);
    const eff = income > 0 ? st / income : 0;
    const mg  = marginalRate(income);

    const lx    = sx(income);
    const margY = sy(mg);
    const effY  = sy(eff);

    const tipX = lx > CX + CW - 168 ? lx - 160 : lx + 8;
    const tipY = CY + 8;
    const pct  = (v: number) => (v * 100).toFixed(1) + ' %';

    hLine.setAttribute('x1', String(lx));    hLine.setAttribute('x2', String(lx));
    dotMarg.setAttribute('cx', String(lx));  dotMarg.setAttribute('cy', String(margY));
    dotEff.setAttribute('cx', String(lx));   dotEff.setAttribute('cy', String(effY));
    hovBg.setAttribute('x', String(tipX));   hovBg.setAttribute('y', String(tipY));

    tIncome.setAttribute('x', String(tipX + 8)); tIncome.setAttribute('y', String(tipY + 18));
    tIncome.textContent = deDE.format(Math.round(income)) + ' €/Jahr';

    tMarg.setAttribute('x', String(tipX + 8)); tMarg.setAttribute('y', String(tipY + 36));
    tMarg.textContent = 'Grenzsteuer: ' + pct(mg);

    tEff.setAttribute('x', String(tipX + 8)); tEff.setAttribute('y', String(tipY + 52));
    tEff.textContent = 'Effektiv: ' + pct(eff);

    hoverG.setAttribute('visibility', 'visible');
  });

  overlay.addEventListener('mouseleave', () => {
    hoverG.setAttribute('visibility', 'hidden');
  });
}

// ── Public init ───────────────────────────────────────────────────────────────
export function initTaxInfo(): void {
  const container = document.getElementById('tax-info-container');
  if (!container) return;

  container.innerHTML = `
    <div class="tax-stat-grid">
      <div class="tax-stat">
        <div class="tax-stat__label">Grundfreibetrag 2026</div>
        <div class="tax-stat__value">12.348 €</div>
        <div class="tax-stat__sub">jährlich (Stkl. I / II / IV)<br>24.696 € (Stkl. III)</div>
      </div>
      <div class="tax-stat">
        <div class="tax-stat__label">Eingangssteuersatz</div>
        <div class="tax-stat__value">14 %</div>
        <div class="tax-stat__sub">ab 12.349 €/Jahr</div>
      </div>
      <div class="tax-stat">
        <div class="tax-stat__label">Spitzensteuersatz</div>
        <div class="tax-stat__value">42 %</div>
        <div class="tax-stat__sub">ab 69.879 €/Jahr</div>
      </div>
      <div class="tax-stat">
        <div class="tax-stat__label">Reichensteuersatz</div>
        <div class="tax-stat__value">45 %</div>
        <div class="tax-stat__sub">ab 277.826 €/Jahr</div>
      </div>
    </div>

    <div class="tax-chart-wrap">
      ${buildChartSVG()}
    </div>

    <p class="tax-chart-note">
      Zeigt den reinen § 32a EStG-Tariftarif 2026.
      Im Rechner sind ANP und Vorsorgepauschale abgezogen, daher ist die tatsächliche
      Lohnsteuer auf das Bruttoeinkommen niedriger als der Effektivsteuersatz hier nahelegt.
      Soli-Freigrenze: 20.350 € Jahressteuer (Stkl. I/II/IV).
    </p>
  `;

  initChartHover();
}
