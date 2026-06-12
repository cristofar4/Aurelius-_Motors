import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { IMG } from '../data/media'
import SmartImage from './ui/SmartImage'
import Reveal from './ui/Reveal'

const FEATURES = [
  { name: 'Bridge of Weir hide', detail: '11 hides, 62 hours of stitching' },
  { name: 'Machined rotary console', detail: 'Billet aluminium, knurled by hand' },
  { name: 'Halo ambient system', detail: '27 light sources, candle graded' },
  { name: 'Sonus Faber concert audio', detail: '1,420 W, 23 transducers' },
]

export default function InteriorSection() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-9%', '2%'])
  const floatY = useTransform(scrollYProgress, [0, 1], ['16%', '-16%'])

  return (
    <section id="interior" className="interior" ref={ref}>
      <div className="container interior__grid">
        <div className="interior__media">
          <motion.div style={reduced ? undefined : { y: imgY, height: '100%' }}>
            <SmartImage
              asset={IMG.interiorMain}
              fallback={IMG.cabinLuxury}
              width={1600}
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </motion.div>
          <motion.div className="interior__floating" style={reduced ? undefined : { y: floatY }}>
            <SmartImage asset={IMG.steeringWheel} fallback={IMG.cockpitArea} width={800} sizes="22vw" />
          </motion.div>
        </div>

        <div className="interior__content">
          <Reveal mode="rise">
            <span className="kicker">The cabin</span>
          </Reveal>
          <h2 className="h-display">
            <Reveal delay={0.06}>A drawing room</Reveal>
            <Reveal delay={0.16}>at 350 km/h.</Reveal>
          </h2>
          <Reveal mode="rise" delay={0.22}>
            <p>
              Sixty hours of saddlery for every cockpit. Nothing printed, nothing implied.
              If it looks like metal, it is metal. If it looks like silence, it is engineered silence.
            </p>
          </Reveal>
          <ul className="interior__list">
            {FEATURES.map((feature, i) => (
              <motion.li
                key={feature.name}
                initial={{ opacity: 0, x: 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <strong>{feature.name}</strong>
                <span>{feature.detail}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
