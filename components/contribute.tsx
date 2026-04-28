import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"
import { SectionLabel } from "./manifesto"

const steps = [
  {
    title: "Propose your idea",
    body: "Open a Discussion in Proposals. Include the paper citation, problem statement, and target SDKs.",
  },
  {
    title: "Write the paper",
    body: "Fork the repo, copy template/ to papers/YYYY-MM-your-title/, write in LaTeX, add figures and references.bib.",
  },
  {
    title: "Open a PR",
    body: "Target main, fill the PR template, link the original discussion, and ensure the paper compiles.",
  },
  {
    title: "Community review",
    body: "At least two reviewers approve on novelty, soundness, clarity, and feasibility.",
  },
  {
    title: "Merge & implement",
    body: "An implementation issue opens in the relevant SDK repo; authors are credited in code and citation list.",
  },
]

export function Contribute() {
  return (
    <section
      id="contribute"
      className="relative py-28 sm:py-36 px-6 bg-ink text-surface"
    >
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-4 text-xs text-surface/60">
            <span className="font-mono tracking-label">07</span>
            <span className="h-px w-6 bg-surface/20" />
            <span className="uppercase tracking-label">Contribute</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 mb-16">
          <Reveal className="lg:col-span-7">
            <h2 className="font-serif tracking-tightest text-surface text-balance text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05]">
              A quick guide to <em className="text-terracotta-soft">shaping the library.</em>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:pt-3" delay={100}>
            <p className="text-surface/70 leading-relaxed">
              All contributions stay under the MIT licence. Reviewers
              receive permanent citation credit. The debate is public, and the
              record is immutable.
            </p>
          </Reveal>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0.5 bg-surface/10 rounded-2xl overflow-hidden">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 100} variant="rise">
              <div className="h-full bg-ink p-7">
                <span className="font-serif text-3xl text-terracotta-soft leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-serif text-xl text-surface">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-surface/70 leading-relaxed">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-14 flex flex-wrap items-center gap-3">
          <a
            href="https://docs.gaussia.ai/development"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-surface text-ink px-5 py-3 text-sm hover:bg-terracotta hover:text-surface transition-colors"
          >
            Read the full contribution guide
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="https://github.com/gaussia-labs/papers/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-surface/20 px-5 py-3 text-sm text-surface hover:bg-surface/10 transition-colors"
          >
            Start a proposal
          </a>
        </Reveal>
      </div>
    </section>
  )
}
