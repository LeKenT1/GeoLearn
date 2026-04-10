window.GL = window.GL || {};

GL.QuizUltimate = {
  session: null,
  keyHandler: null,

  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },
  _n(country) { return GL.I18N ? GL.I18N.name(country) : country.nameFr; },
  _cap(country) { return GL.I18N ? GL.I18N.capital(country) : country.capitalFr; },

  render(container) {
    this.cleanup();
    GL.WorldMap.cleanup();
    const t = this._t.bind(this);

    container.innerHTML = `
      <div class="page">
        <div class="quiz-setup ultimate-mode" style="max-width:480px;display:flex;flex-direction:column;align-items:center;">
          <span class="ultimate-crown">👑</span>
          <div class="ultimate-setup-title">${t('quiz.ultimate.title')}</div>
          <p class="quiz-setup-subtitle" style="text-align:center;max-width:420px;margin:0.5rem auto 1.5rem;">${t('quiz.ultimate.subtitle')}</p>

          <div class="ultimate-country-count-badge" id="ultimateCountBadge">
            👑 <span id="ultimateCountNum">…</span> ${t('quiz.ultimate.countries')}
          </div>

          <div style="margin-top:2rem;width:100%;">
            <button class="btn btn-lg btn-ultimate" id="startUltimateBtn" style="width:100%;font-size:1.1rem;padding:1rem 1.5rem;">
              ${t('quiz.ultimate.start')}
            </button>
          </div>
          <p style="text-align:center;font-size:0.75rem;color:var(--text-muted);margin-top:0.75rem;width:100%;">
            🏆 ${t('quiz.ultimate.ranked.note')}
          </p>
        </div>
      </div>
    `;

    this._bindSetupEvents(container);
  },

  _getPool() {
    return GL.COUNTRIES.filter(c => c.numeric > 0 && GL.WorldMap.getVisibleCodes().has(c.numeric));
  },

  _bindSetupEvents(container) {
    this._prepareMapData().then(() => {
      const badge = container.querySelector('#ultimateCountNum');
      if (badge) badge.textContent = this._getPool().length;
    });

    container.querySelector('#startUltimateBtn').addEventListener('click', async () => {
      const btn = container.querySelector('#startUltimateBtn');
      btn.disabled = true;
      btn.textContent = this._t('quiz.loading.map');

      await this._prepareMapData();

      const pool = this._getPool();

      if (pool.length < 4) {
        GL.UI.toast(this._t('quiz.err.notenough'), 'error');
        btn.disabled = false;
        btn.innerHTML = `✨ ${this._t('quiz.ultimate.start')}`;
        return;
      }

      const selected = GL.QuizEngine.pickRandom(pool, pool.length);
      const questions = selected.map(country => ({ country, stepResults: [null, null, null] }));

      const peakBefore = GL.UI.getStats().rankedXP || 0;
      const discoveredBefore = GL.UI.computeDiscovered(GL.UI.getStats());
      this.session = {
        questions,
        currentIndex: 0,
        score: 0,
        maxScore: questions.length * 3,
        streak: (GL.UI ? GL.UI.getStats().currentStreak : 0) || 0,
        maxStreak: 0,
        wrongAnswers: [],
        startTime: Date.now(),
        peakBefore,
        discoveredBefore
      };

      this._renderQuestion(container);
    });
  },

  async _prepareMapData() {
    if (GL.WorldMap.worldData && GL.WorldMap.getVisibleCodes().size > 0) return;
    try {
      if (!GL.WorldMap.worldData) {
        GL.WorldMap.worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
      }
      const countries = topojson.feature(GL.WorldMap.worldData, GL.WorldMap.worldData.objects.countries);
      GL.WorldMap.visibleCodes = new Set(countries.features.map(f => +f.id));
      GL.WorldMap.buildNumericMap();
    } catch(e) {
      console.error('Ultimate map load error:', e);
    }
  },

  _renderQuestion(container) {
    const { session } = this;
    if (session.currentIndex >= session.questions.length) {
      this._renderResults(container);
      return;
    }

    const q = session.questions[session.currentIndex];
    const currentStep = q.stepResults.findIndex(r => r === null);
    if (currentStep === -1) {
      this._showCountrySummary(container, q);
      return;
    }

    this._renderStep(container, q, currentStep);
  },

  _renderStep(container, q, step) {
    const { session } = this;
    const t = this._t.bind(this);
    const pct = Math.round(session.currentIndex / session.questions.length * 100);
    const stepLabels = [t('nightmare.step.name'), t('nightmare.step.capital'), t('nightmare.step.map')];
    const stepIcons = ['✏️', '🏛️', '🗺️'];
    const stepReveal = [this._n(q.country), this._cap(q.country), null];
    const getStepLabel = (i) => (i < step && stepReveal[i]) ? stepReveal[i] : stepLabels[i];
    const isMapStep = step === 2;

    if (isMapStep) {
      container.innerHTML = `
        <div class="page page-fullwidth ultimate-mode">
          <div class="quiz-map-header">
            <div class="quiz-progress-wrap" style="flex:1;">
              <div class="quiz-progress-text">
                <span>👑 ${session.currentIndex + 1} / ${session.questions.length}</span>
                <span>${session.score}/${session.maxScore} pts</span>
              </div>
              <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width:${pct}%"></div>
              </div>
            </div>
            <div class="quiz-score-wrap" style="margin-left:1rem;">
              <div class="quiz-score-badge">✓ ${session.score}</div>
              <div class="quiz-streak-badge ${session.streak < 2 ? 'hidden' : ''}" id="streakBadge">🔥 ${session.streak}</div>
              <div class="ranked-indicator">${t('quiz.ranked')}</div>
            </div>
          </div>

          <div class="nightmare-steps nightmare-steps--map">
            ${[0,1,2].map(i => `
              <div class="nightmare-step ${i < step ? (q.stepResults[i] ? 'done-correct' : 'done-wrong') : i === step ? 'active' : 'pending'}">
                <span class="nightmare-step-icon">${stepIcons[i]}</span>
                <span class="nightmare-step-label">${getStepLabel(i)}</span>
              </div>
            `).join('')}
          </div>

          <div class="quiz-map-question-bar" id="ultimateMapBar">
            <div></div>
            <div class="quiz-map-prompt">
              <div>
                <div class="quiz-map-prompt-label">${t('nightmare.map.click')}</div>
                <span class="fi fi-${q.country.code}" style="width:72px;height:48px;background-size:cover;border-radius:6px;box-shadow:var(--shadow-md);display:inline-block;margin-top:0.25rem;"></span>
              </div>
            </div>
            <div id="mapFeedback" class="quiz-map-feedback empty">${t('nightmare.map.clickprompt')}</div>
          </div>

          <div class="map-wrapper" id="ultimateMapWrapper" style="cursor:crosshair;">
            <div class="map-loading"><span class="map-loading-spinner">🌍</span> ${t('quiz.map.loading')}</div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="page ultimate-mode">
          <div class="quiz-container">
            <div class="quiz-header">
              <div class="quiz-progress-wrap">
                <div class="quiz-progress-text">
                  <span>👑 ${session.currentIndex + 1} / ${session.questions.length}</span>
                  <span>${session.score}/${session.maxScore} pts</span>
                </div>
                <div class="quiz-progress-bar">
                  <div class="quiz-progress-fill" style="width:${pct}%"></div>
                </div>
              </div>
              <div class="quiz-score-wrap">
                <div class="quiz-score-badge">✓ ${session.score}</div>
                <div class="quiz-streak-badge ${session.streak < 2 ? 'hidden' : ''}" id="streakBadge">🔥 ${session.streak}</div>
                <div class="ranked-indicator" id="rankedIndicator">${t('quiz.ranked')}</div>
              </div>
            </div>

            <div class="nightmare-steps">
              ${[0,1,2].map(i => `
                <div class="nightmare-step ${i < step ? (q.stepResults[i] ? 'done-correct' : 'done-wrong') : i === step ? 'active' : 'pending'}">
                  <span class="nightmare-step-icon">${stepIcons[i]}</span>
                  <span class="nightmare-step-label">${getStepLabel(i)}</span>
                </div>
              `).join('')}
            </div>

            <div class="quiz-question-card" id="questionCard">
              <div class="quiz-question-label">${this._stepPrompt(step)}</div>
              <div class="quiz-flag-container">
                <span class="fi fi-${q.country.code}" style="width:160px;height:107px;background-size:cover;border-radius:8px;box-shadow:var(--shadow-md);display:inline-block;"></span>
              </div>
            </div>

            <div class="quiz-text-form" id="textForm">
              <input type="text" class="quiz-text-input" id="textAnswer"
                placeholder="${step === 0 ? t('quiz.placeholder.country') : t('quiz.placeholder.capital')}"
                autocomplete="off" autocorrect="off" spellcheck="false">
              <div id="textFeedback" class="quiz-hint"></div>
              <div style="display:flex;gap:0.75rem;justify-content:center;">
                <button class="btn btn-ultimate" id="submitTextBtn" style="min-width:120px;">${t('quiz.btn.validate')}</button>
                <button class="btn btn-ghost btn-sm" id="hintBtn" title="${t('quiz.hint.warning')}">${t('quiz.btn.hint')}</button>
              </div>
            </div>
            <div class="keyboard-hints">
              <span class="kbd">Entrée</span>
              <span style="color:var(--text-muted);font-size:0.75rem;margin-left:0.25rem">${t('quiz.hint.enter')}</span>
            </div>
          </div>
        </div>
      `;
    }

    if (!isMapStep) {
      this._bindTextStep(container, q, step);
    } else {
      this._initMapStep(container, q);
    }
  },

  _stepPrompt(step) {
    return [
      this._t('nightmare.prompt.0'),
      this._t('nightmare.prompt.1'),
      this._t('nightmare.prompt.2'),
    ][step];
  },

  _bindTextStep(container, q, step) {
    if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler);

    const t = this._t.bind(this);
    const input = container.querySelector('#textAnswer');
    const feedback = container.querySelector('#textFeedback');
    const submitBtn = container.querySelector('#submitTextBtn');
    const hintBtn = container.querySelector('#hintBtn');
    let answered = false;

    if (input) setTimeout(() => input.focus(), 100);

    const answer = step === 0 ? q.country.nameFr : q.country.capitalFr;
    const answerAlt = step === 0 ? q.country.name : q.country.capital;

    const handleSubmit = () => {
      if (answered) return;
      const val = input ? input.value : '';
      const isCorrect = GL.UI.checkTextAnswer(val, answer, answerAlt);
      answered = true;

      if (input) {
        input.classList.add(isCorrect ? 'correct' : 'wrong');
        input.disabled = true;
      }
      const displayAnswer = (GL.I18N && GL.I18N.lang === 'en') ? answerAlt : answer;
      if (!isCorrect && feedback) {
        feedback.innerHTML = `<span class="quiz-correct-answer">✓ ${displayAnswer}</span>`;
      }

      this._recordStepResult(isCorrect, q, step, container, val);
    };

    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });

    const isEn = GL.I18N && GL.I18N.lang === 'en';
    const nopeMessages = isEn ? [
      '😂 Did you really think so?',
      '👑 This is the Ultimate.',
      '🫵 Figure it out.',
      '💀 No hints. Ever.',
      '🙅 Nope.',
      '😤 We\'re serious here.',
      '🌍 The world shows no mercy.',
      '👁️ You know that you know.',
      '🫠 Seriously?',
      '🤡 A hint… lol.',
    ] : [
      '😂 T\'as cru quoi ?',
      '👑 C\'est l\'Ultime ici.',
      '🫵 Débrouille-toi.',
      '💀 Pas d\'indice. Jamais.',
      '🙅 Non.',
      '😤 On est sérieux là.',
      '🌍 Le monde ne pardonne pas.',
      '👁️ Tu sais que tu sais.',
      '🫠 Vraiment ?',
      '🤡 Un indice… lol.',
    ];
    let nopeIndex = 0;

    if (hintBtn) hintBtn.addEventListener('click', () => {
      if (answered) return;
      const msg = nopeMessages[nopeIndex % nopeMessages.length];
      nopeIndex++;
      if (feedback) feedback.innerHTML = `<span style="color:var(--text-muted);font-style:italic;">${msg}</span>`;
      hintBtn.classList.remove('btn-hint-nope');
      void hintBtn.offsetWidth; // reflow pour relancer l'animation
      hintBtn.classList.add('btn-hint-nope');
      if (input) input.focus();
    });

    this.keyHandler = (e) => {
      if (e.key === 'Enter' && answered) {
        const nextBtn = container.querySelector('#stepNextBtn');
        if (nextBtn) nextBtn.click();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  },

  async _initMapStep(container, q) {
    if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler);

    const mapWrapper = container.querySelector('#ultimateMapWrapper');
    GL.WorldMap.cleanup();

    try {
      if (!GL.WorldMap.worldData) {
        GL.WorldMap.worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
      }
      GL.WorldMap.buildNumericMap();
      GL.WorldMap._quizMode = true;
      GL.WorldMap._onCountryClick = null;
      GL.WorldMap.currentFilter = 'all';

      GL.WorldMap.renderMap(mapWrapper);

      let answered = false;
      GL.WorldMap._onCountryClick = (clickedCountry, numericId) => {
        if (answered) return;
        answered = true;

        const isCorrect = clickedCountry.code === q.country.code;
        const feedback = container.querySelector('#mapFeedback');

        if (isCorrect) {
          GL.WorldMap.highlightCountry(numericId, 'correct');
          if (feedback) { feedback.textContent = this._t('quiz.feedback.correct'); feedback.className = 'quiz-map-feedback correct'; }
        } else {
          GL.WorldMap.highlightCountry(numericId, 'wrong');
          if (q.country.numeric) {
            GL.WorldMap.highlightCountry(q.country.numeric, 'target');
            GL.WorldMap.zoomToCountryQuiz(q.country);
          }
          if (feedback) { feedback.textContent = `✕ ${this._n(q.country)}`; feedback.className = 'quiz-map-feedback wrong'; }
        }

        this._recordStepResult(isCorrect, q, 2, container, '');
      };
    } catch(e) {
      if (mapWrapper) mapWrapper.innerHTML = `<div class="map-loading">${this._t('quiz.map.nomap')}</div>`;
    }
  },

  _recordStepResult(isCorrect, q, step, container, userInput) {
    const { session } = this;
    const t = this._t.bind(this);
    q.stepResults[step] = isCorrect;
    q.stepUserInputs = q.stepUserInputs || [];
    q.stepUserInputs[step] = userInput;

    GL.Audio[isCorrect ? 'playCorrect' : 'playWrong']();

    if (isCorrect) {
      session.score++;
      session.streak++;
      if (session.streak > session.maxStreak) session.maxStreak = session.streak;
    } else {
      session.streak = 0;
      const stepKey = ['nightmare.step.name', 'nightmare.step.capital', 'nightmare.step.map'][step];
      session.wrongAnswers.push({ country: q.country, step: t(stepKey), userInput });
    }

    GL.UI.recordAnswer(q.country.code, isCorrect, ['flag', 'capital', 'map'][step]);

    const streakBadge = container.querySelector('#streakBadge');
    if (streakBadge) {
      if (session.streak >= 2) {
        streakBadge.textContent = `🔥 ${session.streak}`;
        streakBadge.classList.remove('hidden');
        streakBadge.classList.add('streak-animate');
        setTimeout(() => streakBadge.classList.remove('streak-animate'), 300);
      } else {
        streakBadge.classList.add('hidden');
      }
    }

    // Mode Ultime : toute erreur met fin au quiz
    if (!isCorrect) {
      const goToResults = () => {
        GL._onRouteLeave = null;
        clearTimeout(failTimer);
        GL.WorldMap.cleanup();
        this._renderResults(container);
      };
      const failTimer = setTimeout(goToResults, step === 2 ? 2500 : 2000);
      GL._onRouteLeave = () => { clearTimeout(failTimer); };

      if (step !== 2) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'quiz-actions';
        actionsDiv.innerHTML = `<button class="btn btn-ghost btn-sm" id="stepNextBtn">${t('quiz.ultimate.see_results')}</button>`;
        const textForm = container.querySelector('#textForm');
        if (textForm) textForm.after(actionsDiv);
        actionsDiv.querySelector('#stepNextBtn').addEventListener('click', goToResults);
        this.keyHandler = (e) => { if (e.key === 'Enter') goToResults(); };
        document.addEventListener('keydown', this.keyHandler);
      } else {
        const mapBar = container.querySelector('#ultimateMapBar');
        if (mapBar) {
          const actionsDiv = document.createElement('div');
          actionsDiv.className = 'quiz-actions';
          actionsDiv.style.cssText = 'margin-top:0.75rem;';
          actionsDiv.innerHTML = `<button class="btn btn-ghost btn-sm" id="stepNextBtn">${t('quiz.ultimate.see_results')}</button>`;
          mapBar.after(actionsDiv);
          actionsDiv.querySelector('#stepNextBtn').addEventListener('click', goToResults);
          this.keyHandler = (e) => { if (e.key === 'Enter') goToResults(); };
          document.addEventListener('keydown', this.keyHandler);
        }
      }
      return;
    }

    const allDone = q.stepResults.every(r => r !== null);

    if (!allDone) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'quiz-actions';
      actionsDiv.innerHTML = `<button class="btn btn-ultimate" id="stepNextBtn" style="min-width:140px;">${t('result.nextstep')}</button>`;

      const textForm = container.querySelector('#textForm');
      if (textForm) textForm.after(actionsDiv);

      let advanced = false;
      const advance = () => {
        if (advanced) return;
        advanced = true;
        GL._onRouteLeave = null;
        clearTimeout(autoTimer);
        this._renderStep(container, q, step + 1);
      };
      const autoTimer = setTimeout(advance, 2000);
      GL._onRouteLeave = () => { advanced = true; clearTimeout(autoTimer); };
      actionsDiv.querySelector('#stepNextBtn').addEventListener('click', advance);

      this.keyHandler = (e) => { if (e.key === 'Enter') advance(); };
      document.addEventListener('keydown', this.keyHandler);
    } else {
      if (step === 2) {
        const mapBar = container.querySelector('#ultimateMapBar');
        if (mapBar) {
          const actionsDiv = document.createElement('div');
          actionsDiv.className = 'quiz-actions';
          actionsDiv.style.cssText = 'margin-top:0.75rem;';
          const isLast = session.currentIndex + 1 >= session.questions.length;
          actionsDiv.innerHTML = `<button class="btn btn-ultimate" id="stepNextBtn" style="min-width:160px;">${isLast ? t('nightmare.summary.final') : t('nightmare.summary.btn')}</button>`;
          mapBar.after(actionsDiv);

          let advanced = false;
          const advance = () => {
            if (advanced) return;
            advanced = true;
            GL._onRouteLeave = null;
            clearTimeout(autoTimer);
            GL.WorldMap.cleanup();
            this._showCountrySummary(container, q);
          };
          const autoTimer = setTimeout(advance, 2500);
          GL._onRouteLeave = () => { advanced = true; clearTimeout(autoTimer); };
          actionsDiv.querySelector('#stepNextBtn').addEventListener('click', advance);

          this.keyHandler = (e) => { if (e.key === 'Enter') advance(); };
          document.addEventListener('keydown', this.keyHandler);
        }
      }
    }
  },

  _showCountrySummary(container, q) {
    if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler);

    const { session } = this;
    const t = this._t.bind(this);
    const correct = q.stepResults.filter(Boolean).length;
    const allCorrect = correct === 3;
    const stepLabels = [t('nightmare.step.name'), t('nightmare.step.capital'), t('nightmare.step.map.short')];
    const isLast = session.currentIndex + 1 >= session.questions.length;

    const summaryEmoji = correct === 3 ? '🌟' : correct === 2 ? '👍' : correct === 1 ? '😓' : '💀';

    container.innerHTML = `
      <div class="page ultimate-mode">
        <div class="quiz-container">
          <div class="quiz-header">
            <div class="quiz-progress-wrap">
              <div class="quiz-progress-text">
                <span>👑 ${session.currentIndex + 1} / ${session.questions.length}</span>
                <span>${session.score}/${session.maxScore} pts</span>
              </div>
              <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width:${Math.round((session.currentIndex + 1) / session.questions.length * 100)}%"></div>
              </div>
            </div>
            <div class="quiz-score-wrap">
              <div class="quiz-score-badge">✓ ${session.score}</div>
            </div>
          </div>

          <div class="ultimate-country-summary">
            <span class="fi fi-${q.country.code}" style="width:80px;height:53px;background-size:cover;border-radius:6px;box-shadow:var(--shadow-md);display:inline-block;"></span>
            <div class="nightmare-summary-name">${this._n(q.country)}</div>
            <div class="nightmare-summary-capital">🏛️ ${this._cap(q.country)}</div>

            <div class="nightmare-summary-steps">
              ${q.stepResults.map((r, i) => `
                <div class="nightmare-summary-step ${r ? 'correct' : 'wrong'}">
                  ${r ? '✓' : '✕'} ${stepLabels[i]}
                </div>
              `).join('')}
            </div>

            <div class="nightmare-summary-score">
              ${summaryEmoji} ${correct === 3 ? t('nightmare.summary.perfect') : correct === 2 ? t('nightmare.summary.close') : correct === 1 ? t('nightmare.summary.meh') : t('nightmare.summary.fail')}
              &nbsp;${correct}/3
            </div>
          </div>

          <div class="quiz-actions">
            <button class="btn btn-ultimate" id="nextCountryBtn" style="min-width:160px;">
              ${isLast ? t('nightmare.results.btn') : t('nightmare.next')}
            </button>
          </div>
        </div>
      </div>
    `;

    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      GL._onRouteLeave = null;
      clearTimeout(autoTimer);
      session.currentIndex++;
      this._renderQuestion(container);
    };
    const autoTimer = setTimeout(advance, allCorrect ? 2000 : 3500);
    GL._onRouteLeave = () => { advanced = true; clearTimeout(autoTimer); };
    container.querySelector('#nextCountryBtn').addEventListener('click', advance);

    this.keyHandler = (e) => { if (e.key === 'Enter') advance(); };
    document.addEventListener('keydown', this.keyHandler);
  },

  _renderResults(container) {
    const { session } = this;

    // Score parfait → écran de victoire
    if (session.score === session.maxScore) {
      this._renderVictory(container);
      return;
    }

    const t = this._t.bind(this);
    const pct = Math.round(session.score / session.maxScore * 100);
    const stars = GL.UI.starsForScore(pct);

    GL.WorldMap.cleanup();
    GL.UI.updateMaxStreak(session.maxStreak);
    GL.UI.saveCurrentStreak(session.streak);
    GL.UI.recordQuizResult('ultimate', session.score, session.maxScore, 'all');

    const resultTitle = pct >= 90 ? t('quiz.ultimate.result.legend') :
                        pct >= 75 ? t('quiz.ultimate.result.great') :
                        pct >= 50 ? t('quiz.ultimate.result.ok') :
                        pct >= 30 ? t('quiz.ultimate.result.meh') :
                                    t('quiz.ultimate.result.fail');

    const stepLabels = [t('nightmare.step.name.short'), t('nightmare.step.capital.short'), t('nightmare.step.map.short')];

    const peakBefore = session.peakBefore || 0;
    const discoveredBefore = session.discoveredBefore || 0;
    const statsAfter = GL.UI.getStats();
    const peakAfter = statsAfter.rankedXP || 0;
    const discoveredAfter = GL.UI.computeDiscovered(statsAfter);
    const gained = peakAfter - peakBefore;
    const { tier, tierIndex, next } = GL.UI.getRankInfo(peakAfter, discoveredAfter);
    const prevInfo = GL.UI.getRankInfo(peakBefore, discoveredBefore);
    const rankUp = tierIndex > prevInfo.tierIndex;
    const tierEnd = next ? next.min - 1 : GL.UI.RANK_XP_MAX;
    const tierRange = tierEnd - tier.min;
    const beforePct = tierRange > 0 ? Math.min(100, Math.round(Math.max(0, peakBefore - tier.min) / tierRange * 100)) : 100;
    const afterPct  = tierRange > 0 ? Math.min(100, Math.round(Math.max(0, peakAfter  - tier.min) / tierRange * 100)) : 100;
    const rankData = { tier, next, gained, rankUp, beforePct, afterPct, discoveredBefore, discoveredAfter, peakBefore, peakAfter };
    const rankHtml = GL.QuizFlags._rankCardHtml(rankData, t);

    const duration = Math.round((Date.now() - session.startTime) / 60000);

    container.innerHTML = `
      <div class="page ultimate-mode">
        <div class="results-container">

          <div class="ultimate-results-header">
            <div class="ultimate-fireworks">✨ 👑 ✨</div>
            <div class="results-stars">${stars}</div>
            <div class="ultimate-results-score">${pct}%</div>
            <div class="results-title">${resultTitle}</div>
            <div class="results-subtitle">${t('quiz.ranked')} · ${t('quiz.ultimate.title')}</div>
          </div>

          <div class="results-stats-row">
            <div class="results-stat">
              <div class="results-stat-num">${session.score}/${session.maxScore}</div>
              <div class="results-stat-label">${t('result.points')}</div>
            </div>
            <div class="results-stat">
              <div class="results-stat-num">${session.questions.length}</div>
              <div class="results-stat-label">${t('result.countries')}</div>
            </div>
            <div class="results-stat">
              <div class="results-stat-num">${session.maxStreak}</div>
              <div class="results-stat-label">${t('result.streak')}</div>
            </div>
            <div class="results-stat">
              <div class="results-stat-num">${duration} min</div>
              <div class="results-stat-label">${t('quiz.ultimate.result.time')}</div>
            </div>
          </div>

          ${rankHtml}

          <div class="wrong-answers">
            <div class="wrong-answers-title">${t('quiz.ultimate.results.label')}</div>
            ${(() => {
              // Pays joués : ceux qui ont au moins une étape complétée
              const played = session.questions.filter(q => q.stepResults.some(r => r !== null));
              // Séparer : parfaitement réussis (3/3) et celui raté
              const perfect = played.filter(q => q.stepResults.filter(Boolean).length === q.stepResults.filter(r => r !== null).length && q.stepResults.every(r => r === true));
              const failed  = played.filter(q => q.stepResults.some(r => r === false));

              const countryRow = (q, isFailed) => {
                const done = q.stepResults.filter(r => r !== null);
                const correct = q.stepResults.filter(r => r === true).length;
                const borderColor = isFailed ? '#ef4444' : '#22c55e';
                const stepAnswers = [q.country.nameFr, q.country.capitalFr, null];
                const chips = q.stepResults.map((r, i) => {
                  if (r === null) return '';
                  const userIn = q.stepUserInputs && q.stepUserInputs[i];
                  const correctAns = stepAnswers[i];
                  const bg = r ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';
                  const col = r ? '#22c55e' : '#ef4444';
                  const icon = r ? '✓' : '✕';
                  const detail = !r && correctAns
                    ? (userIn ? ` · <s style="opacity:0.7">${userIn}</s> → <b style="color:#22c55e">${correctAns}</b>` : ` · <b style="color:#ef4444">${correctAns}</b>`)
                    : '';
                  return `<span style="font-size:0.72rem;padding:0.18rem 0.5rem;border-radius:4px;font-weight:600;background:${bg};color:${col};white-space:nowrap;">${icon} ${stepLabels[i]}${detail}</span>`;
                }).join('');
                return `
                  <div class="wrong-answer-item" style="flex-direction:column;align-items:stretch;gap:0.3rem;border:1px solid ${borderColor};border-radius:var(--radius-md);padding:0.45rem 0.65rem;margin-bottom:0.4rem;">
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                      <span class="fi fi-${q.country.code}" style="width:30px;height:20px;background-size:cover;border-radius:2px;display:inline-block;flex-shrink:0;"></span>
                      <span style="flex:1;font-size:0.85rem;font-weight:600;">${this._n(q.country)}</span>
                      <span style="font-size:0.75rem;font-weight:700;color:${borderColor};">${correct}/${done.length}</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">${chips}</div>
                  </div>`;
              };

              let html = '';
              if (failed.length) {
                html += `<div style="font-size:0.75rem;font-weight:700;color:#ef4444;margin:0.5rem 0 0.25rem;">💀 ${t('quiz.ultimate.results.fail')}</div>`;
                html += failed.map(q => countryRow(q, true)).join('');
              }
              if (perfect.length) {
                html += `<div style="font-size:0.75rem;font-weight:700;color:#22c55e;margin:0.75rem 0 0.25rem;">✓ ${t('quiz.ultimate.results.ok')} (${perfect.length})</div>`;
                html += perfect.map(q => countryRow(q, false)).join('');
              }
              return html || `<p style="color:var(--text-muted);font-size:0.85rem;">—</p>`;
            })()}
          </div>

          <div class="results-buttons">
            <button class="btn btn-ultimate btn-lg" id="retryUltimateBtn" style="min-width:160px;">${t('result.retry')}</button>
          </div>
        </div>
      </div>
    `;

    GL.UI.animateRankBar(container, rankData);
    if (rankData.rankUp && GL.RankBadges) {
      const rank = GL.RankBadges.RANKS.find(r => r.key === rankData.tier.key) || GL.RankBadges.RANKS[0];
      setTimeout(() => GL.RankBadges._triggerLevelUp(rank), 2000);
    }

    container.querySelector('#retryUltimateBtn').addEventListener('click', () => {
      GL.QuizUltimate.render(container);
    });

    this.cleanup();
  },

  _renderVictory(container) {
    const { session } = this;
    const t = this._t.bind(this);

    GL.WorldMap.cleanup();
    if (!session._preview) {
      GL.UI.updateMaxStreak(session.maxStreak);
      GL.UI.saveCurrentStreak(session.streak || 0);
      GL.UI.recordQuizResult('ultimate', session.score, session.maxScore, 'all');
    }

    const peakBefore = session.peakBefore || 0;
    const discoveredBefore = session.discoveredBefore || 0;
    const statsAfter = GL.UI.getStats();
    const peakAfter = statsAfter.rankedXP || 0;
    const discoveredAfter = GL.UI.computeDiscovered(statsAfter);
    const gained = peakAfter - peakBefore;
    const { tier, tierIndex, next } = GL.UI.getRankInfo(peakAfter, discoveredAfter);
    const prevInfo = GL.UI.getRankInfo(peakBefore, discoveredBefore);
    const rankUp = tierIndex > prevInfo.tierIndex;
    const tierEnd = next ? next.min - 1 : GL.UI.RANK_XP_MAX;
    const tierRange = tierEnd - tier.min;
    const beforePct = tierRange > 0 ? Math.min(100, Math.round(Math.max(0, peakBefore - tier.min) / tierRange * 100)) : 100;
    const afterPct  = tierRange > 0 ? Math.min(100, Math.round(Math.max(0, peakAfter  - tier.min) / tierRange * 100)) : 100;
    const rankData = { tier, next, gained, rankUp, beforePct, afterPct, discoveredBefore, discoveredAfter, peakBefore, peakAfter };
    const rankHtml = GL.QuizFlags._rankCardHtml(rankData, t);

    const duration = Math.round((Date.now() - session.startTime) / 60000);
    const totalCountries = session.questions.length || session.score / 3;

    container.innerHTML = `
      <div class="ultimate-victory-page">
        <div class="ult-victory-crown">👑</div>

        <div class="ult-victory-title">${t('quiz.ultimate.victory.title')}</div>
        <div class="ult-victory-subtitle">${t('quiz.ultimate.victory.subtitle')}</div>

        <div class="ult-victory-score">${session.score}</div>
        <div class="ult-victory-score-label">${t('result.points')}</div>

        <div class="ult-victory-stats">
          <div class="ult-victory-stat">
            <div class="ult-victory-stat-num">${totalCountries}</div>
            <div class="ult-victory-stat-label">${t('result.countries')}</div>
          </div>
          <div class="ult-victory-stat">
            <div class="ult-victory-stat-num">${session.maxStreak}</div>
            <div class="ult-victory-stat-label">${t('result.streak')}</div>
          </div>
          <div class="ult-victory-stat">
            <div class="ult-victory-stat-num">${duration} min</div>
            <div class="ult-victory-stat-label">${t('quiz.ultimate.result.time')}</div>
          </div>
        </div>

        <div class="ult-victory-rank-wrap">
          ${rankHtml}
        </div>

        <div class="ult-victory-btn-wrap">
          <button class="btn btn-ultimate btn-lg" id="retryUltimateBtn" style="min-width:200px;font-size:1rem;">
            ${t('result.retry')}
          </button>
        </div>
      </div>
    `;

    GL.UI.animateRankBar(container, rankData);
    if (rankData.rankUp && GL.RankBadges) {
      const rank = GL.RankBadges.RANKS.find(r => r.key === rankData.tier.key) || GL.RankBadges.RANKS[0];
      setTimeout(() => GL.RankBadges._triggerLevelUp(rank), 2000);
    }

    container.querySelector('#retryUltimateBtn').addEventListener('click', () => {
      GL.QuizUltimate.render(container);
    });

    this.cleanup();
  },

  cleanup() {
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }
};
