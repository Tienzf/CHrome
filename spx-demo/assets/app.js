// ===== dropdown header (no bootstrap) =====
function closeAllDropdowns(){
  document.querySelectorAll('.dropdown-menu.show')
    .forEach(m => m.classList.remove('show'));

  document.querySelectorAll('[data-toggle="dropdown"][aria-expanded="true"]')
    .forEach(b => b.setAttribute('aria-expanded','false'));
}

document.addEventListener('click', function(e){
  const btn = e.target.closest('[data-toggle="dropdown"]');
  const insideMenu = e.target.closest('.dropdown-menu');

  if(btn){
    e.preventDefault();
    const group = btn.closest('.btn-group');
    const menu = group ? group.querySelector('.dropdown-menu') : null;
    if(!menu) return;

    const isOpen = menu.classList.contains('show');
    closeAllDropdowns();
    if(!isOpen){
      menu.classList.add('show');
      btn.setAttribute('aria-expanded','true');
    }
    return;
  }

  if(!insideMenu) closeAllDropdowns();
});
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeAllDropdowns(); });

// ===== video modal (course cards) =====
function openVideo(el){
  const url = el.getAttribute('data-src') || '';
  if(!url){
    alert('Khoá này chưa có video giới thiệu.');
    return;
  }
  const player = document.getElementById('player');
  const modal = document.getElementById('modal');
  if(!player || !modal) return;

  player.src = url;
  modal.classList.add('open');
  closeAllDropdowns();
}
function closeVideo(e){
  const modal = document.getElementById('modal');
  const player = document.getElementById('player');
  if(!modal || !player) return;

  if(e.target.id === 'modal' || e.target.classList.contains('modal-close')){
    modal.classList.remove('open');
    player.src = '';
  }
}

// ===== bookmark icon =====
function toggleBookmark(wrapper){
  const icon = wrapper.querySelector('i');
  if(!icon) return;
  const saved = icon.classList.contains('fa-solid');
  icon.className = saved ? 'fa-regular fa-bookmark' : 'fa-solid fa-bookmark';
}

// ===== video-course page: lecture filter + sync height =====
function initVideoCoursePage(){
  const input = document.getElementById('input-search-lecture');
  const list = document.getElementById('lectures-list');
  if(input && list){
    const links = Array.from(list.querySelectorAll('a'));
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      links.forEach(a => {
        const ok = a.textContent.toLowerCase().includes(q);
        a.parentElement.style.display = ok ? '' : 'none';
      });
    });
  }

  const videoBlock = document.getElementById('videoBlock');
  const listBlock  = document.getElementById('listBlock');

  function isMobile(){ return window.matchMedia('(max-width: 980px)').matches; }

  function syncHeights(){
    if (!videoBlock || !listBlock) return;

    if (isMobile()){
      listBlock.style.height = 'auto';
      const ul = document.getElementById('lectures-list');
      if (ul) ul.style.height = 'auto';
      return;
    }

    const listContent = listBlock.querySelector('.lecture-flex');
    const searchBox   = listBlock.querySelector('.lecture-search');
    const ul          = document.getElementById('lectures-list');
    if (!listContent || !searchBox || !ul) return;

    const targetH = videoBlock.getBoundingClientRect().height;
    listBlock.style.height = targetH + 'px';

    const contentH = listContent.getBoundingClientRect().height;
    const searchH = searchBox.getBoundingClientRect().height;
    const searchStyle = getComputedStyle(searchBox);
    const searchMarginBottom = parseFloat(searchStyle.marginBottom) || 0;

    const ulH = Math.max(140, contentH - searchH - searchMarginBottom - 10);
    ul.style.height = ulH + 'px';
  }

  window.addEventListener('load', syncHeights);
  window.addEventListener('resize', syncHeights);

  if ('ResizeObserver' in window && videoBlock){
    const ro = new ResizeObserver(() => syncHeights());
    ro.observe(videoBlock);
  }
}

// ===== guide-page: outline smooth + active =====
function initOutline(){
  const outline = document.getElementById('outline');
  if(!outline) return;

  outline.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if(!el) return;
      el.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null,'',id);
    });
  });

  const outlineLinks = Array.from(outline.querySelectorAll('a[href^="#"]'));
  const targets = outlineLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const obs = new IntersectionObserver((entries)=>{
    const visible = entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible) return;

    outlineLinks.forEach(a=>a.classList.remove('active'));
    const active = outlineLinks.find(a => a.getAttribute('href') === '#'+visible.target.id);
    if(active) active.classList.add('active');
  }, { rootMargin: "-20% 0px -70% 0px", threshold: [0.1,0.2,0.35,0.5,0.7,1] });

  targets.forEach(t=>obs.observe(t));
}

// auto init
document.addEventListener('DOMContentLoaded', ()=>{
  initVideoCoursePage();
  initOutline();
});