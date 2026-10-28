"""Capture mockup screenshots with Playwright (deterministic, no daemon)."""
import asyncio, os, sys
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

        # 06 ticket drawer
        await nav("Team Board")
        await pg.wait_for_timeout(500)
        await pg.click(".tcard")
        await pg.wait_for_timeout(900)
        await shot("06-ticket-detail.png")
        await pg.click("[data-close-drawer]")
        await pg.wait_for_timeout(500)

        # 07 new ticket with duplicate warning
        await pg.click("[data-new]")
        await pg.wait_for_timeout(600)
        await pg.fill("#n-title", "VPN drops every 15 minutes for finance team")
        await pg.wait_for_timeout(700)
        await shot("07-new-ticket-dup.png")
        await pg.click(".modal-bg.on [data-x]")
        await pg.wait_for_timeout(400)

        # 08 blocked-reason modal
        await pg.click(".tcard")
        await pg.wait_for_timeout(800)
        await pg.select_option("#sel-status", "blocked")
        await pg.wait_for_timeout(800)
        await shot("08-stuck-reason.png")
        await pg.click(".modal-bg.on [data-cancel]")
        await pg.wait_for_timeout(300)
        await pg.click("[data-close-drawer]")
        await pg.wait_for_timeout(400)

        # 09 dev queue
        await pg.click("[data-logout]")
        await pg.wait_for_timeout(600)
        await pg.click('[data-role="dev"]')
        await pg.wait_for_timeout(900)
        await shot("09-dev-queue.png")

        # 10 mobile
        await pg.set_viewport_size({"width": 430, "height": 900})
        await pg.wait_for_timeout(600)
        await shot("10-mobile-dev.png")

        await b.close()
        print("DONE")

asyncio.run(main())
