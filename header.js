(() => {
  const previous = document.currentScript.previousElementSibling;
  if (!previous || previous.tagName !== 'HEADER') return;

  const logo = previous.querySelector('img')?.cloneNode(true);
  const header = document.createElement('header');
  const root = header.attachShadow({ mode: 'open' });

  const page = location.pathname.split('/').pop() || 'index.html';
  const home = page === 'index.html';
  const homeLink = id => home ? `#${id}` : `./index.html#${id}`;

  const projects = [
    ['legalstart.html', 'LegalStart'],
    ['decathlon-location.html', 'Decathlon Location'],
    ['airbnb-adventure.html', 'Airbnb Adventure'],
    ['myfitrace.html', 'MyFitRace'],
    ['happyvore.html', 'HappyVore'],
    ['ligue-contre-le-cancer.html', 'Ligue contre le cancer'],
    ['france-pass.html', 'France Pass']
  ];

  const catalogue = 'ludotheque.html';
  const inCatalogue = page === catalogue || projects.some(([file]) => file === page);
  const current = file => file === page ? ' aria-current="page"' : '';

  root.innerHTML = `
    <style>
      :host {
        all: initial !important;
        display: block !important;
        position: relative !important;
        z-index: 20 !important;
        font: 600 1rem/1.35 "DM Sans", Arial, sans-serif !important;
        color: #10182e !important;
      }
      *, *::before, *::after { box-sizing: border-box; }
      .bar {
        background: #fff;
        border-bottom: 1px solid #10182e24;
      }
      .inner {
        position: relative;
        width: 91%;
        max-width: 1440px;
        min-height: 5.2rem;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
      }
      a, button {
        color: inherit;
        font: inherit;
      }
      a { text-decoration: none; }
      button {
        background: transparent;
        border: 0;
        cursor: pointer;
      }
      a:focus-visible, button:focus-visible {
        outline: 2px solid #245bea;
        outline-offset: 3px;
      }
      .brand {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        font: 800 1.55rem/1 "Bricolage Grotesque", Arial, sans-serif;
        letter-spacing: -.075em;
      }
      .brand img { width: 2.05rem; height: auto; margin-right: .55rem; }
      .brand span { color: #245bea; }
      nav { display: flex; align-items: center; gap: clamp(.8rem, 2vw, 2rem); }
      nav a { font-size: .94rem; }
      nav a:hover, nav a[aria-current], nav a.section-active {
        color: #245bea;
        text-decoration: underline;
        text-underline-offset: .3em;
      }
      .group { position: relative; }
      .group-line { display: flex; align-items: center; }
      .toggle { min-width: 2rem; min-height: 2.75rem; }
      .toggle::before {
        content: "";
        display: inline-block;
        width: .45rem;
        height: .45rem;
        border: solid currentColor;
        border-width: 0 1.5px 1.5px 0;
        transform: translateY(-.12rem) rotate(45deg);
      }
      .toggle[aria-expanded="true"]::before {
        transform: translateY(.1rem) rotate(225deg);
      }
      .sub, .mobile-panel {
        background: white;
        border: 1px solid #10182e24;
        box-shadow: 0 10px 30px #10182e12;
      }
      .sub {
        position: absolute;
        top: 100%;
        left: -.8rem;
        min-width: 13rem;
        padding: .4rem;
      }
      .sub a { display: block; padding: .65rem .8rem; }
      .menu-button { display: none; }
      [hidden] { display: none !important; }
      @media (max-width: 880px) {
        .inner { min-height: 4.35rem; }
        .menu-button { display: block; min-height: 2.75rem; }
        nav {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          width: min(19rem, 100%);
          max-height: 75vh;
          overflow-y: auto;
          padding: .75rem 1rem;
          background: white;
          border: 1px solid #10182e24;
        }
        nav.open { display: grid; gap: 0; }
        nav > a, .group-line > a { padding: .7rem 0; }
        .group-line { justify-content: space-between; }
        .sub {
          position: static;
          border: 0;
          border-left: 2px solid #245bea;
          box-shadow: none;
          margin: 0 0 .5rem .25rem;
        }
      }
    </style>

    <div class="bar">
      <div class="inner">
        <a class="brand" href="${homeLink('hero')}" aria-label="Studio Ludo, accueil">
          Studio Ludo<span>.</span>
        </a>
        <button class="menu-button" type="button"
                aria-expanded="false" aria-controls="navigation">Menu</button>

        <nav id="navigation" aria-label="Navigation principale">
          <a href="${homeLink('hero')}"${current('index.html')}>Accueil</a>

          <div class="group">
            <div class="group-line">
              <a href="./${catalogue}" class="${inCatalogue ? 'section-active' : ''}"
                 ${current(catalogue)}>Ludothèque</a>
              <button class="toggle" type="button" aria-label="Projets de la Ludothèque"
                      aria-expanded="false" aria-controls="projects"></button>
            </div>
            <div class="sub" id="projects" hidden>
              ${projects.map(([file, name]) =>
                `<a href="./${file}"${current(file)}>${name}</a>`
              ).join('')}
            </div>
          </div>

          <a href="${homeLink('methode')}">Méthode</a>
          <a href="${homeLink('apropos')}">À propos</a>
          <a href="${homeLink('expertises')}">Expertises</a>
          <a href="${homeLink('contact')}">Contact</a>
        </nav>
      </div>
    </div>
  `;

  if (logo) root.querySelector('.brand').prepend(logo);
  previous.replaceWith(header);

  const nav = root.querySelector('nav');
  const menu = root.querySelector('.menu-button');
  const toggle = root.querySelector('.toggle');
  const sub = root.querySelector('.sub');

  function showProjects(open) {
    sub.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  }

  function showMenu(open) {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    if (!open) showProjects(false);
  }

  menu.addEventListener('click', () => showMenu(!nav.classList.contains('open')));
  toggle.addEventListener('click', () => showProjects(sub.hidden));

  root.addEventListener('click', event => {
    if (event.target.closest('a')) showMenu(false);
  });
  document.addEventListener('click', event => {
    if (!event.composedPath().includes(header)) showMenu(false);
  });
  header.addEventListener('focusout', event => {
    if (!root.contains(event.relatedTarget) && !header.contains(event.relatedTarget)) showMenu(false);
  });
  root.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!sub.hidden) {
      showProjects(false);
      toggle.focus();
    } else if (nav.classList.contains('open')) {
      showMenu(false);
      menu.focus();
    }
  });
})();
