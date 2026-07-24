const $=id=>document.getElementById(id);
const DIAS=["lunes","martes","miércoles","jueves","viernes"];
const START=13*60,END=19*60+30,STEP=30,ROWS=(END-START)/STEP;
let weekOff=0;
function monday(off){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7)+off*7);return d}
// demo appointments: [dayIdx, "HH:MM", durSlots, type, name, detail]
function demoWeek(off){
  const base=[
    [0,"13:00",1,"prepaga","OSDE · R. Gómez","Consulta clínica"],
    [0,"14:00",2,"web","Ana Pérez","Toxina botulínica · seña paga"],
    [0,"17:00",1,"manual","C. Ruiz","Control postoperatorio"],
    [1,"13:30",2,"web","M. Ledesma","Blefaroplastia · seña paga"],
    [1,"16:00",1,"prepaga","Swiss Medical · J. Paz","Consulta"],
    [1,"18:30",1,"pend","F. Ortiz","Lipoescultura · seña pendiente"],
    [2,"14:30",2,"prepaga","OSDE · L. Vega","Várices"],
    [2,"17:30",1,"web","S. Molina","Rellenos AH · seña paga"],
    [3,"13:00",1,"manual","Equipo","Reunión / quirófano"],
    [3,"15:00",2,"web","V. Castro","Mastopexia · seña paga"],
    [3,"18:00",1,"prepaga","Galeno · P. Díaz","Consulta"],
    [4,"14:00",1,"web","D. Herrera","Consulta general · seña paga"],
    [4,"16:30",2,"manual","N. Suárez","Ginecomastia · evaluación"]
  ];
  if(off===0)return base;
  // vary deterministically for other weeks
  return base.filter((_,i)=>(i+off)%3!==0);
}
function fmt(d){return d.toLocaleDateString('es-AR',{day:'numeric',month:'short'})}
function render(){
  const mon=monday(weekOff),appts=demoWeek(weekOff);
  const fri=new Date(mon);fri.setDate(mon.getDate()+4);
  $('wTitle').textContent=`${fmt(mon)} — ${fmt(fri)}`;
  let h='<div></div>';
  for(let d=0;d<5;d++){const dt=new Date(mon);dt.setDate(mon.getDate()+d);h+=`<div class="col-h">${DIAS[d]}<small>${fmt(dt)}</small></div>`}
  for(let r=0;r<ROWS;r++){
    const m=START+r*STEP,t=`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
    h+=`<div class="time">${m%60===0?t:''}</div>`;
    for(let d=0;d<5;d++)h+=`<div class="cell${m%60?' half':''}" data-d="${d}" data-r="${r}"></div>`;
  }
  $('grid').innerHTML=h;
  let senas=0,prepaga=0;
  appts.forEach(([d,t,dur,type,name,det])=>{
    const [hh,mm]=t.split(':').map(Number),r=(hh*60+mm-START)/STEP;
    const cell=$('grid').querySelector(`.cell[data-d="${d}"][data-r="${r}"]`);
    if(!cell)return;
    const el=document.createElement('div');
    el.className='appt '+type;
    el.style.height=(dur*34-6)+'px';el.style.top='2px';
    el.innerHTML=dur>1?`<b>${t} · ${name}</b><span>${det}</span>`:`<b>${t} · ${name}</b>`;
    el.title=`${name} — ${det}`;
    cell.appendChild(el);
    if(type==='web')senas+=30000;
    if(type==='prepaga')prepaga++;
  });
  $('stTurnos').textContent=appts.length;
  $('stSenas').textContent='$'+senas.toLocaleString('es-AR');
  $('stPrepaga').textContent=prepaga;
  $('stLibres').textContent=ROWS*5-appts.reduce((a,x)=>a+x[2],0);
}
$('wPrev').onclick=()=>{weekOff--;render()};
$('wNext').onclick=()=>{weekOff++;render()};
render();
