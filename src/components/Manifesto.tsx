import { motion } from 'framer-motion'

const LINE: { text: string; accent?: boolean }[] = [
  { text: 'We' },
  { text: 'do' },
  { text: 'not' },
  { text: 'build' },
  { text: 'cars.' },
  { text: 'We' },
  { text: 'compose' },
  { text: 'motion,', accent: true },
  { text: 'one' },
  { text: 'machine' },
  { text: 'at' },
  { text: 'a' },
  { text: 'time.' },
]

export default function Manifesto() {
  return (
    <section className="manifesto">
      <div className="container">
        <motion.p
          className="kicker"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1 }}
        >
          The Aurelius credo
        </motion.p>
        <blockquote className="manifesto__quote">
          {LINE.map((word, i) => (
            <motion.span
              key={i}
              className={`word ${word.accent ? 'accent' : ''}`}
              initial={{ opacity: 0.08, y: 14, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-18% 0px' }}
              transition={{ duration: 0.7, delay: i * 0.055, ease: [0.16, 1, 0.3, 1] }}
            >
              {word.text}
            </motion.span>
          ))}
        </blockquote>
      </div>
    </section>
  )
}
