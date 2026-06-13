"use client"

import { cn } from "@workspace/ui/lib/utils"
import * as React from "react"

interface StarfieldProps {
  count?: number
  minSize?: number
  maxSize?: number
  className?: string
}

interface Star {
  left: string
  top: string
  size: number
  opacity: number
  duration: string
  delay: string
}

/** Слой мерцающих звёзд. Генерируется на клиенте, чтобы не было рассинхрона гидратации. */
export function Starfield({
  count = 50,
  minSize = 1,
  maxSize = 2.4,
  className,
}: StarfieldProps) {
  const [stars, setStars] = React.useState<Star[]>([])

  React.useEffect(() => {
    const arr: Star[] = Array.from({ length: count }, () => {
      const size = minSize + Math.random() * (maxSize - minSize)
      return {
        left: `${(Math.random() * 100).toFixed(3)}%`,
        top: `${(Math.random() * 100).toFixed(3)}%`,
        size,
        opacity: 0.25 + Math.random() * 0.75,
        duration: `${(2.2 + Math.random() * 4).toFixed(2)}s`,
        delay: `${(-Math.random() * 6).toFixed(2)}s`,
      }
    })
    const t = window.setTimeout(() => setStars(arr), 0)
    return () => window.clearTimeout(t)
  }, [count, minSize, maxSize])

  return (
    <div
      className={cn("pointer-events-none absolute -inset-[10%]", className)}
      aria-hidden
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white shadow-[0_0_6px_1px_rgba(210,222,255,0.5)] motion-safe:animate-[twinkle_var(--tw)_ease-in-out_infinite]"
          style={
            {
              left: s.left,
              top: s.top,
              width: `${s.size.toFixed(2)}px`,
              height: `${s.size.toFixed(2)}px`,
              opacity: s.opacity,
              animationDelay: s.delay,
              "--tw": s.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
