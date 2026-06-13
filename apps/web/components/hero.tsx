// "use client"

// import * as React from "react"
// import { Puzzle, Mountain } from "lucide-react"

// import { hero } from "@/lib/constants"
// import { Starfield } from "@/components/starfield"
// import Image from "next/image"

// const missionIcons = { puzzle: Puzzle, mountain: Mountain } as const

// const PARALLAX_CONFIG = [
//   { key: "stars1", d: 0.12, p: 0.3 },
//   { key: "stars2", d: 0.26, p: 0.7 },
//   { key: "moon", d: 0.08, p: -0.4 },
//   { key: "glow", d: 0.05, p: 0 },
//   // Немного усилили параметр 'p' для корабля, чтобы он охотнее летел за мышью
//   { key: "ship", d: 0.16, p: -1.0 },
//   { key: "ridge", d: 0.03, p: 0 },
// ]

// export function Hero() {
//   const stars1 = React.useRef<HTMLDivElement>(null)
//   const stars2 = React.useRef<HTMLDivElement>(null)
//   const moon = React.useRef<HTMLDivElement>(null)
//   const glow = React.useRef<HTMLDivElement>(null)
//   const ship = React.useRef<HTMLDivElement>(null)
//   const ridge = React.useRef<HTMLDivElement>(null)

//   React.useEffect(() => {
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
//     if (reduce) return

//     const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
//       stars1,
//       stars2,
//       moon,
//       glow,
//       ship,
//       ridge,
//     }

//     // Сохраняем key в массиве items, чтобы позже распознать корабль
//     const items = PARALLAX_CONFIG.map((c) => ({
//       key: c.key,
//       el: refs[c.key]?.current,
//       d: c.d,
//       p: c.p,
//     })).filter((i) => i.el) as {
//       key: string
//       el: HTMLElement
//       d: number
//       p: number
//     }[]

//     let mx = 0,
//       my = 0,
//       sy = window.scrollY,
//       ticking = false

//     const apply = () => {
//       ticking = false
//       for (const it of items) {
//         const ty = -sy * it.d
//         const tx = mx * it.p
//         const currentY = ty + my * it.p

//         let transformStr = `translate3d(${tx.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`

//         // ИНТЕРАКТИВНОСТЬ: Добавляем 3D-вращение специально для корабля
//         if (it.key === "ship") {
//           // Вычисляем углы наклона на основе позиции мыши (mx, my)
//           const rotX = (-my * 0.35).toFixed(2)
//           const rotY = (mx * 0.35).toFixed(2)

//           // perspective(1200px) задает глубину 3D-пространства
//           transformStr += ` perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
//         }

//         it.el.style.transform = transformStr
//       }
//     }

//     const req = () => {
//       if (!ticking) {
//         ticking = true
//         requestAnimationFrame(apply)
//       }
//     }

//     const onScroll = () => {
//       sy = window.scrollY
//       req()
//     }

//     const onMove = (e: PointerEvent) => {
//       const cx = window.innerWidth / 2
//       const cy = window.innerHeight / 2
//       mx = ((e.clientX - cx) / cx) * 28
//       my = ((e.clientY - cy) / cy) * 22
//       req()
//     }

//     window.addEventListener("scroll", onScroll, { passive: true })
//     window.addEventListener("pointermove", onMove, { passive: true })
//     apply()

//     return () => {
//       window.removeEventListener("scroll", onScroll)
//       window.removeEventListener("pointermove", onMove)
//     }
//   }, [])

//   return (
//     <section
//       id="top"
//       className="relative flex min-h-svh items-center overflow-hidden"
//     >
//       {/* Небо */}
//       <div className="hero-sky absolute inset-0 z-0" />

//       <div ref={stars1} className="absolute inset-0 z-1">
//         <Starfield count={50} maxSize={2} />
//       </div>
//       <div ref={stars2} className="absolute inset-0 z-1">
//         <Starfield count={40} minSize={1.4} maxSize={3.4} />
//       </div>

//       <div ref={moon} className="moon absolute top-[9%] right-[8%] z-1" />

//       {/* Тёплое свечение у горизонта */}
//       <div className="absolute bottom-[6%] left-[42%] z-2 -translate-x-1/2">
//         <div ref={glow} className="hero-glow" />
//       </div>

//       {/* Корабль / шар */}
//       <div className="absolute top-1/2 right-[3%] z-3 w-[min(46vw,640px)] -translate-y-1/2 max-md:top-auto max-md:right-[-12%] max-md:bottom-[8%] max-md:w-[74vw] max-md:translate-y-0 max-md:opacity-55">
//         {/* Контейнер корабля, которым мы управляем через JS */}
//         <div
//           ref={ship}
//           className="origin-center transition-transform duration-75 ease-out"
//         >
//           {/* Внутренний контейнер для независимой CSS-анимации парения */}
//           <div className="motion-safe:animate-float">
//             <Image
//               src={hero.shipImage}
//               alt="Академия Странствий"
//               height={500}
//               width={500}
//               priority
//               className="aspect-3/4 w-full rounded-[20px]"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="relative z-10 container mx-auto flex min-h-svh w-full flex-col items-center justify-center pt-24 pb-12">
//         <div className="mx-auto mt-auto max-w-[800px] text-center">
//           <div className="font-hand text-gold mb-4 text-2xl leading-none font-semibold">
//             {hero.eyebrow}
//           </div>
//           <h1 className="font-hand mb-6 text-[clamp(4rem,11vw,8.4rem)] leading-[0.85] font-bold tracking-[1px] [text-shadow:0_6px_40px_rgba(0,0,10,0.5)]">
//             {hero.title[0]}
//             <span className="text-gold-soft block">{hero.title[1]}</span>
//           </h1>
//           <p className="mx-auto max-w-[600px] rounded-2xl bg-background/10 p-4 text-lg text-muted-foreground/90 backdrop-blur-sm">
//             <b className="mr-2 text-sm font-semibold tracking-wide text-foreground uppercase">
//               Академия Странствий
//             </b>
//             {hero.description}
//           </p>
//         </div>

//         <div className="mt-auto grid w-full max-w-[800px] grid-cols-1 gap-6 pt-16 md:grid-cols-2">
//           {hero.missions.map((m, i) => {
//             const Icon = missionIcons[m.icon]
//             return (
//               <div
//                 key={m.title}
//                 className="group flex items-start gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
//               >
//                 <span className="text-gold flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-white/10 to-transparent shadow-inner">
//                   <Icon
//                     className="h-7 w-7 transition-transform duration-500 group-hover:scale-110"
//                     strokeWidth={1.5}
//                   />
//                 </span>
//                 <div className="text-left">
//                   <h3 className="font-hand text-gold mb-2 text-2xl leading-none font-semibold tracking-wide">
//                     {m.title}
//                   </h3>
//                   <p className="text-sm leading-relaxed text-white/70">
//                     {m.text}
//                   </p>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     </section>
//   )
// }
"use client"

import * as React from "react"
import { Puzzle, Mountain } from "lucide-react"

import { hero } from "@/lib/constants"
import { Starfield } from "@/components/starfield"
import Image from "next/image"

const missionIcons = { puzzle: Puzzle, mountain: Mountain } as const

const PARALLAX_CONFIG = [
  { key: "stars1", d: 0.12, p: 0.3 },
  { key: "stars2", d: 0.26, p: 0.7 },
  { key: "moon", d: 0.08, p: -0.4 },
  { key: "glow", d: 0.05, p: 0 },
  { key: "ship", d: 0.16, p: -2.3 },
]

export function Hero() {
  const stars1 = React.useRef<HTMLDivElement>(null)
  const stars2 = React.useRef<HTMLDivElement>(null)
  const moon = React.useRef<HTMLDivElement>(null)
  const glow = React.useRef<HTMLDivElement>(null)
  const ship = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      stars1,
      stars2,
      moon,
      glow,
      ship,
    }

    const items = PARALLAX_CONFIG.map((c) => ({
      key: c.key,
      el: refs[c.key]?.current,
      d: c.d,
      p: c.p,
    })).filter((i) => i.el) as {
      key: string
      el: HTMLElement
      d: number
      p: number
    }[]

    let mx = 0,
      my = 0,
      sy = window.scrollY,
      ticking = false

    const apply = () => {
      ticking = false
      for (const it of items) {
        const ty = -sy * it.d
        const tx = mx * it.p
        const currentY = ty + my * it.p

        let transformStr = `translate3d(${tx.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`

        if (it.key === "ship") {
          const rotX = (-my * 0.35).toFixed(2)
          const rotY = (mx * 0.35).toFixed(2)
          transformStr += ` perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
        }

        it.el.style.transform = transformStr
      }
    }

    const req = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(apply)
      }
    }

    const onScroll = () => {
      sy = window.scrollY
      req()
    }

    const onMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      mx = ((e.clientX - cx) / cx) * 28
      my = ((e.clientY - cy) / cy) * 22
      req()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onMove, { passive: true })
    apply()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      <div className="hero-sky absolute inset-0 z-0" />

      <div ref={stars1} className="absolute inset-0 z-1">
        <Starfield count={50} maxSize={2} />
      </div>
      <div ref={stars2} className="absolute inset-0 z-1">
        <Starfield count={40} minSize={1.4} maxSize={3.4} />
      </div>

      <div ref={moon} className="moon absolute top-[9%] right-[8%] z-1" />

      <div className="absolute bottom-[6%] left-[42%] z-2 -translate-x-1/2">
        <div ref={glow} className="hero-glow" />
      </div>

      <div className="absolute top-1/2 right-[3%] z-3 w-[min(46vw,640px)] -translate-y-1/2 max-md:top-auto max-md:right-[-12%] max-md:bottom-[8%] max-md:w-[74vw] max-md:translate-y-0 max-md:opacity-55">
        <div
          ref={ship}
          className="origin-center transition-transform duration-75 ease-out"
        >
          <div className="motion-safe:animate-float">
            <Image
              src={hero.shipImage}
              alt="Академия Странствий"
              height={350}
              width={500}
              priority
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto flex min-h-svh w-full flex-col items-center justify-center pt-24 pb-12 lg:items-start">
        <div className="mx-auto mt-auto w-full max-w-[800px] text-center lg:mx-0 lg:max-w-[580px] lg:text-left">
          <div className="font-hand text-gold mb-4 text-2xl leading-none font-semibold">
            {hero.eyebrow}
          </div>
          <h1 className="font-hand mb-6 text-[clamp(3.8rem,10vw,7.2rem)] leading-[0.85] font-bold tracking-[1px] [text-shadow:0_6px_40px_rgba(0,0,10,0.5)]">
            {hero.title[0]}
            <span className="text-gold-soft block">{hero.title[1]}</span>
          </h1>
          <p className="mx-auto max-w-[600px] rounded-2xl bg-background/10 p-4 text-lg text-muted-foreground/90 backdrop-blur-sm lg:mx-0">
            <b className="mr-2 text-sm font-semibold tracking-wide text-foreground uppercase">
              Академия Странствий
            </b>
            {hero.description}
          </p>
        </div>

        <div className="mx-auto mt-auto grid w-full max-w-[800px] grid-cols-1 gap-6 pt-16 md:grid-cols-2 lg:mx-0 lg:max-w-[700px]">
          {hero.missions.map((m, i) => {
            const Icon = missionIcons[m.icon]
            return (
              <div
                key={m.title}
                className="group flex items-start gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                <span className="text-gold flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-linear-to-br from-white/10 to-transparent shadow-inner">
                  <Icon
                    className="h-7 w-7 transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </span>
                <div className="text-left">
                  <h3 className="font-hand text-gold mb-2 text-2xl leading-none font-semibold tracking-wide">
                    {m.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    {m.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
