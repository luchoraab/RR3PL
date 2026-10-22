(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  if (reduce || !fine) return;
  const orb = document.querySelector('.cursor-light');
  const cards = document.querySelectorAll('.choice-card');
  let tx = innerWidth / 2, ty = innerHeight / 2;
  let cx = tx, cy = ty, raf = 0;
  document.addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    if (orb) orb.classList.add('visible');
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  function tick() {
    cx += (tx-cx)*.12; cy += (ty-cy)*.12;
    if (orb) orb.style.transform = `translate3d(${cx-210}px,${cy-210}px,0)`;
    if (Math.abs(tx-cx)+Math.abs(ty-cy)>0.8) raf=requestAnimationFrame(tick);
    else raf=0;
  }
  document.addEventListener('pointerleave', () => orb?.classList.remove('visible'));
  cards.forEach(card => {
    card.addEventListener('pointermove',e => {
      const box=card.getBoundingClientRect();
      const x=(e.clientX-box.left)/box.width-.5;
      const y=(e.clientY-box.top)/box.height-.5;
      card.style.setProperty('--mx',`${(x+.5)*100}%`);
      card.style.setProperty('--my',`${(y+.5)*100}%`);
      card.style.setProperty('--rx',`${(-y*2.6).toFixed(2)}deg`);
      card.style.setProperty('--ry',`${(x*2.6).toFixed(2)}deg`);
    },{passive:true});
    card.addEventListener('pointerleave',() => {
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
    });
  });
})();
