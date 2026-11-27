const careersForm = document.querySelector('#careersForm');
careersForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(careersForm);
  const subject = encodeURIComponent('Postulación Grupo RAAB — ' + data.get('area'));
  const body = encodeURIComponent([
    'Hola, Grupo RAAB:',
    '',
    'Mi nombre es ' + data.get('nombre').trim() + '.',
    'Me interesa trabajar en: ' + data.get('area') + '.',
    data.get('presentacion').trim(),
    '',
    'Adjunto mi CV.',
  ].join('\r\n'));
  window.location.href = careersForm.action + '?subject=' + subject + '&body=' + body;
});
