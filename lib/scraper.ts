import { chromium } from 'playwright'

export async function scrapePage(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    // Wait a bit for JS-heavy pages to settle
    await page.waitForTimeout(2000)

    const text = await page.evaluate(() => {
      // Remove scripts, styles, nav, footer to get meaningful content
      const remove = document.querySelectorAll(
        'script, style, noscript, nav, footer, header'
      )
      remove.forEach((el) => el.remove())
      return document.body.innerText
    })

    // Normalise whitespace
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .join('\n')
  } finally {
    await browser.close()
  }
}
