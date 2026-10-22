(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (menu && nav) {
    const close = () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menú');
    };
    menu.addEventListener('click', () => {
      const expanded = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(expanded));
      menu.setAttribute('aria-label', expanded ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });
  }

  // Carrusel real: avance automático, flechas, swipe, teclado y pausa accesible.
  const track = document.querySelector('#vehicleTrack');
  if (track) {
    const cards = Array.from(track.querySelectorAll('.vehicle-card'));
    const progress = document.querySelector('#fleetProgress');
    const counter = document.querySelector('#fleetIndex');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let autoplay = null;
    let manualPause = false;

    function stride() {
      const first = cards[0];
      if (!first) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
      return first.getBoundingClientRect().width + (Number.isFinite(gap) ? gap : 0);
    }
    function index() {
      return Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / stride())));
    }
    function sync() {
      const current = index();
      if (counter) counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
      if (progress) progress.style.width = (((current + 1) / cards.length) * 100) + '%';
    }
    function step(direction) {
      const next = index() + direction;
      const atEnd = next >= cards.length || track.scrollLeft >= track.scrollWidth - track.clientWidth - 8 && direction > 0;
      track.scrollTo({left: atEnd ? 0 : Math.max(0, next) * stride(), behavior: reduced.matches ? 'instant' : 'smooth'});
      setTimeout(sync, 650);
    }
    function pause() {
      manualPause = true;
      if (autoplay) { clearInterval(autoplay); autoplay = null; }
    }
    function resume() {
      manualPause = false;
      if (!reduced.matches && !document.hidden && !autoplay) autoplay = setInterval(() => step(1), 4500);
    }
    document.querySelector('#prev')?.addEventListener('click', () => { pause(); step(-1); });
    document.querySelector('#next')?.addEventListener('click', () => { pause(); step(1); });
    track.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); pause(); step(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); pause(); step(-1); }
    });
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', resume);
    track.addEventListener('touchstart', pause, {passive:true});
    track.addEventListener('touchend', () => { sync(); }, {passive:true});
    track.addEventListener('scroll', sync, {passive:true});
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (autoplay) clearInterval(autoplay); autoplay = null; }
      else if (!manualPause) resume();
    });
    reduced.addEventListener?.('change', () => { pause(); if (!reduced.matches) resume(); });
    sync();
    resume();
  }


  // Optical illumination starts once the new front photo enters the viewport.
  const cronosVisual = document.querySelector('.why-section .why-image');
  if (cronosVisual) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          cronosVisual.classList.add('lights-on');
          observer.disconnect();
        }
      }, {threshold: .18});
      observer.observe(cronosVisual);
    } else {
      cronosVisual.classList.add('lights-on');
    }
  }

  // Clicking a service prepares the correct WhatsApp form category.
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    const reason=document.getElementById('motivo');
    if (reason) reason.value=link.dataset.service || 'Alquiler de vehículo';
  }));

  // Optional, light motion that does not hide content when scripts are off.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const sections=document.querySelectorAll('.section-header,.service-item,.benefit-card,.why-copy,.faq-grid,.contact-copy');
    sections.forEach(el => el.classList.add('premium-reveal'));
    const observer=new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('is-shown');observer.unobserve(entry.target)}
    }),{threshold:.05,rootMargin:'0px 0px 45px 0px'});
    sections.forEach(el => observer.observe(el));
    document.documentElement.classList.add('fx-ready');
  }

  const form = document.querySelector('#contactForm');
  const vehicle = document.querySelector('#vehiculo');
  document.querySelectorAll('[data-ask]').forEach(button => button.addEventListener('click', () => {
    if (vehicle) vehicle.value = button.dataset.ask || '';
    if (form) form.scrollIntoView({behavior: 'smooth', block: 'center'});
  }));
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [
      'Hola, quiero consultar a RR Motors.',
      '',
      `Nombre: ${data.get('nombre')}`,
      `Teléfono: ${data.get('telefono')}`,
      `Consulta: ${data.get('motivo')}`,
    ];
    for (const [field, label] of [['vehiculo','Vehículo'],['turno','Turno'],['mensaje','Detalle']]) {
      const value = String(data.get(field) || '').trim();
      if (value) lines.push(`${label}: ${value}`);
    }
    const url = 'https://wa.me/5493517059319?text=' + encodeURIComponent(lines.join('\n'));
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.assign(url);
  });
})();
