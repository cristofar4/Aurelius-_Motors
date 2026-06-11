import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLenis } from '../App'

const LINKS: { label: string; target: string }[] = [
  { label: 'Marque', target: '#showcase' },
  { label: 'Lineup', target: '#lineup' },
  { label: 'Engineering', target: '#engineering' },
  { label: 'Interior', target: '#interior' },
  { label: 'Atelier', target: '#atelier' },
]

export default function Navbar() {
  const lenis = useLenis()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (target: string) => {
    setOpen(false)
    if (lenis) lenis.scrollTo(target, { duration: 1.6 })
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        className={`nav ${solid ? 'nav--solid' : ''}`}
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ delay: 2.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container nav__inner">
          <button className="nav__logo" onClick={() => go('#top')} aria-label="Aurelius Motors — home">
            AURELIUS <span>MOTORS</span>
          </button>
          <nav aria-label="Primary">
            <ul className="nav__links">
              {LINKS.map((link) => (
                <li key={link.target}>
                  <button onClick={() => go(link.target)}>{link.label}</button>
                </li>
              ))}
            </ul>
          </nav>
          <button className="btn nav__cta" onClick={() => go('#commission')}>
            Commission
          </button>
          <button
            className={`nav__burger ${open ? 'open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <i /> <i /> <i />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav__mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-label="Mobile"
          >
            {LINKS.map((link, i) => (
              <motion.button
                key={link.target}
                onClick={() => go(link.target)}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06 }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              className="btn"
              onClick={() => go('#commission')}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              Commission
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
