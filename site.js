document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.navrow');

  if(toggle&&nav){
    toggle.addEventListener('click',()=>{
      const visible=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(visible));
      toggle.setAttribute('aria-label',visible?'Cerrar menú':'Abrir menú');
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Abrir menú');
    }));
  }

  const form=document.querySelector('[data-whatsapp-form]');
  if(form){
    form.addEventListener('submit',ev=>{
      ev.preventDefault();
      if(!form.reportValidity()) return;
      const data=new FormData(form);
      const unit=form.getAttribute('data-unit')||'Grupo RAAB';
      const lines=[`Hola, quiero consultar por ${unit}.`,''];
      for(const [key,value] of data.entries()){
        if(value&&String(value).trim()){
          const label=form.querySelector(`[name="${key}"]`)?.closest('label')?.getAttribute('data-label')||key;
          lines.push(`${label}: ${String(value).trim()}`);
        }
      }
      const url='https://wa.me/543517059319?text='+encodeURIComponent(lines.join('\n'));
      const win=window.open(url,'_blank','noopener,noreferrer');
      if(!win) window.location.href=url;
    });
  }

  document.querySelectorAll('[data-carousel]').forEach(setupCarousel);

  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const elements=document.querySelectorAll('.soft-reveal');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('shown');
        observer.unobserve(entry.target);
      }
    }),{threshold:.08,rootMargin:'0px 0px -20px 0px'});
    elements.forEach(el=>observer.observe(el));
    document.documentElement.classList.add('js-ready');
  }
});

function setupCarousel(root){
  const track=root.querySelector('[data-carousel-track]');
  if(!track) return;

  const prev=root.querySelector('[data-carousel-prev]');
  const next=root.querySelector('[data-carousel-next]');
  const slides=[...track.querySelectorAll('[data-carousel-slide]')];
  if(!slides.length) return;

  const slideSize=()=>{
    const first=slides[0];
    const styles=getComputedStyle(track);
    const gap=parseFloat(styles.columnGap||styles.gap||0);
    return first.getBoundingClientRect().width+gap;
  };

  const move=(direction=1)=>{
    track.scrollBy({left:slideSize()*direction,behavior:'smooth'});
  };

  prev?.addEventListener('click',()=>move(-1));
  next?.addEventListener('click',()=>move(1));

  let auto=null;
  const startAuto=()=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stopAuto();
    auto=setInterval(()=>{
      const remaining=track.scrollWidth-track.clientWidth-track.scrollLeft;
      if(remaining<20){
        track.scrollTo({left:0,behavior:'smooth'});
      }else{
        move(1);
      }
    },4200);
  };
  const stopAuto=()=>{if(auto){clearInterval(auto);auto=null;}};

  track.addEventListener('mouseenter',stopAuto);
  track.addEventListener('mouseleave',startAuto);
  track.addEventListener('focusin',stopAuto);
  track.addEventListener('focusout',startAuto);
  startAuto();
}
