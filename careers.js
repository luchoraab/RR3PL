const careersForm = document.querySelector('#careersForm');
window.RRConsultation?.bind(careersForm, data => {
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
