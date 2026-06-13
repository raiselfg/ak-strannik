"use client"

import * as React from "react"
import { team } from "@/lib/constants"
import Image from "next/image"
import { motion } from "motion/react"

export function TeamSection() {
  return (
    <section
      id="about"
      className="relative overflow-clip py-24 md:py-40"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="mb-20 flex flex-col items-center text-center">
          <h2 className="font-hand text-5xl leading-[0.95] font-bold tracking-[0.5px] md:text-7xl">
            Команда Академии
          </h2>
          <p className="mt-6 max-w-2xl font-serif text-xl text-muted-foreground italic">
            {team.quote}
          </p>
        </div>

        <div className="relative flex flex-col gap-12 pb-[10vh] sm:gap-24">
          {team.members.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="sticky z-10 flex w-full flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-background shadow-[0_-15px_40px_rgba(0,0,15,0.6)] md:h-[420px] md:flex-row"
              style={{ top: `calc(12vh + ${i * 24}px)` }}
            >
              <span className="pointer-events-none absolute -top-12 -right-6 z-0 font-serif text-[14rem] leading-none font-bold text-white/2 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative h-[350px] w-full shrink-0 border-b border-white/10 md:h-full md:w-[45%] md:border-r md:border-b-0">
                <Image
                  src={m.image}
                  alt={m.name}
                  width={500}
                  height={600}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-12 lg:p-16">
                <div className="border-gold/30 bg-gold/10 text-gold mb-6 inline-flex w-max items-center rounded-full border px-5 py-2 text-sm font-medium tracking-wide backdrop-blur-md">
                  {m.role}
                </div>

                <h3 className="mb-8 text-4xl leading-tight font-bold text-foreground md:text-5xl lg:text-[3.4rem]">
                  {m.name}
                </h3>

                <div className="mt-auto flex items-center gap-4 opacity-60">
                  <span className="from-gold h-px w-16 bg-linear-to-r to-transparent" />
                  <span className="font-serif text-sm tracking-widest text-muted-foreground uppercase">
                    Академия Странствий
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
