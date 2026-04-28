import { notFound } from "next/navigation"
import { getAllPapers, getPaper } from "@/lib/papers"
import { PaperArticle } from "@/components/paper-article"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export async function generateStaticParams() {
  return getAllPapers().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const paper = getPaper(slug)
  if (!paper) return {}
  return {
    title: `${paper.title} — Gaussia`,
    description: paper.abstract.slice(0, 160),
  }
}

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const paper = getPaper(slug)
  if (!paper) notFound()

  return (
    <div className="min-h-screen bg-surface">
      <SiteNav />
      <PaperArticle paper={paper!} />
      <SiteFooter />
    </div>
  )
}
