/* Visual verification for Aurelius Motors.
 * Runs the production build in real Chromium, walks every scroll chapter,
 * captures screenshots, and reports console/page errors.
 *
 * The sandbox egress proxy blocks media CDNs, so unsplash/pexels/mixkit
 * requests are fulfilled with neutral SVG stand-ins — layout, type, motion
 * and WebGL are what's under test here. (The real URLs are verified
 * separately and resolve fine outside this sandbox.)
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:4848/'
const OUT = '/tmp/aurelius-shots'
mkdirSync(OUT, { recursive: true })

// hue derived from the photo id, so screenshots preview the page's colour
// rhythm even though the real photographs can't load inside the sandbox
const hueOf = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7)
const standIn = (label) => {
  const h = hueOf(label)
  return `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
  <defs>
    <radialGradient id="g" cx="50%" cy="62%" r="80%">
      <stop offset="0%" stop-color="hsl(${h}, 48%, 30%)"/>
      <stop offset="52%" stop-color="hsl(${(h + 24) % 360}, 42%, 15%)"/>
      <stop offset="100%" stop-color="hsl(${h}, 30%, 6%)"/>
    </radialGradient>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="hsl(${(h + 40) % 360}, 70%, 55%)" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="hsl(${h}, 70%, 45%)" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  <ellipse cx="800" cy="300" rx="700" ry="220" fill="hsl(${(h + 50) % 360}, 60%, 52%)" opacity="0.16"/>
  <path d="M300 640 q120 -110 360 -120 q150 -60 330 -55 q200 6 290 80 q120 18 150 95 l-40 18 q-490 30 -1050 8 z"
        fill="hsl(${h}, 22%, 12%)" stroke="url(#s)" stroke-width="4"/>
  <circle cx="520" cy="668" r="58" fill="#0c0c0e" stroke="#c8a45c" stroke-opacity="0.6" stroke-width="6"/>
  <circle cx="1150" cy="668" r="58" fill="#0c0c0e" stroke="#c8a45c" stroke-opacity="0.6" stroke-width="6"/>
  <text x="800" y="850" text-anchor="middle" font-family="Georgia, serif" font-size="30"
        fill="#e9d7ae" opacity="0.85">media stand-in — real photo loads outside sandbox</text>
  <text x="800" y="895" text-anchor="middle" font-family="Georgia, serif" font-size="22"
        fill="#f2efe9" opacity="0.5">${label}</text>
</svg>`
}

const errors = []
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, ignoreHTTPSErrors: true })

await page.route('**images.unsplash.com/**', (route) => {
  const id = new URL(route.request().url()).pathname.slice(1, 24)
  route.fulfill({ contentType: 'image/svg+xml', body: standIn(id) })
})
await page.route('**videos.pexels.com/**', (route) => route.abort())
await page.route('**assets.mixkit.co/**', (route) => route.abort())

page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning')
    errors.push(`[console.${msg.type()}] ${msg.text()}`)
})
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))
page.on('requestfailed', (req) => {
  const url = req.url()
  if (/videos\.pexels|assets\.mixkit/.test(url)) return // intentionally aborted
  errors.push(`[requestfailed] ${url} — ${req.failure()?.errorText}`)
})

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(3600) // preloader (~2.4s) + settle

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log(`shot: ${name}`)
}

const sectionTop = (sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s)
    return el ? el.getBoundingClientRect().top + window.scrollY : -1
  }, sel)
const sectionHeight = (sel) =>
  page.evaluate((s) => document.querySelector(s)?.scrollHeight ?? 0, sel)

const scrollTo = async (y, settle = 1400) => {
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), Math.round(y))
  await page.waitForTimeout(settle)
}

// scroll so a pinned section sits at exact scroll-progress p (0–1),
// matching framer's ['start start','end end'] offset math
const scrollToProgress = async (sel, p, settle = 1400) => {
  const top = await sectionTop(sel)
  const h = await sectionHeight(sel)
  await scrollTo(top + p * (h - 900), settle)
}

await shot('01-hero')

await scrollToProgress('.showcase', 0.06)
await shot('02-showcase-approach')
await scrollToProgress('.showcase', 0.34)
await shot('03-showcase-day')
await scrollToProgress('.showcase', 0.58)
await shot('04-showcase-dusk')
await scrollToProgress('.showcase', 0.85)
await shot('05-showcase-night')

await scrollTo((await sectionTop('#lineup')) - 60)
await page.waitForTimeout(600)
await shot('06-lineup')
// hover a card to exercise the tilt interaction
const card = await page.locator('.tilt-card').first().boundingBox()
if (card) {
  await page.mouse.move(card.x + card.width * 0.72, card.y + card.height * 0.3)
  await page.waitForTimeout(700)
  await shot('07-lineup-tilt')
}

await scrollToProgress('#engineering', 0.05, 2600) // let the three.js chunk load + compile
await shot('08-engineering-intro')
await scrollToProgress('#engineering', 0.3, 2000)
await shot('09-engineering-exploding')
await scrollToProgress('#engineering', 0.5, 2000)
await shot('10-engineering-exploded')
await scrollToProgress('#engineering', 0.95, 2000)
await shot('11-engineering-reassembled')

await scrollTo((await sectionTop('#interior')) - 40)
await shot('12-interior')

await scrollToProgress('.gallery', 0.55, 1800)
await shot('13-gallery')

await scrollTo((await sectionTop('#night')) - 30)
await shot('14-nightdrive')
await scrollTo(await sectionTop('.specs'), 2600) // counters animate
await shot('15-specs')
await scrollTo((await sectionTop('#atelier')) - 30)
await shot('16-atelier')
await scrollTo((await sectionTop('#commission')) - 20)
await shot('17-finale')
await scrollTo(await page.evaluate(() => document.body.scrollHeight))
await shot('18-footer')

// sanity: WebGL actually produced a canvas
const glInfo = await page.evaluate(() => {
  const c = document.querySelector('.engineering__canvas canvas')
  return c ? `${c.width}x${c.height}` : 'NO CANVAS'
})
console.log(`webgl canvas: ${glInfo}`)

console.log('\n=== issues ===')
console.log(errors.length ? errors.join('\n') : 'none')
await browser.close()
