// V10 public portfolio cloud sync: reads only public portfolio section documents.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
(async()=>{
 try{
  const cfg={apiKey:"AIzaSyAxd30tlExiwNY5uFZXxro9G__gI-lcWlo",authDomain:"muhammad-kabbo.firebaseapp.com",projectId:"muhammad-kabbo",storageBucket:"muhammad-kabbo.firebasestorage.app",messagingSenderId:"430119067097",appId:"1:430119067097:web:959e8b84ab6a0d36a30dc8"};
  const db=getFirestore(initializeApp(cfg,"public-portfolio"));
  const keys=["apps","craftland","projects","stats","updates","social"];
  const remote={};
  for(const key of keys){const snap=await getDoc(doc(db,"portfolio",key));if(snap.exists())remote[key]=snap.data().value;}
  if(Object.keys(remote).length){
   if(remote.apps)SITE_DATA.apps=remote.apps.map((a,i)=>({...a,icon:a.icon||String(a.name||"A").charAt(0),category:a.category||"ANDROID APP",platform:a.platform||"ANDROID",features:a.features||[],screenshots:a.screenshots||[]}));
   if(remote.craftland)SITE_DATA.maps=remote.craftland.map(x=>Array.isArray(x)?x:[x.status||"PUBLISHED",x.name||"",x.description||"",x.id||""]);
   if(remote.projects)SITE_DATA.projects=remote.projects.map(x=>Array.isArray(x)?x:[x.name||"",x.description||""]);
   if(remote.stats)SITE_DATA.stats=remote.stats;
   if(remote.updates)SITE_DATA.updates=remote.updates;
   if(remote.social)SITE_DATA.socials=remote.social;
   window.dispatchEvent(new Event("portfolio-cloud-ready"));
  }
 }catch(e){console.warn("Portfolio cloud sync unavailable; showing bundled demo data.",e);}
})();
