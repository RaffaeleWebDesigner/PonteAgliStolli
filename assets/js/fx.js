/* =====================================================================
   EFFETTI INTERATTIVI — ASD Ponte agli Stolli
   Non modifica i dati: aggiunge solo movimento e interattività.
   Per disattivare tutto togliere <script fx.js> e <link fx.css>.
   ===================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  root.classList.add('fx-ready');
  if (RM) root.classList.add('fx-reduced');

  /* ---------- scroll: un solo ascoltatore per tutti gli effetti ---------- */
  const scrollFns = [];
  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      scrollTicking = false;
      const y = window.scrollY || 0;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      scrollFns.forEach(fn => fn(y, y / max));
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* ===================================================================
     INTRO (solo home, una volta per sessione)
     =================================================================== */
  function initIntro() {
    const intro = document.getElementById('fx-intro');
    const active = intro && !root.classList.contains('fx-no-intro') && !RM;
    const go = () => root.classList.add('fx-go');

    if (!active) {
      if (intro) intro.remove();
      requestAnimationFrame(() => requestAnimationFrame(go));
      return;
    }
    const timer = setTimeout(go, 2400);          // l'hero parte mentre l'iride si apre
    intro.addEventListener('animationend', e => {
      if (e.animationName === 'fx-iris' || e.animationName === 'fx-iris-skip') intro.remove();
    });
    intro.addEventListener('click', () => {      // click = salta
      clearTimeout(timer);
      intro.classList.add('fx-skip');
      setTimeout(go, 250);
    });
  }

  /* ===================================================================
     HEADER: vetro allo scroll, barra di avanzamento, menu
     =================================================================== */
  function initHeader() {
    const header = $('.site-header');
    if (!header) return;

    const bar = document.createElement('div');
    bar.className = 'fx-progress';
    bar.setAttribute('aria-hidden', 'true');
    header.appendChild(bar);

    scrollFns.push((y, p) => {
      header.classList.toggle('is-scrolled', y > 12);
      bar.style.setProperty('--p', p.toFixed(4));
    });

    // hamburger -> X e voci del menu a cascata
    const toggle = $('.nav-toggle');
    const nav = $('.main-nav');
    if (toggle && nav) {
      $$('li', nav).forEach((li, i) => li.style.setProperty('--i', i));
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', () => {
        const open = nav.classList.contains('open');
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
  }

  /* pillola che scivola sul menu (solo desktop) */
  function initNavPill() {
    const header = $('.site-header');
    const nav = $('.main-nav');
    if (!header || !nav) return;
    const links = $$('a', nav);
    if (!links.length) return;

    const mq = window.matchMedia('(min-width: 721px)');
    const pill = document.createElement('span');
    pill.className = 'nav-pill';
    pill.setAttribute('aria-hidden', 'true');
    nav.prepend(pill);

    const current = () => links.find(a => a.classList.contains('active')) || null;

    function place(a, instant) {
      if (!mq.matches || !a) { pill.style.opacity = '0'; links.forEach(l => l.classList.remove('pill-on')); return; }
      const nr = nav.getBoundingClientRect();
      const r = a.getBoundingClientRect();
      if (instant) pill.style.transition = 'none';
      pill.style.opacity = '1';
      pill.style.width = r.width + 'px';
      pill.style.height = r.height + 'px';
      pill.style.transform = `translate(${r.left - nr.left}px, ${r.top - nr.top}px)`;
      links.forEach(l => l.classList.toggle('pill-on', l === a));
      if (instant) { void pill.offsetWidth; pill.style.transition = ''; }
    }
    function sync() {
      header.classList.toggle('fx-nav-on', mq.matches);
      place(current(), true);
    }

    links.forEach(a => {
      a.addEventListener('pointerenter', () => place(a));
      a.addEventListener('focus', () => place(a));
      a.addEventListener('blur', () => place(current()));
    });
    nav.addEventListener('pointerleave', () => place(current()));
    window.addEventListener('resize', sync, { passive: true });
    mq.addEventListener('change', sync);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
    sync();
  }

  /* ===================================================================
     HERO
     =================================================================== */
  function initHero() {
    const hero = $('.hero');
    if (!hero) return;

    // titolo lettera per lettera
    const h1 = $('h1', hero);
    if (h1 && !RM) {
      const text = h1.textContent.trim();
      let i = 0;
      h1.setAttribute('aria-label', text);
      h1.innerHTML = text.split(/\s+/).map(w =>
        `<span class="w" aria-hidden="true">${[...w].map(c => `<span class="ch" style="--i:${i++}">${c}</span>`).join('')}</span>`
      ).join(' ');
    }

    // entrata a cascata
    if (!RM) {
      [['.hero-badge', 0], ['.league-pill', 650], ['.subtitle', 850], ['.hero-tagline', 1050]].forEach(([sel, d]) => {
        const el = $(sel, hero);
        if (el) { el.classList.add('hero-reveal'); el.style.setProperty('--d', d); }
      });
    }

    // stemma: avvolto per poter fluttuare e inclinarsi in 3D
    const crest = $('.hero-logo', hero);
    if (crest) {
      const wrap = document.createElement('div');
      wrap.className = 'fx-float';
      crest.parentNode.insertBefore(wrap, crest);
      wrap.appendChild(crest);
    }

    if (RM) return;

    // campo da calcio disegnato a linee
    const NS = 'http://www.w3.org/2000/svg';
    const pitch = document.createElementNS(NS, 'svg');
    pitch.setAttribute('class', 'fx-pitch');
    pitch.setAttribute('viewBox', '0 0 1200 400');
    pitch.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    pitch.setAttribute('aria-hidden', 'true');
    pitch.innerHTML = [
      '<rect pathLength="1" x="40" y="30" width="1120" height="340" rx="6"/>',
      '<line pathLength="1" x1="600" y1="30" x2="600" y2="370"/>',
      '<circle pathLength="1" cx="600" cy="200" r="72"/>',
      '<rect pathLength="1" x="40" y="105" width="170" height="190"/>',
      '<rect pathLength="1" x="990" y="105" width="170" height="190"/>',
      '<rect pathLength="1" x="40" y="155" width="62" height="90"/>',
      '<rect pathLength="1" x="1098" y="155" width="62" height="90"/>',
      '<circle class="dot" cx="600" cy="200" r="4"/>'
    ].join('');
    hero.prepend(pitch);

    // particelle
    const canvas = document.createElement('canvas');
    canvas.className = 'fx-particles';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.children[1]);
    startParticles(hero, canvas);

    // parallasse del mouse + inclinazione stemma
    if (FINE) {
      let raf = 0, ev = null;
      const apply = () => {
        raf = 0;
        const r = hero.getBoundingClientRect();
        const x = ev.clientX - r.left, y = ev.clientY - r.top;
        hero.style.setProperty('--mx', x + 'px');
        hero.style.setProperty('--my', y + 'px');
        hero.style.setProperty('--px', (x / r.width - .5).toFixed(3));
        hero.style.setProperty('--py', (y / r.height - .5).toFixed(3));
        if (crest) {
          const c = crest.getBoundingClientRect();
          const dx = clamp((ev.clientX - (c.left + c.width / 2)) / 420, -1, 1);
          const dy = clamp((ev.clientY - (c.top + c.height / 2)) / 320, -1, 1);
          crest.style.transform = `rotateX(${(-dy * 20).toFixed(1)}deg) rotateY(${(dx * 26).toFixed(1)}deg) scale(1.06)`;
        }
      };
      hero.addEventListener('pointermove', e => { ev = e; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
      hero.addEventListener('pointerleave', () => {
        ['--mx', '--my', '--px', '--py'].forEach(v => hero.style.removeProperty(v));
        if (crest) crest.style.transform = '';
      });
    }

    // parallasse allo scroll
    scrollFns.push(y => {
      const h = hero.offsetHeight;
      hero.style.setProperty('--sy', y < h + 80 ? Math.round(y) : Math.round(h + 80));
    });
  }

  function startParticles(hero, cv) {
    const ctx = cv.getContext('2d');
    let w = 0, h = 0, dpr = 1, pts = [], raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      w = hero.clientWidth; h = hero.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = clamp(Math.round(w * h / 15000), 18, 64);
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
        r: Math.random() * 1.8 + .8
      }));
    }

    function frame() {
      raf = 0;
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 19600) {                       // respinte dal cursore (raggio 140px)
          const d = Math.sqrt(d2) || 1, f = (140 - d) / 140;
          p.x += (dx / d) * f * 2.2; p.y += (dy / d) * f * 2.2;
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 12100) {
            ctx.strokeStyle = `rgba(169,212,245,${((1 - Math.sqrt(d2) / 110) * .26).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(200,228,250,.75)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };

    resize();
    start();
    window.addEventListener('resize', () => { resize(); }, { passive: true });
    document.addEventListener('visibilitychange', start);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; start(); }).observe(hero);
    }
    if (FINE) {
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    }
  }

  /* ===================================================================
     STRISCIA SCORREVOLE con le squadre del girone (dati già presenti)
     =================================================================== */
  function initTicker() {
    const hero = $('.hero');
    if (!hero || typeof SITE_DATA === 'undefined' || !SITE_DATA.classifica) return;
    const names = SITE_DATA.classifica.map(t => t.squadra);
    if (!names.length) return;
    const own = typeof TEAM_NAME !== 'undefined' ? TEAM_NAME : '';
    const set = names.map(n => `<span class="${n === own ? 'own' : ''}">${n}</span><i class="sep"></i>`).join('');
    const el = document.createElement('div');
    el.className = 'fx-ticker';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<div class="fx-ticker-track"><div class="fx-ticker-set">${set}</div><div class="fx-ticker-set">${set}</div></div>`;
    hero.insertAdjacentElement('afterend', el);
  }

  /* ===================================================================
     COMPARSA ALLO SCROLL + card interattive (anche per contenuti creati dopo)
     =================================================================== */
  const REVEAL_SEL = [
    '.section-title', '.quick-link', '.widget-card', '.match-row', '.giornata-title',
    '.player-card', '.staff-card', '.sponsor-card', '.tabs', '.roster-filters', '.empty-note',
    'tbody tr', '.site-footer .container > div'
  ].join(',');
  const TILT_SEL = '.quick-link, .player-card, .staff-card, .sponsor-card';
  const SPOT_SEL = '.widget-card, .match-row';

  let io = null;
  function reveal(entries) {
    let k = 0;
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      el.style.setProperty('--fx-i', Math.min(k++, 12));
      el.classList.add('fx-in');
      const clean = () => el.removeAttribute('data-fx-reveal');   // poi hover/tilt tornano liberi
      el.addEventListener('transitionend', function h(ev) {
        if (ev.target !== el || ev.propertyName === 'opacity') return;
        el.removeEventListener('transitionend', h);
        clean();
      });
      setTimeout(clean, 2200);
    });
  }

  function mark(scope) {
    const all = [];
    if (scope.nodeType === 1 && scope.matches && scope.matches(REVEAL_SEL + ',' + TILT_SEL + ',' + SPOT_SEL)) all.push(scope);
    if (scope.querySelectorAll) all.push(...scope.querySelectorAll(REVEAL_SEL + ',' + TILT_SEL + ',' + SPOT_SEL));

    all.forEach(el => {
      if (FINE && !RM && el.matches(TILT_SEL) && !el.hasAttribute('data-fx-tilt')) {
        el.setAttribute('data-fx-tilt', '');
        const g = document.createElement('span');
        g.className = 'fx-glare';
        g.setAttribute('aria-hidden', 'true');
        el.appendChild(g);
      }
      if (FINE && el.matches(SPOT_SEL)) el.setAttribute('data-fx-spot', '');

      if (RM || !io || !el.matches(REVEAL_SEL) || el.hasAttribute('data-fx-reveal') || el.classList.contains('fx-in')) return;
      if (el.parentElement && el.parentElement.closest('[data-fx-reveal]')) return;   // niente doppia animazione annidata
      if (el.matches('.section-title')) el.classList.add('fx-line');
      el.setAttribute('data-fx-reveal', el.matches('tbody tr') ? 'row' : '');
      io.observe(el);
    });
  }

  function initReveal() {
    if (!RM && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(reveal, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    }
    mark(document.body);
    let pending = false;
    new MutationObserver(muts => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) mark(n); }));
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* inclinazione 3D delle card + faro del mouse (ascoltatori delegati) */
  function initPointerFx() {
    if (!FINE) return;
    let active = null, raf = 0, last = null;

    const tilt = () => {
      raf = 0;
      if (!active) return;
      const r = active.getBoundingClientRect();
      const x = (last.clientX - r.left) / r.width, y = (last.clientY - r.top) / r.height;
      const max = active.classList.contains('quick-link') ? 8 : 11;
      active.style.transform =
        `perspective(800px) rotateX(${((.5 - y) * max).toFixed(2)}deg) rotateY(${((x - .5) * max * 1.2).toFixed(2)}deg) translateY(-4px) scale(1.02)`;
      active.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      active.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    };
    const release = el => { el.classList.remove('fx-tilting'); el.style.transform = ''; };

    document.addEventListener('pointermove', e => {
      const t = e.target.closest ? e.target : null;
      if (!t) return;
      const card = t.closest('[data-fx-tilt]');
      if (card !== active) {
        if (active) release(active);
        active = card;
        if (card && !RM) card.classList.add('fx-tilting');
      }
      if (active) { last = e; if (!raf) raf = requestAnimationFrame(tilt); }

      const spot = t.closest('[data-fx-spot]');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        spot.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }
    }, { passive: true });

    root.addEventListener('mouseleave', () => { if (active) { release(active); active = null; } });
  }

  /* ===================================================================
     SCHEDE con pillola scorrevole (calendario / risultati)
     =================================================================== */
  function initTabs() {
    $$('.tabs').forEach(tabs => {
      const btns = $$('.tab-btn', tabs);
      if (!btns.length) return;
      tabs.classList.add('fx-tabs');
      const pill = document.createElement('span');
      pill.className = 'tab-pill';
      pill.setAttribute('aria-hidden', 'true');
      tabs.prepend(pill);

      const place = instant => {
        const a = btns.find(b => b.classList.contains('active')) || btns[0];
        const tr = tabs.getBoundingClientRect(), r = a.getBoundingClientRect();
        if (instant) pill.style.transition = 'none';
        pill.style.width = r.width + 'px';
        pill.style.transform = `translateX(${r.left - tr.left - tabs.clientLeft - 5}px)`;
        if (instant) { void pill.offsetWidth; pill.style.transition = ''; }
      };
      place(true);
      btns.forEach(b => b.addEventListener('click', () => requestAnimationFrame(() => place(false))));
      window.addEventListener('resize', () => place(true), { passive: true });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => place(true));
    });

    // pagelle: i contenuti entrano a cascata quando si apre un risultato
    document.addEventListener('click', e => {
      const row = e.target.closest && e.target.closest('.result-row');
      const panel = row && document.getElementById(row.dataset.target);
      if (panel) $$('.pagella-item, .reti-note, .empty-note', panel).forEach((el, i) => el.style.setProperty('--i', i));
    });
  }

  /* ===================================================================
     CONTO ALLA ROVESCIA alla prossima partita (stessi dati del widget)
     =================================================================== */
  function initCountdown() {
    const row = $('#widget-prossima [data-kickoff]');
    if (!row) return;
    const target = new Date(row.dataset.kickoff).getTime();
    if (isNaN(target)) return;

    const box = document.createElement('div');
    box.className = 'fx-countdown';
    box.setAttribute('role', 'timer');
    box.innerHTML = `
      <div class="cd-label">Calcio d'inizio tra</div>
      <div class="cd-grid">
        ${[['d', 'giorni'], ['h', 'ore'], ['m', 'minuti'], ['s', 'secondi']]
          .map(([u, l]) => `<div class="cd-unit"><span class="cd-num" data-u="${u}">00</span><small>${l}</small></div>`).join('')}
      </div>`;
    row.insertAdjacentElement('afterend', box);

    const nums = {};
    $$('.cd-num', box).forEach(n => { nums[n.dataset.u] = n; });
    let timer = 0;

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        if (diff > -2 * 3600e3) box.innerHTML = '<div class="cd-live">Calcio d\'inizio!</div>';
        else box.remove();
        return;
      }
      const v = {
        d: Math.floor(diff / 864e5),
        h: Math.floor(diff % 864e5 / 36e5),
        m: Math.floor(diff % 36e5 / 6e4),
        s: Math.floor(diff % 6e4 / 1e3)
      };
      for (const u in v) {
        const txt = String(v[u]).padStart(2, '0');
        if (nums[u].textContent !== txt) {
          nums[u].textContent = txt;
          if (!RM) { nums[u].classList.remove('tick'); void nums[u].offsetWidth; nums[u].classList.add('tick'); }
        }
      }
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ===================================================================
     PULSANTE "TORNA SU" con anello di avanzamento
     =================================================================== */
  function initTopButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fx-top';
    btn.setAttribute('aria-label', 'Torna in cima alla pagina');
    btn.innerHTML = `
      <svg class="ring" viewBox="0 0 50 50" aria-hidden="true"><circle class="bg" cx="25" cy="25" r="21"/><circle class="fg" cx="25" cy="25" r="21"/></svg>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
    document.body.appendChild(btn);
    const fg = $('.fg', btn);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));
    scrollFns.push((y, p) => {
      btn.classList.toggle('show', y > 480);
      fg.style.strokeDashoffset = (131.95 * (1 - p)).toFixed(2);
    });
  }

  /* ===================================================================
     AVVIO
     =================================================================== */
  // subito (prima del primo disegno): così non si vede mai il contenuto "scoprirsi"
  initIntro();
  initHero();
  initTicker();
  initReveal();

  function late() {
    initHeader();
    initNavPill();
    initTabs();
    initCountdown();
    initTopButton();
    initPointerFx();
    onScroll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', late);
  else late();
})();
