/* ============================================
   DATA-SERVICE.JS - Fetch Google Sheets + Cache
   ============================================ */

const DataService = {
  _data: null,

  /**
   * Recupera dati dal Google Sheets (con cache sessionStorage)
   * Ritorna array di oggetti (ogni riga = un IMI)
   */
  async fetchAll() {
    // Se gia' in memoria, ritorna subito
    if (this._data) return this._data;

    // Controlla cache sessionStorage
    const cached = this._getCache();
    if (cached) {
      this._data = cached;
      return cached;
    }

    // Fetch da API
    try {
      const response = await fetch(CONFIG.SHEETS_API_URL);
      if (!response.ok) {
        throw new Error(`Errore API: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const rows = json.values;

      if (!rows || rows.length < 2) {
        console.warn('Nessun dato trovato nel foglio.');
        return [];
      }

      // Prima riga = intestazioni: servono per leggere le colonne per nome
      const headers = rows[0];
      const dataRows = rows.slice(1);

      // Converti in oggetti e filtra solo pubblicati
      const allRecords = dataRows.map(row => Utils.rowToObject(row, headers));
      const published = allRecords.filter(
        r => r.pubblicato && r.pubblicato.toUpperCase() === 'TRUE'
      );

      // Salva in cache
      this._setCache(published);
      this._data = published;
      return published;

    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
      // Tenta di usare cache scaduta come fallback
      const staleCache = this._getCache(true);
      if (staleCache) {
        console.warn('Uso cache scaduta come fallback.');
        this._data = staleCache;
        return staleCache;
      }
      throw error;
    }
  },

  /**
   * Recupera un singolo record per ID
   */
  async getById(id) {
    const data = await this.fetchAll();
    return data.find(r => r.id === String(id)) || null;
  },

  /**
   * Calcola statistiche aggregate
   */
  async getStats() {
    const data = await this.fetchAll();
    const stats = {
      totale: data.length,
      sopravvissuti: 0,
      deceduti: 0,
      dispersi: 0,
      campi: new Set()
    };

    data.forEach(r => {
      const esito = Utils.normalizeStato(r.stato);
      if (esito === 'reduce') stats.sopravvissuti++;
      else if (esito === 'caduto') stats.deceduti++;
      else if (esito === 'disperso') stats.dispersi++;

      // Conta i campi distinti, ignorando "-" e indicazioni generiche
      const campo = (r.campo_internamento || '').trim();
      if (campo && campo !== '-' && !/^lager (tedesco|nazista)$/i.test(campo)) {
        stats.campi.add(campo.toLowerCase().replace(/\s+/g, ' '));
      }
    });

    stats.numCampi = stats.campi.size;
    return stats;
  },

  /**
   * Restituisce valori unici per un campo (per dropdown filtri)
   */
  async getUniqueValues(field) {
    const data = await this.fetchAll();
    const values = new Set();
    data.forEach(r => {
      if (r[field] && r[field].trim()) {
        values.add(r[field].trim());
      }
    });
    return Array.from(values).sort();
  },

  /**
   * Ottieni record precedente e successivo per navigazione scheda
   */
  async getAdjacentIds(currentId) {
    const data = await this.fetchAll();
    const index = data.findIndex(r => r.id === String(currentId));
    return {
      prev: index > 0 ? data[index - 1].id : null,
      next: index < data.length - 1 ? data[index + 1].id : null
    };
  },

  // --- Cache helpers ---

  _getCache(ignoreExpiry = false) {
    try {
      const timestamp = sessionStorage.getItem(CONFIG.CACHE_TIMESTAMP_KEY);
      const data = sessionStorage.getItem(CONFIG.CACHE_KEY);

      if (!timestamp || !data) return null;

      const age = Date.now() - parseInt(timestamp, 10);
      if (!ignoreExpiry && age > CONFIG.CACHE_TTL) {
        this._clearCache();
        return null;
      }

      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  },

  _setCache(data) {
    try {
      sessionStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(data));
      sessionStorage.setItem(CONFIG.CACHE_TIMESTAMP_KEY, String(Date.now()));
    } catch (e) {
      console.warn('Cache sessionStorage non disponibile:', e);
    }
  },

  _clearCache() {
    try {
      sessionStorage.removeItem(CONFIG.CACHE_KEY);
      sessionStorage.removeItem(CONFIG.CACHE_TIMESTAMP_KEY);
    } catch (e) {
      // Ignora
    }
  }
};
