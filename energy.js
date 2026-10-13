'use strict';
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const allowed = () => !reduced.matches && !root.classList.contains('motion-paused') && !document.hidden;
  const cards = [...document.querySelectorAll('.dashboard > .card, .week-card, .history')];
  cards.forEach((card, index) => card.classList.add(index % 2 ? 'reveal-right' : 'reveal-left'));
  // Re-arm the reveal only after the panel has completely left the viewport.
  // The keyboard-focused panel stays visible even when the page scrolls.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        if (isIntersecting || !allowed() || target.contains(document.activeElement)) target.classList.add('is-visible');
        else target.classList.remove('is-visible');
      });
    }, {threshold:0});
    cards.forEach(card => observer.observe(card));
  }
  const pops = [document.querySelector('.pop-left'), document.querySelector('.pop-right')];
  let lastY = window.scrollY;
  let travel = 0;
  let side = 0;
  let lastPop = -Infinity;
  let frame = 0;
  pops.forEach(pop => pop.addEventListener('animationend', () => pop.classList.remove('is-popping')));
  function onScroll() {
    const nextY = window.scrollY;
    const delta = Math.abs(nextY - lastY);
    lastY = nextY;
    if (!allowed()) {travel = 0;return;}
    travel += delta;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!allowed()) {travel = 0;return;}
      const now = performance.now();
      if (travel < 150 || now - lastPop < 1000) return;
      const pop = pops[side];
      pop.style.setProperty('--pop-top', side === 0 ? '36%' : '64%');
      pop.classList.remove('is-popping');
      void pop.offsetWidth;
      pop.classList.add('is-popping');
      side = 1 - side;
      travel = 0;
      lastPop = now;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {cancelAnimationFrame(frame);frame = 0;travel = 0;}
    lastY = window.scrollY;
  });
})();
