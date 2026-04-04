window.GL = window.GL || {};

GL.UI = {
  // ===== TOAST =====
  toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // ===== CONTINENT HELPERS =====
  continentClass(continent) {
    const map = { Africa: 'africa', Americas: 'americas', Asia: 'asia', Europe: 'europe', Oceania: 'oceania' };
    return map[continent] || '';
  },

  continentColor(continent) {
    const map = { Africa: 'var(--africa)', Americas: 'var(--americas)', Asia: 'var(--asia)', Europe: 'var(--europe)', Oceania: 'var(--oceania)' };
    return map[continent] || 'var(--text-secondary)';
  },

  continentBadge(continent, continentFr) {
    const label = (window.GL && GL.I18N) ? GL.I18N.cont(continent) : (continentFr || continent);
    return `<span class="badge badge-${this.continentClass(continent)}">${label}</span>`;
  },

  continentEmoji(continent) {
    const map = { Africa: '🌍', Americas: '🌎', Asia: '🌏', Europe: '🌍', Oceania: '🌏' };
    return map[continent] || '🌐';
  },

  // ===== FILTER TABS HTML =====
  continentTabsHtml(selected = 'all') {
    const t = (key) => (window.GL && GL.I18N) ? GL.I18N.t(key) : key;
    const tabs = [
      { key: 'all',      label: t('cont.all')      },
      { key: 'Africa',   label: t('cont.Africa')   },
      { key: 'Americas', label: t('cont.Americas') },
      { key: 'Asia',     label: t('cont.Asia')     },
      { key: 'Europe',   label: t('cont.Europe')   },
      { key: 'Oceania',  label: t('cont.Oceania')  }
    ];
    return `<div class="filter-tabs">
      ${tabs.map(tab => `<button class="filter-tab ${selected === tab.key ? 'active' : ''}" data-c="${tab.key}">${tab.label}</button>`).join('')}
    </div>`;
  },

  // ===== FLAG HTML =====
  flagHtml(code, size = 'lg') {
    return `<span class="fi fi-${code} fi-${size}"></span>`;
  },

  // ===== STATS (localStorage + sync Supabase) =====
  saveStats(stats) {
    this.saveStatsLocal(stats);
    if (window.GL && GL.Auth && GL.Auth.isLoggedIn()) GL.Auth.scheduleSync();
  },
  saveStatsLocal(stats) {
    try { localStorage.setItem('gl_stats', JSON.stringify(stats)); } catch(e) {}
  },
  loadStats() {
    try { return JSON.parse(localStorage.getItem('gl_stats') || 'null'); } catch(e) { return null; }
  },
  defaultStats() {
    return { totalQuestions: 0, totalCorrect: 0, maxStreak: 0, currentStreak: 0, quizHistory: [], countriesStats: {}, mastery: {}, discovered: {}, peakMastered: 0, rankedXP: 0, diffScore: {} };
  },
  getStats() {
    return this.loadStats() || this.defaultStats();
  },
  recordAnswer(countryCode, correct, type) {
    if (!type) return; // stats only tracked in ranked mode
    const stats = this.getStats();
    stats.totalQuestions++;
    if (correct) stats.totalCorrect++;
    if (!stats.countriesStats[countryCode]) stats.countriesStats[countryCode] = { q: 0, c: 0 };
    stats.countriesStats[countryCode].q++;
    if (correct) stats.countriesStats[countryCode].c++;
    if (type) {
      if (!stats.mastery) stats.mastery = {};
      if (!stats.mastery[countryCode]) stats.mastery[countryCode] = {};
      const cur = stats.mastery[countryCode][type] || 0;
      stats.mastery[countryCode][type] = correct ? Math.min(3, cur + 1) : Math.max(0, cur - 1);
      const live = this.computeMastered(stats);
      if (live > (stats.peakMastered || 0)) stats.peakMastered = live;
      // 1 XP par bonne réponse en mode classement
      if (correct) stats.rankedXP = (stats.rankedXP || 0) + 1;
      // Discovered : bonne réponse unique (jamais réinitialisé)
      if (correct) {
        if (!stats.discovered) stats.discovered = {};
        if (!stats.discovered[countryCode]) stats.discovered[countryCode] = {};
        if (!stats.discovered[countryCode][type]) stats.discovered[countryCode][type] = true;
      }
    }
    // Score de difficulté : raté = +1, trouvé = /2
    if (!stats.diffScore) stats.diffScore = {};
    const prev = stats.diffScore[countryCode] || 0;
    stats.diffScore[countryCode] = correct ? prev / 2 : prev + 1;
    this.saveStats(stats);
  },

  computeMastered(stats) {
    let count = 0;
    const m = stats.mastery || {};
    for (const code in m) {
      if ((m[code].flag     || 0) >= 3) count++;
      if ((m[code].capital  || 0) >= 3) count++;
      if ((m[code].map      || 0) >= 3) count++;
    }
    return count;
  },

  TOTAL_UNIQUE: 197 * 3, // 591 — tous les pays × tous les types (flag, capital, map)
  computeDiscovered(stats) {
    const d = (stats || {}).discovered || {};
    let count = 0;
    for (const code in d) {
      if (d[code].flag)    count++;
      if (d[code].capital) count++;
      if (d[code].map)     count++;
    }
    return count;
  },

  getCurrentMastered() {
    return this.computeMastered(this.getStats());
  },

  RANK_TIERS: [
    { name: 'Bronze',  nameEn: 'Bronze',   key: 'bronze',  min: 0,   color: '#cd7f32', icon: '🥉' },
    { name: 'Argent',  nameEn: 'Silver',   key: 'silver',  min: 50,  color: '#a8a9ad', icon: '🥈' },
    { name: 'Or',      nameEn: 'Gold',     key: 'gold',    min: 150, color: '#ffd700', icon: '🥇' },
    { name: 'Platine', nameEn: 'Platinum', key: 'platine', min: 300, color: '#d0d0d0', icon: '💎' },
    { name: 'Diamant', nameEn: 'Diamond',  key: 'diamond', min: 500, color: '#88eeff', icon: '💠' },
    { name: 'Légende', nameEn: 'Legend',   key: 'legend',  min: 800, color: '#ff9f43', icon: '👑' },
  ],
  tierName(tier) {
    return (window.GL && GL.I18N && GL.I18N.lang === 'en') ? (tier.nameEn || tier.name) : tier.name;
  },
  RANK_XP_MAX: 1000, // valeur affichée comme cap pour la barre de Légende

  getRankInfo(xp, discoveredCount) {
    const disc = (discoveredCount !== undefined) ? discoveredCount : this.computeDiscovered(this.getStats());
    const tiers = this.RANK_TIERS;
    let tierIndex = 0;
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (i === tiers.length - 1) {
        // Légende : il faut avoir trouvé chaque question unique au moins une fois
        if (disc >= this.TOTAL_UNIQUE) { tierIndex = i; break; }
      } else if ((xp || 0) >= tiers[i].min) { tierIndex = i; break; }
    }
    return { tier: tiers[tierIndex], tierIndex, next: tiers[tierIndex + 1] || null };
  },
  recordQuizResult(type, score, total, continent) {
    const stats = this.getStats();
    stats.quizHistory.unshift({ type, score, total, continent, date: Date.now() });
    if (stats.quizHistory.length > 20) stats.quizHistory = stats.quizHistory.slice(0, 20);
    this.saveStats(stats);
  },

  animateRankBar(container, rankData) {
    setTimeout(() => {
      const fill = container.querySelector('#rankBarFill');
      const counter = container.querySelector('#rankXpCounter');
      if (!fill) return;
      fill.style.transition = 'width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      fill.style.width = rankData.afterPct + '%';
      if (counter) {
        const startVal = rankData.peakBefore || 0;
        const endVal = rankData.peakAfter || 0;
        if (endVal > startVal) {
          const duration = 1500;
          const startTime = performance.now();
          const tickEvery = Math.max(1, Math.ceil(rankData.gained / 5));
          let lastTickVal = startVal;
          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startVal + (endVal - startVal) * eased);
            counter.textContent = current + ' XP';
            if (current - lastTickVal >= tickEvery) {
              GL.Audio.playXpTick();
              lastTickVal = current;
            }
            if (progress < 1) requestAnimationFrame(animate);
            else counter.textContent = endVal + ' XP';
          };
          requestAnimationFrame(animate);
        } else {
          counter.textContent = endVal + ' XP';
        }
      }
    }, 250);
  },
  updateMaxStreak(streak) {
    const stats = this.getStats();
    if (streak > (stats.maxStreak || 0)) {
      stats.maxStreak = streak;
      this.saveStats(stats);
    }
  },
  saveCurrentStreak(streak) {
    const stats = this.getStats();
    stats.currentStreak = streak;
    this.saveStats(stats);
  },

  // ===== FORMAT HELPERS =====
  formatPercent(correct, total) {
    if (!total) return '0%';
    return Math.round(correct / total * 100) + '%';
  },
  starsForScore(pct) {
    if (pct >= 90) return '⭐⭐⭐';
    if (pct >= 70) return '⭐⭐';
    if (pct >= 50) return '⭐';
    return '💀';
  },

  // ===== NORMALIZE TEXT (for text answer matching) =====
  normalizeText(str) {
    if (!str) return '';
    return str.toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/['']/g, "'")
      .replace(/[-–—]/g, ' ')
      .replace(/\s+/g, ' ');
  },
  checkTextAnswer(input, correct, altCorrect, aliases) {
    const norm = this.normalizeText(input);
    if (!norm) return false;
    if (norm === this.normalizeText(correct)) return true;
    if (altCorrect && norm === this.normalizeText(altCorrect)) return true;
    // Check aliases
    if (aliases && aliases.some(a => norm === this.normalizeText(a))) return true;
    // Partial check: if correct name has parentheses, check without
    const mainPart = correct.replace(/\s*\(.*\)/, '').trim();
    if (mainPart !== correct && norm === this.normalizeText(mainPart)) return true;
    return false;
  }
};

// ===== AUDIO FEEDBACK =====
GL.Audio = {
  _ctx: null,

  _getCtx() {
    if (!this._ctx) {
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    return this._ctx;
  },

  playCorrect() {
    try {
      const ctx = this._getCtx();
      if (!ctx) return;
      // Pleasant ascending C-E-G chord
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.5);
      });
    } catch(e) {}
  },

  playLevelUp() {
    try {
      const ctx = this._getCtx();
      if (!ctx) return;

      // Fanfare façon trompette : deux sawtooth légèrement désaccordés + filtre passe-bas
      const playNote = (freq, startTime, duration, vol = 0.11) => {
        const osc1   = ctx.createOscillator();
        const osc2   = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain   = ctx.createGain();

        osc1.type = 'sawtooth'; osc1.frequency.value = freq; osc1.detune.value = -9;
        osc2.type = 'sawtooth'; osc2.frequency.value = freq; osc2.detune.value = +9;

        // Filtre passe-bas pour adoucir le son métallique cru de la scie
        filter.type = 'lowpass'; filter.frequency.value = 1900; filter.Q.value = 1.4;

        osc1.connect(filter); osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        const t = startTime;
        // Attaque courte (articulation tongued), tenue, relâche
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(vol,        t + 0.013);
        gain.gain.linearRampToValueAtTime(vol * 0.78, t + 0.055);
        gain.gain.setValueAtTime(vol * 0.78,          t + duration - 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration + 0.07);

        osc1.start(t); osc2.start(t);
        osc1.stop(t + duration + 0.09); osc2.stop(t + duration + 0.09);
      };

      // Petite caisse claire synthétique au tout début (boom festif)
      const playSnare = (startTime) => {
        const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.5);
        const src  = ctx.createBufferSource();
        const gain = ctx.createGain();
        src.buffer = buf;
        src.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.10);
        src.start(startTime); src.stop(startTime + 0.13);
      };

      const now = ctx.currentTime;
      playSnare(now);
      // Fanfare montante : C5 – E5 – G5 – C6 (finale tenue)
      playNote(523.25, now + 0.00, 0.15);
      playNote(659.25, now + 0.13, 0.15);
      playNote(783.99, now + 0.25, 0.15);
      playNote(1046.5, now + 0.37, 0.65, 0.13);
    } catch(e) {}
  },

  playWrong() {
    try {
      const ctx = this._getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.3);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
    } catch(e) {}
  },

  playXpTick() {
    try {
      const ctx = this._getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 900;
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.07, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.start(t);
      osc.stop(t + 0.1);
    } catch(e) {}
  }
};
