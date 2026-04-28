"use client"

import { useEffect, useRef } from "react"

/**
 * A calm, utopic gauss-bell animation.
 *
 * A single soft bell curve breathes slowly. Above it, data points rain down
 * gently and settle under the curve, then drift lazily in 2D — like dust
 * suspended in warm light. Designed to sit BEHIND copy as a soft backdrop.
 */

type Particle = {
  x: number // normalised home x [0..1]
  homeY: number // resting y in pixels (under the curve)
  y: number // current y in pixels
  vy: number // vertical speed (during fall)
  r: number // radius
  alpha: number // final alpha
  settled: boolean
  delay: number
  tone: number // 0..1 blend between ink-soft and terracotta
  // float params (per-particle phases & freqs)
  phaseX: number
  phaseY: number
  freqX: number
  freqY: number
  ampX: number
  ampY: number
}

const TARGET_PARTICLES = 150

export function GaussCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Gauss function
    const gauss = (x: number, mu = 0.5, sigma = 0.18) =>
      Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma))

    // Box–Muller for a clamped standard normal
    const sampleNormal = () => {
      let u = 0
      let v = 0
      while (u === 0) u = Math.random()
      while (v === 0) v = Math.random()
      const n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
      return Math.max(-2.5, Math.min(2.5, n))
    }

    // Layout helpers — taller, lower-amplitude bell that fits behind copy
    const marginX = () => width * 0.04
    const baseY = () => height * 0.86
    const amp = () => height * 0.62

    const curveXfromT = (t: number) => marginX() + t * (width - marginX() * 2)
    const curveYfromT = (t: number, breath = 1) => baseY() - gauss(t) * amp() * breath

    const particles: Particle[] = []
    const spawnParticle = (delayOffset = 0): Particle => {
      const n = sampleNormal()
      const xn = Math.max(0.02, Math.min(0.98, 0.5 + n * 0.18))
      const jitter = 2 + Math.random() * 4
      const densityHeight = gauss(xn) * amp()
      const homeY = baseY() - Math.random() * densityHeight * 0.95 - jitter
      return {
        x: xn,
        homeY,
        y: -10 - Math.random() * 60,
        vy: 0.1 + Math.random() * 0.3,
        r: 1 + Math.random() * 1.4,
        alpha: 0.13 + Math.random() * 0.24, // softer
        settled: false,
        delay: delayOffset + Math.random() * 2400,
        tone: Math.max(0, 1 - Math.abs(xn - 0.5) / 0.4),
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        // gentle but visible per-particle wander
        freqX: 0.00045 + Math.random() * 0.0007,
        freqY: 0.0004 + Math.random() * 0.00065,
        ampX: 10 + Math.random() * 22, // px wander in x
        ampY: 6 + Math.random() * 14, // px wander in y
      }
    }

    for (let i = 0; i < TARGET_PARTICLES; i++) {
      particles.push(spawnParticle(i * 30))
    }

    const start = performance.now()
    let last = start

    const draw = (now: number) => {
      const t = now - start
      const dt = Math.min(48, now - last)
      last = now

      ctx.clearRect(0, 0, width, height)

      // very slow breath
      const breath = 1 + Math.sin(t * 0.00038) * 0.02

      // Hairline horizon
      ctx.strokeStyle = "rgba(34, 31, 26, 0.06)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(marginX(), baseY())
      ctx.lineTo(width - marginX(), baseY())
      ctx.stroke()

      // Soft shaded area under the curve — almost invisible wash
      const steps = 180
      ctx.beginPath()
      ctx.moveTo(marginX(), baseY())
      for (let i = 0; i <= steps; i++) {
        const tn = i / steps
        ctx.lineTo(curveXfromT(tn), curveYfromT(tn, breath))
      }
      ctx.lineTo(width - marginX(), baseY())
      ctx.closePath()
      const fillGrad = ctx.createLinearGradient(0, baseY() - amp(), 0, baseY())
      fillGrad.addColorStop(0, "rgba(171, 65, 45, 0.022)")
      fillGrad.addColorStop(1, "rgba(171, 65, 45, 0)")
      ctx.fillStyle = fillGrad
      ctx.fill()

      // Particles
      for (const p of particles) {
        if (t < p.delay) continue
        if (!p.settled) {
          p.vy += 0.0014 * dt
          p.y += p.vy * (dt * 0.9)
          if (p.y >= p.homeY) {
            p.y = p.homeY
            p.settled = true
          }
          const cx = curveXfromT(p.x)
          ctx.fillStyle = blendInkTerracotta(p.tone, p.alpha * 0.9)
          ctx.beginPath()
          ctx.arc(cx, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // 2D float around home position with two coupled sine waves
          const wanderX =
            Math.sin(t * p.freqX + p.phaseX) * p.ampX +
            Math.sin(t * 0.0011 + p.x * 7) * 1.2
          const wanderY =
            Math.cos(t * p.freqY + p.phaseY) * p.ampY +
            // shared shimmer so the cluster breathes together
            Math.sin(t * 0.0014 + p.x * 6) * 1.4

          const cx = curveXfromT(p.x) + wanderX
          const cy = p.homeY + wanderY

          ctx.fillStyle = blendInkTerracotta(p.tone, p.alpha)
          ctx.beginPath()
          ctx.arc(cx, cy, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // The bell curve line
      const lineGrad = ctx.createLinearGradient(marginX(), 0, width - marginX(), 0)
      lineGrad.addColorStop(0, "rgba(34, 31, 26, 0.32)")
      lineGrad.addColorStop(0.35, "rgba(90, 50, 35, 0.4)")
      lineGrad.addColorStop(0.5, "rgba(171, 65, 45, 0.48)")
      lineGrad.addColorStop(0.65, "rgba(90, 50, 35, 0.4)")
      lineGrad.addColorStop(1, "rgba(34, 31, 26, 0.32)")
      ctx.strokeStyle = lineGrad
      ctx.lineWidth = 1.4
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      for (let i = 0; i <= steps; i++) {
        const tn = i / steps
        const x = curveXfromT(tn)
        const y = curveYfromT(tn, breath)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Peak sun — softer
      const peakX = curveXfromT(0.5)
      const peakY = curveYfromT(0.5, breath)
      const glow = ctx.createRadialGradient(peakX, peakY, 0, peakX, peakY, 36)
      glow.addColorStop(0, "rgba(171, 65, 45, 0.12)")
      glow.addColorStop(1, "rgba(171, 65, 45, 0)")
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(peakX, peakY, 36, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "rgba(171, 65, 45, 0.4)"
      ctx.beginPath()
      ctx.arc(peakX, peakY, 2.2, 0, Math.PI * 2)
      ctx.fill()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

// Blend ink-soft (#3a342d) <-> terracotta (#ab412d) by `tone`.
function blendInkTerracotta(tone: number, alpha: number) {
  const r = Math.round(58 + (171 - 58) * tone)
  const g = Math.round(52 + (65 - 52) * tone)
  const b = Math.round(45 + (45 - 45) * tone)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
