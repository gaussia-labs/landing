"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Shield,
  Zap,
  Lightbulb,
  ExternalLink,
  FileText,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

const modules = [
  {
    icon: Sparkles,
    name: "Quality & RAG",
    color: "#ab412d",
    description: "Evaluation of response quality, retrieval accuracy, and generation fidelity.",
    metrics: [
      { name: "Faithfulness", paper: "Es et al., EACL 2024", arxiv: "2309.15217" },
      { name: "Context Relevance", paper: "Es et al., EACL 2024", arxiv: "2309.15217" },
      { name: "Answer Relevancy", paper: "Es et al., EACL 2024", arxiv: "2309.15217" },
      { name: "Hallucination Detection", paper: "Min et al., 2023", arxiv: "2305.14251" },
      { name: "Semantic Coherence", paper: "Dziri et al., 2022", arxiv: "2109.06379" },
      { name: "Factual Consistency", paper: "Laban et al., TACL 2022", arxiv: "2104.04302" },
    ],
    environments: ["Python", "Rust (lightweight)"],
  },
  {
    icon: Shield,
    name: "Red Teaming",
    color: "#85624f",
    description: "Systematic adversarial testing covering OWASP LLM Top 10 and beyond.",
    metrics: [
      { name: "Prompt Injection", paper: "Perez & Ribeiro, 2022", arxiv: "2211.09527" },
      { name: "Jailbreak Detection", paper: "Wei et al., 2023", arxiv: "2307.02483" },
      { name: "Role Breaking", paper: "Shanahan et al., 2023", arxiv: "2302.07459" },
      { name: "RAG Poisoning", paper: "Zou et al., 2024", arxiv: "2402.14867" },
      { name: "Agent Manipulation", paper: "Ruan et al., 2024", arxiv: "2401.13138" },
    ],
    environments: ["Python", "JavaScript"],
  },
  {
    icon: Zap,
    name: "Guardrails",
    color: "#c8a787",
    description: "Real-time input/output validation for production deployment.",
    metrics: [
      { name: "PII Detection", paper: "Lison et al., 2021", arxiv: "2101.00059" },
      { name: "Toxicity Analysis", paper: "Gehman et al., 2020", arxiv: "2009.11462" },
      { name: "Bias Detection", paper: "Liang et al., 2021", arxiv: "2106.13219" },
      { name: "Content Policy", paper: "Markov et al., 2023", arxiv: "2303.04048" },
    ],
    environments: ["JavaScript/TypeScript", "Rust"],
  },
  {
    icon: Lightbulb,
    name: "Helping",
    color: "#231e20",
    description: "Tools for building better prompts and reducing hallucinations by design.",
    metrics: [
      { name: "Instruction Ambiguity", paper: "Zhou et al., 2023", arxiv: "2302.11382" },
      { name: "Prompt Sensitivity", paper: "Lu et al., 2022", arxiv: "2104.08315" },
      { name: "Format Effects", paper: "Sclar et al., 2023", arxiv: "2310.11324" },
      { name: "Domain Templates", paper: "Reynolds & McDonell, 2021", arxiv: "2102.07350" },
    ],
    environments: ["Python"],
  },
]

export function MetricsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [expandedModule, setExpandedModule] = useState<number | null>(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="metrics" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-secondary" />
            <Badge variant="outline" className="px-4 py-1">
              Four Modules
            </Badge>
            <div className="w-8 h-px bg-secondary" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Architecture</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance mb-4">
            Gaussia is organized into four modules, each with well-defined responsibilities
            and environment-specific implementations.
          </p>
        </div>

        {/* Module cards */}
        <div className="max-w-5xl mx-auto space-y-4">
          {modules.map((module, index) => (
            <div
              key={index}
              className={`border border-border rounded-2xl overflow-hidden transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Module header */}
              <button
                onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                className="w-full p-6 flex items-center gap-4 bg-card hover:bg-card/80 transition-colors text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${module.color}15` }}
                >
                  <module.icon className="w-6 h-6" style={{ color: module.color }} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{module.name}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  {module.environments.map((env) => (
                    <Badge key={env} variant="secondary" className="text-xs">
                      {env}
                    </Badge>
                  ))}
                </div>

                <div
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform duration-300"
                  style={{ transform: expandedModule === index ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              {/* Expanded metrics */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedModule === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-6 pt-0 border-t border-border bg-background">
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {module.metrics.map((metric, mIndex) => (
                      <a
                        key={mIndex}
                        href={`https://arxiv.org/abs/${metric.arxiv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-4 rounded-lg border border-border hover:border-primary/30 bg-card/50 hover:bg-card transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-medium text-sm">{metric.name}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="w-3 h-3" />
                          <span>{metric.paper}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="group">
            <FileText className="w-4 h-4 mr-2" />
            Browse Paper Index
            <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </div>
    </section>
  )
}
