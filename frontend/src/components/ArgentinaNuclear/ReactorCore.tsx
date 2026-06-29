'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * ReactorCore — schematic Three.js cutaway of a CANDU-6 / PHWR.
 *
 * A horizontal calandria vessel (translucent uranium-glass), two perforated end
 * shields, a lattice of horizontal pressure tubes with glowing fuel bundles,
 * and thin coolant feeders. The whole assembly breathes/rotates slowly. Built
 * entirely from primitive geometry so it stays cheap; reduced-motion is honoured
 * by the parent (the canvas can be paused via the `active` prop).
 *
 * Visual only — no data binding. Used as the Control Room backdrop.
 */

const ACCENT = '#34e89e' // uranium-glass green (matches map pins)
const ACCENT_DIM = '#0e3a2a'
const STEEL = '#3a4a52'

function Calandria() {
  // Horizontal cylinder representing the calandria vessel (D₂O moderator tank).
  return (
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[2.2, 2.2, 5.4, 64, 1, true]} />
      <meshStandardMaterial
        color={ACCENT}
        emissive={ACCENT_DIM}
        emissiveIntensity={0.6}
        transparent
        opacity={0.14}
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  )
}

function EndShield({ x }: { x: number }) {
  // Perforated end shield — a ring with a dotted lattice.
  const dots = useMemo(() => {
    const pts: [number, number, number][] = []
    const ringCount = 7
    for (let r = 1; r <= ringCount; r++) {
      const radius = (r / ringCount) * 1.9
      const count = Math.max(6, r * 6)
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2
        pts.push([Math.cos(a) * radius, Math.sin(a) * radius, x])
      }
    }
    return pts
  }, [x])
  return (
    <group>
      <mesh position={[0, 0, x]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.2, 0.12, 8, 64]} />
        <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.4} />
      </mesh>
      {dots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function PressureTubes() {
  // Lattice of horizontal pressure tubes running through the calandria,
  // each holding a few glowing fuel bundles.
  const tubes = useMemo(() => {
    const arr: { pos: [number, number]; key: number }[] = []
    const spacing = 0.36
    const rows = 9
    for (let r = 0; r < rows; r++) {
      const y = (r - (rows - 1) / 2) * spacing
      const cols = rows - Math.abs(r - (rows - 1) / 2) * 2
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * spacing
        arr.push({ pos: [x, y], key: r * 100 + c })
      }
    }
    return arr
  }, [])

  return (
    <group>
      {tubes.map((t) => (
        <group key={t.key} position={[0, t.pos[1], t.pos[0]]} rotation={[0, 0, Math.PI / 2]}>
          {/* Tube wall */}
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 5.8, 8, 1, true]} />
            <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.4} transparent opacity={0.55} side={THREE.DoubleSide} />
          </mesh>
          {/* Fuel bundle (glowing slug in the centre) */}
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, 0.5, 8]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function CoolantFeeders() {
  // A few visible coolant feeder pipes curling out of one end.
  const feeders = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      key: i,
      y: (i - 2.5) * 0.5,
      z: (i % 2 === 0 ? 1 : -1) * (0.6 + Math.random() * 0.8),
    }))
  }, [])
  return (
    <group>
      {feeders.map((f) => (
        <mesh key={f.key} position={[2.9, f.y, f.z]} rotation={[0, 0, Math.PI / 2.4]}>
          <torusGeometry args={[0.7, 0.04, 8, 16, Math.PI / 2]} />
          <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function CoreAssembly({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (!active || !group.current) return
    group.current.rotation.y += delta * 0.12
    group.current.rotation.z = Math.sin(performance.now() * 0.0003) * 0.04
  })
  return (
    <group ref={group}>
      <Calandria />
      <EndShield x={2.7} />
      <EndShield x={-2.7} />
      <PressureTubes />
      <CoolantFeeders />
      {/* Axial indicator line */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 8, 4]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export type ReactorCoreProps = {
  /** Pause animation (e.g. off-screen / reduced motion). */
  active?: boolean
  className?: string
}

export function ReactorCore({ active = true, className }: ReactorCoreProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }} aria-hidden>
      <Canvas
        camera={{ position: [3.4, 2.2, 6], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 6, 4]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-4, -2, 3]} intensity={1.2} color={ACCENT} />
        <pointLight position={[0, 0, 0]} intensity={0.8} color={ACCENT} distance={6} />
        <Suspense fallback={null}>
          <CoreAssembly active={active} />
        </Suspense>
      </Canvas>
    </div>
  )
}
