window.GL = window.GL || {};

GL.QuizMap = {
  session: null,
  mapReady: false,
  pendingClick: false,

  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },
  _n(country) { return GL.I18N ? GL.I18N.name(country) : country.nameFr; },

  render(container) {
    GL.WorldMap.cleanup();
    const t = this._t.bind(this);
    container.innerHTML = `
      <div class="page">
        <div class="quiz-setup">
          <div class="quiz-setup-title">${t('quiz.map.title')}</div>
          <p class="quiz-setup-subtitle">${t('quiz.map.subtitle')}</p>

          <div class="setup-section">
            <div class="setup-section-label">${t('setup.qtype')}</div>
            <div class="qtype-cards">
              <div class="qtype-card selected" data-qtype="name">
                <div class="qtype-card-icon">📝</div>
                <div class="qtype-card-name">${t('quiz.map.qtype.name')}</div>
              </div>
              <div class="qtype-card" data-qtype="flag">
                <div class="qtype-card-icon">🏁</div>
                <div class="qtype-card-name">${t('quiz.map.qtype.flag')}</div>
              </div>
              <div class="qtype-card" data-qtype="both">
                <div class="qtype-card-icon">🎲</div>
                <div class="qtype-card-name">${t('quiz.map.qtype.both')}</div>
              </div>
            </div>
          </div>

          <div class="setup-section">
            <div class="setup-section-label">${t('setup.continent')}</div>
            ${GL.UI.continentTabsHtml('all')}
          </div>

          <div class="setup-section">
            <div class="setup-section-label">${t('setup.count')}</div>
            <div class="count-selector">
              <button class="count-btn selected" data-count="10">10</button>
              <button class="count-btn" data-count="20">20</button>
              <button class="count-btn" data-count="30">30</button>
            </div>
          </div>

          <div class="setup-section">
            <div class="setup-section-label">${t('setup.mode')}</div>
            <div class="mode-selector">
              <div class="mode-card selected" data-mode="normal">
                <div class="mode-card-icon">🎮</div>
                <div class="mode-card-name">${t('setup.mode.normal')}</div>
                <div class="mode-card-desc">${t('setup.mode.normal.desc.map')}</div>
              </div>
              <div class="mode-card" data-mode="ranked">
                <div class="mode-card-icon">🏆</div>
                <div class="mode-card-name">${t('setup.mode.ranked')}</div>
                <div class="mode-card-desc">${t('setup.mode.ranked.desc.map')}</div>
              </div>
            </div>
          </div>

          <div style="margin-top:2rem;">
            <button class="btn btn-primary btn-lg" id="startMapQuizBtn" style="width:100%;">
              ${t('setup.start.map')}
            </button>
          </div>
        </div>
      </div>
    `;

    this._setupConfig = { questionType: 'name', continent: 'all', count: 10, ranked: false };
    this.bindSetupEvents(container);
  },

  bindSetupEvents(container) {
    const cfg = this._setupConfig;

    container.querySelectorAll('.qtype-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.qtype-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        cfg.questionType = card.dataset.qtype;
      });
    });

    container.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        cfg.continent = tab.dataset.c;
      });
    });

    container.querySelectorAll('.count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.count-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        cfg.count = parseInt(btn.dataset.count);
      });
    });

    container.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        cfg.ranked = card.dataset.mode === 'ranked';
      });
    });

    container.querySelector('#startMapQuizBtn').addEventListener('click', async () => {
      const btn = container.querySelector('#startMapQuizBtn');
      btn.disabled = true;
      btn.textContent = this._t('quiz.loading.map');

      await this.prepareMapData();

      let pool = GL.COUNTRIES.filter(c => c.numeric > 0 && GL.WorldMap.getVisibleCodes().has(c.numeric));
      if (cfg.continent !== 'all') {
        pool = pool.filter(c => c.continent === cfg.continent);
      }

      if (pool.length < 4) {
        GL.UI.toast(this._t('quiz.err.notenough.map'), 'error');
        btn.disabled = false;
        btn.textContent = this._t('setup.start.map');
        return;
      }

      const selected = GL.QuizEngine.pickRandom(pool, Math.min(cfg.count, pool.length));
      const questions = selected.map(c => GL.QuizEngine.genMapQuestion(c, cfg.questionType));

      this.session = {
        questions,
        config: cfg,
        currentIndex: 0,
        score: 0,
        streak: 0,
        maxStreak: 0,
        wrongAnswers: [],
        peakBefore: GL.UI.getStats().rankedXP || 0,
        discoveredBefore: GL.UI.computeDiscovered(GL.UI.getStats())
      };

      this.renderQuiz(container);
    });
  },

  async prepareMapData() {
    if (GL.WorldMap.worldData && GL.WorldMap.getVisibleCodes().size > 0) return;
    try {
      if (!GL.WorldMap.worldData) {
        GL.WorldMap.worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
      }
      const countries = topojson.feature(GL.WorldMap.worldData, GL.WorldMap.worldData.objects.countries);
      GL.WorldMap.visibleCodes = new Set(countries.features.map(f => +f.id));
      GL.WorldMap.buildNumericMap();
      Object.keys(GL.WorldMap.tinyCountriesCoords).forEach(numId => {
        GL.WorldMap.visibleCodes.add(+numId);
      });
    } catch(e) {
      console.error('Map load error:', e);
    }
  },

  async renderQuiz(container) {
    const { session } = this;
    if (session.currentIndex >= session.questions.length) {
      this.renderResults(container);
      return;
    }

    const q = session.questions[session.currentIndex];
    const t = this._t.bind(this);
    const pct = Math.round(session.currentIndex / session.questions.length * 100);
    const score = session.score;
    const scoreLabel = score === 1 ? t('quiz.correct') : t('quiz.corrects');

    container.innerHTML = `
      <div class="page" style="max-width:100%;padding:1rem 1.5rem;">
        <div style="max-width:var(--max-width);margin:0 auto;">
          <div class="quiz-map-header">
            <div class="quiz-progress-wrap" style="flex:1;">
              <div class="quiz-progress-text">
                <span>${t('quiz.q')} ${session.currentIndex + 1} / ${session.questions.length}</span>
                <span>${score} ${scoreLabel}</span>
              </div>
              <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width:${pct}%"></div>
              </div>
            </div>
            <div class="quiz-score-wrap" style="margin-left:1rem;">
              <div class="quiz-score-badge">✓ ${score}</div>
              <div class="quiz-streak-badge ${session.streak < 2 ? 'hidden' : ''}" id="streakBadge">🔥 ${session.streak}</div>
              ${session.config.ranked ? `<div class="ranked-indicator">${t('quiz.ranked')}</div>` : ''}
            </div>
          </div>

          <div class="quiz-map-question-bar">
            <div class="quiz-map-prompt">
              <div>
                <div class="quiz-map-prompt-label">${q.label}</div>
                ${q.showAs === 'flag'
                  ? `<span class="fi fi-${q.country.code}" style="width:72px;height:48px;background-size:cover;border-radius:4px;display:inline-block;box-shadow:var(--shadow-sm);"></span>`
                  : `<div class="quiz-map-prompt-value">${this._n(q.country)}</div>`
                }
              </div>
            </div>
            <div id="mapFeedback" class="quiz-map-feedback empty">${t('quiz.map.click')}</div>
          </div>

          <div class="map-wrapper" id="quizMapWrapper" style="margin-top:0.75rem;cursor:crosshair;">
            <div class="map-loading">
              <span class="map-loading-spinner">🌍</span> ${t('quiz.map.loading')}
            </div>
          </div>
        </div>
      </div>
    `;

    const mapWrapper = container.querySelector('#quizMapWrapper');
    await this.renderMapInWrapper(mapWrapper, q, container);
  },

  async renderMapInWrapper(mapWrapper, q, container) {
    const { session } = this;
    const t = this._t.bind(this);

    GL.WorldMap.cleanup();

    try {
      if (!GL.WorldMap.worldData) {
        GL.WorldMap.worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
      }
      GL.WorldMap.buildNumericMap();
      GL.WorldMap._quizMode = true;
      GL.WorldMap._onCountryClick = null;
      GL.WorldMap.currentFilter = session.config.continent;

      GL.WorldMap.renderMap(mapWrapper);

      if (session.config.continent !== 'all') {
        GL.WorldMap.zoomToContinent(session.config.continent);
      }

      let answered = false;

      GL.WorldMap._onCountryClick = (clickedCountry, numericId) => {
        if (answered) return;
        answered = true;

        const isCorrect = clickedCountry.code === q.country.code;
        const feedback = container.querySelector('#mapFeedback');

        if (isCorrect) {
          GL.WorldMap.highlightCountry(numericId, 'correct');
          if (feedback) {
            feedback.textContent = this._t('quiz.feedback.correct');
            feedback.className = 'quiz-map-feedback correct';
          }
          this.handleMapAnswer(true, q, container);
        } else {
          GL.WorldMap.highlightCountry(numericId, 'wrong');
          if (q.country.numeric) {
            GL.WorldMap.highlightCountry(q.country.numeric, 'target');
            GL.WorldMap.zoomToCountryQuiz(q.country);
          }
          if (feedback) {
            feedback.textContent = `✕ ${this._n(q.country)}`;
            feedback.className = 'quiz-map-feedback wrong';
          }
          this.handleMapAnswer(false, q, container);
        }
      };
    } catch(e) {
      mapWrapper.innerHTML = `<div class="map-loading">${t('quiz.map.nomap')}</div>`;
    }
  },

  handleMapAnswer(isCorrect, q, container) {
    const { session } = this;
    const t = this._t.bind(this);

    GL.Audio[isCorrect ? 'playCorrect' : 'playWrong']();

    const masteryType = session.config.ranked ? 'map' : null;
    if (isCorrect) {
      session.score++;
      session.streak++;
      if (session.streak > session.maxStreak) session.maxStreak = session.streak;
      GL.UI.recordAnswer(q.country.code, true, masteryType);
    } else {
      session.streak = 0;
      session.wrongAnswers.push({ question: q });
      GL.UI.recordAnswer(q.country.code, false, masteryType);
    }

    const sb = container.querySelector('#streakBadge');
    if (sb) {
      if (session.streak >= 2) {
        sb.textContent = `🔥 ${session.streak}`;
        sb.classList.remove('hidden');
        sb.classList.add('streak-animate');
        setTimeout(() => sb.classList.remove('streak-animate'), 300);
      } else {
        sb.classList.add('hidden');
      }
    }

    const delay = isCorrect ? 1500 : 2000;
    const qBar = container.querySelector('.quiz-map-question-bar');
    if (qBar) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-primary';
      nextBtn.style.cssText = 'margin-top:0.75rem;width:100%;';
      nextBtn.textContent = session.currentIndex + 1 >= session.questions.length
        ? t('result.results')
        : t('result.nextq');
      qBar.after(nextBtn);

      let advanced = false;
      const advance = () => {
        if (advanced) return;
        advanced = true;
        GL._onRouteLeave = null;
        clearTimeout(autoTimer);
        session.currentIndex++;
        GL.WorldMap.cleanup();
        this.renderQuiz(container);
      };
      const autoTimer = setTimeout(advance, delay);
      GL._onRouteLeave = () => { advanced = true; clearTimeout(autoTimer); };
      nextBtn.addEventListener('click', advance);
    }
  },

  renderResults(container) {
    const { session } = this;
    const t = this._t.bind(this);
    const total = session.questions.length;
    const pct = Math.round(session.score / total * 100);
    const stars = GL.UI.starsForScore(pct);
    const resultTitle = pct >= 70 ? t('result.great') : pct >= 50 ? t('result.ok') : t('result.keep');

    GL.WorldMap.cleanup();
    if (session.config.ranked) {
      GL.UI.updateMaxStreak(session.maxStreak);
      GL.UI.saveCurrentStreak(session.streak);
      GL.UI.recordQuizResult('map', session.score, total, session.config.continent);
    }

    const contLabel = session.config.continent === 'all'
      ? t('cont.world')
      : (GL.I18N ? GL.I18N.cont(session.config.continent) : (GL.CONTINENTS_FR[session.config.continent] || session.config.continent));

    let rankData = null;
    if (session.config.ranked) {
      const peakBefore = session.peakBefore || 0;
      const discoveredBefore = session.discoveredBefore || 0;
      const statsAfter = GL.UI.getStats();
      const peakAfter = statsAfter.rankedXP || 0;
      const discoveredAfter = GL.UI.computeDiscovered(statsAfter);
      const gained = peakAfter - peakBefore;
      const { tier, tierIndex, next } = GL.UI.getRankInfo(peakAfter, discoveredAfter);
      const prevInfo = GL.UI.getRankInfo(peakBefore, discoveredBefore);
      const rankUp = tierIndex > prevInfo.tierIndex;
      const TOTAL = GL.UI.RANK_XP_MAX;
      const tierEnd = next ? next.min - 1 : TOTAL;
      const tierRange = tierEnd - tier.min;
      const beforePct = tierRange > 0 ? Math.min(100, Math.round(Math.max(0, peakBefore - tier.min) / tierRange * 100)) : 100;
      const afterPct  = tierRange > 0 ? Math.min(100, Math.round(Math.max(0, peakAfter  - tier.min) / tierRange * 100)) : 100;
      rankData = { tier, next, gained, rankUp, beforePct, afterPct, discoveredBefore, discoveredAfter, peakBefore, peakAfter };
    }

    const rankHtml = rankData ? GL.QuizFlags._rankCardHtml(rankData, t) : '';

    container.innerHTML = `
      <div class="page">
        <div class="results-container">
          <div class="results-stars">${stars}</div>
          <div class="results-title">${resultTitle}</div>
          <div class="results-subtitle">${session.config.ranked ? t('quiz.ranked') + ' · ' : ''}${t('quiz.map.title')} · ${contLabel}</div>
          <div class="results-score-big">${pct}%</div>
          <div class="results-stats-row">
            <div class="results-stat" style="border-color:var(--success)">
              <div class="results-stat-num" style="color:var(--success)">${session.score}/${total}</div>
              <div class="results-stat-label">${t('result.correct')}</div>
            </div>
            <div class="results-stat" style="border-color:var(--warning)">
              <div class="results-stat-num" style="color:var(--warning)">${session.maxStreak}</div>
              <div class="results-stat-label">${t('result.streak')}</div>
            </div>
          </div>

          ${rankHtml}

          ${session.wrongAnswers.length > 0 ? `
            <div class="wrong-answers">
              <div class="wrong-answers-title">${t('result.missed').replace('{n}', session.wrongAnswers.length)}</div>
              ${session.wrongAnswers.map(w => `
                <div class="wrong-answer-item">
                  <span class="fi fi-${w.question.country.code}" style="width:36px;height:24px;background-size:cover;border-radius:2px;display:inline-block;flex-shrink:0;"></span>
                  <span style="flex:1;font-size:0.875rem;font-weight:600;">${this._n(w.question.country)}</span>
                  <span style="color:var(--text-muted);font-size:0.8rem;">${GL.I18N ? GL.I18N.cont(w.question.country.continent) : w.question.country.continentFr}</span>
                </div>
              `).join('')}
            </div>
          ` : `<div style="padding:1rem 1.25rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-secondary);font-weight:600;margin:1.5rem 0;text-align:center;">
            ${t('result.perfect.map')}
          </div>`}

          <div class="results-buttons">
            <button class="btn btn-primary" id="retryMapBtn">${t('result.retry')}</button>
          </div>
        </div>
      </div>
    `;

    if (rankData) GL.UI.animateRankBar(container, rankData);
    if (rankData && rankData.rankUp && GL.RankBadges) {
      const rank = GL.RankBadges.RANKS.find(r => r.key === rankData.tier.key) || GL.RankBadges.RANKS[0];
      setTimeout(() => GL.RankBadges._triggerLevelUp(rank), 2000);
    }

    container.querySelector('#retryMapBtn').addEventListener('click', () => {
      GL.QuizMap.render(container);
    });
  }
};
