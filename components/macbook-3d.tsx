'use client'

import { ReactNode } from 'react'

interface Macbook3DProps {
  screens: { key: string | number; src: string; alt?: string }[]
  activeIndex: number
  children?: ReactNode
}

export function Macbook3D({ screens, activeIndex, children }: Macbook3DProps) {
  return (
    <div className="macbook-perspective w-full h-full flex items-center justify-center">
      <div className="macbook-float">
        <div className="macbook-tilt">
          {/* Lid (screen) */}
          <div className="macbook-lid">
            <div className="macbook-bezel">
              <div className="macbook-camera" />
              <div className="macbook-screen">
                {/* Cross-fade stack of screens */}
                {screens.map((s, i) => (
                  <img
                    key={s.key}
                    src={s.src}
                    alt={s.alt ?? ''}
                    className={`macbook-screen-img ${
                      i === activeIndex ? 'is-active' : ''
                    }`}
                  />
                ))}
                {children}
                {/* Subtle glare */}
                <div className="macbook-glare" />
              </div>
            </div>
          </div>

          {/* Hinge */}
          <div className="macbook-hinge" />

          {/* Base (keyboard deck) */}
          <div className="macbook-base">
            <div className="macbook-base-top" />
            <div className="macbook-base-front" />
            <div className="macbook-notch" />
          </div>

          {/* Floor shadow */}
          <div className="macbook-shadow" />
        </div>
      </div>
    </div>
  )
}
