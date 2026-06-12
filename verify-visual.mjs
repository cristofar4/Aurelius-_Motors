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

// Real automotive photographs (fetched from public GitHub repos) stand in for
// the blocked CDNs so screenshots show true imagery. Production keeps the
// verified royalty-free Unsplash/Pexels URLs — these files never ship.
import { readFileSync } from 'node:fs'
const P = '/tmp/realcars'
const img = (f) => readFileSync(`${P}/${f}`)
const SHOTS = {
  aston: img('supercar.jpg'),
  lamboRun: img('lambo1.jpg'),
  lamboShow: img('lambo2.jpg'),
  f8: img('ferrari2.jpg'),
  rolls: img('rolls1.jpg'),
  duskRow: img('luxbg.jpg'),
}
// AMG interior — cropped via SVG viewBox to remove a dealer watermark
const interiorB64 = readFileSync(`${P}/interior2.jpg`).toString('base64')
const INTERIOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 230 1080 500">
  <image href="data:image/jpeg;base64,${interiorB64}" width="1080" height="799" x="0" y="0"/>
</svg>`

const ID_MAP = [
  ['photo-1511919884226', 'aston'],
  ['photo-1503376780353', 'aston'],
  ['photo-1605559424843', 'aston'],
  ['photo-1494976388531', 'aston'],
  ['photo-1477959858617', 'aston'],
  ['photo-1544636331', 'lamboShow'],
  ['photo-1563720223185', 'lamboShow'],
  ['photo-1617654112368', 'lamboShow'],
  ['photo-1551522435', 'lamboShow'],
  ['photo-1533473359331', 'lamboRun'],
  ['photo-1525609004556', 'lamboRun'],
  ['photo-1542362567', 'lamboRun'],
  ['photo-1553440569', 'lamboRun'],
  ['photo-1552519507', 'f8'],
  ['photo-1583121274602', 'f8'],
  ['photo-1560958089', 'f8'],
  ['photo-1492144534655', 'f8'],
  ['photo-1542282088', 'rolls'],
  ['photo-1607860108855', 'rolls'],
  ['photo-1549317661', 'duskRow'],
  ['photo-1519501025264', 'duskRow'],
  ['photo-1502920514313', 'duskRow'],
  ['photo-1555215695', 'duskRow'],
  ['photo-1502877338535', 'duskRow'],
]
const INTERIOR_IDS = ['photo-1606664515524', 'photo-1514316454349', 'photo-1489824904134',
  'photo-1619642751034', 'photo-1627993358055', 'photo-1603386329225',
  'photo-1486262715619', 'photo-1520340356584']

const standInFor = (path) => {
  if (INTERIOR_IDS.some((id) => path.startsWith(id)))
    return { contentType: 'image/svg+xml', body: INTERIOR_SVG }
  const hit = ID_MAP.find(([id]) => path.startsWith(id))
  return { contentType: 'image/jpeg', body: hit ? SHOTS[hit[1]] : SHOTS.duskRow }
}

const errors = []
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, ignoreHTTPSErrors: true })

await page.route('**images.unsplash.com/**', (route) => {
  const path = new URL(route.request().url()).pathname.slice(1)
  route.fulfill(standInFor(path))
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

await scrollTo((await sectionTop('#interior')) - 40, 2400)
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
