window.GL = window.GL || {};

GL.Debug = {
  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },
  _n(country) { return GL.I18N ? GL.I18N.name(country) : country.nameFr; },
  _cap(country) { return GL.I18N ? GL.I18N.capital(country) : country.capitalFr; },

  render(container) {
    const countries = GL.COUNTRIES || [];

    container.innerHTML = `
      <div class="page">
        <h2 style="margin-bottom:1.5rem">🔧 Debug — Test réponse capitale</h2>

        <div class="quiz-config-card" style="max-width:520px;margin:0 auto;">

          <!-- Recherche pays -->
          <div style="margin-bottom:1.25rem;">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:0.4rem;color:var(--text-secondary)">Pays</label>
            <input
              id="dbgCountryInput"
              type="text"
              list="dbgCountryList"
              placeholder="Tapez un pays…"
              autocomplete="off"
              style="width:100%;padding:0.6rem 0.8rem;border:1.5px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:1rem;outline:none;"
            >
            <datalist id="dbgCountryList">
              ${countries.map(c => `<option value="${c.nameFr}" data-code="${c.code}">${c.nameFr} / ${c.name}</option>`).join('')}
            </datalist>
          </div>

          <!-- Infos pays -->
          <div id="dbgCountryInfo" style="display:none;margin-bottom:1.25rem;padding:0.9rem 1rem;background:var(--bg);border-radius:8px;border:1.5px solid var(--border);font-size:0.9rem;line-height:1.8;">
          </div>

          <!-- Test réponse -->
          <div id="dbgTestSection" style="display:none;">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:0.4rem;color:var(--text-secondary)">Tester une réponse</label>
            <div style="display:flex;gap:0.5rem;">
              <input
                id="dbgAnswerInput"
                type="text"
                placeholder="Entrez votre réponse…"
                autocomplete="off"
                style="flex:1;padding:0.6rem 0.8rem;border:1.5px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text-primary);font-size:1rem;outline:none;"
              >
              <button id="dbgTestBtn" class="btn btn-primary">Tester</button>
            </div>
            <div id="dbgResult" style="margin-top:0.75rem;font-size:1rem;font-weight:600;min-height:1.5rem;"></div>

            <!-- Normalisation en direct -->
            <div id="dbgNormInfo" style="margin-top:0.5rem;font-size:0.78rem;color:var(--text-secondary);font-family:monospace;"></div>
          </div>

        </div>
      </div>
    `;

    this._bindEvents(countries);
  },

  _findCountry(countries, input) {
    const q = input.trim().toLowerCase();
    return countries.find(c =>
      c.nameFr.toLowerCase() === q ||
      c.name.toLowerCase() === q ||
      (c.aliases || []).some(a => a.toLowerCase() === q)
    );
  },

  _showCountry(country) {
    const info = document.getElementById('dbgCountryInfo');
    const testSection = document.getElementById('dbgTestSection');
    if (!info || !testSection) return;

    const aliases = country.capitalAliases || [];
    const altSpelling = country.capital !== country.capitalFr ? country.capital : null;

    info.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;">
        <span class="fi fi-${country.code}" style="width:36px;height:24px;background-size:cover;border-radius:3px;display:inline-block;flex-shrink:0;"></span>
        <strong style="font-size:1.05rem;">${country.nameFr}</strong>
        <span style="color:var(--text-secondary);font-size:0.85rem;">(${country.name})</span>
      </div>
      <div><span style="color:var(--text-secondary)">capitalFr :</span> <strong>${country.capitalFr || '—'}</strong></div>
      ${altSpelling ? `<div><span style="color:var(--text-secondary)">capital (EN) :</span> <strong>${country.capital}</strong></div>` : ''}
      ${aliases.length ? `<div><span style="color:var(--text-secondary)">aliases :</span> ${aliases.map(a => `<code style="background:var(--bg);padding:1px 5px;border-radius:4px;font-size:0.85rem;">${a}</code>`).join(' ')}</div>` : ''}
    `;
    info.style.display = 'block';
    testSection.style.display = 'block';

    // Reset
    document.getElementById('dbgAnswerInput').value = '';
    document.getElementById('dbgResult').textContent = '';
    document.getElementById('dbgNormInfo').textContent = '';
    document.getElementById('dbgAnswerInput').style.borderColor = 'var(--border)';
  },

  _testAnswer(country) {
    const input = document.getElementById('dbgAnswerInput');
    const result = document.getElementById('dbgResult');
    const normInfo = document.getElementById('dbgNormInfo');
    if (!input || !result || !country) return;

    const val = input.value;
    const isCorrect = GL.UI.checkTextAnswer(
      val,
      country.capitalFr,
      country.capital,
      country.capitalAliases || []
    );

    result.textContent = isCorrect ? '✓ Correct !' : '✕ Incorrect';
    result.style.color = isCorrect ? 'var(--success)' : 'var(--error, #e53e3e)';
    input.style.borderColor = isCorrect ? 'var(--success)' : 'var(--error, #e53e3e)';

    const normInput = GL.UI.normalizeText(val);
    const normAnswer = GL.UI.normalizeText(country.capitalFr);
    normInfo.innerHTML = `
      input normalisé : <strong>${JSON.stringify(normInput)}</strong><br>
      réponse normalisée : <strong>${JSON.stringify(normAnswer)}</strong>
    `;
  },

  _bindEvents(countries) {
    let currentCountry = null;

    const countryInput = document.getElementById('dbgCountryInput');
    const answerInput = document.getElementById('dbgAnswerInput');
    const testBtn = document.getElementById('dbgTestBtn');

    const trySelect = () => {
      const found = this._findCountry(countries, countryInput.value);
      if (found) {
        currentCountry = found;
        this._showCountry(found);
      }
    };

    countryInput.addEventListener('input', trySelect);
    countryInput.addEventListener('change', trySelect);

    testBtn.addEventListener('click', () => this._testAnswer(currentCountry));
    answerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._testAnswer(currentCountry);
    });
    answerInput.addEventListener('input', () => {
      // Reset couleur si l'utilisateur retape
      answerInput.style.borderColor = 'var(--border)';
      document.getElementById('dbgResult').textContent = '';
      document.getElementById('dbgNormInfo').textContent = '';
    });
  }
};
