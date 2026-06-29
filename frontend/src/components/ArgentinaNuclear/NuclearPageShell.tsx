import React from 'react'
import { NothingHeader } from '@/components/Nothing/Header'
import { NothingFooter } from '@/components/Nothing/Footer'
import { cn } from '@/utilities/ui'

type NuclearPageShellProps = {
  children: React.ReactNode
  /** Pass `graticule` for a blueprint-grid backdrop (control-room feel). */
  backdrop?: 'none' | 'graticule'
  className?: string
  /** When true, removes the footer (full-screen experiences like the map). */
  fullscreen?: boolean
}

/**
 * Standard page chrome for every Nuclear Atlas route.
 * Wraps content in `.nuclear-atlas` so the uranium-glass design tokens
 * (scoped in globals.css) apply, leaving Petrodata pages on the red accent.
 */
export function NuclearPageShell({
  children,
  backdrop = 'none',
  className,
  fullscreen = false,
}: NuclearPageShellProps) {
  return (
    <>
      <NothingHeader />
      <main
        className={cn(
          'nuclear-atlas flex-1 w-full overflow-x-clip',
          backdrop === 'graticule' && 'graticule',
          className,
        )}
      >
        {children}
      </main>
      {!fullscreen ? <NothingFooter /> : null}
    </>
  )
}

/** Small section heading block: mono eyebrow + display title. */
export function NuclearSectionHeading({
  eyebrow,
  title,
  blurb,
  align = 'start',
}: {
  eyebrow?: string
  title: string
  blurb?: string
  align?: 'start' | 'center'
}) {
  return (
    <div className={cn('flex flex-col gap-2', align === 'center' && 'items-center text-center')}>
      {eyebrow ? (
        <span className="text-[11px] uppercase tracking-[0.14em] text-nd-text-secondary font-mono">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl leading-none text-nd-text-display md:text-5xl">
        {title}
      </h2>
      {blurb ? (
        <p className="max-w-2xl text-pretty text-sm leading-6 text-nd-text-secondary font-sans">
          {blurb}
        </p>
      ) : null}
    </div>
  )
}
