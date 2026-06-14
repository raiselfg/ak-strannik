import { projects } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";

const Gallery = dynamic(() => import("@/components/gallery"));

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="container mx-auto flex flex-col gap-12 px-2 sm:gap-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-hand text-4xl leading-[0.95] font-bold tracking-[0.5px] sm:text-5xl md:text-7xl">
            Наши проекты
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base sm:mt-6 sm:text-lg">
            {projects.intro}
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {projects.items.map((p, idx) => (
            <div
              key={idx}
              className="group hover:border-gold relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/2 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_80px_rgba(200,165,100,0.15)]"
            >
              <div className="from-gold/20 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col">
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
                      <h3 className="text-foreground text-2xl leading-tight font-bold">
                        {p.name}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-base font-medium">
                        {p.lead}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {p.lead}
                      </p>
                      <h3 className="text-foreground mt-2 text-2xl leading-tight font-bold">
                        {p.name}
                      </h3>
                    </>
                  )}
                </div>

                {p.after && (
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-muted-foreground group-hover:text-foreground text-sm font-medium transition-colors">
                      {p.after}
                    </span>
                    {p.afterHref && (
                      <a href={p.afterHref} className="absolute inset-0">
                        <span className="sr-only">Подробнее</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground/80 text-center text-sm sm:text-base">
          {projects.note.map((para, i) => (
            <p key={i} className={i > 0 ? "mt-4" : ""}>
              {para}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-12">
          <div className="flex items-center justify-center gap-5 sm:gap-14">
            <span className="bg-gold/50 block h-px w-6 shrink-0 sm:w-12" />
            <h3 className="font-hand text-gold text-center text-3xl sm:text-4xl">
              Благодарности
            </h3>
            <span className="bg-gold/50 block h-px w-6 shrink-0 sm:w-12" />
          </div>
          <Gallery />
        </div>
      </div>
    </section>
  );
}
