'use client'

export function LoadingIcon() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50 overflow-hidden">
      <div className="animate-orb-grow">
        <div className="relative w-40 h-40 rounded-full animate-orb-spin">
          {/* Base orb */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, #ffffff 0%, #c9c9c9 30%, #4a4a4a 65%, #000000 100%)',
              boxShadow:
                '0 0 60px 10px rgba(255,255,255,0.25), inset -20px -30px 60px rgba(0,0,0,0.6), inset 20px 20px 50px rgba(255,255,255,0.18)',
            }}
          />
          {/* Highlight */}
          <div
            className="absolute rounded-full"
            style={{
              top: '12%',
              left: '18%',
              width: '35%',
              height: '25%',
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
              filter: 'blur(4px)',
            }}
          />
          {/* Ring */}
          <div
            className="absolute inset-0 rounded-full border border-white/20"
            style={{ transform: 'rotate(20deg) scale(1.1)' }}
          />
        </div>
      </div>
    </div>
  )
}
