window.GL = window.GL || {};

GL.Leaderboard = {

  // ── Fake players ───────────────────────────────────────────────────────────
  // titleTier: 1=Plastique 2=Bronze 3=Argent 4=Or 5=Ultime
  FAKE_PLAYERS: [
    { id: 'f1',  name: 'GéoMaître',    xp: 950, style: 'avataaars',  seed: 'Felix',  bgColor: '4f63ff', title: 'Légende Vivante',        titleTier: 5 },
    { id: 'f2',  name: 'AtlasKing',    xp: 847, style: 'pixel-art',  seed: 'Henry',  bgColor: 'c1f4c5', title: 'Maître de l\'Atlas',      titleTier: 5 },
    { id: 'f3',  name: 'CaptainGlobe', xp: 640, style: 'bottts',     seed: 'r0b0t',  bgColor: 'b6e3f4', title: 'Globe-Trotter',           titleTier: 4 },
    { id: 'f4',  name: 'MapWizard',    xp: 520, style: 'fun-emoji',  seed: 'Kira',   bgColor: 'ffd5dc', title: 'Sage des Cartes',         titleTier: 4 },
    { id: 'f5',  name: 'FlagHunter',   xp: 410, style: 'adventurer', seed: 'Grace',  bgColor: 'ffdfbf', title: 'Chasseur de Drapeaux',    titleTier: 4 },
    { id: 'f6',  name: 'CapitalQueen', xp: 320, style: 'lorelei',    seed: 'Sophia', bgColor: 'd1d4f9', title: 'Reine des Capitales',     titleTier: 3 },
    { id: 'f7',  name: 'NightmareKid', xp: 280, style: 'pixel-art',  seed: 'Nate',   bgColor: '1a2234', title: 'Survivant du Cauchemar',  titleTier: 3 },
    { id: 'f8',  name: 'QuizNinja',    xp: 210, style: 'bottts',     seed: 'Leo',    bgColor: 'a7ffc4', title: 'Géographe Confirmé',      titleTier: 3 },
    { id: 'f9',  name: 'WorldWatcher', xp: 175, style: 'fun-emoji',  seed: 'Mia',    bgColor: 'ffffb1', title: 'Observateur Mondial',     titleTier: 2 },
    { id: 'f10', name: 'GlobeTrotter', xp: 130, style: 'avataaars',  seed: 'Jake',   bgColor: 'c0aede', title: 'Voyageur Passionné',      titleTier: 2 },
    { id: 'f11', name: 'MapNewbie',    xp:  80, style: 'adventurer', seed: 'Oliver', bgColor: 'b6e3f4', title: 'Apprenti Géographe',      titleTier: 1 },
    { id: 'f12', name: 'FirstSteps',   xp:  30, style: 'fun-emoji',  seed: 'Amaya',  bgColor: 'ffd5dc', title: 'En Route !',              titleTier: 1 },
  ],

  // ── Helpers ────────────────────────────────────────────────────────────────

  _fakeAvatarUrl(player, size) {
    const bg = player.bgColor ? `backgroundColor=${player.bgColor}&` : '';
    return `https://api.dicebear.com/9.x/${player.style}/svg?seed=${player.seed}&${bg}size=${size}`;
  },

  _rankKey(xp) {
    if (xp >= 800) return 'legend';
    if (xp >= 500) return 'diamond';
    if (xp >= 300) return 'platine';
    if (xp >= 150) return 'gold';
    if (xp >= 50)  return 'silver';
    return 'bronze';
  },

  _rankEntry(rankKey) {
    return (GL.RankBadges ? GL.RankBadges.RANKS : []).find(r => r.key === rankKey)
      || { key: 'bronze', name: 'Bronze', color: '#cd7f32', min: 0 };
  },

  // Classe CSS de couleur selon la rareté du titre (même système que Profil)
  _titleClass(tier) {
    const map = ['', 'ach-title-plastic', 'ach-title-bronze', 'ach-title-silver', 'ach-title-gold', 'ach-title-ultimate'];
    return map[tier] || '';
  },

  _titleHtml(title, tier) {
    if (!title) return '<span class="lb-title-none">—</span>';
    const cls = this._titleClass(tier);
    return `<span class="lb-title-text${cls ? ' ' + cls : ''}">${title}</span>`;
  },

  // Avatar avec badge SVG du rang en overlay (identique à la page Profil)
  _avatarFrameHtml(player, frameSize, avSize) {
    const rk  = this._rankKey(player.xp);
    const svg = GL.RankBadges ? GL.RankBadges.svgFrameOnly(rk) : '';
    const src = (player.isReal && player.avatarUrl)
      ? player.avatarUrl
      : this._fakeAvatarUrl(player, avSize * 2);
    const fallback = `https://api.dicebear.com/9.x/avataaars/svg?seed=default&size=${avSize * 2}`;
    return `
      <div class="rank-badge-av-frame rank-badge-av-frame--${rk} lb-no-anim"
           style="--rbaf-size:${frameSize}px;--rbaf-av-size:${avSize}px;">
        <div class="rank-badge-av-svg">${svg}</div>
        <img class="rank-badge-av-img" src="${src}" alt="${player.name}"
             onerror="this.src='${fallback}'">
      </div>`;
  },

  // Badge SVG du rang sans texte ni scintillement
  _rankBadgeIcon(rankKey, size) {
    const entry = this._rankEntry(rankKey);
    return GL.RankBadges
      ? GL.RankBadges.badgeHtml(entry, { size, showDesc: false, showXP: false })
      : '';
  },

  // ── Podium slot ────────────────────────────────────────────────────────────

  _podiumSlotHtml(player, pos) {
    if (!player) return '<div class="lb-podium-slot"></div>';
    const isFirst   = pos === 1;
    const rk        = this._rankKey(player.xp);
    const frameSize = isFirst ? 132 : 106;
    const avSize    = isFirst ?  68 :  54;
    const badgeSize = isFirst ?  80 :  64;
    const crown     = pos === 1 ? '👑' : pos === 2 ? '🥈' : '🥉';
    const tier      = player.isReal ? (player.titleTier || 0) : (player.titleTier || 0);

    return `
      <div class="lb-podium-slot lb-podium-pos-${pos}">
        <div class="lb-av-area">
          <div class="lb-podium-crown">${crown}</div>
          ${this._avatarFrameHtml(player, frameSize, avSize)}
          <div class="lb-podium-name${player.isReal ? ' lb-you-name' : ''}">${player.name}</div>
          <div class="lb-podium-title-text">${this._titleHtml(player.title, tier)}</div>
        </div>
        <div class="lb-score-card${isFirst ? ' lb-score-card-1' : ''}">
          ${this._rankBadgeIcon(rk, badgeSize)}
          <div class="lb-score-xp">${player.xp}</div>
          <div class="lb-score-label">XP</div>
        </div>
      </div>`;
  },

  // ── List row (positions 4+) ────────────────────────────────────────────────

  _rowHtml(player, pos) {
    const rk   = this._rankKey(player.xp);
    const tier = player.isReal ? (player.titleTier || 0) : (player.titleTier || 0);

    return `
      <div class="lb-row${player.isReal ? ' lb-row-you' : ''}">
        <div class="lb-row-pos">#${pos}</div>
        <div class="lb-row-av-cell">
          ${this._avatarFrameHtml(player, 78, 42)}
        </div>
        <div class="lb-row-info">
          <div class="lb-row-name${player.isReal ? ' lb-you-name' : ''}">${player.name}</div>
          <div class="lb-row-title">${this._titleHtml(player.title, tier)}</div>
        </div>
        <div class="lb-row-xp-cell">
          ${this._rankBadgeIcon(rk, 68)}
          <div class="lb-row-xp">${player.xp} XP</div>
        </div>
      </div>`;
  },

  // ── Render ─────────────────────────────────────────────────────────────────

  render(container) {
    const t = (k) => GL.I18N ? GL.I18N.t(k) : k;

    // Joueur réel
    const profile     = GL.Profile ? GL.Profile.get() : null;
    const realXP      = (GL.UI ? GL.UI.getStats().rankedXP : 0) || 0;
    const rawName     = profile ? (profile.isGuest ? null : profile.name) : null;
    const realName    = rawName || 'Vous';
    const activeTitle = GL.Achievements ? GL.Achievements.getActiveTitle() : null;
    const realTitle   = activeTitle ? activeTitle.title : null;
    const realTitleTier = activeTitle ? activeTitle.tier : 0;

    const realPlayer = {
      id: 'real', name: realName, xp: realXP, isReal: true,
      title: realTitle, titleTier: realTitleTier,
      avatarUrl: profile
        ? GL.Profile.avatarUrl(GL.Profile.migrateAvatar(profile.avatar), 160)
        : null,
    };

    // Tri global
    const all  = [...this.FAKE_PLAYERS, realPlayer].sort((a, b) => b.xp - a.xp);
    const top3 = all.slice(0, 3);
    const rest = all.slice(3);

    // Glow dynamique selon le rang du #1
    const glowColor = this._rankEntry(this._rankKey(top3[0].xp)).color;
    const glowCss   = `radial-gradient(ellipse at 50% -10%, ${glowColor}50 0%, ${glowColor}18 38%, transparent 65%)`;

    // Ordre visuel podium : 2e · 1er · 3e
    const podiumSlots = [
      { player: top3[1], pos: 2 },
      { player: top3[0], pos: 1 },
      { player: top3[2], pos: 3 },
    ];

    container.innerHTML = `
      <div class="page lb-page">

        <!-- HERO -->
        <div class="lb-hero" style="--lb-glow:${glowCss};">
          <div class="lb-glow"></div>

          <!-- PODIUM -->
          <div class="lb-podium">
            ${podiumSlots.map(s => this._podiumSlotHtml(s.player, s.pos)).join('')}
          </div>
        </div>

        <!-- LISTE positions 4+ -->
        <div class="lb-list-wrap">
          <div class="lb-list-hdr">
            <span>${t('leaderboard.col.rank')}</span>
            <span></span>
            <span>${t('leaderboard.col.player')}</span>
            <span style="text-align:right;">XP</span>
          </div>
          ${rest.map((player, i) => this._rowHtml(player, i + 4)).join('')}
        </div>

      </div>`;

    // Défilement des titres trop larges dans le podium
    requestAnimationFrame(() => {
      container.querySelectorAll('.lb-podium-title-text').forEach(el => {
        const span = el.querySelector('span');
        if (!span) return;
        // Rendre la span block le temps de mesurer sa largeur réelle
        span.style.display = 'inline-block';
        const overflow = span.offsetWidth - el.clientWidth;
        if (overflow > 2) {
          el.style.setProperty('--lb-scroll-dist', `-${overflow}px`);
          el.classList.add('lb-marquee');
        } else {
          span.style.display = '';
        }
      });
    });
  },
};
