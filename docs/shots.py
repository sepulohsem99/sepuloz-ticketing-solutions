"""Capture mockup screenshots with Playwright (deterministic, no daemon)."""
import asyncio, os
from playwright.async_api import async_playwright

BASE = "http://127.0.0.1:8765/index.html"
OUT = r"C:\Users\mrsai\projects\sepuloz-ticketing\docs\screenshots"
os.makedirs(OUT, exist_ok=True)

W, H = 1680, 1050


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)

        async def shot(name, full=False):
            print("STEP", name)
            await pg.screenshot(path=os.path.join(OUT, name), full_page=full)
            print("saved", name)

        async def goto():
            await pg.goto(BASE, wait_until="networkidle")
            await pg.wait_for_timeout(700)

        async def nav(label):
            await pg.click(f".nav-item:has-text('{label}')")
            await pg.wait_for_timeout(700)

        # 01 login
        await goto()
        await shot("01-login.png")

        # 02 PM board
        await pg.click('[data-role="pm"]')
        await pg.wait_for_timeout(1000)
        await shot("02-pm-board.png")

        # 03 list
        await nav("All Tickets")
        await shot("03-pm-list.png")

        # 04 digest
        await nav("PM Digest")
        await shot("04-pm-digest.png", full=True)
        digest_txt = await pg.inner_text("#digest-body")
        with open(os.path.join(OUT, "digest.txt"), "w", encoding="utf-8") as f:
            f.write(digest_txt)

        # 05 health
        await nav("Team Health")
        await shot("05-team-health.png", full=True)

        # 06 ticket drawer with time box
        await nav("Team Board")
        await pg.wait_for_timeout(500)
        await pg.click('[data-ticket="TKT-1042"]')
        await pg.wait_for_timeout(900)
        await shot("06-ticket-detail.png")
        await pg.click("[data-close-drawer]")
        await pg.wait_for_timeout(500)

        # 07 new ticket with duplicate warning
        await pg.click("[data-new]")
        await pg.wait_for_timeout(600)
        await pg.fill("#n-title", "VPN keeps disconnecting every 15 minutes for finance team")
        await pg.wait_for_timeout(700)
        await shot("07-new-ticket-dup.png")
        await pg.click(".modal-bg.on [data-x]")
        await pg.wait_for_timeout(400)

        # 08 blocked-reason modal
        await pg.click('[data-ticket="TKT-1031"]')
        await pg.wait_for_timeout(800)
        await pg.select_option("#sel-status", "blocked")
        await pg.wait_for_timeout(800)
        await shot("08-stuck-reason.png")
        await pg.click(".modal-bg.on [data-cancel]")
        await pg.wait_for_timeout(300)
        await pg.click("[data-close-drawer]")
        await pg.wait_for_timeout(400)

        # 09 lead squad board
        await goto()
        await pg.click('[data-role="dev"]')
        await pg.wait_for_timeout(600)
        await pg.click('[data-pick="u6"]')
        await pg.wait_for_timeout(900)
        await shot("09-lead-squad.png", full=True)

        # 10 delegate with time box
        await pg.click('[data-ticket="TKT-1039"]')
        await pg.wait_for_timeout(800)
        await pg.select_option("#sel-assignee", "u5")
        await pg.wait_for_timeout(900)
        await shot("10-delegate-timebox.png")
        await pg.click(".modal-bg.on [data-x]")
        await pg.wait_for_timeout(400)
        await pg.click("[data-close-drawer]")
        await pg.wait_for_timeout(400)

        # 11 dev queue
        await goto()
        await pg.click('[data-role="dev"]')
        await pg.wait_for_timeout(600)
        await pg.click('[data-pick="u5"]')
        await pg.wait_for_timeout(900)
        await shot("11-dev-queue.png", full=True)

        # 12 QA verification queue
        await goto()
        await pg.click('[data-role="qa"]')
        await pg.wait_for_timeout(900)
        await shot("12-qa-verify.png", full=True)

        # 13 QA verify checklist
        await pg.click("[data-verify]")
        await pg.wait_for_timeout(800)
        await shot("13-qa-checklist.png")
        await pg.click(".modal-bg.on [data-x]")
        await pg.wait_for_timeout(400)

        # 14 QA reopen
        await pg.click("[data-reopen]")
        await pg.wait_for_timeout(700)
        await pg.click("[data-reason]:has-text('Fix only partial')")
        await pg.wait_for_timeout(800)
        await pg.fill("#r-note", "Still fails on the 4th machine — add-in loads then hangs after 30 seconds.")
        await pg.wait_for_timeout(400)
        await shot("14-qa-reopen.png")
        await pg.click(".modal-bg.on [data-x]")
        await pg.wait_for_timeout(400)

        # 15 QA report
        await pg.click('[data-view="report"]')
        await pg.wait_for_timeout(700)
        await shot("15-qa-report.png", full=True)

        # 16 mobile
        await pg.set_viewport_size({"width": 430, "height": 932})
        await goto()
        await pg.click('[data-role="qa"]')
        await pg.wait_for_timeout(900)
        await shot("16-mobile-qa.png", full=True)

        await b.close()
        print("DONE")

asyncio.run(main())