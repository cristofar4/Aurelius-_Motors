# Aurelius Motors — The Art of Velocity

A cinematic, Awwwards-style automotive experience for a fictional luxury marque.
Built like a premium car commercial: full-bleed film, scroll-driven cinematography,
and a real-time 3D exploded-view engineering sequence.

![Hero](https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop)

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## The experience

| Section | What happens |
| --- | --- |
| **Hero** | Real 4K automotive film (sports car at speed through city light), quality-adaptive source selection, silent autoplay, cursor-parallax typography |
| **Showcase** | Pinned scroll sequence — the car approaches from darkness, the camera drifts around it, the environment crossfades day → dusk → night, the lighting grade shifts, with motion-blur cuts |
| **Lineup** | Three models on mouse-reactive 3D tilt cards with glare sheen |
| **Engineering** | Three.js / React Three Fiber exploded view — a procedurally built concept car breaks into body, canopy, engine, wheels, suspension and chassis as you scroll, then reassembles. Reacts to cursor and scroll |
| **Interior / Details** | Parallax cabin editorial + a vertical-scroll-driven horizontal tracking shot across cockpit, wheels and powertrain details |
| **Night Drive / Atelier** | Ambient night-city film, animated spec counters, editorial film & photo grid |

## Stack

- **Vite + React 18 + TypeScript**
- **Three.js + @react-three/fiber + drei** — exploded-view scene, custom Lightformer
  environment (no external HDR fetch), contact shadows, physical clear-coat paint
- **Framer Motion** — scroll choreography, color-grade interpolation, counters
- **Lenis** — inertial smooth scrolling

## Media policy — real footage only

Every still is professional automotive photography served from Unsplash; every film
clip is real footage served from Pexels / Mixkit CDNs (royalty-free licenses, artists
credited in the footer and in `src/data/media.ts`). No placeholders, no AI imagery.

Resilience: every video slot carries an ordered chain of verified sources — the
browser falls through `<source>` to `<source>`, and finally to a verified photographic
poster. Stills carry a verified fallback asset. The page never shows a broken frame.

## Performance

- three.js ships as a **lazy chunk** (~243 kB gz) that loads only when the
  Engineering section approaches; initial JS is ~105 kB gz
- The WebGL frameloop fully stops when the section leaves the viewport
- Below-fold videos use `preload="metadata"` + IntersectionObserver play/pause
- Responsive `srcset` for all Unsplash imagery; `preconnect` to media CDNs
- `prefers-reduced-motion` swaps pinned cinematics for calm editorial layouts

## Visual verification

`verify-visual.mjs` drives the production build through real Chromium — walks every
scroll chapter, exercises hover states, screenshots each section to `/tmp/aurelius-shots`,
and reports console/page errors. It needs Playwright (not a project dependency):

```bash
npm i --no-save playwright && npx playwright install chromium
npm run build && npm run preview &   # serves on :4848
node verify-visual.mjs
```
