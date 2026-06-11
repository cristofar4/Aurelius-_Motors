import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const WORD = 'AURELIUS'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const started = performance.now()
    let raf = 0
    const tick = (now: number) => {
      // ease toward 100 over ~2s — feels measured, not busy
      const t = Math.min((now - started) / 2000, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        setTimeout(() => {
          setGone(true)
          onDone()
        }, 350)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader__inner">
            <div className="preloader__word" aria-label={WORD}>
              {WORD.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.055, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
