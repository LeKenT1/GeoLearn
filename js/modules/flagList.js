window.GL = window.GL || {};

GL.FlagList = {
  currentContinent: 'all',
  searchQuery: '',

  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },
  _n(country) { return GL.I18N ? GL.I18N.name(country) : country.nameFr; },
  _cap(country) { return GL.I18N ? GL.I18N.capital(country) : country.capitalFr; },

  render(container) {
    const t = this._t.bind(this);
    container.innerHTML = `
      <div class="page">
        <div class="page-title">${t('flaglist.title')}</div>
        <p class="page-subtitle">${t('flaglist.subtitle')}</p>

        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" class="search-input" id="flagSearch" placeholder="${t('flaglist.search')}" autocomplete="off">
        </div>

        ${GL.UI.continentTabsHtml('all')}

        <div class="flags-header">
          <span class="flags-count" id="flagsCount">${t('quiz.map.loading')}</span>
        </div>

        <div id="flagsGrid"></div>
      </div>
    `;

    this.currentContinent = 'all';
    this.searchQuery = '';
    this.renderGrid(container);
    this.bindEvents(container);

    if (this._pendingModal) {
      const country = this._pendingModal;
      this._pendingModal = null;
      setTimeout(() => this.showModal(country), 0);
    }
  },

  getFiltered() {
    let list = GL.COUNTRIES;
    if (this.currentContinent !== 'all') {
      list = list.filter(c => c.continent === this.currentContinent);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(c =>
        c.nameFr.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.capitalFr.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        (c.aliases && c.aliases.some(a => a.toLowerCase().includes(q)))
      );
    }
    return list;
  },

  renderGrid(container) {
    const grid = document.getElementById('flagsGrid');
    const count = document.getElementById('flagsCount');
    if (!grid) return;

    const list = this.getFiltered();
    const t = this._t.bind(this);
    count.textContent = t('flaglist.count').replace('{n}', list.length);

    if (list.length === 0) {
      grid.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-muted)">
        <div style="font-size:3rem;margin-bottom:0.75rem">🔍</div>
        <p>${t('flaglist.notfound').replace('{q}', this.searchQuery)}</p>
      </div>`;
      return;
    }

    grid.className = 'flags-grid';
    grid.innerHTML = list.map(c => `
      <div class="flag-card" data-code="${c.code}" title="${this._n(c)}">
        <div class="flag-card-top">${GL.UI.continentBadge(c.continent, c.continentFr)}</div>
        <div class="flag-display">
          <span class="fi fi-${c.code}"></span>
        </div>
        <div class="flag-card-name">${this._n(c)}</div>
        <div class="flag-card-capital">${this._cap(c)}</div>
      </div>
    `).join('');

    grid.querySelectorAll('.flag-card').forEach(card => {
      card.addEventListener('click', () => {
        const code = card.dataset.code;
        const country = GL.COUNTRIES.find(c => c.code === code);
        if (country) this.showModal(country);
      });
    });
  },

  bindEvents(container) {
    const searchInput = container.querySelector('#flagSearch');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderGrid(container);
    });

    container.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentContinent = tab.dataset.c;
        this.renderGrid(container);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  },

  showModal(country) {
    const existing = document.getElementById('flagModal');
    if (existing) existing.remove();

    const t = this._t.bind(this);
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'flagModal';
    overlay.innerHTML = `
      <div class="modal modal-country">
        <button class="modal-close" id="modalClose">✕</button>
        <div class="modal-flag-header">
          <span class="fi fi-${country.code}" style="width:72px;height:48px;background-size:cover;border-radius:6px;box-shadow:var(--shadow-md);display:block;flex-shrink:0;"></span>
          <div class="modal-flag-header-text">
            <div class="modal-country-name">${this._n(country)}</div>
            <div class="modal-country-name-fr">${GL.I18N && GL.I18N.lang === 'en' ? country.nameFr : country.name}</div>
            ${GL.UI.continentBadge(country.continent, country.continentFr)}
          </div>
        </div>
        <div class="modal-minimap" id="modalMiniMap" style="cursor:pointer;" title="${t('modal.seemap')}"></div>
        <div class="modal-facts">
          <div class="modal-fact"><span class="modal-fact-label">${t('modal.capital')}</span><span class="modal-fact-value">${this._cap(country)}</span></div>
          <div class="modal-fact"><span class="modal-fact-label">${t('modal.population')}</span><span class="modal-fact-value modal-loading" id="mPop">…</span></div>
          <div class="modal-fact"><span class="modal-fact-label">${t('modal.language')}</span><span class="modal-fact-value modal-loading" id="mLang">…</span></div>
          <div class="modal-fact"><span class="modal-fact-label">${t('modal.currency')}</span><span class="modal-fact-value modal-loading" id="mCurr">…</span></div>
        </div>
        <div class="modal-history">
          <div class="modal-history-title">${t('modal.history')}</div>
          <p class="modal-history-text modal-loading" id="mHist">${t('modal.loading')}</p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector('#modalClose').addEventListener('click', () => this.closeModal());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) this.closeModal(); });
    overlay.querySelector('#modalMiniMap').addEventListener('click', () => {
      GL.WorldMap._pendingZoomCountry = country;
      this.closeModal();
      window.location.hash = '#/carte';
    });

    this.renderModalMiniMap(country);
    this.loadModalData(country);
  },

  async renderModalMiniMap(country) {
    const el = document.getElementById('modalMiniMap');
    if (!el) return;

    if (!GL.WorldMap.worldData) {
      el.innerHTML = `<div class="modal-minimap-empty" style="display:flex;align-items:center;justify-content:center;height:100%;font-size:0.8rem;color:var(--text-muted);">⏳ ${this._t('modal.loading')}</div>`;
      try {
        GL.WorldMap.worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
        GL.WorldMap.buildNumericMap();
      } catch(e) {
        el.innerHTML = `<div class="modal-minimap-empty" style="display:flex;align-items:center;justify-content:center;height:100%;font-size:0.8rem;color:var(--text-muted);">😢 ${this._t('map.unavailable')}</div>`;
        return;
      }
      const elNow = document.getElementById('modalMiniMap');
      if (!elNow) return;
      elNow.innerHTML = '';
    }

    const worldData = GL.WorldMap.worldData;

    const W = el.clientWidth || 380;
    const H = 160;
    const countries = topojson.feature(worldData, worldData.objects.countries);

    let projection;
    const cb = GL.WorldMap.continentBounds[country.continent];
    if (cb) {
      const [[lo0, la0], [lo1, la1]] = cb;
      const mercY = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
      const lonSpanRad = (lo1 - lo0) * Math.PI / 180;
      const latSpanMerc = Math.abs(mercY(la1) - mercY(la0));
      const scale = Math.min((W - 20) / lonSpanRad, (H - 20) / latSpanMerc);
      projection = d3.geoMercator()
        .scale(scale)
        .center([(lo0 + lo1) / 2, (la0 + la1) / 2])
        .translate([W / 2, H / 2]);
    } else {
      projection = d3.geoMercator().scale(W / (2.1 * Math.PI)).translate([W / 2, H / 1.6]);
    }

    const path = d3.geoPath().projection(projection);

    const svg = d3.select(el).append('svg')
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('width', '100%')
      .style('display', 'block');

    svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#060d1a');
    svg.selectAll('path')
      .data(countries.features)
      .enter().append('path')
      .attr('d', path)
      .attr('fill', d => +d.id === +country.numeric ? '#ef4444' : '#1d2d44')
      .attr('stroke', '#0a0f1e')
      .attr('stroke-width', 0.5);
  },

  loadModalData(country) {
    const t = this._t.bind(this);
    const set = (id, text) => { const el = document.getElementById(id); if (el) { el.textContent = text; el.classList.remove('modal-loading'); } };
    const d = GL.COUNTRY_DETAILS && GL.COUNTRY_DETAILS[country.code];
    if (d) {
      set('mPop',  d.population || '—');
      set('mLang', d.languages  || '—');
      set('mCurr', d.currency   || '—');
      set('mHist', d.summary    || t('modal.noinfo'));
    } else {
      set('mPop', '—'); set('mLang', '—'); set('mCurr', '—');
      set('mHist', t('modal.noinfo'));
    }
  },

  closeModal() {
    const modal = document.getElementById('flagModal');
    if (modal) modal.remove();
  }
};
