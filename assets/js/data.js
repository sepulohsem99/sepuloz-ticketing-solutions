/* ============================================================
   Sepuloz IT Ticketing — mock data layer
   Two roles only: project manager (pm) and developer (dev)
   ============================================================ */

const NOW = new Date("2026-10-28T14:20:00+08:00");
const H = 3600e3, D = 24 * H;

const USERS = [
  { id: "u1", name: "Saifullah Muhamad", initials: "SM", role: "pm",  title: "Project Manager" },
  { id: "u2", name: "Nurul Aisyah",      initials: "NA", role: "pm",  title: "Project Manager" },
  { id: "u3", name: "Faiz Rahman",       initials: "FR", role: "dev", title: "Backend Developer" },
  { id: "u4", name: "Tan Wei Ming",      initials: "TW", role: "dev", title: "Frontend Developer" },
  { id: "u5", name: "Priya Nair",        initials: "PN", role: "dev", title: "Full-stack Developer" },
  { id: "u6", name: "Hafiz Zulkifli",    initials: "HZ", role: "dev", title: "DevOps Engineer" },
];

const STATUSES = [
  { id: "open",     label: "Open",        cls: "open" },
  { id: "progress", label: "In Progress", cls: "prog" },
  { id: "blocked",  label: "Blocked",     cls: "blocked" },
  { id: "hold",     label: "On Hold",     cls: "hold" },
  { id: "resolved", label: "Resolved",    cls: "resolved" },
];

const PRIORITIES = [
  { id: "critical", label: "Critical", cls: "p-crit", sla: 4 * H },
  { id: "high",     label: "High",     cls: "p-high", sla: 8 * H },
  { id: "medium",   label: "Medium",   cls: "p-med",  sla: 24 * H },
  { id: "low",      label: "Low",      cls: "p-low",  sla: 72 * H },
];

const CATEGORIES = [
  "Access & Permissions", "Network & VPN", "Hardware", "Software / App",
  "Database", "Deployment", "Email", "Security Incident",
];

const STUCK_REASONS = [
  "Waiting on vendor", "Waiting on requester", "Waiting on access/approval",
  "Waiting on dependency", "Environment down", "Other (state it in note)",
];

let seq = 1042;
function nextId() { return "TKT-" + (++seq); }

function ago(ms) {
  if (ms < H) return Math.max(1, Math.round(ms / 60000)) + "m";
  if (ms < D) return Math.round(ms / H) + "h";
  return Math.round(ms / D) + "d";
}

const TICKETS = [
  {
    id: "TKT-1042", title: "VPN drops every 15 minutes for finance team",
    desc: "Since Monday, users in the Finance department are disconnected from the VPN roughly every 15 minutes. Affects 8 users. Reconnecting works but drops again. Started after the FortiGate firmware push on Sunday.",
    status: "progress", priority: "critical", category: "Network & VPN",
    assignee: "u6", requester: "Finance Dept", createdBy: "u1",
    created: new Date(NOW - 6 * H), updated: new Date(NOW - 40 * 60000),
    dueIn: 4 * H, startedAt: new Date(NOW - 5 * H),
    events: [
      { t: new Date(NOW - 6 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Hafiz." },
      { t: new Date(NOW - 5 * H), actor: "u6", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 4 * H), actor: "u6", kind: "m", text: "Confirmed FortiGate 7.4.3 has a known IKE rekey bug. Testing rollback on the standby unit first." },
      { t: new Date(NOW - 40 * 60000), actor: "u1", kind: "m", text: "Finance MD is asking for an ETA. Please update by 5pm.", internal: true },
    ],
  },
  {
    id: "TKT-1041", title: "New staff onboarding — laptop + AD account for 3 hires",
    desc: "Three new joiners start Monday. Need AD accounts, email, laptop provisioning and access to the shared drive. Names and start dates in the attached sheet.",
    status: "open", priority: "high", category: "Access & Permissions",
    assignee: null, requester: "HR Dept", createdBy: "u2",
    created: new Date(NOW - 9 * H), updated: new Date(NOW - 9 * H),
    dueIn: -1 * H, startedAt: null,
    events: [
      { t: new Date(NOW - 9 * H), actor: "u2", kind: "c", text: "Ticket created. Awaiting assignment." },
    ],
  },
  {
    id: "TKT-1040", title: "Production DB slow queries after index rebuild",
    desc: "Reports module taking 40s+ since the index maintenance window. Suspect missing composite index on transactions table.",
    status: "progress", priority: "critical", category: "Database",
    assignee: "u3", requester: "Ops", createdBy: "u1",
    created: new Date(NOW - 1 * D - 3 * H), updated: new Date(NOW - 2 * H),
    dueIn: 2 * H, startedAt: new Date(NOW - 20 * H),
    events: [
      { t: new Date(NOW - 1 * D - 3 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Faiz." },
      { t: new Date(NOW - 20 * H), actor: "u3", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 2 * H), actor: "u3", kind: "m", text: "EXPLAIN ANALYZE shows seq scan on 4.2M rows. Drafting index migration, will test on replica first." },
    ],
  },
  {
    id: "TKT-1039", title: "Printer on level 3 not reachable from VLAN 20",
    desc: "Kyocera at level 3 can't be pinged from VLAN 20 workstations. Print jobs queue and fail.",
    status: "blocked", priority: "medium", category: "Network & VPN",
    assignee: "u6", requester: "Admin", createdBy: "u2",
    created: new Date(NOW - 2 * D), updated: new Date(NOW - 6 * H),
    dueIn: 18 * H, startedAt: new Date(NOW - 2 * D + 2 * H),
    stuck: "Waiting on vendor",
    events: [
      { t: new Date(NOW - 2 * D), actor: "u2", kind: "c", text: "Ticket created and assigned to Hafiz." },
      { t: new Date(NOW - 2 * D + 2 * H), actor: "u6", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 6 * H), actor: "u6", kind: "b", text: "Status changed In Progress → Blocked · Waiting on vendor" },
      { t: new Date(NOW - 6 * H), actor: "u6", kind: "m", text: "Vendor confirms ACL misconfiguration on their side. Ticket raised with them, ref VND-88213." },
    ],
  },
  {
    id: "TKT-1038", title: "HR portal SSO returns 500 after cert renewal",
    desc: "After renewing the SAML signing certificate, the HR portal throws 500 on SSO callback. Manual login still works.",
    status: "resolved", priority: "high", category: "Software / App",
    assignee: "u4", requester: "HR Dept", createdBy: "u1",
    created: new Date(NOW - 3 * D), updated: new Date(NOW - 1 * D),
    dueIn: 0, startedAt: new Date(NOW - 3 * D + 1 * H),
    events: [
      { t: new Date(NOW - 3 * D), actor: "u1", kind: "c", text: "Ticket created and assigned to Wei Ming." },
      { t: new Date(NOW - 3 * D + 1 * H), actor: "u4", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 1 * D), actor: "u4", kind: "s", text: "Status changed In Progress → Resolved" },
      { t: new Date(NOW - 1 * D), actor: "u4", kind: "m", text: "Root cause: old cert thumbprint still cached in IdP metadata. Cleared cache + re-imported metadata. Verified with HR." },
    ],
  },
  {
    id: "TKT-1037", title: "Request: add MFA to vendor portal accounts",
    desc: "Security wants MFA enforced on all 14 vendor portal accounts before the audit on 5 Nov.",
    status: "hold", priority: "medium", category: "Security Incident",
    assignee: "u5", requester: "Security", createdBy: "u2",
    created: new Date(NOW - 4 * D), updated: new Date(NOW - 2 * D),
    dueIn: 40 * H, startedAt: new Date(NOW - 3 * D),
    stuck: "Waiting on access/approval",
    events: [
      { t: new Date(NOW - 4 * D), actor: "u2", kind: "c", text: "Ticket created and assigned to Priya." },
      { t: new Date(NOW - 2 * D), actor: "u5", kind: "s", text: "Status changed In Progress → On Hold · Waiting on access/approval" },
      { t: new Date(NOW - 2 * D), actor: "u5", kind: "m", text: "Need vendor admin credentials from procurement before we can enable MFA." },
    ],
  },
  {
    id: "TKT-1036", title: "Backup job failing on file server FS-02",
    desc: "Nightly Veeam job fails at 82% with 'insufficient space on target'. Retention policy may need review.",
    status: "open", priority: "high", category: "Deployment",
    assignee: "u6", requester: "Ops", createdBy: "u1",
    created: new Date(NOW - 20 * H), updated: new Date(NOW - 20 * H),
    dueIn: -6 * H, startedAt: null,
    events: [
      { t: new Date(NOW - 20 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Hafiz." },
    ],
  },
  {
    id: "TKT-1035", title: "Excel add-in crashes on Windows 11 24H2",
    desc: "Finance reporting add-in crashes Excel on 3 machines after the 24H2 update. Event log shows faulting module msvcr120.dll.",
    status: "progress", priority: "low", category: "Software / App",
    assignee: "u4", requester: "Finance Dept", createdBy: "u2",
    created: new Date(NOW - 5 * D), updated: new Date(NOW - 3 * H),
    dueIn: 60 * H, startedAt: new Date(NOW - 4 * D),
    events: [
      { t: new Date(NOW - 5 * D), actor: "u2", kind: "c", text: "Ticket created and assigned to Wei Ming." },
      { t: new Date(NOW - 3 * H), actor: "u4", kind: "m", text: "Reproduced on one machine. Add-in bundles an old VC++ 2013 runtime. Testing side-by-side install." },
    ],
  },
  {
    id: "TKT-1034", title: "Mailbox quota alerts for 6 users",
    desc: "Six users at 95% of 50GB mailbox quota. Need archive policy or quota increase approved.",
    status: "resolved", priority: "low", category: "Email",
    assignee: "u5", requester: "Admin", createdBy: "u1",
    created: new Date(NOW - 6 * D), updated: new Date(NOW - 2 * D),
    dueIn: 0, startedAt: new Date(NOW - 6 * D),
    events: [
      { t: new Date(NOW - 6 * D), actor: "u1", kind: "c", text: "Ticket created and assigned to Priya." },
      { t: new Date(NOW - 2 * D), actor: "u5", kind: "s", text: "Status changed In Progress → Resolved" },
      { t: new Date(NOW - 2 * D), actor: "u5", kind: "m", text: "Enabled 3-year archive policy for the 6 users. Quota now at 61% average." },
    ],
  },
  {
    id: "TKT-1033", title: "Guest WiFi captive portal shows expired certificate",
    desc: "Guests see a certificate warning before the captive portal loads. Started after the SSL cert expired on 24 Oct.",
    status: "open", priority: "medium", category: "Network & VPN",
    assignee: null, requester: "Front Desk", createdBy: "u2",
    created: new Date(NOW - 28 * H), updated: new Date(NOW - 28 * H),
    dueIn: 8 * H, startedAt: null,
    events: [
      { t: new Date(NOW - 28 * H), actor: "u2", kind: "c", text: "Ticket created. Awaiting assignment." },
    ],
  },
  {
    id: "TKT-1032", title: "Deploy v2.4.1 to staging — approval needed",
    desc: "Release candidate ready. Needs PM sign-off before staging deploy window tonight 10pm.",
    status: "hold", priority: "high", category: "Deployment",
    assignee: "u3", requester: "Dev Team", createdBy: "u1",
    created: new Date(NOW - 30 * H), updated: new Date(NOW - 5 * H),
    dueIn: 6 * H, startedAt: new Date(NOW - 28 * H),
    stuck: "Waiting on access/approval",
    events: [
      { t: new Date(NOW - 30 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Faiz." },
      { t: new Date(NOW - 5 * H), actor: "u3", kind: "s", text: "Status changed In Progress → On Hold · Waiting on access/approval" },
      { t: new Date(NOW - 5 * H), actor: "u3", kind: "m", text: "Waiting for change advisory approval. Deploy window is tonight 10pm." },
    ],
  },
  {
    id: "TKT-1031", title: "Laptop battery swelling — 2 units, level 4",
    desc: "Two Dell 5420 units with swollen batteries reported by users. Safety risk, need replacement scheduled.",
    status: "progress", priority: "critical", category: "Hardware",
    assignee: "u6", requester: "Admin", createdBy: "u1",
    created: new Date(NOW - 12 * H), updated: new Date(NOW - 1 * H),
    dueIn: 3 * H, startedAt: new Date(NOW - 10 * H),
    events: [
      { t: new Date(NOW - 12 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Hafiz." },
      { t: new Date(NOW - 10 * H), actor: "u6", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 1 * H), actor: "u6", kind: "m", text: "Devices quarantined and powered off. Dell warranty claim submitted, replacement ETA 2 days." },
    ],
  },
];

/* ---------------- state ---------------- */
const state = {
  user: null,
  view: "board",
  selected: null,
  drawerTicket: null,
  filter: { q: "", status: "all", priority: "all", assignee: "all", mine: false },
  savedView: null,
};

/* ---------------- helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const userById = id => USERS.find(u => u.id === id);
const statusOf = id => STATUSES.find(s => s.id === id);
const prioOf = id => PRIORITIES.find(p => p.id === id);

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtTime(d) {
  return d.toLocaleString("en-MY", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
}

/* SLA: remaining = dueIn; classify */
function slaState(t) {
  if (t.status === "resolved" || t.status === "closed") return { cls: "ok", txt: "done" };
  const p = prioOf(t.priority);
  const total = p.sla;
  const left = t.dueIn;
  if (left <= 0) return { cls: "breach", txt: "SLA +" + ago(-left) };
  const pct = left / total;
  return { cls: pct < 0.25 ? "warn" : "ok", txt: ago(left) + " left" };
}

/* age in current status → heat */
function ageClass(t) {
  const h = (NOW - t.updated) / H;
  if (t.status === "resolved") return "";
  if (h > 48) return "age-critical";
  if (h > 24) return "age-hot";
  if (h > 8) return "age-warm";
  return "";
}

/* load per developer: open + in-progress + blocked */
function devLoad(uid) {
  const active = TICKETS.filter(t => t.assignee === uid && ["open", "progress", "blocked", "hold"].includes(t.status));
  return { count: active.length, tickets: active };
}

function toast(msg) {
  let el = $("#toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add("on"));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("on"), 2200);
}
