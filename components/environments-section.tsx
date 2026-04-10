"use client"

import { Badge } from "@/components/ui/badge"
import { FileText, Code2, Users, ArrowRight, Github } from "lucide-react"
import { useState } from "react"

const sdks = [
  { name: "Python", status: "stable", maintainer: "Core Team" },
  { name: "TypeScript", status: "beta", maintainer: "Community" },
  { name: "Rust", status: "planned", maintainer: "Community" },
  { name: "C++", status: "planned", maintainer: "Community" },
  { name: "Swift", status: "planned", maintainer: "Community" },
  { name: "Go", status: "planned", maintainer: "Community" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "stable":
      return "bg-green-500/10 text-green-700 border-green-500/30"
    case "beta":
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30"
    case "planned":
      return "bg-muted text-muted-foreground border-border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function EnvironmentsSection() {
  const [hoveredSdk, setHoveredSdk] = useState<string | null>(null)

  return (
    <section id="environments" className="py-32 bg-card relative overflow-hidden">
      {/* Architectural background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[5%] w-px h-full bg-gradient-to-b from-border via-border/50 to-transparent" />
        <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-border/50 via-border/30 to-transparent" />
        <div className="absolute top-0 right-[5%] w-px h-full bg-gradient-to-b from-border via-border/50 to-transparent" />
        <div className="absolute top-0 right-[15%] w-px h-full bg-gradient-to-b from-border/50 via-border/30 to-transparent" />

        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[150px] opacity-20"
          viewBox="0 0 1200 150"
          fill="none"
        >
          <path
            d="M0 150 L0 80 Q600 -30 1200 80 L1200 150"
            stroke="#85624f"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M100 150 L100 90 Q600 10 1100 90 L1100 150"
            stroke="#c8a787"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-secondary" />
            <Badge variant="outline" className="px-4 py-1">
              Open Ecosystem
            </Badge>
            <div className="w-8 h-px bg-secondary" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Papers First, SDKs Follow
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Every metric starts as a paper. Once approved, the community builds official SDKs 
            that implement the science in your language of choice.
          </p>
        </div>

        {/* The Flow */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-px bg-gradient-to-r from-primary/50 to-primary/50" />
            <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-px bg-gradient-to-r from-primary/50 to-primary/50" />

            {/* Step 1: Papers */}
            <div className="relative bg-background border border-border rounded-2xl p-8 text-center group hover:border-primary/50 transition-colors">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  1
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Paper Repository</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Scientific papers are proposed, reviewed, and approved by the community. 
                Each paper defines a metric with mathematical rigor.
              </p>
              <a
                href="https://github.com/gaussia-labs/papers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Github className="w-4 h-4" />
                gaussia-labs/papers
              </a>
            </div>

            {/* Step 2: Specs */}
            <div className="relative bg-background border border-border rounded-2xl p-8 text-center group hover:border-primary/50 transition-colors">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  2
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Code2 className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Implementation Specs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Contributors translate papers into language-agnostic specifications. 
                These specs define interfaces, edge cases, and test vectors.
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
                RFC Process
              </span>
            </div>

            {/* Step 3: SDKs */}
            <div className="relative bg-background border border-border rounded-2xl p-8 text-center group hover:border-primary/50 transition-colors">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  3
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community SDKs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Official SDKs maintained by the community implement specs in every major language. 
                Same science, native performance.
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
                Pick Your Language
              </span>
            </div>
          </div>
        </div>

        {/* SDK Grid */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-lg font-semibold mb-8 text-muted-foreground">
            Official SDKs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sdks.map((sdk) => (
              <div
                key={sdk.name}
                className="relative bg-background border border-border rounded-xl p-4 text-center transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                onMouseEnter={() => setHoveredSdk(sdk.name)}
                onMouseLeave={() => setHoveredSdk(null)}
              >
                <p className="font-mono font-semibold mb-2">{sdk.name}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(sdk.status)}`}
                >
                  {sdk.status}
                </Badge>
                
                {/* Tooltip on hover */}
                {hoveredSdk === sdk.name && (
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10">
                    Maintained by {sdk.maintainer}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Want to maintain an SDK for your favorite language?
          </p>
          <a
            href="https://github.com/gaussia-labs/papers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Read the contribution guide
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
