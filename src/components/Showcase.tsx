import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { IMG } from '../data/media'
import SmartImage from './ui/SmartImage'

interface Chapter {
  idx: string
  title: string
  copy: string
}

const CHAPTERS: Chapter[] = [
  {
    idx: '01 — Arrival',
    title: 'It begins in darkness.',
    copy: 'A silhouette resolves out of the black — twelve cylinders idling like a held breath.',
  },
  {
    idx: '02 — First light',
    title: 'Forged for daylight.',
    copy: 'Every surface is wind-tunnel sculpture. The sun finds nothing accidental.',
  },
  {
    idx: '03 — Golden hour',
    title: 'Alive at dusk.',
    copy: 'Heat in the brakes, amber on the paint. The road begins to confess.',
  },
  {
    idx: '04 — Night sovereign',
    title: 'The city yields.',
    copy: 'Light trails braid behind you. Aurelius does not pass through the night — it commands it.',
  },
]

/** opacity window helper: fade in over [a→b], hold, fade out over [c→d] */
const useWindow = (p: MotionValue<number>, a: number, b: number, c: number, d: number) =>
  useTransform(p, [a, b, c, d], [0, 1, 1, 0])

export default function Showcase() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  /* — scene visibility — */
  const s0Opacity = useTransform(p, [0.24, 0.3], [1, 0])
  const s1Opacity = useWindow(p, 0.24, 0.3, 0.46, 0.52)
  const s2Opacity = useWindow(p, 0.46, 0.52, 0.68, 0.74)
  const s3Opacity = useTransform(p, [0.68, 0.74], [0, 1])

  /* — scene 0: the car approaches from the distance — */
  const s0Scale = useTransform(p, [0, 0.26], [0.34, 1.03])
  const s0Y = useTransform(p, [0, 0.26], ['7%', '0%'])
  const s0Blur = useTransform(p, [0, 0.06, 0.2], [14, 9, 0])
  const s0Filter = useMotionTemplate`blur(${s0Blur}px)`

  /* — camera drifts around the car in each environment — */
  const s1X = useTransform(p, [0.26, 0.52], ['-3.5%', '3.5%'])
  const s1Scale = useTransform(p, [0.26, 0.52], [1.16, 1.05])
  const s1Rot = useTransform(p, [0.26, 0.52], [4, -4])
  const s2X = useTransform(p, [0.48, 0.74], ['3%', '-3%'])
  const s2Scale = useTransform(p, [0.48, 0.74], [1.05, 1.16])
  const s2Rot = useTransform(p, [0.48, 0.74], [-4, 4])
  const s3Scale = useTransform(p, [0.7, 1], [1.18, 1.04])
  const s3Y = useTransform(p, [0.7, 1], ['3%', '-2%'])

  /* — motion-blur pulses at each cut — */
  const cutBlur = useTransform(
    p,
    [0, 0.255, 0.275, 0.295, 0.475, 0.495, 0.515, 0.695, 0.715, 0.735, 1],
    [0, 0, 7, 0, 0, 7, 0, 0, 7, 0, 0],
  )
  const stageFilter = useMotionTemplate`blur(${cutBlur}px)`
  const stageJolt = useTransform(
    p,
    [0, 0.255, 0.275, 0.295, 0.475, 0.495, 0.515, 0.695, 0.715, 0.735, 1],
    [1, 1, 1.02, 1, 1, 1.02, 1, 1, 1.02, 1, 1],
  )

  /* — lighting grade shifts with the hour — */
  const tint = useTransform(
    p,
    [0.12, 0.34, 0.56, 0.8],
    ['rgba(140, 150, 255, 0.0)', 'rgba(255, 178, 92, 0.34)', 'rgba(255, 104, 150, 0.36)', 'rgba(66, 108, 255, 0.4)'],
  )
  const trailsOpacity = useTransform(p, [0.72, 0.85], [0, 0.5])

  /* — captions — */
  const cap0 = useWindow(p, 0.02, 0.07, 0.21, 0.27)
  const cap1 = useWindow(p, 0.29, 0.34, 0.43, 0.49)
  const cap2 = useWindow(p, 0.51, 0.56, 0.65, 0.71)
  const cap3 = useWindow(p, 0.73, 0.78, 0.94, 1)
  const capOpacity = [cap0, cap1, cap2, cap3]

  const barScale = useTransform(p, [0, 1], [0, 1])

  if (reduced) {
    // calm variant: one full-bleed frame per chapter, no pinning
    return (
      <section id="showcase">
        {CHAPTERS.map((chapter, i) => (
          <div key={chapter.idx} style={{ position: 'relative', height: '88vh', overflow: 'hidden' }}>
            <SmartImage
              asset={[IMG.approachDark, IMG.dayCoupe, IMG.duskRoadster, IMG.nightAmg][i]}
              fallback={IMG.heroPoster}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="showcase__vignette" />
            <div className="showcase__caption">
              <span className="idx kicker">{chapter.idx}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.copy}</p>
            </div>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section id="showcase" className="showcase" ref={ref}>
      <div className="showcase__stage" style={{ perspective: 1100 }}>
        <motion.div
          style={{ position: 'absolute', inset: 0, filter: stageFilter, scale: stageJolt }}
        >
          {/* 01 — approach from the void */}
          <motion.div className="showcase__scene" style={{ opacity: s0Opacity }}>
            <motion.div
              style={{ width: '100%', height: '100%', scale: s0Scale, y: s0Y, filter: s0Filter }}
            >
              <SmartImage asset={IMG.approachDark} fallback={IMG.muscleDark} eager sizes="100vw" width={2200} />
            </motion.div>
          </motion.div>

          {/* 02 — daylight */}
          <motion.div className="showcase__scene" style={{ opacity: s1Opacity, rotateY: s1Rot }}>
            <motion.div style={{ width: '100%', height: '100%', x: s1X, scale: s1Scale }}>
              <SmartImage asset={IMG.dayCoupe} fallback={IMG.hypercarHighway} sizes="100vw" width={2200} />
            </motion.div>
          </motion.div>

          {/* 03 — dusk */}
          <motion.div className="showcase__scene" style={{ opacity: s2Opacity, rotateY: s2Rot }}>
            <motion.div style={{ width: '100%', height: '100%', x: s2X, scale: s2Scale }}>
              <SmartImage asset={IMG.duskRoadster} fallback={IMG.bmwBlue} sizes="100vw" width={2200} />
            </motion.div>
          </motion.div>

          {/* 04 — night + light trails */}
          <motion.div className="showcase__scene" style={{ opacity: s3Opacity }}>
            <motion.div style={{ width: '100%', height: '100%', scale: s3Scale, y: s3Y }}>
              <SmartImage asset={IMG.nightAmg} fallback={IMG.nightJaguar} sizes="100vw" width={2200} />
            </motion.div>
            <motion.div className="showcase__trails" style={{ opacity: trailsOpacity }}>
              <SmartImage asset={IMG.lightTrails} fallback={IMG.cityLights} sizes="100vw" width={1600} />
            </motion.div>
          </motion.div>

          {/* dynamic lighting grade */}
          <motion.div className="showcase__tint" style={{ backgroundColor: tint }} />
        </motion.div>

        <div className="showcase__vignette" />

        {CHAPTERS.map((chapter, i) => (
          <motion.div className="showcase__caption" key={chapter.idx} style={{ opacity: capOpacity[i] }}>
            <span className="idx kicker">{chapter.idx}</span>
            <h3>{chapter.title}</h3>
            <p>{chapter.copy}</p>
          </motion.div>
        ))}

        <div className="showcase__progress" aria-hidden="true">
          <motion.i style={{ scaleY: barScale, height: '100%' }} />
        </div>
      </div>
    </section>
  )
}
