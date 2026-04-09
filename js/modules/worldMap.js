window.GL = window.GL || {};

GL.WorldMap = {
  svg: null,
  worldData: null,
  projection: null,
  pathGen: null,
  zoom: null,
  numericMap: {},       // numeric code -> country data
  visibleCodes: new Set(),
  tooltip: null,
  infoPanel: null,
  currentFilter: 'all',
  _onCountryClick: null,  // callback for quiz mode
  _quizMode: false,
  _ptrDown: null,
  _activeLabelModes: new Set(),
  _currentTransform: null,
  countryCentroids: {},
  // Real GeoJSON polygons for Caribbean islands missing from the topojson
  tinyCountriesGeo: {
    28: { type: "MultiPolygon", coordinates: [  // Antigua and Barbuda
      [[[-61.93,17.02],[-61.80,16.99],[-61.68,17.04],[-61.68,17.17],[-61.78,17.21],[-61.93,17.17],[-61.93,17.02]]],
      [[[-61.93,17.58],[-61.68,17.58],[-61.67,17.72],[-61.80,17.75],[-61.93,17.68],[-61.93,17.58]]]
    ]},
    52: { type: "Polygon", coordinates: [  // Barbados
      [[-59.65,13.07],[-59.50,13.04],[-59.43,13.17],[-59.47,13.33],[-59.61,13.32],[-59.65,13.17],[-59.65,13.07]]
    ]},
    212: { type: "Polygon", coordinates: [  // Dominica
      [[-61.48,15.63],[-61.37,15.59],[-61.25,15.47],[-61.25,15.20],[-61.35,15.17],[-61.48,15.22],[-61.50,15.42],[-61.48,15.63]]
    ]},
    308: { type: "Polygon", coordinates: [  // Grenada
      [[-61.78,12.00],[-61.60,12.00],[-61.58,12.13],[-61.63,12.23],[-61.78,12.24],[-61.82,12.12],[-61.78,12.00]]
    ]},
    659: { type: "MultiPolygon", coordinates: [  // Saint Kitts and Nevis
      [[[-62.88,17.42],[-62.75,17.43],[-62.57,17.23],[-62.55,17.13],[-62.63,17.08],[-62.75,17.15],[-62.88,17.42]]],
      [[[-62.65,17.22],[-62.52,17.22],[-62.52,17.10],[-62.60,17.05],[-62.65,17.10],[-62.65,17.22]]]
    ]},
    662: { type: "Polygon", coordinates: [  // Saint Lucia
      [[-61.08,14.10],[-60.88,14.10],[-60.87,13.95],[-60.88,13.73],[-60.97,13.70],[-61.08,13.83],[-61.09,14.02],[-61.08,14.10]]
    ]},
    670: { type: "Polygon", coordinates: [  // Saint Vincent and the Grenadines
      [[-61.32,13.42],[-61.12,13.37],[-61.10,13.20],[-61.18,13.09],[-61.30,13.10],[-61.37,13.25],[-61.32,13.42]]
    ]},
    383: { type: "Polygon", coordinates: [  // Kosovo
      [[20.06,43.01],[20.34,43.25],[20.82,43.27],[21.08,43.24],[21.79,43.11],
       [21.79,42.57],[21.56,42.25],[21.29,42.06],[20.78,41.88],[20.35,42.01],
       [20.06,42.36],[20.06,43.01]]
    ]},
  },

  tinyCountriesCoords: {
    // Caribbean
    28:  [-61.80, 17.07], // Antigua and Barbuda
    44:  [-77.40, 25.00], // Bahamas
    52:  [-59.54, 13.17], // Barbados
    212: [-61.37, 15.42], // Dominica
    308: [-61.68, 12.12], // Grenada
    659: [-62.75, 17.33], // Saint Kitts and Nevis
    662: [-60.98, 13.90], // Saint Lucia
    670: [-61.20, 13.25], // Saint Vincent and the Grenadines
    780: [-61.26, 10.65], // Trinidad and Tobago
    // Europe
    383: [21.09,  42.56], // Kosovo
    20:  [1.60,   42.55], // Andorra
    438: [9.57,   47.17], // Liechtenstein
    470: [14.38,  35.93], // Malta
    492: [7.40,   43.73], // Monaco
    674: [12.46,  43.94], // San Marino
    336: [12.45,  41.90], // Vatican City
    // Asia
    48:  [50.55,  26.07], // Bahrain
    462: [73.22,   3.20], // Maldives
    702: [103.81,  1.36], // Singapore
    // Africa
    132: [-24.00, 16.00], // Cape Verde
    174: [43.87, -11.88], // Comoros
    480: [57.50, -20.20], // Mauritius
    678: [6.73,   0.33],  // Sao Tome and Principe
    // Oceania
    296: [173.00,  1.87], // Kiribati
    584: [171.18,  7.13], // Marshall Islands
    583: [158.24,  6.88], // Micronesia
    520: [166.93, -0.53], // Nauru
    585: [134.62,  7.52], // Palau
    882: [-172.10,-13.76],// Samoa
    776: [-175.20,-21.18],// Tonga
    798: [179.20,  -8.52],// Tuvalu
  },
  gLabels: null,

  // Continent bounding boxes [lon0, lat0, lon1, lat1] for zoom
  continentBounds: {
    Africa:   [[-20, -35], [52, 38]],
    Americas: [[-145, -56], [-30, 72]],
    Asia:     [[25, -10], [150, 55]],
    Europe:   [[-25, 35], [45, 72]],
    Oceania:  [[110, -50], [180, 20]]
  },

  async render(container, options = {}) {
    this._quizMode = options.quizMode || false;
    this._fullscreen = options.fullscreen || false;
    this._onCountryClick = options.onCountryClick || null;
    this.currentFilter = options.continent || 'all';

    if (this._fullscreen) {
      container.innerHTML = `
        <div style="height:calc(100vh - var(--nav-height));overflow:hidden;">
          <div class="map-wrapper" id="mapWrapper" style="height:100%;border-radius:0;border-left:none;border-right:none;border-bottom:none;">
            <div class="map-loading">
              <span class="map-loading-spinner">🌍</span>
              ${GL.I18N ? GL.I18N.t('map.loading') : 'Chargement de la carte…'}
            </div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="page map-page" style="max-width:100%;padding:1.5rem;">
          ${!this._quizMode ? `
            <div style="max-width:var(--max-width);margin:0 auto;">
              <div class="page-title">🗺️ ${GL.I18N ? GL.I18N.t('nav.map') : 'Carte du Monde'}</div>
              <p class="page-subtitle">${GL.I18N ? GL.I18N.t('map.subtitle') : 'Cliquez sur un pays pour voir ses informations'}</p>
            </div>
          ` : ''}
          <div style="max-width:var(--max-width);margin:0 auto;">
            <div class="map-wrapper" id="mapWrapper">
              <div class="map-loading">
                <span class="map-loading-spinner">🌍</span>
                ${GL.I18N ? GL.I18N.t('map.loading') : 'Chargement de la carte…'}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    this.buildNumericMap();
    await this.loadAndRender(container);
  },

  buildNumericMap() {
    this.numericMap = {};
    GL.COUNTRIES.forEach(c => {
      if (c.numeric > 0) this.numericMap[c.numeric] = c;
    });
  },

  async loadAndRender(container) {
    const wrapper = container.querySelector('#mapWrapper');
    if (!wrapper) return;

    try {
      if (!this.worldData) {
        this.worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
      }
      this.renderMap(wrapper);

      if (this._pendingZoomCountry) {
        const c = this._pendingZoomCountry;
        this._pendingZoomCountry = null;
        setTimeout(() => this.zoomToCountry(c, wrapper), 200);
      }
    } catch (e) {
      wrapper.innerHTML = `<div class="map-loading" style="flex-direction:column;gap:1rem;">
        <span style="font-size:3rem">😢</span>
        <div>Impossible de charger la carte.<br><small>Vérifiez votre connexion internet.</small></div>
        <button class="btn btn-primary" onclick="GL.WorldMap.loadAndRender(document.getElementById('app'))">Réessayer</button>
      </div>`;
    }
  },

  renderMap(wrapper) {
    wrapper.innerHTML = '';
    this._activeLabelModes = new Set();
    this._currentTransform = d3.zoomIdentity;
    this.countryCentroids = {};
    this.gLabels = null;

    const W = wrapper.clientWidth || 900;
    const H = this._fullscreen
      ? (wrapper.clientHeight || window.innerHeight - 64)
      : Math.round(W * 0.52);

    this.projection = d3.geoMercator()
      .scale(W / (2.1 * Math.PI))
      .translate([W / 2, H / 1.6]);

    this.pathGen = d3.geoPath().projection(this.projection);

    const svgEl = d3.select(wrapper)
      .append('svg')
      .attr('class', 'map-svg')
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('width', '100%')
      .attr('height', this._fullscreen ? '100%' : null)
      .style('display', 'block');

    this.svg = svgEl;

    // Background sphere
    svgEl.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'sphere')
      .attr('d', this.pathGen);

    // Graticule
    const graticule = d3.geoGraticule()();
    svgEl.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', this.pathGen);

    // Countries
    const countries = topojson.feature(this.worldData, this.worldData.objects.countries);
    this.visibleCodes = new Set(countries.features.map(f => +f.id));
    this.countryCentroids = {};
    countries.features.forEach(f => {
      const c = this.pathGen.centroid(f);
      if (c && !isNaN(c[0]) && !isNaN(c[1])) this.countryCentroids[+f.id] = c;
    });
    // Manual overrides for countries whose GeoJSON includes overseas territories,
    // which would otherwise pull the computed centroid far from the mainland.
    const LABEL_OVERRIDES = {
      840: [-100,  38],  // USA  — centre États-Unis continentaux (exclut Alaska/Hawaii)
      250: [  2.3, 46.5],// France — France métropolitaine (exclut territoires d'outre-mer)
      124: [ -96,  60],  // Canada — centre du Canada
       36: [134,  -25],  // Australie — centre du continent
    };
    Object.entries(LABEL_OVERRIDES).forEach(([numId, lonlat]) => {
      const pt = this.projection(lonlat);
      if (pt && !isNaN(pt[0])) this.countryCentroids[+numId] = pt;
    });

    const g = svgEl.append('g').attr('class', 'countries-group');

    g.selectAll('path.country')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('id', d => `c${d.id}`)
      .attr('d', this.pathGen)
      .style('stroke-width', '0.5px')
      .on('mouseover', (event, d) => this.onMouseOver(event, d))
      .on('mousemove', (event) => this.onMouseMove(event))
      .on('mouseout', () => this.onMouseOut())
      .on('click', (event, d) => this.onCountryClick(event, d));

    // Country borders — inside group so zoom scaling applies
    const borders = topojson.mesh(this.worldData, this.worldData.objects.countries, (a, b) => a !== b);
    g.append('path')
      .datum(borders)
      .attr('class', 'borders')
      .attr('d', this.pathGen)
      .style('stroke-width', '0.8px');

    // Tiny country markers — separate SVG group appended AFTER countries-group so they
    // always render on top of country fills and borders regardless of document order.
    this.gTinyMarkers = svgEl.append('g').attr('class', 'tiny-markers-group');
    this._renderTinyCountryMarkers(this.gTinyMarkers);

    // Label overlay SVG — separate element so labels always render above the flag canvas (z-index:2)
    const labelOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    labelOverlay.setAttribute('viewBox', `0 0 ${W} ${H}`);
    labelOverlay.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;`;
    wrapper.appendChild(labelOverlay);
    this.gLabels = d3.select(labelOverlay).append('g').attr('class', 'map-labels-g').style('pointer-events', 'none');

    // Store features for search zoom
    this.countriesFeatures = countries.features;

    // Zoom — translateExtent with generous margin so panning feels free
    const margin = 0.45;
    this.zoom = d3.zoom()
      .clickDistance(5)
      .scaleExtent([1, 12])
      .translateExtent([[-W * margin, -H * margin], [W * (1 + margin), H * (1 + margin)]])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        const k = event.transform.k;
        g.selectAll('path.country:not(.selected)').style('stroke-width', `${0.5 / k}px`);
        g.selectAll('path.country.selected').style('stroke-width', `${2 / k}px`);
        // Borders get progressively thinner at higher zoom levels
        g.select('path.borders').style('stroke-width', `${0.8 / Math.pow(k, 1.5)}px`);
        const tinyRing = g.select('.tiny-ring');
        if (!tinyRing.empty()) {
          tinyRing.attr('r', 10 / k).style('stroke-width', `${1.5 / k}px`);
        }
        // Tiny markers: sync transform + keep constant screen size by scaling inversely
        if (this.gTinyMarkers) {
          this.gTinyMarkers.attr('transform', event.transform);
          this.gTinyMarkers.selectAll('path.country:not(.selected)').style('stroke-width', `${0.5 / k}px`);
          this.gTinyMarkers.selectAll('path.country.selected').style('stroke-width', `${2 / k}px`);
          this.gTinyMarkers.selectAll('g.country-marker .marker-dot').attr('r', 2 / k);
          this.gTinyMarkers.selectAll('g.country-marker .marker-ring')
            .attr('r', 3.5 / k).style('stroke-width', `${0.6 / k}px`);
          this.gTinyMarkers.selectAll('g.country-marker .marker-hit').attr('r', 10 / k);
        }
        this._currentTransform = event.transform;
        if (this._activeLabelModes && this._activeLabelModes.size > 0) this._updateLabelPositions();
        if (this._flagCanvas) this._drawFlagCanvas();
      });
    svgEl.call(this.zoom);

    // Tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'map-tooltip hidden';
    document.body.appendChild(this.tooltip);

    // Controls
    if (!this._quizMode) {
      this.addControls(wrapper, W, H);
    }

    // If continent filter active, zoom
    if (this.currentFilter && this.currentFilter !== 'all') {
      this.zoomToContinent(this.currentFilter);
    }

    // Highlight continent
    if (this.currentFilter !== 'all') {
      this.applyFilter(this.currentFilter);
    }
  },

  addControls(wrapper, W, H) {
    // Search bar
    const searchBar = document.createElement('div');
    searchBar.className = 'map-search-bar';
    searchBar.innerHTML = `
      <input type="text" id="mapSearchInput" class="map-search-input" placeholder="Chercher un pays ou une capitale…" autocomplete="off">
      <div id="mapSearchResults" class="map-search-results hidden"></div>
    `;
    wrapper.appendChild(searchBar);

    const input = searchBar.querySelector('#mapSearchInput');
    const results = searchBar.querySelector('#mapSearchResults');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { results.classList.add('hidden'); results.innerHTML = ''; return; }
      const matches = GL.COUNTRIES.filter(c =>
        c.nameFr.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.capitalFr.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q)
      ).slice(0, 8);
      if (!matches.length) { results.classList.add('hidden'); results.innerHTML = ''; return; }
      results.innerHTML = matches.map(c => `
        <div class="map-search-item" data-numeric="${c.numeric}">
          <span class="fi fi-${c.code} map-search-flag"></span>
          <span class="map-search-item-name">${c.nameFr}</span>
          <span class="map-search-item-capital">${c.capitalFr}</span>
        </div>
      `).join('');
      results.classList.remove('hidden');
      results.querySelectorAll('.map-search-item').forEach(item => {
        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const numeric = +item.dataset.numeric;
          const country = this.numericMap[numeric];
          if (country) {
            input.value = country.nameFr;
            results.classList.add('hidden');
            results.innerHTML = '';
            this.zoomToCountry(country, wrapper);
          }
        });
      });
    });

    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) return;
      const matches = GL.COUNTRIES.filter(c =>
        c.nameFr.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.capitalFr.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q)
      ).slice(0, 8);
      if (!matches.length) return;
      const exact = matches.find(c =>
        c.nameFr.toLowerCase() === q ||
        c.name.toLowerCase() === q ||
        c.capitalFr.toLowerCase() === q ||
        c.capital.toLowerCase() === q
      );
      const country = exact || matches[0];
      input.value = country.nameFr;
      results.classList.add('hidden');
      results.innerHTML = '';
      this.zoomToCountry(country, wrapper);
    });

    input.addEventListener('blur', () => {
      setTimeout(() => { results.classList.add('hidden'); results.innerHTML = ''; }, 150);
    });

    // Zoom controls
    const ctrl = document.createElement('div');
    ctrl.className = 'map-controls';
    ctrl.innerHTML = `
      <button class="map-ctrl-btn" id="zoomIn" title="Zoom +">+</button>
      <button class="map-ctrl-btn" id="zoomReset" title="${GL.I18N ? GL.I18N.t('map.ctrl.reset') : 'Réinitialiser'}">⊙</button>
      <button class="map-ctrl-btn" id="zoomOut" title="Zoom -">−</button>
    `;
    wrapper.appendChild(ctrl);

    ctrl.querySelector('#zoomIn').addEventListener('click', () => this.zoomBy(1.5));
    ctrl.querySelector('#zoomOut').addEventListener('click', () => this.zoomBy(0.67));
    ctrl.querySelector('#zoomReset').addEventListener('click', () => this.resetZoom());

    // Continent buttons
    const contBtns = document.createElement('div');
    contBtns.className = 'map-continent-btns';
    contBtns.innerHTML = `
      <button class="map-continent-btn ${this.currentFilter === 'all' ? 'active-all' : ''}" data-c="all">${GL.I18N ? GL.I18N.t('cont.all') : 'Tous'}</button>
      <button class="map-continent-btn ${this.currentFilter === 'Africa' ? 'active-africa' : ''}" data-c="Africa">${GL.I18N ? GL.I18N.t('cont.Africa') : 'Afrique'}</button>
      <button class="map-continent-btn ${this.currentFilter === 'Americas' ? 'active-americas' : ''}" data-c="Americas">${GL.I18N ? GL.I18N.t('cont.Americas') : 'Amériques'}</button>
      <button class="map-continent-btn ${this.currentFilter === 'Asia' ? 'active-asia' : ''}" data-c="Asia">${GL.I18N ? GL.I18N.t('cont.Asia') : 'Asie'}</button>
      <button class="map-continent-btn ${this.currentFilter === 'Europe' ? 'active-europe' : ''}" data-c="Europe">${GL.I18N ? GL.I18N.t('cont.Europe') : 'Europe'}</button>
      <button class="map-continent-btn ${this.currentFilter === 'Oceania' ? 'active-oceania' : ''}" data-c="Oceania">${GL.I18N ? GL.I18N.t('cont.Oceania') : 'Océanie'}</button>
    `;
    const leftPanel = document.createElement('div');
    leftPanel.className = 'map-left-panel';
    leftPanel.appendChild(contBtns);
    wrapper.appendChild(leftPanel);

    contBtns.querySelectorAll('.map-continent-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.dataset.c;
        this.currentFilter = c;
        contBtns.querySelectorAll('.map-continent-btn').forEach(b => {
          b.className = 'map-continent-btn';
          if (b.dataset.c === c) b.className = `map-continent-btn active-${c === 'all' ? 'all' : c.toLowerCase()}`;
        });
        this.applyFilter(c);
        if (c !== 'all') this.zoomToContinent(c);
        else this.resetZoom();
        // Remove info panel if open
        this.closeInfoPanel();
      });
    });

    // Label overlay toggle buttons
    const labelBtns = document.createElement('div');
    labelBtns.className = 'map-label-btns';
    labelBtns.innerHTML = `
      <button class="map-label-btn" data-mode="flag">${GL.I18N ? GL.I18N.t('map.label.flags') : 'Drapeaux'}</button>
      <button class="map-label-btn" data-mode="name">${GL.I18N ? GL.I18N.t('map.label.names') : 'Noms'}</button>
      <button class="map-label-btn" data-mode="capital">${GL.I18N ? GL.I18N.t('map.label.capitals') : 'Capitales'}</button>
    `;
    leftPanel.appendChild(labelBtns);
    labelBtns.querySelectorAll('.map-label-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (this._activeLabelModes.has(mode)) {
          this._activeLabelModes.delete(mode);
          btn.classList.remove('active');
          if (mode === 'flag') this._removeFlagFill();
        } else {
          this._activeLabelModes.add(mode);
          btn.classList.add('active');
          if (mode === 'flag') this._applyFlagFill();
        }
        const hasText = this._activeLabelModes.has('name') || this._activeLabelModes.has('capital');
        if (hasText) {
          this._renderLabels();
        } else {
          if (this.gLabels) this.gLabels.selectAll('*').remove();
        }
      });
    });
  },

  applyFilter(continent) {
    if (!this.svg) return;
    this.svg.selectAll('path.country').each(function(d) {
      const el = d3.select(this);
      el.classed('dimmed', false);
      el.classed('continent-active', false);
      if (continent !== 'all') {
        const numId = +d.id;
        const country = GL.WorldMap.numericMap[numId];
        if (!country || country.continent !== continent) {
          el.classed('dimmed', true);
        }
      }
    });
    this.svg.selectAll('g.country-marker').each(function() {
      const el = d3.select(this);
      el.classed('dimmed', false);
      if (continent !== 'all') {
        const numId = +this.id.slice(1);
        const country = GL.WorldMap.numericMap[numId];
        if (!country || country.continent !== continent) {
          el.classed('dimmed', true);
        }
      }
    });
    if (this._flagCanvas) this._drawFlagCanvas();
  },

  zoomBy(factor) {
    if (!this.svg || !this.zoom) return;
    this.svg.transition().duration(300).call(this.zoom.scaleBy, factor);
  },

  resetZoom() {
    if (!this.svg || !this.zoom) return;
    this.svg.transition().duration(500).call(this.zoom.transform, d3.zoomIdentity);
  },

  zoomToContinent(continent) {
    if (!this.svg || !this.zoom || !this.projection) return;
    const bounds = this.continentBounds[continent];
    if (!bounds) return;

    const wrapper = this.svg.node().parentElement;
    const W = wrapper.clientWidth || 900;
    const H = Math.round(W * 0.52);

    const [[lon0, lat0], [lon1, lat1]] = bounds;
    const p0 = this.projection([lon0, lat1]);
    const p1 = this.projection([lon1, lat0]);
    if (!p0 || !p1) return;

    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const x = (p0[0] + p1[0]) / 2;
    const y = (p0[1] + p1[1]) / 2;
    const scale = Math.max(0.8, Math.min(10, 0.85 / Math.max(dx / W, dy / H)));
    const translate = [W / 2 - scale * x, H / 2 - scale * y];

    this.svg.transition().duration(700)
      .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  },

  onMouseOver(event, d) {
    if (this._quizMode) return; // no tooltip during quiz
    const country = this.numericMap[+d.id];
    if (!country) return;

    d3.select(event.target).raise();

    if (this.tooltip) {
      this.tooltip.innerHTML = `
        <span class="fi fi-${country.code}" style="width:28px;height:19px;background-size:cover;border-radius:2px;display:inline-block;flex-shrink:0;"></span>
        <span class="map-tooltip-name">${GL.I18N ? GL.I18N.name(country) : country.nameFr}</span>
      `;
      this.tooltip.classList.remove('hidden');
    }
  },

  onMouseMove(event) {
    if (this.tooltip && !this.tooltip.classList.contains('hidden')) {
      const x = event.clientX + 14;
      const y = event.clientY - 36;
      this.tooltip.style.left = x + 'px';
      this.tooltip.style.top = y + 'px';
    }
  },

  onMouseOut() {
    if (this.tooltip) this.tooltip.classList.add('hidden');
  },

  onCountryClick(event, d) {
    const country = this.numericMap[+d.id];
    if (!country) return;

    if (this._quizMode && this._onCountryClick) {
      if (this.currentFilter && this.currentFilter !== 'all' && country.continent !== this.currentFilter) return;
      this._onCountryClick(country, d.id);
      return;
    }

    // Normal mode: show info panel
    this.svg.selectAll('path.country')
      .classed('selected', false)
      .style('fill', null)
      .style('stroke', null);
    this._restoreFlagFills();
    const sel = this.svg.select(`#c${d.id}`);
    sel.classed('selected', true)
       .style('fill', '#3b82f6')
       .style('stroke', '#ffffff')
       .raise();
    this.showInfoPanel(country, event.target.closest('#mapWrapper') || event.target.parentElement);
  },

  showInfoPanel(country, wrapper) {
    // Only remove the existing panel DOM element, do NOT reset SVG selection
    // (the caller — onCountryClick — has already set the correct selection)
    if (this.infoPanel) {
      this.infoPanel.remove();
      this.infoPanel = null;
    }

    const panel = document.createElement('div');
    panel.className = 'map-info-panel';
    panel.id = 'mapInfoPanel';
    panel.innerHTML = `
      <div class="map-info-panel-header">
        <div>${GL.UI.continentBadge(country.continent, country.continentFr)}</div>
        <button class="map-info-close" id="infoPanelClose">✕</button>
      </div>
      <div class="map-info-flag">
        <span class="fi fi-${country.code}" style="width:100%;height:70px;background-size:contain;background-repeat:no-repeat;background-position:center;border-radius:var(--radius-sm);box-shadow:var(--shadow-sm);display:block;"></span>
      </div>
      <div class="map-info-name">${GL.I18N ? GL.I18N.name(country) : country.nameFr}</div>
      <div class="map-info-name-en">${GL.I18N && GL.I18N.lang === 'en' ? country.nameFr : country.name}</div>
      <div class="map-info-details">
        <div class="map-info-row">
          <span class="map-info-row-label">${GL.I18N ? GL.I18N.t('modal.capital') : '🏛️ Capitale'}</span>
          <span class="map-info-row-value">${GL.I18N ? GL.I18N.capital(country) : country.capitalFr}</span>
        </div>
        <div class="map-info-row">
          <span class="map-info-row-label">${GL.I18N ? GL.I18N.t('map.info.continent') : '🌍 Continent'}</span>
          <span class="map-info-row-value">${GL.I18N ? GL.I18N.cont(country.continent) : country.continentFr}</span>
        </div>
        <div class="map-info-row">
          <span class="map-info-row-label">${GL.I18N ? GL.I18N.t('map.info.code') : '🔤 Code'}</span>
          <span class="map-info-row-value">${country.code.toUpperCase()}</span>
        </div>
      </div>
      <button class="map-info-details-btn" id="infoPanelDetails">${GL.I18N ? GL.I18N.t('map.info.details') : 'Voir la fiche'}</button>
    `;

    const target = wrapper || document.querySelector('#mapWrapper');
    if (target) {
      target.style.position = 'relative';
      target.appendChild(panel);
    }
    this.infoPanel = panel;

    panel.querySelector('#infoPanelClose').addEventListener('click', () => this.closeInfoPanel());
    panel.querySelector('#infoPanelDetails').addEventListener('click', () => {
      this.closeInfoPanel();
      GL.FlagList._pendingModal = country;
      GL.Router.navigate('/drapeaux');
    });
  },

  closeInfoPanel() {
    if (this.infoPanel) {
      this.infoPanel.remove();
      this.infoPanel = null;
    }
    if (this.svg) {
      this.svg.selectAll('path.country')
        .classed('selected', false)
        .style('fill', null)
        .style('stroke', null);
      this._restoreFlagFills();
      this.svg.selectAll('g.country-marker .marker-dot').style('fill', null);
      this.svg.selectAll('g.country-marker .marker-ring').style('stroke', null);
      this.svg.selectAll('.tiny-ring').remove();
    }
  },

  // ===== QUIZ HELPERS =====
  highlightCountry(numericId, type) {
    if (!this.svg) return;
    const sel = this.svg.select(`#c${numericId}`);
    if (sel.empty()) return;
    if (sel.node().tagName === 'g') {
      // Tiny country marker
      const color = type === 'correct' ? 'var(--success)' : type === 'wrong' ? 'var(--error)' : 'var(--warning)';
      sel.select('.marker-dot').style('fill', color);
      sel.select('.marker-ring').style('stroke', color).style('stroke-width', '2px');
      sel.raise();
    } else {
      sel.classed('correct', type === 'correct')
         .classed('wrong', type === 'wrong')
         .classed('target', type === 'target');
    }
  },

  resetHighlights() {
    if (!this.svg) return;
    this.svg.selectAll('path.country')
      .classed('correct', false)
      .classed('wrong', false)
      .classed('target', false);
    this.svg.selectAll('g.country-marker .marker-dot').style('fill', null);
    this.svg.selectAll('g.country-marker .marker-ring').style('stroke', null).style('stroke-width', null);
  },

  // Zoom to a country in quiz mode — no info panel shown
  zoomToCountryQuiz(country) {
    if (!this.svg || !this.zoom) return;
    const feature = this.countriesFeatures && this.countriesFeatures.find(f => +f.id === +country.numeric);
    const wrapper = this.svg.node().parentElement;
    const W = wrapper.clientWidth || 900;
    const H = wrapper.clientHeight || Math.round(W * 0.52);

    let scale, tx, ty;
    if (feature) {
      const [[x0, y0], [x1, y1]] = this.pathGen.bounds(feature);
      const dx = x1 - x0, dy = y1 - y0;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      scale = Math.min(8, 0.75 / Math.max(dx / W, dy / H, 0.01));
      tx = W / 2 - scale * cx;
      ty = H / 2 - scale * cy;
    } else if (this.countryCentroids[country.numeric]) {
      const [cx, cy] = this.countryCentroids[country.numeric];
      scale = 8;
      tx = W / 2 - scale * cx;
      ty = H / 2 - scale * cy;
    } else {
      return;
    }

    this.svg.transition().duration(700)
      .call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  },

  getCountryByNumeric(numericId) {
    return this.numericMap[+numericId] || null;
  },

  getVisibleCodes() {
    return this.visibleCodes;
  },

  zoomToCountry(country, wrapper) {
    if (!this.svg || !this.zoom) return;
    const feature = this.countriesFeatures && this.countriesFeatures.find(f => +f.id === +country.numeric);

    const w = wrapper || this.svg.node().parentElement;
    const W = w.clientWidth || 900;
    const H = w.clientHeight || Math.round(W * 0.52);

    let scale, tx, ty;
    if (feature) {
      const [[x0, y0], [x1, y1]] = this.pathGen.bounds(feature);
      const dx = x1 - x0, dy = y1 - y0;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      scale = Math.min(8, 0.75 / Math.max(dx / W, dy / H, 0.01));
      tx = W / 2 - scale * cx;
      ty = H / 2 - scale * cy;
    } else if (this.countryCentroids[country.numeric]) {
      const [cx, cy] = this.countryCentroids[country.numeric];
      scale = 8;
      tx = W / 2 - scale * cx;
      ty = H / 2 - scale * cy;
    } else {
      return;
    }

    this.svg.transition().duration(700)
      .call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale))
      .on('end', () => {
        this.svg.selectAll('path.country')
          .classed('selected', false)
          .style('fill', null)
          .style('stroke', null);
        this.svg.selectAll('g.country-marker .marker-dot').style('fill', null);
        this.svg.selectAll('g.country-marker .marker-ring').style('stroke', null);
        this._restoreFlagFills();
        const sel = this.svg.select(`#c${country.numeric}`);
        if (!sel.empty() && sel.node().tagName === 'g') {
          sel.select('.marker-dot').style('fill', '#3b82f6');
          sel.select('.marker-ring').style('stroke', '#3b82f6').style('stroke-width', '2px');
          sel.raise();
        } else if (!sel.empty()) {
          sel.classed('selected', true)
             .style('fill', '#3b82f6')
             .style('stroke', '#ffffff')
             .raise();
        }
        // For countries in tinyCountriesCoords (sub-pixel paths or not in topojson),
        // also show a visible ring at the centroid so the location is clearly indicated.
        if (this.tinyCountriesCoords[country.numeric]) {
          const centroid = this.countryCentroids[country.numeric];
          if (centroid) {
            this.svg.selectAll('.tiny-ring').remove();
            const k = (this._currentTransform || d3.zoomIdentity).k;
            this.svg.select('g.countries-group').append('circle')
              .attr('class', 'tiny-ring')
              .attr('cx', centroid[0])
              .attr('cy', centroid[1])
              .attr('r', 10 / k)
              .style('fill', 'rgba(59,130,246,0.18)')
              .style('stroke', '#60a5fa')
              .style('stroke-width', `${1.5 / k}px`)
              .style('pointer-events', 'none');
          }
        }
        this.showInfoPanel(country, w);
      });
  },

  _renderLabels() {
    if (!this.gLabels || !this._activeLabelModes || this._activeLabelModes.size === 0) return;
    this.gLabels.selectAll('*').remove();
    const hasName = this._activeLabelModes.has('name');
    const hasCap  = this._activeLabelModes.has('capital');
    if (!hasName && !hasCap) return;
    const NAME_H = 10, CAP_H = 9, GAP = 2;
    let totalH = 0;
    if (hasName) totalH += NAME_H + GAP;
    if (hasCap)  totalH += CAP_H  + GAP;
    if (totalH > 0) totalH -= GAP;

    Object.entries(this.countryCentroids).forEach(([numId]) => {
      const country = this.numericMap[+numId];
      if (!country) return;
      const grp = this.gLabels.append('g')
        .attr('class', 'country-label')
        .attr('data-id', numId)
        .attr('transform', 'translate(0,0)')
        .style('display', 'none');
      let y = -totalH / 2;
      if (hasName) {
        grp.append('text')
          .attr('x', 0).attr('y', y + NAME_H / 2)
          .attr('class', 'map-label-name')
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
          .text(country.nameFr);
        y += NAME_H + GAP;
      }
      if (hasCap) {
        grp.append('text')
          .attr('x', 0).attr('y', y + CAP_H / 2)
          .attr('class', 'map-label-capital')
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
          .text(country.capitalFr);
      }
    });
    this._updateLabelPositions();
  },

  _applyFlagFill() {
    if (!this.svg) return;

    // Lighten borders so they don't look harsh against colourful flags
    this.svg.select('path.borders')
      .style('stroke', 'rgba(255,255,255,0.45)')
      .style('stroke-width', '0.4px');
    this.svg.selectAll('path.country')
      .style('stroke', 'rgba(255,255,255,0.2)');

    // Create a canvas overlaid on top of the SVG (pointer-events:none so clicks reach SVG)
    const svgNode = this.svg.node();
    const wrapper = svgNode.parentElement;
    const old = wrapper.querySelector('canvas.flag-canvas');
    if (old) old.remove();

    const canvas = document.createElement('canvas');
    canvas.className = 'flag-canvas';
    // Use explicit px size — `height:100%` fails when the containing block has no explicit height
    const svgRect = svgNode.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = svgRect.width  * dpr;
    canvas.height = svgRect.height * dpr;
    canvas.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;z-index:1;width:${svgRect.width}px;height:${svgRect.height}px;`;
    if (window.getComputedStyle(wrapper).position === 'static') wrapper.style.position = 'relative';
    wrapper.appendChild(canvas);
    this._flagCanvas  = canvas;
    this._flagImages  = {};
    this._flagPaths   = {};

    // Split each country path into individual subpaths (one per polygon/island) so that
    // each island gets its own flag fill centered on itself, not a sliver of the full bounding box.
    const ns = 'http://www.w3.org/2000/svg';
    const measureSvg = document.createElementNS(ns, 'svg');
    measureSvg.style.cssText = 'position:absolute;visibility:hidden;width:0;height:0;overflow:hidden;';
    document.body.appendChild(measureSvg);
    const measurePath = document.createElementNS(ns, 'path');
    measureSvg.appendChild(measurePath);

    const map = this;
    this.svg.selectAll('path.country').each(function(d) {
      const fullPath = this.getAttribute('d');
      const subpaths = fullPath.match(/M[^M]*/g) || [fullPath];
      const segments = [];
      subpaths.forEach(sp => {
        measurePath.setAttribute('d', sp);
        const bb = measurePath.getBBox();
        if (bb.width >= 1 && bb.height >= 1) segments.push({ pathStr: sp, bb });
      });
      if (segments.length > 0) map._flagPaths[+d.id] = segments;
    });

    measureSvg.remove();

    // Load flag images; batch-redraw the canvas as images arrive
    let drawPending = false;
    Object.keys(this._flagPaths).forEach(numId => {
      const country = map.numericMap[+numId];
      if (!country) return;
      const img = new Image();
      img.onload = () => {
        map._flagImages[country.code] = img;
        if (!drawPending) {
          drawPending = true;
          requestAnimationFrame(() => { drawPending = false; map._drawFlagCanvas(); });
        }
      };
      img.src = `https://flagcdn.com/w320/${country.code}.png`;
    });

    // Resize canvas when the SVG element resizes (responsive layout / window resize)
    this._flagResizeObs = new ResizeObserver(() => {
      const r = svgNode.getBoundingClientRect();
      const d = window.devicePixelRatio || 1;
      canvas.width  = r.width  * d;
      canvas.height = r.height * d;
      canvas.style.width  = r.width  + 'px';
      canvas.style.height = r.height + 'px';
      map._drawFlagCanvas();
    });
    this._flagResizeObs.observe(svgNode);
  },

  // Draw all loaded flag images on the canvas, respecting zoom + selection + dimming
  _drawFlagCanvas() {
    const canvas = this._flagCanvas;
    if (!canvas || !this._flagPaths) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Map SVG viewBox coordinates → canvas pixels
    const vb = this.svg.node().viewBox.baseVal;
    const sx = canvas.width  / vb.width;
    const sy = canvas.height / vb.height;

    // Apply D3 zoom/pan transform on top
    const t = this._currentTransform || d3.zoomIdentity;
    ctx.save();
    ctx.scale(sx, sy);
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    for (const [numId, segments] of Object.entries(this._flagPaths)) {
      const country = this.numericMap[+numId];
      if (!country) continue;
      const img = this._flagImages[country.code];
      if (!img) continue;

      const svgPath = document.getElementById(`c${numId}`);
      if (svgPath && svgPath.classList.contains('selected')) continue; // let SVG blue highlight show through
      const isDimmed = svgPath && svgPath.classList.contains('dimmed');

      for (const { pathStr, bb } of segments) {
        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.35 : 1;
        ctx.beginPath();
        ctx.clip(new Path2D(pathStr));
        this._drawImageSlice(ctx, img, bb.x, bb.y, bb.width, bb.height);
        ctx.restore();
      }
    }

    ctx.restore();
  },

  // Stretch the flag image to fill the bounding box (no aspect-ratio crop).
  // Cropping the center caused solid-color artefacts for flags like Ireland (wide flag, square country).
  _drawImageSlice(ctx, img, x, y, w, h) {
    ctx.drawImage(img, x, y, w, h);
  },

  _removeFlagFill() {
    if (!this.svg) return;
    if (this._flagResizeObs) { this._flagResizeObs.disconnect(); this._flagResizeObs = null; }
    if (this._flagCanvas)    { this._flagCanvas.remove();        this._flagCanvas    = null; }
    this._flagImages = {};
    this._flagPaths  = {};
    this.svg.selectAll('path.country').style('stroke', null);
    this.svg.select('path.borders').style('stroke', null).style('stroke-width', null);
  },

  // Called after selection/deselection so the canvas redraws with correct skip list.
  // Deferred via setTimeout so .selected class changes are committed first.
  _restoreFlagFills() {
    if (!this._flagCanvas) return;
    setTimeout(() => this._drawFlagCanvas(), 0);
  },


  _updateLabelPositions() {
    if (!this.gLabels) return;
    const transform = this._currentTransform || d3.zoomIdentity;
    const svgEl = this.svg.node();
    const vb = svgEl.viewBox.baseVal;
    const W = vb.width, H = vb.height;
    const map = this;
    this.gLabels.selectAll('g.country-label').each(function() {
      const grp = d3.select(this);
      const numId = +grp.attr('data-id');
      const c = map.countryCentroids[numId];
      if (!c) return;
      const sx = transform.applyX(c[0]);
      const sy = transform.applyY(c[1]);
      const vis = sx > -80 && sx < W + 80 && sy > -30 && sy < H + 30;
      grp.attr('transform', `translate(${sx},${sy})`).style('display', vis ? '' : 'none');
    });
  },

  _renderTinyCountryMarkers(g) {
    const map = this;
    Object.entries(this.tinyCountriesCoords).forEach(([numId, lonlat]) => {
      const numeric = +numId;
      const country = this.numericMap[numeric];
      if (!country) return;

      // If we have real GeoJSON for this country, render as a proper path
      const geo = this.tinyCountriesGeo && this.tinyCountriesGeo[numeric];
      // Skip only if topojson already covers it AND we have dedicated GeoJSON (proper rendering).
      // If only in topojson (e.g. Vatican hidden under Italy), fall through to dot marker.
      if (this.visibleCodes.has(numeric) && geo) return;
      if (geo) {
        const feature = { type: 'Feature', id: numeric, geometry: geo };
        const centroid = this.pathGen.centroid(feature);
        if (centroid && !isNaN(centroid[0])) this.countryCentroids[numeric] = centroid;
        this.visibleCodes.add(numeric);
        g.append('path')
          .datum(feature)
          .attr('class', 'country')
          .attr('id', `c${numeric}`)
          .attr('d', this.pathGen)
          .style('stroke-width', '0.5px')
          .on('mouseover', (event, d) => this.onMouseOver(event, d))
          .on('mousemove', (event) => this.onMouseMove(event))
          .on('mouseout', () => this.onMouseOut())
          .on('click', (event, d) => this.onCountryClick(event, d));

        // Invisible hit circle only for truly tiny GeoJSON polygons (Caribbean islands, etc.).
        // Kosovo (383) is excluded: its polygon is accurate enough — a large hit circle would
        // bleed into neighbouring countries and create a misleading selection zone.
        const area = this.pathGen.area(feature);
        if (centroid && !isNaN(centroid[0]) && area < 50 && numeric !== 383) {
          const hitDatum = { id: numeric };
          g.append('circle')
            .datum(hitDatum)
            .attr('cx', centroid[0])
            .attr('cy', centroid[1])
            .attr('r', 12)
            .style('fill', 'transparent')
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => this.onMouseOver(event, d))
            .on('mousemove', (event) => this.onMouseMove(event))
            .on('mouseout', () => this.onMouseOut())
            .on('click', (event, d) => this.onCountryClick(event, d));
        }
        return;
      }

      // Otherwise render as dot marker (truly tiny: Vatican, Monaco, etc.)
      const pt = this.projection(lonlat);
      if (!pt || isNaN(pt[0]) || isNaN(pt[1])) return;

      this.visibleCodes.add(numeric);
      this.countryCentroids[numeric] = pt;

      const grp = g.append('g')
        .attr('class', 'country country-marker')
        .attr('id', `c${numeric}`)
        .attr('transform', `translate(${pt[0]},${pt[1]})`)
        .style('cursor', 'pointer');

      grp.append('circle')
        .attr('class', 'marker-ring')
        .attr('r', 3.5)
        .style('fill', 'none')
        .style('stroke', '#4a6a8a')
        .style('stroke-width', '0.6px');

      grp.append('circle')
        .attr('class', 'marker-dot')
        .attr('r', 2)
        .style('fill', '#1d2d44');

      // Invisible larger hit area for easier clicking
      grp.append('circle')
        .attr('class', 'marker-hit')
        .attr('r', 10)
        .style('fill', 'transparent');

      grp
        .on('mouseover', (event) => {
          if (map._quizMode) return;
          if (map.tooltip) {
            map.tooltip.innerHTML = `
              <span class="fi fi-${country.code}" style="width:28px;height:19px;background-size:cover;border-radius:2px;display:inline-block;flex-shrink:0;"></span>
              <span class="map-tooltip-name">${GL.I18N ? GL.I18N.name(country) : country.nameFr}</span>
            `;
            map.tooltip.classList.remove('hidden');
          }
        })
        .on('mousemove', (event) => map.onMouseMove(event))
        .on('mouseout', () => map.onMouseOut())
        .on('click', (event) => {
          event.stopPropagation();
          if (map._quizMode && map._onCountryClick) {
            map._onCountryClick(country, numeric);
            return;
          }
          // Normal mode: show info panel
          map.svg.selectAll('path.country')
            .classed('selected', false)
            .style('fill', null)
            .style('stroke', null);
          map.svg.selectAll('g.country-marker .marker-dot').style('fill', null);
          map.svg.selectAll('g.country-marker .marker-ring').style('stroke', null);
          map._restoreFlagFills();
          grp.select('.marker-dot').style('fill', '#3b82f6');
          grp.select('.marker-ring').style('stroke', '#3b82f6').style('stroke-width', '2px');
          grp.raise();
          const wrapper = event.target.closest('#mapWrapper') || map.svg.node().parentElement;
          map.showInfoPanel(country, wrapper);
        });
    });
  },

  cleanup() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
    this.closeInfoPanel();
    this._removeFlagFill();
    this._activeLabelModes = new Set();
    this.gLabels = null;
    this._currentTransform = null;
    this.countryCentroids = {};
  }
};
