/* ============================================================
   Sepuloz IT Ticketing — app logic
   ============================================================ */

const ICON = {
  search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  board: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="7" height="18" rx="1.5"/><rect x="14" y="3" width="7" height="11" rx="1.5"/></svg>',
  list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  queue: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 2v4M12 18v4M4.9 4.9l2.9 2.9M16.2 16.2l2.9 2.9M2 12h4M18 12h4M4.9 19.1l2.9-2.9M16.2 7.8l2.9-2.9"/></svg>',
  digest: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  health: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 12h4l3 8 4-16 3 8h4"/></svg>',
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
  pm: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
  dev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>',
};

/* ---------------- LOGIN ---------------- */
function login(role) {
  state.user = USERS.find(u => u.role === role);
  state.view = role === "pm" ? "board" : "queue";
  $("#login").style.display = "none";
  $("#app").classList.add("on");
  render();
}

/* ---------------- SHELL ---------------- */
function navItems() {
  const isPM = state.user.role === "pm";
  const items = [];
  if (isPM) {
    items.push({ id: "board", label: "Team Board", icon: ICON.board, count: TICKETS.filter(t => t.status !== "resolved").length });
    items.push({ id: "list", label: "All Tickets", icon: ICON.list, count: TICKETS.length });
  } else {
    const mine = TICKETS.filter(t => t.assignee === state.user.id && t.status !== "resolved");
    items.push({ id: "queue", label: "My Queue", icon: ICON.queue, count: mine.length });
    items.push({ id: "list", label: "All Tickets", icon: ICON.list, count: TICKETS.length });
  }
  items.push({ id: "digest", label: isPM ? "PM Digest" : "Daily Summary", icon: ICON.digest });
  items.push({ id: "health", label: "Team Health", icon: ICON.health });
  return items;
}

function renderSidebar() {
  const items = navItems();
  const isPM = state.user.role === "pm";
  $("#sidebar").innerHTML = `
    <div class="nav-label">Workspace</div>
    ${items.map(i => `
      <button class="nav-item ${state.view === i.id ? "active" : ""}" data-view="${i.id}">
        ${i.icon}<span>${i.label}</span>
        ${i.count !== undefined ? `<span class="nav-count ${i.id === "board" && i.count > 8 ? "alert" : ""}">${i.count}</span>` : ""}
      </button>`).join("")}
    <div class="nav-label">Filters</div>
    <button class="nav-item ${state.filter.mine ? "active" : ""}" data-toggle="mine">
      ${ICON.user}<span>${isPM ? "Assigned to me" : "Only mine"}</span>
      <span class="tick">${ICON.check}</span>
    </button>
    <button class="nav-item ${state.filter.priority === "critical" ? "active" : ""}" data-toggle="crit">
      ${ICON.flag}<span>Critical only</span>
      <span class="tick">${ICON.check}</span>
    </button>
    <div class="side-foot">
      <button class="nav-item" data-logout>${ICON.out}<span>Switch role</span></button>
    </div>`;
}

function renderTopbar() {
  const u = state.user;
  const isPM = u.role === "pm";
  $("#topbar").innerHTML = `
    <div class="brand"><div class="brand-mark">S</div><span>Sepuloz Ticketing</span></div>
    <span class="role-chip ${isPM ? "" : "dev"}"><span class="dot"></span>${isPM ? "Project Manager" : "Developer"}</span>
    <div class="tb-search">
      ${ICON.search}
      <input id="q" placeholder="Search tickets, IDs, requesters…" value="${esc(state.filter.q)}">
    </div>
    <div class="tb-spacer"></div>
    ${isPM ? `<button class="tb-btn primary" data-new>${ICON.plus} New ticket</button>` : ""}
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
function tcard(t) {
  const st = statusOf(t.status), pr = prioOf(t.priority), s = slaState(t), a = userById(t.assignee);
  return `<div class="tcard ${ageClass(t)}" data-ticket="${t.id}">
    <div class="tcard-top">
      <span class="tid">${t.id}</span>
      <span class="pill ${pr.cls}">${pr.label}</span>
    </div>
    ${t.stuck ? `<div class="stuck-tag">${ICON.lock} ${esc(t.stuck)}</div>` : ""}
    <div class="tcard-title">${esc(t.title)}</div>
    <div class="tcard-foot">
      ${a ? `<div class="avatar ${a.role}" title="${esc(a.name)}">${a.initials}</div>` : `<span style="color:var(--text-3)">Unassigned</span>`}
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
  else if (v === "list") el.innerHTML = viewList();
  else if (v === "queue") el.innerHTML = viewQueue();
  else if (v === "digest") el.innerHTML = viewDigest();
  else if (v === "health") el.innerHTML = viewHealth();
  bindView();
}

function viewBoard() {
  const ts = visibleTickets();
  const isPM = state.user.role === "pm";
  const open = ts.filter(t => t.status === "open").length;
  const prog = ts.filter(t => t.status === "progress").length;
  const blocked = ts.filter(t => t.status === "blocked").length;
  const breached = ts.filter(t => slaState(t).cls === "breach").length;
  const unassigned = ts.filter(t => !t.assignee && t.status !== "resolved").length;

  return `
    <div class="page-head">
      <div>
        <div class="page-title">Team Board</div>
        <div class="page-sub">${isPM ? "Assign, prioritise and unblock. Colour bar = how long the ticket has sat untouched." : "Read-only overview of the team's board."}</div>
      </div>
      <div class="page-head-actions">
        <button class="tb-btn" data-view-jump="digest">${ICON.digest} PM Digest</button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat"><div class="stat-label">Open</div><div class="stat-val">${open}</div><div class="stat-meta">${unassigned} unassigned</div></div>
      <div class="stat p"><div class="stat-label">In Progress</div><div class="stat-val">${prog}</div><div class="stat-meta">across ${new Set(ts.filter(t=>t.status==="progress").map(t=>t.assignee)).size} developers</div></div>
      <div class="stat r"><div class="stat-label">Blocked</div><div class="stat-val">${blocked}</div><div class="stat-meta">${blocked ? "<b class='bad'>needs unblocking</b>" : "all clear"}</div></div>
      <div class="stat a"><div class="stat-label">SLA breached</div><div class="stat-val">${breached}</div><div class="stat-meta">${breached ? "<b class='bad'>escalate today</b>" : "<b>on track</b>"}</div></div>
    </div>

    <div class="board">
      ${STATUSES.map(s => {
        const col = ts.filter(t => t.status === s.id);
        return `<div class="board-col">
          <div class="col-head"><span class="pill ${s.cls}"><span class="dot"></span>${s.label}</span><span class="cnt">${col.length}</span></div>
          <div class="col-body">${col.map(tcard).join("") || `<div class="empty">Nothing here</div>`}</div>
        </div>`;
      }).join("")}
    </div>`;
}

function viewList() {
  const ts = visibleTickets().sort((a, b) => b.created - a.created);
  const isPM = state.user.role === "pm";
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
          ${USERS.filter(u => u.role === "dev").map(u => `<option value="${u.id}" ${state.filter.assignee === u.id ? "selected" : ""}>${u.name}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="panel">
      <table class="tbl">
        <thead><tr>
          <th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Category</th><th>SLA</th><th>Age</th>
        </tr></thead>
        <tbody>
        ${ts.map(t => {
          const s = statusOf(t.status), p = prioOf(t.priority), a = userById(t.assignee), sl = slaState(t);
          return `<tr data-ticket="${t.id}">
            <td class="tid">${t.id}</td>
            <td class="ttitle">${esc(t.title)}</td>
            <td><span class="pill ${s.cls}"><span class="dot"></span>${s.label}</span></td>
            <td><span class="pill ${p.cls}">${p.label}</span></td>
            <td>${a ? `<div style="display:flex;align-items:center;gap:7px"><div class="avatar ${a.role}" style="width:22px;height:22px;flex:0 0 22px;font-size:9px">${a.initials}</div>${esc(a.name.split(" ")[0])}</div>` : `<span style="color:var(--text-3)">—</span>`}</td>
            <td style="color:var(--text-2)">${esc(t.category)}</td>
            <td><span class="sla ${sl.cls}">${sl.txt}</span></td>
            <td style="color:var(--text-3)">${ago(NOW - t.created)}</td>
          </tr>`;
        }).join("") || `<tr><td colspan="8"><div class="empty">No tickets match these filters</div></td></tr>`}
        </tbody>
      </table>
    </div>`;
}

function viewQueue() {
  const mine = TICKETS.filter(t => t.assignee === state.user.id);
  const active = mine.filter(t => !["resolved", "closed"].includes(t.status));
  const blocked = mine.filter(t => t.status === "blocked" || t.status === "hold");
  const done = mine.filter(t => t.status === "resolved");

  // focus list: most urgent first — breached > blocked > priority > nearest deadline
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
        <div class="page-sub">${active.length} active · ${blocked.length} blocked or on hold · ${done.length} resolved · sorted by what needs you first</div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><div class="stat-label">Active</div><div class="stat-val">${active.length}</div><div class="stat-meta">your workload</div></div>
      <div class="stat r"><div class="stat-label">Blocked / Hold</div><div class="stat-val">${blocked.length}</div><div class="stat-meta">${blocked.length ? "<b class='bad'>tell your PM</b>" : "all clear"}</div></div>
      <div class="stat g"><div class="stat-label">Resolved</div><div class="stat-val">${done.length}</div><div class="stat-meta">this cycle</div></div>
      <div class="stat a"><div class="stat-label">SLA at risk</div><div class="stat-val">${active.filter(t => slaState(t).cls !== "ok").length}</div><div class="stat-meta">under 25% time left</div></div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <div class="panel-title">Work this next</div>
        <div class="panel-sub">breached first, then priority, then deadline</div>
      </div>
      <div class="panel-body" style="display:flex;flex-direction:column;gap:9px">
        ${focus.length ? focus.map((t, i) => {
          const s = statusOf(t.status), p = prioOf(t.priority), sl = slaState(t);
          return `<button class="tcard ${ageClass(t)}" data-ticket="${t.id}" style="text-align:left;display:flex;align-items:center;gap:13px;padding:13px 15px">
            <div style="font-family:var(--mono);font-size:16px;font-weight:700;color:var(--text-3);width:26px;flex:0 0 26px">${i + 1}</div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap">
                <span class="tid">${t.id}</span>
                <span class="pill ${p.cls}">${p.label}</span>
                <span class="pill ${s.cls}"><span class="dot"></span>${s.label}</span>
                ${t.stuck ? `<span class="stuck-tag" style="margin:0">${ICON.lock} ${esc(t.stuck)}</span>` : ""}
              </div>
              <div style="font-size:13.5px;font-weight:500;line-height:1.4">${esc(t.title)}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:5px">${esc(t.category)} · ${esc(t.requester)} · updated ${ago(NOW - t.updated)} ago</div>
            </div>
            <span class="sla ${sl.cls}" style="font-size:11px;padding:3px 9px">${sl.txt}</span>
          </button>`;
        }).join("") : `<div class="empty">Nothing assigned to you right now. Enjoy the quiet.</div>`}
      </div>
    </div>

    ${done.length ? `<div class="panel">
      <div class="panel-head"><div class="panel-title">Resolved by you</div><div class="panel-sub">${done.length} this cycle</div></div>
      <div class="panel-body" style="display:flex;flex-direction:column;gap:8px">
        ${done.map(t => `<button class="tcard" data-ticket="${t.id}" style="text-align:left;display:flex;align-items:center;gap:11px;padding:11px 14px;opacity:.78">
          <span class="pill resolved"><span class="dot"></span>Resolved</span>
          <span style="flex:1;font-size:12.5px">${esc(t.title)}</span>
          <span style="font-size:11px;color:var(--text-3)">${ago(NOW - t.updated)} ago</span>
        </button>`).join("")}
      </div>
    </div>` : ""}`;
}

/* ---------------- DIGEST ---------------- */
function cut(s, n) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

function buildDigest() {
  const active = TICKETS.filter(t => t.status !== "resolved");
  const moved = TICKETS.filter(t => NOW - t.updated < 24 * H && t.status !== "resolved");
  const blocked = TICKETS.filter(t => t.status === "blocked" || t.status === "hold");
  const breached = TICKETS.filter(t => slaState(t).cls === "breach");
  const unassigned = TICKETS.filter(t => !t.assignee && t.status !== "resolved");
  const resolved24 = TICKETS.filter(t => t.status === "resolved" && NOW - t.updated < 24 * H);

  const L = [];
  L.push(`<b>IT SUPPORT — DAILY DIGEST</b>`);
  L.push(`${NOW.toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`);
  L.push("");
  L.push(`<b>At a glance</b>`);
  L.push(`  Active tickets ......... ${active.length}`);
  L.push(`  Resolved last 24h ...... ${resolved24.length}`);
  L.push(`  Blocked / on hold ...... ${blocked.length}`);
  L.push(`  Unassigned ............. ${unassigned.length}`);
  L.push(`  SLA breached ........... ${breached.length}`);
  L.push("");
  if (breached.length) {
    L.push(`<b>⚠ SLA BREACHED — escalate now</b>`);
    breached.forEach(t => L.push(`  ${t.id}  ${cut(t.title, 46)}  (${userById(t.assignee)?.name.split(" ")[0] || "unassigned"})`));
    L.push("");
  }
  if (unassigned.length) {
    L.push(`<b>Unassigned — needs an owner</b>`);
    unassigned.forEach(t => L.push(`  ${t.id}  ${cut(t.title, 46)}  [${prioOf(t.priority).label}]`));
    L.push("");
  }
  if (blocked.length) {
    L.push(`<b>Blocked — waiting on someone else</b>`);
    blocked.forEach(t => L.push(`  ${t.id}  ${cut(t.title, 38)}  → ${t.stuck || "unspecified"}`));
    L.push("");
  }
  if (moved.length) {
    L.push(`<b>Moved in the last 24h</b>`);
    moved.forEach(t => L.push(`  ${t.id}  ${statusOf(t.status).label.padEnd(12)} ${cut(t.title, 42)}`));
    L.push("");
  }
  L.push(`<b>Developer load</b>`);
  USERS.filter(u => u.role === "dev").forEach(u => {
    const n = devLoad(u.id).count;
    const bar = "█".repeat(n) + "░".repeat(Math.max(0, 8 - n));
    L.push(`  ${u.name.padEnd(18)} ${bar} ${n}`);
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
      <div class="panel-body"><div class="digest" id="digest-body">${buildDigest()}</div></div>
    </div>
    <div class="panel">
      <div class="panel-head"><div class="panel-title">Why this matters</div></div>
      <div class="panel-body" style="color:var(--text-2);font-size:13px;line-height:1.75">
        Every PM on every IT team writes this message by hand, every morning, from memory and a spreadsheet.
        It is the single highest-frequency manual task in the role. Here it is generated in one click from the
        same data the board already holds — no export, no Excel, no guessing.
      </div>
    </div>`;
}

/* ---------------- HEALTH ---------------- */
function viewHealth() {
  const devs = USERS.filter(u => u.role === "dev");
  const cats = {};
  TICKETS.forEach(t => { cats[t.category] = (cats[t.category] || 0) + 1; });
  const catArr = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const maxCat = catArr[0]?.[1] || 1;
  const resolved = TICKETS.filter(t => t.status === "resolved");
  const reopen = 0;
  return `
    <div class="page-head">
      <div>
        <div class="page-title">Team Health</div>
        <div class="page-sub">One screen a PM can screenshot for management.</div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat g"><div class="stat-label">SLA compliance</div><div class="stat-val">${Math.round((TICKETS.filter(t=>slaState(t).cls!=="breach").length/TICKETS.length)*100)}%</div><div class="stat-meta">target 95%</div></div>
      <div class="stat"><div class="stat-label">Avg age (active)</div><div class="stat-val">${Math.round(TICKETS.filter(t=>t.status!=="resolved").reduce((s,t)=>s+(NOW-t.created)/H,0)/TICKETS.filter(t=>t.status!=="resolved").length)}h</div><div class="stat-meta">time since created</div></div>
      <div class="stat p"><div class="stat-label">Resolved</div><div class="stat-val">${resolved.length}</div><div class="stat-meta">this cycle</div></div>
      <div class="stat a"><div class="stat-label">Reopened</div><div class="stat-val">${reopen}</div><div class="stat-meta">${reopen ? "quality signal" : "<b>no rework</b>"}</div></div>
    </div>

    <div class="panel">
      <div class="panel-head"><div class="panel-title">Workload balance</div><div class="panel-sub">active tickets per developer</div></div>
      <div class="panel-body">
        ${devs.map(u => {
          const n = devLoad(u.id).count;
          const pct = Math.min(100, (n / 6) * 100);
          const cls = n >= 5 ? "hi" : n >= 3 ? "mid" : "";
          return `<div class="bar-row">
            <div class="avatar ${u.role}" style="width:22px;height:22px;flex:0 0 22px;font-size:9px">${u.initials}</div>
            <span class="lbl">${esc(u.name)}</span>
            <div class="bar-track"><div class="bar-fill ${cls}" style="width:${pct}%;background:${n>=5?"var(--red)":n>=3?"var(--amber)":"var(--green)"}"></div></div>
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
  const isPM = state.user.role === "pm";
  const a = userById(t.assignee);
  const s = statusOf(t.status), p = prioOf(t.priority), sl = slaState(t);

  $("#drawer-bg").classList.add("on");
  $("#drawer").classList.add("on");
  $("#drawer").innerHTML = `
    <div class="drawer-head">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
          <span class="tid">${t.id}</span>
          <span class="pill ${s.cls}"><span class="dot"></span>${s.label}</span>
          <span class="pill ${p.cls}">${p.label}</span>
          <span class="sla ${sl.cls}">${sl.txt}</span>
        </div>
        <div style="font-size:16px;font-weight:600;line-height:1.35">${esc(t.title)}</div>
      </div>
      <button class="icon-btn" data-close-drawer>${ICON.close}</button>
    </div>
    <div class="drawer-body">
      <div class="detail-grid">
        <div>
          <div class="detail-desc">${esc(t.desc)}</div>
          <div style="font-size:11.5px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px">Timeline</div>
          <div class="timeline">
            ${t.events.map(e => {
              const u = userById(e.actor);
              return `<div class="tl-item">
                <div class="tl-dot ${e.kind}">${e.kind === "m" ? ICON.msg : e.kind === "b" ? ICON.flag : ICON.check}</div>
                <div class="tl-head"><b>${esc(u?.name || "System")}</b><span style="color:var(--text-3);font-weight:400">${e.kind === "s" ? "changed status" : e.kind === "m" ? "commented" : e.kind === "b" ? "blocked ticket" : "created"}</span><span class="tl-time">${fmtTime(e.t)}</span></div>
                ${e.kind === "m" || e.kind === "b" ? `<div class="tl-body ${e.internal ? "internal" : ""}">${esc(e.text)}</div>` : `<div style="font-size:12px;color:var(--text-3)">${esc(e.text)}</div>`}
              </div>`;
            }).join("")}
          </div>
          ${isPM || t.assignee === state.user.id ? `
          <div style="margin-top:20px">
            <div class="field">
              <label>Add comment ${isPM ? '<span style="color:var(--text-3);font-weight:400">— tick "internal" to hide from requester</span>' : ""}</label>
              <textarea id="new-comment" placeholder="Type an update…"></textarea>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2);cursor:pointer">
                <input type="checkbox" id="internal-flag" style="width:auto"> Internal note
              </label>
              <button class="tb-btn primary" style="margin-left:auto" data-add-comment="${t.id}">Post comment</button>
            </div>
          </div>` : ""}
        </div>
        <div>
          <div class="meta-box">
            <div class="meta-row"><span class="k">Status</span><span class="v">${isPM || t.assignee === state.user.id ? `<select id="sel-status" style="background:var(--surface-2);border:1px solid var(--line);border-radius:6px;padding:3px 6px;font-size:11.5px">${STATUSES.map(x => `<option value="${x.id}" ${x.id === t.status ? "selected" : ""}>${x.label}</option>`).join("")}</select>` : `<span class="pill ${s.cls}">${s.label}</span>`}</span></div>
            ${t.stuck ? `<div class="meta-row"><span class="k">Stuck on</span><span class="v" style="color:var(--red);font-size:11.5px">${esc(t.stuck)}</span></div>` : ""}
            <div class="meta-row"><span class="k">Assignee</span><span class="v">${isPM ? `<select id="sel-assignee" style="background:var(--surface-2);border:1px solid var(--line);border-radius:6px;padding:3px 6px;font-size:11.5px"><option value="">Unassigned</option>${USERS.filter(u=>u.role==="dev").map(u=>`<option value="${u.id}" ${u.id===t.assignee?"selected":""}>${esc(u.name.split(" ")[0])} (${devLoad(u.id).count})</option>`).join("")}</select>` : (a ? esc(a.name) : "—")}</span></div>
            <div class="meta-row"><span class="k">Priority</span><span class="v">${isPM ? `<select id="sel-priority" style="background:var(--surface-2);border:1px solid var(--line);border-radius:6px;padding:3px 6px;font-size:11.5px">${PRIORITIES.map(x=>`<option value="${x.id}" ${x.id===t.priority?"selected":""}>${x.label}</option>`).join("")}</select>` : `<span class="pill ${p.cls}">${p.label}</span>`}</span></div>
            <div class="meta-row"><span class="k">Category</span><span class="v">${esc(t.category)}</span></div>
            <div class="meta-row"><span class="k">Requester</span><span class="v">${esc(t.requester)}</span></div>
            <div class="meta-row"><span class="k">Created</span><span class="v" style="font-size:11.5px">${fmtTime(t.created)}</span></div>
            <div class="meta-row"><span class="k">Last update</span><span class="v" style="font-size:11.5px">${ago(NOW - t.updated)} ago</span></div>
          </div>
          ${isPM ? `<button class="tb-btn" style="width:100%;margin-top:10px;justify-content:center;color:var(--red);border-color:rgba(239,83,80,.3)" data-delete="${t.id}">${ICON.trash} Delete ticket</button>` : ""}
        </div>
      </div>
    </div>
    <div class="drawer-foot">
      <span style="font-size:11.5px;color:var(--text-3)">${isPM ? "You have full control on this ticket." : "You can update status and comment on tickets assigned to you."}</span>
      <button class="tb-btn" style="margin-left:auto" data-close-drawer>Close</button>
    </div>`;
  bindDrawer(t);
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
      askStuckReason(v, reason => {
        t.status = v; t.stuck = reason; t.updated = new Date();
        t.events.push({ t: new Date(), actor: state.user.id, kind: "b", text: `Status changed → ${statusOf(v).label} · ${reason}` });
        toast(`${t.id} marked ${statusOf(v).label}`);
        render(); openTicket(t.id);
      });
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
    const prev = t.assignee;
    t.assignee = as.value || null;
    t.updated = new Date();
    const nm = t.assignee ? userById(t.assignee).name : "Unassigned";
    t.events.push({ t: new Date(), actor: state.user.id, kind: "c", text: `Reassigned ${prev ? userById(prev)?.name : "Unassigned"} → ${nm}` });
    toast(`Assigned to ${nm}`);
    render(); openTicket(t.id);
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

  const del = $("[data-delete]");
  if (del) del.onclick = () => {
    if (!confirm(`Delete ${t.id} permanently?`)) return;
    const i = TICKETS.findIndex(x => x.id === t.id);
    TICKETS.splice(i, 1);
    closeDrawer(); render();
    toast(`${t.id} deleted`);
  };
}

/* ---------------- STUCK REASON MODAL ---------------- */
function askStuckReason(status, cb) {
  const m = document.createElement("div");
  m.className = "modal-bg on";
  m.innerHTML = `<div class="modal" style="max-width:440px">
    <div class="modal-head"><div class="modal-title">Why is this ${status === "blocked" ? "blocked" : "on hold"}?</div></div>
    <div class="modal-body">
      <p style="font-size:12.5px;color:var(--text-2);line-height:1.65;margin-bottom:14px">
        A status without a reason is a dead end. Pick what you're waiting on — it shows on the board so the PM knows exactly who to chase.
      </p>
      <div class="dev-load">
        ${STUCK_REASONS.map(r => `<button class="dev-load-item" data-reason="${esc(r)}">
          <div class="dev-info"><div class="dev-name">${esc(r)}</div></div>
        </button>`).join("")}
      </div>
    </div>
    <div class="modal-foot"><button class="tb-btn" data-cancel>Cancel</button></div>
  </div>`;
  document.body.appendChild(m);
  m.querySelector("[data-cancel]").onclick = () => m.remove();
  m.querySelectorAll("[data-reason]").forEach(b => b.onclick = () => {
    const r = b.dataset.reason; m.remove(); cb(r);
  });
}

/* ---------------- NEW TICKET MODAL ---------------- */
function openNewTicket() {
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
        <div class="field"><label>Assign to</label><select id="n-assignee"><option value="">Unassigned</option>${USERS.filter(u => u.role === "dev").map(u => `<option value="${u.id}">${esc(u.name)} — ${devLoad(u.id).count} active</option>`).join("")}</select></div>
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
    const t = {
      id: nextId(), title,
      desc: m.querySelector("#n-desc").value.trim() || "(no description)",
      status: "open",
      priority: m.querySelector("#n-priority").value,
      category: m.querySelector("#n-cat").value,
      assignee: m.querySelector("#n-assignee").value || null,
      requester: m.querySelector("#n-req").value.trim() || "Internal",
      createdBy: state.user.id,
      created: new Date(), updated: new Date(),
      dueIn: prioOf(m.querySelector("#n-priority").value).sla,
      startedAt: null,
      events: [{ t: new Date(), actor: state.user.id, kind: "c", text: "Ticket created" + (m.querySelector("#n-assignee").value ? " and assigned" : "") + "." }],
    };
    TICKETS.unshift(t);
    m.remove(); render();
    toast(`${t.id} created`);
  };
}

/* ---------------- BIND ---------------- */
function bindView() {
  $$("[data-ticket]").forEach(el => el.onclick = () => openTicket(el.dataset.ticket));
  $$("[data-view-jump]").forEach(el => el.onclick = () => { state.view = el.dataset.viewJump; render(); });
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
    state.user = null; state.filter = { q: "", status: "all", priority: "all", assignee: "all", mine: false };
  });
}

/* ---------------- BOOT ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  $$(".role-btn").forEach(b => b.onclick = () => login(b.dataset.role));
  $("#drawer-bg").onclick = closeDrawer;
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
});
