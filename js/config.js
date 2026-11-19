/* ============================================
   CONFIG.JS - Configurazione globale
   ============================================ */

const CONFIG = {
  // Google Sheets
  SPREADSHEET_ID: '1HtJAejUHxWE0GKJOBghq2lK_70xKvEP08COpbW9Jf3o',
  API_KEY: 'AIzaSyChG3XKp-vtznBYRwf4lLVj-9seR6EaopY',
  SHEET_NAME: 'IMI_Modica',
  RANGE: 'A1:AZ2000',

  // URL base API
  get SHEETS_API_URL() {
    return `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${this.SHEET_NAME}!${this.RANGE}?key=${this.API_KEY}`;
  },

  // Cache
  CACHE_KEY: 'imi_modica_data_v2',
  CACHE_TIMESTAMP_KEY: 'imi_modica_timestamp_v2',
  CACHE_TTL: 30 * 60 * 1000, // 30 minuti in millisecondi

  // Mappatura colonne (indice 0-based).
  // I dati vengono letti per NOME di intestazione (riga 1 del foglio):
  // questa mappa serve solo come riserva se un'intestazione manca.
  COLUMNS: {
    id: 0,
    cognome: 1,
    nome: 2,
    data_nascita: 3,
    luogo_nascita: 4,
    provincia: 5,
    regione: 6,
    paternita: 7,
    maternita: 8,
    grado: 9,
    reparto: 10,
    distretto_militare: 11,
    matricola: 12,
    matricola_lager: 13,
    luogo_cattura: 14,
    data_cattura: 15,
    campo_internamento: 16,
    data_liberazione: 17,
    forze_alleate: 18,
    centro_alloggio: 19,
    data_rimpatrio: 20,
    stato: 21,
    data_morte: 22,
    causa_morte: 23,
    luogo_sepoltura: 24,
    decorazioni: 25,
    memoria: 26,
    note: 27,
    foto_url: 28,
    documenti_pdf_url: 29,
    fonti_archivistiche: 30,
    riferimenti_familiari: 31,
    pubblicato: 32
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
