"use client";

import { Menu } from "lucide-react";

import { nav } from "@/lib/constants";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@strannik/ui/components/sheet";
import { cn } from "@strannik/ui/lib/utils";

import Logo from "./logo";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setScrolled((prev) => {
        const next = window.scrollY > 40;
        return next === prev ? prev : next;
      });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-60 border-b border-transparent transition-[background,backdrop-filter,padding,border-color] duration-400",
        scrolled ? "bg-ink/80 border-border py-3.5 backdrop-blur-xl" : "py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1.5 lg:flex">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2.5 text-[0.95rem] font-medium transition-colors",
                i === 0
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <button
              className="border-border text-foreground grid h-11 w-11 place-items-center rounded-xl border lg:hidden"
              aria-label="Меню"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex flex-col justify-center gap-2 px-8"
          >
            <SheetTitle className="sr-only">Навигация</SheetTitle>
            {nav.map((item) => (
              <SheetClose asChild key={item.href}>
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground rounded-lg px-2 py-3 text-2xl font-medium transition-colors"
                >
                  {item.label}
                </a>
              </SheetClose>
            ))}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
