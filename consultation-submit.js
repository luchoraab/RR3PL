window.RRConsultation = {
  bind(form, submit) {
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (form.reportValidity()) submit(new FormData(form));
    });
    form.dispatchEvent(new CustomEvent('rr:consultation-ready', { bubbles: true }));
  },

  whatsapp(lines) {
    const url = new URL('https://wa.me/5493517059319');
    url.searchParams.set('text', lines.join('\n'));
    const link = document.createElement('a');
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  },
};
