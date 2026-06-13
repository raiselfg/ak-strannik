"use client"

import * as React from "react"
import { stats } from "@/lib/constants"
import { CountUp } from "@/components/count-up"
import { motion, Variants } from "motion/react"
import { cn } from "@workspace/ui/lib/utils"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15,
    },
  },
}

export function Achievements() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-50" />

      <div className="relative z-10 container mx-auto">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <motion.div
            className="lg:col-span-4 lg:pr-4"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="font-hand text-5xl leading-[0.95] font-bold tracking-[0.5px] md:text-7xl">
              Наши достижения
            </h2>
            <div className="from-gold mt-6 h-px w-16 bg-linear-to-r to-transparent" />
            <p className="mt-6 text-lg text-muted-foreground">
              Мы гордимся результатами, которых достигли за время нашей работы.
              Каждая цифра — это реальные люди и проекты.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-6 sm:flex-row lg:col-span-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={itemVariants}
                className={cn(
                  "group hover:border-gold/30 relative flex-1 overflow-hidden rounded-[24px] border border-white/5 bg-white/2 p-6 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/4 hover:shadow-[0_20px_40px_rgba(200,165,100,0.1)] lg:p-5 xl:p-8",
                  i === 1 && "sm:mt-12 sm:-mb-12",
                  i === 2 && "sm:-mt-6 sm:mb-6"
                )}
              >
                <div className="from-gold/15 absolute -inset-px z-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex h-full flex-col justify-center">
                  <CountUp
                    value={s.value}
                    prefix={s.prefix}
                    className="text-gold block font-serif text-[clamp(2.5rem,3vw,4rem)] leading-[1.1] font-bold tracking-tight wrap-break-word drop-shadow-sm"
                  />
                  <div className="mt-4 text-[0.95rem] leading-snug text-muted-foreground xl:text-[1.05rem]">
                    {s.label}{" "}
                    <em className="group-hover:text-gold-soft mt-1 block font-semibold text-foreground not-italic transition-colors duration-300">
                      {s.emphasis}
                    </em>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
