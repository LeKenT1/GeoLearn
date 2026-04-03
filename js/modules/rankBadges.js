window.GL = window.GL || {};

GL.RankBadges = {

  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },

  RANKS: [
    { name: 'Bronze',  key: 'bronze',  min: 0,   color: '#cd7f32', desc: 'Les premiers pas' },
    { name: 'Argent',  key: 'silver',  min: 50,  color: '#a8a9ad', desc: 'En progression' },
    { name: 'Or',      key: 'gold',    min: 150, color: '#ffd700', desc: 'Confirmé' },
    { name: 'Platine', key: 'platine', min: 300, color: '#90b8e8', desc: 'Expert brillant' },
    { name: 'Diamant', key: 'diamond', min: 500, color: '#88eeff', desc: 'Maître absolu' },
    { name: 'Légende', key: 'legend',  min: 800, color: '#ff9f43', desc: 'Rang ultime' },
  ],

  SPARKS: {
    platine: [
      { top: '0%',  left: '78%', size: 5, dur: 2.4, delay: 0.0,  color: '#aac8ff' },
      { top: '10%', left: '4%',  size: 4, dur: 2.1, delay: 0.8,  color: '#88aaff' },
      { top: '80%', left: '8%',  size: 5, dur: 2.6, delay: 1.3,  color: '#aac8ff' },
      { top: '78%', left: '80%', size: 4, dur: 2.2, delay: 0.4,  color: '#c8d8ff' },
      { top: '42%', left: '96%', size: 6, dur: 2.8, delay: 1.6,  color: '#88aaff' },
      { top: '42%', left: '-8%', size: 4, dur: 2.3, delay: 1.0,  color: '#c0d4ff' },
      { top: '28%', left: '88%', size: 3, dur: 2.0, delay: 0.5,  color: '#ddeeff' },
    ],
    diamond: [
      { top: '2%',  left: '82%', size: 6, dur: 2.1, delay: 0.0,  color: '#88eeff' },
      { top: '12%', left: '2%',  size: 5, dur: 1.8, delay: 0.55, color: '#b0f4ff' },
      { top: '82%', left: '12%', size: 6, dur: 2.3, delay: 0.9,  color: '#88eeff' },
      { top: '80%', left: '82%', size: 5, dur: 1.9, delay: 0.3,  color: '#cc88ff' },
      { top: '44%', left: '98%', size: 7, dur: 2.5, delay: 1.2,  color: '#88eeff' },
      { top: '44%', left: '-10%',size: 5, dur: 2.0, delay: 0.7,  color: '#b0f4ff' },
      { top: '22%', left: '88%', size: 4, dur: 1.7, delay: 1.5,  color: '#dd99ff' },
      { top: '68%', left: '86%', size: 4, dur: 2.2, delay: 0.2,  color: '#88eeff' },
      { top: '18%', left: '14%', size: 3, dur: 1.9, delay: 1.0,  color: '#aaddff' },
    ],
    legend: [
      { top: '0%',  left: '78%', size: 6, dur: 2.0, delay: 0.0,  color: '#ffd700' },
      { top: '8%',  left: '8%',  size: 5, dur: 1.7, delay: 0.4,  color: '#ff9f43' },
      { top: '82%', left: '14%', size: 6, dur: 2.2, delay: 0.8,  color: '#ffd700' },
      { top: '80%', left: '84%', size: 5, dur: 1.9, delay: 0.2,  color: '#ffbb55' },
      { top: '44%', left: '98%', size: 7, dur: 2.4, delay: 1.1,  color: '#ff9f43' },
      { top: '44%', left: '-10%',size: 5, dur: 2.1, delay: 0.6,  color: '#ffd700' },
      { top: '26%', left: '92%', size: 4, dur: 1.8, delay: 1.5,  color: '#ffdd88' },
    ],
  },

  _uid: 0,

  // ─── Shared helpers ────────────────────────────────────────────────────────

  /**
   * Generates a regular polygon path centered at (cx, cy) with n sides,
   * outer radius r, starting angle a0 (radians).
   */
  _poly(cx, cy, n, r, a0 = -Math.PI / 2) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = a0 + (2 * Math.PI * i) / n;
      const x = (cx + r * Math.cos(a)).toFixed(2);
      const y = (cy + r * Math.sin(a)).toFixed(2);
      d += (i === 0 ? 'M' : 'L') + x + ' ' + y + ' ';
    }
    return d + 'Z';
  },

  /**
   * Generates a star path (n outer points, inner radius ri, outer radius ro).
   */
  _star(cx, cy, n, ro, ri, a0 = -Math.PI / 2) {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 === 0 ? ro : ri;
      const a = a0 + (Math.PI * i) / n;
      const x = (cx + r * Math.cos(a)).toFixed(2);
      const y = (cy + r * Math.sin(a)).toFixed(2);
      d += (i === 0 ? 'M' : 'L') + x + ' ' + y + ' ';
    }
    return d + 'Z';
  },

  /**
   * Generates a sunburst / gear outline (alternating outer/inner radius).
   * Used as the toothed ring around the hexagon.
   */
  _sunburst(cx, cy, n, ro, ri, a0 = -Math.PI / 2) {
    return this._star(cx, cy, n, ro, ri, a0);
  },

  // ─── Wing path (left or right) for Platine+ ───────────────────────────────
  // 4-feather stylized wing centered vertically at cy, extending outward from x0.
  _wingPath(side, cx, cy) {
    // side: 'L' goes left from cx, 'R' goes right from cx
    const dir = side === 'L' ? -1 : 1;
    const ox = cx + dir * 0;
    // Each feather: a sweep outward
    const f1x = cx + dir * 28, f1y = cy - 14;
    const f2x = cx + dir * 36, f2y = cy - 4;
    const f3x = cx + dir * 36, f3y = cy + 8;
    const f4x = cx + dir * 24, f4y = cy + 20;
    const base = `M ${ox} ${cy - 10}`;
    // Feather curves going out then looping back
    return `${base}
      C ${cx + dir*14} ${cy-22}, ${f1x+dir*4} ${f1y-8}, ${f1x} ${f1y}
      C ${f1x+dir*8} ${f1y+4}, ${f2x} ${f2y-8}, ${f2x} ${f2y}
      C ${f2x+dir*4} ${f2y+8}, ${f3x} ${f3y-6}, ${f3x} ${f3y}
      C ${f3x+dir*4} ${f3y+8}, ${f4x+dir*10} ${f4y-4}, ${f4x} ${f4y}
      C ${cx+dir*20} ${cy+26}, ${ox} ${cy+16}, ${ox} ${cy+10}
      C ${cx+dir*10} ${cy+6}, ${cx+dir*18} ${cy+2}, ${cx+dir*16} ${cy-2}
      C ${cx+dir*20} ${cy-6}, ${cx+dir*14} ${cy-10}, ${ox} ${cy-10} Z`;
  },

  // ─── Earth globe icon ────────────────────────────────────────────────────────

  _earthDefs(_u) { return ''; },

  /**
   * Earth icon: nested <svg> with its own viewBox so it renders exactly like
   * embedding a standalone icon — no transforms, no clipPath math needed.
   * Land paths = Twemoji 🌍 (twitter/twemoji, CC-BY 4.0), viewBox 0 0 36 36.
   */
  _earthIcon(_u) {
    return `
    <svg x="32" y="32" width="36" height="36" viewBox="0 0 36 36" overflow="hidden">
      <circle fill="#88C9F9" cx="18" cy="18" r="18"/>
      <path fill="#5C913B" d="M25.716 1.756c-1.022.568-1.872 1.528-3.028 1.181-1.875-.562-4.375-1.812-6-.25s-2 3 0 2.938 3.375-2.438 4.375-1.438.749 1.813-1.625 2.125S14.5 7 13.125 7s-1.688.812-.75 1.688-.563.937-2.125 1.812.375 1.25 1.688 2 2.312-.188 2.875-1.438 2.981-2.75 3.99-2.562c1.01.188 1.01.688.822 1.562s.75.625.812-.375 1.188-1.75 2.062-1.812 1.625 1.188.625 1.812-2 1.125-.75 1.438 2.125 1.938.688 2.625-3.937 1.125-5.062.562-3.688-1.375-4.375-.938-1.062.89-1.875 1.195c-.812.305-4.125 1.805-4.188 3.743S7.438 22.438 8.75 22.5s4.5-.812 5.5-1.625 2.375-.625 2.812.312.125 1.5-.312 3 .286 2.25.987 3.562c.701 1.312 1.263 2.062 1.263 3s1 1.875 2.5.312 2.875-4.625 3.5-5.75 1.125-3.625 1.875-4.125 1.938-1.688 1.062-1.5-2.625-.062-3.062-1.312-2.312-3.625-1.438-3.875 1.875 1.39 2.25 2.164c.375.774.875 1.711 1.625 1.961s2.375-1.673 2.875-1.961c.5-.289.125-1.476-.875-1.351s-2.312 0-2.312-.624 1.25-1.438 2.25-1.25 1.75.5 2.375 1.25 1.875 2.125 2.375 3 .875 1 1.125-.562c.166-1.038.387-1.609.59-2.222-1.013-5.829-4.82-10.683-9.999-13.148z"/>
    </svg>`;
  },

  // ─── Individual SVG generators ─────────────────────────────────────────────

  /**
   * Bronze — hexagone dentelé (12 dents), anneau gravé, planète Terre.
   * Teinte cuivre chaude.
   */
  _svgBronze(u) {
    const C = 50, R = 38;
    const hex      = this._poly(C, C, 6, R);
    const ring     = this._sunburst(C, C, 12, R - 1, R - 7);
    const innerHex = this._poly(C, C, 6, R - 8);
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="br${u}a" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#f5c87a"/>
      <stop offset="50%"  stop-color="#b8701e"/>
      <stop offset="100%" stop-color="#6e3808"/>
    </linearGradient>
    <linearGradient id="br${u}b" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#e8a84a"/>
      <stop offset="100%" stop-color="#9a5010"/>
    </linearGradient>
    <radialGradient id="br${u}s" cx="36%" cy="28%" r="42%">
      <stop offset="0%"   stop-color="rgba(255,240,200,0.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    ${this._earthDefs(u)}
  </defs>
  <!-- Outer toothed ring -->
  <path d="${ring}" fill="url(#br${u}b)"/>
  <!-- Hex body -->
  <path d="${hex}"  fill="url(#br${u}a)"/>
  <!-- Inner engraved ring -->
  <path d="${innerHex}" stroke="rgba(255,200,100,0.4)" stroke-width="1.5" fill="none"/>
  <!-- Earth -->
  ${this._earthIcon(u)}
  <!-- Shine overlay -->
  <path d="${hex}" fill="url(#br${u}s)"/>
</svg>`;
  },

  /**
   * Argent — même base, 14 dents, teinte acier froide.
   */
  _svgSilver(u) {
    const C = 50, R = 38;
    const hex      = this._poly(C, C, 6, R);
    const ring     = this._sunburst(C, C, 14, R - 1, R - 7);
    const innerHex = this._poly(C, C, 6, R - 8);
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sl${u}a" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#f0f0f4"/>
      <stop offset="50%"  stop-color="#9a9ba2"/>
      <stop offset="100%" stop-color="#50515a"/>
    </linearGradient>
    <linearGradient id="sl${u}b" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#d8d9e0"/>
      <stop offset="100%" stop-color="#6a6b74"/>
    </linearGradient>
    <radialGradient id="sl${u}s" cx="36%" cy="28%" r="42%">
      <stop offset="0%"   stop-color="rgba(255,255,255,0.65)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    ${this._earthDefs(u)}
  </defs>
  <path d="${ring}" fill="url(#sl${u}b)"/>
  <path d="${hex}"  fill="url(#sl${u}a)"/>
  <path d="${innerHex}" stroke="rgba(220,222,240,0.5)" stroke-width="1.5" fill="none"/>
  ${this._earthIcon(u)}
  <path d="${hex}"  fill="url(#sl${u}s)"/>
</svg>`;
  },

  /**
   * Or — 16 dents serrées, planète Terre plus grande, doré vif.
   */
  _svgGold(u) {
    const C = 50, R = 38;
    const hex      = this._poly(C, C, 6, R);
    const ring     = this._sunburst(C, C, 16, R - 1, R - 6);
    const innerHex = this._poly(C, C, 6, R - 7);
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="go${u}a" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#fffce0"/>
      <stop offset="45%"  stop-color="#ffd700"/>
      <stop offset="100%" stop-color="#a06800"/>
    </linearGradient>
    <linearGradient id="go${u}b" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#ffe45a"/>
      <stop offset="100%" stop-color="#c07800"/>
    </linearGradient>
    <radialGradient id="go${u}s" cx="36%" cy="26%" r="44%">
      <stop offset="0%"   stop-color="rgba(255,255,220,0.65)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    ${this._earthDefs(u)}
  </defs>
  <path d="${ring}" fill="url(#go${u}b)"/>
  <path d="${hex}"  fill="url(#go${u}a)"/>
  <path d="${innerHex}" stroke="rgba(255,240,100,0.45)" stroke-width="1.5" fill="none"/>
  ${this._earthIcon(u)}
  <path d="${hex}"  fill="url(#go${u}s)"/>
</svg>`;
  },

  /**
   * Platine — hexagone à 18 dents + petites AILES argentées.
   * Dégradé blanc-argent avec reflet arc-en-ciel via CSS hue-rotate.
   */
  _svgPlatine(u) {
    const C = 50, R = 35;
    const hex      = this._poly(C, C, 6, R);
    const ring     = this._sunburst(C, C, 18, R - 1, R - 6);
    const innerHex = this._poly(C, C, 6, R - 7);
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pl${u}a" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#ddeeff"/>
      <stop offset="40%"  stop-color="#88aad8"/>
      <stop offset="100%" stop-color="#3d5888"/>
    </linearGradient>
    <linearGradient id="pl${u}b" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#c8d8f4"/>
      <stop offset="100%" stop-color="#4d70b8"/>
    </linearGradient>
    <!-- Iridescent tint — CSS hue-rotate amplifies the rainbow sweep -->
    <linearGradient id="pl${u}i" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="rgba(220,140,255,0.44)"/>
      <stop offset="25%"  stop-color="rgba(100,200,255,0.38)"/>
      <stop offset="50%"  stop-color="rgba(120,255,200,0.34)"/>
      <stop offset="75%"  stop-color="rgba(255,220,100,0.38)"/>
      <stop offset="100%" stop-color="rgba(255,100,200,0.40)"/>
    </linearGradient>
    <!-- Primary shine top-left -->
    <radialGradient id="pl${u}s" cx="34%" cy="26%" r="44%">
      <stop offset="0%"   stop-color="rgba(255,255,255,0.78)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <!-- Secondary reflection bottom-right -->
    <radialGradient id="pl${u}s2" cx="70%" cy="72%" r="28%">
      <stop offset="0%"   stop-color="rgba(180,220,255,0.42)"/>
      <stop offset="100%" stop-color="rgba(180,220,255,0)"/>
    </radialGradient>
    ${this._earthDefs(u)}
  </defs>
  <!-- Outer toothed ring -->
  <path d="${ring}" fill="url(#pl${u}b)"/>
  <!-- Hex body -->
  <path d="${hex}"  fill="url(#pl${u}a)"/>
  <!-- Iridescent overlay -->
  <path d="${hex}"  fill="url(#pl${u}i)"/>
  <path d="${innerHex}" stroke="rgba(180,210,255,0.65)" stroke-width="1.5" fill="none"/>
  <!-- Facet highlight lines on outer ring area -->
  <line x1="32" y1="40" x2="50" y2="16" stroke="rgba(255,255,255,0.22)" stroke-width="0.9"/>
  <line x1="68" y1="40" x2="50" y2="16" stroke="rgba(255,255,255,0.22)" stroke-width="0.9"/>
  <line x1="20" y1="50" x2="32" y2="40" stroke="rgba(255,255,255,0.18)" stroke-width="0.9"/>
  <line x1="80" y1="50" x2="68" y2="40" stroke="rgba(255,255,255,0.18)" stroke-width="0.9"/>
  ${this._earthIcon(u)}
  <!-- Primary shine -->
  <path d="${hex}"  fill="url(#pl${u}s)"/>
  <!-- Secondary reflection -->
  <path d="${hex}"  fill="url(#pl${u}s2)"/>
</svg>`;
  },

  /**
   * Diamant — cristal taillé (8 branches) à la place de l'hexagone,
   * anneau d'éclats, Terre, cyan profond. + AILES plus détaillées.
   */
  _svgDiamond(u) {
    const C = 50, R = 35;
    const body      = this._poly(C, C, 8, R, -Math.PI / 8);
    const ring      = this._sunburst(C, C, 16, R - 1, R - 6, -Math.PI / 8);
    const innerBody = this._poly(C, C, 8, R - 7, -Math.PI / 8);
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="di${u}a" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#e0faff"/>
      <stop offset="45%"  stop-color="#88eeff"/>
      <stop offset="100%" stop-color="#005880"/>
    </linearGradient>
    <linearGradient id="di${u}b" x1="20%" y1="5%" x2="80%" y2="95%">
      <stop offset="0%"   stop-color="#a0f0ff"/>
      <stop offset="100%" stop-color="#006898"/>
    </linearGradient>
    <!-- Strong prismatic rainbow — CSS hue-rotate makes it shift continuously -->
    <linearGradient id="di${u}i" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="rgba(255,80,200,0.42)"/>
      <stop offset="20%"  stop-color="rgba(80,160,255,0.40)"/>
      <stop offset="40%"  stop-color="rgba(80,255,180,0.36)"/>
      <stop offset="60%"  stop-color="rgba(255,240,80,0.38)"/>
      <stop offset="80%"  stop-color="rgba(200,80,255,0.40)"/>
      <stop offset="100%" stop-color="rgba(80,240,255,0.42)"/>
    </linearGradient>
    <!-- Primary shine top-left -->
    <radialGradient id="di${u}s" cx="34%" cy="24%" r="46%">
      <stop offset="0%"   stop-color="rgba(220,252,255,0.78)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <!-- Secondary reflection bottom-right -->
    <radialGradient id="di${u}s2" cx="68%" cy="72%" r="30%">
      <stop offset="0%"   stop-color="rgba(160,240,255,0.45)"/>
      <stop offset="100%" stop-color="rgba(160,240,255,0)"/>
    </radialGradient>
    ${this._earthDefs(u)}
  </defs>
  <!-- Outer ring -->
  <path d="${ring}" fill="url(#di${u}b)"/>
  <!-- Body -->
  <path d="${body}" fill="url(#di${u}a)"/>
  <!-- Prismatic rainbow overlay -->
  <path d="${body}" fill="url(#di${u}i)"/>
  <path d="${innerBody}" stroke="rgba(160,246,255,0.6)" stroke-width="1.5" fill="none"/>
  ${this._earthIcon(u)}
  <!-- Primary shine -->
  <path d="${body}" fill="url(#di${u}s)"/>
  <!-- Secondary reflection -->
  <path d="${body}" fill="url(#di${u}s2)"/>
  <!-- Sparkle stars at cardinal tips of the badge -->
  <path d="M50,8.5 L51,11 L53.5,12 L51,13 L50,15.5 L49,13 L46.5,12 L49,11 Z" fill="rgba(255,255,255,0.95)"/>
  <path d="M88,46.5 L89,49 L91.5,50 L89,51 L88,53.5 L87,51 L84.5,50 L87,49 Z" fill="rgba(255,255,255,0.88)"/>
  <path d="M50,84.5 L51,87 L53.5,88 L51,89 L50,91.5 L49,89 L46.5,88 L49,87 Z" fill="rgba(255,255,255,0.80)"/>
  <path d="M12,46.5 L13,49 L15.5,50 L13,51 L12,53.5 L11,51 L8.5,50 L11,49 Z"  fill="rgba(255,255,255,0.75)"/>
  <!-- Tiny accent sparkles at diagonal tips -->
  <path d="M76,21 L76.6,22.8 L78.4,23.4 L76.6,24 L76,25.8 L75.4,24 L73.6,23.4 L75.4,22.8 Z" fill="rgba(200,240,255,0.85)"/>
  <path d="M24,74 L24.6,75.8 L26.4,76.4 L24.6,77 L24,78.8 L23.4,77 L21.6,76.4 L23.4,75.8 Z" fill="rgba(200,240,255,0.70)"/>
</svg>`;
  },

  /**
   * Légende — 12 pointes acérées (comme une étoile à spikes), grandes AILES,
   * Terre lumineuse au centre.
   * Dégradé violet→or→rose irisé.
   */
  _svgLegend(u) {
    const C = 50, R = 35;
    // Spike body — star with many points
    const body = this._star(C, C, 12, R, R - 10);
    const ring = this._sunburst(C, C, 12, R + 2, R - 2);
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg${u}a" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%"   stop-color="#ff88ff"/>
      <stop offset="30%"  stop-color="#dd66ff"/>
      <stop offset="60%"  stop-color="#ff9f43"/>
      <stop offset="100%" stop-color="#ff4488"/>
    </linearGradient>
    <linearGradient id="lg${u}b" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%"   stop-color="#cc55ee"/>
      <stop offset="50%"  stop-color="#ff8833"/>
      <stop offset="100%" stop-color="#ee3380"/>
    </linearGradient>
    <radialGradient id="lg${u}s" cx="34%" cy="24%" r="46%">
      <stop offset="0%"   stop-color="rgba(255,240,255,0.62)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    ${this._earthDefs(u)}
  </defs>
  <!-- Outer spike ring -->
  <path d="${ring}" fill="url(#lg${u}b)"/>
  <!-- Spike body -->
  <path d="${body}" fill="url(#lg${u}a)"/>
  ${this._earthIcon(u)}
  <!-- Shine -->
  <path d="${body}" fill="url(#lg${u}s)"/>
</svg>`;
  },

  // ─── SVG frame without Earth (for avatar overlay in profile) ──────────────────

  svgFrameOnly(rankKey) {
    const u = ++this._uid;
    const origEarth = this._earthIcon;
    this._earthIcon = () => '';
    const svgFnMap = {
      bronze: '_svgBronze', silver: '_svgSilver', gold: '_svgGold',
      platine: '_svgPlatine', diamond: '_svgDiamond', legend: '_svgLegend',
    };
    const svg = this[svgFnMap[rankKey] || '_svgBronze'](u);
    this._earthIcon = origEarth;
    return svg;
  },

  // ─── Badge HTML builder ──────────────────────────────────────────────────────

  badgeHtml(rank, { size = 110, showDesc = false, showXP = true } = {}) {
    const u = ++this._uid;
    const svgFnMap = {
      bronze: '_svgBronze', silver: '_svgSilver', gold: '_svgGold',
      platine: '_svgPlatine', diamond: '_svgDiamond', legend: '_svgLegend',
    };
    const svgHtml = this[svgFnMap[rank.key]](u);

    const sparks = (this.SPARKS[rank.key] || []).map(s =>
      `<span class="rb-spark" style="top:${s.top};left:${s.left};width:${s.size}px;height:${s.size}px;background:${s.color};--dur:${s.dur}s;--delay:${s.delay}s;box-shadow:0 0 ${s.size * 2}px ${s.color};"></span>`
    ).join('');

    return `
      <div class="rb-wrap rb-${rank.key}" style="--rb-size:${size}px;">
        <div class="rb-medal-wrap">
          ${sparks ? `<div class="rb-sparks-wrap">${sparks}</div>` : ''}
          <div class="rb-medal">${svgHtml}</div>
        </div>
        <div class="rb-name">${rank.name}</div>
        ${showXP  ? `<div class="rb-xp-req">${rank.key === 'legend' ? '591 découvertes' : (rank.min === 0 ? 'Départ · 0 Pts' : rank.min + ' Pts')}</div>` : ''}
        ${showDesc ? `<div class="rb-desc">${rank.desc}</div>` : ''}
      </div>`;
  },

  // ─── Level-Up Overlay ───────────────────────────────────────────────────────

  _triggerLevelUp(rank) {
    document.querySelector('.lu-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'lu-overlay';

    // Flash burst
    const flash = document.createElement('div');
    flash.className = 'lu-flash';
    overlay.appendChild(flash);

    // Radial lines burst
    const linesWrap = document.createElement('div');
    linesWrap.className = 'lu-lines-wrap';
    const lineCount = 16;
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * 360;
      const len = 120 + Math.random() * 180;
      const l = document.createElement('div');
      l.className = 'lu-line';
      l.style.cssText = `
        transform: translate(-50%, -50%) rotate(${angle}deg);
        background: ${rank.color};
        box-shadow: 0 0 6px ${rank.color};
        --len: ${len}px;
        --dur: ${0.4 + Math.random() * 0.35}s;
        --delay: ${0.1 + Math.random() * 0.2}s;
      `;
      linesWrap.appendChild(l);
    }
    overlay.appendChild(linesWrap);

    // Badge
    const badgeWrap = document.createElement('div');
    badgeWrap.className = 'lu-badge-wrap';
    badgeWrap.innerHTML = this.badgeHtml(rank, { size: 160, showDesc: false, showXP: false });
    overlay.appendChild(badgeWrap);

    // Title
    const title = document.createElement('div');
    title.className = 'lu-title';
    title.style.textShadow = `0 0 40px ${rank.color}, 0 0 80px ${rank.color}88`;
    title.textContent = this._t('ranks.levelup');
    overlay.appendChild(title);

    // Rank name
    const rankName = document.createElement('div');
    rankName.className = 'lu-rank-name';
    rankName.style.color = rank.color;
    rankName.style.textShadow = `0 0 20px ${rank.color}`;
    rankName.textContent = rank.name;
    overlay.appendChild(rankName);

    // Particles
    const colors = [rank.color, '#ffffff', '#ffffa0'];
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 260;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const size = 3 + Math.random() * 7;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const p = document.createElement('div');
      p.className = 'lu-particle';
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        --tx: ${tx}px; --ty: ${ty}px;
        --dur: ${0.55 + Math.random() * 0.7}s;
        --delay: ${Math.random() * 0.25}s;
      `;
      overlay.appendChild(p);
    }

    // Dismiss hint
    const dismiss = document.createElement('div');
    dismiss.className = 'lu-dismiss';
    dismiss.textContent = this._t('ranks.dismiss');
    overlay.appendChild(dismiss);

    document.body.appendChild(overlay);

    // Fanfare trompette via GL.Audio
    try { GL.Audio && GL.Audio.playLevelUp && GL.Audio.playLevelUp(); } catch(e) {}

    overlay.addEventListener('click', () => this._dismissLevelUp(overlay), { once: true });
    setTimeout(() => this._dismissLevelUp(overlay), 4000);
  },

  _dismissLevelUp(overlay) {
    if (!overlay || !overlay.isConnected) return;
    overlay.classList.add('leaving');
    overlay.style.pointerEvents = 'none';
    setTimeout(() => overlay.remove(), 500);
  },

  // ─── Test / showcase page ────────────────────────────────────────────────────

  render(container) {
    const ranks = this.RANKS;
    const stats = GL.UI ? GL.UI.getStats() : {};
    const currentXP = stats.rankedXP || 0;
    const discoveredCount = GL.UI ? GL.UI.computeDiscovered(stats) : 0;
    const totalUnique = GL.UI ? GL.UI.TOTAL_UNIQUE : 591;
    const currentTierName = GL.UI ? GL.UI.getRankInfo(currentXP).tier.name : 'Bronze';
    const isLegend = currentTierName === 'Légende' || currentTierName === 'Legend';

    container.innerHTML = `
      <div class="page">
        <div class="page-title">🏆 ${this._t('ranks.title')}</div>
        <p class="page-subtitle">${this._t('ranks.subtitle')}</p>

        <div class="rb-test-grid">
          ${ranks.map(r => {
            const isLegendCard = r.key === 'legend';
            const unlocked = isLegendCard ? (discoveredCount >= totalUnique) : (r.min <= currentXP);
            const isCurrent = r.name === currentTierName;
            let statusHtml;
            if (isCurrent) {
              statusHtml = `<span class="rb-current-label" style="background:${r.color};">${this._t('ranks.your_rank')}</span>`;
            } else if (isLegendCard) {
              statusHtml = `<span style="font-size:0.65rem;color:var(--text-muted);">🔍 ${discoveredCount}/${totalUnique} découvertes</span>`;
            } else if (!unlocked) {
              statusHtml = `<span style="font-size:0.65rem;color:var(--text-muted);">🔒 ${this._t('ranks.pts_missing').replace('{n}', r.min - currentXP)}</span>`;
            } else {
              statusHtml = `<span style="font-size:0.65rem;color:var(--success);">${this._t('ranks.unlocked')}</span>`;
            }
            return `
            <div class="rb-test-card" style="${unlocked ? `border-color:${r.color}66;` : ''}">
              ${this.badgeHtml(r, { size: 110, showDesc: true, showXP: true })}
              ${statusHtml}
            </div>`;
          }).join('')}
        </div>

        <div class="rb-simulator">
          <h3>${this._t('ranks.sim.title')}</h3>
          <p style="color:var(--text-muted);font-size:0.82rem;">${this._t('ranks.sim.desc')}</p>
          <input type="range" class="rb-sim-slider" id="xpSlider"
                 min="0" max="1000" value="${Math.min(currentXP, 1000)}" step="1">
          <div class="rb-sim-display" id="rbSimDisplay"></div>
        </div>
      </div>`;

    this._setupSimulator(container);
  },

  _setupSimulator(container) {
    const slider  = container.querySelector('#xpSlider');
    const display = container.querySelector('#rbSimDisplay');
    if (!slider || !display) return;

    // Initialize prevTierIndex from the slider's starting value (no animation on load)
    let prevTierIndex = (() => {
      const xp = parseInt(slider.value, 10);
      const info = GL.UI ? GL.UI.getRankInfo(xp, 0) : { tier: this.RANKS[0] };
      return this.RANKS.findIndex(r => r.name === info.tier.name);
    })();

    const update = () => {
      const xp   = parseInt(slider.value, 10);
      const info = GL.UI ? GL.UI.getRankInfo(xp, 0) : { tier: this.RANKS[0], next: this.RANKS[1] };
      const rank = this.RANKS.find(r => r.name === info.tier.name) || this.RANKS[0];
      const tierIndex = this.RANKS.indexOf(rank);

      // Trigger level-up animation when crossing a tier boundary upward
      if (tierIndex > prevTierIndex) {
        this._triggerLevelUp(rank);
      }
      prevTierIndex = tierIndex;

      const nextHtml = info.next
        ? `<div style="color:var(--text-muted);font-size:0.8rem;margin-top:0.35rem;">${info.next.min - xp} ${this._t('ranks.pts_until')} <strong style="color:${info.next.color};">${info.next.name}</strong></div>`
        : `<div style="color:#ff9f43;font-size:0.85rem;font-weight:700;margin-top:0.35rem;">${this._t('ranks.max')}</div>`;

      let barHtml = '';
      if (info.next) {
        const pct = Math.round((xp - info.tier.min) / (info.next.min - info.tier.min) * 100);
        barHtml = `
          <div style="width:160px;margin-top:0.5rem;">
            <div style="height:6px;background:var(--bg-surface);border-radius:99px;overflow:hidden;">
              <div style="height:100%;width:${pct}%;background:${rank.color};border-radius:99px;transition:width 0.15s;"></div>
            </div>
            <div style="font-size:0.65rem;color:var(--text-muted);margin-top:0.25rem;text-align:center;">${pct}% ${this._t('ranks.pts_until')} ${info.next.name} (${info.next.min} Pts)</div>
          </div>`;
      }

      display.innerHTML = `
        ${this.badgeHtml(rank, { size: 82, showDesc: false, showXP: false })}
        <div style="text-align:left;">
          <div class="rb-sim-xp">${xp} <span style="font-size:1rem;font-weight:500;color:var(--text-muted);">Pts</span></div>
          ${nextHtml}
          ${barHtml}
        </div>`;
    };

    slider.addEventListener('input', update);
    update();
  },
};
