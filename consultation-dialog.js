(() => {
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;

  const dialogs = new Map();
  for (const form of document.querySelectorAll('form[data-dialog-title]')) {
    const section = form.closest('section[id]');
    if (!section) continue;

    const dialog = document.createElement('dialog');
    dialog.className = 'consultation-dialog';
    dialog.id = form.id + '-dialog';

    const header = document.createElement('header');
    header.className = 'consultation-dialog-header';
    const title = document.createElement('h2');
    title.id = form.id + '-title';
    title.textContent = form.dataset.dialogTitle;
    dialog.setAttribute('aria-labelledby', title.id);

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'consultation-close';
    close.textContent = 'Cerrar';
    close.autofocus = true;
    close.addEventListener('click', () => dialog.close());

    const opener = document.createElement('button');
    opener.type = 'button';
    opener.className = 'consultation-open';
    opener.textContent = form.dataset.dialogTitle;
    opener.setAttribute('aria-haspopup', 'dialog');
    opener.setAttribute('aria-controls', dialog.id);
    opener.addEventListener('click', () => dialog.showModal());

    header.append(title, close);
    form.replaceWith(opener);
    form.removeAttribute('data-reveal');
    dialog.append(header, form);
    dialog.addEventListener('close', () => {
      if (document.activeElement === document.body) opener.focus({ preventScroll: true });
    });
    document.body.append(dialog);
    section.firstElementChild?.classList.add('consultation-layout');
    dialogs.set('#' + section.id, dialog);
    for (const link of document.querySelectorAll('a[href="#' + section.id + '"]')) {
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', dialog.id);
    }
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('a[href^="#"], [data-ask]');
    if (!trigger || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const dialog = dialogs.get(trigger.hasAttribute('data-ask') ? '#contacto' : trigger.getAttribute('href'));
    if (!dialog) return;
    event.preventDefault();
    if (!dialog.open) dialog.showModal();
  });

  const linkedDialog = dialogs.get(location.hash);
  if (linkedDialog) linkedDialog.showModal();
})();
