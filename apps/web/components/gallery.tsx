"use client"

import * as React from "react"

import { gratitudes } from "@/lib/constants"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"

export function Gallery() {
  return (
    <div className="container mx-auto grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-10">
      {gratitudes.map((g, i) => (
        <div key={i}>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="group focus-visible:ring-gold relative block aspect-3/4 h-auto w-full cursor-pointer overflow-hidden p-0 transition-transform duration-400 hover:bg-transparent"
              >
                <Image
                  src={g.image}
                  alt={g.alt}
                  width={500}
                  height={666}
                  className="h-full w-full object-cover"
                />
                <span className="from-ink/85 absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent p-4 text-center text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Увеличить
                </span>
              </Button>
            </DialogTrigger>

            <DialogContent className="z-[100] flex max-h-[95svh] w-[95vw] max-w-4xl items-center justify-center border-none p-0">
              <DialogTitle className="sr-only">{g.alt}</DialogTitle>
              <Image
                src={g.image}
                alt={g.alt}
                width={1200}
                height={1600}
                className="h-full w-full object-contain p-4 md:p-10"
              />
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  )
}
