// Apply the device preference before the page is painted. No diary data is cached.
try { document.documentElement.classList.toggle('large-text', localStorage.getItem('impulse.large-text') === '1'); } catch {}
