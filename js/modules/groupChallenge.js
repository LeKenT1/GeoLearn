window.GL = window.GL || {};

GL.GroupChallenge = {
  MAX_PLAYERS: 4,
  _globalChannel: null,
  _gcChannel:     null,

  _t(key)     { return GL.I18N ? GL.I18N.t(key) : key; },
  _n(country) { return GL.I18N ? GL.I18N.name(country) : country.nameFr; },

  // ── Init ──────────────────────────────────────────────────────────────────────
  init() {
    GL.Auth.ready.then(() => {
      if (GL.Auth.isLoggedIn()) this._startGlobalListener();
      GL.Auth?._client?.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN')  this._startGlobalListener();
        if (event === 'SIGNED_OUT') this._stopGlobalListener();
      });
    });
  },

  _startGlobalListener() {
    const client = GL.Auth?._client;
    const userId = GL.Auth?._user?.id;
    if (!client || !userId) return;
    if (this._globalChannel) client.removeChannel(this._globalChannel);
    this._globalChannel = client
      .channel('gl-gc-incoming')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'group_challenge_participants',
        filter: `user_id=eq.${userId}`,
      }, (p) => this._onIncomingInvite(p.new))
      .subscribe();
  },

  _stopGlobalListener() {
    if (this._globalChannel && GL.Auth?._client) {
      GL.Auth._client.removeChannel(this._globalChannel);
      this._globalChannel = null;
    }
  },

  _unsubscribeGC() {
    if (this._gcChannel && GL.Auth?._client) {
      GL.Auth._client.removeChannel(this._gcChannel);
      this._gcChannel = null;
    }
  },

  async _onIncomingInvite(participant) {
    const client = GL.Auth._client;
    const { data: challenge } = await client
      .from('group_challenges').select('*').eq('id', participant.challenge_id).single();
    if (!challenge || challenge.status !== 'pending') return;
    if (challenge.creator_id === GL.Auth._user?.id) return; // créateur déjà accepté
    const { data: creator } = await client
      .from('user_data').select('username').eq('user_id', challenge.creator_id).single();
    const name = creator?.username || 'Un joueur';
    GL.UI.toast(`🏆 ${name} vous invite à un défi en groupe !`, 'info', 6000);
    this._showInviteModal(challenge, participant.id, name);
  },

  _showInviteModal(challenge, participantId, creatorName) {
    document.getElementById('gc-invite-modal')?.remove();
    const cfg = challenge.config || {};
    const modeLabel = { flags: '🏁 Drapeaux', capitals: '🏛️ Capitales', map: '📍 Carte', nightmare: '💀 Cauchemar', random: '🎲 Aléatoire' }[cfg.mode] || cfg.mode;
    const contLabel = cfg.continent === 'all' ? 'Monde entier' : (GL.I18N?.cont(cfg.continent) ?? cfg.continent);
    const diffLabel = { easy: 'Facile', normal: 'Normal', hard: 'Difficile' }[cfg.difficulty] || cfg.difficulty;

    const modal = document.createElement('div');
    modal.id = 'gc-invite-modal';
    modal.className = 'ch-modal-overlay';
    modal.innerHTML = `
      <div class="ch-modal">
        <div class="ch-modal-icon">🏆</div>
        <h3 class="ch-modal-title">Défi en groupe !</h3>
        <p class="ch-modal-from"><strong>${creatorName}</strong> vous invite</p>
        <div class="ch-modal-tags">
          <span class="challenge-config-tag">${modeLabel}</span>
          <span class="challenge-config-tag">${cfg.count || '?'} pays</span>
          <span class="challenge-config-tag">${contLabel}</span>
          <span class="challenge-config-tag">${diffLabel}</span>
          <span class="challenge-config-tag">⚠️ ${cfg.penalty ?? 7}s pénalité</span>
        </div>
        <div class="ch-modal-countdown"><span id="gcModalCountdown">60</span>s pour répondre</div>
        <div class="ch-modal-btns">
          <button class="btn btn-primary" id="gcModalAccept">Accepter 🏆</button>
          <button class="btn btn-ghost"   id="gcModalDecline">Refuser</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    let rem = 60;
    const ticker = setInterval(() => {
      const el = document.getElementById('gcModalCountdown');
      if (el) el.textContent = --rem;
      if (rem <= 0) {
        clearInterval(ticker); modal.remove();
        this._respondToInvite(participantId, 'declined');
      }
    }, 1000);

    modal.querySelector('#gcModalAccept').addEventListener('click', async () => {
      clearInterval(ticker); modal.remove();
      await this._respondToInvite(participantId, 'accepted');
      await this._tryActivateIfAllResponded(challenge.id);
      GL.Router.navigate(`/quiz/defi-groupe/${challenge.id}`);
    });
    modal.querySelector('#gcModalDecline').addEventListener('click', async () => {
      clearInterval(ticker); modal.remove();
      await this._respondToInvite(participantId, 'declined');
      await this._tryActivateIfAllResponded(challenge.id);
    });
  },

  // ── Écran de configuration ────────────────────────────────────────────────────
  render(container) {
    GL.WorldMap.cleanup();
    this._unsubscribeGC();
    const t = this._t.bind(this);

    container.innerHTML = `
      <div class="page">
        <div class="quiz-setup">
          <div class="quiz-setup-title">🏆 Défi en groupe <span class="beta-badge">Béta</span></div>
          <p class="quiz-setup-subtitle">Défiez jusqu'à ${this.MAX_PLAYERS} joueurs — classement final pour tous</p>

          <div class="setup-section">
            <div class="setup-section-label">Mode de jeu</div>
            <div class="challenge-mode-grid">
              <div class="challenge-mode-card selected" data-mode="flags"><div class="challenge-mode-icon">🏁</div><div class="challenge-mode-name">Drapeaux</div></div>
              <div class="challenge-mode-card" data-mode="capitals"><div class="challenge-mode-icon">🏛️</div><div class="challenge-mode-name">Capitales</div></div>
              <div class="challenge-mode-card" data-mode="map"><div class="challenge-mode-icon">📍</div><div class="challenge-mode-name">Carte</div></div>
              <div class="challenge-mode-card" data-mode="nightmare"><div class="challenge-mode-icon">💀</div><div class="challenge-mode-name">Cauchemar</div></div>
              <div class="challenge-mode-card" data-mode="random"><div class="challenge-mode-icon">🎲</div><div class="challenge-mode-name">Aléatoire</div></div>
            </div>
          </div>

          <div class="setup-section" id="gcTypeSection">
            <div class="setup-section-label">Type</div>
            <div class="challenge-mode-grid">
              <div class="challenge-mode-card selected" data-type="choice"><div class="challenge-mode-icon">🔢</div><div class="challenge-mode-name">Choix</div></div>
              <div class="challenge-mode-card" data-type="write"><div class="challenge-mode-icon">✏️</div><div class="challenge-mode-name">Écrire</div></div>
              <div class="challenge-mode-card" data-type="random"><div class="challenge-mode-icon">🎲</div><div class="challenge-mode-name">Aléatoire</div></div>
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
              <button class="count-btn" data-count="all">Tous</button>
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
            <div class="setup-section-label">Pénalité par erreur / passage</div>
            <div class="count-selector">
              <button class="count-btn penalty-btn" data-penalty="3">3s</button>
              <button class="count-btn penalty-btn" data-penalty="5">5s</button>
              <button class="count-btn penalty-btn selected" data-penalty="7">7s</button>
              <button class="count-btn penalty-btn" data-penalty="10">10s</button>
              <button class="count-btn penalty-btn" data-penalty="15">15s</button>
              <button class="count-btn penalty-btn" data-penalty="30">30s</button>
            </div>
          </div>

          <div class="setup-section">
            <div class="setup-section-label">
              Choisir les adversaires
              <span class="gc-max-badge">max ${this.MAX_PLAYERS}</span>
            </div>
            <input type="text" class="challenge-search-input" id="gcPlayerSearch" placeholder="Rechercher un joueur...">
            <div class="challenge-player-list" id="gcPlayerList">
              <div class="challenge-loading">Chargement des joueurs...</div>
            </div>
          </div>

          <div style="margin-top:2rem;">
            <button class="btn btn-primary btn-lg" id="gcSendBtn" style="width:100%;" disabled>
              Choisissez au moins un adversaire
            </button>
          </div>
        </div>
      </div>`;

    const cfg = { mode: 'flags', type: 'choice', continent: 'all', count: 10, difficulty: 'normal', penalty: 7 };
    let selectedIds = new Set();
    let allPlayers  = [];

    const updateTypeSection = () => {
      const isMap = cfg.mode === 'map';
      container.querySelectorAll('.challenge-mode-card[data-type]').forEach(c => c.classList.toggle('disabled', isMap));
    };

    const updateSendBtn = () => {
      const btn = container.querySelector('#gcSendBtn');
      const n = selectedIds.size;
      btn.disabled    = n === 0;
      btn.textContent = n === 0
        ? 'Choisissez au moins un adversaire'
        : `🏆 Lancer le défi à ${n + 1} joueurs`;
    };

    const refreshList = () => {
      const q = container.querySelector('#gcPlayerSearch')?.value.toLowerCase() || '';
      const filtered = q ? allPlayers.filter(p => p.name.toLowerCase().includes(q)) : allPlayers;
      this._renderMultiPlayerList(container, filtered, selectedIds, (id) => {
        if (selectedIds.has(id))              selectedIds.delete(id);
        else if (selectedIds.size < this.MAX_PLAYERS) selectedIds.add(id);
        else { GL.UI.toast(`Maximum ${this.MAX_PLAYERS} adversaires`, 'warning'); return; }
        refreshList();
        updateSendBtn();
      });
    };

    container.querySelectorAll('.challenge-mode-card[data-mode]').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.challenge-mode-card[data-mode]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        cfg.mode = card.dataset.mode;
        updateTypeSection();
      });
    });
    container.querySelectorAll('.challenge-mode-card[data-type]').forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('disabled')) return;
        container.querySelectorAll('.challenge-mode-card[data-type]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        cfg.type = card.dataset.type;
      });
    });
    container.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        cfg.continent = tab.dataset.c;
      });
    });
    container.querySelectorAll('.count-btn:not(.penalty-btn)').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.count-btn:not(.penalty-btn)').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        cfg.count = btn.dataset.count === 'all' ? Infinity : parseInt(btn.dataset.count);
      });
    });
    container.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        cfg.difficulty = btn.dataset.diff;
      });
    });
    container.querySelectorAll('.penalty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.penalty-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        cfg.penalty = parseInt(btn.dataset.penalty);
      });
    });

    container.querySelector('#gcPlayerSearch').addEventListener('input', refreshList);

    container.querySelector('#gcSendBtn').addEventListener('click', async () => {
      if (!selectedIds.size) return;
      if (!GL.Auth.isLoggedIn()) { GL.UI.toast('Connectez-vous pour lancer un défi', 'warning'); return; }
      const btn = container.querySelector('#gcSendBtn');
      btn.disabled = true; btn.textContent = 'Création du défi...';
      const questions = GL.Challenge._generateQuestions(cfg);
      if (!questions.length) {
        GL.UI.toast('Pas assez de pays pour ce continent/difficulté', 'error');
        btn.disabled = false; updateSendBtn(); return;
      }
      const id = await this._createGroupChallenge([...selectedIds], cfg, questions);
      if (id) GL.Router.navigate(`/quiz/defi-groupe/${id}`);
      else { btn.disabled = false; updateSendBtn(); }
    });

    GL.Challenge._fetchUsers().then(players => { allPlayers = players; refreshList(); });
  },

  _renderMultiPlayerList(container, players, selectedIds, onToggle) {
    const list = container.querySelector('#gcPlayerList');
    if (!list) return;
    if (!players.length) { list.innerHTML = '<div class="challenge-empty">Aucun joueur disponible</div>'; return; }
    list.innerHTML = players.map(p => {
      const sel = selectedIds.has(p.id);
      return `
        <div class="challenge-player-row${sel ? ' selected' : ''}" data-id="${p.id}">
          <img class="challenge-player-avatar" src="${p.avatarUrl}"
               onerror="this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=${p.id}&size=80'">
          <div class="challenge-player-info">
            <div class="challenge-player-name">${p.name}</div>
            <div class="challenge-player-xp">${p.title ? `<span class="challenge-player-title tier-${p.titleTier}">${p.title}</span>` : '—'}</div>
          </div>
          <div class="gc-player-checkbox${sel ? ' checked' : ''}">${sel ? '✓' : ''}</div>
        </div>`;
    }).join('');
    list.querySelectorAll('.challenge-player-row').forEach(row =>
      row.addEventListener('click', () => onToggle(row.dataset.id)));
  },

  // ── Route handler : /quiz/defi-groupe/:id ────────────────────────────────────
  async renderChallenge(container, { id }) {
    this._unsubscribeGC();
    GL.WorldMap.cleanup();

    container.innerHTML = `
      <div class="page" style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
        <div class="loader-content"><div class="loader-globe">🏆</div><p>Chargement du défi...</p></div>
      </div>`;

    const client = GL.Auth?._client;
    if (!client || !GL.Auth.isLoggedIn()) {
      container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><p>Connectez-vous pour participer</p><a href="#/quiz/defi-groupe" class="btn btn-primary">Retour</a></div>`;
      return;
    }
    const myId = GL.Auth._user.id;

    const [{ data: challenge }, { data: participants }] = await Promise.all([
      client.from('group_challenges').select('*').eq('id', id).single(),
      client.from('group_challenge_participants').select('*').eq('challenge_id', id),
    ]);

    if (!challenge) {
      container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><h3>Défi introuvable</h3><a href="#/quiz/defi-groupe" class="btn btn-primary" style="margin-top:1.5rem">Retour</a></div>`;
      return;
    }

    const parts  = participants || [];
    const myPart = parts.find(p => p.user_id === myId);

    if (!myPart) {
      container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><h3>Vous n'êtes pas invité à ce défi</h3><a href="#/quiz/defi-groupe" class="btn btn-primary" style="margin-top:1.5rem">Retour</a></div>`;
      return;
    }

    if (challenge.status === 'cancelled') {
      container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><div style="font-size:3rem">😞</div><h3>Défi annulé</h3><a href="#/quiz/defi-groupe" class="btn btn-primary" style="margin-top:1.5rem">Nouveau défi</a></div>`;
      return;
    }

    if (challenge.status === 'finished') {
      await this._renderRanking(container, challenge, parts);
      return;
    }

    // J'ai déjà joué
    if (myPart.result && myPart.finished_at) {
      const accepted = parts.filter(p => p.invite_status === 'accepted');
      if (accepted.every(p => p.finished_at)) {
        await this._renderRanking(container, challenge, parts);
      } else {
        this._renderWaitingScreen(container, challenge, myPart.result);
      }
      return;
    }

    if (challenge.status === 'pending') {
      if (challenge.creator_id === myId) {
        this._renderPendingCreator(container, challenge, parts);
      } else if (myPart.invite_status === 'pending') {
        const { data: creator } = await client
          .from('user_data').select('username').eq('user_id', challenge.creator_id).single();
        this._renderInlineInvite(container, challenge, myPart, creator?.username || 'Un joueur');
      } else if (myPart.invite_status === 'accepted') {
        this._renderAcceptedWaiting(container, challenge, parts);
      } else {
        container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><h3>Vous avez refusé ce défi</h3><a href="#/quiz/defi-groupe" class="btn btn-primary" style="margin-top:1.5rem">Retour</a></div>`;
      }
      return;
    }

    if (challenge.status === 'active') {
      if (myPart.invite_status === 'declined') {
        container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><h3>Vous avez refusé ce défi</h3><a href="#/quiz/defi-groupe" class="btn btn-primary" style="margin-top:1.5rem">Retour</a></div>`;
        return;
      }
      const accepted = parts.filter(p => p.invite_status === 'accepted');
      const allReady = accepted.length > 0 && accepted.every(p => p.ready);
      if (allReady) {
        await this._startQuiz(container, challenge);
      } else {
        this._renderReadyScreen(container, challenge, parts);
      }
    }
  },

  // ── Créateur en attente des réponses ─────────────────────────────────────────
  _renderPendingCreator(container, challenge, participants) {
    const client = GL.Auth._client;
    const myId   = GL.Auth._user.id;
    const names  = {};

    const statusIcon  = { pending: '⏳', accepted: '✅', declined: '❌' };
    const statusLabel = { pending: 'En attente...', accepted: 'Accepté !', declined: 'Refusé' };

    const renderRows = (parts) => parts
      .filter(p => p.user_id !== myId)
      .map(p => `
        <div class="gc-invite-row">
          <span class="gc-invite-status-dot gc-dot-${p.invite_status}"></span>
          <span class="gc-invite-name">${names[p.user_id] || '...'}</span>
          <span class="gc-invite-status-text">${statusIcon[p.invite_status] || ''} ${statusLabel[p.invite_status] || ''}</span>
        </div>`).join('');

    container.innerHTML = `
      <div class="page">
        <div class="challenge-waiting">
          <div class="challenge-waiting-icon">⏳</div>
          <h3>Défi envoyé !</h3>
          <p>En attente des réponses de tes adversaires...</p>
          <div class="gc-invite-list" id="gcInviteList">${renderRows(participants)}</div>
          <div style="margin-top:1.5rem;color:var(--text-muted);font-size:0.9rem;">
            Expire dans <strong><span id="gcCreatorCountdown">60</span>s</strong>
          </div>
          <a href="#/quiz/defi-groupe" class="btn btn-ghost" style="margin-top:2rem">Annuler</a>
        </div>
      </div>`;

    // Charger les noms en async
    let currentParts = [...participants];
    participants.filter(p => p.user_id !== myId).forEach(async p => {
      const { data } = await client.from('user_data').select('username').eq('user_id', p.user_id).single();
      names[p.user_id] = data?.username || 'Joueur';
      const el = container.querySelector('#gcInviteList');
      if (el) el.innerHTML = renderRows(currentParts);
    });

    let remaining = 60;
    const ticker = setInterval(() => {
      const el = container.querySelector('#gcCreatorCountdown');
      if (el) el.textContent = --remaining;
      if (remaining <= 0) { clearInterval(ticker); this._tryActivate(challenge.id); }
    }, 1000);

    const checkAllResponded = async () => {
      const allResponded = currentParts.every(p => p.invite_status !== 'pending');
      const anyAccepted  = currentParts.some(p => p.invite_status === 'accepted');
      if (!allResponded) return false;
      clearInterval(ticker);
      client.removeChannel(ch); this._gcChannel = null;
      if (anyAccepted) {
        await this._tryActivate(challenge.id);
        GL.Router.navigate(`/quiz/defi-groupe/${challenge.id}`);
      } else {
        container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><div style="font-size:3rem">😞</div><h3>Tout le monde a refusé</h3><a href="#/quiz/defi" class="btn btn-primary" style="margin-top:1.5rem">Nouveau défi</a></div>`;
      }
      return true;
    };

    const ch = client
      .channel(`gc-pending-${challenge.id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'group_challenge_participants',
        filter: `challenge_id=eq.${challenge.id}`,
      }, async (payload) => {
        const idx = currentParts.findIndex(p => p.user_id === payload.new.user_id);
        if (idx !== -1) currentParts[idx] = payload.new;
        const listEl = container.querySelector('#gcInviteList');
        if (listEl) listEl.innerHTML = renderRows(currentParts);
        await checkAllResponded();
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;
        // Guard : recharger les participants au cas où des réponses sont arrivées
        // pendant la navigation vers cet écran
        const { data: fresh } = await client
          .from('group_challenge_participants').select('*').eq('challenge_id', challenge.id);
        if (!fresh) return;
        currentParts = fresh;
        const listEl = container.querySelector('#gcInviteList');
        if (listEl) listEl.innerHTML = renderRows(currentParts);
        fresh.filter(p => p.user_id !== myId && !names[p.user_id]).forEach(async p => {
          const { data } = await client.from('user_data').select('username').eq('user_id', p.user_id).single();
          names[p.user_id] = data?.username || 'Joueur';
          const el = container.querySelector('#gcInviteList');
          if (el) el.innerHTML = renderRows(currentParts);
        });
        await checkAllResponded();
      });

    this._gcChannel = ch;
    GL._onRouteLeave = () => {
      clearInterval(ticker);
      client.removeChannel(ch); this._gcChannel = null;
      this._cancelGroupChallenge(challenge.id);
    };
  },

  // ── Invitation inline (invité naviguant directement à l'URL) ────────────────
  _renderInlineInvite(container, challenge, myPart, creatorName) {
    const cfg = challenge.config || {};
    const modeLabel = { flags: '🏁 Drapeaux', capitals: '🏛️ Capitales', map: '📍 Carte', nightmare: '💀 Cauchemar', random: '🎲 Aléatoire' }[cfg.mode] || cfg.mode;
    const contLabel = cfg.continent === 'all' ? 'Monde entier' : (GL.I18N?.cont(cfg.continent) ?? cfg.continent);

    container.innerHTML = `
      <div class="page">
        <div class="challenge-waiting">
          <div class="challenge-waiting-icon">🏆</div>
          <h3>Défi en groupe !</h3>
          <p><strong>${creatorName}</strong> vous invite à jouer</p>
          <div class="ch-modal-tags" style="justify-content:center;margin:1.5rem 0;">
            <span class="challenge-config-tag">${modeLabel}</span>
            <span class="challenge-config-tag">${cfg.count || '?'} pays</span>
            <span class="challenge-config-tag">${contLabel}</span>
            <span class="challenge-config-tag">⚠️ ${cfg.penalty ?? 7}s pénalité</span>
          </div>
          <div class="ch-modal-btns" style="margin-top:1.5rem;">
            <button class="btn btn-primary" id="gcInlineAccept">Accepter 🏆</button>
            <button class="btn btn-ghost"   id="gcInlineDecline">Refuser</button>
          </div>
        </div>
      </div>`;

    container.querySelector('#gcInlineAccept').addEventListener('click', async () => {
      await this._respondToInvite(myPart.id, 'accepted');
      await this._tryActivateIfAllResponded(challenge.id);
      GL.Router.navigate(`/quiz/defi-groupe/${challenge.id}`);
    });
    container.querySelector('#gcInlineDecline').addEventListener('click', async () => {
      await this._respondToInvite(myPart.id, 'declined');
      await this._tryActivateIfAllResponded(challenge.id);
      container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><h3>Défi refusé</h3><a href="#/quiz/defi-groupe" class="btn btn-primary" style="margin-top:1.5rem">Retour</a></div>`;
    });
  },

  // ── Invité accepté attendant le passage à active ──────────────────────────────
  _renderAcceptedWaiting(container, challenge) {
    const client = GL.Auth._client;

    container.innerHTML = `
      <div class="page">
        <div class="challenge-waiting">
          <div class="challenge-waiting-icon">✅</div>
          <h3>Invitation acceptée !</h3>
          <p>En attente que tous les joueurs répondent...</p>
          <div class="ch-dots"><span></span><span></span><span></span></div>
        </div>
      </div>`;

    let gone = false;
    const go = () => {
      if (gone) return; gone = true;
      client.removeChannel(ch); this._gcChannel = null;
      GL.Router.navigate(`/quiz/defi-groupe/${challenge.id}`);
    };
    const cancel = () => {
      if (gone) return; gone = true;
      client.removeChannel(ch); this._gcChannel = null;
      container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><div style="font-size:3rem">😞</div><h3>Défi annulé</h3><a href="#/quiz/defi" class="btn btn-primary" style="margin-top:1.5rem">Retour</a></div>`;
    };

    const ch = client
      .channel(`gc-acc-wait-${challenge.id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'group_challenges',
        filter: `id=eq.${challenge.id}`,
      }, (payload) => {
        if (payload.new.status === 'active')    go();
        else if (payload.new.status === 'cancelled') cancel();
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;
        // Guard : l'événement a peut-être été envoyé avant que l'abonnement soit prêt
        const { data } = await client
          .from('group_challenges').select('status').eq('id', challenge.id).single();
        if (data?.status === 'active')    go();
        else if (data?.status === 'cancelled') cancel();
      });

    this._gcChannel = ch;
    GL._onRouteLeave = () => { gone = true; client.removeChannel(ch); this._gcChannel = null; };
  },

  // ── Lobby "Prêt ?" ────────────────────────────────────────────────────────────
  async _renderReadyScreen(container, challenge, participants) {
    const client   = GL.Auth._client;
    const myId     = GL.Auth._user.id;
    const accepted = participants.filter(p => p.invite_status === 'accepted');

    const { data: profiles } = await client
      .from('user_data').select('user_id, username')
      .in('user_id', accepted.map(p => p.user_id));

    let localParts = accepted.map(p => ({ ...p }));
    let myReady    = localParts.find(p => p.user_id === myId)?.ready || false;

    const renderList = () => localParts.map(p => {
      const name = profiles?.find(pr => pr.user_id === p.user_id)?.username || 'Joueur';
      const isMe = p.user_id === myId;
      return `
        <div class="gc-ready-player${p.ready ? ' is-ready' : ''}">
          <span class="gc-ready-dot${p.ready ? ' ready' : ''}"></span>
          <span class="gc-ready-name">${name}${isMe ? ' <span class="you-badge">vous</span>' : ''}</span>
          <span class="gc-ready-label">${p.ready ? 'Prêt !' : '...'}</span>
        </div>`;
    }).join('');

    const render = () => {
      container.innerHTML = `
        <div class="page">
          <div class="ch-ready-screen">
            <div class="ch-ready-title">🏆 Défi en groupe</div>
            <div class="gc-ready-config">${GL.Challenge._configLabel(challenge.config)}</div>
            <div class="ch-ready-rule">Mauvaise réponse ou skip = +${challenge.config.penalty ?? 7}s • Le plus rapide gagne</div>
            <div class="gc-ready-list" id="gcReadyList">${renderList()}</div>
            ${!myReady
              ? `<button class="btn btn-primary btn-lg" id="gcReadyBtn" style="margin-top:2rem;">Je suis prêt !</button>`
              : `<p class="ch-ready-waiting-msg" style="margin-top:2rem;">En attente des autres joueurs...</p>`}
          </div>
        </div>`;

      const btn = container.querySelector('#gcReadyBtn');
      if (btn) {
        btn.addEventListener('click', async () => {
          btn.disabled = true; btn.textContent = 'Prêt !';
          await this._setReady(challenge.id, myId);
          myReady = true;
          const lp = localParts.find(p => p.user_id === myId);
          if (lp) lp.ready = true;
          const listEl = container.querySelector('#gcReadyList');
          if (listEl) listEl.innerHTML = renderList();
          btn.replaceWith(Object.assign(document.createElement('p'), {
            className: 'ch-ready-waiting-msg', textContent: 'En attente des autres joueurs...',
          }));
          if (localParts.every(p => p.ready)) {
            client.removeChannel(ch); this._gcChannel = null;
            await this._startQuiz(container, challenge);
          }
        });
      }
    };

    render();

    const ch = client
      .channel(`gc-ready-${challenge.id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'group_challenge_participants',
        filter: `challenge_id=eq.${challenge.id}`,
      }, async (payload) => {
        const idx = localParts.findIndex(p => p.user_id === payload.new.user_id);
        if (idx !== -1) localParts[idx] = { ...localParts[idx], ready: payload.new.ready };
        const listEl = container.querySelector('#gcReadyList');
        if (listEl) listEl.innerHTML = renderList();
        if (localParts.every(p => p.ready)) {
          client.removeChannel(ch); this._gcChannel = null;
          await this._startQuiz(container, challenge);
        }
      })
      .subscribe();

    this._gcChannel = ch;
    GL._onRouteLeave = () => { client.removeChannel(ch); this._gcChannel = null; };
  },

  // ── Décompte + quiz (délègue à GL.Challenge) ─────────────────────────────────
  async _startQuiz(container, challenge) {
    this._unsubscribeGC();

    for (let n = 3; n >= 1; n--) {
      container.innerHTML = `<div class="page"><div class="ch-countdown"><div class="ch-countdown-number">${n}</div></div></div>`;
      await new Promise(r => setTimeout(r, 1000));
    }
    container.innerHTML = `<div class="page"><div class="ch-countdown"><div class="ch-countdown-number ch-countdown-go">GO !</div></div></div>`;
    await new Promise(r => setTimeout(r, 700));

    if (['map', 'nightmare', 'random'].includes(challenge.config.mode)) {
      await GL.QuizMap.prepareMapData();
    }

    const questions = GL.Challenge._buildQuestions(challenge);
    if (!questions.length) { GL.UI.toast('Erreur de génération des questions', 'error'); return; }

    const self = this;
    GL.Challenge._cleanup();
    GL.Challenge._quizState = {
      challenge,
      questions,
      currentIndex: 0,
      penalties: 0,
      penaltyMs: (challenge.config.penalty ?? 7) * 1000,
      answers: [],
      startTime: Date.now(),
      questionStartTime: Date.now(),
      timerInterval: null,
      _finishCallback: async (cont, totalTime, penalties, answers) => {
        await self._submitGroupResult(challenge.id, totalTime, penalties, answers);
        self._renderWaitingScreen(cont, challenge, { finish_time: totalTime, penalties, answers });
      },
    };
    GL.Challenge._renderNextQuestion(container);
  },

  // ── Attente que les autres finissent ─────────────────────────────────────────
  _renderWaitingScreen(container, challenge, myResult) {
    const client  = GL.Auth._client;
    const myId    = GL.Auth._user.id;
    const correct = (myResult.answers || []).filter(a => a.correct).length;
    const total   = challenge.questions?.length || 0;
    const names   = {};

    const renderOthers = (parts) => {
      const acc = parts.filter(p => p.user_id !== myId && p.invite_status === 'accepted');
      if (!acc.length) return '';
      return `<div class="gc-wait-others">
        ${acc.map(p => `
          <div class="gc-wait-row">
            <span class="gc-ready-dot${p.finished_at ? ' ready' : ''}"></span>
            <span>${names[p.user_id] || '...'}</span>
            <span style="margin-left:auto;font-size:0.8rem;color:var(--text-muted);">${p.finished_at ? '✅ Terminé' : '🏃 En cours...'}</span>
          </div>`).join('')}
      </div>`;
    };

    container.innerHTML = `
      <div class="page">
        <div class="challenge-waiting">
          <div class="challenge-waiting-icon">✅</div>
          <h3>Quiz terminé !</h3>
          <p>Ton temps : <strong>${GL.Challenge._formatTime(myResult.finish_time)}</strong></p>
          <p style="color:var(--text-secondary)">${correct}/${total} correctes • ${myResult.penalties} pénalité${myResult.penalties > 1 ? 's' : ''}</p>
          <p style="margin-top:1.5rem;color:var(--text-muted)">En attente que les autres terminent...</p>
          <div id="gcWaitOthers" style="width:100%;max-width:320px;margin-top:1rem;"></div>
          <div class="ch-dots"><span></span><span></span><span></span></div>
        </div>
      </div>`;

    let localParts = [];

    client.from('group_challenge_participants').select('*').eq('challenge_id', challenge.id)
      .then(async ({ data: parts }) => {
        localParts = parts || [];

        // Charger les noms
        await Promise.all(
          localParts
            .filter(p => p.user_id !== myId && p.invite_status === 'accepted')
            .map(async p => {
              const { data } = await client.from('user_data').select('username').eq('user_id', p.user_id).single();
              names[p.user_id] = data?.username || 'Joueur';
            })
        );

        const refresh = () => {
          const el = container.querySelector('#gcWaitOthers');
          if (el) el.innerHTML = renderOthers(localParts);
        };
        refresh();

        const accepted = localParts.filter(p => p.invite_status === 'accepted');
        if (accepted.every(p => p.finished_at)) {
          await this._renderRanking(container, challenge, localParts);
          return;
        }

        const ch = client
          .channel(`gc-wait-${challenge.id}`)
          .on('postgres_changes', {
            event: 'UPDATE', schema: 'public', table: 'group_challenge_participants',
            filter: `challenge_id=eq.${challenge.id}`,
          }, async (payload) => {
            const idx = localParts.findIndex(p => p.user_id === payload.new.user_id);
            if (idx !== -1) localParts[idx] = payload.new;
            refresh();
            const acc = localParts.filter(p => p.invite_status === 'accepted');
            if (acc.every(p => p.finished_at)) {
              client.removeChannel(ch); this._gcChannel = null;
              await client.from('group_challenges')
                .update({ status: 'finished' }).eq('id', challenge.id).eq('status', 'active');
              await this._renderRanking(container, challenge, localParts);
            }
          })
          .subscribe();

        this._gcChannel = ch;
        GL._onRouteLeave = () => { client.removeChannel(ch); this._gcChannel = null; };
      });
  },

  // ── Classement final ──────────────────────────────────────────────────────────
  async _renderRanking(container, challenge, participants) {
    const client = GL.Auth._client;
    const myId   = GL.Auth._user.id;

    const { data: freshParts } = await client
      .from('group_challenge_participants').select('*').eq('challenge_id', challenge.id);
    const parts = freshParts || participants;

    const { data: profiles } = await client
      .from('user_data').select('user_id, username, profile')
      .in('user_id', parts.map(p => p.user_id));

    const total = challenge.questions?.length || 0;

    const ranked = parts
      .filter(p => p.invite_status === 'accepted' && p.result)
      .map(p => {
        const prof    = profiles?.find(pr => pr.user_id === p.user_id);
        const result  = p.result;
        const correct = (result.answers || []).filter(a => a.correct).length;
        const avatarUrl = prof?.profile?.avatar
          ? GL.Profile.avatarUrl(GL.Profile.migrateAvatar(prof.profile.avatar), 80)
          : `https://api.dicebear.com/9.x/avataaars/svg?seed=${p.user_id}&size=80`;
        return {
          userId: p.user_id,
          name: prof?.username || 'Joueur',
          avatarUrl,
          finishTime: result.finish_time,
          penalties:  result.penalties || 0,
          correct,
          total,
          isMe: p.user_id === myId,
        };
      })
      .sort((a, b) => a.finishTime - b.finishTime);

    if (ranked[0]?.isMe) {
      const stats = GL.UI.getStats();
      stats.challengeWins = (stats.challengeWins || 0) + 1;
      GL.UI.saveStats(stats);
      if (GL.Achievements) GL.Achievements.updateNavDot();
    }

    const medal   = (i) => ['🥇', '🥈', '🥉'][i] ?? `#${i + 1}`;
    const myPos   = ranked.findIndex(p => p.isMe);
    const winText = myPos === 0 ? '🏆 Victoire !'
      : myPos === 1 ? '🥈 2ème place !'
      : myPos === 2 ? '🥉 3ème place !'
      : myPos >= 0  ? `#${myPos + 1}ème place`
      : 'Résultats';

    container.innerHTML = `
      <div class="page">
        <div class="gc-ranking">

          <div class="ch-recap-winner ${myPos === 0 ? 'win' : myPos > 0 ? 'lose' : ''}">${winText}</div>

          <div class="gc-ranking-list">
            ${ranked.map((p, i) => `
              <div class="gc-rank-row${p.isMe ? ' gc-rank-me' : ''}${i === 0 ? ' gc-rank-first' : ''}">
                <div class="gc-rank-pos">${medal(i)}</div>
                <img class="gc-rank-avatar" src="${p.avatarUrl}"
                     onerror="this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=${p.userId}&size=64'">
                <div class="gc-rank-info">
                  <div class="gc-rank-name">${p.name}${p.isMe ? ' <span class="you-badge">vous</span>' : ''}</div>
                  <div class="gc-rank-detail">${p.correct}/${p.total} ✓ &nbsp;•&nbsp; ${p.penalties} pen.</div>
                </div>
                <div class="gc-rank-time">${GL.Challenge._formatTime(p.finishTime)}</div>
              </div>`).join('')}
          </div>

          <div style="display:flex;gap:1rem;justify-content:center;margin-top:2.5rem;flex-wrap:wrap;">
            <a href="#/quiz/defi-groupe" class="btn btn-primary">Nouveau défi</a>
            <a href="#/quiz/defi" class="btn btn-ghost">Défi 1v1</a>
            <a href="#/" class="btn btn-ghost">Accueil</a>
          </div>
        </div>
      </div>`;
  },

  // ── Actions Supabase ──────────────────────────────────────────────────────────
  async _createGroupChallenge(invitedIds, config, questions) {
    await GL.Auth.ensureValidSession();
    const client = GL.Auth._client;
    const myId   = GL.Auth._user.id;

    const { data: gc, error } = await client
      .from('group_challenges')
      .insert({ creator_id: myId, config, questions, status: 'pending' })
      .select('id').single();
    if (error) {
      console.error('[GroupChallenge] create:', error.message);
      GL.UI.toast('Erreur création du défi', 'error');
      return null;
    }

    const rows = [
      { challenge_id: gc.id, user_id: myId, invite_status: 'accepted' },
      ...invitedIds.map(uid => ({ challenge_id: gc.id, user_id: uid, invite_status: 'pending' })),
    ];
    const { error: pErr } = await client.from('group_challenge_participants').insert(rows);
    if (pErr) {
      console.error('[GroupChallenge] participants insert:', pErr.message);
      GL.UI.toast('Erreur envoi des invitations', 'error');
      return null;
    }
    return gc.id;
  },

  async _respondToInvite(participantId, status) {
    await GL.Auth.ensureValidSession();
    const { error } = await GL.Auth._client
      .from('group_challenge_participants')
      .update({ invite_status: status })
      .eq('id', participantId);
    if (error) console.error('[GroupChallenge] respond:', error.message);
  },

  async _tryActivate(challengeId) {
    const { error } = await GL.Auth._client
      .from('group_challenges')
      .update({ status: 'active' })
      .eq('id', challengeId)
      .eq('status', 'pending');
    if (error) console.error('[GroupChallenge] activate:', error.message);
  },

  async _tryActivateIfAllResponded(challengeId) {
    const { data: parts } = await GL.Auth._client
      .from('group_challenge_participants').select('invite_status').eq('challenge_id', challengeId);
    if (!parts) return;
    const allResponded = parts.every(p => p.invite_status !== 'pending');
    const anyAccepted  = parts.some(p => p.invite_status === 'accepted');
    if (allResponded && anyAccepted) await this._tryActivate(challengeId);
  },

  async _setReady(challengeId, userId) {
    const { error } = await GL.Auth._client
      .from('group_challenge_participants')
      .update({ ready: true })
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);
    if (error) console.error('[GroupChallenge] setReady:', error.message);
  },

  async _submitGroupResult(challengeId, finishTime, penalties, answers) {
    await GL.Auth.ensureValidSession();
    const userId = GL.Auth._user.id;

    const doUpdate = () => GL.Auth._client
      .from('group_challenge_participants')
      .update({
        result:      { finish_time: finishTime, penalties, answers },
        finished_at: new Date().toISOString(),
      })
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);

    let { error } = await doUpdate();
    if (error && (error.status === 401 || error.message?.toLowerCase().includes('jwt'))) {
      await GL.Auth._client.auth.refreshSession();
      ({ error } = await doUpdate());
    }
    if (error) console.error('[GroupChallenge] submitResult:', error.message);
  },

  async _cancelGroupChallenge(challengeId) {
    if (!GL.Auth?._client || !challengeId) return;
    await GL.Auth._client
      .from('group_challenges')
      .update({ status: 'cancelled' })
      .eq('id', challengeId)
      .eq('status', 'pending');
  },
};
