'use client'

import { useEffect, useState } from 'react'
import { LoadingIcon } from '@/components/loading-icon'
import { NavigationHeader } from '@/components/navigation-header'
import { HomepageHero } from '@/components/homepage-hero'
import { PortfolioSection } from '@/components/portfolio-section'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time (2.5 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingIcon />
  }

  return (
    <>
      {/* Fade-in animation for content */}
      <div className="animate-fade-in">
        <NavigationHeader />
        <HomepageHero />
        <PortfolioSection />
      </div>
    </>
  )
}
