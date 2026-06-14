import { stats } from "@/lib/constants";

export default function Achievements() {
  return (
    <section>
      <div className="container mx-auto flex flex-col items-center justify-center gap-16 px-4 md:gap-24">
        <h2 className="text-foreground text-center font-sans text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
          Наши достижения
        </h2>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 lg:gap-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col transition-transform duration-500"
            >
              <div className="group relative flex h-full min-h-[220px] flex-col justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0D1A]/60 p-6 text-left backdrop-blur-md transition-all duration-500 sm:min-h-[280px] sm:p-8 hover:-translate-y-2 hover:border-white/20 hover:bg-[#0A0D1A]/80 hover:shadow-[0_20px_40px_rgba(200,165,100,0.1)]">
                <div className="from-gold/15 absolute -inset-px bg-linear-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex flex-col gap-4">
                  <span className="text-gold block font-serif text-[clamp(2.5rem,4vw,4.5rem)] leading-[1.1] font-bold tracking-tight drop-shadow-sm">
                    {s.prefix && (
                      <span className="mb-1 block text-[clamp(2rem,3vw,3.5rem)]">
                        {s.prefix}
                      </span>
                    )}
                    {s.value}
                  </span>

                  <div className="text-muted-foreground text-[0.95rem] leading-snug xl:text-[1.05rem]">
                    {s.label}{" "}
                    {s.emphasis && (
                      <span className="group-hover:text-gold-soft text-foreground mt-2 block font-semibold transition-colors duration-300">
                        {s.emphasis}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
