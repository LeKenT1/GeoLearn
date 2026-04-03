window.GL = window.GL || {};

GL.QuizNightmare = {
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
        <div class="quiz-setup">
          <div class="quiz-setup-title">${t('quiz.nightmare.title')}</div>
          <p class="quiz-setup-subtitle">${t('quiz.nightmare.subtitle')}</p>
          
          <div class="setup-section">
            <div class="setup-section-label">${t('setup.continent')}</div>
            ${GL.UI.continentTabsHtml('all')}
          </div>

          <div class="setup-section">
            <div class="setup-section-label">${t('setup.countries')}</div>
            <div class="count-selector">
              <button class="count-btn selected" data-count="5">5</button>
              <button class="count-btn" data-count="10">10</button>
              <button class="count-btn" data-count="15">15</button>
              <button class="count-btn" data-count="20">20</button>
            </div>
          </div>

          <div class="setup-section">
            <div class="setup-section-label">${t('setup.difficulty')}</div>
            <div class="difficulty-selector">
              <button class="diff-btn" data-diff="easy">${t('setup.diff.easy')}<br><small>${t('setup.diff.easy.sub')}</small></button>
              <button class="diff-btn selected" data-diff="normal">${t('setup.diff.normal')}<br><small>${t('setup.diff.normal.sub')}</small></button>
              <button class="diff-btn" data-diff="hard">${t('setup.diff.hard')}<br><small>${t('setup.diff.hard.sub')}</small></button>
            </div>
          </div>

          <div style="margin-top:2rem;">
            <button class="btn btn-primary btn-lg" id="startNightmareBtn" style="width:100%;background:linear-gradient(135deg,#7c3aed,#dc2626);box-shadow:0 4px 20px rgba(124,58,237,0.4);">
              ${t('setup.start.nightmare')}
            </button>
          </div>
        </div>
      </div>
    `;

    this._setupConfig = { continent: 'all', count: 5, difficulty: 'normal' };
    this._bindSetupEvents(container);
  },

  _bindSetupEvents(container) {
    const cfg = this._setupConfig;

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

    container.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        cfg.difficulty = btn.dataset.diff;
      });
    });

    container.querySelector('#startNightmareBtn').addEventListener('click', async () => {
      const btn = container.querySelector('#startNightmareBtn');
      btn.disabled = true;
      btn.textContent = this._t('quiz.loading.map');

      await this._prepareMapData();

      const pool = GL.QuizEngine.getPool(cfg.continent, cfg.difficulty)
        .filter(c => c.numeric > 0 && GL.WorldMap.getVisibleCodes().has(c.numeric));

      if (pool.length < 4) {
        GL.UI.toast(this._t('quiz.err.notenough'), 'error');
        btn.disabled = false;
        btn.textContent = this._t('setup.start.nightmare');
        return;
      }

      const selected = GL.QuizEngine.pickRandom(pool, Math.min(cfg.count, pool.length));
      const questions = selected.map(country => ({ country, stepResults: [null, null, null] }));

      this.session = {
        questions,
        config: cfg,
        currentIndex: 0,
        score: 0,
        maxScore: questions.length * 3,
        streak: 0,
        maxStreak: 0,
        wrongAnswers: [],
        startTime: Date.now()
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
      console.error('Nightmare map load error:', e);
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
        <div class="page page-fullwidth">
          <div class="quiz-map-header">
            <div class="quiz-progress-wrap" style="flex:1;">
              <div class="quiz-progress-text">
                <span>${t('result.countries')} ${session.currentIndex + 1} / ${session.questions.length}</span>
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

          <div class="quiz-map-question-bar" id="nightmareMapBar">
            <div class="nightmare-steps" style="flex-shrink:0;">
              ${[0,1,2].map(i => `
                <div class="nightmare-step ${i < step ? (q.stepResults[i] ? 'done-correct' : 'done-wrong') : i === step ? 'active' : 'pending'}">
                  <span class="nightmare-step-icon">${stepIcons[i]}</span>
                  <span class="nightmare-step-label">${getStepLabel(i)}</span>
                </div>
              `).join('')}
            </div>
            <div class="quiz-map-prompt">
              <div>
                <div class="quiz-map-prompt-label">${t('nightmare.map.click')}</div>
                <span class="fi fi-${q.country.code}" style="width:72px;height:48px;background-size:cover;border-radius:6px;box-shadow:var(--shadow-md);display:inline-block;margin-top:0.25rem;"></span>
              </div>
            </div>
            <div id="mapFeedback" class="quiz-map-feedback empty">${t('nightmare.map.clickprompt')}</div>
          </div>

          <div class="map-wrapper" id="nightmareMapWrapper" style="margin-top:0.75rem;cursor:crosshair;min-height:450px;">
            <div class="map-loading"><span class="map-loading-spinner">🌍</span> ${t('quiz.map.loading')}</div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="page">
          <div class="quiz-container">
            <div class="quiz-header">
              <div class="quiz-progress-wrap">
                <div class="quiz-progress-text">
                  <span>${t('result.countries')} ${session.currentIndex + 1} / ${session.questions.length}</span>
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
                <button class="btn btn-primary" id="submitTextBtn">${t('quiz.btn.validate')}</button>
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
    let hintShown = false;

    if (input) setTimeout(() => input.focus(), 100);

    // Accept both FR and EN answers
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

      // Si l'indice a été utilisé, la réponse ne rapporte pas de point
      this._recordStepResult(hintShown ? false : isCorrect, q, step, container, val);
    };

    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });
    if (hintBtn) hintBtn.addEventListener('click', () => {
      if (!hintShown && feedback) {
        const hintSrc = (GL.I18N && GL.I18N.lang === 'en') ? answerAlt : answer;
        const hint = hintSrc.slice(0, Math.ceil(hintSrc.length / 3));
        feedback.textContent = `${t('quiz.hint.prefix')}${hint}…"`;
        hintShown = true;
        const rankedEl = container.querySelector('#rankedIndicator');
        if (rankedEl) rankedEl.classList.add('ranked-indicator--voided');
      }
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

    const mapWrapper = container.querySelector('#nightmareMapWrapper');
    GL.WorldMap.cleanup();

    try {
      if (!GL.WorldMap.worldData) {
        GL.WorldMap.worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
      }
      GL.WorldMap.buildNumericMap();
      GL.WorldMap._quizMode = true;
      GL.WorldMap._onCountryClick = null;
      GL.WorldMap.currentFilter = this.session.config.continent;

      GL.WorldMap.renderMap(mapWrapper);

      if (this.session.config.continent !== 'all') {
        GL.WorldMap.zoomToContinent(this.session.config.continent);
      }

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

    const allDone = q.stepResults.every(r => r !== null);

    if (!allDone) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'quiz-actions';
      actionsDiv.innerHTML = `<button class="btn btn-primary" id="stepNextBtn">${t('result.nextstep')}</button>`;

      const textForm = container.querySelector('#textForm');
      if (textForm) textForm.after(actionsDiv);

      let advanced = false;
      const advance = () => {
        if (advanced) return;
        advanced = true;
        clearTimeout(autoTimer);
        this._renderStep(container, q, step + 1);
      };
      const autoTimer = setTimeout(advance, 2000);
      actionsDiv.querySelector('#stepNextBtn').addEventListener('click', advance);

      this.keyHandler = (e) => { if (e.key === 'Enter') advance(); };
      document.addEventListener('keydown', this.keyHandler);
    } else {
      if (step === 2) {
        const mapBar = container.querySelector('#nightmareMapBar');
        if (mapBar) {
          const actionsDiv = document.createElement('div');
          actionsDiv.className = 'quiz-actions';
          actionsDiv.style.cssText = 'margin-top:0.75rem;';
          const isLast = session.currentIndex + 1 >= session.questions.length;
          actionsDiv.innerHTML = `<button class="btn btn-primary" id="stepNextBtn">${isLast ? t('nightmare.summary.final') : t('nightmare.summary.btn')}</button>`;
          mapBar.after(actionsDiv);

          let advanced = false;
          const advance = () => {
            if (advanced) return;
            advanced = true;
            clearTimeout(autoTimer);
            GL.WorldMap.cleanup();
            this._showCountrySummary(container, q);
          };
          const autoTimer = setTimeout(advance, 2500);
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

    container.innerHTML = `
      <div class="page">
        <div class="quiz-container">
          <div class="quiz-header">
            <div class="quiz-progress-wrap">
              <div class="quiz-progress-text">
                <span>${t('result.countries')} ${session.currentIndex + 1} / ${session.questions.length}</span>
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

          <div class="nightmare-country-summary">
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
              ${correct === 3 ? t('nightmare.summary.perfect') : correct === 2 ? t('nightmare.summary.close') : correct === 1 ? t('nightmare.summary.meh') : t('nightmare.summary.fail')}
              &nbsp;${correct}/3 points
            </div>
          </div>

          <div class="quiz-actions">
            <button class="btn btn-primary" id="nextCountryBtn">
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
      clearTimeout(autoTimer);
      session.currentIndex++;
      this._renderQuestion(container);
    };
    const autoTimer = setTimeout(advance, allCorrect ? 2000 : 3500);
    container.querySelector('#nextCountryBtn').addEventListener('click', advance);

    this.keyHandler = (e) => { if (e.key === 'Enter') advance(); };
    document.addEventListener('keydown', this.keyHandler);
  },

  _renderResults(container) {
    const { session } = this;
    const t = this._t.bind(this);
    const pct = Math.round(session.score / session.maxScore * 100);
    const stars = GL.UI.starsForScore(pct);

    GL.WorldMap.cleanup();
    GL.UI.updateMaxStreak(session.maxStreak);
    GL.UI.recordQuizResult('nightmare', session.score, session.maxScore, session.config.continent);

    const resultTitle = pct >= 80 ? t('nightmare.great') : pct >= 60 ? t('nightmare.ok') : pct >= 40 ? t('nightmare.meh') : t('nightmare.fail');
    const stepLabels = [t('nightmare.step.name.short'), t('nightmare.step.capital.short'), t('nightmare.step.map.short')];

    container.innerHTML = `
      <div class="page">
        <div class="results-container">
          <div class="results-stars">${stars}</div>
          <div class="results-title">${resultTitle}</div>
          <div class="results-subtitle">${t('quiz.nightmare.title')}</div>
          <div class="results-score-big">${pct}%</div>

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
          </div>

          <div class="wrong-answers">
            <div class="wrong-answers-title">${t('nightmare.results')}</div>
            ${session.questions.map(q => {
              const correct = q.stepResults.filter(Boolean).length;
              const borderColor = correct === 3 ? '#22c55e' : correct === 0 ? '#ef4444' : '#f59e0b';
              const stepAnswers = [q.country.nameFr, q.country.capitalFr, null];
              const chips = q.stepResults.map((r, i) => {
                const userIn = q.stepUserInputs && q.stepUserInputs[i];
                const correctAns = stepAnswers[i];
                const bg = r ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';
                const col = r ? '#22c55e' : '#ef4444';
                const icon = r ? '✓' : '✕';
                const detail = !r && userIn && correctAns
                  ? ` · <s style="opacity:0.7">${userIn}</s> → <b style="color:#22c55e">${correctAns}</b>`
                  : '';
                return `<span style="font-size:0.72rem;padding:0.18rem 0.5rem;border-radius:4px;font-weight:600;background:${bg};color:${col};white-space:nowrap;">${icon} ${stepLabels[i]}${detail}</span>`;
              }).join('');
              return `
                <div class="wrong-answer-item" style="flex-direction:column;align-items:stretch;gap:0.3rem;border:1px solid ${borderColor};border-radius:var(--radius-md);padding:0.45rem 0.65rem;margin-bottom:0.4rem;">
                  <div style="display:flex;align-items:center;gap:0.5rem;">
                    <span class="fi fi-${q.country.code}" style="width:30px;height:20px;background-size:cover;border-radius:2px;display:inline-block;flex-shrink:0;"></span>
                    <span style="flex:1;font-size:0.85rem;font-weight:600;">${this._n(q.country)}</span>
                    <span style="font-size:0.75rem;font-weight:700;color:${borderColor};">${correct}/3</span>
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">${chips}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="results-buttons">
            <button class="btn btn-primary" id="retryNightmareBtn">${t('result.retry')}</button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#retryNightmareBtn').addEventListener('click', () => {
      GL.QuizNightmare.render(container);
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
