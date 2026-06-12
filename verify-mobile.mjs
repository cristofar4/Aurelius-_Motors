/* Mobile verification: iPhone-class viewport, touch emulation, same
 * real-photo stand-ins. Walks the key sections and the burger menu. */
import { chromium, devices } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:4848/'
const OUT = '/tmp/aurelius-mobile'
mkdirSync(OUT, { recursive: true })

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
const interiorB64 = readFileSync(`${P}/interior2.jpg`).toString('base64')
const INTERIOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 230 1080 500">
  <image href="data:image/jpeg;base64,${interiorB64}" width="1080" height="799" x="0" y="0"/>
</svg>`
const ID_MAP = [
  ['photo-1511919884226', 'aston'], ['photo-1503376780353', 'aston'], ['photo-1605559424843', 'aston'],
  ['photo-1494976388531', 'aston'], ['photo-1477959858617', 'aston'],
  ['photo-1544636331', 'lamboShow'], ['photo-1563720223185', 'lamboShow'], ['photo-1617654112368', 'lamboShow'],
  ['photo-1551522435', 'lamboShow'],
  ['photo-1533473359331', 'lamboRun'], ['photo-1525609004556', 'lamboRun'], ['photo-1542362567', 'lamboRun'],
  ['photo-1553440569', 'lamboRun'],
  ['photo-1552519507', 'f8'], ['photo-1583121274602', 'f8'], ['photo-1560958089', 'f8'], ['photo-1492144534655', 'f8'],
  ['photo-1542282088', 'rolls'], ['photo-1607860108855', 'rolls'],
  ['photo-1549317661', 'duskRow'], ['photo-1519501025264', 'duskRow'], ['photo-1502920514313', 'duskRow'],
  ['photo-1555215695', 'duskRow'], ['photo-1502877338535', 'duskRow'],
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
const page = await browser.newPage({
  ...devices['iPhone 13'],
  ignoreHTTPSErrors: true,
})

await page.route('**images.unsplash.com/**', (route) => {
  const path = new URL(route.request().url()).pathname.slice(1)
  route.fulfill(standInFor(path))
})
await page.route('**videos.pexels.com/**', (route) => route.abort())
await page.route('**assets.mixkit.co/**', (route) => route.abort())
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(3200)

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
const scrollTo = async (y, settle = 1600) => {
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), Math.round(y))
  await page.waitForTimeout(settle)
}
const vh = 664 // iPhone 13 visual viewport, not screen height
const scrollToProgress = async (sel, p, settle = 1600) => {
  const top = await sectionTop(sel)
  const h = await sectionHeight(sel)
  await scrollTo(top + p * (h - vh), settle)
}

await shot('m01-hero')

// burger menu
await page.tap('.nav__burger')
await page.waitForTimeout(900)
await shot('m02-menu')
await page.tap('.nav__burger')
await page.waitForTimeout(600)

await scrollToProgress('.showcase', 0.36)
await shot('m03-showcase')
await scrollTo((await sectionTop('#lineup')) - 30, 2000)
await shot('m04-lineup')
await scrollToProgress('#engineering', 0.5, 2800)
await shot('m05-engineering')
await scrollTo((await sectionTop('#interior')) - 20, 2400)
await shot('m06-interior')
await scrollToProgress('.gallery', 0.5, 1800)
await shot('m07-gallery')
await scrollTo(await sectionTop('.specs'), 2600)
await shot('m08-specs')
await scrollTo((await sectionTop('#commission')) - 10, 2000)
await shot('m09-finale')
await scrollTo(await page.evaluate(() => document.body.scrollHeight))
await shot('m10-footer')

// horizontal overflow check, the classic mobile breakage
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
)
console.log(`horizontal overflow: ${overflow}px`)
console.log('\n=== issues ===')
console.log(errors.length ? errors.join('\n') : 'none')
await browser.close()
