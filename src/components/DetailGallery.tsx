import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { IMG, type ImageAsset } from '../data/media'
import SmartImage from './ui/SmartImage'

const PANELS: { asset: ImageAsset; cap: string }[] = [
  { asset: IMG.cockpitArea, cap: 'Driver axis' },
  { asset: IMG.wheelGloss, cap: 'Forged 21 inch wheel' },
  { asset: IMG.engineClassic, cap: 'Hand finished plenum' },
  { asset: IMG.cabinLuxury, cap: 'Saddlery atelier' },
  { asset: IMG.wheelForged, cap: 'Carbide brake assembly' },
  { asset: IMG.gauges, cap: 'Machined switchgear' },
]

/** vertical scroll drives a horizontal tracking shot across the details */
export default function DetailGallery() {
  const ref = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [travel, setTravel] = useState(0)

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setTravel(Math.max(track.scrollWidth - window.innerWidth, 0))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const raw = useTransform(scrollYProgress, [0.04, 0.97], [0, -travel])
  const x = useSpring(raw, { stiffness: 140, damping: 27, mass: 0.4 })

  if (reduced) {
    return (
      <section style={{ padding: 'clamp(4rem,9vh,7rem) 0', background: 'var(--ink)' }}>
        <div className="container">
          <span className="kicker">Obsession, itemised</span>
          <div style={{ display: 'grid', gap: '1.4rem', marginTop: '2rem' }}>
            {PANELS.map((panel) => (
              <figure key={panel.cap} className="gallery__panel" style={{ width: '100%' }}>
                <SmartImage asset={panel.asset} fallback={IMG.interiorDetail} width={1400} />
                <figcaption className="gallery__cap">{panel.cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="gallery" ref={ref}>
      <div className="gallery__stage">
        <div className="gallery__header">
          <span className="kicker">Obsession, itemised</span>
          <h2 className="h-display">The thousand details</h2>
        </div>
        <motion.div className="gallery__track" ref={trackRef} style={{ x }}>
          {PANELS.map((panel) => (
            <figure className="gallery__panel" key={panel.cap} data-hover>
              <SmartImage
                asset={panel.asset}
                fallback={IMG.interiorDetail}
                width={1280}
                sizes="44vw"
              />
              <figcaption className="gallery__cap">{panel.cap}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
