import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { FLAGSHIP_SPECS } from '../data/cars'
import Reveal from './ui/Reveal'

function Counter({ value, suffix, label, decimals }: (typeof FLAGSHIP_SPECS)[number]) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-18% 0px' })
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) =>
    v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
  )

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, value, { duration: 2.2, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [inView, mv, value])

  return (
    <div ref={ref}>
      <div className="specs__num">
        <motion.span>{text}</motion.span>
        <span className="unit">{suffix}</span>
      </div>
      <div className="specs__label">{label}</div>
    </div>
  )
}

export default function SpecsSection() {
  return (
    <section className="specs">
      <div className="container">
        <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: '100%' }}>
            <Reveal mode="rise">
              <span className="kicker">Imperator GT, the numbers</span>
            </Reveal>
          </div>
        </div>
        <div className="specs__grid">
          {FLAGSHIP_SPECS.map((spec) => (
            <Counter key={spec.label} {...spec} />
          ))}
        </div>
      </div>
    </section>
  )
}
