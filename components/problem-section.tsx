"use client"

import { Badge } from "@/components/ui/badge"
import { AlertCircle, HelpCircle, FileQuestion } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const existingTools = [
  {
    name: "DeepEval",
    focus: "Quality metrics",
    strength: "50+ metrics for RAG, agents, conversation",
    limitation: "Most metrics require LLM API calls. Scientific backing is partial.",
  },
  {
    name: "RAGAS",
    focus: "RAG evaluation",
    strength: "Academic origin (arXiv paper). No ground truth needed.",
    limitation: "Scope limited to retrieval and generation. No safety/fairness.",
  },
  {
    name: "Promptfoo",
    focus: "Red teaming",
    strength: "50+ attack types. Adopted by OpenAI and Anthropic.",
    limitation: "Exclusively offensive. No quality or fairness metrics.",
  },
  {
    name: "Garak",
    focus: "Vulnerability scanning",
    strength: "3000+ static probes. Research-oriented.",
    limitation: "Static attacks only. Doesn't learn from context.",
  },
]

const gaps = [
  {
    icon: AlertCircle,
    title: "No Integration",
    description: "Quality, security, and ethics exist in silos. No single tool covers all three with scientific rigor.",
  },
  {
    icon: FileQuestion,
    title: "No Traceability",
    description: "When a tool gives you a score of 0.83, can you cite the paper that defines what 0.83 means?",
  },
  {
    icon: HelpCircle,
    title: "Models Only",
    description: "Every tool assumes you're evaluating an AI model. But intelligent behavior can come from humans too.",
  },
]

export function ProblemSection() {
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
    <section ref={sectionRef} id="problem" className="py-32 bg-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <Badge variant="outline" className="px-4 py-1">The Problem</Badge>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              The Problem No One
              <br />
              <span className="text-primary">Wants to Admit</span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-4">
              There's a thriving ecosystem of tools for evaluating language models.
              Most of them work. And yet, if you ask an engineering team why a faithfulness
              score of 0.83 is trustworthy, the most common answer is:
            </p>
            
            <p className="text-2xl font-medium text-foreground italic mb-8">
              "Because that's what the dashboard says."
            </p>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              That's not a technical problem. It's an epistemological one. Evaluating AI systems
              with metrics that no one can trace, cite, or reproduce is exactly the kind of
              magical thinking those systems taught us to avoid.
            </p>
          </div>

          {/* Current landscape */}
          <div className="mb-20">
            <h3 className="text-lg font-semibold text-center mb-8 text-muted-foreground uppercase tracking-wider">
              The Current Landscape
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {existingTools.map((tool, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border border-border bg-background transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h4 className="font-semibold text-lg mb-1">{tool.name}</h4>
                  <p className="text-sm text-primary mb-3">{tool.focus}</p>
                  <p className="text-sm text-muted-foreground mb-3">{tool.strength}</p>
                  <p className="text-xs text-muted-foreground/70 border-t border-border pt-3">
                    {tool.limitation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* The gaps */}
          <div className="relative p-10 rounded-3xl bg-primary/5 border border-primary/10">
            <h3 className="text-lg font-semibold text-center mb-10 text-foreground">
              What These Tools Define by Omission
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {gaps.map((gap, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <gap.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{gap.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{gap.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key insight */}
          <div className="mt-16 text-center">
            <div className="inline-block p-8 rounded-2xl border border-border bg-background">
              <p className="text-lg text-muted-foreground mb-4">
                Gaussia starts from a different premise:
              </p>
              <p className="text-2xl font-semibold text-foreground leading-relaxed max-w-2xl">
                The unit of analysis is the <span className="text-primary">behavior</span>, not the architecture.
              </p>
              <p className="text-base text-muted-foreground mt-4 max-w-xl mx-auto">
                A behavior can come from an LLM, a voice agent in a call center, a human operator,
                or a hybrid system. If you want to measure quality, coherence, or bias in responses,
                it shouldn't matter who or what produced them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
