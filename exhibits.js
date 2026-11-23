function makeButton(parent, label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', action);
  parent.append(button);
  return button;
}

document.querySelectorAll('.exhibit').forEach((box, group) => {
  const slides = [...box.querySelectorAll(':scope > .plate')];
  const bar = box.querySelector(':scope > .controlbar');
  if (!bar || !slides.length) return;
  const gallery = box.dataset.mode === 'slider';
  const buttons = [];
  let active = 0, status;
  function select(index, focus = false) {
    active = (index + slides.length) % slides.length;
    slides.forEach((panel, i) => {
      panel.hidden = i !== active;
      if (!gallery) {
        buttons[i].setAttribute('aria-selected', String(i === active));
        buttons[i].tabIndex = i === active ? 0 : -1;
      }
    });
    if (gallery) status.textContent = (active + 1) + ' / ' + slides.length + ' · ' + slides[active].dataset.name;
    else if (focus) buttons[active].focus();
  }
  if (gallery) {
    status = document.createElement('span');
    status.className = 'position';
    status.setAttribute('aria-live', 'polite');
    bar.append(status);
    makeButton(bar, 'Précédent', () => select(active - 1));
    makeButton(bar, 'Suivant', () => select(active + 1));
    let start;
    box.addEventListener('touchstart', e => {
      start = e.target.closest('.frames[data-multiple],button,a,details') ? null : e.touches[0];
    }, {passive:true});
    box.addEventListener('touchend', e => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.clientX;
      const dy = e.changedTouches[0].clientY - start.clientY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) select(active - Math.sign(dx));
      start = null;
    });
  } else {
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', box.querySelector('h2')?.textContent || 'Sélection');
    slides.forEach((panel, i) => {
      const id = 'group-' + group + '-' + i;
      const button = makeButton(bar, panel.dataset.name, () => select(i));
      buttons.push(button);
      button.id = id + '-tab';
      panel.id ||= id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', button.id);
      panel.tabIndex = 0;
      button.addEventListener('keydown', e => {
        const next = {ArrowLeft:i-1, ArrowRight:i+1, Home:0, End:slides.length-1}[e.key];
        if (next !== undefined) { e.preventDefault(); select(next, true); }
      });
    });
  }
  select(0);
});

const viewer = document.createElement('dialog');
viewer.className = 'image-reader';
viewer.setAttribute('aria-label', 'Visuel agrandi');
const tools = document.createElement('div');
const scrollArea = document.createElement('div');
const large = new Image();
tools.className = 'reader-tools';
scrollArea.className = 'reader-scroll';
scrollArea.append(large);
viewer.append(tools, scrollArea);
document.body.append(viewer);
const zoom = makeButton(tools, 'Lire les détails', () => {
  const detailed = viewer.classList.toggle('detailed');
  zoom.textContent = detailed ? 'Vue entière' : 'Lire les détails';
  scrollArea.scrollTo(0,0);
});
const close = makeButton(tools, 'Fermer', () => viewer.close());
viewer.addEventListener('click', e => {if(e.target === viewer) viewer.close()});
function enlarge(img) {
  viewer.classList.remove('detailed');
  zoom.textContent = 'Lire les détails';
  large.src = img.dataset.fullSrc || img.currentSrc || img.src;
  large.alt = img.alt;
  viewer.showModal();
  scrollArea.scrollTo(0, 0);
  close.focus();
}

// Autoplay applies only to storyboard frames. The visitor's scroll always moves the page.
function playStoryboard(frames, controls, images, select, getIndex) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches;
  let inView = false;
  let timer;
  const toggle = makeButton(controls, '', () => {
    paused = !paused;
    sync();
  });
  function sync() {
    clearTimeout(timer);
    toggle.textContent = paused ? 'Lecture' : 'Pause';
    toggle.setAttribute('aria-label', paused ? 'Lancer le storyboard' : 'Mettre le storyboard en pause');
    if (!paused && inView && !document.hidden && !viewer.open && !frames.closest('[hidden]')) {
      timer = setTimeout(() => {
        select((getIndex() + 1) % images.length);
        sync();
      }, 5500);
    }
  }
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
    sync();
  }, {threshold:[0, 0.35]});
  observer.observe(frames);
  motion.addEventListener('change', () => { paused = motion.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  new MutationObserver(sync).observe(viewer, {attributes:true, attributeFilter:['open']});
  const panel = frames.closest('.plate');
  if (panel) new MutationObserver(() => {
    if (panel.hidden) select(0);
    sync();
  }).observe(panel, {attributes:true, attributeFilter:['hidden']});
  sync();
  return () => { paused = true; sync(); };
}

document.querySelectorAll('.frames').forEach(frames => {
  const images = [...frames.querySelectorAll(':scope > img')];
  if (!images.length) return;
  const holder = document.createElement('div');
  const controls = document.createElement('div');
  holder.className = 'frame-holder';
  controls.className = 'frame-controls';
  frames.before(holder);
  holder.append(frames, controls);
  let index = 0;
  const buttons = [];
  const caption = document.createElement('p');
  caption.className = 'frame-caption';
  if (images.some(img => img.dataset.caption)) {
    holder.append(caption);
    caption.setAttribute('aria-live','polite');
  }
  const storyboard = frames.closest('#concepts') && images.length > 1;
  function update() {
    if (!storyboard && frames.clientWidth) index = Math.min(images.length-1, Math.round(frames.scrollLeft / frames.clientWidth));
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    caption.textContent = images[index].dataset.caption || '';
  }
  if (images.length > 1) {
    frames.dataset.multiple = '';
    let pause;
    function selectFrame(i) {
      index = i;
      if (storyboard) images.forEach((img, j) => { img.hidden = j !== i; });
      else frames.scrollTo({left: i * frames.clientWidth, behavior: 'instant'});
      update();
    }
    images.forEach((img, i) => {
      const button = makeButton(controls, String(i + 1), () => {
        if (pause) pause();
        selectFrame(i);
      });
      button.setAttribute('aria-label', 'Vue ' + (i + 1) + ' sur ' + images.length);
      buttons.push(button);
    });
    if (storyboard) {
      frames.classList.add('storyboard');
      caption.setAttribute('aria-live','off');
      selectFrame(0);
      pause = playStoryboard(frames, controls, images, selectFrame, () => index);
    } else {
      frames.addEventListener('scroll', update, {passive:true});
      new ResizeObserver(update).observe(frames);
    }
  }
  if (typeof viewer.showModal === 'function') {
    const open = makeButton(controls, 'Agrandir', () => enlarge(images[index]));
    open.className = 'enlarge';
    open.setAttribute('aria-haspopup','dialog');
  }
  update();
});
