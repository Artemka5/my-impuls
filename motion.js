'use strict';
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => !reduced.matches && !root.classList.contains('motion-paused') && !document.hidden;
  // Content is visible by default, including when this enhancement cannot run.
  if ('IntersectionObserver' in window) {
    const blocks = document.querySelectorAll('.dashboard > .card, .week-card, .history');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.08});
    blocks.forEach(block => {block.classList.add('reveal-block');observer.observe(block);});
    root.classList.add('motion-ready');
    // Keyboard focus must never land in an invisible panel.
    document.addEventListener('focusin', event => event.target.closest?.('.reveal-block')?.classList.add('is-visible'));
  }
  function pulse(element, name) {
    if (!motionAllowed()) return;
    element.classList.remove(name);
    void element.offsetWidth;
    element.classList.add(name);
  }
  const entry = document.querySelector('.entry');
  entry.addEventListener('animationend', event => {if (event.animationName === 'saved-flash') entry.classList.remove('save-success');});
  new MutationObserver(() => {
    const message = document.getElementById('status').textContent;
    if (message === 'Готово! Вес сохранён.' || message === 'Запись обновлена.') pulse(entry, 'save-success');
  }).observe(document.getElementById('status'), {childList:true, characterData:true, subtree:true});
  for (const id of ['latest', 'change', 'count']) {
    const element = document.getElementById(id);
    element.addEventListener('animationend', () => element.classList.remove('stat-update'));
    new MutationObserver(() => pulse(element, 'stat-update')).observe(element, {childList:true});
  }
  const stage = document.querySelector('.orbit-stage');
  const scene = document.querySelector('.kinetic-scene');
  const finePointer = matchMedia('(pointer: fine)');
  let frame = 0;
  scene.addEventListener('pointermove', event => {
    if (!motionAllowed() || !finePointer.matches || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!motionAllowed()) return;
      const rect = scene.getBoundingClientRect();
      stage.style.setProperty('--tilt-x', `${(0.5 - (event.clientY-rect.top)/rect.height)*10}deg`);
      stage.style.setProperty('--tilt-y', `${((event.clientX-rect.left)/rect.width-0.5)*10}deg`);
    });
  });
  scene.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame); frame = 0;
    stage.style.setProperty('--tilt-x', '0deg');stage.style.setProperty('--tilt-y', '0deg');
  });
  const syncVisibility = () => root.classList.toggle('tab-hidden', document.hidden);
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
})();
