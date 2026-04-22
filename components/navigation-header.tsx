'use client'

import { MessageSquare } from 'lucide-react'

export function NavigationHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl md:text-3xl font-serif font-bold text-foreground">
        aravinthakshan
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {/* Chat pill */}
        <button
          className="group flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full bg-[#e7e9ec] text-foreground transition-transform duration-300 ease-out hover:scale-110 active:scale-105"
        >
          <span className="text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase">
            Chat with aravinth
          </span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:rotate-12">
            <MessageSquare className="w-3.5 h-3.5 text-foreground" strokeWidth={2.25} />
          </span>
        </button>

        {/* Menu pill */}
        <button
          className="group flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full bg-black text-white transition-transform duration-300 ease-out hover:scale-110 active:scale-105"
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
