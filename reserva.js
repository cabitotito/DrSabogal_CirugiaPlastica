const state={step:1,date:null,time:null,proc:null,name:'',phone:'',mail:'',pm:null};
const PROCS={"Consulta":["Consulta general (no estoy seguro)"],"Rostro":["Lifting cervicofacial","Blefaroplastia (párpados)","Otoplastia (orejas)","Toxina botulínica","Bioestimuladores (Radiesse®, Sculptra®, Profhilo®)","Rellenos con ácido hialurónico","Láser de CO₂ para la piel"],"Cabello":["Implante capilar"],"Mamas":["Mastoplastia de aumento","Reducción mamaria","Mastopexia (levantamiento)","Tratamiento de la ginecomastia"],"Contorno corporal":["Lipoescultura","Abdominoplastia","Lipofilling de glúteos","Aumento de pantorrillas con prótesis"],"Piernas":["Tratamiento de várices"],"Ginecoestética":["Vaginoplastia quirúrgica","Vaginoplastia con láser endovaginal de CO₂"]};
const MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DOW=["L","M","M","J","V","S","D"];
const $=id=>document.getElementById(id);
const today=new Date();today.setHours(0,0,0,0);
let calY=today.getFullYear(),calM=today.getMonth();
// persist draft
try{const d=JSON.parse(localStorage.getItem('sabogal-reserva-draft')||'null');if(d&&d.date&&new Date(d.date)>=today)Object.assign(state,d,{step:1});}catch(e){}
function saveDraft(){try{localStorage.setItem('sabogal-reserva-draft',JSON.stringify(state))}catch(e){}}
function fmtDate(iso){const d=new Date(iso+'T12:00:00');return d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'})}
function buildCal(){
  const first=new Date(calY,calM,1),start=(first.getDay()+6)%7,days=new Date(calY,calM+1,0).getDate();
  $('calTitle').textContent=MESES[calM]+' '+calY;
  const atCur=calY===today.getFullYear()&&calM===today.getMonth();
  $('prevM').disabled=atCur;
  let h=DOW.map(d=>`<span class="dow">${d}</span>`).join('');
  for(let i=0;i<start;i++)h+='<span></span>';
  for(let d=1;d<=days;d++){
    const dt=new Date(calY,calM,d),iso=`${calY}-${String(calM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const wk=dt.getDay(),off=wk===0||wk===6||dt<=today;
    h+=`<button class="day${state.date===iso?' sel':''}" data-d="${iso}" ${off?'disabled':''}>${d}</button>`;
  }
  $('cal').innerHTML=h;
  $('cal').querySelectorAll('.day:not(:disabled)').forEach(b=>b.onclick=()=>{state.date=b.dataset.d;state.time=null;buildCal();buildSlots();update()});
}
function buildSlots(){
  const g=$('slotGrid'),e=$('slotEmpty');
  if(!state.date){g.innerHTML='';e.style.display='block';$('slotTitle').textContent='Horarios disponibles';return}
  e.style.display='none';
  $('slotTitle').textContent=fmtDate(state.date);
  // deterministic pseudo-availability per date
  let seed=state.date.split('-').reduce((a,x)=>a+ +x,0),h='';
  for(let m=13*60;m<=19*60+30-30;m+=30){
    seed=(seed*9301+49297)%233280;
    if(seed/233280<.25)continue;
    const t=`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
    h+=`<button class="slot${state.time===t?' sel':''}" data-t="${t}">${t} h</button>`;
  }
  g.innerHTML=h||'<p class="empty" style="display:block">No quedan horarios este día; probá otra fecha.</p>';
  g.querySelectorAll('.slot').forEach(b=>b.onclick=()=>{state.time=b.dataset.t;buildSlots();update()});
}
function buildProcs(){
  $('procList').innerHTML=Object.entries(PROCS).map(([cat,items],i)=>`<details class="proc-cat"${i===0||items.includes(state.proc)?' open':''}><summary>${cat}</summary><div class="opts">${items.map(p=>`<label class="proc-opt${state.proc===p?' sel':''}"><input type="radio" name="proc" value="${p}"${state.proc===p?' checked':''}>${p}</label>`).join('')}</div></details>`).join('');
  document.querySelectorAll('input[name="proc"]').forEach(r=>r.onchange=()=>{state.proc=r.value;document.querySelectorAll('.proc-opt').forEach(l=>l.classList.toggle('sel',l.querySelector('input').checked));update()});
}
function buildSummary(){
  $('summary').innerHTML=`<div class="row"><span>Fecha</span><b>${fmtDate(state.date)} · ${state.time} h</b></div><div class="row"><span>Procedimiento</span><b>${state.proc}</b></div><div class="row"><span>Paciente</span><b>${state.name}</b></div><div class="row"><span>Contacto</span><b>${state.phone}${state.mail?' · '+state.mail:''}</b></div>`;
}
function valid(){
  if(state.step===1)return state.date&&state.time;
  if(state.step===2)return !!state.proc;
  if(state.step===3)return state.name.trim().length>1&&(state.phone.replace(/\D/g,'').length>=8||/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.mail));
  if(state.step===4){
    if(!state.pm)return false;
    if(state.pm==='mp')return true;
    return $('ccName').value.trim().length>1&&$('ccNum').value.replace(/\D/g,'').length>=15&&/^\d{2}\/\d{2}$/.test($('ccExp').value)&&$('ccCvv').value.replace(/\D/g,'').length>=3;
  }
  return false;
}
function update(){
  document.querySelectorAll('.step-dot').forEach(d=>{const s=+d.dataset.s;d.classList.toggle('active',s===state.step);d.classList.toggle('done',s<state.step)});
  for(let i=1;i<=4;i++)$('step'+i).classList.toggle('hidden',state.step!==i);
  $('btnBack').style.visibility=state.step===1?'hidden':'visible';
  $('btnNext').textContent=state.step===4?'Pagar seña y confirmar':'Continuar →';
  $('btnNext').disabled=!valid();
  saveDraft();
}
$('prevM').onclick=()=>{if(calM===0){calM=11;calY--}else calM--;buildCal()};
$('nextM').onclick=()=>{if(calM===11){calM=0;calY++}else calM++;buildCal()};
['fName','fPhone','fMail'].forEach(id=>$(id).addEventListener('input',()=>{state.name=$('fName').value;state.phone=$('fPhone').value;state.mail=$('fMail').value;update()}));
document.querySelectorAll('.pay-method input').forEach(r=>r.onchange=()=>{state.pm=r.value;document.querySelectorAll('.pay-method').forEach(l=>l.classList.toggle('sel',l.querySelector('input').checked));$('cardForm').classList.toggle('hidden',state.pm!=='card');$('mpNote').classList.toggle('hidden',state.pm!=='mp');update()});
['ccName','ccNum','ccExp','ccCvv'].forEach(id=>$(id).addEventListener('input',update));
$('ccNum').addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 ')});
$('ccExp').addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,4);e.target.value=v.length>2?v.slice(0,2)+'/'+v.slice(2):v});
$('btnBack').onclick=()=>{if(state.step>1){state.step--;update()}};
$('btnNext').onclick=()=>{
  if(!valid())return;
  if(state.step===3)buildSummary();
  if(state.step===4){
    $('btnNext').textContent='Procesando…';$('btnNext').disabled=true;
    setTimeout(()=>{
      for(let i=1;i<=4;i++)$('step'+i).classList.add('hidden');
      $('navBtns').classList.add('hidden');$('steps').classList.add('hidden');
      $('okDetail').innerHTML=`<b>${fmtDate(state.date)} a las ${state.time} h</b> · ${state.proc}.<br>Seña de $ 30.000 ARS registrada${state.pm==='mp'?' vía Mercado Pago':''}.`;
      $('stepOk').classList.remove('hidden');
      try{localStorage.removeItem('sabogal-reserva-draft')}catch(e){}
      window.scrollTo({top:0,behavior:'smooth'});
    },1200);
    return;
  }
  state.step++;update();window.scrollTo({top:0,behavior:'smooth'});
};
buildCal();buildSlots();buildProcs();
if(state.name)$('fName').value=state.name;
if(state.phone)$('fPhone').value=state.phone;
if(state.mail)$('fMail').value=state.mail;
update();
