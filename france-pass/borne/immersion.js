(() => {
'use strict';
const root=document.getElementById('fp-kiosk');if(!root)return;
const base=new URL('.',document.currentScript.src),asset=s=>new URL(s,base).href;
const css=document.createElement('link');css.rel='stylesheet';css.href=asset('immersion.css');document.head.append(css);
root.innerHTML='<div class="fp-k-stick"><div class="fp-k-scene"><div class="fp-k-screen"><div class="fp-k-top"><img class="fp-k-logo" alt="France Pass"><span class="fp-k-micro">Mobilité</span></div><div class="fp-k-main"></div><div class="fp-k-fictif">Expérience fictive · France Pass</div></div></div><button type="button" class="fp-k-access">Approcher de la borne →</button></div>';
const stick=root.querySelector('.fp-k-stick'),scene=root.querySelector('.fp-k-scene'),screen=root.querySelector('.fp-k-screen'),main=root.querySelector('.fp-k-main'),access=root.querySelector('.fp-k-access');
root.querySelector('.fp-k-logo').src=asset('../branding/logo.png');
const simple=matchMedia('(max-width:650px), (prefers-reduced-motion:reduce)');const solo=root.classList.contains('fp-k-solo');
let entered=solo, scheduled=false, step='accueil';
function button(action,label,alternate=false){return '<button type="button" class="fp-k-btn '+(alternate?'fp-k-alt':'')+'" data-k="'+action+'">'+label+'</button>';}
function draw(){
 scheduled=false;
 const w=stick.clientWidth,h=stick.clientHeight;if(!w||!h)return;
 const r=root.getBoundingClientRect(),top=stick.getBoundingClientRect().top;
 const start=Math.max(w/1672,h/941);
 const finish=Math.max(w/610,h/316);
 const progress=entered?1:simple.matches?0:Math.min(1,Math.max(0,(top-r.top)/Math.max(1,(r.height-h)*.72)));
 const t=progress*progress*(3-2*progress),scale=start+(finish-start)*t;
 const cx=(w/2-837*scale),cy=(h/2-430*scale);
 const initialX=Math.max(w-1672*start,Math.min(0,w*.5-837*start));
 const initialY=(h-941*start)/2;
 scene.style.transform='translate('+(initialX*(1-t)+cx*t)+'px,'+(initialY*(1-t)+cy*t)+'px) scale('+scale+')';
 const ready=progress>.985;screen.inert=!ready;access.hidden=ready&&!simple.matches||solo;access.textContent=ready?'Vue de la gare':'Approcher de la borne →';
 if(!ready&&step==='video')screen.querySelector('video')?.pause();
}
function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(draw);}}
access.addEventListener('click',()=>{
 if(simple.matches||solo){entered=!entered;}
 else {
   const stickyTop=parseFloat(getComputedStyle(stick).top)||0;
   const target=window.scrollY+root.getBoundingClientRect().top-stickyTop+(root.offsetHeight-stick.offsetHeight)*.76;
   window.scrollTo({top:target,behavior:'instant'});
 }
 draw();
 if(!screen.inert)main.querySelector('button')?.focus({preventScroll:true});
});
window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);simple.addEventListener('change',queue);new ResizeObserver(queue).observe(stick);
new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)screen.querySelector('video')?.pause();}).observe(stick);
const route='<div class="fp-k-entry" aria-hidden="true"><svg viewBox="0 0 450 88"><path d="M-20 74H49Q69 74 82 55L98 30Q109 12 139 12H228Q254 12 266 33L277 52Q288 70 324 70H368" fill="none" stroke="#719BE0" stroke-width="9"/><circle cx="50" cy="74" r="8" fill="#18345D"/><circle cx="165" cy="12" r="8" fill="#18345D"/><circle cx="323" cy="70" r="8" fill="#18345D"/></svg></div>';
function show(next,focus=true){
 main.querySelector('video')?.pause();step=next;
 screen.classList.toggle('fp-k-picture',next==='video');
 const text=(head,body)=>'<h3 tabindex="-1">'+head+'</h3><p>'+body+'</p>';
 const content={
 accueil:route+text('Votre prochain trajet est offert.','Visionnez trois annonces de 15 secondes pour bénéficier de votre avantage.')+button('video','Profiter de l’offre')+button('normal','Continuer au tarif normal',true),
 normal:text('Vous continuez au tarif normal.','Vous conservez votre temps. Le trajet offert disparaît de votre panier.')+button('revelation','Continuer'),
 ignore:text('Votre avantage n’est plus disponible.','Vous avez ignoré la publicité. Vous devez payer votre ticket au tarif normal.')+button('revelation','Continuer'),
 gagne:text('Félicitations !','Votre trajet vous est offert. Vous avez débloqué votre avantage France Pass.')+button('ticket','Récupérer mon ticket'),
 ticket:'<h3 tabindex="-1">Votre ticket est prêt.</h3><div class="fp-k-ticket"><b>France Pass Mobilité</b><br>Un trajet offert<br><small>Spécimen · sans valeur de transport</small></div>'+button('revelation','Continuer'),
 revelation:text('Et si votre attention devenait une monnaie ?','À la borne, l’accès à un trajet dépend du temps que vous accordez à la publicité. La commercialisation des services collectifs pourrait aussi avoir ce prix.')+'<p><b>Les impôts. Imposer pour mieux s’épargner.</b></p>'+button('accueil','Recommencer'),
 video:'<video class="fp-k-film" aria-label="Programme publicitaire France Pass" muted playsinline></video><div class="fp-k-controls"><small class="fp-k-count">Publicité · 45 s restantes</small><progress max="45" value="0" aria-label="Durée visionnée"></progress>'+button('pause','Mettre en pause',true)+button('ignore','Ignorer la publicité')+'</div>'
 };
 main.innerHTML=content[next];
 if(focus)(main.querySelector('h3')||main.querySelector('button'))?.focus({preventScroll:true});
 if(next!=='video')return;
 const v=main.querySelector('video'),toggle=main.querySelector('[data-k=pause]'),counter=main.querySelector('.fp-k-count'),progress=main.querySelector('progress');
 for(const [ext,type] of [['mp4','video/mp4']]){const s=document.createElement('source');s.src=asset('../motion/programme.'+ext);s.type=type;v.append(s);}
 v.poster=asset('../motion/concours-apercu.webp');
 v.ontimeupdate=()=>{const d=Number.isFinite(v.duration)?v.duration:45;progress.max=d;progress.value=v.currentTime;counter.textContent='Publicité · '+Math.ceil(Math.max(0,d-v.currentTime))+' s restantes';};
 v.onended=()=>{if(v.isConnected)show('gagne');};v.onpause=()=>toggle.textContent='Reprendre';v.onplay=()=>toggle.textContent='Mettre en pause';
 v.play().catch(()=>{toggle.textContent='Lire la publicité';});
}
main.addEventListener('click',e=>{const control=e.target.closest('[data-k]');if(!control)return;const action=control.dataset.k;if(action==='pause'){const v=main.querySelector('video');if(v.paused)v.play().catch(()=>{});else v.pause();}else show(action);});
show('accueil',false);queue();
})();
