/* ============================================
   CONFIG.JS - Configurazione globale
   ============================================ */

const CONFIG = {
  // Google Sheets
  SPREADSHEET_ID: '1HtJAejUHxWE0GKJOBghq2lK_70xKvEP08COpbW9Jf3o',
  API_KEY: 'AIzaSyChG3XKp-vtznBYRwf4lLVj-9seR6EaopY',
  SHEET_NAME: 'IMI_Modica',
  RANGE: 'A1:Z1000',

  // URL base API
  get SHEETS_API_URL() {
    return `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${this.SHEET_NAME}!${this.RANGE}?key=${this.API_KEY}`;
  },

  // Cache
  CACHE_KEY: 'imi_modica_data',
  CACHE_TIMESTAMP_KEY: 'imi_modica_timestamp',
  CACHE_TTL: 30 * 60 * 1000, // 30 minuti in millisecondi

  // Mappatura colonne (indice 0-based)
  COLUMNS: {
    id: 0,
    cognome: 1,
    nome: 2,
    data_nascita: 3,
    luogo_nascita: 4,
    paternita: 5,
    maternita: 6,
    grado: 7,
    reparto: 8,
    distretto_militare: 9,
    matricola: 10,
    campo_internamento: 11,
    data_cattura: 12,
    luogo_cattura: 13,
    data_liberazione: 14,
    stato: 15,
    data_morte: 16,
    causa_morte: 17,
    luogo_sepoltura: 18,
    decorazioni: 19,
    note: 20,
    foto_url: 21,
    documenti_pdf_url: 22,
    fonti_archivistiche: 23,
    riferimenti_familiari: 24,
    pubblicato: 25
  },

  // Formspree
  FORMSPREE_ENDPOINT: 'https://formspree.io/f/xojnnyvn',

  // Paginazione
  PAGE_SIZE: 25,

  // Sito
  SITE_NAME: 'IMI Modica',
  SITE_TITLE: 'Internati Militari Italiani di Modica',
  SITE_DESCRIPTION: 'Memoria digitale degli Internati Militari Italiani del Comune di Modica durante la Seconda Guerra Mondiale (1943-1945).',
  SITE_URL: 'https://imimodica.netlify.app'
};
