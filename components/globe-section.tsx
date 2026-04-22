'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type Location = {
  id: number
  country: string
  city?: string
  lat: number
  lng: number
}

const locations: Location[] = [
  { id: 1, country: 'India', city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { id: 2, country: 'Singapore', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { id: 3, country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { id: 4, country: 'Germany', city: 'Berlin', lat: 52.52, lng: 13.405 },
  { id: 5, country: 'United States', city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  // Final "home" landing — stays displayed differently in the overlay.
  { id: 6, country: 'India', city: 'Manipal', lat: 13.3474, lng: 74.7869 },
]

const GEOJSON_URL =
  'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson'

// Timing for one full hop animation (ms)
const HOP_DURATION = 1100
const HOP_DWELL = 650 // time the pulsing ring stays after landing
const CYCLE = HOP_DURATION + HOP_DWELL
// Short delay before the very first hop fires once the section comes into view,
// so the animation feels immediate instead of waiting a full cycle.
const FIRST_HOP_DELAY = 250

export function GlobeSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GlobeRef = useRef<any>(null)
  const [Globe, setGlobe] = useState<React.ComponentType<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null>(null)

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [inView, setInView] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hexData, setHexData] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [arcsData, setArcsData] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ringsData, setRingsData] = useState<any[]>([])
  const [dims, setDims] = useState({ width: 0, height: 0 })

  const total = locations.length

  // Dynamically import the globe lib (client-side only).
  useEffect(() => {
    let cancelled = false
    import('react-globe.gl').then((mod) => {
      if (!cancelled) setGlobe(() => mod.default)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Fetch country polygons once.
  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((geo) => setHexData(geo.features))
      .catch(() => {})
  }, [])

  // Size the canvas to its container.
  useEffect(() => {
    const update = () => {
      const el = containerRef.current
      if (!el) return
      setDims({ width: el.clientWidth, height: el.clientHeight })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Observe when the section is visible; only animate while it is.
  // Low threshold so the animation kicks in as the section starts entering.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setInView(e.isIntersecting))
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Initial camera placement + disable user-drag so the cycle is driven by us.
  useEffect(() => {
    if (!GlobeRef.current) return
    const controls = GlobeRef.current.controls()
    controls.enableZoom = false
    controls.enableRotate = false
    controls.autoRotate = false
    GlobeRef.current.pointOfView(
      { lat: locations[0].lat, lng: locations[0].lng, altitude: 2.2 },
      0
    )
  }, [Globe])

  // Auto-advance the active index while the section is in view.
  // Fire the first hop almost immediately, then pace the rest on CYCLE.
  useEffect(() => {
    if (!inView) return
    let intervalId: ReturnType<typeof setInterval> | undefined
    const kickoff = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % total)
      intervalId = setInterval(() => {
        setActiveIndex((i) => (i + 1) % total)
      }, CYCLE)
    }, FIRST_HOP_DELAY)
    return () => {
      clearTimeout(kickoff)
      if (intervalId) clearInterval(intervalId)
    }
  }, [inView, total])

  // Animate from previous → current location each time activeIndex changes.
  const prevIndexRef = useRef<number>(0)
  useEffect(() => {
    if (!GlobeRef.current) return
    const from = locations[prevIndexRef.current]
    const to = locations[activeIndex]
    if (!from || !to || from.id === to.id) return

    setArcsData([
      {
        startLat: from.lat,
        startLng: from.lng,
        endLat: to.lat,
        endLng: to.lng,
        color: 'rgba(255,255,255,0.9)',
      },
    ])
    setRingsData([])

    GlobeRef.current.pointOfView(
      { lat: to.lat, lng: to.lng, altitude: 2.2 },
      HOP_DURATION
    )

    const t1 = setTimeout(() => {
      setRingsData([
        {
          lat: to.lat,
          lng: to.lng,
          maxRadius: 5,
          propagationSpeed: 4,
          repeatPeriod: 1200,
        },
      ])
    }, HOP_DURATION)

    const t2 = setTimeout(() => {
      setArcsData([])
    }, HOP_DURATION + 100)

    prevIndexRef.current = activeIndex
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [activeIndex])

  const globeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const active = locations[activeIndex]

  return (
    <div
      ref={sectionRef}
      data-theme="dark"
      className="relative bg-black text-white"
      style={{ height: '200vh' }}
    >
      {/* Sticky inner — pins the globe while the wrapper provides 200vh of
          scroll so the section has real scroll resistance and the hand-off
          from the portfolio feels continuous (pinned → pinned) instead of a
          short flyby. */}
      <div
        ref={containerRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Globe canvas */}
        {Globe && dims.width > 0 && (
          <div className="absolute inset-0">
            <Globe
              ref={GlobeRef}
              width={dims.width}
              height={dims.height}
              globeMaterial={globeMaterial}
              backgroundColor="rgba(0,0,0,0)"
              showAtmosphere={false}
              showGlobe={true}
              hexPolygonsData={hexData}
              hexPolygonResolution={3}
              hexPolygonMargin={0.3}
              hexPolygonUseDots={true}
              hexPolygonColor={() => 'rgba(255,255,255,0.22)'}
              arcsData={arcsData}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              arcColor={(a: any) => a.color}
              arcStroke={0.6}
              arcDashLength={0.9}
              arcDashGap={0.1}
              arcDashAnimateTime={900}
              arcAltitudeAutoScale={0.4}
              ringsData={ringsData}
              ringColor={() => 'rgba(255,255,255,0.85)'}
              ringMaxRadius={() => 4}
              ringPropagationSpeed={() => 4}
              ringRepeatPeriod={() => 900}
            />
          </div>
        )}

        {/* Subtle vignette so the globe reads as floating */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.85) 100%)',
          }}
        />

        {/* Overlay content */}
        <div className="relative z-10 h-full px-6 md:px-12 py-20">
          {/* Vertically-centered heading on the left, with remote-experience line directly below */}
          <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 max-w-xl">
            <h2
              className="font-semibold leading-[0.95] tracking-tight text-white"
              style={{
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Any timezone.
              <br />
              Any codebase.
            </h2>
            <p className="mt-6 max-w-sm text-sm md:text-base text-neutral-400 leading-snug">
              2 years of work experience working remotely.
            </p>
          </div>

          {/* Bottom-left: routing through each destination, "based in" on the final one */}
          <div className="absolute left-6 md:left-12 bottom-10 text-xs uppercase tracking-[0.25em] text-neutral-500">
            <div key={`label-${active.id}`} className="animate-fade-in">
              {activeIndex === total - 1
                ? 'Currently based in'
                : 'Currently routing to'}
            </div>
            <div
              key={active.id}
              className="animate-fade-in mt-3 text-white text-2xl md:text-3xl normal-case tracking-tight font-semibold"
            >
              {active.city ?? active.country}
              <span className="text-neutral-500 font-normal">
                {' '}
                · {active.country}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
