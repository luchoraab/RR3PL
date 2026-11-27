const gallery = document.querySelector('.gallery');
const controls = document.querySelector('.gallery-controls');
const slides = [...gallery.querySelectorAll('img, video')];
const playback = controls.querySelector('.gallery-play');
const counter = controls.querySelector('.gallery-count');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let visible = false;
let playing = !motion.matches;
let timer;

function show(index) {
  if (slides[current] instanceof HTMLVideoElement) slides[current].pause();
  slides[current].classList.remove('current');
  slides[current].setAttribute('aria-hidden', 'true');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('current');
  slides[current].removeAttribute('aria-hidden');
  counter.textContent = `${current + 1} / ${slides.length}`;
}

gallery.addEventListener('play', () => {
  playing = false;
  schedule();
}, true);

function schedule() {
  clearInterval(timer);
  playback.textContent = playing ? 'Pausar' : 'Reproducir';
  if (playing && visible && !document.hidden) {
    timer = setInterval(() => show(current + 1), 5500);
  }
}

slides.forEach(slide => slide.setAttribute('aria-hidden', 'true'));
show(0);
gallery.classList.add('carousel');
controls.hidden = false;

controls.addEventListener('click', event => {
  const step = event.target.dataset.step;
  if (step) {
    playing = false;
    show(current + Number(step));
  }
  if (event.target === playback) playing = !playing;
  schedule();
});

motion.addEventListener('change', () => {
  if (motion.matches) playing = false;
  schedule();
});
document.addEventListener('visibilitychange', schedule);
new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  schedule();
}, { threshold: .3 }).observe(gallery);
