import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { IMG } from '../data/media'
import SmartImage from './ui/SmartImage'
import MagneticButton from './ui/MagneticButton'
import Reveal from './ui/Reveal'

export default function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '4%'])

  return (
    <section id="commission" className="finale" ref={ref}>
      <motion.div className="finale__bg" style={{ y }}>
        <SmartImage asset={IMG.ferrariRed} fallback={IMG.lineupGT} width={2200} eager={false} sizes="100vw" />
      </motion.div>
      <div className="finale__scrim" />
      <div className="container finale__content">
        <Reveal mode="rise">
          <span className="kicker">Commissions open — MMXXVI</span>
        </Reveal>
        <h2 className="h-display">
          <Reveal delay={0.08}>Yours is</Reveal>
          <Reveal delay={0.18}>
            already <em>waiting.</em>
          </Reveal>
        </h2>
        <Reveal mode="rise" delay={0.28}>
          <p>
            Eighty-eight build slots a year. A private audience with the design house, a seat in
            the wind tunnel, and one hundred and eleven days later — your name on the sill plate.
          </p>
        </Reveal>
        <Reveal mode="rise" delay={0.36}>
          <div className="finale__actions">
            <MagneticButton className="btn btn--solid">Begin commission</MagneticButton>
            <MagneticButton className="btn">Request private viewing</MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
