"use client"

import { Badge } from "@/components/ui/badge"
import { FileText, FlaskConical, Quote, BookOpen, Database, Globe } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const principles = [
  {
    icon: FileText,
    title: "Paper First",
    description:
      "No metric exists without its paper. Title, authors, year, venue, arXiv/DOI, implementation notes, validation datasets, and BibTeX entry. All included.",
  },
  {
    icon: FlaskConical,
    title: "Reproducible",
    description:
      "Every implementation follows the exact methodology described in the paper. Run the same validation the authors did. Trust the numbers because they come from rigorous science.",
  },
  {
    icon: Quote,
    title: "Citeable",
    description:
      "When you use Gaussia in production or research, you can cite the underlying papers. Your evaluations become part of the scientific record, not just a number in a dashboard.",
  },
]

const moats = [
  {
    icon: Globe,
    title: "Multi-Environment Native",
    description: "Rust for low-level performance and WebAssembly. Python for deep analysis. JavaScript/TypeScript for edge and browser. Not wrappers. Native implementations.",
  },
  {
    icon: Database,
    title: "Multimodal by Design",
    description: "Text, audio, image, video. Intelligence doesn't communicate only with text. Neither should evaluation. Same scientific rigor across all modalities.",
  },
  {
    icon: BookOpen,
    title: "Infrastructure, Not Platform",
    description: "MIT license. No telemetry. No lock-in. Build your own dashboards, auditing services, or compliance tools on top. Gaussia is the foundation, not the product.",
  },
]

export function MotivationSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="features" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <Badge variant="outline" className="px-4 py-1">Paper First</Badge>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              The Contract
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Every metric in Gaussia comes with explicit scientific backing.
              When you use a metric, you know exactly what paper defined it,
              how it was validated, and how to cite it in your own work.
            </p>
          </div>

          {/* Core Principles */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {principles.map((principle, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <principle.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{principle.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>

          {/* MOATs */}
          <div className="mb-20">
            <h3 className="text-lg font-semibold text-center mb-10 text-muted-foreground uppercase tracking-wider">
              Why Gaussia is Different
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {moats.map((moat, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border border-border bg-card/50 transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${(index + 3) * 150}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center mb-4">
                    <moat.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">{moat.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{moat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="relative">
            <div className="absolute -top-6 left-8 text-8xl text-primary/10 font-serif select-none">"</div>
            <blockquote className="p-10 rounded-2xl bg-primary/5 border border-primary/10 relative">
              <p className="text-xl md:text-2xl italic text-foreground mb-6 leading-relaxed pl-8">
                Evaluating AI systems with metrics that no one can trace, cite, or reproduce
                is exactly the kind of magical thinking those systems taught us to avoid.
              </p>
              <footer className="flex items-center gap-4 pl-8">
                <div className="w-12 h-px bg-primary/30" />
                <cite className="text-muted-foreground not-italic font-medium">
                  Gaussia Whitepaper
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
