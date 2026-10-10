// MUHAMMAD KABBO V10 — Firebase bridge
(function(){
  window.firebaseReady=false; window.firebaseMode="LOCAL";
  const cfg=window.FIREBASE_CONFIG;
  if(!cfg || !cfg.apiKey || !cfg.projectId) return;
  const s=document.createElement("script"); s.type="module";
  s.textContent=`
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
    import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
    import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
    import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";
    const app=initializeApp(${JSON.stringify(window.FIREBASE_CONFIG)});
    const auth=getAuth(app), db=getFirestore(app), storage=getStorage(app);
    window.firebaseApp=app; window.firebaseAuth=auth; window.firebaseDB=db; window.firebaseStorage=storage;
    window.firebaseAPI={
      signIn:(email,password)=>signInWithEmailAndPassword(auth,email,password),
      signOut:()=>signOut(auth), onAuth:cb=>onAuthStateChanged(auth,cb),
      list:async name=>{const snap=await getDocs(collection(db,name));return snap.docs.map(d=>({id:d.id,...d.data()}));},
      add:async(name,data)=>{const r=await addDoc(collection(db,name),{...data,updatedAt:serverTimestamp()});return r.id;},
      update:async(name,id,data)=>updateDoc(doc(db,name,id),{...data,updatedAt:serverTimestamp()}),
      remove:async(name,id)=>deleteDoc(doc(db,name,id)),
      upload:async(path,file)=>{const r=ref(storage,path);await uploadBytes(r,file);return getDownloadURL(r);},
      getSection:async name=>{const snap=await getDoc(doc(db,"portfolio",name));return snap.exists()?snap.data().value:null;},
      saveSection:async(name,value)=>setDoc(doc(db,"portfolio",name),{value,updatedAt:serverTimestamp()})
    };
    window.firebaseReady=true;window.firebaseMode="CLOUD";window.dispatchEvent(new Event("firebase-ready"));
  `;
  document.head.appendChild(s);
})();
