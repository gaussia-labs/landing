import Link from "next/link"
import type { Paper } from "@/lib/papers"
import { PaperToc } from "@/components/paper-toc"
import { slugifyHeading } from "@/lib/slugify-heading"
import { LatexContent } from "@/components/latex-renderer"

export function PaperArticle({ paper }: { paper: Paper }) {
  return (
    <article className="mx-auto max-w-6xl px-6 pt-24 pb-24">
      <Link
        href="/papers"
        className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors mb-10"
      >
        <span>←</span>
        <span>All papers</span>
      </Link>

      {/* Article header */}
      <header className="mb-12 max-w-3xl">
        <div className="flex items-center gap-2 mb-5">
          <span className="size-1.5 rounded-full bg-terracotta" />
          <span className="text-xs text-ink-muted">research paper</span>
        </div>

        <h1 className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] text-ink tracking-tightest mb-6 text-balance">
          {paper.title}
        </h1>

        {/* Authors */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-4">
          {paper.authors.map((author) => (
            <div key={author.name}>
              <p className="text-sm text-ink font-medium">{author.name}</p>
              {author.email && (
                <p className="text-xs text-ink-muted">{author.email}</p>
              )}
              {author.affiliation && (
                <p className="text-xs text-ink-muted">{author.affiliation}</p>
              )}
            </div>
          ))}
        </div>

        {paper.date && <p className="text-xs text-ink-muted mb-4">{paper.date}</p>}

        {/* Keywords */}
        {paper.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {paper.keywords.map((kw) => (
              <span
                key={kw}
                className="bg-surface-sand rounded-full px-2.5 py-0.5 text-xs text-ink-muted"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Abstract callout */}
        {paper.abstract && (
          <div className="bg-surface-sand rounded-2xl p-6">
            <p className="text-xs text-ink-muted uppercase tracking-wider mb-3">Abstract</p>
            <p className="text-ink-soft leading-relaxed">{paper.abstract}</p>
          </div>
        )}
      </header>

      <div className="border-t border-hair mb-12" />

      {/* Two-column layout */}
      <div className="flex gap-16">
        <PaperToc sections={paper.sections} />

        {/* Article body */}
        <div className="flex-1 min-w-0 max-w-2xl">
          {paper.sections.map((section) => {
            const id = slugifyHeading(section.heading)
            const Tag = section.level === 1 ? "h2" : "h3"
            return (
              <div key={id}>
                {section.level === 1 && (
                  <div className="mt-12 mb-4" />
                )}
                <Tag
                  id={id}
                  className={
                    section.level === 1
                      ? "font-serif text-2xl text-ink mt-2 mb-4 scroll-mt-28"
                      : "font-sans font-medium text-lg text-ink mt-8 mb-3 scroll-mt-28"
                  }
                >
                  {section.heading}
                </Tag>
                <LatexContent
                  latex={section.content}
                  references={paper.references}
                  slug={paper.slug}
                />
              </div>
            )
          })}

          {/* Bibliography */}
          {paper.references.length > 0 && (
            <div className="mt-16 pt-8 border-t border-hair">
              <h2 className="font-serif text-2xl text-ink mb-6">References</h2>
              <ol className="space-y-3">
                {paper.references.map((ref, i) => (
                  <li key={ref.key} className="flex gap-3 text-sm text-ink-muted">
                    <span className="shrink-0 font-medium text-ink-muted">[{i + 1}]</span>
                    <span>
                      {ref.url ? (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-terracotta transition-colors font-mono text-xs"
                        >
                          {ref.text}
                        </a>
                      ) : (
                        ref.text
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
