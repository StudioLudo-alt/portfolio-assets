(() => {
  const mount = document.getElementById('studio-footer');
  if (!mount || mount.childElementCount) return;
  const home = mount.dataset.mode === 'homepage';
  if (home) mount.closest('#contact').replaceWith(mount);
  mount.id = 'contact';
  const root = mount.attachShadow({mode:'open'});
  const contact = document.createElement('div');
  contact.className = 'slf-contact';
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = './footer.css?v=signature-2';
  root.append(sheet, contact);
  contact.innerHTML = `<footer class="slf-footer" aria-label="Contact Studio Ludo">
    <p class="slf-label">Contact</p>
    <div class="slf-heading"><h2>Trouvons le bon angle ensemble.</h2><a href="./index.html#hero" class="slf-brand" aria-label="Studio Ludo, accueil"><img src="data:image/png;base64,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" alt=""><span>Studio Ludo<b>.</b></span></a></div>
    <div class="slf-intro"><p>Un brief, une mission, une idée à explorer ? La porte du studio est ouverte.</p></div>
    <div class="slf-actions"><p>Plutôt par mail ? <a href="mailto:chez@studioludo.fr">chez@studioludo.fr</a></p><button type="button" class="slf-primary" aria-expanded="false" aria-controls="slf-panel">Parlons de votre projet</button></div>
    <div id="slf-panel" hidden><form action="https://formspree.io/f/xqpqwwrv" method="post">
    <label>Nom et prénom<input name="name" placeholder="Votre nom" autocomplete="name" required></label>
    <label>Entreprise / Agence<input name="company" placeholder="Votre structure" autocomplete="organization"></label>
    <label>Adresse e-mail<input name="email" type="email" placeholder="Votre adresse e-mail" autocomplete="email" required></label>
    <label>Qu'est-ce qui vous amène ?<select name="subject"><option value="">Choisissez un sujet</option>${["Un projet à imaginer","Une mission freelance","Une opportunité professionnelle","Une collaboration créative","Une intervention pédagogique","Simplement envie d’échanger","Autre chose"].map(s=>'<option>'+s+'</option>').join('')}</select></label>
    <label class="slf-wide">Votre message<textarea name="message" placeholder="Quelques mots suffisent pour commencer..." rows="4" required></textarea></label>
    <input type="text" name="_gotcha" hidden tabindex="-1" autocomplete="off">
    <div class="slf-wide"><button class="slf-primary" type="submit">Ouvrons la conversation</button><p class="slf-note">Vos informations sont uniquement utilisées pour répondre à votre demande.</p><p class="slf-status" role="status" aria-live="polite"></p></div>
    </form><p class="slf-success" tabindex="-1" hidden></p></div>
    <div class="slf-bottom"><small>© ${new Date().getFullYear()} Studio Ludo.</small><div><a href="documents/cv-ludovic-leroux.pdf" target="_blank" rel="noopener">Voir mon CV ↗</a><a href="https://www.linkedin.com/in/ludovic-leroux-32715b60">LinkedIn</a><a href="https://www.malt.fr/profile/ludovicleroux1">Malt</a></div></div></footer>`;
  const toggle = contact.querySelector('[aria-controls]');
  const panel = contact.querySelector('#slf-panel');
  const form = panel.querySelector('form');
  const submit = form.querySelector('[type=submit]');
  const status = form.querySelector('[role=status]');
  const success = panel.querySelector('.slf-success');
  const reveal = () => contact.classList.remove('armed');
  if (matchMedia('(min-width:801px) and (hover:hover) and (prefers-reduced-motion:no-preference)').matches) contact.classList.add('armed');
  toggle.addEventListener('pointerenter', reveal);
  contact.addEventListener('focusin', reveal);
  function show(open) {
    reveal();
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded',String(open));
    toggle.textContent = open ? 'Refermer le formulaire' : 'Parlons de votre projet';
    if (!open) {toggle.focus(); return;}
    if (form.hidden) {form.hidden=false; success.hidden=true;}
    requestAnimationFrame(() => {
      if (panel.hidden) return;
      form.elements.namedItem('name').focus({preventScroll:true});
      panel.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
    });
  }
  toggle.addEventListener('click',()=>show(panel.hidden));
  document.addEventListener('click',e=>{
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.composedPath().find(node=>node instanceof HTMLAnchorElement);
    if (!link || link.origin!==location.origin || link.hash!=='#contact') return;
    e.preventDefault();
    if(location.hash!=='#contact') history.pushState(null,'','#contact');
    show(true);
  });
  function fromHash(){if(location.hash==='#contact') show(true);}
  window.addEventListener('hashchange',fromHash);
  fromHash();
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(submit.disabled || !form.reportValidity()) return;
    const data = new FormData(form);
    data.set('source_page',document.title);
    data.set('source_url',location.origin+location.pathname);
    submit.disabled=true;
    submit.textContent='Votre message est en route…';
    status.textContent='';
    try {
      const res=await fetch(form.action,{method:'POST',headers:{Accept:'application/json'},body:data});
      if(!res.ok) throw new Error('Envoi refusé');
      form.reset();
      form.hidden=true;
      success.hidden=false;
      success.textContent='Merci, votre message est bien arrivé chez Studio Ludo. Je vous recontacte très vite.';
      if (!panel.hidden) success.focus();
    } catch {
      status.innerHTML='Un petit contretemps. Réessayez ou écrivez-moi directement. <a href="mailto:chez@studioludo.fr">chez@studioludo.fr</a>';
    } finally {
      submit.disabled=false;
      submit.textContent='Ouvrons la conversation';
    }
  });
})();
