import { useMemo, useRef, type MouseEvent } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { FILM } from '../data/media'
import SmartVideo from './ui/SmartVideo'

/** Pick the 4K chain only on wide screens with a demonstrably fast connection —
 *  a stalling hero reads as a hung page, so HD is the safe default. */
function pickHeroFilm() {
  if (typeof window === 'undefined') return FILM.heroLite
  const wide = window.innerWidth * (window.devicePixelRatio || 1) >= 2400
  const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  const fast = !conn || (!conn.saveData && conn.effectiveType === '4g')
  return wide && fast ? FILM.hero : FILM.heroLite
}

export default function Hero({ interactive }: { interactive: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const film = useMemo(pickHeroFilm, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '46%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  // cursor parallax on the headline block
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [3.4, -3.4]), { stiffness: 80, damping: 18 })
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-4.5, 4.5]), { stiffness: 80, damping: 18 })
  const driftX = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 60, damping: 20 })

  const onMouse = (e: MouseEvent) => {
    if (reduced) return
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }

  return (
    <section id="top" className="hero" ref={ref} onMouseMove={onMouse}>
      <motion.div className="hero__media" style={reduced ? undefined : { scale: mediaScale, y: mediaY }}>
        <SmartVideo asset={film} lazy={false} posterWidth={2000} />
      </motion.div>
      <div className="hero__scrim" />
      <div className="hero__glow" />

      <motion.div
        className="container hero__content"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={interactive ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="hero__kicker"
        >
          <span className="hairline" />
          <span className="kicker">Motorwerk · Est. MMXXVI</span>
        </motion.div>

        <motion.h1
          className="hero__title h-display"
          style={reduced ? undefined : { rotateX: tiltX, rotateY: tiltY, x: driftX, transformPerspective: 900 }}
        >
          <span className="reveal-line">
            <motion.span
              initial={{ y: '110%' }}
              animate={interactive ? { y: 0 } : undefined}
              transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              Aurelius
            </motion.span>
          </span>
          <span className="reveal-line">
            <motion.span
              className="thin"
              initial={{ y: '110%' }}
              animate={interactive ? { y: 0 } : undefined}
              transition={{ duration: 1.2, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              Motors
            </motion.span>
          </span>
        </motion.h1>

        <div className="hero__row">
          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 26 }}
            animate={interactive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <em>The art of velocity.</em> Twelve cylinders, hand laid carbon and four hundred
            hours of obsession, composed into machines that turn distance into theatre.
          </motion.p>

          <motion.div
            className="hero__stats"
            initial={{ opacity: 0, y: 26 }}
            animate={interactive ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, delay: 0.74, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero__stat">
              <strong>2.4 s</strong>
              <span>0–100 km/h</span>
            </div>
            <div className="hero__stat">
              <strong>350</strong>
              <span>km/h v-max</span>
            </div>
            <div className="hero__stat">
              <strong>1,180</strong>
              <span>PS output</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="hero__scrollcue"
        initial={{ opacity: 0 }}
        animate={interactive ? { opacity: 1 } : undefined}
        transition={{ delay: 1.4, duration: 1 }}
      >
        Scroll
      </motion.div>
    </section>
  )
}
