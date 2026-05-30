import { initForm } from './ui/form.js';
import { initLegalModal } from './legal/legalModal.js';
import { initKassenTable } from './ui/kassenTable.js';
import { initTaxInfo } from './ui/taxInfo.js';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  initForm();
  initTaxInfo();
  initKassenTable();
  initLegalModal();
});
