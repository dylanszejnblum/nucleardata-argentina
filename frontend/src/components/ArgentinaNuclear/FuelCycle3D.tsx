'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useLocale } from 'next-intl'
import * as THREE from 'three'
import type { Locale } from '@/i18n/routing'

/**
 * FuelCycle3D — the fuel cycle as a Three.js flow.
 *
 * Six glowing nodes along a curved conduit (mine → conversion → enrichment →
 * fabrication → reactor → spent fuel). Nodes ignite in sequence as the section
 * scrolls into view; uranium particles flow continuously along the conduit.
 * Reduced motion → static lit pose. Off-screen → render loop paused.
 */

const URANIUM = '#34e89e'
const URANIUM_BRIGHT = '#9bffc4'
const DIM = '#39443f'

interface CycleNode {
  key: string
  es: { title: string; sub: string }
  en: { title: string; sub: string }
}
const NODES: CycleNode[] = [
  { key: '01', es: { title: 'Mina', sub: 'Uranio' }, en: { title: 'Mine', sub: 'Uranium' } },
  { key: '02', es: { title: 'Conversión', sub: 'UF₆' }, en: { title: 'Conversion', sub: 'UF₆' } },
  { key: '03', es: { title: 'Enriquecimiento', sub: 'Pilcaniyeu' }, en: { title: 'Enrichment', sub: 'Pilcaniyeu' } },
  { key: '04', es: { title: 'Fabricación', sub: 'CONUAR' }, en: { title: 'Fabrication', sub: 'CONUAR' } },
  { key: '05', es: { title: 'Reactor', sub: 'Potencia' }, en: { title: 'Reactor', sub: 'Power' } },
  { key: '06', es: { title: 'Irradiado', sub: 'Gestión' }, en: { title: 'Spent fuel', sub: 'Management' } },
]

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function Scene({ progress, reduced, locale }: { progress: number; reduced: boolean; locale: 'es' | 'en' }) {
  const curve = useMemo(() => {
    const pts = NODES.map((_, i) => {
      const x = (i - (NODES.length - 1) / 2) * 2.1
      const z = Math.sin((i / (NODES.length - 1)) * Math.PI) * 1.5
      return new THREE.Vector3(x, 0, z)
    })
    return new THREE.CatmullRomCurve3(pts)
  }, [])

  const nodesRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Group>(null)
  const rigRef = useRef<THREE.Group>(null)
  const { pointer, camera } = useThree()
  const camTarget = useRef(new THREE.Vector2())

  useFrame((state, delta) => {
    if (reduced) return
    const t = state.clock.elapsedTime

    // node ignition by scroll progress
    if (nodesRef.current) {
      nodesRef.current.children.forEach((child, i) => {
        const active = progress >= i / (NODES.length - 1) - 0.02
        const g = child as THREE.Group
        const mesh = g.children[0] as THREE.Mesh
        const mat = mesh.material as THREE.MeshStandardMaterial
        const ring = g.children[1] as THREE.Mesh
        const ringMat = ring.material as THREE.MeshBasicMaterial
        const pulse = active ? 1.4 + Math.sin(t * 2 + i) * 0.4 : 0.15
        mat.emissiveIntensity = pulse
        mat.color.set(active ? URANIUM : DIM)
        mat.emissive.set(active ? URANIUM : DIM)
        ringMat.opacity = active ? 0.6 : 0
        const targetScale = active ? 1 : 0.6
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      })
    }

    // particle flow along the conduit
    if (particlesRef.current && progress > 0.04) {
      particlesRef.current.visible = true
      const speed = 0.09
      particlesRef.current.children.forEach((c, i) => {
        const u = (i / 8 + t * speed) % 1
        const p = curve.getPointAt(u)
        c.position.copy(p)
      })
    } else if (particlesRef.current) {
      particlesRef.current.visible = false
    }

    // rig drift + parallax
    if (rigRef.current) {
      rigRef.current.rotation.y = Math.sin(t * 0.12) * 0.18 + (progress - 0.5) * 0.4
    }
    camTarget.current.lerp(pointer, 0.05)
    camera.position.x = camTarget.current.x * 1.2
    camera.position.y = 3.4 + camTarget.current.y * 0.6
    camera.lookAt(0, 0, 0.4)
    void delta
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 2]} intensity={6} color={URANIUM} distance={16} decay={2} />

      <group ref={rigRef}>
        {/* conduit */}
        <mesh>
          <tubeGeometry args={[curve, 96, 0.05, 12, false]} />
          <meshBasicMaterial color={URANIUM} transparent opacity={0.22} toneMapped={false} />
        </mesh>
        <mesh>
          <tubeGeometry args={[curve, 96, 0.012, 8, false]} />
          <meshBasicMaterial color={URANIUM_BRIGHT} transparent opacity={0.9} toneMapped={false} />
        </mesh>

        {/* nodes */}
        <group ref={nodesRef}>
          {NODES.map((n, i) => {
            const p = curve.getPointAt(i / (NODES.length - 1))
            return (
              <group key={n.key} position={[p.x, p.y, p.z]}>
                <mesh>
                  <icosahedronGeometry args={[0.26, 0]} />
                  <meshStandardMaterial
                    color={DIM}
                    emissive={DIM}
                    emissiveIntensity={0.15}
                    metalness={0.4}
                    roughness={0.3}
                    toneMapped={false}
                  />
                </mesh>
                {/* halo */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.5, 0.01, 8, 48]} />
                  <meshBasicMaterial color={URANIUM} transparent opacity={0} toneMapped={false} />
                </mesh>
                <Html position={[0, -0.62, 0]} center style={{ pointerEvents: 'none' }}>
                  <div className="flex flex-col items-center gap-0.5 whitespace-nowrap">
                    <span
                      className="font-mono text-[10px] tracking-[0.14em] text-nd-accent"
                      style={{ font: '600 11px var(--font-martian-mono), monospace' }}
                    >
                      {n.key}
                    </span>
                    <span
                      className="text-nd-text-display"
                      style={{ font: '600 15px var(--font-hanken-grotesk), sans-serif' }}
                    >
                      {n[locale].title}
                    </span>
                    <span
                      className="text-nd-text-disabled"
                      style={{ font: '400 12px var(--font-martian-mono), monospace' }}
                    >
                      {n[locale].sub}
                    </span>
                  </div>
                </Html>
              </group>
            )
          })}
        </group>

        {/* particles */}
        <group ref={particlesRef}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color={URANIUM_BRIGHT} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>

      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.2} luminanceSmoothing={0.5} mipmapBlur />
      </EffectComposer>
    </>
  )
}

export function FuelCycle3D() {
  const locale = (useLocale() as Locale) === 'en' ? 'en' : 'es'
  const wrapRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(true)
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)

    const el = wrapRef.current
    if (!el) return

    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)

    let raf = 0
    const compute = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      setProgress(clamp((vh * 0.82 - r.top) / (vh * 0.7), 0, 1))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      mq.removeEventListener('change', onMq)
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative h-[58vh] min-h-[440px] w-full">
      {mounted && (
        <Canvas
          frameloop={active && !reduced ? 'always' : 'demand'}
          dpr={[1, 1.8]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 3.4, 9.5], fov: 42 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Scene progress={reduced ? 1 : progress} reduced={reduced} locale={locale} />
        </Canvas>
      )}
    </div>
  )
}

export default FuelCycle3D
