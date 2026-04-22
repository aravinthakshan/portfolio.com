'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const SVG_URL = '/bird-assemble.svg'

function randomScatter() {
  const spread = 320
  const rotMax = 100
  return {
    tx: (Math.random() - 0.5) * spread * 2,
    ty: (Math.random() - 0.5) * spread * 2,
    rot: (Math.random() - 0.5) * rotMax * 2,
  }
}

function playAssemble(host: HTMLDivElement) {
  const paths = host.querySelectorAll<SVGPathElement>('svg path')
  if (!paths.length) return

  const duration = 1.15
  const staggerMs = 14

  paths.forEach((path) => {
    const { tx, ty, rot } = randomScatter()
    path.style.transformBox = 'fill-box'
    path.style.transformOrigin = 'center'
    path.style.transition = 'none'
    path.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(0.82)`
    path.style.opacity = '0.35'
    void path.getBoundingClientRect()
  })

  void host.offsetHeight

  paths.forEach((path, i) => {
    const delay = `${i * staggerMs}ms`
    path.style.transition = `transform ${duration}s cubic-bezier(0.33, 1.15, 0.4, 1) ${delay}, opacity 0.55s ease-out ${delay}`
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

export default function TempBirdAssemblePage() {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const svgTextRef = useRef<string | null>(null)

  const run = useCallback(() => {
    const host = hostRef.current
    if (!host || !svgTextRef.current) return
    host.innerHTML = svgTextRef.current
    const svg = host.querySelector('svg')
    if (svg) {
      svg.removeAttribute('width')
      svg.removeAttribute('height')
      svg.setAttribute('class', 'w-full h-auto max-w-[min(90vw,520px)] mx-auto block')
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    }
    playAssemble(host)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch(SVG_URL)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.text()
      })
      .then((text) => {
        if (cancelled) return
        svgTextRef.current = text
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (status !== 'ready') return
    const host = hostRef.current
    if (!host || !svgTextRef.current) return
    run()
  }, [status, run])

  return (
    <main className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg text-center mb-8 space-y-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
          Temp demo
        </p>
        <h1 className="text-xl font-semibold text-neutral-900">
          SVG shards → bird
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Each <code className="text-xs bg-neutral-200/80 px-1 rounded">path</code>{' '}
          flies in with{' '}
          <code className="text-xs bg-neutral-200/80 px-1 rounded">transform</code>{' '}
          (not <code className="text-xs bg-neutral-200/80 px-1 rounded">polygon</code>{' '}
          morph). Source:{' '}
          <code className="text-xs bg-neutral-200/80 px-1 rounded">public/bird-assemble.svg</code>
        </p>
      </div>

      {status === 'loading' && (
        <p className="text-sm text-neutral-500">Loading SVG…</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">
          Could not load {SVG_URL}. Is the file in <code>public/</code>?
        </p>
      )}

      <div
        ref={hostRef}
        className="bird-host w-full flex justify-center min-h-[200px]"
        aria-hidden={status !== 'ready'}
      />

      <div className="mt-10 flex gap-3">
        <button
          type="button"
          disabled={status !== 'ready'}
          onClick={() => run()}
          className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold tracking-[0.15em] uppercase disabled:opacity-40 hover:scale-105 transition-transform"
        >
          Replay
        </button>
        <a
          href="/temp"
          className="px-5 py-2 rounded-full border border-neutral-300 text-neutral-700 text-xs font-bold tracking-[0.15em] uppercase hover:bg-white transition-colors"
        >
          Polygon owl
        </a>
      </div>
    </main>
  )
}
