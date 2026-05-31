'use client'

// Polished, flat-vector schematic scenes for each fuel-cycle step. Every scene
// shares a "0 0 240 200" viewBox and is built from 5–8 `.anim-el` groups so a
// parent stagger reads cleanly. Base structure uses `currentColor` (the parent
// sets a strong text colour); AMBER is the process/material accent (ore,
// yellowcake, fuel, radiation) and TEAL is the flow/energy/water accent
// (sweeps, pipes, steam, electricity).
//
// Design language: "Nothing" — sharp, clean, flat. Confident stroke weights via
// non-scaling-stroke, generous flat-opacity accent fills, clear depth/layering,
// one obvious focal subject per step. NO gradients, blur, or glow.
//
// Pure presentational SVG — no state, no effects.

import type { CSSProperties } from 'react'
import { URANIUM } from './theme'
import type { FuelCycleStep } from './content'

const AMBER = URANIUM.amber
const TEAL = URANIUM.teal

const STROKE: CSSProperties = { vectorEffect: 'non-scaling-stroke' }
const amberStroke: CSSProperties = { ...STROKE, stroke: AMBER }
const tealStroke: CSSProperties = { ...STROKE, stroke: TEAL }

/** A single `.anim-el` group — every visual layer starts hidden for the parent stagger. */
function El({ children }: { children: React.ReactNode }) {
  return (
    <g className="anim-el" style={{ opacity: 0 }}>
      {children}
    </g>
  )
}

/** Subtle framing chrome — corner ticks instead of a full box, so scenes feel open. */
function Frame({ children }: { children: React.ReactNode }) {
  const tick = (x: number, y: number, dx: number, dy: number) => (
    <path
      d={`M${x + dx} ${y} H${x} V${y + dy}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeOpacity="0.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={STROKE}
    />
  )
  return (
    <>
      <El>
        {tick(10, 10, 16, 16)}
        {tick(230, 10, -16, 16)}
        {tick(10, 190, 16, -16)}
        {tick(230, 190, -16, -16)}
      </El>
      {children}
    </>
  )
}

/** Filled, confident arrow for flow direction. */
function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const h = 8
  const w = 4.5
  const bx = x2 - h * Math.cos(angle)
  const by = y2 - h * Math.sin(angle)
  const a1x = bx - w * Math.cos(angle - Math.PI / 2)
  const a1y = by - w * Math.sin(angle - Math.PI / 2)
  const a2x = bx + w * Math.cos(angle - Math.PI / 2)
  const a2y = by + w * Math.sin(angle - Math.PI / 2)
  const cs: CSSProperties = { ...STROKE, stroke: color }
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth="2" strokeLinecap="round" style={cs} />
      <polygon points={`${a1x},${a1y} ${x2},${y2} ${a2x},${a2y}`} fill={color} stroke="none" />
    </g>
  )
}

function Deposit() {
  return (
    <Frame>
      {/* Ground surface */}
      <El>
        <path d="M20 50 Q70 42 120 48 T220 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={STROKE} />
      </El>
      {/* Rock strata bands (filled, layered for depth) */}
      <El>
        <rect x="20" y="50" width="200" height="34" fill="currentColor" fillOpacity="0.05" stroke="none" />
        <rect x="20" y="118" width="200" height="38" fill="currentColor" fillOpacity="0.08" stroke="none" />
        <rect x="20" y="156" width="200" height="26" fill="currentColor" fillOpacity="0.12" stroke="none" />
      </El>
      {/* Strata dividing lines */}
      <El>
        <line x1="20" y1="84" x2="220" y2="84" stroke="currentColor" strokeWidth="1.5" style={STROKE} />
        <line x1="20" y1="118" x2="220" y2="118" stroke="currentColor" strokeWidth="1.5" style={STROKE} />
        <line x1="20" y1="156" x2="220" y2="156" stroke="currentColor" strokeWidth="1.5" style={STROKE} />
        <path d="M40 84 q30 8 60 0 t60 0 t40 -2" fill="none" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" strokeDasharray="3 5" style={STROKE} />
      </El>
      {/* Ore body lens (focal) */}
      <El>
        <ellipse cx="124" cy="120" rx="52" ry="20" fill={AMBER} fillOpacity="0.14" stroke={AMBER} strokeWidth="2" style={amberStroke} />
        <ellipse cx="124" cy="120" rx="30" ry="11" fill={AMBER} fillOpacity="0.28" stroke="none" />
        <ellipse cx="124" cy="120" rx="13" ry="5" fill={AMBER} fillOpacity="0.55" stroke="none" />
      </El>
      {/* Ore grains scattered in the lens */}
      <El>
        <circle cx="100" cy="116" r="1.8" fill={AMBER} />
        <circle cx="148" cy="125" r="1.8" fill={AMBER} />
        <circle cx="134" cy="112" r="1.4" fill={AMBER} />
        <circle cx="112" cy="128" r="1.4" fill={AMBER} />
      </El>
    </Frame>
  )
}

function Prospecting() {
  return (
    <Frame>
      {/* Terrain ridgeline (filled) */}
      <El>
        <path d="M16 168 L60 150 L96 160 L132 142 L172 158 L224 146 L224 182 L16 182 Z" fill="currentColor" fillOpacity="0.07" stroke="none" />
        <path d="M16 168 L60 150 L96 160 L132 142 L172 158 L224 146" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={STROKE} />
      </El>
      {/* Ground radar dish (focal) */}
      <El>
        {/* mast + base */}
        <line x1="60" y1="150" x2="60" y2="118" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={STROKE} />
        <path d="M50 152 L70 152" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={STROKE} />
        {/* dish bowl facing up-right */}
        <path d="M40 126 A 26 26 0 0 1 82 106" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={STROKE} />
        {/* feed arm + point */}
        <line x1="60" y1="118" x2="66" y2="111" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" style={STROKE} />
        <circle cx="66" cy="111" r="2.5" fill="currentColor" stroke="none" />
      </El>
      {/* Radar sweep beam (teal, expanding toward the target) */}
      <El>
        <path d="M72 102 Q108 104 122 132" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" style={tealStroke} />
        <path d="M66 110 Q112 118 132 142" fill="none" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" style={tealStroke} />
        <path d="M60 120 Q112 132 140 150" fill="none" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" style={tealStroke} />
      </El>
      {/* Anomaly hotspot rings on terrain (focal accent) */}
      <El>
        <circle cx="150" cy="150" r="20" fill={AMBER} fillOpacity="0.1" stroke={AMBER} strokeWidth="1.25" strokeOpacity="0.5" style={amberStroke} />
        <circle cx="150" cy="150" r="12" fill={AMBER} fillOpacity="0.2" stroke={AMBER} strokeWidth="2" style={amberStroke} />
        <circle cx="150" cy="150" r="4" fill={AMBER} stroke="none" />
      </El>
    </Frame>
  )
}

function Exploration() {
  return (
    <Frame>
      {/* Subsurface body */}
      <El>
        <rect x="18" y="58" width="204" height="120" fill="currentColor" fillOpacity="0.06" stroke="none" />
        <line x1="18" y1="58" x2="222" y2="58" stroke="currentColor" strokeWidth="2" style={STROKE} />
      </El>
      {/* Drill rig (focal) */}
      <El>
        <path d="M52 58 L72 22 L92 58" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={STROKE} />
        <line x1="60" y1="44" x2="84" y2="44" stroke="currentColor" strokeWidth="1.5" style={STROKE} />
        <line x1="64" y1="32" x2="80" y2="32" stroke="currentColor" strokeWidth="1.5" style={STROKE} />
        <rect x="60" y="50" width="24" height="8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" style={STROKE} />
      </El>
      {/* Drill string into ore */}
      <El>
        <line x1="72" y1="22" x2="72" y2="150" stroke={TEAL} strokeWidth="2.25" strokeLinecap="round" style={tealStroke} />
        <circle cx="72" cy="150" r="3" fill={TEAL} stroke="none" />
      </El>
      {/* Core samples logged at depth */}
      <El>
        <line x1="128" y1="58" x2="128" y2="124" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 4" strokeOpacity="0.5" style={STROKE} />
        <line x1="178" y1="58" x2="178" y2="146" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 4" strokeOpacity="0.5" style={STROKE} />
        <rect x="123" y="96" width="10" height="26" fill={AMBER} fillOpacity="0.35" stroke={AMBER} strokeWidth="1.5" style={amberStroke} />
        <rect x="173" y="110" width="10" height="32" fill={AMBER} fillOpacity="0.35" stroke={AMBER} strokeWidth="1.5" style={amberStroke} />
      </El>
      {/* Inferred resource outline (focal accent) */}
      <El>
        <path d="M94 90 Q150 72 196 100 Q206 134 150 148 Q96 144 94 90 Z" fill={AMBER} fillOpacity="0.1" stroke={AMBER} strokeWidth="1.75" strokeDasharray="6 5" strokeLinejoin="round" style={amberStroke} />
      </El>
    </Frame>
  )
}

function Mining() {
  return (
    <Frame>
      {/* Surrounding ground */}
      <El>
        <line x1="16" y1="50" x2="224" y2="50" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <rect x="16" y="36" width="208" height="14" fill="currentColor" fillOpacity="0.05" stroke="none" />
      </El>
      {/* Open-pit terraces (filled stepped wall, focal) */}
      <El>
        <path d="M44 50 L44 78 L86 78 L86 104 L124 104 L124 128 L160 128 L160 150 L196 150 L196 50 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" style={STROKE} />
      </El>
      {/* Bench edge highlights */}
      <El>
        <line x1="44" y1="78" x2="86" y2="78" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.5" style={STROKE} />
        <line x1="86" y1="104" x2="124" y2="104" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.5" style={STROKE} />
        <line x1="124" y1="128" x2="160" y2="128" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.5" style={STROKE} />
      </El>
      {/* Ore pocket at pit floor */}
      <El>
        <ellipse cx="178" cy="150" rx="16" ry="6" fill={AMBER} fillOpacity="0.3" stroke={AMBER} strokeWidth="1.5" style={amberStroke} />
      </El>
      {/* Pickaxe (focal mining tool) */}
      <El>
        {/* Handle */}
        <line x1="42" y1="172" x2="96" y2="110" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" style={STROKE} />
        {/* Pick head — curved double point */}
        <path d="M70 98 Q96 90 122 98" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" style={STROKE} />
        {/* Head mount collar */}
        <circle cx="96" cy="102" r="3.5" fill="currentColor" stroke="none" />
      </El>
      {/* Strike sparks where it bites the rock (amber) */}
      <El>
        <line x1="42" y1="172" x2="34" y2="166" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round" style={amberStroke} />
        <line x1="46" y1="174" x2="46" y2="164" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round" style={amberStroke} />
        <circle cx="52" cy="168" r="1.6" fill={AMBER} />
      </El>
    </Frame>
  )
}

function Crushing() {
  return (
    <Frame>
      {/* Crusher hopper (focal) */}
      <El>
        <path d="M48 38 L116 38 L100 86 L64 86 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" style={STROKE} />
        <line x1="48" y1="38" x2="116" y2="38" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" style={STROKE} />
        <path d="M70 60 L94 60 L88 78 L76 78 Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" style={STROKE} />
      </El>
      {/* Crushed fragments dropping out */}
      <El>
        <rect x="74" y="92" width="8" height="8" fill={AMBER} fillOpacity="0.4" stroke={AMBER} strokeWidth="1" style={amberStroke} transform="rotate(20 78 96)" />
        <rect x="86" y="100" width="6" height="6" fill="currentColor" fillOpacity="0.4" stroke="none" transform="rotate(-18 89 103)" />
        <rect x="76" y="108" width="7" height="7" fill={AMBER} fillOpacity="0.35" stroke="none" transform="rotate(35 79 111)" />
      </El>
      {/* Radiometric sorting belt (focal) */}
      <El>
        <rect x="108" y="116" width="108" height="40" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <line x1="108" y1="148" x2="216" y2="148" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.45" style={STROKE} />
        <circle cx="118" cy="160" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" style={STROKE} />
        <circle cx="206" cy="160" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" style={STROKE} />
      </El>
      {/* Detector + scan beam */}
      <El>
        <rect x="136" y="100" width="22" height="10" fill={TEAL} fillOpacity="0.18" stroke={TEAL} strokeWidth="1.75" style={tealStroke} />
        <line x1="147" y1="110" x2="147" y2="116" stroke={TEAL} strokeWidth="2" strokeLinecap="round" style={tealStroke} />
        <path d="M141 116 L147 112 L153 116" fill="none" stroke={TEAL} strokeWidth="1.25" strokeOpacity="0.5" style={tealStroke} />
      </El>
      {/* Sorted high-grade ore on belt */}
      <El>
        <rect x="122" y="128" width="12" height="12" fill={AMBER} fillOpacity="0.18" stroke={AMBER} strokeWidth="1.5" style={amberStroke} />
        <rect x="184" y="126" width="14" height="14" fill={AMBER} fillOpacity="0.4" stroke={AMBER} strokeWidth="2" style={amberStroke} />
      </El>
    </Frame>
  )
}

function Leaching() {
  return (
    <Frame>
      {/* Acid feed line */}
      <El>
        <rect x="30" y="28" width="18" height="16" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <path d="M48 36 L120 36 L120 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={STROKE} />
      </El>
      {/* Acid droplets (amber material) */}
      <El>
        <path d="M120 58 q-5 7 0 11 q5 -4 0 -11 z" fill={AMBER} fillOpacity="0.6" stroke={AMBER} strokeWidth="1.25" style={amberStroke} />
        <path d="M120 76 q-4 6 0 9 q4 -3 0 -9 z" fill={AMBER} fillOpacity="0.45" stroke="none" />
        <path d="M120 92 q-4 5 0 8 q4 -3 0 -8 z" fill={AMBER} fillOpacity="0.3" stroke="none" />
      </El>
      {/* Leach tank (focal) */}
      <El>
        <path d="M52 104 L188 104 L180 168 L60 168 Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" style={STROKE} />
        <line x1="52" y1="104" x2="188" y2="104" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" style={STROKE} />
      </El>
      {/* Loaded solution body */}
      <El>
        <path d="M58 124 L182 124 L177 162 L63 162 Z" fill={TEAL} fillOpacity="0.15" stroke="none" />
        <path d="M58 124 Q90 119 120 124 T182 124" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" style={tealStroke} />
      </El>
      {/* Reaction bubbles */}
      <El>
        <circle cx="86" cy="148" r="2.5" fill={TEAL} fillOpacity="0.7" stroke="none" />
        <circle cx="104" cy="140" r="2" fill={TEAL} fillOpacity="0.6" stroke="none" />
        <circle cx="124" cy="150" r="2.5" fill={AMBER} fillOpacity="0.7" stroke="none" />
        <circle cx="146" cy="142" r="2" fill={TEAL} fillOpacity="0.6" stroke="none" />
        <circle cx="160" cy="152" r="2.5" fill={AMBER} fillOpacity="0.6" stroke="none" />
      </El>
    </Frame>
  )
}

function IonExchange() {
  const beadRows = [62, 78, 94, 110, 126, 142]
  return (
    <Frame>
      {/* Two resin columns (focal) */}
      <El>
        <rect x="60" y="36" width="40" height="128" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <rect x="142" y="36" width="40" height="128" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <line x1="60" y1="48" x2="100" y2="48" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" style={STROKE} />
        <line x1="142" y1="48" x2="182" y2="48" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" style={STROKE} />
      </El>
      {/* Resin bead packing */}
      <El>
        {beadRows.map((y) => (
          <g key={y}>
            <circle cx="72" cy={y} r="3.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
            <circle cx="82" cy={y + 8} r="3.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
            <circle cx="92" cy={y} r="3.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
            <circle cx="154" cy={y} r="3.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
            <circle cx="164" cy={y + 8} r="3.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
            <circle cx="174" cy={y} r="3.5" fill="currentColor" fillOpacity="0.22" stroke="none" />
          </g>
        ))}
      </El>
      {/* Captured uranium ions (amber, loading downward) */}
      <El>
        <circle cx="82" cy="72" r="3" fill={AMBER} stroke="none" />
        <circle cx="72" cy="96" r="3" fill={AMBER} stroke="none" />
        <circle cx="92" cy="118" r="3" fill={AMBER} stroke="none" />
        <circle cx="164" cy="86" r="3" fill={AMBER} stroke="none" />
        <circle cx="154" cy="112" r="3" fill={AMBER} stroke="none" />
        <circle cx="174" cy="134" r="3" fill={AMBER} stroke="none" />
      </El>
      {/* Feed in / cross-flow / product out */}
      <El>
        <Arrow x1={80} y1={20} x2={80} y2={36} color={TEAL} />
        <line x1="100" y1="100" x2="142" y2="100" stroke={TEAL} strokeWidth="2.25" strokeLinecap="round" style={tealStroke} />
        <Arrow x1={162} y1={164} x2={162} y2={182} color={TEAL} />
      </El>
    </Frame>
  )
}

function Precipitation() {
  return (
    <Frame>
      {/* Ammonia reagent feed */}
      <El>
        <rect x="34" y="34" width="20" height="26" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <path d="M44 60 Q66 70 84 92" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" style={tealStroke} />
      </El>
      {/* Drum body (focal) */}
      <El>
        <path d="M80 66 L80 154 M180 66 L180 154" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={STROKE} />
        <path d="M80 154 a50 14 0 0 0 100 0" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <ellipse cx="130" cy="66" rx="50" ry="14" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="2" style={STROKE} />
      </El>
      {/* Yellowcake fill */}
      <El>
        <path d="M80 112 a50 14 0 0 0 100 0 L180 154 a50 14 0 0 1 -100 0 Z" fill={AMBER} fillOpacity="0.22" stroke="none" />
        <ellipse cx="130" cy="112" rx="50" ry="14" fill={AMBER} fillOpacity="0.35" stroke={AMBER} strokeWidth="2" style={amberStroke} />
      </El>
      {/* Settling precipitate particles */}
      <El>
        <circle cx="110" cy="100" r="1.8" fill={AMBER} />
        <circle cx="146" cy="96" r="1.8" fill={AMBER} />
        <circle cx="128" cy="104" r="1.5" fill={AMBER} />
        <circle cx="100" cy="92" r="1.5" fill={AMBER} fillOpacity="0.7" />
      </El>
      {/* U3O8 label */}
      <El>
        <text x="130" y="138" textAnchor="middle" fontSize="15" fontFamily="ui-monospace, monospace" fontWeight="600" fill={AMBER} letterSpacing="1">
          U₃O₈
        </text>
      </El>
    </Frame>
  )
}

function Conversion() {
  return (
    <Frame>
      {/* Input U3O8 vessel */}
      <El>
        <rect x="18" y="80" width="52" height="44" rx="2" fill={AMBER} fillOpacity="0.14" stroke={AMBER} strokeWidth="2" style={amberStroke} />
        <text x="44" y="106" textAnchor="middle" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="600" fill={AMBER}>
          U₃O₈
        </text>
      </El>
      {/* Reaction vessel (focal) */}
      <El>
        <circle cx="120" cy="102" r="34" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <rect x="112" y="62" width="16" height="10" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.75" style={STROKE} />
      </El>
      {/* Swirling reaction inside */}
      <El>
        <path d="M100 102 a20 20 0 0 1 40 0" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" style={tealStroke} />
        <path d="M140 102 a20 20 0 0 1 -40 0" fill="none" stroke={AMBER} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" style={amberStroke} />
        <circle cx="120" cy="102" r="4" fill={TEAL} stroke="none" />
      </El>
      {/* Transformation arrows */}
      <El>
        <Arrow x1={72} y1={102} x2={84} y2={102} color={TEAL} />
        <Arrow x1={156} y1={102} x2={168} y2={102} color={TEAL} />
      </El>
      {/* Output UO2 vessel */}
      <El>
        <rect x="170" y="80" width="52" height="44" rx="2" fill={AMBER} fillOpacity="0.28" stroke={AMBER} strokeWidth="2" style={amberStroke} />
        <text x="196" y="106" textAnchor="middle" fontSize="12" fontFamily="ui-monospace, monospace" fontWeight="600" fill={AMBER}>
          UO₂
        </text>
      </El>
    </Frame>
  )
}

function Fuel() {
  return (
    <Frame>
      {/* UO2 pellets (focal material) */}
      <El>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={40 + i * 18}
            y="40"
            width="14"
            height="20"
            rx="1"
            fill={AMBER}
            fillOpacity="0.3"
            stroke={AMBER}
            strokeWidth="1.75"
            style={amberStroke}
          />
        ))}
        <text x="148" y="55" fontSize="9" fontFamily="ui-monospace, monospace" fill={AMBER} fillOpacity="0.9">
          UO₂
        </text>
      </El>
      {/* Loading arrow */}
      <El>
        <Arrow x1={118} y1={66} x2={118} y2={82} color={TEAL} />
      </El>
      {/* Fuel-rod bundle (zirconium cladding) — focal */}
      <El>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={68 + i * 21}
            y="88"
            width="12"
            height="92"
            rx="2"
            fill="currentColor"
            fillOpacity="0.07"
            stroke="currentColor"
            strokeWidth="1.75"
            style={STROKE}
          />
        ))}
      </El>
      {/* Pellet stacks visible inside rods */}
      <El>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            {[96, 116, 136, 156].map((y) => (
              <rect key={y} x={70 + i * 21} y={y} width="8" height="14" fill={AMBER} fillOpacity="0.22" stroke="none" />
            ))}
          </g>
        ))}
      </El>
      {/* Assembly spacer grids */}
      <El>
        <rect x="62" y="100" width="116" height="9" fill={TEAL} fillOpacity="0.15" stroke={TEAL} strokeWidth="2" style={tealStroke} />
        <rect x="62" y="160" width="116" height="9" fill={TEAL} fillOpacity="0.15" stroke={TEAL} strokeWidth="2" style={tealStroke} />
      </El>
    </Frame>
  )
}

function Generation() {
  return (
    <Frame>
      {/* Reactor containment dome (heat source) */}
      <El>
        <path d="M26 154 L26 118 A32 32 0 0 1 90 118 L90 154 Z" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" style={STROKE} />
        <line x1="20" y1="154" x2="96" y2="154" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" style={STROKE} />
      </El>
      {/* Fission atom core */}
      <El>
        <circle cx="58" cy="122" r="13" fill={AMBER} fillOpacity="0.22" stroke={AMBER} strokeWidth="2" style={amberStroke} />
        <ellipse cx="58" cy="122" rx="13" ry="5" fill="none" stroke={AMBER} strokeWidth="1.25" style={amberStroke} transform="rotate(30 58 122)" />
        <ellipse cx="58" cy="122" rx="13" ry="5" fill="none" stroke={AMBER} strokeWidth="1.25" style={amberStroke} transform="rotate(-30 58 122)" />
        <circle cx="58" cy="122" r="3" fill={AMBER} stroke="none" />
      </El>
      {/* Steam carried to the turbine */}
      <El>
        <path d="M92 100 L128 100" fill="none" stroke={TEAL} strokeWidth="2.25" strokeLinecap="round" style={tealStroke} />
        <path d="M100 92 q4 -7 8 0 M112 92 q4 -7 8 0" fill="none" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" style={tealStroke} />
      </El>
      {/* Turbine rotor (steam spins the blades) */}
      <El>
        <circle cx="150" cy="100" r="18" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="2" style={STROKE} />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1="150"
            y1="100"
            x2="150"
            y2="84"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={STROKE}
            transform={`rotate(${deg} 150 100)`}
          />
        ))}
        <circle cx="150" cy="100" r="3.5" fill="currentColor" stroke="none" />
      </El>
      {/* Shaft → generator → electricity to the grid */}
      <El>
        <line x1="168" y1="100" x2="184" y2="100" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={STROKE} />
        <circle cx="202" cy="100" r="15" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <path d="M205 90 L196 102 L202 102 L199 112 L208 99 L202 99 Z" fill={TEAL} stroke="none" />
        <line x1="202" y1="115" x2="202" y2="154" stroke="currentColor" strokeWidth="2" style={STROKE} />
        <line x1="186" y1="154" x2="218" y2="154" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" style={STROKE} />
      </El>
    </Frame>
  )
}

function Waste() {
  return (
    <Frame>
      {/* Outer ring */}
      <El>
        <circle cx="120" cy="100" r="62" fill={AMBER} fillOpacity="0.08" stroke={AMBER} strokeWidth="2" style={amberStroke} />
      </El>
      {/* Radiation trefoil — large, centred */}
      <El>
        {[0, 120, 240].map((deg) => (
          <path
            key={deg}
            d="M120 100 L94 55 A52 52 0 0 1 146 55 Z"
            fill={AMBER}
            fillOpacity="0.7"
            stroke="none"
            transform={`rotate(${deg} 120 100)`}
          />
        ))}
      </El>
      {/* Central hub */}
      <El>
        <circle cx="120" cy="100" r="10" fill={AMBER} stroke="none" />
        <circle cx="120" cy="100" r="10" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" style={STROKE} />
      </El>
    </Frame>
  )
}

const SCENES: Record<FuelCycleStep['id'], () => React.ReactElement> = {
  deposit: Deposit,
  prospecting: Prospecting,
  exploration: Exploration,
  mining: Mining,
  crushing: Crushing,
  leaching: Leaching,
  ionexchange: IonExchange,
  precipitation: Precipitation,
  conversion: Conversion,
  fuel: Fuel,
  generation: Generation,
  waste: Waste,
}

export function StepScene({ id, className }: { id: FuelCycleStep['id']; className?: string }) {
  const Scene = SCENES[id]
  return (
    <svg
      viewBox="0 0 240 200"
      className={`w-full h-auto${className ? ` ${className}` : ''}`}
      role="img"
      aria-hidden="true"
      fill="none"
    >
      <Scene />
    </svg>
  )
}
