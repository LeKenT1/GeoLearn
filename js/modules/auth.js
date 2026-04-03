window.GL = window.GL || {};

// ─── GL.Auth — Authentification anonyme via Supabase ─────────────────────────
//
// Fonctionnement :
//   1. L'utilisateur joue en invité → localStorage uniquement, pas de compte
//   2. L'utilisateur entre son prénom dans GL.Profile → onProfileNameSet() :
//      - Si pas de compte → signInAnonymously() crée un UUID persistant
//      - Les données localStorage sont migrées vers la DB
//      - Toutes les mises à jour suivantes sont synchro automatiquement (5 s)
//   3. À chaque rechargement de page → init() restaure la session existante
//
// Le prénom peut changer ; l'identifiant principal est toujours le user_id (UUID).
// ─────────────────────────────────────────────────────────────────────────────

GL.Auth = {
  _client: null,
  _user: null,
  _syncTimer: null,

  // ── Initialisation ──────────────────────────────────────────────────────────
  init() {
    if (!window.supabase || !window.GL_CONFIG) return;
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.GL_CONFIG;
    if (!SUPABASE_URL || SUPABASE_URL.includes('VOTRE_ID')) return;

    this._client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Restaurer la session persistée (localStorage Supabase)
    this._client.auth.getSession().then(({ data }) => {
      if (data.session) {
        this._user = data.session.user;
        // Pousser les stats éventuellement jouées avant la restauration
        this.scheduleSync();
      }
    });
  },

  isLoggedIn() { return !!this._user; },

  // ── Appelé par profile.js quand l'utilisateur tape son prénom ───────────────
  async onProfileNameSet(username) {
    if (!this._client) return;

    if (!this._user) {
      // Première fois qu'un prénom est défini → créer le compte anonyme
      const { data, error } = await this._client.auth.signInAnonymously();
      if (error) { console.error('[Auth] signInAnonymously:', error.message); return; }
      this._user = data.user;
      // Migrer toutes les données locales vers la DB
      await this._push(username);
    } else {
      // Compte existant → sync avec le nouveau prénom
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
    // Le prénom peut être passé en paramètre ou lu depuis le profil local
    const name = username || profile?.name || null;

    const { error } = await this._client.from('user_data').upsert({
      user_id:      this._user.id,
      username:     name,
      stats:        GL.UI.getStats(),
      profile,
      active_title: activeTitle,
      updated_at:   new Date().toISOString(),
    });
    if (error) console.error('[Auth] push:', error.message);
  },
};
