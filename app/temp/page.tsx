'use client'

import { useEffect, useMemo, useState } from 'react'

type Point = [number, number]
type Tri = {
  color: string
  points: [Point, Point, Point]
}

/**
 * Forest-owl made of hand-placed triangles.
 * Coordinates are in percentages of the container (0-100).
 * Drawn roughly from the reference image — a seated owl on a branch,
 * facing forward with a dark wing on its left (viewer's right).
 */
const owl: Tri[] = [
  // ─── Head crown ───
  { color: '#8f7d62', points: [[50, 6],  [36, 20], [64, 20]] }, // top peak
  { color: '#6f5f48', points: [[36, 20], [64, 20], [50, 30]] }, // forehead triangle (dark V)

  // ─── Ears / face outline ───
  { color: '#c4b99f', points: [[36, 20], [22, 30], [40, 34]] }, // left ear/tuft
  { color: '#b5a88d', points: [[64, 20], [60, 34], [78, 30]] }, // right ear/tuft
  { color: '#d4c9ae', points: [[22, 30], [40, 34], [30, 44]] }, // left cheek hi
  { color: '#a59a80', points: [[78, 30], [60, 34], [70, 44]] }, // right cheek shadow

  // ─── Face mask (around eyes) ───
  { color: '#3a3124', points: [[36, 20], [40, 34], [50, 30]] }, // left eye mask
  { color: '#2a2319', points: [[64, 20], [60, 34], [50, 30]] }, // right eye mask

  // ─── Beak (the one bright accent) ───
  { color: '#e2b833', points: [[47, 32], [53, 32], [50, 42]] },

  // ─── Lower face ───
  { color: '#b8ac91', points: [[40, 34], [50, 44], [60, 34]] }, // chin light
  { color: '#988c72', points: [[40, 34], [30, 44], [50, 48]] }, // left lower cheek
  { color: '#897e65', points: [[60, 34], [70, 44], [50, 48]] }, // right lower cheek

  // ─── Chest / belly (light side) ───
  { color: '#c8bda2', points: [[30, 44], [22, 66], [45, 58]] },
  { color: '#b4a88d', points: [[22, 66], [45, 58], [34, 76]] },
  { color: '#a99d82', points: [[45, 58], [34, 76], [50, 72]] },
  { color: '#cfc4a9', points: [[45, 58], [50, 48], [50, 72]] }, // center belly

  // ─── Back / wing (dark side) ───
  { color: '#4a4033', points: [[50, 48], [70, 44], [60, 64]] }, // upper wing
  { color: '#3a3127', points: [[70, 44], [78, 56], [60, 64]] }, // shoulder
  { color: '#2c241c', points: [[60, 64], [78, 56], [72, 74]] }, // mid wing
  { color: '#1a1510', points: [[60, 64], [72, 74], [58, 76]] }, // wing fold
  { color: '#0d0a07', points: [[58, 76], [72, 74], [66, 88]] }, // wing tip (darkest)
  { color: '#2a231a', points: [[50, 72], [58, 76], [50, 86]] }, // lower back

  // ─── Tail / under-belly meeting branch ───
  { color: '#867b62', points: [[34, 76], [50, 72], [42, 86]] },
  { color: '#6d634d', points: [[34, 76], [42, 86], [28, 84]] },

  // ─── Feet ───
  { color: '#3a2c1f', points: [[44, 84], [48, 84], [46, 90]] },
  { color: '#3a2c1f', points: [[52, 84], [56, 84], [54, 90]] },

  // ─── Branch ───
  { color: '#2d2017', points: [[6, 92], [30, 86], [38, 96]] },
  { color: '#3e2d20', points: [[30, 86], [58, 88], [50, 96]] },
  { color: '#2d2017', points: [[58, 88], [86, 92], [72, 100]] },
  { color: '#1e150f', points: [[38, 96], [50, 96], [44, 100]] },
  { color: '#1e150f', points: [[50, 96], [72, 100], [58, 100]] },
]

/** random float in [min, max] */
const r = (min: number, max: number) => Math.random() * (max - min) + min

/** Random triangle anywhere from just outside the frame, so shards fly in. */
function randomTriangle(): [Point, Point, Point] {
  // Pick a rough centroid somewhere off-screen-ish, then jitter 3 points around it.
  const cx = r(-30, 130)
  const cy = r(-30, 130)
  const spread = r(6, 22)
  const pt = (): Point => [cx + r(-spread, spread), cy + r(-spread, spread)]
  return [pt(), pt(), pt()]
}

const toClip = (pts: [Point, Point, Point]) =>
  `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')})`

export default function TempOwlPage() {
  const [formed, setFormed] = useState(false)
  const [seed, setSeed] = useState(0)

  // Regenerate random starting positions whenever seed changes.
  const randoms = useMemo(
    () => owl.map(() => randomTriangle()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  )

  useEffect(() => {
    // Let the browser paint the random state first, then transition.
    const t = setTimeout(() => setFormed(true), 350)
    return () => clearTimeout(t)
  }, [seed])

  const replay = () => {
    setFormed(false)
    setSeed((s) => s + 1)
  }

  return (
    <main className="min-h-screen bg-[#a192d7] flex flex-col items-center justify-center p-6 select-none">
      <div className="relative aspect-square w-full max-w-[36rem]">
        {owl.map((tri, i) => {
          const pts = formed ? tri.points : randoms[i]
          const clip = toClip(pts)
          return (
            <div
              key={`${seed}-${i}`}
              className="absolute inset-0"
              style={{
                backgroundColor: tri.color,
                clipPath: clip,
                WebkitClipPath: clip,
                transition:
                  'clip-path 1.6s cubic-bezier(0.65, 0, 0.35, 1), -webkit-clip-path 1.6s cubic-bezier(0.65, 0, 0.35, 1), opacity 800ms ease',
                transitionDelay: formed ? `${i * 35}ms` : '0ms',
                opacity: formed ? 1 : 0.9,
                willChange: 'clip-path',
              }}
            />
          )
        })}
      </div>

      <div className="mt-10 flex items-center gap-3">
        <button
          onClick={replay}
          className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:scale-105 transition-transform"
        >
          Replay
        </button>
        <button
          onClick={() => setFormed((f) => !f)}
          className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-[0.2em] uppercase border border-white/40 hover:scale-105 transition-transform"
        >
          {formed ? 'Scatter' : 'Form'}
        </button>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/60">
        Forest Owl · In Pieces · experiment
      </p>
    </main>
  )
}
