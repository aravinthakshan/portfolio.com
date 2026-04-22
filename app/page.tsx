'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { LoadingIcon } from '@/components/loading-icon'
import { NavigationHeader } from '@/components/navigation-header'
import { HomepageHero } from '@/components/homepage-hero'
import { PortfolioSection } from '@/components/portfolio-section'
import { ContactSection } from '@/components/contact-section'

const GlobeSection = dynamic(
  () => import('@/components/globe-section').then((m) => m.GlobeSection),
  { ssr: false }
)

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
        <GlobeSection />
        <ContactSection />
      </div>
    </>
  )
}
