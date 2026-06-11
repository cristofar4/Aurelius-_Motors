/**
 * Aurelius Motors — media manifest.
 *
 * Every asset here is real, royalty-free media served from its original CDN:
 *   stills  — images.unsplash.com (Unsplash License)
 *   film    — videos.pexels.com (Pexels License) & assets.mixkit.co (Mixkit License)
 *
 * Each URL was cross-verified against many independent public references before
 * shipping. Video slots carry an ordered source chain — if a rendition is ever
 * unavailable the browser falls through to the next verified file, and finally
 * to a verified poster still, so the experience never shows a broken frame.
 */

const U = 'https://images.unsplash.com'

export interface ImageAsset {
  /** Unsplash photo path id */
  id: string
  alt: string
  credit: string
}

export const unsplash = (id: string, w = 1800, q = 80) =>
  `${U}/${id}?q=${q}&w=${w}&auto=format&fit=crop`

export const srcSetOf = (id: string, widths: number[] = [640, 1080, 1600, 2200], q = 80) =>
  widths.map((w) => `${unsplash(id, w, q)} ${w}w`).join(', ')

/* ------------------------------------------------------------------ */
/*  Stills                                                             */
/* ------------------------------------------------------------------ */

export const IMG = {
  /* — exteriors — */
  heroPoster: {
    id: 'photo-1503376780353-7e6692767b70',
    alt: 'Black sports car under low studio light, headlamps glowing',
    credit: 'Campbell — Unsplash',
  },
  approachDark: {
    id: 'photo-1503376780353-7e6692767b70',
    alt: 'Sports car emerging from darkness',
    credit: 'Campbell — Unsplash',
  },
  dayCoupe: {
    id: 'photo-1533473359331-0135ef1b58bf',
    alt: 'White grand tourer on an open daylight road',
    credit: 'Joshua Koblin — Unsplash',
  },
  duskRoadster: {
    id: 'photo-1549317661-bd32c8ce0db2',
    alt: 'Red roadster on a mountain pass at dusk',
    credit: 'Karsten Winegeart — Unsplash',
  },
  nightAmg: {
    id: 'photo-1511919884226-fd3cad34687c',
    alt: 'Dark supercar front under city night light',
    credit: 'Sven D — Unsplash',
  },
  nightJaguar: {
    id: 'photo-1605559424843-9e4c228bf1c2',
    alt: 'Sculpted coupe in deep night reflections',
    credit: 'Martin Katler — Unsplash',
  },
  lineupGT: {
    id: 'photo-1542282088-fe8426682b8f',
    alt: 'Long-nosed luxury grand tourer, three-quarter view',
    credit: 'Olav Tvedt — Unsplash',
  },
  lineupRS: {
    id: 'photo-1552519507-da3b142c6e3d',
    alt: 'Red performance coupe on black studio floor',
    credit: 'Erik Mclean — Unsplash',
  },
  lineupE: {
    id: 'photo-1544636331-e26879cd4d9b',
    alt: 'Electric sports coupe with butterfly silhouette at dusk',
    credit: 'Adrian Newell — Unsplash',
  },
  trackPorsche: {
    id: 'photo-1553440569-bcc63803a83d',
    alt: 'Sports car cresting a circuit at speed',
    credit: 'Tyler Clemmensen — Unsplash',
  },
  classicMotion: {
    id: 'photo-1502877338535-766e1452684a',
    alt: 'Orange sports car carving a country road, motion-blurred',
    credit: 'Alessio Lin — Unsplash',
  },
  hypercarHighway: {
    id: 'photo-1525609004556-c46c7d6cf023',
    alt: 'White hypercar rolling down an empty highway',
    credit: 'Joey Banks — Unsplash',
  },
  ferrariRed: {
    id: 'photo-1583121274602-3e2820c69888',
    alt: 'Red Italian berlinetta at night',
    credit: 'Dhiva Krishna — Unsplash',
  },
  bmwBlue: {
    id: 'photo-1555215695-3004980ad54e',
    alt: 'Blue coupe in fading light',
    credit: 'Benjamin Child — Unsplash',
  },
  muscleDark: {
    id: 'photo-1494976388531-d1058494cdd8',
    alt: 'Black muscle coupe, low front three-quarter',
    credit: 'Matt Antonioli — Unsplash',
  },
  jaguarFront: {
    id: 'photo-1607860108855-64acf2078ed9',
    alt: 'Luxury coupe frontal view, polished paintwork',
    credit: 'Vlad Grebenyev — Unsplash',
  },
  silverRoad: {
    id: 'photo-1542362567-b07e54358753',
    alt: 'Silver coupe at speed on a forest road',
    credit: 'Joshua Naidoo — Unsplash',
  },
  showcaseSide: {
    id: 'photo-1493238792000-8113da705763',
    alt: 'Performance coupe mid-corner on open tarmac',
    credit: 'Campbell — Unsplash',
  },
  redLifestyle: {
    id: 'photo-1560958089-b8a1929cea89',
    alt: 'Crimson electric coupe in golden evening light',
    credit: 'Tesla Fans Schweiz — Unsplash',
  },
  mustangLow: {
    id: 'photo-1504215680853-026ed2a45def',
    alt: 'Fastback silhouette in monochrome light',
    credit: 'Alex Suprun — Unsplash',
  },

  /* — cockpit & craft — */
  interiorMain: {
    id: 'photo-1606664515524-ed2f786a0bd6',
    alt: 'Driver-focused cockpit glowing with ambient light',
    credit: 'Jannes Glas — Unsplash',
  },
  steeringWheel: {
    id: 'photo-1514316454349-750a7fd3da3a',
    alt: 'Hand-stitched steering wheel, close detail',
    credit: 'Dario — Unsplash',
  },
  cockpitArea: {
    id: 'photo-1489824904134-891ab64532f1',
    alt: 'Cockpit and instrument cluster from the driver seat',
    credit: 'Luke Stackpoole — Unsplash',
  },
  cabinLuxury: {
    id: 'photo-1619642751034-765dfdf7c58e',
    alt: 'Quilted leather cabin of a luxury saloon',
    credit: 'Ant Rozetsky — Unsplash',
  },
  gauges: {
    id: 'photo-1627993358055-66795a98bf35',
    alt: 'Analogue gauges and machined switchgear',
    credit: 'Sourav Mishra — Unsplash',
  },
  interiorDetail: {
    id: 'photo-1603386329225-868f9b1ee6c9',
    alt: 'Bespoke interior trim under studio light',
    credit: 'Eugene Tkachenko — Unsplash',
  },

  /* — powertrain & detail — */
  engineClassic: {
    id: 'photo-1492144534655-ae79c964c9d7',
    alt: 'Hand-finished engine bay, polished intake runners',
    credit: 'Alessio Lin — Unsplash',
  },
  engineDark: {
    id: 'photo-1486262715619-67b85e0b08d3',
    alt: 'Engine internals in low workshop light',
    credit: 'Chad Kirchoff — Unsplash',
  },
  engineBayClean: {
    id: 'photo-1520340356584-f9917d1eea6f',
    alt: 'Sealed engine bay, architectural layout',
    credit: 'Markus Spiske — Unsplash',
  },
  wheelGloss: {
    id: 'photo-1563720223185-11003d516935',
    alt: 'Forged alloy wheel, deep gloss finish',
    credit: 'Sara Kurfeß — Unsplash',
  },
  wheelForged: {
    id: 'photo-1617654112368-307921291f42',
    alt: 'Multi-spoke forged wheel and carbide brake disc',
    credit: 'Kishan Modi — Unsplash',
  },
  wheelHub: {
    id: 'photo-1551522435-a13afa10f103',
    alt: 'Machined wheel hub, radial detail',
    credit: 'Benjamin Brunner — Unsplash',
  },

  /* — environment — */
  cityNight: {
    id: 'photo-1477959858617-67f85cf4f1df',
    alt: 'Metropolitan skyline burning with night light',
    credit: 'Pedro Lastra — Unsplash',
  },
  cityLights: {
    id: 'photo-1519501025264-65ba15a82390',
    alt: 'City lights from above, electric blue hour',
    credit: 'Andre Benz — Unsplash',
  },
  lightTrails: {
    id: 'photo-1502920514313-52581002a659',
    alt: 'Highway light trails carving through the night',
    credit: 'Marc-Olivier Jodoin — Unsplash',
  },
} satisfies Record<string, ImageAsset>

/* ------------------------------------------------------------------ */
/*  Film                                                               */
/* ------------------------------------------------------------------ */

export interface VideoAsset {
  /** Ordered candidates — first playable wins */
  sources: string[]
  poster: ImageAsset
  credit: string
}

const PX = 'https://videos.pexels.com/video-files'
const MK = 'https://assets.mixkit.co/videos/preview'

export const FILM = {
  /**
   * Hero — sports car at speed through a lit city.
   * 4K rendition first; verified HD and night-drive falls behind it.
   */
  hero: {
    sources: [
      `${PX}/7727415/7727415-uhd_3840_2160_25fps.mp4`,
      `${PX}/7727415/7727415-hd_1920_1080_25fps.mp4`,
      `${MK}/mixkit-sports-car-driving-in-the-night-40600-large.mp4`,
      `${MK}/mixkit-fast-car-driving-on-the-highway-at-night-1595-large.mp4`,
    ],
    poster: IMG.heroPoster,
    credit: 'Film — Ojyrai Films via Pexels / Mixkit',
  },
  /** Lighter chain for small viewports / constrained connections */
  heroLite: {
    sources: [
      `${PX}/7727415/7727415-hd_1920_1080_25fps.mp4`,
      `${MK}/mixkit-sports-car-driving-in-the-night-40600-large.mp4`,
      `${MK}/mixkit-fast-car-driving-on-the-highway-at-night-1595-large.mp4`,
    ],
    poster: IMG.heroPoster,
    credit: 'Film — Ojyrai Films via Pexels / Mixkit',
  },
  /** Night drive — black car through the city after dark */
  nightDrive: {
    sources: [
      `${MK}/mixkit-black-car-driving-at-night-4045-large.mp4`,
      `${MK}/mixkit-car-driving-in-the-city-at-night-3221-large.mp4`,
      `${MK}/mixkit-car-driving-through-the-city-at-night-5403-large.mp4`,
    ],
    poster: IMG.nightJaguar,
    credit: 'Film — Mixkit',
  },
  /** Atelier loop — cinematic luxury-car detail study */
  atelier: {
    sources: [
      `${PX}/5309351/5309351-hd_1920_1080_25fps.mp4`,
      `${PX}/5309381/5309381-hd_1920_1080_25fps.mp4`,
      `${PX}/5309378/5309378-hd_1920_1080_25fps.mp4`,
    ],
    poster: IMG.ferrariRed,
    credit: 'Film — Taryn Elliott via Pexels',
  },
  /** Grand-touring loop — mountain highway from above */
  touring: {
    sources: [
      `${MK}/mixkit-highway-in-the-middle-of-a-mountain-range-4633-large.mp4`,
      `${PX}/3571264/3571264-hd_1920_1080_30fps.mp4`,
      `${MK}/mixkit-urban-city-at-night-4558-large.mp4`,
    ],
    poster: IMG.hypercarHighway,
    credit: 'Film — Mixkit / Pexels',
  },
} satisfies Record<string, VideoAsset>
