window.GL = window.GL || {};

// ─── GL.Auth — Intégration Supabase ──────────────────────────────────────────
// Initialisation : GL.Auth.init() est appelé dans GL.App.init()
// Sync automatique des stats toutes les 5 s après chaque saveStats()
// Stratégie de merge : prend le max de chaque compteur, fusionne les historiques
// ─────────────────────────────────────────────────────────────────────────────

GL.Auth = {
  _client: null,
  _user: null,
  _syncTimer: null,

  // ── Initialisation ──────────────────────────────────────────────────────────
  init() {
    if (!window.supabase || !window.GL_CONFIG) return;
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.GL_CONFIG;
    if (!SUPABASE_URL || SUPABASE_URL.includes('VOTRE_ID')) return; // non configuré

    this._client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { flowType: 'pkce', detectSessionInUrl: true }
    });

    // Écouter les changements d'état d'authentification
    this._client.auth.onAuthStateChange(async (event, session) => {
      this._user = session?.user || null;
      if (event === 'SIGNED_IN') await this._onSignIn();
      this._updateUI();
    });

    // Restaurer la session existante (rechargement de page)
    this._client.auth.getSession().then(({ data }) => {
      this._user = data.session?.user || null;
      this._updateUI();
    });
  },

  // ── API publique ────────────────────────────────────────────────────────────
  isLoggedIn() {
    return !!this._user;
  },

  async signInWithEmail(email) {
    if (!this._client) return 'Client non initialisé';
    const { error } = await this._client.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });
    return error ? error.message : null;
  },

  async signOut() {
    if (!this._client) return;
    await this._client.auth.signOut();
    this._user = null;
    this._updateUI();
  },

  // Appelée par GL.UI.saveStats() — debounce 5 s pour ne pas surcharger l'API
  scheduleSync() {
    if (!this._user || !this._client) return;
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this._push(), 5000);
  },

  // ── Sync interne ────────────────────────────────────────────────────────────
  async _onSignIn() {
    const remote = await this._loadRemote();
    if (remote) {
      // Fusionner stats locales + distantes
      const local  = GL.UI.getStats();
      const merged = this._mergeStats(local, remote.stats || GL.UI.defaultStats());
      GL.UI.saveStatsLocal(merged); // écriture locale sans re-déclencher sync
      // Restaurer profil et titre équipé
      if (remote.profile) {
        try { localStorage.setItem('gl_profile', JSON.stringify(remote.profile)); } catch(e) {}
      }
      if (remote.active_title) {
        localStorage.setItem('gl_active_title', remote.active_title);
      }
      GL.UI.toast('Stats synchronisées', 'success');
    } else {
      // Première connexion : pousser les données locales existantes
      await this._push();
    }
  },

  async _loadRemote() {
    if (!this._user || !this._client) return null;
    const { data, error } = await this._client
      .from('user_data')
      .select('stats, profile, active_title')
      .eq('user_id', this._user.id)
      .maybeSingle();
    return (error || !data) ? null : data;
  },

  async _push() {
    if (!this._user || !this._client) return;
    let profile = null;
    try { profile = JSON.parse(localStorage.getItem('gl_profile')); } catch(e) {}
    const activeTitle = localStorage.getItem('gl_active_title');
    await this._client.from('user_data').upsert({
      user_id:      this._user.id,
      stats:        GL.UI.getStats(),
      profile,
      active_title: activeTitle,
      updated_at:   new Date().toISOString(),
    });
  },

  // ── Merge des stats ─────────────────────────────────────────────────────────
  // Stratégie : max pour les compteurs, union pour mastery/pays, fusion historique
  _mergeStats(local, remote) {
    const m = { ...remote };
    m.totalQuestions = Math.max(local.totalQuestions || 0, remote.totalQuestions || 0);
    m.totalCorrect   = Math.max(local.totalCorrect   || 0, remote.totalCorrect   || 0);
    m.maxStreak      = Math.max(local.maxStreak      || 0, remote.maxStreak      || 0);
    m.rankedXP       = Math.max(local.rankedXP       || 0, remote.rankedXP       || 0);
    m.peakMastered   = Math.max(local.peakMastered   || 0, remote.peakMastered   || 0);

    // Mastery : max par pays par type
    m.mastery = { ...(remote.mastery || {}) };
    for (const code in (local.mastery || {})) {
      if (!m.mastery[code]) m.mastery[code] = {};
      for (const type in local.mastery[code]) {
        m.mastery[code][type] = Math.max(
          m.mastery[code][type] || 0,
          local.mastery[code][type] || 0
        );
      }
    }

    // countriesStats : max q et c
    m.countriesStats = { ...(remote.countriesStats || {}) };
    for (const code in (local.countriesStats || {})) {
      if (!m.countriesStats[code]) m.countriesStats[code] = { q: 0, c: 0 };
      m.countriesStats[code].q = Math.max(m.countriesStats[code].q || 0, local.countriesStats[code].q || 0);
      m.countriesStats[code].c = Math.max(m.countriesStats[code].c || 0, local.countriesStats[code].c || 0);
    }

    // diffScore : max (score de difficulté)
    m.diffScore = { ...(remote.diffScore || {}) };
    for (const code in (local.diffScore || {})) {
      m.diffScore[code] = Math.max(m.diffScore[code] || 0, local.diffScore[code] || 0);
    }

    // quizHistory : fusionner, dédupliquer par type+date+score, garder 20 récents
    const all  = [...(local.quizHistory || []), ...(remote.quizHistory || [])];
    const seen = new Set();
    m.quizHistory = all
      .filter(h => {
        const key = `${h.type}|${h.date}|${h.score}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => b.date - a.date)
      .slice(0, 20);

    return m;
  },

  // ── UI ──────────────────────────────────────────────────────────────────────
  _updateUI() {
    const btn = document.getElementById('authBtn');
    if (!btn) return;
    if (this._user) {
      const label = (this._user.email || '').split('@')[0] || 'Connecté';
      btn.textContent = label;
      btn.title = 'Compte / déconnexion';
      btn.classList.add('auth-logged-in');
    } else {
      btn.textContent = 'Connexion';
      btn.title = 'Se connecter';
      btn.classList.remove('auth-logged-in');
    }
  },

  openModal() {
    // Recréer la modale à chaque ouverture pour refléter l'état courant
    const existing = document.getElementById('authModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'auth-modal';
    modal.innerHTML = this._modalHtml();
    document.body.appendChild(modal);
    this._bindModal(modal);

    // Focus sur le champ email si non connecté
    const input = modal.querySelector('#authEmailInput');
    if (input) setTimeout(() => input.focus(), 50);
  },

  _modalHtml() {
    if (this.isLoggedIn()) {
      const email = this._user.email || '';
      return `
        <div class="auth-modal-overlay" id="authModalOverlay">
          <div class="auth-modal-box">
            <button class="auth-modal-close" id="authModalClose" aria-label="Fermer">✕</button>
            <h2 class="auth-modal-title">Compte</h2>
            <p class="auth-modal-info">Connecté en tant que<br><strong>${email}</strong></p>
            <p class="auth-modal-info" style="font-size:0.8rem;opacity:0.7;">
              Vos stats sont automatiquement synchronisées.
            </p>
            <button class="btn btn-secondary auth-modal-action" id="authSignOut">Se déconnecter</button>
          </div>
        </div>`;
    }
    return `
      <div class="auth-modal-overlay" id="authModalOverlay">
        <div class="auth-modal-box">
          <button class="auth-modal-close" id="authModalClose" aria-label="Fermer">✕</button>
          <h2 class="auth-modal-title">Connexion</h2>
          <p class="auth-modal-info">
            Entrez votre email pour recevoir un lien de connexion.<br>
            <small>Vos stats seront sauvegardées et accessibles sur tous vos appareils.</small>
          </p>
          <input
            type="email"
            id="authEmailInput"
            placeholder="votre@email.com"
            class="auth-email-input"
            autocomplete="email"
          >
          <button class="btn btn-primary auth-modal-action" id="authSendLink">Envoyer le lien</button>
          <p id="authMsg" class="auth-msg"></p>
        </div>
      </div>`;
  },

  _bindModal(modal) {
    modal.addEventListener('click', e => {
      if (e.target.id === 'authModalOverlay') modal.remove();
      if (e.target.id === 'authModalClose')   modal.remove();
      if (e.target.id === 'authSendLink')     this._handleSendLink(modal);
      if (e.target.id === 'authSignOut') {
        this.signOut().then(() => {
          modal.remove();
          GL.UI.toast('Déconnecté', 'info');
        });
      }
    });
    const input = modal.querySelector('#authEmailInput');
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this._handleSendLink(modal);
      });
    }
  },

  async _handleSendLink(modal) {
    const input = modal.querySelector('#authEmailInput');
    const msg   = modal.querySelector('#authMsg');
    const btn   = modal.querySelector('#authSendLink');
    if (!input || !msg || !btn) return;

    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      msg.textContent = 'Email invalide.';
      msg.className   = 'auth-msg auth-msg-error';
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Envoi…';
    msg.textContent = '';

    const error = await this.signInWithEmail(email);
    if (error) {
      msg.textContent = 'Erreur : ' + error;
      msg.className   = 'auth-msg auth-msg-error';
      btn.disabled    = false;
      btn.textContent = 'Envoyer le lien';
    } else {
      msg.textContent = '✓ Lien envoyé ! Vérifiez votre boite mail.';
      msg.className   = 'auth-msg auth-msg-success';
      btn.textContent = 'Lien envoyé';
    }
  },
};
