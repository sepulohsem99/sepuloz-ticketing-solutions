# IT Ticketing Portal — Market Research

Research date: 28 Oct 2026. Sources listed at bottom.

## 1. What already exists

### Open-source self-hosted

| System | Stack | Strength | Weakness |
|---|---|---|---|
| **osTicket** | PHP + MySQL (GPL v2) | Email-to-ticket, departments, help topics, canned responses, SLA plans, runs on any LAMP box | Agent UI has aged badly; thin reporting; no asset inventory; slow releases |
| **GLPI** | PHP + MariaDB (GPL v3) | Strongest tickets + IT asset management; ITIL (incident/request/problem/change), SLA + OLA, approval workflows, real CMDB, agent-based auto inventory | Dense admin UI, long learning curve; plugin ecosystem uneven; best plugins paid (GLPI Network) |
| **Zammad** | Rails + PostgreSQL + Elasticsearch (AGPL v3) | Best modern agent UX; multi-channel intake (email, form, chat, telephony, social); fast full-text search | Heaviest to run (4 GB floor, 8 GB realistic); you also operate Elasticsearch |
| **FreeScout** | PHP/Laravel | Lightweight Zendesk-alike, mailbox-first | Module paywall creep |
| **UVdesk** | Symfony | Symfony ecosystem, e-commerce integrations | Smaller community |
| **Request Tracker (RT)** | Perl | Extremely stable, scriptable, best-in-class email workflow | CPAN dependency pain; dated UI |
| **Redmine** | Ruby | Issue tracker pressed into helpdesk | Not really a service desk |

### Commercial SaaS

- **Jira Service Management** — request types, queues, SLA policies with elapsed-time tracking, automated escalation rules, change management, asset/CMDB, Confluence-backed knowledge. Deep but configuration-heavy.
- **Freshservice** — purpose-built ITSM: incident/problem/change/release, service catalog, asset discovery, Freddy AI agent that raises and fulfils requests inside Slack/Teams, workflow automator.
- **Zendesk / Freshdesk** — customer-support shaped, weaker on internal IT constructs (assets, change, approvals).
- **HaloITSM, ManageEngine ServiceDesk Plus, SysAid** — mid-market ITSM, ITIL-aligned, asset-centric.

### What the whole category agrees is table stakes

1. Ticket CRUD with priority + category + requester
2. Assignment to an owner (single owner, no exceptions)
3. Status lifecycle (open → in progress → resolved → closed, with reopen)
4. Threaded conversation + internal notes (agents-only)
5. File attachments, inline images
6. SLA timer per priority/category + breach alerts
7. Escalation rules (time-based, reassign on no-movement)
8. Email-to-ticket and reply-by-email
9. Canned responses / macros
10. Search + saved views/queues ("Unassigned urgent", "My open")
11. Reporting: volume, resolution time, SLA compliance, per-agent load
12. Role separation: requester / agent / admin
13. Audit trail (who changed what, when)

### What the category is bad at (the gap)

- **osTicket/GLPI**: functional but ugly; PMs hate using them, so adoption dies and tickets move back to WhatsApp.
- **Jira/Freshservice**: powerful but 20+ screens of config before the first ticket; overkill and expensive per agent for a 5–20 person IT team.
- **All of them**: the *project manager* role is an afterthought. They model "agent" and "requester" but not "the person accountable for delivery who assigns work and reports upward". PMs end up exporting CSVs into Excel to report.
- **All of them**: status is a dropdown, not a story. Nobody can see at a glance *why* a ticket is stuck.
- **Most**: mobile experience is an afterthought; internal IT staff work from phones.

## 2. Our constraint set

Only two roles:

- **Project Manager** — view, create, update, delete tickets, update status, assign tickets
- **Developer** — receives assigned tickets, changes/updates status, works the ticket

This is deliberately simpler than ITSM's requester/agent/admin triad. That simplicity is the product: two roles, zero ambiguity, no permission matrix to configure.

## 3. Differentiators worth building

Ranked by impact-per-effort for a small IT team.

### Tier 1 — build into the mockup now

1. **Stuck-reason status** — status change requires picking *why* when moving to Blocked or On Hold (waiting on vendor / waiting on user / waiting on access / dependency). Turns a dead dropdown into a signal. Nobody in the OSS tier does this.
2. **Aging heatmap on the board** — colour intensity by time-in-current-status, not just priority. Instantly shows which ticket has quietly rotted.
3. **One-click PM digest** — auto-generated daily/weekly summary: what moved, what's blocked, what breached SLA, what's unassigned. Copy-paste-ready for a WhatsApp/email update. This is the single most-requested thing PMs do manually.
4. **Two-role clarity** — the UI literally changes by role. Developer sees "My queue". PM sees "Team board". No dead buttons, no greyed-out admin menus.
5. **Assignment with load awareness** — when a PM assigns, show each developer's current open count and avg resolution time inline. Prevents dumping on the fastest person.

### Tier 2 — next iteration

6. **SLA countdown on the ticket card**, not buried in a detail tab. Red ring when < 25% time left.
7. **Ticket timeline that reads like a story** — every event (created, assigned, status change, comment, attachment) in one vertical stream with actor avatars, not tabs.
8. **Canned responses with variables** (`{{requester}}`, `{{ticket_id}}`) — one click inserts a full reply.
9. **Bulk actions** — select 10 tickets, assign to one dev, change priority, close.
10. **Saved views per user** — "My blocked", "Unassigned > 24h", "Breached this week".

### Tier 3 — the standout bets

11. **Duplicate detection at creation** — as the PM types the title, semantic-match against open tickets and show "this looks like #1042". Kills the 30% duplicate volume every IT desk has.
12. **Auto-triage suggestion** — based on title/description, suggest category, priority and likely assignee. PM accepts with one click. Uses the historical pattern of similar resolved tickets.
13. **Resolution knowledge capture** — when a dev resolves, prompt for a 2-line fix summary; that becomes searchable internal KB automatically. Turns every ticket into documentation.
14. **Requester-free intake form** — a public (or intranet) form that creates a ticket without an account. Most internal IT requests still arrive as "boss forwarded an email".
15. **Weekly team health view** — open WIP per dev, avg age, reopened rate, SLA hit rate, top recurring category. One screen a PM can screenshot for management.
16. **WhatsApp/Telegram notification bridge** — push status changes to a group. Meets Malaysian teams where they actually are.

## 4. Recommended stack (for the real build, after mockup)

- **Frontend**: React + Vite + Tailwind, or Next.js if SSR matters
- **Backend**: Cloudflare Workers + D1 (SQLite) + R2 for attachments — matches the `*.pages.dev` hosting target, zero server ops
- **Auth**: Cloudflare Access (email OTP / Google SSO) — no password store to own
- **Email-to-ticket**: Cloudflare Email Routing → Worker
- **Realtime**: Durable Objects or simple polling

This keeps everything on Cloudflare, which is where `sepulozticketingsolutions.pages.dev` will live anyway.

## 5. Sources

- https://infronest.com/blog/open-source-ticketing-systems
- https://openmsp.ai/blog/open-source-helpdesk-ticketing-system
- https://ictdesk.net/blog/it-ticketing-system-open-source
- https://www.atlassian.com/software/jira/service-management/comparison/jira-service-management-vs-freshservice
- https://www.freshworks.com/freshservice/ticketing/
- https://www.atlassian.com/software/jira/service-management/features/itsm
- https://hiverhq.com/blog/slas-in-ticketing-software
- https://completefrontend.com/system-design/problems/support-dashboard
- https://developers.cloudflare.com/pages/configuration/custom-domains
