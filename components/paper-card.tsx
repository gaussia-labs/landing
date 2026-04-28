import Link from "next/link"
import type { PaperMeta } from "@/lib/papers"

export function PaperCard({ paper }: { paper: PaperMeta }) {
  const excerpt = paper.abstract
    ? paper.abstract.split(/[.!?]/).slice(0, 2).join(". ") + "."
    : null

  return (
    <Link
      href={`/papers/${paper.slug}`}
      className="lift group block h-full bg-surface-lowest rounded-2xl border border-hair p-8 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        {paper.date && <span className="text-ink-muted text-xs">{paper.date}</span>}
      </div>

      <div className="flex-1">
        <h2 className="font-serif text-xl text-ink leading-snug mb-2">
          {paper.title}
        </h2>
        <p className="text-ink-muted text-sm">
          {paper.authors.map((a) => a.name).join(", ")}
        </p>
      </div>

      {excerpt && (
        <p className="text-ink-soft text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      )}

      <span className="text-terracotta text-sm group-hover:underline">
        Read paper →
      </span>
    </Link>
  )
}
