"use client";

import { Puzzle, Mountain } from "lucide-react";
import { hero } from "@/lib/constants";
import Image from "next/image";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useIsMobile } from "@strannik/ui/hooks/useIsMobile";

const Starfield = dynamic(() => import("@/components/starfield"));

const missionIcons = { puzzle: Puzzle, mountain: Mountain } as const;

const PARALLAX_CONFIG = [
  { key: "stars1", d: 0.12, p: 0.3 },
  { key: "stars2", d: 0.26, p: 0.7 },
  { key: "moon", d: 0.08, p: -0.4 },
  { key: "glow", d: 0.05, p: 0 },
  { key: "ship", d: 0.16, p: -2.3 },
];

export function Hero() {
  const stars1 = useRef<HTMLDivElement>(null);
  const stars2 = useRef<HTMLDivElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const ship = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      console.warn(
        "Анимации отключены настройками ОС (prefers-reduced-motion)"
      );
      return;
    }

    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      stars1,
      stars2,
      moon,
      ship,
    };

    let mx = 0,
      my = 0,
      sy = window.scrollY,
      ticking = false;

    const apply = () => {
      ticking = false;

      PARALLAX_CONFIG.forEach((config) => {
        const el = refs[config.key]?.current;
        if (!el) return;

        const ty = -sy * config.d;
        const tx = mx * config.p;
        const currentY = ty + my * config.p;

        let transformStr = `translate3d(${tx.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;

        if (config.key === "ship") {
          const rotX = (-my * 0.35).toFixed(2);
          const rotY = (mx * 0.35).toFixed(2);
          transformStr += ` perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }

        el.style.transform = transformStr;
      });
    };

    const req = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    const onScroll = () => {
      sy = window.scrollY;
      req();
    };

    const onMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mx = ((e.clientX - cx) / cx) * 28;
      my = ((e.clientY - cy) / cy) * 22;
      req();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });

    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, [isMobile]);

  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      <div className="hero-sky absolute inset-0" />

      <div ref={stars1} className="absolute inset-0">
        <Starfield count={50} maxSize={2} />
      </div>
      <div ref={stars2} className="absolute inset-0">
        <Starfield count={40} minSize={1.4} maxSize={3.4} />
      </div>

      <div ref={moon} className="moon absolute top-[9%] right-[8%]" />

      <div className="absolute top-1/2 right-[3%] hidden w-[min(46vw,640px)] -translate-y-1/2 max-md:top-auto max-md:right-[-12%] max-md:bottom-[8%] max-md:w-[74vw] max-md:translate-y-0 max-md:opacity-55 xl:block">
        <div ref={ship} className="origin-center">
          <div className="motion-safe:animate-float">
            <Image
              src={hero.shipImage}
              alt="Академия Странствий"
              height={350}
              width={500}
              priority
              fetchPriority="high"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      <div className="relative container mx-auto flex min-h-svh w-full flex-col items-center justify-center px-2 pt-20 pb-8 sm:px-4 sm:pt-24 sm:pb-12 lg:items-start lg:px-0">
        <div className="mx-auto mt-auto w-full max-w-[800px] text-center lg:mx-0 lg:max-w-[580px] lg:text-left">
          <div className="font-hand text-gold mb-3 text-xl leading-none font-semibold sm:mb-4 sm:text-2xl">
            {hero.eyebrow}
          </div>
          <h1 className="font-hand mb-6 text-[clamp(2.6rem,10vw,7.2rem)] leading-[0.85] font-bold tracking-[1px] [text-shadow:0_6px_40px_rgba(0,0,10,0.5)]">
            {hero.title[0]}
            <span className="text-gold-soft block">{hero.title[1]}</span>
          </h1>
          <p className="bg-background/10 text-muted-foreground/90 mx-auto max-w-[600px] rounded-2xl p-3 text-sm backdrop-blur-sm sm:p-4 sm:text-base lg:mx-0 lg:text-lg">
            <b className="text-foreground mr-2 text-sm font-semibold tracking-wide uppercase">
              Академия Странствий
            </b>
            {hero.description}
          </p>
        </div>

        <div className="mx-auto mt-auto grid w-full max-w-[800px] grid-cols-1 gap-4 pt-10 sm:gap-6 sm:pt-16 md:grid-cols-2 lg:mx-0 lg:max-w-[700px]">
          {hero.missions.map((m) => {
            const Icon = missionIcons[m.icon];
            return (
              <div
                key={m.title}
                className="group flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-500 sm:gap-5 sm:p-6 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                <span className="text-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-linear-to-br from-white/10 to-transparent shadow-inner sm:h-14 sm:w-14">
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
