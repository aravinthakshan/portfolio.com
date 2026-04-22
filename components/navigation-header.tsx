'use client'

import { MessageSquare } from 'lucide-react'
import { type RefObject, useEffect, useState } from 'react'

type NavigationHeaderProps = {
  /** After hero bird assembles, show the mark inline to the right of the name. */
  showNavBird?: boolean
  /** Reserved box for the bird — flight animation targets this rect. */
  birdSlotRef?: RefObject<HTMLSpanElement | null>
}

export function NavigationHeader({
  showNavBird = false,
  birdSlotRef,
}: NavigationHeaderProps) {
  const [scrollY, setScrollY] = useState(0)
  const [onDark, setOnDark] = useState(false)

  useEffect(() => {
    // The header flips to a dark-theme palette whenever a section explicitly
    // marked `data-theme="dark"` is crossing the top of the viewport. Light
    // sections (hero, contact) leave the header in its default dark-on-light
    // palette.
    const HEADER_LINE = 60

    const handle = () => {
      const y = window.scrollY
      setScrollY(y)
      const darkSections = document.querySelectorAll<HTMLElement>(
        '[data-theme="dark"]'
      )
      let anyDark = false
      darkSections.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top <= HEADER_LINE && rect.bottom > HEADER_LINE) {
          anyDark = true
        }
      })
      setOnDark(anyDark)
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [])

  // In the hero: fade the logo as the user scrolls (it "disappears").
  // On the dark section: bring it back fully visible, colored white.
  const logoOpacity = onDark ? 1 : Math.max(0, 1 - scrollY / 220)

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-4 md:py-5 flex items-center justify-between gap-3">
      {/* Logo + optional bird mark — same row, shared scroll fade */}
      <div
        className={`flex items-center gap-2 md:gap-3 min-w-0 shrink transition-opacity duration-300 ${
          onDark ? 'text-white' : 'text-foreground'
        }`}
        style={{ opacity: logoOpacity }}
      >
        <span className="text-xl md:text-3xl font-serif font-bold truncate">
          aravinthakshan
        </span>
        <span
          ref={birdSlotRef}
          className="inline-flex h-20 w-20 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center"
          aria-hidden
        >
          {showNavBird && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/trace/owl-reference.svg"
              alt=""
              className="h-full w-full object-contain opacity-95"
              aria-hidden
            />
          )}
        </span>
      </div>

      {/* Action buttons */}
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
