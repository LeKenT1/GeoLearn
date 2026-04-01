window.GL = window.GL || {};

GL.Router = {
  routes: {},
  currentPath: null,

  init(routes) {
    this.routes = routes;
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },

  navigate(path) {
    window.location.hash = '#' + path;
  },

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');

    // Find matching route
    let handler = null;
    let params = {};

    // Exact match first
    if (this.routes[hash]) {
      handler = this.routes[hash];
    } else {
      // Prefix match for parameterized routes
      for (const [pattern, fn] of Object.entries(this.routes)) {
        if (pattern.includes(':')) {
          const regex = new RegExp('^' + pattern.replace(/:(\w+)/g, '([^/]+)') + '$');
          const match = hash.match(regex);
          if (match) {
            handler = fn;
            const keys = [...pattern.matchAll(/:(\w+)/g)].map(m => m[1]);
            keys.forEach((k, i) => { params[k] = match[i + 1]; });
            break;
          }
        }
      }
    }

    if (!handler) {
      handler = this.routes['*'] || ((el) => {
        const t = (k) => (window.GL && GL.I18N) ? GL.I18N.t(k) : k;
        el.innerHTML = `<div class="page" style="text-align:center;padding:4rem;"><div style="font-size:4rem;margin-bottom:1rem">🗺️</div><h2 style="font-size:1.5rem;margin-bottom:0.5rem">${t('error.notfound')}</h2><p style="color:var(--text-secondary)">${t('error.notfound.msg')}</p><br><a href="#/" class="btn btn-primary">${t('error.notfound.back')}</a></div>`;
      });
    }

    this.currentPath = hash;
    this.updateActiveLink(hash);
    handler(app, params);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  refresh() {
    const app = document.getElementById('app');
    const handler = this.routes[this.currentPath];
    if (handler && app) handler(app);
  },

  updateActiveLink(path) {
    document.querySelectorAll('.nav-link[href]').forEach(link => {
      const linkPath = link.getAttribute('href').slice(1);
      link.classList.toggle('active', linkPath === path);
    });
  }
};
