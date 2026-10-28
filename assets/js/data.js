/* ============================================================
   Sepuloz IT Ticketing — mock data layer
   Roles: project manager (pm) · developer (dev) · QA tester (qa)
   Developers carry devRole "lead" | "dev" and belong to a squad.
   ============================================================ */

const NOW = new Date("2026-10-28T14:20:00+08:00");
const H = 3600e3, D = 24 * H;

const USERS = [
  { id: "u1", name: "Saifullah Muhamad", initials: "SM", role: "pm", title: "Project Manager" },
  { id: "u2", name: "Nurul Aisyah",      initials: "NA", role: "pm", title: "Project Manager" },

  /* Backend squad */
  { id: "u3", name: "Faiz Rahman",  initials: "FR", role: "dev", devRole: "lead", title: "Backend Lead",        squad: "Backend" },
  { id: "u4", name: "Tan Wei Ming", initials: "TW", role: "dev", devRole: "dev",  title: "Backend Developer",   squad: "Backend", leadId: "u3" },

  /* Infrastructure squad */
  { id: "u6", name: "Hafiz Zulkifli", initials: "HZ", role: "dev", devRole: "lead", title: "Infrastructure Lead", squad: "Infrastructure" },
  { id: "u5", name: "Priya Nair",     initials: "PN", role: "dev", devRole: "dev",  title: "Infra Developer",     squad: "Infrastructure", leadId: "u6" },

  { id: "u7", name: "Aina Sofea", initials: "AS", role: "qa", title: "QA Tester" },
];

const STATUSES = [
  { id: "open",     label: "Open",        cls: "open" },
  { id: "progress", label: "In Progress", cls: "prog" },
  { id: "blocked",  label: "Blocked",     cls: "blocked" },
  { id: "hold",     label: "On Hold",     cls: "hold" },
  { id: "resolved", label: "Resolved",    cls: "resolved" },
  { id: "closed",   label: "Closed",      cls: "closed" },
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

const REOPEN_REASONS = [
  "Issue still reproducible", "Fix only partial", "Wrong environment tested",
  "Regression found", "Requirement not met", "Other (state it in note)",
];

/* Lead's time box when delegating, in hours */
const ESTIMATES = [1, 2, 4, 6, 8, 12, 16, 24, 40];

const ACCEPT = ".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.log,.csv,.xlsx,.docx,.zip,.mp4,.json,.har";
const MAX_UPLOAD = 25 * 1024 * 1024;

let seq = 1042;
function nextId() { return "TKT-" + (++seq); }

function ago(ms) {
  if (ms < 0) ms = 0;
  if (ms < H) return Math.max(1, Math.round(ms / 60000)) + "m";
  if (ms < D) return Math.round(ms / H) + "h";
  return Math.round(ms / D) + "d";
}

const TICKETS = [
  {
    id: "TKT-1042", title: "VPN drops every 15 minutes for finance team",
    desc: "Since Monday, users in the Finance department are disconnected from the VPN roughly every 15 minutes. Affects 8 users. Reconnecting works but drops again. Started after the FortiGate firmware push on Sunday.",
    status: "progress", priority: "critical", category: "Network & VPN",
    assignee: "u5", assignedBy: "u6", estimate: 6, assignedAt: new Date(NOW - 5 * H),
    requester: "Finance Dept", createdBy: "u1",
    created: new Date(NOW - 6 * H), updated: new Date(NOW - 40 * 60000),
    dueIn: 4 * H, startedAt: new Date(NOW - 5 * H),
    attachments: [{ name: "fortigate-log-28oct.txt", size: 184320, by: "u5", at: new Date(NOW - 4 * H) }],
    events: [
      { t: new Date(NOW - 6 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Infrastructure squad." },
      { t: new Date(NOW - 5 * H), actor: "u6", kind: "a", text: "Delegated to Priya Nair · time box 6h" },
      { t: new Date(NOW - 5 * H), actor: "u5", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 4 * H), actor: "u5", kind: "f", text: "Uploaded fortigate-log-28oct.txt" },
      { t: new Date(NOW - 4 * H), actor: "u5", kind: "m", text: "Confirmed FortiGate 7.4.3 has a known IKE rekey bug. Testing rollback on the standby unit first." },
      { t: new Date(NOW - 40 * 60000), actor: "u1", kind: "m", text: "Finance MD is asking for an ETA. Please update by 5pm.", internal: true },
    ],
  },
  {
    id: "TKT-1041", title: "New staff onboarding — laptop + AD account for 3 hires",
    desc: "Three new joiners start Monday. Need AD accounts, email, laptop provisioning and access to the shared drive. Names and start dates in the attached sheet.",
    status: "open", priority: "high", category: "Access & Permissions",
    assignee: null, assignedBy: null, estimate: null, assignedAt: null,
    requester: "HR Dept", createdBy: "u2",
    created: new Date(NOW - 9 * H), updated: new Date(NOW - 9 * H),
    dueIn: -1 * H, startedAt: null, attachments: [],
    events: [
      { t: new Date(NOW - 9 * H), actor: "u2", kind: "c", text: "Ticket created. Awaiting assignment." },
    ],
  },
  {
    id: "TKT-1040", title: "Production DB slow queries after index rebuild",
    desc: "Reports module taking 40s+ since the index maintenance window. Suspect missing composite index on transactions table.",
    status: "progress", priority: "critical", category: "Database",
    assignee: "u4", assignedBy: "u3", estimate: 4, assignedAt: new Date(NOW - 20 * H),
    requester: "Ops", createdBy: "u1",
    created: new Date(NOW - 1 * D - 3 * H), updated: new Date(NOW - 2 * H),
    dueIn: 2 * H, startedAt: new Date(NOW - 20 * H),
    attachments: [{ name: "explain-analyze.txt", size: 42000, by: "u4", at: new Date(NOW - 3 * H) }],
    events: [
      { t: new Date(NOW - 1 * D - 3 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Backend squad." },
      { t: new Date(NOW - 22 * H), actor: "u3", kind: "a", text: "Delegated to Tan Wei Ming · time box 4h" },
      { t: new Date(NOW - 20 * H), actor: "u4", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 3 * H), actor: "u4", kind: "f", text: "Uploaded explain-analyze.txt" },
      { t: new Date(NOW - 2 * H), actor: "u4", kind: "m", text: "EXPLAIN ANALYZE shows seq scan on 4.2M rows. Drafting index migration, will test on replica first." },
    ],
  },
  {
    id: "TKT-1039", title: "Printer on level 3 not reachable from VLAN 20",
    desc: "Kyocera at level 3 can't be pinged from VLAN 20 workstations. Print jobs queue and fail.",
    status: "blocked", priority: "medium", category: "Network & VPN",
    assignee: "u5", assignedBy: "u6", estimate: 8, assignedAt: new Date(NOW - 2 * D),
    requester: "Admin", createdBy: "u2",
    created: new Date(NOW - 2 * D), updated: new Date(NOW - 6 * H),
    dueIn: 18 * H, startedAt: new Date(NOW - 2 * D + 2 * H),
    stuck: "Waiting on vendor", attachments: [],
    events: [
      { t: new Date(NOW - 2 * D), actor: "u2", kind: "c", text: "Ticket created and assigned to Infrastructure squad." },
      { t: new Date(NOW - 2 * D + 1 * H), actor: "u6", kind: "a", text: "Delegated to Priya Nair · time box 8h" },
      { t: new Date(NOW - 2 * D + 2 * H), actor: "u5", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 6 * H), actor: "u5", kind: "b", text: "Status changed In Progress → Blocked · Waiting on vendor" },
      { t: new Date(NOW - 6 * H), actor: "u5", kind: "m", text: "Vendor confirms ACL misconfiguration on their side. Ticket raised with them, ref VND-88213." },
    ],
  },
  {
    id: "TKT-1038", title: "HR portal SSO returns 500 after cert renewal",
    desc: "After renewing the SAML signing certificate, the HR portal throws 500 on SSO callback. Manual login still works.",
    status: "closed", priority: "high", category: "Software / App",
    assignee: "u4", assignedBy: "u3", estimate: 6, assignedAt: new Date(NOW - 3 * D),
    requester: "HR Dept", createdBy: "u1",
    created: new Date(NOW - 3 * D), updated: new Date(NOW - 1 * D),
    dueIn: 0, startedAt: new Date(NOW - 3 * D + 1 * H),
    verifiedBy: "u7", verifiedAt: new Date(NOW - 20 * H),
    resolvedAt: new Date(NOW - 1 * D), attachments: [],
    events: [
      { t: new Date(NOW - 3 * D), actor: "u1", kind: "c", text: "Ticket created and assigned to Backend squad." },
      { t: new Date(NOW - 3 * D), actor: "u3", kind: "a", text: "Delegated to Tan Wei Ming · time box 6h" },
      { t: new Date(NOW - 3 * D + 1 * H), actor: "u4", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 1 * D), actor: "u4", kind: "s", text: "Status changed In Progress → Resolved" },
      { t: new Date(NOW - 1 * D), actor: "u4", kind: "m", text: "Root cause: old cert thumbprint still cached in IdP metadata. Cleared cache + re-imported metadata." },
      { t: new Date(NOW - 20 * H), actor: "u7", kind: "v", text: "QA verified — SSO login tested on 3 browsers, no 500. Closed." },
    ],
  },
  {
    id: "TKT-1037", title: "Request: add MFA to vendor portal accounts",
    desc: "Security wants MFA enforced on all 14 vendor portal accounts before the audit on 5 Nov.",
    status: "hold", priority: "medium", category: "Security Incident",
    assignee: "u5", assignedBy: "u6", estimate: 12, assignedAt: new Date(NOW - 4 * D),
    requester: "Security", createdBy: "u2",
    created: new Date(NOW - 4 * D), updated: new Date(NOW - 2 * D),
    dueIn: 40 * H, startedAt: new Date(NOW - 3 * D),
    stuck: "Waiting on access/approval", attachments: [],
    events: [
      { t: new Date(NOW - 4 * D), actor: "u2", kind: "c", text: "Ticket created and assigned to Infrastructure squad." },
      { t: new Date(NOW - 4 * D), actor: "u6", kind: "a", text: "Delegated to Priya Nair · time box 12h" },
      { t: new Date(NOW - 2 * D), actor: "u5", kind: "s", text: "Status changed In Progress → On Hold · Waiting on access/approval" },
      { t: new Date(NOW - 2 * D), actor: "u5", kind: "m", text: "Need vendor admin credentials from procurement before we can enable MFA." },
    ],
  },
  {
    id: "TKT-1036", title: "Backup job failing on file server FS-02",
    desc: "Nightly Veeam job fails at 82% with 'insufficient space on target'. Retention policy may need review.",
    status: "open", priority: "high", category: "Deployment",
    assignee: "u6", assignedBy: "u1", estimate: 6, assignedAt: new Date(NOW - 20 * H),
    requester: "Ops", createdBy: "u1",
    created: new Date(NOW - 20 * H), updated: new Date(NOW - 20 * H),
    dueIn: -6 * H, startedAt: null, attachments: [],
    events: [
      { t: new Date(NOW - 20 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Hafiz Zulkifli (lead) · time box 6h." },
    ],
  },
  {
    id: "TKT-1035", title: "Excel add-in crashes on Windows 11 24H2",
    desc: "Finance reporting add-in crashes Excel on 3 machines after the 24H2 update. Event log shows faulting module msvcr120.dll.",
    status: "resolved", priority: "low", category: "Software / App",
    assignee: "u4", assignedBy: "u3", estimate: 8, assignedAt: new Date(NOW - 5 * D),
    requester: "Finance Dept", createdBy: "u7",
    created: new Date(NOW - 5 * D), updated: new Date(NOW - 3 * H),
    dueIn: 60 * H, startedAt: new Date(NOW - 4 * D),
    resolvedAt: new Date(NOW - 3 * H), attachments: [
      { name: "eventlog-crash.png", size: 512000, by: "u7", at: new Date(NOW - 5 * D) },
      { name: "fix-notes.md", size: 2048, by: "u4", at: new Date(NOW - 3 * H) },
    ],
    events: [
      { t: new Date(NOW - 5 * D), actor: "u7", kind: "c", text: "Ticket created from QA regression run." },
      { t: new Date(NOW - 5 * D), actor: "u7", kind: "f", text: "Uploaded eventlog-crash.png" },
      { t: new Date(NOW - 4 * D), actor: "u3", kind: "a", text: "Delegated to Tan Wei Ming · time box 8h" },
      { t: new Date(NOW - 4 * D), actor: "u4", kind: "s", text: "Status changed Open → In Progress" },
      { t: new Date(NOW - 3 * H), actor: "u4", kind: "s", text: "Status changed In Progress → Resolved" },
      { t: new Date(NOW - 3 * H), actor: "u4", kind: "m", text: "Add-in bundles an old VC++ 2013 runtime. Installed side-by-side VC++ 2015-2022 redistributable. Excel stable on all 3 machines." },
    ],
  },
  {
    id: "TKT-1034", title: "Mailbox quota alerts for 6 users",
    desc: "Six users at 95% of 50GB mailbox quota. Need archive policy or quota increase approved.",
    status: "closed", priority: "low", category: "Email",
    assignee: "u5", assignedBy: "u6", estimate: 4, assignedAt: new Date(NOW - 6 * D),
    requester: "Admin", createdBy: "u1",
    created: new Date(NOW - 6 * D), updated: new Date(NOW - 2 * D),
    dueIn: 0, startedAt: new Date(NOW - 6 * D),
    verifiedBy: "u7", verifiedAt: new Date(NOW - 44 * H),
    resolvedAt: new Date(NOW - 46 * H), attachments: [],
    events: [
      { t: new Date(NOW - 6 * D), actor: "u1", kind: "c", text: "Ticket created and assigned to Infrastructure squad." },
      { t: new Date(NOW - 6 * D), actor: "u6", kind: "a", text: "Delegated to Priya Nair · time box 4h" },
      { t: new Date(NOW - 46 * H), actor: "u5", kind: "s", text: "Status changed In Progress → Resolved" },
      { t: new Date(NOW - 44 * H), actor: "u7", kind: "v", text: "QA verified — quotas at 61% average across all 6 mailboxes." },
    ],
  },
  {
    id: "TKT-1033", title: "Guest WiFi captive portal shows expired certificate",
    desc: "Guests see a certificate warning before the captive portal loads. Started after the SSL cert expired on 24 Oct.",
    status: "open", priority: "medium", category: "Network & VPN",
    assignee: null, assignedBy: null, estimate: null, assignedAt: null,
    requester: "Front Desk", createdBy: "u7",
    created: new Date(NOW - 28 * H), updated: new Date(NOW - 28 * H),
    dueIn: 8 * H, startedAt: null, attachments: [],
    events: [
      { t: new Date(NOW - 28 * H), actor: "u7", kind: "c", text: "Ticket created from QA smoke test. Awaiting assignment." },
    ],
  },
  {
    id: "TKT-1032", title: "Deploy v2.4.1 to staging — approval needed",
    desc: "Release candidate ready. Needs PM sign-off before staging deploy window tonight 10pm.",
    status: "hold", priority: "high", category: "Deployment",
    assignee: "u3", assignedBy: "u1", estimate: 2, assignedAt: new Date(NOW - 30 * H),
    requester: "Dev Team", createdBy: "u1",
    created: new Date(NOW - 30 * H), updated: new Date(NOW - 5 * H),
    dueIn: 6 * H, startedAt: new Date(NOW - 28 * H),
    stuck: "Waiting on access/approval", attachments: [],
    events: [
      { t: new Date(NOW - 30 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Faiz Rahman (lead) · time box 2h." },
      { t: new Date(NOW - 5 * H), actor: "u3", kind: "s", text: "Status changed In Progress → On Hold · Waiting on access/approval" },
      { t: new Date(NOW - 5 * H), actor: "u3", kind: "m", text: "Waiting for change advisory approval. Deploy window is tonight 10pm." },
    ],
  },
  {
    id: "TKT-1031", title: "Laptop battery swelling — 2 units, level 4",
    desc: "Two Dell 5420 units with swollen batteries reported by users. Safety risk, need replacement scheduled.",
    status: "progress", priority: "critical", category: "Hardware",
    assignee: "u6", assignedBy: "u1", estimate: 4, assignedAt: new Date(NOW - 12 * H),
    requester: "Admin", createdBy: "u1",
    created: new Date(NOW - 12 * H), updated: new Date(NOW - 1 * H),
    dueIn: 3 * H, startedAt: new Date(NOW - 10 * H),
    attachments: [{ name: "battery-photo.jpg", size: 1240000, by: "u7", at: new Date(NOW - 11 * H) }],
    events: [
      { t: new Date(NOW - 12 * H), actor: "u1", kind: "c", text: "Ticket created and assigned to Hafiz Zulkifli (lead) · time box 4h." },
      { t: new Date(NOW - 11 * H), actor: "u7", kind: "f", text: "Uploaded battery-photo.jpg" },
      { t: new Date(NOW - 11 * H), actor: "u7", kind: "m", text: "Attached photo of both swollen units for the warranty claim." },
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

function fmtSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
  return (b / 1024 / 1024).toFixed(1) + " MB";
}

/* SLA */
function slaState(t) {
  if (t.status === "resolved") return { cls: "verify", txt: "awaiting QA" };
  if (t.status === "closed") return { cls: "ok", txt: "closed" };
  const total = prioOf(t.priority).sla;
  const left = t.dueIn;
  if (left <= 0) return { cls: "breach", txt: "SLA +" + ago(-left) };
  const pct = left / total;
  return { cls: pct < 0.25 ? "warn" : "ok", txt: ago(left) + " left" };
}

/* Estimate burn — has the assignee blown the time box they were given? */
function estState(t) {
  if (!t.estimate || !t.assignedAt) return null;
  const end = (t.status === "resolved" || t.status === "closed") ? (t.resolvedAt || t.updated) : NOW;
  const used = Math.max(0, (end - t.assignedAt) / H);
  const over = used > t.estimate;
  return {
    used: Math.round(used * 10) / 10,
    est: t.estimate,
    over,
    pct: Math.min(100, Math.round((used / t.estimate) * 100)),
    cls: over ? "breach" : used > t.estimate * 0.75 ? "warn" : "ok",
  };
}

function ageClass(t) {
  if (t.status === "resolved" || t.status === "closed") return "";
  const h = (NOW - t.updated) / H;
  if (h > 48) return "age-critical";
  if (h > 24) return "age-hot";
  if (h > 8) return "age-warm";
  return "";
}

function devLoad(uid) {
  const active = TICKETS.filter(t => t.assignee === uid && ["open", "progress", "blocked", "hold"].includes(t.status));
  return { count: active.length, tickets: active };
}

function mySquad(leadId) {
  const lead = userById(leadId);
  const members = USERS.filter(u => u.role === "dev" && u.leadId === leadId);
  return [lead, ...members].filter(Boolean);
}

/* who may this user assign to */
function assignableFor(user) {
  if (!user) return [];
  if (user.role === "pm") return USERS.filter(u => u.role === "dev");
  if (user.role === "dev" && user.devRole === "lead") return mySquad(user.id);
  return [];
}

function toast(msg) {
  let el = $("#toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add("on"));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("on"), 2300);
}
