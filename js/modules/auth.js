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
  _realtimeChannel: null,
  _lastPushAt: 0,          // timestamp du dernier _push() pour ignorer notre propre événement
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

          const prevUid = localStorage.getItem('gl_prev_uid');
          const accountSwitched = prevUid && prevUid !== session.user.id;

          if (accountSwitched) {
            localStorage.removeItem('gl_prev_uid');
            // Le compte Google est déjà lié à un autre compte → ses données écrasent les locales
            const pulled = await this._pull();
            if (pulled) {
              // Supprimer l'ancienne row anonyme (évite les doublons dans le leaderboard)
              await this._client.rpc('delete_user_data', { p_uid: prevUid });
              window.location.reload();
              return;
            }
            // Pas de données sur le compte Google → migrer depuis l'ancien compte
            await this._client.rpc('migrate_user_data_from_uid', { p_old_uid: prevUid });
            // Supprimer l'ancienne row anonyme après migration
            await this._client.rpc('delete_user_data', { p_uid: prevUid });
            await this._push();
          } else {
            // Toujours essayer de récupérer les données DB en priorité
            // (cas : compte Google déjà lié à un compte avec des données)
            const pulled = await this._pull();
            if (pulled) { window.location.reload(); return; }

            // Pas de données en DB → pousser les données locales si elles existent
            let localProfile = null;
            try { localProfile = JSON.parse(localStorage.getItem('gl_profile')); } catch(e) {}
            const isGuest = !localProfile || localProfile.isGuest || !localProfile.name;

            if (!isGuest) {
              // Données locales valides → on les pousse et on recharge
              await this._push();
              window.location.reload();
              return;
            }

            // Première connexion Google sans aucune donnée locale ni en DB
            // → initialiser un profil depuis les métadonnées Google
            const meta = session.user.user_metadata || {};
            const googleName = meta.full_name || meta.name || meta.email?.split('@')[0] || '';
            if (googleName) {
              const newProfile = window.GL?.Profile?.defaultProfile
                ? GL.Profile.defaultProfile(googleName, false)
                : { name: googleName, isGuest: false, nameColor: '', avatar: {} };
              localStorage.setItem('gl_profile', JSON.stringify(newProfile));
              await this._push(googleName);
              window.location.reload();
              return;
            }
          }
        }

        // Reload / navigation normale → sync différée 5s (ne concurrence pas le leaderboard)
        this.scheduleSync();
        this._subscribeRealtime();

      } else if (event === 'INITIAL_SESSION' && session) {
        // Restauration de session au chargement / rechargement de page
        // Pull systématique → la DB est source de vérité (prénom changé ailleurs, etc.)
        this._user = session.user;
        const pulled = await this._pull();
        if (pulled && window.GL?.Profile) {
          const profile = GL.Profile.get();
          if (profile) GL.Profile.updateNavAvatar(profile);
        }
        this.scheduleSync();
        this._subscribeRealtime();

      } else if (event === 'SIGNED_OUT') {
        this._user = null;
        this._unsubscribeRealtime();
      }
    });

    // Restaurer la session persistée (localStorage Supabase)
    // Note : scheduleSync() n'est PAS appelé ici — onAuthStateChange (INITIAL_SESSION)
    // s'en charge déjà et évite un double-push avec un éventuel _user stale.
    this._client.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.warn('[Auth] Session invalide:', error.message);
      } else if (data.session) {
        this._user = data.session.user;
      }
    }).catch(e => {
      console.warn('[Auth] getSession échoué:', e?.message);
    }).finally(() => {
      // Fallback : si onAuthStateChange n'a pas encore fire (pas de session), résoudre ici
      _resolveReady();
    });
  },

  isLoggedIn() { return !!this._user; },

  // ── Garantit une session valide (refresh si token expiré) ───────────────────
  async ensureValidSession() {
    if (!this._client) return false;
    try {
      const { data, error } = await this._client.auth.getSession();
      if (error || !data?.session) return false;
      this._user = data.session.user;
      return true;
    } catch (e) {
      return false;
    }
  },

  isGoogleUser() {
    return this._user?.app_metadata?.provider === 'google';
  },

  // ── Connexion via Google OAuth ──────────────────────────────────────────────
  async signInWithGoogle() {
    if (!this._client) return;
    const redirectTo = window.location.href.split('#')[0];

    // Forcer isNewLogin=true au retour OAuth pour que le pull/push s'exécute
    sessionStorage.removeItem('gl_auth_uid');

    // Garantir que this._user est à jour (getSession() peut ne pas encore avoir résolu)
    if (!this._user) {
      const { data } = await this._client.auth.getSession();
      if (data?.session) this._user = data.session.user;
    }

    // Si l'utilisateur est déjà connecté (compte anonyme), on lie l'identité Google
    // au lieu de créer un nouveau compte → même user_id, pas de doublon en DB
    if (this._user) {
      const { error } = await this._client.auth.linkIdentity({
        provider: 'google',
        options: { redirectTo, queryParams: { prompt: 'select_account' } },
      });
      if (!error) return;
      // linkIdentity non supporté ou erreur → fallback vers signInWithOAuth classique
      console.warn('[Auth] linkIdentity échoué, fallback signInWithOAuth:', error.message);
      localStorage.setItem('gl_prev_uid', this._user.id);
    }

    const { error } = await this._client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, queryParams: { prompt: 'select_account' } },
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

  // ── Abonnement Realtime — sync multi-appareils ──────────────────────────────
  _subscribeRealtime() {
    if (!this._client || !this._user || this._realtimeChannel) return;

    this._realtimeChannel = this._client
      .channel(`user_data_sync:${this._user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_data',
        filter: `user_id=eq.${this._user.id}`,
      }, (payload) => {
        // Ignorer notre propre push (même appareil) — fenêtre de 10 s
        if (Date.now() - this._lastPushAt < 10000) return;

        const d = payload.new;
        if (!d) return;

        if (d.profile) localStorage.setItem('gl_profile', JSON.stringify(d.profile));
        if (d.stats)   localStorage.setItem('gl_stats',   JSON.stringify(d.stats));
        if (d.active_title !== undefined) {
          d.active_title
            ? localStorage.setItem('gl_active_title', d.active_title)
            : localStorage.removeItem('gl_active_title');
        }

        // Rafraîchir l'UI sans recharger la page
        if (window.GL?.Profile) {
          const profile = GL.Profile.get();
          if (profile) GL.Profile.updateNavAvatar(profile);
          if (window.location.hash === '#/profil') {
            GL.Profile.render(document.getElementById('app'));
          }
        }
      })
      .subscribe((status) => {
      });
  },

  _unsubscribeRealtime() {
    if (this._realtimeChannel) {
      this._client?.removeChannel(this._realtimeChannel);
      this._realtimeChannel = null;
    }
  },

  // ── Push local → DB ─────────────────────────────────────────────────────────
  async _push(username) {
    if (!this._user || !this._client) return;

    let profile = null;
    try { profile = JSON.parse(localStorage.getItem('gl_profile')); } catch(e) {}
    const activeTitle = localStorage.getItem('gl_active_title');
    const name = username || profile?.name || null;

    this._lastPushAt = Date.now();
    const { error } = await this._client.from('user_data').upsert({
      user_id:      this._user.id,
      username:     name,
      stats:        GL.UI.getStats(),
      profile,
      active_title: activeTitle,
      updated_at:   new Date().toISOString(),
    });
    if (error) {
      // AbortError = timeout réseau ou navigation → silencieux
      if (error.message?.includes('AbortError') || error.name === 'AbortError') return;
      console.error('[Auth] _push:', error.message);
      // Violation FK → le user_id n'existe plus dans auth.users (session orpheline)
      // On déconnecte pour purger la session invalide du localStorage Supabase
      if (error.code === '23503' || error.message?.includes('foreign key')) {
        console.warn('[Auth] Session orpheline détectée, déconnexion automatique');
        this._user = null;
        this._client.auth.signOut().catch(() => {});
        return;
      }
      if (GL.UI?.toast) GL.UI.toast('Erreur sauvegarde : ' + error.message, 'error');
    }
  },

  // ── Pull DB → local ─────────────────────────────────────────────────────────
  async _pull() {
    if (!this._user || !this._client) return false;

    let { data, error } = await this._client
      .from('user_data')
      .select('profile, stats, active_title')
      .eq('user_id', this._user.id)
      .single();

    // Pas de données pour ce user_id → cherche un compte avec le même email
    if (error || !data || (!data.profile && !data.stats)) {
      const { data: migrated } = await this._client.rpc('migrate_user_data_by_email');
      if (migrated) data = migrated;
    }

    if (!data) return false;

    if (data.profile)      localStorage.setItem('gl_profile',      JSON.stringify(data.profile));
    if (data.stats)        localStorage.setItem('gl_stats',        JSON.stringify(data.stats));
    if (data.active_title) localStorage.setItem('gl_active_title', data.active_title);

    return true;
  },
};
