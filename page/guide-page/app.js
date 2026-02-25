// Smooth scroll
document.querySelectorAll('#outline a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if(!el) return;
    el.scrollIntoView({behavior:'smooth', block:'start'});
    history.replaceState(null,'',id);
  });
});

// Outline active on scroll
const outlineLinks = Array.from(document.querySelectorAll('#outline a[href^="#"]'));
const targets = outlineLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const obs = new IntersectionObserver((entries)=>{
  const visible = entries
    .filter(x=>x.isIntersecting)
    .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];

  if(!visible) return;

  outlineLinks.forEach(a=>a.classList.remove('active'));
  const active = outlineLinks.find(a => a.getAttribute('href') === '#'+visible.target.id);
  if(active) active.classList.add('active');
}, { rootMargin: "-20% 0px -70% 0px", threshold: [0.1,0.2,0.35,0.5,0.7,1] });

targets.forEach(t=>obs.observe(t));