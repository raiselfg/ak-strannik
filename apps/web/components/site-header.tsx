"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { nav } from "@/lib/constants"

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import Image from "next/image"

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-60 border-b border-transparent transition-[background,backdrop-filter,padding,border-color] duration-400",
        scrolled ? "bg-ink/80 border-border py-3.5 backdrop-blur-xl" : "py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Brand />

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
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-foreground lg:hidden"
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
                  className="rounded-lg px-2 py-3 text-2xl font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </SheetClose>
            ))}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function Brand() {
  return (
    <a
      href="#"
      className="flex items-center gap-3"
      aria-label="Академия Странствий"
    >
      <Image
        src={"/images/logo.png"}
        alt="Академия странствий"
        width={48}
        height={48}
      />
      <span className="font-hand text-3xl leading-[0.95] font-bold">
        Академия
        <small className="mt-px block font-sans text-xs font-semibold tracking-[0.32em] text-muted-foreground uppercase">
          Странствий
        </small>
      </span>
    </a>
  )
}
