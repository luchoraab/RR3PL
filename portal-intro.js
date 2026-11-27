(() => {
  const scene = document.querySelector('#introScene');
  const portal = document.querySelector('.portal');
  if (!scene || !portal) return;
  const skip = scene.querySelector('#introSkip');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  if (!root.classList.contains('rr-preintro')) {
    scene.remove();
    return;
  }
  clearTimeout(window.rrIntroFallback);
  portal.inert = true;
  skip.focus({ preventScroll: true });
  const timer = setTimeout(finish, 950);
  scene.addEventListener('pointerdown', onPointer);
  window.addEventListener('wheel', finish, { passive: true, once: true });
  skip.addEventListener('click', finish, { once: true });
  document.addEventListener('keydown', onKey);
  motion.addEventListener('change', finish, { once: true });

  function onPointer(event) {
    if (!skip.contains(event.target)) finish();
  }

  function onKey(event) {
    if (event.key === 'Escape') finish();
  }

  function finish(event) {
    if (!root.classList.contains('rr-preintro')) return;
    clearTimeout(timer);
    scene.removeEventListener('pointerdown', onPointer);
    window.removeEventListener('wheel', finish);
    document.removeEventListener('keydown', onKey);
    motion.removeEventListener('change', finish);
    root.classList.replace('rr-preintro', 'rr-intro-complete');
    portal.inert = false;
    if (document.activeElement === skip && event) {
      portal.querySelector('.choice-card')?.focus({ preventScroll: true });
    }
    scene.inert = true;
    try { sessionStorage.setItem('rr_intro_seen', '1'); } catch {}
    const cleanup = () => scene.remove();
    scene.addEventListener('animationend', e => {
      if (e.target === scene && e.animationName === 'rrIntroFade') cleanup();
    });
    setTimeout(cleanup, 400);
  }
})();
