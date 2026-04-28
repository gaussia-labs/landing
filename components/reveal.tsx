"use client"

import { useEffect, useRef, useState, type ReactNode, type ElementType, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Variant = "up" | "left" | "right" | "scale" | "blur" | "rise"

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  delay?: number
  variant?: Variant
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  up: "",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
  blur: "reveal-blur",
  rise: "reveal-rise",
}

export function Reveal({
  as: Tag = "div",
  delay = 0,
  variant = "up",
  className,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const rect = el.getBoundingClientRect()
    if (rect.bottom < 0) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => setVisible(true), delay)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", variantClass[variant], visible && "is-visible", className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
