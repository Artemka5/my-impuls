'use strict';
(() => {
  const toggle = document.getElementById('motion-toggle');
  const preferenceKey = 'mama-fit.motion-paused';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  try { paused = paused || localStorage.getItem(preferenceKey) === 'true'; } catch {}
  function applyMotion() {
    document.documentElement.classList.toggle('motion-paused', paused || reduced.matches);
    toggle.setAttribute('aria-pressed', String(paused || reduced.matches));
    toggle.textContent = reduced.matches ? 'Анимации отключены в настройках устройства' : paused ? 'Включить анимации' : 'Приостановить анимации';
    toggle.disabled = reduced.matches;
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(preferenceKey, String(paused)); } catch {}
    applyMotion();
  });
  reduced.addEventListener('change', applyMotion);
  applyMotion();
  function updateWeek() {
    const container = document.getElementById('week-days');
    const fragment = document.createDocumentFragment();
    const today = localDate();
    let days = 0;
    for (let offset = 6; offset >= 0; offset--) {
      const day = new Date();
      day.setHours(12, 0, 0, 0);
      day.setDate(day.getDate() - offset);
      const date = localDate(day);
      const entry = records.find(record => record.date === date);
      if (entry) days++;
      const item = document.createElement('div');
      item.className = 'week-day' + (entry ? ' recorded' : '') + (date === today ? ' today' : '');
      item.setAttribute('aria-label', dateLabel(date) + (entry ? ': ' + number(entry.weight) + ' кг' : ': нет записи'));
      const weekday = document.createElement('span');
      weekday.textContent = date === today ? 'Сегодня' : day.toLocaleDateString('ru-RU', {weekday:'short'});
      const orb = document.createElement('span');
      orb.className = 'day-orb';
      orb.textContent = entry ? '✓' : '·';
      orb.setAttribute('aria-hidden', 'true');
      const caption = document.createElement('small');
      caption.textContent = day.toLocaleDateString('ru-RU', {day:'2-digit', month:'2-digit'});
      item.append(weekday, orb, caption);
      fragment.append(item);
    }
    container.replaceChildren(fragment);
    const count = document.getElementById('week-count');
    count.replaceChildren(document.createTextNode(String(days)));
    const total = document.createElement('span');
    total.textContent = '/ 7';
    count.append(total);
    document.getElementById('week-arc').style.strokeDasharray = `${days / 7 * 100} 100`;
  }
  new MutationObserver(updateWeek).observe(document.getElementById('history'), {childList:true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateWeek(); });
  updateWeek();
})();
