'use client'

import { MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'

export function NavigationHeader() {
  const [scrollY, setScrollY] = useState(0)
  const [onDark, setOnDark] = useState(false)

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY
      setScrollY(y)
      // Only flip to the dark-section theme once the black portfolio actually
      // fills the top of the viewport (i.e. we've fully scrolled past the hero).
      setOnDark(y >= window.innerHeight - 80)
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between">
      {/* Logo — only opacity is transitioned; color is switched instantly
          so it never crossfades through gray when entering the dark section. */}
      <div
        className={`text-2xl md:text-3xl font-serif font-bold transition-opacity duration-300 ${
          onDark ? 'text-white' : 'text-foreground'
        }`}
        style={{ opacity: logoOpacity }}
      >
        aravinthakshan
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {/* Chat pill */}
        <button
          className={`group flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full transition-[background-color,color,border-color,transform] duration-300 ease-out hover:scale-110 active:scale-105 ${
            onDark
              ? 'bg-white/10 text-white border-2 border-white/40 backdrop-blur-sm'
              : 'bg-[#e7e9ec] text-foreground border-2 border-transparent'
          }`}
        >
          <span className="text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase">
            Chat with aravinth
          </span>
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm transition-[background-color,transform] duration-300 group-hover:rotate-12 ${
              onDark ? 'bg-white' : 'bg-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-black" strokeWidth={2.25} />
          </span>
        </button>

        {/* Menu pill */}
        <button
          className="group flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full bg-black text-white border-2 border-white/50 transition-transform duration-300 ease-out hover:scale-110 active:scale-105"
        >
          <span className="text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase">
            Menu
          </span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2a2a2a] transition-transform duration-300 group-hover:rotate-12">
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
