import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const WORD = 'AURELIUS'
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const started = performance.now()
    let raf = 0
    const tick = (now: number) => {
      // brisk ramp — a beat of brand, never a wait
      const t = Math.min((now - started) / 1050, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        setTimeout(() => {
          setGone(true)
          onDone()
        }, 180)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div className="preloader" exit={{ transition: { duration: 1 } }}>
          {/* the stage curtain parts to reveal the hero */}
          <motion.div
            className="preloader__panel preloader__panel--top"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.95, ease: CURTAIN_EASE }}
          />
          <motion.div
            className="preloader__panel preloader__panel--bottom"
            exit={{ y: '100%' }}
            transition={{ duration: 0.95, ease: CURTAIN_EASE, delay: 0.04 }}
          />
          <motion.div
            className="preloader__inner"
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: 'easeIn' }}
          >
            <div className="preloader__word" aria-label={WORD} style={{ perspective: 600 }}>
              {WORD.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%', rotateX: -70, opacity: 0 }}
                  animate={{ y: 0, rotateX: 0, opacity: 1 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="preloader__rule"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: count / 100 }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
            <div className="preloader__meta">
              <span>Motorwerk · Est. MMXXVI</span>
              <span className="preloader__count">{String(count).padStart(3, '0')}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
