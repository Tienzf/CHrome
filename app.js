// ===== dropdown (no bootstrap needed) =====
function closeAllDropdowns(){
  document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  document.querySelectorAll('[data-toggle="dropdown"][aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded','false'));
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

  if(!insideMenu){
    closeAllDropdowns();
  }
});

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closeAllDropdowns();
});

// ===== your existing functions =====
function openVideo(el){
  const url = el.getAttribute('data-src') || '';
  if(!url){
    alert('Khoá này chưa có video giới thiệu.');
    return;
  }
  document.getElementById('player').src = url;
  document.getElementById('modal').classList.add('open');
  closeAllDropdowns(); // tiện: mở video thì đóng dropdown
}

function closeVideo(e){
  const modal = document.getElementById('modal');
  if(e.target.id === 'modal' || e.target.classList.contains('modal-close')){
    modal.classList.remove('open');
    document.getElementById('player').src = '';
  }
}

function toggleBookmark(wrapper){
  const icon = wrapper.querySelector('i');
  const saved = icon.classList.contains('fa-solid');
  icon.className = saved ? 'fa-regular fa-bookmark' : 'fa-solid fa-bookmark';
}