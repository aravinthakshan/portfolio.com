'use client'

import { MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'

export function NavigationHeader() {
  const [onDark, setOnDark] = useState(false)
  const [logoOpacity, setLogoOpacity] = useState(1)

  useEffect(() => {
    // The header flips to a dark-theme palette whenever a section explicitly
    // marked `data-theme="dark"` is crossing the top of the viewport. Light
    // sections (hero, contact) leave the header in its default dark-on-light
    // palette.
    const HEADER_LINE = 60
    const FADE_DISTANCE = 220

    const handle = () => {
      const y = window.scrollY
      const darkSections = document.querySelectorAll<HTMLElement>(
        '[data-theme="dark"]'
      )
      let anyDark = false
      let activeDark: HTMLElement | null = null
      for (const el of darkSections) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= HEADER_LINE && rect.bottom > HEADER_LINE) {
          anyDark = true
          activeDark = el
        }
      }
      setOnDark(anyDark)

      // Hero (light): fade with scrollY. Dark sections (tall wrappers e.g.
      // portfolio/globe): fade by scroll distance since the section top crossed
      // the header line — using document Y so it works for multi-vh blocks.
      if (activeDark) {
        const topDoc = activeDark.getBoundingClientRect().top + y
        const engageY = topDoc - HEADER_LINE
        const delta = y - engageY
        setLogoOpacity(Math.max(0, 1 - delta / FADE_DISTANCE))
      } else {
        setLogoOpacity(Math.max(0, 1 - y / FADE_DISTANCE))
      }
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [])

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-4 md:py-5 flex items-center justify-between gap-3">
      {/* Logo — opacity fades while scrolling on light (hero) and on dark
          sections; color switches instantly with `onDark` so it never grays out. */}
      <div
        className={`text-xl md:text-3xl font-serif font-bold transition-opacity duration-300 truncate ${
          onDark ? 'text-white' : 'text-foreground'
        }`}
        style={{ opacity: logoOpacity }}
      >
        aravinthakshan
      </div>

      {/* Action button */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Chat pill — jumps to the contact section */}
        <button
          type="button"
          onClick={scrollToContact}
          aria-label="Jump to contact section"
          className={`group flex items-center gap-1.5 md:gap-2 pl-3.5 md:pl-5 pr-1 md:pr-1.5 py-1 md:py-1.5 rounded-full transition-[background-color,color,border-color,transform] duration-300 ease-out hover:scale-110 active:scale-105 cursor-pointer ${
            onDark
              ? 'bg-white/10 text-white border-2 border-white/40 backdrop-blur-sm'
              : 'bg-[#e7e9ec] text-foreground border-2 border-transparent'
          }`}
        >
          <span className="text-[10px] md:text-xs font-bold tracking-[0.14em] uppercase">
            Chat
          </span>
          <span
            className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:rotate-12"
          >
            <MessageSquare className="w-3 h-3 md:w-3.5 md:h-3.5 text-black" strokeWidth={2.25} />
          </span>
        </button>

        {/* Menu pill */}
        <button
          className="group flex items-center gap-1.5 md:gap-2 pl-3.5 md:pl-5 pr-1 md:pr-1.5 py-1 md:py-1.5 rounded-full bg-black text-white border-2 border-white/50 transition-transform duration-300 ease-out hover:scale-110 active:scale-105"
        >
          <span className="text-[10px] md:text-xs font-bold tracking-[0.14em] uppercase">
            Menu
          </span>
          <span className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2a2a2a] transition-transform duration-300 group-hover:rotate-12">
            <span className="flex items-center gap-[3px]">
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white" />
            </span>
          </span>
        </button>
      </div>
    </header>
  )
}
