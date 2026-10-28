import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1680, "height": 1050})
        await pg.goto("http://127.0.0.1:8765/index.html", wait_until="networkidle")
        await pg.wait_for_timeout(700)
        await pg.click('[data-role="dev"]')
        await pg.wait_for_timeout(800)
        print("modals:", await pg.eval_on_selector_all(".modal-bg.on", "els=>els.length"))
        print("picks:", await pg.eval_on_selector_all("[data-pick]", "els=>els.map(e=>e.dataset.pick)"))
        html = await pg.eval_on_selector(".modal-bg.on .modal-body", "e=>e.innerText.slice(0,300)")
        print("body:", html)
        await pg.screenshot(path=r"C:\Users\mrsai\projects\sepuloz-ticketing\docs\screenshots\_debug.png")
        await b.close()

asyncio.run(main())
