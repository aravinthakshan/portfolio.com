'use client'

import { useEffect, useRef, useState } from 'react'

interface PortfolioItem {
  id: number
  year: string
  title: string
  subtitle: string
  tags: string[]
  industry: string[]
  client: string
  description: string
  image: string
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    year: '2025',
    title: 'SmartPlan AI',
    subtitle: 'Mischka LLC',
    tags: ['Product Design', 'WebFlow Development'],
    industry: ['Artificial Intelligence', 'SaaS'],
    client: 'SmartPlan AI',
    description:
      'SmartPlan AI is an AI-powered planning platform. We designed the product interface and built a high-performance website to clearly communicate its value.',
    image:
      'https://images.unsplash.com/photo-1607502537688-fdf3fc1b0cdc?w=1200&h=800&fit=crop',
  },
  {
    id: 2,
    year: '2024',
    title: 'Creative HUB',
    subtitle: 'ALTHEA',
    tags: ['Web Design', 'UI UX Design', 'Website Development'],
    industry: ['Creative Industry', 'Art & Culture'],
    client: 'Creative HUB',
    description:
      'A dynamic Webflow website for CreativeHub, designed to showcase creative work, exhibitions, and collaborations through a modern editorial digital experience.',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=800&fit=crop',
  },
  {
    id: 3,
    year: '2023',
    title: 'Netability',
    subtitle: 'Lunar Luxe',
    tags: ['Web Design', 'Development'],
    industry: ['Technology', 'Software'],
    client: 'Netability',
    description:
      'Building sophisticated digital experiences that connect brands with their audiences through carefully considered design systems.',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop',
  },
  {
    id: 4,
    year: '2022',
    title: 'Mayerfeld',
    subtitle: 'Vision Summit',
    tags: ['Strategic Design', 'Development'],
    industry: ['Enterprise', 'Solutions'],
    client: 'Mayerfeld',
    description:
      'Enterprise solutions for modern business challenges and digital transformation initiatives at scale.',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop',
  },
]

const ITEM_HEIGHT = 88 // px — vertical spacing between names in the list

export function PortfolioSection() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const total = portfolioItems.length

  useEffect(() => {
    const handleScroll = () => {
      const el = wrapperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const scrolled = Math.min(
        Math.max(-rect.top, 0),
        (total - 1) * vh + vh - 1
      )
      const idx = Math.min(total - 1, Math.floor(scrolled / vh))
      setActiveIndex(idx)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [total])

  const active = portfolioItems[activeIndex]

  return (
    <div
      ref={wrapperRef}
      className="relative bg-black text-white"
      style={{ height: `${total * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="grid grid-cols-2 h-full gap-12 px-12 py-20">
          {/* LEFT — image + fixed-position detail rows */}
          <div className="flex flex-col">
            {/* Image — crossfade */}
            <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-neutral-900">
              {portfolioItems.map((item, i) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                    i === activeIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            {/* Detail rows — structure never moves, only values swap */}
            <div className="mt-10 divide-y divide-neutral-800 border-t border-neutral-800">
              <DetailRow label="Overview">
                <FadeSwap value={active.description} />
              </DetailRow>
              <DetailRow label="Tags">
                <FadeSwap
                  value={active.tags.join(' · ')}
                  render={() => (
                    <div className="space-y-0.5">
                      {active.tags.map((t) => (
                        <p key={t} className="text-neutral-200">
                          {t}
                        </p>
                      ))}
                    </div>
                  )}
                />
              </DetailRow>
              <DetailRow label="Industry">
                <FadeSwap
                  value={active.industry.join(' · ')}
                  render={() => (
                    <div className="space-y-0.5">
                      {active.industry.map((t) => (
                        <p key={t} className="text-neutral-200">
                          {t}
                        </p>
                      ))}
                    </div>
                  )}
                />
              </DetailRow>
              <DetailRow label="Client">
                <FadeSwap value={active.client} />
              </DetailRow>
              <div className="py-5">
                <button className="text-neutral-200 text-sm tracking-wide hover:text-white transition-colors">
                  Explore the case →
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — vertical name list that slides so active stays centered */}
          <div className="relative overflow-hidden">
            {/* Year indicator — sits in fixed slot above active name */}
            <div
              className="absolute left-0 right-0 text-sm text-neutral-400 tabular-nums"
              style={{
                top: `calc(50% - ${ITEM_HEIGHT * 0.85}px)`,
              }}
            >
              <FadeSwap value={active.year} />
            </div>

            {/* Sliding list */}
            <div
              className="absolute left-0 right-0 transition-transform duration-700 ease-out"
              style={{
                top: '50%',
                transform: `translateY(${-activeIndex * ITEM_HEIGHT - ITEM_HEIGHT / 2}px)`,
              }}
            >
              {portfolioItems.map((item, i) => {
                const isActive = i === activeIndex
                return (
                  <div
                    key={item.id}
                    className="flex items-center"
                    style={{ height: `${ITEM_HEIGHT}px` }}
                  >
                    <h2
                      className={`font-sans font-semibold leading-none transition-all duration-700 ease-out ${
                        isActive
                          ? 'text-white text-7xl'
                          : 'text-neutral-600 text-6xl'
                      }`}
                    >
                      {item.title}
                    </h2>
                  </div>
                )
              })}
            </div>

            {/* Progress rail */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              {portfolioItems.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-6 py-5">
      <div className="text-xs uppercase tracking-widest text-neutral-500">
        {label}
      </div>
      <div className="text-sm text-neutral-200 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

// Cross-fades between values so detail rows stay pixel-stable;
// the container is keyed on `value` so React remounts it and the
// CSS animation replays on every change.
function FadeSwap({
  value,
  render,
}: {
  value: string
  render?: () => React.ReactNode
}) {
  return (
    <div key={value} className="animate-fade-in">
      {render ? render() : value}
    </div>
  )
}
