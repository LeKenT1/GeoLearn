// LOCAL ONLY — page de test pour visualiser les drapeaux dans chaque contexte
window.GL = window.GL || {};

GL.FlagTest = {
  render(container) {
    const countries = GL.COUNTRIES || [];

    container.innerHTML = `
      <div class="page" style="max-width:900px;margin:0 auto;padding:2rem 1rem;">
        <h1 style="font-size:1.6rem;font-weight:700;margin-bottom:0.25rem;">🧪 Test Drapeaux</h1>
        <p style="color:var(--text-muted);margin-bottom:1.5rem;">Recherche un pays pour voir comment son drapeau s'affiche dans chaque contexte.</p>

        <div style="display:flex;gap:0.75rem;margin-bottom:2rem;align-items:center;">
          <input
            id="flagTestInput"
            type="text"
            placeholder="Nom ou code pays (ex: monaco, mc, ch...)"
            autocomplete="off"
            style="flex:1;padding:0.65rem 1rem;border-radius:8px;border:1.5px solid var(--border);background:var(--surface);color:var(--text-primary);font-size:1rem;outline:none;"
          >
          <button id="flagTestBtn" class="btn btn-primary">Afficher</button>
        </div>

        <div id="flagTestSuggestions" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;"></div>

        <div id="flagTestResult"></div>
      </div>
    `;

    const input = container.querySelector('#flagTestInput');
    const btn   = container.querySelector('#flagTestBtn');
    const sugg  = container.querySelector('#flagTestSuggestions');
    const result = container.querySelector('#flagTestResult');

    // Suggestions rapides
    const quickCodes = ['mc', 'ch', 'va', 'np', 'fr', 'us', 'gb', 'jp'];
    sugg.innerHTML = quickCodes.map(code => {
      const c = countries.find(x => x.code === code);
      if (!c) return '';
      return `<button class="btn btn-secondary" style="padding:0.3rem 0.75rem;font-size:0.8rem;" data-code="${code}">${c.nameFr}</button>`;
    }).join('');
    sugg.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => { input.value = b.dataset.code; this._show(b.dataset.code, countries, result); });
    });

    const go = () => {
      const val = input.value.trim().toLowerCase();
      const country = countries.find(c => c.code === val || c.nameFr.toLowerCase() === val || c.name.toLowerCase() === val);
      if (country) {
        this._show(country.code, countries, result);
      } else {
        result.innerHTML = `<p style="color:var(--error);">Pays introuvable : "${input.value}"</p>`;
      }
    };

    btn.addEventListener('click', go);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  },

  _show(code, countries, result) {
    const country = countries.find(c => c.code === code);
    if (!country) return;

    // Ratios officiels (copié de quizFlags.js)
    const FLAG_RATIOS = { 'mc': '4/5', 'ch': '1/1', 'va': '1/1', 'np': '4/5' };
    const ratio = FLAG_RATIOS[code] || '3/2';

    const flagStyle = (w, h, extra = '') =>
      `width:${w}px;height:${h}px;background-size:cover;border-radius:6px;display:inline-block;box-shadow:0 2px 8px rgba(0,0,0,0.35);${extra}`;

    const flagStyleContain = (h, r = ratio) =>
      `height:${h}px;aspect-ratio:${r};background-size:contain;background-position:center;background-repeat:no-repeat;display:inline-block;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.35);`;

    result.innerHTML = `
      <div style="background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;">
        <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:0.25rem;">${country.nameFr} <code style="font-size:0.75rem;color:var(--text-muted);font-weight:400;">.fi-${code}</code></h2>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;">Ratio officiel : <strong>${ratio}</strong></p>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.25rem;">

          ${this._card('Quiz Drapeaux – Question (contain)', `
            <span class="fi fi-${code}" style="${flagStyleContain(107)}"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">h=107px, aspect-ratio=${ratio}, contain</div>
          `)}

          ${this._card('Quiz Drapeaux – Niveau 1 (CSS actuel)', `
            <span class="fi fi-${code}" style="width:160px;height:107px;background-size:cover;border-radius:8px;display:inline-block;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">160×107 cover (3/2 forcé)</div>
          `)}

          ${this._card('Quiz Drapeaux – Option (72×48)', `
            <span class="fi fi-${code}" style="${flagStyle(72, 48)}"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">72×48 cover (3/2 forcé)</div>
          `)}

          ${this._card('Quiz Drapeaux – Option (contain)', `
            <span class="fi fi-${code}" style="${flagStyleContain(48)}"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">h=48px, aspect-ratio=${ratio}, contain</div>
          `)}

          ${this._card('Quiz Ultime / Cauchemar – Question', `
            <span class="fi fi-${code}" style="width:160px;height:107px;background-size:cover;border-radius:8px;display:inline-block;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">160×107 cover (actuel)</div>
          `)}

          ${this._card('Quiz Ultime / Cauchemar – Question (corrigé)', `
            <span class="fi fi-${code}" style="${flagStyleContain(107)}"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">h=107px, aspect-ratio=${ratio}, contain</div>
          `)}

          ${this._card('Quiz Cauchemar – Map prompt (72×48)', `
            <span class="fi fi-${code}" style="${flagStyle(72, 48)}"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">72×48 cover</div>
          `)}

          ${this._card('Carte – Tooltip (28×19)', `
            <span class="fi fi-${code}" style="${flagStyle(28, 19, 'border-radius:2px;')}"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">28×19 cover</div>
          `)}

          ${this._card('Liste Drapeaux – Card (80×53)', `
            <span class="fi fi-${code}" style="${flagStyle(80, 53)}"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">80×53 cover</div>
          `)}

          ${this._card('Carte – Panneau info (width:100%, h:70px)', `
            <div style="width:180px;background:var(--bg);padding:4px;border-radius:4px;">
              <span class="fi fi-${code}" style="width:100%;height:70px;background-size:contain;background-repeat:no-repeat;background-position:center;display:block;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.2);"></span>
            </div>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">100% × 70px contain</div>
          `)}

          ${this._card('Résultats – Mauvaise réponse (36×24)', `
            <span class="fi fi-${code}" style="${flagStyle(36, 24, 'border-radius:2px;')}"></span>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">36×24 cover</div>
          `)}

        </div>
      </div>
    `;
  },

  _card(label, content) {
    return `
      <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:1rem;display:flex;flex-direction:column;align-items:center;gap:0.5rem;text-align:center;">
        <div style="font-size:0.75rem;font-weight:600;color:var(--text-secondary);margin-bottom:0.25rem;">${label}</div>
        ${content}
      </div>
    `;
  }
};
