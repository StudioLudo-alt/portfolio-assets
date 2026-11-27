'use strict';
const main=document.querySelector('main'), modal=document.querySelector('#modal'), dialogBody=document.querySelector('#dialog-content');
const people=[
 {name:'Alex Martin',role:'Conjoint'}, {name:'Lou Martin',role:'Enfant'}, {name:'Morgan Martin',role:'Enfant'}, {name:'Sacha Martin',role:'Enfant'}, {name:'Charlie Martin',role:'Parent'}, {name:'Noa Durand',role:'Ami · autre foyer',outside:true}];
const context={
 accueil:'Et si vous deviez souscrire un abonnement pour chaque service essentiel de votre quotidien ?',
 offres:'L’accès aux services collectifs ne devrait pas dépendre de votre formule commerciale.',
 espace:'Et si chaque geste du quotidien nécessitait une transaction ?',
 services:'Imaginez devoir sélectionner les services auxquels vous souhaitez pouvoir accéder.',
 foyer:'La solidarité ne se limite pas à votre foyer.',
 factures:'Le financement collectif permet de partager une partie des coûts plutôt que de les supporter intégralement seul.'};
const createState=()=>({plan:0,profile:0,packs:[],options:[],members:[],ledger:[],balance:catalogue.initialBalance,usage:'consult',quantity:1,demand:true});
let state=createState();
const plan=()=>catalogue.plans[state.plan],profile=()=>catalogue.profiles[state.profile];
const packBy=id=>catalogue.packs.find(p=>p.id===id);
const itemBy=id=>catalogue.usage.find(p=>p.id===id);
const hasPack=id=>state.packs.includes(id),hasOption=id=>state.options.includes(id);
const included=id=>state.plan===2&&['fast','noads','eduads','priority'].includes(id)?'Inclus avec Premium':(id==='eduads'&&hasOption('noads')?'Inclus dans Sans publicité':'');
const extras=()=>Math.max(0,1+state.members.length-profile().capacity);
const adjustment=()=>profile().percent?-Math.round(plan().cents*profile().percent/100):profile().adjustment;
const core=()=>[[plan().name,plan().cents],[profile().name,adjustment()]];
function additions(){return [...catalogue.packs.filter(p=>hasPack(p.id)).map(p=>[p.pack,p.cents]),...catalogue.options.filter(o=>hasOption(o.id)&&!included(o.id)).map(o=>[o.name,o.cents]),...(extras()?[['Places supplémentaires × '+extras(),extras()*catalogue.extraMember]]:[])];}
const recurring=()=>[...core(),...additions()].reduce((sum,line)=>sum+line[1],0);
const moneyRows=rows=>'<ul class="bill">'+rows.map(([label,v])=>'<li><span>'+label+'</span><strong>'+euros(v)+'</strong></li>').join('')+'</ul>';
const icon=p=>'<img class="small-icon" alt="" src="../branding/icone-'+p.id+'.svg">';
const card=p=>'<img class="dashcard" src="../branding/carte-'+p.name.toLowerCase()+'.png" alt="Carte '+p.name+' de Camille Martin">';
const btn=(key,label,sub=false,attr='')=>'<button type="button" class="'+(sub?'sub':'button')+'" data-action="'+key+'" '+attr+'>'+label+'</button>';
const a=(route,label,sub=false)=>'<a class="'+(sub?'sub':'button')+'" href="#'+route+'">'+label+'</a>';
const head=(tag,title,sub)=>'<p class="ey">'+tag+'</p><h1 class="page-title">'+title+'</h1><p class="intro">'+sub+'</p>';
const section=(title,body)=>'<section class="section"><h2>'+title+'</h2>'+body+'</section>';
const wrap=(cls,body)=>'<div class="'+cls+'">'+body+'</div>';
const nowDate='18 avril · mois simulé';
function quote(item,qty,demand=state.demand){
 const base=item.cents*qty;
 const surcharge=item.id==='rescue'&&demand&&!hasOption('surge')?Math.round(base*catalogue.surgePercent/100):0;
 const eligible=item.id!=='rescue'&&item.id!=='school';
 const formula=eligible?plan().discount:0,pack=hasPack(item.cat)?catalogue.packDiscount:0;
 const discount=item.id==='help'&&state.plan>0?100:Math.max(formula,pack);
 const saving=Math.round((base+surcharge)*discount/100);
 return {label:item.label,cat:item.cat,qty,unit:item.unit,unitPrice:item.cents,base,surcharge,saving,discount,date:nowDate,due:base+surcharge-saving};
}
function chargeText(q){return q.qty+' × '+euros(q.unitPrice)+' / '+q.unit+(q.surcharge?' · majoration +'+euros(q.surcharge):'')+(q.saving?' · remise '+q.discount+' % (−'+euros(q.saving)+')':'');}
function move(entry){state.ledger.push(entry);state.balance+=entry.type==='credit'?entry.due:-entry.due;}
function history(rows){
 if(!rows.length)return '<p class="help">Aucun mouvement pour cette période.</p>';
 return '<ul class="history">'+rows.slice().reverse().map(t=>'<li><div class="flex-price"><span>'+t.label+'</span><strong>'+(t.type==='credit'?'+':'−')+euros(t.due)+'</strong></div><small>'+t.date+' · '+(t.type==='usage'?packBy(t.cat).name+' · '+chargeText(t):t.type==='credit'?'Recharge du portefeuille':'Frais ponctuels')+'</small></li>').join('')+'</ul>';
}
function home(){return '<section class="hero"><div><p class="ey">Carte multiservices</p><h1>Vos services à la carte.</h1><p>Choisissez les services qui vous correspondent et composez votre abonnement en toute liberté.</p><div class="actions">'+a('offres','Découvrir nos offres')+a('espace','Mon espace client',true)+'</div><strong>Tous vos services accessibles dès '+euros(catalogue.plans[0].cents)+'/mois.</strong><small>Hors packs, options, consommations et frais éventuels.</small></div><img src="../branding/cartes-visuel.webp" alt="Les trois cartes multiservices France Pass"></section>'+section('De quels services avez-vous besoin ?',wrap('tiles',catalogue.packs.map(p=>'<div class="tile" style="--sector:'+p.color+'"><a href="#services" class="label">'+icon(p)+p.name+' ↗</a><p>'+p.line+'</p></div>').join('')));}
function offers(){
 return head('Abonnements','Nos offres','Chaque formule donne accès aux six univers. Choisissez ensuite le profil et les packs de votre foyer.')+wrap('plans',catalogue.plans.map((p,i)=>'<article class="plan '+(state.plan===i?'active':'')+'">'+card(p)+'<h2>'+p.name+'</h2><p>'+p.line+'</p><p class="price">'+euros(p.cents)+'/mois</p><ul>'+p.benefits.map(x=>'<li>'+x+'</li>').join('')+'</ul>'+btn('plan:'+i,state.plan===i?'Formule sélectionnée':'Choisir '+p.name,false,'aria-pressed="'+(state.plan===i)+'"')+'</article>').join(''))+
 section('Votre profil',wrap('panel',wrap('choices',catalogue.profiles.map((p,i)=>btn('profile:'+i,p.name,true,'aria-pressed="'+(state.profile===i)+'"')).join(''))+'<p>'+profile().help+' · '+profile().capacity+' place'+(profile().capacity>1?'s':'')+' dans le foyer.</p><details><summary>Comparer les cinq profils</summary>'+catalogue.profiles.map(p=>'<p><strong>'+p.name+'</strong> · '+p.help+'</p>').join('')+'</details><p class="total">'+euros(recurring())+'/mois</p>'+a('services','Personnaliser mon abonnement')));
}
function usageModule(){
 const q=quote(itemBy(state.usage),state.quantity);
 return '<article class="panel" id="usage-box"><h2>Simulez votre quotidien.</h2><label for="usage">Prestation</label><select id="usage">'+catalogue.usage.map(t=>'<option value="'+t.id+'" '+(t.id===state.usage?'selected':'')+'>'+t.label+'</option>').join('')+'</select><label for="qty">Quantité ('+q.unit+')</label><input id="qty" required type="number" min="1" max="999" step="1" value="'+state.quantity+'">'+(q.cat==='secours'?'<label class="check"><input id="demand" type="checkbox" '+(state.demand?'checked':'')+'> Forte demande simulée (+50 % hors protection)</label>':'')+'<p class="help" id="quote">'+chargeText(q)+'</p><p class="price" id="due">'+euros(q.due)+'</p>'+btn('buy','Simuler cette consommation')+'<details><summary>Comment le tarif est-il calculé ?</summary><p>La remise de votre formule et celle de votre pack ne se cumulent pas. Nous appliquons la plus avantageuse. Les prestations scolaires hors forfait et les secours peuvent bénéficier de la remise du pack, mais sont exclus de la remise de formule.</p><p>L’assistance administrative est incluse avec Confort et Premium. La protection contre les majorations annule la hausse des tarifs de secours.</p></details></article>';
}
function dashboard(){
 return head('Espace client','Bonjour Camille.','Voici votre carte, votre budget et les derniers mouvements du mois simulé.')+wrap('cols','<article class="panel">'+card(plan())+'<div class="badge">'+plan().name+' · '+profile().name+'</div><p>Solde disponible</p><p class="total">'+euros(state.balance)+'</p>'+btn('credit','Recharger ma carte')+'<p>'+euros(recurring())+'/mois · '+state.packs.length+' pack(s) actif(s)</p></article>'+usageModule())+
 section('Dernières transactions',wrap('panel',history(state.ledger.slice(-5))))+section('Votre abonnement',wrap('actions',a('services','Mes services',true)+a('foyer','Mon foyer',true)+a('factures','Mes factures',true)));
}
function services(){
 const grid=catalogue.packs.map(p=>'<article class="tile" style="--sector:'+p.color+'"><div class="label">'+icon(p)+p.name+'</div><h3>'+p.pack+'</h3><p>'+p.line+'</p><p class="help">'+p.help+'</p><p><strong>'+catalogue.packDiscount+' %</strong> sur les usages de cet univers. La meilleure remise s’applique.</p><p class="price">'+euros(p.cents)+'/mois</p>'+btn('pack:'+p.id,hasPack(p.id)?'Pack actif · Désactiver':'Activer le pack',hasPack(p.id),'aria-pressed="'+hasPack(p.id)+'"')+btn('usecat:'+p.id,'Explorer les usages',true)+'</article>').join('');
 const options=catalogue.options.map(o=>{const inc=included(o.id);return '<article class="panel"><h3>'+o.name+'</h3><p>'+o.line+'</p><p class="price">'+(inc||euros(o.cents)+'/mois')+'</p>'+btn('opt:'+o.id,inc?'Inclus':(hasOption(o.id)?'Désactiver':'Activer'),true,inc?'disabled':'aria-pressed="'+hasOption(o.id)+'"')+'</article>';}).join('');
 return head('Catalogue','Mes services','Composez votre abonnement. Les prestations restent également disponibles à l’unité.')+wrap('tiles',grid)+section('Mes options',wrap('tiles',options+'<article class="panel"><h3>Une place de plus</h3><p>Ajoutez un bénéficiaire de votre foyer.</p><p class="price">'+euros(catalogue.extraMember)+'/mois</p>'+a('foyer','Gérer mon foyer',true)+'</article>'))+section('Carte supplémentaire',wrap('panel','<p>Commandez une carte pour votre foyer. Paiement unique prélevé sur le portefeuille.</p>'+btn('card','Commander · '+euros(catalogue.extraCard),true)))+section('Total de l’abonnement',wrap('panel','<p class="total">'+euros(recurring())+'/mois</p>'+a('factures','Voir ma facture')));
}
function household(){
 const active=1+state.members.length, capacity=profile().capacity;
 const person=(name,role,content)=>'<article class="person"><div class="avatar">'+name.split(' ').map(n=>n[0]).join('')+'</div><h3>'+name+'</h3><p>'+role+'</p>'+content+'</article>';
 return head('Partage de compte','Mon foyer','Les services de votre abonnement sont réservés aux membres autorisés de votre foyer.')+wrap('panel','<strong>'+profile().name+' · '+capacity+' place(s) incluse(s)</strong><p>'+active+' bénéficiaire(s) actif(s) · '+Math.max(0,capacity-active)+' place(s) incluse(s) disponible(s) · '+extras()+' place(s) supplémentaire(s) facturée(s).</p>')+
 section('Bénéficiaires',wrap('people',person('Camille Martin','Titulaire','<span class="badge">Profil actif</span>')+people.map((p,i)=>person(p.name,p.role,btn((state.members.includes(i)?'remove:':'member:')+i,state.members.includes(i)?'Retirer du foyer':'Ajouter ce profil',true))).join('')));
}
function invoices(){
 const use=state.ledger.filter(t=>t.type==='usage'),fees=state.ledger.filter(t=>t.type==='card'),sum=rows=>rows.reduce((a,t)=>a+t.due,0);
 return head('Budget','Mes factures','Période fictive d’avril · Camille Martin')+wrap('cols',wrap('panel','<h2>Abonnement principal</h2>'+moneyRows(core()))+wrap('panel','<h2>Packs et options</h2>'+(additions().length?moneyRows(additions()):'<p>Aucun supplément mensuel.</p>')+catalogue.options.filter(o=>included(o.id)).map(o=>'<p class="help">'+o.name+' · '+included(o.id)+'</p>').join('')))+
 section('Consommations à l’usage',wrap('panel',use.length?use.map(t=>'<article><div class="label">'+icon(packBy(t.cat))+t.label+'</div><div class="flex-price"><small>'+t.date+' · '+packBy(t.cat).name+' · '+chargeText(t)+'</small><strong>'+euros(t.due)+'</strong></div></article>').join(''):'Aucune prestation consommée.'))+
 section('Historique des factures',wrap('panel','<details><summary>Mars · Facture réglée · Exemple fictif</summary>'+moneyRows([['Formule Essentiel',1999],['Voirie · 240 km × 0,15 €',3600],['Éclairage public · 20 soirées × 0,99 €',1980],['Bibliothèque · 2 emprunts × 3,90 €',780],['Assistance administrative · 4 min × 2,99 €',1196],['Consultation médicale · 1 × 49,90 €',4990],['Total réglé en mars',14545]])+'<small>Exemple archivé, indépendant de votre simulation d’avril.</small></details>'))+section('Synthèse du mois',wrap('panel',moneyRows([['Abonnements mensuels',recurring()],['Consommations',sum(use)],['Frais ponctuels · '+fees.length+' carte(s)',sum(fees)]])+'<p>Total des dépenses du mois</p><p class="total">'+euros(recurring()+sum(use)+sum(fees))+'</p><p>Projection annuelle des abonnements · <strong>'+euros(12*recurring())+'</strong></p><small>Les recharges alimentent le solde. Seuls les achats et les abonnements entrent dans les dépenses.</small>'));
}
const views={accueil:home,offres:offers,espace:dashboard,services,foyer:household,factures:invoices};
function render(message='',focus=''){
 const key=Object.hasOwn(views,location.hash.slice(1))?location.hash.slice(1):'accueil';
 document.querySelectorAll('nav a').forEach(el=>el.getAttribute('href')==='#'+key?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current'));
 main.innerHTML='<div role="status" class="status">'+message+'</div>'+views[key]()+'<aside class="note"><p class="ey">Derrière la fiction</p><p><strong>'+context[key]+'</strong></p>'+(key==='foyer'?'<p>La mutualisation dépasse les profils autorisés à partager un abonnement. Les impôts. Imposer pour mieux s’épargner.</p>':'')+'<a href="../../france-pass.html#faire-comprendre">Comprendre la campagne →</a></aside>';
 if(focus){const el=main.querySelector(focus);if(el){if(el.tagName==='H1')el.tabIndex=-1;el.focus({preventScroll:true});}}
}
function dialog(title,content){dialogBody.innerHTML='<h2 id="modal-title">'+title+'</h2>'+content;if(!modal.open)modal.showModal();}
function close(){if(modal.open)modal.close();}
function showCredit(){dialog('Recharger ma carte','<label for="amount">Montant fictif</label><select id="amount">'+catalogue.recharges.map(v=>'<option value="'+v+'">'+euros(v)+'</option>').join('')+'</select>'+btn('applyCredit','Valider la recharge'));}
function insufficient(){dialog('Solde insuffisant','<p>Votre solde fictif ne couvre pas cet achat. Vous pouvez créditer votre portefeuille ou poursuivre votre visite.</p>'+btn('credit','Recharger ma carte'));}
function setProfile(i){state.profile=i;close();render('Profil '+profile().name+' sélectionné.');}
function changeProfile(i){const newExtras=Math.max(0,1+state.members.length-catalogue.profiles[i].capacity);
 if(newExtras>extras()){dialog('Des places deviendraient payantes','<p>Avec ce profil, '+newExtras+' place(s) de votre foyer coûteraient '+euros(newExtras*catalogue.extraMember)+'/mois en supplément.</p>'+btn('confirmProfile:'+i,'Accepter le changement'));return;}
 setProfile(i);
}
function setMember(i,paid=false){
 const person=people[i];
 if(person.outside){dialog('Ce profil ne fait pas partie de votre foyer France Pass.','<p>Le partage de vos services est réservé aux bénéficiaires autorisés.</p>'+btn('dismiss','Compris'));return;}
 if(state.members.includes(i))return;
 if(state.members.length+1>=profile().capacity && !paid){
 const next=catalogue.profiles.findIndex(p=>p.capacity>=state.members.length+2);
 dialog('Ce bénéficiaire n’est pas inclus dans votre offre actuelle.','<p>Votre profil '+profile().name+' compte '+profile().capacity+' place(s). Comment souhaitez-vous ajouter '+person.name+' ?</p>'+wrap('actions',(next<0?'':btn('upgrade:'+next+':'+i,'Passer au profil '+catalogue.profiles[next].name+' · +'+euros(catalogue.profiles[next].adjustment)+'/mois',true))+btn('paid:'+i,'Ajouter une place · '+euros(catalogue.extraMember)+'/mois')));return;}
 state.members.push(i);close();render(person.name+' a rejoint le foyer.');
}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-action]');if(!button)return;const [act,arg,arg2]=button.dataset.action.split(':');let message='';
 if(act==='dismiss'){close();return;}
 if(act==='plan'){state.plan=+arg;message='Formule '+plan().name+' sélectionnée.';}
 else if(act==='profile'){changeProfile(+arg);return;}
 else if(act==='confirmProfile'){setProfile(+arg);return;}
 else if(act==='credit'){showCredit();return;}
 else if(act==='applyCredit'){const due=+document.querySelector('#amount').value;move({type:'credit',due,label:'Recharge du portefeuille',date:nowDate});close();message='Recharge de '+euros(due)+' effectuée.';}
 else if(act==='pack'||act==='opt'){const set=act==='pack'?state.packs:state.options;if(act==='opt'&&included(arg))return;const i=set.indexOf(arg);if(i>=0)set.splice(i,1);else{if(arg==='noads'&&set.includes('eduads'))set.splice(set.indexOf('eduads'),1);set.push(arg);}message='Abonnement mis à jour · '+euros(recurring())+'/mois.';}
 else if(act==='usecat'){state.usage=catalogue.usage.find(t=>t.cat===arg).id;state.quantity=1;location.hash='espace';return;}
 else if(act==='member'||act==='paid'){setMember(+arg,act==='paid');return;}
 else if(act==='upgrade'){state.profile=+arg;setMember(+arg2);return;}
 else if(act==='remove'){state.members=state.members.filter(i=>i!==+arg);message='Bénéficiaire retiré.';}
 else if(act==='buy'){const qinput=document.querySelector('#qty');if(!qinput.reportValidity())return;const q=quote(itemBy(state.usage),+qinput.value);if(q.due>state.balance){insufficient();return;}move({...q,type:'usage'});message='Consommation enregistrée · '+euros(q.due)+'.';}
 else if(act==='card'){dialog('Commander une carte supplémentaire','<p>Montant unique débité du portefeuille : '+euros(catalogue.extraCard)+'.</p>'+btn('confirmCard','Confirmer la commande fictive'));return;}
 else if(act==='confirmCard'){if(state.balance<catalogue.extraCard){insufficient();return;}move({type:'card',date:nowDate,due:catalogue.extraCard,label:'Carte supplémentaire'});close();message='Carte supplémentaire commandée.';}
 else return;
 render(message,'[data-action="'+button.dataset.action+'"]');
});
main.addEventListener('change',e=>{if(e.target.id==='usage'){state.usage=e.target.value;state.quantity=1;render('','#usage');}if(e.target.id==='demand'){state.demand=e.target.checked;render('','#demand');}});
main.addEventListener('input',e=>{if(e.target.id!=='qty')return;const qty=e.target.valueAsNumber;if(!Number.isInteger(qty)||qty<1||qty>999){document.querySelector('#due').textContent='—';document.querySelector('#quote').textContent='Saisissez une quantité entre 1 et 999.';return;}state.quantity=qty;const q=quote(itemBy(state.usage),qty);document.querySelector('#due').textContent=euros(q.due);document.querySelector('#quote').textContent=chargeText(q);});
document.getElementById('reset').onclick=()=>{close();state=createState();render('Simulation réinitialisée.');};
document.getElementById('close').onclick=close;
window.addEventListener('hashchange',()=>{close();render('','h1');window.scrollTo(0,0);});
render();
