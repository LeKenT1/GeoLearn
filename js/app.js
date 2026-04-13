window.GL = window.GL || {};

GL.App = {
  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },
  _n(country) { return GL.I18N ? GL.I18N.name(country) : country.nameFr; },
  _cap(country) { return GL.I18N ? GL.I18N.capital(country) : country.capitalFr; },
  _cont(key) { return GL.I18N ? GL.I18N.cont(key) : (GL.CONTINENTS_FR[key] || key); },

  init() {
    // Apply stored language
    const lang = GL.I18N.lang;
    document.documentElement.lang = lang;

    // Hide loading screen
    setTimeout(() => {
      const ls = document.getElementById('loading-screen');
      if (ls) ls.classList.add('hidden');
    }, 600);

    // Navbar hamburger
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
      });
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          toggle.classList.remove('open');
          links.classList.remove('open');
        });
      });
    }

    // Language switch
    document.querySelectorAll('.lang-switch-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) {
      langSwitch.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-switch-btn');
        const newLang = btn ? btn.dataset.lang : (GL.I18N.lang === 'fr' ? 'en' : 'fr');
        if (newLang === GL.I18N.lang) return;
        GL.I18N.setLang(newLang);
        this._updateNavLabels();
      });
    }

    this._updateNavLabels();

    // Initialiser Supabase Auth avant le router (nécessaire pour le classement au reload)
    if (window.GL && GL.Auth) {
      GL.Auth.init();
      const authBtn = document.getElementById('authBtn');
      if (authBtn) {
        authBtn.addEventListener('click', () => GL.Auth.openModal());
      }
    }

    // Init router
    GL.Router.init({
      '/':               (el) => this.renderHome(el),
      '/drapeaux':       (el) => GL.FlagList.render(el),
      '/quiz/drapeaux':  (el) => GL.QuizFlags.render(el),
      '/quiz/capitales': (el) => GL.QuizCapitals.render(el),
      '/quiz/carte':     (el) => GL.QuizMap.render(el),
      '/quiz/cauchemar': (el) => GL.QuizNightmare.render(el),
      '/quiz/ultime':    (el) => GL.QuizUltimate.render(el),
      '/quiz/defi':            (el) => GL.Challenge.render(el),
      '/quiz/defi/:id':        (el, p) => GL.Challenge.renderChallenge(el, p),
      '/quiz/defi-groupe/:id': (el, p) => GL.GroupChallenge.renderChallenge(el, p),
      '/carte':          (el) => this.renderWorldMap(el),
      '/stats':          (el) => this.renderStats(el),
      '/succes':         (el) => GL.Achievements.render(el),
      '/profil':         (el) => GL.Profile.render(el),
      '/classement':     (el) => GL.Leaderboard.render(el),
      '/test':           (el) => GL.FlagTest && GL.FlagTest.render(el),
    });

    GL.Profile.init();
    if (GL.Challenge) GL.Challenge.init();
    if (GL.GroupChallenge) GL.GroupChallenge.init();
    if (GL.Achievements) GL.Achievements.updateNavDot();

    // Lien test visible uniquement en local
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      const navLinks = document.getElementById('navLinks');
      if (navLinks) {
        const testLink = document.createElement('a');
        testLink.href = '#/test';
        testLink.className = 'nav-link';
        testLink.textContent = '🧪 Test';
        testLink.style.cssText = 'color:var(--accent);font-weight:700;';
        navLinks.appendChild(testLink);
      }
    }
  },

  _updateNavLabels() {
    const t = this._t.bind(this);
    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    set('navHome',  t('nav.home'));
    set('navFlags', t('nav.flags'));
    set('navMap',   t('nav.map'));
    set('navStats', t('nav.stats'));
    set('navAch',   t('nav.achievements'));
    set('navLeaderboard', t('nav.leaderboard'));
    set('navQuizFlags', t('nav.quiz.flags'));
    set('navQuizCap',   t('nav.quiz.capitals'));
    set('navQuizMap',   t('nav.quiz.map'));
    set('navQuizNight',      t('nav.quiz.nightmare'));
    set('navQuizUltimate',   t('nav.quiz.ultimate'));
    set('navQuizChallenge',  '⚔️ Défi');
    const quizBtn = document.getElementById('navQuizBtn');
    if (quizBtn) quizBtn.childNodes[0].textContent = t('nav.quiz') + ' ';
    // Update lang switch active state
    document.querySelectorAll('.lang-switch-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === GL.I18N.lang);
    });
  },

  renderHome(container) {
    const t = this._t.bind(this);
    const stats = GL.UI.getStats();
    const totalCountries = GL.COUNTRIES.length;
    const totalContinents = GL.CONTINENTS.length;
    const mastery = stats.mastery || {};
    const masteryCount = { flag: 0, capital: 0, map: 0 };
    GL.COUNTRIES.forEach(co => {
      const m = mastery[co.code];
      if (!m) return;
      if (m.flag >= 1) masteryCount.flag++;
      if (m.capital >= 1) masteryCount.capital++;
      if (m.map >= 1) masteryCount.map++;
    });

    container.innerHTML = `
      <div class="home-wrapper">

        <!-- Hero -->
        <div class="home-hero">
          <div class="home-hero-content">
            <div class="hero-globe">🌍</div>
            <h1 class="hero-title">GeoLearn</h1>
            <p class="hero-subtitle">${t('home.subtitle')}</p>
            <div class="home-pills">
              <span class="home-pill">🌍 ${totalCountries} ${t('home.stat.countries').toLowerCase()}</span>
              <span class="home-pill">🏁 ${t('home.pill.flags')}</span>
              <span class="home-pill">🏛️ ${t('home.pill.capitals')}</span>
              <span class="home-pill">📍 ${t('home.pill.map')}</span>
              <span class="home-pill">🌐 ${totalContinents} ${t('home.stat.continents').toLowerCase()}</span>
            </div>
            <div class="hero-actions">
              <button class="btn btn-secondary btn-lg" id="heroQuizBtn">${t('nav.quiz')}</button>
              <a href="#/carte" class="btn btn-secondary btn-lg">${t('nav.map')}</a>
              <a href="#/classement" class="btn btn-secondary btn-lg">${t('nav.leaderboard')}</a>
            </div>
          </div>
        </div>

        <!-- Quiz pick modal -->
        <div class="quiz-pick-modal" id="quizPickModal" aria-hidden="true">
          <div class="quiz-pick-backdrop" id="quizPickBackdrop"></div>
          <div class="quiz-pick-content">
            <div class="quiz-pick-header">
              <h3>${t('home.modal.quiz.title')}</h3>
              <button class="quiz-pick-close" id="quizPickClose">✕</button>
            </div>
            <div class="quiz-pick-grid">
              <a href="#/quiz/drapeaux" class="quiz-pick-item quiz-pick-flags">
                <div class="quiz-pick-icon">🏁</div>
                <div class="quiz-pick-name">${t('feat.quizflags.title')}</div>
                <div class="quiz-pick-desc">${t('feat.quizflags.desc')}</div>
              </a>
              <a href="#/quiz/capitales" class="quiz-pick-item quiz-pick-caps">
                <div class="quiz-pick-icon">🏛️</div>
                <div class="quiz-pick-name">${t('feat.quizcap.title')}</div>
                <div class="quiz-pick-desc">${t('feat.quizcap.desc')}</div>
              </a>
              <a href="#/quiz/carte" class="quiz-pick-item quiz-pick-map">
                <div class="quiz-pick-icon">📍</div>
                <div class="quiz-pick-name">${t('feat.quizmap.title')}</div>
                <div class="quiz-pick-desc">${t('feat.quizmap.desc')}</div>
              </a>
              <a href="#/quiz/cauchemar" class="quiz-pick-item quiz-pick-night">
                <div class="quiz-pick-icon">💀</div>
                <div class="quiz-pick-name">${t('feat.nightmare.title')}</div>
                <div class="quiz-pick-desc">${t('feat.nightmare.desc')}</div>
              </a>
              <a href="#/quiz/ultime" class="quiz-pick-item quiz-pick-ultimate">
                <div class="quiz-pick-icon">👑</div>
                <div class="quiz-pick-name">${t('feat.ultimate.title')}</div>
                <div class="quiz-pick-desc">${t('feat.ultimate.desc')}</div>
              </a>
              <a href="#/quiz/defi" class="quiz-pick-item quiz-pick-challenge">
                <div class="quiz-pick-icon">⚔️</div>
                <div class="quiz-pick-name">Défi <span class="beta-badge">Béta</span></div>
                <div class="quiz-pick-desc">1V1 ou jusqu'à 5 joueurs avec classement</div>
              </a>
            </div>
          </div>
        </div>

        <div class="home-content">

          <!-- Stats bar -->
          <div class="home-stats">
            ${(() => {
              const xp = stats.rankedXP || 0;
              const { tier } = GL.UI.getRankInfo(xp);
              const tierName = GL.UI.tierName(tier);
              return `<div class="home-stat">
                <div class="home-stat-number"><span class="rank-badge-mini" style="--rank-color:${tier.color};"><span style="display:inline-block;width:1.2em;height:1.2em;vertical-align:middle;">${GL.RankBadges ? GL.RankBadges.svgFrameOnly(tier.key) : tier.icon}</span> ${tierName}</span></div>
                <div class="home-stat-label">${t('home.stat.rank')}</div>
              </div>`;
            })()}
            <div class="home-stat">
              <div class="home-stat-number">${totalCountries}</div>
              <div class="home-stat-label">${t('home.stat.countries')}</div>
            </div>
            <div class="home-stat">
              <div class="home-stat-number">${totalContinents}</div>
              <div class="home-stat-label">${t('home.stat.continents')}</div>
            </div>
            <div class="home-stat">
              <div class="home-stat-number">${totalCountries}</div>
              <div class="home-stat-label">${t('home.stat.capitals')}</div>
            </div>
            <div class="home-stat">
              <div class="home-stat-number">${stats.totalQuestions || 0}</div>
              <div class="home-stat-label">${t('home.stat.answered')}</div>
            </div>
            ${stats.totalQuestions > 0 ? `<div class="home-stat">
              <div class="home-stat-number">${GL.UI.formatPercent(stats.totalCorrect, stats.totalQuestions)}</div>
              <div class="home-stat-label">${t('home.stat.success')}</div>
            </div>` : ''}
          </div>

          <!-- Learning Tracks -->
          <div class="home-section">
            <div class="home-section-header">
              <h2 class="home-section-title">${t('home.tracks.title')}</h2>
              <p class="home-section-sub">${t('home.tracks.sub')}</p>
            </div>
            <div class="home-tracks">
              <a href="#/quiz/drapeaux" class="home-track home-track-flags">
                <div class="home-track-icon">🏁</div>
                <div class="home-track-body">
                  <div class="home-track-title">${t('feat.quizflags.title')}</div>
                  <div class="home-track-desc">${t('feat.quizflags.desc')}</div>
                  <div class="home-track-progress">
                    <div class="home-track-bar"><div class="home-track-fill" style="width:${Math.round(masteryCount.flag / totalCountries * 100)}%"></div></div>
                    <span>${masteryCount.flag}/${totalCountries}</span>
                  </div>
                </div>
                <span class="home-track-arrow">→</span>
              </a>
              <a href="#/quiz/capitales" class="home-track home-track-caps">
                <div class="home-track-icon">🏛️</div>
                <div class="home-track-body">
                  <div class="home-track-title">${t('feat.quizcap.title')}</div>
                  <div class="home-track-desc">${t('feat.quizcap.desc')}</div>
                  <div class="home-track-progress">
                    <div class="home-track-bar"><div class="home-track-fill" style="width:${Math.round(masteryCount.capital / totalCountries * 100)}%"></div></div>
                    <span>${masteryCount.capital}/${totalCountries}</span>
                  </div>
                </div>
                <span class="home-track-arrow">→</span>
              </a>
              <a href="#/quiz/carte" class="home-track home-track-map">
                <div class="home-track-icon">📍</div>
                <div class="home-track-body">
                  <div class="home-track-title">${t('feat.quizmap.title')}</div>
                  <div class="home-track-desc">${t('feat.quizmap.desc')}</div>
                  <div class="home-track-progress">
                    <div class="home-track-bar"><div class="home-track-fill" style="width:${Math.round(masteryCount.map / totalCountries * 100)}%"></div></div>
                    <span>${masteryCount.map}/${totalCountries}</span>
                  </div>
                </div>
                <span class="home-track-arrow">→</span>
              </a>
              <a href="#/quiz/ultime" class="home-track home-track-ultimate">
                <div class="home-track-icon">👑</div>
                <div class="home-track-body">
                  <div class="home-track-title">${t('feat.ultimate.title')}</div>
                  <div class="home-track-desc">${t('feat.ultimate.desc')}</div>
                </div>
                <span class="home-track-arrow">→</span>
              </a>
            </div>
          </div>

          <!-- Explore -->
          <div class="home-section">
            <div class="home-section-header">
              <h2 class="home-section-title">${t('home.explore.title')}</h2>
            </div>
            <div class="features-grid">
              <a href="#/drapeaux" style="text-decoration:none;">
                <div class="feature-card">
                  <div class="feature-card-icon">🌍</div>
                  <div class="feature-card-title">${t('feat.flags.title')}</div>
                  <div class="feature-card-desc">${t('feat.flags.desc').replace('{n}', totalCountries)}</div>
                  <div class="feature-card-arrow">${t('feat.flags.link')}</div>
                </div>
              </a>
              <a href="#/carte" style="text-decoration:none;">
                <div class="feature-card">
                  <div class="feature-card-icon">📍</div>
                  <div class="feature-card-title">${t('feat.map.title')}</div>
                  <div class="feature-card-desc">${t('feat.map.desc')}</div>
                  <div class="feature-card-arrow">${t('feat.map.link')}</div>
                </div>
              </a>
              <a href="#/stats" style="text-decoration:none;">
                <div class="feature-card">
                  <div class="feature-card-icon">📊</div>
                  <div class="feature-card-title">${t('feat.stats.title')}</div>
                  <div class="feature-card-desc">${t('feat.stats.desc')}</div>
                  <div class="feature-card-arrow">${t('feat.stats.link')}</div>
                </div>
              </a>
              <a href="#/succes" style="text-decoration:none;">
                <div class="feature-card">
                  <div class="feature-card-icon">🏆</div>
                  <div class="feature-card-title">${t('feat.achievements.title')}</div>
                  <div class="feature-card-desc">${t('feat.achievements.desc')}</div>
                  <div class="feature-card-arrow">${t('feat.achievements.link')}</div>
                </div>
              </a>
              <a href="#/quiz/cauchemar" style="text-decoration:none;">
                <div class="feature-card" style="border-color:rgba(124,58,237,0.3);background:linear-gradient(135deg,rgba(124,58,237,0.06),rgba(220,38,38,0.06));">
                  <div class="feature-card-icon">💀</div>
                  <div class="feature-card-title">${t('feat.nightmare.title')}</div>
                  <div class="feature-card-desc">${t('feat.nightmare.desc')}</div>
                  <div class="feature-card-arrow">${t('feat.nightmare.link')}</div>
                </div>
              </a>
              <a href="#/quiz/ultime" style="text-decoration:none;">
                <div class="feature-card" style="border-color:rgba(245,158,11,0.4);background:linear-gradient(135deg,rgba(245,158,11,0.07),rgba(236,72,153,0.07),rgba(139,92,246,0.07));">
                  <div class="feature-card-icon">👑</div>
                  <div class="feature-card-title">${t('feat.ultimate.title')}</div>
                  <div class="feature-card-desc">${t('feat.ultimate.desc')}</div>
                  <div class="feature-card-arrow">${t('feat.ultimate.link')}</div>
                </div>
              </a>
            </div>
          </div>

          <div class="home-cta-banner">
              <div class="home-cta-icon">🚀</div>
              <div class="home-cta-body">
                <div class="home-cta-title">${t('home.cta.title')}</div>
                <div class="home-cta-desc">${t('home.cta.desc')}</div>
              </div>
              <a href="#/quiz/drapeaux" class="btn btn-primary">${t('home.cta.btn')}</a>
            </div>

        </div>
      </div>
    `;

    // Quiz pick modal
    const modal = container.querySelector('#quizPickModal');
    const openModal = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); };
    const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
    container.querySelector('#heroQuizBtn').addEventListener('click', openModal);
    container.querySelector('#quizPickBackdrop').addEventListener('click', closeModal);
    container.querySelector('#quizPickClose').addEventListener('click', closeModal);
    modal.querySelectorAll('.quiz-pick-item').forEach(item => item.addEventListener('click', closeModal));
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
    });
  },

  renderWorldMap(container) {
    GL.WorldMap.render(container, { fullscreen: true });
  },

  _rankCardHtml(stats) {
    const t = this._t.bind(this);
    const xp = stats.rankedXP || 0;
    const discovered = GL.UI.computeDiscovered(stats);
    const totalUnique = GL.UI.TOTAL_UNIQUE;
    const { tier, next } = GL.UI.getRankInfo(xp);
    const isNextLegend = next?.key === 'legend';
    const isCurrentLegend = tier.key === 'legend';
    const tierName = GL.UI.tierName(tier);
    const nextName = next ? GL.UI.tierName(next) : null;
    let tierPct, barLabels, nextLine;
    if (isCurrentLegend) {
      tierPct = 100;
      barLabels = `<span>${tierName}</span><span>${t('result.rank.max')}</span>`;
      nextLine = `${t('stats.rank.discovered').replace('{n}', `${discovered}/${totalUnique}`)} · ${t('stats.rank.max')}`;
    } else if (isNextLegend) {
      tierPct = Math.round(discovered / totalUnique * 100);
      barLabels = `<span>${tierName}</span><span>${nextName} (${discovered}/${totalUnique})</span>`;
      nextLine = t('stats.rank.legend.next').replace('{n}', `${discovered}/${totalUnique}`);
    } else {
      const TOTAL = GL.UI.RANK_XP_MAX;
      const tierEnd = next ? next.min - 1 : TOTAL;
      const tierRange = tierEnd - tier.min;
      tierPct = tierRange > 0 ? Math.min(100, Math.round((xp - tier.min) / tierRange * 100)) : 100;
      barLabels = `<span>${tierName} (${tier.min} Pts)</span>${nextName ? `<span>${nextName} (${next.min} Pts)</span>` : `<span>${t('result.rank.max')}</span>`}`;
      nextLine = nextName ? t('stats.rank.next').replace('{n}', next.min) : t('stats.rank.max');
    }
    return `
      <div class="rank-card" style="--rank-color:${tier.color};">
        <div class="rank-icon">${GL.RankBadges ? GL.RankBadges.svgFrameOnly(tier.key) : tier.icon}</div>
        <div class="rank-name">${tierName}</div>
        <div class="rank-xp-big" style="color:${tier.color};">${xp}<span class="rank-xp-unit"> Pts</span></div>
        <div class="rank-mastered-line">${nextLine}</div>
        <div class="rank-tier-labels">${barLabels}</div>
        <div class="rank-bar-track">
          <div class="rank-bar-fill" style="width:${tierPct}%;"></div>
        </div>
      </div>`;
  },

  // ===== STATS HELPERS =====

  _continentCardHtml(c) {
    const t = this._t.bind(this);
    const r = 42, circ = +(2 * Math.PI * r).toFixed(2);
    const offset = +(circ * (1 - c.pct / 100)).toFixed(2);
    const varName = c.continent.toLowerCase();
    const emoji = GL.UI.continentEmoji(c.continent);
    const contLabel = this._cont(c.continent);
    return `
      <div class="continent-ring-card" data-continent="${c.continent}" tabindex="0" role="button">
        <svg viewBox="0 0 100 100" class="continent-ring-svg">
          <circle cx="50" cy="50" r="${r}" fill="none" style="stroke:var(--bg-surface);stroke-width:8;"/>
          <circle cx="50" cy="50" r="${r}" fill="none"
            style="stroke:var(--${varName});stroke-width:8;transform:rotate(-90deg);transform-origin:50% 50%;"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
          <text x="50" y="43" text-anchor="middle" font-size="22" style="fill:var(--text-primary);">${emoji}</text>
          <text x="50" y="64" text-anchor="middle" font-size="14" font-weight="bold" style="fill:var(--text-primary);">${c.pct}%</text>
        </svg>
        <div class="continent-ring-name">${contLabel}</div>
        <div class="continent-ring-sub">${c.correct > 0 ? `${c.correct}/${c.maxTotal}` : t('stats.notplayed')}</div>
      </div>`;
  },

  _continentDetailHtml(c, mastery) {
    const t = this._t.bind(this);
    const typeLabels = [
      { key: 'flag',    emoji: '🏁', label: t('stats.flags') },
      { key: 'capital', emoji: '🏛️', label: t('stats.capitals') },
      { key: 'map',     emoji: '📍', label: t('stats.map') }
    ];
    const typeCounts = typeLabels.map(tl => {
      let ok = 0, fail = 0, notTried = 0;
      c.countries.forEach(co => {
        const m = mastery[co.code];
        if (!m || m[tl.key] === undefined) notTried++;
        else if (m[tl.key] >= 1) ok++;
        else fail++;
      });
      return { ...tl, ok, fail, notTried };
    });
    const contLabel = this._cont(c.continent);
    return `
      <div class="continent-detail-header">
        <span>${GL.UI.continentEmoji(c.continent)}</span>
        <span style="color:var(--${c.continent.toLowerCase()});">${contLabel}</span>
        <span style="color:var(--text-muted);font-size:0.85rem;font-weight:400;">${c.countries.length} ${t('home.stat.countries').toLowerCase()}</span>
      </div>
      <div class="continent-type-stats">
        ${typeCounts.map(tl => `
          <div class="continent-type-stat">
            <div style="font-size:0.9rem;font-weight:700;margin-bottom:0.4rem;">${tl.emoji} ${tl.label}</div>
            <div style="display:flex;justify-content:center;gap:0.75rem;font-size:0.8rem;">
              <span style="color:var(--success);">✓ ${tl.ok}</span>
              <span style="color:var(--error);">✗ ${tl.fail}</span>
              <span style="color:var(--text-muted);">— ${tl.notTried}</span>
            </div>
          </div>`).join('')}
      </div>
      <div class="country-progress-list">
        ${c.countries.map(co => {
          const m = mastery[co.code];
          return `
            <div class="country-progress-item country-clickable" data-code="${co.code}">
              <span class="fi fi-${co.code}" style="width:24px;height:16px;background-size:cover;border-radius:2px;display:inline-block;flex-shrink:0;"></span>
              <span style="flex:1;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._n(co)}</span>
              ${typeLabels.map(tl => {
                const val = m && m[tl.key] !== undefined ? m[tl.key] : -1;
                const cls = val === -1 ? 'none' : val >= 1 ? 'ok' : 'fail';
                return `<span class="mastery-indicator ${cls}" title="${tl.label}">${tl.emoji}</span>`;
              }).join('')}
            </div>`;
        }).join('')}
      </div>`;
  },

  _typeCardHtml(type, emoji, label, ts) {
    const t = this._t.bind(this);
    const total = GL.COUNTRIES.length;
    const tried = ts.ok + ts.fail;
    const pct = Math.round(ts.ok / total * 100);
    return `
      <div class="type-card" data-type="${type}" role="button" tabindex="0">
        <div class="type-card-header">${emoji} ${label}</div>
        <div class="type-card-stats">${ts.ok}<span style="color:var(--text-muted);font-size:1rem;font-weight:400;"> / ${total}</span></div>
        <div class="type-card-sub">${ts.fail > 0 ? `${ts.fail} · ` : ''}${total - tried} ${t('stats.notplayed').toLowerCase()}</div>
        <div style="margin-top:0.75rem;height:6px;background:var(--bg-surface);border-radius:999px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:var(--success);border-radius:999px;"></div>
        </div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.4rem;text-align:right;">${t('stats.see')}</div>
      </div>`;
  },

  _typeDetailHtml(type, mastery) {
    const t = this._t.bind(this);
    const typeLabels = {
      flag:    { emoji: '🏁', label: t('stats.flags') },
      capital: { emoji: '🏛️', label: t('stats.capitals') },
      map:     { emoji: '📍', label: t('stats.map') }
    };
    const tl = typeLabels[type];
    const all = GL.COUNTRIES.map(co => {
      const m = mastery[co.code];
      const val = m && m[type] !== undefined ? m[type] : -1;
      return { co, val };
    }).filter(x => x.val !== -1);
    if (all.length === 0) return `<p style="color:var(--text-muted);padding:1rem 0;">${t('stats.nodata')}</p>`;
    const failed = all.filter(x => x.val === 0);
    const succeeded = all.filter(x => x.val >= 1);
    const makeList = (items) => `
      <div class="country-progress-list" style="margin-bottom:1rem;">
        ${items.map(({ co, val }) => `
          <div class="country-progress-item country-clickable" data-code="${co.code}">
            <span class="fi fi-${co.code}" style="width:24px;height:16px;background-size:cover;border-radius:2px;display:inline-block;flex-shrink:0;"></span>
            <span style="flex:1;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._n(co)}</span>
            ${GL.UI.continentBadge(co.continent, co.continentFr)}
          </div>`).join('')}
      </div>`;
    return `
      <div class="continent-detail-header">
        <span>${tl.emoji}</span><span>${tl.label}</span>
        <span style="color:var(--text-muted);font-size:0.85rem;font-weight:400;">${all.length} ${t('home.stat.countries').toLowerCase()}</span>
      </div>
      ${failed.length > 0 ? `<div style="font-size:0.8rem;font-weight:600;color:var(--error);margin-bottom:0.5rem;">${t('stats.failed.label').replace('{n}', failed.length)}</div>${makeList(failed)}` : ''}
      ${succeeded.length > 0 ? `<div style="font-size:0.8rem;font-weight:600;color:var(--success);margin-bottom:0.5rem;">${t('stats.success.label').replace('{n}', succeeded.length)}</div>${makeList(succeeded)}` : ''}`;
  },

  _bindCountryClicks(panel) {
    panel.querySelectorAll('.country-clickable[data-code]').forEach(el => {
      el.addEventListener('click', () => {
        const country = GL.COUNTRIES.find(c => c.code === el.dataset.code);
        if (country) GL.FlagList.showModal(country);
      });
    });
  },

  renderStats(container) {
    const t = this._t.bind(this);
    const stats = GL.UI.getStats();
    const total = stats.totalQuestions || 0;
    const correct = stats.totalCorrect || 0;
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;
    const mastery = stats.mastery || {};

    const discovered = stats.discovered || {};
    const continentData = GL.CONTINENTS.map(c => {
      const countries = GL.COUNTRIES.filter(co => co.continent === c);
      const maxTotal = countries.length * 3;
      let cTotal = 0, cCorrect = 0;
      countries.forEach(co => {
        const s = stats.countriesStats[co.code];
        if (s) cTotal += s.q;
        const d = discovered[co.code] || {};
        cCorrect += (d.flag ? 1 : 0) + (d.capital ? 1 : 0) + (d.map ? 1 : 0);
      });
      return {
        continent: c, continentFr: GL.CONTINENTS_FR[c],
        total: cTotal, correct: cCorrect, maxTotal,
        pct: Math.round(cCorrect / maxTotal * 100),
        countries
      };
    });

    const typeStats = { flag: { ok: 0, fail: 0 }, capital: { ok: 0, fail: 0 }, map: { ok: 0, fail: 0 } };
    GL.COUNTRIES.forEach(co => {
      const m = mastery[co.code];
      if (!m) return;
      ['flag', 'capital', 'map'].forEach(type => {
        if (m[type] !== undefined) { m[type] >= 1 ? typeStats[type].ok++ : typeStats[type].fail++; }
      });
    });

    const hardCountries = Object.entries(stats.countriesStats || {})
      .filter(([, s]) => s.q >= 3)
      .map(([code, s]) => ({ code, pct: Math.round(s.c / s.q * 100), q: s.q }))
      .filter(h => h.pct < 100)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 10);

    container.innerHTML = `
      <div class="page">
        <div class="page-title">${t('stats.title')}</div>
        <p class="page-subtitle">${t('stats.subtitle')}</p>

        ${this._rankCardHtml(stats)}

        <div class="stats-grid stats-grid-5">
          <div class="stat-card">
            <div class="stat-card-number">${pct}%</div>
            <div class="stat-card-label">${t('stats.success')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-number">${stats.maxStreak || 0} 🔥</div>
            <div class="stat-card-label">${t('stats.streak')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-number">${(stats.quizHistory || []).length}</div>
            <div class="stat-card-label">${t('stats.quizzes')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-number">${total}</div>
            <div class="stat-card-label">${t('stats.questions')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-number">${Object.keys(stats.countriesStats || {}).length}</div>
            <div class="stat-card-label">${t('stats.countries')}</div>
          </div>
        </div>

        <div class="stats-section">
          <h3 class="stats-section-title">${t('stats.continents.title')}</h3>
          <p class="stats-section-hint">${t('stats.continents.hint')}</p>
          <div class="continent-cards-grid">
            ${continentData.map(c => this._continentCardHtml(c)).join('')}
          </div>
          <div class="continent-detail-panel" id="continentDetailPanel" style="display:none;"></div>
        </div>

        <div class="stats-section">
          <h3 class="stats-section-title">${t('stats.type.title')} <span class="info-tooltip" data-tooltip="${t('stats.type.info')}">ℹ️</span></h3>
          <p class="stats-section-hint">${t('stats.type.hint')}</p>
          <div class="type-cards-grid">
            ${this._typeCardHtml('flag', '🏁', t('stats.flags'), typeStats.flag)}
            ${this._typeCardHtml('capital', '🏛️', t('stats.capitals'), typeStats.capital)}
            ${this._typeCardHtml('map', '📍', t('stats.map'), typeStats.map)}
          </div>
          <div class="continent-detail-panel" id="typeDetailPanel" style="display:none;"></div>
        </div>

        ${hardCountries.length > 0 ? `
          <div class="hard-countries">
            <h3 class="stats-section-title">${t('stats.hard.title')} <span class="info-tooltip" data-tooltip="${t('stats.hard.info')}">ℹ️</span></h3>
            <p class="stats-section-hint">${t('stats.hard.hint')}</p>
            <div class="hard-country-list">
              ${hardCountries.map(h => {
                const country = GL.COUNTRIES.find(c => c.code === h.code);
                if (!country) return '';
                return `<div class="hard-country-entry">
                  <div class="hard-country-item" data-code="${country.code}">
                    <span class="fi fi-${country.code}" style="width:36px;height:24px;background-size:cover;border-radius:2px;display:inline-block;flex-shrink:0;"></span>
                    <span style="font-size:0.875rem;font-weight:600;">${this._n(country)}</span>
                    <span style="font-size:0.8rem;color:var(--text-muted);">(${this._cap(country)})</span>
                    ${GL.UI.continentBadge(country.continent, country.continentFr)}
                    <div style="margin-left:auto;text-align:right;flex-shrink:0;line-height:1.3;">
                      <div class="hard-country-pct">${h.pct}%</div>
                      <div style="font-size:0.65rem;color:var(--text-muted);white-space:nowrap;">${t('stats.hard.rate')}</div>
                    </div>
                    <span class="hard-country-chevron">▸</span>
                  </div>
                  <div class="hard-country-detail" id="hard-detail-${country.code}" style="display:none;"></div>
                </div>`;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${(stats.quizHistory || []).length > 0 ? `
          <div>
            <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:1rem;">${t('stats.history.title')}</h3>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              ${stats.quizHistory.slice(0, 15).map(h => {
                const p = Math.round(h.score / h.total * 100);
                const typeLabels = {
                  flags: `🏁 ${t('feat.quizflags.title')}`,
                  capitals: `🏛️ ${t('feat.quizcap.title')}`,
                  map: `📍 ${t('feat.quizmap.title')}`,
                  nightmare: `💀 ${t('feat.nightmare.title')}`
                };
                const contLabel = h.continent && h.continent !== 'all'
                  ? this._cont(h.continent)
                  : t('stats.world');
                const date = new Date(h.date).toLocaleDateString(GL.I18N.lang === 'en' ? 'en-GB' : 'fr-FR', { day: '2-digit', month: '2-digit' });
                return `<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:0.75rem 1rem;display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;font-size:0.875rem;">
                  <span style="font-weight:600;">${typeLabels[h.type] || h.type}</span>
                  <span style="color:var(--text-muted);">${contLabel}</span>
                  <span style="color:var(--accent-light);font-weight:700;">${p}%</span>
                  <span style="color:var(--text-muted);">${h.score}/${h.total}</span>
                  <span style="color:${p >= 70 ? 'var(--success)' : p >= 50 ? 'var(--warning)' : 'var(--error)'};">${GL.UI.starsForScore(p)}</span>
                  <span style="margin-left:auto;color:var(--text-muted);">${date}</span>
                </div>`;
              }).join('')}
            </div>
          </div>
        ` : total === 0 ? `
          <div style="text-align:center;padding:3rem;color:var(--text-muted);">
            <div style="font-size:3rem;margin-bottom:1rem;">📊</div>
            <p>${t('stats.none')}</p>
            <p style="margin-top:0.5rem;">${t('stats.none.sub')}</p>
            <a href="#/quiz/drapeaux" class="btn btn-primary" style="margin-top:1rem;display:inline-flex;">${t('stats.start')}</a>
          </div>` : ''}

      </div>
    `;

    // Continent card clicks
    container.querySelectorAll('[data-continent]').forEach(card => {
      card.addEventListener('click', () => {
        const cKey = card.dataset.continent;
        const data = continentData.find(d => d.continent === cKey);
        const panel = container.querySelector('#continentDetailPanel');
        const isActive = card.classList.contains('active');
        container.querySelectorAll('[data-continent]').forEach(c => c.classList.remove('active'));
        if (isActive) { panel.style.display = 'none'; return; }
        card.classList.add('active');
        panel.style.display = 'block';
        panel.innerHTML = this._continentDetailHtml(data, mastery);
        this._bindCountryClicks(panel);
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    // Hard country clicks
    container.querySelectorAll('.hard-country-item[data-code]').forEach(item => {
      item.addEventListener('click', () => {
        const code = item.dataset.code;
        const detail = container.querySelector(`#hard-detail-${code}`);
        const chevron = item.querySelector('.hard-country-chevron');
        const isOpen = detail.style.display !== 'none';
        container.querySelectorAll('.hard-country-detail').forEach(d => { d.style.display = 'none'; });
        container.querySelectorAll('.hard-country-chevron').forEach(c => { c.textContent = '▸'; });
        if (!isOpen) {
          detail.style.display = 'block';
          chevron.textContent = '▾';
          const m = mastery[code] || {};
          const types = [
            { key: 'flag',    emoji: '🏁', label: t('stats.flags') },
            { key: 'capital', emoji: '🏛️', label: t('stats.capitals') },
            { key: 'map',     emoji: '📍', label: t('stats.map') },
          ];
          detail.innerHTML = `<div class="hard-country-detail-inner">
            <div class="hard-detail-legend">
              ${t('stats.mastery.legend')} &nbsp;—&nbsp;
              <span style="color:var(--error);">○○○</span> ${t('stats.mastery.todo')} &nbsp;
              <span style="color:#f59e0b;">●○○</span> ${t('stats.mastery.started')} &nbsp;
              <span style="color:var(--success);">●●○</span> ${t('stats.mastery.progress')} &nbsp;
              <span style="color:var(--success);">●●●</span> ${t('stats.mastery.done')}
            </div>
            ${types.map(tp => {
              const val = m[tp.key];
              const dots = val === undefined ? '—' : '●'.repeat(val) + '○'.repeat(3 - val);
              const color = val === undefined ? 'var(--text-muted)' : val >= 2 ? 'var(--success)' : val === 1 ? '#f59e0b' : 'var(--error)';
              const statusLabel = val === undefined ? t('stats.mastery.unplayed') : val === 3 ? t('stats.mastery.done') : val === 0 ? t('stats.mastery.todo') : t('stats.mastery.level').replace('{n}', val);
              return `<div class="hard-detail-type">
                <span style="width:90px;flex-shrink:0;">${tp.emoji} ${tp.label}</span>
                <span style="color:${color};font-weight:700;letter-spacing:3px;">${dots}</span>
                <span style="color:${color};font-size:0.73rem;">${statusLabel}</span>
              </div>`;
            }).join('')}
          </div>`;
        }
      });
    });

    // Type card clicks
    container.querySelectorAll('[data-type]').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        const panel = container.querySelector('#typeDetailPanel');
        const isActive = card.classList.contains('active');
        container.querySelectorAll('[data-type]').forEach(c => c.classList.remove('active'));
        if (isActive) { panel.style.display = 'none'; return; }
        card.classList.add('active');
        panel.style.display = 'block';
        panel.innerHTML = this._typeDetailHtml(type, mastery);
        this._bindCountryClicks(panel);
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

  }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  GL.App.init();
});
