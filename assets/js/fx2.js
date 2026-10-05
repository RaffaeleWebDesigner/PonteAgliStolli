/* =====================================================================
   EFFETTI WOW 2 — ASD Ponte agli Stolli
   Si aggiunge a fx.js. Non modifica i dati.
   Per disattivare tutto togliere <script fx2.js> e <link fx2.css>.
   ===================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ===================================================================
     1. TEMA CHIARO / SCURO con apertura circolare dal pulsante
     =================================================================== */
  function initTheme() {
    const container = $('.site-header .container');
    if (!container) return;

    const isDark = () => root.getAttribute('data-theme') === 'dark';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fx-theme';
    btn.setAttribute('aria-label', 'Cambia tema chiaro o scuro');
    btn.setAttribute('aria-pressed', String(isDark()));
    btn.innerHTML = `
      <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7L7 17M17 7l1.7-1.7"/>
      </svg>
      <svg class="moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z"/>
      </svg>`;
    const toggle = $('.nav-toggle');
    if (toggle) toggle.before(btn); else container.appendChild(btn);

    const apply = dark => {
      if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
      try { localStorage.setItem('pas-theme', dark ? 'dark' : 'light'); } catch (e) { /* ok */ }
      btn.setAttribute('aria-pressed', String(dark));
    };

    btn.addEventListener('click', () => {
      const next = !isDark();
      if (!document.startViewTransition || RM) { apply(next); return; }
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      root.style.setProperty('--vt-x', x + 'px');
      root.style.setProperty('--vt-y', y + 'px');
      root.style.setProperty('--vt-r', Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 'px');
      root.classList.add('fx-theme-vt');
      const vt = document.startViewTransition(() => apply(next));
      const done = () => root.classList.remove('fx-theme-vt');
      vt.ready.catch(() => {});            // se il browser salta l'animazione non è un errore
      vt.finished.then(done, done);
    });
  }

  /* ===================================================================
     2. CAMBIO PAGINA A CERCHIO: salva il punto del click per la pagina nuova
     =================================================================== */
  function initWipeCapture() {
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      let u;
      try { u = new URL(a.href, location.href); } catch (_) { return; }
      if (u.origin !== location.origin || u.pathname === location.pathname) return;
      let x = e.clientX, y = e.clientY;
      if (!x && !y) { const r = a.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      try { sessionStorage.setItem('fx-vt', JSON.stringify({ x: Math.round(x), y: Math.round(y), r: Math.round(r), t: Date.now() })); } catch (_) { /* ok */ }
    }, true);
  }

  /* ===================================================================
     3. AURORA in WebGL dietro l'hero (shader scritto a mano, nessuna libreria)
     =================================================================== */
  const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
  const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform vec3 u_click;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0., a = .5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = m * p; a *= .5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res; float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * asp, uv.y), m = vec2(u_mouse.x * asp, u_mouse.y);
  float t = u_time * .05;
  vec2 q = vec2(fbm(p * 1.3 + vec2(0., t)), fbm(p * 1.3 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.5 + 2.5 * q + vec2(1.7, 9.2) + t * 1.2), fbm(p * 1.5 + 2.5 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.2 + 2.8 * r);
  f += .30 * exp(-distance(p, m) * 3.2);
  float age = u_time - u_click.z;
  vec2 c = vec2(u_click.x * asp, u_click.y);
  float ring = exp(-abs(distance(p, c) - age * .55) * 22.) * exp(-age * 1.6) * step(0., age);
  f += ring * .35;
  vec3 deep = vec3(.17, .035, .085), mar = vec3(.36, .09, .18), mar2 = vec3(.54, .16, .29), sky = vec3(.66, .83, .96);
  vec3 col = mix(deep, mar, smoothstep(.15, .6, f));
  col = mix(col, mar2, smoothstep(.35, .9, length(q)) * .85);
  col += sky * smoothstep(.8, 1.15, f) * .2;
  col += sky * ring * .28;
  col *= 1. - .42 * pow(length(uv - .5) * 1.15, 2.);
  gl_FragColor = vec4(col, 1.);
}`;

  function initAurora() {
    const hero = $('.hero');
    if (!hero || RM) return;
    const cv = document.createElement('canvas');
    cv.className = 'fx-gl';
    cv.setAttribute('aria-hidden', 'true');
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;

    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uClick = gl.getUniformLocation(prog, 'u_click');

    hero.prepend(cv);

    // si disegna a bassa risoluzione: è un gradiente morbido, il browser lo ingrandisce
    function resize() {
      const w = hero.clientWidth, h = hero.clientHeight;
      // massimo ~160.000 pixel da calcolare: leggero anche sui telefoni più deboli
      const k = clamp(Math.min(560 / Math.max(w, 1), Math.sqrt(160000 / Math.max(w * h, 1))), .25, 1);
      cv.width = Math.max(2, Math.round(w * k));
      cv.height = Math.max(2, Math.round(h * k));
      gl.viewport(0, 0, cv.width, cv.height);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const mouse = { x: .7, y: .6, tx: .7, ty: .6, active: false };
    let click = { x: 0, y: 0, t: -100 };
    const t0 = performance.now();
    let raf = 0, visible = true, last = 0;

    if (FINE) {
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        mouse.tx = (e.clientX - r.left) / r.width;
        mouse.ty = 1 - (e.clientY - r.top) / r.height;
        mouse.active = true;
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { mouse.active = false; });
    }
    hero.addEventListener('pointerdown', e => {
      const r = hero.getBoundingClientRect();
      click = { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height, t: (performance.now() - t0) / 1000 };
    }, { passive: true });

    function frame(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 30) return;               // ~30 fps: morbido ma leggero
      last = now;
      const t = (now - t0) / 1000;
      if (!mouse.active) {                        // senza mouse la luce vaga da sola
        mouse.tx = .5 + .32 * Math.sin(t * .35);
        mouse.ty = .55 + .22 * Math.cos(t * .27);
      }
      mouse.x = lerp(mouse.x, mouse.tx, .06);
      mouse.y = lerp(mouse.y, mouse.ty, .06);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform3f(uClick, click.x, click.y, click.t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      cv.classList.add('ready');
    }
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    document.addEventListener('visibilitychange', start);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; start(); }).observe(hero);
    }
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); visible = false; cv.remove(); });
    start();
  }

  /* ===================================================================
     4. CURSORE A PALLONE con anello che si "incolla" ai pulsanti
     =================================================================== */
  const BALL = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#fff" stroke="#4a1224" stroke-width="1.4"/>
      <polygon points="12,7.2 16.3,10.3 14.6,15.3 9.4,15.3 7.7,10.3" fill="#4a1224"/>
      <path d="M12 7.2V2.4M16.3 10.3l4.4-1.5M14.6 15.3l2.9 4M9.4 15.3l-2.9 4M7.7 10.3L3.3 8.8" stroke="#4a1224" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    </svg>`;

  function initCursor() {
    if (!FINE || RM) return;
    const dot = document.createElement('div');
    dot.className = 'fx-cursor';
    dot.innerHTML = `<div class="fx-ball">${BALL}</div>`;
    const ring = document.createElement('div');
    ring.className = 'fx-ring';
    ring.innerHTML = '<span class="fx-ring-label"></span>';
    document.body.append(ring, dot);
    root.classList.add('fx-cursor-on');

    const ball = $('.fx-ball svg', dot);
    const label = $('.fx-ring-label', ring);
    const SNAP = 'a, button, .tab-btn, .filter-btn, .nav-toggle, .fx-theme, .fx-top';
    const BIG = '.quick-link, .player-card, .staff-card, .sponsor-card, .result-row, .widget-card';
    const DARK = '.hero, .site-footer, .fx-ticker, #fx-intro, .cd-unit, thead';

    let mx = -100, my = -100, rx = -100, ry = -100, rot = 0, lx = -100, ly = -100;
    let snap = null, size = [38, 38], radius = 999, shown = false;

    const setSize = (w, h, r) => {
      if (size[0] === w && size[1] === h && radius === r) return;
      size = [w, h]; radius = r;
      ring.style.width = w + 'px'; ring.style.height = h + 'px'; ring.style.borderRadius = r + 'px';
    };

    function retarget(t) {
      snap = null;
      let hover = false, lab = '', dark = false;
      if (t && t.closest) {
        const labEl = t.closest('[data-cursor]');
        const s = t.closest(SNAP);
        const big = t.closest(BIG);
        dark = !!t.closest(DARK);
        lab = labEl ? labEl.getAttribute('data-cursor') : '';
        if (lab) {
          hover = true;
          setSize(Math.round(lab.length * 7.4 + 34), 34, 17);
        } else if (s) {
          const r = s.getBoundingClientRect();
          hover = true;
          if (r.width <= 340 && r.height <= 96) {
            snap = s;
            const br = parseFloat(getComputedStyle(s).borderRadius) || 12;
            setSize(Math.round(r.width + 14), Math.round(r.height + 10), Math.min(br + 5, 40));
          } else setSize(62, 62, 999);
        } else if (big) {
          hover = true; setSize(58, 58, 999);
        } else setSize(38, 38, 999);
      } else setSize(38, 38, 999);
      ring.classList.toggle('is-hover', hover);
      ring.classList.toggle('on-dark', dark);
      ring.classList.toggle('has-label', !!lab);
      dot.classList.toggle('is-hover', hover);
      label.textContent = lab;
    }

    let lastTarget = null;
    document.addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; rx = mx; ry = my; lx = mx; ly = my; dot.classList.add('on'); ring.classList.add('on'); }
      if (e.target !== lastTarget) { lastTarget = e.target; retarget(e.target); }
    }, { passive: true });
    document.addEventListener('pointerdown', () => { dot.classList.add('is-down'); ring.classList.add('is-down'); });
    document.addEventListener('pointerup', () => { dot.classList.remove('is-down'); ring.classList.remove('is-down'); });
    root.addEventListener('mouseleave', () => { dot.classList.remove('on'); ring.classList.remove('on'); shown = false; });
    window.addEventListener('scroll', () => { lastTarget = null; }, { passive: true });

    (function frame() {
      requestAnimationFrame(frame);
      let cx = mx, cy = my;
      if (snap) {
        if (!snap.isConnected) { snap = null; } else {
          const r = snap.getBoundingClientRect();
          cx = r.left + r.width / 2; cy = r.top + r.height / 2;
        }
      }
      rx = lerp(rx, cx, snap ? .28 : .2);
      ry = lerp(ry, cy, snap ? .28 : .2);
      rot += (mx - lx) * .9 + (my - ly) * .9;     // il pallone rotola in base al movimento
      lx = mx; ly = my;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      ball.style.transform = `rotate(${rot}deg)`;
    })();
  }

  /* ===================================================================
     5. CORIANDOLI e scritte (click sullo stemma, apertura di una vittoria)
     =================================================================== */
  function initConfetti() {
    const cv = document.createElement('canvas');
    cv.className = 'fx-confetti';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, parts = [], raf = 0;
    const COLORS = ['#6d1b34', '#8f2a48', '#c24668', '#a9d4f5', '#7fb8e8', '#ffffff', '#e8c9d3'];

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener('resize', size, { passive: true });

    function loop() {
      raf = 0;
      ctx.clearRect(0, 0, W, H);
      parts = parts.filter(p => p.life > 0 && p.y < H + 40);
      for (const p of parts) {
        p.vx *= .991; p.vy += .27;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.tilt += .13; p.life--;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.min(1, p.life / 40);
        ctx.fillStyle = p.c;
        const f = Math.abs(Math.cos(p.tilt));
        if (p.shape === 0) ctx.fillRect(-p.s / 2, -p.s * .25 * f - .5, p.s, p.s * .5 * f + 1);
        else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2.5, 0, 6.2832); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(0, -p.s / 2); ctx.lineTo(p.s / 2, p.s / 2); ctx.lineTo(-p.s / 2, p.s / 2); ctx.closePath(); ctx.fill(); }
        ctx.restore();
      }
      if (parts.length) raf = requestAnimationFrame(loop); else ctx.clearRect(0, 0, W, H);
    }

    window.fxBurst = (x, y, n = 120) => {
      if (RM) return;
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.15, sp = 6 + Math.random() * 11;
        parts.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, s: 6 + Math.random() * 8,
          c: COLORS[(Math.random() * COLORS.length) | 0], rot: Math.random() * 6.28,
          vr: (Math.random() - .5) * .38, tilt: Math.random() * 6.28, shape: (Math.random() * 3) | 0,
          life: 120 + Math.random() * 90
        });
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const MSG = ['Forza Ponte!', 'Alé PAS!', 'Sempre insieme!', 'La storia ricomincia!', 'Tutti uniti!'];
    window.fxToast = (x, y, text) => {
      const t = document.createElement('div');
      t.className = 'fx-toast';
      t.textContent = text || MSG[(Math.random() * MSG.length) | 0];
      t.style.left = x + 'px'; t.style.top = y + 'px';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 2000);
    };

    // click sullo stemma
    const badge = $('.hero-badge');
    if (badge) {
      badge.setAttribute('data-cursor', 'Tifa!');
      badge.addEventListener('click', e => {
        const r = badge.getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        window.fxBurst(x, y, 140);
        window.fxToast(x, y - r.height / 2 - 6);
      });
    }

    // apertura di un risultato con vittoria
    $$('.result-row').forEach(row => row.setAttribute('data-cursor', 'Pagelle'));
    document.addEventListener('click', e => {
      const row = e.target.closest && e.target.closest('.result-row');
      if (!row || !row.classList.contains('open')) return;
      if (!$('.badge-pill.win', row)) return;
      const s = $('.score', row) || row;
      const r = s.getBoundingClientRect();
      window.fxBurst(r.left + r.width / 2, r.top + r.height / 2, 90);
    });
  }

  /* ===================================================================
     6. LO STEMMA VOLA NELL'HEADER mentre si scorre (solo home)
     =================================================================== */
  function initFlight() {
    if (RM) return;
    const hero = $('.hero'), crest = $('.hero-logo'), hl = $('.site-header .brand-logo');
    if (!hero || !crest || !hl) return;

    const fly = document.createElement('img');
    fly.className = 'fx-fly';
    fly.src = crest.currentSrc || crest.src;
    fly.alt = '';
    fly.setAttribute('aria-hidden', 'true');
    fly.style.transformOrigin = '50% 50%';
    document.body.appendChild(fly);

    let baseW = crest.offsetWidth || 130;
    const sizeIt = () => { baseW = crest.offsetWidth || baseW; fly.style.width = baseW + 'px'; };
    sizeIt();
    window.addEventListener('resize', sizeIt, { passive: true });

    const ease = t => t * t * (3 - 2 * t);
    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY || 0;
      if (y <= 1) {
        fly.style.opacity = '0';
        hero.classList.remove('fx-crest-flying');
        return;
      }
      const r = crest.getBoundingClientRect(), T = hl.getBoundingClientRect();
      const natTop = r.top + y * .84;                         // posizione a scroll 0 (compensa il parallasse)
      const D = Math.max(natTop - T.top, 240) * 1.1;
      const t = clamp(y / D, 0, 1);
      hero.classList.add('fx-crest-flying');
      if (t >= 1) { fly.style.opacity = '0'; return; }         // arrivato: resta il logo dell'header
      const e = ease(t);
      const cx = lerp(r.left + r.width / 2, T.left + T.width / 2, e);
      const cy = lerp(r.top + r.height / 2, T.top + T.height / 2, e);
      const w = lerp(r.width, T.width, e);
      fly.style.opacity = '1';
      fly.style.transform =
        `translate3d(${(cx - baseW / 2).toFixed(1)}px, ${(cy - baseW / 2).toFixed(1)}px, 0) scale(${(w / baseW).toFixed(4)}) perspective(520px) rotateY(${(360 * e).toFixed(1)}deg)`;
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ===================================================================
     7. La striscia delle squadre accelera (o inverte) con lo scroll
     =================================================================== */
  function initTickerSpeed() {
    const track = $('.fx-ticker-track');
    if (!track || RM || !track.getAnimations) return;
    const anim = track.getAnimations()[0];
    if (!anim) return;
    let lastY = window.scrollY || 0, rate = 1, target = 1, raf = 0;

    function tick() {
      raf = 0;
      rate = lerp(rate, target, .12);
      target = lerp(target, 1, .05);                 // poi torna piano alla velocità normale
      anim.playbackRate = rate;
      if (Math.abs(rate - 1) > .02 || Math.abs(target - 1) > .02) raf = requestAnimationFrame(tick);
      else anim.playbackRate = 1;
    }
    window.addEventListener('scroll', () => {
      const y = window.scrollY || 0, dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) < 2) return;
      target = clamp(Math.sign(dy) * (1 + Math.abs(dy) * .3), -9, 9);   // giù = veloce, su = al contrario
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* ===================================================================
     AVVIO
     =================================================================== */
  initTheme();             // subito: così il menu viene misurato già col pulsante
  initWipeCapture();
  initAurora();

  function late() {
    initCursor();
    initConfetti();
    initFlight();
    initTickerSpeed();
    window.dispatchEvent(new Event('resize'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', late);
  else late();
})();
