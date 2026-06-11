import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  delay?: number
  /** vertical line-mask reveal (default) or simple fade-rise */
  mode?: 'mask' | 'rise'
  className?: string
}

/** Editorial line reveal — text rises out of an overflow mask. */
export default function Reveal({ children, delay = 0, mode = 'mask', className }: Props) {
  if (mode === 'rise') {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    )
  }
  // Observe the wrapper, not the clipped child: a span translated 112% inside
  // overflow:hidden has zero intersection area, so whileInView on it would
  // never fire. Variants propagate the trigger downward instead.
  return (
    <motion.span
      className={`reveal-line ${className ?? ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
    >
      <motion.span
        variants={{
          hidden: { y: '112%' },
          visible: { y: 0, transition: { duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}
