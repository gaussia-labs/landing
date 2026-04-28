import { getAllPapers } from "@/lib/papers"
import { PaperCard } from "@/components/paper-card"
import { Reveal } from "@/components/reveal"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Research Papers — Gaussia",
  description: "Every Gaussia metric traces back to a peer-reviewed publication.",
}

export default function PapersPage() {
  const papers = getAllPapers()

  return (
    <div className="min-h-screen bg-surface">
      <SiteNav />

      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Editorial header */}
          <Reveal>
            <div className="flex items-center gap-2 mb-6">
              <span className="size-1.5 rounded-full bg-terracotta" />
              <span className="text-xs text-ink-muted">research</span>
            </div>
            <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] text-ink tracking-tightest text-balance mb-4">
              Papers grounded in <em>science.</em>
            </h1>
            <p className="text-ink-soft leading-relaxed max-w-xl mb-12">
              Every Gaussia metric traces back to a peer-reviewed publication.
            </p>
          </Reveal>

          <div className="border-t border-hair mb-12" />

          {/* Card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers.map((paper, i) => (
              <Reveal
                key={paper.slug}
                delay={i * 100}
                variant={i % 2 === 0 ? "left" : "right"}
                className="h-full"
              >
                <PaperCard paper={paper} />
              </Reveal>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
