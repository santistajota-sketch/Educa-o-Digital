/* =========================================================
   12Help! — Núcleo da aplicação (estado, roteador, componentes, páginas públicas)
   ========================================================= */
'use strict';

/* ---------- Utilidades ---------- */
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const BRL = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL', maximumFractionDigits:0});
const money = v => BRL.format(Math.round(v));
const num = v => new Intl.NumberFormat('pt-BR').format(Math.round(v));
const MES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const MESF = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DOW = ['dom','seg','ter','qua','qui','sex','sab'];
const DOWN = {seg:'Seg',ter:'Ter',qua:'Qua',qui:'Qui',sex:'Sex',sab:'Sáb',dom:'Dom'};
const DOWF = {seg:'segunda',ter:'terça',qua:'quarta',qui:'quinta',sex:'sexta',sab:'sábado',dom:'domingo'};
const SHIFT = {manha:'Manhã',tarde:'Tarde',noite:'Noite',flex:'Horário flexível'};
const DUR = {curta:'Curta (até 1 mês)',media:'Média (1 a 6 meses)',longa:'Longa (6+ meses)'};
const DEMO_NOW = new Date(2026, 9, 29, 12, 0);
const pd = iso => { const [y,m,d] = iso.split('-').map(Number); return new Date(y, m-1, d||1); };
const fmtDate = iso => { const d = pd(iso); return `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()}`; };
const fmtMonth = ym => { if(!ym) return 'atual'; const [y,m] = ym.split('-').map(Number); return `${MES[m-1]} ${y}`; };
const daysLeft = iso => Math.max(0, Math.ceil((pd(iso) - DEMO_NOW) / 864e5));
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const nowISO = () => { const d = new Date(); return todayISO() + 'T' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0'); };
const ago = t => {
  const d = new Date(t), now = new Date(); const s = (now - d) / 1000;
  if (s < 60) return 'agora';
  if (s < 3600) return `há ${Math.floor(s/60)} min`;
  if (s < 86400) return `há ${Math.floor(s/3600)} h`;
  if (s < 86400*30) return `há ${Math.floor(s/86400)} d`;
  return fmtDate(t.slice(0,10));
};
const hhmm = t => t.length > 10 ? t.slice(11,16) : '';
const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return Math.abs(h); };
const uid = () => Math.random().toString(36).slice(2, 9);
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const km = (a, b) => { const R = 6371, r = x => x*Math.PI/180; const dLa = r(b.lat-a.lat), dLo = r(b.lng-a.lng); const h = Math.sin(dLa/2)**2 + Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLo/2)**2; return 2*R*Math.asin(Math.sqrt(h)); };
const flag = c => COUNTRIES[c] ? `${COUNTRIES[c].f} ${COUNTRIES[c].n}` : c;

/* ---------- Ícones minimalistas (traço) ---------- */
const ICONS = {
  leaf:'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6',
  book:'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  heart:'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  paw:'M12 21c-3 0-6-1.6-6-4.4 0-2.8 3-5.1 6-5.1s6 2.3 6 5.1c0 2.8-3 4.4-6 4.4z M5 8.5a2 2 0 1 0 0 .01 M9.2 4.5a2 2 0 1 0 0 .01 M14.8 4.5a2 2 0 1 0 0 .01 M19 8.5a2 2 0 1 0 0 .01',
  utensils:'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2 M7 2v20 M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7',
  users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  palette:'M12 22a10 10 0 1 1 10-10c0 2.5-2 3-4 3h-2a2 2 0 0 0-1 3.7c.6.6.6 1.6 0 2.3-.7.6-1.8 1-3 1z M7.5 10.5h.01 M12 7h.01 M16.5 10.5h.01',
  scale:'M12 3v18 M5 21h14 M3 7h18 M6 7l-3 7a3 3 0 0 0 6 0z M18 7l-3 7a3 3 0 0 0 6 0z',
  cpu:'M5 5h14v14H5z M9 9h6v6H9z M9 2v3 M15 2v3 M9 19v3 M15 19v3 M19 9h3 M19 14h3 M2 9h3 M2 14h3',
  lifebuoy:'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M4.93 4.93l4.24 4.24 M14.83 14.83l4.24 4.24 M14.83 9.17l4.24-4.24 M4.93 19.07l4.24-4.24',
  trophy:'M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0z',
  smile:'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01',
  home:'M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  search:'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14 M21 21l-4.3-4.3',
  pin:'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
  cal:'M3 5h18v16H3z M16 3v4 M8 3v4 M3 10h18',
  clock:'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M12 6v6l4 2',
  bell:'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
  msg:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  star:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z',
  check:'M20 6 9 17l-5-5',
  x:'M18 6 6 18 M6 6l12 12',
  menu:'M4 6h16 M4 12h16 M4 18h16',
  grid:'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
  file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8',
  award:'M12 2a6 6 0 1 0 0 12a6 6 0 1 0 0-12 M8.21 13.89 7 23l5-3 5 3-1.21-9.12',
  globe:'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  bookmark:'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
  settings:'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M12 2v3 M12 19v3 M4.2 4.2l2.1 2.1 M17.7 17.7l2.1 2.1 M2 12h3 M19 12h3 M4.2 19.8l2.1-2.1 M17.7 6.3l2.1-2.1',
  chart:'M3 3v18h18 M7 16v-5 M12 16V8 M17 16v-9',
  plus:'M12 5v14 M5 12h14',
  send:'M22 2 11 13 M22 2l-7 20-4-9-9-4z',
  shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  flag:'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
  ban:'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M4.9 4.9l14.2 14.2',
  logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  share:'M18 2a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M6 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M18 16a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M8.59 13.51l6.83 3.98 M15.41 6.51l-6.82 3.98',
  filter:'M22 3H2l8 9.46V19l4 2v-8.54z',
  coins:'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5 M12 6v2 M12 16v2',
  sparkle:'M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z',
  arrow:'M5 12h14 M13 6l6 6-6 6',
  chev:'M9 18l6-6-6-6',
  chevl:'M15 18l-6-6 6-6',
  eye:'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
  edit:'M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  compass:'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z',
  brief:'M3 7h18v13H3z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
  info:'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M12 16v-4 M12 8h.01',
  lock:'M5 11h14v11H5z M7 11V7a5 5 0 0 1 10 0v4',
  alert:'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
  trend:'M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6',
  zap:'M13 2 3 14h9l-1 8 10-12h-9z',
  map:'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z M8 2v16 M16 6v16',
  list:'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  passport:'M5 2h14v20H5z M12 7a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7 M9 17h6',
  video:'M23 7l-7 5 7 5z M1 5h15v14H1z',
  dots:'M12 12h.01 M19 12h.01 M5 12h.01',
  link:'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  camera:'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 9a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
  refresh:'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  target:'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M12 6a6 6 0 1 0 0 12a6 6 0 1 0 0-12 M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4'
};
const I = (n, s = 18, cls = '') => `<svg class="ic ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[n] || ICONS.sparkle}"/></svg>`;

/* ---------- Logo 12Help! ---------- */
const logoMark = (s = 34, light = false) => `<svg width="${s*1.375}" height="${s}" viewBox="0 0 44 32" aria-hidden="true"><circle cx="14" cy="16" r="11" fill="none" stroke="${light?'#fff':'#0F4C81'}" stroke-width="4.5"/><circle cx="30" cy="16" r="11" fill="none" stroke="${light?'#3FCB7E':'#008C45'}" stroke-width="4.5"/><path d="M22 8.45A11 11 0 0 1 22 23.55A11 11 0 0 1 22 8.45Z" fill="${light?'#3FCB7E':'#008C45'}"/></svg>`;
const logo = (light = false) => `<a href="#/" class="logo" aria-label="12Help! início">${logoMark(30, light)}<span>12Help<span class="x">!</span></span></a>`;

/* ---------- Estado (localStorage) ---------- */
const KEY = '12help-demo', VER = 4;
function freshState() {
  return {
    ver: VER, role: 'visitor', me: clone(DEMO_VOL), ongMe: {},
    favOpps: ['guardioes-rio-negro', 'reef-survey', 'conteudo-amazonia'], favOngs: ['raizes', 'grune', 'reef', 'patas'], favCamps: ['c4', 'c1'],
    apps: clone(DEMO_APPS), interests: [], myEvents: ['e1'], eventInterest: ['e8'],
    donations: [{camp:'c1', v:50, date:'2026-09-12', name:'Lívia Moraes'}], raisedAdd: {}, backersAdd: {},
    threads: clone(DEMO_THREADS), notifs: clone(DEMO_NOTIFS), activity: clone(DEMO_ACTIVITY),
    points: 2340, pointsLog: [
      {n:50,why:'Inscrição em Monitoramento da qualidade da água',t:'2026-10-27'},
      {n:50,why:'Inscrição em Fotografia para campanhas de adoção',t:'2026-10-25'},
      {n:30,why:'Confirmou presença em evento',t:'2026-10-20'},
      {n:20,why:'Doação para campanha',t:'2026-09-12'},
      {n:100,why:'Medalha Conexão Global',t:'2025-08-30'}],
    badges: {}, blocked: [], reports: [], customOpps: [], oppEdits: {}, customEvents: [], customCamps: [],
    ongApps: clone(ONG_APPS), invites: [], ongInterest: [],
    settings: {publicProfile:true, showAge:true, nEmail:true, nMatch:true, nMsg:true, nCamp:true}
  };
}
let S;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
if (!S || S.ver !== VER) { S = freshState(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

const roleKey = () => S.role === 'ong' ? 'o' : 'v';
const isVol = () => S.role === 'volunteer';
const isOng = () => S.role === 'ong';

/* ---------- Acesso a dados ---------- */
const ONG_MAP = Object.fromEntries(ONGS.map(o => [o.id, o]));
const VOL_MAP = Object.fromEntries(VOLS.map(v => [v.id, v]));
const MY_ONG = 'raizes';
function ongById(id) { const o = ONG_MAP[id]; if (!o) return null; return id === MY_ONG ? {...o, ...S.ongMe} : o; }
function allOngs() { return ONGS.map(o => ongById(o.id)); }
function volById(id) { return id === 'livia' ? S.me : VOL_MAP[id]; }
function allOpps() { return [...OPPS.map(o => S.oppEdits[o.id] ? {...o, ...S.oppEdits[o.id]} : o), ...S.customOpps].filter(o => !o.closed); }
function allOppsIncClosed() { return [...OPPS.map(o => S.oppEdits[o.id] ? {...o, ...S.oppEdits[o.id]} : o), ...S.customOpps]; }
function oppById(id) { return allOppsIncClosed().find(o => o.id === id); }
function oppLoc(o) { const g = ongById(o.ong); return o.city ? {city:o.city, state:o.state||'', country:o.country||g.country, lat:o.lat??g.lat, lng:o.lng??g.lng} : {city:g.city, state:g.state, country:g.country, lat:g.lat, lng:g.lng}; }
function allEvents() { return [...EVENTS, ...S.customEvents].map(e => ({...e, goingNow: e.going + (S.myEvents.includes(e.id) ? 1 : 0)})).sort((a,b) => a.date.localeCompare(b.date)); }
function eventById(id) { return allEvents().find(e => e.id === id); }
function allCamps() { return [...CAMPS, ...S.customCamps].map(c => ({...c, raisedNow: c.raised + (S.raisedAdd[c.id]||0), backersNow: c.backers + (S.backersAdd[c.id]||0)})); }
function campById(id) { return allCamps().find(c => c.id === id); }
const causeByK = k => CAUSES.find(c => c.k === k);
const isBlocked = (type, id) => S.blocked.some(b => b.type === type && b.id === id);

/* ---------- Experiências / gamificação ---------- */
const doneExp = () => S.me.exp;
const hoursTotal = () => doneExp().reduce((a, x) => a + (+x.hours || 0), 0);
const countriesDone = () => [...new Set(doneExp().map(x => x.country))];
const citiesDone = () => [...new Set(doneExp().map(x => x.city))];
const ongsDone = () => [...new Set(doneExp().map(x => x.ong))];
const envDone = () => doneExp().filter(x => x.cat === 'amb').length;

const BADGES = [
  {k:'first', n:'Primeiro Passo', d:'Concluir a primeira experiência voluntária', i:'zap', goal:1, cur:() => doneExp().length},
  {k:'heart', n:'Coração Solidário', d:'Participar de cinco projetos', i:'heart', goal:5, cur:() => doneExp().length},
  {k:'nature', n:'Guardião da Natureza', d:'Concluir dois projetos ambientais', i:'leaf', goal:2, cur:() => envDone()},
  {k:'hands', n:'Mãos que Ajudam', d:'Somar 50 horas de voluntariado', i:'clock', goal:50, cur:() => hoursTotal()},
  {k:'transf', n:'Transformador', d:'Concluir dez projetos', i:'trend', goal:10, cur:() => doneExp().length},
  {k:'global', n:'Conexão Global', d:'Ter experiências em três países', i:'globe', goal:3, cur:() => countriesDone().length},
  {k:'amb', n:'Embaixador 12Help!', d:'Participação frequente: 3.000 pontos', i:'award', goal:3000, cur:() => S.points}
];
const LEVELS = ['Semente','Broto','Muda','Raiz','Árvore','Bosque','Floresta','Bioma','Planeta'];
const level = () => { const l = Math.floor(S.points / 500) + 1; return {n:l, name:LEVELS[Math.min(l-1, LEVELS.length-1)], pct:(S.points % 500) / 5, toNext:500 - S.points % 500}; };

function checkBadges(silent) {
  BADGES.forEach(b => {
    if (!S.badges[b.k] && b.cur() >= b.goal) {
      S.badges[b.k] = todayISO();
      if (!silent) {
        S.points += 100; S.pointsLog.unshift({n:100, why:`Medalha ${b.n}`, t:todayISO()});
        notify('v', 'badge', `Você conquistou a medalha <b>${b.n}</b>`, '#/v/conquistas');
        log(`Conquistou a medalha ${b.n}`, 'award');
        setTimeout(() => toast(`Nova medalha: <b>${b.n}</b> (+100 pontos)`, 'award', '#/v/conquistas', 'Ver conquistas'), 600);
      }
    }
  });
}
if (!Object.keys(S.badges).length) { checkBadges(true); S.badges.global = '2025-08-30'; S.badges.first = '2024-02-28'; S.badges.hands = '2025-06-30'; S.badges.nature = '2024-07-20'; save(); }

function addPoints(n, why) { S.points += n; S.pointsLog.unshift({n, why, t:todayISO()}); checkBadges(); }
function log(text, i = 'check') { S.activity.unshift({t:todayISO(), text, i}); }
function notify(role, type, text, link) { S.notifs.unshift({id:uid(), role, type, text, link, t:nowISO(), read:false}); }

/* ---------- Match ---------- */
function interestCats(me) { return [...new Set((me.interests||[]).flatMap(k => (causeByK(k)||{cats:[]}).cats))]; }
function matchOpp(o, me = S.me) {
  let s = 38; const why = [];
  const cats = interestCats(me);
  if (cats.includes(o.cat)) { s += 28; const c = (me.interests||[]).map(causeByK).find(c => c && c.cats.includes(o.cat)); why.push(['heart', `Interesse em ${c ? c.n : CATS[o.cat].n}`]); }
  const sk = o.skills.filter(x => (me.skills||[]).some(y => norm(y) === norm(x)));
  if (sk.length) { s += Math.min(sk.length * 8, 16); why.push(['zap', `Habilidade${sk.length>1?'s':''}: ${sk.join(', ')}`]); }
  const L = oppLoc(o);
  if (o.mode === 'Remoto') { s += 9; why.push(['globe', 'Atuação remota, de qualquer lugar']); }
  else { const d = km(me, L); if (d < 60) { s += 11; why.push(['pin', d < 5 ? 'Na sua cidade' : `A ${Math.round(d)} km de você`]); } else if (d < 800) { s += 5; why.push(['pin', `A ${num(d)} km de você`]); } else if (d < 3000) s += 2; }
  const days = me.avail?.days || [];
  if (o.days[0] === 'flex' || o.days.some(d => days.includes(d))) { s += 7; why.push(['cal', o.days[0]==='flex' ? 'Horários flexíveis' : `Disponível às ${o.days.filter(d=>days.includes(d)).map(d=>DOWF[d]+'s').join(', ') || 'datas combinadas'}`]); }
  if (!o.exp) s += 3; else if ((me.exp||[]).length >= 2) { s += 4; why.push(['brief', 'Sua experiência atende ao requisito']); }
  if (me.avail?.mode && (me.avail.mode === o.mode || me.avail.mode === 'Híbrido')) s += 3;
  if (me.age && me.age < o.age) s -= 30;
  s += hash(o.id + me.id) % 4;
  return {score: Math.max(42, Math.min(99, s)), why};
}
function matchVol(v, ongCat = 'amb', skills = []) {
  let s = 45;
  if (interestCats(v).includes(ongCat)) s += 28;
  s += Math.min(v.skills.filter(x => skills.some(y => norm(y) === norm(x))).length * 9, 18);
  const g = ongById(MY_ONG), d = km(v, g);
  s += d < 60 ? 10 : d < 800 ? 4 : 0;
  s += Math.min(Math.floor(v.hours / 80), 4);
  s += hash(v.id) % 4;
  return Math.max(40, Math.min(99, s));
}
const recommended = () => allOpps().map(o => ({o, m:matchOpp(o)})).filter(x => x.m.score >= 80).sort((a, b) => b.m.score - a.m.score);

/* ---------- Componentes ---------- */
function avatar(p, s = 40) {
  if (!p) return '';
  if (p.photo) return `<span class="av" style="width:${s}px;height:${s}px"><img src="${p.photo}" alt=""></span>`;
  const ini = p.name.split(' ').filter(Boolean).map(x => x[0]).slice(0, 2).join('');
  const cols = ['#0F4C81','#008C45','#6B46C1','#B83280','#C05621','#0E7490','#2C5282','#9C4221'];
  return `<span class="av" style="width:${s}px;height:${s}px;font-size:${s*.38}px;background:${p.id==='livia'?'linear-gradient(135deg,#008C45,#0F4C81)':cols[hash(p.id)%cols.length]}">${esc(ini)}</span>`;
}
const ongLogo = (g, s = 44) => g ? `<span class="olog" style="width:${s}px;height:${s}px;font-size:${s*.36}px;background:${g.c}">${esc(g.ini)}</span>` : '';
const seal = g => g && g.verified ? `<span class="seal" title="Selo demonstrativo: nesta demonstração nenhuma verificação real foi realizada.">${I('shield', 13)} Verificada · demo</span>` : (g ? `<span class="seal pending" title="Organização ainda não passou pela verificação (simulada).">${I('clock', 13)} Verificação pendente</span>` : '');
const stars = (r, s = 14) => `<span class="stars">${Array.from({length:5}, (_, i) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="opacity:${i < Math.round(r) ? 1 : .25}"><path d="${ICONS.star}"/></svg>`).join('')}</span>`;
const catTag = c => `<span class="tag" style="--tc:${CATS[c].g[0]}">${I(CATS[c].i, 13)} ${CATS[c].n}</span>`;
const progress = (pct, cls = '') => `<div class="bar ${cls}"><span style="width:${Math.min(100, Math.max(0, pct)).toFixed(1)}%"></span></div>`;
const emptyBox = (icon, title, sub = '', cta = '') => `<div class="empty"><div class="ei">${I(icon, 28)}</div><h3>${title}</h3><p>${sub}</p>${cta}</div>`;

function cover(cat, seed = '', label = '', people = false) {
  const c = CATS[cat] || CATS.amb, h = hash(seed);
  const a = 20 + h % 60, b = 30 + (h >> 3) % 50, w = 140 + (h >> 5) % 40;
  return `<div class="cover" style="--g1:${c.g[0]};--g2:${c.g[1]}">
    <svg class="cover-art" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="${300 + a}" cy="${b}" r="${70 + a/2}" fill="#fff" opacity=".12"/>
      <circle cx="${40 + b}" cy="230" r="${w/1.4}" fill="#fff" opacity=".08"/>
      <path d="M0 ${175 + a/4} C 110 ${130 + b/2}, 250 ${215 - a/3}, 400 ${150 + b/3} L400 240 L0 240Z" fill="#000" opacity=".1"/>
      <path d="M0 ${200 + b/5} C 140 ${170 + a/3}, 260 ${235 - b/4}, 400 ${195} L400 240 L0 240Z" fill="#fff" opacity=".07"/>
      ${people ? figures(h) : ''}
    </svg>
    <span class="cover-ic">${I(c.i, 54)}</span>${label ? `<span class="cover-label">${label}</span>` : ''}</div>`;
}
/* Silhuetas estilizadas de pessoas em ação, usadas como "fotografias ilustrativas" */
function figures(h) {
  const n = 3 + h % 3; let s = '';
  for (let i = 0; i < n; i++) {
    const x = 40 + i * (300 / n) + (h >> i) % 30, sc = .8 + ((h >> (i + 2)) % 40) / 100, y = 168 - sc * 6;
    const arm = (h >> i) % 2 ? `M${x} ${y-38*sc} l${18*sc} ${-14*sc}` : `M${x} ${y-38*sc} l${16*sc} ${10*sc}`;
    s += `<g opacity=".92" fill="rgba(255,255,255,.88)" stroke="rgba(255,255,255,.88)" stroke-linecap="round">
      <circle cx="${x}" cy="${y - 62*sc}" r="${10*sc}" stroke="none"/>
      <path d="M${x - 12*sc} ${y} Q${x - 14*sc} ${y - 40*sc} ${x} ${y - 48*sc} Q${x + 14*sc} ${y - 40*sc} ${x + 12*sc} ${y} Z" stroke="none"/>
      <path d="${arm}" stroke-width="${6*sc}" fill="none"/>
    </g>`;
  }
  return s + `<path d="M0 172 L400 172" stroke="rgba(255,255,255,.35)" stroke-width="2"/>`;
}

function oppCard(o) {
  const g = ongById(o.ong), L = oppLoc(o), fav = S.favOpps.includes(o.id), left = Math.max(o.vagas - o.filled, 0);
  const m = isVol() ? matchOpp(o).score : null;
  return `<article class="card ocard lift fade">
    <a href="#/oportunidade/${o.id}" class="ocard-cover">${cover(o.cat, o.id, '', true)}${m ? `<span class="match-pill">${I('sparkle', 13)} ${m}% compatível</span>` : ''}${o.imm ? '<span class="imm-pill">Início imediato</span>' : ''}</a>
    <button class="fav ${fav ? 'on' : ''}" data-act="fav-opp" data-id="${o.id}" aria-label="Salvar nos favoritos">${I('heart', 18)}</button>
    <div class="ocard-body">
      <div class="row-sm">${catTag(o.cat)}<span class="tag tag-line">${o.mode}</span></div>
      <h3><a href="#/oportunidade/${o.id}">${esc(o.title)}</a></h3>
      <div class="org-line">${ongLogo(g, 20)} ${esc(g.name)}</div>
      <div class="meta">${I('pin', 15)} ${o.mode === 'Remoto' ? `Remoto · organização em ${esc(L.city)}` : `${esc(L.city)}${L.state ? ', ' + L.state : ''} · ${COUNTRIES[L.country].f}`}</div>
      <div class="meta">${I('clock', 15)} ${DUR[o.dur].split(' (')[0]} · ${o.hrs}h/semana · a partir de ${o.age} anos</div>
      <div class="ocard-foot"><span>${left} de ${o.vagas} vagas</span><a class="link" href="#/oportunidade/${o.id}">Ver detalhes ${I('arrow', 14)}</a></div>
    </div></article>`;
}
function ongCard(g) {
  const nOpps = allOpps().filter(o => o.ong === g.id).length, fav = S.favOngs.includes(g.id);
  return `<article class="card ocard ongcard lift fade">
    <a href="#/ong/${g.id}" class="ocard-cover">${cover(g.cat, g.id + 'c')}${ongLogo(g, 56)}</a>
    <button class="fav ${fav ? 'on' : ''}" data-act="fav-ong" data-id="${g.id}" aria-label="Favoritar organização">${I('heart', 18)}</button>
    <div class="ocard-body">
      <h3><a href="#/ong/${g.id}">${esc(g.name)}</a></h3>
      <div class="row-sm">${seal(g)}${catTag(g.cat)}</div>
      <div class="meta">${I('pin', 15)} ${esc(g.city)}${g.state ? ', ' + g.state : ''} · ${flag(g.country)}</div>
      <p class="small muted" style="margin:2px 0 6px">${esc(g.tagline)}</p>
      <div class="stats3"><div><b>${num(g.vols)}</b><span>voluntários</span></div><div><b>${nOpps}</b><span>oportunidades</span></div><div><b>${g.rating.toFixed(1)}</b><span>avaliação</span></div></div>
    </div></article>`;
}
function campCard(c) {
  const g = ongById(c.ong), pct = c.raisedNow / c.goal * 100;
  return `<article class="card ocard lift fade">
    <a href="#/vaquinha/${c.id}" class="ocard-cover">${cover(c.cat, c.id, '', true)}${pct >= 100 ? '<span class="match-pill">' + I('check', 13) + ' Meta atingida</span>' : ''}</a>
    <button class="fav ${S.favCamps.includes(c.id) ? 'on' : ''}" data-act="fav-camp" data-id="${c.id}" aria-label="Acompanhar campanha">${I('bookmark', 18)}</button>
    <div class="ocard-body">
      <h3><a href="#/vaquinha/${c.id}">${esc(c.title)}</a></h3>
      <div class="org-line">${ongLogo(g, 20)} ${esc(g.name)}</div>
      <div style="margin-top:6px">${progress(pct)}</div>
      <div class="camp-amt"><b>${money(c.raisedNow)}</b><span class="small muted">de ${money(c.goal)} · ${Math.round(pct)}%</span></div>
      <div class="ocard-foot"><span>${num(c.backersNow)} apoiadores</span><span>${daysLeft(c.deadline)} dias restantes</span></div>
    </div></article>`;
}
function eventCard(e) {
  const g = ongById(e.ong), d = pd(e.date), going = S.myEvents.includes(e.id), int = S.eventInterest.includes(e.id);
  return `<article class="card ecard fade">
    <div class="edate"><small>${MES[d.getMonth()]}</small><b>${d.getDate()}</b><span class="xs muted">${DOW[d.getDay()]}</span></div>
    <div style="flex:1;min-width:0">
      <div class="row-sm" style="margin-bottom:4px"><span class="tag ${e.mode === 'Virtual' ? '' : 'tag-green'}">${e.mode}</span><span class="tag tag-line">${esc(e.type)}</span></div>
      <h3 style="margin:2px 0 4px;font-size:16px">${esc(e.title)}</h3>
      <div class="org-line">${ongLogo(g, 18)} <a href="#/ong/${g.id}">${esc(g.name)}</a></div>
      <div class="meta" style="margin-top:4px">${I('clock', 14)} ${e.time} · ${I('pin', 14)} ${esc(e.city)}${e.country ? ' · ' + COUNTRIES[e.country].f : ''} · ${I('users', 14)} ${num(e.goingNow)}/${num(e.spots)}</div>
      <p class="small muted" style="margin:8px 0 10px">${esc(e.desc)}</p>
      <div class="row-sm">
        <button class="btn btn-sm ${going ? 'btn-outline' : 'btn-primary'}" data-act="event-go" data-id="${e.id}">${going ? I('check', 15) + ' Inscrito' : 'Inscrever-se'}</button>
        <button class="btn btn-sm btn-ghost" data-act="event-int" data-id="${e.id}">${I('star', 15)} ${int ? 'Interessado' : 'Tenho interesse'}</button>
      </div>
    </div></article>`;
}
function ring(pct, s = 96) {
  const r = s/2 - 7, c = 2*Math.PI*r;
  return `<div class="ring" style="width:${s}px;height:${s}px"><svg width="${s}" height="${s}"><circle cx="${s/2}" cy="${s/2}" r="${r}" stroke="#E4F4EB" stroke-width="8" fill="none"/><circle cx="${s/2}" cy="${s/2}" r="${r}" stroke="#008C45" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pct/100)}" style="transition:stroke-dashoffset 1s"/></svg><b style="font-size:${s/4.4}px">${pct}%</b></div>`;
}

/* ---------- Gráficos SVG ---------- */
function barChart(data, {h = 180, color = '#0F4C81', color2 = '#008C45', fmt = num} = {}) {
  const max = Math.max(...data.map(d => d.v)) * 1.15 || 1, bw = 34, gap = 22, w = data.length * (bw + gap) + gap;
  return `<svg class="chart" viewBox="0 0 ${w} ${h + 30}" role="img">
    ${[0, .5, 1].map(f => `<line x1="0" x2="${w}" y1="${h - h*f*.87}" y2="${h - h*f*.87}" stroke="#EDF1F5"/>`).join('')}
    ${data.map((d, i) => { const bh = d.v / max * h, x = gap + i * (bw + gap); return `<rect x="${x}" y="${h - bh}" width="${bw}" height="${bh}" rx="8" fill="${i === data.length - 1 ? color2 : color}" opacity="${i === data.length - 1 ? 1 : .85}"><title>${d.l}: ${fmt(d.v)}</title></rect><text x="${x + bw/2}" y="${h - bh - 6}" text-anchor="middle" style="font-weight:700;fill:#334155">${fmt(d.v)}</text><text x="${x + bw/2}" y="${h + 18}" text-anchor="middle">${d.l}</text>`; }).join('')}
  </svg>`;
}
function lineChart(data, {h = 180, color = '#008C45', fmt = num} = {}) {
  const w = 520, max = Math.max(...data.map(d => d.v)) * 1.15 || 1, step = (w - 40) / (data.length - 1);
  const pts = data.map((d, i) => [20 + i * step, h - d.v / max * (h - 10)]);
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const gid = 'lg' + uid();
  return `<svg class="chart" viewBox="0 0 ${w} ${h + 28}" role="img"><defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".25"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    ${[0, .5, 1].map(f => `<line x1="0" x2="${w}" y1="${h - (h-10)*f*.87}" y2="${h - (h-10)*f*.87}" stroke="#EDF1F5"/>`).join('')}
    <path d="${path} L${pts[pts.length-1][0]} ${h} L${pts[0][0]} ${h} Z" fill="url(#${gid})"/>
    <path d="${path}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#fff" stroke="${color}" stroke-width="2.5"><title>${data[i].l}: ${fmt(data[i].v)}</title></circle><text x="${p[0]}" y="${h + 20}" text-anchor="middle">${data[i].l}</text>`).join('')}
    <text x="${pts[pts.length-1][0]}" y="${pts[pts.length-1][1] - 12}" text-anchor="end" style="font-weight:800;fill:${color}">${fmt(data[data.length-1].v)}</text>
  </svg>`;
}
function donut(segs, {s = 170, label = '', sub = ''} = {}) {
  const tot = segs.reduce((a, x) => a + x.v, 0) || 1, r = 62, c = 2 * Math.PI * r; let off = 0;
  return `<div class="row" style="gap:22px;align-items:center;flex-wrap:nowrap"><svg width="${s}" height="${s}" viewBox="0 0 170 170" style="flex-shrink:0">
    <g transform="rotate(-90 85 85)">${segs.map(x => { const l = x.v / tot * c; const el = `<circle cx="85" cy="85" r="${r}" fill="none" stroke="${x.c}" stroke-width="22" stroke-dasharray="${l} ${c - l}" stroke-dashoffset="${-off}"><title>${x.l}: ${Math.round(x.v/tot*100)}%</title></circle>`; off += l; return el; }).join('')}</g>
    <text x="85" y="83" text-anchor="middle" style="font-size:22px;font-weight:800;fill:#0D1B2A;font-family:var(--font)">${label}</text><text x="85" y="102" text-anchor="middle" style="font-size:11px;fill:#66768A;font-family:var(--font)">${sub}</text></svg>
    <div class="legend" style="flex-direction:column">${segs.map(x => `<span><i style="background:${x.c}"></i>${x.l} · <b>${Math.round(x.v/tot*100)}%</b></span>`).join('')}</div></div>`;
}
const hbars = (rows, fmt = v => v + '%') => `<div class="hbars">${rows.map(r => `<div class="hb"><span title="${esc(r.l)}">${esc(r.l)}</span>${progress(r.p, r.cls || '')}<b class="small">${fmt(r.v ?? r.p)}</b></div>`).join('')}</div>`;

/* ---------- Mapa-múndi em pontos ---------- */
const LAND = [
  [[-168,66],[-140,70],[-100,72],[-80,72],[-62,60],[-55,50],[-66,44],[-75,38],[-80,31],[-81,25],[-97,26],[-97,20],[-90,16],[-83,9],[-78,8],[-92,15],[-105,20],[-115,30],[-124,40],[-125,48],[-135,58],[-150,60],[-165,60]],
  [[-55,60],[-44,60],[-20,70],[-20,80],[-60,82],[-72,77]],
  [[-78,8],[-60,10],[-50,0],[-35,-5],[-38,-15],[-48,-28],[-58,-38],[-65,-42],[-68,-55],[-75,-50],[-72,-30],[-70,-18],[-81,-5],[-80,2]],
  [[-10,36],[-9,43],[-2,44],[-5,48],[0,50],[5,53],[8,57],[5,62],[15,69],[28,71],[40,67],[60,68],[60,45],[40,42],[28,41],[22,37],[15,38],[12,44],[5,43],[0,38]],
  [[-6,50],[2,51],[0,54],[-3,58],[-6,56]],
  [[-17,21],[-10,30],[-5,36],[10,37],[20,32],[32,31],[35,28],[43,12],[51,12],[40,-5],[40,-15],[35,-25],[20,-35],[17,-30],[12,-15],[13,-5],[9,4],[-5,5],[-15,10]],
  [[44,-25],[50,-15],[48,-12],[43,-20]],
  [[28,41],[40,42],[60,45],[60,68],[80,73],[110,77],[140,72],[180,68],[170,60],[155,58],[140,50],[130,42],[122,30],[120,22],[108,15],[105,9],[100,13],[98,8],[92,22],[80,15],[77,8],[72,20],[66,25],[57,25],[52,15],[43,12],[35,28],[35,36]],
  [[95,5],[105,-6],[120,-9],[140,-8],[150,-6],[130,0],[118,5],[108,2],[100,2]],
  [[130,31],[135,34],[141,38],[142,45],[140,41],[135,36]],
  [[114,-22],[122,-17],[130,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[141,-38],[131,-31],[115,-34]],
  [[167,-46],[174,-41],[178,-38],[172,-34]]
];
const inPoly = (x, y, p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { if (((p[i][1] > y) !== (p[j][1] > y)) && (x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0])) c = !c; } return c; };
let DOTS = null;
function worldDots() {
  if (DOTS) return DOTS; const out = [];
  for (let lat = 80; lat > -58; lat -= 3) for (let lng = -170; lng < 180; lng += 3) if (LAND.some(p => inPoly(lng, lat, p))) out.push([lng, lat]);
  return DOTS = out;
}
const proj = (lng, lat) => [(lng + 180) / 360 * 1000, (84 - lat) / 144 * 420];
function worldMap(points) {
  const dots = worldDots().map(([lng, lat]) => { const [x, y] = proj(lng, lat); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#C9D6E4"/>`; }).join('');
  const pts = points.map(p => { const [x, y] = proj(p.lng, p.lat); return `<a href="${p.link}" class="pt" data-tip="${esc(p.tip)}"><circle cx="${x}" cy="${y}" r="16" fill="${p.c || '#008C45'}" opacity=".16"/><circle class="p" cx="${x}" cy="${y}" r="7" fill="${p.c || '#008C45'}" stroke="#fff" stroke-width="2.5"/>${p.n > 1 ? `<text x="${x}" y="${y - 12}" text-anchor="middle" style="font-size:11px;font-weight:800;fill:#0D1B2A">${p.n}</text>` : ''}</a>`; }).join('');
  return `<div class="map card"><svg viewBox="0 0 1000 420" role="img" aria-label="Mapa mundial">${dots}${pts}</svg><div class="map-tip"></div></div>`;
}

/* ---------- Toast / Modal ---------- */
function toast(html, icon = 'check', link = '', linkText = '') {
  const el = document.createElement('div'); el.className = 'toast';
  el.innerHTML = `<span class="ti">${I(icon, 16)}</span><div>${html}${link ? ` <a href="${link}">${linkText}</a>` : ''}</div>`;
  $('#toast-root').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 4200);
}
function openModal(title, body, foot = '', cls = '') {
  $('#modal-root').innerHTML = `<div class="ov" data-act="ov-close"><div class="modal ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    ${title ? `<div class="modal-h"><h3>${title}</h3><button class="icon-btn" data-act="close" aria-label="Fechar">${I('x')}</button></div>` : ''}
    <div class="modal-b">${body}</div>${foot ? `<div class="modal-f">${foot}</div>` : ''}</div></div>`;
  document.body.style.overflow = 'hidden';
  const f = $('#modal-root input:not([type=hidden]):not([type=radio]):not([type=checkbox]), #modal-root textarea'); if (f && window.innerWidth > 720) setTimeout(() => f.focus(), 50);
}
function closeModal() { $('#modal-root').innerHTML = ''; document.body.style.overflow = ''; }
function printHTML(html) {
  $('#print-root').innerHTML = html; document.body.classList.add('printing');
  setTimeout(() => { window.print(); }, 60);
}
window.addEventListener('afterprint', () => { document.body.classList.remove('printing'); $('#print-root').innerHTML = ''; });

/* ---------- Roteador ---------- */
let CUR = {parts: [], q: {}};
const PAGES = {};
const ACT = {};
const POST = [];
const after = fn => POST.push(fn);

function parseHash() {
  const h = location.hash.slice(1) || '/';
  let [path, qs] = h.split('?');
  path = path.split('#')[0];
  const q = Object.fromEntries(new URLSearchParams(qs || ''));
  return {path, parts: path.split('/').filter(Boolean), q};
}
function render(keepScroll = false) {
  const y = window.scrollY;
  CUR = parseHash();
  const key = CUR.parts[0] || '';
  const fn = PAGES[key] || PAGES['404'];
  let html;
  try { html = fn(...CUR.parts.slice(1)); }
  catch (err) { console.error(err); html = `<div class="wrap">${emptyBox('alert', 'Algo deu errado nesta página', 'Tente voltar ao início.', '<a class="btn btn-primary" href="#/">Início</a>')}</div>`; }
  $('#app').innerHTML = demoBar() + header() + `<main id="main">${html}</main>` + footer();
  POST.splice(0).forEach(f => { try { f(); } catch (e) { console.error(e); } });
  bindMapTips();
  window.scrollTo(0, keepScroll ? y : 0);
  save();
}
const rerender = () => render(true);
const go = h => { if (location.hash === h) rerender(); else location.hash = h; };
window.addEventListener('hashchange', () => { closeModal(); render(); });

/* ---------- Barra de demonstração / cabeçalho / rodapé ---------- */
function demoBar() {
  const r = S.role;
  return `<div class="demobar"><div class="wrap"><span>${I('info', 14)} <b>Demonstração interativa</b> · todos os dados, ONGs e transações são fictícios</span>
    <div class="row-sm"><span class="xs" style="opacity:.8">Ver como:</span><div class="roles">
      <button class="${r === 'visitor' ? 'on' : ''}" data-act="role" data-r="visitor">Visitante</button>
      <button class="${r === 'volunteer' ? 'on' : ''}" data-act="role" data-r="volunteer">Voluntária</button>
      <button class="${r === 'ong' ? 'on' : ''}" data-act="role" data-r="ong">ONG</button></div></div></div></div>`;
}
const NAV = [['', 'Início', 'home'], ['explorar', 'Explorar ONGs', 'compass'], ['oportunidades', 'Encontrar oportunidades', 'search'], ['eventos', 'Eventos', 'cal'], ['vaquinhas', 'Vaquinhas', 'coins'], ['como-funciona', 'Como funciona', 'info'], ['sobre', 'Sobre a 12Help!', 'globe']];
function header() {
  const k = CUR.parts[0] || '';
  const unreadN = S.notifs.filter(n => n.role === roleKey() && !n.read).length;
  const unreadM = S.threads.filter(t => t.role === roleKey() && t.unread).length;
  const me = isOng() ? null : S.me, g = ongById(MY_ONG);
  const right = S.role === 'visitor'
    ? `<a href="#/entrar" class="btn btn-ghost">Entrar</a><a href="#/cadastro?tipo=ong" class="btn btn-primary">Cadastrar minha ONG</a>`
    : `<div class="rel"><button class="icon-btn" data-act="notif-toggle" aria-label="Notificações">${I('bell', 20)}${unreadN ? `<span class="badge-n">${unreadN}</span>` : ''}</button><div id="notif-drop"></div></div>
       <a class="icon-btn" href="#/mensagens" aria-label="Mensagens">${I('msg', 20)}${unreadM ? `<span class="badge-n">${unreadM}</span>` : ''}</a>
       <div class="rel"><button class="icon-btn" data-act="user-toggle" aria-label="Menu da conta" style="width:auto;padding:0 4px">${isOng() ? ongLogo(g, 34) : avatar(me, 34)}</button><div id="user-drop"></div></div>`;
  return `<header class="hdr"><div class="wrap">${logo()}
    <nav class="nav" aria-label="Menu principal">${NAV.map(([h, l]) => `<a href="#/${h}" class="${k === h ? 'on' : ''}">${l}</a>`).join('')}</nav>
    <div class="hdr-r"><button class="icon-btn" data-act="gsearch" aria-label="Buscar">${I('search', 20)}</button>${right}
      <button class="icon-btn burger" data-act="burger" aria-label="Abrir menu">${I('menu', 22)}</button></div></div></header>
    <div class="mnav" id="mnav">${NAV.map(([h, l, i]) => `<a href="#/${h}">${I(i)} ${l}</a>`).join('')}
      ${isVol() ? `<a href="#/v/painel">${I('grid')} Área do voluntário</a>` : isOng() ? `<a href="#/o/dashboard">${I('grid')} Painel da ONG</a>` : `<a href="#/entrar">${I('user')} Entrar</a><a href="#/cadastro">${I('plus')} Criar conta</a>`}
      <a href="#/impacto">${I('chart')} Estatísticas de impacto</a><a href="#/conhecimento">${I('book')} Central de conhecimento</a><a href="#/seguranca">${I('shield')} Segurança e confiança</a></div>`;
}
function footer() {
  return `<footer class="foot"><div class="wrap"><div class="grid fgrid">
    <div>${logo(true)}<p style="margin-top:14px;max-width:300px">Conectando pessoas a causas que transformam o mundo.</p>
      <div class="row-sm" style="margin-top:10px"><span class="tag" style="background:rgba(255,255,255,.08);color:#fff">${I('globe', 13)} 63 países</span><span class="tag" style="background:rgba(255,255,255,.08);color:#fff">${I('users', 13)} 248 mil voluntários</span></div></div>
    <div><h4>Plataforma</h4><a href="#/explorar">Explorar ONGs</a><a href="#/oportunidades">Oportunidades</a><a href="#/eventos">Eventos</a><a href="#/vaquinhas">Vaquinhas</a><a href="#/busca">Busca global</a></div>
    <div><h4>Comunidade</h4><a href="#/historias">Histórias de impacto</a><a href="#/conhecimento">Central de conhecimento</a><a href="#/impacto">Estatísticas</a><a href="#/perfil/livia">Perfil público (exemplo)</a></div>
    <div><h4>Para ONGs</h4><a href="#/cadastro?tipo=ong">Cadastrar ONG</a><a href="#/o/dashboard">Painel da ONG</a><a href="#/conhecimento/ongs-voluntarios">Engajar voluntários</a><a href="#/como-funciona">Como funciona</a></div>
    <div><h4>Confiança</h4><a href="#/seguranca">Segurança</a><a href="#/seguranca#diretrizes">Diretrizes de convivência</a><a href="#/seguranca#privacidade">Privacidade</a><a href="#/sobre">Sobre a 12Help!</a></div></div>
    <div class="foot-b"><span>© 2026 12Help! · Projeto demonstrativo. Organizações, pessoas e valores são fictícios; nenhuma transação real é realizada.</span><span>Feito com ${I('heart', 13)} para quem transforma.</span></div></div></footer>`;
}

/* =========================================================
   PÁGINAS PÚBLICAS
   ========================================================= */

/* ---------- Início ---------- */
PAGES[''] = () => {
  const popular = [...allOpps()].sort((a, b) => b.filled / b.vagas - a.filled / a.vagas).slice(0, 6);
  const recs = isVol() ? recommended() : [];
  const featured = ['raizes', 'amazonia', 'bright', 'kizuna', 'laco', 'reef'].map(ongById);
  const counts = Object.fromEntries(Object.keys(CATS).map(k => [k, allOpps().filter(o => o.cat === k).length]));
  return `
  <section class="hero"><div class="wrap">
    <div class="fade">
      <span class="eyebrow">${I('globe', 15)} Plataforma global de voluntariado</span>
      <h1 style="margin-top:14px">Existe uma causa <span>esperando por você.</span></h1>
      <p class="lead">Encontre oportunidades, conecte-se a organizações e transforme realidades. O voluntariado que muda o mundo começa aqui.</p>
      <form class="searchbar" data-form="hero-search">
        ${I('search', 20)}<input name="q" placeholder="Busque por causa, cidade ou habilidade" aria-label="Buscar oportunidades">
        <select name="cat" aria-label="Categoria"><option value="">Todas as categorias</option>${Object.entries(CATS).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join('')}</select>
        <button class="btn btn-primary">Buscar</button>
      </form>
      <div class="row" style="margin-top:20px"><a href="#/oportunidades" class="btn btn-blue btn-lg">${I('search', 18)} Encontrar oportunidades</a><a href="#/cadastro?tipo=ong" class="btn btn-outline btn-lg">${I('plus', 18)} Cadastrar minha ONG</a></div>
      <div class="trust"><div class="stackav">${['lucas', 'ana', 'camila', 'yuki', 'thandi'].map(id => avatar(VOL_MAP[id], 34)).join('')}</div><span><b style="color:var(--ink)">248.930 voluntários</b> em 63 países já encontraram sua causa</span></div>
    </div>
    <div class="collage fade" aria-hidden="true">
      <div class="ph ph1">${cover('amb', 'hero1', 'Plantio · Joinville, BR', true)}</div>
      <div class="ph ph2">${cover('edu', 'hero2', 'Leitura · Nova York, US', true)}</div>
      <div class="ph ph3">${cover('ali', 'hero3', 'Cozinha solidária · Recife, BR', true)}</div>
      <div class="ph ph4">${cover('emg', 'hero4', 'Sendai, JP', true)}</div>
      <div class="float f1"><span class="av" style="width:38px;height:38px;background:var(--green-l);color:var(--green)">${I('sparkle', 18)}</span><div><b>98% de compatibilidade</b><span class="muted">com o seu perfil</span></div></div>
      <div class="float f2"><span class="av" style="width:38px;height:38px;background:var(--blue-l);color:var(--blue)">${I('award', 18)}</span><div><b>Guardião da Natureza</b><span class="muted">nova medalha</span></div></div>
      <div class="float f3"><span class="av" style="width:38px;height:38px;background:#FFF5DF;color:#9A5B0B">${I('clock', 18)}</span><div><b>3,2 mi de horas</b><span class="muted">doadas este ano</span></div></div>
    </div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Categorias</span><h2>Escolha como quer transformar</h2></div><a href="#/oportunidades" class="link">Ver todas as oportunidades ${I('arrow', 15)}</a></div>
    <div class="cats">${Object.entries(CATS).map(([k, c]) => `<a class="cat fade" href="#/oportunidades?cat=${k}" style="--g1:${c.g[0]};--g2:${c.g[1]}"><span class="ci">${I(c.i, 22)}</span><b>${c.n}</b><span class="small muted">${counts[k]} oportunidades</span></a>`).join('')}</div>
  </div></section>

  ${isVol() ? `<section class="sec-sm"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">${I('sparkle', 14)} Combinações para você</span><h2>Encontramos ${recs.length} oportunidades que combinam com você</h2><p>Baseado nos seus interesses, habilidades, localização e disponibilidade.</p></div><a href="#/v/match" class="link">Ver todas ${I('arrow', 15)}</a></div>
    <div class="grid auto">${recs.slice(0, 3).map(x => oppCard(x.o)).join('')}</div></div></section>` : ''}

  <section class="sec-sm"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Projetos populares</span><h2>Oportunidades com alta procura</h2><p>Vagas preenchendo rápido em diferentes partes do mundo.</p></div><a href="#/oportunidades" class="link">Explorar ${I('arrow', 15)}</a></div>
    <div class="grid auto">${popular.map(oppCard).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">ONGs em destaque</span><h2>Organizações recomendadas pela 12Help!</h2><p>Selecionadas pela qualidade da experiência dos voluntários e pelo impacto documentado.</p></div><a href="#/explorar" class="link">Explorar ONGs ${I('arrow', 15)}</a></div>
    <div class="grid auto">${featured.map(ongCard).join('')}</div>
  </div></section>

  <section class="sec-sm"><div class="wrap"><div class="band">
    <div class="row between" style="position:relative;z-index:1;margin-bottom:28px"><div><span class="eyebrow" style="color:#7FE0A8">Impacto coletivo</span><h2 style="color:#fff;margin-top:8px">Uma rede global que não para de crescer</h2></div><a href="#/impacto" class="btn btn-white">Ver estatísticas ${I('arrow', 16)}</a></div>
    <div class="grid g4" style="position:relative;z-index:1">${[['248.930', 'voluntários ativos'], ['12.480', 'ONGs cadastradas'], ['3,2 mi', 'horas de voluntariado'], ['R$ 18,7 mi', 'arrecadados em vaquinhas']].map(([n, l]) => `<div><div class="num">${n}</div><div class="lbl">${l}</div></div>`).join('')}</div>
  </div></div></section>

  <section class="sec"><div class="wrap">${howBlock()}</div></section>

  <section class="sec-sm"><div class="wrap"><div class="grid g2">
    <div><div class="sec-head"><div><span class="eyebrow">Eventos próximos</span><h2>Encontros, mutirões e oficinas</h2></div><a href="#/eventos" class="link">Calendário ${I('arrow', 15)}</a></div>
      <div class="stack">${allEvents().slice(0, 3).map(eventCard).join('')}</div></div>
    <div><div class="sec-head"><div><span class="eyebrow">Vaquinhas</span><h2>Campanhas perto da meta</h2></div><a href="#/vaquinhas" class="link">Ver todas ${I('arrow', 15)}</a></div>
      <div class="stack">${allCamps().sort((a, b) => b.raisedNow / b.goal - a.raisedNow / a.goal).slice(0, 3).map(c => { const g = ongById(c.ong), p = c.raisedNow / c.goal * 100; return `<a href="#/vaquinha/${c.id}" class="card pad-s lift fade" style="display:flex;gap:14px;align-items:center"><div style="width:84px;height:84px;border-radius:14px;overflow:hidden;flex-shrink:0">${cover(c.cat, c.id)}</div><div style="flex:1;min-width:0"><b>${esc(c.title)}</b><div class="small muted" style="margin-bottom:6px">${esc(g.name)}</div>${progress(p)}<div class="small" style="margin-top:4px"><b>${money(c.raisedNow)}</b> <span class="muted">de ${money(c.goal)} · ${Math.round(p)}%</span></div></div></a>`; }).join('')}</div></div>
  </div></div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Depoimentos</span><h2>Quem já faz parte da 12Help!</h2></div><a href="#/historias" class="link">Histórias de impacto ${I('arrow', 15)}</a></div>
    <div class="grid g3">${TESTIMONIALS.map((t, i) => `<div class="card quote fade">${stars(5)}<p style="margin-top:12px">“${esc(t.text)}”</p><div class="row" style="gap:10px">${avatar({id:'t' + i, name:t.name}, 40)}<div><b>${esc(t.name)}</b><div class="small muted">${esc(t.role)}</div></div></div></div>`).join('')}</div>
  </div></section>

  <section class="sec-sm"><div class="wrap"><div class="cta">
    <div style="position:relative;z-index:1"><h2 style="color:#fff">Pronto para fazer parte da mudança?</h2><p>Crie seu perfil em 2 minutos, escolha suas causas e receba combinações sob medida. ONGs publicam oportunidades gratuitamente.</p></div>
    <div class="row" style="justify-content:flex-end;position:relative;z-index:1"><a href="#/cadastro?tipo=voluntario" class="btn btn-white btn-lg">Quero ser voluntário</a><a href="#/cadastro?tipo=ong" class="btn btn-lg" style="background:rgba(255,255,255,.14);color:#fff">Cadastrar ONG</a></div>
  </div></div></section>`;
};

function howBlock(tab) {
  const t = tab || window.HOWTAB || 'v';
  const V = [['user', 'Crie seu perfil', 'Conte suas causas, habilidades e disponibilidade. Leva 2 minutos.'], ['sparkle', 'Receba combinações', 'Nosso match analisa interesses, local e agenda para sugerir oportunidades.'], ['check', 'Inscreva-se e converse', 'Demonstre interesse, converse com a ONG e receba a confirmação.'], ['passport', 'Registre seu impacto', 'Horas, medalhas, certificados e carimbos no seu Passaporte 12Help!.']];
  const O = [['shield', 'Cadastre a organização', 'Perfil institucional com causa, local e documentos para verificação.'], ['plus', 'Publique oportunidades', 'Defina atividades, requisitos, horários e número de vagas.'], ['users', 'Encontre voluntários', 'Filtre por habilidades e veja a compatibilidade com cada projeto.'], ['chart', 'Acompanhe resultados', 'Dashboard com inscrições, horas, eventos e campanhas.']];
  return `<div class="sec-head"><div><span class="eyebrow">Como funciona</span><h2>Simples para quem ajuda. Poderoso para quem organiza.</h2></div>
    <div class="tabs"><button class="${t === 'v' ? 'on' : ''}" data-act="howtab" data-t="v">Para voluntários</button><button class="${t === 'o' ? 'on' : ''}" data-act="howtab" data-t="o">Para ONGs</button></div></div>
    <div class="steps">${(t === 'v' ? V : O).map(([i, h, p], n) => `<div class="step fade"><div class="n">${I(i, 20)}</div><span class="xs muted b">PASSO ${n + 1}</span><h3 style="margin-top:4px">${h}</h3><p>${p}</p></div>`).join('')}</div>`;
}

/* ---------- Explorar ONGs ---------- */
const EF = {q: '', country: '', state: '', cat: '', verified: false, view: 'grid'};
PAGES.explorar = () => {
  const list = allOngs().filter(g =>
    (!EF.q || norm(g.name + g.tagline + g.city + g.desc).includes(norm(EF.q))) &&
    (!EF.country || g.country === EF.country) && (!EF.state || g.state === EF.state) &&
    (!EF.cat || g.cat === EF.cat) && (!EF.verified || g.verified));
  const states = [...new Set(ONGS.filter(g => g.country === 'BR').map(g => g.state))].sort();
  const groups = {}; list.forEach(g => { const k = g.city; (groups[k] = groups[k] || {lat:g.lat, lng:g.lng, items:[]}).items.push(g); });
  return `<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}Explorar ONGs</div>
    <h1>Explore organizações pelo mundo</h1><p>${ONGS.length} organizações fictícias em ${Object.keys(COUNTRIES).length} países, com projetos em todas as categorias de impacto.</p></div></div>
    <div class="wrap" style="padding-top:24px">
      <div class="card pad-s row" style="gap:10px;margin-bottom:22px">
        <div class="row-sm" style="flex:1;min-width:220px">${I('search', 18)}<input class="input input-sm" style="border:0;box-shadow:none" placeholder="Buscar organização, cidade ou causa" value="${esc(EF.q)}" data-ef="q" aria-label="Buscar organização"></div>
        <select class="input input-sm" style="width:auto" data-ef="country" aria-label="País"><option value="">Todos os países</option>${Object.entries(COUNTRIES).map(([k, c]) => `<option value="${k}" ${EF.country === k ? 'selected' : ''}>${c.f} ${c.n}</option>`).join('')}</select>
        ${EF.country === 'BR' ? `<select class="input input-sm" style="width:auto" data-ef="state" aria-label="Estado"><option value="">Todos os estados</option>${states.map(s => `<option ${EF.state === s ? 'selected' : ''}>${s}</option>`).join('')}</select>` : ''}
        <select class="input input-sm" style="width:auto" data-ef="cat" aria-label="Causa"><option value="">Todas as causas</option>${Object.entries(CATS).map(([k, c]) => `<option value="${k}" ${EF.cat === k ? 'selected' : ''}>${c.n}</option>`).join('')}</select>
        <label class="check"><input type="checkbox" data-ef="verified" ${EF.verified ? 'checked' : ''}> Com selo (demo)</label>
        <div class="tabs"><button class="${EF.view === 'grid' ? 'on' : ''}" data-act="ef-view" data-v="grid">${I('grid', 15)} Grade</button><button class="${EF.view === 'map' ? 'on' : ''}" data-act="ef-view" data-v="map">${I('map', 15)} Mapa</button></div>
      </div>
      <div class="results-h"><h2>${list.length} organizaç${list.length === 1 ? 'ão' : 'ões'}</h2>${(EF.q || EF.country || EF.cat || EF.verified) ? `<button class="btn btn-sm btn-ghost" data-act="ef-clear">${I('x', 14)} Limpar filtros</button>` : ''}</div>
      ${!list.length ? emptyBox('search', 'Nenhuma organização encontrada', 'Ajuste os filtros para ver mais resultados.') :
        EF.view === 'map' ? `${worldMap(Object.entries(groups).map(([city, g]) => ({lat:g.lat, lng:g.lng, n:g.items.length, link:'#/ong/' + g.items[0].id, tip:`<b>${city}</b><br>${g.items.map(x => esc(x.name)).join('<br>')}`, c:g.items[0].c})))}
          <div class="grid auto" style="margin-top:22px">${list.map(ongCard).join('')}</div>` :
        `<div class="grid auto">${list.map(ongCard).join('')}</div>`}
    </div>`;
};

/* ---------- Perfil público da ONG ---------- */
PAGES.ong = id => {
  const g = ongById(id); if (!g) return PAGES['404']();
  const opps = allOpps().filter(o => o.ong === id), evs = allEvents().filter(e => e.ong === id), camps = allCamps().filter(c => c.ong === id);
  const blocked = isBlocked('ong', id), fav = S.favOngs.includes(id);
  const revs = [0, 1, 2].map(i => { const r = REVIEWS[(hash(id) + i * 2) % REVIEWS.length], v = VOLS[(hash(id) + i * 3) % VOLS.length]; return {r, v: v.minor ? VOLS[0] : v}; });
  return `<div class="ohero">${cover(g.cat, id + 'hero', '', true)}</div>
  <div class="wrap">
    <div class="ohead">${ongLogo(g, 120)}
      <div class="ohead-i"><div class="row-sm" style="margin-bottom:6px">${seal(g)}${catTag(g.cat)}</div><h1 style="font-size:clamp(26px,3.4vw,38px);margin-bottom:4px">${esc(g.name)}</h1>
        <div class="meta">${I('pin', 15)} ${esc(g.city)}${g.state ? ', ' + g.state : ''} · ${flag(g.country)} · Fundada em ${g.founded} · ${stars(g.rating)} ${g.rating.toFixed(1)}</div></div>
      <div class="row-sm" style="padding-bottom:8px">
        <button class="btn ${fav ? 'btn-outline' : 'btn-primary'}" data-act="fav-ong" data-id="${id}">${I('heart', 16)} ${fav ? 'Favoritada' : 'Favoritar'}</button>
        <button class="btn btn-blue" data-act="msg-ong" data-id="${id}">${I('msg', 16)} Enviar mensagem</button>
        <button class="btn btn-outline btn-icon" data-act="share" data-url="#/ong/${id}" aria-label="Compartilhar">${I('share', 17)}</button>
        <button class="btn btn-outline btn-icon" data-act="safety-menu" data-type="ong" data-id="${id}" aria-label="Denunciar ou bloquear">${I('dots', 18)}</button>
      </div></div>
    ${blocked ? `<div class="notice" style="margin-top:18px">${I('ban', 18)}<div>Você bloqueou esta organização. Ela não pode enviar mensagens nem convites para você. <a class="link" data-act="unblock" data-type="ong" data-id="${id}" href="#">Desbloquear</a></div></div>` : ''}
    <div class="detail">
      <div class="stack">
        <div class="card pad"><h3>Sobre a organização</h3><p class="muted" style="font-size:15.5px">${esc(g.desc)}</p>
          <div class="grid g4" style="margin-top:8px">${[['users', num(g.vols), 'voluntários'], ['brief', opps.length, 'oportunidades abertas'], ['clock', num(g.vols * 14), 'horas doadas'], ['star', g.rating.toFixed(1), 'avaliação média']].map(([i, v, l]) => `<div class="fact"><span class="fi">${I(i, 17)}</span><div><b>${v}</b><small>${l}</small></div></div>`).join('')}</div></div>
        <div><div class="sec-head" style="margin-bottom:16px"><h2 style="font-size:22px;margin:0">Oportunidades abertas</h2></div>
          ${opps.length ? `<div class="grid auto">${opps.map(oppCard).join('')}</div>` : emptyBox('brief', 'Nenhuma oportunidade aberta no momento')}</div>
        ${evs.length ? `<div><h2 style="font-size:22px">Próximos eventos</h2><div class="stack">${evs.map(eventCard).join('')}</div></div>` : ''}
        ${camps.length ? `<div><h2 style="font-size:22px">Vaquinhas</h2><div class="grid auto">${camps.map(campCard).join('')}</div></div>` : ''}
        <div class="card pad"><div class="card-h"><h3>Avaliações de voluntários</h3><span class="small muted">${stars(g.rating)} ${g.rating.toFixed(1)} · ${Math.round(g.vols / 9)} avaliações</span></div>
          ${revs.map(({r, v}) => `<div class="row" style="align-items:flex-start;padding:12px 0;border-top:1px solid var(--line2);flex-wrap:nowrap">${avatar(v, 38)}<div><b>${esc(v.name)}</b> <span class="small muted">· ${esc(v.city)}</span><div>${stars(r[1], 12)}</div><p class="small" style="margin:4px 0 0;color:var(--ink2)">${esc(r[0])}</p></div></div>`).join('')}
          <p class="xs muted" style="margin:8px 0 0">Avaliações fictícias geradas para a demonstração.</p></div>
      </div>
      <aside class="stack sticky">
        <div class="card pad"><h3>Informações</h3>
          <div class="stack" style="--g:10px">${[['pin', 'Sede', `${g.city}${g.state ? ', ' + g.state : ''} · ${COUNTRIES[g.country].n}`], ['cal', 'Fundação', g.founded], ['link', 'Site', g.site], [CATS[g.cat].i, 'Causa principal', CATS[g.cat].n]].map(([i, l, v]) => `<div class="row-sm" style="flex-wrap:nowrap">${I(i, 17, 'muted')}<div><div class="xs muted b">${l}</div><div class="small">${esc(v)}</div></div></div>`).join('')}</div></div>
        <div class="card pad"><h4>${I('shield', 17)} Confiança e segurança</h4>
          <p class="small muted">${g.verified ? 'O selo exibido é <b>demonstrativo</b>: na versão real indicaria documentos e referências conferidos pela equipe. Nesta demonstração, nenhuma verificação foi realizada.' : 'Esta organização ainda não concluiu o processo de verificação.'}</p>
          <a class="link small" href="#/seguranca">Orientações para interações seguras ${I('arrow', 13)}</a></div>
      </aside>
    </div></div>`;
};

/* ---------- Oportunidades (filtros) ---------- */
const OF_DEFAULT = () => ({q:'', country:'', state:'', city:'', prox:'', cats:[], modes:[], dur:'', days:[], shift:'', age:'', noexp:false, pay:'', imm:false, sort:'match'});
let OF = OF_DEFAULT();
function filterOpps() {
  const me = S.me;
  let list = allOpps().filter(o => {
    const L = oppLoc(o), g = ongById(o.ong);
    if (OF.q && !norm(o.title + ' ' + o.desc + ' ' + g.name + ' ' + L.city + ' ' + o.skills.join(' ') + ' ' + CATS[o.cat].n).includes(norm(OF.q))) return false;
    if (OF.country && L.country !== OF.country) return false;
    if (OF.state && L.state !== OF.state) return false;
    if (OF.city && L.city !== OF.city) return false;
    if (OF.prox) { if (o.mode === 'Remoto') { if (OF.prox !== 'any') return false; } else if (km(me, L) > +OF.prox) return false; }
    if (OF.cats.length && !OF.cats.includes(o.cat)) return false;
    if (OF.modes.length && !OF.modes.includes(o.mode)) return false;
    if (OF.dur && o.dur !== OF.dur) return false;
    if (OF.days.length && o.days[0] !== 'flex' && !o.days.some(d => OF.days.includes(d))) return false;
    if (OF.shift && o.shift !== OF.shift && o.shift !== 'flex') return false;
    if (OF.age && +OF.age < o.age) return false;
    if (OF.noexp && o.exp) return false;
    if (OF.pay === 'none' && o.pay) return false;
    if (OF.pay === 'any' && !o.pay) return false;
    if (OF.pay === 'ajuda' && !(o.pay && o.pay.t === 'ajuda')) return false;
    if (OF.pay === 'bolsa' && !(o.pay && o.pay.t === 'bolsa')) return false;
    if (OF.imm && !o.imm) return false;
    return true;
  });
  const sorters = {
    match: (a, b) => matchOpp(b).score - matchOpp(a).score,
    recent: (a, b) => (b.posted || '').localeCompare(a.posted || ''),
    near: (a, b) => km(me, oppLoc(a)) - km(me, oppLoc(b)),
    vagas: (a, b) => (b.vagas - b.filled) - (a.vagas - a.filled)
  };
  return list.sort(sorters[OF.sort] || sorters.match);
}
const ofCount = () => [OF.q, OF.country, OF.prox, OF.dur, OF.shift, OF.age, OF.pay, OF.noexp, OF.imm].filter(Boolean).length + OF.cats.length + OF.modes.length + OF.days.length;
PAGES.oportunidades = () => {
  if (CUR.q.q !== undefined || CUR.q.cat) { OF = OF_DEFAULT(); if (CUR.q.q) OF.q = CUR.q.q; if (CUR.q.cat) OF.cats = [CUR.q.cat]; history.replaceState(null, '', '#/oportunidades'); }
  const list = filterOpps();
  const all = allOpps(), locs = all.map(oppLoc);
  const states = [...new Set(locs.filter(l => l.country === 'BR' && l.state).map(l => l.state))].sort();
  const cities = [...new Set(locs.filter(l => (!OF.country || l.country === OF.country) && (!OF.state || l.state === OF.state)).map(l => l.city))].sort();
  const chip = (k, v, label) => `<span class="chip ${OF[k].includes(v) ? 'on' : ''}" data-act="of-toggle" data-k="${k}" data-v="${v}">${label}</span>`;
  const sel = (k, opts, ph) => `<select class="input input-sm" data-of="${k}" aria-label="${ph}"><option value="">${ph}</option>${opts.map(([v, l]) => `<option value="${v}" ${String(OF[k]) === String(v) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  return `<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}Encontrar oportunidades</div>
    <h1>Encontrar oportunidades</h1><p>${all.length} oportunidades de voluntariado em ${new Set(locs.map(l => l.country)).size} países. Use os filtros para encontrar a sua.</p>
    <form class="searchbar" data-form="of-search" style="margin-top:20px;box-shadow:var(--sh)">${I('search', 20)}<input name="q" value="${esc(OF.q)}" placeholder="Projeto, organização, cidade ou habilidade" data-of-q aria-label="Buscar"><button class="btn btn-primary">Buscar</button></form></div></div>
  <div class="wrap browse">
    <aside class="card filters" id="filters">
      <div class="row between fclose" style="display:none;margin-bottom:8px"><h3 style="margin:0">Filtros</h3><button class="icon-btn" data-act="filters-close" aria-label="Fechar filtros">${I('x')}</button></div>
      <div class="fgroup"><label>Localização</label><div class="stack" style="--x:0">
        ${sel('country', Object.entries(COUNTRIES).map(([k, c]) => [k, c.f + ' ' + c.n]), 'Todos os países')}
        ${OF.country === 'BR' || !OF.country ? sel('state', states.map(s => [s, s]), 'Todos os estados') : ''}
        ${sel('city', cities.map(c => [c, c]), 'Todas as cidades')}</div></div>
      <div class="fgroup"><label>Proximidade de ${esc(S.me.city)}</label>${sel('prox', [['30', 'Até 30 km'], ['150', 'Até 150 km'], ['800', 'Até 800 km'], ['3000', 'Até 3.000 km'], ['any', 'Qualquer distância']], 'Sem limite (inclui remotas)')}</div>
      <div class="fgroup"><label>Categoria</label><div class="row-sm">${Object.entries(CATS).map(([k, c]) => chip('cats', k, c.n)).join('')}</div></div>
      <div class="fgroup"><label>Modalidade</label>${['Presencial', 'Remoto', 'Híbrido'].map(m => `<label class="check"><input type="checkbox" data-act="of-toggle" data-k="modes" data-v="${m}" ${OF.modes.includes(m) ? 'checked' : ''}> ${m}</label>`).join('')}</div>
      <div class="fgroup"><label>Duração</label>${sel('dur', Object.entries(DUR), 'Qualquer duração')}</div>
      <div class="fgroup"><label>Dias da semana</label><div class="row-sm">${Object.entries(DOWN).map(([k, l]) => chip('days', k, l)).join('')}</div></div>
      <div class="fgroup"><label>Horário</label>${sel('shift', [['manha', 'Manhã'], ['tarde', 'Tarde'], ['noite', 'Noite']], 'Qualquer horário')}</div>
      <div class="fgroup"><label>Faixa etária permitida</label>${sel('age', [['14', 'Tenho 14 ou 15 anos'], ['16', 'Tenho 16 ou 17 anos'], ['18', 'Tenho de 18 a 20 anos'], ['21', 'Tenho 21 anos ou mais']], 'Qualquer idade')}<p class="hint" style="margin:6px 0 0">Menores de 18 anos participam somente com autorização do responsável.</p></div>
      <div class="fgroup"><label>Remuneração / renda</label>${sel('pay', [['none', 'Somente voluntário (sem renda)'], ['any', 'Com algum apoio financeiro'], ['ajuda', 'Ajuda de custo'], ['bolsa', 'Bolsa / hospedagem']], 'Qualquer')}</div>
      <div class="fgroup"><label>Outros</label>
        <label class="check"><input type="checkbox" data-of="noexp" ${OF.noexp ? 'checked' : ''}> Não exige experiência</label>
        <label class="check"><input type="checkbox" data-of="imm" ${OF.imm ? 'checked' : ''}> Disponibilidade imediata</label></div>
      <button class="btn btn-outline btn-block" data-act="of-clear">${I('refresh', 15)} Limpar filtros</button>
      <button class="btn btn-primary btn-block fclose" style="display:none;margin-top:10px" data-act="filters-close">Ver ${list.length} resultados</button>
    </aside>
    <section>
      <div class="results-h"><div><h2>${isVol() ? `Encontramos ${list.length} oportunidades${OF.sort === 'match' ? ' ordenadas por compatibilidade' : ''}` : `${list.length} oportunidade${list.length === 1 ? '' : 's'}`}</h2>${ofCount() ? `<span class="small muted">${ofCount()} filtro(s) ativo(s)</span>` : ''}</div>
        <div class="row-sm"><button class="btn btn-sm btn-outline ftoggle" data-act="filters-open">${I('filter', 15)} Filtros${ofCount() ? ` (${ofCount()})` : ''}</button>
          <select class="input input-sm" style="width:auto" data-of="sort" aria-label="Ordenar">${[['match', 'Mais compatíveis'], ['recent', 'Mais recentes'], ['near', 'Mais próximas'], ['vagas', 'Mais vagas']].map(([v, l]) => `<option value="${v}" ${OF.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
      ${!isVol() ? `<div class="notice info" style="margin-bottom:18px">${I('sparkle', 18)}<div>Entre como voluntária demo para ver a <b>porcentagem de compatibilidade</b> de cada oportunidade com o seu perfil. <a class="link" href="#" data-act="role" data-r="volunteer">Ver como voluntária</a></div></div>` : ''}
      ${list.length ? `<div class="grid auto">${list.map(oppCard).join('')}</div>` : emptyBox('search', 'Nenhuma oportunidade com esses filtros', 'Tente remover alguns filtros ou ampliar a distância.', `<button class="btn btn-primary" data-act="of-clear">Limpar filtros</button>`)}
    </section></div>`;
};

/* ---------- Detalhe da oportunidade ---------- */
PAGES.oportunidade = id => {
  const o = oppById(id); if (!o) return PAGES['404']();
  const g = ongById(o.ong), L = oppLoc(o), m = matchOpp(o), app = S.apps.find(a => a.opp === id && a.status !== 'cancelada');
  const left = Math.max(o.vagas - o.filled, 0), fav = S.favOpps.includes(id), interested = S.interests.includes(id);
  const similar = allOpps().filter(x => x.id !== id && (x.cat === o.cat || x.ong === o.ong)).slice(0, 3);
  const payTxt = o.pay ? (o.pay.t === 'ajuda' ? `Ajuda de custo de ${money(o.pay.v)}/mês` : `Bolsa de apoio de ${money(o.pay.v)}/mês`) : 'Atividade voluntária, sem remuneração';
  return `<div class="wrap" style="padding-top:22px">
    <div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}<a href="#/oportunidades">Oportunidades</a>${I('chev', 13)}${esc(o.title)}</div>
    <div class="dcover">${cover(o.cat, o.id, `${o.mode} · ${esc(L.city)}`, true)}</div>
    <div class="detail">
      <div class="stack">
        <div><div class="row-sm" style="margin-bottom:10px">${catTag(o.cat)}<span class="tag tag-line">${o.mode}</span>${o.imm ? '<span class="tag tag-green">Início imediato</span>' : ''}${o.age < 18 ? `<span class="tag tag-warn">${I('shield', 12)} A partir de ${o.age} anos com autorização</span>` : `<span class="tag tag-gray">A partir de ${o.age} anos</span>`}</div>
          <h1 style="font-size:clamp(26px,3.4vw,38px)">${esc(o.title)}</h1>
          <a href="#/ong/${g.id}" class="org-line" style="font-size:15px">${ongLogo(g, 30)} ${esc(g.name)} ${seal(g)}</a></div>
        <div class="facts">${[
          ['pin', 'Localização', o.mode === 'Remoto' ? `Remoto (organização em ${L.city}, ${COUNTRIES[L.country].n})` : `${L.city}${L.state ? ', ' + L.state : ''} · ${COUNTRIES[L.country].n}`],
          ['cal', 'Horários', `${o.days[0] === 'flex' ? 'Dias flexíveis' : o.days.map(d => DOWN[d]).join(', ')} · ${SHIFT[o.shift]}`],
          ['clock', 'Duração e dedicação', `${DUR[o.dur]} · ${o.hrs}h por semana`],
          ['users', 'Vagas', `${left} disponíveis de ${o.vagas}`],
          ['brief', 'Experiência', o.exp ? 'Exige experiência prévia' : 'Não exige experiência'],
          ['coins', 'Remuneração', payTxt]].map(([i, l, v]) => `<div class="fact"><span class="fi">${I(i, 17)}</span><div><small>${l}</small><b>${esc(v)}</b></div></div>`).join('')}</div>
        <div class="card pad"><h3>Sobre o projeto</h3><p style="color:var(--ink2);font-size:15.5px">${esc(o.desc)}</p>
          <div class="grid g2" style="margin-top:6px">
            <div><h4>Atividades realizadas</h4><ul class="list-check">${o.acts.map(a => `<li>${I('check', 16)}${esc(a)}</li>`).join('')}</ul></div>
            <div><h4>Requisitos</h4><ul class="list-check">${o.reqs.map(a => `<li>${I('check', 16)}${esc(a)}</li>`).join('')}</ul></div></div>
          ${o.bens.length ? `<h4 style="margin-top:18px">Benefícios</h4><div class="row-sm">${o.bens.map(b => `<span class="tag tag-green">${I('sparkle', 12)} ${esc(b)}</span>`).join('')}</div>` : ''}
          <h4 style="margin-top:18px">Habilidades desejadas</h4><div class="row-sm">${o.skills.map(s => `<span class="tag tag-line">${esc(s)}</span>`).join('')}</div>
          <h4 style="margin-top:18px">Dias de atuação</h4><div class="days">${Object.entries(DOWN).map(([k, l]) => `<span class="${o.days.includes(k) || o.days[0] === 'flex' ? 'on' : ''}">${l.slice(0, 3)}</span>`).join('')}</div></div>
        ${o.mode !== 'Remoto' ? `<div class="notice">${I('alert', 18)}<div><b>Atividade presencial.</b> Confirme o endereço pela plataforma, avise alguém de confiança e prefira primeiros encontros em locais públicos ou na sede da organização. <a class="link" href="#/seguranca">Ver orientações</a></div></div>` : ''}
        ${o.age < 18 ? `<div class="notice info">${I('shield', 18)}<div><b>Proteção para menores de idade.</b> Voluntários entre ${o.age} e 17 anos precisam de autorização digital do responsável legal, atuam sempre acompanhados e não podem realizar deslocamentos ou pernoites.</div></div>` : ''}
        ${similar.length ? `<div><h2 style="font-size:22px">Oportunidades semelhantes</h2><div class="grid auto">${similar.map(oppCard).join('')}</div></div>` : ''}
      </div>
      <aside class="stack sticky">
        <div class="card pad">
          ${isVol() ? `<div class="row" style="flex-wrap:nowrap;margin-bottom:14px">${ring(m.score, 88)}<div><b style="font-size:16px">${m.score}% de compatibilidade com seu perfil</b><div class="small muted">Análise de interesses, habilidades, local e agenda</div></div></div>
            <ul class="list-check small" style="margin-bottom:14px">${m.why.map(([i, t]) => `<li>${I(i, 15)}${esc(t)}</li>`).join('')}</ul>` :
            `<div class="notice info" style="margin-bottom:14px">${I('sparkle', 18)}<div>Entre como voluntária para ver sua compatibilidade.</div></div>`}
          <div class="small muted b" style="margin-bottom:6px">${o.filled} de ${o.vagas} vagas preenchidas</div>${progress(o.filled / o.vagas * 100, 'blue')}
          <div style="margin-top:16px" class="stack">
            ${app ? `<div class="notice ${app.status === 'aceita' ? 'ok' : app.status === 'recusada' ? '' : 'info'}">${I(app.status === 'aceita' ? 'check' : 'clock', 18)}<div>Inscrição <b>${app.status}</b> desde ${fmtDate(app.date)}.</div></div><a class="btn btn-outline btn-block" href="#/v/inscricoes">Minhas inscrições</a>`
              : `<button class="btn btn-primary btn-block btn-lg" data-act="apply" data-id="${id}" ${left ? '' : 'disabled'}>${left ? 'Quero me inscrever' : 'Vagas esgotadas'}</button>
                 <button class="btn btn-outline btn-block" data-act="interest" data-id="${id}">${I('star', 16)} ${interested ? 'Interesse demonstrado' : 'Demonstrar interesse'}</button>`}
            <div class="row-sm" style="justify-content:center"><button class="btn btn-ghost btn-sm" data-act="fav-opp" data-id="${id}">${I('heart', 15)} ${fav ? 'Salva' : 'Salvar'}</button><button class="btn btn-ghost btn-sm" data-act="share" data-url="#/oportunidade/${id}">${I('share', 15)} Compartilhar</button><button class="btn btn-ghost btn-sm" data-act="msg-ong" data-id="${g.id}">${I('msg', 15)} Perguntar</button></div>
          </div></div>
        <div class="card pad-s row" style="flex-wrap:nowrap">${ongLogo(g, 48)}<div style="flex:1;min-width:0"><b>${esc(g.name)}</b><div class="small muted">${num(g.vols)} voluntários · ${stars(g.rating, 12)}</div></div><a class="btn btn-sm btn-outline" href="#/ong/${g.id}">Perfil</a></div>
        <p class="xs muted center">Publicada em ${fmtDate(o.posted || todayISO())} · <a href="#" data-act="report" data-type="opp" data-id="${id}" class="link">Denunciar oportunidade</a></p>
      </aside>
    </div></div>`;
};

/* ---------- Eventos ---------- */
const EV = {view:'lista', mode:'', type:'', y:2026, m:10, day:null};
PAGES.eventos = () => {
  const evs = allEvents().filter(e => (!EV.mode || e.mode === EV.mode) && (!EV.type || e.type === EV.type));
  const types = [...new Set(allEvents().map(e => e.type))];
  const mine = evs.filter(e => S.myEvents.includes(e.id));
  let body = '';
  if (EV.view === 'lista') {
    const near = isVol() || true ? evs.filter(e => e.mode !== 'Virtual' && e.country === 'BR' && km(S.me, {lat:ongById(e.ong).lat, lng:ongById(e.ong).lng}) < 400) : [];
    body = `${near.length ? `<h3>${I('pin', 18)} Perto de ${esc(S.me.city)}</h3><div class="grid g2" style="margin-bottom:28px">${near.map(eventCard).join('')}</div>` : ''}
      <h3>Todos os eventos</h3>${evs.length ? `<div class="grid g2">${evs.map(eventCard).join('')}</div>` : emptyBox('cal', 'Nenhum evento com esses filtros')}`;
  } else if (EV.view === 'calendario') {
    const first = new Date(EV.y, EV.m, 1), dim = new Date(EV.y, EV.m + 1, 0).getDate(), off = first.getDay();
    const byDay = {}; evs.forEach(e => { const d = pd(e.date); if (d.getFullYear() === EV.y && d.getMonth() === EV.m) (byDay[d.getDate()] = byDay[d.getDate()] || []).push(e); });
    const sel = EV.day && byDay[EV.day] ? byDay[EV.day] : null;
    body = `<div class="card pad"><div class="card-h"><button class="btn btn-outline btn-icon" data-act="cal-nav" data-d="-1" aria-label="Mês anterior">${I('chevl')}</button><h3>${MESF[EV.m]} ${EV.y}</h3><button class="btn btn-outline btn-icon" data-act="cal-nav" data-d="1" aria-label="Próximo mês">${I('chev')}</button></div>
      <div class="cal">${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => `<div class="dow">${d}</div>`).join('')}
      ${Array.from({length:off}, () => '<div class="day off"></div>').join('')}
      ${Array.from({length:dim}, (_, i) => { const d = i + 1, list = byDay[d] || [], today = EV.y === 2026 && EV.m === 9 && d === 29; return `<div class="day ${today ? 'today' : ''} ${EV.day === d ? 'sel' : ''}" data-act="cal-day" data-d="${d}"><span class="dn">${d}</span>${list.map(e => `<span class="ev ${e.mode === 'Virtual' ? 'v' : ''}" title="${esc(e.title)}">${esc(e.title)}</span>`).join('')}</div>`; }).join('')}</div>
      <div class="legend" style="margin-top:14px"><span><i style="background:var(--green-l);border:1px solid var(--green)"></i>Presencial / híbrido</span><span><i style="background:var(--blue-l);border:1px solid var(--blue)"></i>Virtual</span><span><i style="border:2px solid var(--green)"></i>Hoje (29 out)</span></div></div>
      <div style="margin-top:22px">${sel ? `<h3>Eventos em ${EV.day} de ${MESF[EV.m].toLowerCase()}</h3><div class="grid g2">${sel.map(eventCard).join('')}</div>` : `<p class="muted center">Clique em um dia com eventos para ver os detalhes.</p>`}</div>`;
  } else {
    const groups = {}; evs.forEach(e => { const g = ongById(e.ong); const k = e.mode === 'Virtual' ? 'Online' : e.city; if (k === 'Online') return; (groups[k] = groups[k] || {lat:g.lat, lng:g.lng, items:[]}).items.push(e); });
    const online = evs.filter(e => e.mode === 'Virtual');
    body = `${worldMap(Object.entries(groups).map(([city, g]) => ({lat:g.lat, lng:g.lng, n:g.items.length, link:'#/eventos', tip:`<b>${city}</b><br>${g.items.map(e => esc(e.title) + ' · ' + fmtDate(e.date)).join('<br>')}`, c:'#0F4C81'})))}
      <div class="grid g2" style="margin-top:22px">${Object.entries(groups).map(([city, g]) => `<div class="card pad"><h3>${I('pin', 17)} ${esc(city)} <span class="small muted">· ${g.items.length} evento(s)</span></h3>${g.items.map(e => `<div class="row between" style="padding:8px 0;border-top:1px solid var(--line2)"><div><b class="small">${esc(e.title)}</b><div class="xs muted">${fmtDate(e.date)} · ${e.time}</div></div><button class="btn btn-xs ${S.myEvents.includes(e.id) ? 'btn-outline' : 'btn-primary'}" data-act="event-go" data-id="${e.id}">${S.myEvents.includes(e.id) ? 'Inscrito' : 'Inscrever'}</button></div>`).join('')}</div>`).join('')}
      ${online.length ? `<div class="card pad"><h3>${I('video', 17)} Online <span class="small muted">· ${online.length} evento(s)</span></h3>${online.map(e => `<div class="row between" style="padding:8px 0;border-top:1px solid var(--line2)"><div><b class="small">${esc(e.title)}</b><div class="xs muted">${fmtDate(e.date)} · ${e.time}</div></div><button class="btn btn-xs ${S.myEvents.includes(e.id) ? 'btn-outline' : 'btn-primary'}" data-act="event-go" data-id="${e.id}">${S.myEvents.includes(e.id) ? 'Inscrito' : 'Inscrever'}</button></div>`).join('')}</div>` : ''}</div>`;
  }
  return `<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}Eventos</div>
    <h1>Encontros e eventos</h1><p>Mutirões, plantios, distribuições de alimentos, feiras de adoção, formações e oficinas, presenciais e virtuais.</p></div></div>
    <div class="wrap" style="padding-top:24px">
      <div class="row between" style="margin-bottom:22px">
        <div class="tabs">${[['lista', 'list', 'Lista'], ['calendario', 'cal', 'Calendário'], ['mapa', 'map', 'Por localização']].map(([v, i, l]) => `<button class="${EV.view === v ? 'on' : ''}" data-act="ev-view" data-v="${v}">${I(i, 15)} ${l}</button>`).join('')}</div>
        <div class="row-sm"><select class="input input-sm" style="width:auto" data-ev="mode" aria-label="Formato"><option value="">Todos os formatos</option>${['Presencial', 'Virtual', 'Híbrido'].map(m => `<option ${EV.mode === m ? 'selected' : ''}>${m}</option>`).join('')}</select>
          <select class="input input-sm" style="width:auto" data-ev="type" aria-label="Tipo"><option value="">Todos os tipos</option>${types.map(t => `<option ${EV.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div></div>
      ${mine.length && isVol() ? `<div class="notice ok" style="margin-bottom:22px">${I('check', 18)}<div>Você está inscrita em <b>${mine.length} evento(s)</b>: ${mine.map(e => esc(e.title)).join(', ')}.</div></div>` : ''}
      ${body}
      <div class="notice" style="margin-top:28px">${I('alert', 18)}<div><b>Antes de eventos presenciais:</b> confira o endereço e o horário na plataforma, vá acompanhado quando possível e nunca compartilhe documentos por mensagem. Menores de idade participam apenas com responsável.</div></div>
    </div>`;
};

/* ---------- Vaquinhas ---------- */
const CF = {cat:'', sort:'pct'};
PAGES.vaquinhas = () => {
  let list = allCamps().filter(c => !CF.cat || c.cat === CF.cat);
  const sorts = {pct:(a, b) => b.raisedNow / b.goal - a.raisedNow / a.goal, end:(a, b) => a.deadline.localeCompare(b.deadline), new:(a, b) => b.id.localeCompare(a.id), backers:(a, b) => b.backersNow - a.backersNow};
  list.sort(sorts[CF.sort]);
  const tot = allCamps().reduce((a, c) => a + c.raisedNow, 0), backers = allCamps().reduce((a, c) => a + c.backersNow, 0);
  return `<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}Vaquinhas</div>
    <h1>Vaquinhas e doações</h1><p>Financiamento coletivo para projetos sociais. <b>Demonstração:</b> nenhuma cobrança é realizada; as doações apenas atualizam os indicadores fictícios.</p>
    <div class="grid g3" style="margin-top:22px;max-width:760px">${[['coins', money(tot), 'arrecadados nas campanhas ativas'], ['users', num(backers), 'apoiadores'], ['target', allCamps().length, 'campanhas ativas']].map(([i, v, l]) => `<div class="fact"><span class="fi">${I(i, 17)}</span><div><b>${v}</b><small>${l}</small></div></div>`).join('')}</div></div></div>
    <div class="wrap" style="padding-top:24px">
      <div class="row between" style="margin-bottom:20px"><div class="row-sm"><span class="chip ${!CF.cat ? 'on' : ''}" data-act="cf-cat" data-v="">Todas</span>${[...new Set(CAMPS.map(c => c.cat))].map(k => `<span class="chip ${CF.cat === k ? 'on' : ''}" data-act="cf-cat" data-v="${k}">${CATS[k].n}</span>`).join('')}</div>
        <select class="input input-sm" style="width:auto" data-cf="sort" aria-label="Ordenar">${[['pct', 'Mais perto da meta'], ['end', 'Terminando em breve'], ['backers', 'Mais apoiadores'], ['new', 'Mais recentes']].map(([v, l]) => `<option value="${v}" ${CF.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="grid auto">${list.map(campCard).join('')}</div></div>`;
};
PAGES.vaquinha = id => {
  const c = campById(id); if (!c) return PAGES['404']();
  const g = ongById(c.ong), pct = c.raisedNow / c.goal * 100;
  const mine = S.donations.filter(d => d.camp === id);
  const names = ['Fernanda R.', 'Anônimo', 'Paulo M.', 'Grupo Escoteiro Sol', 'Anônimo', 'Júlia T.', 'Marcos V.', 'Kátia S.'];
  const recent = [...mine.slice().reverse().map(d => ({n:d.anon ? 'Anônimo' : d.name, v:d.v, t:'você · ' + fmtDate(d.date)})), ...names.slice(0, 5).map((n, i) => ({n, v:[50, 100, 25, 300, 20][(hash(id) + i) % 5], t:`há ${i * 3 + 2} h`}))].slice(0, 7);
  return `<div class="wrap" style="padding-top:22px">
    <div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}<a href="#/vaquinhas">Vaquinhas</a>${I('chev', 13)}${esc(c.title)}</div>
    <div class="detail" style="padding-top:8px">
      <div class="stack">
        <div class="dcover">${cover(c.cat, c.id, esc(g.city), true)}</div>
        <div class="grid g3">${[1, 2, 3].map(i => `<div style="height:110px;border-radius:16px;overflow:hidden">${cover(c.cat, c.id + i, '', true)}</div>`).join('')}</div>
        <div><div class="row-sm" style="margin-bottom:10px">${catTag(c.cat)}${pct >= 100 ? '<span class="tag tag-green">' + I('check', 12) + ' Meta atingida</span>' : ''}</div><h1 style="font-size:clamp(26px,3.4vw,38px)">${esc(c.title)}</h1>
          <a href="#/ong/${g.id}" class="org-line" style="font-size:15px">${ongLogo(g, 30)} ${esc(g.name)} ${seal(g)}</a></div>
        <div class="card pad"><h3>Sobre a campanha</h3><p style="color:var(--ink2);font-size:15.5px">${esc(c.desc)}</p>
          <h4>Como os recursos serão usados</h4><ul class="list-check">${(c.uses || []).map(u => `<li>${I('check', 16)}${esc(u)}</li>`).join('')}</ul></div>
        <div class="card pad"><h3>Apoios recentes</h3>${recent.map(r => `<div class="row between" style="padding:10px 0;border-top:1px solid var(--line2)"><div class="row-sm">${avatar({id:r.n, name:r.n}, 32)}<b class="small">${esc(r.n)}</b></div><div class="small"><b>${money(r.v)}</b> <span class="muted">· ${r.t}</span></div></div>`).join('')}</div>
      </div>
      <aside class="stack sticky">
        <div class="card pad" id="donate-box">
          <div class="camp-amt"><b style="font-size:28px">${money(c.raisedNow)}</b></div>
          <div class="small muted" style="margin-bottom:10px">arrecadados de ${money(c.goal)}</div>
          ${progress(pct, 'lg')}
          <div class="row between small" style="margin:10px 0 18px"><span><b>${Math.round(pct)}%</b> da meta</span><span><b>${num(c.backersNow)}</b> apoiadores</span><span><b>${daysLeft(c.deadline)}</b> dias</span></div>
          <div class="flabel">Escolha um valor</div>
          <div class="amounts">${[20, 50, 100, 250, 500, 1000].map(v => `<button data-act="amt" data-v="${v}" class="${v === 50 ? 'on' : ''}">${money(v)}</button>`).join('')}</div>
          <div class="field" style="margin-top:12px"><span>Outro valor (R$)</span><input class="input" type="number" min="5" step="1" id="amt-custom" placeholder="Ex.: 75"></div>
          <label class="check" style="margin-bottom:12px"><input type="checkbox" id="amt-anon"> Doar anonimamente</label>
          <button class="btn btn-primary btn-block btn-lg" data-act="donate" data-id="${id}">${I('heart', 18)} Simular doação</button>
          <p class="xs muted center" style="margin:10px 0 0">${I('lock', 12)} Simulação: nenhum pagamento real é processado.</p>
          ${mine.length ? `<div class="notice ok" style="margin-top:14px">${I('check', 17)}<div>Você já apoiou com <b>${money(mine.reduce((a, d) => a + d.v, 0))}</b>.</div></div>` : ''}
        </div>
        <div class="row-sm" style="justify-content:center"><button class="btn btn-ghost btn-sm" data-act="fav-camp" data-id="${id}">${I('bookmark', 15)} ${S.favCamps.includes(id) ? 'Acompanhando' : 'Acompanhar'}</button><button class="btn btn-ghost btn-sm" data-act="share" data-url="#/vaquinha/${id}">${I('share', 15)} Compartilhar</button></div>
      </aside></div></div>`;
};

/* ---------- Como funciona ---------- */
PAGES['como-funciona'] = () => `<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}Como funciona</div>
  <h1>Como a 12Help! funciona</h1><p>Uma plataforma, duas experiências conectadas: voluntários encontram causas, organizações encontram pessoas.</p></div></div>
  <div class="wrap"><section class="sec-sm">${howBlock()}</section>
  <section class="sec-sm"><div class="grid g2" style="align-items:center">
    <div><span class="eyebrow">${I('sparkle', 14)} Sistema de match</span><h2>Compatibilidade de verdade, não só palavras-chave</h2>
      <p class="muted">O algoritmo da 12Help! (simulado nesta demonstração) cruza seis dimensões para calcular a porcentagem de compatibilidade entre voluntários e oportunidades. As ONGs veem a mesma análise ao buscar voluntários.</p>
      <ul class="list-check">${['Interesses e causas escolhidas no cadastro', 'Habilidades declaradas e adquiridas', 'Localização e distância até a atividade', 'Dias, horários e modalidade disponíveis', 'Experiência prévia e requisitos', 'Preferências pessoais e faixa etária'].map(x => `<li>${I('check', 16)}${x}</li>`).join('')}</ul></div>
    <div class="card pad"><div class="row" style="flex-wrap:nowrap">${ring(98)}<div><b style="font-size:18px">98% de compatibilidade</b><div class="muted small">Mutirão de reflorestamento · Joinville</div></div></div>
      ${hbars([{l:'Interesses', p:100}, {l:'Habilidades', p:84}, {l:'Localização', p:100}, {l:'Disponibilidade', p:92}, {l:'Experiência', p:76}])}</div></div></section>
  <section class="sec-sm"><div class="grid g3">${[['award', 'Gamificação saudável', 'Pontos, níveis e medalhas celebram a constância, sem rankings agressivos.'], ['passport', 'Passaporte 12Help!', 'Cada experiência vira um carimbo no seu passaporte digital de impacto.'], ['file', 'Currículo voluntário', 'Horas, habilidades e recomendações em um currículo pronto para exportar.'], ['msg', 'Mensagens seguras', 'Converse com ONGs pela plataforma, com denúncia e bloqueio a um clique.'], ['coins', 'Vaquinhas transparentes', 'Metas, prazos e uso dos recursos visíveis para cada campanha.'], ['shield', 'Proteção de menores', 'Autorização de responsáveis e visibilidade restrita para menores de 18 anos.']].map(([i, h, p]) => `<div class="card pad fade"><div class="step" style="padding:0;border:0"><div class="n">${I(i, 20)}</div></div><h3>${h}</h3><p class="muted small" style="margin:0">${p}</p></div>`).join('')}</div></section>
  <section class="sec-sm"><h2>Perguntas frequentes</h2><div class="card pad">${[['A 12Help! é gratuita?', 'Sim. Para voluntários e ONGs, o cadastro e o uso são gratuitos. Nesta demonstração, nenhum valor é cobrado e as doações são simuladas.'], ['Preciso ter experiência para ser voluntário?', 'Não. Use o filtro “Não exige experiência” para encontrar oportunidades abertas a iniciantes.'], ['Menores de idade podem participar?', 'Sim, a partir de 14 anos em atividades compatíveis, com autorização do responsável legal e supervisão. Perfis de menores têm visibilidade restrita.'], ['Como as ONGs são verificadas?', 'Na versão real, por análise documental e referências. Nesta demonstração os selos são apenas ilustrativos e nenhuma verificação real foi feita.'], ['Posso exportar meu currículo e certificados?', 'Sim. Na área do voluntário, use “Exportar PDF” no currículo e “Emitir certificado” nas experiências concluídas.']].map(([q, a]) => `<details class="acc"><summary>${q}${I('chev', 18)}</summary><p>${a}</p></details>`).join('')}</div></section></div>`;

/* ---------- Sobre ---------- */
PAGES.sobre = () => `<section class="hero"><div class="wrap" style="grid-template-columns:1fr;max-width:900px;text-align:center;padding-bottom:56px">
  <div><span class="eyebrow">Sobre a 12Help!</span><h1 style="margin-top:14px">Conectando pessoas a causas que <span>transformam o mundo.</span></h1>
  <p class="lead" style="margin:0 auto">A 12Help! nasceu da ideia de que ninguém precisa salvar o mundo sozinho, mas todo mundo pode ajudar um pouco. Somos a infraestrutura digital que aproxima quem quer ajudar de quem precisa de ajuda, em qualquer lugar do planeta.</p></div></div></section>
  <div class="wrap">
  <section class="sec-sm"><div class="grid g3">${[['target', 'Missão', 'Facilitar que cada pessoa encontre a causa certa e que cada organização encontre as pessoas certas.'], ['eye', 'Visão', 'Ser a principal rede global de voluntariado até 2030, com 10 milhões de horas doadas por ano.'], ['heart', 'Valores', 'Confiança, inclusão, transparência, respeito às comunidades e impacto mensurável.']].map(([i, h, p]) => `<div class="card pad fade"><div class="step" style="padding:0;border:0"><div class="n">${I(i, 20)}</div></div><h3>${h}</h3><p class="muted" style="margin:0">${p}</p></div>`).join('')}</div></section>
  <section class="sec-sm"><div class="sec-head"><div><span class="eyebrow">Trajetória</span><h2>Do primeiro mutirão a 63 países</h2></div></div>
    <div class="card pad"><div class="timeline">${[['2022', 'A ideia', 'Dois amigos organizam um mutirão em Joinville e percebem como era difícil encontrar voluntários.'], ['2023', 'Lançamento no Brasil', 'Primeira versão com 120 ONGs de Santa Catarina e Paraná.'], ['2024', 'Resposta às enchentes', 'A plataforma coordena 2.870 voluntários no Rio Grande do Sul.'], ['2025', 'Expansão internacional', 'Chegada à América Latina, Europa, África, Ásia e Oceania.'], ['2026', 'Passaporte 12Help!', 'Lançamento do passaporte digital e do sistema de match inteligente.']].map(([y, h, p]) => `<div class="tl"><span class="tag tag-green">${y}</span><h4 style="margin:6px 0 2px">${h}</h4><p class="muted small" style="margin:0">${p}</p></div>`).join('')}</div></div></section>
  <section class="sec-sm"><div class="sec-head"><div><span class="eyebrow">Equipe</span><h2>Quem faz a 12Help! (fictícia)</h2></div></div>
    <div class="grid g4">${TEAM.map((t, i) => `<div class="card pad center fade">${avatar({id:'team' + i, name:t.name}, 72)}<h3 style="margin-top:12px;margin-bottom:2px">${t.name}</h3><div class="small b" style="color:var(--green)">${t.role}</div><p class="small muted" style="margin:8px 0 0">${t.bio}</p></div>`).join('')}</div></section>
  <section class="sec-sm"><div class="grid g2">
    <div class="card pad"><h3>Modelo de negócio (proposta)</h3><ul class="list-check">${['Gratuito para voluntários e ONGs de pequeno porte', 'Plano Pro para grandes organizações com relatórios avançados', 'Programas de voluntariado corporativo para empresas', 'Taxa opcional de apoio nas vaquinhas, sempre transparente'].map(x => `<li>${I('check', 16)}${x}</li>`).join('')}</ul></div>
    <div class="card pad"><h3>Fale com a gente</h3><form data-form="contact"><div class="frow"><label class="field"><span>Nome</span><input class="input" name="n" required></label><label class="field"><span>E-mail</span><input class="input" name="e" type="email" required></label></div>
      <label class="field"><span>Sou</span><select class="input" name="t"><option>Investidor(a)</option><option>Organização social</option><option>Empresa parceira</option><option>Imprensa</option><option>Voluntário(a)</option></select></label>
      <label class="field"><span>Mensagem</span><textarea class="input" name="m" required></textarea></label><button class="btn btn-primary">${I('send', 16)} Enviar (simulação)</button></form></div></div></section></div>`;

/* ---------- Estatísticas de impacto ---------- */
PAGES.impacto = () => {
  const byCat = Object.entries(CATS).map(([k, c]) => ({l:c.n, v:allOpps().filter(o => o.cat === k).length * 1000 + hash(k) % 900, c:c.g[0]}));
  return `<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}Estatísticas</div>
    <h1>Impacto coletivo da 12Help!</h1><p>Indicadores fictícios que ilustram como a plataforma acompanharia o impacto da rede. Atualizado em 29 de outubro de 2026.</p></div></div>
    <div class="wrap" style="padding-top:28px" class="stack">
      <div class="kpis">${[['users', '248.930', 'voluntários ativos', '+18% no ano'], ['shield', '12.480', 'ONGs cadastradas', '+1.240 no trimestre'], ['clock', '3,2 mi', 'horas doadas em 2026', '+34% vs. 2025'], ['coins', 'R$ 18,7 mi', 'arrecadados em vaquinhas', '4.120 campanhas'], ['globe', '63', 'países', '+9 em 2026'], ['brief', '41.300', 'oportunidades publicadas', '86% preenchidas'], ['cal', '9.870', 'eventos realizados', '62% presenciais'], ['heart', '1,4 mi', 'pessoas beneficiadas', 'estimativa']].map(([i, v, l, d]) => `<div class="card kpi fade"><div class="kh">${l}<span class="ki">${I(i, 17)}</span></div><div class="kv">${v}</div><div class="kd">${d}</div></div>`).join('')}</div>
      <div class="grid g2" style="margin-top:20px">
        <div class="card pad"><div class="card-h"><h3>Horas de voluntariado por mês (mil)</h3></div>${lineChart([['Mai', 212], ['Jun', 238], ['Jul', 251], ['Ago', 274], ['Set', 296], ['Out', 331]].map(([l, v]) => ({l, v})))}</div>
        <div class="card pad"><div class="card-h"><h3>Novos voluntários por região (mil)</h3></div>${barChart([['Brasil', 62], ['Am. Latina', 21], ['Am. Norte', 18], ['Europa', 27], ['África', 9], ['Ásia', 16], ['Oceania', 5]].map(([l, v]) => ({l, v})))}</div>
        <div class="card pad"><div class="card-h"><h3>Oportunidades por causa</h3></div>${donut(byCat.slice(0, 6).concat([{l:'Outras', v:byCat.slice(6).reduce((a, x) => a + x.v, 0), c:'#CBD5E1'}]), {label:'41,3 mil', sub:'oportunidades'})}</div>
        <div class="card pad"><div class="card-h"><h3>Taxa de preenchimento por modalidade</h3></div>${hbars([{l:'Presencial', p:88}, {l:'Remoto', p:79, cls:'blue'}, {l:'Híbrido', p:84}, {l:'Emergências', p:97}, {l:'Internacional', p:71, cls:'blue'}])}</div>
      </div>
      <div class="sec-sm"><h2>Presença global</h2>${worldMap(Object.values(allOngs().reduce((acc, g) => { (acc[g.country] = acc[g.country] || {lat:g.lat, lng:g.lng, n:0, link:'#/explorar', tip:`<b>${COUNTRIES[g.country].f} ${COUNTRIES[g.country].n}</b>`, c:'#008C45'}).n++; return acc; }, {})))}</div>
      <div class="cta"><div><h2 style="color:#fff">Cada hora conta.</h2><p>Os números da 12Help! são feitos de pessoas. Venha somar.</p></div><div class="row" style="justify-content:flex-end"><a href="#/oportunidades" class="btn btn-white btn-lg">Encontrar oportunidades</a></div></div>
    </div>`;
};

/* ---------- Central de conhecimento ---------- */
let KCAT = '';
PAGES.conhecimento = id => {
  if (id) {
    const a = ARTICLES.find(x => x.id === id); if (!a) return PAGES['404']();
    return `<article class="article"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}<a href="#/conhecimento">Central de conhecimento</a></div>
      <span class="tag">${a.cat}</span><h1 style="font-size:clamp(28px,4vw,42px);margin-top:12px">${a.title}</h1><p class="muted">${I('clock', 14)} ${a.min} min de leitura · Equipe 12Help!</p>
      <div style="height:280px;border-radius:20px;overflow:hidden;margin:24px 0">${cover(['amb', 'dh', 'edu', 'ass', 'emg', 'sau'][ARTICLES.indexOf(a)], a.id, '', true)}</div>
      ${a.body.map(p => `<p>${p}</p>`).join('')}
      <div class="notice info" style="margin-top:28px">${I('book', 18)}<div>Conteúdo educativo fictício produzido para a demonstração da 12Help!.</div></div>
      <h3 style="margin-top:36px">Continue lendo</h3><div class="grid g2">${ARTICLES.filter(x => x.id !== id).slice(0, 2).map(articleCard).join('')}</div></article>`;
  }
  const cats = [...new Set(ARTICLES.map(a => a.cat))];
  return `<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}Central de conhecimento</div>
    <h1>Central de conhecimento</h1><p>Guias, orientações e materiais educativos para voluntários e organizações.</p></div></div>
    <div class="wrap" style="padding-top:24px"><div class="row-sm" style="margin-bottom:20px"><span class="chip ${!KCAT ? 'on' : ''}" data-act="kcat" data-v="">Todos</span>${cats.map(c => `<span class="chip ${KCAT === c ? 'on' : ''}" data-act="kcat" data-v="${c}">${c}</span>`).join('')}</div>
    <div class="grid auto">${ARTICLES.filter(a => !KCAT || a.cat === KCAT).map(articleCard).join('')}</div>
    <div class="sec-sm"><div class="sec-head"><div><span class="eyebrow">Histórias de impacto</span><h2>Relatos de transformação</h2></div><a class="link" href="#/historias">Ver todas ${I('arrow', 15)}</a></div><div class="grid g2">${STORIES.slice(0, 2).map(storyCard).join('')}</div></div></div>`;
};
const articleCard = a => `<a href="#/conhecimento/${a.id}" class="card ocard lift fade"><div class="ocard-cover" style="height:150px">${cover(['amb', 'dh', 'edu', 'ass', 'emg', 'sau'][ARTICLES.indexOf(a)], a.id)}</div><div class="ocard-body"><span class="tag" style="align-self:flex-start">${a.cat}</span><h3>${a.title}</h3><p class="small muted" style="margin:0">${a.excerpt}</p><div class="meta" style="margin-top:auto;padding-top:8px">${I('clock', 14)} ${a.min} min de leitura</div></div></a>`;
const storyCard = s => { const g = ongById(s.ong); return `<article class="card ocard lift fade" data-act="story" data-id="${s.id}" style="cursor:pointer"><div class="ocard-cover" style="height:190px">${cover(s.cat, s.id, esc(s.place), true)}</div><div class="ocard-body"><div class="row between"><span class="tag tag-green">${esc(s.stat)}</span><span class="small muted">${esc(g.name)}</span></div><h3>${esc(s.title)}</h3><p class="small muted" style="margin:0">${esc(s.text.slice(0, 140))}…</p><span class="link small" style="margin-top:6px">Ler história ${I('arrow', 13)}</span></div></article>`; };
PAGES.historias = () => `<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}Histórias de impacto</div>
  <h1>Histórias de impacto</h1><p>Relatos fictícios que mostram como voluntários e organizações transformam realidades juntos.</p></div></div>
  <div class="wrap" style="padding-top:24px"><div class="grid g2">${STORIES.map(storyCard).join('')}</div></div>`;

/* ---------- Segurança e confiança ---------- */
PAGES.seguranca = () => {
  after(() => { const h = location.hash.split('#')[2]; if (h) { const el = document.getElementById(h); if (el) setTimeout(() => el.scrollIntoView({behavior:'smooth'}), 80); } });
  return `<div class="phead"><div class="wrap"><div class="crumbs"><a href="#/">Início</a>${I('chev', 13)}Segurança e confiança</div>
    <h1>Segurança e confiança</h1><p>Como a 12Help! protege voluntários, organizações e comunidades. Nesta demonstração, todos os mecanismos são ilustrativos.</p></div></div>
    <div class="wrap" style="padding-top:28px">
    <div class="grid g3">${[['shield', 'Selos de verificação (demo)', 'Na versão real, organizações passariam por análise documental. Aqui, os selos são somente demonstrativos e indicados como tal.'], ['flag', 'Denúncia de perfis', 'Qualquer perfil, oportunidade ou mensagem pode ser denunciado pelo menu de cada página.'], ['ban', 'Bloqueio de usuários', 'Bloqueie organizações ou voluntários para impedir mensagens e convites.'], ['lock', 'Privacidade por padrão', 'Você controla a visibilidade do perfil, da idade e do histórico.'], ['users', 'Proteção de menores', 'Autorização de responsáveis, visibilidade restrita e atividades supervisionadas.'], ['alert', 'Encontros presenciais', 'Avisos e orientações em todas as atividades e eventos presenciais.']].map(([i, h, p]) => `<div class="card pad fade"><div class="step" style="padding:0;border:0"><div class="n">${I(i, 20)}</div></div><h3>${h}</h3><p class="muted small" style="margin:0">${p}</p></div>`).join('')}</div>
    <section class="sec-sm" id="diretrizes"><h2>Diretrizes de convivência</h2><div class="card pad"><div class="grid g2">${[['Respeito acima de tudo', 'Trate todas as pessoas com dignidade, independentemente de origem, gênero, religião, orientação ou condição social.'], ['Honestidade', 'Descreva oportunidades e perfis com informações verdadeiras. Não prometa o que não pode cumprir.'], ['Foco na comunidade', 'O voluntariado existe para beneficiar comunidades, não para promoção pessoal.'], ['Sem cobranças indevidas', 'Organizações não podem cobrar taxas de voluntários sem transparência total e prévia.'], ['Comunicação pela plataforma', 'Mantenha as conversas iniciais pela 12Help!, onde há registro e ferramentas de denúncia.'], ['Tolerância zero com assédio', 'Qualquer forma de assédio, discriminação ou exploração resulta em remoção da plataforma.']].map(([h, p]) => `<div><h4>${I('check', 16)} ${h}</h4><p class="muted small">${p}</p></div>`).join('')}</div></div></section>
    <section class="sec-sm" id="menores"><div class="grid g2">
      <div class="card pad"><h2 style="font-size:22px">${I('shield', 22)} Proteção especial para menores</h2><ul class="list-check">${['Participação a partir de 14 anos, com autorização digital do responsável', 'Faixa etária indicada em todas as oportunidades', 'Perfis de menores não aparecem em buscas públicas', 'ONGs só iniciam contato após aprovação do responsável', 'Proibidas atividades com pernoite, deslocamento sem acompanhamento ou risco', 'Organizações que atuam com crianças assinam termo de conduta'].map(x => `<li>${I('check', 16)}${x}</li>`).join('')}</ul></div>
      <div class="card pad" id="encontros"><h2 style="font-size:22px">${I('pin', 22)} Orientações para interações seguras</h2><ul class="list-check">${['Confira o perfil, as avaliações e o selo da organização', 'Prefira primeiros encontros em locais públicos ou na sede', 'Avise alguém de confiança sobre local e horário', 'Nunca envie documentos ou dados bancários por mensagem', 'Desconfie de pedidos de pagamento para participar', 'Use Denunciar ou Bloquear ao primeiro sinal de risco'].map(x => `<li>${I('check', 16)}${x}</li>`).join('')}</ul></div></div></section>
    <section class="sec-sm" id="privacidade"><h2>Política de privacidade (ilustrativa)</h2><div class="card pad">${[['Quais dados coletamos', 'Dados de cadastro (nome, e-mail, cidade, idade), interesses, habilidades, disponibilidade e histórico de atividades na plataforma.'], ['Como usamos', 'Para calcular compatibilidades, permitir a comunicação entre voluntários e ONGs, emitir certificados e gerar estatísticas agregadas e anônimas.'], ['Com quem compartilhamos', 'Somente com as organizações às quais você se inscreve ou demonstra interesse. Nunca vendemos dados.'], ['Seus direitos', 'Acessar, corrigir, exportar e excluir seus dados a qualquer momento, nos termos da LGPD e do GDPR.'], ['Nesta demonstração', 'Os dados ficam apenas no armazenamento local do seu navegador e não são enviados a nenhum servidor.']].map(([q, a]) => `<details class="acc"><summary>${q}${I('chev', 18)}</summary><p>${a}</p></details>`).join('')}</div></section></div>`;
};

/* ---------- Busca global ---------- */
function searchAll(q) {
  q = norm(q.trim()); if (!q) return {ongs:[], opps:[], people:[], events:[], camps:[], arts:[]};
  const hit = s => norm(s).includes(q);
  return {
    ongs: allOngs().filter(g => !isBlocked('ong', g.id) && hit(g.name + ' ' + g.city + ' ' + g.tagline + ' ' + CATS[g.cat].n + ' ' + COUNTRIES[g.country].n)),
    opps: allOpps().filter(o => hit(o.title + ' ' + o.desc + ' ' + oppLoc(o).city + ' ' + o.skills.join(' ') + ' ' + CATS[o.cat].n)),
    people: [S.me, ...VOLS].filter(v => !v.minor && hit(v.name + ' ' + v.city + ' ' + (v.skills || []).join(' '))),
    events: allEvents().filter(e => hit(e.title + ' ' + e.city + ' ' + e.type)),
    camps: allCamps().filter(c => hit(c.title + ' ' + c.desc)),
    arts: ARTICLES.filter(a => hit(a.title + ' ' + a.excerpt))
  };
}
function searchRows(r, lim = 99) {
  const row = (href, left, title, sub) => `<a class="sres" href="${href}">${left}<div style="min-width:0"><b class="small">${title}</b><div class="xs muted">${sub}</div></div></a>`;
  const grp = (t, arr, fn) => arr.length ? `<div class="sgroup">${t} · ${arr.length}</div>${arr.slice(0, lim).map(fn).join('')}` : '';
  return grp('Organizações', r.ongs, g => row('#/ong/' + g.id, ongLogo(g, 34), esc(g.name), `${esc(g.city)} · ${COUNTRIES[g.country].n}`)) +
    grp('Oportunidades', r.opps, o => row('#/oportunidade/' + o.id, `<span class="olog" style="width:34px;height:34px;background:${CATS[o.cat].g[0]}">${I(CATS[o.cat].i, 16)}</span>`, esc(o.title), `${esc(ongById(o.ong).name)} · ${o.mode}`)) +
    grp('Pessoas', r.people, v => row('#/perfil/' + v.id, avatar(v, 34), esc(v.name), `${esc(v.city)} · ${(v.skills || []).slice(0, 3).join(', ')}`)) +
    grp('Eventos', r.events, e => row('#/eventos', `<span class="olog" style="width:34px;height:34px;background:var(--blue)">${I('cal', 16)}</span>`, esc(e.title), `${fmtDate(e.date)} · ${esc(e.city)}`)) +
    grp('Vaquinhas', r.camps, c => row('#/vaquinha/' + c.id, `<span class="olog" style="width:34px;height:34px;background:var(--green)">${I('coins', 16)}</span>`, esc(c.title), `${Math.round(c.raisedNow / c.goal * 100)}% da meta`)) +
    grp('Artigos', r.arts, a => row('#/conhecimento/' + a.id, `<span class="olog" style="width:34px;height:34px;background:#64748B">${I('book', 16)}</span>`, esc(a.title), a.cat));
}
PAGES.busca = () => {
  const q = CUR.q.q || '', r = searchAll(q), n = Object.values(r).reduce((a, x) => a + x.length, 0);
  return `<div class="phead"><div class="wrap"><h1>Busca global</h1><p>Pesquise ONGs, pessoas, projetos, oportunidades, eventos e campanhas.</p>
    <form class="searchbar" data-form="gsearch-page" style="margin-top:20px;box-shadow:var(--sh)">${I('search', 20)}<input name="q" value="${esc(q)}" placeholder="Ex.: Joinville, educação, fotografia, Japão" aria-label="Buscar"><button class="btn btn-primary">Buscar</button></form></div></div>
    <div class="wrap" style="padding-top:24px">${!q ? `<div class="row-sm"><span class="small muted">Sugestões:</span>${['Joinville', 'fotografia', 'remoto', 'animais', 'Japão', 'educação'].map(s => `<a class="chip" href="#/busca?q=${encodeURIComponent(s)}">${s}</a>`).join('')}</div>` :
      n ? `<p class="muted">${n} resultado(s) para “<b>${esc(q)}</b>”</p><div class="card" style="padding:8px 0">${searchRows(r)}</div>` : emptyBox('search', `Nada encontrado para “${esc(q)}”`, 'Tente outro termo, como uma cidade, causa ou habilidade.')}</div>`;
};

/* ---------- Entrar ---------- */
let LOGIN_T = 'v';
PAGES.entrar = () => `<div class="auth">
  <div class="auth-side">${logo(true)}<div><h2 style="color:#fff;font-size:34px">Bem-vindo de volta.</h2><p style="color:#C9DCEF;font-size:17px;max-width:420px">Suas causas, conversas e conquistas estão esperando por você.</p>
    <div class="card pad-s" style="background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15);color:#fff;max-width:380px;margin-top:24px;box-shadow:none"><div class="row" style="flex-wrap:nowrap">${ring(94, 70)}<div><b>Combinações novas</b><div class="small" style="color:#C9DCEF">3 oportunidades publicadas hoje combinam com perfis como o seu.</div></div></div></div></div>
    <span class="small" style="color:#9FB9D6">Demonstração: qualquer e-mail e senha são aceitos.</span></div>
  <div class="auth-main"><div class="auth-box">
    <h1 style="font-size:32px">Entrar na 12Help!</h1><p class="muted">Escolha o tipo de conta.</p>
    <div class="tabs" style="margin:10px 0 22px"><button class="${LOGIN_T === 'v' ? 'on' : ''}" data-act="login-t" data-t="v">${I('user', 15)} Voluntário</button><button class="${LOGIN_T === 'o' ? 'on' : ''}" data-act="login-t" data-t="o">${I('shield', 15)} ONG / organização</button></div>
    <form data-form="login"><label class="field"><span>E-mail</span><input class="input" name="email" type="email" value="${LOGIN_T === 'v' ? 'livia.demo@12help.app' : 'contato@raizesverdes.demo'}" required></label>
      <label class="field"><span>Senha</span><input class="input" name="pw" type="password" value="demonstracao" required></label>
      <div class="row between small" style="margin-bottom:16px"><label class="check"><input type="checkbox" checked> Manter conectado</label><a class="link" href="#" data-act="forgot">Esqueci a senha</a></div>
      <button class="btn btn-primary btn-block btn-lg">Entrar</button></form>
    <div class="hr"></div>
    <p class="small muted center" style="margin-bottom:10px">Ou use uma conta de demonstração</p>
    <div class="grid g2"><button class="choice" data-act="role" data-r="volunteer" data-go="#/v/painel">${avatar(S.me, 40)}<div><b class="small">Lívia Moraes</b><div class="xs muted">Voluntária · Joinville</div></div></button>
      <button class="choice" data-act="role" data-r="ong" data-go="#/o/dashboard">${ongLogo(ongById(MY_ONG), 40)}<div><b class="small">Raízes Verdes</b><div class="xs muted">ONG · Joinville</div></div></button></div>
    <p class="center small" style="margin-top:22px">Ainda não tem conta? <a class="link" href="#/cadastro?tipo=${LOGIN_T === 'o' ? 'ong' : 'voluntario'}">Cadastre-se grátis</a></p>
  </div></div></div>`;

/* ---------- Cadastro (voluntário e ONG) ---------- */
let SU = {tipo:null, step:1, d:{interests:[], skills:[], days:[], shift:'noite', mode:'Híbrido'}};
PAGES.cadastro = () => {
  if (CUR.q.tipo) { SU = {tipo:CUR.q.tipo === 'ong' ? 'ong' : 'voluntario', step:1, d:{interests:[], skills:[], days:[], shift:'noite', mode:'Híbrido'}}; history.replaceState(null, '', '#/cadastro'); }
  const t = SU.tipo, st = SU.step, d = SU.d;
  let inner;
  if (!t) inner = `<h1 style="font-size:32px">Criar conta</h1><p class="muted">Como você quer usar a 12Help!?</p><div class="stack">
    <button class="choice" data-act="su-tipo" data-t="voluntario"><span class="olog" style="width:52px;height:52px;background:var(--green)">${I('heart', 24)}</span><div><b>Quero ser voluntário</b><div class="small muted">Encontre causas, inscreva-se e registre seu impacto.</div></div></button>
    <button class="choice" data-act="su-tipo" data-t="ong"><span class="olog" style="width:52px;height:52px;background:var(--blue)">${I('shield', 24)}</span><div><b>Represento uma ONG</b><div class="small muted">Publique oportunidades, encontre voluntários e arrecade.</div></div></button></div>
    <p class="center small" style="margin-top:22px">Já tem conta? <a class="link" href="#/entrar">Entrar</a></p>`;
  else if (t === 'voluntario') {
    const total = 4;
    inner = `<div class="stepper">${Array.from({length:total}, (_, i) => `<span class="${i < st ? 'on' : ''}"></span>`).join('')}</div><span class="xs muted b">ETAPA ${Math.min(st, total)} DE ${total}</span>` + (
      st === 1 ? `<h1 style="font-size:28px;margin-top:6px">Seus dados</h1><form data-form="su-v1">
        <label class="field"><span>Nome completo</span><input class="input" name="name" value="${esc(d.name || '')}" required placeholder="Ex.: Maria Silva"></label>
        <label class="field"><span>E-mail</span><input class="input" type="email" name="email" value="${esc(d.email || '')}" required placeholder="voce@email.com"></label>
        <div class="frow"><label class="field"><span>Idade</span><input class="input" type="number" min="14" max="99" name="age" value="${esc(d.age || '')}" required></label>
        <label class="field"><span>País</span><select class="input" name="country">${Object.entries(COUNTRIES).map(([k, c]) => `<option value="${k}" ${(d.country || 'BR') === k ? 'selected' : ''}>${c.f} ${c.n}</option>`).join('')}</select></label></div>
        <div class="frow"><label class="field"><span>Cidade</span><input class="input" name="city" value="${esc(d.city || 'Joinville')}" required></label><label class="field"><span>Estado</span><input class="input" name="state" value="${esc(d.state || 'SC')}"></label></div>
        <label class="field"><span>Senha</span><input class="input" type="password" name="pw" minlength="6" required placeholder="Mínimo 6 caracteres"></label>
        <label class="check small"><input type="checkbox" required> Li e aceito as <a class="link" href="#/seguranca#diretrizes" target="_blank">diretrizes de convivência</a> e a <a class="link" href="#/seguranca#privacidade" target="_blank">política de privacidade</a> (ilustrativas).</label>
        <button class="btn btn-primary btn-block btn-lg" style="margin-top:14px">Continuar</button></form>` :
      st === 2 ? `<h1 style="font-size:28px;margin-top:6px">Quais causas movem você?</h1><p class="muted">Escolha quantas quiser. Usaremos suas preferências para recomendar oportunidades.</p>
        <div class="row-sm" style="margin-bottom:22px">${CAUSES.map(c => `<span class="chip g ${d.interests.includes(c.k) ? 'on' : ''}" data-act="su-int" data-v="${c.k}">${I(c.i, 15)} ${c.n}</span>`).join('')}</div>
        <div class="row between"><button class="btn btn-ghost" data-act="su-back">Voltar</button><button class="btn btn-primary" data-act="su-next" ${d.interests.length ? '' : 'disabled'}>Continuar (${d.interests.length})</button></div>` :
      st === 3 ? `<h1 style="font-size:28px;margin-top:6px">Habilidades e disponibilidade</h1>
        <div class="flabel">Habilidades</div><div class="row-sm" style="margin-bottom:10px">${['Comunicação', 'Design', 'Fotografia', 'Programação', 'Didática', 'Logística', 'Inglês', 'Espanhol', 'Saúde', 'Psicologia', 'Culinária', 'Biologia', 'Direito', 'Redes sociais', 'Cuidado animal', 'Trabalho em equipe'].map(s => `<span class="chip ${d.skills.includes(s) ? 'on' : ''}" data-act="su-skill" data-v="${s}">${s}</span>`).join('')}${d.skills.filter(s => !['Comunicação', 'Design', 'Fotografia', 'Programação', 'Didática', 'Logística', 'Inglês', 'Espanhol', 'Saúde', 'Psicologia', 'Culinária', 'Biologia', 'Direito', 'Redes sociais', 'Cuidado animal', 'Trabalho em equipe'].includes(s)).map(s => `<span class="chip on" data-act="su-skill" data-v="${esc(s)}">${esc(s)}</span>`).join('')}</div>
        <form data-form="su-skill" class="row-sm" style="margin-bottom:20px"><input class="input input-sm" name="s" placeholder="Adicionar outra habilidade" style="flex:1"><button class="btn btn-sm btn-outline">${I('plus', 14)} Adicionar</button></form>
        <div class="flabel">Dias disponíveis</div><div class="row-sm" style="margin-bottom:18px">${Object.entries(DOWN).map(([k, l]) => `<span class="chip ${d.days.includes(k) ? 'on' : ''}" data-act="su-day" data-v="${k}">${l}</span>`).join('')}</div>
        <div class="frow"><label class="field"><span>Turno preferido</span><select class="input" data-su="shift">${Object.entries(SHIFT).map(([k, l]) => `<option value="${k}" ${d.shift === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label class="field"><span>Modalidade</span><select class="input" data-su="mode">${['Presencial', 'Remoto', 'Híbrido'].map(m => `<option ${d.mode === m ? 'selected' : ''}>${m}</option>`).join('')}</select></label></div>
        ${+d.age < 18 ? `<div class="notice info" style="margin-bottom:14px">${I('shield', 18)}<div><b>Você tem menos de 18 anos.</b> Enviaremos um pedido de autorização ao seu responsável (simulado). Seu perfil terá visibilidade restrita e você verá apenas atividades permitidas para a sua idade.</div></div>` : ''}
        <div class="row between"><button class="btn btn-ghost" data-act="su-back">Voltar</button><button class="btn btn-primary" data-act="su-finish-v">Criar meu perfil</button></div>` :
      (() => { const n = recommended().length; return `<div class="center" style="padding:20px 0"><div class="success-ic">${I('check', 40)}</div><h1 style="font-size:28px">Perfil criado, ${esc((S.me.name || '').split(' ')[0])}!</h1>
        <p class="muted" style="font-size:17px">Encontramos <b style="color:var(--green)">${n} oportunidades</b> que combinam com você.</p>
        <div class="row" style="justify-content:center"><a class="btn btn-primary btn-lg" href="#/v/match">${I('sparkle', 18)} Ver combinações</a><a class="btn btn-outline btn-lg" href="#/v/perfil">Completar perfil</a></div></div>`; })());
  } else {
    inner = `<div class="stepper">${[1, 2, 3].map(i => `<span class="${i <= st ? 'on' : ''}"></span>`).join('')}</div><span class="xs muted b">ETAPA ${Math.min(st, 3)} DE 3</span>` + (
      st === 1 ? `<h1 style="font-size:28px;margin-top:6px">Cadastro institucional</h1><form data-form="su-o1">
        <label class="field"><span>Nome da organização</span><input class="input" name="name" value="${esc(d.name || '')}" required placeholder="Ex.: Instituto Mãos à Obra"></label>
        <div class="frow"><label class="field"><span>CNPJ ou registro (fictício)</span><input class="input" name="doc" placeholder="00.000.000/0001-00"></label><label class="field"><span>Ano de fundação</span><input class="input" type="number" name="founded" value="${esc(d.founded || 2020)}"></label></div>
        <div class="frow"><label class="field"><span>País</span><select class="input" name="country">${Object.entries(COUNTRIES).map(([k, c]) => `<option value="${k}" ${(d.country || 'BR') === k ? 'selected' : ''}>${c.f} ${c.n}</option>`).join('')}</select></label><label class="field"><span>Cidade</span><input class="input" name="city" value="${esc(d.city || 'Joinville')}" required></label></div>
        <label class="field"><span>Causa principal</span><select class="input" name="cat">${Object.entries(CATS).map(([k, c]) => `<option value="${k}" ${d.cat === k ? 'selected' : ''}>${c.n}</option>`).join('')}</select></label>
        <label class="field"><span>E-mail institucional</span><input class="input" type="email" name="email" required></label>
        <p class="hint">Nesta demonstração, o documento informado não é validado.</p>
        <button class="btn btn-blue btn-block btn-lg">Continuar</button></form>` :
      st === 2 ? `<h1 style="font-size:28px;margin-top:6px">Perfil público</h1><form data-form="su-o2">
        <label class="field"><span>Frase de apresentação</span><input class="input" name="tagline" maxlength="90" required placeholder="Em uma frase, o que vocês fazem?"></label>
        <label class="field"><span>Descrição</span><textarea class="input" name="desc" required placeholder="Conte a história, o público atendido e os resultados."></textarea></label>
        <label class="field"><span>Site</span><input class="input" name="site" placeholder="www.suaong.org"></label>
        <div class="row between"><button type="button" class="btn btn-ghost" data-act="su-back">Voltar</button><button class="btn btn-blue">Concluir cadastro</button></div></form>` :
      `<div class="center" style="padding:20px 0"><div class="success-ic" style="background:var(--blue)">${I('check', 40)}</div><h1 style="font-size:28px">${esc(d.name)} está na 12Help!</h1>
        <p class="muted">Seu perfil institucional foi criado. Status de verificação: <span class="seal pending">${I('clock', 12)} Pendente (simulação)</span></p>
        <div class="row" style="justify-content:center"><a class="btn btn-blue btn-lg" href="#/o/publicar">${I('plus', 18)} Publicar primeira oportunidade</a><a class="btn btn-outline btn-lg" href="#/o/dashboard">Ir para o painel</a></div></div>`);
  }
  return `<div class="auth"><div class="auth-side">${logo(true)}<div><h2 style="color:#fff;font-size:34px">${t === 'ong' ? 'Sua causa merece as pessoas certas.' : 'Existe uma causa esperando por você.'}</h2>
    <ul class="list-check" style="color:#DCE8F5">${(t === 'ong' ? ['Publique oportunidades gratuitamente', 'Encontre voluntários compatíveis', 'Organize eventos e vaquinhas', 'Acompanhe tudo em um dashboard'] : ['Combinações personalizadas', 'Currículo e passaporte de impacto', 'Medalhas e certificados', 'Mensagens seguras com ONGs']).map(x => `<li style="color:#DCE8F5">${I('check', 16)}${x}</li>`).join('')}</ul></div>
    <span class="small" style="color:#9FB9D6">Demonstração: os dados ficam somente no seu navegador.</span></div>
    <div class="auth-main"><div class="auth-box">${inner}</div></div></div>`;
};

/* ---------- Perfil público do voluntário ---------- */
PAGES.perfil = id => {
  const v = volById(id); if (!v) return PAGES['404']();
  if (v.minor) return `<div class="wrap"><div class="card gate">${I('shield', 40)}<h2 style="margin-top:12px">Perfil protegido</h2><p class="muted">Este perfil pertence a um voluntário menor de idade e tem visibilidade restrita. Organizações só podem entrar em contato após aprovação do responsável legal.</p><a class="btn btn-primary" href="#/">Voltar ao início</a></div></div>`;
  if (id === 'livia' && !S.settings.publicProfile && !isVol()) return `<div class="wrap"><div class="card gate">${I('lock', 40)}<h2 style="margin-top:12px">Perfil privado</h2><p class="muted">Esta pessoa optou por não exibir o perfil publicamente.</p></div></div>`;
  const isMe = id === 'livia';
  const exp = isMe ? S.me.exp : [{ong:VOLS.indexOf(v) % 2 ? 'raizes' : 'mesa', role:'Voluntário(a)', start:'2025-02', end:'2026-05', hours:Math.round(v.hours * .6), country:v.country, city:v.city, desc:v.bio}];
  const blocked = isBlocked('vol', id);
  const badges = isMe ? BADGES.filter(b => S.badges[b.k]) : BADGES.slice(0, 2 + hash(id) % 4);
  return `<div class="wrap" style="padding-top:28px;max-width:980px">
    ${isMe ? `<div class="notice info" style="margin-bottom:16px">${I('eye', 18)}<div>Esta é a visualização pública do seu perfil, como outras pessoas e ONGs a veem. <a class="link" href="#/v/perfil">Editar perfil</a></div></div>` : ''}
    <div class="card" style="overflow:hidden">${profileCover()}<div class="phead2">
      <div class="row between" style="align-items:flex-end">${avatar(v, 128)}<div class="row-sm" style="padding-top:12px">
        <button class="btn btn-outline btn-sm" data-act="share" data-url="#/perfil/${id}">${I('share', 15)} Compartilhar</button>
        ${!isMe && isOng() ? `<button class="btn btn-blue btn-sm" data-act="invite" data-id="${id}">${I('send', 15)} Convidar</button><button class="btn btn-outline btn-sm" data-act="msg-vol" data-id="${id}">${I('msg', 15)} Mensagem</button>` : ''}
        ${!isMe ? `<button class="btn btn-outline btn-icon" data-act="safety-menu" data-type="vol" data-id="${id}" aria-label="Denunciar ou bloquear">${I('dots', 18)}</button>` : ''}</div></div>
      <h1 style="font-size:28px;margin:12px 0 2px">${esc(v.name)}</h1><p style="margin:0 0 6px;font-size:16px;color:var(--ink2)">${esc(v.headline || v.bio)}</p>
      <div class="meta">${I('pin', 15)} ${esc(v.city)}${v.state ? ', ' + v.state : ''} · ${flag(v.country)}${(!isMe || S.settings.showAge) ? ` · ${v.age} anos` : ''}</div>
      <div class="row" style="margin-top:14px">${[[isMe ? hoursTotal() : v.hours, 'horas doadas'], [isMe ? S.me.exp.length : v.projects, 'projetos'], [isMe ? countriesDone().length : 1, 'países'], [isMe ? S.points : v.pts, 'pontos']].map(([n, l]) => `<div><b style="font-size:20px">${num(n)}</b> <span class="small muted">${l}</span></div>`).join('<span style="color:var(--line)">|</span>')}</div>
      <div class="badges-row" style="margin-top:14px">${badges.map(b => `<span class="mini-badge" title="${b.n}">${I(b.i, 18)}</span>`).join('')}</div></div></div>
    ${blocked ? `<div class="notice" style="margin-top:16px">${I('ban', 18)}<div>Você bloqueou este perfil. <a class="link" href="#" data-act="unblock" data-type="vol" data-id="${id}">Desbloquear</a></div></div>` : ''}
    <div class="grid split" style="margin-top:20px;--cols:1.4fr 1fr">
      <div class="stack"><div class="card pad"><h3>Sobre</h3><p class="muted">${esc(v.bio)}</p></div>
        <div class="card pad"><h3>Experiências</h3><div class="timeline">${exp.map(x => { const g = ongById(x.ong); return `<div class="tl"><b>${esc(x.role)}</b><div class="small">${esc(g.name)} · ${esc(x.city)}, ${COUNTRIES[x.country].f}</div><div class="xs muted">${fmtMonth(x.start)} – ${fmtMonth(x.end)} · ${x.hours}h</div><p class="small muted" style="margin:6px 0 0">${esc(x.desc || '')}</p></div>`; }).join('')}</div></div></div>
      <div class="stack"><div class="card pad"><h3>Causas</h3><div class="row-sm">${(v.interests || []).map(k => causeByK(k)).filter(Boolean).map(c => `<span class="tag tag-green">${I(c.i, 12)} ${c.n}</span>`).join('')}</div></div>
        <div class="card pad"><h3>Habilidades</h3><div class="row-sm">${(v.skills || []).map(s => `<span class="tag tag-line">${esc(s)}</span>`).join('')}</div></div>
        ${isMe && S.me.recs.length ? `<div class="card pad"><h3>Recomendações</h3>${S.me.recs.map(r => `<div style="padding:10px 0;border-top:1px solid var(--line2)"><p class="small" style="margin:0 0 6px;color:var(--ink2)">“${esc(r.text)}”</p><div class="xs muted">${esc(r.by)} · ${esc(ongById(r.ong).name)}</div></div>`).join('')}</div>` : ''}</div></div></div>`;
};
const profileCover = () => `<div class="pcover"><svg viewBox="0 0 900 180" preserveAspectRatio="xMidYMid slice"><circle cx="760" cy="30" r="120" fill="#fff" opacity=".08"/><circle cx="120" cy="190" r="140" fill="#fff" opacity=".06"/><path d="M0 140 C 200 90, 420 170, 900 110 L900 180 L0 180Z" fill="#fff" opacity=".08"/>${worldDots().filter((_, i) => i % 3 === 0).map(([lng, lat]) => { const [x, y] = proj(lng, lat); return `<circle cx="${x * .9}" cy="${y * .43}" r="1.6" fill="#fff" opacity=".22"/>`; }).join('')}</svg></div>`;

/* ---------- Notificações (página) ---------- */
let NF = '';
PAGES.notificacoes = () => {
  if (S.role === 'visitor') return gate('volunteer');
  const list = S.notifs.filter(n => n.role === roleKey() && (!NF || n.type === NF || (NF === 'unread' && !n.read)));
  return areaShell(`<div class="area-h"><div><h1>Notificações</h1><p>Central de avisos sobre mensagens, inscrições, medalhas e campanhas.</p></div><button class="btn btn-outline btn-sm" data-act="notif-all-read">${I('check', 15)} Marcar todas como lidas</button></div>
    <div class="row-sm" style="margin-bottom:16px">${[['', 'Todas'], ['unread', 'Não lidas'], ['msg', 'Mensagens'], ...(isOng() ? [['app', 'Inscrições']] : [['match', 'Oportunidades'], ['accept', 'Inscrições'], ['badge', 'Medalhas']]), ['goal', 'Campanhas']].map(([k, l]) => `<span class="chip ${NF === k ? 'on' : ''}" data-act="nf" data-v="${k}">${l}</span>`).join('')}</div>
    <div class="card" style="overflow:hidden">${list.length ? list.map(notifRow).join('') : emptyBox('bell', 'Nenhuma notificação aqui')}</div>`, 'notificacoes');
};
const NICON = {match:['sparkle', 'g'], msg:['msg', ''], interest:['star', 'y'], accept:['check', 'g'], badge:['award', 'y'], goal:['coins', 'g'], app:['user', ''], invite:['send', ''], event:['cal', ''], info:['info', '']};
const notifRow = n => { const [i, c] = NICON[n.type] || NICON.info; return `<div class="notif ${n.read ? '' : 'unread'}" data-act="notif-open" data-id="${n.id}"><span class="ni ${c}">${I(i, 17)}</span><div style="flex:1">${n.text}<time>${ago(n.t)}</time></div>${n.read ? '' : '<span class="dot"></span>'}</div>`; };

/* ---------- 404 ---------- */
PAGES['404'] = () => `<div class="wrap"><div class="card gate">${I('compass', 40)}<h2 style="margin-top:12px">Página não encontrada</h2><p class="muted">O endereço pode ter mudado. Que tal explorar oportunidades?</p><div class="row" style="justify-content:center"><a class="btn btn-primary" href="#/oportunidades">Encontrar oportunidades</a><a class="btn btn-outline" href="#/">Início</a></div></div></div>`;

/* ---------- Gate de acesso por perfil ---------- */
function gate(role) {
  const v = role === 'volunteer';
  return `<div class="wrap"><div class="card gate fade"><div class="success-ic" style="animation:none;background:${v ? 'var(--green)' : 'var(--blue)'}">${I(v ? 'user' : 'shield', 36)}</div>
    <h2>${v ? 'Área do voluntário' : 'Área da organização'}</h2><p class="muted">Entre com a conta de demonstração ${v ? 'da voluntária <b>Lívia Moraes</b>' : 'do <b>Instituto Raízes Verdes</b>'} para explorar esta área.</p>
    <div class="row" style="justify-content:center"><button class="btn ${v ? 'btn-primary' : 'btn-blue'} btn-lg" data-act="role" data-r="${role}" data-stay="1">Entrar como ${v ? 'voluntária' : 'ONG'} demo</button><a class="btn btn-outline btn-lg" href="#/cadastro?tipo=${v ? 'voluntario' : 'ong'}">Criar conta</a></div></div></div>`;
}

/* =========================================================
   EVENTOS DE INTERFACE (delegação)
   ========================================================= */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (!a) {
    if (!e.target.closest('#notif-drop,#user-drop')) { const n = $('#notif-drop'), u = $('#user-drop'); if (n) n.innerHTML = ''; if (u) u.innerHTML = ''; }
    return;
  }
  const act = a.dataset.act;
  if (act === 'ov-close') { if (e.target === a) closeModal(); return; }
  if (a.tagName === 'INPUT') { ACT[act] && ACT[act](a, e); return; }
  e.preventDefault();
  if (ACT[act]) ACT[act](a, e);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); $('#filters')?.classList.remove('open'); } });
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if (!f) return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(f));
  const fn = FORMS[f.dataset.form]; if (fn) fn(data, f);
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.of !== undefined && t.dataset.of) { OF[t.dataset.of] = t.type === 'checkbox' ? t.checked : t.value; if (t.dataset.of === 'country') { OF.state = ''; OF.city = ''; } if (t.dataset.of === 'state') OF.city = ''; rerender(); }
  if (t.dataset.ef && t.dataset.ef !== 'q') { EF[t.dataset.ef] = t.type === 'checkbox' ? t.checked : t.value; if (t.dataset.ef === 'country') EF.state = ''; rerender(); }
  if (t.dataset.ev) { EV[t.dataset.ev] = t.value; rerender(); }
  if (t.dataset.cf) { CF[t.dataset.cf] = t.value; rerender(); }
  if (t.dataset.su) { SU.d[t.dataset.su] = t.value; }
  if (t.dataset.change && CHANGE[t.dataset.change]) CHANGE[t.dataset.change](t);
});
let efTimer;
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.ef === 'q') { clearTimeout(efTimer); efTimer = setTimeout(() => { EF.q = t.value; rerender(); const i = $('[data-ef="q"]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 280); }
  if (t.id === 'gsearch-in') { $('#gsearch-res').innerHTML = t.value.trim() ? (searchRows(searchAll(t.value), 3) || `<p class="muted center" style="padding:24px">Nada encontrado.</p>`) + `<div style="padding:12px 20px;border-top:1px solid var(--line2)"><a class="link small" href="#/busca?q=${encodeURIComponent(t.value)}">Ver todos os resultados ${I('arrow', 13)}</a></div>` : quickLinks(); }
  if (t.dataset.input && INPUT[t.dataset.input]) INPUT[t.dataset.input](t);
});
const FORMS = {}, CHANGE = {}, INPUT = {};

function bindMapTips() {
  $$('.map').forEach(m => {
    const tip = $('.map-tip', m);
    $$('.pt', m).forEach(p => {
      p.addEventListener('mouseenter', () => { tip.innerHTML = p.dataset.tip; tip.style.display = 'block'; const r = p.getBoundingClientRect(), mr = m.getBoundingClientRect(); tip.style.left = (r.left - mr.left + r.width / 2) + 'px'; tip.style.top = (r.top - mr.top + r.height / 2) + 'px'; });
      p.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    });
  });
}

/* ---------- Ações gerais ---------- */
ACT.close = closeModal;
ACT.burger = () => $('#mnav').classList.toggle('open');
ACT.role = a => {
  const r = a.dataset.r; S.role = r; save();
  toast(r === 'visitor' ? 'Você está navegando como <b>visitante</b>.' : r === 'volunteer' ? `Conectada como <b>${esc(S.me.name)}</b> (voluntária demo).` : `Conectado como <b>${esc(ongById(MY_ONG).name)}</b> (ONG demo).`, r === 'ong' ? 'shield' : 'user');
  const k = CUR.parts[0];
  if (a.dataset.go) return go(a.dataset.go);
  if (a.dataset.stay) return rerender();
  if (r === 'volunteer' && k === 'o') return go('#/v/painel');
  if (r === 'ong' && k === 'v') return go('#/o/dashboard');
  if (r !== 'visitor' && (k === 'entrar' || k === 'cadastro')) return go(r === 'ong' ? '#/o/dashboard' : '#/v/painel');
  rerender();
};
ACT.howtab = a => { window.HOWTAB = a.dataset.t; rerender(); };
ACT.gsearch = () => {
  openModal('', `<div class="gsearch">${I('search', 22)}<input id="gsearch-in" placeholder="Buscar ONGs, pessoas, projetos, oportunidades…" autocomplete="off" aria-label="Busca global"><button class="icon-btn" data-act="close" aria-label="Fechar">${I('x')}</button></div><div id="gsearch-res" style="max-height:60vh;overflow:auto;padding:6px 0">${quickLinks()}</div>`, '', 'wide');
  $('.modal .modal-b').style.padding = '0'; setTimeout(() => $('#gsearch-in').focus(), 30);
  $('#gsearch-in').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.value.trim()) { closeModal(); go('#/busca?q=' + encodeURIComponent(e.target.value)); } });
};
const quickLinks = () => `<div class="sgroup">Buscas populares</div><div class="row-sm" style="padding:6px 20px 16px">${['Joinville', 'Remoto', 'Fotografia', 'Animais', 'Japão', 'Educação', 'Alimentação'].map(s => `<a class="chip" href="#/busca?q=${encodeURIComponent(s)}">${s}</a>`).join('')}</div><div class="sgroup">Atalhos</div>${[['#/oportunidades', 'search', 'Encontrar oportunidades'], ['#/explorar', 'compass', 'Explorar ONGs'], ['#/eventos', 'cal', 'Eventos'], ['#/vaquinhas', 'coins', 'Vaquinhas']].map(([h, i, l]) => `<a class="sres" href="${h}">${I(i, 18, 'muted')}<b class="small">${l}</b></a>`).join('')}`;

ACT['notif-toggle'] = () => {
  const d = $('#notif-drop'); $('#user-drop').innerHTML = '';
  if (d.innerHTML) { d.innerHTML = ''; return; }
  const list = S.notifs.filter(n => n.role === roleKey()).slice(0, 7);
  d.innerHTML = `<div class="drop"><div class="drop-h"><b>Notificações</b><a href="#" class="link small" data-act="notif-all-read">Marcar como lidas</a></div><div class="drop-list">${list.length ? list.map(notifRow).join('') : '<p class="muted center" style="padding:24px">Nada por aqui.</p>'}</div><a href="#/notificacoes" class="link small" style="display:block;text-align:center;padding:12px;border-top:1px solid var(--line2)">Ver todas</a></div>`;
};
ACT['user-toggle'] = () => {
  const d = $('#user-drop'); $('#notif-drop').innerHTML = '';
  if (d.innerHTML) { d.innerHTML = ''; return; }
  const items = isOng() ? [['#/o/dashboard', 'grid', 'Dashboard'], ['#/o/perfil', 'shield', 'Perfil institucional'], ['#/o/publicar', 'plus', 'Publicar oportunidade'], ['#/ong/' + MY_ONG, 'eye', 'Ver perfil público']] : [['#/v/painel', 'grid', 'Meu painel'], ['#/v/perfil', 'user', 'Meu perfil'], ['#/v/curriculo', 'file', 'Meu currículo'], ['#/v/passaporte', 'passport', 'Passaporte 12Help!'], ['#/v/config', 'settings', 'Configurações']];
  const who = isOng() ? ongById(MY_ONG) : S.me;
  d.innerHTML = `<div class="drop menu" style="width:260px"><div class="drop-h" style="justify-content:flex-start;gap:10px">${isOng() ? ongLogo(who, 38) : avatar(who, 38)}<div><b class="small">${esc(who.name)}</b><div class="xs muted">${isOng() ? 'Conta de organização' : 'Nível ' + level().n + ' · ' + level().name}</div></div></div>${items.map(([h, i, l]) => `<a href="${h}">${I(i, 17)} ${l}</a>`).join('')}<button data-act="role" data-r="visitor">${I('logout', 17)} Sair</button></div>`;
};
ACT['notif-open'] = a => { const n = S.notifs.find(x => x.id === a.dataset.id); if (!n) return; n.read = true; save(); if (n.link) { if (location.hash === n.link) rerender(); else location.hash = n.link; } else rerender(); };
ACT['notif-all-read'] = () => { S.notifs.filter(n => n.role === roleKey()).forEach(n => n.read = true); save(); rerender(); toast('Todas as notificações foram marcadas como lidas.'); };
ACT.nf = a => { NF = a.dataset.v; rerender(); };

ACT.share = a => {
  const url = location.href.split('#')[0] + a.dataset.url;
  try { navigator.clipboard.writeText(url); } catch (e) {}
  openModal('Compartilhar', `<p class="muted">Link da página (copiado para a área de transferência):</p><div class="row-sm" style="flex-wrap:nowrap"><input class="input" value="${esc(url)}" readonly onclick="this.select()"><button class="btn btn-primary" data-act="copy-link" data-url="${esc(url)}">Copiar</button></div>
    <div class="row-sm" style="margin-top:16px">${['WhatsApp', 'LinkedIn', 'E-mail', 'Instagram'].map(s => `<button class="btn btn-outline btn-sm" data-act="share-fake" data-s="${s}">${s}</button>`).join('')}</div><p class="xs muted" style="margin:12px 0 0">Na demonstração, os botões de redes sociais apenas simulam o compartilhamento.</p>`);
};
ACT['copy-link'] = a => { try { navigator.clipboard.writeText(a.dataset.url); } catch (e) {} toast('Link copiado!', 'link'); };
ACT['share-fake'] = a => { closeModal(); toast(`Compartilhamento via <b>${a.dataset.s}</b> simulado.`, 'share'); };
ACT.forgot = () => openModal('Recuperar senha', `<p class="muted">Informe seu e-mail e enviaremos um link de redefinição (simulado).</p><form data-form="forgot"><input class="input" type="email" required placeholder="voce@email.com"><button class="btn btn-primary btn-block" style="margin-top:12px">Enviar link</button></form>`);
FORMS.forgot = () => { closeModal(); toast('Link de redefinição enviado (simulação).', 'send'); };
FORMS.contact = (d, f) => { f.reset(); toast(`Obrigado, ${esc(d.n.split(' ')[0])}! Mensagem enviada (simulação).`, 'send'); };

/* ---------- Favoritos ---------- */
function toggleIn(arr, v) { const i = arr.indexOf(v); if (i >= 0) { arr.splice(i, 1); return false; } arr.push(v); return true; }
ACT['fav-opp'] = a => { const on = toggleIn(S.favOpps, a.dataset.id); toast(on ? 'Oportunidade salva nos favoritos.' : 'Removida dos favoritos.', 'heart', on ? '#/v/favoritos' : '', on ? 'Ver favoritos' : ''); if (on) log(`Salvou ${oppById(a.dataset.id).title} nos favoritos`, 'heart'); rerender(); };
ACT['fav-ong'] = a => { const on = toggleIn(S.favOngs, a.dataset.id); toast(on ? `${esc(ongById(a.dataset.id).name)} adicionada às ONGs favoritas.` : 'Removida das favoritas.', 'heart'); rerender(); };
ACT['fav-camp'] = a => { const on = toggleIn(S.favCamps, a.dataset.id); toast(on ? 'Você vai receber notificações desta campanha.' : 'Você deixou de acompanhar a campanha.', 'bookmark'); rerender(); };

/* ---------- Filtros ---------- */
ACT['of-toggle'] = a => { toggleIn(OF[a.dataset.k], a.dataset.v); rerender(); };
ACT['of-clear'] = () => { OF = OF_DEFAULT(); rerender(); };
ACT['filters-open'] = () => $('#filters').classList.add('open');
ACT['filters-close'] = () => $('#filters').classList.remove('open');
FORMS['of-search'] = d => { OF.q = d.q || ''; rerender(); };
FORMS['hero-search'] = d => { go(`#/oportunidades?q=${encodeURIComponent(d.q || '')}${d.cat ? '&cat=' + d.cat : ''}`); };
FORMS['gsearch-page'] = d => go('#/busca?q=' + encodeURIComponent(d.q || ''));
ACT['ef-view'] = a => { EF.view = a.dataset.v; rerender(); };
ACT['ef-clear'] = () => { Object.assign(EF, {q:'', country:'', state:'', cat:'', verified:false}); rerender(); };
ACT['ev-view'] = a => { EV.view = a.dataset.v; rerender(); };
ACT['cal-nav'] = a => { EV.m += +a.dataset.d; if (EV.m > 11) { EV.m = 0; EV.y++; } if (EV.m < 0) { EV.m = 11; EV.y--; } EV.day = null; rerender(); };
ACT['cal-day'] = a => { EV.day = +a.dataset.d; rerender(); };
ACT['cf-cat'] = a => { CF.cat = a.dataset.v; rerender(); };
ACT.kcat = a => { KCAT = a.dataset.v; rerender(); };
ACT.story = a => { const s = STORIES.find(x => x.id === a.dataset.id), g = ongById(s.ong); openModal(esc(s.title), `<div style="height:220px;border-radius:16px;overflow:hidden;margin-bottom:18px">${cover(s.cat, s.id, esc(s.place), true)}</div><div class="row-sm" style="margin-bottom:12px"><span class="tag tag-green">${esc(s.stat)}</span><a class="org-line" href="#/ong/${g.id}">${ongLogo(g, 20)} ${esc(g.name)}</a></div><p style="font-size:16px;color:var(--ink2);line-height:1.7">${esc(s.text)}</p><p class="xs muted">História fictícia criada para a demonstração.</p>`, `<a class="btn btn-primary" href="#/ong/${g.id}">Conhecer a organização</a>`, 'wide'); };

/* ---------- Login / cadastro ---------- */
ACT['login-t'] = a => { LOGIN_T = a.dataset.t; rerender(); };
FORMS.login = () => { S.role = LOGIN_T === 'o' ? 'ong' : 'volunteer'; save(); toast('Login realizado (demonstração).', 'check'); go(LOGIN_T === 'o' ? '#/o/dashboard' : '#/v/painel'); };
ACT['su-tipo'] = a => { SU.tipo = a.dataset.t; SU.step = 1; rerender(); };
ACT['su-back'] = () => { if (SU.step > 1) SU.step--; else SU.tipo = null; rerender(); };
ACT['su-next'] = () => { SU.step++; rerender(); };
ACT['su-int'] = a => { toggleIn(SU.d.interests, a.dataset.v); rerender(); };
ACT['su-skill'] = a => { toggleIn(SU.d.skills, a.dataset.v); rerender(); };
ACT['su-day'] = a => { toggleIn(SU.d.days, a.dataset.v); rerender(); };
FORMS['su-skill'] = d => { if (d.s && d.s.trim()) { SU.d.skills.push(d.s.trim()); rerender(); } };
FORMS['su-v1'] = d => { Object.assign(SU.d, d); SU.step = 2; rerender(); };
const CITY_COORDS = Object.fromEntries(ONGS.map(g => [norm(g.city), [g.lat, g.lng]]));
ACT['su-finish-v'] = () => {
  const d = SU.d, c = CITY_COORDS[norm(d.city)] || [-26.30, -48.85];
  S.me = {id:'livia', name:d.name, email:d.email, age:+d.age, city:d.city, state:d.state, country:d.country, lat:c[0], lng:c[1], photo:null,
    headline:'Voluntário(a) na 12Help!', bio:'Olá! Acabei de chegar na 12Help! e estou em busca da minha primeira causa.',
    interests:d.interests, skills:d.skills.length ? d.skills : ['Trabalho em equipe'], avail:{days:d.days.length ? d.days : ['sab'], shift:d.shift, mode:d.mode, hours:3},
    exp:[], courses:[], recs:[], minor:+d.age < 18};
  S.apps = []; S.points = 50; S.pointsLog = [{n:50, why:'Boas-vindas à 12Help!', t:todayISO()}]; S.badges = {}; S.activity = [{t:todayISO(), text:'Criou o perfil na 12Help!', i:'sparkle'}];
  S.myEvents = []; S.eventInterest = []; S.favOpps = []; S.favOngs = []; S.donations = []; S.interests = [];
  S.threads = S.threads.filter(t => t.role === 'o'); S.notifs = S.notifs.filter(n => n.role === 'o');
  notify('v', 'match', `Encontramos <b>${recommended().length} oportunidades</b> que combinam com você`, '#/v/match');
  if (S.me.minor) notify('v', 'info', 'Pedido de autorização enviado ao seu responsável (simulação)', '#/seguranca#menores');
  S.role = 'volunteer'; SU.step = 4; save(); rerender();
};
FORMS['su-o1'] = d => { Object.assign(SU.d, d); SU.step = 2; rerender(); };
FORMS['su-o2'] = d => {
  Object.assign(SU.d, d); const c = CITY_COORDS[norm(SU.d.city)] || [-26.30, -48.85];
  S.ongMe = {name:SU.d.name, ini:SU.d.name.split(' ').filter(w => w.length > 2).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'ON', city:SU.d.city, state:'', country:SU.d.country, lat:c[0], lng:c[1], cat:SU.d.cat, founded:+SU.d.founded || 2020, tagline:d.tagline, desc:d.desc, site:d.site || 'não informado', verified:false, vols:0, rating:5};
  S.role = 'ong'; SU.step = 3; notify('o', 'info', 'Cadastro recebido. Verificação pendente (simulação).', '#/o/perfil'); save(); rerender();
};

document.addEventListener('DOMContentLoaded', () => render());
