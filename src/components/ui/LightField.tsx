import { useEffect, useRef } from 'react'

/** A soft volumetric glow that trails the cursor across the dark surfaces —
 *  the page lights up where you look. Fine pointers only, rAF-throttled. */
export default function LightField() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight * 0.4
    let curX = targetX
    let curY = targetY
    let raf = 0

    const move = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }
    const loop = () => {
      curX += (targetX - curX) * 0.09
      curY += (targetY - curY) * 0.09
      el.style.background = `radial-gradient(620px at ${curX.toFixed(1)}px ${curY.toFixed(1)}px, rgba(250, 250, 250, 0.05), transparent 65%)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="lightfield" aria-hidden="true" />
}
