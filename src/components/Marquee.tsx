import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'

const ITEMS = [
  'Imperator GT',
  '1,180 PS',
  '0–100 in 2.4 s',
  'Hand laid carbon',
  'V12 · 9,200 rpm',
  'Velox RS',
  '820 kg downforce',
  'Noctis E',
  '1.9 s to 100',
]

export default function Marquee() {
  // the ribbon leans into your scroll speed, then settles
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const skew = useSpring(useTransform(velocity, [-1400, 1400], [4, -4]), {
    stiffness: 140,
    damping: 28,
  })

  const row = (
    <div className="marquee__row">
      {ITEMS.map((item) => (
        <span className="marquee__item" key={item}>
          <i /> {item}
        </span>
      ))}
    </div>
  )
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div style={{ skewX: skew }}>
        <div className="marquee__track">
          {row}
          {row}
        </div>
      </motion.div>
    </div>
  )
}
