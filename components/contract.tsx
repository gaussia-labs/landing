import { Reveal } from "./reveal"
import { SectionLabel } from "./manifesto"

const steps = [
  {
    n: "01",
    title: "Paper proposal",
    body: "Anyone opens a Discussion in the Proposals category, cites the peer-reviewed work, and explains the problem the metric solves.",
    tags: ["Discussion", "DOI / arXiv", "Motivation"],
  },
  {
    n: "02",
    title: "Community debate",
    body: "Reviewers examine the proposal publicly — the debate is visible, dissent is recorded, decisions are traceable.",
    tags: ["Novelty", "Soundness", "Clarity", "Feasibility"],
  },
  {
    n: "03",
    title: "Implementation",
    body: "Any language can implement from the paper. The code must include a metadata block mapping the implementation to the methodology.",
    tags: ["Python", "TypeScript", "Rust", "Go", "C++"],
  },
  {
    n: "04",
    title: "Merge & credit",
    body: "After two reviewer approvals the PR is merged. The paper joins the official framework and authors are credited in the code and citation list.",
    tags: ["PR merged", "Authors credited", "Immutable link"],
  },
]

export function Contract() {
  return (
    <section
      id="contract"
      className="relative py-28 sm:py-36 px-6 bg-surface-clay"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="03" name="The Gaussia Contract" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 mb-16">
          <Reveal className="lg:col-span-7">
            <h2 className="font-serif tracking-tightest text-ink text-balance text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05]">
              Paper-first. <em>Community-first.</em>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:pt-3" delay={100}>
            <p className="text-ink-soft leading-relaxed">
              Every metric in Gaussia is provably linked to a peer-reviewed
              source, and the link is immutable and visible to every user.
            </p>
          </Reveal>
        </div>

        <ol className="relative flex flex-col gap-14 pl-10 md:pl-14">
          <div
            aria-hidden
            className="absolute left-[5px] top-0 bottom-0 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, var(--hair-strong) 12%, var(--hair-strong) 88%, transparent)`,
            }}
          />

          {steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.n}
              delay={i * 120}
              variant="left"
              className="relative"
            >
              <span
                aria-hidden
                className="absolute -left-10 md:-left-14 top-1/2 -translate-y-1/2 -translate-x-[1.5px] size-3 rounded-full bg-terracotta shadow-[0_0_8px_2px_var(--terracotta-soft),0_0_20px_4px_var(--terracotta-pale)]"
              />
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-10">
                <div className="md:w-56 shrink-0">
                  <div className="text-xs text-ink-muted uppercase tracking-label">
                    Step {s.n}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ink mt-2">
                    {s.title}
                  </h3>
                </div>
                <div className="mt-4 md:mt-0 flex-1">
                  <p className="text-ink-soft leading-relaxed max-w-2xl">
                    {s.body}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full bg-surface/60 px-3 py-1 text-xs text-ink-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* <Reveal className="mt-12" variant="blur">
          <div className="max-w-3xl">
            <p className="font-serif italic text-2xl sm:text-3xl text-ink leading-snug text-balance">
              The result: every metric in Gaussia is provably linked to a
              peer-reviewed source, and the link is immutable and visible to
              every user.
            </p>
          </div>
        </Reveal> */}
      </div>
    </section>
  )
}
