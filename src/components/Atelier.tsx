import { motion } from 'framer-motion'
import { FILM, IMG, type ImageAsset } from '../data/media'
import SmartImage from './ui/SmartImage'
import SmartVideo from './ui/SmartVideo'
import Reveal from './ui/Reveal'

const CELLS: { asset: ImageAsset; cap: string; cls: string }[] = [
  { asset: IMG.redLifestyle, cap: 'Rosso Aurelius — golden hour', cls: 'atelier__cell--b' },
  { asset: IMG.hypercarHighway, cap: 'Grand touring, Apennines', cls: 'atelier__cell--c' },
  { asset: IMG.duskRoadster, cap: 'Velox at golden hour', cls: 'atelier__cell--d' },
  { asset: IMG.cityLights, cap: 'The night district', cls: 'atelier__cell--e' },
]

export default function Atelier() {
  return (
    <section id="atelier" className="atelier">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal mode="rise">
              <span className="kicker">The atelier journal</span>
            </Reveal>
            <h2 className="h-display">
              <Reveal delay={0.08}>Scenes from</Reveal>
              <Reveal delay={0.18}>the marque.</Reveal>
            </h2>
          </div>
          <Reveal mode="rise" delay={0.2}>
            <p>
              Film and photography from our test routes, paint studios and the long roads between —
              shot on real tarmac, never rendered.
            </p>
          </Reveal>
        </div>

        <div className="atelier__grid">
          <motion.figure
            className="atelier__cell atelier__cell--a"
            initial={{ opacity: 0, y: 56 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6% 0px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <SmartVideo asset={FILM.atelier} posterWidth={1400} />
            <figcaption>Paint study — 24 fps</figcaption>
          </motion.figure>

          {CELLS.map((cell, i) => (
            <motion.figure
              className={`atelier__cell ${cell.cls}`}
              key={cell.cap}
              data-hover
              initial={{ opacity: 0, y: 56 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.9, delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <SmartImage asset={cell.asset} fallback={IMG.classicMotion} width={1200} sizes="(max-width: 760px) 100vw, 40vw" />
              <figcaption>{cell.cap}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
