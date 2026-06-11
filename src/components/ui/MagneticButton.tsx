import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  onClick?: () => void
  strength?: number
}

/** Button that leans toward the cursor — classic premium micro-interaction. */
export default function MagneticButton({ children, className, onClick, strength = 0.32 }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.5 })

  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
