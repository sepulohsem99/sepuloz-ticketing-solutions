# Sepuloz Ticketing

**IT support ticketing portal — three roles, one clear chain of accountability.**

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
| **All of them** | Treat "Resolved" as the end. Nobody checks whether the fix was real. |

## The roles

Three roles. That's the whole permission model.

### Project Manager
View, create, update, delete tickets, change status and priority, assign to any developer, full reporting.

### Developer — two levels

**Lead Developer** (one per squad)
- Receives tickets from the PM for the whole squad
- Delegates to their own team members only
- **Must set a time box** when delegating — how many hours this ticket is worth
- Sees the squad board with live load per person

**Developer**
- Receives delegated tickets
- Updates status, comments, attaches files
- Cannot assign, cannot delete, cannot see other squads' work
- Held to the time box their lead set

### QA Tester
- Creates tickets (proactive findings)
- Views all tickets
- Updates status
- **Uploads attachments** as evidence on any ticket
- **Verifies** resolved tickets against a 4-point checklist — minimum 3 checks or it refuses
- **Reopens** any ticket that was marked resolved but isn't actually fixed, with a reason, a description of what still fails, and evidence attached

**The gate:** a developer marking a ticket "Resolved" is a *claim*, not a fact. Nothing closes until QA signs it off. Reopened tickets go back to In Progress and are counted against the developer who claimed the fix.

## What makes this different

Seven things nobody in the OSS tier does, built into the mockup:

1. **The QA gate.** Resolved → awaiting verification → closed only on QA sign-off. Every other tool lets a developer close their own work. This one makes "done" mean something, and the QA report tracks reopen rate per developer — a quality signal that literally does not exist in osTicket or GLPI.

2. **Time box on delegation.** When a lead delegates, they must commit to an hour budget. The ticket then shows burn live — `5h / 6h`, `12h / 8h` in red. No more estimates that exist only in someone's head, and no silent overruns.

3. **Stuck-reason status.** Moving a ticket to Blocked or On Hold forces you to pick *what you're waiting on* (vendor / requester / access / dependency / environment). A status without a reason is a dead end — this turns a dead dropdown into a signal the PM can act on.

4. **Aging heatmap.** Every card carries a colour bar showing how long it has sat in its current status — not its priority. The ticket that quietly rotted for three days is the one that kills you, and priority tags never show it.

5. **One-click PM digest.** The daily status message every PM writes by hand, generated from live ticket state. Now includes time-box breaches and the QA verification queue.

6. **Load-aware delegation.** The assignee dropdown shows each person's live open count inline — `Priya — 3 · Wei Ming — 1`. Leads see their own squad only.

7. **Duplicate detection while typing.** Start typing a title and it matches against open tickets, offering "Open that ticket" before you create the 30th duplicate VPN complaint.

### Roadmap (not in the mockup)

- Auto-triage: suggest category, priority and assignee from the description
- Resolution knowledge capture — 2-line fix summary becomes searchable KB
- Email-to-ticket via Cloudflare Email Routing
- SLA pause while a ticket sits in Blocked
- Bulk actions, saved views per user
- WhatsApp/Telegram notification bridge
- Public intake form for people without an account

## Light & dark theme

Toggle in the topbar (in-app) and top-right corner (login screen). Choice persists in `localStorage`, applied on `<html data-theme>` before first paint so there is no flash. Default is dark; the first toggle is opt-in.

Both themes are token-driven from a single variable block — `:root` holds dark, `html[data-theme="light"]` overrides. No duplicated component CSS.

## Screens

| File | What it shows |
|---|---|
| `docs/screenshots/01-login.png` | Role picker — PM, Developer, QA |
| `docs/screenshots/02-pm-board.png` | PM team board — kanban with aging bars, SLA chips, time boxes |
| `docs/screenshots/03-pm-list.png` | All tickets table with time-box column |
| `docs/screenshots/04-pm-digest.png` | PM digest incl. time-box breaches and QA queue |
| `docs/screenshots/05-team-health.png` | Workload, categories, SLA, reopen count |
| `docs/screenshots/06-ticket-detail.png` | Ticket drawer — time box burn, attachments, timeline |
| `docs/screenshots/07-new-ticket-dup.png` | New ticket with duplicate detection |
| `docs/screenshots/08-stuck-reason.png` | Blocked-reason picker |
| `docs/screenshots/09-lead-squad.png` | Lead developer's squad board with live load |
| `docs/screenshots/10-delegate-timebox.png` | Delegate modal — mandatory time box picker |
| `docs/screenshots/11-dev-queue.png` | Developer prioritised queue with time-box burn |
| `docs/screenshots/12-qa-verify.png` | QA verification queue |
| `docs/screenshots/13-qa-checklist.png` | 4-point verification checklist |
| `docs/screenshots/14-qa-reopen.png` | Reopen flow with reason, evidence and routing |
| `docs/screenshots/15-qa-report.png` | Reopen rate per developer |
| `docs/screenshots/16-mobile-qa.png` | Mobile layout |
| `docs/screenshots/20-light-login.png` | Light theme — login |
| `docs/screenshots/21-light-pm-board.png` | Light theme — PM board |
| `docs/screenshots/22-light-pm-list.png` | Light theme — ticket table |
| `docs/screenshots/23-light-digest.png` | Light theme — PM digest |
| `docs/screenshots/24-light-ticket-detail.png` | Light theme — ticket drawer |
| `docs/screenshots/25-light-qa-verify.png` | Light theme — QA queue |
| `docs/screenshots/26-light-qa-checklist.png` | Light theme — verify checklist |
| `docs/screenshots/27-light-delegate.png` | Light theme — delegate modal |

## Run it

Static HTML/CSS/JS. No build step.

```bash
python -m http.server 8765
# open http://127.0.0.1:8765
```

Pick a role on the login screen. Everything is in-memory — refresh resets.

Demo accounts:

- **Project Manager** — Saifullah Muhamad
- **Developers** — Faiz Rahman (Backend Lead), Tan Wei Ming (Backend Dev), Hafiz Zulkifli (Infrastructure Lead), Priya Nair (Infra Dev)
- **QA Tester** — Aina Sofea

## Permission matrix

| Action | PM | Lead Dev | Dev | QA |
|---|:--:|:--:|:--:|:--:|
| View tickets | ✓ | squad | own | ✓ |
| Create ticket | ✓ | — | — | ✓ |
| Update title/desc | ✓ | squad | own | ✓ |
| Delete ticket | ✓ | — | — | — |
| Change status | ✓ | squad | own | ✓ |
| Change priority | ✓ | — | — | — |
| Assign / delegate | ✓ any | squad only | — | — |
| Set time box | ✓ | ✓ | — | — |
| Comment | ✓ | squad | own | ✓ |
| Attach files | ✓ | squad | own | ✓ any |
| Verify & close | — | — | — | ✓ |
| Reopen | — | — | — | ✓ |

## Structure

```
index.html              login + app shell
assets/css/app.css      design tokens + all components
assets/js/data.js       users, roles, statuses, mock tickets
assets/js/app.js        views, drawer, modals, permissions, digest
docs/RESEARCH.md        market research + feature gap analysis
docs/shots.py           Playwright screenshot script
docs/screenshots/       captured screens
```

## Production stack (planned)

Everything on Cloudflare, matching the `*.pages.dev` target:

- **Frontend** — this static build, or React + Vite if state grows
- **API** — Cloudflare Workers
- **Database** — D1 (SQLite)
- **Attachments** — R2 (25 MB cap per file, MIME allow-list)
- **Auth** — Cloudflare Access (Google SSO / email OTP), no password store to own
- **Email-to-ticket** — Cloudflare Email Routing → Worker

Zero servers to patch.

## Status

Mockup / prototype. Frontend only, no backend, no persistence. Built Oct 2026.
