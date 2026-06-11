import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FILM } from '../data/media'
import SmartVideo from './ui/SmartVideo'
import Reveal from './ui/Reveal'

export default function NightDrive() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section id="night" className="nightdrive" ref={ref}>
      <motion.div style={{ position: 'absolute', inset: '-7% 0', y }}>
        <SmartVideo asset={FILM.nightDrive} posterWidth={2000} />
      </motion.div>
      <div className="nightdrive__scrim" />
      <div className="container nightdrive__content">
        <h2 className="h-display">
          <Reveal>Own</Reveal>
          <Reveal delay={0.1}>
            the <em>night.</em>
          </Reveal>
        </h2>
        <Reveal mode="rise" delay={0.25}>
          <p>
            Matrix lasers read the road three hundred metres out. The cabin dims to candlelight.
            The V12 drops to a murmur — until you ask it not to.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
