window.GL = window.GL || {};

// ─── GL.Auth — Authentification via Supabase ──────────────────────────────────
//
// Fonctionnement :
//   1. L'utilisateur joue en invité → localStorage uniquement, pas de compte
//   2. L'utilisateur entre son prénom dans GL.Profile → onProfileNameSet() :
//      - Si pas de compte → signInAnonymously() crée un UUID persistant
//      - Les données localStorage sont migrées vers la DB
//      - Toutes les mises à jour suivantes sont synchro automatiquement (5 s)
//   3. À chaque rechargement de page → init() restaure la session existante
//   4. L'utilisateur clique "Se connecter avec Google" → signInWithGoogle() :
//      - Redirige vers Google, puis revient sur l'app
//      - Si le profil local est invité/vide → _pull() restaure les données depuis la DB
//      - Sinon → _push() synchronise les données locales vers le compte Google
//
// Le prénom peut changer ; l'identifiant principal est toujours le user_id (UUID).
// ─────────────────────────────────────────────────────────────────────────────

GL.Auth = {
  _client: null,
  _user: null,
  _syncTimer: null,
  ready: Promise.resolve(), // résolu immédiatement jusqu'à ce que init() soit appelé

  // ── Initialisation ──────────────────────────────────────────────────────────
  init() {
    if (window.location.protocol === 'file:') return;
    if (!window.supabase || !window.GL_CONFIG) return;
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.GL_CONFIG;
    if (!SUPABASE_URL || SUPABASE_URL.includes('VOTRE_ID')) return;

    // Promesse résolue dès que l'état auth initial est connu (TOKEN_REFRESHED ou INITIAL_SESSION)
    // Permet au leaderboard d'attendre la session avant de requêter Supabase
    let _readyResolved = false;
    let _readyResolve;
    this.ready = new Promise(resolve => { _readyResolve = resolve; });
    const _resolveReady = () => {
      if (!_readyResolved) { _readyResolved = true; _readyResolve(); }
    };

    this._client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        fetch: (url, opts = {}) => {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 10000);
          return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
        },
      },
    });

    // Écouter les changements d'état (retour OAuth Google inclus)
    this._client.auth.onAuthStateChange(async (event, session) => {
      // Résoudre ready immédiatement — avant toute opération async (push/pull)
      _resolveReady();

      if (event === 'SIGNED_IN' && session) {
        this._user = session.user;

        // Vrai nouveau login = l'utilisateur n'était pas encore connu dans cette session de tab
        // sessionStorage persiste à travers les reloads (même onglet), pas entre onglets
        const sessionKey = 'gl_auth_uid';
        const knownUid = sessionStorage.getItem(sessionKey);
        const isNewLogin = !knownUid || knownUid !== session.user.id;

        if (isNewLogin) {
          sessionStorage.setItem(sessionKey, session.user.id);
          let localProfile = null;
          try { localProfile = JSON.parse(localStorage.getItem('gl_profile')); } catch(e) {}
          const isGuest = !localProfile || localProfile.isGuest || !localProfile.name;

          if (isGuest) {
            // Nouveau PC ou pas de données locales → restaurer depuis la DB
            const pulled = await this._pull();
            if (pulled) { window.location.reload(); return; }
          } else {
            // Données locales existantes → pousser vers le nouveau compte
            await this._push();
          }
        }

        // Reload / navigation normale → sync différée 5s (ne concurrence pas le leaderboard)
        this.scheduleSync();

      } else if (event === 'SIGNED_OUT') {
        this._user = null;
      }
    });

    // Restaurer la session persistée (localStorage Supabase)
    this._client.auth.getSession().then(({ data, error }) => {
      if (error) {
        // Session expirée ou invalidée (ex: compte anonyme supprimé) → nettoyer
        console.warn('[Auth] Session invalide, nettoyage:', error.message);
        this._client.auth.signOut();
      } else if (data.session) {
        this._user = data.session.user;
        this.scheduleSync();
      }
    }).catch(e => {
      console.warn('[Auth] getSession échoué:', e?.message);
    }).finally(() => {
      // Fallback : si onAuthStateChange n'a pas encore fire (pas de session), résoudre ici
      _resolveReady();
    });
  },

  isLoggedIn() { return !!this._user; },

  isGoogleUser() {
    return this._user?.app_metadata?.provider === 'google';
  },

  // ── Connexion via Google OAuth ──────────────────────────────────────────────
  async signInWithGoogle() {
    if (!this._client) return;
    const redirectTo = window.location.href.split('#')[0];
    const { error } = await this._client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) {
      console.error('[Auth] signInWithGoogle:', error.message);
      if (window.GL?.UI?.toast) GL.UI.toast('Erreur de connexion Google', 'error');
    }
  },

  // ── Déconnexion ─────────────────────────────────────────────────────────────
  async signOut() {
    if (!this._client) return;
    await this._client.auth.signOut();
    this._user = null;
  },

  // ── Appelé par profile.js quand l'utilisateur tape son prénom ───────────────
  async onProfileNameSet(username) {
    if (!this._client) return;

    if (!this._user) {
      const { data, error } = await this._client.auth.signInAnonymously();
      if (error) {
        console.error('[Auth] signInAnonymously:', error.message);
        if (GL.UI?.toast) GL.UI.toast('Erreur sync : ' + error.message, 'error');
        return;
      }
      this._user = data.user;
      await this._push(username);
    } else {
      this.scheduleSync(username);
    }
  },

  // ── Sync différée (debounce 5 s) — appelée aussi par GL.UI.saveStats ────────
  scheduleSync(username) {
    if (!this._user || !this._client) return;
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this._push(username), 5000);
  },

  // ── Push local → DB ─────────────────────────────────────────────────────────
  async _push(username) {
    if (!this._user || !this._client) return;

    let profile = null;
    try { profile = JSON.parse(localStorage.getItem('gl_profile')); } catch(e) {}
    const activeTitle = localStorage.getItem('gl_active_title');
    const name = username || profile?.name || null;

    const { error } = await this._client.from('user_data').upsert({
      user_id:      this._user.id,
      username:     name,
      stats:        GL.UI.getStats(),
      profile,
      active_title: activeTitle,
      updated_at:   new Date().toISOString(),
    });
    if (error) {
      console.error('[Auth] _push:', error.message);
      if (GL.UI?.toast) GL.UI.toast('Erreur sauvegarde : ' + error.message, 'error');
    }
  },

  // ── Pull DB → local ─────────────────────────────────────────────────────────
  async _pull() {
    if (!this._user || !this._client) return false;

    const { data, error } = await this._client
      .from('user_data')
      .select('profile, stats, active_title')
      .eq('user_id', this._user.id)
      .single();

    if (error || !data) return false;
    if (!data.profile && !data.stats) return false;

    if (data.profile)      localStorage.setItem('gl_profile',      JSON.stringify(data.profile));
    if (data.stats)        localStorage.setItem('gl_stats',        JSON.stringify(data.stats));
    if (data.active_title) localStorage.setItem('gl_active_title', data.active_title);

    return true;
  },
};
