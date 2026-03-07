/* ============================================
   CONTENT-LOADER.JS - Carica contenuti da JSON
   Permette la modifica via CMS senza toccare HTML
   ============================================ */

const ContentLoader = {

  pageMap: {
    'index.html':            'home',
    'autore.html':           'autore',
    'metodo-e-fonti.html':   'metodo-e-fonti',
    'crediti.html':          'crediti',
    'contatti.html':         'contatti'
  },

  getPageKey() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return this.pageMap[file] || null;
  },

  async load() {
    const key = this.getPageKey();
    if (!key) return;

    try {
      const resp = await fetch('content/' + key + '.json');
      if (!resp.ok) return;
      const data = await resp.json();
      this.render(key, data);
    } catch (e) {
      // Fallback: il contenuto HTML originale resta visibile
    }
  },

  render(key, data) {
    if (key === 'home') {
      this.renderHome(data);
    } else if (key === 'contatti') {
      this.renderContatti(data);
    } else {
      this.renderArticle(data);
    }
  },

  renderHome(d) {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && d.hero_title) {
      heroTitle.innerHTML = d.hero_title.replace(/\n/g, '<br>');
    }

    const heroSub = document.querySelector('.hero-subtitle');
    if (heroSub && d.hero_subtitle) {
      heroSub.textContent = d.hero_subtitle;
    }

    const introTitle = document.querySelector('.intro-text .section-title');
    if (introTitle && d.intro_title) {
      introTitle.textContent = d.intro_title;
    }

    if (d.intro_body) {
      const introText = document.querySelector('.intro-text');
      if (introText) {
        const title = introText.querySelector('.section-title');
        const html = marked.parse(d.intro_body);
        // Mantieni il titolo, sostituisci i paragrafi
        const existing = introText.querySelectorAll('p');
        existing.forEach(p => p.remove());
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        while (tmp.firstChild) {
          introText.appendChild(tmp.firstChild);
        }
      }
    }

    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
      const ctaH2 = ctaSection.querySelector('h2');
      if (ctaH2 && d.cta_title) ctaH2.textContent = d.cta_title;

      const ctaP = ctaSection.querySelector('p');
      if (ctaP && d.cta_text) ctaP.textContent = d.cta_text;
    }
  },

  renderArticle(d) {
    const article = document.querySelector('.article-page');
    if (!article) return;

    let html = '';
    if (d.title) {
      html += '<h1>' + this.escapeHtml(d.title) + '</h1>\n';
    }
    if (d.body) {
      html += marked.parse(d.body);
    }
    article.innerHTML = html;
  },

  renderContatti(d) {
    const article = document.querySelector('.article-page');
    if (!article) return;

    const h1 = article.querySelector('h1');
    if (h1 && d.title) h1.textContent = d.title;

    const introP = article.querySelector('p.text-center');
    if (introP && d.intro) introP.textContent = d.intro;
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

document.addEventListener('DOMContentLoaded', () => ContentLoader.load());
