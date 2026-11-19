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

    // Foto (una o più, separate da ";": la prima è il ritratto principale)
    const fotoList = Utils.splitMultiple(record.foto_url);
    const fotoEl = document.getElementById('scheda-foto');
    if (fotoEl) {
      fotoEl.src = Utils.driveImageUrl(fotoList[0], 400);
      fotoEl.alt = `Foto di ${record.cognome} ${record.nome}`;
    }
    const galleria = document.getElementById('scheda-galleria');
    if (galleria && fotoList.length > 1) {
      fotoList.forEach((url, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'galleria-thumb' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', `Mostra foto ${i + 1} di ${fotoList.length}`);
        const img = document.createElement('img');
        img.src = Utils.driveImageUrl(url, 160);
        img.alt = '';
        img.loading = 'lazy';
        btn.appendChild(img);
        btn.addEventListener('click', () => {
          fotoEl.src = Utils.driveImageUrl(url, 400);
          galleria.querySelectorAll('.galleria-thumb').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
        galleria.appendChild(btn);
      });
      galleria.hidden = false;
    }

    // Nome e sottotitolo
    const nomeEl = document.getElementById('scheda-nome-completo');
    if (nomeEl) nomeEl.textContent = `${record.cognome} ${record.nome}`;

    const subtitleEl = document.getElementById('scheda-subtitle');
    if (subtitleEl) {
      const parts = [record.grado, record.reparto].filter(v => v && v !== '-');
      subtitleEl.textContent = parts.join(' — ');
    }

    // Badge stato
    const badgeEl = document.getElementById('scheda-badge');
    if (badgeEl) badgeEl.innerHTML = Utils.statusBadge(record.stato);

    // --- Dati Anagrafici ---
    setField('campo-data-nascita', Utils.formatDate(record.data_nascita));
    setField('campo-luogo-nascita', record.luogo_nascita);
    setOptional('campo-provincia-regione',
      [record.provincia, record.regione].filter(v => v && v !== '-').join(', '));
    setField('campo-paternita', record.paternita);
    setField('campo-maternita', record.maternita);

    // --- Dati Militari ---
    setField('campo-grado', record.grado);
    setField('campo-reparto', record.reparto);
    setOptional('campo-distretto', record.distretto_militare);
    setField('campo-matricola', record.matricola);
    setOptional('campo-matricola-lager', record.matricola_lager);

    // --- Internamento ---
    setField('campo-luogo-cattura', record.luogo_cattura);
    setField('campo-data-cattura', Utils.formatDate(record.data_cattura));
    setField('campo-campo', record.campo_internamento);
    setField('campo-data-liberazione', Utils.formatDate(record.data_liberazione));
    setOptional('campo-forze-alleate', record.forze_alleate);

    // --- Esito ---
    const statoValueEl = document.getElementById('campo-stato');
    if (statoValueEl) {
      if (record.stato) statoValueEl.innerHTML = Utils.statusBadge(record.stato);
      else statoValueEl.textContent = '—';
    }
    setOptional('campo-centro-alloggio', record.centro_alloggio);
    setOptional('campo-data-rimpatrio', Utils.formatDate(record.data_rimpatrio));
    // Per i reduci il "-" nei campi sul decesso non è informativo: si nasconde
    const isCaduto = Utils.normalizeStato(record.stato) === 'caduto';
    const deathVal = v => (!isCaduto && v === '-') ? '' : v;
    setOptional('campo-data-morte', Utils.formatDate(deathVal(record.data_morte)));
    setOptional('campo-causa-morte', deathVal(record.causa_morte));
    setOptional('campo-luogo-sepoltura', deathVal(record.luogo_sepoltura));

    // --- Memoria (progetti, sampietrini, scuole) ---
    const memoriaEl = document.getElementById('campo-memoria');
    const memorie = Utils.splitMultiple(record.memoria);
    if (memoriaEl && memorie.length) {
      memorie.forEach(m => {
        const li = document.createElement('li');
        li.textContent = m;
        memoriaEl.appendChild(li);
      });
    } else {
      const memSection = document.getElementById('sezione-memoria');
      if (memSection) memSection.style.display = 'none';
    }

    // --- Decorazioni e Note ---
    setOptional('campo-decorazioni', record.decorazioni);
    setOptional('campo-note', record.note);

    // Nascondi sezione se vuota
    if (!record.decorazioni && !record.note) {
      const extraSection = document.getElementById('sezione-extra');
      if (extraSection) extraSection.style.display = 'none';
    }

    // --- Fonti ---
    setOptional('campo-fonti', record.fonti_archivistiche);
    setOptional('campo-riferimenti', record.riferimenti_familiari);

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

  // Campo facoltativo: se vuoto, la voce viene nascosta
  function setOptional(elementId, value) {
    if (value && String(value).trim()) setField(elementId, value);
    else hideField(elementId);
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
