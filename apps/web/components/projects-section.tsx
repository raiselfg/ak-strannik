import * as React from "react"
import { projects } from "@/lib/constants"
import { Gallery } from "@/components/gallery"
import { ArrowUpRight } from "lucide-react"

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container mx-auto">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="font-hand text-5xl leading-[0.95] font-bold tracking-[0.5px] md:text-7xl">
            Наши проекты
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {projects.intro}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {projects.items.map((p, idx) => (
            <div
              key={idx}
              className="group hover:border-gold relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/2 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_80px_rgba(200,165,100,0.15)]"
            >
              <div className="from-gold/20 absolute inset-0 z-0 bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-10 flex items-start justify-between">
                  <span className="text-gold font-serif text-2xl font-light opacity-60">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {p.afterHref && (
                    <div className="group-hover:bg-gold group-hover:text-ink flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors duration-300">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="mb-8 flex-1">
                  {p.nameFirst ? (
                    <>
                      <h3 className="text-2xl leading-tight font-bold text-foreground">
                        {p.name}
                      </h3>
                      <p className="mt-2 text-base font-medium text-muted-foreground">
                        {p.lead}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {p.lead}
                      </p>
                      <h3 className="mt-2 text-2xl leading-tight font-bold text-foreground">
                        {p.name}
                      </h3>
                    </>
                  )}
                </div>

                {p.after && (
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      {p.after}
                    </span>
                    {p.afterHref && (
                      <a href={p.afterHref} className="absolute inset-0 z-20">
                        <span className="sr-only">Подробнее</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-[880px] text-center text-sm text-muted-foreground/80 sm:text-base">
          {projects.note.map((para, i) => (
            <p key={i} className={i > 0 ? "mt-4" : ""}>
              {para}
            </p>
          ))}
        </div>

        <div className="relative z-10 mt-24 sm:mt-32">
          <div className="mb-10 flex items-center justify-center gap-4">
            <span className="bg-gold/50 block h-px w-12" />
            <h3 className="font-hand text-gold text-center text-4xl">
              Благодарности
            </h3>
            <span className="bg-gold/50 block h-px w-12" />
          </div>
          <Gallery />
        </div>
      </div>
    </section>
  )
}
