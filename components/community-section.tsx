"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, BookOpen, MessageSquare, FileText, ArrowRight, GitPullRequest } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const governanceSteps = [
  {
    number: "01",
    title: "Paper Proposal",
    description: "Anyone can open an issue with a reference to a peer-reviewed paper. The discussion starts with the science, not the code.",
  },
  {
    number: "02",
    title: "Methodology Discussion",
    description: "Open debate about the paper's assumptions, limitations, and how the implementation should map to the methodology.",
  },
  {
    number: "03",
    title: "RFC & Implementation",
    description: "Only after consensus on interpretation does the RFC open. Every design decision is documented and traceable.",
  },
]

const resources = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Guides with mathematical foundations and implementation details.",
    href: "https://docs.gaussia.ai",
    cta: "Read the Docs",
  },
  {
    icon: Github,
    title: "GitHub",
    description: "Source code, issues, RFCs, and contribution guidelines.",
    href: "https://github.com/alquimia-ai/gaussia",
    cta: "View Repository",
  },
  {
    icon: MessageSquare,
    title: "Discord",
    description: "Discuss papers, implementations, and evaluation methodology.",
    href: "#",
    cta: "Join Discussion",
  },
  {
    icon: FileText,
    title: "Paper Index",
    description: "All referenced papers with BibTeX entries and summaries.",
    href: "#",
    cta: "Explore Papers",
  },
]

export function CommunitySection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

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

    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = []

    for (let i = 0; i < 30; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.clearRect(0, 0, width, height)

      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        nodes.forEach((other, j) => {
          if (i >= j) return
          const dist = Math.hypot(node.x - other.x, node.y - other.y)
          if (dist < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(171, 65, 45, ${0.1 * (1 - dist / 150)})`
            ctx.lineWidth = 1
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        })

        ctx.beginPath()
        ctx.fillStyle = "rgba(200, 167, 135, 0.3)"
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => window.removeEventListener("resize", resize)
  }, [])

  return (
    <section id="community" className="py-32 bg-background relative overflow-hidden">
      {/* The Three Graces - Botticelli (blurred background) */}
      <div
        className="absolute inset-0 opacity-[0.06] blur-xl scale-105 pointer-events-none"
        style={{
          backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-Qy2H4mMeVe1v0IsoXcZthmVprWYQMz.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-secondary" />
            <Badge variant="outline" className="px-4 py-1">
              Scientific Governance
            </Badge>
            <div className="w-8 h-px bg-secondary" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">Community First</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Gaussia doesn't implement metrics because they sound good.
            Every metric goes through a public review process before a single line of code is written.
            The scientific community validates the science. Then we write the implementation.
          </p>
        </div>

        {/* Governance process */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="text-lg font-semibold text-center mb-10 text-muted-foreground uppercase tracking-wider">
            How Metrics Get Added
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {governanceSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < governanceSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-6 h-px bg-border z-0" />
                )}
                
                <div className="p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 h-full">
                  <span className="text-4xl font-bold text-primary/20 mb-4 block">{step.number}</span>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8 max-w-2xl mx-auto">
            This means Gaussia has an advantage no commercial tool can easily replicate:
            its metrics are publicly audited before they exist. The debate is visible.
            Disagreements are recorded. Implementation is traceable to documented decisions.
          </p>
        </div>

        {/* Resources grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.href}
              target={resource.href.startsWith("http") ? "_blank" : undefined}
              rel={resource.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors ${hoveredCard === index ? 'bg-primary/10' : ''}`} />
              </div>

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                <resource.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {resource.description}
              </p>

              <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                {resource.cta}
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </span>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block relative">
            <div className="absolute -inset-8 border border-border/50 rounded-3xl" />
            <div className="absolute -inset-4 border border-border rounded-2xl" />

            <div className="relative bg-card p-10 rounded-xl border border-border">
              <div className="flex items-center justify-center gap-2 mb-4">
                <GitPullRequest className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Open to all researchers</span>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Have a paper you'd like to see implemented?
              </p>
              <Button size="lg" className="group">
                <Github className="w-5 h-5 mr-2" />
                Propose a Paper on GitHub
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
