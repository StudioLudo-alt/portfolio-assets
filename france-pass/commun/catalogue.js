'use strict';
const catalogue = {
  plans:[
    {name:'Essentiel', cents:1999, discount:0, color:'#fff', line:'L’essentiel, au meilleur prix.', benefits:['Accès au catalogue et consommations à l’usage','Publicités sur les parcours concernés','Assistance standard · frais de gestion','Fast Pass administratif en option']},
    {name:'Confort', cents:4999, discount:10, color:'#283276', line:'Un quotidien plus confortable.', benefits:['10 % de remise sur les usages éligibles','Publicité limitée','Assistance incluse · frais de gestion réduits','Fast Pass administratif en option']},
    {name:'Premium', cents:8999, discount:20, color:'#101522', line:'Ne faites plus de compromis.', benefits:['20 % de remise sur les usages éligibles','Expérience sans publicité','Fast Pass administratif et assistance prioritaire inclus','Frais de gestion offerts']}
  ],
  profiles:[
    {name:'Solo', capacity:1, adjustment:0, help:'1 bénéficiaire'},
    {name:'Jeune', capacity:1, percent:20, help:'18–25 ans · 20 % sur la formule'},
    {name:'Duo', capacity:2, adjustment:1999, help:'2 bénéficiaires · +19,99 €/mois'},
    {name:'Famille', capacity:5, adjustment:3999, help:'Jusqu’à 5 bénéficiaires · +39,99 €/mois'},
    {name:'Senior', capacity:1, percent:15, help:'65 ans et plus · 15 % sur la formule'}
  ],
  packs:[
    {id:'sante', name:'Santé', pack:'Soins+', color:'#719BE0', cents:12999, help:'Consultations, analyses, médicaments et hospitalisation.'},
    {id:'secours', name:'Protection & secours', pack:'Protection+', color:'#D92538', cents:3999, help:'Pompiers, sécurité civile et assistance d’urgence.'},
    {id:'habitat', name:'Habitat & solidarité', pack:'Habitat+', color:'#ED414C', cents:6999, help:'Logement social, petite enfance et accompagnement du grand âge. Loyer et hébergement intégral hors pack.'},
    {id:'mobilite', name:'Mobilité & cadre de vie', pack:'Mobilité+', color:'#3769AD', cents:5999, help:'Transports, voirie, éclairage et espaces publics.'},
    {id:'education', name:'Éducation', pack:'Éducation+', color:'#F28B96', cents:14999, help:'Enseignement, manuels et bibliothèques.'},
    {id:'administration', name:'Administration', pack:'Démarches+', color:'#18345D', cents:1999, help:'Démarches, documents administratifs et assistance.'}
  ],
  options:[
    {id:'fast', name:'Fast Pass administratif', cents:1999},
    {id:'eduads', name:'Éducation sans publicité', cents:1499},
    {id:'noads', name:'Suppression de toutes les publicités', cents:2499},
    {id:'priority', name:'Assistance prioritaire', cents:999},
    {id:'surge', name:'Protection contre les majorations', cents:1999}
  ],
  usage:[
    {id:'consult',cat:'sante',label:'Consultation médicale',unit:'consultation', cents:4990},
    {id:'road',cat:'mobilite',label:'Utilisation de la voirie',unit:'km', cents:15},
    {id:'light',cat:'mobilite',label:'Éclairage public',unit:'soirée', cents:99},
    {id:'book',cat:'education',label:'Emprunt en bibliothèque',unit:'livre', cents:390},
    {id:'school',cat:'education',label:'Journée scolaire hors forfait',unit:'journée', cents:4990},
    {id:'help',cat:'administration',label:'Assistance administrative',unit:'minute', cents:299},
    {id:'rescue',cat:'secours',label:'Intervention fictive des secours',unit:'intervention', cents:99000},
    {id:'visit',cat:'habitat',label:'Sortie accompagnée',unit:'sortie', cents:1200}
  ],
  extraMember:1499, extraCard:1990, initialBalance:12450, recharges:[2000,5000,10000,20000],
  surgePercent:50, packDiscount:10
};
const euros = cents => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(cents/100);
const promises=['Prenez soin de vous, sans compromis.','Anticipez les imprévus du quotidien.','À chaque étape de la vie, trouvez les services qui vous accompagnent.','Profitez pleinement de votre environnement.','Donnez toutes ses chances à votre avenir.','Simplifiez vos prochaines démarches.'];
const optionPromises=['Gagnez du temps grâce à un accès prioritaire aux démarches.','Suivez vos cours sans interruption commerciale.','Retrouvez tous vos services sans interruption commerciale.','Accédez en priorité à un conseiller.','Gardez le tarif habituel des secours même en période de forte demande.'];
catalogue.packs.forEach((item,i)=>item.line=promises[i]);
catalogue.options.forEach((item,i)=>item.line=optionPromises[i]);
