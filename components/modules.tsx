"use client"

import { useRef, useState, useEffect } from "react"
import { Reveal } from "./reveal"
import { SectionLabel } from "./manifesto"

const modules = [
  {
    key: "Evaluate",
    question: "How good is the output?",
    metrics: [
      { name: "Context & Faithfulness in RAG", cite: "Es et al., EACL 2024", url: "https://arxiv.org/abs/2309.15217" },
      { name: "Conversational quality (Grice's maxims)", cite: "Grice, 1975" },
      { name: "Agentic pass@K", cite: "Ruan et al., 2024", url: "https://arxiv.org/abs/2401.13138" },
    ],
  },
  {
    key: "Protect",
    question: "Is it safe and fair?",
    metrics: [
      { name: "Toxicity via DIDT", cite: "Gehman et al., 2020", url: "https://arxiv.org/abs/2009.11462" },
      { name: "Bias · Granite Guardian & LLaMA Guard", cite: "Liang et al., 2021", url: "https://arxiv.org/abs/2106.13219" },
      { name: "Regulatory compliance via NLI", cite: "Markov et al., 2023", url: "https://arxiv.org/abs/2303.04048" },
    ],
  },
  {
    key: "Improve",
    question: "How can I make it better?",
    metrics: [
      { name: "Prompt optimisation · GEPA, MIPROv2", cite: "Zhou et al., 2023", url: "https://arxiv.org/abs/2302.11382" },
      { name: "Explainability", cite: "Integrated Gradients · SHAP · LIME" },
      { name: "Synthetic data generation", cite: "Reynolds & McDonell, 2021", url: "https://arxiv.org/abs/2102.07350" },
    ],
  },
]

export function Modules() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const scrollLeft = el.scrollLeft
      const card = el.firstElementChild
      if (!card) return
      const cardWidth = card.getBoundingClientRect().width + 16
      setActiveIdx(Math.round(scrollLeft / cardWidth))
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      id="modules"
      className="relative bg-surface-mist py-20 sm:py-36 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionLabel index="05" name="Modules at a glance" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 mb-10 sm:mb-16">
          <Reveal className="lg:col-span-7">
            <h2 className="font-serif tracking-tightest text-ink text-balance text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05]">
              Three modules. <em>One scientific contract.</em>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:pt-3" delay={100}>
            <p className="text-ink-soft leading-relaxed">
              Every metric page lists the paper reference, the validation
              dataset, and a one-line SDK call. Pick your module, the
              lineage ships with every score.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden md:block mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-3 gap-px bg-hair rounded-2xl overflow-hidden">
          {modules.map((m, i) => (
            <Reveal as="article" key={m.key} delay={i * 140} variant="scale">
              <div className="lift h-full bg-surface-lowest p-8 sm:p-10">
                <div className="flex items-baseline justify-between mb-10">
                  <span className="font-serif text-5xl text-terracotta leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-ink-muted uppercase tracking-label">
                    Module
                  </span>
                </div>

                <h3 className="font-serif text-3xl text-ink">{m.key}</h3>
                <p className="mt-2 text-lg text-ink-muted">
                  {m.question}
                </p>

                <ul className="mt-10 pt-8 border-t border-hair space-y-6">
                  {m.metrics.map((mm) => (
                    <li key={mm.name}>
                      <div className="text-ink leading-snug">
                        {mm.name}
                      </div>
                      {mm.url ? (
                        <a
                          href={mm.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-terracotta transition-colors"
                        >
                          {mm.cite}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                        </a>
                      ) : (
                        <div className="mt-1 text-xs text-ink-muted">
                          {mm.cite}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Mobile: horizontal snap slider */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 no-scrollbar"
          style={{ scrollPaddingInlineStart: "1.5rem" }}
        >
          {modules.map((m, i) => (
            <article
              key={m.key}
              className="snap-start shrink-0 w-[82vw]"
              style={{
                marginLeft: i === 0 ? "1.5rem" : undefined,
                marginRight: i === modules.length - 1 ? "1.5rem" : undefined,
              }}
            >
              <div className="h-full bg-surface-lowest rounded-2xl p-7 shadow-sm border border-hair">
                <div className="flex items-baseline justify-between mb-8">
                  <span className="font-serif text-4xl text-terracotta leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-ink-muted uppercase tracking-label">
                    Module
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-ink">{m.key}</h3>
                <p className="mt-1.5 text-base text-ink-muted">
                  {m.question}
                </p>

                <ul className="mt-8 pt-6 border-t border-hair space-y-5">
                  {m.metrics.map((mm) => (
                    <li key={mm.name}>
                      <div className="text-sm text-ink leading-snug">
                        {mm.name}
                      </div>
                      {mm.url ? (
                        <a
                          href={mm.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-terracotta transition-colors"
                        >
                          {mm.cite}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                        </a>
                      ) : (
                        <div className="mt-1 text-xs text-ink-muted">
                          {mm.cite}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-2">
          {modules.map((_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full transition-colors duration-300 ${
                i === activeIdx ? "bg-terracotta" : "bg-hair-strong"
              }`}
            />
          ))}
        </div>
      </div>
      {/* CTA below modules */}
      <div className="mx-auto max-w-6xl px-6 mt-12 flex justify-center">
        <Reveal>
          <a
            href="/papers"
            className="inline-flex items-center rounded-full border border-hair-strong bg-surface/70 text-ink px-6 py-2.5 text-sm hover:bg-surface-sand transition-colors"
          >
            Read the papers →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
