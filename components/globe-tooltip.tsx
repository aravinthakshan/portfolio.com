interface GlobeTooltipProps {
  from: { country: string; city?: string }
  to: { country: string; city?: string }
}

export function GlobeTooltip({ from, to }: GlobeTooltipProps) {
  return (
    <div className="animate-fade-in-out px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-[0.2em] font-semibold whitespace-nowrap -translate-y-6">
      {(from.city ?? from.country)} → {(to.city ?? to.country)}
    </div>
  )
}
