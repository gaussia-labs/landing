"use client"

import { Badge } from "@/components/ui/badge"
import { Check, Clock, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const phases = [
  {
    status: "current",
    title: "Foundation",
    items: [
      { text: "Core Python library with Quality & RAG metrics", done: true },
      { text: "RAGAS paper implementations (faithfulness, relevance)", done: true },
      { text: "Basic red teaming: prompt injection, jailbreak detection", done: true },
      { text: "Paper index with BibTeX citations", done: false },
      { text: "RFC process for new metric proposals", done: false },
    ],
  },
  {
    status: "next",
    title: "Multi-Environment",
    items: [
      { text: "JavaScript/TypeScript SDK for edge deployment", done: false },
      { text: "Rust core for WebAssembly and high-performance use cases", done: false },
      { text: "Guardrails module: PII detection, toxicity, content policy", done: false },
      { text: "Helping module: prompt analysis and templates", done: false },
      { text: "Multimodal support: audio transcription evaluation", done: false },
    ],
  },
  {
    status: "future",
    title: "The Auditor Model",
    items: [
      { text: "Training dataset: fully public, auditable line by line", done: false },
      { text: "Model architecture and hyperparameters: transparent", done: false },
      { text: "Validation against original paper benchmarks", done: false },
      { text: "Sectoral finetuning: medical, legal, technical", done: false },
      { text: "Community governance for model updates", done: false },
    ],
  },
]

const statusConfig = {
  current: { label: "In Progress", color: "#ab412d", icon: Clock },
  next: { label: "Next", color: "#85624f", icon: Sparkles },
  future: { label: "Vision", color: "#c8a787", icon: Sparkles },
}

export function RoadmapSection() {
  const sectionRef = useRef<HTMLElement>(null)
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
    <section ref={sectionRef} id="roadmap" className="py-32 bg-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-secondary" />
            <Badge variant="outline" className="px-4 py-1">
              Roadmap
            </Badge>
            <div className="w-8 h-px bg-secondary" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">Where We're Going</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Gaussia's long-term vision is an auditor model: trained from scratch,
            with a fully public dataset and transparent methodology.
            The model's education will be as auditable as the metrics it implements.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {phases.map((phase, index) => {
              const config = statusConfig[phase.status as keyof typeof statusConfig]
              const StatusIcon = config.icon
              
              return (
                <div
                  key={index}
                  className={`relative transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Connection line */}
                  {index < phases.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-8 h-px bg-border -translate-x-4 z-0" />
                  )}

                  <div className="relative h-full p-6 rounded-2xl border border-border bg-background">
                    {/* Status badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}15` }}
                      >
                        <StatusIcon className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{ backgroundColor: `${config.color}15`, color: config.color }}
                      >
                        {config.label}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold mb-6">{phase.title}</h3>

                    <ul className="space-y-3">
                      {phase.items.map((item, iIndex) => (
                        <li key={iIndex} className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              item.done
                                ? "bg-primary/20"
                                : "border border-border"
                            }`}
                          >
                            {item.done && <Check className="w-3 h-3 text-primary" />}
                          </div>
                          <span
                            className={`text-sm leading-relaxed ${
                              item.done ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Auditor model explanation */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5">
            <h3 className="text-lg font-semibold mb-4">About the Auditor Model</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The destination of Gaussia, if the community validates it, is a model trained
              specifically for auditing AI responses. Not a general LLM fine-tuned for evaluation,
              but a model built from scratch with three distinguishing characteristics:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold">1.</span>
                <span>Completely public training dataset, including annotations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold">2.</span>
                <span>Transparent training process: architecture, hyperparameters, loss curves, known biases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold">3.</span>
                <span>Sectoral finetuning: medical, legal, technical domains with public or private weights</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4 italic">
              This model is not a substitute for human judgment. It's a tool that makes human judgment
              more scalable, consistent, and traceable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
