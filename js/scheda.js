/* ============================================
   SCHEDA.JS - Pagina dettaglio individuale
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const schedaContainer = document.getElementById('scheda-content');
  const loadingEl = document.getElementById('scheda-loading');
  const errorEl = document.getElementById('scheda-error');

  if (!schedaContainer) return;

  const id = Utils.getQueryParam('id');

  if (!id) {
    showError('Nessun ID specificato. Torna alla <a href="ricerca.html">pagina di ricerca</a>.');
    return;
  }

  try {
    const record = await DataService.getById(id);

    if (!record) {
      showError(`Nessun record trovato con ID ${Utils.escapeHtml(id)}. Torna alla <a href="ricerca.html">pagina di ricerca</a>.`);
      return;
    }

    // Aggiorna titolo pagina
    document.title = `${record.cognome} ${record.nome} — IMI Modica`;

    // Breadcrumb
    const breadcrumbName = document.getElementById('breadcrumb-name');
    if (breadcrumbName) breadcrumbName.textContent = `${record.cognome} ${record.nome}`;

    // Foto
    const fotoEl = document.getElementById('scheda-foto');
    if (fotoEl) {
      fotoEl.src = Utils.driveImageUrl(record.foto_url, 400);
      fotoEl.alt = `Foto di ${record.cognome} ${record.nome}`;
    }

    // Nome e sottotitolo
    const nomeEl = document.getElementById('scheda-nome-completo');
    if (nomeEl) nomeEl.textContent = `${record.cognome} ${record.nome}`;

    const subtitleEl = document.getElementById('scheda-subtitle');
    if (subtitleEl) {
      const parts = [record.grado, record.reparto].filter(Boolean);
      subtitleEl.textContent = parts.join(' — ');
    }

    // Badge stato
    const badgeEl = document.getElementById('scheda-badge');
    if (badgeEl) badgeEl.innerHTML = Utils.statusBadge(record.stato);

    // --- Dati Anagrafici ---
    setField('campo-data-nascita', Utils.formatDate(record.data_nascita));
    setField('campo-luogo-nascita', record.luogo_nascita);
    setField('campo-paternita', record.paternita);
    setField('campo-maternita', record.maternita);

    // --- Dati Militari ---
    setField('campo-grado', record.grado);
    setField('campo-reparto', record.reparto);
    setField('campo-distretto', record.distretto_militare);
    setField('campo-matricola', record.matricola);

    // --- Internamento ---
    setField('campo-campo', record.campo_internamento);
    setField('campo-data-cattura', Utils.formatDate(record.data_cattura));
    setField('campo-luogo-cattura', record.luogo_cattura);
    setField('campo-data-liberazione', Utils.formatDate(record.data_liberazione));

    // --- Esito ---
    setField('campo-stato', record.stato);
    const statoValueEl = document.getElementById('campo-stato');
    if (statoValueEl && record.stato) {
      statoValueEl.innerHTML = Utils.statusBadge(record.stato);
    }
    setField('campo-data-morte', Utils.formatDate(record.data_morte));
    setField('campo-causa-morte', record.causa_morte);
    setField('campo-luogo-sepoltura', record.luogo_sepoltura);

    // Nascondi campi esito non pertinenti
    if (record.stato && record.stato.toLowerCase() === 'sopravvissuto') {
      hideField('campo-data-morte');
      hideField('campo-causa-morte');
      hideField('campo-luogo-sepoltura');
    }

    // --- Decorazioni e Note ---
    setField('campo-decorazioni', record.decorazioni);
    setField('campo-note', record.note);

    // Nascondi sezione se vuota
    if (!record.decorazioni && !record.note) {
      const extraSection = document.getElementById('sezione-extra');
      if (extraSection) extraSection.style.display = 'none';
    }

    // --- Fonti ---
    setField('campo-fonti', record.fonti_archivistiche);
    setField('campo-riferimenti', record.riferimenti_familiari);

    if (!record.fonti_archivistiche && !record.riferimenti_familiari) {
      const fontiSection = document.getElementById('sezione-fonti');
      if (fontiSection) fontiSection.style.display = 'none';
    }

    // --- Documenti PDF ---
    const docContainer = document.getElementById('scheda-documenti');
    if (docContainer) {
      const pdfUrls = Utils.splitMultiple(record.documenti_pdf_url);
      if (pdfUrls.length > 0) {
        const docHtml = pdfUrls.map((url, i) => {
          const downloadUrl = Utils.driveDownloadUrl(url);
          const previewUrl = Utils.drivePdfUrl(url);
          return `<a href="${Utils.escapeHtml(downloadUrl || url)}" target="_blank" rel="noopener" class="doc-link">
            &#128196; Documento ${i + 1}
          </a>`;
        }).join('');
        docContainer.innerHTML = docHtml;
      } else {
        const docSection = document.getElementById('sezione-documenti');
        if (docSection) docSection.style.display = 'none';
      }
    }

    // --- Navigazione precedente/successivo ---
    const adj = await DataService.getAdjacentIds(id);
    const prevLink = document.getElementById('nav-prev');
    const nextLink = document.getElementById('nav-next');

    if (prevLink) {
      if (adj.prev) {
        prevLink.href = `scheda.html?id=${adj.prev}`;
      } else {
        prevLink.style.visibility = 'hidden';
      }
    }
    if (nextLink) {
      if (adj.next) {
        nextLink.href = `scheda.html?id=${adj.next}`;
      } else {
        nextLink.style.visibility = 'hidden';
      }
    }

    // Nascondi loading, mostra contenuto
    if (loadingEl) loadingEl.style.display = 'none';
    schedaContainer.style.display = 'block';

  } catch (error) {
    console.error('Errore caricamento scheda:', error);
    showError('Errore nel caricamento dei dati. Riprova più tardi.');
  }

  function setField(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = value || '—';
    }
  }

  function hideField(elementId) {
    const el = document.getElementById(elementId);
    if (el && el.closest('.info-item')) {
      el.closest('.info-item').style.display = 'none';
    }
  }

  function showError(message) {
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) {
      errorEl.innerHTML = message;
      errorEl.style.display = 'block';
    }
  }
});
