/* =========================================================
   12Help! — Áreas logadas: voluntário, ONG, mensagens e ações
   ========================================================= */
'use strict';

const VOL_NAV = [['v/painel','Meu painel','grid'],['v/match','Combinações','sparkle'],['v/perfil','Meu perfil','user'],['v/curriculo','Meu currículo','file'],['v/inscricoes','Minhas inscrições','check'],['mensagens','Mensagens','msg'],['v/conquistas','Conquistas','award'],['v/passaporte','Passaporte 12Help!','passport'],['v/favoritos','Favoritos','heart'],['v/certificados','Certificados','shield'],['v/atividade','Histórico','clock'],['notificacoes','Notificações','bell'],['v/config','Configurações','settings']];
const ONG_NAV = [['o/dashboard','Dashboard','grid'],['o/perfil','Perfil institucional','shield'],['o/publicar','Publicar oportunidade','plus'],['o/projetos','Projetos','brief'],['o/voluntarios','Gerenciar voluntários','users'],['o/inscricoes','Inscrições','check'],['mensagens','Mensagens','msg'],['o/eventos','Eventos','cal'],['o/campanhas','Campanhas','coins'],['o/estatisticas','Estatísticas','chart'],['notificacoes','Notificações','bell']];

function areaShell(content, active) {
  const ong = isOng(), nav = ong ? ONG_NAV : VOL_NAV, g = ongById(MY_ONG), l = level();
  const counts = {mensagens:S.threads.filter(t => t.role === roleKey() && t.unread).length, notificacoes:S.notifs.filter(n => n.role === roleKey() && !n.read).length, 'o/inscricoes':ongApplicants().filter(a => a.status === 'pendente').length};
  return `<div class="wrap shell"><aside class="card side">
    <div class="side-me">${ong ? ongLogo(g, 46) : avatar(S.me, 46)}<div style="min-width:0"><b class="small" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(ong ? g.name : S.me.name)}</b><span class="xs muted">${ong ? (g.verified ? 'ONG · selo demo' : 'ONG · verificação pendente') : `Nível ${l.n} · ${l.name}`}</span>${ong ? '' : `<div style="margin-top:5px;width:120px">${progress(l.pct)}</div>`}</div></div>
    <nav>${nav.map(([k, label, ic]) => `<a href="#/${k}" class="${active === k ? 'on' : ''}">${I(ic, 18)}<span>${label}</span>${counts[k] ? `<span class="badge-n">${counts[k]}</span>` : ''}</a>`).join('')}</nav></aside>
    <section class="area fade">${content}</section></div>`;
}
const VP = {}, OP = {};
PAGES.v = sub => { if (!isVol()) return gate('volunteer'); const k = VP[sub] ? sub : 'painel'; return areaShell(VP[k](), 'v/' + k); };
PAGES.o = sub => { if (!isOng()) return gate('ong'); const k = OP[sub] ? sub : 'dashboard'; return areaShell(OP[k](), 'o/' + k); };

function requireRole(role, msg) {
  if (S.role === role) return true;
  const v = role === 'volunteer';
  openModal(v ? 'Entre como voluntária' : 'Entre como organização', `<p class="muted">${msg || (v ? 'Esta ação é exclusiva para voluntários.' : 'Esta ação é exclusiva para organizações.')} Use a conta de demonstração para continuar.</p>`,
    `<button class="btn btn-ghost" data-act="close">Agora não</button><button class="btn ${v ? 'btn-primary' : 'btn-blue'}" data-act="role-modal" data-r="${role}">Entrar como ${v ? 'Lívia (voluntária)' : 'Raízes Verdes (ONG)'}</button>`);
  return false;
}
ACT['role-modal'] = a => { S.role = a.dataset.r; save(); closeModal(); toast('Conta de demonstração conectada.', 'user'); rerender(); };

const statusTag = s => ({pendente:'<span class="tag tag-warn">Pendente</span>', aceita:'<span class="tag tag-green">Aceita</span>', 'concluída':'<span class="tag">Concluída</span>', recusada:'<span class="tag tag-danger">Recusada</span>', cancelada:'<span class="tag tag-gray">Cancelada</span>'}[s] || `<span class="tag tag-gray">${s}</span>`);
const thumb = (cat, seed, s = 56) => `<div style="width:${s}px;height:${s}px;border-radius:14px;overflow:hidden;flex-shrink:0">${cover(cat, seed)}</div>`;
const oppRow = (o, m, extra = '') => { const g = ongById(o.ong); return `<a href="#/oportunidade/${o.id}" class="row" style="flex-wrap:nowrap;padding:12px 0;border-top:1px solid var(--line2)">${thumb(o.cat, o.id)}<div style="flex:1;min-width:0"><b class="small" style="display:block">${esc(o.title)}</b><span class="xs muted">${esc(g.name)} · ${o.mode} · ${esc(oppLoc(o).city)}</span></div>${m ? `<span class="tag tag-green">${m}%</span>` : ''}${extra}</a>`; };

/* =========================================================
   ÁREA DO VOLUNTÁRIO
   ========================================================= */
VP.painel = () => {
  const l = level(), recs = recommended(), me = S.me;
  const upcoming = [
    ...S.apps.filter(a => a.status === 'aceita').map(a => { const o = oppById(a.opp); return o && {t:o.title, sub:`${ongById(o.ong).name} · ${o.days[0] === 'flex' ? 'dias flexíveis' : o.days.map(d => DOWN[d]).join(', ')} · ${SHIFT[o.shift]}`, href:'#/oportunidade/' + o.id, i:'brief'}; }),
    ...allEvents().filter(e => S.myEvents.includes(e.id)).map(e => ({t:e.title, sub:`${fmtDate(e.date)} · ${e.time} · ${e.city}`, href:'#/eventos', i:'cal'}))].filter(Boolean);
  const camps = allCamps().filter(c => S.favCamps.includes(c.id));
  return `<div class="card pad" style="background:linear-gradient(120deg,#fff 40%,var(--green-l));margin-bottom:20px">
    <div class="row between"><div class="row" style="flex-wrap:nowrap">${avatar(me, 64)}<div><span class="xs muted b">BOA NOITE, QUE BOM TE VER</span><h1 style="font-size:26px;margin:2px 0">Olá, ${esc(me.name.split(' ')[0])}!</h1><p class="muted small" style="margin:0">${recs.length} oportunidades combinam com você hoje · ${S.notifs.filter(n => n.role === 'v' && !n.read).length} notificações novas</p></div></div>
      <div style="min-width:240px"><div class="row between small"><b>Nível ${l.n} · ${l.name}</b><span class="muted">${num(S.points)} pts</span></div><div style="margin:8px 0 4px">${progress(l.pct, 'lg')}</div><span class="xs muted">Faltam ${l.toNext} pontos para o nível ${l.n + 1}</span></div></div></div>
    <div class="kpis">${[['clock', 'Horas de voluntariado', hoursTotal(), `${me.avail?.hours || 3}h/semana disponíveis`], ['brief', 'Projetos realizados', me.exp.length, `${S.apps.filter(a => a.status === 'aceita').length} em andamento`], ['award', 'Medalhas', Object.keys(S.badges).length + '/' + BADGES.length, 'Ver conquistas'], ['globe', 'Países', countriesDone().length, citiesDone().length + ' cidades']].map(([i, l2, v, d]) => `<div class="card kpi"><div class="kh">${l2}<span class="ki">${I(i, 17)}</span></div><div class="kv">${v}</div><div class="kd">${d}</div></div>`).join('')}</div>
    <div class="grid split" style="--cols:1.5fr 1fr;margin-top:20px">
      <div class="stack">
        <div class="card pad"><div class="card-h"><h3>${I('sparkle', 18)} Combinações para você</h3><a class="link small" href="#/v/match">Ver ${recs.length}</a></div>
          ${recs.length ? recs.slice(0, 4).map(x => oppRow(x.o, x.m.score)).join('') : emptyBox('sparkle', 'Complete seu perfil', 'Adicione interesses e habilidades para receber combinações.')}</div>
        <div class="card pad"><div class="card-h"><h3>Próximas atividades</h3><a class="link small" href="#/v/inscricoes">Inscrições</a></div>
          ${upcoming.length ? upcoming.map(u => `<a href="${u.href}" class="row" style="flex-wrap:nowrap;padding:10px 0;border-top:1px solid var(--line2)"><span class="fact" style="padding:0;background:none"><span class="fi" style="background:var(--blue-l)">${I(u.i, 17)}</span></span><div style="min-width:0"><b class="small">${esc(u.t)}</b><div class="xs muted">${esc(u.sub)}</div></div></a>`).join('') : `<p class="muted small">Nenhuma atividade agendada. <a class="link" href="#/eventos">Ver eventos</a></p>`}</div>
        <div class="card pad"><div class="card-h"><h3>Atividade recente</h3><a class="link small" href="#/v/atividade">Histórico</a></div>
          ${S.activity.slice(0, 5).map(x => `<div class="row" style="flex-wrap:nowrap;padding:8px 0;border-top:1px solid var(--line2)">${I(x.i, 16, 'muted')}<span class="small" style="flex:1">${esc(x.text)}</span><span class="xs muted">${fmtDate(x.t)}</span></div>`).join('')}</div>
      </div>
      <div class="stack">
        <div class="card" style="overflow:hidden"><div class="drop-h"><b>Notificações</b><a class="link small" href="#/notificacoes">Todas</a></div>${S.notifs.filter(n => n.role === 'v').slice(0, 4).map(notifRow).join('')}</div>
        <div class="card pad"><div class="card-h"><h3>Medalhas recentes</h3></div><div class="badges-row">${BADGES.map(b => `<span class="mini-badge" style="${S.badges[b.k] ? '' : 'background:#E2E8F0;color:#94A3B8;box-shadow:none'}" title="${b.n}">${I(b.i, 18)}</span>`).join('')}</div>
          ${(() => { const nx = BADGES.find(b => !S.badges[b.k]); return nx ? `<div style="margin-top:14px" class="small"><b>Próxima: ${nx.n}</b><div class="muted xs">${nx.d}</div><div style="margin-top:6px">${progress(nx.cur() / nx.goal * 100)}</div><span class="xs muted">${Math.min(nx.cur(), nx.goal)}/${nx.goal}</span></div>` : ''; })()}</div>
        <div class="card pad"><div class="card-h"><h3>Campanhas que acompanho</h3></div>${camps.length ? camps.map(c => `<a href="#/vaquinha/${c.id}" style="display:block;padding:10px 0;border-top:1px solid var(--line2)"><b class="small">${esc(c.title)}</b>${progress(c.raisedNow / c.goal * 100)}<span class="xs muted">${Math.round(c.raisedNow / c.goal * 100)}% · ${money(c.raisedNow)}</span></a>`).join('') : '<p class="small muted">Nenhuma campanha acompanhada.</p>'}</div>
        <a class="card pad-s row lift" href="#/v/passaporte" style="flex-wrap:nowrap;background:linear-gradient(120deg,var(--blue-d),var(--blue));color:#fff;border:0">${I('passport', 30)}<div><b>Passaporte 12Help!</b><div class="small" style="color:#BFD3E8">${S.me.exp.length} carimbos · ${countriesDone().length} países</div></div></a>
      </div></div>`;
};

let MF = 'all';
VP.match = () => {
  const all = recommended(), list = all.filter(x => MF === 'all' || (MF === '90' && x.m.score >= 90) || (MF === 'remote' && x.o.mode === 'Remoto') || (MF === 'near' && x.o.mode !== 'Remoto' && km(S.me, oppLoc(x.o)) < 150));
  const cats = interestCats(S.me);
  const ongs = allOngs().filter(g => cats.includes(g.cat)).map(g => { const os = allOpps().filter(o => o.ong === g.id); const s = os.length ? Math.round(os.reduce((a, o) => a + matchOpp(o).score, 0) / os.length) : 70; return {g, s}; }).sort((a, b) => b.s - a.s).slice(0, 6);
  return `<div class="area-h"><div><span class="eyebrow">${I('sparkle', 14)} Combinações para você</span><h1 style="margin-top:6px">Encontramos ${all.length} oportunidades que combinam com você</h1><p>Analisamos seus interesses (${S.me.interests.map(k => causeByK(k)?.n).filter(Boolean).join(', ')}), habilidades, localização e disponibilidade.</p></div><a class="btn btn-outline btn-sm" href="#/v/perfil">${I('edit', 15)} Ajustar preferências</a></div>
    <div class="tabs" style="margin-bottom:20px">${[['all', 'Todas'], ['90', '90% ou mais'], ['near', 'Perto de mim'], ['remote', 'Remotas']].map(([k, l]) => `<button class="${MF === k ? 'on' : ''}" data-act="mf" data-v="${k}">${l}</button>`).join('')}</div>
    ${list.length ? `<div class="grid auto">${list.map(x => oppCard(x.o)).join('')}</div>` : emptyBox('sparkle', 'Nenhuma combinação neste filtro')}
    <h2 style="font-size:22px;margin-top:36px">ONGs compatíveis com você</h2><p class="muted">Demonstre interesse para que a organização veja seu perfil. Se o interesse for mútuo, vocês podem iniciar uma conversa.</p>
    <div class="grid auto">${ongs.map(({g, s}) => `<div class="card pad-s fade"><div class="row" style="flex-wrap:nowrap">${ongLogo(g, 48)}<div style="flex:1;min-width:0"><b class="small" style="display:block">${esc(g.name)}</b><span class="xs muted">${esc(g.city)} · ${COUNTRIES[g.country].f}</span></div><span class="tag tag-green">${s}%</span></div>
      <p class="small muted" style="margin:10px 0">${esc(g.tagline)}</p><div class="row-sm"><button class="btn btn-sm ${S.ongInterest.includes(g.id) ? 'btn-outline' : 'btn-primary'}" data-act="ong-interest" data-id="${g.id}">${S.ongInterest.includes(g.id) ? I('check', 14) + ' Interesse enviado' : I('star', 14) + ' Tenho interesse'}</button><a class="btn btn-sm btn-ghost" href="#/ong/${g.id}">Ver perfil</a></div></div>`).join('')}</div>`;
};
ACT.mf = a => { MF = a.dataset.v; rerender(); };

VP.perfil = () => {
  const m = S.me, fields = [m.photo, m.bio, m.headline, m.skills.length > 2, m.interests.length > 1, m.exp.length, m.courses.length, m.avail?.days?.length];
  const pct = Math.round(fields.filter(Boolean).length / fields.length * 100);
  const favs = S.favOngs.map(ongById).filter(Boolean);
  return `<div class="grid split" style="--cols:1fr 300px;align-items:start">
  <div class="stack">
    <div class="card" style="overflow:hidden">${profileCover()}<div class="phead2">
      <div class="row between" style="align-items:flex-end"><div class="rel" style="width:128px">${avatar(m, 128)}<label class="btn btn-white btn-icon" style="position:absolute;right:0;bottom:6px;box-shadow:var(--sh);cursor:pointer" title="Alterar foto">${I('camera', 17)}<input type="file" accept="image/*" data-change="photo" hidden></label></div>
        <div class="row-sm"><a class="btn btn-outline btn-sm" href="#/perfil/livia">${I('eye', 15)} Ver como público</a><button class="btn btn-primary btn-sm" data-act="edit-profile">${I('edit', 15)} Editar perfil</button></div></div>
      <h1 style="font-size:28px;margin:12px 0 2px">${esc(m.name)}</h1><p style="margin:0 0 6px;font-size:16px;color:var(--ink2)">${esc(m.headline)}</p>
      <div class="meta">${I('pin', 15)} ${esc(m.city)}${m.state ? ', ' + esc(m.state) : ''} · ${flag(m.country)} · ${m.age} anos${m.minor ? ' · <span class="tag tag-warn">Perfil protegido (menor de idade)</span>' : ''}</div>
      <div class="row" style="margin-top:14px">${[[hoursTotal(), 'horas'], [m.exp.length, 'projetos'], [countriesDone().length, 'países'], [S.points, 'pontos']].map(([n, l]) => `<div><b style="font-size:20px">${num(n)}</b> <span class="small muted">${l}</span></div>`).join('<span style="color:var(--line)">|</span>')}</div>
      <div class="badges-row" style="margin-top:14px">${BADGES.filter(b => S.badges[b.k]).map(b => `<span class="mini-badge" title="${b.n}">${I(b.i, 18)}</span>`).join('')}</div></div></div>
    <div class="card pad"><div class="card-h"><h3>Sobre</h3><button class="btn btn-ghost btn-sm" data-act="edit-profile">${I('edit', 15)}</button></div><p style="color:var(--ink2);margin:0">${esc(m.bio)}</p></div>
    <div class="grid g2"><div class="card pad"><div class="card-h"><h3>Interesses sociais</h3></div><div class="row-sm">${m.interests.map(causeByK).filter(Boolean).map(c => `<span class="tag tag-green">${I(c.i, 12)} ${c.n}</span>`).join('') || '<span class="muted small">Nenhum interesse</span>'}</div></div>
      <div class="card pad"><div class="card-h"><h3>Habilidades</h3></div><div class="row-sm">${m.skills.map(s => `<span class="tag tag-line">${esc(s)}</span>`).join('')}</div></div></div>
    <div class="card pad"><div class="card-h"><h3>Disponibilidade</h3></div><div class="row"><div class="days">${Object.entries(DOWN).map(([k, l]) => `<span class="${m.avail.days.includes(k) ? 'on' : ''}">${l.slice(0, 3)}</span>`).join('')}</div><span class="tag tag-gray">${SHIFT[m.avail.shift]}</span><span class="tag tag-gray">${m.avail.mode}</span><span class="tag tag-gray">${m.avail.hours || 3}h/semana</span></div></div>
    <div class="card pad"><div class="card-h"><h3>Experiências anteriores</h3><button class="btn btn-outline btn-sm" data-act="add-exp">${I('plus', 15)} Adicionar</button></div>
      ${m.exp.length ? `<div class="timeline">${m.exp.slice().reverse().map(x => { const g = ongById(x.ong); return `<div class="tl"><div class="row between"><b>${esc(x.role)}</b><span class="tag tag-line">${x.hours}h</span></div><div class="small"><a class="link" href="#/ong/${g.id}">${esc(g.name)}</a> · ${esc(x.city)}, ${COUNTRIES[x.country].f}</div><div class="xs muted">${fmtMonth(x.start)} – ${fmtMonth(x.end)}</div><p class="small muted" style="margin:6px 0 0">${esc(x.desc || '')}</p></div>`; }).join('')}</div>` : emptyBox('brief', 'Nenhuma experiência registrada', 'Adicione experiências anteriores ou conclua uma inscrição.')}</div>
    <div class="card pad"><div class="card-h"><h3>Histórico de inscrições</h3><a class="link small" href="#/v/inscricoes">Gerenciar</a></div>${S.apps.length ? S.apps.map(a => { const o = oppById(a.opp); return o ? oppRow(o, null, statusTag(a.status)) : ''; }).join('') : '<p class="muted small">Nenhuma inscrição ainda.</p>'}</div>
  </div>
  <aside class="stack sticky">
    <div class="card pad"><h4>Força do perfil</h4>${ring(pct, 84)}<p class="small muted" style="margin:10px 0 0">${pct < 100 ? 'Perfis completos recebem até 3x mais convites de ONGs.' : 'Perfil completo! 🎉'}</p></div>
    <div class="card pad"><h4>ONGs favoritas</h4>${favs.length ? favs.map(g => `<a href="#/ong/${g.id}" class="row" style="flex-wrap:nowrap;padding:8px 0">${ongLogo(g, 34)}<div style="min-width:0"><b class="small">${esc(g.name)}</b><div class="xs muted">${esc(g.city)}</div></div></a>`).join('') : '<p class="small muted">Nenhuma ainda.</p>'}</div>
    <div class="card pad"><h4>Atalhos</h4><a class="link small" style="display:block;padding:4px 0" href="#/v/curriculo">${I('file', 15)} Currículo voluntário</a><a class="link small" style="display:block;padding:4px 0" href="#/v/passaporte">${I('passport', 15)} Passaporte</a><a class="link small" style="display:block;padding:4px 0" href="#/v/config">${I('lock', 15)} Privacidade</a></div>
  </aside></div>`;
};
ACT['edit-profile'] = () => {
  const m = S.me;
  openModal('Editar perfil', `<form data-form="edit-profile" id="ep">
    <div class="frow"><label class="field"><span>Nome</span><input class="input" name="name" value="${esc(m.name)}" required></label><label class="field"><span>Idade</span><input class="input" type="number" min="14" name="age" value="${m.age}" required></label></div>
    <label class="field"><span>Título profissional / headline</span><input class="input" name="headline" value="${esc(m.headline)}"></label>
    <label class="field"><span>Biografia</span><textarea class="input" name="bio">${esc(m.bio)}</textarea></label>
    <div class="frow3"><label class="field"><span>Cidade</span><input class="input" name="city" value="${esc(m.city)}"></label><label class="field"><span>Estado</span><input class="input" name="state" value="${esc(m.state || '')}"></label><label class="field"><span>País</span><select class="input" name="country">${Object.entries(COUNTRIES).map(([k, c]) => `<option value="${k}" ${m.country === k ? 'selected' : ''}>${c.n}</option>`).join('')}</select></label></div>
    <div class="field"><span>Interesses sociais</span><div class="row-sm">${CAUSES.map(c => `<label class="chip" style="padding:6px 11px"><input type="checkbox" name="int" value="${c.k}" ${m.interests.includes(c.k) ? 'checked' : ''} style="accent-color:var(--green)"> ${c.n}</label>`).join('')}</div></div>
    <label class="field"><span>Habilidades (separadas por vírgula)</span><input class="input" name="skills" value="${esc(m.skills.join(', '))}"></label>
    <div class="field"><span>Dias disponíveis</span><div class="row-sm">${Object.entries(DOWN).map(([k, l]) => `<label class="chip" style="padding:6px 11px"><input type="checkbox" name="days" value="${k}" ${m.avail.days.includes(k) ? 'checked' : ''}> ${l}</label>`).join('')}</div></div>
    <div class="frow3"><label class="field"><span>Turno</span><select class="input" name="shift">${Object.entries(SHIFT).map(([k, l]) => `<option value="${k}" ${m.avail.shift === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label class="field"><span>Modalidade</span><select class="input" name="mode">${['Presencial', 'Remoto', 'Híbrido'].map(x => `<option ${m.avail.mode === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label class="field"><span>Horas/semana</span><input class="input" type="number" min="1" max="40" name="hours" value="${m.avail.hours || 3}"></label></div></form>`,
    `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="submit-form" data-f="ep">Salvar alterações</button>`, 'wide');
};
ACT['submit-form'] = a => { const f = document.getElementById(a.dataset.f); if (f.reportValidity()) f.requestSubmit(); };
FORMS['edit-profile'] = (d, f) => {
  const fd = new FormData(f), m = S.me, c = CITY_COORDS[norm(d.city)];
  Object.assign(m, {name:d.name, age:+d.age, headline:d.headline, bio:d.bio, city:d.city, state:d.state, country:d.country, interests:fd.getAll('int'), skills:d.skills.split(',').map(s => s.trim()).filter(Boolean), minor:+d.age < 18});
  if (c) { m.lat = c[0]; m.lng = c[1]; }
  m.avail = {days:fd.getAll('days'), shift:d.shift, mode:d.mode, hours:+d.hours};
  log('Atualizou o perfil', 'edit'); closeModal(); toast('Perfil atualizado! As recomendações foram recalculadas.', 'check'); rerender();
};
CHANGE.photo = t => {
  const file = t.files[0]; if (!file) return;
  const r = new FileReader();
  r.onload = () => { const img = new Image(); img.onload = () => { const c = document.createElement('canvas'), s = 240; c.width = c.height = s; const k = Math.max(s / img.width, s / img.height); const w = img.width * k, h = img.height * k; c.getContext('2d').drawImage(img, (s - w) / 2, (s - h) / 2, w, h); S.me.photo = c.toDataURL('image/jpeg', .85); toast('Foto de perfil atualizada.', 'camera'); rerender(); }; img.src = r.result; };
  r.readAsDataURL(file);
};

/* ---------- Currículo voluntário ---------- */
function cvHTML() {
  const m = S.me, acq = [...new Set(m.exp.flatMap(x => x.skills || []))];
  const code = '12H-' + (hash(m.name + m.exp.length) % 90000 + 10000) + '-DEMO';
  return `<div class="cv">
    <div class="cv-h">${avatar(m, 84)}<div style="flex:1;min-width:0"><h2 style="margin:0;font-size:26px">${esc(m.name)}</h2><div style="color:var(--ink2)">${esc(m.headline)}</div><div class="small muted">${esc(m.city)}${m.state ? ', ' + esc(m.state) : ''} · ${COUNTRIES[m.country].n} · ${esc(m.email || 'contato via 12Help!')}</div></div>
      <div style="text-align:right">${logoMark(26)}<div class="xs muted b" style="margin-top:4px">CURRÍCULO VOLUNTÁRIO</div></div></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center">${[[hoursTotal() + 'h', 'dedicadas'], [m.exp.length, 'projetos'], [countriesDone().length, 'países'], [Object.keys(S.badges).length, 'medalhas']].map(([v, l]) => `<div style="background:var(--soft);border-radius:10px;padding:10px"><b style="font-size:20px;color:var(--blue)">${v}</b><div class="xs muted">${l}</div></div>`).join('')}</div>
    <h3>Resumo</h3><p style="margin:0">${esc(m.bio)}</p>
    <h3>Experiências voluntárias</h3>${m.exp.length ? m.exp.slice().reverse().map(x => { const g = ongById(x.ong); return `<div class="cv-item"><div style="display:flex;justify-content:space-between;gap:10px"><b>${esc(x.role)} · ${esc(g.name)}</b><span class="small muted" style="white-space:nowrap">${fmtMonth(x.start)} – ${fmtMonth(x.end)}</span></div><div class="small muted">${esc(x.city)}, ${COUNTRIES[x.country].n} · ${x.hours} horas · ${CATS[x.cat || g.cat].n}</div><div class="small">${esc(x.desc || '')}</div></div>`; }).join('') : '<p class="muted small">Nenhuma experiência registrada.</p>'}
    <h3>Habilidades</h3><div class="row-sm">${[...new Set([...m.skills, ...acq])].map(s => `<span class="tag tag-line">${esc(s)}</span>`).join('')}</div>
    ${acq.length ? `<p class="small muted" style="margin:8px 0 0">Adquiridas no voluntariado: ${acq.map(esc).join(', ')}.</p>` : ''}
    <h3>Cursos e certificações</h3>${m.courses.length ? m.courses.map(c => `<div class="cv-item"><b>${esc(c.n)}</b><div class="small muted">${esc(c.org)} · ${c.y}${c.cert ? ' · com certificado' : ''}</div></div>`).join('') : '<p class="muted small">Nenhum curso registrado.</p>'}
    <h3>Conquistas</h3><div class="row-sm">${BADGES.filter(b => S.badges[b.k]).map(b => `<span class="tag tag-green">${I(b.i, 12)} ${b.n}</span>`).join('') || '<span class="muted small">Ainda sem medalhas.</span>'}</div>
    ${m.recs.length ? `<h3>Recomendações de organizações</h3>${m.recs.map(r => `<div class="cv-item" style="border-left:3px solid var(--green);padding-left:12px"><div class="small">“${esc(r.text)}”</div><div class="xs muted">${esc(r.by)} · ${esc(ongById(r.ong).name)}</div></div>`).join('')}` : ''}
    <div style="margin-top:26px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><span class="watermark">Código de verificação demonstrativo: ${code}</span><span class="watermark">Documento fictício gerado pela 12Help! · sem validade oficial</span></div></div>`;
}
VP.curriculo = () => `<div class="area-h"><div><h1>Meu currículo voluntário</h1><p>Seu histórico social em formato profissional, pronto para compartilhar.</p></div>
  <div class="row-sm"><button class="btn btn-outline btn-sm" data-act="add-exp">${I('plus', 15)} Experiência</button><button class="btn btn-outline btn-sm" data-act="add-course">${I('plus', 15)} Curso</button><button class="btn btn-outline btn-sm" data-act="add-rec">${I('star', 15)} Pedir recomendação</button><button class="btn btn-primary btn-sm" data-act="cv-pdf">${I('download', 15)} Exportar PDF</button></div></div>
  ${cvHTML()}`;
ACT['cv-pdf'] = () => openModal('Pré-visualização do PDF', `<div style="background:var(--soft);padding:16px;border-radius:16px;max-height:60vh;overflow:auto"><div style="transform-origin:top center">${cvHTML()}</div></div><p class="xs muted" style="margin:12px 0 0">Na janela de impressão, escolha <b>Salvar como PDF</b>. O documento é demonstrativo.</p>`, `<button class="btn btn-ghost" data-act="close">Fechar</button><button class="btn btn-primary" data-act="cv-print">${I('download', 16)} Salvar como PDF</button>`, 'xwide');
ACT['cv-print'] = () => { closeModal(); printHTML(cvHTML()); toast('Exportação de PDF simulada: use “Salvar como PDF”.', 'download'); };
ACT['add-exp'] = () => openModal('Adicionar experiência', `<form data-form="add-exp" id="ax">
  <label class="field"><span>Organização</span><select class="input" name="ong">${allOngs().map(g => `<option value="${g.id}">${esc(g.name)} · ${g.city}</option>`).join('')}</select></label>
  <label class="field"><span>Função / projeto</span><input class="input" name="role" required placeholder="Ex.: Voluntária em oficinas de leitura"></label>
  <div class="frow3"><label class="field"><span>Início</span><input class="input" type="month" name="start" required value="2026-01"></label><label class="field"><span>Fim</span><input class="input" type="month" name="end" value="2026-06"></label><label class="field"><span>Horas</span><input class="input" type="number" min="1" name="hours" value="20" required></label></div>
  <div class="frow"><label class="field"><span>Cidade</span><input class="input" name="city" required value="${esc(S.me.city)}"></label><label class="field"><span>País</span><select class="input" name="country">${Object.entries(COUNTRIES).map(([k, c]) => `<option value="${k}" ${k === S.me.country ? 'selected' : ''}>${c.n}</option>`).join('')}</select></label></div>
  <label class="field"><span>Causa</span><select class="input" name="cat">${Object.entries(CATS).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join('')}</select></label>
  <label class="field"><span>Descrição e resultados</span><textarea class="input" name="desc"></textarea></label>
  <label class="field"><span>Habilidades adquiridas (vírgula)</span><input class="input" name="skills" placeholder="Ex.: Liderança, Facilitação"></label></form>`,
  `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="submit-form" data-f="ax">Adicionar</button>`, 'wide');
FORMS['add-exp'] = d => {
  S.me.exp.push({id:uid(), ong:d.ong, role:d.role, cat:d.cat, start:d.start, end:d.end, hours:+d.hours, city:d.city, country:d.country, desc:d.desc, skills:d.skills ? d.skills.split(',').map(s => s.trim()).filter(Boolean) : []});
  log(`Registrou a experiência ${d.role}`, 'brief'); closeModal(); toast(`Experiência adicionada (+40 pontos) e carimbada no passaporte.`, 'passport', '#/v/passaporte', 'Ver passaporte'); addPoints(40, 'Experiência registrada'); rerender();
};
ACT['add-course'] = () => openModal('Adicionar curso ou certificação', `<form data-form="add-course" id="ac"><label class="field"><span>Nome do curso</span><input class="input" name="n" required></label><div class="frow"><label class="field"><span>Instituição</span><input class="input" name="org" required></label><label class="field"><span>Ano</span><input class="input" type="number" name="y" value="2026"></label></div><label class="check"><input type="checkbox" name="cert" checked> Possui certificado</label></form>`, `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="submit-form" data-f="ac">Adicionar</button>`);
FORMS['add-course'] = d => { S.me.courses.push({n:d.n, org:d.org, y:+d.y, cert:!!d.cert}); closeModal(); toast('Curso adicionado ao currículo.'); rerender(); };
ACT['add-rec'] = () => {
  const ongs = [...new Set(S.me.exp.map(x => x.ong))].filter(id => !S.me.recs.some(r => r.ong === id));
  if (!ongs.length) return toast('Todas as organizações com quem você colaborou já recomendaram você.', 'info');
  openModal('Pedir recomendação', `<form data-form="add-rec" id="ar"><label class="field"><span>Organização</span><select class="input" name="ong">${ongs.map(id => `<option value="${id}">${esc(ongById(id).name)}</option>`).join('')}</select></label><label class="field"><span>Mensagem</span><textarea class="input" name="m">Olá! Vocês poderiam escrever uma breve recomendação sobre minha participação?</textarea></label></form>`, `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="submit-form" data-f="ar">Enviar pedido</button>`);
};
FORMS['add-rec'] = d => {
  closeModal(); toast('Pedido enviado. A organização responderá em instantes (simulação).', 'send');
  setTimeout(() => { const g = ongById(d.ong); S.me.recs.push({ong:d.ong, by:'Coordenação de voluntariado', text:`Foi um prazer ter ${S.me.name.split(' ')[0]} conosco. Pontualidade, empatia e iniciativa fizeram diferença no nosso projeto.`}); notify('v', 'interest', `<b>${esc(g.name)}</b> escreveu uma recomendação para você`, '#/v/curriculo'); save(); toast(`${esc(g.name)} recomendou você!`, 'star', '#/v/curriculo', 'Ver'); if (CUR.parts[0] === 'v') rerender(); }, 3500);
};

/* ---------- Inscrições do voluntário ---------- */
let IF = '';
VP.inscricoes = () => {
  const list = S.apps.filter(a => !IF || a.status === IF).slice().sort((a, b) => b.date.localeCompare(a.date));
  const cnt = s => S.apps.filter(a => a.status === s).length;
  return `<div class="area-h"><div><h1>Minhas inscrições</h1><p>Acompanhe o status das suas candidaturas e conclua projetos para ganhar horas e medalhas.</p></div><a class="btn btn-primary btn-sm" href="#/oportunidades">${I('search', 15)} Buscar oportunidades</a></div>
    <div class="tabs" style="margin-bottom:18px">${[['', 'Todas', S.apps.length], ['pendente', 'Pendentes', cnt('pendente')], ['aceita', 'Aceitas', cnt('aceita')], ['concluída', 'Concluídas', cnt('concluída')], ['recusada', 'Recusadas', cnt('recusada')]].map(([k, l, n]) => `<button class="${IF === k ? 'on' : ''}" data-act="if" data-v="${k}">${l} (${n})</button>`).join('')}</div>
    ${list.length ? `<div class="stack">${list.map(a => { const o = oppById(a.opp); if (!o) return ''; const g = ongById(o.ong); return `<div class="card pad-s row fade" style="flex-wrap:wrap">${thumb(o.cat, o.id, 64)}<div style="flex:1;min-width:220px"><div class="row-sm">${statusTag(a.status)}<span class="xs muted">Inscrição em ${fmtDate(a.date)}</span></div><b style="display:block;margin-top:4px">${esc(o.title)}</b><span class="small muted">${esc(g.name)} · ${o.mode} · ${esc(oppLoc(o).city)}</span>${a.note ? `<div class="xs muted" style="margin-top:4px">${esc(a.note)}</div>` : ''}</div>
      <div class="row-sm"><a class="btn btn-sm btn-ghost" href="#/oportunidade/${o.id}">Ver</a><button class="btn btn-sm btn-outline" data-act="msg-ong" data-id="${g.id}">${I('msg', 14)} Mensagem</button>
      ${a.status === 'pendente' ? `<button class="btn btn-sm btn-danger" data-act="app-cancel" data-id="${a.id}">Cancelar</button>` : ''}
      ${a.status === 'aceita' ? `<button class="btn btn-sm btn-primary" data-act="app-done" data-id="${a.id}">${I('check', 14)} Marcar como concluída</button>` : ''}
      ${a.status === 'concluída' ? `<a class="btn btn-sm btn-primary" href="#/v/certificados">${I('award', 14)} Certificado</a>` : ''}</div></div>`; }).join('')}</div>` : emptyBox('check', 'Nenhuma inscrição aqui', '', `<a class="btn btn-primary" href="#/v/match">Ver combinações</a>`)}
    <div class="notice info" style="margin-top:20px">${I('info', 18)}<div>Na demonstração, inscrições em ONGs diferentes do Instituto Raízes Verdes são aceitas automaticamente após alguns segundos. As do Raízes Verdes podem ser aprovadas no painel da ONG (troque o perfil no topo).</div></div>`;
};
ACT.if = a => { IF = a.dataset.v; rerender(); };
ACT['app-cancel'] = a => { const ap = S.apps.find(x => x.id === a.dataset.id); ap.status = 'cancelada'; S.apps = S.apps.filter(x => x !== ap); log(`Cancelou a inscrição em ${oppById(ap.opp).title}`, 'x'); toast('Inscrição cancelada.'); rerender(); };
ACT['app-done'] = a => {
  const ap = S.apps.find(x => x.id === a.dataset.id), o = oppById(ap.opp);
  openModal('Concluir participação', `<p>Registre sua participação em <b>${esc(o.title)}</b>. A organização confirma as horas (simulação).</p><form data-form="app-done" id="ad"><input type="hidden" name="id" value="${ap.id}"><label class="field"><span>Horas dedicadas</span><input class="input" type="number" name="hours" min="1" value="${Math.min(o.hrs * 4, 40)}"></label><label class="field"><span>O que você realizou?</span><textarea class="input" name="desc">Participei das atividades de ${esc(o.acts[0].toLowerCase())} e apoiei a equipe.</textarea></label></form>`,
    `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="submit-form" data-f="ad">Concluir (+150 pontos)</button>`);
};
FORMS['app-done'] = d => {
  const ap = S.apps.find(x => x.id === d.id), o = oppById(ap.opp), L = oppLoc(o);
  ap.status = 'concluída';
  S.me.exp.push({id:uid(), ong:o.ong, opp:o.id, role:o.title, cat:o.cat, start:ap.date.slice(0, 7), end:todayISO().slice(0, 7), hours:+d.hours, city:o.mode === 'Remoto' ? L.city + ' (remoto)' : L.city, country:L.country, desc:d.desc, skills:o.skills.slice(0, 2)});
  log(`Concluiu ${o.title} (${d.hours}h)`, 'flag'); closeModal();
  notify('v', 'accept', `Participação em <b>${esc(o.title)}</b> confirmada: ${d.hours} horas registradas`, '#/v/certificados');
  addPoints(150, `Projeto concluído: ${o.title}`);
  toast(`Projeto concluído! +150 pontos e novo carimbo no passaporte.`, 'passport', '#/v/passaporte', 'Ver passaporte'); rerender();
};

/* ---------- Conquistas ---------- */
VP.conquistas = () => {
  const l = level();
  const ranking = [...VOLS.filter(v => !v.minor).map(v => ({id:v.id, name:v.name, city:v.city, pts:v.pts, v})), {id:'livia', name:S.me.name, city:S.me.city, pts:S.points, v:S.me, me:true}].sort((a, b) => b.pts - a.pts);
  const myPos = ranking.findIndex(r => r.me) + 1;
  return `<div class="area-h"><div><h1>Conquistas</h1><p>Celebre cada passo. A gamificação da 12Help! valoriza constância, não competição.</p></div></div>
    <div class="grid split" style="--cols:1.3fr 1fr">
      <div class="lvl"><div class="row between"><div><span class="xs" style="color:#9FC1E4;font-weight:800;letter-spacing:.08em">SEU NÍVEL</span><h2 style="color:#fff;margin:4px 0 0;font-size:34px">Nível ${l.n} · ${l.name}</h2></div><div style="font-size:40px;font-weight:800">${num(S.points)}<span style="font-size:14px;color:#9FC1E4"> pts</span></div></div>
        <div style="margin:18px 0 6px">${progress(l.pct, 'lg')}</div><span class="small" style="color:#BFD3E8">Faltam ${l.toNext} pontos para ${LEVELS[Math.min(l.n, LEVELS.length - 1)]}</span>
        <div class="row" style="margin-top:18px;gap:24px">${[[Object.keys(S.badges).length, 'medalhas'], [hoursTotal(), 'horas'], [S.me.exp.length, 'projetos']].map(([n, t]) => `<div><b style="font-size:22px">${n}</b> <span class="small" style="color:#BFD3E8">${t}</span></div>`).join('')}</div></div>
      <div class="card pad"><h3>Como ganhar pontos</h3>${[['Inscrever-se em uma oportunidade', 50], ['Concluir um projeto', 150], ['Participar de um evento', 30], ['Registrar uma experiência', 40], ['Apoiar uma vaquinha', 20], ['Desbloquear uma medalha', 100]].map(([t, p]) => `<div class="row between small" style="padding:7px 0;border-top:1px solid var(--line2)"><span>${t}</span><b style="color:var(--green)">+${p}</b></div>`).join('')}</div></div>
    <h2 style="font-size:22px;margin-top:28px">Medalhas</h2>
    <div class="grid auto-s">${BADGES.map(b => { const got = S.badges[b.k], cur = Math.min(b.cur(), b.goal); return `<div class="card medal fade ${got ? '' : 'locked'}"><div class="mi">${I(b.i, 32)}</div><h4>${b.n}</h4><p>${b.d}</p>${got ? `<span class="tag tag-green">${I('check', 12)} ${fmtDate(got)}</span>` : `${progress(cur / b.goal * 100)}<span class="xs muted">${num(cur)}/${num(b.goal)}</span>`}</div>`; }).join('')}</div>
    <div class="grid g2" style="margin-top:28px">
      <div class="card pad"><div class="card-h"><h3>Comunidade em destaque</h3><span class="tag tag-gray">Você está em ${myPos}º</span></div><p class="small muted">Pessoas que inspiram pela constância este ano. O ranking é apenas motivacional e pode ser ocultado nas configurações.</p>
        ${ranking.slice(0, 8).map((r, i) => `<div class="rank-row ${r.me ? 'me' : ''}"><span class="rank-n">${i + 1}</span>${avatar(r.v, 34)}<div style="flex:1;min-width:0"><b class="small">${esc(r.name)}${r.me ? ' (você)' : ''}</b><div class="xs muted">${esc(r.city)}</div></div><b class="small">${num(r.pts)} pts</b></div>`).join('')}
        ${myPos > 8 ? `<div class="rank-row me"><span class="rank-n">${myPos}</span>${avatar(S.me, 34)}<div style="flex:1"><b class="small">Você</b></div><b class="small">${num(S.points)} pts</b></div>` : ''}</div>
      <div class="card pad"><div class="card-h"><h3>Histórico de conquistas</h3></div>${S.pointsLog.slice(0, 12).map(p => `<div class="row between small" style="padding:8px 0;border-top:1px solid var(--line2);flex-wrap:nowrap"><span>${esc(p.why)}<div class="xs muted">${fmtDate(p.t)}</div></span><b style="color:var(--green)">+${p.n}</b></div>`).join('')}</div></div>`;
};

/* ---------- Passaporte 12Help! ---------- */
function stamp(x, i) {
  const g = ongById(x.ong), c = CATS[x.cat || g.cat].g[0], rot = (hash(x.id || x.role) % 24) - 12, sh = i % 3;
  const city = (x.city || '').replace(' (remoto)', '').toUpperCase(), d = fmtMonth(x.end || x.start).toUpperCase();
  const frame = sh === 0 ? `<circle cx="80" cy="80" r="72" fill="none" stroke="${c}" stroke-width="4"/><circle cx="80" cy="80" r="62" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="3 3"/>`
    : sh === 1 ? `<rect x="8" y="24" width="144" height="112" rx="14" fill="none" stroke="${c}" stroke-width="4"/><rect x="16" y="32" width="128" height="96" rx="9" fill="none" stroke="${c}" stroke-width="1.5"/>`
    : `<polygon points="80,8 150,46 150,114 80,152 10,114 10,46" fill="none" stroke="${c}" stroke-width="4"/><polygon points="80,20 139,52 139,108 80,140 21,108 21,52" fill="none" stroke="${c}" stroke-width="1.2" stroke-dasharray="2 3"/>`;
  return `<div class="stamp" style="transform:rotate(${rot}deg)" title="${esc(x.role)} · ${esc(g.name)}"><svg viewBox="0 0 160 160" style="opacity:.88">${frame}
    <text x="80" y="58" text-anchor="middle" font-size="10" font-weight="800" fill="${c}" letter-spacing="2">${esc(COUNTRIES[x.country].n.toUpperCase())}</text>
    <text x="80" y="84" text-anchor="middle" font-size="${city.length > 11 ? 12 : 17}" font-weight="800" fill="${c}">${esc(city)}</text>
    <text x="80" y="103" text-anchor="middle" font-size="10" font-weight="700" fill="${c}">${esc(g.ini)} · ${x.hours}H</text>
    <text x="80" y="120" text-anchor="middle" font-size="9.5" fill="${c}" letter-spacing="1">${d}</text></svg></div>`;
}
VP.passaporte = () => {
  const m = S.me, ongs = ongsDone().map(ongById);
  const mrz = `P<12H${norm(m.name).toUpperCase().replace(/[^A-Z]/g, '<')}<<<<<<<${hoursTotal()}H<${countriesDone().join('')}<<<<${m.exp.length}`.padEnd(66, '<').slice(0, 66);
  return `<div class="area-h"><div><h1>Passaporte 12Help!</h1><p>Cada experiência vira um carimbo. Seu registro de impacto pelo mundo.</p></div><button class="btn btn-outline btn-sm" data-act="share" data-url="#/perfil/livia">${I('share', 15)} Compartilhar</button></div>
  <div class="passport">
    <div class="pp-cover"><span class="xs gold b" style="letter-spacing:.2em">PASSAPORTE SOLIDÁRIO</span><div class="pp-emblem">${logoMark(54, true)}</div>
      <div class="center"><div class="gold b" style="font-size:20px;letter-spacing:.06em">12HELP!</div><div class="xs" style="color:#BFD3E8;letter-spacing:.12em">CIDADÃ(O) DO MUNDO</div></div>
      <div class="row" style="flex-wrap:nowrap;background:rgba(255,255,255,.08);border-radius:14px;padding:12px">${avatar(m, 64)}<div class="small"><div class="xs" style="color:#9FC1E4">TITULAR</div><b>${esc(m.name)}</b><div class="xs" style="color:#9FC1E4;margin-top:4px">ORIGEM</div>${esc(m.city)} · ${COUNTRIES[m.country].f}<div class="xs" style="color:#9FC1E4;margin-top:4px">EMISSÃO</div>${fmtDate('2023-03-01')}</div></div>
      <div class="mrz">${esc(mrz)}</div></div>
    <div class="pp-page">
      <div class="pp-stats">${[[m.exp.length, 'Projetos'], [citiesDone().length, 'Cidades'], [countriesDone().length, 'Países'], [hoursTotal(), 'Horas'], [Object.keys(S.badges).length, 'Medalhas'], [ongs.length, 'Organizações']].map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
      <div class="flabel">Carimbos</div>
      ${m.exp.length ? `<div class="stamps">${m.exp.map(stamp).join('')}</div>` : emptyBox('passport', 'Seu passaporte está esperando o primeiro carimbo', 'Conclua uma inscrição ou registre uma experiência.')}
      <div class="grid g2" style="margin-top:26px">
        <div><div class="flabel">Países</div><div class="row-sm">${countriesDone().map(c => `<span class="tag tag-line" style="font-size:13px">${COUNTRIES[c].f} ${COUNTRIES[c].n}</span>`).join('')}</div>
          <div class="flabel" style="margin-top:14px">Cidades</div><div class="row-sm">${citiesDone().map(c => `<span class="tag tag-gray">${esc(c)}</span>`).join('')}</div></div>
        <div><div class="flabel">Organizações</div>${ongs.map(g => `<a href="#/ong/${g.id}" class="row" style="flex-wrap:nowrap;padding:5px 0">${ongLogo(g, 28)}<span class="small b">${esc(g.name)}</span></a>`).join('')}
          <div class="flabel" style="margin-top:14px">Medalhas</div><div class="badges-row">${BADGES.filter(b => S.badges[b.k]).map(b => `<span class="mini-badge" title="${b.n}">${I(b.i, 18)}</span>`).join('')}</div></div></div>
    </div></div>
  <div class="card pad" style="margin-top:20px"><h3>Mapa das suas experiências</h3>${worldMap(m.exp.map(x => { const g = ongById(x.ong); const cc = CITY_COORDS[norm(x.city.replace(' (remoto)', ''))] || [g.lat, g.lng]; return {lat:cc[0], lng:cc[1], n:1, link:'#/ong/' + g.id, tip:`<b>${esc(x.city)}</b><br>${esc(x.role)}<br>${x.hours}h · ${esc(g.name)}`, c:CATS[x.cat || g.cat].g[0]}; }))}</div>`;
};

/* ---------- Favoritos ---------- */
let FT = 'opps';
VP.favoritos = () => {
  const opps = S.favOpps.map(oppById).filter(Boolean), ongs = S.favOngs.map(ongById).filter(Boolean), camps = S.favCamps.map(campById).filter(Boolean);
  return `<div class="area-h"><div><h1>Favoritos</h1><p>Projetos, organizações e campanhas que você salvou.</p></div></div>
    <div class="tabs" style="margin-bottom:18px">${[['opps', `Oportunidades (${opps.length})`], ['ongs', `Organizações (${ongs.length})`], ['camps', `Campanhas (${camps.length})`]].map(([k, l]) => `<button class="${FT === k ? 'on' : ''}" data-act="ft" data-v="${k}">${l}</button>`).join('')}</div>
    ${FT === 'opps' ? (opps.length ? `<div class="grid auto">${opps.map(oppCard).join('')}</div>` : emptyBox('heart', 'Nenhuma oportunidade salva', 'Toque no coração dos cards para salvar.', '<a class="btn btn-primary" href="#/oportunidades">Explorar</a>')) :
      FT === 'ongs' ? (ongs.length ? `<div class="grid auto">${ongs.map(ongCard).join('')}</div>` : emptyBox('heart', 'Nenhuma organização favorita')) :
      (camps.length ? `<div class="grid auto">${camps.map(campCard).join('')}</div>` : emptyBox('bookmark', 'Nenhuma campanha acompanhada'))}`;
};
ACT.ft = a => { FT = a.dataset.v; rerender(); };

/* ---------- Certificados ---------- */
function certHTML(x) {
  const g = ongById(x.ong), code = '12H-' + (hash((x.id || '') + x.role) % 900000 + 100000);
  return `<div class="cert">${logoMark(40)}<div class="xs muted b" style="letter-spacing:.2em;margin-top:6px">12HELP! · PLATAFORMA GLOBAL DE VOLUNTARIADO</div>
    <h2>Certificado de Participação</h2><p class="muted" style="margin:0">Certificamos que</p><div class="who">${esc(S.me.name)}</div>
    <p style="max-width:560px;margin:0 auto;color:var(--ink2);font-size:16px">participou como voluntária(o) de <b>${esc(x.role)}</b>, promovido por <b>${esc(g.name)}</b>, em ${esc(x.city)}, ${COUNTRIES[x.country].n}, no período de ${fmtMonth(x.start)} a ${fmtMonth(x.end)}, totalizando <b>${x.hours} horas</b> de atividades voluntárias.</p>
    <div class="sig"><div>Coordenação · ${esc(g.name)}</div><div>Equipe 12Help!</div></div>
    <p class="xs muted" style="margin-top:22px">Código ${code}-DEMO · Certificado demonstrativo, sem validade oficial.</p></div>`;
}
VP.certificados = () => `<div class="area-h"><div><h1>Certificados</h1><p>Emita certificados demonstrativos das suas experiências concluídas.</p></div></div>
  ${S.me.exp.length ? `<div class="stack">${S.me.exp.slice().reverse().map(x => { const g = ongById(x.ong); return `<div class="card pad-s row fade">${ongLogo(g, 52)}<div style="flex:1;min-width:200px"><b>${esc(x.role)}</b><div class="small muted">${esc(g.name)} · ${esc(x.city)} · ${fmtMonth(x.start)} – ${fmtMonth(x.end)} · ${x.hours}h</div></div><button class="btn btn-primary btn-sm" data-act="cert" data-id="${x.id}">${I('award', 15)} Emitir certificado</button></div>`; }).join('')}</div>` : emptyBox('award', 'Nenhuma experiência concluída', 'Conclua uma inscrição para emitir certificados.')}`;
ACT.cert = a => { const x = S.me.exp.find(e => e.id === a.dataset.id); openModal('Certificado', certHTML(x), `<button class="btn btn-ghost" data-act="close">Fechar</button><button class="btn btn-primary" data-act="cert-print" data-id="${x.id}">${I('download', 16)} Baixar PDF</button>`, 'wide'); };
ACT['cert-print'] = a => { const x = S.me.exp.find(e => e.id === a.dataset.id); closeModal(); printHTML(certHTML(x)); };

/* ---------- Histórico ---------- */
VP.atividade = () => `<div class="area-h"><div><h1>Histórico de atividades</h1><p>Registro de tudo o que você fez na plataforma.</p></div></div>
  <div class="card pad"><div class="timeline">${S.activity.map(x => `<div class="tl"><div class="row-sm">${I(x.i, 16, 'muted')}<b class="small">${esc(x.text)}</b></div><div class="xs muted">${fmtDate(x.t)}</div></div>`).join('')}</div></div>`;

/* ---------- Configurações ---------- */
VP.config = () => {
  const sw = (k, l, d) => `<div class="row between" style="padding:12px 0;border-top:1px solid var(--line2);flex-wrap:nowrap"><div><b class="small">${l}</b><div class="xs muted">${d}</div></div><label class="switch"><input type="checkbox" data-change="setting" data-k="${k}" ${S.settings[k] ? 'checked' : ''}><span></span></label></div>`;
  return `<div class="area-h"><div><h1>Configurações</h1><p>Notificações, privacidade, segurança e conta.</p></div></div>
    <div class="grid g2">
      <div class="card pad"><h3>${I('bell', 18)} Notificações</h3>${sw('nMatch', 'Novas oportunidades compatíveis', 'Avisar quando uma oportunidade combinar com você')}${sw('nMsg', 'Mensagens', 'Avisar sobre novas mensagens')}${sw('nCamp', 'Campanhas acompanhadas', 'Metas atingidas e prazos')}${sw('nEmail', 'Resumo semanal por e-mail', 'Simulado nesta demonstração')}</div>
      <div class="card pad"><h3>${I('lock', 18)} Privacidade</h3>${sw('publicProfile', 'Perfil público', 'Permitir que o perfil seja visto por link')}${sw('showAge', 'Exibir idade', 'Mostrar sua idade no perfil público')}
        <div style="padding-top:12px;border-top:1px solid var(--line2)"><a class="link small" href="#/seguranca#privacidade">Política de privacidade (ilustrativa)</a> · <a class="link small" href="#/seguranca#diretrizes">Diretrizes</a></div></div>
      <div class="card pad"><h3>${I('ban', 18)} Bloqueios e denúncias</h3>
        ${S.blocked.length ? S.blocked.map(b => { const p = b.type === 'ong' ? ongById(b.id) : volById(b.id); return `<div class="row between" style="padding:8px 0;border-top:1px solid var(--line2)"><span class="small b">${esc(p.name)}</span><button class="btn btn-xs btn-outline" data-act="unblock" data-type="${b.type}" data-id="${b.id}">Desbloquear</button></div>`; }).join('') : '<p class="small muted">Você não bloqueou ninguém.</p>'}
        <div class="flabel" style="margin-top:14px">Denúncias enviadas</div>${S.reports.length ? S.reports.map(r => `<div class="small" style="padding:6px 0;border-top:1px solid var(--line2)"><b>${esc(r.name)}</b> · ${esc(r.reason)} <span class="tag tag-warn">Em análise</span></div>`).join('') : '<p class="small muted">Nenhuma denúncia enviada.</p>'}</div>
      <div class="card pad"><h3>${I('user', 18)} Conta</h3><p class="small muted">E-mail: ${esc(S.me.email || 'livia.demo@12help.app')}</p>
        <div class="stack"><button class="btn btn-outline btn-block" data-act="export-data">${I('download', 16)} Exportar meus dados (JSON)</button><button class="btn btn-outline btn-block" data-act="reset-demo">${I('refresh', 16)} Restaurar dados da demonstração</button><button class="btn btn-danger btn-block" data-act="role" data-r="visitor">${I('logout', 16)} Sair</button></div></div></div>`;
};
CHANGE.setting = t => { S.settings[t.dataset.k] = t.checked; save(); toast('Preferência salva.', 'settings'); };
ACT['reset-demo'] = () => openModal('Restaurar demonstração', '<p>Isso apaga as alterações feitas (inscrições, mensagens, doações, perfis) e restaura os dados originais da demonstração.</p>', `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-danger" data-act="reset-confirm">Restaurar</button>`);
ACT['reset-confirm'] = () => { const r = S.role; S = freshState(); S.role = r; checkBadges(true); S.badges.global = '2025-08-30'; S.badges.first = '2024-02-28'; S.badges.hands = '2025-06-30'; S.badges.nature = '2024-07-20'; OF = OF_DEFAULT(); closeModal(); save(); toast('Dados da demonstração restaurados.', 'refresh'); rerender(); };
ACT['export-data'] = () => downloadFile('12help-meus-dados.json', JSON.stringify({perfil:S.me, inscricoes:S.apps, pontos:S.points, medalhas:S.badges, atividade:S.activity}, null, 2), 'application/json');
function downloadFile(name, content, type) { const b = new Blob([content], {type}); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 500); toast(`Arquivo <b>${name}</b> gerado.`, 'download'); }

/* =========================================================
   MENSAGENS
   ========================================================= */
let MSG_ACTIVE = null;
function peerInfo(p) {
  if (p.type === 'ong') { const g = ongById(p.id); return {name:g.name, sub:`${g.city} · ${COUNTRIES[g.country].n}`, av:ongLogo(g, 42), link:'#/ong/' + g.id}; }
  const v = volById(p.id); return {name:v.name, sub:`${v.city} · Voluntário(a)`, av:avatar(v, 42), link:'#/perfil/' + v.id};
}
PAGES.mensagens = () => {
  if (S.role === 'visitor') return gate('volunteer');
  return areaShell(messagesView(), 'mensagens');
};
function messagesView() {
  const role = roleKey(), list = S.threads.filter(t => t.role === role && !isBlocked(t.peer.type, t.peer.id));
  list.sort((a, b) => (b.msgs[b.msgs.length - 1]?.t || '').localeCompare(a.msgs[a.msgs.length - 1]?.t || ''));
  let act = list.find(t => t.id === MSG_ACTIVE);
  if (!act && window.innerWidth > 720) act = list[0];
  if (act && act.unread) { act.unread = 0; S.notifs.filter(n => n.role === role && n.type === 'msg').forEach(n => n.read = true); }
  after(() => { const b = $('.chat-body'); if (b) b.scrollTop = b.scrollHeight; if (act && window.innerWidth > 720) $('#chat-input')?.focus(); });
  const P = act && peerInfo(act.peer);
  return `<div class="area-h"><div><h1>Mensagens</h1><p>Conversas entre ${isOng() ? 'sua organização e voluntários' : 'você e as organizações'}.</p></div>${isOng() ? `<a class="btn btn-sm btn-outline" href="#/o/voluntarios">${I('plus', 15)} Nova conversa</a>` : `<a class="btn btn-sm btn-outline" href="#/explorar">${I('plus', 15)} Nova conversa</a>`}</div>
  <div class="card chat ${act ? 'has-active' : ''}">
    <div class="chat-list">${list.length ? list.map(t => { const p = peerInfo(t.peer), last = t.msgs[t.msgs.length - 1]; return `<div class="chat-item ${act && act.id === t.id ? 'on' : ''} ${t.unread ? 'unread' : ''}" data-act="thread" data-id="${t.id}">${p.av}<div class="ct"><div class="row between"><b class="small">${esc(p.name)}</b><span class="xs muted">${last ? ago(last.t) : ''}</span></div><p>${last ? (last.sys ? '✓ ' : last.me ? 'Você: ' : '') + esc(last.text) : ''}</p></div>${t.unread ? `<span class="badge-n">${t.unread}</span>` : ''}</div>`; }).join('') : `<p class="muted center small" style="padding:30px">Nenhuma conversa ainda.</p>`}</div>
    <div class="chat-main">${act ? `
      <div class="chat-h"><button class="icon-btn back-chat" data-act="thread-back" aria-label="Voltar">${I('chevl')}</button>${P.av}<div style="flex:1;min-width:0"><b>${esc(P.name)}</b><div class="xs muted">${esc(P.sub)}</div></div>
        <a class="btn btn-ghost btn-sm" href="${P.link}">Perfil</a><button class="icon-btn" data-act="safety-menu" data-type="${act.peer.type}" data-id="${act.peer.id}" aria-label="Denunciar ou bloquear">${I('dots')}</button></div>
      <div class="chat-body"><div class="msg sys">${I('shield', 13)} Conversa protegida. Nunca compartilhe senhas ou dados bancários.</div>
        ${act.msgs.map(m => m.sys ? `<div class="msg sys">${I('check', 13)} ${esc(m.text)}</div>` : `<div class="msg ${m.me ? 'me' : 'them'}">${esc(m.text)}<time>${hhmm(m.t)}</time></div>`).join('')}
        ${act.typing ? `<div class="typing">${esc(P.name)} está digitando…</div>` : ''}</div>
      <form class="chat-in" data-form="chat"><input type="hidden" name="tid" value="${act.id}"><input class="input" id="chat-input" name="text" placeholder="Escreva uma mensagem…" autocomplete="off" required><button class="btn btn-primary btn-icon" aria-label="Enviar">${I('send', 18)}</button></form>`
      : `<div class="empty" style="margin:auto">${I('msg', 34)}<p>Selecione uma conversa.</p></div>`}</div></div>`;
}
ACT.thread = a => { MSG_ACTIVE = a.dataset.id; rerender(); };
ACT['thread-back'] = () => { MSG_ACTIVE = null; const c = $('.chat'); if (c) c.classList.remove('has-active'); };
const REPLIES = {
  v:['Obrigado pela mensagem! Vamos verificar e te respondemos com detalhes ainda hoje.', 'Que ótimo! Sua participação vai fazer muita diferença no projeto.', 'Perfeito. Vou te enviar o cronograma da próxima semana por aqui.', 'Claro! Se tiver qualquer dúvida sobre o local ou horário, é só chamar.', 'Combinado! Te esperamos 💚'],
  o:['Oi! Muito obrigado pelo retorno. Tenho disponibilidade sim.', 'Que legal! Posso começar já no próximo sábado.', 'Perfeito, vou separar os materiais. Até lá!', 'Tenho algumas dúvidas sobre o local. Podemos conversar amanhã?', 'Combinado, obrigada pela oportunidade!']
};
FORMS.chat = d => {
  const t = S.threads.find(x => x.id === d.tid); if (!t || !d.text.trim()) return;
  t.msgs.push({me:true, text:d.text.trim(), t:nowISO()}); MSG_ACTIVE = t.id; rerender();
  setTimeout(() => { t.typing = true; if (CUR.parts[0] === 'mensagens') rerender(); }, 700);
  setTimeout(() => {
    t.typing = false; const pool = REPLIES[t.role];
    t.msgs.push({me:false, text:pool[(t.msgs.length + hash(t.id)) % pool.length], t:nowISO()});
    if (CUR.parts[0] === 'mensagens' && MSG_ACTIVE === t.id) rerender();
    else { t.unread = (t.unread || 0) + 1; const p = peerInfo(t.peer); notify(t.role, 'msg', `<b>${esc(p.name)}</b> enviou uma nova mensagem`, '#/mensagens'); save(); toast(`Nova mensagem de <b>${esc(p.name)}</b>`, 'msg', '#/mensagens', 'Abrir'); rerender(); }
    save();
  }, 2300);
};
function openThread(role, type, id, opts = {}) {
  let t = S.threads.find(x => x.role === role && x.peer.type === type && x.peer.id === id);
  if (!t) { t = {id:'t' + uid(), role, peer:{type, id}, unread:0, msgs:[]}; S.threads.push(t); }
  if (opts.sys) t.msgs.push({sys:true, text:opts.sys, t:nowISO()});
  if (opts.them) { t.msgs.push({me:false, text:opts.them, t:nowISO()}); if (opts.unread) t.unread = (t.unread || 0) + 1; }
  if (opts.me) t.msgs.push({me:true, text:opts.me, t:nowISO()});
  return t;
}
ACT['msg-ong'] = a => {
  if (!requireRole('volunteer', 'Para conversar com organizações, entre como voluntária.')) return;
  const id = a.dataset.id; if (isBlocked('ong', id)) return toast('Você bloqueou esta organização. Desbloqueie para conversar.', 'ban');
  const t = openThread('v', 'ong', id); MSG_ACTIVE = t.id; go('#/mensagens');
};
ACT['msg-vol'] = a => {
  if (!requireRole('ong', 'Para conversar com voluntários, entre como organização.')) return;
  const v = volById(a.dataset.id);
  if (v.minor) return openModal('Perfil protegido', `<div class="notice info">${I('shield', 18)}<div><b>${esc(v.name.split(' ')[0])} é menor de idade.</b> O contato direto só é liberado após aprovação do responsável legal. Enviamos um pedido de autorização (simulação).</div></div>`, `<button class="btn btn-primary" data-act="close">Entendi</button>`);
  const t = openThread('o', 'vol', v.id); MSG_ACTIVE = t.id; go('#/mensagens');
};

/* ---------- Segurança: denúncia e bloqueio ---------- */
ACT['safety-menu'] = a => {
  const {type, id} = a.dataset, p = type === 'ong' ? ongById(id) : volById(id), blocked = isBlocked(type, id);
  openModal('Segurança', `<div class="menu" style="margin:-8px -24px">
    <button data-act="report" data-type="${type}" data-id="${id}">${I('flag', 18)} Denunciar ${type === 'ong' ? 'organização' : 'perfil'}</button>
    <button data-act="${blocked ? 'unblock' : 'block'}" data-type="${type}" data-id="${id}">${I('ban', 18)} ${blocked ? 'Desbloquear' : 'Bloquear'} ${esc(p.name)}</button>
    <a href="#/seguranca">${I('shield', 18)} Orientações de segurança</a></div>`);
};
ACT.report = a => {
  const {type, id} = a.dataset, name = type === 'opp' ? oppById(id).title : type === 'ong' ? ongById(id).name : volById(id).name;
  openModal('Denunciar', `<p class="muted">Sua denúncia é confidencial. Na versão real, a equipe de Confiança e Segurança analisaria o caso em até 24 horas.</p><form data-form="report" id="rp"><input type="hidden" name="name" value="${esc(name)}"><input type="hidden" name="type" value="${type}"><input type="hidden" name="id" value="${id}">
    ${['Informações falsas ou enganosas', 'Pedido de pagamento indevido', 'Comportamento inadequado ou assédio', 'Risco a crianças ou adolescentes', 'Spam ou golpe', 'Outro motivo'].map((r, i) => `<label class="check"><input type="radio" name="reason" value="${r}" ${i ? '' : 'checked'}> ${r}</label>`).join('')}
    <label class="field" style="margin-top:12px"><span>Detalhes (opcional)</span><textarea class="input" name="det"></textarea></label></form>`,
    `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-danger" data-act="submit-form" data-f="rp">${I('flag', 15)} Enviar denúncia</button>`);
};
FORMS.report = d => { S.reports.push({name:d.name, reason:d.reason, t:todayISO()}); closeModal(); toast('Denúncia enviada para análise (simulação). Obrigado por manter a comunidade segura.', 'shield'); save(); };
ACT.block = a => { const {type, id} = a.dataset; if (!isBlocked(type, id)) S.blocked.push({type, id}); closeModal(); toast('Usuário bloqueado. Ele não poderá enviar mensagens ou convites.', 'ban'); rerender(); };
ACT.unblock = a => { const {type, id} = a.dataset; S.blocked = S.blocked.filter(b => !(b.type === type && b.id === id)); closeModal(); toast('Desbloqueado.', 'check'); rerender(); };

/* =========================================================
   AÇÕES DO VOLUNTÁRIO EM PÁGINAS PÚBLICAS
   ========================================================= */
ACT.apply = a => {
  if (!requireRole('volunteer', 'Para se inscrever, entre como voluntária.')) return;
  const o = oppById(a.dataset.id), g = ongById(o.ong), m = matchOpp(o);
  if (S.me.age < o.age) return openModal('Faixa etária', `<div class="notice">${I('shield', 18)}<div>Esta oportunidade aceita voluntários a partir de <b>${o.age} anos</b>. Pela sua segurança, não é possível se inscrever.</div></div>`, `<a class="btn btn-primary" href="#/oportunidades">Ver outras oportunidades</a>`);
  openModal('Confirmar inscrição', `<div class="row" style="flex-wrap:nowrap;margin-bottom:16px">${thumb(o.cat, o.id, 64)}<div><b>${esc(o.title)}</b><div class="small muted">${esc(g.name)} · ${o.mode}</div><span class="tag tag-green" style="margin-top:4px">${m.score}% compatível</span></div></div>
    <form data-form="apply" id="apf"><input type="hidden" name="id" value="${o.id}">
      <label class="field"><span>Mensagem para a organização</span><textarea class="input" name="msg">Olá! Tenho interesse em participar de “${esc(o.title)}”. Minhas habilidades em ${esc(S.me.skills.slice(0, 2).join(' e '))} podem ajudar o projeto.</textarea></label>
      <label class="check"><input type="checkbox" required> Confirmo disponibilidade para ${o.days[0] === 'flex' ? 'os dias combinados' : o.days.map(d => DOWF[d]).join(', ')} (${SHIFT[o.shift].toLowerCase()}), ${o.hrs}h por semana.</label>
      <label class="check"><input type="checkbox" required> Li os requisitos e as <a class="link" href="#/seguranca#diretrizes" target="_blank">diretrizes de convivência</a>.</label>
      ${S.me.minor ? `<div class="notice info" style="margin-top:10px">${I('shield', 18)}<div>Como você é menor de idade, a inscrição será enviada ao seu responsável para autorização.</div></div>` : ''}
      ${o.mode !== 'Remoto' ? `<div class="notice" style="margin-top:10px">${I('alert', 18)}<div>Atividade presencial: o endereço exato será compartilhado pela organização após a confirmação.</div></div>` : ''}</form>`,
    `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="submit-form" data-f="apf">Enviar inscrição</button>`);
};
FORMS.apply = d => {
  const o = oppById(d.id), g = ongById(o.ong);
  const ap = {id:'a' + uid(), opp:o.id, status:'pendente', date:todayISO()}; S.apps.push(ap);
  const t = openThread('v', 'ong', g.id, {sys:`Confirmação: inscrição em “${o.title}” recebida`, me:d.msg});
  notify('v', 'info', `Inscrição enviada para <b>${esc(o.title)}</b>. Aguarde a confirmação.`, '#/v/inscricoes');
  log(`Inscreveu-se em ${o.title}`, 'check'); addPoints(50, `Inscrição em ${o.title}`);
  if (o.ong === MY_ONG) { notify('o', 'app', `<b>${esc(S.me.name)}</b> se inscreveu em ${esc(o.title)}`, '#/o/inscricoes'); const ot = openThread('o', 'vol', 'livia', {them:d.msg, unread:true}); }
  else setTimeout(() => {
    if (ap.status !== 'pendente') return;
    ap.status = 'aceita';
    t.msgs.push({sys:true, text:`Inscrição em “${o.title}” aceita`, t:nowISO()}, {me:false, text:`Oi, ${S.me.name.split(' ')[0]}! Sua inscrição foi aceita. Em breve enviaremos as orientações de boas-vindas.`, t:nowISO()}); t.unread = (t.unread || 0) + 1;
    notify('v', 'accept', `Sua inscrição em <b>${esc(o.title)}</b> foi aceita!`, '#/v/inscricoes');
    log(`Inscrição aceita em ${o.title}`, 'award'); save();
    toast(`<b>${esc(g.name)}</b> aceitou sua inscrição!`, 'check', '#/v/inscricoes', 'Ver'); rerender();
  }, 6000);
  closeModal();
  openModal('', `<div class="center" style="padding:10px 0;position:relative">${confetti()}<div class="success-ic">${I('check', 40)}</div><h2>Inscrição enviada!</h2><p class="muted">A <b>${esc(g.name)}</b> recebeu sua candidatura para <b>${esc(o.title)}</b>. Uma confirmação foi registrada nas suas mensagens. ${o.ong === MY_ONG ? 'Troque para o perfil da ONG para aprová-la.' : 'Você receberá uma notificação quando ela for analisada.'}</p><p class="small b" style="color:var(--green)">+50 pontos</p>
    <div class="row" style="justify-content:center"><a class="btn btn-primary" href="#/v/inscricoes">Minhas inscrições</a><a class="btn btn-outline" href="#/mensagens" data-act="open-thread" data-id="${t.id}">Ver mensagem</a></div></div>`);
  save(); setTimeout(rerender, 10);
};
ACT['open-thread'] = a => { MSG_ACTIVE = a.dataset.id; closeModal(); go('#/mensagens'); };
const confetti = () => `<div class="confetti">${Array.from({length:36}, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${['#008C45', '#0F4C81', '#3FCB7E', '#F5A524', '#5C8FC4'][i % 5]};animation-delay:${(i % 9) * .07}s;transform:rotate(${i * 23}deg)"></i>`).join('')}</div>`;

ACT.interest = a => {
  if (!requireRole('volunteer')) return;
  const id = a.dataset.id, o = oppById(id), g = ongById(o.ong);
  if (S.interests.includes(id)) { toggleIn(S.interests, id); toast('Interesse removido.'); return rerender(); }
  S.interests.push(id); addPoints(10, 'Demonstrou interesse'); log(`Demonstrou interesse em ${o.title}`, 'star');
  toast(`Interesse enviado para <b>${esc(g.name)}</b>.`, 'star'); rerender();
  if (matchOpp(o).score >= 72) setTimeout(() => {
    const t = openThread('v', 'ong', g.id, {them:`Oi, ${S.me.name.split(' ')[0]}! Vimos seu interesse em “${o.title}” e seu perfil combina muito com o projeto. Vamos conversar?`, unread:true});
    notify('v', 'interest', `<b>${esc(g.name)}</b> também demonstrou interesse: é uma combinação!`, '#/mensagens'); save();
    toast(`É uma combinação! <b>${esc(g.name)}</b> também tem interesse.`, 'sparkle', '#/mensagens', 'Iniciar conversa'); rerender();
  }, 2800);
};
ACT['ong-interest'] = a => {
  const g = ongById(a.dataset.id); if (S.ongInterest.includes(g.id)) return;
  S.ongInterest.push(g.id); toast(`Interesse enviado para ${esc(g.name)}.`, 'star'); rerender();
  setTimeout(() => { openThread('v', 'ong', g.id, {them:`Olá! Recebemos seu interesse e adoraríamos ter você com a gente. Temos ${allOpps().filter(o => o.ong === g.id).length} oportunidades abertas. Qual delas mais te atrai?`, unread:true}); notify('v', 'interest', `<b>${esc(g.name)}</b> demonstrou interesse no seu perfil`, '#/mensagens'); save(); toast(`<b>${esc(g.name)}</b> respondeu: interesse mútuo!`, 'sparkle', '#/mensagens', 'Conversar'); rerender(); }, 2500);
};
ACT['event-go'] = a => {
  if (!requireRole('volunteer', 'Para se inscrever em eventos, entre como voluntária.')) return;
  const e = eventById(a.dataset.id);
  if (S.myEvents.includes(e.id)) { toggleIn(S.myEvents, e.id); toast('Inscrição no evento cancelada.'); return rerender(); }
  S.myEvents.push(e.id); addPoints(30, `Inscrição no evento ${e.title}`); log(`Inscreveu-se no evento ${e.title}`, 'cal');
  notify('v', 'event', `Inscrição confirmada: <b>${esc(e.title)}</b> em ${fmtDate(e.date)}`, '#/eventos');
  openModal('', `<div class="center" style="padding:10px 0"><div class="success-ic">${I('cal', 38)}</div><h2>Presença confirmada!</h2><p class="muted"><b>${esc(e.title)}</b><br>${fmtDate(e.date)} às ${e.time} · ${esc(e.city)}</p><p class="small b" style="color:var(--green)">+30 pontos</p>
    ${e.mode !== 'Virtual' ? `<div class="notice" style="text-align:left;margin-bottom:14px">${I('alert', 18)}<div>Evento presencial: confira o ponto de encontro na plataforma no dia anterior, vá acompanhado quando possível e leve água e protetor solar.</div></div>` : `<div class="notice info" style="text-align:left;margin-bottom:14px">${I('video', 18)}<div>O link da transmissão será enviado nas suas mensagens 1 hora antes.</div></div>`}
    <div class="row" style="justify-content:center"><button class="btn btn-outline" data-act="ics" data-id="${e.id}">${I('cal', 16)} Adicionar à agenda</button><button class="btn btn-primary" data-act="close">Fechar</button></div></div>`);
  rerender();
};
ACT.ics = a => { const e = eventById(a.dataset.id), d = e.date.replace(/-/g, ''), t = e.time.replace(':', '') + '00'; downloadFile(`${e.id}.ics`, `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//12Help//Demo//PT\nBEGIN:VEVENT\nUID:${e.id}@12help.demo\nDTSTART:${d}T${t}\nSUMMARY:${e.title}\nLOCATION:${e.city}\nDESCRIPTION:Evento demonstrativo 12Help!\nEND:VEVENT\nEND:VCALENDAR`, 'text/calendar'); };
ACT['event-int'] = a => { const on = toggleIn(S.eventInterest, a.dataset.id); toast(on ? 'Marcado como interessado. Avisaremos sobre novidades do evento.' : 'Interesse removido.', 'star'); rerender(); };

/* ---------- Doações ---------- */
ACT.amt = a => { $$('.amounts button').forEach(b => b.classList.remove('on')); a.classList.add('on'); const c = $('#amt-custom'); if (c) c.value = ''; };
INPUT.noop = () => {};
ACT.donate = a => {
  const c = campById(a.dataset.id), custom = +($('#amt-custom')?.value || 0), sel = $('.amounts button.on');
  const v = custom >= 5 ? custom : sel ? +sel.dataset.v : 0, anon = $('#amt-anon')?.checked;
  if (!v) return toast('Escolha um valor de pelo menos R$ 5.', 'info');
  openModal('Confirmar doação simulada', `<div class="row" style="flex-wrap:nowrap;margin-bottom:16px">${thumb(c.cat, c.id, 64)}<div><b>${esc(c.title)}</b><div class="small muted">${esc(ongById(c.ong).name)}</div></div></div>
    <div class="card pad-s" style="background:var(--soft);border:0"><div class="row between"><span>Valor da doação</span><b style="font-size:22px">${money(v)}</b></div><div class="row between small muted"><span>Taxa da plataforma</span><span>R$ 0</span></div><div class="row between small muted"><span>Identificação</span><span>${anon ? 'Anônima' : esc(S.role === 'visitor' ? 'Visitante' : isOng() ? ongById(MY_ONG).name : S.me.name)}</span></div></div>
    <div class="notice info" style="margin-top:14px">${I('lock', 18)}<div><b>Nenhum pagamento real será feito.</b> Esta etapa apenas simula a contribuição e atualiza os indicadores da campanha.</div></div>`,
    `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="donate-confirm" data-id="${c.id}" data-v="${v}" data-anon="${anon ? 1 : ''}">${I('heart', 16)} Confirmar doação simulada</button>`);
};
ACT['donate-confirm'] = a => {
  const c = campById(a.dataset.id), v = +a.dataset.v, before = c.raisedNow;
  S.raisedAdd[c.id] = (S.raisedAdd[c.id] || 0) + v; S.backersAdd[c.id] = (S.backersAdd[c.id] || 0) + 1;
  S.donations.push({camp:c.id, v, date:todayISO(), name:isOng() ? ongById(MY_ONG).name : S.me.name, anon:!!a.dataset.anon});
  if (isVol()) { addPoints(20, `Doação para ${c.title}`); log(`Doou ${money(v)} para ${c.title}`, 'coins'); if (!S.favCamps.includes(c.id)) S.favCamps.push(c.id); }
  const after = before + v, hit = before < c.goal && after >= c.goal;
  if (hit) { notify('v', 'goal', `A campanha <b>${esc(c.title)}</b> atingiu sua meta! 🎉`, '#/vaquinha/' + c.id); if (c.ong === MY_ONG) notify('o', 'goal', `Sua campanha <b>${esc(c.title)}</b> atingiu a meta!`, '#/o/campanhas'); }
  if (c.ong === MY_ONG && !hit) notify('o', 'goal', `Nova doação de ${money(v)} em <b>${esc(c.title)}</b>`, '#/o/campanhas');
  closeModal(); rerender();
  openModal('', `<div class="center" style="padding:10px 0;position:relative">${confetti()}<div class="success-ic">${I('heart', 40)}</div><h2>Obrigado pela sua doação!</h2>
    <p class="muted">Sua contribuição simulada de <b>${money(v)}</b> para <b>${esc(c.title)}</b> foi registrada.</p>
    <div class="card pad-s" style="background:var(--soft);border:0;text-align:left;margin:14px 0">${progress(after / c.goal * 100, 'lg')}<div class="row between small" style="margin-top:8px"><span><b>${money(after)}</b> de ${money(c.goal)}</span><span><b>${Math.round(after / c.goal * 100)}%</b> · ${num(c.backersNow + 1)} apoiadores</span></div></div>
    ${hit ? `<div class="notice ok" style="text-align:left">${I('trophy', 18)}<div><b>Sua doação fez a campanha atingir a meta!</b> Todos os apoiadores foram notificados.</div></div>` : ''}
    ${isVol() ? '<p class="small b" style="color:var(--green)">+20 pontos · campanha adicionada às que você acompanha</p>' : ''}
    <p class="xs muted">Recibo demonstrativo nº ${hash(c.id + v + Date.now()) % 1000000} · nenhum valor foi cobrado.</p><button class="btn btn-primary" data-act="close">Concluir</button></div>`);
  save();
};

/* =========================================================
   ÁREA DA ONG
   ========================================================= */
function ongApplicants() {
  return [...S.ongApps.map(a => ({...a, src:'o'})), ...S.apps.filter(a => oppById(a.opp)?.ong === MY_ONG && a.status !== 'cancelada').map(a => ({...a, vol:'livia', src:'v'}))]
    .filter(a => !isBlocked('vol', a.vol)).sort((a, b) => b.date.localeCompare(a.date));
}
const myOpps = (inc = false) => (inc ? allOppsIncClosed() : allOpps()).filter(o => o.ong === MY_ONG);
const myCamps = () => allCamps().filter(c => c.ong === MY_ONG);
const myEvents = () => allEvents().filter(e => e.ong === MY_ONG);

OP.dashboard = () => {
  const g = ongById(MY_ONG), opps = myOpps(), apps = ongApplicants(), camps = myCamps();
  const vagas = opps.reduce((a, o) => a + o.vagas, 0), filled = opps.reduce((a, o) => a + o.filled, 0) + apps.filter(a => a.status === 'aceita').length;
  const raised = camps.reduce((a, c) => a + c.raisedNow, 0), pend = apps.filter(a => a.status === 'pendente');
  return `<div class="area-h"><div><span class="xs muted b">PAINEL DA ORGANIZAÇÃO</span><h1 style="margin-top:4px">${esc(g.name)}</h1><p>Visão geral de voluntários, projetos e arrecadação · outubro de 2026</p></div>
    <div class="row-sm"><a class="btn btn-outline btn-sm" href="#/o/voluntarios">${I('users', 15)} Buscar voluntários</a><a class="btn btn-blue btn-sm" href="#/o/publicar">${I('plus', 15)} Publicar oportunidade</a></div></div>
    ${pend.length ? `<div class="notice info" style="margin-bottom:18px">${I('bell', 18)}<div>Você tem <b>${pend.length} inscrições pendentes</b> aguardando análise. <a class="link" href="#/o/inscricoes">Analisar agora</a></div></div>` : ''}
    <div class="kpis">${[['users', 'Voluntários cadastrados', num(g.vols + apps.filter(a => a.status === 'aceita').length), '+48 este mês'], ['check', 'Inscrições recebidas', num(318 + apps.length), `${pend.length} pendentes`], ['brief', 'Projetos ativos', opps.length, `${vagas - filled} vagas abertas`], ['clock', 'Horas de voluntariado', num(18420 + hoursTotal()), '+1.260 no mês']].map(([i, l, v, d]) => `<div class="card kpi fade"><div class="kh">${l}<span class="ki">${I(i, 17)}</span></div><div class="kv">${v}</div><div class="kd">${d}</div></div>`).join('')}</div>
    <div class="kpis k3" style="margin-top:16px">${[['coins', 'Campanhas de arrecadação', camps.length, `${camps.filter(c => c.raisedNow >= c.goal).length} com meta atingida`], ['heart', 'Total arrecadado (fictício)', money(raised), `${num(camps.reduce((a, c) => a + c.backersNow, 0))} apoiadores`], ['target', 'Taxa de preenchimento', Math.round(filled / vagas * 100) + '%', `${filled} de ${vagas} vagas`]].map(([i, l, v, d]) => `<div class="card kpi fade"><div class="kh">${l}<span class="ki" style="background:var(--green-l);color:var(--green)">${I(i, 17)}</span></div><div class="kv">${v}</div><div class="kd">${d}</div></div>`).join('')}</div>
    <div class="grid g2" style="margin-top:20px">
      <div class="card pad"><div class="card-h"><h3>Inscrições por mês</h3><span class="tag tag-green">${I('trend', 12)} +22%</span></div>${barChart([['Mai', 42], ['Jun', 58], ['Jul', 51], ['Ago', 73], ['Set', 88], ['Out', 92 + apps.length]].map(([l, v]) => ({l, v})))}</div>
      <div class="card pad"><div class="card-h"><h3>Horas de voluntariado</h3></div>${lineChart([['Mai', 2140], ['Jun', 2380], ['Jul', 2210], ['Ago', 2690], ['Set', 2950], ['Out', 3240 + hoursTotal()]].map(([l, v]) => ({l, v})))}</div>
      <div class="card pad"><div class="card-h"><h3>Preenchimento por projeto</h3><a class="link small" href="#/o/projetos">Projetos</a></div>${hbars(opps.map(o => ({l:o.title, p:o.filled / o.vagas * 100, v:`${o.filled}/${o.vagas}`})), v => v)}</div>
      <div class="card pad"><div class="card-h"><h3>Arrecadação</h3><a class="link small" href="#/o/campanhas">Campanhas</a></div>${camps.length ? donut([{l:'Arrecadado', v:raised, c:'#008C45'}, {l:'Falta para as metas', v:Math.max(0, camps.reduce((a, c) => a + c.goal, 0) - raised), c:'#E2E8F0'}], {label:money(raised).replace('R$', '').trim(), sub:'R$ arrecadados'}) : '<p class="muted small">Nenhuma campanha.</p>'}</div>
    </div>
    <div class="grid g2" style="margin-top:20px">
      <div class="card pad"><div class="card-h"><h3>Inscrições recentes</h3><a class="link small" href="#/o/inscricoes">Ver todas</a></div>${apps.slice(0, 5).map(a => { const v = volById(a.vol), o = oppById(a.opp); return `<div class="row" style="flex-wrap:nowrap;padding:10px 0;border-top:1px solid var(--line2)">${avatar(v, 36)}<div style="flex:1;min-width:0"><b class="small">${esc(v.name)}${v.minor ? ' <span class="tag tag-warn">menor</span>' : ''}</b><div class="xs muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(o.title)}</div></div>${statusTag(a.status)}</div>`; }).join('')}</div>
      <div class="card pad"><div class="card-h"><h3>Próximos eventos</h3><a class="link small" href="#/o/eventos">Gerenciar</a></div>${myEvents().map(e => `<div class="row" style="flex-wrap:nowrap;padding:10px 0;border-top:1px solid var(--line2)"><div class="edate" style="width:50px"><small>${MES[pd(e.date).getMonth()]}</small><b style="font-size:18px">${pd(e.date).getDate()}</b></div><div style="flex:1"><b class="small">${esc(e.title)}</b><div class="xs muted">${e.mode} · ${num(e.goingNow)}/${e.spots} inscritos</div>${progress(e.goingNow / e.spots * 100, 'blue')}</div></div>`).join('') || '<p class="small muted">Nenhum evento.</p>'}</div></div>`;
};

OP.perfil = () => {
  const g = ongById(MY_ONG);
  return `<div class="area-h"><div><h1>Perfil institucional</h1><p>Como sua organização aparece para voluntários e apoiadores.</p></div><div class="row-sm"><a class="btn btn-outline btn-sm" href="#/ong/${MY_ONG}">${I('eye', 15)} Ver perfil público</a><button class="btn btn-blue btn-sm" data-act="ong-edit">${I('edit', 15)} Editar</button></div></div>
    <div class="card" style="overflow:hidden"><div style="height:160px">${cover(g.cat, MY_ONG + 'hero', '', true)}</div><div class="pad"><div class="row" style="margin-top:-70px;align-items:flex-end">${ongLogo(g, 104)}<div style="padding-bottom:4px"><div class="row-sm">${seal(g)}${catTag(g.cat)}</div></div></div>
      <h2 style="margin-top:14px">${esc(g.name)}</h2><p class="muted" style="margin:0 0 10px">${esc(g.tagline)}</p><p style="color:var(--ink2)">${esc(g.desc)}</p>
      <div class="facts f4">${[['pin', 'Sede', `${g.city} · ${COUNTRIES[g.country].n}`], ['cal', 'Fundação', g.founded], ['link', 'Site', g.site], ['users', 'Voluntários', num(g.vols)]].map(([i, l, v]) => `<div class="fact"><span class="fi">${I(i, 17)}</span><div><small>${l}</small><b class="small">${esc(v)}</b></div></div>`).join('')}</div></div></div>
    <div class="card pad" style="margin-top:20px"><h3>${I('shield', 18)} Verificação</h3>${g.verified ? `<div class="notice ok">${I('check', 18)}<div><b>Selo demonstrativo ativo.</b> Na versão real, indicaria documentos, estatuto e referências conferidos. Nesta demonstração, nenhuma verificação real foi feita.</div></div>` : `<div class="notice">${I('clock', 18)}<div><b>Verificação pendente.</b> Na versão real, você enviaria estatuto, ata de eleição e comprovante de endereço. <button class="btn btn-xs btn-outline" data-act="ong-docs">Enviar documentos (simulação)</button></div></div>`}</div>`;
};
ACT['ong-edit'] = () => {
  const g = ongById(MY_ONG);
  openModal('Editar perfil institucional', `<form data-form="ong-edit" id="oe"><label class="field"><span>Nome</span><input class="input" name="name" value="${esc(g.name)}" required></label><label class="field"><span>Frase de apresentação</span><input class="input" name="tagline" value="${esc(g.tagline)}"></label><label class="field"><span>Descrição</span><textarea class="input" name="desc" rows="5">${esc(g.desc)}</textarea></label>
    <div class="frow"><label class="field"><span>Cidade</span><input class="input" name="city" value="${esc(g.city)}"></label><label class="field"><span>Site</span><input class="input" name="site" value="${esc(g.site)}"></label></div>
    <div class="frow"><label class="field"><span>Causa principal</span><select class="input" name="cat">${Object.entries(CATS).map(([k, c]) => `<option value="${k}" ${g.cat === k ? 'selected' : ''}>${c.n}</option>`).join('')}</select></label><label class="field"><span>Cor da marca</span><input class="input" type="color" name="c" value="${g.c}" style="height:46px;padding:4px"></label></div></form>`,
    `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-blue" data-act="submit-form" data-f="oe">Salvar</button>`, 'wide');
};
FORMS['ong-edit'] = d => { Object.assign(S.ongMe, d); closeModal(); toast('Perfil institucional atualizado.'); rerender(); };
ACT['ong-docs'] = () => { setTimeout(() => { notify('o', 'info', 'Documentos recebidos. Análise simulada em andamento.', '#/o/perfil'); save(); rerender(); }, 400); toast('Documentos enviados (simulação). Nenhuma verificação real será realizada.', 'shield'); };

OP.publicar = () => {
  const o = CUR.q.id ? oppById(CUR.q.id) : null, ed = !!o, g = ongById(MY_ONG);
  const v = o || {title:'', cat:g.cat, mode:'Presencial', dur:'curta', days:['sab'], shift:'manha', age:18, exp:false, pay:null, imm:true, vagas:10, hrs:4, skills:[], desc:'', acts:[], reqs:[], bens:[]};
  return `<div class="area-h"><div><h1>${ed ? 'Editar oportunidade' : 'Publicar oportunidade'}</h1><p>${ed ? 'Atualize as informações do projeto.' : 'Descreva o projeto. Ele aparecerá imediatamente nas buscas e nas combinações dos voluntários.'}</p></div></div>
    <form data-form="opp-form" class="grid split" style="--cols:1fr 320px;align-items:start"><input type="hidden" name="id" value="${ed ? o.id : ''}">
      <div class="stack"><div class="card pad"><h3>Informações principais</h3>
        <label class="field"><span>Nome do projeto</span><input class="input" name="title" value="${esc(v.title)}" required placeholder="Ex.: Mutirão de limpeza do Rio Cachoeira"></label>
        <div class="frow"><label class="field"><span>Categoria</span><select class="input" name="cat">${Object.entries(CATS).map(([k, c]) => `<option value="${k}" ${v.cat === k ? 'selected' : ''}>${c.n}</option>`).join('')}</select></label><label class="field"><span>Modalidade</span><select class="input" name="mode">${['Presencial', 'Remoto', 'Híbrido'].map(m => `<option ${v.mode === m ? 'selected' : ''}>${m}</option>`).join('')}</select></label></div>
        <label class="field"><span>Descrição</span><textarea class="input" name="desc" required placeholder="Qual é o objetivo e o impacto do projeto?">${esc(v.desc)}</textarea></label>
        <label class="field"><span>Atividades realizadas (uma por linha)</span><textarea class="input" name="acts" placeholder="Plantio de mudas&#10;Registro fotográfico">${esc(v.acts.join('\n'))}</textarea></label>
        <label class="field"><span>Requisitos (um por linha)</span><textarea class="input" name="reqs">${esc(v.reqs.join('\n'))}</textarea></label>
        <label class="field"><span>Benefícios (um por linha)</span><textarea class="input" name="bens" placeholder="Certificado&#10;Lanche">${esc(v.bens.join('\n'))}</textarea></label>
        <label class="field"><span>Habilidades desejadas (vírgula)</span><input class="input" name="skills" value="${esc(v.skills.join(', '))}" placeholder="Comunicação, Fotografia"></label></div>
      <div class="card pad"><h3>Agenda</h3><div class="field"><span>Dias da semana</span><div class="row-sm">${Object.entries(DOWN).map(([k, l]) => `<label class="chip" style="padding:6px 11px"><input type="checkbox" name="days" value="${k}" ${v.days.includes(k) ? 'checked' : ''}> ${l}</label>`).join('')}<label class="chip" style="padding:6px 11px"><input type="checkbox" name="days" value="flex" ${v.days[0] === 'flex' ? 'checked' : ''}> Flexível</label></div></div>
        <div class="frow3"><label class="field"><span>Horário</span><select class="input" name="shift">${Object.entries(SHIFT).map(([k, l]) => `<option value="${k}" ${v.shift === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label><label class="field"><span>Duração</span><select class="input" name="dur">${Object.entries(DUR).map(([k, l]) => `<option value="${k}" ${v.dur === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label><label class="field"><span>Horas/semana</span><input class="input" type="number" min="1" name="hrs" value="${v.hrs}"></label></div></div></div>
      <aside class="stack sticky"><div class="card pad"><h3>Vagas e requisitos</h3>
        <label class="field"><span>Número de vagas</span><input class="input" type="number" min="1" name="vagas" value="${v.vagas}" required></label>
        <label class="field"><span>Idade mínima</span><select class="input" name="age">${[14, 16, 18, 21].map(a => `<option ${v.age === a ? 'selected' : ''}>${a}</option>`).join('')}</select><span class="hint">Abaixo de 18 exige autorização do responsável.</span></label>
        <label class="field"><span>Remuneração / apoio</span><select class="input" name="payT"><option value="">Sem remuneração</option><option value="ajuda" ${v.pay?.t === 'ajuda' ? 'selected' : ''}>Ajuda de custo</option><option value="bolsa" ${v.pay?.t === 'bolsa' ? 'selected' : ''}>Bolsa / hospedagem</option></select></label>
        <label class="field"><span>Valor mensal (R$)</span><input class="input" type="number" min="0" name="payV" value="${v.pay?.v || ''}"></label>
        <label class="check"><input type="checkbox" name="exp" ${v.exp ? 'checked' : ''}> Exige experiência</label>
        <label class="check"><input type="checkbox" name="imm" ${v.imm ? 'checked' : ''}> Início imediato</label>
        <button class="btn btn-blue btn-block btn-lg" style="margin-top:14px">${ed ? 'Salvar alterações' : 'Publicar oportunidade'}</button>
        ${ed ? `<a class="btn btn-ghost btn-block" href="#/oportunidade/${o.id}" style="margin-top:6px">Ver página pública</a>` : ''}</div>
        <div class="notice info">${I('sparkle', 18)}<div>Ao publicar, voluntários compatíveis recebem uma notificação automática.</div></div></aside></form>`;
};
FORMS['opp-form'] = (d, f) => {
  const fd = new FormData(f), days = fd.getAll('days'), lines = s => s.split('\n').map(x => x.trim()).filter(Boolean);
  const data = {title:d.title, cat:d.cat, mode:d.mode, desc:d.desc, acts:lines(d.acts).length ? lines(d.acts) : ['Atividades a combinar com a equipe'], reqs:lines(d.reqs).length ? lines(d.reqs) : ['Disposição e comprometimento'], bens:lines(d.bens), skills:d.skills.split(',').map(s => s.trim()).filter(Boolean),
    days:days.includes('flex') || !days.length ? ['flex'] : days, shift:d.shift, dur:d.dur, hrs:+d.hrs, vagas:+d.vagas, age:+d.age, pay:d.payT ? {t:d.payT, v:+d.payV || 0} : null, exp:!!d.exp, imm:!!d.imm};
  if (!data.skills.length) data.skills = ['Trabalho em equipe'];
  if (d.id) {
    const c = S.customOpps.find(x => x.id === d.id);
    if (c) Object.assign(c, data); else S.oppEdits[d.id] = {...(S.oppEdits[d.id] || {}), ...data};
    toast('Oportunidade atualizada.', 'check'); go('#/o/projetos');
  } else {
    const id = norm(d.title).replace(/[^a-z0-9]+/g, '-').slice(0, 40) + '-' + uid().slice(0, 4);
    const o = {id, ong:MY_ONG, filled:0, posted:todayISO(), ...data}; S.customOpps.push(o);
    notify('o', 'info', `Oportunidade <b>${esc(o.title)}</b> publicada`, '#/oportunidade/' + id);
    const m = matchOpp(o, S.me).score;
    if (m >= 70) notify('v', 'match', `Uma oportunidade compatível foi publicada: <b>${esc(o.title)}</b> (${m}%)`, '#/oportunidade/' + id);
    openModal('', `<div class="center" style="padding:10px 0;position:relative">${confetti()}<div class="success-ic" style="background:var(--blue)">${I('check', 40)}</div><h2>Oportunidade publicada!</h2><p class="muted"><b>${esc(o.title)}</b> já aparece nas buscas. ${m >= 70 ? `Notificamos voluntários compatíveis (Lívia tem <b>${m}%</b> de compatibilidade).` : ''}</p><div class="row" style="justify-content:center"><a class="btn btn-blue" href="#/oportunidade/${id}">Ver página</a><a class="btn btn-outline" href="#/o/voluntarios">Convidar voluntários</a></div></div>`);
    go('#/o/projetos');
  }
};

OP.projetos = () => {
  const list = myOpps(true), apps = ongApplicants();
  return `<div class="area-h"><div><h1>Projetos e oportunidades</h1><p>Edite, encerre ou reabra as oportunidades da organização.</p></div><a class="btn btn-blue btn-sm" href="#/o/publicar">${I('plus', 15)} Nova oportunidade</a></div>
    <div class="card tscroll"><table class="table"><thead><tr><th>Projeto</th><th>Modalidade</th><th>Vagas</th><th>Inscrições</th><th>Status</th><th></th></tr></thead><tbody>
    ${list.map(o => `<tr><td><div class="row" style="flex-wrap:nowrap">${thumb(o.cat, o.id, 42)}<div><b class="small">${esc(o.title)}</b><div class="xs muted">${CATS[o.cat].n} · publicada em ${fmtDate(o.posted || todayISO())}</div></div></div></td><td class="small">${o.mode}</td><td style="min-width:120px"><span class="small b">${o.filled}/${o.vagas}</span>${progress(o.filled / o.vagas * 100, 'blue')}</td><td class="small">${apps.filter(a => a.opp === o.id).length}</td><td>${o.closed ? '<span class="tag tag-gray">Encerrada</span>' : '<span class="tag tag-green">Ativa</span>'}</td>
      <td><div class="row-sm" style="flex-wrap:nowrap"><a class="btn btn-xs btn-outline" href="#/o/publicar?id=${o.id}">${I('edit', 13)} Editar</a><button class="btn btn-xs btn-ghost" data-act="opp-toggle" data-id="${o.id}">${o.closed ? 'Reabrir' : 'Encerrar'}</button></div></td></tr>`).join('')}</tbody></table></div>`;
};
ACT['opp-toggle'] = a => {
  const id = a.dataset.id, c = S.customOpps.find(x => x.id === id), cur = oppById(id).closed;
  if (c) c.closed = !cur; else S.oppEdits[id] = {...(S.oppEdits[id] || {}), closed:!cur};
  toast(cur ? 'Oportunidade reaberta.' : 'Oportunidade encerrada. Ela não aparece mais nas buscas.'); rerender();
};

const VF = {q:'', skills:[], int:'', city:'', opp:''};
OP.voluntarios = () => {
  const g = ongById(MY_ONG), opp = VF.opp ? oppById(VF.opp) : null, ctxSkills = opp ? opp.skills : ['Biologia', 'Fotografia', 'Comunicação', 'Dados', 'Didática'];
  const pool = [S.me, ...VOLS].filter(v => !isBlocked('vol', v.id));
  const allSkills = [...new Set(pool.flatMap(v => v.skills))].sort();
  const list = pool.filter(v => (!VF.q || norm(v.name + v.bio + v.skills.join(' ')).includes(norm(VF.q))) && (!VF.skills.length || VF.skills.every(s => v.skills.includes(s))) && (!VF.int || v.interests.includes(VF.int)) && (!VF.city || v.city === VF.city))
    .map(v => ({v, m:matchVol(v, opp ? opp.cat : g.cat, ctxSkills)})).sort((a, b) => b.m - a.m);
  return `<div class="area-h"><div><h1>Gerenciar voluntários</h1><p>Encontre voluntários compatíveis com seus projetos, veja currículos e envie convites.</p></div></div>
    <div class="card pad-s" style="margin-bottom:18px"><div class="row" style="gap:10px">
      <input class="input input-sm" style="flex:1;min-width:200px" placeholder="Buscar por nome ou habilidade" value="${esc(VF.q)}" data-change="vf" data-k="q" aria-label="Buscar voluntários">
      <select class="input input-sm" style="width:auto" data-change="vf" data-k="opp" aria-label="Projeto"><option value="">Compatibilidade com a organização</option>${myOpps().map(o => `<option value="${o.id}" ${VF.opp === o.id ? 'selected' : ''}>Para: ${esc(o.title)}</option>`).join('')}</select>
      <select class="input input-sm" style="width:auto" data-change="vf" data-k="int" aria-label="Causa"><option value="">Todas as causas</option>${CAUSES.map(c => `<option value="${c.k}" ${VF.int === c.k ? 'selected' : ''}>${c.n}</option>`).join('')}</select>
      <select class="input input-sm" style="width:auto" data-change="vf" data-k="city" aria-label="Cidade"><option value="">Todas as cidades</option>${[...new Set(pool.map(v => v.city))].sort().map(c => `<option ${VF.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="flabel" style="margin-top:14px">Filtrar por habilidades</div><div class="row-sm">${allSkills.map(s => `<span class="chip ${VF.skills.includes(s) ? 'on' : ''}" style="padding:6px 11px;font-size:12.5px" data-act="vf-skill" data-v="${esc(s)}">${esc(s)}</span>`).join('')}</div></div>
    <div class="results-h"><h2>${list.length} voluntário(s)${opp ? ` compatíveis com “${esc(opp.title)}”` : ''}</h2></div>
    <div class="grid auto">${list.map(({v, m}) => `<div class="card pad-s fade">${v.minor ? `<div class="row" style="flex-wrap:nowrap">${avatar({id:'x', name:'?'}, 48)}<div><b>Perfil protegido</b><div class="xs muted">Menor de idade · ${esc(v.city)}</div></div></div><div class="notice info" style="margin-top:12px;font-size:12.5px">${I('shield', 16)}<div>Dados restritos. Contato somente após autorização do responsável.</div></div>` : `
      <div class="row" style="flex-wrap:nowrap">${avatar(v, 52)}<div style="flex:1;min-width:0"><b>${esc(v.name)}${v.id === 'livia' ? ' <span class="tag tag-gray">demo</span>' : ''}</b><div class="xs muted">${esc(v.city)} · ${COUNTRIES[v.country].f} · ${v.age} anos</div></div>${ring(m, 54)}</div>
      <p class="small muted" style="margin:10px 0 8px;min-height:40px">${esc((v.bio || v.headline || '').slice(0, 90))}</p>
      <div class="row-sm" style="margin-bottom:10px">${v.skills.slice(0, 4).map(s => `<span class="tag ${ctxSkills.includes(s) ? 'tag-green' : 'tag-line'}">${esc(s)}</span>`).join('')}</div>
      <div class="xs muted" style="margin-bottom:12px">${I('clock', 13)} ${v.id === 'livia' ? hoursTotal() : v.hours}h doadas · ${I('cal', 13)} ${esc(typeof v.avail === 'string' ? v.avail : 'Qua, Sáb, Dom · noite')}</div>
      <div class="row-sm"><button class="btn btn-xs btn-outline" data-act="cv-view" data-id="${v.id}">${I('file', 13)} Currículo</button><button class="btn btn-xs btn-blue" data-act="invite" data-id="${v.id}">${I('send', 13)} Convidar</button><button class="btn btn-xs btn-ghost" data-act="msg-vol" data-id="${v.id}">${I('msg', 13)}</button></div>`}</div>`).join('')}</div>`;
};
CHANGE.vf = t => { VF[t.dataset.k] = t.value; rerender(); };
ACT['vf-skill'] = a => { toggleIn(VF.skills, a.dataset.v); rerender(); };
ACT['cv-view'] = a => {
  const v = volById(a.dataset.id);
  if (v.id === 'livia') return openModal('Currículo voluntário', cvHTML(), `<button class="btn btn-ghost" data-act="close">Fechar</button><button class="btn btn-blue" data-act="invite" data-id="livia">${I('send', 15)} Convidar</button>`, 'xwide');
  openModal('Currículo voluntário', `<div class="cv"><div class="cv-h">${avatar(v, 76)}<div><h2 style="margin:0">${esc(v.name)}</h2><div class="small muted">${esc(v.city)} · ${COUNTRIES[v.country].n} · ${v.age} anos</div></div></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center">${[[v.hours + 'h', 'dedicadas'], [v.projects, 'projetos'], [num(v.pts), 'pontos']].map(([x, l]) => `<div style="background:var(--soft);border-radius:10px;padding:10px"><b style="font-size:20px;color:var(--blue)">${x}</b><div class="xs muted">${l}</div></div>`).join('')}</div>
    <h3>Resumo</h3><p>${esc(v.bio)}</p><h3>Habilidades</h3><div class="row-sm">${v.skills.map(s => `<span class="tag tag-line">${esc(s)}</span>`).join('')}</div>
    <h3>Causas</h3><div class="row-sm">${v.interests.map(causeByK).filter(Boolean).map(c => `<span class="tag tag-green">${c.n}</span>`).join('')}</div>
    <h3>Disponibilidade</h3><p class="small">${esc(v.avail)}</p><span class="watermark">Currículo fictício para demonstração</span></div>`,
    `<button class="btn btn-ghost" data-act="close">Fechar</button><button class="btn btn-outline" data-act="msg-vol" data-id="${v.id}">${I('msg', 15)} Mensagem</button><button class="btn btn-blue" data-act="invite" data-id="${v.id}">${I('send', 15)} Convidar</button>`, 'wide');
};
ACT.invite = a => {
  if (!requireRole('ong', 'Convites são enviados por organizações.')) return;
  const v = volById(a.dataset.id); if (v.minor) return ACT['msg-vol'](a);
  openModal(`Convidar ${esc(v.name.split(' ')[0])}`, `<form data-form="invite" id="iv"><input type="hidden" name="vol" value="${v.id}"><label class="field"><span>Oportunidade</span><select class="input" name="opp">${myOpps().map(o => `<option value="${o.id}">${esc(o.title)} (${matchVol(v, o.cat, o.skills)}% compatível)</option>`).join('')}</select></label>
    <label class="field"><span>Mensagem</span><textarea class="input" name="msg">Olá, ${esc(v.name.split(' ')[0])}! Seu perfil combina muito com nosso projeto. Gostaria de participar?</textarea></label></form>`,
    `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-blue" data-act="submit-form" data-f="iv">${I('send', 15)} Enviar convite</button>`);
};
FORMS.invite = d => {
  const v = volById(d.vol), o = oppById(d.opp), g = ongById(MY_ONG);
  S.invites.push({vol:v.id, opp:o.id, t:todayISO()});
  openThread('o', 'vol', v.id, {sys:`Convite enviado para “${o.title}”`, me:d.msg});
  if (v.id === 'livia') { openThread('v', 'ong', MY_ONG, {sys:`Convite recebido para “${o.title}”`, them:d.msg, unread:true}); notify('v', 'interest', `<b>${esc(g.name)}</b> convidou você para <b>${esc(o.title)}</b>`, '#/oportunidade/' + o.id); }
  closeModal(); toast(`Convite enviado para <b>${esc(v.name)}</b>.`, 'send');
  if (v.id !== 'livia') setTimeout(() => {
    S.ongApps.push({id:'oa' + uid(), vol:v.id, opp:o.id, status:'pendente', date:todayISO()});
    const t = openThread('o', 'vol', v.id, {them:`Obrigado pelo convite! Acabei de me inscrever em “${o.title}”.`, unread:true});
    notify('o', 'app', `<b>${esc(v.name)}</b> aceitou o convite e se inscreveu em ${esc(o.title)}`, '#/o/inscricoes'); save();
    toast(`<b>${esc(v.name)}</b> aceitou o convite!`, 'check', '#/o/inscricoes', 'Ver inscrição'); rerender();
  }, 3200);
  save();
};

let OIF = {status:'', opp:''};
OP.inscricoes = () => {
  const list = ongApplicants().filter(a => (!OIF.status || a.status === OIF.status) && (!OIF.opp || a.opp === OIF.opp));
  return `<div class="area-h"><div><h1>Inscrições</h1><p>Analise candidaturas, veja currículos e confirme voluntários.</p></div></div>
    <div class="row-sm" style="margin-bottom:16px"><div class="tabs">${[['', 'Todas'], ['pendente', 'Pendentes'], ['aceita', 'Aceitas'], ['recusada', 'Recusadas']].map(([k, l]) => `<button class="${OIF.status === k ? 'on' : ''}" data-act="oif" data-v="${k}">${l} (${ongApplicants().filter(a => !k || a.status === k).length})</button>`).join('')}</div>
      <select class="input input-sm" style="width:auto" data-change="oif-opp" aria-label="Projeto"><option value="">Todos os projetos</option>${myOpps(true).map(o => `<option value="${o.id}" ${OIF.opp === o.id ? 'selected' : ''}>${esc(o.title)}</option>`).join('')}</select></div>
    ${list.length ? `<div class="card tscroll"><table class="table"><thead><tr><th>Voluntário</th><th>Projeto</th><th>Compatibilidade</th><th>Data</th><th>Status</th><th>Ações</th></tr></thead><tbody>
    ${list.map(a => { const v = volById(a.vol), o = oppById(a.opp), m = matchVol(v, o.cat, o.skills); return `<tr><td><div class="row" style="flex-wrap:nowrap">${v.minor ? avatar({id:'x', name:'?'}, 36) : avatar(v, 36)}<div><b class="small">${v.minor ? 'Perfil protegido' : esc(v.name)}</b><div class="xs muted">${v.minor ? '<span class="tag tag-warn">Menor de idade</span>' : esc(v.city) + ' · ' + v.age + ' anos'}</div></div></div></td><td class="small">${esc(o.title)}</td><td><span class="tag tag-green">${m}%</span></td><td class="small">${fmtDate(a.date)}</td><td>${statusTag(a.status)}</td>
      <td><div class="row-sm" style="flex-wrap:nowrap">${a.status === 'pendente' ? `<button class="btn btn-xs btn-primary" data-act="app-set" data-id="${a.id}" data-src="${a.src}" data-s="aceita">${I('check', 13)} Aceitar</button><button class="btn btn-xs btn-danger" data-act="app-set" data-id="${a.id}" data-src="${a.src}" data-s="recusada">Recusar</button>` : ''}${v.minor ? '' : `<button class="btn btn-xs btn-outline" data-act="cv-view" data-id="${v.id}">CV</button><button class="btn btn-xs btn-ghost" data-act="msg-vol" data-id="${v.id}" aria-label="Mensagem">${I('msg', 13)}</button>`}</div></td></tr>`; }).join('')}</tbody></table></div>` : emptyBox('check', 'Nenhuma inscrição neste filtro')}`;
};
ACT.oif = a => { OIF.status = a.dataset.v; rerender(); };
CHANGE['oif-opp'] = t => { OIF.opp = t.value; rerender(); };
ACT['app-set'] = a => {
  const {id, src, s} = a.dataset, arr = src === 'v' ? S.apps : S.ongApps, ap = arr.find(x => x.id === id), v = volById(src === 'v' ? 'livia' : ap.vol), o = oppById(ap.opp);
  if (v.minor && s === 'aceita') {
    ap.status = 'aceita'; ap.note = 'Aguardando autorização do responsável';
    openModal('Voluntário menor de idade', `<div class="notice info">${I('shield', 18)}<div>A inscrição foi pré-aprovada. A participação só será confirmada após a <b>autorização digital do responsável legal</b> (simulação). A atividade deve ser supervisionada e sem deslocamentos desacompanhados.</div></div>`, `<button class="btn btn-blue" data-act="close">Entendi</button>`);
  } else ap.status = s;
  if (src === 'v') {
    const t = openThread('v', 'ong', MY_ONG, {sys:`Inscrição em “${o.title}” ${s}`, them:s === 'aceita' ? `Oi, ${S.me.name.split(' ')[0]}! Sua inscrição foi aceita. Te esperamos na formação inicial!` : 'Obrigado pelo interesse! Infelizmente as vagas deste ciclo foram preenchidas. Esperamos você em outros projetos.', unread:true});
    notify('v', s === 'aceita' ? 'accept' : 'info', `Sua inscrição em <b>${esc(o.title)}</b> foi ${s}`, '#/v/inscricoes');
    if (s === 'aceita') { S.activity.unshift({t:todayISO(), text:`Inscrição aceita em ${o.title}`, i:'award'}); if (o.filled < o.vagas) { const c = S.customOpps.find(x => x.id === o.id); if (c) c.filled++; else S.oppEdits[o.id] = {...(S.oppEdits[o.id] || {}), filled:o.filled + 1}; } }
  }
  toast(`Inscrição de <b>${esc(v.minor ? 'perfil protegido' : v.name)}</b> ${s}.${src === 'v' ? ' A voluntária foi notificada.' : ''}`, s === 'aceita' ? 'check' : 'x'); rerender();
};

OP.eventos = () => `<div class="area-h"><div><h1>Eventos</h1><p>Organize encontros presenciais e virtuais. Eles aparecem no calendário público.</p></div><button class="btn btn-blue btn-sm" data-act="ev-new">${I('plus', 15)} Novo evento</button></div>
  ${myEvents().length ? `<div class="grid g2">${myEvents().map(e => `<div class="card pad fade"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div class="edate"><small>${MES[pd(e.date).getMonth()]}</small><b>${pd(e.date).getDate()}</b></div><div style="flex:1"><div class="row-sm"><span class="tag ${e.mode === 'Virtual' ? '' : 'tag-green'}">${e.mode}</span><span class="tag tag-line">${esc(e.type)}</span></div><h3 style="margin:6px 0 2px;font-size:16px">${esc(e.title)}</h3><div class="xs muted">${e.time} · ${esc(e.city)}</div>
    <div style="margin-top:10px">${progress(e.goingNow / e.spots * 100, 'blue')}<span class="xs muted">${num(e.goingNow)} de ${num(e.spots)} inscritos</span></div></div></div></div>`).join('')}</div>` : emptyBox('cal', 'Nenhum evento ainda', '', `<button class="btn btn-blue" data-act="ev-new">Criar evento</button>`)}`;
ACT['ev-new'] = () => openModal('Novo evento', `<form data-form="ev-new" id="evf"><label class="field"><span>Título</span><input class="input" name="title" required placeholder="Ex.: Mutirão de limpeza da praia"></label>
  <div class="frow"><label class="field"><span>Tipo</span><select class="input" name="type">${['Mutirão de limpeza', 'Plantio de árvores', 'Distribuição de alimentos', 'Proteção animal', 'Campanha de arrecadação', 'Encontro de formação', 'Oficina educativa'].map(t => `<option>${t}</option>`).join('')}</select></label><label class="field"><span>Formato</span><select class="input" name="mode"><option>Presencial</option><option>Virtual</option><option>Híbrido</option></select></label></div>
  <div class="frow3"><label class="field"><span>Data</span><input class="input" type="date" name="date" required value="2026-11-22" min="2026-10-29"></label><label class="field"><span>Horário</span><input class="input" type="time" name="time" value="09:00"></label><label class="field"><span>Vagas</span><input class="input" type="number" name="spots" value="50" min="1"></label></div>
  <label class="field"><span>Cidade / local</span><input class="input" name="city" value="${esc(ongById(MY_ONG).city)}"></label><label class="field"><span>Descrição</span><textarea class="input" name="desc" required></textarea></label></form>`,
  `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-blue" data-act="submit-form" data-f="evf">Criar evento</button>`, 'wide');
FORMS['ev-new'] = d => {
  const g = ongById(MY_ONG), e = {id:'ce' + uid(), ong:MY_ONG, title:d.title, type:d.type, date:d.date, time:d.time, mode:d.mode, city:d.mode === 'Virtual' ? 'Online' : d.city, country:g.country, spots:+d.spots, going:0, desc:d.desc};
  S.customEvents.push(e); notify('v', 'event', `Novo evento perto de você: <b>${esc(e.title)}</b>`, '#/eventos');
  closeModal(); toast('Evento criado! Ele já aparece no calendário público.', 'cal', '#/eventos', 'Ver calendário'); rerender();
};

OP.campanhas = () => `<div class="area-h"><div><h1>Campanhas</h1><p>Crie vaquinhas e acompanhe a arrecadação fictícia.</p></div><button class="btn btn-blue btn-sm" data-act="camp-new">${I('plus', 15)} Nova campanha</button></div>
  <div class="grid auto">${myCamps().map(campCard).join('')}</div>`;
ACT['camp-new'] = () => openModal('Nova campanha', `<form data-form="camp-new" id="cpf"><label class="field"><span>Nome da campanha</span><input class="input" name="title" required></label>
  <div class="frow"><label class="field"><span>Meta (R$)</span><input class="input" type="number" name="goal" min="100" value="20000" required></label><label class="field"><span>Prazo</span><input class="input" type="date" name="deadline" value="2027-01-31" required></label></div>
  <label class="field"><span>Descrição</span><textarea class="input" name="desc" required></textarea></label><label class="field"><span>Como os recursos serão usados (um por linha)</span><textarea class="input" name="uses"></textarea></label>
  <p class="hint">Nenhum valor real será arrecadado. Os indicadores são simulados.</p></form>`, `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-blue" data-act="submit-form" data-f="cpf">Criar campanha</button>`, 'wide');
FORMS['camp-new'] = d => {
  const c = {id:'cc' + uid(), ong:MY_ONG, title:d.title, cat:ongById(MY_ONG).cat, goal:+d.goal, raised:0, backers:0, deadline:d.deadline, desc:d.desc, uses:d.uses.split('\n').map(x => x.trim()).filter(Boolean)};
  S.customCamps.push(c); closeModal(); toast('Campanha criada e publicada em Vaquinhas.', 'coins', '#/vaquinha/' + c.id, 'Ver'); rerender();
};

OP.estatisticas = () => {
  const apps = ongApplicants(), opps = myOpps();
  const ages = [['14–17', 4], ['18–24', 31], ['25–34', 38], ['35–49', 19], ['50+', 8]];
  return `<div class="area-h"><div><h1>Estatísticas</h1><p>Indicadores detalhados da organização (dados fictícios).</p></div><button class="btn btn-outline btn-sm" data-act="csv">${I('download', 15)} Exportar CSV</button></div>
    <div class="kpis">${[['star', 'Avaliação média', ongById(MY_ONG).rating.toFixed(1), '138 avaliações'], ['refresh', 'Retenção de voluntários', '72%', 'participam 2+ vezes'], ['clock', 'Tempo de resposta', '5h', 'média às inscrições'], ['heart', 'Pessoas impactadas', '12.400', 'estimativa 2026']].map(([i, l, v, d]) => `<div class="card kpi"><div class="kh">${l}<span class="ki">${I(i, 17)}</span></div><div class="kv">${v}</div><div class="kd">${d}</div></div>`).join('')}</div>
    <div class="grid g2" style="margin-top:20px">
      <div class="card pad"><h3>Faixa etária dos voluntários (%)</h3>${barChart(ages.map(([l, v]) => ({l, v})), {fmt:v => v + '%'})}</div>
      <div class="card pad"><h3>Origem dos voluntários</h3>${donut([{l:'Joinville', v:58, c:'#008C45'}, {l:'Região norte de SC', v:21, c:'#0F4C81'}, {l:'Outros estados', v:14, c:'#5C8FC4'}, {l:'Outros países', v:7, c:'#3FCB7E'}], {label:'1.240', sub:'voluntários'})}</div>
      <div class="card pad"><h3>Horas por projeto</h3>${hbars(opps.map((o, i) => ({l:o.title, p:[78, 54, 36, 22][i % 4], v:num([6420, 4380, 2950, 1810][i % 4]) + 'h'})), v => v)}</div>
      <div class="card pad"><h3>Funil de inscrições</h3>${hbars([{l:'Visualizações', p:100, v:'8.940'}, {l:'Interesses', p:38, v:'3.410', cls:'blue'}, {l:'Inscrições', p:12, v:'1.080'}, {l:'Aceitas', p:9, v:'812', cls:'blue'}, {l:'Concluídas', p:7, v:'640'}], v => v)}</div>
    </div>
    <div class="card pad" style="margin-top:20px"><h3>Inscrições por status</h3>${hbars(['pendente', 'aceita', 'recusada'].map(s => { const n = apps.filter(a => a.status === s).length; return {l:s[0].toUpperCase() + s.slice(1), p:n / Math.max(apps.length, 1) * 100, v:n}; }), v => v)}</div>`;
};
ACT.csv = () => {
  const rows = [['voluntario', 'projeto', 'status', 'data'], ...ongApplicants().map(a => { const v = volById(a.vol); return [v.minor ? 'Perfil protegido' : v.name, oppById(a.opp).title, a.status, a.date]; })];
  downloadFile('12help-inscricoes.csv', '﻿' + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(';')).join('\n'), 'text/csv');
};
