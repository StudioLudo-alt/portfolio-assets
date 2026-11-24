(() => {
  const mount = document.getElementById('studio-footer');
  if (!mount || mount.childElementCount) return;
  const home = mount.dataset.mode === 'homepage';
  const contact = home ? mount.closest('#contact') : mount;
  if (!home) mount.id = 'contact';
  contact.classList.add('slf-contact');
  mount.innerHTML = `<footer class="slf-footer" aria-label="Contact Studio Ludo">
    ${home ? '' : '<p class="slf-label">Contact</p><h2>Trouvons le bon angle ensemble.</h2>'}
    <div class="slf-intro"><p>Un brief, une mission, une idée à explorer ? La porte du studio est ouverte.</p><img src="./images/pictogramme-studio-ludo.png" alt="" width="136" height="120"></div>
    <div class="slf-actions"><p>Plutôt par mail ? <a href="mailto:chez@studioludo.fr">chez@studioludo.fr</a></p><button type="button" class="slf-primary" aria-expanded="false" aria-controls="slf-panel">Parlons de votre projet</button></div>
    <div id="slf-panel" hidden><form action="https://formspree.io/f/xqpqwwrv" method="post">
    <label>Nom et prénom<input name="name" placeholder="Votre nom" autocomplete="name" required></label>
    <label>Entreprise / Agence<input name="company" placeholder="Votre structure" autocomplete="organization"></label>
    <label>Adresse e-mail<input name="email" type="email" placeholder="Votre adresse e-mail" autocomplete="email" required></label>
    <label>Qu'est-ce qui vous amène ?<select name="subject"><option value="">Choisissez un sujet</option>${["Un projet à imaginer","Une mission freelance","Une opportunité professionnelle","Une collaboration créative","Une intervention pédagogique","Simplement envie d’échanger","Autre chose"].map(s=>'<option>'+s+'</option>').join('')}</select></label>
    <label class="slf-wide">Votre message<textarea name="message" placeholder="Quelques mots suffisent pour commencer..." rows="4" required></textarea></label>
    <input type="text" name="_gotcha" hidden tabindex="-1" autocomplete="off">
    <div class="slf-wide"><button class="slf-primary" type="submit">Ouvrons la conversation</button><p class="slf-note">Vos informations sont uniquement utilisées pour répondre à votre demande.</p><p class="slf-status" role="status" aria-live="polite"></p></div>
    </form></div>
    <div class="slf-bottom"><small>© ${new Date().getFullYear()} Studio Ludo.</small><div><a href="documents/cv-ludovic-leroux.pdf" target="_blank" rel="noopener">Voir mon CV ↗</a><a href="https://www.linkedin.com/in/ludovic-leroux-32715b60">LinkedIn</a><a href="https://www.malt.fr/profile/ludovicleroux1">Malt</a></div></div></footer>`;
  const toggle = mount.querySelector('[aria-controls]');
  const panel = mount.querySelector('#slf-panel');
  const form = panel.querySelector('form');
  const submit = form.querySelector('[type=submit]');
  const status = form.querySelector('[role=status]');
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
      status.textContent='Votre message est bien arrivé au studio. À très vite !';
    } catch {
      status.innerHTML='Un petit contretemps. Réessayez ou écrivez-moi directement. <a href="mailto:chez@studioludo.fr">chez@studioludo.fr</a>';
    } finally {
      submit.disabled=false;
      submit.textContent='Ouvrons la conversation';
    }
  });
})();
