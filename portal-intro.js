(() => {
  'use strict';
  const active = document.documentElement.classList.contains('rr-preintro');
  const scene = document.getElementById('introScene');
  const skip = document.getElementById('introSkip');
  if (!active || !scene) return;
  let closed = false;
  let timer;
  const finish = () => {
    if (closed) return;
    closed = true;
    clearTimeout(timer);
    document.documentElement.classList.remove('rr-preintro');
    document.documentElement.classList.add('rr-intro-complete');
    try { sessionStorage.setItem('rr_intro_seen', '1'); } catch(e) {}
    setTimeout(() => scene.remove(), 800);
  };
  skip?.addEventListener('click', finish);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') finish(); });
  timer = setTimeout(finish, 3050);
})();
