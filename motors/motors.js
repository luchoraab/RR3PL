(() => {
  'use strict';
  // Carrusel real: navegación manual con flechas, gestos y teclado.
  const track = document.querySelector('#vehicleTrack');
  if (track) {
    const cards = Array.from(track.querySelectorAll('.vehicle-card'));
    const progress = document.querySelector('#fleetProgress');
    const counter = document.querySelector('#fleetIndex');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

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
    }
    document.querySelector('#prev')?.addEventListener('click', () => { step(-1); });
    document.querySelector('#next')?.addEventListener('click', () => { step(1); });
    track.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    });
    track.addEventListener('scroll', sync, {passive:true});
    sync();
  }


  // Brighten the headlights when the car itself comes into view.
  const cronosVisual = document.querySelector('.why-section .why-image');
  if (cronosVisual) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= .45 && !cronosVisual.classList.contains('lights-on')) {
            cronosVisual.classList.add('lights-on');
          }
          if (!entry.isIntersecting) cronosVisual.classList.remove('lights-on');
        }
      }, { threshold: [0, .45] });
      observer.observe(cronosVisual.querySelector('.cronos-stage') || cronosVisual);
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
  const shift = form?.elements.namedItem('turno');
  const reason = form?.elements.namedItem('motivo');
  const rentalFields = form?.querySelectorAll('[data-rental]') ?? [];
  const detail = form?.elements.namedItem('mensaje');

  const updateFields = () => {
    const rental = reason?.value === 'Alquiler de vehículo';
    rentalFields.forEach(label => {
      label.hidden = !rental;
      const field = label.querySelector('input, select');
      field.disabled = !rental;
      field.required = rental && field.name === 'vehiculo';
    });
    if (vehicle) vehicle.required = rental;
    if (detail) detail.required = !rental;
    const label = document.getElementById('motors-detail-label');
    if (label) label.textContent = rental ? 'Mensaje adicional (opcional)' : 'Contanos qué problema tiene el vehículo';
    updateShifts();
  };

  const updateShifts = () => {
    if (!shift) return;
    for (const option of shift.options) {
      option.disabled = (vehicle?.value === 'Volkswagen Gol' && option.value === '24 horas')
        || (vehicle?.value === 'Nissan Versa' && option.value === '12 horas');
    }
    if (shift.selectedOptions[0]?.disabled) shift.value = '';
  };

  vehicle?.addEventListener('change', updateShifts);
  reason?.addEventListener('change', updateFields);
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', updateFields));
  updateFields();
  document.querySelectorAll('[data-ask]').forEach(button => button.addEventListener('click', () => {
    if (vehicle) vehicle.value = button.dataset.ask || '';
    if (reason) reason.value = 'Alquiler de vehículo';
    updateFields();
    if (form && !form.closest('dialog')) form.scrollIntoView({behavior: 'smooth', block: 'center'});
  }));
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [
      'Hola, quiero consultar a RR Motors.',
      '',
      `Nombre: ${data.get('nombre')}`,
      `Consulta: ${data.get('motivo')}`,
    ];
    for (const [field, label] of [['vehiculo','Vehículo'],['fecha','Fecha'],['turno','Turno'],['mensaje','Detalle']]) {
      const value = String(data.get(field) || '').trim();
      if (value) lines.push(`${label}: ${value}`);
    }
    const url = 'https://wa.me/5493517059319?text=' + encodeURIComponent(lines.join('\n'));
    window.location.assign(url);
  });
})();
