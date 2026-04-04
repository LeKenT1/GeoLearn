window.GL = window.GL || {};

GL.QuizFlags = {
  session: null,
  keyHandler: null,

  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },
  _n(country) { return GL.I18N ? GL.I18N.name(country) : country.nameFr; },
  _cap(country) { return GL.I18N ? GL.I18N.capital(country) : country.capitalFr; },

  // Proportions officielles width/height (3/2 = paysage standard pour la quasi-totalité des pays)
  _FLAG_RATIOS: { 'mc': '4/5', 'ch': '1/1', 'va': '1/1', 'np': '4/5' },
  _flagStyle(code, height, extra = '') {
    const ratio = this._FLAG_RATIOS[code] || '3/2';
    return `height:${height}px;aspect-ratio:${ratio};background-size:contain;background-position:center;background-repeat:no-repeat;display:inline-block;${extra}`;
  },

  render(container) {
    this.cleanup();
    const t = this._t.bind(this);
    container.innerHTML = `
      <div class="page">
        <div class="quiz-setup">
          <div class="quiz-setup-title">${t('quiz.flags.title')}</div>
          <p class="quiz-setup-subtitle">${t('quiz.flags.subtitle')}</p>

          <div class="setup-section">
            <div class="setup-section-label">${t('setup.level')}</div>
            <div class="level-cards">
              <div class="level-card selected" data-level="1">
                <div class="level-card-num">1</div>
                <div class="level-card-name">${t('quiz.flags.l1.name')}</div>
                <div class="level-card-desc">${t('quiz.flags.l1.desc')}</div>
              </div>
              <div class="level-card" data-level="2">
                <div class="level-card-num">2</div>
                <div class="level-card-name">${t('quiz.flags.l2.name')}</div>
                <div class="level-card-desc">${t('quiz.flags.l2.desc')}</div>
              </div>
              <div class="level-card" data-level="3">
                <div class="level-card-num">3</div>
                <div class="level-card-name">${t('quiz.flags.l3.name')}</div>
                <div class="level-card-desc">${t('quiz.flags.l3.desc')}</div>
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
              <button class="count-btn" data-count="50">50</button>
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

          <div class="setup-section">
            <div class="setup-section-label">${t('setup.mode')}</div>
            <div class="mode-selector">
              <div class="mode-card selected" data-mode="normal">
                <div class="mode-card-icon">🎮</div>
                <div class="mode-card-name">${t('setup.mode.normal')}</div>
                <div class="mode-card-desc">${t('setup.mode.normal.desc')}</div>
              </div>
              <div class="mode-card" data-mode="ranked">
                <div class="mode-card-icon">🏆</div>
                <div class="mode-card-name">${t('setup.mode.ranked')}</div>
                <div class="mode-card-desc">${t('setup.mode.ranked.desc')}</div>
              </div>
            </div>
          </div>

          <div style="margin-top:2rem;">
            <button class="btn btn-primary btn-lg" id="startQuizBtn" style="width:100%;">
              ${t('setup.start')}
            </button>
          </div>
        </div>
      </div>
    `;

    this._setupConfig = { level: 1, continent: 'all', count: 10, difficulty: 'normal', ranked: false };
    this.bindSetupEvents(container);
  },

  bindSetupEvents(container) {
    const cfg = this._setupConfig;

    container.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        cfg.level = parseInt(card.dataset.level);
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

    container.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        cfg.difficulty = btn.dataset.diff;
      });
    });

    let savedLevel = cfg.level;
    container.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        cfg.ranked = card.dataset.mode === 'ranked';
        // Lock/unlock level selector visually
        const levelCards = container.querySelector('.level-cards');
        if (levelCards) levelCards.classList.toggle('locked', cfg.ranked);
        // Auto-select level 3 for ranked, restore previous level for normal
        if (cfg.ranked) {
          savedLevel = cfg.level;
          container.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
          container.querySelector('.level-card[data-level="3"]').classList.add('selected');
          cfg.level = 3;
        } else {
          container.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
          container.querySelector(`.level-card[data-level="${savedLevel}"]`).classList.add('selected');
          cfg.level = savedLevel;
        }
      });
    });

    container.querySelector('#startQuizBtn').addEventListener('click', () => {
      // In ranked mode, always force text input (level 3)
      const effectiveLevel = cfg.ranked ? 3 : cfg.level;
      const session = GL.QuizEngine.buildSession({ type: 'flags', ...cfg, level: effectiveLevel });
      if (!session || session.questions.length === 0) {
        GL.UI.toast(this._t('quiz.err.notenough'), 'error');
        return;
      }
      session.startTime = Date.now();
      session.peakBefore = GL.UI.getStats().rankedXP || 0;
      session.discoveredBefore = GL.UI.computeDiscovered(GL.UI.getStats());
      this.session = session;
      this.renderQuestion(container);
    });
  },

  renderQuestion(container) {
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
      <div class="page">
        <div class="quiz-container">
          <div class="quiz-header">
            <div class="quiz-progress-wrap">
              <div class="quiz-progress-text">
                <span>${t('quiz.q')} ${session.currentIndex + 1} / ${session.questions.length}</span>
                <span>${score} ${scoreLabel}</span>
              </div>
              <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width:${pct}%"></div>
              </div>
            </div>
            <div class="quiz-score-wrap">
              <div class="quiz-score-badge">✓ ${score}</div>
              <div class="quiz-streak-badge ${session.streak < 2 ? 'hidden' : ''}" id="streakBadge">
                🔥 ${session.streak}
              </div>
              ${session.config.ranked ? `<div class="ranked-indicator">${t('quiz.ranked')}</div>` : ''}
            </div>
          </div>

          <div class="quiz-question-card" id="questionCard">
            ${this.renderQuestionContent(q)}
          </div>

          ${q.type === 'mc' ? this.renderOptions(q) : this.renderTextInput(q, session.config.ranked)}

          ${q.type === 'mc' ? `<div class="keyboard-hints">
            <span class="kbd">1</span><span class="kbd">2</span><span class="kbd">3</span><span class="kbd">4</span>
            <span style="color:var(--text-muted);font-size:0.75rem;margin-left:0.25rem">${t('quiz.hint.key')}</span>
          </div>` : `<div class="keyboard-hints">
            <span class="kbd">Entrée</span>
            <span style="color:var(--text-muted);font-size:0.75rem;margin-left:0.25rem">${t('quiz.hint.enter')}</span>
          </div>`}
        </div>
      </div>
    `;

    this.bindQuestionEvents(container, q);

    if (session.timerInterval) clearInterval(session.timerInterval);
  },

  renderQuestionContent(q) {
    if (q.subtype === 'flag-to-name' || q.subtype === 'flag-to-text') {
      return `
        <div class="quiz-question-label">${q.label}</div>
        <div class="quiz-flag-container">
          <span class="fi fi-${q.country.code}" style="${this._flagStyle(q.country.code, 107, 'border-radius:8px;box-shadow:var(--shadow-md);')}"></span>
        </div>
      `;
    } else if (q.subtype === 'name-to-flag') {
      return `
        <div class="quiz-question-label">${q.label}</div>
        <div class="quiz-question-text">${this._n(q.country)}</div>
        <div style="font-size:0.85rem;color:var(--text-muted)">${GL.I18N && GL.I18N.lang === 'en' ? q.country.nameFr : q.country.name}</div>
      `;
    } else if (q.subtype === 'country-to-capital' || q.subtype === 'country-to-capital-text') {
      return `
        <div class="quiz-question-label">${q.label}</div>
        <div class="quiz-question-text">${this._n(q.country)}</div>
        <div class="quiz-flag-container" style="margin-top:0.75rem;">
          <span class="fi fi-${q.country.code}" style="${this._flagStyle(q.country.code, 48, 'border-radius:4px;box-shadow:var(--shadow-sm);')}"></span>
        </div>
      `;
    } else if (q.subtype === 'capital-to-country') {
      return `
        <div class="quiz-question-label">${q.label}</div>
        <div class="quiz-question-text">🏛️ ${this._cap(q.country)}</div>
      `;
    }
    return `<div class="quiz-question-label">${q.label}</div>`;
  },

  renderOptions(q) {
    const keys = ['1', '2', '3', '4'];
    return `<div class="quiz-options" id="quizOptions">
      ${q.options.map((opt, i) => {
        if (q.subtype === 'name-to-flag') {
          return `<button class="quiz-option flag-option" data-code="${opt.code}" data-idx="${i}">
            <span class="option-key">${keys[i]}</span>
            <span class="fi fi-${opt.code}" style="${this._flagStyle(opt.code, 48, 'border-radius:4px;')}"></span>
          </button>`;
        } else if (q.subtype === 'country-to-capital' || q.subtype === 'capital-to-country') {
          const label = q.subtype === 'country-to-capital' ? this._cap(opt) : this._n(opt);
          return `<button class="quiz-option" data-code="${opt.code}" data-idx="${i}">
            <span class="option-key">${keys[i]}</span>
            <span>${label}</span>
          </button>`;
        } else {
          return `<button class="quiz-option" data-code="${opt.code}" data-idx="${i}">
            <span class="option-key">${keys[i]}</span>
            <span>${this._n(opt)}</span>
          </button>`;
        }
      }).join('')}
    </div>`;
  },

  renderTextInput(q, ranked = false) {
    const t = this._t.bind(this);
    const placeholder = q.subtype === 'country-to-capital-text' ? t('quiz.placeholder.capital') : t('quiz.placeholder.country');
    return `<div class="quiz-text-form" id="textForm">
      <input type="text" class="quiz-text-input" id="textAnswer"
        placeholder="${placeholder}"
        autocomplete="off" autocorrect="off" spellcheck="false">
      <div id="textFeedback" class="quiz-hint"></div>
      <div style="display:flex;gap:0.75rem;justify-content:center;">
        <button class="btn btn-primary" id="submitTextBtn">${t('quiz.btn.validate')}</button>
        ${ranked ? '' : `<button class="btn btn-ghost btn-sm" id="hintBtn">${t('quiz.btn.hint')}</button>`}
      </div>
    </div>`;
  },

  bindQuestionEvents(container, q) {
    // Remove previous key handler
    if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler);

    if (q.type === 'mc') {
      const options = container.querySelectorAll('.quiz-option');
      let answered = false;

      const handleAnswer = (btn) => {
        if (answered) return;
        answered = true;
        options.forEach(b => b.disabled = true);

        const code = btn.dataset.code;
        const isCorrect = code === q.country.code;

        // Mark correct and wrong
        options.forEach(b => {
          if (b.dataset.code === q.country.code) b.classList.add('correct');
          else if (b === btn && !isCorrect) b.classList.add('wrong');
        });

        const userInput = isCorrect ? '' : (btn.querySelector('span:last-child')?.textContent?.trim() || '');
        this.handleAnswer(isCorrect, q, container, userInput);
      };

      options.forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(btn));
      });

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
      // Text input
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
        if (input) {
          input.classList.add(isCorrect ? 'correct' : 'wrong');
          input.disabled = true;
        }
        const displayAnswer = (GL.I18N && GL.I18N.lang === 'en' && q.answerAlt) ? q.answerAlt : q.answer;
        if (!isCorrect && feedback) {
          feedback.innerHTML = `<span class="quiz-correct-answer">✓ ${displayAnswer}</span>`;
        }
        this.handleAnswer(isCorrect, q, container, isCorrect ? '' : val);
      };

      if (submitBtn) submitBtn.addEventListener('click', handleTextAnswer);
      if (input) input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleTextAnswer();
      });
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

  handleAnswer(isCorrect, q, container, userInput = '') {
    const { session } = this;
    const t = this._t.bind(this);

    GL.Audio[isCorrect ? 'playCorrect' : 'playWrong']();

    const masteryType = session.config.ranked ? 'flag' : null;
    if (isCorrect) {
      session.score++;
      session.streak++;
      if (session.streak > session.maxStreak) session.maxStreak = session.streak;
      GL.UI.recordAnswer(q.country.code, true, masteryType);
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
      GL.UI.recordAnswer(q.country.code, false, masteryType);
    }

    // Add next button
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'quiz-actions';
    const isLast = session.currentIndex + 1 >= session.questions.length;
    actionsDiv.innerHTML = `<button class="btn btn-primary" id="nextBtn">
      ${isLast ? t('result.results') : t('result.nextq')}
    </button>`;

    const form = container.querySelector('#quizOptions') || container.querySelector('#textForm');
    if (form) form.after(actionsDiv);

    // Auto-advance after 2s, guard against double call
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      GL._onRouteLeave = null;
      clearTimeout(autoTimer);
      session.currentIndex++;
      this.renderQuestion(container);
    };
    const autoTimer = setTimeout(advance, 2000);
    GL._onRouteLeave = () => { advanced = true; clearTimeout(autoTimer); };

    actionsDiv.querySelector('#nextBtn').addEventListener('click', advance);
  },

  renderResults(container) {
    const { session } = this;
    const t = this._t.bind(this);
    if (session.timerInterval) { clearInterval(session.timerInterval); session.timerInterval = null; }
    const total = session.questions.length;
    const pct = Math.round(session.score / total * 100);
    const stars = GL.UI.starsForScore(pct);

    if (session.config.ranked) {
      GL.UI.updateMaxStreak(session.maxStreak);
      GL.UI.saveCurrentStreak(session.streak);
      GL.UI.recordQuizResult('flags', session.score, total, session.config.continent);
    }

    const levelNames = { 1: `${t('setup.level')} 1`, 2: `${t('setup.level')} 2`, 3: `${t('setup.level')} 3` };
    const resultTitle = pct >= 70 ? t('result.great') : pct >= 50 ? t('result.ok') : t('result.keep');

    // Rank progress data (only for ranked mode)
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

    const rankHtml = rankData ? this._rankCardHtml(rankData, t) : '';

    container.innerHTML = `
      <div class="page">
        <div class="results-container">
          <div class="results-stars">${stars}</div>
          <div class="results-title">${resultTitle}</div>
          <div class="results-subtitle">${session.config.ranked ? t('quiz.ranked') : levelNames[session.config.level]} · ${t('quiz.flags.title')}</div>
          <div class="results-score-big">${pct}%</div>
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

          ${rankHtml}

          ${session.wrongAnswers.length > 0 ? `
            <div class="wrong-answers">
              <div class="wrong-answers-title">${t('result.wrong.title').replace('{n}', session.wrongAnswers.length)}</div>
              ${session.wrongAnswers.map(w => `
                <div class="wrong-answer-item">
                  <span class="fi fi-${w.question.country.code}" style="${this._flagStyle(w.question.country.code, 48, 'border-radius:4px;flex-shrink:0;')}"></span>
                  <span style="flex:1;font-size:0.875rem;font-weight:600;">${this._n(w.question.country)}</span>
                  ${w.userInput ? `<span style="color:var(--error,#e53e3e);font-size:0.8rem;text-decoration:line-through;">${w.userInput}</span>` : ''}
                  ${w.question.subtype === 'country-to-capital' || w.question.subtype === 'country-to-capital-text' ?
                    `<span style="color:var(--success);font-size:0.8rem;">✓ ${this._cap(w.question.country)}</span>` : ''}
                </div>
              `).join('')}
            </div>
          ` : `<div style="padding:1.5rem;background:var(--success-bg);border:1px solid var(--success-border);border-radius:var(--radius-lg);color:var(--success);font-weight:600;margin:1.5rem 0;">
            ${t('result.perfect')}
          </div>`}

          <div class="results-buttons">
            <button class="btn btn-primary" id="retryBtn">${t('result.retry')}</button>
          </div>
        </div>
      </div>
    `;

    if (rankData) GL.UI.animateRankBar(container, rankData);
    if (rankData && rankData.rankUp && GL.RankBadges) {
      const rank = GL.RankBadges.RANKS.find(r => r.key === rankData.tier.key) || GL.RankBadges.RANKS[0];
      setTimeout(() => GL.RankBadges._triggerLevelUp(rank), 2000);
    }

    container.querySelector('#retryBtn').addEventListener('click', () => {
      const newSession = GL.QuizEngine.buildSession({ type: 'flags', ...session.config });
      if (newSession) {
        const retryStats = GL.UI.getStats();
        newSession.peakBefore = retryStats.rankedXP || 0;
        newSession.discoveredBefore = GL.UI.computeDiscovered(retryStats);
        this.session = newSession;
        this.renderQuestion(container);
      }
    });

    this.cleanup();
  },

  _rankCardHtml(rankData, t) {
    const tierName = GL.UI.tierName(rankData.tier);
    const nextName = rankData.next ? GL.UI.tierName(rankData.next) : null;
    const xpGained = rankData.gained > 0
      ? `<span style="color:var(--success);font-weight:700;">${t('result.rank.xp.gained').replace('{n}', rankData.gained).replace('{s}', rankData.gained > 1 ? 's' : '')}</span>`
      : `<span style="color:var(--text-muted);">${t('result.rank.xp.none')}</span>`;
    const isNextLegend = rankData.next?.key === 'legend';
    const isCurrentLegend = rankData.tier.key === 'legend';
    const total = GL.UI ? GL.UI.TOTAL_UNIQUE : 591;
    const discBefore = isNextLegend || isCurrentLegend ? Math.round((rankData.discoveredBefore || 0) / total * 100) : rankData.beforePct;
    const discAfter  = isNextLegend || isCurrentLegend ? Math.round((rankData.discoveredAfter  || 0) / total * 100) : rankData.afterPct;
    const barLabel   = isNextLegend
      ? `<span>${tierName}</span><span>${nextName} (${rankData.discoveredAfter || 0}/${total})</span>`
      : isCurrentLegend
        ? `<span>${tierName}</span><span>${t('result.rank.max')}</span>`
        : `<span>${tierName} (${rankData.tier.min})</span>${nextName ? `<span>${nextName} (${rankData.next.min})</span>` : `<span>${t('result.rank.max')}</span>`}`;

    const _rbSvg = (GL.RankBadges && rankData.tier.key)
      ? GL.RankBadges.svgFrameOnly(rankData.tier.key)
      : rankData.tier.icon;
    const _rbIconInline = (GL.RankBadges && rankData.tier.key)
      ? `<span style="display:inline-block;width:1.3em;height:1.3em;vertical-align:middle;">${GL.RankBadges.svgFrameOnly(rankData.tier.key)}</span>`
      : rankData.tier.icon;
    return `
      <div class="rank-card" style="--rank-color:${rankData.tier.color};">
        ${rankData.rankUp ? `<div class="rank-up-badge">${t('result.rank.up').replace('{icon}', _rbIconInline).replace('{name}', tierName)}</div>` : ''}
        <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.6rem;">${t('result.rank.progress')}</div>
        <div class="rank-icon">${_rbSvg}</div>
        <div class="rank-name">${tierName}</div>
        <div class="rank-bar-track" style="height:14px;">
          <div class="rank-bar-fill" id="rankBarFill" style="width:${discBefore}%;transition:none;"></div>
        </div>
        <div class="rank-tier-labels">${barLabel}</div>
        <div style="margin-top:0.75rem;display:flex;flex-direction:column;align-items:center;gap:0.25rem;">
          <span id="rankXpCounter" style="font-size:1.4rem;font-weight:800;color:var(--rank-color,#cd7f32);letter-spacing:0.02em;">${(rankData.peakBefore || 0)} XP</span>
          <span style="font-size:0.875rem;">${xpGained}</span>
        </div>
      </div>`;
  },

  cleanup() {
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }
};
