import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'

import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Showcase from './components/Showcase'
import Manifesto from './components/Manifesto'
import Lineup from './components/Lineup'
import Engineering from './components/Engineering'
import InteriorSection from './components/InteriorSection'
import DetailGallery from './components/DetailGallery'
import NightDrive from './components/NightDrive'
import SpecsSection from './components/SpecsSection'
import Atelier from './components/Atelier'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import PrecisionCursor from './components/ui/PrecisionCursor'
import LightField from './components/ui/LightField'

const LenisContext = createContext<Lenis | null>(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useLenis = () => useContext(LenisContext)

export default function App() {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1.05,
    })
    let frame = 0
    const loop = (time: number) => {
      instance.raf(time)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    setLenis(instance)
    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
    }
  }, [])

  // hold the page still while the marque draws itself
  useEffect(() => {
    if (!lenis) return
    if (booted) lenis.start()
    else lenis.stop()
  }, [lenis, booted])

  // stable identity — Preloader's effect keys off this callback
  const handleBooted = useCallback(() => setBooted(true), [])

  return (
    <LenisContext.Provider value={lenis}>
      <Preloader onDone={handleBooted} />
      <LightField />
      <PrecisionCursor />
      <Navbar />
      <main>
        <Hero interactive={booted} />
        <Marquee />
        <Showcase />
        <Manifesto />
        <Lineup />
        <Engineering />
        <InteriorSection />
        <DetailGallery />
        <NightDrive />
        <SpecsSection />
        <Atelier />
        <FinalCta />
      </main>
      <Footer />
    </LenisContext.Provider>
  )
}
