document.querySelectorAll('.fp-deck').forEach(deck => {
  const slides = [...deck.querySelectorAll('[data-slide]')];
  const status = deck.querySelector('[aria-live]');
  let active = 0;
  function move(delta) {
    slides[active].hidden = true;
    active = (active + delta + slides.length) % slides.length;
    slides[active].hidden = false;
    status.textContent = (active + 1) + ' / ' + slides.length;
  }
  deck.querySelectorAll('[data-dir]').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.dir))));
  deck.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  let start;
  deck.addEventListener('touchstart', event => {start = event.changedTouches[0];}, {passive:true});
  deck.addEventListener('touchend', event => {
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.clientX;
    const dy = event.changedTouches[0].clientY - start.clientY;
    if (Math.abs(dx) > Math.max(55, Math.abs(dy)*1.4)) move(dx < 0 ? 1 : -1);
    start = null;
  }, {passive:true});
});
const tabs = [...document.querySelectorAll('[data-series]')];
tabs.forEach(button => button.addEventListener('click', () => {
  tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
  document.querySelectorAll('[data-panel]').forEach(panel => {panel.hidden = panel.dataset.panel !== button.dataset.series;});
}));
document.addEventListener('play', event => {
  if (event.target.tagName === 'VIDEO') document.querySelectorAll('video').forEach(video => {
    if (video !== event.target && !video.paused) video.pause();
  });
}, true);
