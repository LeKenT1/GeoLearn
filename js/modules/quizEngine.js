window.GL = window.GL || {};

GL.QuizEngine = {
  // ===== UTILITIES =====
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  pickRandom(arr, n) {
    return this.shuffle(arr).slice(0, n);
  },

  pickRandomExcluding(arr, excludeCodes, n) {
    const filtered = arr.filter(c => !excludeCodes.includes(c.code));
    return this.pickRandom(filtered, n);
  },

  // Sélection aléatoire pondérée : poids = diffScore + 1 (tous les pays ont au moins 1 de chance)
  weightedPick(arr, n, diffScore) {
    const pool = [...arr];
    const result = [];
    const count = Math.min(n, pool.length);
    while (result.length < count) {
      const weights = pool.map(c => (diffScore[c.code] || 0) + 1);
      const total = weights.reduce((a, b) => a + b, 0);
      let r = Math.random() * total;
      let i = 0;
      for (; i < pool.length - 1; i++) {
        r -= weights[i];
        if (r <= 0) break;
      }
      result.push(pool[i]);
      pool.splice(i, 1);
    }
    return result;
  },

  // ===== QUESTION POOL =====
  getPool(continent, difficulty) {
    let pool = [...GL.COUNTRIES];

    if (continent && continent !== 'all') {
      pool = pool.filter(c => c.continent === continent);
    }

    if (difficulty === 'easy') {
      const common = new Set(GL.COMMON_COUNTRIES || []);
      const easy = pool.filter(c => common.has(c.code));
      // fallback to all if not enough
      if (easy.length >= 10) pool = easy;
    }

    return pool;
  },

  // Generate 4 multiple-choice options (1 correct + 3 distractors)
  generateOptions(correctCountry, pool, count = 4) {
    const distractors = this.pickRandomExcluding(pool, [correctCountry.code], count - 1);
    const options = this.shuffle([correctCountry, ...distractors]);
    return options;
  },

  // ===== QUESTION GENERATORS =====

  _t(key) { return (window.GL && GL.I18N) ? GL.I18N.t(key) : key; },

  // Flag Quiz Level 1: show flag → pick country name
  genFlagToName(country, pool) {
    return {
      type: 'mc',
      subtype: 'flag-to-name',
      country,
      options: this.generateOptions(country, pool, 4),
      label: this._t('q.flag.to.name')
    };
  },

  // Flag Quiz Level 2: show country name → pick flag
  genNameToFlag(country, pool) {
    return {
      type: 'mc',
      subtype: 'name-to-flag',
      country,
      options: this.generateOptions(country, pool, 4),
      label: this._t('q.name.to.flag')
    };
  },

  // Flag Quiz Level 3: show flag → type country name
  genFlagToText(country) {
    return {
      type: 'text',
      subtype: 'flag-to-text',
      country,
      answer: country.nameFr,
      answerAlt: country.name,
      aliases: country.aliases || [],
      label: this._t('q.flag.to.text')
    };
  },

  // Capital Quiz Level 1: show country name → pick capital
  genCountryToCapital(country, pool) {
    return {
      type: 'mc',
      subtype: 'country-to-capital',
      country,
      options: this.generateOptions(country, pool, 4),
      label: this._t('q.country.to.capital')
    };
  },

  // Capital Quiz Level 2: show capital → pick country name
  genCapitalToCountry(country, pool) {
    return {
      type: 'mc',
      subtype: 'capital-to-country',
      country,
      options: this.generateOptions(country, pool, 4),
      label: this._t('q.capital.to.country')
    };
  },

  // Capital Quiz Level 3: show country name → type capital
  genCountryToCapitalText(country) {
    return {
      type: 'text',
      subtype: 'country-to-capital-text',
      country,
      answer: country.capitalFr,
      answerAlt: country.capital,
      aliases: country.capitalAliases || [],
      label: this._t('q.country.to.capital.text')
    };
  },

  // Map Quiz: show country name or flag → click on map
  genMapQuestion(country, questionType) {
    // questionType: 'name' | 'flag' | 'both'
    let showAs = questionType;
    if (questionType === 'both') showAs = Math.random() < 0.5 ? 'name' : 'flag';
    return {
      type: 'map',
      subtype: 'map-click',
      country,
      showAs,
      label: showAs === 'flag' ? this._t('q.map.flag') : this._t('q.map.name')
    };
  },

  // ===== QUIZ SESSION =====
  buildSession(config) {
    // config: { type, level, continent, count, difficulty, questionType }
    const pool = this.getPool(config.continent, config.difficulty);

    if (pool.length < 4) {
      return null; // not enough countries
    }

    const count = Math.min(config.count || 10, pool.length);
    const selected = config.difficulty === 'hard'
      ? this.weightedPick(pool, count, GL.UI.getStats().diffScore || {})
      : this.pickRandom(pool, count);
    const questions = selected.map(country => {
      switch (config.type) {
        case 'flags':
          if (config.level === 1) return this.genFlagToName(country, pool);
          if (config.level === 2) return this.genNameToFlag(country, pool);
          if (config.level === 3) return this.genFlagToText(country);
          break;
        case 'capitals':
          if (config.level === 1) return this.genCountryToCapital(country, pool);
          if (config.level === 2) return this.genCapitalToCountry(country, pool);
          if (config.level === 3) return this.genCountryToCapitalText(country);
          break;
        case 'map':
          return this.genMapQuestion(country, config.questionType || 'name');
      }
    });

    return {
      questions: questions.filter(Boolean),
      config,
      currentIndex: 0,
      score: 0,
      streak: (GL.UI ? GL.UI.getStats().currentStreak : 0) || 0,
      maxStreak: 0,
      wrongAnswers: []
    };
  }
};
