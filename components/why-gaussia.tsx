import { Reveal } from "./reveal"
import { SectionLabel } from "./manifesto"

const gaps = [
  {
    gap: "Gap 01",
    title: "Fragmented tooling",
    ecosystem:
      "Quality, safety, and ethics live in separate libraries with incompatible conventions.",
    gaussia:
      "A single, extensible library that houses all three concerns under one scientific contract.",
  },
  {
    gap: "Gap 02",
    title: "Absence of scientific traceability",
    ecosystem:
      "Scores are just numbers; the originating paper, methodology, and validation data are rarely exposed.",
    gaussia:
      "Every metric ships with the paper title, authors, year, DOI/arXiv link, and a ready-to-cite BibTeX entry.",
  },
  {
    gap: "Gap 03",
    title: "Lock-in to a single language",
    ecosystem:
      "Metric logic is tied to a specific runtime or stack, making it hard to apply consistently across environments.",
    gaussia:
      "The metric definition lives in the scientific source; implementations follow the same spec across languages.",
  },
  {
    gap: "Gap 04",
    title: "Wrong unit of analysis",
    ecosystem:
      "Evaluation assumes the target is an \u201CAI system\u201D rather than the observable behaviour.",
    gaussia:
      "Gaussia's modules evaluate any behaviour — model output, human response, or hybrid interaction — by the same criteria.",
  },
]

export function WhyGaussia() {
  return (
    <section id="why" className="relative py-20 sm:py-36 px-6 bg-surface">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="02" name="Why Gaussia ?" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 mb-10 sm:mb-16">
          <Reveal className="lg:col-span-7">
            <h2 className="font-serif tracking-tightest text-ink text-balance text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05]">
              The four gaps <em>we close</em>.
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:pt-3" delay={100}>
            <p className="text-ink-soft leading-relaxed">
              The current evaluation ecosystem has four problems no single
              tool solves on its own, and all four point back to the same
              two pillars: paper-first and community-first.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="relative md:grid md:grid-cols-4 md:gap-0">
            {gaps.map((g, i) => {
              let roundedMd = ""
              if (i === 0) roundedMd = "md:rounded-l-3xl"
              else if (i === gaps.length - 1) roundedMd = "md:rounded-r-3xl"
              return (
                <article
                  key={g.gap}
                  className={`sticky md:static group flex flex-col justify-between min-h-[340px] p-8 sm:p-10 rounded-3xl md:rounded-none shadow-md md:shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 md:border-r md:last:border-r-0 border-hair ${roundedMd} ${i > 0 ? "mt-5 md:mt-0" : ""}`}
                  style={{
                    background: `var(--surface-strip-${i + 1})`,
                    top: `${64 + i * 20}px`,
                    zIndex: i,
                  }}
                >
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-label text-ink-muted mb-5 block">
                      {g.gap}
                    </span>
                    <h3 className="font-serif text-2xl leading-snug text-ink mb-4 md:min-h-14">
                      {g.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-label text-ink-muted/60 mb-1.5 block">
                      Today
                    </span>
                    <p className="text-ink-soft/70 text-sm leading-relaxed">
                      {g.ecosystem}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-ink-muted/15 pt-4">
                    <span className="text-[10px] uppercase tracking-label text-terracotta mb-1.5 block">
                      Gaussia
                    </span>
                    <p className="text-terracotta/80 text-sm leading-relaxed font-medium">
                      {g.gaussia}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
