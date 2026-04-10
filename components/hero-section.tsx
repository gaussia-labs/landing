"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Copy, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const copyCommand = () => {
    navigator.clipboard.writeText("pip install gaussia")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrame: number
    let time = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)

    const gaussian = (x: number, mu: number, sigma: number) => {
      return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI))
    }

    const particles: Array<{
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      hue: number
    }> = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
        hue: Math.random() * 30 + 15,
      })
    }

    const draw = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.y -= p.speed
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.fillStyle = `hsla(${p.hue}, 40%, 50%, ${p.opacity})`
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      const curves = [
        { offset: 0, color: "#ab412d", alpha: 0.15, scale: 1 },
        { offset: 50, color: "#c8a787", alpha: 0.1, scale: 0.8 },
        { offset: -30, color: "#85624f", alpha: 0.08, scale: 1.2 },
      ]

      curves.forEach((curve) => {
        ctx.beginPath()
        ctx.strokeStyle = curve.color
        ctx.globalAlpha = curve.alpha
        ctx.lineWidth = 2

        const centerY = height * 0.55 + curve.offset
        const amplitude = height * 0.3 * curve.scale

        for (let x = 0; x <= width; x += 2) {
          const normalizedX = (x / width) * 6 - 3
          const waveOffset = Math.sin(time * 0.001 + x * 0.003) * 20
          const y = gaussian(normalizedX, 0, 1) * amplitude * 2.5
          const canvasY = centerY - y + waveOffset

          if (x === 0) {
            ctx.moveTo(x, canvasY)
          } else {
            ctx.lineTo(x, canvasY)
          }
        }
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      ctx.beginPath()
      ctx.strokeStyle = "#c8a787"
      ctx.globalAlpha = 0.2
      ctx.lineWidth = 1
      ctx.setLineDash([8, 8])
      ctx.moveTo(width / 2, height * 0.2)
      ctx.lineTo(width / 2, height * 0.8)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.globalAlpha = 1

      time++
      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.8 }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] opacity-10"
          viewBox="0 0 800 200"
          fill="none"
        >
          <path
            d="M0 200 L0 100 Q400 -50 800 100 L800 200"
            stroke="#85624f"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-secondary/20 rounded-tl-3xl" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-secondary/20 rounded-tr-3xl" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-secondary/20 rounded-bl-3xl" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-secondary/20 rounded-br-3xl" />
      </div>

      <div
        className="container mx-auto px-6 py-24 relative z-10"
        style={{
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-secondary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-12 h-px bg-secondary" />
          </div>

          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4 text-foreground">
            Gaussia
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Born at{" "}
            <a
              href="https://alquimia.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Alquimia AI Labs
            </a>
          </p>

          <p className="text-xl md:text-2xl text-foreground/80 mb-4 max-w-3xl text-balance leading-relaxed">
            Scientific metrics for intelligent behaviors.
          </p>

          <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            If you can't trace it to a paper, it's not a metric. It's an opinion.
            Gaussia implements peer-reviewed research so your evaluations become
            part of the scientific record.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="group text-base px-8" asChild>
              <a href="https://docs.gaussia.ai" target="_blank" rel="noopener noreferrer">
                Read the Docs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <a
                href="https://github.com/alquimia-ai/gaussia"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>

          <div className="w-full max-w-md">
            <div
              className="relative group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 font-mono text-sm cursor-pointer hover:border-primary/50 transition-all"
              onClick={copyCommand}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground select-none">$ </span>
                  <span className="text-foreground">pip install gaussia</span>
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-primary">
                  Copied!
                </span>
              )}
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Scroll
            </span>
            <div className="w-px h-8 bg-secondary animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
