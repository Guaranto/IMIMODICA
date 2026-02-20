/* ============================================
   UTILS.JS - Funzioni di utilita'
   ============================================ */

const Utils = {
  /**
   * Converte URL di condivisione Google Drive in URL diretto immagine
   * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
   * Output: https://lh3.googleusercontent.com/d/FILE_ID=w400
   */
  driveImageUrl(shareUrl, width = 400) {
    if (!shareUrl) return 'img/placeholder-portrait.svg';
    const match = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return 'img/placeholder-portrait.svg';
    return `https://lh3.googleusercontent.com/d/${match[1]}=w${width}`;
  },

  /**
   * Converte URL di condivisione Google Drive in URL diretto per PDF
   * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
   * Output: https://drive.google.com/file/d/FILE_ID/preview
   */
  drivePdfUrl(shareUrl) {
    if (!shareUrl) return null;
    const match = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  },

  /**
   * Estrae download URL da Google Drive
   */
  driveDownloadUrl(shareUrl) {
    if (!shareUrl) return null;
    const match = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  },

  /**
   * Formatta data da GG/MM/AAAA a formato leggibile
   */
  formatDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return '';
    const parts = dateStr.trim().split('/');
    if (parts.length !== 3) return dateStr;

    const months = [
      'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
      'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
    ];

    const day = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[2];

    if (monthIndex < 0 || monthIndex > 11) return dateStr;
    return `${day} ${months[monthIndex]} ${year}`;
  },

  /**
   * Restituisce classe CSS per badge esito
   */
  statusBadgeClass(stato) {
    if (!stato) return '';
    const s = stato.toLowerCase().trim();
    if (s === 'sopravvissuto') return 'badge-sopravvissuto';
    if (s === 'deceduto') return 'badge-deceduto';
    if (s === 'disperso') return 'badge-disperso';
    return '';
  },

  /**
   * Restituisce HTML per badge esito
   */
  statusBadge(stato) {
    if (!stato) return '';
    const cls = this.statusBadgeClass(stato);
    return `<span class="badge ${cls}">${this.escapeHtml(stato)}</span>`;
  },

  /**
   * Escape HTML per evitare XSS
   */
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },

  /**
   * Legge parametro query string
   */
  getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  /**
   * Splitta stringa separata da ; e ritorna array pulito
   */
  splitMultiple(str, separator = ';') {
    if (!str) return [];
    return str.split(separator).map(s => s.trim()).filter(s => s.length > 0);
  },

  /**
   * Converte riga array in oggetto con nomi campo
   */
  rowToObject(row) {
    const obj = {};
    const cols = CONFIG.COLUMNS;
    for (const [key, index] of Object.entries(cols)) {
      obj[key] = row[index] || '';
    }
    return obj;
  },

  /**
   * Anima contatore numerico
   */
  animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target.toLocaleString('it-IT');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start).toLocaleString('it-IT');
      }
    }, 16);
  },

  /**
   * Debounce per filtri
   */
  debounce(func, wait = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
};
