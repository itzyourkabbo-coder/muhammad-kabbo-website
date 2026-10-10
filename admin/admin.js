// MUHAMMAD KABBO V10 — Firebase-authenticated cloud admin
const KEY="muhammad_kabbo_admin_v10";
const demo={
 apps:[
  {name:"ARISE AI",status:"LIVE",version:"v1.2.0",updated:"06 Oct 2026",description:"Personal AI assistant with voice interaction.",download:""},
  {name:"GAME COLOR BOOSTER",status:"DEV",version:"v0.8.0",updated:"04 Oct 2026",description:"Experimental gaming visual utility.",download:""},
  {name:"SWEET MEMORIES",status:"LIVE",version:"v5.0.0",updated:"28 Sep 2026",description:"Private offline family memories app.",download:""}
 ],
 craftland:[{status:"PUBLISHED",name:"The Final Zone",description:"Fast-paced survival arena.",id:"DEMO-001"},{status:"IN DEVELOPMENT",name:"Neon City Escape",description:"Futuristic city chase map.",id:"DEMO-002"}],
 projects:[{name:"AI Assistant Ecosystem",status:"ACTIVE",description:"Personal AI experiences around voice, memory and phone tools."},{name:"Gaming Utility Tools",status:"ACTIVE",description:"Gaming-focused Android utilities."},{name:"AI Prime Browser",status:"CONCEPT",description:"AI-assisted mobile browser concept."}],
 stats:[["5+","AI APPS"],["4","YEARS EXPERIENCE"],["12+","CRAFTLAND MAPS"],["∞","IDEAS IN PROGRESS"]],
 updates:[["06 OCT 2026","ARISE AI v1.2.0","Voice assistant experience improved."]],
 social:[["YT","#"],["FB","#"],["IG","#"],["GH","#"],["TK","#"]]
};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(demo);
const panel=document.querySelector("#panel"), connection=document.querySelector("#v9Connection");
let activeSection="apps", signedInUser=null, cloudHydrated=false;
const adminEmail="muhammadkabbo017032@gmail.com";
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));}
function localSave(){localStorage.setItem(KEY,JSON.stringify(data));}
function setStatus(msg,ok=false){const el=document.querySelector("#cloudStatus");if(el){el.textContent=msg;el.className=ok?"cloud-ok":"cloud-local";}}
function setPath(path,val){const p=path.split(".");let v=data;for(let i=0;i<p.length-1;i++)v=v[p[i]];v[p[p.length-1]]=val;}
function field(label,value,path,area=false){return `<label>${esc(label)}<${area?"textarea":"input"} data-path="${path}">${area?esc(value):""}</${area?"textarea":"input"}></label>`;}
function render(section){
 if(section==="apps")return listEditor("apps",["name","status","version","updated","description","download"]);
 if(section==="craftland")return listEditor("craftland",["status","name","description","id"]);
 if(section==="projects")return listEditor("projects",["name","status","description"]);
 if(section==="stats")return `<div class="card"><h2>Statistics</h2>${data.stats.map((x,i)=>`<div class="grid">${field("Value",x[0],`stats.${i}.0`)}${field("Label",x[1],`stats.${i}.1`)}</div>`).join("")}</div>`;
 if(section==="updates")return listEditor("updates",null);
 if(section==="social")return `<div class="card"><h2>Social Links</h2>${data.social.map((x,i)=>`<div class="grid">${field("Platform",x[0],`social.${i}.0`)}${field("URL",x[1],`social.${i}.1`)}</div>`).join("")}</div>`;
}
function listEditor(type,keys){const arr=data[type];if(type==="updates")return `<div class="card"><h2>Updates</h2>${arr.map((x,i)=>`<div class="card">${field("Date",x[0],`updates.${i}.0`)}${field("Title",x[1],`updates.${i}.1`)}${field("Description",x[2],`updates.${i}.2`)}</div>`).join("")}</div>`;return `<div class="card"><h2>${type.toUpperCase()}</h2><p class="hint">Edit fields, then tap Save to Cloud.</p>${arr.map((o,i)=>`<div class="card">${keys.map(k=>field(k.replace(/^./,c=>c.toUpperCase()),o[k],`${type}.${i}.${k}`,k==="description")).join("")}</div>`).join("")}</div>`;}
function bind(){panel.querySelectorAll("[data-path]").forEach(el=>el.addEventListener("input",()=>{setPath(el.dataset.path,el.value);localSave();}));}
function showLogin(){
 connection.innerHTML=`<h2>🔐 Admin Login</h2><p>Sign in with the Firebase admin account.</p><form id="loginForm" class="login-form"><label>Email<input id="loginEmail" type="email" autocomplete="username" value="${adminEmail}" required></label><label>Password<input id="loginPassword" type="password" autocomplete="current-password" required></label><button class="primary" type="submit">Sign in</button><p id="loginMessage" role="status"></p></form>`;
 document.querySelector("#loginForm").onsubmit=async e=>{e.preventDefault();const msg=document.querySelector("#loginMessage");msg.textContent="Signing in…";try{await window.firebaseAPI.signIn(document.querySelector("#loginEmail").value.trim(),document.querySelector("#loginPassword").value);msg.textContent="Signed in."; }catch(err){msg.textContent="Login failed: "+(err.code||err.message);}};
}
function showSignedIn(){
 connection.innerHTML=`<h2>☁ Firebase Admin Connected</h2><p class="cloud-ok">Signed in: ${esc(signedInUser.email||"admin")}</p><div class="action-row"><button id="loadCloudBtn">Load Cloud Data</button><button id="saveCloudBtn" class="primary">Save Changes to Cloud</button><button id="logoutBtn">Sign out</button></div><p id="syncMessage" role="status">Cloud ready. Load cloud data before editing if you have previously saved data.</p>`;
 document.querySelector("#loadCloudBtn").onclick=loadCloud;
 document.querySelector("#saveCloudBtn").onclick=saveCloud;
 document.querySelector("#logoutBtn").onclick=()=>window.firebaseAPI.signOut();
}
async function loadCloud(){
 const msg=document.querySelector("#syncMessage");msg.textContent="Loading Firestore data…";
 try{let found=0;for(const k of Object.keys(demo)){const v=await window.firebaseAPI.getSection(k);if(v!==null){data[k]=v;found++;}}
 cloudHydrated=true;localSave();panel.innerHTML=render(activeSection);bind();msg.textContent=found?`Loaded ${found} section(s) from Firestore.`:"No cloud sections found yet. Demo data remains; tap Save Changes to Cloud to publish it.";setStatus("CLOUD CONNECTED — Firestore read/write ready for admin.",true);
 }catch(e){msg.textContent="Could not load cloud data: "+(e.code||e.message);}}
async function saveCloud(){
 const msg=document.querySelector("#syncMessage");if(!signedInUser){msg.textContent="Please sign in first.";return;}
 msg.textContent="Saving portfolio sections to Firestore…";
 try{for(const k of Object.keys(demo))await window.firebaseAPI.saveSection(k,data[k]);cloudHydrated=true;localSave();msg.textContent="Saved successfully to Firestore. Public site can now read the cloud sections.";setStatus("CLOUD CONNECTED — data saved to Firestore.",true);}
 catch(e){msg.textContent="Save failed: "+(e.code||e.message)+". Check Firestore Rules and admin login.";}}
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeSection=b.dataset.section;panel.innerHTML=render(activeSection);bind();});
document.querySelector("#exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="muhammad-kabbo-site-data-v10.json";a.click();URL.revokeObjectURL(a.href);};
document.querySelector("#resetBtn").onclick=()=>{if(confirm("Reset local demo data? This does not delete Firestore data.")){data=structuredClone(demo);localSave();panel.innerHTML=render(activeSection);bind();}};
panel.innerHTML=render(activeSection);bind();
function authUpdate(user){signedInUser=user;if(user){showSignedIn();setStatus("Firebase initialized; checking admin session…",true);}else{showLogin();setStatus("Firebase ready. Sign in to manage cloud data.",true);}}
function setCloudStatus(){if(window.firebaseReady&&window.firebaseAPI){window.firebaseAPI.onAuth(authUpdate);}else{setStatus("LOCAL MODE — Firebase config/SDK not initialized.");connection.innerHTML="<h2>Firebase not initialized</h2><p>Open this site over a hosted HTTPS origin (such as GitHub Pages) and check the Firebase config.</p>";}}
window.addEventListener("firebase-ready",setCloudStatus);setTimeout(setCloudStatus,500);
