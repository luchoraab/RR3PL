const teamSection = document.querySelector('.portal-team');

if (teamSection && 'IntersectionObserver' in window) {
  const teamObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !document.documentElement.classList.contains('rr-preintro')) {
      teamSection.classList.add('is-visible');
      teamObserver.disconnect();
    }
  }, { threshold: 0.08 });

  teamObserver.observe(teamSection);
  const intro = document.querySelector('#introScene');
  if (intro && document.documentElement.classList.contains('rr-preintro')) {
    const introObserver = new MutationObserver(() => {
      if (document.documentElement.classList.contains('rr-preintro')) return;
      introObserver.disconnect();
      teamObserver.unobserve(teamSection);
      teamObserver.observe(teamSection);
    });
    introObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
}
