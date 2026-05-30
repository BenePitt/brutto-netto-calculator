import { KASSEN, STAND, DURCHSCHNITT_ZB, type Kassenart, type Kasse } from '../data/kassenData.js';

type SortField = 'name' | 'art' | 'zusatzbeitrag';
type SortDir   = 'asc' | 'desc';

interface State {
  search:    string;
  art:       string;
  sortField: SortField;
  sortDir:   SortDir;
  expanded:  boolean;
}

const ART_LABELS: Record<Kassenart, string> = {
  AOK: 'AOK', BKK: 'BKK', IKK: 'IKK',
  EK: 'Ersatzkasse', KBS: 'Knappschaft', Sonstige: 'Sonstige',
};

function zbColorClass(zb: number): string {
  if (zb === 0)              return 'zb-special';
  if (zb <= 2.69)            return 'zb-low';
  if (zb <= DURCHSCHNITT_ZB) return 'zb-avg';
  if (zb <= 3.49)            return 'zb-above';
  return 'zb-high';
}

function filterKassen(kassen: Kasse[], state: State): Kasse[] {
  const q = state.search.toLowerCase();
  return kassen.filter(k =>
    k.name.toLowerCase().includes(q) && (!state.art || k.art === state.art)
  );
}

function sortKassen(kassen: Kasse[], state: State): Kasse[] {
  return [...kassen].sort((a, b) => {
    let cmp = 0;
    if (state.sortField === 'name')     cmp = a.name.localeCompare(b.name, 'de');
    else if (state.sortField === 'art') cmp = a.art.localeCompare(b.art, 'de');
    else                                cmp = a.zusatzbeitrag - b.zusatzbeitrag;
    return state.sortDir === 'asc' ? cmp : -cmp;
  });
}

function applyRate(zb: number): void {
  const kvTypeEl = document.getElementById('field-kv-type') as HTMLSelectElement | null;
  const kvzEl    = document.getElementById('field-kvz')    as HTMLInputElement   | null;
  if (!kvzEl) return;

  if (kvTypeEl && kvTypeEl.value !== 'statutory') {
    kvTypeEl.value = 'statutory';
    kvTypeEl.dispatchEvent(new Event('input', { bubbles: true }));
  }
  kvzEl.value = String(zb);
  kvzEl.dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
}

export function initKassenTable(): void {
  const container = document.getElementById('kassen-table-container');
  if (!container) return;

  const state: State = {
    search: '', art: '', sortField: 'zusatzbeitrag', sortDir: 'asc', expanded: false,
  };

  container.innerHTML = `
    <div class="kassen-controls">
      <input type="search" id="kassen-search" class="field-input kassen-search"
             placeholder="Krankenkasse suchen …" aria-label="Krankenkasse suchen"/>
      <select id="kassen-art-filter" class="field-input kassen-art-select"
              aria-label="Nach Kassenart filtern">
        <option value="">Alle Kassenarten</option>
        <option value="AOK">AOK</option>
        <option value="BKK">BKK</option>
        <option value="IKK">IKK</option>
        <option value="EK">Ersatzkassen</option>
        <option value="KBS">Knappschaft</option>
      </select>
      <span id="kassen-count" class="kassen-count"></span>
    </div>

    <div class="kassen-scroll-wrap kassen-scroll-wrap--collapsed" id="kassen-scroll-wrap">
      <table class="breakdown-table kassen-table" aria-label="GKV-Zusatzbeiträge 2026">
        <thead>
          <tr>
            <th scope="col" class="kassen-th sortable" data-sort="name">
              Krankenkasse <span class="sort-icon" id="sort-name">↕</span>
            </th>
            <th scope="col" class="kassen-th sortable" data-sort="art">
              Art <span class="sort-icon" id="sort-art">↕</span>
            </th>
            <th scope="col" class="col-num kassen-th sortable" data-sort="zusatzbeitrag">
              Zusatzbeitrag <span class="sort-icon sort-icon--active" id="sort-zb">↑</span>
            </th>
            <th scope="col" class="col-num kassen-th"></th>
          </tr>
        </thead>
        <tbody id="kassen-tbody"></tbody>
      </table>
    </div>

    <button id="kassen-expand-btn" class="kassen-expand-btn" aria-expanded="false">
      ▼ Alle ${KASSEN.length} Kassen anzeigen
    </button>

    <p class="kassen-note">
      ∅ 2026: <strong>2,9 %</strong> (BMG-Festsetzung) ·
      Gesamtbeitrag: <strong>14,6 % + Zusatzbeitrag</strong> (AN + AG je hälftig) ·
      Stand: ${STAND} · Quelle:
      <a href="https://www.gkv-spitzenverband.de/service/krankenkassenliste/krankenkassen.jsp"
         target="_blank" rel="noopener noreferrer">GKV-Spitzenverband</a>
      · Keine öffentliche API verfügbar (§ 242 Abs. 5 SGB V – nur HTML/PDF).
      PKV-Tarife sind individuell kalkuliert.
    </p>
  `;

  const searchEl    = container.querySelector<HTMLInputElement>('#kassen-search')!;
  const artFilterEl = container.querySelector<HTMLSelectElement>('#kassen-art-filter')!;
  const countEl     = container.querySelector<HTMLElement>('#kassen-count')!;
  const tbody       = container.querySelector<HTMLElement>('#kassen-tbody')!;
  const scrollWrap  = container.querySelector<HTMLElement>('#kassen-scroll-wrap')!;
  const expandBtn   = container.querySelector<HTMLButtonElement>('#kassen-expand-btn')!;

  const sortIcons: Record<SortField, string> = {
    name: 'sort-name', art: 'sort-art', zusatzbeitrag: 'sort-zb',
  };

  function updateSortIcons(): void {
    (Object.keys(sortIcons) as SortField[]).forEach(field => {
      const el = container!.querySelector<HTMLElement>(`#${sortIcons[field]}`);
      if (!el) return;
      if (state.sortField !== field) {
        el.textContent = '↕'; el.className = 'sort-icon';
      } else {
        el.textContent = state.sortDir === 'asc' ? '↑' : '↓';
        el.className = 'sort-icon sort-icon--active';
      }
    });
  }

  function updateExpandBtn(filtered: number): void {
    const hidden = Math.max(0, filtered - 5);
    if (state.expanded) {
      expandBtn.textContent = '▲ Weniger anzeigen';
      expandBtn.setAttribute('aria-expanded', 'true');
    } else {
      expandBtn.textContent = hidden > 0
        ? `▼ ${hidden} weitere Kassen anzeigen`
        : '▼ Alle anzeigen';
      expandBtn.setAttribute('aria-expanded', 'false');
    }
    // Hide button if 5 or fewer results
    expandBtn.hidden = filtered <= 5;
  }

  function renderRows(): void {
    const data = sortKassen(filterKassen(KASSEN, state), state);
    countEl.textContent = `${data.length} von ${KASSEN.length} Kassen`;

    tbody.innerHTML = data.map(k => {
      const zbDisplay = k.zusatzbeitrag === 0
        ? '<span class="zb-special">n/a *</span>'
        : `<span class="${zbColorClass(k.zusatzbeitrag)}">${k.zusatzbeitrag.toFixed(2).replace('.', ',')} %</span>`;

      const useBtn = k.zusatzbeitrag > 0
        ? `<button class="btn-use-rate" data-zb="${k.zusatzbeitrag}"
               title="Diesen GKV-Zusatzbeitrag in den Rechner übernehmen"
               aria-label="${k.name}: ${k.zusatzbeitrag.toFixed(2).replace('.', ',')} % übernehmen">
             ↑ Rechner
           </button>`
        : '';

      return `<tr>
        <td>${k.name}</td>
        <td><span class="kassen-art-badge kassen-art-badge--${k.art.toLowerCase()}">${ART_LABELS[k.art]}</span></td>
        <td class="col-num">${zbDisplay}</td>
        <td class="col-num">${useBtn}</td>
      </tr>`;
    }).join('');

    tbody.querySelectorAll<HTMLButtonElement>('.btn-use-rate').forEach(btn => {
      btn.addEventListener('click', () => applyRate(parseFloat(btn.dataset.zb!)));
    });

    updateSortIcons();
    updateExpandBtn(data.length);
  }

  // Expand / collapse
  expandBtn.addEventListener('click', () => {
    state.expanded = !state.expanded;
    scrollWrap.classList.toggle('kassen-scroll-wrap--collapsed', !state.expanded);
    const data = sortKassen(filterKassen(KASSEN, state), state);
    updateExpandBtn(data.length);
  });

  searchEl.addEventListener('input', () => { state.search = searchEl.value; renderRows(); });
  artFilterEl.addEventListener('change', () => { state.art = artFilterEl.value; renderRows(); });

  container.querySelectorAll<HTMLElement>('.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort as SortField;
      if (state.sortField === field) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = field;
        state.sortDir = 'asc';
      }
      renderRows();
    });
  });

  renderRows();
}
