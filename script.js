// Progressive enhancement only: the page is complete and usable without this file.
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  if (!('IntersectionObserver' in window)) return;

  // Active section in the navigation
  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (sections.length) {
    const visible = new Map();
    const update = () => {
      let best = null, bestRatio = 0;
      sections.forEach((s) => { const r = visible.get(s.id) || 0; if (r > bestRatio) { best = s.id; bestRatio = r; } });
      // The last section is short; mark it active once the page is scrolled to the bottom.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) best = sections[sections.length - 1].id;
      links.forEach((a) => {
        if (best && a.getAttribute('href') === '#' + best) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
      update();
    }, { rootMargin: '-64px 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5] });
    sections.forEach((s) => spy.observe(s));
    window.addEventListener('scroll', update, { passive: true });
  }

  // Gentle section reveals (skipped entirely for reduced motion)
  if (reduceMotion) return;
  const targets = document.querySelectorAll('[data-reveal]');
  const viewH = window.innerHeight;
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); reveal.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach((el) => {
    // Anything already on screen (or above it, e.g. after an anchor jump) stays visible.
    if (el.getBoundingClientRect().top < viewH) el.classList.add('is-visible');
    reveal.observe(el);
  });
  root.classList.add('reveal-ready');
})();
