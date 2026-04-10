window.GL = window.GL || {};

GL.Achievements = {
  TITLE_KEY:  'gl_active_title',
  SEEN_KEY:   'gl_seen_titles',

  // ─── Notification helpers ────────────────────────────────────────────────────

  _getSeenIds() {
    try { return new Set(JSON.parse(localStorage.getItem(this.SEEN_KEY) || '[]')); }
    catch { return new Set(); }
  },

  _markSeen(id) {
    const seen = this._getSeenIds();
    if (seen.has(id)) return;
    seen.add(id);
    localStorage.setItem(this.SEEN_KEY, JSON.stringify([...seen]));
    this.updateNavDot();
  },

  // Returns unlocked IDs not yet seen by the user
  _getNewTitles() {
    const unlocked = new Set(this.getUnlockedIds());
    const seen = this._getSeenIds();
    return [...unlocked].filter(id => !seen.has(id));
  },

  // Show/hide the red dot on the "Progression" nav link
  updateNavDot() {
    const el = document.getElementById('navAch');
    if (!el) return;
    el.classList.toggle('has-notif', this._getNewTitles().length > 0);
  },

  // ─── Compute live stats needed for all checks ───────────────────────────────
  computeStats() {
    const stats = GL.UI.getStats();
    const mastery = stats.mastery || {};
    const discovered = stats.discovered || {};
    const total = GL.COUNTRIES.length;

    // Mastery per type globally — uses discovered (never decreases) so progression never goes backwards
    const typeMastered = { flag: 0, capital: 0, map: 0 };
    GL.COUNTRIES.forEach(co => {
      const d = discovered[co.code];
      if (!d) return;
      if (d.flag)    typeMastered.flag++;
      if (d.capital) typeMastered.capital++;
      if (d.map)     typeMastered.map++;
    });

    // Continent progress: % of (country × type) pairs discovered — 100% = all 3 types for every country
    const continentProgress = {};
    GL.CONTINENTS.forEach(c => {
      const countries = GL.COUNTRIES.filter(co => co.continent === c);
      if (!countries.length) { continentProgress[c] = 0; return; }
      const maxPossible = countries.length * 3;
      const achieved = countries.reduce((sum, co) => {
        const d = (discovered[co.code]) || {};
        return sum + (d.flag ? 1 : 0) + (d.capital ? 1 : 0) + (d.map ? 1 : 0);
      }, 0);
      continentProgress[c] = Math.round(achieved / maxPossible * 100);
    });

    // Unique days played
    const days = new Set(
      (stats.quizHistory || []).map(h => new Date(h.date).toLocaleDateString('fr-FR'))
    );

    // Nightmare quizzes passed at 100% (perfect score)
    const nightmareGood = (stats.quizHistory || []).filter(
      h => h.type === 'nightmare' && h.total > 0 && (h.score / h.total) >= 1
    ).length;

    const challengeWins = stats.challengeWins || 0;

    // Meilleur score en une seule partie de Quiz Ultime
    const ultimatePts = stats.ultimateBest || 0;

    return {
      stats,
      mastery,
      total,
      typeMastered,
      continentProgress,
      maxStreak: stats.maxStreak || 0,
      quizCount: (stats.quizHistory || []).length,
      totalQuestions: stats.totalQuestions || 0,
      rankedXP: stats.rankedXP || 0,
      loginDays: days.size,
      nightmareGood,
      challengeWins,
      ultimatePts,
    };
  },

  // ─── Achievement groups ─────────────────────────────────────────────────────
  // Each group has a current(cs) → number and a max (the 100% threshold).
  // Each achievement in the group has an id, title, tier (1-4), and threshold.
  // tier 5 = ultimate (rainbow).
  GROUPS: [
    {
      id: 'africa', label: 'Afrique', labelEn: 'Africa', emoji: '🌍', colorVar: '--africa',
      current: cs => cs.continentProgress.Africa,
      max: 100, unit: '%',
      achievements: [
        { id: 'africa_25',  title: 'Curieux d\'Afrique',    titleEn: 'Africa Curious',      tier: 1, threshold: 25  },
        { id: 'africa_50',  title: 'Explorateur d\'Afrique', titleEn: 'Africa Explorer',    tier: 2, threshold: 50  },
        { id: 'africa_75',  title: 'Aventurier d\'Afrique', titleEn: 'Africa Adventurer',   tier: 3, threshold: 75  },
        { id: 'africa_100', title: 'Champion d\'Afrique',   titleEn: 'Africa Champion',     tier: 4, threshold: 100 },
      ]
    },
    {
      id: 'americas', label: 'Amériques', labelEn: 'Americas', emoji: '🌎', colorVar: '--americas',
      current: cs => cs.continentProgress.Americas,
      max: 100, unit: '%',
      achievements: [
        { id: 'americas_25',  title: 'Curieux des Amériques',    titleEn: 'Americas Curious',     tier: 1, threshold: 25  },
        { id: 'americas_50',  title: 'Explorateur des Amériques', titleEn: 'Americas Explorer',   tier: 2, threshold: 50  },
        { id: 'americas_75',  title: 'Aventurier des Amériques', titleEn: 'Americas Adventurer',  tier: 3, threshold: 75  },
        { id: 'americas_100', title: 'Champion des Amériques',   titleEn: 'Americas Champion',    tier: 4, threshold: 100 },
      ]
    },
    {
      id: 'asia', label: 'Asie', labelEn: 'Asia', emoji: '🌏', colorVar: '--asia',
      current: cs => cs.continentProgress.Asia,
      max: 100, unit: '%',
      achievements: [
        { id: 'asia_25',  title: 'Curieux d\'Asie',    titleEn: 'Asia Curious',      tier: 1, threshold: 25  },
        { id: 'asia_50',  title: 'Explorateur d\'Asie', titleEn: 'Asia Explorer',    tier: 2, threshold: 50  },
        { id: 'asia_75',  title: 'Aventurier d\'Asie', titleEn: 'Asia Adventurer',   tier: 3, threshold: 75  },
        { id: 'asia_100', title: 'Champion d\'Asie',   titleEn: 'Asia Champion',     tier: 4, threshold: 100 },
      ]
    },
    {
      id: 'europe', label: 'Europe', labelEn: 'Europe', emoji: '🌍', colorVar: '--europe',
      current: cs => cs.continentProgress.Europe,
      max: 100, unit: '%',
      achievements: [
        { id: 'europe_25',  title: 'Curieux d\'Europe',    titleEn: 'Europe Curious',      tier: 1, threshold: 25  },
        { id: 'europe_50',  title: 'Explorateur d\'Europe', titleEn: 'Europe Explorer',    tier: 2, threshold: 50  },
        { id: 'europe_75',  title: 'Aventurier d\'Europe', titleEn: 'Europe Adventurer',   tier: 3, threshold: 75  },
        { id: 'europe_100', title: 'Champion d\'Europe',   titleEn: 'Europe Champion',     tier: 4, threshold: 100 },
      ]
    },
    {
      id: 'oceania', label: 'Océanie', labelEn: 'Oceania', emoji: '🌏', colorVar: '--oceania',
      current: cs => cs.continentProgress.Oceania,
      max: 100, unit: '%',
      achievements: [
        { id: 'oceania_25',  title: 'Curieux d\'Océanie',    titleEn: 'Oceania Curious',     tier: 1, threshold: 25  },
        { id: 'oceania_50',  title: 'Explorateur d\'Océanie', titleEn: 'Oceania Explorer',   tier: 2, threshold: 50  },
        { id: 'oceania_75',  title: 'Aventurier d\'Océanie', titleEn: 'Oceania Adventurer',  tier: 3, threshold: 75  },
        { id: 'oceania_100', title: 'Champion d\'Océanie',   titleEn: 'Oceania Champion',    tier: 4, threshold: 100 },
      ]
    },
    {
      id: 'flags', label: 'Drapeaux', labelEn: 'Flags', emoji: '🏁', colorVar: '--accent',
      current: cs => Math.round(cs.typeMastered.flag / cs.total * 100),
      max: 100, unit: '%',
      achievements: [
        { id: 'flags_25',  title: 'Apprenti Étendard', titleEn: 'Flag Apprentice',      tier: 1, threshold: 25  },
        { id: 'flags_50',  title: 'Étendard',          titleEn: 'Standard Bearer',      tier: 2, threshold: 50  },
        { id: 'flags_75',  title: 'Expert Étendard',   titleEn: 'Flag Expert',          tier: 3, threshold: 75  },
        { id: 'flags_100', title: 'Grand Étendard',    titleEn: 'Grand Standard Bearer', tier: 4, threshold: 100 },
      ]
    },
    {
      id: 'capitals', label: 'Capitales', labelEn: 'Capitals', emoji: '🏛️', colorVar: '--accent',
      current: cs => Math.round(cs.typeMastered.capital / cs.total * 100),
      max: 100, unit: '%',
      achievements: [
        { id: 'capitals_25',  title: 'Apprenti Diplomate', titleEn: 'Diplomat Apprentice', tier: 1, threshold: 25  },
        { id: 'capitals_50',  title: 'Diplomate',          titleEn: 'Diplomat',            tier: 2, threshold: 50  },
        { id: 'capitals_75',  title: 'Expert Diplomate',   titleEn: 'Expert Diplomat',     tier: 3, threshold: 75  },
        { id: 'capitals_100', title: 'Grand Diplomate',    titleEn: 'Grand Diplomat',      tier: 4, threshold: 100 },
      ]
    },
    {
      id: 'map', label: 'Carte', labelEn: 'Map', emoji: '📍', colorVar: '--accent',
      current: cs => Math.round(cs.typeMastered.map / cs.total * 100),
      max: 100, unit: '%',
      achievements: [
        { id: 'map_25',  title: 'Apprenti Cartographe', titleEn: 'Cartography Apprentice', tier: 1, threshold: 25  },
        { id: 'map_50',  title: 'Cartographe',          titleEn: 'Cartographer',           tier: 2, threshold: 50  },
        { id: 'map_75',  title: 'Expert Cartographe',   titleEn: 'Expert Cartographer',    tier: 3, threshold: 75  },
        { id: 'map_100', title: 'Grand Cartographe',    titleEn: 'Grand Cartographer',     tier: 4, threshold: 100 },
      ]
    },
    {
      id: 'nightmare', label: 'Quiz Cauchemar', labelEn: 'Nightmare Quiz', emoji: '💀', colorVar: null,
      colorHex: '#9b59b6',
      current: cs => cs.nightmareGood,
      max: 25, unit: ' quiz réussis', unitEn: ' quizzes passed',
      achievements: [
        { id: 'nightmare_1',  title: 'Survivant',              titleEn: 'Survivor',        tier: 1, threshold: 1  },
        { id: 'nightmare_5',  title: 'Guerrier du Cauchemar',  titleEn: 'Nightmare Warrior', tier: 2, threshold: 5  },
        { id: 'nightmare_10', title: 'Seigneur du Cauchemar',  titleEn: 'Nightmare Lord',  tier: 3, threshold: 10 },
        { id: 'nightmare_25', title: 'Maître de l\'Enfer',     titleEn: 'Hell Master',     tier: 4, threshold: 25 },
      ]
    },
    {
      id: 'streak', label: 'Série (classé)', labelEn: 'Streak (ranked)', emoji: '🔥', colorVar: null,
      colorHex: '#ff6b35',
      current: cs => cs.maxStreak,
      max: 50, unit: ' bonnes réponses d\'affilée', unitEn: ' correct answers in a row',
      achievements: [
        { id: 'streak_5',  title: 'En Feu',        titleEn: 'On Fire',       tier: 1, threshold: 5  },
        { id: 'streak_10', title: 'Torche Humaine', titleEn: 'Living Torch', tier: 2, threshold: 10 },
        { id: 'streak_25', title: 'Invincible',     titleEn: 'Invincible',   tier: 3, threshold: 25 },
        { id: 'streak_50', title: 'Inarrêtable',    titleEn: 'Unstoppable',  tier: 4, threshold: 50 },
      ]
    },
    {
      id: 'quizcount', label: 'Quiz complétés', labelEn: 'Completed Quizzes', emoji: '🎯', colorVar: '--accent',
      current: cs => cs.quizCount,
      max: 100, unit: ' quiz', unitEn: ' quizzes',
      achievements: [
        { id: 'quiz_5',   title: 'Studieux',     titleEn: 'Studious',     tier: 1, threshold: 5   },
        { id: 'quiz_20',  title: 'intello',      titleEn: 'Nerd',         tier: 2, threshold: 20  },
        { id: 'quiz_50',  title: 'fast learner', titleEn: 'Fast Learner', tier: 3, threshold: 50  },
        { id: 'quiz_100', title: 'Maître Quiz',  titleEn: 'Quiz Master',  tier: 4, threshold: 100 },
      ]
    },
    {
      id: 'questions', label: 'Questions répondues', labelEn: 'Questions Answered', emoji: '📝', colorVar: '--accent',
      current: cs => cs.totalQuestions,
      max: 2500, unit: ' questions',
      achievements: [
        { id: 'questions_100',  title: 'Apprenti',       titleEn: 'Apprentice',    tier: 1, threshold: 100  },
        { id: 'questions_500',  title: 'Studieux',       titleEn: 'Studious',      tier: 2, threshold: 500  },
        { id: 'questions_1000', title: 'Acharné',        titleEn: 'Dedicated',     tier: 3, threshold: 1000 },
        { id: 'questions_2500', title: 'Encyclopédiste', titleEn: 'Encyclopedist', tier: 4, threshold: 2500 },
      ]
    },
    {
      id: 'login', label: 'Connexions', labelEn: 'Logins', emoji: '📅', colorVar: null,
      colorHex: '#2ecc71',
      current: cs => cs.loginDays,
      max: 11, unit: ' jours joués', unitEn: ' days played',
      achievements: [
        { id: 'login_2',  title: 'Assidu',    titleEn: 'Assiduous',  tier: 1, threshold: 2  },
        { id: 'login_5',  title: 'Fidèle',    titleEn: 'Faithful',   tier: 2, threshold: 5  },
        { id: 'login_8',  title: 'Dédié',     titleEn: 'Dedicated',  tier: 3, threshold: 8  },
        { id: 'login_11', title: 'Passionné', titleEn: 'Passionate', tier: 4, threshold: 11 },
      ]
    },
    {
      id: 'xp', label: 'Pts Classement', labelEn: 'Ranked Pts', emoji: '⭐', colorVar: null,
      colorHex: '#ffd700',
      current: cs => cs.rankedXP,
      max: 800, unit: ' Pts',
      achievements: [
        { id: 'xp_50',  title: 'Novice',    titleEn: 'Novice',     tier: 1, threshold: 50  },
        { id: 'xp_150', title: 'Confirmé',  titleEn: 'Confirmed',  tier: 2, threshold: 150 },
        { id: 'xp_300', title: 'Expert',    titleEn: 'Expert',     tier: 3, threshold: 300 },
        { id: 'xp_800', title: 'Légende',   titleEn: 'Legend',     tier: 4, threshold: 800 },
      ]
    },
    {
      id: 'challenge', label: 'Défis gagnés', labelEn: 'Challenges Won', emoji: '⚔️', colorVar: null,
      colorHex: '#ef4444',
      current: cs => cs.challengeWins,
      max: 20, unit: ' défis gagnés', unitEn: ' challenges won',
      achievements: [
        { id: 'challenge_1',  title: 'Duelliste',       titleEn: 'Duelist',       tier: 1, threshold: 1  },
        { id: 'challenge_5',  title: 'Combattant',      titleEn: 'Fighter',       tier: 2, threshold: 5  },
        { id: 'challenge_10', title: 'Chevalier',       titleEn: 'Knight',        tier: 3, threshold: 10 },
        { id: 'challenge_20', title: 'Champion du Duel', titleEn: 'Duel Champion', tier: 4, threshold: 20 },
      ]
    },
    {
      id: 'ultimatequiz', label: 'Quiz Ultime', labelEn: 'Ultimate Quiz', emoji: '👑', colorVar: null,
      colorHex: '#ec4899',
      current: cs => cs.ultimatePts,
      max: 591, unit: ' pts', unitEn: ' pts',
      achievements: [
        { id: 'ultimate_50',  title: 'Prétendant au Trône', titleEn: 'Throne Pretender',  tier: 1, threshold: 50  },
        { id: 'ultimate_200', title: 'Conquérant de l\'Atlas', titleEn: 'Atlas Conqueror', tier: 2, threshold: 200 },
        { id: 'ultimate_350', title: 'Seigneur des Nations', titleEn: 'Lord of Nations',  tier: 3, threshold: 350 },
        { id: 'ultimate_591', title: 'Roi',                   titleEn: 'King',              tier: 4, threshold: 591 },
      ]
    },
  ],

  // Ultimate group — checked separately
  ULTIMATE: {
    id: 'ultimate', label: 'Succès Ultime', emoji: '🌟',
    title: 'Maître du Monde',
    titleEn: 'World Master',
    tier: 5,
    desc: 'Débloquer tous les succès Or (100%)',
  },

  // ─── Helpers ────────────────────────────────────────────────────────────────

  isUltimateUnlocked(cs) {
    // All tier-4 achievements must be reached
    return this.GROUPS.every(g => {
      const t4 = g.achievements.find(a => a.tier === 4);
      return t4 && g.current(cs) >= t4.threshold;
    });
  },

  getUnlockedIds() {
    const cs = this.computeStats();
    const ids = [];
    this.GROUPS.forEach(g => {
      g.achievements.forEach(a => {
        if (g.current(cs) >= a.threshold) ids.push(a.id);
      });
    });
    if (this.isUltimateUnlocked(cs)) ids.push('ultimate');
    return ids;
  },

  // Flat list of ALL achievement defs (for lookup)
  allDefs() {
    const all = [];
    this.GROUPS.forEach(g => g.achievements.forEach(a => all.push({ ...a, group: g })));
    all.push({ ...this.ULTIMATE, group: null });
    return all;
  },

  // The best unequipped-fallback title
  _bestTitle(cs) {
    // ultimate first, then tier-4, then tier-3 … pick first found
    if (this.isUltimateUnlocked(cs)) return this.ULTIMATE;
    for (let tier = 4; tier >= 1; tier--) {
      for (const g of this.GROUPS) {
        const a = g.achievements.find(x => x.tier === tier);
        if (a && g.current(cs) >= a.threshold) return a;
      }
    }
    return null;
  },

  getActiveTitle() {
    const cs = this.computeStats();
    const equipped = localStorage.getItem(this.TITLE_KEY);
    if (equipped) {
      const unlockedIds = new Set(this.getUnlockedIds());
      if (unlockedIds.has(equipped)) {
        const def = this.allDefs().find(d => d.id === equipped);
        if (def) return def;
      }
    }
    return this._bestTitle(cs);
  },

  setActiveTitle(id) {
    localStorage.setItem(this.TITLE_KEY, id);
  },

  // ─── Debug : injecte des stats factices pour débloquer tous les succès ──────
  _debugUnlockAll() {
    const stats = GL.UI.defaultStats();
    stats.totalQuestions = 3000;
    stats.totalCorrect = 2700;
    stats.maxStreak = 60;
    stats.rankedXP = 1000;
    GL.COUNTRIES.forEach(co => {
      stats.countriesStats[co.code] = { q: 10, c: 10 };
      stats.mastery[co.code] = { flag: 3, capital: 3, map: 3 };
    });
    // 100 quiz sur 30 jours différents, dont 25 cauchemar réussis
    const now = Date.now();
    stats.quizHistory = [];
    for (let i = 0; i < 100; i++) {
      const dayOffset = (i % 30) * 24 * 60 * 60 * 1000;
      const type = i < 25 ? 'nightmare' : ['flags', 'capitals', 'map'][i % 3];
      stats.quizHistory.push({ type, score: 9, total: 10, continent: 'all', date: now - dayOffset });
    }
    GL.UI.saveStats(stats);
  },

  // ─── Title badge HTML (used in profile) ─────────────────────────────────────
  titleBadgeHtml(titleDef) {
    if (!titleDef) return '';
    const label = this._achTitle(titleDef);
    if (titleDef.tier === 5) {
      return `<span class="ach-title-badge ach-title-ultimate">🌟 ${label}</span>`;
    }
    const tierClass = ['', 'ach-title-plastic', 'ach-title-bronze', 'ach-title-silver', 'ach-title-gold'][titleDef.tier] || '';
    return `<span class="ach-title-badge ${tierClass}">${label}</span>`;
  },

  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },

  // Returns the localized title for an achievement/ultimate definition
  _achTitle(def) {
    if (!def) return '';
    if (GL.I18N && GL.I18N.lang === 'en' && def.titleEn) return def.titleEn;
    return def.title;
  },

  // Returns the localized label for a group
  _groupLabel(g) {
    if (GL.I18N && GL.I18N.lang === 'en' && g.labelEn) return g.labelEn;
    return g.label;
  },

  // Returns the localized unit for a group
  _groupUnit(g) {
    if (GL.I18N && GL.I18N.lang === 'en' && g.unitEn) return g.unitEn;
    return g.unit;
  },

  // ─── Render achievements page ────────────────────────────────────────────────
  render(container) {
    const t = this._t.bind(this);
    const cs = this.computeStats();
    const ultimateUnlocked = this.isUltimateUnlocked(cs);
    const equipped = localStorage.getItem(this.TITLE_KEY) || '';
    const unlockedIds = new Set(this.getUnlockedIds());

    const totalAch = this.GROUPS.reduce((s, g) => s + g.achievements.length, 0) + 1;
    const unlockedCount = unlockedIds.size;

    // ── Tier labels / colors ──
    const TIER_INFO = [
      null,
      { label: t('ach.tier.plastic'),  cls: 'ach-tier-plastic'  },
      { label: t('ach.tier.bronze'),   cls: 'ach-tier-bronze'   },
      { label: t('ach.tier.silver'),   cls: 'ach-tier-silver'   },
      { label: t('ach.tier.gold'),     cls: 'ach-tier-gold'     },
      { label: t('ach.tier.ultimate'), cls: 'ach-tier-ultimate' },
    ];

    // ── Group card HTML ──
    const newTitles = new Set(this._getNewTitles());
    const groupCardHtml = (g) => {
      const val = g.current(cs);
      const color = g.colorVar ? `var(${g.colorVar})` : g.colorHex;
      const barPct = Math.min(100, Math.round(val / g.max * 100));
      const unit = this._groupUnit(g);

      const achRows = g.achievements.map(a => {
        const done = val >= a.threshold;
        const isEquipped = equipped === a.id;
        const ti = TIER_INFO[a.tier];
        const isNew = done && newTitles.has(a.id);
        return `
          <div class="ach-row ${done ? 'ach-row-unlocked' : 'ach-row-locked'}${isNew ? ' ach-row-new' : ''}"
               data-ach-id="${a.id}" ${done ? 'role="button" tabindex="0"' : ''}>
            <div class="ach-row-left">
              <span class="ach-tier-pip ${ti.cls}"></span>
              <div class="ach-row-text">
                <span class="ach-row-title">
                  ${done ? '' : '🔒 '}<strong class="${done && a.tier === 4 ? 'ach-title-diamond' : ''}">${this._achTitle(a)}</strong>
                </span>
                <span class="ach-row-tier">${ti.label} · ${a.threshold}${unit}</span>
              </div>
            </div>
            ${done ? `
              <button class="ach-equip-btn ${isEquipped ? 'active' : ''}" data-equip="${a.id}">
                ${isEquipped ? t('ach.equipped') : t('ach.equip')}
              </button>` : `
              <span class="ach-row-progress-text">${val} / ${a.threshold}${unit}</span>`}
            ${isNew ? '<span class="ach-notif-dot"></span>' : ''}
          </div>`;
      }).join('');

      return `
        <div class="ach-group-card">
          <div class="ach-group-header">
            <span class="ach-group-emoji">${g.emoji}</span>
            <span class="ach-group-label">${this._groupLabel(g)}</span>
            <span class="ach-group-val" style="color:${color};">${val}${g.unit === '%' ? '%' : ''}</span>
          </div>
          <div class="ach-group-bar-track">
            <div class="ach-group-bar-fill" style="width:${barPct}%;background:${color};"></div>
            ${g.achievements.map(a => `
              <div class="ach-group-bar-mark ${val >= a.threshold ? 'passed' : ''}"
                   style="left:${Math.round(a.threshold / g.max * 100)}%;"
                   title="${a.threshold}${unit}"></div>`).join('')}
          </div>
          <div class="ach-rows">${achRows}</div>
        </div>`;
    };

    // ── Ultimate card HTML ──
    const ultimateCardHtml = () => {
      const isEquipped = equipped === 'ultimate';
      const isNew = ultimateUnlocked && newTitles.has('ultimate');
      return `
        <div class="ach-group-card ach-group-ultimate ${ultimateUnlocked ? 'ach-group-ultimate-unlocked' : ''}">
          <div class="ach-group-header">
            <span class="ach-group-emoji" style="font-size:2rem;">🌟</span>
            <span class="ach-group-label" style="font-size:1.1rem;">${t('ach.ultimate.label')}</span>
          </div>
          <div class="ach-rows">
            <div class="ach-row ${ultimateUnlocked ? 'ach-row-unlocked' : 'ach-row-locked'}${isNew ? ' ach-row-new' : ''}"
                 data-ach-id="ultimate" ${ultimateUnlocked ? 'role="button" tabindex="0"' : ''}>
              <div class="ach-row-left">
                <span class="ach-tier-pip ach-tier-ultimate"></span>
                <div class="ach-row-text">
                  ${ultimateUnlocked
                    ? `<span class="ach-row-title"><strong class="ach-title-ultimate">🌟 ${this._achTitle(this.ULTIMATE)}</strong></span>`
                    : `<span class="ach-row-title">🔒 <strong>${this._achTitle(this.ULTIMATE)}</strong></span>`}
                  <span class="ach-row-tier">${t('ach.tier.ultimate')} · ${t('ach.ultimate.desc')}</span>
                </div>
              </div>
              ${ultimateUnlocked ? `
                <button class="ach-equip-btn ${isEquipped ? 'active' : ''}" data-equip="ultimate">
                  ${isEquipped ? t('ach.equipped') : t('ach.equip')}
                </button>` : `
                <span class="ach-row-progress-text">${unlockedCount - (ultimateUnlocked ? 1 : 0)} / ${totalAch - 1}</span>`}
              ${isNew ? '<span class="ach-notif-dot"></span>' : ''}
            </div>
          </div>
        </div>`;
    };

    // ── Rank progression bar ──
    const rankProgressBarHtml = () => {
      const xp = cs.rankedXP;
      const tiers = GL.UI.RANK_TIERS;
      const TOTAL = tiers[tiers.length - 1].min; // 800
      const currentInfo = GL.UI.getRankInfo(xp);
      const currentTier = currentInfo.tier;
      const fillPct = Math.min(100, xp / TOTAL * 100).toFixed(2);

      const markers = tiers.map(r => {
        const posPct = (r.min / TOTAL * 100).toFixed(2);
        const isPassed = xp >= r.min;
        const isActive = r.name === currentTier.name;
        const label = GL.UI ? GL.UI.tierName(r) : r.name;
        const rbEntry = GL.RankBadges ? GL.RankBadges.RANKS.find(rb => rb.name === r.name) : null;
        const badgeSvg = rbEntry && GL.RankBadges ? GL.RankBadges.svgFrameOnly(rbEntry.key) : r.icon;
        const glowVars = isPassed ? `--dot-glow:${r.color};--icon-glow:${r.color};` : '';
        return `
          <div class="rank-pb-marker${isActive ? ' active' : ''}" style="left:${posPct}%;${glowVars}">
            <div class="rank-pb-dot" style="background:${isPassed ? r.color : 'var(--bg-surface)'};border-color:${r.color};${isActive ? `box-shadow:0 0 8px ${r.color};` : ''}"></div>
            <div class="rank-pb-icon rank-pb-icon--${isPassed ? 'unlocked' : 'locked'}">${badgeSvg}</div>
            <div class="rank-pb-label" style="color:${isPassed ? r.color : 'var(--text-muted)'};">${label}</div>
          </div>`;
      }).join('');

      const nextInfo = currentInfo.next;
      const nextLine = nextInfo ? t('stats.rank.next').replace('{n}', nextInfo.min) : t('stats.rank.max');

      return `
        <div class="rank-pb-section">
          <div class="rank-pb-title">${t('result.rank.progress')}</div>
          <div class="rank-pb-xp-big" style="color:${currentTier.color};">${xp}<span class="rank-pb-xp-unit"> Pts</span></div>
          <div class="rank-pb-info">${nextLine}</div>
          <div class="rank-pb-track-wrap">
            <div class="rank-pb-track">
              <div class="rank-pb-fill" style="width:${fillPct}%;--rank-fill-color:${currentTier.color};"></div>
            </div>
            ${markers}
          </div>
        </div>`;
    };

    container.innerHTML = `
      <div class="page">
        <div class="page-title">${t('ach.title')}</div>
        <p class="page-subtitle">${t('ach.subtitle')}</p>

        ${rankProgressBarHtml()}

        <p style="font-size:0.8rem;color:var(--text-muted);background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:0.6rem 0.9rem;margin-bottom:1rem;">
          💡 ${t('ach.rank.info')}
        </p>

        <p class="ach-hint">${t('ach.hint')}</p>

        <h3 class="ach-section-title">${t('ach.section.continents')} <span class="info-tooltip" data-tooltip="${t('ach.progress.continent.info')}">ℹ️</span></h3>
        <div class="ach-grid">
          ${this.GROUPS.filter(g => ['africa','americas','asia','europe','oceania'].includes(g.id)).map(groupCardHtml).join('')}
        </div>

        <h3 class="ach-section-title">${t('ach.section.quiztype')} <span class="info-tooltip" data-tooltip="${t('ach.progress.type.info')}">ℹ️</span></h3>
        <div class="ach-grid">
          ${this.GROUPS.filter(g => ['flags','capitals','map','nightmare','ultimatequiz'].includes(g.id)).map(groupCardHtml).join('')}
        </div>

        <h3 class="ach-section-title">${t('ach.section.progress')}</h3>
        <div class="ach-grid">
          ${this.GROUPS.filter(g => ['streak','quizcount','questions','login','xp'].includes(g.id)).map(groupCardHtml).join('')}
        </div>

        <h3 class="ach-section-title">⚔️ Défi 1V1</h3>
        <div class="ach-grid">
          ${this.GROUPS.filter(g => g.id === 'challenge').map(groupCardHtml).join('')}
        </div>

        <h3 class="ach-section-title">${t('ach.section.ultimate')}</h3>
        ${ultimateCardHtml()}
      </div>
    `;

    // ── Bind equip buttons ──
    container.querySelectorAll('[data-equip]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.equip;
        this.setActiveTitle(id);
        GL.UI.toast(t('ach.equipped.msg'), 'success');
        if (GL.Profile) GL.Profile.updateNavAvatar(GL.Profile.get() || GL.Profile.defaultProfile('Invité', true));
        this.render(container);
      });
    });

    // ── Dismiss notification dot on hover ──
    container.querySelectorAll('.ach-row-new').forEach(row => {
      row.addEventListener('mouseenter', () => {
        const id = row.dataset.achId;
        if (!id) return;
        this._markSeen(id);
        row.classList.remove('ach-row-new');
        const dot = row.querySelector('.ach-notif-dot');
        if (dot) dot.remove();
      }, { once: true });
    });

    this.updateNavDot();

  },
};
