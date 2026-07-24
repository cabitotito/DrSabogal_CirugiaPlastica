<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Panel de agenda — Consultorio Sabogal</title>
<link rel="stylesheet" href="estilo.css">
<style>
body{background:#f2f4f4}
.admin-bar{background:var(--teal-dark);color:#fff}
.admin-bar .wrap{display:flex;align-items:center;justify-content:space-between;height:64px;gap:20px}
.admin-bar .brand .name{color:#fff}
.admin-bar .brand .sub{color:#9dbcc3}
.admin-bar .tag{font-size:12px;letter-spacing:.14em;text-transform:uppercase;background:rgba(255,255,255,.12);padding:6px 14px;border-radius:999px}
.admin-wrap{max-width:1280px;margin:0 auto;padding:28px 24px 60px;display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
.agenda-card{background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);overflow:hidden}
.agenda-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.agenda-head h1{font-size:24px}
.agenda-head .week-nav{display:flex;align-items:center;gap:10px}
.agenda-head .week-nav b{font-size:15px;color:var(--teal-dark);min-width:190px;text-align:center;text-transform:capitalize}
.agenda-head button{background:none;border:1px solid var(--line);border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:15px;color:var(--teal)}
.agenda-head button:hover{background:var(--teal-soft)}
.legend{display:flex;gap:16px;flex-wrap:wrap;padding:10px 20px;border-bottom:1px solid var(--line);font-size:13px;color:var(--ink-soft)}
.legend span{display:flex;align-items:center;gap:6px}
.legend i{width:11px;height:11px;border-radius:3px;display:inline-block}
.grid{display:grid;grid-template-columns:58px repeat(5,minmax(0,1fr))}
.grid .col-h{padding:10px 6px;text-align:center;font-size:13px;font-weight:600;color:var(--teal-dark);border-bottom:1px solid var(--line);border-left:1px solid var(--line);text-transform:capitalize}
.grid .col-h small{display:block;font-weight:400;color:var(--ink-soft)}
.grid .time{font-size:11px;color:var(--ink-soft);text-align:right;padding:2px 8px 0 0;border-top:1px solid #eef1f1;height:34px;box-sizing:border-box}
.grid .cell{border-top:1px solid #eef1f1;border-left:1px solid var(--line);height:34px;position:relative}
.grid .cell.half{border-top-style:dashed;border-top-color:#f2f5f5}
.appt{position:absolute;left:3px;right:3px;border-radius:6px;padding:4px 8px;font-size:12px;line-height:1.25;overflow:hidden;cursor:pointer;z-index:2;border-left:3px solid}
.appt b{display:block;font-size:12px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
.appt span{opacity:.8;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;display:block}
.appt.web{background:#e2eef1;border-color:var(--teal);color:var(--teal-dark)}
.appt.prepaga{background:#f1e9d8;border-color:var(--gold);color:#6b5322}
.appt.manual{background:#e8e8ee;border-color:#6b6b8f;color:#3d3d5c}
.appt.pend{background:#fdeeea;border-color:var(--err);color:#7c2f1e}
.side{display:grid;gap:18px}
.side .card{padding:20px}
.side h2{font-size:19px;margin-bottom:12px}
.stat-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}
.stat{background:var(--teal-soft);border-radius:8px;padding:12px 14px}
.stat b{font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--teal-dark);display:block;line-height:1}
.stat span{font-size:12px;color:var(--ink-soft)}
.pend-list{display:grid;gap:10px}
.pend-item{border:1px solid var(--line);border-radius:8px;padding:10px 12px;font-size:13px}
.pend-item b{display:block;font-size:14px;color:var(--teal-dark)}
.pend-item span{color:var(--ink-soft)}
.pend-item .row{display:flex;gap:8px;margin-top:8px}
.pend-item .mini{font-size:12px;padding:5px 12px;border-radius:999px;border:1px solid var(--teal);color:var(--teal);background:none;cursor:pointer}
.pend-item .mini.pri{background:var(--teal);color:#fff}
.pend-item .mini:hover{opacity:.85}
.sync-note{font-size:13px;color:var(--ink-soft);background:var(--gold-soft);border-radius:8px;padding:12px 14px;line-height:1.5}
.sync-note b{color:var(--teal-dark)}
@media (max-width:1000px){.admin-wrap{grid-template-columns:1fr}}
</style>
</head>
<body>
<header class="admin-bar">
<div class="wrap">
<a href="index.html" class="brand"><span class="name">Consultorio Sabogal</span><span class="sub">Panel interno de agenda</span></a>
<span class="tag">Vista privada · demo</span>
</div>
</header>
<div class="admin-wrap">
<div class="agenda-card">
<div class="agenda-head">
<h1>Agenda semanal</h1>
<div class="week-nav"><button id="wPrev">‹</button><b id="wTitle"></b><button id="wNext">›</button></div>
</div>
<div class="legend">
<span><i style="background:#e2eef1;border-left:3px solid var(--teal)"></i>Turno web (seña paga)</span>
<span><i style="background:#f1e9d8;border-left:3px solid var(--gold)"></i>Prepaga (sincronizado)</span>
<span><i style="background:#e8e8ee;border-left:3px solid #6b6b8f"></i>Cargado por secretaría</span>
<span><i style="background:#fdeeea;border-left:3px solid var(--err)"></i>Seña pendiente</span>
</div>
<div class="grid" id="grid"></div>
</div>
<aside class="side">
<div class="card">
<h2>Esta semana</h2>
<div class="stat-row"><div class="stat"><b id="stTurnos">0</b><span>turnos</span></div><div class="stat"><b id="stSenas">$0</b><span>en señas</span></div></div>
<div class="stat-row"><div class="stat"><b id="stPrepaga">0</b><span>por prepaga</span></div><div class="stat"><b id="stLibres">0</b><span>huecos libres</span></div></div>
</div>
<div class="card">
<h2>Consultas gratuitas pendientes</h2>
<div class="pend-list">
<div class="pend-item"><b>Lucía Fernández</b><span>Blefaroplastia — “¿la recuperación permite trabajar a la semana?”</span><div class="row"><button class="mini pri">Responder por WhatsApp</button></div></div>
<div class="pend-item"><b>Marcos D.</b><span>Ginecomastia — pregunta por costos y anestesia.</span><div class="row"><button class="mini pri">Responder por WhatsApp</button><button class="mini">Marcar resuelta</button></div></div>
</div>
</div>
<div class="card">
<h2>Sincronización</h2>
<p class="sync-note"><b>Google Calendar:</b> conectado (demo). Los turnos de prepaga que caen en el calendario compartido bloquean automáticamente los horarios en la web. Última sincronización: hace 4 min.</p>
</div>
</aside>
</div>
<script src="agenda.js"></script>
</body>
</html>
