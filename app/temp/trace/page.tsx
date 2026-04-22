'use client'

import { useEffect, useRef, useState } from 'react'

type Point = [number, number]
type Tri = { color: string; points: [Point, Point, Point] }

const STORAGE_KEY = 'owl-trace-v1'
/** Low-poly bird reference (grayscale SVG) — lives in public/trace/ */
const REF_IMAGE = '/trace/owl-reference.svg'

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function fmtTri(t: Tri): string {
  const pts = t.points
    .map(([x, y]) => `[${x.toFixed(2)}, ${y.toFixed(2)}]`)
    .join(', ')
  return `  { color: '${t.color}', points: [${pts}] },`
}

export default function TraceOwlPage() {
  const [triangles, setTriangles] = useState<Tri[]>([])
  const [pending, setPending] = useState<Point[]>([])
  const [color, setColor] = useState('#b5a88d')
  const [refOpacity, setRefOpacity] = useState(0.55)
  const [showRef, setShowRef] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [mouse, setMouse] = useState<Point | null>(null)
  const [bgColor, setBgColor] = useState('#a192d7')
  const [redoStack, setRedoStack] = useState<Tri[][]>([])
  const [hydrated, setHydrated] = useState(false)

  const stageRef = useRef<HTMLDivElement | null>(null)
  const pickerCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const pickerReadyRef = useRef(false)

  // ─── Persistence ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        if (Array.isArray(data)) setTriangles(data)
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(triangles))
  }, [triangles, hydrated])

  // ─── Offscreen canvas (for eyedropper) ───────────────────────────────────
  useEffect(() => {
    const cvs = document.createElement('canvas')
    pickerCanvasRef.current = cvs
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      cvs.width = img.naturalWidth
      cvs.height = img.naturalHeight
      cvs.getContext('2d')?.drawImage(img, 0, 0)
      pickerReadyRef.current = true
    }
    img.src = REF_IMAGE
  }, [])

  const pickColorAt = (xPct: number, yPct: number): string | null => {
    const cvs = pickerCanvasRef.current
    if (!cvs || !pickerReadyRef.current) return null
    const x = Math.max(0, Math.min(cvs.width - 1, Math.round((xPct / 100) * cvs.width)))
    const y = Math.max(0, Math.min(cvs.height - 1, Math.round((yPct / 100) * cvs.height)))
    const ctx = cvs.getContext('2d')
    if (!ctx) return null
    const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data
    if (a === 0) return null
    return rgbToHex(r, g, b)
  }

  // ─── Mouse ───────────────────────────────────────────────────────────────
  const evtToPct = (e: React.MouseEvent): Point | null => {
    const el = stageRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    return [x, y]
  }

  const onStageClick = (e: React.MouseEvent) => {
    const p = evtToPct(e)
    if (!p) return

    if (e.altKey) {
      const c = pickColorAt(p[0], p[1])
      if (c) setColor(c)
      return
    }

    const next = [...pending, p] as Point[]
    if (next.length >= 3) {
      const tri: Tri = { color, points: [next[0], next[1], next[2]] }
      setTriangles((t) => [...t, tri])
      setPending([])
      setRedoStack([])
    } else {
      setPending(next)
    }
  }

  const onStageMove = (e: React.MouseEvent) => {
    const p = evtToPct(e)
    if (p) setMouse(p)
  }

  // ─── Keyboard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea') return

      if (e.key === 'Escape') {
        setPending([])
        setSelected(null)
        return
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault()
        if (e.shiftKey) {
          setRedoStack((r) => {
            if (!r.length) return r
            const last = r[r.length - 1]
            setTriangles((t) => [...t, ...last])
            return r.slice(0, -1)
          })
        } else {
          if (pending.length) {
            setPending((p) => p.slice(0, -1))
          } else {
            setTriangles((t) => {
              if (!t.length) return t
              const last = t[t.length - 1]
              setRedoStack((r) => [...r, [last]])
              return t.slice(0, -1)
            })
          }
        }
        return
      }
      if (e.key === 'r' || e.key === 'R') {
        setShowRef((s) => !s)
      }
      if (e.key === 'g' || e.key === 'G') {
        setShowGrid((s) => !s)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pending])

  // ─── Actions ─────────────────────────────────────────────────────────────
  const removeTri = (i: number) => {
    setTriangles((t) => t.filter((_, j) => j !== i))
    setSelected(null)
  }
  const duplicateTri = (i: number) =>
    setTriangles((t) => [
      ...t.slice(0, i + 1),
      { color: t[i].color, points: [...t[i].points] as Tri['points'] },
      ...t.slice(i + 1),
    ])
  const moveTri = (i: number, dir: -1 | 1) =>
    setTriangles((t) => {
      const j = i + dir
      if (j < 0 || j >= t.length) return t
      const next = [...t]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  const recolorTri = (i: number, c: string) =>
    setTriangles((t) => t.map((tr, j) => (j === i ? { ...tr, color: c } : tr)))

  const clearAll = () => {
    if (window.confirm(`Clear all ${triangles.length} triangles?`)) {
      setTriangles([])
      setPending([])
      setSelected(null)
    }
  }

  const exportTs = async () => {
    const body = triangles.map(fmtTri).join('\n')
    const out =
      `// Generated from /temp/trace — ${triangles.length} triangles\n` +
      `const owl: Tri[] = [\n${body}\n]\n`
    try {
      await navigator.clipboard.writeText(out)
      alert(`Copied ${triangles.length} triangles to clipboard.\n\nPaste into app/temp/page.tsx.`)
    } catch {
      // fallback: dump to console + download
      console.log(out)
      const blob = new Blob([out], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'owl-triangles.ts'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const importJson = () => {
    const raw = window.prompt('Paste a JSON array of triangles (same shape as exported):')
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) setTriangles(data)
    } catch {
      alert('Invalid JSON')
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  const pendingPoly =
    pending.length >= 1 && mouse
      ? [...pending, mouse]
          .map(([x, y]) => `${x},${y}`)
          .join(' ')
      : null

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex">
      {/* Stage */}
      <section className="flex-1 p-6 flex flex-col items-center justify-center">
        <div
          ref={stageRef}
          onClick={onStageClick}
          onMouseMove={onStageMove}
          onMouseLeave={() => setMouse(null)}
          className="relative aspect-square w-full max-w-[42rem] cursor-crosshair rounded-sm overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          {/* Reference image */}
          {showRef && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={REF_IMAGE}
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              style={{ opacity: refOpacity }}
            />
          )}

          {/* SVG with committed triangles + pending preview */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {triangles.map((t, i) => (
              <polygon
                key={i}
                points={t.points.map(([x, y]) => `${x},${y}`).join(' ')}
                fill={t.color}
                stroke={selected === i ? '#ffffff' : 'none'}
                strokeWidth={selected === i ? 0.25 : 0}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {pendingPoly && (
              <polygon
                points={pendingPoly}
                fill={color}
                fillOpacity={0.35}
                stroke={color}
                strokeWidth={0.2}
                strokeDasharray="0.6 0.4"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {pending.map(([x, y], i) => (
              <circle
                key={`p-${i}`}
                cx={x}
                cy={y}
                r={0.6}
                fill="#ffffff"
                stroke="#000"
                strokeWidth={0.15}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {showGrid && (
              <g stroke="#ffffff" strokeOpacity={0.12} strokeWidth={0.1}>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((i) => (
                  <line key={`v${i}`} x1={i * 10} x2={i * 10} y1={0} y2={100} />
                ))}
                {Array.from({ length: 9 }, (_, i) => i + 1).map((i) => (
                  <line key={`h${i}`} x1={0} x2={100} y1={i * 10} y2={i * 10} />
                ))}
              </g>
            )}
          </svg>
        </div>

        {/* Cursor readout */}
        <div className="mt-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          <span className="tabular-nums">
            x {mouse ? mouse[0].toFixed(2) : '--'} &nbsp; y {mouse ? mouse[1].toFixed(2) : '--'}
          </span>
          <span>·</span>
          <span className="tabular-nums">{triangles.length} tri</span>
          <span>·</span>
          <span>{pending.length}/3 pending</span>
          <span>·</span>
          <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">alt+click</kbd> eyedrop
          <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">⌘Z</kbd> undo
          <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">esc</kbd> cancel
          <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">R</kbd> ref
          <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">G</kbd> grid
        </div>
      </section>

      {/* Sidebar */}
      <aside className="w-80 shrink-0 border-l border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-800 space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-400">Active color</div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer bg-transparent border border-neutral-700"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-2 text-xs font-mono"
            />
          </div>

          <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 pt-2">
            Reference opacity · {Math.round(refOpacity * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={refOpacity}
            onChange={(e) => setRefOpacity(parseFloat(e.target.value))}
            className="w-full"
          />

          <div className="flex items-center gap-2 pt-1">
            <label className="text-xs uppercase tracking-[0.2em] text-neutral-400 flex-1">Background</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border border-neutral-700"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setShowRef((s) => !s)}
              className={`flex-1 text-[10px] uppercase tracking-[0.15em] py-2 rounded border ${
                showRef ? 'bg-white text-black border-white' : 'bg-transparent border-neutral-700 text-neutral-400'
              }`}
            >
              Reference
            </button>
            <button
              onClick={() => setShowGrid((s) => !s)}
              className={`flex-1 text-[10px] uppercase tracking-[0.15em] py-2 rounded border ${
                showGrid ? 'bg-white text-black border-white' : 'bg-transparent border-neutral-700 text-neutral-400'
              }`}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Triangle list */}
        <div className="flex-1 overflow-y-auto">
          {triangles.length === 0 ? (
            <div className="p-6 text-xs text-neutral-500 leading-relaxed">
              Click <b className="text-neutral-300">three points</b> on the stage to commit a triangle.
              Hold <b className="text-neutral-300">alt</b> and click the reference to sample its color into the
              picker above. Triangles later in the list paint <b className="text-neutral-300">on top</b>.
            </div>
          ) : (
            <ul className="divide-y divide-neutral-900">
              {triangles.map((t, i) => (
                <li
                  key={i}
                  onMouseEnter={() => setSelected(i)}
                  onMouseLeave={() => setSelected(null)}
                  className={`px-3 py-2 flex items-center gap-2 text-xs ${
                    selected === i ? 'bg-neutral-900' : ''
                  }`}
                >
                  <span className="w-6 text-right tabular-nums text-neutral-500">{i + 1}</span>
                  <input
                    type="color"
                    value={t.color}
                    onChange={(e) => recolorTri(i, e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border border-neutral-700 shrink-0"
                    title="Change color"
                  />
                  <span className="font-mono text-[10px] text-neutral-400 flex-1 truncate">
                    {t.points.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(' · ')}
                  </span>
                  <button
                    onClick={() => moveTri(i, -1)}
                    disabled={i === 0}
                    className="w-5 h-5 text-neutral-500 hover:text-white disabled:opacity-20"
                    title="Move back (render earlier)"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveTri(i, 1)}
                    disabled={i === triangles.length - 1}
                    className="w-5 h-5 text-neutral-500 hover:text-white disabled:opacity-20"
                    title="Move forward (render later, on top)"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => duplicateTri(i)}
                    className="w-5 h-5 text-neutral-500 hover:text-white"
                    title="Duplicate"
                  >
                    ⎘
                  </button>
                  <button
                    onClick={() => removeTri(i)}
                    className="w-5 h-5 text-neutral-500 hover:text-red-400"
                    title="Delete"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-neutral-800 grid grid-cols-2 gap-2">
          <button
            onClick={exportTs}
            className="col-span-2 py-2.5 rounded bg-white text-black text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-neutral-200"
          >
            Copy to clipboard
          </button>
          <button
            onClick={importJson}
            className="py-2 rounded border border-neutral-700 text-neutral-400 text-[10px] uppercase tracking-[0.15em] hover:border-neutral-500 hover:text-white"
          >
            Import JSON
          </button>
          <button
            onClick={clearAll}
            className="py-2 rounded border border-neutral-700 text-neutral-400 text-[10px] uppercase tracking-[0.15em] hover:border-red-500 hover:text-red-400"
          >
            Clear all
          </button>
        </div>
      </aside>
    </main>
  )
}
