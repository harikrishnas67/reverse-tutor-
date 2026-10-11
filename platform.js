// Replaces claude.ai's runtime: Firebase (sign-in + Firestore) and /api/ai (server-side Claude call).
(function(){
const V='10.12.2',B='https://www.gstatic.com/firebasejs/'+V+'/';
let boot;
function init(){return boot||(boot=(async()=>{
  const cfg=window.FIREBASE_CONFIG;
  if(!cfg||/PASTE_/.test(cfg.apiKey))throw new Error('config');
  const [A,Au,F]=await Promise.all([import(B+'firebase-app.js'),import(B+'firebase-auth.js'),import(B+'firebase-firestore.js')]);
  const app=A.initializeApp(cfg),auth=Au.getAuth(app),db=F.getFirestore(app);
  const user=await new Promise(r=>{const u=Au.onAuthStateChanged(auth,x=>{u();r(x)})});
  return{Au,F,auth,db,user};
})())}
function banner(html){let b=document.getElementById('plat-b');if(!b){b=document.createElement('div');b.id='plat-b';b.className='c';b.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:space-between';document.querySelector('.w').prepend(b)}b.innerHTML=html;return b}
const cache={};
async function use(name){
  if(cache[name]!==undefined)return cache[name];
  return cache[name]=await make(name).catch(()=>null)}
async function make(name){
  if(name==='sample'){
    const call=async(p)=>{
      const{auth}=await init().catch(()=>({}));
      const t=auth&&auth.currentUser?await auth.currentUser.getIdToken():'';
      const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify({prompt:p})});
      if(!r.ok)throw new Error('ai '+r.status);
      return r.json()};
    const f=async p=>({text:(await call(p)).text});
    f.json=async p=>JSON.parse(String((await call(p)).text).replace(/```json|```/g,'').trim());
    return f}
  if(name==='assets')return null;
  const k=await init().catch(e=>{
    banner(e.message==='config'?'⚙️ Setup needed: add your Firebase keys in <b>config.js</b>.':'Could not load online features.');return null});
  if(!k)return null;
  const{Au,F,auth,db}=k;
  if(!auth.currentUser){
    const b=banner('<span>Sign in to use leaderboards, discussions and the hackathon.</span><button id="gsi">Sign in with Google</button>');
    b.querySelector('#gsi').onclick=async()=>{try{await Au.signInWithPopup(auth,new Au.GoogleAuthProvider());location.reload()}catch(e){}};
    return null}
  const u=auth.currentUser;
  F.setDoc(F.doc(db,'users/'+u.uid),{name:(u.displayName||'A student').slice(0,60)},{merge:true}).catch(()=>{});
  if(name==='user'){
    const pc={};
    return{id:async()=>u.uid,me:()=>({id:u.uid,name:u.displayName||''}),
      profiles:async ids=>{const out={};await Promise.all(ids.map(async id=>{if(!pc[id]){try{const s=await F.getDoc(F.doc(db,'users/'+id));pc[id]=s.exists()?s.data():{}}catch(e){pc[id]={}}}out[id]=pc[id]}));return out}}}
  if(name==='db'){
    return{
      doc:p=>{const r=F.doc(db,p);return{get:async()=>{const s=await F.getDoc(r);return{exists:s.exists(),data:()=>s.data()}},set:d=>F.setDoc(r,d),delete:()=>F.deleteDoc(r)}},
      collection:n=>{const c=F.collection(db,n),cons=[];const o={orderBy:(f,d)=>{cons.push(F.orderBy(f,d));return o},limit:x=>{cons.push(F.limit(x));return o},onSnapshot:(ok,er)=>F.onSnapshot(F.query(c,...cons),ok,er),add:d=>F.addDoc(c,d)};return o}}}
  return null}
window.claude={use};
})();
