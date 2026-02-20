/* ============================================
   STATS.JS - Contatori animati homepage
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const statsSection = document.querySelector('.stats-bar');
  if (!statsSection) return;

  const elTotale = document.getElementById('stat-totale');
  const elCampi = document.getElementById('stat-campi');
  const elDeceduti = document.getElementById('stat-deceduti');
  const elSopravvissuti = document.getElementById('stat-sopravvissuti');

  if (!elTotale) return;

  try {
    const stats = await DataService.getStats();

    // Usa Intersection Observer per animare quando visibile
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Utils.animateCounter(elTotale, stats.totale);
          Utils.animateCounter(elCampi, stats.numCampi);
          Utils.animateCounter(elDeceduti, stats.deceduti);
          Utils.animateCounter(elSopravvissuti, stats.sopravvissuti);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);

  } catch (error) {
    console.error('Errore caricamento statistiche:', error);
    // Mostra trattini in caso di errore
    [elTotale, elCampi, elDeceduti, elSopravvissuti].forEach(el => {
      if (el) el.textContent = '—';
    });
  }
});
