(() => {
  'use strict';
  const nav = document.querySelector('.suite-nav');
  if (!nav) return;
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1, frame = 0;
  function update() {
    frame = 0;
    const edge = nav.getBoundingClientRect().bottom + 32;
    let next = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= edge) next = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) next = links.length - 1;
    if (next === active) return;
    active = next;
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    // Move only the horizontal menu; never move the page while tracking scroll.
    const link = links[active], box = link.getBoundingClientRect(), menu = nav.getBoundingClientRect();
    if (box.left < menu.left + 12 || box.right > menu.right - 12) {
      nav.scrollTo({left: nav.scrollLeft + box.left - menu.left - (nav.clientWidth - box.width) / 2,
        behavior: reduced.matches || document.documentElement.classList.contains('motion-paused') ? 'instant' : 'smooth'});
    }
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const measure = () => {
    document.documentElement.style.setProperty('--section-nav-height', nav.offsetHeight + 'px');
    schedule();
  };
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', measure, {passive: true});
  window.addEventListener('hashchange', schedule);
  window.addEventListener('impulse-data', schedule);
  window.addEventListener('load', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(nav);
  measure();
})();
