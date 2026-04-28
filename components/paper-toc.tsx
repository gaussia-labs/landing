"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { PaperSection } from "@/lib/papers"
import { cn } from "@/lib/utils"
import { slugifyHeading } from "@/lib/slugify-heading"

type Props = {
  sections: PaperSection[]
}

export function PaperToc({ sections }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const h2s = sections.filter((s) => s.level === 1)

  useEffect(() => {
    const headings = h2s.map((s) => {
      const id = slugifyHeading(s.heading)
      return document.getElementById(id)
    }).filter(Boolean) as HTMLElement[]

    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    )

    for (const el of headings) observer.observe(el)
    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <nav className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-28 space-y-1">
        <Link
          href="/papers"
          className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors mb-4"
        >
          <span>←</span>
          <span>Back to papers</span>
        </Link>

        <p className="text-xs text-ink-muted uppercase tracking-wider mb-3">Contents</p>

        {h2s.map((s) => {
          const id = slugifyHeading(s.heading)
          const isActive = activeId === id
          return (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "block text-xs py-1 transition-colors leading-snug",
                isActive
                  ? "text-terracotta font-medium"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {s.heading}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export { slugifyHeading } from "@/lib/slugify-heading"
