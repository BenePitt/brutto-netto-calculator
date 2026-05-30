import { legalData } from './legalData.js';

function buildImpressum(): string {
  const { name, street, zip, city, email, phone, website } = legalData;
  return `
    <h2 class="modal__section-title">Angaben gemäß § 5 TMG</h2>
    <p>${name}<br>${street}<br>${zip} ${city}</p>

    <h2 class="modal__section-title">Kontakt</h2>
    <p>
      ${phone ? `Telefon: ${phone}<br>` : ''}
      E-Mail: <a class="modal__link" href="mailto:${email}">${email}</a>
      ${website ? `<br>Website: <a class="modal__link" href="${website}" target="_blank" rel="noopener noreferrer">${website}</a>` : ''}
    </p>

    <h2 class="modal__section-title">Haftungsausschluss</h2>
    <p>Diese Webseite ist ein privates Freizeitprojekt ohne kommerziellen Hintergrund. Es besteht kein Anspruch auf Vollständigkeit oder Aktualität.</p>

    <h2 class="modal__section-title">Urheberrecht</h2>
    <p>Die durch den Seitenbetreiber erstellten Inhalte auf diesen Seiten unterliegen dem deutschen Urheberrecht. Es besteht keine Verbindung zu den Markeninhabern der verwendeten steuerlichen oder rechtlichen Bezeichnungen.</p>
  `;
}

function buildDatenschutz(): string {
  const { name, street, zip, city, email } = legalData;
  return `
    <h2 class="modal__section-title">1. Verantwortlicher</h2>
    <p>
      ${name}<br>${street}<br>${zip} ${city}<br>
      E-Mail: <a class="modal__link" href="mailto:${email}">${email}</a>
    </p>

    <h2 class="modal__section-title">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
    <p>Diese Webseite erhebt und speichert keine personenbezogenen Daten. Es werden keine Cookies gesetzt, kein Tracking durchgeführt und keine Nutzerdaten an Dritte weitergegeben. Alle Berechnungen erfolgen ausschließlich lokal in Ihrem Browser.</p>

    <h2 class="modal__section-title">3. Hosting (GitHub Pages)</h2>
    <p>Diese Webseite wird über GitHub Pages (GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA; ein Unternehmen von Microsoft) gehostet. Beim Zugriff kann Ihre IP-Adresse sowie technische Metadaten durch GitHub und das Fastly-CDN verarbeitet werden. GitHub ist unter dem EU-US Data Privacy Framework zertifiziert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen: <a class="modal__link" href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Datenschutzerklärung</a>.</p>

    <h2 class="modal__section-title">4. Ihre Rechte</h2>
    <p>Sie haben nach der DSGVO das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Widerspruch (Art. 21). Da diese Webseite keine personenbezogenen Daten erhebt oder speichert, ist eine entsprechende Anfrage voraussichtlich gegenstandslos.</p>
    <p style="margin-top:8px">Bei datenschutzrechtlichen Beschwerden können Sie sich an den <a class="modal__link" href="https://www.datenschutz-bayern.de/" target="_blank" rel="noopener noreferrer">Bayerischen Landesbeauftragten für den Datenschutz</a> wenden.</p>
  `;
}

export function initLegalModal(): void {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-title');
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h1 class="modal-title" id="modal-title"></h1>
        <button class="modal-close" aria-label="Schließen">&times;</button>
      </div>
      <div class="modal-body"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector<HTMLButtonElement>('.modal-close')!;
  const titleEl = overlay.querySelector<HTMLElement>('#modal-title')!;
  const bodyEl = overlay.querySelector<HTMLElement>('.modal-body')!;

  function open(view: 'impressum' | 'datenschutz'): void {
    if (view === 'impressum') {
      titleEl.textContent = 'Impressum';
      bodyEl.innerHTML = buildImpressum();
    } else {
      titleEl.textContent = 'Datenschutzerklärung';
      bodyEl.innerHTML = buildDatenschutz();
    }
    overlay.hidden = false;
    closeBtn.focus();
  }

  function close(): void {
    overlay.hidden = true;
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });

  document.getElementById('btn-impressum')?.addEventListener('click', () => open('impressum'));
  document.getElementById('btn-datenschutz')?.addEventListener('click', () => open('datenschutz'));
}
