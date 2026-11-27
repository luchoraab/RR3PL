(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const form = document.querySelector('#digitalForm');
  const projectSelect = document.querySelector('#tipoProyecto');
  document.querySelectorAll('[data-project]').forEach(a => a.addEventListener('click', () => { if (projectSelect) projectSelect.value=a.dataset.project||''; }));
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const lines = ['Hola, quiero consultar a RR Digital Solutions.', '', `Nombre: ${d.get('nombre')}`, `Proyecto: ${d.get('proyecto')}`];
    lines.push(`Idea: ${d.get('idea')}`);
    const url='https://wa.me/5493517059319?text='+encodeURIComponent(lines.join('\n'));
    window.location.assign(url);
  });
  if ('IntersectionObserver' in window && !reduced.matches) {
    document.documentElement.classList.add('js-enabled');
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} }),{threshold:.05,rootMargin:'0px 0px 50px 0px'});
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
  }
  const glow = document.querySelector('.site-cursor-glow');
  if (glow && !reduced.matches && window.matchMedia('(pointer: fine)').matches) {
    let raf=0;let x=0;let y=0;
    window.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(()=>{glow.style.transform=`translate3d(${x-220}px,${y-220}px,0)`;glow.classList.add('active');raf=0;});},{passive:true});
    window.addEventListener('pointerleave',()=>glow.classList.remove('active'));
    document.querySelectorAll('.panel-tilt').forEach(p=>{
      p.addEventListener('pointermove',e=>{const b=p.getBoundingClientRect();const dx=(e.clientX-b.left)/b.width-.5;const dy=(e.clientY-b.top)/b.height-.5;p.style.translate=`${dx*6}px ${dy*5}px`;},{passive:true});
      p.addEventListener('pointerleave',()=>{p.style.translate='0 0'});
    });
  }
})();
