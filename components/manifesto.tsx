import { Reveal } from "./reveal"

const points = [
  {
    title: "Scientific grounding",
    body: "The metric's definition, assumptions, and validation basis are directly connected to published research.",
  },
  {
    title: "Reproducibility",
    body: "Every score can be independently verified, reproduced, and confidently cited in your own work.",
  },
  {
    title: "Decision confidence",
    body: "See the methodological strength behind every number instead of trusting a polished dashboard.",
  },
]

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative bg-surface-sand py-20 sm:py-36 px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="01" name="Manifesto" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 mt-10">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="font-serif tracking-tightest text-ink text-balance text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05]">
                From metrics to <em>evidence-backed</em> evaluation.
              </h2>
            </Reveal>

            <Reveal delay={120} variant="blur">
              <figure className="mt-8 sm:mt-12 max-w-xl">
                <blockquote className="font-serif text-2xl sm:text-3xl text-ink leading-snug text-pretty">
                  &ldquo;An evaluation metric is only as useful as the evidence
                  behind it.&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-ink-muted">
                  — Gaussia manifesto
                </figcaption>
              </figure>
            </Reveal>

            {/* On mobile, show the three principles between quote and body text to break up the reading flow */}
            <div className="lg:hidden mt-10">
              <ul className="divide-y divide-hair">
                {points.map((p, i) => (
                  <Reveal as="li" key={`mobile-${p.title}`} delay={i * 140} variant="right">
                    <div className="py-6 flex items-start gap-5">
                      <span className="font-serif text-xl text-terracotta leading-none pt-1 w-7 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-serif text-xl text-ink">
                          {p.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">
                          {p.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>

            <Reveal delay={200}>
              <p className="mt-8 sm:mt-12 max-w-xl text-ink-soft leading-relaxed">
                Many AI teams work with dashboards full of scores (faithfulness 0.87, toxicity 0.03, bias 0.12) without enough
                context to understand what those numbers truly represent or
                how much confidence they deserve.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <p className="mt-5 max-w-xl text-ink-soft leading-relaxed">
                Gaussia was built to close that gap. By requiring every metric
                to be grounded in verifiable scientific evidence, it turns
                evaluation outputs into claims that are clearer, more
                reproducible, and more trustworthy.
              </p>
            </Reveal>
          </div>

          {/* Desktop sidebar — hidden on mobile since we show it inline above */}
          <div className="hidden lg:block lg:col-span-5 lg:pt-2">
            <ul className="divide-y divide-hair">
              {points.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 140} variant="right">
                  <div className="py-7 flex items-start gap-6">
                    <span className="font-serif text-2xl text-terracotta leading-none pt-1 w-8 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl text-ink">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-ink-soft leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SectionLabel({ index, name }: { index: string; name: string }) {
  return (
    <div className="flex items-center gap-4 text-xs text-ink-muted">
      <span className="font-mono tracking-label">{index}</span>
      <span className="h-px w-6 bg-hair-strong" />
      <span className="uppercase tracking-label">{name}</span>
    </div>
  )
}
