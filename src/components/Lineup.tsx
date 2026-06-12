import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { LINEUP, type CarModel } from '../data/cars'
import { IMG } from '../data/media'
import SmartImage from './ui/SmartImage'
import Reveal from './ui/Reveal'

function TiltCard({ car, index }: { car: CarModel; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [7.5, -7.5]), { stiffness: 160, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 160, damping: 18 })

  const onMove = (e: MouseEvent) => {
    if (reduced) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    px.set(x)
    py.set(y)
    ref.current?.style.setProperty('--gx', `${x * 100}%`)
    ref.current?.style.setProperty('--gy', `${y * 100}%`)
  }

  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const accentVar = { '--accent': car.accent } as Record<string, string>

  return (
    // entrance lives on the wrapper so it never fights the hover-tilt springs
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 70, rotateY: -16, transformPerspective: 1100 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1.0, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
    <motion.div
      ref={ref}
      className="tilt-card"
      data-hover
      style={{ ...accentVar, ...(reduced ? {} : { rotateX, rotateY, transformPerspective: 1000 }) }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="tilt-card__media">
        <SmartImage
          asset={car.image}
          fallback={IMG.muscleDark}
          width={1200}
          sizes="(max-width: 880px) 100vw, 33vw"
        />
        <div className="tilt-card__shade" />
      </div>
      <div className="tilt-card__glare" />
      <span className="tilt-card__cta" aria-hidden="true">
        ↗
      </span>
      <div className="tilt-card__body">
        <span className="tilt-card__desig" style={{ color: car.accent }}>
          {car.designation}
        </span>
        <h3 className="tilt-card__name">{car.name}</h3>
        <p className="tilt-card__tag">{car.tagline}</p>
        <div className="tilt-card__stats">
          {car.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
    </motion.div>
  )
}

export default function Lineup() {
  return (
    <section id="lineup" className="lineup">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal mode="rise">
              <span className="kicker">The stable</span>
            </Reveal>
            <h2 className="h-display">
              <Reveal delay={0.08}>Three instruments,</Reveal>
              <Reveal delay={0.18}>one signature.</Reveal>
            </h2>
          </div>
          <Reveal mode="rise" delay={0.2}>
            <p>
              Each Aurelius leaves the atelier as a numbered work, coachbuilt to commission,
              never to inventory.
            </p>
          </Reveal>
        </div>
        <div className="lineup__grid">
          {LINEUP.map((car, i) => (
            <TiltCard car={car} index={i} key={car.name} />
          ))}
        </div>
      </div>
    </section>
  )
}
