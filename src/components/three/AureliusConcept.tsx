import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, PerspectiveCamera } from '@react-three/drei'
import { explodeOf, smooth, type SceneDrive } from './explode'

/* ------------------------------------------------------------------ */
/*  materials & geometry                                               */
/* ------------------------------------------------------------------ */

function useMaterials() {
  return useMemo(() => {
    const paint = new THREE.MeshPhysicalMaterial({
      color: '#111116',
      metalness: 0.9,
      roughness: 0.28,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.5,
    })
    const gold = new THREE.MeshStandardMaterial({
      color: '#c8a45c',
      metalness: 1,
      roughness: 0.28,
      envMapIntensity: 1.4,
    })
    const goldBright = new THREE.MeshStandardMaterial({
      color: '#e3c98e',
      metalness: 1,
      roughness: 0.18,
      envMapIntensity: 1.6,
    })
    const darkMetal = new THREE.MeshStandardMaterial({
      color: '#1d1d23',
      metalness: 0.85,
      roughness: 0.42,
    })
    const carbon = new THREE.MeshStandardMaterial({
      color: '#121216',
      metalness: 0.4,
      roughness: 0.52,
    })
    const glass = new THREE.MeshPhysicalMaterial({
      color: '#0b0e14',
      metalness: 0.1,
      roughness: 0.06,
      transparent: true,
      opacity: 0.46,
      envMapIntensity: 2.2,
    })
    const tire = new THREE.MeshStandardMaterial({ color: '#0b0b0c', roughness: 0.94, metalness: 0 })
    const headlight = new THREE.MeshStandardMaterial({
      color: '#fff7e2',
      emissive: '#ffeec2',
      emissiveIntensity: 4,
    })
    const taillight = new THREE.MeshStandardMaterial({
      color: '#3a0a06',
      emissive: '#ff2417',
      emissiveIntensity: 3,
    })
    return { paint, gold, goldBright, darkMetal, carbon, glass, tire, headlight, taillight }
  }, [])
}

function useBodyGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-2.32, 0.6)
    s.quadraticCurveTo(-1.55, 0.78, -0.9, 0.82)
    s.quadraticCurveTo(-0.18, 0.89, 0.12, 0.85)
    s.quadraticCurveTo(0.75, 0.73, 1.3, 0.58)
    s.quadraticCurveTo(1.95, 0.47, 2.34, 0.4)
    s.lineTo(2.38, 0.18)
    s.quadraticCurveTo(1.6, 0.12, 0.8, 0.13)
    s.lineTo(-1.0, 0.13)
    s.quadraticCurveTo(-1.9, 0.12, -2.3, 0.19)
    s.closePath()
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 1.46,
      bevelEnabled: true,
      bevelThickness: 0.24,
      bevelSize: 0.18,
      bevelSegments: 6,
      steps: 1,
      curveSegments: 24,
    })
    geo.translate(0, 0, -0.73)
    return geo
  }, [])
}

function useCanopyGeometry() {
  return useMemo(() => {
    const g = new THREE.Shape()
    g.moveTo(-1.18, 0.76)
    g.quadraticCurveTo(-0.42, 1.0, 0.14, 0.96)
    g.quadraticCurveTo(0.68, 0.86, 1.04, 0.6)
    g.quadraticCurveTo(0.2, 0.7, -0.62, 0.68)
    g.closePath()
    const geo = new THREE.ExtrudeGeometry(g, {
      depth: 0.96,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.1,
      bevelSegments: 4,
      curveSegments: 20,
    })
    geo.translate(0, 0, -0.48)
    return geo
  }, [])
}

function useSpringGeometry() {
  return useMemo(() => {
    const pts: THREE.Vector3[] = []
    const coils = 5.5
    for (let i = 0; i <= 90; i++) {
      const t = i / 90
      const a = t * Math.PI * 2 * coils
      pts.push(new THREE.Vector3(Math.cos(a) * 0.075, t * 0.3 - 0.15, Math.sin(a) * 0.075))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 140, 0.015, 8)
  }, [])
}

/* ------------------------------------------------------------------ */
/*  sub-assemblies                                                     */
/* ------------------------------------------------------------------ */

const WHEEL_POS = [
  { x: 1.48, z: 0.86, front: true },
  { x: 1.48, z: -0.86, front: true },
  { x: -1.42, z: 0.86, front: false },
  { x: -1.42, z: -0.86, front: false },
]

function Wheel({ mats }: { mats: ReturnType<typeof useMaterials> }) {
  const spokes = useMemo(() => Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2), [])
  return (
    <group>
      <mesh material={mats.tire}>
        <torusGeometry args={[0.26, 0.09, 18, 44]} />
      </mesh>
      <mesh material={mats.darkMetal} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.19, 0.19, 0.05, 28]} />
      </mesh>
      {spokes.map((angle) => (
        <mesh key={angle} material={mats.gold} rotation-z={angle} position={[0, 0, 0.03]}>
          <boxGeometry args={[0.05, 0.4, 0.035]} />
        </mesh>
      ))}
      <mesh material={mats.goldBright} rotation-x={Math.PI / 2} position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.055, 0.055, 0.07, 20]} />
      </mesh>
      {/* brake disc + caliper */}
      <mesh material={mats.darkMetal} rotation-x={Math.PI / 2} position={[0, 0, -0.09]}>
        <cylinderGeometry args={[0.18, 0.18, 0.025, 32]} />
      </mesh>
      <mesh material={mats.gold} position={[0.13, 0.12, -0.09]} rotation-z={-0.7}>
        <boxGeometry args={[0.09, 0.16, 0.06]} />
      </mesh>
    </group>
  )
}

function Engine({ mats }: { mats: ReturnType<typeof useMaterials> }) {
  return (
    <group>
      <mesh material={mats.darkMetal}>
        <boxGeometry args={[0.64, 0.34, 0.5]} />
      </mesh>
      <mesh material={mats.gold} position={[0, 0.2, 0.16]} rotation-x={0.24}>
        <boxGeometry args={[0.6, 0.08, 0.17]} />
      </mesh>
      <mesh material={mats.gold} position={[0, 0.2, -0.16]} rotation-x={-0.24}>
        <boxGeometry args={[0.6, 0.08, 0.17]} />
      </mesh>
      <mesh material={mats.darkMetal} position={[0, 0.32, 0]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.085, 0.085, 0.52, 18]} />
      </mesh>
      {[-0.22, -0.09, 0.04, 0.17].map((x) => (
        <group key={x}>
          <mesh material={mats.goldBright} position={[x, 0.42, 0.1]}>
            <cylinderGeometry args={[0.032, 0.026, 0.1, 12]} />
          </mesh>
          <mesh material={mats.goldBright} position={[x, 0.42, -0.1]}>
            <cylinderGeometry args={[0.032, 0.026, 0.1, 12]} />
          </mesh>
        </group>
      ))}
      {/* exhausts */}
      <mesh material={mats.darkMetal} position={[-0.46, -0.06, 0.13]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.045, 0.045, 0.5, 14]} />
      </mesh>
      <mesh material={mats.darkMetal} position={[-0.46, -0.06, -0.13]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.045, 0.045, 0.5, 14]} />
      </mesh>
    </group>
  )
}

function SuspensionCorner({ mats, springGeo }: { mats: ReturnType<typeof useMaterials>; springGeo: THREE.TubeGeometry }) {
  return (
    <group>
      <mesh geometry={springGeo} material={mats.gold} />
      <mesh material={mats.darkMetal}>
        <cylinderGeometry args={[0.026, 0.026, 0.3, 12]} />
      </mesh>
      <mesh material={mats.darkMetal} position={[0, -0.1, 0.14]} rotation-x={0.5}>
        <boxGeometry args={[0.05, 0.03, 0.3]} />
      </mesh>
      <mesh material={mats.darkMetal} position={[0, 0.1, 0.14]} rotation-x={-0.5}>
        <boxGeometry args={[0.05, 0.03, 0.3]} />
      </mesh>
    </group>
  )
}

function Chassis({ mats }: { mats: ReturnType<typeof useMaterials> }) {
  return (
    <group>
      <mesh material={mats.darkMetal} position={[0, 0, 0.55]}>
        <boxGeometry args={[3.9, 0.08, 0.09]} />
      </mesh>
      <mesh material={mats.darkMetal} position={[0, 0, -0.55]}>
        <boxGeometry args={[3.9, 0.08, 0.09]} />
      </mesh>
      {[-1.6, -0.5, 0.6, 1.6].map((x) => (
        <mesh key={x} material={mats.darkMetal} position={[x, 0, 0]}>
          <boxGeometry args={[0.07, 0.06, 1.12]} />
        </mesh>
      ))}
      <mesh material={mats.carbon} position={[0, -0.06, 0]}>
        <boxGeometry args={[3.6, 0.022, 1.3]} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  the car                                                            */
/* ------------------------------------------------------------------ */

function ConceptCar({ drive }: { drive: React.MutableRefObject<SceneDrive> }) {
  const mats = useMaterials()
  const bodyGeo = useBodyGeometry()
  const canopyGeo = useCanopyGeometry()
  const springGeo = useSpringGeometry()

  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const canopy = useRef<THREE.Group>(null)
  const wing = useRef<THREE.Group>(null)
  const engine = useRef<THREE.Group>(null)
  const chassis = useRef<THREE.Group>(null)
  const splitter = useRef<THREE.Group>(null)
  const diffuser = useRef<THREE.Group>(null)
  const wheels = useRef<(THREE.Group | null)[]>([])
  const wheelSpin = useRef<(THREE.Group | null)[]>([])
  const susp = useRef<(THREE.Group | null)[]>([])

  const state = useRef({ e: 0, rot: -0.6, mx: 0, my: 0 })

  useFrame((three, delta) => {
    const { p, mx, my } = drive.current
    const s = state.current
    const dt = Math.min(delta, 0.05)

    s.e = THREE.MathUtils.damp(s.e, explodeOf(p), 5.2, dt)
    s.mx = THREE.MathUtils.damp(s.mx, mx, 4.4, dt)
    s.my = THREE.MathUtils.damp(s.my, my, 4.4, dt)

    const e = s.e
    const sweep = -0.62 + p * 3.9 + Math.sin(three.clock.elapsedTime * 0.16) * 0.05

    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, sweep + s.mx * 0.5, 5.6, dt)
      root.current.rotation.x = s.my * 0.1
      const beauty = 1 + smooth(0.86, 1, p) * 0.05
      root.current.scale.setScalar(beauty)
    }

    if (body.current) body.current.position.y = e * 1.5
    if (canopy.current) canopy.current.position.y = e * 2.3
    if (wing.current) {
      wing.current.position.y = e * 1.9
      wing.current.position.x = e * -0.45
    }
    if (engine.current) {
      engine.current.position.set(-1.05 - e * 0.95, 0.46 + e * 0.7, 0)
      engine.current.rotation.y = e * 0.7
    }
    if (chassis.current) chassis.current.position.y = 0.2 - e * 0.85
    if (splitter.current) splitter.current.position.set(2.12 + e * 0.5, 0.12 - e * 0.62, 0)
    if (diffuser.current) diffuser.current.position.set(-2.12 - e * 0.5, 0.16 - e * 0.62, 0)

    WHEEL_POS.forEach((w, i) => {
      const wheel = wheels.current[i]
      if (wheel) {
        const side = Math.sign(w.z)
        wheel.position.set(
          w.x + (w.front ? 0.3 : -0.3) * e,
          0.35,
          w.z + side * 1.22 * e,
        )
      }
      const spin = wheelSpin.current[i]
      // far-side wheel groups are mirrored about Y — compensate so both sides roll forward
      if (spin) spin.rotation.z -= dt * (1 - e) * 1.6 * Math.sign(w.z)
      const corner = susp.current[i]
      if (corner) {
        const side = Math.sign(w.z)
        corner.position.set(w.x, 0.35 - e * 0.12, w.z * 0.7 + side * 0.5 * e)
      }
    })
  })

  return (
    <group ref={root} position={[0, -0.42, 0]}>
      {/* body shell + lights + skirts */}
      <group ref={body}>
        <mesh geometry={bodyGeo} material={mats.paint} />
        <mesh material={mats.headlight} position={[2.32, 0.42, 0.58]} rotation-y={0.42}>
          <boxGeometry args={[0.04, 0.04, 0.34]} />
        </mesh>
        <mesh material={mats.headlight} position={[2.32, 0.42, -0.58]} rotation-y={-0.42}>
          <boxGeometry args={[0.04, 0.04, 0.34]} />
        </mesh>
        <mesh material={mats.taillight} position={[-2.34, 0.52, 0]}>
          <boxGeometry args={[0.035, 0.04, 1.46]} />
        </mesh>
        <mesh material={mats.carbon} position={[0.1, 0.13, 0.93]}>
          <boxGeometry args={[2.5, 0.1, 0.07]} />
        </mesh>
        <mesh material={mats.carbon} position={[0.1, 0.13, -0.93]}>
          <boxGeometry args={[2.5, 0.1, 0.07]} />
        </mesh>
      </group>

      <group ref={canopy}>
        <mesh geometry={canopyGeo} material={mats.glass} />
      </group>

      <group ref={wing} position={[0, 0, 0]}>
        <mesh material={mats.carbon} position={[-2.0, 0.74, 0.42]}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
        </mesh>
        <mesh material={mats.carbon} position={[-2.0, 0.74, -0.42]}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
        </mesh>
        <mesh material={mats.carbon} position={[-2.05, 0.88, 0]} rotation-z={0.16}>
          <boxGeometry args={[0.34, 0.026, 1.58]} />
        </mesh>
        <mesh material={mats.gold} position={[-2.18, 0.84, 0]} rotation-z={0.16}>
          <boxGeometry args={[0.04, 0.02, 1.58]} />
        </mesh>
      </group>

      <group ref={engine} position={[-1.05, 0.46, 0]}>
        <Engine mats={mats} />
      </group>

      <group ref={chassis} position={[0, 0.2, 0]}>
        <Chassis mats={mats} />
      </group>

      <group ref={splitter} position={[2.12, 0.12, 0]}>
        <mesh material={mats.carbon}>
          <boxGeometry args={[0.52, 0.03, 1.74]} />
        </mesh>
      </group>

      <group ref={diffuser} position={[-2.12, 0.16, 0]}>
        {[-0.42, -0.21, 0, 0.21, 0.42].map((z) => (
          <mesh key={z} material={mats.carbon} position={[0, 0, z]} rotation-z={-0.42}>
            <boxGeometry args={[0.4, 0.15, 0.02]} />
          </mesh>
        ))}
      </group>

      {WHEEL_POS.map((w, i) => (
        <group key={i} ref={(el) => (wheels.current[i] = el)} position={[w.x, 0.35, w.z]}>
          <group ref={(el) => (wheelSpin.current[i] = el)} rotation-y={w.z > 0 ? 0 : Math.PI}>
            <Wheel mats={mats} />
          </group>
        </group>
      ))}

      {WHEEL_POS.map((w, i) => (
        <group key={i} ref={(el) => (susp.current[i] = el)} position={[w.x, 0.35, w.z * 0.7]}>
          <SuspensionCorner mats={mats} springGeo={springGeo} />
        </group>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  full scene                                                         */
/* ------------------------------------------------------------------ */

function Rig({ drive }: { drive: React.MutableRefObject<SceneDrive> }) {
  const cam = useRef<THREE.PerspectiveCamera>(null)
  useFrame((_, delta) => {
    const { p, mx, my } = drive.current
    const dt = Math.min(delta, 0.05)
    const e = explodeOf(p)
    const camera = cam.current
    if (!camera) return
    // dolly out and rise as the car comes apart, so the full stack stays framed
    camera.position.x = THREE.MathUtils.damp(camera.position.x, 5.6 + mx * 0.9, 4, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.85 + e * 1.5 + my * 0.5, 4, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 6.3 + e * 1.1, 4, dt)
    camera.lookAt(0, 0.22 + e * 0.5, 0)
  })
  return <PerspectiveCamera ref={cam} makeDefault fov={31} position={[5.6, 1.85, 6.3]} near={0.1} far={60} />
}

export default function AureliusScene({ drive }: { drive: React.MutableRefObject<SceneDrive> }) {
  return (
    <>
      <Rig drive={drive} />
      <ambientLight intensity={0.25} />
      <spotLight position={[6, 9, 4]} angle={0.5} penumbra={0.8} intensity={120} color="#fff2da" castShadow={false} />
      <spotLight position={[-7, 4, -6]} angle={0.6} penumbra={1} intensity={60} color="#8aa2ff" />

      <ConceptCar drive={drive} />

      {/* stage */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.435, 0]}>
        <circleGeometry args={[4.4, 64]} />
        <meshStandardMaterial color="#0b0b0e" roughness={0.85} metalness={0.4} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.428, 0]}>
        <ringGeometry args={[3.35, 3.38, 96]} />
        <meshBasicMaterial color="#c8a45c" transparent opacity={0.32} />
      </mesh>
      <ContactShadows position={[0, -0.43, 0]} opacity={0.62} scale={13} blur={2.4} far={3.4} resolution={512} color="#000000" />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={5} position={[0, 4, 0]} rotation-x={Math.PI / 2} scale={[9, 4, 1]} color="#fff4dd" />
        <Lightformer intensity={3} position={[-5, 1.6, 3.5]} rotation-y={Math.PI / 3.2} scale={[4.5, 1.1, 1]} color="#c8a45c" />
        <Lightformer intensity={3} position={[5, 1.4, -3.5]} rotation-y={-Math.PI / 3.2} scale={[4.5, 1.1, 1]} color="#93acff" />
        <Lightformer intensity={1.6} position={[0, 1.2, 5.4]} scale={[7, 2.2, 1]} color="#ffffff" />
        <Lightformer intensity={1.1} position={[0, 0.6, -5.6]} rotation-y={Math.PI} scale={[7, 1.6, 1]} color="#f2efe9" />
      </Environment>
    </>
  )
}
