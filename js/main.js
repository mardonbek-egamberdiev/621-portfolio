/* =========================================================
   Mardonbek Egamberdiyev — Portfolio scripts
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------------- Toast ---------------- */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ---------------- Til / Language ---------------- */
  let lang = store.get('me-lang') || 'uz';
  if (!window.I18N[lang]) lang = 'uz';

  function t(key) {
    return (window.I18N[lang] && window.I18N[lang][key]) || window.I18N.uz[key] || key;
  }

  function applyLang(next) {
    lang = next;
    root.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = window.I18N[lang][el.dataset.i18n];
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });
    document.title = t('meta.title');
    document.getElementById('theme-toggle').setAttribute('aria-label', t('aria.theme'));
    document.getElementById('menu-btn').setAttribute('aria-label', t('aria.menu'));
    store.set('me-lang', lang);
  }

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
  applyLang(lang);

  /* ---------------- Mavzu / Theme ---------------- */
  function isDark() {
    const set = root.getAttribute('data-theme');
    if (set === 'dark') return true;
    if (set === 'light') return false;
    return darkQuery.matches;
  }
  function syncThemeClass() {
    root.classList.toggle('is-dark', isDark());
    pattern && pattern.refreshColors();
  }

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store.set('me-theme', next);
    syncThemeClass();
  });
  darkQuery.addEventListener('change', syncThemeClass);

  /* ---------------- Mobil menyu ---------------- */
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  function closeMenu() {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------------- Header holati va faol havola ---------------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = [...document.querySelectorAll('.nav-links a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

  /* ---------------- Ism harflari animatsiyasi ---------------- */
  let i = 0;
  document.querySelectorAll('.hero-name .line').forEach(line => {
    const text = line.textContent;
    line.setAttribute('aria-label', text);
    line.textContent = '';
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--i', i++);
      span.textContent = ch;
      line.appendChild(span);
    });
  });
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));

  /* ---------------- Ikat / girih naqsh (hero canvas) ---------------- */
  const pattern = (function createPattern() {
    const canvas = document.getElementById('hero-pattern');
    if (!canvas || !canvas.getContext) return null;
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0, size = 48, cells = [], colors = [], bg = '#fff';
    let running = false, visible = true, raf = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    function refreshColors() {
      const cs = getComputedStyle(root);
      colors = ['--turquoise', '--saffron', '--pomegranate', '--lapis'].map(v => cs.getPropertyValue(v).trim());
      bg = cs.getPropertyValue('--bg').trim();
      if (!running) draw(performance.now());
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size = w < 700 ? 34 : 48;

      cells = [];
      const rows = Math.ceil(h / (size / 2)) + 2;
      const cols = Math.ceil(w / size) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * size + (r % 2 ? size / 2 : 0);
          const y = r * (size / 2);
          // Barqaror “tasodifiy” rang tanlovi
          const k = ((r * 7 + c * 13) ^ (r * c)) % 4;
          cells.push({ x, y, r, c, k: Math.abs(k) });
        }
      }
      if (!pointer.active) { pointer.x = pointer.tx = w * 0.7; pointer.y = pointer.ty = h * 0.45; }
      if (!running) draw(performance.now());
    }

    function diamond(x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s, y);
      ctx.closePath();
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);

      // Kursor boʻlmasa — nuqta oʻzi sekin “sayr” qiladi
      if (!pointer.active && !reduceMotion) {
        pointer.tx = w * (0.65 + 0.2 * Math.sin(time * 0.00031));
        pointer.ty = h * (0.45 + 0.25 * Math.sin(time * 0.00047));
      }
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      const R = Math.max(140, Math.min(w, h) * 0.22);
      const half = size / 2;

      for (const cell of cells) {
        const dx = cell.x - pointer.x, dy = cell.y - pointer.y;
        const influence = Math.exp(-(dx * dx + dy * dy) / (2 * R * R));
        const wave = 0.5 + 0.5 * Math.sin(time * 0.0011 + cell.c * 0.38 + cell.r * 0.21);
        const s = Math.min(half * 0.98, half * (0.12 + 0.28 * wave + 0.62 * influence));
        if (s < 1) continue;

        ctx.globalAlpha = 0.1 + 0.66 * influence;
        ctx.fillStyle = colors[cell.k];
        diamond(cell.x, cell.y, s);
        ctx.fill();

        // Ichki “koʻz” — ikat matosidagi kabi qatlam
        if (s > 7) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = bg;
          diamond(cell.x, cell.y, s * 0.42);
          ctx.fill();
          ctx.globalAlpha = 0.35 + 0.6 * influence;
          ctx.fillStyle = colors[(cell.k + 1) % 4];
          diamond(cell.x, cell.y, s * 0.18);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function loop(time) {
      draw(time);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduceMotion || !visible || document.hidden) return;
      running = true; raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    const hero = canvas.parentElement;
    hero.addEventListener('pointermove', e => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.active = true;
      if (reduceMotion) { pointer.x = pointer.tx; pointer.y = pointer.ty; draw(performance.now()); }
    });
    hero.addEventListener('pointerleave', () => { pointer.active = false; });

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    }).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });

    refreshColors();
    resize();
    start();

    return { refreshColors };
  })();

  syncThemeClass();

  /* ---------------- Emailni nusxalash ---------------- */
  const emailLink = document.getElementById('email-link');
  const email = emailLink.getAttribute('href').replace('mailto:', '');
  document.getElementById('copy-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = email; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      ta.remove();
    }
    toast(t('contact.copied'));
  });

  /* ---------------- Aloqa formasi (mailto orqali) ---------------- */
  const form = document.getElementById('contact-form');
  const formError = document.getElementById('form-error');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const from = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from);

    if (!name || !emailOk || !message) {
      formError.textContent = t('form.error');
      formError.hidden = false;
      return;
    }
    formError.hidden = true;

    const subject = encodeURIComponent('Portfolio: ' + name);
    const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + from + ')');
    toast(t('form.opening'));
    window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
    form.reset();
  });

  /* ---------------- Yil ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
