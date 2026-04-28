import { ArrowRight } from "lucide-react"
import { GaussCanvas } from "./gauss-canvas"

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-24 sm:pt-40 pb-16 sm:pb-28 min-h-[88svh] sm:min-h-screen flex items-center"
    >
      {/* Ambient bell-curve background — sits behind the copy across the full hero. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 md:left-100 opacity-55 sm:opacity-100">
        <GaussCanvas className="block w-full h-full" />
        {/* Soft fades so the headline always reads cleanly, no frame around the graphic. */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-surface to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/40 via-transparent to-surface/40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 w-full">
        {/* Small eyebrow */}
        <div className="flex items-center gap-3 mb-4 text-xs text-ink-muted">
          <span className="pulse-soft size-1.5 rounded-full bg-terracotta" />
          <span>Open source · paper-first · community-maintained</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-ink tracking-tightest text-[clamp(3rem,7.2vw,5.75rem)] leading-[1.02] max-w-4xl">
          Metrics grounded in <span className="italic text-terracotta">science</span>,
          <br className="hidden sm:block" />{" "}built by the community.
        </h1>

        {/* Intro */}
        <p className="mt-8 sm:mt-10 max-w-xl text-base sm:text-xl leading-relaxed text-ink-soft text-pretty">
          Open-source metrics that are paper-backed, reproducible, and language-agnostic. Evaluate, protect, and improve
          AI behaviour with open, auditable tools.
        </p>

        {/* Actions */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#get-started"
            className="group inline-flex items-center gap-2 rounded-full bg-terracotta text-surface px-5 py-3 text-sm hover:bg-ink transition-colors"
          >
            Get started
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contribute"
            className="inline-flex items-center gap-2 rounded-full border border-hair-strong bg-surface/70 backdrop-blur-sm px-5 py-3 text-sm text-ink hover:bg-surface-mist transition-colors"
          >
            Propose a new paper
          </a>
        </div>

        {/* Quiet caption strip */}
        <div className="mt-8 sm:mt-28 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-muted border-t border-hair pt-4">
          <div className="flex items-center gap-6">
            <Stat label="License" value="MIT" />
            <span className="h-4 w-px bg-hair" />
            <Stat label="Lock-in" value="Zero" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}
