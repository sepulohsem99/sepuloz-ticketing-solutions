"""Capture light + dark theme screenshots."""
import asyncio, os
from playwright.async_api import async_playwright

BASE = "http://127.0.0.1:8765/index.html"
OUT = r"C:\Users\mrsai\projects\sepuloz-ticketing\docs\screenshots"
os.makedirs(OUT, exist_ok=True)

W, H = 1680, 1050


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": W, "height": H})
        pg = await ctx.new_page()

        async def shot(name, full=False):
            await pg.screenshot(path=os.path.join(OUT, name), full_page=full)
            print("saved", name)

        await pg.goto(BASE, wait_until="networkidle")
        await pg.wait_for_timeout(500)

        async def set_theme(t):
            await pg.evaluate(f"localStorage.setItem('sepuloz-theme','{t}')")
            await pg.goto(BASE, wait_until="networkidle")
            await pg.wait_for_timeout(700)

        # ---- LIGHT ----
        await set_theme("light")
        await shot("20-light-login.png")

        await pg.click('[data-role="pm"]')
        await pg.wait_for_timeout(1000)
        await shot("21-light-pm-board.png")

        await pg.click(".nav-item:has-text('All Tickets')")
        await pg.wait_for_timeout(700)
        await shot("22-light-pm-list.png")

        await pg.click(".nav-item:has-text('PM Digest')")
        await pg.wait_for_timeout(700)
        await shot("23-light-digest.png", full=True)

        await pg.click(".nav-item:has-text('Team Board')")
        await pg.wait_for_timeout(700)
        await pg.click('[data-ticket="TKT-1042"]')
        await pg.wait_for_timeout(900)
        await shot("24-light-ticket-detail.png")
        await pg.click("[data-close-drawer]")
        await pg.wait_for_timeout(400)

        # QA light
        await set_theme("light")
        await pg.click('[data-role="qa"]')
        await pg.wait_for_timeout(1000)
        await shot("25-light-qa-verify.png", full=True)

        await pg.click("[data-verify]")
        await pg.wait_for_timeout(800)
        await shot("26-light-qa-checklist.png")
        await pg.click(".modal-bg.on [data-x]")
        await pg.wait_for_timeout(400)

        # lead delegate light
        await set_theme("light")
        await pg.click('[data-role="dev"]')
        await pg.wait_for_timeout(600)
        await pg.click('[data-pick="u6"]')
        await pg.wait_for_timeout(900)
        await pg.click('[data-ticket="TKT-1039"]')
        await pg.wait_for_timeout(800)
        await pg.select_option("#sel-assignee", "u5")
        await pg.wait_for_timeout(900)
        await shot("27-light-delegate.png")

        # ---- DARK (regression check) ----
        await set_theme("dark")
        await pg.click('[data-role="pm"]')
        await pg.wait_for_timeout(1000)
        await shot("02-pm-board.png")

        await pg.click(".nav-item:has-text('All Tickets')")
        await pg.wait_for_timeout(700)
        await shot("03-pm-list.png")

        await pg.click(".nav-item:has-text('PM Digest')")
        await pg.wait_for_timeout(700)
        await shot("04-pm-digest.png", full=True)

        await pg.click(".nav-item:has-text('Team Health')")
        await pg.wait_for_timeout(700)
        await shot("05-team-health.png", full=True)

        await b.close()
        print("DONE")

asyncio.run(main())
