"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { Github, Menu, X } from "lucide-react"
import { GaussiaLogo } from "./gaussia-logo"
import { cn } from "@/lib/utils"

const BASE_LINKS = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "How it works", href: "#flow" },
  { label: "Modules", href: "#modules" },
  { label: "Contribute", href: "#contribute" },
  { label: "Papers", href: "/papers" },
]

const sectionIds = BASE_LINKS.flatMap((l) =>
  l.href.startsWith("#") ? [l.href.slice(1)] : [],
)

export function SiteNav() {
  const pathname = usePathname()
  const links = BASE_LINKS.map((l) => ({
    ...l,
    href: l.href.startsWith("#") && pathname !== "/" ? `/${l.href}` : l.href,
  }))

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const visibleRef = useRef<Map<string, IntersectionObserverEntry>>(new Map())

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    const pick = () => {
      const entries = Array.from(visibleRef.current.values()).filter(
        (e) => e.isIntersecting,
      )
      if (!entries.length) return
      entries.sort((a, b) => {
        const aRect = a.boundingClientRect
        const bRect = b.boundingClientRect
        return Math.abs(aRect.top) - Math.abs(bRect.top)
      })
      setActiveId(entries[0].target.id)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRef.current.set(entry.target.id, entry)
        }
        pick()
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-surface/85 backdrop-blur-md border-b border-hair"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <GaussiaLogo size={30} />
            <span className="font-sans font-medium text-base tracking-tightest text-ink">
              Gaussia
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {links.map((l) => {
              const isRoute = l.href.startsWith("/")
              const isActive = isRoute
                ? pathname === l.href
                : activeId === l.href.slice(1)
              const cls = cn(
                "text-sm transition-colors",
                isActive ? "text-terracotta" : "text-ink-muted hover:text-ink",
              )
              return isRoute ? (
                <Link key={l.href} href={l.href} className={cls}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} className={cls}>
                  {l.label}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/gaussia-labs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
            >
              <Github className="size-4" />
              GitHub
            </a>
            <a
              href="#get-started"
              className="hidden sm:inline-flex items-center rounded-full bg-terracotta text-surface px-4 py-2 text-sm hover:bg-ink transition-colors"
            >
              Get started
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden relative z-50 p-1.5 -mr-1.5 text-ink"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span className={cn("block transition-all duration-300", mobileOpen ? "opacity-0 scale-75" : "opacity-100 scale-100")}>
                <Menu className="size-5" />
              </span>
              <span className={cn("absolute inset-0 flex items-center justify-center transition-all duration-300", mobileOpen ? "opacity-100 scale-100" : "opacity-0 scale-75")}>
                <X className="size-5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-500",
          mobileOpen ? "visible" : "invisible pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-ink/20 backdrop-blur-sm transition-opacity duration-500",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={closeMobile}
        />

        {/* Panel */}
        <nav
          className={cn(
            "absolute inset-x-0 top-0 bg-surface pt-20 pb-10 px-8 shadow-xl transition-all duration-500 ease-out",
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0",
          )}
        >
          <ul className="space-y-1">
            {links.map((l, i) => {
              const isRoute = l.href.startsWith("/")
              const isActive = isRoute
                ? pathname === l.href
                : activeId === l.href.slice(1)
              const cls = cn(
                "flex items-center gap-4 py-3.5 text-lg transition-colors border-b border-hair",
                isActive ? "text-terracotta" : "text-ink",
              )
              const inner = (
                <>
                  <span className="font-mono text-xs text-ink-muted w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{l.label}</span>
                </>
              )
              return (
                <li key={l.href}>
                  {l.href.startsWith("/") ? (
                    <Link
                      href={l.href}
                      onClick={closeMobile}
                      className={cls}
                      style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      onClick={closeMobile}
                      className={cls}
                      style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
                    >
                      {inner}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="#get-started"
              onClick={closeMobile}
              className="inline-flex items-center justify-center rounded-full bg-terracotta text-surface px-5 py-3 text-sm hover:bg-ink transition-colors"
            >
              Get started
            </a>
            <a
              href="https://github.com/gaussia-labs"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobile}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-hair-strong px-5 py-3 text-sm text-ink hover:bg-surface-sand transition-colors"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
