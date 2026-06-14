import { Menu } from "lucide-react";

import { nav } from "@/lib/constants";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetDescription,
} from "@strannik/ui/components/sheet";
import { cn } from "@strannik/ui/lib/utils";

import Logo from "./logo";

export function Header() {
  return (
    <header className="bg-ink/80 border-border fixed inset-x-0 top-0 z-1 border-b p-2 backdrop-blur-3xl">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1.5 md:flex">
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
          <SheetTrigger className="md:hidden" asChild>
            <button
              className="border-border text-foreground grid h-11 w-11 place-items-center rounded-xl border"
              aria-label="Меню"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent className="flex flex-col px-4 sm:max-w-sm">
            <SheetHeader className="sr-only">
              <SheetTitle>Навигация</SheetTitle>
              <SheetDescription>Меню навигации по сайту</SheetDescription>
            </SheetHeader>

            <nav className="mt-12 flex flex-col gap-2">
              {nav.map((item) => (
                <SheetClose asChild key={item.href}>
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50 focus:bg-muted/50 focus:text-foreground rounded-md px-4 py-3 text-xl font-medium transition-all outline-none"
                  >
                    {item.label}
                  </a>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
