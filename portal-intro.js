(() => {
  const scene = document.querySelector('#introScene');
  const portal = document.querySelector('.portal');
  if (!scene || !portal) return;
  const skip = scene.querySelector('#introSkip');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let seen = false;
  try { seen = sessionStorage.getItem('rr_intro_seen') === '1'; } catch {}
  if (seen || motion.matches || location.hash) {
    scene.remove();
    return;
  }

  const root = document.documentElement;
  root.classList.add('rr-preintro');
  portal.inert = true;
  skip.focus({ preventScroll: true });
  const timer = setTimeout(finish, 3050);
  skip.addEventListener('click', finish, { once: true });
  document.addEventListener('keydown', onKey);
  motion.addEventListener('change', finish, { once: true });

  function onKey(event) {
    if (event.key === 'Escape') finish();
  }

  function finish() {
    if (!root.classList.contains('rr-preintro')) return;
    clearTimeout(timer);
    document.removeEventListener('keydown', onKey);
    motion.removeEventListener('change', finish);
    root.classList.remove('rr-preintro');
    root.classList.add('rr-intro-complete');
    portal.inert = false;
    if (document.activeElement === skip) {
      portal.querySelector('.choice-card')?.focus({ preventScroll: true });
    }
    scene.inert = true;
    try { sessionStorage.setItem('rr_intro_seen', '1'); } catch {}
    setTimeout(() => scene.remove(), 750);
  }
})();
