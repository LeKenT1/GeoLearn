window.GL = window.GL || {};

GL.Leaderboard = {

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
    const src = player.avatarUrl
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
          <div class="lb-podium-name${player.isReal ? ' lb-you-name' : ''}" title="${player.name}"><span>${player.name}</span></div>
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
          <div class="lb-row-name${player.isReal ? ' lb-you-name' : ''}" title="${player.name}"><span>${player.name}</span></div>
          <div class="lb-row-title">${this._titleHtml(player.title, tier)}</div>
        </div>
        <div class="lb-row-xp-cell">
          ${this._rankBadgeIcon(rk, 68)}
          <div class="lb-row-xp">${player.xp} XP</div>
        </div>
      </div>`;
  },

  // ── Render ─────────────────────────────────────────────────────────────────

  _buildRealPlayer() {
    const profile       = GL.Profile ? GL.Profile.get() : null;
    const realXP        = (GL.UI ? GL.UI.getStats().rankedXP : 0) || 0;
    const rawName       = profile ? (profile.isGuest ? null : profile.name) : null;
    const realName      = rawName || 'Vous';
    const activeTitle   = GL.Achievements ? GL.Achievements.getActiveTitle() : null;
    const realTitle     = activeTitle ? GL.Achievements._achTitle(activeTitle) : null;
    const realTitleTier = activeTitle ? activeTitle.tier : 0;
    return {
      id: 'real', name: realName, xp: realXP, isReal: true,
      title: realTitle, titleTier: realTitleTier,
      avatarUrl: profile
        ? GL.Profile.avatarUrl(GL.Profile.migrateAvatar(profile.avatar), 160)
        : null,
    };
  },

  async _fetchRemotePlayers() {
    // Attendre que la session soit restaurée (critique au reload de page), max 4s
    if (GL.Auth?.ready) {
      await Promise.race([GL.Auth.ready, new Promise(r => setTimeout(r, 4000))]);
    }

    const client = GL.Auth?._client;
    if (!client) return [];

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 8000)
    );
    const query = client
      .from('user_data')
      .select('user_id, username, stats, profile, active_title')
      .not('username', 'is', null)
      .limit(100);

    let data, error;
    try {
      ({ data, error } = await Promise.race([query, timeout]));
    } catch (e) {
      console.warn('[Leaderboard] fetch échoué ou timeout:', e.message);
      return [];
    }
    if (error) { console.error('[Leaderboard] fetch:', error.message); return []; }

    const myUserId = GL.Auth?._user?.id;
    return (data || [])
      .filter(row => row.user_id !== myUserId)
      .map(row => {
        const xp    = parseInt((row.stats || {}).rankedXP, 10) || 0;
        let titleText = null, titleTier = 0;
        if (row.active_title) {
          try {
            const key = row.active_title;
            const achs = GL.Achievements?.ACHIEVEMENTS || [];
            const ach = achs.find(a => a.id === key);
            if (ach) { titleText = ach.title; titleTier = ach.tier || 0; }
          } catch(e) {}
        }
        const profile = row.profile || {};
        const avatarUrl = profile.avatar
          ? GL.Profile.avatarUrl(GL.Profile.migrateAvatar(profile.avatar), 160)
          : null;
        return {
          id: row.user_id,
          name: row.username || 'Joueur',
          xp,
          isReal: false,
          title: titleText,
          titleTier,
          avatarUrl,
          seed:    profile.avatar?.seed    || row.user_id,
          style:   profile.avatar?.style   || 'avataaars',
          bgColor: profile.avatar?.bgColor || null,
        };
      });
  },

  render(container) {
    const t = (k) => GL.I18N ? GL.I18N.t(k) : k;
    const label = GL.I18N ? GL.I18N.t('nav.leaderboard') : 'Classement';

    // Loader pendant le fetch Supabase
    container.innerHTML = `
      <div class="page" style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
        <div class="loader-content">
          <div class="loader-globe">🌍</div>
          <p>${GL.I18N?.lang === 'en' ? 'Loading' : 'Chargement du'} ${label}...</p>
        </div>
      </div>`;

    const realPlayer = this._buildRealPlayer();

    this._fetchRemotePlayers().then(remotePlayers => {
      const all = [realPlayer, ...remotePlayers];
      this._renderPlayers(container, all, t);
    }).catch(() => {
      this._renderPlayers(container, [realPlayer], t);
    });
  },

  _renderPlayers(container, players, t) {
    const all  = [...players].sort((a, b) => b.xp - a.xp);
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

    // Défilement des éléments trop larges (titres + noms)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      container.querySelectorAll('.lb-podium-title-text, .lb-podium-name, .lb-row-name').forEach(el => {
        const span = el.querySelector('span');
        if (!span) return;
        span.style.display = 'inline-block';
        const overflow = el.scrollWidth - el.clientWidth;
        if (overflow > 2) {
          el.style.setProperty('--lb-scroll-dist', `-${overflow}px`);
          el.classList.add('lb-marquee');
        } else {
          span.style.display = '';
        }
      });
    }));
  },
};
