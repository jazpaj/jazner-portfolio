// Screenshots the live client sites listed in scripts/sites.json:
//   public/sites/thumbs/<slug>.jpeg  3:4 card (barrel + grid)
//   public/sites/full/<slug>.jpeg    full page, capped, for the preview modal
//   public/home/sites-<slug>.jpeg    small copy for the Home bento
// Writes each page's <title> back to scripts/sites.titles.json.
// Run: node scripts/shoot-sites.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const pub = join(process.cwd(), 'public')
const sites = JSON.parse(readFileSync('scripts/sites.json', 'utf8'))
for (const d of ['sites/thumbs', 'sites/full', 'home']) mkdirSync(join(pub, d), { recursive: true })

const browser = await chromium.launch()
const titles = {}
for (const { slug, url } of sites) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1920 } })
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  } catch {
    /* slow trackers: shoot what has rendered */
  }
  await page.waitForTimeout(2500)
  // Scroll through once so lazy images and reveal animations load.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1200)
  titles[slug] = await page.title()
  await page.screenshot({ path: join(pub, 'sites/thumbs', `${slug}.jpeg`), type: 'jpeg', quality: 80, clip: { x: 0, y: 0, width: 1440, height: 1920 } })
  const h = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), 9000)
  await page.setViewportSize({ width: 1440, height: h })
  await page.waitForTimeout(800)
  await page.screenshot({ path: join(pub, 'sites/full', `${slug}.jpeg`), type: 'jpeg', quality: 72 })
  await page.close()
  const small = await browser.newPage({ viewport: { width: 1440, height: 1920 }, deviceScaleFactor: 400 / 1440 })
  await small.goto(pathToFileURL(join(pub, 'sites/thumbs', `${slug}.jpeg`)).href)
  await small.screenshot({ path: join(pub, 'home', `sites-${slug}.jpeg`), type: 'jpeg', quality: 80 })
  await small.close()
  console.log('shot', slug, '-', titles[slug])
}
await browser.close()
writeFileSync('scripts/sites.titles.json', JSON.stringify(titles, null, 2))
