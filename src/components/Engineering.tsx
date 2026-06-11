import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { explodeOf, type SceneDrive } from './three/explode'
import { IMG } from '../data/media'
import SmartImage from './ui/SmartImage'

const LazyCanvas = lazy(() => import('./three/CanvasStage'))

/** if WebGL ever fails, fall back to a real photograph rather than a blank stage */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return (
        <SmartImage
          asset={IMG.engineDark}
          fallback={IMG.engineClassic}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
        />
      )
    }
    return this.props.children
  }
}

const PHASES = [
  {
    idx: 'Phase 01 — Monocoque',
    title: 'Built around a carbon heart.',
    copy: 'A single carbon tub, autoclaved for nine hours. Stiffer than a race cell, lighter than the driver it protects.',
  },
  {
    idx: 'Phase 02 — Powertrain',
    title: 'The V12, laid bare.',
    copy: '6.6 litres, 9,200 rpm, a machined-alloy plenum. Every internal is balanced by hand to a tenth of a gram.',
  },
  {
    idx: 'Phase 03 — Suspension',
    title: 'Geometry as philosophy.',
    copy: 'Inboard pushrods and racing-blue coil springs read the road two hundred times a second — and answer politely.',
  },
  {
    idx: 'Phase 04 — Assembly',
    title: 'Four microns of tolerance.',
    copy: 'One hundred and eleven days. Three master builders. The car returns to one — and signs its own chassis plate.',
  },
]

export default function Engineering() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // mounted latches on first approach; active drives the frameloop
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)

  const drive = useRef<SceneDrive>({ p: 0, mx: 0, my: 0 })
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useEffect(() => {
    const unsub = p.on('change', (v) => {
      drive.current.p = v
    })
    return unsub
  }, [p])

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: '70% 0px 70% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const onMove = (e: MouseEvent) => {
      drive.current.mx = e.clientX / window.innerWidth - 0.5
      drive.current.my = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  /* HUD windows */
  const headOpacity = useTransform(p, [0.0, 0.05, 0.1, 0.16], [0, 1, 1, 0])
  const ph0 = useTransform(p, [0.05, 0.1, 0.17, 0.22], [0, 1, 1, 0])
  const ph1 = useTransform(p, [0.24, 0.29, 0.4, 0.45], [0, 1, 1, 0])
  const ph2 = useTransform(p, [0.47, 0.52, 0.6, 0.65], [0, 1, 1, 0])
  const ph3 = useTransform(p, [0.67, 0.72, 0.84, 0.9], [0, 1, 1, 0])
  const finale = useTransform(p, [0.91, 0.97], [0, 1])
  const phaseOpacity = [ph0, ph1, ph2, ph3]

  const disassembly = useTransform(p, (v) => `${String(Math.round(explodeOf(v) * 100)).padStart(3, '0')}%`)
  const hintOpacity = useTransform(p, [0.03, 0.08, 0.88, 0.95], [0, 1, 1, 0])

  if (reduced) {
    // calm variant — the anatomy as an editorial spread
    return (
      <section id="engineering" style={{ padding: 'clamp(5rem,11vh,8rem) 0', background: 'var(--ink)' }}>
        <div className="container">
          <span className="kicker">Engineering</span>
          <h2 className="h-display" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', margin: '0.8rem 0 3rem' }}>
            Anatomy of velocity
          </h2>
          <div style={{ position: 'relative', aspectRatio: '16/8', overflow: 'hidden', border: '1px solid var(--line)', marginBottom: '3rem' }}>
            <SmartImage
              asset={IMG.engineDark}
              fallback={IMG.engineClassic}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px,100%),1fr))' }}>
            {PHASES.map((phase) => (
              <div key={phase.idx}>
                <span className="kicker" style={{ fontSize: '0.6rem' }}>{phase.idx}</span>
                <h3 className="h-display" style={{ fontSize: '1.7rem', margin: '0.5rem 0' }}>{phase.title}</h3>
                <p style={{ color: 'var(--mist)', fontWeight: 300, fontSize: '0.92rem' }}>{phase.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="engineering" className="engineering" ref={ref}>
      <div className="engineering__stage">
        <div className="engineering__bg" />
        <div className="engineering__floorline" />

        <div className="engineering__canvas">
          {mounted && (
            <CanvasBoundary>
              <Suspense fallback={null}>
                <LazyCanvas drive={drive} active={active} />
              </Suspense>
            </CanvasBoundary>
          )}
        </div>

        <motion.div className="engineering__head" style={{ opacity: headOpacity }}>
          <span className="kicker">Engineering</span>
          <h2 className="h-display">Anatomy of velocity</h2>
        </motion.div>

        {PHASES.map((phase, i) => (
          <motion.div className="engineering__phase" key={phase.idx} style={{ opacity: phaseOpacity[i] }}>
            <span className="idx">{phase.idx}</span>
            <h3>{phase.title}</h3>
            <p>{phase.copy}</p>
          </motion.div>
        ))}

        <motion.div className="engineering__phase" style={{ opacity: finale }}>
          <span className="idx">Imperator GT</span>
          <h3>Whole again.</h3>
          <p>From two hundred and six components to a single intent.</p>
        </motion.div>

        <motion.div className="engineering__readout" style={{ opacity: hintOpacity }}>
          <strong>
            <motion.span>{disassembly}</motion.span>
          </strong>
          <span>Disassembly</span>
        </motion.div>

        <motion.div className="engineering__hint" style={{ opacity: hintOpacity }}>
          Scroll to disassemble
        </motion.div>
      </div>
    </section>
  )
}
