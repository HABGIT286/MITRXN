import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://mcwemgjmqwbgxoyiwant.supabase.co";
const SUPABASE_KEY = "sb_publishable_qmIUC4Rkb-VGOek8qkVqFg_Sn4x3WjI";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* =========================
   Performance switches
========================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/* =========================
   Particles (lightweight)
========================= */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d', { alpha: true });

function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resizeCanvas();
addEventListener('resize', resizeCanvas);

class Particle{
  constructor(init=true){ this.reset(init); }
  reset(init=false){
    this.x = init ? Math.random()*canvas.width : (Math.random()>.5 ? -10 : canvas.width+10);
    this.y = Math.random()*canvas.height;
    this.r = Math.random()*1.8 + 0.6;
    this.vx = (Math.random()*0.35 + 0.08) * (Math.random()>.5 ? 1 : -1);
    this.vy = (Math.random()-0.5)*0.14;
    this.a  = Math.random()*0.30 + 0.10;
    this.rgb = Math.random()>0.7 ? '245,200,66' : '125,211,252';
  }
  step(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.y < -20) this.y = canvas.height+20;
    if(this.y > canvas.height+20) this.y = -20;
    if(this.x < -30 || this.x > canvas.width+30) this.reset();
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${this.rgb},${this.a})`;
    ctx.fill();
  }
}

function initParticles(){
  if(reduceMotion) return;
  const count = isMobile ? 26 : 44;
  const particles = Array.from({length: count}, ()=> new Particle(true));
  (function anim(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of particles){ p.step(); p.draw(); }
    requestAnimationFrame(anim);
  })();
}
initParticles();

/* =========================
   Cursor glow
========================= */
const glow = document.getElementById('cursorGlow');
addEventListener('mousemove', (e)=>{
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
  glow.style.opacity = '1';
});
addEventListener('mouseleave', ()=> glow.style.opacity = '0');

/* =========================
   Loader + entrance
========================= */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    const loader = document.getElementById('loader');
    loader.style.opacity='0';
    loader.style.transform='scale(1.04)';
    setTimeout(()=>{ loader.style.display='none'; triggerEntranceAnims(); }, 650);
  }, 1250);
});

function triggerEntranceAnims(){
  const inputs = document.querySelectorAll('.input-group');
  inputs.forEach((el,i)=> setTimeout(()=> el.classList.add('anim-in'), i*85));

  const btns = document.querySelectorAll('.btn-wrap');
  btns.forEach((el,i)=> setTimeout(()=> el.classList.add('anim-in'), 220 + i*70));
}

/* =========================
   Card tilt (throttled)
========================= */
const card = document.getElementById('mainCard');
if(!reduceMotion && !isMobile){
  let raf = 0;
  card.addEventListener('mousemove', (e)=>{
    if(raf) return;
    raf = requestAnimationFrame(()=>{
      raf = 0;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-y * 4.8).toFixed(2);
      const ry = ( x * 7.0).toFixed(2);
      card.style.transform = `translateY(0) scale(1) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
}

/* =========================
   Ripple on buttons
========================= */
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.btn-glass');
  if(!btn) return;

  const r = btn.getBoundingClientRect();
  const s = Math.max(r.width, r.height);
  const x = e.clientX - r.left - s/2;
  const y = e.clientY - r.top - s/2;

  const rip = document.createElement('span');
  rip.className = 'ripple';
  rip.style.width = rip.style.height = s + 'px';
  rip.style.left = x + 'px';
  rip.style.top  = y + 'px';
  btn.appendChild(rip);
  setTimeout(()=> rip.remove(), 650);
});

/* =========================
   Toast + Message + Modal
========================= */
function showToast(msg, type='success'){
  const t=document.getElementById('toast');
  const icon=document.getElementById('toast-icon');
  const text=document.getElementById('toast-text');

  icon.textContent = type==='success' ? '✅' : type==='error' ? '❌' : 'ℹ️';
  text.textContent = msg;

  t.className = '';
  t.classList.add('show', type==='success'?'success-toast': type==='error'?'error-toast':'info-toast');

  clearTimeout(t._timer);
  t._timer=setTimeout(()=> t.className='', 2600);
}
function setMsg(text, type='info'){
  const m=document.getElementById('msg');
  m.textContent=text;
  m.className = 'show ' + type;
  clearTimeout(m._t);
  m._t=setTimeout(()=> m.className='', 4200);
}

function showModal({icon='✏️',title='',msg='',inputPlaceholder='',withInput=false,confirmText='تأكيد',cancelText='إلغاء'}){
  return new Promise(resolve=>{
    document.getElementById('modal-icon').textContent=icon;
    document.getElementById('modal-title').textContent=title;
    document.getElementById('modal-msg').textContent=msg;

    const inp=document.getElementById('modal-input');
    if(withInput){
      inp.style.display='block';
      inp.placeholder=inputPlaceholder||'';
      inp.value='';
      setTimeout(()=> inp.focus(), 50);
    }else{
      inp.style.display='none';
    }

    const btns=document.getElementById('modal-btns');
    btns.innerHTML=`
      <button class="modal-btn modal-btn-cancel">${cancelText}</button>
      <button class="modal-btn modal-btn-confirm">${confirmText}</button>
    `;

    const overlay=document.getElementById('modal-overlay');
    overlay.classList.add('active');

    btns.querySelector('.modal-btn-confirm').onclick=()=>{
      overlay.classList.remove('active');
      resolve(withInput ? inp.value : true);
    };
    btns.querySelector('.modal-btn-cancel').onclick=()=>{
      overlay.classList.remove('active');
      resolve(null);
    };
  });
}

/* =========================
   Site status
========================= */
async function checkSiteStatus(){
  const {data,error}=await supabase
    .from("site_control")
    .select("site_open")
    .eq("id",1)
    .single();

  if(error){
    document.body.innerHTML="<h2 style='color:#fff;text-align:center;margin-top:120px;'>حدث خطأ عند التحقق من حالة الموقع</h2>";
    return false;
  }
  if(!data.site_open){
    document.body.innerHTML="<h2 style='color:#fff;text-align:center;margin-top:120px;font-size:36px;'>الموقع مغلق ❌</h2>";
    return false;
  }
  return true;
}

/* =========================
   Fingerprint (Device Code)
   - لا نعرضه للطالب
   - نستخدمه كـ code في جدول student_reports
========================= */
async function sha256(str){
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

function canvasFp(){
  try{
    const c = document.createElement('canvas');
    c.width = 260; c.height = 80;
    const x = c.getContext('2d');
    x.textBaseline = 'top';
    x.font = "16px Arial";
    x.fillStyle = "#f5c842";
    x.fillRect(10,10,80,30);
    x.fillStyle = "#7dd3fc";
    x.fillText("ONX-TAQE|Fingerprint", 12, 14);
    x.fillStyle = "rgba(255,255,255,0.6)";
    x.fillText(navigator.userAgent, 12, 38);
    return c.toDataURL();
  }catch{
    return "no-canvas";
  }
}

function webglFp(){
  try{
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if(!gl) return "no-webgl";
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : "v?";
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "r?";
    return vendor + "|" + renderer;
  }catch{
    return "no-webgl";
  }
}

const DEVICE_CODE_PROMISE = (async ()=>{
  const parts = [
    navigator.userAgent,
    navigator.platform || '',
    navigator.language || '',
    (Intl.DateTimeFormat().resolvedOptions().timeZone || ''),
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    `${navigator.hardwareConcurrency || ''}`,
    `${navigator.deviceMemory || ''}`,
    canvasFp(),
    webglFp(),
  ].join("||");

  const hash = await sha256(parts);
  return hash.slice(0, 28);
})();

/* =========================
   Helpers
========================= */
function formatDate(ts){
  if(!ts) return "";
  const d=new Date(ts);
  const h=String(d.getHours()).padStart(2,'0');
  const m=String(d.getMinutes()).padStart(2,'0');
  const s=String(d.getSeconds()).padStart(2,'0');
  return `${h}:${m}:${s} (${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()})`;
}

function downloadBlob(filename, content, mime="application/octet-stream"){
  const blob = new Blob([content], {type: mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=> URL.revokeObjectURL(url), 600);
}

/* =========================
   App state cache
========================= */
let ALL_CACHE = [];
let SEARCH_TIMER = 0;

/* =========================
   Save
   - يمنع الطالب من إضافة سجل جديد حتى لو فتح متصفح تاني (قدر الإمكان)
========================= */
async function saveData(){
  const name=document.getElementById("studentName").value.trim();
  const title=document.getElementById("reportTitle").value.trim();
  const subject=document.getElementById("subjectName").value.trim();
  const code = await DEVICE_CODE_PROMISE;

  if(name.split(/\s+/).length < 2){
    setMsg("⚠️ الاسم لازم يكون ثنائي على الأقل","error");
    showToast("الاسم لازم يكون ثنائي","error");
    return;
  }
  if(!name || !title || !subject){
    setMsg("⚠️ املا كل الحقول الأول","error");
    showToast("املا كل الحقول","error");
    return;
  }

  // 1) لو عنده سجل بالفعل (بنفس بصمة الجهاز) امنع الإضافة
  const {data:already, error:e0} = await supabase
    .from("student_reports")
    .select("id")
    .eq("code", code)
    .limit(1);

  if(e0){
    setMsg("❌ حصل خطأ أثناء التحقق","error");
    showToast("خطأ في التحقق","error");
    return;
  }
  if(already && already.length){
    setMsg("⛔ عندك بيانات محفوظة بالفعل. احذف بياناتك أولًا لو عايز تسجل من جديد.","error");
    showToast("لا يمكن إضافة بيانات جديدة","error");
    await showMyInfo();
    return;
  }

  // 2) تحقق فريدية الاسم والعنوان (سريع Parallel)
  const p1 = supabase.from("student_reports").select("id").eq("name", name).limit(1);
  const p2 = supabase.from("student_reports").select("id").eq("title", title).limit(1);
  const [{data:nameUsed, error:err1}, {data:titleUsed, error:err2}] = await Promise.all([p1,p2]);

  if(err1 || err2){
    setMsg("❌ حصل خطأ في التحقق من البيانات","error");
    showToast("خطأ في التحقق","error");
    return;
  }
  if((nameUsed && nameUsed.length) || (titleUsed && titleUsed.length)){
    setMsg("❌ الاسم أو العنوان مستخدم مسبقاً","error");
    showToast("الاسم/العنوان مستخدم","error");
    return;
  }

  const now = new Date().toISOString();
  const {error} = await supabase
    .from("student_reports")
    .insert([{ name, title, subject, date: now, code }]);

  if(error){
    console.log(error);
    setMsg("❌ فشل الحفظ","error");
    showToast("فشل الحفظ","error");
    return;
  }

  setMsg("✅ اتسجلت بياناتك بنجاح","success");
  showToast("تم الحفظ بنجاح","success");
  await showMyInfo();
  await showAll();
}

/* =========================
   Change title
========================= */
async function changeTitle(){
  const code = await DEVICE_CODE_PROMISE;

  const {data:me, error:e} = await supabase
    .from("student_reports")
    .select("id")
    .eq("code", code)
    .limit(1);

  if(e || !me || !me.length){
    setMsg("⚠️ مفيش بيانات محفوظة ليك","error");
    showToast("لا توجد بيانات","error");
    return;
  }

  const newTitle = await showModal({
    icon:'✏️',
    title:'تغيير عنوان التقرير',
    msg:'اكتب العنوان الجديد (لازم يكون فريد)',
    withInput:true,
    inputPlaceholder:'العنوان الجديد...',
    confirmText:'تغيير',
    cancelText:'إلغاء'
  });
  if(!newTitle) return;

  const clean = newTitle.trim();
  if(!clean){
    setMsg("⚠️ العنوان الجديد فاضي","error");
    showToast("اكتب عنوان","error");
    return;
  }

  const {data:titleUsed} = await supabase
    .from("student_reports")
    .select("id")
    .eq("title", clean)
    .limit(1);

  if(titleUsed && titleUsed.length){
    setMsg("❌ العنوان ده مستخدم قبل كده","error");
    showToast("العنوان مستخدم","error");
    return;
  }

  const now = new Date().toISOString();
  const {error} = await supabase
    .from("student_reports")
    .update({ title: clean, date: now })
    .eq("code", code);

  if(error){
    console.log(error);
    setMsg("❌ فشل التحديث","error");
    showToast("فشل التحديث","error");
    return;
  }

  setMsg("✅ تم تغيير العنوان","success");
  showToast("تم تغيير العنوان","success");
  await showMyInfo();
  await showAll();
}

/* =========================
   Show my info (بدون عرض الكود)
========================= */
async function showMyInfo(){
  const code = await DEVICE_CODE_PROMISE;
  const infoBox = document.getElementById("infoBox");

  const {data, error} = await supabase
    .from("student_reports")
    .select("*")
    .eq("code", code)
    .single();

  if(error || !data){
    setMsg("⚠️ مش لاقي بياناتك","error");
    showToast("لا توجد بيانات","error");
    return;
  }

  infoBox.style.display='block';
  infoBox.innerHTML=`
    <h4>🎓 بيانات الطالب</h4>
    <p><strong>👤 الاسم</strong> ${data.name}</p>
    <p><strong>📄 العنوان</strong> ${data.title}</p>
    <p><strong>📚 المادة</strong> ${data.subject}</p>
    <p><strong>🕐 آخر تحديث</strong> ${formatDate(data.date)}</p>
  `;
}

/* =========================
   Show all (cache + render)
========================= */
async function showAll(){
  const allPanel = document.getElementById("allPanel");
  const allTitles = document.getElementById("allTitles");

  const {data, error} = await supabase
    .from("student_reports")
    .select("id,name,title,subject,date,code")
    .order("id", {ascending:true});

  if(error){
    allPanel.style.display='block';
    allTitles.innerHTML="❌ فشل تحميل البيانات";
    return;
  }

  ALL_CACHE = data || [];
  allPanel.style.display='block';
  document.getElementById("counterBadge").textContent = `${ALL_CACHE.length} طالب`;

  renderAllList();
}

function renderAllList(){
  const allTitles = document.getElementById("allTitles");
  const q = (document.getElementById("searchInput")?.value || '').trim().toLowerCase();

  const filtered = !q ? ALL_CACHE : ALL_CACHE.filter(d=>{
    const s = `${d.name} ${d.title} ${d.subject}`.toLowerCase();
    return s.includes(q);
  });

  // highlight سجل الطالب (بدون عرض الكود)
  DEVICE_CODE_PROMISE.then(myCode=>{
    let html = `<ul>`;
    filtered.forEach((d,i)=>{
      const highlight = (d.code === myCode) ? "highlight" : "";
      html += `
        <li class="${highlight}">
          <span class="row-num">${i+1}</span>
          <span class="info">${d.name} — ${d.title} — <em style="color:rgba(255,255,255,0.65)">${d.subject}</em></span>
          <span class="time">${formatDate(d.date)}</span>
        </li>`;
    });
    html += `</ul>`;
    allTitles.innerHTML = html;
  });
}

/* =========================
   Delete my data
========================= */
async function deleteMyData(){
  const code = await DEVICE_CODE_PROMISE;

  const {data:me, error:e} = await supabase
    .from("student_reports")
    .select("id")
    .eq("code", code)
    .limit(1);

  if(e || !me || !me.length){
    setMsg("⚠️ مفيش بيانات محفوظة","error");
    showToast("لا توجد بيانات","error");
    return;
  }

  const confirmed = await showModal({
    icon:'🗑️',
    title:'تأكيد الحذف',
    msg:'هل أنت متأكد إنك عايز تحذف بياناتك؟ الإجراء نهائي.',
    withInput:false,
    confirmText:'حذف',
    cancelText:'إلغاء'
  });
  if(!confirmed) return;

  const {error} = await supabase
    .from("student_reports")
    .delete()
    .eq("code", code);

  if(error){
    console.log(error);
    setMsg("❌ فشل الحذف","error");
    showToast("فشل الحذف","error");
    return;
  }

  const infoBox = document.getElementById("infoBox");
  infoBox.style.display='none';
  infoBox.innerHTML='';

  setMsg("✅ اتحذفت بياناتك","success");
  showToast("تم حذف البيانات","success");
  await showAll();
}

/* =========================
   Download my data (بدون كود)
========================= */
async function downloadMyData(){
  const code = await DEVICE_CODE_PROMISE;

  const {data, error} = await supabase
    .from("student_reports")
    .select("*")
    .eq("code", code)
    .single();

  if(error || !data){
    setMsg("⚠️ لازم تحفظ بياناتك الأول","error");
    showToast("لا توجد بيانات","error");
    return;
  }

  const choice = await showModal({
    icon:'⬇️',
    title:'تحميل بياناتي',
    msg:'اختار صيغة التحميل:\nاكتب: JSON أو TXT',
    withInput:true,
    inputPlaceholder:'اكتب JSON أو TXT',
    confirmText:'تحميل',
    cancelText:'إلغاء'
  });
  if(!choice) return;

  const format = choice.trim().toUpperCase();
  const safeName = (data.name || 'student').replace(/[^\u0600-\u06FFa-zA-Z0-9_-]+/g,'_');

  if(format === "JSON"){
    const payload = {
      brand: "ONX-TAQE",
      exported_at: new Date().toISOString(),
      student: {
        name: data.name,
        subject: data.subject,
        title: data.title,
        date: data.date
      }
    };
    downloadBlob(`ONX-TAQE_${safeName}_report.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    setMsg("✅ تم تحميل ملف JSON","success");
    showToast("تم التحميل (JSON)","success");
    return;
  }

  if(format === "TXT"){
    const txt =
`ONX-TAQE | Student Report Export
--------------------------------
Name   : ${data.name}
Subject: ${data.subject}
Title  : ${data.title}
Date   : ${formatDate(data.date)}
--------------------------------`;
    downloadBlob(`ONX-TAQE_${safeName}_report.txt`, txt, "text/plain;charset=utf-8");
    setMsg("✅ تم تحميل ملف TXT","success");
    showToast("تم التحميل (TXT)","success");
    return;
  }

  setMsg("⚠️ اكتب JSON أو TXT بس","error");
  showToast("صيغة غير مدعومة","error");
}

/* =========================
   Search debounce
========================= */
document.getElementById("searchInput").addEventListener("input", ()=>{
  clearTimeout(SEARCH_TIMER);
  SEARCH_TIMER = setTimeout(renderAllList, 90);
});

/* =========================
   Boot
========================= */
checkSiteStatus().then(open=>{
  if(open){
    // expose functions for inline onclick
    window.saveData = saveData;
    window.changeTitle = changeTitle;
    window.showAll = showAll;
    window.showMyInfo = showMyInfo;
    window.deleteMyData = deleteMyData;
    window.downloadMyData = downloadMyData;

    // Auto try show my info
    setTimeout(()=> showMyInfo().catch(()=>{}), 650);
  }
});
