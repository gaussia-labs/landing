"use client"

import { Github, Twitter, FileText, Mail, ArrowUpRight } from "lucide-react"
import { useEffect, useRef } from "react"

const links = {
  library: [
    { label: "Documentation", href: "https://docs.gaussia.ai" },
    { label: "API Reference", href: "https://docs.gaussia.ai/api" },
    { label: "Examples", href: "https://docs.gaussia.ai/examples" },
    { label: "Changelog", href: "https://docs.gaussia.ai/changelog" },
  ],
  research: [
    { label: "Paper Index", href: "#" },
    { label: "BibTeX Citations", href: "#" },
    { label: "Methodology", href: "#" },
    { label: "Benchmarks", href: "#" },
  ],
  community: [
    { label: "GitHub", href: "https://github.com/alquimia-ai/gaussia" },
    { label: "RFCs", href: "#" },
    { label: "Discord", href: "#" },
    { label: "Contributing", href: "#" },
  ],
}

export function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener("resize", resize)

    let time = 0

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(245, 240, 232, ${0.03 - i * 0.01})`
        ctx.lineWidth = 1

        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.3 +
            Math.sin(x * 0.005 + time * 0.001 + i) * 30 +
            i * 40
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      time++
      requestAnimationFrame(animate)
    }

    animate()

    return () => window.removeEventListener("resize", resize)
  }, [])

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-background/20 to-transparent" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <svg className="w-32 h-16" viewBox="0 0 140 70" fill="none">
                <path
                  d="M20 50 C40 50, 50 20, 70 20 C90 20, 100 50, 120 50"
                  stroke="#ab412d"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <line
                  x1="70"
                  y1="15"
                  x2="70"
                  y2="55"
                  stroke="#c8a787"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>

            <h3 className="text-3xl font-bold mb-3 tracking-tighter">
              Gaussia
            </h3>
            <p className="text-background/60 mb-4 max-w-sm leading-relaxed">
              Scientifically grounded metrics for evaluating AI assistants.
              Every implementation backed by peer-reviewed research.
            </p>
            <p className="text-background/40 text-sm mb-8 max-w-sm">
              Because AI evaluation should be as rigorous as the models themselves.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Github, href: "https://github.com/alquimia-ai/gaussia", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: FileText, href: "#", label: "Papers" },
                { icon: Mail, href: "mailto:hello@alquimia.ai", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center text-background/60 hover:bg-background/20 hover:text-background transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Library", items: links.library },
            { title: "Research", items: links.research },
            { title: "Community", items: links.community },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-5 text-background/80 uppercase text-xs tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center text-background/60 hover:text-background transition-colors text-sm"
                    >
                      {link.label}
                      {link.href.startsWith("http") && (
                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="py-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-background/40">Born at</span>
              <a
                href="https://alquimia.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-background/80 hover:text-background transition-colors"
              >
                Alquimia AI Labs
              </a>
            </div>

            <p className="text-sm text-background/40">
              Open Source under MIT License
            </p>

            <div className="flex gap-6 text-sm text-background/40">
              <a
                href="https://github.com/alquimia-ai/gaussia/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-background/80 transition-colors"
              >
                MIT License
              </a>
              <a
                href="https://github.com/alquimia-ai/gaussia"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-background/80 transition-colors"
              >
                Contribute
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
