import { useLenis } from '../App'

export default function Footer() {
  const lenis = useLenis()
  const go = (target: string) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6 })
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="nav__logo">
              AURELIUS <span>MOTORS</span>
            </span>
            <p>
              Coachbuilt grand tourers and hypercars, composed, not assembled. The Aurelius
              atelier, est. MMXXVI.
            </p>
          </div>
          <div>
            <h4>Marque</h4>
            <ul>
              <li><button onClick={() => go('#showcase')}>The film</button></li>
              <li><button onClick={() => go('#lineup')}>Lineup</button></li>
              <li><button onClick={() => go('#engineering')}>Engineering</button></li>
              <li><button onClick={() => go('#interior')}>Interior</button></li>
            </ul>
          </div>
          <div>
            <h4>House</h4>
            <ul>
              <li><button onClick={() => go('#atelier')}>Atelier journal</button></li>
              <li><button onClick={() => go('#commission')}>Commissions</button></li>
              <li><button onClick={() => go('#top')}>Back to top</button></li>
            </ul>
          </div>
          <div>
            <h4>Media credits</h4>
            <ul>
              <li>
                <a href="https://unsplash.com" target="_blank" rel="noreferrer">
                  Photography: Unsplash artists
                </a>
              </li>
              <li>
                <a href="https://www.pexels.com" target="_blank" rel="noreferrer">
                  Film: Pexels (Ojyrai Films, Taryn Elliott)
                </a>
              </li>
              <li>
                <a href="https://mixkit.co" target="_blank" rel="noreferrer">
                  Film: Mixkit
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__meta">
          <span>© MMXXVI Aurelius Motors. A fictional marque, presented as a design study.</span>
          <span className="credits">
            All photography and film are real-world, royalty-free works by their credited artists,
            served via Unsplash, Pexels and Mixkit. No placeholders, no generated imagery.
          </span>
        </div>
      </div>
    </footer>
  )
}
