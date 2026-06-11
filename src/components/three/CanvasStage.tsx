import { Canvas } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import AureliusScene from './AureliusConcept'
import type { SceneDrive } from './explode'

interface Props {
  drive: MutableRefObject<SceneDrive>
  active: boolean
}

/** Split into its own chunk so three.js loads only when the section nears. */
export default function CanvasStage({ drive, active }: Props) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <AureliusScene drive={drive} />
    </Canvas>
  )
}
