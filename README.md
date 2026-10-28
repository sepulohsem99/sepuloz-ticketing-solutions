# Sepuloz Ticketing

**IT support ticketing portal — two roles, zero ambiguity.**

Live mockup: https://sepulozticketingsolutions.pages.dev

---

## The problem

Every internal IT team in Malaysia runs on a WhatsApp group and a spreadsheet. When it grows past five people, tickets start getting lost, the PM becomes a human router, and nobody can answer "what's actually stuck right now?"

The existing tools force a bad trade:

| Option | Reality |
|---|---|
| **osTicket / GLPI** | Free and functional, but the agent UI has aged badly. PMs hate opening it, so tickets drift back to WhatsApp. |
| **Jira Service Management / Freshservice** | Powerful, but 20+ screens of configuration before the first ticket, and per-agent pricing that punishes small teams. |
| **All of them** | Model "agent" and "requester", but never "the person accountable for delivery". PMs still export CSVs into Excel to report upward. |

## The answer

Two roles. That's the whole permission model.

- **Project Manager** — view, create, update, delete tickets, change status, assign tickets, report
- **Developer** — receives assigned tickets, changes status, comments, works the queue

No requester role, no admin matrix, no greyed-out menus. The UI literally changes shape by role: a PM gets the team board, a developer gets a prioritised queue.

## What makes this different

Five things nobody in the OSS tier does, built into the mockup:

1. **Stuck-reason status.** Moving a ticket to Blocked or On Hold forces you to pick *what you're waiting on* (vendor / requester / access / dependency / environment). A status without a reason is a dead end — this turns a dead dropdown into a signal the PM can act on.

2. **Aging heatmap.** Every card carries a colour bar showing how long it has sat in its current status — not its priority. The ticket that quietly rotted for three days is the one that kills you, and priority tags never show it.

3. **One-click PM digest.** The daily status message every PM writes by hand, generated from live ticket state. Sections: at-a-glance counts, SLA breaches, unassigned, blocked-with-reason, what moved in 24h, developer load bars. Copy-paste ready for WhatsApp.

4. **Load-aware assignment.** When a PM assigns a ticket, the dropdown shows each developer's live open count inline — `Faiz (2) · Hafiz (4)`. Stops the fastest person getting buried.

5. **Duplicate detection while typing.** Start typing a title and it matches against open tickets, offering "Open that ticket" before you create the 30th duplicate VPN complaint.

### Roadmap (not in the mockup)

- Auto-triage: suggest category, priority and assignee from the description
- Resolution knowledge capture — 2-line fix summary becomes searchable KB
- Email-to-ticket via Cloudflare Email Routing
- Bulk actions, saved views per user
- WhatsApp/Telegram notification bridge
- Public intake form for people without an account

## Screens

| File | What it shows |
|---|---|
| `docs/screenshots/01-login.png` | Role picker |
| `docs/screenshots/02-pm-board.png` | PM team board — kanban with aging bars, SLA chips, stuck reasons |
| `docs/screenshots/03-pm-list.png` | All tickets table with filters |
| `docs/screenshots/04-pm-digest.png` | Generated PM digest |
| `docs/screenshots/05-team-health.png` | Workload balance, categories, SLA compliance |
| `docs/screenshots/06-ticket-detail.png` | Ticket drawer — timeline, metadata, role-aware controls |
| `docs/screenshots/07-new-ticket-dup.png` | New ticket with duplicate detection |
| `docs/screenshots/08-stuck-reason.png` | Blocked-reason picker |
| `docs/screenshots/09-dev-queue.png` | Developer prioritised queue |
| `docs/screenshots/10-mobile-dev.png` | Mobile layout |

## Run it

Static HTML/CSS/JS. No build step.

```bash
python -m http.server 8765
# open http://127.0.0.1:8765
```

Pick a role on the login screen. Everything is in-memory — refresh resets.

## Structure

```
index.html              login + app shell
assets/css/app.css      design tokens + all components
assets/js/data.js       users, statuses, priorities, mock tickets
assets/js/app.js        views, drawer, modals, digest generator
docs/RESEARCH.md        market research + feature gap analysis
docs/shots.py           Playwright screenshot script
docs/screenshots/       captured screens
```

## Production stack (planned)

Everything on Cloudflare, matching the `*.pages.dev` target:

- **Frontend** — this static build, or React + Vite if state grows
- **API** — Cloudflare Workers
- **Database** — D1 (SQLite)
- **Attachments** — R2
- **Auth** — Cloudflare Access (Google SSO / email OTP), no password store to own
- **Email-to-ticket** — Cloudflare Email Routing → Worker

Zero servers to patch.

## Status

Mockup / prototype. Frontend only, no backend, no persistence. Built Oct 2026.
