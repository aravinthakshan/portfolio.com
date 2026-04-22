'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'

const SVG_URL = '/trace/owl-reference.svg'

const ASSEMBLE_DURATION_S = 1.45
const ASSEMBLE_STAGGER_MS = 11
const SETTLE_BUFFER_MS = 280
const BEFORE_FLIGHT_MS = 450
const FLIGHT_MS = 1200

type HeroVectorAssemblyProps = {
  onHandoffComplete?: () => void
  /** Navbar slot (right of the name) — flight lands here. */
  flightTargetRef?: RefObject<HTMLElement | null>
}

type FlightRects = {
  svgHtml: string
  start: DOMRect
  end: DOMRect
}

/** Radial scatter so shards feel “around” the centered wordmark, then fly in. */
function randomOutwardScatter() {
  const angle = Math.random() * Math.PI * 2
  const radius = 200 + Math.random() * 280
  return {
    tx: Math.cos(angle) * radius + (Math.random() - 0.5) * 120,
    ty: Math.sin(angle) * radius + (Math.random() - 0.5) * 120,
    rot: (Math.random() - 0.5) * 85,
    scale: 0.72 + Math.random() * 0.18,
  }
}

function playAssemble(host: HTMLDivElement) {
  const paths = host.querySelectorAll<SVGPathElement>('svg path')
  if (!paths.length) return

  const duration = ASSEMBLE_DURATION_S
  const staggerMs = ASSEMBLE_STAGGER_MS

  paths.forEach((path) => {
    const { tx, ty, rot, scale } = randomOutwardScatter()
    path.style.transformBox = 'fill-box'
    path.style.transformOrigin = 'center'
    path.style.transition = 'none'
    path.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`
    path.style.opacity = '0.22'
    void path.getBoundingClientRect()
  })

  void host.offsetHeight

  paths.forEach((path, i) => {
    const delay = `${i * staggerMs}ms`
    path.style.transition = `transform ${duration}s cubic-bezier(0.33, 1.1, 0.38, 1) ${delay}, opacity 0.7s ease-out ${delay}`
  })

  void host.offsetHeight

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      paths.forEach((path) => {
        path.style.transform = 'translate(0, 0) rotate(0deg) scale(1)'
        path.style.opacity = '1'
      })
    })
  })
}

export function HeroVectorAssembly({
  onHandoffComplete,
  flightTargetRef,
}: HeroVectorAssemblyProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const handoffRef = useRef(onHandoffComplete)
  handoffRef.current = onHandoffComplete

  const [handedOff, setHandedOff] = useState(false)
  const [fly, setFly] = useState<FlightRects | null>(null)
  const [flyPlay, setFlyPlay] = useState(false)

  useLayoutEffect(() => {
    if (!fly) {
      setFlyPlay(false)
      return
    }
    setFlyPlay(false)
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlyPlay(true))
    })
    return () => cancelAnimationFrame(id)
  }, [fly])

  useEffect(() => {
    if (!fly || !flyPlay) return
    const t = window.setTimeout(() => {
      handoffRef.current?.()
      setHandedOff(true)
      setFly(null)
      setFlyPlay(false)
    }, FLIGHT_MS + 40)
    return () => clearTimeout(t)
  }, [fly, flyPlay])

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let flightTimeoutId: ReturnType<typeof setTimeout> | undefined

    fetch(SVG_URL)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.text()
      })
      .then((text) => {
        if (cancelled || !hostRef.current) return
        const el = hostRef.current
        el.innerHTML = text
        const svg = el.querySelector('svg')
        if (svg) {
          svg.removeAttribute('width')
          svg.removeAttribute('height')
          svg.setAttribute('class', 'w-full h-auto block')
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        }
        timeoutId = window.setTimeout(() => {
          if (!hostRef.current || cancelled) return
          playAssemble(hostRef.current)
          const n = hostRef.current.querySelectorAll('svg path').length
          const settleMs =
            ASSEMBLE_DURATION_S * 1000 +
            Math.max(0, n - 1) * ASSEMBLE_STAGGER_MS +
            SETTLE_BUFFER_MS +
            BEFORE_FLIGHT_MS
          flightTimeoutId = window.setTimeout(() => {
            if (cancelled || !hostRef.current) return
            const host = hostRef.current
            const target = flightTargetRef?.current
            const svgEl = host.querySelector('svg')
            const svgHtml = svgEl?.outerHTML
            if (!svgHtml || !target || target.getBoundingClientRect().width < 1) {
              handoffRef.current?.()
              setHandedOff(true)
              return
            }
            const start = host.getBoundingClientRect()
            const end = target.getBoundingClientRect()
            setFly({ svgHtml, start, end })
          }, settleMs)
        }, 120)
      })
      .catch(() => {
        if (hostRef.current) hostRef.current.innerHTML = ''
      })

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
      if (flightTimeoutId) clearTimeout(flightTimeoutId)
    }
  }, [flightTargetRef])

  if (handedOff) return null

  const r = fly
  const useEnd = flyPlay && r

  return (
    <>
      {r && (
        <div
          className="pointer-events-none fixed z-[60] overflow-hidden [&_svg]:h-full [&_svg]:w-full [&_svg]:object-contain"
          style={{
            left: useEnd ? r.end.left : r.start.left,
            top: useEnd ? r.end.top : r.start.top,
            width: useEnd ? r.end.width : r.start.width,
            height: useEnd ? r.end.height : r.start.height,
            transition: flyPlay
              ? `left ${FLIGHT_MS}ms cubic-bezier(0.4, 0, 0.2, 1), top ${FLIGHT_MS}ms cubic-bezier(0.4, 0, 0.2, 1), width ${FLIGHT_MS}ms cubic-bezier(0.4, 0, 0.2, 1), height ${FLIGHT_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : 'none',
          }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: r.svgHtml }}
          aria-hidden
        />
      )}

      <div
        className={`pointer-events-none absolute inset-0 z-[7] flex items-center justify-center select-none px-4 sm:px-6 ${
          fly ? 'opacity-0 invisible' : ''
        }`}
      >
        <div
          ref={hostRef}
          className="w-[min(94vw,620px)] sm:w-[min(90vw,720px)] md:w-[min(82vw,880px)] lg:w-[min(76vw,1000px)] max-h-[min(78vh,920px)] shrink-0 [&_svg]:max-h-[min(78vh,920px)]"
          aria-hidden
        >
          {/* SVG injected here */}
        </div>
      </div>
    </>
  )
}
