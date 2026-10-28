/* ============================================================
   Sepuloz IT Ticketing — app logic
   Roles: pm · dev (lead | dev) · qa
   ============================================================ */

const ICON = {
  search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  board: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="7" height="18" rx="1.5"/><rect x="14" y="3" width="7" height="11" rx="1.5"/></svg>',
  list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  queue: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 2v4M12 18v4M4.9 4.9l2.9 2.9M16.2 16.2l2.9 2.9M2 12h4M18 12h4M4.9 19.1l2.9-2.9M16.2 7.8l2.9-2.9"/></svg>',
  digest: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  health: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 12h4l3 8 4-16 3 8h4"/></svg>',
  verify: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M9 11l3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  users: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  check: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m20 6-11 11-5-5"/></svg>',
  lock: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  msg: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  flag: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>',
  user: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  copy: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  out: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  clip: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21.4 11.05 12.25 20.2a6 6 0 0 1-8.49-8.49l9.2-9.19a4 4 0 0 1 5.65 5.66l-9.2 9.19a2 2 0 0 1-2.82-2.83l8.49-8.48"/></svg>',
  clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  reopen: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  shield: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
};

/* ---------------- PERMISSIONS ---------------- */
function isPM() { return state.user?.role === "pm"; }
function isLead() { return state.user?.role === "dev" && state.user.devRole === "lead"; }
function isDev() { return state.user?.role === "dev" && state.user.devRole === "dev"; }
function isQA() { return state.user?.role === "qa"; }

function inMySquad(t) {
  if (!state.user || state.user.role !== "dev") return false;
  const a = userById(t.assignee);
  return a && (a.id === state.user.id || a.leadId === state.user.id);
}

function can(t, action) {
  const u = state.user;
  if (!u) return false;
  if (u.role === "pm") return true;
  if (u.role === "qa") return ["edit", "attach", "verify", "reopen", "create"].includes(action);
  if (u.role === "dev") {
    const mine = t.assignee === u.id;
    const squad = inMySquad(t);
    if (u.devRole === "lead") {
      if (action === "assign") return squad || !t.assignee;
      return squad;
    }
    return mine && ["edit", "attach"].includes(action);
  }
  return false;
}

/* ---------------- LOGIN ---------------- */
function login(userId) {
  state.user = userById(userId);
  state.view = isPM() ? "board" : isQA() ? "verify" : isLead() ? "squad" : "queue";
  $("#login").style.display = "none";
  $("#app").classList.add("on");
  render();
}

function roleLabel(u) {
  if (!u) return "";
  if (u.role === "pm") return "Project Manager";
  if (u.role === "qa") return "QA Tester";
  return u.devRole === "lead" ? `Lead Developer · ${u.squad}` : `Developer · ${u.squad}`;
}

/* ---------------- SHELL ---------------- */
function navItems() {
  const items = [];
  if (isPM()) {
    items.push({ id: "board", label: "Team Board", icon: ICON.board, count: TICKETS.filter(t => !["resolved", "closed"].includes(t.status)).length });
    items.push({ id: "list", label: "All Tickets", icon: ICON.list, count: TICKETS.length });
    items.push({ id: "digest", label: "PM Digest", icon: ICON.digest });
    items.push({ id: "health", label: "Team Health", icon: ICON.health });
  } else if (isQA()) {
    items.push({ id: "verify", label: "Verification Queue", icon: ICON.verify, count: TICKETS.filter(t => t.status === "resolved").length });
    items.push({ id: "list", label: "All Tickets", icon: ICON.list, count: TICKETS.length });
    items.push({ id: "report", label: "QA Report", icon: ICON.health });
  } else if (isLead()) {
    const squad = TICKETS.filter(t => inMySquad(t) && !["resolved", "closed"].includes(t.status));
    items.push({ id: "squad", label: "Squad Board", icon: ICON.users, count: squad.length });
    items.push({ id: "queue", label: "My Queue", icon: ICON.queue, count: TICKETS.filter(t => t.assignee === state.user.id && !["resolved", "closed"].includes(t.status)).length });
    items.push({ id: "list", label: "All Tickets", icon: ICON.list, count: TICKETS.length });
    items.push({ id: "health", label: "Squad Health", icon: ICON.health });
  } else {
    items.push({ id: "queue", label: "My Queue", icon: ICON.queue, count: TICKETS.filter(t => t.assignee === state.user.id && !["resolved", "closed"].includes(t.status)).length });
    items.push({ id: "list", label: "All Tickets", icon: ICON.list, count: TICKETS.length });
  }
  return items;
}

function renderSidebar() {
  const items = navItems();
  $("#sidebar").innerHTML = `
    <div class="nav-label">Workspace</div>
    ${items.map(i => `
      <button class="nav-item ${state.view === i.id ? "active" : ""}" data-view="${i.id}">
        ${i.icon}<span>${i.label}</span>
        ${i.count !== undefined ? `<span class="nav-count">${i.count}</span>` : ""}
      </button>`).join("")}
    <div class="nav-label">Filters</div>
    <button class="nav-item ${state.filter.mine ? "active" : ""}" data-toggle="mine">
      ${ICON.user}<span>Only mine</span><span class="tick">${ICON.check}</span>
    </button>
    <button class="nav-item ${state.filter.priority === "critical" ? "active" : ""}" data-toggle="crit">
      ${ICON.flag}<span>Critical only</span><span class="tick">${ICON.check}</span>
    </button>
    <div class="side-foot">
      <button class="nav-item" data-logout>${ICON.out}<span>Switch role</span></button>
    </div>`;
}

function renderTopbar() {
  const u = state.user;
  const chipCls = u.role === "pm" ? "" : u.role === "qa" ? "qa" : "dev";
  const canCreate = isPM() || isQA();
  $("#topbar").innerHTML = `
    <div class="brand"><div class="brand-mark">S</div><span>Sepuloz Ticketing</span></div>
    <span class="role-chip ${chipCls}"><span class="dot"></span>${roleLabel(u)}</span>
    <div class="tb-search">
      ${ICON.search}
      <input id="q" placeholder="Search tickets, IDs, requesters…" value="${esc(state.filter.q)}">
    </div>
    <div class="tb-spacer"></div>
    ${canCreate ? `<button class="tb-btn primary" data-new>${ICON.plus} New ticket</button>` : ""}
    <div class="avatar ${u.role}" title="${esc(u.name)} · ${esc(u.title)}">${u.initials}</div>`;
  $("#q").addEventListener("input", e => { state.filter.q = e.target.value; renderView(); });
}

/* ---------------- FILTERING ---------------- */
function visibleTickets() {
  let ts = TICKETS.slice();
  const f = state.filter;
  if (f.mine) ts = ts.filter(t => t.assignee === state.user.id);
  if (f.priority === "critical") ts = ts.filter(t => t.priority === "critical");
  if (f.status !== "all") ts = ts.filter(t => t.status === f.status);
  if (f.assignee !== "all") ts = ts.filter(t => String(t.assignee) === f.assignee);
  if (f.q.trim()) {
    const q = f.q.toLowerCase();
    ts = ts.filter(t =>
      t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) ||
      t.requester.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  return ts;
}

/* ---------------- CARD ---------------- */
function estChip(t) {
  const e = estState(t);
  if (!e) return "";
  return `<span class="est ${e.cls}" title="Time box ${e.est}h · used ${e.used}h">${ICON.clock} ${e.used}/${e.est}h</span>`;
}

function tcard(t) {
  const st = statusOf(t.status), pr = prioOf(t.priority), s = slaState(t), a = userById(t.assignee);
  const e = estState(t);
  return `<div class="tcard ${ageClass(t)}" data-ticket="${t.id}">
    <div class="tcard-top">
      <span class="tid">${t.id}</span>
      <span class="pill ${pr.cls}">${pr.label}</span>
    </div>
    ${t.stuck ? `<div class="stuck-tag">${ICON.lock} ${esc(t.stuck)}</div>` : ""}
    ${t.reopened ? `<div class="reopen-tag">${ICON.reopen} Reopened ×${t.reopened}</div>` : ""}
    <div class="tcard-title">${esc(t.title)}</div>
    ${e ? `<div class="est-track"><div class="est-fill ${e.cls}" style="width:${e.pct}%"></div></div>` : ""}
    <div class="tcard-foot">
      ${a ? `<div class="avatar ${a.role} ${a.devRole || ""}" title="${esc(a.name)} · ${esc(a.title)}">${a.initials}</div>` : `<span style="color:var(--text-3)">Unassigned</span>`}
      <span>${esc(t.category)}</span>
      <span class="sla ${s.cls}">${s.txt}</span>
    </div>
  </div>`;
}

/* ---------------- VIEWS ---------------- */
function renderView() {
  const v = state.view;
  const el = $("#main");
  if (v === "board") el.innerHTML = viewBoard();
  else if (v === "squad") el.innerHTML = viewSquad();
  else if (v === "list") el.innerHTML = viewList();
  else if (v === "queue") el.innerHTML = viewQueue();
  else if (v === "verify") el.innerHTML = viewVerify();
  else if (v === "report") el.innerHTML = viewQAReport();
  else if (v === "digest") el.innerHTML = viewDigest();
  else if (v === "health") el.innerHTML = viewHealth();
  bindView();
}

function boardCols(ts) {
  const cols = ["open", "progress", "blocked", "hold", "resolved"];
  return `<div class="board">
    ${cols.map(id => {
      const s = statusOf(id), col = ts.filter(t => t.status === id);
      return `<div class="board-col">
        <div class="col-head"><span class="pill ${s.cls}"><span class="dot"></span>${s.label}</span><span class="cnt">${col.length}</span></div>
        <div class="col-body">${col.map(tcard).join("") || `<div class="empty">Nothing here</div>`}</div>
      </div>`;
    }).join("")}
  </div>`;
}

function viewBoard() {
  const ts = visibleTickets().filter(t => t.status !== "closed");
  const open = ts.filter(t => t.status === "open").length;
  const prog = ts.filter(t => t.status === "progress").length;
  const blocked = ts.filter(t => t.status === "blocked" || t.status === "hold").length;
  const breached = ts.filter(t => slaState(t).cls === "breach").length;
  const unassigned = ts.filter(t => !t.assignee).length;
  const awaitQA = TICKETS.filter(t => t.status === "resolved").length;

  return `
    <div class="page-head">
      <div>
        <div class="page-title">Team Board</div>
        <div class="page-sub">Assign, prioritise and unblock. Colour bar = how long the ticket has sat untouched.</div>
      </div>
      <div class="page-head-actions">
        <button class="tb-btn" data-view-jump="digest">${ICON.digest} PM Digest</button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat"><div class="stat-label">Open</div><div class="stat-val">${open}</div><div class="stat-meta">${unassigned} unassigned</div></div>
      <div class="stat p"><div class="stat-label">In Progress</div><div class="stat-val">${prog}</div><div class="stat-meta">being worked now</div></div>
      <div class="stat r"><div class="stat-label">Blocked / Hold</div><div class="stat-val">${blocked}</div><div class="stat-meta">${blocked ? "<b class='bad'>needs unblocking</b>" : "all clear"}</div></div>
      <div class="stat q"><div class="stat-label">Awaiting QA</div><div class="stat-val">${awaitQA}</div><div class="stat-meta">not closed until verified</div></div>
    </div>

    ${breached ? `<div class="alert-bar">${ICON.flag} <b>${breached} ticket${breached > 1 ? "s" : ""} past SLA.</b> Escalate today.</div>` : ""}

    ${boardCols(ts)}`;
}

function viewSquad() {
  const squad = mySquad(state.user.id);
  const ts = visibleTickets().filter(t => inMySquad(t) && t.status !== "closed");
  const unassignedToMe = TICKETS.filter(t => t.assignee === state.user.id && !["resolved", "closed"].includes(t.status));
  const members = squad.filter(u => u.id !== state.user.id);

  return `
    <div class="page-head">
      <div>
        <div class="page-title">Squad Board — ${esc(state.user.squad)}</div>
        <div class="page-sub">You delegate to your own team and set a time box. Nobody gets a ticket without an estimate.</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <div class="panel-title">Your squad</div>
        <div class="panel-sub">${squad.length} people · live load</div>
      </div>
      <div class="panel-body">
        ${squad.map(u => {
          const n = devLoad(u.id).count;
          const pct = Math.min(100, (n / 6) * 100);
          return `<div class="bar-row">
            <div class="avatar ${u.role} ${u.devRole || ""}" style="width:24px;height:24px;flex:0 0 24px;font-size:9.5px">${u.initials}</div>
            <span class="lbl">${esc(u.name)}${u.id === state.user.id ? " <span style='color:var(--text-3);font-size:10.5px'>(you)</span>" : ""}<br><span style="font-size:10.5px;color:var(--text-3)">${esc(u.title)}</span></span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${n >= 5 ? "var(--red)" : n >= 3 ? "var(--amber)" : "var(--green)"}"></div></div>
            <span class="num">${n}</span>
          </div>`;
        }).join("")}
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat"><div class="stat-label">Squad active</div><div class="stat-val">${ts.length}</div><div class="stat-meta">across ${squad.length} people</div></div>
      <div class="stat p"><div class="stat-label">On you</div><div class="stat-val">${unassignedToMe.length}</div><div class="stat-meta">still your own tickets</div></div>
      <div class="stat r"><div class="stat-label">Blocked</div><div class="stat-val">${ts.filter(t => ["blocked", "hold"].includes(t.status)).length}</div><div class="stat-meta">waiting on someone else</div></div>
      <div class="stat q"><div class="stat-label">Awaiting QA</div><div class="stat-val">${TICKETS.filter(t => inMySquad(t) && t.status === "resolved").length}</div><div class="stat-meta">with the QA tester</div></div>
    </div>

    ${boardCols(ts)}`;
}

function viewQueue() {
  const mine = TICKETS.filter(t => t.assignee === state.user.id);
  const active = mine.filter(t => !["resolved", "closed"].includes(t.status));
  const blocked = mine.filter(t => ["blocked", "hold"].includes(t.status));
  const done = mine.filter(t => ["resolved", "closed"].includes(t.status));

  const rank = { critical: 0, high: 1, medium: 2, low: 3 };
  const focus = active.slice().sort((a, b) => {
    const ab = slaState(a).cls === "breach" ? 0 : 1;
    const bb = slaState(b).cls === "breach" ? 0 : 1;
    if (ab !== bb) return ab - bb;
    if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
    return a.dueIn - b.dueIn;
  });

  return `
    <div class="page-head">
      <div>
        <div class="page-title">My Queue</div>
        <div class="page-sub">${active.length} active · ${blocked.length} blocked or on hold · ${done.length} done · sorted by what needs you first</div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><div class="stat-label">Active</div><div class="stat-val">${active.length}</div><div class="stat-meta">your workload</div></div>
      <div class="stat r"><div class="stat-label">Blocked / Hold</div><div class="stat-val">${blocked.length}</div><div class="stat-meta">${blocked.length ? "<b class='bad'>tell your lead</b>" : "all clear"}</div></div>
      <div class="stat g"><div class="stat-label">Resolved</div><div class="stat-val">${done.length}</div><div class="stat-meta">awaiting QA or closed</div></div>
      <div class="stat a"><div class="stat-label">Time box at risk</div><div class="stat-val">${active.filter(t => estState(t)?.cls !== "ok" && estState(t)).length}</div><div class="stat-meta">over or near your estimate</div></div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <div class="panel-title">Work this next</div>
        <div class="panel-sub">breached first, then priority, then deadline</div>
      </div>
      <div class="panel-body" style="display:flex;flex-direction:column;gap:9px">
        ${focus.length ? focus.map((t, i) => {
          const s = statusOf(t.status), p = prioOf(t.priority), sl = slaState(t), e = estState(t);
          return `<button class="tcard ${ageClass(t)}" data-ticket="${t.id}" style="text-align:left;display:flex;align-items:center;gap:13px;padding:13px 15px">
            <div style="font-family:var(--mono);font-size:16px;font-weight:700;color:var(--text-3);width:26px;flex:0 0 26px">${i + 1}</div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap">
                <span class="tid">${t.id}</span>
                <span class="pill ${p.cls}">${p.label}</span>
                <span class="pill ${s.cls}"><span class="dot"></span>${s.label}</span>
                ${t.stuck ? `<span class="stuck-tag" style="margin:0">${ICON.lock} ${esc(t.stuck)}</span>` : ""}
                ${t.reopened ? `<span class="reopen-tag" style="margin:0">${ICON.reopen} ×${t.reopened}</span>` : ""}
              </div>
              <div style="font-size:13.5px;font-weight:500;line-height:1.4">${esc(t.title)}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:5px">${esc(t.category)} · ${esc(t.requester)} · updated ${ago(NOW - t.updated)} ago${e ? ` · time box ${e.used}h of ${e.est}h` : ""}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px">
              <span class="sla ${sl.cls}" style="font-size:11px;padding:3px 9px">${sl.txt}</span>
              ${e ? `<span class="est ${e.cls}" style="font-size:10.5px">${ICON.clock} ${e.pct}% of box</span>` : ""}
            </div>
          </button>`;
        }).join("") : `<div class="empty">Nothing assigned to you right now. Enjoy the quiet.</div>`}
      </div>
    </div>

    ${done.length ? `<div class="panel">
      <div class="panel-head"><div class="panel-title">Resolved by you</div><div class="panel-sub">${done.length} · waiting on QA or already verified</div></div>
      <div class="panel-body" style="display:flex;flex-direction:column;gap:8px">
        ${done.map(t => `<button class="tcard" data-ticket="${t.id}" style="text-align:left;display:flex;align-items:center;gap:11px;padding:11px 14px;opacity:.8">
          <span class="pill ${t.status}"><span class="dot"></span>${statusOf(t.status).label}</span>
          <span style="flex:1;font-size:12.5px">${esc(t.title)}</span>
          <span style="font-size:11px;color:var(--text-3)">${ago(NOW - t.updated)} ago</span>
        </button>`).join("")}
      </div>
    </div>` : ""}`;
}

/* ---------------- QA VERIFICATION ---------------- */
function viewVerify() {
  const pending = TICKETS.filter(t => t.status === "resolved");
  const verified = TICKETS.filter(t => t.status === "closed");
  const reopened = TICKETS.filter(t => t.reopened > 0);

  return `
    <div class="page-head">
      <div>
        <div class="page-title">Verification Queue</div>
        <div class="page-sub">A developer marking a ticket resolved is a claim, not a fact. Nothing closes until you verify it.</div>
      </div>
      <div class="page-head-actions">
        <button class="tb-btn primary" data-new>${ICON.plus} Raise a ticket</button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat q"><div class="stat-label">Awaiting verification</div><div class="stat-val">${pending.length}</div><div class="stat-meta">${pending.length ? "<b class='bad'>devs are waiting on you</b>" : "queue empty"}</div></div>
      <div class="stat g"><div class="stat-label">Verified & closed</div><div class="stat-val">${verified.length}</div><div class="stat-meta">passed QA</div></div>
      <div class="stat r"><div class="stat-label">Reopened</div><div class="stat-val">${reopened.length}</div><div class="stat-meta">${reopened.length ? "fix was not real" : "no rework"}</div></div>
      <div class="stat"><div class="stat-label">Raised by QA</div><div class="stat-val">${TICKETS.filter(t => t.createdBy === state.user.id).length}</div><div class="stat-meta">your own findings</div></div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <div class="panel-title">Verify or send back</div>
        <div class="panel-sub">check the fix, attach evidence, then close it — or reopen with a reason</div>
      </div>
      <div class="panel-body" style="display:flex;flex-direction:column;gap:10px">
        ${pending.length ? pending.map(t => {
          const a = userById(t.assignee), p = prioOf(t.priority);
          const waited = NOW - (t.resolvedAt || t.updated);
          return `<div class="verify-card">
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
                <span class="tid">${t.id}</span>
                <span class="pill ${p.cls}">${p.label}</span>
                <span class="pill resolved"><span class="dot"></span>Awaiting QA</span>
                <span class="sla ${waited > 12 * H ? "warn" : "ok"}">waiting ${ago(waited)}</span>
              </div>
              <div style="font-size:13.5px;font-weight:500;line-height:1.4;margin-bottom:4px">${esc(t.title)}</div>
              <div style="font-size:11px;color:var(--text-3)">Fixed by ${esc(a?.name || "—")} · ${esc(t.category)} · ${esc(t.requester)}</div>
            </div>
            <div style="display:flex;gap:7px;flex-shrink:0">
              <button class="tb-btn" data-ticket="${t.id}">View ticket</button>
              <button class="tb-btn warn" data-reopen="${t.id}">${ICON.reopen} Reopen</button>
              <button class="tb-btn ok" data-verify="${t.id}">${ICON.check} Verify & close</button>
            </div>
          </div>`;
        }).join("") : `<div class="empty">Nothing to verify. Every claim has been checked.</div>`}
      </div>
    </div>`;
}

function viewQAReport() {
  const closed = TICKETS.filter(t => t.status === "closed");
  const reopened = TICKETS.filter(t => t.reopened > 0);
  const totalResolvedEver = closed.length + reopened.length;
  const reopenRate = totalResolvedEver ? Math.round((reopened.length / totalResolvedEver) * 100) : 0;

  const byDev = {};
  TICKETS.filter(t => t.assignee).forEach(t => {
    byDev[t.assignee] = byDev[t.assignee] || { resolved: 0, reopened: 0 };
    if (t.status === "closed") byDev[t.assignee].resolved++;
    if (t.reopened) byDev[t.assignee].reopened += t.reopened;
  });

  return `
    <div class="page-head">
      <div>
        <div class="page-title">QA Report</div>
        <div class="page-sub">The quality signal nobody else measures: how often "resolved" turns out to be wrong.</div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat q"><div class="stat-label">Reopen rate</div><div class="stat-val">${reopenRate}%</div><div class="stat-meta">target under 10%</div></div>
      <div class="stat"><div class="stat-label">Verified</div><div class="stat-val">${closed.length}</div><div class="stat-meta">closed by QA</div></div>
      <div class="stat r"><div class="stat-label">Sent back</div><div class="stat-val">${reopened.length}</div><div class="stat-meta">fix rejected</div></div>
      <div class="stat g"><div class="stat-label">Raised by QA</div><div class="stat-val">${TICKETS.filter(t => t.createdBy === state.user.id).length}</div><div class="stat-meta">proactive findings</div></div>
    </div>

    <div class="panel">
      <div class="panel-head"><div class="panel-title">Reopen rate by developer</div><div class="panel-sub">who ships fixes that hold up</div></div>
      <div class="panel-body">
        ${Object.entries(byDev).filter(([, v]) => v.resolved + v.reopened > 0).map(([uid, v]) => {
          const u = userById(uid);
          const tot = v.resolved + v.reopened;
          const pct = tot ? Math.round((v.resolved / tot) * 100) : 0;
          return `<div class="bar-row">
            <div class="avatar ${u.role} ${u.devRole || ""}" style="width:22px;height:22px;flex:0 0 22px;font-size:9px">${u.initials}</div>
            <span class="lbl">${esc(u.name)}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${pct >= 90 ? "var(--green)" : pct >= 70 ? "var(--amber)" : "var(--red)"}"></div></div>
            <span class="num">${v.resolved}/${tot}</span>
          </div>`;
        }).join("") || `<div class="empty">No verified tickets yet</div>`}
      </div>
    </div>`;
}

function viewList() {
  const ts = visibleTickets().sort((a, b) => b.created - a.created);
  return `
    <div class="page-head">
      <div>
        <div class="page-title">All Tickets</div>
        <div class="page-sub">${ts.length} ticket${ts.length === 1 ? "" : "s"} matching current filters</div>
      </div>
      <div class="page-head-actions">
        <select class="tb-btn" id="f-status">
          <option value="all">All statuses</option>
          ${STATUSES.map(s => `<option value="${s.id}" ${state.filter.status === s.id ? "selected" : ""}>${s.label}</option>`).join("")}
        </select>
        <select class="tb-btn" id="f-assignee">
          <option value="all">All assignees</option>
          <option value="null" ${state.filter.assignee === "null" ? "selected" : ""}>Unassigned</option>
          ${USERS.filter(u => u.role === "dev").map(u => `<option value="${u.id}" ${state.filter.assignee === u.id ? "selected" : ""}>${esc(u.name)}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="panel">
      <table class="tbl">
        <thead><tr>
          <th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Time box</th><th>SLA</th><th>Age</th>
        </tr></thead>
        <tbody>
        ${ts.map(t => {
          const s = statusOf(t.status), p = prioOf(t.priority), a = userById(t.assignee), sl = slaState(t), e = estState(t);
          return `<tr data-ticket="${t.id}">
            <td class="tid">${t.id}</td>
            <td class="ttitle">${esc(t.title)}${t.reopened ? ` <span class="reopen-tag" style="margin:0">×${t.reopened}</span>` : ""}</td>
            <td><span class="pill ${s.cls}"><span class="dot"></span>${s.label}</span></td>
            <td><span class="pill ${p.cls}">${p.label}</span></td>
            <td>${a ? `<div style="display:flex;align-items:center;gap:7px"><div class="avatar ${a.role} ${a.devRole || ""}" style="width:22px;height:22px;flex:0 0 22px;font-size:9px">${a.initials}</div>${esc(a.name.split(" ")[0])}</div>` : `<span style="color:var(--text-3)">—</span>`}</td>
            <td>${e ? `<span class="est ${e.cls}">${e.used}/${e.est}h</span>` : `<span style="color:var(--text-3)">—</span>`}</td>
            <td><span class="sla ${sl.cls}">${sl.txt}</span></td>
            <td style="color:var(--text-3)">${ago(NOW - t.created)}</td>
          </tr>`;
        }).join("") || `<tr><td colspan="8"><div class="empty">No tickets match these filters</div></td></tr>`}
        </tbody>
      </table>
    </div>`;
}

/* ---------------- DIGEST ---------------- */
function cut(s, n) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

function buildDigest() {
  const active = TICKETS.filter(t => !["resolved", "closed"].includes(t.status));
  const moved = TICKETS.filter(t => NOW - t.updated < 24 * H && !["resolved", "closed"].includes(t.status));
  const blocked = TICKETS.filter(t => ["blocked", "hold"].includes(t.status));
  const breached = TICKETS.filter(t => slaState(t).cls === "breach");
  const unassigned = TICKETS.filter(t => !t.assignee && !["resolved", "closed"].includes(t.status));
  const awaitQA = TICKETS.filter(t => t.status === "resolved");
  const reopened = TICKETS.filter(t => t.reopened > 0);
  const overBox = active.filter(t => estState(t)?.over);

  const L = [];
  L.push(`IT SUPPORT — DAILY DIGEST`);
  L.push(NOW.toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  L.push("");
  L.push(`AT A GLANCE`);
  L.push(`  Active tickets ......... ${active.length}`);
  L.push(`  Awaiting QA ............ ${awaitQA.length}`);
  L.push(`  Blocked / on hold ...... ${blocked.length}`);
  L.push(`  Unassigned ............. ${unassigned.length}`);
  L.push(`  SLA breached ........... ${breached.length}`);
  L.push(`  Reopened by QA ......... ${reopened.length}`);
  L.push("");
  if (breached.length) {
    L.push(`SLA BREACHED — escalate now`);
    breached.forEach(t => L.push(`  ${t.id}  ${cut(t.title, 44)}  (${userById(t.assignee)?.name.split(" ")[0] || "unassigned"})`));
    L.push("");
  }
  if (overBox.length) {
    L.push(`TIME BOX BLOWN`);
    overBox.forEach(t => {
      const e = estState(t);
      L.push(`  ${t.id}  ${e.used}h of ${e.est}h  ${cut(t.title, 34)}  (${userById(t.assignee)?.name.split(" ")[0]})`);
    });
    L.push("");
  }
  if (unassigned.length) {
    L.push(`UNASSIGNED — needs an owner`);
    unassigned.forEach(t => L.push(`  ${t.id}  ${cut(t.title, 46)}  [${prioOf(t.priority).label}]`));
    L.push("");
  }
  if (blocked.length) {
    L.push(`BLOCKED — waiting on someone else`);
    blocked.forEach(t => L.push(`  ${t.id}  ${cut(t.title, 36)}  -> ${t.stuck || "unspecified"}`));
    L.push("");
  }
  if (awaitQA.length) {
    L.push(`AWAITING QA VERIFICATION`);
    awaitQA.forEach(t => L.push(`  ${t.id}  ${cut(t.title, 44)}  (fixed by ${userById(t.assignee)?.name.split(" ")[0]})`));
    L.push("");
  }
  if (moved.length) {
    L.push(`MOVED IN THE LAST 24H`);
    moved.forEach(t => L.push(`  ${t.id}  ${statusOf(t.status).label.padEnd(12)} ${cut(t.title, 40)}`));
    L.push("");
  }
  L.push(`TEAM LOAD`);
  USERS.filter(u => u.role === "dev").forEach(u => {
    const n = devLoad(u.id).count;
    const bar = "#".repeat(n) + ".".repeat(Math.max(0, 8 - n));
    L.push(`  ${(u.name + (u.devRole === "lead" ? " (L)" : "")).padEnd(22)} ${bar} ${n}`);
  });
  return L.join("\n");
}

function viewDigest() {
  return `
    <div class="page-head">
      <div>
        <div class="page-title">PM Digest</div>
        <div class="page-sub">Auto-generated from live ticket state. Copy straight into WhatsApp or email.</div>
      </div>
      <div class="page-head-actions">
        <button class="tb-btn primary" id="copy-digest">${ICON.copy} Copy digest</button>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head">
        <div class="panel-title">Today's summary</div>
        <div class="panel-sub">generated ${fmtTime(NOW)}</div>
      </div>
      <div class="panel-body"><div class="digest" id="digest-body">${esc(buildDigest())}</div></div>
    </div>`;
}

/* ---------------- HEALTH ---------------- */
function viewHealth() {
  const devs = isLead() ? mySquad(state.user.id) : USERS.filter(u => u.role === "dev");
  const cats = {};
  TICKETS.forEach(t => { cats[t.category] = (cats[t.category] || 0) + 1; });
  const catArr = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const maxCat = catArr[0]?.[1] || 1;
  const closed = TICKETS.filter(t => t.status === "closed");
  const reopened = TICKETS.filter(t => t.reopened > 0);
  const slaOk = TICKETS.filter(t => slaState(t).cls !== "breach").length;

  return `
    <div class="page-head">
      <div>
        <div class="page-title">${isLead() ? "Squad Health" : "Team Health"}</div>
        <div class="page-sub">One screen you can screenshot for management.</div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat g"><div class="stat-label">SLA compliance</div><div class="stat-val">${Math.round((slaOk / TICKETS.length) * 100)}%</div><div class="stat-meta">target 95%</div></div>
      <div class="stat q"><div class="stat-label">Verified by QA</div><div class="stat-val">${closed.length}</div><div class="stat-meta">closed with evidence</div></div>
      <div class="stat r"><div class="stat-label">Reopened</div><div class="stat-val">${reopened.length}</div><div class="stat-meta">${reopened.length ? "fixes that failed QA" : "<b>no rework</b>"}</div></div>
      <div class="stat a"><div class="stat-label">Time box blown</div><div class="stat-val">${TICKETS.filter(t => estState(t)?.over).length}</div><div class="stat-meta">estimates that slipped</div></div>
    </div>

    <div class="panel">
      <div class="panel-head"><div class="panel-title">Workload balance</div><div class="panel-sub">active tickets per developer</div></div>
      <div class="panel-body">
        ${devs.map(u => {
          const n = devLoad(u.id).count;
          const pct = Math.min(100, (n / 6) * 100);
          return `<div class="bar-row">
            <div class="avatar ${u.role} ${u.devRole || ""}" style="width:22px;height:22px;flex:0 0 22px;font-size:9px">${u.initials}</div>
            <span class="lbl">${esc(u.name)}${u.devRole === "lead" ? " <span style='color:var(--purple);font-size:10px'>LEAD</span>" : ""}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${n >= 5 ? "var(--red)" : n >= 3 ? "var(--amber)" : "var(--green)"}"></div></div>
            <span class="num">${n}</span>
          </div>`;
        }).join("")}
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><div class="panel-title">Top ticket categories</div><div class="panel-sub">where the volume actually comes from</div></div>
      <div class="panel-body">
        ${catArr.map(([c, n]) => `<div class="bar-row">
          <span class="lbl">${esc(c)}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${(n / maxCat) * 100}%"></div></div>
          <span class="num">${n}</span>
        </div>`).join("")}
      </div>
    </div>`;
}

/* ---------------- DRAWER ---------------- */
function openTicket(id) {
  const t = TICKETS.find(x => x.id === id);
  if (!t) return;
  state.drawerTicket = t;
  const a = userById(t.assignee);
  const s = statusOf(t.status), p = prioOf(t.priority), sl = slaState(t), e = estState(t);
  const editable = can(t, "edit");
  const assignable = can(t, "assign");
  const isQAVerify = isQA() && t.status === "resolved";

  $("#drawer-bg").classList.add("on");
  $("#drawer").classList.add("on");
  $("#drawer").innerHTML = `
    <div class="drawer-head">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap">
          <span class="tid">${t.id}</span>
          <span class="pill ${s.cls}"><span class="dot"></span>${s.label}</span>
          <span class="pill ${p.cls}">${p.label}</span>
          <span class="sla ${sl.cls}">${sl.txt}</span>
          ${t.reopened ? `<span class="reopen-tag" style="margin:0">${ICON.reopen} Reopened ×${t.reopened}</span>` : ""}
        </div>
        <div style="font-size:16px;font-weight:600;line-height:1.35">${esc(t.title)}</div>
      </div>
      <button class="icon-btn" data-close-drawer>${ICON.close}</button>
    </div>

    <div class="drawer-body">
      ${t.status === "resolved" ? `<div class="qa-banner">
        ${ICON.shield}
        <div>
          <b>Waiting on QA verification.</b>
          <span>Resolved ${ago(NOW - (t.resolvedAt || t.updated))} ago by ${esc(userById(t.assignee)?.name || "—")}. This ticket stays open until QA signs it off.</span>
        </div>
      </div>` : ""}

      <div class="detail-grid">
        <div>
          <div class="detail-desc">${esc(t.desc)}</div>

          ${e ? `<div class="box">
            <div class="box-head">${ICON.clock} Time box</div>
            <div class="est-row">
              <div class="est-track big"><div class="est-fill ${e.cls}" style="width:${e.pct}%"></div></div>
              <span class="est ${e.cls}">${e.used}h / ${e.est}h</span>
            </div>
            <div style="font-size:11.5px;color:var(--text-3);margin-top:6px">
              ${e.over
                ? `<b class="bad">Over the box by ${(e.used - e.est).toFixed(1)}h.</b> The lead set ${e.est}h when delegating.`
                : `${(e.est - e.used).toFixed(1)}h left of the box the lead set.`}
            </div>
          </div>` : ""}

          ${t.attachments?.length ? `<div class="box">
            <div class="box-head">${ICON.clip} Attachments (${t.attachments.length})</div>
            ${t.attachments.map(f => `<div class="attach-item">
              <span class="attach-ico">${ICON.clip}</span>
              <span class="attach-name">${esc(f.name)}</span>
              <span class="attach-meta">${fmtSize(f.size)} · ${esc(userById(f.by)?.name.split(" ")[0] || "—")} · ${ago(NOW - f.at)} ago</span>
            </div>`).join("")}
          </div>` : ""}

          <div style="font-size:11.5px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.07em;margin:18px 0 12px">Timeline</div>
          <div class="timeline">
            ${t.events.map(ev => {
              const u = userById(ev.actor);
              const meta = { c: "created", s: "changed status", m: "commented", b: "blocked", f: "uploaded a file", a: "assigned", v: "verified", r: "reopened" }[ev.kind] || "updated";
              const dotIco = ev.kind === "m" ? ICON.msg : ev.kind === "b" ? ICON.flag : ev.kind === "f" ? ICON.clip : ev.kind === "v" ? ICON.check : ev.kind === "r" ? ICON.reopen : ev.kind === "a" ? ICON.user : ICON.check;
              return `<div class="tl-item">
                <div class="tl-dot ${ev.kind}">${dotIco}</div>
                <div class="tl-head"><b>${esc(u?.name || "System")}</b><span style="color:var(--text-3);font-weight:400">${meta}</span><span class="tl-time">${fmtTime(ev.t)}</span></div>
                ${["m", "b", "r", "v"].includes(ev.kind) ? `<div class="tl-body ${ev.internal ? "internal" : ""}">${esc(ev.text)}</div>` : `<div style="font-size:12px;color:var(--text-3)">${esc(ev.text)}</div>`}
              </div>`;
            }).join("")}
          </div>

          ${editable ? `
          <div style="margin-top:20px">
            <div class="field">
              <label>Add comment</label>
              <textarea id="new-comment" placeholder="Type an update…"></textarea>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2);cursor:pointer">
                <input type="checkbox" id="internal-flag" style="width:auto"> Internal note
              </label>
              <button class="tb-btn" id="btn-attach">${ICON.clip} Attach file</button>
              <input type="file" id="file-input" accept="${ACCEPT}" style="display:none">
              <button class="tb-btn primary" style="margin-left:auto" data-add-comment="${t.id}">Post comment</button>
            </div>
          </div>` : ""}
        </div>

        <div>
          <div class="meta-box">
            <div class="meta-row"><span class="k">Status</span><span class="v">${editable && !isQAVerify
              ? `<select id="sel-status">${STATUSES.filter(x => x.id !== "closed" || isQA() || isPM()).map(x => `<option value="${x.id}" ${x.id === t.status ? "selected" : ""}>${x.label}</option>`).join("")}</select>`
              : `<span class="pill ${s.cls}">${s.label}</span>`}</span></div>
            ${t.stuck ? `<div class="meta-row"><span class="k">Stuck on</span><span class="v" style="color:var(--red);font-size:11.5px">${esc(t.stuck)}</span></div>` : ""}
            <div class="meta-row"><span class="k">Assignee</span><span class="v">${assignable
              ? `<select id="sel-assignee"><option value="">Unassigned</option>${assignableFor(state.user).map(u => `<option value="${u.id}" ${u.id === t.assignee ? "selected" : ""}>${esc(u.name.split(" ")[0])}${u.devRole === "lead" ? " (L)" : ""} — ${devLoad(u.id).count}</option>`).join("")}</select>`
              : (a ? esc(a.name) : "—")}</span></div>
            ${a ? `<div class="meta-row"><span class="k">Role</span><span class="v" style="font-size:11.5px">${esc(a.title)}</span></div>` : ""}
            ${t.assignedBy ? `<div class="meta-row"><span class="k">Assigned by</span><span class="v" style="font-size:11.5px">${esc(userById(t.assignedBy)?.name || "—")}</span></div>` : ""}
            <div class="meta-row"><span class="k">Priority</span><span class="v">${isPM()
              ? `<select id="sel-priority">${PRIORITIES.map(x => `<option value="${x.id}" ${x.id === t.priority ? "selected" : ""}>${x.label}</option>`).join("")}</select>`
              : `<span class="pill ${p.cls}">${p.label}</span>`}</span></div>
            <div class="meta-row"><span class="k">Category</span><span class="v">${esc(t.category)}</span></div>
            <div class="meta-row"><span class="k">Requester</span><span class="v">${esc(t.requester)}</span></div>
            <div class="meta-row"><span class="k">Created</span><span class="v" style="font-size:11.5px">${fmtTime(t.created)}</span></div>
            <div class="meta-row"><span class="k">Last update</span><span class="v" style="font-size:11.5px">${ago(NOW - t.updated)} ago</span></div>
            ${t.verifiedBy ? `<div class="meta-row"><span class="k">Verified by</span><span class="v" style="font-size:11.5px;color:var(--green)">${esc(userById(t.verifiedBy)?.name || "—")}</span></div>` : ""}
            ${t.reopened ? `<div class="meta-row"><span class="k">Reopened</span><span class="v" style="font-size:11.5px;color:var(--amber)">${t.reopened}×</span></div>` : ""}
          </div>

          ${isQAVerify ? `<div style="display:flex;flex-direction:column;gap:7px;margin-top:10px">
            <button class="tb-btn ok" style="width:100%;justify-content:center" data-verify="${t.id}">${ICON.check} Verify & close</button>
            <button class="tb-btn warn" style="width:100%;justify-content:center" data-reopen="${t.id}">${ICON.reopen} Reopen — not actually solved</button>
          </div>` : ""}

          ${can(t, "reopen") && t.status === "closed" ? `<button class="tb-btn warn" style="width:100%;margin-top:10px;justify-content:center" data-reopen="${t.id}">${ICON.reopen} Reopen</button>` : ""}

          ${isPM() ? `<button class="tb-btn" style="width:100%;margin-top:10px;justify-content:center;color:var(--red);border-color:rgba(239,83,80,.3)" data-delete="${t.id}">${ICON.trash} Delete ticket</button>` : ""}
        </div>
      </div>
    </div>

    <div class="drawer-foot">
      <span style="font-size:11.5px;color:var(--text-3)">${footNote(t)}</span>
      <button class="tb-btn" style="margin-left:auto" data-close-drawer>Close</button>
    </div>`;
  bindDrawer(t);
}

function footNote(t) {
  if (isPM()) return "You have full control on this ticket.";
  if (isQA()) return t.status === "resolved" ? "Verify the fix or send it back with evidence." : "You can attach evidence and update status.";
  if (isLead()) return inMySquad(t) ? "You can delegate this within your squad and set the time box." : "Read-only — not your squad.";
  return t.assignee === state.user.id ? "You can update status, comment and attach files." : "Read-only.";
}

function closeDrawer() {
  $("#drawer-bg").classList.remove("on");
  $("#drawer").classList.remove("on");
  state.drawerTicket = null;
}

function bindDrawer(t) {
  $$("[data-close-drawer]").forEach(b => b.onclick = closeDrawer);

  const sel = $("#sel-status");
  if (sel) sel.onchange = () => {
    const v = sel.value;
    if (v === "blocked" || v === "hold") {
      askReason("Why is this " + (v === "blocked" ? "blocked" : "on hold") + "?", STUCK_REASONS, r => {
        const from = statusOf(t.status).label;
        t.status = v; t.stuck = r; t.updated = new Date();
        t.events.push({ t: new Date(), actor: state.user.id, kind: "b", text: `Status changed ${from} → ${statusOf(v).label} · ${r}` });
        toast(`${t.id} marked ${statusOf(v).label}`);
        render(); openTicket(t.id);
      }, () => { sel.value = t.status; });
    } else if (v === "resolved") {
      const from = statusOf(t.status).label;
      t.status = "resolved"; t.stuck = null; t.resolvedAt = new Date(); t.updated = new Date();
      t.events.push({ t: new Date(), actor: state.user.id, kind: "s", text: `Status changed ${from} → Resolved · now waiting on QA` });
      toast(`${t.id} resolved — sent to QA`);
      render(); openTicket(t.id);
    } else {
      const from = statusOf(t.status).label;
      t.status = v; t.stuck = null; t.updated = new Date();
      t.events.push({ t: new Date(), actor: state.user.id, kind: "s", text: `Status changed ${from} → ${statusOf(v).label}` });
      toast(`${t.id} → ${statusOf(v).label}`);
      render(); openTicket(t.id);
    }
  };

  const as = $("#sel-assignee");
  if (as) as.onchange = () => {
    const target = as.value || null;
    if (!target) {
      const prev = t.assignee;
      t.assignee = null; t.estimate = null; t.assignedAt = null; t.updated = new Date();
      t.events.push({ t: new Date(), actor: state.user.id, kind: "a", text: `Unassigned (was ${userById(prev)?.name || "—"})` });
      toast("Ticket unassigned");
      render(); openTicket(t.id);
      return;
    }
    openDelegate(t, target);
  };

  const pr = $("#sel-priority");
  if (pr) pr.onchange = () => {
    t.priority = pr.value; t.updated = new Date();
    t.events.push({ t: new Date(), actor: state.user.id, kind: "c", text: `Priority set to ${prioOf(pr.value).label}` });
    toast(`Priority → ${prioOf(pr.value).label}`);
    render(); openTicket(t.id);
  };

  const ac = $("[data-add-comment]");
  if (ac) ac.onclick = () => {
    const txt = $("#new-comment").value.trim();
    if (!txt) return toast("Write something first");
    const internal = $("#internal-flag").checked;
    t.events.push({ t: new Date(), actor: state.user.id, kind: "m", text: txt, internal });
    t.updated = new Date();
    toast(internal ? "Internal note added" : "Comment posted");
    render(); openTicket(t.id);
  };

  const ba = $("#btn-attach");
  const fi = $("#file-input");
  if (ba && fi) {
    ba.onclick = () => fi.click();
    fi.onchange = () => {
      const f = fi.files[0];
      if (!f) return;
      if (f.size > MAX_UPLOAD) return toast("File over 25 MB");
      t.attachments = t.attachments || [];
      t.attachments.push({ name: f.name, size: f.size, by: state.user.id, at: new Date() });
      t.events.push({ t: new Date(), actor: state.user.id, kind: "f", text: `Uploaded ${f.name}` });
      t.updated = new Date();
      toast(`${f.name} attached`);
      render(); openTicket(t.id);
    };
  }

  const vb = $("[data-verify]");
  if (vb) vb.onclick = () => verifyTicket(t);

  const rb = $("[data-reopen]");
  if (rb) rb.onclick = () => reopenTicket(t);

  const del = $("[data-delete]");
  if (del) del.onclick = () => {
    if (!confirm(`Delete ${t.id} permanently?`)) return;
    const i = TICKETS.findIndex(x => x.id === t.id);
    TICKETS.splice(i, 1);
    closeDrawer(); render();
    toast(`${t.id} deleted`);
  };
}

/* ---------------- VERIFY ---------------- */
function verifyTicket(t) {
  const m = document.createElement("div");
  m.className = "modal-bg on";
  m.innerHTML = `<div class="modal" style="max-width:520px">
    <div class="modal-head">
      <div class="modal-title">Verify ${t.id}</div>
      <button class="icon-btn" style="margin-left:auto" data-x>${ICON.close}</button>
    </div>
    <div class="modal-body">
      <p style="font-size:12.5px;color:var(--text-2);line-height:1.65;margin-bottom:14px">
        Confirm you actually reproduced the original problem and the fix holds. Your name goes on the close.
      </p>
      <div class="checklist">
        <label><input type="checkbox" data-chk> Reproduced the original issue before the fix</label>
        <label><input type="checkbox" data-chk> Confirmed the fix in the environment the user reported</label>
        <label><input type="checkbox" data-chk> Tested the edge case / adjacent flow</label>
        <label><input type="checkbox" data-chk> Attached evidence (screenshot, log or recording)</label>
      </div>
      <div class="field" style="margin-top:14px">
        <label>Verification note</label>
        <textarea id="v-note" placeholder="What you tested, on what, and the result…"></textarea>
      </div>
    </div>
    <div class="modal-foot">
      <button class="tb-btn" data-x>Cancel</button>
      <button class="tb-btn ok" id="v-confirm">${ICON.check} Verify & close</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  m.querySelectorAll("[data-x]").forEach(b => b.onclick = () => m.remove());

  m.querySelector("#v-confirm").onclick = () => {
    const note = m.querySelector("#v-note").value.trim();
    const checked = [...m.querySelectorAll("[data-chk]")].filter(c => c.checked).length;
    if (checked < 3) return toast("Tick at least 3 checks — no rubber stamping");
    t.status = "closed";
    t.verifiedBy = state.user.id;
    t.verifiedAt = new Date();
    t.updated = new Date();
    t.events.push({ t: new Date(), actor: state.user.id, kind: "v", text: `QA verified (${checked}/4 checks)${note ? " — " + note : ""}. Ticket closed.` });
    m.remove(); render(); openTicket(t.id);
    toast(`${t.id} verified and closed`);
  };
}

/* ---------------- REOPEN ---------------- */
function reopenTicket(t) {
  askReason("Why is this not actually solved?", REOPEN_REASONS, r => {
    const m = document.createElement("div");
    m.className = "modal-bg on";
    m.innerHTML = `<div class="modal" style="max-width:500px">
      <div class="modal-head">
        <div class="modal-title">Reopen ${t.id}</div>
        <button class="icon-btn" style="margin-left:auto" data-x>${ICON.close}</button>
      </div>
      <div class="modal-body">
        <div class="reason-chip">${ICON.reopen} ${esc(r)}</div>
        <div class="field"><label>What still fails?</label><textarea id="r-note" placeholder="Steps to reproduce, what you expected, what actually happened…"></textarea></div>
        <div class="field">
          <label>Evidence</label>
          <button class="tb-btn" id="r-attach" style="width:100%;justify-content:center">${ICON.clip} Attach a file</button>
          <input type="file" id="r-file" accept="${ACCEPT}" style="display:none">
          <div id="r-filelist" style="font-size:11.5px;color:var(--text-3);margin-top:6px">No file attached</div>
        </div>
        <div class="field">
          <label>Send back to</label>
          <select id="r-assignee">
            <option value="${t.assignee || ""}">${esc(userById(t.assignee)?.name || "Original developer")} (original)</option>
            ${t.assignedBy ? `<option value="${t.assignedBy}">${esc(userById(t.assignedBy)?.name || "Lead")} (lead)</option>` : ""}
          </select>
        </div>
      </div>
      <div class="modal-foot">
        <button class="tb-btn" data-x>Cancel</button>
        <button class="tb-btn warn" id="r-confirm">${ICON.reopen} Reopen ticket</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.querySelectorAll("[data-x]").forEach(b => b.onclick = () => m.remove());

    let file = null;
    const rf = m.querySelector("#r-file"), rl = m.querySelector("#r-filelist");
    m.querySelector("#r-attach").onclick = () => rf.click();
    rf.onchange = () => {
      file = rf.files[0] || null;
      rl.textContent = file ? `${file.name} (${fmtSize(file.size)})` : "No file attached";
    };

    m.querySelector("#r-confirm").onclick = () => {
      const note = m.querySelector("#r-note").value.trim();
      if (!note) return toast("Say what still fails — this is the whole point");
      const to = m.querySelector("#r-assignee").value || t.assignee;
      const from = statusOf(t.status).label;

      t.status = "progress";
      t.stuck = null;
      t.reopened = (t.reopened || 0) + 1;
      t.assignee = to || t.assignee;
      t.assignedAt = new Date();
      t.verifiedBy = null; t.verifiedAt = null;
      t.resolvedAt = null;
      t.updated = new Date();
      if (file) {
        t.attachments = t.attachments || [];
        t.attachments.push({ name: file.name, size: file.size, by: state.user.id, at: new Date() });
      }
      t.events.push({ t: new Date(), actor: state.user.id, kind: "r", text: `Reopened (${from} → In Progress) · ${r}\n${note}${file ? "\nAttachment: " + file.name : ""}` });
      m.remove(); render(); openTicket(t.id);
      toast(`${t.id} reopened and sent back`);
    };
  }, () => {});
}

/* ---------------- GENERIC REASON MODAL ---------------- */
function askReason(title, reasons, cb, onCancel) {
  const m = document.createElement("div");
  m.className = "modal-bg on";
  m.innerHTML = `<div class="modal" style="max-width:460px">
    <div class="modal-head"><div class="modal-title">${esc(title)}</div></div>
    <div class="modal-body">
      <p style="font-size:12.5px;color:var(--text-2);line-height:1.65;margin-bottom:14px">
        A status without a reason is a dead end. Pick one — it shows on the board so the right person knows to act.
      </p>
      <div class="dev-load">
        ${reasons.map(r => `<button class="dev-load-item" data-reason="${esc(r)}">
          <div class="dev-info"><div class="dev-name">${esc(r)}</div></div>
        </button>`).join("")}
      </div>
    </div>
    <div class="modal-foot"><button class="tb-btn" data-cancel>Cancel</button></div>
  </div>`;
  document.body.appendChild(m);
  m.querySelector("[data-cancel]").onclick = () => { m.remove(); onCancel && onCancel(); };
  m.querySelectorAll("[data-reason]").forEach(b => b.onclick = () => {
    const r = b.dataset.reason; m.remove(); cb(r);
  });
}

/* ---------------- DELEGATE (time box) ---------------- */
function openDelegate(t, targetId) {
  const target = userById(targetId);
  const isLeadAct = isLead();
  const prevEst = t.estimate || 4;

  const m = document.createElement("div");
  m.className = "modal-bg on";
  m.innerHTML = `<div class="modal" style="max-width:540px">
    <div class="modal-head">
      <div class="modal-title">${isLeadAct ? "Delegate" : "Assign"} ${t.id}</div>
      <button class="icon-btn" style="margin-left:auto" data-x>${ICON.close}</button>
    </div>
    <div class="modal-body">
      <div class="assign-target">
        <div class="avatar ${target.role} ${target.devRole || ""}" style="width:34px;height:34px;font-size:12px">${target.initials}</div>
        <div style="flex:1">
          <div style="font-size:13.5px;font-weight:600">${esc(target.name)}</div>
          <div style="font-size:11.5px;color:var(--text-3)">${esc(target.title)} · ${devLoad(target.id).count} active ticket${devLoad(target.id).count === 1 ? "" : "s"}</div>
        </div>
      </div>

      <div class="field" style="margin-top:16px">
        <label>Time box — how long to solve this? <span style="color:var(--red)">*</span></label>
        <div class="est-pick">
          ${ESTIMATES.map(h => `<button class="est-opt ${h === prevEst ? "on" : ""}" data-est="${h}">${h}h</button>`).join("")}
        </div>
        <div style="font-size:11.5px;color:var(--text-3);margin-top:8px">
          This is the budget the developer is held to. Burn is tracked live against it — no silent overruns.
        </div>
      </div>

      <div class="field">
        <label>Note to ${esc(target.name.split(" ")[0])}</label>
        <textarea id="d-note" placeholder="Context, constraints, where to start…"></textarea>
      </div>

      <div class="field">
        <label>Also set status</label>
        <select id="d-status">
          <option value="">Leave as ${statusOf(t.status).label}</option>
          <option value="progress">In Progress</option>
          <option value="open">Open</option>
        </select>
      </div>
    </div>
    <div class="modal-foot">
      <button class="tb-btn" data-x>Cancel</button>
      <button class="tb-btn primary" id="d-confirm">${isLeadAct ? "Delegate with time box" : "Assign"}</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  m.querySelectorAll("[data-x]").forEach(b => b.onclick = () => { m.remove(); render(); openTicket(t.id); });

  let est = prevEst;
  m.querySelectorAll("[data-est]").forEach(b => b.onclick = () => {
    est = Number(b.dataset.est);
    m.querySelectorAll("[data-est]").forEach(x => x.classList.toggle("on", x === b));
  });

  m.querySelector("#d-confirm").onclick = () => {
    const note = m.querySelector("#d-note").value.trim();
    const st = m.querySelector("#d-status").value;
    const prev = t.assignee;

    t.assignee = targetId;
    t.assignedBy = state.user.id;
    t.estimate = est;
    t.assignedAt = new Date();
    t.updated = new Date();
    if (st) { t.status = st; t.stuck = null; }

    const verb = isLeadAct ? "Delegated to" : "Assigned to";
    t.events.push({
      t: new Date(), actor: state.user.id, kind: "a",
      text: `${verb} ${target.name} · time box ${est}h${prev && prev !== targetId ? ` (was ${userById(prev)?.name})` : ""}${st ? ` · status ${statusOf(st).label}` : ""}${note ? "\n" + note : ""}`
    });
    m.remove(); render(); openTicket(t.id);
    toast(`${t.id} → ${target.name.split(" ")[0]} · ${est}h box`);
  };
}

/* ---------------- NEW TICKET ---------------- */
function openNewTicket() {
  const assignable = isQA() ? [] : USERS.filter(u => u.role === "dev");
  const m = document.createElement("div");
  m.className = "modal-bg on";
  m.innerHTML = `<div class="modal">
    <div class="modal-head"><div class="modal-title">New ticket</div><button class="icon-btn" style="margin-left:auto" data-x>${ICON.close}</button></div>
    <div class="modal-body">
      <div class="field"><label>Title</label><input id="n-title" placeholder="Short, specific — e.g. VPN drops every 15 min for finance"></div>
      <div class="field"><label>Description</label><textarea id="n-desc" placeholder="What's happening, who's affected, when it started, what's been tried"></textarea></div>
      <div class="field-row">
        <div class="field"><label>Priority</label><select id="n-priority">${PRIORITIES.map(p => `<option value="${p.id}" ${p.id === "medium" ? "selected" : ""}>${p.label}</option>`).join("")}</select></div>
        <div class="field"><label>Category</label><select id="n-cat">${CATEGORIES.map(c => `<option>${c}</option>`).join("")}</select></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Requester / department</label><input id="n-req" placeholder="e.g. Finance Dept"></div>
        <div class="field"><label>Assign to</label><select id="n-assignee">
          <option value="">Unassigned — PM will route it</option>
          ${assignable.map(u => `<option value="${u.id}">${esc(u.name)}${u.devRole === "lead" ? " (Lead)" : ""} — ${devLoad(u.id).count} active</option>`).join("")}
        </select></div>
      </div>
      <div class="field">
        <label>Evidence <span style="color:var(--text-3);font-weight:400">— optional</span></label>
        <button class="tb-btn" id="n-attach" style="width:100%;justify-content:center">${ICON.clip} Attach a screenshot or log</button>
        <input type="file" id="n-file" accept="${ACCEPT}" style="display:none">
        <div id="n-filelist" style="font-size:11.5px;color:var(--text-3);margin-top:6px">No file attached</div>
      </div>
      <div id="dup-warn"></div>
    </div>
    <div class="modal-foot">
      <button class="tb-btn" data-x>Cancel</button>
      <button class="tb-btn primary" id="n-create">Create ticket</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  m.querySelectorAll("[data-x]").forEach(b => b.onclick = () => m.remove());

  let file = null;
  const nf = m.querySelector("#n-file"), nl = m.querySelector("#n-filelist");
  m.querySelector("#n-attach").onclick = () => nf.click();
  nf.onchange = () => {
    file = nf.files[0] || null;
    nl.textContent = file ? `${file.name} (${fmtSize(file.size)})` : "No file attached";
  };

  const ti = m.querySelector("#n-title"), warn = m.querySelector("#dup-warn");
  ti.addEventListener("input", () => {
    const q = ti.value.toLowerCase().trim();
    if (q.length < 8) { warn.innerHTML = ""; return; }
    const words = q.split(/\s+/).filter(w => w.length > 3);
    const hit = TICKETS.find(t => {
      const tt = t.title.toLowerCase();
      return words.length && words.filter(w => tt.includes(w)).length >= Math.min(3, words.length);
    });
    warn.innerHTML = hit ? `<div style="background:var(--amber-soft);border:1px solid rgba(240,169,43,.3);border-radius:9px;padding:11px 13px;font-size:12px;color:#f5d79a">
      <b>Possible duplicate:</b> ${hit.id} — ${esc(hit.title)}
      <button class="tb-btn" style="margin-top:8px;padding:4px 9px;font-size:11px" data-open-dup="${hit.id}">Open that ticket</button>
    </div>` : "";
    const od = warn.querySelector("[data-open-dup]");
    if (od) od.onclick = () => { m.remove(); openTicket(hit.id); };
  });

  m.querySelector("#n-create").onclick = () => {
    const title = m.querySelector("#n-title").value.trim();
    if (!title) return toast("Title is required");
    const prio = m.querySelector("#n-priority").value;
    const t = {
      id: nextId(), title,
      desc: m.querySelector("#n-desc").value.trim() || "(no description)",
      status: "open",
      priority: prio,
      category: m.querySelector("#n-cat").value,
      assignee: m.querySelector("#n-assignee").value || null,
      assignedBy: m.querySelector("#n-assignee").value ? state.user.id : null,
      estimate: null, assignedAt: null,
      requester: m.querySelector("#n-req").value.trim() || "Internal",
      createdBy: state.user.id,
      created: new Date(), updated: new Date(),
      dueIn: prioOf(prio).sla,
      startedAt: null, attachments: [],
      events: [{ t: new Date(), actor: state.user.id, kind: "c", text: `Ticket created${isQA() ? " by QA" : ""}.` }],
    };
    if (file) {
      t.attachments.push({ name: file.name, size: file.size, by: state.user.id, at: new Date() });
      t.events.push({ t: new Date(), actor: state.user.id, kind: "f", text: `Uploaded ${file.name}` });
    }
    TICKETS.unshift(t);
    m.remove(); render();
    toast(`${t.id} created`);
  };
}

/* ---------------- BIND ---------------- */
function bindView() {
  $$("[data-ticket]").forEach(el => el.onclick = () => openTicket(el.dataset.ticket));
  $$("[data-view-jump]").forEach(el => el.onclick = () => { state.view = el.dataset.viewJump; render(); });
  $$("[data-verify]").forEach(el => el.onclick = e => { e.stopPropagation(); const t = TICKETS.find(x => x.id === el.dataset.verify); if (t) verifyTicket(t); });
  $$("[data-reopen]").forEach(el => el.onclick = e => { e.stopPropagation(); const t = TICKETS.find(x => x.id === el.dataset.reopen); if (t) reopenTicket(t); });

  const fs = $("#f-status"); if (fs) fs.onchange = () => { state.filter.status = fs.value; renderView(); };
  const fa = $("#f-assignee"); if (fa) fa.onchange = () => { state.filter.assignee = fa.value; renderView(); };
  const cd = $("#copy-digest");
  if (cd) cd.onclick = () => {
    const txt = $("#digest-body").innerText;
    navigator.clipboard?.writeText(txt).then(() => toast("Digest copied — paste into WhatsApp"), () => toast("Copy failed"));
  };
}

function render() {
  renderTopbar();
  renderSidebar();
  renderView();
  $$("[data-view]").forEach(b => b.onclick = () => { state.view = b.dataset.view; render(); });
  $$("[data-toggle]").forEach(b => b.onclick = () => {
    const k = b.dataset.toggle;
    if (k === "mine") state.filter.mine = !state.filter.mine;
    if (k === "crit") state.filter.priority = state.filter.priority === "critical" ? "all" : "critical";
    render();
  });
  $$("[data-new]").forEach(b => b.onclick = openNewTicket);
  $$("[data-logout]").forEach(b => b.onclick = () => {
    $("#app").classList.remove("on");
    $("#login").style.display = "flex";
    state.user = null;
    state.filter = { q: "", status: "all", priority: "all", assignee: "all", mine: false };
  });
}

/* ---------------- BOOT ---------------- */
function pickDeveloper() {
  const m = document.createElement("div");
  m.className = "modal-bg on";
  m.innerHTML = `<div class="modal" style="max-width:480px">
    <div class="modal-head"><div class="modal-title">Which developer?</div><button class="icon-btn" style="margin-left:auto" data-x>${ICON.close}</button></div>
    <div class="modal-body">
      <p style="font-size:12.5px;color:var(--text-2);line-height:1.65;margin-bottom:14px">
        Leads delegate to their own squad and set the time box. Developers work what they are given.
      </p>
      <div class="dev-load">
        ${USERS.filter(u => u.role === "dev").map(u => `<button class="dev-load-item" data-pick="${u.id}">
          <div class="avatar ${u.role} ${u.devRole || ""}" style="width:30px;height:30px;flex:0 0 30px;font-size:11px">${u.initials}</div>
          <div class="dev-info">
            <div class="dev-name">${esc(u.name)}</div>
            <div class="dev-meta">${esc(u.title)} · ${devLoad(u.id).count} active</div>
          </div>
          ${u.devRole === "lead" ? `<span class="lead-tag">LEAD</span>` : ""}
        </button>`).join("")}
      </div>
    </div>
    <div class="modal-foot"><button class="tb-btn" data-x>Cancel</button></div>
  </div>`;
  document.body.appendChild(m);
  m.querySelectorAll("[data-x]").forEach(b => b.onclick = () => m.remove());
  m.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => { m.remove(); login(b.dataset.pick); });
}

document.addEventListener("DOMContentLoaded", () => {
  $$(".role-btn").forEach(b => b.onclick = () => {
    if (b.dataset.role === "dev") return pickDeveloper();
    const u = USERS.find(x => x.role === b.dataset.role);
    if (u) login(u.id);
  });
  $("#drawer-bg").onclick = closeDrawer;
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
});
