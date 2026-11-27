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
    const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
  });
  if ('IntersectionObserver' in window && !reduced.matches) {
    document.documentElement.classList.add('js-enabled');
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} }),{threshold:.05,rootMargin:'0px 0px 50px 0px'});
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
  }
})();
