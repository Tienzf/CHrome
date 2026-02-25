// ===== Tìm bài học (filter) =====
const input = document.getElementById('input-search-lecture');
const list = document.getElementById('lectures-list');
const links = Array.from(list.querySelectorAll('a'));

input.addEventListener('input', () => {
  const q = input.value.trim().toLowerCase();
  links.forEach(a => {
    const ok = a.textContent.toLowerCase().includes(q);
    a.parentElement.style.display = ok ? '' : 'none';
  });
});

// ===== Sync height =====
const videoBlock = document.getElementById('videoBlock');
const listBlock  = document.getElementById('listBlock');

function isMobile(){
  return window.matchMedia('(max-width: 980px)').matches;
}

function syncHeights(){
  if (!videoBlock || !listBlock) return;

  if (isMobile()){
    listBlock.style.height = 'auto';
    const ul = document.getElementById('lectures-list');
    if (ul) ul.style.height = 'auto';
    return;
  }

  const listContent = listBlock.querySelector('.block-content.lecture-flex');
  const searchBox   = listBlock.querySelector('.lecture-search');
  const ul          = document.getElementById('lectures-list');

  if (!listContent || !searchBox || !ul) return;

  const targetH = videoBlock.getBoundingClientRect().height;
  listBlock.style.height = targetH + 'px';

  const contentH = listContent.getBoundingClientRect().height;

  const searchH = searchBox.getBoundingClientRect().height;
  const searchStyle = getComputedStyle(searchBox);
  const searchMarginBottom = parseFloat(searchStyle.marginBottom) || 0;

  const rootStyle = getComputedStyle(document.documentElement);
  const gapBottom = parseFloat(rootStyle.getPropertyValue('--gapBottom')) || 10;

  const ulH = Math.max(140, contentH - searchH - searchMarginBottom - gapBottom);
  ul.style.height = ulH + 'px';
}

window.addEventListener('load', syncHeights);
window.addEventListener('resize', syncHeights);

if ('ResizeObserver' in window && videoBlock){
  const ro = new ResizeObserver(() => syncHeights());
  ro.observe(videoBlock);
}