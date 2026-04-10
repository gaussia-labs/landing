"use client"

import { Badge } from "@/components/ui/badge"
import { Scale, FlaskConical, Cpu } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const reasons = [
  {
    icon: Scale,
    title: "Regulation is Here",
    description:
      "The EU AI Act is in effect. NIST AI RMF is mandatory for US government procurement. Companies deploying LLMs in healthcare, finance, and education are receiving questions they can't answer with a dashboard: What methodology defines that your system is 'fair'? What paper validates that your hallucination detector works?",
  },
  {
    icon: FlaskConical,
    title: "Reproducibility Crisis",
    description:
      "An ICSE 2025 study found that half of LLM research artifacts with ACM reproducibility badges failed to meet their requirements just one year later. If research can't reproduce itself, how can industry trust the metrics derived from it?",
  },
  {
    icon: Cpu,
    title: "Infrastructure Migration",
    description:
      "Deployment is moving away from Python servers: edge computing, browsers, mobile devices, embedded systems. The evaluation ecosystem didn't migrate with it. There's no Rust evaluation library. No native JavaScript implementation. Gaussia fills that gap.",
  },
]

export function WhyNowSection() {
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
    <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <Badge variant="outline" className="px-4 py-1">Timing</Badge>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Now</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three pressures are converging. Gaussia responds to all of them simultaneously.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border border-border bg-card transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <reason.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <span className="text-foreground font-medium">Traceable scientific rigor.</span>{" "}
              <span className="text-foreground font-medium">Multi-language native.</span>{" "}
              <span className="text-foreground font-medium">Vendor independence.</span>{" "}
              Gaussia addresses these three pressures simultaneously.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
