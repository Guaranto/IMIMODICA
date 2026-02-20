/* ============================================
   DATATABLES-SETUP.JS - Init DataTables, filtri, click riga
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('imi-table-body');
  const tableEl = document.getElementById('imi-table');
  const loadingEl = document.getElementById('table-loading');
  const errorEl = document.getElementById('table-error');

  if (!tableEl) return;

  try {
    // Carica dati
    const data = await DataService.fetchAll();

    // Popola dropdown filtri con valori unici
    await populateFilterDropdowns(data);

    // Nascondi loading
    if (loadingEl) loadingEl.style.display = 'none';

    // Popola righe tabella
    data.forEach(record => {
      const tr = document.createElement('tr');
      tr.dataset.id = record.id;
      tr.setAttribute('role', 'link');
      tr.setAttribute('tabindex', '0');
      tr.setAttribute('aria-label', `Scheda di ${record.cognome} ${record.nome}`);
      tr.innerHTML = `
        <td>${Utils.escapeHtml(record.id)}</td>
        <td><strong>${Utils.escapeHtml(record.cognome)}</strong></td>
        <td>${Utils.escapeHtml(record.nome)}</td>
        <td>${Utils.escapeHtml(record.data_nascita)}</td>
        <td>${Utils.escapeHtml(record.grado)}</td>
        <td>${Utils.escapeHtml(record.campo_internamento)}</td>
        <td>${Utils.statusBadge(record.stato)}</td>
      `;
      tableBody.appendChild(tr);
    });

    // Init DataTables
    const dt = $(tableEl).DataTable({
      pageLength: CONFIG.PAGE_SIZE,
      deferRender: true,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/2.0.0/i18n/it-IT.json'
      },
      order: [[1, 'asc']],
      columnDefs: [
        { orderable: false, targets: [6] },
        { searchable: true, targets: '_all' }
      ],
      dom: '<"dt-top"li>rt<"dt-bottom"ip>'
    });

    // Click su riga → apri scheda
    $(tableEl).on('click', 'tbody tr', function () {
      const id = this.dataset.id;
      if (id) window.location.href = `scheda.html?id=${id}`;
    });

    // Navigazione keyboard sulle righe
    $(tableEl).on('keydown', 'tbody tr', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = this.dataset.id;
        if (id) window.location.href = `scheda.html?id=${id}`;
      }
    });

    // --- Filtri custom ---
    const filterCognome = document.getElementById('filter-cognome');
    const filterNome = document.getElementById('filter-nome');
    const filterGrado = document.getElementById('filter-grado');
    const filterStato = document.getElementById('filter-stato');
    const filterCampo = document.getElementById('filter-campo');
    const filterLuogo = document.getElementById('filter-luogo');
    const filterCount = document.getElementById('filter-count');
    const btnReset = document.getElementById('btn-reset-filters');

    function applyFilters() {
      // Colonna-specifica
      if (filterCognome) dt.column(1).search(filterCognome.value);
      if (filterNome) dt.column(2).search(filterNome.value);
      if (filterGrado) dt.column(4).search(filterGrado.value ? `^${$.fn.dataTable.util.escapeRegex(filterGrado.value)}$` : '', true, false);
      if (filterStato) dt.column(6).search(filterStato.value ? $.fn.dataTable.util.escapeRegex(filterStato.value) : '', true, false);
      if (filterCampo) dt.column(5).search(filterCampo.value ? $.fn.dataTable.util.escapeRegex(filterCampo.value) : '', true, false);
      if (filterLuogo) dt.column(3).search(filterLuogo.value);

      dt.draw();

      // Aggiorna contatore risultati
      if (filterCount) {
        const total = dt.rows({ search: 'applied' }).count();
        filterCount.textContent = `${total} risultat${total === 1 ? 'o' : 'i'}`;
      }
    }

    // Event listener sui filtri con debounce per testo
    const debouncedApply = Utils.debounce(applyFilters, 300);

    [filterCognome, filterNome, filterLuogo].forEach(el => {
      if (el) el.addEventListener('input', debouncedApply);
    });

    [filterGrado, filterStato, filterCampo].forEach(el => {
      if (el) el.addEventListener('change', applyFilters);
    });

    // Reset filtri
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        [filterCognome, filterNome, filterLuogo].forEach(el => { if (el) el.value = ''; });
        [filterGrado, filterStato, filterCampo].forEach(el => { if (el) el.value = ''; });
        dt.search('').columns().search('').draw();
        if (filterCount) filterCount.textContent = `${dt.rows({ search: 'applied' }).count()} risultati`;
      });
    }

    // Conteggio iniziale
    if (filterCount) {
      filterCount.textContent = `${data.length} risultati`;
    }

    // --- Toggle filtri su mobile ---
    const filtersHeader = document.querySelector('.filters-header');
    const filtersBody = document.querySelector('.filters-body');
    const filtersToggle = document.querySelector('.filters-toggle');

    if (filtersHeader && filtersBody) {
      filtersHeader.addEventListener('click', () => {
        filtersBody.classList.toggle('collapsed');
        if (filtersToggle) filtersToggle.classList.toggle('collapsed');
      });

      // Collassa di default su mobile
      if (window.innerWidth < 768) {
        filtersBody.classList.add('collapsed');
        if (filtersToggle) filtersToggle.classList.add('collapsed');
      }
    }

  } catch (error) {
    console.error('Errore inizializzazione tabella:', error);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) {
      errorEl.style.display = 'block';
      errorEl.textContent = 'Errore nel caricamento dei dati. Riprova più tardi.';
    }
  }
});

/**
 * Popola dropdown filtri con valori unici dai dati
 */
async function populateFilterDropdowns(data) {
  const dropdowns = {
    'filter-grado': 'grado',
    'filter-stato': 'stato',
    'filter-campo': 'campo_internamento'
  };

  for (const [elId, field] of Object.entries(dropdowns)) {
    const select = document.getElementById(elId);
    if (!select) continue;

    const values = new Set();
    data.forEach(r => {
      if (r[field] && r[field].trim()) values.add(r[field].trim());
    });

    Array.from(values).sort().forEach(val => {
      const option = document.createElement('option');
      option.value = val;
      option.textContent = val;
      select.appendChild(option);
    });
  }
}
