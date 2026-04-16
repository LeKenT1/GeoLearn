window.GL = window.GL || {};

GL.QuizCulture = {
  session: null,
  keyHandler: null,

  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },
  _n(country) { return GL.I18N ? GL.I18N.name(country) : country.nameFr; },

  // ── Session building ────────────────────────────────────────────────────────

  _getFactsPool(continent) {
    const facts = GL.CULTURE_FACTS || {};
    let countries = GL.COUNTRIES.filter(c => facts[c.code]);
    if (continent && continent !== 'all') {
      countries = countries.filter(c => c.continent === continent);
    }
    return countries;
  },

  _buildSession(config) {
    const pool = this._getFactsPool(config.continent);
    if (pool.length < 4) return null;

    const count = Math.min(config.count === Infinity ? pool.length : (config.count || 10), pool.length);
    const shuffled = GL.QuizEngine.shuffle(pool);
    const selected = shuffled.slice(0, count);
    const lang = GL.I18N ? GL.I18N.lang : 'fr';

    const questions = selected.map(country => {
      const factsArr = GL.CULTURE_FACTS[country.code][lang];
      const fact = factsArr[Math.floor(Math.random() * factsArr.length)];
      const options = config.mode === 'mc'
        ? GL.QuizEngine.generateOptions(country, pool, 4)
        : null;
      return {
        type: config.mode === 'mc' ? 'mc' : 'text',
        country,
        fact,
        options,
        answer: country.nameFr,
        answerAlt: country.name,
        aliases: country.aliases || []
      };
    });

    return {
      questions,
      config,
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      wrongAnswers: []
    };
  },

  // ── Setup page ──────────────────────────────────────────────────────────────

  render(container) {
    this.cleanup();
    const t = this._t.bind(this);

    container.innerHTML = `
      <div class="page culture-page">
        <div class="culture-hero">
          <div class="culture-hero-orb">📚</div>
          <h1 class="culture-title">${t('quiz.culture.title')}</h1>
          <p class="culture-subtitle">${t('quiz.culture.subtitle')}</p>
        </div>

        <div class="culture-setup">

          <div class="setup-section">
            <div class="culture-section-label">${t('setup.continent')}</div>
            ${GL.UI.continentTabsHtml('all')}
          </div>

          <div class="setup-section">
            <div class="culture-section-label">${t('setup.count')}</div>
            <div class="count-selector">
              <button class="culture-count-btn selected" data-count="10">10</button>
              <button class="culture-count-btn" data-count="20">20</button>
              <button class="culture-count-btn" data-count="30">30</button>
              <button class="culture-count-btn" data-count="50">50</button>
              <button class="culture-count-btn" data-count="all">Tous</button>
            </div>
          </div>

          <div class="setup-section">
            <div class="culture-section-label">${t('quiz.culture.setup.mode')}</div>
            <div class="culture-mode-selector">
              <div class="culture-mode-card selected" data-mode="mc">
                <div class="culture-mode-icon">🎯</div>
                <div class="culture-mode-name">${t('quiz.culture.mode.mc')}</div>
                <div class="culture-mode-desc">${t('quiz.culture.mode.mc.desc')}</div>
              </div>
              <div class="culture-mode-card" data-mode="text">
                <div class="culture-mode-icon">✍️</div>
                <div class="culture-mode-name">${t('quiz.culture.mode.text')}</div>
                <div class="culture-mode-desc">${t('quiz.culture.mode.text.desc')}</div>
              </div>
            </div>
          </div>

          <div style="margin-top:2.5rem;">
            <button class="culture-start-btn" id="startCultureBtn">
              <span>🧭</span> ${t('quiz.culture.start')}
            </button>
          </div>

        </div>
      </div>
    `;

    this._setupConfig = { continent: 'all', count: 10, mode: 'mc' };
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

    container.querySelectorAll('.culture-count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.culture-count-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        cfg.count = btn.dataset.count === 'all' ? Infinity : parseInt(btn.dataset.count);
      });
    });

    container.querySelectorAll('.culture-mode-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.culture-mode-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        cfg.mode = card.dataset.mode;
      });
    });

    container.querySelector('#startCultureBtn').addEventListener('click', () => {
      const session = this._buildSession(cfg);
      if (!session || session.questions.length === 0) {
        GL.UI.toast(this._t('quiz.culture.nodata'), 'error');
        return;
      }
      this.session = session;
      this._renderQuestion(container);
    });
  },

  // ── Question rendering ──────────────────────────────────────────────────────

  _renderQuestion(container) {
    const { session } = this;
    if (session.currentIndex >= session.questions.length) {
      this._renderResults(container);
      return;
    }

    const q = session.questions[session.currentIndex];
    const t = this._t.bind(this);
    const pct = Math.round(session.currentIndex / session.questions.length * 100);
    const score = session.score;
    const scoreLabel = score <= 1 ? t('quiz.correct') : t('quiz.corrects');

    container.innerHTML = `
      <div class="page culture-page">
        <div class="culture-quiz-wrap">

          <div class="culture-quiz-header">
            <div class="quiz-progress-wrap">
              <div class="quiz-progress-text">
                <span>${t('quiz.q')} ${session.currentIndex + 1} / ${session.questions.length}</span>
                <span>${score} ${scoreLabel}</span>
              </div>
              <div class="quiz-progress-bar">
                <div class="culture-progress-fill" style="width:${pct}%"></div>
              </div>
            </div>
            <div class="quiz-score-wrap">
              <div class="culture-score-badge">✓ ${score}</div>
              <div class="quiz-streak-badge ${session.streak < 2 ? 'hidden' : ''}" id="streakBadge">🔥 ${session.streak}</div>
            </div>
          </div>

          <div class="culture-fact-card" id="factCard">
            <div class="culture-fact-deco">📜</div>
            <p class="culture-fact-text">${this._escapeFact(q.fact)}</p>
            <div class="culture-fact-question">${t('quiz.culture.question')}</div>
          </div>

          ${q.type === 'mc' ? this._renderMCOptions(q) : this._renderTextInput()}

          ${q.type === 'mc'
            ? `<div class="keyboard-hints">
                <span class="kbd">1</span><span class="kbd">2</span><span class="kbd">3</span><span class="kbd">4</span>
                <span style="color:var(--text-muted);font-size:0.75rem;margin-left:0.25rem">${t('quiz.hint.key')}</span>
               </div>`
            : `<div class="keyboard-hints">
                <span class="kbd">Entrée</span>
                <span style="color:var(--text-muted);font-size:0.75rem;margin-left:0.25rem">${t('quiz.hint.enter')}</span>
               </div>`}
        </div>
      </div>
    `;

    this._bindQuestionEvents(container, q);
  },

  _escapeFact(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },

  _renderMCOptions(q) {
    const keys = ['1','2','3','4'];
    return `<div class="culture-options" id="cultureOptions">
      ${q.options.map((opt, i) => `
        <button class="culture-option" data-code="${opt.code}" data-idx="${i}">
          <span class="culture-option-key">${keys[i]}</span>
          <span class="culture-option-label">${this._n(opt)}</span>
          <span class="fi fi-${opt.code} culture-option-flag"></span>
        </button>
      `).join('')}
    </div>`;
  },

  _renderTextInput() {
    const t = this._t.bind(this);
    return `<div class="quiz-text-form" id="textForm">
      <input type="text" class="quiz-text-input" id="textAnswer"
        placeholder="${t('quiz.culture.placeholder')}"
        autocomplete="off" autocorrect="off" spellcheck="false">
      <div id="textFeedback" class="quiz-hint"></div>
      <div style="display:flex;gap:0.75rem;justify-content:center;">
        <button class="culture-start-btn" style="padding:0.65rem 1.75rem;font-size:0.9rem;" id="submitTextBtn">${t('quiz.btn.validate')}</button>
        <button class="btn btn-ghost btn-sm" id="hintBtn">${t('quiz.btn.hint')}</button>
      </div>
    </div>`;
  },

  _bindQuestionEvents(container, q) {
    if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler);

    if (q.type === 'mc') {
      const options = container.querySelectorAll('.culture-option');
      let answered = false;

      const handleAnswer = (btn) => {
        if (answered) return;
        answered = true;
        options.forEach(b => b.disabled = true);

        const code = btn.dataset.code;
        const isCorrect = code === q.country.code;

        options.forEach(b => {
          if (b.dataset.code === q.country.code) b.classList.add('correct');
          else if (b === btn && !isCorrect) b.classList.add('wrong');
        });

        const userInput = isCorrect ? '' : (btn.querySelector('.culture-option-label')?.textContent?.trim() || '');
        this._handleAnswer(isCorrect, q, container, userInput);
      };

      options.forEach(btn => btn.addEventListener('click', () => handleAnswer(btn)));

      this.keyHandler = (e) => {
        if (['1','2','3','4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1;
          if (options[idx]) handleAnswer(options[idx]);
        } else if (e.key === 'Enter' || e.key === ' ') {
          const nextBtn = container.querySelector('#nextBtn');
          if (nextBtn) nextBtn.click();
        }
      };
      document.addEventListener('keydown', this.keyHandler);

    } else {
      const input = container.querySelector('#textAnswer');
      const feedback = container.querySelector('#textFeedback');
      const submitBtn = container.querySelector('#submitTextBtn');
      const hintBtn = container.querySelector('#hintBtn');
      let answered = false;
      let hintShown = false;

      if (input) setTimeout(() => input.focus(), 100);

      const handleTextAnswer = () => {
        if (answered) return;
        const val = input ? input.value : '';
        const isCorrect = GL.UI.checkTextAnswer(val, q.answer, q.answerAlt, q.aliases);
        answered = true;
        if (input) { input.classList.add(isCorrect ? 'correct' : 'wrong'); input.disabled = true; }
        const displayAnswer = (GL.I18N && GL.I18N.lang === 'en' && q.answerAlt) ? q.answerAlt : q.answer;
        if (!isCorrect && feedback) {
          feedback.innerHTML = `<span class="quiz-correct-answer">✓ ${displayAnswer}</span>`;
        }
        this._handleAnswer(isCorrect, q, container, isCorrect ? '' : val);
      };

      if (submitBtn) submitBtn.addEventListener('click', handleTextAnswer);
      if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleTextAnswer(); });
      if (hintBtn) hintBtn.addEventListener('click', () => {
        if (!hintShown && feedback) {
          const hintSrc = (GL.I18N && GL.I18N.lang === 'en' && q.answerAlt) ? q.answerAlt : q.answer;
          const hint = hintSrc.slice(0, Math.ceil(hintSrc.length / 3));
          feedback.textContent = `${this._t('quiz.hint.prefix')}${hint}…"`;
          hintShown = true;
        }
      });

      this.keyHandler = (e) => {
        if (e.key === 'Enter' && answered) {
          const nextBtn = container.querySelector('#nextBtn');
          if (nextBtn) nextBtn.click();
        }
      };
      document.addEventListener('keydown', this.keyHandler);
    }
  },

  _handleAnswer(isCorrect, q, container, userInput = '') {
    const { session } = this;
    const t = this._t.bind(this);

    GL.Audio[isCorrect ? 'playCorrect' : 'playWrong']();

    if (isCorrect) {
      session.score++;
      session.streak++;
      if (session.streak > session.maxStreak) session.maxStreak = session.streak;
      if (session.streak >= 2) {
        const sb = container.querySelector('#streakBadge');
        if (sb) {
          sb.textContent = `🔥 ${session.streak}`;
          sb.classList.remove('hidden');
          sb.classList.add('streak-animate');
          setTimeout(() => sb.classList.remove('streak-animate'), 300);
        }
      }
    } else {
      session.streak = 0;
      const sb = container.querySelector('#streakBadge');
      if (sb) sb.classList.add('hidden');
      session.wrongAnswers.push({ question: q, userInput });
    }

    // Show flag reveal on the fact card after answering
    const factCard = container.querySelector('#factCard');
    if (factCard) {
      const revealDiv = document.createElement('div');
      revealDiv.className = 'culture-flag-reveal';
      revealDiv.innerHTML = `
        <span class="fi fi-${q.country.code}" style="display:inline-block;height:42px;aspect-ratio:3/2;background-size:contain;background-position:center;background-repeat:no-repeat;border-radius:4px;box-shadow:var(--shadow-sm);"></span>
        <span class="culture-reveal-name">${this._n(q.country)}</span>
      `;
      factCard.appendChild(revealDiv);
    }

    // Next button
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'quiz-actions';
    const isLast = session.currentIndex + 1 >= session.questions.length;
    actionsDiv.innerHTML = `<button class="culture-start-btn" style="padding:0.75rem 2.5rem;" id="nextBtn">
      ${isLast ? t('result.results') : t('result.nextq')}
    </button>`;

    const optEl = container.querySelector('#cultureOptions') || container.querySelector('#textForm');
    if (optEl) optEl.after(actionsDiv);

    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      GL._onRouteLeave = null;
      clearTimeout(autoTimer);
      session.currentIndex++;
      this._renderQuestion(container);
    };
    const autoTimer = setTimeout(advance, 2000);
    GL._onRouteLeave = () => { advanced = true; clearTimeout(autoTimer); };
    actionsDiv.querySelector('#nextBtn').addEventListener('click', advance);
  },

  // ── Results ──────────────────────────────────────────────────────────────────

  _renderResults(container) {
    const { session } = this;
    const t = this._t.bind(this);
    const total = session.questions.length;
    const pct = Math.round(session.score / total * 100);
    const stars = GL.UI.starsForScore(pct);
    const resultTitle = pct >= 70 ? t('result.great') : pct >= 50 ? t('result.ok') : t('result.keep');

    container.innerHTML = `
      <div class="page culture-page">
        <div class="culture-results">

          <div class="culture-results-stars">${stars}</div>
          <div class="culture-results-title">${resultTitle}</div>
          <div class="culture-results-sub">🧭 ${t('quiz.culture.title')}</div>
          <div class="culture-score-big">${pct}%</div>

          <div class="results-stats-row">
            <div class="results-stat">
              <div class="results-stat-num">${session.score}/${total}</div>
              <div class="results-stat-label">${t('result.correct')}</div>
            </div>
            <div class="results-stat">
              <div class="results-stat-num">${session.maxStreak}</div>
              <div class="results-stat-label">${t('result.streak')}</div>
            </div>
            <div class="results-stat">
              <div class="results-stat-num">${total - session.score}</div>
              <div class="results-stat-label">${t('result.errors')}</div>
            </div>
          </div>

          ${session.wrongAnswers.length > 0 ? `
            <div class="culture-wrong-answers">
              <div class="culture-wrong-title">${t('result.wrong.title').replace('{n}', session.wrongAnswers.length)}</div>
              ${session.wrongAnswers.map(w => `
                <div class="culture-wrong-item">
                  <span class="fi fi-${w.question.country.code}" style="display:inline-block;height:28px;aspect-ratio:3/2;background-size:contain;background-position:center;background-repeat:no-repeat;border-radius:3px;flex-shrink:0;"></span>
                  <span class="culture-wrong-country">${this._n(w.question.country)}</span>
                  <span class="culture-wrong-fact">${this._escapeFact(w.question.fact)}</span>
                  ${w.userInput ? `<span class="culture-wrong-input">${w.userInput}</span>` : ''}
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="culture-perfect">
              🎉 ${t('result.perfect')}
            </div>
          `}

          <div style="display:flex;gap:1rem;justify-content:center;margin-top:2rem;flex-wrap:wrap;">
            <button class="culture-start-btn" id="retryBtn">${t('result.retry')}</button>
          </div>

        </div>
      </div>
    `;

    container.querySelector('#retryBtn').addEventListener('click', () => {
      const newSession = this._buildSession(session.config);
      if (newSession) {
        this.session = newSession;
        this._renderQuestion(container);
      }
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
