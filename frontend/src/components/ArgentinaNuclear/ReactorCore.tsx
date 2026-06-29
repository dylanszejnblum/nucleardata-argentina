'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

/**
 * ReactorCore — the signature Three.js hero: an Embalse CANDU-6 cutaway.
 *
 * Argentina's commercial fleet is PHWR. Embalse is a CANDU-6: a HORIZONTAL
 * calandria tank full of low-pressure D₂O moderator, pierced by hundreds of
 * horizontal pressure tubes that hold the 37-element fuel bundles, refueled
 * ON-LOAD by two machines clamped to the circular end faces. That silhouette
 * — the tube-face lattice and the twin refueling machines — is the single
 * most unmistakable reactor shape on earth, and it is genuinely Argentine.
 *
 * The model exposes: horizontal calandria shell, the pressure-tube lattice
 * (visible as a dot pattern on both end faces), one cut-away fuel channel
 * showing its bundle string, two animated refueling machines, vertical
 * shutoff rods, and the D₂O moderator glow. The rig oscillates gently so the
 * end-face lattice and the refuelers read clearly, with pointer parallax.
 *
 * Degrades to a static posed cutaway under prefers-reduced-motion and pauses
 * its render loop when off-screen (`active` false). `shift` offsets the
 * subject horizontally so a hero layout can place it stage-right.
 */

const URANIUM = '#34e89e'
const URANIUM_BRIGHT = '#9bffc4'
const URANIUM_DEEP = '#1f9e6a'
const STEEL = '#0e1411'
const STEEL_LIGHT = '#1a2320'
const TUBE = '#2a3933'

// Calandria geometry — axis lies along Z (horizontal).
const CZ = 3.3 // calandria length
const CR = 1.45 // calandria radius
const TUBE_LEN = CZ * 0.985

/** Hex-packed pressure-tube lattice in the calandria cross-section (XY plane). */
function useTubeLattice(): THREE.Vector3[] {
  return useMemo(() => {
    const s = 0.205
    const out: THREE.Vector3[] = []
    const keep = CR - 0.14
    for (let ring = 0; ring <= 5; ring++) {
      const count = ring === 0 ? 1 : ring * 6
      for (let i = 0; i < count; i++) {
        let x: number
        let y: number
        if (ring === 0) {
          x = 0
          y = 0
        } else {
          const a = (i / count) * Math.PI * 2 + (ring % 2 ? Math.PI / count : 0)
          x = Math.cos(a) * ring * s
          y = Math.sin(a) * ring * s
        }
        if (x * x + y * y > keep * keep) continue
        out.push(new THREE.Vector3(x, y, 0))
      }
    }
    return out
  }, [])
}

/** The highlighted, cut-away fuel channel — a visible spot in ring 2. */
const FUEL_CHANNEL = new THREE.Vector3(0.205 * 1.4, 0.205 * 0.9, 0)
const BUNDLES = 13

function Calandria({ reduced }: { reduced: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (reduced || !glowRef.current) return
    const mat = glowRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.07 + Math.sin(state.clock.elapsedTime * 0.7) * 0.02
  })
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* calandria shell — translucent so the lattice reads through it */}
      <mesh>
        <cylinderGeometry args={[CR, CR, CZ, 72, 1, true]} />
        <meshStandardMaterial
          color={STEEL}
          metalness={0.55}
          roughness={0.18}
          transparent
          opacity={0.11}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* end plates (the tube-face planes) */}
      {[CZ / 2, -CZ / 2].map((z, i) => (
        <mesh key={i} position={[0, z, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[CR - 0.02, CR, 72]} />
          <meshStandardMaterial
            color={STEEL_LIGHT}
            metalness={0.7}
            roughness={0.35}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* D₂O moderator glow column */}
      <mesh ref={glowRef}>
        <cylinderGeometry args={[CR - 0.06, CR - 0.06, CZ - 0.1, 48, 1, true]} />
        <meshBasicMaterial
          color={URANIUM}
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function PressureTubes() {
  const lattice = useTubeLattice()
  const ref = useRef<THREE.InstancedMesh>(null)
  const endsPos = useRef<THREE.InstancedMesh>(null)
  const endsNeg = useRef<THREE.InstancedMesh>(null)

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    lattice.forEach((p, i) => {
      if (ref.current) {
        m.makeTranslation(p.x, p.y, 0)
        ref.current.setMatrixAt(i, m)
      }
      if (endsPos.current) {
        m.makeTranslation(p.x, p.y, CZ / 2)
        endsPos.current.setMatrixAt(i, m)
      }
      if (endsNeg.current) {
        m.makeTranslation(p.x, p.y, -CZ / 2)
        endsNeg.current.setMatrixAt(i, m)
      }
    })
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true
    if (endsPos.current) endsPos.current.instanceMatrix.needsUpdate = true
    if (endsNeg.current) endsNeg.current.instanceMatrix.needsUpdate = true
  }, [lattice])

  const count = lattice.length
  return (
    <group>
      {/* horizontal pressure tubes along Z */}
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, count]}
        castShadow={false}
      >
        <cylinderGeometry args={[0.042, 0.042, TUBE_LEN, 8]} />
        <meshStandardMaterial
          color={TUBE}
          metalness={0.5}
          roughness={0.4}
          emissive={new THREE.Color(URANIUM_DEEP)}
          emissiveIntensity={0.05}
        />
      </instancedMesh>
      {/* bright lattice dots on both end faces — the iconic CANDU tube face */}
      <instancedMesh ref={endsPos} args={[undefined, undefined, count]}>
        <ringGeometry args={[0.05, 0.075, 12]} />
        <meshBasicMaterial color={URANIUM} transparent opacity={0.55} toneMapped={false} side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={endsNeg} args={[undefined, undefined, count]}>
        <ringGeometry args={[0.05, 0.075, 12]} />
        <meshBasicMaterial color={URANIUM} transparent opacity={0.55} toneMapped={false} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  )
}

/** The cut-away fuel channel: a bright tube with its 37-element bundle string visible. */
function FuelChannel({ reduced }: { reduced: boolean }) {
  const bundlesRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (reduced || !bundlesRef.current) return
    const t = state.clock.elapsedTime
    bundlesRef.current.children.forEach((c, i) => {
      const mesh = c as THREE.Mesh
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.4 + Math.sin(t * 1.8 + i * 0.4) * 0.5
    })
  })
  const bundleSpacing = TUBE_LEN / BUNDLES
  return (
    <group position={[FUEL_CHANNEL.x, FUEL_CHANNEL.y, 0]}>
      {/* channel jacket */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, TUBE_LEN, 16, 1, true]} />
        <meshStandardMaterial color={STEEL_LIGHT} metalness={0.6} roughness={0.3} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* bundle string */}
      <group ref={bundlesRef}>
        {Array.from({ length: BUNDLES }).map((_, i) => (
          <mesh key={i} position={[0, 0, -TUBE_LEN / 2 + bundleSpacing * (i + 0.5)]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.058, 0.058, bundleSpacing * 0.82, 14]} />
            <meshStandardMaterial
              color={URANIUM_DEEP}
              emissive={new THREE.Color(URANIUM)}
              emissiveIntensity={1.5}
              metalness={0.2}
              roughness={0.5}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      {/* channel glow */}
      <pointLight color={URANIUM} intensity={4} distance={3} decay={2} />
    </group>
  )
}

/** One refueling machine docked on a calandria end face, aligned with the fuel channel. */
function RefuelingMachine({
  side,
  reduced,
}: {
  side: 1 | -1
  reduced: boolean
}) {
  const snoutRef = useRef<THREE.Group>(null)
  const bundleRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (reduced || !snoutRef.current) return
    const t = state.clock.elapsedTime
    // the snout slowly engages the channel, then retracts — on-load refueling
    const cycle = (Math.sin(t * 0.45 + (side === 1 ? 0 : Math.PI)) + 1) / 2
    const push = cycle * 0.42
    snoutRef.current.position.z = side * (CZ / 2 + 0.62 - push)
    if (bundleRef.current) {
      // a fresh bundle slides in with the snout
      bundleRef.current.position.z = side * (CZ / 2 + 0.32 - push * 0.8)
      const mat = bundleRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.35 + cycle * 0.6
    }
  })
  const zBase = side * (CZ / 2 + 0.62)
  return (
    <group>
      {/* fixed body — the refueler carriage */}
      <group position={[FUEL_CHANNEL.x, FUEL_CHANNEL.y, zBase]}>
        <mesh>
          <boxGeometry args={[0.46, 0.46, 0.5]} />
          <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* carriage rails */}
        <mesh position={[0, 0, side * 0.28]}>
          <boxGeometry args={[0.52, 0.06, 0.12]} />
          <meshStandardMaterial color={STEEL_LIGHT} metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0.34, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 10]} />
          <meshStandardMaterial color={STEEL_LIGHT} metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[-0.34, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 10]} />
          <meshStandardMaterial color={STEEL_LIGHT} metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
      {/* engaging snout (animated) */}
      <group ref={snoutRef} position={[FUEL_CHANNEL.x, FUEL_CHANNEL.y, zBase]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.34, 14]} />
          <meshStandardMaterial color={STEEL_LIGHT} metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, side * -0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 14]} />
          <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
      {/* fresh/spent bundle carried by the snout */}
      <mesh ref={bundleRef} position={[FUEL_CHANNEL.x, FUEL_CHANNEL.y, side * (CZ / 2 + 0.32)]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.058, 0.058, 0.22, 14]} />
        <meshStandardMaterial
          color={URANIUM_DEEP}
          emissive={new THREE.Color(URANIUM)}
          emissiveIntensity={1.6}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/** Vertical shutoff / adjuster rods dropping into the moderator from above. */
function ShutoffRods() {
  const rods = useMemo(() => {
    const out: [number, number][] = []
    const n = 5
    for (let i = 0; i < n; i++) {
      const z = (i - (n - 1) / 2) * (CZ / (n + 1))
      out.push([Math.sin(i * 1.3) * 0.5, z])
    }
    return out
  }, [])
  return (
    <group>
      {rods.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, CR + 0.45, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
            <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0, CR - 0.05, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.5, 8]} />
            <meshStandardMaterial color={STEEL_LIGHT} metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Drifting neutron field around the calandria. */
function Neutrons({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 160
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 1.7 + Math.random() * 1.6
      const a = Math.random() * Math.PI * 2
      const yy = (Math.random() - 0.5) * CZ * 0.95
      arr[i * 3] = Math.cos(a) * r
      arr[i * 3 + 1] = yy
      arr[i * 3 + 2] = Math.sin(a) * r
    }
    return arr
  }, [])
  useFrame((_, delta) => {
    if (reduced || !ref.current) return
    ref.current.rotation.y += delta * 0.04
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={URANIUM} size={0.04} sizeAttenuation transparent opacity={0.5} toneMapped={false} />
    </points>
  )
}

/** Mounting deck under the calandria to ground the composition. */
function Deck() {
  return (
    <mesh position={[0, -CR - 0.55, 0]}>
      <boxGeometry args={[CR * 2.4, 0.08, CZ * 1.15]} />
      <meshStandardMaterial color={'#050807'} metalness={0.6} roughness={0.55} />
    </mesh>
  )
}

/** Rig: gentle oscillation so the end-face lattice + refuelers read, plus pointer parallax.
 *  `pan` shifts the framing left, composing the reactor stage-right. */
function Rig({ reduced, pan }: { reduced: boolean; pan: number }) {
  const { pointer, camera } = useThree()
  const target = useRef(new THREE.Vector2())
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!reduced) {
      target.current.lerp(pointer, 0.045)
      const yaw = 0.52 + Math.sin(t * 0.12) * 0.22 + target.current.x * 0.5
      camera.position.x = Math.sin(yaw) * 7.4
      camera.position.z = Math.cos(yaw) * 7.4
      camera.position.y = 0.55 + target.current.y * 0.7 + Math.sin(t * 0.18) * 0.12
    } else {
      camera.position.set(0, 0.55, 7.4)
    }
    camera.lookAt(-pan, 0, 0)
  })
  return null
}

export function ReactorCore({ active, pan = 0 }: { active: boolean; pan?: number }) {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <Canvas
      frameloop={active && !reduced ? 'always' : 'demand'}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.55, 7.4], fov: 38 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.32} />
      <hemisphereLight args={['#cfeee0', '#060908', 0.5]} />
      <directionalLight position={[5, 7, 4]} intensity={0.6} color={'#bfe9d8'} />
      <directionalLight position={[-6, -2, -4]} intensity={0.35} color={URANIUM_DEEP} />
      <pointLight position={[0, 0, 0]} color={URANIUM} intensity={7} distance={9} decay={2} />

      <group rotation={[-0.04, 0, 0]}>
        <Calandria reduced={reduced} />
        <PressureTubes />
        <FuelChannel reduced={reduced} />
        <RefuelingMachine side={1} reduced={reduced} />
        <RefuelingMachine side={-1} reduced={reduced} />
        <ShutoffRods />
        <Deck />
        <Neutrons reduced={reduced} />
      </group>
      <Rig reduced={reduced} pan={pan} />

      <EffectComposer>
        <Bloom intensity={0.95} luminanceThreshold={0.2} luminanceSmoothing={0.55} mipmapBlur />
        <Vignette eskil={false} offset={0.22} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  )
}

export default ReactorCore
