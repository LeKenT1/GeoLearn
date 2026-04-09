window.GL = window.GL || {};

GL.Challenge = {
  PENALTY_MS: 7000,
  ACCEPT_TIMEOUT_MS: 60000,

  _globalChannel:    null,
  _challengeChannel: null,
  _keyHandler:       null,
  _quizState:        null,

  _t(key)     { return GL.I18N ? GL.I18N.t(key) : key; },
  _n(country) { return GL.I18N ? GL.I18N.name(country) : country.nameFr; },
  _cap(c)     { return GL.I18N ? GL.I18N.capital(c)    : c.capitalFr; },

  // ── Init : écoute globale des défis entrants ─────────────────────────────────
  init() {
    GL.Auth.ready.then(() => {
      if (GL.Auth.isLoggedIn()) this._startGlobalListener();
      const client = GL.Auth?._client;
      if (client) {
        client.auth.onAuthStateChange((event) => {
          if (event === 'SIGNED_IN')  this._startGlobalListener();
          if (event === 'SIGNED_OUT') this._stopGlobalListener();
        });
      }
    });
  },

  _startGlobalListener() {
    const client = GL.Auth?._client;
    const userId = GL.Auth?._user?.id;
    if (!client || !userId) return;
    if (this._globalChannel) client.removeChannel(this._globalChannel);

    this._globalChannel = client
      .channel('gl-challenges-incoming')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'challenges',
        filter: `challenged_id=eq.${userId}`,
      }, (payload) => this._onIncomingChallenge(payload.new))
      .subscribe();
  },

  _stopGlobalListener() {
    if (this._globalChannel && GL.Auth?._client) {
      GL.Auth._client.removeChannel(this._globalChannel);
      this._globalChannel = null;
    }
  },

  async _onIncomingChallenge(challenge) {
    const client = GL.Auth._client;
    const { data } = await client
      .from('user_data').select('username')
      .eq('user_id', challenge.challenger_id).single();
    const name = data?.username || 'Un joueur';
    GL.UI.toast(`⚔️ ${name} vous défie !`, 'info', 5000);
    this._showIncomingModal(challenge, name);
  },

  _showIncomingModal(challenge, challengerName) {
    document.getElementById('challenge-incoming-modal')?.remove();
    const cfg = challenge.config || {};
    const modeLabel = { flags: '🏁 Drapeaux', capitals: '🏛️ Capitales', map: '📍 Carte', nightmare: '💀 Cauchemar', random: '🎲 Aléatoire' }[cfg.mode] || cfg.mode;
    const contLabel = cfg.continent === 'all' ? 'Monde entier' : (GL.I18N ? GL.I18N.cont(cfg.continent) : cfg.continent);
    const diffLabel = { easy: 'Facile', normal: 'Normal', hard: 'Difficile' }[cfg.difficulty] || cfg.difficulty;

    const modal = document.createElement('div');
    modal.id = 'challenge-incoming-modal';
    modal.className = 'ch-modal-overlay';
    modal.innerHTML = `
      <div class="ch-modal">
        <div class="ch-modal-icon">⚔️</div>
        <h3 class="ch-modal-title">Défi reçu !</h3>
        <p class="ch-modal-from"><strong>${challengerName}</strong> vous défie</p>
        <div class="ch-modal-tags">
          <span class="challenge-config-tag">${modeLabel}</span>
          <span class="challenge-config-tag">${cfg.count || '?'} pays</span>
          <span class="challenge-config-tag">${contLabel}</span>
          <span class="challenge-config-tag">${diffLabel}</span>
        </div>
        <div class="ch-modal-countdown">
          <span id="challengeCountdown">60</span>s pour répondre
        </div>
        <div class="ch-modal-btns">
          <button class="btn btn-primary" id="acceptChallengeBtn">Accepter ⚔️</button>
          <button class="btn btn-ghost"   id="declineChallengeBtn">Refuser</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    let remaining = 60;
    const ticker = setInterval(() => {
      remaining--;
      const el = document.getElementById('challengeCountdown');
      if (el) el.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(ticker);
        modal.remove();
        this._expireChallenge(challenge.id);
      }
    }, 1000);

    modal.querySelector('#acceptChallengeBtn').addEventListener('click', async () => {
      clearInterval(ticker);
      modal.remove();
      await this._acceptChallenge(challenge.id);
      GL.Router.navigate(`/quiz/defi/${challenge.id}`);
    });
    modal.querySelector('#declineChallengeBtn').addEventListener('click', async () => {
      clearInterval(ticker);
      modal.remove();
      await this._declineChallenge(challenge.id);
    });
  },

  // ── Écran de configuration ───────────────────────────────────────────────────
  render(container) {
    this._cleanup();
    GL.WorldMap.cleanup();

    const t = this._t.bind(this);
    container.innerHTML = `
      <div class="page">
        <div class="quiz-setup">
          <div class="quiz-setup-title">⚔️ Mode Défi <span class="beta-badge">Béta</span></div>
          <p class="quiz-setup-subtitle">Affrontez un autre joueur — le plus rapide gagne</p>

          <div class="setup-section">
            <div class="setup-section-label">Mode de jeu</div>
            <div class="challenge-mode-grid">
              <div class="challenge-mode-card selected" data-mode="flags">
                <div class="challenge-mode-icon">🏁</div>
                <div class="challenge-mode-name">Drapeaux</div>
              </div>
              <div class="challenge-mode-card" data-mode="capitals">
                <div class="challenge-mode-icon">🏛️</div>
                <div class="challenge-mode-name">Capitales</div>
              </div>
              <div class="challenge-mode-card" data-mode="map">
                <div class="challenge-mode-icon">📍</div>
                <div class="challenge-mode-name">Carte</div>
              </div>
              <div class="challenge-mode-card" data-mode="nightmare">
                <div class="challenge-mode-icon">💀</div>
                <div class="challenge-mode-name">Cauchemar</div>
              </div>
              <div class="challenge-mode-card" data-mode="random">
                <div class="challenge-mode-icon">🎲</div>
                <div class="challenge-mode-name">Aléatoire</div>
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
            <div class="setup-section-label">Choisir un adversaire</div>
            <input type="text" class="challenge-search-input" id="playerSearchInput" placeholder="Rechercher un joueur...">
            <div class="challenge-player-list" id="playerList">
              <div class="challenge-loading">Chargement des joueurs...</div>
            </div>
          </div>

          <div style="margin-top:2rem;">
            <button class="btn btn-primary btn-lg" id="sendChallengeBtn" style="width:100%;" disabled>
              Choisissez un adversaire pour lancer le défi
            </button>
          </div>
        </div>
      </div>`;

    const cfg = { mode: 'flags', continent: 'all', count: 10, difficulty: 'normal' };
    let selectedPlayerId = null;
    let allPlayers = [];

    container.querySelectorAll('.challenge-mode-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.challenge-mode-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        cfg.mode = card.dataset.mode;
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

    const searchInput = container.querySelector('#playerSearchInput');
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      const filtered = q ? allPlayers.filter(p => p.name.toLowerCase().includes(q)) : allPlayers;
      this._renderPlayerList(container, filtered, selectedPlayerId, (id) => {
        selectedPlayerId = id;
        const btn = container.querySelector('#sendChallengeBtn');
        btn.disabled = false;
        btn.textContent = '⚔️ Lancer le défi';
      });
    });

    container.querySelector('#sendChallengeBtn').addEventListener('click', async () => {
      if (!selectedPlayerId) return;
      if (!GL.Auth.isLoggedIn()) {
        GL.UI.toast('Connectez-vous pour défier un joueur', 'warning');
        return;
      }
      const btn = container.querySelector('#sendChallengeBtn');
      btn.disabled = true;
      btn.textContent = 'Envoi du défi...';

      const questions = this._generateQuestions(cfg);
      if (!questions.length) {
        GL.UI.toast('Pas assez de pays pour ce continent/difficulté', 'error');
        btn.disabled = false;
        btn.textContent = '⚔️ Lancer le défi';
        return;
      }
      const id = await this._createChallenge(selectedPlayerId, cfg, questions);
      if (id) GL.Router.navigate(`/quiz/defi/${id}`);
      else { btn.disabled = false; btn.textContent = '⚔️ Lancer le défi'; }
    });

    this._fetchUsers().then(players => {
      allPlayers = players;
      this._renderPlayerList(container, players, selectedPlayerId, (id) => {
        selectedPlayerId = id;
        const btn = container.querySelector('#sendChallengeBtn');
        btn.disabled = false;
        btn.textContent = '⚔️ Lancer le défi';
      });
    });
  },

  _renderPlayerList(container, players, selectedId, onSelect) {
    const list = container.querySelector('#playerList');
    if (!list) return;
    if (!players.length) {
      list.innerHTML = '<div class="challenge-empty">Aucun joueur disponible</div>';
      return;
    }
    list.innerHTML = players.map(p => `
      <div class="challenge-player-row${p.id === selectedId ? ' selected' : ''}" data-id="${p.id}">
        <img class="challenge-player-avatar" src="${p.avatarUrl}"
             onerror="this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=${p.id}&size=80'">
        <div class="challenge-player-info">
          <div class="challenge-player-name">${p.name}</div>
          <div class="challenge-player-xp">${p.xp} XP</div>
        </div>
        ${p.id === selectedId ? '<div class="challenge-player-check">✓</div>' : ''}
      </div>`).join('');

    list.querySelectorAll('.challenge-player-row').forEach(row => {
      row.addEventListener('click', () => {
        list.querySelectorAll('.challenge-player-row').forEach(r => {
          r.classList.remove('selected');
          r.querySelector('.challenge-player-check')?.remove();
        });
        row.classList.add('selected');
        const check = document.createElement('div');
        check.className = 'challenge-player-check';
        check.textContent = '✓';
        row.appendChild(check);
        onSelect(row.dataset.id);
      });
    });
  },

  // ── Route handler : /quiz/defi/:id ───────────────────────────────────────────
  async renderChallenge(container, { id }) {
    this._cleanup();
    GL.WorldMap.cleanup();
    container.innerHTML = `
      <div class="page" style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
        <div class="loader-content"><div class="loader-globe">⚔️</div><p>Chargement du défi...</p></div>
      </div>`;

    const client = GL.Auth?._client;
    if (!client || !GL.Auth.isLoggedIn()) {
      container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><p>Connectez-vous pour participer</p><a href="#/quiz/defi" class="btn btn-primary">Retour</a></div>`;
      return;
    }
    const myId = GL.Auth._user.id;

    const { data: challenge, error } = await client.from('challenges').select('*').eq('id', id).single();
    if (error || !challenge) {
      container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><h3>Défi introuvable</h3><a href="#/quiz/defi" class="btn btn-primary" style="margin-top:1.5rem">Retour</a></div>`;
      return;
    }

    if (challenge.status === 'declined' || challenge.status === 'expired') {
      const msg = challenge.status === 'declined' ? 'Défi refusé' : 'Défi expiré';
      container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><div style="font-size:3rem;margin-bottom:1rem">😞</div><h3>${msg}</h3><a href="#/quiz/defi" class="btn btn-primary" style="margin-top:1.5rem">Nouveau défi</a></div>`;
      return;
    }

    if (challenge.status === 'pending' && challenge.challenger_id === myId) {
      this._renderPending(container, challenge);
      return;
    }

    // Active or pending (challenged player just accepted/navigating)
    const { data: results } = await client.from('challenge_results').select('*').eq('challenge_id', id);
    const myResult    = results?.find(r => r.user_id === myId);
    const theirResult = results?.find(r => r.user_id !== myId);

    if (myResult && theirResult) {
      this._renderRecap(container, challenge, myResult, theirResult);
    } else if (myResult) {
      this._renderWaitingForOpponent(container, challenge, myResult);
    } else if (challenge.challenger_ready && challenge.challenged_ready) {
      // Both ready but I haven't played yet (reload during quiz)
      this._startQuiz(container, challenge);
    } else {
      this._renderReady(container, challenge);
    }
  },

  // ── Écran d'attente d'acceptation (côté challenger) ──────────────────────────
  _renderPending(container, challenge) {
    container.innerHTML = `
      <div class="page">
        <div class="challenge-waiting">
          <div class="challenge-waiting-icon">⏳</div>
          <h3>Défi envoyé !</h3>
          <p>En attente de la réponse de l'adversaire...</p>
          <div class="challenge-waiting-sub">
            L'adversaire a <strong><span id="pendingCountdown">60</span>s</strong> pour accepter
          </div>
          <a href="#/quiz/defi" class="btn btn-ghost" style="margin-top:2rem">Annuler</a>
        </div>
      </div>`;

    let remaining = 60;
    const ticker = setInterval(() => {
      remaining--;
      const el = container.querySelector('#pendingCountdown');
      if (el) el.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(ticker);
        this._expireChallenge(challenge.id);
        container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><h3>Délai expiré</h3><p>L'adversaire n'a pas répondu à temps</p><a href="#/quiz/defi" class="btn btn-primary" style="margin-top:1.5rem">Nouveau défi</a></div>`;
      }
    }, 1000);
    GL._onRouteLeave = () => clearInterval(ticker);

    this._subscribeToChallengeUpdates(challenge.id, (updated) => {
      if (updated.status === 'active') {
        clearInterval(ticker);
        this._renderReady(container, updated);
      } else if (updated.status === 'declined') {
        clearInterval(ticker);
        container.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><div style="font-size:3rem;margin-bottom:1rem">😞</div><h3>Défi refusé</h3><a href="#/quiz/defi" class="btn btn-primary" style="margin-top:1.5rem">Nouveau défi</a></div>`;
      }
    });
  },

  // ── Écran face-à-face "Prêt ?" ───────────────────────────────────────────────
  async _renderReady(container, challenge) {
    const client = GL.Auth._client;
    const myId = GL.Auth._user.id;
    const isChallenger = challenge.challenger_id === myId;
    const opponentId   = isChallenger ? challenge.challenged_id : challenge.challenger_id;
    const myReadyField = isChallenger ? 'challenger_ready' : 'challenged_ready';
    const oppReadyField = isChallenger ? 'challenged_ready' : 'challenger_ready';

    const { data: profiles } = await client
      .from('user_data').select('user_id, username, profile')
      .in('user_id', [myId, opponentId]);

    const me  = profiles?.find(p => p.user_id === myId);
    const opp = profiles?.find(p => p.user_id === opponentId);

    const myName    = me?.username  || 'Vous';
    const oppName   = opp?.username || 'Adversaire';
    const myAvatar  = me?.profile?.avatar  ? GL.Profile.avatarUrl(GL.Profile.migrateAvatar(me.profile.avatar),  120) : `https://api.dicebear.com/9.x/avataaars/svg?seed=${myId}&size=120`;
    const oppAvatar = opp?.profile?.avatar ? GL.Profile.avatarUrl(GL.Profile.migrateAvatar(opp.profile.avatar), 120) : `https://api.dicebear.com/9.x/avataaars/svg?seed=${opponentId}&size=120`;

    let myReady  = !!challenge[myReadyField];
    let oppReady = !!challenge[oppReadyField];

    const render = () => {
      container.innerHTML = `
        <div class="page">
          <div class="ch-ready-screen">
            <div class="ch-ready-title">⚔️ Défi</div>

            <div class="ch-ready-vs">
              <div class="ch-ready-player${myReady ? ' is-ready' : ''}" id="myReadyPlayer">
                <img class="ch-ready-avatar" src="${myAvatar}"
                     onerror="this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=me&size=120'">
                <div class="ch-ready-name">${myName} <span class="you-badge">vous</span></div>
                <div class="ch-ready-status" id="myReadyStatus">${myReady ? '✅ Prêt !' : '⏳ En attente...'}</div>
              </div>

              <div class="ch-ready-vs-badge">VS</div>

              <div class="ch-ready-player${oppReady ? ' is-ready' : ''}" id="oppReadyPlayer">
                <img class="ch-ready-avatar" src="${oppAvatar}"
                     onerror="this.src='https://api.dicebear.com/9.x/avataaars/svg?seed=opp&size=120'">
                <div class="ch-ready-name">${oppName}</div>
                <div class="ch-ready-status" id="oppReadyStatus">${oppReady ? '✅ Prêt !' : '⏳ En attente...'}</div>
              </div>
            </div>

            <div class="ch-ready-config">${this._configLabel(challenge.config)}</div>
            <div class="ch-ready-rule">Mauvaise réponse ou skip = +7s • Le plus rapide gagne</div>

            ${!myReady
              ? `<button class="btn btn-primary btn-lg ch-ready-btn" id="readyBtn">Je suis prêt !</button>`
              : `<p class="ch-ready-waiting-msg">En attente de l'adversaire...</p>`}
          </div>
        </div>`;

      const readyBtn = container.querySelector('#readyBtn');
      if (readyBtn) {
        readyBtn.addEventListener('click', async () => {
          readyBtn.disabled = true;
          readyBtn.textContent = '✅ Prêt !';
          myReady = true;
          await this._setReady(challenge.id, isChallenger);
          container.querySelector('#myReadyStatus').textContent = '✅ Prêt !';
          container.querySelector('#myReadyPlayer').classList.add('is-ready');
          readyBtn.replaceWith(Object.assign(document.createElement('p'), {
            className: 'ch-ready-waiting-msg',
            textContent: 'En attente de l\'adversaire...',
          }));
        });
      }
    };

    render();

    this._subscribeToChallengeUpdates(challenge.id, (updated) => {
      const newOppReady  = !!updated[oppReadyField];
      const bothReady    = updated.challenger_ready && updated.challenged_ready;

      if (newOppReady && !oppReady) {
        oppReady = true;
        const el   = container.querySelector('#oppReadyStatus');
        const card = container.querySelector('#oppReadyPlayer');
        if (el)   el.textContent = '✅ Prêt !';
        if (card) card.classList.add('is-ready');
      }
      if (bothReady) this._startQuiz(container, updated);
    });
  },

  // ── Décompte + démarrage du quiz ─────────────────────────────────────────────
  async _startQuiz(container, challenge) {
    this._unsubscribeChallenge();

    for (let n = 3; n >= 1; n--) {
      container.innerHTML = `
        <div class="page">
          <div class="ch-countdown">
            <div class="ch-countdown-number">${n}</div>
          </div>
        </div>`;
      await new Promise(r => setTimeout(r, 1000));
    }
    container.innerHTML = `<div class="page"><div class="ch-countdown"><div class="ch-countdown-number ch-countdown-go">GO !</div></div></div>`;
    await new Promise(r => setTimeout(r, 700));

    if (challenge.config.mode === 'map' || challenge.config.mode === 'nightmare' || challenge.config.mode === 'random') {
      await GL.QuizMap.prepareMapData();
    }

    const questions = this._buildQuestions(challenge);
    if (!questions.length) {
      GL.UI.toast('Erreur de génération des questions', 'error');
      return;
    }

    this._quizState = {
      challenge,
      questions,
      currentIndex: 0,
      penalties: 0,
      answers: [],
      startTime: Date.now(),
      questionStartTime: Date.now(),
      timerInterval: null,
    };

    this._renderNextQuestion(container);
  },

  // ── Rendu de la question suivante ────────────────────────────────────────────
  _renderNextQuestion(container) {
    const state = this._quizState;
    if (state.currentIndex >= state.questions.length) {
      this._finishQuiz(container);
      return;
    }
    state.questionStartTime = Date.now();
    const q = state.questions[state.currentIndex];
    if (q.type === 'map') this._renderMapQuestion(container, q);
    else                  this._renderMCQQuestion(container, q);
  },

  // ── Affichage du timer ────────────────────────────────────────────────────────
  _tickTimer(container) {
    const state = this._quizState;
    const el = container.querySelector('#challengeTimer');
    if (!el || !state) return;
    const elapsed  = Date.now() - state.startTime;
    const penalty  = state.penalties * this.PENALTY_MS;
    el.textContent = this._formatTime(elapsed + penalty);
  },

  _formatTime(ms) {
    const s   = Math.floor(ms / 1000);
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  },

  _penaltyText(penalties) {
    return penalties > 0 ? `⚠️ +${penalties * 7}s pénalités` : '';
  },

  _quizHeader(state) {
    const pct = Math.round(state.currentIndex / state.questions.length * 100);
    return `
      <div class="ch-timer-bar">
        <div class="ch-timer-elapsed" id="challengeTimer">0:00</div>
        <div class="ch-timer-penalties" id="penaltiesDisplay">${this._penaltyText(state.penalties)}</div>
      </div>
      <div class="quiz-header">
        <div class="quiz-progress-wrap">
          <div class="quiz-progress-text">
            <span>Question ${state.currentIndex + 1} / ${state.questions.length}</span>
          </div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width:${pct}%"></div>
          </div>
        </div>
      </div>`;
  },

  // ── Question QCM ─────────────────────────────────────────────────────────────
  _renderMCQQuestion(container, q) {
    const state = this._quizState;
    const keys  = ['1','2','3','4'];

    let qHtml = '';
    if (q.subtype === 'flag-to-name') {
      qHtml = `<div class="quiz-question-label">${q.label}</div>
        <div class="quiz-flag-container">
          <span class="fi fi-${q.country.code}" style="height:107px;aspect-ratio:3/2;background-size:contain;background-position:center;background-repeat:no-repeat;display:inline-block;border-radius:8px;box-shadow:var(--shadow-md);"></span>
        </div>`;
    } else if (q.subtype === 'country-to-capital') {
      qHtml = `<div class="quiz-question-label">${q.label}</div>
        <div class="quiz-question-text">${this._n(q.country)}</div>
        <div class="quiz-flag-container" style="margin-top:0.75rem;">
          <span class="fi fi-${q.country.code}" style="height:48px;aspect-ratio:3/2;background-size:contain;background-position:center;background-repeat:no-repeat;display:inline-block;border-radius:4px;box-shadow:var(--shadow-sm);"></span>
        </div>`;
    } else if (q.subtype === 'capital-to-country') {
      qHtml = `<div class="quiz-question-label">${q.label}</div>
        <div class="quiz-question-text">🏛️ ${this._cap(q.country)}</div>`;
    } else if (q.subtype === 'name-to-flag') {
      qHtml = `<div class="quiz-question-label">${q.label}</div>
        <div class="quiz-question-text">${this._n(q.country)}</div>`;
    }

    let optsHtml;
    if (q.subtype === 'name-to-flag') {
      optsHtml = `<div class="quiz-options" id="quizOptions">
        ${q.options.map((opt, i) => `
          <button class="quiz-option flag-option" data-code="${opt.code}" data-idx="${i}">
            <span class="option-key">${keys[i]}</span>
            <span class="fi fi-${opt.code}" style="width:72px;height:48px;background-size:cover;border-radius:4px;display:inline-block;"></span>
          </button>`).join('')}
      </div>`;
    } else {
      optsHtml = `<div class="quiz-options" id="quizOptions">
        ${q.options.map((opt, i) => {
          const lbl = q.subtype === 'country-to-capital' ? this._cap(opt) : this._n(opt);
          return `<button class="quiz-option" data-code="${opt.code}" data-idx="${i}">
            <span class="option-key">${keys[i]}</span>
            <span>${lbl}</span>
          </button>`;
        }).join('')}
      </div>`;
    }

    container.innerHTML = `
      <div class="page">
        <div class="quiz-container">
          ${this._quizHeader(state)}
          <div class="quiz-question-card" id="questionCard">${qHtml}</div>
          ${optsHtml}
          <div style="text-align:center;margin-top:1rem;">
            <button class="btn btn-ghost btn-sm" id="skipBtn">Passer <span class="ch-skip-penalty">+7s</span></button>
          </div>
          <div class="keyboard-hints">
            <span class="kbd">1</span><span class="kbd">2</span><span class="kbd">3</span><span class="kbd">4</span>
            <span style="color:var(--text-muted);font-size:0.75rem;margin-left:0.25rem">${this._t('quiz.hint.key')}</span>
          </div>
        </div>
      </div>`;

    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => this._tickTimer(container), 500);

    const options  = container.querySelectorAll('.quiz-option');
    let answered   = false;

    const handleAnswer = (btn, skipped = false) => {
      if (answered) return;
      answered = true;
      if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
      options.forEach(b => b.disabled = true);

      const code      = skipped ? null : btn.dataset.code;
      const isCorrect = !skipped && code === q.country.code;
      const timeMs    = Date.now() - state.questionStartTime;

      if (!isCorrect) {
        state.penalties++;
        const pd = container.querySelector('#penaltiesDisplay');
        if (pd) pd.textContent = this._penaltyText(state.penalties);
      }

      state.answers.push({ countryCode: q.country.code, correct: isCorrect, timeMs, skipped: !!skipped, answerCode: code });

      if (!skipped) {
        options.forEach(b => {
          if (b.dataset.code === q.country.code) b.classList.add('correct');
          else if (b === btn && !isCorrect)       b.classList.add('wrong');
        });
      } else {
        options.forEach(b => { if (b.dataset.code === q.country.code) b.classList.add('correct'); });
      }

      setTimeout(() => {
        state.currentIndex++;
        this._renderNextQuestion(container);
      }, 500);
    };

    options.forEach(btn => btn.addEventListener('click', () => handleAnswer(btn)));
    container.querySelector('#skipBtn')?.addEventListener('click', () => handleAnswer(null, true));

    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    this._keyHandler = (e) => {
      if (['1','2','3','4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (options[idx]) handleAnswer(options[idx]);
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  // ── Question Carte ────────────────────────────────────────────────────────────
  async _renderMapQuestion(container, q) {
    const state = this._quizState;

    container.innerHTML = `
      <div class="page" style="max-width:100%;padding:1rem 1.5rem;">
        <div style="max-width:var(--max-width);margin:0 auto;">
          ${this._quizHeader(state)}
          <div class="quiz-map-question-bar">
            <div class="quiz-map-prompt">
              <div>
                <div class="quiz-map-prompt-label">${q.label}</div>
                ${q.showAs === 'flag'
                  ? `<span class="fi fi-${q.country.code}" style="width:72px;height:48px;background-size:cover;border-radius:4px;display:inline-block;box-shadow:var(--shadow-sm);"></span>`
                  : `<div class="quiz-map-prompt-value">${this._n(q.country)}</div>`}
              </div>
            </div>
            <div id="mapFeedback" class="quiz-map-feedback empty">${this._t('quiz.map.click')}</div>
          </div>
          <div style="text-align:center;margin:0.5rem 0;">
            <button class="btn btn-ghost btn-sm" id="skipMapBtn">Passer <span class="ch-skip-penalty">+7s</span></button>
          </div>
          <div class="map-wrapper" id="quizMapWrapper" style="margin-top:0.5rem;cursor:crosshair;"></div>
        </div>
      </div>`;

    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => this._tickTimer(container), 500);

    let answered = false;

    const handleMapAnswer = (isCorrect, skipped = false) => {
      if (answered) return;
      answered = true;
      if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
      const timeMs = Date.now() - state.questionStartTime;
      if (!isCorrect) {
        state.penalties++;
        const pd = container.querySelector('#penaltiesDisplay');
        if (pd) pd.textContent = this._penaltyText(state.penalties);
      }
      state.answers.push({ countryCode: q.country.code, correct: isCorrect, timeMs, skipped: !!skipped });
      setTimeout(() => { state.currentIndex++; this._renderNextQuestion(container); }, 500);
    };

    container.querySelector('#skipMapBtn')?.addEventListener('click', () => handleMapAnswer(false, true));

    GL.WorldMap.cleanup();
    try {
      if (!GL.WorldMap.worldData) {
        GL.WorldMap.worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
      }
      GL.WorldMap.buildNumericMap();
      GL.WorldMap._quizMode    = true;
      GL.WorldMap._onCountryClick = null;
      GL.WorldMap.currentFilter   = state.challenge.config.continent;
      GL.WorldMap.renderMap(container.querySelector('#quizMapWrapper'));
      if (state.challenge.config.continent !== 'all') {
        GL.WorldMap.zoomToContinent(state.challenge.config.continent);
      }
      GL.WorldMap._onCountryClick = (clickedCode) => {
        if (answered) return;
        const isCorrect = clickedCode === q.country.code;
        const feedback  = container.querySelector('#mapFeedback');
        if (isCorrect) {
          if (feedback) { feedback.textContent = '✓ Correct !'; feedback.className = 'quiz-map-feedback correct'; }
          GL.WorldMap.highlightCountry(q.country.numeric, 'correct');
        } else {
          if (feedback) { feedback.textContent = `✗ ${this._n(q.country)}`; feedback.className = 'quiz-map-feedback wrong'; }
          GL.WorldMap.highlightCountry(q.country.numeric, 'wrong');
          setTimeout(() => GL.WorldMap.highlightCountry(q.country.numeric, 'correct'), 600);
        }
        handleMapAnswer(isCorrect);
      };
    } catch(e) {
      console.error('[Challenge] map error:', e);
      handleMapAnswer(false, true);
    }
  },

  // ── Fin du quiz ───────────────────────────────────────────────────────────────
  async _finishQuiz(container) {
    const state = this._quizState;
    if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
    if (this._keyHandler)    { document.removeEventListener('keydown', this._keyHandler); this._keyHandler = null; }
    GL.WorldMap.cleanup();

    const elapsed    = Date.now() - state.startTime;
    const penaltyMs  = state.penalties * this.PENALTY_MS;
    const totalTime  = elapsed + penaltyMs;

    container.innerHTML = `
      <div class="page" style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
        <div class="loader-content"><div class="loader-globe">⏳</div><p>Envoi des résultats...</p></div>
      </div>`;

    await this._submitResult(state.challenge.id, totalTime, state.penalties, state.answers);
    this._renderWaitingForOpponent(container, state.challenge, {
      finish_time: totalTime,
      penalties: state.penalties,
      answers: state.answers,
    });
  },

  // ── Attente que l'adversaire finisse ─────────────────────────────────────────
  _renderWaitingForOpponent(container, challenge, myResult) {
    const client = GL.Auth._client;
    const myId   = GL.Auth._user.id;
    const correct = (myResult.answers || []).filter(a => a.correct).length;
    const total   = challenge.questions?.length || 0;

    container.innerHTML = `
      <div class="page">
        <div class="challenge-waiting">
          <div class="challenge-waiting-icon">✅</div>
          <h3>Quiz terminé !</h3>
          <p>Votre temps : <strong>${this._formatTime(myResult.finish_time)}</strong></p>
          <p style="color:var(--text-secondary)">${correct}/${total} bonnes réponses • ${myResult.penalties} pénalité${myResult.penalties > 1 ? 's' : ''}</p>
          <p style="margin-top:1.5rem;color:var(--text-muted)">En attente que l'adversaire termine...</p>
          <div class="ch-dots"><span></span><span></span><span></span></div>
        </div>
      </div>`;

    // Vérifier si l'adversaire a déjà fini avant nous
    client.from('challenge_results').select('*').eq('challenge_id', challenge.id).neq('user_id', myId).maybeSingle()
      .then(({ data: theirResult }) => {
        if (theirResult) { this._renderRecap(container, challenge, myResult, theirResult); return; }

        // Sinon, écouter via Realtime
        const channel = client
          .channel(`ch-results-${challenge.id}`)
          .on('postgres_changes', {
            event: 'INSERT', schema: 'public', table: 'challenge_results',
            filter: `challenge_id=eq.${challenge.id}`,
          }, async () => {
            const { data: results } = await client.from('challenge_results').select('*').eq('challenge_id', challenge.id);
            const theirR = results?.find(r => r.user_id !== myId);
            if (theirR) {
              client.removeChannel(channel);
              this._renderRecap(container, challenge, myResult, theirR);
            }
          })
          .subscribe();
        GL._onRouteLeave = () => client.removeChannel(channel);
      });
  },

  // ── Récapitulatif ─────────────────────────────────────────────────────────────
  async _renderRecap(container, challenge, myResult, theirResult) {
    const client = GL.Auth._client;
    const myId   = GL.Auth._user.id;
    const oppId  = challenge.challenger_id === myId ? challenge.challenged_id : challenge.challenger_id;

    const { data: profiles } = await client
      .from('user_data').select('user_id, username')
      .in('user_id', [myId, oppId]);

    const myName  = profiles?.find(p => p.user_id === myId)?.username   || 'Vous';
    const oppName = profiles?.find(p => p.user_id === oppId)?.username  || 'Adversaire';

    const iWon    = myResult.finish_time < theirResult.finish_time;
    const draw    = myResult.finish_time === theirResult.finish_time;

    const myAnswers   = myResult.answers   || [];
    const theirAnswers = theirResult.answers || [];
    const myCorrect   = myAnswers.filter(a => a.correct).length;
    const theirCorrect = theirAnswers.filter(a => a.correct).length;
    const total       = challenge.questions?.length || 0;

    container.innerHTML = `
      <div class="page">
        <div class="ch-recap">

          <div class="ch-recap-winner ${draw ? 'draw' : iWon ? 'win' : 'lose'}">
            ${draw ? '🤝 Égalité !' : iWon ? '🏆 Victoire !' : '😞 Défaite'}
          </div>

          <div class="ch-recap-scores">
            <div class="ch-recap-score-card ${iWon && !draw ? 'winner' : ''}">
              <div class="ch-recap-score-name">${myName}</div>
              <div class="ch-recap-score-time">${this._formatTime(myResult.finish_time)}</div>
              <div class="ch-recap-score-detail">${myCorrect}/${total} ✓ &nbsp;•&nbsp; ${myResult.penalties} pen.</div>
            </div>
            <div class="ch-recap-vs">VS</div>
            <div class="ch-recap-score-card ${!iWon && !draw ? 'winner' : ''}">
              <div class="ch-recap-score-name">${oppName}</div>
              <div class="ch-recap-score-time">${this._formatTime(theirResult.finish_time)}</div>
              <div class="ch-recap-score-detail">${theirCorrect}/${total} ✓ &nbsp;•&nbsp; ${theirResult.penalties} pen.</div>
            </div>
          </div>

          <div class="ch-recap-detail">
            <h4>Détail des réponses</h4>
            <div class="ch-recap-table">
              <div class="ch-recap-thead">
                <div>Pays</div>
                <div>${myName}</div>
                <div>${oppName}</div>
              </div>
              ${(challenge.questions || []).map((q, i) => {
                const country  = GL.COUNTRIES.find(c => c.code === q.code);
                const myA      = myAnswers[i];
                const theirA   = theirAnswers[i];
                const icon = (a) => !a ? '—' : a.correct ? '✅' : a.skipped ? '⏭️' : '❌';
                const time = (a) => a ? `${(a.timeMs / 1000).toFixed(1)}s` : '—';
                return `
                  <div class="ch-recap-row">
                    <div class="ch-recap-country">
                      <span class="fi fi-${q.code}" style="width:22px;height:14px;background-size:cover;display:inline-block;border-radius:2px;vertical-align:middle;margin-right:0.4rem;"></span>
                      ${country ? this._n(country) : q.code}
                    </div>
                    <div class="ch-recap-cell ${myA?.correct ? 'cell-correct' : 'cell-wrong'}">
                      ${icon(myA)} ${time(myA)}
                    </div>
                    <div class="ch-recap-cell ${theirA?.correct ? 'cell-correct' : 'cell-wrong'}">
                      ${icon(theirA)} ${time(theirA)}
                    </div>
                  </div>`;
              }).join('')}
            </div>
          </div>

          <div style="display:flex;gap:1rem;justify-content:center;margin-top:2rem;flex-wrap:wrap;">
            <a href="#/quiz/defi" class="btn btn-primary">Nouveau défi</a>
            <a href="#/" class="btn btn-ghost">Accueil</a>
          </div>
        </div>
      </div>`;
  },

  // ── Helpers génération de questions ──────────────────────────────────────────
  _generateQuestions(cfg) {
    const pool = GL.QuizEngine.getPool(cfg.continent, cfg.difficulty);
    if (pool.length < 4) return [];
    const count    = Math.min(cfg.count, pool.length);
    const selected = cfg.difficulty === 'hard'
      ? GL.QuizEngine.weightedPick(pool, count, GL.UI.getStats().diffScore || {})
      : GL.QuizEngine.pickRandom(pool, count);

    const qtypes = ['flags', 'capitals', 'map'];
    return selected.map(country => ({
      code:  country.code,
      qtype: (cfg.mode === 'nightmare' || cfg.mode === 'random')
        ? qtypes[Math.floor(Math.random() * qtypes.length)]
        : cfg.mode,
    }));
  },

  _buildQuestions(challenge) {
    const { config, questions: qCodes } = challenge;
    const pool = GL.QuizEngine.getPool(config.continent, 'normal');

    return (qCodes || []).map(q => {
      const country = GL.COUNTRIES.find(c => c.code === q.code);
      if (!country) return null;
      switch (q.qtype || config.mode) {
        case 'flags':    return GL.QuizEngine.genFlagToName(country, pool);
        case 'capitals': return GL.QuizEngine.genCountryToCapital(country, pool);
        case 'map':      return GL.QuizEngine.genMapQuestion(country, 'name');
        default:         return GL.QuizEngine.genFlagToName(country, pool);
      }
    }).filter(Boolean);
  },

  _configLabel(cfg) {
    if (!cfg) return '';
    const mode  = { flags: '🏁 Drapeaux', capitals: '🏛️ Capitales', map: '📍 Carte', nightmare: '💀 Cauchemar', random: '🎲 Aléatoire' }[cfg.mode] || cfg.mode;
    const cont  = cfg.continent === 'all' ? '🌍 Monde entier' : (GL.I18N ? GL.I18N.cont(cfg.continent) : cfg.continent);
    const diff  = { easy: 'Facile', normal: 'Normal', hard: 'Difficile' }[cfg.difficulty] || cfg.difficulty;
    return `<span class="challenge-config-tag">${mode}</span>
            <span class="challenge-config-tag">${cfg.count} pays</span>
            <span class="challenge-config-tag">${cont}</span>
            <span class="challenge-config-tag">${diff}</span>`;
  },

  // ── Actions Supabase ──────────────────────────────────────────────────────────
  async _fetchUsers() {
    const client = GL.Auth?._client;
    const myId   = GL.Auth?._user?.id;
    if (!client) return [];

    const { data } = await client
      .from('user_data').select('user_id, username, stats, profile')
      .not('username', 'is', null);

    return (data || [])
      .filter(r => r.user_id !== myId)
      .map(r => {
        const xp    = parseInt((r.stats || {}).rankedXP, 10) || 0;
        const prof  = r.profile || {};
        const avatarUrl = prof.avatar
          ? GL.Profile.avatarUrl(GL.Profile.migrateAvatar(prof.avatar), 80)
          : `https://api.dicebear.com/9.x/avataaars/svg?seed=${r.user_id}&size=80`;
        return { id: r.user_id, name: r.username || 'Joueur', xp, avatarUrl };
      })
      .sort((a, b) => b.xp - a.xp);
  },

  async _createChallenge(challengedId, config, questions) {
    const client = GL.Auth._client;
    const myId   = GL.Auth._user.id;
    const { data, error } = await client
      .from('challenges')
      .insert({ challenger_id: myId, challenged_id: challengedId, status: 'pending', config, questions })
      .select('id').single();
    if (error) { console.error('[Challenge] create:', error.message); GL.UI.toast('Erreur envoi du défi', 'error'); return null; }
    return data.id;
  },

  async _acceptChallenge(id) {
    const { error } = await GL.Auth._client.from('challenges').update({ status: 'active' }).eq('id', id);
    if (error) console.error('[Challenge] accept:', error.message);
  },

  async _declineChallenge(id) {
    const { error } = await GL.Auth._client.from('challenges').update({ status: 'declined' }).eq('id', id);
    if (error) console.error('[Challenge] decline:', error.message);
  },

  async _expireChallenge(id) {
    if (!GL.Auth?._client) return;
    await GL.Auth._client.from('challenges').update({ status: 'expired' }).eq('id', id).eq('status', 'pending');
  },

  async _setReady(id, isChallenger) {
    const field = isChallenger ? 'challenger_ready' : 'challenged_ready';
    const { error } = await GL.Auth._client.from('challenges').update({ [field]: true }).eq('id', id);
    if (error) console.error('[Challenge] setReady:', error.message);
  },

  async _submitResult(challengeId, finishTime, penalties, answers) {
    const { error } = await GL.Auth._client.from('challenge_results').upsert({
      challenge_id: challengeId,
      user_id:      GL.Auth._user.id,
      finish_time:  finishTime,
      penalties,
      answers,
    });
    if (error) console.error('[Challenge] submitResult:', error.message);
  },

  // ── Realtime ──────────────────────────────────────────────────────────────────
  _subscribeToChallengeUpdates(id, callback) {
    const client = GL.Auth?._client;
    if (!client) return;
    this._unsubscribeChallenge();

    this._challengeChannel = client
      .channel(`ch-watch-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'challenges',
        filter: `id=eq.${id}`,
      }, (payload) => callback(payload.new))
      .subscribe();

    const prev = GL._onRouteLeave;
    GL._onRouteLeave = () => { prev?.(); this._unsubscribeChallenge(); };
  },

  _unsubscribeChallenge() {
    if (this._challengeChannel && GL.Auth?._client) {
      GL.Auth._client.removeChannel(this._challengeChannel);
      this._challengeChannel = null;
    }
  },

  _cleanup() {
    if (this._keyHandler)               { document.removeEventListener('keydown', this._keyHandler); this._keyHandler = null; }
    if (this._quizState?.timerInterval) { clearInterval(this._quizState.timerInterval); }
    this._quizState = null;
    this._unsubscribeChallenge();
  },
};
