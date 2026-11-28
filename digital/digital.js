(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const form = document.querySelector('#digitalForm');
  const projectSelect = document.querySelector('#tipoProyecto');
  document.querySelectorAll('[data-project]').forEach(a => a.addEventListener('click', () => { if (projectSelect) projectSelect.value=a.dataset.project||''; }));
  window.RRConsultation?.bind(form, d => {
    const lines = ['Hola, quiero consultar a RR Digital Solutions.', '', `Nombre: ${d.get('nombre')}`, `Proyecto: ${d.get('proyecto')}`];
    lines.push(`Idea: ${d.get('idea')}`);
    window.RRConsultation.whatsapp(lines);
  });
  if ('IntersectionObserver' in window && !reduced.matches) {
    document.documentElement.classList.add('js-enabled');
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} }),{threshold:.05,rootMargin:'0px 0px 50px 0px'});
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
  }
})();
