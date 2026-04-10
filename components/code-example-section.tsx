"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Copy, Terminal, Sparkles } from "lucide-react"

const codeExamples = {
  python: `from gaussia import Dataset, Batch, Conversation, Turn
from gaussia.metrics import BiasMetric, ToxicityMetric, ContextMetric

# Build a dataset with conversations
dataset = Dataset(
    batches=[
        Batch(
            conversations=[
                Conversation(
                    turns=[
                        Turn(role="user", content="What is machine learning?"),
                        Turn(role="assistant", content="Machine learning is...")
                    ]
                )
            ]
        )
    ]
)

# Evaluate with scientifically-backed metrics
bias_result = BiasMetric().evaluate(dataset)
toxicity_result = ToxicityMetric().evaluate(dataset)
context_result = ContextMetric().evaluate(dataset)

# Each metric traces back to a peer-reviewed paper
print(f"Bias score: {bias_result.score}")
print(f"Paper: {bias_result.paper_reference}")`,

  javascript: `// JavaScript SDK - Coming Soon
// 
// The Gaussia JavaScript SDK is currently in development.
// It will provide the same scientifically-backed metrics
// optimized for edge and browser environments.
//
// Want to contribute? Check out:
// https://github.com/gaussia-labs/papers
//
// Or join the RFC discussion:
// https://github.com/gaussia-labs/rfcs
//
// Expected features:
// - Edge-optimized metric evaluation
// - WebAssembly core for performance
// - Same paper-backed methodology`,

  rust: `// Rust SDK - Coming Soon
//
// The Gaussia Rust SDK is currently in development.
// It will provide low-level, high-performance metrics
// for systems requiring maximum efficiency.
//
// Want to contribute? Check out:
// https://github.com/gaussia-labs/papers
//
// Or join the RFC discussion:
// https://github.com/gaussia-labs/rfcs
//
// Expected features:
// - Zero-copy evaluation pipelines
// - WASM compilation target
// - Explainability engine for model introspection`,
}

type Language = keyof typeof codeExamples

const languageConfig = {
  python: { label: "Python", icon: "py", color: "#3776AB" },
  javascript: { label: "JavaScript", icon: "js", color: "#F7DF1E" },
  rust: { label: "Rust", icon: "rs", color: "#DEA584" },
}

export function CodeExampleSection() {
  const [activeTab, setActiveTab] = useState<Language>("python")
  const [copied, setCopied] = useState(false)
  const [typedCode, setTypedCode] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Typing animation when tab changes
  useEffect(() => {
    const code = codeExamples[activeTab]
    setTypedCode("")
    setIsTyping(true)

    let index = 0
    const interval = setInterval(() => {
      if (index < code.length) {
        setTypedCode(code.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 8)

    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <section className="py-32 bg-card relative overflow-hidden">
      {/* Decorative code-like background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <pre className="text-xs leading-loose p-8 overflow-hidden max-h-full">
          {Array.from({ length: 50 })
            .map(
              () =>
                `const measure = (response) => analyze(response).then(r => validate(r));`
            )
            .join("\n")}
        </pre>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-secondary" />
            <Badge variant="outline" className="px-4 py-1">
              Developer Experience
            </Badge>
            <div className="w-8 h-px bg-secondary" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">Simple, Powerful API</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Get started in minutes with our intuitive API. Same concepts, native implementations
            for each environment.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Tab buttons with elegant styling */}
          <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-xl inline-flex w-auto mx-auto">
            {(Object.keys(codeExamples) as Language[]).map((lang) => (
              <Button
                key={lang}
                variant={activeTab === lang ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(lang)}
                className={`font-mono px-6 transition-all ${
                  activeTab === lang ? "shadow-md" : ""
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: languageConfig[lang].color }}
                />
                {languageConfig[lang].label}
              </Button>
            ))}
          </div>

          {/* Code block with elegant frame */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />

            <div className="relative rounded-2xl border border-border bg-[#1a1a1a] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#252525]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-white/60 text-xs font-mono">
                    <Terminal className="w-3 h-3" />
                    example.{languageConfig[activeTab].icon}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCode}
                  className="text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              {/* Code content */}
              <pre
                ref={codeRef}
                className="p-6 overflow-x-auto max-h-[400px] overflow-y-auto"
              >
                <code className="text-sm font-mono text-white/90 leading-relaxed whitespace-pre">
                  {typedCode}
                  {isTyping && (
                    <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
                  )}
                </code>
              </pre>
            </div>
          </div>

          {/* Install badges */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>Install now</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge
                variant="secondary"
                className="font-mono px-4 py-2 text-sm hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                pip install gaussia
              </Badge>
              <Badge
                variant="outline"
                className="font-mono px-4 py-2 text-sm text-muted-foreground cursor-default"
              >
                npm i gaussia (coming soon)
              </Badge>
              <Badge
                variant="outline"
                className="font-mono px-4 py-2 text-sm text-muted-foreground cursor-default"
              >
                cargo add gaussia (coming soon)
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
