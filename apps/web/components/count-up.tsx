"use client"

import * as React from "react"

interface CountUpProps {
  value: number
  duration?: number
  prefix?: string
  className?: string
}

/** Анимированный счётчик: считает от 0 до value при появлении в кадре. */
export function CountUp({
  value,
  duration = 1800,
  prefix = "",
  className,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = React.useState(0)
  const started = React.useRef(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const run = () => {
      if (started.current) return
      started.current = true
      if (prefersReduced) {
        setDisplay(value)
        return
      }
      const start = performance.now()
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(value * eased)
        if (p < 1) requestAnimationFrame(step)
        else setDisplay(value)
      }
      requestAnimationFrame(step)
    }

    if (typeof IntersectionObserver === "undefined") {
      run()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, duration])

  const formatted = Math.round(display)
    .toLocaleString("ru-RU")
    .replace(/\u00a0/g, "\u202f")

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
    </span>
  )
}
