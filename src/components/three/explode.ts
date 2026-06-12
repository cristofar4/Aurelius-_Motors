/** Shared between the scroll HUD and the 3D scene — deliberately three.js-free
 *  so the heavy renderer chunk stays lazy. */

export interface SceneDrive {
  /** section scroll progress 0–1 */
  p: number
  /** normalised cursor −0.5…0.5 */
  mx: number
  my: number
}

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

/** the act in three movements:
 *  comes apart on arrival, holds for inspection, rebuilds, then departs */
export const explodeOf = (p: number) => smooth(0.02, 0.14, p) * (1 - smooth(0.34, 0.62, p))

/** departure: wheels up, squat, and out of frame */
export const driveOf = (p: number) => smooth(0.72, 0.96, p)
