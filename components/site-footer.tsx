import { Github, MessageCircle, BookText } from "lucide-react"
import { GaussiaLogo } from "./gaussia-logo"
import { AlquimiaLogo } from "./alquimia-logo"

const cols: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Docs", href: "https://docs.gaussia.ai/" },
      { label: "Modules", href: "#modules" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/gaussia-labs" },
      { label: "Contribute", href: "https://docs.gaussia.ai/development" },
      { label: "Proposals", href: "https://github.com/gaussia-labs/papers/discussions" },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "Manifesto", href: "#manifesto" },
      { label: "The Contract", href: "#contract" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="relative bg-surface-sand text-ink">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <GaussiaLogo size={22} />
              <span className="font-sans font-medium text-lg tracking-tightest">
                Gaussia
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href="https://github.com/gaussia-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-hair-strong px-4 py-2 text-sm hover:bg-surface transition-colors"
              >
                <Github className="size-4" />
                GitHub
              </a>
              <a
                href="https://docs.gaussia.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-hair-strong px-4 py-2 text-sm hover:bg-surface transition-colors"
              >
                <BookText className="size-4" />
                Docs
              </a>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.heading} className="lg:col-span-2">
              <div className="text-xs uppercase tracking-label text-ink-muted mb-5">
                {c.heading}
              </div>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-ink-soft hover:text-terracotta transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-hair flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">Crafted by <a href="https://alquimia.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-terracotta transition-colors"><AlquimiaLogo className="h-5.5 w-auto" /></a></span>
          <span>
            © {new Date().getFullYear()} Gaussia · community-maintained, open source
          </span>
        </div>
      </div>
    </footer>
  )
}
