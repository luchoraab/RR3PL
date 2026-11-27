(() => {
  const button = document.querySelector('[data-floating-menu]');
  const nav = button && document.getElementById(button.getAttribute('aria-controls'));
  if (!nav) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  button.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !nav.classList.contains('open') ||
        document.querySelector('dialog[open]')) return;
    setOpen(false);
    button.focus({ preventScroll: true });
  });
})();
