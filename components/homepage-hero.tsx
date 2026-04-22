'use client'

import { type RefObject } from 'react'
import { HeroVectorAssembly } from '@/components/hero-vector-assembly'

type HomepageHeroProps = {
  onBirdHandoff?: () => void
  birdSlotRef?: RefObject<HTMLSpanElement | null>
}

export function HomepageHero({ onBirdHandoff, birdSlotRef }: HomepageHeroProps) {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden flex items-end">
      {/* Huge name — sits under the assembled bird where they overlap */}
      <div className="absolute inset-0 z-[4] flex items-center justify-center pointer-events-none select-none">
        <h1
          aria-hidden
          className="font-black tracking-tighter text-foreground leading-none whitespace-nowrap"
          style={{
            fontSize: 'clamp(3rem, 26vw, 40rem)',
            letterSpacing: '-0.06em',
          }}
        >
          aravinth
        </h1>
      </div>

      <HeroVectorAssembly
        onHandoffComplete={onBirdHandoff}
        flightTargetRef={birdSlotRef}
      />

      {/* Foreground tagline */}
      <div className="relative z-10 px-8 pb-16 md:pb-24 w-full">
        <p className="text-2xl md:text-3xl font-semibold text-foreground max-w-3xl leading-tight">
          Machine Learning Engineer, Researcher and Software Developer with a passion for anything Mathematics.
        </p>
      </div>
    </main>
  )
}
