'use client'

import { useEffect, useRef, useState } from 'react'

interface PortfolioItem {
  id: number
  index: string
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
    index: '01',
    title: 'Developer',
    subtitle: 'Full-stack & Systems',
    tags: ['Web Apps', 'APIs', 'Systems', 'Open Source'],
    industry: ['Software', 'Developer Tools'],
    client: 'Independent & Teams',
    description:
      'Shipping full-stack web apps, tooling, and systems code. Comfortable from the metal up to the UI, with a bias toward small, sharp, maintainable codebases.',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&h=1000&fit=crop',
  },
  {
    id: 2,
    index: '02',
    title: 'AI Researcher',
    subtitle: 'Vision · Language · Multimodal',
    tags: ['Deep Learning', 'Computer Vision', 'NLP', 'Multimodal'],
    industry: ['Research', 'Artificial Intelligence'],
    client: 'Academic Labs',
    description:
      'Exploring novel architectures, training regimes, and applications across vision, language, and multimodal systems. Paper-driven, experiment-heavy.',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=1000&fit=crop',
  },
  {
    id: 3,
    index: '03',
    title: 'ML Engineer',
    subtitle: 'Pipelines · Serving · Scale',
    tags: ['MLOps', 'Model Serving', 'Pipelines', 'Inference'],
    industry: ['Machine Learning', 'MLOps'],
    client: 'Product Teams',
    description:
      'Taking models from notebook to production — data pipelines, training infrastructure, evaluation, and low-latency inference at scale.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=1000&fit=crop',
  },
  {
    id: 4,
    index: '04',
    title: 'And More',
    subtitle: 'Math · Design · Writing',
    tags: ['Mathematics', 'Design', 'Writing', 'Music'],
    industry: ['Exploratory', 'Creative'],
    client: 'Myself',
    description:
      'Beyond the titles — a long-standing obsession with mathematics, and side-pursuits in design, writing, and anything that sharpens the craft.',
    image:
      'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=1600&h=1000&fit=crop',
  },
]

const ITEM_HEIGHT = 200 // px — vertical slot per name; big enough to give breathing room

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
        {/* Index label — bottom-right of the whole section */}
        <div className="absolute bottom-10 right-12 z-10 text-xs uppercase tracking-[0.3em] text-neutral-500 tabular-nums">
          <FadeSwap
            value={active.index}
            render={() => (
              <div className="flex items-center gap-6">
                <span className="text-neutral-500 normal-case tracking-wide">
                  {active.subtitle}
                </span>
                <span>
                  <span className="text-neutral-300">{active.index}</span>
                  <span className="mx-2 text-neutral-700">/</span>
                  <span>{String(total).padStart(2, '0')}</span>
                </span>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] h-full gap-24 px-12 py-20">
          {/* LEFT — image + stable detail rows */}
          <div className="flex flex-col min-w-0">
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
              <DetailRow label="Role">
                <FadeSwap value={active.client} />
              </DetailRow>
            </div>
          </div>

          {/* RIGHT — big sliding name list */}
          <div className="relative overflow-hidden min-w-0">
            {/* Sliding stack of names */}
            <div
              className="absolute left-0 right-0 transition-transform duration-700 ease-out"
              style={{
                top: '50%',
                transform: `translateY(${
                  -activeIndex * ITEM_HEIGHT - ITEM_HEIGHT / 2
                }px)`,
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
                      className={`font-sans font-semibold leading-[0.9] tracking-tight transition-all duration-700 ease-out whitespace-nowrap ${
                        isActive ? 'text-white' : 'text-neutral-700'
                      }`}
                      style={{
                        fontSize: isActive ? '9rem' : '6rem',
                        letterSpacing: '-0.03em',
                      }}
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
      <div className="text-sm text-neutral-200 leading-relaxed">{children}</div>
    </div>
  )
}

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
