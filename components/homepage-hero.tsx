export function HomepageHero() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden flex items-end">
      {/* Huge background name */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1
          aria-hidden
          className="font-black tracking-tighter text-foreground leading-none whitespace-nowrap"
          style={{
            fontSize: 'clamp(12rem, 38vw, 40rem)',
            letterSpacing: '-0.06em',
          }}
        >
          aravinth
        </h1>
      </div>

      {/* Foreground tagline */}
      <div className="relative z-10 px-8 pb-16 md:pb-24 w-full">
        <p className="text-2xl md:text-3xl font-semibold text-foreground max-w-3xl leading-tight">
          Machine Learning Engineer, Researcher and Software Developer with a passion for anything Mathematics.
        </p>
      </div>
    </main>
  )
}
